import CachingService from './CachingService';

const decimals = 1000000000000000000;

export default class ContractService {

    constructor(){}

    static reserve(context, reservation){
        const {name, publicKey} = reservation;

        return new Promise(async (resolve, reject) => {
            const bytes = string => context.w3.utils.fromAscii(string);
            const exit = ContractService.exiter(reject, 'ContractService.reserveUser()', context);
            const options = {from:context.mmaddr};

            const reservationArgs = [
                bytes(name.toLowerCase()),
                bytes(publicKey)
            ];

            const exists = await context.scatterContract.methods.exists(bytes(name.toLowerCase())).call().catch(exit);
            if(exists) exit("The name you have requested already exists!");
            context.popup.loading = true;

            const reservationPrice = await context.scatterContract.methods.reservationPrice().call().catch(exit);

            ContractService.allowEOS(context,reservationPrice,exit).then(async allowed => {
                if(!allowed) exit("You must approve the EOS allowance");

                await context.scatterContract.methods.reserve(...reservationArgs).send(options)
                    .on('transactionHash', async (hash) => {
                        reservation.trx = hash;

                        const cached = await CachingService.cacheNewReservationPrivateData(reservation);
                        resolve({trx:hash});
                    })
                    .on('error', error => {
                        console.error(error);
                        exit("Please try again. Check the console for a more in-depth error.");
                    });
            });

        })
    }

    static isSignatory(context){
        context.popup.loading = true;
        return new Promise(async (resolve, reject) => {
            const exit = ContractService.exiter(reject, 'ContractService.isSignatory()', context);
            const signatory = await context.scatterContract.methods.getSignatory().call().catch(exit);
            resolve(context.mmaddr === signatory);
        })
    }

    static bid(context, bid){
        context.popup.loading = true;
        return new Promise(async (resolve, reject) => {
            const bytes = string => context.w3.utils.fromAscii(string);
            const exit = ContractService.exiter(reject, 'ContractService.bid()', context);
            console.log('bid.price', bid.price);
            const options = {from:context.mmaddr, value:bid.price};

            const bidArgs = [
                Number(bid.reservationId),
                bytes(bid.publicKey)
            ];

            await context.scatterContract.methods.bid(...bidArgs).send(options)
                .on('transactionHash', async (hash) => {
                    bid.trx = hash;

                    const cached = await CachingService.bid(bid);

                    resolve({transactionHash:hash});
                })
                .on('error', error => {
                    console.error(error);
                    exit("Error posting bid. Check the console for a more in-depth error.");
                });

        })
    }

    static sell(context, reservation, bid){
        context.popup.loading = true;
        return new Promise(async (resolve, reject) => {
            const bytes = string => context.w3.utils.fromAscii(string);
            const exit = ContractService.exiter(reject, 'ContractService.sell()', context);
            const options = {from:context.mmaddr, gasLimit: "150000"};

            const canSell = await CachingService.sell(context.mmaddr, reservation.id);
            if(!canSell){
                exit('You can not sell this name right now.');
                return false;
            }

            context.scatterContract.methods.sell(reservation.id).send(options)
                .on('transactionHash', async (hash) => {
                    resolve({trx:hash});
                })
                .on('error', async error => {
                    const unsold = await CachingService.unsell(context.mmaddr, reservation.id);
                    exit(error);
                });
        })
    }

    static unbid(context, reservation, bid){
        context.popup.loading = true;
        return new Promise(async (resolve, reject) => {
            const bytes = string => context.w3.utils.fromAscii(string);
            const exit = ContractService.exiter(reject, 'ContractService.unbid()', context);
            const options = {from:context.mmaddr, gasLimit:"100000"};

            const canUnbid = await CachingService.unbid(context.mmaddr, reservation.id, bid.price);
            if(!canUnbid){
                resolve(false);
                return false;
            }

            context.scatterContract.methods.unBid(reservation.id).send(options).catch(async error => {
                const rebid = await CachingService.rebid(context.mmaddr, reservation.id);
                exit(error);
            }).then(unbid => {
                const {transactionHash} = unbid;
                resolve({transactionHash});
            })
        })
    }

    static exiter(reject, method, context){
        return error => {
            console.error('Ethereum Error - '+method);
            context.popup.loading = false;
            reject(error);
            throw new Error(error);
        }
    }

    static allowEOS(context, price, exit){
        return new Promise(async (resolve, reject) => {
            const saddr = process.env.SCATTER_CONTRACT_ADDRESS;
            const options = {from:context.mmaddr};

            const balance = await context.eosContract.methods.balanceOf(context.mmaddr).call().catch(exit);
            if(balance < price) exit(`Not enough EOS in account. Account needs ${price/decimals} EOS available.`);

            // Bypasses this step if there is already an allowance.
            const preAllowance = await context.eosContract.methods.allowance(context.mmaddr, saddr).call().catch(exit);
            if(preAllowance >= price) {
                resolve(true);
                return false;
            }

            let i = 0;
            const maxTimes = 60;
            const interval = 1000;
            const checkStatus = () => {
                setTimeout(async () => {
                    i++;
                    if(i > maxTimes){
                        exit('Still waiting for the transaction after 60 seconds. Try again in a few minutes, and it will bypass this step.');
                        resolve(false);
                        return false;
                    }

                    const allowance = await context.eosContract.methods.allowance(context.mmaddr, saddr).call().catch(() => exit('Could not fetch allowance. Try again in a few minutes.'));

                    console.log('alllow', allowance);

                    if(allowance < price) checkStatus();
                    else resolve(true);
                }, interval);
            };

            const approved = await context.eosContract.methods.approve(saddr, price).send(options)
                .on('transactionHash', async (hash) => {
                    checkStatus();
                })
                .on('error', error => {
                    console.error(error);
                    exit(`You must approve the contract's ability to transfer ${price/decimals} EOS to itself. Check the console logs for more information.`);
                });


        })
    }

    static totalReservations(context){
        return new Promise(async (resolve, reject) => {
            context.scatterContract.methods.currentId().call()
                .then(x => resolve(x))
                .catch(x => resolve(null));
        })
    }

}
import CachingService from './CachingService';

let decimals = 1000000000000000000;

export default class ContractService {

    constructor(){}

    static reserve(context, reservation){
        let {name, publicKey} = reservation;

        return new Promise(async (resolve, reject) => {
            let bytes = string => context.w3.utils.fromAscii(string);
            let exit = ContractService.exiter(reject, 'ContractService.reserveUser()', context);
            let options = {from:context.mmaddr};

            let reservationArgs = [
                bytes(name.toLowerCase()),
                bytes(publicKey)
            ];

            let exists = await context.scatterContract.methods.exists(bytes(name.toLowerCase())).call().catch(exit);
            if(exists) exit("The name you have requested already exists!");
            context.popup.loading = true;

            let reservationPrice = await context.scatterContract.methods.reservationPrice().call().catch(exit);

            ContractService.allowEOS(context,reservationPrice,exit).then(async allowed => {
                if(!allowed) exit("You must approve the EOS allowance");

                await context.scatterContract.methods.reserve(...reservationArgs).send(options)
                    .on('transactionHash', async (hash) => {
                        reservation.trx = hash;

                        let cached = await CachingService.cacheNewReservationPrivateData(reservation);
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
            let exit = ContractService.exiter(reject, 'ContractService.isSignatory()', context);
            let signatory = await context.scatterContract.methods.getSignatory().call().catch(exit);
            resolve(context.mmaddr === signatory);
        })
    }

    static bid(context, bid){
        context.popup.loading = true;
        return new Promise(async (resolve, reject) => {
            let bytes = string => context.w3.utils.fromAscii(string);
            let exit = ContractService.exiter(reject, 'ContractService.bid()', context);
            let options = {from:context.mmaddr, value:bid.price};

            let bidArgs = [
                Number(bid.reservationId),
                bytes(bid.publicKey)
            ];

            await context.scatterContract.methods.bid(...bidArgs).send(options)
                .on('transactionHash', async (hash) => {
                    bid.trx = hash;

                    let cached = await CachingService.bid(bid);

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
            let bytes = string => context.w3.utils.fromAscii(string);
            let exit = ContractService.exiter(reject, 'ContractService.sell()', context);
            let options = {from:context.mmaddr, gasLimit: "200000"};

            let canSell = await CachingService.sell(context.mmaddr, reservation.id);
            if(!canSell){
                exit('You can not sell this name right now.');
                return false;
            }

            context.scatterContract.methods.sell(reservation.id).send(options)
                .on('transactionHash', async (hash) => {
                    resolve({trx:hash});
                })
                .on('error', async error => {
                    let unsold = await CachingService.unsell(context.mmaddr, reservation.id);
                    exit(error);
                });
        })
    }

    static unbid(context, reservation, bid){
        context.popup.loading = true;
        return new Promise(async (resolve, reject) => {
            let bytes = string => context.w3.utils.fromAscii(string);
            let exit = ContractService.exiter(reject, 'ContractService.unbid()', context);
            let options = {from:context.mmaddr, gasLimit:"100000"};

            let canUnbid = await CachingService.unbid(context.mmaddr, reservation.id, bid.price);
            if(!canUnbid){
                resolve(false);
                return false;
            }

            context.scatterContract.methods.unBid(reservation.id).send(options).catch(async error => {
                let rebid = await CachingService.rebid(context.mmaddr, reservation.id);
                exit(error);
            }).then(unbid => {
                let {transactionHash} = unbid;
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
            let saddr = process.env.SCATTER_CONTRACT_ADDRESS;
            let options = {from:context.mmaddr};

            let balance = await context.eosContract.methods.balanceOf(context.mmaddr).call().catch(exit);
            if(balance < price) exit(`Not enough EOS in account. Account needs ${price/decimals} EOS available.`);

            // Bypasses this step if there is already an allowance.
            let preAllowance = await context.eosContract.methods.allowance(context.mmaddr, saddr).call().catch(exit);
            if(preAllowance >= price) {
                resolve(true);
                return false;
            }

            let i = 0;
            let maxTimes = 60;
            let interval = 1000;
            let checkStatus = () => {
                setTimeout(async () => {
                    i++;
                    if(i > maxTimes){
                        exit('Still waiting for the transaction after 60 seconds. Try again in a few minutes, and it will bypass this step.');
                        resolve(false);
                        return false;
                    }

                    let allowance = await context.eosContract.methods.allowance(context.mmaddr, saddr).call().catch(() => exit('Could not fetch allowance. Try again in a few minutes.'));
                    if(allowance < price) checkStatus();
                    else resolve(true);
                }, interval);
            };

            let checkingStatus = false;
            let approved = await context.eosContract.methods.approve(saddr, price).send(options)
                .on('transactionHash', async (hash) => {
                    checkingStatus = true;
                    checkStatus();
                })
                .on('error', error => {
                    if(!checkingStatus) {
                        console.error(error);
                        exit(`You must approve the contract's ability to transfer ${price / decimals} EOS to itself. Check the console logs for more information.`);
                    }
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
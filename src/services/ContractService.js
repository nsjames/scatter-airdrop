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

                const reserved = await context.scatterContract.methods.reserve(...reservationArgs).send(options).catch(error => {
                    exit("Please try again.")
                });

                const {reservationId} = reserved.events.EmitReservation.returnValues;
                reservation.id = reservationId;

                const {transactionHash} = reserved;
                reservation.trx = transactionHash;

                const cached = await CachingService.cacheNewReservationPrivateData(reservation);
                resolve({reservationId, transactionHash});
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

    static setDappDecision(context, reservationId, accepted){
        context.popup.loading = true;
        return new Promise(async (resolve, reject) => {
            const exit = ContractService.exiter(reject, 'ContractService.setDappDecision()', context);
            const options = {from:context.mmaddr};
            const decided = await context.scatterContract.methods.dappDecision(reservationId, accepted).send(options).catch(exit);
            const {transactionHash} = decided;
            resolve({transactionHash});
        })
    }

    static bid(context, bid){
        context.popup.loading = true;
        return new Promise(async (resolve, reject) => {
            const bytes = string => context.w3.utils.fromAscii(string);
            const exit = ContractService.exiter(reject, 'ContractService.bid()', context);
            const options = {from:context.mmaddr, value:bid.price};

            const bidArgs = [
                Number(bid.reservationId),
                bytes(bid.publicKey)
            ];

            const postedBid = await context.scatterContract.methods.bid(...bidArgs).send(options).catch(exit);
            const {transactionHash} = postedBid;
            bid.trx = transactionHash;

            const cached = await CachingService.bid(bid);

            resolve({transactionHash});
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
                resolve(false);
                return false;
            }

            context.scatterContract.methods.sell(reservation.id).send(options).catch(async error => {
                console.log('error', error);
                const unsold = await CachingService.unsell(context.mmaddr, reservation.id);
                exit(error);
            }).then(sold => {
                const {transactionHash} = sold;
                resolve({transactionHash});
            })
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

            const approved = await context.eosContract.methods.approve(saddr, price).send(options)
                .catch(() => exit(`You must approve the contract's ability to transfer ${price/decimals} EOS to itself.`));
            const allowance = await context.eosContract.methods.allowance(context.mmaddr, saddr).call()
                .catch(() => exit('Contract does not have ample EOS allowance.'));

            resolve(allowance >= price);
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
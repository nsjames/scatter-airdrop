import CachingService from './CachingService';

const decimals = 1000000000000000000;
const registrationPrice = process.env.RESERVATION_PRICE;

export default class ContractService {

    constructor(){}

    static reserveUser(context, reservation){
        const {name, publicKey} = reservation;

        return new Promise(async (resolve, reject) => {
            const bytes = string => context.w3.utils.fromAscii(string);
            const exit = ContractService.exiter(reject, 'ContractService.reserveUser()');
            const options = {from:context.mmaddr};

            const reservationArgs = [
                bytes(name.toLowerCase()),
                bytes(publicKey)
            ];

            const exists = await context.scatterContract.methods.exists(bytes(name.toLowerCase())).call().catch(exit);
            if(exists) exit("Name exists");

            ContractService.allowEOS(context,registrationPrice,exit).then(async allowed => {
                if(!allowed) exit("Must approve EOS allowance");

                const reserved = await context.scatterContract.methods.reserveUser(...reservationArgs).send(options).catch(exit);
                const {reservationId} = reserved.events.EmitReservation.returnValues;
                reservation.id = reservationId;

                const {transactionHash} = reserved;
                reservation.trx = transactionHash;

                const cached = await CachingService.cacheNewReservationPrivateData(reservation);

                console.log(reservationId);

                resolve({reservationId, transactionHash});
            });

        })
    }

    static reserveDapp(context, reservation){
        return new Promise(async (resolve, reject) => {
            resolve({reservationId:-1,transactionHash:'1234'});
        })
    }

    static bid(context, bid){
        return new Promise(async (resolve, reject) => {
            const bytes = string => context.w3.utils.fromAscii(string);
            const exit = ContractService.exiter(reject, 'ContractService.bid()');
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
        return new Promise(async (resolve, reject) => {
            const bytes = string => context.w3.utils.fromAscii(string);
            const exit = ContractService.exiter(reject, 'ContractService.sell()');
            const options = {from:context.mmaddr, gasLimit: "150000"};

            const canSell = await CachingService.sell(context.mmaddr, reservation.id);
            console.log('canSell', canSell);
            if(!canSell){
                resolve(false);
                return false;
            }

            context.scatterContract.methods.sell(reservation.id).send(options).catch(async error => {
                const unsold = await CachingService.unsell(context.mmaddr, reservation.id);
                exit(error);
            }).then(sold => {
                const {transactionHash} = sold;
                resolve({transactionHash});
            })
        })
    }

    static exiter(reject, method){
        return error => {
            console.error('Ethereum Error - '+method);
            reject(error);
            throw new Error(error)
        }
    }

    static allowEOS(context, price, exit){
        return new Promise(async (resolve, reject) => {
            //TODO: Disabled for testing
            resolve(true);

            // const saddr = process.env.SCATTER_CONTRACT_ADDRESS;
            // const options = {from:context.mmaddr};
            //
            // const approved = await context.eosContract.methods.approve(saddr, price).send(options).catch(exit);
            // const allowance = await context.eosContract.methods.allowance(context.mmaddr, saddr).call(options).catch(exit);
            // resolve(allowance >= price);
        })
    }

}
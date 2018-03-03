import CachingService from './CachingService';

export default class ContractService {

    constructor(){}

    static reserveUser(context, reservation){
        const {name, publicKey} = reservation;

        return new Promise(async (resolve, reject) => {
            const bytes = string => context.w3.utils.fromAscii(string);
            const exit = ContractService.exiter(reject, 'ContractService.reserveUser()');
            const options = {from:context.mmaddr};

            //TODO: Test data
            // name = 'hello2';
            // publicKey = 'EOS6Li9tCwRJtsNtPz7tt5dMs3XaQpQLpHPsAvTJ8sVmyuq6Ubhvc';

            const reservationArgs = [
                bytes(name),
                bytes(publicKey)
            ];

            const exists = await context.scatterContract.methods.exists(bytes(name)).call().catch(exit);
            if(exists) exit("Name exists");
            console.log(exists);

            ContractService.allowEOS(context,process.env.RESERVATION_PRICE,exit).then(async allowed => {
                if(!allowed) exit("Must approve EOS allowance");

                const reserved = await context.scatterContract.methods.reserveUser(...reservationArgs).send(options).catch(exit);
                const {reservationId} = reserved.events.EmitReservation.returnValues;
                reservation.id = reservationId;

                const {transactionHash} = reserved;
                reservation.trx = transactionHash;

                const genetics = await context.scatterContract.methods.genetics(reservationId).call().catch(exit);
                reservation.genetics = genetics;

                const cached = await CachingService.cacheNewReservation(reservation);

                resolve({reservationId, transactionHash, genetics});
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
            const options = {from:context.mmaddr};

            const bidArgs = [
                Number(bid.reservationId),
                bid.price,
                bytes(bid.publicKey)
            ];

            console.log(bidArgs);

            ContractService.allowEOS(context,bid.price,exit).then(async allowed => {
                if(!allowed) exit("Must approve EOS allowance");

                const postedBid = await context.scatterContract.methods.bid(...bidArgs).send(options).catch(exit);
                const {transactionHash} = postedBid;
                bid.trx = transactionHash;

                const cached = await CachingService.bid(bid);

                resolve({transactionHash});
            });



            resolve(true);
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

    static exists(context, name){

    }

}
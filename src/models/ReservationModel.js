export const RESERVATION_TYPES = {
    USER:'User',
    DAPP:'Dapp'
};

export default class ReservationModel {

    constructor(_type = '', _name = '', _publicKey = '', _genetics = ''){
        this.type = _type;
        this.name = _name;
        this.publicKey = _publicKey;
        this.genetics = _genetics;
        this.email = '';
        this.id = -1;

        this.topPrice = 0;
        this.openBids = 0;
        this.lastSoldFor = 0;
        this.eth = '';
        this.trx = '';
        this.locked = null;
        this.biddable = true;
    }

    static fromJson(json){ return Object.assign(new ReservationModel(), json) }
    isLocked(){ return this.locked !== null && (+new Date() < (this.locked + (6*60*60*1000))); }

    static user(...args){ return new ReservationModel(RESERVATION_TYPES.USER, ...args)}
    static dapp(...args){ return new ReservationModel(RESERVATION_TYPES.DAPP, ...args)}

    changeType(_type){
        this.type = _type;
    }

    changeBiddable(biddable){
        this.biddable = biddable;
    }

}
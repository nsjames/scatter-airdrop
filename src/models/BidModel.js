export const BID_STATE = {
    TOP:'top',
    BEAT:'beat',
    SOLD:'sold',
    UNBID:'unbid'
};

export default class BidModel {

    constructor(_reservationId = -1, _publicKey = '', _price = -1){
        this.reservationId = _reservationId;
        this.publicKey = _publicKey;
        this.price = _price;
        this.timestamp = +new Date();
        this.state = BID_STATE.TOP;
        this.eth = '';
        this.trx = '';
    }

    static fromJson(json){ return Object.assign(new BidModel(), json) }
}
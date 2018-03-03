export const POPUP_TYPES = {
    GENERATE_KEY_PAIR:'gkp',
    CONFIRM_NEW_RESERVATION:'cnr',
    BID:'bid'
};

export default class PopupModel {

    constructor(_type = '', _data = {}, _resolver = () => {}){
        this.type = _type;
        this.data = _data;
        this.resolve = _resolver;
        this.loading = false;
    }

    static generateKeyPair(_resolver){
        return new PopupModel(
            POPUP_TYPES.GENERATE_KEY_PAIR,
            {},
            _resolver
        )
    }

    static confirmNewReservation(newReservation, _resolver){
        return new PopupModel(
            POPUP_TYPES.CONFIRM_NEW_RESERVATION,
            newReservation,
            _resolver
        )
    }

    static bid(reservation, highestBidEthereumKey, _resolver){
        return new PopupModel(
            POPUP_TYPES.BID,
            Object.assign(reservation, {highestBidEthereumKey}),
            _resolver
        )
    }

}
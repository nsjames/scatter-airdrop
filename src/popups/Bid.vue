<template>
    <section>

        <section class="kv">
            <figure class="key">OUT</figure>
            <figure class="value">BID</figure>
        </section>

        <h1>{{popup.data.name}}</h1>


        <section class="kv">
            <figure class="key">You have to beat</figure>
            <figure class="value open-sans">{{popup.data.topPrice}} EOS</figure>
        </section>

        <!--<section class="kv">-->
            <!--<figure class="key">PUBLIC KEY</figure>-->
            <!--<figure class="value">{{newReservation.publicKey.substr(0,6)}}......{{newReservation.publicKey.slice(-5)}}</figure>-->
        <!--</section>-->

        <!--<br>-->
        <!--<br>-->

        <section class="action">
            <!--<p>-->
                <!--<b v-if="newReservation.type === reservationTypes.USER">Get notifications about bids</b>-->
                <!--<b v-if="newReservation.type === reservationTypes.DAPP">-->
                    <!--You will need to prove ownership of this name. If you can not prove ownership you will lose both the reservation and-->
                    <!--the payment for the reservation.-->
                <!--</b>-->
                <!--<br>-->
                <!--<i class="fa fa-arrow-down"></i>-->
                <!--<br>-->
                <!--<br>-->
            <!--</p>-->
            <section class="input-container">
                <input placeholder="Enter your bid" v-model.number="price" />
            </section>
            <section class="input-container">
                <input placeholder="Enter an EOS Public Key" v-model="publicKey" />
            </section>

            <rounded-button big="Bid With MetaMask" small="This would be easier with Scatter." @click.native="submitBid"></rounded-button>
            <p style="margin-top:10px;">
                <b>You will always be able to retract this bid in <span class="open-sans">48</span> hours.</b>
            </p>
        </section>


    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'

    import Snackbar from '../models/SnackbarModel'
    import BidModel from '../models/BidModel'
    import ContractService from '../services/ContractService'

    import ecc from 'eosjs-ecc';

    export default {
        data(){ return {
            price:0,
            publicKey:''
        }},
        mounted(){

        },
        computed: {
            ...mapGetters([
                'newReservation',
                'eosContract',
                'scatterContract',
                'mmaddr'
            ]),
            ...mapState([
                'popup',
                'w3'
            ])
        },
        methods: {
            submitBid(){
                console.log('bidding: ', this.price)
                if(this.price <= this.popup.data.lastSoldFor){
                    this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        You can not bid less than the last price this name was sold for.
                    `));
                    return false;
                }

                if(this.price <= this.popup.data.topPrice){
                    this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        You can not bid less than the last highest bid.
                    `));
                    return false;
                }

                if(!ecc.isValidPublic(this.publicKey)){
                    this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        The EOS Public Key you entered is invalid.
                    `));
                    return false;
                }

                if(this.publicKey === this.popup.data.publicKey){
                    this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        You can not bid on your own reservations.
                    `));
                    return false;
                }

                if(this.w3.defaultAccount === this.popup.data.eth){
                    this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        You can not bid on your own reservations.
                    `));
                    return false;
                }

                if(this.w3.defaultAccount === this.popup.data.highestBidEthereumKey){
                    this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        You already have the top bid.
                    `));
                    return false;
                }

                const bid = BidModel.fromJson({
                    reservationId:this.popup.data.id,
                    publicKey:this.publicKey,
                    price:this.price,
                    eth:this.w3.defaultAccount
                });

                ContractService.bid(this, bid).then(res => {
                    console.log('res', res);
                })

            },
            ...mapActions([
                Actions.SET_POPUP,
                Actions.PUSH_SNACKBAR
            ])
        }
    }
</script>

<style lang="scss">

</style>
<template>
    <section>

        <section v-if="!trx">
            <h1>{{sellingReservation.name}}</h1>


            <section class="kv">
                <figure class="key">SELLING</figure>
                <figure class="value" style="text-transform:uppercase;">IDENTITY</figure>
            </section>
            <br>
            <br>
            <p>
                You are about to sell this reservation for <b>{{sellingBid.price | price}} ETH</b><br>
                You stand to make around <b>{{sellingBid.price - (sellingBid.price/10) | price}} ETH</b>.<br><br>
                <b style="color:#fff;">Are you sure?</b>
            </p>

            <br>
            <br>

            <section class="action">
                <rounded-button big="Sell Reservation" @click.native="sellReservation"></rounded-button>
                <p style="margin-top:10px;">
                    <b>Selling a reservation costs 10% of the bid price. Take that into account.</b>
                </p>
            </section>
        </section>

        <section v-else>
            <h1>Name Sold!</h1>

            <p>
                <b>Transaction Hash: <a target="_blank" :href="'https://etherscan.io/tx/'+trx"><u>{{trx}}</u></a></b>
                <br><br>
                This does not mean your transaction has gone through. You can click on the hash above to track it.
            </p>

            <section class="action">
                <rounded-button big="Close" @click.native="close"></rounded-button>
            </section>
        </section>

    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'
    import ReservationModel from '../models/ReservationModel';
    import {RESERVATION_TYPES} from '../models/ReservationModel';
    import ecc from 'eosjs-ecc'
    import Snackbar from '../models/SnackbarModel'
    import ContractService from '../services/ContractService'
    import {validEmail} from '../util/email';

    export default {
        data(){ return {
            reservationTypes:RESERVATION_TYPES,
            trx:'',
        }},
        mounted(){

        },
        computed: {
            ...mapGetters([
                'sellingReservation',
                'sellingBid',
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
            sellReservation(){
                ContractService.sell(this, this.sellingReservation, this.sellingBid).then(sold => {
                    this.popup.loading = false;
                    if(sold && sold.hasOwnProperty('trx')){
                        this.trx = sold.trx;
                        this.popup.resolve(true);
                    } else {
                        this.popup.resolve(false);
                    }
                })
            },
            close(){
                this[Actions.SET_POPUP](null);
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
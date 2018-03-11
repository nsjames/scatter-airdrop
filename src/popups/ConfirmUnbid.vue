<template>
    <section>

        <h1>{{sellingReservation.name}}</h1>


        <section class="kv">
            <figure class="key">RETRACTING</figure>
            <figure class="value" style="text-transform:uppercase;">BID</figure>
        </section>
        <br>
        <br>
        <p>
            You are about to retract your bid and take back your {{sellingBid.price | price}} ETH.
            <br><br>
            <b style="color:#fff;">Are you sure?</b>
        </p>

        <br>
        <br>

        <section class="action">
            <rounded-button big="Retract Bid" @click.native="retractBid"></rounded-button>
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
            retractBid(){
                ContractService.unbid(this, this.sellingReservation, this.sellingBid).then(sold => {
                    if(sold && sold.hasOwnProperty('transactionHash')){
                        this.popup.resolve(true);
                        this[Actions.SET_POPUP](null);
                    } else {
                        this.popup.resolve(false);
                    }
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
    .copier {
        position:absolute;
        top:-9999px;
    }

</style>
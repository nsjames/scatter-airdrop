<template>
    <section>

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


        <!-- INPUT FIELD USED FOR COPYING -->
        <input tabindex="-1" type="text" ref="copier" class="copier" />
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
            sellReservation(){
                ContractService.sell(this, this.sellingReservation, this.sellingBid).then(sold => {
                    if(sold && sold.hasOwnProperty('transactionHash')){
                        this.popup.resolve(true);
                        this[Actions.SET_POPUP](null);
                    } else {
                        this.popup.resolve(false);
                    }
                })

//                if((this.sellingReservation.type === RESERVATION_TYPES.DAPP || this.sellingReservation.email.trim().length) && !validEmail(this.sellingReservation.email)){
//                    this[Actions.PUSH_SNACKBAR](new Snackbar(
//                        this.sellingReservation.email.trim().length ? `The email you entered is invalid.` : `You must provide an email for verification.`
//                    ));
//                    return false;
//                }
//
//                const finish = result => {
//                    this.popup.loading = false;
//                    console.log('result', result);
//                    if(result && result.hasOwnProperty('reservationId') && result.reservationId > 0){
//                        this[Actions.SET_POPUP](null);
//                        this[Actions.PUSH_SNACKBAR](new Snackbar(
//                            `Your name has been reserved!`
//                        ));
//                    } else {
//                        this[Actions.PUSH_SNACKBAR](new Snackbar(
//                            `There was an error with this reservation: ${result}`
//                        ));
//                    }
//                };
//
//                this.sellingReservation.eth = this.w3.defaultAccount;
//
//                ContractService.reserve(this, this.sellingReservation)
//                    .then(finish).catch(finish);

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
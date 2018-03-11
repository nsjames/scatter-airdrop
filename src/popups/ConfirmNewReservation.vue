<template>
    <section>

        <h1>{{newReservation.name}}</h1>


        <section class="kv">
            <figure class="key">RESERVING</figure>
            <figure class="value" style="text-transform:uppercase;">IDENTITY</figure>
        </section>

        <section class="kv">
            <figure class="key">PUBLIC KEY</figure>
            <figure class="value">{{newReservation.publicKey.substr(0,6)}}......{{newReservation.publicKey.slice(-5)}}</figure>
        </section>

        <br><br>

        <p>
            You will get <b>two</b> MetaMask prompts. The first one will be sent to the EOS ERC20 contract and will approve
            the Scatter Reservation contract's ability to move 1 EOS token. The second will be sent to the Scatter Reservation
            contract and will reserve your name.
        </p>

        <br>
        <br>

        <section class="action">
            <p>
                <b>Get notifications about bids</b>
                <br>
                <i class="fa fa-arrow-down"></i>
                <br>
                <br>
            </p>
            <section class="input-container">
                <input placeholder="Enter Your Email ( optional )" v-model="newReservation.email" />
            </section>

            <rounded-button big="Pay With MetaMask" small="The irony, we know." @click.native="submitReservation"></rounded-button>
            <p style="margin-top:10px;">
                <b>All new reservations cost <span class="open-sans">1</span> EOS.</b>
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
            submitReservation(){

                if((this.newReservation.type === RESERVATION_TYPES.DAPP || this.newReservation.email.trim().length) && !validEmail(this.newReservation.email)){
                    this[Actions.PUSH_SNACKBAR](new Snackbar(
                        this.newReservation.email.trim().length ? `The email you entered is invalid.` : `You must provide an email for verification.`
                    ));
                    return false;
                }

                const finish = result => {
                    this.popup.loading = false;
                    console.log('result', result);
                    if(result && result.hasOwnProperty('reservationId') && result.reservationId > 0){
                        this[Actions.SET_POPUP](null);
                        this[Actions.PUSH_SNACKBAR](new Snackbar(
                            `Your name has been reserved!`
                        ));
                    } else {
                        this[Actions.PUSH_SNACKBAR](new Snackbar(
                            `There was an error with this reservation: ${result}`
                        ));
                    }
                };

                this.newReservation.eth = this.w3.defaultAccount;

                ContractService.reserve(this, this.newReservation)
                    .then(finish).catch(finish);

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
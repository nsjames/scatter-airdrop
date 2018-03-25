<template>
    <section>

        <section v-if="!submitted">
            <section class="kv">
                <figure class="key">OUT</figure>
                <figure class="value">BID</figure>
            </section>

            <h1>{{popup.data.name}}</h1>

            <section class="kv">
                <figure class="key">You have to beat</figure>
                <figure class="value open-sans">{{popup.data.topPrice | price}} ETH</figure>
            </section>

            <section class="action">
                <section class="input-container">
                    <input placeholder="Enter your bid" type="number" step="1" min="0" v-model.number="price" />
                </section>
                <section class="input-container">
                    <input placeholder="Enter an EOS Public Key" v-model="publicKey" />
                    <!--<circle-button icon="fa-plus-circle" @click.native="popupGenerateKeyPair"></circle-button>-->
                </section>
                <section class="input-container">
                    <input placeholder="Email Notifications?" v-model="email" />
                </section>

                <rounded-button big="Bid With MetaMask" small="This would be easier with Scatter." @click.native="submitBid"></rounded-button>
                <p style="margin-top:10px;">
                    <b>You will always be able to retract this bid in <span class="open-sans">48</span> hours.</b>
                </p>
            </section>
        </section>

        <section v-else>
            <section class="kv">
                <figure class="key">BID</figure>
                <figure class="value">SUBMITTED</figure>
            </section>
            <h1>Congratulations!</h1>
            <br><br>
            <p>
                Your bid has been submitted and is awaiting processing.
            </p>

            <section class="kv">
                <figure class="key">Transaction Hash</figure>
                <figure class="value open-sans">{{trx}}</figure>
            </section>

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

    import Snackbar from '../models/SnackbarModel'
    import BidModel from '../models/BidModel'
    import ContractService from '../services/ContractService'
    import {validEmail} from '../util/email';

    import ecc from 'eosjs-ecc';

    export default {
        data(){ return {
            price:0,
            publicKey:'',
            email:'',
            submitted:false,
            trx:'',
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
                const bytes = string => this.w3.utils.fromAscii(string);
                const price = this.price * 1000000000000000000;
                console.log('price', price);

                if(this.price < 0.01){
                    this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        You can not bid less than 0.01 ETH.
                    `));
                    return false;
                }

                if(price <= this.popup.data.lastSoldFor){
                    this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        You can not bid less than the last price this name was sold for.
                    `));
                    return false;
                }

                if(price <= this.popup.data.topPrice){
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

                if(bytes(this.publicKey) === this.popup.data.publicKey){
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

                if(this.email.length && !validEmail(this.email)){
                    this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        The email you entered is invalid.
                    `));
                    return false;
                }

                const bid = BidModel.fromJson({
                    reservationId:this.popup.data.id,
                    publicKey:this.publicKey,
                    price,
                    eth:this.w3.defaultAccount
                });

                bid.email = this.email;

                const finish = result => {
                    this.popup.loading = false;
                    if(result && result.hasOwnProperty('transactionHash')){
                        this.submitted = true;
                        this.trx = result.transactionHash;
//                        this[Actions.SET_POPUP](null);
//                        this[Actions.PUSH_SNACKBAR](new Snackbar(
//                            `Your bid has been submitted!`
//                        ));
                    }
                };

                ContractService.bid(this, bid).then(finish).catch(finish)

            },
            close(){
                this[Actions.SET_POPUP](null);
            },
            ...mapActions([
                Actions.SET_POPUP,
                Actions.PUSH_SNACKBAR
            ])
        },
        watch:{
            price(a,b){
                if(this.price < 0.01) this.price = 0.01;
                if(this.price.toString().indexOf('.') > -1){
                    if(this.price.toString().split('.')[1].length > 2){
                        this.price = this.price.toFixed(2);
                    }
                }
            }
        }
    }
</script>

<style lang="scss">

</style>
<template>
    <section>
        <section class="list-item" :class="{'open':open, 'sold':disabled}" @click="opened">

            <!-- RESERVATION ITEM -->
            <section class="container" v-if="reservation">

                <!-- NAME -->
                <section class="name-container">
                    <figure class="name" :class="{'private':!isBiddable(reservation)}">{{reservation.name}}</figure>
                    <figure class="modifiers" :class="{'full':reservation.genetics.length ===5}">
                        <modifier :text="gene" v-for="(gene, i) in reservation.genetics" :key="i"></modifier>
                    </figure>
                </section>

                <!-- BID INFO -->
                <section class="bid-info">
                    <section class="kv">
                        <figure class="key">{{reservation.topPrice | price}}</figure>
                        <figure class="value">ETH</figure>
                    </section>
                    <section class="kv">
                        <figure class="key">{{reservation.openBids}}</figure>
                        <figure class="value">BIDS</figure>
                    </section>
                    <section class="kv">
                        <figure class="key">RESERVED</figure>
                        <figure class="value open-sans" style="text-transform: uppercase">
                            {{reservation.timestamp/1000 | moment("from", "now")}}
                        </figure>
                    </section>
                </section>

                <!-- BID ACTIONS -->
                <section class="actions">
                    <action-button text="ID" @click.native="viewIdentity"></action-button>
                    <action-button v-if="!isOwner()" text="BID" :active="open"></action-button>
                </section>

            </section>

            <!-- BID ITEM -->
            <section class="container" v-if="bid">

                <!-- NAME -->
                <section class="name-container">
                    <figure class="name"><span class="open-sans">{{bid.price | price}}</span> <b>ETH</b></figure>
                </section>

                <!-- BID INFO -->
                <section class="bid-info">
                    <section class="kv" style="color:#fff;">
                        <figure class="key">{{bid.reservation.name}}</figure>
                    </section>
                </section>

                <!-- BID ACTIONS -->
                <section class="actions">
                    <action-button v-if="bid.state !== bidStates.UNBID && twoDaysSince(bid)" text="UNBID" @click.native="submitUnBid(bid)"></action-button>
                    <action-button text="VIEW" @click.native="viewReservation"></action-button>
                </section>

            </section>
        </section>

        <!-- BIDS DROPDOWN -->
        <section class="bids" v-if="open">

            <section v-if="fetched">
                <section class="no-bids" v-if="!bids.length">
                    <h1>There are no bids yet</h1>
                    <p>
                        This Reservation does not have any bids yet.
                    </p>
                    <figure class="cta" v-if="!isOwner()">
                        <rounded-button big="Place a Bid" @click.native="submitBid"></rounded-button>
                    </figure>
                </section>

                <section v-else>
                    <section class="bid" :class="{'red':b.state === bidStates.UNBID}" v-for="(b, index) in bids">
                        <!-- NAME -->
                        <section class="name-container">
                            <figure class="name">
                                <span class="open-sans">{{b.price | price}}</span> <b>ETH</b>
                                <span v-if="b.state === bidStates.UNBID">( RETRACTED )</span>
                            </figure>
                        </section>

                        <!-- BID INFO -->
                        <section class="bid-info">
                            <section class="kv">
                                <figure class="key">POSTED</figure>
                                <figure class="value open-sans" style="text-transform: uppercase">{{b.timestamp/1000 | moment("from", "now")}}</figure>
                            </section>
                        </section>

                        <!-- BID ACTIONS -->
                        <section v-if="index === 0">
                            <section class="actions" v-if="!isOwner() && !isBidOwner(b)">
                                <action-button text="OUTBID" @click.native="submitBid"></action-button>
                            </section>
                            <section class="actions" v-if="!isOwner() && isBidOwner(b)">
                                <action-button v-if="b.state !== bidStates.UNBID && twoDaysSince(b) && b.trx !== reservation.trx" text="UNBID" @click.native="submitUnBid(b)"></action-button>
                                <action-button v-if="b.state === bidStates.UNBID" text="OUTBID" @click.native="submitBid"></action-button>
                            </section>
                            <section class="actions" v-if="isOwner()">
                                <action-button v-if="b.state !== bidStates.UNBID && !disabled && b.trx !== reservation.trx" text="SELL" @click.native="submitSale(b)"></action-button>
                            </section>
                        </section>
                    </section>
                </section>
            </section>

        </section>
    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'

    import PopupModel from '../models/PopupModel'
    import BidModel from '../models/BidModel'
    import {BID_STATE} from '../models/BidModel'
    import CachingService from '../services/CachingService'
    import ContractService from '../services/ContractService'
    import {RESERVATION_TYPES} from '../models/ReservationModel';
    import Snackbar from '../models/SnackbarModel';

    export default {
        data(){ return {
            bidStates:BID_STATE,
            reservationTypes:RESERVATION_TYPES,
            fetched:false,
            bids:[],
            binaryImage:null,
            bidTimeout:null,
        }},
        computed: {
            ...mapGetters([
                'ethAddress',
                'mmaddr',
                'scatterContract',
                'onMainNet'
            ]),
            ...mapState([
                'w3'
            ])
        },
        mounted(){
            setTimeout(() => {
                if(this.injectedBids) {
                    this.bids = this.injectedBids;
                    this.fetched = true;
                }
            }, 10)
        },
        methods: {
            viewIdentity(){
                this.$router.push('/identity/'+this.reservation.name)
            },
            opened(){
                this.$emit('opened');
            },
            isOwner(){
                return this.reservation.eth === this.ethAddress;
            },
            isBidOwner(bid){
                return bid.eth === this.ethAddress;
            },
            noMetaMask(){
                if(!this.w3) this[Actions.PUSH_SNACKBAR](new Snackbar(`
                    You must have MetaMask installed and open to be able to participate in this auction.
                `));
                else this[Actions.PUSH_SNACKBAR](new Snackbar(`
                    MetaMask is not on the right network. You must be on the 'Main Network'.
                `));
            },
            submitBid(){
                if(!this.w3 || !this.onMainNet){ this.noMetaMask(); return false; }
                if(this.disabled) return false;
                const highestBidEthereumKey = this.bids.length ? this.bids[0].state === BID_STATE.UNBID ? '' : this.bids[0].eth : '';
                this[Actions.SET_POPUP](PopupModel.bid(this.reservation, highestBidEthereumKey), res => {
                    this.opened();
                });
            },
            submitUnBid(bid){
                if(!this.w3 || !this.onMainNet){ this.noMetaMask(); return false; }
                if(this.disabled) return false;
                this[Actions.SET_POPUP](PopupModel.confirmUnbid(this.reservation, bid), res => {
                    if(res) this.opened();
                    else this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        An error occured while retracting this bid. This could be due to the reservation being primed for sale.
                    `));
                });
            },
            submitSale(bid){
                if(!this.w3 || !this.onMainNet){ this.noMetaMask(); return false; }
                if(this.disabled) return false;
                this[Actions.SET_POPUP](PopupModel.confirmSale(this.reservation, bid, sold => {
                    if(sold) this.$emit('sold');
                }));

            },
            viewReservation(){
                if(this.disabled) return false;
                this[Actions.SET_SEARCH_TERMS](this.bid.reservation.name);

                window.scrollBy({
                    top: document.getElementById('searchbar').getBoundingClientRect().top-50,
                    behavior: "smooth"
                });
            },
            loadBids(){
                clearTimeout(this.bidTimeout);
                if(!this.open){
                    return false;
                }

                const resulted = bids => {
                    this.bids = bids;
                    this.fetched = true;
                    this.bidTimeout = setTimeout(() => this.loadBids(), 10000);
                };

                CachingService.bids(this.reservation.id)
                    .then(rows => resulted(rows.map(BidModel.fromJson)))
                    .catch(err => resulted([]))
            },
            twoDaysSince(bid){
                const days = bid.timestamp + (1000 * 60 * 60 * 24 * 2);
                return +new Date() > days
            },
            isBiddable(r){
                return !r.hasOwnProperty('biddable') || r.biddable
            },
            ...mapActions([
                Actions.SET_POPUP,
                Actions.SET_SEARCH_TERMS,
                Actions.PUSH_SNACKBAR
            ])
        },
        props:['open', 'reservation', 'bid', 'injectedBids', 'disabled'],
        watch:{
            open(isOpen){ if(isOpen) this.loadBids(); }
        }
    }
</script>

<style lang="scss">
    .list-item {
        cursor: pointer;
        text-align:left;
        border:1px solid #333455;
        border-radius:4px;
        box-shadow:0 2px 4px rgba(0,0,0,0.1);
        padding:20px;
        width:100%;
        margin-bottom:10px;
        position: relative;

        &.sold {
            border:1px solid red;
        }

        .hex-image {
            height:60px;
            width:60px;
            border-radius:4px;
            overflow:hidden;

            img {
                height:60px;
                width:60px;
            }
        }

        .container {
            position:relative;
            z-index:2;
        }

        &:after {
            content:'';
            position:absolute;
            top:0;
            bottom:0;
            left:0;
            right:0;
            opacity:0;

            background: linear-gradient(to top right, #2e2e4a 0%,#343454 100%);
            transition:opacity 0.2s ease;
        }

        &:hover:after, &.open:after {
            opacity:1;
        }

        &:hover, &.open {

            .modifier {
                background: linear-gradient(to top right, #6689da 0%,#7da0f2 100%);
                color:#fff;
            }
        }
    }

    .name-container {
        position: relative;
        display:table;

        .name {
            font-size:18px;
            color:#fff;
            display:inline-block;

            &.private {
                color:red;
            }
        }

        .modifiers {
            display: inline-block;
            position: absolute;
            margin-left: 10px;
            top: -6px;
            width: 100px;

            .modifier {
                display:inline-block;
                margin-left:2px;
            }

            &.full {
                .modifier {
                    box-shadow: 0 5px 12px rgba(0,0,0,0.7),0 0 80px rgba(0,255,255,0.4),0 10px 40px rgba(255,255,0,0.15);
                }
            }
        }
    }

    .bid-info {
        margin-top:-2px;

        .kv {
            font-size:9px;
            color:#7c7bb5;
            margin-right:30px;
            display: inline-block;

            .key {
                font-family:'Open Sans', sans-serif;
                display: inline-block;
            }

            .value {
                margin-left:1px;
                display: inline-block;
                font-weight:800;
            }
        }
    }

    .actions {
        position: absolute;
        right:0;
        top:0;
    }

    .bids {
        width:100%;
        background: linear-gradient(to top right, #171d34 0%, #1e2542 100%);
        margin-top:-15px;
        margin-bottom:10px;
        border-bottom-left-radius:4px;
        border-bottom-right-radius:4px;
        box-shadow:0 4px 12px rgba(0,0,0,0.1);
        padding:26px 20px 20px;

        .bid {
            text-align:left;
            border-radius:4px;
            padding:20px;
            width:100%;
            margin-bottom:10px;
            position: relative;

            &.red {
                background:rgba(255,0,0,0.1);
            }

            .actions {
                padding:20px;
            }

            &:first-child {
                border:1px solid #333455;
                box-shadow:0 2px 4px rgba(0,0,0,0.1);
            }

            &:not(:first-child){
                opacity:0.1;
            }
        }

        .no-bids {
            text-align:center;
            padding:50px;
            color:#fff;

            h1 {
                font-size:36px;
            }

            p {
                font-size:11px;
            }

            .cta {
                max-width:350px;
                width:100%;
                margin:40px auto 0;
                display:inline-block;
            }
        }
    }



    @media (max-width:550px) {
        .bid-info {

        }

        .actions {
            position:relative;
            text-align: right;
            margin-top: 10px;
        }
    }



    .open-bids-enter {
        max-height:2px;
        max-width:0;

    }

    .open-bids-enter-to {
        max-height:1000px;
        max-width:800px;
    }

    .open-bids-leave {
        transform:translateY(0px);
        opacity:1;

    }
    .open-bids-leave-active {

    }
    .open-bids-leave-to {
        transform:translateY(-50px);
        opacity:0;
        visibility: hidden;
    }
</style>
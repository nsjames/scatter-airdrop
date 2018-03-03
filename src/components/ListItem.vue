<template>
    <section>
        <section class="list-item" :class="{'open':open}" @click="opened">

            <!-- RESERVATION ITEM -->
            <section class="container" v-if="reservation">

                <!-- NAME -->
                <section class="name-container">
                    <figure class="name">{{reservation.name}}</figure>
                    <modifier :text="reservation.genetics"></modifier>
                </section>

                <!-- BID INFO -->
                <section class="bid-info">
                    <section class="kv">
                        <figure class="key">{{reservation.topPrice}}</figure>
                        <figure class="value">EOS</figure>
                    </section>
                    <section class="kv">
                        <figure class="key">{{reservation.openBids}}</figure>
                        <figure class="value">BIDS</figure>
                    </section>
                    <section class="kv">
                        <figure class="key">PREVIOUSLY {{reservation.lastSoldFor}}</figure>
                        <figure class="value">EOS</figure>
                    </section>
                    <section class="kv">
                        <figure class="key">RESERVED</figure>
                        <figure class="value open-sans" style="text-transform: uppercase">
                            {{reservation.timestamp | moment("from", "now")}}
                        </figure>
                    </section>
                </section>

                <!-- BID ACTIONS -->
                <section class="actions" v-if="!isOwner()">
                    <action-button text="BID" :active="open"></action-button>
                </section>

            </section>

            <!-- BID ITEM -->
            <section class="container" v-if="bid">

                <!-- NAME -->
                <section class="name-container">
                    <figure class="name"><span class="open-sans">{{bid.price}}</span> <b>EOS</b></figure>
                </section>

                <!-- BID INFO -->
                <section class="bid-info">
                    <section class="kv" style="color:#fff;">
                        <figure class="key">{{bid.reservation.name}}</figure>
                    </section>
                    <section class="kv">
                        <figure class="key">ENDING</figure>
                        <figure class="value open-sans" style="text-transform: uppercase">{{new Date(bid.timestamp).setDate(new Date(bid.timestamp).getDate() + 2)/1000 | moment("from", "now")}}</figure>
                    </section>
                    <!--<section class="kv">-->
                    <!--<figure class="key">SOLD</figure>-->
                    <!--<figure class="value">HERE</figure>-->
                    <!--</section>-->
                </section>

                <!-- BID ACTIONS -->
                <section class="actions">
                    <action-button text="UNBID" @click.native="submitUnBid"></action-button>
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
                    <section class="bid" v-for="(b, index) in bids">
                        <!-- NAME -->
                        <section class="name-container">
                            <figure class="name"><span class="open-sans">{{b.price}}</span> <b>EOS</b></figure>
                        </section>

                        <!-- BID INFO -->
                        <section class="bid-info">
                            <section class="kv">
                                <figure class="key">POSTED</figure>
                                <figure class="value open-sans" style="text-transform: uppercase">{{b.timestamp/1000 | moment("from", "now")}}</figure>
                            </section>
                            <section class="kv" v-if="index === 0">
                                <figure class="key">ENDING</figure>
                                <figure class="value open-sans" style="text-transform: uppercase">{{new Date(b.timestamp).setDate(new Date(b.timestamp).getDate() + 2)/1000 | moment("from", "now")}}</figure>
                            </section>
                            <!--<section class="kv">-->
                            <!--<figure class="key">SOLD</figure>-->
                            <!--<figure class="value">HERE</figure>-->
                            <!--</section>-->
                        </section>

                        <!-- BID ACTIONS -->
                        <section v-if="index === 0">
                            <section class="actions" v-if="!isOwner() && !isBidOwner(b)">
                                <action-button text="OUTBID" @click.native="submitBid"></action-button>
                            </section>
                            <section class="actions" v-if="!isOwner() && isBidOwner(b)">
                                <action-button text="UNBID" @click.native="submitUnBid"></action-button>
                            </section>
                            <section class="actions" v-if="isOwner()">
                                <action-button text="UNBID" @click.native="submitSale"></action-button>
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
    import CachingService from '../services/CachingService'

    export default {
        data(){ return {
            fetched:false,
            bids:[],
        }},
        computed: {
            ...mapGetters([
               'ethAddress'
            ]),
            ...mapState([

            ])
        },
        methods: {
            opened(){
                this.$emit('opened');
            },
            isOwner(){
                return this.reservation.eth === this.ethAddress;
            },
            isBidOwner(bid){
                return bid.eth === this.ethAddress;
            },
            submitBid(){
                const highestBidEthereumKey = this.bids.length ? this.bids[0].eth : '';
                this[Actions.SET_POPUP](PopupModel.bid(this.reservation, highestBidEthereumKey), res => {
                    console.log('bid popup', res);
                });
            },
            submitUnBid(){
                console.log('unbidding')
            },
            submitSale(){
                console.log('selling')
            },
            viewReservation(){
                this[Actions.SET_SEARCH_TERMS](this.bid.reservation.name);
            },
            ...mapActions([
                Actions.SET_POPUP,
                Actions.SET_SEARCH_TERMS
            ])
        },
        props:['open', 'reservation', 'bid'],
        watch:{
            open(isOpen){
                if(isOpen) CachingService.bids(this.reservation.id)
                    .then(rows => {
                        this.bids = rows.map(BidModel.fromJson);
                        this.fetched = true;
                    })
                    .catch(err => {
                        this.bids = [];
                        this.fetched = true;
                    })
            }
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
        }

        .modifier {
            display:inline-block;
            position:absolute;
            margin-left:10px;
            top:-6px;
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
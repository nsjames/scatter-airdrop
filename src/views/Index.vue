<template>
    <section style="padding-bottom:200px;">

        <!-- HERO -->
        <hero></hero>

        <section class="max-1024 pad-sides">

            <!-- README -->

            <section class="readme" ref="readme" :class="{'first-time':!firstTime}">
                <h1>
                    <circle-button @click.native="readBeforeContinuing" icon="fa-check-circle"></circle-button>
                    Read Before Continuing
                </h1>

                <hr>

                <h2>Primary Airdrop</h2>
                <p>
                    Every EOS holder inside of the final EOS genesis snapshot will receive 40 RIDL Tokens. You do not have to reserve your name to receive the airdrop.
                    You will have the ability to transfer the tokens regardless of your reservation/registration however you will not be able to use the tokens inside of RIDL
                    without a registered Identity.
                    <br><br>
                    The tokens will not be given on the Ethereum chain, they will only be dispensed when the Identity is created on the live EOS mainnet.
                </p>
                <hr>

                <h2>Identity Name Reservation</h2>
                <p>
                    If you want to make sure that you get the name you want at the launch of the EOS mainnet or if you simply want to take part in the name auction, you can reserve a
                    name and claim it. Reserved names will be transferable until around June 1st at which point they will be locked to the EOS public key they are tied to at the time.
                </p>
                <hr>

                <h2>Secondary Airdrop</h2>
                <p>
                    The first 5000 Reserved User Identity Names will also be airdropped an additional 50 RIDL Tokens, raising their total to 100
                    ( 10 from registration, 40 from global airdrop and 50 from reservation airdrop ). The remaining reservations will only get 10, to a total of 60.
                </p>
                <hr>

                <h2>Auction & Bidding</h2>
                <p>
                    <b class="light">After you have reserved a User Identity Name you may trade it as you please for any price you wish.</b>

                    You can bid on already reserved Identity Names and
                    if the owner selects to sell to your bid you will be transferred ownership of the name. If a new bid overthrows yours your bid will be returned to you.
                    All gas spent on bidding is non-refundable.
                </p>

                <figure class="bounding-box">
                    <p style="margin:0;">
                        <b>All bids are done in ETH.</b> The reason for doing the bidding in ETH instead of EOS ERC20 tokens is to make sure that users can
                        still re-claim their unsellable bids once the contract is locked. If we were to use EOS ERC20 tokens they would not be transferrable
                        after June 1st and would be stuck within the Scatter Reservation contract.
                    </p>
                </figure>

                <figure class="bounding-box">
                    <p style="margin:0;">
                        <b class="light">
                            MetaMask doesn't show you the amount of EOS it is allowing, which is terrible UX. We have taken some steps to make sure you can verify the price on your own. Take note,
                            Scatter never hides the transaction you are signing. That's irresponsible.
                        </b><br><br>
                        <u><a target="_blank" href="https://github.com/nsjames/scatter-airdrop">Click here and follow the steps to verify the current price</a><br></u>
                        <u><a target="_blank" href="https://github.com/nsjames/ScatterReservation/blob/master/contracts/ScatterReservation.sol#L140">Click here to verify the contract code</a></u>
                    </p>
                </figure>
                <hr>

                <h2>Identity Genetics</h2>
                <br>
                <section class="modifiers">
                    <section class="mod-box">
                        <modifier text="0x41"></modifier>
                        <modifier text="0x42"></modifier>
                        <modifier text="0x43"></modifier>
                        <modifier text="0x44"></modifier>
                    </section>

                    <p>
                        <span class="light">
                        When a name is reserved it is applied a random genetic letter.<br>
                        Every time it is sold it is applied another genetic modifier. This will happen until the genetic sequence has reached 5 letters.
                        </span>
                        Identities registered with RIDL after the mainnet launch will not have this genetic material assigned to them upon registration.
                        It is given exclusively for the participants of the reservation and auction. Think of it as a permanent mark of appreciation from us at Scatter.

                    </p>
                </section>
                <hr>

                <h2>What will the proceeds from the reservations go towards?</h2>
                <p>
                    <b>70% will go into funding the further development of Scatter and RIDL.</b>
                    This will include hiring more developers and splitting the development team into three teams,
                    <i>one for Web Browsers, one for Mobile, and one <span style="text-decoration: line-through">to rule them all.</span> for RIDL.</i>
                    <br><br>
                    20% will be put into educating developers on
                    how to work with EOS, eosjs, Scatter, and RIDL via documentation and video/written tutorials.
                    <br><br>
                    The remaining 10% will be put into advertising both EOS and Scatter to raise awareness about EOS's ability to provide a scalable blockchain solution that
                    developers can take advantage of <b>now</b> and Scatter's ability to provide a user-experience never seen before on the blockchain or otherwise.
                </p>
                <hr>

                <h2>This is <u>NOT</u> an Initial Coin Offering</h2>
                <p>
                    In no way is this an ICO. No tokens are being sold or even recorded on the Ethereum chain. The tokens will only be minted on the actual EOS network, and
                    they will only be applied to the EOS public keys ( from genesis and the reservation contract's cache ) once that happens.
                    The tokens can have no price or value attached to them simply due to the fact that they do not exist on any network.
                    <b>Any RIDL tokens on any network besides EOS are <u>NOT</u> ours, and have nothing to do with us or this airdrop/auction.</b>
                    The RIDL Token is a <b>utility</b> token. Though it <u>can</u> be, it is not Scatter's intention for the token to be sold for any monetary value.
                    <br><br>
                    <b>
                        The only thing being sold here on this website is an actual virtual asset in the form of a reserved name for the future EOS blockchain.
                        You may liken the reservation process to that of reserving a seat at a ball game, pre-purchasing a video game, or buying concert tickets. It is also not our intention for the
                        Genetics to be used as a gambling mechanism. There is no difference between the letters other than that given by the community, they do not affect RIDL in any way.
                    </b>
                </p>
            </section>



            <section v-if="w3">

                <!-- MY RESERVATIONS -->
                <section class="list">
                    <section class="head">
                        <h1>My Reservations</h1>
                    </section>
                    <figure v-for="r in myReservations">
                        <list-item :disabled="r.isLocked()" hidebid="true" :reservation="r" :open="selectedReservation === r.id" v-on:sold="r.locked = +new Date();" v-on:opened="setSelection(r)"></list-item>
                    </figure>
                    <p v-if="myReservations.length" style="color:yellow; font-size:11px; margin-bottom:10px; margin-top:-15px; margin-left:20px;">
                        Click the <b>ID</b> button and share your Identities to help get them bids.
                    </p>
                    <section v-if="!myReservations.length">
                        <figure class="bounding-box">
                            <p style="color:#fff;">
                                You don't have any reservations yet.
                            </p>
                        </figure>
                    </section>
                </section>

                <!-- MY BIDS -->
                <section class="list">
                    <section class="head">
                        <h1>My Bids</h1>
                        <section class="filters">
                            <figure class="filter"
                                    :class="{'active':selectedBidState === state}"
                                    v-for="state in bidStates" @click="changeBidState(state)">{{state === bidStates.TOP ? 'Open' : state}}</figure>
                        </section>
                    </section>
                    <figure v-for="b in myOpenBids">
                        <list-item :bid="b"></list-item>
                    </figure>
                    <section v-if="!myOpenBids.length">
                        <figure class="bounding-box">
                            <p style="color:#fff;">
                                You don't have any {{selectedBidState}} bids yet.
                            </p>
                        </figure>
                    </section>
                </section>
            </section>



            <!-- META -->
            <section class="meta">
                <section class="circle">
                    <h1 class="hidden-counter" :class="{'show':totalReservations}">{{totalReservations}}</h1>
                    <h2>Identities Reserved</h2>
                    <p>2,214,500+ tokens airdropped</p>
                </section>

                <section class="ctas">
                    <a href="https://docs.google.com/document/d/1P6Oz08vNjrJO1H3HmBkuh4BIVm3-0YAe4nqo-xfT4v0/edit?usp=sharing" target="_blank">
                        <rounded-button big="More About RIDL" small="Reputation and Identity Layer"></rounded-button>
                    </a>
                    <a href="http://www.scatter-eos.com" target="_blank">
                        <rounded-button big="More About Scatter" small="Already a working product."></rounded-button>
                    </a>
                    <rounded-button @click.native="readBeforeContinuing" v-if="!firstTime" big="Read Before Continuing" small="Make sure you have read this"></rounded-button>
                    <a href="https://t.me/Scatter" target="_blank">
                        <rounded-button @click.native="joinTelegram" big="Join our Telegram!" small="The best place for news."></rounded-button>
                    </a>
                </section>
            </section>


            <!-- FEATURED RESERVATIONS -->
            <section class="list">
                <section class="head">
                    <h1>Trending Bid Battles</h1>
                </section>
                <figure v-for="r in trendingReservations">
                    <list-item :disabled="r.isLocked()" :reservation="r" :open="selectedReservation === r.id" v-on:sold="r.locked = +new Date();" v-on:opened="setSelection(r)"></list-item>
                </figure>
                <section v-if="!trendingReservations.length">
                    <figure class="bounding-box">
                        <p style="color:#fff;">
                            There are no trending bid battles right now.
                        </p>
                    </figure>
                </section>
            </section>

            <!-- FILTERABLE RESERVATIONS -->
            <section class="list">
                <section class="head">
                    <figure class="search" id="searchbar">
                        <input placeholder="Search" :value="searchTerms" @input="forwardSearchTerms" />
                    </figure>
                    <section class="filters">
                        <figure class="filter btn" @click="deltaPage(1)">NEXT</figure>
                        <figure class="filter">{{page}}</figure>
                        <figure class="filter btn" @click="deltaPage(-1)">BACK</figure>
                    </section>
                </section>
                <figure v-for="r in reservations">
                    <list-item :disabled="r.isLocked()" :reservation="r" :open="selectedReservation === r.id" v-on:sold="r.locked = +new Date();" v-on:opened="setSelection(r)"></list-item>
                </figure>
                <section v-if="!reservations.length">
                    <figure class="bounding-box">
                        <p style="color:#fff;">
                            There are no reservations!
                        </p>
                    </figure>
                </section>
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
    import CachingService from '../services/CachingService'
    import ContractService from '../services/ContractService'
    import {BID_STATE} from '../models/BidModel'

    const timer = 20000;
    export default {
        data(){ return {
            firstTime:localStorage.getItem("firstTime") === null,

            bidStates:BID_STATE,
            selectedBidState:BID_STATE.TOP,

            selectedReservation:null,

            totalReservations:null,
            page:0,

            reservations:[],
            trendingReservations:[],
            myReservations:[],
            myOpenBids:[],

            reservationsTimeout:null,
            trendingReservationsTimeout:null,
            myReservationsTimeout:null,
            myOpenBidsTimeout:null,
            totalReservationsTimeout:null,

        }},
        mounted(){
            setTimeout(() => {
                if(this.$route.query.bid) {
                    this[Actions.SET_SEARCH_TERMS](this.$route.query.bid);
                    const originalTop = document.getElementById('searchbar').getBoundingClientRect().top;
                    window.scrollBy({
                        top: originalTop-50,
                        behavior: "smooth"
                    });
                }
            }, 500);


            this.getReservations();
            setTimeout(() => {
                this.getTrendingReservations();
                this.getTotalReservations();
                if(this.ethAddress){
                    this.getMyReservations();
                    this.getMyOpenBids();
                }
            }, 1000);
        },
        computed: {
            ...mapGetters([
                'ethAddress',
                'searchTerms',
                'scatterContract',
                'mmaddr'
            ]),
            ...mapState([
                'w3',
            ])
        },
        methods: {
            deltaPage(delta){
                if(delta < 0 && this.page === 0) return false;
                if(delta > 0 && !this.reservations.length) return false;
                this.page += delta;
            },
            forwardSearchTerms(terms){
                this[Actions.SET_SEARCH_TERMS](terms.target.value);
            },
            readBeforeContinuing(){
                if(localStorage.getItem("firstTime") === null)
                    localStorage.setItem("firstTime", true);
                this.firstTime = !this.firstTime;
                if(this.firstTime){
                    setTimeout(() => {
                        const readme = this.$refs.readme;
                        const originalTop = readme.getBoundingClientRect().top;
                        window.scrollBy({
                            top: originalTop-50,
                            behavior: "smooth"
                        });
                    }, 200)
                }
            },
            setSelection(reservation){
                this.selectedReservation = this.selectedReservation === reservation.id
                    ? 0 : reservation.id;
            },
            timedFetch(future, futureargs, timeout){
                return new Promise((resolve, reject) => {
                    clearTimeout(timeout);
                    future(...futureargs).then(rows => {
                        resolve(rows);
                    });
                })
            },
            getTrendingReservations(){
                this.timedFetch(
                    CachingService.getTrendingReservations,
                    [this.ethAddress],
                    this.trendingReservationsTimeout
                ).then(rows => {
                    this.trendingReservations = rows;
                    this.trendingReservationsTimeout = setTimeout(() => this.getReservations(), timer);
                })
            },
            getReservations(){
                this.timedFetch(
                    CachingService.getReservations,
                    [RESERVATION_TYPES.USER, this.searchTerms, this.ethAddress, this.page],
                    this.reservationsTimeout
                ).then(rows => {
                    this.reservations = rows;
                    this.reservationsTimeout = setTimeout(() => this.getReservations(), timer);
                })
            },
            getMyReservations(){
                this.timedFetch(
                    CachingService.getReservationsByEthKey,
                    [this.ethAddress],
                    this.myReservationsTimeout
                ).then(rows => {
                    this.myReservations = rows;
                    this.myReservationsTimeout = setTimeout(() => this.getMyReservations(), timer);
                })
            },
            getMyOpenBids(){
                this.timedFetch(
                    CachingService.getOpenBidsByEthKey,
                    [this.ethAddress, this.selectedBidState],
                    this.myOpenBidsTimeout
                ).then(rows => {
                    this.myOpenBids = rows;
                    this.myOpenBidsTimeout = setTimeout(() => this.getMyOpenBids(), timer);
                })
            },
            changeBidState(state){
                this.selectedBidState = state;
                this.getMyOpenBids();
            },
            getTotalReservations(){
                this.timedFetch(
                    CachingService.totalReservations,
                    [this],
                    this.totalReservationsTimeout
                ).then(total => {
                    this.totalReservations = total;
                    this.totalReservationsTimeout = setTimeout(() => this.getTotalReservations(), timer);
                })
            },
            ...mapActions([
                Actions.SET_SEARCH_TERMS
            ])
        },
        watch:{
            searchTerms(){
                this.getReservations();
            },
            ethAddress(){
                this.getMyReservations();
                this.getMyOpenBids();
                this.getReservations();
                this.getTrendingReservations();
            },
            page(){
                this.getReservations();
            }
        }
    }
</script>

<style lang="scss">
    .bounding-box {
        cursor: pointer;
        text-align:left;
        border:1px solid #333455;
        border-radius:4px;
        box-shadow:0 2px 4px rgba(0,0,0,0.1);
        padding:20px;
        width:100%;
        margin-bottom:10px;
        position: relative;
    }
    .readme {
        margin:100px 0;
        color:#fff;
        font-weight:300;
        max-height:2000px;
        transition:max-height 0.5s ease, margin 0.5s ease, opacity 0.3s ease;
        overflow: hidden;
        opacity:1;

        h1 {
            font-size:28px;

            .circle-button {
                vertical-align: middle;
                margin-bottom: 5px;
                margin-right: 10px;
            }
        }

        h2 {
            font-size:18px;
        }

        p {
            font-size:13px;
            color:#636c8f;
            margin-bottom:30px;
            margin-top:10px;

            .light {
                color:#919cc4;
            }
        }

        hr {
            border:0;
            width:100px;
            height:1px;
            background:rgba(255,255,255,0.1);
            margin:30px 0;
        }

        &.first-time {
            max-height:0;
            margin-top:0;
            opacity:0;
        }
    }

    .meta {
        margin:120px 0;
        text-align:center;

        .circle {
            position: relative;
            width:250px;
            height:250px;
            margin:0 auto;
            border-radius:50%;
            box-shadow:0 5px 20px rgba(0,0,0,0.4), 0 0 180px rgba(125,160,242, 0.2);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            &:before {
                position: absolute;
                content: "";
                width:247px;
                height:247px;
                top: 1px;
                left: 1px;
                background: linear-gradient(to top right, #14192b 0%,#1e232b 100%);
                border-radius: 50%;
                z-index: -1;
                box-shadow:inset 0 5px 20px rgba(0,0,0,0.4);
            }

            &:after {
                position: absolute;
                content: "";
                width:253px;
                height:253px;
                top: -2px;
                left: -2px;
                background-color: #7da0f2;
                background-image: linear-gradient(to top right, #7da0f2 0%, #dde834 100%);
                border-radius: 50%;
                z-index: -2;
            }

            h1 {
                font-size:50px;
                line-height:50px;
                font-weight:bold;
                color:#fff;
                margin-bottom:5px;
                opacity:0;
                transition: opacity 0.5s ease;
                &.show {
                    opacity:1;
                }
            }

            h2 {
                font-size:13px;
                color:#a7b1d6;
                margin-bottom:2px;
            }

            p {
                font-size:9px;
                font-weight:bold;
                color:#4f5c8e;
                padding-bottom:10px;
            }
        }

        .modifiers {
            max-width:600px;
            width:100%;
            margin:30px auto 0;

            .mod-box {
                border:1px solid #333455;
                border-radius:4px;
                box-shadow:0 2px 4px rgba(0,0,0,0.1);
                padding:17px 20px 20px;
                display:flex;
                justify-content:space-around;
                width:120px;
                margin:0 auto 20px;
            }

            p {
                font-size: 13px;
                color:#636c8f;
            }

        }

        .ctas {
            margin-top:50px;
            display:flex;
            justify-content:space-evenly;
            width:100%;
            flex-flow: row wrap;

            .rounded-button {
                /*flex:1;*/
                /*flex-basis: 300px;*/
                margin-bottom:40px;
            }
        }
    }

    hr {
        border:0;
        outline:0;
        width:100%;
        height:1px;
        background:rgba(255,255,255,0.1);
        margin:100px 0 80px;
    }

    .list {
        margin-bottom:50px;

        .head {
            overflow:hidden;

            h1 {
                font-size:18px;
                color:#fff;
                font-weight:300;
                float:left;
                margin-bottom:20px;
                padding-left:20px;
            }

            .search {
                float:left;

                input {
                    text-align:left;
                    width:160px;
                    height:30px;
                    line-height:30px;
                    border-radius:150px;
                    background:#fff;
                    border:0;
                    outline:0;
                    padding:0 20px;
                    margin-bottom:10px;
                    font-size:13px;
                    font-weight:100;
                    color:#b4b4b4;

                    &::-webkit-input-placeholder { color: #b4b4b4; }
                    &::-moz-placeholder { color: #b4b4b4; }
                    &:-ms-input-placeholder { color: #b4b4b4; }
                    &:-moz-placeholder { color: #b4b4b4; }
                }
            }

            .filters {
                float:right;
                margin-top:10px;

                .filter {
                    cursor: pointer;
                    float:right;
                    font-size:11px;
                    color:#6a8dde;
                    opacity:0.4;
                    transition:opacity 0.2s ease;
                    margin-left:20px;
                    position: relative;
                    margin-top:8px;
                    text-transform: uppercase;

                    &.btn {
                        padding:5px;
                        border:1px solid #333455;
                        border-top-left-radius:4px;
                        border-top-right-radius:4px;
                        border-bottom:0;
                    }

                    &:hover, &.active {
                        opacity:1;
                    }

                    &:after {
                        content:'';
                        position:absolute;
                        left:0; right:0;
                        top:-5px;
                        height:2px;
                        background:#6a8dde;
                        opacity:0;
                        transition:opacity 0.8s ease;
                    }

                    &.active:after {
                        opacity:1;
                    }
                }
            }
        }
    }
</style>
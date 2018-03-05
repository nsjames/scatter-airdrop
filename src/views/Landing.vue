<template>
    <section style="padding-bottom:200px;">

        <!-- HERO -->
        <landing-hero></landing-hero>

        <section class="max-1024 pad-sides">


            <section class="meta">

                <section class="circle">
                    <h1>X</h1>
                    <h2>Identities Reserved</h2>
                    <p>13,926,000+ tokens airdropped</p>
                    <p class="open-sans" style="margin-top:-5px;">( and counting )</p>
                </section>

                <section class="ctas">
                    <a href="https://docs.google.com/document/d/1P6Oz08vNjrJO1H3HmBkuh4BIVm3-0YAe4nqo-xfT4v0/edit?usp=sharing" target="_blank">
                        <rounded-button big="More About RIDL" small="Join the community effort!"></rounded-button>
                    </a>
                    <a href="http://www.scatter-eos.com" target="_blank">
                        <rounded-button big="More About Scatter" small="Already a working product."></rounded-button>
                    </a>
                </section>
            </section>
            <section class="readme" ref="readme">
                <h1>
                    Get Ready for some Action
                </h1>
                <hr>


                <h2>What is RIDL?</h2>
                <p>
                    RIDL ( or <i>Reputation and Identity Layer</i> ) is a sister system to Scatter that provides Identity verification across all networks and reputation tied to those Identities.
                    It's primary purpose is to help users make educated decisions about the security of the applications they are using with Scatter and to help applications mitigate the affect of bad actors
                    on their systems.
                    <br><br>
                    Let's look at some of the benefits:
                </p>
                <ul>
                    <li>
                        <b>Unique Identity Names</b>
                        <br>
                        Identity names registered with RIDL will be tied to specific contract accounts ( for applications ) or Scatter Identities ( for users ).
                        By doing this Scatter is able to let users know that they are on a malicious version of a website
                        ( for instance <b>Bitfịnex.com</b> <i class="fa fa-long-arrow-left"></i> notice the dot under the <b>i</b> )
                        because the contract, account and network registered with RIDL will not match the malicious account that is requesting a transaction signature.
                    </li>

                    <li>
                        <b>Reputation</b>
                        <br>
                        Identities that have been registered with RIDL will be able to take part in the reputation system.
                        Applications and Users can repute each other and raise or lower each others reputation standing.
                        This makes it so that users can come together to positively or negatively repute an application and allow
                        other new users to know instantly whether the application does what it says it does.
                        <br><br>
                        <ul>
                            <li>Users can repute applications only once, but can change their repute whenever they wish ( +1 or -1 ).</li>
                            <li>Applications can repute users many times but only once every 24 hours and must have a <i>good standing</i>.</li>
                        </ul>
                    </li>

                    <!--<li>-->
                        <!--<b>Reputation Ledger</b>-->
                        <!--<br>-->
                        <!--An Identity's complete ledger of reputes is public and visible by all. What this gives is the ability for-->
                        <!--applications to view and review reputes towards a user and apply application logical rulings towards them such as the ability to-->
                        <!--take larger loans because of a good history of repayment on similar applications.-->
                    <!--</li>-->

                </ul>
                <hr>


                <h2>Primary Airdrop</h2>
                <p>
                    Every EOS holder inside of the final EOS genesis file will receive 40 RIDL Tokens. You do not have to reserve your name to receive the airdrop, your tokens will
                    be provided for you when you create an Identity from Scatter using your private key regardless of reservation. You will still need to register an Identity with RIDL in the future in order
                    to claim the tokens. The tokens will not be given on the Ethereum
                    chain, they will only be dispensed when the Identity is created on the live EOS mainnet.
                </p>
                <hr>

                <h2>Identity Name Reservation</h2>
                <p>
                    If you want to make sure that you get the name you want at the launch of the EOS mainnet or if you simply want to take part in the name auction, you will be able to reserve a
                    name and claim it once the auction opens. User Identity Names will be transferable until June 1st at which point they will be locked to the EOS public key they are tied to at that moment.
                    <br><br>
                    <b>Applications</b> must prove their ownership of the application name against a representative of Scatter in order to reserve the name due to copyright and intellectual property laws. If an
                    application reserves a name that is already taken by a user and then verified successfully the user’s EOS will be returned to them and the application will assume ownership of the name at
                    the base price. Application Identities are non-transferable and can not take part in the auction system. Applications always start with 0 RIDL Tokens. If an
                    application has tokens allocated to it’s public key when it is registered they will not be given to the Application Identity, but can still be claimed by User Identities
                    registered to the same EOS public key.
                    <br><br>
                    <b>Reserving an Identity name costs 1 EOS.</b>
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
                        <b>All bids are also done in EOS.</b> The reasoning for this being that we have a feeling that this auction will break through the bubble of EOS and flow into
                        the general cryptocurrency world. Once that happens people who do not hold EOS will have to purchase EOS to take part in the auction. Like everything
                        Scatter does, we hope this will help elevate the entire EOS project, it's community, and it's exposure.
                    </p>
                </figure>

                <list-item :reservation="reservation" :injected-bids="bids" :open="true" :disabled="true"></list-item>
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
                    This will include hiring more developers and splitting the development team into three team,
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
                    The only thing being sold here on this website is an actual virtual asset in the form of a reserved name for the future EOS blockchain.
                    You may liken the reservation process to that of reserving a seat at a ball game, pre-purchasing a video game, or buying concert tickets. It is also not our intention for the
                    Genetics to be used as a gambling mechanism. There is no difference between the letters other than that given by the community, they do not affect RIDL in any way.
                </p>

                <div style="height:200px;"></div>
            </section>
        </section>







    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'

    import ReservationModel from '../models/ReservationModel';
    import {RESERVATION_TYPES} from '../models/ReservationModel'
    import BidModel from '../models/BidModel'
    import {BID_STATE} from '../models/BidModel'

    export default {
        data(){ return {
            reservation:null,
            bids:[],
        }},
        mounted(){
            this.reservation = ReservationModel.fromJson({
                "type": "User",
                "name": "ExampleReservation",
                "publicKey": "EOS7sEen1iVnzhRzS4ZywJP9y5DzKqxom7N6cjJwiL8tymDypPQor",
                "genetics": ['0x41', '0x41', '0x43'],
                "email": "",
                "id": "5",
                "timestamp": "2018-03-03T13:13:32.125Z",
                "topPrice": 12,
                "openBids": 2,
                "lastSoldFor": 3 * 1000000000000000000,
                "eth": "0x95055Ae40C1B4df3c6c62d7c1a08386312763324",
                "trx": "0xe94c1aa83629c18bd4c1bbf931c70d772b2a0c7d8c1ec01ad89f573cc0811907",
                "openBidsKey": "reservation:5:bids",
                "highestBidKey": "reservation:5:bids:highest"
            });
            this.bids = [
                BidModel.fromJson({
                    "eth": "0xd68D8aea8eC070f81aFCbD64aB617901e44d2f50",
                    "price": 12 * 1000000000000000000,
                    "publicKey": "EOS6nmammtFZrCGJfLQK8gVHNHec4JqajYNU3kvYNMdv15dYAuv4z",
                    "reservationId": "6",
                    "reservationKey": "reservation:6",
                    "state": "top",
                    "timestamp": 1520084762891,
                    "trx": "0xfc1109cf32f9b5bfbeb412bd3262cf43dbe6a0b97520523f439cd952a0cbc2a3"
                }),
                BidModel.fromJson({
                    "eth": "0xd68D8aea8eC070f81aFCbD64aB617901e44d2f50",
                    "price": 10 * 1000000000000000000,
                    "publicKey": "EOS6nmammtFZrCGJfLQK8gVHNHec4JqajYNU3kvYNMdv15dYAuv4z",
                    "reservationId": "5",
                    "reservationKey": "reservation:5",
                    "state": "top",
                    "timestamp": 1520084762891,
                    "trx": "0xfc1109cf32f9b5bfbeb412bd3262cf43dbe6a0b97520523f439cd952a0cbc2a3"
                })
            ];
        },
        computed: {
            ...mapState([

            ])
        },
        methods: {
            ...mapActions([

            ])
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
        max-height:5000px;
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

        p, ul {
            font-size:13px;
            color:#636c8f;
            margin-bottom:30px;
            margin-top:10px;

            .light {
                color:#919cc4;
            }
        }

        ul {
            b {
                font-size:15px;
            }

            li {
                margin-bottom:10px;
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
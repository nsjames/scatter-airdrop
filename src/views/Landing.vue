<template>
    <section style="padding-bottom:200px;">

        <!-- HERO -->
        <landing-hero></landing-hero>

        <section class="max-1024 pad-sides">
            <section class="readme" ref="readme">
                <h1>
                    Get Ready for some Action
                </h1>
                <hr>


                <h2>Scatter Token Airdrop</h2>
                <p>
                    Every EOS holder inside of the final EOS genesis file will recieve 40 RIDL Tokens. You do not have to reserve your name to recieve the airdrop, your tokens will
                    be provided for you when you create an Identity from Scatter using your private key regardless of reservation. The tokens will not be given on the Ethereum
                    chain, they will only be dispensed when the Identity is created on the live EOS mainnet.
                </p>
                <hr>

                <h2>Secondary Airdrop</h2>
                <p>
                    Reserved User Identity Names will also be airdropped an additional 50 RIDL Tokens, raising their total to 100 ( 10 from registration, 40 from global airdrop and 50
                    from reservation airdrop ).
                </p>
                <hr>

                <h2>Identity Name Reservation</h2>
                <p>
                    If you want to make sure that you get the name you want at the launch of the EOS mainnet or if you simply want to take part in the name auction, you will be able to reserve a
                    name and claim it once the auction opens. User Identity Names will be transferable until June 1st at which point they will be locked to the EOS public key they are tied to at the time.
                    <br><br>
                    <b>Applications</b> must prove their ownership of the application name via real world means in order to reserve the name due to copyright and intellectual property laws. If an
                    application reserves a name that is already taken by a user the user’s EOS will be returned to them and the application will assume ownership of the name at
                    the base price. Application Identities are non-transferable and can not take part in the auction system. Applications always start with 0 RIDL Tokens. If an
                    application has tokens allocated to it’s public key when it is registered they will not be given to the Application Identity.
                </p>
                <hr>

                <h2>Auction & Bidding</h2>
                <p>
                    <b class="light">After you have reserved a User Identity Name you may trade it as you please for any price you wish.</b>

                    You can bid on already reserved Identity Names and
                    if the owner selects to sell to your bid you will be transferred ownership of the name. If a new bid overthrows yours your bid will be returned to you.
                    All gas spent on bidding is non-refundable.
                </p>
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

                    </p>
                </section>
            </section>

            <section class="meta">

                <section class="ctas">
                    <a href="https://docs.google.com/document/d/1P6Oz08vNjrJO1H3HmBkuh4BIVm3-0YAe4nqo-xfT4v0/edit?usp=sharing" target="_blank">
                        <rounded-button big="More About RIDL" small="Reputation and Identity Layer"></rounded-button>
                    </a>
                    <a href="http://www.scatter-eos.com" target="_blank">
                        <rounded-button big="More About Scatter" small="Already a working product."></rounded-button>
                    </a>
                </section>

                <section class="circle">
                    <h1>X</h1>
                    <h2>Identities Reserved</h2>
                    <p>13,926,000+ tokens airdropped</p>
                </section>
            </section>
        </section>







    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'

    export default {
        data(){ return {

        }},
        mounted(){

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
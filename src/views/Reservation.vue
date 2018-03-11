<template>
    <section ref="panel" class="identity">

        <div class="bg" id="particles-js"></div>

        <section class="content">
            <section class="logo-container">
                <figure class="logo">Scatter</figure>
                <h1>{{reservation.name}}</h1>
                <p class="tagline">This name is reserved for Scatter RIDL</p>

                <br>
            </section>

            <figure class="modifiers">
                <modifier :text="gene" v-for="(gene, i) in reservation.genetics" :class="{'full':gene !== '0x00'}" :key="i"></modifier>
                <p class="tagline">CURRENT GENE SEQUENCE</p>
            </figure>

            <section class="logo-container">
                <h1 v-if="reservation.topPrice">
                    <span class="open-sans">{{reservation.topPrice | price}}</span> ETH
                    <p class="tagline">LAST SOLD PRICE</p>
                </h1>
                <h1 v-else>
                    <span class="open-sans">1</span> EOS
                    <p class="tagline">LAST SOLD PRICE</p>
                </h1>
            </section>

            <section class="reservation">
                <p>

                </p>


                <!--<section class="switcher">-->
                <!--<figure class="active-switch" :class="{'left':newReservation.type === reservationTypes.USER}"></figure>-->
                <!--<figure class="switch"-->
                <!--@click="newReservation.changeType(reservationTypes.USER)"-->
                <!--:class="{'active':newReservation.type === reservationTypes.USER}">User</figure>-->
                <!--<figure class="switch"-->
                <!--@click="newReservation.changeType(reservationTypes.DAPP)"-->
                <!--:class="{'active':newReservation.type === reservationTypes.DAPP}">Dapp</figure>-->
                <!--</section>-->

                <section class="cta">
                    <rounded-button big="Submit Bid" @click.native="bidOnName"></rounded-button>
                    <br>
                    <rounded-button big="Share" small="On Twitter" @click.native="twitterShare"></rounded-button>
                </section>

                <!--<figure class="terms">-->
                    <!--By reserving you are accepting our Terms & Conditions-->
                <!--</figure>-->
            </section>

            <!--<section class="reservation" v-else>-->
                <!--<figure class="" style="color:#fff;">-->
                    <!--<figure class="box">-->
                        <!--You need MetaMask in order to participate in the reservation and auction system.-->
                        <!--<br><br>-->
                        <!--<p>-->
                            <!--If you already <b>have</b> MetaMask, it's probably locked.-->
                        <!--</p>-->
                    <!--</figure>-->
                <!--</figure>-->
                <!--<br>-->
                <!--<br>-->

                <!--<section class="cta">-->
                    <!--<a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">-->
                        <!--<rounded-button big="Get MetaMask Extension" small="Who uses these things anyway?"></rounded-button>-->
                    <!--</a>-->
                <!--</section>-->

            <!--</section>-->

        </section>

    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'

    import ReservationModel from '../models/ReservationModel'
    import CachingService from '../services/CachingService'

    export default {
        data(){ return {
            reservation:ReservationModel.fromJson({
                name:this.$route.params.name
            }),

        }},
        mounted(){
            this.$refs.panel.style.minHeight = window.innerHeight+'px';
            CachingService.getReservationByName(this.$route.params.name).then(res => {
                if(res)
                    this.reservation = ReservationModel.fromJson(res);

                while(this.reservation.genetics.length < 5){
                    this.reservation.genetics.push('0x00')
                }
            });
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
            bidOnName(){
                this.$router.push('/?bid='+this.reservation.name)
            },
            twitterShare(){
                const url = "http://www.airdrop.scatter-eos.com/#/identity/"+this.reservation.name;
                const text = `Want the unique name '${this.reservation.name}' on #EOS for Scatter? Come bid on it!`;
                window.open('http://twitter.com/share?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(text), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
            },
            ...mapActions([
                Actions.SET_SEARCH_TERMS
            ])
        }
    }
</script>

<style lang="scss">
    .identity {
        height:600px;
        width:100%;

        background-image:url('../copied/assets/hero_bg.png');
        background-position:center;
        background-size:cover;

        display: flex;
        justify-content: center;
        align-items: center;
        text-align:center;
        position: relative;

        padding:20px 50px;

        .bg {
            position:absolute;
            top:0;
            bottom:0;
            left:0;
            right:0;
            z-index:0;
        }

        .content {
            position:relative;
            z-index:1;

            .logo-container {
                color:#fff;

                .logo {
                    position: relative;
                    font-family:'Grand Hotel', sans-serif;
                    font-size:22px;
                    display:inline-block;
                    line-height:22px;
                }

                .tagline {
                    font-size:11px;
                }

                h1 {
                    font-size:40px;
                    font-weight:bold;
                    padding:10px 20px;
                    border-radius:4px;
                    border:1px solid rgba(255,255,255,0.1);
                    margin:20px auto;
                    display:table;
                }
            }

            .modifiers {
                p{
                    color:rgba(255,255,255,0.4);
                    font-size:13px;
                    margin-top:5px;
                }

                .modifier {
                    display:inline-block;
                    margin-left:2px;

                    width:40px;
                    height:40px;
                    font-size:20px;
                    line-height:40px;

                    &.full {
                        background: linear-gradient(to top right, #6689da 0%,#7da0f2 100%);
                        color:#fff;
                    }

                    &:not(.full) {
                        opacity:0.3;
                    }
                }

                &.full {
                    .modifier {
                        box-shadow: 0 5px 12px rgba(0,0,0,0.7),0 0 80px rgba(0,255,255,0.4),0 10px 40px rgba(255,255,0,0.15);
                    }
                }
            }

            .reservation {
                width:350px;
                margin-top:50px;
                font-size:13px;
                color:#fff;

                .box {
                    border:1px solid rgba(255,255,255,0.3);
                    padding:10px;
                    border-radius:4px;
                }

                p {
                    font-size:9px;
                }

                .input-container {
                    width:100%;
                    position: relative;

                    input {
                        width:100%;
                        border-radius:150px;
                        background:#fff;
                        border:0;
                        outline:0;
                        height:50px;
                        line-height:50px;
                        padding:0 20px;
                        margin-bottom:10px;
                        text-align:center;
                        font-size:18px;
                        font-weight:100;
                        color:#b4b4b4;

                        &::-webkit-input-placeholder { color: #b4b4b4; }
                        &::-moz-placeholder { color: #b4b4b4; }
                        &:-ms-input-placeholder { color: #b4b4b4; }
                        &:-moz-placeholder { color: #b4b4b4; }
                    }

                    .circle-button {
                        position:absolute;
                        right:5px;
                        top:5px;
                    }
                }

                .switcher {
                    width:100%;
                    overflow:hidden;
                    margin-top:30px;
                    position: relative;
                    border-radius:150px;
                    box-shadow:inset 0 10px 50px -10px rgba(0,0,0,0.15);
                    background:#172c61;

                    .active-switch {
                        background: linear-gradient(to top right, #13182b 0%,#1b2341 100%);
                        width:50%;
                        height:50px;
                        position:absolute;
                        top:0;
                        z-index:1;

                        transition:left 0.5s ease, border-radius 0.8s ease 0.1s;

                        &.left {
                            left:0;
                            border-top-left-radius:150px;
                            border-bottom-left-radius:150px;
                        }

                        &:not(.left){
                            left:50%;
                            border-top-right-radius:150px;
                            border-bottom-right-radius:150px;
                        }
                    }

                    .switch {
                        cursor: pointer;
                        width:50%;
                        height:50px;
                        float:left;
                        line-height:50px;
                        font-size:16px;
                        font-weight:bold;
                        color:#273e7a;
                        z-index:2;
                        position: relative;

                        transition:background 0.2s ease, color 0.2s ease;

                        &:nth-child(2) {
                            border-top-left-radius:150px;
                            border-bottom-left-radius:150px;
                        }

                        &:last-child {
                            border-top-right-radius:150px;
                            border-bottom-right-radius:150px;
                        }

                        &.active {
                            color:#fff;
                        }
                    }
                }

                .cta {
                    margin-top:20px;
                }

                .terms {
                    font-size:11px;
                    color:#2083d0;
                    text-decoration: underline;
                    margin-top:20px;
                    font-weight:600;
                }
            }
        }
    }
</style>
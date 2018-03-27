<template>
    <section class="hero">

        <div class="bg" id="particles-js"></div>

        <section class="content">
            <section class="logo-container">
                <figure class="logo">Scatter<figure class="airplane"></figure></figure>
                <figure class="tagline">
                    Reservation & Reputation ID Token Airdrop
                </figure>
            </section>

            <section class="reservation" v-if="w3 && onMainNet">
                <section class="input-container">
                    <input placeholder="Choose an Identity Name" v-model="newReservation.name" />
                </section>
                <section class="input-container animated" :class="{'rubberBand':generatedKey}">
                    <input style="padding-right:50px;" placeholder="Enter an EOS Public Key" v-model="newReservation.publicKey" />
                    <circle-button icon="fa-plus-circle" @click.native="popupGenerateKeyPair"></circle-button>
                </section>

                <section class="switcher">
                    <figure class="active-switch" :class="{'left':newReservation.biddable}"></figure>
                    <figure class="switch"
                            @click="newReservation.changeBiddable(true)"
                            :class="{'active':newReservation.biddable}">Biddable</figure>
                    <figure class="switch"
                            @click="newReservation.changeBiddable(false)"
                            :class="{'active':!newReservation.biddable}">Private</figure>
                </section>

                <p style="color:#fff; margin-top:10px;">
                    Private reservations will not take part in the auction. This is for users that don't want their
                    personal data connected to their public keys. Choose wisely, you can not change this later.
                </p>

                <section class="cta">
                    <rounded-button big="Reserve Identity Name" @click.native="popupConfirmNewReservation"></rounded-button>
                </section>
            </section>

            <section class="reservation" v-else>
                <figure class="" style="color:#fff;">
                    <figure class="box" v-if="!w3">
                        You need MetaMask in order to participate in the reservation and auction system.
                        <br><br>
                        <p>If you already <b>have</b> MetaMask, it's probably locked.</p>
                    </figure>
                    <figure class="box" v-else>
                        MetaMask is on the wrong network. You must be on the <b>Main Network</b>.
                    </figure>
                </figure>
                <br>
                <br>

                <section class="cta">
                    <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">
                        <rounded-button big="Get MetaMask Extension" small="Who uses these things anyway?"></rounded-button>
                    </a>
                </section>

            </section>

        </section>

    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing';
    import PopupModel from '../models/PopupModel';
    import ReservationModel from '../models/ReservationModel';
    import {RESERVATION_TYPES} from '../models/ReservationModel';
    import Snackbar from '../models/SnackbarModel'
    import particles from 'particles.js'
    import CachingService from '../services/CachingService'

    import ecc from 'eosjs-ecc'

    export default {
        data(){ return {
            reservationTypes:RESERVATION_TYPES,
            newReservation:ReservationModel.user('','',''),
            generatedKey:false
        }},
        mounted(){
            particlesJS.load('particles-js', './assets/particles.json');
        },
        computed: {
            ...mapGetters([
                'eosContract',
                'scatterContract',
                'mmaddr',
                'onMainNet'
            ]),
            ...mapState([
                'w3'
            ])
        },
        methods: {
            popupGenerateKeyPair(){
                this[Actions.SET_POPUP](PopupModel.generateKeyPair(_publicKey => {
                    setTimeout(() => {
                        this.newReservation.publicKey = _publicKey;
                        this.generatedKey = true;
                        setTimeout(() => {
                            this.generatedKey = false;
                        }, 1000)
                    }, 250)
                }));
            },
            popupConfirmNewReservation(){
                const validName = name => /^[-a-z0-9_]+$/i.test(name);
                if(this.newReservation.name.trim().length <= 2 || !this.newReservation.publicKey.trim().length) {
                    this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        Both a name and an EOS public key is required. You can generate a new public key by using the
                        plus button in the public key input field.
                    `));
                    return false;
                }

                if(!validName(this.newReservation.name)) {
                    this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        That name is invalid. Names must be made up of only letters, numbers, _ and -
                    `));
                    return false;
                }

                if(this.newReservation.name.trim().length > 20 || this.newReservation.name.trim().length < 2) {
                    this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        Names must be between 2 and 20 characters.
                    `));
                    return false;
                }

                if(!ecc.isValidPublic(this.newReservation.publicKey)){
                    this[Actions.PUSH_SNACKBAR](new Snackbar(`
                        The EOS Public Key you entered is invalid.
                    `));
                    return false;
                }

                this[Actions.SET_POPUP](PopupModel.confirmNewReservation(this.newReservation, done => {

                }));
            },
            ...mapActions([
                Actions.SET_POPUP,
                Actions.PUSH_SNACKBAR
            ])
        }
    }


</script>

<style lang="scss">
    .hero {
        height:700px;
        width:100%;

        background-image:url('../copied/assets/hero_bg.png');
        background-position:center;

        display: flex;
        justify-content: center;
        align-items: center;
        text-align:center;
        position: relative;

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
                    font-size:72px;
                    display:inline-block;
                    line-height:72px;

                    .airplane {
                        position: absolute;
                        top: 1px;
                        right: -23px;

                        width:33px;
                        height:23px;
                        background-image:url('../copied/assets/airplane.png');
                    }
                }

                .tagline {
                    font-size:13px;
                    font-weight:bold;
                }
            }

            .reservation {
                width:350px;
                margin-top:50px;
                font-size:13px;

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
                    margin-top:30px;
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
    @media (max-width:550px) {
        .hero {
            .content {
                .reservation {
                    padding: 0 20px;
                }
            }
        }
    }
</style>
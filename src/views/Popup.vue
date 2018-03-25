<template>
    <section>
        <section class="blackout" :class="{'show':!!popup}"></section>

        <transition name="open-up">
            <section class="popup-container" v-if="!!popup">
                <section class="popup">

                    <div class="bg"></div>
                    <div class="popup-particles" id="popup-particles"></div>

                    <section class="container" :class="{'opaque':popup.loading}">
                        <figure class="close">
                            <circle-button icon="fa-times-circle" @click.native="closePopup"></circle-button>
                        </figure>

                        <popup-generate-key-pair v-if="popup.type === popupTypes.GENERATE_KEY_PAIR"></popup-generate-key-pair>
                        <popup-confirm-new-reservation v-if="popup.type === popupTypes.CONFIRM_NEW_RESERVATION"></popup-confirm-new-reservation>
                        <popup-confirm-sale v-if="popup.type === popupTypes.CONFIRM_SALE"></popup-confirm-sale>
                        <popup-confirm-unbid v-if="popup.type === popupTypes.CONFIRM_UNBID"></popup-confirm-unbid>
                        <popup-bid v-if="popup.type === popupTypes.BID"></popup-bid>
                    </section>

                    <section class="loading" v-if="popup.loading">
                        <figure class="logo" v-if="popup.type !== popupTypes.GENERATE_KEY_PAIR">
                            Scatter
                            <p class="open-sans" style="color:#fff;"><b>Do <u>not</u> close this window.</b></p>
                            <br>
                            <p class="open-sans"><b>Sorry this takes so long, it's Ethereum.</b></p>
                        </figure>
                        <figure class="logo" v-else>
                            Scatter
                            <p class="open-sans" style="color:#fff;"><b>Gathering Entropy.</b></p>
                        </figure>

                        <section class="boxLoading">
                            <!--<figure class="dot1"></figure>-->
                            <!--<figure class="dot2"></figure>-->
                        </section>
                    </section>

                </section>
            </section>
        </transition>


    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'
    import particles from 'particles.js'

    import {POPUP_TYPES} from '../models/PopupModel';
    import PopupModel from '../models/PopupModel';
    import ReservationModel from '../models/ReservationModel'

    export default {
        data(){ return {
            popupTypes:POPUP_TYPES
        }},
        computed: {
            ...mapState([
                'popup'
            ])
        },
        mounted(){
//            setTimeout(() => {
//                const p = new PopupModel(POPUP_TYPES.CONFIRM_NEW_RESERVATION, ReservationModel.user(), () => {});
//                p.loading = true;
//                this[Actions.SET_POPUP](p);
//            }, 500)
        },
        methods: {
            closePopup(){
                this.popup.resolve(null);
                this[Actions.SET_POPUP](null)
            },
            ...mapActions([
                Actions.SET_POPUP
            ])
        },
        watch:{
            popup:function(){
                if(this.popup){
                    setTimeout(() => {
                        particlesJS.load('popup-particles', './assets/particles.json');
                    }, 500)
                }
            }
        }
    }
</script>

<style lang="scss">
    .blackout {
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:#030a1e;
        opacity:0;
        visibility: hidden;
        z-index:9999;
        transition: opacity 0.2s ease;

        &.show {
            opacity:0.9;
            visibility: visible;
        }
    }

    .open-up-enter {
        max-height:2px;
        max-width:0;

    }

    .open-up-enter-to {
        max-height:1000px;
        max-width:800px;
    }

    .open-up-leave {
        transform:translateY(0px);
        opacity:1;

    }
    .open-up-leave-active {

    }
    .open-up-leave-to {
        transform:translateY(-50px);
        opacity:0;
        visibility: hidden;
    }

    .popup-container {
        position:fixed;
        top:50px;
        left:0;
        right:0;
        text-align:center;

        z-index:10000;
        margin:0 auto;
        overflow: hidden;

        transition: max-width 0.4s ease 0.2s, max-height 0.5s ease 0.5s, transform 0.5s ease, opacity 0.2s ease;


        .popup {
            display:inline-block;
            border-radius:4px;
            max-width:760px;
            width:calc(100% - 40px);
            margin:0 20px;
            background: linear-gradient(to top right, #081644 0%,#1a3872 100%);
            position: relative;
            box-shadow:0 20px 80px #040a1c;

            .loading {
                position:absolute;
                top:0;
                bottom:0;
                left:0;
                right:0;
                z-index:3;
                display:flex;
                justify-content: center;
                align-items: center;

                .logo {
                    position: absolute;
                    font-family:'Grand Hotel', sans-serif;
                    font-size:72px;
                    display:inline-block;
                    line-height:72px;
                    color:#fff;
                    animation: logo-anim 4.5s linear infinite;
                }

                @keyframes logo-anim {
                    0% { text-shadow:0 0 100px #6689da; }
                    20% { text-shadow:10px 0 200px #96b4fb; }
                    40% { text-shadow:0 10px 100px #5578c9; }
                    60% { text-shadow:-10px 0 100px #b2f097; }
                    80% { text-shadow:0 -10px 200px #13182b; }
                    100% { text-shadow:0 0 100px #6689da; }
                }
            }

            .bg {
                position:absolute;
                top:0;
                bottom:0;
                left:0;
                right:0;
                background-image: url('../copied/assets/popup_bg.png');
                z-index:1;
            }

            .popup-particles {
                position: absolute;
                top:0;
                bottom:0;
                left:0;
                right:0;
                z-index:0;
            }

            .close {
                position: absolute;
                top:20px;
                right:20px;
            }

            .container {
                position: relative;
                z-index:2;
                padding:100px;
                opacity:1;
                transition:opacity 0.5s ease;

                &.opaque {
                    opacity:0.02;
                }
            }



            .kv {
                font-size:11px;
                color:#7da0f2;

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

            h1 {
                font-size:36px;
                line-height: 36px;
                margin:20px 0;
                color:#fff;
                font-weight:500;
            }

            p {
                max-width:400px;
                margin:0 auto;
                font-size:11px;
                line-height:14px;
                color:#7da0f2;

                .white {
                    color:#fff;
                }

                .spacer {
                    height:5px;
                }
            }

            hr {
                border:0;
                width:50px;
                height:1px;
                background:rgba(255,255,255,0.1);
                margin:30px auto;
            }

            .action {
                margin:50px auto 0;
                max-width:350px;
                display:inline-block;
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
        }
    }






</style>
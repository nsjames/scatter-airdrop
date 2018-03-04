<template>
    <section class="hero">

        <div class="bg" id="particles-js"></div>

        <section class="content">
            <section class="logo-container">
                <figure class="logo">Scatter<figure class="airplane"></figure></figure>
                <figure class="tagline">
                    RIDL Token Airdrop, Identity Reservation & Auction
                </figure>
            </section>

            <section class="reservation">
                <figure class="" style="color:#fff;">
                    We know you are itching to reserve your name and take part in the auction,
                    but we're not quite ready yet.
                </figure>
                <br>

                <section class="cta">
                    <rounded-button big="Join our Telegram" @click.native="joinTelegram"></rounded-button>
                </section>

            </section>

        </section>


    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing';

    export default {
        data(){ return {

        }},
        mounted(){
            particlesJS.load('particles-js', './assets/particles.json');
        },
        methods: {
            joinTelegram(){
                location.href = 'https://t.me/Scatter';
            }
        }
    }


</script>

<style lang="scss">
    .hero {
        height:760px;
        width:100%;

        background-image:url('../copied/assets/hero_bg.png');
        background-position:center;
        background-size:cover;

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



    @media (max-height: 600px) {
        .hero {
            height:auto;
            padding-top:100px;
            padding-bottom:100px;
        }
    }
</style>
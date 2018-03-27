<template>
    <section class="rounded-button sunshine">
        <figure class="rb-big">{{big}}</figure>
        <figure class="rb-small" v-if="small">{{small}}</figure>
    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'

    export default {
        data(){ return {

        }},
        computed: {
            ...mapState([

            ])
        },
        methods: {
            ...mapActions([

            ])
        },
        props:['big', 'small']
    }
</script>

<style lang="scss">
    .rounded-button {
        cursor: pointer;
        position: relative;
        max-width:350px;
        width:100%;
        height:70px;
        text-align:center;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        border-radius:150px;
        overflow:hidden;

        background: linear-gradient(to top right, #6689da 0%,#7da0f2 100%);
        box-shadow:0 1px 0 #5578c9, 0 -1px 0 #96b4fb, 0 8px 15px rgba(0,0,0,0.2);
        transform:scale(1);
        border:0 solid transparent;
        color:#fff;
        opacity:1;
        user-select: none;

        transition:transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease, color 0.2s ease, opacity 0.2s ease;

        .rb-big {
            position: relative;
            font-size:20px;
            font-weight:bold;
            z-index:2;
            width:100%;
        }

        .rb-small {
            position: relative;
            font-size:11px;
            font-weight:bold;
            z-index:2;
        }

        &:active {
            background:transparent;
            border:3px solid #6689da;
            box-shadow:0 2px 5px rgba(0,0,0,0.25);
            color:#96b4fb;
            opacity:0.2;
        }
    }
</style>
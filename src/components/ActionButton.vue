<template>
    <section class="action-button sunshine sun-stick" :class="{'active sun-open':active}">
        <figure class="text">{{text}}</figure>
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
        props:['text', 'active']
    }
</script>

<style lang="scss">
    .action-button {
        cursor: pointer;
        position: relative;
        width:70px;
        height:30px;
        line-height:30px;
        text-align:center;
        display:inline-block;
        margin-left:4px;

        font-size:11px;
        color:#fff;
        font-weight:bold;


        border-radius:150px;
        overflow:hidden;

        border:2px solid #6e93ea;
        user-select: none;
        padding-top:0;

        transition:transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease, color 0.2s ease, opacity 0.2s ease, padding-top 0.2s ease;

        .text {
            position: relative;
            z-index:2;
        }

        &:hover, &.active {
            background:transparent;
            border:0 solid transparent;
            padding-top:2px;
            box-shadow:0 5px 9px rgba(0,0,0,0.25);
        }
    }
</style>
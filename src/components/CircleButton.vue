<template>
    <section class="circle-button sunshine sun-stick">
        <figure class="icon">
            <i class="fa" :class="[icon]"></i>
        </figure>
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
        props:['icon']
    }
</script>

<style lang="scss">
    .circle-button {
        text-align:center;
        display: inline-block;
        cursor: pointer;
        width:40px;
        height:40px;
        background:#fff;
        box-shadow:0 5px 13px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1);
        border-radius:50px;
        transform:scale(1);
        transition:background 0.8s ease, box-shadow 0.4s ease, transform 0.2s ease;
        overflow:hidden;

        .icon {
            position: relative;
            font-size:34px;
            color: #e0e0e0;
            text-shadow: inset 0 -2px 10px rgba(0,0,0,0.1), inset 0 -1px 2px rgba(0,0,0,0.1);
            transition:color 0.2s ease;
            z-index:2;
        }

        &:hover {
            box-shadow:0 8px 16px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1);
            background:transparent;

            .icon {
                color:#fff;
            }
        }

        &:active {
            box-shadow:0 2px 3px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.2);
            background:transparent;
            transform:scale(0.9);

            .icon {
                color:rgba(255,255,255,0.2);
            }
        }
    }
</style>
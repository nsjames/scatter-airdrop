<template>
    <section class="snackbars">
        <transition-group name="list">
            <figure class="snackbar" :key="snackbar.unique" v-for="snackbar in snackbars" @click="remove(snackbar)">
                {{snackbar.message}}
            </figure>
        </transition-group>
    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'
    import particles from 'particles.js'

    export default {
        data(){ return {

        }},
        computed: {
            ...mapState([
                'snackbars'
            ])
        },
        methods: {
            remove(snackbar){
                this[Actions.REMOVE_SNACKBAR](snackbar);
            },
            ...mapActions([
                Actions.REMOVE_SNACKBAR
            ])
        }
    }
</script>

<style lang="scss">
    .snackbars {
        position:fixed;
        top:0;
        left:0;
        right:0;
        text-align:center;
        z-index:10002;

        .snackbar {
            cursor: pointer;
            margin:5px auto 0;
            display:table;
            padding:15px;
            max-width:450px;
            width:100%;
            background:#fff;
            border-radius:4px;
            font-size:13px;
            text-align:left;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            border-bottom:5px solid red;
            transition:background 0.5s ease, border-bottom 0.5s ease, opacity 0.2s ease, transform 0.2s ease;

            &:hover {
                background:yellow;
                border-bottom:5px solid #c5c500;
            }
        }
    }
</style>
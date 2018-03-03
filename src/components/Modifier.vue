<template>
    <section class="modifier">
        {{bin(text)}}
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
            bin(t){
                switch(t){
                    case '0x41': return 'A';
                    case '0x42': return 'B';
                    case '0x43': return 'C';
                    case '0x44': return 'D';
                }
            },
            ...mapActions([

            ])
        },
        props:['text']
    }
</script>

<style lang="scss">
    .modifier {
        text-align:center;
        cursor:help;
        height:16px;
        width:16px;
        line-height:16px;

        background: linear-gradient(to top right, #2e2e4a 0%,#343454 100%);
        color:#9594cd;
        border-radius:4px;
        box-shadow:0 2px 5px rgba(0,0,0,0.2);

        font-size:9px;
        font-weight:bold;
        display:inline-block;
    }
</style>
<template>
    <section>
        <section class="kv">
            <figure class="key">GENERATE NEW</figure>
            <figure class="value">EOS KEY PAIR</figure>
        </section>

        <h1>Read Carefully</h1>

        <p>
            <span class="white">
                <a href="https://github.com/nsjames/scatter-airdrop/blob/master/src/popups/GenerateKeyPair.vue#L67" target="_blank">
                    <u>Click this link to read the code that generates this key pair</u>
                </a>
            </span>
            <br>
            <br>
            The key pair generated using this popup is never sent to any back end server,
            or recorded into any Scatter database. Feel free to read through the code yourself
            and make sure that no shenanigans are happening behind the scenes.
        </p>
        <hr>
        <p>
            <span class="white">
                Once you click the button below, the public key will automatically be inserted into
                the Identity Name Reservation input field and the private key will <span style="color:yellow;">be copied to your
                clipboard</span>. Make sure you paste it somewhere and save it for later
                <u><b>or you will not be able to claim your Identity Name on the EOS mainnet!</b></u>
            </span>
        </p>

        <section class="action">
            <rounded-button big="Generate" @click.native="generate"></rounded-button>
        </section>

        <!-- INPUT FIELD USED FOR COPYING -->
        <input tabindex="-1" type="text" ref="copier" class="copier" />
    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'
    import ecc from 'eosjs-ecc'
    import Snackbar from '../models/SnackbarModel'

    export default {
        data(){ return {

        }},
        mounted(){
            this.popup.loading = true;
            // Doing this at popup load to pre-gather entropy.
            // Otherwise document.execCommand will fail in some browsers.
            setTimeout(() => {
                ecc.randomKey();
                setTimeout(() => {
                    this.popup.loading = false;
                }, 100)
            }, 1000)
        },
        computed: {
            ...mapState([
                'popup'
            ])
        },
        methods: {
            generate(){
                // Randomizing an EOS key pair using eosjs-ecc
                // https://github.com/EOSIO/eosjs-ecc
                ecc.randomKey().then(privateKey => {
                    this.copyKeyToClipboard(privateKey);
                    this.popup.resolve(ecc.privateToPublic(privateKey));
                    this[Actions.PUSH_SNACKBAR](new Snackbar('Copied private key to clipboard. Paste it somewhere and save it.'));
                    this[Actions.SET_POPUP](null);
                })
            },
            copyKeyToClipboard(privateKey){
                // The only way to copy text in javascript is by putting it into an input field,
                // then selecting the whole text and executing a global document command to copy any
                // selected text.

                // We are getting a reference to the hidden input field.
                let copier = this.$refs.copier;

                // Then we're going to set it's value to the private key
                copier.value = privateKey;

                // And select the entire text within the input field
                copier.select();

                // And finally copy all text that is selected on the document/web-page
                document.execCommand("copy");

                // We no longer need the private key so we are removing it from memory
                copier.value = '';
                privateKey = '';
            },
            ...mapActions([
                Actions.SET_POPUP,
                Actions.PUSH_SNACKBAR
            ])
        }
    }
</script>

<style lang="scss">
    .copier {
        position:absolute;
        top:-9999px;
    }

</style>
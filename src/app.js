import VueInitializer from './vue/VueInitializer';
import {Routing} from './vue/Routing';
import * as Actions from './store/constants'
import {RouteNames} from './vue/Routing'
import config from './util/config';

import ContractService from './services/ContractService'
import CachingService from './services/CachingService'

import ViewBase from './views/Base.vue'
import Popup from './views/Popup.vue'
import Snackbars from './views/Snackbars.vue'
import LandingHero from './components/LandingHero.vue'
import Hero from './components/Hero.vue'
import CircleButton from './components/CircleButton.vue'
import RoundedButton from './components/RoundedButton.vue'
import ActionButton from './components/ActionButton.vue'
import Modifier from './components/Modifier.vue'
import ListItem from './components/ListItem.vue'

import GenerateKeyPair from './popups/GenerateKeyPair.vue'
import ConfirmNewReservation from './popups/ConfirmNewReservation.vue'
import ConfirmSellName from './popups/ConfirmSellName.vue'
import ConfirmUnbid from './popups/ConfirmUnbid.vue'
import Bid from './popups/Bid.vue'

import Web3 from 'web3';

const isLive = process.env.LIVE === 'true';

class App {

    constructor(){
        const routes = Routing.routes();
        const components = [
            {tag:'view-base', vue:ViewBase},
            {tag:'popup', vue:Popup},
            {tag:'snackbars', vue:Snackbars},
            {tag:'hero', vue:Hero},
            {tag:'landing-hero', vue:LandingHero},
            {tag:'circle-button', vue:CircleButton},
            {tag:'rounded-button', vue:RoundedButton},
            {tag:'action-button', vue:ActionButton},
            {tag:'modifier', vue:Modifier},
            {tag:'list-item', vue:ListItem},
            {tag:'popup-generate-key-pair', vue:GenerateKeyPair},
            {tag:'popup-confirm-new-reservation', vue:ConfirmNewReservation},
            {tag:'popup-confirm-sale', vue:ConfirmSellName},
            {tag:'popup-confirm-unbid', vue:ConfirmUnbid},
            {tag:'popup-bid', vue:Bid},
        ];

        const middleware = (to, next, store) => {
            if(!isLive && to.name !== RouteNames.LANDING) next({name:RouteNames.LANDING});
            else if(isLive && to.name === RouteNames.LANDING) next({name:RouteNames.INDEX});
            else next();
        };

        new VueInitializer(routes, components, middleware, (router, store) => {
            if(isLive) this.initializeEthereum(store);
        });

        document.addEventListener('scatterLoaded', async () => {

            // const scatter = window.scatter;
            // const network = {blockchain:'eth', host:'localhost', port:8545};
            // const web3 = scatter.eth(network, Web3, "http");
            //
            // const identity = await scatter.getIdentity({ accounts:[network] });
            // const publicKey = identity.accounts[0].publicKey;
            //
            // const abi = require('./copied/assets/eos_abi.json')
            // const eosToken = new web3.eth.Contract(abi, '0xb2fba330f7a95d337f62b54f8a563fed2da24023');
            //
            // const requiredFields = { personal:['firstname'], location:['city'] };
            // const fieldsCallback = fields => console.log('FIELDS CALLBACK', fields);
            // const options = {from:publicKey, abi, requiredFields, fieldsCallback};
            // eosToken.methods.approve('0xdeb535139a6cce61e313eafa78627f0bb61b892f', '10').send(options)
            //     .on('transactionHash', async (hash) => console.log('hash', hash))
            //     .on('receipt', receipt => console.log('receipt', receipt))
            //     .on('error', error => console.log('error', error));
        })
    }

    async initializeEthereum(store){

        let web3 = window.web3;
        if(typeof web3 === 'undefined') return false;

        //TODO: Catch unsupported browsers



        web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
        web3.eth.net.getId().then(id => {
            store.dispatch(Actions.SET_WS_NET, id)
        });
        this.getAccounts(web3, store);
    }

    getAccounts(web3, store){
        const banned = [
            '0x97afb4abae4202e4598c3da44d3448aea0a0a8a8',
            '0xf7f6462f9cb01935a9fb13b9f0cd40f6b1e5826e'
        ];
        web3.eth.getAccounts((err, accounts) => {
            if(accounts.length) {
                if(accounts[0] !== web3.defaultAccount){
                    if(!banned.includes(accounts[0])) {
                        web3.defaultAccount = accounts[0];
                        store.dispatch(Actions.SET_WEB3, web3);
                    }
                }
            } else store.dispatch(Actions.SET_WEB3, null);

            setTimeout(() => this.getAccounts(web3, store), 2000);
        });
    }

}

const popup = new App();

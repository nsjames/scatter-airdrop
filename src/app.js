import VueInitializer from './vue/VueInitializer';
import {Routing} from './vue/Routing';
import * as Actions from './store/constants'
import {RouteNames} from './vue/Routing'
import config from './util/config';

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
import Bid from './popups/Bid.vue'

import Web3 from 'web3';

const isLive = process.env.LIVE === 'true' ? true : false;

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
            {tag:'popup-bid', vue:Bid},
        ];

        const middleware = (to, next, store) => {
            if(!isLive && to.name !== RouteNames.LANDING) next({name:RouteNames.LANDING});
            else next();
        };

        new VueInitializer(routes, components, middleware, (router, store) => {
            if(isLive) this.initializeEthereum(store);
        });
    }

    async initializeEthereum(store){
        let web3 = window.web3;
        if(typeof web3 === 'undefined'){
            alert("You need meta mask");
            return false;
        }

        web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
        console.log('hi', store.state.w3);

        web3.eth.getAccounts((err, accounts) => {
            web3.defaultAccount = accounts[0];
            store.dispatch(Actions.SET_WEB3, web3);
            setTimeout(() => this.getAccounts(web3, store), 1000);
        });

        this.getAccounts(web3, store);
    }

    getAccounts(web3, store){
        web3.eth.getAccounts((err, accounts) => {
            if(accounts[0] !== web3.defaultAccount){
                web3.defaultAccount = accounts[0];
                store.dispatch(Actions.SET_WEB3, web3);
            }
            setTimeout(() => this.getAccounts(web3, store), 2000);
        });
    }

}

const popup = new App();

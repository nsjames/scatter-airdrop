import Vue from 'vue'
import Vuex from 'vuex';

import {mutations} from './mutations';
import {actions} from './actions';

Vue.use(Vuex);

const state = {
    popup:null,
    snackbars:[],
    w3:null,
    ws:null,

    terms:'',
};

const getters = {
    newReservation:state => state.popup.data,
    eosContract:state => new state.w3.eth.Contract(require('../copied/assets/eos_abi.json'), process.env.EOS_CONTRACT_ADDRESS),
    scatterContract:state => new state.w3.eth.Contract(require('../copied/assets/scatter_abi.json'), process.env.SCATTER_CONTRACT_ADDRESS),
    mmaddr:state => state.w3.defaultAccount,
    ethAddress:state => state.w3 ? state.w3.defaultAccount : '',
    searchTerms:state => state.terms,
    sellingReservation:state => state.popup.data.reservation,
    sellingBid:state => state.popup.data.bid,
};

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
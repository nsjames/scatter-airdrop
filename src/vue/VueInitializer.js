import Vue from 'vue'
import VueMoment from 'vue-moment';

import VueRouter from 'vue-router'
import {Routing} from './Routing';
import {store} from '../store/store'
import * as Actions from '../store/constants'

/***
 * Sets up an instance of Vue.
 * This is shared between the popup.js and prompt.js scripts.
 */
export default class VueInitializer {

    constructor(routes,
                components,
                middleware = () => {},
                routerCallback = () => {}){
        this.setupVuePlugins();
        this.setupVueFilters();
        this.registerComponents(components);
        let router = this.setupRouting(routes, middleware);

        this.setupVue(router);
        routerCallback(router, store);
    }

    setupVuePlugins(){
        Vue.use(VueRouter);
        Vue.use(VueMoment);
    }

    setupVueFilters(){
        Vue.filter('price', (value) => value <= 0 ? 0 : value / 1000000000000000000)
    }

    registerComponents(components){
        components.map(component => {
            Vue.component(component.tag, component.vue);
        });
    }

    setupRouting(routes, middleware){
        let router = new VueRouter({routes});
        router.beforeEach((to, from, next) => middleware(to, next, store));
        return router;
    }

    setupVue(router){
        let app = new Vue({router, store});
        app.$mount('#scatter-airdrop');
        document.getElementById('scatter-airdrop').removeAttribute('id')
    }

}
import Index from '../views/Index.vue'
import Landing from '../views/Landing.vue'
import Reservation from '../views/Reservation.vue'

export const RouteNames = {
    INDEX:'index',
    LANDING:'landing',
    RESERVATION:'reservation'
};

const RouteViews = {
    [RouteNames.INDEX]:Index,
    [RouteNames.LANDING]:Landing
};

export class Routing {

    static builder(){
        const routeNames = Object.keys(RouteNames).map(key => RouteNames[key]);

        let routesBuilder = {};
        routeNames.map(routeName => {
            routesBuilder[routeName] = {
                path:routeName === RouteNames.INDEX ? '' : '/'+routeName,
                name:routeName,
                component: RouteViews[routeName]
            }
        });

        return routesBuilder;
    }

    static routes(){
        // return Object.keys(Routing.builder())
        //     .map(routeName => Routing.builder()[routeName]);
        return [
            { path: '', component: Index, name:RouteNames.INDEX },
            { path: 'landing', component: Landing, name:RouteNames.LANDING },
            { path: '/identity/:name', component: Reservation, name:RouteNames.RESERVATION },
        ]
    }
}
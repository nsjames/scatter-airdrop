import axios from 'axios';
import ReservationModel from '../models/ReservationModel'
import BidModel from '../models/BidModel'

const baseURL = process.env.CACHER_URI;
const http = axios.create({baseURL});

export default class CachingService {

    static cacheNewReservation(reservation){
        return new Promise((resolve, reject) => {
            http.post('reservation', reservation).then(done => {
                console.log('cacheNewReservation',done);
                resolve(true);
            }).catch(err => console.error(err))
        })
    }

    static getTrendingReservations(ethkey = ''){
        return new Promise((resolve, reject) => {
            http.get(`trending?ethkey=${ethkey}`)
                .then(result => resolve(result.data.reservations.map(ReservationModel.fromJson)))
                .catch(err => resolve([]))
        })
    }

    static getReservations(filter, sort, ethkey = ''){
        return new Promise((resolve, reject) => {
            http.get(`reservations/${filter}?sort=${sort}&ethkey=${ethkey}`)
                .then(result => resolve(result.data.reservations.map(ReservationModel.fromJson)))
                .catch(err => resolve([]))
        })
    }

    static getReservationsByEthKey(ethkey){
        return new Promise((resolve, reject) => {
            http.get(`reservations/eth/${ethkey}`)
                .then(result => resolve(result.data.reservations.map(ReservationModel.fromJson)))
                .catch(err => resolve([]))
        })
    }

    static bid(bid){
        return new Promise((resolve, reject) => {
            http.post('bid', bid).then(done => {
                console.log('bid',done);
                resolve(true);
            }).catch(err => console.error(err))
        })
    }

    static bids(rId){
        return new Promise((resolve, reject) => {
            http.get('bids/'+rId)
                .then(result => resolve(result.data.bids.map(BidModel.fromJson)))
                .catch(err => resolve([]))
        })
    }

    static getOpenBidsByEthKey(ethkey){
        return new Promise((resolve, reject) => {
            http.get(`bids/open/${ethkey}`)
                .then(result => resolve(result.data.bids.map(BidModel.fromJson)))
                .catch(err => resolve([]))
        })
    }

}
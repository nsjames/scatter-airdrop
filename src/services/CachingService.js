import axios from 'axios';
import ReservationModel from '../models/ReservationModel'
import BidModel from '../models/BidModel'
import {prep} from '../util/sockets'

let baseURL = process.env.CACHER_URI;
let http = axios.create({baseURL});

export default class CachingService {

    static cacheNewReservationPrivateData(reservation){
        return new Promise((resolve, reject) => {
            http.post('reservation', reservation)
                .then(done => resolve(true))
                .catch(err => console.error(err))
        })
    }

    static cacheNewReservationPrivateDataForDapp(reservation){
        return new Promise((resolve, reject) => {
            http.post('reservation/dapp', reservation)
                .then(done => resolve(true))
                .catch(err => console.error(err))
        })
    }

    static getOpenDappDecisions(){
        return new Promise((resolve, reject) => {
            http.get(`open-dapp`)
                .then(result => resolve(result.data.reservations.map(ReservationModel.fromJson)))
                .catch(err => resolve([]))
        })
    }

    static getTrendingReservations(ethkey = ''){
        return new Promise((resolve, reject) => {
            http.get(`trending?ethkey=${ethkey}`)
                .then(result => resolve(result.data.reservations.map(ReservationModel.fromJson)))
                .catch(err => resolve([]))
        })
    }

    static getReservations(filter, sort, ethkey = '', page = 0){
        return new Promise((resolve, reject) => {
            http.get(`reservations/${filter}?sort=${sort}&ethkey=${ethkey}&page=${page}`)
                .then(result => resolve(result.data.reservations.map(ReservationModel.fromJson)))
                .catch(err => resolve([]))
        })
    }

    static getReservationsByEthKey(ethkey){
        return new Promise((resolve, reject) => {
            http.get(`reservations/eth/${ethkey}`)
                .then(result => resolve(result.data.reservations.map(ReservationModel.fromJson)))
                .catch(err => {
                    console.error(err);
                    resolve([])
                })
        })
    }

    static bid(bid){
        return new Promise((resolve, reject) => {
            http.post('bid', bid)
                .then(done => resolve(true))
                .catch(err => console.error(err))
        })
    }

    static bids(rId){
        return new Promise((resolve, reject) => {
            http.get('bids/'+rId)
                .then(result => resolve(result.data.bids.map(BidModel.fromJson)))
                .catch(err => resolve([]))
        })
    }

    static getOpenBidsByEthKey(ethkey, bidState){
        return new Promise((resolve, reject) => {
            http.get(`bids/open/${ethkey}?state=${bidState}`)
                .then(result => resolve(result.data.bids.map(BidModel.fromJson)))
                .catch(err => resolve([]))
        })
    }

    static sell(ethkey, reservationId){
        return new Promise((resolve, reject) => {
            http.post(`reservations/sell`, {ethkey, reservationId})
                .then(result => resolve(result.data.sold))
                .catch(err => resolve(false))
        })
    }

    static unsell(ethkey, reservationId){
        return new Promise((resolve, reject) => {
            http.post(`reservations/sell/revert`, {ethkey, reservationId})
                .then(result => resolve(result.data.sold))
                .catch(err => resolve(false))
        })
    }

    static unbid(ethkey, reservationId, price){
        return new Promise((resolve, reject) => {
            http.post(`unbid`, {ethkey, reservationId, price})
                .then(result => resolve(result.data.retracted))
                .catch(err => resolve(false))
        })
    }

    static rebid(ethkey, reservationId){
        return new Promise((resolve, reject) => {
            http.post(`rebid`, {ethkey, reservationId})
                .then(result => resolve(result.data.rebid))
                .catch(err => resolve(false))
        })
    }

    static getReservationByName(name){
        return new Promise((resolve, reject) => {
            http.get(`resname?name=${name}`)
                .then(result => resolve(result.data.reservation))
                .catch(err => resolve(false))
        })
    }

    static totalReservations(){
        return new Promise((resolve, reject) => {
            http.get(`totalres`)
                .then(result => resolve(result.data.reservations))
                .catch(err => resolve(false))
        })
    }

}
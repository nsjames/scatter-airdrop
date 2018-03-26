import {random} from './random'

export let prep = obj => JSON.stringify(Object.assign(obj, {r:random()}));
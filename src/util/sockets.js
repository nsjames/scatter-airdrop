import {random} from './random'

export const prep = obj => JSON.stringify(Object.assign(obj, {r:random()}));
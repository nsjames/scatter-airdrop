import * as Mutations from './constants'

export const mutations = {
    [Mutations.SET_WEB3]:(state, w3) => state.w3 = w3,
    [Mutations.SET_EOS_CONTRACT]:(state, c) => state.eosContract = c,
    [Mutations.SET_SCATTER_CONTRACT]:(state, c) => state.scatterContract = c,
    [Mutations.SET_POPUP]:(state, popup) => state.popup = popup,
    [Mutations.PUSH_SNACKBAR]:(state, snackbar) => state.snackbars.push(snackbar),
    [Mutations.REMOVE_SNACKBAR]:(state, snackbar) => {
        clearTimeout(snackbar.timeout);
        state.snackbars.splice(state.snackbars.indexOf(snackbar), 1);
    },
    [Mutations.SET_SEARCH_TERMS]:(state, x) => state.terms = x,
};
import * as Actions from './constants'

export const actions = {
    [Actions.SET_WS]:({commit}, ws) => commit(Actions.SET_WS, ws),
    [Actions.SET_WS_NET]:({commit}, n) => commit(Actions.SET_WS_NET, n),
    [Actions.SET_WEB3]:({commit}, w3) => commit(Actions.SET_WEB3, w3),
    [Actions.SET_EOS_CONTRACT]:({commit}, c) => commit(Actions.SET_EOS_CONTRACT, c),
    [Actions.SET_SCATTER_CONTRACT]:({commit}, c) => commit(Actions.SET_SCATTER_CONTRACT, c),
    [Actions.SET_POPUP]:({commit}, popup) => commit(Actions.SET_POPUP, popup),
    [Actions.REMOVE_SNACKBAR]:({commit}, snackbar) => commit(Actions.REMOVE_SNACKBAR, snackbar),
    [Actions.PUSH_SNACKBAR]:({commit}, snackbar) => {
        snackbar.timeout = setTimeout(() => commit(Actions.REMOVE_SNACKBAR, snackbar), snackbar.seconds * 1000);
        commit(Actions.PUSH_SNACKBAR, snackbar);
    },
    [Actions.SET_SEARCH_TERMS]:({commit}, x) => commit(Actions.SET_SEARCH_TERMS, x),

};
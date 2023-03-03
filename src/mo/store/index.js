export const state = () => ({
  value: null,
})

export const mutations = {
  VALUE_MUTATION(state, payload) {
    state.value = payload
  },
}

export const getters = {
  VALUE_GETTER(state) {
    return state.value
  },
}

export const actions = {
  nuxtServerInit({ state, commit, dispatch }, { $axios, app, req, res }) {},
}

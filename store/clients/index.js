import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  client: null
}

const modules = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules
}

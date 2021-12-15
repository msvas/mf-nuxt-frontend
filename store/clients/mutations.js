import { SET_CLIENT } from './mutations-types'

export default {
  [SET_CLIENT]: (state, client) => {
    state.client = client
  }
}

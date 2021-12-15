import * as types from './mutations-types'
import ClientService from '@/services/clients'

export default {
  getClient: async ({ commit }, data) => {
    let response = await ClientService.get(data)
    commit(types.SET_CLIENT, response.data)
  },

}

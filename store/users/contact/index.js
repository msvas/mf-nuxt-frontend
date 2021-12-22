import ContactService from '@/services/contact'

const SET_CONTACT_STATUS = 'SET_CONTACT_STATUS'

export default {
  namespaced: true,
  state() {
    return {
      status: null
    }
  },

  actions: {

    sendMail: async ({ commit }, data) => {
      let response = await ContactService.sendMail(data)

      commit(SET_CONTACT_STATUS, response.data)
    },

  },
  mutations: {
    [SET_CONTACT_STATUS]: (state, status) => {
      state.status = status
    },
  }
}

import Vue from 'vue'

const RESOURCE_URL = 'api/v1/users/clients'

export default {
  get(clientId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${clientId}/info`)
  },

  getTypeAndRegion(email) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/type_and_region`, { client: { email: email } })
  },

  checkCPF(cpf) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/check_cpf`, { client: { cpf: cpf } })
  },

  checkCNPJ(cnpj) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/check_cnpj`, { client: { cnpj: cnpj } })
  },

  checkEmail(email) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/check_email`, { client: { email: email } })
  },

}

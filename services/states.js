const RESOURCE_URL = 'api/v1/states/available'

export default {
  checkForAvailableUf(uf) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${uf}`)
  },

  getEnabledStates() {
    return $nuxt.$axios.get(`api/v1/states/enabled/states`)
  },
}

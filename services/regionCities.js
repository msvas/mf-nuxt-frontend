const RESOURCE_URL = '/api/v1/users/regions'

export default {
  getCities(regionId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${regionId}/cities`)
  },
}

const RESOURCE_URL = '/api/v1/users/supplier_configurations/delivery_areas/'

export default {
  saveRegion(regionId) {
    let payload = { regionId }

    return $nuxt.$axios.post(`${RESOURCE_URL}`, payload)
  },
  removeRegion(regionId) {
    return $nuxt.$axios.delete(`${RESOURCE_URL}/${regionId}`)
  },
}

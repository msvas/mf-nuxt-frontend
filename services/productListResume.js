const RESOURCE_URL = 'api/v1/users/clients/product_list_resume'

export default {
  resumedList() {
    return $nuxt.$axios.get(`${RESOURCE_URL}`)
  },
}

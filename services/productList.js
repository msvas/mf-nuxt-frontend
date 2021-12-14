const RESOURCE_URL = 'api/v1/users/clients/product_list'

export default {
  insertProduct(productId) {
    return $nuxt.$axios.post(`${RESOURCE_URL}`, { product_id: productId })
  },

  removeProduct(productId) {
    return $nuxt.$axios.delete(`${RESOURCE_URL}`, { data: { product_id: productId } })
  },

  products() {
    return $nuxt.$axios.get(`${RESOURCE_URL}`)
  },

  getResumedProductList() {
    return $nuxt.$axios.post(`${RESOURCE_URL}/resume`)
  },
}

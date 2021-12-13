const RESOURCE_URL = '/api/v1/users/quotations'

export default {

  getPrices(quotationId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${quotationId}/quotation_prices`)
  },

}

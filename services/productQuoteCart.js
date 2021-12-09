import Vue from 'vue'

const RESOURCE_URL = 'api/v1/users/clients/product_quote_cart'

export default {
  insertManyProducts(data) {
    return Vue.axios.post(`${RESOURCE_URL}/many`, { product_ids: data.productIds, supplier_id: data.supplierId }, { withCredentials: true })
  },

  insertProduct(data) {
    return Vue.axios.post(`${RESOURCE_URL}`, { product_id: data.productId, supplier_id: data.supplierId }, { withCredentials: true })
  },

  removeProduct(productId) {
    return Vue.axios.post(`${RESOURCE_URL}/destroy`, { product_id: productId }, { withCredentials: true })
  },

  products() {
    return Vue.axios.post(`${RESOURCE_URL}/all`, null, { withCredentials: true })
  },

  clearQuoteCart() {
    return Vue.axios.post(`${RESOURCE_URL}/clear`, null, { withCredentials: true })
  },
}

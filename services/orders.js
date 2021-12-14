const RESOURCE_URL = 'api/v1/users/orders'

export default {

  get(orderId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${orderId}`)
  },

  getDirectOrders() {
    return $nuxt.$axios.get(`api/v1/users/clients/orders`)
  },

  getSupplierDirectOrders() {
    return $nuxt.$axios.get(`api/v1/users/suppliers/orders`)
  },

  createOrder(data) {
    return $nuxt.$axios.post(`${RESOURCE_URL}`, { supplier_product_expeditions: data.products, supplier_id: data.supplierId })
  },

  updateOrder(data) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/${data.orderId}/update`, { supplier_product_expeditions: data.products, id: data.orderId })
  },

  emitOrder(id) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${id}/emit`)
  },

  getValidOrderProducts(orderId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${orderId}/products/valid`)
  },

  getValidOrderProductsByPageNumber(orderId, resourceUrl) {
    if(resourceUrl)
      return $nuxt.$axios.get(resourceUrl)
    else
      return $nuxt.$axios.get(`${RESOURCE_URL}/${orderId}/products/valid`)
  },

  getOrderCategories(orderId) {
    return $nuxt.$axios.get(`api/v1/users/clients/${orderId}/order_categories`)
  },

  getPricesByOrder(orderId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${orderId}/order_expeditions`)
  },

  getTotal(orderId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${orderId}/total`)
  },

  acceptOrder(orderId, comments) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/${orderId}/accept`, { comments: comments })
  },

  refuseOrder(orderId, justification) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/${orderId}/refuse`, { justification: justification })
  },

  read(orderId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${orderId}/read`)
  },

}

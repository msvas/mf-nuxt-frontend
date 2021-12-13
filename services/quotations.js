const RESOURCE_URL = 'api/v1/users/quotations'

export default {
  // getAll() {
  //   return $nuxt.$axios.get(`${RESOURCE_URL}`)
  // },

  get(quotationId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${quotationId}`)
  },

  getPurchaseRequests() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/orders_purchase_requests`)
  },

  getOrders(data) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/orders?supplier_id=${data.supplier}&date=${data.date}`)
  },

  hasOrders() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/has_orders`)
  },

  getWithPayments(quotationId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${quotationId}/payments`)
  },

  getHashedProducts(quotationId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${quotationId}/products/hashed`)
  },

  getAllProducts(quotationId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${quotationId}/products`)
  },

  getQuotationProductsByPageNumber(quotationId, resourceUrl) {
    if(resourceUrl)
      return $nuxt.$axios.get(resourceUrl)
    else
      return $nuxt.$axios.get(`${RESOURCE_URL}/${quotationId}/products`)
  },

  getValidQuotationProducts(quotationId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${quotationId}/products/valid`)
  },

  getValidQuotationProductsByPageNumber(quotationId, resourceUrl) {
    if(resourceUrl)
      return $nuxt.$axios.get(resourceUrl)
    else
      return $nuxt.$axios.get(`${RESOURCE_URL}/${quotationId}/products/valid`)
  },

  refuse(quotationId, justification, comments) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/${quotationId}/refuse`, { justification: justification, comments: comments })
  },

  acceptOrder(quotationId, comments) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/${quotationId}/accept_order`, { comments: comments })
  },

  refuseOrder(quotationId, justification) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/${quotationId}/refuse_order`, { justification: justification })
  },

  accept(quotationId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${quotationId}/accept`)
  },

  dispatch(quotationId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${quotationId}/dispatch`)
  },

  read(quotationId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${quotationId}/read`)
  },

  savePaymentInfo(data) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/${data.quotationId}/payment_info`, { data: data.data, quotation: { id: data.quotationId } })
  },

  saveDeliveryInfo(data) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/${data.quotationId}/delivery_info`, { data: data.data, quotation: { id: data.quotationId } })
  },

  getQuotationProductsByCategory(data) {
    return $nuxt.$axios.get(`api/v1/users/clients/${data.quotationId}/${data.categoryId}/quotation_products`)
  },

  getQuotationProductsByCollection(data) {
    return $nuxt.$axios.post(`api/v1/users/clients/from_collection/${data.quotationId}/quotation_products`, { collection_name: data.collectionName })
  },

  getQuotationCategories(quotationId, unavailable) {
    return $nuxt.$axios.get(`api/v1/users/clients/${quotationId}/categories?getUnavailable=${unavailable}`)
  },

  getQuotationCategoriesCollections(quotationId, unavailable) {
    return $nuxt.$axios.get(`api/v1/users/clients/${quotationId}/categories_collections?getUnavailable=${unavailable}`)
  },

  getQuotationProductTypes(quotationId) {
    return $nuxt.$axios.get(`api/v1/users/clients/${quotationId}/product_types`)
  },

  saveExpeditionQuantities(data) {
    return $nuxt.$axios.post(`api/v1/users/clients/${data.quotationId}/reply`, { quantities: data.totals })
  },

  savePaymentMethod(data) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/${data.quotationId}/save_payment`, { payment_method: data.method, emit: data.emit })
  },

  getTotal(quotationId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${quotationId}/total`)
  },

}

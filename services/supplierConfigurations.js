const RESOURCE_URL = '/api/v1/users/supplier_configurations'

export default {
  getConfigurations() {
    return $nuxt.$axios.get(`${RESOURCE_URL}`)
  },

  getClientTypes() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/client_types`)
  },

  saveClientTypes(clientTypes) {
    let payload = { clientTypes }

    return $nuxt.$axios.post(`${RESOURCE_URL}/client_types`, payload)
  },

  getMinimumOrderValue() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/minimum_order_values`)
  },

  saveMinimumOrderValue(minimumOrderValue) {
    let payload = { minimumOrderValue }

    return $nuxt.$axios.post(`${RESOURCE_URL}/minimum_order_values`, payload)
  },

  getDeliveryConditions() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/delivery_conditions`)
  },

  saveDeliveryConditions(deliveryConditions) {
    let payload = { deliveryConditions }

    return $nuxt.$axios.post(`${RESOURCE_URL}/delivery_conditions`, payload)
  },

  getStatesPresence() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/states_presences`)
  },

  getRegions(stateId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/states/${stateId}/`)
  },

  getPaymentMethods() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/payment_methods`)
  },

  createPaymentMethods(paymentMethods) {
    let payload = { paymentMethods }

    return $nuxt.$axios.post(`${RESOURCE_URL}/payment_methods`, { payment_method: payload })
  },

  updatePaymentMethods(paymentMethods) {
    let payload = { paymentMethods }

    return $nuxt.$axios.put(`${RESOURCE_URL}/payment_methods`, { payment_method: payload })
  },

  destroyPaymentMethods(ids) {
    let payload = { payment_method: { payment_methods: ids } }

    return $nuxt.$axios.delete(`${RESOURCE_URL}/payment_methods`, { data: payload })
  },


}

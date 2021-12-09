import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import configurations from './configurations/index'

const state = {
  supplier: undefined,
  suppliersAuto: [],
  catalog: undefined,
  supplierStates: [],
  supplierStatesModal: false,
  selectedState: null,
  supplierQuotations: [],
  supplierExpeditions: [],
  paymentMethods: [],
  paymentMethodsToRemove: [],
  supplierProducts: [],
  renderingProducts: [],
  noPriceData: null,
  supplierOfferProducts: [],
  supplierOfferExpeditions: [],
  manualStore: false,
  manualStoreId: null,
}

const modules = {
  configurations
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules
}

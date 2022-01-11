import qs from 'qs'

const RESOURCE_URL = '/api/v1/users/suppliers'

export default {
  get() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/info`)
  },
  getAllAuto(product, page = null) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/show_all_auto`, {
      params: { product, page: page },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },
  getSuppliersAutoProductTypes(product) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/auto/product_types`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },
  getAuto(product, samples) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/show_auto`, {
      params: { product, samples: samples },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },
  getAll(){
    return $nuxt.$axios.get(`${RESOURCE_URL}/show_all`)
  },

  getById(id) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${id}`)
  },

  getBySlug(slug) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${slug}/slug`)
  },

  getStates() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/states/`)
  },

  getTotalSuppliers() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/count/valid_suppliers`)
  },

  getQuotations() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/quotations`)
  },

  getExpeditionsByQuotation(quotationId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_product_expeditions/${quotationId}`)
  },

  getExpeditionsByQuotationAndPage(quotationId, page) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_product_expeditions/${quotationId}?page=${page}`)
  },

  getExpeditionsByProductType(productTypeId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_product_expeditions/by_product_type/${productTypeId}`)
  },

  getExpeditionsByProductTypeAndSupplier(productTypeId, supplierId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_product_expeditions/by_product_type_and_supplier/${productTypeId}/${supplierId}`)
  },

  getOfferExpeditionsBySupplier(supplierId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_product_expeditions/offers_by_supplier/${supplierId}`)
  },

  getExpeditionsByFamilyAndSupplier(family, supplierId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_product_expeditions/by_family_and_supplier/${family}/${supplierId}`)
  },

  getOfferProductsBySupplier(supplierId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/offers_by_supplier/${supplierId}`)
  },

  getCatalogByProductType(productTypeId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/by_product_type/${productTypeId}`)
  },

  getCatalogByProductTypeAndSupplier(productTypeId, supplierId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/by_product_type_and_supplier/${productTypeId}/${supplierId}`)
  },

  getCatalogByProductTypeAndSupplierPaginated(productTypeId, supplierId, filters, items, page) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/by_product_type_and_supplier/${productTypeId}/${supplierId}`, {
      params: { filters, page, items },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getRandomSaleProducts() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/random_sale_products`)
  },
  getAllSaleProducts() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/all_sale_products`)
  },
  getSaleProducts() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/sale_products`)
  },
  getSaleProductsBySupplier(supplierId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/sale_products/${supplierId}`)
  },

  getSaleSupplierExpeditions() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_product_expeditions/supplier/sale_expeditions`)
  },

  getCatalogByFamilyAndSupplier(family, supplierId, noExpeditions) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/by_family_and_supplier/${family}/${supplierId}?no_expeditions=${noExpeditions}`)
  },

  getCatalogByCollectionAndSupplier(family, collection, supplierId, noExpeditions) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/by_collection_and_supplier/${family}/${collection}/${supplierId}?no_expeditions=${noExpeditions}`)
  },

  getCatalogByCategoryAndSupplier(family, category, supplierId, noExpeditions) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/by_category_and_supplier/${family}/${category}/${supplierId}?no_expeditions=${noExpeditions}`)
  },

  getAllProductsByCategoryAndSupplier(family, category, supplierId, page, items, noExpeditions) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/all_products_by_category_and_supplier/${family}/${category}/${supplierId}?no_expeditions=${noExpeditions}&page=${page}&items=${items}`)
  },

  getSupplierProductAndExpeditions(supplierId, productId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/product_with_expeditions/${productId}/${supplierId}`)
  },

  getSampleCatalogByProductTypeAndSupplier(productTypeId, supplierId, noExpeditions) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/samples_by_product_type_and_supplier/${productTypeId}/${supplierId}?no_expeditions=${noExpeditions}`)
  },

  getCatalog() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products`)
  },

  getCatalogById(id) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/supplier_products/by_id/${id}`)
  },

  getNoPriceData() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/product_types/no_price`)
  },

  updateDeliveryRate(rate) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/delivery_rate`, rate)
  },

  checkSupplierStoreParams(uf, city, userType, id) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${id}/store_available/${uf}/${city}/${userType}`)
  },

  storeSearchProducts(keyword, supplierId, category, page) {
    return $nuxt.$axios.get(`/api/v1/users/suppliers/${supplierId}/search_products/${keyword}?category_id=${category}&page=${page}`)
  },

  getExpeditionsBySearchAndSupplier(keyword, supplierId, page) {
    return $nuxt.$axios.get(`/api/v1/users/suppliers/${supplierId}/search_expeditions/${keyword}?page=${page}`)
  },

  searchAutomaticCatalog(keyword) {
    return $nuxt.$axios.post(`/api/v1/users/suppliers/search_automatic_catalog`, { keyword: keyword })
  },

  canUserAccessStore(supplierId) {
    return $nuxt.$axios.get(`/api/v1/users/suppliers/can_user_access_store/${supplierId}`)
  },

  getBrands(filterOptions) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/filters/brands_by_product_type/${filterOptions.productTypeId}/${filterOptions.supplierId}`, {
      params: { filter_options: filterOptions.data },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getProperties(filterOptions) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/filters/properties_by_product_type/${filterOptions.productTypeId}/${filterOptions.supplierId}`, {
      params: { filter_options: filterOptions.data },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getTags(filterOptions) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/filters/tags_by_product_type/${filterOptions.productTypeId}/${filterOptions.supplierId}`, {
      params: { filter_options: filterOptions.data },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getPackagings(filterOptions) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/filters/packagings_by_product_type/${filterOptions.productTypeId}/${filterOptions.supplierId}`, {
      params: { filter_options: filterOptions.data },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  uploadSitemap(data) {
    return $nuxt.$axios.put('/sitemaps/sitemap',{ blob: data.content, name: data.name })
  },
}

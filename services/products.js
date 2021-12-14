import qs from 'qs'

const RESOURCE_URL = 'api/v1/users/products'

export default {
  getCatalog() {
    return $nuxt.$axios.get(`api/v1/products/catalog`)
  },

  getAll(product) {
    return $nuxt.$axios.get(`${RESOURCE_URL}`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getRandom(product) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/random`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getRandomFromFamily(product, familyId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/random_from_family`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        }) + `&family_id=${familyId}`
      }
    })
  },

  getFromIds(ids) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/by_ids`, { product_ids: ids })
  },

  getIdsInListFromCategory(categoryId) {
    return $nuxt.$axios.get(`/api/v1/users/products/categories/list_ids/${categoryId}`)
  },

  getInListFromCategory(categoryId) {
    return $nuxt.$axios.get(`/api/v1/users/products/categories/list/${categoryId}`)
  },

  getInListFromProductType(productTypeId, page) {
    return $nuxt.$axios.get(`/api/v1/users/products/product_types/list/${productTypeId}?page=${page}`)
  },

  getInListFromProperty(productTypeId, propertyId) {
    return $nuxt.$axios.get(`/api/v1/users/products/product_types/list_from_property/${productTypeId}/${propertyId}`)
  },

  search(product, keyword, category, page) {
    if(category)
      product.category_id = category
    if(!product || product.region_id == undefined || product.serves_type == undefined) {
      if(category)
        product = { region_id: null, serves_type: null, category_id: category }
      else
        product = { region_id: null, serves_type: null }
    }
    return $nuxt.$axios.get(`/api/v1/users/products/search/${keyword}`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        }) + `&page=${page}`
      }
    })
  },
  searchSugestions(product, keyword) {
    if(!product || product.region_id == undefined || product.serves_type == undefined) {
      product = { region_id: null, serves_type: null }
    }
    return $nuxt.$axios.get(`/api/v1/users/products/search_sugestions/${keyword}`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  hasProducts(product) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/has_products`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },

  getByProductTypeId(producTypeId) {
    const url = `/api/v1/users/product_types/${producTypeId}/products`

    return $nuxt.$axios.get(url)
  },

  saveExpeditions(expeditions) {
    const url = `/api/v1/users/quotation_prices/`

    return $nuxt.$axios.post(url, { supplier_product_expeditions: expeditions })
  },

  savePricing(expeditions) {
    const url = `/api/v1/users/suppliers/supplier_product_expeditions/save`

    return $nuxt.$axios.post(url, { supplier_product_expeditions: expeditions })
  },
  saveSales(sale) {
    const url = `/api/v1/users/sales_status/${sale}`

    return $nuxt.$axios.put(url)
  },
}

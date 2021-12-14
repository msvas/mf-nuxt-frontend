const RESOURCE_URL = 'api/v1/users/quotes'

export default {
  // getAll() {
  //   return $nuxt.$axios.get(`${RESOURCE_URL}`)
  // },

  get(quoteId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${quoteId}`)
  },

  getOpen(page) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/open?page=${page}`)
  },

  getQuoteCount() {
    return $nuxt.$axios.get(`${RESOURCE_URL}/open_count`)
  },

  createQuote(productsInQuoteCart) {
    return $nuxt.$axios.post(`${RESOURCE_URL}`, { products: productsInQuoteCart })
  },

  quoteSuppliers(productsInQuoteCart, params) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/count_suppliers`, { products: productsInQuoteCart, params: params })
  },

  getCategories(quoteId) {
    return $nuxt.$axios.get(`${RESOURCE_URL}/${quoteId}/families_and_categories`)
  },

  filterByCategories(data) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/${data.quoteId}/filter_by_category`, { quote: { categories: data.categories }})
  },

  getClientQuotesByPageNumber(url, data) {
    if(url)
      return $nuxt.$axios.get(url + `&date=${data.date}&open=${data.open}&closed=${data.closed}`)
    else
      return $nuxt.$axios.get(`${RESOURCE_URL}/client?&date=${data.date}&open=${data.open}&closed=${data.closed}`)
  }
}

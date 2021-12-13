import { SET_QUOTES } from './mutations-types'
import { SET_OPEN_QUOTES } from './mutations-types'
import { SET_QUOTE_CATEGORIES } from './mutations-types'
import { SET_FILTERED_QUOTATIONS } from './mutations-types'
import { SET_QUOTE_SUPPLIERS } from './mutations-types'
import { MARK_QUOTE_QUOTATION_AS_READ } from './mutations-types'
import { ACCUMULATE_OPEN_QUOTES } from './mutations-types'

export default {
  [SET_QUOTES]: (state, quotes) => {
    state.quotes = quotes
  },

  [MARK_QUOTE_QUOTATION_AS_READ]: (state, quotationId) => {
    for(var i = 0; i < state.quotes.quotations.length; i++) {
      if(state.quotes.quotations[i].id == quotationId) {
        state.quotes.quotations[i].read = true
      }
    }
  },

  [SET_OPEN_QUOTES]: (state, quotes) => {
    state.openQuotes = quotes
  },

  [ACCUMULATE_OPEN_QUOTES]: (state, quotes) => {
    var all = state.openQuotes.concat(quotes)
    state.openQuotes = [...new Set(all)]
  },

  [SET_QUOTE_CATEGORIES]: (state, quoteCategories) => {
    state.quoteCategories = quoteCategories
  },

  [SET_FILTERED_QUOTATIONS]: (state, filteredQuotations) => {
    state.filteredQuotations = filteredQuotations
  },

  [SET_QUOTE_SUPPLIERS]: (state, suppliers) => {
    state.quoteSuppliers = suppliers
  },
}

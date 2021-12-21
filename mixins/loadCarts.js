const loadCarts = {
  beforeMount() {
    this.$store.dispatch("users/products/loadStoreProducts").then(() => {
      this.$store.dispatch("users/products/loadStoreTotal")
    })
    this.$store.dispatch("users/products/getQuoteCart")
    this.$store.dispatch("users/products/getResumedQuoteCart")
  }
}

export default loadCarts

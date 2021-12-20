const loadCarts = {
  mounted() {
    console.log('uu')
    this.store.dispatch("users/products/loadStoreProducts").then(() => {
      this.store.dispatch("users/products/loadStoreTotal")
    })
    this.store.dispatch("users/products/getQuoteCart")
  }
}

export default loadCarts

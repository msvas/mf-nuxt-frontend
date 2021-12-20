export default ({ app }) => {
   // Every time the route changes (fired on initialization too)
   app.router.afterEach((to, from) => {
     if(process.client) {
       console.log('oi')
       app.store.dispatch("users/products/loadStoreProducts").then(() => {
         app.store.dispatch("users/products/loadStoreTotal")
       })
       app.store.dispatch("users/products/getQuoteCart")
     }
   })
}

<template>
<div style="overflow-y: hidden;">
  <div class="header-navbar-shadow" style="overflow-y: hidden;"></div>
  <div class="content-wrapper mt-0" style="overflow-y: hidden;">
    <loading-overlay
      :active.sync="isLoading"
      :is-full-page="fullPage"
      :loader="loader"
      :color="color"
      :background-color="backgroundColor"
      :opacity="opacity"
      :width="width"
      :height="height"
    />
    <div class="content-body" :style="mobileBrowser ? 'overflow-y: hidden; overflow-x: hidden; max-height: calc(100vh - 13em);' : ''">
      <div class="py-2 px-2 bg-white" style="height: 65px; margin: -2.35rem -2.20rem 0.8rem -2.20rem;">
        <a href="/" >
          <div class="brand-logo-mf-color mt-0"></div>
        </a>
      </div>
      <div class="row" style="max-height: calc(100vh - 9em); overflow-y: scroll; overflow-x: hidden; padding-bottom: 100px; background-color: #ebebeb;">
          <div class="col-md-9 pb-5 pb-md-0" :style="this.mobileBrowser ? '' : 'padding-right: 20px;' ">
            <div class="card shadow-sm mt-0" :style="mobileBrowser ? '' : 'position: sticky; top: 0px; z-index: 800;'">
              <div class="card-body p-1">
                <nuxt-link :to="{ name: 'public-store', params: { supplierSlug: $route.params.supplierSlug } }">
                  <span class="font-weight-bold d-block d-md-inline">
                    <i class="feather icon-chevron-left mr-25"></i>
                    Voltar à loja
                  </span>
                </nuxt-link>
                <div style="padding-top: 10px;">
                  <h5 class="d-block d-md-inline mb-0">
                    Confira se está tudo certo
                  </h5>
                </div>
              </div>
            </div>
            <div class="card shadow-sm mb-2" v-if="mobileBrowser" style="">
              <div class="card-body p-1 ml-0">
                <h6 class="disabled-opacity">Emitir pedido a</h6>
                <h3 class="font-weight-bold">{{ supplier.user.name }}</h3>
                <vs-button
                  @click="shareOnWhatsapp()"
                  color="#00bfa5"
                  type="border"
                  style="padding: 3px 10px; margin-left: 0; margin-top: 3px; margin-right: 7px; margin-bottom: 5px;"
                >
                  <i class="fa fa-whatsapp mr-50"></i>Falar no Whatsapp
                </vs-button>
                <a @click="sendContactNotification()" :href="'tel:' + supplier.user.phone">{{ supplier.user.phone }}</a>
                <div class="" style="margin-top: 5px;">{{ supplier.user.legalName }}</div>
                <div class="">{{ formatCNPJ(supplier.user.cnpj) }}</div>
                <div class="">{{ completeAdress(supplier.user.street, supplier.user.addressDetails, supplier.user.neighborhood, supplier.user.city, supplier.user.stateUf) }}</div>
              </div>
              <vs-divider />
              <div class="card-body p-1">
                <h5 class="card-title"><i class="feather icon-truck font-medium-2 mr-50"></i> Condições de entrega</h5>
                <h6 v-if="supplier.deliveryEstimate" class="mb-50 pt-1 disabled-opacity">Prazo de entrega</h6>
                <h6 v-else class="mb-50 pt-1 disabled-opacity">Este fornecedor não realiza entregas.</h6>

                <p v-if="supplier.deliveryEstimate" class="font-small-3">
                  {{ supplier.deliveryEstimate !== "" ? supplier.deliveryEstimate : 'Nada descrito'}}
                </p>
                <h5 v-if="supplier.deliveryRoute" class="mb-50 pt-1 disabled-opacity">Rota</h5>
                <p v-if="supplier.deliveryRoute" class="font-small-3">
                  {{ supplier.deliveryRoute !== "" ? supplier.deliveryRoute : 'Nada descrito' }}
                </p>
                <h5 class="mb-50 pt-1 disabled-opacity" v-if="supplier.lastDeliveryRate && supplier.deliveryEstimate">
                  Custo de frete
                </h5>
                <p v-if="supplier.lastDeliveryRate" class="font-small-3">
                  {{ supplier.lastDeliveryRate }}
                </p>
              </div>
            </div>
            <div v-for="family in familiesFromCart" :key="family">
              <h3 style="color: grey;" v-if="productsFromFamily(family).length > 0">{{ family }}</h3>

              <span
                v-for="collection in collectionsFromFamily(family)"
                :key="collection"
              >
                <span
                  v-for="category in categoriesFromCollection(collection, family)"
                  :key="category"
                  class=""
                >
                  <span
                    v-for="type in productTypesFromCategory(category, family)"
                    :key="type"
                  >
                    <span v-if="productsFromProductType(type, category).length > 0">
                      <p class="mb-0 mt-1"><i v-if="collection">{{ collection }} &nbsp;|&nbsp;</i> {{ category }}</p>
                      <p class="mb-50 font-weight-bold">{{ type }}</p>
                      <span v-for="product in productsFromProductType(type, category)" :key="'product' + product.id">
                        <span v-for="expedition in productPrices(product.id)" :key="'exp' + expedition.id">
                          <div class="card shadow-sm mb-1">
                            <div class="card-body p-0">

                              <review-order-product-card
                                :product="product"
                                :mobileBrowser="mobileBrowser"
                                :expedition="expedition"
                                @quantity-input="checkTotals"
                                @remove-item="removeFromCart"
                                @delete-item="deleteFromCart"
                              />
                              <!-- <review-quote-product-card
                                v-for="product in productsFromProductType(type, category)"
                                :key="'product' + product.id"
                                :product="product"
                                :mobileBrowser="mobileBrowser"
                                @item-removed="updateQuoteCart"
                              /> -->
                            </div>
                          </div>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
              <br>
            </div>

            <!-- <div v-if="mobileBrowser" class="card shadow-sm bg-primary bg-lighten-5 mt-2">
              <div class="card-body p-1 text-center font-small-3">
                <span class="font-weight-bold d-block d-md-inline mb-1">Faltou alguma coisa?</span>
                <a href="/minha-lista-de-produtos" class="btn btn-outline-primary bg-white waves-effect waves-light font-weight-bold font-small-2 px-1 mx-1">Adicionar da minha lista</a>
                <a href="/" class="font-weight-bold font-small-2">Procurar no site</a>
              </div>
            </div> -->
            <!-- <v-footer :class="this.mobileBrowser == true ? 'mobile' : 'desktop' " style="margin-top:100px; margin-bottom: 100px;" /> -->
          </div>
          <div v-if="!mobileBrowser" class="col-md-3">
            <div class="card shadow-sm mb-2" style="position: sticky; top: 0px;">
              <div class="card-body p-1 ml-0">
                <h6 class="disabled-opacity">Emitir pedido a</h6>
                <h3 class="font-weight-bold">{{ supplier.user.name }}</h3>
                <vs-button
                  @click="shareOnWhatsapp()"
                  color="#00bfa5"
                  type="border"
                  style="padding: 3px 10px; margin-left: 0; margin-top: 3px; margin-right: 7px; margin-bottom: 5px;"
                >
                  <i class="fa fa-whatsapp mr-50"></i>Falar no Whatsapp
                </vs-button>
                <a @click="sendContactNotification()" :href="'tel:' + supplier.user.phone">{{ supplier.user.phone }}</a>
                <div class="" style="margin-top: 5px;">{{ supplier.user.legalName }}</div>
                <div class="">{{ formatCNPJ(supplier.user.cnpj) }}</div>
                <div class="">{{ completeAdress(supplier.user.street, supplier.user.addressDetails, supplier.user.neighborhood, supplier.user.city, supplier.user.stateUf) }}</div>
              </div>
              <vs-divider />
              <div class="card-body p-1">
                <h5 class="card-title"><i class="feather icon-truck font-medium-2 mr-50"></i> Condições de entrega</h5>
                <h6 v-if="supplier.deliveryEstimate" class="mb-50 pt-1 disabled-opacity">Prazo de entrega</h6>
                <h6 v-else class="mb-50 pt-1 disabled-opacity">Este fornecedor não realiza entregas.</h6>

                <p v-if="supplier.deliveryEstimate" class="font-small-3">
                  {{ supplier.deliveryEstimate !== "" ? supplier.deliveryEstimate : 'Nada descrito'}}
                </p>
                <h5 v-if="supplier.deliveryRoute" class="mb-50 pt-1 disabled-opacity">Rota</h5>
                <p v-if="supplier.deliveryRoute" class="font-small-3">
                  {{ supplier.deliveryRoute !== "" ? supplier.deliveryRoute : 'Nada descrito' }}
                </p>
                <h5 class="mb-50 pt-1 disabled-opacity" v-if="supplier.lastDeliveryRate && supplier.deliveryEstimate">
                  Custo de frete
                </h5>
                <p v-if="supplier.lastDeliveryRate" class="font-small-3">
                  {{ supplier.lastDeliveryRate }}
                </p>
              </div>
              <vs-divider />
              <div class="card-body p-1 font-small-3 row">
                <div class="col-6 text-left">
                  Valor min.<br>
                  <span style="margin-top: 10px;">Total</span>
                </div>
                <div class="col-6 text-right">
                  <span class="d-block mb-25">
                    {{ supplier.minimumOrderValue }}
                  </span>
                  <p>
                    <strong>
                      <span class="font-small-2">R$ </span>
                      <span class="font-medium-2">{{ formatPrice(total).substring(3) }}</span>
                    </strong>
                  </p>
                </div>
                <div v-if="total >= formatPriceString(supplier.minimumOrderValue)" class="col-11 p-1 ml-1 mr-1 font-small-2" style="background-color: #fae3a5; border-radius: 7px;">
                  Pagamento e entrega são resolvidos diretamente com o fornecedor.<br>
                  <a href="javascript:void(0);" @click="openPopup()">Saiba mais</a>
                </div>
                <div v-else ref="minimumAlert" class="col-11 p-1 ml-1 mr-1 font-medium-1 text-white font-weight-bold" style="background-color: #9c56a6; border-radius: 7px;">
                  <i class="feather icon-alert-triangle font-medium-5 mr-1"></i> Valor mínimo não atingido
                </div>
                <div class="col-12">
                  <button
                    :style="isDisabled ? 'opacity: 0.35; cursor: default;' : ''"
                    @click="isDisabled ? checkMinimumAlert() : saveOrder()"
                    class="btn btn-primary waves-effect waves-light font-weight-bold font-medium-1 w-100 mt-0 mt-md-1 px-0"
                  >
                    <b-spinner v-if="buttonLoading" small/>
                   <span v-else>
                     <img :src="require(`@/assets/images/shopping-cart-white.png`)" alt="*" width="18" height="18" /> Emitir pedido
                   </span>
                  </button>
                </div>
              </div>

            </div>
          </div>
          <div v-else class="position-fixed" style="bottom: 0px;">
            <div class="card shadow-sm mb-0" style="">
              <div class="card-body pb-1 pl-1 pr-1 pt-0 font-small-3 row">
                <div style="border: solid 2px #f5f5f5; width: 100%; margin-bottom: 3px;"></div>
                <div class="col-6 text-left">
                  Valor min.<br>
                  <span style="margin-top: 10px;">Total</span>
                </div>
                <div class="col-6 text-right">
                  <span class="d-block mb-25">
                    {{ supplier.minimumOrderValue }}
                  </span>
                  <p class="mb-0">
                    <strong>
                      <span class="font-small-2">R$ </span>
                      <span class="font-medium-2">{{ formatPrice(total).substring(3) }}</span>
                    </strong>
                  </p>
                </div>
                <div v-if="total >= formatPriceString(supplier.minimumOrderValue)" class="col-11 ml-1 mr-1 font-small-2" style="background-color: #fae3a5; border-radius: 7px; padding: 10px; margin-bottom: 3px;">
                  Pagamento e entrega são resolvidos diretamente com o fornecedor.<br>
                </div>
                <div v-else ref="minimumAlert" class="col-11 ml-1 mr-1 font-medium-1 text-white font-weight-bold" style="background-color: #9c56a6; border-radius: 7px; padding: 5px;">
                  <i class="feather icon-alert-triangle font-medium-5 mr-1"></i> Valor mínimo não atingido
                </div>
                <div class="col-12">
                  <button
                    :style="isDisabled ? 'opacity: 0.35; cursor: default;' : ''"
                    @click="isDisabled ? checkMinimumAlert() : saveOrder()"
                    class="btn btn-primary waves-effect waves-light font-weight-bold font-medium-1 w-100 mt-0 mt-md-1 px-0"
                  >
                    <b-spinner v-if="buttonLoading" small/>
                   <span v-else> <img :src="require(`@/assets/images/shopping-cart-white.png`)" alt="*" width="18" height="18" /> Emitir pedido </span>
                  </button>
                </div>
              </div>

            </div>
          </div>
      </div>
    </div>
  </div>
  <vs-popup title="Como funciona?" :active.sync="open">
    <div>
      <how-it-works />
    </div>
  </vs-popup>
</div>
</template>

<style>
.desktop{
  margin-left: 0px !important;
}
.mobile{
  margin-bottom: 20px;
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import ClientProductQuoteCartService from '@/services/productQuoteCart';
import VProductCard from "@/components/products/ProductCard";
import ReviewOrderProductCard from "@/components/products/ReviewOrderProductCard";
import VFooter from "@/layouts/components/VFooter";
import priceFormatter from "@/mixins/priceFormatter";
import HowItWorks from "@/pages/como-funciona.vue"
import ContactService from "@/services/contact"
import Vue from 'vue';

export default {
  data() {
    return {
      color: "#0cb695",
      loader: "spinner",
      width: 250,
      height: 250,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoading: false,
      selectedCategory: undefined,
      showProducts: undefined,
      mobileBrowser: false,
      currentScreen: undefined,
      buttonLoading: false,
      productLoading: false,
      homeLoading: false,
      loadedPrices: false,
      totals: [],
      total: 0,
      open: false,
    };
  },

  layout: 'noFooter/NoFooter',

  mounted() {
    this.isMobile()
    this.isLoading = true
    this.clearPagination()
    this.orderId = this.$route.params.orderId
    this.getSupplierBySlug(this.$route.params.supplierSlug)
    this.totals = JSON.parse(JSON.stringify(this.storeProducts))
    this.getOrderTotal({ id: this.orderId }).then((response) => {
      this.total = response
    })
    this.getOrder({ id: this.orderId }).then(() => {
      this.loadedOrder = this.order
      this.getValidOrderProducts({ id: this.orderId }).then(() => {
        this.updated = true
        this.isLoading = false
      })
    })
    this.getPricesByOrder(this.orderId).then(() => {
      this.loadedPrices = true
    })
    if(this.$route.query.autoOpen && this.$auth.loggedIn && (this.$route.query.autoOpen == 'true' || this.$route.query.autoOpen == true)) {
      this.emitOrder(this.orderId).then(() => {
        this.clearStoreProducts()
        this.setStoreTotal(0)
        this.setStoreCartSupplier(null)
        this.isLoading = false
        this.$router.push({ path: '/pedidos', query: { directId: this.orderId } })
      })
    }
  },

  computed: {
    ...mapState("products", ["products"]),
    ...mapState("quotes", ["quoteSuppliers"]),
    ...mapState("users/products", ["storeTotal", "storeProducts"]),
    ...mapState("pagination", ["totalPages", "totalCount"]),
    ...mapState("suppliers", ["supplier"]),
    ...mapState("orders", ["orderProducts", "orderExpeditions"]),
    productsInCartIds() {
      return this.$store.state.users.products.storeProducts.map(product => product.id)
    },
    productsInStoreCart() {
      if (this.$store.state.users.products.storeProducts)
        return this.$store.state.users.products.storeProducts.length
      else
        return 0
    },
    isDisabled() {
      if(this.total >= this.formatPriceString(this.supplier.minimumOrderValue))
        return false
      else
        return true
    },
    productCount() {
      if(this.productsInStoreCart == 1)
        return '1 produto'
      else
        return this.productsInStoreCart + ' produtos'
    },
    familiesFromCart() {
      return [...new Set(this.orderProducts.map(prod => prod.familyName))]
    },
  },

  watch: {

  },

  methods: {
    ...mapActions("pagination", ["userSelectedPage", "clearPagination"]),
    ...mapActions("products", ["getProductsFromIds"]),
    ...mapActions("users/products", [
      "setStoreTotal",
      "setStoreCanBuy",
      "updateStoreProducts",
      "removeFromStoreProducts",
      "loadStoreTotal",
      "setStoreCartSupplier",
      "clearStoreProducts",
    ]),
    ...mapActions("suppliers", ["getSupplierById", "getSupplierBySlug"]),
    ...mapActions("orders", [
      "emitOrder",
      "getOrderTotal",
      "getOrder",
      "getValidOrderProducts",
      "getPricesByOrder",
      "updateOrder",
    ]),
    productTypeQuantity(types) {
      return types.length === 1 ? "1 tipo de produto" : `${types.length} tipos de produtos`;
    },
    defineCategory(data) {
      this.selectedCategory = data
      this.showProducts = null
      this.currentScreen = 'products'
    },
    productsQuantityText(quantity) {
      return quantity === 1 ? "1 produto" : `${quantity} produtos`;
    },
    updateQuoteCart() {
      this.getProductsFromIds(this.productsInCartIds)
    },
    cleanSelectedProductType() {
      //let name = this.selectedCategory.category
      //this.selectedCategory = null
      //this.selectCategory(name)
      this.showProducts = null
    },
    async selectCategory(name) {
      this.getResumedQuoteCart().then(() => {
        for(let key in this.resumedQuoteCart) {
          for(let category in this.resumedQuoteCart[key]) {
            if(category == name) {
              this.selectedCategory = { category: category, productTypes: this.resumedQuoteCart[key][category] }
            }
          }
        }
      })
    },
    selectProductType(productType) {
      let productsFromType = this.products.filter(prod => prod.productTypeId == productType.productTypeId)
      let productsInCart = []
      for(var i = 0; i < productsFromType.length; i++) {
        if(this.productQuoteCart.find(prod => prod.id == productsFromType[i].id)) {
          productsInCart.push(productsFromType[i])
        }
      }
      this.showProducts = { name: productType.productType,
                            products: productsInCart }
    },
    productsFromProductType(productTypeName, categoryName) {
      var prods = this.orderProducts.filter(prod => (prod.productTypeName == productTypeName && prod.categoryName == categoryName))
      if(prods.length > 1)
        prods = prods.sort((a, b) => a.productTypeName.localeCompare(b.productTypeName))
      return prods
    },
    productsFromFamily(familyName) {
      return this.orderProducts.filter(prod => prod.familyName == familyName)
    },
    productTypesFromCategory(category, family) {
      var aux = this.orderProducts.filter(prod => (prod.categoryName == category && prod.familyName == family)).map(prod => prod.productTypeName)
      if(aux.length > 1)
        aux = aux.sort((a, b) => a.localeCompare(b))
      return [...new Set(aux)]
    },
    saveOrder() {
      this.acceptLoading = true
      setTimeout(() => {
        this.acceptLoading = false
        this.isLoading = true
        if(this.$auth.loggedIn) {
          this.emitOrder(this.orderId).then(() => {
            this.clearStoreProducts()
            this.setStoreTotal(0)
            this.setStoreCartSupplier(null)
            this.isLoading = false
            this.$router.push({ path: '/pedidos', query: { directId: this.orderId } })
          })
        } else {
          this.acceptLoading = false
          this.$router.push({ path: '/cadastro', query: { directOrder: this.orderId, supplierSlug: this.$route.params.supplierSlug } })
        }
      }, 300);
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
    formatCNPJ(value){
      return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    },
    completeAdress(street, addressDetails, neighborhood, city, state) {
      return `${street}, ${addressDetails}, ${neighborhood}, ${city} - ${state}`
    },
    collectionsFromFamily(family) {
      var aux = this.orderProducts.filter(prod => prod.familyName == family).map(prod => prod.categoryCollection)
      return [...new Set(aux)]
    },
    categoriesFromCollection(collection, family) {
      var aux = this.orderProducts.filter(prod => (prod.categoryCollection == collection && prod.familyName == family)).map(prod => prod.categoryName)
      return [...new Set(aux)]
    },
    productPrices(productId) {
      return this.orderExpeditions
                 .filter(price =>
                   price.supplierProductExpedition.productExpeditionProductId == productId)
    },
    checkTotals(totals) {
      let found = this.totals.find((obj) => obj.id == totals.id);
      if (found) {
        found.quantity = totals.quantity
        found.total = totals.total
      } else {
        this.totals.push(totals)
      }
      this.updateStoreProducts(totals);
      this.updateTotal();
      this.total = this.storeTotal
      this.updateOrder({ orderId: this.orderId, products: this.storeProducts }).then(() => {
        this.getValidOrderProducts({ id: this.orderId }).then(() => {
          this.updated = true
          this.isLoading = false
        })
        this.getPricesByOrder(this.orderId).then(() => {
          this.loadedPrices = true
        })
      })
    },
    removeFromCart(exp) {
      this.totals = this.totals.filter((obj) => obj.id != exp.id);
      this.removeFromStoreProducts(exp);
      this.loadStoreTotal();
      this.updateTotal();
      this.total = this.storeTotal
      this.updateOrder({ orderId: this.orderId, products: this.storeProducts }).then(() => {
        this.getValidOrderProducts({ id: this.orderId }).then(() => {
          this.updated = true
          this.isLoading = false
        })
        this.getPricesByOrder(this.orderId).then(() => {
          this.loadedPrices = true
        })
      })
    },
    updateTotal() {
      let sum = 0;
      this.hasBelowMin = false;
      for (let i = 0; i < this.totals.length; i++) {
        sum += this.totals[i].total;
        var formattedQuantity = this.totals[i].quantity;
        if (
          this.totals[i].minimum &&
          this.totals[i].quantity != "" &&
          formattedQuantity < this.totals[i].minimum
        )
          this.hasBelowMin = true;
      }
      this.total = sum;
      this.setStoreTotal(sum);
      if (
        !this.hasBelowMin &&
        this.supplier.minimumOrderValue &&
        sum >=
          parseFloat(
            this.supplier.minimumOrderValue
              .replace("R$", "")
              .replace(".", "")
              .replace(",", ".")
          )
      )
        this.setStoreCanBuy(true);
      else if (!this.hasBelowMin && !this.supplier.minimumOrderValue)
        this.setStoreCanBuy(true);
      else this.setStoreCanBuy(false);
    },
    deleteFromCart(exp) {
      this.totals = this.totals.filter((obj) => obj.id != exp.supplierProductExpedition.id);
      this.removeFromStoreProducts(exp.supplierProductExpedition);
      this.loadStoreTotal();
      this.updateTotal();
      this.total = this.storeTotal
      this.updateOrder({ orderId: this.orderId, products: this.storeProducts }).then(() => {
        this.getValidOrderProducts({ id: this.orderId }).then(() => {
          this.updated = true
          this.isLoading = false
        })
        this.getPricesByOrder(this.orderId).then(() => {
          this.loadedPrices = true
        })
      })
    },
    formatPriceString(price) {
      return parseFloat(price.replace('R$', '').replace('.', '').replace(',', '.'))
    },
    openPopup() {
      this.open = !this.open
    },
    shakeMinimumAlert() {
      this.$refs.minimumAlert.classList.add('animate__animated', 'animate__shakeX');

      this.$refs.minimumAlert.addEventListener('animationend', () => {
        this.$refs.minimumAlert.classList.remove('animate__animated', 'animate__shakeX')
      });
    },
    checkMinimumAlert() {
      if(this.isDisabled)
        this.shakeMinimumAlert()
    },
    shareOnWhatsapp() {
     this.generateContactViaWhatsappText();
      setTimeout(() => {
        ContactService.userContactedSupplierNotification(this.contactMessage);
      }, 1000);
      var url =
        "https://api.whatsapp.com/send?text=" +
        "Ol%C3%A1!%20Peguei%20seu%20contato%20pela%20plataforma%20Meu%20Fornecedor.%0AEst%C3%A1%20podendo%20falar%20agora%3F" +
        "&phone=55" +
        this.supplier.user.phone
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "");
      window.open(url, "_blank");
    },
    generateContactViaWhatsappText(){
      if(this.$auth.loggedIn){
        if(this.$auth.user.cnpj){
          this.contactMessage= "O usuário \n" +this.$auth.user.name+ "\nPessoa Jurídica" + "\nId " +this.$auth.user.id+ "\nCEP " +this.$auth.user.zipcode + " " + this.$auth.user.street+ ", N.º " +this.$auth.user.addressDetails+ "\nFone" +this.$auth.user.phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
        }else{
          this.contactMessage= "O usuário \n" +this.$auth.user.name+ "\nPessoa Física" + "\nId " +this.$auth.user.id+ "\nCEP " +this.$auth.user.zipcode + " " + this.$auth.user.street+ ", N.º " +this.$auth.user.addressDetails+ "\nFone" +this.$auth.user.phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
        }
      }else if(localStorage.cep != 'null' && localStorage.serves_type != 'null'){
        this.contactMessage= "Um usuário anônimo \n" + localStorage.serves_type +  "\nCEP " +localStorage.cep + "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
            }else{
              this.contactMessage= "Um usuário anônimo entrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
      }
    },
    generateContactViaPhoneNumberText(){
      if(this.$auth.loggedIn){
        if(this.$auth.user.cnpj){
          this.contactMessage = "O usuário \n" +this.$auth.user.name+ "\nPessoa Jurídica" + "\nId " +this.$auth.user.id+ "\nCEP " +this.$auth.user.zipcode + " " + this.$auth.user.street+ ", N.º " +this.$auth.user.addressDetails+ "\nFone" +this.$auth.user.phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
        }else{
          this.contactMessage = "O usuário \n" +this.$auth.user.name+ "\nPessoa Física" + "\nId " +this.$auth.user.id+ "\nCEP " +this.$auth.user.zipcode + " " + this.$auth.user.street+ ", N.º " +this.$auth.user.addressDetails+ "\nFone" +this.$auth.user.phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
        }
      }else if(localStorage.cep != 'null' && localStorage.serves_type != 'null'){
        this.contactMessage= "Um usuário anônimo \n" + localStorage.serves_type +  "\nCEP " +localStorage.cep + "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
            }else{
              this.contactMessage = "Um usuário anônimo entrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
      }
    },
    sendContactNotification(){
      this.generateContactViaPhoneNumberText();
      setTimeout(() => {
        ContactService.userContactedSupplierNotification(this.contactMessage);
      }, 1000);
    }
  },
  components: {
    ReviewOrderProductCard,
    HowItWorks,
    // VFooter,
    // VProductCard,
  },
  mixins: [priceFormatter],
};
</script>

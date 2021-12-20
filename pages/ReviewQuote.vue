<template>
<div v-if="supplier">
  <div class="header-navbar-shadow"></div>
  <div class="content-wrapper mt-0">
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
    <div class="content-body" :style="mobileBrowser ? 'max-height: calc(100vh - 7em);' : ''">
      <div class="py-2 px-2 bg-white" style="height: 65px; margin: -2.35rem -2.20rem 1.50rem -2.20rem;">
        <a href="/" >
          <div class="brand-logo-mf-color mt-0"></div>
        </a>
      </div>
      <div class="row" style="max-height: calc(100vh - 7.5em); overflow-y: scroll; overflow-x: hidden; padding-bottom: 10em;">
          <div class="col-md-9 pb-5 pb-md-0" :style="this.mobileBrowser ? '' : 'padding-right: 20px;' ">
            <div class="card shadow-sm mt-0" :style="mobileBrowser ? '' : 'position: sticky; top: 0px; z-index: 800;'">
              <div class="card-body p-1">
                <router-link :to="{ name: 'public-store', params: { supplierSlug: supplier.nameForUrl } }">
                  <span class="font-weight-bold d-block d-md-inline">
                    <i class="feather icon-chevron-left mr-25"></i>
                    Voltar à loja
                  </span>
                </router-link>
                <div style="padding-top: 10px;">
                  <h5 class="d-block d-md-inline mb-0">
                    Confira se está tudo certo
                  </h5>
                </div>
              </div>
            </div>
            <div class="card shadow-sm mb-2" v-if="mobileBrowser" style="">
              <div class="card-body p-1 ml-0">
                <h6 class="disabled-opacity">Solicitar preço a</h6>
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
            <div v-for="(collections, family) in resumedQuoteCart" :key="family">
              <h3 style="color: grey;" v-if="productsFromFamily(family).length > 0">{{ family }}</h3>

              <span
                v-for="(categories, collection) in collections"
                :key="collection"
              >
                <span
                  v-for="(productTypes, category) in categories"
                  :key="category"
                  class=""
                >
                  <span
                    v-for="(properties, type) in productTypes"
                    :key="type"
                  >
                    <span v-if="productsFromProductType(type, category).length > 0">
                      <p class="mb-0 mt-1"><i v-if="collection">{{ collection }} &nbsp;|&nbsp;</i> {{ category }}</p>
                      <p class="mb-50 font-weight-bold">{{ type }}</p>
                      <span v-for="product in productsFromProductType(type, category)" :key="'product' + product.id">
                        <div class="card shadow-sm">
                          <div class="card-body p-0">

                            <review-quote-product-card
                              :product="product"
                              :mobileBrowser="mobileBrowser"
                              @item-removed="updateQuoteCart"
                            />

                          </div>
                        </div>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
              <br>
            </div>
            <!-- <v-footer :class="this.mobileBrowser == true ? 'mobile' : 'desktop' " style="margin-top:100px; margin-bottom: 100px;" /> -->
          </div>
          <div v-if="!mobileBrowser" class="col-md-3">
            <div class="card shadow-sm mb-2" style="position: sticky; top: 0px;">
              <div class="card-body p-1 ml-0">
                <h6 class="disabled-opacity">Solicitar preços a</h6>
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
                <div class="">{{ supplier.user.legalName }}</div>
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
                </div>
                <div class="col-6 text-right">
                  <span class="d-block mb-25">
                    {{ supplier.minimumOrderValue }}
                  </span>
                </div>
                <div class="col-11 p-1 ml-1 mr-1 font-small-2" style="background-color: #fae3a5; border-radius: 7px;">
                  Pagamento e entrega são resolvidos diretamente com o fornecedor.<br>
                  <a href="javascript:void(0);" @click="openPopup()">Saiba mais</a>
                </div>
                <div class="col-12">
                  <button
                    :disabled="isDisabled"
                    @click="newQuote"
                    class="btn btn-primary waves-effect waves-light font-weight-bold font-medium-1 w-100 mt-0 mt-md-1 px-0"
                  >
                   <span>
                     <img :src="require(`@/assets/images/tag_branca.png`)" alt="*" width="18" height="18" />
                     Solicitar preços
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
                </div>
                <div class="col-6 text-right">
                  <span class="d-block mb-25">
                    {{ supplier.minimumOrderValue }}
                  </span>
                </div>
                <div class="col-11 ml-1 mr-1 font-small-2" style="background-color: #fae3a5; border-radius: 7px; padding: 10px; margin-bottom: 3px;">
                  Pagamento e entrega são resolvidos diretamente com o fornecedor.<br>
                </div>
                <div class="col-12">
                  <button
                    :disabled="isDisabled"
                    @click="newQuote"
                    class="btn btn-primary waves-effect waves-light font-weight-bold font-medium-1 w-100 mt-0 mt-md-1 px-0"
                  >
                   <span>
                     <img :src="require(`@/assets/images/tag_branca.png`)" alt="*" width="18" height="18" />
                     Solicitar preços
                   </span>
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
import VProductCard from "@/components/products/ProductCard";
import ReviewQuoteProductCard from "@/components/products/ReviewQuoteProductCard";
import VFooter from "@/layouts/components/VFooter";
import priceFormatter from "@/mixins/priceFormatter";
import HowItWorks from "@/pages/como-funciona.vue"
import ContactService from "@/services/contact"

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
      productLoading: false,
      homeLoading: false,
      open: false,
    };
  },

  mounted() {
    this.isLoading = true
    this.isMobile()
    this.currentScreen = 'menu'
    this.getQuoteCart().then(() => {
      if(this.productQuoteCart && this.productQuoteCart.length)
        this.getSupplierById(this.productQuoteCart[0].supplierId)
      if(this.$route.query.autoOpen && (this.$route.query.autoOpen == 'true' || this.$route.query.autoOpen == true)) {
        if(this.productQuoteCart && this.productQuoteCart.length) {
          this.newQuote()
        } else
          this.$router.push({ name: 'home' })
      }
      this.getProductsFromIds(this.productsInCartIds)
        setTimeout(() => {
         this.isLoading = false
        }, 1000);
    })
  },

  computed: {
    ...mapState("products", ["products"]),
    ...mapState("quotes", ["quoteSuppliers", "quotes"]),
    ...mapState("suppliers", ["supplier"]),
    ...mapState("users/products", [
      "productTypeName",
      "resumedQuoteCart",
      "productQuoteCart"
    ]),
    productsInCartIds() {
      return this.$store.state.users.products.productQuoteCart.map(product => product.id)
    },
    productsInQuoteCart() {
      if (this.$store.state.users.products.productQuoteCart)
        return this.$store.state.users.products.productQuoteCart.length
      else
        return 0
    },
    productsInList() {
      if (this.$store.state.users.products.totalProductList)
        return this.$store.state.users.products.totalProductList
      else
        return 0
    },
    isDisabled() {
      if(this.productsInQuoteCart > 0)
        return false
      else
        return true
    },
    suppliersCountText() {
      if(this.quoteSuppliers && this.quoteSuppliers > 1)
        return 'fornec. serão acionados'
      else if(this.quoteSuppliers == 1)
        return 'fornec. será acionado'
      else
        return null
    },
  },

  methods: {
    ...mapActions("products", ["getProductsFromIds"]),
    ...mapActions("quotes", ["countQuoteSuppliers", "createQuote"]),
    ...mapActions("suppliers", ["getSupplierById"]),
    ...mapActions("users/products", [
      "getQuoteCart",
      "getResumedQuoteCart",
      "clearQuoteCart",
      "clearResumedQuoteCart"
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
      return this.products.filter(prod => (prod.productTypeName == productTypeName && prod.categoryName == categoryName))
    },
    productsFromFamily(familyName) {
      return this.products.filter(prod => prod.familyName == familyName)
    },
    newQuote() {
      if(this.$auth.check()) {
         setTimeout(() => {
          this.$vs.loading()
          this.createQuote(this.productQuoteCart.map(product => ({ product_id: product.id, supplier_id: product.supplierId }))).then(() => {
            this.clearQuoteCart()
            setTimeout(() => {
              this.$vs.loading.close()
              this.$router.push({ path: '/pedidos', query: { pricesId: this.quotes.id } })
            }, 300)
          })
        }, 300);
      } else {
        setTimeout(() => {
          this.$router.push({ name: 'sign-up' })
        }, 300);
      }
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
    showScreen(name){
      if(this.mobileBrowser && this.currentScreen == name) {
        return true
      } else if(!this.mobileBrowser) {
        return true
      } else {
        return false
      }
    },
    toMyProducts(){
      this.productLoading = true
      setTimeout(() => {
        this.productLoading = false
        location.href = '/minha-lista-de-produtos'
      }, 300);
    },
    toHome(){
      this.homeLoading = true
      setTimeout(() => {
        this.homeLoading = false
        location.href ='/'
      }, 300);
    },
    formatCNPJ(value){
      return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    },
    completeAdress(street, addressDetails, neighborhood, city, state) {
      return `${street}, ${addressDetails}, ${neighborhood}, ${city} - ${state}`
    },
    openPopup() {
      this.open = !this.open
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
      if(this.$auth.check()){
        if(this.$auth.user().cnpj){
          this.contactMessage= "O usuário \n" +this.$auth.user().name+ "\nPessoa Jurídica" + "\nId " +this.$auth.user().id+ "\nCEP " +this.$auth.user().zipcode + " " + this.$auth.user().street+ ", N.º " +this.$auth.user().addressDetails+ "\nFone" +this.$auth.user().phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
        }else{
          this.contactMessage= "O usuário \n" +this.$auth.user().name+ "\nPessoa Física" + "\nId " +this.$auth.user().id+ "\nCEP " +this.$auth.user().zipcode + " " + this.$auth.user().street+ ", N.º " +this.$auth.user().addressDetails+ "\nFone" +this.$auth.user().phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
        }
      }else if(localStorage.cep != 'null' && localStorage.serves_type != 'null'){
        this.contactMessage= "Um usuário anônimo \n" + localStorage.serves_type +  "\nCEP " +localStorage.cep + "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
            }else{
              this.contactMessage= "Um usuário anônimo entrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
      }
    },
    generateContactViaPhoneNumberText(){
      if(this.$auth.check()){
        if(this.$auth.user().cnpj){
          this.contactMessage = "O usuário \n" +this.$auth.user().name+ "\nPessoa Jurídica" + "\nId " +this.$auth.user().id+ "\nCEP " +this.$auth.user().zipcode + " " + this.$auth.user().street+ ", N.º " +this.$auth.user().addressDetails+ "\nFone" +this.$auth.user().phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
        }else{
          this.contactMessage = "O usuário \n" +this.$auth.user().name+ "\nPessoa Física" + "\nId " +this.$auth.user().id+ "\nCEP " +this.$auth.user().zipcode + " " + this.$auth.user().street+ ", N.º " +this.$auth.user().addressDetails+ "\nFone" +this.$auth.user().phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
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
    ReviewQuoteProductCard,
    //VFooter,
    HowItWorks,
    // VProductCard,
  },
  mixins: [priceFormatter],
};
</script>

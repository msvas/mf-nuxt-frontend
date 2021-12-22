<template>
<div >
<div class="row" @click="checkOpenAdd($event)" >
  <meta itemprop="sku" :content="product.id" />
  <meta itemprop="productID" :content="product.id" />
  <meta itemprop="inProductGroupWithID" :content="product.productTypeId" />
    <div  class="col-12 pt-1">
      <a
        href="javascript:void(0);"
        data-toggle="lightbox"
        title="Foto do produto"
        data-title="Maionese"
        class="float-right"
        tabindex="-1"
      >
        <img v-if="product.picture" class="rounded img-fluid" :src="product.picture" alt style="width: 100%; height: auto;" />
        <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: 100%; height: auto;" />
        <div class="badge badge-pill badge-md bg-mf-laranja" style="position: absolute; bottom: 5px; left: 10px;">
          <b>{{ quantifiers(true) == 'Und. 1 und' ? 'Und' :  quantifiers(true) }}</b>
        </div>
      </a>
    </div>
    <div itemprop="name" class="col-12" >
      <div class="col-12 p-0 pb-1 pt-1">
        <p class="m-0" style="color: #333;">
          {{ productBrandName }}<span v-if="productBrandName && product.productLineName">,</span>
          {{ product.productLineName }}<span v-if="product.productLineName && product.productLineExtensionName">,</span>
          {{ product.productLineExtensionName }}
        </p>
        <p class="m-0 font-weight-bold text-success"><b>{{ product.propertyName }}</b></p>
      </div>
      <div class="col-12 p-0 pb-1 font-small-3">
        <v-new-secondary-characteristics :product="product" />
      </div>
    </div>
  <div
    :class="'card-text clearfix p-0 position-relative'"
    v-if="!isProductList || (isProductList && product.hasSupplier)"
    style="width: -webkit-fill-available;"
  >
    <div class="bg-transparent rounded-bottom">
      <a
        data-toggle="collapse"
        href="javascript:void(0)"
        aria-expanded="false"
        :aria-controls="'collapseCotacaoCard-' + product.id"
        @click="checkOpenAdd($event)"
        class="card-link pl-1 font-weight-bold d-block collapsed"
        style="padding-bottom: 8px"
        :ref="'addProduct' + product.id"
        v-if="!adding && !product.onQuotation"
      >
        Solicitar o preço
      </a>
      <div
        v-else-if="product.onQuotation"
        class="position-absolute w-100 rounded-bottom collapse show"
        style="top: 0px; background-color: #dcdcdc; max-height: 28px"
      >
        <span
          class="text-center float-left w-75 d-block"
          style="padding-top: 5px"
          >Preço solicitado</span
        >
        <a
          data-toggle="collapse"
          aria-expanded="false"
          title="Abrir cotação que contém este produto"
          class="
            text-center
            float-right
            bg-white
            d-block
            w-25
            text-body
            collapsed
          "
          style="border-bottom-right-radius: 0.4rem; padding: 0.2rem 0.6rem"
          @click="openQuotation(product.onQuotation.quoteId)"
        >
          Ver
        </a>
      </div>
      <span v-show="adding">
        <div
          :id="'div-with-loading' + this.product.id"
          class="vs-con-loading__container"
        >
          Adicionando...
        </div>
      </span>
    </div>
    <div
      :class="buttonClass(product.id)"
      :id="'collapseCotacaoCard-' + product.id"
      style="top: 0px; max-height: 28px"
    >
      <span
        v-if="!removing"
        class="text-center float-left w-75 font-weight-bold d-block text-white"
        style="padding-top: 5px"
        >Selecionado</span
      >
      <span
        v-else
        class="text-center float-left w-75 font-weight-bold d-block text-white"
      >
        <div
          :id="'div-with-loading' + this.product.id"
          class="vs-con-loading__container"
          style="padding-top: 5px"
        >
          Removendo...
        </div>
      </span>
      <a
        href="javascript:void(0)"
        data-toggle="collapse"
        aria-expanded="false"
        :aria-controls="'#collapseCotacaoCard-' + product.id"
        title="Remover da cotação"
        class="text-center float-right bg-white d-block text-body collapsed"
        style="border-bottom-right-radius: 0.4rem; padding: 0.2rem 0.6rem"
        @click="removeFromCart(product.id)"
      >
        <i class="feather icon-x font-medium-3"></i>
      </a>
    </div>
  </div>
  </div>
  <different-cart-modal
    :openPopup="differentCartPopup"
    @clear-cart-and-add="clearCartAndAdd"
    @update-modal="updateDifferentCartPopup"
  />
    <vs-popup title="Um momento..." :active.sync="showLoadingAlert">
      <div>
        <h5 class="d-flex justify-content-center">Carregando os produtos de distribuidoras da sua região.</h5>
        <div class="d-flex justify-content-center" style="margin-top: 20px; margin-bottom: 20px;">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </vs-popup>
  </div>
</template>

<style scoped>
@media only screen and (min-width: 768px) {
  .photo-height {
    height: 200px;
  }
}
@media only screen and (max-width: 767px) {
  .photo-height {
    height: 150px;
  }
}
.type-link {
  color: inherit;
}
.type-link:hover {
  color: inherit;
  text-decoration: underline;
}
</style>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import { mask } from "vue-the-mask";
import VNewSecondaryCharacteristics from "@/components/products/VNewSecondaryCharacteristics";
import cardTitle from "@/mixins/cardTitle";
import LoginDropdown from "@/components/login/LoginDropdown";
import MailingListModal from "@/components/home/MailingListModal";
import ZipcodeNotFoundModal from "@/components/home/ZipcodeNotFoundModal";
import DifferentCartModal from "@/components/users/DifferentCartModal";
import StateService from "@/services/states";

export default {
  name: "ProductCardManualStore",
  data() {
    return {
      openPopup: false,
      adding: false,
      removing: false,
      noImageSrc: require(`@/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`),
      zipcode: undefined,
      userType: 'PJ',
      cityText: "",
      allowedUf: false,
      show: false,
      active: false,
      openUnavailableUf: false,
      openNoZipcode: false,
      opened: false,
      errorColor: 'black',
      showLoadingAlert: false,
      differentCartPopup: false,
    };
  },
  created() {
  },
  watch:{
    // cityId(newValue) {
    //   if(this.active) {
    //     if (newValue && newValue != "erro") {
    //       setTimeout(() => {
    //         this.cityText = this.informedCity + "/" + this.informedUF;
    //         if (this.informedUF) this.checkForUf(this.informedUF);
    //       }, 100);
    //     } else if (newValue == "erro") {
    //       this.cityText = "CEP não encontrado";
    //       this.$vs.loading.close();
    //       this.openNoZipcode = true;
    //       this.allowedUf = false;
    //       this.active = false
    //     }
    //   }
    // },
    // ufId(newValue) {
    //   if(this.active) {
    //     if (newValue) {
    //       setTimeout(() => {
    //         this.cityText = this.informedCity + "/" + this.informedUF;
    //         if (this.informedUF) this.checkForUf(this.informedUF);
    //       }, 100);
    //     }
    //   }
    // },
  },
  computed: {
    ...mapState("navigationFilters", ["city", "allowed"]),
    ...mapState("suppliers", ["manualStoreId"]),
    ...mapState("users/products", ["productQuoteCart"]),
    ...mapGetters("navigationFilters", [
                  "params",
                  "allowEntrance",
                  "informedCity",
                  "informedUF"]),

    ...mapGetters("users/products", [
                  "productIsOnList",
                  "productIsOnCart",
                  "productIsOnCartWithSupplier",
                  "productCartIsEmpty",]),

    isDisabled() {
      if (
        this.userType &&
        this.zipcode &&
        this.zipcode.length == 9
      )
        return false;
      else
        return true;
    },
    cityId() {
      return this.informedCity;
    },
    ufId() {
      return this.informedUF;
    },
    classes() {
      // if (this.isProductTypeView) {
      //   return "col-xl-2 col-md-4 col-6 mb-5";
      // }

      // if (this.isCategoryView || this.isFamilyView || this.isSearchView) {
      //   return "col-xl-3 col-md-4 col-6 mb-5";
      // }

      return "mb-1";
    },
    isProductTypeView() {
      return this.$route.name === "product-type";
    },
    isCategoryView() {
      return this.$route.name === "category";
    },
    isSearchView() {
      return this.$route.name === "users.search";
    },
    isFamilyView() {
      return this.$route.name === "family";
    },
    addedInfo() {
      var total = this.$store.state.users.products.productQuoteCart.length + 1;
      if (this.$store.state.users.products.productQuoteCart)
        return total + " produtos a cotar";
      else return "0 produtos a cotar";
    },
    hasWidth() {
      if (this.widthRatio) return "width: " + this.widthRatio + "%;";
      else return "";
    },
  },
  methods: {
    ...mapActions("users/products", [
      "insertProductToProductList",
      "removeProductFromProductList",
      "insertProductToQuoteCart",
      "removeProductFromQuoteCart",
      "canAddProduct",
      "clearQuoteCart",
    ]),

    ...mapActions("navigationFilters", [
      "setCep",
      "setCity",
      "setRegion",
      "setAllowed",
      "setSupplierServes",
      "clearCity",
      "clearFilterParams",
      "setAllowed",
    ]),

    checkOpenAdd(ev) {
      if(this.$browserDetect.isIOS) {
        this.$emit('open-safari-warning')
      } else {
        if(this.$auth.loggedIn || (this.allowEntrance && this.allowEntrance != 'false'))
          this.addOrRemoveToCart(this.product)
        else {
          this.opened = true
          this.active = true
          this.$emit('fill-location', ev.target)
        }
      }
    },
    openQuotation(quoteId) {
      this.$router.push({
        name: "users.quotePanel",
        params: { quoteId: quoteId },
      });
    },
    buttonClass(id) {
      if (!this.productCartIsEmpty && this.productIsOnCartWithSupplier({ productId: id, supplierId: this.manualStoreId }))
        return "position-absolute w-100 rounded-bottom bg-primary collapse show";
      else return "position-absolute w-100 rounded-bottom bg-primary collapse";
    },
    backgroundClass(id) {
      if (!this.productCartIsEmpty && this.productIsOnCartWithSupplier({ productId: id, supplierId: this.manualStoreId }))
        return " bg-white";
      else return " bg-transparent";
    },
    addOrRemoveToCart(product) {
      if (!this.adding && !this.removing && !product.onQuotation) {
        if (this.productIsOnCartWithSupplier({ productId: product.id, supplierId: this.manualStoreId }))
          this.removeFromCart(product.id);
        else
          this.addToCart(product.id);
      }
    },
    updateInfoPopup(val) {
      this.openPopup = val;
    },
    clearCartAndAdd() {
      this.clearQuoteCart().then(() => {
        setTimeout(() => {
          this.addOrRemoveToCart(this.product)
        }, 300)
      })
    },
    removeFromCart(id) {
      this.removing = true;
      this.removeProductFromQuoteCart(id).then(() => {
        // this.cartInfo(
        //   "Produto removido da cotação",
        //   "remove-cart-toast-class",
        //   "feather icon-minus-circle"
        // );
        setTimeout(() => {
          this.removing = false;
        }, 300);
      });
    },
    addToCart(id) {
      this.adding = true;
      this.openLoadingInDiv()
      if(this.productQuoteCart.length == 0 || (this.productQuoteCart[0].supplierId == this.manualStoreId)) {
        this.insertProductToQuoteCart({ productId: id, supplierId: this.manualStoreId }).then(() => {
          // this.cartInfo(
          //   this.addedInfo,
          //   "add-cart-toast-class",
          //   "feather icon-plus-circle"
          // );
          setTimeout(() => {
            this.adding = false;
          }, 300);
        });
      } else if(this.productQuoteCart.length > 0) {
        this.differentCartPopup = true
        this.adding = false
      }
    },
    openLoadingInDiv() {
      let container = "#div-with-loading" + this.product.id;
      this.$vs.loading({
        container: container,
        scale: 0.6,
      });
    },
    imgAltText() {
      return `${this.product.productTypeName} ${this.product.propertyName} ${
        this.quantifiers(true) == "Und. 1 und" ? "Und" : this.quantifiers(true)
      } ${this.product.brandName} ${
        this.product.productLineName ? this.product.productLineName : ""
      } ${
        this.product.productLineExtensionName
          ? this.product.productLineExtensionName
          : ""
      }`;
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true;
      } else {
        return false;
      }
    },
    updateDifferentCartPopup(value) {
      this.differentCartPopup = value;
    },

  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    blockProductTypeTitle: {
      type: Boolean,
    },
    widthRatio: {
      type: Number,
    },
    isProductList: {
      type: Boolean,
    },
  },
  directives: {
    mask,
  },
  components: {
    VNewSecondaryCharacteristics,
    DifferentCartModal,
  },
  mixins: [cardTitle],
};
</script>

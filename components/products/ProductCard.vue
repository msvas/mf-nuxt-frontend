<template>
<div >
<div class="row" @click="clickedCard()" >
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
    <div  class="col-12" >
      <a @click="clickedCard()"
        style="width: 100%; display: block; color: inherit;"
        href="javascript:void(0)"
        itemprop="name"
      >
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
      </a>
    </div>
  <div
    :class="'card-text clearfix p-0 position-relative'"
    v-if="!isProductList || (isProductList && product.hasSupplier)"
    style="width: -webkit-fill-available;"
  >
    <div class="bg-transparent rounded-bottom" style="padding: 0 10px 10px 10px;">
      <div class="row" v-if="!product.automaticSuppliers.length && product.manualSuppliers.length == 1">
        <nuxt-link
          :to="{ name: 'public-store-product',
                 params: {
                   supplierSlug: product.manualSuppliers[0].nameForUrl,
                   familyName: formatString(product.familyName),
                   categoryName: formatString(product.categoryName),
                   productTypeName: formatString(product.productTypeName)
                  }
                }"
          style="width: 100%; display: block; color: inherit;"
        >
          <div class="col-12 font-medium-1" >
            <b>Solicitar preço</b>
          </div>
          <div class="col-12" >
            <vs-button
              color="primary"
              type="flat"
              style="padding: 0;"
              @click="$router.push({ name: 'public-store-product',
                                     params: {
                                       supplierSlug: product.manualSuppliers[0].nameForUrl,
                                       familyName: formatString(product.familyName),
                                       categoryName: formatString(product.categoryName),
                                       productTypeName: formatString(product.productTypeName)
                                      }
                                    })"
            >
              {{ product.manualSuppliers[0].name }}
            </vs-button>
          </div>
        </nuxt-link>
      </div>
      <div class="row" v-else-if="!product.automaticSuppliers.length && product.manualSuppliers.length > 1">
        <a @click="updateSuppliersModal(true)"
          style="width: 100%; display: block; color: inherit;"
          href="javascript:void(0)"
        >
          <div class="col-12 font-medium-1" >
            <b>Solicitar preço</b>
          </div>
          <div class="col-12" >
            <vs-button type="line" style="padding: 0 0 1px 0;" @click="updateSuppliersModal(true)">Ver fornecedores</vs-button>
          </div>
        </a>
      </div>
      <div class="row" v-else-if="product.automaticSuppliers.length == 1 && pricedExpeditions(product.automaticSuppliers).length == 1 && !product.manualSuppliers.length">
        <nuxt-link
          :to="{ name: 'public-store-product-page',
                 params: { supplierSlug: product.automaticSuppliers[0].nameForUrl,
                           familyName: formatString(product.familyName),
                           categoryName: formatString(product.categoryName),
                           productTypeName: formatString(product.productTypeName),
                           identifier: productIdentifier(product) } }"
          style="width: 100%; display: block; color: inherit;"
        >
          <div v-if="hasDiscount(pricedExpeditions(product.automaticSuppliers)[0]) && !pricedExpeditions(product.automaticSuppliers)[0].unavailability" class="col-12 font-small-2" >
            A partir de
          </div>
          <div v-else class="col-12" >

          </div>
          <div v-if="!pricedExpeditions(product.automaticSuppliers)[0].unavailability" class="col-12 font-medium-3" >
            <b>{{ formatPrice(checkDiscounts(pricedExpeditions(product.automaticSuppliers)[0])) }}</b>
          </div>
          <div v-else class="col-12 font-medium-3" >
            <span class="badge badge-pill font-small-3" style="margin-right: 5px; color: #4d4d4d; background-color: #f0f0f0;">
              Sem estoque
            </span>
          </div>
          <div class="col-12 font-small-3" v-if="getLowestPrice(product.automaticSuppliers) > 0 && product.packagingName && product.quantity && pricePerBaseUnitWithDiscount(getLowestExpedition(product.automaticSuppliers), biggestRange(getLowestExpedition(product.automaticSuppliers)), false)">
            <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
             {{ pricePerBaseUnitWithDiscount(getLowestExpedition(product.automaticSuppliers), biggestRange(getLowestExpedition(product.automaticSuppliers)), false).substring(3)}}
            </i>
            <span v-if="product.unitsOfMeasurementMeasureType == 'solid'">
              <i style="color: #5f6666;" > p/ kg</i>
            </span>
            <span v-else>
              <span v-if="product.packagingName != 'Und.'" >
                <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</i>
                <i style="color: #5f6666;" v-else> p/ und</i>
              </span>
            </span>
          </div>
          <div class="col-12" >
            <vs-button
              color="primary"
              type="flat"
              style="padding: 0;"
              @click="goToProductPage(product)"
            >
              {{ product.automaticSuppliers[0].name }}
            </vs-button>
          </div>
        </nuxt-link>
      </div>
      <div class="row" v-else-if="product.automaticSuppliers.length == 1 && pricedExpeditions(product.automaticSuppliers).length > 1 && !product.manualSuppliers.length">
        <nuxt-link
          :to="{ name: 'public-store-product-page',
                 params: { supplierSlug: product.automaticSuppliers[0].nameForUrl,
                           familyName: formatString(product.familyName),
                           categoryName: formatString(product.categoryName),
                           productTypeName: formatString(product.productTypeName),
                           identifier: productIdentifier(product) } }"
          style="width: 100%; display: block; color: inherit;"
        >
          <div v-if="getLowestPrice(product.automaticSuppliers) > 0" class="col-12 font-small-2" >
            A partir de
          </div>
          <div v-if="getLowestPrice(product.automaticSuppliers) > 0" class="col-12 font-medium-3" >
            <b>{{ formatPrice(getLowestPrice(product.automaticSuppliers)) }}</b>
          </div>
          <div v-else class="col-12 font-medium-3" >
            <span class="badge badge-pill font-small-3" style="margin-right: 5px; color: #4d4d4d; background-color: #f0f0f0;">
              Sem estoque
            </span>
          </div>
          <div class="col-12 font-small-3" v-if="getLowestPrice(product.automaticSuppliers) > 0 && product.packagingName && product.quantity && pricePerBaseUnitWithDiscount(getLowestExpedition(product.automaticSuppliers), biggestRange(getLowestExpedition(product.automaticSuppliers)), false)">
            <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
             {{ pricePerBaseUnitWithDiscount(getLowestExpedition(product.automaticSuppliers), biggestRange(getLowestExpedition(product.automaticSuppliers)), false).substring(3)}}
            </i>
            <span v-if="product.unitsOfMeasurementMeasureType == 'solid'">
              <i style="color: #5f6666;" > p/ kg</i>
            </span>
            <span v-else>
              <span v-if="product.packagingName != 'Und.'" >
                <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</i>
                <i style="color: #5f6666;" v-else> p/ und</i>
              </span>
            </span>
          </div>
          <div class="col-12" >
            <vs-button
              color="primary"
              type="flat"
              style="padding: 0;"
              @click="goToProductPage(product)"
            >
              {{ product.automaticSuppliers[0].name }}
            </vs-button>
          </div>
        </nuxt-link>
      </div>
      <div class="row" v-else-if="product.automaticSuppliers.length >= 1 && product.manualSuppliers.length >= 1">
        <a @click="updateSuppliersModal(true)"
          style="width: 100%; display: block; color: inherit;"
          href="javascript:void(0)"
        >
          <div v-if="getLowestPrice(product.automaticSuppliers) > 0" class="col-12 font-small-2" >
            A partir de
          </div>
          <div v-if="getLowestPrice(product.automaticSuppliers) > 0" class="col-12 font-medium-3" >
            <b>{{ formatPrice(getLowestPrice(product.automaticSuppliers)) }}</b>
          </div>
          <div v-else class="col-12 font-medium-3" >
            <span class="badge badge-pill font-small-3" style="margin-right: 5px; color: #4d4d4d; background-color: #f0f0f0;">
              Sem estoque
            </span>
          </div>
          <div class="col-12 font-small-3" v-if="getLowestPrice(product.automaticSuppliers) > 0 && product.packagingName && product.quantity && pricePerBaseUnitWithDiscount(getLowestExpedition(product.automaticSuppliers), biggestRange(getLowestExpedition(product.automaticSuppliers)), false)">
            <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
             {{ pricePerBaseUnitWithDiscount(getLowestExpedition(product.automaticSuppliers), biggestRange(getLowestExpedition(product.automaticSuppliers)), false).substring(3)}}
            </i>
            <span v-if="product.unitsOfMeasurementMeasureType == 'solid'">
              <i style="color: #5f6666;" > p/ kg</i>
            </span>
            <span v-else>
              <span v-if="product.packagingName != 'Und.'" >
                <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</i>
                <i style="color: #5f6666;" v-else> p/ und</i>
              </span>
            </span>
          </div>
          <div class="col-12" >
            <vs-button type="line" style="padding: 0 0 1px 0;" @click="updateSuppliersModal(true)">Ver fornecedores</vs-button>
          </div>
        </a>
      </div>
      <div class="row" v-else-if="product.automaticSuppliers.length > 1">
        <a @click="updateSuppliersModal(true)"
          style="width: 100%; display: block; color: inherit;"
          href="javascript:void(0)"
        >
          <div v-if="getLowestPrice(product.automaticSuppliers) > 0" class="col-12 font-small-2" >
            A partir de
          </div>
          <div v-if="getLowestPrice(product.automaticSuppliers) > 0" class="col-12 font-medium-3" >
            <b>{{ formatPrice(getLowestPrice(product.automaticSuppliers)) }}</b>
          </div>
          <div v-else class="col-12 font-medium-3" >
            <span class="badge badge-pill font-small-3" style="margin-right: 5px; color: #4d4d4d; background-color: #f0f0f0;">
              Sem estoque
            </span>
          </div>
          <div class="col-12 font-small-3" v-if="getLowestPrice(product.automaticSuppliers) > 0 && product.packagingName && product.quantity && pricePerBaseUnitWithDiscount(getLowestExpedition(product.automaticSuppliers), biggestRange(getLowestExpedition(product.automaticSuppliers)), false)">
            <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
             {{ pricePerBaseUnitWithDiscount(getLowestExpedition(product.automaticSuppliers), biggestRange(getLowestExpedition(product.automaticSuppliers)), false).substring(3)}}
            </i>
            <span v-if="product.unitsOfMeasurementMeasureType == 'solid'">
              <i style="color: #5f6666;" > p/ kg</i>
            </span>
            <span v-else>
              <span v-if="product.packagingName != 'Und.'" >
                <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</i>
                <i style="color: #5f6666;" v-else> p/ und</i>
              </span>
            </span>
          </div>
          <div class="col-12" >
            <vs-button type="line" style="padding: 0 0 1px 0;" @click="updateSuppliersModal(true)">Ver fornecedores</vs-button>
          </div>
        </a>
      </div>
    </div>
  </div>
  </div>
  <zipcode-not-found-modal
    :openPopup="openNoZipcode"
    @update-modal="updateZipcodeNotFound"
    v-if="opened"
  />
  <mailing-list-modal
    :openPopup="openUnavailableUf"
    @update-modal="updateUnavailableUf"
    :uf="ufId"
    v-if="opened"
  />
  <different-cart-modal
    :openPopup="differentCartPopup"
    @clear-cart-and-add="clearCartAndAdd"
    @update-modal="updateDifferentCartPopup"
  />
  <product-suppliers-modal
    :openPopup="openSuppliersModal"
    :product="product"
    @update-modal="updateSuppliersModal"
  />
  <vs-popup title="Defina sua localização" :active.sync="active">
      <h4 style="font-weight: normal;">Veja os produtos das distribuidoras locais</h4>
      <div
        class="bg-white shadow-sm rounded p-2"
        data-aos="fade-right"
        data-aos-delay="150"
        style="margin-bottom: 20px"
      >
        <div class="row" style="margin: 0px; max-height: 70px">
          <div class="form-group">
            <label
              ><small><strong>Seu CEP</strong></small></label
            >
            <div class="input-group">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <i class="feather icon-map-pin" />
                </div>
              </div>
              <input
                :id="'cepInput' + product.id"
                data-vv-name="zipcode"
                v-mask="'#####-###'"
                input
                type="tel"
                pattern="[0-9]*"
                novalidate
                class="form-control required"
                v-model="zipcode"
                :style="
                  errorColor == 'red' ?
                  'max-width: 90px; padding-left: 5px; border-radius: 0px 5px 5px 0px; border: solid 1px red;' :
                  'max-width: 90px; padding-left: 5px; border-radius: 0px 5px 5px 0px;'"
                autofocus
              />
              <b-tooltip
                v-if="show && isDisabled"
                :show.sync="show"
                :target="'cepInput' + product.id"
                placement="top"
              >
                Digite seu CEP
              </b-tooltip>
            </div>
            <small
              id=""
              class="form-text text-muted mt-1"
              :style="
                'max-width: 90px; color: ' + errorColor + '!important; margin: 5px 0px 0px 0px !important;'"
              ><b>{{ cityText }}</b></small
            >
          </div>
          <div class="form-group">
            <label
              ><small><strong>Você é...</strong></small></label
            >
            <div class="input-group">
              <div v-if="!isMobile" class="input-group-prepend">
                <div class="input-group-text">
                  <i
                    v-if="this.userType == 'PJ'"
                    class="feather icon-briefcase"
                  />
                  <i v-if="this.userType == 'PF'" class="feather icon-user" />
                </div>
              </div>
              <select
                class="custom-select select-size"
                id=""
                v-model="userType"
                style="padding-left: 5px"
              >
                <option value="PJ">Pessoa jurídica</option>
                <option value="PF">Pessoa física</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>&nbsp;</label>
            <span ref="minTooltip" v-tooltip.bottom.hover="{ content: 'É preciso preencher os campos ao lado.', visible: isDisabled }">
              <span>
                <button
                  id="btnEntrar"
                  type="submit"
                  class="btn btn-primary btn-block btn-size"
                  :disabled="isDisabled"
                  @click="setParams()"
                  style="
                    background: linear-gradient(
                      45deg,
                      rgba(3, 145, 209, 1) 50%,
                      rgba(5, 242, 240, 1) 100%
                    );
                    font-weight: 800;
                    opacity: 1;
                  "
                >
                  Entrar
                </button>
              </span>
            </span>
          </div>
        </div>
        <div
          v-if="userType == 'PF'"
          class="alert alert-dark font-small-3"
          role="alert"
          style="max-width: fit-content; margin-top: 20px"
        >
          <p align="justify">
            Alguns fornecedores não atendem CPF, então a quantidade de produtos
            a disposição pode ser menor.
          </p>
        </div>
        <div class="dropdown-divider" />
        <div class="text-right">
          <p class="mt-1 mb-0">Já tem cadastro?</p>
          <login-dropdown linkText="Entrar" v-if="opened" />
        </div>
      </div>
    </vs-popup>
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
import ProductSuppliersModal from "@/components/products/ProductSuppliersModal";
import cardTitle from "@/mixins/cardTitle";
import LoginDropdown from "@/components/login/LoginDropdown";
import MailingListModal from "@/components/home/MailingListModal";
import ZipcodeNotFoundModal from "@/components/home/ZipcodeNotFoundModal";
import DifferentCartModal from "@/components/products/DifferentCartModal";
import StateService from "@/services/states";
import priceFormatter from "@/mixins/priceFormatter";
import productUrlIdentifier from "@/mixins/productUrlIdentifier";

export default {
  name: "ProductCard",
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
      openSuppliersModal: false,
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
      if(this.$auth.loggedIn || (this.allowEntrance && this.allowEntrance != 'false'))
        this.addOrRemoveToCart(this.product)
      else {
        this.opened = true
        this.active = true
        setTimeout(() => {
          document.getElementById('cepInput' + this.product.id).focus()
        }, 500)
      }
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
    updateSuppliersModal(val) {
      this.openSuppliersModal = val;
    },
    clearCartAndAdd() {
      this.differentCartPopup = false
      this.clearQuoteCart().then(() => {
        setTimeout(() => {
          this.addOrRemoveToCart(this.product)
        }, 500)
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
    openLocationPopup(target) {
      this.targetClick = target
      this.openLocation = true
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
    loadCep() {
      if (this.zipcode.length == 9) {
        this.clearCity();
        this.$vs.loading({ type: "point" });
        this.setCep(this.zipcode)
        this.setCity(this.zipcode).then(() => {
          if(this.informedCity == 'erro') {
            this.cityText = "CEP não encontrado";
            this.$vs.loading.close();
            this.allowedUf = false;
            this.errorColor = 'red';
          } else {
            this.errorColor = 'black';
            this.setRegion().then(() => {
              this.cityText = this.informedCity + "/" + this.informedUF;
              if(this.informedUF)
                this.checkForUf(this.informedUF)
            })
          }
        })
      }
    },
    setParams() {
      // this.$vs.loading()
      if(this.userType != this.typeId) {
        this.setSupplierServes(this.userType);
      }
      this.loadCep()
      // if (this.allowedUf) {
      //   this.$emit("allow-zipcode", true);}
      //   this.open = false;
      //   this.$router.go();

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
    updateUnavailableUf(value) {
      this.openUnavailableUf = value;
    },
    updateZipcodeNotFound(value) {
      this.openNoZipcode = value;
    },
    checkForUf(uf) {
      if (uf) {
        StateService.checkForAvailableUf(uf).then((response) => {
          this.lastUf = uf;
          if (
            response?.data["available"] &&
            response?.data["available"] === "no"
          ) {
            this.openUnavailableUf = true
            this.allowedUf = null
            this.setAllowed(false)
            this.active = false
            this.clearFilterParams()
          } else if (
            response.data["available"] &&
            response.data["available"] == "yes"
          ) {
            this.openUnavailableUf = false
            this.allowedUf = true
            this.$emit("allow-zipcode", true)
            this.active = false
            this.setAllowed(true)
            this.canAddProduct(this.product.id).then((response) => {
              if(response['available'] == 'yes') {
                this.addOrRemoveToCart(this.product)
                this.showLoadingAlert = true
                setTimeout(() => {
                  window.location.replace("/?loadingProducts=true")
                  //this.$router.go()
                }, 2000)
              } else
                window.location.replace("/?loadingProducts=true")
                //this.$router.go()
            })
          }
          this.$vs.loading.close()
        });
      }
    },
    getLowestExpedition(suppliers) {
      let expeditions = suppliers.map(supplier => supplier.supplierProductExpeditions).reduce((a, b) => a.concat(b))
      let lowest = null
      let aux = 0
      let exp = null
      for(let i = 0; i < expeditions.length; i++) {
        aux = this.checkDiscounts(expeditions[i])
        if((!lowest || aux < lowest) && aux > 0) {
          lowest = aux
          exp = expeditions[i]
        }
      }
      return exp
    },
    getLowestPrice(suppliers) {
      let expeditions = suppliers.map(supplier => supplier.supplierProductExpeditions).reduce((a, b) => a.concat(b))
      let lowest = null
      let aux = 0
      for(let i = 0; i < expeditions.length; i++) {
        aux = this.checkDiscounts(expeditions[i])
        if((!lowest || aux < lowest) && aux > 0)
          lowest = aux
      }
      return lowest
    },
    pricedExpeditions(suppliers) {
      return suppliers.map(supplier => supplier.supplierProductExpeditions).reduce((a, b) => a.concat(b))
    },
    calculatePrice(expedition) {
      var price = expedition.price
      if(expedition.productExpeditionPricing == 1) {
        price = parseFloat(expedition.price) * parseFloat(this.product.quantity.replace(',', '.'))
        if(this.product.packageQuantity)
           price = price * parseFloat(this.product.packageQuantity)
      } else if(expedition.productExpeditionPricing == 2) {
        price = expedition.price
      } else if(expedition.productExpeditionPricing == 3) {
        price = parseFloat(expedition.price) / parseFloat(expedition.productExpeditionQuantity)
        // if(this.product.packageQuantity)
        //   price = price / parseFloat(this.product.packageQuantity)
      }
      return price
    },
    hasDiscount(expedition) {
      var range1 = expedition.discountRange1
      var range2 = expedition.discountRange2
      var discount1 = expedition.discountPercentage1
      var discount2 = expedition.discountPercentage2

      return range1 || range2
    },
    checkDiscounts(expedition) {
      var range1 = expedition.discountRange1
      var range2 = expedition.discountRange2
      var discount1 = expedition.discountPercentage1
      var discount2 = expedition.discountPercentage2

      var total = 0

      if(!expedition.unavailability) {
        var price = this.calculatePrice(expedition)

        if(!range1 && !range2) {
          total = price
        } else if(range1 && !range2) {
          total = price * ((100 - discount1) * 0.01)
        } else if(range2 >= range1) {
          total = price * ((100 - discount2) * 0.01)
        } else if(range1 > range2) {
          total = price * ((100 - discount1) * 0.01)
        }
      }
      return total
    },
    normalizeString(s) {
      var r = s.toLowerCase();
      r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
      r = r.replace(new RegExp("ç", 'g'),"c");
      r = r.replace(new RegExp("[èéêë]", 'g'),"e");
      r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
      r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
      r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
      return r;
    },
    formatString(string) {
      return this.normalizeString(string).replace(/\s+/g, '-')
    },
    clickedCard() {
      if(!this.product.automaticSuppliers.length && this.product.manualSuppliers.length == 1) {
        this.$router.push({ name: 'public-store-product',
                            params: {
                              supplierSlug: this.product.manualSuppliers[0].nameForUrl,
                              familyName: this.formatString(this.product.familyName),
                              categoryName: this.formatString(this.product.categoryName),
                              productTypeName: this.formatString(this.product.productTypeName)
                            }
                          })
      } else if(!this.product.automaticSuppliers.length && this.product.manualSuppliers.length > 1) {
        this.updateSuppliersModal(true)
      } else if(this.product.automaticSuppliers.length == 1 && this.pricedExpeditions(this.product.automaticSuppliers).length == 1 && !this.product.manualSuppliers.length) {
        this.goToProductPage(this.product)
      } else if(this.product.automaticSuppliers.length == 1 && this.pricedExpeditions(this.product.automaticSuppliers).length > 1 && !this.product.manualSuppliers.length) {
        this.goToProductPage(this.product)
      } else if(this.product.automaticSuppliers.length >= 1 && this.product.manualSuppliers.length >= 1) {
        this.updateSuppliersModal(true)
      }
    },
    pricePerBaseUnit(priceObj, withUnit = true) {
      var price = 0

      if(priceObj && priceObj.productExpeditionPricing) {
        if(priceObj.productExpeditionPricing == 1)
          price = this.product.unitsOfMeasurementEquivalence * parseFloat(priceObj.price)
        else if(priceObj.productExpeditionPricing == 2) {
          price = (this.product.unitsOfMeasurementEquivalence / parseFloat(this.product.quantity.replace(',', '.'))) * parseFloat(priceObj.price)
          // if(this.product.packageQuantity)
          //   price = price / parseFloat(this.product.packageQuantity)
        } else if(priceObj.productExpeditionPricing == 3) {
          price = (this.product.unitsOfMeasurementEquivalence / (parseFloat(this.product.quantity.replace(',', '.')) * parseFloat(priceObj.productExpeditionQuantity))) * parseFloat(priceObj.price)
          // if(this.product.packageQuantity)
          //   price = price / parseFloat(this.product.packageQuantity)
        }
      }

      var text = this.formatPrice(price)
      if(withUnit) {
        switch(this.product.unitsOfMeasurementMeasureType) {
          case 'solid':
            text = this.formatPrice(price) + ' p/ kg'
            break;
          case 'liquid':
            text = this.formatPrice(price) + ' p/ L'
            break;
        }
      }
      return text
    },
    pricePerBaseUnitWithDiscount(priceObj, range, withUnit = true) {
      var price = 0

      if(priceObj && priceObj.productExpeditionPricing && (priceObj.discountRange1 || priceObj.discountRange2)) {
        if(priceObj.productExpeditionPricing == 1)
          price = this.product.unitsOfMeasurementEquivalence * this.calculatedPriceWithDiscount(priceObj, range, this.expeditionPrice(this.calculatePrice(priceObj, this.product), priceObj.productExpeditionQuantity, priceObj.productExpeditionPricing)) / range
        else if(priceObj.productExpeditionPricing == 2) {
          price = (this.product.unitsOfMeasurementEquivalence / parseFloat(this.product.quantity.replace(',', '.'))) * this.calculatedPriceWithDiscount(priceObj, range, this.expeditionPrice(this.calculatePrice(priceObj, this.product), priceObj.productExpeditionQuantity, priceObj.productExpeditionPricing))
        } else if(priceObj.productExpeditionPricing == 3) {
          price = (this.product.unitsOfMeasurementEquivalence / (parseFloat(this.product.quantity.replace(',', '.')) * parseFloat(priceObj.productExpeditionQuantity))) * this.calculatedPriceWithDiscount(priceObj, range, this.expeditionPrice(this.calculatePrice(priceObj, this.product), priceObj.productExpeditionQuantity, priceObj.productExpeditionPricing)) / range
        }
      } else if(!priceObj.discountRange1 && !priceObj.discountRange2) {
        return this.pricePerBaseUnit(priceObj, withUnit)
      }

      var text = this.formatPrice(price)
      if(withUnit) {
        switch(this.product.unitsOfMeasurementMeasureType) {
          case 'solid':
            text = this.formatPrice(price) + ' p/ kg'
            break;
          case 'liquid':
            text = this.formatPrice(price) + ' p/ L'
            break;
        }
      }
      return text
    },
    textPerExpedition(price) {
      var pricePerUnit = this.formatPrice(this.calculatePrice(price, this.product)) + ' p/ '
      if(!this.product.packagingName && !this.product.quantity)
        pricePerUnit = pricePerUnit.concat(' ' + this.product.unitsOfMeasurementName)
      else
        pricePerUnit = pricePerUnit.concat(this.product.packagingName + ' ' + this.product.quantity + this.product.unitsOfMeasurementName)
      if(parseInt(this.product.packageQuantity) > 1)
        pricePerUnit = pricePerUnit.concat(' x' + this.product.packageQuantity)

      var text = pricePerUnit + '                                      ' + this.pricePerBaseUnit(price, true)

      return text
    },
    biggestRange(expedition) {
      if(expedition.discountRange1 && expedition.discountRange2)
        return Math.max(expedition.discountRange1, expedition.discountRange2)
      else if(expedition.discountRange1 && !expedition.discountRange2)
        return expedition.discountRange1
      else if(!expedition.discountRange1 && expedition.discountRange2)
        return expedition.discountRange2
      else
        return 0
    },
    expeditionPrice(price, quantity, type = null) {
      if(quantity)
        return (price * quantity)
      else
        return price
    },
    calculatedPriceWithDiscount(priceObj, quantity, price) {
      let result = this.checkDiscounts(priceObj, quantity, price, false)
      if(!isNaN(result)) {
        return result
      }
      else
        return 0
    },
    goToProductPage(product) {
      this.$router.push({ name: 'public-store-product-page',
                             params: {
                               supplierSlug: product.automaticSuppliers[0].nameForUrl,
                               familyName: this.formatString(product.familyName),
                               categoryName: this.formatString(product.categoryName),
                               productTypeName: this.formatString(product.productTypeName),
                               identifier: this.productIdentifier(product)
                              }
                            })
    }
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
    LoginDropdown,
    ZipcodeNotFoundModal,
    MailingListModal,
    DifferentCartModal,
    ProductSuppliersModal,
  },
  mixins: [priceFormatter, cardTitle, productUrlIdentifier]
};
</script>

<template>
  <div v-if="!removed" class="p-1 row">
    <div v-if="!mobileBrowser" class="col-1">
      <img v-if="product.picture" class="rounded img-fluid" :src="product.picture" alt style="width: 50px; height: auto;" />
      <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: 60px; height: auto;" />
    </div>
    <div :class="mobileBrowser ? 'col-12' : 'col-11'">
      <div class="row p-0 m-0">
        <span :class="mobileBrowser ? 'col-12' : 'col-6'">
          <div class="row p-0 m-0">
            <span class="col-3 m-0 p-0" v-if="mobileBrowser">
              <img v-if="product.picture" class="rounded img-fluid" :src="product.picture" alt style="width: 50px; height: auto;" />
              <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: 60px; height: auto;" />
            </span>
            <div :class="mobileBrowser ? 'col-9 m-0 p-0' : 'col-12 m-0 p-0'">
              <span style="margin-right: 8px;">
                <span v-if="product.brandName">{{ product.brandName }}</span>
                <span v-else>(marca não def.)</span>
                <span v-if="product.productLineName"> / {{ product.productLineName }}</span>
                <span v-if="product.productLineExtensionName"> / {{ product.productLineExtensionName }}</span>
              </span>
              <span v-if="product.propertyName" style="margin-right: 8px;">
                <strong class="text-success" v-if="product.propertyName">
                  {{ product.propertyName }}
                </strong>
              </span>
              <span v-if="product.packagingName || product.unitsOfMeasurementName" style="margin-right: 8px;">
                <strong class="text-warning" v-if="product.packagingName">
                  {{ product.packagingName }} / {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                </strong>
                <strong class="text-warning" v-else>
                  {{ product.unitsOfMeasurementName }}
                </strong>
              </span>
            </div>
            <div class="col-12 m-0 p-0">
              <span
                v-if="product.secondaryCharacteristics && product.secondaryCharacteristics.length"
                style="margin-right: 8px;"
              >
                <span v-if="product.secondaryCharacteristics && product.secondaryCharacteristics.length">
                  {{ product.secondaryCharacteristics.join(' | ') }}
                </span>
              </span>
            </div>
          </div>
        </span>
        <vs-divider v-if="mobileBrowser" />
        <span :class="mobileBrowser ? 'col-12' : 'col-6'">
          <div class="row m-0 p-0">
            <div class="col-6 m-0 ml-0 pl-0">
              <div class="row m-0 p-0" style="border: 1px solid LightGrey; border-radius: 10px;">
                <div class="col-12">
                  <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                    a granel
                  </span>
                  <span style="color: black;" v-else>
                    <span class="font-small-1">R$ </span>
                    <span class="font-medium-1" v-if="isDirect">
                      {{ formatPrice(calculatePrice(expedition.supplierProductExpedition, product)).substring(3) }}
                    </span>
                    <span class="font-medium-1" v-else>
                      {{ formatPrice(calculatePriceQuotation(expedition, product)).substring(3) }}
                    </span>
                  </span>
                </div>

                <div class="col-12" v-if="product.packagingName || product.quantity">
                  <span class="text-warning font-small-3">
                    <span v-if="product.packagingName == 'Und.' && product.quantity == 1">
                      {{ product.unitsOfMeasurementName }}
                    </span>
                    <span v-else>
                      {{ product.packagingName }} {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                    </span>
                  </span>
                </div>

                <div class="col-12" v-if="product.packagingName && product.quantity && pricePerBaseUnit(expedition, false)">
                  <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
                    <span class="font-small-3" v-if="isDirect">
                      {{ pricePerBaseUnit(expedition.supplierProductExpedition, false).substring(3)}}
                    </span>
                    <span class="font-small-3" v-else>
                      {{ pricePerBaseUnitQuotation(expedition, false).substring(3)}}
                    </span>
                  </i>
                  <span v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                    <i style="color: #5f6666;" class="font-small-3"> p/ kg</i>
                  </span>
                  <span v-else>
                    <span v-if="product.packagingName != 'Und.'" >
                      <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</i>
                      <i style="color: #5f6666;" v-else> p/ und</i>
                    </span>
                  </span>

                </div>
                <div class="col-12" v-else>
                  <div v-if="isDirect">
                    <div v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                      <i style="color: #5f6666;" class="font-small-3"> {{ formatPrice(expedition.supplierProductExpedition.price).substring(3) }} p/ kg</i>
                    </div>
                    <div v-else>
                      <div v-if="product.packagingName != 'Und.'" >
                        <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(expedition.supplierProductExpedition.price).substring(3) }} p/ L</i>
                        <i style="color: #5f6666;" v-else> p/ und</i>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                      <i style="color: #5f6666;" class="font-small-3"> {{ formatPrice(expedition.price).substring(3) }} p/ kg</i>
                    </div>
                    <div v-else>
                      <div v-if="product.packagingName != 'Und.'" >
                        <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(expedition.price).substring(3) }} p/ L</i>
                        <i style="color: #5f6666;" v-else> p/ und</i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6 p-0">
              <div class="row">
                <div class="col-12">
                  <div style="border: 1px solid LightGrey; border-radius: 10px; padding: 0 14px;">
                    <span class="font-medium-1">
                      {{ String(expedition.quantity).replace('.', ',') }}
                    </span>
                    <span class="font-small-3">
                      {{ expText(expedition.supplierProductExpedition, product) }}
                    </span>
                    <br>
                    <b v-if="isDirect">
                      {{ formatPrice(calculatedPriceWithDiscount(expedition.supplierProductExpedition, expedition.quantity, expeditionPrice(calculatePrice(expedition.supplierProductExpedition, product), expedition.supplierProductExpedition.productExpeditionQuantity))) }}
                    </b>
                    <b v-else>
                      {{ formatPrice(calculatedPriceWithDiscount(expedition, expedition.quantity, expeditionPrice(calculatePriceQuotation(expedition, product), expedition.supplierProductExpedition.productExpeditionQuantity))) }}
                    </b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

import priceFormatter from "@/mixins/priceFormatter";

export default {
  name: "CheckOrderProductCard",
  data() {
    return {
      adding: false,
      removing: false,
      removed: false,
      columnWidth: [],
      noImageSrc: require(`@/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`),
      mobileBrowser: false,
    }
  },
  created() {
    this.isMobile()
    this.totals = JSON.parse(JSON.stringify(this.storeProducts))
  },
  computed: {
    ...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    ...mapState("orders", ["orderExpeditions"]),
    ...mapState("users/products", ["storeTotal", "storeProducts"]),
    classes() {
      if (this.isProductTypeView) {
        return "col-xl-2 col-md-4 col-6 mb-5";
      }

      if (this.isCategoryView || this.isFamilyView || this.isSearchView) {
        return "col-xl-3 col-md-4 col-6 mb-5";
      }

      return this.$route.name === "my-product-list"
        ? "col-xl-3 col-md-4 col-6 mb-3"
        : "col-xl-2 col-md-4 col-6 mb-3";
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
      var total = this.$store.state.users.products.productQuoteCart.length + 1
      if (this.$store.state.users.products.productQuoteCart)
        return total + ' produtos a cotar'
      else
        return '0 produtos a cotar'
    }
  },
  methods: {
    ...mapActions("users/products", [
      "insertProductToProductList",
      "removeProductFromProductList",
      "insertProductToQuoteCart",
      "removeProductFromQuoteCart"
    ]),
    buttonClass(id) {
      if(!this.productCartIsEmpty && this.productIsOnCart(id))
        return "position-absolute w-100 rounded-bottom bg-primary collapse show"
      else
        return "position-absolute w-100 rounded-bottom bg-primary collapse"
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
    pricePerBaseUnitQuotation(priceObj, withUnit = true) {
      var price = 0
      if(priceObj.supplierProductExpedition.productExpeditionPricing == 1)
        price = this.product.unitsOfMeasurementEquivalence * parseFloat(priceObj.price)
      else if(priceObj.supplierProductExpedition.productExpeditionPricing == 2) {
        price = (this.product.unitsOfMeasurementEquivalence / parseFloat(this.product.quantity.replace(',', '.'))) * parseFloat(priceObj.price)
        // if(this.product.packageQuantity)
        //   price = price / parseFloat(this.product.packageQuantity)
      } else {
        price = (this.product.unitsOfMeasurementEquivalence / (parseFloat(this.product.quantity.replace(',', '.')) * parseFloat(priceObj.supplierProductExpedition.productExpeditionQuantity))) * parseFloat(priceObj.price)
        // if(this.product.packageQuantity)
        //   price = price / parseFloat(this.product.packageQuantity)
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
    openLoadingInDiv() {
      let container = '#div-with-loading' + this.product.id
      this.$vs.loading({
        container: container,
        scale: 0.6
      })
    },
    calculatePriceQuotation(priceObj, product) {
      var price = priceObj.price
      if(priceObj.supplierProductExpedition.productExpeditionPricing == 1) {
        price = parseFloat(priceObj.price) * parseFloat(this.product.quantity.replace(',', '.'))
        if(product.packageQuantity)
           price = price * parseFloat(this.product.packageQuantity)
      } else if(priceObj.supplierProductExpedition.productExpeditionPricing == 2) {
        price = priceObj.price
      } else if(priceObj.supplierProductExpedition.productExpeditionPricing == 3) {
        price = parseFloat(priceObj.price) / parseFloat(priceObj.supplierProductExpedition.productExpeditionQuantity)
        // if(this.product.packageQuantity)
        //   price = price / parseFloat(this.product.packageQuantity)
      }
      return price
    },
    calculatePrice(priceObj, product) {
      var price = priceObj.price
      if(priceObj && priceObj.productExpeditionPricing) {
        if(priceObj.productExpeditionPricing == 1) {
          price = parseFloat(priceObj.price) * parseFloat(this.product.quantity.replace(',', '.'))
          if(product.packageQuantity)
             price = price * parseFloat(this.product.packageQuantity)
        } else if(priceObj.productExpeditionPricing == 2) {
          price = priceObj.price
        } else if(priceObj.productExpeditionPricing == 3) {
          price = parseFloat(priceObj.price) / parseFloat(priceObj.productExpeditionQuantity)
          // if(this.product.packageQuantity)
          //   price = price / parseFloat(this.product.packageQuantity)
        }
      }
      return price
    },
    calculatedPriceWithDiscount(priceObj, quantity, price) {
      let result = this.checkDiscounts(priceObj, quantity, price)
      if(!isNaN(result)) {
        return result
      }
      else
        return 0
    },
    checkDiscounts(priceObj, calcQuantity, price) {
      var range1 = priceObj.discountRange1
      var range2 = priceObj.discountRange2
      var discount1 = priceObj.discountPercentage1
      var discount2 = priceObj.discountPercentage2

      var total = 0

      if(!range1 && !range2) {
        total = calcQuantity * price
      } else if(range1 && !range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
      } else if(range1 && !range2 && calcQuantity < range1) {
        total = calcQuantity * price
      } else if(range2 >= range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
      } else if(range1 > range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
      } else if(calcQuantity < range1 && calcQuantity < range2) {
        total = calcQuantity * price
      } else if(range2 >= range1 && calcQuantity < range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
      } else if(range1 > range2 && calcQuantity < range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
      }

      return total
    },
    expText(expedition, product) {
      var text = ''
      if(!product.packagingName && !product.quantity) {
        text = product.unitsOfMeasurementName
      } else {
        if(expedition.productExpeditionQuantity && expedition.productExpeditionQuantity > 1) {
          if(expedition.productExpeditionMediumName)
            text = text + expedition.productExpeditionMediumName
          if(expedition.productExpeditionQuantity)
            text = text + ' ' + expedition.productExpeditionQuantity
        }

        if(product.packagingName) {
          text = text + ' ' + product.packagingName
        }
        if(product.quantity && product.packagingName != 'Und.') {
          text = text + ' ' + product.quantity + ' ' + product.unitsOfMeasurementName
        }
      }
      return text
    },
    calculatedPrice(id, quantity, price) {
      let result = quantity * price
      if(!isNaN(result)) {
        return result
      }
      else
        return 0
    },
    formatQuantity(quantity) {
      if(quantity && String(quantity).includes(','))
        quantity = String(quantity).replace(',', '.')
      return quantity
    },
    expeditionPrice(price, quantity) {
      if(quantity)
        return (price * quantity)
      else
        return price
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    expedition: {
      type: Object,
      required: true,
    },
    isDirect: {
      type: Boolean
    }
  },
  components: {
    //PublicStoreProductModal,
    // ProductPhotoModal
  },
  mixins: [priceFormatter]
};
</script>

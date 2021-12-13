<template>
  <vs-popup :title="product.productTypeName" :active.sync="open">
    <div style="position: -webkit-sticky; position: sticky; top: 0px; background-color: white; z-index: 1000; padding-top: 7px;">
      <h6>
        <span v-if="product.categoryCollection"><i>{{ product.categoryCollection }}</i> | </span>
        <span>
          {{ product.categoryName }}
        </span>
      </h6>
      <h5 style="margin-bottom: 10px;">
        <span>
          {{ product.productTypeName }}
        </span>
      </h5>
      <div class="row m-0">
        <div class="col-5 pt-1">
          <img v-if="product.picture" class="rounded img-fluid" :src="product.picture" alt style="width: 100%; height: auto;" />
          <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: 80%; height: auto;" />
          <div class="badge badge-pill badge-md bg-mf-laranja" style="position: absolute; bottom: 5px; left: 10px;">
            <b>{{ quantifiers(true) == 'Und. 1 und' ? 'Und' :  quantifiers(true) }}</b>
          </div>
        </div>
        <div class="col-7 p-0 pb-1 pt-1">
          <div class="row m-0">
            <div class="col-12 p-0 pb-1 font-small-3">
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
        </div>
      </div>
    </div>
    <h6 style="color: Grey; margin: 20px 0px 0px 0px;">Escolha o fornecedor</h6>
    <table class="table" style="border-collapse: separate; border-spacing: 0 3px;">
      <thead>
        <tr v-for="supplier in orderedByPrice(product.automaticSuppliers)" :key="supplier.name">
          <td
           style="border: 1px solid #b5b9bd; border-radius: 10px;"
          >
            <router-link
              :to="{ name: 'public-store-product-page',
                     params: { supplierSlug: supplier.nameForUrl,
                               familyName: formatString(product.familyName),
                               categoryName: formatString(product.categoryName),
                               productTypeName: formatString(product.productTypeName),
                               identifier: productIdentifier(product) } }"
              style="width: 100%; display: block; color: inherit;"
            >
              <div class="row m-0 p-0">
                <div class="col-2 m-0 p-0">
                  <img v-if="supplier.picture" class="rounded img-fluid" :src="supplier.picture" alt style="width: 80%; height: auto;" />
                  <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: 80%; height: auto;" />
                </div>
                <div class="col-10 m-0 p-0">
                  <div class="font-small-2" v-if="supplier.supplierProductExpeditions.length > 1 || (hasDiscount(supplier.supplierProductExpeditions[0]) && supplier.supplierProductExpeditions.length == 1)">
                    A partir de
                  </div>
                  <div v-if="supplier.supplierProductExpeditions.length == 1 && supplier.supplierProductExpeditions[0].unavailability">
                    <span class="badge badge-pill font-small-3" style="margin-right: 5px; color: #4d4d4d; background-color: #f0f0f0;">
                      Sem estoque
                    </span>
                  </div>
                  <div v-else class="font-medium-2">
                    <b>{{ formatPrice(getLowestPrice(supplier)) }}</b>
                  </div>
                  <vs-button
                    color="primary"
                    type="flat"
                    style="padding: 0;"
                    @click="$router.push({ name: 'public-store-product',
                                           params: {
                                             supplierSlug: supplier.nameForUrl,
                                             familyName: formatString(product.familyName),
                                             categoryName: formatString(product.categoryName),
                                             productTypeName: formatString(product.productTypeName)
                                            }
                                          })"
                  >
                    {{ supplier.name }}
                  </vs-button>
                  <br>
                  Mín. {{ formatPrice(supplier.minimumOrderValue) }}
                </div>
              </div>
            </router-link>
          </td>
        </tr>
      </thead>
    </table>
    <table class="table" style="border-collapse: separate; border-spacing: 0 3px;">
      <thead>
        <tr v-if="product.automaticSuppliers.length > 0 && product.manualSuppliers.length > 0">
          <td
            style="background-color: #ffebb0; width: 10px;"
          >
            <div class="text-left">
              <i class="feather icon-dollar-sign" style="font-size: 1.5em;"></i>
            </div>
          </td>
          <td
           style="background-color: #ffebb0;"
          >
            <div class="text-left">
              <b>Mais opções de preço?</b><br>
              <span style="solor: Grey;">Considere cotar destes abaixo</span>
            </div>
          </td>
        </tr>
        <tr v-for="supplier2 in product.manualSuppliers" :key="supplier2.name" style="width: 100px;">
          <td
           style="border: 1px solid #b5b9bd; border-radius: 10px;"
           colspan="2"
          >
            <router-link
              :to="{ name: 'public-store-product',
                     params: {
                       supplierSlug: supplier2.nameForUrl,
                       familyName: formatString(product.familyName),
                       categoryName: formatString(product.categoryName),
                       productTypeName: formatString(product.productTypeName)
                      }
                    }"
              style="width: 100%; display: block;  color: inherit;"
            >
              <div class="row m-0 p-0">
                <div class="col-2 m-0 p-0">
                  <img v-if="supplier2.picture" class="rounded img-fluid" :src="supplier2.picture" alt style="width: 80%; height: auto;" />
                  <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: 100%; height: auto;" />
                </div>
                <div class="col-10 m-0 p-0">
                  <div class="font-medium-1">
                    <b>Solicitar preço</b>
                  </div>
                  <vs-button
                    color="primary"
                    type="flat"
                    style="padding: 0;"
                    @click="$router.push({ name: 'public-store-product',
                                           params: {
                                             supplierSlug: supplier2.nameForUrl,
                                             familyName: formatString(product.familyName),
                                             categoryName: formatString(product.categoryName),
                                             productTypeName: formatString(product.productTypeName)
                                            }
                                          })"
                  >
                    {{ supplier2.name }}
                  </vs-button>
                  <br>
                  Mín. {{ formatPrice(supplier2.minimumOrderValue) }}
                </div>
              </div>
            </router-link>
          </td>
        </tr>
      </thead>
    </table>
  </vs-popup>
</template>

<style>
.vs-popup {
  width: 500px !important;
}
.vs-popup--content {
  padding-top: 0px !important;
}
</style>

<script>
import { mapGetters } from "vuex";
import cardTitle from "@/mixins/cardTitle";
import VNewSecondaryCharacteristics from "@/components/products/VNewSecondaryCharacteristics";
import priceFormatter from "@/mixins/priceFormatter";
import productUrlIdentifier from "@/mixins/productUrlIdentifier";

export default {
  name: "ProductSuppliersModal",
  data() {
    return {
      open: false,
      secondary: [],
      noImageSrc: require(`@/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`)
    }
  },
  created() {
    this.secondary = [...this.product.secondaryCharacteristics]
    //this.secondary.sort()
  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    },
    open(newVal) {
      this.$emit('update-modal', newVal)
    }
  },
  computed: {
    ...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    secondaryCharacteristicsAsText() {
      return '<p class="mt-1"><small class="text-tiny">' + this.secondary.join("<br>") + '</small></p>'
    },
  },
  methods: {
    goToCover() {
      this.$router.push({ name: 'cover', query: { originSupplier: this.supplierUserName, originCatalog: true } })
    },
    buttonClass(id) {
      if(!this.productCartIsEmpty && this.productIsOnCart(id))
        return "position-absolute w-100 rounded-bottom bg-primary collapse show"
      else
        return "position-absolute w-100 rounded-bottom bg-primary collapse"
    },
    removeFromCart(id) {
      this.$emit('remove-from-cart-event')
      this.open = false
    },
    addToCart(id) {
      this.$emit('add-to-cart-event')
      this.open = false
    },
    getLowestPrice(supplier) {
      let expeditions = supplier.supplierProductExpeditions
      let lowest = null
      let aux = 0
      for(let i = 0; i < expeditions.length; i++) {
        aux = this.checkDiscounts(expeditions[i])
        if((!lowest || aux < lowest) && aux > 0)
          lowest = aux
      }
      return lowest
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
    hasDiscount(expedition) {
      var range1 = expedition.discountRange1
      var range2 = expedition.discountRange2
      var discount1 = expedition.discountPercentage1
      var discount2 = expedition.discountPercentage2

      return range1 || range2
    },
    orderedByPrice(suppliers) {
      var supplierIds = []
      var hasPrice = []
      var noPrice = []
      for(var i in suppliers) {
        supplierIds.push({ supplier: suppliers[i], price: this.getLowestPrice(suppliers[i]) })
      }
      hasPrice = supplierIds.filter(obj => obj.price > 0)
      noPrice = supplierIds.filter(obj => (obj.price == 0 || !obj.price))
      hasPrice = hasPrice.sort((a, b) => {
        if(a.price > b.price)
          return 1
        else if(a.price < b.price)
          return -1
        else {
          if(a.supplier.name < b.supplier.name)
            return -1
          else
            return 1
        }
      })
      supplierIds = hasPrice.concat(noPrice)
      return supplierIds.map(obj => obj.supplier)
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
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    openPopup: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    VNewSecondaryCharacteristics
  },
  mixins: [priceFormatter, cardTitle, productUrlIdentifier]
};
</script>

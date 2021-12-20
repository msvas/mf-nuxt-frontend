<template>
  <div>
    <div v-for="family in families" :key="family.id">
      <span v-if="hasProductsFromFamily(family.name)">
        <h3 style="color: grey;">{{ family.name }}</h3>

        <span
          v-for="collection in collectionsFromFamily(family.name)"
          :key="collection"
        >
          <span
            v-for="category in categoriesFromCollection(collection, family.name)"
            :key="category"
            class=""
          >
            <span
              v-for="type in productTypesFromCategory(category, family.name)"
              :key="type"
            >
              <span v-if="productsFromProductType(type, category).length > 0">
                <p class="mb-0 mt-1"><i v-if="collection">{{ collection }} &nbsp;|&nbsp;</i> {{ category }}</p>
                <p class="mb-50 font-weight-bold">{{ type }}</p>
                <span v-for="product in productsFromProductType(type, category)" :key="'product' + product.id">
                  <span v-for="expedition in productPrices(product.id)" :key="'exp' + expedition.id">
                    <div v-if="expedition.quantity" class="card shadow-sm mb-1">
                      <div class="card-body p-0">

                        <check-order-product-card
                          :product="product"
                          :mobileBrowser="mobileBrowser"
                          :expedition="expedition"
                          :isDirect="isDirect"
                        />
                      </div>
                    </div>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>
        <br>
      </span>
    </div>
  </div>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";
import { mapActions, mapState } from "vuex";
import CheckOrderProductCard from "@/components/products/CheckOrderProductCard";

export default {
  data() {
    return {
      families: [],
      uniqueProductTypes: [],
      typesAndCategories: [],
      total: undefined,
      loadedPrices: false,
    }
  },
  mounted() {

  },
  computed: {
    ...mapState("orders", [
      "orderCategories",
      "orderExpeditions"
    ]),
    ...mapState("quotations", [
      "quotationCategories",
    ]),
    ...mapState("quotations/quotationPrices", [
      "quotationPrices"
    ]),
  },
  created() {
    if(this.isDirect) {
      this.getOrderCategories({ id: this.order.id, unavailable: false }).then(() => {
        for(let i = 0; i < this.orderCategories.length; i++) {
          if(!this.families.find(family => family.id == this.orderCategories[i].family.id))
            this.families.push(this.orderCategories[i].family)
        }
        if(this.families.length)
          this.families.sort((a, b) => a.name.localeCompare(b.name))
      })
      this.getPricesByOrder(this.order.id).then(() => {
        this.loadedPrices = true
      })
    } else {
      this.getQuotationCategories({ id: this.order.id, unavailable: false }).then(() => {
        for(let i = 0; i < this.quotationCategories.length; i++) {
          if(!this.families.find(family => family.id == this.quotationCategories[i].family.id))
            this.families.push(this.quotationCategories[i].family)
        }
        if(this.families.length)
          this.families.sort((a, b) => a.name.localeCompare(b.name))
      })
      this.getPricesByQuotation(this.order.id).then(() => {
        this.loadedPrices = true
      })
    }
    this.buildProductTypes()
    this.uniqueProductTypes = [...new Set(this.products.map(item => item.productTypeName))]
  },
  methods: {
    ...mapActions("orders", [
      "getOrderCategories",
      "getPricesByOrder"
    ]),
    ...mapActions("quotations", [
      "getQuotationCategories",

    ]),
    ...mapActions("quotations/quotationPrices", [
      "getPricesByQuotation"
    ]),
    productPrices(productId) {
      if(this.orderExpeditions && this.orderExpeditions.length)
        return this.orderExpeditions
                   .filter(price =>
                     price.supplierProductExpedition.productExpeditionProductId == productId)
      else if(this.quotationPrices && this.quotationPrices.length) {
        return this.quotationPrices
                   .filter(price =>
                     price.supplierProductExpedition.productExpeditionProductId == productId)
      }
    },
    collectionsFromFamily(family) {
      var aux = this.products.filter(prod => prod.familyName == family).map(prod => prod.categoryCollection)
      return [...new Set(aux)]
    },
    categoriesFromCollection(collection, family) {
      var aux = this.products.filter(prod => (prod.categoryCollection == collection && prod.familyName == family)).map(prod => prod.categoryName)
      return [...new Set(aux)]
    },
    productsFromProductType(productTypeName, categoryName) {
      var prods = this.products.filter(prod => (prod.productTypeName == productTypeName && prod.categoryName == categoryName))
      if(prods.length > 1)
        prods = prods.sort((a, b) => a.productTypeName.localeCompare(b.productTypeName))
      return prods
    },
    productTypesFromCategory(category, family) {
      var aux = this.products.filter(prod => (prod.categoryName == category && prod.familyName == family)).map(prod => prod.productTypeName)
      if(aux.length > 1)
        aux = aux.sort((a, b) => a.localeCompare(b))
      return [...new Set(aux)]
    },
    fromProductType(productType) {
      return this.products.filter(prod => prod.productTypeName == productType)
    },
    productsFromFamily(familyName) {
      return this.products.filter(prod => prod.familyName == familyName)
    },
    typesFromCategory(categoryId) {
      return this.typesAndCategories.filter(obj => obj.category == categoryId)
    },
    buildProductTypes() {
      for(let i = 0; i < this.products.length; i++) {
        if(!this.typesAndCategories.find(obj => obj.productType == this.products[i].productTypeName)) {
          this.typesAndCategories.push({ category: this.products[i].categoryId,
                                         productType: this.products[i].productTypeName,
                                         familyName: this.products[i].familyName })
        }
      }
    },
    hasProductsFromFamily(familyName) {
      if(this.products && this.products.length)
        return this.products.find(prod => prod.familyName == familyName)
      else
        return false
    },
  },
  props: {
    order: {
      type: Object,
      required: true
    },
    products: {
      type: Array,
      required: true
    },
    isDirect: {
      type: Boolean,
    },
    mobileBrowser: {
      type: Boolean,
    }
  },
  components: {
    CheckOrderProductCard
  }
};
</script>

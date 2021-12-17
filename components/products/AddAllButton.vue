<template>
  <span>
    <vs-button v-if="productIds && productIds.length" @click="addAllProducts" color="primary" type="border" style="width: 200px;">
      {{ buttonText }} <span v-if="count">({{ productIds.length }})</span><i class="feather icon-check-square font-medium-2" style="margin-left: 5px;"></i>
    </vs-button>
     <different-cart-modal
      :openPopup="differentCartPopup"
      @clear-cart-and-add="clearCartAndAdd"
      @update-modal="updateDifferentCartPopup"
    />
  </span>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import ProductsService from "@/services/products";
import DifferentCartModal from "@/components/users/DifferentCartModal";

export default {
  name: "AddAllButton",
  data() {
    return {
      mobileBrowser: false,
      differentCartPopup: false,
    }
  },
  created() {

  },
  mounted() {
    this.isMobile()
  },
  computed: {
    ...mapState("users/products", ["productQuoteCart"]),
    ...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
     ...mapState("suppliers", ["manualStoreId"]),
    infoMessage() {
      return this.productIds.length + ` produtos adicionados.`;
    },
    buttonText() {
      if(this.mobileBrowser)
        return 'Solic. todos'
      else
        return 'Solicitar todos'
    }
  },
  methods: {
    ...mapActions("users/products", [
      "insertManyProductsToQuoteCart", "clearQuoteCart",
    ]),

    addAllProducts() {
      if(this.productQuoteCart.length == 0 || (this.productQuoteCart[0].supplierId == this.manualStoreId)) {
        this.insertManyProductsToQuoteCart({ productIds: this.productIds, supplierId: this.supplierId }).then(() => {
          this.cartInfo(this.infoMessage, "add-cart-toast-class", "feather icon-plus-circle")
        })
      }else if (this.productQuoteCart.length > 0){
        this.differentCartPopup = true
        this.adding = false
      }
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
     updateDifferentCartPopup(value) {
      this.differentCartPopup = value;
    },
    clearCartAndAdd() {
      this.clearQuoteCart().then(() => {
        setTimeout(() => {
          this.addAllProducts()
        }, 300)
      })
    },
  },
  props: {
    productIds: {
      type: Array,
    },
    supplierId: {
      type: Number,
    },
    count: {
      type: Boolean
    },
    small: {
      type: Boolean
    }
  },
  components: {
    DifferentCartModal
  },
};
</script>

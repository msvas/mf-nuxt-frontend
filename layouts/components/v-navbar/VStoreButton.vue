<template>
  <li :class="$device.isMobile ? 'nav-item position-relative ml-1' : 'nav-item position-relative ml-1 mr-1'" v-show="storeTotal > 0">
    <a @click="goToReviewOrder()" href="javascript:void(0)">
      <div :style="$device.isMobile ? 'width: ' + (formatPrice(storeTotal).length * 6 + 12) + 'px;' : 'width: ' + (formatPrice(storeTotal).length * 6 + 122) + 'px;'">
        <span id="tooltip-button-1">
          <button
            style="padding: 5px;"
            :class="[
            !isDisabled ?
            'btn btn-outline-azul margin-emit-btn waves-effect font-small-3 waves-light mr-10' :
            'btn btn-outline-azul waves-effect margin-emit-btn font-small-3 waves-light mr-10'
            ]"
          >
            <!-- <span class="button-text-full">{{ storeTotal }}</span> -->
            <span v-if="$device.isMobile" class="">
              <img :src="require(`@/assets/images/shopping-cart-white.png`)" alt="*" width="22" height="22" />
            </span>
            <span class="text-white" v-else>
              <img :src="require(`@/assets/images/shopping-cart-white.png`)" alt="*" width="26" height="26" />
              Emitir pedido
            </span>

          </button>
        </span>
        <b-tooltip target="tooltip-button-1" placement="bottom" triggers="hover" v-if="isDisabled">
          Valor mín. não atingido
        </b-tooltip>
      </div>
      <span
        v-if="$device.isMobile"
        v-show="storeTotal > 0"
        class="badge badge-pill badge-up margin-emit-btn font-small-2"
        style="background: #ffcc00; color: black; top: 8px; left: 29px; z-index: 9999; padding: 4px 4px; color: black !important;"
        ref="priceBadge"
      >
        <span style="color: black !important;" v-if="storeTotal < 9999">
          {{ formatPrice(storeTotal).slice(0, -3) }}
        </span>
        <span style="color: black !important;" v-else>
          {{ formatPrice(9999).slice(0, -3) }}+
        </span>
      </span>
      <span
        v-else
        v-show="storeTotal > 0"
        class="badge badge-pill badge-up margin-emit-btn mr-1 font-small-2"
        style="background: #ffcc00; color: black; top: 12px; left: 126px; z-index: 9999; color: black !important;"
        ref="priceBadge"
      >
        <span style="color: black !important;" v-if="storeTotal < 9999">
          {{ formatPrice(storeTotal).slice(0, -3) }}
        </span>
        <span style="color: black !important;" v-else>
          {{ formatPrice(9999).slice(0, -3) }}+
        </span>
      </span>
    </a>
  </li>
</template>

<style>
  @media only screen and (max-width: 760px) {
    .button-text-small{
      display: inline-block;
    }
    .button-text-full{
      display: none;
    }
    .margin-emit-btn {
      margin-top: 5px;
    }
  }
  @media only screen and (min-width: 761px) {
    .button-text-small{
      display: none;
    }
    .button-text-full{
      display: inline-block;
    }
  }
  .mr-10 {
    margin-right: 10px;
  }
</style>

<script>
//import VQuoteButton from "@/resources/quotes/Components/VQuoteButton";
import priceFormatter from "@/mixins/priceFormatter";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "VStoreButton",
  data() {
    return {
      supplier: null,
    }
  },
  // created() {
  //   if(!Number.isNaN(this.storeCartSupplierId())) {
  //     this.getSupplierByIdNoStore(this.storeCartSupplierId()).then((response) => {
  //       this.supplier = response
  //     })
  //   }
  // },
  mounted() {
    if(!Number.isNaN(this.storeCartSupplierId())) {
      this.getSupplierByIdNoStore(this.storeCartSupplierId()).then((response) => {
        this.supplier = response
      })
    }
  },
  components: {
    //VQuoteButton
  },
  computed: {
    ...mapGetters("users/products", ["storeCartSupplierId"]),
    productsInStoreCart() {
      if (this.$store.state.users.products.storeProducts)
        return this.$store.state.users.products.storeProducts.length
      else
        return 0
    },
    storeTotal() {
      if (this.$store.state.users.products.storeTotal)
        return this.$store.state.users.products.storeTotal
      else
        return 0
    },
    isDisabled() {
      return !(this.storeTotal > 0 && this.storeCanBuy)
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true
      } else {
        return false
      }
    },
    ...mapState("users/products", ["storeProducts", "storeCanBuy"]),
    ...mapState("suppliers", ["supplier"]),
  },
  watch: {
    storeTotal() {
      this.$refs.priceBadge.classList.add('animate__animated', 'animate__heartBeat');

      this.$refs.priceBadge.addEventListener('animationend', () => {
        this.$refs.priceBadge.classList.remove('animate__animated', 'animate__heartBeat')
      });
    }
  },
  methods:{
    ...mapActions("suppliers", ["getSupplierByIdNoStore"]),
    ...mapActions("orders", [
      "createOrder"
    ]),
    goToReviewOrder() {
      this.isLoading = true
      setTimeout(() => {
        if(!this.supplier) {
          this.getSupplierByIdNoStore(this.storeCartSupplierId()).then((response1) => {
            this.supplier = response1
            this.createOrder({ supplierId: this.supplier.id, products: this.storeProducts }).then((response2) => {
              this.isLoading = false
              this.$router.push({ name: 'users.reviewOrder', params: { supplierSlug: this.supplier.nameForUrl, orderId: response2.id } })
            })
          })
        } else {
          this.createOrder({ supplierId: this.supplier.id, products: this.storeProducts }).then((response) => {
            this.isLoading = false
            this.$router.push({ name: 'users.reviewOrder', params: { supplierSlug: this.supplier.nameForUrl, orderId: response.id } })
          })
        }
      }, 300);
    }
  },
  mixins: [
    priceFormatter
  ]
};
</script>

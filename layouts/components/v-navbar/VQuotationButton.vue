<template>
  <li v-if="productsInQuoteCart" class="nav-item position-relative">
    <a @click="setToViewQuote()" href="javascript:void(0)" style="padding-right: 30px;">
      <div >
        <div v-if="productsInQuoteCart">
          <button
            style="padding: 5px;"
            :class="[
            productsInQuoteCart ?
            'btn btn-outline-azul waves-effect font-small-3 waves-light' :
            'btn btn-outline-azul waves-effect font-small-3 waves-light'
            ]"
          >
            <span v-if="isMobile" class="">
              <img :src="require(`@/assets/images/tag_branca.png`)" alt="*" width="22" height="22" />
            </span>
            <span v-else class="text-white">
              <img :src="require(`@/assets/images/tag_branca.png`)" alt="*" width="26" height="26" />
              Solicitar preços
            </span>

          </button>
        </div>
       <div v-else>
          <vs-dropdown vs-custom-content vs-trigger-click style="color: white;">
            <a
            :class="[productsInQuoteCart ?
            'btn btn-outline-azul waves-effect font-small-3 waves-light px-2' :
            'btn btn-outline-primary waves-effect font-small-3 waves-light px-2'
            ]"
            href.prevent
          >
            <span class="">
              <img :src="require(`@/assets/images/tag_branca.png`)" alt="*" width="42" height="42" />
            </span>

          </a>
            <vs-dropdown-menu style="width: 300px;">
              <div class="text-white bg-primary text-center p-2 mb-1" style="border-radius:5px" >
                <span class="text-break-line d-block font-weight-bold font-medium-3">Você ainda não selecionou produtos para cotar</span>
                <span class="d-block font-small-3 mb-1"></span>
              </div>
            </vs-dropdown-menu>
          </vs-dropdown>
          </div>

      </div>



      <span
        v-if="isMobile"
        v-show="productsInQuoteCart"
        class="badge badge-pill badge-up margin-emit-btn mr-1 font-small-3"
        style="background: #ffcc00; color: black; top: 3px; left: 29px; z-index: 9999; color: black !important;"
        ref="quantityBadge"
      >
        <span style="color: black !important;" v-if="productsInQuoteCart <= 99">
          {{ productsInQuoteCart }}
        </span>
        <span style="color: black !important;" v-else>
          99+
        </span>
      </span>
      <span
        v-else
        v-show="productsInQuoteCart"
        class="badge badge-pill badge-up margin-emit-btn mr-1 font-small-3"
        style="background: #ffcc00; color: black; top: 10px; left: 135px; z-index: 9999; color: black !important;"
        ref="quantityBadge"
      >
        <span style="color: black !important;" v-if="productsInQuoteCart <= 99">
          {{ productsInQuoteCart }}
        </span>
        <span style="color: black !important;" v-else>
          99+
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
  }
  @media only screen and (min-width: 761px) {
    .button-text-small{
      display: none;
    }
    .button-text-full{
      display: inline-block;
    }
  }
</style>

<script>
//import VQuoteButton from "@/resources/quotes/Components/VQuoteButton";
import { mapActions, mapState } from "vuex";
export default {
  name: "VQuotationButton",
  components: {
    //VQuoteButton
  },
  computed: {
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
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true
      } else {
        return false
      }
    },
    ...mapState("users/products", ["productQuoteCart"]),
  },
  watch: {
    productsInQuoteCart() {
      if(this.$refs.quantityBadge) {
        this.$refs.quantityBadge.classList.add('animate__animated', 'animate__heartBeat');

        this.$refs.quantityBadge.addEventListener('animationend', () => {
          this.$refs.quantityBadge.classList.remove('animate__animated', 'animate__heartBeat')
        });
      }
    }
  },
  methods:{
    ...mapActions("quotes", [
      "createQuote"
    ]),
    newQuote() {
      //this.createQuote(this.productQuoteCart.map(product => product.id)).then(() => {
        this.$router.push('users.reviewQuote')
      //})
    },
    setToViewQuote() {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        this.$router.push({ name: 'users.reviewQuote' })
      }, 300);
    }
  }
};
</script>

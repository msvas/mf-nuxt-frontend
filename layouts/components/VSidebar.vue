<template>
  <div
    class="main-menu menu-fixed menu-light menu-accordion menu-shadow expanded"
    data-scroll-to-active="true"
    style="background-color: #white;"
  >
    <div style="padding-top: 10px">
        <div
          :class="reduce ? 'd-none' : 'd-block'"
          class="header-sidebar"
          slot="header"
          style="justify-content: space-between; padding-bottom: 50px "
        >
          <div
            style="
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
              justify-content: space-evenly;
            "
          >
            <img
              src="@/assets/images/logo-horizontal-01.png"
              height="50px"
              alt=""
            />
          </div>
        </div>
        <div
          :class="reduce ? 'd-block' : 'd-none'"
          class="header-sidebar"
          slot="header"
          style="text-align-last: center; padding-bottom: 45px"
        >
          <a @click="reduce = !reduce">
            <img src="@/assets/images/menu3linhas.png" height="30px" alt="" />
          </a>
        </div>

        <div>
          <nuxt-link :to="{ path: '/' }" :class="this.$route.path == '/' ||
                                                 this.$route.name == 'cotar-familia' ||
                                                 this.$route.name == 'cotar-categoria' ||
                                                 this.$route.name == 'cotar-produto' ? 'options-container-selected' : 'options-container'"
          >
           <div :class="reduce ? 'a-reduced' : 'a-expanded'">
              <div>
                <img
                  :class="this.$route.path == '/' ||
                          this.$route.name == 'cotar-familia' ||
                          this.$route.name == 'cotar-categoria' ||
                          this.$route.name == 'cotar-produto' ? 'd-inherit' : 'd-none'"
                  src="@/assets/images/delivery-box-selected.png"
                  height="25px"
                  width="25px"
                  alt="menu"
                />
                <img
                  :class="this.$route.path == '/' ||
                          this.$route.name == 'cotar-familia' ||
                          this.$route.name == 'cotar-categoria' ||
                          this.$route.name == 'cotar-produto' ?  'd-none' : 'd-inherit'"
                  src="@/assets/images/delivery-box.png"
                  height="25px"
                  width="25px"
                  alt="menu"
                />
              </div>
              <span
                :class="reduce ? 'text-reduced' : 'text-expanded'"
                :style="this.$route.path == '/' ||
                        this.$route.name == 'cotar-familia' ||
                        this.$route.name == 'cotar-categoria' ||
                        this.$route.name == 'cotar-produto'
                    ? 'color: #008567;'
                    : 'color: black;'"
                >Produtos</span
              >
            </div>
          </nuxt-link>

          <nuxt-link :to="{ path: '/fornecedores' }" :class="this.$route.path == '/fornecedores' ||
                                                               this.$route.name == 'suppliers-family' ||
                                                               this.$route.name == 'suppliers-category' ||
                                                               this.$route.name == 'suppliers-product' ? 'options-container-selected' : 'options-container'"
          >
            <div :class="reduce ? 'a-reduced' : 'a-expanded'" >
              <div>
                <img
                  src="@/assets/images/shop-selected.png"
                  :class="this.$route.path == '/fornecedores' ||
                          this.$route.name == 'suppliers-family' ||
                          this.$route.name == 'suppliers-category' ||
                          this.$route.name == 'suppliers-product' ? 'd-inherit' : 'd-none'"
                  height="25px"
                  alt="menu"
                />
                <img
                  src="@/assets/images/shop.png"
                  :class="this.$route.path == '/fornecedores' ||
                    this.$route.name == 'suppliers-family' ||
                    this.$route.name == 'suppliers-category' ||
                    this.$route.name == 'suppliers-product' ? 'd-none' : 'd-inherit'"
                  height="25px"
                  width="25px"
                  alt="menu"
                />

              </div>
              <span
                :class="reduce ? 'text-reduced' : 'text-expanded'"
                :style="
                    this.$route.path == '/fornecedores' ||
                    this.$route.name == 'suppliers-family' ||
                    this.$route.name == 'suppliers-category' ||
                    this.$route.name == 'suppliers-product'
                    ? 'color: #008567;'
                    : 'color: black;'
                "
                >Lojas</span
              >
            </div>
          </nuxt-link>

          <nuxt-link :to="{ path: '/pedidos' }" :class="this.$route.path == '/pedidos' ? 'options-container-selected' : 'options-container'">
            <div :class="reduce ? 'a-reduced' : 'a-expanded'"
            >
            <div>
              <img
                src="@/assets/images/invoice-selected.png"
                :class="this.$route.path == '/pedidos' ? 'd-inherit' : 'd-none'"
                height="22px"
                width="22px"
                alt="menu"
              />
              <img
                src="@/assets/images/invoice.png"
                :class="this.$route.path == '/pedidos' ? 'd-none' : 'd-inherit'"
                height="25px"
                width="22px"
                alt="menu"

              />

            </div>
            <span
              :class="reduce ? 'text-reduced' : 'text-expanded'"
              :style="
                this.$route.path == '/pedidos'
                  ? 'color: #008567;'
                  : 'color: black;'
              "
              >Pedidos</span
            >
            </div>
          </nuxt-link>
        </div>

        <div  :class="reduce ? 'vs-spacer-reduced' : 'vs-spacer-custom'">
          <vs-divider style="background: white;" :class="reduce ? 'd-none' : 'd-block'" />
          <profile-dropdown :class="reduce ? 'd-none' : 'd-block'" />
          <filter-products style="filter: invert(1);" :class="reduce ? 'd-none' : 'd-block'" />
          <vs-divider style="background: white;" :class="reduce ? 'd-none' : 'd-block'" />

          <div
            style="list-style: none; padding: 15px;filter: invert(1);"
            :class="reduce ? 'd-none' : 'd-block'"
          >
            <about  />
            <contact />
            <terms  />
          </div>
        </div>
    </div>
    <div class="d-none">
      <home-option />
      <product-list-option />
      <quotations-option />
      <purchase-requests-option />
    </div>
  </div>
</template>

<script>
import ProfileDropdown from "./v-navbar/ProfileDropdown";
import About from "./v-sidebar/About";
import Terms from "./v-sidebar/Terms";
import Contact from "./v-sidebar/Contact";
import QuotesService from "@/services/quotes";
import HomeOption from "./v-sidebar/HomeOption";
import ProductListOption from "./v-sidebar/ProductListOption";
import QuotationsOption from "./v-sidebar/QuotationsOption";
import FilterProducts from "./v-navbar/FilterProducts"
import PurchaseRequestsOption from "./v-sidebar/PurchaseRequestsOption";

import { mapGetters, mapState, mapActions } from "vuex";

export default {
  name: "VSidebar",
  data() {
    return {
      openDirectOrders: [],
      unseenPrices: false,
      usedFamilies: [],
      reduce: false,
    };
  },
  created() {
    // this.getUsedFamilies().then((families) => {
    //   this.usedFamilies = families
    // });
    // if(this.$auth.loggedIn) {
    //   QuotesService.getOpen().then((response) => {
    //     this.openQuotes = response.data
    //     this.checkOpenQuotes()
    //     this.checkUnseenPrices()
    //   });
    // }
  },
  mounted() {

  },
  watch: {
    '$route': function (value) {
      this.closeSideBar()
    }
  },
  methods: {
    ...mapActions("families", ["getUsedFamilies"]),
    closeSideBar() {
      let menuClassList = document.body.classList;

      if (menuClassList.contains("menu-open")) {
        menuClassList.remove("menu-open");
        menuClassList.add("menu-hide");
        document.body.style.overflow = "auto";
        document.querySelector(".sidenav-overlay").classList.remove("d-block");
        document.querySelector(".sidenav-overlay").classList.add("d-none");
      }
    },
    checkOpenQuotes() {
      for (var i = 0; i < this.openQuotes.length; i++) {
        if (this.openQuotes[i].hasExpired == false) {
          this.hasQuoteInProgress++;
        }
      }
    },
    checkUnseenPrices() {
      for (var i = 0; i < this.openQuotes.length; i++) {
        if (
          this.openQuotes[i].notRead > 0 &&
          this.openQuotes[i].hasExpired == false
        ) {
          this.unseenPrices = true;
        }
      }
    },
  },
  computed: {
    ...mapGetters("families", ["familiesWithChunckedProducts"]),
    ...mapState("families", ["families"]),

    supplierStore() {
      return this.$route.meta.supplierStore;
    },
    ...mapState("users/products", ["productQuoteCart"]),
    ...mapState("users/products", ["storeProducts"]),

    productsInQuoteCart() {
      if (this.$store.state.users.products.productQuoteCart)
        return this.$store.state.users.products.productQuoteCart.length;
      else return 0;
    },
    productsInStoreCart() {
      if (this.$store.state.users.products.storeProducts)
        return this.$store.state.users.products.storeProducts.length;
      else return 0;
    },
  },
  components: {
    About,
    Contact,
    Terms,
    ProfileDropdown,
    ProductListOption,
    QuotationsOption,
    PurchaseRequestsOption,
    HomeOption,
    FilterProducts,
  },
};
</script>

<style >
.scroll-area {
  position: relative;
  margin: auto;
  height: 100%;
}
.a-reduced {
  color: white;
  display: flex;
  flex-flow: row wrap;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.a-expanded {
  color: white;
  display: flex;
  margin-left: 15px;
  padding-bottom: 20px;
}
.text-expanded {
  margin-left: 15px;
}
.text-reduced {
  margin-left: 0;
  font-size: small;
}
.sidebarx {
  color: black;
}
.vs-sidebar.vs-sidebar-reduce {
  max-width: 65px;
  border-radius: 0 10px 10px 0;
}
.vs-sidebar.vs-sidebar-parent {
  position: fixed !important;
  height: 100% !important;
  top: 0;
}
.options-container{
  display: flex;
  height: 80px;
  align-items: center;

}
.options-container:hover{
  display: flex;
  background: #80d5c0;
  height: 80px;
  align-items: center;

}
.options-container-selected{
  display: flex;
  background: #e0f5f0;
  height: 80px;
  align-items: center;
}
</style>

<template>
  <div>
    <vs-sidebar
      :reduce="reduce"
      :reduce-not-hover-expand="notExpand"
      default-index="1"
      color="success"
      class="sidebarx"
      spacer
      v-model="active"
      hidden-background
      style="overflow-y: hidden;"
    >
      <div style="padding-top: 10px" v-on-clickaway="away">
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
            <a style="align-self: center" @click="reduce = !reduce">
              <i style="font-weight: 900; filter:invert(1);" class="feather icon-x"></i>
            </a>
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
              :style="this.$route.path == '/pedidos' ? 'color: #008567;': 'color: black;'">Pedidos
            </span>
            </div>
          </nuxt-link>
        </div>

        <div :class="reduce ? 'vs-spacer-reduced' : 'vs-spacer-custom'">
          <vs-divider style="background: white;" :class="reduce ? 'd-none' : 'd-block'" />
          <profile-dropdown :class="reduce ? 'd-none' : 'd-block'" />
          <filter-products style="filter: invert(1);" :class="reduce ? 'd-none' : 'd-block'" />
          <vs-divider style="background: white;" :class="reduce ? 'd-none' : 'd-block'" />

          <div
            style="list-style: none; padding: 15px;"
            :class="reduce ? 'd-none' : 'd-block'"
          >
            <about  />
            <contact />
            <terms  />
          </div>
        </div>

      </div>
    </vs-sidebar>
  </div>
</template>

<style>
.a-reduced {
  color: white;
  display: flex;
  flex-flow: row wrap;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}
.a-expanded {
  color: gray;
  display: flex;
  margin-left: 15px;
  padding-bottom: 10px;
}
.text-expanded {
  margin-left: 15px;
  color: gray;
}
.text-reduced {
  margin-left: 0;
  font-size: small;
  color: gray;
}
.sidebarx {
  color: black;
}
.vs-sidebar.vs-sidebar-reduce {
  max-width: 65px !important;
  border-radius: 0 10px 10px 0;
}
.vs-sidebar.vs-sidebar-parent {
  position: fixed;
  height: 100% !important;
  top: 0;
  background-color: white;
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
.vs-spacer-custom{
    padding: 0;
    margin: 0;
    -webkit-box-flex: 1!important;
    -ms-flex-positive: 1!important;
    flex-grow: 1!important;
    background: #e5e5e0;
    height: calc(100vh - 26.1rem);
}
.vs-spacer-reduced{
    padding: 0;
    margin: 0;
    -webkit-box-flex: 1!important;
    -ms-flex-positive: 1!important;
    flex-grow: 1!important;
    background: #04bf8a;
}
.vs-sidebar--items {
    padding: 0 !important;
    background: inherit;
    overflow-y: auto;
}

</style>


<script>
import { mapState } from "vuex";
import { mixin as clickaway } from "vue-clickaway";
import About from "./v-sidebar/About";
import Terms from "./v-sidebar/Terms";
import Contact from "./v-sidebar/Contact";
import ProfileDropdown from "./v-navbar/ProfileDropdown.vue";
import FilterProducts from "./v-navbar/FilterProducts.vue"
import QuotesService from "@/services/quotes";
export default {
  data() {
    return {
      reduce: true,
      active: true,
      notExpand: true,
      showSecondaryIcons: false,
      openQuotes: [],
      openDirectOrders: [],
      unseenPrices: false,
    };
  },
  created() {
    // if(this.$auth.loggedIn) {
    //   QuotesService.getOpen().then((response) => {
    //     this.openQuotes = response.data;
    //     this.checkOpenQuotes();
    //     this.checkUnseenPrices();
    //   });
    // }
  },
  mounted() {

  },
  watch: {
    '$route': function (value) {
      this.reduce = true
    }
  },
  computed: {
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
  methods: {
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
    away() {
      this.reduce = true;
    },
  },
  components: {
    Terms,
    Contact,
    About,
    ProfileDropdown,
    FilterProducts
  },
  mixins: [clickaway],
};
</script>
    Terms

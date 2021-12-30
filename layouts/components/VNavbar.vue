<template>
  <nav :class="navClass" v-if="!hideNavbar && !(showPhotoNavBar && ($device.isMobile || mobileBrowser))" style="justify-content: space-between; background-color: white !important;">
    <ul v-if="showLeaveQuotationButton || showOnlyLeaveButton" class="nav navbar-nav ">
      <li v-if="showLeaveQuotationButton && !supplierStore" class="nav-item position-relative">
        <a :href="backUrl" id="back-button" class="btn btn-relief-dark waves-effect waves-light font-small-3 mr-1 px-2">
          <span>{{ '&lt;' }} Voltar</span>
        </a>
      </li>
      <!-- <li v-if="showLeaveQuotationButton && supplierStore" class="nav-item position-relative ml-1">
        <nuxt-link :to="{ name: 'public-store', params: { supplierSlug: $route.params.supplierSlug } }" id="back-button" class="btn btn-relief-dark waves-effect waves-light font-small-3 mr-1 px-2">
          <span>{{ '&lt;' }} Voltar</span>
        </nuxt-link>
      </li> -->
      <li v-if="showOnlyLeaveButton" class="nav-item position-relative">
        <button
          @click="cancelReview"
          type="button"
          class="btn btn-primary text-bold-600 waves-effect waves-light"
          id="leave-review"
          >
            <b-spinner v-if="buttonLoading" small/>
            <span v-else>Sair da revisão</span>
        </button>
      </li>
    </ul>

    <ul v-else class="nav navbar-nav" style="flex-direction:row; align-content:center">
      <li v-if="(!publicPage && !isSuspended)  || (publicPage && supplierStore && !showPhotoNavBar)" style="margin-right:5px; margin-left:20px">
        <a
          class="nav-link nav-menu-main menu-toggle hidden-xs"
          title="Menu principal"
          @click="showSidebar"
        >
          <i class="ficon feather icon-menu" :style="supplierStore ? 'font-size:2rem; color:black;' : 'font-size:2rem; color:black;'"></i>
        </a>
      </li>

      <li class="nav-item d-sm-block" v-if="supplier">
        <vs-dropdown vs-trigger-click v-if="supplierStore && !showPhotoNavBar">

          <a class="a-icon" href.prevent>
            <div class="brand-logo-mf-color"></div>
          </a>

          <vs-dropdown-menu>
            <vs-dropdown-item style="color: rgba(var(--vs-primary),1);" @click="clickHomeButton()">
              <i class="ficon feather icon-home" style="margin-right: 6px;"/>
              <span>{{ supplier.user.name }}</span>
            </vs-dropdown-item>
            <vs-divider style="margin: 8px 0 !important;" />
            <vs-dropdown-item to="/">
              <img style="margin-right: 5px" src="@/assets/images/delivery-box.png" alt="" height="12px" width="12px">
              <span style="white-space: nowrap;">Produtos</span>
            </vs-dropdown-item>
            <vs-dropdown-item to="/fornecedores">
              <img style="margin-right: 5px" src="@/assets/images/shop.png" alt="" height="12px" width="12px">
              <span style="white-space: nowrap;">Lojas</span>
            </vs-dropdown-item>
            <vs-dropdown-item to="/pedidos">
              <img style="margin-right: 5px" src="@/assets/images/invoice.png" alt="" height="12px" width="12px">
              <span style="white-space: nowrap;">Pedidos</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </li>

      <li class="nav-item d-sm-block" v-if="!supplierStore || showPhotoNavBar || forceLogo">
        <a href="/" >
          <div class="brand-logo-mf-color"></div>
        </a>
      </li>
      <li v-if="!this.$auth.loggedIn && !$device.isMobile && !mobileBrowser && this.$route.path != '/quem-somos'" style=" margin-left: 20px; list-style: none;">
        <a style="color: black; padding-right: 25px;" href="javascript:void(0);" @click="openPartner = true"> Cadastre grátis sua distribuidora</a>
        <nuxt-link style="color: black; padding-right: 25px;" :to="{ path: '/contato' }">Entre em contato</nuxt-link>
        <nuxt-link style="color: black; padding-right: 25px;" :to="{ path: '/como-funciona' }">Como funciona</nuxt-link>
      </li>
    </ul>

    <ul v-if="!showLeaveQuotationButton && !showOnlyLeaveButton && !publicPage" class="nav navbar-nav " style="display: flex; flex-direction:row;">
      <!-- <span v-if="!isSuspended && this.informedUF != 'null' || this.$auth.loggedIn"  style="align-self:center; margin-right: 20px;">
        <div>
          <v-quotation-button  v-show="showQuotationButton" style="margin-right: 7px;" />
        </div>
      </span> -->
      <!-- <span v-if="!$auth.loggedIn" >
            <b-spinner variant="success" v-if="registerLoading" small  />
            <login-dropdown v-if="this.$route.name != 'about'" style=" color:blue;
                                    padding: 10px;
                                    margin-right: 10px;
                                    border-radius: 10px;
                                    background: yellow;" :linkText="this.loginText"></login-dropdown>
      </span> -->
    </ul>
    <!-- <ul v-if="supplierStore && !allowSearch" class="nav navbar-nav align-items-center" style="display: flex; flex-direction: row; height: 63px;">
      <span>
        <div>
          <v-store-button />
        </div>
      </span>
    </ul> -->
    <ul class="nav navbar-nav" style="display: flex; flex-direction:row; margin-left: -10px;">

      <!-- <span v-if="!$auth.loggedIn" >
            <b-spinner variant="success" v-if="registerLoading" small  />
            <login-dropdown v-if="this.$route.name != 'about'" style=" color:blue;
                                    padding: 10px;
                                    margin-right: 10px;
                                    border-radius: 10px;
                                    background: yellow;" :linkText="this.loginText"></login-dropdown>
      </span> -->
      <li class="nav-item d-sm-block" v-if="forceLogo && ($device.isMobile || mobileBrowser)">
        <a href="/" style="position: absolute; left: 10px;">
          <div class="brand-logo-mf-color"></div>
        </a>
      </li>
      <li class="nav-item d-sm-block" v-else-if="forceLogo && !($device.isMobile || mobileBrowser)">
        <a href="/" style="position: absolute; left: 70px;">
          <div class="brand-logo-mf-color" style="margin-top: -15px;"></div>
        </a>
      </li>
    </ul>
    <ul class="nav navbar-nav" style="display: flex; flex-direction:row; margin-left: -10px; margin-right: 10px;">
      <div v-if="$route.name != 'users.reviewOrder' && $route.name != 'users.reviewOrderProducts'">
        <v-quotation-button style="margin-right: 3px;" />
      </div>
      <div class="" v-if="$route.name != 'users.reviewOrder' && $route.name != 'users.reviewOrderProducts'" :style="($device.isMobile || mobileBrowser) ? 'margin-top: -5px;' : ''">
        <v-store-button />
      </div>
      <span v-if="!$auth.loggedIn" style="margin-left: 15px;" >
      <!-- <span style="margin-left: 15px;" > -->
        <span style=""></span>
        <b-spinner variant="success" v-if="registerLoading" small  />
        <login-dropdown v-if="!($device.isMobile || mobileBrowser) && this.$route.path != '/quem-somos'" style=" color:blue;
                                padding: 10px;
                                margin-right: 0px;
                                border-radius: 10px;
                                border-left: 1px solid LightGrey; border-radius: 0;" :linkText="this.loginText"></login-dropdown>
        <login-dropdown v-if="!(storeTotal > 0 && productsInQuoteCart > 0) && ($device.isMobile || mobileBrowser) && this.$route.path != '/quem-somos'" style=" color:blue;
                                padding: 10px 2px 10px 5px;
                                margin-right: 0px;
                                border-radius: 10px;
                                border-left: 1px solid LightGrey; border-radius: 0;" :linkText="this.loginText"></login-dropdown>
      </span>
    </ul>
    <partner-modal :openPopup="openPartner" @update-modal="closePopup" />
  </nav>
</template>

<style>
@media only screen and (min-width: 761px) {
  .search-size{
    width: 250px;
  }
  .bg-photo {
    color: #fff;
    background: url('~@/assets/images/deposito-v4.png');
    background-attachment: fixed;
    background-repeat: repeat-x;
    background-position: center top;
  }

}
@media only screen and (max-width: 760px) {
  .search-size{
    width: 150px;
  }
  .bg-photo {
    color: #fff;
    background: url('~@/assets/images/deposito-v4.png');
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-position: center top;
  }

}
@media only screen and (max-width: 400px) {
  .search-size{
    width: 100px;
  }
}
</style>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import LoginDropdown from "@/components/login/LoginDropdown";
import VQuotationButton from "./v-navbar/VQuotationButton";
import VStoreButton from "./v-navbar/VStoreButton";
import PartnerModal from "@/components/home/PartnerModal";

export default {
  name: "VNavbar",
  data() {
    return {
      showDropdown: false,
      keyword:'',
      buttonLoading: false,
      quoteLoading: false,
      searchbgColor: 'transparent',
      searchborderColor:'transparent',
      showOrdersButton: false,
      show: false,
      loginText: '',
      registerLoading: false,
      openPartner: false,
      mobileBrowser: false,
    };
  },
  created() {

  },
  mounted() {
    // if(this.$auth.user) {
    //   this.hasOrders().then((response) => {
    //     this.showOrdersButton = response
    //   })
    // }
    this.isMobile()
    this.changeLoginText()
  },
  computed: {
    productsInQuoteCart() {
      if (this.$store.state.users.products.productQuoteCart)
        return this.$store.state.users.products.productQuoteCart.length
      else
        return 0
    },
    storeTotal() {
      if (this.$store.state.users.products.storeTotal)
        return this.$store.state.users.products.storeTotal
      else
        return 0
    },
    watchSupplier() {
      return this.supplier
    },
    showQuotationButton() {
      if(this.$route.meta.showQuotationButton)
        return true
      else
        return false
    },
    productsInList() {
      if (this.$store.state.users.products.totalProductList)
        return this.$store.state.users.products.totalProductList
      else
        return 0
    },
    ...mapGetters("navigationFilters", ["abbreviation", "informedUF","informedCity", "params", "informedZipcode"]),
    ...mapState("users/products", ["productQuoteCart"]),
    ...mapState("quotations", ["orders"]),
    ...mapState("suppliers", ["supplier", "manualStore"]),
    showLeaveQuotationButton() {
      if(this.$route.meta.leaveQuotationButton ||
         this.$route.name == 'painel-de-cotacoes-quoteId' ||
         this.$route.name == 'revisar-pedido-quotationId')
        return true
      else
        return false
    },
    showOnlyLeaveButton() {
      return this.$route.meta.reviewingOrder
    },
    // allowSearch() {
    //   return this.$route.meta.blockSearch
    // },
    backUrl() {
      if(this.$route.name == 'painel-de-cotacoes-quoteId')
        return '/pedidos'
      else
        return false
    },
    publicPage() {
      return this.$route.meta.publicPage
    },
    isSuspended() {
      return this.$route.meta.suspended
    },
    forceLogo() {
      return this.$route.meta.forceLogo
    },
    hideNavbar() {
      if(this.$route.meta.hideNavbar ||
         this.$route.name == 'painel-de-cotacoes-quoteId' ||
         this.$route.path == '/revisar-cotacao')
        return true
      else
        return false
    },
    supplierStore() {
      return this.$route.meta.supplierStore
    },
    navClass() {
      if(this.showPhotoNavBar)
        return 'header-navbar navbar-expand-lg navbar navbar-with-menu fixed-top navbar-dark navbar-shadow bg-primary bg-photo'
      else if(this.$route.meta.supplierStore)
        return 'header-navbar navbar-expand-lg navbar navbar-with-menu fixed-top navbar-dark navbar-shadow bg-white'
      else
        return 'header-navbar navbar-expand-lg navbar navbar-with-menu fixed-top navbar-dark navbar-shadow bg-primary bg-mf-verde'
    },
    showPhotoNavBar() {
      return this.$route.meta.photoNavbar && this.supplier && !this.supplier.user.isAutomatic
    },
    photoNavbar() {
      return this.$route.meta.photoNavbar
    },
  },
  methods: {
    ...mapActions("quotations", ["getOrders", "getQuotationProducts", "hasOrders"]),
    showSidebar() {
      let menuClassList = document.body.classList;
      if (menuClassList.contains("menu-hide")) {
        menuClassList.remove("menu-hide");
        menuClassList.add("menu-open");
        document.body.style.overflow = "hidden";
        document.querySelector(".sidenav-overlay").classList.remove("d-none");
        document.querySelector(".sidenav-overlay").classList.add("d-block");
      } else {
        menuClassList.remove("menu-open");
        menuClassList.add("menu-hide");
        document.body.style.overflow = "auto";
        document.querySelector(".sidenav-overlay").classList.remove("d-block");
        document.querySelector(".sidenav-overlay").classList.add("d-none");
      }
    },

    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },

    closePopup(value) {
      this.openPartner = value
    },

    cancelReview() {
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        this.$root.$emit('back-to-review-order')
      }, 300);
    },

    // closing(){
    //   if(this.isMobile){
    //     this.show = !this.show
    //   }
    // },
    changeLoginText() {
      if ((screen.width <= 760 || window.innerWidth <= 760) && this.$route.name.includes('public-store')) {
        this.loginText =  ""
      } else if (screen.width <= 760 || window.innerWidth <= 760) {
        this.loginText =  "Login"
      } else {
        this.loginText =  "Login / Cadastro"
        }
    },
    toRegistration(){
      this.registerLoading = true
      setTimeout(() => {
        this.registerLoading = false
        this.$router.push({ path: '/cadastro' })
      }, 300);
    },
    clickHomeButton() {
      document.getElementById("store-home-button").click()
    }
  },
  components: {
    VQuotationButton,
    LoginDropdown,
    VStoreButton,
    PartnerModal,
  },
};
</script>

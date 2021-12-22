<template>
  <li >
    <div >
      <template v-if="!this.$auth.loggedIn">
        <nuxt-link :to="{ path: '/login' }" class="dropdown-item">
          <b>
            <i class="feather icon-log-in"></i>Entrar / Cadastro
          </b>
        </nuxt-link>
      </template>
      <template v-else>
        <a
          class="dropdown-item disabled text-white"
          href="#"
          tabindex="-1"
          aria-disabled="true"
          style="background-color: #5ce9c6 !important; color: black !important;"
        >{{ user.name }}</a>
        <a
          class="dropdown-item disabled"
          href="#"
          tabindex="-1"
          aria-disabled="true"
          style="color: black;"
        >{{ user.contactName }}</a>
        <template v-if="user.isSupplier">
          <div class="dropdown-divider"></div>
          <nuxt-link :to="{ path: '/fornecedor/condicoes-de-atendimento' }" class="dropdown-item text-warning" style="color: black;">
            <i class="fa fa-exchange"></i> Modo fornecedor
          </nuxt-link>
        </template>
        <div class="dropdown-divider" style="background: white;"></div>

        <business-data v-if="!isSuspended" style=""/>

        <account :key="accountKey" v-if="!isSuspended" style=""/>

        <a @click="logout"  class="dropdown-item" style="color: black;">
          <i class="feather icon-log-out"></i> Sair
        </a>
      </template>
    </div>
  </li>
</template>

<script>
// import { mixin as clickaway } from "vue-clickaway";
import Account from "./Account";
import BusinessData from "./BusinessData";
import FilterProducts from "../v-navbar/FilterProducts.vue"
import { mapActions } from "vuex";
export default {
  name: "ProfileDropdown",
  data() {
    return {
      accountKey: 0,
      show: false,
      user: this.$auth.user,
    };
  },
  computed: {
    infoMessage() {
      return `Você saiu do sistema.`;
    },
    isSuspended() {
      return this.$route.meta.suspended
    }
  },
  methods: {
    forceRerender() {
      this.accountKey += 1;
    },
    ...mapActions("navigationFilters", ["setProductsAfterLogout", "clearFilterParams"]),
    ...mapActions("users/products", ["clearProductList", "clearQuoteCart"]),
    showTime() {
      this.forceRerender();
      this.show = !this.show;
    },
    awayFromDropdownButton() {
      this.show = false;
    },
    logout() {

      this.setProductsAfterLogout()
      this.clearProductList()
      this.clearQuoteCart().then(() => {
        this.$auth.logout().then(() => {
          this.clearFilterParams()
          localStorage.removeItem('access-token')
          localStorage.removeItem('uid')
          localStorage.removeItem('client')
          localStorage.removeItem('allowed')
          this.notifyInfo(this.infoMessage, "feather icon-log-out")
          if(this.$router.path == '/'){
            this.$router.go()
          }else{
            this.$router.push({ path: '/' })
          }

        })
      })
    },
  },
  components: {
    Account,
    BusinessData,
    // FilterProducts
  },
  // mixins: [clickaway],
  props: {
    color: {
      type: String
    }
  }
};
</script>

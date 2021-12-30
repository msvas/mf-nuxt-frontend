<template>
  <li v-if="$auth.loggedIn" class="dropdown dropdown-user nav-item">
    <a
      class="dropdown-toggle nav-link dropdown-user-link"
      data-toggle="dropdown"
      @click="showTime()"
      v-on-clickaway="awayFromDropdownButton"
    >
      <!-- <div class="user-nav d-sm-flex d-none">
        <span class="user-status">{{ user.contactName }}</span>
      </div> -->
      <span>
        <img
          class="round"
          src="@/assets/images/more-vertical-white.svg"
          alt="more"
          height="35"
          width="35"
        />
      </span>
    </a>
    <div class="dropdown-menu dropdown-menu-right" :class="{ show }">
      <a
        class="dropdown-item disabled bg-mf-laranja text-white"
        href="#"
        tabindex="-1"
        aria-disabled="true"
        v-if="$auth.user && $auth.user.name"
      >{{ $auth.user.name }}</a>
      <a
        class="dropdown-item disabled"
        href="#"
        tabindex="-1"
        aria-disabled="true"
        v-if="$auth.user && $auth.user.contactName"
      >{{ $auth.user.contactName }}</a>

      <div class="dropdown-divider"></div>
      <nuxt-link :to="{ path: '/' }" class="dropdown-item color-mf-verde">
        <i class="fa fa-exchange"></i> Modo comprador
      </nuxt-link>

      <div class="dropdown-divider"></div>

      <business-data />

      <account
        v-if="$auth.user.supplierStatus == 'Liberado' || $auth.user.supplierStatus == 'Manutenção'"
        :key="accountKey"
      />

      <a @click="logout" class="dropdown-item">
        <i class="feather icon-log-out"></i> Sair
      </a>
    </div>
    <no-prices-modal
      :openPopup="openNoPrices"
      :noPriceCount="noPriceCount"
      :routeName="'cover'"
      @run-logout="runLogout()"
      @update-popup="updatePopup" />
  </li>

  <li v-else>
    <a class="dropdown-toggle nav-link dropdown-user-link">
      <div class="user-nav d-sm-flex d-none">
        <span class="user-status"></span>
      </div>
      <span>
        <img
          class="round"
          src="@/assets/images/avatar-default.png"
          alt="avatar"
          height="40"
          width="40"
        />
      </span>
    </a>
  </li>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { mixin as clickaway } from "vue-clickaway";
import Account from "./Account";
import BusinessData from "./BusinessData";
import NoPricesModal from "@/components/suppliers/NoPricesModal";

export default {
  name: "ProfileDropdown",
  data() {
    return {
      accountKey: 0,
      show: false,
      user: this.userPlaceholder,
      openNoPrices: false,
      noPriceCount: 0,
    };
  },
  computed: {
    ...mapState("quotations", ["deliveryInfo"]),
    ...mapState("products/supplierProductExpeditions", ["supplierProductExpeditions"]),
    infoMessage() {
      return `Você saiu do sistema.`;
    },
    isCanceled() {
      return this.$route.meta.canceled
    },
    userPlaceholder() {
      if(this.$auth.loggedIn && this.$auth.user)
        return this.$auth.user
      else
        return { name: '', contactName: '' }
    }
  },
  methods: {
    ...mapActions("products/supplierProductExpeditions", [
      "savePricing",
      "clearExpeditions",
    ]),
    ...mapActions("users", ["setUser"]),
    ...mapActions("navigationFilters", ["clearFilterParams"]),
    ...mapActions("suppliers", [
      "updateDeliveryRate"
    ]),
    updatePopup(val) {
      this.openNoPrices = val
    },
    awayFromDropdownButton() {
      this.show = false;
    },
    logout() {
      if(this.$route.path == '/fornecedor/precificar') {
        this.updateDeliveryRate(this.deliveryInfo)
        this.savePricing(this.supplierProductExpeditions).then((response) => {
          this.noPriceCount = response
          if(response > 0)
            this.openNoPrices = true
          else {
            this.runLogout()
          }
        })
      } else {
        this.runLogout()
      }
    },
    runLogout() {
      this.clearFilterParams()
      this.$auth.logout().then(() => {
        localStorage.removeItem('access-token')
        localStorage.removeItem('uid')
        localStorage.removeItem('client')
        localStorage.removeItem('allowed')
        this.$auth.$storage.removeCookie('uid', false)
        this.$auth.$storage.removeCookie('token-type', false)
        this.$auth.$storage.removeCookie('client', false)
        this.$auth.$storage.removeCookie('access-token', false)
        this.$auth.$storage.removeCookie('expiry', false)
        this.$auth.setUser(null)
        this.$auth.$storage.setUniversal('user', null, true)
        this.setUser(null)
        this.notifyInfo(this.infoMessage, "feather icon-log-out")

        setTimeout(() => {
          this.$router.push({ path: '/' })
        }, 200)
      })
    },
    forceRerender() {
      this.accountKey += 1;
    },
    showTime() {
      this.forceRerender();
      this.show = !this.show;
    },
  },
  components: {
    Account,
    BusinessData,
    NoPricesModal
  },
  mixins: [clickaway],
};
</script>

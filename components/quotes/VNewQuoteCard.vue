<template>
  <div>
    <div class="card font-small-3 mb-0 shadow-sm" style="width: 200px;">
      <div class="card-body p-1" style="padding-bottom: 0 !important;">
        <div class="card-text">
          <ul class="nav nav-pills flex-column mb-25">
            <li v-if="this.quote.supplierName != null" class="nav-item">
              <span style="font-weight: 600;">{{slugToName(this.quote.supplierName)}}</span>
            </li>
            <li class="nav-item">
              <vs-divider style="margin-top: 10px; margin-bottom: 10px;" />
            </li>
            <li class="nav-item" style="margin-bottom: 5px;">
              <span class="d-flex" v-if="!quote.hasExpired" style="color: #0cb695;">
                <strong>
                  <img
                    :src="require(`@/assets/images/alarm-clock.svg`)"
                    alt="*"
                    width="16"
                    class="filter-green mr-1"
                  />
                  Expira em {{ remainingTime(quote.remainingTime) }}
                </strong>
              </span>
              <span class="d-flex" v-else>
                <i class="feather icon-clock mr-1 font-medium-2"></i> Expirada
              </span>
            </li>
            <li class="nav-item">
              <span class="d-flex">
                <i class="feather icon-calendar mr-1 font-medium-2"></i>
                {{ formattedDate(quote.createdAt) }}
              </span>
            </li>
            <li v-if="notRead > 0" class="nav-item">
              <vs-divider style="margin-top: 10px; margin-bottom: 10px;" />
            </li>
            <li class="nav-item">
              <span class="d-flex" style="margin-bottom: 5px; justify-content: center;" v-if="!quote.hasExpired">
                <span
                  v-if="notRead > 0"
                  class="badge badge-pill"
                  style="background: #5ce9c6;"
                >
                  <strong style="color:black ">Preços não vistos</strong>
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="card-footer pl-1 pr-1 pt-0 pb-0 d-flex justify-content-start">
        <button
          @click="openQuote()"
          class="btn btn-link d-block"
          style="font-size: 13px; padding-left: 3px;"
        >
          <b-spinner variant="success" v-if="buttonLoading" style="margin-left: 48px" small />
          <span v-else>
            <span v-if="noPrice && !quote.hasExpired">Aguardando preços</span>
            <span class="font-weight-bold" v-else>Ver os preços</span>
          </span>
        </button>
      </div>
    </div>
    <div v-if="quote.hasExpired">
      <v-expired-quote-modal
        :openPopup="openExpired"
        :quoteId="quote.id"
        @update-popup="updateExpiredPopup"
      />
    </div>
  </div>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";
import { mapActions, mapState } from "vuex";
import timeFormatter from "@/mixins/timeFormatter";
import VExpiredQuoteModal from "@/components/quotes/VExpiredQuoteModal";

export default {
  data() {
    return {
      openExpired: false,
      buttonLoading: false,
    };
  },
  computed: {
    //...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    ...mapState("users/products", ["productQuoteCart"]),
    matchedSuppliers() {
      if (this.quote.matchedSuppliers) return this.quote.matchedSuppliers;
      else return 0;
    },
    withPrice() {
      if (this.quote.withPrice) return this.quote.withPrice;
      else return 0;
    },
    notRead() {
      if (this.quote.notRead) return this.quote.notRead;
      else return 0;
    },
    refused() {
      if (this.quote.refused && this.quote.refused > 1)
        return this.quote.refused + " fornc. recusaram";
      else if (this.quote.refused && this.quote.refused == 1)
        return this.quote.refused + " fornc. recusou";
      else return 0 + " fornc. recusou";
    },
    orders() {
      if (this.quote.orders && this.quote.orders > 1)
        return this.quote.orders + " pedidos emitidos";
      else if (this.quote.orders && this.quote.orders == 1)
        return this.quote.orders + " pedido emitido";
      else return "Sem pedidos emit.";
    },
    noPrice() {
      if (this.quote.noPrice) return this.quote.noPrice;
      else return 0;
    },
  },
  created() {

  },
  methods: {
    ...mapActions("quotes", ["createQuote"]),
    formattedDate(date) {
      var m = new Date(date);
      var dateString =
        m.getDate() +
        "/" +
        (m.getMonth() + 1) +
        "/" +
        m.getFullYear() +
        ", às " +
        m.getHours() +
        ":" +
        String(m.getMinutes()).padStart(2, "0");
      return dateString;
    },
    updateExpiredPopup(value) {
      this.openExpired = value;
    },
    openQuote() {
      this.buttonLoading = true;
      setTimeout(() => {
        this.buttonLoading = false;
        if (this.quote.hasExpired) this.openExpired = true;
        else
          this.$router.push({
            name: "users.quotePanel",
            params: { quoteId: this.quote.id },
          });
      }, 300);
    },
    slugToName(string){
      var aux = string.charAt(0).toUpperCase() + string.slice(1)
      aux = aux.replace(/-/, ' ')
      aux = aux.replace(/-/, ' ')
      aux = aux.replace(/-/, ' ')
      return aux
    },
  },
  components: {
    VExpiredQuoteModal,
  },
  mixins: [timeFormatter],
  props: {
    quote: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.no-underline a:hover {
  text-decoration: none;
}
.filter-green {
  filter: invert(48%) sepia(74%) saturate(1436%) hue-rotate(132deg)
    brightness(95%) contrast(91%);
}
</style>

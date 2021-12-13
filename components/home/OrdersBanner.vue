<template>
  <div class="card" :class="$device.isMobile ? 'main-card-mobile' : 'main-card-desktop'">
    <div style="display: flex; flex-direction: column;">
      <div class="p-1"
        style="display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: space-between;     padding-bottom: 0 !important;"
      >
        <h5>Pedidos emitidos</h5>
        <!-- <a
          v-if="this.allOrders.length"
          href="/pedidos-de-compra"
          style="    white-space: nowrap;"
        >Ver tudo</a> -->
      </div>
      <span class="p-1"><small>Compartilhe os pedidos de compra com o pessoal do recebimento<br></small></span>
      <div style="background: #fcd703; padding: 0px 15px;">
        <span><small>Pagamento e entrega é resolvido diretamente com o fornecedor.</small></span>
        <a href="javascript:void(0)" @click="openPopup()" style="float: right;"><small>Saiba mais</small></a>
      </div>
      <b-spinner style="align-self: center; height: 100px; width: 100px;" v-if="isLoading" small/>
      <div v-else>
        <div
        v-if="this.allOrders.length"
        :class="$device.isMobile ? 'cards-overflow-mobile' : 'cards-overflow-desktop' "
        style="padding: 10px;"
      >
        <div v-for="purchaseRequest in allOrders.slice().reverse().slice(0, currentPage * 6)" v-bind:key="purchaseRequest.id">
          <router-link
            v-if="purchaseRequest.orderType && purchaseRequest.orderType == 'Direta'"
            :to="{ name: 'users.checkOrder', params: { quotationId: purchaseRequest.id }, query: { direct: 'true' } }" style="color: black !important;"
          >
            <div
              class="card p-1"
              :class="cardClass(purchaseRequest.id)"
            >
              <div style="display: flex; flex-direction:column;">
                <span>
                  <small>{{formatDate(purchaseRequest.updatedAt)}}</small>
                </span>
                <h4 class="price-text">Total: {{formatPrice(purchaseRequest.totalPrice)}}</h4>
                <span class="supplier-name">{{purchaseRequest.supplierName}}</span>
                <span
                  :class="statusClass(purchaseRequest.status)"
                >{{changeStatus(purchaseRequest.status)}}</span>
              </div>
            </div>
          </router-link>
          <router-link
            v-else
            :to="{ name: 'users.checkOrder', params: { quotationId: purchaseRequest.id } }" style="color: black !important;"
          >
            <div
              class="card p-1"
              :class="cardClass(purchaseRequest.id)"
            >
              <div style="display: flex; flex-direction:column;">
                <span>
                  <small>{{formatDate(purchaseRequest.updatedAt)}}</small>
                </span>
                <h4 class="price-text">Total: {{formatPrice(purchaseRequest.totalPrice)}}</h4>
                <span class="supplier-name">{{purchaseRequest.supplierName}}</span>
                <span
                  :class="statusClass(purchaseRequest.status)"
                >{{changeStatus(purchaseRequest.status)}}</span>
              </div>
            </div>
          </router-link>
        </div>
        <div style="justify-content: center; display: flex;" v-if="allOrders.length && (allOrders.length / 6 > currentPage)">
          <vs-button type="border" style="width: 250px;" @click="loadMoreOrders()">Mostrar mais</vs-button>
        </div>
      </div>
      <div v-else>
        <div class="p-1" style=" display: flex; flex-direction: column; flex-wrap: nowrap;">
          <h6>Você ainda não emitiu pedidos<br>Nós organizaremos seus pedidos aqui.</h6>
        </div>
      </div>
      </div>
    </div>
    <vs-popup title="Como funciona?" :active.sync="open">
      <div>
        <!-- <how-it-works /> -->
      </div>
    </vs-popup>
  </div>
</template>

<style>
.supplier-name {
  font-weight: 700;
  color: black;
}
.price-text {
  color: black;
}
.accepted-text {
  color: green;
  font-weight: 400;
}
.refused-text {
  color: red;
  font-weight: 400;
}
.waiting-text {
  color: gray;
  font-weight: 400;
}
.cards-overflow-mobile {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.cards-overflow-desktop {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  white-space: nowrap;
}
.main-card-desktop {
  background: white;
  width: 40%;
  height: 70vh;
  overflow-y: scroll;
  margin-right: 25px;
}
.main-card-mobile {
  background: white;
  width: 100%;
}
.order-card-mobile {
  margin-right: 25px;
  width: 210px;
}
.order-card-desktop {
  display: block;
  margin-bottom: 15px;
  width: 195px;
}
</style>

<script>
import priceFormatter from "@/mixins/priceFormatter";
import { mapState, mapActions } from "vuex";
//import HowItWorks from "@/views/HowItWorks.vue"
var sortBy = require('lodash.sortby');

export default {
  data() {
    return {
      allOrders: [],
      quoteLoading: false,
      mobileBrowser: false,
      open: false,
      isLoading: true,
      currentPage: 1,
    };
  },
  mounted() {
    this.getOrders({ supplier: null, date: null }).then(() => {
      this.getDirectOrders().then(() => {
        this.allOrders = this.orders.concat(this.directOrders);
        this.allOrders = sortBy(this.allOrders, 'updatedAt')
      });
    });
    setTimeout(() => {
      this.isLoading = false
    },  3000);
  },
  computed: {
    ...mapState("quotations", ["orders"]),
    ...mapState("orders", ["directOrders"]),
  },
  methods: {
    ...mapActions("quotations", ["getOrders", "getQuotationProducts"]),
    ...mapActions("orders", ["getDirectOrders", "getOrderTotal"]),

    toQuotePainel() {
      this.quoteLoading = true;
      setTimeout(() => {
        this.quoteLoading = false;
      }, 300);
      this.$router.push({ name: "users.orderPanel" });
    },
    formatDate(date) {
      var m = new Date(date);
      var dateString =
        m.getDate() +
        "/" +
        (m.getMonth() + 1) +
        "/" +
        m.getFullYear() +
        " - " +
        m.getHours() +
        ":" +
        String(m.getMinutes()).padStart(2, "0");
      return dateString;
    },
    changeStatus(label) {
      if (label == "Pedido de compra a confirmar") {
        return "Aguardando aprovação";
      } else if (label == "Pedido de compra confirmado") {
        return "Aprovado";
      } else {
        return "Recusado";
      }
    },
    statusClass(label) {
      if (label == "Pedido de compra a confirmar") {
        return "waiting-text";
      } else if (label == "Pedido de compra confirmado") {
        return "accepted-text";
      } else {
        return "refused-text";
      }
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
    openPopup() {
      this.open = !this.open
    },
    cardClass(id) {
      var classes = ''
      if(this.$route.query.directId && this.$route.query.directId == id)
        classes += 'animate__animated animate__heartBeat animate__infinite '
      if(this.mobileBrowser)
        classes += 'order-card-mobile'
      else
        classes += 'order-card-desktop'
      return classes
    },
    loadMoreOrders() {
      this.currentPage++
      // this.getOpenQuotes().then(() => {
      // })
    }
  },
  mixins: [priceFormatter],
  components:{
    //HowItWorks,
  }
};
</script>

<template>
  <div class="card" id="openQuotes" :class="$device.isMobile ? 'card-mobile' : 'card-height-hd'">
    <div style=" display: flex; flex-direction: row; justify-content: space-between;">
      <div class="p-1">
        <h5>Solicitações de preços</h5>
        <h6>
          <small>Veja os preços dos produtos solicitados</small>
        </h6>
      </div>
      <!-- <a
        class="p-1"
        href="/minhas-cotacoes"
        style="white-space: nowrap;"
        v-if="this.openQuotes.length"
      >Ver tudo</a> -->
    </div>
    <b-spinner style="align-self: center; height: 100px; width: 100px;" v-if="isLoading" small/>
    <div v-else>
      <div :style="spinner ? 'opacity: 0.35;' : ''" v-if="this.openQuotes.length">
        <div :class="$device.isMobile ? 'col-mobile' : 'col-height-hd'" v-if="updated">
          <VNewQuoteCard
            v-for="quote in printQuotes()"
            :quote="quote"
            :key="quote.id"
            :class="cardClass(quote.id)"
          />
          <VQuoteCard
            v-for="quote in printOldQuotes()"
            :quote="quote"
            :key="quote.id"
            :class="cardClass(quote.id)"
          />
        </div>
        <div style="justify-content: center; display: flex;" v-if="currentPage < totalPages">
          <vs-button type="border" style="width: 250px;" @click="loadMoreQuotes()">Mostrar mais</vs-button>
        </div>
      </div>
      <div v-else>
        <div class="p-1">
          <h6>Você ainda não solicitou preços de nenhum fornecedor.<br>
              Algumas distribuidoras não podem ou não querem apresentar seus preços abertamente. Para estas, é preciso solicitar preços.
              Nós organizaremos suas solicitações aqui.</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VQuoteCard from "@/components/quotes/VQuoteCard";
import VNewQuoteCard from "@/components/quotes/VNewQuoteCard";

export default {
  data() {
    return {
      updated: false,
      remaining: 0,
      buttonLoading: false,
      totalCount: 0,
      total: 0,
      mobileBrowser: false,
      isLoading:true,
      spinner: false,
    };
  },

  mounted() {
    this.defineTotal();
    this.userSelectedPage(1)
    this.setCurrentPage(1)
    this.getOpenQuotes().then(() => {
      this.updated = true;
    });
    this.getQuoteCount().then((response) => {
      this.totalCount = response;
    });
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  },

  computed: {
    ...mapState("quotes", ["openQuotes"]),
    ...mapState("pagination", ["totalPages"]),
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage;
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value);
      },
    },
  },

  methods: {
    ...mapActions("quotes", ["getOpenQuotes", "getQuoteCount"]),
    ...mapActions("pagination", ["userSelectedPage", "setCurrentPage"]),
    printQuotes() {
      return this.openQuotes.filter(obj => obj.matchedSuppliers == 1)
    },
    printOldQuotes() {
      return this.openQuotes.filter(obj => obj.matchedSuppliers > 1)
    },
    toAllQuotes() {
      this.buttonLoading = true;
      setTimeout(() => {
        this.buttonLoading = false;
        this.$router.push({ name: "users.allQuotes" });
      }, 300);
    },
    isFHD() {
      if (screen.width > 1366 || window.innerWidth > 1366) {
        return "fhd";
      } else {
        return "hd";
      }
    },
    defineTotal() {
      if (screen.width > 1366 || window.innerWidth > 1366) {
        return 12;
      } else if (this.mobileBrowser) {
        return 6;
      } else {
        return 6;
      }
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
    cardClass(id) {
      var classes = ''
      if(this.$route.query.pricesId && this.$route.query.pricesId == id)
        classes += 'animate__animated animate__heartBeat animate__infinite '
      if(this.mobileBrowser)
        classes += 'p-1'
      else
        classes += 'p-1'
      return classes
    },
    loadMoreQuotes() {
      this.currentPage++
      this.spinner = true
      this.getOpenQuotes().then(() => {
        this.spinner = false
        // setTimeout(() => {
        //   document.getElementById('openQuotes').scrollTop = document.getElementById('openQuotes').scrollHeight
        // }, 200)
      })
    }
  },
  components: {
    VQuoteCard,
    VNewQuoteCard
  },
};
</script>

<style>
.card-mobile {
  background: rgb(251, 253, 254);
  width: 100%;
}
.card-height-hd {
  background: rgb(251, 253, 254);
  margin-right: 25px;
  width: 60%;
  height: 70vh;
  overflow-y: scroll;
}
.col-height-hd {
  display: flex;
  flex-flow: row wrap;
  align-content: space-evenly;
  justify-content: center;
  align-items: center;
}
.col-mobile {
  display: flex;
  flex-flow: row wrap;
  align-content: center;
  justify-content: center;
  flex-direction: row;
  align-items: center;
}
</style>

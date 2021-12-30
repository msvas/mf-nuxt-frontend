<template>
  <div>
    <div v-on-clickaway="away">
      <v-navbar />
      <v-sidebar />
      <v-new-sidebar v-if="!this.mobileBrowser && $route.name != 'users.reviewQuote' && !this.hideSidebar" />
    </div>
    <div class="app-content content" :class="hasMargin">
      <div class="header-navbar-shadow"></div>
      <transition name="fade" mode="out-in">
        <nuxt />
      </transition>
    </div>
    <div class="sidenav-overlay d-none"></div>
    <!-- <browser-compatibility-warning /> -->
    <v-new-bottom-bar v-if="this.mobileBrowser && $route.name != 'users.reviewQuote' && !this.hideSidebar" />
    <v-footer v-if="!hideFooter" :class="this.mobileBrowser == false ? 'desktop' :'mobile' " />
  </div>
</template>

<style scoped>
.desktop {
  margin-left: 65px !important;
}
.mobile {
  margin-bottom: 40px;
}
</style>

<script>
import VNewSidebar from "./components/VNewSidebar.vue";
import VNewBottomBar from "./components/VNewBottomBar.vue";
import VNavbar from "./components/VNavbar";
import VFooter from "./components/VFooter";
import VSidebar from "./components/VSidebar";
import { mixin as clickaway } from "vue-clickaway";
//import browserCompatibilityWarning from "@/components/general/BrowserCompatibilityWarning";

export default {
  name: "Main",
  data() {
    return {
      mobileBrowser: undefined,
      // Essas classes fazem o layout ter o corpo do contéudo preenchido
      // elas afetam o body.
      classes: [
        "vertical-layout",
        "2-columns",
        "navbar-sticky",
        "footer-static",
        "vertical-overlay-menu",
        "pace-done",
        "menu-hide",
      ],
    };
  },
  mounted() {
    this.isMobile();
    if (
      process.env.NODE_ENV &&
      process.env.NODE_ENV != "development" &&
      location.protocol !== "https:"
    ) {
      location.replace(
        `https:${location.href.substring(location.protocol.length)}`
      );
    }

    for (let i = 0; i < this.classes.length; i++) {
      document.body.classList.add(this.classes[i]);
    }

    // Adiciona atributos do template do MF pra tag body
    document.body.setAttribute("data-open", "click");
    document.body.setAttribute("data-menu", "vertical-menu-modern");
    document.body.setAttribute("data-menu", "2-columns");
    document.body.style.overflow = "auto";
  },
  beforeDestroy() {
    for (let i = 0; i < this.classes.length; i++) {
      document.body.classList.remove(this.classes[i]);
    }

    document.body.setAttribute("data-open", "");
    document.body.setAttribute("data-menu", "");
    document.body.setAttribute("data-menu", "");
  },
  computed: {
    hideFooter() {
      if(this.$route.meta.hideFooter ||
         this.$route.path == '/fornecedores' ||
         this.$route.path == '/produtos-em-oferta')
        return true
      else
        return false
    },
    hideSidebar() {
      if(this.$route.meta.hideSidebar ||
         this.$route.name == 'painel-de-cotacoes-quoteId')
        return true
      else
        return false
    },

    hasMargin() {
      if(this.$route.name == 'users.reviewQuote')
        return ''
      else {
        if(this.mobileBrowser)
          return 'mobile'
        else
          return 'desktop'
      }
    },
  },
  mixins: [clickaway],
  components: {
    VNavbar,
    VFooter,
    VNewBottomBar,
    VSidebar,
    // browserCompatibilityWarning,
    VNewSidebar,
  },
  methods: {
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },

    away() {
      let menuClassList = document.body.classList;
      if (menuClassList.contains("menu-open")) {
        menuClassList.remove("menu-open");
        menuClassList.add("menu-hide");
        document.body.style.overflow = "auto";
        document.querySelector(".sidenav-overlay").classList.remove("d-block");
        document.querySelector(".sidenav-overlay").classList.add("d-none");
      }
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

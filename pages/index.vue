<template>
  <div class="content-wrapper pb-0" style="margin-top: 80px;padding: 0 !important;">
    <!-- <partner-modal :openPopup="openPartner" @update-modal="closePopup" /> -->
    <div class="content-body">
      <template>
        <form
        @submit.prevent="runSearch"
        action
        class="row"
        style="z-index: 1; width: 100%; top: 500px; position: absolute;"
        :class="showSearch ? '' : 'd-none'"

        >
        <i class="feather icon-search"
          style="color: black; position: relative; left: 9%; top: 40px; font-size: 2rem; z-index: 2;"
          @click="runSearch()"
        />
        <input id="search"
          ref="searchBar"
          type="text"
          placeholder="Buscar produtos"
          v-model="keyword"
          autocomplete="on"
          style="padding-left: 80px; padding-right: 300px; position: absolute; height: 120px; font-size: 1.2rem; margin-top: -6px; border: none; border-radius: 5px;"
        />
        <i
          class="feather icon-corner-down-left"
          @click="runSearch()"
          style="color: black; position: relative; left: 72%; top: 40px; font-size: 2rem; z-index:9999"
        />
        <i
          class="feather icon-x"
          @click="closing()"
          style="color: black; position: relative; left: 75%; top: 40px; font-size: 2rem; z-index:9999"
        />
      </form>
        <!-- <div v-if="!$auth.check()"> -->
        <div>
          <HomeBanner
            :style="this.mobileBrowser ? 'margin-bottom: 100px;':'margin-bottom: -25px;' "
          />
          <div v-if="mobileBrowser" style="padding-bottom:12px"></div>
          <div v-else style="padding-bottom:10px"></div>
        </div>
        <section class="card" style="background: #ebebeb">
          <div
            v-if="!this.mobileBrowser"
            class="row"
            style="background: rgb(245, 246, 247); justify-content: space-between; margin: 0; max-height: 148px;"
          >
            <div class="row" style="padding: 15px 20px">
              <span
                  v-for="(family, index) in catalog"
                  :key="index"
                  style="flex: 0 0 auto; width: auto; color: black"
                >
                  <vs-chip class="chip-mf">
                    <!-- <a style="color:inherit !important;" href="javascript:void(0)"
                      v-if="selectedFamily == 'Alimentos e bebidas' " @click="openNavigationsModal('family-collections', index)">
                      {{ index }}
                      <i class="feather icon-chevron-down pl-1"></i>
                    </a> -->
                    <a style="color:inherit !important;" href="javascript:void(0)" @click="openNavigationsModal('collection' , index)">
                      {{ index }}
                      <i class="feather icon-chevron-down pl-1"></i>
                    </a>
                  </vs-chip>
                </span>
                <button
                    style="padding: 8px 15px;"
                    type="button"
                    class="btn btn-danger ml-3"
                    @click="goToOffers()"
                  >
                    <img :src="require(`@/assets/images/offers.png`)" alt="*" width="16" height="16" />
                    <span style="padding-left: 5px;" class="font-small-3 align-middle">Ofertas</span>
                  </button>
            </div>
            <div style="display: flex; align-items: center;">
              <div>
                <form @submit.prevent="runSearch" style="margin-right: -20px;">
                  <input
                    id="search2"
                    type="text"
                    v-model="keyword"
                    placeholder="Buscar..."
                    style="font-size: 1rem; border: 2px solid rgb(12, 182, 149); border-radius: 5px; width: auto; padding: 5px;"
                  />
                  <i class="feather icon-x" style="margin-left: -15%"/>
                  <i
                    class="feather icon-search"
                    @click="runSearch()"
                    style="background-color: rgb(12, 182, 149); font-size: 18px; padding: 8px; border-bottom-right-radius: 5px; border-top-right-radius: 5px; vertical-align: text-bottom;"
                  />
                </form>
              </div>
            </div>
          </div>
          <div v-else>
            <div
              class="d-flex row"
              style="background-color: rgb(245, 246, 247); border-bottom: 1px solid rgb(213, 213, 213); justify-content: center; align-items: center; height: 50px;"
            >
            <vs-chip class="chip-mf">
              <a @click="openNavigationsModal('family', 'Alimentos e bebidas')">Todos os produtos</a>
            </vs-chip>
              <button
                style="padding: 8px 15px;"
                type="button"
                class="btn btn-danger ml-1 mr-2"
                @click="goToOffers()"
              >
                <img :src="require(`@/assets/images/offers.png`)" alt="*" width="16" height="16" />
                <span style="padding-left: 5px;" class="font-small-3 align-middle">Ofertas</span>
              </button>
             <div>
               <vs-chip style="border-color: #0CB695 !important; background-color: #0CB695 !important;" class="chip-mf">
                  <a  @click="closing()">
                    <i  class="feather icon-search"></i>
                  </a>
                </vs-chip>
             </div>
            </div>
          </div>
          <div v-if="this.filteredRandomSaleProducts.length > 0">
            <div
                class="row mt-1 mb-0 m-0"
                style=" position: sticky;
                        left: 0;
                        background-color: #ebebeb;"
              >
                <div class="p-0 pt-1 pb-1 ml-2">
                  <h4 class style="font-size: 26px; font-weight: 300; margin: 0 0 0 8px; color: #666;"
                  >Ofertas do dia</h4>
                </div>
                <div class="m-0 pl-2 pt-2 pb-1 align-self-center">
                  <router-link
                    :to="{ name: 'products.in.sale' }"
                  >Ver tudo</router-link>
                </div>
              </div>
            <div
              class="ml-2"
              :class="
              this.mobileBrowser
                ? 'product-card-list-mobile'
                : 'product-card-list-desktop'
            "
            >
              <span
                v-for="(product, index) in this.filteredRandomSaleProducts.slice(0, maxPerScreen)"
                :key="product.id"
                style="min-width: 165px; max-width: 165px;"
              >
                <a
                  v-if="index < maxPerScreen"
                  style="text-decoration: underline"
                >{{ product.productTypeName }}</a>
                <div class="card font-small-3" style="margin-right: 7px; margin-left: 3px">
                  <div class="card-body pl-1 pr-1 pt-0 pb-0">
                    <ProductInSaleCard
                      :product="product"
                      :expeditions="product.supplierProductExpeditions"
                    />
                  </div>
                </div>
              </span>
              <div
                v-if="this.filteredRandomSaleProducts.length > maxPerScreen"
                class="card"
                style="min-width: 120px; max-width: 120px; height: 200px; align-self: center; justify-content: center; text-align-last: center;"
              >
                <div class="row" style="padding: 3px;">
                  <div class="col-12 text-center">Tem muito mais produtos em oferta.</div>
                  <div class="col-12 mt-1 text-center">
                    <button @click="goToSalesPage()" type="button" class="btn btn-primary">
                      <a
                        style="color: white; white-space: nowrap;"
                        class="font-medium-1 align-middle"
                      >Ver tudo</a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="p-1"
            style="background: #ebebeb; display: flex; flex-flow: column; justify-content: space-between; border: none; border-radius: 0.5rem; transition: all 0.3s ease-in-out;"
          >
            <div
              v-for="(family, index) in catalog"
              :key="'family-' + index"
              :style="mobileBrowser == true ? 'overflow-x: scroll;  margin-bottom: 2rem;':'background-color: #ebebeb; margin-bottom: 4rem;'"
            >
              <div
                class="row mt-1 mb-0 m-0"
                style="position: sticky; left: 0; background-color: #ebebeb;"
              >
                <div class="p-0 pt-1 pb-1">
                  <h4 class style="font-size: 26px; font-weight: 300; margin: 0 0 0 8px; color: #666;"
                  >{{ index }}</h4>
                </div>
                <div class="m-0 pl-2 pt-2 pb-1 align-self-center">
                  <router-link
                    v-if="index == 'Alimentos e bebidas'"
                    :to="{ name: 'cotar-familia', params: { familyName: formatString(index) } }"
                  >Ver tudo</router-link>
                  <router-link
                    class="float-right pr-1"
                    v-else
                    :to="{ name: 'cotar-familia', params: { familyName: formatString(index) } }"
                  >Ver tudo</router-link>
                </div>
              </div>
              <div
                class="row pl-1"
                :style="mobileBrowser ? 'margin-top: 10px; margin-left: 10px; flex-flow: nowrap;' : 'margin-top: 10px; flex-flow: nowrap;'"
              >
                <span
                  v-for="product in slicePerWidth(productsFromFamily(index))"
                  :key="'product' + product.id"
                  style="min-width: 165px; max-width: 165px;"
                  :id="'scrollTo' + product.productTypeId + '-' + product.id"
                >
                  <div style="padding-left: 5px">
                    <h6 style="margin-bottom: 10px">
                      <a
                        @click="clickedProductTitle(product)"
                        style="text-decoration: underline"
                      >{{ product.productTypeName }}</a>
                    </h6>
                  </div>
                  <div class="card font-small-3 mb-1" style="margin-right: 10px;">
                    <div class="card-body pl-1 pr-1 pt-0 pb-0">
                      <ProductCard :product="product" />
                    </div>
                  </div>
                </span>
                <div
                  class="card font-small-3"
                  v-if="productsFromFamily(index).length >= 6"
                  style="min-width: 100px; max-width: 100px; height: 150px; margin-top: 25px; margin-right: 7px; margin-left: 3px; align-self: center;"
                >
                  <div class="card-body p-1">
                    <div class="row">
                      <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                      <div class="col-12 mt-1">
                        <router-link
                          v-if="index == 'Alimentos e bebidas'"
                          :to="{ name: 'cotar-familia', params: { familyName: formatString(index) } }"
                          class="btn btn-primary w-100"
                          style="padding-left: 3px; padding-right: 3px;"
                        >
                          <span
                            class="font-medium-1 align-middle"
                            style="white-space: nowrap;"
                          >Ver tudo</span>
                        </router-link>
                        <router-link
                          v-else
                          :to="{ name: 'cotar-familia', params: { familyName: formatString(index) } }"
                          class="btn btn-primary w-100"
                          style="padding-left: 3px; padding-right: 3px;"
                        >
                          <span
                            class="font-medium-1 align-middle"
                            style="white-space: nowrap;"
                          >Ver tudo</span>
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
                class="row ml-2 mt-1 mb-0 m-0"
                style="position: sticky; left: 0; background-color: #ebebeb;"
              >
                <div class="p-0 pt-1 pb-1">
                  <h4 v-if="this.mobileBrowser" class style=" font-size: 26px; font-weight: 300; margin: 0 0 0 8px; color: #666;"
                  >Fornecedores</h4>
                  <h4 v-else class style=" font-size: 26px; font-weight: 300; margin: 0 0 0 8px; color: #666;"
                  >Navegue por fornecedor</h4>
                </div>
                <div class="m-0 pl-2 pt-2 pb-1 align-self-center">
                  <router-link
                    :to="{ name: 'suppliers'}"
                  >Ver tudo</router-link>
                </div>
              </div>
            <div
              style=" display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center;"
            >
              <div v-for="supplier in filteredSuppliers.slice(0, 9)" v-bind:key="supplier.id">
                <supplier-card :supplier="supplier" />
              </div>
              <div class="row" :style="this.mobileBrowser ? 'margin:5px;' : 'margin: 15px;' ">
                <div style="color: black">
                  <div
                    class="card m-2"
                    style="padding: 20px; width: 300px; height: 115px; justify-content: center; margin: 0 !important; display: flex; flex-direction: row;"
                  >
                    <span>Tem muito mais fornecedores para comprar.</span>
                    <button
                      @click="$router.push({name: 'suppliers'})"
                      type="button"
                      class="btn btn-primary"
                    >
                      <router-link
                        style="color: white; white-space: nowrap;"
                        :to="{ name: 'suppliers' }"
                        class="font-medium-1 align-middle"
                      >Ver tudo</router-link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          class="p-2"
          style="background: white; margin-top:80px; margin-bottom: 2.2rem; border: none; border-radius: 0.5rem; box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%); transition: all 0.3s ease-in-out;"
        >
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; flex-direction: column">
              <h3 style="padding-bottom:10px;">Cadastre grátis sua distribuidora</h3>
              <h6 style="padding-bottom:10px;">
                Se você vende alimentos, bebidas, embalagens, descartáveis,
                utensílios ou produtos de limpeza e seus clientes são
                restaurantes, padarias ou minimercados, vire nosso parceiro.
              </h6>
              <button
                class="btn btn-outline-primary p-1"
                style="width: fit-content"
                @click="openPartner = true"
              >Fazer cadastro grátis</button>
            </div>
            <vs-divider></vs-divider>
            <div
              style=" display: flex;
                      flex-direction: row;
                      justify-content: space-between;"
            >
              <div style="display: flex; flex-direction: column">
                <span>Veja quais fornecedores já temos cadastrados</span>
                <router-link
                  :to="{ path: '/fornecedores-ativos' }"
                  style="text-decoration-line: underline;"
                >Ver todos os fornecedores</router-link>
              </div>
              <div style="display: flex; flex-direction: column">
                <span>
                  Veja a união dos produtos das distribuidoras em um só
                  catálogo
                </span>
                <router-link
                  :to="{ path: '/todos-os-produtos' }"
                  style="text-decoration-line: underline;"
                >Ver todos os produtos</router-link>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>
    <vs-popup title="Um momento..." :active.sync="showLoadingAlert">
      <div>
        <h5
          class="d-flex justify-content-center"
        >Carregando os produtos de distribuidoras da sua região.</h5>
        <div class="d-flex justify-content-center" style="margin-top: 20px; margin-bottom: 20px;">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </vs-popup>
    <NavigationModal
      :catalog="catalog"
      :openPopup="navigationsModal"
      :tab="tab"
      :selectedViewType="selectedViewType"
      @update-nav-modal="updateNavigationModal"
    />
  </div>
</template>
<style>
.card .card {
  box-shadow: 0 1px 1px 0 rgba(0,0,0,.1) !important;
}
span.capitalize:first-letter {
  text-transform: uppercase;
}
span.capitalize {
  display: inline-block;
}
.product-card-list-mobile {
  padding: 20px;
  display: flex;
  flex-direction: row;
  overflow: auto;
}
.product-card-list-desktop {
  padding-top: 20px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  align-self: center;
}
</style>
<script>
import HomeBanner from "@/components/home/HomeBanner";
import ProductCard from "@/components/products/ProductCard";
import SuppliersService from "@/services/suppliers";
import ProductsService from "@/services/products";
import SupplierCard from "@/components/suppliers/SupplierCard";
import PartnerModal from "@/components/home/PartnerModal";
import ProductInSaleCard from "@/components/products/ProductInSaleCard";
import { mapGetters, mapActions, mapState } from "vuex";
import NavigationModal from "@/components/users/NavigationModal"

export default {
  data() {
    return {
      allAutoSuppliers: [],
      filteredSuppliers: [],
      randomProducts: [],
      randomSaleProducts: [],
      filteredRandomSaleProducts: [],
      filteredRandomProducts: [],
      keyword: null,
      keyword2: null,
      quoteLoading: false,
      openPartner: false,
      mobileBrowser: undefined,
      allProductTypes: [],
      familyProducts: [],
      showLoadingAlert: false,
      familiesModal: false,
      showSearch: false,
      navigationsModal: false,
      tab: 0,
      selectedViewType: ''
    };
  },
  beforeMount() {
    this.getAllCatalog().then(() => {
      for (let family in this.catalog) {
        this.loadFamilyProducts(family)
      }
      this.showLoadingAlert = false
    });
    SuppliersService.getAuto(this.params, 10).then((response) => {
      this.allAutoSuppliers = response.data;
      this.filteredSuppliers = this.allAutoSuppliers;
    });
    SuppliersService.getRandomSaleProducts().then((response2) => {
      this.randomSaleProducts = response2.data;
      this.filteredRandomSaleProducts = this.randomSaleProducts;
    });
  },
  mounted() {
    if (this.$route.query.loadingProducts == "true")
      this.showLoadingAlert = true;

    // this.getAllCatalog().then(() => {
    //   for (let family in this.catalog) {
    //     this.loadFamilyProducts(family)
    //   }
    //   this.showLoadingAlert = false
    // });
    //
    // SuppliersService.getAuto(this.params, 10).then((response) => {
    //   this.allAutoSuppliers = response.data;
    //   this.filteredSuppliers = this.allAutoSuppliers;
    //   //this.createOptionsSctructures(this.allAutoSuppliers);
    // });
    // SuppliersService.getRandomSaleProducts().then((response2) => {
    //   this.randomSaleProducts = response2.data;
    //   this.filteredRandomSaleProducts = this.randomSaleProducts;
    // });

    this.isMobile();
    // if (this.$auth.check()) {
    //   if (
    //     this.$auth.user().isSupplier &&
    //     this.$auth.user().supplierStatus == "Não liberado"
    //   )
    //     this.$router.push({ name: "products-empty" });
    //   else if (
    //     this.$auth.user().isSupplier &&
    //     this.$auth.user().supplierStatus == "Liberado"
    //   )
    //     this.$router.push({ name: "quotation-panel" });
    // }
  },
  computed: {
    ...mapState("navigationFilters", ["cep", "region", "supplierServes"]),
    ...mapState("users/products", ["catalog"]),
    ...mapGetters("users/products", ["productListIsEmpty"]),
    ...mapGetters("navigationFilters", ["params"]),
    maxPerScreen() {
      if (window.innerWidth >= 1920) {
        return 10;
      } else if (window.innerWidth >= 1600 && window.innerWidth < 1920) {
        return 8;
      } else if (window.innerWidth >= 1366 && window.innerWidth < 1600) {
        return 7;
      } else if (window.innerWidth >= 1280 && window.innerWidth < 1366) {
        return 6;
      } else if (window.innerWidth >= 800 && window.innerWidth < 1280) {
        return 3;
      } else {
        return 6;
      }
    },
    widthRatio() {
      return (window.innerWidth / this.maxPerScreen / window.innerWidth) * 100;
    },
  },
  methods: {
    ...mapActions("users/products", ["getAllCatalog", "getCatalogByFamily"]),

    searchBarWidth() {
      if (window.innerWidth >= 1910) {
        return "width: 600px;";
      } else if (window.innerWidth >= 1680 && window.innerWidth < 1910) {
        return "width: 600px;";
      } else if (window.innerWidth >= 1450 && window.innerWidth < 1680) {
        return "width: 600px;";
      } else if (window.innerWidth >= 1220 && window.innerWidth < 1450) {
        return "width: 400px;";
      } else if (window.innerWidth >= 1000 && window.innerWidth < 1220) {
        return "width: 300px;";
      } else {
        return "width: 300px;";
      }
    },
    offerExpeditionsByProduct(product) {
      return this.supplierOfferExpeditions.filter(
        (obj) => obj.productExpedition.productId == product.id
      );
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
    runSearch() {
      if (this.keyword != "") {
        this.$router.push({
          name: "users.search",
          params: { keyword: this.keyword, tab: 0 },
        });
      }
    },
    runSupplierSearch() {
      this.$router.push({
        name: "suppliers",
        query: { keyword: this.keyword2 },
      });
    },
    toQuotePanel() {
      this.quoteLoading = true;
      setTimeout(() => {
        this.quoteLoading = false;
        this.$router.push({ name: "users.orderPanel" });
      }, 300);
    },
    filterSupplierByFamily(familyName) {
      this.filteredSuppliers = this.allAutoSuppliers
        .filter((obj) =>
          Object.prototype.hasOwnProperty.call(obj.catalogAsHash, familyName)
        )
        .slice(0, 9);
    },
    closePopup(value) {
      this.openPartner = value;
    },
    createOptionsSctructures(suppliers) {
      var data = null;
      for (var i in suppliers) {
        data = suppliers[i].catalogAsHash;
        for (let family in data) {
          for (let collection in data[family]) {
            for (let category in data[family][collection]) {
              for (
                var j = 0;
                j < data[family][collection][category].length;
                j++
              ) {
                if (
                  !this.allProductTypes.find(
                    (type) =>
                      type.productTypeId ==
                      data[family][collection][category][j].productTypeId
                  )
                )
                  this.allProductTypes.push({
                    family: family,
                    collection: collection,
                    category: category,
                    type: data[family][collection][category][j],
                  });
              }
            }
          }
        }
      }
    },
    openProductType(product) {
      this.$router.push({
        name: "cotar-produto",
        params: {
          familyName: this.formatString(product.familyName),
          categoryName: this.formatString(product.categoryName),
          productTypeName: this.formatString(product.productTypeName),
        },
      });
    },
    normalizeString(s) {
      var r = s.toLowerCase();
      r = r.replace(new RegExp("[àáâãäå]", "g"), "a");
      r = r.replace(new RegExp("ç", "g"), "c");
      r = r.replace(new RegExp("[èéêë]", "g"), "e");
      r = r.replace(new RegExp("[ìíîï]", "g"), "i");
      r = r.replace(new RegExp("[òóôõö]", "g"), "o");
      r = r.replace(new RegExp("[ùúûü]", "g"), "u");
      return r;
    },
    formatString(string) {
      return this.normalizeString(string).replace(/\s+/g, "-").replace(".", "");
    },
    goToSalesPage() {
      this.$router.push({ name: "products.in.sale" });
    },
    loadFamilyProducts(family) {
      this.getCatalogByFamily({ family: family }).then((response) => {
        this.familyProducts.push({ family: family, products: response });
      });
    },
    slicePerWidth(products) {
      if (this.mobileBrowser == false) {
        return products.slice(0, this.maxPerScreen);
      } else {
        return products.slice(0, 6);
      }
    },
    productsFromFamily(family) {
      var aux = this.familyProducts.find((obj) => obj.family == family);
      if (aux && aux.products) return aux.products;
      else return [];
    },
    clickedProductTitle(product) {
      this.$router.push({
        name: "cotar-produto",
        params: {
          familyName: this.formatString(product.familyName),
          categoryName: this.formatString(product.categoryName),
          productTypeName: this.formatString(product.productTypeName),
        },
      });
    },
    closing() {
      if (this.mobileBrowser) {
        this.showSearch = !this.showSearch;
        if (this.showSearch) {
          setTimeout(() => {
            this.$refs.searchBar.focus();
          }, 500);
        }
      }
    },
    goToOffers() {
      this.$router.push({ name: "products.in.sale" });
    },
    getFamilyIcon(family) {
      switch(family) {
        case 'Alimentos e bebidas':
          return '<img src="' + require(`@/assets/images/maca.svg`) + '" alt="*" width="16">'
        case 'Embalagens':
          return '<i class="feather icon-shopping-bag mr-25"></i>'
        case 'Limpeza':
          return '<img src="' + require(`@/assets/images/window-cleaner.svg`) + '" alt="*" width="16">'
        case 'Utensílios':
          return '<i class="fa fa-cutlery mr-25"></i>'
      }
      return null
    },
    clearSearch() {
      this.keyword = ''
    },
    familyNameAbreviation(familyName){
      if (familyName == 'Alimentos e bebidas')
        return 'Alim. e beb.'
      else if (familyName == 'Embalagens')
        return 'Embal.'
      else if (familyName == 'Limpeza')
        return 'Limp.'
        else return 'Utens.'
    },
    updateNavigationModal(val) {
      this.navigationsModal = val;
    },
    openNavigationsModal(viewType, familyName) {
      this.selectedViewType = viewType
      this.selectedTab(familyName)
      this.navigationsModal = true;
    },
    selectedTab(selectedFamily){
        switch(selectedFamily){
          case 'Alimentos e bebidas':
            this.tab = 0
          break
          case 'Limpeza':
            this.tab = 1
          break
          case 'Embalagens':
            this.tab = 2
          break
          case 'Utensílios':
            this.tab = 3
          break
        }
        return null
      },
  },
  components: {
    HomeBanner,
    ProductCard,
    SupplierCard,
    PartnerModal,
    ProductInSaleCard,
    NavigationModal,
  },
};
</script>

<template>
  <div ref="generalScroll" v-on:scroll.passive="showTopButton()" class="content-body p-0 m-0" style="max-height: 100vh; overflow-x: hidden; overflow-y: scroll; scroll-behavior: smooth; background-color: #ebebeb">
    <loading-overlay
      :active.sync="isLoading"
      :is-full-page="fullPage"
      :loader="loader"
      :color="color"
      :background-color="backgroundColor"
      :opacity="opacity"
      :width="width"
      :height="height"
    />
    <div  style="padding-top: 70px;" >

      <div
        class
        style="background: #EDEDED; border-bottom: solid 1px #D5D5D5; padding-top: 5px; padding-bottom: 5px;"
      >
        <div
          v-if="$device.isMobile"
          class="row"
          style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; background: rgb(245, 246, 247); justify-content: space-between; max-height: 45px;"
        >
          <suppliers-families-modal
            @selected-category="selectedCategoryAllProducts"
            @selected-collection="cleanPageAndselectedCollectionOnModal"
            @selected-product-type="selectProductType"
            @update-modal="updateStoreFamiliesModal"
            :openPopup="familiesModal"
            :catalog="allProductTypes"
            :selectedFamily="selectedFamily"
            :selectedCategory="selectedCategory"
            :selectedCollection="selectedCollection"
          />
          <div class="m-0 pl-1 pr-0" style="flex: 0 0 10%">
            <a @click="resetFilter()" href="javascript:void(0)">
              <button
                type="button"
                :class="viewType == home ? 'btn btn-outline-primary disabled' : 'btn btn-outline-primary'"
                style="padding: 7px 7px;"
              >
                <i class="ficon feather icon-home" />
              </button>
            </a>
          </div>
          <div
            class="m-0"
            style="padding-right: 2px !important; padding-left: 2px;"
          >
            <button
                @click="openFamiliesModal()"
                type="button"
                class="btn btn-success"
                style="padding: 3px 8px; background-color: rgb(0, 133, 103) !important; color: white; display: flex; align-items: center;"
              > Categorias
                <i style="font-size: x-large;" class="feather icon-chevron-down"></i>
              </button>
          </div>

          <div class="m-0 pl-0 pr-1" style="flex: 0 0 48%; padding-right: 0 !important;">
            <form
                @submit.prevent="runSearch"
                action
                class
                style="z-index: 1; height: -webkit-fill-available; position: relative; width: 112%;"
              >
                <input
                    id="search2"
                    type="text"
                    placeholder="Buscar..."
                    v-model="keyword"
                    autocomplete="on"
                    class="mr-2"
                    style="padding-left: 10px; position: relative; left: 0px; height: 30px; font-size: 1rem; border: 2px solid rgb(12, 182, 149); border-radius: 5px;"
                    :style="$device.isMobile ? 'width: 83%;' : 'width: 600px;'"
                  />
                  <i @click="clearSearch()"
                  class="feather icon-x"
                  style="color: black; position: absolute; left: 60%; top: 7px; font-size: 1.2rem; z-index: 2; width: 40px;"/>
                  <i
                    class="feather icon-search"
                    style="color: white; background: rgb(12, 182, 149); position: absolute; left: 70%; top: 1px; font-size: 1.2rem; z-index: 2; width: 40px; border-radius: 0px 5px 5px 0px; padding: 6px; text-align: center;"
                    @click="runSearch()"
                  />
              </form>
          </div>
        </div>
        <div
          v-else
          class="row"
          style="border-top: 1px solid lightgrey; background: rgb(245, 246, 247); height: 50px; align-items: center; padding: 5px 10px;"
        >
          <div class="m-0 pl-1 pr-0" style="flex: 0 0 50px">
            <a @click="resetFilter()" href="javascript:void(0)">
              <button
                type="button"
                :class="viewType == home ? 'btn btn-outline-primary ' : 'btn btn-outline-primary'"
                style="padding: 7px 7px;"
              >
                <i class="ficon feather icon-home" />
              </button>
            </a>
          </div>
          <div
            class="m-0"
            style="flex: 0 0 auto; padding-right: 2px !important; padding-left: 2px;"
          >
            <span v-for="family in uniqueUsedFamilies()" :key="family">
              <!-- <a
                v-if="selectedFamily == 'Alimentos e bebidas' && family == 'Alimentos e bebidas'"
                href="javascript:void(0)"
                @click="resetFilter()"
              >
                <vs-chip
                  class="public-chip p-0 pr-1 font-small-2 font-weight-bold"
                  style="background-color: #bc5100; color: white;"
                >Alimentos e bebidas</vs-chip>
              </a>
              <a
                v-else-if="selectedFamily != 'Alimentos e bebidas' && family == 'Alimentos e bebidas'"
                href="javascript:void(0)"
                @click="selectFamily('Alimentos e bebidas')"
              > -->
              <a v-if="selectedFamily == 'Alimentos e bebidas' && family == 'Alimentos e bebidas'" href="javascript:void(0)" @click="resetFilter()">
                <vs-chip class="public-chip p-0 pr-1 font-small-2 font-weight-bold" style=" color: white; flex: 0 0 auto; width: auto; background-color: #008567;">
                    <span style="padding-right: 5px;" v-html="getFamilyIcon(normalizeString(family))"/>
                    Alimentos e bebidas
                </vs-chip>
              </a>
              <nuxt-link
                v-else-if="selectedFamily != 'Alimentos e bebidas' && family == 'Alimentos e bebidas'"
                :to="{ name: 'suppliers-family',
                       params: {
                         familyName: 'alimentos-e-bebidas',
                      } }"
                style="color: inherit;"
                >
                <vs-chip class="chip-mf" >
                   <a> Alimentos e bebidas</a>
                </vs-chip>
              </nuxt-link>
              <a v-else-if="selectedFamily == family" href="javascript:void(0)" @click="resetFilter()">
               <vs-chip class="public-chip p-0 pr-1 font-small-2 font-weight-bold" style="background-color: #008567; color: white;">
                 <a class="capitalize">{{ family }}</a>
               </vs-chip>
              </a>
              <nuxt-link
                v-else
                :to="{ name: 'suppliers-family',
                       params: {
                         familyName: formatString(family),
                      } }"
                style="color: inherit;"
                >
                <vs-chip class="chip-mf " >
                  <a class="capitalize">{{ family }}</a>
                </vs-chip>
              </nuxt-link>
            </span>
          </div>
          <div style="width:150px; margin-left: 200px; margin-right: 100px;">
           <form
                  @submit.prevent="runSearch"
                  action
                  class
                  style="z-index: 1; height: -webkit-fill-available; position: relative;"
                >
                  <input
                    id="search2"
                    type="text"
                    placeholder="Buscar em todo o site"
                    v-model="keyword"
                    autocomplete="on"
                    class="mr-2"
                    style="padding-left: 10px; position: relative; left: 0px; height: 30px; font-size: 1rem; border: 2px solid rgb(12, 182, 149); border-radius: 5px; width: 230px;"
                  />
                  <i class="feather icon-x"
                     @click="clearSearch()"
                     style="color: black; position: absolute; left: 180px; top: 7px; font-size: 1.2rem; z-index: 2; width: 40px;"/>
                  <i
                    class="feather icon-search"
                    style="color: white; background: rgb(12, 182, 149); position: absolute; left: 210px; top: 0; font-size: 1.2rem; z-index: 2; width: 40px; border-radius: 0px 5px 5px 0px; padding: 7px; text-align: center;"
                    @click="runSearch()"
                  />
                </form>
          </div>
        </div>
        <div
          v-if="showCollections && selectedFamily == 'Alimentos e bebidas' && !$device.isMobile"
          ref="scrollCollections"
          class="row no-wrap no-scrollbar"
          @mousewheel="scrollXCollections"
          v-dragscroll
          style="border-top: 1px solid lightgrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; height: 50px; align-items: center; background-color: #ebebeb;"
        >
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollCollections)"
            @click="addScrollX($refs.scrollCollections, -1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; left: 0px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-left" style="color: Gray;"></i>
          </a>

          <span
            v-for="(collection, index) in showCollections"
            :key="'collection' + index"
            :vs-value="index"
            style="flex: 0 0 auto; width: auto;"
          >
            <vs-chip v-if="collection != selectedCollection" class="chip-mf public-chip p-0 pr-1">
              <a
                @click="cleanPageAndselectedCollectionOnModal({ family: selectedFamily, collection: collection })"
                style
              >
                <span class="capitalize">{{ collection }}</span>
              </a>
            </vs-chip>
            <vs-chip
              v-if="collection == selectedCollection"
              style="flex: 0 0 auto; width: auto; background-color: #0cb695;"
              class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
            >
              <a
                @click="cleanPageAndselectedCollectionOnModal({ family: selectedFamily, collection: collection })"
                style
              >
                <span class="capitalize">{{ collection }}</span>
              </a>
            </vs-chip>
          </span>
          <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden;">a</vs-chip>
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollCollections)"
            @click="addScrollX($refs.scrollCollections, 1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; right: 20px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-right" style="color: Gray;"></i>
          </a>
        </div>
        <div
          v-if="(selectedCollection || selectedCategory)"
          ref="scrollCategories"
          class="row no-wrap no-scrollbar"
          @mousewheel="scrollXCategories"
          v-dragscroll
          style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
        >
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollCategories)"
            @click="addScrollX($refs.scrollCategories, -1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; left: 0px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-left" style="color: Gray;"></i>
          </a>
          <a
            v-if="selectedCollection"
            style="margin-left: 5px; align-self: center;     white-space: nowrap;"
            class="public-chip text-black font-small-2 font-weight-bold p-0 pr-1"
          >
            <a @click="selectFamily(selectedFamily)" style>
              <span class="capitalize">{{ selectedCollection }}</span>
            </a>
          </a>
          <div v-if="selectedCollection" style="border-right: 1px solid DarkGrey; margin: 0 5px;"></div>
          <span
            v-for="(category, index) in showCategories"
            :key="'category' + index"
            :vs-value="index"
            style="flex: 0 0 auto; width: auto;"
          >
            <vs-chip v-if="category == selectedCategory"
                    style="flex: 0 0 auto; width: auto; background-color: #0cb695;"
                    class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1" >
              <nuxt-link
                v-if="viewType == 'product-type'"
                :to="{ path: 'suppliers-family',
                       params: {
                         familyName: formatString(selectedFamily),
                      } }"
                style="color: inherit;"
              >
                <span class="capitalize">{{ selectedCategory }}</span>
              </nuxt-link>
              <nuxt-link
                v-else
                :to="{ name: 'suppliers-family',
                       params: {
                         familyName: formatString(selectedFamily),
                      } }"
                style="color: inherit;"
              >
                <span class="capitalize">{{ selectedCategory }}</span>
              </nuxt-link>
            </vs-chip>
            <vs-chip
              v-if="category != selectedCategory"
              class="chip-mf public-chip p-0 pr-1"
            >
              <nuxt-link
                :to="{ name: 'suppliers-category',
                       params: {
                         familyName: formatString(selectedFamily),
                         categoryName: formatString(category)
                      } }"
                style="color: inherit;"
              >
                <span class="capitalize">{{ category }}</span>
              </nuxt-link>
            </vs-chip>
          </span>
          <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden;">a</vs-chip>
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollCategories)"
            @click="addScrollX($refs.scrollCategories, 1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; right: 20px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-right" style="color: Gray;"></i>
          </a>
        </div>
        <div
          v-if="viewType == 'collection' && selectedFamily != 'Alimentos e bebidas'"
          ref="scrollCategoriesAB"
          class="row no-wrap no-scrollbar"
          @mousewheel="scrollXCategoriesAB"
          v-dragscroll
          style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
        >
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollCategoriesAB)"
            @click="addScrollX($refs.scrollCategoriesAB, -1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; left: 0px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-left" style="color: Gray;"></i>
          </a>
          <span
            v-for="(category, index) in showCategories"
            :key="'cat' + index"
            :vs-value="index"
            style="flex: 0 0 auto; width: auto;"
          >
            <vs-chip
              v-if="index != selectedCategory"
              class="chip-mf public-chip p-0 pr-1"
            >
              <nuxt-link
                :to="{ name: 'suppliers-category',
                       params: {
                         familyName: formatString(selectedFamily),
                         categoryName: formatString(category)
                      } }"
                style="color: inherit;"
              >
                <span class="capitalize">{{ category }}</span>
              </nuxt-link>
            </vs-chip>
          </span>
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollCategoriesAB)"
            @click="addScrollX($refs.scrollCategoriesAB, 1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; right: 20px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-right" style="color: Gray;"></i>
          </a>
        </div>
        <div
          v-if="viewType == 'category-all-products' || viewType == 'product-type'"
          ref="scrollProducts"
          class="row no-wrap no-scrollbar"
          style="overflow-x: scroll; border-top: solid 1px LightGrey; padding-top: 2px; padding-bottom: 2px; padding-left: 15px; background-color: #f5f6f7;"
          @mousewheel="scrollXProducts"
          v-dragscroll
        >
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollProducts)"
            @click="addScrollX($refs.scrollProducts, -1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; left: 0px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-left" style="color: Gray;"></i>
          </a>
          <span
            v-for="type in showProductTypes"
            :key="type.type.productType"
            :vs-value="type.type.productType"
            style="flex: 0 0 auto; width: auto;"
          >
            <vs-chip
              v-if="selectedProductType && type.type.productTypeId == selectedProductType.productTypeId"
              style="flex: 0 0 auto; width: auto; background-color: #5ce9c6;"
              class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
            >
              <nuxt-link
                :to="{ name: 'suppliers-category',
                       params: {
                         familyName: formatString(selectedFamily),
                         categoryName: formatString(selectedCategory)
                      } }"
                style="color: black;"
              >
                {{ type.type.productType }}
              </nuxt-link>
            </vs-chip>
            <vs-chip
              v-else
              class="chip-mf public-chip p-0 pr-1"
            >
              <nuxt-link
                :to="{ name: 'suppliers-product',
                       params: {
                         familyName: formatString(selectedFamily),
                         categoryName: formatString(selectedCategory),
                         productTypeName: formatString(type.type.productType)
                      } }"
                style="color: inherit;"
              >
                {{ type.type.productType }}
              </nuxt-link>
            </vs-chip>
          </span>
          <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden;">a</vs-chip>
          <a
            href="javascript:void(0);"
            v-if="hasScroll($refs.scrollProducts)"
            @click="addScrollX($refs.scrollProducts, 1)"
            class="btn btn-outline-primary font-medium-1"
            style="position: sticky; right: 20px; z-index: 100; padding: 5px; height: 25px;"
          >
            <i class="feather icon-chevron-right" style="color: Gray;"></i>
          </a>
        </div>
      </div>

      <div v-if="this.keywordAux != null">
        <div
          v-if="filteredSuppliers.length == 0"
          style="display: flex; flex-direction: row; justify-content: center;"
        >
          <pre style="margin: 2em 0em; white-space: pre-wrap; text-align: center;"> <h4>Nenhum fornecedor encontrado para  <span style="color:#f57f17;">{{this.keywordAux}}.</span></h4> </pre>
        </div>
        <div v-else style="display: flex; flex-direction: row; justify-content: center;">
          <pre style="margin: 2em 0em; white-space: pre-wrap; text-align: center;"> <h4>Fornecedores encontrados para <span style="color:#f57f17;">{{this.keywordAux}}:</span></h4> </pre>
        </div>
        <a
          v-show="$device.isMobile"
          href="javascript:void(0)"
          @click="resetFilter()"
          style="display: flex; justify-content: center; margin-top: -50px; color: black"
        >Limpar</a>
      </div>

      <div
        class="p-1"
        style="display: flex; justify-content: space-between; padding-top: 10px; border: none; border-radius: 0.5rem; box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%); transition: all 0.3s ease-in-out; background-color: #ebebeb;"
      >
         <h4 class style="font-size: 26px; font-weight: 300; margin: 0 0 0 8px; color: #666;"
          >Escolha o fornecedor</h4>
      </div>
      <div
        style="display: flex; flex-wrap: wrap; flex-direction: row; background-color: #ebebeb"

        :style="$device.isMobile ? 'justify-content: center;' : ''"
      >
        <div v-for="supplier in filteredSuppliers" v-bind:key="supplier.id">
          <supplier-card :supplier="supplier" />
        </div>
      </div>
      <div
        style="margin-top: 15px; display: flex; flex-direction: row; align-items: center; justify-content: center; background-color: #ebebeb"
      >
        <b-pagination
          v-if="allowPagination"
          v-model="currentPage"
          :total-rows="totalPages * 20"
          :per-page="20"
          first-text="Início"
          prev-text="Anterior"
          next-text="Próximo"
          last-text="Final"
        ></b-pagination>
      </div>
    </div>
    <v-footer
      :class="$device.isMobile == true ? 'mobile' : 'desktop' "
      style="margin-top:100px;"
    />
  </div>
</template>

<style scoped>
span.capitalize:first-letter {
  text-transform: uppercase;
}
span.capitalize {
  display: inline-block;
}
.no-wrap {
  flex-wrap: nowrap;
}
.no-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}
.no-scrollbar::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}
.desktop {
  margin-left: 10px !important;
}
.mobile {
  margin-bottom: 20px;
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
  justify-content: center;
}
</style>

<script>
import SuppliersService from "@/services/suppliers";
import SupplierCard from "@/components/suppliers/SupplierCard";
import SuppliersFamiliesModal from "@/components/suppliers/SuppliersFamiliesModal";
import VFooter from "@/layouts/components/VFooter";
import ProductInSaleCard from "@/components/products/ProductInSaleCard";
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  name: "SelectSupplier",
   metaInfo() {
    return {
      title: this.titleContent,
      titleTemplate: null,

       meta: [
         {
          vmid: "description",
          name: "description",
          content: this.descriptionContent,
        },
        {
          property: "og:title",
          content: this.titleContent,
        },
        {
          property: "og:description",
          content: this.descriptionContent,
        },
        {
          property: "og:image",
          itemprop: "image",
          content:  "https://meufornecedor.com.br/logo.png",
        },

        {
          property: "og:image:secure_url",
          itemprop: "image",
          content:  "https://meufornecedor.com.br/logo.png",
        },
       ]
    }
  },
  data() {
    return {
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoading: false,
      allAutoSuppliers: [],
      filteredSuppliers: [],
      viewType: "family",
      selectedCollection: null,
      selectedFamily: null,
      selectedCategory: null,
      keyword: null,
      keywordAux: null,
      home: null,
      showCollections: [],
      showCategories: [],
      showProductTypes: [],
      allProductTypes: [],
      mobileBrowser: false,
      familiesModal: false,
      btnSelected: false,
      randomSaleProducts: [],
      filteredRandomSaleProducts: [],
      topButton: false,
      firstTime: false,
      allowPagination: false,
      isCollection: false,
      titleContent: 'Distribuidoras - Lojas online | Meu Fornecedor',
      descriptionContent: 'Lista de distribuidoras de alimentos, bebidas, embalagens, limpeza e Utensílios. Acesse as lojas e confira as ofertas em MeuFornecedor.com.br',
    };
  },
  mounted() {
    this.isLoading = true
    this.firstTime = true
    this.isMobile()
    var page = 1
    if(this.$route.query.page)
      page = this.$route.query.page
    this.userSelectedPage(page)
    this.setCurrentPage(page)
    this.getSuppliersAutoProductTypes(this.params).then((response) => {
      this.createOptionsSctructures(response)
      this.selectPage()
      this.firstTime = false
    })
  },
  // beforeRouteLeave(to, from, next) {
  //   this.userSelectedPage(1)
  //   this.setCurrentPage(1)
  //   next()
  // },
  watch: {
    currentPage(newPage) {
      if(!this.firstTime && !this.isCollection) {
        this.loadNewPage()
        // this.$router.push({
        //   path: '/fornecedores',
        //   query: { page: newPage },
        // });
      } else if(this.isCollection) {
        this.selectedCollectionOnModal({ family: this.selectedFamily, collection: this.selectedCollection })
      }
    },
  },
  computed: {
    ...mapGetters("navigationFilters", ["params"]),
    ...mapState("pagination", ["totalPages"]),
    ...mapState("suppliers", ["suppliersAuto"]),
    maxPerScreen() {
      if (window.innerWidth >= 2000) {
        return 10;
      } else if (window.innerWidth >= 1800 && window.innerWidth < 2000) {
        return 9;
      } else if (window.innerWidth >= 1600 && window.innerWidth < 1800) {
        return 8;
      } else if (window.innerWidth >= 1400 && window.innerWidth < 1600) {
        return 7;
      } else if (window.innerWidth >= 1200 && window.innerWidth < 1400) {
        return 6;
      } else if (window.innerWidth >= 1000 && window.innerWidth < 1200) {
        return 4;
      } else if (window.innerWidth >= 800 && window.innerWidth < 1000) {
        return 3;
      } else {
        return 6;
      }
    },
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
    ...mapActions("pagination", ["userSelectedPage", "setCurrentPage"]),
    ...mapActions("suppliers", ["getAllAutoPaginated", "getSuppliersAutoProductTypes"]),
    loadNewPage() {
      this.isLoading = true
      this.getSuppliersAutoProductTypes(this.params).then((response) => {
        this.createOptionsSctructures(response)
        this.selectPage()
      })
    },
    resetFilter(){
      this.keyword = null
      this.keywordAux = null
      this.viewType = 'family'
      this.selectedFamily = null
      this.selectedCollection = null
      this.selectedCategory = null
      this.filteredSuppliers = this.allAutoSuppliers
      this.btnSelected = false
      this.$router.push({ path: '/fornecedores' })
    },
    selectPage() {
      if(this.$route.query.keyword) {
        this.keyword = this.$route.query.keyword
        this.runSearch()
      } else if(this.$route.meta.familyView) {
        var found = this.findKeyEncoded(this.uniqueUsedFamilies(), this.$route.params.familyName)
        if (found) {
          this.selectFamily(found.original);
          this.titleContent = "Distribuidoras de " + this.slugToName(this.selectedFamily) + " | Meu Fornecedor";
          this.descriptionContent = "Fornecedores de " + this.slugToName(this.selectedFamily) + " listados no MeuFornecedor.com.br. Compre online para seu restaurante, padaria, minimercado.";
        }
      } else if(this.$route.meta.categoryView) {
        for(var j = 0; j < this.allProductTypes.length; j++) {
          if(this.formatString(this.allProductTypes[j].category) == this.$route.params.categoryName &&
             this.formatString(this.allProductTypes[j].family) == this.$route.params.familyName) {
            this.selectedCategoryAllProducts({ family: this.allProductTypes[j].family, collection: this.allProductTypes[j].collection, category: this.allProductTypes[j].category });
            this.titleContent = "Distribuidoras de " + this.slugToName(this.selectedCategory) + " | Meu Fornecedor"
            this.descriptionContent = "Fornecedores de " + this.slugToName(this.selectedCategory) + " listados no MeuFornecedor.com.br. Compre online para seu restaurante, padaria, minimercado.";
            break
          }
        }
      } else if(this.$route.meta.productTypeView) {
        for(var k = 0; k < this.allProductTypes.length; k++) {
          if(this.formatString(this.allProductTypes[k].category) == this.$route.params.categoryName &&
             this.formatString(this.allProductTypes[k].family) == this.$route.params.familyName &&
             this.formatString(this.allProductTypes[k].type.productType) == this.$route.params.productTypeName) {
            this.selectProductType(this.allProductTypes[k].type.productTypeId);
            this.titleContent = "Distribuidoras de " + this.slugToName(this.selectedProductType.productType) + " | Meu Fornecedor";
            this.descriptionContent = "Fornecedores de " + this.slugToName(this.selectedProductType.productType) + " listados no MeuFornecedor.com.br. Compre online para seu restaurante, padaria, minimercado.";
            break
          }
        }
      } else if(this.$route.query.family) {
        this.selectFamily(this.$route.query.family)
        this.titleContent = "Distribuidoras de " + this.slugToName(this.selectedFamily) + " | Meu Fornecedor"
        this.descriptionContent = "Fornecedores de " + this.slugToName(this.selectedFamily) + " listados no MeuFornecedor.com.br. Compre online para seu restaurante, padaria, minimercado.";
      } else {
        this.getAllAutoPaginated({ params: this.params }).then(() => {
          this.allAutoSuppliers = this.suppliersAuto
          this.filteredSuppliers = this.allAutoSuppliers
          this.isLoading = false
          this.allowPagination = true
        })
      }
    },
    uniqueUsedFamilies() {
      return [...new Set(this.allProductTypes.map(obj => obj.family))]
    },
    createOptionsSctructures(productTypes) {
      var data = null
      for(var i in productTypes) {
        this.allProductTypes.push({ family: productTypes[i].familyName,
                                    collection: productTypes[i].categoriesCollectionName,
                                    category: productTypes[i].categoryName,
                                    type: productTypes[i] })
      }
    },
    selectFamily(familyName) {
      this.isCollection = false
      this.selectedCollection = null
      this.selectedCategory = null
      if(familyName == 'Alimentos e bebidas') {
        this.viewType = 'family-collections'
        this.showCollections = [...new Set(this.allProductTypes.filter(obj => obj.family == familyName).map(obj => obj.collection))]
        if(this.showCollections.length > 1)
          this.showCollections = this.showCollections.sort((a, b) => a.localeCompare(b))
      } else {
        this.viewType = 'collection'
        this.showCategories = [...new Set(this.allProductTypes.filter(obj => obj.family == familyName).map(obj => obj.category))]
        if(this.showCategories.length > 1)
          this.showCategories = this.showCategories.sort((a, b) => a.localeCompare(b))
      }
      this.selectedFamily = familyName
      this.getAllAutoPaginated({ params: this.params, family: this.selectedFamily }).then(() => {
        this.allAutoSuppliers = this.suppliersAuto
        this.filteredSuppliers = this.allAutoSuppliers
        this.isLoading = false
        this.allowPagination = true
      })
    },
    cleanPageAndselectedCollectionOnModal(data) {
      this.userSelectedPage(1)
      this.setCurrentPage(1)
      this.selectedCollectionOnModal(data)
    },
    selectedCollectionOnModal(data) {
      this.isLoading = true
      this.isCollection = true
      this.viewType = 'collection'
      this.showCategories = [...new Set(this.allProductTypes.filter(obj => (obj.collection == data.collection && obj.family == data.family)).map(obj => obj.category))]
      if(this.showCategories.length > 1)
        this.showCategories = this.showCategories.sort((a, b) => a.localeCompare(b))
      this.selectedCollection = data.collection
      this.selectedFamily = data.family
      this.selectedProductType = null
      // var suppliersWithFamily = this.allAutoSuppliers.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash, data.family))
      // this.filteredSuppliers = suppliersWithFamily.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash[data.family], data.collection))

      this.getAllAutoPaginated({ params: this.params, family: this.selectedFamily, collection: this.selectedCollection }).then(() => {
        this.allAutoSuppliers = this.suppliersAuto
        this.filteredSuppliers = this.allAutoSuppliers
        this.isLoading = false
        this.allowPagination = true
      })
    },
    selectedCategoryAllProducts(value) {
      this.isCollection = false
      this.selectedFamily = value.family
      this.selectedCollection = value.collection
      this.selectedCategory = value.category
      this.selectedProductType = null
      this.viewType = 'category-all-products'

      if(this.selectedFamily == 'Alimentos e bebidas') {
        this.showCollections = [...new Set(this.allProductTypes.filter(obj => obj.family == this.selectedFamily).map(obj => obj.collection))]
        if(this.showCollections.length > 1)
          this.showCollections = this.showCollections.sort((a, b) => a.localeCompare(b))
      }

      this.showCategories = [...new Set(this.allProductTypes.filter(obj => (obj.collection == value.collection && obj.family == value.family)).map(obj => obj.category))]
      if(this.showCategories.length > 1)
        this.showCategories = this.showCategories.sort((a, b) => a.localeCompare(b))
      this.showProductTypes = [...new Set(this.allProductTypes.filter(obj => (obj.collection == value.collection && obj.family == value.family && obj.category == value.category)))]
      if(this.showProductTypes.length > 1)
        this.showProductTypes = this.showProductTypes.sort((a, b) => a.type.productType.localeCompare(b.type.productType))
      var result = []
      this.showProductTypes.filter(function(item){
        var i = result.findIndex(x => (x.type.productTypeId == item.type.productTypeId));
        if(i <= -1){
          result.push(item);
        }
        return null;
      })
      this.showProductTypes = result

      this.getAllAutoPaginated({ params: this.params, family: this.selectedFamily, collection: this.selectedCollection, category: this.selectedCategory }).then(() => {
        this.allAutoSuppliers = this.suppliersAuto
        this.filteredSuppliers = this.allAutoSuppliers
        this.isLoading = false
        this.allowPagination = true
      })

      // var suppliersWithFamily = this.allAutoSuppliers.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash, value.family))
      // var suppliersWithCollection = suppliersWithFamily.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash[value.family], value.collection))
      // this.filteredSuppliers = suppliersWithCollection.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash[value.family][value.collection], value.category))
    },
    async selectProductType(productTypeId) {
      this.isCollection = false
      var foundObject = this.allProductTypes.filter(obj => obj.type.productTypeId == productTypeId)
      this.selectedProductType = foundObject.map(obj => obj.type)[0]
      this.selectedFamily = foundObject[0].family
      this.selectedCollection = foundObject[0].collection
      this.selectedCategory = foundObject[0].category
      this.viewType = 'product-type'

      if(this.selectedFamily == 'Alimentos e bebidas') {
        this.showCollections = [...new Set(this.allProductTypes.filter(obj => obj.family == this.selectedFamily).map(obj => obj.collection))]
        if(this.showCollections.length > 1)
          this.showCollections = this.showCollections.sort((a, b) => a.localeCompare(b))
      }
      this.showCategories = [...new Set(this.allProductTypes.filter(obj => (obj.collection == this.selectedCollection && obj.family == this.selectedFamily)).map(obj => obj.category))]
      if(this.showCategories.length > 1)
        this.showCategories = this.showCategories.sort((a, b) => a.localeCompare(b))

      this.showProductTypes = [...new Set(this.allProductTypes.filter(obj => (obj.collection == this.selectedCollection && obj.family == this.selectedFamily && obj.category == this.selectedCategory)))]
      if(this.showProductTypes.length > 1)
        this.showProductTypes = this.showProductTypes.sort((a, b) => a.type.productType.localeCompare(b.type.productType))
      var result = []
      this.showProductTypes.filter(function(item){
        var i = result.findIndex(x => (x.type.productTypeId == item.type.productTypeId));
        if(i <= -1){
          result.push(item);
        }
        return null;
      })
      this.showProductTypes = result

      this.getAllAutoPaginated({ params: this.params, product_type_id: this.selectedProductType.productTypeId }).then(() => {
        this.allAutoSuppliers = this.suppliersAuto
        this.filteredSuppliers = this.allAutoSuppliers
        this.isLoading = false
        this.allowPagination = true
      })

      // var typeObj = this.allProductTypes.filter(obj => obj.type.productTypeId == productTypeId)[0]
      // var suppliersWithFamily = this.allAutoSuppliers.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash, typeObj.family))
      // var suppliersWithCollection = suppliersWithFamily.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash[typeObj.family], typeObj.collection))
      // var suppliersWithCategory = suppliersWithCollection.filter(obj => Object.prototype.hasOwnProperty.call(obj.catalogAsHash[typeObj.family][typeObj.collection], typeObj.category))
      // this.filteredSuppliers = suppliersWithCategory.filter(obj => obj.catalogAsHash[typeObj.family][typeObj.collection][typeObj.category].find(type => type.productTypeId == this.selectedProductType.productTypeId))
    },
    getFamilyIcon(family) {
      switch(family) {
        case 'Alimentos e bebidas':
          return '<img src="' + require(`@/assets/images/maca.svg`) + '" alt="*" width="16">'
        case 'embalagens':
          return '<i class="feather icon-shopping-bag mr-25"></i>'
        case 'limpeza':
          return '<img class="mr-25" src="' + require(`@/assets/images/window-cleaner.svg`) + '" alt="*" width="16">'
        case 'Utensílios':
          return '<i class="fa fa-cutlery mr-25"></i>'
      }
      return null
    },
    scrollXProducts(e) {
      this.$refs['scrollProducts'].scrollLeft += e.deltaY;
    },
    scrollXCategoriesAB(e) {
      this.$refs['scrollCategoriesAB'].scrollLeft += e.deltaY;
    },
    scrollXCategories(e) {
      this.$refs['scrollCategories'].scrollLeft += e.deltaY;
    },
    scrollXCollections(e) {
      this.$refs['scrollCollections'].scrollLeft += e.deltaY;
    },
    runSearch() {
     if (this.keyword != "") {
        this.$router.push({
          path: `/busca/${this.keyword}`,
          params: { keyword: this.keyword },
          query: { tab: 1 },
        });
      }
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
    openFamiliesModal() {
      this.familiesModal = true
      this.btnSelected = true
    },
    updateStoreFamiliesModal(val) {
      this.familiesModal = val
    },
    scrollToTop() {
      this.$refs.generalScroll.scrollTop = 0;
      setTimeout(() => {
        this.topButton = false
      }, 800);
    },
    showTopButton(){
      this.topButton = true
    },
    hasScroll(scroll) {
      if(scroll && scroll.scrollWidth > scroll.clientWidth) {
        return true
      } else
        return false
    },
    addScrollX(scroll, direction) {
      if(scroll)
        scroll.scrollLeft += 50 * direction;
    },
    normalizeString(s) {
      var r = s.toLowerCase();
      r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
      r = r.replace(new RegExp("ç", 'g'),"c");
      r = r.replace(new RegExp("[èéêë]", 'g'),"e");
      r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
      r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
      r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
      return r;
    },
    formatString(string) {
      if(string)
        return this.normalizeString(string).replace(/\s+/g, '-')
      else
        return null
    },
    slugToName(string){
      var aux = string.charAt(0).toUpperCase() + string.slice(1)
      aux = aux.replace(/-/, ' ')
      aux = aux.replace(/-/, ' ')
      return aux
    },
    findKeyEncoded(object, encoded) {
      var aux = object.map(key => ({ original: key, encoded: this.formatString(key) }))
      var found = aux.find(obj => obj.encoded == encoded)
      return found
    },
    clearSearch() {
      this.keyword = ''
    }
  },
  components: {
    SupplierCard,
    SuppliersFamiliesModal,
    VFooter,
  },
};
</script>

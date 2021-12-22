<template>
  <div class="content-wrapper pb-0" :style="$device.isMobile ? 'padding-left: 0 !important;' : ''">
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
    <home-families-modal
      :catalog="catalog"
      :openPopup="familiesModal"
      @update-modal="updateHomeFamiliesModal"
    />
    <store-location-modal
      :openPopup="openLocation"
      @allow-zipcode="allowZipcode"
      @update-modal="updateLocationModal"
    />
    <div v-if="loadResults">
      <div v-if="$device.isMobile == true">
        <div
          class
          style=" background: rgb(245, 246, 247);
                  border-bottom: 1px solid rgb(213, 213, 213);
                  width: 100%;
                  height: 60px;
                  position: fixed;
                  top: 62px;
                  z-index: 999;"
        >
          <div
            class="row"
            style="
                border-top: solid 1px LightGrey;
                padding-top: 5px;
                padding-bottom: 5px;
                justify-content: space-evenly;
                flex-flow: nowrap;
                height: 43px;
              "
          >
            <form
              @submit.prevent="runSearch"
              action
              class="row"
              :style="show ? 'width: 100%' : 'display: none;'"
              style="z-index: 1; height: -webkit-fill-available"
            >
              <i
                class="feather icon-search"
                style="
                    color: black;
                    position: relative;
                    left: 9%;
                    top: 0px;
                    font-size: 2rem;
                    z-index: 2;
                  "
                @click="runSearch()"
              />

              <input
                id="search"
                ref="searchBar"
                type="text"
                placeholder="Buscar em todo o site"
                v-model="keyword"
                autocomplete="on"
                style="
                    padding-left: 80px;
                    padding-right: 300px;
                    position: absolute;
                    height: 40px;
                    font-size: 1.2rem;
                    margin-top: -6px;
                  "
              />
              <i
                class="feather icon-corner-down-left"
                @click="runSearch()"
                style="
                    color: black;
                    position: relative;
                    left: 72%;
                    top: 0px;
                    font-size: 2rem;
                    z-index: 9999;
                  "
              />
              <i
                class="feather icon-x"
                @click="closing()"
                style="
                    color: black;
                    position: relative;
                    left: 75%;
                    top: 0px;
                    font-size: 2rem;
                    z-index: 9999;
                  "
              />
            </form>
            <div class="m-0 pl-1 pr-0" v-if="!show">
              <a @click="storeHome()" href="javascript:void(0)">
                <button
                  type="button"
                  :class="
                      viewType == home
                        ? 'btn btn-outline-primary disabled'
                        : 'btn btn-outline-primary'
                    "
                  style="padding: 7px 7px"
                >
                  <i class="ficon feather icon-home" />
                </button>
              </a>
            </div>

            <button
              @click="openFamiliesModal()"
              type="button"
              class="btn btn-success"
              style=" padding: 0px 15px;
                        background-color: rgb(0, 133, 103) !important;
                        color: white;
                        display: flex;
                        align-items: center;"
            >
              Categorias
              <i style="font-size: x-large;" class="feather icon-chevron-down"></i>
            </button>
            <form
              @submit.prevent="runSearch"
              action
              class
              style="
                    z-index: 1;
                    height: -webkit-fill-available;
                    position: relative;"
            >
              <input
                id="search2"
                type="text"
                placeholder="Buscar..."
                v-model="keyword"
                autocomplete="on"
                class="mr-2"
                style="padding-left: 20px;
                          position: relative;
                          left: 0px;
                          height: 30px;
                          font-size: 1rem;
                          border: 2px solid rgb(12, 182, 149);
                          border-radius: 5px;"
                    :style="$device.isMobile ? 'width: 83%;' : 'width: 600px;'"
                  />
                  <i @click="clearSearch()"
                  class="feather icon-x"
                  style=" color: black;
                          position: absolute;
                          left: 55%;
                          top: 7px;
                          font-size: 1.2rem;
                          z-index: 2;
                          width: 40px;
                        "
              />
              <i
                class="feather icon-search"
                style=" color: white;
                            background: rgb(12, 182, 149);
                            position: absolute;
                            left: 67%;
                            top: 1px;
                            font-size: 1.2rem;
                            z-index: 2;
                            width: 40px;
                            border-radius: 0px 5px 5px 0px;
                            padding: 6px;
                            text-align: center;
                    "
                @click="runSearch()"
              />
            </form>
          </div>
          <div
            v-if="selectedCollection"
            ref="mobileCollectionChips"
            class="row no-wrap"
            style="
                border-top: solid 1px LightGrey;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-left: 17px;
                overflow-x: scroll;
                background-color: #f5f6f7;
              "
          >
            <span
              v-for="(collection, index) in collectionsFromFamily(
                  selectedFamily
                )"
              :key="index"
              :vs-value="index"
              style="flex: 0 0 auto; width: auto"
            >
              <vs-chip v-if="index != selectedCollection" class="chip-mf public-chip p-0 pr-1">
                <a
                  @click="
                      selectedCollectionOnModal({
                        family: selectedFamily,
                        collection: index,
                      })
                    "
                  style
                >{{ index }}</a>
              </vs-chip>
              <vs-chip
                v-if="index == selectedCollection"
                style="margin-left: 5px; background-color: #0cb695"
                class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
              >
                <a
                  @click="
                      selectedCollectionOnModal({
                        family: selectedFamily,
                        collection: index,
                      })
                    "
                  style
                >{{ index }}</a>
              </vs-chip>
            </span>
            <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden">a</vs-chip>
          </div>
          <div
            v-if="selectedCollection || selectedCategory"
            ref="mobileCategoryChips"
            class="row no-wrap"
            style="
                border-top: solid 1px LightGrey;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-left: 17px;
                overflow-x: scroll;
                background-color: #f5f6f7;
              "
          >
            <a
              v-if="selectedCollection"
              style="margin-left: 5px; align-self: center;      white-space: nowrap;"
              class="public-chip text-black font-small-2 font-weight-bold p-0 pr-1"
            >
              <nuxt-link
                style="color: black;"
                :to="{ name: 'cotar-familia', params: { familyName: formatString(selectedFamily) } }"
              >{{ selectedCollection }}</nuxt-link>
            </a>
            <div v-if="selectedCollection" style="border-right: 1px solid DarkGrey; margin: 0 5px"></div>
            <span
              v-for="(category, index) in categoriesFromCollection(
                  selectedFamily,
                  selectedCollection
                )"
              :key="index"
              :vs-value="index"
              style="flex: 0 0 auto; width: auto"
            >
              <vs-chip
                v-if="index == selectedCategory"
                style="flex: 0 0 auto; width: auto; background-color: #5ce9c6"
                class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
              >
                <a
                  @click="
                      selectedCollectionOnModal({
                        family: selectedFamily,
                        collection: selectedCollection,
                      })
                    "
                  style
                >{{ selectedCategory }}</a>
              </vs-chip>
              <vs-chip v-if="index != selectedCategory" class="chip-mf public-chip p-0 pr-1">
                <nuxt-link
                  style="color: inherit;"
                  :to="{ name: 'cotar-categoria', params: { familyName: formatString(selectedFamily), categoryName: formatString(index) } }"
                >{{ index }}</nuxt-link>
              </vs-chip>
            </span>
            <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden">a</vs-chip>
          </div>
          <div
            v-if="
                viewType == 'collection' &&
                selectedFamily != 'Alimentos e bebidas'
              "
            ref="mobileFamilyChips"
            class="row no-wrap"
            style="
                border-top: solid 1px LightGrey;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-left: 17px;
                overflow-x: scroll;
                background-color: #f5f6f7;
              "
          >
            <span
              v-for="(category, index) in categoriesFromCollection(
                  selectedFamily,
                  ''
                )"
              :key="index"
              :vs-value="index"
              style="flex: 0 0 auto; width: auto"
            >
              <vs-chip v-if="index != selectedCategory" class="chip-mf public-chip p-0 pr-1">
                <nuxt-link
                  style="color: inherit;"
                  :to="{ name: 'cotar-categoria', params: { familyName: formatString(selectedFamily), categoryName: formatString(index) } }"
                >{{ index }}</nuxt-link>
              </vs-chip>
            </span>
          </div>
          <div
            v-if="viewType == 'category-all-products'"
            class="row"
            style="
                border-top: solid 1px LightGrey;
                padding-top: 2px;
                padding-bottom: 2px;
                padding-left: 15px;
                background-color: rgb(245, 246, 247);
              "
          >
            <div class="col-7 p-0 m-0">
              <h5 style="margin-top: 10px; margin-left: 3px">{{ selectedCategory }}</h5>
            </div>
            <div class="col-5 p-0 m-0 pr-1">
              <b-form-select
                v-model="navigateToProduct"
                @input="selectProductType(navigateToProduct)"
                :options="
                    productsFromCategory(
                      selectedCategory,
                      selectedFamily,
                      selectedCollection
                    )
                  "
              ></b-form-select>
            </div>
          </div>
          <div
            v-if="viewType == 'product-type'"
            class="row pr-1"
            style="border-top: solid 1px LightGrey; padding-left: 10px; background-color: lightgrey;"
          >
            <div class="col-8 m-0 pr-0 pt-1 pl-1" style="padding-bottom: 8px">
              <h5 class style="margin: 0">
                <nuxt-link
                  v-if="selectedFamily != 'Alimentos e bebidas'"
                  style="color: black"
                  :to="{ name: 'cotar-categoria', params: { familyName: formatString(selectedFamily), categoryName: formatString(selectedCategory) } }"
                >
                  <i class="feather icon-chevron-left"></i>
                </nuxt-link>
                <nuxt-link
                  v-else
                  style="color: black"
                  :to="{ name: 'cotar-categoria', params: { familyName: formatString(selectedFamily), categoryName: formatString(selectedCategory) } }"
                >
                  <i class="feather icon-chevron-left"></i>
                </nuxt-link>
                {{ selectedProductType.productType }}
              </h5>
            </div>
            <div class="col-4 m-0 p-0 float-right">
              <div
                class="d-flex justify-content-end"
                v-if="
                    productsFromType(selectedProductType).length > 1 ||
                    hasFilters(selectedProductType)
                  "
              >
                <div
                  style="
                      padding: 0.75rem 0.35rem;
                      background-color: white;
                      border-radius: 0.5rem;
                    "
                >
                  <a
                    style="
                        border-bottom: 1px solid grey;
                        padding-bottom: 1px;
                        color: grey;
                        margin-right: 10px;
                      "
                    class="font-small-1"
                    @click="clearAllFilters()"
                    v-if="hasFilters(selectedProductType)"
                  >Limpar</a>
                  <span class="dot" v-if="hasFilters(selectedProductType)"></span>
                  <a
                    style="
                        border-bottom: 1px solid #007bff;
                        padding-bottom: 1px;
                        color: #007bff;
                      "
                    class="font-small-3"
                    @click="clickSidebar(selectedProductType)"
                  >Filtrar</a>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="viewType == 'sale'"
            class="row pr-1"
            style="border-top: solid 1px LightGrey; padding-left: 10px"
          >
            <div class="col-12 m-0 pr-0 pt-1 pl-1" style="padding-bottom: 8px">
              <h5 class style="margin: 0">Ofertas</h5>
            </div>
          </div>
        </div>
      </div>
      <div
        style="position: fixed;
                  top: 60px;
                  z-index: 999;
                  left: 30px;
                  width: -webkit-fill-available;"
        v-else
      >
        <div
          class="row"
          style="background: rgb(245, 246, 247);
                justify-content: space-between;
                padding-left: 60px;
          "
        >
          <div class="row" style="padding: 15px 20px">
            <a id="store-home-button" @click="goToHome()" href="javascript:void(0)">
              <button
                type="button"
                class="btn btn-outline-primary"
                style="padding: 7px 7px; margin-right: 10px;"
              >
                <i class="ficon feather icon-home" />
              </button>
            </a>
            <nuxt-link
              :to="{
                  name: 'cotar-familia',
                  params: {
                    familyName: 'alimentos-e-bebidas',
                  },
                }"
            >
              <vs-chip class="chip-mf public-chip p-0 pr-1">
                <span style="margin-right: 4px;" v-html="getFamilyIcon('Alimentos e bebidas')"></span>Alimentos e bebidas
              </vs-chip>
            </nuxt-link>
            <nuxt-link
              :to="{
                  name: 'cotar-familia',
                  params: {
                    familyName: 'embalagens',
                  },
                }"
            >
              <vs-chip class="chip-mf public-chip p-0 pr-1">
                <span style="margin-right: 4px;" v-html="getFamilyIcon('Embalagens')"></span>Embalagens
              </vs-chip>
            </nuxt-link>
            <nuxt-link
              :to="{
                  name: 'cotar-familia',
                  params: {
                    familyName: 'limpeza',
                  },
                }"
            >
              <vs-chip class="chip-mf public-chip p-0 pr-1">
                <span style="margin-right: 4px;" v-html="getFamilyIcon('Limpeza')"></span>Limpeza
              </vs-chip>
            </nuxt-link>
            <nuxt-link
              :to="{
                  name: 'cotar-familia',
                  params: {
                    familyName: 'utensilios',
                  },
                }"
            >
              <vs-chip class="chip-mf public-chip p-0 pr-1">
                <span style="margin-right: 4px;" v-html="getFamilyIcon('Utensílios')"></span>Utensílios
              </vs-chip>
            </nuxt-link>
          </div>
          <div class="p-1">
            <div class="m-0 pl-0 pr-1" style="flex: 0 0 300px; margin-left: auto !important">
              <form
                @submit.prevent="runSearch"
                action
                class
                style="
                    width: 100%;
                    z-index: 1;
                    height: -webkit-fill-available;
                    position: relative;
                  "
              >
                <input
                  id="search2"
                  type="text"
                  placeholder="Buscar em todo o site"
                  v-model="keyword"
                  autocomplete="on"
                  class="mr-2"
                  style="padding-left: 20px;
                          position: relative;
                          left: 0px;
                          height: 30px;
                          font-size: 1rem;
                          border: 2px solid rgb(12, 182, 149);
                          border-radius: 5px;"
                  :style="$device.isMobile ? 'width: 90%;' : 'width: 600px;'"
                />
                <i
                  class="feather icon-x"
                  @click="clearSearch()"
                  style="color: black;
                         position: absolute;
                         left: 530px;
                         top: 7px;
                         font-size: 1.2rem;
                         z-index: 2;
                         width: 40px;
                        "
                />
                <i
                  class="feather icon-search"
                  style="color: white;
                      background: rgb(12, 182, 149);
                      position: absolute;
                      left: 560px;
                      top: 1px;
                      font-size: 1.2rem;
                      z-index: 2;
                      width: 40px;
                      border-radius: 0px 5px 5px 0px;
                      padding: 6px;
                      text-align: center;
                    "
                  @click="runSearch()"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        class="card-body px-0 py-0"
        :style="$device.isMobile ? 'position: fixed; top: 120px; left: 0px; z-index: 999; width: -webkit-fill-available;' : 'position: fixed; top: 120px; left: 30px; z-index: 999; width: -webkit-fill-available;'"
      >
        <div
          class="card-header py-1 border-bottom"
          :style="$device.isMobile ? 'background: rgb(245, 246, 247)' : 'padding-left: 70px; background: rgb(245, 246, 247);'"
        >
          <h4 class="card-title font-medium mb-50 font-weight-bold color-black w-100">
            Resultados para
            <span class="color-mf-verde">{{ $route.params.keyword }}</span>
          </h4>
        </div>
      </div>
      <b-tabs v-model="tab">
        <b-tab>
          <template v-slot:title>
            <img
              :src="require(`@/assets/images/delivery-box-tab.png`)"
              alt="*"
              width="16"
              height="16"
            />
            <strong style="padding-left: 10px;">Produtos</strong>
          </template>
          <div class="content-body" style="    padding-top: 180px;">
            <div class="row" ref="productsWindow">
              <div class="col-xl-12 col-12">
                <div v-if="totalResults > 0" ref="content">
                  <span v-for="family in searchedFamilies" :key="family.family.id">
                    <h4
                      v-if="familyHasProducts(family.family.name)"
                      style="font-size: 26px;
                              font-weight: 300;
                              margin: 0 0 0 8px;
                              color: #666;"
                    >
                      <i class="fa fa-lemon-o ml-50 mr-75"></i>
                      {{ family.family.name }}
                    </h4>
                    <div
                      class="row mt-1"
                      style="margin-left: 10px;"
                      v-for="(chunk, index) in productChunks(productsFromFamily(family.family.name))"
                      :key="index"
                    >
                      <span
                        v-for="product in chunk"
                        :key="product.id"
                        style="width: 170px"
                      >
                        <div style="padding-left: 5px">
                          <h6 style="margin-bottom: 10px">
                            <a
                              @click="clickedProductTitle(product)"
                              style="text-decoration: underline"
                            >{{ product.productTypeName }}</a>
                          </h6>
                        </div>
                        <div class="card font-small-3 mb-1" style="margin-right: 10px">
                          <div class="card-body pl-1 pr-1 pt-0 pb-0">
                            <product-card :product="product"/>
                          </div>
                        </div>
                      </span>
                      <vs-divider class="mb-1" />
                    </div>
                  </span>
                </div>
                <div class="ml-3" v-else>
                  <h3>Não há produtos que correspondam a sua busca.</h3>
                  <ul class="ml-2">
                    <li>Você escreveu o termo corretamente?</li>
                    <li>Que tal usar menos palavras?</li>
                    <li>
                      Você pode
                      <nuxt-link
                        :to="{ path: '/' }"
                        style="color: 0391D1; text-decoration: underline;"
                      >navegar pelo site</nuxt-link>para encontrar o que procura
                    </li>
                  </ul>
                </div>
              </div>
              <!-- <div class="col-xl-3 col-12" style="padding-left: 20px;">
                <div class="card font-small-3">
                  <span
                    class="search-card-hide"
                    v-for="family in searchedFamilies"
                    :key="family.family.id"
                  >
                    <h4 class="px-2 mb-75 pt-1">{{ family.family.name }}</h4>
                    <family-search-list
                      :categoriesWithCollection="family.with_collection"
                      :categoriesWithoutCollection="family.without_collection"
                      :keyword="keyword"
                      :category="category"
                    />
                  </span>
                </div>
              </div> -->
            </div>
            <div v-if="currentPage < totalPages" style="text-align: center; margin-bottom: 20px;">
              <button class="btn btn-outline-primary" @click="scroll()">Mostrar mais</button>
            </div>
          </div>
        </b-tab>
        <b-tab>
          <template v-slot:title>
            <img :src="require(`@/assets/images/store-tab.png`)" alt="*" width="16" height="16" />
            <strong style="padding-left: 10px;">Lojas</strong>
          </template>
          <div v-if="this.filteredSuppliers.length > 0"
            style="display: flex;
                  flex-wrap: wrap;
                  flex-direction: row;
                  padding-top: 180px;"
            :style="$device.isMobile ? 'justify-content: center;' : ''"
          >
            <div v-for="supplier in filteredSuppliers" v-bind:key="supplier.id">
              <supplier-card :supplier="supplier" />
            </div>
          </div>
          <div style=" padding-top: 180px;" class="ml-3" v-else>
                  <h3>Não há fornecedores que correspondam a sua busca.</h3>
                  <ul class="ml-2">
                    <li>Você escreveu o termo corretamente?</li>
                    <li>Que tal usar menos palavras?</li>
                    <li>
                      Você pode
                      <nuxt-link
                        :to="{ path: '/' }"
                        style="color: 0391D1; text-decoration: underline;"
                      >navegar pelo site</nuxt-link>para encontrar o que procura
                    </li>
                  </ul>
                </div>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<style>
.nav.nav-tabs .nav-item .nav-link {
  color: gray;
  font-size: 1.2rem;
  border: none;
  min-width: auto;
  font-weight: 600;
  padding: 1rem 1rem;
  border-radius: 0;
  filter: grayscale(1);
}
.nav.nav-tabs .nav-item .nav-link.active {
  border: none;
  position: relative;
  color: #0391d1;
  transition: all 0.2s ease;
  background-color: transparent;
  filter: none !important;
}
.nav.nav-tabs .nav-item .nav-link.active:after {
  content: attr(data-before);
  height: 4px;
  border-radius: 2px;
  width: 100%;
  left: 0;
  position: absolute;
  bottom: 0;
  top: 100%;
  background: #0391d1 !important;
  box-shadow: 0 0 8px 0 rgb(115 103 240 / 50%) !important;
  transform: translateY(0px);
  transition: all 0.2s linear;
}

@media only screen and (max-width: 1199px) {
  .search-card-hide {
    display: none;
  }
  .nav.nav-tabs {
    border: none;
    margin-bottom: 1rem;
    border-radius: 0;
    position: fixed;
    top: 170px;
    z-index: 999;
    width: 100%;
    left: 0px;
    padding-left: 60px;
    background: rgb(245, 246, 247);
    justify-content: flex-start !important;
  }
}

@media only screen and (min-width: 1200px) {
  .search-card-show {
    display: inline-block;
  }
  .nav.nav-tabs {
    border: none;
    margin-bottom: 1rem;
    border-radius: 0;
    position: fixed;
    top: 170px;
    z-index: 999;
    width: 100%;
    left: 30px;
    padding-left: 60px;
    background: rgb(245, 246, 247);
    justify-content: flex-start !important;
  }
}
</style>

<script>
import SuppliersService from "@/services/suppliers";
import SupplierCard from "@/components/suppliers/SupplierCard";
import FamilySearchList from "@/components/families/FamilySearchList";
import ProductCard from "@/components/products/ProductCard";
import HomeFamiliesModal from "@/components/users/HomeFamiliesModal";
import StoreLocationModal from "@/components/users/StoreLocationModal";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Search",
  data() {
    return {
      keyword: this.$route.params.keyword,
      category: this.$route.query.category,
      productsLoaded: false,
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoadingProducts: false,
      isLoadingCategories: false,
      allAutoSuppliers: [],
      filteredSuppliers: [],
      tab: 0,
      mobileBrowser: false,
      familiesModal: false,
      loadResults: false,
      openLocation: false,
    };
  },
  created() {

  },
  mounted() {
    this.tab = parseInt(this.$route.query.tab)
    this.getAllCatalog()
    this.clearProducts()
    this.userSelectedPage(1)
    this.setCurrentPage(1)

    if(this.$auth.loggedIn || (this.allowEntrance && this.allowEntrance != 'false')) {
      this.loadPage()
    } else {
      this.openLocation = true
      this.loadResults = false
    }
    setTimeout(() => {
      this.changeTab()
    }, 1200);
  },
  beforeRouteLeave(to, from, next) {
    this.userSelectedPage(1);
    this.setCurrentPage(1);
    next();
  },
  watch: {
    "$route.params.keyword": function (keyword) {
      this.keyword = keyword;
      this.productsLoaded = false;
      this.isLoadingProducts = true;
      this.isLoadingCategories = true;
      this.clearProducts();
      this.userSelectedPage(1);
      this.setCurrentPage(1);
      this.getSearchWithCategories(this.keyword).then(() => {
        this.isLoadingCategories = false;
      });
      this.searchProducts({ keyword: this.keyword, category: null }).then(
        () => {
          this.productsLoaded = true;
          this.isLoadingProducts = false;
        }
      );
    },
    "$route.query.category": function (categoryId) {
      this.category = categoryId;
      this.productsLoaded = false;
      this.isLoadingProducts = true;
      this.clearProducts();
      this.userSelectedPage(1);
      this.setCurrentPage(1);
      this.searchProducts({ keyword: this.keyword, category: categoryId }).then(
        () => {
          this.productsLoaded = true;
          this.isLoadingProducts = false;
        }
      );
    },
    currentPage(pageNumber) {
      this.productsLoaded = false;
      this.isLoadingProducts = true;
      this.userSelectedPage(pageNumber);
      this.searchProducts({
        keyword: this.keyword,
        category: this.category,
      }).then(() => {
        this.productsLoaded = true;
        this.isLoadingProducts = false;
      });
    },
  },

  computed: {
    ...mapState("users/products", ["catalog"]),
    ...mapState("pagination", ["totalPages"]),
    ...mapState("families", ["family", "searchedFamilies"]),
    ...mapState("products", ["products"]),
    ...mapGetters("navigationFilters", [
      "params",
      "allowEntrance"
    ]),
    ...mapGetters("families", [
      "chunckedProductsFromFamily",
      "categoriesWithCollection",
      "categoriesWithoutCollection",
    ]),

    isLoading() {
      return this.isLoadingProducts || this.isLoadingCategories;
    },

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
      } else if (window.innerWidth >= 600 && window.innerWidth < 800) {
        return 3;
      } else {
        return 2;
      }
    },

    widthRatio() {
      return (window.innerWidth / this.maxPerScreen / window.innerWidth) * 90;
    },
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage;
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value);
      },
    },
    totalResults() {
      let total = 0
      // for (let i = 0; i < this.searchedFamilies.length; i++) {
      //   let family = this.searchedFamilies[i];
      //   for (var key in family.with_collection) {
      //     let collection = family.with_collection[key];
      //     for (let j = 0; j < collection.length; j++) {
      //       total += collection[j].count;
      //     }
      //   }
      //   for (let k = 0; k < family.without_collection.length; k++) {
      //     total += family.without_collection[k].count;
      //   }
      // }
      return this.searchedFamilies.length
    },
  },
  methods: {
    ...mapActions("users/products", ["getAllCatalog"]),
    ...mapActions("families", ["getSearchWithCategories"]),
    ...mapActions("products", ["searchProducts", "clearProducts"]),
    ...mapActions("pagination", ["userSelectedPage", "setCurrentPage"]),
    loadPage() {
      this.loadResults = true
      this.productsLoaded = false;
      this.isLoadingProducts = true;
      this.isLoadingCategories = true;
      this.getSearchWithCategories(this.keyword).then(() => {
        this.isLoadingCategories = false;
      });
      this.searchProducts({
        keyword: this.keyword,
        category: this.category,
      }).then(() => {
        this.productsLoaded = true;
        this.isLoadingProducts = false;
        //this.scroll();
      });
      SuppliersService.getAllAuto(this.params).then((response) => {
        this.allAutoSuppliers = response.data;
        SuppliersService.searchAutomaticCatalog(this.keyword).then((response) => {
          this.runSupplierSearch();
        });
      });
    },
    productsFromFamily(name) {
      return this.products.filter((product) => product.familyName == name);
    },
    familyHasProducts(name) {
      return this.products.find((product) => product.familyName == name);
    },
    productChunks(products) {
      var result = [];
      var data = products;
      for (var i = 0; i < data.length; i++) {
        if (i % this.maxPerScreen == 0) result.push([]);
        result[Math.floor(i / this.maxPerScreen)].push(data[i]);
      }
      return result;
    },
    scroll() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    runSupplierSearch() {
      this.keywordAux = this.keyword;
      SuppliersService.searchAutomaticCatalog(this.keyword).then((response) => {
        this.filteredSuppliers = this.allAutoSuppliers.filter((obj) =>
          response.data.includes(obj.id)
        );
      });
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
    openFamiliesModal() {
      this.familiesModal = true;
    },
    updateHomeFamiliesModal(val) {
      this.familiesModal = val;
    },
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
    goToHome() {
      this.$router.push({ path: "/" });
    },
    runSearch() {
      if (this.keyword != "") {
        this.$router.push({
          path: `/busca/${this.keyword}`,
          params: { keyword: this.keyword },
          query: { tab: this.tab },
        });
      }
    },
    scrollToTop() {
      this.$refs.productsWindow.scrollTop = 0;
    },
    getFamilyIcon(family) {
      switch (family) {
        case "Alimentos e bebidas":
          return (
            '<img src="' +
            require(`@/assets/images/maca.svg`) +
            '" alt="*" width="16">'
          );
        case "Embalagens":
          return '<i class="feather icon-shopping-bag mr-25"></i>';
        case "Limpeza":
          return (
            '<img class="mr-25" src="' +
            require(`@/assets/images/window-cleaner.svg`) +
            '" alt="*" width="16">'
          );
        case "Utensílios":
          return '<i class="fa fa-cutlery mr-25"></i>';
      }
      return null;
    },
    clearSearch() {
      this.keyword = ''
    },
    clickedProductTitle(product) {
      this.$router.push({ name: 'cotar-produto',
                          params: {
                            familyName: this.formatString(product.familyName),
                            categoryName: this.formatString(product.categoryName),
                            productTypeName: this.formatString(product.productTypeName)
                          } })
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
      return this.normalizeString(string).replace(/\s+/g, '-')
    },
    allowZipcode() {
      this.loadPage()
    },
    updateLocationModal(val) {
      this.openLocation = val;
    },
    changeTab(){
      if(this.totalResults == 0 && this.filteredSuppliers.length > 0)
        this.tab = 1
    }
  },
  components: {
    // FamilySearchList,
    ProductCard,
    SupplierCard,
    HomeFamiliesModal,
    StoreLocationModal,
  },
};
</script>

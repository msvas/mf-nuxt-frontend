<template>
  <div>
    <span>
      <span id="hidden-element"></span>
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
      <NavigationModal
        :viewType="viewType"
        :catalog="catalog"
        :selectedFamily="selectedFamily"
        :selectedCategory="selectedCategory"
        :selectedCollection="selectedCollection"
        :selectedProductType="selectedProductType"
        :selectedViewType="selectedViewType"
        :openPopup="navigationsModal"
        :tab="tab"
        @update-nav-modal="updateNavigationModal"
        @selected-category="selectedCategoryOnModal"
        @selected-collection="selectedCollectionOnModal"
        @selected-product-type="selectProductType"
      />
      <form
        @submit.prevent="runSearch"
        action
        class="row"
        style="z-index: 1; width: 100%; top: 70px; position: absolute;"
        :class="show ? '' : 'd-none'"
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
      <div
        v-if="mobileBrowser"
        class="content-wrapper pb-0 pt-0"
        style="max-height: calc(100vh - 5em); overflow-y: hidden; overflow-x: hidden; padding-right: 3px !important; padding-left: 3px !important; background: #ebebeb;"
      >
        <div
          class="content-body p-0 m-0"
          ref="generalScroll"
          v-on:scroll.passive="showTopButton()"
          style="max-height: calc(100vh - 7.7em); overflow-x: hidden; overflow-y: scroll; scroll-behavior: smooth; background: #ebebeb;"
        >
            <div class style="background: #EDEDED; border-bottom: solid 1px #D5D5D5;">
              <div class="navigations-container"
                  style="justify-content: space-between;"
              >
                <vs-chip class="chip-mf">
                  <a  @click="openNavigationsModal('family-collections', selectedFamily)">
                    Todos os produtos
                    <i class="feather icon-chevron-down"></i>
                  </a>
                </vs-chip>
                <vs-chip style="color: #D11B6D !important; border-color: #D11B6D !important;" class="chip-mf">
                  <a  @click="goToOffers()">
                    Ofertas
                  </a>
                </vs-chip>
                <vs-chip style="border-color: #0CB695 !important; background-color: #0CB695 !important;" class="chip-mf">
                  <a  @click="closing()">
                    <i class="feather icon-search"></i>
                  </a>
                </vs-chip>
              </div>
              <div v-if="selectedFamily"
                ref="navigations-container-scroll"
                class="navigations-container no-scrollbar"
                style="overflow-x: scroll;"
              >
                <vs-chip v-if="selectedFamily"
                    :class="selectedCollection || selectedCategory ? 'chip-mf' : 'chip-mf-selected'"
                  >
                    <a v-if="selectedFamily == 'Alimentos e bebidas' " @click="openNavigationsModal('family-collections', selectedFamily)" :style="selectedFamily ? 'color: #008567;' : ''">
                      {{familyNameAbreviation(selectedFamily)}}
                      <span v-if="!selectedCollection && selectedCollection != ''">(tudo)</span>
                      <i class="feather icon-chevron-down"></i>
                    </a>
                    <a v-else @click="openNavigationsModal('collection', selectedFamily)">
                      {{familyNameAbreviation(selectedFamily)}}
                      <span v-if="!selectedCollection && selectedCollection != ''">(tudo)</span>
                      <i class="feather icon-chevron-down"></i>
                    </a>
                  </vs-chip>

                <span
                  v-for="(collection, index) in collectionsFromFamily(selectedFamily)"
                  :key="index"
                  :vs-value="index"
                  style="flex: 0 0 auto; width: auto;"
                >
                  <vs-chip
                    v-if="index == selectedCollection && selectedCollection != '' "
                    :class="selectedCategory ? 'chip-mf' : 'chip-mf-selected'"
                  >
                    <a @click="openNavigationsModal('collection', selectedFamily)" :style="selectedCollection ? 'color: #008567;' : ''">
                      {{ index }}
                      <span v-if="!selectedCategory && selectedCollection">(tudo)</span>
                      <i class="feather icon-chevron-down"></i>
                    </a>
                  </vs-chip>
                </span>
                <span v-for="(category, index) in categoriesFromCollection(selectedFamily, selectedCollection)"
                  :key="index"
                  :vs-value="index"
                  style="flex: 0 0 auto; width: auto;"
                >
                  <vs-chip
                    v-if="index == selectedCategory"
                    :class="selectedProductType? 'chip-mf' : 'chip-mf-selected'"
                  >
                    <a @click="openNavigationsModal('category-all-products', selectedFamily)" :style="selectedCategory ? 'color: #008567;' : ''">
                      {{ selectedCategory }}
                      <span v-if="!selectedProductType && selectedCategory">(tudo)</span>
                      <i class="feather icon-chevron-down"></i>
                    </a>
                  </vs-chip>
                </span>

                <span v-for="type in productsFromCategory(selectedCategory, selectedFamily, selectedCollection, true)"
                :key="type.text"
                :vs-value="type.text"
                style="flex: 0 0 auto; width: auto;"
              >
                <vs-chip
                  v-if="selectedProductType && type.value == selectedProductType.productTypeId"
                  class="chip-mf-selected"
                >
                  <a  @click="openNavigationsModal('product-type', selectedFamily)">
                    {{ type.text }}
                    <i class="feather icon-chevron-down"></i>
                  </a>
                </vs-chip>
              </span>
              </div>
              <div v-if="viewType == 'product-type'"
                class="navigations-container"
                style="justify-content: flex-end;"
              >

                  <div
                    class="pr-2"
                    v-if="productsFromType(selectedProductType).length > 1 || hasFilters(selectedProductType)"
                  >
                    <div
                      style="padding: 0.75rem 0.35rem; background-color: white; border-radius: 0.5rem;"
                    >
                      <a
                        style="border-bottom: 1px solid grey; padding-bottom: 1px; color: grey; margin-right: 10px;"
                        class="font-small-1"
                        @click="clearAllFilters()"
                        v-if="hasFilters(selectedProductType)"
                      >Limpar</a>
                      <span class="dot" v-if="hasFilters(selectedProductType)"></span>
                      <a
                        style="border-bottom: 1px solid #007bff; padding-bottom: 1px; color: #007bff;"
                        class="font-small-3"
                        @click="clickSidebar(selectedProductType)"
                      >Filtrar</a>
                    </div>
                  </div>

              </div>
              <div
                v-if="viewType == 'sale'"
                class="row pr-1"
                style="border-top: solid 1px LightGrey; padding-left: 10px;"
              >
                <div class="col-12 m-0 pr-0 pt-1 pl-1" style="padding-bottom: 8px;">
                  <h5 class style="margin: 0;">Ofertas</h5>
                </div>
              </div>
            </div>
          <div v-if="catalog" class="row p-0 m-0" style="display: contents">
            <div class="col-12 p-0 m-0" style id="products">
              <div>
                <div class="vh-100" ref="desktopScroll">
                  <div class="mb-2">
                    <div></div>
                    <div>
                      <!-- visao por familia -->
                      <div v-if="viewType == 'family' && !isLoading" style>
                        <div
                          v-for="(family, index) in catalog"
                          :key="'family-' + index"
                          style="background-color: #fbfdfe; overflow-x: scroll"
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="position: sticky; left: 0; background-color: #ebebeb;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1 pb-1">
                              <h4 class style="margin: 0; padding-left: 5px">{{ index }}</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1 pb-1">
                              <nuxt-link
                                v-if="index == 'Alimentos e bebidas'"
                                :to="{ name: 'cotar-familia', params: { familyName: formatString(index) } }"
                              >Ver tudo</nuxt-link>
                              <nuxt-link
                                v-else
                                :to="{ name: 'cotar-familia', params: { familyName: formatString(index) } }"
                              >Ver tudo</nuxt-link>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="
                              'margin-top: 10px; overflow-x: scroll; width: ' +
                              calcWidth(
                                productsFromFamily(index).slice(0, 6).length
                              ) +
                              'px;'
                            "
                          >
                            <span
                              v-for="product in productsFromFamily(index).slice(0,6)"
                              :key="'product' + product.id"
                              style="width: 170px"
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
                              <div class="card font-small-3 mb-1" style="margin-right: 10px">
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <ProductCard :product="product" />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="productsFromFamily(index).length >= 6"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <nuxt-link
                                      v-if="index == 'Alimentos e bebidas'"
                                      :to="{ name: 'cotar-familia', params: { familyName: formatString(index) } }"
                                      class="btn btn-primary w-100"
                                      style="
                                        padding-left: 3px;
                                        padding-right: 3px;
                                      "
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </nuxt-link>
                                    <nuxt-link
                                      v-else
                                      :to="{ name: 'cotar-familia', params: { familyName: formatString(index) } }"
                                      class="btn btn-primary w-100"
                                      style="
                                        padding-left: 3px;
                                        padding-right: 3px;
                                      "
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </nuxt-link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <v-footer
                          :class="this.mobileBrowser == true ? 'mobile' : 'desktop' "
                          style="margin-top:100px;"
                        />
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao da familia alim e bebidas -->
                      <div v-if="viewType == 'family-collections'" ref="familyScroll">
                        <div ref="familyCollections">
                          <div class="mb-4"
                            v-for="collection in collectionProducts"
                            :key="'collection-' + collection.collection"
                            style="background-color: #ebebeb; overflow-x: scroll;"
                          >
                            <div
                              class="row mt-1 mb-0 m-0"
                              style="position: sticky; left: 0; background-color: ebebeb;"
                            >
                              <div class="m-0 p-0 pt-1 pb-1">
                                <h4
                                  class
                                  style="font-size: 26px; font-weight: 300; margin: 0 0 0 8px; color: #666;"
                                >{{ collection.collection }}</h4>
                              </div>
                              <div class="pl-2 m-0 p-0 pt-2 pb-1">
                                <a
                                  href="javascript:void(0)"
                                  @click="
                                    selectedCollectionOnModal({
                                      family: selectedFamily,
                                      collection: collection.collection,
                                    })
                                  "
                                >Ver tudo</a>
                              </div>
                            </div>
                            <div
                              class="row pl-1 "
                              :style="
                                'margin-top: 10px; overflow-x: scroll; width: ' +
                                calcWidth(
                                  collection.products.slice(0, 6).length
                                ) +
                                'px;'
                              "
                            >
                              <span
                                v-for="product in collection.products.slice(
                                  0,
                                  6
                                )"
                                :key="'product' + product.id"
                                style="width: 170px"
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
                                <div class="card font-small-3 mb-1" style="margin-right: 10px">
                                  <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                    <ProductCard :product="product" />
                                  </div>
                                </div>
                              </span>
                              <div
                                class="card font-small-3"
                                v-if="collection.products.length >= 6"
                                style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                              >
                                <div class="card-body p-1">
                                  <div class="row">
                                    <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                    <div class="col-12 mt-1">
                                      <button
                                        @click="
                                          selectedCollectionOnModal({
                                            family: selectedFamily,
                                            collection: collection.collection,
                                          })
                                        "
                                        type="button"
                                        class="btn btn-primary w-100"
                                        style="padding-left: 3px; padding-right: 3px;"
                                      >
                                        <span class="font-medium-1 align-middle">Ver tudo</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            v-if="isLoading"
                            class="d-flex justify-content-center"
                            style="margin-top: 50px;"
                          >
                            <div
                              class="spinner-border text-primary"
                              style="width: 3rem; height: 3rem;"
                              role="status"
                            >
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                          <v-footer
                            :class="this.mobileBrowser == true ? 'mobile' : 'desktop' "
                            style="margin-top:100px;"
                          />
                          <div class="mt-1 mb-1"></div>
                        </div>
                      </div>
                      <!-- visao por colecao -->
                      <div
                        v-if="viewType == 'collection'"
                        ref="collectionScroll"
                        style="padding-bottom: 5em;"
                      >
                        <div ref="collectionCategories">
                          <div class="mb-4"
                            v-for="category in categoryProducts"
                            :key="'category-' + category.category"
                            style="background-color: #ebebeb"
                          >
                            <div
                              class="row mt-1 mb-1 m-0"
                              style="background-color: #ebebeb;"
                            >
                              <div class="pl-2 m-0 p-0 pt-1 pb-1">
                                <h4
                                  class
                                  style="font-size: 26px; font-weight: 300; margin: 0 0 0 8px; color: #666;"
                                >{{ category.category }}</h4>
                              </div>
                              <div class="pl-2 m-0 p-0 pt-2 pb-1">
                                <nuxt-link
                                  v-if="selectedFamily == 'Alimentos e bebidas'"
                                  style="color: inherit;"
                                  :to="{ name: 'cotar-categoria', params: { familyName: formatString(selectedFamily), categoryName: formatString(category.category) } }"
                                >Ver tudo</nuxt-link>
                                <nuxt-link
                                  v-else
                                  style="color: inherit;"
                                  :to="{ name: 'cotar-categoria', params: { familyName: formatString(selectedFamily), categoryName: formatString(category.category) } }"
                                >Ver tudo</nuxt-link>
                              </div>
                            </div>
                            <div
                              class="row justify-content-center pl-1"
                              style="overflow-x: hidden; margin-top: 10px"
                            >
                              <div class="col-12 p-0 m-0">
                                <div
                                  class="row justify-content-center"
                                  style="margin-top: 10px; overflow-x: hidden"
                                >
                                  <span
                                    v-for="product in category.products.slice(
                                      0,
                                      12
                                    )"
                                    :key="'product' + product.id"
                                    style="width: 170px"
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
                                    <div class="card font-small-3 mb-1" style="margin-right: 10px">
                                      <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                        <ProductCard :product="product" />
                                      </div>
                                    </div>
                                  </span>
                                  <div
                                    class="card font-small-3"
                                    v-if="category.products.length >= 12"
                                    style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                                  >
                                    <div class="card-body p-1">
                                      <div class="row">
                                        <div
                                          class="col-12 text-center"
                                        >Veja mais produtos deste tipo.</div>
                                        <div class="col-12 mt-1">
                                          <nuxt-link
                                            v-if="
                                              selectedFamily ==
                                              'Alimentos e bebidas'
                                            "
                                            :to="{ name: 'cotar-categoria', params: { familyName: formatString(selectedFamily), categoryName: formatString(category.category) } }"
                                            class="btn btn-primary w-100"
                                            style="padding-left: 3px; padding-right: 3px;"
                                          >
                                            <span class="font-medium-1 align-middle">Ver tudo</span>
                                          </nuxt-link>
                                          <nuxt-link
                                            v-else
                                            :to="{ name: 'cotar-categoria', params: { familyName: formatString(selectedFamily), categoryName: formatString(category.category) } }"
                                            class="btn btn-primary w-100"
                                            style="padding-left: 3px; padding-right: 3px;"
                                          >
                                            <span class="font-medium-1 align-middle">Ver tudo</span>
                                          </nuxt-link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <v-footer
                          :class="this.mobileBrowser == true ? 'mobile' : 'desktop' "
                          style="margin-top:100px;"
                        />
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao por categoria -->
                      <div v-if="viewType == 'category'" ref="categoryScroll" style>
                        <div
                          v-for="type in typeProducts"
                          :key="'type-' + type.type.productTypeId"
                          style="background-color: #fbfdfe; overflow-x: scroll"
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="position: sticky; left: 0; background-color: #ebebeb;"
                          >
                            <div class="pl-2 m-0 p-0 pt-1 pb-1">
                              <h4
                                class
                                style="font-size: 26px; font-weight: 300; margin: 0 0 0 8px; color: #666;"
                              >{{ type.type.productType }}</h4>
                            </div>
                            <div class="pl-2 m-0 p-0 pt-1 pb-1">
                              <a
                                @click="
                                  selectProductType(type.type.productTypeId)
                                "
                                href="javascript:void(0)"
                              >Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="
                              'margin-top: 10px; overflow-x: scroll; width: ' +
                              calcWidth(type.products.slice(0, 6).length) +
                              'px;'
                            "
                          >
                            <span
                              v-for="product in type.products.slice(0, 6)"
                              :key="'product' + product.id"
                              style="width: 170px"
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
                              <div class="card font-small-3 mb-1" style="margin-right: 10px">
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <ProductCard :product="product" />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="type.products.length >= 6"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="
                                        selectProductType(
                                          type.type.productTypeId
                                        )
                                      "
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <v-footer
                          :class="this.mobileBrowser == true ? 'mobile' : 'desktop' "
                          style="margin-top:100px;"
                        />
                        <div class="mt-4 mb-4"></div>
                      </div>
                      <!-- visao por categoria com todos os produtos -->
                      <div v-if="viewType == 'category-all-products'" ref="categoryAllScroll" style>
                        <div
                          class="row justify-content-center pl-1"
                          style="background-color: #ebebeb; overflow-x: hidden"
                        >
                          <div class="col-12 p-0 m-0">
                            <div
                              class="row justify-content-center"
                              style="margin-top: 10px; padding-bottom: 2rem; overflow-x: hidden;"
                            >
                              <span
                                v-for="product in catalogProducts"
                                :key="'product' + product.id"
                                style="width: 170px"
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
                                <div class="card font-small-3 mb-1" style="margin-right: 10px">
                                  <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                    <ProductCard :product="product" />
                                  </div>
                                </div>
                              </span>
                              <span v-if="isLoading" class style>
                                <div
                                  class="spinner-border text-primary"
                                  style="width: 3rem; height: 3rem;"
                                  role="status"
                                >
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </span>
                            </div>
                          </div>
                          <b-pagination
                            v-if="categoryAllProductsTotalPages"
                            v-model="categoryAllProductsPage"
                            @input="loadMoreProductsCategoryAllProducts()"
                            :total-rows="categoryAllProductsTotalPages * maxPerScreenCategory * (maxLines + 2)"
                            :per-page="maxPerScreenCategory * (maxLines + 2)"
                          ></b-pagination>
                        </div>
                        <v-footer
                          :class="this.mobileBrowser == true ? 'mobile' : 'desktop' "
                          style="margin-top:100px;"
                        />
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <div
                        v-if="viewType == 'product-type'"
                        ref="typeScroll"
                        style="padding-bottom: 5em;"
                      >
                        <div
                          class="row justify-content-center pl-1"
                          v-for="(chunck, index) in productChunks(
                            productsFromType(selectedProductType)
                          )"
                          :key="index"
                          style="margin-top: 10px; overflow-x: hidden"
                        >
                          <span
                            v-for="product in chunck"
                            :key="'product' + product.id"
                            style="width: 170px"
                            :id="
                              'scrollTo' +
                              product.productTypeId +
                              '-' +
                              product.id
                            "
                          >
                            <div style="padding-left: 5px">
                              <h6 style="margin-bottom: 10px">
                                <span>{{ product.productTypeName }}</span>
                              </h6>
                            </div>
                            <div class="card font-small-3 mb-1" style="margin-right: 10px">
                              <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                <ProductCard :product="product" />
                              </div>
                            </div>
                          </span>
                        </div>
                        <div class="col-12">
                          <div
                            style="margin-top: 15px; display: flex; flex-direction: row; align-items: center; justify-content: center; background-color: #ebebeb"
                          >
                            <b-pagination
                              v-if="allowPagination"
                              v-model="currentPage"
                              @input="loadMoreProducts()"
                              :total-rows="totalPages * maxPerScreenProductType * maxLines"
                              :per-page="maxPerScreenProductType * maxLines"
                            ></b-pagination>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <v-footer
                          :class="this.mobileBrowser == true ? 'mobile' : 'desktop' "
                          style="margin-top:100px;"
                        />
                        <div class="mt-1 mb-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <filters-sidebar-store
              ref="filtersVertical"
              v-if="selectedProductType"
              :openSidebar="openSidebar"
              :productTypeId="selectedProductType.productTypeId"
              @update-sidebar="updateSidebar"
              @update-products="updateProductsByFilters"
              @apply-filters="applyFilters"
            />
          </div>
        </div>
      </div>
      <div
        v-else
        class="content-wrapper pb-0"
        style="max-height: calc(100vh - 5em); overflow-y: hidden; overflow-x: hidden; padding-left: 5px; padding-right: 5px; padding-top: 3px; background: #ebebeb;"
      >
        <div
          class="content-body p-0 m-0"
          ref="generalScroll"
          v-on:scroll.passive="showTopButton()"
          style="max-height: calc(100vh - 5em); overflow-y: scroll; overflow-x: hidden; scroll-behavior: smooth; background: #ebebeb;"
        >
          <div
              v-if="topButton"
              ref="backToTop"
              href="javascript:void(0);"
              @click="scrollToTop()"
              class="position-fixed btn btn-success"
              style="bottom: 20px; right: 30px; z-index: 100; padding: 8px;"
            >
              <span style="vertical-align: text-top;">Todas categorias</span>
              <i class="feather icon-chevron-up" style="color: white;"></i>
            </div>
          <div style=" background: #ededed; border-bottom: solid 1px #d5d5d5;">
            <div class="navigations-container d-flex">
              <div v-if="!selectedFamily">
                <span v-for="(family, index) in catalog" :key="index">
                  <vs-chip class="chip-mf">
                    <a  href="javascript:void(0)"
                      v-if="selectedFamily == 'Alimentos e bebidas' " @click="openNavigationsModal('family-collections', index)">
                      {{index}}
                      <i class="feather icon-chevron-down"></i>
                    </a>
                    <a  href="javascript:void(0)" v-else @click="openNavigationsModal('collection' , index)">
                      {{index}}
                      <i class="feather icon-chevron-down"></i>
                    </a>
                  </vs-chip>
                </span>
              </div>
              <div v-else>
              <vs-chip  class="chip-mf">
                <i @click="storeHome()" class="ficon feather icon-home" style="font-size:15px;"/>
              </vs-chip>
                <span v-for="(family, index) in catalog"
                    :key="index"
                    style="flex: 0 0 auto; width: auto; color: black"
              >
                <vs-chip v-if="index == selectedFamily"
                  :class="selectedCollection || selectedCategory ? 'chip-mf' : 'chip-mf-selected'"
                >
                  <a href="javascript:void(0)"
                    v-if="selectedFamily == 'Alimentos e bebidas' " @click="openNavigationsModal('family-collections', index)" :style="selectedFamily ? 'color: #008567;' : ''">
                    {{ index }}
                     <span v-if="!selectedCollection && selectedCollection != ''">(tudo)</span>
                    <i class="feather icon-chevron-down"></i>
                  </a>
                  <a href="javascript:void(0)" v-else @click="openNavigationsModal('collection' , index)" :style="selectedFamily ? 'color: #008567;' : ''">
                    {{ index }}
                     <span v-if="!selectedCollection && selectedCollection != ''">(tudo)</span>
                    <i class="feather icon-chevron-down"></i>
                  </a>
                </vs-chip>
              </span>
              <span
                v-for="(collection, index) in collectionsFromFamily(selectedFamily)"
                :key="index"
                :vs-value="index"
                style="flex: 0 0 auto; width: auto"
              >
                <vs-chip
                  v-if="index == selectedCollection && selectedCollection != ''"
                  :class="selectedCategory ? 'chip-mf' : 'chip-mf-selected'"
                >
                  <a v-if="selectedCollection != ''" @click="openNavigationsModal('collection', selectedFamily)" :style="selectedCollection ? 'color: #008567;' : ''">
                    {{ index }}
                    <span v-if="!selectedCategory && selectedCollection">(tudo)</span>
                    <i class="feather icon-chevron-down"></i>
                  </a>
                  <a v-else @click="openNavigationsModal('family-collections', selectedFamily)" :style="selectedCollection ? 'color: #008567;' : ''">
                    {{ index }}
                    <span v-if="!selectedCategory && selectedCollection">(tudo)</span>
                    <i class="feather icon-chevron-down"></i>
                  </a>
                </vs-chip>
              </span>
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
                  :class="selectedProductType ? 'chip-mf' : 'chip-mf-selected'"
                >
                  <a v-if="viewType == 'product-type'" @click="openNavigationsModal('category-all-products' , selectedFamily)" :style="selectedCategory ? 'color: #008567;' : ''">
                    {{ selectedCategory}}
                    <span v-if="!selectedProductType && selectedCategory">(tudo)</span>
                    <i class="feather icon-chevron-down"></i>
                  </a>
                  <a v-else @click="openNavigationsModal('collection', selectedFamily)" :style="selectedCategory ? 'color: #008567;' : ''">
                    {{ selectedCategory }}
                    <span v-if="!selectedProductType && selectedCategory">(tudo)</span>
                    <i class="feather icon-chevron-down"></i>
                  </a>
                </vs-chip>
              </span>
              <span
                v-for="type in productsFromCategory(selectedCategory, selectedFamily, selectedCollection, true)"
                :key="type.text"
                :vs-value="type.text"
                style="flex: 0 0 auto; width: auto;"
              >
                <vs-chip v-if="selectedProductType && type.value == selectedProductType.productTypeId" class="chip-mf-selected" alt="type.text">
                  <a v-if="type.text.length > 16" @click="openNavigationsModal('product-type', selectedFamily)">
                    {{type.text.substring(0, type.text.length - 9)}}...
                    <span>(tudo)</span>
                    <i class="feather icon-chevron-down"></i>
                  </a>
                  <a v-else @click="openNavigationsModal('product-type', selectedFamily)">
                    {{type.text}}
                    <span>(tudo)</span>
                    <i class="feather icon-chevron-down"></i>
                  </a>
                </vs-chip>
              </span>
              </div>
              <vs-chip class="chip-mf" style="border: 1px solid #D11B6D !important;">
                <img src="@/assets/images/discount.png" height="15px" width="15px" style="margin-right:4px; filter: invert(22%) sepia(37%) saturate(6568%) hue-rotate(319deg) brightness(83%) contrast(96%) !important;">
                <a @click="goToOffers()" href="javascript:void(0)" style="color: #D11B6D">Painel de ofertas</a>
              </vs-chip>
              <div>
                <form @submit.prevent="runSearch" style="margin-right: -20px;">
                  <input
                    id="search2"
                    placeholder="Buscar..."
                    v-model="keyword"
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
          <div v-if="catalog" class="row p-0 m-0" style="display: contents">
            <div class="col-12 p-0 m-0" ref="productsWindow" style id="products">
              <div>
                <div class="vh-100" ref="desktopScroll">
                  <div class="mb-2" ref="content">
                    <div></div>
                    <div>
                      <!-- visao por familia -->
                      <div v-if="viewType == 'family' && !isLoading" style>
                        <div
                          v-for="(family, index) in catalog"
                          :key="'family-' + index"
                          style="background-color: #ebebeb"
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="position: sticky; left: 0; background-color: white; border-top: 1px solid LightGray; border-bottom: 1px solid LightGray;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1 pb-1">
                              <h4 class style="margin: 0; padding-left: 5px">{{ index }}</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1 pb-1">
                              <nuxt-link
                                class="float-right pr-1"
                                v-if="index == 'Alimentos e bebidas'"
                                :to="{ name: 'cotar-familia', params: { familyName: formatString(index) } }"
                              >Ver tudo</nuxt-link>
                              <nuxt-link
                                class="float-right pr-1"
                                v-else
                                :to="{ name: 'cotar-familia', params: { familyName: formatString(index) } }"
                              >Ver tudo</nuxt-link>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            style="margin-top: 10px; margin-left: 10px;"
                          >
                            <span
                              v-for="product in slicePerWidth(productsFromFamily(index))"
                              :key="'product' + product.id"
                              style="width: 165px"
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
                              style="width: 100px; height: 150px; margin-top: 25px; margin-right: 7px; margin-left: 3px; align-self: center;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <nuxt-link
                                      v-if="index == 'Alimentos e bebidas'"
                                      :to="{ name: 'cotar-familia', params: { familyName: formatString(index) } }"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span
                                        class="font-medium-1 align-middle"
                                        style="white-space: nowrap;"
                                      >Ver tudo</span>
                                    </nuxt-link>
                                    <nuxt-link
                                      v-else
                                      :to="{ name: 'cotar-familia', params: { familyName: formatString(index) } }"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span
                                        class="font-medium-1 align-middle"
                                        style="white-space: nowrap;"
                                      >Ver tudo</span>
                                    </nuxt-link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <v-footer
                          :class="this.mobileBrowser == true ? 'mobile' : 'desktop' "
                          style="margin-top:100px;"
                        />
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao da familia alim e bebidas -->
                      <div v-if="viewType == 'family-collections'" ref="familyScroll" style>
                        <div ref="familyCollections">
                          <div
                            v-for="collection in collectionProducts"
                            :key="'collection-' + collection.collection"
                            style="background-color: #ebebeb"
                          >
                            <div
                              class="row mt-1 mb-0 m-0"
                              style="position: sticky; left: 0; background-color: #ebebeb;"
                            >
                              <div class=" p-0 pt-1 pb-1">
                                <h4
                                  style="font-size: 26px; font-weight: 300; margin: 0 0 0 8px; color: #666;"
                                >{{ collection.collection }}</h4>
                              </div>
                              <div class="p-0 pl-2 pt-2 pb-1">
                                <a
                                  class="float-right pr-1"
                                  href="javascript:void(0)"
                                  @click="
                                    selectedCollectionOnModal({
                                      family: selectedFamily,
                                      collection: collection.collection,
                                    })
                                  "
                                >Ver tudo</a>
                              </div>
                            </div>
                            <div
                              class="row pl-1 mb-4"
                              :style="'margin-top: 10px; justify-content: center;'"
                            >
                              <span
                                v-for="product in slicePerWidth(
                                  collection.products
                                )"
                                :key="'product' + product.id"
                                style="width: 165px"
                                :id="
                                  'scrollTo' +
                                  product.productTypeId +
                                  '-' +
                                  product.id
                                "
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
                                    <ProductCard :product="product" />
                                  </div>
                                </div>
                              </span>
                              <div
                                v-if="collection.products.length >=12"
                                class="card font-small-3"
                                style="width: 100px; height: 150px; margin-top: 25px; margin-right: 7px; margin-left: 3px; align-self: center;"
                              >
                                <div class="card-body p-1">
                                  <div class="row">
                                    <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                    <div class="col-12 mt-1">
                                      <button
                                        @click="selectedCollectionOnModal({family: selectedFamily, collection: collection.collection,})"
                                        type="button"
                                        class="btn btn-primary w-100"
                                        style="padding-left: 3px; padding-right: 3px;"
                                      >
                                        <span
                                          class="font-medium-1 align-middle"
                                          style="white-space: nowrap;"
                                        >Ver tudo</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            v-if="isLoading"
                            class="d-flex justify-content-center"
                            style="margin-top: 50px;"
                          >
                            <div
                              class="spinner-border text-primary"
                              style="width: 3rem; height: 3rem;"
                              role="status"
                            >
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                          <v-footer
                            :class="this.mobileBrowser == true ? 'mobile' : 'desktop' "
                            style="margin-top:100px;"
                          />
                          <div class="mt-1 mb-1"></div>
                        </div>
                      </div>
                      <!-- visao por colecao -->
                      <div
                        v-if="viewType == 'collection'"
                        ref="collectionScroll"
                        style="overflow-x: hidden; padding-bottom: 5em;"
                      >
                        <div ref="collectionCategories">
                          <div
                            v-for="category in categoryProducts"
                            :key="'category-' + category.category"
                            style="background-color: #ebebeb"
                          >
                            <div
                              class="row mt-1 mb-0 m-0"
                              style="background-color: #ebebeb;"
                            >
                              <div class="pl-2 p-0 pt-1 pb-0">
                                <h4
                                  style="font-size: 26px; font-weight: 300; margin: 0 0 0 8px; color: #666;"
                                >{{ category.category }}</h4>
                              </div>
                              <div class="p-0 pl-2 pt-2 pb-1">
                                <nuxt-link
                                  class="float-right pr-1"
                                  v-if="selectedFamily == 'Alimentos e bebidas'"
                                  :to="{ name: 'cotar-categoria', params: { familyName: formatString(selectedFamily), categoryName: formatString(category.category) } }"
                                >Ver tudo</nuxt-link>
                                <nuxt-link
                                  class="float-right pr-1"
                                  v-else
                                  :to="{ name: 'cotar-categoria', params: { familyName: formatString(selectedFamily), categoryName: formatString(category.category) } }"
                                >Ver tudo</nuxt-link>
                              </div>
                            </div>
                            <div class="mb-4 row pl-3" style="overflow-x: hidden;">
                              <div class="col-12 p-0 m-0">
                                <div class="row" style="margin-top: 10px; overflow-x: hidden">
                                  <span
                                    v-for="product in slicePerWidthWithLines(
                                      category.products
                                    )"
                                    :key="'product' + product.id"
                                    style="width: 165px"
                                    :id="
                                      'scrollTo' +
                                      product.productTypeId +
                                      '-' +
                                      product.id
                                    "
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
                                        <ProductCard :product="product" />
                                      </div>
                                    </div>
                                  </span>
                                  <div
                                    v-if="category.products.length >=12"
                                    class="card font-small-3"
                                    style="width: 100px; height: 150px; margin-top: 25px; margin-right: 7px; margin-left: 3px; align-self: center;"
                                  >
                                    <div class="card-body p-1">
                                      <div class="row">
                                        <div
                                          class="col-12 text-center"
                                        >Veja mais produtos deste tipo.</div>
                                        <div class="col-12 mt-1">
                                          <nuxt-link
                                            v-if="selectedFamily == 'Alimentos e bebidas'"
                                            :to="{ name: 'cotar-categoria', params: { familyName: formatString(selectedFamily), categoryName: formatString(category.category) } }"
                                            class="btn btn-primary w-100"
                                            style="padding-left: 3px; padding-right: 3px;"
                                          >
                                            <span
                                              class="font-medium-1 align-middle"
                                              style="white-space: nowrap;"
                                            >Ver tudo</span>
                                          </nuxt-link>
                                          <nuxt-link
                                            v-else
                                            :to="{ name: 'cotar-categoria', params: { familyName: formatString(selectedFamily), categoryName: formatString(category.category) } }"
                                            class="btn btn-primary w-100"
                                            style="padding-left: 3px; padding-right: 3px;"
                                          >
                                            <span
                                              class="font-medium-1 align-middle"
                                              style="white-space: nowrap;"
                                            >Ver tudo</span>
                                          </nuxt-link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <v-footer
                          :class="this.mobileBrowser == true ? 'mobile' : 'desktop' "
                          style="margin-top:100px;"
                        />
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao por categoria -->
                      <div v-if="viewType == 'category'" ref="categoryScroll" style>
                        <div
                          v-for="type in typeProducts"
                          :key="'type-' + type.type.productTypeId"
                          style="background-color: #ebebeb"
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="position: sticky; left: 0; background-color: #ebebeb;"
                          >
                            <div class="pl-2 m-0 p-0 pt-1 pb-1">
                              <h4
                                class
                                style="font-size: 26px; font-weight: 300; margin: 0 0 0 8px; color: #666;"
                              >{{ type.type.productType }}</h4>
                            </div>
                            <div class="pl-2 m-0 p-0 pt-2 pb-1">
                              <nuxt-link
                                class="float-right pr-1"
                                :to="{ name: 'cotar-produto',
                                       params: {
                                         familyName: formatString(selectedFamily),
                                         categoryName: formatString(selectedCategory),
                                         productTypeName: formatString(type.type.productType)
                                       }
                                     }"
                              >Ver tudo</nuxt-link>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            style="margin-top: 10px; justify-content: center; background-color: #ebebeb;"
                          >
                            <span
                              v-for="product in slicePerWidth(type.products)"
                              :key="'product' + product.id"
                              style="width: 165px;"
                              :id="
                                'scrollTo' +
                                product.productTypeId +
                                '-' +
                                product.id
                              "
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
                                  <ProductCard :product="product" />
                                </div>
                              </div>
                            </span>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <v-footer
                          :class="this.mobileBrowser == true ? 'mobile' : 'desktop' "
                          style="margin-top:100px;"
                        />
                        <div class="mt-4 mb-4"></div>
                      </div>
                      <!-- visao por categoria com todos os produtos -->
                      <div
                        v-if="viewType == 'category-all-products'"
                        ref="categoryAllScroll"
                        style="overflow-x: hidden;"
                      >
                        <div class="row pl-3" style="background-color: #ebebeb; overflow-x: hidden">
                          <div class="col-12 p-0 m-0">
                            <div
                              class="row"
                              style="margin-top: 10px; padding-bottom: 5rem; overflow-x: hidden; background-color: #ebebeb;"
                            >
                              <span
                                v-for="product in catalogProducts"
                                :key="'product' + product.id"
                                style="width: 165px"
                                :id="
                                  'scrollTo' +
                                  product.productTypeId +
                                  '-' +
                                  product.id
                                "
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
                                    <ProductCard :product="product" />
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                          <div class="col-12">
                            <div
                              style="margin-top: 0px; display: flex; flex-direction: row; align-items: center; justify-content: center; background-color: #ebebeb"
                            >
                              <b-pagination
                                v-if="categoryAllProductsTotalPages"
                                v-model="categoryAllProductsPage"
                                @input="loadMoreProductsCategoryAllProducts()"
                                :total-rows="categoryAllProductsTotalPages * maxPerScreenCategory * (maxLines + 2)"
                                :per-page="maxPerScreenCategory * (maxLines + 2)"
                                first-text="Início"
                                prev-text="Anterior"
                                next-text="Próximo"
                                last-text="Final"
                              ></b-pagination>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <v-footer
                          :class="this.mobileBrowser == true ? 'mobile' : 'desktop' "
                          style="margin-top:100px;"
                        />
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao por tipo de produto -->
                      <div
                        v-if="viewType == 'product-type'"
                        ref="typeScroll"
                        style="background-color: #ebebeb; overflow-x: hidden; padding-bottom: 5em;"
                      >
                        <div
                          class="row pl-1"
                          style="margin-top: 10px; padding-bottom: 10rem; overflow-x: hidden;"
                        >
                          <div class="col-md-3 col-xl-2 pl-0">
                            <products-filter-store
                              v-if="selectedProductType"
                              ref="filters"
                              :isMobile="false"
                              :productTypeId="selectedProductType.productTypeId"
                              @updated-filters="updateProductsByFilters"
                              @close-sidebar="applyFilters"
                              style="overflow-x: hidden;"
                            />
                          </div>
                          <div class="col-12 col-md-9 col-xl-10">
                            <div class="row m-0 p-0">
                              <span
                                v-for="product in productsFromType(selectedProductType)"
                                :key="'product' + product.id"
                                style="width: 170px;"
                                :id="'scrollTo' + product.productTypeId + '-' + product.id"
                              >
                                <!-- <div style="padding-left: 5px;">
                                  <h6 style="margin-bottom: 10px;">
                                    <span>
                                      {{ product.productTypeName }}
                                    </span>
                                  </h6>
                                </div>-->
                                <div class="card font-small-3 mb-1" style="margin-right: 10px;">
                                  <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                    <ProductCard :product="product" />
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                          <div class="col-12">
                            <div
                              style="margin-top: 15px; display: flex; flex-direction: row; align-items: center; justify-content: center; background-color: #ebebeb"
                            >
                              <b-pagination
                                v-if="allowPagination"
                                v-model="currentPage"
                                @input="loadMoreProducts()"
                                :total-rows="totalPages * maxPerScreenProductType * maxLines"
                                :per-page="maxPerScreenProductType * maxLines"
                                first-text="Início"
                                prev-text="Anterior"
                                next-text="Próximo"
                                last-text="Final"
                              ></b-pagination>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <v-footer
                          :class="this.mobileBrowser == true ? 'mobile' : 'desktop' "
                          style="margin-top:100px;"
                        />
                        <div class="mt-1 mb-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <filters-sidebar-store
              v-if="selectedProductType"
              ref="filtersVertical"
              :openSidebar="openSidebar"
              :productTypeId="selectedProductType.productTypeId"
              @update-sidebar="updateSidebar"
              @update-products="updateProductsByFilters"
              @apply-filters="applyFilters"
            />
          </div>
        </div>
      </div>
    </span>
  </div>
</template>

<style scoped>
.chip-mf-local {
    font-weight: 400;
    font-size: 0.8em !important;
    background-color: white !important;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin-right: 8px !important;
}
.desktop {
  margin-left: 10px !important;
}
.mobile {
  margin-bottom: 20px;
}
.module-border-wrap {
  position: relative;
  background: linear-gradient(to right, #ffff00, #fe0000);
  border-radius: 0.5rem;
  padding: 3px;
}
.dot {
  height: 10px;
  width: 10px;
  background-color: PaleGreen;
  border-radius: 50%;
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
.btn .btn-success{
  background-color: #008567 !important;
}
.card{
    margin-bottom: 2.2rem;
    border: none;
    border-radius: 0.5rem;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import ProductCard from "@/components/products/ProductCard";
import FiltersSidebarStore from "@/components/productTypes/FiltersSidebarStore";
import ProductsFilterStore from "@/components/productTypes/ProductsFilterStore";
import VFooter from "@/layouts/components/VFooter";
import NavigationModal from "@/components/users/NavigationModal"

export default {
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
      loading: false,
      selectedProductType: undefined,
      slug: null,
      mobileBrowser: false,
      totals: [],
      total: 0,
      hasBelowMin: false,
      openLocation: false,
      allowAccess: false,
      openSidebar: false,
      filteringTypeId: null,
      showFiltered: false,
      navigateToProduct: null,
      targetClick: null,
      navigationsModal: false,
      selectedCollection: null,
      selectedFamily: null,
      selectedCategory: null,
      viewType: "family",
      familyProducts: [],
      categoryProducts: [],
      typeProducts: [],
      collectionProducts: [],
      show: false,
      keyword: null,
      home: null,
      validFilter: false,
      activeFilters: { },
      renderCategories: [],
      lastLoadedCategory: 0,
      renderCollections: [],
      lastLoadedCollection: 0,
      categoryAllProductsTotalPages: null,
      categoryAllProductsPage: 1,
      topButton: false,
      allowPagination: false,
      selectedViewType: '',
      maxLines: 5,
      tab: 0,
      openSearch: false,
      titleContent: 'Faça sua cotação online | Meu Fornecedor',
      descriptionContent: 'Monte agora sua cotação online de alimentos, bebidas, embalagens, limpeza, utensílios em MeuFornecedor.com.br',
    };
  },

  created() {

  },
  mounted() {
    this.isMobile()
    this.createMetaTagsInfo()
    this.isLoading = true
    var page = 1
    this.userSelectedPage(page)
    this.setCurrentPage(page)
    this.getAllCatalog().then(() => {
      this.isLoading = false;
      this.openLocation = false;
      this.allowAccess = true;
      this.startStore();
    });
     setTimeout(() => {
       this.scrollNavigationsContainer()
    }, 3000);
  },
  computed: {
    ...mapState("users/products", [
      "storeTotal",
      "storeProducts",
      "catalog",
      "catalogProducts",
    ]),
    ...mapState("pagination", ["totalPages"]),
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage;
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value);
      },
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
      } else {
        return 6;
      }
    },
    maxPerScreenCategory() {
      if (window.innerWidth >= 1920) {
        return 11;
      } else if (window.innerWidth >= 1540 && window.innerWidth < 1920) {
        return 10;
      } else if (window.innerWidth >= 1340 && window.innerWidth < 1540) {
        return 9;
      } else if (window.innerWidth >= 1200 && window.innerWidth < 1340) {
        return 8;
      } else if (window.innerWidth >= 1100 && window.innerWidth < 1200) {
        return 7;
      } else {
        return 6;
      }
    },
    maxPerScreenProductType() {
      if (window.innerWidth >= 1920) {
        return 8;
      } else if (window.innerWidth >= 1540 && window.innerWidth < 1920) {
        return 7;
      } else if (window.innerWidth >= 1340 && window.innerWidth < 1540) {
        return 6;
      } else if (window.innerWidth >= 1200 && window.innerWidth < 1340) {
        return 5;
      } else if (window.innerWidth >= 1100 && window.innerWidth < 1200) {
        return 4;
      } else {
        return 2;
      }
    },

    widthRatio() {
      return (window.innerWidth / this.maxPerScreen / window.innerWidth) * 100;
    },

    searchBarStyle() {
      if (this.show) {
        return "width: 100%";
      } else return "display: none";
    },
  },

  methods: {
    ...mapActions("users/products", [
      "setStoreTotal",
      "setStoreCanBuy",
      "updateStoreProducts",
      "removeFromStoreProducts",
      "loadStoreTotal",
      "getAllCatalog",
      "getCatalogByProductTypePaginated",
      "getCatalogByFamily",
      "getCatalogByCategory",
      "getSampleCatalogByProductType",
      "getAllProductsByCategory",
      "getCatalogByCollection",
    ]),
    ...mapActions("pagination", ["userSelectedPage", "setCurrentPage"]),
    scrollNavigationsContainer(){
      if(this.$refs["navigations-container-scroll"])
        this.$refs["navigations-container-scroll"].scrollLeft += this.$refs["navigations-container-scroll"].scrollWidth;
    },
    storeHome() {
      // this.viewType = "family";
      // this.selectedCategory = null;
      // this.selectedCollection = null;
      // this.selectedFamily = null;
      // this.startStore(true);
      this.$router.push({ path: '/' })
    },
    productsFromFamily(family) {
      var aux = this.familyProducts.find((obj) => obj.family == family);
      if (aux && aux.products) return aux.products;
      else return [];
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
          case 'Embalagens':
            this.tab = 1
          break
          case 'Limpeza':
            this.tab = 2
          break
          case 'Utensílios':
            this.tab = 3
          break
        }
        return null
      },
    updateSelectedProductType(productTypeName){
      this.selectedProductTypeOnModal = productTypeName
    },
    async selectProductType(productType) {
      this.isLoading = true;
      var ended = null;
      this.allowPagination = true
      this.selectedProductType = this.findProductType(productType);
      this.resetScrolls(this.viewType, "product-type");
      this.viewType = "product-type";
      ended = await this.getCatalogByProductTypePaginated({ productTypeId: productType, filters: {}, items: this.maxPerScreenProductType * this.maxLines }).then(() => {
        var first = this.productsFromType(this.selectedProductType)[0];
        this.selectedCategory = first.categoryName;
        if (first.categoryCollection)
          this.selectedCollection = first.categoryCollection;
        else this.selectedCollection = "";
        this.selectedFamily = first.familyName;
        this.isLoading = false;
        this.loading = false;
      });
      return ended;
    },
    findProductType(productType) {
      var data = this.catalog;
      for (let family in data) {
        for (let collection in data[family]) {
          for (let category in data[family][collection]) {
            for (
              var i = 0;
              i < data[family][collection][category].length;
              i++
            ) {
              if (
                data[family][collection][category][i].productTypeId ==
                productType
              )
                return data[family][collection][category][i];
            }
          }
        }
      }
      return null;
    },
    loadFamilyProducts(family) {
      this.isLoading = true;
      this.getCatalogByFamily({ family: family }).then((response) => {
        this.isLoading = false;
        this.loading = false;
        this.familyProducts.push({ family: family, products: response });
      });
    },
    async loadCollectionProducts(family, collection) {
      var wait = await this.getCatalogByCollection({
        family: family
          .replace(".", "_")
          .replace("/", "@")
          .replace("(", "*")
          .replace(")", "!"),
        collection: collection
          .replace(".", "_")
          .replace("/", "@")
          .replace("(", "*")
          .replace(")", "!"),
      }).then((response) => {
        this.collectionProducts.push({
          family: family,
          collection: collection,
          products: response,
        });
        if (this.collectionProducts.length > 1)
          this.collectionProducts.sort((a, b) =>
            a.collection.localeCompare(b.collection)
          );
      });
      return wait;
    },
    async loadCategoryProducts(family, category) {
      var wait = await this.getCatalogByCategory({
        family: family.replace(".", "_"),
        category: category.replace(".", "_").replace("/", "@"),
      }).then((response) => {
        this.categoryProducts.push({
          family: family,
          category: category,
          products: response,
        });
        if (this.categoryProducts.length > 1)
          this.categoryProducts.sort((a, b) =>
            a.category.localeCompare(b.category)
          );
      });
      return wait;
    },
    async loadProductTypesProducts(family, category, type) {
      var wait = await this.getSampleCatalogByProductType({
        productTypeId: type.productTypeId,
      }).then((response) => {
        this.typeProducts.push({
          family: family,
          category: category,
          type: type,
          products: response,
        });
        if (this.typeProducts.length > 1)
          this.typeProducts.sort((a, b) =>
            a.type.productType.localeCompare(b.type.productType)
          );
      });
      return wait;
    },
    async initialLoad() {
      if (Object.keys(this.catalog).length > 1) {
        this.home = "family";
        for (let family in this.catalog) {
          this.loadFamilyProducts(family);
        }
      } else {
        for (let family in this.catalog) {
          if (Object.keys(this.catalog[family]).length > 1) {
            this.home = "family-collections";
            this.selectedFamilyAllCollections(family);
          } else {
            for (let collection in this.catalog[family]) {
              if (Object.keys(this.catalog[family][collection]).length > 1) {
                this.home = "collection";
                this.selectedCollectionOnModal({
                  family: family,
                  collection: collection,
                });
              } else {
                for (let category in this.catalog[family][collection]) {
                  if (this.catalog[family][collection][category].length > 1) {
                    this.home = "category-all-products";
                    this.categoryAllProductsPage = 1;
                    this.selectedCategoryAllProducts({
                      family: family,
                      collection: collection,
                      category: category,
                    });
                  } else {
                    this.home = "product-type";
                    this.selectProductType(
                      this.catalog[family][collection][category][0]
                        .productTypeId
                    );
                  }
                }
              }
            }
          }
        }
      }
      this.viewType = this.home;
    },

    productChunks(products) {
      var result = [];
      var data = products;
      if (data) {
        for (var i = 0; i < data.length; i++) {
          if (i % this.maxPerScreen == 0) result.push([]);
          result[Math.floor(i / this.maxPerScreen)].push(data[i]);
        }
      }
      return result;
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },

    allowZipcode(value) {
      // this.allowAccess = value
      if (value == true) this.targetClick.click();
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
    slugToName(string){
      var aux = string.charAt(0).toUpperCase() + string.slice(1)
      aux = aux.replace(/-/, ' ')
      aux = aux.replace(/-/, ' ')
      return aux
    },
    findKeyEncoded(object, encoded) {
      var aux = Object.keys(object).map(key => ({ original: key, encoded: this.formatString(key) }))
      var found = aux.find(obj => obj.encoded == encoded)
      return found
    },
    createMetaTagsInfo() {
      if(this.$route.meta.familyView) {
        this.titleContent = "Faça sua cotação de " + this.slugToName(this.$route.params.familyName) + " | Meu Fornecedor";
        this.descriptionContent = "Monte sua cotação de " + this.slugToName(this.$route.params.familyName) + " e acione diversas distribuidoras ao mesmo tempo em MeuFornecedor.com.br";
      } else if(this.$route.meta.categoryView) {
        this.titleContent = "Faça sua cotação de " + this.slugToName(this.$route.params.categoryName) + " | Meu Fornecedor";
        this.descriptionContent = "Monte sua cotação de " + this.slugToName(this.$route.params.categoryName) + " e acione diversas distribuidoras ao mesmo tempo em MeuFornecedor.com.br";
      }
      else if(this.$route.meta.productTypeView) {
        this.titleContent = `Faça sua cotação de ${this.slugToName(this.$route.params.categoryName)}, ${this.slugToName(this.$route.params.productTypeName)} | Meu Fornecedor`;
        this.descriptionContent = `Monte sua cotação de ${this.slugToName(this.$route.params.categoryName)}, ${this.slugToName(this.$route.params.productTypeName)} e acione diversas distribuidoras ao mesmo tempo em MeuFornecedor.com.br`;
      }
    },
    startStore(clickedHome = false) {
      if(this.$route.meta.familyView) {
        var found = this.findKeyEncoded(this.catalog, this.$route.params.familyName)
        if (found) {
          if (found.original == "Alimentos e bebidas")
            this.selectedFamilyAllCollections("Alimentos e bebidas")
          else
            this.selectedFamilyAllCategories(found.original)
        }
        // this.titleContent = "Faça sua cotação de " + this.slugToName(this.selectedFamily) + " | Meu Fornecedor";
        // this.descriptionContent = "Monte sua cotação de " + this.slugToName(this.selectedFamily) + " e acione diversas distribuidoras ao mesmo tempo em MeuFornecedor.com.br";
      } else if(this.$route.meta.categoryView) {
        var foundFamily = this.findKeyEncoded(this.catalog, this.$route.params.familyName)
        for(var collection in this.catalog[foundFamily.original]) {
          for(var category in this.catalog[foundFamily.original][collection]) {
            if(this.formatString(category) == this.$route.params.categoryName) {
              if(this.$route.query.page)
                this.categoryAllProductsPage = parseInt(this.$route.query.page)
              else
                this.categoryAllProductsPage = 1
              this.selectedCategoryAllProducts({
                family: foundFamily.original,
                collection: collection,
                category: category,
              });
            }
          }
        }
        // this.titleContent = "Faça sua cotação de " + this.slugToName(this.selectedCategory) + " | Meu Fornecedor";
        // this.descriptionContent = "Monte sua cotação de " + this.slugToName(this.selectedCategory) + " e acione diversas distribuidoras ao mesmo tempo em MeuFornecedor.com.br";
      }
      else if(this.$route.meta.productTypeView) {
        var foundFamily2 = this.findKeyEncoded(this.catalog, this.$route.params.familyName)
        for(var collection2 in this.catalog[foundFamily2.original]) {
          for(var category2 in this.catalog[foundFamily2.original][collection2]) {
            for(var i = 0; i < this.catalog[foundFamily2.original][collection2][category2].length; i++) {
              if (this.formatString(this.catalog[foundFamily2.original][collection2][category2][i].productType) == this.$route.params.productTypeName &&
                  this.formatString(category2) == this.$route.params.categoryName) {
                if(this.$route.query.page) {
                  var page = parseInt(this.$route.query.page)
                  this.userSelectedPage(page)
                  this.setCurrentPage(page)
                }
                this.selectProductType(this.catalog[foundFamily2.original][collection2][category2][i].productTypeId)
              }
            }
          }
        }
        // this.titleContent = "Faça sua cotação de " + this.slugToName(this.selectedProductType.productType) + " | Meu Fornecedor";
        // this.descriptionContent = "Monte sua cotação de " + this.slugToName(this.selectedProductType.productType) + " e acione diversas distribuidoras ao mesmo tempo em MeuFornecedor.com.br";
      }
      else {
        if (!clickedHome && this.$route.query.selected == "family") {
          setTimeout(() => {
            if (this.$route.query.family == "Alimentos e bebidas")
              this.selectedFamilyAllCollections("Alimentos e bebidas");
            else if (this.$route.query.family)
              this.selectedFamilyAllCategories(this.$route.query.family);
          }, 800);
        } else if (!clickedHome && this.$route.query.selected == "category") {
          this.selectedCategoryOnModal({
            family: this.$route.query.family,
            collection: this.$route.query.collection,
            category: this.$route.query.category,
          });
        } else if (!clickedHome && this.$route.query.selected == "collection") {
          this.selectedCollectionOnModal({
            family: this.$route.query.family,
            collection: this.$route.query.collection,
          });
        } else if (!clickedHome && this.$route.query.selected == "type") {
          this.selectProductType(this.$route.query.productTypeId);
        } else {
          this.initialLoad();
        }
      }
    },
    showTopButton(){
      this.topButton = true
    },
    scroll() {
      this.$refs["generalScroll"].onscroll = () => {
        if (this.viewType == "collection") {
          var offersHeight = 0;
          if (
            this.$refs["collectionOffers"] &&
            this.$refs["collectionOffers"].offsetHeight
          )
            offersHeight = this.$refs["collectionOffers"].offsetHeight;
          let bottomOfWindow =
            this.$refs["generalScroll"].scrollTop +
              this.$refs["generalScroll"].offsetHeight >
            offersHeight +
              this.$refs["collectionCategories"].offsetHeight -
              300;
          if (bottomOfWindow && !this.loading) {
            if (this.lastLoadedCategory + 1 < this.renderCategories.length) {
              this.loading = true;
              this.isLoading = true;
              this.lastLoadedCategory++;
              this.loadCategoryProducts(
                this.renderCategories[this.lastLoadedCategory].family,
                this.renderCategories[this.lastLoadedCategory].category
              ).then(() => {
                this.loading = false;
                this.isLoading = false;
              });
            }
          }
        }
      };
    },
    scrollCollections() {
      this.$refs["generalScroll"].onscroll = () => {
        if (this.viewType == "family-collections") {
          var offersHeight = 0;
          let bottomOfWindow =
            this.$refs["generalScroll"].scrollTop +
              this.$refs["generalScroll"].offsetHeight >
            offersHeight + this.$refs["familyCollections"].offsetHeight - 300;
          if (bottomOfWindow && !this.loading) {
            if (this.lastLoadedCollection + 1 < this.renderCollections.length) {
              this.loading = true;
              this.isLoading = true;
              this.lastLoadedCollection++;
              this.loadCollectionProducts(
                this.renderCollections[this.lastLoadedCollection].family,
                this.renderCollections[this.lastLoadedCollection].collection
              ).then(() => {
                this.loading = false;
                this.isLoading = false;
              });
            }
          }
        }
      };
    },
    // scrollCategoryAllProducts() {
    //   this.$refs["generalScroll"].onscroll = () => {
    //     if (this.viewType == "category-all-products") {
    //       var offersHeight = 0;
    //       let bottomOfWindow =
    //         this.$refs["generalScroll"].scrollTop +
    //           this.$refs["generalScroll"].offsetHeight >
    //         offersHeight + this.$refs["categoryAllScroll"].offsetHeight - 300;
    //       if (bottomOfWindow && !this.loading) {
    //         if (
    //           this.categoryAllProductsPage < this.categoryAllProductsTotalPages
    //         ) {
    //           this.loading = true;
    //           this.isLoading = true;
    //           this.categoryAllProductsPage++;
    //           this.getAllProductsByCategory({ family: this.selectedFamily.replace(".", "_").replace("/", "@"),
    //                                           category: this.selectedCategory.replace(".", "_").replace("/", "@"),
    //                                           page: this.categoryAllProductsPage,
    //           }).then(() => {
    //             this.loading = false;
    //             this.isLoading = false;
    //           });
    //         }
    //       }
    //     }
    //   };
    // },
    productsFromType(type, filtering = false) {
      return this.catalogProducts.filter((prod) => prod.productTypeId == type.productTypeId);
    },
    updateSidebar(val) {
      this.openSidebar = val;
    },
    clickSidebar(type) {
      this.openSidebar = true;
      // if (type.productTypeId != this.filteringTypeId) {
      //   this.showFiltered = false;
      //   this.filtersProducts = this.productsFromType(type, true);
      // }
      // this.filteringTypeId = type.productTypeId;
      // setTimeout(() => {
      //   this.$refs.filtersVertical.loadNew();
      // }, 300);
    },
    updateProductsByFilters(filters) {
      this.userSelectedPage(1)
      this.setCurrentPage(1)
      this.activeFilters = filters
      this.isLoading = true
      this.resetScrolls(this.viewType, "product-type")
      if (filters.brands.length || filters.volumes.length || filters.tags.length || filters.properties.length) {
        this.validFilter = true;
        this.getCatalogByProductTypePaginated({ productTypeId: this.selectedProductType.productTypeId, filters: filters, items: this.maxPerScreenProductType * this.maxLines }).then(() => {
          this.isLoading = false
        })
      } else {
        this.getCatalogByProductTypePaginated({ productTypeId: this.selectedProductType.productTypeId, filters: {}, items: this.maxPerScreenProductType * this.maxLines }).then(() => {
          this.isLoading = false
        })
        this.validFilter = false;
      }
    },
    applyFilters() {
      this.showFiltered = true;
    },
    productsFromCategory(
      category,
      family,
      collection,
      hidePlaceholder = false
    ) {
      if (category) {
        var fromCategory = this.catalog[family][collection][
          category
        ].map((obj) => ({ value: obj.productTypeId, text: obj.productType }));
        //var fromCategory = this.loadProductTypes.filter(type => type.category == category).map(obj => ({ value: obj.productType.productTypeId, text: obj.productType.productType }))
        if (!hidePlaceholder)
          fromCategory.unshift({ value: null, text: "Prod." });
        return fromCategory;
      } else return [];
    },
    goToOffers() {
      this.$router.push({ path: '/produtos-em-oferta' })
    },

    hasFilters(type) {
      if (this.mobileBrowser && this.showFiltered && this.validFilter)
        return true;
      else if (!this.mobileBrowser && this.showFiltered && this.validFilter)
        return true;
      else return false;
    },
    clearAllFilters() {
      this.showFiltered = false;
      this.isLoading = true
      this.resetScrolls(this.viewType, "product-type")
      this.activeFilters = {}
      this.$refs.filtersVertical.clearInternalSelectedFilters()
      this.getCatalogByProductTypePaginated({ productTypeId: this.selectedProductType.productTypeId, filters: this.activeFilters, items: this.maxPerScreenProductType * this.maxLines }).then(() => {
        this.isLoading = false
      })
    },
    updateLocationModal(val) {
      this.openLocation = val;
    },
    updateNavigationModal(val) {
      this.navigationsModal = val;
    },

    openLocationPopup(target) {
      this.targetClick = target;
      this.openLocation = true;
    },
    async selectedFamilyAllCollections(family) {
      this.selectedFamily = family;
      this.selectedCollection = null;
      this.selectedCategory = null;
      this.resetScrolls(this.viewType, "family-collections");
      this.viewType = "family-collections";

      this.collectionProducts = [];
      this.renderCollections = [];
      var wait = null;
      this.isLoading = true;

      var initialLoad = 0;
      var initialLoadMax = 3;

      for (let collection in this.catalog[family]) {
        if (initialLoad < initialLoadMax) {
          wait = await this.loadCollectionProducts(family, collection);
          this.lastLoadedCollection = initialLoad;
        }
        this.renderCollections.push({ family: family, collection: collection });
        initialLoad++;
      }
      if (!wait) {
        this.isLoading = false;
        this.scrollCollections();
      }
    },
    async selectedCategoryOnModal(value) {
      this.selectedFamily = value.family;
      this.selectedCollection = value.collection;
      this.selectedCategory = value.category;
      this.resetScrolls(this.viewType, "category");
      this.viewType = "category";

      this.typeProducts = [];
      var wait = null;
      this.isLoading = true;

      for (
        var i = 0;
        i < this.catalog[value.family][value.collection][value.category].length;
        i++
      ) {
        wait = await this.loadProductTypesProducts(
          value.family,
          value.category,
          this.catalog[value.family][value.collection][value.category][i]
        );
      }
      if (!wait) this.isLoading = false;
    },
    selectedCategoryAllProducts(value) {
      this.selectedFamily = value.family;
      this.selectedCollection = value.collection;
      this.selectedCategory = value.category;
      this.selectedProductType = null;
      this.resetScrolls(this.viewType, "category-all-products");
      this.viewType = "category-all-products";

      this.isLoading = true;
      //this.categoryAllProductsPage = 1;
      this.getAllProductsByCategory({
        family: value.family.replace(".", "_").replace("/", "@"),
        category: value.category.replace(".", "_").replace("/", "@"),
        page: this.categoryAllProductsPage,
        items: this.maxPerScreenCategory * (this.maxLines + 2)
      }).then((response) => {
        this.categoryAllProductsTotalPages = response.headers["total-pages"];
        this.isLoading = false;
        //this.scrollCategoryAllProducts();
      });
    },
    async selectedCollectionOnModal(value) {
      this.selectedFamily = value.family;
      this.selectedCollection = value.collection;
      this.selectedCategory = null;
      this.resetScrolls(this.viewType, "collection");
      this.viewType = "collection";

      this.categoryProducts = [];
      var wait = null;
      this.isLoading = true;

      this.renderCategories = [];

      var initialLoad = 0;
      var initialLoadMax = 3;

      for (let category in this.catalog[value.family][value.collection]) {
        if (initialLoad < initialLoadMax) {
          wait = await this.loadCategoryProducts(value.family, category);
          this.lastLoadedCategory = initialLoad;
        }
        this.renderCategories.push({
          family: value.family,
          category: category,
        });
        initialLoad++;
      }
      if (!wait) {
        this.isLoading = false;
        this.scroll();
      }
    },
    async selectedFamilyAllCategories(family) {
      this.selectedFamily = family;
      this.selectedCollection = null;
      this.selectedCategory = null;
      this.resetScrolls(this.viewType, "collection");
      this.viewType = "collection";

      this.categoryProducts = [];
      var wait = null;
      this.isLoading = true;

      this.renderCategories = [];

      var initialLoad = 0;
      var initialLoadMax = 3;

      for (let category in this.catalog[family][""]) {
        if (initialLoad < initialLoadMax) {
          wait = await this.loadCategoryProducts(family, category);
          this.lastLoadedCategory = initialLoad;
        }
        this.renderCategories.push({ family: family, category: category });
        initialLoad++;
      }
      if (!wait) {
        this.isLoading = false;
        this.scroll();
      }
    },
    categoriesFromCollection(family, collection) {
      if(this.catalog)
        return this.catalog[family][collection];
      else
        return []
    },
    collectionsFromFamily(family) {
      return this.catalog[family];
    },
    calcWidth(size) {
      var total = size * 178;
      if (size >= 6) total += 160;
      return total;
    },
    closing() {
      if (this.isMobile) {
        this.show = !this.show;
        if (this.show) {
          setTimeout(() => {
            this.$refs.searchBar.focus();
          }, 500);
        }
      }
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
    getSelectedFamilyIcon(family) {
      switch (family) {
        case "Alimentos e bebidas":
          return (
            '<img src="' +
            require(`@/assets/images/maca.svg`) +
            '" alt="*" width="16" style="filter: invert(1);">'
          );
        case "Embalagens":
          return '<i class="feather icon-shopping-bag mr-25" ></i>';
        case "Limpeza":
          return (
            '<img class="mr-25" src="' +
            require(`@/assets/images/window-cleaner.svg`) +
            '" alt="*" width="16" style="filter: invert(1);">'
          );
        case "Utensílios":
          return '<i class="fa fa-cutlery mr-25" "></i>';
      }
      return null;
    },
    clickedProductTitle(product) {
      this.$router.push({ name: 'cotar-produto',
                          params: {
                            familyName: this.formatString(product.familyName),
                            categoryName: this.formatString(product.categoryName),
                            productTypeName: this.formatString(product.productTypeName)
                          } })
      // this.selectedFamily = product.familyName;
      // if (product.categoryCollection)
      //   this.selectedCollection = product.categoryCollection;
      // else this.selectedCollection = "";
      // this.selectedCategory = product.categoryName;
      // this.selectProductType(product.productTypeId);
    },
    resetScrolls(oldView, newView) {
      /* if (oldView != newView) {
        if (this.$refs.mobileCategoryChips)
          this.$refs.mobileCategoryChips.scrollLeft = 0;
        if (this.$refs.mobileCollectionChips)
          this.$refs.mobileCollectionChips.scrollLeft = 0;
        if (this.$refs.mobileFamilyChips)
          this.$refs.mobileFamilyChips.scrollLeft = 0;
      } */

      if (this.$refs.familyScroll) this.$refs.familyScroll.scrollTop = 0;
      if (this.$refs.collectionScroll)
        this.$refs.collectionScroll.scrollTop = 0;
      if (this.$refs.generalScroll) this.$refs.generalScroll.scrollTop = 0;
      if (this.$refs.categoryScroll) this.$refs.categoryScroll.scrollTop = 0;
      if (this.$refs.categoryAllScroll)
        this.$refs.categoryAllScroll.scrollTop = 0;
      if (this.$refs.typeScroll) this.$refs.typeScroll.scrollTop = 0;
      if (this.$refs.saleScroll) this.$refs.saleScroll.scrollTop = 0;
    },
    slicePerWidth(products) {
      return products.slice(0, this.maxPerScreen);
    },
    slicePerWidthWithLines(products) {
      var perLine = Math.floor(window.innerWidth / 155);
      var minProducts = Math.min(perLine * 2 - 1, 21);
      return products.slice(0, minProducts);
    },
    scrollXProducts(e) {
      this.$refs["scrollProducts"].scrollLeft += e.deltaY;
    },
    scrollXCategoriesAB(e) {
      this.$refs["scrollCategoriesAB"].scrollLeft += e.deltaY;
    },
    scrollXCategories(e) {
      this.$refs["scrollCategories"].scrollLeft += e.deltaY;
    },
    scrollXCollections(e) {
      this.$refs["scrollCollections"].scrollLeft += e.deltaY;
    },
    scrollToTop() {
      this.$refs.generalScroll.scrollTop = 0;
      setTimeout(() => {
        this.topButton = false
      }, 1000);
    },
    hasScroll(scroll) {
      if (scroll && scroll.scrollWidth > scroll.clientWidth) {
        return true;
      } else return false;
    },
    addScrollX(scroll, direction) {
      if (scroll) scroll.scrollLeft += 50 * direction;
    },
    runSearch() {
      this.$router.push({
        path: `/busca/${this.keyword}`,
        params: { keyword: this.keyword },
      });
    },
    clearSearch(){
      this.keyword = null;
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
    loadMoreProducts() {
      this.isLoading = true
      this.resetScrolls(this.viewType, "product-type")
      this.addParamsToLocation({ page: this.currentPage })
      this.getCatalogByProductTypePaginated({ productTypeId: this.selectedProductType.productTypeId, filters: this.activeFilters, items: this.maxPerScreenProductType * this.maxLines }).then(() => {
        this.isLoading = false
      })
    },
    loadMoreProductsCategoryAllProducts() {
      this.loading = true;
      this.isLoading = true;
      this.addParamsToLocation({ page: this.categoryAllProductsPage })
      this.resetScrolls(this.viewType, "category-all-products")
      this.getAllProductsByCategory({ family: this.selectedFamily.replace(".", "_").replace("/", "@"),
                                      category: this.selectedCategory.replace(".", "_").replace("/", "@"),
                                      page: this.categoryAllProductsPage,
                                      items: this.maxPerScreenCategory * (this.maxLines + 2)
      }).then(() => {
        this.loading = false;
        this.isLoading = false;
      });
    },
    addParamsToLocation(params) {
      history.pushState(
        {},
        null,
        this.$route.path +
          '?' +
          Object.keys(params)
            .map(key => {
              return (
                encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
              )
            })
            .join('&')
      )
    }
  },

  components: {
    ProductCard,
    FiltersSidebarStore,
    ProductsFilterStore,
    VFooter,
    NavigationModal,
  },
};
</script>

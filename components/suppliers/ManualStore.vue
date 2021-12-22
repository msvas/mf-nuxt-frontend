
<template>
  <div>
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
    <store-location-modal
      :openPopup="openLocation"
      :supplier="supplier"
      @allow-zipcode="allowZipcode"
      @update-modal="updateLocationModal"
      v-if="supplier"
    />
    <out-of-region-modal :openPopup="outOfRegionModal" v-if="supplier" />
    <span
      v-if="allowAccess && regionCanAccess && supplier && supplier.user && !supplier.user.isAutomatic && supplier.user.supplierStatus == 'Liberado'"
    >
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
      <SafariMobileCompatibilityWarning :supplier="supplier" :open="openSafariWarning" @closed-safari-warning-modal="closeSafariWarning" />
      <div
        v-if="mobileBrowser"
        class="content-wrapper pb-0 pt-0"
        style="
          max-height: calc(100vh - 8.4em);
          overflow-y: hidden;
          overflow-x: hidden;
          padding-right: 3px !important;
          padding-left: 3px !important;
        "
      >
        <div
          class="content-body p-0 m-0"
          v-if="supplier"
          ref="generalScroll"
          v-on:scroll.passive="showTopButton()"
          style="
            max-height: calc(100vh - 5.3em);
            overflow-x: hidden;
            overflow-y: scroll;
            scroll-behavior: smooth;
            background-color: #ebebeb;
          "
        >
          <div
            v-if="topButton"
            ref="backToTop"
            href="javascript:void(0);"
            @click="scrollToTop()"
            class="position-fixed btn btn-success"
            style="bottom: 80px; right: 25px; z-index: 100; padding: 8px"
          >
            <span style="vertical-align: text-top">Todas categorias</span>
            <i class="feather icon-chevron-up" style="color: white"></i>
          </div>
          <div
            class="row align-items-center"
            style="background: white; position: sticky; top: 0; z-index: 800"
          >
            <!-- <div class="m-0 pl-2 pr-0" style="padding-top: 10px; padding-bottom: 5px; flex: 0 0 15%; max-width: 15%;">
                <img
                  v-if="supplier.picture"
                  :src="supplier.picture"
                  alt="*"
                  width="auto"
                  height="35"
                />
                <img
                  v-else
                  :src="require(`@/assets/images/avatar-default.png`)"
                  alt="*"
                  width="auto"
                  height="35"
                />
              </div> -->
            <div
              class="m-0 pr-0"
              style="
                padding-top: 10px;
                padding-bottom: 5px;
                padding-left: 1rem;
                flex: 0 0 58%;
                max-width: 58%;
              "
            >
              <span
                class="m-0 font-weight-bold font-medium-2"
                style="
                  overflow: hidden !important;
                  text-overflow: ellipsis;
                  max-width: 48vw;
                  display: inline-block;
                  white-space: nowrap;
                  margin-bottom: -6px !important;
                  margin-left: 3px !important;
                "
                >{{ supplier.user.name }}</span
              >
              <br />
              <vs-button
                @click="shareOnWhatsapp()"
                color="#00bfa5"
                type="filled"
                style="
                  padding: 3px 5px;
                  margin-left: 3px;
                  margin-right: 0px;
                  margin-top: 5px;
                  font-size: 13px;
                "
              >
                <i class="fa fa-whatsapp mr-50"></i>Whatsapp
              </vs-button>
              <a
                @click="this.sendContactNotification()"
                :href="'tel:' + supplier.user.phone"
                style="margin-top: 5px; margin-left: 3px; font-size: 12px"
                >{{ supplier.user.phone }}</a
              >
              <supplier-info-modal
                :supplier="supplier"
                :openPopup="openSupplierInfo"
                @update-popup="updateSupplierPopup"
              />
            </div>
            <div
              class="m-0 pr-1"
              style="
                margin-top: -10px !important;
                padding-top: 0px;
                padding-bottom: 5px;
                flex: 0 0 42%;
                max-width: 42%;
              "
            >
              <span
                class="badge badge-pill font-small-2 float-right"
                style="
                  margin-right: 5px;
                  background-color: #b3b3b3;
                  padding: 4px 4px;
                "
                >Min. {{ supplier.minimumOrderValue }}</span
              ><br />
              <a
                class="font-small-3 float-right"
                href="javascript:void(0);"
                @click="openSupplierInfo = true"
                style="margin-right: 7px"
              >
                Ver mais
              </a>
            </div>
            <div
              class="m-0 p-0"
              style="width: 100%; border-bottom: 5px solid #f8f8f8"
            ></div>
          </div>
          <div style="background: #ededed; border-bottom: solid 1px #d5d5d5">
            <div class="navigations-container">
              <div class="w-100 d-flex no-wrap">
                <vs-chip class="chip-mf">
                  <a
                    @click="
                      openNavigationsModal(
                        'family-collections',
                        'Alimentos e bebidas'
                      )
                    "
                  >
                    Todos os produtos
                    <i class="feather icon-chevron-down"></i>
                  </a>
                </vs-chip>
                <div style="width: 40%">
                  <form
                    @submit.prevent="runSupplierSearch()"
                    style="margin-left: 10px"
                  >
                    <input
                      id="search2"
                      type="text"
                      placeholder="Buscar..."
                      v-model="keyword"
                      style="
                        font-size: 1rem;
                        border: 2px solid rgb(12, 182, 149);
                        border-radius: 5px;
                        width: 80%;
                        padding: 4px;
                      "
                    />
                    <i class="feather icon-x" style="margin-left: -15%" />
                    <i
                      class="feather icon-search"
                      @click="runSupplierSearch()"
                      style="
                        background-color: rgb(12, 182, 149);
                        font-size: 18px;
                        padding: 7px;
                        border-bottom-right-radius: 5px;
                        border-top-right-radius: 5px;
                        vertical-align: text-bottom;
                      "
                    />
                  </form>
                </div>
              </div>
            </div>
            <div
              v-if="selectedFamily"
              ref="navigations-container-scroll"
              class="navigations-container no-scrollbar"
              style="overflow-x: scroll"
            >
              <vs-chip
                v-if="selectedFamily"
                :class="
                  selectedCollection || selectedCategory
                    ? 'chip-mf'
                    : 'chip-mf-selected'
                "
              >
                <a
                  v-if="selectedFamily == 'Alimentos e bebidas'"
                  @click="
                    openNavigationsModal('family-collections', selectedFamily)
                  "
                  :style="selectedFamily ? 'color: #008567;' : ''"
                >
                  {{ familyNameAbreviation(selectedFamily) }}
                  <span v-if="!selectedCollection && selectedCollection != ''"
                    >(tudo)</span
                  >
                  <i class="feather icon-chevron-down"></i>
                </a>
                <a
                  v-else
                  @click="openNavigationsModal('collection', selectedFamily)"
                >
                  {{ familyNameAbreviation(selectedFamily) }}
                  <span v-if="!selectedCollection && selectedCollection != ''"
                    >(tudo)</span
                  >
                  <i class="feather icon-chevron-down"></i>
                </a>
              </vs-chip>

              <span
                v-for="(collection, index) in collectionsFromFamily(
                  selectedFamily
                )"
                :key="index"
                :vs-value="index"
                style="flex: 0 0 auto; width: auto"
              >
                <vs-chip
                  v-if="index == selectedCollection && selectedCollection != ''"
                  :class="selectedCategory ? 'chip-mf' : 'chip-mf-selected'"
                >
                  <a
                    @click="openNavigationsModal('collection', selectedFamily)"
                    :style="selectedCollection ? 'color: #008567;' : ''"
                  >
                    {{ index }}
                    <span v-if="!selectedCategory && selectedCollection"
                      >(tudo)</span
                    >
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
                  <a
                    @click="
                      openNavigationsModal(
                        'category-all-products',
                        selectedFamily
                      )
                    "
                    :style="selectedCategory ? 'color: #008567;' : ''"
                  >
                    {{ selectedCategory }}
                    <span v-if="!selectedProductType && selectedCategory"
                      >(tudo)</span
                    >
                    <i class="feather icon-chevron-down"></i>
                  </a>
                </vs-chip>
              </span>

              <span
                v-for="type in productsFromCategory(
                  selectedCategory,
                  selectedFamily,
                  selectedCollection,
                  true
                )"
                :key="type.text"
                :vs-value="type.text"
                style="flex: 0 0 auto; width: auto"
              >
                <vs-chip
                  v-if="
                    selectedProductType &&
                    type.value == selectedProductType.productTypeId
                  "
                  class="chip-mf-selected"
                >
                  <a
                    @click="
                      openNavigationsModal('product-type', selectedFamily)
                    "
                  >
                    {{ type.text }}
                    <i class="feather icon-chevron-down"></i>
                  </a>
                </vs-chip>
              </span>
              <vs-chip class="chip-mf" style="visibility: hidden">a</vs-chip>
            </div>
            <div
              class="navigations-container"
              v-if="
                viewType == 'product-type' &&
                (productsFromType(selectedProductType).length > 1 ||
                  hasFilters(selectedProductType))
              "
            >
              <div class="p-0" style="background: white">
                <add-all-button
                  v-if="!loadingProducts"
                  :productIds="this.getIdsToSelectAll()"
                  :count="true"
                  :supplierId="this.supplier.id"
                />
              </div>
              <div
                style="
                  padding: 0.75rem 1rem;
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
                  class="font-small-3"
                  @click="clearAllFilters()"
                  v-if="hasFilters(selectedProductType)"
                  >Limpar</a
                >
                <span class="dot" v-if="hasFilters(selectedProductType)"></span>
                <a
                  style="
                    border-bottom: 1px solid #007bff;
                    padding-bottom: 1px;
                    color: #007bff;
                  "
                  class="font-medium-2"
                  @click="clickSidebar(selectedProductType)"
                  >Filtrar</a
                >
              </div>
            </div>
            <div
              v-if="viewType == 'sale'"
              class="row pr-1"
              style="border-top: solid 1px LightGrey; padding-left: 10px"
            >
              <div
                class="col-12 m-0 pr-0 pt-1 pl-1"
                style="padding-bottom: 8px"
              >
                <h5 class style="margin: 0">Ofertas</h5>
              </div>
            </div>
          </div>
          <div v-if="catalog" class="row p-0 m-0" style="display: contents">
            <div class="col-12 p-0 m-0" style id="products">
              <div>
                <div class="vh-100" ref="desktopScroll">
                  <div class="mb-2" style="background-color: #ebebeb">
                    <div></div>
                    <div style="background-color: #ebebeb">
                      <!-- visao por familia -->
                      <div v-if="viewType == 'family'" style>
                        <div
                          class="mb-4"
                          v-for="(family, index) in catalog"
                          :key="'family-' + index"
                          style="background-color: #ebebeb; overflow-x: scroll"
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="
                              position: sticky;
                              left: 0;
                              background-color: #ebebeb;
                            "
                          >
                            <div class="m-0 p-0 pt-1 pb-1">
                              <h4
                                class
                                style="
                                  font-size: 26px;
                                  font-weight: 300;
                                  margin: 0 0 0 8px;
                                  color: #666;
                                "
                              >
                                {{ index }}
                              </h4>
                            </div>
                            <div class="pl-2 m-0 p-0 pt-2 pb-1">
                              <nuxt-link
                                v-if="index == 'Alimentos e bebidas'"
                                :to="{
                                  name: 'public-store-family',
                                  params: {
                                    supplierSlug: slug,
                                    familyName: formatString(index),
                                  },
                                }"
                                style="color: blue"
                                >Ver tudo</nuxt-link
                              >
                              <nuxt-link
                                v-else
                                :to="{
                                  name: 'public-store-family',
                                  params: {
                                    supplierSlug: slug,
                                    familyName: formatString(index),
                                  },
                                }"
                                style="color: blue"
                                >Ver tudo</nuxt-link
                              >
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
                              v-for="product in productsFromFamily(index).slice(
                                0,
                                6
                              )"
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
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline"
                                    >{{ product.productTypeName }}</a
                                  >
                                </h6>
                              </div>
                              <div
                                class="card font-small-3 mb-1"
                                style="margin-right: 10px"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <ProductCardManualStore
                                    :product="product"
                                    @fill-location="openLocationPopup"
                                    @open-safari-warning="openSafariWarningModal"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="productsFromFamily(index).length >= 6"
                              style="
                                width: 160px;
                                height: 120px;
                                margin-top: 25px;
                                margin-right: 7px;
                                margin-left: 3px;
                              "
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">
                                    Veja mais produtos deste tipo.
                                  </div>
                                  <div class="col-12 mt-1">
                                    <nuxt-link
                                      :to="{
                                        name: 'public-store-family',
                                        params: {
                                          supplierSlug: slug,
                                          familyName: formatString(index),
                                        },
                                      }"
                                      class="btn btn-primary w-100"
                                      style="
                                        padding-left: 3px;
                                        padding-right: 3px;
                                      "
                                    >
                                      <span class="font-medium-1 align-middle"
                                        >Ver tudo</span
                                      >
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
                          style="margin-top: 50px"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao da familia alim e bebidas -->
                      <div
                        v-if="viewType == 'family-collections'"
                        ref="familyScroll"
                        style
                      >
                        <div
                          class="mb-4"
                          v-for="collection in collectionProducts"
                          :key="'collection-' + collection.collection"
                          style="background-color: #ebebeb; overflow-x: scroll"
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="
                              position: sticky;
                              left: 0;
                              background-color: #ebebeb;
                            "
                          >
                            <div class="m-0 p-0 pt-1 pb-1">
                              <h4
                                class
                                style="
                                  font-size: 26px;
                                  font-weight: 300;
                                  margin: 0 0 0 8px;
                                  color: #666;
                                "
                              >
                                {{ collection.collection }}
                              </h4>
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
                                >Ver tudo</a
                              >
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="
                              'margin-top: 10px; overflow-x: scroll; width: ' +
                              calcWidth(
                                collection.products.slice(0, 6).length
                              ) +
                              'px;'
                            "
                          >
                            <span
                              v-for="product in collection.products.slice(0, 6)"
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
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline"
                                    >{{ product.productTypeName }}</a
                                  >
                                </h6>
                              </div>
                              <div
                                class="card font-small-3 mb-1"
                                style="margin-right: 10px"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <ProductCardManualStore
                                    :product="product"
                                    @fill-location="openLocationPopup"
                                    @open-safari-warning="openSafariWarningModal"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="collection.products.length >= 6"
                              style="
                                width: 160px;
                                height: 120px;
                                margin-top: 25px;
                                margin-right: 7px;
                                margin-left: 3px;
                              "
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">
                                    Veja mais produtos deste tipo.
                                  </div>
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
                                      style="
                                        padding-left: 3px;
                                        padding-right: 3px;
                                      "
                                    >
                                      <span class="font-medium-1 align-middle"
                                        >Ver tudo</span
                                      >
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
                          style="margin-top: 50px"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao por colecao -->
                      <div
                        v-if="viewType == 'collection'"
                        ref="collectionScroll"
                        style
                      >
                        <div ref="collectionCategories">
                          <div
                            class="mb-4"
                            v-for="category in categoryProducts"
                            :key="'category-' + category.category"
                            style="background-color: #ebebeb"
                          >
                            <div
                              class="row mt-1 mb-1 m-0"
                              style="background-color: #ebebeb"
                            >
                              <div class="m-0 p-0 pt-1 pb-1">
                                <h4
                                  class
                                  style="
                                    font-size: 26px;
                                    font-weight: 300;
                                    margin: 0 0 0 8px;
                                    color: #666;
                                  "
                                >
                                  {{ category.category }}
                                </h4>
                              </div>
                              <div class="pl-2 m-0 p-0 pt-2 pb-1">
                                <!-- <a
                                  v-if="selectedFamily == 'Alimentos e bebidas'"
                                  href="javascript:void(0)"
                                  @click="selectedCategoryAllProducts({ family: selectedFamily, category: category.category, collection: selectedCollection })"
                                >Ver tudo</a> -->
                                <nuxt-link
                                  :to="{
                                    name: 'public-store-category',
                                    params: {
                                      supplierSlug: slug,
                                      familyName: formatString(selectedFamily),
                                      categoryName: formatString(
                                        category.category
                                      ),
                                    },
                                  }"
                                  >Ver tudo</nuxt-link
                                >
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
                                          >{{ product.productTypeName }}</a
                                        >
                                      </h6>
                                    </div>
                                    <div
                                      class="card font-small-3 mb-1"
                                      style="margin-right: 10px"
                                    >
                                      <div
                                        class="card-body pl-1 pr-1 pt-0 pb-0"
                                      >
                                        <ProductCardManualStore
                                          :product="product"
                                          @fill-location="openLocationPopup"
                                          @open-safari-warning="openSafariWarningModal"
                                        />
                                      </div>
                                    </div>
                                  </span>
                                  <div
                                    class="card font-small-3"
                                    v-if="category.products.length >= 12"
                                    style="
                                      width: 160px;
                                      height: 120px;
                                      margin-top: 25px;
                                      margin-right: 7px;
                                      margin-left: 3px;
                                    "
                                  >
                                    <div class="card-body p-1">
                                      <div class="row">
                                        <div class="col-12 text-center">
                                          Veja mais produtos deste tipo.
                                        </div>
                                        <div class="col-12 mt-1">
                                          <!-- <button
                                            v-if="selectedFamily == 'Alimentos e bebidas'"
                                            href="javascript:void(0)"
                                            @click="selectedCategoryAllProducts({ family: selectedFamily, category: category.category, collection: selectedCollection })"
                                            type="button"
                                            class="btn btn-primary w-100"
                                            style="padding-left: 3px; padding-right: 3px;"
                                          >
                                            <span class="font-medium-1 align-middle">Ver tudo</span>
                                          </button> -->
                                          <nuxt-link
                                            :to="{
                                              name: 'public-store-category',
                                              params: {
                                                supplierSlug: slug,
                                                familyName:
                                                  formatString(selectedFamily),
                                                categoryName: formatString(
                                                  category.category
                                                ),
                                              },
                                            }"
                                            class="btn btn-primary w-100"
                                            style="
                                              padding-left: 3px;
                                              padding-right: 3px;
                                            "
                                          >
                                            <span
                                              class="font-medium-1 align-middle"
                                              >Ver tudo</span
                                            >
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
                          style="margin-top: 50px"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao por categoria -->
                      <div
                        v-if="viewType == 'category'"
                        ref="categoryScroll"
                        style
                      >
                        <div
                          class="mb-4"
                          v-for="type in typeProducts"
                          :key="'type-' + type.type.productTypeId"
                          style="background-color: #ebebeb; overflow-x: scroll"
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="
                              position: sticky;
                              left: 0;
                              background-color: #ebebeb;
                            "
                          >
                            <div class="m-0 p-0 pt-1 pb-1">
                              <h4
                                class
                                style="
                                  font-size: 26px;
                                  font-weight: 300;
                                  margin: 0 0 0 8px;
                                  color: #666;
                                "
                              >
                                {{ type.type.productType }}
                              </h4>
                            </div>
                            <div class="pl-2 m-0 p-0 pt-2 pb-1">
                              <nuxt-link
                                :to="{
                                  name: 'public-store-product',
                                  params: {
                                    supplierSlug: slug,
                                    familyName: formatString(selectedFamily),
                                    categoryName:
                                      formatString(selectedCategory),
                                    productTypeName: formatString(
                                      type.type.productType
                                    ),
                                  },
                                }"
                                >Ver tudo</nuxt-link
                              >
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
                                    >{{ product.productTypeName }}</a
                                  >
                                </h6>
                              </div>
                              <div
                                class="card font-small-3 mb-1"
                                style="margin-right: 10px"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <ProductCardManualStore
                                    :product="product"
                                    @fill-location="openLocationPopup"
                                    @open-safari-warning="openSafariWarningModal"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="type.products.length >= 6"
                              style="
                                width: 160px;
                                height: 120px;
                                margin-top: 25px;
                                margin-right: 7px;
                                margin-left: 3px;
                              "
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">
                                    Veja mais produtos deste tipo.
                                  </div>
                                  <div class="col-12 mt-1">
                                    <nuxt-link
                                      :to="{
                                        name: 'public-store-product',
                                        params: {
                                          supplierSlug: slug,
                                          familyName:
                                            formatString(selectedFamily),
                                          categoryName:
                                            formatString(selectedCategory),
                                          productTypeName: formatString(
                                            type.type.productType
                                          ),
                                        },
                                      }"
                                      class="btn btn-primary w-100"
                                      style="
                                        padding-left: 3px;
                                        padding-right: 3px;
                                      "
                                    >
                                      <span class="font-medium-1 align-middle"
                                        >Ver tudo</span
                                      >
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
                          style="margin-top: 50px"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-4 mb-4"></div>
                      </div>
                      <!-- visao por categoria com todos os produtos -->
                      <div
                        v-if="viewType == 'category-all-products'"
                        ref="categoryAllScroll"
                        style
                      >
                        <div
                          class="row justify-content-center pl-1"
                          style="background-color: #ebebeb; overflow-x: hidden"
                        >
                          <div class="col-12 p-0 m-0">
                            <div
                              class="row justify-content-center"
                              style="
                                margin-top: 10px;
                                padding-bottom: 3rem;
                                overflow-x: hidden;
                              "
                            >
                              <span
                                v-for="product in supplierProducts"
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
                                    <a
                                      @click="clickedProductTitle(product)"
                                      style="text-decoration: underline"
                                      >{{ product.productTypeName }}</a
                                    >
                                  </h6>
                                </div>
                                <div
                                  class="card font-small-3 mb-1"
                                  style="margin-right: 10px"
                                >
                                  <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                    <ProductCardManualStore
                                      :product="product"
                                      @fill-location="openLocationPopup"
                                      @open-safari-warning="openSafariWarningModal"
                                    />
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>

                          <b-pagination
                            v-if="categoryAllProductsTotalPages"
                            v-model="categoryAllProductsPage"
                            @input="loadMoreProductsCategoryAllProducts()"
                            :total-rows="
                              categoryAllProductsTotalPages *
                              maxPerScreenProductType *
                              (maxLines + 2)
                            "
                            :per-page="maxPerScreenProductType * (maxLines + 2)"
                          ></b-pagination>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <div
                        v-if="viewType == 'product-type'"
                        ref="typeScroll"
                        style="background-color: #ebebeb; padding-bottom: 5em"
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
                            <div
                              class="card font-small-3 mb-1"
                              style="margin-right: 10px"
                            >
                              <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                <ProductCardManualStore
                                  :product="product"
                                  @fill-location="openLocationPopup"
                                  @open-safari-warning="openSafariWarningModal"
                                />
                              </div>
                            </div>
                          </span>
                        </div>
                        <div
                          style="
                            margin-top: 0px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: center;
                            background-color: #ebebeb;
                          "
                        >
                          <b-pagination
                            v-if="allowPagination"
                            v-model="currentPage"
                            @input="loadMoreProducts()"
                            :total-rows="
                              totalPages * maxPerScreenProductType * maxLines
                            "
                            :per-page="maxPerScreenProductType * maxLines"
                          ></b-pagination>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                    </div>
                    <v-footer
                      :class="
                        this.mobileBrowser == false ? 'desktop' : 'mobile'
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            <filters-sidebar-store
              v-if="selectedProductType"
              ref="filtersVertical"
              :openSidebar="openSidebar"
              :productTypeId="selectedProductType.productTypeId"
              :supplierId="supplier.id"
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
        style="padding-left: 5px; padding-right: 5px; padding-top: 3px"
      >
        <div
          class="content-body p-0 m-0"
          v-if="supplier"
          ref="generalScroll"
          v-on:scroll.passive="showTopButton()"
          style="
            max-height: calc(100vh - 5em);
            overflow-y: scroll;
            overflow-x: hidden;
            scroll-behavior: smooth;
            background-color: #ebebeb;
          "
        >
          <div
            class="row"
            style="
              z-index: 1000;
              padding: 5px 20px 0px 20px;
              background-color: white;
              position: -webkit-sticky;
              position: sticky;
              top: 0px;
            "
          >
            <div class="col-1 m-0 p-0 text-center">
              <a
                id="store-home-button"
                @click="storeHome()"
                href="javascript:void(0)"
              >
                <img
                  v-if="supplier.picture"
                  :src="supplier.picture"
                  alt="*"
                  width="auto"
                  height="45"
                />
                <img
                  v-else
                  :src="require(`@/assets/images/avatar-default.png`)"
                  alt="*"
                  width="auto"
                  height="45"
                />
              </a>
            </div>
            <div class="col-7 m-0 p-0">
              <h3 class="m-0 font-weight-bold">{{ supplier.user.name }}</h3>
              <vs-button
                @click="shareOnWhatsapp()"
                color="#00bfa5"
                type="filled"
                style="
                  padding: 3px 10px;
                  margin-left: 0;
                  margin-top: 3px;
                  margin-right: 7px;
                  margin-bottom: 5px;
                "
              >
                <i class="fa fa-whatsapp mr-50"></i>Falar no Whatsapp
              </vs-button>
              <a
                @click="sendContactNotification()"
                :href="'tel:' + supplier.user.phone"
                >{{ supplier.user.phone }}</a
              >
              <supplier-info-modal
                :supplier="supplier"
                :openPopup="openSupplierInfo"
                @update-popup="updateSupplierPopup"
              />
            </div>
            <div class="col-4 m-0 p-0">
              <div class="row">
                <div class="col-12">
                  <span
                    class="badge badge-pill float-right font-small-3"
                    style="background-color: #b3b3b3"
                    >Min. {{ supplier.minimumOrderValue }}</span
                  >
                  <a
                    class="float-right mr-2"
                    href="javascript:void(0);"
                    @click="openSupplierInfo = true"
                    >Ver mais</a
                  >
                </div>
              </div>
              <div class="row" style="margin-top: 5px">
                <div class="col-12">
                  <span
                    class="badge badge-pill float-right font-small-3"
                    style="background-color: #b3b3b3"
                    v-if="!supplier.deliveryEstimate"
                    >Não faz entrega</span
                  >
                </div>
              </div>
            </div>
            <div
              class="m-0 p-0"
              style="width: 100%; border-bottom: 5px solid #f8f8f8"
            ></div>
          </div>
          <div
            v-if="topButton"
            ref="backToTop"
            href="javascript:void(0);"
            @click="scrollToTop()"
            class="position-fixed btn btn-success"
            style="bottom: 20px; right: 30px; z-index: 100; padding: 8px"
          >
            <span style="vertical-align: text-top">Todas categorias</span>
            <i class="feather icon-chevron-up" style="color: white"></i>
          </div>
          <div style="background: #ededed; border-bottom: solid 1px #d5d5d5">
            <div class="navigations-container d-flex">
              <div v-if="!selectedFamily">
                <span v-for="(family, index) in catalog" :key="index">
                  <vs-chip class="chip-mf">
                    <a
                      href="javascript:void(0)"
                      v-if="selectedFamily == 'Alimentos e bebidas'"
                      @click="openNavigationsModal('family-collections', index)"
                    >
                      {{ index }}
                      <i class="feather icon-chevron-down"></i>
                    </a>
                    <a
                      href="javascript:void(0)"
                      v-else
                      @click="openNavigationsModal('collection', index)"
                    >
                      {{ index }}
                      <i class="feather icon-chevron-down"></i>
                    </a>
                  </vs-chip>
                </span>
              </div>
              <div v-else>
                <vs-chip class="chip-mf">
                  <i
                    @click="storeHome()"
                    class="ficon feather icon-home"
                    style="font-size: 15px"
                  />
                </vs-chip>
                <span
                  v-for="(family, index) in catalog"
                  :key="index"
                  style="flex: 0 0 auto; width: auto; color: black"
                >
                  <vs-chip
                    v-if="index == selectedFamily"
                    :class="
                      selectedCollection || selectedCategory
                        ? 'chip-mf'
                        : 'chip-mf-selected'
                    "
                  >
                    <a
                      href="javascript:void(0)"
                      v-if="selectedFamily == 'Alimentos e bebidas'"
                      @click="openNavigationsModal('family-collections', index)"
                      :style="selectedFamily ? 'color: #008567;' : ''"
                    >
                      {{ index }}
                      <span
                        v-if="!selectedCollection && selectedCollection != ''"
                        >(tudo)</span
                      >
                      <i class="feather icon-chevron-down"></i>
                    </a>
                    <a
                      href="javascript:void(0)"
                      v-else
                      @click="openNavigationsModal('collection', index)"
                      :style="selectedFamily ? 'color: #008567;' : ''"
                    >
                      {{ index }}
                      <span
                        v-if="!selectedCollection && selectedCollection != ''"
                        >(tudo)</span
                      >
                      <i class="feather icon-chevron-down"></i>
                    </a>
                  </vs-chip>
                </span>
                <span
                  v-for="(collection, index) in collectionsFromFamily(
                    selectedFamily
                  )"
                  :key="index"
                  :vs-value="index"
                  style="flex: 0 0 auto; width: auto"
                >
                  <vs-chip
                    v-if="
                      index == selectedCollection && selectedCollection != ''
                    "
                    :class="selectedCategory ? 'chip-mf' : 'chip-mf-selected'"
                  >
                    <a
                      v-if="selectedCollection != ''"
                      @click="
                        openNavigationsModal('collection', selectedFamily)
                      "
                      :style="selectedCollection ? 'color: #008567;' : ''"
                    >
                      {{ index }}
                      <span v-if="!selectedCategory && selectedCollection"
                        >(tudo)</span
                      >
                      <i class="feather icon-chevron-down"></i>
                    </a>
                    <a
                      v-else
                      @click="
                        openNavigationsModal(
                          'family-collections',
                          selectedFamily
                        )
                      "
                      :style="selectedCollection ? 'color: #008567;' : ''"
                    >
                      {{ index }}
                      <span v-if="!selectedCategory && selectedCollection"
                        >(tudo)</span
                      >
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
                    :class="
                      selectedProductType ? 'chip-mf' : 'chip-mf-selected'
                    "
                  >
                    <a
                      v-if="viewType == 'product-type'"
                      @click="
                        openNavigationsModal(
                          'category-all-products',
                          selectedFamily
                        )
                      "
                      :style="selectedCategory ? 'color: #008567;' : ''"
                    >
                      {{ selectedCategory }}
                      <span v-if="!selectedProductType && selectedCategory"
                        >(tudo)</span
                      >
                      <i class="feather icon-chevron-down"></i>
                    </a>
                    <a
                      v-else
                      @click="
                        openNavigationsModal('collection', selectedFamily)
                      "
                      :style="selectedCategory ? 'color: #008567;' : ''"
                    >
                      {{ selectedCategory }}
                      <span v-if="!selectedProductType && selectedCategory"
                        >(tudo)</span
                      >
                      <i class="feather icon-chevron-down"></i>
                    </a>
                  </vs-chip>
                </span>
                <span
                  v-for="type in productsFromCategory(
                    selectedCategory,
                    selectedFamily,
                    selectedCollection,
                    true
                  )"
                  :key="type.text"
                  :vs-value="type.text"
                  style="flex: 0 0 auto; width: auto"
                >
                  <vs-chip
                    v-if="
                      selectedProductType &&
                      type.value == selectedProductType.productTypeId
                    "
                    class="chip-mf-selected"
                    alt="type.text"
                  >
                    <a
                      v-if="type.text.length > 16"
                      @click="
                        openNavigationsModal('product-type', selectedFamily)
                      "
                    >
                      {{ type.text.substring(0, type.text.length - 9) }}...
                      <span>(tudo)</span>
                      <i class="feather icon-chevron-down"></i>
                    </a>
                    <a
                      v-else
                      @click="
                        openNavigationsModal('product-type', selectedFamily)
                      "
                    >
                      {{ type.text }}
                      <span>(tudo)</span>
                      <i class="feather icon-chevron-down"></i>
                    </a>
                  </vs-chip>
                </span>
              </div>
              <div style="max-width: 50%">
                <form
                  @submit.prevent="runSupplierSearch()"
                  style="margin-right: -20px"
                >
                  <input
                    id="search2"
                    type="text"
                    placeholder="Buscar..."
                    v-model="keyword"
                    style="
                      font-size: 1rem;
                      border: 2px solid rgb(12, 182, 149);
                      border-radius: 5px;
                      width: auto;
                      padding: 5px;
                    "
                  />
                  <i class="feather icon-x" style="margin-left: -15%" />
                  <i
                    class="feather icon-search"
                    @click="runSupplierSearch()"
                    style="
                      background-color: rgb(12, 182, 149);
                      font-size: 18px;
                      padding: 8px;
                      border-bottom-right-radius: 5px;
                      border-top-right-radius: 5px;
                      vertical-align: text-bottom;
                    "
                  />
                </form>
              </div>
            </div>
            <div
              class="navigations-container"
              v-if="
                viewType == 'product-type' &&
                (productsFromType(selectedProductType).length > 1 ||
                  hasFilters(selectedProductType))
              "
            >
              <div class="p-0" style="background: white">
                <add-all-button
                  v-if="!loadingProducts"
                  :productIds="this.getIdsToSelectAll()"
                  :count="true"
                  :supplierId="this.supplier.id"
                />
              </div>
              <div
                style="
                  padding: 0.75rem 1rem;
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
                  class="font-small-3"
                  @click="clearAllFilters()"
                  v-if="hasFilters(selectedProductType)"
                  >Limpar</a
                >
                <span class="dot" v-if="hasFilters(selectedProductType)"></span>
                <a
                  style="
                    border-bottom: 1px solid #007bff;
                    padding-bottom: 1px;
                    color: #007bff;
                  "
                  class="font-medium-2"
                  @click="clickSidebar(selectedProductType)"
                  >Filtrar {{ selectedProductType.productType }}</a
                >
              </div>
            </div>
          </div>
          <div v-if="catalog" class="row p-0 m-0" style="display: contents">
            <div
              class="col-12 p-0 m-0"
              ref="productsWindow"
              style
              id="products"
            >
              <div>
                <div class="vh-100" ref="desktopScroll">
                  <div class="mb-2" ref="content">
                    <div></div>
                    <div style="background-color: #ebebeb">
                      <!-- visao por familia -->
                      <div v-if="viewType == 'family'" style>
                        <div
                          class="mb-4"
                          v-for="(family, index) in catalog"
                          :key="'family-' + index"
                          style="background-color: #ebebeb"
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="
                              position: sticky;
                              left: 0;
                              background-color: #ebebeb;
                            "
                          >
                            <div class="m-0 p-0 pt-1 pb-1">
                              <h4
                                class
                                style="
                                  font-size: 26px;
                                  font-weight: 300;
                                  margin: 0 0 0 8px;
                                  color: #666;
                                "
                              >
                                {{ index }}
                              </h4>
                            </div>
                            <div class="pl-2 m-0 p-0 pt-2 pb-1">
                              <nuxt-link
                                class="float-right pr-1"
                                v-if="index == 'Alimentos e bebidas'"
                                :to="{
                                  name: 'public-store-family',
                                  params: {
                                    supplierSlug: slug,
                                    familyName: formatString(index),
                                  },
                                }"
                                >Ver tudo</nuxt-link
                              >
                              <nuxt-link
                                class="float-right pr-1"
                                v-else
                                :to="{
                                  name: 'public-store-family',
                                  params: {
                                    supplierSlug: slug,
                                    familyName: formatString(index),
                                  },
                                }"
                                >Ver tudo</nuxt-link
                              >
                            </div>
                          </div>
                          <div class="row pl-1" :style="'margin-top: 10px;'">
                            <span
                              v-for="product in slicePerWidth(
                                productsFromFamily(index)
                              )"
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
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline"
                                    >{{ product.productTypeName }}</a
                                  >
                                </h6>
                              </div>
                              <div
                                class="card font-small-3 mb-1"
                                style="margin-right: 10px"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <ProductCardManualStore
                                    :product="product"
                                    @fill-location="openLocationPopup"
                                    @open-safari-warning="openSafariWarningModal"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="
                                productsFromFamily(index).length >
                                slicePerWidth(productsFromFamily(index)).length
                              "
                              style="
                                width: 160px;
                                height: 120px;
                                margin-top: 25px;
                                margin-right: 7px;
                                margin-left: 3px;
                              "
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">
                                    Veja mais produtos deste tipo.
                                  </div>
                                  <div class="col-12 mt-1">
                                    <nuxt-link
                                      :to="{
                                        name: 'public-store-family',
                                        params: {
                                          supplierSlug: slug,
                                          familyName: formatString(index),
                                        },
                                      }"
                                      class="btn btn-primary w-100"
                                      style="
                                        padding-left: 3px;
                                        padding-right: 3px;
                                      "
                                    >
                                      <span class="font-medium-1 align-middle"
                                        >Ver tudo</span
                                      >
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
                          style="margin-top: 50px"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao da familia alim e bebidas -->
                      <div
                        v-if="viewType == 'family-collections'"
                        ref="familyScroll"
                        style
                      >
                        <div
                          class="mb-4"
                          v-for="collection in collectionProducts"
                          :key="'collection-' + collection.collection"
                          style="background-color: #ebebeb"
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="
                              position: sticky;
                              left: 0;
                              background-color: #ebebeb;
                            "
                          >
                            <div class="m-0 p-0 pt-1 pb-1">
                              <h4
                                class
                                style="
                                  font-size: 26px;
                                  font-weight: 300;
                                  margin: 0 0 0 8px;
                                  color: #666;
                                "
                              >
                                {{ collection.collection }}
                              </h4>
                            </div>
                            <div class="pl-2 m-0 p-0 pt-2 pb-1">
                              <a
                                class="float-right pr-1"
                                href="javascript:void(0)"
                                @click="
                                  selectedCollectionOnModal({
                                    family: selectedFamily,
                                    collection: collection.collection,
                                  })
                                "
                                >Ver tudo</a
                              >
                            </div>
                          </div>
                          <div class="row pl-1" :style="'margin-top: 10px;'">
                            <span
                              v-for="product in slicePerWidth(
                                collection.products
                              )"
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
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline"
                                    >{{ product.productTypeName }}</a
                                  >
                                </h6>
                              </div>
                              <div
                                class="card font-small-3 mb-1"
                                style="margin-right: 10px"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <ProductCardManualStore
                                    :product="product"
                                    @fill-location="openLocationPopup"
                                    @open-safari-warning="openSafariWarningModal"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="
                                collection.products.length >
                                slicePerWidth(collection.products).length
                              "
                              style="
                                width: 160px;
                                height: 120px;
                                margin-top: 25px;
                                margin-right: 7px;
                                margin-left: 3px;
                              "
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">
                                    Veja mais produtos deste tipo.
                                  </div>
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
                                      style="
                                        padding-left: 3px;
                                        padding-right: 3px;
                                      "
                                    >
                                      <span class="font-medium-1 align-middle"
                                        >Ver tudo</span
                                      >
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
                          style="margin-top: 50px"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao por colecao -->
                      <div
                        v-if="viewType == 'collection'"
                        ref="collectionScroll"
                        style="padding-bottom: 5em"
                      >
                        <div ref="collectionCategories">
                          <div
                            class="mb-4"
                            v-for="category in categoryProducts"
                            :key="'category-' + category.category"
                            style="background-color: #ebebeb"
                          >
                            <div
                              class="row mt-1 mb-1 m-0"
                              style="background-color: #ebebeb"
                            >
                              <div class="m-0 p-0 pt-1 pb-0">
                                <h4
                                  class
                                  style="
                                    font-size: 26px;
                                    font-weight: 300;
                                    margin: 0 0 0 8px;
                                    color: #666;
                                  "
                                >
                                  {{ category.category }}
                                </h4>
                              </div>
                              <div class="pl-2 m-0 p-0 pt-2 pb-1">
                                <!-- <a
                                  class="float-right pr-1"
                                  v-if="selectedFamily == 'Alimentos e bebidas'"
                                  href="javascript:void(0)"
                                  @click="selectedCategoryAllProducts({ family: selectedFamily, category: category.category, collection: selectedCollection })"
                                >Ver tudo</a> -->
                                <nuxt-link
                                  class="float-right pr-1"
                                  :to="{
                                    name: 'public-store-category',
                                    params: {
                                      supplierSlug: slug,
                                      familyName: formatString(selectedFamily),
                                      categoryName: formatString(
                                        category.category
                                      ),
                                    },
                                  }"
                                  >Ver tudo</nuxt-link
                                >
                              </div>
                            </div>
                            <div
                              class="row pl-3"
                              style="overflow-x: hidden; margin-top: 10px"
                            >
                              <div class="col-12 p-0 m-0">
                                <div
                                  class="row"
                                  style="margin-top: 10px; overflow-x: hidden"
                                >
                                  <span
                                    v-for="product in slicePerWidthWithLines(
                                      category.products
                                    )"
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
                                        <a
                                          @click="clickedProductTitle(product)"
                                          style="text-decoration: underline"
                                          >{{ product.productTypeName }}</a
                                        >
                                      </h6>
                                    </div>
                                    <div
                                      class="card font-small-3 mb-1"
                                      style="margin-right: 10px"
                                    >
                                      <div
                                        class="card-body pl-1 pr-1 pt-0 pb-0"
                                      >
                                        <ProductCardManualStore
                                          :product="product"
                                          @fill-location="openLocationPopup"
                                          @open-safari-warning="openSafariWarningModal"
                                        />
                                      </div>
                                    </div>
                                  </span>
                                  <div
                                    class="card font-small-3"
                                    v-if="category.products.length >= 12"
                                    style="
                                      width: 160px;
                                      height: 120px;
                                      margin-top: 25px;
                                      margin-right: 7px;
                                      margin-left: 3px;
                                    "
                                  >
                                    <div class="card-body p-1">
                                      <div class="row">
                                        <div class="col-12 text-center">
                                          Veja mais produtos deste tipo.
                                        </div>
                                        <div class="col-12 mt-1">
                                          <!-- <button
                                            v-if="selectedFamily == 'Alimentos e bebidas'"
                                            href="javascript:void(0)"
                                            @click="selectedCategoryAllProducts({ family: selectedFamily, category: category.category, collection: selectedCollection })"
                                            type="button"
                                            class="btn btn-primary w-100"
                                            style="padding-left: 3px; padding-right: 3px;"
                                          >
                                            <span class="font-medium-1 align-middle">Ver tudo</span>
                                          </button> -->
                                          <nuxt-link
                                            :to="{
                                              name: 'public-store-category',
                                              params: {
                                                supplierSlug: slug,
                                                familyName:
                                                  formatString(selectedFamily),
                                                categoryName: formatString(
                                                  category.category
                                                ),
                                              },
                                            }"
                                            class="btn btn-primary w-100"
                                            style="
                                              padding-left: 3px;
                                              padding-right: 3px;
                                            "
                                          >
                                            <span
                                              class="font-medium-1 align-middle"
                                              >Ver tudo</span
                                            >
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
                          style="margin-top: 50px"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao por categoria -->
                      <div
                        v-if="viewType == 'category'"
                        ref="categoryScroll"
                        style
                      >
                        <div
                          v-for="type in typeProducts"
                          :key="'type-' + type.type.productTypeId"
                          style="background-color: #ebebeb"
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="
                              position: sticky;
                              left: 0;
                              background-color: #ebebeb;
                            "
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1 pb-1">
                              <h4 class style="margin: 0; padding-left: 5px">
                                {{ type.type.productType }}a
                              </h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1 pb-1">
                              <nuxt-link
                                class="float-right pr-1"
                                :to="{
                                  name: 'public-store-product',
                                  params: {
                                    supplierSlug: slug,
                                    familyName: formatString(selectedFamily),
                                    categoryName:
                                      formatString(selectedCategory),
                                    productTypeName: formatString(
                                      type.type.productType
                                    ),
                                  },
                                }"
                                >Ver tudo</nuxt-link
                              >
                            </div>
                          </div>
                          <div class="row pl-1" :style="'margin-top: 10px; '">
                            <span
                              v-for="product in slicePerWidth(type.products)"
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
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline"
                                    >{{ product.productTypeName }}</a
                                  >
                                </h6>
                              </div>
                              <div
                                class="card font-small-3 mb-1"
                                style="margin-right: 10px"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <ProductCardManualStore
                                    :product="product"
                                    @fill-location="openLocationPopup"
                                    @open-safari-warning="openSafariWarningModal"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="
                                type.products.length >
                                slicePerWidth(type.products).length
                              "
                              style="
                                width: 160px;
                                height: 120px;
                                margin-top: 25px;
                                margin-right: 7px;
                                margin-left: 3px;
                              "
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">
                                    Veja mais produtos deste tipo.
                                  </div>
                                  <div class="col-12 mt-1">
                                    <nuxt-link
                                      :to="{
                                        name: 'public-store-product',
                                        params: {
                                          supplierSlug: slug,
                                          familyName:
                                            formatString(selectedFamily),
                                          categoryName:
                                            formatString(selectedCategory),
                                          productTypeName: formatString(
                                            type.type.productType
                                          ),
                                        },
                                      }"
                                      class="btn btn-primary w-100"
                                      style="
                                        padding-left: 3px;
                                        padding-right: 3px;
                                      "
                                    >
                                      <span class="font-medium-1 align-middle"
                                        >Ver tudo</span
                                      >
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
                          style="margin-top: 50px"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-4 mb-4"></div>
                      </div>
                      <!-- visao por categoria com todos os produtos -->
                      <div
                        v-if="viewType == 'category-all-products'"
                        ref="categoryAllScroll"
                        style
                      >
                        <div
                          class="row pl-3"
                          style="background-color: #ebebeb; overflow-x: hidden"
                        >
                          <div class="col-12 p-0 m-0">
                            <div
                              class="row"
                              style="
                                margin-top: 10px;
                                padding-bottom: 3rem;
                                overflow-x: hidden;
                              "
                            >
                              <span
                                v-for="product in supplierProducts"
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
                                    <a
                                      @click="clickedProductTitle(product)"
                                      style="text-decoration: underline"
                                      >{{ product.productTypeName }}</a
                                    >
                                  </h6>
                                </div>
                                <div
                                  class="card font-small-3 mb-1"
                                  style="margin-right: 10px"
                                >
                                  <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                    <ProductCardManualStore
                                      :product="product"
                                      @fill-location="openLocationPopup"
                                      @open-safari-warning="openSafariWarningModal"
                                    />
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                          <div class="col-12">
                            <div
                              style="
                                margin-top: 0px;
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                justify-content: center;
                                background-color: #ebebeb;
                              "
                            >
                              <b-pagination
                                v-if="categoryAllProductsTotalPages"
                                v-model="categoryAllProductsPage"
                                @input="loadMoreProductsCategoryAllProducts()"
                                :total-rows="
                                  categoryAllProductsTotalPages *
                                  maxPerScreenProductType *
                                  (maxLines + 2)
                                "
                                :per-page="
                                  maxPerScreenProductType * (maxLines + 2)
                                "
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
                          style="margin-top: 50px"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <div
                        v-if="viewType == 'product-type'"
                        ref="typeScroll"
                        style="background-color: #ebebeb; padding-bottom: 5em"
                      >
                        <div
                          class="row pl-1"
                          style="
                            margin-top: 10px;
                            padding-bottom: 3rem;
                            overflow-x: hidden;
                          "
                        >
                          <span
                            v-for="product in productsFromType(
                              selectedProductType
                            )"
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
                            <div
                              class="card font-small-3 mb-1"
                              style="margin-right: 10px"
                            >
                              <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                <ProductCardManualStore
                                  :product="product"
                                  @fill-location="openLocationPopup"
                                  @open-safari-warning="openSafariWarningModal"
                                />
                              </div>
                            </div>
                          </span>
                        </div>
                        <div
                          style="
                            margin-top: 0px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: center;
                            background-color: #ebebeb;
                          "
                        >
                          <b-pagination
                            v-if="allowPagination"
                            v-model="currentPage"
                            @input="loadMoreProducts()"
                            :total-rows="
                              totalPages * maxPerScreenProductType * maxLines
                            "
                            :per-page="maxPerScreenProductType * maxLines"
                            first-text="Início"
                            prev-text="Anterior"
                            next-text="Próximo"
                            last-text="Final"
                          ></b-pagination>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                    </div>
                    <v-footer
                      :class="
                        this.mobileBrowser == false ? 'desktop' : 'mobile'
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            <filters-sidebar-store
              v-if="selectedProductType"
              ref="filtersVertical"
              :openSidebar="openSidebar"
              :productTypeId="selectedProductType.productTypeId"
              :supplierId="supplier.id"
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
.card {
  margin-bottom: 2.2rem;
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import OutOfRegionModal from "@/components/users/OutOfRegionModal";
import SupplierInfoModal from "@/components/suppliers/SupplierInfoModal";
import ProductCardManualStore from "@/components/products/ProductCardManualStore";
import StoreLocationModal from "@/components/users/StoreLocationModal";
import priceFormatter from "@/mixins/priceFormatter";
import FiltersSidebarStore from "@/components/productTypes/FiltersSidebarStore";
import ContactService from "@/services/contact";
import VFooter from "@/layouts/components/VFooter";
import NavigationModal from "@/components/users/NavigationModal";
import AddAllButton from "@/components/products/AddAllButton";
import SafariMobileCompatibilityWarning from "@/components/general/SafariMobileCompatibilityWarning";

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
          content: "https://meufornecedor.com.br/logo.png",
        },

        {
          property: "og:image:secure_url",
          itemprop: "image",
          content: "https://meufornecedor.com.br/logo.png",
        },
      ],
    };
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
      filtersProducts: [],
      filteringTypeId: null,
      showFiltered: false,
      navigateToProduct: null,
      openSupplierInfo: false,
      targetClick: null,
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
      renderCategories: [],
      lastLoadedCategory: 0,
      regionCanAccess: false,
      outOfRegionModal: false,
      catalogFamilies: "",
      titleContent: "",
      descriptionContent: "",
      contactMessage: "",
      topButton: false,
      navigationsModal: false,
      tab: 0,
      familyCount: 0,
      allowPagination: false,
      maxLines: 5,
      activeFilters: {},
      categoryAllProductsTotalPages: null,
      categoryAllProductsPage: 1,
      openSafariWarning: false,
      selectedViewType: '',
    };
  },

  created() {

  },

  mounted() {
    this.isMobile();
    this.isLoading = true;
    this.slug = this.$route.params.supplierSlug;
    //this.clearExpeditionsBySupplier();
    this.clearSupplierProducts();

    //this.loadStoreTotal();
    //this.totals = JSON.parse(JSON.stringify(this.storeProducts));
    var page = 1;
    this.userSelectedPage(page);
    this.setCurrentPage(page);
    this.getSupplierBySlug(this.slug).then(() => {
      this.createMetaTagsInfo();
      this.checkRegionAccess();
      this.setManualStoreId(this.supplier.id);
      this.getCatalogById(this.supplier.id).then(() => {
        this.uniqueUsedFamilies();
        this.isLoading = false;
        this.openLocation = false;
        this.allowAccess = true;
        this.startStore();
      });
    });
    setTimeout(() => {
      if (this.supplier.user.supplierStatus != "Liberado") {
        this.$router.push({ path: "/" });
      }
    }, 2000);
    setTimeout(() => {
      this.scrollNavigationsContainer();
    }, 2000);
  },

  computed: {
    ...mapState("suppliers", [
      "supplier",
      "catalog",
      "supplierProducts",
      "manualStoreId",
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
        return 9;
      } else if (window.innerWidth >= 1600 && window.innerWidth < 1920) {
        return 8;
      } else if (window.innerWidth >= 1280 && window.innerWidth < 1600) {
        return 6;
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        return 5;
      } else if (window.innerWidth >= 800 && window.innerWidth < 1024) {
        return 3;
      } else {
        return 6;
      }
    },
    maxPerScreenProductType() {
      if (window.innerWidth >= 1800) {
        return 10;
      } else if (window.innerWidth >= 1610 && window.innerWidth < 1800) {
        return 9;
      } else if (window.innerWidth >= 1540 && window.innerWidth < 1610) {
        return 8;
      } else if (window.innerWidth >= 1340 && window.innerWidth < 1540) {
        return 7;
      } else if (window.innerWidth >= 1200 && window.innerWidth < 1340) {
        return 6;
      } else if (window.innerWidth >= 1100 && window.innerWidth < 1200) {
        return 5;
      } else {
        return 4;
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
    ...mapActions("suppliers", [
      "getCatalogById",
      "getSupplierBySlug",
      "getCatalogByProductTypeAndSupplierPaginated",
      "clearExpeditionsBySupplier",
      "clearSupplierProducts",
      "getCatalogByFamilyAndSupplier",
      "getCatalogByCategoryAndSupplier",
      "getSampleCatalogByProductTypeAndSupplier",
      "getAllProductsByCategoryAndSupplier",
      "getCatalogByCollectionAndSupplier",
      "canUserAccessStore",
      "setManualStoreId",
    ]),
    ...mapActions("users/products", [
      "setStoreTotal",
      "setStoreCanBuy",
      "updateStoreProducts",
      "removeFromStoreProducts",
      "loadStoreTotal",
    ]),
    ...mapActions("pagination", ["userSelectedPage", "setCurrentPage"]),
    getIdsToSelectAll() {
      let products = this.productsFromType(this.selectedProductType);
      let ids = [];
      for (let i = 0; i < products.length; i++) {
        ids.push(products[i].id);
      }
      return ids;
    },
    scrollNavigationsContainer() {
      this.$refs["navigations-container-scroll"].scrollLeft +=
        this.$refs["navigations-container-scroll"].scrollWidth;
    },
    uniqueUsedFamilies() {
      let aux = [];
      for (var family in this.catalog) {
        aux.push(family);
        this.familyCount++;
      }
      this.catalogFamilies = aux.toString();
    },
    checkRegionAccess() {
      if (this.$auth.loggedIn) {
        this.canUserAccessStore(this.supplier.id).then((response) => {
          if (response["allow"] && response["allow"] == "yes")
            this.regionCanAccess = true;
          else this.outOfRegionModal = true;
        });
      } else {
        this.regionCanAccess = true;
      }
    },
    storeHome() {
      this.$router.push({ name: "public-store" });
    },
    slugToName(string) {
      var aux = string.charAt(0).toUpperCase() + string.slice(1);
      aux = aux.replace(/-/, " ");
      aux = aux.replace(/-/, " ");
      return aux;
    },
    createMetaTagsInfo() {
      if (this.$route.meta.familyView) {
        this.titleContent =
          this.supplier.user.name +
          " - " +
          this.slugToName(this.$route.params.familyName) +
          " | Meu Fornecedor";
        this.descriptionContent =
          "Loja digital de " +
          this.supplier.user.name +
          ". Confira seu catálogo de " +
          this.slugToName(this.$route.params.familyName) +
          " e compre online para seu restaurante, minimercado.";
      } else if (this.$route.meta.categoryView) {
        this.titleContent =
          this.supplier.user.name +
          " - " +
          this.slugToName(this.$route.params.categoryName) +
          " | Meu Fornecedor";
        this.descriptionContent =
          "Acesse a loja de " +
          this.supplier.user.name +
          " na plataforma Meufornecedor.com.br. Compre online " +
          this.slugToName(this.$route.params.categoryName) +
          " para seu restaurante, minimercado.";
      } else if (this.$route.meta.productTypeView) {
        this.titleContent =
          this.supplier.user.name +
          " - " +
          `${this.slugToName(
            this.$route.params.categoryName
          )}, ${this.slugToName(this.$route.params.productTypeName)}` +
          " | Meu Fornecedor";
        this.descriptionContent =
          "Compre online " +
          `${this.slugToName(
            this.$route.params.categoryName
          )}, ${this.slugToName(this.$route.params.productTypeName)}` +
          " de " +
          this.supplier.user.name +
          " na plataforma Meufornecedor.com.br. Simplifique as compras do seu restaurante, minimercado.";
      }
    },
    productsFromFamily(family) {
      var aux = this.familyProducts.find((obj) => obj.family == family);
      if (aux && aux.products) return aux.products;
      else return [];
    },
    openNavigationsModal(viewType, familyName) {
      this.selectedViewType = viewType;
      this.selectedTab(familyName);
      this.navigationsModal = true;
    },
    updateNavigationModal(val) {
      this.navigationsModal = val;
    },
    async selectProductType(productType) {
      this.isLoading = true;
      var ended = null;
      this.selectedProductType = this.findProductType(productType);
      this.resetScrolls(this.viewType, "product-type");
      this.viewType = "product-type";
      this.allowPagination = true;
      ended = await this.getCatalogByProductTypeAndSupplierPaginated({
        productTypeId: productType,
        supplierId: this.supplier.id,
        filters: {},
        items: this.maxPerScreenProductType * this.maxLines,
      }).then(() => {
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
      this.getCatalogByFamilyAndSupplier({
        family: family,
        supplierId: this.supplier.id,
        noExpeditions: true,
      }).then((response) => {
        this.isLoading = false;
        this.loading = false;
        this.familyProducts.push({ family: family, products: response });
      });
    },
    async loadCollectionProducts(family, collection) {
      var wait = await this.getCatalogByCollectionAndSupplier({
        family: family.replace(".", "_"),
        collection: collection.replace(".", "_").replace("/", "@"),
        supplierId: this.supplier.id,
        noExpeditions: true,
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
      var wait = await this.getCatalogByCategoryAndSupplier({
        family: family.replace(".", "_"),
        category: category.replace(".", "_").replace("/", "@"),
        supplierId: this.supplier.id,
        noExpeditions: true,
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
      var wait = await this.getSampleCatalogByProductTypeAndSupplier({
        productTypeId: type.productTypeId,
        supplierId: this.supplier.id,
        noExpeditions: true,
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
      this.home = "family";
      for (let family in this.catalog) {
        this.loadFamilyProducts(family);
      }
      this.viewType = this.home;
    },
    async checkHome() {
      if (Object.keys(this.catalog).length > 1) {
        this.home = "family";
      } else {
        for (let family in this.catalog) {
          if (Object.keys(this.catalog[family]).length > 1) {
            this.home = "family-collections";
          } else {
            for (let collection in this.catalog[family]) {
              if (Object.keys(this.catalog[family][collection]).length > 1) {
                this.home = "collection";
              } else {
                for (let category in this.catalog[family][collection]) {
                  if (this.catalog[family][collection][category].length > 1) {
                    this.home = "category-all-products";
                  } else {
                    this.home = "product-type";
                  }
                }
              }
            }
          }
        }
      }
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
    checkTotals(totals) {
      let found = this.totals.find((obj) => obj.id == totals.id);
      if (found) {
        found.quantity = totals.quantity;
        found.total = totals.total;
      } else {
        this.totals.push(totals);
      }
      this.updateStoreProducts(totals);
      this.updateTotal();
    },
    removeFromCart(exp) {
      this.totals = this.totals.filter((obj) => obj.id != exp.id);
      this.removeFromStoreProducts(exp);
      this.loadStoreTotal();
      this.updateTotal();
    },
    updateTotal() {
      let sum = 0;
      this.hasBelowMin = false;
      for (let i = 0; i < this.totals.length; i++) {
        sum += this.totals[i].total;
        var formattedQuantity = this.totals[i].quantity;
        if (
          this.totals[i].minimum &&
          this.totals[i].quantity != "" &&
          formattedQuantity < this.totals[i].minimum
        )
          this.hasBelowMin = true;
      }
      this.total = sum;
      this.setStoreTotal(sum);
      if (
        !this.hasBelowMin &&
        this.supplier.minimumOrderValue &&
        sum >=
          parseFloat(
            this.supplier.minimumOrderValue
              .replace("R$", "")
              .replace(".", "")
              .replace(",", ".")
          )
      )
        this.setStoreCanBuy(true);
      else if (!this.hasBelowMin && !this.supplier.minimumOrderValue)
        this.setStoreCanBuy(true);
      else this.setStoreCanBuy(false);
    },
    allowZipcode(value) {
      // this.allowAccess = value
      if (value == true) this.targetClick.click();
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
      return this.normalizeString(string).replace(/\s+/g, "-");
    },
    findKeyEncoded(object, encoded) {
      var aux = Object.keys(object).map((key) => ({
        original: key,
        encoded: this.formatString(key),
      }));
      var found = aux.find((obj) => obj.encoded == encoded);
      return found;
    },
    startStore(clickedHome = false) {
      if (this.$route.meta.familyView) {
        this.checkHome();
        var found = this.findKeyEncoded(
          this.catalog,
          this.$route.params.familyName
        );
        if (found) {
          if (found.original == "Alimentos e bebidas") {
            this.selectedFamilyAllCollections("Alimentos e bebidas");
          } else {
            this.selectedFamilyAllCategories(found.original);
          }
        }
      } else if (this.$route.meta.categoryView) {
        this.checkHome();
        var foundFamily = this.findKeyEncoded(
          this.catalog,
          this.$route.params.familyName
        );
        for (var collection in this.catalog[foundFamily.original]) {
          for (var category in this.catalog[foundFamily.original][collection]) {
            if (
              this.formatString(category) == this.$route.params.categoryName
            ) {
              if (this.$route.query.page)
                this.categoryAllProductsPage = parseInt(this.$route.query.page);
              else this.categoryAllProductsPage = 1;
              this.selectedCategoryAllProducts({
                family: foundFamily.original,
                collection: collection,
                category: category,
              });
            }
          }
        }
      } else if (this.$route.meta.productTypeView) {
        this.checkHome();
        var foundFamily2 = this.findKeyEncoded(
          this.catalog,
          this.$route.params.familyName
        );
        for (var collection2 in this.catalog[foundFamily2.original]) {
          for (var category2 in this.catalog[foundFamily2.original][
            collection2
          ]) {
            for (
              var i = 0;
              i <
              this.catalog[foundFamily2.original][collection2][category2]
                .length;
              i++
            ) {
              if (
                this.formatString(
                  this.catalog[foundFamily2.original][collection2][category2][i]
                    .productType
                ) == this.$route.params.productTypeName &&
                this.formatString(category2) == this.$route.params.categoryName
              ) {
                if (this.$route.query.page) {
                  var page = parseInt(this.$route.query.page);
                  this.userSelectedPage(page);
                  this.setCurrentPage(page);
                }
                this.selectProductType(
                  this.catalog[foundFamily2.original][collection2][category2][i]
                    .productTypeId
                );
              }
            }
          }
        }
      } else {
        if (!clickedHome && this.$route.query.selected == "family") {
          if (this.$route.query.family == "Alimentos e bebidas")
            this.selectedFamilyAllCollections("Alimentos e bebidas");
          else this.selectedFamilyAllCategories(this.$route.query.family);
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
        } else this.initialLoad();
        this.titleContent = this.supplier.user.name + " | Meu Fornecedor";
        this.descriptionContent =
          "Compre online de " +
          this.supplier.user.name +
          ". Confira as ofertas em " +
          this.catalogFamilies +
          " e abasteça o estoque do seu restaurante, minimercado.";
      }
    },
    showTopButton() {
      this.topButton = true;
    },
    scroll() {
      this.$refs["generalScroll"].onscroll = () => {
        if (this.viewType == "collection") {
          let bottomOfWindow =
            this.$refs["generalScroll"].scrollTop +
              this.$refs["generalScroll"].offsetHeight >
            this.$refs["collectionCategories"].offsetHeight - 300;
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
    productsFromType(type, filtering = false) {
      return this.supplierProducts.filter(
        (prod) => prod.productTypeId == type.productTypeId
      );
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
      this.userSelectedPage(1);
      this.setCurrentPage(1);
      this.activeFilters = filters;
      this.isLoading = true;
      this.resetScrolls(this.viewType, "product-type");
      if (
        filters.brands.length ||
        filters.volumes.length ||
        filters.tags.length ||
        filters.properties.length
      ) {
        this.validFilter = true;
        this.getCatalogByProductTypeAndSupplierPaginated({
          productTypeId: this.selectedProductType.productTypeId,
          supplierId: this.supplier.id,
          filters: filters,
          items: this.maxPerScreenProductType * this.maxLines,
        }).then(() => {
          this.isLoading = false;
          this.loading = false;
        });
      } else {
        this.getCatalogByProductTypeAndSupplierPaginated({
          productTypeId: this.selectedProductType.productTypeId,
          supplierId: this.supplier.id,
          filters: {},
          items: this.maxPerScreenProductType * this.maxLines,
        }).then(() => {
          this.isLoading = false;
          this.loading = false;
        });
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
        var fromCategory = this.catalog[family][collection][category].map(
          (obj) => ({ value: obj.productTypeId, text: obj.productType })
        );
        //var fromCategory = this.loadProductTypes.filter(type => type.category == category).map(obj => ({ value: obj.productType.productTypeId, text: obj.productType.productType }))
        if (!hidePlaceholder)
          fromCategory.unshift({ value: null, text: "Prod." });
        return fromCategory;
      } else return [];
    },
    updateSupplierPopup(val) {
      this.openSupplierInfo = val;
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
      this.isLoading = true;
      this.resetScrolls(this.viewType, "product-type");
      this.activeFilters = {};
      this.$refs.filtersVertical.clearInternalSelectedFilters();
      this.getCatalogByProductTypeAndSupplierPaginated({
        productTypeId: this.selectedProductType.productTypeId,
        supplierId: this.supplier.id,
        filters: this.activeFilters,
        items: this.maxPerScreenProductType * this.maxLines,
      }).then(() => {
        this.isLoading = false;
        this.loading = false;
      });
    },
    updateLocationModal(val) {
      this.openLocation = val;
    },
    openLocationPopup(target) {
      this.targetClick = target;
      this.openLocation = true;
      setTimeout(() => {
        document.getElementById("cepInput").focus();
      }, 500);
    },
    async selectedFamilyAllCollections(family) {
      this.selectedFamily = family;
      this.selectedCollection = null;
      this.selectedCategory = null;
      this.resetScrolls(this.viewType, "family-collections");
      this.viewType = "family-collections";

      this.collectionProducts = [];
      var wait = null;
      this.isLoading = true;

      for (let collection in this.catalog[family]) {
        wait = await this.loadCollectionProducts(family, collection);
      }
      if (!wait) this.isLoading = false;
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
      this.getAllProductsByCategoryAndSupplier({
        family: value.family.replace(".", "_").replace("/", "@"),
        category: value.category.replace(".", "_").replace("/", "@"),
        supplierId: this.supplier.id,
        page: this.categoryAllProductsPage,
        items: this.maxPerScreenProductType * (this.maxLines + 2),
        noExpeditions: true,
      }).then((response) => {
        this.categoryAllProductsTotalPages = response.headers["total-pages"];
        this.isLoading = false;
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
      return this.catalog[family][collection];
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
    runSupplierSearch() {
      this.$router.push({
        name: "public-store-search",
        params: { keyword: this.keyword },
      });
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
      // this.selectedFamily = product.familyName;
      // if (product.categoryCollection)
      //   this.selectedCollection = product.categoryCollection;
      // else this.selectedCollection = "";
      // this.selectedCategory = product.categoryName;
      // this.selectProductType(product.productTypeId);
      this.$router.push({
        name: "public-store-product",
        params: {
          supplierSlug: this.slug,
          familyName: this.formatString(product.familyName),
          categoryName: this.formatString(product.categoryName),
          productTypeName: this.formatString(product.productTypeName),
        },
      });
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
      if (this.$refs.generalScroll) this.$refs.generalScroll.scrollTop = 0;
      if (this.$refs.collectionScroll)
        this.$refs.collectionScroll.scrollTop = 0;
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
      var perLine = Math.floor(window.innerWidth / 172);
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
    shareOnWhatsapp() {
      this.generateContactViaWhatsappText();
      setTimeout(() => {
        ContactService.userContactedSupplierNotification(this.contactMessage);
      }, 1000);
      var url =
        "https://api.whatsapp.com/send?text=" +
        "Ol%C3%A1!%20Peguei%20seu%20contato%20pela%20plataforma%20Meu%20Fornecedor.%0AEst%C3%A1%20podendo%20falar%20agora%3F" +
        "&phone=55" +
        this.supplier.user.phone
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "");
      window.open(url, "_blank");
    },
    scrollToTop() {
      this.$refs.generalScroll.scrollTop = 0;
      setTimeout(() => {
        this.topButton = false;
      }, 800);
    },
    hasScroll(scroll) {
      if (scroll && scroll.scrollWidth > scroll.clientWidth) {
        return true;
      } else return false;
    },
    addScrollX(scroll, direction) {
      if (scroll) scroll.scrollLeft += 50 * direction;
    },
    generateContactViaWhatsappText() {
      if (this.$auth && this.$auth.loggedIn) {
        if (this.$auth.user.cnpj) {
          this.contactMessage =
            "O usuário \n" +
            this.$auth.user.name +
            "\nPessoa Jurídica" +
            "\nId " +
            this.$auth.user.id +
            "\nCEP " +
            this.$auth.user.zipcode +
            " " +
            this.$auth.user.street +
            ", N.º " +
            this.$auth.user.addressDetails +
            "\nFone" +
            this.$auth.user.phone +
            "\nEntrou em contato com o fornecedor " +
            this.supplier.user.name +
            ", via Whatsapp.";
        } else {
          this.contactMessage =
            "O usuário \n" +
            this.$auth.user.name +
            "\nPessoa Física" +
            "\nId " +
            this.$auth.user.id +
            "\nCEP " +
            this.$auth.user.zipcode +
            " " +
            this.$auth.user.street +
            ", N.º " +
            this.$auth.user.addressDetails +
            "\nFone" +
            this.$auth.user.phone +
            "\nEntrou em contato com o fornecedor " +
            this.supplier.user.name +
            ", via Whatsapp.";
        }
      } else if (
        localStorage.cep != "null" &&
        localStorage.serves_type != "null"
      ) {
        this.contactMessage =
          "Um usuário anônimo \n" +
          localStorage.serves_type +
          "\nCEP " +
          localStorage.cep +
          "\nEntrou em contato com o fornecedor " +
          this.supplier.user.name +
          ", via Whatsapp.";
      } else {
        this.contactMessage =
          "Um usuário anônimo entrou em contato com o fornecedor " +
          this.supplier.user.name +
          ", via Whatsapp.";
      }
    },
    generateContactViaPhoneNumberText() {
      if (this.$auth && this.$auth.loggedIn) {
        if (this.$auth.user.cnpj) {
          this.contactMessage =
            "O usuário \n" +
            this.$auth.user.name +
            "\nPessoa Jurídica" +
            "\nId " +
            this.$auth.user.id +
            "\nCEP " +
            this.$auth.user.zipcode +
            " " +
            this.$auth.user.street +
            ", N.º " +
            this.$auth.user.addressDetails +
            "\nFone" +
            this.$auth.user.phone +
            "\nEntrou em contato com o fornecedor " +
            this.supplier.user.name +
            ", através do número de telefone.";
        } else {
          this.contactMessage =
            "O usuário \n" +
            this.$auth.user.name +
            "\nPessoa Física" +
            "\nId " +
            this.$auth.user.id +
            "\nCEP " +
            this.$auth.user.zipcode +
            " " +
            this.$auth.user.street +
            ", N.º " +
            this.$auth.user.addressDetails +
            "\nFone" +
            this.$auth.user.phone +
            "\nEntrou em contato com o fornecedor " +
            this.supplier.user.name +
            ", através do número de telefone.";
        }
      } else if (
        localStorage.cep != "null" &&
        localStorage.serves_type != "null"
      ) {
        this.contactMessage =
          "Um usuário anônimo \n" +
          localStorage.serves_type +
          "\nCEP " +
          localStorage.cep +
          "\nEntrou em contato com o fornecedor " +
          this.supplier.user.name +
          ", através do número de telefone.";
      } else {
        this.contactMessage =
          "Um usuário anônimo entrou em contato com o fornecedor " +
          this.supplier.user.name +
          ", através do número de telefone.";
      }
    },
    sendContactNotification() {
      this.generateContactViaPhoneNumberText();
      setTimeout(() => {
        ContactService.userContactedSupplierNotification(this.contactMessage);
      }, 1000);
    },

    selectedTab(selectedFamily) {
      switch (selectedFamily) {
        case "Alimentos e bebidas":
          this.tab = 0;
          break;
        case "Limpeza":
          this.tab = 1;
          break;
        case "Embalagens":
          this.tab = 2;
          break;
        case "Utensílios":
          this.tab = 3;
          break;
      }
      return null;
    },

    clearSearch() {
      this.keyword = null;
    },
    familyNameAbreviation(familyName) {
      if (familyName == "Alimentos e bebidas") return "Alim. e beb.";
      else if (familyName == "Embalagens") return "Embal.";
      else if (familyName == "Limpeza") return "Limp.";
      else return "Utens.";
    },
    loadMoreProducts() {
      this.isLoading = true;
      this.resetScrolls(this.viewType, "product-type");
      this.addParamsToLocation({ page: this.currentPage });
      this.getCatalogByProductTypeAndSupplierPaginated({
        productTypeId: this.selectedProductType.productTypeId,
        supplierId: this.supplier.id,
        filters: this.activeFilters,
        items: this.maxPerScreenProductType * this.maxLines,
      }).then(() => {
        this.isLoading = false;
        this.loading = false;
      });
    },
    loadMoreProductsCategoryAllProducts() {
      this.loading = true;
      this.isLoading = true;
      this.addParamsToLocation({ page: this.categoryAllProductsPage });
      this.resetScrolls(this.viewType, "category-all-products");
      this.getAllProductsByCategoryAndSupplier({
        family: this.selectedFamily.replace(".", "_").replace("/", "@"),
        category: this.selectedCategory.replace(".", "_").replace("/", "@"),
        page: this.categoryAllProductsPage,
        items: this.maxPerScreenProductType * (this.maxLines + 2),
        supplierId: this.supplier.id,
      }).then((response) => {
        this.categoryAllProductsTotalPages = response.headers["total-pages"];
        this.isLoading = false;
      });
    },
    addParamsToLocation(params) {
      history.pushState(
        {},
        null,
        this.$route.path +
          "?" +
          Object.keys(params)
            .map((key) => {
              return (
                encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
              );
            })
            .join('&')
      )
    },
    openSafariWarningModal() {
      this.openSafariWarning = true
    },
    closeSafariWarning() {
      this.openSafariWarning = false
    },
  },
  components: {
    StoreLocationModal,
    FiltersSidebarStore,
    SupplierInfoModal,
    OutOfRegionModal,
    ProductCardManualStore,
    VFooter,
    NavigationModal,
    AddAllButton,
    SafariMobileCompatibilityWarning,
  },
  mixins: [priceFormatter],
};
</script>

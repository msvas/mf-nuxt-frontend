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
    <out-of-region-modal
      :openPopup="outOfRegionModal"
      v-if="supplier"
    />
    <span
      v-if="allowAccess && regionCanAccess && supplier && supplier.user.isAutomatic && supplier.user.supplierStatus == 'Liberado'"
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
      <div
        v-if="mobileBrowser"
        class="content-wrapper pb-0 pt-0"
        style="max-height: calc(100vh - 8.4em); overflow-y: hidden; overflow-x: hidden; padding-right: 3px !important; padding-left: 3px !important;"
      >

        <div
          class="content-body p-0 m-0"
          v-if="supplier"
          ref="generalScroll"
          v-on:scroll.passive="showTopButton()"
          style="max-height: calc(100vh - 5.3em); overflow-x: hidden; overflow-y: scroll; scroll-behavior: smooth; background-color: #ebebeb;"
        >
          <div
              v-if="this.topButton"
              ref="backToTop"
              href="javascript:void(0);"
              @click="scrollToTop()"
              class="position-fixed btn btn-success"
              style="bottom: 80px; right: 25px; z-index: 100; padding: 8px;"
            >
              <span style="vertical-align: text-top;">Todas categorias</span>
              <i class="feather icon-chevron-up" style="color: white;"></i>
            </div>
            <div class="row align-items-center" style="background: white; position: sticky; top: 0; z-index: 800;">
              <div class="m-0 pr-0" style="padding-top: 10px; padding-bottom: 5px; padding-left: 1rem; flex: 0 0 58%; max-width: 58%;">
                <span
                  class="m-0 font-weight-bold font-medium-2"
                  style="overflow: hidden !important; text-overflow: ellipsis; max-width: 48vw; display: inline-block; white-space: nowrap; margin-bottom: -6px !important; margin-left: 3px !important;"
                >{{ supplier.user.name }}</span>
                <br />
                <vs-button
                  @click="shareOnWhatsapp()"
                  color="#00bfa5"
                  type="filled"
                  style="padding: 3px 5px; margin-left: 3px; margin-right: 0px; margin-top: 5px; font-size: 13px;"
                >
                  <i class="fa fa-whatsapp mr-50"></i>Whatsapp
                </vs-button>
                <a
                  @click="this.sendContactNotification()"
                  :href="'tel:' + supplier.user.phone"
                  style="margin-top: 5px; margin-left: 3px; font-size: 12px;"
                >{{ supplier.user.phone }}</a>
                <supplier-info-modal
                  :supplier="supplier"
                  :openPopup="openSupplierInfo"
                  @update-popup="updateSupplierPopup"
                />
              </div>
              <div class="m-0 pr-1" style="margin-top: -10px !important; padding-top: 0px; padding-bottom: 5px; flex: 0 0 42%; max-width: 42%;">
                <span
                  class="badge badge-pill font-small-2 float-right"
                  style="margin-right: 5px; background-color: #b3b3b3; padding: 4px 4px;"
                >Min. {{ supplier.minimumOrderValue }}</span><br>
                <a class="font-small-3 float-right" href="javascript:void(0);" @click="openSupplierInfo = true" style="margin-right: 7px;">
                  Ver mais
                </a>
              </div>
            <div class="m-0 p-0" style="width: 100%; border-bottom: 5px solid #F8F8F8;"></div>
          </div>
          <div class style="background: #EDEDED; border-bottom: solid 1px #D5D5D5;">
              <div
                class="row"
                style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; height: 43px; background: rgb(245, 246, 247);     justify-content: space-around;"
              >
                <form
                  @submit.prevent="runSupplierSearch"
                  action
                  class="row"
                  :style="show ? 'width: 100%' : 'display: none;'"
                  style="z-index: 1; height: -webkit-fill-available"
                >
                  <i
                    class="feather icon-search"
                    style="color: black; position: relative; left: 9%; top: 0px; font-size: 2rem; z-index: 2;"
                    @click="runSupplierSearch()"
                  />
                  <input
                    id="search"
              bv40      ref="searchBar"
                    type="text"
                    placeholder="Buscar na loja"
                    v-model="keyword"
                    autocomplete="on"
                    style="padding-left: 80px; padding-right: 300px; position: absolute; height: 40px; font-size: 1.2rem; margin-top: -6px; border: none; border-radius: 5px;"
                  />
                  <i
                    class="feather icon-corner-down-left"
                    @click="runSupplierSearch()"
                    style="color: black; position: relative; left: 72%; top: 0px; font-size: 2rem; z-index:9999"
                  />
                  <i
                    class="feather icon-x"
                    @click="closing()"
                    style="color: black; position: relative; left: 75%; top: 0px; font-size: 2rem; z-index:9999"
                  />
                </form>
                <div class="m-0 pl-1 pr-0" v-if="!show" style="flex: 0 0 10%">
                  <a id="store-home-button" @click="storeHome()" href="javascript:void(0)">
                    <button
                      type="button"
                      :class="viewType == home ? 'btn btn-outline-primary disabled' : 'btn btn-outline-black'"
                      style="padding: 7px 7px;"
                    >
                      <i class="ficon feather icon-home" />
                    </button>
                  </a>
                </div>
                <div style="flex: 0 0 10%">
                  <vs-chip class="chip-mf">
                    <a  @click="openNavigationsModal('family-collections', 'Alimentos e bebidas')">
                      Todos os produtos
                      <i class="feather icon-chevron-down"></i>
                    </a>
                  </vs-chip>
                </div>
                <div
                  class="m-0 pl-0 pr-1"
                  style="flex: 0 0 40%;"
                >
              <form
                @submit.prevent="runSupplierSearch"
                action
                class
                style="
                    z-index: 1;
                    height: -webkit-fill-available;
                    position: relative;
                    width: 85%;
                  "
              >
                <input
                    id="search2"
                    type="text"
                    placeholder="Buscar na loja"
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
                    :style="this.mobileBrowser ? 'width: 90%;' : 'width: 600px;'"
                  />
                  <i @click="clearSearch()"
                  class="feather icon-x"
                  style=" color: black;
                          position: absolute;
                          left: 60%;
                          top: 7px;
                          font-size: 1.2rem;
                          z-index: 2;
                          width: 40px;
                        "/>
                  <i
                    class="feather icon-search"
                    style=" color: white;
                            background: rgb(12, 182, 149);
                            position: absolute;
                            left: 76%;
                            top: 0px;
                            font-size: 1.2rem;
                            z-index: 2;
                            width: 40px;
                            border-radius: 0px 5px 5px 0px;
                            padding: 7px;
                            text-align: center;
                    "
                    @click="runSupplierSearch()"
                  />
              </form>
                </div>
              </div>
              <div class="navigations-container no-scrollbar" style="overflow-x: scroll;" ref="navigations-container-scroll">
                <span v-for="(family, index) in catalog"
                  :key="index"
                  style="flex: 0 0 auto; width: auto; color: black"
                >
                  <vs-chip v-if="index == selectedFamily"
                    class="chip-mf"
                  >
                    <a v-if="selectedFamily == 'Alimentos e bebidas' " @click="openNavigationsModal('family-collections', selectedFamily)" :style="selectedFamily ? 'color: #008567;' : ''">
                      {{familyNameAbreviation(selectedFamily) }}
                      <i class="feather icon-chevron-down"></i>
                    </a>
                    <a v-else @click="openNavigationsModal('collection', selectedFamily)" :style="selectedFamily ? 'color: #008567;' : ''">
                      <span v-html="getSelectedFamilyIcon(selectedFamily)"></span>
                      {{ selectedFamily }}
                      <i class="feather icon-chevron-down"></i>
                    </a>
                  </vs-chip>
                </span>
                <span v-for="(family, index) in catalog"
                :key="index"
                style="flex: 0 0 auto; width: auto; color: black"
                >
                  <vs-chip v-if="index != selectedFamily" class="chip-mf">
                    <a style="color:inherit !important;" href="javascript:void(0)"
                      v-if="selectedFamily == 'Alimentos e bebidas' " @click="openNavigationsModal('family-collections', index)" >
                      {{ index }}
                      <i class="feather icon-chevron-down"></i>
                    </a>
                    <a style="color:inherit !important;" href="javascript:void(0)" v-else @click="openNavigationsModal('collection' , index)">
                      {{ index }}
                      <i class="feather icon-chevron-down"></i>
                    </a>
                  </vs-chip>
                </span>
                <span
                  v-for="(collection, index) in collectionsFromFamily(selectedFamily)"
                  :key="index"
                  :vs-value="index"
                  style="flex: 0 0 auto; width: auto;"
                >
                  <vs-chip
                    v-if="index == selectedCollection && selectedCollection != '' "
                    class="chip-mf"
                  >
                    <a @click="openNavigationsModal('collection', selectedFamily)" :style="selectedCollection ? 'color: #008567;' : ''">
                      {{ index }}
                      <i class="feather icon-chevron-down"></i>
                    </a>
                  </vs-chip>
                </span>
                <vs-chip
                  v-if="!selectedCategory && selectedCollection"
                  class="chip-mf-local public-chip p-0 pr-1"
                  style="border: 1px solid rgb(92, 233, 198);"
                >
                  <a  @click="openNavigationsModal('collection', selectedFamily)" style="color: black;">
                    Tudo
                    <i class="feather icon-chevron-down pl-1"></i>
                  </a>
                </vs-chip>
                <span v-for="(category, index) in categoriesFromCollection(selectedFamily, selectedCollection)"
                  :key="index"
                  :vs-value="index"
                  style="flex: 0 0 auto; width: auto;"
                >
                  <vs-chip v-if="index == selectedCategory" class="chip-mf">
                    <a @click="openNavigationsModal('category-all-products', selectedFamily)" :style="selectedCategory ? 'color: #008567;' : ''">
                      {{ selectedCategory }}
                      <i class="feather icon-chevron-down"></i>
                    </a>
                  </vs-chip>
                </span>

                <span style="flex: 0 0 auto; width: auto;">
                <vs-chip class="chip-mf" v-if="selectedProductType && selectedProductType.length">
                  <a @click="openNavigationsModal('product-type', selectedFamily)" :style="selectedProductType ? 'color: #008567;' : ''">
                    {{ selectedProductType[0].productType }}
                    <i class="feather icon-chevron-down"></i>
                  </a>
                </vs-chip>
              </span>
              <span style="flex: 0 0 auto; width: auto;">
                <vs-chip class="chip-mf-selected">
                  <a  @click="closeProductPage()" >
                    1 selec.
                    <i class="feather icon-x"></i>
                  </a>
                </vs-chip>
              </span>
              </div>
              <div v-if="viewType == 'product-type'"
                class="row pr-1"
                style="border-top: solid 1px LightGrey; padding-left: 10px;"
              >
                <div class="col-8 m-0 pr-0 pt-1 pl-1" style="padding-bottom: 8px;">
                  <h5 class style="margin: 0;">
                    <nuxt-link
                      style="color: black;"
                      :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(selectedCategory) } }"
                    >
                      <i class="feather icon-chevron-left"></i>
                    </nuxt-link>
                    {{ selectedProductType.productType }}
                  </h5>
                </div>
                <div class="col-4 m-0 p-0 float-right">
                  <div
                    class="d-flex justify-content-end"
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
          <div v-if="catalog" class="row p-0 m-0" style="display: contents;">
            <div class="col-12 p-0 m-0" style id="products">
              <div>
                <div class="vh-100" ref="desktopScroll">
                  <div v-if="product" class="mb-2" ref="content">
                    <div>
                      <product-page-info
                        :product="product"
                        :supplier="supplier"
                        :expeditions="product.supplierProductExpeditions"
                        :sampleProducts="samples"
                        :typesAvailable="productsFromCategory(product.categoryName, product.familyName, product.categoryCollection, true)"
                       />
                    </div>
                    <v-footer :class="this.mobileBrowser == false ? 'desktop' :'mobile' " />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="content-wrapper pb-0"
        style="padding-left: 5px; padding-right: 5px; padding-top: 3px;"
      >
        <div
          class="content-body p-0 m-0"
          v-if="supplier"
          ref="generalScroll"
          v-on:scroll.passive="showTopButton()"
          style="max-height: calc(100vh - 5em); overflow-y: scroll; overflow-x: hidden; scroll-behavior: smooth; background-color: #ebebeb;"
        >
          <div class="row" style="z-index: 1000; padding: 5px 20px 0px 20px; background-color: white; position: -webkit-sticky; position: sticky; top: 0px;">
            <div class="col-1 m-0 p-0 text-center">
              <a id="store-home-button" @click="storeHome()" href="javascript:void(0)">
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
                style="padding: 3px 10px; margin-left: 0; margin-top: 3px; margin-right: 7px; margin-bottom: 5px;"
              >
                <i class="fa fa-whatsapp mr-50"></i>Falar no Whatsapp
              </vs-button>
              <a @click="sendContactNotification()" :href="'tel:' + supplier.user.phone">{{ supplier.user.phone }}</a>
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
                    style="background-color: #b3b3b3;"
                  >Min. {{ supplier.minimumOrderValue }}</span>
                  <a class="float-right mr-2" href="javascript:void(0);" @click="openSupplierInfo = true">Ver mais</a>
                </div>
              </div>
              <div class="row" style="margin-top: 5px;">
                <div class="col-12">
                  <span
                    class="badge badge-pill float-right font-small-3"
                    style="background-color: #b3b3b3;"
                    v-if="!supplier.deliveryEstimate"
                  >Não faz entrega</span>
                </div>
              </div>
            </div>
            <div class="m-0 p-0" style="width: 100%; border-bottom: 5px solid #F8F8F8;"></div>
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
              <span style="flex: 0 0 auto; width: auto;">
                <vs-chip class="chip-mf" alt="type.text" v-if="selectedProductType && selectedProductType.length">
                  <a @click="openNavigationsModal('product-type', selectedFamily)"  style="color: #008567;">
                    {{selectedProductType[0].productType}}
                    <i class="feather icon-chevron-down"></i>
                  </a>
                </vs-chip>
              </span>
             <span style="flex: 0 0 auto; width: auto;">
                <vs-chip class="chip-mf-selected" >
                  <a  @click="closeProductPage()" style="color: #008567; ">
                    1 selec.
                    <i @click="closeProductPage()" class="feather icon-x"></i>
                  </a>
                </vs-chip>
              </span>
              </div>
              <div style="max-width: 50%">
                <form @submit.prevent="runSupplierSearch()" style="margin-right: -20px;">
                  <input
                    id="search2"
                    type="text"
                    placeholder="Buscar na loja"
                    style=" font-size: 1rem;
                            border: 2px solid rgb(12, 182, 149);
                            border-radius: 5px;
                            width: auto;
                            padding: 5px;"
                  />
                  <i class="feather icon-x" style="margin-left: -15%"/>
                  <i  class="feather icon-search" @click="runSupplierSearch()" style="background-color: rgb(12, 182, 149);
                                                        font-size: 18px;
                                                        padding: 8px;
                                                        border-bottom-right-radius: 5px;
                                                        border-top-right-radius: 5px;
                                                        vertical-align: text-bottom;"
                  />
                </form>
              </div>
            </div>
            <div  class="navigations-container" v-if="viewType == 'product-type' && (productsFromType(selectedProductType).length > 1 || hasFilters(selectedProductType))">
              <div class="p-0" style="background:white">
                  <add-all-button
                  v-if="!loadingProducts"
                  :productIds="this.getIdsToSelectAll()"
                  :count="true"
                />
              </div>
              <div style="padding: 0.75rem 1rem; background-color: white; border-radius: 0.5rem;">
                <a
                  style="border-bottom: 1px solid grey; padding-bottom: 1px; color: grey; margin-right: 10px;"
                  class="font-small-3"
                  @click="clearAllFilters()"
                  v-if="hasFilters(selectedProductType)"
                >Limpar</a>
                <span class="dot" v-if="hasFilters(selectedProductType)"></span>
                <a
                  style="border-bottom: 1px solid #007bff; padding-bottom: 1px; color: #007bff;"
                  class="font-medium-2"
                  @click="clickSidebar(selectedProductType)"
                >Filtrar {{ selectedProductType.productType }}</a>
              </div>
            </div>
          </div>
          <div v-if="catalog" class="row p-0 m-0" style="display: contents;">
            <div class="col-12 p-0 m-0" ref="productsWindow" style id="products">
              <div>
                <div class="vh-100" ref="desktopScroll">
                  <div v-if="product" class="mb-2" ref="content">
                    <div>
                      <product-page-info
                        :product="product"
                        :supplier="supplier"
                        :expeditions="product.supplierProductExpeditions"
                        :sampleProducts="samples"
                        :typesAvailable="productsFromCategory(product.categoryName, product.familyName, product.categoryCollection, true)"
                       />
                    </div>
                    <v-footer :class="this.mobileBrowser == false ? 'desktop' :'mobile' " />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </span>
  </div>
</template>

<style scoped>
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
.chip-mf-local {
    font-weight: 400;
    font-size: 0.8em !important;
    background-color: white !important;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin-right: 8px !important;
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
import { mapState, mapActions, mapGetters } from "vuex";
import StoreFamiliesModal from "@/components/users/StoreFamiliesModal";
import OutOfRegionModal from "@/components/users/OutOfRegionModal";
import SupplierInfoModal from "@/components/suppliers/SupplierInfoModal";
import PublicStoreProductCard from "@/components/products/PublicStoreProductCard";
import StoreLocationModal from "@/components/users/StoreLocationModal";
import priceFormatter from "@/mixins/priceFormatter";
import ContactService from "@/services/contact"
import VFooter from "@/layouts/components/VFooter";
import NavigationModal from "@/components/users/NavigationModal"
import ProductPageInfo from "@/components/products/ProductPageInfo"

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
      filtersProducts: [],
      filteringTypeId: null,
      showFiltered: false,
      navigateToProduct: null,
      openSupplierInfo: false,
      targetClick: null,
      familiesModal: false,
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
      catalogFamilies: '',
      titleContent: '',
      descriptionContent: '',
      contactMessage: '',
      topButton: false,
      navigationsModal: false,
      selectedViewType: '',
      tab: 0,
      productId: null,
      product: null,
      samples: [],
    };
  },

  layout: 'noFooter/NoFooter',

  created() {

  },

  mounted() {
    this.isMobile()
    this.isLoading = true
    this.slug = this.$route.params.supplierSlug
    // this.clearExpeditionsBySupplier()
    // this.clearSupplierProducts()
    // this.loadStoreTotal()
    // this.loadStoreProducts()
    // this.totals = JSON.parse(JSON.stringify(this.storeProducts))
    // this.updateTotal()

    this.productId = this.getProductIdFromUrl()

    this.getSupplierBySlug(this.slug).then(() => {
      this.createMetaTagsInfo()
      this.checkRegionAccess()
      this.getSupplierProductAndExpeditions({ supplierId: this.supplier.id, productId: this.productId }).then((response) => {
        if(response && response.length) {
          this.product = response[0]
          this.getSampleCatalogByProductTypeAndSupplier({ supplierId: this.supplier.id, productTypeId: this.product.productTypeId }).then((samples) => {
            this.samples = samples.filter(obj => (obj.id != this.product.id))
          })
          this.getCatalogById(this.supplier.id).then(() => {
            this.uniqueUsedFamilies()
            this.isLoading = false;
            this.openLocation = false;
            this.allowAccess = true;
            //this.startStore();
            this.getRouterParamsToOptions()
          });
        }
      })
    })
    setTimeout(() => {
      if (this.supplier.user.supplierStatus != "Liberado") {
        this.$router.push({ path: "/" });
      }
      this.getRouterParamsToOptions()
      this.selectedProductType = this.createProductTypeStructure(this.product)
      this.selectedProduct = this.product
    }, 2000);
    
    setTimeout(() => {
      this.scrollNavigationsContainer();
    }, 4000);
  },

  computed: {
    ...mapState("suppliers", [
      "supplier",
      "catalog",
      "supplierProducts",
      "supplierOfferProducts",
      "supplierExpeditions",
      "supplierOfferExpeditions",
    ]),
    ...mapState("users/products", ["storeTotal", "storeProducts", "storeCartSupplier"]),
    ...mapGetters("users/products", ["storeCartSupplierId"]),
    maxPerScreen() {
      if (window.innerWidth >= 1910) {
        return 8;
      } else if (window.innerWidth >= 1680 && window.innerWidth < 1910) {
        return 7;
      } else if (window.innerWidth >= 1450 && window.innerWidth < 1680) {
        return 6;
      } else if (window.innerWidth >= 1220 && window.innerWidth < 1450) {
        return 6;
      } else if (window.innerWidth >= 1000 && window.innerWidth < 1220) {
        return 4;
      } else if (window.innerWidth >= 800 && window.innerWidth < 1000) {
        return 3;
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
    ...mapActions("suppliers", [
      "getCatalogById",
      "getSupplierBySlug",
      "getCatalogByProductTypeAndSupplier",
      "getOfferProductsBySupplier",
      "getOfferExpeditionsBySupplier",
      "getExpeditionsByProductTypeAndSupplier",
      "clearExpeditionsBySupplier",
      "clearSupplierProducts",
      "getCatalogByFamilyAndSupplier",
      "getCatalogByCategoryAndSupplier",
      "getSampleCatalogByProductTypeAndSupplier",
      "getAllProductsByCategoryAndSupplier",
      "getCatalogByCollectionAndSupplier",
      "canUserAccessStore",
      "getSupplierProductAndExpeditions",
    ]),
    ...mapActions("users/products", [
      "setStoreTotal",
      "setStoreCanBuy",
      "updateStoreProducts",
      "removeFromStoreProducts",
      "loadStoreTotal",
      "setStoreCartSupplier",
      "clearStoreProducts",
      "loadStoreProducts",
    ]),
     uniqueUsedFamilies() {
      let aux = [];
      for(var family in this.catalog){
        aux.push(family)
      }
      this.catalogFamilies = aux.toString()
    },
    checkRegionAccess() {
      if(this.$auth.loggedIn) {
        this.canUserAccessStore(this.supplier.id).then((response) => {
          if(response['allow'] && response['allow'] == 'yes')
            this.regionCanAccess = true
          else
            this.outOfRegionModal = true
        })
      } else {
        this.regionCanAccess = true
      }
    },
    storeHome() {
      // this.viewType = "family";
      // this.selectedCategory = null;
      // this.selectedCollection = null;
      // this.selectedFamily = null;
      // this.startStore();
      this.$router.push({ name: 'public-store' })
    },
    getProductIdFromUrl() {
      let strings = this.$route.params.identifier.split('-')
      return strings[strings.length - 1]
    },
    productsFromFamily(family) {
      var aux = this.familyProducts.find((obj) => obj.family == family);
      if (aux && aux.products) return aux.products;
      else return [];
    },
    openFamiliesModal() {
      this.familiesModal = true;
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
    async selectProductType(productType) {
      this.isLoading = true;
      var ended = null;
      this.selectedProductType = this.findProductType(productType);
      this.resetScrolls(this.viewType, "product-type");
      this.viewType = "product-type";
      ended = await this.getCatalogByProductTypeAndSupplier({
        productTypeId: productType,
        supplierId: this.supplier.id,
      }).then(() => {
        var first = this.productsFromType(this.selectedProductType)[0];
        this.selectedCategory = first.categoryName;
        if (first.categoryCollection)
          this.selectedCollection = first.categoryCollection;
        else this.selectedCollection = "";
        this.selectedFamily = first.familyName;
        this.getExpeditionsByProductTypeAndSupplier({
          productTypeId: productType,
          supplierId: this.supplier.id,
        }).then(() => {
          this.isLoading = false;
          this.loading = false;
        });
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
            this.$router.push({ name: 'public-store-family', params: { supplierSlug: this.slug, familyName: this.formatString(family) } })
            //this.selectedFamilyAllCollections(family);
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
                    this.$router.push({ name: 'public-store-category', params: { supplierSlug: this.slug, familyName: this.formatString(family), categoryName: this.formatString(category) } })
                    // this.selectedCategoryAllProducts({
                    //   family: family,
                    //   collection: collection,
                    //   category: category,
                    // });
                  } else {
                    this.home = "product-type";
                    this.$router.push({ name: 'public-store-product',
                                        params: {
                                          supplierSlug: this.slug,
                                          familyName: this.formatString(family),
                                          categoryName: this.formatString(category),
                                          productTypeName: this.formatString(this.catalog[family][collection][category][0].productType)
                                        } })
                    // this.selectProductType(
                    //   this.catalog[family][collection][category][0]
                    //     .productTypeId
                    // );
                  }
                }
              }
            }
          }
        }
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
    expeditionsByProduct(product) {
      return this.supplierExpeditions.filter(
        (obj) => obj.productExpedition.productId == product.id
      );
    },
    offerExpeditionsByProduct(product) {
      return this.supplierOfferExpeditions.filter(
        (obj) => obj.productExpedition.productId == product.id
      );
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
      if(this.storeTotal == 0 || (this.storeCartSupplierId() == this.supplier.id)) {
        let found = this.totals.find((obj) => obj.id == totals.id);
        if (found) {
          found.quantity = totals.quantity;
          found.total = totals.total;
        } else {
          this.totals.push(totals);
        }
        this.setStoreCartSupplier(this.supplier.id)
        this.updateStoreProducts(totals)
        this.updateTotal()
      }
    },
    clearCart() {
      this.clearExpeditionsBySupplier()
      this.clearSupplierProducts()
      this.clearStoreProducts()
      this.totals = []
      this.setStoreTotal(0)
      this.setStoreCartSupplier(null)
      this.updateTotal()
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
      if(this.totals) {
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
    findKeyEncoded(object, encoded) {
      var aux = Object.keys(object).map(key => ({ original: key, encoded: this.formatString(key) }))
      var found = aux.find(obj => obj.encoded == encoded)
      return found
    },
    slugToName(string){
      var aux = string.charAt(0).toUpperCase() + string.slice(1)
      aux = aux.replace(/-/, ' ')
      aux = aux.replace(/-/, ' ')
      return aux
    },
    createMetaTagsInfo() {
      if(this.$route.meta.familyView) {
        this.titleContent = this.supplier.user.name + " - " + this.slugToName(this.$route.params.familyName) + " | Meu Fornecedor"
        this.descriptionContent = "Loja digital de " + this.supplier.user.name + ". Confira seu catálogo de " + this.slugToName(this.$route.params.familyName) + " e compre online para seu restaurante, minimercado."
      } else if(this.$route.meta.categoryView) {
        this.titleContent = this.supplier.user.name + " - " + this.slugToName(this.$route.params.categoryName) + " | Meu Fornecedor"
        this.descriptionContent = "Acesse a loja de " + this.supplier.user.name + " na plataforma Meufornecedor.com.br. Compre online " + this.slugToName(this.$route.params.categoryName) + " para seu restaurante, minimercado."
      }
      else if(this.$route.meta.productTypeView) {
        this.titleContent = this.supplier.user.name + " - " + `${this.slugToName(this.$route.params.categoryName)}, ${this.slugToName(this.$route.params.productTypeName)}` + " | Meu Fornecedor"
        this.descriptionContent = "Compre online " + `${this.slugToName(this.$route.params.categoryName)}, ${this.slugToName(this.$route.params.productTypeName)}` + " de " + this.supplier.user.name + " na plataforma Meufornecedor.com.br. Simplifique as compras do seu restaurante, minimercado."
      }
    },
    startStore(clickedHome = false) {
      if(this.$route.meta.familyView) {
        this.checkHome()
        var found = this.findKeyEncoded(this.catalog, this.$route.params.familyName)
        if (found) {
          if (found.original == "Alimentos e bebidas") {
            this.selectedFamilyAllCollections("Alimentos e bebidas")
          } else {
            this.selectedFamilyAllCategories(found.original)
          }
        }
      }
      else if(this.$route.meta.categoryView) {
        this.checkHome()
        var foundFamily = this.findKeyEncoded(this.catalog, this.$route.params.familyName)
        for(var collection in this.catalog[foundFamily.original]) {
          for(var category in this.catalog[foundFamily.original][collection]) {
            if(this.formatString(category) == this.$route.params.categoryName) {
              this.selectedCategoryAllProducts({
                family: foundFamily.original,
                collection: collection,
                category: category,
              });
            }
          }
        }
      }
      else if(this.$route.meta.productTypeView) {
        this.checkHome()
        var foundFamily2 = this.findKeyEncoded(this.catalog, this.$route.params.familyName)
        for(var collection2 in this.catalog[foundFamily2.original]) {
          for(var category2 in this.catalog[foundFamily2.original][collection2]) {
            for(var i = 0; i < this.catalog[foundFamily2.original][collection2][category2].length; i++) {
              if (this.formatString(this.catalog[foundFamily2.original][collection2][category2][i].productType) == this.$route.params.productTypeName &&
                  this.formatString(category2) == this.$route.params.categoryName) {
                this.selectProductType(this.catalog[foundFamily2.original][collection2][category2][i].productTypeId)
              }
            }
          }
        }
      }
      else {
        if (!clickedHome && this.$route.query.selected == "family") {
          if (this.$route.query.family == "Alimentos e bebidas")
            this.selectedFamilyAllCollections("Alimentos e bebidas");
          else
            this.selectedFamilyAllCategories(this.$route.query.family);
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
        } else
          this.initialLoad();
          this.titleContent = this.supplier.user.name + " | Meu Fornecedor"
          this.descriptionContent = "Compre online de " + this.supplier.user.name + ". Confira as ofertas em " + this.catalogFamilies + " e abasteça o estoque do seu restaurante, minimercado."
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
    productsFromType(type, filtering = false) {
      if (
        !filtering &&
        this.showFiltered &&
        this.filteringTypeId == type.productTypeId
      )
        return this.filtersProducts;
      else
        return this.supplierProducts.filter(
          (prod) => prod.productTypeId == type.productTypeId
        );
    },
    updateSidebar(val) {
      this.openSidebar = val;
    },
    updateNavigationModal(val) {
      this.navigationsModal = val;
    },
    clickSidebar(type) {
      this.openSidebar = true;
      if (type.productTypeId != this.filteringTypeId) {
        this.showFiltered = false;
        this.filtersProducts = this.productsFromType(type, true);
      }
      this.filteringTypeId = type.productTypeId;
      setTimeout(() => {
        this.$refs.filtersVertical.loadNew();
      }, 300);
    },
    updateProductsByFilters(filters) {
      if (
        filters.brands.length ||
        filters.volumes.length ||
        filters.tags.length ||
        filters.properties.length
      ) {
        var productsTemp = this.productsFromType(
          { productTypeId: filters.productTypeId },
          true
        );
        if (filters.brands.length)
          productsTemp = productsTemp.filter((prod) =>
            filters.brands.includes(prod.brandId)
          );
        if (filters.volumes.length)
          productsTemp = productsTemp.filter(
            (prod) =>
              prod.packagingName == filters.volumes[0].packaging &&
              prod.unitsOfMeasurementName == filters.volumes[0].unit &&
              prod.quantity == filters.volumes[0].quantity
          );
        if (filters.tags.length)
          productsTemp = productsTemp.filter((prod) =>
            prod.secondaryCharacteristics.some((r) => filters.tags.includes(r))
          );
        if (filters.properties.length)
          productsTemp = productsTemp.filter((prod) =>
            filters.properties.includes(prod.propertyId)
          );
        this.filtersProducts = productsTemp;
        this.validFilter = true;
      } else {
        this.filtersProducts = this.productsFromType(
          { productTypeId: filters.productTypeId },
          true
        );
        this.validFilter = false;
        this.clearAllFilters();
      }

      setTimeout(() => {
        this.$refs.filtersVertical.loadNew();
      }, 300);
    },
    applyFilters() {
      this.showFiltered = true;
    },
    productsFromCategory(category, family, collection) {
      if (category) {
        var treatCollection = collection ? collection : ''
        var fromCategory = this.catalog[family][treatCollection][category].map((obj) => ({ value: obj.productTypeId, text: obj.productType }));
        return fromCategory;
      } else return [];
    },
    goToOffers() {
      this.selectedFamily = null;
      this.selectedCollection = null;
      this.selectedCategory = null;
      this.viewType = "sale";
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
      //this.filteringTypeId = null
    },
    clearFilters() {
      this.showFiltered = false;
      this.filteringTypeId = null;
      this.filtersProducts = [];
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
      }).then(() => {
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
      this.$router.push({ name: 'public-store-product',
                          params: {
                            supplierSlug: this.slug,
                            familyName: this.formatString(product.familyName),
                            categoryName: this.formatString(product.categoryName),
                            productTypeName: this.formatString(product.productTypeName)
                          } })
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
      return products.slice(0, Math.floor(window.innerWidth / 172) - 1);
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
        this.topButton = false
      }, 800);
    },
    hasScroll(scroll) {
      console.log(scroll)
      if (scroll && scroll.scrollWidth > scroll.clientWidth) {
        return true;
      } else return false;
    },
    addScrollX(scroll, direction) {
      if (scroll) scroll.scrollLeft += 50 * direction;
    },
    generateContactViaWhatsappText(){
      if(this.$auth.loggedIn){
        if(this.$auth.user.cnpj){
          this.contactMessage= "O usuário \n" +this.$auth.user.name+ "\nPessoa Jurídica" + "\nId " +this.$auth.user.id+ "\nCEP " +this.$auth.user.zipcode + " " + this.$auth.user.street+ ", N.º " +this.$auth.user.addressDetails+ "\nFone" +this.$auth.user.phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
        }else{
          this.contactMessage= "O usuário \n" +this.$auth.user.name+ "\nPessoa Física" + "\nId " +this.$auth.user.id+ "\nCEP " +this.$auth.user.zipcode + " " + this.$auth.user.street+ ", N.º " +this.$auth.user.addressDetails+ "\nFone" +this.$auth.user.phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
        }
      }else if(localStorage.cep != 'null' && localStorage.serves_type != 'null'){
        this.contactMessage= "Um usuário anônimo \n" + localStorage.serves_type +  "\nCEP " +localStorage.cep + "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
            }else{
              this.contactMessage= "Um usuário anônimo entrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
      }
    },
    generateContactViaPhoneNumberText(){
      if(this.$auth.loggedIn){
        if(this.$auth.user.cnpj){
          this.contactMessage = "O usuário \n" +this.$auth.user.name+ "\nPessoa Jurídica" + "\nId " +this.$auth.user.id+ "\nCEP " +this.$auth.user.zipcode + " " + this.$auth.user.street+ ", N.º " +this.$auth.user.addressDetails+ "\nFone" +this.$auth.user.phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
        }else{
          this.contactMessage = "O usuário \n" +this.$auth.user.name+ "\nPessoa Física" + "\nId " +this.$auth.user.id+ "\nCEP " +this.$auth.user.zipcode + " " + this.$auth.user.street+ ", N.º " +this.$auth.user.addressDetails+ "\nFone" +this.$auth.user.phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
        }
      }else if(localStorage.cep != 'null' && localStorage.serves_type != 'null'){
        this.contactMessage= "Um usuário anônimo \n" + localStorage.serves_type +  "\nCEP " +localStorage.cep + "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
            }else{
              this.contactMessage = "Um usuário anônimo entrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
      }
    },
    sendContactNotification(){
      this.generateContactViaPhoneNumberText();
      setTimeout(() => {
        ContactService.userContactedSupplierNotification(this.contactMessage);
      }, 1000);
    },
    clearSearch(){
      this.keyword = null;
    },
    createProductTypeStructure(product){
      let productType = []
        productType.push({productType: product.productTypeName,
                          productTypeId: product.productTypeId,
                          quantity: product.quantity})
      return productType
    },
    getRouterParamsToOptions(){
      this.selectedFamily = this.product.familyName;
      this.selectedCollection = this.product.categoryCollection;
      this.selectedCategory = this.product.categoryName;
    },
    scrollNavigationsContainer(){
      this.$refs["navigations-container-scroll"].scrollLeft += this.$refs["navigations-container-scroll"].scrollWidth;
    },
    closeProductPage(){
      this.$router.push({name: 'public-store-product', params: {supplierSlug: this.$route.params.supplierSlug,
                                                                familyName: this.formatString(this.selectedFamily),
                                                                categoryName: this.formatString(this.selectedCategory),
                                                                productTypeName: this.formatString(this.selectedProductType[0].productType) }})
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
  },
  components: {
    StoreLocationModal,
    SupplierInfoModal,
    OutOfRegionModal,
    VFooter,
    NavigationModal,
    ProductPageInfo
  },
  mixins: [priceFormatter],
};
</script>

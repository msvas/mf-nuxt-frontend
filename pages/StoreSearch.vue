<template>
  <div v-if="catalog">
    <div v-if="!mobileBrowser" class="content-wrapper pb-0" style="padding: 2.2rem !important;">
      <store-location-modal
        :openPopup="openLocation"
        :supplier="supplier"
        @allow-zipcode="allowZipcode"
        @update-modal="updateLocationModal"
        v-if="supplier"
      />
      <div class="content-body">
        <store-families-modal
          @selected-category="selectedCategoryOnModal"
          @selected-collection="selectedCollectionOnModal"
          @selected-product-type="selectProductType"
          @update-modal="updateStoreFamiliesModal"
          :openPopup="familiesModal"
          :catalog="catalog"
        />
        <div
          class
          style="   background: rgb(237, 237, 237);
                    border: 1px solid rgb(213, 213, 213);
                    position: fixed;
                    z-index: 999;
                    width: -webkit-fill-available;
                    margin-left: -40px;
                    margin-right: 100px;
                    top: 60px;"
        >
          <div class="row" style="padding: 5px 20px; background-color: white;">
            <div class="col-1 m-0 p-0 text-center">
              <img v-if="supplier.picture" :src="supplier.picture" alt="*" width="auto" height="45" />
              <img
                v-else
                :src="require(`@/assets/images/avatar-default.png`)"
                alt="*"
                width="auto"
                height="45"
              />
            </div>
            <div class="col-7 m-0 p-0">
              <h3 class="m-0 font-weight-bold">{{ supplier.user.name }}</h3>
              <a
                @click="sendContactNotification()"
                :href="'tel:' + supplier.user.phone"
              >{{ supplier.user.phone }}</a>
              <vs-button
                @click="shareOnWhatsapp()"
                color="#00bfa5"
                type="border"
                style="padding: 3px 10px; background-color: white; margin-left: 3px; margin-right: 3px;"
              >
                <i class="fa fa-whatsapp mr-50"></i>Conversar
              </vs-button>
              <a href="javascript:void(0);" @click="openSupplierInfo = true">Ver mais</a>
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
          </div>
          <div
            class="row"
            style="border-top: solid 1px LightGrey; padding: 5px 10px; background-color: #f5f6f7; height: 43px; background: rgb(245, 246, 247);"
          >
            <div class="m-0 pl-1 pr-0" style="flex: 0 0 50px">
              <a id="store-home-button" @click="storeHome()" href="javascript:void(0)">
                <button
                  type="button"
                  :class="
                    viewType == home
                      ? 'btn btn-outline-primary disabled'
                      : 'btn btn-outline-primary'
                  "
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
              <span
                v-for="(family, index) in catalog"
                :key="index"
                style="flex: 0 0 auto; width: auto; color: black;"
              >
                <vs-chip
                  v-if="index == selectedFamily"
                  style="flex: 0 0 auto; width: auto; background-color: #008567;"
                  class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
                >
                  <a @click="storeHome()" style>
                    <span v-html="getFamilyIcon(selectedFamily)"></span>
                    {{ selectedFamily }}
                  </a>
                </vs-chip>
                <vs-chip v-if="index != selectedFamily" class="chip-mf public-chip p-0 pr-1">
                  <router-link
                    v-if="index == 'Alimentos e bebidas'"
                    :to="{
                      name: 'public-store-family',
                      params: {
                        supplierSlug: slug,
                        familyName: formatString(index),
                      },
                    }"
                    style="color: inherit;"
                  >
                    <span v-html="getFamilyIcon(index)"></span>
                    {{ index }}
                  </router-link>
                  <router-link
                    v-else
                    :to="{
                      name: 'public-store-family',
                      params: {
                        supplierSlug: slug,
                        familyName: formatString(index),
                      },
                    }"
                    style="color: inherit;"
                  >
                    <span v-html="getFamilyIcon(index)"></span>
                    {{ index }}
                  </router-link>
                </vs-chip>
              </span>
            </div>
            <div class="m-0 pl-0 pr-1" style="flex: 0 0 350px; margin-left: auto !important;">
              <form
                @submit.prevent="runSupplierSearch"
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
                <i
                  @click="clearSearch()"
                  class="feather icon-x"
                  style="color: black;
                              position: absolute;
                              left: 530px;
                              top: 7px;
                              font-size: 1.2rem;
                              z-index: 2;
                              width: 40px;"
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
                  @click="runSupplierSearch()"
                />
              </form>
            </div>
          </div>
          <h4
            style=" padding: 20px 0px 20px 40px;
                      border-top: 1px solid lightgrey;
                      background: rgb(245, 246, 247);"
            class="card-title font-medium mb-50 font-weight-bold color-black w-100"
          >
            Resultados para
            <span class="color-mf-verde">{{ keyword }}</span>
          </h4>
        </div>
      </div>
      <b-tabs  :style="this.mobileBrowser ? '' : 'margin-top: 9rem !important;' " v-model="tab">
        <b-tab>
          <template v-slot:title>
            <img
              :src="require(`@/assets/images/delivery-box-tab.png`)"
              alt="*"
              width="16"
              height="16"
            />
            <strong style="padding-left:10px;">Produtos</strong>
          </template>
          <div style="padding-top: 80px;">
            <h4 class="font-weight-light">Encontrado em</h4>
            <h2 class="font-weight-bold">{{ supplier.user.name }}</h2>
          </div>
          <div class="row" ref="productsWindow">
            <div class="col-xl-9 col-12">
              <div v-if="totalResults > 0" ref="content">
                <span v-for="family in searchedFamilies" :key="family.family.id">
                  <h3
                    v-if="familyHasProducts(family.family.name)"
                    class="bg-rgba-light p-1 rounded ml-0 mr-0 mt-0 mb-1"
                  >
                    <i class="fa fa-lemon-o ml-50 mr-75"></i>
                    {{ family.family.name }}
                  </h3>
                  <div
                    class="row mt-1"
                    v-for="(chunk, index) in productChunks(
                        productsFromFamily(family.family.name)
                      )"
                    :key="index"
                  >
                    <span
                      v-for="product in chunk"
                      :key="product.id"
                      style="width: 170px; margin-left: 5px; margin-right: 5px;"
                    >
                      <div style="padding-left: 5px;">
                        <h6 style="margin-bottom: 0px;">
                          <a
                            @click="selectProductType(product)"
                            style="text-decoration: underline;"
                          >{{ product.productTypeName }}</a>
                        </h6>
                      </div>
                      <div class="card font-small-3 mb-0" style="width: 170px;">
                        <div class="card-body pl-1 pr-1 pt-0 pb-0" style="">
                          <PublicStoreProductCard
                            v-if="supplier.user.supplierQuotationType != 'Manual'"
                            :product="product"
                            :expeditions="expeditionsByProduct(product)"
                            :loadedTotals="totals"
                            @quantity-input="checkTotals"
                            @remove-item="removeFromCart"
                            @fill-location="openLocationPopup"
                            style="background-color: white !important;"
                          />
                          <ProductCardManualStore v-else :product="product" style="background-color: white !important;"/>
                        </div>
                      </div>
                    </span>
                    <vs-divider class="mb-1" />
                  </div>
                </span>
                <div v-if="currentPage < totalPages" style="text-align: center;">
                  <button class="btn btn-outline-primary" @click="scroll()">Mostrar mais</button>
                </div>
              </div>
              <div class="ml-3" v-else>
                <h3>Não há produtos que correspondam a sua busca.</h3>
                <ul class="ml-2">
                  <li>Você escreveu o termo corretamente?</li>
                  <li>Que tal usar menos palavras?</li>
                  <li>
                    Você pode
                    <router-link
                      :to="{
                          name: 'public-store',
                          params: {
                            supplierSlug: this.$route.params.supplierSlug,
                          },
                        }"
                      style="color: 0391D1; text-decoration: underline;"
                    >ir para o início</router-link>para encontrar o que procura
                  </li>
                </ul>
              </div>
              <div v-if="searchSugestions.length > 0" class="mt-1">
                <h3>Veja também em outros fornecedores</h3>
                <div class="row">
                  <span
                    v-for="productSugestion in searchSugestions.slice(0, maxPerScreen - 1 )"
                    :key="productSugestion.id"
                    :style="'width: 170px; margin-left: 5px; margin-right: 5px;'"

                  >
                    <div class="card font-small-3 mb-0" style="width: 170px;">
                      <div class="card-body pl-1 pr-1 pt-0 pb-0" style="">
                        <ProductCard :product="productSugestion" />
                      </div>
                    </div>
                  </span>
                  <span style="align-self: center;">
                    <div
                      class="card font-small-3"
                      style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                    >
                      <div class="card-body p-1">
                        <div class="row">
                          <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                          <div class="col-12 mt-1">
                            <router-link
                              :to="{
                                  name: 'users.search',
                                  params: { keyword: this.keyword },
                                }"
                              class="btn btn-primary w-100"
                              style="padding-left: 3px; padding-right: 3px;"
                            >
                              <span class="font-medium-1 align-middle">Ver tudo</span>
                            </router-link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-12">
              <div class="card font-small-3">
                <div class="card-body px-0 py-0">
                  <div class="card-header py-1 border-bottom">
                    <h4
                      class="card-title font-medium-2 mb-50 font-weight-bold color-mf-verde w-100"
                    >{{ keyword }}</h4>
                    <p class="mb-0">{{ totalResults }} resultados</p>
                    <!-- <a href="#" data-toggle="modal" data-target="#filtrar" class="d-md-none float-right"><i class="feather icon-sliders"></i> Filtrar</a> -->
                  </div>
                </div>

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
                    :storeSearch="true"
                  />
                </span>
              </div>
            </div>
          </div>
        </b-tab>
        <b-tab>
          <template v-slot:title>
            <img :src="require(`@/assets/images/store-tab.png`)" alt="*" width="16" height="16" />
            <strong style="padding-left:10px;">Lojas</strong>
          </template>
          <div style="padding-top: 80px;"></div>
          <div v-if="this.filteredSuppliers.length > 0">
            <div>
              <h4>Outras lojas com resultados para {{ keyword }}</h4>
            </div>
            <div
              style="display: flex;
                    flex-wrap: wrap;
                    flex-direction: row;"
              :style="mobileBrowser ? 'justify-content: center;' : ''"
            >
              <div v-for="supplier in filteredSuppliers" v-bind:key="supplier.id">
                <supplier-card :supplier="supplier" />
              </div>
            </div>
          </div>
          <div v-else>
            <h3>Não há fornecedores que correspondam a sua busca.</h3>
            <ul class="ml-2">
              <li>Você escreveu o termo corretamente?</li>
              <li>Que tal usar menos palavras?</li>
              <li>
                Você pode
                <router-link
                  :to="{
                      name: 'public-store',
                      params: { supplierSlug: this.$route.params.supplierSlug },
                    }"
                  style="color: 0391D1; text-decoration: underline;"
                >ir para o início</router-link>para encontrar o que procura
              </li>
            </ul>
          </div>
        </b-tab>
      </b-tabs>
    </div>
    <div
      v-else
      class="content-wrapper pb-0 pt-0"
      style="max-height: calc(100vh - 8.4em); overflow-y: hidden; overflow-x: hidden; padding-right: 3px !important; padding-left: 3px !important;"
    >
      <store-location-modal
        :openPopup="openLocation"
        :supplier="supplier"
        @allow-zipcode="allowZipcode"
        @update-modal="updateLocationModal"
        v-if="supplier"
      />
      <store-families-modal
        @selected-category="selectedCategoryOnModal"
        @selected-collection="selectedCollectionOnModal"
        @selected-product-type="selectProductType"
        @update-modal="updateStoreFamiliesModal"
        :openPopup="familiesModal"
        :catalog="catalog"
      />
      <div
        class="content-body p-0 m-0"
        v-if="supplier"
        ref="generalScroll"
        style="max-height: calc(100vh - 8em); overflow-x: hidden; overflow-y: scroll; scroll-behavior: smooth; background-color: #ebebeb;"
      >
        <div
          class="row align-items-center"
          style="background: white; position: sticky; top: 0; z-index: 1000;"
        >
          <div
            class="m-0 pr-0"
            style="padding-top: 10px; padding-bottom: 5px; padding-left: 1rem; flex: 0 0 58%; max-width: 58%;"
          >
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
          <div
            class="m-0 pr-2"
            style="margin-top: -10px !important; padding-top: 0px; padding-bottom: 5px; flex: 0 0 42%; max-width: 42%;"
          >
            <span
              class="badge badge-pill font-small-2 float-right"
              style="margin-right: 5px; background-color: #b3b3b3; padding: 4px 4px;"
            >Min. {{ supplier.minimumOrderValue }}</span>
            <br />
            <a
              class="font-small-3 float-right"
              href="javascript:void(0);"
              @click="openSupplierInfo = true"
              style="margin-right: 7px;"
            >Ver mais</a>
          </div>
          <div class="m-0 p-0" style="width: 100%; border-bottom: 5px solid #F8F8F8;"></div>
        </div>
        <div class style="background: #EDEDED; border-bottom: solid 1px #D5D5D5; position: sticky; top: 72px; z-index: 1000;">
          <div
            class="row"
            style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; height: 43px; background: rgb(245, 246, 247); justify-content: space-around;"
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
                ref="searchBar"
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
                  :class="
                    viewType == home
                      ? 'btn btn-outline-primary disabled'
                      : 'btn btn-outline-primary'
                  "
                  style="padding: 7px 7px;"
                >
                  <i class="ficon feather icon-home" />
                </button>
              </a>
            </div>
            <div class="m-0" v-if="!show" style="padding-right: 2px !important; padding-left: 2px;">
              <button
                @click="openFamiliesModal()"
                type="button"
                class="btn btn-success"
                style=" padding: 3px 8px;
                            background-color: rgb(0, 133, 103) !important;
                            color: white;
                            display: flex;
                            align-items: center;"
              >
                Categorias
                <i style="font-size: x-large;" class="feather icon-chevron-down"></i>
              </button>
            </div>
            <div class="m-0 pl-0 pr-1" style="flex: 0 0 48%;">
              <form
                @submit.prevent="runSupplierSearch"
                action
                class
                style="
                    z-index: 1;
                    height: -webkit-fill-available;
                    position: relative;
                    width: 112%;
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
                          border-radius: 5px;
                          width: 90%;"
                />
                <i
                  @click="clearSearch()"
                  class="feather icon-x"
                  style=" color: black;
                          position: absolute;
                          left: 61%;
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
                            left: 71%;
                            top: 1px;
                            font-size: 1.2rem;
                            z-index: 2;
                            width: 40px;
                            border-radius: 0px 5px 5px 0px;
                            padding: 6px;
                            text-align: center;
                    "
                  @click="runSupplierSearch()"
                />
              </form>
            </div>
          </div>
          <div
            v-if="selectedCollection"
            ref="mobileCollectionChips"
            class="row no-wrap"
            style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
          >
            <span
              v-for="(collection, index) in collectionsFromFamily(
                selectedFamily
              )"
              :key="index"
              :vs-value="index"
              style="flex: 0 0 auto; width: auto;"
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
                style="flex: 0 0 auto; width: auto; background-color: #0cb695;"
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
            <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden;">a</vs-chip>
          </div>
          <div
            v-if="selectedCollection || selectedCategory"
            ref="mobileCategoryChips"
            class="row no-wrap"
            style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
          >
            <span
              v-if="selectedCollection"
              style="margin-left: 5px; margin-top: 5px;"
              class="font-small-2 font-weight-bold p-0 pr-1"
            >
              <router-link
                :to="{
                  name: 'public-store-family',
                  params: {
                    supplierSlug: slug,
                    familyName: formatString(selectedFamily),
                  },
                }"
                style="color: inherit;"
              >{{ selectedCollection }}</router-link>
            </span>
            <div v-if="selectedCollection" style="border-right: 1px solid DarkGrey; margin: 0 5px;"></div>
            <span
              v-for="(category, index) in categoriesFromCollection(
                selectedFamily,
                selectedCollection
              )"
              :key="index"
              :vs-value="index"
              style="flex: 0 0 auto; width: auto;"
            >
              <vs-chip
                v-if="index == selectedCategory"
                style="flex: 0 0 auto; width: auto; background-color: #0cb695;"
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
                <router-link
                  :to="{
                    name: 'public-store-category',
                    params: {
                      supplierSlug: slug,
                      familyName: formatString(selectedFamily),
                      categoryName: formatString(index),
                    },
                  }"
                  style="color: inherit;"
                >{{ index }}</router-link>
              </vs-chip>
            </span>
            <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden;">a</vs-chip>
          </div>

          <div
            v-if="
              viewType == 'collection' &&
                selectedFamily != 'Alimentos e bebidas'
            "
            ref="mobileFamilyChips"
            class="row no-wrap"
            style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
          >
            <span v-html="getFamilyIcon(selectedFamily)"></span>
            <span
              v-for="(category, index) in categoriesFromCollection(
                selectedFamily,
                ''
              )"
              :key="index"
              :vs-value="index"
              style="flex: 0 0 auto; width: auto;"
            >
              <vs-chip v-if="index != selectedCategory" class="chip-mf public-chip p-0 pr-1">
                <router-link
                  :to="{
                    name: 'public-store-category',
                    params: {
                      supplierSlug: slug,
                      familyName: formatString(selectedFamily),
                      categoryName: formatString(index),
                    },
                  }"
                  style="color: inherit;"
                >{{ index }}</router-link>
              </vs-chip>
            </span>
          </div>
          <div
            v-if="viewType == 'category-all-products'"
            class="row"
            style="border-top: solid 1px LightGrey; padding-top: 2px; padding-bottom: 2px; padding-left: 15px;"
          >
            <div class="col-7 p-0 m-0">
              <h5 style="margin-top: 10px; margin-left: 3px;">{{ selectedCategory }}</h5>
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
            style="border-top: solid 1px LightGrey; padding-left: 10px;"
          >
            <div class="col-8 m-0 pr-0 pt-1 pl-1" style="padding-bottom: 8px;">
              <h5 class style="margin: 0;">
                <!-- <router-link
                      v-if="selectedFamily != 'Alimentos e bebidas'"
                      style="color: black;"
                      :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(selectedCategory) } }"
                    >
                      <i class="feather icon-chevron-left"></i>
                </router-link>-->
                <router-link
                  style="color: black;"
                  :to="{
                    name: 'public-store-category',
                    params: {
                      supplierSlug: slug,
                      familyName: formatString(selectedFamily),
                      categoryName: formatString(selectedCategory),
                    },
                  }"
                >
                  <i class="feather icon-chevron-left"></i>
                </router-link>
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
        <b-tabs  :style="this.mobileBrowser ? '' : 'margin-top: 9rem !important;' " v-model="tab">
          <b-tab>
            <template v-slot:title>
              <img
                :src="require(`@/assets/images/delivery-box-tab.png`)"
                alt="*"
                width="16"
                height="16"
              />
              <strong style="padding-left:10px;">Produtos</strong>
            </template>
            <div style="padding-top: 10px;">
              <h4 class="font-weight-light">Encontrado em</h4>
              <h2 class="font-weight-bold">{{ supplier.user.name }}</h2>
            </div>
            <div class="row" ref="productsWindow">
              <div class="col-xl-9 col-12">
                <div v-if="totalResults > 0" ref="content">
                  <span v-for="family in searchedFamilies" :key="family.family.id">
                    <h3
                      v-if="familyHasProducts(family.family.name)"
                      class="bg-rgba-light p-1 rounded ml-0 mr-0 mt-0 mb-1"
                    >
                      <i class="fa fa-lemon-o ml-50 mr-75"></i>
                      {{ family.family.name }}
                    </h3>
                    <div
                      class="row mt-1"
                      style="margin-left: 10px;"
                      v-for="(chunk, index) in productChunks(
                          productsFromFamily(family.family.name)
                        )"
                      :key="index"
                    >
                      <span
                        v-for="product in chunk"
                        :key="product.id"
                        style="width: 170px;"
                      >
                        <div style="padding-left: 5px;">
                          <h6 style="margin-bottom: 5px;">
                            <a
                              @click="selectProductType(product)"
                              style="text-decoration: underline;"
                            >{{ product.productTypeName }}</a>
                          </h6>
                        </div>
                        <div class="card font-small-3 mb-1" style="margin-right: 10px">
                          <div class="card-body pl-0 pr-1 pt-0 pb-0" style=" margin-left: 15px;">
                            <PublicStoreProductCard
                              v-if="supplier.user.supplierQuotationType != 'Manual'"
                              :product="product"
                              :expeditions="expeditionsByProduct(product)"
                              :loadedTotals="totals"
                              @quantity-input="checkTotals"
                              @remove-item="removeFromCart"
                              @fill-location="openLocationPopup"
                              style="background-color: white !important;"
                            />
                            <ProductCardManualStore v-else :product="product" style="background-color: white !important;"/>
                          </div>
                        </div>
                      </span>
                      </div>
                      <vs-divider class="mb-1" />
                  </span>
                  <div v-if="currentPage < totalPages" style="text-align: center;">
                    <button class="btn btn-outline-primary" @click="scroll()">Mostrar mais</button>
                  </div>
                </div>
                <div class="ml-3" v-else>
                  <h3>Não há produtos que correspondam a sua busca.</h3>
                  <ul class="ml-2">
                    <li>Você escreveu o termo corretamente?</li>
                    <li>Que tal usar menos palavras?</li>
                    <li>
                      Você pode
                      <router-link
                        :to="{
                            name: 'public-store',
                            params: {
                              supplierSlug: this.$route.params.supplierSlug,
                            },
                          }"
                        style="color: 0391D1; text-decoration: underline;"
                      >ir para o início</router-link>para encontrar o que procura
                    </li>
                  </ul>
                </div>
                <div v-if="searchSugestions.length > 0" style="padding-left: 15px; padding-bottom: 20px;">
                  <h3 class="mt-1">Veja também em outros fornecedores</h3>
                  <div class="row" style="overflow-x: scroll; flex-wrap: nowrap;">
                    <span
                      v-for="productSugestion in searchSugestions.slice(0, 5)"
                      :key="productSugestion.id"
                      :style="'width: 170px; margin-left: 5px; margin-right: 5px;'"

                    >
                    <div class="card font-small-3 mb-0" style="width: 170px;">
                      <div class="card-body pl-1 pr-1 pt-0 pb-0" style="">
                        <ProductCard :product="productSugestion" />
                      </div>
                    </div>
                    </span>
                    <span style="align-self: center;">
                      <div
                        class="card font-small-3"
                        style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                      >
                        <div class="card-body p-1">
                          <div class="row">
                            <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                            <div class="col-12 mt-1">
                              <router-link
                                :to="{
                                    name: 'users.search',
                                    params: { keyword: this.keyword },
                                  }"
                                class="btn btn-primary w-100"
                                style="padding-left: 3px; padding-right: 3px;"
                              >
                                <span class="font-medium-1 align-middle">Ver tudo</span>
                              </router-link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <img :src="require(`@/assets/images/store-tab.png`)" alt="*" width="16" height="16" />
              <strong style="padding-left:10px;">Lojas</strong>
            </template>
            <div style="padding-top: 20px;"></div>
            <div v-if="this.filteredSuppliers.length > 0">
              <div>
                <h4>Outras lojas com resultados para {{ keyword }}</h4>
              </div>
              <div
                style="display: flex;
                      flex-wrap: wrap;
                      flex-direction: row;"
                :style="mobileBrowser ? 'justify-content: center;' : ''"
              >
                <div v-for="supplier in filteredSuppliers" v-bind:key="supplier.id">
                  <supplier-card :supplier="supplier" />
                </div>
              </div>
            </div>
            <div v-else>
              <h3>Não há fornecedores que correspondam a sua busca.</h3>
              <ul class="ml-2">
                <li>Você escreveu o termo corretamente?</li>
                <li>Que tal usar menos palavras?</li>
                <li>
                  Você pode
                  <router-link
                    :to="{
                        name: 'public-store',
                        params: { supplierSlug: this.$route.params.supplierSlug },
                      }"
                    style="color: 0391D1; text-decoration: underline;"
                  >ir para o início</router-link>para encontrar o que procura
                </li>
              </ul>
            </div>
          </b-tab>
        </b-tabs>
      </div>
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
    background: rgb(245, 246, 247);
    width: -webkit-fill-available;
    z-index: 999;
    border-top: 1px solid lightgrey !important;
    border: none;
    border-radius: 0;
    padding-left: 40px;
    justify-content: flex-start !important;
  }
}

@media only screen and (min-width: 1200px) {
  .search-card-show {
    display: inline-block;
  }
  .nav.nav-tabs {
    position: fixed;
    background: rgb(245, 246, 247);
    width: -webkit-fill-available;
    z-index: 999;
    margin-left: -40px;
    border-top: 1px solid lightgrey !important;
    padding-left: 40px;
    border: none;
    border-radius: 0;
    justify-content: flex-start !important;
  }
}
</style>

<script>
import SuppliersService from "@/services/suppliers";
import SupplierCard from "@/components/suppliers/SupplierCard";
import ProductCardManualStore from "@/components/products/ProductCardManualStore";
import FamilySearchList from "@/components/families/FamilySearchList";
import PublicStoreProductCard from "@/components/products/PublicStoreProductCard";
import ProductCard from "@/components/products/ProductCard";
import SupplierInfoModal from "@/components/suppliers/SupplierInfoModal";
import StoreFamiliesModal from "@/components/users/StoreFamiliesModal";
import StoreLocationModal from "@/components/users/StoreLocationModal";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "StoreSearch",
  data() {
    return {
      keyword: this.$route.params.keyword,
      category: this.$route.query.category,
      productsLoaded: false,
      totals: [],
      supplierId: null,
      slug: undefined,
      familiesModal: false,
      show: false,
      openSupplierInfo: false,
      openLocation: false,
      targetClick: null,
      tab: 0,
      mobileBrowser: false,
      allAutoSuppliers: [],
      filteredSuppliers: [],
      searchSugestions: [],
      selectedFamily: null,
      viewType: null,
      home: null,
    };
  },
  mounted() {
    this.isMobileBrowser();
    this.tab = this.$route.params.tab;
    this.productsLoaded = false;
    this.slug = this.$route.params.supplierSlug;
    this.$vs.loading();
    this.clearSupplierProducts();
    this.clearExpeditionsBySupplier();
    this.userSelectedPage(1);
    this.setCurrentPage(1);
    this.loadStoreTotal();
    this.totals = JSON.parse(JSON.stringify(this.storeProducts));
    this.getSupplierBySlug(this.slug).then(() => {
      this.supplierId = this.supplier.id;
      this.getSupplierSearchWithCategories({
        keyword: this.keyword,
        supplierId: this.supplierId,
      });
      this.getCatalogById(this.supplier.id);
      this.storeSearchProducts({
        keyword: this.keyword,
        supplierId: this.supplierId,
        category: this.category,
      }).then(() => {
        this.$vs.loading.close();
        this.productsLoaded = true;
        //this.scroll()
      });
      this.searchProductsSugestions({ keyword: this.keyword }).then(
        (response) => {
          this.searchSugestions = response;
        }
      );
      SuppliersService.getAllAuto(this.params).then((response) => {
        this.allAutoSuppliers = response.data;
        SuppliersService.searchAutomaticCatalog(this.keyword).then(
          (response) => {
            this.runStoresSearch();
          }
        );
      });
    });
    setTimeout(() => {
      this.changeTab()
    }, 1000);
  },
  watch: {
    "$route.params.keyword": function (keyword) {
      this.keyword = keyword;
      this.productsLoaded = false;
      this.$vs.loading();
      this.clearProducts();
      this.userSelectedPage(1);
      this.setCurrentPage(1);
      this.getSupplierSearchWithCategories({
        keyword: this.keyword,
        supplierId: this.supplierId,
      });
      this.storeSearchProducts({
        keyword: this.keyword,
        supplierId: this.supplierId,
        category: null,
      }).then(() => {
        this.$vs.loading.close();
        this.productsLoaded = true;
      });
    },
    "$route.query.category": function (categoryId) {
      this.category = categoryId;
      this.productsLoaded = false;
      this.$vs.loading();
      this.clearProducts();
      this.userSelectedPage(1);
      this.setCurrentPage(1);
      this.storeSearchProducts({
        keyword: this.keyword,
        supplierId: this.supplierId,
        category: categoryId,
      }).then(() => {
        this.$vs.loading.close();
        this.productsLoaded = true;
      });
    },
    currentPage(pageNumber) {
      this.productsLoaded = false;
      this.$vs.loading();
      this.userSelectedPage(pageNumber);
      this.storeSearchProducts({
        keyword: this.keyword,
        supplierId: this.supplierId,
        category: this.category,
      }).then(() => {
        this.$vs.loading.close();
        this.productsLoaded = true;
      });
    },
  },

  computed: {
    ...mapState("pagination", ["totalPages"]),
    ...mapState("families", ["family", "products", "searchedFamilies"]),
    ...mapState("products", ["products"]),
    ...mapState("users/products", ["storeTotal", "storeProducts"]),
    ...mapState("suppliers", [
      "supplier",
      "catalog",
      "supplierProducts",
      "supplierExpeditions",
      "supplierOfferProducts",
    ]),
    ...mapGetters("families", [
      "chunckedProductsFromFamily",
      "categoriesWithCollection",
      "categoriesWithoutCollection",
    ]),

    maxPerScreen() {
      if (window.innerWidth >= 1910) {
        return 7;
      } else if (window.innerWidth >= 1600 && window.innerWidth < 1910) {
        return 6;
      } else if (window.innerWidth >= 1360 && window.innerWidth < 1600) {
        return 5;
      } else if (window.innerWidth >= 1220 && window.innerWidth < 1360) {
        return 4;
      } else if (window.innerWidth >= 900 && window.innerWidth < 1220) {
        return 3;
      } else if (window.innerWidth >= 600 && window.innerWidth < 900) {
        return 3;
      } else {
        return 2;
      }
    },

    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true;
      } else {
        return false;
      }
    },

    widthRatio() {
      return (window.innerWidth / this.maxPerScreen / window.innerWidth) * 100;
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
      let total = 0;
      for (let i = 0; i < this.searchedFamilies.length; i++) {
        let family = this.searchedFamilies[i];
        for (var key in family.with_collection) {
          let collection = family.with_collection[key];
          for (let j = 0; j < collection.length; j++) {
            total += collection[j].count;
          }
        }
        for (let k = 0; k < family.without_collection.length; k++) {
          total += family.without_collection[k].count;
        }
      }
      return total;
    },
  },
  methods: {
    ...mapActions("families", ["getSupplierSearchWithCategories"]),
    ...mapActions("products", ["clearProducts", "searchProductsSugestions"]),
    ...mapActions("suppliers", [
      "storeSearchProducts",
      "clearSearchProducts",
      "getExpeditionsBySearchAndSupplier",
      "getStoreSearchWithCategories",
      "clearSupplierProducts",
      "clearExpeditionsBySupplier",
      "getSupplierBySlug",
      "getCatalogById",
    ]),
    ...mapActions("pagination", ["userSelectedPage", "setCurrentPage"]),
    ...mapActions("users/products", [
      "setStoreTotal",
      "updateStoreProducts",
      "loadStoreTotal",
      "removeFromStoreProducts",
      "setStoreCanBuy",
    ]),
    isMobileBrowser() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
         this.mobileBrowser = false;
      }
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
    productsFromFamily(name) {
      return this.supplierProducts.filter(
        (product) => product.familyName == name
      );
    },
    familyHasProducts(name) {
      return this.supplierProducts.find(
        (product) => product.familyName == name
      );
    },
    expeditionsByProduct(product) {
      return this.supplierProducts
        .filter((obj) => obj.id == product.id)
        .map((exp) => exp.supplierProductExpeditions[0]);
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
    closing() {
      if (this.isMobile) {
        this.show = !this.show;
      }
    },
    storeHome() {
      this.$router.push({
        name: "public-store",
        params: { supplierSlug: this.$route.params.supplierSlug },
      });
    },
    selectedFamilyOnMenu(family) {
      this.$router.push({
        name: "public-store",
        params: { supplierSlug: this.$route.params.supplierSlug },
        query: { selected: "family", family: family },
      });
    },
    selectedCategoryOnModal(values) {
      this.$router.push({
        name: "public-store",
        params: { supplierSlug: this.$route.params.supplierSlug },
        query: {
          selected: "category",
          family: values.family,
          collection: values.collection,
          category: values.category,
        },
      });
    },
    selectedCollectionOnModal(values) {
      this.$router.push({
        name: "public-store",
        params: { supplierSlug: this.$route.params.supplierSlug },
        query: {
          selected: "collection",
          family: values.family,
          collection: values.collection,
        },
      });
    },
    selectProductType(product) {
      this.$router.push({
        name: "public-store-product",
        params: {
          supplierSlug: this.$route.params.supplierSlug,
          familyName: this.formatString(product.familyName),
          categoryName: this.formatString(product.categoryName),
          productTypeName: this.formatString(product.productTypeName),
        },
      });
      //this.$router.push({ name: 'public-store', params: { supplierSlug: this.$route.params.supplierSlug }, query: { selected: 'type', productTypeId: value } })
    },
    updateStoreFamiliesModal(val) {
      this.familiesModal = val;
    },
    updateSupplierPopup(val) {
      this.openSupplierInfo = val;
    },
    openFamiliesModal() {
      this.familiesModal = true;
    },
    runSupplierSearch() {
      this.$router.push({
        name: "public-store-search",
        params: { keyword: this.keyword },
      });
    },
    runStoresSearch() {
      SuppliersService.searchAutomaticCatalog(this.keyword).then((response) => {
        this.filteredSuppliers = this.allAutoSuppliers.filter((obj) =>
          response.data.includes(obj.id)
        );
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
    openLocationPopup(target) {
      this.targetClick = target;
      this.openLocation = true;
    },
    updateLocationModal(val) {
      this.openLocation = val;
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
    clearSearch(){
      this.keyword = null;
    },
    changeTab(){
      if(this.totalResults == 0 && this.filteredSuppliers.length > 0)
        this.tab = 1
    }
  },
  components: {
    FamilySearchList,
    PublicStoreProductCard,
    SupplierInfoModal,
    StoreFamiliesModal,
    StoreLocationModal,
    SupplierCard,
    ProductCardManualStore,
    ProductCard,
  },
};
</script>

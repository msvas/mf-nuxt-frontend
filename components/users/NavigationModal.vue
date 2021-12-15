<template>
    <vs-popup title="Selecione" :active.sync="open">
        <div>
          <b-tabs v-model="tab" v-if="this.innerViewType == 'family-collections' || this.innerViewType == 'family' || (selectedFamilyOnModal != 'Alimentos e bebidas' && this.innerViewType == 'collection')">
            <b-tab @click="selectFamilyTab(index)" v-for="(family, index) in catalog" :key="index">
              <template v-slot:title>
                <span v-html="getFamilyIcon(index)" />
                <strong>{{tabTitle(index)}}</strong>
              </template>
              <div>
               <div class="w-100 d-flex justify-content-center mb-0 mt-4">
                  <button @click="selectFamily(index)" class="btn btn-primary m-1 w-75 mb-0" v-if="index == 'Alimentos e bebidas'">Selecionar tudo</button>
               </div>
                <div v-if="index == 'Alimentos e bebidas'" style="padding-left: 30px;">
                  <div style="display: flex;
                              flex-flow: row wrap;
                              flex-direction: row;
                              flex-wrap: wrap;
                              "
                  >
                    <span @click="selectCollectionChip(index, index1)" class="collections-style" v-for="(collection, index1) in family" :key="index1">
                      <img :width="collectionImgWidth" :height="collectionImgHeight"
                        :src="findPictureByName(index1)"
                        style="border-radius:10px; cursor: pointer;"
                      >
                      <vs-chip  style="margin-top: -15px;" class="public-chip p-0 pr-1" :class="index1 == selectedCollection ? 'chip-mf-selected' : 'chip-mf'">
                        <a href="javascript:void(0)" >{{index1}}</a>
                      </vs-chip>
                    </span>
                  </div>
                </div>
                <div v-else>
                  <span v-for="(collection, index1) in family" :key="index1">
                      <div class="w-100 d-flex justify-content-center mb-0">
                        <button @click="selectFamily(index)" class="btn btn-primary m-1 w-50" style="white-space:norwap;">Selecionar tudo</button>
                      </div>
                    <div style="display: flex;
                                flex-flow: row wrap;
                                place-content: center;"
                      >
                      <span  v-for="(category, index2) in collection" :key="index2" class="categories-style">
                        <vs-chip class="chip-mf public-chip p-0 pr-1" :class="index2 == selectedCategory ? 'chip-mf-selected' : 'chip-mf'">
                          <a href="javascript:void(0)" @click="selectCategoryChip(index, index1, index2)">{{index2}}</a>
                        </vs-chip>
                      </span>
                    </div>
                  </span>
                </div>
              </div>
            </b-tab>
          </b-tabs>
          <div v-if="selectedFamilyOnModal == 'Alimentos e bebidas' && this.innerViewType == 'collection'">
            <div v-for="(family, index) in catalog" :key="index">
              <div v-for="(collection, index1) in family" :key="index1">
                <div v-if="index1 == selectedCollectionOnModal">
                  <div class="w-100 d-flex flex-column align-items-center">
                    <div class="w-75 d-flex flex-row mt-1 align-items-center justify-content-center">
                      <i @click="prevInnerViewType()" style="font-size: 25px; !important; cursor: pointer;" class="feather icon-arrow-left w-25"></i>
                      <h4 class="w-75"> {{selectedCollectionOnModal}}</h4>
                    </div>
                    <button @click="selectCollection(index, index1)" class="btn btn-primary mt-4 w-75">Selecionar tudo</button>
                  </div>
                  <div class="mt-1" style=" display: flex;
                                            flex-direction:row;
                                            flex-wrap: wrap;"
                  >
                  <span class="categories-style" v-for="(category, index2) in collection" :key="index2">
                    <vs-chip  class="public-chip p-0 pr-1" :class="index2 == selectedCategory ? 'chip-mf-selected' : 'chip-mf'">
                      <a  @click="selectCategoryChip(index, index1, index2)" href="javascript:void(0)">{{index2}}</a>
                    </vs-chip>
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="selectedFamilyOnModal == 'Alimentos e bebidas' && (this.innerViewType == 'category-all-products' || this.innerViewType == 'category' || this.innerViewType == 'product-type' )">
            <div v-for="(family, index) in catalog" :key="index">
              <div v-for="(collection, index1) in family" :key="index1">
                <div v-if="index1 == selectedCollectionOnModal">
                  <span v-for="(category, index2) in collection" :key="index2">
                    <span v-if="index2 == selectedCategoryOnModal">
                     <div class="w-100 d-flex flex-column align-items-center">
                      <div class="w-75 d-flex flex-row mt-1 align-items-center justify-content-center">
                        <i @click="prevInnerViewType()" style="font-size: 25px; !important; cursor: pointer;" class="feather icon-arrow-left w-25"></i>
                        <h4 class="w-75">{{selectedCategoryOnModal}}</h4>
                      </div>
                      <button @click="selectCategory(index, index2)" class="btn btn-primary mt-4 w-75">Selecionar tudo</button>
                      </div>
                      <div class="mt-1" style=" display: flex;
                                                flex-flow: row wrap;
                                                place-content: center;"
                      >
                        <span class="categories-style" v-for="productType in category" :key="productType.productTypeId">
                          <vs-chip class="public-chip p-0 pr-1" :class="productType.productType == selectedProductTypeOnModal ? 'chip-mf-selected' : 'chip-mf'">
                            <a v-if="productType.productType.length > 16" @click="selectProductType(index, index2, productType.productType)" href="javascript:void(0)">{{productType.productType.substring(0, productType.productType.length - 9)}}...</a>
                            <a v-else @click="selectProductType(index, index2, productType.productType)" href="javascript:void(0)">{{productType.productType}}</a>
                          </vs-chip>
                        </span>
                      </div>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="selectedFamilyOnModal != 'Alimentos e bebidas' && (this.innerViewType == 'category-all-products' || this.innerViewType == 'category' || this.innerViewType == 'product-type' )">
            <div v-for="(family, index) in catalog" :key="index">
              <div v-for="(collection, index1) in family" :key="index1">
                <span v-for="(category, index2) in collection" :key="index2">
                  <span v-if="index2 == selectedCategoryOnModal && index == selectedFamilyOnModal">
                    <div class="w-100 d-flex flex-column align-items-center">
                      <div class="w-75 d-flex flex-row mt-1 align-items-center justify-content-center">
                        <i @click="prevInnerViewType()" style="font-size: 25px; !important; cursor: pointer;" class="feather icon-arrow-left w-25"></i>
                        <h4 class="w-75">{{selectedCategoryOnModal}}</h4>
                      </div>
                      <button @click="selectCategory(index, index2)" class="btn btn-primary mt-4 w-75">Selecionar tudo</button>
                    </div>
                    <div class="mt-1" style=" display: flex;
                                              flex-flow: row wrap;
                                              place-content: center;"
                    >
                      <span class="categories-style" v-for="productType in category" :key="productType.productTypeId">
                        <vs-chip  class="public-chip p-0 pr-1" :class="productType.productType == selectedProductTypeOnModal ? 'chip-mf-selected' : 'chip-mf'">
                          <a v-if="productType.productType.length > 16" @click="selectProductType(index, index2, productType.productType)" href="javascript:void(0)">{{productType.productType.substring(0, productType.productType.length - 9)}}...</a>
                          <a v-else @click="selectProductType(index, index2, productType.productType)" href="javascript:void(0)">{{productType.productType}}</a>
                        </vs-chip>
                      </span>
                    </div>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
    </vs-popup>
</template>

<style>
  .vs-popup {
    width: 500px !important;
    position: absolute;
    top: 20px;
  }
  .vs-popup--content {
    padding: 0;
    margin-top: 0;
    margin-bottom: 2rem !important;
  }
  .nav.nav-tabs {
    border: none;
    margin-bottom: 1rem;
    position: relative;
    border-radius: 0;
    justify-content: center;
    margin-bottom: 2rem;
  }
  .nav.nav-tabs .nav-item .nav-link {
    color: #626262;
    font-size: 0.95rem;
    border: none;
    min-width: auto;
    font-weight: 450;
    padding: 0.61rem 0.635rem;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
  }
  .nav.nav-tabs .nav-item .nav-link.active {
    filter: invert(25%) sepia(85%) saturate(2172%) hue-rotate(152deg) brightness(93%) contrast(101%);
    border: none;
    position: relative;
    color: black;
    transition: all 0.2s ease;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
  }
  .nav.nav-tabs .nav-item .nav-link.active:after {
    content: attr(data-before);
    height: 4px;
    width: 100%;
    left: 0;
    position: absolute;
    bottom: 0;
    top: 100%;
    border-radius: 20px;
    background: black !important;
    box-shadow: 0 0 8px 0 rgb(115 103 240 / 50%) !important;
    transform: translateY(0px);
    transition: all 0.2s linear;
  }

  .collections-style{
    flex-basis: 40%;
    margin: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .categories-style{
    flex: 40%;
    margin: 5px;
    display: flex;
    padding-left: 10%;
  }

  @media only screen and (min-width: 761px){

    .breadcrumbs-container{
      font-size: 14px;
      cursor: pointer;
      border-left: none;
      padding: 5px 10px 5px 10px;
      width: 100%;
      background: #0CB695;
;
    }
  }
  @media only screen and (max-width: 762px) {

    .breadcrumbs-container{
      font-size: 10px;
      cursor: pointer;
      border-left: none;
      padding: 8px;
      width: 100%;
      background: #0CB695;
    }
  }
</style>

<script>
import FamilyService from "@/services/families";

export default {
    name: "NavigationModal",
    data(){
      return {
        open: false,
        collectionPictures: [],
        innerViewType: '',
        selectedFamilyOnModal: '',
        selectedCollectionOnModal: '',
        selectedCategoryOnModal: '',
        selectedProductTypeOnModal: '',
        mobileBrowser: false,
      }
    },
    mounted(){
      this.isMobile();
      FamilyService.getCollectionPictures(1).then((response) => {
        this.collectionPictures = response.data
      });
    },
    computed:{
      collectionImgWidth(){
        if (this.mobileBrowser)
          return '110px';
        else
          return '150px';
      },
      collectionImgHeight(){
        if (this.mobileBrowser)
          return '40px';
        else
          return '60px';
      }
    },
    watch: {
      openPopup() {
        this.innerViewType = this.selectedViewType
        this.open = this.openPopup
        //this.tab
        this.selectedFamilyOnModal = this.selectedFamily
        this.selectedCollectionOnModal = this.selectedCollection
        this.selectedCategoryOnModal = this.selectedCategory
        if(this.selectedProductType)
          this.selectedProductTypeOnModal = this.selectedProductType.productType
      },
      open() {
        this.$emit('update-nav-modal', this.open)
      },
    },
    methods:{
      findPictureByName(name) {
          var found = this.collectionPictures.find(pic => pic.name == name)
          if(found && found.imageUrl)
            return found.imageUrl
          else
            return require(`@/assets/images/collection_banner.jpg`)
      },
      getFamilyIcon(family){
        switch(family) {
          case 'Alimentos e bebidas':
            return '<img src="' + require(`@/assets/images/alim-e-bebidas.png`) + '" alt="*" width="16">'
          case 'Embalagens':
            return '<img src="' + require(`@/assets/images/embalagens.png`) + '" alt="*" width="16">'
          case 'Limpeza':
            return '<img src="' + require(`@/assets/images/limpeza.png`) + '" alt="*" width="16">'
          case 'Utensílios':
            return '<img src="' + require(`@/assets/images/utensilios.png`) + '" alt="*" width="16">'
        }
      return null
      },
      selectCategory(familyName, categoryName) {
        if (this.$route.name == 'public-store' || this.$route.name ==  'public-store-family' || this.$route.name ==  'public-store-category' || this.$route.name ==  'public-store-product' || this.$route.name == 'public-store-product-page')
          this.$router.push({name: 'public-store-category', params: { familyName: this.formatString(familyName), categoryName: this.formatString(categoryName) }})
        else
          this.$router.push({name: 'cotar-categoria', params: { familyName: this.formatString(familyName), categoryName: this.formatString(categoryName) }})
        this.open = false
      },
      selectCollection(familyName, collectionName) {
        this.selectedFamilyOnModal = familyName
        this.selectedCollectionOnModal = collectionName
        this.$emit('selected-collection', { family: familyName, collection: collectionName })
        this.open = false
      },
      selectProductType(familyName, categoryName, productTypeName) {
        this.selectedProductTypeOnModal = productTypeName
        if (this.$route.name == 'public-store' || this.$route.name ==  'public-store-family' || this.$route.name ==  'public-store-category' || this.$route.name ==  'public-store-product' || this.$route.name == 'public-store-product-page')
          this.$router.push({name: 'public-store-product', params: {familyName: this.formatString(familyName), categoryName: this.formatString(categoryName), productTypeName: this.formatString(productTypeName)}})
        else
          this.$router.push({name: 'cotar-produto', params: {familyName: this.formatString(familyName), categoryName: this.formatString(categoryName), productTypeName: this.formatString(productTypeName)}})
      },
      selectFamily(familyName){
        if((this.$route.name == 'cotar-familia' && familyName == this.selectedFamily) || (this.$route.name == 'public-store-family' && familyName == this.selectedFamily))
          this.$router.go()
        else if (this.$route.name == 'public-store' || this.$route.name ==  'public-store-family' || this.$route.name ==  'public-store-category' || this.$route.name ==  'public-store-product' || this.$route.name == 'public-store-product-page')
          this.$router.push({ name: 'public-store-family', params: { familyName: this.formatString(familyName) }});
        else this.$router.push({ name: 'cotar-familia', params: { familyName: this.formatString(familyName) }});


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
      selectCollectionChip(familyName, collectionName){
        this.selectedFamilyOnModal = familyName
        this.selectedCollectionOnModal = collectionName
        this.innerViewType = 'collection'
      },
      selectCategoryChip(familyName, collectionName, categoryName){
        this.selectedFamilyOnModal = familyName
        this.selectedCollectionOnModal = collectionName
        this.selectedCategoryOnModal = categoryName
        this.innerViewType = 'category-all-products'
      },
      prevInnerViewType(){
        if(this.innerViewType == 'collection' && this.selectedFamilyOnModal == 'Alimentos e bebidas')
          this.innerViewType = 'family-collections'
        else if (this.innerViewType == 'category-all-products' || this.innerViewType == 'product-type' || this.innerViewType == 'category')
          this.innerViewType = 'collection'
      },
      selectFamilyTab(familia){
        this.selectedFamilyOnModal = familia
        if(familia == 'Alimentos e bebidas')
          this.innerViewType = 'family-collections'
        else this.innerViewType = 'collection'
      },
      isMobile() {
        if (screen.width <= 760 || window.innerWidth <= 760) {
            this.mobileBrowser = true;
        } else {
            this.mobileBrowser = false;
        }
      },
      tabTitle(familyName){
        if (this.mobileBrowser){
          if (familyName == 'Alimentos e bebidas')
            return 'Alim. e beb.'
          else if (familyName == 'Embalagens')
            return 'Embal.'
          else if (familyName == 'Limpeza')
            return 'Limp.'
           else return 'Utens.'
        }else if (familyName == 'Alimentos e bebidas')
          return 'Alim. e bebidas'
          else return familyName
      }
    },
    props: {
      openPopup: {
        type: Boolean,
        required: true,
      },
      tab: {
        type: Number,
      },
      catalog: {
        required: true,
      },
      selectedProductType: {
        type: Object
      },
      selectedCategory: {
        type: String
      },
      selectedCollection: {
        type: String
      },
      selectedFamily: {
        type: String
      },
      selectedViewType:{
        type: String,
        required: true,
      }
    },
}
</script>

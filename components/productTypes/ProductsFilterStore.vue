<template>
  <div class="card h-100 shadow-sm font-small-3 mb-0">
    <div class="card-content">
      <div class="card-body" style="padding: 0px 12px 12px 12px;">
        <div>
          <div class="row mb-2">
            <vs-button class="ml-1" v-if="isMobile" @click="closeSideBar()" color="primary">
              Aplicar
            </vs-button>
            <a style="border-bottom: 1px solid #007bff; padding-bottom: 1px; color: #007bff;" @click="clearFilters()" class="mr-2 ml-2 mt-1">
              Limpar tudo <i class="feather icon-corner-down-left"></i>
            </a>
          </div>

          <span style="color: Grey;" v-if="showProperties.length > 0 && showProperties[0].id">Carac. principal</span>
          <div class="mt-1" v-if="showProperties.length > 0 && showProperties[0].id">
            <div class="input-group mb-1">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  <i class="feather icon-search"></i>
                </span>
              </div>
              <input
                @input="searchProperties()"
                type="text"
                class="form-control"
                placeholder="Buscar característica"
                aria-label="Característica"
                aria-describedby="basic-addon1"
                v-model="propertyInput"
               >
               <span v-if="propertyInput && propertyInput.length" class="input-group-append">
                 <button
                  class="btn bg-transparent border-left-0 border"
                  style="padding: 0.5em;"
                  @click="propertyInput = ''; searchProperties()"
                  type="button"
                 >
                   <i class="fa fa-times"></i>
                 </button>
               </span>
            </div>
            <div>
              <span v-for="property in showProperties" :key="property.id">
                <span @click="selectProperty(property.id)">
                   <vs-chip
                    v-if="property.id"
                    :class="propertyChipClass(property.id)"
                    :vs-value="property.id"
                    style="display: inline-block; float: none; cursor:pointer;"
                  >
                    <a style="margin-top: 6px;">{{ property.name }}</a>
                  </vs-chip>
                </span>
              </span>
            </div>
          </div>

          <div v-if="showVolumes.length > 0">
            <vs-divider style="margin-top: 0;"/>
            <span style="color: Grey;">Volume</span>
            <div class="mt-1 mb-1">
              <div class="row" v-if="showVolumes.length">
                <div class="col-12">
                  <span
                    v-for="volume in showVolumes"
                    :key="volume.units_of_measurement_name + volume.packaging_name + volume.product_quantity"
                    :vs-value="volume.units_of_measurement_name + volume.packaging_name + volume.product_quantity"
                  >
                    <span @click="selectVolume(volume)">
                      <vs-chip :class="volumeChipClass(volume)" style="cursor: pointer;">
                        <a>{{ volume.packaging_name }} {{ volume.product_quantity }} {{ volume.units_of_measurement_name }}</a>
                      </vs-chip>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="showTags.length > 0">
            <vs-divider style="margin-top: 0;"/>
            <span style="color: Grey;">Carac. secundária</span>
            <div class="mt-1">
              <span v-for="group in uniqueTagGroups" :key="'group' + group">
                <vs-checkbox
                  v-model="selectedTags"
                  color="#008567"
                  v-for="tag in tagsFromGroup(group)"
                  :key="tag.id"
                  :vs-value="tag.id"
                  style="justify-content: left;"
                >
                  {{ tag.name }}
                </vs-checkbox>
                <br>
              </span>
            </div>
          </div>

          <div v-if="showBrands.length > 0" class="text-dark mb-1">
            <vs-divider/>
            <span style="color: Grey;">Marca</span>
            <div class="mt-1">
              <span>
                <div class="input-group mb-1">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">
                      <i class="feather icon-search"></i>
                    </span>
                  </div>
                  <input
                    @input="searchBrands()"
                    type="text"
                    class="form-control"
                    placeholder="Buscar marca"
                    aria-label="Marca"
                    aria-describedby="basic-addon1"
                    v-model="brandInput"
                   >
                   <span v-if="brandInput && brandInput.length" class="input-group-append">
                     <button
                      class="btn bg-transparent border-left-0 border"
                      style="padding: 0.5em;"
                      @click="brandInput = ''; searchBrands()"
                      type="button"
                     >
                       <i class="fa fa-times"></i>
                     </button>
                   </span>
                </div>
                <span  v-for="brand in showBrands" :key="brand.id">
                 <span @click="selectBrand(brand)">
                    <vs-chip :class="brandsChipClass(brand.id)" style="display: inline-block; float: none; cursor: pointer;">
                  <a  style="margin-top: 6px;" v-if="brand.name" >{{ brand.name }}</a>
                  <a  style="margin-top: 6px;" v-else >(marca não def.)</a>
                </vs-chip>
                 </span>
                </span>
              </span>
            </div>
          </div>

        </div>
        <div class="row">
          <vs-button class="ml-1" v-if="isMobile" @click="closeSideBar()" color="primary">
            Aplicar
          </vs-button>
          <a style="border-bottom: 1px solid #007bff; padding-bottom: 1px; color: #007bff;" @click="clearFilters()" class="mr-2 ml-2 mt-1">
            Limpar tudo <i class="feather icon-corner-down-left"></i>
          </a>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

var sortBy = require("lodash.sortby");

export default {
  name: "ProductsFilter",
  data() {
    return {
      showProperties: [],
      showBrands: [],
      showVolumes: [],
      showTags: [],
      propertyInput: null,
      selectedProperties: [],
      selectedBrands: [],
      selectedTags: [],
      selectedVolumes: [],
      brandInput: null,
    };
  },
  async created() {
    if(!this.supplierId)
      this.loadGeneralFilters()
    else
      this.loadSupplierFilters()
  },
  computed: {
    ...mapState("productTypes/properties", ["properties"]),
    ...mapState("productTypes/packagings", ["volumes"]),
    ...mapState("productTypes/brands", ["brands"]),
    ...mapState("productTypes/tags", ["tags"]),
    ...mapState("productTypes", ["filterOptions"]),
    uniqueTagGroups() {
      return [...new Set(this.showTags.map(tag => tag.group_id))]
    }
  },
  watch: {
    selectedTags() {
      if(!this.isMobile)
        this.$emit('updated-filters', { volumes: this.selectedVolumes, brands: this.selectedBrands, tags: this.selectedTags, properties: this.selectedProperties })
      this.getUpdatedFilters()
    }
  },
  methods: {
    ...mapActions("productTypes", ["setFilterProductType", "setFilterProperties", "setFilterTags"]),
    ...mapActions("productTypes/brands", ["getProductTypeFilteredBrands", "getProductTypeBrands"]),
    ...mapActions("productTypes/packagings", ["getProductTypeFilteredVolumeOptions", "getProductTypeVolumeOptions"]),
    ...mapActions("productTypes/tags", [
      "getProductTypeTags",
      "getProductTypeFilteredTags"
    ]),
    ...mapActions("productTypes/properties", [
      "getProductTypeProperties",
      "getProductTypeFilteredProperties"
    ]),
    ...mapActions("suppliers", [
      "getProductTypeSupplierBrands",
      "getProductTypeSupplierProperties",
      "getProductTypeSupplierTags",
      "getProductTypeSupplierPackagings",
    ]),
    loadGeneralFilters() {
      this.getProductTypeProperties(this.productTypeId).then(() => {
        this.showProperties = sortBy(this.properties, 'name')
      })
      this.getProductTypeTags(this.productTypeId).then(() => {
        this.showTags = this.tags
      })
      this.getProductTypeBrands(this.productTypeId).then(() => {
        if(this.brands && this.brands.length > 1)
          this.showBrands = [...new Set(this.brands)].sort((a, b) => a.name.localeCompare(b.name))
        else
          this.showBrands = this.brands
      })
      this.getProductTypeVolumeOptions(this.productTypeId).then(() => {
        if(this.volumes && this.volumes.length > 1)
          this.showVolumes = [...new Set(this.volumes)].sort((a, b) => a.packaging_name.localeCompare(b.packaging_name))
        else
          this.showVolumes = this.volumes
      })
    },
    loadSupplierFilters() {
      var aux = { data: {  },
                  productTypeId: this.productTypeId,
                  supplierId: this.supplierId }
      this.getProductTypeSupplierProperties(aux).then((response) => {
        this.showProperties = sortBy(response, 'name')
      })
      this.getProductTypeSupplierTags(aux).then((response) => {
        this.showTags = response
      })
      this.getProductTypeSupplierBrands(aux).then((response) => {
        if(response && response.length > 1)
          this.showBrands = [...new Set(response)].sort((a, b) => a.name.localeCompare(b.name))
        else
          this.showBrands = response
      })
      this.getProductTypeSupplierPackagings(aux).then((response) => {
        if(response && response.length > 1)
          this.showVolumes = [...new Set(response)].sort((a, b) => a.packaging_name.localeCompare(b.packaging_name))
        else
          this.showVolumes = response
      })
    },
    volumeChipClass(volume) {
      let volumeSelected = this.selectedVolumes.find(
        (b) => (b.units_of_measurement_name == volume.units_of_measurement_name &&
                b.packaging_name == volume.packaging_name &&
                b.product_quantity == volume.product_quantity)
      )

      if(volumeSelected)
        return 'chip-mf-selected brand-selected'
      else
        return 'chip-mf brand-not-selected'
    },
    brandsChipClass(id) {
      if(this.selectedBrands.find(b => b === id))
        return 'chip-mf-selected brand-selected'
      else
        return 'chip-mf brand-not-selected public-chip'
    },
    selectVolume(volume) {
      let volumeSelected = this.selectedVolumes.find(
        (b) => (b.units_of_measurement_name == volume.units_of_measurement_name &&
                b.packaging_name == volume.packaging_name &&
                b.product_quantity == volume.product_quantity)
      )

      if (!volumeSelected) {
        this.selectedVolumes.push(volume)
      } else {
        this.selectedVolumes = this.selectedVolumes.filter(
          (b) => (b.units_of_measurement_name != volume.units_of_measurement_name ||
                  b.packaging_name != volume.packaging_name ||
                  b.product_quantity != volume.product_quantity)
        )
      }
      if(!this.isMobile)
        this.$emit('updated-filters', { volumes: this.selectedVolumes, brands: this.selectedBrands, tags: this.selectedTags, properties: this.selectedProperties })
      this.getUpdatedFilters()
    },
    searchBrands() {
      if(this.brandInput != null && this.brandInput != '') {
        this.showBrands = this.brands.filter(
          (brandChip) => this.normalizeString(brandChip.name).match(this.normalizeString(this.brandInput))
        )
      } else {
        this.showBrands = this.brands
      }
    },
    closeSideBar() {
      this.$emit('close-sidebar')
      this.$emit('updated-filters', { volumes: this.selectedVolumes, brands: this.selectedBrands, tags: this.selectedTags, properties: this.selectedProperties })
    },
    selectProperty(id) {
      let selectedProperty = this.selectedProperties.find((b) => b === id);

      if(selectedProperty) {
        this.selectedProperties = this.selectedProperties.filter(
          (propertyChip) => propertyChip !== id
        )
      } else {
        this.selectedProperties.push(id);
      }
      if(!this.isMobile)
        this.$emit('updated-filters', { volumes: this.selectedVolumes, brands: this.selectedBrands, tags: this.selectedTags, properties: this.selectedProperties })
      this.getUpdatedFilters()
    },
    propertyChipClass(id) {
      if(this.selectedProperties.includes(id))
        return 'mb-1 chip-mf-selected brand-selected'
      else
        return 'mb-1 chip-mf'
    },
    clearFilters() {
      this.selectedProperties = []
      this.selectedBrands = []
      this.selectedTags = []
      this.selectedVolumes = []
      if(!this.isMobile)
        this.$emit('updated-filters', { volumes: this.selectedVolumes, brands: this.selectedBrands, tags: this.selectedTags, properties: this.selectedProperties })
      this.getUpdatedFilters()
    },
    searchProperties() {
      if(this.propertyInput != null && this.propertyInput != '') {
        this.showProperties = this.properties.filter(
          (propertyChip) => propertyChip.id && this.normalizeString(propertyChip.name).match(this.normalizeString(this.propertyInput))
        )
      } else {
        this.showProperties = this.properties
      }
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
    selectBrand(brand) {
      let brandSelected = this.selectedBrands.includes(brand.id)

      if(brandSelected) {
        this.selectedBrands = this.selectedBrands.filter((brandChip) => brandChip !== brand.id);
      } else {
        this.selectedBrands.push(brand.id);
      }
      if(!this.isMobile)
        this.$emit('updated-filters', { volumes: this.selectedVolumes, brands: this.selectedBrands, tags: this.selectedTags, properties: this.selectedProperties })
      this.getUpdatedFilters()
    },
    tagsFromGroup(group) {
      var tags = this.showTags.filter(tag => tag.group_id == group)
      return [...new Set(tags)]
    },
    getUpdatedFilters() {
      if(!this.supplierId)
        this.getUpdatedFiltersGeneral()
      else
        this.getUpdatedFiltersSupplier()
    },
    getUpdatedFiltersGeneral() {
      var aux = { data:
                    { packaging_ids: this.selectedVolumes,
                      brand_ids: this.selectedBrands,
                      tag_ids: this.selectedTags,
                      property_ids: this.selectedProperties },
                  productTypeId: this.productTypeId }
      this.getProductTypeFilteredBrands(aux).then(() => {
        if(this.brands && this.brands.length > 1)
          this.showBrands = [...new Set(this.brands)].sort((a, b) => a.name.localeCompare(b.name))
        else
          this.showBrands = this.brands
      })
      this.getProductTypeFilteredVolumeOptions(aux).then(() => {
        if(this.volumes && this.volumes.length > 1)
          this.showVolumes = [...new Set(this.volumes)].sort((a, b) => a.packaging_name.localeCompare(b.packaging_name))
        else
          this.showVolumes = this.volumes
      })
      this.getProductTypeFilteredTags(aux).then(() => {
        this.showTags = this.tags
      })
      this.getProductTypeFilteredProperties(aux).then(() => {
        this.showProperties = sortBy(this.properties, 'name')
      })
    },
    getUpdatedFiltersSupplier() {
      var aux = { data:
                    { packaging_ids: this.selectedVolumes,
                      brand_ids: this.selectedBrands,
                      tag_ids: this.selectedTags,
                      property_ids: this.selectedProperties },
                  productTypeId: this.productTypeId,
                  supplierId: this.supplierId }
      this.getProductTypeSupplierProperties(aux).then((response) => {
        this.showProperties = sortBy(response, 'name')
      })
      this.getProductTypeSupplierTags(aux).then((response) => {
        this.showTags = response
      })
      this.getProductTypeSupplierBrands(aux).then((response) => {
        if(response && response.length > 1)
          this.showBrands = [...new Set(response)].sort((a, b) => a.name.localeCompare(b.name))
        else
          this.showBrands = response
      })
      this.getProductTypeSupplierPackagings(aux).then((response) => {
        if(response && response.length > 1)
          this.showVolumes = [...new Set(response)].sort((a, b) => a.packaging_name.localeCompare(b.packaging_name))
        else
          this.showVolumes = response
      })
    },
  },
  mounted() {

  },
  components: {

  },
  props: {
    isMobile: {
      type: Boolean
    },
    productTypeId: {
      type: Number,
      required: true,
    },
    supplierId: {
      type: Number,
    },
  }
};
</script>

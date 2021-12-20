<template>

  <div class="row" v-if="expeditions.length">
    <meta itemprop="sku" :content="product.id" />
    <meta itemprop="productID" :content="product.id" />
    <meta itemprop="inProductGroupWithID" :content="product.productTypeId" />
    <div  class="col-12 pt-1">
      <router-link
        :to="{ name: 'public-store-product-page',
               params: { supplierSlug: this.$route.params.supplierSlug,
                         familyName: formatString(product.familyName),
                         categoryName: formatString(product.categoryName),
                         productTypeName: formatString(product.productTypeName),
                         identifier: productIdentifier(product) } }"
        data-toggle="lightbox"
        title="Foto do produto"
        class="float-right"
        tabindex="-1"
      >
        <img v-if="product.picture" class="rounded img-fluid" :src="product.picture" alt style="width: 100%; height: auto;" />
        <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: 100%; height: auto;" />
        <div class="badge badge-pill badge-md bg-mf-laranja" style="position: absolute; bottom: 5px; left: 10px;">
          <b>{{ quantifiers(true) == 'Und. 1 und' ? 'Und' :  quantifiers(true) }}</b>
        </div>
      </router-link>
      <product-photo-modal :product="product" :openPopup="openPhoto" @update-modal="updateModal" />
    </div>
    <div itemprop="name" class="col-12">
      <router-link
        :to="{ name: 'public-store-product-page',
               params: { supplierSlug: this.$route.params.supplierSlug,
                         familyName: formatString(product.familyName),
                         categoryName: formatString(product.categoryName),
                         productTypeName: formatString(product.productTypeName),
                         identifier: productIdentifier(product) } }"
        data-toggle="lightbox"
        title="Foto do produto"
        data-title="Maionese"
        class=""
        tabindex="-1"
      >
        <div class="col-12 p-0 pb-1 pt-1">
          <p class="m-0" style="color: #333;">
            {{ productBrandName }}<span v-if="productBrandName && product.productLineName">,</span>
            {{ product.productLineName }}<span v-if="product.productLineName && product.productLineExtensionName">,</span>
            {{ product.productLineExtensionName }}
          </p>
          <p class="m-0 font-weight-bold text-success"><b>{{ product.propertyName }}</b></p>
        </div>
        <div class="col-12 p-0 pb-1 font-small-3">
          <v-new-secondary-characteristics :product="product" />
        </div>
      </router-link>
    </div>
    <div class="col-12 pb-0 mb-0">
      <router-link
        :to="{ name: 'public-store-product-page',
               params: { supplierSlug: this.$route.params.supplierSlug,
                         familyName: formatString(product.familyName),
                         categoryName: formatString(product.categoryName),
                         productTypeName: formatString(product.productTypeName),
                         identifier: productIdentifier(product) } }"
        data-toggle="lightbox"
        title="Foto do produto"
        data-title="Maionese"
        class=""
        style="color: inherit;"
        tabindex="-1"
      >
       <div
         :class="expeditions.length > 1 ? 'row' : 'row h-100'"
         v-for="expedition in getLowestPrice(expeditions)"
         :key="expedition.id"
       >
         <div class="col-12 pb-1 h-100">
           <div class="row" v-if="expedition.unavailability">
             <div class="col-12">
               <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                 a granel
               </span>
               <span v-else>
                 <span class="text-warning">
                   <span v-if="product.packagingName == 'Und.' && product.quantity == 1">
                     {{ product.unitsOfMeasurementName }}
                   </span>
                   <span v-else>
                     {{ product.packagingName }} {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                   </span>
                 </span>
               </span>
             </div>
             <div class="col-12" style="margin-top: 8px;">
              <span class="badge badge-pill font-small-3" style="margin-right: 5px; color: #4d4d4d; background-color: #f0f0f0;">
                Sem estoque
              </span>
            </div>
           </div>
           <div v-else class="row" style="justify-content: space-between;">
             <div class="col-12" v-if="expedition.sale && !blockSaleBadge" style="margin-bottom: 5px;">
               <span class="badge badge-pill badge-danger">
                 <span class="font-medium-1"> Oferta</span>
               </span>
             </div>
             <div class="col-12">
               <span class="" v-if="!product.packagingName && !product.quantity">
                 <span class="font-small-2" v-if="hasDiscount(expedition)">
                   A partir de<br>
                 </span>
                 <b><span class="font-small-1">R$ </span><span class="font-medium-3">{{ formatPrice(lowestWithDiscounts(expedition)).substring(3) }}</span></b>
                 <span v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                   p/ kg
                 </span>
                 <span v-else>
                   <span v-if="product.packagingName != 'Und.'" >
                     <span v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</span>
                     <span v-else> p/ und</span>
                   </span>
                 </span>
                 <div class="text-warning">
                   a granel
                 </div>
               </span>
               <span v-else>
                 <span class="font-small-2" v-if="expeditions.length > 1 || hasDiscount(expedition)">
                   A partir de<br>
                 </span>
                 <b><span class="font-small-1">R$ </span><span class="font-medium-3">{{ formatPrice(lowestWithDiscounts(expedition)).substring(3) }}</span></b>
                 <br>
                 <span class="text-warning">
                   <span v-if="product.packagingName == 'Und.' && product.quantity == 1">
                     {{ product.unitsOfMeasurementName }}
                   </span>
                   <span v-else>
                     {{ product.packagingName }} {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                   </span>
                 </span>
               </span>
             </div>

             <div class="col-12">
               <div class="flex-fill" v-if="product.packagingName && product.quantity && pricePerBaseUnitWithDiscount(expedition, biggestRange(expedition), false)">
                 <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
                  {{ pricePerBaseUnitWithDiscount(expedition, biggestRange(expedition), false).substring(3)}}
                 </i>
                 <span v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                   <i style="color: #5f6666;" > p/ kg</i>
                 </span>
                 <span v-else>
                   <span v-if="product.packagingName != 'Und.'" >
                     <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</i>
                     <i style="color: #5f6666;" v-else> p/ und</i>
                   </span>
                 </span>

               </div>
               <!-- <div class="flex-fill" v-else>
                 <div v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                   <i style="color: #5f6666;" > {{ formatPrice(expedition.price).substring(3) }} p/ kg</i>
                 </div>
                 <div v-else>
                   <div v-if="product.packagingName != 'Und.'" >
                     <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(expedition.price).substring(3) }} p/ L</i>
                     <i style="color: #5f6666;" v-else> p/ und</i>
                   </div>
                 </div>
               </div> -->
             </div>
           </div>
         </div>
       </div>
     </router-link>
   </div>
   <div class="col-12 p-0 pt-0 mt-0 pb-1" vs-type="flex" vs-justify="center" vs-align="center" v-if="!samplePage">
     <div
       v-for="expedition in getLowestPrice(expeditions)"
       :key="'addbtn' + expedition.id"
       vs-type="flex" vs-justify="center" vs-align="center"
     >
       <div style="margin-top: 3px;" v-if="!expedition.unavailability">
         <div class="w-100 pl-1 pr-1 mt-0" vs-type="flex" vs-justify="center" vs-align="center">
           <span v-if="hasExpAdded">
             <button style="width: 100%; padding-left: 5px; padding-right: 5px;" type="button" @click="checkOpenAdd($event)" class="btn btn-outline-primary">
               Adicionado
             </button>
           </span>
           <span v-else>
             <vs-button style="width: 100%" type="line" @click="checkOpenAdd($event)">Adicionar</vs-button>
           </span>
         </div>
       </div>
     </div>
   </div>

    <product-info-modal :openPopup="openPopup" :product="product" />
    <vs-popup class="store" title="Adicionar ao pedido" :active.sync="openAdd" v-if="expeditions && expeditions.length">
      <div class="p-1">
        <h6>
          <span v-if="product.categoryCollection"><i>{{ product.categoryCollection }}</i> | </span>
          <span>
            {{ product.categoryName }}
          </span>
        </h6>
        <h5 style="margin-bottom: 10px;">
          <span>
            {{ product.productTypeName }}
          </span>
        </h5>
        <div class="row m-0">
          <div class="col-5 pt-1">
            <img v-if="product.picture" class="rounded img-fluid" :src="product.picture" alt style="width: 100%; height: auto;" />
            <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: 100%; height: auto;" />
            <div class="badge badge-pill badge-md bg-mf-laranja" style="position: absolute; bottom: 5px; left: 10px;">
              <b>{{ quantifiers(true) == 'Und. 1 und' ? 'Und' :  quantifiers(true) }}</b>
            </div>
          </div>
          <div class="col-7 p-0 pb-1 pt-1">
            <div class="row m-0">
              <div class="col-12 p-0 pb-1 font-small-3">
                <p class="m-0" style="color: #333;">
                  {{ productBrandName }}<span v-if="productBrandName && product.productLineName">,</span>
                  {{ product.productLineName }}<span v-if="product.productLineName && product.productLineExtensionName">,</span>
                  {{ product.productLineExtensionName }}
                </p>
                <p class="m-0 font-weight-bold text-success"><b>{{ product.propertyName }}</b></p>
              </div>
              <div class="col-12 p-0 pb-1 font-small-3">
                <v-new-secondary-characteristics :product="product" />
              </div>
            </div>
          </div>
        </div>
        <vs-divider />
        <div class="row m-0" style="overflow-x: hidden;" v-for="expedition in expeditions" :key="'popup' + expedition.id">
          <div v-if="expedition.discountPercentage1 || expedition.discountPercentage2" class="col-12 pt-1 pb-1 pr-1 h-100 pl-0 pr-0">
            <b-list-group horizontal>
              <b-list-group-item :style="isMobile ? 'padding: 5px;': ''" :active="activeDiscount == 0">
                <a href="javascript:void(0)" @click="updateInputQuantity(expedition, 1, 0)">
                  <div class="col-12">
                    <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                      a granel
                    </span>
                    <span style="color: black;" v-else>
                      <b><span class="font-small-1">R$ </span><span class="font-medium-1">{{ formatPrice(calculatePrice(expedition, product)).substring(3) }}</span></b>
                    </span>
                  </div>

                  <div class="col-12" v-if="product.packagingName || product.quantity">
                    <span class="text-warning font-small-3">
                      <span v-if="product.packagingName == 'Und.' && product.quantity == 1">
                        {{ product.unitsOfMeasurementName }}
                      </span>
                      <span v-else>
                        {{ product.packagingName }} {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                      </span>
                    </span>
                  </div>

                  <div class="col-12" v-if="product.packagingName && product.quantity && pricePerBaseUnit(expedition, false)">
                    <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
                      <span class="font-small-3">
                        {{ pricePerBaseUnit(expedition, false).substring(3)}}
                      </span>
                    </i>
                    <span v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                      <i style="color: #5f6666;" class="font-small-3"> p/ kg</i>
                    </span>
                    <span v-else>
                      <span v-if="product.packagingName != 'Und.'" >
                        <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</i>
                        <i style="color: #5f6666;" v-else> p/ und</i>
                      </span>
                    </span>

                  </div>
                  <div class="col-12" v-else>
                    <div v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                      <i style="color: #5f6666;" class="font-small-3"> {{ formatPrice(expedition.price).substring(3) }} p/ kg</i>
                    </div>
                    <div v-else>
                      <div v-if="product.packagingName != 'Und.'" >
                        <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(expedition.price).substring(3) }} p/ L</i>
                        <i style="color: #5f6666;" v-else> p/ und</i>
                      </div>
                    </div>
                  </div>
                </a>
              </b-list-group-item>
              <b-list-group-item :style="isMobile ? 'padding: 5px;': ''" :active="activeDiscount == 1" v-if="expedition.discountPercentage1">
                <a href="javascript:void(0)" @click="updateInputQuantity(expedition, expedition.discountRange1, 1)">
                  <div class="col-12">
                    <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                      a granel
                    </span>
                    <span style="color: black;" v-else>
                      <b>
                        <span class="font-small-1">R$ </span><span class="font-medium-1">
                          {{ formatPrice(calculatedPriceWithDiscount(expedition, expedition.discountRange1, expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing)) / expedition.discountRange1).substring(3) }}
                          <!-- {{ formatPrice(calculatePrice(expedition, product)).substring(3) }} -->
                        </span>
                      </b>
                    </span>
                  </div>

                  <div class="col-12" v-if="product.packagingName || product.quantity">
                    <span class="text-warning font-small-3">
                      <span v-if="product.packagingName == 'Und.' && product.quantity == 1">
                        {{ product.unitsOfMeasurementName }}
                      </span>
                      <span v-else>
                        {{ product.packagingName }} {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                      </span>
                    </span>
                  </div>

                  <div class="col-12" v-if="product.packagingName && product.quantity && pricePerBaseUnitWithDiscount(expedition, expedition.discountRange1, false)">
                    <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
                      <span class="font-small-3">
                        {{ pricePerBaseUnitWithDiscount(expedition, expedition.discountRange1, false).substring(3) }}
                      </span>
                    </i>
                    <span v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                      <i style="color: #5f6666;" class="font-small-3"> p/ kg</i>
                    </span>
                    <span v-else>
                      <span v-if="product.packagingName != 'Und.'" >
                        <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</i>
                        <i style="color: #5f6666;" v-else> p/ und</i>
                      </span>
                    </span>

                  </div>
                  <div class="col-12" v-else>
                    <div v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                      <i style="color: #5f6666;" class="font-small-3"> {{ formatPrice(calculatedPriceWithDiscount(expedition, expedition.discountRange1, expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing)) / expedition.discountRange1).substring(3) }} p/ kg</i>
                    </div>
                    <div v-else>
                      <div v-if="product.packagingName != 'Und.'" >
                        <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(calculatedPriceWithDiscount(expedition, expedition.discountRange1, expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing)) / expedition.discountRange1).substring(3) }} p/ L</i>
                        <i style="color: #5f6666;" v-else> p/ und</i>
                      </div>
                    </div>
                  </div>
                  <div class="col-12" style="margin-top: 5px;">
                    <span class="font-small-2" style="color: #EA5455 !important;">Desconto</span><br>
                    <span class="badge badge-pill badge-danger font-small-2 font-weight-bold" v-if="expedition.discountPercentage1" :style="activeDiscount == 1 ? '' : 'background-color: white !important; color: #EA5455 !important; border: 1px solid #EA5455;'">
                      {{ String(expedition.discountPercentage1).replace('.', ',') }}% p/ {{ expedition.discountRange1 }}
                      <span v-if="expedition.productExpeditionMediumName">{{ expedition.productExpeditionMediumName.substring(0, 2) }}</span>
                    </span>
                  </div>
                </a>
              </b-list-group-item>
              <b-list-group-item :style="isMobile ? 'padding: 5px;': ''" :active="activeDiscount == 2" v-if="expedition.discountPercentage2">
                <a href="javascript:void(0)" @click="updateInputQuantity(expedition, expedition.discountRange2, 2)">
                  <div class="col-12">
                    <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                      a granel
                    </span>
                    <span style="color: black;" v-else>
                      <b>
                        <span class="font-small-1">R$ </span><span class="font-medium-1">
                          {{ formatPrice(calculatedPriceWithDiscount(expedition, expedition.discountRange2, expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing)) / expedition.discountRange2).substring(3) }}
                          <!-- {{ formatPrice(calculatePrice(expedition, product)).substring(3) }} -->
                        </span>
                      </b>
                    </span>
                  </div>

                  <div class="col-12" v-if="product.packagingName || product.quantity">
                    <span class="text-warning font-small-3">
                      <span v-if="product.packagingName == 'Und.' && product.quantity == 1">
                        {{ product.unitsOfMeasurementName }}
                      </span>
                      <span v-else>
                        {{ product.packagingName }} {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                      </span>
                    </span>
                  </div>

                  <div class="col-12" v-if="product.packagingName && product.quantity && pricePerBaseUnitWithDiscount(expedition, expedition.discountRange2, false)">
                    <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
                      <span class="font-small-3">
                        {{ pricePerBaseUnitWithDiscount(expedition, expedition.discountRange2, false).substring(3) }}
                      </span>
                    </i>
                    <span v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                      <i style="color: #5f6666;" class="font-small-3"> p/ kg</i>
                    </span>
                    <span v-else>
                      <span v-if="product.packagingName != 'Und.'" >
                        <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</i>
                        <i style="color: #5f6666;" v-else> p/ und</i>
                      </span>
                    </span>

                  </div>
                  <div class="col-12" v-else>
                    <div v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                      <i style="color: #5f6666;" class="font-small-3"> {{ formatPrice(calculatedPriceWithDiscount(expedition, expedition.discountRange2, expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing)) / expedition.discountRange2).substring(3) }} p/ kg</i>
                    </div>
                    <div v-else>
                      <div v-if="product.packagingName != 'Und.'" >
                        <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(calculatedPriceWithDiscount(expedition, expedition.discountRange2, expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing)) / expedition.discountRange2).substring(3) }} p/ L</i>
                        <i style="color: #5f6666;" v-else> p/ und</i>
                      </div>
                    </div>
                  </div>
                  <div class="col-12" style="margin-top: 5px;">
                    <span class="font-small-2" style="color: #EA5455 !important;">Desconto</span><br>
                    <span class="badge badge-pill badge-danger font-small-2 font-weight-bold" v-if="expedition.discountPercentage2" :style="activeDiscount == 2 ? '' : 'background-color: white !important; color: #EA5455 !important; border: 1px solid #EA5455;'">
                      {{ String(expedition.discountPercentage2).replace('.', ',') }}% p/ {{ expedition.discountRange2 }}
                      <span v-if="expedition.productExpeditionMediumName">{{ expedition.productExpeditionMediumName.substring(0, 2) }}</span>
                    </span>
                  </div>
                </a>
              </b-list-group-item>
            </b-list-group>
          </div>
          <div v-else :class="isMobile ? 'col-5 pt-1 pb-1 h-100 mr-1' : 'col-3 pt-1 pb-1 h-100 mr-1'" style="border: 1px solid LightGrey; border-radius: 10px;">
            <div class="row" v-if="expedition.unavailability">
              <p class="ml-1" style="width: 100%; color: #d11b6d;">
                Indisponível
              </p>
            </div>
            <div v-else class="row" style="justify-content: space-between;">
              <!-- <div class="col-12" v-if="expedition.sale" style="margin-bottom: 5px;">
                <span class="badge badge-pill badge-danger">
                  <span class="font-medium-1"> Oferta</span>
                </span>
              </div> -->
              <div class="col-12">
                <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                  a granel
                </span>
                <span v-else>
                  <b><span class="font-small-1">R$ </span><span class="font-medium-1">{{ formatPrice(calculatePrice(expedition, product)).substring(3) }}</span></b>
                </span>
              </div>

              <div class="col-12" v-if="product.packagingName || product.quantity">
                <span class="text-warning font-small-3">
                  <span v-if="product.packagingName == 'Und.' && product.quantity == 1">
                    {{ product.unitsOfMeasurementName }}
                  </span>
                  <span v-else>
                    {{ product.packagingName }} {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                  </span>
                </span>
              </div>

              <div class="col-12" v-if="product.packagingName && product.quantity && pricePerBaseUnit(expedition, false)">
                <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
                  {{ pricePerBaseUnit(expedition, false).substring(3)}}
                </i>
                <span v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                  <i style="color: #5f6666;" > p/ kg</i>
                </span>
                <span v-else>
                  <span v-if="product.packagingName != 'Und.'" >
                    <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</i>
                    <i style="color: #5f6666;" v-else> p/ und</i>
                  </span>
                </span>

              </div>
              <div class="col-12" v-else>
                <div v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                  <i style="color: #5f6666;" > {{ formatPrice(expedition.price).substring(3) }} p/ kg</i>
                </div>
                <div v-else>
                  <div v-if="product.packagingName != 'Und.'" >
                    <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(expedition.price).substring(3) }} p/ L</i>
                    <i style="color: #5f6666;" v-else> p/ und</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div :class="isMobile ? 'col-5 p-0' : 'col-6 p-0'">
            <div class="row pl-1 pb-1" v-if="!expedition.unavailability" style="margin-left: 0; border: 1px solid LightGrey; border-radius: 10px;">
              <div class="col-12 p-0 pt-1" vs-type="flex" vs-justify="center" vs-align="center">
                {{ expText(expedition, product) }}
              </div>
              <div class="col-12 p-0" vs-type="flex" vs-justify="center" vs-align="center">
                <div class="input-group input-group-sm float-none" style="width: auto; margin-left: 8px;">
                  <div class="controls" v-tooltip.top.hover="{ content: tooltipText(expedition), visible: isDisabled(expedition, expedition.id) }">
                    <NumberInputSpinner
                      :min="0"
                      :max="999999"
                      :inputClass="quantityClass(expedition.id)"
                      :buttonClass="'spin-button btn-primary button-blue'"
                      :integerOnly="isInteger(expedition)"
                      :forceBreakLine="true"
                      maxlength="4"
                      data-vv-name="quantity"
                      data-validation-containsnumber-regex="([^0-9]*[0-9]+)+"
                      v-model="priceInput[expedition.id]"
                      ref="inputNumber"
                      :key="inputKey"
                      @input="emitPrice(expedition, priceInput[expedition.id], expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing), expedition.minimumOrder)"
                      @on-enter="onEnter"
                    />
                  </div>
                  <span
                    v-if="calculatedPrice(expedition.id, formatQuantity(priceInput[expedition.id]), expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing)) > 0"
                    class="d-flex"
                    style="min-height: 24px; padding-left: 1rem;"
                  >
                    <div v-if="validDiscountById(expedition.id)[0] && !validDiscountById(expedition.id)[1]" class="w-100" style="color: #111 !important; font-size: 14px;">
                      <span class="font-weight-bold">
                        <span class="font-small-1">R$ </span>{{ formatPrice(calculatedPriceWithDiscount(expedition, formatQuantity(priceInput[expedition.id]), expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing))).substring(3) }}
                      </span>
                    </div>
                    <div v-if="validDiscountById(expedition.id)[1] && !validDiscountById(expedition.id)[0]" class="w-100" style="color: #111 !important; font-size: 14px;">
                      <span class="font-weight-bold">
                        <span class="font-small-1">R$ </span>{{ formatPrice(calculatedPriceWithDiscount(expedition, formatQuantity(priceInput[expedition.id]), expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing))).substring(3) }}
                      </span>
                    </div>

                    <span v-if="validDiscountById(expedition.id)[0] || validDiscountById(expedition.id)[1]" class="outer">
                      <span class="inner" style="width: 100px;">
                        {{ formatPrice(calculatedPrice(expedition.id, formatQuantity(priceInput[expedition.id]), expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing))).substring(3) }}
                      </span>
                    </span>
                    <span v-else class="font-weight-bold font-medium-1" style="margin-top: 2px;">
                      <span>
                        <span class="font-small-1">R$ </span>
                        {{ formatPrice(calculatedPrice(expedition.id, formatQuantity(priceInput[expedition.id]), expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing))).substring(3) }}
                      </span>
                    </span>
                  </span>
                </div>
              </div>
              <!-- <div class="col-12 pl-0 pr-0 pb-0" style="padding-top: 8px;">

              </div> -->
              <!-- <div class="col-12 pl-0 pr-0 pb-0">
                <div class="p-0" style="">
                  <div v-if="expedition.productExpeditionQuantity && expedition.productExpeditionQuantity > 1">
                    <span class="position-relative" style="">
                      <span class="font-small-1">R$ </span>{{ formatPrice(expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing)).substring(3) }}
                    </span>
                    <br>
                    <span class="position-relative badge badge-pill" style="font-size: 90%; background-color: #e7e9ec; color: #3d3d3d;">
                      {{ expedition.productExpeditionMediumName }} {{ expedition.productExpeditionQuantity }}
                      {{ product.packagingName }}
                    </span>
                  </div>
                </div>
              </div> -->
              <!-- <div class="col-12 pl-0 pr-0 pb-0">
                <div class="p-0" style="text-align: center;">
                  <div v-if="expedition.discountPercentage1" class="font-small-2 font-weight-bold" style="color: #EA5455 !important;">
                    {{ String(expedition.discountPercentage1).replace('.', ',') }}% p/ {{ expedition.discountRange1 }}
                    <span v-if="expedition.productExpeditionMediumName">{{ expedition.productExpeditionMediumName.substring(0, 2) }}</span>
                  </div>
                  <div v-if="expedition.discountPercentage2" class="font-small-2 font-weight-bold" style="color: #EA5455 !important;">
                    {{ String(expedition.discountPercentage2).replace('.', ',') }}% p/ {{ expedition.discountRange2 }}
                    <span v-if="expedition.productExpeditionMediumName">{{ expedition.productExpeditionMediumName.substring(0, 2) }}</span>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
          <vs-divider />
        </div>

        <div class="row m-0 pb-1 d-flex justify-content-between">
          <vs-button class="ml-1" @click="openAdd = false" color="#636363" type="flat">Cancelar</vs-button>
          <vs-button v-if="hasExpAdded" class="" @click="removeFromCart()" color="#636363" type="flat">
            Zerar qtd
          </vs-button>
          <vs-button v-if="!isMobile" class="mr-2 pr-4 pl-4 pt-1 pb-1" @click="addToCart()" color="primary" type="filled" :disabled="canAdd">
           <span class="font-medium-1 font-weight-bold">Adicionar</span>
          </vs-button>
          <vs-button v-else class="mr-2" @click="addToCart()" color="primary" type="filled" :disabled="canAdd">
           <span class="font-small-3 font-weight-bold">Adicionar</span>
          </vs-button>
        </div>
      </div>
    </vs-popup>

    <different-cart-modal
      :openPopup="differentCartPopup"
      :automatic="true"
      @clear-cart-and-add="clearCartAndAdd"
      @update-modal="updateDifferentCartPopup"
    />
  </div>


</template>

<style>
 .vs-popup {
   width: 500px !important;
 }
 .list-group-item.active {
  border-color: LimeGreen;
  background-color: white;
 }
 .list-group-item.active:hover {
  background-color: #fcfffa !important;
 }
 .button-blue {
   background-color: #27b6f6 !important;
   border-color: #27b6f6 !important;
 }
 .spin-button {
   width: 20px;
   height: 25px;
   float: left;
   border-radius: 5px !important;
 }
 .spin-input {
   width: 40px;
   float: left;
   padding: 2px 3px 2px 5px;
   font-size: 1em;
   border: 0;
   text-align: center;
 }
  span.inner {
    color: black;
    font-size: 12px;
  }
  span.outer {
    color: red;
    text-decoration: line-through;
    margin-left: 5px;
  }
</style>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import priceFormatter from "@/mixins/priceFormatter";
import productUrlIdentifier from "@/mixins/productUrlIdentifier";
import ProductInfoModal from "@/components/products/ProductInfoModal";
import ProductPhotoModal from "@/components/products/ProductPhotoModal";
import cardTitle from "@/mixins/cardTitle";
import VPopoverProductCard from "@/components/products/VPopoverProductCard";
import VClamp from "vue-clamp";
import NumberInputSpinner from '@/components/inputSpinner/NumberInputSpinner';
import VNewSecondaryCharacteristics from "@/components/products/VNewSecondaryCharacteristics";
import DifferentCartModal from "@/components/users/DifferentCartModal";
import Vue from 'vue';

export default {
  name: "PublicStoreProductCard",
  data() {
    return {
      showMinAlert: [],
      priceInput: [],
      totals: [],
      openPopup: false,
      openPhoto: false,
      discountValid: [],
      openAdd: false,
      noImageSrc: require(`@/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`),
      tempCart: [],
      inputKey: 0,
      activeDiscount: 0,
      differentCartPopup: false,
    }
  },
  created() {

      // if(this.prices[i].quantity) {
      //   this.priceInput[this.prices[i].id] = String(this.prices[i].quantity).replace('.', ',')
      //   this.checkDiscounts(this.prices[i], this.prices[i].quantity, this.expeditionPrice(this.calculatePrice(this.prices[i].expedition, this.product), this.prices[i].supplierProductExpedition.productExpeditionQuantity, this.prices[i].supplierProductExpedition.productExpeditionPricing))
      // }
      // if(this.loadedTotals) {
      //   let found = this.loadedTotals.find(obj => obj.id == this.prices[i].id)
      //   if(found) {
      //     this.priceInput[this.prices[i].id] = String(found.quantity).replace('.', ',')
      //     this.checkDiscounts(this.prices[i], found.quantity, this.expeditionPrice(this.calculatePrice(this.prices[i].expedition, this.product), this.prices[i].supplierProductExpedition.productExpeditionQuantity, this.prices[i].supplierProductExpedition.productExpeditionPricing))
      //   }
      // }
  },
  mounted() {
    for(var i = 0; i < this.expeditions.length; i++) {
      this.discountValid.push({ id: this.expeditions[i].id, values: [false, false] })
      if(this.storeProducts) {
        var found = this.storeProducts.find(obj => this.expeditions[i].id == obj.id)
        if(found) {
          this.priceInput[this.expeditions[i].id] = String(found.quantity).replace('.', ',')
          this.checkDiscounts(this.expeditions[i], found.quantity, this.expeditions[i].price, true)
        }
      }
    }
    this.$nextTick(function () {
      this.$emit('all-mounted')
    })
  },
  updated() {
    this.$refs.inputNumber[0].focusInput()
  },
  computed: {
    ...mapState("users/products", ["storeProducts", "storeTotal", "storeCartSupplier"]),
    ...mapState("suppliers", [
      "supplier",
    ]),
    ...mapGetters("navigationFilters", ["params", "allowEntrance"]),
    ...mapGetters("users/products", ["storeCartSupplierId"]),
    canAdd() {
      for(var i = 0; i < this.expeditions.length; i++) {
        if(this.priceInput[this.expeditions[i].id] && this.priceInput[this.expeditions[i].id] > 0)
          return false
      }
      return true
    },
    hasExpAdded() {
      if(this.expeditions) {
        for(var i = 0; i < this.expeditions.length; i++) {
          if(this.storeProducts && this.storeProducts.find(obj => this.expeditions[i].id == obj.id))
            return true
        }
      }
      return false
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true
      } else {
        return false
      }
    },
    // productIdentifier() {
    //   var text = ''
    //   // text += this.formatString(this.product.familyName) + '-'
    //   if(this.product.categoryCollection)
    //     text += this.formatString(this.product.categoryCollection) + '-'
    //   // text += this.formatString(this.product.categoryName) + '-'
    //   // text += this.formatString(this.product.productTypeName) + '-'
    //   if(this.product.brandName)
    //     text += this.formatString(this.product.brandName) + '-'
    //   if(this.product.propertyName)
    //     text += this.formatString(this.product.propertyName) + '-'
    //   if(this.product.productLineName)
    //     text += this.formatString(this.product.productLineName) + '-'
    //   if(this.product.productLineExtensionName)
    //     text += this.formatString(this.product.productLineExtensionName) + '-'
    //   if(this.product.packagingName)
    //     text += this.formatString(this.product.packagingName) + '-'
    //   if(this.product.quantity)
    //     text += this.formatString(this.product.quantity) + '-'
    //   if(this.product.unitsOfMeasurementName)
    //     text += this.formatString(this.product.unitsOfMeasurementName) + '-'
    //   if(this.product.secondaryCharacteristics && this.product.secondaryCharacteristics.length) {
    //     for(var i = 0; i < this.product.secondaryCharacteristics.length; i++) {
    //       text += this.formatString(this.product.secondaryCharacteristics[i]) + '-'
    //     }
    //   }
    //   return text + this.product.id
    // }
  },
  watch: {
    totals() {
      this.$emit('quantity-input', this.totals)
    }
  },
  methods: {
    ...mapActions("navigationFilters", [
      "setCep",
      "setCity",
      "setRegion",
      "setAllowed",
      "setSupplierServes",
      "clearCity",
      "clearFilterParams",
    ]),
    expText(expedition, product) {
      var text = ''
      if(!product.packagingName && !product.quantity) {
        text = product.unitsOfMeasurementName
      } else {
        if(expedition.productExpeditionQuantity && expedition.productExpeditionQuantity > 1) {
          if(expedition.productExpeditionMediumName)
            text = text + expedition.productExpeditionMediumName
          if(expedition.productExpeditionQuantity)
            text = text + ' ' + expedition.productExpeditionQuantity
        }

        if(product.packagingName) {
          text = text + ' ' + product.packagingName
        }
        if(product.quantity && product.packagingName != 'Und.') {
          text = text + ' ' + product.quantity + ' ' + product.unitsOfMeasurementName
        }
      }
      return text
    },
    updateDifferentCartPopup(value) {
      this.differentCartPopup = value;
    },
    validDiscountById(id) {
      var found = null
      if(this.discountValid && this.discountValid.length)
        found = this.discountValid.find(obj => obj.id == id)
      if(found)
        return found.values
      else
        return []
    },
    quantityClass(id) {
      if(this.showMinAlert[id])
        return 'spin-input is-invalid'
      else
        return 'spin-input'
    },
    tooltipText(exp) {
      if(this.product.packagingName)
        return `Qtd mínima: ${exp.minimumOrder}`
      else
        return `Qtd mínima: ${exp.minimumOrder} ${this.product.unitsOfMeasurementName}`
    },
    isDisabled(exp, id) {
      if(exp.minimumOrder && (parseFloat(this.priceInput[id]) < parseFloat(exp.minimumOrder) || !parseFloat(this.priceInput[id]))) {
        return true
      } else {
        return false
      }
    },
    expeditionPrice(price, quantity, type = null) {
      if(quantity)
        return (price * quantity)
      else
        return price
    },
    calculatedPrice(id, quantity, price) {
      let result = quantity * price
      if(!isNaN(result)) {
        return result
      }
      else
        return 0
    },
    calculatedPriceWithDiscount(priceObj, quantity, price) {
      let result = this.checkDiscounts(priceObj, quantity, price, false)
      if(!isNaN(result)) {
        return result
      }
      else
        return 0
    },
    emitPrice(priceObj, quantity, price, minimum) {
      var formattedQuantity = this.formatQuantity(quantity)
      if(minimum && quantity != '' && formattedQuantity < minimum)
        this.showMinAlert[priceObj.id] = true
      else
        this.showMinAlert[priceObj.id] = false

      quantity = this.verifyAllowed(priceObj.id, quantity)
      let calcQuantity = this.formatQuantity(quantity)
      let result = this.checkDiscounts(priceObj, calcQuantity, price)

      let exists = null
      if(this.tempCart && this.tempCart.length)
        exists = this.tempCart.find(exp => exp.id == priceObj.id)
      if(exists) {
        exists.quantity = calcQuantity
        exists.total = result
      } else {
        let obj = { id: priceObj.id, quantity: calcQuantity, total: result, minimum: minimum }
        this.tempCart.push(obj)
      }
      //this.$emit('quantity-input', obj)
    },
    getLowestPrice(expeditions) {
      let lowest = expeditions[0]
      let aux = 0
      for(let i = 0; i < expeditions.length; i++) {
        aux = this.lowestWithDiscounts(expeditions[i])
        if(!lowest || aux < lowest)
          lowest = aux
      }
      return [lowest]
    },
    lowestWithDiscounts(expedition) {
      var range1 = expedition.discountRange1
      var range2 = expedition.discountRange2
      var discount1 = expedition.discountPercentage1
      var discount2 = expedition.discountPercentage2

      var price = this.calculatePrice(expedition, this.product)

      var total = 0

      if(!range1 && !range2) {
        total = price
      } else if(range1 && !range2) {
        total = price * ((100 - discount1) * 0.01)
      } else if(range2 >= range1) {
        total = price * ((100 - discount2) * 0.01)
      } else if(range1 > range2) {
        total = price * ((100 - discount1) * 0.01)
      }

      return total
    },
    checkDiscounts(priceObj, calcQuantity, price, checkArray = true) {
      var range1 = priceObj.discountRange1
      var range2 = priceObj.discountRange2
      var discount1 = priceObj.discountPercentage1
      var discount2 = priceObj.discountPercentage2

      var total = 0

      var discountData = null
      if(this.discountValid && this.discountValid.length)
        discountData = this.discountValid.find(obj => obj.id == priceObj.id)

      if(!range1 && !range2) {
        total = calcQuantity * price
        if(checkArray && discountData) {
          discountData.values = [false, false]
          this.activeDiscount = 0
        }
      } else if(range1 && !range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
        if(checkArray && discountData) {
          discountData.values = [true, false]
          this.activeDiscount = 1
        }
      } else if(range1 && !range2 && calcQuantity < range1) {
        total = calcQuantity * price
        if(checkArray && discountData) {
          discountData.values = [false, false]
          this.activeDiscount = 0
        }
      } else if(range2 >= range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
        if(checkArray && discountData) {
          discountData.values = [false, true]
          this.activeDiscount = 2
        }
      } else if(range1 > range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
        if(checkArray && discountData) {
          discountData.values = [true, false]
          this.activeDiscount = 1
        }
      } else if(calcQuantity < range1 && calcQuantity < range2) {
        total = calcQuantity * price
        if(checkArray && discountData) {
          discountData.values = [false, false]
          this.activeDiscount = 0
        }
      } else if(range2 >= range1 && calcQuantity < range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
        if(checkArray && discountData) {
          discountData.values = [true, false]
          this.activeDiscount = 1
        }
      } else if(range1 > range2 && calcQuantity < range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
        if(checkArray && discountData) {
          discountData.values = [false, true]
          this.activeDiscount = 2
        }
      }

      return total
    },
    calculatePrice(priceObj, product) {
      var price = priceObj.price
      if(priceObj && priceObj.productExpeditionPricing) {
        if(priceObj.productExpeditionPricing == 1) {
          price = parseFloat(priceObj.price) * parseFloat(this.product.quantity.replace(',', '.'))
          if(product.packageQuantity)
             price = price * parseFloat(this.product.packageQuantity)
        } else if(priceObj.productExpeditionPricing == 2) {
          price = priceObj.price
        } else if(priceObj.productExpeditionPricing == 3) {
          price = parseFloat(priceObj.price) / parseFloat(priceObj.productExpeditionQuantity)
          // if(this.product.packageQuantity)
          //   price = price / parseFloat(this.product.packageQuantity)
        }
      }
      return price
    },
    formatQuantity(quantity) {
      if(quantity && String(quantity).includes(','))
        quantity = String(quantity).replace(',', '.')
      return quantity
    },
    verifyAllowed(id, quantity) {
      var regex = null
      if(this.product.packagingName) {
        regex = /^[0-9]+$/
      } else {
        regex = /^(\d+)(.\d{0,2})?$/
      }
      if(!regex.test(quantity)) {
        this.priceInput[id] = quantity.slice(0, -1)
      }
      return this.priceInput[id]
    },
    openInfoPopup() {
      this.openPopup = !this.openPopup
    },
    updateModal(value) {
      this.openPhoto = value
    },
    openPhotoModal() {
      this.openPhoto = true
    },
    pricePerBaseUnit(priceObj, withUnit = true) {
      var price = 0

      if(priceObj && priceObj.productExpeditionPricing) {
        if(priceObj.productExpeditionPricing == 1)
          price = this.product.unitsOfMeasurementEquivalence * parseFloat(priceObj.price)
        else if(priceObj.productExpeditionPricing == 2) {
          price = (this.product.unitsOfMeasurementEquivalence / parseFloat(this.product.quantity.replace(',', '.'))) * parseFloat(priceObj.price)
          // if(this.product.packageQuantity)
          //   price = price / parseFloat(this.product.packageQuantity)
        } else if(priceObj.productExpeditionPricing == 3) {
          price = (this.product.unitsOfMeasurementEquivalence / (parseFloat(this.product.quantity.replace(',', '.')) * parseFloat(priceObj.productExpeditionQuantity))) * parseFloat(priceObj.price)
          // if(this.product.packageQuantity)
          //   price = price / parseFloat(this.product.packageQuantity)
        }
      }

      var text = this.formatPrice(price)
      if(withUnit) {
        switch(this.product.unitsOfMeasurementMeasureType) {
          case 'solid':
            text = this.formatPrice(price) + ' p/ kg'
            break;
          case 'liquid':
            text = this.formatPrice(price) + ' p/ L'
            break;
        }
      }
      return text
    },
    pricePerBaseUnitWithDiscount(priceObj, range, withUnit = true) {
      var price = 0

      if(priceObj && priceObj.productExpeditionPricing && (priceObj.discountRange1 || priceObj.discountRange2)) {
        if(priceObj.productExpeditionPricing == 1)
          price = this.product.unitsOfMeasurementEquivalence * this.calculatedPriceWithDiscount(priceObj, range, this.expeditionPrice(this.calculatePrice(priceObj, this.product), priceObj.productExpeditionQuantity, priceObj.productExpeditionPricing)) / range
        else if(priceObj.productExpeditionPricing == 2) {
          price = (this.product.unitsOfMeasurementEquivalence / parseFloat(this.product.quantity.replace(',', '.'))) * this.calculatedPriceWithDiscount(priceObj, range, this.expeditionPrice(this.calculatePrice(priceObj, this.product), priceObj.productExpeditionQuantity, priceObj.productExpeditionPricing)) / range
        } else if(priceObj.productExpeditionPricing == 3) {
          price = (this.product.unitsOfMeasurementEquivalence / (parseFloat(this.product.quantity.replace(',', '.')) * parseFloat(priceObj.productExpeditionQuantity))) * this.calculatedPriceWithDiscount(priceObj, range, this.expeditionPrice(this.calculatePrice(priceObj, this.product), priceObj.productExpeditionQuantity, priceObj.productExpeditionPricing)) / range
        }
      } else if(!priceObj.discountRange1 && !priceObj.discountRange2) {
        return this.pricePerBaseUnit(priceObj, withUnit)
      }

      var text = this.formatPrice(price)
      if(withUnit) {
        switch(this.product.unitsOfMeasurementMeasureType) {
          case 'solid':
            text = this.formatPrice(price) + ' p/ kg'
            break;
          case 'liquid':
            text = this.formatPrice(price) + ' p/ L'
            break;
        }
      }
      return text
    },
    textPerExpedition(price) {
      var pricePerUnit = this.formatPrice(this.calculatePrice(price, this.product)) + ' p/ '
      if(!this.product.packagingName && !this.product.quantity)
        pricePerUnit = pricePerUnit.concat(' ' + this.product.unitsOfMeasurementName)
      else
        pricePerUnit = pricePerUnit.concat(this.product.packagingName + ' ' + this.product.quantity + this.product.unitsOfMeasurementName)
      if(parseInt(this.product.packageQuantity) > 1)
        pricePerUnit = pricePerUnit.concat(' x' + this.product.packageQuantity)

      var text = pricePerUnit + '                                      ' + this.pricePerBaseUnit(price, true)

      return text
    },
    isInteger(expedition) {
      if(expedition.productExpeditionQuantity)
        return true
      else
        return false
    },
    checkOpenAdd(ev) {
      if(this.storeTotal == 0 || (this.storeCartSupplierId() == this.supplier.id)) {
        if(this.$auth.check() || (this.allowEntrance && this.allowEntrance != 'false'))
          this.openAdd = true
        else {
          this.openAdd = false
          this.$emit('fill-location', ev.target)
        }
      } else if(this.storeTotal > 0) {
       this.differentCartPopup = true
       this.adding = false
     }
    },
    removeFromCart() {
      for(var i = 0; i < this.expeditions.length; i++) {
        this.$emit('remove-item', this.expeditions[i])
      }
      this.openAdd = false
    },
    addToCart() {
      if(this.storeTotal == 0 || (this.storeCartSupplierId() == this.supplier.id)) {
        for(var i = 0; i < this.tempCart.length; i++) {
          this.$emit('quantity-input', this.tempCart[i])
        }
        this.openAdd = false
      } else if(this.storeTotal > 0) {
       this.differentCartPopup = true
       this.adding = false
     }
    },
    clearCartAndAdd() {
      this.tempCart = []
      this.$emit('clear-cart')
      setTimeout(() => {
        this.openAdd = true
      }, 300)
    },
    // lowestPrice(expeditions) {
    //   var lowest = expeditions[0]
    //   if(expeditions.length > 1) {
    //     for(var i = 0; i < expeditions.length; i++) {
    //       if((expeditions[i].price < lowest.price) && !expeditions[i].unavailability)
    //         lowest = expeditions[i]
    //       else if(lowest.unavailability)
    //         lowest = expeditions[i]
    //     }
    //   }
    //   return [lowest]
    // },
    updateInputQuantity(expedition, range, discountIndex) {
      Vue.set(this.priceInput, expedition.id, String(range))
      this.emitPrice(expedition, this.priceInput[expedition.id], this.expeditionPrice(this.calculatePrice(expedition, this.product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing), expedition.minimumOrder)
      this.inputKey++
      this.activeDiscount = discountIndex
    },
    biggestRange(expedition) {
      if(expedition.discountRange1 && expedition.discountRange2)
        return Math.max(expedition.discountRange1, expedition.discountRange2)
      else if(expedition.discountRange1 && !expedition.discountRange2)
        return expedition.discountRange1
      else if(!expedition.discountRange1 && expedition.discountRange2)
        return expedition.discountRange2
      else
        return 0
    },
    hasDiscount(expedition) {
      var range1 = expedition.discountRange1
      var range2 = expedition.discountRange2
      var discount1 = expedition.discountPercentage1
      var discount2 = expedition.discountPercentage2

      return range1 || range2
    },
    onEnter() {
      if(!this.canAdd)
        this.addToCart()
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
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    expeditions: {
      type: Array,
      required: true,
    },
    loadedTotals: {
      type: Array
    },
    blockSaleBadge: {
      type: Boolean
    },
    samplePage: {
      type: Boolean
    }
  },
  components: {
    ProductInfoModal,
    ProductPhotoModal,
    NumberInputSpinner,
    VNewSecondaryCharacteristics,
    DifferentCartModal
  },
  mixins: [priceFormatter, cardTitle, productUrlIdentifier]
};
</script>
<style>
._horizontal-scroll[data-v-5ce095ec]{box-sizing:border-box;overflow-x:auto;overflow-y:hidden;text-align:left;white-space:nowrap}

.vs-tooltip {
  white-space: pre-wrap;
}
</style>

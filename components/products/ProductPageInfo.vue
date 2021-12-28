<template>
<div>
  <store-location-modal
    :openPopup="openFillRegion"
    :supplier="supplier"
    @allow-zipcode="allowZipcode"
    @update-modal="updateLocationModal"
    v-if="supplier"
  />
  <div class="row m-0 pt-1 pb-0 pl-1 pr-1" style="justify-content: center;">
    <div class="col-12" style="max-width: 1366px;">
      <div class="row m-0 p-0" style="justify-content: space-between;">
        <vs-button class="" @click="goToStore()" color="#0391d1" type="flat">
          Ver a loja toda
        </vs-button>
        <vs-button class="" @click.prevent.stop="$refs.menu.open($event)" color="#0391d1" type="flat">
          <i class="fa fa-whatsapp" style="" aria-hidden="true"></i> Compartilhar
        </vs-button>
        <vue-context ref="menu">
          <li>
            <a @click.prevent="shareOnWhatsapp()">
              <i class="fa fa-whatsapp font-medium-2 mr-50"></i> Mandar p/ WhatsApp
            </a>
          </li>
          <li>
            <a @click.prevent="shareCopyLink()">
              <i class="feather icon-link font-medium-2 mr-50"></i> Copiar o link
            </a>
          </li>
        </vue-context>
      </div>
    </div>
  </div>
  <div class="row m-0 p-0 justify-content-center">
    <div class="card mb-1 mr-1 ml-1" style="max-width: 1366px;">
      <div class="card-body">
        <div class="row m-0">
          <div class="col-6 col-lg-2 pt-1 pl-0 m-0">
            <img v-if="product.picture" class="rounded img-fluid" :src="product.picture" alt style="width: 100%; height: auto;" />
            <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: 100%; height: auto;" />
          </div>
          <div class="col-6 col-lg-2 p-0 pb-1 pt-1">
            <div class="row m-0">
              <div class="col-12 p-0">
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
              </div>
              <div class="col-12 p-0 pb-1 font-small-3">
                <p class="m-0" style="color: #333;">
                  {{ productBrandName }}<span v-if="productBrandName && product.productLineName">,</span>
                  {{ product.productLineName }}<span v-if="product.productLineName && product.productLineExtensionName">,</span>
                  {{ product.productLineExtensionName }}
                </p>
                <p class="m-0 font-weight-bold text-success"><b>{{ product.propertyName }}</b></p>
              </div>
              <div class="col-12 p-0 pb-1 font-small-3">
                <div class="badge badge-pill badge-md bg-mf-laranja" style="">
                  <b>{{ quantifiers(true) == 'Und. 1 und' ? 'Und' :  quantifiers(true) }}</b>
                </div>
              </div>
              <div class="col-12 p-0 pb-1 font-small-3">
                <v-new-secondary-characteristics :product="product" />
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-7 p-0 pb-1 pt-1" :style="isMobile ? '' : 'border-left: 1px solid LightGrey;'">
            <div class="row m-0" v-for="(expedition, index) in expeditions" :key="'product' + expedition.id" :style="isMobile ? 'justify-content: center;' : 'padding-left: 15px; justify-content: center;'">
              <vs-divider class="mt-2 mb-2" v-if="index > 0" />
              <div v-if="expedition.discountPercentage1 || expedition.discountPercentage2" :class="isMobile ? 'col-md-auto p-0' : 'col-md-auto pt-0 pb-1 pr-1 pl-0 pr-0'" style="">
                <b-list-group horizontal>
                  <b-list-group-item :style="isMobile ? 'padding: 10px 0px; width: 33%;': 'padding: 10px 2px;'" :active="activeDiscount == 0">
                    <a href="javascript:void(0)" @click="updateInputQuantity(expedition, 1, 0)">
                      <div style="color: #A7A7A7; padding-bottom: 7px;" class="col-12 font-small-1">
                        Preço padrão
                      </div>
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
                  <b-list-group-item :style="isMobile ? 'padding: 10px 0px; width: width: ' + mobileWidth(expedition) : 'padding: 10px 2px;'" :active="activeDiscount == 1" v-if="expedition.discountPercentage1">
                    <a href="javascript:void(0)" @click="updateInputQuantity(expedition, expedition.discountRange1, 1)">
                      <div style="color: #A7A7A7; padding-bottom: 7px;" class="col-12 font-small-1">
                        Preço c/ desc.
                      </div>
                      <div class="col-12">
                        <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                          a granel
                        </span>
                        <span style="color: black;" v-else>
                          <b>
                            <span class="font-small-1">R$ </span><span class="font-medium-1">
                              {{ formatPrice(calculatedPriceWithDiscount(expedition, expedition.discountRange1, expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing)) / expedition.discountRange1).substring(3) }}

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
                      <div class="col-12 m-0">
                        <vs-divider style="margin-top: 12px; margin-bottom: 8px;" />
                      </div>
                      <div class="col-12" style="">
                        <span class="font-small-2" style="color: #EA5455 !important;">Desconto</span><br>
                        <span class="font-small-2 font-weight-bold" v-if="expedition.discountPercentage1" style="color: #EA5455 !important;">
                          {{ String(expedition.discountPercentage1).replace('.', ',') }}% desc.
                        </span><br>
                        <span class="font-small-2 font-weight-bold" v-if="expedition.discountPercentage1" style="color: #EA5455 !important;">
                          a partir de {{ expedition.discountRange1 }}
                          <span v-if="expedition.productExpeditionMediumName">{{ expedition.productExpeditionMediumName.substring(0, 2) }}</span>
                        </span>
                      </div>
                    </a>
                  </b-list-group-item>
                  <b-list-group-item :style="isMobile ? 'padding: 10px 0px; width: ' + mobileWidth(expedition) : 'padding: 10px 2px;'" :active="activeDiscount == 2" v-if="expedition.discountPercentage2">
                    <a href="javascript:void(0)" @click="updateInputQuantity(expedition, expedition.discountRange2, 2)">
                      <div style="color: #A7A7A7; padding-bottom: 7px;" class="col-12 font-small-1">
                        Preço c/ desc.
                      </div>
                      <div class="col-12">
                        <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                          a granel
                        </span>
                        <span style="color: black;" v-else>
                          <b>
                            <span class="font-small-1">R$ </span><span class="font-medium-1">
                              {{ formatPrice(calculatedPriceWithDiscount(expedition, expedition.discountRange2, expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing)) / expedition.discountRange2).substring(3) }}

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
                      <div class="col-12 m-0">
                        <vs-divider style="margin-top: 12px; margin-bottom: 8px;" />
                      </div>
                      <div class="col-12" style="">
                        <span class="font-small-2" style="color: #EA5455 !important;">Desconto</span><br>
                        <span class="font-small-2 font-weight-bold" v-if="expedition.discountPercentage2" style="color: #EA5455 !important;">
                          {{ String(expedition.discountPercentage2).replace('.', ',') }}% desc.
                        </span><br>
                        <span class="font-small-2 font-weight-bold" v-if="expedition.discountPercentage2" style="color: #EA5455 !important;">
                          a partir de {{ expedition.discountRange2 }}
                          <span v-if="expedition.productExpeditionMediumName">{{ expedition.productExpeditionMediumName.substring(0, 2) }}</span>
                        </span>
                      </div>
                    </a>
                  </b-list-group-item>
                </b-list-group>
              </div>
              <div v-else :class="isMobile ? 'col-12 pt-1 pb-1 pl-1 h-100' : 'col-3 pt-1 pb-1 h-100 mr-1'" style="border: 1px solid LightGrey; border-radius: 10px;">
                <div class="row" v-if="expedition.unavailability">
                  <p class="ml-1" style="width: 100%; color: #d11b6d;">
                    Indisponível
                  </p>
                </div>
                <div v-else class="row" style="justify-content: space-between;">
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
              <div :class="isMobile ? 'col-12 p-0 pr-1 pt-1' : 'col-5 p-0'" style="">
                <div class="row pl-0 pb-0" v-if="!expedition.unavailability" style="background-color: #F7F7F7; margin-left: 0; border: 1px solid LightGrey; border-radius: 10px;">
                  <div class="col-12 p-0 pl-1 pt-1" vs-type="flex" vs-justify="center" vs-align="center">
                    <div v-if="textExpOnly(expedition, product)" class="badge badge-pill badge-md" style="margin-right: 3px; background-color: white; color: grey; border: 1px solid grey;">
                      {{ textExpOnly(expedition, product) }}
                    </div>
                    <div class="badge badge-pill badge-md bg-mf-laranja" style="">
                      {{ textDisplayOnly(expedition, product) }}
                    </div>
                  </div>
                  <div class="col-8 pl-1 pr-0 pb-0" vs-type="flex" vs-justify="center" vs-align="center" style="padding-top: 7px;">
                    <div class="input-group input-group-sm float-none" style="width: auto; margin-left: 12px;">
                      <span ref="minTooltip" v-tooltip.top.hover="{ content: tooltipText(expedition), visible: isDisabled(expedition, expedition.id) }">
                        <div class="controls">
                          <NumberInputSpinner
                            :min="0"
                            :max="999999"
                            :inputClass="quantityClass(expedition.id)"
                            :buttonClass="'spin-button-product-page btn-primary button-blue'"
                            :integerOnly="isInteger(expedition)"
                            :forceBreakLine="true"
                            maxlength="4"
                            data-vv-name="quantity"
                            data-validation-containsnumber-regex="([^0-9]*[0-9]+)+"
                            v-model="priceInput[expedition.id]"
                            ref="inputNumber"
                            :key="inputKey"
                            @input="emitPrice(expedition,
                                              priceInput[expedition.id],
                                              expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing),
                                              expedition.minimumOrder)"
                          />
                        </div>
                      </span>
                    </div>
                  </div>
                  <div class="col-4 pl-0 pr-0 pb-0" vs-type="flex" vs-justify="center" vs-align="center" style="padding-top: 7px;">

                  </div>
                  <div class="col-12 pl-1 pr-0 pb-0" vs-type="flex" vs-justify="center" vs-align="center" style="padding-top: 3px;">
                    <span
                      v-if="calculatedPrice(expedition.id, formatQuantity(priceInput[expedition.id]), expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing)) > 0"
                      class="d-flex"
                      style="min-height: 24px;"
                    >
                      <div v-if="validDiscountById(expedition.id)[0] && !validDiscountById(expedition.id)[1]" class="" style="color: #111 !important; font-size: 14px;">
                        <span class="font-weight-bold font-medium-3">
                          <span class="font-small-1">R$ </span>{{ formatPrice(calculatedPriceWithDiscount(expedition, formatQuantity(priceInput[expedition.id]), expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing))).substring(3) }}
                        </span>
                      </div>
                      <div v-if="validDiscountById(expedition.id)[1] && !validDiscountById(expedition.id)[0]" class="" style="color: #111 !important; font-size: 14px;">
                        <span class="font-weight-bold font-medium-3">
                          <span class="font-small-1">R$ </span>{{ formatPrice(calculatedPriceWithDiscount(expedition, formatQuantity(priceInput[expedition.id]), expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing))).substring(3) }}
                        </span>
                      </div>

                      <span v-if="validDiscountById(expedition.id)[0] || validDiscountById(expedition.id)[1]" class="outer">
                        <span class="inner" style="width: 100px;">
                          {{ formatPrice(calculatedPrice(expedition.id, formatQuantity(priceInput[expedition.id]), expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing))).substring(3) }}
                        </span>
                      </span>
                      <span v-else class="font-weight-bold font-medium-3" style="margin-top: 2px;">
                        <span>
                          <span class="font-small-1">R$ </span>
                          {{ formatPrice(calculatedPrice(expedition.id, formatQuantity(priceInput[expedition.id]), expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing))).substring(3) }}
                        </span>
                      </span>
                    </span>
                  </div>
                  <div class="col-12 mt-1 pl-1 pr-0 pb-1" vs-type="flex" vs-justify="center" vs-align="center" style="padding-top: 7px; background-color: white; border-bottom: 1px solid LightGrey; border-radius: 10px;">
                    <button class="mr-2 btn btn-primary px-1 text-bold-600 waves-effect waves-light w-50" @click="addToCart(expedition)" type="filled" :disabled="canAdd">
                      <span class="font-small-3 font-weight-bold">Adicionar</span>
                    </button>
                    <!-- <vs-button v-if="hasExpAdded" class="" @click="removeFromCart()" color="#636363" type="flat">
                      Zerar
                    </vs-button> -->
                    <vs-button class="" @click="removeFromCart(expedition)" color="#636363" type="flat">
                      Zerar
                    </vs-button>
                  </div>
                </div>
              </div>

          </div>
        </div>
      </div>

      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-auto hide-scroll" style="overflow-x: scroll; border-right: 1px solid LightGrey;" v-if="sampleProducts && sampleProducts.length">
      <div class="row pr-1 pl-2 pt-2 pb-0">
        <h4>Mais produtos como este</h4>
      </div>
      <div
        class="row pl-2 hide-scroll"
        v-if="sampleProducts"
        :style="isMobile ? 'display: flex; padding-top: 10px; width: ' + calcWidth(sampleProducts.slice(0, 6).length) + 'px;' : 'display: flex; padding-top: 10px; flex-wrap: nowrap !important;'"
      >
        <span
          v-for="sample in sampleProducts.slice(0, 6)"
          :key="'sample-product' + sample.id"
          style="width: 170px;"
          :id="'scrollTo' + sample.productTypeId + '-' + sample.id + 'sample'"
        >
          <div style="padding-left: 5px;">
            <h6 style="margin-bottom: 10px;">
              <a
                @click="clickedProductTitle(sample)"
                style="text-decoration: underline;"
              >{{ sample.productTypeName }}</a>
            </h6>
          </div>
          <div
            class="card font-small-3"
            style="margin-right: 7px; margin-left: 3px;"
          >
            <div class="card-body pl-1 pr-1 pt-0 pb-0">
              <PublicStoreProductCard
                :product="sample"
                :expeditions="sample.supplierProductExpeditions"
                :loadedTotals="totals"
                :samplePage="false"
                @quantity-input="checkTotalsExternal"
                @remove-item="removeFromCartExternal"
                @fill-location="openFillRegion"
                @clear-cart="clearCartExternal"
              />
            </div>
          </div>
        </span>
        <div
          class="card font-small-3"
          v-if="sampleProducts && sampleProducts.length >= 6"
          style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
        >
          <div class="card-body p-1">
            <div class="row">
              <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
              <div class="col-12 mt-1">
                <button
                  @click="goToProductTypePage()"
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
    <div class="col-md-auto" v-if="typesAvailable && typesAvailable.length > 1">
      <div class="row pr-1 pl-2 pt-2 pb-0">
        <h4>Outros nesta categoria</h4>
      </div>
      <div
        class="row pl-2"
        v-if="typesAvailable"
        :style="isMobile ? 'padding-top: 10px;' : 'padding-top: 10px; max-width: ' + maxSuggestedWidth() + 'px;'"
      >
        <div class="card">
          <div class="card-body">
            <span
              v-for="type in typesAvailable"
              :key="type.value"
              style="margin-right: 10px;"
            >
              <vs-chip
                class="chip-mf-local public-chip p-0 pr-1"
                style="border: 1px solid rgb(92, 233, 198); margin-right: 10px;"
              >
                <nuxt-link
                  :to="{ name: 'public-store-product',
                         params: {
                           supplierSlug: $route.params.supplierSlug,
                           familyName: formatString(product.familyName),
                           categoryName: formatString(product.categoryName),
                           productTypeName: formatString(type.text) } }"
                   style="color: black;"
                >
                  {{ type.text }}
                </nuxt-link>
              </vs-chip>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-auto" v-if="!sampleProducts || !sampleProducts.length || !typesAvailable || typesAvailable.length == 1">
      <div class="row pr-1 pl-3 pt-2 pb-0">
        <button @click="goToStore()" style="" type="button" class="btn btn-outline-primary">
          Ver a loja toda
        </button>
      </div>
    </div>
  </div>

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
 .spin-button-product-page {
   width: 40px;
   height: 45px;
   float: left;
   border-radius: 5px !important;
 }
 .spin-input-product-page {
   width: 78px !important;
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
    margin-left: 10px;
    margin-top: -3px;
  }
  .hide-scroll {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
    cursor: grab;
  }
  .hide-scroll::-webkit-scrollbar {
    /* WebKit */
    width: 0;
    height: 0;
  }
</style>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import priceFormatter from "@/mixins/priceFormatter";
import cardTitle from "@/mixins/cardTitle";
import NumberInputSpinner from '@/components/inputSpinner/NumberInputSpinner';
import PublicStoreProductCard from "@/components/products/PublicStoreProductCard";
import VNewSecondaryCharacteristics from "@/components/products/VNewSecondaryCharacteristics";
import DifferentCartModal from "@/components/users/DifferentCartModal";
import StoreLocationModal from "@/components/users/StoreLocationModal";
import Vue from 'vue';

export default {
  name: "ProductPageInfo",
  data() {
    return {
      showMinAlert: [],
      priceInput: [],
      totals: [],
      discountValid: [],
      open: false,
      noImageSrc: require(`@/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`),
      tempCart: [],
      inputKey: 0,
      activeDiscount: 0,
      hasBelowMin: false,
      differentCartPopup: false,
      lastTotals: null,
      slug: null,
      openFillRegion: false,
      shareLink: null,
    }
  },
  created() {
    this.totals = JSON.parse(JSON.stringify(this.storeProducts))
    this.slug = this.$route.params.supplierSlug
    this.shareLink = window.location.origin + this.$route.fullPath
    for(var i = 0; i < this.expeditions.length; i++) {
      this.discountValid.push({ id: this.expeditions[i].id, values: [false, false] })
      var found = this.storeProducts.find(obj => this.expeditions[i].id == obj.id)
      if(found) {
        this.priceInput[this.expeditions[i].id] = String(found.quantity).replace('.', ',')
        this.checkDiscounts(this.expeditions[i], found.quantity, this.expeditions[i].price, true)
      }
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.$emit('all-mounted')
    })
  },
  updated() {
  },
  computed: {
    ...mapState("users/products", ["storeTotal", "storeProducts"]),
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
      for(var i = 0; i < this.expeditions.length; i++) {
        if(this.storeProducts.find(obj => this.expeditions[i].id == obj.id))
          return true
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
  },
  watch: {
    // totals() {
    //   this.$emit('quantity-input', this.totals)
    // },
    open(newVal) {
      this.$emit('update-modal', newVal)
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
    ...mapActions("suppliers", [
      "clearExpeditionsBySupplier",
      "clearSupplierProducts",
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
    textDisplayOnly(expedition, product) {
      var text = ''
      if(!product.packagingName && !product.quantity) {
        text = product.unitsOfMeasurementName
      } else {
        if(product.packagingName) {
          text = text + ' ' + product.packagingName
        }
        if(product.quantity && product.packagingName != 'Und.') {
          text = text + ' ' + product.quantity + ' ' + product.unitsOfMeasurementName
        }
      }
      return text
    },
    textExpOnly(expedition, product) {
      var text = ''
      if(expedition.productExpeditionQuantity && expedition.productExpeditionQuantity > 1) {
        if(expedition.productExpeditionMediumName)
          text = text + expedition.productExpeditionMediumName
        if(expedition.productExpeditionQuantity)
          text = text + ' ' + expedition.productExpeditionQuantity
      }

      return text
    },
    validDiscountById(id) {
      var found = this.discountValid.find(obj => obj.id == id)
      if(found)
        return found.values
      else
        return []
    },
    quantityClass(id) {
      if(this.showMinAlert[id])
        return 'spin-input-product-page is-invalid'
      else
        return 'spin-input-product-page'
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

      let exists = this.tempCart.find(exp => exp.id == priceObj.id)
      if(exists) {
        exists.quantity = calcQuantity
        exists.total = result
      } else {
        let obj = { id: priceObj.id, quantity: calcQuantity, total: result, minimum: minimum }
        this.tempCart.push(obj)
      }
      //this.$emit('quantity-input', obj)
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

      var discountData = this.discountValid.find(obj => obj.id == priceObj.id)

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
    isInteger(expedition) {
      if(expedition.productExpeditionQuantity)
        return true
      else
        return false
    },
    addToCart(priceObj) {
      let obj = this.tempCart.find(exp => exp.id == priceObj.id)
      if(this.$auth.loggedIn || (this.allowEntrance && this.allowEntrance != 'false')) {
        this.checkTotals(obj)
      } else {
        this.lastTotals = obj
        this.openFillRegion = true
        setTimeout(() => {
          document.getElementById("cepInput").focus();
        }, 500);
      }
    },
    updateInputQuantity(expedition, range, discountIndex) {
      Vue.set(this.priceInput, expedition.id, String(range))
      this.emitPrice(expedition, this.priceInput[expedition.id], this.expeditionPrice(this.calculatePrice(expedition, this.product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing), expedition.minimumOrder)
      this.inputKey++
      this.activeDiscount = discountIndex
    },
    clickedProductTitle(product) {
      this.$router.push({ name: 'public-store-product',
                          params: {
                            supplierSlug: this.slug,
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
      } else {
        this.lastTotals = totals
        this.differentCartPopup = true
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
      this.priceInput[exp.id] = ''
      this.inputKey++
      this.emitPrice(exp,
                     this.priceInput[exp.id],
                     this.expeditionPrice(this.calculatePrice(exp, this.product), exp.productExpeditionQuantity, exp.productExpeditionPricing),
                     exp.minimumOrder)
      this.totals = this.totals.filter((obj) => obj.id != exp.id)
      this.removeFromStoreProducts(exp)
      this.loadStoreTotal()
      this.updateTotal()
    },
    checkTotalsExternal(totals) {
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
    clearCartExternal() {
      this.clearExpeditionsBySupplier()
      this.clearSupplierProducts()
      this.clearStoreProducts()
      this.totals = []
      this.setStoreTotal(0)
      this.setStoreCartSupplier(null)
      this.updateTotal()
    },
    removeFromCartExternal(exp) {
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
    updateDifferentCartPopup(value) {
      this.differentCartPopup = value;
    },
    clearCartAndAdd() {
      this.tempCart = []
      this.clearCart()
      setTimeout(() => {
        this.checkTotals(this.lastTotals)
      }, 300)
    },
    goToStore() {
      this.$router.push({ name: 'public-store', params: { supplierSlug: this.slug } })
    },
    mobileWidth(exp) {
      if(exp.discountPercentage2)
        return '33%;'
      else if(exp.discountPercentage1 && !exp.discountPercentage2)
        return '50%;'
      else if(!exp.discountPercentage1 && !exp.discountPercentage2)
        return '100%;'
    },
    allowZipcode(value) {
      // this.allowAccess = value
      if (value == true) {
        setTimeout(() => {
          this.checkTotals(this.lastTotals)
        }, 300)
      }
    },
    updateLocationModal(val) {
      this.openFillRegion = val;
    },
    shareOnWhatsapp() {
      var url = "https://api.whatsapp.com/send?text=" +
                'Veja+esse+produto+da+' +
                 this.supplier.user.name.replace("&", "e")+
                '+na+plataforma+Meu+Fornecedor%0A' +
                this.shareLink
      window.open(url, '_blank')
    },
    shareCopyLink() {
      this.$copyText(this.shareLink).then(() => {
        this.notifyInfo("Copiado para a área de transferência", "");
      })
    },
    calcWidth(size) {
      var total = size * 178;
      if (size >= 6) total += 160;
      return total;
    },
    maxSuggestedWidth() {
      var total = this.sampleProducts.length
      if(total > 6)
        return 300
      else
        return (10 - total) * 110
    }
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    supplier: {
      type: Object,
      required: true,
    },
    expeditions: {
      type: Array,
      required: true,
    },
    sampleProducts: {
      type: Array,
      required: true,
    },
    typesAvailable: {
      type: Array,
      required: true,
    },
    loadedTotals: {
      type: Array
    },
  },
  components: {
    NumberInputSpinner,
    VNewSecondaryCharacteristics,
    PublicStoreProductCard,
    DifferentCartModal,
    StoreLocationModal,
  },
  mixins: [priceFormatter, cardTitle]
};
</script>
<style>
._horizontal-scroll[data-v-5ce095ec]{box-sizing:border-box;overflow-x:auto;overflow-y:hidden;text-align:left;white-space:nowrap}

.vs-tooltip {
  white-space: pre-wrap;
}
</style>

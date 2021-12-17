<template>

  <div>
    <vs-popup class="store" title="Adicionar ao pedido" :active.sync="open" v-if="expeditions && expeditions.length">
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
      <div class="row m-0" style="overflow-x: hidden;" v-for="expedition in expeditions" :key="'popup' + expedition.supplierProductExpedition.id">
        <div v-if="expedition.supplierProductExpedition.discountPercentage1 || expedition.supplierProductExpedition.discountPercentage2" class="col-12 pt-1 pb-1 pr-1 h-100 pl-0 pr-0">
          <b-list-group horizontal>
            <b-list-group-item :style="isMobile ? 'padding: 5px;': ''" :active="activeDiscount == 0">
              <a href="javascript:void(0)" @click="updateInputQuantity(expedition.supplierProductExpedition, 1, 0)">
                <div class="col-12">
                  <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                    a granel
                  </span>
                  <span style="color: black;" v-else>
                    <b><span class="font-small-1">R$ </span><span class="font-medium-1">{{ formatPrice(calculatePrice(expedition.supplierProductExpedition, product)).substring(3) }}</span></b>
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

                <div class="col-12" v-if="product.packagingName && product.quantity && pricePerBaseUnit(expedition.supplierProductExpedition, false)">
                  <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
                    <span class="font-small-3">
                      {{ pricePerBaseUnit(expedition.supplierProductExpedition, false).substring(3)}}
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
                    <i style="color: #5f6666;" class="font-small-3"> {{ formatPrice(expedition.supplierProductExpedition.price).substring(3) }} p/ kg</i>
                  </div>
                  <div v-else>
                    <div v-if="product.packagingName != 'Und.'" >
                      <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(expedition.supplierProductExpedition.price).substring(3) }} p/ L</i>
                      <i style="color: #5f6666;" v-else> p/ und</i>
                    </div>
                  </div>
                </div>
              </a>
            </b-list-group-item>
            <b-list-group-item :style="isMobile ? 'padding: 5px;': ''" :active="activeDiscount == 1" v-if="expedition.supplierProductExpedition.discountPercentage1">
              <a href="javascript:void(0)" @click="updateInputQuantity(expedition.supplierProductExpedition, expedition.supplierProductExpedition.discountRange1, 1)">
                <div class="col-12">
                  <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                    a granel
                  </span>
                  <span style="color: black;" v-else>
                    <b>
                      <span class="font-small-1">R$ </span><span class="font-medium-1">
                        {{ formatPrice(calculatedPriceWithDiscount(expedition.supplierProductExpedition, expedition.supplierProductExpedition.discountRange1, expeditionPrice(calculatePrice(expedition.supplierProductExpedition, product), expedition.supplierProductExpedition.productExpeditionQuantity, expedition.supplierProductExpedition.productExpeditionPricing)) / expedition.supplierProductExpedition.discountRange1).substring(3) }}
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

                <div class="col-12" v-if="product.packagingName && product.quantity && pricePerBaseUnitWithDiscount(expedition.supplierProductExpedition, expedition.supplierProductExpedition.discountRange1, false)">
                  <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
                    <span class="font-small-3">
                      {{ pricePerBaseUnitWithDiscount(expedition.supplierProductExpedition, expedition.supplierProductExpedition.discountRange1, false).substring(3) }}
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
                    <i style="color: #5f6666;" class="font-small-3"> {{ formatPrice(calculatedPriceWithDiscount(expedition.supplierProductExpedition, expedition.supplierProductExpedition.discountRange1, expeditionPrice(calculatePrice(expedition.supplierProductExpedition, product), expedition.supplierProductExpedition.productExpeditionQuantity, expedition.supplierProductExpedition.productExpeditionPricing)) / expedition.supplierProductExpedition.discountRange1).substring(3) }} p/ kg</i>
                  </div>
                  <div v-else>
                    <div v-if="product.packagingName != 'Und.'" >
                      <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(calculatedPriceWithDiscount(expedition.supplierProductExpedition, expedition.supplierProductExpedition.discountRange1, expeditionPrice(calculatePrice(expedition.supplierProductExpedition, product), expedition.supplierProductExpedition.productExpeditionQuantity, expedition.supplierProductExpedition.productExpeditionPricing)) / expedition.supplierProductExpedition.discountRange1).substring(3) }} p/ L</i>
                      <i style="color: #5f6666;" v-else> p/ und</i>
                    </div>
                  </div>
                </div>
                <div class="col-12" style="margin-top: 5px;">
                  <span class="font-small-2" style="color: #EA5455 !important;">Desconto</span><br>
                  <span class="badge badge-pill badge-danger font-small-2 font-weight-bold" v-if="expedition.supplierProductExpedition.discountPercentage1" :style="activeDiscount == 1 ? '' : 'background-color: white !important; color: #EA5455 !important; border: 1px solid #EA5455;'">
                    {{ String(expedition.supplierProductExpedition.discountPercentage1).replace('.', ',') }}% p/ {{ expedition.supplierProductExpedition.discountRange1 }}
                    <span v-if="expedition.supplierProductExpedition.productExpeditionMediumName">{{ expedition.supplierProductExpedition.productExpeditionMediumName.substring(0, 2) }}</span>
                  </span>
                </div>
              </a>
            </b-list-group-item>
            <b-list-group-item :style="isMobile ? 'padding: 5px;': ''" :active="activeDiscount == 2" v-if="expedition.supplierProductExpedition.discountPercentage2">
              <a href="javascript:void(0)" @click="updateInputQuantity(expedition.supplierProductExpedition, expedition.supplierProductExpedition.discountRange2, 2)">
                <div class="col-12">
                  <span class="text-warning" v-if="!product.packagingName && !product.quantity">
                    a granel
                  </span>
                  <span style="color: black;" v-else>
                    <b>
                      <span class="font-small-1">R$ </span><span class="font-medium-1">
                        {{ formatPrice(calculatedPriceWithDiscount(expedition.supplierProductExpedition, expedition.supplierProductExpedition.discountRange2, expeditionPrice(calculatePrice(expedition.supplierProductExpedition, product), expedition.supplierProductExpedition.productExpeditionQuantity, expedition.supplierProductExpedition.productExpeditionPricing)) / expedition.supplierProductExpedition.discountRange2).substring(3) }}
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

                <div class="col-12" v-if="product.packagingName && product.quantity && pricePerBaseUnitWithDiscount(expedition.supplierProductExpedition, expedition.supplierProductExpedition.discountRange2, false)">
                  <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
                    <span class="font-small-3">
                      {{ pricePerBaseUnitWithDiscount(expedition.supplierProductExpedition, expedition.supplierProductExpedition.discountRange2, false).substring(3) }}
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
                    <i style="color: #5f6666;" class="font-small-3"> {{ formatPrice(calculatedPriceWithDiscount(expedition.supplierProductExpedition, expedition.supplierProductExpedition.discountRange2, expeditionPrice(calculatePrice(expedition.supplierProductExpedition, product), expedition.supplierProductExpedition.productExpeditionQuantity, expedition.supplierProductExpedition.productExpeditionPricing)) / expedition.supplierProductExpedition.discountRange2).substring(3) }} p/ kg</i>
                  </div>
                  <div v-else>
                    <div v-if="product.packagingName != 'Und.'" >
                      <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(calculatedPriceWithDiscount(expedition.supplierProductExpedition, expedition.supplierProductExpedition.discountRange2, expeditionPrice(calculatePrice(expedition.supplierProductExpedition, product), expedition.supplierProductExpedition.productExpeditionQuantity, expedition.supplierProductExpedition.productExpeditionPricing)) / expedition.supplierProductExpedition.discountRange2).substring(3) }} p/ L</i>
                      <i style="color: #5f6666;" v-else> p/ und</i>
                    </div>
                  </div>
                </div>
                <div class="col-12" style="margin-top: 5px;">
                  <span class="font-small-2" style="color: #EA5455 !important;">Desconto</span><br>
                  <span class="badge badge-pill badge-danger font-small-2 font-weight-bold" v-if="expedition.supplierProductExpedition.discountPercentage2" :style="activeDiscount == 2 ? '' : 'background-color: white !important; color: #EA5455 !important; border: 1px solid #EA5455;'">
                    {{ String(expedition.supplierProductExpedition.discountPercentage2).replace('.', ',') }}% p/ {{ expedition.supplierProductExpedition.discountRange2 }}
                    <span v-if="expedition.supplierProductExpedition.productExpeditionMediumName">{{ expedition.supplierProductExpedition.productExpeditionMediumName.substring(0, 2) }}</span>
                  </span>
                </div>
              </a>
            </b-list-group-item>
          </b-list-group>
        </div>
        <div v-else :class="isMobile ? 'col-5 pt-1 pb-1 h-100 mr-1' : 'col-3 pt-1 pb-1 h-100 mr-1'" style="border: 1px solid LightGrey; border-radius: 10px;">
          <div class="row" v-if="expedition.supplierProductExpedition.unavailability">
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
                <b><span class="font-small-1">R$ </span><span class="font-medium-1">{{ formatPrice(calculatePrice(expedition.supplierProductExpedition, product)).substring(3) }}</span></b>
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

            <div class="col-12" v-if="product.packagingName && product.quantity && pricePerBaseUnit(expedition.supplierProductExpedition, false)">
              <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
                {{ pricePerBaseUnit(expedition.supplierProductExpedition, false).substring(3)}}
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
                <i style="color: #5f6666;" > {{ formatPrice(expedition.supplierProductExpedition.price).substring(3) }} p/ kg</i>
              </div>
              <div v-else>
                <div v-if="product.packagingName != 'Und.'" >
                  <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> {{ formatPrice(expedition.supplierProductExpedition.price).substring(3) }} p/ L</i>
                  <i style="color: #5f6666;" v-else> p/ und</i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div :class="isMobile ? 'col-5 p-0' : 'col-6 p-0'">
          <div class="row pl-1 pb-1" v-if="!expedition.supplierProductExpedition.unavailability" style="margin-left: 0; border: 1px solid LightGrey; border-radius: 10px;">
            <div class="col-12 p-0 pt-1" vs-type="flex" vs-justify="center" vs-align="center">
              {{ expText(expedition.supplierProductExpedition, product) }}
            </div>
            <div class="col-12 p-0" vs-type="flex" vs-justify="center" vs-align="center">
              <div class="input-group input-group-sm float-none" style="width: auto; margin-left: 8px;">
                <vs-tooltip ref="minTooltip" :text="tooltipText(expedition.supplierProductExpedition)" :active="isDisabled(expedition.supplierProductExpedition, expedition.supplierProductExpedition.id)" position="top">
                  <div class="controls">
                    <NumberInputSpinner
                      :min="0"
                      :max="999999"
                      :inputClass="quantityClass(expedition.supplierProductExpedition.id)"
                      :buttonClass="'spin-button btn-primary button-blue'"
                      :integerOnly="isInteger(expedition.supplierProductExpedition)"
                      :forceBreakLine="true"
                      maxlength="4"
                      data-vv-name="quantity"
                      data-validation-containsnumber-regex="([^0-9]*[0-9]+)+"
                      v-model="priceInput[expedition.supplierProductExpedition.id]"
                      ref="inputNumber"
                      :key="inputKey"
                      @input="emitPrice(expedition.supplierProductExpedition,
                                        priceInput[expedition.supplierProductExpedition.id],
                                        expeditionPrice(calculatePrice(expedition.supplierProductExpedition, product), expedition.supplierProductExpedition.productExpeditionQuantity, expedition.supplierProductExpedition.productExpeditionPricing),
                                        expedition.supplierProductExpedition.minimumOrder)"
                    />
                  </div>
                  <span>&nbsp;</span>
                </vs-tooltip>
                <span
                  v-if="calculatedPrice(expedition.supplierProductExpedition.id, formatQuantity(priceInput[expedition.supplierProductExpedition.id]), expeditionPrice(calculatePrice(expedition, product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing)) > 0"
                  class="d-flex"
                  style="min-height: 24px; padding-left: 1rem;"
                >
                  <div v-if="validDiscountById(expedition.supplierProductExpedition.id)[0] && !validDiscountById(expedition.supplierProductExpedition.id)[1]" class="w-100" style="color: #111 !important; font-size: 14px;">
                    <span class="font-weight-bold">
                      <span class="font-small-1">R$ </span>{{ formatPrice(calculatedPriceWithDiscount(expedition.supplierProductExpedition, formatQuantity(priceInput[expedition.supplierProductExpedition.id]), expeditionPrice(calculatePrice(expedition.supplierProductExpedition, product), expedition.supplierProductExpedition.productExpeditionQuantity, expedition.supplierProductExpedition.productExpeditionPricing))).substring(3) }}
                    </span>
                  </div>
                  <div v-if="validDiscountById(expedition.supplierProductExpedition.id)[1] && !validDiscountById(expedition.supplierProductExpedition.id)[0]" class="w-100" style="color: #111 !important; font-size: 14px;">
                    <span class="font-weight-bold">
                      <span class="font-small-1">R$ </span>{{ formatPrice(calculatedPriceWithDiscount(expedition.supplierProductExpedition, formatQuantity(priceInput[expedition.supplierProductExpedition.id]), expeditionPrice(calculatePrice(expedition.supplierProductExpedition, product), expedition.supplierProductExpedition.productExpeditionQuantity, expedition.supplierProductExpedition.productExpeditionPricing))).substring(3) }}
                    </span>
                  </div>

                  <span v-if="validDiscountById(expedition.supplierProductExpedition.id)[0] || validDiscountById(expedition.supplierProductExpedition.id)[1]" class="outer">
                    <span class="inner" style="width: 100px;">
                      {{ formatPrice(calculatedPrice(expedition.supplierProductExpedition.id, formatQuantity(priceInput[expedition.supplierProductExpedition.id]), expeditionPrice(calculatePrice(expedition.supplierProductExpedition, product), expedition.supplierProductExpedition.productExpeditionQuantity, expedition.supplierProductExpedition.productExpeditionPricing))).substring(3) }}
                    </span>
                  </span>
                  <span v-else class="font-weight-bold font-medium-1" style="margin-top: 2px;">
                    <span>
                      <span class="font-small-1">R$ </span>
                      {{ formatPrice(calculatedPrice(expedition.supplierProductExpedition.id, formatQuantity(priceInput[expedition.supplierProductExpedition.id]), expeditionPrice(calculatePrice(expedition.supplierProductExpedition, product), expedition.supplierProductExpedition.productExpeditionQuantity, expedition.supplierProductExpedition.productExpeditionPricing))).substring(3) }}
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
        <vs-button class="ml-1" @click="open = false" color="#636363" type="flat">Cancelar</vs-button>
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
    </vs-popup>

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
import cardTitle from "@/mixins/cardTitle";
import NumberInputSpinner from '@/components/inputSpinner/NumberInputSpinner';
import VNewSecondaryCharacteristics from "@/components/products/VNewSecondaryCharacteristics";
import Vue from 'vue';

export default {
  name: "PublicStoreProductModal",
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
    }
  },
  created() {
    this.totals = JSON.parse(JSON.stringify(this.loadedTotals))
    for(var i = 0; i < this.expeditions.length; i++) {
      this.discountValid.push({ id: this.expeditions[i].supplierProductExpedition.id, values: [false, false] })
      var found = this.storeProducts.find(obj => this.expeditions[i].supplierProductExpedition.id == obj.id)
      if(found) {
        this.priceInput[this.expeditions[i].supplierProductExpedition.id] = String(found.quantity).replace('.', ',')
        this.checkDiscounts(this.expeditions[i].supplierProductExpedition, found.quantity, this.expeditions[i].supplierProductExpedition.price, true)
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
    canAdd() {
      for(var i = 0; i < this.expeditions.length; i++) {
        if(this.priceInput[this.expeditions[i].supplierProductExpedition.id] && this.priceInput[this.expeditions[i].supplierProductExpedition.id] > 0)
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
    openPopup() {
      this.open = this.openPopup
    },
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
    validDiscountById(id) {
      var found = this.discountValid.find(obj => obj.id == id)
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
    removeFromCart() {
      for(var i = 0; i < this.expeditions.length; i++) {
        this.$emit('remove-item', this.expeditions[i])
      }
      this.open = false
    },
    addToCart() {
      for(var i = 0; i < this.tempCart.length; i++) {
        this.$emit('quantity-input', this.tempCart[i])
      }
      this.open = false
    },
    updateInputQuantity(expedition, range, discountIndex) {
      Vue.set(this.priceInput, expedition.id, String(range))
      this.emitPrice(expedition, this.priceInput[expedition.id], this.expeditionPrice(this.calculatePrice(expedition, this.product), expedition.productExpeditionQuantity, expedition.productExpeditionPricing), expedition.minimumOrder)
      this.inputKey++
      this.activeDiscount = discountIndex
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
    openPopup: {
      type: Boolean,
      required: true,
    }
  },
  components: {
    NumberInputSpinner,
    VNewSecondaryCharacteristics
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

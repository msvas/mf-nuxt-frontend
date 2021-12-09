<template>
  <div class="row" :style="$device.isMobile ? 'margin:5px;' : 'margin: 15px;' ">
    <router-link style="color: black" :to="{ name: 'public-store', params: { supplierSlug: supplier.nameForUrl }}">
      <div
        class="card m-2"
        style="
          width: 300px;
          height: 115px;
          justify-content: center;
          margin: 0 !important;
        "
      >
        <div class="row" style="flex-wrap: nowrap; align-items: center; padding: 15px;     width: inherit;">
          <img
            class="p-1"
            v-if="supplier.user.userPicture"
            :src="supplier.user.userPicture.picture"
            style="width: 100px; height: 100px"
          />

          <img
            v-else
            class="p-1"
            :src="noImageSrc"
            style="width: 100px; height: 100px"
          />

          <div
            style="display: flex; flex-direction: column; margin: 0; padding: 0; width: inherit; justify-content: space-between; "
          >
            <div style="display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-content: center;">
              <span class="card-title" style="font-size: 1.2rem; margin-bottom: 0">
              {{ supplier.user.name }}
            </span>
            <span style="font-size: 0.8rem">Min. R$ {{ supplier.minimumOrderValue.slice(0, -2) }}</span>
            </div>
            <div style="display: flex; flex-direction: row; justify-content:space-between; align-items: center;">
              <router-link style="text-decoration: underline;" :to="{ name: 'public-store', params: { supplierSlug: supplier.nameForUrl }}">
                Acessar loja
              </router-link>
              <vs-chip v-if="this.offersPerSupplier > 0" style="color: white; background: indianred">{{ this.offersPerSupplier }} Ofertas</vs-chip>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>
<style>
    .rounded-circle{
        margin-right: 5px;
        background: lightgray;
        padding: 4px;
        box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%) !important;
    }
</style>
<script>
import SuppliersService from "@/services/suppliers";

export default {
  name: "SupplierCard",
  data() {
    return {
        catalog: [],
        offersPerSupplier: 0,
        noImageSrc: require(`@/assets/images/avatar-default.png`),
        familyIcon: null,
    };
  },
  mounted() {
    SuppliersService.getOfferProductsBySupplier(this.supplier.id).then((response2) => {
      this.offersPerSupplier = response2.data.length;
    });
    // SuppliersService.getCatalogById(this.supplier.id).then((response) => {
    //     this.catalog = response.data
    // })
  },
  computed: {},
  methods: {

  },
  props: {
    supplier: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template>
<div v-if="supplier">
  <div v-if="supplier && supplier.user.isAutomatic">
    <catalog-store />
  </div>
  <div v-else>
    <manual-store />
  </div>
</div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapActions } from "vuex";
import CatalogStore from "@/components/suppliers/CatalogStore";
import ManualStore from "@/components/suppliers/ManualStore";
import loadCarts from '@/mixins/loadCarts'

export default {
  metaInfo() {
    return {
      title: this.titleContent,
      titleTemplate: "%s",
      meta: [
        { charset: "utf-8" },
        {
          vmid: "description",
          name: "description",
          content: this.descriptionContent,
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
      slug: null,
      titleContent: null,
      descriptionContent: null,
      routeName: '',
    };
  },
  mounted() {
    this.isLoading = true
    this.slug = this.$route.params.supplierSlug

    this.clearCatalog()

    this.getSupplierBySlug(this.slug).then(() => {
      // if(!this.supplier.user.isAutomatic)
      //   this.setManualStore(true)
      // this.isLoading = false
      // this.titleContent =
      //   this.supplier.user.name +
      //   " | Meu Fornecedor";
      // this.descriptionContent =
      //   "Confira todos os produtos da " +
      //   this.supplier.user.name +
      //   ". Emita pedidos online para atender o seu restaurante, padaria, minimercado."
    }).catch(() => {
      this.$router.push({ path: 'erro/404' })
    })
  },

  computed: {
    ...mapState("suppliers", [
      "supplier",
    ]),

  },

  methods: {
    ...mapActions("suppliers", [
      "getSupplierBySlug",
      "setManualStore",
      "clearCatalog"
    ]),

    leaveStore(routeName){
      this.$router.push({name: routeName})
    }

  },
  components: {
    CatalogStore,
    ManualStore,
  },
  mixins: [loadCarts]

}
</script>

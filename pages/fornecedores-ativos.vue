<template>
  <div style="margin-top: 80px; margin-left:20px;">
    <div><h3>Fornecedores Ativos</h3></div>
    <div v-for="supplier in allSuppliers" v-bind:key="supplier.id">
      <vs-list>
        <nuxt-link :to="{ name: 'public-store', params: { supplierSlug: supplier.nameForUrl } }"><vs-list-header :title="supplier.name"></vs-list-header></nuxt-link>
      </vs-list>
    </div>
  </div>
</template>

<script>
import SupplierService from "@/services/suppliers";
export default {
  data() {
    return {
      allSuppliers: [],
    };
  },
  mounted() {
    SupplierService.getAll().then((response) => {
        this.allSuppliers = response.data;
        this.allSuppliers = this.allSuppliers.sort((a, b) => a.nameForUrl.localeCompare(b.nameForUrl));
    });
  },
  computed: {},
  methods: {},
};
</script>

<template>
  <div v-if="loading" id="loading-bg">
    <div class="loading-logo">
      <div style="position: relative; left: -50%;">
        <img src="https://meufornecedor.com.br/logo.png" alt="Logo" />
        <div class="loading">
          <div class="effect-1 effects"></div>
          <div class="effect-2 effects"></div>
          <div class="effect-3 effects"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      loading: false
    }),
    methods: {
      start() {
        this.loading = true
      },
      finish() {
        this.loading = false
      }
    }
  }
</script>

<style scoped>

</style>

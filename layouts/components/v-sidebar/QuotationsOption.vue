<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <nuxt-link :to="{ path: '/minhas-cotacoes' }">
      <span class="menu-title">Cotações realizadas</span>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: "QuotationsOption",
  data() {
    return {
      hover: false
    };
  }
};
</script>

<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <nuxt-link :to="{ path: '/fornecedor/cotacoes' }">
      <span class="menu-title">Cotações / Pedidos</span>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: "OpenQuotations",
  data() {
    return {
      hover: false,
    };
  },
};
</script>

<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <nuxt-link :to="{ path: '/fornecedor/valor-minimo-de-pedido' }">
      <span class="menu-title">Valor mínimo de pedido</span>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: "MinimumOrderValue",
  data() {
    return {
      hover: false,
    };
  },
};
</script>

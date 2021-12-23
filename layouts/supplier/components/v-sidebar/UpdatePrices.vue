<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <nuxt-link :to="{ path: '/fornecedor/precificar' }">
      <span class="menu-title">Atualizar preços</span>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: "UpdatePrices",
  data() {
    return {
      hover: false,
    };
  },
};
</script>

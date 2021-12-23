<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <nuxt-link :to="{ path: '/fornecedor/meu-catalogo' }">
      <span class="menu-title">Meu catálogo</span>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: "MyCatalog",
  data() {
    return {
      hover: false,
    };
  },
};
</script>

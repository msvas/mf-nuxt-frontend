<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <nuxt-link :to="{ path: '/fornecedor/tipos-de-cliente' }">
      <span class="menu-title">Tipo de Cliente</span>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: "ClientType",
  data() {
    return {
      hover: false,
    };
  },
};
</script>

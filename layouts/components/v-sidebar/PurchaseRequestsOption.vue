<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <nuxt-link :to="{ path: '/pedidos-de-compra' }">
      <span class="menu-title">Pedidos de compra</span>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: "PurchaseRequestsOption",
  data() {
    return {
      hover: false
    };
  }
};
</script>

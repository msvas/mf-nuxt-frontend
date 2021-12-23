<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <nuxt-link :to="{ path: '/fornecedor/prazo-de-entrega' }">
      <span class="menu-title">Forma de entrega/atendimento</span>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: "DeliveryConditions",
  data() {
    return {
      hover: false,
    };
  },
};
</script>

<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <nuxt-link :to="{ path: '/fornecedor/area-de-atendimento' }">
      <span class="menu-title">Área de entrega/atendimento</span>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: "DeliveryAreas",
  data() {
    return {
      hover: false,
    };
  },
};
</script>

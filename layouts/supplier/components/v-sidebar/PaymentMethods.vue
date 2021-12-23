<template>
  <li class="nav-item" @mouseover="hover = true" @mouseleave="hover = false" :class="{ hover }">
    <nuxt-link :to="{name: 'payment-methods'}">
      <span class="menu-title">Formas de pagamento</span>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: "PaymentMethods",
  data() {
    return {
      hover: false,
    };
  },
};
</script>

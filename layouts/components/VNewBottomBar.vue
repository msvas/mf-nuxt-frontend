<template>
  <div
    style="position: fixed; background: white;
    bottom: 0; width:100%; display:flex; flex-direction: row; z-index: 999; justify-content: space-around;"
  > 
    <router-link :to="{ name: 'home' }" style="color: black;" :class="this.$route.name == 'home' ||
                                                                      this.$route.name == 'cotar-familia' ||
                                                                      this.$route.name == 'cotar-categoria' ||
                                                                      this.$route.name == 'cotar-produto' ? 
                                                                      'options-container-selected' : 'options-container'"
    >
      <div class="p-1">
        <div style="display: flex; flex-direction: column; place-items: center;">
          <img
            :class="this.$route.name == 'home' ||
                    this.$route.name == 'cotar-familia' ||
                    this.$route.name == 'cotar-categoria' ||
                    this.$route.name == 'cotar-produto' ? 'd-inherit' : 'd-none'"
            src="@/assets/images/delivery-box-selected.png"
            width="20px"
            alt="menu"
          />
          <img
            :class="this.$route.name == 'home' ||
                    this.$route.name == 'cotar-familia' ||
                    this.$route.name == 'cotar-categoria' ||
                    this.$route.name == 'cotar-produto' ? 'd-none' : 'd-inherit'"
            src="@/assets/images/delivery-box.png"
            width="20px"
            alt="menu"
          />
          <span :style="this.$route.name == 'home' ||
                        this.$route.name == 'cotar-familia' ||
                        this.$route.name == 'cotar-categoria' ||
                        this.$route.name == 'cotar-produto' ? 'color: #008567;' : 'color: black;'"
          >Produtos</span>
        </div>
      </div>
    </router-link>

     <router-link style="color: black;" :to="{ name: 'suppliers' }" :class="this.$route.name == 'suppliers' ||
                            this.$route.name == 'suppliers-family' ||
                            this.$route.name == 'suppliers-category' ||
                            this.$route.name == 'suppliers-product' ? 'options-container-selected' : 'options-container'">
      <div class="p-1">
        <div style="display: flex; flex-direction: column; place-items: center;">
          <img
            src="@/assets/images/shop-selected.png"
            :class="this.$route.name == 'suppliers' ||
                    this.$route.name == 'suppliers-family' ||
                    this.$route.name == 'suppliers-category' ||
                    this.$route.name == 'suppliers-product' ? 'd-inherit' : 'd-none'"
            width="20px"
            alt="menu"
          />
          <img
            src="@/assets/images/shop.png"
            :class="this.$route.name == 'suppliers' ||
                    this.$route.name == 'suppliers-family' ||
                    this.$route.name == 'suppliers-category' ||
                    this.$route.name == 'suppliers-product' ? 'd-none' : 'd-inherit'"
            width="20px"
            alt="menu"
          />
          <span :style="this.$route.name == 'suppliers' ||
                        this.$route.name == 'suppliers-family' ||
                        this.$route.name == 'suppliers-category' ||
                        this.$route.name == 'suppliers-product'
                    ? 'color: #008567;' : 'color: black;'"
          >Lojas</span>
        </div>
      </div>
    </router-link>

    <router-link style="color: black;" :to="{ name: 'orders' }" :class="this.$route.name == 'orders' ? 'options-container-selected' : 'options-container'">
      <div class="p-1">
        <div style="display: flex; flex-direction: column; place-items: center;">
          <img
            src="@/assets/images/invoice-selected.png"
            :class="this.$route.name == 'orders' ? 'd-inherit' : 'd-none'"
            width="20px"
            alt="menu"
          />
          <img
            src="@/assets/images/invoice.png"
            :class="this.$route.name == 'orders' ? 'd-none' : 'd-inherit'"
            width="20px"
            alt="menu"
          />
          <span :style="this.$route.name == 'orders' ? 'color: #008567;' : 'color: black;'"
          >Pedidos</span>
        </div>
      </div>
    </router-link>

  </div>
</template>
<script>
export default {
  name: "VNewBottomBar",
};
</script>

<style scoped>
.options-container{
  width: 33.3%;
  justify-content: center;
  height: 50px;
}
.options-container:hover{
  width: 33.3%;
  background: #80d5c0;
  height: 50px;
}
.options-container-selected{
  width: 33.3%;
  background: #e0f5f0;
  justify-content: center;
  height: 50px;

}
</style>

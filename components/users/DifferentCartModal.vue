<template>
  <vs-popup title="Aviso" :active.sync="open">
    <vs-row vs-type="flex" vs-justify="center" vs-align="center" >
      <h5 style="text-align: center; margin-bottom: 20px;">Seu carrinho já está ocupado<br> com os produtos deste fornecedor:</h5>
    </vs-row>
    <vs-row v-if="supplierName" vs-type="flex" vs-justify="center" vs-align="center" >
      <h4>{{ supplierName }}</h4>
    </vs-row>
    <vs-row vs-type="flex" vs-justify="center" vs-align="center" >
      <a href="javascript:void(0);" @click="goToReview()">
        <vs-button class="mb-2" style="margin-top: 5px;" color="primary" type="border">Ver o carrinho</vs-button>
      </a>
    </vs-row>
    <vs-divider />
    <vs-row vs-type="flex" vs-justify="center" vs-align="center" >
      <h6 class="mt-1" style="color: Grey;">O que você deseja fazer?</h6>
    </vs-row>
    <vs-row vs-type="flex" vs-justify="center" vs-align="center" >
      <vs-button style="margin-bottom: 15px;" @click="clearCartAndAdd()" color="primary" type="filled">
        <img v-if="automatic" :src="require(`@/assets/images/shopping-cart-white.png`)" alt="*" width="24" height="24" />
        <img v-else :src="require(`@/assets/images/tag_branca.png`)" alt="*" width="24" height="24" />
        Esvaziar carrinho e adicionar
      </vs-button>
    </vs-row>
    <vs-row vs-type="flex" vs-justify="center" vs-align="center" >
      <vs-button @click="open = false" color="primary" type="flat">Cancelar</vs-button>
    </vs-row>
  </vs-popup>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "DifferentCartModal",
  data() {
    return {
      open: false,
      supplierName: null,
      supplier: null,
    }
  },
  created() {

  },
  watch: {
    openPopup() {
      this.open = this.openPopup
      if(this.open && !this.automatic) {
        this.getSupplierNameById(this.productQuoteCart[0].supplierId).then((response) => {
          this.supplierName = response
        })
      } else if(this.open && this.automatic) {
        this.getSupplierByIdNoStore(this.storeCartSupplierId()).then((response) => {
          this.supplierName = response.user.name
          this.supplier = response
        })
      }
    },
    open() {
      this.$emit('update-modal', this.open)
    }
  },
  computed: {
    ...mapState("users/products", ["productQuoteCart", "storeCartSupplier", "storeProducts"]),
    ...mapGetters("users/products", ["storeCartSupplierId"]),
  },
  methods: {
    ...mapActions("suppliers", ["getSupplierNameById", "getSupplierByIdNoStore"]),
    ...mapActions("orders", [
      "createOrder"
    ]),
    clearCartAndAdd() {
      this.$emit('clear-cart-and-add')
      this.open = false
    },
    goToReview() {
      if(this.automatic)
        this.goToReviewOrder()
      else {
        setTimeout(() => {
          this.$router.push({ name: 'users.reviewQuote'})
        }, 300);
      }
    },
    goToReviewOrder() {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        this.createOrder({ supplierId: this.supplier.id, products: this.storeProducts }).then((response) => {
          this.$router.push({ name: 'users.reviewOrder', params: { supplierSlug: this.supplier.nameForUrl, orderId: response.id } })
        })
      }, 300);
    }
  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
    automatic: {
      type: Boolean,
    },
  },
  components: {

  },
};
</script>

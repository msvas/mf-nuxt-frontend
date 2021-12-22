<template>
  <b-modal id="safari-warning-modal" hide-footer hide-header>
    <div class="warning-icon-circle">
      <div class="warning-icon">!</div>
    </div>
    <div class="d-block text-center mt-2">
      <h2>Navegador incompatível</h2>
      <br>
      <p>
        Nosso carrinho não é suportado pelo navegador <b>Safari Mobile</b>.
        <br>
        Você pode entrar em contato com o fornecedor <b>{{ supplier.user.name }}</b> pelos dados abaixo:
        <br>
      </p>
      <h5>{{ supplier.user.name }}</h5>
      <h5>
        Tel:
        <a
          :href="'tel:' + supplier.user.phone"
        >
          {{ supplier.user.phone }}
        </a>
      </h5>
      <vs-button
        @click="shareOnWhatsapp()"
        color="#00bfa5"
        type="filled"
        style=""
      >
        <i class="fa fa-whatsapp mr-50"></i>Whatsapp
      </vs-button>
      <br>
      <b-button variant="primary" class="mt-2"  @click="closePopup()">Ok</b-button>
    </div>
  </b-modal>
</template>

<style scoped>

  .warning-icon-circle {
    margin: 0 auto;
    width: 64px;
    height: 64px;
    border-radius: 100%;
    border: 3px solid #f8bb86;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .warning-icon {
    color: #f8bb86;
    font-size: 34px;
    font-weight: bold;
  }
</style>

<script>

import ContactService from "@/services/contact"

export default {
  name: "SafariMobileCompatibilityWarning",
  mounted() {

  },
  watch: {
    open(newVal) {
      if(newVal){
        this.$bvModal.show("safari-warning-modal")
      }
    }
  },
  methods: {
    closePopup() {
      this.$bvModal.hide('safari-warning-modal')
      this.$emit('closed-safari-warning-modal')
    },
    generateContactViaWhatsappText(){
      if(this.$auth.loggedIn){
        if(this.$auth.user.cnpj){
          this.contactMessage= "O usuário \n" +this.$auth.user.name+ "\nPessoa Jurídica" + "\nId " +this.$auth.user.id+ "\nCEP " +this.$auth.user.zipcode + " " + this.$auth.user.street+ ", N.º " +this.$auth.user.addressDetails+ "\nFone" +this.$auth.user.phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
        }else{
          this.contactMessage= "O usuário \n" +this.$auth.user.name+ "\nPessoa Física" + "\nId " +this.$auth.user.id+ "\nCEP " +this.$auth.user.zipcode + " " + this.$auth.user.street+ ", N.º " +this.$auth.user.addressDetails+ "\nFone" +this.$auth.user.phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
        }
      }else if(localStorage.cep != 'null' && localStorage.serves_type != 'null'){
        this.contactMessage= "Um usuário anônimo \n" + localStorage.serves_type +  "\nCEP " +localStorage.cep + "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
            }else{
              this.contactMessage= "Um usuário anônimo entrou em contato com o fornecedor " +this.supplier.user.name+ ", via Whatsapp."
      }
    },
    shareOnWhatsapp() {
     this.generateContactViaWhatsappText();
      setTimeout(() => {
        ContactService.userContactedSupplierNotification(this.contactMessage);
      }, 1000);
      var url =
        "https://api.whatsapp.com/send?text=" +
        "Ol%C3%A1!%20Peguei%20seu%20contato%20pela%20plataforma%20Meu%20Fornecedor.%0AEst%C3%A1%20podendo%20falar%20agora%3F" +
        "&phone=55" +
        this.supplier.user.phone
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "");
      window.open(url, "_blank");
    },
  },
  props: {
    supplier: {
      type: Object,
      required: true,
    },
    open: {
      type: Boolean,
      required: true
    }
  },
};
</script>

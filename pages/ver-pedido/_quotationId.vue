<template>
  <div class="content-wrapper">
    <loading-overlay
      :active.sync="isLoading"
      :is-full-page="fullPage"
      :loader="loader"
      :color="color"
      :background-color="backgroundColor"
      :opacity="opacity"
      :width="width"
      :height="height"
    />
    <div
      class="content-body"
      v-if="loadedOrder || (total && loadedQuotation && (loadedQuotation.status == 'Pedido de compra a confirmar' || loadedQuotation.status == 'Pedido de compra confirmado' || loadedQuotation.status == 'Pedido de compra recusado'))"
      :style="mobileBrowser ? 'overflow-y: hidden; overflow-x: hidden; max-height: calc(100vh - 15em);' : 'max-height: calc(100vh - 11em);'"
    >
    <!-- <div class="py-2 px-2 bg-white" style="height: 65px; margin: -2.35rem -2.20rem 0.8rem -2.20rem;">
      <a href="/" >
        <div class="brand-logo-mf-color mt-0"></div>
      </a>
    </div> -->
    <div class="row" style="max-height: calc(100vh - 9em); overflow-y: scroll; overflow-x: hidden; padding-bottom: 100px;">
        <div class="col-md-9 pb-5 pb-md-0" :style="this.mobileBrowser ? '' : 'padding-right: 20px;' ">
          <div class="card shadow-sm mt-0" :style="mobileBrowser ? '' : 'position: sticky; top: 0px; z-index: 800;'">
            <div class="card-body p-1">
              <nuxt-link :to="{ path: '/pedidos' }">
                <span class="font-weight-bold d-block d-md-inline">
                  <i class="feather icon-chevron-left mr-25"></i>
                  Voltar
                </span>
              </nuxt-link>
            </div>
          </div>
          <div class="card shadow-sm mb-2" v-if="mobileBrowser" style="">
            <div class="card-body p-1 ml-0">
              <h6 class="disabled-opacity">Pedido emitido a</h6>
              <h3 class="font-weight-bold">{{ supplier.user.name }}</h3>
              <vs-button
                @click="shareOnWhatsapp()"
                color="#00bfa5"
                type="border"
                style="padding: 3px 10px; margin-left: 0; margin-top: 3px; margin-right: 7px; margin-bottom: 5px;"
              >
                <i class="fa fa-whatsapp mr-50"></i>Falar no Whatsapp
              </vs-button>
              <a @click="sendContactNotification()" :href="'tel:' + supplier.user.phone">{{ supplier.user.phone }}</a>
              <div class="" style="margin-top: 5px;">{{ supplier.user.legalName }}</div>
              <div class="">{{ formatCNPJ(supplier.user.cnpj) }}</div>
              <div class="">{{ completeAdress(supplier.user.street, supplier.user.addressDetails, supplier.user.neighborhood, supplier.user.city, supplier.user.stateUf) }}</div>
            </div>
            <vs-divider />
            <div class="card-body p-1">
              <h5 class="card-title"><i class="feather icon-truck font-medium-2 mr-50"></i> Condições de entrega</h5>
              <h6 v-if="supplier.deliveryEstimate" class="mb-50 pt-1 disabled-opacity">Prazo de entrega</h6>
              <h6 v-else class="mb-50 pt-1 disabled-opacity">Este fornecedor não realiza entregas.</h6>

              <p v-if="supplier.deliveryEstimate" class="font-small-3">
                {{ supplier.deliveryEstimate !== "" ? supplier.deliveryEstimate : 'Nada descrito'}}
              </p>
              <h5 v-if="supplier.deliveryRoute" class="mb-50 pt-1 disabled-opacity">Rota</h5>
              <p v-if="supplier.deliveryRoute" class="font-small-3">
                {{ supplier.deliveryRoute !== "" ? supplier.deliveryRoute : 'Nada descrito' }}
              </p>
              <h5 class="mb-50 pt-1 disabled-opacity" v-if="supplier.lastDeliveryRate && supplier.deliveryEstimate">
                Custo de frete
              </h5>
              <p v-if="supplier.lastDeliveryRate" class="font-small-3">
                {{ supplier.lastDeliveryRate }}
              </p>
            </div>
            <div class="card-body p-1">
              <div class="col-12 text-center">
                <span v-if="order && isDirect" class="d-block mt-1 font-medium-3 animate__animated animate__heartBeat animate__infinite">
                  <span
                    v-if="order.status == 'Pedido de compra recusado'"
                    class="badge badge-pill text-white"
                    style="background-color: #d11b6d; border: 1px solid #d11b6d;"
                    v-b-tooltip.hover title="O fornecedor recusou seu pedido de compra."
                  >
                      Pedido recusado
                  </span>
                  <span
                    v-if="order.status == 'Pedido de compra confirmado'"
                    class="badge badge-pill bg-mf-verde text-white"
                    style="color: black; background-color: #ffe77a;"
                    v-b-tooltip.hover title="O fornecedor confirmou seu pedido de compra!"
                  >
                      Pedido confirmado
                  </span>
                  <span
                    v-if="order.status == 'Pedido de compra a confirmar'"
                    class="badge badge-pill"
                    style="color: black; background-color: #ffe77a; font-weight: bold;"
                    v-b-tooltip.hover title="Mandaremos um email para você assim que o fornecedor confirmar sobre o seu pedido."
                  >
                      Aguardando confirmação
                  </span>
                </span>
                <span v-if="quotation && !isDirect" class="d-block mt-1 font-medium-3 animate__animated animate__heartBeat animate__infinite">
                  <span
                    v-if="quotation.status == 'Pedido de compra recusado'"
                    class="badge badge-pill"
                    style="color: black; background-color: #ffe77a; font-weight: bold;"
                    v-b-tooltip.hover title="O fornecedor recusou seu pedido de compra."
                  >
                      Recusado
                  </span>
                  <span
                    v-if="quotation.status == 'Pedido de compra confirmado'"
                    class="badge badge-pill"
                    style="color: black; background-color: #ffe77a; font-weight: bold;"
                    v-b-tooltip.hover title="O fornecedor confirmou seu pedido de compra!"
                  >
                      Confirmado
                  </span>
                  <span
                    v-if="quotation.status == 'Pedido de compra a confirmar'"
                    class="badge badge-pill"
                    style="color: black; background-color: #ffe77a; font-weight: bold;"
                    v-b-tooltip.hover title="Mandaremos um email para você assim que o fornecedor confirmar sobre o seu pedido."
                  >
                      Aguardando confirmação
                  </span>
                </span>
              </div>
            </div>
          </div>
          <VOrderProductsReview
            v-if="isDirect && loadedOrder && orderProducts && updated"
            :order="loadedOrder"
            :products="orderProducts"
            :isDirect="isDirect"
          />
          <VOrderProductsReview
            v-if="!isDirect && loadedQuotation && quotationProducts && updated"
            :order="loadedQuotation"
            :products="quotationProducts"
            :isDirect="isDirect"
          />
        </div>
        <div v-if="!mobileBrowser" class="col-md-3">
          <div class="card shadow-sm mb-2" style="position: sticky; top: 0px;">
            <div class="card-body p-1 ml-0">
              <h6 class="disabled-opacity">Pedido emitido a</h6>
              <h3 v-if="!order" class="font-weight-bold">{{ quotation.supplierName }}</h3>
              <h3 v-if="order" class="font-weight-bold">{{ supplier.user.name }}</h3>
              <vs-button
                @click="shareOnWhatsapp()"
                color="#00bfa5"
                type="border"
                style="padding: 3px 10px; margin-left: 0; margin-top: 3px; margin-right: 7px; margin-bottom: 5px;"
              >
                <i class="fa fa-whatsapp mr-50"></i>Falar no Whatsapp
              </vs-button>
              <a @click="sendContactNotification()" :href="'tel:' + supplier.user.phone">{{ supplier.user.phone }}</a><br>
              <div v-if="!isDirect && quotation.updatedAt" class="mt-1 mb-1 badge badge-pill badge-secondary font-small-3">{{ formattedDate(quotation.updatedAt) }}</div>
              <div v-if="isDirect && order.updated_at" class="mt-1 mb-1 badge badge-pill badge-secondary font-small-3">{{ formattedDate(order.updated_at) }}</div>
              <div class="" style="margin-top: 5px;">{{ supplier.user.legalName }}</div>
              <div class="">{{ formatCNPJ(supplier.user.cnpj) }}</div>
              <div class="">{{ completeAdress(supplier.user.street, supplier.user.addressDetails, supplier.user.neighborhood, supplier.user.city, supplier.user.stateUf) }}</div>
            </div>
            <vs-divider />
            <div class="card-body p-1">
              <h5 class="card-title"><i class="feather icon-truck font-medium-2 mr-50"></i> Condições de entrega</h5>
              <h6 v-if="supplier.deliveryEstimate" class="mb-50 pt-1 disabled-opacity">Prazo de entrega</h6>
              <h6 v-else class="mb-50 pt-1 disabled-opacity">Este fornecedor não realiza entregas.</h6>

              <p v-if="supplier.deliveryEstimate" class="font-small-3">
                {{ supplier.deliveryEstimate !== "" ? supplier.deliveryEstimate : 'Nada descrito'}}
              </p>
              <h5 v-if="supplier.deliveryRoute" class="mb-50 pt-1 disabled-opacity">Rota</h5>
              <p v-if="supplier.deliveryRoute" class="font-small-3">
                {{ supplier.deliveryRoute !== "" ? supplier.deliveryRoute : 'Nada descrito' }}
              </p>
              <h5 class="mb-50 pt-1 disabled-opacity" v-if="supplier.lastDeliveryRate && supplier.deliveryEstimate">
                Custo de frete
              </h5>
              <p v-if="supplier.lastDeliveryRate" class="font-small-3">
                {{ supplier.lastDeliveryRate }}
              </p>
            </div>
            <vs-divider />
            <div class="card-body p-1 font-small-3 row">
              <div class="col-6 text-left">
                Valor min.<br>
                <span style="margin-top: 10px;">Total</span>
              </div>
              <div class="col-6 text-right">
                <span class="d-block mb-25">
                  {{ supplier.minimumOrderValue }}
                </span>
                <p>
                  <strong>
                    <span class="font-small-2">R$ </span>
                    <span class="font-medium-2">{{ formatPrice(total).substring(3) }}</span>
                  </strong>
                </p>
              </div>
              <div class="col-11 p-1 ml-1 mr-1 font-small-2" style="background-color: #fae3a5; border-radius: 7px;">
                Pagamento e entrega são resolvidos diretamente com o fornecedor.<br>
                <a href="javascript:void(0);" @click="openPopup()">Saiba mais</a>
              </div>
              <div class="col-12 text-center">
                <span v-if="order && isDirect" class="d-block mt-1 font-medium-3 animate__animated animate__heartBeat animate__infinite">
                  <span
                    v-if="order.status == 'Pedido de compra recusado'"
                    class="badge badge-pill text-white"
                    style="background-color: #d11b6d; border: 1px solid #d11b6d;"
                    v-b-tooltip.hover title="O fornecedor recusou seu pedido de compra."
                  >
                      Pedido recusado
                  </span>
                  <span
                    v-if="order.status == 'Pedido de compra confirmado'"
                    class="badge badge-pill bg-mf-verde text-white"
                    style="color: black; background-color: #ffe77a;"
                    v-b-tooltip.hover title="O fornecedor confirmou seu pedido de compra!"
                  >
                      Pedido confirmado
                  </span>
                  <span
                    v-if="order.status == 'Pedido de compra a confirmar'"
                    class="badge badge-pill"
                    style="color: black; background-color: #ffe77a; font-weight: bold;"
                    v-b-tooltip.hover title="Mandaremos um email para você assim que o fornecedor confirmar sobre o seu pedido."
                  >
                      Aguardando confirmação
                  </span>
                </span>
                <span v-if="quotation && !isDirect" class="d-block mt-1 font-medium-3 animate__animated animate__heartBeat animate__infinite">
                  <span
                    v-if="quotation.status == 'Pedido de compra recusado'"
                    class="badge badge-pill"
                    style="color: black; background-color: #ffe77a; font-weight: bold;"
                    v-b-tooltip.hover title="O fornecedor recusou seu pedido de compra."
                  >
                      Recusado
                  </span>
                  <span
                    v-if="quotation.status == 'Pedido de compra confirmado'"
                    class="badge badge-pill"
                    style="color: black; background-color: #ffe77a; font-weight: bold;"
                    v-b-tooltip.hover title="O fornecedor confirmou seu pedido de compra!"
                  >
                      Confirmado
                  </span>
                  <span
                    v-if="quotation.status == 'Pedido de compra a confirmar'"
                    class="badge badge-pill"
                    style="color: black; background-color: #ffe77a; font-weight: bold;"
                    v-b-tooltip.hover title="Mandaremos um email para você assim que o fornecedor confirmar sobre o seu pedido."
                  >
                      Aguardando confirmação
                  </span>
                </span>
              </div>
            </div>

          </div>
        </div>
        <div v-else class="position-fixed" style="bottom: 0px;">
          <div class="card shadow-sm mb-0" style="">
            <div class="card-body pb-1 pl-1 pr-1 pt-0 font-small-3 row">
              <div style="border: solid 2px #f5f5f5; width: 100%; margin-bottom: 3px;"></div>
              <div class="col-6 text-left">
                Valor min.<br>
                <span style="margin-top: 10px;">Total</span>
              </div>
              <div class="col-6 text-right">
                <span class="d-block mb-25">
                  {{ supplier.minimumOrderValue }}
                </span>
                <p class="mb-0">
                  <strong>
                    <span class="font-small-2">R$ </span>
                    <span class="font-medium-2">{{ formatPrice(total).substring(3) }}</span>
                  </strong>
                </p>
              </div>
              <div class="col-11 ml-1 mr-1 font-small-2" style="background-color: #fae3a5; border-radius: 7px; padding: 10px; margin-bottom: 3px;">
                Pagamento e entrega são resolvidos diretamente com o fornecedor.<br>
              </div>
            </div>

          </div>
        </div>
    </div>


    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import priceFormatter from "@/mixins/priceFormatter";
import VOrderProductsReview from "@/components/orders/VOrderProductsReview";
import ContactService from "@/services/contact"

export default {
  data() {
    return {
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoading: false,
      quotationId: undefined,
      orderId: undefined,
      loadedQuotation: undefined,
      total: undefined,
      updated: false,
      backLoading: false,
      isDirect: false,
      loadedOrder: undefined,
      mobileBrowser: false,
    };
  },

  layout: 'noFooter/NoFooter',

  mounted() {
    this.isMobile()
    this.isLoading = true
    this.clearPagination()
    this.userSelectedPage(1)
    this.isDirect = Boolean(this.$route.query.direct)
    if(this.isDirect) {
      this.orderId = this.$route.params.quotationId
      this.getOrder({ id: this.orderId }).then(() => {
        this.loadedOrder = this.order
        this.getSupplierById(this.order.supplier_id)
        this.getValidOrderProducts({ id: this.orderId }).then(() => {
          this.updated = true
          this.isLoading = false
        })
      })
      this.getOrderTotal({ id: this.orderId }).then((total) => {
        this.total = total
      })
    } else {
      this.quotationId = this.$route.params.quotationId
      this.getQuotationWithPayments({ id: this.quotationId }).then(() => {
        this.loadedQuotation = this.quotation
        this.getSupplierById(this.quotation.supplierId)
      })
      this.getValidQuotationProducts({ id: this.quotationId }).then(() => {
        this.updated = true
        this.isLoading = false
      })
      this.getTotal({ id: this.quotationId }).then((total) => {
        this.total = total
      })
    }
  },

  computed: {
    ...mapState("quotations", ["quotation", "quotationProducts"]),
    ...mapState("quotes", ["quotes"]),
    ...mapState("pagination", ["totalPages", "totalCount"]),
    ...mapState("suppliers", ["supplier"]),
    ...mapState("orders", ["order", "orderProducts"]),
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value)
      },
    },
    // paymentName() {
    //   if(this.quotation && this.quotation.paymentMethods && this.quotation.paymentMethods.length) {
    //     let payment = this.quotation.paymentMethods.find(method => method.id == this.quotation.paymentMethodId)
    //     return payment.paymentMethod
    //   } else {
    //     return null
    //   }
    // }
  },

  methods: {
    ...mapActions("quotations", [
      "getQuotationWithPayments",
      "getValidQuotationProducts",
      "getTotal",
      "savePaymentMethod"
    ]),
    ...mapActions("pagination", ["userSelectedPage", "clearPagination"]),
    ...mapActions("suppliers", ["getSupplierById"]),
    ...mapActions("orders", [
      "getValidOrderProducts",
      "getOrder",
      "getOrderTotal"
    ]),
    cancelLink() {
      this.$router.push({ name: 'users.quotePanel',
                          params: { quoteId: this.quotation.quoteId },
                          query: { quotationId: this.quotationId } })
    },
    formattedDate(date) {
      var m = new Date(date)
      var dateString = m.getDate() +"/"+ (m.getMonth() + 1) + "/" + m.getFullYear() + " - " + m.getHours() + ":" + String(m.getMinutes()).padStart(2, "0")
      return dateString
    },
    backToQuotes(quotation){
      this.backLoading = true
      setTimeout(() => {
        this.backLoading = false
        if(this.$route.query.source == 'order-panel')
          location.href = `/pedidos-de-compra`
        else
          location.href =`/painel-de-cotacoes/${quotation.quoteId}?quotationId=${this.quotationId}`
      }, 300);
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
    formatCNPJ(value){
      return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    },
    completeAdress(street, addressDetails, neighborhood, city, state) {
      return `${street}, ${addressDetails}, ${neighborhood}, ${city} - ${state}`
    },
    formatPriceString(price) {
      return parseFloat(price.replace('R$', '').replace('.', '').replace(',', '.'))
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
    generateContactViaPhoneNumberText(){
      if(this.$auth.loggedIn){
        if(this.$auth.user.cnpj){
          this.contactMessage = "O usuário \n" +this.$auth.user.name+ "\nPessoa Jurídica" + "\nId " +this.$auth.user.id+ "\nCEP " +this.$auth.user.zipcode + " " + this.$auth.user.street+ ", N.º " +this.$auth.user.addressDetails+ "\nFone" +this.$auth.user.phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
        }else{
          this.contactMessage = "O usuário \n" +this.$auth.user.name+ "\nPessoa Física" + "\nId " +this.$auth.user.id+ "\nCEP " +this.$auth.user.zipcode + " " + this.$auth.user.street+ ", N.º " +this.$auth.user.addressDetails+ "\nFone" +this.$auth.user.phone+ "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
        }
      }else if(localStorage.cep != 'null' && localStorage.serves_type != 'null'){
        this.contactMessage= "Um usuário anônimo \n" + localStorage.serves_type +  "\nCEP " +localStorage.cep + "\nEntrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
            }else{
              this.contactMessage = "Um usuário anônimo entrou em contato com o fornecedor " +this.supplier.user.name+ ", através do número de telefone."
      }
    },
    sendContactNotification(){
      this.generateContactViaPhoneNumberText();
      setTimeout(() => {
        ContactService.userContactedSupplierNotification(this.contactMessage);
      }, 1000);
    }
  },
  components: {
    VOrderProductsReview
  },
  mixins: [priceFormatter]
};
</script>

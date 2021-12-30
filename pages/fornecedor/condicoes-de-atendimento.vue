<template>
  <div class="content-wrapper">
    <div class="content-header row">
      <div class="content-header-left col-12 mb-2">
        <div class="row breadcrumbs-top">
          <div class="col-12">
            <h1 class="content-header-title">Etapa 1 de 2</h1>
            <h2 class="content-header-title">Defina suas condições de atendimento</h2>
            <p
              class="mb-0"
            >Depois de configurar tudo, o seu negócio ficará disponível para receber demandas dos clientes</p>
          </div>
        </div>
      </div>
    </div>
    <div class="content-body">
      <div class="row">
        <v-card-service-condition
          :configurationName="'Tipo de Cliente'"
          :configuration="clientTypeCompleted"
          :iconName="'icon-users'"
          :routeName="'/fornecedor/tipos-de-cliente'"
        />

        <v-card-service-condition
          :configurationName="'Área de entrega ou atendimento'"
          :configuration="deliveryAreasCompleted"
          :iconName="'icon-map'"
          :routeName="'/fornecedor/area-de-atendimento'"
        />

        <v-card-service-condition
          :configurationName="'Prazo e rota de entrega'"
          :configuration="deliveriesCompleted"
          :iconName="'icon-truck'"
          :routeName="'/fornecedor/prazo-de-entrega'"
        />

        <v-card-service-condition
          :configurationName="'Valor mínimo de pedido'"
          :configuration="minimumOrderValueCompleted"
          :iconName="'icon-truck'"
          :routeName="'/fornecedor/valor-minimo-de-pedido'"
        />

        <!-- <v-card-service-condition
          v-if="$auth.user.supplierQuotationType != 'Automático'"
          :configurationName="'Formas de pagamento'"
          :configuration="paymentMethodsCompleted"
          :iconName="'icon-dollar-sign'"
          :routeName="'payment-methods'"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import VCardServiceCondition from "@/components/suppliers//VCardServiceConditions";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "ServiceConditions",
  updated() {
    console.log(this.allCompleted)
    console.log(this.allCompletedAutomatic)
    if(this.$auth.user.supplierStatus == 'Precificação')
      this.$router.push({ path: "/fornecedor/precificar" })
    else if ((this.$auth.user.supplierQuotationType != 'Automático' && this.allCompleted) ||
             (this.$auth.user.supplierQuotationType == 'Automático' && this.allCompletedAutomatic)) {
      switch(this.$auth.user.supplierStatus) {
        case "Não liberado":
          this.$router.push({ path: "/fornecedor/incluir-produtos" })
          break
        case "Liberado":
          this.$router.push({ path: "/fornecedor/cotacoes" })
          break
        }
    }
  },
  middleware: 'auth',
  layout: "supplier/Supplier",
  mounted() {
    this.getConfiguration();
  },
  computed: {
    ...mapState("suppliers/configurations", ["configuration"]),
    ...mapGetters("suppliers/configurations", [
      "clientTypeCompleted",
      "minimumOrderValueCompleted",
      "deliveriesCompleted",
      "deliveryAreasCompleted",
      "paymentMethodsCompleted",
      "allCompleted",
      "allCompletedAutomatic",
    ]),
  },
  methods: {
    ...mapActions("suppliers/configurations", ["getConfiguration"]),
  },
  components: {
    VCardServiceCondition,
  },
};
</script>

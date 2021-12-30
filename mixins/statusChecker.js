const statusChecker = {
  beforeMount() {
    const userLoggedIn = this.$auth.loggedIn
    const user = this.$auth.user

    const allowedRoutesMaintenance = [
      "/fornecedor/area-de-atendimento",
      "/fornecedor/condicoes-de-atendimento",
      "/fornecedor/valor-minimo-de-pedido",
      "/fornecedor/tipos-de-cliente",
      "/fornecedor/incluir-produtos"
    ]

    if (userLoggedIn) {
      if (user.isSupplier && user.supplierStatus == 'Cancelado') {
        this.$router.push({ path: '/fornecedor/cancelado' })
      } else if (user.isSupplier && user.supplierStatus == 'Manutenção' && !allowedRoutesMaintenance.includes(this.$route.path)) {
        this.$router.push({ path: '/fornecedor/em-manutencao' })
      } else if(!user.isSupplier && (['Suspenso', 'Cancelado'].includes(user.clientStatus))) {
        this.$router.push({ path: '/conta-suspensa' })
      }
    }
  },
  checkCanAccess() {
    var userLoggedIn = this.$auth.loggedIn
    var user = this.$auth.user
    if (userLoggedIn) {
      if (user.isSupplier && user.supplierStatus == 'Cancelado') {
        this.$router.push({ path: '/fornecedor/cancelado' })
      } else if (user.isSupplier && user.supplierStatus == 'Manutenção' && !allowedRoutesMaintenance.includes(this.$route.path)) {
        this.$router.push({ path: '/fornecedor/em-manutencao' })
      } else if(!user.isSupplier && (['Suspenso', 'Cancelado'].includes(user.clientStatus))) {
        this.$router.push({ path: '/conta-suspensa' })
      }
    }
  }
}

export default statusChecker

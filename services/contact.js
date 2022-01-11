const RESOURCE_URL = 'api/v1/contacts'

export default {
  sendMail(data) {
    return $nuxt.$axios.post(`${RESOURCE_URL}`,
      { contact: {
          contact_name: data.contactName,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message }
      })
  },

  userAsSupplierData(data) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/as_supplier`,
      { contact: {
          contact_name: data.contactName,
          name: data.name,
          phone: data.phone,
          state: data.state,
          city: data.city,
          cnpj: data.cnpj,
          email: data.email, }
      })
  },
  userContactedSupplierNotification(string) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/user_contacted_supplier`,
      { contact: {
          name: string }
      })
  },

  partnerData(data) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/partner`,
      { contact: {
          contact_name: data.contactName,
          name: data.name,
          phone: data.phone }
      })
  },

  adminErrorSitemapNotification(data) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/admin_error_sitemap_notification`, {
      contact: {
        message: data.message
      }
    })
  },
}

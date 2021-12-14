const RESOURCE_URL = 'api/v1/mailing_lists'

export default {
  addEmail(data) {
    return $nuxt.$axios.post(`${RESOURCE_URL}`,
      { mailing_list: {
          name: data.name,
          email: data.email,
          uf: data.uf,
          comments: data.comments }
      })
  },

}

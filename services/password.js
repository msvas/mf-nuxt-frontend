const RESOURCE_URL = '/user_auth'

export default {
  startResetPassword(email) {
    return $nuxt.$axios.post(`${RESOURCE_URL}/password`, { email: email, redirect_url: document.location.origin + '/redefinir-senha' })
  },

  resetPassword(data) {
    return $nuxt.$axios.put(`${RESOURCE_URL}/password`, {
                          password: data.password,
                          password_confirmation: data.passwordConfirmation
                        }, {
                          headers: {
                            'access-token': data.accessToken,
                            'uid': data.uid,
                            'client': data.client
                          }})
  },

}

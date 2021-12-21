export default function ({ $axios, app }) {
  $axios.onRequest((config) => {
    // Devise Token Auth
    if(process.client) {
      if (localStorage.getItem('token-type') === 'Bearer' && localStorage.getItem('access-token')) {
        config.headers.uid = localStorage.getItem('uid')
        config.headers.client = localStorage.getItem('client')
        config.headers['access-token'] = localStorage.getItem('access-token')
      }
    } else if(process.server && app.$auth.$storage.getCookie('uid')) {
      config.headers.uid = app.$auth.$storage.getCookie('uid')
      config.headers.client = app.$auth.$storage.getCookie('client')
      config.headers['access-token'] = app.$auth.$storage.getCookie('access-token')
    }
  })

  $axios.onResponse((response) => {
    // Devise Token Auth
    if(process.client) {
      if (response.headers['token-type'] === 'Bearer' && response.headers['access-token']) {
        localStorage.setItem('token-type', response.headers['token-type'])
        localStorage.setItem('uid', response.headers.uid)
        localStorage.setItem('client', response.headers.client)
        localStorage.setItem('access-token', response.headers['access-token'])
        localStorage.setItem('expiry', response.headers.expiry)
        app.$auth.$storage.setCookie('uid', response.headers.uid, false)
        app.$auth.$storage.setCookie('token-type', response.headers['token-type'], false)
        app.$auth.$storage.setCookie('client', response.headers.client, false)
        app.$auth.$storage.setCookie('access-token', response.headers['access-token'], false)
        app.$auth.$storage.setCookie('expiry', response.headers.expiry, false)
      }
    }
  })
}

const pkg = require('./package')
const RESOURCE_URL = '/user_auth'

module.exports = {
  mode: 'universal',

  server: {
    port: 8080 // default: 3000
  },

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'https://meufornecedor.com.br/favicon-180x180.png' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://meufornecedor.com.br/loader.css' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600' },
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/components.css',
    '~/assets/style/colors.min.css',
    '~/assets/style/bootstrap.min.css',
    '~/assets/style/bootstrap-extended.css',
    '~/assets/style/vertical-menu.min.css',
    '~/assets/style/iconfont.css',
    '~/assets/style/forms/wizard.min.css',
    '~/assets/style/style.css',
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/axios.js' },
    { src: '~plugins/vuesax.js' },
    { src: '~plugins/veevalidate.js' },
    { src: '~plugins/vue-form-wizard.js' },
    { src: '~plugins/vue-currency-input.js' },
    { src: '~plugins/vue-loading-overlay.js' },
    { src: '~plugins/vue-context.js', mode: "client" },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    '@nuxtjs/device',
    '@nuxtjs/auth-next',
    'vue-currency-input/nuxt',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.VUE_APP_REST_API_URL,
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer',
        },
        user: {
          property: 'data',
          autoFetch: true,
        },
        endpoints: {
          login: {
            url: `${RESOURCE_URL}/sign_in`,
            method: 'post',
            propertyName: 'token'
          },
          user: {
            url: `${RESOURCE_URL}/validate_token`,
            method: 'get',
          },
          logout: {
            url: `${RESOURCE_URL}/sign_out`,
            method: 'delete',
          }
        }
      }
    }
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.push(...[
        {
          path: "/fornecedores/:familyName",
          name: "suppliers-family",
          component: "@/pages/fornecedores.vue",
          meta: {
            hideFooter: true,
            familyView: true,
            showQuotationButton: true,
          }
        },
        {
          path: "/fornecedores/:familyName/:categoryName",
          name: "suppliers-category",
          component: "@/pages/fornecedores.vue",
          meta: {
            hideFooter: true,
            categoryView: true,
            showQuotationButton: true,
          },
        },
        {
          path: "/fornecedores/:familyName/:categoryName/:productTypeName",
          name: "suppliers-product",
          component: "@/pages/fornecedores.vue",
          meta: {
            hideFooter: true,
            productTypeView: true,
            showQuotationButton: true,
          },
        }
      ])
    }
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  }
}

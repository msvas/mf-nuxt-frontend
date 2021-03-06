const pkg = require('./package')
const RESOURCE_URL = '/user_auth'

module.exports = {
  mode: 'universal',

  server: {
    port: process.env.PORT ? process.env.PORT : '8080' // default: 3000
  },

  loading: '@/components/general/Loading.vue',

  /*
  ** Headers of the page
  */
  head: {
    title: 'Meu Fornecedor | Compre online para seu restaurante',
    meta: [
      { charset: 'utf-8' },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: "Meu Fornecedor | Compre online para seu restaurante" },
      { property: "og:description", content: "Simplifique as compras do seu restaurante, padaria, minimercado. Veja os preços de várias distribuidoras. Alimentos, bebidas, embalagens, limpeza, utensílios." },
      { property: "og:url", content: "https://meufornecedor.com.br/" },
      { property: "og:site_name", content: "Meu Fornecedor | Compre online para seu restaurante", },
      { property: "og:image", itemprop: "image", content:  "https://meufornecedor.com.br/logo.png", },
      { property: "og:image:secure_url", itemprop: "image", content:  "https://meufornecedor.com.br/logo.png", },
      { property: "og:image:width", content: "868" },
      { property: "og:image:height", content: "332" },
      { property: "og:image:alt", content: "MeuFornecedor" },
      { property: "og:image:type", content: "image/jpg" },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'name', content: 'Meu Fornecedor' },
      { hid: 'description', name: 'description', content: 'Simplifique as compras do seu restaurante, padaria, minimercado. Veja os preços de várias distribuidoras. Alimentos, bebidas, embalagens, limpeza, utensílios.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'https://meufornecedor.com.br/favicon-180x180.png' },
      { rel: 'apple-touch-icon', href: 'https://meufornecedor.com.br/favicon-32x32.png' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://meufornecedor.com.br/loader.css' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600' },
    ]
  },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/bootstrap.min.css',
    '~/assets/style/bootstrap-extended.css',
    '~/assets/style/colors.min.css',
    '~/assets/style/components.css',
    '~/assets/style/style.css',
    '~/assets/style/vertical-menu.min.css',
    '~/assets/style/iconfont.css',
    '~/assets/style/forms/wizard.min.css',
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/axios.js' },
    { src: '~plugins/vuesax.js' },
    // { src: '~plugins/router.js' },
    { src: '~plugins/animate.js' },
    { src: '~plugins/vue-directive-tooltip.js' },
    { src: '~plugins/vue-dragscroll.js', mode: "client" },
    { src: '~plugins/vue-toast.js', mode: "client" },
    { src: '~plugins/vue-meta.js', mode: "client" },
    { src: '~plugins/veevalidate.js' },
    { src: '~plugins/vue-form-wizard.js' },
    { src: '~plugins/vue-currency-input.js' },
    { src: '~plugins/vue-loading-overlay.js' },
    { src: '~plugins/vue-browser-detect-plugin.js', mode: "client" },
    { src: '~plugins/vue-context.js', mode: "client" },
    { src: '~plugins/vue-clipboard2.js', mode: "client" },
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
    '@nuxtjs/robots',
    'vue-currency-input/nuxt',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // baseURL: process.env.VUE_APP_REST_API_URL,
    proxy: true,
    debug: process.env.NODE_ENV && process.env.NODE_ENV === 'development',
  },

  proxy: {
    '/api': {
      target: process.env.VUE_APP_REST_API_URL,
      pathRewrite: {
        '^/api': '/api',
      }
    },
    '/user_auth': {
      target: process.env.VUE_APP_REST_API_URL,
      pathRewrite: {
        '^/user_auth': '/user_auth',
      }
    },
    '/sitemaps': {
      target: process.env.VUE_APP_REST_API_URL,
      pathRewrite: {
        '^/sitemaps': '/sitemaps',
      }
    },
  },

  robots: {
    UserAgent: '*',
    Disallow: '',
    Sitemap: 'https://mf-assets-develop.s3.us-east-2.amazonaws.com/uploads/sitemaps/sitemap-index.xml',
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: false,
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
            propertyName: false
          },
          user: {
            url: `${RESOURCE_URL}/validate_token`,
            method: 'get',
          },
          logout: {
            url: `${RESOURCE_URL}/sign_out`,
            method: 'delete',
          }
        },
      },
    },
    redirect: {
      login: '/login',
      logout: false,
      home: false,
      callback: false,
    },
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
        },
        {
          path: "/produtos/:familyName",
          name: "cotar-familia",
          component: "@/pages/produtos/CatalogAllStore.vue",
          meta: {
            hideFooter: true,
            familyView: true,
            showQuotationButton: true
          },
        },
        {
          path: "/produtos/:familyName/:categoryName",
          name: "cotar-categoria",
          component: "@/pages/produtos/CatalogAllStore.vue",
          meta: {
            hideFooter: true,
            categoryView: true,
            showQuotationButton: true
          },
        },
        {
          path: "/produtos/:familyName/:categoryName/:productTypeName",
          name: "cotar-produto",
          component: "@/pages/produtos/CatalogAllStore.vue",
          meta: {
            hideFooter: true,
            productTypeView: true,
            showQuotationButton: true
          },
        },
        {
          path: '/loja/busca/:supplierSlug/:keyword',
          name: 'public-store-search',
          component: '@/pages/StoreSearch.vue',
          meta: {
            publicPage: true,
            supplierStore: true,
          },
        },
        {
          path: '/loja/:supplierSlug',
          name: 'public-store',
          component: '@/pages/SupplierPublicPage.vue',
          meta: {
            publicPage: true,
            supplierStore: true,
          }
        },
        {
          path: "/revisar-cotacao",
          name: "users.reviewQuote",
          component: "@/pages/ReviewQuote.vue",
          meta: {
            blockSearch: true,
            hideNavbar: true,
            hideFooter: true,
          },
        },
        {
          path: '/loja/:supplierSlug/revisar-compra/:orderId',
          name: 'users.reviewOrder',
          component: '@/pages/ReviewOrder.vue',
          meta: {
            blockSearch: true,
            publicPage: true,
            supplierStore: true,
            leaveQuotationButton: true,
            backUrl: '',
            forceLogo: true,
          },
        },
        {
          path: '/loja/:supplierSlug/revisar-compra/produtos/:orderId',
          name: 'users.reviewOrderProducts',
          component: '@/pages/ReviewOrderProducts.vue',
          meta: {
            blockSearch: true,
            publicPage: true,
            supplierStore: true
          },
        },
        {
          path: '/loja/:supplierSlug/:familyName',
          name: 'public-store-family',
          component: '@/pages/SupplierPublicPage.vue',
          meta: {
            publicPage: true,
            supplierStore: true,
            familyView: true,
          },
        },
        {
          path: '/loja/:supplierSlug/:familyName/:categoryName',
          name: 'public-store-category',
          component: '@/pages/SupplierPublicPage.vue',
          meta: {
            publicPage: true,
            supplierStore: true,
            categoryView: true,
          },
        },
        {
          path: '/loja/:supplierSlug/:familyName/:categoryName/:productTypeName',
          name: 'public-store-product',
          component: '@/pages/SupplierPublicPage.vue',
          meta: {
            publicPage: true,
            supplierStore: true,
            productTypeView: true,
          },
        },
        {
          path: '/loja/:supplierSlug/:familyName/:categoryName/:productTypeName/:identifier',
          name: 'public-store-product-page',
          component: '@/pages/ProductPage.vue',
          meta: {
            publicPage: true,
            supplierStore: true,
          },
        },
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

<template>
    <div>
        <h1>
            Sitemap
        </h1>
        <h2 v-if="this.$route.query.password == 'mf123'">
            Gerando!
        </h2>
        <h2 v-else>
            Acesso negado!
        </h2>
    </div>
</template>

<script>
import SupplierService from '@/services/suppliers';
import ClientService from '@/services/catalog';
import ContactService from '@/services/contact'

export default {
    name: "Sitemap",
    data() {
        return {
            catalog: []
        }
    },
    layout: "empty",
    mounted() {
        if(this.$route.query.password == 'mf123'){

            ClientService.getAllCatalog().then((response) => {
                SupplierService.getAll().then((response2) => {
                    const catalogData = response.data
                    const supplierData = response2.data

                    this.getRoutesList(this.$router.options.routes, supplierData, catalogData).then(response => {
                      this.generateXML(response.sitemapGeral, 'https://meufornecedor.com.br')

                      this.generateXMLIndex(response.sitemapIndex, 'https://mf-assets-develop.s3.us-east-2.amazonaws.com/uploads/sitemaps/')

                      Object.entries(response.sitemapSuppliers).map((suppliersUrl) => {
                          this.generateXMLSupplier(suppliersUrl, 'https://meufornecedor.com.br')
                      })
                    })
                    .catch(ContactService.adminErrorSitemapNotification({message: 'Falha ao gerar as arrays de URLs'}))
                })
                .catch(ContactService.adminErrorSitemapNotification({message: 'Falha na requisição dos fornecedores'}));
            })
            .catch(ContactService.adminErrorSitemapNotification({message: 'Falha na requisição do catálogo'}));
        }
    },
    methods: {
        async getRoutesList(routes, suppliers, catalog) {
            let array = []
            let suppliersObj = {}
            let suppliersName = []
            const noUrl = ['sitemap', 'supplier-canceled', 'service-conditions', 'my-catalog', 'supplier-maintenance','contact-supplier', 'users.suspended',
                            'products-empty', 'client-types', 'minimum-order-value', 'pricing', 'delivery-conditions', 'delivery-areas', 'payment-methods',
                            'quotation-panel', 'email-authenticate', 'users.search', 'users.reviewQuote', 'users.allQuotes', 'users.quoteSent', 'users.orderPanel',
                            'users.checkOrder', 'users.reviewQuotation','users.reviewQuotationProducts', 'users.quotePanel', 'users.reviewQuote', 'users.reviewOrder',
                            'users.reviewOrderProducts', 'suppliers-family', 'suppliers-category', 'suppliers-product', 'supplier-order', 'public-store-search',
                            'invalid-token', 'category', 'product-type', 'family', 'orders', 'direct-order', 'reply-quotation', 'login', 'sign-up',
                            'finished-sign-up', 'password-recovery', 'reset-password', 'cadastro', 'conta-suspensa', 'link-expirado', 'minhas-cotacoes', 'pedidos',
                            'pedidos-de-compra', 'recuperar-senha', 'redefinir-senha', 'fornecedor-area-de-atendimento', 'fornecedor-condicoes-de-atendimento',
                            'fornecedor-cotacoes', 'fornecedor-em-manutencao', 'fornecedor-incluir-produtos', 'fornecedor-meu-catalogo', 'fornecedor-prazo-de-entrega',
                            'fornecedor-precificar', 'fornecedor-tipos-de-cliente', 'fornecedor-valor-minimo-de-pedido', 'fornecedor-responder-cotacao-quotationId',
                            'revisar-pedido-produtos-quotationId', 'compra-orderId', 'painel-de-cotacoes-quoteId', 'pedido-quotationId', 'revisar-pedido-quotationId',
                            'ver-pedido-quotationId', 'ReviewOrder', 'ProductPage', 'ReviewOrderProducts', 'ReviewQuote', 'StoreSearch', 'SupplierPublicPage',
                            'fornecedor-cancelado', 'produtos-CatalogAllStore', 'busca-keyword', 'cotar-familia', 'cotar-categoria', 'cotar-produto']

            for (let index = 0; index < routes.length; index++) {
                const url = `${routes[index].path}`;
                if (routes[index].path !== '*' && url !== '' && !noUrl.includes(routes[index].name)) {
                    array.push({path: url});
                }

                //if (routes[index].children) {
                    //for (let index2 = 0; index2 < routes[index].children.length; index2++) {
                        //let url2 = `${routes[index].children[index2].path}`
                        let url2 = `${routes[index].path}`
                        //if (routes[index].children[index2].path !== '*' && url2 !== '' && !noUrl.includes(routes[index].children[index2].name)) {
                        if (routes[index].path !== '*' && url2 !== '' && !noUrl.includes(routes[index].name)) {
                            if (url2.includes('loja/:supplierSlug')) {
                                let suppArr = []
                                for (let index3 = 0; index3 < suppliers.length; index3++) {
                                   let supplierNameUrl = url2.replace(/:supplierSlug/i, suppliers[index3].nameForUrl)
                                   suppliersName.push({path: suppliers[index3].nameForUrl})
                                   if (supplierNameUrl.includes(':familyName')) {
                                       for (let family in suppliers[index3].catalogAsHash) {
                                            let supplierFamilyUrl = supplierNameUrl.replace(/:familyName/i, this.formatString(family))
                                            if (supplierFamilyUrl.includes(':categoryName')) {
                                                for (let colection in suppliers[index3].catalogAsHash[family]) {
                                                    for (let category in suppliers[index3].catalogAsHash[family][colection]) {
                                                        let supplierCategoryUrl = supplierFamilyUrl.replace(/:categoryName/i, this.formatString(category))
                                                        if (supplierCategoryUrl.includes(':productTypeName')) {
                                                            for (let index4 = 0; index4 < suppliers[index3].catalogAsHash[family][colection][category].length; index4++) {
                                                                let productTypeUrl = supplierCategoryUrl.replace(/:productTypeName/i, this.formatString(suppliers[index3].catalogAsHash[family][colection][category][index4].productType))
                                                                if (productTypeUrl.includes(':identifier')) {
                                                                    await this.createProductsArray(suppliers[index3].catalogAsHash[family][colection][category][index4].productTypeId, suppliers[index3].id)
                                                                                                .then(response => {
                                                                                                    response.data.map(productArr => {
                                                                                                        let identifierUrl = productTypeUrl.replace(/:identifier/i, this.productIdentifier(productArr))
                                                                                                        suppArr.push({path: identifierUrl})
                                                                                                    })
                                                                                                })
                                                                } else suppArr.push({path: productTypeUrl})
                                                            }
                                                        } else suppArr.push({path: supplierCategoryUrl})
                                                    }
                                                }
                                            } else suppArr.push({path: supplierFamilyUrl})
                                       }
                                   } else suppArr.push({path: supplierNameUrl});
                                    suppliersObj[suppliers[index3].name] ||= []
                                    suppliersObj[suppliers[index3].name] = suppliersObj[suppliers[index3].name].concat(suppArr)
                                    suppArr = []
                                }
                            }
                            // Parte da função que constroi as URL's de produtos
                            else if (url2.includes('/produtos/:familyName') || url2.includes('/fornecedores/:familyName')) {
                                for (let family in catalog) {
                                    let  familyNameUrl = url2 .replace(/:familyName/i, this.formatString(family))
                                    if (familyNameUrl.includes(':categoryName')) {
                                         for (let colection in catalog[family]) {
                                            for (let category in catalog[family][colection]) {
                                                let categoryNameUrl = familyNameUrl.replace(/:categoryName/i, this.formatString(category))
                                                if (categoryNameUrl.includes(':productTypeName')) {
                                                    for (let index4 = 0; index4 < catalog[family][colection][category].length; index4++) {
                                                        let productTypeUrl = categoryNameUrl.replace(/:productTypeName/i, this.formatString(catalog[family][colection][category][index4].productType))
                                                        array.push({path: productTypeUrl});
                                                    }
                                                } else array.push({path: categoryNameUrl});
                                            }
                                        }
                                    } else array.push({path: familyNameUrl})
                                }
                            } else array.push({path: url2});
                            // Fim da parte da função que constroi as URL's de produtos
                        }
                    //}
                //}
            }
            suppliersName = [...new Map(suppliersName.map((item) => [item['path'], item])).values()];
            suppliersName.push({path: 'url-gerais'})

            return {sitemapGeral: array, sitemapSuppliers: suppliersObj, sitemapIndex: suppliersName}
        },

        normalizeString(s) {
            var r = s.toLowerCase();
            r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
            r = r.replace(new RegExp("ç", 'g'),"c");
            r = r.replace(new RegExp("[èéêë]", 'g'),"e");
            r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
            r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
            r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
            return r;
        },
        formatString(string) {
            return this.normalizeString(string).replace(/\s+/g, '-')
        },
        productIdentifier(product) {
            var text = ''
            // text += this.formatString(this.product.familyName) + '-'
            if(product.categoryCollection)
                text += this.formatString(product.categoryCollection) + '-'
            // text += this.formatString(this.product.categoryName) + '-'
            // text += this.formatString(this.product.productTypeName) + '-'
            if(product.brandName)
                text += this.formatString(product.brandName) + '-'
            if(product.propertyName)
                text += this.formatString(product.propertyName) + '-'
            if(product.productLineName)
                text += this.formatString(product.productLineName) + '-'
            if(product.productLineExtensionName)
                text += this.formatString(product.productLineExtensionName) + '-'
            if(product.packagingName)
                text += this.formatString(product.packagingName) + '-'
            if(product.quantity)
                text += this.formatString(product.quantity) + '-'
            if(product.unitsOfMeasurementName)
                text += this.formatString(product.unitsOfMeasurementName) + '-'
            if(product.secondaryCharacteristics && product.secondaryCharacteristics.length) {
                for(var i = 0; i < product.secondaryCharacteristics.length; i++) {
                text += this.formatString(product.secondaryCharacteristics[i]) + '-'
                }
            }
            return text + product.id
        },
        async createProductsArray(productTypeId, supplierId) {
            let products = []
            products = SupplierService.getCatalogByProductTypeAndSupplier(productTypeId, supplierId)
            return products
        },
        generateXML(routes, baseURL) {
            //create the xmlbuilder2 wrapper, add urlset tag
            const { create } = require('xmlbuilder2');
            const root = create()
            .ele('urlset')

            //for each path in the routes array, combine the base URL with the path
            //and wrap them in url and loc tags.
            for(let i=0; i<routes.length; i++) {
            let path = routes[i].path
            root
                .ele('url')
                    .ele('loc').txt(baseURL + path)
            }

            const xml = root.end({ prettyPrint: true });

            SupplierService.uploadSitemap({content: xml, name: "urls-gerais-sitemap"});
        },
        generateXMLSupplier(routes, baseURL) {
            let suppliersName = this.formatString(routes[0])
            let arrSuppliers = routes[1]

            const { create } = require('xmlbuilder2');
            const root = create()
            .ele('urlset')

            for(let i=0; i<arrSuppliers.length; i++) {
                let path = arrSuppliers[i].path
            root
                .ele('url')
                    .ele('loc').txt(baseURL + path)
            }

            const xml = root.end({ prettyPrint: true });

            SupplierService.uploadSitemap({content: xml, name: suppliersName + "-sitemap"});
        },
        generateXMLIndex(routes, baseURL) {
            const { create } = require('xmlbuilder2');
            const root = create()
            .ele('sitemapindex')

            for(let i=0; i<routes.length; i++) {
            let path = routes[i].path
            root
                .ele('sitemap')
                    .ele('loc').txt(baseURL + path + '-sitemap.xml')
            }

            const xml = root.end({ prettyPrint: true });

            SupplierService.uploadSitemap({content: xml, name: "sitemap-index"});
        },
    }
}
</script>

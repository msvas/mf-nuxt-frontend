const productUrlIdentifier = {
  methods: {
    productIdentifier(product) {
      var text = ''
      // text += this.formatString(this.product.familyName) + '-'
      if(product.categoryCollection)
        text += this.formatString(product.categoryCollection) + '-'
      // text += this.formatString(this.product.categoryName) + '-'
      // text += this.formatString(this.product.productTypeName) + '-'
      if(this.product.brandName)
        text += this.formatString(product.brandName) + '-'
      if(this.product.propertyName)
        text += this.formatString(product.propertyName) + '-'
      if(this.product.productLineName)
        text += this.formatString(product.productLineName) + '-'
      if(this.product.productLineExtensionName)
        text += this.formatString(product.productLineExtensionName) + '-'
      if(this.product.packagingName)
        text += this.formatString(product.packagingName) + '-'
      if(this.product.quantity)
        text += this.formatString(product.quantity) + '-'
      if(this.product.unitsOfMeasurementName)
        text += this.formatString(product.unitsOfMeasurementName) + '-'
      if(product.secondaryCharacteristics && product.secondaryCharacteristics.length) {
        for(var i = 0; i < product.secondaryCharacteristics.length; i++) {
          text += this.formatString(product.secondaryCharacteristics[i]) + '-'
        }
      }
      return text + product.id
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
  }
}

export default productUrlIdentifier

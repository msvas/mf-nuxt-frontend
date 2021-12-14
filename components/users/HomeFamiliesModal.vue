<template>
  <div>
    <vs-popup title="Selecione a categoria" :active.sync="open">
      <div :style="$device.isMobile ? 'padding-bottom: 36px;' : ''">
        <div
          v-for="(family, index1) in catalog"
          :key="index1"
          style="margin-bottom: 8px;;"
        >
          <h5><span v-html="getFamilyIcon(index1)"></span> {{ index1 }}</h5>
          <span v-if="index1 == 'Alimentos e bebidas'">
              <span
                v-for="(collection, index2) in family"
                :key="index2"
              >
                <span
                  v-for="(category, index3) in collection"
                  :key="index3"
                  :vs-value="index3"
                  style="display: inline-block; float: none;"
                >
                  <span v-if="category.length > 1">
                    <vs-chip

                    >
                      <router-link style="color: black;" @click="this.open = !this.open"
                      :to="{ name: 'cotar-categoria', params: { familyName: formatString(index1), categoryName: formatString(index3) }}"
                      >{{ index3 }}</router-link>
                    </vs-chip>
                  </span>
              </span>
            </span>
          </span>
          <span v-else>
            <span
              v-for="(collection, index2) in family"
              :key="index2"
            >
              <span
                v-for="(category, index3) in collection"
                :key="index3"
                :vs-value="index3"
                style="display: inline-block; float: none;"
              >
                <span v-if="category.length > 1">
                  <vs-chip

                  >
                    <router-link style="color: black;" @click="this.open = !this.open"
                      :to="{ name: 'cotar-categoria', params: { familyName: formatString(index1), categoryName: formatString(index3) }}"
                      >{{ index3 }}</router-link>
                  </vs-chip>
                </span>
              </span>
            </span>
          </span>
        </div>
      </div>
    </vs-popup>
  </div>
</template>

<script>

export default {
  name: "HomeFamiliesModal",
  data() {
    return {
      open: false,

    }
  },
  created() {

  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    },
    open() {
      this.$emit('update-modal', this.open)
    }
  },
  computed: {
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    normalizeString(s) {
      var r = s.toLowerCase();
      r = r.replace(new RegExp("[àáâãäå]", "g"), "a");
      r = r.replace(new RegExp("ç", "g"), "c");
      r = r.replace(new RegExp("[èéêë]", "g"), "e");
      r = r.replace(new RegExp("[ìíîï]", "g"), "i");
      r = r.replace(new RegExp("[òóôõö]", "g"), "o");
      r = r.replace(new RegExp("[ùúûü]", "g"), "u");
      return r;
    },
    formatString(string) {
      return this.normalizeString(string).replace(/\s+/g, "-").replace(".", "");
    },
    getFamilyIcon(family) {
      switch(family) {
        case 'Alimentos e bebidas':
          return '<img src="' + require(`@/assets/images/maca.svg`) + '" alt="*" width="16">'
        case 'Embalagens':
          return '<i class="feather icon-shopping-bag mr-25"></i>'
        case 'Limpeza':
          return '<img src="' + require(`@/assets/images/window-cleaner.svg`) + '" alt="*" width="16">'
        case 'Utensílios':
          return '<i class="fa fa-cutlery mr-25"></i>'
      }
      return null
    },
  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
    catalog: {
      required: true,
    },
  },
  components: {

  },
};
</script>

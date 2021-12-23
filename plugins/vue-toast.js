import Vue from 'vue'
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
Vue.use(Toast, {});
// Cria mixins globais
Vue.mixin({
  methods: {
    notifyInfo(message, icon) {
      this.$toast(message, {

        toastClassName: "my-custom-toast-class",

        bodyClassName: ["custom-class-1", "custom-class-2"],

        icon: icon,

      });
    },
    notifyInfo2(message, icon) {
      this.$toast(message, {

        toastClassName: "my-custom-toast-class2",

        bodyClassName: ["custom-class-1", "custom-class-2"],

        icon: icon,

      });
    },
    cartInfo(message, toastClass, icon) {
      this.$toast(message, {

        toastClassName: toastClass,

        bodyClassName: ["custom-class-2"],

        icon: icon,

        position: "top-right",

        timeout: 1500,


      });
    }
  }
})

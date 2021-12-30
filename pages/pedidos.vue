<template>
  <div style="display: flex; justify-content: space-around; flex-wrap: nowrap; padding: 10px; padding-top: 90px;"
       :style="$device.isMobile ? 'flex-wrap: wrap;' : 'flex-wrap: nowrap;'"
  >
    <open-quotes-banner class="p-1" />
    <orders-banner class="p-1" id="orders" />
  </div>
</template>

<style>
  .card .card {
    box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%) !important;
  }
</style>

<script>
import OpenQuotesBanner from "@/components/home/OpenQuotesBanner";
import OrdersBanner from "@/components/home/OrdersBanner";

export default {
  name:"Orders",
  data(){
    return{
      mobileBrowser: false,
    }
  },
  created(){

  },
  mounted() {
    this.isMobile()
    if(this.$route.query.directId && this.mobileBrowser) {
      setTimeout(() =>{
        var top = document.getElementById('orders').offsetTop - 60
        window.scrollTo(0, top)
      }, 4000)
    }
  },
  methods:{
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
  },
  components:{
    OpenQuotesBanner,
    OrdersBanner,
  }
}
</script>

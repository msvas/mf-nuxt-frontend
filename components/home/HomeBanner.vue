<template>
  <div :class="this.mobileBrowser ? 'mf-home-banner-mobile':'mf-home-banner-desktop' ">
    <div class="card" :class="this.mobileBrowser ? 'card-position-mobile':'card-position-desktop' ">
      <h1 class="p-1" :class="this.mobileBrowser ? 'banner-card-title-mobile' : 'banner-card-title-desktop' " >Veja os <br> preços de <br> diversas <br> distribuidoras</h1>
      <h2 class="p-1" :class="this.mobileBrowser ? 'banner-card-subtitle-mobile' : 'banner-card-subtitle-desktop' ">Economize <br> tempo e dinheiro</h2>
    </div>
  </div>
</template>
<style>
    .mf-home-banner-desktop{
        background: url('../../assets//images/mf-home-banner.png');
        background-size: cover;
        background-position: 0 40%;
        background-repeat: no-repeat;
        width: -webkit-fill-available;
        position: relative;
        top: -25px;
        height: 75vh;

    }
    .mf-home-banner-mobile{
        background: url(/img/mf-home-banner.b6938550.png);
        background-size: cover;
        background-position: 80% 40%;
        background-repeat: no-repeat;
        width: -webkit-fill-available;
        position: relative;
        top: -25px;
        height: 350px;
    }
    .card-position-desktop{
        width: 30%;
        top: 10%;
        left: 5%;
        height: 80%;
        background: #0cb695;
        justify-content: center;
    }
    .card-position-mobile{
        width: 65%;
        top: 70%;
        left: 5%;
        height: 65%;
        background: white;
        justify-content: center;
    }
    .banner-card-title-desktop{
        font-size: 3.5rem;
        color: white;
        font-weight: bolder;
    }
    .banner-card-title-mobile{
        color: #625050;
        font-weight: bolder;
        font-size: 1.7rem;
    }
    .banner-card-subtitle-desktop{
        color: #625050;
        font-size: 2.3rem;
    }
    .banner-card-subtitle-mobile{
        color: #0cb695;
        font-size: 1.4rem;
    }
</style>
<script>
export default {
    data() {
        return {
            mobileBrowser: false,
        }
    },
    mounted(){
        this.isMobile()
    },
    methods:{
        isMobile() {
            if (screen.width <= 760 || window.innerWidth <= 760) {
                this.mobileBrowser = true;
            } else {
                this.mobileBrowser = false;
            }
        }
    }
}
</script>

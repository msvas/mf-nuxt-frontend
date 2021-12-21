<template>
  <div>
    <vs-dropdown vs-custom-content vs-trigger-click>
      <div v-if="mobileBrowser">
        <i class="feather icon-log-in" style="color: grey; font-size 2rem; margin-right: 5px;" />
        <i class="feather icon-chevron-down" style="color: grey;"  />
      </div>
      <div v-else>
        <a style="color: grey; margin-left: 5px;">
          {{ linkText }}
        </a>
        <i class="feather icon-chevron-down" style="color: grey;"  />
      </div>

      <vs-dropdown-menu :style="customWidth">
        <div class="m-1 pb-1" v-if="showRegionAlert">
          <h5>Atenção!</h5>
          <p>
            O CEP e/ou tipo de pessoa que você definiu anteriormente é diferente no seu cadastro.
            Então, ao fazer login, você perderá a cotação que já possa ter iniciado.
          </p>
        </div>
        <form @submit.prevent="submit" class="mt-1 ml-1 mr-1">
          <fieldset class="form-label-group form-group position-relative has-icon-left">
            <input
              v-model="user.email"
              v-validate="'required|email'"
              name="email"
              type="text"
              class="form-control"
              id="user-email"
              placeholder="Email"
              @change="checkRegion"
              required
            />

            <span
              class="text-danger text-sm"
              v-show="errors.has('email')"
            >{{ errors.first('email') }}</span>
            <div class="form-control-position">
              <i class="feather icon-mail"></i>
            </div>
            <label for="user-email">Email</label>
          </fieldset>

          <fieldset class="form-label-group position-relative has-icon-left">
            <input
              v-model="user.password"
              v-validate="'required'"
              name="password"
              type="password"
              class="form-control"
              id="user-password"
              placeholder="Senha"
              required
            />
            <span
              class="text-danger text-sm"
              v-show="errors.has('password')"
            >{{ errors.first('password') }}</span>
            <div class="form-control-position">
              <i class="feather icon-lock"></i>
            </div>
            <label for="user-password">Senha</label>
          </fieldset>

          <span class="text-danger text-sm" v-if="error">
            <ul>
              <li v-for="er in error" :key="er">{{er}}</li>
            </ul>
          </span>

          <div class="form-group d-flex justify-content-between align-items-center">
            <div class="text-left">
              <a
                href="javascript:void(0)"
                class="card-link"
                @click="openForgotPassword"
              >Esqueceu a senha?</a>
            </div>
            <div class="text-right">
              <button type="submit" class="btn btn-primary float-left btn-inline text-bold-600" style="width: 150px; height: 39px; background: linear-gradient(45deg, rgba(3,145,209,1) 50%, rgba(5,242,240,1) 100%); font-weight:800;">
                <b-spinner v-if="isLoading" small/>
                <span v-else>Fazer login</span>
              </button>
            </div>
          </div>
          <vs-divider></vs-divider>
          <div style="display:flex; flex-direction: column;">
            <span>Ainda não tem conta de usuário?</span>
            <a href="/cadastro">Fazer cadastro grátis</a>
          </div>
        </form>
      </vs-dropdown-menu>
    </vs-dropdown>
    <forgot-password-modal :openPopup="openForgot" @update-modal="updateForgotPassword"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ClientService from '@/services/clients'
import ClientProductQuoteCartService from '@/services/productQuoteCart'
import ForgotPasswordModal from "@/components/login/ForgotPasswordModal"

export default {
  name: "LoginDropdown",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      showRegionAlert: false,
      error: null,
      activeAlert: false,
      openForgot: false,
      isLoading: false,
      mobileBrowser: false,
    };
  },
  computed: {
    ...mapGetters('navigationFilters', ['params']),
    customWidth() {
      if(this.mobileBrowser)
        return 'width: 250px;'
      else
        return 'width: 400px;'
    }
  },

  methods: {
    openForgotPassword() {
      this.openForgot = true
    },
    updateForgotPassword(value) {
      this.openForgot = value
    },
    checkRegion() {
      ClientService.getTypeAndRegion(this.user.email).then((response) => {
        this.showRegionAlert = false

        if(this.params.region_id && this.params.region_id !='null' && (response.data.region_id != this.params.region_id))
          this.showRegionAlert = true

        if(this.params.serves_type && this.params.serves_type !='null' && (response.data.serves_type != this.params.serves_type))
          this.showRegionAlert = true
      })
    },
    submit() {
      this.isLoading = true;
      this.$validator.validateAll().then((result) => {
        if(this.showRegionAlert)
          ClientProductQuoteCartService.clearQuoteCart()
        if (result) {
          if(this.redirectObject) {
            this.$auth.loginWith('local', { data: this.user }).then((response) => {
              this.$auth.fetchUser().then(() => {
                this.$auth.$storage.setUniversal('user', this.$auth.user, true)
                this.setUser(this.$auth.user)
                this.isLoading = false
                this.clearFilterParams()
              })
            }).catch((error) => {
               setTimeout(() => {
                this.isLoading = false;
                const { errors } = error.response.data;
                this.error = errors
                  ? errors
                  : ["Não foi possível se conectar ao Meu Fornecedor."];

                this.activeAlert = true;
                }, 300);

            });
          } else {
            this.$auth.loginWith('local', { data: this.user }).then((response) => {
              this.$auth.fetchUser().then(() => {
                this.$auth.$storage.setUniversal('user', this.$auth.user, true)
              })
            }).catch((error) => {
               setTimeout(() => {
                this.isLoading = false;
                const { errors } = error.response.data;
                this.error = errors
                  ? errors
                  : ["Não foi possível se conectar ao Meu Fornecedor."];

                this.activeAlert = true;
                }, 300);
            });
          }
        }

      });

    },

    ...mapActions("users", ["setUser"]),
    ...mapActions("navigationFilters", ["clearFilterParams"]),
  },
  props: {
    linkText: {
      type: String,
      required: true
    },
    redirectObject: {
      type: Object
    },
    btnStyle: {
      type: String
    }
  },
  components: {
    ForgotPasswordModal
  },
};
</script>

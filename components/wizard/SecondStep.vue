<template>
  <form data-vv-scope="step-2">
    <fieldset class="p-0">
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>Qual é o seu nome?</label>
            <input
              v-model="user.contactName"
              v-validate="'required'"
              data-vv-name="contact_name"
              placeholder="Como você gostaria de ser chamado?"
              type="text"
              class="form-control required"
            />
            <label
              v-show="errors.has('step-2.contact_name')"
              class="danger"
            >{{ errors.first('step-2.contact_name') }}</label>
          </div>
        </div>

        <b-container class="col-12">
          <b-row>
            <b-col cols="4">
              <label>Qual seu telefone?</label>
              <input
                v-model="user.phone"
                v-validate="{ required: true, min: 14, max: 15 }"
                data-vv-name="phone"
                v-mask="['(##) ####-####', '(##) #####-####']"
                name="phone"
                placeholder="De preferência do comprador"
                type="text"
                class="form-control required"
              />
              <label
                v-show="errors.has('step-2.phone')"
                class="danger"
              >{{ errors.first('step-2.phone') }}</label>
            </b-col>
            <b-col cols="8" align-self="center">
              <b-row>
                <b-col cols="4">
                  <label>É Whatsapp?</label>
                </b-col>
                <b-col cols="3">
                  <input type="radio" v-model="user.phoneType" id="one" data-vv-name="phone_type" value='Telefone e Whatsapp'>
                  <label for="one">Sim</label>
                </b-col>
                <b-col cols="3">
                  <input type="radio" v-model="user.phoneType" id="two" data-vv-name="phone_type" value='Telefone'>
                  <label for="two">Não</label>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </fieldset>
  </form>
</template>

<script>
import { mask } from "vue-the-mask";

import stepValidation from "@/mixins/stepValidation";

export default {
  data() {
    return {
      isWhatsappRadio: 'true'
    };
  },
  methods: {
  isWhatsapp(){
      this.user.phoneType = this.isWhatsapp ? '2' : '1'
    }
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  directives: {
    mask
  },
  mixins: [stepValidation]
};
</script>

<template>
  <form
    class="card auth-card"
    @submit.prevent="submitHandler"
  >
    <div class="card-content">
      <span class="card-title">{{ 'CRM_Title' | localize }}</span>

      <div class="input-field">
        <i class="material-icons prefix">content_paste</i>
        <input
          id="name"
          v-model.trim="name"
          type="text"
          :class="{ invalid: $v.name.$dirty && !$v.name.required }"
        >
        <label for="name">{{ 'Name' | localize }}</label>
        <small
          v-if="$v.name.$dirty && !$v.name.required"
          class="helper-text invalid"
        >{{ 'Message_EnterName' | localize
        }}</small>
      </div>

      <div class="input-field">
        <i class="material-icons prefix">contact_mail</i>
        <input
          id="email"
          v-model.trim="email"
          type="text"
          :class="{ invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email) }"
        >
        <label for="email">Email</label>
        <small
          v-if="$v.email.$dirty && !$v.email.required"
          class="helper-text invalid"
        >{{ 'Message_EmailRequired' |
          localize
        }}</small>
        <small
          v-else-if="$v.email.$dirty && !$v.email.email"
          class="helper-text invalid"
        >{{ 'Message_EmailValid' |
          localize
        }}</small>
      </div>

      <div class="row">
        <div class="input-field col s6">
          <div class="input-field">
            <i class="material-icons prefix">assignment_ind</i>
            <input
              id="idCard"
              v-model.trim="idCard"
              type="number"
              :class="{ invalid: ($v.idCard.$dirty && !$v.idCard.required) || ($v.idCard.$dirty && !$v.idCard.numeric) || ($v.idCard.$dirty && !$v.idCard.minLength) || ($v.idCard.$dirty && !$v.idCard.maxLength) }"
            >
            <label for="idCard">ID</label>
            <small
              v-if="$v.idCard.$dirty && !$v.idCard.required"
              class="helper-text invalid"
            >{{ 'Message_IdRequired' |
              localize
            }}</small>
            <small
              v-else-if="($v.idCard.$dirty && (!$v.idCard.minLength || !$v.idCard.maxLength))"
              class="helper-text invalid"
            >{{
              'Message_IdValid' |
                localize
            }}</small>
          </div>
        </div>

        <div class="input-field col s6">
          <div class="input-field">
            <i class="material-icons prefix">phone</i>
            <input
              id="tel"
              v-model.trim="tel"
              type="number"
              :class="{ invalid: ($v.tel.$dirty && !$v.tel.required) || ($v.tel.$dirty && !$v.tel.numeric) || ($v.tel.$dirty && !$v.tel.minLength) || ($v.tel.$dirty && !$v.tel.maxLength) }"
            >
            <label for="tel">Tel.</label>
            <small
              v-if="$v.tel.$dirty && !$v.tel.required"
              class="helper-text invalid"
            >{{ 'Message_TelRequired' |
              localize
            }}</small>
            <small
              v-else-if="($v.tel.$dirty && (!$v.tel.minLength || !$v.tel.maxLength))"
              class="helper-text invalid"
            >{{
              'Message_IdValid' |
                localize
            }}</small>
          </div>
        </div>
      </div>

      <div class="input-field">
        <input
          id="password"
          v-model.trim="password"
          type="password"
          :class="{ invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength) }"
        >
        <label for="password">{{ 'Password' | localize }}</label>
        <small
          v-if="$v.password.$dirty && !$v.password.required"
          class="helper-text invalid"
        >{{ 'Message_EnterPassword'
          | localize
        }}</small>
        <small
          v-else-if="$v.password.$dirty && !$v.password.minLength"
          class="helper-text invalid"
        >{{
           'Message_MinLength' | localize
         }}
          {{ $v.password.$params.minLength.min }}</small>
      </div>

      <p>
        <label>
          <input
            v-model="agree"
            type="checkbox"
          >
          <span>{{ 'AcceptRules' | localize }}</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          type="submit"
        >
          {{ 'Register' | localize }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{ 'HasAccount' | localize }}
        <router-link to="/login">
          {{ 'Login' | localize }}
        </router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { email, required, minLength, maxLength, numeric } from 'vuelidate/lib/validators'

export default {
  name: 'RegisterIn',
  metaInfo () {
    return {
      title: this.$title('Register')
    }
  },
  data: () => ({
    name: '',
    idCard: '',
    tel: '',
    email: '',
    password: '',
    agree: false
  }),
  validations: {
    name: { required },
    email: { email, required },
    idCard: { required, numeric, minLength: minLength(9), maxLength: maxLength(12) },
    tel: { required, numeric, minLength: minLength(8), maxLength: maxLength(8) },
    password: { required, minLength: minLength(6) },
    agree: { checked: v => v }
  },
  destroyed () {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  },
  methods: {
    async submitHandler () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      const formData = {
        name: this.name,
        email: this.email,
        idCard: this.idCard,
        tel: this.tel,
        password: this.password
      }
      try {
        await this.$store.dispatch('register', formData)
        this.$router.push('/')
      } catch (e) { }
    }
  }
}
</script>

<template>
  <form
    class="card auth-card"
    @submit.prevent="submitHandler"
  >
    <div class="card-content">
      <span class="card-title">{{ 'CRM_Title' | localize }}</span>
      <div class="input-field">
        <input
          id="email"
          v-model.trim="email"
          type="text"
          :class="{
            invalid:
              ($v.email.$dirty && !$v.email.required) ||
              ($v.email.$dirty && !$v.email.email),
          }"
        >
        <label for="email">Email</label>
        <small
          v-if="$v.email.$dirty && !$v.email.required"
          class="helper-text invalid"
        >{{ 'Message_EmailRequired' | localize }}</small>
        <small
          v-else-if="$v.email.$dirty && !$v.email.email"
          class="helper-text invalid"
        >{{ 'Message_EmailValid' | localize }}</small>
      </div>
      <div class="input-field">
        <input
          id="password"
          v-model.trim="password"
          type="password"
          :class="{
            invalid:
              ($v.password.$dirty && !$v.password.required) ||
              ($v.password.$dirty && !$v.password.minLength),
          }"
        >
        <label for="password">{{ 'Password' | localize }}</label>
        <small
          v-if="$v.password.$dirty && !$v.password.required"
          class="helper-text invalid"
        >{{ 'Message_EnterPassword' | localize }}</small>
        <small
          v-else-if="$v.password.$dirty && !$v.password.minLength"
          class="helper-text invalid"
        >{{ 'Message_MinLength' | localize }}
          {{ $v.password.$params.minLength.min }}</small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          type="submit"
        >
          {{ 'Login' | localize }}
          <i class="material-icons right">send</i>
        </button>

        <!-- 
        <button
          class="btn waves-effect waves-light red auth-reset"
          type="button"
          @click="resetPassword"
        >
          {{ 'Reset Password' | localize }}
          <i class="material-icons">lock_reset</i>
        </button> -->
      </div>

      <!-- Add the reset password link -->
       <p class="center">
        {{ 'NoAccount' | localize }}
        <router-link to="/register">{{ 'Register' | localize }}</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { email, required, minLength } from 'vuelidate/lib/validators'
import messages from '@/utils/messages'
import localizeFilter from '../../filters/localize.filter'
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'LoginIn',
  metaInfo() {
    return {
      title: this.$title('Login'),
    }
  },
  data: () => ({
    email: '',
    password: '',
  }),
  validations: {
    email: { email, required },
    password: { required, minLength: minLength(6) },
  },
  mounted() {
    if (messages[this.$route.query.message]) {
      this.$message(localizeFilter(messages[this.$route.query.message]))
    }
  },
  methods: {
    async resetPassword() {
      try {
        await firebase.auth().sendPasswordResetEmail(this.email)
        // Password reset email sent successfully
        // You can show a success message or redirect the user to a confirmation page
        this.$toast.success('A password reset email has been sent to your email address')
      } catch (error) {
        // An error occurred while sending the password reset email
        // You can show an error message or handle the error as needed
        this.$toast.error(`Error: ${error.message}`)
      }
    },

    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      const formData = {
        email: this.email,
        password: this.password,
      }
      try {
        await this.$store.dispatch('loginIn', formData)
        this.$router.push('/')
      } catch (e) {}
    },
  },
}
</script>

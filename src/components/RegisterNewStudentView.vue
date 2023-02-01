<template>
  <form @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">{{ 'RegisterNewStudentView' | localize }}</span>

      <div class="col s12 m12">
        <div class="row">

          <div class="input-field col s3">
            <i class="material-icons prefix">account_box</i>
            <input id="name" type="text" v-model.trim="name" :class="{ invalid: $v.name.$dirty && !$v.name.required }">
            <label for="name">{{ 'Name' | localize }}</label>
            <small class="helper-text invalid" v-if="$v.name.$dirty && !$v.name.required">{{
              'Message_EnterName' |
                localize
            }}</small>
          </div>

          <div class="input-field col s3">
            <i class="material-icons prefix">assignment_ind</i>
            <input id="idCard" type="number" v-model.trim="idCard"
              :class="{ invalid: ($v.idCard.$dirty && !$v.idCard.required) || ($v.idCard.$dirty && !$v.idCard.numeric) || ($v.idCard.$dirty && !$v.idCard.minLength) || ($v.idCard.$dirty && !$v.idCard.maxLength) }">
            <label for="idCard">ID</label>
            <small class="helper-text invalid" v-if="$v.idCard.$dirty && !$v.idCard.required">{{
              'Message_IdRequired'
                          |
                localize
            }}</small>
            <small class="helper-text invalid"
              v-else-if="($v.idCard.$dirty && (!$v.idCard.minLength || !$v.idCard.maxLength))">{{
                'Message_IdValid' |
                  localize
              }}</small>
          </div>

          <div class="input-field col s3">
            <i class="material-icons prefix">cake</i>
            <input id="birthDate" type="date" v-model.trim="birthDate"
              :class="{ invalid: $v.birthDate.$dirty && !$v.birthDate.required }">
            <label for="birthDate">{{ 'Date_of_birth' | localize }}</label>
            <small class="helper-text invalid" v-if="$v.birthDate.$dirty && !$v.birthDate.required">{{
              'Message_EnterBirthDate' | localize
            }}</small>
          </div>

        </div>
      </div>

      <div class="col s12 m12">
        <div class="row">
          <div class="input-field col s2">
            <select id="gender" type="text" ref="selectGender" v-model.trim="gender" v-bind:disabled="vacationTime"
              :class="{ invalid: ($v.gender.$dirty && !$v.gender.required) }">
              <option value="" disabled selected>{{ 'Choose_gender' | localize }}</option>
              <option value="male">{{ 'male' | localize }}</option>
              <option value="female">{{ 'female' | localize }}</option>
            </select>
            <label for="gender">{{ 'Your_gender' | localize }}</label>
            <small class="helper-text invalid" v-if="$v.gender.$dirty && !$v.gender.required">{{
              'Message_EnterGender' | localize
            }}</small>
          </div>

          <div class="input-field col s2">
            <select id="maritalStatus" type="text" ref="selectMaritalStatus" v-model.trim="maritalStatus"
              v-bind:disabled="vacationTime"
              :class="{ invalid: ($v.maritalStatus.$dirty && !$v.maritalStatus.required) }">
              <option value="" disabled selected>{{ 'Choose_MaritalStatus' | localize }}</option>
              <option value="single">{{ 'single' | localize }}</option>
              <option value="married">{{ 'married' | localize }}</option>
              <option value="divorced">{{ 'divorced' | localize }}</option>
              <option value="union">{{ 'union' | localize }}</option>
              <option value="widowed">{{ 'widowed' | localize }}</option>
              <option value="dating">{{ 'dating' | localize }}</option>
              <option value="other">{{ 'other' | localize }}</option>
            </select>
            <label for="maritalStatus">{{ 'Your_MaritalStatus' | localize }}</label>
            <small class="helper-text invalid" v-if="$v.maritalStatus.$dirty && !$v.maritalStatus.required">{{
              'Message_maritalStatus' | localize
            }}</small>
          </div>

          <div class="input-field col s1">
            <input id="height" type="number" v-model.trim="height" step="0.01"
              :class="{ invalid: ($v.height.$dirty && !$v.height.required) || ($v.height.$dirty && !$v.height.decimal) || ($v.height.$dirty && !$v.height.between) }">
            <label for="height">{{ 'Height' | localize }} ({{ height }}m)</label>
            <small class="helper-text invalid" v-if="$v.height.$dirty && !$v.height.required">{{
              'Message_HeightRequired' | localize
            }}</small>
            <small class="helper-text invalid" v-else-if="($v.height.$dirty && (!$v.height.between))">{{
              'Message_HeightValid' |
                localize
            }}</small>
          </div>

          <div class="input-field col s1">
            <input id="weight" type="number" v-model.trim="weight" step="0.01"
              :class="{ invalid: ($v.weight.$dirty && !$v.weight.required) || ($v.weight.$dirty && !$v.weight.decimal) || ($v.height.$dirty && !$v.weight.between) }">
            <label for="weight">{{ 'Weight' | localize }}({{ weight }}kg)</label>
            <small class="helper-text invalid" v-if="$v.weight.$dirty && !$v.weight.required">{{
              'Message_WeightRequired' |
                localize
            }}</small>
            <small class="helper-text invalid" v-else-if="($v.weight.$dirty && (!$v.weight.between))">{{
              'Message_WeightValid' |
                localize
            }}</small>
          </div>

          <div class="input-field col s3">
            <select id="colorBelt" type="text" ref="selectColorBelt" v-model.trim="colorBelt"
              :class="{ invalid: ($v.colorBelt.$dirty && !$v.colorBelt.required) }">
              <option value="" disabled selected>{{ 'Color_Belt' | localize }}</option>
              <option value="white">{{ 'white' | localize }}</option>
              <option value="yellow">{{ 'yellow' | localize }}</option>
              <option value="yellow_1st_Kup">{{ 'yellow_1st_Kup' | localize }}</option>
              <option value="yellow_2nd_Kup">{{ 'yellow_2nd_Kup' | localize }}</option>
              <option value="green">{{ 'green' | localize }}</option>
              <option value="green_1st_Kup">{{ 'green_1st_Kup' | localize }}</option>
              <option value="green_2nd_Kup">{{ 'green_2nd_Kup' | localize }}</option>
              <option value="blue">{{ 'blue' | localize }}</option>
              <option value="blue_1st_Kup">{{ 'blue_1st_Kup' | localize }}</option>
              <option value="blue_2nd_Kup">{{ 'blue_2nd_Kup' | localize }}</option>
              <option value="red">{{ 'red' | localize }}</option>
              <option value="red_1st_Kup">{{ 'red_1st_Kup' | localize }}</option>
              <option value="red_2nd_Kup">{{ 'red_2nd_Kup' | localize }}</option>
              <option value="red_3st_Kup">{{ 'red_3st_Kup' | localize }}</option>
              <option value="red_po_dan">{{ 'red_po_dan' | localize }}</option>
              <option value="black">{{ 'black' | localize }}</option>
              <option value="black_1st_Dan">{{ 'black_1st_Dan' | localize }}</option>
              <option value="black_2nd_Dan">{{ 'black_2nd_Dan' | localize }}</option>
              <option value="black_3st_Dan">{{ 'black_3st_Dan' | localize }}</option>
              <option value="black_4th_Dan">{{ 'black_4th_Dan' | localize }}</option>
              <option value="black_5th_Dan">{{ 'black_5th_Dan' | localize }}</option>
              <option value="black_6th_Dan">{{ 'black_6th_Dan' | localize }}</option>
              <option value="black_7th_Dan">{{ 'black_7th_Dan' | localize }}</option>
              <option value="black_8th_Dan">{{ 'black_8th_Dan' | localize }}</option>
              <option value="black_9th_Dan">{{ 'black_9th_Dan' | localize }}</option>
              <option value="black_10th_Dan">{{ 'black_10th_Dan' | localize }}</option>
            </select>
            <label for="colorBelt">{{ 'Color_Belt' | localize }}</label>
            <small class="helper-text invalid" v-if="$v.colorBelt.$dirty && !$v.colorBelt.required">{{
              'Message_ColorBeltRequired' | localize
            }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="col s12 m12">
      <div class="row">
        <div class="input-field col s3">
          <i class="material-icons prefix">phone</i>
          <input id="tel" type="number" v-model.trim="tel"
            :class="{ invalid: ($v.tel.$dirty && !$v.tel.required) || ($v.tel.$dirty && !$v.tel.numeric) || ($v.tel.$dirty && !$v.tel.minLength) || ($v.tel.$dirty && !$v.tel.maxLength) }">
          <label for="tel">Tel.</label>
          <small class="helper-text invalid" v-if="$v.tel.$dirty && !$v.tel.required">{{
            'Message_TelRequired' |
              localize
          }}</small>
          <small class="helper-text invalid" v-else-if="($v.tel.$dirty && (!$v.tel.minLength || !$v.tel.maxLength))">{{
            'Message_TelValid' |
              localize
          }}</small>
        </div>
        <div class="input-field col s3">
          <i class="material-icons prefix">email</i>
          <input id="email" type="text" v-model.trim="email"
            :class="{ invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email) }">
          <label for="email">Email</label>
          <small class="helper-text invalid" v-if="$v.email.$dirty && !$v.email.required">{{
            'Message_EmailRequired' |
              localize
          }}</small>
          <small class="helper-text invalid" v-else-if="$v.email.$dirty && !$v.email.email">{{
            'Message_EmailValid' |
              localize
          }}</small>
        </div>
        <div class="input-field col s3">
          <input id="password" type="password" v-model.trim="password"
            :class="{ invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength) }">
          <label for="password">{{ 'Password' | localize }}</label>
          <small class="helper-text invalid" v-if="$v.password.$dirty && !$v.password.required">{{
            'Message_EnterPassword'
                      | localize
          }}</small>
          <small class="helper-text invalid" v-else-if="$v.password.$dirty && !$v.password.minLength">{{
            'Message_MinLength' | localize
          }}
            {{ $v.password.$params.minLength.min }}</small>
        </div>
      </div>
    </div>
    <div class="col s12 m12">

      <div class="input-field col s5">
        <i class="material-icons prefix">date_range</i>

        <input id="dateContract" type="date" v-model.trim="dateContract"
          :class="{ invalid: $v.dateContract.$dirty && !$v.dateContract.required }">
        <label for="dateContract">{{ 'Date_Contract' | localize }}</label>
        <small class="helper-text invalid" v-if="$v.dateContract.$dirty && !$v.dateContract.required">{{
          'Message_EnterDateContract' | localize
        }}</small>
      </div>

      <div class="input-field col s4">
        <input id="monthlyPayment" type="number" v-model.number="monthlyPayment"
          :class="{ invalid: ($v.monthlyPayment.$dirty && !$v.monthlyPayment.required) || ($v.monthlyPayment.$dirty && !$v.monthlyPayment.minValue) }">
        <label for="monthlyPayment">{{ 'Monthly_Payment' | localize }}</label>
        <small
          v-if="(($v.monthlyPayment.$dirty && !$v.monthlyPayment.minValue) || ($v.monthlyPayment.$dirty && !$v.monthlyPayment.required))"
          class="helper-text invalid">{{ 'Minimum_Value' | localize }} {{
            $v.monthlyPayment.$params.minValue.min
          }}</small>
      </div>
      <div class="input-field col s5">
        <i class="material-icons prefix">date_range</i>
        <input id="dateNextPayment" type="date" v-model.trim="dateNextPayment"
          :class="{ invalid: $v.dateNextPayment.$dirty && !$v.dateNextPayment.required }">
        <label for="dateNextPayment">{{ 'Date_next_payment' | localize }}</label>
        <small class="helper-text invalid" v-if="$v.dateNextPayment.$dirty && !$v.dateNextPayment.required">{{
          'Message_EnterDatePayment' | localize
        }}</small>
      </div>

      <div class="input-field col s4">
        <input id="amountFine" type="number" v-model.number="amountFine"
          :class="{ invalid: ($v.amountFine.$dirty && !$v.amountFine.minValue) || ($v.amountFine.$dirty && !$v.amountFine.required) }">
        <label for="amountFine">{{ 'Amount_of_fine' | localize }}</label>
        <small
          v-if="(($v.amountFine.$dirty && !$v.amountFine.minValue) || ($v.amountFine.$dirty && !$v.amountFine.required))"
          class="helper-text invalid">{{ 'Minimum_Value' | localize }} {{
            $v.amountFine.$params.minValue.min
          }}</small>
      </div>
    </div>
    <div class="card-action">
      <div class="row">
        <div class="col s9 m9">
          <button class="btn waves-effect waves-light auth-submit" type="submit">
            {{ 'Register' | localize }}
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>
    </div>

  </form>
</template>

<script>
import { email, required, minLength, maxLength, numeric, between, minValue, decimal } from 'vuelidate/lib/validators'
import localizeFilter from '../../filters/localize.filter'

export default {
  name: 'registerStudentIn',
  data: () => ({
    selectedDate: null,
    name: '',
    email: '',
    idCard: '',
    tel: '',
    height: '',
    weight: '',
    colorBelt: '',
    birthDate: '',
    gender: '',
    password: '',
    dateContract: '',
    dateNextPayment: '',
    monthlyPayment: '',
    amountFine: 0,
    debt: null,
    datepicker: null,
    vacationTime: false,
    maritalStatus: ''
  }),
  validations: {
    name: { required },
    email: { email, required },
    idCard: { required, numeric, minLength: minLength(9), maxLength: maxLength(12) },
    tel: { required, numeric, minLength: minLength(8), maxLength: maxLength(8) },
    height: { required, decimal, between: between(0.80, 2.40) },
    weight: { required, decimal, between: between(19, 300) },
    colorBelt: { required },
    birthDate: { required },
    gender: { required },
    dateContract: { required },
    dateNextPayment: { required },
    monthlyPayment: { required, minValue: minValue(0) },
    amountFine: { required, minValue: minValue(0) },
    password: { required, minLength: minLength(6) },
    maritalStatus: { required }
  },
  methods: {
    handleDateNextPaymentClose (selectedDate) {
      this.dateNextPayment = selectedDate
    },
    async submitHandler () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      const formDataStudent = {
        name: this.name,
        email: this.email,
        idCard: this.idCard,
        tel: this.tel,
        height: this.height,
        weight: this.weight,
        colorBelt: this.colorBelt,
        birthDate: this.birthDate,
        gender: this.gender,
        dateContract: this.dateContract,
        dateNextPayment: this.dateNextPayment,
        monthlyPayment: this.monthlyPayment,
        amountFine: this.amountFine,
        password: this.password,
        debt: this.debt,
        maritalStatus: this.maritalStatus
      }
      try {
        await this.$store.dispatch('registerStudent', formDataStudent)
        this.$message(localizeFilter('Student_HasBeenCreated'))
        this.$router.push('/')
      } catch (e) { }
    }
  },
  mounted () {
    setTimeout(() => {
      this.selectColorBelt = window.M.FormSelect.init(this.$refs.selectColorBelt)
      this.selectGender = window.M.FormSelect.init(this.$refs.selectGender)
      this.selectMaritalStatus = window.M.FormSelect.init(this.$refs.selectMaritalStatus)
      window.M.updateTextFields()
    }, 0)
  },
  destroyed () {
    if (this.select && this.select.destroy) {
      this.select.destroy()
      this.selectDateNextPayment.destroy()
      this.selectDateContract.destroy()
    }
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmitInfo">

    <div class="row">
      <div class="col s12">
        <ul class="tabs" ref="tabsInputStudent">
          <li class="tab col s3"><a href="#basicInfo" class="waves-effect waves-orange pointer">{{
            'Basic_student_information' | localize
          }}</a></li>
          <li class="tab col s3"><a href="#additionalInfo" class="waves-effect waves-orange pointer">{{
            'Additional_information_about_the_student' |
              localize
          }}</a></li>
          <li class="tab col s3"><a href="#mastersConceptInfo" class="waves-effect waves-orange pointer">{{
            'Masters_Concept' |
              localize
          }}</a></li>
          <li class="tab col s3"><a href="#PhotoStudent" class="waves-effect waves-orange pointer">{{
            'PhotoStudent' |
              localize
          }}</a></li>
        </ul>
      </div>
      <div id="basicInfo" class="col s12">
        <div class="card-content">
          <div class="col s12 m12">
            <div class="row">

              <div class="input-field col s4">
                <i class="material-icons prefix">account_box</i>
                <input id="name" type="text" v-model.trim="name" :disabled="vacationTime"
                  :class="{ invalid: $v.name.$dirty && !$v.name.required }">
                <label for="name">{{ 'Name' | localize }} </label>
                <small class="helper-text invalid" v-if="$v.name.$dirty && !$v.name.required">{{
                  'Message_EnterName' |
                    localize
                }}</small>
              </div>

              <div class="input-field col s4">
                <i class="material-icons prefix">assignment_ind</i>
                <input id="idCard" type="number" v-model.trim="idCard" :disabled="vacationTime"
                  :class="{ invalid: ($v.idCard.$dirty && !$v.idCard.required) || ($v.idCard.$dirty && !$v.idCard.numeric) || ($v.idCard.$dirty && !$v.idCard.minLength) || ($v.idCard.$dirty && !$v.idCard.maxLength) }">
                <label for="idCard">{{ 'idCard' | localize }}</label>
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

              <div class="input-field col s4">
                <i class="material-icons prefix">cake</i>
                <input id="birthDate" type="date" v-model.trim="birthDate" :disabled="vacationTime"
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
              <div class="input-field col s3">
                <select id="gender" type="text" ref="selectGender" v-model.trim="gender" :disabled="vacationTime"
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

              <div class="input-field col s2">
                <input id="height" type="number" v-model.trim="height" step="0.01" :disabled="vacationTime"
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

              <div class="input-field col s2">
                <input id="weight" type="number" v-model.trim="weight" step="0.01" :disabled="vacationTime"
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
                  v-bind:disabled="vacationTime" :class="{ invalid: ($v.colorBelt.$dirty && !$v.colorBelt.required) }">
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

          <div class="col s12 m12">
            <div class="input-field col s4">
              <i class="material-icons prefix">phone</i>
              <input id="tel" type="number" v-model.trim="tel" :disabled="vacationTime"
                :class="{ invalid: ($v.tel.$dirty && !$v.tel.required) || ($v.tel.$dirty && !$v.tel.numeric) || ($v.tel.$dirty && !$v.tel.minLength) || ($v.tel.$dirty && !$v.tel.maxLength) }">
              <label for="tel">Tel.</label>
              <small class="helper-text invalid" v-if="$v.tel.$dirty && !$v.tel.required">{{
                'Message_TelRequired' |
                  localize
              }}</small>
              <small class="helper-text invalid"
                v-else-if="($v.tel.$dirty && (!$v.tel.minLength || !$v.tel.maxLength))">{{
                  'Message_TelValid' |
                    localize
                }}</small>
            </div>
            <div class="input-field col s4">
              <i class="material-icons prefix">email</i>
              <input id="email" type="text" v-model.trim="email" :disabled="vacationTime"
                :class="{ invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email) }">
              <label for="email">Email</label>
              <small class="helper-text invalid" v-if="$v.email.$dirty && !$v.email.required">{{
                'Message_EmailRequired'
                              |
                  localize
              }}</small>
              <small class="helper-text invalid" v-else-if="$v.email.$dirty && !$v.email.email">{{
                'Message_EmailValid'
                              |
                  localize
              }}</small>
            </div>
            <div class="input-field col s4">
              <input id="password" type="password" v-model.trim="password" :disabled="vacationTime"
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
            <div class="row">
            </div>
          </div>

          <span class="card-title">{{ 'ContractData' | localize }}</span>
          <div class="col s12 m12">

            <div class="input-field col s3">
              <i class="material-icons prefix">date_range</i>
              <input id="dateContract" type="date" v-model.trim="dateContract" :disabled="vacationTime"
                :class="{ invalid: $v.dateContract.$dirty && !$v.dateContract.required }">
              <label for="dateContract">{{ 'Date_Contract' | localize }}</label>
              <small class="helper-text invalid" v-if="$v.dateContract.$dirty && !$v.dateContract.required">{{
                'Message_EnterDateContract' | localize
              }}</small>
            </div>

            <div class="input-field col s3">
              <input id="monthlyPayment" type="number" v-model.number="monthlyPayment" :disabled="vacationTime"
                :class="{ invalid: ($v.monthlyPayment.$dirty && !$v.monthlyPayment.required) || ($v.monthlyPayment.$dirty && !$v.monthlyPayment.minValue) }">
              <label for="monthlyPayment">{{ 'Monthly_Payment' | localize }}</label>
              <small
                v-if="(($v.monthlyPayment.$dirty && !$v.monthlyPayment.minValue) || ($v.monthlyPayment.$dirty && !$v.monthlyPayment.required))"
                class="helper-text invalid">{{ 'Minimum_Value' | localize }}{{
                  $v.monthlyPayment.$params.minValue.min
                }}</small>
            </div>

            <div class="input-field col s3">
              <i class="material-icons prefix">date_range</i>
              <input id="dateNextPayment" type="date" v-model="dateNextPayment" :disabled="vacationTime"
                :class="{ invalid: $v.dateNextPayment.$dirty && !$v.dateContract.required }">
              <small class="helper-text invalid" v-if="$v.dateNextPayment.$error">{{
                'Message_EnterDatePayment' |
                  localize
              }}</small>
            </div>

            <div class="input-field col s3">
              <input id="amountFine" type="number" v-model.number="amountFine" :disabled="vacationTime"
                :class="{ invalid: ($v.amountFine.$dirty && !$v.amountFine.minValue) || ($v.amountFine.$dirty && !$v.amountFine.required) }">
              <label for="amountFine">{{ 'Amount_of_fine' | localize }}</label>
              <small
                v-if="(($v.amountFine.$dirty && !$v.amountFine.minValue) || ($v.amountFine.$dirty && !$v.amountFine.required))"
                class="helper-text invalid">{{ 'Minimum_Value' | localize }}{{
                  $v.amountFine.$params.minValue.min
                }}</small>
            </div>
          </div>
        </div>
      </div>
      <div id="additionalInfo" class="col s12">
        <div class="card-content">
          <div class="col s12 m12">
            <div class="row">

              <div class="input-field col s4">
                <i class="material-icons prefix">assignment_ind</i>
                <input id="address" type="text" v-model.trim="address" :disabled="vacationTime"
                  :class="{ invalid: $v.address.$dirty && ((!$v.address.minLength) || (!$v.address.maxLength)) }">
                <label for="address">{{ 'address' | localize }}</label>
              </div>

              <div class="input-field col s4">
                <input id="settlement" type="text" v-model.trim="settlement" :disabled="vacationTime"
                  :class="{ invalid: $v.settlement.$dirty && ((!$v.settlement.minLength) || (!$v.settlement.maxLength)) }">
                <label for="settlement">{{ 'settlement' | localize }}</label>
              </div>

              <div class="input-field col s4">
                <input id="province" type="text" v-model.trim="province" :disabled="vacationTime"
                  :class="{ invalid: $v.settlement.$dirty && ((!$v.province.minLength) || (!$v.province.maxLength)) }">
                <label for="province">{{ 'province' | localize }}</label>
              </div>

              <div class="row">
                <form class="col s12">
                  <div class="row">

                    <div class="input-field col s4">
                      <i class="material-icons prefix">clear_all</i>
                      <textarea id="physicalAilments" class="materialize-textarea" data-length="120"
                        :disabled="vacationTime" v-model.trim="physicalAilments"
                        :class="{ invalid: $v.physicalAilments.$dirty && ((!$v.physicalAilments.minLength) || (!$v.physicalAilments.maxLength)) }"></textarea>
                      <label for="physicalAilments">{{ 'physical_Ailments' | localize }}</label>
                    </div>

                    <div class="input-field col s4">
                      <i class="material-icons prefix">clear_all</i>
                      <textarea id="psychologicalStatus" class="materialize-textarea" data-length="120"
                        :disabled="vacationTime" v-model.trim="psychologicalStatus"
                        :class="{ invalid: $v.psychologicalStatus.$dirty && ((!$v.psychologicalStatus.minLength) || (!$v.psychologicalStatus.maxLength)) }"></textarea>
                      <label for="psychologicalStatus">{{ 'psychological_Status' | localize }}</label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="mastersConceptInfo" class="col s12">
        <div class="row">
          <div class="col s12 m5">
            <div class="card-panel teal">
              <span class="white-text">
                <button v-tooltip="'Edit'" class="btn-floating   blue-grey darken-3"
                  @click="$router.push('/master/' + student.id)">
                  <i class="material-icons">create</i>
                </button>
                {{ student.mastersConcept }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div id="PhotoStudent" class="col s8">
        <div class="input-field col s8">
          <div class="row">
            <img ref="photoStudentView" class="materialboxed" width="140" :src="imageSrc" v-if="imageSrc">
            <form action="#">
              <div class="file-field input-field">
                <div class="btn">
                  <i class="material-icons left">attach_file</i>
                  <span>{{ 'choose_student_photo' | localize }}</span>
                  <input ref="fileInput" id="
                  PhotoStudent" :disabled="vacationTime" type="file" accept="image/*" @change="onPhotoChange">
                </div>
                <div class="file-path-wrapper">
                  <input id="inputPhotoStudent" :disabled="vacationTime" class="file-path validate" type="text">
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
    <div class="card-action">
      <div class="row">
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          {{ 'Updating_student_information' | localize }}
          <i class="material-icons right">send</i>
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import { email, required, minLength, maxLength, numeric, between, minValue, decimal } from 'vuelidate/lib/validators'
import localizeFilter from '../../filters/localize.filter'

export default {
  props: {
    vacationTime: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    student: [],
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
    amountFine: null,
    debt: null,
    datepicker: null,
    address: '',
    settlement: '',
    province: '',
    physicalAilments: '',
    psychologicalStatus: '',
    image: null,
    imageSrc: '',
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
    dateNextPayment: {
      required: function () {
        if (this.vacationTime) {
          return true
        }
        return this.dateNextPayment !== ''
      }
    },
    monthlyPayment: { required, minValue: minValue(0) },
    amountFine: { required, minValue: minValue(0) },
    password: { required, minLength: minLength(6) },
    address: { minLength: minLength(0), maxLength: maxLength(30) },
    settlement: { minLength: minLength(0), maxLength: maxLength(20) },
    province: { minLength: minLength(0), maxLength: maxLength(20) },
    physicalAilments: { minLength: minLength(0), maxLength: maxLength(120) },
    psychologicalStatus: { minLength: minLength(0), maxLength: maxLength(120) },
    maritalStatus: {
      required: function () {
        if (this.vacationTime) {
          return true
        }
        return this.maritalStatus !== ''
      }
    }
  },
  async mounted () {
    this.tabsInputStudent = window.M.Tabs.init(this.$refs.tabsInputStudent)
    this.photoStudentView = window.M.Materialbox.init(this.$refs.photoStudentView)
    const id = this.$route.params.id
    this.student = await this.$store.dispatch('fetchStudent', id)
    this.name = this.student.name
    this.password = this.student.password
    this.email = this.student.email
    this.idCard = this.student.idCard
    this.birthDate = this.student.birthDate
    this.gender = this.student.gender
    this.tel = this.student.tel
    this.height = this.student.height
    this.weight = this.student.weight
    this.colorBelt = this.student.colorBelt
    this.dateContract = this.student.dateContract
    this.monthlyPayment = this.student.monthlyPayment
    this.dateNextPayment = this.student.dateNextPayment
    this.amountFine = this.student.amountFine
    this.address = this.student.address
    this.settlement = this.student.settlement
    this.province = this.student.province
    this.physicalAilments = this.student.physicalAilments
    this.psychologicalStatus = this.student.psychologicalStatus
    this.imageSrc = this.student.imageSrc
    this.maritalStatus = this.student.maritalStatus

    this.loading = false
    setTimeout(() => {
      window.M.updateTextFields()
    }, 0)
  },
  updated () {
    this.selectColorBelt = window.M.FormSelect.init(this.$refs.selectColorBelt)
    this.selectGender = window.M.FormSelect.init(this.$refs.selectGender)
    this.selectMaritalStatus = window.M.FormSelect.init(this.$refs.selectMaritalStatus)
  },
  methods: {
    onPhotoChange (event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = e => {
        this.imageSrc = reader.result
      }
      reader.readAsDataURL(file)
      this.image = file
    },
    async handleSubmitInfo () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      if (!this.address) { this.address = '' }
      if (!this.settlement) { this.settlement = '' }
      if (!this.province) { this.province = '' }
      if (!this.physicalAilments) { this.physicalAilments = '' }
      if (!this.psychologicalStatus) { this.psychologicalStatus = '' }
      if (!this.maritalStatus) { this.maritalStatus = '' }
      if (this.vacationTime) { this.dateNextPayment = '' }
      const id = this.$route.params.id
      const image = this.image
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
        address: this.address,
        settlement: this.settlement,
        province: this.province,
        physicalAilments: this.physicalAilments,
        psychologicalStatus: this.psychologicalStatus,
        vacationTime: this.vacationTime,
        maritalStatus: this.maritalStatus
      }
      if (this.image) {
        try {
          await this.$store.dispatch('updateStudentPhoto', {
            id,
            image,
            formDataStudent
          })
          this.$message(localizeFilter('Student_information_updated'))
          this.$router.push('/students')
        } catch (e) { }
      } else {
        try {
          await this.$store.dispatch('updateAllInfoStudent', {
            id,
            formDataStudent
          })
          this.$message(localizeFilter('Student_information_updated'))
          this.$router.push('/students')
        } catch (e) { }
      }
    }
  }
}
</script>

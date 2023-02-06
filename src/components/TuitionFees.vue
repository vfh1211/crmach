<template>
  <LoaderApp v-if="loading" />
  <p class="center" v-else-if="!students.length">
    {{ 'NoStudents' | localize }}.
    <router-link to="/contract">{{ 'AddFirst' | localize }}</router-link>
  </p>
  <form class="form" v-else @submit.prevent="handleSubmit">
    <div class="card-content">
      <div class="col s12 m12">
        <div class="row">

          <div class="input-field">
            <div class="input-field col s12">
              <select ref="select" v-model="current" @change="updateCurrent">
                <option v-for="c in students" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
              <label>{{ 'SelectStudent' | localize }}</label>
            </div>
          </div>

          <div class="col s12 m12 l12">
            <div class="card orange darken-3 bill-card" :class="{ 'blue-grey lighten-5': vacationTime }">
              <div class="card-content white-text">
                <div class="card-header">
                  <span class="card-title">{{ name }}
                    <template v-if="vacationTime">({{
                      'student_break_from_classes' |
                        localize
                    }})</template></span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <td>{{ 'Overdue_debt' | localize }}</td>
                      <td>{{ 'Days_in_arrears' | localize }}</td>
                      <td>{{ 'Pay_by_agreement' | localize }}</td>
                      <td>{{ 'Date_of_payment' | localize }}</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ allDebt | currency }}</td>
                      <td>{{ daysArrears }}</td>
                      <td>{{ monthlyPayment | currency }}</td>
                      <td>{{ dateNextPayment }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="input-field col s6">
        <i class="material-icons prefix">account_balance</i>
        <input id="payment" type="number" v-model.number="payment" :disabled="vacationTime"
          :class="{ invalid: ($v.payment.$dirty && !$v.payment.minValue) || ($v.payment.$dirty && !$v.payment.required) }">
        <label for="payment">{{ 'Payment' | localize }}</label>
        <small class="helper-text invalid"
          v-if="($v.payment.$dirty && !$v.payment.minValue) || ($v.payment.$dirty && !$v.payment.required)">
          {{
            'Minimum_Value' | localize
          }}
          {{ $v.payment.$params.minValue.min }}</small>
      </div>
      <div class="input-field col s6">
        <i class="material-icons prefix">date_range</i>
        <input id="dateNextPayment" type="date" v-model.trim="dateNextPayment" :disabled="vacationTime"
          :class="{ invalid: $v.dateNextPayment.$dirty && !$v.dateNextPayment.required }">
        <label for="dateNextPayment">{{ 'Date_next_payment' | localize }}</label>
        <small class="helper-text invalid" v-if="$v.dateNextPayment.$dirty && !$v.dateNextPayment.required">{{
          'Message_EnterDatePayment' | localize
        }}</small>
      </div>
      <div class="row">
        <div class="col s8 offset-s7"><span class="flow-text">
            <button class="btn waves-effect waves-light" type="submit">
              {{ 'MakePayment' | localize }}
              <i class="material-icons left">send</i>
            </button>
          </span>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'
import localizeFilter from '../../filters/localize.filter'

export default {

  data: () => ({
    daysArrears: null,
    students: [],
    dateNextPayment: '',
    payment: '500',
    loading: true,
    select: null,
    current: null,
    debt: null,
    name: '',
    daysDebt: '',
    allDebt: null,
    temporaryDate: null,
    vacationTime: false
  }),
  props: ['infoStudentId'],
  validations: {
    dateNextPayment: { required },
    payment: { required, minValue: minValue(500) }
  },
  async mounted () {
    this.currentBalance = Number(await this.$store.dispatch('fetchBalance'))
    this.currentBalance = isNaN(this.currentBalance) ? 0 : this.currentBalance
    this.students = await this.$store.dispatch('fetchStudents')
    this.loading = false
    if (this.students.length) {
      this.current = this.students[0].id
    }
  },
  watch: {
    infoStudentId (newValue) {
      this.current = newValue
    },
    current (catId) {
      const { dateNextPayment, payment, name, amountFine, monthlyPayment, vacationTime } = this.students.find(c => c.id === catId)
      this.dateNextPayment = dateNextPayment
      this.amountFine = amountFine
      this.payment = payment
      this.name = name
      this.monthlyPayment = monthlyPayment
      this.vacationTime = vacationTime
      if (Date.parse(dateNextPayment) < (new Date().setHours(0))) {
        this.daysArrears = (Math.ceil(+(((new Date().setHours(0)) - (Date.parse(dateNextPayment))) / 86400000)) - 1)
        this.allDebt = (this.daysArrears * this.amountFine) + monthlyPayment
      } else {
        this.allDebt = null
        this.daysArrears = null
      }
      setTimeout(() => {
        window.M.FormSelect.init(this.$refs.select)
        window.M.updateTextFields()
      }, 0)
    }
  },
  methods: {
    updateCurrent (event) {
      this.current = event.target.value
      window.M.updateTextFields()
    },
    async handleSubmit () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        await this.$store.dispatch('newPayment', {
          studentId: this.current,
          payment: this.payment,
          nameStudent: this.name,
          idAdmin: this.$store.getters.getUid,
          nameAdmin: this.$store.getters.info.name,
          date: new Date().toJSON()
        })
        const paymentStudent =
        {
          fine: this.daysArrears * this.amountFine,
          payment: this.payment,
          date: new Date().toJSON()
        }
        const dateNextPayment = this.dateNextPayment
        const studentId = this.current
        await this.$store.dispatch('newPaymentStudent',
          { studentId, paymentStudent })
        await this.$store.dispatch('updateInfoStudent', { studentId, dateNextPayment })

        const currentBalance = isNaN(Number(this.currentBalance)) ? 0 : Number(this.currentBalance)
        const correctionValue = isNaN(Number(this.payment)) ? 0 : Number(this.payment)
        const balance = currentBalance + correctionValue
        await this.$store.dispatch('updateBalance', balance)
        this.$message(localizeFilter('Payment_has_been_made'))
        this.$router.push('/students')
        this.$v.reset()
      } catch (e) { }
    }
  },
  destroyed () {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>

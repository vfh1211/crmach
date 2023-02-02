<template>
  <div>
    <div class="row">
      <div class="col s12 m12">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title">{{ 'Balance_Sheet' | localize }}</span>
            <h3 class="center-align">
              <span v-if="!balance"> {{ ''}}</span>
              <span v-else> {{ balance | currency }}</span>
            </h3>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col s2 m2">
        <a class="btn-large waves-effect waves-light" @click="updateBalance()">{{
          'Update_balance' |
            localize
        }}</a>
      </div>
      <div class="col s2 m2">
        <a class="btn-large waves-effect waves-light" @click="showModal = true">{{
          'Correct_balance' |
            localize
        }}</a>
        <CorrectBalance v-if="showModal" @close="showModal = false" />
      </div>
      <div class="col s3 m3">
        <a class="btn-large waves-effect waves-light" @click="generatePDF()">{{
          'Download_PDF' |
            localize
        }}</a>
      </div>
    </div>

    <LoaderApp v-if="loading" />
    <table id="table">
      <thead>
        <tr>
          <th @click="sortedPayments('date')" :class="{ 'sort-active': sortBy === 'date' }"><a
              class="waves-effect waves-orange pointer">{{ 'Date_payment' | localize }}</a></th>
          <th @click="sortedPayments('student')" :class="{ 'sort-active': sortBy === 'student' }"><a
              class="waves-effect waves-orange pointer">{{
                'Student' |
                  localize
              }}</a></th>
          <th></th>
          <th>{{ 'Payment_amount' | localize }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="payment of payments" :key="payment.id">
          <td>{{ payment.payment.date | date }}</td>
          <td>{{ payment.payment.nameStudent }}</td>
          <td><button v-tooltip="'OpenStudentFees'" class="btn-floating"
              @click="$router.push('/detail/' + payment.payment.studentId)">
              <i class="material-icons">info_outline</i>
            </button></td>
          <td>{{ payment.payment.payment | currency }}</td>
        </tr>
      </tbody>
    </table>
    <div>

    </div>
  </div>
</template>
<script>
import localizeFilter from '../../filters/localize.filter'
import CorrectBalance from '../components/ModalWindow/CorrectBalance.vue'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import dataFilter from '../../filters/date.filter'

export default {
  name: 'balanceSheet',
  metaInfo () {
    return {
      title: this.$title('Balance_Sheet')
    }
  },
  components: {
    CorrectBalance
  },
  data: () => ({
    showModal: false,
    payments: [],
    balance: 0,
    dataToPdf: [],
    loading: false,
    ascending: true,
    sortBy: ''
  }),
  async mounted () {
    this.balance = await this.$store.dispatch('fetchBalance')
    this.payments = await this.$store.dispatch('fetchPayment')
  },

  methods: {
    openModal () {
      this.showModal = true
    },
    async updateBalance () {
      this.balance = this.payments.reduce((acc, payment) => acc + payment.payment.payment, 0)
      try {
        await this.$store.dispatch('updateBalance', this.balance)
        this.$message(localizeFilter('updateBalance_done'))
      } catch (e) {
        console.error(e)
      }
    },
    generatePDF () {
      const originalDates = this.payments.map(p => p.payment.date)
      const pdf = new JsPDF()
      this.payments.forEach((payment) => {
        payment.payment.date = dataFilter(payment.payment.date)
      })
      pdf.autoTable({
        head: [['Date payment', 'Student', '', 'Payment amount']],
        body: this.payments.map(payment => [payment.payment.date, payment.payment.nameStudent, '', payment.payment.payment])
      })
      pdf.save('table.pdf')
      // revert back to original formatting for table
      this.payments.forEach((payment, i) => {
        payment.payment.date = originalDates[i]
      })
    },
    sortedPayments (sortBy) {
      this.ascending = !this.ascending
      this.payments.sort((a, b) => {
        if (sortBy === 'date') {
          // sort by date
          if (this.ascending) {
            // sort in ascending order
            if (a.payment.date < b.payment.date) return -1
            if (a.payment.date > b.payment.date) return 1
            return 0
          } else {
            // sort in descending order
            if (a.payment.date > b.payment.date) return -1
            if (a.payment.date < b.payment.date) return 1
            return 0
          }
        } else {
          // sort by student name
          if (this.ascending) {
            // sort in ascending order
            if (a.payment.nameStudent < b.payment.nameStudent) return -1
            if (a.payment.nameStudent > b.payment.nameStudent) return 1
            return 0
          } else {
            // sort in descending order
            if (a.payment.nameStudent > b.payment.nameStudent) return -1
            if (a.payment.nameStudent < b.payment.nameStudent) return 1
            return 0
          }
        }
      })
    }
  }
}
</script>

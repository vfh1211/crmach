<template>
  <div>
    <div class="page-title">
      <h3> {{ 'Balance_Sheet' | localize }} </h3>
    </div>

    <a class="waves-effect waves-light btn" @click="generatePDF()">{{ 'Download_PDF' | localize }}</a>

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
  data: () => ({
    payments: [],
    dataToPdf: [],
    loading: false,
    ascending: true,
    sortBy: ''
  }),
  async mounted () {
    this.payments = await this.$store.dispatch('fetchPayment')
  },

  methods: {
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

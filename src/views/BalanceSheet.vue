<template>
  <div>
    <div class="row">
      <div class="col s12 m12">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title">{{ 'Balance_Sheet' | localize }}</span>
            <h3 class="center-align">
              <span v-if="isNaN(balance)" class="default-color"> {{ 0 | currency }} </span>
              <span v-else :style="{ color: balance < 0 ? 'pink' : 'inherit' }"> {{ balance | currency }} </span>
            </h3>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col s2 m2">
        <button class="btn-large waves-effect waves-light" @click="updateParentBalance()"
          :disabled="showModal || noUpdateParentBalance">{{
            'Update_balance' | localize
          }}</button>
      </div>
      <div class="col s2 m2">
        <button class="btn-large waves-effect waves-light" @click="showModal = true" :disabled="showModal">{{
          'Correct_balance' |
            localize
        }}</button>
        <CorrectBalance v-if="showModal" @close="closeModal" @update-balance="updateBalance" />
      </div>
      <div class="col s3 m3">
        <button class="btn-large waves-effect waves-light" @click="$router.push('/record/')" :disabled="showModal">
          {{
            'student_payment' |
              localize
          }}</button>
      </div>
      <div class="col s3 m3">
        <button class="btn-large waves-effect waves-light" @click="generatePDF()" :disabled="showModal">{{
          'Download_PDF' | localize
        }}</button>
      </div>
    </div>

    <LoaderApp v-if="loading" />
    <table id="table">
      <thead>
        <tr>
          <th @click="sortedPayments('date')" :class="{ 'sort-active': sortBy === 'date' }">
            <a class="waves-effect waves-orange pointer">{{ 'Date_payment' | localize }}</a>
          </th>
          <th @click="sortedPayments('paymentAmount')" :class="{ 'sort-active': sortBy === 'paymentAmount' }">
            <a class="waves-effect waves-orange pointer">{{ 'Payment_amount' | localize }}</a>
          </th>
          <th @click="sortedPayments('typePayment')" :class="{ 'sort-active': sortBy === 'typePayment' }">
            <a class="waves-effect waves-orange pointer">{{ 'Type_of_payment' | localize }}</a>
          </th>
          <th @click="sortedPayments('whosePayment')" :class="{ 'sort-active': sortBy === 'whosePayment' }">
            <a class="waves-effect waves-orange pointer">{{ 'Whose_payment' | localize }}</a>
          </th>
          <th @click="sortedPayments('commentary')" :class="{ 'sort-active': sortBy === 'commentary' }">
            <a class="waves-effect waves-orange pointer">{{ 'Commentary' | localize }}</a>
          </th>
          <th @click="sortedPayments('authorRecord')" :class="{ 'sort-active': sortBy === 'authorRecord' }">
            <a class="waves-effect waves-orange pointer">{{ 'author_of_record' | localize }}</a>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="corrected of dataBalance" :key="corrected.id">
          <td>{{ corrected.corrected.date | date }}</td>
          <td :style="{ color: corrected.corrected.correctionValue < 0 ? 'red' : 'inherit' }">
            {{ corrected.corrected.correctionValue | currency }}</td>
          <td>
            <span v-if="corrected.corrected.nameStudent"> {{ 'student_fee'| localize }} </span>
            <span v-else> {{ 'Correct_balance' | localize }} </span>
          </td>
          <td>
            <span v-if="!corrected.corrected.nameStudent" class="default-color"> {{ corrected.corrected.nameAdmin }}
              (Admin)
            </span>
            <span v-else> {{ corrected.corrected.nameStudent }} </span>
          </td>
          <td>{{ corrected.corrected.reasonAdjustment }}</td>
          <td>{{ corrected.corrected.nameAdmin }} </td>
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
    dataBalance: [],
    payments: [],
    balanceAdjustment: [],
    balance: 0,
    sumCorrectionValue: 0,
    dataToPdf: [],
    loading: false,
    ascending: true,
    sortBy: '',
    noUpdateParentBalance: false
  }),
  async mounted () {
    this.balance = await this.$store.dispatch('fetchBalance')
    this.payments = await this.$store.dispatch('fetchPayment')
    this.balanceAdjustment = await this.$store.dispatch('fetchBalanceAdjustment')
    this.dataBalance = await this.$store.dispatch('fetchAllData')
  },

  methods: {
    closeModal () {
      this.showModal = false
    },
    updateBalance (balance) {
      this.balance = balance
      this.showModal = false
      this.noUpdateParentBalance = true
    },
    openModal () {
      this.showModal = true
    },
    async updateParentBalance () {
      this.sumPayments = this.payments.reduce((acc, payment) => acc + payment.payment.payment, 0)
      this.sumCorrectionValue = this.balanceAdjustment.reduce((acc, adjustment) => acc + adjustment.corrected.correctionValue, 0)
      this.balance = this.sumPayments + this.sumCorrectionValue
      try {
        await this.$store.dispatch('updateBalance', this.balance)
        this.$message(localizeFilter('updateBalance_done'))
      } catch (e) {
      }
    },
    sortedPayments (sortBy) {
      this.ascending = (this.sortBy === sortBy) ? !this.ascending : true
      this.sortBy = sortBy
      this.dataBalance.sort((a, b) => {
        if (sortBy === 'date') {
          // sort by date
          if (this.ascending) {
            // sort in ascending order
            if (a.corrected.date < b.corrected.date) return -1
            if (a.corrected.date > b.corrected.date) return 1
            return 0
          } else {
            // sort in descending order
            if (a.corrected.date > b.corrected.date) return -1
            if (a.corrected.date < b.corrected.date) return 1
            return 0
          }
        } else if (sortBy === 'whosePayment') {
          // sort by student name
          if (this.ascending) {
            // sort in ascending order
            if (a.corrected.nameStudent < b.corrected.nameStudent) return -1
            if (a.corrected.nameStudent > b.corrected.nameStudent) return 1
            return 0
          } else {
            // sort in descending order
            if (a.corrected.nameStudent > b.corrected.nameStudent) return -1
            if (a.corrected.nameStudent < b.corrected.nameStudent) return 1
            return 0
          }
        } else if (sortBy === 'paymentAmount') {
          // sort by payment amount
          if (this.ascending) {
            // sort in ascending order
            if (a.corrected.correctionValue < b.corrected.correctionValue) return -1
            if (a.corrected.correctionValue > b.corrected.correctionValue) return 1
            return 0
          } else {
            // sort in descending order
            if (a.corrected.correctionValue > b.corrected.correctionValue) return -1
            if (a.corrected.correctionValue < b.corrected.correctionValue) return 1
            return 0
          }
        } else if (sortBy === 'typePayment') {
          // sort by type of payment
          if (this.ascending) {
            // sort in ascending order
            if (a.corrected.nameStudent && !b.corrected.nameStudent) return -1
            if (!a.corrected.nameStudent && b.corrected.nameStudent) return 1
            return 0
          } else {
            // sort in descending order
            if (!a.corrected.nameStudent && b.corrected.nameStudent) return -1
            if (a.corrected.nameStudent && !b.corrected.nameStudent) return 1
            return 0
          }
        } else if (sortBy === 'commentary') {
          if (this.ascending) {
            if (a.corrected.reasonAdjustment && b.corrected.reasonAdjustment) {
              if (a.corrected.reasonAdjustment < b.corrected.reasonAdjustment) return -1
              if (a.corrected.reasonAdjustment > b.corrected.reasonAdjustment) return 1
            } else if (a.corrected.reasonAdjustment) {
              return -1
            } else if (b.corrected.reasonAdjustment) {
              return 1
            }
            return 0
          } else {
            if (a.corrected.reasonAdjustment && b.corrected.reasonAdjustment) {
              if (a.corrected.reasonAdjustment > b.corrected.reasonAdjustment) return -1
              if (a.corrected.reasonAdjustment < b.corrected.reasonAdjustment) return 1
            } else if (a.corrected.reasonAdjustment) {
              return -1
            } else if (b.corrected.reasonAdjustment) {
              return 1
            }
            return 0
          }
        } else if (sortBy === 'authorRecord') {
          if (this.ascending) {
            if (a.corrected.nameAdmin && b.corrected.nameAdmin) {
              if (a.corrected.nameAdmin < b.corrected.nameAdmin) return -1
              if (a.corrected.nameAdmin > b.corrected.nameAdmin) return 1
            } else if (a.corrected.nameAdmin) {
              return -1
            } else if (b.corrected.nameAdmin) {
              return 1
            }
            return 0
          } else {
            if (a.corrected.nameAdmin && b.corrected.nameAdmin) {
              if (a.corrected.nameAdmin > b.corrected.nameAdmin) return -1
              if (a.corrected.nameAdmin < b.corrected.nameAdmin) return 1
            } else if (a.corrected.nameAdmin) {
              return -1
            } else if (b.corrected.nameAdmin) {
              return 1
            }
            return 0
          }
        }
        // add more conditions here for sorting by other columns
        return 0
      })
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
    }
  },
  created () {
    this.$on('update-balance', (balance) => {
      this.updateBalance(balance)
    })
  }
}
</script>

<template>
  <div>
    <div class="row">
      <div class="col s2 m2">
        <label for="start-date">{{ 'From' | localize }}</label>
        <input
          id="start-date"
          v-model="startDate"
          type="date"
        >
      </div>
      <div class="col s2 m2">
        <label for="end-date">{{ 'To' | localize }}</label>
        <input
          id="end-date"
          v-model="endDate"
          type="date"
        >
      </div>
      <div class="col s2 m2 ">
        <label for="end-date">{{ 'Whose_payment' | localize }}</label>
        <input
          v-model="searchWhosePayment"
          type="text"
          :placeholder="'Whose_payment' | localize"
        >
      </div>

      <div class="col s2">
        <button
          v-tooltip="'Reset_filter'"
          class="btn-floating btn waves-effect waves-light red"
          @click="resetFilters"
        >
          <i
            class="material-icons"
          >clear</i>
        </button>
      </div>

      <div class="col s10 m10">
        <button
          class="btn-large waves-effect waves-light"
          @click="generatePDF()"
        >
          {{
            'Download_PDF' | localize
          }}
        </button>
      </div>
    </div>
    <div class="col s12">
      <table class="highlight">
        <thead>
          <tr>
            <th @click="sortBy('corrected.date')">
              <a class="waves-effect waves-orange pointer">{{
                'Date_payment' | localize
              }}</a>
            </th>
            <th @click="sortBy('corrected.correctionValue')">
              <a class="waves-effect waves-orange pointer">{{
                'Payment_amount' | localize
              }}</a>
            </th>
            <th @click="sortBy('corrected.typePayment')">
              <a class="waves-effect waves-orange pointer">{{
                'Type_of_payment' | localize
              }}</a>
            </th>
            <th @click="sortBy('corrected.whosePayment')">
              <a class="waves-effect waves-orange pointer">{{
                'Whose_payment' | localize
              }}</a>
            </th>
            <th @click="sortBy('corrected.reasonAdjustment')">
              <a class="waves-effect waves-orange pointer">{{
                'Commentary' | localize
              }}</a>
            </th>
            <th @click="sortBy('corrected.nameAdmin')">
              <a class="waves-effect waves-orange pointer">{{
                'author_of_record' | localize
              }}</a>
            </th>
          </tr>
        </thead>
        <tbody v-if="dataBalance.length">
          <tr
            v-for="balance in sortedData"
            :key="balance.id"
          >
            <td>{{ balance.corrected.date | date }}</td>
            <td :style="{ color: balance.corrected.correctionValue < 0 ? 'red' : 'inherit' }">
              {{ balance.corrected.correctionValue | currency }}
            </td>
            <td> {{ balance.corrected.typePayment }}</td>
            <td>{{ balance.corrected.whosePayment }}</td>
            <td>{{ balance.corrected.reasonAdjustment }}</td>
            <td>{{ balance.corrected.nameAdmin }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import formatDate from '../../filters/date.filter'
import localizeFilter from '../../filters/localize.filter'
export default {
  name: 'TableBalance',
  data: () => ({
    dataBalance: [],
    startDate: '',
    endDate: '',
    searchTypePayment: '',
    searchWhosePayment: '',
    searchDatePayment: '',
    sortKey: 'corrected.date',
    sortOrder: 'asc',
    ascending: true,
    sortAscending: true,
    loading: true
  }),
  computed: {
    filteredData () {
      const startDate = this.startDate ? new Date(`${this.startDate}T00:00:00.000Z`) : null
      const endDate = this.endDate ? new Date(`${this.endDate}T23:59:59.999Z`) : null

      return this.dataBalance.filter(balance => {
        const date = new Date(balance.corrected.date)
        const isInDateRange = (!startDate || date >= startDate) && (!endDate || date <= endDate)

        return isInDateRange && balance.corrected.whosePayment.toLowerCase().includes(this.searchWhosePayment.toLowerCase())
      })
    },
    sortedData () {
      return _.orderBy(this.filteredData, this.sortKey, this.sortOrder)
    }
  },
  watch: {
    dataBalance: {
      deep: true,
      handler () {
        this.loadData()
      }
    }
  },
  mounted () {
    this.loadData()
    this.$root.$on('data-updated', this.loadData)
  },
  methods: {
    resetFilters () {
      this.searchWhosePayment = ''
      this.startDate = null
      this.endDate = null
    },
    loadData () {
      this.loading = true
      this.$store.dispatch('fetchAllData').then(dataBalance => {
        this.dataBalance = dataBalance.map(balance => {
          balance.corrected.typePayment = localizeFilter(balance.corrected.nameStudent ? 'student_fee' : 'Correct_balance')
          balance.corrected.whosePayment = balance.corrected.nameStudent ? balance.corrected.nameStudent : balance.corrected.nameAdmin + ' (Admin)'
          return balance
        })
        this.loading = false
      })
    },
    sortBy (key) {
      this.sortKey = key
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
    },
    generatePDF () {
      const originalDates = this.sortedData.map(p => p.corrected.date)
      const pdf = new JsPDF()
      this.sortedData.forEach((balance) => {
        balance.corrected.redactDate = (new Date(balance.corrected.date).toLocaleDateString())
      })
      pdf.autoTable({
        head: [
          [localizeFilter('Date_payment'), localizeFilter('Payment_amount'), localizeFilter('Type_of_payment'), localizeFilter('Whose_payment'), localizeFilter('Commentary'), localizeFilter('author_of_record')]
        ],
        body: this.sortedData.map(balance => [formatDate(balance.corrected.redactDate), balance.corrected.correctionValue, balance.corrected.typePayment, balance.corrected.whosePayment, balance.corrected.reasonAdjustment, balance.corrected.nameAdmin])
      })
      pdf.save('table.pdf')
      this.sortedData.forEach((balance, index) => {
        balance.corrected.date = originalDates[index]
      })
    }
  }
}
</script>

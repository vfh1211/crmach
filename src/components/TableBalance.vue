<template>
  <div>
    <div class="row">
      <div class="col s6 m6">
        <input type="text" v-model="searchWhosePayment" :placeholder="'Whose_payment' | localize" />
      </div>
      <div class="col s10 m10">
        <button class="btn-large waves-effect waves-light" @click="generatePDF()">{{
          'Download_PDF' | localize
        }}</button>
      </div>
    </div>
    <div class="col s12">
      <table class="highlight">
        <thead>
          <tr>
            <th @click="sortBy('corrected.date')"><a class="waves-effect waves-orange pointer">{{
              'Date_payment' | localize
            }}</a></th>
            <th @click="sortBy('corrected.correctionValue')"><a class="waves-effect waves-orange pointer">{{
              'Payment_amount' | localize
            }}</a></th>
            <th @click="sortBy('corrected.typePayment')"><a class="waves-effect waves-orange pointer">{{
              'Type_of_payment' | localize
            }}</a></th>
            <th @click="sortBy('corrected.whosePayment')"><a class="waves-effect waves-orange pointer">{{
              'Whose_payment' | localize
            }}</a></th>
            <th @click="sortBy('corrected.reasonAdjustment')"><a class="waves-effect waves-orange pointer">{{
              'Commentary' | localize
            }}</a></th>
            <th @click="sortBy('corrected.nameAdmin')"><a class="waves-effect waves-orange pointer">{{
              'author_of_record' | localize
            }}</a></th>
          </tr>
        </thead>
        <tbody v-if="dataBalance.length">
          <tr v-for="balance of sortedData" :key="balance.id">
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
    searchTypePayment: '',
    searchWhosePayment: '',
    sortKey: 'corrected.date',
    sortOrder: 'asc',
    ascending: true,
    sortAscending: true,
    loading: true
  }),
  mounted () {
    this.loadData()
    this.$root.$on('data-updated', this.loadData)
  },
  computed: {
    filteredData () {
      return this.dataBalance.filter(balance => balance.corrected.whosePayment.toLowerCase().includes(this.searchWhosePayment.toLowerCase()))
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
  methods: {
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
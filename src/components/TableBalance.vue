<template>
  <div>
    <div class="row">
      <div class="col s4">
        <input type="text" v-model="searchWhosePayment" :placeholder="'Whose_payment' | localize" />
      </div>
      <div class="col s12">
        <table class="highlight">
          <thead>
            <tr>
              <th @click="sortBy('corrected.date')"><a class="waves-effect waves-orange pointer">{{
                'Date_payment' |
                  localize
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
              <td> {{ balance.corrected.typePayment | localize }}</td>
              <td>{{ balance.corrected.whosePayment }}</td>
              <td>{{ balance.corrected.reasonAdjustment }}</td>
              <td>{{ balance.corrected.nameAdmin }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

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

  computed: {
    filteredData () {
      return this.dataBalance.filter(balance => balance.corrected.whosePayment.toLowerCase().includes(this.searchWhosePayment.toLowerCase()))
    },
    sortedData () {
      return _.orderBy(this.filteredData, this.sortKey, this.sortOrder)
    }
  },
  methods: {
    sortBy (key) {
      this.sortKey = key
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
    }
  },
  mounted () {
    this.$store.dispatch('fetchAllData').then(dataBalance => {
      this.dataBalance = dataBalance.map(balance => {
        balance.corrected.typePayment = balance.corrected.nameStudent ? 'student_fee' : 'Correct_balance'
        balance.corrected.whosePayment = balance.corrected.nameStudent ? balance.corrected.nameStudent : balance.corrected.nameAdmin + ' (Admin)'
        return balance
      })
      this.loading = false
    })
  }
}
</script>

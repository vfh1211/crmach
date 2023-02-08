<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Balance_Sheet' | localize }}</h3>
    </div>
    <div class="row">
      <div class="col s4">
        <input type="text" v-model="search" :placeholder="'Whose_payment' | localize" />
      </div>
      <div class="col s12">
        <table class="highlight">
          <thead>
            <tr>
              <th>
                <a class="waves-effect waves-orange pointer" @click="sortBy('corrected.date')">
                  {{ 'Date_payment' | localize }}
                </a>
              </th>
              <th>
                <a class="waves-effect waves-orange pointer" @click="sortBy('corrected.correctionValue')">
                  {{ 'Payment_amount' | localize }}
                </a>
              </th>
              <th>
                <a class="waves-effect waves-orange pointer" @click="sortBy('corrected.typePayment')">
                  {{ 'Type_of_payment' | localize }}
                </a>
              </th>
              <th>
                <a class="waves-effect waves-orange pointer" @click="sortBy('corrected.whosePayment')">
                  {{ 'Whose_payment' | localize }}
                </a>
              </th>
              <th>
                <a class="waves-effect waves-orange pointer" @click="sortBy('corrected.reasonAdjustment')">
                  {{ 'Commentary' | localize }}
                </a>
              </th>
              <th>
                <a class="waves-effect waves-orange pointer" @click="sortBy('corrected.nameAdmin')">
                  {{ 'author_of_record' | localize }}
                </a>
              </th>
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
    search: '',
    ascending: true,
    sortAscending: true,
    loading: true,
    sortKey: 'corrected.date',
    sortOrder: 'asc'
  }),
  computed: {
    sortedData () {
      return _.orderBy(this.dataBalance, this.sortKey, this.sortOrder)
    }
  },
  methods: {
    sortBy (key) {
      this.sortKey = key
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
    }
  },
  async mounted () {
    this.$store.dispatch('fetchAllData').then(dataBalance => {
      this.dataBalance = dataBalance.map(balance => {
        balance.corrected.typePayment = balance.corrected.nameStudent ? 'student_fee' : 'Correct_balance'
        balance.corrected.whosePayment = balance.corrected.nameStudent ? balance.corrected.nameStudent : balance.corrected.nameAdmin + ' (Admin)'
        return balance
      })
      this.loading = false
    })
    await this.$store.dispatch('fetchAllData')
    this.loading = false
  }
}
</script>

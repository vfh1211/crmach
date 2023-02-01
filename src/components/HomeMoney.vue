<template>
  <div class="col s12 m6 l8">
    <div class="card orange darken-3 ">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">{{ 'Payments_today' | localize }}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>{{ 'Amount_of_fines' | localize }}</th>
              <th>{{ 'Amount_of_payments_under_contracts' | localize }}</th>
              <th>{{ 'Total_amount_of_payments' | localize }}</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{{ fines | currency }}</td>
              <td>{{ paymentsContracts | currency }}</td>
              <td>{{ totalPayments | currency }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HomeMoney',
  data: () => ({
    loading: true,
    students: [],
    fines: null,
    paymentsContracts: null,
    debtDay: null,
    totalPayments: null
  }),
  async mounted () {
    const students = await this.$store.dispatch('fetchStudentsDebt')
    for (const student of students) {
      const debtDay = (Math.ceil(+(((new Date().setHours(0)) - (Date.parse(student.dateNextPayment))) / 86400000)) - 1)
      if (debtDay > 0) {
        this.paymentsContracts += student.monthlyPayment
        this.fines += (debtDay * student.amountFine)
        this.totalPayments = this.paymentsContracts + this.fines
      }
      this.studentsNoArrears = students.length - this.studentsArrears
    }
    this.loading = false
  }
}
</script>

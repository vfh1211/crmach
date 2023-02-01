<template>
  <div>
    <LoaderApp v-if="loading" />
    <div class="app-page">
      <div class="row">
        <div class="col s12 m6 l8">

          <div class="card-content black-text">
            <div class="card-header">
              <span class="card-title">{{ student.name }} {{ 'History_of_Payments' | localize }}
                <template v-if="student.vacationTime">({{
                  'student_break_from_classes' |
                    localize
                }})</template></span>
            </div>
            <table>
              <thead>
                <tr>
                  <th @click="sortedPayments('date')"><a class="waves-effect waves-orange pointer">{{
                    'Date_payment' |
                      localize
                  }}</a></th>
                  <th>{{ 'Payment_amount' | localize }}</th>
                  <th>{{ 'Amount_of_penalty_at_the_time_of_payment' | localize }}</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="payments of payments" :key="payments.id">
                  <td>{{ payments.paymentStudent.date | date }}</td>
                  <td>{{ payments.paymentStudent.payment | currency }}</td>
                  <td>{{ payments.paymentStudent.fine | currency }}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
        <div class="col s12 m6 l4">
          <div class="card orange darken-3 bill-card" :class="{ 'blue-grey lighten-5': student.vacationTime }">
            <div class="card-content white-text">
              <span class="card-title">{{ 'Debts_to_date' | localize }}</span>
              <table>

                <thead>
                  <tr>
                    <td>{{ 'Amount_of_fine' | localize }}</td>
                    <td>{{ 'Days_in_arrears' | localize }}</td>
                    <td>{{ 'Pay_by_agreement' | localize }}</td>
                    <td>{{ 'Date_of_payment' | localize }}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ currentFine | currency }}</td>
                    <td>{{ daysArrears }}</td>
                    <td>{{ student.monthlyPayment | currency }}</td>
                    <td>{{ student.dateNextPayment }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="row">
            <div class="col s8 offset-s7"><span class="flow-text">
                <button class="btn waves-effect waves-light" @click="$router.push('/record/')">
                  {{ 'MakePayment' | localize }}
                  <i class="material-icons left">send</i>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'detailView',
  metaInfo () {
    return {
      title: this.$title('Detail_Title')
    }
  },
  data: () => ({
    payments: [],
    student: [],
    daysArrears: null,
    currentFine: null,
    loading: true,
    ascending: true,
    sortBy: ''
  }),
  async mounted () {
    const id = this.$route.params.id
    this.payments = await this.$store.dispatch('fetchStudentsPayId', id)
    this.student = await this.$store.dispatch('fetchStudent', id)
    if (Date.parse(this.student.dateNextPayment) < (new Date().setHours(0))) {
      this.daysArrears = (Math.ceil(+(((new Date().setHours(0)) - (Date.parse(this.student.dateNextPayment))) / 86400000)) - 1)
      this.currentFine = this.daysArrears * this.student.amountFine
    } else {
      this.daysArrears = null
      this.currentFine = null
    }
    this.loading = false
  },
  methods: {
    sortedPayments () {
      this.payments.sort((a, b) => {
        if (this.ascending) {
          if (new Date(a.paymentStudent.date) > new Date(b.paymentStudent.date)) return 1
          if (new Date(a.paymentStudent.date) < new Date(b.paymentStudent.date)) return -1
          return 0
        } else {
          if (new Date(a.paymentStudent.date) < new Date(b.paymentStudent.date)) return 1
          if (new Date(a.paymentStudent.date) > new Date(b.paymentStudent.date)) return -1
          return 0
        }
      })
      this.ascending = !this.ascending
    }
  }
}
</script>

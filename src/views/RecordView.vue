<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Menu_New_Fees' | localize }}</h3>
    </div>
    <section>
      <LoaderApp v-if="loading" />
      <div class="row">
        <div class="col s6">
          <TuitionFees :infoStudentId="selectedStudentId" />
        </div>
        <div class="col s6" offset-s6>
          <table class="highlight">
            <thead>
              <tr>
                <th></th>
                <th @click="sortedPayments('student')" :class="{ 'sort-active': sortBy === 'student' }"><a
                    class="waves-effect waves-orange pointer">{{ 'Student' | localize }}</a></th>
                <th>{{ 'Amount_of_fine' | localize }}</th>
                <th>{{ 'Pay_by_agreement' | localize }}</th>
                <th @click="sortedPayments('date')" :class="{ 'sort-active': sortBy === 'date' }"><a
                    class="waves-effect waves-orange pointer">{{ 'Date_payment' | localize }}</a></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="students of students" :key="students.id"
                v-bind:class="{ 'table-row-selected': students.selected }">
                <td>
                  <button v-tooltip="'Make_a_payment'" class="btn-floating" :class="[students.colorStudent]"
                    @click="showTuitionFees(students)">
                    <i class="material-icons">account_balance</i>
                  </button>
                </td>
                <td>{{ students.name }}</td>
                <td>{{ (Number.isNaN(students.sumDebt) ? 0 : students.sumDebt) | currency }}</td>
                <td>{{ students.monthlyPayment | currency }}</td>
                <td :style="{ color: students.colorStudent }">
                  <span v-if="students.dateNextPayment === ''"> {{ 'student_break_from_classes' | localize }}</span>
                  <span v-else> {{ students.dateNextPayment }}</span>
                </td>
                <td>
                  <button v-tooltip="'OpenStudentFees'" class="btn-small btn"
                    @click="$router.push('/detail/' + students.id)">
                    <i class="material-icons">info_outline</i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import TuitionFees from '@/components/TuitionFees.vue'

export default {
  name: 'contractView',
  metaInfo () {
    return {
      title: this.$title('Menu_New_Fees')
    }
  },
  data: () => ({
    students: [],
    loading: true,
    sortBy: '',
    ascending: true,
    selectedStudentId: null
  }),
  methods: {
    showTuitionFees (students) {
      this.selectedStudentId = students.id
    },
    sortedPayments (sortBy) {
      this.ascending = !this.ascending
      this.students.sort((a, b) => {
        if (sortBy === 'date') {
          // sort by date
          if (this.ascending) {
            // sort in descending order (larger to smaller)
            if (a.dateNextPayment < b.dateNextPayment) return 1
            if (a.dateNextPayment > b.dateNextPayment) return -1
            return 0
          } else {
            // sort in ascending order (smaller to larger)
            if (a.dateNextPayment > b.dateNextPayment) return 1
            if (a.dateNextPayment < b.dateNextPayment) return -1
            return 0
          }
        } else {
          // sort by student name
          if (this.ascending) {
            // sort in descending order (larger to smaller)
            if (a.name < b.name) return 1
            if (a.name > b.name) return -1
            return 0
          } else {
            // sort in ascending order (smaller to larger)
            if (a.name > b.name) return 1
            if (a.name < b.name) return -1
            return 0
          }
        }
      })
    }
  },
  components: {
    TuitionFees
  },
  async mounted () {
    const students = this.students = await this.$store.dispatch('fetchStudents')
    this.students = students.map(studs => {
      const debtDay = (Math.ceil(+(((new Date().setHours(0)) - (Date.parse(studs.dateNextPayment))) / 86400000)) - 1)
      const sumDebt = debtDay < 0 ? '' : debtDay * studs.amountFine
      const colorStudent = debtDay < 0 ? '' : studs.vacationTime ? 'grey' : 'red'
      return {
        ...studs,
        debtDay,
        sumDebt,
        colorStudent
      }
    })
    this.loading = false
  }
}
</script>

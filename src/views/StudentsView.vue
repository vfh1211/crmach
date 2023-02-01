<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Menu_Students' | localize }}</h3>
    </div>
    <div class="row">
      <div class="col s4">
        <input type="text" v-model="search" :placeholder="'Message_EnterName' | localize" />
      </div>
      <div class="col s12">
        <table class="highlight">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th @click="sortBy = 'name'; toggleSortDirection()"><a class="waves-effect waves-orange pointer">{{
                'Student' | localize
              }}</a></th>
              <th @click="sortBy = 'idCard'; toggleSortDirection()"><a class="waves-effect waves-orange pointer">{{
                'idCard' | localize
              }}</a>
              </th>
              <th @click="sortBy = 'birthDate'; toggleSortDirection()"><a class="waves-effect waves-orange pointer">{{
                'Date_of_birth' |
                  localize
              }}</a></th>
              <th @click="sortBy = 'gender'; toggleSortDirection() "><a class="waves-effect waves-orange pointer">{{
                'Gender' | localize
              }}</a>
              </th>
              <th @click="sortBy = 'maritalStatus'; toggleSortDirection() "><a
                  class="waves-effect waves-orange pointer">{{
                    'MaritalStatus' | localize
                  }}</a>
              </th>
              <th @click="sortBy = 'height'; toggleSortDirection()"><a class="waves-effect waves-orange pointer">{{
                'Height' | localize
              }}</a>
              </th>
              <th @click="sortBy = 'weight'; toggleSortDirection()"><a class="waves-effect waves-orange pointer">{{
                'Weight' | localize
              }}</a>
              </th>
              <th @click="sortBy = 'colorBelt'; toggleSortDirection()"><a class="waves-effect waves-orange pointer">{{
                'Color_Belt' | localize
              }}</a></th>
              <th @click="sortBy = 'tel'; toggleSortDirection()"><a class="waves-effect waves-orange pointer">Tel.</a>
              </th>
              <th @click="sortBy = 'email'; toggleSortDirection()"><a
                  class="waves-effect waves-orange pointer">Email</a></th>
              <th @click="sortBy = 'dateContract'; toggleSortDirection()"><a
                  class="waves-effect waves-orange pointer">{{
                    'Date_Contract' |
                      localize
                  }}</a></th>
              <th @click="sortBy = 'monthlyPayment'; toggleSortDirection()"><a
                  class="waves-effect waves-orange pointer">{{
                    'Monthly_Payment' |
                      localize
                  }}</a></th>
              <th @click="sortBy = 'dateNextPayment'; toggleSortDirection()"><a
                  class="waves-effect waves-orange pointer">{{
                    'Date_next_payment' | localize
                  }}</a></th>
              <th @click="sortBy = 'amountFine'; toggleSortDirection()"><a class="waves-effect waves-orange pointer">{{
                'Amount_of_fine' |
                  localize
              }}</a></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="students of filteredStudents" :key="students.id">
              <td>
                <button v-tooltip="'Make_a_payment'" class="btn-floating" :class="[students.colorStudent]"
                  @click="$router.push('/detail/' + students.id)">
                  <i class="material-icons">account_balance</i>
                </button>
              </td>
              <td><button v-tooltip="'OpenInfoStudent'" class="btn-floating"
                  @click="$router.push('/updateStudent/' + students.id)">
                  <i class="material-icons">border_color</i>
                </button></td>
              <td><button v-tooltip="'Masters_Concept'" class="btn-floating blue-grey darken-3"
                  @click="$router.push('/master/' + students.id)">
                  <i class="material-icons">bookmark</i>
                </button></td>
              <td>{{ students.name }}</td>
              <td>{{ students.idCard }}</td>
              <td>{{ students.birthDate }}</td>
              <td>{{ students.gender | localize }}</td>
              <td>
                <span v-if="!students.maritalStatus"> {{ ''}}</span>
                <span v-else> {{ students.maritalStatus | localize }}</span>
              </td>
              <td>{{ students.height }} m</td>
              <td>{{ students.weight }} kg</td>
              <td>{{ students.colorBelt | localize }}</td>
              <td>{{ students.tel }}</td>
              <td>{{ students.email }}</td>
              <td>{{ students.dateContract }}</td>
              <td>{{ students.monthlyPayment | currency }}</td>
              <td :style="{ color: students.colorStudent }">
                <span v-if="students.dateNextPayment === ''"> {{ 'student_break_from_classes' | localize }}</span>
                <span v-else> {{ students.dateNextPayment }}</span>
              </td>
              <td>{{ students.amountFine | currency }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
import { } from 'lodash'

export default {
  name: 'StudentsView',
  metaInfo () {
    return {
      title: this.$title('Menu_Students')
    }
  },
  data: () => ({
    students: [],
    search: '',
    ascending: true,
    sortAscending: true,
    loading: true,
    sortBy: 'name',
    sortDirection: 'asc'
  }),
  async mounted () {
    this.$store.dispatch('fetchStudents').then(students => {
      this.students = students
      this.loading = false
    })
    await this.$store.dispatch('fetchStudents')
    this.loading = false
  },
  computed: {
    filteredStudents () {
      return this.students
        .filter(student => student.name.toLowerCase().includes(this.search.toLowerCase()))
        .sort((a, b) => {
          if (this.sortDirection === 'asc') {
            return a[this.sortBy] > b[this.sortBy] ? 1 : -1
          } else {
            return a[this.sortBy] < b[this.sortBy] ? 1 : -1
          }
        })
        .map(student => {
          const debtDay = (Math.ceil(+(((new Date().setHours(0)) - (Date.parse(student.dateNextPayment))) / 86400000)) - 1)
          const colorStudent = debtDay < 0 ? '' : student.vacationTime ? 'grey' : 'red'
          return {
            ...student,
            colorStudent
          }
        })
    }
  },
  methods: {
    toggleSortDirection () {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
    }
  }
}
</script>

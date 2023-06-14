<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue ">
      <div class="card-content white-text">
        <span class="card-title">{{ 'Students' | localize }}</span>
        <p class="currency-line">
          <span>{{ 'Number_of_active_students' | localize }} <p>{{ activeStudents }}</p></span>
        </p>
        <p class="currency-line">
          <span>{{ 'Number_of_students_with_no_arrears' | localize }} <p>{{ studentsNoArrears }}</p></span>
        </p>
        <p class="currency-line">
          <span>{{ 'Total_students' | localize }} <p>{{ allStudents }}</p></span>
        </p>
        <p class="currency-line">
          <span>{{ 'students_not_attending_classes' | localize }} <p>{{ studentsVacation }}</p></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeStudents',
  data: () => ({
    loading: true,
    students: [],
    activeStudents: null,
    studentsArrears: null,
    studentsNoArrears: null,
    studentsVacation: null,
    debtDay: null,
    allStudents: null
  }),
  async mounted () {
    const students = await this.$store.dispatch('fetchStudentsDebt')
    this.allStudents = students.length
    for (const student of students) {
      const debtDay = (Math.ceil(+(((new Date().setHours(0)) - (Date.parse(student.dateNextPayment))) / 86400000)) - 1)
      if (debtDay > 0) { this.studentsArrears += 1 }
      if (student.vacationTime === true) { this.studentsVacation += 1 }
      this.studentsNoArrears = students.length - this.studentsArrears //- this.studentsVacation
    }

    this.activeStudents = this.allStudents
    for(const student of students) {
      if(student.vacationTime === true){
        this.activeStudents -= 1
      }
    }

    this.loading = false
  }
}
</script>

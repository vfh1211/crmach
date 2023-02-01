<template>
  <div class="app-page">
    <div>
      <LoaderApp v-if="loading" />
      <div v-else class="row">
        <div class="switch">
          <label>
            <input type="checkbox" v-model="vacationTime" @change="updateVacationTime(vacationTime)">
            <span class="lever"></span>
            {{ 'student_break_from_classes' | localize }}
          </label>
        </div>
        <TableStudent :vacationTime="vacationTime" />
        <Update-student :vacationTime="vacationTime" />
      </div>
    </div>
  </div>
</template>
<script>

import TableStudent from '../components/TableStudent.vue'
import UpdateStudent from '../components/UpdateStudent.vue'

export default {
  name: 'UpdateStudentView',
  metaInfo () {
    return {
      title: this.$title('Student_card')
    }
  },
  data: () => ({
    loading: true,
    currency: null,
    vacationTime: false
  }),
  methods: {
    updateVacationTime (vacationTime) {
      this.vacationTime = vacationTime
    }
  },
  async mounted () {
    const id = this.$route.params.id
    this.student = await this.$store.dispatch('fetchStudent', id)
    this.vacationTime = this.student.vacationTime
    this.loading = false
  },
  components: {
    TableStudent,
    UpdateStudent
  }
}
</script>

<template>
  <div class="app-page">
    <div>
      <LoaderApp v-if="loading" />
      <div
        v-else
        class="row"
      >
        <div class="switch">
          <label>
            <input
              v-model="vacationTime"
              type="checkbox"
              @change="updateVacationTime(vacationTime)"
            >
            <span class="lever" />
            {{ 'student_break_from_classes' | localize }}
          </label>
        </div>
        <TableStudent :vacation-time="vacationTime" />
        <Update-student :vacation-time="vacationTime" />
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
  components: {
    TableStudent,
    UpdateStudent
  },
  data: () => ({
    loading: true,
    currency: null,
    vacationTime: false
  }),
  async mounted () {
    const id = this.$route.params.id
    this.student = await this.$store.dispatch('fetchStudent', id)
    this.vacationTime = this.student.vacationTime
    this.loading = false
  },
  methods: {
    updateVacationTime (vacationTime) {
      this.vacationTime = vacationTime
    }
  }
}
</script>

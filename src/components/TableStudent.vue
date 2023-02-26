<template>
  <div class="col s12 m12 l12">
    <div class="card orange darken-3">
      <div class="card-content white-text" :class="{ 'blue-grey': vacationTime }">
        <div class="card-header">
          <div class="col s2">
            <img :src="imageSrc" v-if="imageSrc" class="responsive-img materialboxed" ref="photoStudentView"
              style="width: 120px; height: 120px;">
          </div>
          <span class="card-title">{{ student.name }}
            <template v-if="vacationTime">({{
              'student_break_from_classes' |
              localize
            }})</template></span>
        </div>
        <div class="row">
          <div class="col s12">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>{{ 'Student' | localize }}</th>
                  <th>{{ 'idCard' | localize }}</th>
                  <th>{{ 'Date_of_birth' | localize }}</th>
                  <th>{{ 'MaritalStatus' | localize }}</th>
                  <th>{{ 'Gender' | localize }}</th>
                  <th>{{ 'Height' | localize }}</th>
                  <th>{{ 'Weight' | localize }}</th>
                  <th>{{ 'Color_Belt' | localize }}</th>
                  <th>Tel.</th>
                  <th>Email</th>
                  <th>{{ 'Date_Contract' | localize }}</th>
                  <th>{{ 'Monthly_Payment' | localize }}</th>
                  <th>{{ 'Date_next_payment' | localize }}</th>
                  <th>{{ 'Amount_of_fine' | localize }}</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    <button v-tooltip="'Masters_Concept'" class="btn-floating blue-grey darken-3"
                      @click="$router.push('/master/' + student.id)">
                      <i class="material-icons">bookmark</i>
                    </button>
                  </td>
                  <td>{{ student.name }}</td>
                  <td>{{ student.idCard }}</td>
                  <td>{{ student.birthDate }}</td>
                  <td>
                    <span v-if="!student.maritalStatus"> {{ '' }}</span>
                    <span v-else> {{ student.maritalStatus | localize }}</span>
                  </td>
                  <td>{{ student.gender | localize }}</td>
                  <td>{{ student.height }} m</td>
                  <td>{{ student.weight }} kg</td>
                  <td>{{ student.colorBelt | localize }}</td>
                  <td>{{ student.tel }}</td>
                  <td>{{ student.email }}</td>
                  <td>{{ student.dateContract }}</td>
                  <td>{{ student.monthlyPayment | currency }}</td>
                  <td>{{ student.dateNextPayment }}</td>
                  <td>{{ student.amountFine | currency }}</td>
                  <td> <button v-tooltip="'delete_record'" class="btn-floating pink" @click="delInfoStudent">
                      <i class="material-icons">blur_off</i>
                    </button></td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th>{{ 'age' | localize }}</th>
                  <th>{{ 'Years_of_training' | localize }}</th>
                  <th>{{ 'address' | localize }}</th>
                  <th>{{ 'settlement' | localize }}</th>
                  <th>{{ 'province' | localize }}</th>
                  <th>{{ 'physical_Ailments' | localize }}</th>
                  <th>{{ 'psychological_Status' | localize }}</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>{{ age }}</td>
                  <td>{{ yearsOfTraining }}</td>
                  <td>{{ student.address }}</td>
                  <td>{{ student.settlement }}</td>
                  <td>{{ student.province }}</td>
                  <td>{{ student.physicalAilments }}</td>
                  <td>{{ student.psychologicalStatus }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import localizeFilter from '../../filters/localize.filter'
export default {
  name: 'TableStudent',
  data: () => ({
    loading: true,
    student: [],
    id: null,
    age: null,
    yearsOfTraining: null,
    imageSrc: ''
  }),
  props: ['vacationTime'],
  async mounted () {
    const id = this.$route.params.id
    this.student = await this.$store.dispatch('fetchStudent', id)
    this.age = Math.abs(new Date(Date.now() - (Date.parse(this.student.birthDate))).getUTCFullYear() - 1970)
    this.yearsOfTraining = Math.abs(new Date(Date.now() - (Date.parse(this.student.dateContract))).getUTCFullYear() - 1970)
    this.imageSrc = this.student.imageSrc
    setTimeout(() => {
      this.photoStudentView = window.M.Materialbox.init(this.$refs.photoStudentView)
      window.M.updateTextFields()
    }, 0)
    this.loading = false
  },
  methods: {
    async delInfoStudent () {
      const id = this.$route.params.id

      if (this.student.imageSrc) {
        const imageSrc = this.student.imageSrc
        try {
          await this.$store.dispatch('delAllInfoStudentPhoto', { id, imageSrc })
          this.$message(localizeFilter('student_deleted'))
          this.$router.push('/students')
        } catch (e) { }
      } else {
        try {
          await this.$store.dispatch('delAllInfoStudent', id)
          this.$message(localizeFilter('student_deleted'))
          this.$router.push('/students')
        } catch (e) { }
      }
    }
  }
}
</script>

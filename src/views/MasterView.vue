<template>
  <div>
    <div class="page-title">
      <h3>
        {{ 'Masters_Concept' | localize }} <h5>
          <span class="card-title">{{ student.name }}
            <template v-if="student.vacationTime">({{
              'student_break_from_classes' |
                localize
            }})</template></span>
        </h5>
        <td>
          <button
            v-tooltip="'Make_a_payment'"
            class="btn-floating"
            :class="[colorStudent]"
            @click="$router.push(/detail/ + student.id)"
          >
            <i class="material-icons">account_balance</i>
          </button>
        </td>
        <td>
          <button
            v-tooltip="'OpenInfoStudent'"
            class="btn-floating"
            @click="$router.push('/updateStudent/' + student.id)"
          >
            <i class="material-icons">border_color</i>
          </button>
        </td>
      </h3>
    </div>
    <section>
      <div class="row">
        <div class="col s12 m6">
          <div class="input-field col s12">
            <i class="material-icons prefix">create</i>
            <textarea
              id="mastersConcept"
              v-model.trim="mastersConcept"
              :disabled="!isEdit"
              class="materialize-textarea active"
              style="min-height:360px"
            />
            <label
              for="mastersConcept"
              class="active"
            >{{ 'Masters_Concept' | localize }}</label>
          </div>
        </div>
      </div>
    </section>
    <div class="row">
      <div class="col s7 push-s5">
        <span class="flow-text"><button
          class="btn waves-effect waves-light"
          @click="UpdateInfoMaster"
        >
          {{ 'Update' | localize }}
          <i class="material-icons right">send</i>
        </button></span>
      </div>
      <div class="col s5 pull-s7">
        <span class="flow-text">
          <div class="switch">
            <label>
              <input
                v-model="isEdit"
                type="checkbox"
              >
              <span class="lever" />
              {{ 'allow_editing' | localize }}
            </label>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import localizeFilter from '../../filters/localize.filter'
export default {
  name: 'MasterView',
  metaInfo () {
    return {
      title: this.$title('Master')
    }
  },
  data: () => ({
    loading: true,
    student: [],
    id: null,
    mastersConcept: '',
    isEdit: false,
    colorStudent: ''
  }),
  async mounted () {
    const id = this.$route.params.id
    this.student = await this.$store.dispatch('fetchStudent', id)
    const debtDay = (Math.ceil(+(((new Date().setHours(0)) - (Date.parse(this.student.dateNextPayment))) / 86400000)) - 1)
    this.colorStudent = debtDay < 0 ? '' : this.student.vacationTime ? 'grey' : 'red'
    this.mastersConcept = this.student.mastersConcept
    this.loading = false
    setTimeout(() => {
      window.M.updateTextFields()
    }, 0)
  },
  destroyed () {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  },
  methods: {
    async UpdateInfoMaster () {
      const id = this.$route.params.id
      if (!this.mastersConcept) { this.mastersConcept = '' }
      const formDataStudent = {
        mastersConcept: this.mastersConcept
      }
      try {
        await this.$store.dispatch('updateAllInfoStudent', {
          id,
          formDataStudent
        })
        this.$message(localizeFilter('Student_information_updated'))
        this.$router.push('/students')
      } catch (e) { }
    }
  }
}
</script>

<template>
  <div>
    <div class="modal-overlay" @click="$emit('close')"></div>
    <div class="modal-container">
      <h5 class="modal-header">{{ 'Correct_balance' | localize }}</h5>
      <div class="modal-body">
        <form>
          <div class="input-field">
            <i class="material-icons prefix">create</i>
            <textarea id="reasonAdjustment" class="materialize-textarea active" v-model.trim="reasonAdjustment"
              :class="{ invalid: $v.reasonAdjustment.$dirty && !$v.reasonAdjustment.required }"></textarea>
            <label for="correctionValue">{{ 'Reason_for_adjustment' | localize }}</label>
            <input id="correctionValue" type="number" v-model.trim="correctionValue"
              :class="{ invalid: $v.correctionValue.$dirty && !$v.correctionValue.required }">
          </div>
        </form>
      </div>
      <div class="row">
        <div class="col s10">
          <span class="flow-text">
            <button v-tooltip="'Reduce_the_balance'" class="btn-floating btn-floating waves-effect waves-light"
              @click="reduceBalance"><i class="material-icons">remove</i></button>
            <button v-tooltip="'Increase_the_balance'" class="btn-floating btn-floating waves-effect waves-light"
              @click="increaseBalance"><i class="material-icons">add</i></button>
          </span>
        </div>
        <div class="col s2 offset-s">
          <span class="flow-text">
            <button v-tooltip="'cancellation'" class="btn-floating btn-floating waves-effect waves-light red"
              @click="$emit('close')"><i class="material-icons">close</i></button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import localizeFilter from '../../../filters/localize.filter'
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      info: [],
      correctionValue: 0,
      reasonAdjustment: '',
      nameAdmin: '',
      idAdmin: '',
      date: '',
      initialBalance: 0,
      balance: 0,
      noUpdateParentBalance: false
    }
  },
  async mounted () {
    this.currentBalance = Number(await this.$store.dispatch('fetchBalance'))
    this.currentBalance = isNaN(this.currentBalance) ? 0 : this.currentBalance
    setTimeout(() => {
      window.M.updateTextFields()
    }, 0)
  },
  validations: {
    reasonAdjustment: { required },
    correctionValue: { required }
  },
  methods: {
    async adjustBalance (correction) {
      this.correctionValue = correction * Math.abs(this.correctionValue)
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        this.$store.dispatch('newCorrectBalance',
          {
            idAdmin: this.$store.getters.getUid,
            nameAdmin: this.$store.getters.info.name,
            initialBalance: Number(this.currentBalance),
            correctionValue: Number(this.correctionValue),
            reasonAdjustment: this.reasonAdjustment,
            date: new Date().toJSON()
          })
        const currentBalance = isNaN(Number(this.currentBalance)) ? 0 : Number(this.currentBalance)
        const correctionValue = isNaN(Number(this.correctionValue)) ? 0 : Number(this.correctionValue)
        const balance = currentBalance + correctionValue
        const noUpdateParentBalance = true
        await this.$store.dispatch('updateBalance', balance)
        this.$emit('update-balance', balance, noUpdateParentBalance, 'close')
        this.$message(localizeFilter('correctBalance'))
      } catch (e) {
        this.$emit('close')
      }
    },
    reduceBalance () {
      this.adjustBalance(-1)
    },
    increaseBalance () {
      this.adjustBalance(1)
    }
  }
}
</script>

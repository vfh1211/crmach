<template>
  <div>
    <div class="modal-overlay" @click="$emit('close')"></div>
    <div class="modal-container">
      <h5 class="modal-header">{{ 'Correct_balance' | localize }}</h5>
      <div class="modal-body">
        <form>
          <div class="input-field">
            <input id="balance-amount" type="number" v-model="amount">
            <label for="balance-amount">{{ 'Amount' | localize }}</label>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <a class="btn-small waves-effect waves-light" @click="correctBalance">{{ 'Save' | localize }}</a>
        <a class="btn-small waves-effect waves-light" @click="$emit('close')">{{ 'Cancel' | localize }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import localizeFilter from '../../../filters/localize.filter'
export default {
  data () {
    return {
      amount: 0
    }
  },
  methods: {
    async correctBalance () {
      try {
        const updatedBalance = this.balance + this.amount
        await this.$store.dispatch('correctBalance', updatedBalance)
        this.$emit('close')
        this.$message(localizeFilter('updateBalance_done'))
      } catch (e) {
        this.$emit('close')
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="row">
      <div class="col s12 m12">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title">{{ 'Balance_Sheet' | localize }}</span>
            <h3 class="center-align">
              <span v-if="isNaN(balance)" class="default-color"> {{ 0 | currency }} </span>
              <span v-else :style="{ color: balance < 0 ? 'pink' : 'inherit' }"> {{ balance | currency }} </span>
            </h3>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col s2 m2">
        <button class="btn-large waves-effect waves-light" @click="updateParentBalance()"
          :disabled="showModal || noUpdateParentBalance">{{
            'Update_balance' | localize
          }}</button>
      </div>
      <div class="col s2 m2">
        <button class="btn-large waves-effect waves-light" @click="showModal = true" :disabled="showModal">{{
          'Correct_balance' |
            localize
        }}</button>
        <CorrectBalance v-if="showModal" @close="closeModal" @update-balance="updateBalance" />
      </div>
      <div class="col s3 m3">
        <button class="btn-large waves-effect waves-light" @click="$router.push('/record/')" :disabled="showModal">
          {{
            'student_payment' |
              localize
          }}</button>
      </div>
    </div>

    <LoaderApp v-if="loading" />
    <TableBalance />
    <div>

    </div>
  </div>
</template>
<script>
import TableBalance from '../components/TableBalance.vue'
import localizeFilter from '../../filters/localize.filter'
import CorrectBalance from '../components/ModalWindow/CorrectBalance.vue'
export default {
  name: 'balanceSheet',
  metaInfo () {
    return {
      title: this.$title('Balance_Sheet')
    }
  },
  components: {
    CorrectBalance,
    TableBalance
  },
  data: () => ({
    showModal: false,
    dataBalance: [],
    payments: [],
    balanceAdjustment: [],
    balance: 0,
    sumCorrectionValue: 0,
    dataToPdf: [],
    loading: false,
    ascending: true,
    sortBy: '',
    noUpdateParentBalance: false
  }),
  async mounted () {
    this.balance = await this.$store.dispatch('fetchBalance')
    this.payments = await this.$store.dispatch('fetchPayment')
    this.balanceAdjustment = await this.$store.dispatch('fetchBalanceAdjustment')
    this.dataBalance = await this.$store.dispatch('fetchAllData')
  },
  methods: {
    closeModal () {
      this.showModal = false
    },
    updateBalance (balance) {
      this.balance = balance
      this.showModal = false
      this.noUpdateParentBalance = true
    },
    openModal () {
      this.showModal = true
    },
    async updateParentBalance () {
      this.sumPayments = this.payments.reduce((acc, payment) => acc + payment.payment.payment, 0)
      this.sumCorrectionValue = this.balanceAdjustment.reduce((acc, adjustment) => acc + adjustment.corrected.correctionValue, 0)
      this.balance = this.sumPayments + this.sumCorrectionValue
      try {
        await this.$store.dispatch('updateBalance', this.balance)
        this.$message(localizeFilter('updateBalance_done'))
      } catch (e) {
      }
    },
    created () {
      this.$on('update-balance', (balance) => {
        this.updateBalance(balance)
      })
    }
  }
}
</script>

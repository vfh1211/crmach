<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Contract' | localize }}</h3>
    </div>
    <section>
      <div class="row">
        <RegisterNewStudentView />
      </div>
    </section>
  </div>
</template>

<script>
import RegisterNewStudentView from '@/components/RegisterNewStudentView.vue'

export default {
  name: 'ContractView',
  metaInfo () {
    return {
      title: this.$title('Menu_Contract')
    }
  },
  components: {
    RegisterNewStudentView
  },
  data: () => ({
    loading: true
  })
}
</script>

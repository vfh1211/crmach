<template>

  <div class="app-page">

    <div>
      <div class="page-title">
        <h3>{{ 'CRM_Title' | localize }}</h3>
      </div>
      <LoaderApp v-if="loading" />
      <div v-else class="row">
        <HomeStudents />
        <HomeMoney />
        <img ref="imgProfileView" class="materialboxed" width="940" v-bind:src="info.imageSrc">
      </div>
    </div>
  </div>
</template>

<script>

import HomeStudents from '../components/HomeStudents.vue'
import HomeMoney from '../components/HomeMoney.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'HomeView',
  metaInfo () {
    return {
      title: this.$title('Home')
    }
  },
  data: () => ({
    loading: true,
    currency: null,
    imageSrc: ''
  }),
  async mounted () {
    this.loading = false
    setTimeout(() => {
      this.imgProfileView = window.M.Materialbox.init(this.$refs.imgProfileView)
      window.M.updateTextFields()
    }, 0)
  },
  computed: {
    ...mapGetters(['info'])
  },
  components: {
    HomeStudents,
    HomeMoney
  }
}
</script>

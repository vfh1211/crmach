<template>
  <div>
    <div class="app-main-layout">
      <NavbarApp @click="isOpen = !isOpen" />
      <SidebarApp v-model="isOpen" :key="locale" />

      <main class="app-content" :class="{ full: !isOpen }">
        <div class=" app-page">

          <router-view></router-view>

        </div>
      </main>

      <div class="fixed-action-btn" :key="locale + '1'">
        <router-link class="btn-floating btn-large blue" to="/record" v-tooltip="'CreateNewRecord'">
          <i class="large material-icons">add</i>
        </router-link>
      </div>
    </div>
  </div>

</template>

<script>
import NavbarApp from '@/components/app/NavbarApp.vue'
import SidebarApp from '@/components/app/SidebarApp.vue'
import messages from '@/utils/messages'

export default {
  name: 'main-layout',
  data: () => ({
    isOpen: true
  }),

  async mounted () {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo')
    }
  },
  components: {
    NavbarApp, SidebarApp
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    locale () {
      return this.$store.getters.info.locale
    }
  },
  watch: {
    error (fbError) {
      this.$error(messages[fbError.code] || 'Something_went_wrong')
    }
  }
}
</script>

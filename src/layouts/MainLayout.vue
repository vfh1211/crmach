<template>
  <div>
    <div class="app-main-layout">
      <NavbarApp @click="isOpen = !isOpen" />
      <SidebarApp
        :key="locale"
        v-model="isOpen"
      />

      <main
        class="app-content"
        :class="{ full: !isOpen }"
      >
        <div class=" app-page">
          <router-view />
        </div>
      </main>

      <div
        :key="locale + '1'"
        class="fixed-action-btn"
      >
        <router-link
          v-tooltip="'CreateNewRecord'"
          class="btn-floating btn-large blue"
          to="/record"
        >
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
  name: 'MainLayout',
  components: {
    NavbarApp, SidebarApp
  },
  data: () => ({
    isOpen: true
  }),
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
      this.$error(messages[fbError.code] || 'Error de carga')
    }
  },

  async mounted () {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo')
    }
  }
}
</script>

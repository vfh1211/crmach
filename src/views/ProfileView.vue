<template>
  <div>
    <div class="page-title">
      <h3>{{ 'ProfileTitle' | localize }}</h3>
    </div>

    <div class="row">
      <div class="col s7 push-s5">
        <span class="flow-text">
          <form
            class="form"
            @submit.prevent="submitHandler"
          >
            <div class="input-field">
              <input
                id="description"
                v-model="name"
                type="text"
                :class="{ invalid: $v.name.$dirty && !$v.name.required }"
              >
              <label for="description">{{ 'Name' | localize }}</label>
              <small
                v-if="$v.name.$dirty && !$v.name.required"
                class="helper-text invalid"
              >{{ 'Message_EnterName' |
                localize
              }}</small>
            </div>
            <div class="switch">
              <label>
                English
                <input
                  v-model="isEsLocale"
                  type="checkbox"
                >
                <span class="lever" />
                Español
              </label>
            </div>
            <button
              class="btn waves-effect waves-light"
              type="submit"
            >
              {{ 'Update' | localize }}
              <i class="material-icons right">send</i>
            </button>
          </form>
        </span>
      </div>
      <div class="col s5 pull-s7">
        <span class="flow-text">
          <div
            id="ProfileImg"
            class="col s8"
          >
            <div class="row">
              <img
                v-if="imageSrc"
                ref="imgProfileView"
                class="materialboxed"
                width="340"
                :src="imageSrc"
              >
              <form action="#">
                <div class="file-field input-field">
                  <div class="btn">
                    <i class="material-icons left">attach_file</i>
                    <span>{{ 'Home_page_img' | localize }}</span>
                    <input
                      id="
                  ProfileImg"
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      @change="onPhotoChange"
                    >
                  </div>
                  <div class="file-path-wrapper">
                    <input
                      id="inputProfileImg"
                      class="file-path validate"
                      type="text"
                    >
                  </div>
                </div>
              </form>
            </div>

          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import localizeFilter from '../../filters/localize.filter'
export default {
  metaInfo () {
    return {
      title: this.$title('ProfileTitle')
    }
  },
  data: () => ({
    image: null,
    imageSrc: '',
    name: '',
    metaInfo () {
      return {
        title: this.$title('ProfileTitle')
      }
    },
    isEsLocale: true
  }),
  validations: {
    name: { required }
  },
  mounted () {
    this.name = this.info.name
    this.isEsLocale = this.info.locale === 'es-ES'
    this.imageSrc = this.info.imageSrc
    setTimeout(() => {
      window.M.updateTextFields()
    })
  },
  computed: {
    ...mapGetters(['info'])
  },
  methods: {
    onPhotoChange (event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = e => {
        this.imageSrc = reader.result
      }
      reader.readAsDataURL(file)
      this.image = file
    },
    ...mapActions(['updateInfo']),
    async submitHandler () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        await this.updateInfo({
          name: this.name,
          locale: this.isEsLocale ? 'es-ES' : 'en-US',
          image: this.image
        })
        this.$message(localizeFilter('Profile_information_updated'))
        this.$router.push('/')
      } catch (e) { }
    }
  }
}
</script>

<style scoped>
.switch {
  margin-bottom: 2rem;
}
</style>

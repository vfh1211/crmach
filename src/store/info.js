import firebase from 'firebase/app'

export default {
  state: {
    info: {},
    uid: ''
  },
  mutations: {
    setInfo (state, info) {
      state.info = info
    },
    setUid (state, uid) {
      state.uid = uid
    },
    clearInfo (state) {
      state.info = { locale: state.info.locale }
    }
  },
  actions: {
    async updateInfo ({ dispatch, commit, getters }, toUpdate) {
      try {
        const uid = await dispatch('getUid')
        let updateData = { ...getters.info, ...toUpdate }
        let imageSrc = updateData.imageSrc
        if (updateData.image) {
          const imageExt = updateData.image.name.slice(updateData.image.name.lastIndexOf('.'))
          const fileData = await firebase.storage().ref(`/info/${uid}/${uid}${imageExt}`).put(updateData.image)
          imageSrc = await firebase.storage().ref().child(fileData.ref.fullPath).getDownloadURL()
        }
        updateData = { ...getters.info, ...toUpdate, imageSrc }
        await firebase.database().ref(`/users/${uid}/info`).update(updateData)
        commit('setInfo', updateData)
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchInfo ({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        commit('setUid', uid)
        const info = (await firebase
          .database()
          .ref(`/users/${uid}/info`)
          .once('value')).val()
        commit('setInfo', info)
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  },
  getters: {
    info: s => s.info,
    getUid: s => s.uid
  }
}

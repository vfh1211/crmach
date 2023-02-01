import firebase from 'firebase/app'

export default {
  actions: {
    async fetchStudents ({ commit, dispatch }) {
      try {
        const uid = await dispatch('getUid')
        const students = (await firebase.database().ref(`/users/${uid}/students`).once('value')).val() || {}
        return Object.keys(students).map(key => ({ ...students[key], id: key }))
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },

    async updateInfoStudent ({ dispatch, commit }, { studentId, dateNextPayment }) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database().ref(`/users/${uid}/students`).child(studentId).update({ dateNextPayment })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateAllInfoStudent ({ dispatch, commit }, { id, formDataStudent }) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database().ref(`/users/${uid}/students`).child(id).update({ ...formDataStudent })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateStudentPhoto ({ dispatch, commit }, { id, image, formDataStudent }) {
      try {
        const uid = await dispatch('getUid')
        const imageExt = image.name.slice(image.name.lastIndexOf('.'))
        const fileData = await firebase.storage().ref(`/users/${uid}/students/${id}${imageExt}`).put(image)
        const imageSrc = await firebase.storage().ref().child(fileData.ref.fullPath).getDownloadURL()
        await firebase.database().ref(`/users/${uid}/students/${id}`).update({ ...formDataStudent, imageSrc })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async delAllInfoStudent ({ dispatch, commit }, id) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database().ref(`/users/${uid}/students/`).child(id).remove()
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async delAllInfoStudentPhoto ({ dispatch, commit }, { id, imageSrc }) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database().ref(`/users/${uid}/students/`).child(id).remove()
        if (imageSrc) { await firebase.storage().refFromURL(imageSrc).delete() }
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },

    async fetchStudent ({ dispatch, commit }, id) {
      try {
        const uid = await dispatch('getUid')
        const student = (await firebase.database().ref(`/users/${uid}/students`).child(id).once('value')).val() || {}
        return { ...student, id }
      } catch (e) { commit('setError', e); throw e }
    },

    async registerStudent ({ commit, dispatch }, {
      debt,
      name,
      email,
      idCard,
      tel,
      height,
      weight,
      colorBelt,
      birthDate,
      gender,
      password,
      dateContract,
      dateNextPayment,
      monthlyPayment,
      amountFine,
      maritalStatus
    }) {
      try {
        const uid = await dispatch('getUid')

        await firebase.database().ref(`/users/${uid}/students`).push({
          name,
          email,
          idCard,
          tel,
          height,
          weight,
          colorBelt,
          birthDate,
          gender,
          password,
          dateContract,
          dateNextPayment,
          monthlyPayment,
          amountFine,
          debt,
          maritalStatus
        })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}

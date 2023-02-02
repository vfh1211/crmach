import firebase from 'firebase/app'

export default {

  actions: {

    async fetchBalance ({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        const balance = (await firebase.database().ref(`/users/${uid}/info/balance`).once('value')).val()
        return balance
      } catch (e) { commit('setError', e); throw e }
    },

    async updateBalance ({ dispatch, commit }, balance) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database().ref(`/users/${uid}/info/balance`).set(balance)
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async newPayment ({ dispatch, commit }, payment) {
      try {
        const uid = await dispatch('getUid')
        return await firebase.database().ref(`/users/${uid}/payments`).push({ payment })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchStudentsPayId ({ dispatch, commit }, id) {
      try {
        const uid = await dispatch('getUid')
        const payments = (await firebase.database().ref(`/users/${uid}/students/${id}/studentPayments`).once('value')).val() || {}
        return Object.keys(payments).map(key => ({ ...payments[key], id: key }))
      } catch (e) { commit('setError', e); throw e }
    },

    async fetchStudentsDebt ({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        const studentsDebt = (await firebase.database().ref(`/users/${uid}/students`).once('value')).val() || {}
        return Object.keys(studentsDebt).map(key => ({ ...studentsDebt[key], id: key }))
      } catch (e) { commit('setError', e); throw e }
    },

    async fetchPayment ({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        const payment = (await firebase.database().ref(`/users/${uid}/payments`).once('value')).val() || {}
        return Object.keys(payment).map(key => ({ ...payment[key], id: key }))
      } catch (e) { commit('setError', e); throw e }
    },

    async newPaymentStudent ({ dispatch, commit }, { studentId, paymentStudent }) {
      try {
        const uid = await dispatch('getUid')
        return await firebase.database().ref(`/users/${uid}/students/${studentId}/studentPayments`).push({ paymentStudent })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}

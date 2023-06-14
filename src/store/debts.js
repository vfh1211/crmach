import firebase from 'firebase/app'

export default {
  state: {
    balance: {}
  },
  mutations: {
    updateBalance (state, balance) {
      state.balance = balance
    }
  },
  actions: {

    async fetchPaymentTemp ({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        const payment = (await firebase.database().ref(`/users/${uid}/payments`).once('value')).val() || {}
        return Object.keys(payment).map(key => ({
          id: key,
          corrected: {
            date: payment[key].payment.date,
            nameStudent: payment[key].payment.nameStudent,
            correctionValue: payment[key].payment.payment,
            studentId: payment[key].payment.studentId,
            idAdmin: payment[key].payment.idAdmin,
            nameAdmin: payment[key].payment.nameAdmin
          }
        }))
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchAllData ({ dispatch, commit }) {
      try {
        const paymentData = await dispatch('fetchPaymentTemp')
        const balanceData = await dispatch('fetchBalanceAdjustment')
        return [...paymentData, ...balanceData]
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },

    async fetchBalance ({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        const correctionValueRef = firebase.database().ref(`/users/${uid}/info/balance`)
        return new Promise((resolve, reject) => {
          correctionValueRef.on('value', snapshot => {
            const balance = snapshot.val() || {}
            commit('updateBalance', balance)
            resolve(balance)
          })
        })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateBalance ({ dispatch, commit }, balance) {
      try {
        const uid = await dispatch('getUid')
        return await firebase.database().ref(`/users/${uid}/info/balance`).set(balance)
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },

    async fetchBalanceAdjustment ({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        const balanceAdjustment = (await firebase.database().ref(`/users/${uid}/balanceAdjustment`).once('value')).val() || {}
        return Object.keys(balanceAdjustment).map(key => ({ ...balanceAdjustment[key], id: key }))
      } catch (e) { commit('setError', e); throw e }
    },
    async newCorrectBalance ({ dispatch, commit }, corrected) {
      try {
        const uid = await dispatch('getUid')
        return await firebase.database().ref(`/users/${uid}/balanceAdjustment`).push({ corrected })
        return await newRightBalance
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async newPayment ({ dispatch, commit }, payment) {
      try {
        const uid = await dispatch('getUid')
        return await firebase.database().ref(`/users/${uid}/payments`).child({ payment })
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

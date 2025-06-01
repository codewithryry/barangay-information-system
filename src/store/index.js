import { createStore } from 'vuex'
import { auth } from '@/firebase/config'

export default createStore({
  state: {
    auth: {
      isAuthenticated: false,
      user: null
    },
    notification: {
      message: null,
      type: null
    }
  },
  mutations: {
    setAuth(state, user) {
      state.auth.isAuthenticated = !!user
      state.auth.user = user
    },
    setNotification(state, { message, type }) {
      state.notification.message = message
      state.notification.type = type
    },
    clearNotification(state) {
      state.notification.message = null
      state.notification.type = null
    }
  },
  actions: {
    async fetchUser({ commit }, user) {
      commit('setAuth', user)
    },
    async logout({ commit }) {
      try {
        await auth.signOut()
        commit('setAuth', null)
        commit('setNotification', {
          message: 'Successfully logged out',
          type: 'success'
        })
      } catch (error) {
        commit('setNotification', {
          message: error.message,
          type: 'error'
        })
      }
    }
  }
})
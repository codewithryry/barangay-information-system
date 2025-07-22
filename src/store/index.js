import { createStore } from 'vuex'
import { auth } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

export default createStore({
  state: {
    auth: {
      isAuthenticated: false,
      user: null
    },
    notification: {
      message: null,
      type: null
    },
    system: {
      maintenance: false,
      loading: true
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
    },
    setMaintenance(state, status) {
      state.system.maintenance = status
    },
    setLoading(state, isLoading) {
      state.system.loading = isLoading
    }
  },
  actions: {
    async initializeAuth({ commit }) {
      try {
        commit('setLoading', true)
        await auth.authStateReady()
        const currentUser = auth.currentUser
        
        if (currentUser) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            commit('setAuth', {
              uid: currentUser.uid,
              email: currentUser.email,
              name: userData.name,
              approved: userData.isApproved,
              role: userData.role
            })
          } else {
            await auth.signOut()
            commit('setAuth', null)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        commit('setNotification', {
          message: 'Error initializing authentication',
          type: 'error'
        })
      } finally {
        commit('setLoading', false)
      }
    },
    async checkMaintenanceStatus({ commit }) {
      try {
        const maintenanceDoc = await getDoc(doc(db, 'system', 'maintenance'))
        if (maintenanceDoc.exists()) {
          commit('setMaintenance', maintenanceDoc.data().enabled || false)
        }
      } catch (error) {
        console.error('Maintenance check error:', error)
        commit('setNotification', {
          message: 'Error checking system status',
          type: 'error'
        })
      }
    },
    async fetchUser({ commit }, user) {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            commit('setAuth', {
              uid: user.uid,
              email: user.email,
              name: userData.name,
              approved: userData.isApproved,
              role: userData.role
            })
          }
        } else {
          commit('setAuth', null)
        }
      } catch (error) {
        commit('setNotification', {
          message: error.message,
          type: 'error'
        })
      }
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
  },
  getters: {
    isAdmin(state) {
      return state.auth.user?.role === 'admin'
    },
    isMaintenanceMode(state) {
      return state.system.maintenance
    },
    isLoading(state) {
      return state.system.loading
    },
    isAuthenticated(state) {
      return state.auth.isAuthenticated
    },
    currentUser(state) {
      return state.auth.user
    }
  }
})
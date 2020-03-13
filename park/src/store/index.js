import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters,
  state: {
    userInfo: [],
    roleInfo: []
  },
  mutations: {
    save_userInfo(state, data) {
      state.userInfo = data
    },
    save_role(state, data) {
      state.roleInfo = data
    }
  }
})

export default store

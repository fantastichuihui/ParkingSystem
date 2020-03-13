import Vue from 'vue'
import Vuex from 'vuex'
import storetest from './storetest' // 引入状态管理 store

Vue.use(Vuex) // 使用 vuex

export default new Vuex.Store({
  storetest,
  state: {
    // 初始化状态
    area: ''
  }
})


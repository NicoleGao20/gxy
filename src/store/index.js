import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import Menu from './modules/menu'
import userinfo from './modules/userinfo'
import getters from './getters'
import brand from './modules/brand'
import settings from './modules/settings'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    settings,
    Menu,
    userinfo,
    brand
  },
  getters
})

export default store

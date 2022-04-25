import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import system from './modules/system'
import tagsView from './modules/tagsView'
import getters from './getters'
import customer from './modules/customer'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    system,
    tagsView,
    customer
  },
  getters
})
window.store = store
export default store

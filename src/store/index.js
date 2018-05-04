/**
 * @author jinxl
 * @date 2018/01/16
 * @module vuex
 */
import Vue from 'vue'
import Vuex from 'vuex'
//合同(任务单)
import contract from './modules/contract'
Vue.use(Vuex);


export default new Vuex.Store({
  modules: {
    contract
  }
})

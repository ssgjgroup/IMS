/**
 * @author jinxl
 * @date 2018/01/16
 * @module 合同/任务单
 */
import contract from '../../../api/contract'

const namespaced = true;
const state = {
  initData:{},
  jinxl:"test"
};
const getters = {
};
//同步操作
const mutations = {
  //初始化数据
  ['GET_INIT_DATA'] (state, initData){
    state.initData = initData;
  }
};

//异步操作
const actions = {
  //初始化数据
  getInitData({commit}) {
    return new Promise((resolve, reject) =>{
      contract.getInitData(data =>{
          //业务逻辑
          if(data.type === 'SUCCESS'){
            commit('GET_INIT_DATA', data.data);
            resolve( data.data);
          }else{
            reject(data.message);
          }
        }
      )
    })
  }
  /*getInitData({commit},params) {
    return new Promise((resolve, reject) =>{
      contract.getInitData(params,
        data =>{
          //业务逻辑
          if(data.type === 'SUCCESS'){
            commit('GET_INIT_DATA', data.data);
            resolve( data.data);
          }else{
            console.log('ZYCJ_初始化数据失败');
            reject(data.message);
          }
        }
      )
    })
  }*/
};

export default {
  namespaced,
  state,
  getters,
  mutations ,
  actions
}

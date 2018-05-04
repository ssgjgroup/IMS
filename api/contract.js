/**
 * @author: jinxl
 * @date: 2018/01/16
 * @module:合同/任务单
 */
import api from './api'
export default {
  //获取mock数据
  getInitData(cb){
    return api.get(api.url.contract.initData)
      .then(data =>{
        cb(data);
      })
  },
  //初始化
  getInitDatamock(cb){
    return api.get(api.url.registerCheck.initData)
      .then(data =>{
        cb(data);
      })
  },
  //图像所见提示
  getDes(params,cb){
    return api.post(api.url.registerCheck.getDes,params)
      .then(data =>{
        cb(data);
      })
  }
}

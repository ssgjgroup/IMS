/**
 * @author: jinxl
 * @date: 2018/4/17
 * @module: 过滤器
 * @explain: 对获取内容格式化
 */
let imsFilters = {
  /*字符串格式化*/
  stringFormat:{
    //移除空格
    removeSpace : function (oTarget) {
      return oTarget.replace(/\s+/g, "");
    }
  }
};
export default imsFilters;


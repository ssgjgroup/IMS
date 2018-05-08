/**
 * @author: jinxl
 * @date: 2018/01/16
 * @module: api
 */

const config = require('../config');
const axios = require('axios');

//是否进行本地调试
const debugMod = false;
//是否进行通信加密
const ENCRYPTION_FLAG = false;

//const baseUrl = debugMod ? "http://127.0.0.1:9087/NC/" : "http://172.16.0.129:9078/NC/";
//阿里云
const baseUrl = debugMod ? "http://localhost:8081/ssgjm/" : "http://47.97.170.21:8081/ssgjm/";
const imageUrl = "http://47.97.170.21:8081/";

//公司 /
// const baseUrl = debugMod ? "http://localhost:8081/ssgjm/" : "http://203.110.176.176:8081/ssgjm/";
// const imageUrl = "http://203.110.176.176:8081/";

// 服务器本地  /imsx
// const baseUrl = debugMod ? "http://localhost:8081/ssgjm/" : "http://172.16.0.201:8081/ssgjm/";
// const imageUrl = "http://172.16.0.201:8081/";

const mockUrl = process.env.NODE_ENV === 'production' ?
  config.build.assetsPublicPath + config.build.assetsSubDirectory :
  config.dev.assetsPublicPath + config.dev.assetsSubDirectory;
const successStatus = "success";
const status = {
  success: 'success'
};

const url = {

  menuInfo: {
    initData: baseUrl + 'vue/common/queryCustomerMenu.do'  //查询客户信息和项目信息
  },
  userInfo: {
    initData: baseUrl + 'vue/common/user.do', //查询用户信息包含项目、客户等
    authInfo: baseUrl + 'vue/common/checkAuth.do' //检查用户是否是项目经理
  },
  //登录
  loginInfo: {
    loginUrl: baseUrl + 'vue/login.do', //用户登录
    logoutUrl: baseUrl + 'vue/logout.do' //用户退出
  },
  //首页信息
  projectInfo: {
    initData: baseUrl + 'vue/processManager/info.do',  //用户登录选择项目后首页初始化
    addLastLogin: baseUrl + 'vue/etUserLook/add.do'    //首页选择项目后记录项目选择信息
  },
  //医院科室信息
  deptInfo: {
    initData: baseUrl + 'vue/department/list.do', //加载医院用户信息
    addOrModify: baseUrl + 'vue/department/addOrModify.do', //增加或者修改医院用户信息
    exportExcel: baseUrl + 'vue/department/exportExcel.do', //导出医院用户信息
    uploadFile: baseUrl + 'vue/department/upload.do', //上传医院用户信息
    deleteDept: baseUrl + 'vue/department/delete.do' //上传医院用户信息
  },
  //医院用户信息
  hospitalInfo: {
    initData: baseUrl + 'vue/hospital/list.do', //加载医院用户信息
    addOrModify: baseUrl + 'vue/hospital/addOrModify.do', //增加或者修改医院用户信息
    exportExcel: baseUrl + 'vue/hospital/exportExcel.do', //导出医院用户信息
    uploadFile: baseUrl + 'vue/hospital/upload.do', //上传医院用户信息
    deleteUser: baseUrl + 'vue/hospital/delete.do' //上传医院用户信息
  },
  //项目组信息
  etUserInfo: {
    initData: baseUrl + 'vue/etUserInfo/list.do', //加载数据
    addOrModify: baseUrl + 'vue/etUserInfo/addOrModify.do', //添加或者修改数据
    exportExcel: baseUrl + 'vue/etUserInfo/exportExcel.do', //导出Excel
    uploadFile: baseUrl + 'vue/etUserInfo/upload.do', //上传Excel
    confirm: baseUrl + 'vue/etUserInfo/confirm.do',//删除
    deleteUser: baseUrl + 'vue/etUserInfo/delete.do'  //删除

  },
  //上线支持人员
  etOnlineUserInfo: {
    initData: baseUrl + 'vue/onlineUser/list.do', //加载数据
    addOrModify: baseUrl + 'vue/onlineUser/addOrModify.do', //添加或者修改
    checkWork: baseUrl + 'vue/onlineUser/checkWork.do', //工作完成进度
    exportExcel: baseUrl + 'vue/onlineUser/exportExcel.do', //导出Excel
    uploadFile: baseUrl + 'vue/onlineUser/upload.do', //上传
    deleteUser: baseUrl + 'vue/onlineUser/delete.do', //删除
    confirmUser: baseUrl + 'vue/onlineUser/confirm.do' //确认任务完成
  },
  //客户明细信息
  etCustomerDetail: {
    initData: baseUrl + 'vue/etCustomerDetail/etCustomerDetailFindById.do', //获取客户信息
    initCodes: baseUrl + 'vue/common/getCodes.do', //初始化字典数据
    updateCustomer: baseUrl + 'vue/etCustomerDetail/etCustomerDetailUpdate.do' //更新客户信息
  },
  //合同(任务单)
  contract: {
    initData: baseUrl + 'vue/projectProduct/initData.do', //加载数据
    initProduct: baseUrl + 'vue/projectProduct/queryProduct.do', //查询产品信息
    addOrModifyProduct: baseUrl + 'vue/projectProduct/addOrModifyProduct.do', //添加或者修改数据
    deleteProduct: baseUrl + 'vue/projectProduct/deleteProduct.do', //删除产品
    exportExcel: baseUrl + 'vue/projectProduct/exportExcel.do', //导出Excel
    confirmTask: baseUrl + 'vue/projectProduct/confirm.do' //确认任务完成
  },
  //实施路径信息
  implementationPath: {
    initData: baseUrl + 'vue/implPath/list.do', //加载数据
    exportExcel: baseUrl + 'vue/implPath/exportExcel.do' //导出Excel
  },
  //接口信息
  interfaceInfo: {
    initData: baseUrl + 'vue/interfaceInfo/initData.do',
    addOrModify: baseUrl + 'vue/interfaceInfo/addOrModify.do',
    delete: baseUrl + 'vue/interfaceInfo/delete.do',
    exportExcel: baseUrl + 'vue/interfaceInfo/exportExcel.do'
  },
  //测试硬件
  devEnvHardware: {
    initData: baseUrl + 'vue/devEnvHardware/list.do',
    addOrModify: baseUrl + 'vue/devEnvHardware/addOrModify.do',
    delete: baseUrl + 'vue/devEnvHardware/delete.do',
    exportExcel: baseUrl + 'vue/devEnvHardware/exportExcel.do',
    uploadFile: baseUrl + 'vue/devEnvHardware/upload.do',//上传excel文件入库
  },

  //硬件
  softHardware: {
    initSourceData: baseUrl + 'vue/softHardware/initSourceData.do',//初始化数据源
    initData: baseUrl + 'vue/softHardware/list.do',
    numChange: baseUrl + 'vue/softHardware/numChange.do',//改变数量
    changeScope: baseUrl + 'vue/softHardware/changeScope.do',//修改范围
    changeContent: baseUrl + 'vue/softHardware/changeContent.do',//修改完成情况
    addOrModify: baseUrl + 'vue/softHardware/addOrModify.do',
    delete: baseUrl + 'vue/softHardware/delete.do',
    exportExcel: baseUrl + 'vue/softHardware/exportExcel.do',
    uploadFile: baseUrl + 'vue/softHardware/upload.do',//上传excel文件入库
    doStartConfirm: baseUrl + 'vue/softHardware/doStartConfirm.do',//确定完成
    confirm: baseUrl + 'vue/softHardware/confirm.do'//确定完成
  },
  //检查登记
  registerCheck: {
    tableData: mockUrl + "/mock/initData.json", //获取本地mock数据
    //initData:baseUrl +"getinitdata", //初始化
    initData: mockUrl + '/src/assets/mock/city.json'
  },
  //基础数据维护
  basicData: {
    initData: baseUrl + 'vue/basicData/list.do',//加载基本数据
    detail: baseUrl + 'vue/basicData/detail.do',//获取数据详情
    exportExcel: baseUrl + 'vue/basicData/exportExcel.do',//导出所有基本数据
    uploadFile: baseUrl + 'vue/basicData/upload.do',//上传excel文件入库
    exportDataInfo: baseUrl + 'vue/basicData/exportDataInfo.do',//导出某条基本数据详情
    exportSql: baseUrl + 'vue/basicData/exportSql.do',//导出某条基本数据详情的查询sql文件
    addOrModify: baseUrl + 'vue/basicData/addOrModify.do',//增加或编辑
    confirm: baseUrl + 'vue/basicData/confirm.do'//确定完成
  },
  //基础数据校验
  dataCheck: {
    initSourceData: baseUrl + 'vue/dataCheck/initSourceData.do',//初始化数据源
    initData: baseUrl + 'vue/dataCheck/list.do',//加载基本数据
    detail: baseUrl + 'vue/dataCheck/detail.do',//获取数据详情
    exportModel: baseUrl + 'vue/dataCheck/exportModel.do',//导出所有基本数据
    exportExcel: baseUrl + 'vue/dataCheck/exportExcel.do',//导出所有基本数据
    uploadFile: baseUrl + 'vue/dataCheck/upload.do',//上传excel文件入库
    exportDataInfo: baseUrl + 'vue/dataCheck/exportDataInfo.do',//导出某条基本数据详情
    exportSql: baseUrl + 'vue/dataCheck/exportSql.do',//导出某条基本数据详情的查询sql文件
    addOrModify: baseUrl + 'vue/dataCheck/addOrModify.do',//增加或编辑
    confirm: baseUrl + 'vue/dataCheck/confirm.do'//确定完成
  },
  //易用数据校验
  easyDataCheck: {
    initSourceData: baseUrl + 'vue/easyDataCheck/initSourceData.do',//初始化数据源
    initData: baseUrl + 'vue/easyDataCheck/list.do',//加载易用校验数据
    detail: baseUrl + 'vue/easyDataCheck/detail.do',//获取数据详情
    exportModel: baseUrl + 'vue/easyDataCheck/exportModel.do',//导出所有基本数据
    batchExport: baseUrl + 'vue/easyDataCheck/batchExport.do',//导出所有易用校验数据
    uploadFile: baseUrl + 'vue/easyDataCheck/upload.do',//上传excel文件入库
    exportSql: baseUrl + 'vue/easyDataCheck/exportSql.do',//导出某条易用校验数据详情的查询sql文件
    changeScope: baseUrl + 'vue/easyDataCheck/changeScope.do',//修改范围
    confirm: baseUrl + 'vue/easyDataCheck/confirm.do'//确定完成
  },
  //接口梳理开发
  thirdInterface: {
    initSourceData: baseUrl + 'vue/thirdInterface/initSourceData.do',//初始化数据源
    getData: baseUrl + 'vue/thirdInterface/initData.do',//加载接口数据
    initData: baseUrl + 'vue/thirdInterface/list.do',//加载接口数据
    addOrModify: baseUrl + 'vue/thirdInterface/addOrModify.do',//增加或编辑
    delete: baseUrl + 'vue/thirdInterface/delete.do',//删除
    changeScope: baseUrl + 'vue/thirdInterface/changeScope.do',//修改范围
    changeContent: baseUrl + 'vue/thirdInterface/changeContent.do',//修改完成情况
    changeStatus: baseUrl + 'vue/thirdInterface/changeStatus.do',//修改审核状态
    exportExcel: baseUrl + 'vue/thirdInterface/exportExcel.do',//导出表格
    export: baseUrl + 'vue/thirdInterface/export.do',//导出表格
    confirmDev: baseUrl + 'vue/thirdInterface/confirmDev.do',//确定开发完成
    confirmNum: baseUrl + 'vue/thirdInterface/confirmNum.do'//确定数量完成
  },
  //业务流程调研
  businessProcess: {
    initData: baseUrl + 'vue/businessProcess/list.do', //加载数据
    countInfo: baseUrl + 'vue/businessProcess/countInfo.do', //加载流程总量数据
    changeScope: baseUrl + 'vue/businessProcess/changeScope.do', //修改范围
    addOrModify: baseUrl + 'vue/businessProcess/addOrModify.do',//增加或编辑
    delete: baseUrl + 'vue/businessProcess/delete.do', //流程删除
    deleteFile: baseUrl + 'vue/businessProcess/deleteFile.do', //流程删除
    confirmFlowNum: baseUrl + 'vue/businessProcess/confirmFlowNum.do', //确认流程数量
    confirmFlowConfig: baseUrl + 'vue/businessProcess/confirmFlowConfig.do', //确认流程配置
    checkAffirm: baseUrl + 'vue/businessProcess/checkAffirm.do', //是否完成流程数量确认
    checkConfig: baseUrl + 'vue/businessProcess/checkConfig.do', //是否完成流程配置
    checkAuth: baseUrl + 'vue/common/checkAuth.do', //检查权限
    upload: baseUrl + 'vue/businessProcess/upload.do' //下载
  },
  //指挥中心安排
  siteCenter: {
    initData: baseUrl + 'vue/siteCenter/list.do',  //加载数据
    updateEchart: baseUrl + 'vue/siteCenter/updateChart.do', //更新饼图数据
    updateOperType: baseUrl + 'vue/siteCenter/updateOperate.do',
    updatePriorityType: baseUrl + 'vue/siteCenter/updatePriority.do',
    updateAllocateUser: baseUrl + 'vue/siteCenter/updateAllocateUser.do',
    exportPmisData: baseUrl + 'vue/siteCenter/exportPmisData.do',
    imagePath: imageUrl + 'shareFolder' //图片路径
  },
  //楼层问题
  floorQuestion: {
    initData: baseUrl + 'vue/floorQuestion/list.do'
  },
  //工作站点安装
  workSiteInstall: {
    initData: baseUrl + 'vue/siteInstall/list.do',
    formData: baseUrl + 'vue/siteInstall/addDept.do',
    removeSite: baseUrl + 'vue/siteInstall/removeSite.do',
    selectDeptList: baseUrl + 'vue/siteInstall/deptList.do',
    updateSiteInstall: baseUrl + 'vue/siteInstall/updateSite.do',
    changeScope: baseUrl + 'vue/siteInstall/changeScope.do',//修改范围
    changeHardWare: baseUrl + 'vue/siteInstall/changeHardWare.do',//硬件范围
    changeSoftWare: baseUrl + 'vue/siteInstall/changeSoftWare.do',//软件范围
    changeUser: baseUrl + 'vue/siteInstall/changeUser.do',//分配人范围
    changeSite: baseUrl + 'vue/siteInstall/changeSite.do',//分配人范围
    addSiteInstallDetail: baseUrl + 'vue/siteInstall/addSiteInstallDetail.do',//分配人范围
    uploadFileSite: baseUrl + 'vue/siteInstall/uploadFileSite.do',//图片上传
    saveSiteDetail: baseUrl + 'vue/siteInstall/saveSiteDetail.do',//保存明细信息
    deleteItem: baseUrl + 'mobile/siteInstall/deleteItem.do',//保存明细信息
    addItem: baseUrl + 'mobile/siteInstall/addItem.do',//保存明细信息
    siteEnd: baseUrl + 'vue/siteInstall/siteEnd.do',//保存明细信息
    uploadFile: baseUrl + 'vue/siteInstall/upload.do', //上传医院用户信息
    exportExcel: baseUrl + 'vue/siteInstall/exportExcel.do', //导出医院用户信息
    showEchart: baseUrl + 'vue/siteInstall/showEchart.do', //展示工作比重的信息
    deleteImg: baseUrl + 'vue/siteInstall/deleteImg.do'
  },
  //报表
  report: {
    initSourceData: baseUrl + 'vue/report/initSourceData.do',//初始化数据源
    initData: baseUrl + 'vue/report/list.do',
    numChange: baseUrl + 'vue/report/numChange.do',//改变数量
    changeScope: baseUrl + 'vue/report/changeScope.do',//修改范围
    changeContent: baseUrl + 'vue/report/changeContent.do',//修改完成情况
    addOrModify: baseUrl + 'vue/report/addOrModify.do',
    delete: baseUrl + 'vue/report/delete.do',
    exportExcel: baseUrl + 'vue/report/exportExcel.do',
    upload: baseUrl + 'vue/report/upload.do',//上传excel文件入库
    changeStatus: baseUrl + 'vue/report/changeStatus.do',//修改审核状态
    confirmDev: baseUrl + 'vue/report/confirmDev.do',//确定开发完成
    confirmNum: baseUrl + 'vue/report/confirmNum.do',//确定数量完成
    imagePath: imageUrl + 'shareFolder', //图片路径
  },
  //模拟记录
  simulateRecord: {
    initData: baseUrl + 'vue/simulate/list.do', //初始化数据
    addOrModify: baseUrl + 'vue/simulate/addOrModify.do', //增加或者修改
    upload: baseUrl + 'vue/simulate/upload.do', //上传文件数据
    deleteFile: baseUrl + 'vue/simulate/deleteFile.do', //删除上传的文件
    delete: baseUrl + 'vue/simulate/delete.do', //删除模拟运行记录
    confirm: baseUrl + 'vue/simulate/confirm.do' //删除模拟运行记录
  },
  //上线可行性报告和切换方案
  onLineReport: {
    initData: baseUrl + 'vue/onLineReport/initData.do',//加载初始数据
    refreshFile: baseUrl + 'vue/onLineReport/refreshFile.do',//加载初始数据
    confirm: baseUrl + 'vue/onLineReport/confirm.do',//确认上线可行性报告
    upload: baseUrl + 'vue/onLineReport/upload.do', //上传
    delete: baseUrl + 'vue/onLineReport/delete.do', //删除上传文件
    initSwitchData: baseUrl + 'vue/onLineReport/initSwitchData.do',//加载切换方案初始数据
    checkWork: baseUrl + 'vue/onLineReport/checkWork.do' //工作完成情况查询
  }
};

axios.interceptors.request.use(config => {
  if (window.localStorage.getItem('token')) {
    config.headers.token = window.localStorage.getItem('token');
  }
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use((res) => {
  if (res.status >= 200 && res.status <= 300) {
    return res;
  }
  //由后端抛出的错误
  return Promise.reject(res);
}, (error) => {
  //由网络服务器抛出的错误
  return Promise.reject(error);
});

let catchErrorEvt = function (error) {
  console.log(error.status);
  switch (error.status) {
    case 404:
      console.log('接口不存在');
      break;
    case '500':
      console.log('接口报错');
      break;
    default:
      console.log('其他类型错误');
  }
};

let nullToString = function (data) {
  for (let it in data) {
    if (typeof(data[it]) === "object") {
      nullToString(data[it]);
    }
    data[it] = data[it] == null ? '' : data[it];
  }
  return data;
};

let encrypt = function (data) {
  return encodeURIComponent(data);
};

let decrypt = function (data) {
  return data;
};

export default {
  url,
  post: function (target, params = {}) {
    return new Promise((resolve, reject) => {
      console.time(target);
      axios({
        url: target,
        method: 'post',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: params,
        transformRequest: [function (data) {
          let ret = '';
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }]
      }).then(res => {
        resolve(nullToString(res.data));
        console.timeEnd(target);
      }).catch(error => {
        catchErrorEvt(error);
        reject(error);
      });
    });
  },
  get: function (target) {
    return new Promise((resolve, reject) => {
      console.time(target);
      axios({
        url: target,
        method: 'get',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        resolve(nullToString(res.data));
        console.timeEnd(target);
      }).catch(error => {
        catchErrorEvt(error);
        reject(error);
      });
    });
  }
}

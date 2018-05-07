import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

//首页
const login = r => require.ensure([], () => r(require('../views/login/login.vue')), 'login');

const index = r => require.ensure([], () => r(require('../views/index/index.vue')), 'index');
const testHardware = r => require.ensure([], () => r(require('../views/project-startup/test-hardware.vue')), 'testHardware');
//项目信息
const projectInformation = r => require.ensure([], () => r(require('../views/project-startup/project-information.vue')), 'projectInformation');
//实施工作
const baseDataMaintain = r => require.ensure([], () => r(require('../views/implement-work/base-data-maintain.vue')), 'baseDataMaintain');
const baseDataCheck = r => require.ensure([], () => r(require('../views/implement-work/base-data-check.vue')), 'baseDataCheck');
//工作站点安装
const workSiteInstall = r => require.ensure([], () => r(require('../views/implement-work/work-site-install.vue')), 'workSiteInstall');
//接口梳理开发
const interfaceCombDeveplopment = r => require.ensure([], () => r(require('../views/implement-work/interface-comb-development.vue')), 'interfaceCombDeveplopment');
//业务流程调研
const businessProcessSesearch = r => require.ensure([], () => r(require('../views/implement-work/business-process-research.vue')), 'businessProcessSesearch');
//硬件设备准备
const hardwareEqPrepare = r => require.ensure([], () => r(require('../views/implement-work/hardware-equipment-prepare.vue')), 'hardwareEqPrepare');
//报表单据开发
const dataReportDevelop = r => require.ensure([], () => r(require('../views/implement-work/data-report-develop.vue')), 'dataReportDevelop');
//易用数据参考
const easyDataReference = r => require.ensure([], () => r(require('../views/implement-work/easy-data-reference.vue')), 'easyDataReference');
//易用数据校验
const easyDataCheck = r => require.ensure([], () => r(require('../views/implement-work/easy-data-check.vue')), 'easyDataCheck');
//项目上线
const  projectOnline = r => require.ensure([], () => r(require('../views/implement-work/project-online-approval.vue')), 'projectOnline');
//上线支持人员
const  onlineSupportStaff = r => require.ensure([], () => r(require('../views/implement-work/online-support-staff.vue')), 'onlineSupportStaff');
//工作汇报
const commondCenterArrange = r => require.ensure([], () => r(require('../views/work-report/commond-center-arrange.vue')), 'commondCenterArrange');
//楼层问题
const floorQuestionReport = r => require.ensure([], () => r(require('../views/work-report/floor-question-report.vue')), 'floorQuestionReport');

//非同质功能
const test = r => require.ensure([], () => r(require('../views/online-training/test.vue')), 'test');
const error = r => require.ensure([], () => r(require('../components/state/404.vue')), 'error');


const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/1-1',
    name: 'index',
    component: index
  },
  {
    path: '/1-2',
    name: 'projectInformation',
    component: projectInformation
  },
  {
    path: '/1-3',
    name: 'testHardware',
    component: testHardware
  },
  {
    path: '/2-1-1',
    name: 'baseDataMaintain',
    component: baseDataMaintain
  },
  {
    path: '/2-1-2',
    name: 'easyDataReference',
    component: easyDataReference
  },
  {
    path: '/2-2-1',
    name: 'baseDataCheck',
    component: baseDataCheck
  },
  {
    path: '/2-2-2',
    name: 'easyDataCheck',
    component: easyDataCheck
  },
  {
    path: '/2-3',
    name: 'interfaceCombDeveplopment',
    title:'接口梳理开发',
    params:{
      title:'接口梳理开发'
    },
    component: interfaceCombDeveplopment
  },
  {
    path: '/2-4',
    name: 'businessProcessSesearch',
    title:'业务流程调研',
    params:{
      title:'业务流程调研'
    },
    component: businessProcessSesearch
  },
  {
    path: '/2-5',
    name: 'hardwareEqPrepare',
    title:'硬件设施准备',
    component: hardwareEqPrepare
  },
  {
    path: '/2-6',
    name: 'dataReportDevelop',
    title:'数据报表开发',
    component: dataReportDevelop
  },
  {
    path: '/2-7',
    name: 'workSiteInstall',
    component: workSiteInstall
  },
  {
    path: '/2-8',
    name: 'projectOnline',
    component: projectOnline
  },
  {
    path: '/2-9',
    name: 'onlineSupportStaff',
    component: onlineSupportStaff
  },
  {
    path: '/3-1',
    name: 'commondCenterArrange',
    meta:{
      title:'指挥中心安排'
    },
    component: commondCenterArrange
  },
  {
    path: '/3-2',
    name: 'floorQuestionReport',
    meta:{
      title:'楼层问题汇报'
    },
    component: floorQuestionReport
  },
  {
    path: '/5',
    name: 'test',
    component: test
  },
  {
    path:'*',
    component:error
  }
];
 const  router = new Router({
  routes: routes
});
router.beforeEach((to, from, next) => {
  if (to.matched.length ===0) {                        //如果未匹配到路由
    from.name ? next({ name:from.name }) : next('*');   //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
  } else {
    next();                                             //如果匹配到正确跳转
  }
});
export  default router;

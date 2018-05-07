<!--
* @author: jinxl
* @date: 2018/01/10
* @module:侧边栏-导航菜单
-->
<template>
  <div class="side-menu">
    <h2 @click="switchMenuSate" class="menu-state">
      <span :class="[isCollapse ? '':'open']"><i class="iconfont icon-menu"></i></span>
    </h2>
    <el-menu default-active=""
             background-color="#333744"
             text-color="#fff"
             active-text-color="#1e90ff"
             class="el-menu-vertical-demo"
             :router="rouerState"
             unique-opened
             @open="handleOpen"
             @close="handleClose"
             :collapse="isCollapse">
      <el-submenu index="1">
        <template slot="title">
          <i class="iconfont icon-project-start"></i>
          <span slot="title">项目启动</span>
        </template>
        <el-menu-item index="1-1">项目首页</el-menu-item>
        <el-menu-item index="1-2">项目信息</el-menu-item>
        <el-menu-item index="1-3">测试&硬件</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="iconfont icon-work"></i>
          <span slot="title">实施工作</span>
        </template>
        <el-submenu index="2-1">
          <span slot="title">数据维护</span>
          <el-menu-item index="2-1-1">基础数据维护</el-menu-item>
          <el-menu-item index="2-1-2">易用数据参考</el-menu-item>
        </el-submenu>
        <el-submenu index="2-2">
          <span slot="title">数据校验</span>
          <el-menu-item index="2-2-1">基础数据校验</el-menu-item>
          <el-menu-item index="2-2-2">易用数据校验</el-menu-item>
        </el-submenu>
        <el-menu-item index="2-3">接口梳理开发</el-menu-item>
        <el-menu-item index="2-4">业务流程调研</el-menu-item>
        <el-menu-item index="2-5">硬件设施准备</el-menu-item>
        <el-menu-item index="2-6">单据报表开发</el-menu-item>
        <el-menu-item index="2-7">工作站点安装</el-menu-item>
        <el-menu-item index="2-8">项目上线审批</el-menu-item>
        <el-menu-item index="2-9">上线支持人员</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="iconfont icon-work-report"></i>
          <span slot="title">工作汇报</span>
        </template>
        <el-menu-item index="3-1">指挥中心安排</el-menu-item>
        <el-menu-item index="3-2">楼层问题汇报</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="iconfont icon-manger"></i>
          <span slot="title">运营管理</span>
        </template>
        <el-menu-item index="4-1">用户在线培训管理</el-menu-item>
        <el-menu-item index="4-2">上线期间汇报管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="5">
        <i class="iconfont icon-online-train"></i>
        <span slot="title">在线培训</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  export default {
    //数据
    data(){
      return {
        initData: {},
        isCollapse: false,
        rouerState:true,
        opened:false
      }
    },
    //方法
    methods: {
      switchMenuSate:function () {
        this.isCollapse = !this.isCollapse;
        this.$root.$emit('Get-Menu',this.isCollapse);
      },
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      }
    }
  }

</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
  .side-menu{
    position relative
    float left
    height 100%
    background-color #333744
    z-index 1
  }
  .menu-state{
    position relative
    height 60px
    background #222733
    cursor pointer
  }
  .menu-state span{
    position absolute
    top 50%
    left 50%
    transform translate(-50%,-50%)
  }
  .menu-state span.open i{
    transform rotate(270deg)
  }
  .menu-state i{
    display inline-block
    font-size 20px
    transition all .5s ease
  }
  .el-menu-item a{
    color #fff
    font-size 14px
    text-decoration none
  }
  .iconfont{
    color #fff
  }
</style>
<!--CSS-RESET-->
<style lang="stylus">
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
    height 100%
    min-height: 400px;
    overflow auto
  }
  .el-submenu .el-menu-item{
    min-width 180px !important
  }
  /*reset*/
  ul.el-menu{
    border-right:none!important;
  }
  /*pagination*/
  .el-pager li{
    color :#666;
    font-weight: normal;
  }
  .el-pager li.active{
    color :#3a9eff;
  }
</style>

<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
  <div  class="ims-wrapper">
    <SideBar></SideBar>
    <div :class="[menuSate ? 'shrinkage':'','ims-content']">
      <div class="header">
        <el-select v-model="ward" id="pid"
                   clearable
                   filterable
                   v-bind:disabled="isAble"
                   @change="showInfo"
                   placeholder="项目、项目代码">
          <el-option-group
            v-for="group in wardData"
            :key="group.nodeId"
            :label="group.text">
            <el-option
              v-for="item in group.nodes"
              :key="item.nodeId"
              :label="item.text"
              :value="item.nodeId">
            </el-option>
          </el-option-group>
        </el-select>
        <div class="user">
          <el-popover
            ref="todo"
            placement="top-start"
            trigger="hover">
            <div class="todo-center">
              <p>共{{ todoData.length }}个待办任务</p>
              <div class="item">
                <template v-for="(item, index) in todoData">
                  <a href="#">
                    <dl class="item-row">
                      <dt><i :class="[item.state ? 'visited':'']"></i></dt>
                      <dd><time>{{ item.time }}</time></dd>
                      <dd>{{ item.text }}</dd>
                    </dl>
                  </a>
                </template>
              </div>
            </div>
          </el-popover>
          <el-popover
            ref="user"
            placement="bottom"
            trigger="hover">
            <dl class="user-center">
              <dt>
                <img src="./assets/images/head-img.png" alt="头像"/>
                <span>{{ name }}</span>
              </dt>
              <dd>{{ orgExt }}</dd>
              <dd><p><i class="iconfont icon-contact"></i>{{ mobile || '暂无数据' }}</p></dd>
              <dd><p><i class="iconfont icon-email"></i>{{ email || '暂无数据' }}</p></dd>
            </dl>
            <div @click="logout" class="user-center_cancel">注销</div>
          </el-popover>
          <div v-popover:todo class="todo-model">
            <img src="./assets/images/todo.png" alt="待办中心"/>
            <i></i>
          </div>
          <div v-popover:user class="user-model"><img  src="./assets/images/user.png" alt="用户中心"/></div>
        </div>
      </div>
      <div class="middle">
        <div>
          <keep-alive>
            <transition  name="my-fade-null">
              <router-view/>
            </transition>
          </keep-alive>
        </div>
      </div>
      <div class="footer">© 2018 Winning Health 版权所有</div>
    </div>
  </div>
</template>

<script>
  import './assets/js/common'
  import SideBar from './components/sidebar/side-bar.vue'
  import api from '../api/api'
  export default {
    name: 'app',
    data(){
        return {
            menuSate:false,
            showSelect:false,
            wardData: [],
            ward: '',
            name:'张文文',
            orgExt :'卫宁健康／NIS／项目经理',
            mobile :'17766327865',
            email:'xxx@winning.com.cn',
            vModel:1,
            isAble:false,
            todoData:[
              {
                  state:false,
                  time:'2017/01/03',
                  text:'基础数据存在问题，需整改。'
              },
              {
                state:false,
                time:'2017/01/03',
                text:'基础数据存在问题，需整改。'
              },
              {
                state:false,
                time:'2017/01/03',
                text:'基础数据存在问题，需整改。'
              },
              {
                state:true,
                time:'2017/01/03',
                text:'基础数据存在问题，需整改。'
              },
              {
                state:true,
                time:'2017/01/03',
                text:'基础数据存在问题，需整改。'
              },
              {
                state:true,
                time:'2017/01/03',
                text:'基础数据存在问题，需整改。'
              },
              {
                state:true,
                time:'2017/01/03',
                text:'基础数据存在问题，需整改。'
              }
            ]
        }
    },
    created(){
      if(!window.localStorage.getItem('user')){
        this.$router.push('/');
      }else {
        this.$nextTick(function () {
          this.$root.$on('Get-Menu', data => {
            this.menuSate = data || false;
          });
        });
        // this.getProjectInfo();
        // this.getUserInfo();
        // this.selectProject();
      }
    },
    methods:{
      getProjectInfo:function () {
        let menuData = JSON.parse(window.localStorage.getItem('menu'));
        var user = this.getUser();
        if(menuData){
          this.wardData = menuData;
        }else{
          api.post(api.url.menuInfo.initData,{'userid':user.id}).then((data)=>{
            if(data.status){
              this.wardData = data.data;
              window.localStorage.setItem('menu',JSON.stringify(data.data)); //用户菜单信息存入localStorage
            }
          });
        }


      },
      getUserInfo:function () {
        var user = this.getUser();
        this.name = user.yhmc;
        this.mobile = user.mobile;
        if(user.map.orgExt.length > 12){
          var dataLength = user.map.orgExt.length;
          this.orgExt = '...'+user.map.orgExt.substr(dataLength - 12);
        }else{
          this.orgExt =  user.map.orgExt;
        }
        this.email = user.email;
      },
      selectProject:function () {
        if(!this.getProjectId()){
          this.$confirm('当前用户['+this.name+']之前未在系统中编辑过项目信息，请先选择项目。', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            document.getElementById('pid').click();
          }).catch(() => {

          });
        }
      },
      showInfo:function (data) {
        var user = this.getUser();
        if(data){
          api.post(api.url.projectInfo.addLastLogin,{'projectId':data,'userid':user.id}).then((data)=>{
            if(data.status){

              window.localStorage.setItem('user',JSON.stringify(data.user));
              //this.$on.index.getStartData();
              //this.$refs.index.getStartData();
              //this.$refs.getStartData();
             // this.$root.$emit('getStartData',data);
              //this.$children.index.getStartData();
              //this.$emit("getStartData");
              //this.$children.index.getStartData();
              this.$root.$emit('childData',data);

            }
          });
          this.$router.push('/1-1');
        };

     },
     setProjectInfo:function () {
       var user = this.getUser();
       var pmId = user.map.PM_ID;
       this.ward = pmId;
       this.getProjectInfo();
       this.getUserInfo();
     },
     getUser:function () {
        return  JSON.parse(window.localStorage.getItem('user'));
      },
      getUserId:function () {
        var user = JSON.parse(localStorage.getItem('user'));
        return user.id;
      },
      setSelectDisable:function (status) {
        this.isAble = status;
      },
      getProjectId:function () {
        var user = JSON.parse(window.localStorage.getItem('user'));
        return user.map.PM_ID;
      },
      getContractId:function () {
        var user = JSON.parse(window.localStorage.getItem('user'));
        return user.map.C_ID;
      },
      getCustomerId:function () {
        var user = JSON.parse(window.localStorage.getItem('user'));
        return user.map.CU_ID;
      },
      logout:function () {
        api.post(api.url.loginInfo.logoutUrl,{}).then((data)=>{
          if(data.status == 'success'){
            window.localStorage.removeItem('user');
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('menu');
            this.cleanPageData();
            this.$router.push('/');
          }
        });
      },
      cleanPageData:function () {
        this.wardData = [];
        this.ward= '';
        this.name='';
        this.orgExt ='';
        this.mobile ='';
        this.email='';
        this.todoData = [];
      }
    },
    components:{
      SideBar
    }
  }
</script>

<style lang="stylus">
  @import "./assets/css/reset.css"
  @import "./assets/css/element-ui-reset.css"
  @import './assets/css/common.css'
  @import "./assets/css/animate.css"
  .header .el-select{
    margin 10px 10px 0px 25px
  }
  .header .el-input__inner{
    border-color transparent
    width 300px
  }
  .my-fade-enter-active, .my-fade-leave-active {
    transition: opacity .3s linear;
  }
  .my-fade-enter, .my-fade-leave-to {
    opacity: 0;
  }
</style>

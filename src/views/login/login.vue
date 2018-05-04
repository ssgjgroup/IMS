<template>
  <div class="login">
    <!-- animated fadeIn-->
    <section class="container border-radius-2">
      <figure class="banner">
        <img src="../../../static/image/banner.png"/>
      </figure>
      <article class="login-wrap">
        <figure class="logo">
          <img src="../../../static/image/font.png"/>
        </figure>
        <form id="loginForm" autocomplete="off">
          <label for="userName"
                 class="label-wrap">
            <span class="input-title"
                  :class="{'active-input':userNameFocus}">账 号</span>
            <br/>
            <input id="userName"
                   ref="userName"
                   v-model="userName"
                   autocomplete="off"
                   @click="$_set_activeClass('userName',$event)"
                   class="border-color-ease border-box"
                   value=""
                   type="text"/>
            <br/>
          </label>
          <label for="password"
                 class="label-wrap">
            <span class="input-title"
                  :class="{'active-input':passwordFocus}">密 码</span>
            <br/>
            <input id="password"
                   ref="password"
                   v-model="password"
                   autocomplete="off"
                   @click="$_set_activeClass('password',$event)"
                   class="border-color-ease border-box"
                   value=""
                   :type="inputType ? 'text':'password'"/>
            <i id="showPwd" @click="inputType = !inputType"
               class="iconfont icon-opacity-ease"></i>
            <br/>
          </label>
          <el-checkbox class="keep-pwd-alive"
                       v-model="rememberPassword">记住我
          </el-checkbox>
          <br/>
          <button id="submit"
                  class="border-radius-2 background-ease"
                  type="submit"
                  @click.prevent="$_submit">登 录
          </button>
        </form>
      </article>
    </section>
  </div>
</template>
<script>
  import api from '../../../api/api'
  let Base64 = require('js-base64').Base64;
  export default {
    data() {
      return {
        userName: '',
        password: '',
        rememberPassword: false,
        userNameFocus: true,
        passwordFocus: true,
        inputType:false
      }
    },
    methods: {
      init(){
      },
      $_isRemember() {
        let isCookie = this.getCookie('userNameCopy') && this.getCookie('passwordCopy');

        //设置记住密码勾选状态
        isCookie ? this.$_rememberedUserInfo() : this.rememberPassword = false;
      },
      $_rememberedUserInfo(){
        /**
         * 曾选中记住密码，且没有过期
         * */
        //设置记住密码勾选状态
        this.rememberPassword = true;
        //设置label样式变化
        this.$_active_inputs();
        //自动填充用户名密码
        this.userName = this.getCookie('userNameCopy');
        this.password = this.getCookie('passwordCopy');
      },
      $_set_activeClass(inputName,ev) {
        if(inputName==='userName') {
          this.userNameFocus = true
        } else {
          this.passwordFocus = true
        }
      },
      $_set_normalInput(inputName) {
        if(inputName==='userName') {
          this.userNameFocus = false
        } else {
          this.passwordFocus = false
        }
      },
      $_active_inputs() {
        this.$_set_activeClass('userName');
        this.$_set_activeClass('password');
      },
      $_go_chooseRole() {
        this.delCookie('roleCode');
      },
      $_set_cookie(data) {
        data.map(cookieItem => {
          this.setCookie(cookieItem.name, cookieItem.value, cookieItem.expires);
        });
      },
      $_del_cookie(data) {
        data.map(cookieItem => {
          this.delCookie(cookieItem);
        });
      },
      $_submitLogin() {
          // 验证登录
      },
      $_submit() {
        if (this.$_isEmptyInput()) {
          var userid =  this.userName;
          var password = this.password;
          var decrypP = Base64.encode(password);
          api.post(api.url.loginInfo.loginUrl,{'userid':userid,'password':decrypP}).then((data)=>{
            if(data.status){
              console.log('登录成功');
              window.localStorage.setItem('user',JSON.stringify(data.user));
              window.localStorage.setItem('token',data.token);
              this.$parent.getProjectInfo();
              this.$parent.getUserInfo();
              this.$parent.setProjectInfo();
              this.$parent.selectProject();
              this.$router.push('/1-1');
            }else{
              this.$message.warning(`登录失败，失败原因：`+data.message);
            }
          }).catch(error => {
            if(error.toString().split(':')[1].trim() =='Network Error'){
              this.$message.warning(`通讯失败，失败原因：网络错误，请联系管理员。`);
            }else{
              this.$message.warning(`通讯失败，失败原因：` + error);
            }
          });
        }
      },
      $_check_role(){
        let isChooseRole = this.getCookie('roleCode') === null;
        if (isChooseRole) {
          this.$message({
            message: '用户角色为空，请返回选择！',
            type: 'warning',
            showClose: true
          });
          return false
        } else {
          return true
        }
      },
      $_isEmptyInput(){
        if (this.userName === '' || this.password === '') {
          this.$message({
            message: '警告，用户名或密码为空！',
            type: 'warning'
          });
          return false
        } else {
          return true
        }
      },
      $_isLooseRole() {
      },
    },
    created(){
      this.$nextTick(() => {
        this.init();
      })
    },
    watch: {
      rememberPassword(value) {
        //取消记住密码
        if (!value) {
          //删除备用
          if (this.getCookie('userNameCopy') && this.getCookie('passwordCopy')) {
            this.$_del_cookie(['userNameCopy', 'passwordCopy']);
          }
        }
      },
      userName() {
        this.$_isLooseRole()
      },
      password() {
        this.$_isLooseRole()
      }
    }
  }
</script>
<style>
  .system-tab .el-button--mini {
    font-size: 12px;
    min-width: 90px;
    padding: 5px 15px;
    margin-right: 10px;
  }
</style>
<style scoped>
  /* html,body */
  .login {
    position: fixed;
    top:0px;
    left: 0px;
    z-index: 10;
    width: 100%;
    height: 100%;
    font: 14px/1.5 "Microsoft Yahei";
    overflow: hidden;
    background-color: #f6f7f9;
  }

  /* login mainbody */

  .container {
    width: 805px;
    height: 473px;
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -236px;
    margin-left: -402px;
  }

  /* left banner */
  .container figure.banner {
    float: left;
    width: 303px;
    height: 100%;
    background-color: transparent;
  }

  .system-btn{
    border-radius: 20px;
  }
  .container figure.banner img {
    width: 100%;
    height: auto;
  }

  /* right login form */
  .container article.login-wrap {
    position: relative;
    width: calc(100% - 303px);
    height: 100%;
    float: right;
    background-color: #fff;
  }

  .container figure.logo {
    position: relative;
    width: 100%;
    height: 100px;
    line-height: 170px;
    text-align: center;
  }

  .container figure.logo img {
    vertical-align: baseline;
  }

  #loginForm {
    margin-top: 30px;
    padding: 0 100px;
  }

  #loginForm .label-wrap {
    position: relative;
    display: inline-block;
    width: 100%;
    height: auto;
  }

  #loginForm .label-wrap i.iconfont {
    position: absolute;
    right: 0;
    bottom: 15px;
    font-size: 12px;
    color: #ccc;
    opacity: 0;
    cursor: pointer;
  }

  #loginForm .label-wrap:hover i.iconfont {
    opacity: 1;
  }

  #loginForm label {
    position: relative;
    margin-bottom: 5px;
    color: #666;
  }

  #loginForm label span.input-title {
    position: absolute;
    bottom: 10px;
    left: 0;
    font-size: 16px;
    -webkit-transition: all .25s cubic-bezier(0, 0.52, 0.58, 1);
    transition: all .25s cubic-bezier(0, 0.52, 0.58, 1);
    cursor: pointer;
  }

  .active-input {
    bottom: 35px !important;
    color: #999 !important;
    font-size: 14px !important;
  }

  #loginForm input[type=text],
  #loginForm input[type=password] {
    width: 100%;
    padding: 10px 0;
    font-size: 14px;
    -webkit-border: none;
    -moz-border: none;
    -ms-border: none;
    -o-border: none;
    border: none;
    -webkit-border-bottom: 1px solid #b3d2ed;
    -moz-border-bottom: 1px solid #b3d2ed;
    -ms-border-bottom: 1px solid #b3d2ed;
    -o-border-bottom: 1px solid #b3d2ed;
    border-bottom: 1px solid #b3d2ed;
    background-color: rgb(251, 254, 255);
  }

  #loginForm input:hover,
  #loginForm input:focus {
    -webkit-border-color: #1a9cff;
    -moz-border-color: #1a9cff;
    -ms-border-color: #1a9cff;
    -o-border-color: #1a9cff;
    border-color: #1a9cff;
  }

  #loginForm button[type=submit] {
    width: 100%;
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
    color: #fff;
    font-size: 16px;
    -webkit-border: none;
    -moz-border: none;
    -ms-border: none;
    border: none;
    background-color: rgb(29, 156, 255);
    cursor: pointer;
  }

  #loginForm button[type=submit]:hover {
    background-color: rgb(67, 192, 255);
  }

  #loginForm button[type=submit]:focus {
    background-color: rgb(0, 122, 255);
  }

  .keep-pwd-alive {
    float: right;
    margin-top: 10px;
  }

  .back-button,
  .role-result {
    position: absolute;
    bottom: 40px;
    font-size: 12px;
    color: #999;
  }

  .back-button {
    right: 100px;
    padding: 2px 12px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
    border: 1px solid #e5e5e5;
    background-color: #fff;
    cursor: pointer;
  }

  .back-button:hover,
  .back-button:focus {
    color: #55d3ff;
  }

  span.role-warning {
    color: #ff304f;
  }

  .role-result {
    display: inline-block;
    left: 100px;
    padding: 3px 0;
    color: #333;
    cursor: default;
  }
  /* common css */

  .border-radius-2 {
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    -ms-border-radius: 2px;
    -o-border-radius: 2px;
    border-radius: 2px;
  }

  .position-ease {
    -webkit-transition: all .3s cubic-bezier(0, 0.52, 0.58, 1);
    -moz-transition: all .3s cubic-bezier(0, 0.52, 0.58, 1);
    -ms-transition: all .3s cubic-bezier(0, 0.52, 0.58, 1);
    -o-transition: all .3s cubic-bezier(0, 0.52, 0.58, 1);
    transition: all .3s cubic-bezier(0, 0.52, 0.58, 1);
  }

  .background-ease {
    -webkit-transition: background-color .35s ease-in-out;
    -moz-transition: background-color .35s ease-in-out;
    -ms-transition: background-color .35s ease-in-out;
    -o-transition: background-color .35s ease-in-out;
    transition: background-color .35s ease-in-out;
  }

  .color-ease {
    -webkit-transition: color .3s ease-in-out;
    -moz-transition: color .3s ease-in-out;
    -ms-transition: color .3s ease-in-out;
    -o-transition: color .3s ease-in-out;
    transition: color .3s ease-in-out;
  }

  .opacity-ease {
    -webkit-transition: opacity .3s ease-in-out;
    -moz-transition: opacity .3s ease-in-out;
    -ms-transition: opacity .3s ease-in-out;
    -o-transition: opacity .3s ease-in-out;
    transition: opacity .3s ease-in-out;
  }

  .border-color-ease {
    -webkit-transition: border-color .3s ease-in-out;
    -moz-transition: border-color .3s ease-in-out;
    -ms-transition: border-color .3s ease-in-out;
    -o-transition: border-color .3s ease-in-out;
    transition: border-color .3s ease-in-out;
  }

  /*切换系统*/
  .system-tab {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #EFEFEF;
    text-align: right;
  }

  .current-system {
    background: #fff;
    border-color: #409EFF;
    color: #409EFF;
  }

</style>

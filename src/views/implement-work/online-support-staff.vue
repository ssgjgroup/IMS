<!--
* @author: evol
* @date: 2018年5月7日
* @module:上线支持人员
-->
<template>
  <div class="testAndHardware">
    <!--接口对应系统-->
    <div class="w-table">
      <div class="w-table-btn">
        <span @click="doConfirm" :class="{ active:onlineActive }"><i class="iconfont icon-conf-complete"></i>确认完成</span>
        <span @click="openEtOnlineUserWindow" v-show="!onlineActive"><i class="iconfont icon-new-add"></i>新增</span>
        <span @click="openLineUploadWindow"><i class="iconfont icon-to-lead"></i>导入</span>
        <span @click="downloadExcelLineUser"><i class="iconfont icon-export"></i>导出</span>
      </div>
      <div class="w-table-content">
        <el-table
          :data="etOnlineInfo"
          style="width: 100%">
          <el-table-column
            prop="userCode"
            label="工号">
          </el-table-column>
          <el-table-column
            prop="cName"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色">
          </el-table-column>
          <el-table-column
            prop="map.department"
            label="负责科室">
          </el-table-column>
          <el-table-column
            prop="map.site"
            label="站点">
          </el-table-column>
          <el-table-column
            prop="telephone"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="wechatNo"
            label="微信号">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            prop="lodging"
            label="住宿信息">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="operate" v-show="!onlineActive">
                <i class="iconfont icon-edit" @click="openLineUserDetails(scope.row)"></i>
                <i class="iconfont icon-delete" @click="deleteEtOnlineUsetInfoDetails(scope.row.id)"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="w-table-page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <!--上线支持人员录入弹窗-->
    <el-dialog :title="title" width="30%" :visible.sync="etOnlineUserWindow">
      <el-form :model="etOnlineUserForm" :rules="rules" ref="etOnlineUserForm">
        <el-form-item label="工号" label-width="60px" prop="userCode">
          <el-input v-model="etOnlineUserForm.userCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="60px" prop="cName">
          <el-input v-model="etOnlineUserForm.cName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="负责科室" label-width="85px" prop="responseDept">
          <el-select v-model="responseDept" placeholder="请选择" @change="doSelect(responseDept)">
            <el-option
              v-for="item in deptList"
              :key="item.id"
              :label="item.deptName"
              :value="item.id.toString()">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="部门" label-width="60px" prop="responseDept">-->
        <!--<el-input v-model="etOnlineUserForm.responseDept" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="角色" label-width="60px" prop="roleName">
          <el-input v-model="etOnlineUserForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="站点" label-width="85px" prop="responseSite">
          <el-select v-model="responseSite" placeholder="请选择" @change="doSiteSelect(responseSite)">
            <el-option
              v-for="item in siteList"
              :key="item.id"
              :label="item.siteName"
              :value="item.id.toString()">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信号" label-width="70px" prop="wechatNo">
          <el-input v-model="etOnlineUserForm.wechatNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="60px" prop="telephone">
          <el-input v-model="etOnlineUserForm.telephone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="60px" prop="email">
          <el-input v-model="etOnlineUserForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="住宿信息" label-width="80px" prop="lodging">
          <el-input v-model="etOnlineUserForm.lodging" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="etOnlineUserWindow = false">取 消</el-button>
        <el-button type="primary" @click="onlineAddOrModify('etOnlineUserForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--文件上传弹窗-->
    <el-dialog title="文件上传" width="30%" :visible.sync="uploadWindow">
      <el-upload
        class="upload-demo"
        :action="action"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="uploadSeccess"
        :before-remove="beforeRemove"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过500kb</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadWindow = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<!--JavaScript-->
<script>
  import api from '../../../api/api'

  export default {
    data() {
      return {
        action: "",
        formOpen: true,
        title: '新增',
        uploadWindow: false,//导入弹窗默认关闭
        workId: 0,
        fileList: [],
        onlineActive: false,//确认完成
        etOnlineInfo: [],
        etOnlineUserWindow: false,
        pageSize: 10,
        total: 100,
        currentPage: 1,
        deptList: [],//科室
        siteList: [],//站点
        responseDept: "",//科室id
        responseSite: "",//站点id
        rules: {
          userCode: [
            {required: true, message: '请输入用户工号'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符'}
          ],
          cName: [
            {required: true, message: '请输入用户姓名'}
          ],
          responseDept: [
            {required: true, message: '请输入用户所在部门'}
          ],
          roleName: [
            {required: true, message: '请输入用户当前角色'}
          ],
          // responseSite: [
          //   {required: true, message: '请输入用户所在站点'}
          // ],
          wechatNo: [
            {message: '请输入微信号'}
          ],
          telephone: [
            {required: true, pattern: /^1[345789]\d{9}$/, message: '目前只支持中国大陆的手机号码'}
          ],
          email: [
            {
              // required: true,
              pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
              message: '邮箱验证失败'
            }
          ],
          lodging: [
            {message: '请输入住宿信息'}
          ],
        },
        etOnlineUserForm: {
          workId: 0,
          userCode: '',
          cName: '',
          roleName: '',
          responseDept: '',
          responseSite: '',
          telephone: '',
          wechatNo: '',
          email: '',
          lodging: ''
        },
        dialogFormVisible: false,
        formLabelWidth: '120px',
      }
    },
    created() {
      this.$parent.setSelectDisable(true);
      this.$parent.setProjectInfo();
      this.checkOnlineUserWork();
      this.$nextTick(function () {
        this.getEtOnlineUserInfo();
      })
    },
    methods: {
      //初始化接口数据源
      initSourceData() {
        api.post(api.url.softHardware.initSourceData, {
          pmId: this.$parent.getProjectId(),
          operator: this.$parent.getUserId(),
        }).then((data) => {
          console.log(data.msg);
        });
      },
      //上线支持人员
      getEtOnlineUserInfo: function () {
        let pageSize = this.pageSize;
        let currentPage = this.currentPage;
        let first = (currentPage - 1) * pageSize;
        let pmId = this.$parent.getProjectId();
        let serialNo = this.$parent.getCustomerId(); //医院用户按照客户信息来存储
        api.post(api.url.etOnlineUserInfo.initData, {
          'pmId': pmId,
          'serialNo': serialNo,
          'first': first,
          'count': pageSize
        }).then((data) => {
          this.etOnlineInfo = data.rows;
          this.total = data.total;
          this.deptList = data.deptList;
          if (data.process.isSupportStaff != 1 || data.process.isEnd != 1) {
            this.onlineActive = false;
          } else if (data.process.isSupportStaff == 1 && data.process.isEnd == 1) {
            this.onlineActive = true;
          }
        });
      },
      //上传成功
      uploadSeccess: function (response) {
        if (response.status == 'success') {
          this.fileList = [];
          this.uploadWindow = false;
          this.refreshPage();
        } else {
          this.$message.warning(response.msg);
        }
      },
      //移除上传文件
      handleRemove(file, fileList) {
        //console.log(file, fileList);
      },
      //展示
      handlePreview(file) {
        //console.log(file);
      },
      //限制文件
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      //移除
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      //pageSize改变事件
      handleSizeChange(val) {
        this.pageSize = val;
        this.refreshPage();

      },
      //currentPage改变事件
      handleCurrentChange(val) {
        this.currentPage = val;
        this.refreshPage();
      },
      refreshPage: function () {
        this.checkOnlineUserWork();
        this.getEtOnlineUserInfo();
      },
      //============================上线支持人员=====================================//
      checkOnlineUserWork() {
        let json = {
          pmId: this.$parent.getProjectId()
        };
        api.post(api.url.etOnlineUserInfo.checkWork, json).then((data) => {
          if (data.status === 'success') {
            this.onlineActive = data.workStatus;
          }
        });
      },
      openLineUserDetails: function (data) { //查看详细数据
        if (this.$refs['etOnlineUserForm'] !== undefined) {
          this.$refs['etOnlineUserForm'].resetFields();
        }
        //获取站点集合
        api.post(api.url.etOnlineUserInfo.responseSiteList, {id: data.responseDept}).then((data) => {
          if (data.status === 'success') {
            this.siteList = data.siteList;
          }
        });
        this.etOnlineUserForm.workId = data.id;
        this.etOnlineUserForm.userCode = data.userCode;
        this.etOnlineUserForm.cName = data.cName;
        this.etOnlineUserForm.roleName = data.roleName;
        this.etOnlineUserForm.responseDept = data.responseDept;
        this.etOnlineUserForm.responseSite = data.responseSite;
        this.etOnlineUserForm.telephone = data.telephone;
        this.etOnlineUserForm.wechatNo = data.wechatNo;
        this.etOnlineUserForm.email = data.email;
        this.etOnlineUserForm.mobile = data.mobile;
        this.etOnlineUserForm.lodging = data.lodging;
        this.title = "修改";
        this.responseDept = data.responseDept;
        this.responseSite = data.responseSite;
        this.etOnlineUserWindow = true;
      },
      openEtOnlineUserWindow: function () {
        if (this.$refs['etOnlineUserForm'] !== undefined) {
          this.$refs['etOnlineUserForm'].resetFields();
        }
        this.etOnlineUserForm.workId = 0;
        this.etOnlineUserForm.userCode = '';
        this.etOnlineUserForm.cName = '';
        this.etOnlineUserForm.roleName = '';
        this.etOnlineUserForm.responseDept = '';
        this.etOnlineUserForm.responseSite = '';
        this.etOnlineUserForm.telephone = '';
        this.etOnlineUserForm.wechatNo = '';
        this.etOnlineUserForm.lodging = '';
        this.etOnlineUserForm.email = '';
        this.responseDept = "";
        this.responseSite = "";
        this.siteList = [];
        this.etOnlineUserWindow = true;
      },
      //选择科室
      doSelect(responseDept) {
        this.etOnlineUserForm.responseDept = responseDept;
        this.responseDept = responseDept;
        api.post(api.url.etOnlineUserInfo.responseSiteList, {id: responseDept}).then((data) => {
          if (data.status === 'success') {
            this.siteList = data.siteList;
          }
        });
      },
      //选在站点
      doSiteSelect(responseSite) {
        this.etOnlineUserForm.responseSite = responseSite;
        this.responseSite = responseSite;
      },
      openLineUploadWindow: function () {
        this.fileList = [];
        this.uploadWindow = true;
        this.action = api.url.etOnlineUserInfo.uploadFile
          + '?pmId=' + this.$parent.getProjectId()
          + '&operator=' + this.$parent.getUserId()
          + '&serialNo=' + this.$parent.getCustomerId();
      },
      onlineAddOrModify: function (formName) { //增加或者修改数据
        var json = {
          id: this.etOnlineUserForm.workId,
          userCode: this.etOnlineUserForm.userCode,
          cName: this.etOnlineUserForm.cName,
          roleName: this.etOnlineUserForm.roleName,
          responseDept: this.etOnlineUserForm.responseDept,
          responseSite: this.etOnlineUserForm.responseSite,
          telephone: this.etOnlineUserForm.telephone,
          wechatNo: this.etOnlineUserForm.wechatNo,
          lodging: this.etOnlineUserForm.lodging,
          email: this.etOnlineUserForm.email,
          pmId: this.$parent.getProjectId(),
          cId: this.$parent.getContractId(),
          operator: this.$parent.getUserId()
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.post(api.url.etOnlineUserInfo.addOrModify, json).then((data) => {
              if (data.status == 'success') {
                this.$message({type: 'success', message: '操作成功!'});
                this.refreshPage();
              } else {
                this.$message({type: 'error', message: '工号重复，操作失败!'});
              }
            });
            this.etOnlineUserWindow = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      deleteEtOnlineUsetInfoDetails: function (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.etOnlineUserInfo.deleteUser, {'id': id}).then((data) => {
            if (data.status == "success") {
              this.$message({type: 'success', message: '删除成功!'});
              this.refreshPage();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      downloadExcelLineUser: function () {
        window.open(api.url.etOnlineUserInfo.exportExcel + '?pmId=' + this.$parent.getProjectId());
      },
      //确认完成
      doConfirm: function () {
        let pmId = this.$parent.getProjectId();
        let confirmText = '';
        let succMessage = '';
        let calMessage = '';
        let isSupportStaff = 0;
        let isEnd = 0;
        if (!this.onlineActive) {
          confirmText = '此操作将确认上线支持人员工作完成, 是否继续?';
          succMessage = '确认成功';
          calMessage = '已取消确认';
          isSupportStaff = 1;
          isEnd = 1;
        } else {
          confirmText = '此操作将取消确认上线支持人员工作完成, 是否继续?';
          succMessage = '取消成功';
          calMessage = '已撤销取消';
          isSupportStaff = 0;
          isEnd = 0;
        }
        this.$confirm(confirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.etOnlineUserInfo.confirmUser, {
            pmId: pmId,
            operator: this.$parent.getUserId(),
            isSupportStaff: isSupportStaff,
            isEnd: isEnd,
          }).then((data) => {
            if (data.status == "success") {
              this.$message({type: 'success', message: succMessage});
              if (!this.onlineActive) {
                this.onlineActive = true;
              } else {
                this.onlineActive = false;
              }
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: calMessage
          });
        });
      },
    }
  }

</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
  .testAndHardware {
    padding 0px 15px
  }
</style>

<style lang="stylus">

  .default-row-class {
    color #777777;
  }

  .invalid-row-class {
    color #D0D0D0;
  }


</style>

<!--
* @author: jinxl
* @date: 2018/04/10
* @module:业务流程调研
-->
<template>
  <div class="interfa-comb">
    <div class="step">
      <div class="step_title">
        <span @click="stepState = !stepState">业务流程调研
          <i :class="[stepState ? 'open':'','el-icon-arrow-down']"></i>
        </span>
      </div>
      <transition enterActiveClass="animated fadeInUp">
        <div class="step_body" v-show="stepState">
          <el-steps :active="-1" align-center process-status="finish">
            <el-step title="流程数量确认"></el-step>
            <el-step title="问卷下载和作答"></el-step>
            <el-step title="上传问卷"></el-step>
            <el-step title="问卷记录"></el-step>
            <el-step title="审核员审核"></el-step>
          </el-steps>
        </div>
      </transition>
    </div>
    <div class="w-table">
      <div class="w-table-btn">
        <span @click="confirmFlowNum" :class="{ active: isActive }">
          <i class="iconfont icon-conf-complete"></i>确认完成</span>
        <span @click="addProcess" v-show="!isActive">
          <i class="iconfont icon-new-add"></i>新增</span>
        <span @click="confirmFlowConfig" :class="{ active: isConfig }" v-show="isActive">
          <i class="iconfont icon-conf-complete"></i>提交审核</span>
        <div class="w-table-btn_tip" style="text-align: left">
          <span>流程总数：{{ sumNum }}</span>
          <span>已完成数：{{ comNum }}</span>
        </div>
      </div>
      <div class="w-table-content">
        <el-table :data="businessProcessData" @cell-mouse-enter="getSelectRow" style="width: 100%">
          <el-table-column prop="flowCode" label="流程编号">
          </el-table-column>
          <el-table-column prop="flowName" label="流程名称">
          </el-table-column>
          <el-table-column align="center" label="是否本期范围">
            <template slot-scope="scope">
              <el-select size="mini" v-model="scope.row.isScope" @change="changeScope" :disabled="isActive" placeholder="请选择">
                <el-option-group v-for="group in rangeSelect" :key="group.label" :label="group.label">
                  <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="state" align="center" label="审核状态" :disabled="isActive">
            <template slot-scope="scope">
              <el-dropdown :hide-on-click="false" placement="bottom-start" trigger="click" v-show="!isConfig">
                <span class="el-dropdown-link">
                  <span :class="scope.row.map.stateClass">
                    {{ scope.row.map.stateTxt }}-{{ scope.row.message }}
                  </span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" style="width: 450px;">
                  <el-dropdown-item>
                    <el-radio-group v-model="scope.row.status" :disabled="!isManager">
                      <el-radio :label="1">提交审核</el-radio>
                      <el-radio :label="2">审核不通过</el-radio>
                      <el-radio :label="9">审核通过</el-radio>
                    </el-radio-group>
                    <el-dropdown-item>
                      <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="scope.row.message" :disabled="!isManager">
                      </el-input>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div style="text-align: right;" v-show="isManager">
                        <el-button @click.native="dropdownClose">取 消</el-button>
                        <el-button @click.native="modifyStatus" type="primary">确 定</el-button>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <span :class="scope.row.map.stateClass" v-show="isConfig">
                {{ scope.row.map.stateTxt }}-{{ scope.row.message }}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div class="operate">
                <i @click="openUploadWindow(scope.row.id,scope.row.uploadPath)" class="iconfont icon-conf-complete"></i>
                <i @click="downloadPage(scope.row.downloadPath)" class="iconfont icon-download"></i>
                <i v-show="showOperation(scope.row)" @click="modifyProcess(scope.row)" class="iconfont icon-edit"></i>
                <i @click="downloadPage(scope.row.uploadPath)" class="iconfont icon-to-lead"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="w-table-page">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!--新增-->
    <el-dialog :title="title" width="50%" :visible.sync="newAdd">
      <el-form :model="flowForm" :rules="rules" ref="flowForm" label-width="100px">
        <el-form-item label="流程编号" prop="flowCode" v-show="flowCodeShow" >
          <el-input v-model="flowForm.flowCode" :disabled="flowCodeShow">
          </el-input>
        </el-form-item>
        <el-form-item label="流程名称" prop="flowName">
          <el-input v-model="flowForm.flowName" :disabled="isActive"></el-input>
        </el-form-item>
        <el-form-item label="本期范围" prop="isScope">
          <el-select v-model="flowForm.isScope" placeholder="请选择" :disabled="isActive" style="width: 100%">
            <el-option-group v-for="group in dialogSelect" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="newAdd = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addOrModifyProcess('flowForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--文件上传弹窗-->
    <el-dialog title="文件上传" width="30%" :visible.sync="uploadWindow">
      <el-upload class="upload-demo" :action="action" :on-preview="handlePreview"
                 :on-remove="handleRemove" :on-success="uploadSeccess" :before-remove="beforeRemove" :before-upload="showChange" :limit="1" :on-exceed="handleExceed"
                 :file-list="fileList" :data="extraData">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传
          <span style="color:#F56C6C;">xls/xlsx/doc/docx文件</span>，文件大小不超过500kb</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadWindow = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog width="50%" class="commond-img" :visible.sync="viewImageWindow">
      <el-carousel class="slideImge">
        <el-carousel-item v-for="(item,index) in viewList" :key="index">
          <img v-bind:src="item" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>
<!--JavaScript-->
<script>
import api from '../../../api/api'

export default {
  //数据
  data() {
    return {
      stepState: true,
      sumNum: 10,
      comNum: 5,
      title: '新增',
      isActive: false, //确认数量工作是否完成
      isConfig: false, //提交审核
      isManager: false, //是否项目经理
      isShow: false,
      rangeSelect: [{
        label: '否',
        options: [{
          value: 0,
          label: '本期不实施'
        }, {
          value: 22,
          label: '医院暂时不用'
        }, {
          value: 11,
          label: '其他'
        }]
        }, {
          label: '是',
          options: [{
            value: 1,
            label: '是'
          }]
        }
      ],
      pageSize: 5,
      total: 10,
      currentPage: 1,
      businessProcessData: [
        {
          flowCode: 'WN-YWCL-01-01',
          flowName: '分诊叫号接口',
          isScope: '1',
          stateTxt: '审核不通过',
          map: {
            stateClass: 'disaudit'
          }
        }
      ],
      /*弹窗数据*/
      newAdd: false,
      statusData: [],
      flowForm: {
        id: 0,
        flowCode: '',
        flowName: '',
        isScope: 1,
        status: 0,
        message: ''
      },
      rules: {
        flowName: { required: true, message: '请输入流程名称' },
        isScope: { required: true, message: '请选择范围', trigger: 'change' }
      },
      dialogSelect: [{
        label: '否',
        options: [{
          value: 0,
          label: '本期不实施'
        }, {
          value: 22,
          label: '医院暂时不用'
        }, {
          value: 11,
          label: '其他'
        }]
      },
        {
        label: '是',
        options: [{
          value: 1,
          label: '是'
        }]
      }
      ],
      uploadWindow: false,
      fileList: [],
      action: api.url.businessProcess.upload,
      operateRowId: 0,
      operateRow: {},
      viewList: [],
      viewImageWindow: false,
      uploadFilePath: '',
      flowCodeShow:false,
      extraData:{} //上传额外的数据
    }
  },
  created() {
    this.$parent.setSelectDisable(true);
    this.$parent.setProjectInfo();
    this.initCode();
    this.$nextTick(function () {
      this.initBusinessProcess();
      this.checkStep();
      this.checkUserAuth();
    })
  },
  methods: {
    //==================业务流程数量确认===========================//
    initCode() {
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'audiType' }).then((data) => {
        this.statusData = data.data;
      });
    },
    initQueryJson() { //分页通用查询使用参数
      let pageSize = this.pageSize;
      let first = (this.currentPage - 1) * pageSize;
      let queryJson = {
        'first': first,
        'count': this.pageSize,
        'pmId': this.$parent.getProjectId(),
        'cId': this.$parent.getContractId(),
        'serialNo': this.$parent.getCustomerId()
      };
      return queryJson;
    },
    checkStep() { //检查当前步骤是否完成，修改属性值
      let pmId = this.$parent.getProjectId();
      api.post(api.url.businessProcess.checkAffirm, { 'pmId': pmId }).then((data) => {
        if (data.status === 'success') {
          this.isActive = data.isActive == 0 ? false : true;
          this.isConfig = data.isConfig == 0 ? false : true;
        }
      });
      this.isManager = this.$store.state.userAuth;
      console.log(this.isManager);
    },
    checkUserAuth() { ///用户是否是项目经理
      let json = {
        xmlcb: this.$parent.getProjectId(),
        ry: this.$parent.getUserId()
      };
      api.post(api.url.userInfo.authInfo, json).then((data) => {
        if (data.status == 'success') {
          this.isManager = data.data == 0 ? true : false;
        }
      });
    },
    //页面数据初始化
    initBusinessProcess() {
      let queryJson = this.initQueryJson();
      api.post(api.url.businessProcess.initData, queryJson).then((data) => {
        if (data.status == 'success') {
          this.businessProcessData = data.rows;
          this.total = data.total;
          this.sumNum = data.sumNum;
          this.comNum = data.comNum;
        }
      });
    },
    //流程完成总数变化
    changeBusinessCount() {
      let queryJson = this.initQueryJson();
      api.post(api.url.businessProcess.countInfo, queryJson).then((data) => {
        if (data.status == 'success') {
          this.sumNum = data.sumNum;
          this.comNum = data.comNum;
        }
      });
    },
    //添加新的业务流程
    addProcess() {
      if (this.$refs['flowForm'] !== undefined) {
        this.$refs['flowForm'].resetFields();
      }
      this.title = "新增";
      this.flowForm.isScope = 1;
      this.flowCodeShow = false;
      this.newAdd = true;
    },
    //修改业务流程
    modifyProcess(data) {
      if (this.$refs['flowForm'] !== undefined) {
        this.$refs['flowForm'].resetFields();
      }
      this.title = "修改";
      this.flowCodeShow = true;
      this.flowForm.id = data.id;
      this.flowForm.flowCode = data.flowCode;
      this.flowForm.flowName = data.flowName;
      this.flowForm.isScope = data.isScope;
      this.flowForm.status = data.status;
      this.flowForm.message = data.message;
      this.newAdd = true;
    },
    //业务流程保存
    addOrModifyProcess(formName) {
      var json = {
        id: this.flowForm.id,
        flowCode: this.flowForm.flowCode,
        flowName: this.flowForm.flowName,
        isScope: this.flowForm.isScope,
        status: this.flowForm.status,
        message: this.flowForm.message,
        operator: this.$parent.getUserId(),
        pmId: this.$parent.getProjectId(),
        cId: this.$parent.getContractId(),
        serialNo: this.$parent.getCustomerId()
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.post(api.url.businessProcess.addOrModify, json).then((data) => {
            if (data.status = 'success') {
              this.flowForm.id = 0;
              this.initBusinessProcess();
            }
          });
          this.newAdd = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //确认完成 流程数量确认工作
    confirmFlowNum() {
      let pmId = this.$parent.getProjectId();
      let confirmText = '';
      let succMessage = '';
      let calMessage = '';
      let isFlowAffirm = 0;
      if (!this.isActive) {
        confirmText = '此操作将确认流程调研的范围, 是否继续?';
        succMessage = '确认成功';
        calMessage = '已取消确认';
        isFlowAffirm = 1;
      } else {
        confirmText = '此操作将取消确认流程调研的范围, 是否继续?';
        succMessage = '取消成功';
        calMessage = '已撤销取消';
        isFlowAffirm = 0;
      }
      this.$confirm(confirmText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.post(api.url.businessProcess.confirmFlowNum, {
          'pmId': pmId,
          'isFlowAffirm': isFlowAffirm
        }).then((data) => {
          if (data.status == "success") {
            this.$message({ type: 'success', message: succMessage });
            if (!this.isActive) {
              this.isActive = true;
            } else {
              this.isActive = false;
            }
          }
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: calMessage
        });
      });
    },
    //节点2 流程配置
    confirmFlowConfig() {
      let pmId = this.$parent.getProjectId();
      let confirmText = '';
      let succMessage = '';
      let calMessage = '';
      let isFlowConfig = 0;
      if (!this.isConfig) {
        confirmText = '提交流程配置工作审核, 是否继续?';
        succMessage = '确认成功';
        calMessage = '已取消确认';
        isFlowConfig = 1;
      } else {
        confirmText = '取消提交流程配置工作审核, 是否继续?';
        succMessage = '取消成功';
        calMessage = '已撤销取消';
        isFlowConfig = 0;
      }
      this.$confirm(confirmText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.post(api.url.businessProcess.confirmFlowConfig, {
          'pmId': pmId,
          'isFlowConfig': isFlowConfig
        }).then((data) => {
          if (data.status == "success") {
            this.$message({ type: 'success', message: succMessage });
            if (!this.isConfig) {
              this.isConfig = true;
              /*this.isShow = false;*/
            } else {
              this.isConfig = false;
              /* this.isShow = true;*/
            }
          }
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: calMessage
        });
      });
    },
    downloadPage(downloadPath) {
      if (downloadPath) {
        window.open(api.url.siteCenter.imagePath+downloadPath);
      } else {
        this.$alert('当前文件没有提供下载文件', '下载提示', {
          confirmButtonText: '确定'
        });
      }
    },
    openUploadWindow(id, uploadPath) {
      this.action = api.url.businessProcess.upload;
      this.extraData = {
        id:id,
        pmId: this.$parent.getProjectId(),
        cId: this.$parent.getContractId(),
        serialNo: this.$parent.getCustomerId()
      };
      if (uploadPath && uploadPath !== "") {
        this.fileList = [{
          id: id,
          name: uploadPath.substring(uploadPath.lastIndexOf('/') + 1),
          url: api.url.siteCenter.imagePath + uploadPath
        }];
        this.$confirm('当前流程已经上传了文件，再次上传将替换已经上传的文件', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.uploadWindow = true;
        }).catch(() => {
          this.$message({ type: 'info', message: '取消上传' });
        });
      } else {
        this.uploadWindow = true;
      }
    },
    //pageSize改变事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.initBusinessProcess();
    },
    //currentPage改变事件
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initBusinessProcess();
    },
    //上传成功
    uploadSeccess: function (response) {
      if (response.status == 'success') {
        this.fileList = [];
        this.uploadWindow = false;
        this.initBusinessProcess();
      } else {
        this.uploadWindow = false;
        this.$message.error(response.msg);
      }
    },
    //移除上传文件
    handleRemove(file, fileList) {
      //console.log(file, fileList);
    },
    //展示
    handlePreview(file) {
      //console.log(file);
      console.log(file, fileList);
    },
    //限制文件
    handleExceed(files, fileList) {
      console.log(files);
      console.log(fileList);
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件,请先删除文件【${
        fileList[0].name
        }】`);
    },
    //移除
    beforeRemove(file, fileList) {
      if (file.id) {
        return this.$confirm(`此操作将永久删除【 ${file.name}】,是否继续？`).then(() => {
          api.post(api.url.businessProcess.deleteFile, {
            'id': file.id,
            operator: this.$parent.getUserId()
          }).then((data) => {
            if (data.status == "success") {
              this.initBusinessProcess();
              this.$message({ type: 'success', message: "文件删除成功" });
            }
          });
        }).catch(() => {
          this.$message({ type: 'info', message: '取消删除' });
        });
      }

    },
    //实施范围变更事件
    changeScope(data) {
      let changeJson = {
        id: this.operateRowId,
        isScope: data,
        operator: this.$parent.getUserId()
      };
      api.post(api.url.businessProcess.changeScope, changeJson).then((data) => {
        if (data.status == 'success') {
          this.changeBusinessCount();
        }
      });
    },
    //获取当前行的ID
    getSelectRow: function (row) {
      this.operateRowId = row.id;
      this.operateRow = row;
    },
    //是否显示操作 admin添加的不允许修改
    showOperation: function (data) {
      if (this.isActive) {
        return false;
      }
      if (!data.flowId) {
        return true;
      } else {
        return false;
      }
    },
    dropdownClose(e) {
      document.getElementById(e.target.offsetParent.id).style.display = "none";
    },
    modifyStatus(e) {
      let data = this.operateRow;
      let json = {
        id: data.id,
        status: data.status,
        message: data.message,
        pmId: this.$parent.getProjectId(),
        cId: this.$parent.getContractId(),
        serialNo: this.$parent.getCustomerId(),
        operator: this.$parent.getUserId()
      };
      api.post(api.url.businessProcess.addOrModify, json).then((data) => {
        if (data.status === 'success') {
          document.getElementById(e.target.offsetParent.id).style.display = "none";
          this.initBusinessProcess();
        }
      });
    },
    showImage(uploadPath) {
      this.viewList = [];
      if (uploadPath != '') {
        let path = uploadPath.split(';');
        if (path.length > 0) {
          for (var i = 0; i < path.length; i++) {
            this.viewList[i] = api.url.siteCenter.imagePath + path[i];
          }
          this.viewImageWindow = true;
        }
      } else {
        this.$alert('当前文件没有提供预览文件', '预览提示', {
          confirmButtonText: '确定'
        });
      }

    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    showChange(file) {
      let hz = file.name.substring(file.name.lastIndexOf('.') + 1);
      console.log(hz === 'xls');
      console.log(hz !== 'xls' || hz !== 'xlsx' || hz !== 'doc' || hz !== 'docx');
      if (hz === 'xls' || hz === 'xlsx' || hz === 'doc' || hz === 'docx') {
        return true;
      } else {
        this.$message.warning(`文件格式类型只支持xls,xlsx,doc,docx`);
        return false;
      }
      return true;
    }
  }
}

</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
.interfa-comb {
  padding: 0px 15px;
}

.step {
  padding: 20px 15px 20px;
}

.step_title {
  margin-bottom: 10px;
}

.step_title span {
  color: #666666;
  font-size: 14px;
  cursor: pointer;
}

.step_title span i {
  margin-left: 5px;
  transition: all ease 0.5s;
}

.step_title span i.open {
  margin-left: 5px;
  transform: rotate(180deg);
}

.step_body {
  padding: 20px 10px;
  border-radius: 3px;
  border: 1px solid #f8f8f8;
}

/* 审核状态 */
.audit {
  color: #666666;
}

.disaudit {
  color: #ff7171;
}

.audited {
  color: #2fdd2f;
}

/* 进程状态 */
.rocess-state {
  display: flex;
}

.rocess-state > div {
  flex-grow: 1;
  line-height: 1;
  color: #e5e5e5;
}

.rocess-state > div i {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-bottom: 5px;
  border-radius: 50%;
  border: 1px solid #1e90ff;
}

.rocess-state > div.state {
  color: #ff4d4d;
}

.rocess-state > div.state i {
  border: none;
  background: #ff7171;
}
</style>
<!--CSS-RESET-->
<style lang="stylus">
.interfa-comb {
  padding: 0px 15px;
}

.step {
  padding: 20px 15px 20px;
}

.step_title {
  margin-bottom: 10px;
}

.step_title span {
  color: #666666;
  font-size: 14px;
  cursor: pointer;
}

.step_title span i {
  margin-left: 5px;
  transition: all ease 0.5s;
}

.step_title span i.open {
  margin-left: 5px;
  transform: rotate(180deg);
}

.step_body {
  padding: 20px 10px;
  border-radius: 3px;
  border: 1px solid #f8f8f8;
}

/* 审核状态 */
.audit {
  color: #666666;
}

.disaudit {
  color: #ff7171;
}

.audited {
  color: #2fdd2f;
}

/* 进程状态 */
.rocess-state {
  display: flex;
}

.rocess-state > div {
  flex-grow: 1;
  line-height: 1;
  color: #e5e5e5;
}

.rocess-state > div i {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-bottom: 5px;
  border-radius: 50%;
  border: 1px solid #1e90ff;
}

.rocess-state > div.state {
  color: #ff4d4d;
}

.rocess-state > div.state i {
  border: none;
  background: #ff7171;
}
</style>

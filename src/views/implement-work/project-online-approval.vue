<!--
* @author: jinxl
* @date: 2018/4/16
* @module:项目上线审批
-->
<template>
  <div class="project-online">
    <el-tabs v-model="activeName" type="card" @tab-click="tabSwitch">
      <el-tab-pane label="模拟运行情况" name="first">
        <el-button @click="addNewSimulate" icon="el-icon-plus" size="mini">新增模拟情况</el-button>
        <div v-for="mockForm in mockData">
          <el-form ref="mockForm" class="mockForm" :model="mockForm" labelWidth="80px" size="medium">
            <el-input v-model="mockForm.id" v-if="idShow"></el-input>
            <el-row :gutter="20">
              <el-col :md="24" :lg="24">
                <h2 class="project-online_title">
                  {{ mockForm.simulateName }}
                  <time>
                    {{mockForm.map.createDate }}
                  </time>
                  <i @click="deleteMock(mockForm.id,mockForm.simulateCode)" class="project-online_del iconfont icon-delete"></i>
                </h2>

              </el-col>
              <el-col :md="8" :lg="8">
                <el-form-item label="模拟范围">
                  <el-input v-model="mockForm.simulateCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="8" :lg="8">
                <el-form-item label="模拟效果">
                  <el-select v-model="mockForm.simulateResult" placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in effectSelect" :key="item.dictSort" :label="item.dictLabel" :value="item.dictV">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :lg="8">
                <el-form-item label="是否达到上线要求" labelWidth="130px">
                  <el-radio-group v-model="mockForm.isOnline">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24">
                <el-form-item label="主要问题">
                  <el-input v-model="mockForm.question"></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24">
                <el-form-item label="备注">
                  <el-input type="textarea" v-model="mockForm.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :md="23" :lg="23">
                <el-form-item label="问题清单">
                  <div v-for="fileInfo in convertToArray(mockForm.filePath)">
                    <div class="problem-item">
                      <span>{{ fileInfo.name }}</span>
                      <span>{{ fileInfo.userName }}</span>
                      <span>{{ fileInfo.operDate }}</span>
                      <div class="problem-item_btn">
                        <i @click="downloadInfo(fileInfo.url)" class="iconfont icon-download"></i>
                        <i @click="deleteUploadFile(mockForm.id,fileInfo.id,fileInfo.name)" class="iconfont icon-delete"></i>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :md="1" :lg="1">
                <i class="iconfont icon-new-add add-problem" @click="openUploadWindow(mockForm.id,mockForm)"></i>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="24" :lg="24" class="project-save">
                <el-button @click="modifySimulateInfo(mockForm)" type="primary" size="small">保存</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="上线可行性评估" name="second">
        <div class="w-table-btn">
          <span @click="confirmWorkByType('3')" :class="{ active:onlineActive }">
            <i class="iconfont icon-conf-complete"></i>确认完成</span>
        </div>
        <el-form labelWidth="80px" size="medium">
          <el-row>
            <el-col :md="24" :lg="24">
              <h2 class="project-online_title">上线工作完成情况</h2>
            </el-col>
            <el-col :md="24" :lg="24">
              <div id="main" style="width: 100%;height: 300px;"></div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24" :lg="24">
              <h2 class="project-online_title">上传报告</h2>
            </el-col>
            <el-col :md="23" :lg="23">
              <el-form-item label="">
                <div v-for="fileInfo in  onlineFile">
                  <div class="problem-item">
                    <span>{{ fileInfo.name }}</span>
                    <span>{{ fileInfo.userName }}</span>
                    <span>{{ fileInfo.operDate }}</span>
                    <div class="problem-item_btn">
                      <i @click="downloadInfo(fileInfo.url)" class="iconfont icon-download"></i>
                      <i @click="deleteOnlineFile(fileInfo.id,fileInfo.name)" class="iconfont icon-delete"></i>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :md="1" :lg="1">
              <i @click="openUploadWindow('3')" class="iconfont icon-new-add add-problem"></i>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="上线切换方案" name="third">
        <div class="w-table-btn">
          <span @click="confirmWorkByType('4')" :class="{ active:switchActive }">
            <i class="iconfont icon-conf-complete"></i>确认完成</span>
        </div>
        <el-form labelWidth="80px" size="medium">
          <el-row>
            <el-col :md="24" :lg="24">
              <h2 class="project-online_title">上线报告</h2>
            </el-col>
            <el-col :md="23" :lg="23">
              <el-form-item label="问题清单">
                <div v-for=" fileInfo in switchFile">
                  <div class="problem-item">
                    <span>{{ fileInfo.name }}</span>
                    <span>{{ fileInfo.userName }}</span>
                    <span>{{ fileInfo.operDate }}</span>
                    <div class="problem-item_btn">
                      <i @click="downloadInfo(fileInfo.url)" class="iconfont icon-download"></i>
                      <i @click="deleteOnlineFile(fileInfo.id,fileInfo.name)" class="iconfont icon-delete"></i>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :md="1" :lg="1">
              <i @click="openUploadWindow('5')" class="iconfont icon-new-add add-problem"></i>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24" :lg="24">
              <h2 class="project-online_title">上传照片</h2>
            </el-col>
            <el-col :md="24" :lg="24">
              <el-upload :action="switchAction" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="deleteSwitchImg" :file-list="switchImgFile">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!--新增模拟记录-->
    <el-dialog title="新增模拟记录" width="30%" :visible.sync="newSimulateWindow">
      <el-form :model="simulateNameForm" :rules="simulateNameRules" ref="simulateNameForm">
        <el-form-item label="模拟记录名称" label-width="110px" prop="simulateName" required>
          <el-input v-model="simulateNameForm.simulateName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newSimulateWindow = false">取 消</el-button>
        <el-button type="primary" @click="addSimulateRecord('simulateNameForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--文件上传弹窗-->
    <el-dialog title="文件上传" width="30%" :visible.sync="uploadWindow">
      <el-upload class="upload-demo" :action="mockAction" :on-remove="handleRemove" :on-success="uploadSeccess" :limit="1" :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">文件大小不超过500kb</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadWindow = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<!--JavaScript-->
<script>
import filters from '../../filters/filters'
import api from '../../../api/api'
import echarts from 'echarts'

export default {
  //数据
  data() {
    return {
      activeName: 'first',
      onlineActive: false, //评估报告是否完成
      switchActive: false, //切换报告是否完成
      newSimulateWindow: false,
      simulateNameForm: { //模拟记录表单初始化
        simulateName: ''
      },
      simulateNameRules: { //模拟记录名称校验规则
        simulateName: [
          { required: true, message: '请输入模拟记录名称', trigger: 'blur' }
        ]
      },
      idShow: false, //id隐藏
      mockForm: { //模拟运行表单
        id: 0,
        simulateName: '',
        map: { createDate: '' },
        simulateCode: '',
        simulateResult: 0,
        isOnline: 0,
        question: '',
        remark: '',
        filePath: [{}]
      },
      fileInfo: { //上传文件信息
        id: 0,
        name: '',
        url: '',
        userName: '',
        operDate: ''
      },
      mockData: [], //模拟运行数据
      uploadWindow: false, //上传文件框参数
      mockAction: api.url.simulateRecord.upload,
      fileList: [],
      effectSelect: [
        {
          label: '不好',
          value: '1'
        },
        {
          label: '良好',
          value: '2'
        },
        {
          label: '很不好',
          value: '3'
        },
        {
          label: '达到上线要求',
          value: '4'
        }
      ],
      uploadWindow: false,
      itemData: [],
      completeData: [],
      failData: [],
      onlineFile: [], //上线可行性报告
      onLineWindow: false,
      switchAction: api.url.onLineReport.upload,
      switchFile: [], //切换方案
      switchImgFile: [], //切换方案图片
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created() {
    this.$parent.setSelectDisable(true);
    this.$parent.setProjectInfo();
    this.initCodes();
    this.$nextTick(function () {
      this.initSimulateRecord();
    });
  },
  methods: {
    tabSwitch: function (tab, event) {
      this.activeName = tab.name;
      if (this.activeName === 'first') {
        this.initSimulateRecord();
      } else if (this.activeName === 'second') {
        this.initWorkStatus('3');
        this.initOnlineReport();
      } else if (this.activeName === 'third') {
        this.initWorkStatus('4');
        this.initSwitchImgAction();
        this.initSwitchReport();
      }
    },
    //加载字典表
    initCodes() {
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'simulateResult' }).then((data) => {
        this.effectSelect = data.data;
      });
    },
    //初始化切换图片上传action
    initSwitchImgAction() {
      this.switchAction = api.url.onLineReport.upload + '?operator=' + this.$parent.getUserId() + '&fileType=' + 4 + '&serialNo=' + this.$parent.getCustomerId() + '&pmId=' + this.$parent.getProjectId()
        + '&cId=' + this.$parent.getContractId();
    },
    initWorkStatus(type) {
      let json = {
        pmId: this.$parent.getProjectId(),
        fileType: type
      };
      api.post(api.url.onLineReport.checkWork, json).then((data) => {
        if (data.status === 'success') {
          if (type === '3') {
            this.onlineActive = data.workStatus;
          } else {
            this.switchActive = data.workStatus;
          }
        }
      });
    },
    //获取模拟记录
    initSimulateRecord: function () {
      let json = {
        pmId: this.$parent.getProjectId(),
        cId: this.$parent.getContractId(),
        serialNo: this.$parent.getCustomerId()
      };
      api.post(api.url.simulateRecord.initData, json).then((data) => {
        if (data.status = 'success') {
          this.mockData = data.rows;
        }
      });
    },
    //打开添加页面
    addNewSimulate: function () { //显示新增模拟名称
      if (this.$refs['simulateNameForm'] !== undefined) {
        this.$refs['simulateNameForm'].resetFields();
      }
      this.newSimulateWindow = true;
    },
    //添加新的模拟记录
    addSimulateRecord(formName) { //模拟名称信息
      let json = {
        simulateName: this.simulateNameForm.simulateName,
        pmId: this.$parent.getProjectId(),
        cId: this.$parent.getContractId(),
        serialNo: this.$parent.getCustomerId(),
        operator: this.$parent.getUserId()
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.post(api.url.simulateRecord.addOrModify, json).then((data) => {
            if (data.status = 'success') {
              this.initSimulateRecord();
            }
          });
          this.newSimulateWindow = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //转换字符串到数组
    convertToArray(filePath) {
      let arr = [];
      if (filePath) {
        arr = eval(filePath);
      }
      return arr;
    },
    //删除上传文件
    deleteUploadFile(recordId, id, name) {
      this.$confirm('即将永久删除上传文件[' + name + ']，确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.post(api.url.simulateRecord.deleteFile, { 'id': id, 'sourceId': recordId }).then((data) => {
          if (data.status === "success") {
            this.$message({ type: 'success', message: '删除成功' });
            this.initSimulateRecord();
          }
        });
      }).catch(() => {
        this.$message({ type: 'info', message: '取消删除' });
      });
    },
    //修改模拟运行记录
    modifySimulateInfo(mockForm, type) {
      let json = {
        id: mockForm.id,
        pmId: this.$parent.getProjectId(),
        cId: this.$parent.getContractId(),
        serialNo: this.$parent.getCustomerId(),
        simulateName: mockForm.simulateName,
        simulateCode: mockForm.simulateCode,
        simulateResult: mockForm.simulateResult,
        isOnline: mockForm.isOnline,
        question: mockForm.question,
        remark: mockForm.remark,
        operator: this.$parent.getUserId()
      };
      console.log(type);
      api.post(api.url.simulateRecord.addOrModify, json).then((data) => {
        if (data.status = 'success') {
          if (type != 0) {
            this.$message({ type: 'success', message: '保存成功' });
          }
          this.initSimulateRecord();
        }
      });
    },
    //删除模拟记录
    deleteMock(id, name) {
      this.$confirm('即将永久删除模拟记录[' + name + ']，确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.post(api.url.simulateRecord.delete, { 'id': id }).then((data) => {
          if (data.status == "success") {
            this.$message({ type: 'success', message: '删除成功' });
            this.initSimulateRecord();
          }
        });
      }).catch(() => {
        this.$message({ type: 'info', message: '取消删除' });
      });
    },
    //============================上线可行性报告=======================================//
    initUploadAction() {
      this.switchAction = api.url.onLineReport.upload + '?operator=' + this.$parent.getUserId() + '&fileType=' + id + '&serialNo=' + this.$parent.getCustomerId() + '&pmId=' + this.$parent.getProjectId()
        + '&cId=' + this.$parent.getContractId();
    },
    initOnlineReport() {
      let json = {
        pmId: this.$parent.getProjectId(),
        cId: this.$parent.getContractId(),
        serialNo: this.$parent.getCustomerId()
      };
      api.post(api.url.onLineReport.initData, json).then((data) => {
        if (data.status === 'success') {
          this.itemData = data.itemData;
          this.completeData = data.completeData;
          this.failData = data.failData;
          this.onlineFile = data.data;
          this.showEchart();
        }
      });
    },
    //上传文件局部刷新
    refreshUploadFile() {
      let json = {
        pmId: this.$parent.getProjectId(),
        cId: this.$parent.getContractId(),
        serialNo: this.$parent.getCustomerId()
      };
      api.post(api.url.onLineReport.refreshFile, json).then((data) => {
        if (data.status === 'success') {
          this.onlineFile = data.data;
        }
      });
    },
    showEchart: function () {
      let dataStyle = {
        normal: {
          label: {
            show: true,
            position: 'inside',
          }
        },
        borderColor: '#f00',
        borderWidth: 10,
        borderType: 'solid'
      };
      let option = {
        tooltip: {
          show: true,
          trigger: 'item'
        },
        legend: {
          data: ['已完成', '未完成'],
          textStyle: {
            color: '#666'
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '10%',
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: this.itemData,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: '#666666',
              fontFamily: 'Microsoft YaHei'
            },
            axisLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: '#93abba'
            },
            axisLine: {
              lineStyle: {
                color: '#93abba'
              }
            }
          }
        ],
        series: [
          {
            name: '已完成',
            type: 'bar',
            stack: '总量',
            itemStyle: dataStyle,
            data: this.completeData
          },
          {
            name: '未完成',
            type: 'bar',
            stack: '总量',
            itemStyle: dataStyle,
            data: this.failData
          }
        ],
        color: ['#7537ed', '#ba9bf6']
      };
      setTimeout(_ => {
        let myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(option);
      }, 0);
    },
    //删除上传文件
    deleteOnlineFile(id, name) {
      let json = {
        id: id
      };
      this.$confirm('即将永久删除上传文件[' + name + ']，确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.post(api.url.onLineReport.delete, json).then((data) => {
          if (data.status == "success") {
            this.$message({ type: 'success', message: '删除成功' });
            if (this.activeName === 'first') {
              this.initSimulateRecord();
            } else if (this.activeName === 'second') {
              this.refreshUploadFile();
            } else if (this.activeName === 'third') {
              this.initSwitchReport();
            }
          }
        });
      }).catch(() => {
        this.$message({ type: 'info', message: '取消删除' });
      });
    },
    //==========================上线切换方案=========================================//
    initSwitchReport() {
      let json = {
        serialNo: this.$parent.getCustomerId()
      };
      api.post(api.url.onLineReport.initSwitchData, json).then((data) => {
        if (data.status === 'success') {
          this.switchFile = data.switchFile; //切换方案
          this.switchImgFile = data.switchImgFile; //切换方案图片
        }
      });
    },
    deleteSwitchImg(file, fileList) {
      console.log(file.id);
      let json = {
        id: file.id
      };
      this.$confirm('即将永久删除上传文件[' + file.name + ']，确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.post(api.url.onLineReport.delete, json).then((data) => {
          if (data.status == "success") {
            this.$message({ type: 'success', message: '删除成功' });
            this.initSwitchReport();
          }
        });
      }).catch(() => {
        this.initSwitchReport();
        this.$message({ type: 'info', message: '取消删除' });
      });
    },
    //============================通用方法=====================================//
    confirmWorkByType(type) {
      let json = {};
      let confirmText = '';
      let succMessage = '';
      let calMessage = '';
      if (type === '3') { //上线报告
        json = {
          pmId: this.$parent.getProjectId(),
          fileType: type,
          status: this.onlineActive === false ? 1 : 0,
          operator: this.$parent.getUserId()
        };
        if (!this.onlineActive) {
          confirmText = '此操作将确认完成上线评估工作, 是否继续?';
          succMessage = '确认成功';
          calMessage = '已取消确认';
        } else {
          return;
        }
      } else { //切换报告
        json = {
          pmId: this.$parent.getProjectId(),
          fileType: type,
          status: this.switchActive === false ? 1 : 0,
          operator: this.$parent.getUserId()
        };
        if (!this.switchActive) {
          confirmText = '此操作将确认完成上线切换方案工作, 是否继续?';
          succMessage = '确认成功';
          calMessage = '已取消确认';
        } else {
          return;
        }
      }
      this.$confirm(confirmText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.post(api.url.onLineReport.confirm, json).then((data) => {
          if (data.status == "success") {
            this.$message({ type: 'success', message: succMessage });
            if (type === '3') {
              this.onlineActive = !this.onlineActive;
            } else {
              this.switchActive = !this.switchActive;
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
    //打开上传页面
    openUploadWindow(id, mockForm) {
      this.fileList = [];
      if (this.activeName === 'first') {
        this.mockAction = api.url.simulateRecord.upload + '?id=' + id + '&operator=' + this.$parent.getUserId();
      } else {
        this.mockAction = api.url.onLineReport.upload + '?operator=' + this.$parent.getUserId() + '&fileType=' + id + '&serialNo=' + this.$parent.getCustomerId() + '&pmId=' + this.$parent.getProjectId()
          + '&cId=' + this.$parent.getContractId();
      }
      if (mockForm) {
        this.modifySimulateInfo(mockForm, 0);
      }

      this.uploadWindow = true;
    },
    //上传成功
    uploadSeccess: function (response) {
      if (response.status === 'success') {
        this.fileList = [];
        this.uploadWindow = false;
        if (this.activeName === 'first') {
          this.initSimulateRecord();
        } else if (this.activeName === 'second') {
          this.refreshUploadFile();
        } else if (this.activeName === 'third') {
          this.initSwitchReport();
        }
      } else {
        this.$message.error(response.msg);
        this.uploadWindow = false;
      }
    },
    //下载文件
    downloadInfo(url) {
      window.open(url);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
  computed: {
    reversedMessage: function () {
    }
  },
  watch: {
    message: function () {
    }
  },
  filters: {
    removeSpace: function (value) {
      return filters.stringFormat.removeSpace(value);
    }
  }
}

</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
.project-online {
  padding: 15px;
}

.mockForm {
  margin-top: 15px;
}

.project-online_title {
  margin: 20px 0px;
  padding-left: 10px;
  color: #333;
  font-size: 14px;
  border-left: 2px solid #1e90ff;
}

.project-online_title>time {
  margin-left: 10px;
  color: #cccccc;
  font-size: 12px;
}

.problem-item {
  display: flex;
  height: 36px;
  margin-bottom: 15px;
  padding-left: 10px;
  color: #666;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.problem-item>* {
  margin-right: 10px;
}

.problem-item_btn {
  margin-left: 60px;
  color: #ccc;
}

.problem-item_btn > i {
  margin-right: 19px;
  cursor: pointer;
}

.problem-item_btn > i:hover {
  color: #1e90ff;
}

.add-problem {
  display: inline-block;
  height: 36px;
  line-height: 36px;
  color: #1e90ff;
  cursor: pointer;
}

.project-save {
  text-align: right;
}
</style>

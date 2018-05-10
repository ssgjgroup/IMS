<!--
* @author: jinxl
* @date: 2018/3/27
* @module:指挥中心安排
-->
<template>
  <div class="commond">
    <div class="w-table">
      <div class="w-table-btn">
        <!--<span ><i class="iconfont icon-to-lead"></i>确认完成</span>-->
        <span @click="chart= true;">
          <i class="iconfont icon-job-weight"></i>工作比重</span>
      </div>
      <div class="w-table-content">
        <el-table :data="commondTableData" style="width: 100%" @cell-mouse-enter="showInfo">
          <el-table-column type="selection" align="center" width="55" prop="id">
          </el-table-column>
          <el-table-column prop="siteName" label="站点名称" align="center">
          </el-table-column>
          <el-table-column prop="productName" label="系统">
          </el-table-column>
          <el-table-column prop="menuName" label="菜单">
          </el-table-column>
          <el-table-column prop="map.dict_label" label="问题类别">
          </el-table-column>
          <el-table-column prop="questionDesc" label="问题描述">
          </el-table-column>
          <el-table-column prop="map.create_name" label="登记人" width="100px">
          </el-table-column>
          <el-table-column prop="map.createTimeString" label="登记时间">
          </el-table-column>
          <el-table-column align="center" label="处理方式">
            <template slot-scope="scope">
              <el-select v-model="scope.row.operType" size="mini" @change="operTypeChange" placeholder="请选择">
                <el-option v-for="item in selectData.operType" :key="item.dictSort" :label="item.dictLabel" :value="item.dictV">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="优先级">
            <template slot-scope="scope">
              <el-select v-model="scope.row.priority" size="mini" @change="priorityTypeChange" placeholder="请选择">
                <el-option v-for="item in selectData.priority" :key="item.dictSort" :label="item.dictLabel" :value="item.dictV">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="工作分配">
            <template slot-scope="scope">
              <el-select v-model="scope.row.allocateUser" size="mini" @change="allocateUserChange" placeholder="请选择">
                <el-option v-for="item in selectData.workAssig" :key="item.id" :label="item.cName" :value="item.userId">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="map.operatorTimeString" align="center" label="完成时间">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <div class="operate">
                <i @click="openImportPmisWindow(scope.row)" class="iconfont icon-to-lead"></i>
                <i @click="showImageInfo(scope.row.imgPath)" class="iconfont icon-screenshot"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="w-table-page">
        <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total">
        </el-pagination>
      </div>
    </div>
    <!--图表-弹窗-->
    <el-dialog title="实施人员工作比重" width="50%" @open="showEchart" :visible.sync="chart">
      <div id="main"></div>
    </el-dialog>
    <!--图片-弹窗-->
    <el-dialog width="50%" class="enlargeImg" :visible.sync="image">
      <el-upload action="" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="imgPaths">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-dialog>
    <!--导入PMIS弹框-->
    <el-dialog title="导入PMIS" width="40%" :visible.sync="lead">
      <el-row>
        <el-alert
          title="当前问题已经导入PMIS"
          type="success"
          center
          v-show="importPmisStatus"
          show-icon>
        </el-alert>
      </el-row>
      <el-form :model="leadForm" :rules="leadRules" ref="leadForm">
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="批次" label-width="120px" prop="batchNo" required>
              <el-select v-model="leadForm.batchNo" placeholder="请选择">
                <el-option v-for="item in selectData.batchNo" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="问题优先级" label-width="120px" prop="priority" required>
              <el-select v-model="leadForm.priority" placeholder="请选择">
                <el-option v-for="item in selectData.priority" :key="item.dictSort" :label="item.dictLabel" :value="item.dictV">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="问题类别" label-width="120px" prop="questionType" required>
              <el-select v-model="leadForm.questionType" placeholder="请选择">
                <el-option v-for="item in selectData.questionType" :key="item.dictSort" :label="item.dictLabel" :value="item.dictV">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="原因分类" label-width="120px" prop="reasonType" required>
              <el-select v-model="leadForm.reasonType" placeholder="请选择">
                <el-option v-for="item in selectData.reasonType" :key="item.dictSort" :label="item.dictLabel" :value="item.dictV">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="底稿状态" label-width="120px" prop="manuscriptStatus" required>
              <el-select v-model="leadForm.manuscriptStatus" placeholder="请选择">
                <el-option v-for="item in selectData.manuscriptStatus" :key="item.dictSort" :label="item.dictLabel" :value="item.dictV">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="难度" label-width="120px" prop="diffcultLevel" required>
              <el-select v-model="leadForm.diffcultLevel" placeholder="请选择">
                <el-option v-for="item in selectData.diffcultLevel" :key="item.dictSort" :label="item.dictLabel" :value="item.dictV">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="工程师工号" label-width="120px" prop="devUser" required>
             <!-- <el-input v-model="leadForm.devUser" auto-complete="off"></el-input>-->
              <el-autocomplete
                class="inline-input"
                v-model="leadForm.devUser"
                value-key="name"
                value="yhmc"
                :fetch-suggestions="querySearch"
                placeholder="请输入工程师工号"
                :trigger-on-focus="false"
                @select="changeDevUserName"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="公司方接收人" label-width="120px" prop="devUserName" required>
              <el-input v-model="leadForm.devUserName" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="联系人" label-width="120px" prop="linkman">
              <el-input v-model="leadForm.linkman" auto-complete="off" placeholder="请输入联系人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="联系电话" label-width="120px" prop="mobile">
              <el-input v-model="leadForm.mobile" auto-complete="off" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="提出人" label-width="120px" prop="createYHMC">
              <el-input v-model="leadForm.createYHMC" auto-complete="off" :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="提出日期" label-width="120px" prop="createDate">
              <el-date-picker v-model="leadForm.createDate" type="date" :disabled="true"
                              placeholder="选择提出日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="希望完成日期" label-width="120px" prop="hopeFinishDate" required>
              <el-date-picker v-model="leadForm.hopeFinishDate" type="date"
                              placeholder="选择希望完成日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="解决日期" label-width="120px" prop="resolveDate">
              <el-date-picker v-model="leadForm.resolveDate" type="date"
                              value-format="yyyy-MM-dd" placeholder="选择解决日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="解决方式" label-width="120px" prop="operType">
              <el-select v-model="leadForm.operType" placeholder="请选择">
                <el-option v-for="item in selectData.operType" :key="item.dictSort" :label="item.dictLabel" :value="item.dictV">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="解决结果" label-width="120px" prop="solutionResult">
              <el-input v-model="leadForm.solutionResult" auto-complete="off" placeholder="请输入解决结果"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="12">
            <el-form-item label="预估工作量" label-width="120px" prop="workload" >
              <el-input v-model="leadForm.workload" auto-complete="off" placeholder="请输入预估工作量"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="确认意见" label-width="120px" prop="userMessage">
            <el-input v-model="leadForm.userMessage" type="textarea" auto-complete="off"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lead = false">取 消</el-button>
        <el-button type="primary" @click="exportPmisData('leadForm')" v-show="!importPmisStatus" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<!--JavaScript-->1
<script>
import echarts from 'echarts'
import api from '../../../api/api'
import lisUtils from "../../utils/utils";
export default {
  //数据
  data() {
    return {
      chart: false,
      image: false,
      pageSize: 10,
      total: 10,
      currentPage: 1,
      operateRowId: 0, //操作当前行的ID属性
      imgPaths: [],
      commondTableData: [
      ],
      selectData: {
        operType: [], //处理方式/解决方式
        priority: [], //优先级
        workAssig: [], //人员分配
        questionType: [],//问题类别
        reasonType: [], // 原因分类
        manuscriptStatus: [], // 底稿状态
        diffcultLevel: [], //难度级别
        batchNo: [
          { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' },
          { value: '4', label: '4' }, { value: '5', label: '5' }, { value: '6', label: '6' },
          { value: '7', label: '7' }, { value: '8', label: '8' }, { value: '9', label: '9' },
          { value: '10', label: '10' }
        ]
      },
      nameData: [],
      numData: [],
      dialogVisible: false,
      dialogImageUrl: '',
      lead: false,
      leadForm: {
        id: 0, //ID
        batchNo: 1,
        priority: 1,//问题优先级
        questionType: 1,  //底稿类型
        reasonType: 1, //原因分类
        manuscriptStatus: 1, //状态
        diffcultLevel: 1,  // 难度
        devUser: 1, //工程师工号
        devUserName:'', //公司方接收人
        linkman: '', //联系人
        mobile: '', //联系电话
        createYHMC: '', //创建人用户名称
        createUser: '', //创建人姓名
        createUserName:'',//创建人工号
        createDate: '', //提出日期
        hopeFinishDate: '',//希望完成时间
        resolveDate:'', //解决日期
        operType: 1, //解决方式
        solutionResult: '', //解决结果
        workload:0.0,
        userMessage: ''//用户方确认人签名及确认意见
      },
      leadRules: {
        batchNo: [
          { required: true, message: '请选择批次' }
        ],
        priority: [
          { required: true, message: '请选择问题优先级' }
        ],
        questionType: [
          { required: true, message: '请选择问题类别' }
        ],
        reasonType: [
          { required: true, message: '请选择原因分类' }
        ],
        manuscriptStatus: [
          { required: true, message: '请选择底稿状态' }
        ],
        diffcultLevel: [
          { required: true, message: '请选择难度' }
        ],
        devUser: [
          { required: true, message: '请输入工程师工号' }
        ],
        devUserName: [
          { required: true, message: '请输入公司方接收人' }
        ],
        linkman: [
          { required: true, message: '请输入联系人' }
        ],
        mobile: [
          { required: true, message: '请输入联系电话' }
        ],
        hopeFinishDate: [
          { required: true, message: '请选择希望完成日期' }
        ]
      },
      importPmisStatus:false
    }
  },
  created() {
    this.$parent.setSelectDisable(true);
    this.$parent.setProjectInfo();
    this.initCodes();
    this.$nextTick(function () {
      this.initCenterData();
    })
  },
  methods: {
    initCodes: function () {
      //解决方式/处理方式
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'operType' }).then((data) => {
        this.selectData.operType = data.data;
      });
      //问题优先级
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'priorityType' }).then((data) => {
        this.selectData.priority = data.data;
      });
      //底稿类型/问题类型
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'questionType' }).then((data) => {
        this.selectData.questionType = data.data;
      });
      //原因分类/
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'reasonType' }).then((data) => {
        this.selectData.reasonType = data.data;
      });
      //底稿状态
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'manuscriptStatus' }).then((data) => {
        this.selectData.manuscriptStatus = data.data;
      });
      //难度级别
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'diffcultLevel' }).then((data) => {
        this.selectData.diffcultLevel = data.data;
      });

    },
    //页面初始化数据
    initCenterData: function () {
      var pageSize = this.pageSize;
      var currentPage = this.currentPage;
      var first = (currentPage - 1) * pageSize;
      var khxx = this.$parent.getCustomerId();
      var pmId = this.$parent.getProjectId();
      api.post(api.url.siteCenter.initData, { 'pmId': pmId, 'serialNo': khxx, 'first': first, 'count': pageSize }).then((data) => {
        this.commondTableData = data.rows;
        this.total = data.total;
        this.selectData.workAssig = data.data;
        this.numData = data.numList;
        this.nameData = data.nameList;
      });
    },
    //饼图更新
    echartChange: function () {
      var khxx = this.$parent.getCustomerId();
      api.post(api.url.siteCenter.updateEchart, { 'serialNo': khxx }).then((data) => {

        if (data.status == "success") {
          this.numData = data.numList;
          this.nameData = data.nameList;
        }
      });
    },
    //饼图初始化
    showEchart: function () {
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.nameData,
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
            type: 'bar',
            label: {
              show: true,
            },
            data: this.numData,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            },
            itemStyle: {
              color: '#4d9eff'
            }
          }
        ]
      };
      setTimeout(_ => {
        let myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(option);
      }, 0);
    },
    //移入表格时候，默认将表格行的id信息进行保存
    showInfo: function (row) {
      this.operateRowId = row.id;
    },
    //========================change事件处理====================//
    //处理方式 修改
    operTypeChange: function (data) {
      var dataId = this.operateRowId;
      var userId = this.$parent.getUserId();
      api.post(api.url.siteCenter.update, { 'id': dataId, 'operator': userId, 'operType': data }).then((data) => {
        if (data.status == "success") {
          console.log('变更成功');
        }
      });
    },
    priorityTypeChange: function (data) {
      var dataId = this.operateRowId;
      var userId = this.$parent.getUserId();
      api.post(api.url.siteCenter.update, { 'id': dataId, 'operator': userId, 'priority': data }).then((data) => {
        if (data.status == "success") {
          console.log('变更成功');
        }
      });
    },
    allocateUserChange: function (data) {
      let dataId = this.operateRowId;
      let userId = this.$parent.getUserId();
      api.post(api.url.siteCenter.update, { 'id': dataId, 'operator': userId, 'allocateUser': data }).then((data) => {
        if (data.status == "success") {
          console.log('变更成功');
          this.echartChange();
        }
      });
    },
    //===========================================//
    //显示图片信息
    showImageInfo: function (imgPath) {
      if (imgPath != '') {
        let imgData = imgPath.split(';');
        this.imgPaths = [];
        if (imgData.length > 0) {
          for (let i = 0; i < imgData.length; i++) {
            this.imgPaths[i] = {
              url: api.url.siteCenter.imagePath + imgData[i],
              name: imgData[i].substring(imgData[i].lastIndexOf('/') + 1, imgData[i].lastIndexOf('.'))
            };
          }
          this.image = true;
        } else {
          this.$alert('当前问题没有上传图片!', '提示', {
            confirmButtonText: '确认',
            type: 'info'
          });
        }
      } else {
        this.$alert('当前问题没有上传图片!', '提示', {
          confirmButtonText: '确认',
          type: 'info'
        });
      }
    },
    openImportPmisWindow(data) {
      if (this.$refs['leadForm'] !== undefined) {
        this.$refs['leadForm'].resetFields();
      }
      this.leadForm.id = data.id;
      this.leadForm.batchNo = data.batchNo;
      this.leadForm.priority = data.priority;
      this.leadForm.questionType = data.questionType;
      this.leadForm.reasonType = data.reasonType;
      this.leadForm.manuscriptStatus = data.manuscriptStatus;
      this.leadForm.diffcultLevel = data.diffcultLevel;
      this.leadForm.createYHMC = data.map.create_name;
      this.leadForm.createUser = data.map.createUser;
      this.leadForm.createUserName = data.map.createUserName;
      this.leadForm.devUser = data.devUser;
      this.leadForm.devUserName = data.devUserName;
      this.leadForm.linkman = data.linkman;
      this.leadForm.mobile = data.mobile;
      this.leadForm.createDate = data.map.createTimeString;
      this.leadForm.hopeFinishDate = data.hopeFinishDate;
      this.leadForm.resolveDate = data.resolveDate;
      this.leadForm.operType = data.operType;
      this.leadForm.solutionResult = data.solutionResult;
      this.leadForm.userMessage = data.userMessage;
      this.leadForm.workload = data.workload;
      this.importPmisStatus = data.pmisStatus === 1 ? true :false;
      this.lead = true;
    },
    exportPmisData(formName) {
      let json = {
        id: this.leadForm.id,
        pmId : this.$parent.getProjectId(),
        batchNo: this.leadForm.batchNo,
        priority: this.leadForm.priority,
        questionType: this.leadForm.questionType,
        reasonType: this.leadForm.reasonType,
        manuscriptStatus: this.leadForm.manuscriptStatus,
        diffcultLevel: this.leadForm.diffcultLevel,
        createNo:this.leadForm.createUser,
        devUser: this.leadForm.devUser,
        devUserName: this.leadForm.devUserName,
        linkman: this.leadForm.linkman,
        mobile: this.leadForm.mobile,
        operType: this.leadForm.operType,
        solutionResult: this.leadForm.solutionResult,
        hopeFinishDate: lisUtils.dateFormat.date(this.leadForm.hopeFinishDate),
        resolveDate:lisUtils.dateFormat.date(this.leadForm.resolveDate),
        workload:this.leadForm.workload === undefined ? 0: this.leadForm.workload,
        userMessage: this.leadForm.userMessage === '' ? '无' : this.leadForm.userMessage,
        operator: this.$parent.getUserId()
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(json);
          api.post(api.url.siteCenter.exportPmisData, json).then((data) => {
            if (data.status == 'success') {
              this.initCenterData();
              this.$message({ type: 'info', message: '导入PMIS成功' });
            }
          });
          this.lead = false;
        } else {
          return false;
        }
      });
      console.log(json);
    },
    //pageSize改变事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.initCenterData();
    },
    //currentPage改变事件
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initCenterData();
    },
    //移除文件操作
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //图片展示处理
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 查询用户信息
    querySearch(queryString, cb){
      let json = {
        userid:queryString,
        first:0,
        count:20
      };
      api.post(api.url.userInfo.queryUser,json).then((data)=>{
         if(data.status === 'success' ){
            cb(data.rows);
         }
      });
    },
    changeDevUserName(item){
      this.leadForm.devUser = item.userid;
      this.leadForm.devUserName = item.yhmc;
    }
  }
}

</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
.commond {
  padding: 0px 15px;
}

#main {
  width: 100%;
  height: 400px;
}

.slideImge img {
  width: 100%;
  height: 100%;
}
</style>
<style lang="stylus">
.commond {
  padding: 0px 15px;
}

#main {
  width: 100%;
  height: 400px;
}

.slideImge img {
  width: 100%;
  height: 100%;
}
</style>

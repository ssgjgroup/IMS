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
          <el-table-column prop="map.create_name" label="登记人">
          </el-table-column>
          <el-table-column prop="map.createTimeString" label="登记时间">
          </el-table-column>
          <el-table-column align="center" label="处理方式">
            <template slot-scope="scope">
              <el-select v-model="scope.row.operType" size="mini" @change="operTypeChange" placeholder="请选择">
                <el-option v-for="item in selectData.dealType" :key="item.dictSort" :label="item.dictLabel" :value="item.dictV">
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
       <el-upload
        action=""
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="imgPaths">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-dialog>
    <!--导入PMIS弹框-->
    <el-dialog title="导入PMIS" width="30%" :visible.sync="lead">
      <el-form :model="leadForm" :rules="leadRules" ref="leadForm">
        <el-form-item label="批次" label-width="120px" prop="leadBatch" required>
          <el-input v-model="leadForm.leadBatch" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题优先级" label-width="120px" prop="leadPriority" required>
          <el-select v-model="leadForm.leadPriority" size="mini" placeholder="请选择">
            <el-option v-for="item in selectData.priority" :key="item.dictSort"
                       :label="item.dictLabel" :value="item.dictV">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="底稿类型" label-width="120px" prop="leadType" required>
          <el-input v-model="leadForm.leadType" auto-complete="off"></el-input>
          <el-select v-model="leadForm.leadType" size="mini" placeholder="请选择">
            <el-option v-for="item in selectData.priority" :key="item.dictSort"
                       :label="item.dictLabel" :value="item.dictV">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室名称" label-width="120px" prop="sourceType" required>
          <el-input v-model="leadForm.sourceType" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lead = false">取 消</el-button>
        <el-button type="primary" >确 定</el-button>
        <!--@click="deptAddorModify('deptForm')"-->
      </div>
    </el-dialog>
  </div>
</template>
<!--JavaScript-->1
<script>
import echarts from 'echarts'
import api from '../../../api/api'
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
        {
          id: 12,
          siteName: '胸外科病区住院护士站',
          productName: '病区护士站',
          menuName: '发票打印',
          questionType: '程序类',
          questionDesc: '发票走纸不对',
          create_name: '万科',
          createTime: '2017/01/02 17:23',
          dealType: '1',
          priority: '1',
          workAssig: '1',
          completionTime: '2017/01/03 14:20'
        }
      ],
      selectData: {
        dealType: [], //处理方式
        priority: [], //优先级
        workAssig: [], //人员分配
        manuscriptType:[],//底稿类型
        reasonType:[], // 原因分类
        manuscriptStatus:[], // 底稿状态
        solutionType:[], //解决方式
        diffcultLevel:[] //难度级别
      },
      nameData: [],
      numData: [],
      dialogVisible:false,
      dialogImageUrl:'',
      lead:false,
      leadForm:{
        id:0, //ID
        leadBatch:0,
        leadType:0,  //底稿类型
        sourceType:0, //原因分类
        leadStatus:0, //状态
        resolveType:0, //解决方式
        leadLevel:0,  // 难度
        sourceUser:0, //工程师工号
        companyUser:0, //公司方接收人
        createDate:'', //提出日期
        useMessage:''//用户方确认人签名及确认意见
      },
      leadTypeData:[], // 底稿类型
      leadRules:{
        leadType: [
          {required: true, message: '请选择底稿类型'}
        ],
        leadBatch:[
          {required: true, message: '请选择批次'}
        ],
        leadPriority:[
          {required: true, message: '请选择问题优先级'}
        ],
        sourceType: [
          {required: true, message: '请选择原因分类'}
        ],
        resolveType:[
          {required: true, message: '请选择解决方式'}
        ],
        leadLevel:[
          {required: true, message: '请选择难度'}
        ],
        sourceUser:[
          {required: true, message: '请输入提出人工号'}
        ],
        companyUser:[
          {required: true, message: '请输入接收人工号'}
        ],
        createDate:[
          {required: true, message: '请选择提出日期'}
        ],
        useMessage:[
          {required: true, message: '请输入用户方确认人签名及确认意见'}
        ]
      }
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
      //处理方式
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'operType' }).then((data) => {
        this.selectData.dealType = data.data;
      });
      //问题优先级
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'priorityType' }).then((data) => {
        this.selectData.priority = data.data;
      });
      //底稿类型
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'manuscriptType' }).then((data) => {
        this.selectData.manuscriptType = data.data;
      });
      //原因分类
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'reasonType' }).then((data) => {
        this.selectData.reasonType = data.data;
      });
      //底稿状态
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'manuscriptStatus' }).then((data) => {
        this.selectData.manuscriptStatus = data.data;
      });
      //解决方式
      api.post(api.url.etCustomerDetail.initCodes, { 'dictCode': 'solutionType' }).then((data) => {
        this.selectData.solutionType = data.data;
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
      api.post(api.url.siteCenter.updateOperType, { 'id': dataId, 'operator': userId, 'operType': data }).then((data) => {
        if (data.status == "success") {
          console.log('变更成功');
        }
      });
    },
    priorityTypeChange: function (data) {
      var dataId = this.operateRowId;
      var userId = this.$parent.getUserId();
      api.post(api.url.siteCenter.updatePriorityType, { 'id': dataId, 'operator': userId, 'priority': data }).then((data) => {
        if (data.status == "success") {
          console.log('变更成功');
        }
      });
    },
    allocateUserChange: function (data) {
      let dataId = this.operateRowId;
      let userId = this.$parent.getUserId();
      api.post(api.url.siteCenter.updateAllocateUser, { 'id': dataId, 'operator': userId, 'allocateUser': data }).then((data) => {
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
              url:api.url.siteCenter.imagePath + imgData[i],
              name:imgData[i].substring(imgData[i].lastIndexOf('/')+1,imgData[i].lastIndexOf('.'))
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
    openImportPmisWindow(data){
      this.leadForm.id = data.id;
      this.leadForm.leadPriority = data.priority;
      this.leadForm.sourceType = data.sourceType;
      this.leadForm.leadStatus  = data.leadStatus;
      this.leadForm.resolveType = data.resolveType;
      this.leadForm.companyUser = data.companyUser;
      this.leadForm.useMessage = data.useMessage;
      this.leadForm.sourceUser = data.map.create_name;
      this.leadForm.createDate = data.map.createTimeString;
      this.lead = true;

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

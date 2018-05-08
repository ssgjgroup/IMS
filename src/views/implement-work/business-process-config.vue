<!--
* @author: jinxl
* @date: 2018/04/10
* @module:业务流程调研
-->
<template>
  <div class="interfa-comb">
    <div class="step">
      <div class="step_title">
        <span @click="stepState = !stepState">业务流程调研<i :class="[stepState ? 'open':'','el-icon-arrow-down']"></i></span>
      </div>
      <transition
        enterActiveClass="animated fadeInUp">
        <div class="step_body" v-show="stepState">
          <el-steps :active="-1"
                    align-center
                    process-status="finish">
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
        <span @click="confirmFlowConfig" :class="{ active: isActive }" >
          <i class="iconfont icon-conf-complete"></i>确认完成</span>
        <div class="w-table-btn_tip" style="text-align: left">
          <span>流程总数：{{ sumNum }}</span>
          <span>已完成数：{{ comNum }}</span>
        </div>
      </div>
      <div class="w-table-content">
        <el-table
          :data="businessProcessData"
          @cell-mouse-enter="getSelectRow"
          style="width: 100%">
          <el-table-column
            prop="flowCode"
            label="流程编号">
          </el-table-column>
          <el-table-column
            prop="flowName"
            label="流程名称">
          </el-table-column>
          <el-table-column
            align="center"
            label="是否本期范围">
            <template slot-scope="scope">
              <el-select size="mini"
                         v-model="scope.row.isScope"
                         @change="changeScope"
                         :disabled="isEdit"
                         placeholder="请选择">
                <el-option-group
                  v-for="group in rangeSelect"
                  :key="group.label"
                  :label="group.label">
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            align="center"
            label="审核状态"
            :disabled="!isEdit">
            <template slot-scope="scope">
              <span  :class="scope.row.map.stateClass" >{{ scope.row.map.stateTxt }}-{{ scope.row.message }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <div class="operate" >
                <i v-show="isShow" @click="openUploadWindow(scope.row.id)" class="iconfont icon-conf-complete"></i>
                <i @click="downloadPage(scope.row.downloadPath)"  class="iconfont icon-download"></i>
                <i v-show="isAuth" @click="modifyProcess(scope.row)" class="iconfont icon-edit"></i>
                <i @click="downloadPage(scope.row.uploadPath)"  class="iconfont icon-question"></i>
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

    <!--新增-->
    <el-dialog :title="title"
               width="50%"
               :visible.sync="newAdd">
      <el-form :model="flowForm"
               :rules="rules"
               ref="flowForm"
               label-width="100px">
        <el-form-item label="流程编号" prop="flowCode">
          <el-input v-model="flowForm.flowCode" :disabled="isActive">
            <template slot="prepend">WN-YWLC-</template>
          </el-input>
        </el-form-item>
        <el-form-item label="流程名称" prop="flowName" >
          <el-input v-model="flowForm.flowName" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="本期范围" prop="isScope">
          <el-select v-model="flowForm.isScope"
                     placeholder="请选择"
                     :disabled="isEdit"
                     style="width: 100%">
            <el-option-group
              v-for="group in dialogSelect"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="status">
          <el-select v-model="flowForm.status"
                     placeholder="请选择"
                     style="width: 100%">
            <el-option
              v-for="item in statusData"
              :key="item.dictSort"
              :label="item.dictLabel"
              :value="item.dictV">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="message">
          <el-input type="textarea" v-model="flowForm.message"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="newAdd = false">取 消</el-button>
      <el-button size="small" type="primary" @click="addOrModifyProcess('flowForm')">确 定</el-button>
    </span>
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
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList">
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
  import api from '../../../api/api'
  export default {
    //数据
    data(){
      return {
        stepState:true,
        sumNum:10,
        comNum:5,
        title:'新增',
        isActive:false,
        isEdit:false,
        isShow:true,
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
        },{
          label: '是',
          options: [{
            value: 1,
            label: '是'
          }]
        }],
        pageSize: 5,
        total: 10,
        currentPage: 1,
        businessProcessData:[
          {
              flowCode:'',
              flowName:'',
              isScope:'1',
              stateTxt:'',
              map:{
                stateClass:'disaudit'
              }
          }
        ],
        /*弹窗数据*/
        newAdd:false,
        flowForm: {
          id:0,
          flowCode:'',
          flowName:'',
          isScope:1,
          status:0,
          message:''
        },
        rules: {
          status: {required: true, message: '请输入审核状态', trigger: 'blur' },
          message: { required: true, message: '请输入审核意见', trigger: 'blur' }
        },
        dialogSelect: [
          {
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
        statusData:[],
        operateRowId:0,
        uploadWindow:false,
        fileList:[],
        isAuth:false,
        action:api.url.businessProcess.upload,
        operateRow:{}
      }
    },
    created(){
      this.$parent.setSelectDisable(true);
      this.$parent.setProjectInfo();
      this.initCode();
      this.$nextTick(function(){
       this.initBusinessProcess();
       this.checkStep();
      })
    },
    methods:{
      initCode(){
        api.post(api.url.etCustomerDetail.initCodes, {'dictCode': 'audiType'}).then((data) => {
          this.statusData = data.data;
        });
      },
      initQueryJson(){ //分页通用查询使用参数
        let pageSize = this.pageSize;
        let first  = (this.currentPage - 1) * pageSize;
        let queryJson = {
          'first':first,
          'count':this.pageSize,
          'pmId':this.$parent.getProjectId(),
          'cId':this.$parent.getContractId(),
          'serialNo':this.$parent.getCustomerId()
        };
        return queryJson;
      },
      checkStep(){ //检查当前步骤是否完成，修改属性值
        let pmId = this.$parent.getProjectId();
        let userid = this.$parent.getUserId();
        this.isEdit = true;
        api.post(api.url.businessProcess.checkConfig,{'pmId':pmId}).then((data) => {
          if( data.status === 'success'){
            if( data.data === 1){
              this.isActive = true;
            }else{
              this.isActive = false;
            }
          }
        });
        api.post(api.url.businessProcess.checkAuth,{'xmlcb':pmId,'ry':userid}).then((data) => {
          if( data.status === 'success'){
            if( data.data === 0){
              this.isAuth = true;
            }
          }
        });

      },
      initBusinessProcess(){ //页面数据初始化
        let queryJson = this.initQueryJson();
        api.post(api.url.businessProcess.initData,queryJson).then((data) => {
          if (data.status == 'success') {
              this.businessProcessData = data.rows;
              this.total = data.total;
              this.sumNum = data.sumNum;
              this.comNum = data.comNum;
          }
        });
      },
      //流程完成总数变化
      changeBusinessCount(){
        let queryJson = this.initQueryJson();
        api.post(api.url.businessProcess.countInfo,queryJson).then((data) => {
          if (data.status == 'success') {
            this.sumNum = data.sumNum;
            this.comNum = data.comNum;
          }
        });
      },
      //修改业务流程
      modifyProcess(data){
        if (this.$refs['flowForm']!==undefined) {
          this.$refs['flowForm'].resetFields();
        }
        this.title ="修改";
        this.flowForm.id = data.id;
        this.flowForm.flowCode = data.flowCode.substr(8);
        this.flowForm.flowName = data.flowName;
        this.flowForm.isScope = data.isScope;
        this.flowForm.status = data.status;
        this.flowForm.message = data.message;
        this.newAdd = true;
      },
      //业务流程保存
      addOrModifyProcess(formName){
        var json = {
          id:this.flowForm.id,
          flowCode:'WN-YWLC-'+this.flowForm.flowCode,
          flowName:this.flowForm.flowName,
          isScope:this.flowForm.isScope,
          status:this.flowForm.status,
          message:this.flowForm.message,
          operator: this.$parent.getUserId(),
          pmId:this.$parent.getProjectId(),
          cId:this.$parent.getContractId(),
          serialNo:this.$parent.getCustomerId()
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
      downloadPage(downloadPath){
        if(downloadPath){
          window.open(downloadPath);
        }else {
          this.$alert('当前文件没有提供下载文件', '下载提示', {
            confirmButtonText: '确定'});
        }

      },
      confirmFlowConfig(){
        let pmId = this.$parent.getProjectId();
        let confirmText = '';
        let succMessage = '';
        let calMessage = '';
        let isFlowConfig =  0 ;
        if(!this.isActive){
          confirmText = '确认流程配置工作完成, 是否继续?';
          succMessage = '确认成功';
          calMessage = '已取消确认';
          isFlowConfig =  1 ;
        }else{
          confirmText = '取消流程配置工作完成, 是否继续?';
          succMessage = '取消成功';
          calMessage = '已撤销取消';
          isFlowConfig =  0 ;
        }
        this.$confirm(confirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.businessProcess.confirmFlowConfig, {'pmId': pmId,'isFlowConfig':isFlowConfig}).then((data) => {
            if (data.status == "success") {
              this.$message({type: 'success', message: succMessage});
              if(!this.isActive){
                this.isActive = true;
                this.isShow = false;
              }else {
                this.isActive = false;
                this.isShow = true;
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
      openUploadWindow(id){
        this.action = api.url.businessProcess.upload +'?id='+id;
        this.uploadWindow = true;
      },
      //上传成功
      uploadSeccess: function (response) {
        if (response.status == 'success') {
          this.fileList = [];
          this.uploadWindow = false;
          this.initBusinessProcess();
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
        console.log(file, fileList);
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
        this.initBusinessProcess();
      },
      //currentPage改变事件
      handleCurrentChange(val) {
        this.currentPage = val;
        this.initBusinessProcess();
      },
      //实施范围变更事件
      changeScope(data){
        let changeJson = {
           id:this.operateRowId,
           isScope:data,
           operator:this.$parent.getUserId()
        };
        api.post(api.url.businessProcess.changeScope,changeJson).then((data) => {
          if (data.status == 'success') {
            this.changeBusinessCount();
          }
        });
      },
      //获取当前行的ID
      getSelectRow:function (row) {
        this.operateRowId = row.id;
        this.operateRow = row;
      },
      //是否显示操作 admin添加的不允许修改
      showOperation: function (data) {
        if (!data.flowId) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
  .interfa-comb{
    padding 0px 15px
  }
  .step{
    padding 20px 15px 20px
  }
  .step_title{
    margin-bottom 10px
  }
  .step_title span{
    color #666666
    font-size 14px
    cursor pointer
  }
  .step_title span i{
    margin-left 5px
    transition all ease .5s
  }
  .step_title span i.open{
    margin-left 5px
    transform rotate(180deg)
  }
  .step_body{
    padding 20px 10px
    border-radius 3px
    border 1px solid #f8f8f8
  }
  /*审核状态*/
  .audit{
    color: #666666;
  }
  .disaudit{
    color: #ff7171;
  }
  .audited{
    color: #2fdd2f;
  }
  /*进程状态*/
  .rocess-state{
    display flex
  }
  .rocess-state>div{
    flex-grow 1
    line-height 1
    color #e5e5e5
  }
  .rocess-state>div i{
    display inline-block
    width 12px
    height 12px
    margin-bottom 5px
    border-radius 50%
    border 1px solid #1e90ff
  }
  .rocess-state>div.state{
    color #ff4d4d
  }
  .rocess-state>div.state i{
    border none
    background #ff7171
  }
</style>
<!--CSS-RESET-->
<style lang="stylus">
  .el-step__title{
    font-size 12px
  }
  .el-step__icon{
    width 20px
    height 20px
  }
  .el-step__icon-inner{
    display none
  }
</style>

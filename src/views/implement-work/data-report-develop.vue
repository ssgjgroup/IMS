<!--
* @author: jinxl
* @date: 2018/04/10
* @module:业务流程调研
-->
<template>
  <div class="interfa-comb">
    <div class="step">
      <div class="step_title">
        <span @click="stepState = !stepState">单据报表开发<i :class="[stepState ? 'open':'','el-icon-arrow-down']"></i></span>
      </div>
      <transition
        enterActiveClass="animated fadeInUp">
        <div class="step_body" v-show="stepState">
          <div class="step_item">
            <div class="step_tip">票据处理流程</div>
            <el-steps :active="-1"
                      align-center
                      space="200px"
                      process-status="finish">
              <el-step title="数量确认"></el-step>
              <el-step title="模板制作"></el-step>
              <el-step title="打印校验"></el-step>
              <el-step title="客户确认"></el-step>
              <el-step title="上传照片"></el-step>
            </el-steps>
          </div>
          <div>
            <div class="step_tip">报表处理流程</div>
            <el-steps :active="-1"
                      align-center
                      space="200px"
                      process-status="finish">
              <el-step title="数量确认"></el-step>
              <el-step title="报表需求调研"></el-step>
              <el-step title="报表开发"></el-step>
              <el-step title="制作模板"></el-step>
              <el-step title="打印服务"></el-step>
              <el-step title="客户确认"></el-step>
              <el-step title="上传照片"></el-step>
            </el-steps>
          </div>
        </div>
      </transition>
    </div>
    <div class="w-table">
      <div class="w-table-btn">
        <span :class="{active:isActive}" @click="doConfirmNum"><i class="iconfont icon-conf-complete"></i>确认完成</span>
        <span @click="openAddAndModifyWindow(0)" v-show="!isActive"><i class="iconfont icon-new-add"></i>新增</span>
        <span @click="confirmDev" :class="{ active: isConfig }" v-show="isActive"><i
          class="iconfont icon-conf-complete"></i>提交审核</span>
        <div class="w-table-btn_tip">
          <span>单据&报表总数：{{countNum}}</span>
          <span>已完成数：{{completeNum}}</span>
        </div>
      </div>
      <div class="w-table-content">
        <el-table
          :data="workerInfo"
          @cell-mouse-enter="getSelectRow"
          style="width: 100%">
          <el-table-column

            prop="map.type"
            label="分类">
          </el-table-column>
          <el-table-column

            prop="reportName"
            label="票据&报表名称">
          </el-table-column>
          <el-table-column

            label="是否本期范围">
            <template slot-scope="scope">
              <el-select size="mini"
                         :disabled="isActive"
                         v-model="scope.row.noScopeCode"
                         placeholder="请选择"
                         @change="doRangeSelect(scope.row)">
                <el-option-group
                  v-for="group in ranges"
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
            prop="status"

            :disabled="!isManager"
            label="审核状态">
            <template slot-scope="scope">
              <el-dropdown :hide-on-click="false" placement="bottom-start" trigger="click">
                <span class="el-dropdown-link">
                  <span v-if="scope.row.status==1" class="audit">
                    待审核-{{ scope.row.remark}}
                  </span>
                  <span v-else-if="scope.row.status==2" class="disaudit">
                    审核不通过-{{ scope.row.remark }}
                  </span>
                  <span v-else-if="scope.row.status==9" class="audited">
                    审核通过-{{ scope.row.remark }}
                  </span>
                  <i class="el-icon-arrow-down el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown" style="width: 450px;">
                  <el-dropdown-item>
                    <el-radio-group v-model="scope.row.status" :disabled="!isManager||scope.row.isScope!=1">
                      <el-radio :label="1">待审核</el-radio>
                      <el-radio :label="2">审核不通过</el-radio>
                      <el-radio :label="9">审核通过</el-radio>
                    </el-radio-group>
                    <el-dropdown-item>
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="scope.row.remark" :disabled="!isManager||scope.row.isScope!=1">
                      </el-input>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div style="text-align: right;" v-show="isManager&&scope.row.isScope==1">
                        <el-button @click.native="dropdownClose">取 消</el-button>
                        <el-button @click.native="changeStatus" type="primary">确 定</el-button>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>

          </el-table-column>

          <el-table-column prop="map.creator" label="创建人" width="100px">
          </el-table-column>
          <el-table-column prop="map.createDate" label="创建时间" width="100px">
          </el-table-column>
          <el-table-column
            label="备注"
            prop="require">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <div class="operate">
                <i class="iconfont icon-conf-complete" @click="doUpload(scope.row)"></i>
                <!--<i class="iconfont icon-download"></i>-->
                <i class="iconfont icon-edit" @click="openAddAndModifyWindow(scope.row)"
                   v-show="showCol(scope.row)"></i>
                <i class="iconfont icon-question" @click="picShowOpen(scope.row)"></i>
                <i class="iconfont icon-delete" @click="doDelete(scope.row.id)"
                   v-show="!isActive&&showCol(scope.row)"></i>
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
    <el-dialog title="新增"
               width="40%"
               :visible.sync="addAndModifyWindow">
      <el-form :model="workForm"
               :rules="rules"
               ref="workForm"
               :disabled="isActive"
               label-width="120px">
        <el-form-item label="分类" prop="reportType">
          <el-select v-model="reportType" placeholder="请选择" @change="doSelect(reportType)">
            <el-option
              v-for="item in typeList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="票据报表名称" prop="reportName">
          <el-input v-model="workForm.reportName"></el-input>
        </el-form-item>
        <el-form-item label="本期范围" prop="range">
          <el-select v-model="reason"
                     placeholder="请选择"
                     style="width: 100%">
            <el-option-group
              v-for="group in ranges"
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
        <!--<el-form-item label="审核状态" prop="aduit">-->
        <!--<el-radio-group v-model="workForm.status" @click="changeStatus(workForm.status)">-->
        <!--<el-radio label="0">待审核</el-radio>-->
        <!--<el-radio label="1">审核通过</el-radio>-->
        <!--<el-radio label="2">审核不通过</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <el-form-item label="" prop="require" label="备注">
          <el-input type="textarea" v-model="workForm.require"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="addAndModifyWindow = false">取 消</el-button>
      <el-button size="small" type="primary" @click="addOrModify('workForm')" :disabled="isActive">确 定</el-button>
    </span>
    </el-dialog>

    <!--图片-弹窗-->
    <el-dialog width="50%" class="enlargeImg" :visible.sync="picShow">
      <el-upload
        action=""
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="imgPath">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
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
        :before-upload="beforeUpload"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :data="upLoadData">
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
    data() {
      return {
        countNum: 0,//统计总数
        completeNum: 0,//已完成数
        stepState: true,
        title: '新增',
        workId: 0,
        isActive: false,
        process: {},
        isConfig: false, //提交审核
        isManager: false, //是否项目经理
        operateRow: {},
        addAndModifyWindow: false,
        uploadWindow: false,
        picShow: false,
        dialogImageUrl: '',
        dialogVisible: false,
        imgPath: [],
        action: api.url.report.upload,
        upLoadData: {//上传文件时传递的参数
          id: "",
          operator: "",//操作人
          pmId: this.$parent.getProjectId(),
        },
        completeSelect: [
          {
            value: "0",
            label: "未完成"
          },
          {
            value: "1",
            label: "完成"
          },
        ],
        reason: "",
        ranges: [{
          label: '否',
          options: [{
            value: '不在合同范围',
            label: '不在合同范围'
          }, {
            value: '本期不实施',
            label: '本期不实施'
          },
            {
              value: '医院暂时不用',
              label: '医院暂时不用'
            },
            {
              value: '其他',
              label: '其他'
            }]
        }, {
          label: '是',
          options: [{
            value: '',
            label: '是'
          }]
        }],
        reportType: "",
        typeList: [],//分类
        fileList: [],//上传文件集合
        workForm: {//接口信息表单
          reportType: "",
          reportName: "",
          isScope: "1",
          noScopeCode: "",
          require: '',
          remark: "",
          status: "0",
          imgPath: [],
        },
        rules: {
          reportType: {required: true, message: '请选择分类', trigger: 'change'},
          reportName: {required: true, message: '请输入票据报表名称', trigger: 'blur'},
          // require: {required: true, message: '请输入要求', trigger: 'blur'},
        },
        action: api.url.report.upload,
        workerInfo: [],
        uploadForm: {
          uploadFile: ''
        },
        pageSize: 10,
        total: 100,
        currentPage: 1,
        dialogFormVisible: false,
        formLabelWidth: '120px',
      }
    }, created() {
      this.$parent.setSelectDisable(true);
      this.$parent.setProjectInfo();
      this.initSourceData();
      this.$nextTick(function () {
        this.getWorkerInfo();
      })
    },
    methods: {
      //初始化接口数据源
      initSourceData() {
        api.post(api.url.report.initSourceData, {
          pmId: this.$parent.getProjectId(),
          operator: this.$parent.getUserId(),
        }).then((data) => {
          console.log(data.msg);
        });
      },
      //获取测试硬件数据
      getWorkerInfo: function () {
        var pmId = this.$parent.getProjectId();
        var pageSize = this.pageSize;
        var currentPage = this.currentPage;
        var first = (currentPage - 1) * pageSize;
        api.post(api.url.report.initData, {
          'first': first,
          'count': pageSize,
          pmId: pmId,
          userId: this.$parent.getUserId(),
        }).then((data) => {
          if (data.status == 'success') {
            this.workerInfo = data.rows;
            this.total = data.total;
            this.typeList = data.typeList;
            this.completeNum = data.completeNum;
            this.countNum = data.countNum;
            this.process = data.process;
            if (data.user.ryfl == null || data.user.ryfl != 0) {
              this.isManager = false;
            } else if (data.user.ryfl == 0) {
              this.isManager = true;
            }
            if (this.process.isPaperAffirm == null || this.process.isPaperAffirm != 1) {
              this.isActive = false;
            } else if (this.process.isPaperAffirm == 1) {
              this.isActive = true;
            }
            if (this.process.isPaperDev == null || this.process.isPaperDev != 1) {
              this.isConfig = false;
            } else if (this.process.isPaperDev == 1) {
              this.isConfig = true;
            }
          }
        });
      },
      //pageSize改变事件
      handleSizeChange(val) {
        this.pageSize = val;
        this.getWorkerInfo();
      },
      //currentPage改变事件
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getWorkerInfo();
      },
      //修改显示照片
      picShowOpen(row) {
        let imgData = row.map.imgPath;
        if (imgData != null) {
          this.imgPath = [];
          if (imgData.length > 0) {
            for (let i = 0; i < imgData.length; i++) {
              this.imgPath[i] = {
                url: api.url.report.imagePath + imgData[i],
                name: imgData[i].substring(imgData[i].lastIndexOf('/') + 1, imgData[i].lastIndexOf('.'))
              };
            }
            this.picShow = true;
          } else {
            this.$alert('未上传图片!', '提示', {
              confirmButtonText: '确认',
              type: 'info'
            });
          }
        } else {
          this.$alert('未上传图片!', '提示', {
            confirmButtonText: '确认',
            type: 'info'
          });
        }
      },
      //选择产品分类
      doSelect(reportType) {
        this.workForm.reportType = reportType;
        this.reportType = reportType;
      },
      //选择范围
      doRangeSelect(row) {
        //改变范围
        this.$nextTick(() => {
          api.post(api.url.report.changeScope, {
            'noScopeCode': row.noScopeCode,
            'id': row.id,
            'operator': this.$parent.getUserId(),
            'pmId': this.$parent.getProjectId(),
          }).then((data) => {
            row.isScope = data.isScope;
            this.countNum = data.countNum;
            this.completeNum = data.completeNum;
            console.log(data.msg);
          });
        });
      },
      //完成情况
      completeChange(row) {
        api.post(api.url.report.changeContent, {
          'content': row.content,
          'id': row.id,
          'operator': this.$parent.getUserId(),
        }).then((data) => {
          console.log(data.msg);
        });
      },
      //是否可操作
      showCol: function (data) {
        if (data.creator != 0) {
          return true;
        } else {
          return false;
        }
      },
      //表格行样式回调方法
      rowStyle: function (row, rowIndex) {
        if (row.row.isScope === 1) {
          return 'default-row-class';
        } else {
          return 'invalid-row-class';
        }
      },
      //打开编辑弹出框
      openAddAndModifyWindow: function (data) {
        if (this.$refs['workForm'] !== undefined) {
          this.$refs['workForm'].resetFields();
        }
        if (data == 0) {
          this.workForm.reportType = "";
          this.workForm.reportName = "";
          this.workForm.isScope = "1";
          this.workForm.noScopeCode = "";
          this.workForm.require = '';
          this.workForm.remark = "";
          this.workForm.status = "0";
          this.reportType = "";
          this.reason = "";
          this.workId = 0;
        } else {
          this.workForm.reportType = data.reportType.toString();
          this.workForm.reportName = data.reportName;
          this.workForm.isScope = data.isScope.toString();
          this.workForm.noScopeCode = data.noScopeCode.toString();
          this.workForm.require = data.require;
          this.workForm.remark = data.remark;
          this.workForm.status = data.status.toString();
          this.reportType = data.reportType.toString();
          this.reason = data.noScopeCode.toString();
          this.workId = data.id;
        }
        this.addAndModifyWindow = true;
      },
      doDelete: function (id) {
        this.$confirm('删除本条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.report.delete, {'id': id}).then((data) => {
            if (data.status == "success") {
              this.$message({type: 'success', message: '删除成功!'});
              this.getWorkerInfo();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //新增或编辑弹窗确定
      addOrModify: function (formName) {
        this.addAndModifyWindow = true;
        var json = {
          id: this.workId,
          pmId: this.$parent.getProjectId(),
          reportName: this.workForm.reportName,
          reportType: this.workForm.reportType,
          require: this.workForm.require,
          noScopeCode: this.reason,
          status: this.workForm.status,
          operator: this.$parent.getUserId()
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.post(api.url.report.addOrModify, json).then((data) => {
              if (data.status = 'success') {
                this.getWorkerInfo();
              }
            });
            this.addAndModifyWindow = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //导出EXCEL
      downloadExcel: function () {
        var pmId = this.$parent.getProjectId();
        window.open(api.url.report.exportExcel + "?pmId=" + pmId);
      },
      sizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getWorkerInfo();
      },
      currentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getWorkerInfo();
      },
      //导入
      doUpload: function (row) {
        this.upLoadData.id = row.id;
        this.upLoadData.operator = this.$parent.getUserId();
        this.uploadWindow = true;
      },
      beforeUpload(file) {
        console.info(file.name.substring(file.name.lastIndexOf(".") + 1));
        const isJPG = file.name.substring(file.name.lastIndexOf(".") + 1) === 'png' || file.name.substring(file.name.lastIndexOf(".") + 1) === 'jpg' || file.name.substring(file.name.lastIndexOf(".") + 1) === 'bmp' || file.name.substring(file.name.lastIndexOf(".") + 1) === 'jpeg';
        if (!isJPG) {
          this.$message.error('只能上传图片格式!');
        }
        return isJPG;
      },
      handlePreview(file) {
      },
      handleRemove(file, fileList) {
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      uploadSeccess: function (response) {
        if (response.status == 'success') {
          this.fileList = [];
          this.uploadWindow = false;
          this.getWorkerInfo();
        } else {
          this.$message.warning(response.msg);
        }
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      dropdownClose(e) {
        document.getElementById(e.target.offsetParent.id).style.display = "none";
      },
      //获取当前行的ID
      getSelectRow: function (row) {
        this.operateRow = row;
      },
      //完成情况
      changeStatus(e) {
        api.post(api.url.report.changeStatus, {
          id: this.operateRow.id,
          status: this.operateRow.status,
          remark: this.operateRow.remark,
          pmId: this.$parent.getProjectId(),
          cId: this.$parent.getContractId(),
          serialNo: this.$parent.getCustomerId(),
          operator: this.$parent.getUserId(),
        }).then((data) => {
          if (data.type === 'success') {
            this.completeNum = data.completeNum;
            document.getElementById(e.target.offsetParent.id).style.display = "none";
          }
        });
      },
      //确认数量完成
      doConfirmNum: function () {
        let pmId = this.$parent.getProjectId();
        let confirmText = '';
        let succMessage = '';
        let calMessage = '';
        let isPaperAffirm = 0;
        if (!this.isActive) {
          confirmText = '此操作将确认单据报表的范围, 是否继续?';
          succMessage = '确认成功';
          calMessage = '已取消确认';
          isPaperAffirm = 1;
        } else {
          confirmText = '此操作将取消确认认单据报表的范围, 是否继续?';
          succMessage = '取消成功';
          calMessage = '已撤销取消';
          isPaperAffirm = 0;
        }
        this.$confirm(confirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.report.confirmNum, {
            pmId: pmId,
            operator: this.$parent.getUserId(),
            isPaperAffirm: isPaperAffirm,
          }).then((data) => {
            if (data.status == "success") {
              this.$message({type: 'success', message: succMessage});
              if (!this.isActive) {
                this.isActive = true;
              } else {
                this.isActive = false;
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
      //节点2 流程配置
      confirmDev() {
        let pmId = this.$parent.getProjectId();
        let confirmText = '';
        let succMessage = '';
        let calMessage = '';
        let isPaperDev = 0;
        if (!this.isConfig) {
          confirmText = '提交单据报表与交付审核, 是否继续?';
          succMessage = '确认成功';
          calMessage = '已取消确认';
          isPaperDev = 1;
        } else {
          confirmText = '取消单据报表与交付审核, 是否继续?';
          succMessage = '取消成功';
          calMessage = '已撤销取消';
          isPaperDev = 0;
        }
        this.$confirm(confirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.report.confirmDev, {
            pmId: pmId,
            operator: this.$parent.getUserId(),
            isPaperDev: isPaperDev,
          }).then((data) => {
            if (data.status == "success") {
              this.$message({type: 'success', message: succMessage});
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
    }
  }
</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
  .interfa-comb {
    padding 0px 15px
  }

  .step {
    padding 20px 15px 20px
  }

  .step_title {
    margin-bottom 10px
  }

  .step_tip {
    float left
    line-height 52px
    color #666666
    font-size 14px
  }

  .step_title span {
    color #666666
    font-size 14px
    cursor pointer
  }

  .step_title span i {
    margin-left 5px
    transition all ease .5s
  }

  .step_title span i.open {
    margin-left 5px
    transform rotate(180deg)
  }

  .step_body {
    padding 20px 10px
    border-radius 3px
    border 1px solid #f8f8f8
  }

  .step_item {
    margin-bottom 15px
  }

  /*审核状态*/
  .audit {
    color: #666666;
  }

  .disaudit {
    color: #ff7171;
  }

  .audited {
    color: #2fdd2f;
  }

  /*进程状态*/
  .rocess-state {
    display flex
  }

  .rocess-state > div {
    flex-grow 1
    line-height 1
    color #e5e5e5
  }

  .rocess-state > div i {
    display inline-block
    width 12px
    height 12px
    margin-bottom 5px
    border-radius 50%
    border 1px solid #1e90ff
  }

  .rocess-state > div.state {
    color #ff4d4d
  }

  .rocess-state > div.state i {
    border none
    background #ff7171
  }
</style>
<!--CSS-RESET-->
<style lang="stylus">
  .el-step__title {
    font-size 12px
  }

  .el-step__icon {
    width 20px
    height 20px
  }

  .el-step__icon-inner {
    display none
  }
</style>
<style lang="stylus">
  .commond-img .el-dialog {
    box-shadow none
    background none
  }

  .commond-img .el-dialog__header i.el-icon-close {
    position relative
    right -28px
    font-size 20px
    z-index 12
    background rgba(0, 0, 0, .6)
    border-radius 50%
  }

  .commond-img .el-dialog__body {
    padding 0px
  }
</style>

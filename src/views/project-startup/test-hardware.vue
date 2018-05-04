<!--
* @author: jinxl
* @date: 2018/1/12
* @module:合同/任务单
-->
<template>
  <div class="testAndHardware">
    <!--接口对应系统-->
    <div class="w-table">
      <div class="w-table-btn">
        <span @click="doStartConfirm" :class="{active:isActive}"><i class="iconfont icon-conf-complete"></i>确认完成</span>
        <span @click="openAddAndModifyWindow(0)"  v-show="!isActive"><i class="iconfont icon-new-add"></i>新增</span>
        <span @click="doUpload" v-show="!isActive"><i class="iconfont icon-to-lead"></i>导入</span>
        <span @click="downloadExcel"><i class="iconfont icon-export"></i>导出</span>
      </div>
      <div class="w-table-content">
        <el-table
          :data="workerInfo"
          style="width: 100%"
          :row-class-name="rowStyle">
          <el-table-column
            prop="map.plName"
            label="系统名称"
          >
          </el-table-column>
          <el-table-column
            prop="hwName"
            label="硬件名称"
            width="200px">
          </el-table-column>
          <el-table-column
            prop="brand"
            label="最低参数"
            width="300px">
          </el-table-column>
          <el-table-column
            prop="model"
            label="推荐型号">
          </el-table-column>
          <el-table-column
            prop="num"
            label="数量"
            width="50px">
          </el-table-column>
          <el-table-column
            prop="useContent"
            label="用途">
          </el-table-column>
          <el-table-column
            prop="isScope"
            label="是否本期范围">
            <template slot-scope="scope">
              <span>{{scope.row.isScope==0?'否':'是'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="operate" v-show="showCol(scope.row)">
                <i class="iconfont icon-edit" @click="openAddAndModifyWindow(scope.row)"></i>
                <i class="iconfont icon-delete" @click="doDelete(scope.row.id)" v-show="!isActive"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="w-table-page">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!--新增和编辑接口信息弹窗-->
    <el-dialog :title="title" width="30%" :visible.sync="addAndModifyWindow">
      <el-form :model="workForm" :rules="rules" ref="workForm">
        <el-form-item label="系统名称" label-width="80px" prop="plId">
          <el-select v-model="plId" placeholder="请选择" @change="doSelect(plId)">
            <el-option
              v-for="item in plList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="硬件名称" label-width="80px" prop="hwName">
          <el-input v-model="workForm.hwName"></el-input>
        </el-form-item>
        <el-form-item label="最低参数" label-width="80px" prop="brand">
          <el-input v-model="workForm.brand"></el-input>
        </el-form-item>
        <el-form-item label="推荐型号" label-width="80px" prop="model">
          <el-input v-model="workForm.model"></el-input>
        </el-form-item>
        <el-form-item label="数量" label-width="80px" prop="num">
          <el-input-number v-model="workForm.num" :min="1" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="用途" label-width="80px" prop="useContent">
          <el-input v-model="workForm.useContent"></el-input>
        </el-form-item>
        <el-form-item label="本期范围" label-width="80px">
          <el-select v-model="reason" placeholder="请选择">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAndModifyWindow = false">取 消</el-button>
        <el-button type="primary" @click="addOrModify('workForm')">确 定</el-button>
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
        :before-upload="beforeUpload"
        :data="upLoadData"
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
        formOpen: true,
        title: '新增',
        uploadWindow: false,//导入弹窗默认关闭
        workId: 0,
        interfaceInfoData: [],//接口信息
        isActive: false,//确认完成
        addAndModifyWindow: false,//默认影藏新增接口信息弹框
        upLoadData: {//上传文件时传递的参数
          pmId: "",//项目id
          operator: ""//操作人
        },
        plId: "",
        plList: [],//产品条线
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
        fileList: [],//上传文件集合
        workForm: {//接口信息表单
          map: [{"plName": ""}],
          plId: "",
          hwName: "",
          brand: "",
          model: "",
          num: 1,
          useContent: "",
          isScope: "1",
          noScopeCode: ""
        },
        rules: {
          plId: {required: true, message: '请选择系统名称', trigger: 'change'},
          hwName: {required: true, message: '请输入硬件名称', trigger: 'blur'},
          brand: {required: true, message: '请输入最低参数', trigger: 'blur'},
          model: {required: true, message: '请输入推荐型号', trigger: 'blur'},
          useContent: {required: true, message: '请输入用途', trigger: 'blur'},
          //isScope: {required: true, message: '请选择本期范围', trigger: 'blur'},
        },
        action: api.url.softHardware.uploadFile,
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
    },
    created() {
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
        api.post(api.url.softHardware.initSourceData, {
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
        api.post(api.url.softHardware.initData, {'first': first, 'count': pageSize, 'pmId': pmId}).then((data) => {
          if (data.status == 'success') {
            console.info(data);
            console.info(this.$parent.getProjectId());
            this.workerInfo = data.rows;
            this.total = data.total;
            this.plList = data.plList;
            if (data.process.isCreateTestEnv != 1 || data.process.isTestHardware != 1) {
              this.isActive = false;
            } else if (data.process.isCreateTestEnv == 1 && data.process.isTestHardware == 1) {
              this.isActive = true;
            }
          }
        });
      },
      //确认完成
      doStartConfirm: function () {
        let pmId = this.$parent.getProjectId();
        let confirmText = '';
        let succMessage = '';
        let calMessage = '';
        let isCreateTestEnv = 0;
        let isTestHardware = 0;
        if (!this.isActive) {
          confirmText = '此操作将确认硬件清单准备和测试环境搭建, 是否继续?';
          succMessage = '确认成功';
          calMessage = '已取消确认';
          isCreateTestEnv = 1;
          isTestHardware = 1;
        } else {
          confirmText = '此操作将取消确认硬件清单准备和测试环境搭建, 是否继续?';
          succMessage = '取消成功';
          calMessage = '已撤销取消';
          isCreateTestEnv = 0;
          isTestHardware = 0;
        }
        this.$confirm(confirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.softHardware.doStartConfirm, {
            pmId: pmId,
            operator: this.$parent.getUserId(),
            isCreateTestEnv: isCreateTestEnv,
            isTestHardware: isTestHardware,
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
      //选择产品分类
      doSelect(plId) {
        this.workForm.plId = plId;
        this.plId = plId;
      },
      //是否可操作
      showCol: function (data) {
        console.info(data.creator);
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
        console.info(data);
        if (data == 0) {
          this.workForm.map.plName = "";
          this.workForm.hwName = "";
          this.workForm.brand = "";
          this.workForm.model = "";
          this.workForm.num = 1;
          this.workForm.useContent = "";
          this.workForm.isScope = "1";
          this.workForm.noScopeCode = "";
          this.plId = "";
          this.reason = "";
          this.workId = 0;
        } else {
          this.workForm.map.plName = data.map.plName;
          this.workForm.hwName = data.hwName;
          this.workForm.brand = data.brand;
          this.workForm.model = data.model;
          this.workForm.num = data.num;
          this.workForm.useContent = data.useContent;
          this.workForm.isScope = data.isScope.toString();
          this.workForm.noScopeCode = data.noScopeCode.toString();
          this.reason = data.noScopeCode.toString();
          this.workForm.plId = data.plId;
          this.plId = data.plId;
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
          api.post(api.url.softHardware.delete, {'id': id}).then((data) => {
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
        this.interfaceInfoWindow = true;
        var json = {
          id: this.workId,
          pmId: this.$parent.getProjectId(),
          plId: this.plId,
          hwName: this.workForm.hwName,
          brand: this.workForm.brand,
          model: this.workForm.model,
          num: this.workForm.num,
          useContent: this.workForm.useContent,
          noScopeCode: this.reason,
          operator: this.$parent.getUserId()
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.post(api.url.softHardware.addOrModify, json).then((data) => {
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
        window.open(api.url.softHardware.exportExcel + "?pmId=" + pmId);
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
      doUpload: function () {
        this.upLoadData.pmId = this.$parent.getProjectId();
        this.upLoadData.operator = this.$parent.getUserId();
        this.uploadWindow = true;
      },
      beforeUpload(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          // this.upLoadData.id = this.result;
          // console.log(this.action);
          // console.log(this.result);
        };
      },
      handlePreview(file) {
        console.log(file);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      uploadSeccess: function (response) {
        console.log(response);
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
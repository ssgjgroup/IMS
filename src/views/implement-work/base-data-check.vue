<!--
* @author: jinxl
* @date: 2018/3/14 0014
* @module:基础数据校验
-->
<template>
  <div class="base-data-check">
    <div class="w-table">
      <div class="w-table-btn">
        <span @click="doConfirm" :class="{active:isActive}"><i class="iconfont icon-conf-complete"></i>确认完成</span>
        <span @click="downloadExcel"><i class="iconfont icon-export"></i>导出模板</span>
      </div>
      <div class="w-table-content">
        <el-table
          :data="checkTableData"
          style="width: 100%">
          <el-table-column
            prop="map.type"
            label="分类">
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="map.subSystem"-->
          <!--label="子系统">-->
          <!--</el-table-column>-->
          <el-table-column
            prop="checkResult"
            label="校验结果">
            <template slot-scope="scope">
              <span :class="scope.row.map.state ? 'dangerous':'noraml'">{{ scope.row.checkResult }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="operate">
                <i class="iconfont icon-look-over" @click="getDetail(scope.row.id)"></i>
                <i class="iconfont icon-conf-complete" @click="doUpload(scope.row.id)"></i>
                <i class="iconfont icon-export" @click="exportSql(scope.row.id)"></i>
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

    <!--数据校验-查看-弹窗-->
    <el-dialog title="新增"
               width="60%"
               :visible.sync="look">
      <el-table :data="gridData"
                height="250">
        <el-table-column property="question" show-overflow-tooltip="true" label="问题描述"></el-table-column>
        <el-table-column property="everyTime" show-overflow-tooltip="true" label="每次用量"></el-table-column>
      </el-table>
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
    //数据
    data() {
      return {
        pmId: "",//项目id
        activeName: 'first',
        uploadWindow: false,//导入弹窗默影藏
        upLoadData: {//上传文件时传递的参数
          id: "",
          operator: this.$parent.getUserId(),
          pmId:this.$parent.getProjectId(),
        },
        isActive: false,
        process: {},
        action: api.url.dataCheck.uploadFile,//上传地址
        pageSize: 10,
        total: 100,
        currentPage: 1,
        look: false,
        fileList: [],//上传文件参数
        checkTableData: [],
        gridData: []
      }
    },
    created() {
      this.$parent.setSelectDisable(true);
      this.$parent.setProjectInfo();
      this.initSourceData();
      this.$nextTick(function () {
        this.getWorkerInfo();
      });
    },
    methods: {
      //初始化数据源
      initSourceData() {
        api.post(api.url.dataCheck.initSourceData, {
          pmId: this.$parent.getProjectId(),
          operator: this.$parent.getUserId(),
          dataType: 0
        }).then((data) => {
          console.log(data.msg);
        });
      },
      //加载数据
      getWorkerInfo: function () {
        let pageSize = this.pageSize;
        let currentPage = this.currentPage;
        let first = (currentPage - 1) * pageSize;
        //获取项目id
        this.pmId = this.$parent.getProjectId();
        //获取userId
        let operator = this.$parent.getUserId();
        console.log("projectId:" + this.pmId);
        api.post(api.url.dataCheck.initData, {
          'first': first,
          'count': pageSize,
          pmId: this.pmId,
          operator: operator
        }).then((data) => {
          console.log(data);
          this.checkTableData = data.rows;
          this.total = data.total;
          this.process = data.process;
          if (this.process.isBasicDataCheck == null || this.process.isBasicDataCheck != 1) {
            this.isActive = false;
          } else if (this.process.isBasicDataCheck == 1) {
            this.isActive = true;
          }
        });
      }, handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getWorkerInfo();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getWorkerInfo();
      },//根据id获取数据信息
      getDetail: function (data) {
        this.look = true;
        this.workId = data;
        api.post(api.url.dataCheck.detail, {id: data}).then((data) => {
          console.log(data);
          this.gridData = data.data;
        });
      },
      //导出excel数据
      downloadExcel: function () {
        window.open(api.url.dataCheck.exportModel);
      },
      //上传数据
      doUpload(id) {
        this.upLoadData.id = id;
        this.uploadWindow = true;
      },
      beforeUpload(file) {
        let reader = new FileReader();
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
      //导出sql文件
      exportSql: function (data) {
        window.open(api.url.dataCheck.exportSql + "?id=" + data);
      },
      //确认完成
      doConfirm: function () {
        let pmId = this.$parent.getProjectId();
        let confirmText = '';
        let succMessage = '';
        let calMessage = '';
        let isBasicDataCheck = 0;
        if (!this.isActive) {
          confirmText = '此操作将确认基础数据校验, 是否继续?';
          succMessage = '确认成功';
          calMessage = '已取消确认';
          isBasicDataCheck = 1;
        } else {
          confirmText = '此操作将取消确认基础数据校验, 是否继续?';
          succMessage = '取消成功';
          calMessage = '已撤销取消';
          isBasicDataCheck = 0;
        }
        this.$confirm(confirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.dataCheck.confirm, {
            pmId: pmId,
            operator: this.$parent.getUserId(),
            isBasicDataCheck: isBasicDataCheck,
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
    }
  }
</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
  .base-data-check {
    padding 15px
  }

  .base-data-check span.noraml {
    color #2fdd2f;
  }

  .base-data-check span.dangerous {
    color #ff6464;
  }
</style>

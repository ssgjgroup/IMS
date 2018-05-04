<!--
* @author: jinxl
* @date: 2018/3/13 0013
* @module:基础数据维护
-->
<template>
  <div class="base-data-maintain">
    <div class="tab">
      <el-tabs v-model="activeName"
               type="card"
               @tab-click="tabSwitch">

        <!--国标数据维护-->
        <el-tab-pane label="国标数据维护" name="first">

          <div class="w-table">
            <div class="w-table-btn">
              <span @click="doConfirm" :class="{active:isActive}"><i class="iconfont icon-conf-complete"></i>确认完成</span>
              <!--<span @click="openWorkinfoWindow"><i class="iconfont icon-new-add"></i>新增</span>-->
              <!--<span @click="uploadWindow=true"><i class="iconfont icon-to-lead"></i>导入</span>-->
              <span @click="downloadExcel"><i class="iconfont icon-export"></i>导出</span>
            </div>
            <div class="w-table-content">
              <el-table
                :data="workerInfo"
                style="width: 100%">
                <el-table-column
                  prop="tableName"
                  label="THIS表名">
                </el-table-column>
                <el-table-column
                  prop="tableCnName"
                  label="数据涵义">
                </el-table-column>
                <el-table-column
                  prop="standardCode"
                  label="标准文号">
                </el-table-column>
                <el-table-column
                  prop="tableAttention"
                  label="注意事项">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <div class="operate">
                      <i class="iconfont icon-look-over" @click="getDetail(scope.row)"></i>
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
        </el-tab-pane>


        <!--行标数据维护-->
        <el-tab-pane label="行标数据维护" name="second">
          <div class="w-table">
            <div class="w-table-btn">
              <span @click="doConfirm" :class="{active:isActive}"><i class="iconfont icon-conf-complete"></i>确认完成</span>
              <!--<span @click="openWorkinfoWindow"><i class="iconfont icon-new-add"></i>新增</span>-->
              <!--<span @click="uploadWindow=true"><i class="iconfont icon-to-lead"></i>导入</span>-->
              <span @click="downloadExcel"><i class="iconfont icon-export"></i>导出</span>
            </div>
            <div class="w-table-content">
              <el-table
                :data="workerInfo"
                style="width: 100%">
                <el-table-column
                  prop="tableName"
                  label="THIS表名">
                </el-table-column>
                <el-table-column
                  prop="tableCnName"
                  label="数据涵义">
                </el-table-column>
                <el-table-column
                  prop="standardCode"
                  label="标准文号">
                </el-table-column>
                <el-table-column
                  prop="tableAttention"
                  label="注意事项">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <div class="operate">
                      <i class="iconfont icon-look-over" @click="getDetail(scope.row)"></i>
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
        </el-tab-pane>

        <!--共享数据-->
        <el-tab-pane label="共享数据维护" name="third">
          <div class="w-table">
            <div class="w-table-btn">
              <span @click="doConfirm" :class="{active:isActive}"><i class="iconfont icon-conf-complete"></i>确认完成</span>
              <!--<span @click="openWorkinfoWindow"><i class="iconfont icon-new-add"></i>新增</span>-->
              <!--<span @click="uploadWindow=true"><i class="iconfont icon-to-lead"></i>导入</span>-->
              <span @click="downloadExcel"><i class="iconfont icon-export"></i>导出</span>
            </div>
            <div class="w-table-content">
              <el-table
                :data="workerInfo"
                style="width: 100%">
                <el-table-column
                  prop="tableName"
                  label="THIS表名">
                </el-table-column>
                <el-table-column
                  prop="tableCnName"
                  label="数据涵义">
                </el-table-column>
                <el-table-column
                  prop="standardCode"
                  label="标准文号">
                </el-table-column>
                <el-table-column
                  prop="tableAttention"
                  label="注意事项">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <div class="operate">
                      <i class="iconfont icon-look-over" @click="getDetail(scope.row)"></i>
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
        </el-tab-pane>


      </el-tabs>
    </div>
    <!--行标数据-查看-弹窗-->
    <el-dialog :title="lookTile"
               width="30%"
               :visible.sync="look">
      <el-table :data="gridData">

        <el-table-column property="ID" label="标准代码" width="150"></el-table-column>
        <el-table-column property="name" label="标准名称" width="200"></el-table-column>
        <el-table-column property="memo" label="备注"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="look = false" size="medium">取消</el-button>
        <el-button type="primary"
                   @click="exportDataInfo()"
                   size="medium">
          导出
        </el-button>
      </div>
    </el-dialog>

    <!--新增数据弹框-->
    <el-dialog title="基础数据" width="30%" :visible.sync="workderInforWindow">
      <el-form :model="workForm" :rules="rules" ref="workForm">
        <el-form-item label="库表编号" label-width="80px" prop="tableCode">
          <el-input v-model="workForm.tableCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="库表名称" label-width="80px" prop="tableName" required>
          <el-input v-model="workForm.tableName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="中文名称" label-width="80px" prop="tableCnName" required>
          <el-input v-model="workForm.tableCnName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据类型" label-width="80px" prop="dataType" required>
          <el-input v-model="workForm.dataType" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="注意事项" label-width="80px" prop="tableAttention">
          <el-input v-model="workForm.tableAttention" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="workderInforWindow = false">取 消</el-button>
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
        dataType: "",//数据类型
        activeName: 'second',
        isActive: false,
        formLabelWidth: '120px',
        pageSize: 10,
        total: 100,
        currentPage: 1,
        process: {},
        look: false,//详情弹出框默认影藏
        uploadWindow: false,//导入弹出框默认影藏
        workderInforWindow: false,//新增数据弹框默认影藏
        action: api.url.basicData.uploadFile,//数据加载url
        fileList: [],//上传文件参数
        workerInfo: [],//加载数据参数
        workId: 0,//默认当前数据id为0
        lookTile: "",
        //数据详情参数
        gridData: [],
        //新增数据参数
        workForm: {
          tableCode: '',
          tableName: '',
          tableCnName: '',
          dataType: '',
          tableAttention: ''
        },
        //新增数据校验规则
        rules: {
          tableCode: [
            {max: 32, message: '长度最多为32', trigger: 'blur'}
          ],
          tableName: [
            {required: true, message: '请输入库表名称', trigger: 'blur'}
          ],
          tableCnName: [
            {required: true, message: '请输入中文名称', trigger: 'blur'}
          ],
          dataType: [
            {required: true, message: '请输入数据类型', trigger: 'blur'},
            {pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur'}
          ],
          tableAttention: [
            //{pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码'}
          ]
        }
      }
    },
    created() {
      this.$parent.setSelectDisable(true);
      this.$parent.setProjectInfo();
      this.$nextTick(function () {
        this.getWorkerInfo();
      });
    },
    methods: {
      tabSwitch: function (tab, event) {
        console.log(tab, event);
        this.activeName = tab.name;
        this.getWorkerInfo();
      },
      /*删除行数据*/
      deleteRow: function () {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //加载数据
      getWorkerInfo: function () {
        var pageSize = this.pageSize;
        var currentPage = this.currentPage;
        var first = (currentPage - 1) * pageSize;
        //获取项目id
        this.pmId = this.$parent.getProjectId();
        console.log("projectId:" + this.pmId);
        if (this.activeName == "first") {
          //国标数据
          this.dataType = "0";
        } else if (this.activeName == "second") {
          //行标数据
          this.dataType = "1";
        } else if (this.activeName == "third") {
          //共享数据
          this.dataType = "2";
        }
        api.post(api.url.basicData.initData, {
          'first': first,
          'count': pageSize,
          pmId: this.pmId,
          dataType: this.dataType
        }).then((data) => {
          console.log(data);
          this.workerInfo = data.rows;
          this.total = data.total;
          this.process = data.process;
          if (this.process.isBasicDataUse == null || this.process.isBasicDataUse != 1) {
            this.isActive = false;
          } else if (this.process.isBasicDataUse == 1) {
            this.isActive = true;
          }
        });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getWorkerInfo();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getWorkerInfo();
      },
      //根据id获取数据信息
      getDetail: function (data) {
        this.look = true;
        this.workId = data.id;
        this.lookTile = data.tableName;
        api.post(api.url.basicData.detail, {id: data.id}).then((data) => {
          console.log(data);
          this.gridData = data.data;
        });
      },

      //导出excel数据
      downloadExcel: function () {
        window.open(api.url.basicData.exportExcel + "?pmId=" + this.pmId + "&dataType=" + this.dataType);
      },
      //上传数据
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
      //导出表的所有数据
      exportDataInfo: function () {
        console.log(this.workId);
        window.open(api.url.basicData.exportDataInfo + "?id=" + this.workId);
      },
      //导出sql文件
      exportSql: function (data) {
        window.open(api.url.basicData.exportSql + "?id=" + data);
      },
      //新增数据弹框
      openWorkinfoWindow: function () {
        this.workId = 0;
        this.tableCode = '',
          this.tableName = '',
          this.tableCnName = '',
          this.dataType = '',
          this.tableAttention = ''
        this.workderInforWindow = true;
      },
      //增加或者修改数据
      addOrModify: function (formName) {
        console.log(formName);
        var json = {
          id: this.workId,
          tableCode: this.workForm.tableCode,
          tableName: this.workForm.tableName,
          tableCnName: this.workForm.tableCnName,
          dataType: this.workForm.dataType,
          tableAttention: this.workForm.tableAttention
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.post(api.url.basicData.addOrModify, json).then((data) => {
              if (data.status = 'success') {
                this.getWorkerInfo();
              }
              this.workderInforWindow = false;
            });
          }
        })
      },
      //确认完成
      doConfirm: function () {
        var type = "";
        var message = "";
        this.$confirm('确认完成, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.basicData.confirm, {
            pmId: this.pmId,
            dataType: this.dataType
          }).then((data) => {
            console.log(data);
            type = data.type;
            message = data.msg;
            this.$message({
              type: type,
              message: message
            });
            if ('success' == type) {
              this.isActive = true;
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "取消确认！"
          });
        });
      }


    }
  }

</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
  .base-data-maintain {
  }

  .base-data-maintain .tab {
    margin-top 30px;
    margin-left 25px;
  }

  /*1660*/
  @media screen and (max-width: 1660px) {
  }

  /*1366*/
  @media screen and (max-width: 1366px) {
  }
</style>

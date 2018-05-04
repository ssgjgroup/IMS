<!--
* @author: jinxl
* @date: 2018/04/10
* @module:接口梳理开发
-->
<template>
  <div class="interfa-comb">
    <div class="step">
      <div class="step_title">
        <span @click="stepState = !stepState">接口梳理&开发<i
          :class="[stepState ? 'open':'','el-icon-arrow-down']"></i></span>
      </div>
      <transition
        enterActiveClass="animated fadeInUp">
        <div class="step_body" v-show="stepState">
          <el-steps :active="-1"
                    align-center
                    process-status="finish">
            <el-step title="接口数量确认"></el-step>
            <el-step title="并发处理"></el-step>
            <el-step title="完成情况登记"></el-step>
            <el-step title="审核员审核"></el-step>
          </el-steps>
        </div>
      </transition>
    </div>
    <div class="w-table">
      <div class="w-table-btn">
        <span :class="{active:isActive}" @click="doConfirmNum"><i class="iconfont icon-conf-complete"></i>确认完成</span>
        <span @click="openWorkinfoWindow(0)" v-show="!isActive"><i class="iconfont icon-new-add"></i>新增</span>
        <span @click="confirmDev" :class="{ active: isConfig }" v-show="isActive"><i
          class="iconfont icon-conf-complete"></i>提交审核</span>
        <div class="w-table-btn_tip" align="right">
          <span>接口总数：{{countNum}}</span>
          <span>已完成数：{{completeNum}}</span>
        </div>
      </div>
      <div class="w-table-content">
        <el-table
          @cell-mouse-enter="getSelectRow"
          :data="interfaceTableData"
          style="width: 100%">
          <el-table-column
            prop="productName"
            label="分类">
          </el-table-column>
          <el-table-column
            prop="interfaceName"
            label="接口名称">
          </el-table-column>
          <el-table-column
            align="center"
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
            align="center"
            label="完成情况"
            width="320px"
            :disabled="!isManager"
          >
            <template slot-scope="scope">
              <el-checkbox-group v-model="scope.row.map.contentList"
                                 :disabled="!isManager||scope.row.isScope!=1"
                                 @change="completeChange(scope.row)">
                <el-checkbox label="1">数据准确</el-checkbox>
                <el-checkbox label="2">性能正常</el-checkbox>
                <el-checkbox label="3">流程符合</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            align="center"
            label="审核状态"
            :disabled="!isManager"
          >

            <template slot-scope="scope">
              <el-dropdown :hide-on-click="false" placement="bottom-start" trigger="click">
                <span class="el-dropdown-link">
                  <span v-if="scope.row.status==1" class="audit">
                    待审核-{{ scope.row.message }}
                  </span>
                  <span v-else-if="scope.row.status==2" class="disaudit">
                    审核不通过-{{ scope.row.message }}
                  </span>
                  <span v-else-if="scope.row.status==9" class="audited">
                    审核通过-{{ scope.row.message }}
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
                        v-model="scope.row.message" :disabled="!isManager||scope.row.isScope!=1">
                      </el-input>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div style="text-align: right; margin-top: 5px" v-show="isManager&&scope.row.isScope==1">
                        <el-button @click.native="dropdownClose" size="small">取 消</el-button>
                        <el-button @click.native="changeStatus"
                                   type="primary"
                                   size="small">确 定
                        </el-button>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>

          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="operate">
                <div class="operate" v-show="showCol(scope.row)">
                  <i class="iconfont icon-edit" @click="openWorkinfoWindow(scope.row)"></i>
                  <i class="iconfont icon-delete" @click="deleteInterfaceInfo(scope.row.id)" v-show="!isActive"></i>
                </div>
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
               width="30%"
               :visible.sync="workderInforWindow">
      <el-form :model="workForm" :rules="rules" ref="workForm" :disabled="isActive">
        <el-form-item label="系统名称" prop="productName" label-width="80px">
          <el-input v-model="workForm.productName"></el-input>
        </el-form-item>
        <el-form-item label="接口名称" prop="interfaceName" label-width="80px">
          <el-input v-model="workForm.interfaceName"></el-input>
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
        <el-form-item label="备注信息" prop="remark" label-width="80px">
          <el-input type="textarea" v-model="workForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="workderInforWindow = false">取 消</el-button>
      <el-button size="small" type="primary" @click="addOrModify('workForm')" :disabled="isActive">确 定</el-button>
    </span>
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
        pmId: this.$parent.getProjectId(),
        workId: 0,
        isActive: false,
        process: {},
        isConfig: false, //提交审核
        isManager: false, //是否项目经理
        operateRow: {},
        stepState: true,
        workderInforWindow: false,
        completeNum: 0,//已完成数
        countNum: 0,//统计总数
        plId: "",//所选产品线id
        plList: [],//产品线
        //contentList: [],//完成情况
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
        pageSize: 10,
        total: 100,
        currentPage: 1,
        interfaceTableData: [],
        /*弹窗数据*/
        workForm: {
          productName: "",
          interfaceName: '',
          isScope: "1",
          noScopeCode: "",
          contentType: "",
          remark: "",
          status: "",
        },
        rules: {
          productName: {required: true, message: '请输入系统名称',},
          interfaceName: {required: true, message: '请输入接口名称',},
          noScopeCode: {required: true, message: '请选择范围', trigger: 'change'}
        },
      }
    }, created() {
      this.$parent.setSelectDisable(true);
      this.$parent.setProjectInfo();
      this.initSourceData();
      this.$nextTick(function () {
        this.getInterfaceTableData();
      });
    }, methods: {
      //初始化接口数据源
      initSourceData() {
        api.post(api.url.thirdInterface.initSourceData, {
          pmId: this.pmId,
          operator: this.$parent.getUserId(),
        }).then((data) => {
          console.log(data.msg);
        });
      },
      dropdownClose(e) {
        document.getElementById(e.target.offsetParent.id).style.display = "none";
      },
      //获取当前行的ID
      getSelectRow: function (row) {
        this.operateRow = row;
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
      //加载数据
      getInterfaceTableData: function () {
        var pageSize = this.pageSize;
        var currentPage = this.currentPage;
        var first = (currentPage - 1) * pageSize;
        //获取项目id
        this.pmId = this.$parent.getProjectId();
        api.post(api.url.thirdInterface.initData, {
          'first': first,
          'count': pageSize,
          pmId: this.pmId,
          userId: this.$parent.getUserId(),
        }).then((data) => {
          console.log(data);
          this.interfaceTableData = data.rows;
          this.total = data.total;
          this.plList = data.plList;
          this.resonList = data.resonList;
          this.completeNum = data.completeNum;
          this.countNum = data.countNum;
          this.process = data.process;
          if (data.user.ryfl == null || data.user.ryfl != 0) {
            this.isManager = false;
          } else if (data.user.ryfl == 0) {
            this.isManager = true;
          }
          console.info("isManager:" + this.isManager);
          if (this.process.isInterfaceAffirm == null || this.process.isInterfaceAffirm != 1) {
            this.isActive = false;
          } else if (this.process.isInterfaceAffirm == 1) {
            this.isActive = true;
          }
          if (this.process.isInterfaceDev == null || this.process.isInterfaceDev != 1) {
            this.isConfig = false;
          } else if (this.process.isInterfaceDev == 1) {
            this.isConfig = true;
          }
        });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getInterfaceTableData();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getInterfaceTableData();
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
      //新增数据弹框
      openWorkinfoWindow: function (data) {
        if (this.$refs['workForm'] !== undefined) {
          this.$refs['workForm'].resetFields();
        }
        console.info(data);
        if (data == 0) {
          this.workForm.productName = "";
          this.workForm.interfaceName = "";
          this.workForm.isScope = "1";
          this.workForm.noScopeCode = "";
          this.workId = 0;
          this.reason = "";
        } else {
          this.workForm.productName = data.productName;
          this.workForm.interfaceName = data.interfaceName;
          this.workForm.isScope = data.isScope.toString();
          this.workForm.noScopeCode = data.noScopeCode.toString();
          this.workId = data.id;
          this.reason = data.noScopeCode.toString();
        }
        console.info(this.workForm.plId);
        this.workderInforWindow = true;
      },
      //完成情况
      completeChange(row) {
        console.info(row.map.contentList.toString());
        this.$nextTick(() => {
          api.post(api.url.thirdInterface.changeContent, {
            'contentType': row.map.contentList.toString(),
            'id': row.id,
            'operator': this.$parent.getUserId(),
          }).then((data) => {
            console.log(data.msg);
          });
        });
      },
      //审核
      changeStatus(e) {
        api.post(api.url.thirdInterface.changeStatus, {
          id: this.operateRow.id,
          status: this.operateRow.status,
          message: this.operateRow.message,
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
      //选择产品分类
      doSelect(plId) {
        this.workForm.plId = plId;
        this.plId = plId;
      },
      //选择范围
      doRangeSelect(row) {
        //改变范围
        this.$nextTick(() => {
          api.post(api.url.thirdInterface.changeScope, {
            'noScopeCode': row.noScopeCode,
            'id': row.id,
            'pmId':this.$parent.getProjectId(),
            'operator': this.$parent.getUserId(),
          }).then((data) => {
            console.log(data.msg);
            row.isScope = data.isScope;
            this.countNum = data.countNum;
            this.completeNum=data.completeNum;
          });
        });
      },
      deleteInterfaceInfo: function (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.thirdInterface.delete, {'id': id}).then((data) => {
            if (data.status == "success") {
              this.$message({type: 'success', message: '删除成功!'});
              this.getInterfaceTableData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //增加或者修改数据
      addOrModify: function (formName) {
        var json = {
          pmId: this.$parent.getProjectId(),
          operator: this.$parent.getUserId(),
          id: this.workId,
          productName: this.workForm.productName,
          interfaceName: this.workForm.interfaceName,
          noScopeCode: this.reason,
          remark: this.workForm.remark,
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.post(api.url.thirdInterface.addOrModify, json).then((data) => {
              if (data.status = 'success') {
                this.getInterfaceTableData();
              }
              this.workderInforWindow = false;
            });
          }
        })
      },
      //确认数量完成
      doConfirmNum: function () {
        let pmId = this.$parent.getProjectId();
        let confirmText = '';
        let succMessage = '';
        let calMessage = '';
        let isInterfaceAffirm = 0;
        if (!this.isActive) {
          confirmText = '此操作将确认接口开发的范围, 是否继续?';
          succMessage = '确认成功';
          calMessage = '已取消确认';
          isInterfaceAffirm = 1;
        } else {
          confirmText = '此操作将取消确认接口开发的范围, 是否继续?';
          succMessage = '取消成功';
          calMessage = '已撤销取消';
          isInterfaceAffirm = 0;
        }
        this.$confirm(confirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.thirdInterface.confirmNum, {
            pmId: pmId,
            operator: this.$parent.getUserId(),
            isInterfaceAffirm: isInterfaceAffirm,
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
        let isInterfaceDev = 0;
        if (!this.isConfig) {
          confirmText = '提交接口开发与交付审核, 是否继续?';
          succMessage = '确认成功';
          calMessage = '已取消确认';
          isInterfaceDev = 1;
        } else {
          confirmText = '取消接口开发与交付审核, 是否继续?';
          succMessage = '取消成功';
          calMessage = '已撤销取消';
          isInterfaceDev = 0;
        }
        this.$confirm(confirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.thirdInterface.confirmDev, {
            pmId: pmId,
            operator: this.$parent.getUserId(),
            isInterfaceDev: isInterfaceDev,
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

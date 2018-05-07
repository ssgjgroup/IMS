<!--
* @author: jinxl
* @date: 2018/3/6
* @module:项目信息
-->
<template>
  <div class="information">
    <div class="project-result" v-show="formShrink">
      <dl class="clearfix">
        <dt><span>{{ projectForm.id }}</span>{{ projectForm.pmName }}</dt>
        <dd>{{ projectForm.pmCode}}</dd>
        <dd>{{ projectForm.locationLabel }}</dd>
        <dd>{{ projectForm.hopitalLabel }}</dd>
        <dd><i class="iconfont icon-spec-type"></i>{{ projectForm.junior }}</dd>
        <dd><i class="iconfont icon-feat-room"></i>{{ projectForm.feature }}</dd>
        <dd><i class="iconfont icon-clinic"></i>{{ projectForm.outpatient }}</dd>
        <dd><i class="iconfont icon-bed-number"></i>{{ projectForm.bed }}</dd>
        <dd class="open" @click="formShrink = false ;formOpen = true;"><i class="iconfont icon-edit"></i></dd>
      </dl>
    </div>
    <transition
      enterActiveClass="animated bounceInLeft">
      <div class="project-form" v-show="formOpen">
        <el-form ref="projectForm"
                 :model="projectForm"
                 label-width="80px"
                 size="medium">
          <el-row>
            <el-col :md="16" :lg="16">
              <el-form-item label="项目名称">
                <el-input v-model="projectForm.pmName">
                  <template slot="prepend">{{projectForm.pmCode}}</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="16" :lg="16">
              <el-row :gutter="10">
                <el-col :md="12" :lg="12">
                  <el-form-item label="客户名称">
                    <el-input v-model="projectForm.custom"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="12" :lg="12">
                  <el-form-item label="所在地区">
                    <el-select v-model="projectForm.location"
                               clearable
                               filterable
                               placeholder="所在地区">
                      <el-option
                        v-for="item in areaData"
                        :key="item.dictSort"
                        :label="item.dictLabel"
                        :value="item.dictV">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :md="7" :lg="7">
              <el-form-item label="医院等级">
                <el-select v-model="projectForm.hopital"
                           clearable
                           filterable
                           placeholder="医院等级">
                  <el-option
                    v-for="item in hopitalData"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictV">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="16" :lg="16">
              <el-row :gutter="10">
                <el-col :md="12" :lg="12">
                  <el-form-item label="专科类型">
                    <el-input v-model="projectForm.junior"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="12" :lg="12">
                  <el-form-item label="特色科室">
                    <el-input v-model="projectForm.feature"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :md="7" :lg="7">
              <el-form-item label="门诊量">
                <el-input v-model.number="projectForm.outpatient">
                  <template slot="append">人次/天</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :lg="8">
              <el-form-item label="床位数">
                <el-input v-model.number="projectForm.bed">
                  <template slot="append">床</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="23" :lg="23" style="text-align:right">
              <el-button
                @click="closeMethod"
                size="medium"
              >取消
              </el-button>
              <el-button
                @click="saveData"
                size="medium"
                type="primary">保存
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <div class="split-line"></div>
      </div>
    </transition>
    <div class="project-table">
      <el-tabs v-model="activeName" type="card" @tab-click="tabSwitch">

        <el-tab-pane label="医院科室录入" name="zero">
          <div class="w-table">
            <div class="w-table-btn">
              <!--  <span><i class="iconfont icon-conf-complete"></i>确认完成</span> -->
              <span @click="openDepartWindow"><i class="iconfont icon-new-add"></i>新增</span>
              <span @click="openDeptUploadWindow"><i class="iconfont icon-to-lead"></i>导入</span>
              <span @click="downDepartloadExcel"><i class="iconfont icon-export"></i>导出</span>
            </div>
            <div class="w-table-content">
              <el-table
                :data="deptInfo"
                style="width: 100%">
                <el-table-column
                  prop="typeName"
                  label="科室分类">
                </el-table-column>
                <el-table-column
                  prop="deptCode"
                  label="科室编码">
                </el-table-column>
                <el-table-column
                  prop="deptName"
                  label="科室名称">
                </el-table-column>

                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <div class="operate">
                      <i class="iconfont icon-edit" @click="openDeptDetails(scope.row)"></i>
                      <i class="iconfont icon-delete" @click="deleteDeptRow(scope.row.id)"></i>
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

        <el-tab-pane label="医院职工录入" name="first">
          <div class="w-table">
            <div class="w-table-btn">
              <!--  <span><i class="iconfont icon-conf-complete"></i>确认完成</span> -->
              <span @click="openWorkinfoWindow"><i class="iconfont icon-new-add"></i>新增</span>
              <span @click="openUploadWindow"><i class="iconfont icon-to-lead"></i>导入</span>
              <span @click="downloadExcel"><i class="iconfont icon-export"></i>导出</span>
            </div>
            <div class="w-table-content">
              <el-table
                :data="workerInfo"
                style="width: 100%">
                <el-table-column
                  prop="userid"
                  label="工号">
                </el-table-column>
                <el-table-column
                  prop="yhmc"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  prop="clo1"
                  label="部门">
                </el-table-column>
                <el-table-column
                  prop="clo2"
                  label="角色">
                </el-table-column>
                <el-table-column
                  prop="mobile"
                  label="电话"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="email"
                  label="邮箱">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <div class="operate">
                      <i class="iconfont icon-edit" @click="openDetails(scope.row)"></i>
                      <i class="iconfont icon-delete" @click="deleteRow(scope.row.id)"></i>
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

        <el-tab-pane label="合同/任务单" name="second">
          <div class="w-table">
            <div class="w-table-btn">
              <span @click="addTask"><i class="iconfont icon-new-add"></i>新增</span>
              <span @click="downloadTask"><i class="iconfont icon-export"></i>导出</span>
            </div>
            <div class="w-table-content">
              <el-table
                :data="taskList"
                style="width: 100%">
                <el-table-column
                  prop="zxtmc"
                  label="产品名称">
                </el-table-column>
                <el-table-column
                  prop="cpmc"
                  label="模块名称">
                </el-table-column>
                <el-table-column
                  prop="mx"
                  label="明细">
                </el-table-column>
                <el-table-column
                  prop="bz"
                  label="备注">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <div class="operate" v-show="showCol(scope.row)">
                      <i class="iconfont icon-edit" @click="editTask(scope.row)"></i>
                      <i class="iconfont icon-delete" @click="deleteTask(scope.row.id)"></i>
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

        <!--接口对应系统-->
        <el-tab-pane label="接口对应系统" name="third">
          <div class="w-table">
            <div class="w-table-btn">
              <span @click="confirmContractTask" :class="{active:isActive}"><i class="iconfont icon-conf-complete"></i>确认完成</span>
              <span @click="openInterfaceInfoWindow(0)" v-show="!isActive"><i class="iconfont icon-new-add"></i>新增</span>
              <span @click="downloadInterfaceInfo"><i class="iconfont icon-export"></i>导出</span>
            </div>
            <div class="w-table-content">
              <el-table
                :data="interfaceInfoData"
                style="width: 100%">
                <el-table-column
                  prop="productName"
                  label="产品名称">
                </el-table-column>
                <el-table-column
                  prop="interfaceName"
                  label="模块名称">
                </el-table-column>
                <el-table-column
                  prop="moduleDetail"
                  label="明细">
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="备注">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <div class="operate" v-show="showOperation(scope.row)">
                      <i class="iconfont icon-edit" @click="openInterfaceInfoWindow(scope.row)"></i>
                      <i class="iconfont icon-delete" @click="deleteInterfaceInfo(scope.row.id)"></i>
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
        <!--新增和编辑接口信息弹窗-->
        <el-dialog :title="title" width="30%" :visible.sync="interfaceInfoWindow">
          <el-form :model="interfaceInfoForm" :rules="interfaceInfoRules" ref="interfaceInfoForm">
            <!--<el-form-item label="系统名称" label-width="80px" prop="plId">-->
            <!--<el-select v-model="plId" placeholder="请选择" @change="doSelect(plId)">-->
            <!--<el-option-->
            <!--v-for="item in plList"-->
            <!--:key="item.id"-->
            <!--:label="item.name"-->
            <!--:value="item.id">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="产品名称" label-width="80px" prop="productName" required>
              <el-input v-model="interfaceInfoForm.productName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="模块名称" label-width="80px" prop="interfaceName">
              <el-input v-model="interfaceInfoForm.interfaceName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="模块明细" label-width="80px" prop="moduleDetail">
              <el-input v-model="interfaceInfoForm.moduleDetail" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注信息" label-width="80px" prop="remark">
              <el-input v-model="interfaceInfoForm.remark" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="interfaceInfoWindow = false">取 消</el-button>
            <el-button type="primary" @click="addOrModifyInterfaceInfo('interfaceInfoForm')">确 定</el-button>
          </div>
        </el-dialog>
        <el-tab-pane label="实施路径" name="fifth">
          <div class="w-table">
            <div class="w-table-btn">
              <span @click="downloadimplPathInfo"><i class="iconfont icon-export"></i>导出</span>
            </div>
            <div class="w-table-content">
              <el-table
                :data="implePath"
                style="width: 100%">
                <el-table-column
                  prop="milepost"
                  label="里程碑">
                </el-table-column>
                <el-table-column
                  prop="mainStep"
                  label="主要阶段">
                </el-table-column>
                <el-table-column
                  prop="stepType"
                  label="阶段工作分类">
                </el-table-column>
                <el-table-column
                  prop="stepContent"
                  label="主要工作内容">
                </el-table-column>
                <el-table-column
                  prop="stepDesc"
                  label="具体工作项"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="stepOutput"
                  label="对应产出物">
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="备注">
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
        <el-tab-pane label="项目组信息" name="sixth">
          <div class="w-table">
            <div class="w-table-btn">
              <span @click="doUserConfirm" :class="{active:isUserActive}"><i class="iconfont icon-conf-complete"></i>确认完成</span>
              <span @click="openEtUserInfoWindow" v-show="!isUserActive"><i class="iconfont icon-new-add"></i>新增</span>
              <span @click="openUploadEtUserInfoWindow" v-show="!isUserActive"><i class="iconfont icon-to-lead"></i>导入</span>
              <span @click="downloadExcelEtUserInfo"><i class="iconfont icon-export"></i>导出</span>
            </div>
            <div class="w-table-content">
              <el-table
                :data="etUserInfo"
                style="width: 100%">
                <el-table-column
                  prop="map.userType"
                  label="成员属性">
                </el-table-column>
                <el-table-column
                  prop="userCard"
                  label="工号">
                </el-table-column>
                <el-table-column
                  prop="cName"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  prop="orgName"
                  label="部门">
                </el-table-column>
                <el-table-column
                  prop="map.positionName"
                  label="职务">
                </el-table-column>
                <el-table-column
                  prop="telephone"
                  label="电话"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="email"
                  label="邮箱">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <div class="operate" v-show="scope.row.isDel != -1">
                      <i class="iconfont icon-edit" @click="openEtUsetInfoDetails(scope.row)"></i>
                      <i class="iconfont icon-delete" @click="deleteEtUsetInfoDetails(scope.row.id)"></i>
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
        <el-tab-pane label="上线支持人员" name="seventh">
          <div class="w-table">
            <div class="w-table-btn">
              <span @click="confirmOnLineUser" :class="{ active:onlineActive }"><i
                class="iconfont icon-conf-complete"></i>确认完成</span>
              <span @click="openEtOnlineUserWindow"><i class="iconfont icon-new-add"></i>新增</span>
              <span @click="openLineUploadWindow"><i class="iconfont icon-to-lead"></i>导入</span>
              <span @click="downloadExcelLineUser"><i class="iconfont icon-export"></i>导出</span>
            </div>
            <div class="w-table-content">
              <el-table
                :data="etOnlineInfo"
                style="width: 100%">
                <el-table-column
                  prop="userCode"
                  label="工号">
                </el-table-column>
                <el-table-column
                  prop="cName"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  prop="roleName"
                  label="角色">
                </el-table-column>
                <el-table-column
                  prop="responseDept"
                  label="部门">
                </el-table-column>
                <el-table-column
                  prop="responseSite"
                  label="站点">
                </el-table-column>
                <el-table-column
                  prop="telephone"
                  label="电话">
                </el-table-column>
                <el-table-column
                  prop="wechatNo"
                  label="微信号">
                </el-table-column>
                <el-table-column
                  prop="email"
                  label="邮箱">
                </el-table-column>
                <el-table-column
                  prop="lodging"
                  label="住宿信息">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <div class="operate">
                      <i class="iconfont icon-edit" @click="openLineUserDetails(scope.row)"></i>
                      <i class="iconfont icon-delete" @click="deleteEtOnlineUsetInfoDetails(scope.row.id)"></i>
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

    <!--医院科室录入弹窗 -->
    <el-dialog :title="title" width="35%" :visible.sync="deptInforWindow">
      <el-form :model="deptForm" :rules="deptRules" ref="deptForm">
        <el-form-item label="科室类别" label-width="120px" prop="typeName" required>
          <el-input v-model="deptForm.typeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="科室名称" label-width="120px" prop="deptName" required>
          <el-input v-model="deptForm.deptName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deptInforWindow = false">取 消</el-button>
        <el-button type="primary" @click="deptAddorModify('deptForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--医院职工录入弹窗-->
    <el-dialog :title="title" width="30%" :visible.sync="workderInforWindow">
      <el-form :model="workForm" :rules="rules" ref="workForm">
        <el-form-item label="工号" label-width="60px" prop="userid" required>
          <el-input v-model="workForm.userid" auto-complete="off">
            <!-- <template slot="prepend">{{ customerID }}</template> -->
          </el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="60px" prop="yhmc" required>
          <el-input v-model="workForm.yhmc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" label-width="60px" prop="clo1" required>
          <el-input v-model="workForm.clo1" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="60px" prop="clo2" required>
          <el-input v-model="workForm.clo2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="60px" prop="mobile">
          <el-input v-model="workForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="60px" prop="email">
          <el-input v-model="workForm.email" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="workderInforWindow = false">取 消</el-button>
        <el-button type="primary" @click="addOrModify('workForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--合同任务单弹窗-->
    <el-dialog :title="title" width="30%" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="产品名称" :label-width="formLabelWidth" required>
          <el-autocomplete size="max"
                           v-model="form.product"
                           :fetch-suggestions="querySearchAsync"
                           placeholder="请输入产品名称"
                           :trigger-on-focus="false"
                           @select="handleSelect">
            <i slot="suffix" class="el-input__icon el-icon-close" @click="form.product=''"></i>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="模块名称" :label-width="formLabelWidth" required>
          <el-autocomplete size="max"
                           v-model="form.model"
                           :fetch-suggestions="queryModelAsync"
                           placeholder="请输入模块名称"
                           :trigger-on-focus="false"
                           @select="handleModel">
            <i slot="suffix" class="el-input__icon el-icon-close" @click="form.model=''"></i>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="模块明细" :label-width="formLabelWidth">
          <el-input v-model="form.detail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注信息" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.note"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrModifyProduct('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!--项目组员录入弹窗-->
    <el-dialog :title="title" width="30%" :visible.sync="etUserInoFormWindow">
      <el-form :model="etUserInoForm" :rules="etUserRoles" ref="etUserInoForm">
        <el-form-item label="成员属性" label-width="80px" prop="userType" required>
          <el-select v-model="etUserInoForm.userType"
                     clearable
                     filterable
                     @change="userTypeChange"
                     placeholder="成员属性">
            <el-option
              v-for="item in userTypeData"
              :key="item.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" label-width="60px" prop="userCard" required>
          <el-input v-model="etUserInoForm.userCard" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="60px" prop="cName" required>
          <el-input v-model="etUserInoForm.cName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" label-width="60px" prop="orgName" required>
          <el-input v-model="etUserInoForm.orgName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="职务" label-width="60px" prop="positionName" required>
          <el-input v-if="userTypeValue" v-model="etUserInoForm.positionName"
                    auto-complete="off"></el-input>
          <el-select v-if="!userTypeValue" v-model="etUserInoForm.positionName"
                     clearable
                     filterable
                     placeholder="职务">
            <el-option
              v-for="item in positionTypeData"
              :key="item.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" label-width="60px" prop="telephone">
          <el-input v-model="etUserInoForm.telephone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="60px" prop="email">
          <el-input v-model="etUserInoForm.email" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="etUserInoFormWindow = false">取 消</el-button>
        <el-button type="primary" @click="userAddOrModify('etUserInoForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--上线支持人员录入弹窗-->
    <el-dialog :title="title" width="30%" :visible.sync="etOnlineUserWindow">
      <el-form :model="etOnlineUserForm" :rules="rules" ref="etOnlineUserForm">
        <el-form-item label="工号" label-width="60px" prop="userCode" required>
          <el-input v-model="etOnlineUserForm.userCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="60px" prop="cName" required>
          <el-input v-model="etOnlineUserForm.cName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" label-width="60px" prop="responseDept" required>
          <el-input v-model="etOnlineUserForm.responseDept" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="60px" prop="roleName" required>
          <el-input v-model="etOnlineUserForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="站点" label-width="60px" prop="responseSite" required>
          <el-input v-model="etOnlineUserForm.responseSite" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信号" label-width="70px" prop="wechatNo" required>
          <el-input v-model="etOnlineUserForm.wechatNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="60px" prop="telephone" required>
          <el-input v-model="etOnlineUserForm.telephone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="60px" prop="email" required>
          <el-input v-model="etOnlineUserForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="住宿信息" label-width="80px" prop="lodging" required>
          <el-input v-model="etOnlineUserForm.lodging" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="workderInforWindow = false">取 消</el-button>
        <el-button type="primary" @click="onlineAddOrModify('etOnlineUserForm')">确 定</el-button>
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
    data() {
      return {
        formOpen: true,
        workId: 0,
        title: '新增',
        formShrink: false,
        uploadWindow: false,
        area: '',
        city: '',
        areaData: [],
        hopital: '',
        hopitalData: [],
        interfaceInfoId: 0,
        plId: "",//接口产品条线
        plList: [],//产品线
        interfaceInfoData: [],//接口信息
        interfaceInfoWindow: false,//默认影藏新增接口信息弹框
        interfaceInfoForm: {//接口信息表单
          productName: "",
          interfaceName: "",
          moduleDetail: "",
          remark: ""
        },
        interfaceInfoRules: {
          productName: {required: true, message: '请输入产品名称'},
          interfaceName: {required: true, message: '请输入模块名称'},
        },
        action: api.url.hospitalInfo.uploadFile + '?ssgs=' + this.$parent.getContractId(),
        fileList: [],
        initData: {},
        projectForm: {
          pmCode: '100534',
          pmName: '北京西路HIS',
          custom: '上海市儿童医院',
          junior: '',
          bed: '12000',
          location: '10',
          locationLabel: '上海市',
          feature: '',
          hopital: '5',
          hopitalLabel: '三甲等级',
          outpatient: '980'
        },
        activeName: 'zero',
        workerInfo: [],
        deptInforWindow: false,
        workderInforWindow: false,
        uploadWindow: false,

        workForm: {
          userid: '',
          yhmc: '',
          col1: '',
          col2: '',
          mobile: '',
          email: ''
        },
        uploadForm: {
          uploadFile: ''
        },
        deptId: 0,  //医院科室
        deptForm: {},
        deptInfo: [],


        etOnlineInfo: [],
        etOnlineUserWindow: false,
        uploadWindow: false,
        pageSize: 10,
        total: 100,
        currentPage: 1,
        etOnlineUserForm: {
          workId: 0,
          userCode: '',
          cName: '',
          roleName: '',
          responseDept: '',
          responseSite: '',
          telephone: '',
          wechatNo: '',
          email: '',
          lodging: ''
        },
        etUserInfo: [],
        etUserInoFormWindow: false,
        uploadEtUserInoWindow: false,
        userTypeData: [
          {id: 0, 'value': 0, 'label': '医院职工'},
          {id: 1, 'value': 1, 'label': '公司职工'}
        ],
        positionTypeData: [
          {id: 0, 'value': 0, 'label': '项目经理'},
          {id: 1, 'value': 1, 'label': '主力工程师'},
          {id: 2, 'value': 2, 'label': '助理工程师'},
          {id: 3, 'value': 3, 'label': '支持人员'}
        ],
        userTypeValue: false,
        etUserInoForm: {
          workId: 0,
          userType: '',
          userCard: '',
          cName: '',
          orgName: '',
          positionName: '',
          telephone: '',
          email: ''
        },
        isActive: false,//项目范围
        isUserActive: false,//人员入场
        etUserRoles: { //项目组成员校验规则
          userType: [
            {required: true, message: '请选择用户属性'}
          ],
          userCard: [
            {required: true, message: '请输入用户工号'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
          ],
          cName: [
            {required: true, message: '请输入用户姓名'}
          ],
          orgName: [
            {required: true, message: '请输入用户所在部门'}
          ],
          positionName: [
            {required: true, message: '请输入用户的职务'}
          ],
          telephone: [
            {pattern: /^1[345789]\d{9}$/, message: '目前只支持中国大陆的手机号码'}
          ],
          email: [
            {pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/, message: '邮箱验证失败'}
          ]
        },
        deptRules: {
          typeName: [
            {required: true, message: '请输入科室类别'}
          ],
          deptName: [
            {required: true, message: '请输入科室类别'}
          ]
        },
        etLineUserForm: {
          workId: 0,
          userCode: '',
          cName: '',
          roleName: '',
          responseDept: '',
          responseSite: '',
          telephone: '',
          wechatNo: '',
          email: '',
          mobile: ''
        },
        rules: {
          userid: [
            {required: true, message: '请输入用户工号'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符'}
          ],
          yhmc: [
            {required: true, message: '请输入用户姓名'}
          ],
          clo1: [
            {required: true, message: '请输入用户所在部门'}
          ],
          clo2: [
            {required: true, message: '请输入用户当前角色'}
          ],
          mobile: [
            {pattern: /^1[345789]\d{9}$/, message: '目前只支持中国大陆的手机号码'}
          ],
          email: [
            {pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/, message: '邮箱验证失败'}
          ],
          product: [
            {required: true, message: '请输入产品名称'}
          ],
          model: [
            {required: true, message: '请输入模块名称'}
          ]
        },
        etOnlineUserRoles: { //上线支持人员校验规则
          userCode: [
            {required: true, message: '请输入用户工号'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
          ],
          cName: [
            {required: true, message: '请输入用户姓名'}
          ],
          responseDept: [
            {required: true, message: '请输入部门'}
          ],
          roleName: [
            {required: true, message: '请输入角色'}
          ],
          responseSite: [
            {required: true, message: '请输入站点'}
          ],
          wechatNo: [
            {required: true, message: '请输入微信号'}
          ],
          telephone: [
            {required: true, message: '请输入电话'},
            {pattern: /^1[345789]\d{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {
              pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
              message: '邮箱验证失败',
              trigger: 'blur'
            }
          ],
          lodging: [
            {required: true, message: '请输入住宿信息'},
          ]
        },
        taskList: [
          {
            prodectName: '上海市儿童医院-北京西路分院',
            model: '电子处方',
            detail: '挂号、检查、检验、治疗、住院',
            note: '注意事项、要求、备注说明信息'
          },
        ],
        implePath: [
          {
            milestone: '启动',
            mainStage: '环境搭建',
            mainStageType: '环境搭建对硬件及网络要求',
            mainWork: '列出硬件清单',
            detailWork: '列出PC打印机等清单',
            outputConent: '产出物',
            note: '仔细测量'
          }
        ],
        dialogFormVisible: false,
        form: {
          taskId: 0,
          product: '',
          productId: 0,
          model: '',
          modelId: 0,
          detail: '',
          note: ''
        },
        formLabelWidth: '120px',
        customerID: 0,
        onlineActive: false
      }
    },
    created() {
      this.$parent.setSelectDisable(true);
      this.$parent.setProjectInfo(); //刷新页面后下拉框无信息
      this.customerID = this.$parent.getCustomerId();
      this.initSourceData();//初始化接口数据
      this.$nextTick(function () {
        this.initCodeData();
        // this.getWorkerInfo();
        this.refreshPage();
        this.detail();
      })
    },
    methods: {
      //==============初始化方法区域===========================//
      tabSwitch: function (tab, event) {
        this.pageSize = 10;
        this.currentPage = 1;
        this.total = 100;
        this.activeName = tab.name;
        this.refreshPage();
      },
      //初始化字典信息
      initCodeData: function () {
        api.post(api.url.etCustomerDetail.initCodes, {'dictCode': 'areaCode'}).then((data) => {
          this.areaData = data.data;
          this.projectForm.locationLabel = this.getDictLabel(this.areaData, this.projectForm.location);
        });
        api.post(api.url.etCustomerDetail.initCodes, {'dictCode': 'hospitalLevel'}).then((data) => {
          this.hopitalData = data.data;
        });
      },
      //医院科室信息
      getDepartInfo: function () {
        var serialNo = this.$parent.getCustomerId(); //医院用户按照客户信息来存储
        var pageSize = this.pageSize;
        var currentPage = this.currentPage;
        var first = (currentPage - 1) * pageSize;
        api.post(api.url.deptInfo.initData, {'serialNo': serialNo, 'first': first, 'count': pageSize}).then((data) => {
          if (data.status == 'success') {
            this.deptInfo = data.rows;
            this.total = data.total;
          }
        });
      },
      //医院职工信息
      getWorkerInfo: function () {
        var ssgs = this.$parent.getCustomerId(); //医院用户按照客户信息来存储
        var pageSize = this.pageSize;
        var currentPage = this.currentPage;
        var first = (currentPage - 1) * pageSize;
        api.post(api.url.hospitalInfo.initData, {'ssgs': ssgs, 'first': first, 'count': pageSize}).then((data) => {
          if (data.status == 'success') {
            this.workerInfo = data.rows;
            this.total = data.total;
          }
        });
      },
      //合同产品清单信息
      getProductInfo: function () {
        var pmId = this.$parent.getProjectId();
        var pageSize = this.pageSize;
        var currentPage = this.currentPage;
        var first = (currentPage - 1) * pageSize;
        api.post(api.url.contract.initData, {'xmlcb': pmId, 'first': first, 'count': pageSize}).then((data) => {
          if (data.status == 'success') {
            this.taskList = data.rows;
            this.total = data.total;
          }
        });
      },
      //客户信息
      detail: function () {
        var user = this.$parent.getUser();
        api.post(api.url.etCustomerDetail.initData, {'id': this.$parent.getProjectId()}).then((data) => {
          this.projectForm.id = data.result.id;
          this.projectForm.custom = data.result.custName;
          this.projectForm.pmCode = data.result.pmCode;
          this.projectForm.pmName = data.result.pmName;
          this.projectForm.junior = data.result.specialType;
          this.projectForm.bed = data.result.bedNum;
          this.projectForm.location = data.result.areaCode;
          this.projectForm.feature = data.result.characteristic;
          this.projectForm.hopital = data.result.hospitalLevel;
          this.projectForm.outpatient = data.result.outpatientNum;
          this.projectForm.locationLabel = this.getDictLabel(this.areaData, data.result.areaCode);
          this.projectForm.hopitalLabel = this.getDictLabel(this.hopitalData, data.result.hospitalLevel);
          if (this.projectForm.feature == '' || this.projectForm.junior == '') {
            this.formShrink = false;
            this.formOpen = true;
          } else {
            this.formShrink = true;
            this.formOpen = false;
          }
        });
      },
      //接口信息
      getInerfaceInfo: function () {
        var pmId = this.$parent.getProjectId();
        var pageSize = this.pageSize;
        var currentPage = this.currentPage;
        var first = (currentPage - 1) * pageSize;
        api.post(api.url.thirdInterface.getData, {'pmId': pmId, 'first': first, 'count': pageSize}).then((data) => {
          if (data.status == 'success') {
            console.info(data);
            this.interfaceInfoData = data.rows;
            this.total = data.total;
            this.plList = data.plList;
            if (data.process.isPmScope == null || data.process.isPmScope != 1) {
              this.isActive = false;
            } else if (data.process.isPmScope == 1) {
              this.isActive = true;
            }
          }
        });
      },
      //上线支持人员
      getEtOnlineUserInfo: function () {
        var pageSize = this.pageSize;
        var currentPage = this.currentPage;
        var first = (currentPage - 1) * pageSize;
        var pmId = this.$parent.getProjectId();
        api.post(api.url.etOnlineUserInfo.initData, {'pmId': pmId, 'first': first, 'count': pageSize}).then((data) => {
          //console.log(data);
          this.etOnlineInfo = data.rows;
          this.total = data.total;
        });
      },
      //项目组成员信息
      getEtUserInfo: function () {
        var pageSize = this.pageSize;
        var currentPage = this.currentPage;
        var first = (currentPage - 1) * pageSize;
        var pmId = this.$parent.getProjectId();
        api.post(api.url.etUserInfo.initData, {'pmId': pmId, 'first': first, 'count': pageSize}).then((data) => {
          this.etUserInfo = data.rows;
          this.total = data.total;
          if (data.process.isPmEntrance == null || data.process.isPmEntrance != 1) {
            this.isUserActive = false;
          } else if (data.process.isPmEntrance == 1) {
            this.isUserActive = true;
          }
        });
      },
      //实施路径信息
      implementationPathInfo: function () {
        var pageSize = this.pageSize;
        var currentPage = this.currentPage;
        var first = (currentPage - 1) * pageSize;
        var pmId = this.$parent.getProjectId();
        api.post(api.url.implementationPath.initData, {'first': first, 'count': pageSize}).then((data) => {
          this.implePath = data.rows;
          this.total = data.total;
        });
      },
      //============================客户项目信息=====================================//
      saveData: function () {
        var json = {
          id: this.projectForm.id,
          pmCode: this.projectForm.pmCode,
          pmName: this.projectForm.pmName,
          custName: this.projectForm.custom,
          specialType: this.projectForm.junior,
          bedNum: this.projectForm.bed,
          areaCode: this.projectForm.location,
          hospitalLevel: this.projectForm.hopital,
          outpatientNum: this.projectForm.outpatient,
          characteristic: this.projectForm.feature,
          operator: this.$parent.getUserId()
        };
        api.post(api.url.etCustomerDetail.updateCustomer, json).then((data) => {
          //console.log(data.isSucceed);
        });
        this.projectForm.locationLabel = this.getDictLabel(this.areaData, this.projectForm.location);
        this.projectForm.hopitalLabel = this.getDictLabel(this.hopitalData, this.projectForm.hopital);
        this.formShrink = true;
        this.formOpen = false;
        /*console.log(this.projectForm);*/
      },
      closeMethod: function () {
        this.formShrink = true;
        this.formOpen = false;
      },
//============================医院科室信息=====================================//
      //医院科室信息 - 新增
      openDepartWindow: function () {
        if (this.$refs['deptForm'] !== undefined) {
          this.$refs['deptForm'].resetFields();
        }
        this.title = "新增";
        this.deptId = 0;
        this.deptForm.typeName = '';
        this.deptForm.deptName = '';
        this.deptInforWindow = true;
      },
      //新增或者修改
      deptAddorModify: function (formName) {
        var json = {
          id: this.deptId,
          typeName: this.deptForm.typeName,
          deptName: this.deptForm.deptName,
          serialNo: this.$parent.getCustomerId()
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.post(api.url.deptInfo.addOrModify, json).then((data) => {
              if (data.status == 'repeat') {
                this.$message({type: 'error', message: '科室重复!'});
              }
              this.getDepartInfo();
            });
            this.deptInforWindow = false;
          } else {
            return false;
          }
        });
      },
      openDeptDetails: function (data) { //查看详细数据
        if (this.$refs['deptForm'] !== undefined) {
          this.$refs['deptForm'].resetFields();
        }
        let customerId = this.customerID;
        this.deptId = data.id;
        this.deptForm.typeName = data.typeName;
        this.deptForm.deptName = data.deptName;
        this.title = "修改";
        this.deptInforWindow = true;
      },


      deleteDeptRow: function (d) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.deptInfo.deleteDept, {'id': d}).then((data) => {
            if (data.status == "success") {
              this.$message({type: 'success', message: '删除成功!'});
              this.getDepartInfo();
            }
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //打开上传医院职工信息
      openDeptUploadWindow: function () {
        this.fileList = [];
        this.uploadWindow = true;
        this.action = api.url.deptInfo.uploadFile + '?serialNo=' + this.$parent.getCustomerId();
      },
      //打开daochu医院职工信息
      downDepartloadExcel: function () {
        window.open(api.url.deptInfo.exportExcel + '?serialNo=' + this.$parent.getCustomerId());
      },

      //============================医院职工信息=====================================//
      openDetails: function (data) { //查看详细数据
        if (this.$refs['workForm'] !== undefined) {
          this.$refs['workForm'].resetFields();
        }
        let customerId = this.customerID;
        this.workId = data.id;
        this.workForm.userid = data.userid.substring(customerId.length);
        this.workForm.yhmc = data.yhmc;
        this.workForm.clo1 = data.clo1;
        this.workForm.clo2 = data.clo2;
        this.workForm.mobile = data.mobile;
        this.workForm.email = data.email;
        this.title = "修改";
        this.workderInforWindow = true;
      },
      openWorkinfoWindow: function () {
        if (this.$refs['workForm'] !== undefined) {
          this.$refs['workForm'].resetFields();
        }
        this.workId = 0;
        this.workForm.userid = '';
        this.workForm.yhmc = '';
        this.workForm.clo1 = '';
        this.workForm.clo2 = '';
        this.workForm.mobile = '';
        this.workForm.email = '';
        this.title = "新增";
        this.workderInforWindow = true;
      },
      //打开上传医院职工信息
      openUploadWindow: function () {
        this.fileList = [];
        this.uploadWindow = true;
        this.action = api.url.hospitalInfo.uploadFile + '?ssgs=' + this.$parent.getCustomerId();
      },
      //增加或者修改医院职工信息
      addOrModify: function (formName) {
        let customerId = this.customerID;
        var json = {
          id: this.workId,
          userid: this.customerID + '' + this.workForm.userid,
          yhmc: this.workForm.yhmc,
          clo1: this.workForm.clo1,
          clo2: this.workForm.clo2,
          mobile: this.workForm.mobile,
          email: this.workForm.email,
          ssgs: this.$parent.getCustomerId()
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.post(api.url.hospitalInfo.addOrModify, json).then((data) => {
              if (data.status = 'success') {
                this.getWorkerInfo();
              }
            });
            this.workderInforWindow = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      deleteRow: function (d) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.hospitalInfo.deleteUser, {'id': d}).then((data) => {
            console.log(data);
            console.log(data.status == api.successStatus);
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
      downloadExcel: function () {
        window.open(api.url.hospitalInfo.exportExcel + '?ssgs=' + this.$parent.getCustomerId());
      },
      //============================合同任务单信息=====================================//
      showCol: function (data) {
        if (data.creator != 0) {
          return true;
        } else {
          return false;
        }
      },
      querySearchAsync: function (queryString, cb) {
        var list = [{}];
        api.post(api.url.contract.initProduct, {'name': queryString}).then((data) => {
          if (data.status == 'success') {
            for (let i of data.data) {
              i.value = i.name + '[' + i.cptxName + ']';  //将name  作为value
            }
            list = data.data;
          }
          cb(list);
        });
      },
      queryModelAsync: function (queryString, cb) {
        var list = [{}];
        api.post(api.url.contract.initProduct, {'fid': this.form.productId, 'name': queryString}).then((data) => {
          if (data.status == 'success') {
            for (let i of data.data) {
              i.value = i.name + '[' + i.cptxName + ']';  //将name  作为value
            }
            list = data.data;
          }
          cb(list);
        });
      },
      handleSelect: function (item) {
        console.log(item);
        this.form.product = item.name;
        this.form.productId = item.id;
      },
      handleModel: function (item) {
        console.log(item);
        this.form.model = item.name;
        this.form.modelId = item.id;
      },
      addOrModifyProduct: function (formName) {
        var projectJson = {
          id: this.form.taskId,
          cId: this.$parent.getContractId(),
          pmId: this.$parent.getProjectId(),
          zxtmc: this.form.product,
          cpzxt: this.form.productId,
          cpmc: this.form.model,
          cpxx: this.form.modelId,
          mx: this.form.detail,
          bz: this.form.note,
          operator: this.$parent.getUserId()
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.post(api.url.contract.addOrModifyProduct, projectJson).then((data) => {
              if (data.status = 'success') {
                this.getProductInfo();
              }
            });
            this.dialogFormVisible = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      editTask: function (data) {
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields();
        }
        this.form.taskId = data.id;
        this.form.product = data.zxtmc;
        this.form.productId = data.cpzxt;
        this.form.model = data.cpmc;
        this.form.modelId = data.cpxx;
        this.form.detail = data.mx;
        this.form.note = data.bz;
        this.dialogFormVisible = true;
      },
      deleteTask: function (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.contract.deleteProduct, {'id': id}).then((data) => {
            if (data.status == "success") {
              this.$message({type: 'success', message: '删除成功!'});
              this.getProductInfo();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      addTask: function (d) {
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields();
        }
        this.form.taskId = 0;
        this.form.product = '';
        this.form.productId = 0;
        this.form.model = '';
        this.form.modelId = 0;
        this.form.detail = '';
        this.form.note = '';
        this.dialogFormVisible = true;
      },
      //合同产品任务单
      downloadTask: function () {
        window.open(api.url.contract.exportExcel + '?pmId=' + this.$parent.getProjectId());
      },
      confirmContractTask: function () {
        let pmId = this.$parent.getProjectId();
        let confirmText = '';
        let succMessage = '';
        let calMessage = '';
        let isPmScope = 0;
        let isEtPlan = 0;
        if (!this.isActive) {
          confirmText = '此操作将确认项目范围和实施计划制定, 是否继续?';
          succMessage = '确认成功';
          calMessage = '已取消确认';
          isPmScope = 1;
          isEtPlan = 1;
        } else {
          confirmText = '此操作将取消确认项目范围和实施计划制定, 是否继续?';
          succMessage = '取消成功';
          calMessage = '已撤销取消';
          isPmScope = 0;
          isEtPlan = 0;
        }
        this.$confirm(confirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.contract.confirmTask, {
            pmId: pmId,
            operator: this.$parent.getUserId(),
            isPmScope: isPmScope,
            isEtPlan: isEtPlan,
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
      //============================合同接口信息=====================================//
      //是否显示操作
      showOperation: function (data) {
        if (data.creator != 0) {
          return true;
        } else {
          return false;
        }
      },
      //初始化接口数据源
      initSourceData() {
        api.post(api.url.thirdInterface.initSourceData, {
          pmId: this.$parent.getProjectId(),
          operator: this.$parent.getUserId(),
        }).then((data) => {
          console.log(data.msg);
        });
      },
      //打开编辑弹出框
      openInterfaceInfoWindow: function (data) {
        if (this.$refs['interfaceInfoForm'] !== undefined) {
          this.$refs['interfaceInfoForm'].resetFields();
        }
        if (data == 0) {
          this.interfaceInfoForm.productName = "";
          this.interfaceInfoForm.interfaceName = "";
          this.interfaceInfoForm.moduleDetail = "";
          this.interfaceInfoForm.remark = "";
          this.interfaceInfoId = 0;
        } else {
          this.interfaceInfoForm.productName = data.productName;
          this.interfaceInfoForm.interfaceName = data.interfaceName;
          this.interfaceInfoForm.moduleDetail = data.moduleDetail;
          this.interfaceInfoForm.remark = data.remark;
          this.interfaceInfoId = data.id;
        }
        this.interfaceInfoWindow = true;
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
              this.getInerfaceInfo();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //选择产品分类
      doSelect(plId) {
        this.interfaceInfoForm.plId = plId;
        this.plId = plId;
      },
      addOrModifyInterfaceInfo: function (formName) {
        this.interfaceInfoWindow = true;
        var json = {
          id: this.interfaceInfoId,
          pmId: this.$parent.getProjectId(),
          productName: this.interfaceInfoForm.productName,
          interfaceName: this.interfaceInfoForm.interfaceName,
          moduleDetail: this.interfaceInfoForm.moduleDetail,
          remark: this.interfaceInfoForm.remark,
          operator: this.$parent.getUserId()
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.post(api.url.thirdInterface.addOrModify, json).then((data) => {
              if (data.status = 'success') {
                this.getInerfaceInfo();
              }
            });
            this.interfaceInfoWindow = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      downloadInterfaceInfo: function () {
        var pmId = this.$parent.getProjectId();
        window.open(api.url.thirdInterface.export + "?pmId=" + pmId);
      },
      //============================实施路径=====================================//
      downloadimplPathInfo: function () {
        window.open(api.url.implementationPath.exportExcel);
      },
      //============================项目组成员=====================================//
      openEtUsetInfoDetails: function (data) { //查看详细数据
        if (this.$refs['etUserInoForm'] !== undefined) {
          this.$refs['etUserInoForm'].resetFields();
        }
        this.etUserInoForm.workId = data.id;
        this.etUserInoForm.userCard = data.userCard;
        this.etUserInoForm.cName = data.cName;
        this.etUserInoForm.orgName = data.orgName;
        this.etUserInoForm.userType = data.userType;
        if (data.map.positionName !== data.positionName) {
          this.etUserInoForm.positionName = parseInt(data.positionName);
        } else {
          this.etUserInoForm.positionName = data.positionName;
        }

        this.etUserInoForm.email = data.email;
        this.etUserInoForm.telephone = data.telephone;
        this.title = "修改";
        this.etUserInoFormWindow = true;
      },
      openEtUserInfoWindow: function () {
        if (this.$refs['etUserInoForm'] !== undefined) {
          this.$refs['etUserInoForm'].resetFields();
        }
        this.etUserInoForm.workId = 0;
        this.etUserInoForm.userType = '';
        this.etUserInoForm.userCard = '';
        this.etUserInoForm.cName = '';
        this.etUserInoForm.orgName = '';
        this.etUserInoForm.positionName = '';
        this.etUserInoForm.email = '';
        this.etUserInoForm.telephone = '';
        this.etUserInoFormWindow = true;
      },
      userTypeChange: function (data) {
        if (data == '0') {
          this.userTypeValue = true;
        } else {
          this.userTypeValue = false;
        }

      },
      openUploadEtUserInfoWindow: function () {
        this.fileList = [];
        this.uploadWindow = true;
        this.action = api.url.etUserInfo.uploadFile + '?pmId=' + this.$parent.getProjectId();
      },
      userAddOrModify: function (formName) { //增加或者修改数据
        var json = {
          id: this.etUserInoForm.workId,
          userType: this.etUserInoForm.userType,
          userCard: this.etUserInoForm.userCard,
          cName: this.etUserInoForm.cName,
          orgName: this.etUserInoForm.orgName,
          positionName: this.etUserInoForm.positionName,
          telephone: this.etUserInoForm.telephone,
          email: this.etUserInoForm.email,
          pmId: this.$parent.getProjectId(),
          cId: this.$parent.getContractId(),
          serialNo: this.$parent.getCustomerId()
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // api.post(api.url.etUserInfo.addOrModify, json).then((data) => {
            //   if (data.status = 'success') {
            //     this.getEtUserInfo();
            //   }
            // });
            this.$confirm('是否确认操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              api.post(api.url.etUserInfo.addOrModify, json).then((data) => {
                if (data.status == "success") {
                  this.$message({type: 'success', message: '操作成功!'});
                  this.getEtUserInfo();
                } else {
                  this.$message({type: 'error', message: '工号重复，操作失败!'});
                }
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });
            this.etUserInoFormWindow = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      downloadExcelEtUserInfo: function () {
        window.open(api.url.etUserInfo.exportExcel + '?pmId=' + this.$parent.getProjectId());
      },
      //删除项目组成员
      deleteEtUsetInfoDetails: function (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.etUserInfo.deleteUser, {'id': id}).then((data) => {
            if (data.status == "success") {
              this.$message({type: 'success', message: '删除成功!'});
              this.refreshPage();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },    //确认项目组完成
      doUserConfirm: function () {
        let pmId = this.$parent.getProjectId();
        let confirmText = '';
        let succMessage = '';
        let calMessage = '';
        let isPmEntrance = 0;
        if (!this.isUserActive) {
          confirmText = '此操作将确认入场准备, 是否继续?';
          succMessage = '确认成功';
          calMessage = '已取消确认';
          isPmEntrance = 1;
        } else {
          confirmText = '此操作将取消确认入场准备, 是否继续?';
          succMessage = '取消成功';
          calMessage = '已撤销取消';
          isPmEntrance = 0;
        }
        this.$confirm(confirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.etUserInfo.confirm, {
            pmId: pmId,
            operator: this.$parent.getUserId(),
            isPmEntrance: isPmEntrance,
          }).then((data) => {
            if (data.status == "success") {
              this.$message({type: 'success', message: succMessage});
              if (!this.isUserActive) {
                this.isUserActive = true;
              } else {
                this.isUserActive = false;
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
      //============================上线支持人员=====================================//
      checkOnlineUserWork() {
        let json = {
          pmId: this.$parent.getProjectId()
        };
        api.post(api.url.etOnlineUserInfo.checkWork, json).then((data) => {
          if (data.status === 'success') {
            this.onlineActive = data.workStatus;
          }
        });
      },
      openLineUserDetails: function (data) { //查看详细数据
        if (this.$refs['etOnlineUserForm'] !== undefined) {
          this.$refs['etOnlineUserForm'].resetFields();
        }
        this.etOnlineUserForm.workId = data.id;
        this.etOnlineUserForm.userCode = data.userCode;
        this.etOnlineUserForm.cName = data.cName;
        this.etOnlineUserForm.roleName = data.roleName;
        this.etOnlineUserForm.responseDept = data.responseDept;
        this.etOnlineUserForm.responseSite = data.responseSite;
        this.etOnlineUserForm.telephone = data.telephone;
        this.etOnlineUserForm.wechatNo = data.wechatNo;
        this.etOnlineUserForm.email = data.email;
        this.etOnlineUserForm.mobile = data.mobile;
        this.etOnlineUserForm.lodging = data.lodging;
        this.title = "修改";
        this.etOnlineUserWindow = true;
      },
      openEtOnlineUserWindow: function () {
        if (this.$refs['etOnlineUserForm'] !== undefined) {
          this.$refs['etOnlineUserForm'].resetFields();
        }
        this.etOnlineUserForm.workId = 0;
        this.etOnlineUserForm.userCode = '';
        this.etOnlineUserForm.cName = '';
        this.etOnlineUserForm.roleName = '';
        this.etOnlineUserForm.responseDept = '';
        this.etOnlineUserForm.responseSite = '';
        this.etOnlineUserForm.telephone = '';
        this.etOnlineUserForm.wechatNo = '';
        this.etOnlineUserForm.lodging = '';
        this.etOnlineUserForm.email = '';
        this.etOnlineUserWindow = true;
      },
      openLineUploadWindow: function () {
        this.fileList = [];
        this.uploadWindow = true;
        this.action = api.url.etOnlineUserInfo.uploadFile + '?pmId=' + this.$parent.getProjectId() + '&operator=' + this.$parent.getUserId();
      },
      onlineAddOrModify: function (formName) { //增加或者修改数据
        var json = {
          id: this.etOnlineUserForm.workId,
          userCode: this.etOnlineUserForm.userCode,
          cName: this.etOnlineUserForm.cName,
          roleName: this.etOnlineUserForm.roleName,
          responseDept: this.etOnlineUserForm.responseDept,
          responseSite: this.etOnlineUserForm.responseSite,
          telephone: this.etOnlineUserForm.telephone,
          wechatNo: this.etOnlineUserForm.wechatNo,
          lodging: this.etOnlineUserForm.lodging,
          email: this.etOnlineUserForm.email,
          pmId: this.$parent.getProjectId(),
          cId: this.$parent.getContractId(),
          operator: this.$parent.getUserId()
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.post(api.url.etOnlineUserInfo.addOrModify, json).then((data) => {
              if (data.status = 'success') {
                this.refreshPage();
              }
            });
            this.etOnlineUserWindow = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      deleteEtOnlineUsetInfoDetails: function (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post(api.url.etOnlineUserInfo.deleteUser, {'id': id}).then((data) => {
            if (data.status == "success") {
              this.$message({type: 'success', message: '删除成功!'});
              this.refreshPage();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      downloadExcelLineUser: function () {
        window.open(api.url.etOnlineUserInfo.exportExcel + '?pmId=' + this.$parent.getProjectId());
      },
      //上线支持人员工作确认完成
      confirmOnLineUser: function () {
        var pmId = this.$parent.getProjectId();
        var operator = this.$parent.getUserId();
        this.$confirm('此操作是用来确定上线支持人员工作完成，是否确定完成?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          api.post(api.url.etOnlineUserInfo.confirmUser, {'pmId': pmId, 'operator': operator}).then((data) => {
            if (data.status == "success") {
              this.$message({type: 'success', message: '确认完成!'});
              this.onlineActive = true;
              this.getProductInfo();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消确认'
          });
        });
      },
      //============================公共方法=====================================//
      //上传成功
      uploadSeccess: function (response) {
        if (response.status == 'success') {
          this.fileList = [];
          this.uploadWindow = false;
          this.refreshPage();
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
        this.refreshPage();

      },
      //currentPage改变事件
      handleCurrentChange(val) {
        this.currentPage = val;
        this.refreshPage();
      },
      //页面刷新
      refreshPage: function () {
        if (this.activeName == 'zero') {
          this.getDepartInfo();
        } else if (this.activeName == 'first') {
          this.getWorkerInfo();
        } else if (this.activeName == 'second') {
          this.getProductInfo();
        } else if (this.activeName == 'third') {
          this.getInerfaceInfo();
        } else if (this.activeName == 'fifth') {
          this.implementationPathInfo();
        } else if (this.activeName == 'sixth') {
          this.getEtUserInfo();
        } else if (this.activeName == 'seventh') {
          this.checkOnlineUserWork();
          this.getEtOnlineUserInfo();
        }
      },
      //字典值获取
      getDictLabel: function (data, key) {
        for (var i = 0; i < data.length; i++) {
          if (data[i]['dictV'] == key) {
            return data[i]['dictLabel'];
          }
        }
      }
    }
  }

</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
  .information {
    /*height 100%*/
  }

  .project-result {
    padding 25px 10px
  }

  .project-result dl > * {
    float left
    margin-right 15px
  }

  .project-result dt {
    color #282828
    font-size 16px
  }

  .project-result dt > span {
    color #999
  }

  .project-result dd {
    line-height 16px
    color #6583ce
    font-size 12px
  }

  .project-result dd.open {
    cursor pointer
  }

  .project-result i {
    float: left
  }

  .project-form {
    margin-top 22px
  }

  .project-form .el-select {
    width 100%
  }

  .project-table {
    padding 0px 14px
  }
</style>

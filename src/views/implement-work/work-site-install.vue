<!--
* @author: jinxl
* @date: 2018/4/1
* @module:工作站点安装
-->
<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
  <div class="site-install">
    <div class="w-table">
      <div class="w-table-btn">
        <span :class="{active:isActive}" @click="siteEnd"><i class="iconfont icon-conf-complete"></i>确认完成</span>
        <span @click="openAddWindows" v-show="!isActive"><i class="iconfont icon-new-add"></i>新增</span>
        <!--<span @click="openUploadWindow"><i class="iconfont icon-to-lead"></i>导入</span> -->
        <span @click="downloadExcel"><i class="iconfont icon-export"></i>导出</span>
        <span @click="chart=true;"><i class="iconfont icon-job-weight"></i>工作比重</span>
      </div>
      <div class="w-table-content">
        <el-table
          :data="installTableData"
          style="width: 100%">

          <el-table-column
            prop="deptName"
            label="科室名称">
          </el-table-column>
          <el-table-column
            align="center"
            label="所需软件">
            <template slot-scope="scope">
              <el-select v-model="scope.row.pppId"
                         size="mini"
                         multiple
                         collapse-tags
                         placeholder="请选择"
                         @change="doSoftSelect(scope.row.pppId,scope.row.id)">

              <el-option
                  v-for="item in selectData.needSoftware"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="所需硬件">
            <template slot-scope="scope">
              <el-select v-model="scope.row.hhhId"
                         size="mini"
                         multiple
                         collapse-tags
                         placeholder="请选择"
                         @change="doHardWareSelect(scope.row.hhhId,scope.row.id)">
                <el-option
                  v-for="item in selectData.needHardware"
                  :key="item.id"
                  :label="item.hwName"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <!--
                   <el-table-column
                     align="center"
                     label="所需硬件">
                     <template slot-scope="scope">
                       <el-popover
                         ref="needpoper"
                         placement="bottom"
                         trigger="hover">
                         <el-form :model="scope.row.hdId"
                                  ref="scope.row.hdId"
                                  label-width="80px"
                                  class="page-form-check">
                           <el-form-item label="打印机">
                             <el-checkbox-group v-model="scope.row.needHardware.printer">
                               <el-checkbox label="激光" name="type"></el-checkbox>
                               <el-checkbox label="针式" name="type"></el-checkbox>
                               <el-checkbox label="热敏" name="type"></el-checkbox>
                               <el-checkbox label="条码" name="type"></el-checkbox>
                               <el-checkbox label="平推" name="type"></el-checkbox>
                             </el-checkbox-group>
                           </el-form-item>
                           <el-form-item label="台式机">
                             <el-checkbox-group v-model="scope.row.needHardware.desktop">
                               <el-checkbox label="台式机" name="type"></el-checkbox>
                             </el-checkbox-group>
                           </el-form-item>
                           <el-form-item label="多屏">
                             <el-checkbox-group v-model="scope.row.needHardware.moreScreen">
                               <el-checkbox label="多屏" name="type"></el-checkbox>
                               <el-checkbox label="分屏" name="type"></el-checkbox>
                             </el-checkbox-group>
                           </el-form-item>
                           <el-form-item label="报价器">
                             <el-checkbox-group v-model="scope.row.needHardware.moreScreen">
                               <el-checkbox label="报价器" name="type"></el-checkbox>
                               <el-checkbox label="语言报价器" name="type"></el-checkbox>
                             </el-checkbox-group>
                           </el-form-item>
                           <el-form-item label="读卡器">
                             <el-checkbox-group v-model="scope.row.needHardware.cardReader">
                               <el-checkbox label="医保" name="type"></el-checkbox>
                               <el-checkbox label="磁卡" name="type"></el-checkbox>
                               <el-checkbox label="芯片" name="type"></el-checkbox>
                               <el-checkbox label="农保" name="type"></el-checkbox>
                               <el-checkbox label="IC卡" name="type"></el-checkbox>
                             </el-checkbox-group>
                           </el-form-item>
                         </el-form>
                       </el-popover>
                       <span class="need-hard-slecet" v-popover:needpoper>{{  scope.row.needHardware | connetArray}}</span>
                     </template>
                   </el-table-column> -->
          <el-table-column
            label="是否本期范围">
            <template slot-scope="scope">
              <el-select size="mini"
                         v-model="scope.row.noScopeCode"
                         placeholder="请选择"
                         @change="doRangeSelect(scope.row.noScopeCode,scope.row.id)">
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
                     label="分配给">
                     <template slot-scope="scope">
                       <el-select v-model="scope.row.map.puserName"
                                  size="mini"
                                  placeholder="请选择"
                                  @change="doUserSelect(scope.row.map.puserName,scope.row.id)">
                         <el-option
                           v-for="item in selectData.assignedTo"
                           :key="item.id"
                           :label="item.cName"
                           :value="item.id">
                         </el-option>
                       </el-select>
                     </template>
                   </el-table-column>
                   <el-table-column
                     align="center"
                     label="站点数">
                     <template slot-scope="scope">
                       <el-select v-model="scope.row.num"
                                  size="mini"
                                  placeholder="请选择"
                                  @change="doSiteSelect(scope.row.num,scope.row.id)">
                         <el-option
                           v-for="item in selectData.siteNumber"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                         </el-option>
                       </el-select>
                     </template>
                   </el-table-column>
                   <el-table-column
                     align="center"
                     label="状态">
                     <template slot-scope="scope">
                       <span :class="scope.row.stateClass">{{ scope.row.map.siteInfo}}</span>
                     </template>
                   </el-table-column>
                   <el-table-column
                     label="操作">
                     <template slot-scope="scope">
                       <div class="operate">
                         <i @click="addSiteInstallDetail(scope.row.id)" class="iconfont icon-edit"></i>
                         <i @click="removeSite(scope.row.id)" class="iconfont icon-delete"></i>
                       </div>
                     </template>
                   </el-table-column>
        </el-table>
        <!-- 分页组件 -->
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
    </div>
    <!--实施人员工作比重-->
    <el-dialog title="实施人员工作比重"
               width="50%"
               @open="eCharGo"
               :visible.sync="chart">
      <div id="main"></div>
    </el-dialog>

    <transition
      leaveActiveClass="animated fadeOutRight"
      enterActiveClass="animated bounceInRight">
      <div class="new-page" v-show="newPage">
        <div class="new-page_header">
          <span class="new-page_title">{{deptName}}</span>
          <button @click="newPage = false;"
                  type="button"
                  class="el-dialog__headerbtn">
            <i class="el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="new-page_body">

          <!--
          <el-form ref="form"
                   :model="pageForm"
                   label-width="80px"
                   class="page-form-check">
            <el-form-item label="所需软件">
              <el-checkbox-group v-model="pageForm.needSoftware">
                <el-checkbox label="HIS前台" name="type"></el-checkbox>
                <el-checkbox label="THS前台" name="type"></el-checkbox>
                <el-checkbox label="HIsS前台" name="type"></el-checkbox>
                <el-checkbox label="IS前台" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="所需硬件">
              <el-checkbox-group v-model="pageForm.needHardware">
                <el-checkbox label="台式机" name="type"></el-checkbox>
                <el-checkbox label="发票打印机" name="type"></el-checkbox>
                <el-checkbox label="报价机" name="type"></el-checkbox>
                <el-checkbox label="多种刷卡机" name="type"></el-checkbox>
                <el-checkbox label="多屏" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          -->

          <div class="line"></div>
          <div>
            <span class="icon-button"  @click="addSiteDetail()"><i class="iconfont icon-new-add"></i>新增站点</span>
          </div>


          <!--站点1-->
          <el-form
          label-width="80px"
          size="medium">
        <div v-for="item in siteDetailData">
          <div class="add-site">
            <div class="add-site_title">
              <span>站点</span><i class="el-icon-delete" @click="deteleSite(item.id)"></i>
            </div>
            <div class="add-site_body">
              <!--<el-form ref="pageForm"
                       :model="pageForm"
                       label-width="80px"
                       size="medium">-->
                <el-row :gutter="40">
                  <el-col :md="12" :lg="8">
                    <el-form-item label="站点名称">
                      <el-input v-model="item.siteName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="12" :lg="8">
                    <el-form-item label="IP地址">
                      <el-input v-model="item.ip"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="12" :lg="8">
                    <el-form-item label="楼宇">
                      <el-input v-model="item.building"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="12" :lg="8">
                    <el-form-item label="楼层">
                      <el-input v-model="item.floorNum" type="number"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="12" :lg="8">
                    <el-form-item label="PC机型号">
                      <el-input v-model="item.pcModel"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="12" :lg="8">


                    <el-form-item label="安装情况">
                      <el-radio-group v-model="item.install">
                        <el-radio :label="1">已安装</el-radio>
                        <el-radio :label="0">未安装</el-radio>
                      </el-radio-group>

                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :md="24" :lg="24">
                    <el-form-item label="上传照片">
                      <el-upload
                        :action="UploadUrl(item.id)"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemoves"
                        :fileList="imgPathsUrl(item.imgPath,item.id)">
                        <i class="el-icon-plus"></i>
                      </el-upload>
                      <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                      </el-dialog>
                    </el-form-item>
                  </el-col>
                </el-row>
              <!--</el-form>-->
            </div>
          </div>
          </div>
         </el-form>
          <!--操作按钮-->
          <div class="add-site_btn">
            <el-button size="medium" @click="newPage = false;">取消</el-button>
            <el-button type="primary" @click="saveSiteDetail('siteDetailData')" size="medium">保存</el-button>
          </div>
        </div>
      </div>
    </transition>
    <!--新增-->
    <el-dialog title="新增"
               width="50%"
               @open="showEchart"
               :visible.sync="newAdd">
      <el-form :model="formData" label-width="80px" size="medium">
        <el-row>
          <el-col :md="7" :lg="7">
            <el-form-item label="科室分类">
                <el-select v-model="formData.deptType" filterable  @change="deptType(formData.deptType)" placeholder="请选择">
                  <el-option
                    v-for="item in selectDeptType"
                    :key="item.deptType"
                    :label="item.typeName"
                    :value="item.deptType">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="7" :lg="7">
            <el-form-item label="科室名称">
              <el-select v-model="formData.departName" filterable placeholder="请选择">
                <el-option
                  v-for="item in selectDept"
                  :key="item.deptCode"
                  :label="item.deptName"
                  :value="item.deptCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="10" :lg="10">
            <el-form-item label="使用系统">
              <el-select v-model="formData.userSystem" placeholder="请选择">
                <el-option
                  v-for="item in selectFormData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="newAdd = false">取 消</el-button>
      <el-button size="small" type="primary" @click="saveDeptData">保 存</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<!--JavaScript-->
<script>
  import api from  '../../../api/api'
  import echarts from 'echarts'
  export default {
    data(){
      return {
        installTableData:[
          {
            deptName:'挂号处',
          needSoftware:'选项2',
          needHardware:{
            printer:['激光'],
            desktop:['台式机'],
            moreScreen:[],
            ticker:[],
            cardReader:[]
          },
            map:{
              puserName:'',
              siteInfo:''
            },
          currentScope:'',
          assignedTo:'',
          siteNumber:6,
          stateTxt:'已安装',
          stateClass:'installed'
        }
        ],
        isActive: false,
        dataType:0,
        deptName:'',
        ranges: [{//下拉选项
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

        selectData:{
          needSoftware:[],
          currentScope:[
            {
              value: '选项1',
              label: '是'
            }, {
              value: '选项2',
              label: '否-本期不实施'
            }
          ],
          assignedTo:[
            {
              value: '选项1',
              label: '三毛'
            }, {
              value: '选项2',
              label: '五毛'
            }
          ],
          siteNumber:[
            {
              value: '1',
              label: '1'
            }, {value: '2', label: '2'},{value: '3', label: '3'},{value: '4', label: '4'},{value: '5', label: '5'}
            ,{value: '6', label: '6'},{value: '7', label: '7'},{value: '8', label: '8'},{value: '9', label: '9'}
            ,{value: '10', label: '10'}
          ]
        },
        chart:false,
        newAdd:false,
        newPage:false,
        formData:{},
        action: api.url.hospitalInfo.uploadFile + '?ssgs=' + this.$parent.getContractId(),
        fileList: [],
        uploadWindow: false,
        selectDeptType:[],//分类
        selectDept:[],//部门
        selectFormData:[
          {
            deptName:'挂号处',
            needSoftware:'选项2',
            needHardware:{
              printer:['激光'],
              desktop:['台式机'],
              moreScreen:[],
              ticker:[],
              cardReader:[]
            },
            currentScope:'',
            assignedTo:'',
            siteNumber:6,
            stateTxt:'已安装',
            stateClass:'installed'
          }
        ],
        fileId:0,
        fileName:'',
        siteDetailData:[],
        pageSize: 10,
        total: 100,
        currentPage: 1,
        imgPaths:[
          {name: 'bootstrap.docx',
            url: 'http://47.97.170.21:8081/shareFolder/simulate/simulate_1523410080077/Bootstrap.docx'}
        ],

        pageForm:{
          //needSoftware:[],
          //needHardware:[],
          siteName:'',
          ipAddress:'',
          building:'',
          floor:'',
          pc:'',
          install:'1'
        },

        pageFormList:[{
          siteName:'',
          ipAddress:'',
          building:'',
          floor:'',
          pc:'',
          install:''
        }],
        dialogImageUrl: '',
        dialogVisible: false,
        rowId:0,
        array:[],
        arrayNum:[]
      }
    },
    created() {
      this.$parent.setSelectDisable(true);
      this.$parent.setProjectInfo(); //刷新页面后下拉框无信息
      this.$nextTick(function () {
        this.getStartData();
      })
    },
    methods:{
      imgPathsUrl:function (imgPath,id){

        if(imgPath != ''){
          let imgData = imgPath.split(';');
          let myArray=new Array();
          if(imgData.length > 0){
            for(var i=0;i<imgData.length;i++){
              let jsonAll = {id:id,name:imgData[i],url:api.url.siteCenter.imagePath + imgData[i]};
              myArray.push(jsonAll);
            }
            this.image = true;
          }else{

          }
          return  myArray;
        }

      },
      //获取list信息
      getStartData:function () {
        //获取用户id
        this.userId = this.$parent.getUserId();
        //获取项目id
        this.proStr = this.$parent.getProjectId();
        console.log(this.proStr);
        let pageSize = this.pageSize;
        let currentPage = this.currentPage;
        let first = (currentPage - 1) * pageSize;

        api.post(api.url.workSiteInstall.initData, {
          'first': first,
          'count': pageSize,
          'userId': this.userId,
          'pmId': this.proStr
        }).then((data) => {
          console.log(data.rows);
          this.installTableData = data.rows;
          this.selectData.needSoftware = data.productLineList;
          this.selectData.needHardware =  data.hardList;
          this.selectData.assignedTo = data.userList;
          this.total = data.total;

          // return data;
        })
      },

      siteEnd(){

        var type = "";
        var message = "";
        this.$confirm('确认完成, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          api.post(api.url.workSiteInstall.siteEnd, {//获取用户id
            'pmId':this.$parent.getProjectId(),
            'userId': this.$parent.getUserId(),
             'dataType':this.dataType
          }).then((data) => {
            this.dataType=data.dataType;
            if(data.type=="1"){
              this.isActive = true;
            }else{
              this.isActive = false;
            }
            this.$message({message: data.msg, type: 'success'});
          });

        }).catch(() => {
          this.$message({
            type: "info",
            message: "取消确认！"
          });
        });

      },


      //编辑站点信息
      addSiteInstallDetail(id){
        api.post(api.url.workSiteInstall.addSiteInstallDetail, {
          'id': id,
          'pmId':this.$parent.getProjectId(),
          'operator': this.$parent.getUserId()
        }).then((data) => {
          console.log("site=",data.siteInstallDetails);
          this.siteDetailData = data.siteInstallDetails;
          this.deptName=data.deptName;
          this.rowId=id;
        });
        this.newPage = true;
      },

      //删除站点信息
      removeSite(id){

        api.post(api.url.workSiteInstall.removeSite, {
          'id': id,
          'pmId':this.$parent.getProjectId()
        }).then((data) => {
          this.$message({message: '删除成功', type: 'success'});
          this.getStartData();
        });
      },

      //`新增
      openAddWindows(){
        this.newAdd = true;
          api.post(api.url.workSiteInstall.formData, {
            pmId:this.$parent.getProjectId(),
            serialNo:this.$parent.getCustomerId()
          }).then((data) => {
            console.log(data);
            this.selectDeptType =data.deptTypeList;
            this.selectFormData = data.productLineList;
          })

      },
      //响应科室
      deptType(typeCode){
        this.selectDept='';
        var json = {
          deptType:typeCode,
          serialNo:this.$parent.getCustomerId()
        };
        api.post(api.url.workSiteInstall.selectDeptList, json).then((data) => {
          this.selectDept =data.deptList;
        });
      },
      //保存科室信息
      saveDeptData: function () {
        var json = {
          deptType: this.formData.deptType,
          deptCode: this.formData.departName,
          cpzxt: this.formData.userSystem,
          operator: this.$parent.getUserId(),
          pmId:this.$parent.getProjectId(),
          cId:this.$parent.getContractId(),
          serialNo:this.$parent.getCustomerId()
        };
        api.post(api.url.workSiteInstall.updateSiteInstall, json).then((data) => {
          if (data.status == 1) {
            this.$message.error('科室名称重复！');
          }else{
            this.$message({message: '成功保存', type: 'success'});
            this.getStartData();
            this.newAdd = false;
          }
        });

      },
      submitForm(formName) {

      },
      //保存站点明细信息
      saveSiteDetail:function () {
          console.log("sitenam="+JSON.stringify(this.siteDetailData[1].siteName));
        api.post(api.url.workSiteInstall.saveSiteDetail, {detailData:JSON.stringify(this.siteDetailData),operator:this.$parent.getUserId()}).then((data) => {
            this.$message({message: '成功保存', type: 'success'});
            this.newAdd = false;

        });
      },
      //新增站点
      addSiteDetail(){
        api.post(api.url.workSiteInstall.addItem, {
          'pId': this.rowId
        }).then((data) => {
          this.$message({message: '新增成功', type: 'success'});
          this.addSiteInstallDetail(this.rowId);
        });
      },


      //删除站点
      deteleSite(detailId) {
        api.post(api.url.workSiteInstall.deleteItem, {
          'id': detailId
        }).then((data) => {
          this.$message({message: '删除成功', type: 'success'});
          this.addSiteInstallDetail(this.rowId);
        });
      },

      //选择范围
      doRangeSelect(range, id) {
        console.info("noScopeCode:" + range);
        console.info("id:" + id);
        //改变范围
        api.post(api.url.workSiteInstall.changeScope, {
          'noScopeCode': range,
          'id': id
        }).then((data) => {
          console.log(data.msg);
        });
      },
      //硬件
      doHardWareSelect(hard,id){
        console.info("hard:" + hard);
        console.info("id:" + id);
        //改变硬件
        api.post(api.url.workSiteInstall.changeHardWare, {
          'hwId': hard,
          'id': id,
          'pmId':this.$parent.getProjectId(),
          'operator': this.$parent.getUserId()
        }).then((data) => {
          console.log(data.msg);
        });
      },

      //软件
      doSoftSelect(hard,id){
        console.info("hard:" + hard);
        console.info("id:" + id);
        //改变硬件
        api.post(api.url.workSiteInstall.changeSoftWare, {
          'pdId': hard,
          'id': id,
          'pmId':this.$parent.getProjectId(),
          'operator': this.$parent.getUserId()
        }).then((data) => {
          console.log(data.msg);
        });
      },
      //分配人
      doUserSelect(hard,id){
        console.info("hard:" + hard);
        console.info("id:" + id);
        //改变硬件
        api.post(api.url.workSiteInstall.changeUser, {
          'puserId': hard,
          'id': id,
          'operator': this.$parent.getUserId()
        }).then((data) => {
          console.log(data.msg);
        });
      },

      //站点数
      doSiteSelect(hard,id){
        console.info("hard:" + hard);
        console.info("id:" + id);
        //改变硬件
        api.post(api.url.workSiteInstall.changeSite, {
          'num': hard,
          'id': id,
          'operator': this.$parent.getUserId()
        }).then((data) => {
          console.log(data.msg);
        });
      },
      //图片上传
      UploadUrl:function(detailId){
        return api.url.workSiteInstall.uploadFileSite+"?operator="+this.$parent.getUserId()+"&id="+detailId;
      },

      //图片删除
      handleRemoves(file, fileList) {
        let id = 0;
        let name = '';
        if(file.id){ //刷新页面的文件
          id = file.id;
          name = file.name;
        }else{ //上传成功的文件
          id = file.response.id;
          name = file.response.path;
        }
        let json = {
          name:name,
          id: id
        };
        console.log(json);
        api.post(api.url.workSiteInstall.deleteImg,json).then((data) => {
            console.log(data);
        });

      },
      //导入excel文件
      openUploadWindow:function () {
        this.fileList = [];
        this.uploadWindow = true;
        this.action = api.url.workSiteInstall.uploadFile + '?serialNo=' + this.$parent.getCustomerId()+"&cId="
          +this.$parent.getContractId()  +'&pmId='+this.$parent.getProjectId()+'&creator='+this.$parent.getUserId();
      },

      //导出excel文件
      downloadExcel: function () {
        window.open(api.url.workSiteInstall.exportExcel + '?serialNo=' + this.$parent.getCustomerId());
      },

      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //pageSize改变事件
      handleSizeChange(val) {
        this.pageSize = val;
        this.getStartData();

      },

      //currentPage改变事件
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getStartData();
      },
      eCharGo(){
        //获取用户id
        this.userId = this.$parent.getUserId();
        //获取项目id
        this.proStr = this.$parent.getProjectId();
        api.post(api.url.workSiteInstall.showEchart, {
          'pmId': this.proStr
        }).then((data) => {
          this.array=data.puserNameList;
          this.arrayNum=data.puserNumList;
          this.showEchart();
        })
      },

      showEchart:function () {
        let option = {
          color: ['#3398DB'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {
              type : 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : this.array,
              axisTick: {
                alignWithLabel: true
              },
              axisLabel:{
                color:'#666666',
                fontFamily:'Microsoft YaHei'
              },
              axisLine:{
                show:false
              }
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisLabel:{
                color:'#93abba'
              },
              axisLine:{
                lineStyle:{
                  color:'#93abba'
                }
              }
            }
          ],
          series : [
            {
              type:'bar',
              label:{
                show:true,
              },
              data:this.arrayNum,
              markPoint : {
                data : [
                  {type : 'max', name: '最大值'},
                  {type : 'min', name: '最小值'}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name: '平均值'}
                ]
              },
              itemStyle:{
                color:'#4d9eff'
              }
            }
          ]
        };
        setTimeout(_=>{
          let myChart = echarts.init(document.getElementById('main'));
          myChart.setOption(option);
        },0);
      }
    },
    filters:{
      connetArray:function (item) {
        let _arr = item.printer.concat(item.desktop,item.moreScreen,item.ticker,item.cardReader);
        if(_arr.length <= 0){
          return '请选择';
        }
        return _arr.toString();
      }
    }
  }


</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
  .site-install{
    position relative
    height 100%
    padding 0px 15px
  }
  #main{
    width 100%
    height 400px
  }
  span.installed{
    color:#2fdd2f;
  }
  span.noinstall{
    color:#ff6464;
  }
  span.installing{
    color:#666666;
  }
  .new-page{
    position absolute
    top 1px
    right 0px
    bottom 0px
    left 0px
    z-index 10
    background #fff
    overflow auto
  }
  .new-page_header{
    padding: 20px 20px 10px;
  }
  .new-page_title{
    line-height: 24px;
    font-size: 16px;
    color: #333;
  }
  .new-page_header button{
    border 10px solid transparent
  }
  .new-page_header button:hover i{
    transform rotate(180deg);
  }
  .new-page_header button i{
    transition all ease-in .5s
  }
  .new-page_body{
    padding: 0px 20px;
    color: #606266;
    line-height: 24px;
    font-size: 14px;
  }
  .page-form-check .el-form-item{
    margin-bottom 0px
  }
  .icon-button{
    position: relative;
    margin-right: 30px;
    padding 4px 15px;
    cursor: pointer;
    color: #606266;
    font-size 14px;
    border-radius 3px
    background: #fff;
    border: 1px solid #dcdfe6;
  }
  .icon-button>i{
    margin-right: 10px;
    font-size: 14px;
  }
  .line{
    margin  30px 0px
    border-bottom:1px dashed #f2f2f2
  }
  .add-site{
    margin-top 20px
  }
  .add-site_title{
    margin-bottom 20px
  }
  .add-site_title>span{
    padding-left 8px
    border-left 2px solid #1e90ff
    color #333
    font-size 14px
  }
  .add-site_title>i{
    float right
    cursor pointer
    width 30px
    height 24px
    text-align center
  }
  .add-site_title>i.el-icon-delete:before{
    vertical-align sub
  }
  .add-site_btn{
    padding-top  8px
    border-top 1px dashed #f2f2f2
    text-align right
  }
  span.need-hard-slecet{
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 28px;
    line-height: 28px;
    outline: 0;
    padding: 0 15px;
    width: 100%;
    text-overflow ellipsis
    white-space nowrap
  }
</style>
<style lang="stylus">
  .add-site_body .el-upload--picture-card{
    width 100px
    height 100px
    line-height 100px
  }
  .page-form-show{
    width 60px
    margin-right 0px
    margin-left auto
    text-align right
    border 1px solid red
    cursor pointer
    transition transform ease-in .5s
  }
  .page-form-show i{
    transform rotate(-180deg)
  }
</style>

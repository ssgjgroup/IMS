webpackJsonp([4],{"03Mw":function(e,t){},BwfL:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=a("7VF+"),o=a.n(l),i=a("WhC7"),r={data:function(){return{chart:!1,image:!1,pageSize:10,total:10,currentPage:1,operateRowId:0,imgPaths:[],commondTableData:[{id:12,siteName:"胸外科病区住院护士站",productName:"病区护士站",menuName:"发票打印",questionType:"程序类",questionDesc:"发票走纸不对",create_name:"万科",createTime:"2017/01/02 17:23",dealType:"1",priority:"1",workAssig:"1",completionTime:"2017/01/03 14:20"}],selectData:{dealType:[],priority:[],workAssig:[],manuscriptType:[],reasonType:[],manuscriptStatus:[],solutionType:[],diffcultLevel:[],batchNo:[{value:"1",label:"1"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5"},{value:"6",label:"6"},{value:"7",label:"7"},{value:"8",label:"8"},{value:"9",label:"9"},{value:"10",label:"10"}]},nameData:[],numData:[],dialogVisible:!1,dialogImageUrl:"",lead:!1,leadForm:{id:0,batchNo:1,priority:1,manuscriptType:1,reasonType:1,manuscriptStatus:1,solutionType:1,solutionResult:"",diffcultLevel:1,createUser:1,devUser:1,linkman:"",mobile:"",createDate:"",hopeFinishDate:"",userMessage:""},leadRules:{leadType:[{required:!0,message:"请选择底稿类型"}],leadBatch:[{required:!0,message:"请选择批次"}],leadPriority:[{required:!0,message:"请选择问题优先级"}],sourceType:[{required:!0,message:"请选择原因分类"}],resolveType:[{required:!0,message:"请选择解决方式"}],leadLevel:[{required:!0,message:"请选择难度"}],sourceUser:[{required:!0,message:"请输入提出人工号"}],devUser:[{required:!0,message:"请输入接收人工号"}],createDate:[{required:!0,message:"请选择提出日期"}]}}},created:function(){this.$parent.setSelectDisable(!0),this.$parent.setProjectInfo(),this.initCodes(),this.$nextTick(function(){this.initCenterData()})},methods:{initCodes:function(){var e=this;i.a.post(i.a.url.etCustomerDetail.initCodes,{dictCode:"operType"}).then(function(t){e.selectData.dealType=t.data}),i.a.post(i.a.url.etCustomerDetail.initCodes,{dictCode:"priorityType"}).then(function(t){e.selectData.priority=t.data}),i.a.post(i.a.url.etCustomerDetail.initCodes,{dictCode:"manuscriptType"}).then(function(t){e.selectData.manuscriptType=t.data}),i.a.post(i.a.url.etCustomerDetail.initCodes,{dictCode:"reasonType"}).then(function(t){e.selectData.reasonType=t.data}),i.a.post(i.a.url.etCustomerDetail.initCodes,{dictCode:"manuscriptStatus"}).then(function(t){e.selectData.manuscriptStatus=t.data}),i.a.post(i.a.url.etCustomerDetail.initCodes,{dictCode:"solutionType"}).then(function(t){e.selectData.solutionType=t.data}),i.a.post(i.a.url.etCustomerDetail.initCodes,{dictCode:"diffcultLevel"}).then(function(t){e.selectData.diffcultLevel=t.data})},initCenterData:function(){var e=this,t=this.pageSize,a=(this.currentPage-1)*t,l=this.$parent.getCustomerId(),o=this.$parent.getProjectId();i.a.post(i.a.url.siteCenter.initData,{pmId:o,serialNo:l,first:a,count:t}).then(function(t){e.commondTableData=t.rows,e.total=t.total,e.selectData.workAssig=t.data,e.numData=t.numList,e.nameData=t.nameList})},echartChange:function(){var e=this,t=this.$parent.getCustomerId();i.a.post(i.a.url.siteCenter.updateEchart,{serialNo:t}).then(function(t){"success"==t.status&&(e.numData=t.numList,e.nameData=t.nameList)})},showEchart:function(){var e={color:["#3398DB"],tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},grid:{left:"3%",right:"4%",bottom:"3%",containLabel:!0},xAxis:[{type:"category",data:this.nameData,axisTick:{alignWithLabel:!0},axisLabel:{color:"#666666",fontFamily:"Microsoft YaHei"},axisLine:{show:!1}}],yAxis:[{type:"value",axisLabel:{color:"#93abba"},axisLine:{lineStyle:{color:"#93abba"}}}],series:[{type:"bar",label:{show:!0},data:this.numData,markPoint:{data:[{type:"max",name:"最大值"},{type:"min",name:"最小值"}]},markLine:{data:[{type:"average",name:"平均值"}]},itemStyle:{color:"#4d9eff"}}]};setTimeout(function(t){o.a.init(document.getElementById("main")).setOption(e)},0)},showInfo:function(e){this.operateRowId=e.id},operTypeChange:function(e){var t=this.operateRowId,a=this.$parent.getUserId();i.a.post(i.a.url.siteCenter.updateOperType,{id:t,operator:a,operType:e}).then(function(e){"success"==e.status&&console.log("变更成功")})},priorityTypeChange:function(e){var t=this.operateRowId,a=this.$parent.getUserId();i.a.post(i.a.url.siteCenter.updatePriorityType,{id:t,operator:a,priority:e}).then(function(e){"success"==e.status&&console.log("变更成功")})},allocateUserChange:function(e){var t=this,a=this.operateRowId,l=this.$parent.getUserId();i.a.post(i.a.url.siteCenter.updateAllocateUser,{id:a,operator:l,allocateUser:e}).then(function(e){"success"==e.status&&(console.log("变更成功"),t.echartChange())})},showImageInfo:function(e){if(""!=e){var t=e.split(";");if(this.imgPaths=[],t.length>0){for(var a=0;a<t.length;a++)this.imgPaths[a]={url:i.a.url.siteCenter.imagePath+t[a],name:t[a].substring(t[a].lastIndexOf("/")+1,t[a].lastIndexOf("."))};this.image=!0}else this.$alert("当前问题没有上传图片!","提示",{confirmButtonText:"确认",type:"info"})}else this.$alert("当前问题没有上传图片!","提示",{confirmButtonText:"确认",type:"info"})},openImportPmisWindow:function(e){this.leadForm.id=e.id,this.leadForm.batchNo=e.batchNo,this.leadForm.priority=e.priority,this.leadForm.manuscriptType=e.manuscriptType,this.leadForm.reasonType=e.reasonType,this.leadForm.manuscriptStatus=e.manuscriptStatus,this.leadForm.diffcultLevel=e.diffcultLevel,this.leadForm.createUser=e.map.createUser,this.leadForm.devUser=e.devUser,this.leadForm.linkman=e.linkman,this.leadForm.mobile=e.mobile,this.leadForm.solutionType=e.solutionType,this.leadForm.solutionResult=e.solutionResult,this.leadForm.createDate=e.map.createTimeString,this.leadForm.hopeFinishDate=e.hopeFinishDate,this.leadForm.userMessage=e.userMessage,this.lead=!0},exportPmisData:function(e){var t=this,a={id:this.leadForm.id,batchNo:this.leadForm.batchNo,priority:this.leadForm.priority,manuscriptType:this.leadForm.manuscriptType,reasonType:this.leadForm.reasonType,manuscriptStatus:this.leadForm.manuscriptStatus,diffcultLevel:this.leadForm.diffcultLevel,devUser:this.leadForm.devUser,linkman:this.leadForm.linkman,mobile:this.leadForm.mobile,solutionType:this.leadForm.solutionType,solutionResult:this.leadForm.solutionResult,hopeFinishDate:this.leadForm.hopeFinishDate,userMessage:""===this.leadForm.userMessage?"无":this.leadForm.userMessage,operator:this.$parent.getUserId()};this.$refs[e].validate(function(e){if(!e)return!1;console.log(a),i.a.post(i.a.url.siteCenter.exportPmisData,a).then(function(e){"success"==e.status&&(t.initCenterData(),t.$message({type:"info",message:"导入PMIS成功"}))}),t.lead=!1})},handleSizeChange:function(e){this.pageSize=e,this.initCenterData()},handleCurrentChange:function(e){this.currentPage=e,this.initCenterData()},handleRemove:function(e,t){console.log(e,t)},handlePictureCardPreview:function(e){this.dialogImageUrl=e.url,this.dialogVisible=!0}}},s={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"commond"},[a("div",{staticClass:"w-table"},[a("div",{staticClass:"w-table-btn"},[a("span",{on:{click:function(t){e.chart=!0}}},[a("i",{staticClass:"iconfont icon-job-weight"}),e._v("工作比重")])]),e._v(" "),a("div",{staticClass:"w-table-content"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.commondTableData},on:{"cell-mouse-enter":e.showInfo}},[a("el-table-column",{attrs:{type:"selection",align:"center",width:"55",prop:"id"}}),e._v(" "),a("el-table-column",{attrs:{prop:"siteName",label:"站点名称",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"productName",label:"系统"}}),e._v(" "),a("el-table-column",{attrs:{prop:"menuName",label:"菜单"}}),e._v(" "),a("el-table-column",{attrs:{prop:"map.dict_label",label:"问题类别"}}),e._v(" "),a("el-table-column",{attrs:{prop:"questionDesc",label:"问题描述"}}),e._v(" "),a("el-table-column",{attrs:{prop:"map.create_name",label:"登记人",width:"100px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"map.createTimeString",label:"登记时间"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"处理方式"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-select",{attrs:{size:"mini",placeholder:"请选择"},on:{change:e.operTypeChange},model:{value:t.row.operType,callback:function(a){e.$set(t.row,"operType",a)},expression:"scope.row.operType"}},e._l(e.selectData.dealType,function(e){return a("el-option",{key:e.dictSort,attrs:{label:e.dictLabel,value:e.dictV}})}))]}}])}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"优先级"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-select",{attrs:{size:"mini",placeholder:"请选择"},on:{change:e.priorityTypeChange},model:{value:t.row.priority,callback:function(a){e.$set(t.row,"priority",a)},expression:"scope.row.priority"}},e._l(e.selectData.priority,function(e){return a("el-option",{key:e.dictSort,attrs:{label:e.dictLabel,value:e.dictV}})}))]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"工作分配"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-select",{attrs:{size:"mini",placeholder:"请选择"},on:{change:e.allocateUserChange},model:{value:t.row.allocateUser,callback:function(a){e.$set(t.row,"allocateUser",a)},expression:"scope.row.allocateUser"}},e._l(e.selectData.workAssig,function(e){return a("el-option",{key:e.id,attrs:{label:e.cName,value:e.userId}})}))]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"map.operatorTimeString",align:"center",label:"完成时间"}}),e._v(" "),a("el-table-column",{attrs:{fixed:"right",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticClass:"operate"},[a("i",{staticClass:"iconfont icon-to-lead",on:{click:function(a){e.openImportPmisWindow(t.row)}}}),e._v(" "),a("i",{staticClass:"iconfont icon-screenshot",on:{click:function(a){e.showImageInfo(t.row.imgPath)}}})])]}}])})],1)],1),e._v(" "),a("div",{staticClass:"w-table-page"},[a("el-pagination",{attrs:{"current-page":e.currentPage,"page-sizes":[10,20,30,40],"page-size":e.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)]),e._v(" "),a("el-dialog",{attrs:{title:"实施人员工作比重",width:"50%",visible:e.chart},on:{open:e.showEchart,"update:visible":function(t){e.chart=t}}},[a("div",{attrs:{id:"main"}})]),e._v(" "),a("el-dialog",{staticClass:"enlargeImg",attrs:{width:"50%",visible:e.image},on:{"update:visible":function(t){e.image=t}}},[a("el-upload",{attrs:{action:"","list-type":"picture-card","on-preview":e.handlePictureCardPreview,"on-remove":e.handleRemove,"file-list":e.imgPaths}},[a("i",{staticClass:"el-icon-plus"})]),e._v(" "),a("el-dialog",{attrs:{visible:e.dialogVisible},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("img",{attrs:{width:"100%",src:e.dialogImageUrl,alt:""}})])],1),e._v(" "),a("el-dialog",{attrs:{title:"导入PMIS",width:"40%",visible:e.lead},on:{"update:visible":function(t){e.lead=t}}},[a("el-form",{ref:"leadForm",attrs:{model:e.leadForm,rules:e.leadRules}},[a("el-row",[a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"批次","label-width":"120px",prop:"batchNo",required:""}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.leadForm.batchNo,callback:function(t){e.$set(e.leadForm,"batchNo",t)},expression:"leadForm.batchNo"}},e._l(e.selectData.batchNo,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}))],1)],1),e._v(" "),a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"问题优先级","label-width":"120px",prop:"priority",required:""}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.leadForm.priority,callback:function(t){e.$set(e.leadForm,"priority",t)},expression:"leadForm.priority"}},e._l(e.selectData.priority,function(e){return a("el-option",{key:e.dictSort,attrs:{label:e.dictLabel,value:e.dictV}})}))],1)],1)],1),e._v(" "),a("el-row",[a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"底稿类型","label-width":"120px",prop:"manuscriptType",required:""}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.leadForm.manuscriptType,callback:function(t){e.$set(e.leadForm,"manuscriptType",t)},expression:"leadForm.manuscriptType"}},e._l(e.selectData.manuscriptType,function(e){return a("el-option",{key:e.dictSort,attrs:{label:e.dictLabel,value:e.dictV}})}))],1)],1),e._v(" "),a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"原因分类","label-width":"120px",prop:"reasonType",required:""}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.leadForm.reasonType,callback:function(t){e.$set(e.leadForm,"reasonType",t)},expression:"leadForm.reasonType"}},e._l(e.selectData.reasonType,function(e){return a("el-option",{key:e.dictSort,attrs:{label:e.dictLabel,value:e.dictV}})}))],1)],1)],1),e._v(" "),a("el-row",[a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"底稿状态","label-width":"120px",prop:"manuscriptStatus",required:""}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.leadForm.manuscriptStatus,callback:function(t){e.$set(e.leadForm,"manuscriptStatus",t)},expression:"leadForm.manuscriptStatus"}},e._l(e.selectData.manuscriptStatus,function(e){return a("el-option",{key:e.dictSort,attrs:{label:e.dictLabel,value:e.dictV}})}))],1)],1),e._v(" "),a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"难度","label-width":"120px",prop:"diffcultLevel",required:""}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.leadForm.diffcultLevel,callback:function(t){e.$set(e.leadForm,"diffcultLevel",t)},expression:"leadForm.diffcultLevel"}},e._l(e.selectData.diffcultLevel,function(e){return a("el-option",{key:e.dictSort,attrs:{label:e.dictLabel,value:e.dictV}})}))],1)],1)],1),e._v(" "),a("el-row",[a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"提出人工号","label-width":"120px",prop:"createUser",required:""}},[a("el-input",{attrs:{"auto-complete":"off",disabled:!0},model:{value:e.leadForm.createUser,callback:function(t){e.$set(e.leadForm,"createUser",t)},expression:"leadForm.createUser"}})],1)],1),e._v(" "),a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"接收人工号","label-width":"120px",prop:"devUser",required:""}},[a("el-input",{attrs:{"auto-complete":"off"},model:{value:e.leadForm.devUser,callback:function(t){e.$set(e.leadForm,"devUser",t)},expression:"leadForm.devUser"}})],1)],1)],1),e._v(" "),a("el-row",[a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"联系人","label-width":"120px",prop:"linkman"}},[a("el-input",{attrs:{"auto-complete":"off"},model:{value:e.leadForm.linkman,callback:function(t){e.$set(e.leadForm,"linkman",t)},expression:"leadForm.linkman"}})],1)],1),e._v(" "),a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"联系电话","label-width":"120px",prop:"mobile"}},[a("el-input",{attrs:{"auto-complete":"off"},model:{value:e.leadForm.mobile,callback:function(t){e.$set(e.leadForm,"mobile",t)},expression:"leadForm.mobile"}})],1)],1)],1),e._v(" "),a("el-row",[a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"解决方式","label-width":"120px",prop:"solutionType",required:""}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.leadForm.solutionType,callback:function(t){e.$set(e.leadForm,"solutionType",t)},expression:"leadForm.solutionType"}},e._l(e.selectData.solutionType,function(e){return a("el-option",{key:e.dictSort,attrs:{label:e.dictLabel,value:e.dictV}})}))],1)],1),e._v(" "),a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"解决结果","label-width":"120px",prop:"solutionResult"}},[a("el-input",{attrs:{"auto-complete":"off"},model:{value:e.leadForm.solutionResult,callback:function(t){e.$set(e.leadForm,"solutionResult",t)},expression:"leadForm.solutionResult"}})],1)],1)],1),e._v(" "),a("el-row",[a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"创建时间","label-width":"120px",prop:"createDate",required:""}},[a("el-date-picker",{attrs:{type:"date",disabled:!0,placeholder:"选择日期"},model:{value:e.leadForm.createDate,callback:function(t){e.$set(e.leadForm,"createDate",t)},expression:"leadForm.createDate"}})],1)],1),e._v(" "),a("el-col",{attrs:{xs:12,sm:12,md:12,lg:12}},[a("el-form-item",{attrs:{label:"希望完成日期","label-width":"120px",prop:"hopeFinishDate"}},[a("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd",placeholder:"选择日期"},model:{value:e.leadForm.hopeFinishDate,callback:function(t){e.$set(e.leadForm,"hopeFinishDate",t)},expression:"leadForm.hopeFinishDate"}})],1)],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"确认意见","label-width":"120px",prop:"userMessage"}},[a("el-input",{attrs:{type:"textarea","auto-complete":"off"},model:{value:e.leadForm.userMessage,callback:function(t){e.$set(e.leadForm,"userMessage",t)},expression:"leadForm.userMessage"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.lead=!1}}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.exportPmisData("leadForm")}}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var n=a("Z0/y")(r,s,!1,function(e){a("U3rk"),a("03Mw")},"data-v-bb252578",null);t.default=n.exports},U3rk:function(e,t){}});
//# sourceMappingURL=4.087a9f9226a01d2285c2.js.map
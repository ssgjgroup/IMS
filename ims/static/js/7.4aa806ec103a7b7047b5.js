webpackJsonp([7],{"4wlF":function(t,e){},JXTs:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("WhC7"),n={data:function(){return{initData:{},initData2:{},initData3:{},backgroundData:["","","","",""],graphicData:[{text:"项目经理已完成工作",state:"state"},{text:"项目经理未完成工作",state:"state"},{text:"实施人员已完成工作",state:"state"},{text:"实施人员未完成工作",state:"state"},{text:"项目经理完成且异常工作",state:"state"},{text:"实施人员完成且异常工作",state:"state"},{text:"正在进行实施工作",state:"state"}],lineData:[{className:"line2",text:"模拟系统运行",state:"state1"},{className:"line2",text:"",state:"state-null"},{className:"line2",text:"培训客户&考核",state:"state1"},{className:"line2",text:"安装站点软硬件",state:"state1"},{className:"line2",text:"",state:"state-null"},{className:"line2",text:"",state:"state-null"},{className:"line2",text:"检验易用数据",state:"state1"},{className:"line2",text:"检验基础数据",state:"state1"},{className:"line2",text:"维护基础数据",state:"state1"},{className:"line2",text:"维护易用数据",state:"state1"},{className:"line2",text:"调研流程&配置",state:"state1"},{className:"line2",text:"开发接口&交付",state:"state1"},{className:"line2",text:"单据报表&交付",state:"state1"},{className:"line2",text:"数据维护",state:"state7"},{className:"line2",text:"确认流程数量",state:"state7"},{className:"line2",text:"确认接口数量",state:"state7"},{className:"line2",text:"确认硬件数量",state:"state7"},{className:"line2",text:"确认数据报表数量",state:"state7"}],lineBtmData:[{className:"line3",text:"评估上线可行性",state:"state2"},{className:"line3",text:"审批切换方案",state:"state2"},{className:"line3",text:"安排人员到岗",state:"state2"},{className:"line3",text:"切换项目",state:"state2"},{className:"line3",text:"结束",state:"end"}]}},created:function(){this.$nextTick(function(){this.getStartData(),this.$parent.setSelectDisable(!1)})},methods:{getStartData:function(){var t=this;s.a.post(s.a.url.projectInfo.initData,{}).then(function(e){t.initData=e.result,t.initData2=e.result_two,t.initData3=e.result_Three})}}},i={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"index-container"},[a("div",{staticClass:"graphic"},t._l(t.graphicData,function(e,s){return a("span",[a("i",{class:"state"+ ++s}),t._v(t._s(e.text))])})),t._v(" "),a("div",{staticClass:"index-content "},[t._l(t.backgroundData,function(t,e){return a("div",{class:"index-bg0"+ ++e})}),t._v(" "),a("div",{staticClass:"line1"},t._l(t.initData,function(e,s){return a("span",{class:"line1-"+ ++s},[a("i",{class:e.state}),t._v(t._s(e.text)+"\n      ")])})),t._v(" "),a("div",{staticClass:"line2"},t._l(t.initData2,function(e,s){return a("span",{class:"line2-"+ ++s},[a("i",{class:e.state}),t._v(t._s(e.text)+"\n      ")])})),t._v(" "),a("div",{staticClass:"line3"},t._l(t.initData3,function(e,s){return a("span",{class:"line3-"+ ++s},[a("i",{class:e.state}),t._v(t._s(e.text))])}))],2)])},staticRenderFns:[]};var l=a("VU/8")(n,i,!1,function(t){a("4wlF")},"data-v-e64b9998",null);e.default=l.exports}});
//# sourceMappingURL=7.4aa806ec103a7b7047b5.js.map
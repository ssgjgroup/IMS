<!--
* @author: jinxl
* @date: 2018/2/5
* @module:
-->
<template>
<div class="index-container">
  <div class="graphic">
    <span v-for="(item, index) in graphicData"><i :class="'state'+ (++index)"></i>{{ item.text }}</span>
  </div>
  <div class="index-content ">
    <div v-for="(item, index) in backgroundData" :class="'index-bg0'+ (++index) "></div>
    <div  class="line1">
      <span  v-for="(item, index) in initData" :class="'line1-'+ (++index)">
        <i :class="item.state"></i>{{ item.text }}
      </span>
      <!--
      <span class="line1-1"><i class="start"></i>开始</span>
      <span class="line1-9"><i class="end"></i>项目启动</span> -->
    </div>
    <div  class="line2">
      <span  v-for="(item, index) in initData2" :class="'line2-'+ (++index)">
        <i :class="item.state"></i>{{ item.text }}
      </span>
    </div>
    <div class="line3">
      <span v-for="(item, index) in initData3" :class="'line3-'+ (++index)"><i :class="item.state"></i>{{ item.text }}</span>
    </div>
  </div>
</div>
</template>
<!--JavaScript-->
<script>
    import api from  '../../../api/api'
    export default {
        //数据
        data(){
            return {
                initData: {},
                initData2: {},
                initData3: {},
                backgroundData:['','','','',''],
                graphicData:[
                  {
                    text:'开始',
                    state:'state2'
                  },
                  {
                      text:'项目接单',
                      state:'state2'
                  },
                  {
                    text:'完善项目信息',
                    state:'state2'
                  },
                  {
                    text:'硬件清单准备',
                    state:'state2'
                  },
                  {
                    text:'入场准备',
                    state:'state2'
                  },
                  {
                    text:'实施计划制定',
                    state:'state2'
                  },
                  {
                    text:'测试环境搭建',
                    state:'state2'
                  },
                  {
                    text:'确认项目范围',
                    state:'state2'
                  },
                  {
                    text:'项目启动',
                    state:'state2'
                  }
                ],
                lineData:[
                  {
                    className:'line2',
                    text:'模拟系统运行',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'培训客户&考核',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'安装站点软硬件',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'检验易用数据',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'检验基础数据',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'维护基础数据',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'维护易用数据',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'调研流程&配置',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'开发接口&交付',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'单据报表&交付',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'数据维护',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'确认流程数量',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'确认接口数量',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'确认硬件数量',
                    state:'state4',
                  },
                  {
                    className:'line2',
                    text:'确认数据报表数量',
                    state:'state4',
                  }
                ],
                lineBtmData:[
                  {
                    className:'line3',
                    text:'评估上线可行性',
                    state:'state2',
                  },
                  {
                    className:'line3',
                    text:'审批切换方案',
                    state:'state2',
                  },
                  {
                    className:'line3',
                    text:'安排人员到岗',
                    state:'state2',
                  },
                  {
                    className:'line3',
                    text:'切换项目',
                    state:'state2',
                  },
                  {
                    className:'line3',
                    text:'结束',
                    state:'end',
                  }
                ]
            }
        },
        created(){
          this.$nextTick(function () {
            this.$root.$on('childData',data=>{
              this.getStartData();
              });
            this.getStartData();
            this.$parent.setSelectDisable(false);
          })
        },

        methods: {
          getStartData:function () {
            if(this.$parent.getProjectId()==""||this.$parent.getProjectId()==null || this.$parent.getProjectId()=='undefined'){
              this.initData = this.graphicData;
              this.initData2 = this.lineData;
              this.initData3 = this.lineBtmData;
            }else{
              api.post(api.url.projectInfo.initData,{
                'pm_id':this.$parent.getProjectId()
              }).then((data)=>{
                this.initData = data.result;
                this.initData2 = data.result_two;
                this.initData3 = data.result_Three;
                // return data;
              })
            }

          }
            // getUserName: function () {
            //   api.post(api.url.projectInfo.testUrl,{}).then(() => {
            //     //next do
            //   })
            // }
        },
        computed: {
            reversedMessage: function () {
            }
        },
        watch: {
            message: function () {
            }
        },
        filters: {
            subString: function () {
            }
        },
        components: {}
    }

</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
  .index-container{
    position relative
    margin 5px auto
    width 1442px
    /*height 100%*/
    /*overflow auto*/
  }
  .graphic{
    height 50px
    margin 10px auto
  }
  .graphic span{
    display inline-block
    height 22px
    margin 12px 30px 0px 0px
    line-height 22px
  }
  .graphic i{
    float left
    width 22px
    height 22px
    margin-right 5px
    background-image url('../../assets/images/point.png')
    background-repeat no-repeat
  }
  .index-content{
    position relative
    width 1436px
    height 666px
    margin-top 3%
  }
  .index-content i{
    display block
    margin: 0px auto 8px;
    width 22px
    height 22px
    background-image url('../../assets/images/point.png')
    background-repeat no-repeat
  }
  .index-content>div[class*=index-bg]{
    height 133px
    background-color #fff
    background-repeat no-repeat
  }
  .index-content>div[class*=line]{
    position: absolute;
    width: 100%;
    box-sizing border-box
  }
  .index-content>div span{
    position absolute
    text-align center
  }


  /*状态*/
  .start{ background-position: center -223px; }
  .end{ background-position: center -475px; }
  .state1{ background-position: center 3px; }
  .state2{ background-position: center -296px; }
  .state3{ background-position: center -93px; }
  .state4{ background-position: center -124px; }
  .state5{ background-position: center -61px; }
  .state6{ background-position: center -158px; }
  .state7{ background-position: center -189px; }
  .state-null{ background-position: center -330px; }
  .state-error{ background-position: center -189px; }

  @media screen and (min-width: 1367px) {
    .index-content>div.line1 span{
      top 59px
    }
    .index-content>div.line3 span{
      top 37px
    }
    .index-bg01{
      background-image  url('../../assets/images/1660_01.gif')
    }
    .index-bg02{
      background-image  url('../../assets/images/1660_02.gif')
    }
    .index-bg03{
      background-image  url('../../assets/images/1660_03.gif')
    }
    .index-bg04{
      background-image  url('../../assets/images/1660_04.gif')
    }
    .index-bg05{
      height 132px!important
      background-image  url('../../assets/images/1660_05.png')
    }
    /*锚点定位*/
    .line1{
      top: 0px;
      height: 163px;
    }
    .line1-1{ left: 60px }
    .line1-2{ left: 240px }
    .line1-3{ left: 417px }
    .line1-4{ left: 596px }
    .line1-5{ right: 634px }
    .line1-6{ right: 346px;top:7px!important}
    .line1-7{ right: 346px;top:60px!important}
    .line1-8{ right: 346px;top:110px!important}
    .line1-9{ right: 78px }
    .line2{
      top: 180px;
      height: 367px;
    }
    .line2-1{ top:225px; left: 61px }
    .line2-2{ top:225px; left: 193px }
    .line2-3{ top:149px; left: 243px }
    .line2-4{ top:307px; left: 243px }
    .line2-5{ top:149px; left: 467px }
    .line2-6{ top:45px; left: 528px }
    .line2-7{ top:16px; left: 600px }
    .line2-8{ top:70px; left: 600px }
    .line2-9{ top:16px; left: 766px }
    .line2-10{ top:70px; left: 766px }
    .line2-11{ top:129px; left: 763px }
    .line2-12{ top:190px; left: 764px }
    .line2-13{ top:248px; left: 764px }
    .line2-14{ top:44px; right: 346px }
    .line2-15{ top:127px; right: 334px }
    .line2-16{ top:188px; right: 334px }
    .line2-17{ top:249px; right: 334px }
    .line2-18{ top:306px; right: 322px }
    .line3{
      bottom 0px
      height: 105px;
    }
    .line3-1{ left: 205px }
    .line3-2{ left: 475px }
    .line3-3{ right: 661px }
    .line3-4{ right: 391px }
    .line3-5{ right: 86px }
  }
	/*1660*/
	@media screen and (max-width: 1659px) {
    .index-container{
      width 100%;
    }
	}
</style>

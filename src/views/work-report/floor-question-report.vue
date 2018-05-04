<!--
* @author: jinxl
* @date: 2018/3/28
* @module:楼层问题汇报
-->
<template>
<div class="floor-question">
  <div class="w-table">
    <div class="w-table-content">
      <el-table
        :data="floorTableData"
        style="width: 100%">
        <el-table-column
          prop="floorName"
          label="楼层名称">
        </el-table-column>
        <el-table-column
          prop="map.dict_label"
          label="问题分类">
        </el-table-column>
        <el-table-column
          prop="questionDesc"
          label="问题描述">
        </el-table-column>
        <el-table-column
          prop="map.yhmc"
          label="登记人">
        </el-table-column>
        <el-table-column
          prop="map.operator_name"
          label="处理人">
        </el-table-column>
        <el-table-column
          prop="map.createTime"
          label="登记时间">
        </el-table-column>
        <el-table-column
          prop="map.operatorTime"
          label="完成时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <div class="operate">
              <i @click="showImageInfo(scope.row.imgPath)" class="iconfont icon-screenshot"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="w-table-page">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="total">
      </el-pagination>
    </div>
  </div>
  <!--图片-弹窗-->
  <!-- <el-dialog  width="50%"
              class="commond-img"
              :visible.sync="image">
    <el-carousel class="slideImge">
      <el-carousel-item v-for="(item,index) in imgPaths" :key="index">
        <img v-bind:src="item" />
      </el-carousel-item>
    </el-carousel>
  </el-dialog> -->
   <!--图片-弹窗-->
    <el-dialog width="50%" class="enlargeImg" :visible.sync="image">
        <el-upload
          action=""
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="imgPaths">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </el-dialog>

</div>
</template>
<!--JavaScript-->
<script>
  import api from '../../../api/api'

    export default {
        //数据
        data(){
            return {
              image:false,
              pageSize: 10,
              total: 10,
              currentPage: 1,
              imgPaths:[],
              floorTableData:[
                {
                    floorName:'住医院大楼1楼',
                    questionType:'程序类',
                    questionDescribe:'发票走纸不对',
                    registrar:'万科',
                    registrarTime:'2017/01/02 17:23',
                    completeTime:'2017/01/02 17:23'
                }
              ],
              dialogVisible:false,
              dialogImageUrl:''
            }
        },
      created(){
        this.$parent.setSelectDisable(true);
        this.$parent.setProjectInfo();
        this.$nextTick(function(){
          this.initFloorQuestion();
        })
      },
      methods:{
        initFloorQuestion:function () {
          var pageSize = this.pageSize;
          var currentPage = this.currentPage;
          var first = (currentPage - 1) * pageSize;
          var khxx = this.$parent.getCustomerId();
          api.post(api.url.floorQuestion.initData, {'serialNo':khxx,'first': first, 'count': pageSize}).then((data) => {
            this.floorTableData = data.rows;
            this.total = data.total;
          });
        },
        //显示图片信息
        showImageInfo:function (imgPath) {
          if(imgPath != ''){
            var imgData = imgPath.split(';');
            this.imgPaths = [];
            if(imgData.length > 0){
              for(var i=0;i<imgData.length;i++){
                this.imgPaths[i] = {
                    url:api.url.siteCenter.imagePath + imgData[i],
                    name:imgData[i].substring(imgData[i].lastIndexOf('/')+1,imgData[i].lastIndexOf('.'))
                  };
              }
              this.image = true;
            }else{
              this.$alert('当前问题没有上传图片!', '提示', {
                confirmButtonText: '确认',
                type: 'info'
              });
            }
          }else{
            this.$alert('当前问题没有上传图片!', '提示', {
              confirmButtonText: '确认',
              type: 'info'
            });
          }
        },
         //pageSize改变事件
        handleSizeChange(val) {
          this.pageSize = val;
          this.initFloorQuestion();
        },
        //currentPage改变事件
        handleCurrentChange(val) {
          this.currentPage = val;
          this.initFloorQuestion();
        },
        handleRemove(file, fileList) {
        console.log(file, fileList);
        },
       handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
      }
    }
</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
  .floor-question{
    margin-top 30px
    padding 0px 30px
  }
  .slideImge img{
    width 100%
    height 100%
  }
</style>
<style lang="stylus">
  .commond-img .el-dialog{
    box-shadow none
    background none
  }
  .commond-img .el-dialog__header i.el-icon-close{
    position relative
    right -28px
    font-size 20px
    z-index 12
    background rgba(0,0,0,.6)
    border-radius 50%
  }
  .commond-img .el-dialog__body{
    padding 0px
  }
</style>

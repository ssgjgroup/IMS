<!--
* @author: jinxl
* @date: 2018/4/9
* @module:非同质
-->
<template>
  <div class="test-demo">
    <p>非同质功能</p>
    <el-form :model="formData"
             :rules="rules"
             ref="formData"
             label-width="100px">
      <el-form-item label="系统名称" prop="systemType">
        <el-input v-model="formData.systemType"></el-input>
      </el-form-item>
      <el-form-item label="接口名称" prop="interfaceName">
        <el-input v-model="formData.interfaceName"></el-input>
      </el-form-item>
      <el-form-item label="本期范围" prop="range">
        <el-select v-model="formData.range" placeholder="请选择">
          <el-option-group
            v-for="group in options3"
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
      <el-form-item label="审核状态" prop="aduit">
        <el-radio-group v-model="formData.aduit">
          <el-radio label="0">审核不通过</el-radio>
          <el-radio label="1">审核通过</el-radio>
          <el-radio label="2">待审核</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" prop="desc">
        <el-input type="textarea" v-model="formData.desc"></el-input>
      </el-form-item>
    </el-form>
    <el-button size="small" @click="imgSlide = true;">图片焦点图</el-button>
    <!--图片-弹窗-->
   <!--  <el-dialog  width="50%"
               class="commond-img"
               :visible.sync="imgSlide">
     <el-carousel class="imgSlide">
       <el-carousel-item v-for="item in 4">
         <img :src=" '../../src/assets/images/img'+item +'.jpg' "/>
       </el-carousel-item>
     </el-carousel>
   </el-dialog> -->
    <el-dialog  width="50%" :visible.sync="imgSlide" class="enlargeImg">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="fileList">
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
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import api from '../../../api/api'
  export default {
    //数据
    components: {ElButton},
    data(){
      return {
        imgSlide:false,
        options3: [{
          label: '否',
          options: [{
            value: 'Shanghai',
            label: '本期不实施'
          }, {
            value: '22',
            label: '医院暂时不用'
          }, {
            value: '11',
            label: '其他'
          }]
        },{
          label: '是',
          options: [{
            value: '1',
            label: '是'
          }]
        }],
        formData: {
          systemType:'',
          interfaceName:'',
          range:'1',
          aduit:'0',
          desc:''
        },
        rules: {
          systemType: [
            { required: true, message: '请输入系统分类', trigger: 'blur' }
          ],
          interfaceName: [
            { required: true, message: '请输入接口名称', trigger: 'blur' }
          ],
          range: [
            { required: true, message: '亲选择范围', trigger: 'change' }
          ]
        },
         fileList:[
          {
            name:"floor2",url:api.url.siteCenter.imagePath+"/onlineFile/floor2.jpg"
          },{
             name:"floor1",url:api.url.siteCenter.imagePath+"/onlineFile/floor2.jpg"
          }
        ],
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    created(){
      this.getUserName();
    },
    methods: {
      getUserName: function () {
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
  .imgSlide{
    text-align center
  }
  .imgSlide img{
    height 100%
  }
  .test-demo{
    width 90%
    margin 0 auto
  }
  .test-demo>p{
    padding 20px 0px
    font-size 20px
    text-align center
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

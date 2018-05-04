<!--
* @author: jinxl
* @date: 2018/3/27 0027
* @module:
-->
<template>
<div>
  <div class="w-table">
    <div class="w-table-btn">
      <span class="active"><i class="iconfont icon-conf-complete"></i>确认完成</span>
      <span><i class="iconfont icon-new-add"></i>新增</span>
      <span><i class="iconfont icon-export"></i>导出</span>
      <span class="active"><i class="iconfont icon-job-weight"></i>工作比重</span>
    </div>
    <div class="w-table-content">
      <el-table
        :data="installTableData"
        style="width: 100%">
        <el-table-column
          prop="serialNumber"
          label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          label="状态">
          <template slot-scope="scope">
            <span :class="scope.row.stateClass">{{ scope.row.stateTxt }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <div class="operate">
              <i class="iconfont icon-edit"></i>
              <i class="iconfont icon-delete"></i>
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
        :total="total">
      </el-pagination>
    </div>
  </div>
</div>
</template>
<!--JavaScript-->
<script>
    //import ModuleA from '...xxx
    export default {
        //数据
        data(){
            return {
              pageSize: 5,
              total: 10,
              currentPage: 1,
            }
        },
        created(){

        },
        methods: {
            getUserName: function () {

            }
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

	/*1660*/
	@media screen and (max-width: 1660px) {
	}

	/*1366*/
	@media screen and (max-width: 1366px) {
	}
</style>
<!--CSS-RESET-->
<style lang="stylus">

</style>

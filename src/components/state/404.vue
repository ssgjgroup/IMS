<!--
* @author: jinxl
* @date: 2018/4/18
* @module:友好提示模块
-->
<template>
<div class="error" @click="goBack">
  <img src="../../assets/images/404.png"
       alt="404"
       title="404">
  <span>正在建设中...</span>
</div>
</template>
<!--JavaScript-->
<script>
    export default {
        methods: {
            goBack: function () {
              //this.$router.push('/');
              //this.$router.go();
            }
        }
    }

</script>
<!--CSS-PAGE-->
<style lang="stylus" scoped>
  .error{
    display: flex;
    flex-direction column
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #666;
    font-size 18px
  }
  .error>img{
    width 450px
  }
  .error>span{
    margin-top 20px
  }
</style>

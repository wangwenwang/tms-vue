<template>
  <div class="od_bid">
    <header><i class="iconfont icon-xiangzuo1"   @click="goprev"></i><span>我的订单</span></header>
    <div class="container">
	    fds
    </div>
  </div>
</template>
<script type="text/javascript">
  export default{
    name:"od_bid",
    data(){
      return{

      }
    },
    created(){

    },
    methods:{
      // 返回上一页
      goprev(){
        this.$router.push({
          name:"home",
          query:{
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  .od_bid{
    overflow: hidden;
    .container{
      overflow: hidden;
    }
  }
</style>
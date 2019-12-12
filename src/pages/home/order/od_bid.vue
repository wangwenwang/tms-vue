<template>
  <div class="od_bid">
    <header><i class="iconfont icon-xiangzuo1"   @click="goprev"></i><span>我的订单</span></header>
    <div class="container">
      <div class="orderState">
        <div class="all" @click='choseAll'>全部</div>
        <div class="toSure" @click='choseToSure'>待确认</div>
        <div class="toloading" @click='choseToloading'>待装货</div>
        <div class="toTransit" @click='choseTransit'>运输中</div>
        <div class="toEvaluate" @click='choseToEvaluate'>待评价</div>
        <div class="cancel" @click='choseCancel'>取消</div>
      </div>
	    fds
    </div>
  </div>
</template>
<script type="text/javascript">
  import $ from 'jquery'
  export default{
    name:"od_bid",
    data(){
      return{
        orderState:'',//订单类型

      }
    },
    created(){
      
      this.$nextTick(() => {
          if(this.orderState == ""){
            this.choseAll();
          }
        })

    },
    methods:{
      // 返回上一页
      goprev(){
        this.$router.push({
          name:"HomeIndex",
          query:{
          }
        })
      },

      //全部
      choseAll(){
        this.toAll();
        this.orderState = "";
        // this.reqOrderListInfo();
      }, 
      //待确认
      choseToSure(){
        this.toSure();
        this.orderState = "NON-CONFIRM";
        // this.reqOrderListInfo();
      },
      //待装货
      choseToloading(){
        this.toloading();
        this.orderState = "NON-DELIVERY";
        // this.reqOrderListInfo();
      },
      //运输中
      choseTransit(){
        this.toTransit();
        this.orderState = "TRANSPORT";
        // this.reqOrderListInfo();
      },
      //待评价
      choseToEvaluate(){
        this.toEvaluate();
        this.orderState = "NON-RATE";
        // this.reqOrderListInfo();
      },
      //已取消
      choseCancel(){
        this.toCancel();
        this.orderState = "CANCEL";
        // this.reqOrderListInfo();
      },
       //全部样式
      toAll(){
        $(".all").css({'border-bottom':'2px solid #5965D8','color':'#5965D8','font-size':'17px'})
        $(".toSure").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toloading").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toTransit").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toEvaluate").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".cancel").css({'border-bottom':'none','font-size':'14px','color':'#000'})
      }, 
      //待确认样式
      toSure(){
        $(".all").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toSure").css({'border-bottom':'2px solid #5965D8','color':'#5965D8','font-size':'17px'})
        $(".toloading").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toTransit").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toEvaluate").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".cancel").css({'border-bottom':'none','font-size':'14px','color':'#000'})
      },
      //待装货样式
       toloading(){
        $(".all").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toSure").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toloading").css({'border-bottom':'2px solid #5965D8','color':'#5965D8','font-size':'17px'})
        $(".toTransit").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toEvaluate").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".cancel").css({'border-bottom':'none','font-size':'14px','color':'#000'})
      },
      //运输中样式
       toTransit(){
        $(".all").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toSure").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toloading").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toTransit").css({'border-bottom':'2px solid #5965D8','color':'#5965D8','font-size':'17px'})
        $(".toEvaluate").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".cancel").css({'border-bottom':'none','font-size':'14px','color':'#000'})
      },
      //待评价样式
       toEvaluate(){
        $(".all").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toSure").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toloading").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toTransit").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toEvaluate").css({'border-bottom':'2px solid #5965D8','color':'#5965D8','font-size':'17px'})
        $(".cancel").css({'border-bottom':'none','font-size':'14px','color':'#000'})
      },
      //已取消样式
       toCancel(){
        $(".all").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toSure").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toloading").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toTransit").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toEvaluate").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".cancel").css({'border-bottom':'2px solid #5965D8','color':'#5965D8','font-size':'17px'})
      },


    }
  }
</script>
<style lang="less" scoped>
  .od_bid{
    overflow: hidden;
    .container{
      overflow: hidden;
      .orderState{
        background-color:#fff;
        width: 100%;
        z-index: 50;
        position:fixed;
        top: 89/50rem;
        left: 0;
        text-align: center;
        padding-left: 2%;
        // border-bottom: 3/50rem solid #999;
        div{
          display: block;
          width: 16%;
          line-height: 90/50rem;
          float: left;
          // font-size: 26/50rem;
        }
         // .all{
         //    border-bottom: 4/50rem solid  #5965D8;
         //    color: #5965D8;
         //    font-size: 32/50rem;
         //  }

      }
    }
  }
</style>
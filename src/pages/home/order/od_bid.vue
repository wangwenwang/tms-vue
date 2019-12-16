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
      <div class="orderList">
        <componentOrderItem :orderArr='orderArr'></componentOrderItem>
      </div>

       <!-- 页面数据为空时 -->
      <div  class="NoData"  v-if="noDataShow">
        <div>
          <i  class="iconfont icon-meiyouwuliuxinxi"></i>
          <div>没有数据</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import $ from 'jquery'
  import componentOrderItem from '@/components/componentOrderItem'
  export default{
    name:"od_bid",
    data(){
      return{
        orderState:'',//订单类型
        orderArr:[],//订单列表
        noDataShow:false,//没有数据
      }
    },
    components:{
      componentOrderItem
    },
    created(){
      
      this.$nextTick(() => {
        if(this.orderState == ""){
          this.choseAll();
        }
      })
      this.nowDate = this.getNowTime().substring(0,10);

      var that = this
      var postData = {}
      // 获取门店信息
      that.httpRequest_ygy("queryDriverPriceInfo.do",postData,function(res){

        if(res.data.length){

          that.orderArr = res.data;
          that.noDataShow = false;

          for( var i=0; i<that.orderArr.length; i++){

            if(that.orderArr[i].publishTime.substring(0,10) == that.nowDate){
              
              that.orderArr[i].publishTime = that.orderArr[i].publishTime.substring(11,16);
            }else{
              that.orderArr[i].publishTime = that.orderArr[i].publishTime.substring(5,10);
            }
            if(that.orderArr[i].min_weight == that.orderArr[i].max_weight){
              
              that.orderArr[i].weight = true;
            }
            if(that.orderArr[i].min_volume == that.orderArr[i].max_volume){

              that.orderArr[i].volume = true;
            }
            that.orderArr[i].distance = that.orderArr[i].distance/1000;
            let tempVal = parseFloat(that.orderArr[i].distance).toFixed(2)
            that.orderArr[i].distance = tempVal.substring(0, tempVal.length - 1)
          }
        }else{
            that.noDataShow = true;
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
        // this.reqOrderList();
      }, 
      //待确认
      choseToSure(){
        this.toSure();
        this.orderState = "NON-CONFIRM";
        // this.reqOrderList();
      },
      //待装货
      choseToloading(){
        this.toloading();
        this.orderState = "NON-DELIVERY";
        // this.reqOrderList();
      },
      //运输中
      choseTransit(){
        this.toTransit();
        this.orderState = "TRANSPORT";
        // this.reqOrderList();
      },
      //待评价
      choseToEvaluate(){
        this.toEvaluate();
        this.orderState = "NON-RATE";
        // this.reqOrderList();
      },
      //已取消
      choseCancel(){
        this.toCancel();
        this.orderState = "CANCEL";
        // this.reqOrderList();
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
      height: 100%;
      .orderState{
        height: 90/50rem;
        background-color:#fff;
        width: 100%;
        z-index: 50;
        top: 89/50rem;
        left: 0;
        text-align: center;
        position:fixed;
        div{
          display: block;
          width: 125/50rem;
          line-height: 90/50rem;
          float: left;
        }
      }
      .orderList{
        width: 100%;
        position: absolute;
        top: 180/50rem;
      }
    }
  }
</style>
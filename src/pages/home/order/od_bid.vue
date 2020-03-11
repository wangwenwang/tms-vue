<template>
  <div class="od_bid">
    <header><i v-if='$store.state.userInfo.userType == "driver"' class="iconfont icon-xiangzuo1" @click="goprev"></i><span>我的订单</span></header>
    <div class="container">
      <div class="orderState">
        <div class="all" @click='choseAll'>全部</div>
        <div v-if='$store.state.userInfo.userType == "owner"' class="toSure" @click='choseToSure'>待确认</div>
        <div v-if='$store.state.userInfo.userType == "driver"'  class="toSure" @click='choseToSure'>竞价中</div>
        <div class="toloading" @click='choseToloading'>待装货</div>
        <div class="toTransit" @click='choseTransit'>运输中</div>
        <div class="toEvaluate" @click='choseToEvaluate'>已完成</div>
        <div class="cancel" @click='choseCancel'>取消</div>
      </div>
      <div class="orderList">
        <componentOrderItem :orderArr='orderArr' :orderState='orderState'></componentOrderItem>
      </div>

       <!-- 页面数据为空时 -->
      <div  class="NoData"  v-if="noDataShow"> 
        <div>
          <i  class="iconfont icon-meiyouwuliuxinxi"></i>
          <div>没有数据</div>
        </div>
      </div>
    </div>
    <FooterIndex v-if='$store.state.userInfo.userType == "owner"'/>
  </div>
</template>
<script type="text/javascript">
  import $ from 'jquery'
  import FooterIndex from '../../../components/footer.vue'
  import componentOrderItem from '@/components/componentOrderItem'
  export default{
    name:"od_bid",
    data(){
      return{
        orderState:'',//订单类型
        orderArr:[],//订单列表
        noDataShow:false,//没有数据
        whoPush:"",//push进来的界面
      }
    },
    components:{
      FooterIndex,
      componentOrderItem
    },
    created(){

      if(this.$store.state.userInfo.userType == "driver"){
        this.$nextTick(() => {
          $('.orderList').css('height','calc(100% - 3.6rem)')
        })
      }

      if(this.$route.query.orderstate){ 
        this.orderState = this.$route.query.orderstate;
      }
      
      this.$nextTick(() => {

        if(this.orderState == ""){
          this.choseAll();
        }else if(this.orderState == "NON-CONFIRM"){
          this.choseToSure();
        }else if(this.orderState == "NON-DELIVERY"){
          this.choseToloading();
        }else if(this.orderState == "TRANSPORT"){
          this.choseTransit();
        }else if(this.orderState == "NON-RATE"){
          this.choseToEvaluate();
        }else if(this.orderState == "CANCEL"){
          this.choseCancel();
        }
      })
      this.nowDate = this.getNowTime().substring(0,10);
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
      reqOrderList(){
        
        var that = this
        var postData = {
          "status":that.orderState,
        }
      
        // 获取门店信息
        that.httpRequest_ygy("queryStatusList.do",postData,function(res){
          that.orderArr = []
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
              if(that.orderState ==  ""){
                if(that.orderArr[i].status == 'NEW'){//待装货

                  that.orderArr[i].STATUS_color = '#89CE8B';
                  that.orderArr[i].STATUS_text = '新 建 ';

                }else if(that.orderArr[i].status == 'NON-CONFIRM'){//待确认 F28695

                  that.orderArr[i].STATUS_color = '#F28695';
                  that.orderArr[i].STATUS_text = '待确认';

                }else if(that.orderArr[i].status == 'NON-DELIVERY'){//待装货

                  that.orderArr[i].STATUS_color = '#83C1F2';
                  that.orderArr[i].STATUS_text = '待装货';

                }else if(that.orderArr[i].status == 'TRANSPORT'){//运输中

                  that.orderArr[i].STATUS_color = '#FACE51';
                  that.orderArr[i].STATUS_text = '运输中';

                }else if(that.orderArr[i].status == 'NON-RATE'||that.orderArr[i].status == 'HAS-EVAL'){//待评价

                  that.orderArr[i].STATUS_color = '#FE8B44';
                  that.orderArr[i].STATUS_text = '已完成';

                }else if(that.orderArr[i].status == 'CANCEL'){//已取消

                  that.orderArr[i].STATUS_color = '#999';
                  that.orderArr[i].STATUS_text = '已取消';
                  if(that.$store.state.userInfo.userType == "driver"){
                    that.orderArr[i].STATUS_text = '被取消';
                  }
                }
              }
              if(that.$store.state.userInfo.userType == "owner"){

                that.orderArr[i].distanceShow = false;
              }else{
                if(that.orderArr[i].status == 'NON-CONFIRM'|| that.orderArr[i].status == 'NON-DELIVERY'){

                  that.orderArr[i].distanceShow = true;
                  that.orderArr[i].distance = that.orderArr[i].distance/1000;
                  let tempVal = parseFloat(that.orderArr[i].distance).toFixed(2)
                  that.orderArr[i].distance = tempVal.substring(0, tempVal.length - 1)
                }else{
                  that.orderArr[i].distanceShow = false;
                }
              }
            }
          }else{
              that.noDataShow = true;
          }
        })
      },

       //全部
      choseAll(){
        $(".all").css({'border-bottom':'2px solid #5965D8','color':'#5965D8','font-size':'17px'})
        $(".toSure").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toloading").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toTransit").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toEvaluate").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".cancel").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        this.orderState = "";
        this.reqOrderList();
      }, 
      //待确认
      choseToSure(){
        $(".all").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toSure").css({'border-bottom':'2px solid #5965D8','color':'#5965D8','font-size':'17px'})
        $(".toloading").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toTransit").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toEvaluate").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".cancel").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        this.orderState = "NON-CONFIRM";
        this.reqOrderList();
      },
      //待装货
      choseToloading(){
        $(".all").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toSure").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toloading").css({'border-bottom':'2px solid #5965D8','color':'#5965D8','font-size':'17px'})
        $(".toTransit").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toEvaluate").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".cancel").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        this.orderState = "NON-DELIVERY";
        this.reqOrderList();
      },
      //运输中
      choseTransit(){
        $(".all").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toSure").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toloading").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toTransit").css({'border-bottom':'2px solid #5965D8','color':'#5965D8','font-size':'17px'})
        $(".toEvaluate").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".cancel").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        this.orderState = "TRANSPORT";
        this.reqOrderList();
      },
      //待评价
      choseToEvaluate(){
        $(".all").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toSure").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toloading").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toTransit").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toEvaluate").css({'border-bottom':'2px solid #5965D8','color':'#5965D8','font-size':'17px'})
        $(".cancel").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        this.orderState = "NON-RATE";
        this.reqOrderList();
      },
      //已取消
      choseCancel(){
        $(".all").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toSure").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toloading").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toTransit").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".toEvaluate").css({'border-bottom':'none','font-size':'14px','color':'#000'})
        $(".cancel").css({'border-bottom':'2px solid #5965D8','color':'#5965D8','font-size':'17px'})
        this.orderState = "CANCEL";
        this.reqOrderList();
      },


    }
  }
</script>
<style lang="less" scoped>
  .od_bid{
    overflow: hidden;
    height: 100%;
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
        overflow:scroll;
        width: 100%;
        height: calc(100% - 5.82rem);
        margin-top: 90/50rem;
      }
    }
  }
</style>
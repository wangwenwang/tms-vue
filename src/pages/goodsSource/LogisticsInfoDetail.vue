<template>
  <div class='LogisticsInfoDetail'>
  	<!-- <componentHeader :headerText="headerText" :IfFanhuiShow='true' @f_Fanhui='f_Fanhui'></componentHeader> -->
    <header><i class="iconfont icon-xiangzuo1"  @click="goPrev" ></i><span>物流信息详情</span></header>
  	<div class="container haveHeadcontainer">
  	  <div class='orderInfo'>
        <div class="infoContainer">
          <div>配载单号：<span>{{data.shippingNo}}</span></div>
          <div>出库时间：<span>{{data.deptTime}}</span><span v-if='!data.deptTime'>暂无设置</span></div>
          <div>发运时间：<span>{{data.shipTime}}</span><span v-if='!data.shipTime'>暂无设置</span></div>
          <div>承运商名：<span>{{data.transporterName}}</span><span v-if='!data.transporterName'>暂无设置</span></div>
          <div>司机车牌：<span>{{data.vehicleCode}}</span><span v-if='!data.vehicleCode'>暂无设置</span></div>
          <div>司机姓名：<span>{{data.driverName}}</span></div>
          <div>司机电话：<span>{{data.driverPhone}}</span></div>
        </div>
      </div>
  	</div>
  </div>
</template>
<script type="text/javascript">
  export default{
  	data(){
  	  return{
        data:{},
        sourceDetail:[],//货源详情
        orderState:'',//订单状态
  	  }
  	},
  	components:{
	  },
    mounted(){

      window.history.pushState(null, null, document.URL)
      window.addEventListener("popstate", this.onBrowserBack, false)
    },
    destroyed() {

      window.removeEventListener("popstate", this.onBrowserBack, false)
    },
  	created(){

      var that = this;

      if(this.$route.query.whoPush){
        this.whoPush = this.$route.query.whoPush;
      }
      if(this.$route.query.orderstate){
        this.orderState = this.$route.query.orderstate;
        console.log(this.orderstate)
      }
      if(this.$route.query.sourceInfo){
        this.sourceInfo = this.$route.query.sourceInfo;
      }
      var that = this;
      var postData = {
        "sourceNo":that.sourceInfo.sourceNo,
      }
      that.httpRequest_ygy("GetTMSOrderInfo.do",postData,function(res){

        that.data = res.data[0];
      })
  	},
  	methods:{
       // 监听系统返回键
      onBrowserBack() {
        
        this.goPrev()
      },
      // 返回上一页
      goPrev(){
        this.$router.push({
          name:"sourceDetail",
          query:{
            sourceInfo:this.sourceInfo,
            whoPush:this.whoPush,
            orderState:this.orderState
          }
        })
      },
  	}
  }
</script>
<style lang="less" scoped>
  @import "../../components/publicLess.less";
  .LogisticsInfoDetail{
    width:100%;
    height:100%;
    padding:16/50rem;
    box-sizing: border-box;
    background-color: @GrayBackground;
    overflow-x: hidden;
    .orderInfo{
      padding:10/50rem;
      .infoContainer{
        line-height: 60/50rem;
        span{
          color: red;
          &:nth-child(2){
            color: #999;
          }
        }
      }
    }
  }
</style>
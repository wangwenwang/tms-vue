
<template>
  <div class="carSourceList">
    <header><i class="iconfont icon-xiangzuo1"></i><span>车源列表</span></header>
    <div class="container">
      <div class="dataItem" v-for='(dataItem,index) in carSourceListdata' :id="index"  :key='index'   >
        <div class="one">
          <span>{{dataItem.carrierCity}} </span><span> {{dataItem.carrierAddress3}}</span>
          <span> → </span>
          <span>{{dataItem.c_city}} </span><span> {{dataItem.c_address3}}</span>
          <span class="publishTime">{{dataItem.publishTime}}</span>
        </div>
       
        <div class="two">
          <div class="line">
	    	<div class="loadingTime" v-if='dataItem.loadingTime'> 出发日期： {{dataItem.loadingTime}}</div>
	        <div class="distance">距离约<span>{{dataItem.distance}}</span>km</div>
          </div>
          <div class="line">
	        <div class="left">
			  <span v-if='dataItem.vehicleType'>{{dataItem.vehicleType}}&nbsp;</span>
			  <span v-if='dataItem.vehicleLoad'>载重：{{dataItem.vehicleLoad}}吨&nbsp;&nbsp;</span>
			  <span v-if='dataItem.vehicleVolume'>体积：{{dataItem.vehicleVolume}}方&nbsp;</span>
	        </div>
	        <div class="call">
	          <i v-if='dataItem.driverPhone' @click="callPhone(dataItem.driverPhone)" 
	          class="iconfont icon-dianhua-copy"> </i>
	        </div>
          </div>
        </div>
      </div>
      <!-- 页面数据为空时           -->
      <div  class="NoData"  v-if="noDataShow">
        <div>
          <i  class="iconfont icon-meiyouwuliuxinxi"></i>
          <div>没有数据</div>
        </div>
      </div>
    </div>
    <FooterIndex/>
  </div>
</template>
<script type="text/javascript">
  import componentOrderItem from '@/components/componentOrderItem'
  import FooterIndex from "../../components/footer"
  import $ from 'jquery'
  export default{
    name:"od_bid",
    data(){
      return{
        noDataShow:false,//没有数据
        orderState:'',//订单类型
        orderArr:[],//订单列表
        carSourceListdata:[],
        startCity:'',//起点城市 
        startDistrict:'',//起点区 
        endCity:'',//终点城市 
        endDistrict:'',//终点区 
        longitude:"114.046",//经度
    	latitude:"22.628571",//纬度
      }
    },
    components:{
      FooterIndex,
      componentOrderItem
    },
    created(){
      
      // this.$nextTick(() => {
      //   if(this.orderState == ""){
      //     this.choseAll();
      //   }
      // })
      this.nowDate = this.getNowTime().substring(0,10);
      var that = this;
	  var postData = {
        "lon":that.longitude,//经度
        "lat":that.latitude,//纬度
        "carrierCity":that.startCity,//起点城市
        "carrierAddress3":that.startDistrict,//起点区
        "c_city":that.endCity,//终点城市
        "c_address3":that.endDistrict,//终点区
	  }
      // 获取发布车源信息
      that.httpRequest_ygy("queryVehicles.do",postData,function(PublishRes){

          if(PublishRes.data.length){

            that.carSourceListdata = PublishRes.data;
            that.noDataShow = false;

            for( var i=0; i<that.carSourceListdata.length; i++){

              if(that.carSourceListdata[i].publishTime.substring(0,10) == that.nowDate){
                
                that.carSourceListdata[i].publishTime = that.carSourceListdata[i].publishTime.substring(11,16);
              }else{
                that.carSourceListdata[i].publishTime = that.carSourceListdata[i].publishTime.substring(5,10);
              }
              that.carSourceListdata[i].loadingTime = that.carSourceListdata[i].loadingTime.substring(0,10);

              that.carSourceListdata[i].distance = that.carSourceListdata[i].distance/1000;
              let tempVal = parseFloat(that.carSourceListdata[i].distance).toFixed(2)
              that.carSourceListdata[i].distance = tempVal.substring(0, tempVal.length - 1)
            }
          }else{
            that.noDataShow = true;
          }
      });
    },
    methods:{
      reqOrderList(){
        var that = this
        var postData = {
          "status":that.orderState,
        }
        // 获取门店信息
        that.httpRequest_ygy("queryDriverInfo.do",postData,function(res){
          that.carSourceListdata = []
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
              console.log(that.orderArr[i].distance)
            }
          }else{
              that.noDataShow = true;
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  .carSourceList{
    overflow: hidden;
    height: 100%;
    background-color: #E5E8FA;
    .container{
      .dataItem{
        margin: 20/50rem;
        margin-top: 60/50rem;
        padding:30/50rem 15/50rem 30/50rem 15/50rem;
        height: 180/50rem;
        background-color: #fff;
        border: 1/50rem solid  #ddd;
        border-radius: 15/50rem;
        div{ line-height: 50/50rem; }
        .one{ 
          font-size: 30/50rem;
          font-weight: 550;
          padding-bottom: 10/50rem;
          .publishTime{
            font-size: 22/50rem;
            padding-top: 3/50rem;
            color: #999;
            float: right;
          }
        }

        .line{
          display: flex;
   		  justify-content: space-between;
        }
        .distance{
          font-size: 24/50rem;
          color: #999;
          span{
          	font-size:28/50rem;
          }
        }
        .left{
          width: 602/50rem;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .call{
          width: 50/50rem;
          height: 50/50rem;
          line-height: 50/50rem;
          border: 1/50rem solid #5965D8;
          color: #5965D8;
          border-radius: 50%;
          text-align: center;
          font-size: 30/50rem;
        }
      }
    }
  }
</style>
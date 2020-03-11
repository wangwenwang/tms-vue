<template>
  <div class="car_publish_list">
    <header><i class="iconfont icon-xiangzuo1"   @click="goprev"></i><span>我的发布</span></header>
    <div class="container">
      <div class="v-for-" v-for='(dataItem,index) in data' :id="index"  :key='index'   >
        <div class="one">
          <span>{{dataItem.carrierCity}} </span><span> {{dataItem.carrierAddress3}}</span>
          <span> → </span>
          <span>{{dataItem.c_city}} </span><span> {{dataItem.c_address3}}</span>
          <span class="publishTime">{{dataItem.publishTime}}</span>
        </div>
        <div>车源单号： {{dataItem.sourceNo}}</div>
        <span v-if='dataItem.loadingTime'> 出发日期： {{dataItem.loadingTime}}</span>
        <div class="two">
          <div class="left">
          <span v-if='dataItem.vehicleType'>{{dataItem.vehicleType}}&nbsp;</span>
          <span v-if='dataItem.vehicleLoad'>载重：{{dataItem.vehicleLoad}}吨&nbsp;&nbsp;</span>
          <span v-if='dataItem.vehicleVolume'>体积：{{dataItem.vehicleVolume}}方&nbsp;</span>
          </div>
        </div>
      </div>

      <div class="create-car-publish" @click="create_car_publish()">新建车源</div>

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
        noDataShow:false,//没有数据
        orderState:'',//订单类型
        orderArr:[],//订单列表
        data:[],
      }
    },
    components:{
      componentOrderItem
    },
    created(){

      this.nowDate = this.getNowTime().substring(0,10);
      var that = this;

      // 获取发布车源信息
      that.httpRequest_ygy("queryVehicleSource.do", "", function(PublishRes){

        if(PublishRes.data.length){

          that.data = PublishRes.data;
          that.noDataShow = false;

          for( var i=0; i<that.data.length; i++){

            if(that.data[i].publishTime.substring(0,10) == that.nowDate){
              
              that.data[i].publishTime = that.data[i].publishTime.substring(11,16);
            }else{
              that.data[i].publishTime = that.data[i].publishTime.substring(5,10);
            }
            that.data[i].loadingTime = that.data[i].loadingTime.substring(0,10);
          }
        }else{
          that.noDataShow = true;
        }
      });
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
      create_car_publish(){

        this.$router.push("car_publish_list")
      },
      reqOrderList(){
        var that = this
        var postData = {
          "status":that.orderState,
        }
        // 获取门店信息
        that.httpRequest_ygy("queryVehicleSource.do",postData,function(res){
          that.data = []
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
    }
  }
</script>
<style lang="less" scoped>
  .car_publish_list{
    overflow: hidden;
    height: 100%;
    background-color: #E5E8FA;
    .container{
      height: 100%;
      .v-for-{
        margin: 20/50rem;
        margin-top: 60/50rem;
        padding:30/50rem 15/50rem 50/50rem 15/50rem;
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
        .two{
          .left{
            width: 602/50rem;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            float: left;
          }
          .distance{
            font-size: 24/50rem;
            color: #999;
            float: right;
          }
        }
      }
      .create-car-publish{
        width: 140/50rem;
        height: 70/50rem;
        background-color: #5965D8;
        position: absolute;
        bottom: 80/50rem;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 8/50rem;
        line-height: 70/50rem;
        text-align: center;
      }
    }
  }
</style>
<template>
  <div class="sourceDetail">
    <header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>货源详情</span></header>
    <div class="container">
      <div class="sourceInfo"  >
        <div class="routeInfo">
          <div class="route">
            <span>{{carrierCity}} </span><span> {{carrierAddress3}}</span>
            <span> → </span>
            <span>{{c_city}} </span><span> {{c_address3}}</span>
          </div>
          <div class="distance">最短里程约{{distance}}km</div>
        </div>
        <div class="carInfo">
          <div class="title">车货信息</div>
          <div><span>车辆</span><span>整车 12/13.5/17米 平板</span></div><!-- {}} {{}} {{}} -->
          <div><span>货物</span><span>建材, 5吨</span></div><!-- {{}}，{{}} -->
          <div><span>特殊要求</span><span>{{remark}}</span></div>
        </div>
      </div>

      <div class="handlingInfo">
        <div class="title"><span>装卸信息</span><span>一装一卸</span><span>距装货地70.4km</span></div>
        <div><i class="iconfont icon-xiangzuo1"></i><span>今天 全天00：00-24：00可装</span></div><!-- {}} {{}} {{-->
        <div><i class="iconfont icon-xiangzuo1"></i><span>宏润工业园</span></div><!-- {{}}，{{}} -->
        <div><i class="iconfont icon-xiangzuo1"></i><span>市话大厦</span></div>
      </div>
    </div>


      <!-- 页面数据为空时 -->
      <div   v-if="is_NoData"   class="NoData" >
        <div>
          <i  class="iconfont icon-meiyouwuliuxinxi" ></i>
          <div>{{is_NoData_text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default{
    name:"sourceDetail",
    data(){
      return{
        is_NoData:false,
        is_NoData_text:"没有任务",
        sourceData:[],//货源详情
        carrierCity:"深圳",//起点城市
        carrierAddress3:"宝安",//起点区域
        c_city:"广州",//终点城市
        c_address3:"白云",//终点区域
        distance:"137.5",//运距
        remark:"好装好卸,两个活动房！不怕雨,不用雨布,晚上卸货,明天装也行,其他(定金请优先通过平台支付)",//特殊要求
      }
    },
    created(){

      var that = this;

      var postData = {
          cellphone: that.$store.state.userInfo.cellphone,//手机号   15013418360
        };

      // this.httpRequest("queryTrajectoryData.do",postData,function(res){

      //   that.TrackListData = res.data;

      //   if(!res.data.length){

      //     that.is_NoData_text = "没有结果"

      //     that.is_NoData = true;
      //   }


      // })

    },
    methods:{
      // 返回上一页
      goPrev(){

        this.$router.push({
          name:"goodsSource",
          query:{
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .sourceDetail{
    overflow: hidden;
    // padding: 20/50rem;
    .container{
      overflow: hidden;
      .sourceInfo{

        .routeInfo{
        padding: 10/50rem  20/50rem;
        box-sizing: border-box;
        border-bottom: 15/50rem solid #F4F4F4;
          .route{
            font-size: 35/50rem;
            font-weight: 550;
            line-height: 80/50rem;
          }
        }

        .carInfo{
          .title{
            font-size: 30/50rem;
            font-weight: 600;
            line-height: 80/50rem;
          }
          &div{
            &span.first-child{
              color: red;
              width: 200/50rem;
            }
          }

        }
        // padding: 20/50rem;
       
       
      }
    }
  }
  @media screen and (max-width: 374px){

    .sourceDetail{
      .container{
        .TrackList{
          border-bottom: 3/50rem solid #777;
        }
      }
    }
  }
</style>
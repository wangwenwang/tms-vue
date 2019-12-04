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
      

        <div class="handlingInfo">
          <div class="title"><span>装卸信息</span><span>一装一卸</span><span>距装货地70.4km</span></div>
          <div  class="date"><i class="iconfont icon-yidongduanicon-"></i><span>今天 全天00：00-24：00可装</span></div><!-- {}} {{}} {{-->
          <div class="address1"><span class="i">装</span><span>宏润工业园</span></div><!-- {{}}，{{}} -->
          <div class="address2"><span class="i">卸</span><span>市话大厦</span></div>
        </div>

        <div class="driverInfo">
          <div class="userImage"><img  class="userinfo-avatar"  alt=""></div>
          <div class="rightContent">
            <div class="one">
              <span> 老王</span>
              <span class="todriverInfo">查看资料></span>
            </div>
            <div class="two">
              <span>交易999  </span>
              <span>发货数1234 </span>
            </div>
            <div class="three">
              <span>深圳市凯东源现代物流股份有限公司</span>
            </div>
          </div>
        </div>

        <div class="btnList">
          <div class="call"><i class="iconfont icon-dianhua"></i>电话联系</div>
          <div class="biddingPrice" v-if="orderstate"><i class="iconfont icon-xuanzhong"></i>确 认</div>
          <div class="biddingPrice" v-if="ordertype" @click="DialogVisible = true">
            <i class="iconfont icon-jingjia"></i>竞 价
          </div>
          <el-dialog title="竞 价" :visible.sync="DialogVisible"  width="80%" top="50%" center>
            <span>请输入承运费用：</span>
            <el-input v-model="shipmentMoney" auto-complete="off"></el-input>
            <span slot="footer" class="dialog-footer">
              <el-button @click="DialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="DialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
<!-- 
          <el-button type="text" @click="centerDialogVisible = true">确 认</el-button>
          <el-button type="text" @click="centerDialogVisible = true">确 认</el-button> -->
        </div>



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
        orderstate:'',
        ordertype:'asded',
        DialogVisible:false,
        shipmentMoney:'',

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
        border-bottom: 15/50rem solid #F4F4F4;
          .route{
            font-size: 35/50rem;
            font-weight: 550;
            line-height: 80/50rem;
          }
        }

        .carInfo{
          padding: 5/50rem  20/50rem  25/50rem 20/50rem;
          border-bottom: 15/50rem solid #F4F4F4;
          .title{
            font-weight: 600;
            line-height: 65/50rem;
          }
          &>div{
            line-height: 50/50rem;
            span:first-child{
              color: #999;
              width: 20%;
            }
            span:nth-child(2){
              display: block;
              width: 80%;
              float: right;
            }
          }
          div:nth-child(4){
            padding-bottom: 50/50rem;
            span:nth-child(2){
              display: block;
              line-height: 40/50rem;
            }
          }
        }

        .handlingInfo{
          padding: 5/50rem  20/50rem  25/50rem 20/50rem;
          border-bottom: 15/50rem solid #F4F4F4;
          .title{
            font-weight: 600;
            line-height: 65/50rem;
            span:nth-child(2){
              width: 150/50rem;
              padding-left: 20/50rem;
              font-size: 25/50rem;
              font-weight: 500;
              color: #999;
            }
            span:nth-child(3){
              font-size: 27/50rem;
              font-weight: 500;
              position: absolute;
              right: 20/50rem;
            }
          }
          .date{ 
              color: #999;
              span{
                font-size: 25/50rem;
              }
          }
          .address1{
            .i{
              width: 10/50rem;
              height: 10/50rem;
              font-size: 14/50rem;
              border: 1/50rem solid  #FACE51;
              border-radius: 20%;
              padding: 3/50rem;
              background-color: #FACE51;
            }
            span{
              font-size:30/50rem;
              line-height: 60/50rem;
            }
          }
          .address2{
            .i{
              width: 10/50rem;
              height: 10/50rem;
              font-size: 14/50rem;
              border: 1/50rem solid  #FD757F;
              border-radius: 20%;
              padding: 3/50rem;
              background-color: #FD757F;
            }
            span{
              font-size:30/50rem;
              line-height: 60/50rem;
            }
          }
          &>div{
            line-height: 50/50rem;
            span:nth-child(2){
              padding-left: 15/50rem;
            }

            .address{
              font-weight: 550;
              line-height: 60/50rem;
            }
          }
        }

        .driverInfo{
          height: 180/50rem;
          padding: 5/50rem  40/50rem  25/50rem 20/50rem;
          // padding: 5/50rem  20/50rem  25/50rem 20/50rem;
          border-bottom: 15/50rem solid #F4F4F4;
          .userImage{
            width: 80/50rem;
            // height: 150/50rem;
            float: left;
            margin-right: 10/50rem;
          }
          .rightContent{
            padding-left: 80/50rem;
            .one{ 
              font-size: 30/50rem;
              font-weight:600;
              line-height: 65/50rem;
              .todriverInfo{
                font-size: 22/50rem;
                padding-top: 8/50rem;
                color: #999;
                float: right;
              }
            }
            .two{
              float: left;
              color: #999;
              font-size: 26/50rem;
              line-height: 65/50rem;
            }
            .three{
              float: left;
              color: #999;
              font-weight: 550;
              font-size: 26/50rem;
              line-height: 65/50rem;
            }
          }
        }

        .btnList{
          padding: 20/50rem  120/50rem  25/50rem 120/50rem;
          text-align: center;

          .call{
            i{
              color: #5965D8;
              padding-right: 10/50rem;
            }
            float: left;
            width: 200/50rem;
            line-height: 80/50rem;
            border-radius: 8%;
            background-color:#C4CAEF ;
          }
          .biddingPrice{
            i{
              color: #5965D8;
              padding-right: 10/50rem;
              font-size: 30/50rem;
            }
            float:right;
            width: 200/50rem;
            line-height: 80/50rem;
            border-radius: 8%;
            background-color: #C4CAEF;
          }
        }
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
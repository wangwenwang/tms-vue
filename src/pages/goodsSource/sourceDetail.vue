<template>
  <div class="sourceDetail">
    <header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>货源详情</span></header>
    <div class="container">

      <div class="sourceInfo" >
        <div class="routeInfo">
          <div class="route">
            <span>{{sourceInfo.carrierCity}} </span><span> {{sourceInfo.carrierAddress3}}</span>
            <span> → </span>
            <span>{{sourceInfo.c_city}} </span><span> {{sourceInfo.c_address3}}</span>
          </div>
          <div class="distance">最短里程约{{sourceInfo.mileage}}km</div>
        </div>
        <div class="carInfo">
          <div class="title">车货信息</div>
          <div><span>车辆</span><span>{{sourceInfo.vehicleType}}</span></div>
          <div><span>货物</span>
              <span>{{sourceInfo.productName}},</span> 
              <span v-if='!sourceInfo.weight'>{{sourceInfo.min_weight}}~{{sourceInfo.max_weight}}吨&nbsp;</span>
              <span v-if='sourceInfo.weight'>{{sourceInfo.max_weight}}吨&nbsp;</span>
              <span v-if='!sourceInfo.volume'>{{sourceInfo.min_volume}}~{{sourceInfo.max_volume}}方&nbsp;</span>
              <span v-if='sourceInfo.volume'>{{sourceInfo.max_volume}}方&nbsp;</span></div>
          <div class="mark">
            <span>特殊要求</span>
            <span class="markInfo" >{{sourceInfo.mark}}</span>
          </div>
        </div>
      
        <div class="handlingInfo">
          <div class="title"><span>装卸信息</span><span>{{sourceInfo.loadUnloadType}}</span><span>距装货地{{sourceInfo.distance}}km</span></div>
          <div class="date"><i class="iconfont icon-yidongduanicon-"></i><span>{{sourceInfo.loadingTime}} 全天00：00-24：00可装</span>
          </div><!-- {}} {{}} {{-->
          <div v-for='(dataItem,index) in AddressData' :id="index"  :key='index'>
          <div class="address1"><span class="i">装</span><span>{{dataItem.carrierCity}} {{dataItem.carrierAddress3}}</span></div><!-- {{}}，{{}} -->
          <div class="address2"><span class="i">卸</span><span>{{dataItem.c_city}} {{dataItem.c_address3}}</span></div>
          </div>
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

        <div class="price">
          <span v-if="sourceInfo.expectedCost">当前报价：</span>
          <span v-if="shipmentMoney">我的竞价：</span>
          <span v-if="sourceInfo.expectedCost">￥{{sourceInfo.expectedCost}}</span>
          <span v-if="!is_None" class="none">暂无报价</span>
          <span v-if="shipmentMoney">￥{{shipmentMoney}}</span>
        </div>


        <div class="btnList">
          <div class="call"  @click="callPhone(ownerPhone)"><i class="iconfont icon-dianhua"></i>电话联系</div>
          <div class="biddingPrice" v-if="sourceInfo.expectedCost"><i class="iconfont icon-xuanzhong" @click="Submit()"></i>确 认</div>
          <div class="biddingPrice" v-if="!sourceInfo.expectedCost"  @click="DialogVisible = true">
            <i class="iconfont icon-jingjia"></i>竞 价
          </div>
          <el-dialog title="竞 价" :visible.sync="DialogVisible"  width="80%" top="50%" center>
            <span>请输入承运费用：</span>
            <el-input v-model="shipmentMoney" auto-complete="off"></el-input>
            <span slot="footer" class="dialog-footer">
              <el-button @click="DialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="Confirm()">确 定</el-button>
            </span>
          </el-dialog>
         <!--  <div class="biddingPrice" v-if="sourceInfo.shipPrice" style="background-color: #ddd; color: #6D6D6D"><i class="iconfont icon-xuanzhong" </i>已承接</div> -->
      <!--<el-button type="text" @click="centerDialogVisible = true">确 认</el-button>
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
    <div v-if="ifTips" class="msg_tips">
        <div class="tips_content">
          <i class="iconfont icon-chenggong1"></i>
          <p>{{tips_Msg}}</p>
        </div>
      </div>
  </div>
<!-- </div> -->
</template>
<script type="text/javascript">
  export default{
    name:"sourceDetail",
    data(){
      return{
        is_NoData:false,
        ifTips:false,//提示信息是否显示
        is_None:false,//暂无报价

        is_NoData_text:"没有信息",
        orderstate:'',
        ordertype:'asded',
        DialogVisible:false,
        shipmentMoney:'',
        ownerPhone:'',//货主电话
        sourceInfo:{},
        AddressData:[],//装卸点详情

      }
    },
    created(){

      if(this.$route.query.sourceInfo){

        this.sourceInfo = this.$route.query.sourceInfo;//货源详情
      }
      if(this.sourceInfo.expectedCost){

        this.is_None = false;
      }else{
        this.is_None =true;
      }
      if(this.shipmentMoney){

        this.is_None = false;
      }else{
        this.is_None =true;
      }

      var that = this;

      var postData = {
          sourceNo: that.sourceInfo.sourceNo,//货源单号
        };
      //查询装卸点
      that.httpRequest_ygy("queryStartEndAddress.do",postData,function(res){

        that.AddressData = res.data;

      //   if(!res.data.length){

      //     that.is_NoData_text = "没有结果"

      //     that.is_NoData = true;
      //   }
      })
      if(!that.sourceInfo.expectedCost){
          //查询司机竞价
          that.httpRequest_ygy("queryCompPrice.do",postData,function(res){

            that.shipmentMoney = res.data.compPrice;
          })
        }
    },
    methods:{
      //司机确认按钮
      Submit(){
        var that = this;
        var postData = {
            sourceNo: that.sourceInfo.sourceNo,//货源单号
            expectedCost:that.sourceInfo.expectedCost,//货主报价
          };
        //查询装卸点
        that.httpRequest_ygy("confirmDriver.do",postData,function(res){
          if(res.status == 1){
              that.ifTips = true;
              that.tips_Msg = "确认成功";
              setTimeout(function(){
                //竞价成功后刷新当前页面
                that.$router.push({
                    name:"goodsSource",
                  })
                },2000)
            }else{
              that.$alert('确认失败', '提示', {
                confirmButtonText: '确定',
              })
             }
        })

      },

      //竞价确定
      Confirm(){
        if(this.shipmentMoney){

          var that = this;
          var postData = {
              // appUserId:that.$store.state.userInfo.user_id,//司机ID
              sourceNo: that.sourceInfo.sourceNo,//货源单号
              compPrice: that.shipmentMoney,//竞价
            };
          this.httpRequest_ygy("driverBidding.do",postData,function(res){
            if(res.status == 1){
              that.ifTips = true;
              that.tips_Msg = "竞价成功";
              setTimeout(function(){
                //竞价成功后刷新当前页面
                that.$router.push({
                    name:"goodsSource",
                  })
                },2000)
              // that.$store.state.StoreInfo = {};
            }else{
              that.$alert('竞价失败', '提示', {
                confirmButtonText: '确定',
              })
             }
          })
        }
        this.DialogVisible = false;
      },
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
          padding: 5/50rem  20/50rem  10/50rem 20/50rem;
          border-bottom: 15/50rem solid #F4F4F4;
          .title{
            font-weight: 600;
            line-height: 65/50rem;
          }
          &>div{
            line-height: 50/50rem;
            span:first-child{
              color: #999;
              min-width: 20%;
              float: left;
            }
          }
          .mark{
            .markInfo{
              padding-top: 8/50rem;
              display: flex;
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

        .price{
          padding: 10/50rem  20/50rem  ;
          border-bottom: 15/50rem solid #F4F4F4;
          line-height: 50/50rem;
          .none{
            color: #999;
            font-weight: 550;
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
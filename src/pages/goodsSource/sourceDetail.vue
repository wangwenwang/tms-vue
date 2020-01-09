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
              <span v-if='sourceInfo.volume'>{{sourceInfo.max_volume}}方&nbsp;</span>
          </div>
          <div>
            <span>特殊要求</span>
            <span class="markInfo">{{sourceInfo.mark}}</span>
          </div>
        </div>
      
        <div class="handlingInfo">
          <div class="title"><span>装卸信息</span><span>{{sourceInfo.loadUnloadType}}</span>
            <span>距装货地{{sourceInfo.distance}}km</span>
          </div>
          <div class="date"><i class="iconfont icon-yidongduanicon-"></i>
            <span>{{sourceInfo.loadingTime}} 全天00：00-24：00可装</span>
          </div>
          <div v-for='(dataItem,index) in AddressData' :id="index"  :key='index'> 
          <div class="address1"><span class="i">装</span><span>{{dataItem.carrierCity}} {{dataItem.carrierAddress3}}</span></div>
          <div class="address2"><span class="i">卸</span><span>{{dataItem.c_city}} {{dataItem.c_address3}}</span></div>
          </div>
        </div>

        <div v-if='($store.state.userInfo.userType == "driver") || ($store.state.userInfo.userType == "owner" && driver_shipDriverID != "")'  class="driverInfo">
          <div class="userImage"><img src="../../assets/images/defaultHead.png" class="userinfo-avatar"  alt=""></div>
          <div class="rightContent">
            <div class="one">
              <span>{{ owner_or_driver_userName }}</span>
              <span class="todriverInfo">查看资料></span>
            </div>
            <div class="two">
              <span>交易999  </span>
              <span v-if='$store.state.userInfo.userType == "driver"'>发货数1234 </span>
              <span v-if='$store.state.userInfo.userType == "owner"'>接单数1234 </span>
            </div>
            <div class="three">
              <span>深圳市凯东源现代物流股份有限公司</span>
            </div>
          </div>
        </div>

        <div v-if='$store.state.userInfo.userType == "owner" && driver_shipDriverID == ""' class="bid_info">
          <div class="title">竞价信息</div>
          <div v-for='(item, index) in bid_list'  :id="index"  :key='index' class="v-f-bid">
            <div>{{ item.compPrice }}</div>
            <div>{{ item.userName }}</div>
            <div class="call"><i v-if='item.cellphone' @click="callPhone(item.cellphone)" class="iconfont icon-dianhua-copy"></i></div>
            <div @click="confirmDriver_click(index, item.compPrice)">确认</div>
          </div>
        </div>

        <div v-if='$store.state.userInfo.userType == "driver"' class="price">
          <span v-if="!shipmentMoney">当前报价：</span>
          <span v-if="shipmentMoney">我的竞价：</span>
          <span v-if="sourceInfo.expectedCost">￥{{sourceInfo.expectedCost}}</span>
          <span v-if="shipmentMoney == '' && sourceInfo.expectedCost == ''" class="none">暂无报价</span>
          <span v-if="shipmentMoney">￥{{shipmentMoney}}</span>
        </div>

        <div v-if='$store.state.userInfo.userType == "driver"' class="btnList">
          <div class="call"  @click="callPhone(ownerPhone)"><i class="iconfont icon-dianhua"></i>电话联系</div>
          <div class="biddingPrice" v-if="sourceInfo.expectedCost"><i class="iconfont icon-xuanzhong" @click="Submit()"></i>确 认</div>
          <div class="biddingPrice" v-if="!sourceInfo.expectedCost"  @click="DialogVisible = true">
            <i class="iconfont icon-jingjia"></i>竞 价
          </div>
          <el-dialog title="竞 价" :visible.sync="DialogVisible"  width="80%" top="50%" center>
            <span>请输入承运费用：</span>
            <el-input v-model="v_shipmentMoney" auto-complete="off"></el-input>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel()">取 消</el-button>
              <el-button type="primary" @click="Confirm()">确 定</el-button>
            </span>
          </el-dialog>
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
</template>
<script type="text/javascript">
  export default{
    name:"sourceDetail",
    data(){
      return{
        is_NoData:false,
        ifTips:false,      //提示信息是否显示
        is_NoData_text:"没有信息",
        orderstate:'',
        ordertype:'asded',
        DialogVisible:false,
        v_shipmentMoney:'',//司机竞价
        shipmentMoney:'',  //司机竞价，服务器返回值
        ownerPhone:'',     //货主电话
        sourceInfo:{},
        AddressData:[],    //装卸点详情
        whoPush:"",
        bid_list:[],       //竞价列表
        owner_or_driver_userName:"",//货主/承运司机名称
        driver_shipDriverID:" ",//承运司机id
      }
    },
    created(){

      if(this.$route.query.sourceInfo){

        this.sourceInfo = this.$route.query.sourceInfo;//货源详情
      }
      if(this.$route.query.whoPush){

        this.whoPush = this.$route.query.whoPush;//货源详情
      }
      if(this.$route.query.orderState){

        this.orderstate = this.$route.query.orderState;//订单类型
      }

      var that = this;

      var postData = {
          sourceNo: that.sourceInfo.sourceNo,//货源单号
        };
      //查询装卸点
      that.httpRequest_ygy("queryStartEndAddress.do",postData,function(res){

        that.AddressData = res.data;

        if(that.AddressData.length > 0){

          that.driver_shipDriverID = that.AddressData[0].shipDriverID
          that.owner_or_driver_userName = that.AddressData[0].userName
        }
        // 此货源未被承接，请求货主信息
        if(that.owner_or_driver_userName == "" && that.$store.state.userInfo.userType == "driver"){
          
          var postData = {
            sourceNo: that.sourceInfo.sourceNo,
          }
          that.httpRequest_ygy("queryInfo.do",postData,function(res){
            that.owner_or_driver_userName = res.data.userName
            that.ownerPhone = res.data.cellPhone
          })
        }
      })
      if(!that.sourceInfo.expectedCost){
        //查询司机竞价
        that.httpRequest_ygy("queryCompPrice.do",postData,function(res){

          if(res.data){

            that.shipmentMoney = res.data.compPrice;
          }
        })
      }
      if(that.$store.state.userInfo.userType == "owner"){

        var postData = {
          sourceNo: that.sourceInfo.sourceNo,
        }
        that.httpRequest_ygy("queryDriverPrice.do",postData,function(res){

          that.bid_list = res.data
        })
      }
    },
    methods:{
      // 竞价时，货主确认司机
      confirmDriver_click(index, price){

        var that = this;

        var postData = {
          sourceNo: that.sourceInfo.sourceNo,//货源单号
          shipDriverId: that.bid_list[index].appUsersId,//司机id
          expectedCost: price,//司机竞价
        }
        that.httpRequest_ygy("confirmDriver.do",postData,function(res){

          if(res.status == 1){

            that.ifTips = true;
            that.tips_Msg = "确认成功";

            setTimeout(function(){
              // 竞价成功后，跳转到待装货
              that.$router.push({
                name:"od_bid",
              })
            },2000)
          }else{

            that.$alert('确认失败', '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },
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
        if(this.v_shipmentMoney){

          var that = this;
          var postData = {
              sourceNo: that.sourceInfo.sourceNo,//货源单号
              compPrice: that.v_shipmentMoney,//竞价
            };
          this.httpRequest_ygy("driverBidding.do",postData,function(res){
            if(res.status == 1){
              that.shipmentMoney = that.v_shipmentMoney
              that.ifTips = true;
              that.tips_Msg = "竞价成功";
              setTimeout(function(){
                //竞价成功后刷新当前页面
                that.$router.push({
                    name:"goodsSource",
                  })
                },2000)
            }else{
              that.$alert('竞价失败', '提示', {
                confirmButtonText: '确定',
              })
            }
          })
        }
        this.DialogVisible = false;
      },
      // 取消竞价
      cancel(){

        this.v_shipmentMoney = ""
        this.DialogVisible = false;
      },
      // 返回上一页
      goPrev(){

        this.$router.push({
          name:this.whoPush,
          query:{
            orderstate:this.orderstate
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .sourceDetail{
    overflow: hidden;
    height: 100%;
    .container{
      overflow: hidden;
       height: 100%;
      .sourceInfo{
        height: calc(100% - 1.8rem);
        overflow: scroll;
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
          overflow: hidden;
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
            .markInfo{
              padding-top: 5/50rem;
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
             position: relative;
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
              right: 0;
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
              font-size: 26/50rem;
              border: 1/50rem solid  #FACE51;
              border-radius: 8/50rem;
              padding: 8/50rem;
              background-color: #FACE51;
            }
            span{
              font-size:30/50rem;
              line-height: 60/50rem;
            }
          }
          .address2{
            .i{
              font-size: 26/50rem;
              border: 1/50rem solid  #FD757F;
              border-radius: 8/50rem;
              padding: 8/50rem;
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
              padding-left: 20/50rem;
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
            height: 100%;
            float: left;
            margin-right: 10/50rem;
            img{
              width: 80/50rem;
            }
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

        .bid_info{
          overflow: hidden;
          padding: 5/50rem  20/50rem  10/50rem 20/50rem;
          border-bottom: 15/50rem solid #F4F4F4;
          margin-bottom: 60/50rem;
          .title{
            font-weight: 600;
            line-height: 65/50rem;
          }
          .v-f-bid{
            padding: 15/50rem;
            overflow: hidden;
            position: relative;
            &>div{
              float: left;
              line-height: 50/50rem;
              &:nth-child(1){

              }
              &:nth-child(2){
                position: absolute;
                left: 130/50rem;
                width: 120/50rem;
              }
              &:nth-child(3){
                position: absolute;
                left: 350/50rem;
              }
              &:nth-child(4){
                float: right;
                margin-left: 90/50rem;
                background-color: blue;
                color: white;
                font-size: 24/50rem;
                padding: 0/50rem  20/50rem  0/50rem 20/50rem;
                border-radius: 7/50rem;
              }
            }
            .call{
              float: left;
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
          margin-bottom: 100/50rem;
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
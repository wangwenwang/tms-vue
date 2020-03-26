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
            <span>{{sourceInfo.productName}} ,</span>
            <span>{{sourceInfo.min_weight}}吨&nbsp;</span>
            <span>{{sourceInfo.min_volume}}方&nbsp;</span>
          </div>
          <div>
            <span>特殊要求</span>
            <span class="markInfo">{{sourceInfo.mark}}</span>
          </div>
        </div>
      
        <div class="handlingInfo">
          <div class="title"><span>装卸信息</span><span>{{sourceInfo.loadUnloadType}}</span>
            <span v-if='$store.state.userInfo.userType == "driver" && sourceInfo.distanceShow != false'>距装货地{{sourceInfo.distance}}km</span>
          </div>
          <div class="date"><i class="iconfont icon-yidongduanicon-"></i>
            <span>{{sourceInfo.loadingTime}} 全天00：00-24：00可装</span>
          </div>
          <div class="address1" v-for='(dataItem,index) in data.start' :id="index" :key="'info1-' + index">
            <span class="i">装</span><span>{{dataItem.s_city}} {{dataItem.s_district}}</span>
            <div class="AddressDetail"> {{dataItem.s_address}}</div>
          </div>
          <div class="address2" v-for='(dataItem,index) in data.end' :id="index"  :key="'info2-' + index">
            <span class="i">卸</span><span>{{dataItem.e_city}} {{dataItem.e_district}}</span>
            <div class="AddressDetail"> {{dataItem.e_address}}</div>
          </div>
        </div>

        <div v-if='owner_or_driver_userName != undefined' class="owner-driver-Info">
          <div class="userImage"><img src="../../assets/images/defaultHead.png" class="userinfo-avatar" alt=""></div>
            <div class="userName">{{ owner_or_driver_userName }}</div>
            <div class="call"><i v-if='owner_or_driver_tel' @click="callPhone(owner_or_driver_tel)" class="iconfont icon-dianhua-copy"></i></div>
            <div class="todriverInfo" @click="toUserIntroduction()">查看资料 ></div>
        </div>

        <div v-if='$store.state.userInfo.userType == "owner" && data.bid.length > 0 && data.driverInfo.driver_id == undefined' class="bid_info">
          <div class="title-">
            <div class="prompt">竞价信息</div>
            <div class="sort">
              <template>
                <el-select v-model="value" placeholder="按时间降序" @change='sort_click($event)'>
                  <el-option v-for="item in optionsSort" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </div>
          </div>
          <div v-for='(item, index) in data.bid' :id="index" :key="'info3-' + index" class="v-f-bid">
            <div>￥{{ item.bid_price }}</div>
            <div>{{ item.bid_name }}</div>
            <div class="call"><i v-if='item.bid_tel' @click="callPhone(item.bid_tel)" class="iconfont icon-dianhua-copy"></i></div>
            <div @click="owner_confirm_driver(index, item.bid_price)">确认</div>
            <div @click="owner_view_driver(index)">查看资料</div>
          </div>
        </div>

        <div v-if='$store.state.userInfo.userType == "driver" && data.driverInfo.driver_id == undefined' class="price">
          <span v-if="!shipmentMoney">当前报价：</span>
          <span v-if="shipmentMoney">我的竞价：</span>
          <span v-if="sourceInfo.expectedCost">￥{{ sourceInfo.expectedCost }}</span>
          <span v-if="shipmentMoney == '' && sourceInfo.expectedCost == ''" class="none">暂无报价</span>
          <span v-if="shipmentMoney != '' && sourceInfo.expectedCost == ''">￥{{shipmentMoney}}</span>
        </div>

        <!-- 司机端，货源未被承运 -->
        <div v-if='$store.state.userInfo.userType == "driver" && data.driverInfo.driver_id == undefined' class="btnList">
          <div class="call" @click="callPhone(data.ownerInfo.owner_tel)"><i class="iconfont icon-dianhua"></i>电话联系</div>
          <div class="biddingPrice" v-if="sourceInfo.expectedCost"><i class="iconfont icon-xuanzhong" @click="driver_confirm_owner()"></i>确 认</div>
          <div class="biddingPrice" v-if="!sourceInfo.expectedCost" @click="DialogVisible = true"><i class="iconfont icon-jingjia"></i>竞 价</div>
          <el-dialog title="竞 价" :visible.sync="DialogVisible"  width="80%" top="50%" center>
            <span>请输入承运费用：</span>
            <el-input v-model="v_shipmentMoney" auto-complete="off"></el-input>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel_bid()">取 消</el-button>
              <el-button type="primary" @click="confirm_bid()">确 定</el-button>
            </span>
          </el-dialog>
        </div>

        <div v-if='data.driverInfo.driver_price' class="ShippingInfo">承运价格：￥{{ data.driverInfo.driver_price }} </div>

        <div v-if='$store.state.userInfo.userType == "owner" && data.driverInfo.driver_price == undefined && sourceInfo.expectedCost' class="ShippingInfo">我的报价：￥{{ sourceInfo.expectedCost }}</div>

        <div v-if='$store.state.userInfo.userType == "owner" && data.driverInfo.driver_price == undefined && !sourceInfo.expectedCost && data.bid.length == 0' class="ShippingInfo">暂无报价</div>
        <div class="button" v-if='$store.state.userInfo.userType == "owner"'>
          <!-- <div class="btnEdit" v-if="ifEdit" @click.stop="toEdit()">修改</div> -->
          <div class="btnCancel" v-if="ifCancel" @click.stop="toCancel()">取消</div>
        </div>
      
      </div>
    </div>

      <!-- 页面数据为空时 -->
    <div v-if="is_NoData" class="NoData" >
      <div>
        <i class="iconfont icon-meiyouwuliuxinxi"></i>
        <div>{{is_NoData_text}}</div>
      </div>
    </div>
    <div v-if="ifTips" class="msg_tips">
      <div class="tips_content">
        <i class="iconfont icon-chenggong1"></i>
        <p>{{tips_Msg}}</p>
      </div>
    </div>

    <div class="selfconfirm" v-if="selfconfirm_show">
      <div class="selfconfirm_contianer">
        <div class="selfconfirm_head">提示</div>
        <div class="selfconfirm_content">{{ confirmcontent }}</div>
        <div class="selfconfirm_btn">
          <div @click='selfconfirm_cancel()'>取消</div>
          <div @click='selfconfirm_confirm_()'>确认</div>
        </div>
      </div>
    </div>

  </div>
</template>
<script type="text/javascript">
  import Vue from 'vue'
  import { MessageBox } from 'element-ui';
  Vue.prototype.$confirm = MessageBox.confirm
  export default{
    name:"sourceDetail",
    data(){
      return{
        is_NoData:false,
        ifTips:false,    //提示信息是否显示
        ifEdit:false,    //修改按钮是否显示
        ifCancel:false,  //删除按钮是否显示
        is_NoData_text:"没有信息",
        orderstate:' ',
        DialogVisible:false,
        v_shipmentMoney:'', //司机竞价
        shipmentMoney:'',   //司机竞价，服务器返回值
        sourceInfo:{},
        whoPush:"",
        owner_or_driver_userName:"", //货主/承运司机名称
        owner_or_driver_tel:"",      //货主/承运司机电话
        owner_or_driver_ID:"",       //货主/承运司机ID
        data:{"driverInfo":{"driver_price":""},"bid":[]},
        optionsSort: [{
          value: '时间',
          label: '按时间降序'
        }, {
          value: '价格',
          label: '按价格降序'
        }],
        value: '',
        bid_time_desc: [],
        confirmcontent: "",     //自建confirm提示内容
        selfconfirm_show: false, //自建confirm是否显示提示框
        longitude:"114.046",//经度
        latitude:"22.628571",//纬度
        sourceDetailInfo:{}
      }
    },
    mounted(){
      this.TelliOSORAndroidVueMounted("获取当前位置页面已加载");
      window.SetCurrAddress = this.SetCurrAddress;
    },
    created(){

      var that = this
      if(this.$route.query.sourceInfo){

        this.sourceInfo = this.$route.query.sourceInfo;
      }else{
        console.log(999)
        this.sourceInfo = this.$store.state.sourceInfo;
      }

      if(this.sourceInfo.mileage){

        this.sourceInfo.mileage = this.sourceInfo.mileage/1000;
        let tempVal = parseFloat(this.sourceInfo.mileage).toFixed(2)
        this.sourceInfo.mileage = tempVal.substring(0, tempVal.length - 1)
      }
      var status = this.sourceInfo.status
      if(status == "NEW"){

        this.ifEdit = true;
      }
      if(status == "NEW" || status =="NON-CONFIRM" || status =="NON-DELIVERY"){

        this.ifCancel = true;
      }
      

      if(this.$route.query.whoPush){

        this.whoPush = this.$route.query.whoPush;
      }
      if(this.$route.query.orderState){

        this.orderstate = this.$route.query.orderState;//订单类型
      }else{
        this.orderstate = '';
      }

      var postData = {
        "lon":this.longitude,//经度
        "lat":this.latitude,//纬度
        "sourceNo": that.sourceInfo.sourceNo,//货源单号
        "shipDriverID": that.sourceInfo.shipDriverID,//承运司机ID
      }
      // 查询装卸点、承运司机信息
      that.httpRequest_ygy("cargoDetail.do",postData,function(res){

        that.data = res.data
        that.sourceDetailInfo = res.data
        if(that.$store.state.userInfo.userType == "driver"){
          that.owner_or_driver_userName = that.data.ownerInfo.owner_name;
          that.owner_or_driver_tel = that.data.ownerInfo.owner_tel;
          that.owner_or_driver_ID = that.data.ownerInfo.owner_Id;
          // 获取司机自己的竞价
          for (var i = that.data.bid.length - 1; i >= 0; i--) {
            if(that.data.bid[i].bid_driver_id == that.$store.state.userInfo.user_id){
              that.shipmentMoney = that.data.bid[i].bid_price
            }
          }
        }
        if(that.$store.state.userInfo.userType == "owner"){
          that.owner_or_driver_userName = that.data.driverInfo.driver_name;
          that.owner_or_driver_tel = that.data.driverInfo.driver_tel; 
          that.owner_or_driver_ID = that.data.driverInfo.driver_id;
        }
      })
    },
    methods:{
      //获取当前位置经纬度
      SetCurrAddress:function(address, lng, lat) {

        if(address == "") {
          this.$alert(msg, '定位失败', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        }else {
          this.longitude = lng;
          this.latitude = lat;
        }
      },
      // 自建confirm取消事件
      selfconfirm_cancel (){
        this.selfconfirm_show = false;
      },
      // 自建confirm确认事件
      selfconfirm_confirm(){

      },
      // 自建confirm确认事件
      selfconfirm_confirm_(){

        this.selfconfirm_show = false;
        this.selfconfirm_confirm();
      },
      selfconfirm(text,selfconfirm_confirm){
        this.selfconfirm_show = true;
        this.confirmcontent = text;
        this.selfconfirm_confirm = selfconfirm_confirm;
      },
      // 对司机竞价信息排序
      sort_click(e){

        if(this.bid_time_desc.length == 0){
          for(var i = 0; i < this.data.bid.length; i++){
            this.bid_time_desc.push(this.data.bid[i])
          }
        }

        if(e == "时间"){
          this.data.bid = []
          for(var i = 0; i < this.bid_time_desc.length; i++){
            this.data.bid.push(this.bid_time_desc[i])
          }
        }else if(e == "价格"){
          this.sortByKeyAsc(this.data.bid, "bid_price")
        }
      },
      // 根据key，数组升序
       sortByKeyAsc(array, key){

        return array.sort(function(a,b){
          var x = a[key]
          var y = b[key]
          return ((x<y)?-1:(x>y)?1:0)
        })
        // 降序
        // return array.sort(function(a,b){
        //   let x = Number(a[key])
        //   let y = Number(b[key])
        //   return((x<y)?1:((x>y)?-1:0))
        // })
      },
      // 竞价时，货主查看司机资料
      owner_view_driver(index){

        this.$router.push({
          name:"UserIntroduction",
          query:{
            UserID: this.data.bid[index].bid_driver_id,//司机id
            sourceInfo: this.sourceInfo,
            whoPush: this.whoPush
          }
        })
      },
      // 竞价时，货主确认司机
      owner_confirm_driver(index, price){

        var that = this

        this.selfconfirm('确定以' + price +'的价格被承运吗?', function(){

          var postData = {
            sourceNo: that.sourceInfo.sourceNo,//货源单号
            shipDriverId: that.data.bid[index].bid_driver_id,//司机id
            expectedCost: price,//司机竞价
          }
          that.httpRequest_ygy("toTms.do",postData,function(res){

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

        })
      },
      // 司机确认货主
      driver_confirm_owner(){
        
        var that = this
        var postData = {
          sourceNo: that.sourceInfo.sourceNo,//货源单号
          shipDriverId: that.$store.state.userInfo.user_id,//司机id
          expectedCost: that.sourceInfo.expectedCost,//货主报价
        }
        // 货主提供报价，司机确定接单
        that.httpRequest_ygy("toTms.do",postData,function(res){
          if(res.status == 1){
            that.ifTips = true;
            that.tips_Msg = "确认成功";
            setTimeout(function(){
              that.$store.state.Waybill_needRefresh = true
              that.$router.push({
                name:"Waybill",
              })
            },2000)
          }else{
            that.$alert('确认失败', '提示', {
              confirmButtonText: '确定',
            })
          }
        })
      },

      // 确定竞价
      confirm_bid(){
        if(this.v_shipmentMoney){

          var that = this
          var postData = {
            sourceNo: that.sourceInfo.sourceNo, //货源单号
            compPrice: that.v_shipmentMoney,    //竞价
          }
          this.httpRequest_ygy("driverBidding.do",postData,function(res){
            if(res.status == 1){
              that.shipmentMoney = that.v_shipmentMoney
              that.ifTips = true;
              that.tips_Msg = "竞价成功";
              setTimeout(function(){
                // 竞价成功后刷新当前页面
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
      cancel_bid(){

        this.v_shipmentMoney = ""
        this.DialogVisible = false
      },
      //查看司机/货主资料
      toUserIntroduction(){
        this.$router.push({
          name:"UserIntroduction",
          query:{
            UserID:this.owner_or_driver_ID,
            whoPush:this.whoPush,
            sourceInfo:this.sourceInfo,
          }
        })
      },
      //修改货源
      toEdit(){
        this.$router.push({
          name:"pg_publish",
          query:{
            pushType:"Edit",
            sourceInfo:this.sourceInfo,
            sourceDetailInfo:this.sourceDetailInfo,
          }
        })
      },
      
      //取消货源
      toCancel(){
        MessageBox.confirm("是否取消该货源？").then(() => {
           
          var that = this;
          var postData = {
            "sourceNo":that.sourceInfo.sourceNo,
            "status":that.sourceInfo.status,
          } 
          that.httpRequest_ygy("cancelOrder.do",postData,function(Res){
            if(Res.status == "1"){
              that.ifTips = true;
              that.tips_Msg = "操作成功";
              setTimeout(function(){
                that.$router.push({
                  name:that.whoPush,
                  query:{
                    orderstate:that.orderstate
                  }
                })
              },2000)
            }  
          });
        }).catch(() => {  

        });
      },

      // 返回上一页
      goPrev(){
        this.$router.push({
          name:this.whoPush,
          query:{
            orderstate:this.orderstate
          }
        })
      },
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
          padding: 15/50rem  20/50rem  10/50rem 20/50rem;
          border-bottom: 15/50rem solid #F4F4F4;
          .title{
            font-weight: 600;
            line-height: 65/50rem;
          }
          &>div{
            line-height: 50/50rem;
            span:first-child{
              color: #757575;
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
          padding: 15/50rem  20/50rem  10/50rem 20/50rem;
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
              color: #757575;
            }
            span:nth-child(3){
              font-size: 27/50rem;
              font-weight: 500;
              position: absolute;
              right: 0;
            }
          }
          .date{ 
            color: #757575;
            span{
              font-size: 25/50rem;
            }
          }
          .address1,.address2{
            margin-bottom: 20/50rem;
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
            .AddressDetail{
              font-size:26/50rem;
              line-height: 40/50rem;
              color: #757575;
              padding-left: 64/50rem;
            }
          }
          .address2{
            .i{
              border: 1/50rem solid  #FD757F;
              background-color: #FD757F;
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

        .owner-driver-Info{
          line-height: 80/50rem;
          padding: 20/50rem  40/50rem  25/50rem 20/50rem;
          border-bottom: 15/50rem solid #F4F4F4;
          display: flex;
          justify-content: space-between;
          .userImage{
            width: 80/50rem;
            height: 80/50rem;
            margin-right: 10/50rem;
            img{
              width: 80/50rem;
            }
          }
          .userName{
            font-size: 30/50rem;
            font-weight:600;
            margin-right: 15/50rem;
          }
          .call{
            margin-right: 200/50rem;
            color: #5965D8;
            font-size: 34/50rem;
          }
          .todriverInfo{
            font-size: 22/50rem;
            font-weight: 550;
            color: #757575;
          }
        }

        .bid_info{
          overflow: hidden;
          padding: 5/50rem  20/50rem  10/50rem 20/50rem;
          border-bottom: 15/50rem solid #F4F4F4;
          margin-bottom: 60/50rem;
          .title-{
            width: 100%;
            height: 65/50rem;
            .prompt{
              font-weight: 600;
              line-height: 65/50rem;
              float: left;
            }
            .sort{
              width: 500/50rem;
              height: 65/50rem;
              float: left;
            }
          }
          .v-f-bid{
            padding: 15/50rem;
            overflow: hidden;
            position: relative;
            &>div{
              float: left;
              line-height: 50/50rem;
              &:nth-child(2){
                position: absolute;
                left: 130/50rem;
                width: 120/50rem; 
                margin-left: 30/50rem;
              }
              &:nth-child(3){
                position: absolute;
                left: 270/50rem;
              }
              &:nth-child(4){
                float: right;
                margin-left: 90/50rem;
                background-color: #5965D8;
                color: white;
                font-size: 24/50rem;
                padding: 0/50rem  20/50rem  0/50rem 20/50rem;
                border-radius: 7/50rem;
              }
              &:nth-child(5){
                float: right;
                margin-right: -20/50rem;
                background-color: #5965D8;
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
            color: #757575;
            font-weight: 550;
          }
        }

        .btnList{ 
          padding: 20/50rem  120/50rem  0/50rem 120/50rem;
          text-align: center;
          height: 130/50rem;
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
        .ShippingInfo{
          padding: 20/50rem  40/50rem  25/50rem 20/50rem;
          border-bottom: 15/50rem solid #F4F4F4;
        }
        .button{
          height: 60/50rem;
          display: flex;
          justify-content: center; 
          margin: 30/50rem 0 ;
          .btnEdit,.btnCancel{
            text-align: center;
            height: 60/50rem;
            width: 150/50rem;
            line-height:60/50rem;
            color:#757575;
            border:1/50rem solid #999;
            padding:5/50rem 10/50rem;
            border-radius: 50/50rem;
          }
          .btnEdit{
            margin-right:10%;
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
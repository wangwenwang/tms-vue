<template>
  <div class="ToEvaluate">
    <header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>发表评价</span></header>
    <div class='container'>

      <div class="dataContent">

        <!-- 头像 -->
        <div class="userImage">
          <img v-if="pictures" class="userinfo-avatar" :src="pictures" alt="">
          <img v-if="!pictures" class="userinfo-avatar" src="../../assets/images/defaultHead.png" alt="">
        </div>

        <!-- 订单内容 -->
        <div class="rightContent">
          <div class="one">
            <span>{{ sourceInfo.carrierCity }}</span><span>{{ sourceInfo.carrierAddress3 }}</span>
            <span> → </span>
            <span>{{ sourceInfo.c_city }} </span><span>{{ sourceInfo.c_address3 }}</span>
            <span class="publishTime">{{ sourceInfo.publishTime }}</span>
          </div>
          <div class="two">
            <div class="left">
            <span v-if='sourceInfo.vehicleType'>{{ sourceInfo.vehicleType }}&nbsp;</span>
            <span v-if='!sourceInfo.weight'>{{ sourceInfo.min_weight }}~{{ sourceInfo.max_weight }}吨&nbsp;</span>
            <span v-if='sourceInfo.weight'>{{ sourceInfo.max_weight}}吨&nbsp;</span>
            <span v-if='!sourceInfo.volume'>{{ sourceInfo.min_volume }}~{{ sourceInfo.max_volume }}方&nbsp;</span>
            <span v-if='sourceInfo.volume'>{{ sourceInfo.max_volume }}方&nbsp;</span>
            <span v-if='sourceInfo.productName'>{{ sourceInfo.productName }}&nbsp;</span>
            </div>
          </div>
        </div>

        <!-- 评分 -->
        <div class="block">
          <span class="demonstration">评分： </span>
          <el-rate class="star" v-model="value1" :colors="colors" :show-text="true"></el-rate>
        </div>

      </div>

      <div v-if="$store.state.userInfo.userType == 'owner'" class="tag">
        <div class="ta-left">
          <div class="v-t" @click="eva">驾驶娴熟平稳</div>
          <div class="v-t" @click="eva">货物完好无损</div>
          <div class="v-t" @click="eva">态度友好</div>
        </div>
        <div class="ta-right">
          <div class="v-t" @click="eva">准时到达目的地</div>
          <div class="v-t" @click="eva">熟悉路线</div>
          <div class="v-t" @click="eva">接驾很快</div>
        </div>
      </div>

      <div v-if="$store.state.userInfo.userType == 'driver'"  class="tag">
        <div class="ta-left">
          <div class="v-t" @click="eva">态度好</div>
          <div class="v-t" @click="eva">及时付款</div>
          <div class="v-t" @click="eva">信息准确</div>
        </div>
        <div class="ta-right">
          <div class="v-t" @click="eva">描述相符</div>
          <div class="v-t" @click="eva">价格公道</div>
          <div class="v-t" @click="eva">克扣运费</div>
        </div>
      </div>

       <!-- 输入框 -->
      <div class="rateDescribe">
        <textarea type='text' ref="rateDescribe" placeholder="补充内容" v-model='rateDescribe'></textarea>
      </div>
    </div>

    <div class="BtnComponent bottomBtn">
      <div @click='submit' class="onlyBtn">发  布</div>
    </div>

    <div v-if="ifTips" class="msg_tips">
      <div class="tips_content">
        <i class="iconfont icon-chenggong1"></i>
        <p>{{ tips_Msg }}</p>
      </div>
    </div>

  </div>
</template>
<script type="text/javascript">
  import $ from "jquery"
  export default{
    name:"ToEvaluate",
    data(){
      return{
        tips_Msg: "",    //提示信息
        ifTips: false,
        sourceInfo: [],
        orderState: '',  //订单状态
        value1: null,
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
        rateDescribe: '', 
        pictures: '',
        byEvalId: '',    //被评价人ID
        eva_mul: ""      //选择的评价
      }
    },
    created(){

      if(this.$route.query.sourceInfo){

        this.sourceInfo = this.$route.query.sourceInfo;//货源详
      }
      if(this.$route.query.orderState){

        this.orderState = this.$route.query.orderState;//订单状态
      }
      if(this.$store.state.userInfo.userType == "driver"){

        this.byEvalId = this.sourceInfo.ownerID;
      }
      if(this.$store.state.userInfo.userType == "owner"){

        this.byEvalId = this.sourceInfo.shipDriverID;
      }
      
      var that = this
      var params = { "shipDriverID": that.byEvalId }

      that.httpRequest_ygy("queryDriverInfo.do", params,function(res){

        if(res.data.length){
          that.pictures = res.data.driver_avatar
        }
      })
    },
    methods:{

      eva(e){

        if($(e.target).css("color") == "rgb(0, 0, 0)"){

          $(e.target).css({"background-color":"#4E6CD8", "color":"white"})
        }else{

          $(e.target).css({"background-color":"transparent", "color":"black"})
        }
      },
      goPrev(){

        this.$router.push({
          name: "od_bid",
          query:{
            orderstate: "NON-RATE"
          }
        })
      },
      "submit":function(){

        var that = this

        var cellphone = that.$store.state.userInfo.cellphone

        if (!that.value1){

          that.$alert("请给本次服务评分！", '提示', {
            confirmButtonText: '确定',
          })
          return
        }else{

          // 查找用户选了哪些评价
          var f = $(".v-t")
          this.eva_mul = ""
          for(var i = 0; i < f.length; i++){
            var item = f[i]
            if($(item).css("color") == "rgb(255, 255, 255)"){
              this.eva_mul += item.innerText + "，"
            }
          }
          this.eva_mul += this.rateDescribe

          var params = {
            "byEvalId": that.byEvalId,
            "sourceNo": that.sourceInfo.sourceNo,
            "evalLevel": that.value1,
            "evalContent": that.eva_mul,
          }
          
          that.httpRequest_ygy("ownerEvaluate.do", params, function(res){
            that.ifTips = true;
            that.tips_Msg = "发布成功"
            setTimeout(function(){  
              that.ifTips = false;  
              that.$router.push({
                name:"HomeIndex",
                query:{
                }
              })
            }, 1500)
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .ToEvaluate{
    overflow: hidden;
    .container{
      width:100%;
      box-sizing: border-box;
      padding:20/50rem;
      .dataContent{
        padding:10/50rem;
        height: 170/50rem;
        border-bottom: 1/50rem solid  #ddd;
        .userImage{
          float: left;
          margin-right: 10/50rem;
          .userinfo-avatar{
            width: 80/50rem;
            height: 80/50rem;
            display: block;
          }
        }
        .rightContent{
          padding-left: 80/50rem;
          .one{ 
            font-size: 30/50rem;
            font-weight: 550;
            padding-bottom: 10/50rem;
            .publishTime{
              font-size: 22/50rem;
              padding-top: 8/50rem;
              color: #999;
              float: right;
            }
          }
        }
        .block{
          padding-top: 30/50rem;
          display: flex; 
          justify-content: flex-start; 
          .demonstration{
            font-size: 30/50rem;
            font-weight: 550;
          }
          .star{
            padding-top: 8/50rem;
          }
        }
      }
      .tag{
        width: 100%;
        margin-top: 80/50rem;
        &>div{
          width: 50%;
          height: 100%;
          &>div{
            width: 60%;
            padding: 20/50rem;
            text-align: center;
            border: 1/50rem solid #ccc;
            margin: 0 auto;
            margin-bottom: 20/50rem;
          }
        }
        .ta-left{
          float: left;
        }
        .ta-right{
          float: right;
        }
      }
      .rateDescribe{
        padding-top: 20/50rem;
        textarea{
          width: 692/50rem;
          height: 300/50rem;
          margin-top: 70/50rem;
          line-height: 50/50rem;
          border-style:none;
          padding:10/50rem;
        }
      }
    }
  }
</style>
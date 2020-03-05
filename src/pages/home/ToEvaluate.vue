<template>
  <div class="ToEvaluate">
	<header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>发表评价</span></header>
	<div class='container'>
	  <div class="dataContent">
        <div class="userImage">
           <img  v-if="pictures"  class="userinfo-avatar" :src="pictures" alt="">
           <img  v-if="!pictures"  class="userinfo-avatar"  src="../../assets/images/defaultHead.png" alt="">
        </div> 
          <div class="rightContent">
            <div class="one">
              <span>{{sourceInfo.carrierCity}} </span><span> {{sourceInfo.carrierAddress3}}</span>
              <span> → </span>
              <span>{{sourceInfo.c_city}} </span><span> {{sourceInfo.c_address3}}</span>
              <span class="publishTime">{{sourceInfo.publishTime}}</span>
            </div>
            <div class="two">
              <div class="left">
              <span v-if='sourceInfo.vehicleType'>{{sourceInfo.vehicleType}}&nbsp;</span>
              <span v-if='!sourceInfo.weight'>{{sourceInfo.min_weight}}~{{sourceInfo.max_weight}}吨&nbsp;</span>
              <span v-if='sourceInfo.weight'>{{sourceInfo.max_weight}}吨&nbsp;</span>
              <span v-if='!sourceInfo.volume'>{{sourceInfo.min_volume}}~{{sourceInfo.max_volume}}方&nbsp;</span>
              <span v-if='sourceInfo.volume'>{{sourceInfo.max_volume}}方&nbsp;</span>
              <span v-if='sourceInfo.productName'>{{sourceInfo.productName}}&nbsp;</span>
              </div>
            </div>
         	
            	
            <!-- <div class="three">
              <div class="left">
              <span v-if='dataItem.cargoType'>{{dataItem.cargoType}} , </span>
              <span v-if='dataItem.productName'>{{dataItem.productName}} , </span>
              <span v-if='dataItem.loadingTime'>{{dataItem.loadingTime}}装货 , </span>
              <span v-if='dataItem.loadUnloadType'>{{dataItem.loadUnloadType}} </span>
              </div>
            </div>

            <div class="four">
              <div class="left">
              <span v-if='dataItem.ownerName'>{{dataItem.ownerName}}</span>
              </div>
            </div> -->
          </div>
          <div class="block">
		 	  <span class="demonstration">评分： </span>
		 	  <el-rate class="star" v-model="value1" :colors="colors"  :show-text = "true" > </el-rate>
		 	  <!-- <span>{{rate}}</span> -->
		  </div>
        </div>
        <div class="rateDescribe">
          <!-- <input type="" name="" @keyup.enter="submit"> -->
          <textarea type='text'  ref="rateDescribe"    placeholder="本次行程满意吗？"   v-model='rateDescribe'></textarea>
        </div>
      </div>

      <div class="BtnComponent bottomBtn">
	    <div @click='submit' class="onlyBtn">发  布</div>
	  </div>

	<!-- </div> -->
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
	name:"ToEvaluate",
	data(){
	  return{
	    tips_Msg:"",//提示信息
		ifTips:false,
		sourceInfo:[],
		orderState:'',//订单状态
		value1: null,
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
        rateDescribe:'', 
        pictures:'',
        byEvalId:'', //被评价人ID
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
      
      var that = this;
      var params = {
	    "shipDriverID": that.byEvalId,
      };

      that.httpRequest_ygy( "queryDriverInfo.do",params,function(res){

		if(res.data.length){
	      that.pictures = res.data.driver_avatar;
		}
	  })
	},
	
	methods:{
	  goPrev(){
		var that = this;

		this.$router.push({
		  name:"od_bid",
		  query:{
		  	sourceInfo:this.sourceInfo,
            whoPush:"ToEvaluate",
            orderState:"NON-RATE"
		  }
		})
	  },
	  "submit":function(){

	    var that=this;

	    var cellphone = that.$store.state.userInfo.cellphone;

	    if (!that.value1){

	      that.$alert("请给本次服务评分！", '提示', {
		    confirmButtonText: '确定',
		  })  
	      return;
	    }else{
	      	var params = {
			  "byEvalId": that.byEvalId,
			  "sourceNo": that.sourceInfo.sourceNo,
		      "evalLevel": that.value1,
			  "evalContent": that.rateDescribe,
		    };

		    that.httpRequest_ygy( "ownerEvaluate.do",params,function(res){

			  that.ifTips = true;
			  that.tips_Msg = "发布成功";
			   //if(res.data.length){
				 // this.pictures = res.data.driver_avatar;
			  // }
			  setTimeout(function(){  
			  	that.ifTips = false;  
			  	that.$router.push({
			  	  name:"HomeIndex",
			  	  query:{
			  	  }
			  	})
			  },1500)
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
  	  .rateDescribe{
  	  	padding-top: 20/50rem;
  	  	textarea{
  	  	  width: 692/50rem;
  	  	  height: 300/50rem;
  	  	  line-height: 50/50rem;
  	  	  border-style:none;
  	  	  padding:10/50rem;
  	  	}
  	  	
  	  }
    }
  }

	@media screen and (max-width: 374px){
		.ToEvaluate{
			.container{
			  &>div{
					&>input{
					    border: 3/50rem solid #E8E8E8;
					}
				}
			}
		}
	}
</style>
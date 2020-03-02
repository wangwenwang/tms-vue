<template>
  <div class="UserIntroduction">
  	<header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>{{headItem}}</span></header>
  	<div class="container">
  	  <div class="UserInfo">
        <div class="userImage"><img src="../../assets/images/defaultHead.png" class="userinfo-avatar" alt=""></div>
        <div class="rightContent">
          <div class="one">
            <!-- <div>{{ userName }}</div> --><div>王小强</div>
            <div class="call"><i v-if='userTel' @click="callPhone(userTel)" class="iconfonicon-dianhua-copy"></i></div>
          </div>
          <div class="two">
          	<span>{{ NewTime }} 注册</span>
            <!-- <span>交易999  </span>
            <span v-if='$store.state.userInfo.userType == "driver"'>接单数1234 </span>
            <span v-if='$store.state.userInfo.userType == "owner"'>发货数1234 </span> -->
          </div>
          <div class="three">
          	<i class="iconfont icon-gou"></i> 
          	<span> 实名认证</span>
            <!-- <span>深圳市凯东源现代物流股份有限公司</span> -->
          </div>
        </div>
        <div class="company"><span>公司名称</span><span>  {{userData.a}}</span></div>
        <div class="company"><span>公司地址</span><span>  {{userData.b}}</span></div>
        <div class="company"><span> 交易数 </span><span>{{userData.c}}</span></div>
      </div>
      <div class="evaluateInfo">
      	<div class="title">评价</div>
      	<div class="evaluateItem" v-for='(dataItem,index) in evaluatedata' :id="index"  :key='index'>
      		<span class="content">{{dataItem.a}}</span><span class="time">{{dataItem.b}}</span>

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
  	name:"UserIntroduction",
  	data(){
  	  return{
  	  	TrackListData:[],  //轨迹列表
  	  	is_NoData:false,
  	  	is_NoData_text:"没有评论",
  	  	headItem:"",//页面标题
  	  	NewTime:"2019-12-30",
  	  	UserID:"",  //货主/承运司机ID
  	  	userName:"",
  	  	userTel:"",
  	  	sourceInfo:{},
  	  	userData:{a:"北京远航通物流有限公司",b:"北京",c:"3"},//货主/承运司机资料信息
  	  	evaluatedata:[{a:"装货顺利，中国好货主！",b:"02-10"},
  	  	{a:"态度好，付款及时......",b:"16:19"}]
  	  }
  	},
  	created(){  
  	  if(this.$route.query.UserID){
        this.UserID = this.$route.query.UserID;
      }
      if(this.$route.query.sourceInfo){
        this.sourceInfo = this.$route.query.sourceInfo;//货源详情
      }
      if(this.$store.state.userInfo.userType == "ower"){
      	this.headItem = "司机简介"
      }
      if(this.$store.state.userInfo.userType == "driver"){
      	this.headItem = "货主简介"
      }

  	  var that = this;  
  	  var postData = {
  	    cellphone: that.$store.state.userInfo.cellphone,//手机号   15013418360
  	  };  
  	  this.httpRequest("queryTrajectoryData.do",postData,function(res){  
  	  	that.TrackListData = res.data;  
  	  	if(!res.data.length){  
  	  	  that.is_NoData_text = "没有结果"  
  	  	  that.is_NoData = true;
  	  	}  
  	  })  
  	},
  	methods:{
  	  // 返回上一页
  	  goPrev(){  
  	  	this.$router.push({
  	  	  name:"sourceDetail",
  	  	  query:{
  	  	  	sourceInfo:this.sourceInfo,
  	  	  	
  	  	  }
  	  	})
  	  }
  	}
  }
</script>
<style lang="less" scoped>
  .UserIntroduction{
  	overflow: hidden;
  	.container{
  	  overflow: hidden;
  	  .UserInfo{
  	  	// height: 180/50rem;
        padding: 20/50rem  40/50rem  5/50rem 20/50rem;
        border-bottom: 15/50rem solid #F4F4F4;
        font-size: 22/50rem;
        line-height: 40/50rem;
        .userImage{
          width: 100/50rem;
          height: 110/50rem;
          float: left;
          img{
            width: 100/50rem;height: 110/50rem;
          }
        }
        .rightContent{
          padding-left: 120/50rem;
          line-height: 40/50rem;
          padding-bottom: 8/50rem;
          border-bottom: 1/50rem solid #ddd;
          .one{ 
            font-size: 32/50rem;
            .call{
              margin-right: 280/50rem;
              line-height: 65/50rem;
              color: #5965D8;
              text-align: center;
              font-size: 30/50rem;
            }
          }
          .two{
            color: #757575;
          }
          .three{
            color: #699E3F;
          }

        }
        .company{
          line-height: 50/50rem;
          &>span:first-child{
          	width: 120/50rem;
          	color:#999;
          	padding: 0 14/50rem ;
          }
        }
  	  }
  	  .evaluateInfo{
  	  	padding:10/50rem 20/50rem;
  	  	.title{
  	  		line-height: 60/50rem;
  	  		font-size: 32/50rem;
  	  		font-weight: 550;
  	  	}
  	  	.evaluateItem{
  	  		background-color: #EAF0FA;
  	  		border-radius: 15/50rem;
  	  		line-height: 40/50rem;
  	  		padding:20/50rem 5/50rem 20/50rem 15/50rem ;
  	  		display: flex;
  	  		justify-content: space-between;
  	  		margin-bottom:30/50rem;
  	  		.content{ 
  	  			width: 590/50rem; 
  	  		}
  	  		.time{
  	  			width: 80/50rem;
  	  			float: right;
  	  			font-size: 24/50rem;
  	  			text-align: center;
  	  			color:#999;
  	  			font-weight: 550;
  	  		}
  	  	}

  	  }
  	}
  }
  @media screen and (max-width: 374px){  
  	.UserIntroduction{
  	  .container{
  	  	.UserInfo{
  	  	  border-bottom: 3/50rem solid #777;
  	  	}
  	  }
  	}
  }
</style>
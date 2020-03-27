<template>
  <div class="UserIntroduction">
  	<header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>{{headItem}}</span></header>
  	<div class="container">
  	  <div class="UserInfo">
        <div class="userImage"><img src="../../assets/images/defaultHead.png" class="userinfo-avatar" alt=""></div>
        <div class="rightContent">
          <div class="one">
            <div>{{ userInfo.userName }}</div>
          </div>
          <div class="two">
          	<span>{{  userInfo.registerDate }} 注册</span>
          </div>
          <div class="three">
          	<i class="iconfont icon-gou"></i> 
          	<span> 实名认证</span>
          </div>

          <!-- 星级 -->
          <div class="block">
            <span class="demonstration">星级： </span>
            <el-rate class="star" v-model="value1" :colors="colors"></el-rate>
          </div>

        </div>
        <div class="company"><span>公司名称</span><span>  {{userInfo.comName}}</span></div>
        <div class="company"><span>公司地址</span><span>  {{userInfo.comAddress}}</span></div>
        <div class="company"  v-if='$store.state.userInfo.userType == "driver"'><span> 发布次数 </span><span>  {{userInfo.fbcs}}</span></div>
        <div class="company"><span> 完成次数 </span><span>  {{userInfo.wccs}}</span></div>
      </div>
      <div class="evaluateInfo">
      	<div class="title">评价</div>
      	<div class="evaluateItem" v-for='(dataItem,index) in evalInfo' :id="index"  :key='index'>
      		<span class="content">{{dataItem.evalContent}}</span><span class="time">{{dataItem.evalDate}}</span>

      	</div>
        <!-- 页面数据为空时 -->
        <div   v-if="is_NoData"   class="NoData" >
          <div>
            <div>暂无评价</div>
          </div>
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
  	  	is_NoData:false,
  	  	headItem:"",//页面标题
  	  	sourceInfo:{},
  	  	userInfo:{},
  	  	evalInfo:[],
        whoPush:'',
        value1:4
  	  }
  	},
    mounted(){

      window.history.pushState(null, null, document.URL)
      window.addEventListener("popstate", this.onBrowserBack, false)
    },
    destroyed() {

      window.removeEventListener("popstate", this.onBrowserBack, false)
    },
  	created(){  
  	  if(this.$route.query.UserID){
        this.UserID = this.$route.query.UserID;
      }
      if(this.$route.query.sourceInfo){
        this.sourceInfo = this.$route.query.sourceInfo;//货源详情
      }
      if(this.$route.query.whoPush){

        this.whoPush = this.$route.query.whoPush;
      }
      if(this.$store.state.userInfo.userType == "owner"){
      	this.headItem = "司机简介"
      }
      if(this.$store.state.userInfo.userType == "driver"){
      	this.headItem = "货主简介"
      }

      this.nowDate = this.getNowTime().substring(0,4);

  	  var that = this;  
  	  var postData = {
  	    "id": that.UserID,//查看资料的id
  	  };  
  	  that.httpRequest_ygy("personalData.do",postData,function(res){  

        that.userInfo = res.data.userInfo;
          
  	  	if(res.data.evalInfo.length){  
  	      that.evalInfo = res.data.evalInfo;

  	      that.userInfo.registerDate = that.userInfo.registerDate.substring(0,10);

  	      for( var i=0; i < that.evalInfo.length; i++){

            if(that.evalInfo[i].evalDate.substring(0,4) == that.nowDate){

              that.evalInfo[i].evalDate = that.evalInfo[i].evalDate.substring(5,10);
            }else{
              that.evalInfo[i].evalDate = that.evalInfo[i].evalDate.substring(0,10);
            }
		      }
  	  	}else{ 
  	  	  that.is_NoData = true;
  	  	}  
  	  })  
  	},
  	methods:{
      // 监听系统返回键
      onBrowserBack() {
        
        this.goPrev()
      },
  	  // 返回上一页
  	  goPrev(){  

        console.log(this.whoPush)
        console.log(this.sourceInfo)


  	  	this.$router.push({
  	  	  name:"sourceDetail",
  	  	  query:{
            sourceInfo:this.sourceInfo,
            whoPush:this.whoPush
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
          height: 100/50rem;
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
          .block{
            padding-top: 30/50rem;
            display: flex; 
            justify-content: flex-start; 
            .demonstration{
              font-size: 30/50rem;
              font-weight: 550;
            }
            .star{
              padding-top: 4/50rem;
            }
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
        .NoData{
          margin-top: 50/50rem;
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
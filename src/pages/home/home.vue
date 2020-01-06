<template>
  <div class="HomeIndex">
  	<header><span>个人中心</span></header>
  	<div class="container">
  	  <div class='headImg'>
  	    <div class='background'></div>
  	    <div class='background_blank'></div>
  	    <div class='head'>
  	      <div class="image"></div>
  	      <img  class="userinfo-avatar" src="../../assets/images/defaultHead.png">
  	      <div class='userName'>{{userName}}</div>
  	      <div class='userName'>{{cellphone}}</div>
  	    </div>
  	   	<div class="stripInfo">
  	   	  <div  @click="toMyPublish" v-if='$store.state.userInfo.userType == "driver"'><i class="iconfont icon-cheb" ></i><span>我的发布</span>
  	   	  	<i class= "iconfont icon-xiangshang" ></i></div>
  	   	  <div  @click="toHistoricalTrack"><i class="iconfont icon-lishiguiji" ></i><span>历史轨迹</span>  
  	   	  	<i  class="iconfont icon-xiangshang" ></i></div>
  	   	  <div  @click="toPersonalData"><i class="iconfont icon-gerenziliaoxiugai" ></i><span>个人资料</span>
  	   	  	<i class="iconfont icon-xiangshang" ></i></div>
  	   	  <div  @click="toPassword"><i class="iconfont icon-xiugaimima" ></i><span>修改密码</span>
  	   	  	<i  class="iconfont icon-xiangshang" ></i></div>
  	   	  <div  @click="toCheckVersion"><i class="iconfont icon-guanyu" ></i><span>版本更新</span>
  	   	  	<span>{{VersionNum}}.51</span></div>
  	   	</div>
  	    <div class='Exit_logon' >
  	      <i class="iconfont icon-icon-yxj-switch-account"  @click="exit" ></i>
  	      <div><span @click="exit">退出登录</span></div>
  	    </div>
  	  </div>
  	</div>
  	<FooterIndex/>
  </div>
</template>
<script type="text/javascript">
import FooterIndex from "../../components/footer"
  export default{
  	name:"HomeIndex",
  	data(){
  	  return{
  	  	userName:"",
  	  	cellphone:"",//手机号码
  	  	VersionNum: "",//版本号
  	  }
  	},
  	components:{
  	  FooterIndex
  	},
  	created(){  
  	  this.userName = this.$store.state.userInfo.userName;
  	  this.cellphone = this.$store.state.userInfo.cellphone;
  	  this.VersionNum =  this.$store.state.App_Version;
  	  this.VersionNum = this.VersionNum.replace("版本:","")
  	},
  	methods:{
  	  // 跳转到 我的订单 页面
  	  toOdBid(){  
  	  	this.$router.push({
  	  	  name:"od_bid",
  	  	  query:{
  	  	  }
  	  	})
  	  },
      // 跳转到 我的发布 页面
      toMyPublish(){  
        this.$router.push({
          name:"MyPublish",
          query:{
          }
        })
      },
  	  // 跳转到 历史轨迹 页面
  	  toHistoricalTrack(){  
  	  	this.$router.push({
  	  	  name:"HistoricalTrack",
  	  	  query:{
  	  	  }
  	  	})
  	  },
  	  // 跳转到 个人资料 页面
  	  toPersonalData(){  
  	  	this.$router.push({
  	  	  name:"PersonalData",
  	  	  query:{
  	  	  }
  	  	})
  	  },
  	  // 跳转到 修改密码 页面
  	  toPassword(){  
  	  	this.$router.push({
  	  	  name:"RePassword",
  	  	  query:{
  	  	  }
  	    })
  	  },
  	  // 如果安卓版本低于或等于1.2.0，告诉vue
  	  compareVersion(locati) {  
  	  	var arr = locati.split('.');  
  	  	var loc1 = arr[0];
  	  	var loc2 = arr[1];
  	  	var loc3 = arr[2];  
  	  	if(loc1 < 1) {
  	  		return 1;
  	  	}else if(loc2 < 2) {
  	  		return 1;
  	  	}else if(loc2 == 2 && loc3 == 0) {
  	  		return 1;
  	  	}else {
  	  		return 0;
  	  	}
  	  },
  	  // 告诉原生代码 检查版本更新
  	  toCheckVersion(){  
  	  	var AppVersion = this.$store.state.App_Version;
  	  	var AppDevice = this.$store.state.Device;  
  	  	var needUpdate = this.compareVersion(AppVersion);  
  	  	if(needUpdate == 1 && AppDevice == "android") {  
  	      this.$alert('版本太低，请退出APP，再次打开进行更新', '提示', {
  	        confirmButtonText: '确认',
  	        type: 'warning'
  	      });
  	  	}  
  	  	// if(AppDevice == "iOS" || AppDevice == "") {  
  	  	// 	this.$alert('请移步至App Store检查更新', '提示', {
  	   //            confirmButtonText: '确认',
  	   //            type: 'warning'
  	   //        });
  	  	// }  
  	  	// 安卓
  	  	try {
  	  		CallAndroidOrIOS.callAndroid("检查版本更新");
  	  	} 
  	  	catch(error) {
  	  		console.log("没有CallAndroidOrIOS.callAndroid方法")
  	  	}
  	  	// 苹果
  	  	try {
  	  		CallAndroidOrIOS("检查版本更新");
  	  	}
  	  	catch(error) {
  	  		console.log("没有CallAndroidOrIOS方法")
  	  	}
  	  },
  	  // 切换账号 按钮
  	  exit(){  
  	  	var that = this;  
  	  	this.$confirm('确定要退出登录吗?', '提示', {
  	      confirmButtonText: '确定',
  	      cancelButtonText: '取消',
  	      type: 'warning'
  	    }).then(() => {  
  	      that.$store.state.history_Data = [];//历史任务页面数据
  	      that.$store.state.Waybill.shipmentListData = [];//我的任务  页面数据  
  	      that.$router.push({
  	  	    name:"Login",
  	  	    query:{
  	  	    }
  	      })
  	    }).catch(() => {         
  	    });
  	  }
  	}
  }
</script>
<style lang="less" scoped>
  .HomeIndex{
  	height: 100%;
  	overflow: hidden;
  	background-color: #F4F4F4;
  	.container{
  	  padding-top: 90/50rem;
  	  margin-top: 0;
  	  overflow: hidden;
  	  height: 100%;
  	  background-color: #F4F4F4;
  	  .headImg{
  	    width: 100%;
  	    height: 100%;
  	    overflow: scroll;
  	    position: relative; 
  	    font-size: 26/50rem;
  	  	.userName{
  	      font-size: 38/50rem;
  	      color: #6897FF;
  	      text-align: center;
  	      margin-bottom: 40/50rem;
  	  	}
  	  	.background{
  	  	  width:100%;
  	  	  height: 350/50rem;
  	  	  background: linear-gradient(to bottom,#5965D8,#C4CAEF);
  	  	}
  	  	.background_blank{
  	  	  width: 650/50rem;
  	  	  height: 350/50rem;
  	  	  position: absolute;
  	  	  top:110/50rem;
  	  	  left: 50/50rem;
  	  	  background-color: #fff;
  	  	  z-index: 33;
  	  	  border-radius: 10/50rem;
  	  	}
  	  	.head{
  	  	  width:100%;
  	  	  height: 350/50rem;
  	  	  position: absolute;
  	  	  left: 0/50rem;
  	  	  z-index: 95;
  	  	  top: 50/50rem;
  	  	}
  	  	.userinfo-avatar{
  	  	  width: 150/50rem;
  	  	  height: 150/50rem;
  	  	  border-radius: 50%;
  	  	  display: block;
  	  	  margin: 0 auto 40/50rem; 
  	  	}
  	  	.stripInfo{
  	  	  margin-top: 170/50rem;
  	  	  font-size: 30/50rem;
  	  	  &>div{
  	  	  	width: 100%;
  	  	  	height: 80/50rem;
  	  	  	line-height: 80/50rem;
  	  	  	background-color: #fff;
  	  	  	margin-bottom: 20/50rem;
  	  	  	padding-left: 20/50rem;
  	  	  	box-sizing: border-box;
  	  	  	overflow: hidden;
  	  	  	&>i:nth-child(1){
  	  	  	  float: left;
  	  	  	  margin-right: 20/50rem;
  	  	  	  color: #5965D8;
  	  	  	  font-size: 40/50rem;
              padding-top: 5/50rem;
  	  	  	}
  	  	  	&>i:nth-child(3),&>span:nth-child(3){
  	  	  	  float: right;
  	  	  	  margin-right: 20/50rem;
  	  	  	  color: #777;
  	  	  	  
  	  	  	  &>span:nth-child(3){
  	  	  	    margin-right: 30/50rem;
  	  	  	  }
  	  	    }
  	  	    &>div:nth-child(1){
  	  	      &>i:nth-child(1){
  	  	        font-size: 42/50rem;
  	  	      }
  	  	    }
  	  	    &>div:nth-child(3){
  	  	      &>i:nth-child(1){
  	  	        font-size: 44/50rem;
  	  	      }
  	  	    }
  	  	    &>div:nth-child(4){
  	  	      &>i:nth-child(1){
  	  	        font-size: 46/50rem;
  	  	      }
  	  	    }
  	  	  }
  	  	}  
  	  	///* 切换账号 */
  	  	.Exit_logon{
  	  	  margin-top: 50/50rem;
  	  	  margin-bottom: 220/50rem;
  	  	  &>i{
  	  	    display: block;
  	  	    margin: 0 auto;
  	  	    width: 114/50rem;
  	  	    font-size: 114/50rem;
  	  	    color: #6897FF;
  	  	  }
  	  	  &>div{
  	  	    text-align: center;
  	  	    color: #6897FF;
  	  	    font-size: 28/50rem;
  	  	    margin-top: 10/50rem;
  	  	  }
  	  	}
  	  }
  	}
  }

</style>
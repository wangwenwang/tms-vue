<template>
  <div class="HomeIndex">
  	<header><span>个人中心</span></header>
  	<div class="container">
  	  <div class='headImg'>
  	    <div class='background'></div>
  	    <div class='background_blank'></div>
  	    <div class='head'>
  	      <div class="image" >
            
          </div>
          <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="userinfo-avatar">
              <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
              <img  v-if="!imageUrl" class="userinfo-avatar" src="../../assets/images/defaultHead.png">
            </el-upload> 
          
  	      <div class='userName'>{{userName}}</div>
  	      <div class='userName'>{{cellphone}}</div>
  	    </div>
  	   	<div class="stripInfo">
          <div  @click="toOdBid" v-if='$store.state.userInfo.userType == "driver"'><i class="iconfont icon-quanbudingdan" ></i><span>我的订单</span>
            <i  class="iconfont icon-xiangshang" ></i></div>
  	   	  <div  @click="toMyPublish" v-if='$store.state.userInfo.userType == "driver"'><i class="iconfont icon-cheb" ></i><span>我的发布</span>
  	   	  	<i class= "iconfont icon-xiangshang" ></i></div>
  	   	  <div  @click="toHistoricalTrack" v-if='$store.state.userInfo.userType == "driver"'><i class="iconfont icon-lishiguiji" ></i><span>历史轨迹</span>  
  	   	  	<i  class="iconfont icon-xiangshang" ></i></div>
          <div  @click="toOpen"><i class="iconfont icon-xiazai" ></i><span>二维码下载</span>
            <i class="iconfont icon-xiangshang" ></i></div>
  	   	  <div  @click="toPersonalData"><i class="iconfont icon-gerenziliaoxiugai" ></i><span>个人资料</span>
  	   	  	<i class="iconfont icon-xiangshang" ></i></div>
  	   	  <div  @click="toPassword"><i class="iconfont icon-xiugaimima" ></i><span>修改密码</span>
  	   	  	<i  class="iconfont icon-xiangshang" ></i></div>
  	   	  <div  @click="toCheckVersion"><i class="iconfont icon-guanyu" ></i><span>版本更新</span>
  	   	  	<span>{{VersionNum}}.58</span></div>
  	   	</div>
  	    <div class='Exit_logon' >
  	      <i class="iconfont icon-icon-yxj-switch-account"  @click="exit" ></i>
  	      <div><span @click="exit">退出登录</span></div>
  	    </div>

        <div>
          <el-dialog title="下载" :visible.sync="dialogVisible" :close-on-click-modal="false" :modal="true" :show-close="true" :center="true" class="dialog"  width="80%" height= "30%">
            <div class="center">
              <img src="../../assets/images/app_QRCode.png" class="appImg"></img>
            </div>
            
         </el-dialog>
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
        imageUrl: "",//用户头像
        dialogVisible: false,//二维码弹框

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
      // this.imageUrl = this.$store.state.userInfo.imageUrl;
      
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

        this.$router.push("car_publish_list")
      },
  	  // 跳转到 历史轨迹 页面
  	  toHistoricalTrack(){  
  	  	this.$router.push({
  	  	  name:"HistoricalTrack",
  	  	  query:{
  	  	  }
  	  	})
  	  },
      //打开二维码弹框
      toOpen(){
        this.dialogVisible = true;

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

      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
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
          text-align: center;
          .avatar-uploader .el-upload {
            border: 3px dashed #d9d9d9;
            border-radius: 50%;
            cursor: pointer;
            position: relative;
            overflow: hidden;

            // margin: 0 auto 40/50rem; 
          }
          .avatar-uploader-icon {
            font-size: 38/50rem;
            color: #8c939d;
            width: 150/50rem;
            height: 150/50rem;
            line-height: 100/50rem;
            text-align: center;
          }
          .avatar {
            width: 150/50rem;
            height: 150/50rem;
            // border-radius: 50%;
            display: block;
          }
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

        //弹框图片
        .appImg{
          width:400/50rem;
          height: 500/50rem;
        }
        .center{
          text-align: center;
        }
  	  }
  	}

  }

</style>
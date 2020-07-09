<template>
	<div  class="Login">
		<header><span>登录</span></header>
		<div class="container">
			<div class="loginContainer">
				<div>
					<i class="iconfont icon-gerenzhongxin"></i>
					<input class='userName'  ref="userName"    @keyup.enter="getFocus('password')"  v-model="userName"  placeholder='请输入手机号' ></input>
					<i v-if="userName" @click="clearInput('userName')" class="iconfont icon-iconfontcuowu"></i>
				</div>
				<div>
				 	<i class="iconfont icon-mima" ></i>
				 	<input class='pswd' type='password'  ref="password"   v-model="password"  @keyup.enter="login"  placeholder='请输入密码' ></input>
				 	<i v-if="password" @click="clearInput('password')" class="iconfont icon-iconfontcuowu"></i>
				</div>
			  <button class='login' @click='login'>登录</button>
			  <div class='repswd'><span @click='repwd'>忘记密码</span><span @click='reg'>注册</span></div>
			</div>
			<div class="ThirdPartyLogin" ref="ThirdPartyLogin">	
				<div class="ThirdParty_title">
					<div></div>
					<div>第三方登录</div>
					<div></div>
				</div>
				<div class="ThirdParty_content" @click="ThirdPartyLogin"><i class="iconfont icon-weixin"></i></div>
			</div>
		</div>
		<div class="verseion">{{this.$store.state.App_Version}}</div>
	</div>
</template>
<script type="text/javascript">
	import Axios from "axios"
	import $ from "jquery"

	// 使用MD5对密码加密
	import md5 from 'js-md5';

	export default {
		name:"Login",
		data(){
			return{
				userName:"",//用户名
				password:"",//密码
				WarehousesList:[],//仓库列表
				selectMShow:false,//选择仓库蒙版是否出现
			}
		},
		mounted() {
			this.$refs['userName'].focus();
			$("input").attr("maxlength","50");
			window.WXBind_NO_Ajax = this.WXBind_NO_Ajax;
			window.WXBind_YES_Ajax = this.WXBind_YES_Ajax;
			window.VersionShow = this.VersionShow;
			window.SetUserNameAndPassword = this.SetUserNameAndPassword;
			this.loginVueMounted();
			window.WXInstall_Check_Ajax = this.WXInstall_Check_Ajax;
			window.Device_Ajax = this.Device_Ajax;
			this.tellServerAddress(this.HOST);
		},
		created(){
			//
			this.getCookie("e");
		},
		methods:{
			// 检查手机是否安装微信，以免App Store审核被拒
			WXInstall_Check_Ajax:function(isInstall) {

				if(isInstall == "NO") {

					this.$refs['ThirdPartyLogin'].remove();
				}
			},

			loginVueMounted:function(){

				// 安卓
				try {

					CallAndroidOrIOS.callAndroid("登录页面已加载", "");

				} 
				catch(error) {

					// console.log("没有CallAndroidOrIOS.callAndroid方法")
				}

				// 苹果
				try {

						CallAndroidOrIOS("登录页面已加载");
				}
				catch(error) {

					// console.log("没有CallAndroidOrIOS方法")
				}
			},

			tellServerAddress:function(a){

				console.log("tellServerAddress：");

				// 安卓
				try {

					CallAndroidOrIOS.callAndroid("服务器地址", a);

				} 
				catch(error) {

					// console.log("没有CallAndroidOrIOS.callAndroid方法")
				}

				// 苹果
				try {

					CallAndroidOrIOS("服务器地址", a);
				}
				catch(error) {

					// console.log("没有CallAndroidOrIOS方法")
				}
			},

			KeepUserNameAndPassord:function(u, p){

				// 安卓
				try {

					CallAndroidOrIOS.callAndroid("记住帐号密码", u, p);

				} 
				catch(error) {

					console.log("没有CallAndroidOrIOS.callAndroid方法")
				}

				// 苹果
				try {

					CallAndroidOrIOS("记住帐号密码", u, p);
				}
				catch(error) {
					
					console.log("没有CallAndroidOrIOS方法")
				}
			},

		    // 用于安卓自带返回键，当用户类型是货主时，'订单'页面位于主菜单，禁用安卓自带返回键	
			KeepUserType:function(type){

				// 安卓
				try {

					CallAndroidOrIOS.callAndroid("用户类型", type);

				} 
				catch(error) {

					console.log("没有CallAndroidOrIOS.callAndroid方法")
				}
			},

			WXBind_NO_Ajax:function(openid) {

				this.$store.state.WX_Openid = openid;
				this.$router.push({
					name:"Binding",
					query:{
					}
				})
			},
			WXBind_YES_Ajax:function(data) {

				// 填充帐号
				var str = decodeURIComponent(data);
				var obj = JSON.parse(str);
				this.userName = obj.data.cellphone;

				this.$store.state.userInfo = obj.data;
				this.$store.state.WaybillData = [];//我的任务页面数据清空
				this.$store.state.NoSearchFrom = true; // 不是从搜索页面到我的任务页面

				this.setCookie(this.userName,this.password,10*365*60);

				this.KeepUserNameAndPassord(this.userName, this.password);

				this.KeepUserType(obj.data.userType)

				this.$router.push({
					name:"Index",
					query:{
					}
				})
			},
			// 显示版本号
			VersionShow:function(v) {

				this.$store.state.App_Version = v;
			},
			SetUserNameAndPassword:function(u, p) {

				this.userName = u;
				this.password = p;
			},
			Device_Ajax:function(d) {

				this.$store.state.Device = d;
			},
			// 点击登录按钮
			login:function(){

				var that = this;
				
				if(!this.userName){

					that.$alert("用户名不能为空", '提示', {
				        confirmButtonText: '确定',
				        callback: action => {
				            
				        }
				   	})
					
					return;

				}else if(!this.password){

					that.$alert("密码不能为空", '提示', {
				        confirmButtonText: '确定',
				        callback: action => {
				            
				        }
				   	})
					
					return;
				}

				var postData = {
					"cellphone":this.userName,//手机号
					"password":this.password,//密码
					"wxOpenid":"",//openid
				}

				this.httpRequest( "login.do",postData,function(res){

					that.$store.state.userInfo = res.data;
					that.$store.state.WaybillData = [];//我的任务页面数据清空
					that.$store.state.Waybill_NoSearchFrom = true; // 不是从搜索页面到我的任务页面
					that.$store.state.Waybill_needRefresh = true;//我的任务 页面数据是否需要刷新
                    that.$store.state.goodsSource_needRefresh = true;//货源详情  页面数据是否需要刷新

					that.$store.state.CostCount_StoreData = [];//费用统计页面数据清空
					that.$store.state.CostCount_NoSearchFrom = true; // 不是从搜索页面到费用查询页面
					that.$store.state.CostCount_needRefresh = true;//费用统计  页面数据是否需要刷新

					that.setCookie(that.userName,that.password,10*365*60);

					that.KeepUserNameAndPassord(that.userName, that.password);
					
                    that.KeepUserType(res.data.userType)

					
					that.$router.push({
						name:"Index",
						query:{
						}
					})
				})
			},
			// 跳转到 忘记密码 页面 (验证手机号)
			"repwd":function(){

				this.$router.push({
					name:"Identifying",
					query:{
						page:"ForgotPwd"
					}
				})
			},
			// 跳转到 注册 页面 (验证手机号)
			"reg":function(){

				this.$router.push({
					name:"Identifying",
					query:{
						page:"ChooseRole"
					}
				})
			},
			// 第三方登录
			ThirdPartyLogin:function(){

				// 安卓
				try {

					CallAndroidOrIOS.callAndroid("微信登录","");

				} 
				catch(error) {

					//console.log("没有CallAndroidOrIOS.callAndroid方法")
				}

				// 苹果
				try {

						CallAndroidOrIOS("微信登录");

				}
				catch(error) {

						//console.log("没有CallAndroidOrIOS方法")
				}
			},
		}
	}
</script>
<style lang="less" scoped>
	.Login{
		overflow: hidden;	
	}
	.loginContainer{
		width:638/50rem;
		margin:60/50rem auto 0;
		&>div{
			width:638/50rem;
		    height:70/50rem;
		    position: relative;
		    margin-bottom: 50/50rem;
		    .icon-gerenzhongxin,.icon-mima{
		    	position: absolute;
		    	top:8/50rem;
		    	left:20/50rem;
		    	color: #265AC3;
				font-size: 45/50rem;
				font-weight: 500;
		    }
		    .icon-mima{
		    	top: 12/50rem;
		    }
		    .icon-iconfontcuowu{
				right:20/50rem;
				top: 17/50rem;
			}
		}
	    .userName,.pswd{
		    width:638/50rem;
		    height:70/50rem;
		    border-radius: 10/50rem;
		    padding-left: 82/50rem;
		    font-size: 26/50rem;
		    box-sizing: border-box;
		}
		.login{
		    width:640/50rem;
		    height:73/50rem;
		    line-height: 73/50rem;
		    font-size: 30/50rem;
		    background-color:#285DCE;
		    color: #fff;
		    margin-top: 50/50rem;
		    border:none;
		    border-radius: 10/50rem;
		    outline: none;
		}

		div.repswd{
		  margin-top: 30/50rem;
		  font-size: 30/50rem;
		  color: #777;
		}
		div.repswd>span:nth-child(1){
		  float: left;
		}
		div.repswd>span:nth-child(2){
		  float: right;
		}
		
	}
	.ThirdPartyLogin{
		width: 100%;
		overflow: hidden;
		margin-top: 290/50rem;
		.ThirdParty_title{
			margin: 0 auto;
			height: 50/50rem;
			&>div{
				float: left;
				height: 50/50rem;
				font-size:30/50rem;
				color: #265AC3;
			}
			&>div:nth-child(1),&>div:nth-child(3){
				height: 3/50rem;
				margin-top: 22.5/50rem;
				width:247.5/50rem;
			    background:-webkit-gradient(linear, left top, right top, from(#fff), to(#265AC3));
			}
			&>div:nth-child(3){
				background:-webkit-gradient(linear, right top, left top, from(#fff), to(#265AC3));
			}
			&>div:nth-child(2){
				width: 255/50rem;
				text-align: center;
			}
		}
		.ThirdParty_content{
			width: 80/50rem;
			height: 80/50rem;
			border-radius: 50%;
			border:1/50rem solid #469E3D;
			color:#469E3D;
			margin: 30/50rem auto 30/50rem;
			text-align: center;
			line-height: 73/50rem;
			i{
				font-size: 45/50rem;
			}
		}
	}
	@media screen and (max-width: 374px) {	
		.ThirdPartyLogin{
			.ThirdParty_content{
				border:3/50rem solid #469E3D;
			}
		}
	}

	.verseion{
		width:200/50rem;
		height: 40/50rem;
		color: #ccc;
		font-size: 29/50rem;
		text-align: center;
		position: fixed;
		bottom: 0;
		right: 0;
	}
</style>
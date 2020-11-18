<template>
	<div class="Binding">
		<header><i class="iconfont icon-xiangzuo1" @click="toLogin"></i><span>微信登录绑定</span></header>
		<div class="container">
			<div>
				<span>关联后，您的TMS帐号和手机帐号都可以登录</span>
			</div>

			<div>
				<i class="iconfont icon-gerenzhongxin"></i>
				<input class='userName'  ref="userName"  @focus="getFocus('userName')"   style="text-transform:none;"   @keyup.enter="getFocus('password')"  v-model="userName"  placeholder='请输入手机号' ></input>
				<i v-if="userName" @click="clearInput('userName')" class="iconfont icon-cuowu"></i>
			</div>
			<div>
				<i class="iconfont icon-mima" ></i>
				<input class='pswd' type='password'  ref="password"  @focus="getFocus('password')" style="text-transform:none;"  v-model="password"  @keyup.enter="bind"  placeholder='请输入密码' ></input>
				<i v-if="password" @click="clearInput('password')" class="iconfont icon-cuowu"></i>
			</div>
			<button class='bind' @click='bind'>关联</button>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		name:"Binding",
		data(){
			return{

				userName:"",//用户名
				password:"",//密码
				WarehousesList:[],//仓库列表
				selectMShow:false,//选择仓库蒙版是否出现
			}
		},
		methods:{
			toLogin:function(){
				this.$router.push({
					name:"Login",
				})
			},
			KeepUserNameAndPassord:function(u, p){

			// 安卓
			try { CallAndroidOrIOS.callAndroid("记住帐号密码", u, p) } 
			catch(error) { }

			// 苹果
			try { CallAndroidOrIOS("记住帐号密码", u, p)  }
			catch(error) { }
			try { window.webkit.messageHandlers.messageSend.postMessage({a:'记住帐号密码',b:u,c:p}) }
			catch(error) { }
			},

			bind:function(){

				var that = this;
				
				if(!this.userName){

					that.$alert("用户名不能为空", '提示', {
				        confirmButtonText: '确定'
				   	})
					
					return;

				}else if(!this.password){

					that.$alert("密码不能为空", '提示', {
				        confirmButtonText: '确定'
				   	})
					
					return;
				}

				var postData = {
					"wxOpenid":this.$store.state.WX_Openid,
					"cellphone":this.userName,
					"password":this.password,
				}

				this.httpRequest("bindingWX.do",postData,function(res){

					that.$store.state.userInfo = res.data;
					that.$store.state.WaybillData = [];//我的任务页面数据清空
					that.$store.state.Waybill_NoSearchFrom = true; // 不是从搜索页面到我的任务页面
					that.$store.state.CostCount_NoSearchFrom = true; // 不是从搜索页面到费用查询页面

					that.setCookie(that.userName,that.password,1/24*60);

					that.KeepUserNameAndPassord(that.userName, that.password);

					that.$router.push({
						name:"Index",
						query:{
						}
					})

				})
			}
		}
	}
</script>
<style lang="less" scoped>

.Binding{
	.container{
		font-size: 30/50rem;
		width: 100%;
		float: left;

		&>div{
			width: 100%;
			position: relative;
			span{
				margin: 20/50rem auto;
				margin-left: 58/50rem;
				margin-right: 10/50rem;
				display: block;
			}

			.userName,.pswd{
				width:638/50rem;
				height:70/50rem;
				border-radius: 10/50rem;
				padding-left: 82/50rem;
				font-size: 35/50rem;
				box-sizing: border-box;
				margin: 20/50rem auto;
				display: block;
			}

			i.icon-gerenzhongxin,i.icon-mima{
				position: absolute;
				top:15/50rem;
				left:80/50rem;
				color: #265AC3;
				font-size: 40/50rem;
				font-weight: 500;
			}
			i.icon-cuowu{
				position:absolute;
				right:70/50rem;
				font-size: 37/50rem;
				top: 15/50rem;
			}
		}

		.bind{
			width:640/50rem;
			height:73/50rem;
			line-height: 73/50rem;
			font-size: 35/50rem;
			background-color:#285DCE;
			color: #fff;
			margin: 20/50rem auto;
			margin-top: 80/50rem;
			border:none;
			border-radius: 10/50rem;
			outline: none;
			display: block;
		}
	}
}	
</style>
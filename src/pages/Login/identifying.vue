<template>
	<div class="Identifying">
		<header><i class="iconfont icon-xiangzuo1"  @click="toLogin"></i><span>验证手机号</span></header>
		<div class="container">
			<div class='identeContainer'>
			    <div>我们将发送验证码到您的手机</div>
			    <div>
				  	<input placeholder='请输入手机号'   ref="phoneNum"   @keyup.enter="getFocus('identifyingCode')"   v-model="phoneNum" ></input>
				  	<i v-if="phoneNum" @click="clearInput('phoneNum')" class="iconfont icon-iconfontcuowu"></i>
				  	
			    </div>
			    <div>
			    	<input placeholder='请输入验证码'   ref="identifyingCode"   @keyup.enter="nextTo"   v-model="identifyingCode" ></input><i v-if="identifyingCode" @click="clearInput('identifyingCode')" class="iconfont icon-iconfontcuowu"></i>
			    	<div class="button" @click='sendIdentifying'>获取验证码</div>
			    </div>
			    <div class="g_signBtn" @click='nextTo'>下一步</div>
			</div>
			<div v-if="ifTips" class="msg_tips">
				<div class="tips_content">
					<i class="iconfont icon-chenggong1"></i>
					<p>{{tips_Msg}}</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import $ from "jquery"
	export default{
		name:"Identifying",
		data(){
			return{
				page:"wangjimima",//页面
			    phoneNum:"",//手机号
			    identifyingCode:'',//验证码
			    tips_Msg:"",//提示信息
				ifTips:false,//提示信息是否显示
				MinuteNum:60,//发送验证码倒计时
				CountDown:'',//
			}
		},
		mounted(){
			this.$refs['phoneNum'].focus();
		},
		created(){

			if(this.$route.query.page){

				if(this.$route.query.page == "ForgotPwd"){

					this.page = "wangjimima";

				}else if(this.$route.query.page == "Reg"){

					this.page = "zhucezhanghao";
				}
			} 
			
		},
		// 页面销毁前
		beforeDestroy(){

			var that = this;

			clearInterval(that.CountDown)
		},
		methods:{
			// 点击 发送验证码 按钮
			sendIdentifying (){

			    var that = this;

			    if(that.MinuteNum != 60){
			    	return;
			    }

			    if (!that.phoneNum.length) {

			    	that.$alert("请输入手机号", '提示', {
				        confirmButtonText: '确定',
				        callback: action => {
				            
				        }
				   	})

			    }else if(that.phoneNum.length != 11){

			    	that.$alert("请输入正确的手机格式", '提示', {
				        confirmButtonText: '确定'
				   	})

			    }else{

			      var params = {
			        cellphone: that.phoneNum,
			        next_page: that.page
			      }

			      this.httpRequest( "sendYzmToCellphone.do",params,function(res){

			      	that.ifTips = true;
					that.tips_Msg = "验证码已发送";

					$(".button").css("color","#555").html("重新发送(" + that.MinuteNum + ")")

					that.CountDown = setInterval(function(){

						that.MinuteNum -- ;

						$(".button").html("重新发送(" + that.MinuteNum + ")")

						if(that.MinuteNum  < 0 ){

							$(".button").css("color"," #5965D8").html("重新获取验证码");

							that.MinuteNum = 60;

							clearInterval(that.CountDown)
						}
						
					},1000)

					setTimeout(function(){

						that.ifTips = false;
					},1500)

			      })
			    }
			},
			// 点击 下一步 按钮触发，验证用户输入的验证码，跳转到 注册 页面或者 忘记密码 页面
			nextTo (){

			    var that = this;

			    if (!that.phoneNum){

			    	that.$alert("请输入手机号", '提示', {
				        confirmButtonText: '确定',
				        callback: action => {
				            
				        }
				   	})

			    }else if(that.phoneNum.length != 11){

			    	that.$alert("请输入正确的手机格式", '提示', {
				        confirmButtonText: '确定'
				   	})

			    } else if (!that.identifyingCode){

			    	that.$alert("请输入验证码", '提示', {
				        confirmButtonText: '确定',
				        callback: action => {
				            
				        }
				   	})

			    }else{

				    var postData = {
				       cellphone: that.phoneNum,//手机号
				       verificationCode: that.identifyingCode,//验证码
				       next_page: that.page,//哪个页面
				    }

					this.httpRequest( "validateVerificationCode.do",postData,function(res){

						
						if(that.$route.query.page){

							if(that.$route.query.page == "ForgotPwd"){

								that.$router.push({
									name:"ForgotPwd",
									query:{
										phoneNum:that.phoneNum
									}
								})

							}else if(that.$route.query.page == "Reg"){

								that.$router.push({
									name:"Reg",
									query:{
										phoneNum:that.phoneNum
									}
								})
							}
						}
					})
			    }
			}
		}
	}
</script>
<style lang="less" scoped>
	.Identifying{
		overflow: hidden;
		.identeContainer{
			padding: 0 20/50rem;
			box-sizing: border-box;
			width:100%;
			height: 100%;
			font-size: 30/50rem;
			&>div{
				position: relative;
				&:nth-child(1){
				  color: #000;
				  padding: 50/50rem 0;
				}
				&:nth-child(2),&:nth-child(3){
				    overflow: hidden;
				    margin-bottom: 50/50rem;
				    height: 65/50rem;
				    width: 100%;
				    border-bottom: 3/50rem solid #aaa;
					.icon-iconfontcuowu{
						right:20/50rem;
						color: #777;
						top: 12/50rem;
					}
					&>input{
						width: 620/50rem;
					}
				}
				&:nth-child(3){
					.icon-iconfontcuowu{
						right:240/50rem;
					}
					&>input{
						width: 420/50rem;
					}
				}
				&>span:nth-child(1){
				  float: left;
				  margin-right: 30/50rem;
				  height:45/50rem;
				  line-height: 48/50rem;
				  display: block;
				}
				&>input{
				  float: left;
				  width:100%;
				  height: 60/50rem;
				  border: none;
				  border-radius: 0;
				}
				&>.button{
				  position: absolute;
				  right: 0;
				  top: 0;
				  height: 50/50rem;
				  line-height: 50/50rem;
				  box-sizing: border-box;
				  padding:0/50rem 15/50rem;
				  font-size: 28/50rem;
				  color: #5965D8;
				}
			}
			.g_signBtn{
				border-radius:32.5/50rem;
			}
		}
		
	}
	.msg_tips{

	}
</style>
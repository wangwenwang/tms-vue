<template>
	<div class="ForgotPwd">
		<header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>忘记密码</span></header>
		<div class="container">
			<div class='identeContainer'>
			    <div><span>新密码</span><input placeholder='请输入新密码'   ref="newPassWord"   @keyup.enter="getFocus('rePassWord')"    v-model='newPassWord' ></input><i v-if="newPassWord" @click="clearInput('newPassWord')" class="iconfont icon-iconfontcuowu"></i></div>
			    <div><span>确认密码</span><input placeholder='请确认新密码'   ref="rePassWord"   @keyup.enter="submit"    v-model='rePassWord' ></input><i v-if="rePassWord" @click="clearInput('rePassWord')" class="iconfont icon-iconfontcuowu"></i></div>
			    <div  class="g_signBtn"  @click='submit'>找回密码</div>
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
	export default{
		name:"ForgotPwd",
		data(){
			return{
				newPassWord:'',//新密码
			    rePassWord:'',//确认密码
			    tips_Msg:"",//提示信息
				ifTips:false
			}
		},
		mounted(){
			this.$refs['newPassWord'].focus();
		},
		methods:{
			goPrev(){
				this.$router.push({
					name:"Identifying",
					query:{
						page:"ForgotPwd"
					}
				})
			},
			//找回密码
		    submit (){

			    var that = this;

			    if (that.newPassWord== ''){

			        that.$alert("请输入新密码", '提示', {
				        confirmButtonText: '确定',
				   	})

			        return;

			    } else if (that.rePassWord == ''){

			        that.$alert("请输入确认密码", '提示', {
				        confirmButtonText: '确定',
				   	})

			        return;

			    } else if (that.newPassWord !=that.rePassWord){

			    	that.$alert("两次密码输入不一致", '提示', {
				        confirmButtonText: '确定',
				   	})

			        return;

			    }else if(that.newPassWord.length<6){

			    	that.$alert("密码不能小于六位数", '提示', {
				        confirmButtonText: '确定',
				   	})

			        return;

			    }else {

			        var postData = {
				        "cellphone": that.$route.query.phoneNum,//手机号
				        "next_page": "wangjimima",//判断是 忘记密码 页面 ，还是修改密码 页面
				        "oldPassword": that.newPassWord,//密码
				        "password": that.newPassWord
			        };

			        that.httpRequest( "updateUserPassword.do",postData,function(res){

			      		that.ifTips = true;

						that.tips_Msg = res.Msg;

						setTimeout(function(){

							that.ifTips = false;

							that.toLogin();
							
						},1500)
			        })
			    } 
			}
		}
	}
</script>
<style lang="less" scoped>
	.ForgotPwd{
		overflow: hidden;
		.identeContainer{
		    width:100%;
		    height: 100%;
		    overflow: hidden;
		    font-size: 28/50rem;
		    padding: 30/50rem;
		    box-sizing: border-box;
		    &>div{
		    	position: relative;
		    	&>span{
				    float: left;
				    width: 130/50rem;
				    margin-right: 20/50rem;
				    height:60/50rem;
				    line-height: 60/50rem;
				    display: block;
				}
				&>input{
				    float: left;
				    height: 60/50rem;
				    line-height: 60/50rem;
				    width:480/50rem;
				    border: none;
				    border-bottom: 3/50rem solid #000;
				    border-radius: 0;
				}
				.icon-iconfontcuowu{
					top: 40/50rem;
					right: 10/50rem;
				} 
		    }
		    &>div:nth-child(1),&>div:nth-child(2){
			    overflow: hidden;
			    background-color: #fff;
			    padding:30/50rem 0;
			    width: 100%;
			}
		}
	}
</style>
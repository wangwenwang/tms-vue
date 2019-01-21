<template>
	<div class="RePassword">
		<header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>修改密码</span></header>
		<div class='container'>
			<div>
				<span>原密码：</span>
				<input placeholder='请输入原密码' ref="oldpwd"    @keyup.enter="getFocus('newpwd')"   v-model='oldpwd'></input>
				<i v-if="oldpwd" @click="clearInput('oldpwd')" class="iconfont icon-iconfontcuowu"></i>
			</div>
			<div>
				<span>新密码：</span>
				<input type='password'  ref="newpwd"    @keyup.enter="getFocus('reNewpwd')"  placeholder='请输入新密码'  v-model='newpwd'></input>
				<i v-if="newpwd" @click="clearInput('newpwd')" class="iconfont icon-iconfontcuowu"></i>
			</div>
			<div>
				<span>确认密码：</span>
				<input type='password'  ref="reNewpwd"    @keyup.enter="submit"  placeholder='请再次输入新密码'   v-model='reNewpwd'></input>
				<i v-if="reNewpwd" @click="clearInput('reNewpwd')" class="iconfont icon-iconfontcuowu"></i>
			</div>

			<div class='g_signBtn' @click='submit'>提交</div>
		</div>
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
		name:"RePassword",
		data(){
			return{
				oldpwd:"",//旧密码
			    newpwd:"",//新密码
			    reNewpwd:"",//确认新密码
			    tips_Msg:"",//提示信息
				ifTips:false
			}
		},
		created(){

		},
		methods:{
			goPrev(){
				var that = this;

				this.$router.push({
					name:"HomeIndex",
					query:{
					}
				})
			},
			"submit":function(){

			    var that=this;

			    var cellphone = that.$store.state.userInfo.cellphone;

			    if (!this.oldpwd){

			    	that.$alert("请输入原密码！", '提示', {
				        confirmButtonText: '确定',
				   	})

			      return;
			    } else if (!this.newpwd){

			    	that.$alert("请输入新密码！", '提示', {
				        confirmButtonText: '确定',
				   	})

			      return;
			    } else if (!this.reNewpwd){

			    	that.$alert("请确认新密码！", '提示', {
				        confirmButtonText: '确定',
				   	})

			      return;
			    } else if (this.reNewpwd != this.newpwd){

			    	that.$alert("两次新密码不一致！", '提示', {
				        confirmButtonText: '确定',
				   	})

			      return;
			    } else if (this.newpwd.length<6){

			    	that.$alert("密码不能小于6位数！", '提示', {
				        confirmButtonText: '确定',
				   	})

			      return;
			    } else if (this.oldpwd == this.newpwd){

			    	that.$alert("新密码不能与原密码相同！", '提示', {
				        confirmButtonText: '确定',
				   	})

			      return;
			    }else{

			    	var params = {
				        "cellphone": cellphone,
				        "next_page": "xiugaimima",//判断是 忘记密码 页面 ，还是修改密码页面
				        "oldPassword": that.oldpwd,
				        "password": that.newpwd,
				    };

				    that.httpRequest( "updateUserPassword.do",params,function(res){

					    that.ifTips = true;
						that.tips_Msg = "修改成功";

						setTimeout(function(){

							that.ifTips = false;

							that.setCookie(cellphone,"",10*365*60);

							that.$router.push({
								name:"Login",
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
	.RePassword{
		overflow: hidden;
		.container{
		    width:100%;
		    box-sizing: border-box;
		    padding:40/50rem 27.5/50rem 0;
		    &>div{
			    font-size: 30/50rem;
			    overflow: hidden;
			    margin-bottom: 25/50rem;
			    position: relative;
			    &>span{
				    float: left;
				    width:190/50rem;
				    height: 70/50rem;
				    line-height: 70/50rem;
				    text-align: right;
				}
				&>input{
				    width: 480/50rem;
				    height: 70/50rem;
				    border: 2/50rem solid #E8E8E8;
				    border-radius: 10/50rem;
				    float: left;
				    font-size: 26/50rem;
				    padding:0 10/50rem;
				    box-sizing: border-box;
				    outline: none;
				}
				i{
					top:18/50rem;
					right: 50/50rem;
				}
			}
		}
	}

	@media screen and (max-width: 374px){
		.RePassword{
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
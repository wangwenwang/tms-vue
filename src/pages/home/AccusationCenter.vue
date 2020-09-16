<template>
	<div class="AccusationCenter">
		<header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>举报中心</span></header>
		<div class="container">
			<div class="accusation_tel">举报电话：0755-29496953  &nbsp;&nbsp;  18664905470</div>
			<div class="Accusation">
				<div><span>举报对象：</span><input v-model='Informants'></input></div>
				<div class="two">
					<span>举报事项：</span>
					<textarea type='text' placeholder="内容说明" v-model='content'></textarea>
				</div>

				<div class="uploadImg">
					<div class="LoadImg_head">举报图片：</div>
					<div class="upload">
						<el-upload :action = " HOST_ygy+'reportingCenterPicture.do'"  :limit="6" :multiple="true"  :data="uploadParams" ref='upload_ref' :auto-upload="false" list-type="picture-card" :before-upload="beforeUpload"   :on-error="uploadErrorInCurrVue" :on-success="uploadSuccessInCurrVue"   :on-preview="handlePictureCardPreview" >
						  <i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible">
						  <img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
					</div>
				</div>
				<el-checkbox v-model="checked">匿名举报</el-checkbox>
			</div>
			<div class="submit_btn"><div @click="submit_click">提 交</div></div>
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
	import $ from 'jquery'
	export default{
		name:"AccusationCenter",
		data(){
			return{
				Informants:'',//举报对象
				content:'',//举报内容
				dialogImageUrl: '',
		        dialogVisible: false,//是否放大预览照片
		        uploadParams:{},//上传图片时 额外的参数
		        ifTips:false,//是否签名
		        tips_Msg:"",//提示信息
		        checked:true
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

			this.uploadParams.cellphone = this.$store.state.userInfo.cellphone;//手机号
		},
		methods:{
			// 监听系统返回键
            onBrowserBack() {
              
                this.goPrev()
            },
			// 返回上一页
			goPrev(){

				this.$router.push({
					name:"Index",
					query:{
					}
				})
			},
			//提交
			submit_click(response){
				var that = this;
				if(!this.Informants){

					that.$alert('请输入举报对象', '提示', {
			            confirmButtonText: '确定'
		           	})

		           	return;
				}else if(!this.content){

					that.$alert('请输入举报事项', '提示', {
			            confirmButtonText: '确定'
		           	})
		           	return;
				}else{
					this.$refs.upload_ref.submit();
				    var params = {
				        reportingObject: this.Informants,
   						reportingMatters:this.content
				    };
				    that.httpRequest_ygy( "reportingCenter.do",params,function(res){

					    that.ifTips = true;
						that.tips_Msg = "举报成功";

						setTimeout(function(){

							that.ifTips = false;
							that.$router.push({
								name:"Index",
								query:{
								}
							})
						},2000)
		            })
				}
			},
			// 预览放大图片
			handlePictureCardPreview (file) {

			    this.dialogImageUrl = file.url;
			    this.dialogVisible = true;
			},
			// 文件上传成功时的钩子
			uploadSuccessInCurrVue(response, file, fileList){

				console.log("上传照片成功")
			},
			// 文件上传失败时的钩子
			uploadErrorInCurrVue(err, file, fileList){

				console.log("上传照片失败")
			},
		}
	}
</script>
<style lang="less" scoped>
	.AccusationCenter{
		overflow: hidden;
		.container{
			overflow: hidden;
			.accusation_tel{
				background-color: #ECF5FF; 
				padding-left: 20/50rem;
				line-height: 60/50rem;
				color: #757575;
			}
			.Accusation{
				padding:10/50rem 20/50rem;
				.two{
					display: flex;
					textarea{
						width: 530/50rem;
						margin-top: 12/50rem;
						height: 230/50rem;
						outline: none;
						border-radius: 5/50rem;
						padding: 10/50rem;
						box-sizing: border-box;
						border-color: #9999;
					}
				}
				.uploadImg{
					box-sizing: border-box;
					overflow: hidden;
					margin-top: 16/50rem;
				}
			}
			&>div{
				line-height: 80/50rem;
				:nth-child(1){
					color:#757575;
				}
			}
			.submit_btn{
				width: 100%;
				text-align: center;
				position: absolute;
				bottom: 100/50rem;
				div{
					width: 400/50rem;
					border:1/50rem solid #5965D8;
				    color: #ffff;
				    margin:0 auto;
				    border-radius: 40/50rem;
				    background-color: #5965D8;
				    font-size:34/50rem;
				}
			}
		}
	}
</style>
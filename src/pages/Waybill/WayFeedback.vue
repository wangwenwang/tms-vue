<template>
	<div class="WayFeedback">
		<header><i class="iconfont icon-xiangzuo1"  @click="$router.back(-1)"></i><span>途中反馈</span></header>
		<div class="container borderLine">
			<div >
				<div><span>车牌号：</span><span>{{LicensePlateNum}}</span></div>
				<div><span>单号：</span><span>{{OddNum}}</span></div>
			</div>
			<div><span>当前时间：</span><div class="nowDate">{{nowDate}}</div></div>
			<div><span>当前位置：</span><span>{{CurrentLocation}}</span></div>
			<div @click="typeSelect('e')">
				<span>类型：</span>
				<div class="PositionReport"><span>{{type}}</span><i class="iconfont icon-xiangshang"></i></div>
			</div>
			<div class="uploadImg" v-if="type=='异常反馈'">
				<div>上传图片<span>(限6张)</span>：</div>
				<el-upload  :action = " HOST + 'uploadPicture.do'" :auto-upload="false"  :data="uploadParams"  list-type="picture-card" :on-preview="handlePictureCardPreview"  ref="upload_ref"   :multiple="true" :limit="6"  :before-upload="beforeUpload"   :on-error="uploadError" :on-success="uploadSuccess">
				  <i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
				  <img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
			</div>
			<div><span>描述：</span><textarea  v-model="Remark"></textarea></div>
		</div>
		<div v-if="ifTips" class="msg_tips">
			<div class="tips_content">
				<i class="iconfont icon-chenggong1"></i>
				<p>{{tips_Msg}}</p>
			</div>
		</div>
		<div class="submitBtn">
			<p class="g_signBtn"  @click="submit">反馈确认</p>
		</div>
		<div class="SelectMeng"   v-if="typeMShow">
			<div class="SelectWarehouses" >
				<div class="SelectTitle">请选择类型</div>
				<div class="SelectItem">
					<div @click="SelectComit('上报位置')">上报位置</div>
					<div @click="SelectComit('异常反馈')">异常反馈</div>
				</div>
				<div class="cancel"   @click="selectCancel('e')">取消</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	

	import $ from "jquery"

	export default{
		name:"WayFeedback",
		data(){
			return{
				dataList:[],//页面数据
				tips_Msg:"",//提示信息
				ifTips:false,//提示信息是否显示
				LicensePlateNum:"",//车牌号
				OddNum:"",//单号
				CurrentLocation:"",//当前位置
				typeMShow:false,//类型选择蒙版是否显示
				type:"上报位置",
				dialogImageUrl: '',
		        dialogVisible: false,//是否放大预览照片
		        nowDate:"",//当前时间
		        Remark:"",//描述信息
		        uploadParams:{},//上传图片时 额外的参数
			}
		},
		mounted(){


			this.TelliOSORAndroidVueMounted("获取当前位置页面已加载");
			window.SetCurrAddress = this.SetCurrAddress;
		},
		created(){

			this.dataList = this.$route.query.StowageList;

			this.LicensePlateNum = this.dataList.vehicleCode;//车牌号
			this.OddNum = this.dataList.shipmentCode;//单号

			this.nowDate = this.getNowTime();

			this.uploadParams.tenantCode = this.dataList.tenantCode;//租户代码

			this.uploadParams.code = this.dataList.shipmentCode;//单号(交付传运单号过来，到车和中途反馈传配载单号过来)

			this.uploadParams.codeType = "ABNORMAL";//类型为 途中反馈

			this.uploadParams.codeId = this.dataList.shipmentID;//配载单号

			this.uploadParams.cellphone = this.$store.state.userInfo.cellphone;//反馈人手机号
		},
		methods:{
			SetCurrAddress:function(address) {

				if(address == "") {

					this.$alert(msg, '定位失败', {
	            		confirmButtonText: '确定'
           			})
				}else {

					this.CurrentLocation = address;
				}
			},
			submit(){

				var that = this;

				if(this.type == "异常反馈"){

					if(!$(".uploadImg ul>li").length){

						that.$alert('请上传图片', '提示', {
				            confirmButtonText: '确定'
			           	})

			           	return;
					}else if(!that.Remark){

						that.$alert('请填写异常反馈描述信息', '提示', {
				            confirmButtonText: '确定'
			           	})

			           	return;
					}

					this.$refs.upload_ref.submit();
				}
				console.log(this.uploadParams)
				var postData = {
				    shipmentId : this.dataList.shipmentID,//运单ID
				    userName : this.$store.state.userInfo.userName,//反馈人
				    vehicleLocation : this.CurrentLocation,//位置信息
				    trackRemarks : this.Remark,//备注信息
				    traceCategory : this.type,//追踪类型
				    tenantCode: this.dataList.tenantCode,//租户代码
				    appUsersId:that.$store.state.userInfo.user_id,//用户id
			    }

				this.httpRequest( "abnormalInfo.do",postData,function(res){

					that.ifTips = true;
					that.tips_Msg = "操作成功";

					setTimeout(function(){

						that.ifTips = false;
						that.$router.back(-1)

						//需要重新请求数据
				        that.$store.state.Waybill_needRefresh = true;
					},1500)
				})
			},
			// 选择类型
			SelectComit:function(typeName){
				this.type = typeName;
				this.typeMShow = false;
			},
			// 预览放大图片
			handlePictureCardPreview (file) {

			    this.dialogImageUrl = file.url;
			    this.dialogVisible = true;
			}
		}
	}
</script>
<style lang="less" scoped>
	.WayFeedback{
		background-color: #fff;
		overflow: hidden;
	}
	.container{
		overflow: hidden;
		padding-top: 0;

		padding-bottom: 0;
		&>div{
			position: relative;
			width: 100%;
			padding: 20/50rem;
			box-sizing: border-box;
			overflow: hidden;
			&:nth-child(1){
				&>div{
					float: left;
					width: 335/50rem;
					overflow: hidden;
					&:nth-child(2){
						width: 375/50rem;
					}
				}
			}
			&:nth-child(3){
				span{
					float:none;
				}
			}
			&>div.PositionReport{
				float:left;
				width: 620/50rem;
				height: 50/50rem;
				line-height: 50/50rem;
				text-align: right;
				position: relative;
				&>span{
					float: none;
					margin-right: 60/50rem;
				}
				i{
					font-size: 35/50rem;
					position: absolute;
					color: #aaa;
					top:3/50rem;
					right: 1/50rem;
				}
			}
			span{
				float:left;
				height: 50/50rem;
				line-height: 50/50rem;
			}
			textarea{
				float:left;
				width: 610/50rem;
				height: 230/50rem;
				outline: none;
				border-radius: 5/50rem;
				padding: 10/50rem;
				box-sizing: border-box;
			}
			.nowDate{
				float: left;
				height: 50/50rem;
				line-height: 50/50rem;
			}
		}
		&>div.uploadImg{
			div{
				float: none;
			}
			span{
				float: none;
				color: #aaa;
			}
		}
	}
</style>
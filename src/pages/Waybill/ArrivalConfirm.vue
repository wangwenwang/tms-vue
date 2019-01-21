<template>
	<div class="ArrivalConfirm">
		<header><i class="iconfont icon-xiangzuo1"  @click="$router.back(-1)"></i><span>到达确认</span></header>
		<div class="container borderLine">
			<div>
				<div><span>车牌号：</span><span>{{LicensePlateNum}}</span></div>
				<div><span>单号：</span><span>{{OddNum}}</span></div>
			</div>
			<div><span>当前时间：</span><div class="nowDate">{{nowDate}}</div></div>
			<!-- <div><span>当前位置：</span><span>{{CurrentLocation}}</span></div> -->
			<div v-if="!IFselect"><span>到车地址：</span><span>{{PlaceLoading}}</span></div>
			<div class="place"   v-else  @click="typeSelect('e')">
				<div><span>到车地址：</span><span>{{PlaceLoading}}</span></div>
				<i class="iconfont icon-xiangshang"></i>
			</div>
			<div class="uploadImg CarPhoto">
				<div>车辆照片<span>(限3张)</span>：</div>
				<el-upload  :action = " HOST + 'uploadPicture.do'" :auto-upload="false"  :data="uploadParams"  list-type="picture-card"  ref="CarUpload" :limit="3" :multiple="true"   :before-upload="beforeUpload"  :on-error="uploadError" :on-success="uploadSuccess"    :on-preview="handlePictureCardPreview" >
				  <i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
				  <img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
			</div>
			<div class="uploadImg  StationPhoto">
				<div>场站照片<span>(限3张)</span>：</div>
				<el-upload :action = " HOST + 'uploadPicture.do'" :auto-upload="false"  :data="uploadParams"  list-type="picture-card"  ref="StationUpload"  :limit="3" :multiple="true"  :before-upload="beforeUpload"  :on-preview="handlePictureCardPreview" :on-error="uploadError" :on-success="uploadSuccess">
				  <i class="el-icon-plus"></i>
				</el-upload>
				<!-- 放大的图片 -->
				<el-dialog :visible.sync="dialogVisible">
				  <img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
			</div>
		</div>
		<div class="submitBtn">
			<p class="g_signBtn"  @click="submit">反馈确认</p>
		</div>
		<div v-if="ifTips" class="msg_tips">
			<div class="tips_content">
				<i class="iconfont icon-chenggong1"></i>
				<p>{{tips_Msg}}</p>
			</div>
		</div>
		<div class="Navigate_MultiAddress" v-if="typeMShow">
			<div>
				<div class="SelectTitle">请选择到车地址</div>
				<div class="SelectContent">
					<div class="addressContent" @click="SelectComit(itemAddress.issueAddr1)"  v-for='(itemAddress,idx) in address_listData'  :id="idx"  :key='idx'>
						<div>
							<span>{{itemAddress.issueAddr1}}</span>
						</div>
						<div>
							<span>{{itemAddress.issueUser}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>{{itemAddress.issuePhone}}</span><i style="color:#2B5FD8;" @click="callPhone(itemAddress.issuePhone)" class="iconfont icon-dianhua-copy" ></i>
						</div>
					</div>
				</div>
				<div class="cancel"   @click="selectCancel('e')">取消</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">

	import $ from "jquery"
	import lrz from 'lrz'

	export default{
		name:"ArrivalConfirm",
		data(){
			return{
				dataList:[],//页面数据
				LicensePlateNum:"",//车牌号
				OddNum:"",//单号
				nowDate:"",//当前时间
				// CurrentLocation:"",//当前位置
				dialogImageUrl: '',//图片路径
		        dialogVisible: false,//是否放大预览图片
		        tips_Msg:"",//提示信息
				ifTips:false,//提示信息是否显示
				address_listData:[],//多到车地址列表
				typeMShow:true,//选择弹框是否显示
				uploadParams:{},//上传图片时 额外的参数
				IFselect:false,//是否需要选择地址
				PlaceLoading:"",//到车地点
			}
		},
		created(){

			if(this.$route.query.StowageList){

				this.dataList = this.$route.query.StowageList;
			}

			if(this.dataList.issueAddrLiat.length <= 1){

				this.PlaceLoading = this.dataList.issueAddrLiat[0].issueAddr1;//装货地点

				this.IFselect = false;
				this.typeMShow = false;
			}else{

				this.IFselect = true;
				this.typeMShow = true;
			}

			this.address_listData = this.dataList.issueAddrLiat;//多装货地址列表

			this.uploadParams.tenantCode = this.dataList.tenantCode;//租户代码

			this.uploadParams.code = this.dataList.shipmentCode;//单号(交付传运单号过来，到车和中途反馈传配载单号过来)

			this.uploadParams.codeType = "SHIPMENT";//类型为 到车确认

			this.uploadParams.codeId = this.dataList.shipmentID;//配载单号

			this.uploadParams.cellphone = this.$store.state.userInfo.cellphone;//到达人手机号

			this.LicensePlateNum = this.dataList.vehicleCode;//车牌号

			this.OddNum = this.dataList.shipmentCode;//单号
			
			this.nowDate = this.getNowTime();
		},
		methods:{
			submit(){

				var that = this;

				if(!this.PlaceLoading){
					//提示选择到车地址
					that.$alert('请选择到车地址', '提示', {
			            confirmButtonText: '确定'
		           	})
					return;

				}else if(!$(".CarPhoto ul>li").length){

					that.$alert('请选择车辆照片', '提示', {
			            confirmButtonText: '确定'
		           	})

		           	return;
				}else if(!$(".StationPhoto ul>li").length){

					that.$alert('请选择场站照片', '提示', {
			            confirmButtonText: '确定'
		           	})

		           	return;
				}

				this.$refs.StationUpload.submit();
				this.$refs.CarUpload.submit();

				console.log(this.uploadParams)

				var postData = {
					shipmentId : this.dataList.shipmentID,//运单ID
					tenantCode : this.dataList.tenantCode,//租户代码
				    daoDaTime : this.nowDate,//到车时间  2018-08-06 18:56:43
				    daoDaPeople: that.$store.state.userInfo.userName,//到达人
				    daoDaPlace:this.PlaceLoading,//到达地点
				}

				this.httpRequest( "arriveConfirmation.do",postData,function(res){

					that.ifTips = true;
					that.tips_Msg = "操作成功";

					setTimeout(function(){

						that.ifTips = false;
						that.$router.back(-1);
						//需要重新请求数据
				        that.$store.state.Waybill_needRefresh = true;
					},1500)
				})
			},
			// 选择具体装货地点
			SelectComit(detailPlace){

				this.typeMShow = false;
				this.PlaceLoading = detailPlace ;
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
	.ArrivalConfirm{
		width: 100%;
		overflow: hidden;
		.container{
			overflow: hidden;
			padding-bottom: 150/50rem;
			&>div{
				width: 100%;
				padding: 20/50rem;
				height: auto;
				line-height: 55/50rem;
				box-sizing: border-box;
				position: relative;
				overflow: hidden;
				&:nth-child(1){
					&>div{
						float: left;
						width:335/50rem;
						&:nth-child(2){
							width: 375/50rem;
						}
					}
				}
				&:nth-child(3){
					overflow: hidden;
					position: relative;
					div{
						width: 650/50rem;
					}
					span{
						float: left;
				    	height: auto;
				    	width:150/50rem;
				    	&:nth-child(2){
							width: 500/50rem;
				    	}
				    }
				    i{
				    	position: absolute;
				    	top: 50%;
				    	margin-top: -20/50rem;
				    	right: 25/50rem;
				    	line-height:  50/50rem;
				    	color: #7A7A7A;
				    }
				}
				span{
					float:left;
					height: 50/50rem;
					line-height: 50/50rem;
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
	}
</style>
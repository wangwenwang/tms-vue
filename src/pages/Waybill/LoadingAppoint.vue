<template>
	<div class="LoadingAppoint">
		<header><i class="iconfont icon-xiangzuo1"  @click="$router.back(-1)"></i><span>装货预约</span></header>
		<div class="container borderLine">
			<div>
				<div><span>车牌号：</span><span>{{LicensePlateNum}}</span></div>
				<div><span>单号：</span><span>{{OddNum}}</span></div>
			</div>
			<div v-if="!IFselect"><span>装货地点：</span><span>{{PlaceLoading}}</span></div>
			<div class="place"   v-else  @click="typeSelect('e')">
				<div><span>装货地点：</span><span>{{PlaceLoading}}</span></div>
				<i class="iconfont icon-xiangshang"></i>
			</div>
			<div><span>预约时间：</span><el-date-picker size="small" id="datetime"  :editable='false' v-model="AppointmentTime"   type="datetime"  placeholder="选择日期时间"></el-date-picker></div>
			<p class="g_signBtn" @click="submit">确认预约</p>
		</div>
		<div v-if="ifTips" class="msg_tips">
			<div class="tips_content">
				<i class="iconfont icon-chenggong1"></i>
				<p>{{tips_Msg}}</p>
			</div>
		</div>
		<div class="Navigate_MultiAddress" v-if="typeMShow">
			<div>
				<div class="SelectTitle">请选择装货地址</div>
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
	import Axios from "axios"

	export default{
		name:"LoadingAppoint",
		data(){
			return{
				dataList:[],//页面数据
				LicensePlateNum:"",//车牌号
				OddNum:"",//单号
				PlaceLoading:"",//装货地点
				AppointmentTime:"",//预约时间
				tips_Msg:"",//提示信息
				ifTips:false,//提示信息是否显示
				address_listData:[],//多装货地址列表
				typeMShow:true,//选择弹框是否显示
				IFselect:false,//是否需要选择地址
				Exceed:false,//预约时间是否为过去时间
			}
		},
		mounted(){

		},
		created(){

			var that = this;

			console.log(this.$route.query.StowageList)

			if(this.$route.query.StowageList){

				this.dataList = this.$route.query.StowageList;
			}

			this.LicensePlateNum = this.dataList.vehicleCode;//车牌号
			this.OddNum = this.dataList.shipmentCode;//单号

			if(this.dataList.issueAddrLiat.length <= 1){

				this.PlaceLoading = this.dataList.issueAddrLiat[0].issueAddr1;//装货地点

				this.IFselect = false;
				this.typeMShow = false;
			}else{

				this.IFselect = true;
				this.typeMShow = true;
			}
			
			this.address_listData = this.dataList.issueAddrLiat;//多装货地址列表

		},
		methods:{
			submit:function(){

				var that = this;

				if(!this.PlaceLoading){
					//提示选择装货地址
					that.$alert('请选择装货地址', '提示', {
			            confirmButtonText: '确定',
			            callback: action => {
				            
			            }
		           	})
					return;

				}else if(!$("#datetime").val()){
					//提示填写预约时间
					that.$alert('请填写预约时间', '提示', {
			            confirmButtonText: '确定',
			            callback: action => {
				            
			            }
		           	})
					return;
				}

				this.timeCompare(this.getNowTime(),$("#datetime").val(),30);

				if(this.Exceed){

					that.$alert('请修改预约时间,必须大于当前时间30分钟', '提示', {
			            confirmButtonText: '确定'
		           	})
		           	this.Exceed = false;
					return;
				}

				var postData = {
				    shipmentId :  this.dataList.shipmentID,//运单ID
				    yuYueTime : $("#datetime").val(),//预约时间  2018-07-24 2:09:12
				    tenantCode: this.dataList.tenantCode,//租户代码
				    appointLoadingSite:this.PlaceLoading,//装货地点
				    appUsersId:that.$store.state.userInfo.user_id,//用户id
			    }

				this.httpRequest( "loadingReservation.do",postData,function(res){

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
			}
		}
	}
</script>
<style lang="less" scoped>
	.LoadingAppoint{
		overflow: hidden;
	}
	.container{
		overflow: hidden;
		&>div{
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
			&:nth-child(2){
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
				float: left;
				height: 50/50rem;
				line-height: 50/50rem;
			}
		}
	}
</style>
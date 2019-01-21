<template>
	<div class="DepartureConfirm">
		<header><i class="iconfont icon-xiangzuo1"   @click="$router.back(-1)"></i><span>发车确认</span></header>
		<div class="container borderLine">
			<div>
				<div><span>车牌号：</span><span>{{LicensePlateNum}}</span></div>
				<div><span>单号：</span><span>{{OddNum}}</span></div>
			</div>
			<div><span>当前时间：</span><div class="nowDate">{{nowDate}}</div></div>
			<div><span>当前位置：</span><span>{{CurrentLocation}}</span></div>
			<p class="g_signBtn"  @click="submit">发车确认</p>
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
		name:"DepartureConfirm",
		data(){
			return{
				dataList:[],//页面数据
				LicensePlateNum:"",//车牌号
				OddNum:"",//单号
				CurrentLocation:"",//当前位置
				nowDate:"",//当前时间
				tips_Msg:"",//提示信息
				ifTips:false
			}
		},
		mounted(){

			if(this.$store.state.Device == "android") {

				this.TelliOSORAndroidVueMounted("获取当前位置页面已加载");
				window.SetCurrAddress = this.SetCurrAddress;
			}else {

				this.CurrentLocation = this.Geolocation('e');
			}
		},
		created(){

			if(this.$route.query.StowageList){

				this.dataList = this.$route.query.StowageList;
			}
			
			this.LicensePlateNum = this.dataList.vehicleCode;//车牌号
			this.OddNum = this.dataList.shipmentCode;//单号

			this.nowDate = this.getNowTime();
		},
		methods:{
			SetCurrAddress:function(address) {

				if(address == "") {

					this.$alert(msg, '定位失败', {
	            		confirmButtonText: '确定',
	            		callback: action => {
	            		}
           			})
				}else {

					this.CurrentLocation = address;
				}
			},
			submit(){

				var that = this;

				var postData = {
				    shipmentId : this.dataList.shipmentID,//运单ID
				    shipTime : this.nowDate,//发车时间  2018-08-06 18:56:43
				    shipUser : that.$store.state.userInfo.userName,//发车人
				    tenantCode : this.dataList.tenantCode,//租户代码
				    shipPosition: this.CurrentLocation// 当前位置
			    }

				this.httpRequest( "shipConfirmation.do",postData,function(res){

					that.ifTips = true;
					that.tips_Msg = "操作成功";

					setTimeout(function(){

						that.ifTips = false;
						that.$router.back(-1);
						//需要重新请求数据
				        that.$store.state.Waybill_needRefresh = true;
					},1500)
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.DepartureConfirm{
		overflow: hidden;
	}
	.container{
		overflow: hidden;
		&>div{
			position: relative;
			padding: 20/50rem;
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
			span{
				float: left;
				height: 50/50rem;
				line-height: 50/50rem;
			}
			.nowDate{
				float: left;
				height: 50/50rem;
				line-height: 50/50rem;
			}
		}
	}
</style>
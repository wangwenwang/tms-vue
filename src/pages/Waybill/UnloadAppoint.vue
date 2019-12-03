<template>
	<div class="UnloadAppoint">
		<header><i class="iconfont icon-xiangzuo1"  @click="$router.back(-1)"></i><span>卸货预约</span></header>
		<div class="container borderLine">
			<div><span>车 牌 &nbsp;号：</span><span>{{LicensePlateNum}}</span></div>
			<div>
				<div><span>预 约 &nbsp;人：</span><span>{{AppointPerson}}    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  {{AppointTele}}   </span></div>
				
			</div>
			<div><span>卸货地点：</span><span>{{PlaceLoading}}</span></div>
			<div><span>预约时间：</span><el-date-picker size="small" id="datetime"   :editable='false' v-model="AppointmentTime"  :time-arrow-control=true  type="datetime"  placeholder="选择日期时间"></el-date-picker></div>
			<p class="g_signBtn" @click="submit">确认预约</p>
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

	import $ from "jquery"

	export default{
		name:"UnloadAppoint",
		data(){
			return{
				dataList:[],//页面数据
				LicensePlateNum:"",//车牌号
				PlaceLoading:"",//卸货地点
				AppointmentTime:"",//预约时间
				tips_Msg:"",//提示信息
				ifTips:false,//提示信息是否显示
				Exceed:false,//预约时间是否为过去时间
				AppointPerson:"",//预约人
				AppointTele:"",//预约电话
			}
		},
		mounted(){

		},
		created(){

			// 预约人 电话
			this.AppointPerson = this.$store.state.userInfo.userName; //预约人
			this.AppointTele = this.$store.state.userInfo.cellphone;//预约电话

			this.LicensePlateNum = this.$route.query.vehicleCode;//车牌号

			this.PlaceLoading = this.$route.query.recAddr1;//卸货地点
		},
		methods:{
			submit:function(){

				var that = this;

				if(!$("#datetime").val()){
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
				    shipId :  this.$route.query.shipmentID,//配载单ID
				    orgnizationId: this.$route.query.orgnizationId,//客户ID
				    yuYueTime : $("#datetime").val(),//预约时间  2018-07-24 2:09:12
				    tenantCode: this.$route.query.tenantCode,//租户代码
				    receiveAddr:this.PlaceLoading,//卸货地址
				    appUsersId:that.$store.state.userInfo.user_id,//用户id
			    }

				this.httpRequest( "unloadReservation.do",postData,function(res){

					that.ifTips = true;
					that.tips_Msg = "操作成功";

					setTimeout(function(){

						that.ifTips = false;
						that.$router.back(-1);
					},1500)
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.UnloadAppoint{
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
				float: left;
				height: 50/50rem;
				line-height: 50/50rem;
			}
		}
	}
</style>
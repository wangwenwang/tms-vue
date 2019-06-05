<!-- _template_WaybillInfo.vue   配载单信息 组件-->
<template>
    <div class="_template_WaybillInfo">

		<div  class="bigList" v-for='(dataItem,index) in shipmentListData'  :id="index"  :key='index'  >
	  		<div  class="listHead"  @click="Details_waybill(dataItem.shipmentID)" >
					<!-- 导航 -->
					<span  v-if="$store.state.IF_Navigation"  @click="Navigation(index)" class="Navigation">导航</span>
					<!-- 状态 -->
					<span  class="LicensePlate">{{dataItem.status}}</span>
					<!-- 起终点城市 -->
					<div  class="firstLine">
						<span>{{dataItem.startCity}}</span>
						<i class="iconfont icon-jiang" ></i>
						<span>{{dataItem.endCity}}</span>
					</div>
					<!-- 单号 -->
					<div>
						<div>
							<span>配载单号：</span>
							<span>{{dataItem.shipmentCode}}</span>&nbsp;&nbsp;
							<i @click="_ewm(dataItem.shipmentCode)" class="iconfont icon-iconfonterweima" ></i>
						</div>
					</div>
					<div>
						<span>货&nbsp;&nbsp;&nbsp;量：</span>
						<span>{{dataItem.orderNum}} 单 &nbsp; </span>
						<span>{{(dataItem.vol * 0.000001).toFixed(1)}} 方 &nbsp; </span>
						<span>{{(dataItem.wt * 0.000001).toFixed(1)}} 吨 &nbsp; </span>
						<span>{{parseInt(dataItem.qty)}}箱</span>
					</div>
					<div>
						<div>
							<span>物流公司：</span>
							<span>{{dataItem.transPartyName}}</span>
						</div>
					</div>
					<div v-if="dataItem.issueAddrLiat.length==1">
						<span>联 系 &nbsp;人：</span>
						<span>{{dataItem.issueAddrLiat[0].issueUser}}&nbsp;&nbsp;&nbsp; {{dataItem.issueAddrLiat[0].issuePhone}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i @click="callPhone(dataItem.issueAddrLiat[0].issuePhone)" class="iconfont icon-dianhua-copy" ></i>
					</div>
					<div v-if="dataItem.issueAddrLiat.length==1">
						<span>装货地址：</span>
						<span>{{dataItem.issueAddrLiat[0].issueAddr1}}</span>
					</div>
					<div v-else>
						<i class="iconfont icon-tishi" ></i>
						<span  @click="MultiAddress(index)" style="color:#5965D8; ">查看多装货地址</span>
					</div>
		
				<div class="mileage">
					<div>
						<span>卸货点：</span>
						<span>{{dataItem.xieHuoDian}}</span>
					</div>
					<div style="color: green;">
						<span>里程数：</span>
						<span>{{dataItem.distance}}</span>
					</div>
				</div>
				<div v-if="dataItem.issueAddrLiat.length == 1 && dataItem.issueAddrLiat[0].phoneAppointTime">
					<span>预约时间：</span>
					<span>{{dataItem.issueAddrLiat[0].phoneAppointTime}}</span>
				</div>
				<div v-if="dataItem.issueAddrLiat.length == 1 && dataItem.issueAddrLiat[0].phoneAppointTime">
					<span>预约状态：</span>
					<span>{{dataItem.issueAddrLiat[0].appointLoadingStatus == "NEW" ? "新预约": dataItem.issueAddrLiat[0].appointLoadingStatus == "YI" ? "已确定" : dataItem.issueAddrLiat[0].appointLoadingStatus == "REFUSE" ? "已拒绝" : ""}}</span>
				</div>
					<!-- // appointLoadingStatus;//装车预约状态：NEW=新预约，YI=已确定，REFUSE=已拒绝 -->
			</div>
			<p>
				<!-- 接单反馈 -->
				<!-- 接收  拒绝   拒绝原因 -->
				<!-- 
					新建
					开始装车
					在途
					未交付
				 -->
				<span v-if="dataItem.status == '新建'"  @click="LoadingAppoint(index)">装货预约</span>
				<!-- <span v-else style="background-color: #aaa;">装货预约</span> -->
				<span v-if="dataItem.status == '新建' "  @click="toArrivalConfirm(index)">到达确认</span>
				<span v-else   style="background-color: #aaa;">到达确认</span>
				<span v-if="dataItem.status == '新建' || dataItem.status == '开始装车'"  @click="toDepartureConfirm(index)">发车确认</span>
				<span v-else   style="background-color: #aaa;">发车确认</span>
				<span v-if="dataItem.status == '在途'|| dataItem.status == '未交付' "  @click="toWayFeedback(index)">途中反馈</span>
				<span v-else   style="background-color: #aaa;">途中反馈</span>
				<span class="viewbtn" v-if="dataItem.status != '新建' "  @click="ViewTrajectoryInVue(dataItem.shipmentID, dataItem.shipmentCode)">查看已行驶</span>
			</p>
		</div>
		<!-- 查看多装货地址弹出框 -->
		<div class="MultiAddress">
			<div>
				<i @click="closeAddress"  class="iconfont icon-iconfontcuowu" ></i>
				<div class="addressHead">
					<span  @click="address_SwitchView(idx)"  v-for='(itemAddHead,idx) in address_listData'  :id="idx"  :key='idx' >地址{{idx+1}}</span>
				</div>
				<div class="addressContent">
					<div>
						<span>地址：</span>
						<span>{{currentAddressInfo.issueAddr1}}</span>
					</div>
					<div>
						<span>联系人：</span>
						<span>{{currentAddressInfo.issueUser}}</span>
					</div>
					<div>
						<span>电话：</span>
	 					<span>{{currentAddressInfo.issuePhone}}</span> &nbsp;&nbsp;&nbsp;&nbsp;  <i style="color:#5965D8; " @click="callPhone(currentAddressInfo.issuePhone)" class="iconfont icon-dianhua-copy" ></i>
					</div>
					<div v-if="currentAddressInfo.phoneAppointTime">
						<span>预约时间：</span>
						<span>{{currentAddressInfo.phoneAppointTime}}</span>
					</div>
					<div v-if="currentAddressInfo.phoneAppointTime">
						<span>预约状态：</span>
						<span>{{currentAddressInfo.appointLoadingStatus}}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 导航地址弹出框 -->
		<div class="Navigate_MultiAddress" v-if="typeMShow">
			<div>
				<div class="SelectTitle">请选择导航地址</div>
				<div class="SelectContent">
					<div class="addressContent" @click="Navigate_SelectComit(itemAddress.issueAddr1)"  v-for='(itemAddress,idx) in Navigate_addressList'  :id="idx"  :key='idx'>
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

<script>
import $ from "jquery"
export default {
    name:"WaybillInfo_template",
    data(){
	    return{
	        Exceed:false,//预约时间是否超出当前时间
	        currentAddressInfo:{},//当前显示的地址数组信息
	        address_listData:[],//当前多地址配载单的地址数组信息 shipmentListData[i].issueAddrLiat
	        typeMShow:false,//导航地址弹出框是否出现
	        Navigate_addressList:[],//导航地址列表
	    }
    },
    props:{
		shipmentListData:{
		},
    },
    created(){

    	var that = this;

     	
    },
    methods:{
		// 查看轨迹
		ViewTrajectoryInVue(shipmentID, shipmentCode){
			
			this.ViewTrajectoryInMain(shipmentID, shipmentCode, "在途");
		},
    	// 跳转到二维码页面
		_ewm(shipmentCode){
			event.stopPropagation();

			this.$router.push({
				name:"QRCode",
				query:{
					shipmentCode:shipmentCode,//配载单号
				}
			})
		},
		// 跳转到 装货预约 页面
 		LoadingAppoint  (index){
			event.stopPropagation();

			var that = this;

			this.$router.push({
				name:"LoadingAppoint",
				query:{
					StowageList : that.shipmentListData[index]
				}
			})
		},

		// 跳转到 到达确认 页面
 		toArrivalConfirm  (index){

			event.stopPropagation();

			var that = this;

			this.$router.push({
				name:"ArrivalConfirm",
				query:{
					StowageList : that.shipmentListData[index]
				}
			})
		},
		// 跳转到 途中反馈 页面
 		toWayFeedback  (index){

			event.stopPropagation();

			var that = this;

			this.$router.push({
				name:"WayFeedback",
				query:{
					StowageList : that.shipmentListData[index]
				}
			})
		},
		// 跳转到 发车确认 页面
 		toDepartureConfirm  (index){

			event.stopPropagation();

			var that = this;

			this.$router.push({
				name:"DepartureConfirm",
				query:{
					StowageList : that.shipmentListData[index]
				}
			})
		},
		// 跳转到配载单详情
		Details_waybill(shipmentID){

			this.$store.state.Waybill.WaybillInfo.WaybillInfo = this.shipmentListData;

			this.$router.push({
	            name:"WaybillInfo",
	            query:{
					shipmentID : shipmentID
				}
	        })
		}
    }
}
</script>

<style lang="less" scoped>
.bigList{
	background-color: #F4F4F4;
	border-top-right-radius: 20/50rem;
	border-top-left-radius: 20/50rem;
	text-align: left;
	margin-bottom: 15/50rem;
	overflow: hidden;
	&>p{
		margin:10/50rem 20/50rem;
		margin-bottom: 20/50rem;
		display: flex;
		span{
			flex-grow:1;
			margin-left: 15/50rem;
			text-align: center;
			background-color: #5965D8;
			color: #fff;
			border-radius: 15/50rem;
			padding: 8/50rem 0;
		}
		span:nth-child(1){
			margin-left:0;
		}
	}
}
	.listHead{
		overflow: hidden;
		position: relative;
		width: 100%;
		padding: 20/50rem;
		padding-bottom: 0;
		background-color: #F4F4F4;
		box-sizing: border-box;
		&>div{
			line-height: 55/50rem;
			overflow: hidden;
			&>div{
				float: left;
			}
		}
		.firstLine{
			width: 600/50rem;
			span{
				float: left;
				&:nth-child(1){
					margin-left: 180/50rem;
				}
			}
			.icon-jiang{
				margin:0 15/50rem;
				float: left;
			}
		}
		.mileage{
			&>div{
				width: 355/50rem;
			}
			div:nth-child(2){
				text-align:center;
			}
		}
		.iconfont{
			font-size: 35/50rem;
			color: #2B5FD8;
			margin-right: 5/50rem;
		}
		.LicensePlate{
			position: absolute;
			top: 20/50rem;
			left: 0;
			background-color: #5965D8;
			padding:0  25/50rem;
			height: 50/50rem;
			line-height: 50/50rem;
			color: #fff;
			border-radius: 0 25/50rem 25/50rem 0;
		}
		.Navigation{
			position: absolute;
			right: 20/50rem;
			top: 20/50rem;
			width:100/50rem;
			height: 100/50rem;
			line-height: 100/50rem;
			background-color: #5965D8;
			border-radius: 50%;
			text-align: center;
			color: #fff;
		}
	}
</style>
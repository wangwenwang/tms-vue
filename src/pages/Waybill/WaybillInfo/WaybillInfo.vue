<template>
	<div class="WaybillInfo">
		<header><i class="iconfont icon-xiangzuo1"   @click="goprev"></i><span>配载单信息</span></header>
		<div class="container">
			<div class="waybillContainer">

				<div  class="bigList" >

					<!-- 配载单信息 -->
					<WaybillInfo_template  @isLoading_="fullscreenLoading"   v-bind:shipmentListData="shipmentListData"  />

					<!-- 订单信息 -->
					<OrderInfo_template   v-bind:_orderInfo="orderList,shipmentID" />
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">

	import $ from "jquery"

	// 配载单信息 组件
	import WaybillInfo_template from '../_template_WaybillInfo'

	// 订单信息 组件
	import OrderInfo_template from "./_template_orderInfo"
	export default{
		name:"WaybillInfo",
		
		data(){
			return{
				shipmentID:"",//配载单id
				shipmentListData:[],//配载单信息
				orderList:[],//订单列表
			}
		},
		components:{
			OrderInfo_template,// 订单信息 组件
			WaybillInfo_template,//配载单信息组件
		},
		created(){

			var that = this;

			if(this.$route.query.shipmentID){

				this.shipmentID = this.$route.query.shipmentID;

			}
			
			var postData = {
				shipmentId: that.shipmentID,//配载单id
		    };

			this.httpRequest("queryDeliverDetailInfo.do",postData,function(res){

				if(res.data.length){

					that.shipmentListData = res.data[0];//配载单信息

					that.$store.state.Waybill.WaybillInfo.WaybillInfo =  res.data[0][0];

					that.orderList = res.data[1];//订单列表

					if(that.shipmentListData[0].status == "新建"){

						that.orderList[0].notOperate = true;

					}else{
						that.orderList[0].notOperate = false;
					}
					
					for(var m = 0; m < res.data[1].length; m++){

						// 判断订单是否可以进行交付动作
						if( res.data[1][m].status == "未交付" && that.shipmentListData[0].status != "新建"){
							// 可交付
							that.orderList[m].ifDeliver = true;

						}else{
							// 不可交付
							that.orderList[m].ifDeliver = false;
						}
					}

				}else{

					//不需要弹出框提示，页面显示“没有数据”

				}
			})
		},
		methods:{
			// 返回上一页
			goprev(){

				this.$router.push({
					name:"Waybill",
					query:{
					}
				})

			},
			//导航地址出现  加载特效出现  子传父事件 
			"fullscreenLoading"(isLoad,loadingText){

				console.log(isLoad,loadingText)

				this.$emit('isLoading', isLoad,loadingText);

			},
			// 点击导航按钮
			Navigation(idx){
				event.stopPropagation();

				var that = this;

				this.Navigate_addressList = [];

				// 装货地址列表
				var loading_addressList = that.bigListData[idx].issueAddrLiat;

				// 送货地址列表
				var Delivery_List = that.bigListData[idx].deliveryList

				var Delivery_addressList = [];
				for(var m = 0; m < Delivery_List.length; m++){

					Delivery_addressList[m] = {
						issueAddr1: Delivery_List[m].recAddr1,//地址
						issuePhone: Delivery_List[m].recPhone,//电话
						issueUser: Delivery_List[m].recName,//联系人
					}
				}

				this.Navigate_addressList = loading_addressList.concat(Delivery_addressList);

				this.typeMShow = true;
			},
			// 选择具体要 导航的地址
			Navigate_SelectComit(Navigate_detailAddress){

				// 选择的导航具体地址
				var  Navigate_detailAddress= Navigate_detailAddress;

				console.log(Navigate_detailAddress);

				this.typeMShow = false;

				// 安卓
				try {
					CallAndroidOrIOS.callAndroid("导航", Navigate_detailAddress);
				} 
				catch(error) {
					console.log("没有CallAndroidOrIOS.callAndroid方法")
				}
				// 苹果
				try {
					CallAndroidOrIOS("导航", Navigate_detailAddress);
				}
				catch(error) {
					console.log("没有CallAndroidOrIOS方法")
				}
			},
			// 跳转到 装货预约 页面
			LoadingAppoint:function(idx){
				event.stopPropagation();

				var that = this;

				this.$router.push({
					name:"LoadingAppoint",
					query:{
						StowageList : that.bigListData[idx]
					}
				})
			},
			// 跳转到 到达确认 页面
			toArrivalConfirm:function(idx){

				event.stopPropagation();

				var that = this;

				this.$router.push({
					name:"ArrivalConfirm",
					query:{
						StowageList : that.bigListData[idx]
					}
				})
			},
			// 跳转到 途中反馈 页面
			toWayFeedback:function(idx){

				event.stopPropagation();

				var that = this;

				this.$router.push({
					name:"WayFeedback",
					query:{
						StowageList : that.bigListData[idx]
					}
				})
			},
			// 跳转到 发车确认 页面
			toDepartureConfirm:function(idx){

				event.stopPropagation();

				var that = this;

				this.$router.push({
					name:"DepartureConfirm",
					query:{
						StowageList : that.bigListData[idx]
					}
				})
			},
			// 跳转到 批量交付页面（按照送货地址）
			toOrderDetails:function(shipmentID,tenantCode,detailInfo,WaybillStatus){

				this.$store.state.WaybillInfo = {
					"detailInfo":detailInfo,//按地址交付页面 客户信息
					"shipmentID":shipmentID,//配置单id
					"tenantCode":tenantCode,//租户代码
					"WaybillStatus":WaybillStatus,//配载单状态
				}
				
				this.$router.push({
					name:"OrderDetails",
					query:{
					}
				})
			},
		}
	}
</script>
<style lang="less" scoped>
.WaybillInfo{
	overflow: hidden;
}
.bigList{
	text-align: left;
	margin-bottom: 150/50rem;
}
</style>
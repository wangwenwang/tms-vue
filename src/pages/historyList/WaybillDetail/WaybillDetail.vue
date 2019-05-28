<template>
	<div class="WaybillDetail">
		<header><i class="iconfont icon-xiangzuo1"   @click="goprev"></i><span>订单详情</span></header>
		<div class="container">
			<div class="waybillHead" style="margin-top:0;">配载单信息</div>
			<div  class="listHead">

				<div  class="firstLine">
					<span>{{shipmentListData.startCity}}</span>
					<i class="iconfont icon-jiang" ></i>
					<span>{{shipmentListData.endCity}}</span>
					<span class="addDate">{{shipmentListData.addDate}}</span>
				</div>
				<!-- 单号 -->
				<div>
					<span>配载单号：</span>
					<span>{{shipmentListData.shipmentCode}}</span>
				</div>
				<div>
					<span>货&nbsp;&nbsp;&nbsp;量：</span>
					<span>{{shipmentListData.orderNum}} 单 &nbsp; </span>
					<span>{{(shipmentListData.vol * 0.000001).toFixed(1)}} 方 &nbsp; </span>
					<span>{{(shipmentListData.wt * 0.000001).toFixed(1)}} 吨 &nbsp; </span>
					<span>{{parseInt(shipmentListData.qty)}}箱</span>
				</div>
				<div>
					<span>物流公司：</span>
					<span>{{shipmentListData.transPartyName}}</span>
				</div>
				<div v-if="shipmentListData.issueAddrLiat.length==1">
					<span>联 系 &nbsp;人：</span>
					<span>{{shipmentListData.issueAddrLiat[0].issueUser}}&nbsp;&nbsp;&nbsp; {{shipmentListData.issueAddrLiat[0].issuePhone}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i @click="callPhone(shipmentListData.issueAddrLiat[0].issuePhone)" class="iconfont icon-dianhua-copy" ></i>
				</div>
				<div v-if="shipmentListData.issueAddrLiat.length==1">
					<span>装货地址：</span>
					<span>{{shipmentListData.issueAddrLiat[0].issueAddr1}}</span>
				</div>
				<div v-else @click="MultiAddress(null)">
					<i class="iconfont icon-tishi" ></i>
					<span style="color:#5965D8; ">查看多装货地址</span>
				</div>
				<div v-if="shipmentListData.issueAddrLiat.length == 1 && shipmentListData.issueAddrLiat[0].phoneAppointTime">
					<span>预约时间：</span>
					<span>{{shipmentListData.issueAddrLiat[0].phoneAppointTime}}</span>
				</div>
				<div v-if="shipmentListData.issueAddrLiat.length == 1 && shipmentListData.issueAddrLiat[0].phoneAppointTime">
					<span>预约状态：</span>
					<span>{{shipmentListData.issueAddrLiat[0].appointLoadingStatus == "NEW" ? "新预约": shipmentListData.issueAddrLiat[0].appointLoadingStatus == "YI" ? "已确定" : shipmentListData.issueAddrLiat[0].appointLoadingStatus == "REFUSE" ? "已拒绝" : ""}}</span>
				</div>
			</div>

			<!-- 订单信息 -->
			<OrderInfo_template   v-bind:_orderInfo="orderList,historyList" />
		</div>
		<!-- 查看多装货地址弹出框 -->
		<div class="MultiAddress">
			<div>
				<i @click="closeAddress"  class="iconfont icon-iconfontcuowu" ></i>
				<div class="addressHead">
					<span  @click="address_SwitchView(idx,'usedtemplate')"  v-for='(itemAddHead,idx) in address_listData'  :id="idx"  :key='idx' >地址{{idx+1}}</span>
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
	</div>
</template>
<script type="text/javascript">
	
	// 订单信息 组件
	import OrderInfo_template from "../../Waybill/WaybillInfo/_template_orderInfo"

	export default{
		name:"WaybillDetail",
		data(){
			return{
				shipmentListData:[],//页面数据  json格式
				orderList:[],//订单列表
				address_listData:[],// 当前多地址配载单的地址数组信息 shipmentListData[i].issueAddrLiat
				shipmentID:"",//配载单id
				currentAddressInfo:[],// 当前显示的地址数组信息
				historyList:true,//是否是历史任务页面跳转来
			}
		},
		components:{
			OrderInfo_template,// 订单信息 组件
		},
		created(){

			var that = this;

			if(this.$route.query.shipmentID){

				this.shipmentID = this.$route.query.shipmentID;
			}
			
			var postData = {
				shipmentId: that.shipmentID,//配载单id
				appointLoadingSite:"YI",//查询已交付状态配载单
		    };

			this.httpRequest("queryDeliverDetailInfo.do",postData,function(res){

				if(res.data.length){

					// that.shipmentListData = res.data[0][0];

					if(res.data[0].length){

						that.shipmentListData = res.data[0][0];

					}else{
						that.shipmentListData = that.$store.state.search_WaybillDetail;
					}

					that.orderList = res.data[1];
					
					// that.$store.state.Waybill.shipmentListData.orderList = res.data;
					
					for(var m = 0; m < res.data[1].length; m++){

						that.orderList[m].ifDeliver = false;
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
					name:"historyList",
					query:{
					}
				})

			},
		}
	}
</script>
<style lang="less" scoped>
	.WaybillDetail{
		overflow: hidden;
		.container{
			overflow: hidden;
			&>div{
				overflow: hidden;
				position: relative;
				width: 100%;
				// padding: 20/50rem;
				box-sizing: border-box;	
				&>div{
					line-height: 55/50rem;
					overflow: hidden;
				}
				.iconfont{
					font-size: 35/50rem;
					color: #2B5FD8;
					margin-right: 5/50rem;
				}
			}
			&>div.listHead{
				padding:0 16/50rem;
				box-sizing: border-box;
				&>p{
					margin-top: 10/50rem;
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
				&>div{
					&.firstLine{
						span{
							float: left;
						}
						.icon-jiang{
							margin:0 15/50rem;
							float: left;
						}
						span:last-child{
							float: right;
							color: #777;
							font-size: 26/50rem;
						}
					}
				}
			}
			.waybillHead{
				height: 65/50rem;
				line-height: 65/50rem;
				background-color:#F4F4F4;
				// margin-top: 30/50rem;
				text-align: center;
				// padding: 10/50rem 20/50rem;
			}
		}
	}
</style>
<template> 
	<div class="OrderDetails">
		<header><i class="iconfont icon-xiangzuo1"  @click="$router.back(-1)"></i><span>按地址交付</span></header>
		<div class="container">
			<div class='WaybillInfo'>
			    <div><span>收货地址：</span><span>{{$route.query.receiveAddr}}</span></div>
		 		<div>配载单号：<span>{{WaybillInfo.shipmentCode}}</span></div>
		    	<div>货&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量：
		    		<span>{{WaybillInfo.orderNum}} 单 &nbsp;&nbsp; </span>
		    		<span>{{(WaybillInfo.vol * 0.000001).toFixed(2)}}方&nbsp;&nbsp;&nbsp; </span>
		    		<span>{{(WaybillInfo.wt * 0.000001).toFixed(2)}}吨 &nbsp;&nbsp;&nbsp; </span>
		    		<span>{{parseInt(WaybillInfo.qty)}}箱</span>
		    	</div>
		    	<div>物流公司：<span>{{WaybillInfo.transPartyName}}</span></div>
			</div>
			<div class="OrderList">
				<el-table ref="multipleTable" :data="orderList"  tooltip-effect="dark" style="width: 100%" border 
				:header-cell-style="{'background-color': '#D6E9F9',  'font-weight': '600' }" 
				@selection-change="handleSelectionChange" refs="multipleTable"> 
				    <el-table-column type="selection"  width="45"> </el-table-column>
                    <el-table-column prop="orderList.omsNo" label="客户单号"  width="140">
                        <template slot-scope="scope">{{ scope.row.clientOrderNo }}</template>
                    </el-table-column>

                    <el-table-column  prop="orderList.omsNo" label="商品明细" fit="true" width="360"> 
                    	<template slot-scope="scope">
                    		<div v-for='(Item,idx) in scope.row.deliveryDetailList' :id="idx" :key='idx'>{{Item.productName}}&nbsp;&nbsp;&nbsp;      {{Item.poOrderQty}}{{Item.poUom}}
                    		</div>
					    </template>
                    </el-table-column>
				</el-table>
			    <div style="margin-top: 20px">
			        <el-button @click="chooseAll()">全选</el-button>
			        <el-button @click="toggleSelection()">取消全选</el-button>
			    </div>

			    <div  class="g_doubleBtn bottomBtn"> 
			        <div  @click="toOrderDeliver('chooseAll')">批量交付</div>
			    </div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import $ from "jquery"

	// 订单信息 组件
	import OrderInfo_template from "../_template_orderInfo"
	export default{
		name:"OrderDetails",
		data(){
			return{
				WaybillInfo:[],//头部总信息
				orderList:[],//订单信息 数据
				shipmentListDataNo:"",//装运编号
			    multipleSelection: [],//选择的订单
			}
		},
		components:{
			OrderInfo_template,// 订单信息 组件
		},
		created(){

			var that = this;

			this.WaybillInfo = that.$store.state.Waybill.WaybillInfo.WaybillInfo;
			this.shipmentListDataNo = that.$route.query.shipmentListDataNo;

			var postData = {
				shipmentId: this.$route.query.shipmentID,//配载单ID
				receiveAddr: this.$route.query.receiveAddr,//送货地址
			}

			this.httpRequest( "queryDeliverDetailInfo.do",postData,function(res){

				if(res.data[1].length){

					that.orderList = res.data[1];
					that.$nextTick(() => {
						for(var i=0; i<that.orderList.length; i++){
							that.$refs.multipleTable.toggleRowSelection(that.orderList[i],true)
						}
					})
				}
			})
		},
		methods:{
			//全选
			chooseAll(){
				for(var i=0; i<this.orderList.length; i++){
					this.$refs.multipleTable.toggleRowSelection(this.orderList[i],true)
				}
			},
			//批量交付
			toOrderDeliver(index){

				event.stopPropagation();
				var that = this;

				var orderSum = that.orderList.length;
				var submitSum = that.multipleSelection.length;
				var deliverNo_list = [];
				for(var i = 0 ; i < that.multipleSelection.length;i++){

					deliverNo_list[deliverNo_list.length] = that.multipleSelection[i].deliveryId;
			    }
			    if(submitSum != orderSum){
			    	if(!submitSum){
				    	that.$alert("请选择订单！", '提示', {
	    
				   		    confirmButtonText: '确定',
			  			})
				    }else{
				    	that.$confirm('该地址共有'+orderSum+'个订单需交付，本次共交付'+submitSum+'个订单', '提示', {
				            confirmButtonText: '确定',
				            cancelButtonText: '取消',
				            type: 'warning',
				            closeOnClickModal: false,
				        }).then(() => {
				            // 按地址交付
	                        that.$router.push({
								name:"orderDeliver",
								query:{
									deliverNo_list:deliverNo_list,
									shipmentListDataNo:that.shipmentListDataNo
								}
							})
				        }).catch(() => { })
				    }
				}else{
                    that.$router.push({
						name:"orderDeliver",
						query:{
							deliverNo_list:deliverNo_list,
							shipmentListDataNo:that.shipmentListDataNo
						}
					})
				}
			},

		    toggleSelection(rows) {
		        if (rows) {
		          rows.forEach(row => {
		            this.$refs.multipleTable.toggleRowSelection(row);
		          });
		        } else {
		          this.$refs.multipleTable.clearSelection();
		        }
		    },

		    handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },

		}
	}
</script>
<style lang="less" scoped>
	.OrderDetails{
		width: 100%;overflow: hidden;
		.container{
			overflow: hidden;
			padding-bottom: 150/50rem;
			width:100%;
		  	font-size: 29/50rem;
			.WaybillInfo{
				padding:0 16/50rem;
				box-sizing: border-box;
				background-color: #fff;
			  	overflow: hidden;
			  	padding-bottom: 50/50rem;
			  	&>div{
				  	overflow: hidden;
				  	line-height: 60/50rem;
				  	&:nth-child(1){
				  		overflow: hidden;
				  		span{
				  			float: left;
				  			&:nth-child(2){
					  			width: 550/50rem;
					  		}
				  		}
				  	}
				}
			}
			.orderHead{
				text-align: center;
				height: 65/50rem;
				line-height: 65/50rem;
				color: #000;
				background-color: #EDEFF3;
			}
			.goodsInfo{
				color: #777;
				padding:0 16/50rem;
				box-sizing: border-box;
			  	border-bottom: 8/50rem solid #EDEFF3;
			  	background-color: #fff;
			  	.goodsHead{
			  		padding-top: 10/50rem;
			  		overflow: hidden;
			  		// height: 70/50rem;
			  		line-height: 55/50rem;
			  		border-bottom: 1/50rem solid #EDEFF3;
			  		span.iconfont{
						color:#285DCE;
						font-size: 40/50rem;
						float: right;
						margin-right: 20/50rem;
			  		}
			  		span:nth-child(3),span:nth-child(4),span:nth-child(5){
			  			float: left;
			  			width: 100%;
			  		}
			  	}
			  	.goodsContent{
			  		&>div{
			  			margin-top: 20/50rem;
			  		}
			  	}
			  	.goodsBtn{
			  		height: 80/50rem;
			  		margin-top: 20/50rem;
			  		overflow: hidden;
			  		.TakeUp{
			  			float: left;
				  		text-align: center;
				  		height: 60/50rem;
				  		line-height: 60/50rem;
				  		overflow: hidden;
				  		
				  		div{
				  			color: #5965D8;
				  			overflow: hidden;
				  			display: inline-block;
				  			height: 80/50rem;
				  			margin: 0 auto;
				  		}
				  		span{
				  			float: left;
				  		}
				  		i{
				  			float: left;
				  			font-size: 50/50rem;
				  		}
				  	}
					span{
						float: right;
						height:60/50rem;
						line-height: 60/50rem;
						width: 200/50rem;
					}
					span.ewm{
						margin-right: 15/50rem;
					}
			  	}
			}
			
			//按钮 此页面公共样式
			span.g_btn{
				border-radius:10/50rem;
				color:#fff;
				background-color: #6897FF;
				text-align: center;
			}
			.bottomBtn{
				width: 100%;
				height: 90/50rem;
				position: fixed;
				bottom: 0;
				div{
					border-radius: 35/50rem;
				}
			}
		}
	}
</style>
<template> 
	<div class="OrderDetails">
		<header><i class="iconfont icon-xiangzuo1"  @click="$router.back(-1)"></i><span>按地址交付</span></header>
		<div class="container">
			<div class='WaybillInfo'>
			    <div><span>收货地址：</span><span>{{$route.query.receiveAddr}}</span></div>
		 		<div>配载单号：<span>{{WaybillInfo.shipmentCode}}</span></div>
		    	<div>货&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量：
		    		<span>{{WaybillInfo.orderNum}} 单 &nbsp;&nbsp; </span>
		    		<span>{{(WaybillInfo.vol * 0.000001).toFixed(1)}}方&nbsp;&nbsp;&nbsp; </span>
		    		<span>{{(WaybillInfo.wt * 0.000001).toFixed(1)}}吨 &nbsp;&nbsp;&nbsp; </span>
		    		<span>{{parseInt(WaybillInfo.qty)}}箱</span>
		    	</div>
		    	<div>物流公司：<span>{{WaybillInfo.transPartyName}}</span></div>
			</div>
			<OrderInfo_template   v-bind:_orderInfo="orderList,selectAddr" />
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
				selectAddr:true,//是否是选择地址页面跳转来
			}
		},
		components:{
			OrderInfo_template,// 订单信息 组件
		},
		created(){

			var that = this;

			this.WaybillInfo = that.$store.state.Waybill.WaybillInfo.WaybillInfo;

			var postData = {
				shipmentId: this.$route.query.shipmentID,//配载单ID
				receiveAddr: this.$route.query.receiveAddr,//送货地址
			}

			this.httpRequest( "queryDeliverDetailInfo.do",postData,function(res){

				if(res.data[1].length){

					that.orderList = res.data[1];

					// that.$store.state.orderList =  res.data;

					for(var m = 0; m < that.orderList.length; m++){
			
						// 判断订单是否可以进行交付动作
						if( that.orderList[m].status == "未交付" && that.WaybillInfo.status != "新建"){
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



			// var defualtValue = [1,1,1,12,2,33,4]
			// var ResultFieldName = ["sds",1,1,12,2,33,3]
			// var odValue={};

		 //    for(var ii=0;ii<defualtValue.length;ii++){

		 //        if(defualtValue[ii]!==""){

		 //            odValue[ResultFieldName[ii]]= defualtValue[ii]

		 //              console.log(odValue)
		 //        }
		 //    }



		},
		methods:{



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
<template>
	<div class="SelectAddress">
		<header><i class="iconfont icon-xiangzuo1" @click="$router.back(-1)"></i><span>选择地址</span></header>
		<div class="container">
			<div class="addList"  v-for='(dataItem,index) in addressList'  :id="index"  :key='index'  @click="toOrderDetails(shipmentID,dataItem.receivePartyAddr1,shipmentListDataNo)">
				
				<div class="listLeft">
					<span>收货地址：{{dataItem.receivePartyAddr1}}</span>
				</div>
				<div class="listRight">
					<span class='status'>{{dataItem.status}}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">

	import $ from "jquery"

	export default{
		name:"SelectAddress",
		data(){
			return{
				addressList:[],//地址列表
			}
		},
		mounted(){

		},
		created(){

			var that = this;

			if(this.$route.query.shipmentID){

				this.shipmentID = this.$route.query.shipmentID;
				this.shipmentListDataNo = this.$route.query.shipmentListDataNo;
			}

			var postData = {
				shipmentId: that.shipmentID,//配载单id
		    };

			this.httpRequest("queryDeliverReceiveAddrInfo.do",postData,function(res){

				if(res.data.length){

					that.addressList = res.data;

				}
			})

		},
		methods:{
			// 跳转到 按地址交付 页面
			toOrderDetails(shipmentID,receiveAddr,shipmentListDataNo){

				this.$router.push({
					name:"OrderDetails",
					query:{
						shipmentID:shipmentID,//配载单id
						shipmentListDataNo:shipmentListDataNo,//配载单号
						receiveAddr:receiveAddr,//收货地址
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
.SelectAddress{
	overflow: hidden;
}
	.addList{
		border-bottom: 8/50rem solid #e1e1e1;
		position:relative;
		padding: 10/50rem;
		box-sizing: border-box;
		overflow: hidden;
		line-height: 60/50rem;
		min-height: 120/50rem;
		.listLeft{
			width: 580/50rem;
		}
		span.status{
		    position: absolute;
		    width:120/50rem;
		    text-align: center;
		    right: -20/50rem;
		    top:8/50rem;
		    z-index: 99;
		    color: #fff;
		    transform:rotate(36deg);
		}
		.listRight{
			&::before,&::after{
			 	content: "";
				width: 0;
				height: 0;
				display: block;
				position: absolute;
			    right: 0/50rem;
			    top: 0/50rem;
			    border-left:50/50rem solid transparent;
			    border-right: 0/50rem solid transparent;
				border-top: 33/50rem solid #fff;
				z-index: 33;
			}
			&::after{
			    color: #fff;
			    border-left:130/50rem solid transparent;
				border-top: 95/50rem solid #6897FF;
				z-index: 22;
			}
		}
	}
</style>
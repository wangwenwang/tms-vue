<!-- _template_orderInfo.vue   订单信息 组件-->
<template>
    <div class="OrderInfo_template">
		<div class="orderHead" ><span class="selectAll" v-if="!historyList&&(_orderInfo[0]? !_orderInfo[0].notOperate : true)"  @click="selectAll">取消全选</span>订单信息{{shipmentListDataNo}}</div>
		<div class='goodsInfo'   v-for='(dataItem,index) in _orderInfo'  :id="index"  :key='index'  @click="selectData(index,dataItem.ifDeliver)">
		    <div class='goodsHead'>
		    	<span v-if="dataItem.ifDeliver" class="iconfont icon-xuanzhong"></span>
		    	<div>
		    		<span>订单号：</span>
		    		<span>{{dataItem.omsNo}}</span>
		    	</div>
		    	<div>
		    		<span>客户单号：</span>
		    		<span>{{dataItem.clientOrderNo}}</span>
		    	</div>
		    	<div>
		    		<span>收货单位：</span>
		    		<span>{{dataItem.receivePartyName}}</span>
		    	</div>
		    	<div>
		    		<span>收货地址：</span>
		    		<span>{{dataItem.receivePartyAddr1}}</span>
		    	</div>
		    	<div>
		    		<span>收货联系人：</span>
		    		<span>{{dataItem.receivePartyContactName}}&nbsp;&nbsp;&nbsp; {{dataItem.receivePartyPhone}}&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;<i @click="callPhone(dataItem.recPhone)" class="iconfont icon-dianhua-copy" style="color: #2B5FD8" ></i></span>
		    	</div>
		    	<div>
		    		<span>装货单位：</span>
		    		<span>{{dataItem.issuePartyName}}</span>
		    	</div>
		    	<div>
		    		<span>装货地址：</span>
		    		<span>{{dataItem.issuePartyAddr}}</span>
		    	</div>
		    	<div>
		    		<span>装货联系人：</span>
		    		<span>{{dataItem.issuePartyContact}}&nbsp;&nbsp;&nbsp; {{dataItem.issuePartyTel}}&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;<i @click="callPhone(dataItem.recPhone)" class="iconfont icon-dianhua-copy" style="color: #2B5FD8" ></i></span>
		    	</div>
		    	<div   v-if="dataItem.send">
		    		<!-- 派送要求字段没有值时，不在页面显示 -->
			    	<span>派送要求：</span>
		    		<span>{{dataItem.send}}</span>
		    	</div>
		    	<div  v-if="dataItem.requestedDeliveryDte">
		    		<span>要求交付时间：</span>
		    		<span>{{dataItem.requestedDeliveryDte}}</span>
		    	</div>
		    </div>
		    <div class='goodsContent' @click="detail_takaUp(index)" style="display: none;">
			    <div v-for='(Item,idx) in dataItem.deliveryDetailList' :id="idx" :key='idx'>{{Item.productNo}} &nbsp;&nbsp;&nbsp;  {{Item.productName}}&nbsp;&nbsp;&nbsp;      {{Item.poOrderQty}}{{Item.poUom}}</div>
		    </div>
		    <div class="goodsBtn">
		    	<div class="TakeUp" @click="detail_takaUp(index)">
			    	<div><span>查看商品信息</span><i  class="iconfont icon-up"></i></div>
			    </div>

		    	<span v-if="dataItem.ifDeliver" class="g_btn" @click="toOrderDeliver(index)">交付</span>
		    	<span v-if="!historyList"  @click="_ewm(dataItem.omsNo)" class="g_btn ewm">二维码</span>
		    	<span v-if="!dataItem.ifDeliver" class="g_btn" style="visibility:hidden;">交付</span>
		    	<span v-if="historyList" class="g_btn" @click="toCheckDeliverPicture(dataItem.omsNo)">查看交付照片</span>
		    	
		    </div>
		    <div v-if=" (_orderInfo[0]? !_orderInfo[0].notOperate : true) && !historyList"  class="g_doubleBtn bottomBtn">
	            <div @click="toOrderDeliver('selectAll')">批量交付</div>
	            <div v-if="!selectAddr" @click="toSelectAdd(shipmentID, shipmentListDataNo)">按地址交付</div>
	        </div>
		</div>
		<!--   -->
    </div>

</template>

<script>
	import $ from "jquery"

export default {

    name:"OrderInfo_template",
    props:{
		_orderInfo:{
    		type:Array,
	    	default: () => {
				return []
			}
    	},
    	shipmentID:0,
    	shipmentListDataNo:"",
    	selectAddr:false,//是否是选择地址页面跳转来
    	historyList:false,//是否是历史任务页面跳转来

    },// 用来接收父组件传给子组件的数据
    data(){
	    return{
	    	// _orderInfo:[],//订单信息列表
	    }
    },
    mounted(){


    },
    created(){
      	// this._orderInfo = this.$store.state.Waybill.WaybillInfo._orderInfo;
    },
    methods:{
    	// 跳转查看交付照片
    	toCheckDeliverPicture(orderID) {

    		console.log(orderID)

    		this.$router.push({
				name:"CheckDeliverPicture",
				query:{
					orderID:orderID
				}
			})
    	},
    	// 跳转到 选择地址页面
    	toSelectAdd(shipmentID, shipmentListDataNo){

    		this.$router.push({
				name:"SelectAddress",
				query:{
					shipmentID:shipmentID,
					shipmentListDataNo:shipmentListDataNo,
				}
			})
    	},
    	//跳转到 送达页面
    	// arriveDestination(){

    	// },
		// 跳转到 订单交付页面
		toOrderDeliver(index){

			event.stopPropagation();

			var that = this;

			var deliverNo_list = [];

			var validateArray = [];//验证数组

			// 交付
			if(index != "selectAll"){

				deliverNo_list[0] = that._orderInfo[index].deliveryId;

				that.$router.push({
					name:"orderDeliver",
					query:{
						deliverNo_list:deliverNo_list,
						shipmentListDataNo:that.shipmentListDataNo

					}
				})

				return;

			// 批量交付
			}else{

				for(var i = 0 ; i < that._orderInfo.length;i++){

					if($(".goodsInfo").eq(i).children(".goodsHead").children("span.iconfont").hasClass("icon-xuanzhong")){

						deliverNo_list[deliverNo_list.length] = that._orderInfo[i].deliveryId;

						validateArray[validateArray.length] = that._orderInfo[i].receivePartyContactName;
					}
				}

				if(!deliverNo_list.length){

					that.$alert("没有选中任何订单", '提示', {
				        confirmButtonText: '确定'
				   	})

				}else{

					that.$router.push({
						name:"orderDeliver",
						query:{
							deliverNo_list:deliverNo_list,
							selectAddr:that.selectAddr,
							shipmentListDataNo:that.shipmentListDataNo
						}
					})

					// var ifSame = [];

					// for(var i = 0 ; i < validateArray.length;i++){

						
					// 	if(validateArray[0] == validateArray[i]){

					// 		ifSame[i] = 1;

					// 		if(ifSame.length == validateArray.length){

								
					// 		}

					// 	}else{

					// 		that.$alert("选中的订单中存在不同收货人，请重新选择", '提示', {
					// 	        confirmButtonText: '确定'
					// 	   	})
					// 	}
					// }
				}
			}

			console.log(deliverNo_list)
		},
		//点击勾选订单
		selectData:function(idx,ifDeliver){

			var that = this;

			if(!ifDeliver){
				return;
			}

			var iconElement = $(".goodsInfo").eq(idx).children(".goodsHead").children("span.iconfont");
			
			if(iconElement.hasClass("icon-xuanzhong")){

				iconElement.removeClass("icon-xuanzhong").addClass("icon-weixuanzhong")

			}else if(iconElement.hasClass("icon-weixuanzhong")){

				iconElement.removeClass("icon-weixuanzhong").addClass("icon-xuanzhong")
			}

			var if_Element;
			var if_changeBtn = {
				Selected:false,
				unSelected:false
			};
			for(var n = 0; n < that._orderInfo.length; n++){

				if_Element = $(".goodsInfo").eq(n).children(".goodsHead").children("span.iconfont");

				if(if_Element.hasClass("icon-xuanzhong")){

					if_changeBtn.Selected = true;

				}else if(if_Element.hasClass("icon-weixuanzhong")){

					if_changeBtn.unSelected = true;

				}
			}

			if(if_changeBtn.Selected != if_changeBtn.unSelected){

				if($(".selectAll").html() == "取消全选"){

					$(".selectAll").html("全选");

				}else{
					$(".selectAll").html("取消全选");
				}
			}
		},
		// 点击全选按钮
		selectAll(){

			var that = this;

			if($(".selectAll").html() == "取消全选"){

				$(".selectAll").html("全选");

				var iconElement;

				for(var j = 0; j < that._orderInfo.length; j++){

					iconElement = $(".goodsInfo").eq(j).children(".goodsHead").children("span.iconfont");

					iconElement.removeClass("icon-xuanzhong").addClass("icon-weixuanzhong");
				}

			}else{

				$(".selectAll").html("取消全选");

				var iconElement;

				for(var j = 0; j < that._orderInfo.length; j++){

					iconElement = $(".goodsInfo").eq(j).children(".goodsHead").children("span.iconfont");

					iconElement.removeClass("icon-weixuanzhong").addClass("icon-xuanzhong")
				}
			}
		},
		// 明细展开、收起
		detail_takaUp(index){
			event.stopPropagation();

			var that = this;

			var this_span = $(".goodsInfo").eq(index).find(".TakeUp").find("span");

			var this_icon = $(".goodsInfo").eq(index).find(".TakeUp").find("i");

			if(this_span.html() == "查看商品信息"){

				$(".goodsInfo").eq(index).find(".goodsContent").show();

				this_span.html("收起明细"); 

				this_icon.css("transform","rotate(180deg)");

			}else{

				$(".goodsInfo").eq(index).find(".goodsContent").hide();

				this_span.html("查看商品信息");

				this_icon.css("transform","rotate(0deg)");
			}
		},
		// 跳转到二维码页面
		_ewm(omsNo){

			this.$router.push({
				name:"QRCode",
				query:{
					omsNo:omsNo
				}
			})
		}
    }
}
</script>

<style lang="less" scoped>
	.orderHead{
		text-align: center;
		height: 65/50rem;
		line-height: 65/50rem;
		color: #000;
		background-color: #EDEFF3;
		position:relative;
		span{
			height: 65/50rem;
			position:absolute;
			left: 20/50rem;
			top: 0;
		}
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
	  		position:relative;
	  		line-height: 55/50rem;
	  		border-bottom: 3/50rem solid #EDEFF3;
	  		&>div{
	  			overflow: hidden;
	  			span{
	  				float: left;
	  				height: auto;

			    	&:nth-child(2){
						width: 500/50rem;
			    	}
	  			}
	  			&>span:nth-child(1){
	  				color:#000;
	  			}
	  		}
	  		// &>div:not(:last-child){
	  		// 	span:nth-child(1){
	  		// 		width: 170/50rem;
	  		// 	}
	  		// }
	  		&>span.iconfont{
	  			position:absolute;
	  			top: 20/50rem;
	  			right: 20/50rem;
				color:#285DCE;
				font-size: 40/50rem;
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
		display: flex;
		bottom: 0;
		div{
			flex-grow: 1;
			border-radius: 35/50rem;
			margin-right: 15/50rem;
			margin-left: 15/50rem;
		}
	}
</style>
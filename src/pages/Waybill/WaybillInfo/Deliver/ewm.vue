<template>
	<div class="QRCode">
		<header><i class="iconfont icon-xiangzuo1"  @click="$router.back(-1)"></i><span>{{title}}二维码</span></header>
		<div class="container">
			<div class="_qrcode" >
				<canvas id="canvascode"></canvas> 
				<div id="qrcode"  ref="qrcode" class="qrcode">
				</div>
			</div>
		</div>
	
	</div>
</template>
<script type="text/javascript">

	import $ from "jquery"

	// 二维码
	import QRCode from 'qrcodejs2'  
	// 条形码
	var JsBarcode = require('jsbarcode')

	export default{
		name:"QRCode",
		data(){
			return{
				title:"",//头部标题
			}
		},
		components: {QRCode},
		mounted(){

			var that  = this,
				SingleNum = "";

			if(this.$route.query.omsNo){

				SingleNum = this.$route.query.omsNo;

				this.title = "订单号";

			}else if(this.$route.query.shipmentCode){

				SingleNum = this.$route.query.shipmentCode;

				this.title = "配载单号";
			}

			this.$nextTick (function () {

			   that.qrcode(SingleNum);

			    var canvas = document.getElementById("canvascode");

				JsBarcode(canvas, SingleNum,{
					format: "CODE128",
	                displayValue: 1,
	                fontSize: 22,
	                lineColor: "#000",
				})
			})
		},
		created(){
		},
		methods:{
			qrcode (omsNo) {
				let qrcode = new QRCode('qrcode', {
				    width: 200,  // 设置宽度 
				    height: 200, // 设置高度
				    text: omsNo
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.container,.QRCode{
		height: 100%;
		overflow: hidden;
	}
	._qrcode{
		width: 100%;
		line-height: 1;
			
		position: fixed;
		// width: 100%;
		// height: 100%;
		top: 50%;
		margin-top: -175px;
		left: 0;
		// z-index: 99999;
		// background-color: rgba(0,0,0,0.5);
		.qrcode{
			// top:250px;
			// left: 50%;
			margin:0/50rem auto;
			// position: fixed;
			width: 200px;
			height: 200px;
			
		}
		#canvascode{

			// top:480px;
			// left: 50%;
			margin-top: 100px;
			margin:0/50rem auto 100/50rem;
			display: block;
			// position: fixed;
			width:600/50rem;
			height: 200/50rem;
		}
	}
</style>
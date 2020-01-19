<template>
	<div class="orderDeliver">
		<header><i class="iconfont icon-xiangzuo1"  @click="$router.back(-1)"></i><span>交付{{ shipmentListDataNo }}</span></header>
		<div class="container">
			<div class="signatureBox">
			    <div class="visaDetailTop">电子签名({{this.$store.state.userInfo.cellphone}})</div>
			    <div class="canvasBox" ref="canvasHW">
		       		<canvas  allow = "geolocation" id="thecanvas" @touchstart='touchStart'
		                @touchmove='touchMove'
		                @touchend='touchEnd'
		                ref="canvasF"
		                @mousedown="mouseDown"
		                @mousemove="mouseMove"
		                @mouseup="mouseUp"></canvas>
		        	<div class="btnBox"   @click="overwrite">重写</div>
		        	<div class="tip_assist">{{ setDistance() }}</div>
		      	</div>
		    </div>
			<div class="Upload">
				<div class="uploadImg">
					<div class="LoadImg_head">卸货车照</div>
					<div>
						<el-upload :action = " HOST+'confirmationUpload.do'"  :limit="3" :multiple="true"  :data="uploadParams" ref='upload_ref1' :auto-upload="false" list-type="picture-card"  :before-upload="beforeUpload"   :on-error="uploadErrorInCurrVue" :on-success="uploadSuccessInCurrVue"   :on-preview="handlePictureCardPreview" >
						  <i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible">
						  <img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
					</div>
				</div>

				<div class="uploadImg">
					<div class="LoadImg_head">签单回执</div>
					<div>
						<el-upload :action = "HOST+'confirmationUpload.do'"  :limit="3" :multiple="true"  :data="uploadParams" ref='upload_ref2' :auto-upload="false" list-type="picture-card"  :before-upload="beforeUpload"   :on-error="uploadErrorInCurrVue" :on-success="uploadSuccessInCurrVue"   :on-preview="handlePictureCardPreview" >
						  <i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible">
						  <img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
					</div>
				</div>
			</div>
			<div class="submitBtn">
				<p class="g_signBtn"  @click="submit">提交</p>
			</div>
			<div v-if="ifTips" class="msg_tips">
				<div class="tips_content">
					<i class="iconfont icon-chenggong1"></i>
					<p>{{tips_Msg}}</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">

	import $ from "jquery"

	export default{
		name:"orderDeliver",
		data(){
			return{
				dialogImageUrl: '',
				CurrentLocation:"",//当前位置
		        dialogVisible: false,//是否放大预览照片
		        uploadParams:{},//上传图片时 额外的参数
		        ifSign:false,//是否签名
		        tips_Msg:"",//提示信息
				ifTips:false,//提示信息是否显示
		        //
		        points:[],
		        canvasTxt:null,
		        startX:0,
		        startY:0,
		        moveY:0,
		        moveX:0,
		        endY:0,
		        endX:0,
		        w:null,
		        h:null,
		        isDown:false,
				longitude:"",//经度
				latitude:"",//纬度
				distance:"",//与收货地址的距离
				shipmentListDataNo:"",//配载编号
			}
		},
      	mounted(){
      		var that = this;

      		$('html,body').animate({ scrollTop: 0 }, 500);

		    let canvas=this.$refs.canvasF;

	        canvas.height = this.$refs.canvasHW.offsetHeight;
	        canvas.width =this.$refs.canvasHW.offsetWidth;

	        this.canvasTxt=canvas.getContext("2d");

			this.TelliOSORAndroidVueMounted("获取当前位置页面已加载");
			window.SetCurrAddress = this.SetCurrAddress;

   			var currentdate = this.getNowTime();
			this.canvasTxt.font="15px Microsoft JhengHei";
			this.canvasTxt.fillText(currentdate, 5, canvas.height - 35);
		},
		created(){

			this.WaybillInfo = this.$store.state.Waybill.WaybillInfo.WaybillInfo;

			this.uploadParams.tenantCode = this.WaybillInfo.tenantCode;//租户代码

			this.uploadParams.code = this.$route.query.deliverNo_list;//运单号(交付传运单号过来，到车和中途反馈传配载单号过来)

			this.uploadParams.codeType = "ORDER";//类型为 交付

			this.uploadParams.codeId = this.$route.query.deliverNo_list;//交付时=deliveryId,其他两个=shipmentId

			this.uploadParams.cellphone = this.$store.state.userInfo.cellphone;//交付人手机号

			this.shipmentListDataNo = this.$route.query.shipmentListDataNo;

		},
		methods:{
			// 定位
			SetCurrAddress:function(address, lng, lat, bdcode) {

				var that = this;
				this.longitude = lng;
				this.latitude = lat;
				this.CurrentLocation = address;

				// 经纬度带E，定位有问题
				if(this.longitude == "" || this.longitude.indexOf('E') != -1) {

					this.$alert("获取位置失败，建议退出APP，重新打开", '提示', {
            		confirmButtonText: '确定',
	            		callback: action => {
	            		}
	       			})

					var code;
					// bdcode有值，1.2.4或以上安卓版本
					if(bdcode != undefined) {
						code = bdcode;
					}else {
						code = "";
					}
					var postData = {
						cellphone:that.$store.state.userInfo.cellphone,
						userName:that.$store.state.userInfo.userName,
						vehicleLocation:that.CurrentLocation,
						lon:"",
						lat:"",
						uuid:"vue",
						code:code,
						brightscreen:"10",
						charging:that.longitude + "," + that.latitude,
						os:that.$store.state.App_Version,
					}
					that.httpRequest( "timingTracking.do",postData,function(res){
					})
	       			return;	
				}

				// 每次进来都记录一下，用于分析bdcode，临时用
				else{
					if(bdcode != undefined) {
						code = bdcode;
					}else {
						code = "";
					}
					var postData = {
							cellphone:that.$store.state.userInfo.cellphone,
							userName:that.$store.state.userInfo.userName,
							vehicleLocation:that.CurrentLocation,
							lon:that.longitude,
							lat:that.latitude,
							uuid:"vue",
							code:code,
							brightscreen:"11",
							charging:"",
							os:that.$store.state.App_Version,
						}
						that.httpRequest( "timingTracking.do",postData,function(res){
					})
				}

				this.canvasTxt.fillText(this.CurrentLocation, 5, this.$refs.canvasF.height - 10);

				// 这个请求放在最后面，以免这个请求报错，导致后面的代码不执行
				var postData = {
					deliveryIds:that.$route.query.deliverNo_list,//运单ID，比如：1001,1002,1003)，一个或多个交付统一传数组字符串
					longitude:lng,//经度
					latitude:lat//纬度
				}

				that.httpRequest( "deliveryCheckRange.do",postData,function(res){

					that.distance = res.data.warnMsg;
				})
			},
			setDistance(){

				// 按收货地址交付
				if(this.$route.query.selectAddr == true || this.$route.query.deliverNo_list.length == 1) {

					if(this.distance == "") {
						return "";
					}else {
						return this.distance + "(如提示有误请忽略)";
					} 
				}
			},
			submit(){

				var that = this;

				if(!this.ifSign){

					that.$alert('请签名', '提示', {
			            confirmButtonText: '确定'
		           	})

		           	return;
				}else if(!$(".Upload>div.uploadImg:eq(0) ul>li").length){

					that.$alert('请上传卸货车照', '提示', {
			            confirmButtonText: '确定'
		           	})

		           	return;
				}else if(!$(".Upload>div.uploadImg:eq(1) ul>li").length){

					that.$alert('请上传签单回执照片', '提示', {
			            confirmButtonText: '确定'
		           	})

		           	return;
				}else if(this.longitude == "" || this.longitude.indexOf('E') != -1 || this.CurrentLocation == ""){

					that.$alert('未获取当前坐标，请打开GPS，退出APP重新打开', '提示', {
			            confirmButtonText: '确定'
		           	})

		           	return;
				}

				var XHQty = $(".Upload>div.uploadImg:eq(0) ul>li").length;
				var HZQty = $(".Upload>div.uploadImg:eq(1) ul>li").length;

				console.log("卸货车照数量：" + XHQty);
				console.log("签单回执数量：" + HZQty);
				console.log("照片总数量：" + (XHQty + HZQty));

				this.$store.state.orderDeliver_picture_finish_qty = 0;
				this.$store.state.orderDeliver_picture_total_qty = (XHQty + HZQty);

				// 上传图片
				this.$refs.upload_ref1.submit();
				this.$refs.upload_ref2.submit();

				this.$store.state.orderDeliver_CurrentLocation = this.CurrentLocation;
				this.$store.state.orderDeliver_longitude = this.longitude;
				this.$store.state.orderDeliver_latitude = this.latitude;

				that.$emit('isLoading', true,"拼命加载中");
			},
			// 预览放大图片
			handlePictureCardPreview (file) {

			    this.dialogImageUrl = file.url;
			    this.dialogVisible = true;
			},
	        //电脑设备事件
	        mouseDown(ev){
		        ev = ev || event;
		        ev.preventDefault(); 
		        if(1){
		            let obj={
		              x:ev.offsetX,
		              y:ev.offsetY
		            };
		            this.startX=obj.x;
		            this.startY=obj.y;
		            this.canvasTxt.beginPath();
		            this.canvasTxt.moveTo(this.startX, this.startY);
		            this.canvasTxt.lineTo(obj.x, obj.y);
		            this.canvasTxt.stroke();
		            this.canvasTxt.closePath();
		            this.points.push(obj);
		            this.isDown=true;
		        }
	        },
	        //移动设备事件
	        touchStart(ev){
	          	ev = ev || event;
	          	ev.preventDefault();

	          	if(ev.touches.length == 1) {
		            let obj={
		              	x:ev.targetTouches[0].clientX,
		              	y:ev.targetTouches[0].clientY-48
		            };
		            this.startX=obj.x;
		            this.startY=obj.y;
		            this.canvasTxt.beginPath();
		            this.canvasTxt.moveTo(this.startX, this.startY);
		            this.canvasTxt.lineTo(obj.x, obj.y);
		            this.canvasTxt.stroke();
		            this.canvasTxt.closePath();
		            this.points.push(obj);
	          }
	        },
	        //电脑设备事件
	        mouseMove(ev){
	          	ev = ev || event;
	          	ev.preventDefault();

	          	this.ifSign = true;
	          	if(this.isDown){ 
		            let obj={
		              x:ev.offsetX,
		              y:ev.offsetY
		            };
		            this.moveY=obj.y;
		            this.moveX=obj.x;
		            this.canvasTxt.beginPath();
		            this.canvasTxt.moveTo(this.startX, this.startY);
		            this.canvasTxt.lineTo(obj.x, obj.y);
		            this.canvasTxt.stroke();
		            this.canvasTxt.closePath();
		            this.startY=obj.y;
		            this.startX=obj.x;
		            this.points.push(obj);
	          	}
	        },
	        //移动设备事件
	        touchMove(ev){
	          	ev = ev || event;
	          	ev.preventDefault();

	          	this.ifSign = true;
	          	if(ev.touches.length == 1) {

		            let obj={ 
		              x:ev.targetTouches[0].clientX,
		              y:ev.targetTouches[0].clientY-48
		            };
		            this.moveY=obj.y;
		            this.moveX=obj.x;
		            this.canvasTxt.beginPath();
		            this.canvasTxt.moveTo(this.startX, this.startY);
		            this.canvasTxt.lineTo(obj.x, obj.y);
		            this.canvasTxt.stroke();
		            this.canvasTxt.closePath();
		            this.startY=obj.y;
		            this.startX=obj.x;
		            this.points.push(obj);
		        }
	        },
	        //电脑设备事件
	        mouseUp(ev){
	          	ev = ev || event;
	          	ev.preventDefault();

	          	if(1){
		            let obj={
		              x:ev.offsetX,
		              y:ev.offsetY
		            };
		            this.canvasTxt.beginPath();
		            this.canvasTxt.moveTo(this.startX, this.startY);
		            this.canvasTxt.lineTo(obj.x, obj.y);
		            this.canvasTxt.stroke();
		            this.canvasTxt.closePath();
		            this.points.push(obj);
		            this.points.push({x:-1,y:-1});
		            this.isDown=false;
		        }
	        },
	        //移动设备事件
	        touchEnd(ev){
	          	ev = ev || event;
	          	ev.preventDefault();

	          	if(ev.touches.length == 1) {
		            let obj={
		              x:ev.targetTouches[0].clientX,
		              y:ev.targetTouches[0].clientY-48
		            };
		            this.canvasTxt.beginPath();
		            this.canvasTxt.moveTo(this.startX, this.startY);
		            this.canvasTxt.lineTo(obj.x, obj.y);
		            this.canvasTxt.stroke();
		            this.canvasTxt.closePath();
		            this.points.push(obj);
		            this.points.push({x:-1,y:-1});
	          	}
	        },
	        //重写
	        overwrite(){
		        this.canvasTxt.clearRect(0, 0, this.$refs.canvasF.width, this.$refs.canvasF.height);
		        this.points=[];
		        this.ifSign = false;

				this.TelliOSORAndroidVueMounted("获取当前位置页面已加载");
				window.SetCurrAddress = this.SetCurrAddress;

	   			var currentdate = this.getNowTime();
				this.canvasTxt.font="15px Microsoft JhengHei";
				this.canvasTxt.fillText(currentdate, 5, this.$refs.canvasF.height - 35);
	        },
			// 文件上传成功时的钩子
			uploadSuccessInCurrVue(response, file, fileList){

				console.log("上传照片成功")
				this.orderDeliverOnclick(response);
			},
			// 文件上传失败时的钩子
			uploadErrorInCurrVue(err, file, fileList){

				console.log("上传照片失败")

				// var that = this;

				// that.$emit('isLoading', false);

				// that.$alert('网络不稳定，上传照片失败，请稍候再试！', '提示', {
			 //            confirmButtonText: '确定'
		  //       })
				// console.log(err)

				this.orderDeliverOnclick(err);
			},
			// 交付
			orderDeliverOnclick(response){

				var that = this;

				this.$store.state.orderDeliver_picture_finish_qty = (this.$store.state.orderDeliver_picture_finish_qty + 1);

				console.log("已完成：" + this.$store.state.orderDeliver_picture_finish_qty + "，总数量：" + this.$store.state.orderDeliver_picture_total_qty)

				console.log(response)

				if(this.$store.state.orderDeliver_picture_finish_qty == this.$store.state.orderDeliver_picture_total_qty) {

					console.log("上传图片完成，调用上传签名接口")
					console.log(that.CurrentLocation)

					// 将电子签名图片转为base64编码
					var oCanvas = document.getElementById("thecanvas");
					var context = oCanvas.getContext("2d");
					// 将canvas的透明背景设置成白色
					var imageData = context.getImageData(0, 0, oCanvas.width, oCanvas.height);
					for(var i = 0; i < imageData.data.length; i += 4) {
					    // 当该像素是透明的，则设置成白色
					    if(imageData.data[i + 3] == 0) {
					        imageData.data[i] = 255;
					        imageData.data[i + 1] = 255;
					        imageData.data[i + 2] = 255;
					        imageData.data[i + 3] = 255; 
					    }
					}
					context.putImageData(imageData, 0, 0);
					// 将电图片转为base64编码
					var strDataURI = oCanvas.toDataURL();

					var postData = {
						tenantCode: this.$store.state.Waybill.WaybillInfo.WaybillInfo.tenantCode,//组织代码
						deliveryIds:this.$route.query.deliverNo_list,//运单ID，比如：1001,1002,1003)，一个或多个交付统一传数组字符串
						driverName:this.$store.state.userInfo.userName,//司机名称，当前APP登录用户名
						autograph:strDataURI,// 电子签名
						daoDaPlace:this.$store.state.orderDeliver_CurrentLocation,//当前位置
						longitude:this.$store.state.orderDeliver_longitude,//经度
						latitude:this.$store.state.orderDeliver_latitude,//纬度
				    	appUsersId:that.$store.state.userInfo.user_id,//用户id
					}

					that.httpRequest( "deliverConfirmation.do",postData,function(res){

						that.ifTips = true;
						that.tips_Msg = "操作成功";

						setTimeout(function(){

							that.ifTips = false;

							that.$router.push({
								name:"Waybill",
								query:{
								}
							})
							that.$store.state.Waybill_needRefresh = true;
						},1000)
					})
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.orderDeliver{
		overflow: hidden;
		.container{
			overflow: hidden;
			padding-bottom:150/50rem;
			.CurrentLocation{
				padding: 20/50rem;
				box-sizing: border-box;
			}
			.Upload{
				.uploadImg{
					padding: 20/50rem;
					box-sizing: border-box;
					font-size: 30/50rem;
					border-top: 1/50rem solid #EDEDED;
					overflow: hidden;
					&>.LoadImg_head{
						float: none;
						text-align: center;
						margin-bottom:10/50rem; 
						span{
							color: #aaa;
						}
					}
					&>div{
						float: left;
					}
				}
			}
			
		}
	}

	.signatureBox{
	    width: 100%;
	    height: 610/50rem;
	    box-sizing: border-box;
	    overflow: hidden;
	    background: #fff;
	    z-index: 88;
	    display: flex;
	    flex-direction: column;
	}
	.visaDetailTop{
	    width: 100%;
	    // height: 60/50rem;
	    // line-height: 60/50rem;
	    text-align: center;
	    font-size: 30/50rem;
	}
	.canvasBox{
	  	width: 750/50rem;
	    padding: 0 5/50rem;
	    box-sizing: border-box;
	    flex: 1;
	}
	canvas{
	  	width: 100%;
	  	height: 400/50rem;
	    border: 1/50rem solid #71b900;
	    background-color: #fff;
	}
	.btnBox{
	  	width: 120/50rem;
	    height: 50/50rem;
	    line-height: 50/50rem;
	    background-color: #71b900;
	    color: #fff;
	    font-size: 28/50rem;
	    text-align: center;
	    border-radius: 8/50rem;
	    margin: 10/50rem auto;
	}
	.tip_assist{
	    color: #696969;
	}

	@media screen and (max-width: 374px){

	  	canvas{
		  	width: 100%;
		  	height: 400/50rem;
		    border: 3/50rem solid #71b900;
		    background-color: #fff;
		}
	}
</style>
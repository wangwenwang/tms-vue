<template>
	<div class="Waybill"  >
		<header>
			<div class="currentTask">当前任务</div>
			<div @click="historyTask"  class="historyTask">历史任务</div>
		</header>
		<div class="container"  style="overflow:scroll;">

			<div class="topKong"></div>

			<mt-loadmore style="text-align: center; "  topDropText="下拉刷新"   topLoadingText=""  topPullText='' bottomPullText="" bottomDropText="上拉加载" bottomLoadingText="" :top-method="loadTop"  :bottom-method="loadBottom"  ref="loadmore"  :autoFill="autoFill" >

				<div class="waybillContainer">

					<!-- 配载单信息 -->
					<WaybillInfo_template   @isLoading_="fullscreenLoading"  v-bind:shipmentListData="shipmentListData"  />

					<div v-if="allLoaded && shipmentListData.length " class="nodata_label">没有更多数据</div>
					<div class="kong"></div>
					<div v-if="is_NoData" class="nodata_kong"></div>
				</div>
			</mt-loadmore>
		</div>

		<!-- 页面数据为空时 -->
		<div   v-if="is_NoData"   class="NoData" >
			<div>
				<i  class="iconfont icon-meiyouwuliuxinxi" ></i>
				<div>{{is_NoData_text}}</div>
			</div>
		</div>

		<!-- 页脚 -->
		<FooterIndex/>
	</div>
</template>
<script type="text/javascript">

	// 页脚
	import FooterIndex from '../../components/footer.vue'

	// 配载单 组件
	import WaybillInfo_template from './_template_WaybillInfo'
	import $ from "jquery"
	export default{
		name:"Waybill",
		data(){
			return{
				shipmentListData:[],
		        is_NoData:false,//没有数据模块样式  是否显示
		        is_NoData_text:"没有任务",//没有数据模块样式  显示的文字
				numberPerPage: 5,//每页显示几条
				loadPage: 1 ,//当前第几页
				allLoaded:true,//上拉刷新还能上拉刷新
				autoFill:false,//
			}
		},
		components:{
		  	FooterIndex,
		  	WaybillInfo_template,//配载单信息组件
		},
		mounted(){

			var that = this;

			this.allLoaded = false;

		},
		created(){
			// appointLoadingStatus;//装车预约状态：NEW=新预约，YI=已确定，REFUSE=已拒绝
			
			this.loadData();

			console.log(2)

		},
		methods:{
			// 加载页面数据
			loadData(load){

				var that = this;

				var shipmentListData = that.$store.state.Waybill.shipmentListData;

				// 需要刷新
				if(that.$store.state.Waybill_needRefresh || !shipmentListData.length){

					var postData = {
						currentPage: that.loadPage,//当前第几页
					    numberPerPage: that.numberPerPage,//每页显示几条
					    startDate: null,//开始时间
					    endDate: null,//结束时间
					    deliveryNoinput: null,// 送货单号
                        shipmentCodeinput: null,//  配载单号
                        clientOrderNo: null,//客户单号
					    cellphone: that.$store.state.userInfo.cellphone,//手机号   15013418360
				    };

					var myDate = new Date();
				    console.log("发起列表请求：" + myDate.toLocaleTimeString() + ":" + myDate.getMilliseconds());



					this.httpRequest("queryShipmentData.do",postData,function(res){

						var myDate2 = new Date();
						console.log("发起列表完成：" + myDate2.toLocaleTimeString() + ":" + myDate2.getMilliseconds());

						if(load){
							if(load == "TopLoad"){

								that.$refs.loadmore.onTopLoaded();

							}else if(load == "BottomLoad"){

								that.$refs.loadmore.onBottomLoaded();
							}
						}

						//上拉加载后 数据拼接
				        if (that.loadPage > 1) {
					   
					        that.shipmentListData = that.shipmentListData.concat(res.data)
					      
				        } else {
					       
					        that.shipmentListData = res.data;

							if(res.data.length){

								that.is_NoData = false; //没有数据模块 是否显示

							}else{

								that.is_NoData_text = "没有任务"
								

								that.is_NoData = true;
							}
				        }

				        that.$store.state.Waybill.shipmentListData = that.shipmentListData;

					    // 判断是否能上拉加载
					    if (res.data.length < that.numberPerPage) {
					 
					        that.allLoaded = true;
				
					    } else {
					        
					        that.allLoaded = false;
					      
					    }
					})
				}else{

					that.shipmentListData = shipmentListData;

					if(load){
						if(load == "TopLoad"){

							that.$refs.loadmore.onTopLoaded();

						}else if(load == "BottomLoad"){

							that.$refs.loadmore.onBottomLoaded();
						}
					}

					if(that.shipmentListData.length){

						that.is_NoData = false; //没有数据模块 是否显示

					}else{

						that.is_NoData = true;

						that.is_NoData_text = "没有结果"
					}

					this.$emit('isLoading', false);
				}
			},
			//导航地址出现  加载特效出现  子传父事件 
			"fullscreenLoading"(isLoad,loadingText){

				console.log(isLoad,loadingText)

				this.$emit('isLoading', isLoad,loadingText);

			},
			// 点击头部“历史任务”  跳转
			historyTask(){

				this.$router.push({
		            name:"historyList"
		        })
			},
			// 下拉刷新
			loadTop() {

				console.log(8888)

		        this.loadPage = 1;

		        this.allLoaded = false;

				// 需要重新请求数据
				this.$store.state.Waybill_needRefresh = true;

				this.loadData("TopLoad");
			},
			// 上拉加载
			loadBottom(){

			    var that = this;

			    console.log(233)

			    if (that.allLoaded){
			     	that.$refs.loadmore.onBottomLoaded();
			        return;
			    }else{
			     
			        that.loadPage += 1;
			    }

				// 需要重新请求数据
				this.$store.state.Waybill_needRefresh = true;

				this.loadData("BottomLoad");
			}
		}
	}
</script>
<style lang="less" scoped>
	.Waybill{
		height: 100%;
	}
	header{
		background-color: #fff;
		color: #000;
		display: flex;
		&>div{
			flex-grow: 1;
		}
		.currentTask{
			color: #5965D8;
			border-bottom: 6/50rem solid #5965D8;
		}
		.historyTask{
			border-bottom: 6/50rem solid #fff;
		}
	}
	.container{
		font-size: 29/50rem;
		height: 100%;
		padding-top: 0;
		margin-top: 0;
	}
</style>
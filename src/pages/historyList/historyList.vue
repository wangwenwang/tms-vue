<template>
	<div class="historyList">
		<header>
			<div  @click="currentTask"  class="currentTask">当前任务</div>
			<div class="historyTask">历史任务<i class="iconfont icon-huabanfuben"  @click="search('History')"  ></i></div>
		</header>
		<div class="container" style="overflow:scroll">
			<div class="topKong"></div>
			<div  class="search_Label">
				<div @click="searchLabel_close('startDate')"  v-if="history_SearchData.startDate"><span>开始日期</span><i class="iconfont icon-guanbi" ></i></div>
				<div @click="searchLabel_close('endDate')"  v-if="history_SearchData.endDate"><span>结束日期</span><i class="iconfont icon-guanbi" ></i></div>
				<div @click="searchLabel_close('deliveryNoinput')"  v-if="history_SearchData.deliveryNoinput"><span>送货单号</span><i class="iconfont icon-guanbi" ></i></div>
				<div @click="searchLabel_close('shipmentCodeinput')"  v-if="history_SearchData.shipmentCodeinput"><span>配载单号</span><i class="iconfont icon-guanbi" ></i></div>
				<div @click="searchLabel_close('clientOrderNo')"  v-if="history_SearchData.clientOrderNo"><span>客户单号</span><i class="iconfont icon-guanbi" ></i></div>
			</div>
			<mt-loadmore style="text-align: center; "  topDropText="下拉刷新"   topLoadingText=""  topPullText='' bottomPullText="" bottomDropText="上拉加载" bottomLoadingText="" :top-method="loadTop_history"  :bottom-method="loadBottom_history"  ref="loadmore"  :autoFill="autoFill" >
				<div class="waybillContainer">
					<div   class="bigList" v-for='(dataItem,index) in shipmentListData'  :id="index"  :key='index' >
						<!-- 搜索后结果 -->
						<div  class="searchResult">
							<!-- 搜索后 单号与日期 -->
							<div  class="place"><span class="OrderNum">配载单号：{{dataItem.shipmentCode}}</span><span class="dateLoading">{{dataItem.addDate}}</span></div>
							<!-- 起终点城市 -->
							<div  class="firstLine">
								<span>{{dataItem.startCity}}</span>
								<i class="iconfont icon-jiang" ></i>
								<span>{{dataItem.endCity}}</span>
							</div>
							<div>
								<span>货&nbsp;&nbsp;&nbsp;量：</span>
								<span>{{dataItem.orderNum}} 单 &nbsp; </span>
								<span>{{(dataItem.vol * 0.000001).toFixed(1)}} 方 &nbsp; </span>
								<span>{{(dataItem.wt * 0.000001).toFixed(1)}} 吨 &nbsp; </span>
								<span>{{parseInt(dataItem.qty)}}箱</span>
							</div>
							<div v-if="dataItem.issueAddrLiat.length==1">
								<span>联系人：</span>
								<span>{{dataItem.issueAddrLiat[0].issueUser}}&nbsp;&nbsp;&nbsp; {{dataItem.issueAddrLiat[0].issuePhone}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i @click="callPhone(dataItem.issueAddrLiat[0].issuePhone)" class="iconfont icon-dianhua-copy" ></i>
							</div>
							<div v-if="dataItem.issueAddrLiat.length==1">
								<span>装货地址：</span>
								<span>{{dataItem.issueAddrLiat[0].issueAddr1}}</span>
							</div>
							<div v-else @click="MultiAddress(index)">
								<i class="iconfont icon-tishi" ></i>
								<span style="color:#5965D8; ">查看多装货地址</span>
							</div>
							<div class="detailBtn">
								<span  class="g_btn" @click="toOrderDeliver(dataItem)">详情</span>
						    	<span  class="g_btn" @click="ViewTrajectory(dataItem.shipmentID)">查看路线</span>
						    </div>
						</div>
					</div>
					<div v-if="allLoaded && shipmentListData.length " class="nodata_label">没有更多数据</div>
					<div class="kong"></div>
					<div v-if="is_NoData" class="nodata_kong"></div>
				</div>
			</mt-loadmore>
			<!-- 页面数据为空时 -->
			<div   v-if="is_NoData"   class="NoData" >
				<div>
					<i  class="iconfont icon-meiyouwuliuxinxi" ></i>
					<div>{{is_NoData_text}}</div>
				</div>
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
		</div>
		<FooterIndex/>
	</div>
</template>
<script type="text/javascript">
import FooterIndex from '../../components/footer.vue'
	export default{
		name:"historyList",
		data(){
			return{
				shipmentListData:[],//页面数据
				address_listData:[],// 多装货地址配载单的地址数组信息 shipmentListData[i].issueAddrLiat
				currentAddressInfo:[],// 当前显示的地址数组信息
				history_NoSearchFrom:true,//判断是否为搜索页面转来 false为搜索页面转来
				is_NoData:false,//没有数据模块样式  是否显示
		        is_NoData_text:"没有任务",//没有数据模块样式  显示的文字
		        numberPerPage: 5,//每页显示几条
				loadPage: 1 ,//当前第几页
				allLoaded:false,//上拉刷新还能上拉刷新
				autoFill:false,//
				// 查询条件
				history_SearchData:{
					startDate: null,//开始时间
				    endDate: null,//结束时间
				    deliveryNoinput: null,// 送货单号
	                shipmentCodeinput: null,//  配载单号
	                clientOrderNo: null,//客户单号
				},
				thisMonth:"",//选择的月份
			}
		},
		components:{
			FooterIndex
		},
		created(){

			var that = this;

			//判断是否为搜索页面转来 false为搜索页面转来
			this.history_NoSearchFrom = that.$store.state.history_NoSearchFrom;

			// 从搜索页面带来的查询条件
			if(!that.$store.state.history_NoSearchFrom){

				this.history_SearchData = this.$store.state.history_SearchData;
			}

			this.loadData();
		},
		// 页面销毁前
		beforeDestroy(){

			var that = this;

			that.$store.state.history_NoSearchFrom = true;
		},
		methods:{
			// 加载页面数据
			loadData(load){

				var that = this;

				var history_Data = that.$store.state.history_Data;//历史任务页面数据

				// 需要刷新
				if(that.$store.state.history_needRefresh || !history_Data.length || !that.$store.state.history_NoSearchFrom){

					var postData;

					// 从搜索页面而来
					if(!that.$store.state.history_NoSearchFrom){

						postData = that.$store.state.history_SearchData;

					}else{

						postData = {
						    startDate: null,//开始时间
						    endDate: null,//结束时间
						    deliveryNoinput: null,// 送货单号
	                        shipmentCodeinput: null,//  配载单号
	                        clientOrderNo: null,//客户单号
						    cellphone: that.$store.state.userInfo.cellphone,//手机号   15013418360
					    };
					}

					postData.currentPage = that.loadPage;//当前第几页
					postData.numberPerPage = that.numberPerPage;//每页显示几条

					this.httpRequest("queryOldShipmentData.do",postData,function(res){

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

				        that.$store.state.history_Data = that.shipmentListData;

					    // 判断是否能上拉加载
					    if (res.data.length < that.numberPerPage) {
					 
					        that.allLoaded = true;
				
					    } else {
					        
					        that.allLoaded = false;
					      
					    }
					})
				}else{

					that.shipmentListData = history_Data;

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
			// 点击头部“当前任务”  跳转
			currentTask(){

				this.$router.push({
		            name:"Waybill"
		        })
			},
			// 点击搜索后的单个小标签
			searchLabel_close(searchName){

				this.$store.state.history_SearchData[searchName] = null;

				this.loadData();
			},
			// 查看轨迹
			ViewTrajectory(shipmentID){
				// 安卓
				try {

					CallAndroidOrIOS.callAndroid("查看路线", shipmentID);

				} 
				catch(error) {

					// console.log("没有CallAndroidOrIOS.callAndroid方法")
				}

				// 苹果
				try {

						CallAndroidOrIOS("查看路线",shipmentID);
				}
				catch(error) {

					// console.log("没有CallAndroidOrIOS方法")
				}
			},
			// 搜索后的列表  点击详情跳转到运单详情
			toOrderDeliver(WaybillInfo){

				this.$store.state.search_WaybillDetail = WaybillInfo;

				console.log(WaybillInfo)

				this.$router.push({
					name:"WaybillDetail",
					query:{
						shipmentID:WaybillInfo.shipmentID
					}
				})
			},
			// 下拉刷新
			loadTop_history() {

		        this.loadPage = 1;

		        this.allLoaded = false;

				// 需要重新请求数据
				this.$store.state.history_needRefresh = true;

				this.loadData("TopLoad");
			},
			// 上拉加载
			loadBottom_history(){

			    var that = this;

			    if (that.allLoaded){
			     	that.$refs.loadmore.onBottomLoaded();
			        return;
			    }else{
			     
			        that.loadPage += 1;
			    }

				// 需要重新请求数据
				this.$store.state.history_needRefresh = true;

				this.loadData("BottomLoad");
			}
		}
	}
</script>
<style lang="less" scoped>
	.historyList{
		height: 100%;
		header{
			background-color: #fff;
			color: #000;
			display: flex;
			&>div{
				flex-grow: 1;
			}
			.currentTask{
				border-bottom: 3/50rem solid #f0f0f0;
			}
			.historyTask{
				color: #fff;
				background-color:#5965D8;
				border-bottom: 3/50rem solid #5965D8;
				position: relative;
				i{
					position: absolute;
					top: 5/50rem;
					right: 20/50rem;
				}
				i.iconfont::before{
				  font-size:40/50rem;
				}
			}
		}
		// .summarized{
		// 	width: 100%;
		// 	position: fixed;
		// 	top: 90/50rem;
		// 	left: 0;
		// 	z-index: 999;
		// 	height: 110/50rem;
		// 	background-color: #F5F5F5;
		// 	padding:15/50rem 20/50rem;
		// 	box-sizing: border-box;
		// 	overflow: hidden;
		// 	&>div{
		// 		float: left;
		// 		font-size: 30/50rem;
		// 		color: #000;
		// 		height: 80/50rem;
		// 		line-height: 80/50rem;
		// 		overflow: hidden;
		// 		&:nth-child(1){
		// 			// margin-right: 20/50rem;
		// 		}
		// 		.block{
		// 			height: 100%;
		// 			.el-date-editor--month{
		// 				width: 300/50rem;
		// 				height: 100%;
		// 			}
		// 			.monthInput{
		// 				height: 70/50rem;
		// 			}
		// 		}
		// 		&>div{
		// 			font-size: 25/50rem;
		// 			color: #9B9B9B;
		// 			float: left;

		// 			margin-bottom: 10/50rem;
		// 			&:nth-child(1){
		// 				margin-right: 30/50rem;
		// 			}
		// 		}
		// 	}
		// }
		.container{
			padding-top: 0;
			margin-top: 0;
			font-size: 29/50rem;
			height: 100%;
			.bigList{
				text-align: left;
				&>div{
					overflow: hidden;
					position: relative;
					width: 100%;
					padding: 20/50rem;
					box-sizing: border-box;
					&>div{
						// height: 55/50rem;
						line-height: 55/50rem;
						overflow: hidden;
					}
					.iconfont{
						font-size: 35/50rem;
						color: #2B5FD8;
						margin-right: 5/50rem;
					}
				}
				&>div.searchResult{
					padding:10/50rem 20/50rem;
					background-color: #fff;
					border-bottom: 8/50rem solid #EDEFF3;
					.place{
						overflow: hidden;
						height: 70/50rem;
				  		line-height: 70/50rem;
						border-bottom: 1/50rem solid #EDEFF3;
						span{
							float: left;
						}
						.dateLoading{
							float: right;
							color: #777;
							font-size: 27/50rem;
						}
					}
					.firstLine{
						margin-top: 20/50rem;
						i{
							margin:0 20/50rem;
						}
					}
					.detailBtn{
						height: 60/50rem;
						span{
							float: right;
							height:50/50rem;
							line-height: 50/50rem;
							width: 180/50rem;
							border-radius:10/50rem;
							color:#fff;
							background-color: #6897FF;
							text-align: center;
						}
						span:nth-child(2){
							margin-right: 20/50rem;
						}
					}
				}
			}
		}
	}
	// 

</style>
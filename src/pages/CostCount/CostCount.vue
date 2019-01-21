<template>
	<div class="CostCount">
		<header><span>费用统计</span><i class="iconfont icon-huabanfuben"  @click="search('CostCount')"  ></i></header>
		<div class="container" style="overflow:scroll;">
			<div class="topKong"></div>
			<mt-loadmore style="text-align: center;" topDropText="下拉刷新"   topLoadingText=""  topPullText='' bottomPullText="" bottomDropText="" bottomLoadingText="" :top-method="loadTop_Cost"  :bottom-method="loadBottom_Cost"  ref="loadmore_Cost"   :autoFill="autoFill">
				<div class='CostCountContainer' style="text-align: left;" >
					<div class="search_Label">
						<div @click="searchLabel_close('startDate')"  v-if="CostCount_SearchData.startDate"><span>开始日期</span><i class="iconfont icon-guanbi" ></i></div>
						<div @click="searchLabel_close('endDate')"  v-if="CostCount_SearchData.endDate"><span>结束日期</span><i class="iconfont icon-guanbi" ></i></div>
						<div @click="searchLabel_close('shipmentCode')"  v-if="CostCount_SearchData.shipmentCode"><span>配载单号</span><i class="iconfont icon-guanbi" ></i></div>
						<div @click="searchLabel_close('endCity')"  v-if="CostCount_SearchData.endCity"><span>目的城市</span><i class="iconfont icon-guanbi" ></i></div>
						<div @click="searchLabel_close('omsNo')"  v-if="CostCount_SearchData.omsNo"><span>订单号</span><i class="iconfont icon-guanbi" ></i></div>
					</div>
					<div class='grabList'   v-for='(itemName,index) in CostCountData'  :id="index"  :key='index'>
					    <span class='status'>{{itemName.statusText}}</span>
					    <div class='city'>
					    	<span>{{itemName.startCity}}</span>&nbsp;&nbsp;&nbsp;
								<i class="iconfont icon-jiang" ></i>&nbsp;&nbsp;&nbsp;
							<span>{{itemName.endCity}}</span>
					    </div>
					    <div>
					    	<span class="black">配载时间：</span>{{itemName.addDate}}
					    </div>
					    <div>
					    	<span class="black">配载单号：</span>{{itemName.code}}
					    </div>
					    <div>
					    	<span class="black">运&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 量：</span>
							<span>{{(itemName.vol * 0.000001).toFixed(3)}} 立方米 &nbsp;&nbsp; </span>
							<span>{{(itemName.wt * 0.000001).toFixed(3)}} 吨 &nbsp;&nbsp; </span>
							<span>{{itemName.qty}} 箱</span>
						</div>
				        <div>
					        <span class="black">收入金额：</span>{{itemName.payTotalMoney}}
				        </div>
				    </div>
				    <div v-if="allLoaded && CostCountData.length " class="nodata_label">没有更多数据</div>
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
		</div>
		<FooterIndex/>
	</div>
</template>
<script type="text/javascript">
import FooterIndex from '../../components/footer.vue'
	export default{
		name:"CostCount",
		data(){
			return{
				CostCountData:[],//页面数据列表
				is_NoData:false,
				is_NoData_text:"没有任务",

				numberPerPage: 10,//每页显示几条
				loadPage: 1 ,//当前第几页
				allLoaded:true,//上拉刷新还能上拉刷新
				autoFill:false,//
				CostCount_NoSearchFrom:true,//判断是否为搜索页面转来 false为搜索页面转来

				// 查询条件
				CostCount_SearchData:{
					startDate: null,//开始时间
				    endDate: null,//结束时间
				    shipmentCode: null,// 配载单号
	                omsNo: null,//订单号
	                endCity: null,//目的城市
				}

			}
		},
		components:{
			FooterIndex
		},
		created(){

			var that = this;

			//判断是否为搜索页面转来 false为搜索页面转来
			this.CostCount_NoSearchFrom = that.$store.state.CostCount_NoSearchFrom;

			// 从搜索页面带来的查询条件
			if(!that.$store.state.CostCount_NoSearchFrom){

				this.CostCount_SearchData = this.$store.state.CostCount_SearchData;
			}

			this.loadData();
		},
		// 页面销毁前
		beforeDestroy(){

			var that = this;

			that.$store.state.CostCount_NoSearchFrom = true;
		},
		methods:{
			// 请求页面数据
			loadData(load){

			    // shipBillStatus: null,//结算状态（YI=已结算；BUFEN=部分结算；WEI=未结算）
			    // startCity: null,//起点城市

				var that = this;

				if(that.$store.state.CostCount_needRefresh || !that.$store.state.CostCount_StoreData.length || !that.$store.state.CostCount_NoSearchFrom){

					var postData;

					// 从搜索页面而来
					if(!that.$store.state.CostCount_NoSearchFrom){

						postData = that.$store.state.CostCount_SearchData;

					}else{

						postData = {
						    startDate: null,//开始时间
						    endDate: null,//结束时间
						    shipmentCode: null,//配载单号
						    omsNo:null,// 订单号
						    endCity: null,//目的城市
						    vehicleCode: that.$store.state.userInfo.vicheNo,//车牌号(界面可不显示，默认当前司机车牌号，必填)
						    cellphone: that.$store.state.userInfo.cellphone,//手机号
					    };
					}

					postData.currentPage = that.loadPage;//当前第几页
					postData.numberPerPage = that.numberPerPage;//每页显示几条

					this.httpRequest( "queryShipmentFee.do",postData,function(res){

						if(load){
							if(load == "TopLoad"){

								that.$refs.loadmore_Cost.onTopLoaded();

							}else if(load == "BottomLoad"){

								that.$refs.loadmore_Cost.onBottomLoaded();
							}
						}
						for(var i=0 ; i < res.data.length ; i++){

							if (res.data[i].shipBillStatus =="NO_CONFIRM") {

					            res.data[i].statusText = "待确定";

					        } else if (res.data[i].shipBillStatus == "CONFIRM") {

					            res.data[i].statusText = "待结算";

					        } else if (res.data[i].shipBillStatus == "NOT_ALL_CHARGE") {

					            res.data[i].statusText = "部分结算";

					        } else if (res.data[i].shipBillStatus == "ALL_CHARGE") {

					            res.data[i].statusText = "结算完成";
					        }
						}
						//上拉加载后 数据拼接
				        if (that.loadPage > 1) {
					   
					        that.CostCountData = that.CostCountData.concat(res.data)
					      
				        } else {
					       
					        that.CostCountData = res.data;

							if(res.data.length){

								that.is_NoData = false; //没有数据模块 是否显示

							}else{
								that.is_NoData_text = "没有结果"

								that.is_NoData = true;
							}
				        }

				        that.$store.state.CostCount_StoreData = that.CostCountData;

					    // 判断是否能上拉加载
					    if (res.data.length < that.numberPerPage) {
					 
					        that.allLoaded = true;
				
					    } else {
					        
					        that.allLoaded = false;
						}
					})
				}else{

					that.CostCountData = that.$store.state.CostCount_StoreData;

					if(load){
						if(load == "TopLoad"){

							that.$refs.loadmore_Cost.onTopLoaded();

						}else if(load == "BottomLoad"){

							that.$refs.loadmore_Cost.onBottomLoaded();
						}
					}

					if(that.CostCountData.length){

						that.is_NoData = false; //没有数据模块 是否显示

					}else{

						that.is_NoData = true;

						that.is_NoData_text = "没有结果"
					}

					this.$emit('isLoading', false);
				}
			},
			// 点击搜索后的单个小标签
			searchLabel_close(searchName){

				this.$store.state.CostCount_SearchData[searchName] = null;

				this.loadData();
			},
			// 下拉刷新
			loadTop_Cost() {

		        this.loadPage = 1;

		        this.allLoaded = false;

		        // 需要重新请求数据
				this.$store.state.CostCount_needRefresh = true;

				this.loadData("TopLoad");
			},
			// 上拉加载
			loadBottom_Cost(){

			    var that = this;

			    if (that.allLoaded){

			     	that.$refs.loadmore_Cost.onBottomLoaded();
			        return;
			    }else{
			     
			        that.loadPage += 1;
			    }
			    console.log(this.$store.state.CostCount_needRefresh)

			    // 需要重新请求数据
				this.$store.state.CostCount_needRefresh = true;

				this.loadData("BottomLoad");
			}
		}
	}
</script>
<style lang="less" scoped>
	.CostCount{
		height: 100%;
		.container{
			height: 100%;
			padding-top: 0;
			margin-top: 0;
			.CostCountContainer{
			    font-size: 26/50rem;
				.grabList{
				    padding: 30/50rem;
				    box-sizing: border-box;
				    background-color: #fff;
				    border-bottom: 20/50rem solid #EFEFF2;
				    position: relative;
				    &>div{
					    overflow: hidden;
					    margin-bottom: 18/50rem;
					    &>div{
						    float: left;
						    &:nth-child(1){
							    width: 400/50rem;
							}
							&:nth-child(2){
							    width: 290/50rem;
							}
						}
						i{
							color: #6897FF;
						}
					}
				    &::after{
					 	content: "";
						width: 0;
						height: 0;
						display: block;
						position: absolute;
					    color: #fff;
					    right: 0/50rem;
					    top: 0/50rem;
					    border-left:200/50rem solid transparent;
					    border-right: 0/50rem solid transparent;
						border-top: 100/50rem solid #6897FF;
						z-index: 22;
					}
					&::before{
					 	content: "";
						width: 0;
						height: 0;
						display: block;
						position: absolute;
					    right: 0/50rem;
					    top: 0/50rem;
					    border-left:70/50rem solid transparent;
					    border-right: 0/50rem solid transparent;
						border-top: 35/50rem solid #fff;
						z-index: 33;
					}
					.status{
					    position: absolute;
					    width:120/50rem;
					    text-align: center;
					    right: 5/50rem;
					    top:20/50rem;
					    z-index: 99;
					    color: #fff;
					    transform:rotate(29.5deg);
					}
					i{
					    margin-right: 15/50rem;
					}
				}
				.black{
					color: #000;
				}
			}
			.kong{
				height: 200/50rem;
				width: 100%;
			}
			.icon-qi1,.icon-zhong2{
			    font-size:45/50rem;
			}
			.icon-changjiantou{
			    font-size: 22/50rem;
			    margin: 0 30/50rem;
			}
		}
	}
</style>
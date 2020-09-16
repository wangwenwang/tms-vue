<template>
	<div class="Index">
		<header><span>首页</span></header>
		<div class="container">
			<div class="swipper">
				<div class="block">
				    <el-carousel trigger="click" height="150px">
				        <el-carousel-item>
				        	<img style=" height:150px;width: 100%" src="../../assets/images/index/ad_pic_0.jpg">
				        </el-carousel-item>
				        <el-carousel-item>
				        	<img style=" height:150px;width: 100%" src="../../assets/images/index/ad_pic_1.jpg">
				        </el-carousel-item>
				        <el-carousel-item>
				        	<img style=" height:150px;width: 100%" src="../../assets/images/index/ad_pic_2.jpg">
				        </el-carousel-item>
				        <el-carousel-item>
				        	<img style=" height:150px;width: 100%" src="../../assets/images/index/ad_pic_3.jpg">
				        </el-carousel-item>
				    </el-carousel>
				</div>
			</div>
			<div class="noticeHeader"><span>通知：</span><span @click="accusation_click">举报中心</span></div>
			<div class="noticeContent"  style="overflow:scroll;height: calc(100% - 310px);">
				<mt-loadmore style="text-align: center; "  topDropText="下拉刷新"   topLoadingText=""  topPullText='' bottomPullText="" bottomDropText="上拉加载" bottomLoadingText="" :top-method="loadTop"  :bottom-method="loadBottom"  ref="loadmore"  :autoFill="autoFill" >
			
					<div class="noticeItem" @click="toWaybillInfo(itemData.shipmentID,itemData.appointLoadingSite)" v-for='(itemData,idx) in noticeList'  :id="idx"  :key='idx'>
						<div>
							<i v-if="itemData.daoDaPlace == '未查看'" class="iconfont icon-weiduxiaoxi  red" ></i>
							<i v-else class="iconfont icon-yiduxiaoxi-" ></i>
							<span>配载单号：</span>
							<span>{{itemData.code}}</span>
							<span>{{itemData.addDate}}</span>
						</div>
					</div>
				
				</mt-loadmore>
			</div>
		</div>
		<FooterIndex/>
	</div>
</template>
<script type="text/javascript">
import FooterIndex from '../../components/footer.vue'
	export default{
		name:"Index",
		data(){
			return{
				noticeList:[],//通知列表
				numberPerPage: 10,//每页显示几条
				loadPage: 1 ,//当前第几页
				allLoaded:true,//上拉刷新还能上拉刷新
				autoFill:false,//
			}
		},
		components:{
		  	FooterIndex
		},
		created(){

			var that = this;

			if(this.$store.state.userInfo.userType == "owner"){
				this.$router.push({
				    name:"publishGoods"
				})
				return
			}

			this.loadData();

		},
		methods:{
			//跳转举报中心页面
			accusation_click(){
				this.$router.push({
					name:"AccusationCenter",
				})
			},
			// 加载页面数据
			loadData(load){

				var that = this;

				// 请求通知列表数据
				var postData = {
					currentPage: this.loadPage,//当前第几页
					numberPerPage: this.numberPerPage,//每页显示几条
					cellphone: that.$store.state.userInfo.cellphone,//手机号
				}
				
				this.httpRequest( "deriverAueryShipmentData",postData,function(res){

					if(load){
						if(load == "TopLoad"){

							that.$refs.loadmore.onTopLoaded();

						}else if(load == "BottomLoad"){

							that.$refs.loadmore.onBottomLoaded();
						}
				    }

					//上拉加载后 数据拼接
			        if (that.loadPage > 1) {
				   
				        that.noticeList = that.noticeList.concat(res.data)
				      
			        } else {
				       
				        that.noticeList = res.data;

						// if(res.data.length){

						// 	that.is_NoData = false; //没有数据模块 是否显示

						// }else{

						// 	that.is_NoData_text = "没有任务"
							

						// 	that.is_NoData = true;
						// }
			        }
				})
			},
			// 跳转到配载单信息页面
			toWaybillInfo(shipmentID,appointLoadingSite){

				// WEI   未交付    YI  已交付
				
				if(appointLoadingSite == "WEI"){

					this.$router.push({
						name:"WaybillInfo",
						query:{
							shipmentID:shipmentID
						}
					})

				}else{

					this.$router.push({
						name:"WaybillDetail",
						query:{
							shipmentID:shipmentID
						}
					})
				}
			},
			// 下拉刷新
			loadTop() {

				console.log(8888)

		        this.loadPage = 1;

		        this.allLoaded = false;

				this.loadData("TopLoad");
			},
			// 上拉加载
			loadBottom(){

			    var that = this;
			     
			    that.loadPage += 1;

				this.loadData("BottomLoad");
			}
		}
	}
</script>
<style lang="less" scoped>
	.Index{
		height: 100%;
		overflow: hidden;
		.container{
			height: 100%;
			overflow: scroll;
			.noticeHeader{
				background-color: #f0f0f0;
				line-height: 40/50rem;
				padding:10/50rem 20/50rem;
				box-sizing: border-box;
				color: #999;
				display: flex;
				justify-content: space-between;
				&>span{
					padding: 4/50rem;
				}
				&>span:last-child{
					border:1/50rem solid red;
					background-color: red;
					border-radius: 5/50rem;
					color: #fff;
					font-size: 22/50rem;
					padding:0 20/50rem;
				}
			}
			.noticeContent{
				font-size: 30/50rem;
				overflow: scroll;
				div.noticeItem{
					&>div{
						overflow: hidden;
						height: 100/50rem;
						line-height: 100/50rem;
						border-bottom: 5/50rem solid #EDEFF3;
						i{
							font-size: 60/50rem;
							width: 60/50rem;
							float: left;
							margin-right: 10/50rem;
							color: #777;
							text-align: center;
						}
						i.red{
							color: red;
						}
						i.icon-yiduxiaoxi-{
							font-size: 48/50rem;
						}
						&>span:nth-child(2){
							float: left;
						}
						&>span:nth-child(4){
							float: right;
							color: #333;
							font-size: 26/50rem;
						}
					}
				}
			}
		}
	}
</style>
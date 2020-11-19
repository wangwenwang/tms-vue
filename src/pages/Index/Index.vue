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
			<div class="toPage">
				<div @click="toFillingStation">
					<i class="iconfont icon-ziyuan" style="color: #D9231F; font-size:30px;"></i>
					<div class="grid-text">加油</div>
				</div>
				<div @click="toChargingPile">
					<i class="iconfont icon-chongdianzhuang" style="color: #06C601; font-size:30px;"></i>
					<div class="grid-text">充电</div>
				</div>
				<div @click="toViolation">
					<i class="iconfont icon-weixiu" style="color: #777777; font-size:30px;"></i>
			    	<div class="grid-text">维修</div>
				</div>
				<div @click="accusation_click">
					<i class="iconfont icon-jubao" style="color: #F0C900; font-size:30px;"></i>
			    	<div class="grid-text">举报</div>
				</div>
			</div>
			<div class="noticeContent">
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

					if(res.data.length){
						for (var i = res.data.length - 1; i >= 0; i--) {
							res.data[i].addDate = res.data[i].addDate.substring(5,16)
						}
					}

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

		        this.loadPage = 1;

		        this.allLoaded = false;

				this.loadData("TopLoad");
			},
			// 上拉加载
			loadBottom(){

			    var that = this;
			     
			    that.loadPage += 1;

				this.loadData("BottomLoad");
			},
			toFillingStation(){
				this.$router.push({
					name:"FillingStation",
				})
			},
			toChargingPile(){
				this.$router.push({
					name:"ChargingPile",
				})

			},
			toViolation(){
				this.$router.push({
					name:"Violation",
				})
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
			background-color:#E5E8FA;
			.noticeContent{
				font-size: 30/50rem;
				overflow: scroll;
				height:calc(100% - 14.6rem);
				margin:0 15/50rem 15/50rem 10/50rem;
				border:1/50rem solid #E5E8FA;
	            border-radius:20/50rem;

				.noticeItem{
					background-color:#fff;
					&>div{
						overflow: hidden;
						height: 100/50rem;
						line-height: 100/50rem;
						border-bottom: 1/50rem solid #E5E8FA;
						display:flex;
						padding:0 10/50rem;
						i{
							font-size: 60/50rem;
							width: 60/50rem;
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
						&>span:nth-child(4){
							color: #666;
							font-size: 26/50rem;
							text-align: right;
							width: 32%;
						}
					}
				}
			}
			.toPage{
				display:flex; 
				justify-content:space-around;
				text-align:center;
				padding: 30/50rem 0;
				background-color:#E5E8FA;
				&>div{
					color:#757575;
					border:1/50rem solid #E5E8FA;
					background-color:#fff;
					border-radius:20/50rem;
					width:150/50rem;
					height:120/50rem;
					padding-top:20/50rem;
				}
			}
		}
	}
</style>
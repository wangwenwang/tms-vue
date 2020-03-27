<template>
	<div class="HistoricalTrack">
		<header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>历史轨迹</span></header>
		<div class="container">
			<div class="TrackList"  v-for='(dataItem,index) in TrackListData'  :id="index"  :key='index' >
				<div>{{dataItem.trackingTime}}</div>
				<div>{{dataItem.vehicleLocation}}</div>
			</div>
			<!-- 页面数据为空时 -->
			<div   v-if="is_NoData"   class="NoData" >
				<div>
					<i  class="iconfont icon-meiyouwuliuxinxi" ></i>
					<div>{{is_NoData_text}}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		name:"HistoricalTrack",
		data(){
			return{
				TrackListData:[],//轨迹列表
				is_NoData:false,
				is_NoData_text:"没有任务",
			}
		},
		 mounted(){

            window.history.pushState(null, null, document.URL)
            window.addEventListener("popstate", this.onBrowserBack, false)
        },
        destroyed() {

            window.removeEventListener("popstate", this.onBrowserBack, false)
        },
		created(){

			var that = this;

			var postData = {
			    cellphone: that.$store.state.userInfo.cellphone,//手机号   15013418360
		    };

			this.httpRequest("queryTrajectoryData.do",postData,function(res){

				that.TrackListData = res.data;

				if(!res.data.length){

					that.is_NoData_text = "没有结果"

					that.is_NoData = true;
				}


			})

		},
		methods:{
			// 监听系统返回键
            onBrowserBack() {
              
                this.goPrev()
            },
			// 返回上一页
			goPrev(){

				this.$router.push({
					name:"HomeIndex",
					query:{
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.HistoricalTrack{
		overflow: hidden;
		.container{
			overflow: hidden;
			.TrackList{
				padding: 30/50rem;
				box-sizing: border-box;
				border-bottom: 1/50rem solid #777;
				&>div:nth-child(1){
					margin-bottom: 20/50rem;
				}
			}
		}
	}
	@media screen and (max-width: 374px){

		.HistoricalTrack{
			.container{
				.TrackList{
					border-bottom: 3/50rem solid #777;
				}
			}
		}
	}
</style>
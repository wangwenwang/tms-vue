<template>
	<div class="CheckDeliverPicture">
		<header><i class="iconfont icon-xiangzuo1"   @click="$router.back(-1)"></i><span>查看交付照片{{ this.$route.query.omsNo }}</span></header>
		<div class="container">

			<div  v-for='(dataItem,index) in urlParts'>

				<div class="PictureContainer">
	    			<img  class="picture" align="middle" :src="dataItem.Product_Url" preview='2'>
				</div>

			</div>

		</div>
	</div>
</template>
<script type="text/javascript">

	export default{
		name:"CheckDeliverPicture",
		data(){
			return{
				urlParts:[],// 照片后缀
			}
		},
		created(){

			var that = this;

			var postData = {
				strOrderIdx: this.$route.query.deliveryId,//配载单id
				strLicense:"",//查询已交付状态配载单
		    };

			this.httpRequestMHY("http://mobile.kaidongyuan.com/easyToSell/GetOrderPicture.do",postData,function(res){

				that.$emit('isLoading_',false);

				that.urlParts = res.data;

				that.$previewRefresh()
			})

		},
		methods:{
			// 返回上一页
			goprev(){

				this.$router.push({
					name:"historyList",
					query:{
					}
				})

			},
		}
	}
</script>
<style lang="less" scoped>
	.CheckDeliverPicture{
		.container{
			.PictureContainer{
				color: #FF3030;
				margin-top: 20/50rem;
				height: 360/50rem;
				// background-color: #66CD00; 
				text-align: center;

			}
			.picture{
				height: 100%;
			}
			margin-bottom: 20/50rem;
		}
	}
</style>
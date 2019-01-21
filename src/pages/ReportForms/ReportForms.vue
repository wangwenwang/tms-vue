<template>
	<div class="ReportForms">
		<header><span>报表</span></header>
		<div class="container">
			
		</div>
		<!-- 页面数据为空时 -->
		<div    class="NoData" >
			<div>
				<i  class="iconfont icon-meiyouwuliuxinxi" ></i>
				<div>{{is_NoData_text}}</div>
			</div>
		</div>
		<FooterIndex/>
	</div>
</template>
<script type="text/javascript">
import FooterIndex from '../../components/footer.vue'
	export default{
		name:"ReportForms",
		data(){
			return{
				is_NoData_text:'没有数据'
			}
		},
		components:{
		  	FooterIndex
		},
	}
</script>
<style lang="less" scoped>
	.ReportForms{
		overflow: hidden;
	}
</style>
<template>
	<div class="chooseRole">
		<header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>选择身份</span></header>
		<div class="container">
			<div><div  class="driverBtn"  @click='driverSubmit'>司 机</div></div>
			<div><div  class="ownerBtn"  @click='ownerSubmit'>货 主</div></div>
			
		</div>
	</div>
</template>
<script type="text/javascript">
	import $ from 'jquery'
	export default{
		name:"chooseRole",
		data(){
			return{
			    phoneNum:'',//上个页面传来的手机号
			}
		},
		created(){

			this.phoneNum = this.$route.query.phoneNum;
		},
		methods:{
			goPrev(){
				this.$router.push({
					name:"Identifying",
					query:{
						page:"ChooseRole",
					}
				})
			},
			//选择司机
		    driverSubmit (){
                this.$router.push({
			        name:"Reg",
			        query:{
			        	page:"ChooseRole",
			        	userRole:"driver",
			        	phoneNum:this.phoneNum,
			        }
				})
			},

			//选择货主
		    ownerSubmit (){
			    this.$router.push({
					name:"Reg",
					query:{
						page:"ChooseRole",
						userRole:"owner",
						phoneNum:this.phoneNum,
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.chooseRole{
		overflow: hidden;
		.container{
		    width:100%;
		    height: 100%;
		    overflow: hidden;
		    font-size: 28/50rem;
		    box-sizing: border-box;
		    
		    &>div{
		    	width: 100%;
		    	height: 450/50rem;
		    	text-align: center;
		    	display: flex;
		    	justify-content: center;
		    	// line-height: 500/50rem;
		    	&>div{
		    		height: 240/50rem;
		    		width: 240/50rem;
		    	    line-height: 240/50rem;
		    	    border-radius: 120/50rem;
		    	    border:1/50rem solid  #CED3ED;
		    	    text-align: center;
		    	    background-color: #CED3ED;
		    	    color: #757575;
		    	    font-weight: 600;
		    	    font-size: 36/50rem;
		    	    margin-top: 200/50rem;
		    	}

		    }

		 //    &>div{
		 //    	position: relative;
		 //    	&>span{
			// 	    float: left;
			// 	    width: 130/50rem;
			// 	    margin-right: 20/50rem;
			// 	    height:60/50rem;
			// 	    line-height: 60/50rem;
			// 	    display: block;
			// 	}
			// 	&>input{
			// 	    float: left;
			// 	    height: 60/50rem;
			// 	    line-height: 60/50rem;
			// 	    width:480/50rem;
			// 	    border: none;
			// 	    border-bottom: 3/50rem solid #000;
			// 	    border-radius: 0;
			// 	}
			// 	.icon-iconfontcuowu{
			// 		top: 40/50rem;
			// 		right: 10/50rem;
			// 	} 
		 //    }
		 //    &>div:nth-child(1),&>div:nth-child(2){
			//     overflow: hidden;
			//     background-color: #fff;
			//     padding:30/50rem 0;
			//     width: 100%;
			// }
		}
	}
</style>
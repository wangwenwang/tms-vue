<template>
    <div class="Search">
	    <header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>搜索</span></header>
		<div class="container">
  			<div class='CompetitionScreen'>
    			<div class='screen'>
      			    <div><span>开始日期</span><el-date-picker id="startvalue"  :editable='false' v-model="startvalue"  type="date"  placeholder="选择日期"></el-date-picker></div>
      			    <div><span>结束日期</span><el-date-picker id="endValue"  :editable='false' v-model="endValue"  type="date"  placeholder="选择日期"></el-date-picker></div>
                    
                    <!-- 历史任务 -->
                    <div  v-if="thisPage == 'History'" >
                        <span>送货单号</span>
                        <input v-model='order_DeliveryNum' placeholder='请输入送货单号'  ></input>
                        <i v-if="order_DeliveryNum" @click="clearInput('order_DeliveryNum')" class="iconfont icon-iconfontcuowu"></i>
                    </div>
                    <div  v-if="thisPage == 'History'" >
                        <span>配载单号</span>
                        <input v-model='order_WaybillNum' placeholder='请输入配载号'  ></input>
                        <i v-if="order_WaybillNum" @click="clearInput('order_WaybillNum')" class="iconfont icon-iconfontcuowu"></i>
                    </div>
                    <div  v-if="thisPage == 'History'" >
                        <span>客户单号</span>
                        <input v-model='CustomerNum' placeholder='请输入客户单号'  ></input>
                        <i v-if="CustomerNum" @click="clearInput('CustomerNum')" class="iconfont icon-iconfontcuowu"></i>
                    </div>

		              <!--费用统计  -->
                    <div v-if="thisPage == 'CostCount'"  >
                        <span>配载单号</span>
                        <input  v-model='Cost_WaybillNum' placeholder='请输入配载单号' ></input>
                        <i v-if="Cost_WaybillNum" @click="clearInput('Cost_WaybillNum')" class="iconfont icon-iconfontcuowu"></i>
                    </div>
                    <div v-if="thisPage == 'CostCount'"  >
                        <span>目的城市</span>
                        <input  v-model='Cost_toCity' placeholder='请输入目的城市' ></input>
                        <i v-if="Cost_toCity" @click="clearInput('Cost_toCity')" class="iconfont icon-iconfontcuowu"></i>
                    </div>
      			    <div v-if="thisPage == 'CostCount'"  >
                        <span>订单号</span>
                        <input  v-model='Cost_omsNo' placeholder='请输入订单号' ></input>
                        <i v-if="Cost_omsNo" @click="clearInput('Cost_omsNo')" class="iconfont icon-iconfontcuowu"></i>
                    </div>
                    <!-- <div v-if="thisPage == 'CostCount'"   @click='typeShow'><span>结算状态</span><div><span>{{Cost_Settlement}}</span><i class="iconfont icon-msnui-menu-right"></i></div></div> -->
		        </div>
                <div class="g_doubleBtn">
                    <div @click="reset">重置</div>
                    <div @click="sureScreen">搜索</div>
                </div>
		    </div>
	    </div>
	</div>
</template>
<script type="text/javascript">
    
    import $ from "jquery"
	export default{
		name:"Search",
		data(){
			return{
                thisPage:'',//这个页面是什么页面
                typeHidden:false,//状态选择器

                startvalue:null,//开始时间
                endValue:null,//结束时间

                // 历史任务
                order_DeliveryNum:null,//送货单号
                order_WaybillNum: null,//配载单号
                CustomerNum:null,//客户单号

                // 费用统计
                Cost_WaybillNum: null,//配载单号
                Cost_toCity: null,//目的城市
                Cost_omsNo: null,//订单号

			    CostStatisticsHide:false,//费用统计 模块是否显示
			    orderHide: false,//我的运单 模块是否显示
			    findGoodsHide: false,//我要找货 模块是否显示
			    grabGoodsHide: false,//抢货竞标 模块是否显示

			    Cost_Settlement:"请选择",//费用统计 中的 结算状态
			    orderStatus_stateText: "请选择",//我的运单 中的 运单状态
			    balanceStatus_stateText: "请选择",//我的运单 中的 结算状态
			    businessType_stateText:"请选择",//我的运单 中的 运单类型
			}
		},
        created(){

            var that = this;

            // 这个页面是什么页面
            if(this.$route.query.thisPage){

                this.thisPage = this.$route.query.thisPage;

                // 历史任务
                if(this.thisPage == "History"){

                    this.startvalue =  that.$store.state.history_SearchData.startDate;
                    this.endValue =  that.$store.state.history_SearchData.endDate;
                    this.order_DeliveryNum =  that.$store.state.history_SearchData.deliveryNoinput;//送货单号
                    this.order_WaybillNum =  that.$store.state.history_SearchData.shipmentCodeinput;//配载单号
                    this.CustomerNum =  that.$store.state.history_SearchData.clientOrderNo;//客户单号

                // 费用统计
                }else if(this.thisPage == "CostCount"){

                    this.startvalue =  that.$store.state.CostCount_SearchData.startDate;
                    this.endValue =  that.$store.state.CostCount_SearchData.endDate;
                    this.Cost_WaybillNum =  that.$store.state.CostCount_SearchData.shipmentCode;//配载单号
                    this.Cost_omsNo =  that.$store.state.CostCount_SearchData.omsNo;// 订单号
                    this.Cost_toCity =  that.$store.state.CostCount_SearchData.endCity;//目的城市
                }
            }
        },
    	methods:{
            goPrev(){
                var that = this;

                 // 历史任务
                if(this.thisPage == "History"){
                    // 不需要重新请求数据
                    this.$store.state.history_needRefresh = false;

                    this.$router.push({
                        name:"historyList",
                        query:{
                        }
                    })

                // 费用统计
                }else if(this.thisPage == "CostCount"){
                    // 不需要重新请求数据
                    this.$store.state.CostCount_needRefresh = false;

                    this.$router.push({
                        name:"CostCount",
                        query:{
                        }
                    })
                }
            },
    		// 点击 筛选 按钮
            sureScreen(){

                var that = this;

                var startDate,endDate;

                if($("#startvalue").val()){

                    startDate = $("#startvalue").val();

                }else{
                    startDate =null;
                }

                if($("#endValue").val()){

                    endDate = $("#endValue").val();

                }else{
                    endDate =null;
                }

                // 历史任务
                if(this.thisPage == "History"){

                    that.$store.state.history_SearchData = {
                        startDate: startDate,// 开始日期
                        endDate: endDate,//  结束日期
                        deliveryNoinput: that.order_DeliveryNum,// 送货单号
                        shipmentCodeinput: that.order_WaybillNum,//  配载单号
                        clientOrderNo: that.CustomerNum,//客户单号
                        cellphone: that.$store.state.userInfo.cellphone,//手机号
                    }

                    that.$store.state.history_NoSearchFrom = false;//判断是否为搜索页面转来 false为搜索页面转来

                    that.$router.push({
                        name:"historyList",
                        query:{
                           
                        }
                    })

                // 费用统计
                }else if(this.thisPage == "CostCount"){

                    that.$store.state.CostCount_SearchData = {
                        startDate: startDate,//开始时间
                        endDate: endDate,//结束时间
                        shipmentCode: that.Cost_WaybillNum,//配载单号
                        omsNo: that.Cost_omsNo,// 订单号
                        // shipBillStatus: null,//结算状态（YI=已结算；BUFEN=部分结算；WEI=未结算）
                        // startCity: null,//起点城市
                        endCity: that.Cost_toCity,//目的城市
                        vehicleCode: that.$store.state.userInfo.vicheNo,//车牌号(界面可不显示，默认当前司机车牌号，必填)
                        cellphone: that.$store.state.userInfo.cellphone,//手机号
                    }

                    that.$store.state.CostCount_NoSearchFrom = false;//判断是否为搜索页面转来 false为搜索页面转来

                    that.$router.push({
                        name:"CostCount",
                        query:{
                           
                        }
                    })
                }
            },
            // 重置按钮
            reset(){
                this.startvalue = null;//开始时间
                this.endValue = null;//结束时间

                // 历史任务
                this.order_DeliveryNum = null;//送货单号
                this.order_WaybillNum =  null;//配载单号
                this.CustomerNum = null;//客户单号

                // 费用统计
                this.Cost_WaybillNum =  null;// 配载单号
                this.Cost_toCity = null;//目的城市
                this.Cost_omsNo = null;//订单号

                this.orderStatus_stateText = "请选择";//我的运单 运单状态
                this.balanceStatus_stateText =  "请选择";//我的运单 中的 结算状态
                this.businessType_stateText =  "请选择";//我的运单 中的 运单类型
                this.Cost_Settlement =  "请选择";//费用统计等三个页面  页面显示

                this.empty = "";//清空input内容
                this.Cost_SettlementId = null;
                this.orderStatus = null;
                this.balanceStatus = null;
                this.businessType = null;
          
            },

            // 状态选择器 显示
            typeShow(e){

                var that = this;

                // 如果这个页面是费用统计页面
                if (that.thisPage =="CostStatistics"){

                    // that.typeOfCarList = getApp().globalData.StateOfSettlement,//状态选择列表数据（结算状态）
                    that.selectiveType = "请选择结算状态";//状态选择器 的标题

                //抢货竞价页面
                } else if (that.thisPage == "grabGoods"){

                    // that.typeOfCarList = getApp().globalData.BiddingState;
                    that.selectiveType = "请选择竞单状态";
          
                //我要找货页面
                } else if (that.thisPage == "findGoods") {

                    // that.typeOfCarList = getApp().globalData.findState;
                    that.selectiveType = "请选择找单状态";

                //我的订单页面
                } else if (that.thisPage == "order") {

                    //运单状态
                    if (e.currentTarget.id == "orderStatus"){

                        // var typeOfCarList = getApp().globalData.orderStatus;
                        var selectiveType = "运单状态";

                        // that.orderStatus = getApp().globalData.orderStatus;
                        that.typeShow_detail = "orderStatus";

                    //结算状态
                    } else if (e.currentTarget.id == "balanceStatus") {

                        // var typeOfCarList = getApp().globalData.balanceStatus;
                        var selectiveType = "结算状态";

                        // that.balanceStatus = getApp().globalData.balanceStatus;
                        that.typeShow_detail = "balanceStatus";

                    //运单类型
                    } else if (e.currentTarget.id == "businessType") {

                        var typeOfCarList = [
                          {
                            state: "提货",
                            code: "PICKUP"
                          },
                          {
                            state: "派送",
                            code: "MAINLINE"
                          }
                        ];
                        var selectiveType = "运单类型";

                        that.businessType = typeOfCarList;
                        that.typeShow_detail = "businessType";

                    }

                  	that.typeOfCarList = typeOfCarList;
                    that.selectiveType = selectiveType;
                   
                } 

                this.typeHidden = true;
            },
            // 状态选择器  选择具体条目
            typeSure (e){

                var that = this;

                //我的运单页面
                if (that.thisPage == "order"){

                    //运单状态列表显示
                    if (that.typeShow_detail =="orderStatus"){

                      	that.orderStatus_state = that.orderStatus[e.currentTarget.id];//我的运单页面的 运单状态
                        that.orderStatus_stateText = that.orderStatus[e.currentTarget.id].state;//我的运单页面的 运单状态 页面显示


                    //结算状态列表显示
                    } else if (that.typeShow_detail == "balanceStatus") {

                
                        that.balanceStatus_state = that.balanceStatus[e.currentTarget.id];//我的运单页面的 结算状态
                        that.balanceStatus_stateText = that.balanceStatus[e.currentTarget.id].state;//我的运单页面的 结算状态 页面显示


                    //运单类型列表显示
                    } else if (that.typeShow_detail == "businessType") {

                
                        that.businessType_state = that.businessType[e.currentTarget.id];//我的运单页面的 运单类型
                        that.businessType_stateText = that.businessType[e.currentTarget.id].state;//我的运单页面的 运单类型 页面显示
                     
                    }

                }else{

                  that.Cost_Settlement = that.typeOfCarList[e.currentTarget.id].state;//费用统计页面 结算状态 显示在页面的文字

                }

              	that.typeHidden = false;
                that.ost_SettlementId = e.currentTarget.id;//选择的具体的id

            },
            // 状态选择器 消失
            typeCancle(){
                this.typeHidden = false;

            },
    	}	
    }
</script>
<style lang="less" scoped>
.Search{
    overflow: hidden;
}
  	.container{
        overflow: hidden;
    	.CompetitionScreen{
            height: 100%;
            font-size: 28/50rem;
            &>.screen{
                background-color: #fff;
                &>div{
                    border-bottom: 1/50rem solid #EDEDED;
                    padding:0 20/50rem;
                    box-sizing: border-box;
                    position: relative;
                    height: 95/50rem;
                    line-height: 95/50rem;
                    &>span{
                        width: 150/50rem;
                        float: left;
                    }
                    &>input{
                        float: left;
                        border: none;
                        width:500/50rem;
                        height: 92/50rem;
                    }
                    .icon-iconfontcuowu{
                        right:50/50rem;
                        top: 4/50rem;
                    }
                }
            }
        }
  	}
    @media screen and (max-width: 374px){

      .container{
        .CompetitionScreen{
            &>.screen{
                &>div{
                  border-bottom: 3/50rem solid #EDEDED;
                }
            }
        }
      }
    }
</style>
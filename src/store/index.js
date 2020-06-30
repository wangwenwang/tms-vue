import Vue from "vue"
import vuex from "vuex"

Vue.use(vuex);

export default new vuex.Store({
	state:{
		userInfo:[],//登录页面 登录成功后获得的用户信息列表

		typeOfCarList:[],//注册页面 车型列表
		CarrierList:[],//注册页面  承运商列表

		// 我的任务页面
		Waybill:{
			shipmentListData:[],//我的任务  配载单列表数据
			// address_listData:[],//当前多地址配载单的地址数组信息 shipmentListData[i].issueAddrLiat
			// currentAddressInfo:{},//当前显示的地址数组信息

			// 配载单详情页面
			WaybillInfo:{
				WaybillInfo:{},//配载单信息
			}
		},
		// WaybillData

		Waybill_needRefresh:true,//我的任务 页面数据是否需要刷新
		IF_Navigation:true,//我的任务页面 导航按钮是否显示
		
		deliveryList:[],//按地址交付 订单列表
		Device:"",//用户使用的设备（例如iOS, android）

		CostCount_StoreData:[],//费用统计页面数据
		CostCount_NoSearchFrom:true,//费用统计 判断是否从搜索页面转来
		CostCount_SearchData:{},//费用统计页面 从搜索页面带来的查询条件
		CostCount_needRefresh:true,//费用统计  页面数据是否需要刷新

		history_Data:[],//历史任务页面数据
		history_NoSearchFrom:true,//历史任务页面 判断是否从搜索页面转来
		history_SearchData:{},//历史任务页面 从搜索页面带来的查询条件
		history_needRefresh:true,//历史任务页面 页面数据是否需要刷新
		search_WaybillDetail:[],//运单详情 页面数据

		WX_Openid:'',//微信登录 Openid
		App_Version:'',//App版本号

		orderDeliver_picture_total_qty:0,//交付照片总数量（不包括签名图片)
		orderDeliver_picture_finish_qty:0,//交付照片已上传数量（不包括签名图片)
		orderDeliver_CurrentLocation:"",//交付地址
		orderDeliver_longitude:"",//交付经度
		orderDeliver_latitude:"",//交付纬度

		pg_publish:{
			load_pointList:[],
			unload_pointList:[],
			other_info:{goods_name:"", min_weight:"",max_weight:"",min_volume:"",max_volume:"",vehicle_type:"",orderType:"",load_time:"",remark:"",expected_cost:""},
			car_info:{vehicleLoad:"",vehicleVolume:"",vehicle_type:"",orderType:"",load_time:"",remark:"",expected_cost:""},
		},
		sourceInfo:{},//货源详情
		CarrierArr:[],//承运商列表(注册)
	}
})
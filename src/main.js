// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResouse from 'vue-resource'
import Axios from "axios"
import qs from "qs"
import store from "./store"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import $ from "jquery"
import Http from "http"


// 引入mint-ui
import { Loadmore } from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.component(Loadmore.name, Loadmore);

// 引入百度地图   index.html
import BMap from 'BMap';

// 百度地图
Vue.prototype.BaiDuMap = "http://api.map.baidu.com/geocoder/v2/";

// 引入图片查看器
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

Vue.use(VueResouse)

// element 日期时间选择器
Vue.use(ElementUI);

import { DatePicker,Upload,Loading,Notification,MessageBox } from 'element-ui';

Vue.use(DatePicker);
Vue.use(Upload);
Vue.use(Loading);
Vue.prototype.$notify = Notification;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

Vue.config.productionTip = false;

// Vue.prototype.HOST = "/api";


// Vue.prototype.HOST = "http://120.237.87.102:8081/tmsApp/"   
// Vue.prototype.HOST = "http://192.168.11.47:8880/cyscm/tmsApp/"
// Vue.prototype.HOST = "http://cykjgstest.3322.org:8091/tmsApp/"  //测试  外网

// Vue.prototype.HOST = "http://192.168.1.250:8091/tmsApp/"         //测试    内网

// Vue.prototype.HOST = "http://zwlttest.3322.org:8090/tmsApp/"
Vue.prototype.HOST = "http://k56.kaidongyuan.com/tmsApp/"    //正式   外网
// Vue.prototype.HOST = "http://120.77.206.44:80/tmsApp/"    //正式
// Vue.prototype.HOST = "http://120.77.206.44:8086/tmsApp/"    //测试

// Vue.prototype.HOST = "http://zwlttest.3322.org:8081/tmsApp/"

// Vue.prototype.HOST = "http://119.23.172.113:8086/tmsApp/"
// Vue.prototype.HOST = "http://192.168.20.113:8880/cyscm/tmsApp/"    //许三晏电脑IP，本地调试
// Vue.prototype.HOST = "http://192.168.20.131:8880/cyscm/tmsApp/"    //黄伟雄电脑IP，本地调试





// 登录接口
Vue.prototype.Login = "/login";

if( router.name != "Login"){

	//跳转到登录页面
	router.push({
		name:"Login",
		query:{
		}
	})
}


// Vue页面已加载
Vue.prototype.TelliOSORAndroidVueMounted=function (msg){ 

	// 安卓
	try { CallAndroidOrIOS.callAndroid("获取当前位置页面已加载", ""); } 
	catch(error) { }
	// 苹果
	try { CallAndroidOrIOS("获取当前位置页面已加载", ""); }
	catch(error) { }
}


// 查看轨迹
Vue.prototype.ViewTrajectoryInMain=function (shipmentID, shipmentCode){
	console.log("ID: " + shipmentID + "，shipmentCode: " + shipmentCode);
	// 安卓
	try {

		CallAndroidOrIOS.callAndroid("查看路线", shipmentID);
		CallAndroidOrIOS.callAndroid("查看路线", shipmentID, shipmentCode, "交付");

	} 
	catch(error) {

		// console.log("没有CallAndroidOrIOS.callAndroid方法")
	}

	// 苹果
	try {

		CallAndroidOrIOS("查看路线", shipmentID);
		CallAndroidOrIOS("查看路线", shipmentID, shipmentCode, "交付");
	}
	catch(error) {

		// console.log("没有CallAndroidOrIOS方法")
	}
}

//http请求
Vue.prototype.httpRequest=function (url,params,success){

	var that = this;

	console.log(url);

	that.$emit('isLoading', true,"拼命加载中");

	Axios.post(that.HOST+url,{"params": JSON.stringify(params)})
	.then(function(res){
		console.log(res)

		that.$emit('isLoading', false);

		if(res.data.status==1){

			success(res.data);

		}else{

			var msg;
			if(res.data.Msg){

				msg = res.data.Msg;

			}else{

				msg = url + "请求失败";
			}

			that.$alert(msg, '提示', {
	            confirmButtonText: '确定',
	            callback: action => {
		            
	            }
           	})
		}
	})
	.catch(function(res){

		that.$emit('isLoading', false);
			
		that.$alert("http请求失败", '提示', {
	        confirmButtonText: '确定',
	        callback: action => {
	            
	        }
	   	})
		
	})
}


//http请求（带完整的url）
Vue.prototype.httpRequestAllUrl=function (url,params,success){

	var that = this;

	console.log(url);

	that.$emit('isLoading', true,"拼命加载中");

	Axios.post(url,params)
	.then(function(res){
		console.log(res)

		that.$emit('isLoading', false);

		if(res.data.type==1){

			success(res.data);

		}else{

			var msg;
			if(res.data.Msg){

				msg = res.data.Msg;

			}else{

				msg = url + "请求失败";
			}

			that.$alert(msg, '提示', {
	            confirmButtonText: '确定',
	            callback: action => {
		            
	            }
           	})
		}
	})
	.catch(function(res){

		that.$emit('isLoading', false);
			
		that.$alert("http请求失败_All_URL", '提示', {
	        confirmButtonText: '确定',
	        callback: action => {
	            
	        }
	   	})
		
	})
}

// 获取当前位置
Vue.prototype.Geolocation=function (){

	var that = this;

	 var gc=[],subPoints;

	this.$emit('isLoading', true,"正在获取当前位置");

	var geolocation = new BMap.Geolocation();

    geolocation.getCurrentPosition((r) => {
        if (r.point) {

        	that.$http.jsonp(that.BaiDuMap,
        		{
        			params:{
        				"location": r.point.lat +","+ r.point.lng,
		        		"output": "json",
		        		"ak": "sW0ZQ9d5I9e5REl2G2D7kxeLXYolGpsN"
        			}
        		}
        	)
	        .then(function(res){

				console.log(res);
				console.log("地址：" + res.data.result.formatted_address);
				console.log("经度：" + res.data.result.location.lng);
				console.log("纬度：" + res.data.result.location.lat);

				that.longitude = res.data.result.location.lng;
				that.latitude = res.data.result.location.lat;

				that.$emit('isLoading', false);

				if(res.data.status == 0 && res.data.result.formatted_address){

					that.CurrentLocation = res.data.result.formatted_address;
					that.canvasTxt.fillText(that.CurrentLocation, 5, that.$refs.canvasHW.offsetHeight - 10);

					var postData = {
						deliveryIds:that.$route.query.deliverNo_list,//运单ID，比如：1001,1002,1003)，一个或多个交付统一传数组字符串
						longitude:that.longitude,//经度
						latitude:that.latitude//纬度
					}

					that.httpRequest( "deliveryCheckRange.do",postData,function(res){

						that.distance = res.data.warnMsg;
					})
					
				}else{

					that.$alert("获取位置失败", '提示', {
			            confirmButtonText: '确定'
		           	})
				}
			}).catch(function(res){

				that.$emit('isLoading', false);

				// that.$alert("获取位置失败", '提示', {
		  //           confirmButtonText: '确定'
	   //         	})
			})
        }
    }, { enableHighAccuracy: true })
}


// 获取当前时间并处理时间格式
Vue.prototype.getNowTime=function (){

	var date = new Date(),getMonth,getDate,getHours,getMinutes,getSeconds;

	function timeFormat(time_format,name_format){
		
		if(time_format < 10){

			return "0" + time_format;

		}else{

			return time_format;
		}
	}

	getDate = timeFormat(date.getDate(),getDate);
	getHours = timeFormat(date.getHours(),getHours);
	getMinutes = timeFormat(date.getMinutes(),getMinutes);
	getSeconds = timeFormat(date.getSeconds(),getSeconds);

	// 处理月份时间格式
	if(date.getMonth()+1 < 10){

		getMonth = "0" + (date.getMonth()+1);

	}else{
		getMonth = date.getMonth()+1;
	}

	return  date.getFullYear() + "-" + getMonth + "-" + getDate + " " + getHours + ":" + getMinutes + ":" + getSeconds ;
}

// 两个时间进行比较
Vue.prototype.timeCompare=function (nowDate,productDate,AllowableTime){

	//productDate  先
	// nowDate  后
	// AllowableTime  允许时长（比如 可预约30分钟之后的时间）

	var date = new Date(nowDate.replace(/-/g,'/'));
	var date1 = new Date(productDate.replace(/-/g,'/'));

    var time = date.getTime();
    var time1 = date1.getTime();

    // 装货预约
    if(AllowableTime){

    	if(time1 - time < AllowableTime*1000*60){
    	
	    	this.Exceed = true;
	    }

    }else{
    	// 我的任务页面 预约时间

		if(time1 < time){
    	
	    	return "red";
	    }else{

	    	return "rgb(0,210,0)";
	    }
    }
}
// -----------------------------------------------------设置cookie （手机号，密码） 开始--------------------------------------------------------------

//设置cookie
Vue.prototype.setCookie = function(c_name,c_pwd,exdays) {

    var exdate=new Date();//获取时间

    exdate.setTime(exdate.getTime() + 24*60*60*1000*exdays);//保存的天数

    //字符串拼接cookie
    window.document.cookie="tmsUserName"+ "=" +c_name+";path=/;expires="+exdate.toGMTString();
    window.document.cookie="tmsUserPwd"+"="+c_pwd+";path=/;expires="+exdate.toGMTString();
},
//读取cookie
Vue.prototype.getCookie = function (e) {

    if (document.cookie.length>0) {

      var arr=document.cookie.split('; ');//这里显示的格式需要切割一下自己可输出看下

      for(var i=0;i<arr.length;i++){

        var arr2=arr[i].split('=');//再次切割

        //判断查找相对应的值
        if(arr2[0]=='tmsUserName'){

          this.userName=arr2[1];//保存到保存数据的地方

        }else if(arr2[0]=='tmsUserPwd'){

          this.password=arr2[1];
        }
      }
    }
},
//清除cookie
Vue.prototype.clearCookie = function () {

    this.setCookie("","",-1);//修改2值都为空，天数为负1天就好了
}

// -----------------------------------------------------设置cookie （手机号，密码） 结束--------------------------------------------------------------

// 上传图片钩子   开始

//上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
Vue.prototype.beforeUpload = function (file){

	var str= navigator.userAgent.toLowerCase(); 
    var ver=str.match(/cpu iphone os (.*?) like mac os/);
    if(ver){
        var iOSVersion = ver[1].replace(/_/g,".");
    	var partVersion = iOSVersion.substring(0,1);
    	// iOS9不对图片进行压缩，lrz会有异常，后期更换压缩方法
    	if(partVersion == "9") {
    		
    		return 	file;
    	}
    }

	var base64 = lrz(file).then(function(rst) {

        //成功时执行
        return rst.file;

    }).catch(function(error) {

        //失败时执行
        return file ;
    })

    return base64;
}

// 文件上传成功时的钩子
Vue.prototype.uploadSuccess = function (response, file, fileList){

	console.log(response)

	// var that = this;

	// this.ifTips = true;
	// this.tips_Msg = "操作成功";

	// setTimeout(function(){

	// 	that.ifTips = false;
	// 	that.toWaybill();
	// },1000)
}

// 文件上传失败时的钩子
Vue.prototype.uploadError = function (err, file, fileList){
	console.log(err)
}

// 上传图片钩子   结束

// 打电话
Vue.prototype.callPhone=function (phoneNum){
	event.stopPropagation();

	window.location.href = 'tel://'+ phoneNum ;
}


//input聚焦
Vue.prototype.getFocus=function (input){

	this.$refs[input].focus();
}

//清除输入框内容
Vue.prototype.clearInput=function (e){

	this[e] = "";
}

// 返回 我的任务 页面
Vue.prototype.toWaybill = function(){

	// 需要重新请求数据
	store.state.Waybill_needRefresh = true;

	router.push({
		name:"Waybill",
		query:{
		}
	})
}

// 返回 登录 页面
Vue.prototype.toLogin = function(){

	router.push({
		name:"Login",
		query:{
		}
	})
}

// 跳转到 搜索 页面
Vue.prototype.search = function(thisPage){

	router.push({
		name:"Search",
		query:{
			thisPage:thisPage
		}
	})
}

// 点击 选择弹框 出现
Vue.prototype.typeSelect = function(e){

	this.typeMShow = true;
}

// 选择弹框 消失
Vue.prototype.selectCancel = function(e){
	this.typeMShow = false;
}

// ———————————————————————————————————配载单操作按钮事件———————————————————————————————————————————————————————————

// 点击导航按钮
Vue.prototype.Navigation = function(idx){
	event.stopPropagation();

	var that = this;

	this.Navigate_addressList = [];

	// 装货地址列表
	var loading_addressList = that.shipmentListData[idx].issueAddrLiat;

	//送货地址
	var Delivery_addressList = [];

	that.$emit('isLoading_', true,"拼命加载中");

	var postData = {
		shipmentId: that.shipmentListData[idx].shipmentID,//配载单id
    };

	this.httpRequest("queryDeliverReceiveAddrInfo.do",postData,function(res){

		that.$emit('isLoading_',false);

		if(res.data.length){

			// Delivery_addressList = res.data;

			for(var m = 0; m < res.data.length; m++){

				Delivery_addressList[m] = {
					issueAddr1: res.data[m].receivePartyAddr1,//地址
					issuePhone: "",//电话
					issueUser: "",//联系人
				}
			}

			that.Navigate_addressList = loading_addressList.concat(Delivery_addressList);

			that.typeMShow = true;

		}else{

			 that.Navigate_addressList = loading_addressList;

			 that.typeMShow = true;
		}
	})
	

	// this.Navigate_addressList = loading_addressList;

	
}
// 选择具体要 导航的地址
Vue.prototype.Navigate_SelectComit = function(Navigate_detailAddress){

	// 选择的导航具体地址
	var  Navigate_detailAddress= Navigate_detailAddress;

	console.log(Navigate_detailAddress);

	this.typeMShow = false;

	// 安卓
	try {
		CallAndroidOrIOS.callAndroid("导航", Navigate_detailAddress);
	} 
	catch(error) {
		console.log("没有CallAndroidOrIOS.callAndroid方法")
	}
	// 苹果
	try {
		CallAndroidOrIOS("导航", Navigate_detailAddress);
	}
	catch(error) {
		console.log("没有CallAndroidOrIOS方法")
	}
}

// ——————————————————————————————————————————————————————————————————————————————————————————————

// -------------------------------------------------我的任务/历史任务页面多装货地址弹出框点击事件 结束------------------------------------------
// 多装货地址弹框出现
Vue.prototype.MultiAddress = function(index){

	event.stopPropagation();

	if(index == null){

		this.address_listData = this.shipmentListData.issueAddrLiat;

		// 当前显示的地址数组信息
		this.currentAddressInfo = this.shipmentListData.issueAddrLiat[0];

	}else{
		// 配载单idx（点击了哪一个多装货地址配载单）
		this.addressWaybill_Idx = index;

		this.address_listData = this.shipmentListData[index].issueAddrLiat;

		// 当前显示的地址数组信息
		this.currentAddressInfo = this.shipmentListData[this.addressWaybill_Idx].issueAddrLiat[0];
	}

	// 预约状态  英文转中文
	if(this.currentAddressInfo.appointLoadingStatus == "NEW"){

		this.currentAddressInfo.appointLoadingStatus = "新预约";

	}else if(this.currentAddressInfo.appointLoadingStatus == "YI"){

		this.currentAddressInfo.appointLoadingStatus = "已确定";

	}else if(this.currentAddressInfo.appointLoadingStatus == "REFUSE"){

		this.currentAddressInfo.appointLoadingStatus = "已拒绝";
	}

	$(".MultiAddress").css("display","block");

	$('.addressHead>span').eq(0).css("border-bottom-color","#5965D8").siblings().css("border-bottom-color","#eee");
}

// 关闭地址弹框
Vue.prototype.closeAddress = function(){

	event.stopPropagation();

	$(".MultiAddress").css("display","none");
}

// 在多地址弹框中 切换查看地址
Vue.prototype.address_SwitchView = function(idx,usedtemplate){
	event.stopPropagation();
	
	if(usedtemplate){

		// 当前显示的地址数组信息
		this.currentAddressInfo = this.shipmentListData.issueAddrLiat[idx];

		console.log(1)

	}else{
		// 当前显示的地址数组信息
		this.currentAddressInfo = this.shipmentListData[this.addressWaybill_Idx].issueAddrLiat[idx];

		console.log(2)

	}
	
	// 预约状态  英文转中文
	if(this.currentAddressInfo.appointLoadingStatus == "NEW"){

		this.currentAddressInfo.appointLoadingStatus = "新预约";

	}else if(this.currentAddressInfo.appointLoadingStatus == "YI"){

		this.currentAddressInfo.appointLoadingStatus = "已确定";

	}else if(this.currentAddressInfo.appointLoadingStatus == "REFUSE"){

		this.currentAddressInfo.appointLoadingStatus = "已拒绝";
	}

	$('.addressHead>span').eq(idx).css("border-bottom-color","#5965D8").siblings().css("border-bottom-color","#eee");
}

// -------------------------------------------------我的任务/历史任务页面多装货地址弹出框点击事件 结束------------------------------------------

//我的任务页面 运单状态
Vue.prototype.orderStatus = [
    {
        state: "新建",
        code: "NEW"
    },
    {
        state: "部分在途",
        code: "PARTIALLY_SHIPPED"
    },
    {
        state: "在途",
        code: "SHIPPED"
    },
    {
        state: "取消在途",
        code: "CANCLESHIPPED"
    },
    {
        state: "部分交付",
        code: "PARTIALLY_DELIVERED"
    },
    {
        state: "交付",
        code: "DELIVERED"
    },
    {
        state: "部分回单",
        code: "PARTIALLY_POD"
    },
    {
        state: "回单",
        code: "POD"
    }
]

// 拦截器
Axios.interceptors.request.use(function(config) {
	console.log(config.data);
	if (config.method == "post") {
		config.data = qs.stringify(config.data);
	}
	return config;
}, function(error) {
	return Promise.reject(error);
});

Axios.interceptors.response.use(function(response) {
	return response;
}, function(error) {
	return Promise.reject(error);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  Axios,
  store,
  $,
  components: { App },
  template: '<App/>'
})

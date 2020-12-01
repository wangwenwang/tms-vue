ww<template>
    <div class="ChargingPile">
        <header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span class="title_text">充电</span></header>
        <div class="container" id="container"></div>
  	    <div id="panel"></div>
    </div>
</template>
<script type="text/javascript">
import $ from 'jquery'
export default{
    data(){
        return{
            lng:'',              //经度
            lat:'',              //纬度
            map: '',
            city:'',
        }
    },
    destroyed() {
        window.removeEventListener("popstate", this.onBrowserBack, false)
    },
    created(){
        // 去除高德地图logo
        this.$nextTick(() => {
            $(".amap-copyright").css("visibility","hidden")
        })
    },
    mounted(){
    	window.history.pushState(null, null, document.URL)
        window.addEventListener("popstate", this.onBrowserBack, false)

        var that = this
  
        that.map = new AMap.Map('container', {
            resizeEnable: true,
        })
        // 获取当前位置
        AMap.plugin('AMap.Geolocation', function() {
            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：5s
                buttonPosition:'RB',     //定位按钮的停靠位置
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)、
                zoomToAccuracy: true,    //定位成功后是否自动调整地图视野到定位点
            })
            that.map.addControl(geolocation)
            geolocation.getCurrentPosition(function(status,result){

	            that.city = result.addressComponent.citycode;
	            that.lng = result.addressComponent.businessAreas[0].location.lng;
	            that.lat = result.addressComponent.businessAreas[0].location.lat;

	            AMap.service(["AMap.PlaceSearch"], function() {
		            //构造地点查询类
			        var placeSearch = new AMap.PlaceSearch({ 
			            type: '汽车服务', // 兴趣点类别 
			            pageSize: 5, // 单页显示结果条数
			            pageIndex: 1, // 页码
			            city: that.city, // 兴趣点城市
			            citylimit: true,  //是否强制限制在设置的城市内搜索
			            map: that.map, // 展现结果的地图实例
			            panel: "panel", // 结果列表将在此容器中进行展示。
			            autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
			        });
			        var cpoint = [that.lng, that.lat]; //中心点坐标
			        placeSearch.searchNearBy('充电站', cpoint, 100000, function(status, result) {

			        })
                    
                    //panel列表点击事件
			        AMap.event.addListener(placeSearch,"listElementClick",function(e) {
					    // 安卓
                        try { CallAndroidOrIOS.callAndroid("导航", e.data.location.lng,e.data.location.lat) } 
                        catch(error) { }
                        // 苹果
                        try { CallAndroidOrIOS("导航", e.data.address) }
                        catch(error) { }
                        try { window.webkit.messageHandlers.messageSend.postMessage({a:'导航', b:e.data.address, c_lng:e.data.location.lng, d_lat:e.data.location.lat,e_name:e.data.name}) }
                        catch(error) { }
					})
			    })
	            if(status=='complete'){
	                that.onComplete(result, that.map)
	            }else{
	                that.onError(result, that.map)
	            }
            })
        })
    },
    methods:{
        // 监听系统返回键
        onBrowserBack() {
          
            this.goPrev()
        },
        // 返回上一页
        goPrev(){
  
            this.$router.go(-1)
        },
       
        onComplete(data, map){
  
            var that = this;
            console.log("获取【当前位置】成功", data)
  
        },
        onError(data, map){
  
            console.log("获取【当前位置】失败", data)
            this.$message.error("定位失败，请打开手机GPS")
        },
    }  
}
</script>
<style lang="less" scoped>
.ChargingPile{
    width: 100%; 
    height: 100%;
    overflow: hidden;
    #panel {
        position: fixed;
        background-color: white;
        max-height: 40%;
        overflow-y: auto;
        bottom: 0;
        width: 100%;
    }
    .container{
        width: 100%; 
        height: calc(60% - 1.8rem);
        margin-top: 90/50rem;
        position: absolute;
        padding-bottom: -150px;
    }
}
</style>
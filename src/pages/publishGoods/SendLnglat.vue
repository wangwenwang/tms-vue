<template>
  <div class="ChooseAddress">
    <header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span class="title_text">位置</span><span class="submit" @click='submit()'>确定&nbsp</span></header>

    <div class="container" id="container"></div>

    <div id="pickerBox">
      <input id="pickerInput" placeholder="输入关键字选取地点" />
      <div id="poiInfo"></div>
    </div>

    <div class="titleView">
      <div class='title'>选址结果</div>
      <div class="line">
        <div class='c'>经纬度:</div>
        <div id='lnglat' class='d'></div>
      </div>
      <div class="line">
        <div class='c'>地址:</div>
        <div id='address' class='d'></div>
      </div>
<!--       <div class="line">
        <div class='c'>最近的路口:</div>
        <div id='nearestJunction' class='d'></div>
      </div>
      <div class="line">
        <div class='c'>最近的路:</div>
        <div id='nearestRoad' class='d'></div>
      </div>
      <div class="line">
        <div class='c'>最近的POI:</div>
        <div id='nearestPOI' class='d'></div>
      </div> -->
    </div>

  </div>
</template>
<script type="text/javascript">
  export default{
    data(){
      return{
        headerText:"位置", //页面标题
        TextContent:'确定', //确定位置
        IfTextShow:false,  //是否显示确定按钮
        lng:0, //经度
        lat:0, //纬度
        address:"", //地址
        whoPush:"",
        type:"", //装货还是卸货  load   unload
        index:0, // 下标 列表里第几个地址
        p_c_d:[], // ["广东省","深圳市","龙华区"]
      }
    },
    created(){
      
      if(this.$route.query.type){
        this.type = this.$route.query.type;
      }
      if(this.$route.query.index){
        this.index = this.$route.query.index;
      }
    },
    mounted(){

      var that = this

      var map = new AMap.Map('container', {
        resizeEnable: true,
      })

      // 获取当前位置
      AMap.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：5s
          buttonPosition:'RB',    //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)、
          zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
        })
        map.addControl(geolocation)
        geolocation.getCurrentPosition(function(status,result){
          if(status=='complete'){
            that.onComplete(result, map)
          }else{
            that.onError(result, map)
          }
        })
      })
    },
    methods:{
      // 返回上一页
      goPrev(){
        this.$router.go(-1);
      },
      submit(){

        // this.$store.state.StoreInfo.longitude = this.lng;//经度
        // this.$store.state.StoreInfo.latitude = this.lat;//纬度

        if(this.address == ""){
          this.$alert('未获取到地址', '提示', {
            confirmButtonText: '确定'
          })
          return;
        }
        if(this.type == "装货点"){
          this.$store.state.pg_publish.load_pointList[this.index].detail = this.address + "附近";
          this.$store.state.pg_publish.load_pointList[this.index].lng = this.lng;
          this.$store.state.pg_publish.load_pointList[this.index].lat = this.lat;
          this.$store.state.pg_publish.load_pointList[this.index].p_c_d = this.p_c_d;
        }else if(this.type == "卸货点"){
          this.$store.state.pg_publish.unload_pointList[this.index].detail = this.address + "附近";
          this.$store.state.pg_publish.unload_pointList[this.index].lng = this.lng;
          this.$store.state.pg_publish.unload_pointList[this.index].lat = this.lat;
          this.$store.state.pg_publish.unload_pointList[this.index].p_c_d = this.p_c_d;
        }

        if(this.$store.state.userInfo.userType == "owner"){
          this.$router.push({
            name:'pg_publish',
          })

        }
        if(this.$store.state.userInfo.userType == "driver"){
          this.$router.push({
            name:'MyPublish',
          })
          
        }
       
      },
      onComplete(data, map){

        var that = this;
        console.log("获取【当前位置】成功", data)
        that.loadMap(map, data.position)
      },
      onError(data, map){

        var that = this
        console.log("获取【当前位置】失败", data)
        var p = {lng:114.039706, lat:22.622864}
        that.loadMap(map, p)
      },
      loadMap(map, p){

        var that = this

        AMapUI.loadUI(['misc/PositionPicker', 'misc/PoiPicker'], function(PositionPicker, PoiPicker) {

          var positionPicker = new PositionPicker({
            mode: 'dragMap',
            map: map,
          })
          positionPicker.on('success', function(positionResult) {
            console.log(positionResult)
            that.p_c_d = [positionResult.regeocode.addressComponent.province, positionResult.regeocode.addressComponent.city, positionResult.regeocode.addressComponent.district]
            document.getElementById('lnglat').innerHTML = positionResult.position;
            document.getElementById('address').innerHTML = positionResult.address;
            // document.getElementById('nearestJunction').innerHTML = positionResult.nearestJunction;
            // document.getElementById('nearestRoad').innerHTML = positionResult.nearestRoad;
            // document.getElementById('nearestPOI').innerHTML = positionResult.nearestPOI;
            that.lng = positionResult.position.lng
            that.lat = positionResult.position.lat
            that.address = positionResult.address
            that.IfTextShow = true
          })
          positionPicker.on('fail', function(positionResult) {
            console.log(positionResult)
            document.getElementById('lnglat').innerHTML = ' '
            document.getElementById('address').innerHTML = ' '
            // document.getElementById('nearestJunction').innerHTML = ' '
            // document.getElementById('nearestRoad').innerHTML = ' '
            // document.getElementById('nearestPOI').innerHTML = ' '
            that.lng = 0
            that.lat = 0
            that.address = ""
            that.IfTextShow = false
          })
          positionPicker.start([p.lng, p.lat])

          var poiPicker = new PoiPicker({
            //city:'北京',
            input: 'pickerInput'
          })
          //初始化poiPicker
          poiPickerReady(poiPicker)
        })

        function poiPickerReady(poiPicker) {

          window.poiPicker = poiPicker;

          var marker = new AMap.Marker();

          var infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -20)
          });

          //选取了某个POI
          poiPicker.on('poiPicked', function(poiResult) {

            var source = poiResult.source,
              poi = poiResult.item,
              info = {
                source: source,
                id: poi.id,
                name: poi.name,
                location: poi.location.toString(),
                address: poi.address
            };
            marker.setMap(map);
            infoWindow.setMap(map);
            marker.setPosition(poi.location);
            infoWindow.setPosition(poi.location);
            infoWindow.open(map, marker.getPosition());
            map.setCenter(marker.getPosition());
          });

          // poiPicker.onCityReady(function() {
          //   poiPicker.suggest('美食');
          // });
        }
      },
      poiPickerReady(poiPicker){
        console.log(432)
      },
    }
  }
</script>
<style lang="less" scoped>
  .ChooseAddress{
    width: 100%; 
    height: 100%;
    .container{
      width: 100%; 
      height: 60%;
    }
    .titleView{
      font-size: 27/50rem;
    }
    .title{
      width: 100%;
      background-color: #dadada
    }
    .title_text{
      float: left;
      position: relative;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%,-50%);
      -ms-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%)
    }
    .submit{
      float: right;
      margin-right: 15/50rem;
    }
    #pickerBox {
      position: absolute;
      z-index: 9999;
      top: 50px;
      right: 30px;
      width: 300px;
    }
    
    #pickerInput {
      width: 200px;
      padding: 5px 5px;
    }
    
    #poiInfo {
      background: #fff;
    }
    .line{
        height: 50/50rem;
        margin-top: 12/50rem;
      .c{
        font-weight: 600;
        margin-left: 15/50rem;
        float: left;
      }
      .d{
        margin-left: 8/50rem;
        float: left;
      }
    }
  }

</style>
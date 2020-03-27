<template>
  <div class="SendLnglat">
    <header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span class="title_text">位置</span><span class="submit" @click='submit()'>确定&nbsp</span></header>

    <div class="container" id="container"></div>

    <div class="pickerBox">
      <input id="pickerInput" placeholder="输入关键字选取地点" />
    </div>

    <div class="resultView">
      <div class='resultTitle'>选址结果</div>
      <div class="line">
        <div class='c'>经纬度：</div>
        <div id='lnglat' class='d'></div>
      </div>
      <div class="line">
        <div class='c'>地址：</div>
        <textarea id='address' class='e' v-model='address'></textarea>
      </div>
    </div>

  </div>
</template>
<script type="text/javascript">
  import $ from 'jquery'
  export default{
    data(){
      return{
        headerText:'位置',   //页面标题
        TextContent:'确定',  //确定位置
        IfTextShow:false,   //是否显示确定按钮
        lng:0,              //经度
        lat:0,              //纬度
        address:"",         //地址
        whoPush:"",
        type:"",            //装货还是卸货  load   unload
        index:0,            //下标 列表里第几个地址
        p_c_d:[],           //["广东省","深圳市","龙华区"]
      }
    },
    created(){
      
      if(this.$route.query.type){
        this.type = this.$route.query.type;
      }
      if(this.$route.query.index){
        this.index = this.$route.query.index;
      }
      // 去除高德地图logo
      this.$nextTick(() => {
        $(".amap-copyright").css("visibility","hidden")
      })
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
          buttonPosition:'RB',     //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)、
          zoomToAccuracy: true,    //定位成功后是否自动调整地图视野到定位点
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

        this.$router.go(-1)
      },
      submit(){

        if(this.address == ""){
          this.$alert('未获取到地址', '提示', {
            confirmButtonText: '确定'
          })
          return
        }
        if(this.type == "装货点"){
          this.$store.state.pg_publish.load_pointList[this.index].detail = this.address
          this.$store.state.pg_publish.load_pointList[this.index].lng = this.lng
          this.$store.state.pg_publish.load_pointList[this.index].lat = this.lat
          this.$store.state.pg_publish.load_pointList[this.index].p_c_d = this.p_c_d
        }else if(this.type == "卸货点"){
          this.$store.state.pg_publish.unload_pointList[this.index].detail = this.address
          this.$store.state.pg_publish.unload_pointList[this.index].lng = this.lng
          this.$store.state.pg_publish.unload_pointList[this.index].lat = this.lat
          this.$store.state.pg_publish.unload_pointList[this.index].p_c_d = this.p_c_d
        }

        if(this.$store.state.userInfo.userType == "owner"){
          this.$router.push({
            name:'pg_publish',
          })

        }
        if(this.$store.state.userInfo.userType == "driver"){
          this.$router.push({
            name:'car_publish_create',
          })
          
        }
      },
      onComplete(data, map){

        var that = this;
        console.log("获取【当前位置】成功", data)
        that.loadMap(map, data.position)
      },
      onError(data, map){

        console.log("获取【当前位置】失败", data)
        this.$message.error("定位失败，请打开手机GPS")
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

            // 第一级北京
            var province = positionResult.regeocode.addressComponent.province
            if(province == "北京市"){
              province = "北京"
            }

            // 第二级北京
            var city = positionResult.regeocode.addressComponent.city
            if(province == "北京"){
              city = "北京市"
            }

            // 第三级没有区/县，取街道/镇（例如：东莞市厚街镇）
            var district_or_township = positionResult.regeocode.addressComponent.district
            if(district_or_township == ""){
              district_or_township = positionResult.regeocode.addressComponent.township
            }
             // 四级标准地址库第三级光明新区
            if(district_or_township == "光明区"){
              district_or_township = "光明新区"
            }

            that.p_c_d = [province, city, district_or_township]
            document.getElementById('lnglat').innerHTML = positionResult.position;
            document.getElementById('address').innerHTML = positionResult.address;
            that.lng = positionResult.position.lng
            that.lat = positionResult.position.lat
            that.address = positionResult.address
            that.IfTextShow = true
          })
          positionPicker.on('fail', function(positionResult) {
            console.log(positionResult)
            document.getElementById('lnglat').innerHTML = ' '
            document.getElementById('address').innerHTML = ' '
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
  .SendLnglat{
    width: 100%; 
    height: 100%;
    overflow: hidden;
    header{
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
    }
    .container{
      width: 100%; 
      height: 70%;
    }
    .pickerBox{
      position: absolute;
      z-index: 9999;
      top: 50px;
      right: 30px;
      width: 300px;
      #pickerInput {
        width: 200px;
        padding: 5px 5px;
      }
    }

    .resultView{
      height: calc(30% - 1.8rem);
      font-size: 27/50rem;
      .resultTitle{
        width: 100%;
        background-color: #dadada;
        padding: 12/50rem;
      }
      .line{
        height: 70/50rem;
        line-height: 70/50rem;
        .c{
          font-weight: bold;
          padding-left: 15/50rem;
          width: 110/50rem;
          text-align: right;
          float: left;
        }
        .d{
          width: calc(100% - 3rem);
          height: 75/50rem;
          float: left;
        }
        .e{
          width: calc(100% - 3.24rem);
          height: 75/50rem;
          float: left;
          border: 1/50rem solid #ccc;
          padding: 10/50rem;
        }
      }
    }
  }

</style>
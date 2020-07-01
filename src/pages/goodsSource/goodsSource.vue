<template>
  <div class="goodsSource">
    <header>
     <!--  <div class="news">
        <div class="xiaoxi"  @click="Xiaoxi">消息</div>
        <div class="xiaoxiSum">{{xiaoxiSum}}</div>
      </div> -->
      <div class="middleSuper">
        <div class="middle">
          <div class="aroundResources" @click="chooseAround">周边资源</div>
          <div class="chooseAddress" @click="chooseAddress">不限</div>
        </div>
      </div>
    </header>
    <div class="container">

      <div class="slectItem">
      	<div class="Msg" v-if="AddressShow">以下是为您推荐的周边货源</div>
        <div class="choose" v-if="!AddressShow">
          <div class="AddressStart">
            <el-cascader :options="optionsAddress"  :show-all-levels="false" :filterable="true"  :clearable="true" @change="startChange" v-model="AddressStart" change-on-select></el-cascader>
          </div>
          <div class="AddressEnd">
            <el-cascader :options="optionsAddress" :show-all-levels="false"  :filterable="true"  :clearable="true"   @change="endChange"  v-model="AddressEnd" change-on-select> </el-cascader>
          </div>
          <div class="Sort">
            <template>
              <el-select v-model="value" placeholder="智能排序">
                <el-option v-for="item in optionsSort" :key="item.value" :label="item.label" :value="item.value"> 
                </el-option>
              </el-select>
            </template>
          </div>
        </div>
        <div class="Screen" @click="openChoose()">筛选</div>  
      </div>
      <div class="dataContent">
        <div class="dataItem" v-for='(dataItem,index) in goodsSourcedata' :id="index"  :key='index'  @click="tosourceDetail(index)" >
          <div class="userImage">
            <img  v-if="dataItem.pictures"  class="userinfo-avatar" :src="dataItem.pictures" alt="">
            <img  v-if="!dataItem.pictures"  class="userinfo-avatar"  src="../../assets/images/defaultHead.png" alt="">
            <!-- <img  class="userinfo-avatar"  :src="dataItem.pictures ? dataItem.pictures : '{{pictures}}'"> -->
            
          </div>
          <div class="rightContent">
            <div class="one">
              <span>{{dataItem.carrierCity}} {{dataItem.carrierAddress3}} → {{dataItem.c_city}} {{dataItem.c_address3}}</span>
              <span class="publishTime">{{dataItem.publishTime}}</span>
            </div>
            <div class="two">
              <div class="left">
              <!-- <span v-if='useType'>{{useType}}  </span>
              <span v-if='conductor'>{{conductor}}  </span> -->
              <span v-if='dataItem.vehicleType'>{{dataItem.vehicleType}}&nbsp;</span>
              <span v-if='!dataItem.weight'>{{dataItem.min_weight}}~{{dataItem.max_weight}}吨&nbsp;</span>
              <span v-if='dataItem.weight'>{{dataItem.max_weight}}吨&nbsp;</span>
              <span v-if='!dataItem.volume'>{{dataItem.min_volume}}~{{dataItem.max_volume}}方&nbsp;</span>
              <span v-if='dataItem.volume'>{{dataItem.max_volume}}方&nbsp;</span>
              </div>
              <!-- <span>{{endCity}} </span><span> {{endDistrict}}</span> -->
              <div class="distance">约{{dataItem.distance}}km装货</div>
            </div>
            <div class="three">
              <div>
                <div class="left">
                  <span v-if='dataItem.cargoType'>{{dataItem.cargoType}} , </span>
                  <span v-if='dataItem.productName'>{{dataItem.productName}} , </span>
                  <span v-if='dataItem.loadingTime'>{{dataItem.loadingTime}}装货 , </span>
                  <span v-if='dataItem.loadUnloadType'>{{dataItem.loadUnloadType}} </span>
                </div>
                <div class="left">
                  <span v-if='dataItem.ownerName'>{{dataItem.ownerName}}</span>
                </div>
              </div>
              <div class="call">
                <i v-if='dataItem.ownerPhone' @click="callPhone(dataItem.ownerPhone)" class="iconfont icon-dianhua-copy"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选框 -->
      <div class="mask" v-if="visibles">
        <div class="showChoose"  @touchmove.prevent>
          <div>
            <div class="item">车型</div>
            <div class="taglist"><div class="cartag" v-for="(tag,idx) in Cartags" :key="tag.idx" @click="getcar(idx)">  {{tag.name}}{{tag.unit}}  </div></div>
          </div>
          <div>
            <div class="item">重量(吨)</div>
            <div class="taglist"><div class="weighttag" v-for="(tag,idx) in Weight" :key="tag.idx" @click="getweight(idx)">  {{tag.minWeight}} - {{tag.maxWeight}}  </div></div>
          </div>
          <div>
            <div class="item">体积(方)</div>
            <div class="taglist"><div class="volumetag" v-for="(tag,idx) in Volume" :key="tag.idx" @click="getvolume(idx)">  {{tag.minVolume}} - {{tag.maxVolume}}   </div></div>
          </div>
          <div class="button">
            <div  class="cacel"  @click="cacel_click()">重置</div>
            <div  class="submit" @click="submit_click()">确定</div>
          </div>
        </div>
      </div>

      <!-- 页面数据为空时 -->
      <div  class="NoData"  v-if="noDataShow">
        <div>
          <i  class="iconfont icon-meiyouwuliuxinxi"></i>
          <div>没有数据</div>
        </div>
      </div>
    </div>
    <FooterIndex/>
  </div>
</template>
<script type="text/javascript">
import FooterIndex from '../../components/footer.vue'
import $ from 'jquery'
  export default{
    name:"goodsSource",
    data(){
      return{
        noDataShow:false,//没有数据
        pictures:'../../assets/images/defaultHead.png',
        xiaoxiSum:'10',//新消息数量
        optionsAddress:[],//地址
        options3:[],
        value:'',
        value7:'',
        selectedOptions: [],//选择的地址
        city_master_id:'',//上一级地址id
        AddressInfo:'',//地址信息
        AddressShow:true,//地址选择栏
        optionsSort: [{
          value: '选项1',
          label: '时间排序'
        }, {
          value: '选项2',
          label: '距离排序'
        }],
        value: '',//排序选择
        AddressStart:[],//起点
        AddressEnd:[],//终点
        startProvince:'',//起点省份 
        startCity:'',//起点城市 
        startDistrict:'',//起点区 
        endProvince:'',//终点省份 
        endCity:'',//终点城市 
        endDistrict:'',//终点区 
        goods:'',//运输物品 化妆品
        goodsSourcedata:{},
        longitude:"114.046",//经度
    		latitude:"22.628571",//纬度
    		weight:false,
    		volume:false,
        whoPush:"",
        visibles: false,
        choose_car:'',
        choose_minWeight:"",
        choose_maxWeight:"",
        choose_minVolume:"",
        choose_maxVolume:"",

        Cartags: [
          { name: '4.2' ,unit: 'M'}, 
          { name: '7.6' ,unit: 'M'},
          { name: '9.6' ,unit: 'M' },
          { name: '13.5' ,unit: 'M' },
          { name: '其他' ,unit: ''}
        ],
        Weight: [
          { minWeight: '0',maxWeight: '5' },
          { minWeight: '5',maxWeight: '10' },
          { minWeight: '10',maxWeight: '15' },
          { minWeight: '15',maxWeight: '20' },
          { minWeight: '20',maxWeight: '99' }
        ],
        Volume: [
          { minVolume: '0',maxVolume: '5' },
          { minVolume: '5',maxVolume: '10' },
          { minVolume: '10',maxVolume: '15' },
          { minVolume: '15',maxVolume: '20' },
          { minVolume: '20',maxVolume: '99' }
        ]
      }
    },
    components:{
      FooterIndex,
    },
    mounted(){
  	  this.TelliOSORAndroidVueMounted("获取当前位置页面已加载");
  	  window.SetCurrAddress = this.SetCurrAddress;
  	},
    created(){
      this.nowDate = this.getNowTime().substring(0,10);

      if(this.$route.query.sourceInfo){

        this.sourceInfo = this.$route.query.sourceInfo;
      }
      if(this.$route.query.SelectType == "RuteReverse"){
        this.chooseAddress();
        this.startCity = this.sourceInfo.c_city;
        this.startDistrict = this.sourceInfo.c_address3;
        this.endCity = this.sourceInfo.carrierCity;
        this.endDistrict = this.sourceInfo.carrierAddress3;
        

        this.AddressStart = [this.sourceInfo.c_state, this.startCity, this.startDistrict];
        this.AddressEnd = [this.sourceInfo.carrierState, this.endCity, this.endDistrict];
        console.log(this.AddressStart)
        console.log(this.AddressEnd)

        this.request_list_data(this.longitude, this.latitude, this.startCity, this.startDistrict, this.endCity, this.endDistrict)

      }else{
        this.getAroundGoodsData();
      }
    },
    methods:{
      //点击消息
      Xiaoxi(){

      },
      openChoose(){
        if(this.visibles == false){
          this.visibles = true;
          this.$nextTick(() => {
            if(this.$store.state.choose_carIdx >= 0){
              this.getcar(this.$store.state.choose_carIdx)
            }
            if(this.$store.state.choose_weightIdx >= 0){

              this.getweight(this.$store.state.choose_weightIdx)
            }
            if(this.$store.state.choose_volumeIdx >= 0){
              this.getvolume(this.$store.state.choose_volumeIdx)
            }
          })
        }else if(this.visibles == true){
          this.visibles = false;
        }
      },
      getcar(idx){
        if(idx === ""){
          return
        }
        this.$store.state.choose_carIdx = idx;

        for (var i = 0 ;i <= this.Cartags.length ;  i++) {
          if(i == idx){
            if($('.cartag').eq(idx).css("color") == "rgb(0, 0, 0)"){

              $('.cartag').eq(idx).css({"background-color":"#C4CAEF", "color":"white"})
              this.choose_car = this.Cartags[idx].name;
            }else{

              $('.cartag').eq(idx).css({"background-color":"transparent", "color":"black"})
              this.$store.state.choose_carIdx = ""
              this.choose_car = "";
            }
          }else{ 
            $('.cartag').eq(i).css({"background-color":"transparent", "color":"black"})
          }
        }
      },
      getweight(idx){
        if(idx === ""){
          return
        }
        this.$store.state.choose_weightIdx = idx;

        for (var i = 0 ;i <= this.Weight.length ;  i++) {
          if(i == idx){
            if($('.weighttag').eq(idx).css("color") == "rgb(0, 0, 0)"){

              $('.weighttag').eq(idx).css({"background-color":"#C4CAEF", "color":"white"})
              this.choose_minWeight = this.Weight[idx].minWeight;
              this.choose_maxWeight = this.Weight[idx].maxWeight;
            }else{

              $('.weighttag').eq(idx).css({"background-color":"transparent", "color":"black"})
              this.$store.state.choose_weightIdx = ""
              this.choose_minWeight = "";
              this.choose_maxWeight = "";
            }
          }else{ 
            $('.weighttag').eq(i).css({"background-color":"transparent", "color":"black"})
          }
        }
      },
      getvolume(idx){
        if(idx === ""){
          return
        }
        this.$store.state.choose_volumeIdx = idx;

        for (var i = 0 ;i <= this.Volume.length ;  i++) {
          if(i == idx){
            if($('.volumetag').eq(idx).css("color") == "rgb(0, 0, 0)"){

              $('.volumetag').eq(idx).css({"background-color":"#C4CAEF", "color":"white"})
              this.choose_minVolume = this.Volume[idx].minVolume;
              this.choose_maxVolume = this.Volume[idx].maxVolume;
            }else{

              $('.volumetag').eq(idx).css({"background-color":"transparent", "color":"black"})
              this.$store.state.choose_volumeIdx = ""
              this.choose_minVolume = "";
              this.choose_maxVolume = "";
            }
          }else{ 
            $('.volumetag').eq(i).css({"background-color":"transparent", "color":"black"})
          }
        }
      },
      submit_click(){
        this.visibles = false;
        this. getGoodsData();
      },
      //重置条件查询
      cacel_click(){
        this.$store.state.choose_carIdx = "";
        this.$store.state.choose_weightIdx = "";
        this.$store.state.choose_volumeIdx = "";
        this.visibles = false;
        this. getAroundGoodsData();
      },
      //获取当前位置经纬度
      SetCurrAddress:function(address, lng, lat) {

    		if(address == "") {
    		  this.$alert(msg, '定位失败', {
        		confirmButtonText: '确定',
        		callback: action => {
        		}
    		  })
    		}else {
    		  this.longitude = lng;
    		  this.latitude = lat;
          this.getAroundGoodsData();
    		}
  	  },

      //获取起点城市、区
      startChange(value) {
        if(value.length == 1){
          this.startProvince = value[0];
          this.startCity = "";
          this.startDistrict = "";
        }else if(value.length == 2){
          this.startProvince = value[0];
          this.startCity = value[1];
          this.startDistrict = "";
        }else if(value.length ==3){
          this.startProvince = value[0];
          this.startCity = value[1];
          this.startDistrict = value[2];
        }else{
          this.startProvince = "";
          this.startCity = "";
          this.startDistrict = "";
        }
        this.getGoodsData(); 
      },
      //获取终点城市、区
      endChange(value) {
        
        if(value.length == 1){
          this.endProvince = value[0];
          this.endCity = "";
          this.endDistrict = "";
        }else if(value.length == 2){
          this.endProvince = value[0];
          this.endCity = value[1];
          this.endDistrict = "";
        }else if(value.length == 3){
          this.endProvince = value[0];
          this.endCity = value[1];
          this.endDistrict = alue[2];
        }else{
          this.endProvince = "";
          this.endCity = "";
          this.endDistrict = "";
        }
        this.getGoodsData()
      },
      getGoodsData(){

        this.request_list_data(this.longitude, this.latitude, this.startProvince, this.startCity, this.startDistrict, this.endProvince, this.endCity, this.endDistrict, this.choose_car, this.choose_minWeight, this.choose_maxWeight, this.choose_minVolume, this.choose_maxVolume)
      },
      // 请求列表数据
      request_list_data(longitude, latitude, startProvince, startCity, startDistrict, endProvince, endCity, endDistrict, vehicleType, minWeight, maxWeight, minVolume, maxVolume){

        var that = this

        var posDate = {
          "lon": longitude,                  //经度
          "lat": latitude,                   //纬度
          "carrierState": startProvince,     //起点省份
          "carrierCity": startCity,          //起点城市
          "carrierAddress3": startDistrict,  //起点区
          "c_state": endProvince,            //终点省份
          "c_city": endCity,                 //终点城市
          "c_address3": endDistrict,         //终点区
          "vehicleType": vehicleType,        //车型
          "minWeight": minWeight,            //重量
          "maxWeight": maxWeight,
          "minVolume": minVolume,            //体积
          "maxVolume": maxVolume, 
        }
        // 获取货源列表
        that.httpRequest_ygy("peripheralResourcesList.do", posDate, function(res){

          if(res.data.length){

            that.goodsSourcedata = res.data
            that.noDataShow = false

            for( var i = 0; i < res.data.length; i++){

              if(res.data[i].publishTime.substring(0,10) == that.nowDate){
                
                res.data[i].publishTime = res.data[i].publishTime.substring(11,16)
              }else{
                res.data[i].publishTime = res.data[i].publishTime.substring(5,10)
              }
              if(res.data[i].min_weight == res.data[i].max_weight){
                
                res.data[i].weight = true
              }
              if(res.data[i].min_volume == res.data[i].max_volume){

                res.data[i].volume = true
              }
              that.goodsSourcedata[i].distance = res.data[i].distance/1000
              let tempVal = parseFloat(that.goodsSourcedata[i].distance).toFixed(2)
              that.goodsSourcedata[i].distance = tempVal.substring(0, tempVal.length - 1)
            }
          }else{

            that.goodsSourcedata = []
            that.noDataShow = true
          }
        })
      },

      //周边资源
      getAroundGoodsData(){

        this.request_list_data(this.longitude, this.latitude, "", "", "", "", "", "", "", "", "", "", "")
      },

      // 跳转到 货源详情 页面
  	  tosourceDetail(index){
        var sourceInfo = this.goodsSourcedata[index];
  	  	this.$router.push({
    		  name:"sourceDetail",
    		  query:{
            sourceInfo:sourceInfo,
            whoPush:"goodsSource",
    		  }
  	  	})
  	  },

      // 根据筛选条件请求列表数据
      chooseAddress(){

        var that = this;
        var AddressData = {}
        // 获取省、市、区/县
        this.httpRequest_ygy("queryCityAll.do",AddressData,function(AddressRes){

          that.optionsAddress = AddressRes.data.json2;
          that.toAddress();
          that.AddressShow = false;
        });
      }, 

      //选择周边资源
      chooseAround(){
        this.toAround();
        this.AddressShow = true;
        this.getAroundGoodsData();
        this.startCity = "";//起点城市
        this.startDistrict  = "";//起点区
        this.endCity = "";//终点城市
        this.endDistrict  = "";//终点区
      },

      toAddress(){
        $(".chooseAddress").css({"background-color":  "#fff",'color':'#5965D8'})
        $(".aroundResources").css({"background-color":  "#5965D8",'color':'#fff'})
      },

      toAround(){
        $(".chooseAddress").css({"background-color":  "#5965D8",'color':'#fff'})
        $(".aroundResources").css({"background-color":  "#fff",'color':'#5965D8'})
      },
    },
  }
</script>
<style lang="less" scoped>
  .goodsSource{
    overflow: hidden;
    height: 100%;
    header{
      display: flex;
      justify-content: center;
      align-items: center;
      .news{
        width:90/50rem;
        line-height: 30/50rem;
        position: absolute;
        left: 20/50rem;
        display: flex;
        .xiaoxi{
          font-size: 26/50rem;
          width: 60/50rem;
          display:inline-block;
        }
        .xiaoxiSum{
          width: 30/50rem;
          line-height: 28/50rem;
          border: 1/50rem solid #fff;
          background-color: #fff;
          font-size: 22/50rem;
          border-radius: 50%;
          color: #5965D8;
          display:inline-block;
        }
      }

      .middleSuper{
        height: 100%;
        display: flex;
        align-items: center;
        text-align: center;
        .middle{
          display: flex;
          width: 280/50rem; 
          height: 46/50rem;
          border:2/50rem solid  #fff; 
          font-size: 26/50rem;
          .chooseAddress{
            display:inline-block;
            width: 50%;
            line-height: 46/50rem;
            float: left;
            border-right: 2/50rem solid  #fff;
          }
          .aroundResources{
            display:inline-block;
            width: 50%;
            line-height: 46/50rem;
            float: left;
            background-color:  #fff;
            color: #5965D8;
          }
        }
      }
    }
    .container{
      height: 100%;
      top:180/50rem;
      .slectItem{
        width: 100%;
        border-bottom: 1/50rem solid  #ddd;
        background-color: #fff;
        display: flex;
        position:absolute;
        top:90/50rem;
        .choose{
          overflow: hidden;
          display: flex;
          .AddressStart{
            // float: left;
          }
          .AddressEnd{
            // float: left;
          }
          .Sort{
            // float: left;
          }
          // float: left;
        }
        .Msg{
          flex-grow: 3;
          padding-left: 30/50rem;
          color: #999; 
          line-height: 70/50rem;
          font-size: 26/50rem;
        }
        .Screen{
          width: 100/50rem;
          line-height: 70/50rem;
          text-align: center;
        }
      }
      .dataContent{
        width: 100%;
        overflow: scroll;
        height: calc(100% - 5.8rem);
        position:absolute;
        top: 180/50rem;
        .dataItem{
          padding:15/50rem;
          margin-bottom: 15/50rem;
          border-bottom: 1/50rem solid  #ddd;
          display: flex;
          line-height: 40/50rem;
          .userImage{
            width: 80/50rem;
            .userinfo-avatar{
              width: 80/50rem;
              height: 80/50rem;
              display: block;
            }
          }
          .rightContent{
            width: 620/50rem;
            margin-left: 10/50rem;
            line-height: 40/50rem;
            
            .one{ 
              width: 540/50rem;
              font-size: 30/50rem;
              font-weight: 550;
              padding-bottom: 10/50rem;
              display: flex;
              justify-content: space-between;
              .publishTime{
                position: absolute;
                width: 100/50rem;
                font-size: 22/50rem;
                padding-top: 8/50rem;
                color: #999;
                right:10/50rem;
                text-align: center;
              }
            }
            .two{
              display: flex;
              justify-content: space-between;
              .left{
                width: 402/50rem;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
              .distance{
                font-size: 24/50rem;
                color: #999;
              }
            }
            .three{
              display: flex;
              justify-content: space-between;
              .left{
                width: 530/50rem;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
              .call{
                width: 50/50rem;
                height: 50/50rem;
                line-height: 50/50rem;
                border: 1/50rem solid #5965D8;
                color: #5965D8;
                border-radius: 50%;
                text-align: center;
                font-size: 30/50rem;
                margin-top: 15/50rem;
              }
            }
          }
        } 
      }
      .mask{
        display: flex;
        position: relative;
        top: 70/50rem;
        height: calc(100% - 1.8rem);
        z-index: 1;
        background: rgba(0, 0, 0, 0.3);
        .showChoose{
          width: calc(100% - 0.4rem);
          z-index: 120;
          position: absolute;
          top: 1/50rem;
          left: 0;
          background-color: #fff;
          padding:10/50rem;
          .item{
            padding-left: 20/50rem;
            color:#999; 
          }
          .taglist{
            display: flex;
            justify-content: space-between;
            line-height: 60/50rem;
            margin: 20/50rem 20/50rem 30/50rem 20/50rem;
            &>div{
              width: 120/50rem;
              text-align: center;
              border: 1/50rem solid #ccc;
              border-radius: 10/50rem;
            }          
          }
          .button{
            margin:60/50rem 100/50rem;
            display: flex;
            justify-content: space-between;
            .cacel,.submit{
              border:1/50rem solid #ccc;
              border-radius: 40/50rem;
              width: 200/50rem;
              line-height: 70/50rem;
              text-align: center;
              font-size: 32/50rem;
            }
            .submit{
              color: #fff;
              background-color: #409EFF;
            }
          }
        }
      }
    }
  }
</style>


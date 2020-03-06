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
            <el-cascader :options="optionsAddress" :show-all-levels="false"  :filterable="true"  :clearable="true" @change="startChange"></el-cascader> </el-cascader>
          </div>
          <div class="AddressEnd">
            <el-cascader :options="optionsAddress" :show-all-levels="false"  :filterable="true"  :clearable="true"   @change="endChange"> </el-cascader>
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
        <div class="Screen">
          <template>
            <el-select v-model="value7" placeholder="  筛选">
              <el-option-group
                v-for="group in options3"
                :key="group.label"
                :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-option-group>
            </el-select>
          </template>
        </div>  
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
              <span>{{dataItem.carrierCity}} </span><span> {{dataItem.carrierAddress3}}</span>
              <span> → </span>
              <span>{{dataItem.c_city}} </span><span> {{dataItem.c_address3}}</span>
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
              <div class="left">
              <span v-if='dataItem.cargoType'>{{dataItem.cargoType}} , </span>
              <span v-if='dataItem.productName'>{{dataItem.productName}} , </span>
              <span v-if='dataItem.loadingTime'>{{dataItem.loadingTime}}装货 , </span>

              
              <span v-if='dataItem.loadUnloadType'>{{dataItem.loadUnloadType}} </span>
              
              </div>
              <div class="call"><i v-if='dataItem.ownerPhone' @click="callPhone(dataItem.ownerPhone)" class="iconfont icon-dianhua-copy"></i></div>
            </div>
            <div class="four">
              <div class="left">
              <span v-if='dataItem.ownerName'>{{dataItem.ownerName}}</span>
              </div>
            </div>
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
        value7:'',
        selectedOptions: [],//选择的地址
        city_master_id:'',//上一级地址id
        AddressInfo:'',//地址信息
        AddressShow:true,//地址选择栏
        optionsSort: [{
          value: '选项1',
          label: '智能排序'
        }, {
          value: '选项2',
          label: '时间排序'
        }, {
          value: '选项3',
          label: '距离排序'
        }],
        value: '',//排序选择
        startCity:'',//起点城市 
        startDistrict:'',//起点区 
        endCity:'',//终点城市 
        endDistrict:'',//终点区 
        goods:'',//运输物品 化妆品
        goodsSourcedata:{},
        longitude:"114.046",//经度
    		latitude:"22.628571",//纬度
    		weight:false,
    		volume:false,
        whoPush:"",
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
      var that = this;
      var AddressData = {}
      // 获取门店信息
      that.httpRequest_ygy("queryCityAll.do",AddressData,function(AddressRes){

         that.optionsAddress = AddressRes.data.json2;
      });

      this.nowDate = this.getNowTime().substring(0,10);
      this.getAroundGoodsData();
    },
    methods:{
      //点击消息
      Xiaoxi(){

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
    		}
  	  },

      //获取起点城市、区
      startChange(value) {
        if(value.length){
          this.startCity = value[1];
          this.startDistrict = value[2];
        }else{
          this.startCity = "";
          this.startDistrict = "";
        }
        this.getGoodsData(); 
      },
      //获取终点城市、区
      endChange(value) {
        
        if(value.length){
          this.endCity = value[1];
          this.endDistrict = value[2];
        }else{
          this.endCity = "";
          this.endDistrict = "";
        }
        this.getGoodsData()
      },
      getGoodsData(){

        var that = this;
        var AddressData = {
          "lon":this.longitude,//经度
	        "lat":this.latitude,//纬度
          "carrierCity":that.startCity,//起点城市
          "carrierAddress3":that.startDistrict,//起点区
          "c_city":that.endCity,//终点城市
          "c_address3":that.endDistrict,//终点区
        }
        // 获取货源信息
        that.httpRequest_ygy("peripheralResourcesList.do",AddressData,function(goodsSourceRes){
          if(goodsSourceRes.data.length){
            that.goodsSourcedata = goodsSourceRes.data;
            that.noDataShow = false;
            for( var i=0; i<goodsSourceRes.data.length; i++){

              if(goodsSourceRes.data[i].publishTime.substring(0,10) == that.nowDate){
                
                goodsSourceRes.data[i].publishTime = goodsSourceRes.data[i].publishTime.substring(11,16);
              }else{
                goodsSourceRes.data[i].publishTime = goodsSourceRes.data[i].publishTime.substring(5,10);
              }
              if(goodsSourceRes.data[i].min_weight == goodsSourceRes.data[i].max_weight){
              	
                goodsSourceRes.data[i].weight = true;
              }
              if(goodsSourceRes.data[i].min_volume == goodsSourceRes.data[i].max_volume){

               	goodsSourceRes.data[i].volume = true;
              }
              that.goodsSourcedata[i].distance = goodsSourceRes.data[i].distance/1000;
  	    	    let tempVal = parseFloat(that.goodsSourcedata[i].distance).toFixed(2)
  	          that.goodsSourcedata[i].distance = tempVal.substring(0, tempVal.length - 1)
            }
          }else{
            that.noDataShow = true;
          }
        })
      },

      //周边资源
      getAroundGoodsData(){
        var that = this;
        var AddressData = {
           "lon":this.longitude,//经度
	         "lat":this.latitude,//纬度
	         "carrierCity": "",//起点城市
           "carrierAddress3":"",//起点区
           "c_city":"",//终点城市
           "c_address3":"",//终点区
        }
        // 获取货源列表信息
        that.httpRequest_ygy("peripheralResourcesList.do",AddressData,function(Res){
          if(Res.data.length){
            that.goodsSourcedata = Res.data;
            that.noDataShow = false;
            for( var i=0; i<Res.data.length; i++){ 

              if(Res.data[i].publishTime.substring(0,10) == that.nowDate){

                Res.data[i].publishTime = Res.data[i].publishTime.substring(11,16);
              }else{
                Res.data[i].publishTime = Res.data[i].publishTime.substring(5,10);
              }
              if(Res.data[i].min_weight == Res.data[i].max_weight){
            	
                Res.data[i].weight = true;
              }
              if(Res.data[i].min_volume == Res.data[i].max_volume){
             	
             	  Res.data[i].volume = true;
              }
              that.goodsSourcedata[i].distance = Res.data[i].distance/1000;
              let tempVal = parseFloat(that.goodsSourcedata[i].distance).toFixed(2)
              that.goodsSourcedata[i].distance = tempVal.substring(0, tempVal.length - 1)
            }
          }else{
            that.noDataShow = true;
          }
        })
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

      //选择地区
      chooseAddress(){
        this.toAddress();
        this.AddressShow = false;
        this.getGoodsData();
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
      margin-top:80/50rem;
      overflow: scroll;
      .slectItem{
        width: 100%;
        height: 80/50rem;
        border-bottom: 1/50rem solid  #ddd;
        background-color: #fff;
        display: flex;
        position:fixed;
        top:90/50rem;
        z-index: 50;
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
          // float: left; 
          flex-grow: 3;
          // width: 520/50rem;
          padding-left: 30/50rem;
          color: #999; 
          line-height: 70/50rem;
          font-size: 26/50rem;
        }
        .Screen{
          height: 70/50rem;
          // float: left;
          // position: absolute;
          // right: 0/50rem;
          // width: 100/50rem;
          // background-color: red;
        }
      }
      .dataContent{
        overflow: scroll;
        height: calc(100% - 5.8rem);
        margin-top: 90/50rem;

      }
      .dataItem{
        padding:15/50rem;
        height: 160/50rem;
        border-bottom: 1/50rem solid  #ddd;
        .userImage{
          width: 80/50rem;
          height: 150/50rem;
          float: left;
          margin-right: 10/50rem;
          .userinfo-avatar{
            width: 80/50rem;
            height: 80/50rem;
            display: block;
          }
        }
        .rightContent{
          padding-left: 80/50rem;
          .one{ 
            font-size: 30/50rem;
            font-weight: 550;
            padding-bottom: 10/50rem;
            .publishTime{
              font-size: 22/50rem;
              padding-top: 8/50rem;
              color: #999;
              float: right;
            }
          }
          .two{
            .left{
              width: 402/50rem;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              float: left;
            }
            .distance{
              font-size: 24/50rem;
              color: #999;
              float: right;
            }
          }
          .three{
            .left{
              width: 560/50rem;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              float: left;
            }
            .call{
              float: right;
              width: 50/50rem;
              height: 50/50rem;
              line-height: 50/50rem;
              border: 1/50rem solid #5965D8;
              color: #5965D8;
              border-radius: 50%;
              text-align: center;
              margin-top:15/50rem;
              font-size: 30/50rem;
            }
          }
          .four{
            .left{
              float: left;
              width: 560/50rem;
            }
          }
        }
      } 
    }
  }
</style>
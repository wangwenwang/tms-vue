
<template>
  <div class="carSourceList">
    <header>
      <!-- <span>车源列表</span> -->
      <div class="middle">
        <div class="aroundResources" @click="chooseAround">周边资源</div>
        <div class="chooseAddress" @click="chooseAddress">不限</div>
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


      <div class="dataItem" v-for='(dataItem,index) in carSourceListdata' :id="index"  :key='index'   >
        <div class="one">
          <span>{{dataItem.carrierCity}} </span><span> {{dataItem.carrierAddress3}}</span>
          <span> → </span>
          <span>{{dataItem.c_city}} </span><span> {{dataItem.c_address3}}</span>
          <span class="publishTime">{{dataItem.publishTime}}</span>
        </div>
       
        <div class="two">
          <div class="line">
	    	<div class="loadingTime" v-if='dataItem.loadingTime'> 出发日期： {{dataItem.loadingTime}}</div>
	        <div class="distance">距离约<span>{{dataItem.distance}}</span>km</div>
          </div>
          <div class="line">
	        <div class="left">
			  <span v-if='dataItem.vehicleType'>{{dataItem.vehicleType}}&nbsp;</span>
			  <span v-if='dataItem.vehicleLoad'>载重：{{dataItem.vehicleLoad}}吨&nbsp;&nbsp;</span>
			  <span v-if='dataItem.vehicleVolume'>体积：{{dataItem.vehicleVolume}}方&nbsp;</span>
	        </div>
	        <div class="call">
	          <i v-if='dataItem.driverPhone' @click="callPhone(dataItem.driverPhone)" 
	          class="iconfont icon-dianhua-copy"> </i>
	        </div>
          </div>
        </div>
      </div>
      <!-- 页面数据为空时           -->
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
  import componentOrderItem from '@/components/componentOrderItem'
  import FooterIndex from "../../components/footer"
  import $ from 'jquery'
  export default{
    name:"od_bid",
    data(){
      return{
        noDataShow:false,//没有数据
        orderState:'',//订单类型
        orderArr:[],//订单列表
        carSourceListdata:[],
        startCity:'',//起点城市 
        startDistrict:'',//起点区 
        endCity:'',//终点城市 
        endDistrict:'',//终点区 
        longitude:"114.046",//经度
    	latitude:"22.628571",//纬度
    	 optionsAddress:[],//地址
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
      }
    },
    components:{
      FooterIndex,
      componentOrderItem
    },
    created(){
      this.nowDate = this.getNowTime().substring(0,10);
       var that = this;
      var AddressData = {}
      // 获取门店信息
      that.httpRequest_ygy("queryCityAll.do",AddressData,function(AddressRes){

         that.optionsAddress = AddressRes.data.json2;
      });

      this.nowDate = this.getNowTime().substring(0,10);
      this.reqCarSourceList();
    },
    methods:{
      reqCarSourceList(){
        var that = this;
		var postData = {
	      "lon":that.longitude,//经度
	      "lat":that.latitude,//纬度
	      "carrierCity":that.startCity,//起点城市
	      "carrierAddress3":that.startDistrict,//起点区
	      "c_city":that.endCity,//终点城市
	      "c_address3":that.endDistrict,//终点区
		}
        // 获取发布车源信息
        that.httpRequest_ygy("queryVehicles.do",postData,function(PublishRes){
          that.carSourceListdata = PublishRes.data;
          if(that.carSourceListdata.length){
            that.noDataShow = false;

            for( var i=0; i<that.carSourceListdata.length; i++){

              if(that.carSourceListdata[i].publishTime.substring(0,10) == that.nowDate){
                
                that.carSourceListdata[i].publishTime = that.carSourceListdata[i].publishTime.substring(11,16);
              }else{
                that.carSourceListdata[i].publishTime = that.carSourceListdata[i].publishTime.substring(5,10);
              }
              that.carSourceListdata[i].loadingTime = that.carSourceListdata[i].loadingTime.substring(0,10);

              that.carSourceListdata[i].distance = that.carSourceListdata[i].distance/1000;
              let tempVal = parseFloat(that.carSourceListdata[i].distance).toFixed(2)
              that.carSourceListdata[i].distance = tempVal.substring(0, tempVal.length - 1)
            }
          }else{
            that.noDataShow = true;
          }
	    });
      },

      //选择地区
      chooseAddress(){
        $(".chooseAddress").css({"background-color":  "#fff",'color':'#5965D8'})
        $(".aroundResources").css({"background-color":  "#5965D8",'color':'#fff'})
        this.AddressShow = false;
        this.startCity = "";
        this.startDistrict = "";
        this.endCity = "";
        this.endDistrict = "";
        this.reqCarSourceList();
      }, 

      //选择周边资源
      chooseAround(){
        $(".chooseAddress").css({"background-color":  "#5965D8",'color':'#fff'})
        $(".aroundResources").css({"background-color":  "#fff",'color':'#5965D8'})
        this.AddressShow = true;
        this.startCity = "";
        this.startDistrict = "";
        this.endCity = "";
        this.endDistrict = "";
        this.reqCarSourceList();
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
        this.reqCarSourceList(); 
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
        this.reqCarSourceList()
      },
    }
  }
</script>
<style lang="less" scoped>
  .carSourceList{
    overflow: hidden;
    height: 100%;
    background-color: #E5E8FA;
    header{
      display: flex;
      justify-content: center;
      align-items: center;
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
    .container{
      height: 100%;
      overflow: hidden;
      .slectItem{
        width: 100%;
        height: 80/50rem;
        border-bottom: 1/50rem solid  #ddd;
        display: flex;
      	.choose{
      	  overflow: hidden;
          display: flex;
      	  .AddressStart{
      	  }
      	  .AddressEnd{
      	  }
      	  .Sort{
      	  }
      	}
      	.Msg{
          flex-grow:2;
      	  padding-left: 30/50rem;
      	  color: #999; 
      	  line-height: 80/50rem;
      	  font-size: 26/50rem;
      	  background-color: #fff;
      	}
      }
      .dataItem{
        margin: 20/50rem;
        margin-top: 50/50rem;
        padding:30/50rem 15/50rem 20/50rem 15/50rem;
        height: 180/50rem;
        background-color: #fff;
        border: 1/50rem solid  #ddd;
        border-radius: 15/50rem;
        div{ line-height: 50/50rem; }
        .one{ 
          font-size: 30/50rem;
          font-weight: 550;
          padding-bottom: 10/50rem;
          .publishTime{
            font-size: 22/50rem;
            padding-top: 3/50rem;
            color: #999;
            float: right;
          }
        }
        .line{
          display: flex;
   		  justify-content: space-between;
        }
        .distance{
          font-size: 24/50rem;
          color: #999;
          span{
          	font-size:28/50rem;
          }
        }
        .left{
          width: 602/50rem;
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
        }
      }
    }
  }
</style>
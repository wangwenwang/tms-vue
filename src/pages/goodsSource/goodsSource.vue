<template>
  <div class="goodsSource">
    <header>
      <div class="news">
        <div class="xiaoxi"  @click="Xiaoxi">消息</div>
        <div class="xiaoxiSum">{{xiaoxiSum}}</div>
      </div>
      <div class="middleSuper">
        <div class="middle">
          <div class="chooseAddress" @click="chooseAddress">不限</div>
          <div class="aroundResources" @click="chooseAround">周边资源</div>
        </div>
      </div>
    </header>
    <div class="container">
      <div>
        <div class="choose" v-if="AddressShow">
          <div class="AddressStart">
            <span class="demonstration"></span>
            <el-cascader :options="options" v-model="selectedOptions"  @change="handleChange"> </el-cascader>
          </div>
          <div class="AddressEnd">
            <span class="demonstration"></span>
            <el-cascader :options="options"  v-model="selectedOptions" @change="handleChange"> </el-cascader>
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

        <div v-if="!AddressShow">以下是为您推荐的周边货源</div>

        <div>筛选</div>
      </div>

      

      <!-- <div class="Address"></div>
      <div class="screen"></div>
 -->    </div>
    <!-- 页面数据为空时 -->
    <div  class="NoData"  v-if="noDataShow">
      <div>
        <i  class="iconfont icon-meiyouwuliuxinxi"></i>
        <div>没有数据</div>
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
        xiaoxiSum:'10',//新消息数量
        options:[],//地址
        selectedOptions: [],//选择的地址
         city_master_id:'',//上一级地址id
        AddressInfo:'',//地址信息
        AddressShow:true,//地址选择栏
        optionsSort: [{
          value: '选项1',
          label: '智能排序'
        }, {
          value: '选项2',
          label: '默认排序'
        }, {
          value: '选项3',
          label: '距离排序'
        }],
        value: '',//排序选择

      }
    },
    components:{
        FooterIndex
    },
    created(){
      console.log(111)
      var that = this;
      var AddressData = {
          "types":'PROVINCE',//地址类型(省、市区、街道)
          "city_master_id":that.AddressInfo.city_master_id,//上级地址id
          }
      // 获取门店信息
      that.httpRequest_ygy("findCityByType.do",AddressData,function(AddressRes){
            that.options = AddressRes.data;
            console.log(that.options)
      })

    },
    methods:{
      //点击消息
      Xiaoxi(){

      },
      //选择地区
      chooseAddress(){
        this.toAddress();
        this.AddressShow = true;
        // this.orderState = "";
        // this.reqOrderListInfo();
      }, 

      //选择地区
      chooseAround(){
        this.toAround();
        this.AddressShow = false;
        // this.orderState = "";
        // this.reqOrderListInfo();
      }, 
      toAddress(){
        $(".chooseAddress").css({"background-color":  "#fff",'color':'#5965D8'})
        $(".aroundResources").css({"background-color":  "#5965D8",'color':'#fff'})

      },
      toAround(){

        $(".chooseAddress").css({"background-color":  "#5965D8",'color':'#fff'})
        $(".aroundResources").css({"background-color":  "#fff",'color':'#5965D8'})

      },
      handleChange(value) {
        console.log(value);
      }
      
    },

  }
</script>
<style lang="less" scoped>
  .goodsSource{
    overflow: hidden;
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
          font-size: 24/50rem;
          width: 60/50rem;
          display:inline-block;
        }
        .xiaoxiSum{
          width: 30/50rem;
          line-height: 28/50rem;
          border: 1/50rem solid #fff;
          background-color: #fff;
          font-size: 18/50rem;
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
             background-color:  #fff;
             color: #5965D8;
          }
          .aroundResources{
            display:inline-block;
             width: 50%;
             line-height: 46/50rem;
             float: left;
             
          }
        }
      }
    }


    .choose{
      // width: 600/50rem;
      .AddressStart{
        width: 150/50rem;
        float: left;

      }
      .AddressEnd{
         width: 180/50rem;
        float: left;
      }
  }
}
</style>
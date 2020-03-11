<template>
  <div class="car_publish_list">
    <header><i class="iconfont icon-xiangzuo1"   @click="goprev"></i><span>我的发布</span></header>
    <div class="container">
      <div :class="'v-for- ' + item.add_class" v-for='(item, index) in data' :id = "index" :key = 'index'>

        <div class="one">
          <span>{{item.carrierCity}} </span><span> {{item.carrierAddress3}}</span>
          <span> → </span>
          <span>{{item.c_city}} </span><span> {{item.c_address3}}</span>
          <span class="publishTime">{{item.publishTime}}</span>
        </div>

        <div class="two">
          <div>编号： {{item.sourceNo}}</div>
          <div>
            <span v-if='item.vehicleType'>{{item.vehicleType}}&nbsp;</span>
            <span v-if='item.vehicleLoad'>载重：{{item.vehicleLoad}}吨&nbsp;&nbsp;</span>
            <span v-if='item.vehicleVolume'>体积：{{item.vehicleVolume}}方&nbsp;</span>
          </div>
          <div v-if='item.loadingTime'> 日期： {{item.loadingTime}}</div>
          <div>状态：{{ item.status }}</div>
        </div>

        <div class="three">
          <div class="del-" @click="del_(index)">删除</div>
          <div class="update-" @click="update_(index)">更新</div>
        </div>
      </div>

      <div class="kong_"></div>

      <div class="create-car-publish" @click="create_car_publish()">新建车源</div>

      <!-- 页面数据为空时 -->
      <div  class="NoData"  v-if="noDataShow">
        <div>
          <i  class="iconfont icon-meiyouwuliuxinxi"></i>
          <div>没有数据</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import $ from 'jquery'
  import componentOrderItem from '@/components/componentOrderItem'
  export default{
    name:"od_bid",
    data(){
      return{
        noDataShow:false,//没有数据
        orderArr:[],//订单列表
        data:[]
      }
    },
    components:{
      componentOrderItem
    },
    created(){

      this.request()
    },
    methods:{
      // 返回上一页
      goprev(){

        this.$router.push("HomeIndex")
      },
      request(){

        var that = this;
        // 获取自己发布的车源列表
        this.httpRequest_ygy("queryVehicleSource.do", "", function(res){

          if(res.data.length){
            that.data = res.data
            that.noDataShow = false
            for( var i = 0; i < that.data.length; i++){
              var item = that.data[i]
              item.loadingTime = item.loadingTime.substring(0,10)

              if(item.publishTime.substring(0, 10) == that.getNowTime().substring(0, 10)){
                item.status = "有效"
              }else{
                item.status = "无效"
                item.add_class = "opt"
              }
            }
          }else{
            that.noDataShow = true
          }
        })
      },
      update_(index){

        console.log(this.data)
        console.log(index)
        console.log(this.data[index].sourceNo)

        var that = this
        var postData = { "sourceNo": this.data[index].sourceNo }

        // 更新车源信息
        this.httpRequest_ygy("updateVehiclePublishTime.do", postData, function(res){

          that.$message.success("更新成功")
          that.request()
        })
      },
      del_(index){

        var that = this
        var postData = { "sourceNo": this.data[index].sourceNo }

        this.$confirm('此操作将删除该发布, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 刪除车源信息
          this.httpRequest_ygy("cancelVehicleSource.do", postData, function(res){

            that.$message.success(res.Msg)
            that.request()
          })
        }).catch(() => { })
      },
      create_car_publish(){

        this.$router.push("car_publish_create")
      }
    }
  }
</script>
<style lang="less" scoped>
  .car_publish_list{
    overflow: hidden;
    height: 100%;
    background-color: #E5E8FA;
    .container{
      height: calc(100% - 1.8rem);
      overflow: scroll;
      .opt{
        opacity: 0.5;
      }
      .v-for-{
        margin: 20/50rem;
        margin-top: 40/50rem;
        padding:30/50rem 15/50rem 50/50rem 15/50rem;
        height: 290/50rem;
        background-color: #fff;
        border: 1/50rem solid  #ddd;
        border-radius: 15/50rem;
        div{ 
          line-height: 50/50rem; 
        }
        .one{ 
          font-size: 30/50rem;
          font-weight: 550;
          padding-bottom: 10/50rem;
          height: 50/50rem;
          overflow: hidden;
          .publishTime{
            font-size: 22/50rem;
            padding-top: 3/50rem;
            color: #999;
            float: right;
          }
        }
        .two{
          height: 200/50rem;
          overflow: hidden;
          .distance{
            font-size: 24/50rem;
            color: #999;
            float: right;
          }
          border-bottom: solid 1/50rem #c7c7c7;
        }
        .three{
          height: 60/50rem;
          margin-top: 10/50rem;
          float: right;
          &>div{
            width: 150/50rem;
            height: 50/50rem;
            margin-top: 5/50rem;
            float: left;
            border-radius: 15/50rem;
            color: white;
            text-align: center;
            line-height: 50/50rem;
            font-size: 26/50rem;
          }
          .del-{
            background-color: #de3e27;
          }
          .update-{
            margin-left: 60/50rem;
            background-color: #5b87f7;

          }
        }
      }
      .kong_{
        width: 100%;
        height: 130/50rem;
      }
      .create-car-publish{
        width: (750 - 300)/50rem;
        height: 70/50rem;
        background-color: #4E6CD8;
        position: absolute;
        bottom: 35/50rem;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 40/50rem;
        line-height: 70/50rem;
        text-align: center;
        color: white;
      }
    }
  }
</style>
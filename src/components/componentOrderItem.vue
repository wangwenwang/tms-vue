<template>
  <div class="componentOrderItem">
    <div class="orderArrContent">
      <div class='orderArr' v-for='(item, idx) in orderArr'  :id="idx"  :key='idx'>
        <div class="contentInFor"  @click="tosourceDetail(idx)">

          <div class="one" >
            <span>{{item.carrierCity}} </span><span> {{item.carrierAddress3}}</span>
            <span> → </span>
            <span>{{item.c_city}} </span><span> {{item.c_address3}}</span>
            <span class="publishTime">{{item.publishTime}}</span>
          </div>

          <div class="two">
            <div class="left">
              <span v-if='item.vehicleType'>{{item.vehicleType}}&nbsp;</span>
              <span v-if='!item.weight'>{{item.min_weight}}~{{item.max_weight}}吨&nbsp;</span>
              <span v-if='item.weight'>{{item.max_weight}}吨&nbsp;</span>
              <span v-if='!item.volume'>{{item.min_volume}}~{{item.max_volume}}方&nbsp;</span>
              <span v-if='item.volume'>{{item.max_volume}}方&nbsp;</span>
            </div>
            <div class="distance" v-if='item.distanceShow'>约{{item.distance}}km装货</div>
          </div>

          <div class="three">
            <div class="left">
              <span v-if='item.cargoType'>{{item.cargoType}} , </span>
              <span v-if='item.productName'>{{item.productName}} , </span>
              <span v-if='item.loadingTime'>{{item.loadingTime}}装货 , </span>
              <span v-if='item.loadUnloadType'>{{item.loadUnloadType}} </span>
            </div>

            <div v-if='$store.state.userInfo.userType == "owner"'>
              <div class='status' v-if='!orderState' :style='{background:item.STATUS_color}'>{{item.STATUS_text}}</div>
              <div class="btnEvaluate" @click.stop="btnEvaluateClick1(idx)" v-if='orderState == "NON-RATE" && item.ownerComment == "F"'>评价</div>
              <div class="btnEvaluate" v-if='orderState == "NON-RATE" && item.ownerComment == "T"'>已评价</div>
            </div>

            <div v-if='$store.state.userInfo.userType == "driver"'>
              <div class='status' v-if='!orderState' :style='{background:item.STATUS_color}'>{{item.STATUS_text}}</div>
              <div class="btnEvaluate" @click.stop="btnEvaluateClick1(idx)" v-if='orderState == "NON-RATE" && item.driverComment == "F"'>评价</div>
              <div class="btnEvaluate" v-if='orderState == "NON-RATE" && item.driverComment == "T"'>已评价</div>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default{
  	data(){
  	  return{
        whoPush:"",
  	  }
  	},
  	props:{
      orderState:'',//订单状态
      orderArr:{
    		type:Array,
    	    default: () => {
    		  return []
    		}
  	  },
  	},
  	methods:{

      // 跳转到 货源详情 页面
      tosourceDetail(idx){
        var sourceInfo = this.orderArr[idx];
        this.$router.push({
          name:"sourceDetail",
          query:{
            sourceInfo:sourceInfo,
            whoPush:"od_bid",
            orderState:this.orderState
          }
        })
      },
      // 跳转到 发布评价 页面
      btnEvaluateClick1(idx){
        var sourceInfo = this.orderArr[idx];
        this.$router.push({
          name:"ToEvaluate",
          query:{
            sourceInfo:sourceInfo,
            whoPush:"od_bid",
            orderState:this.orderState
          }
        })
      },
  	}
  }
</script>
<style lang="less" scoped>
  .componentOrderItem{
    .orderArrContent{
      height: 100%;
      box-sizing: border-box;
      .orderArr{
        height: 130/50rem;
        padding:25/50rem 20/50rem 25/50rem 20/50rem;
        border-bottom: 1/50rem solid  #5965D8;
        .contentInFor{
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
            .status{
              float: right;
              width: 110/50rem;
              height: 50/50rem;
              line-height: 50/50rem;
              text-align: right;
              border-radius: 25/50rem  0%  0%  25/50rem ;
              color: #fff;
              padding-right: 10/50rem;

            }
             .btnEvaluate{
              width: 100/50rem;
              line-height: 50/50rem;
              color: #FD763A;
              border: 1/50rem solid #FD763A;
              border-radius: 25/50rem;
              float: right;
              text-align: center;
            }
          }
          .four{
              float: left;
              width: 560/50rem;
              line-height: 50/50rem;
          }
        }
      }
    }
  }
</style>
<template>
  <div class="componentOrderItem">
    <div class="orderArrContent">
      <div class='orderArr' v-for='(item, idx) in orderArr'  :id="idx"  :key='idx'>
        <div class="contentInFor"  @click="tosourceDetail(idx)">

          <div class="one" >
            <span class="i">装</span><span>{{item.carrierCity}} </span><span> {{item.carrierAddress3}}</span>
            <span class="publishTime">{{item.publishTime}}</span>
          </div>
          <div class="xie" >
            <span class="i">卸</span><span>{{item.c_city}} </span><span> {{item.c_address3}}</span>
            <span class="distance" v-if='item.distanceShow'>约{{item.distance}}km装货</span>
          </div>

          <div class="two">
            <div class="userImage">
              <img  v-if="item.pictures"  class="userinfo-avatar" :src="item.pictures" alt="">
              <img  v-if="!item.pictures"  class="userinfo-avatar" src="../assets/images/defaultHead.png" alt="">
            </div>
            <div>
              <div class="left">
                <span v-if='item.ownerName'>{{item.ownerName}} , </span>
                <span v-if='item.productName'>{{item.productName}} , </span>
                <span v-if='!item.weight'>{{item.min_weight}}~{{item.max_weight}}吨&nbsp;</span>
                <span v-if='item.weight'>{{item.max_weight}}吨&nbsp;</span>
                <span v-if='!item.volume'>{{item.min_volume}}~{{item.max_volume}}方&nbsp;</span> 
                <span v-if='item.volume'>{{item.max_volume}}方&nbsp;</span>
                <span v-if='item.vehicleType'>{{item.vehicleType}}&nbsp;</span>
              </div>
              <div class="left">
                <span v-if='item.cargoType'>{{item.cargoType}} , </span>
                <span v-if='item.loadingTime'>{{item.loadingTime}}装货 , </span>
                <span v-if='item.loadUnloadType'>{{item.loadUnloadType}} </span>
              </div>
            </div>
            <div class="three">
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
        // height: 230/50rem;
        padding:35/50rem 20/50rem 35/50rem 20/50rem;
        border-bottom: 1/50rem solid  #5965D8;
        .contentInFor{
          .one,.xie{ 
            .i{
              font-size: 26/50rem;
              border: 1/50rem solid  #FACE51;
              border-radius: 8/50rem;
              padding: 5/50rem;
              background-color: #FACE51;
              font-weight: 500;
              margin-right: 15/50rem;
            }
            span{
              font-size:30/50rem;
              font-weight: 550;
              line-height: 60/50rem;
            }
            .publishTime{
              font-size: 22/50rem;
              color: #999;
              float: right;
            }

          }
          .xie{
            .i{
              border: 1/50rem solid  #FD757F;
              background-color: #FD757F;
            }
            .distance{
              font-size: 24/50rem;
              color: #999;
              float: right;
              font-weight:500;
            }
          }
          .two{
            padding-top: 12/50rem;
            line-height: 50/50rem;
            display: flex;
            flex-direction:row;
            .userImage{
              width: 80/50rem;
              .userinfo-avatar{
                padding-top: 8/50rem;
                width: 80/50rem;
                height: 80/50rem;
                display: block;
              }
            }
            .left{
              margin-left: 15/50rem;
              width: 490/50rem;
            }
            .three{
              line-height: 50/50rem;
              width: 200/50rem;
              .status{
                float: right;
                width: 110/50rem;
                height: 50/50rem;
                line-height: 50/50rem;
                text-align: right;
                border-radius: 25/50rem  0%  0%  25/50rem ;
                color: #fff;
                margin-top: 30/50rem;
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
<template>
  <div class="componentOrderItem">
    <div class="orderArrContent">
      <div class='orderArr' v-for='(item, idx) in orderArr'  :id="idx"  :key='idx'  @click="tosourceDetail(idx)">
        <div class="contentInFor">

          <div class="one">
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
            <div class="distance">约{{item.distance}}km装货</div>
          </div>

          <div class="three">
            <div class="left">
              <span v-if='item.cargoType'>{{item.cargoType}} , </span>
              <span v-if='item.productName'>{{item.productName}} , </span>
              <span v-if='item.loadingTime'>{{item.loadingTime}}装货 , </span>
              <span v-if='item.loadUnloadType'>{{item.loadUnloadType}} </span>
            </div>
            <div class="call"><i v-if='item.ownerPhone' @click="callPhone(item.ownerPhone)" class="iconfont icon-dianhua-copy"></i></div>
          </div>

          <div class="four">
            <div class="left">
              <span v-if='item.ownerName'>{{item.ownerName}}</span>
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
        height: 160/50rem;
        padding:20/50rem 20/50rem 15/50rem 20/50rem;
        border-bottom: 1/50rem solid  #ddd;
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
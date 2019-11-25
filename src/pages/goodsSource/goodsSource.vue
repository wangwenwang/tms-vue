<template>
  <div class="goodsSource">
    <header>
      <div>
        <div class="xiaoxi"  @click="Xiaoxi">消息</div>
        <div class="xiaoxiSum">{{xiaoxiSum}}</div>
      </div>
      <div class="middleSuper">
        <div class="middle">
          <div class="chooseAddress">不限</div>
          <div class="aroundResources">周边资源</div>
        </div>
      </div>
    </header>
    <div class="container">
      <div>dddddddddddddddddddd</div>
      <div></div>
    </div>
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
  export default{
    name:"goodsSource",
    data(){
      return{
        noDataShow:false,//没有数据
        xiaoxiSum:'10'//新消息数量
      }
    },
    components:{
        FooterIndex
    },
  }
</script>
<style lang="less" scoped>
  .goodsSource{
    overflow: hidden;
    header{
      div{
        width: 130/50rem;
        line-height: 90/50rem;
        float: left;
        position: absolute;
        left: 12/50rem;
        &.xiaoxi{
          font-size: 24/50rem;
          width: 70/50rem;
        }
        &.xiaoxiSum{
          width: 30/50rem;
          height: 30/50rem;
          line-height: 30/50rem;
          margin-top: 30/50rem;
          border: 1/50rem solid #fff;
          background-color: #fff;
          font-size: 15/50rem;
          border-radius: 50%;
          color: #5965D8;
          left: 80/50rem;
        }
      }
      .middleSuper{
        height: 100%;
        width: 100%;
        line-height: 90/50rem;
        text-align: center;
        .middle{
          
          width: 280/50rem; 
          height: 46/50rem;
          // line-height: 46/50rem;
          // left: 260/50rem;
          // top: 25/50rem;
          border:1/50rem solid  #fff; 
          // text-align: center;
          font-size: 26/50rem;
          .chooseAddress{
            display:inline-block;
             width: 50%;
             line-height: 46/50rem;
             // float: left;
             border-right: 1/50rem solid  #fff;
          }
          .aroundResources{
            display:inline-block;
             width: 50%;
             line-height: 46/50rem;
             // float: right;
             background-color:  #fff;
             color: #000;
   
          }
        }
      }
    }
  }
</style>
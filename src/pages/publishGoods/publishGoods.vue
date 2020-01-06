<template>
  <div class="publishGoods">
    <div class="container">
      <header><span>发货中</span></header> 
      
      <div class="v-for-ccontainer">
        <div class="v-for" v-for='(item,index) in goodsList'  :id="index"  :key='index'  @click="toDetail(index)">
          <div class="v-f-content">
            <div>
              <div>{{ item.k_title }}</div>
              <div>{{ item.k_time }}</div>
            </div>
            <div>{{ item.k_detail }}</div>
          </div>
        </div>
        <div class="kong"></div>
      </div>
      <div class="publish"><div @click='pushlish'>发货</div></div>
    </div>
    <FooterIndex/>
  </div>
</template>
<script type="text/javascript">
  import FooterIndex from '../../components/footer.vue'
  export default{
    name:"publishGoods",
    data(){
      return{

        goodsList:[],
      }
    },
    components:{
      FooterIndex
    },
    created(){
      
      var that = this;

      that.httpRequest_ygy("queryOwnerInfo.do","",function(res){

        var d = res.data
        that.goodsList = d

        for(var i = 0; i < d.length; i++){

          if(d[i].carrierCity.length > 0){

            d[i].k_title = d[i].carrierCity.substring(0, d[i].carrierCity.length - 1)
          }
          if(d[i].carrierAddress3.length > 0){

            d[i].k_title += " " +  d[i].carrierAddress3
          }
          if(d[i].c_city.length > 0){

            d[i].k_title += " → " +  d[i].c_city.substring(0, d[i].c_city.length - 1)
          }
          if(d[i].c_address3.length > 0){

            d[i].k_title += " " +  d[i].c_address3
          }

          if(d[i].vehicleType.length > 0){

            d[i].k_detail = d[i].vehicleType
          }
          if(d[i].min_weight == d[i].max_weight){

            d[i].k_detail += " " + d[i].min_weight + "吨"
          }else{

            d[i].k_detail += " " + d[i].min_weight + "~" + d[i].max_weight + "吨"
          }
          if(d[i].min_volume == d[i].max_volume){

            d[i].k_detail += " " + d[i].min_volume + "方"
          }else{

            d[i].k_detail += " " + d[i].min_volume + "~" + d[i].max_volume + "方"
          }
          d[i].k_detail += "/" + d[i].productName
          if(d[i].expectedCost > 0){

            d[i].k_detail += "/￥" + d[i].expectedCost + "每趟"
          }
          d[i].k_time = that.dateFilter(d[i].publishTime)
        }
      })
    },
    methods:{
      pushlish:function(){
        this.$router.push({
          name:"pg_publish"
        })
      },
      // 进入详情页
      toDetail(index){
        var sourceInfo = this.goodsList[index];
        this.$router.push({
          name:"sourceDetail",
          query:{
            sourceInfo:sourceInfo,
            whoPush:"publishGoods",
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  .publishGoods{
    overflow: hidden;
    height: 100%;
    background-color: #E5E8FA;
    .container{
      overflow: hidden;
      height: 100%;
      .publish{
        width: 100%;
        height: 90/50rem;
        position: fixed;
        bottom: 150/50rem;
        text-align:center;
        &>div{
          width: 210/50rem;
          height: 100%;
          background-color:#5965D8;
          margin:0 auto;
          line-height: 90/50rem;
          font-size: 33/50rem;
          color: white;
          border-radius: 9/50rem;
        }
      }
      .v-for-ccontainer{
        overflow: scroll;
        height: calc(100% - 4.02rem);
        .v-f-content{
          background-color: white;
          padding:25/50rem;
          margin-top: 35/50rem;
          margin-left: 20/50rem;
          margin-right: 20/50rem;
          border-radius: 20/50rem;
          overflow:hidden;
          &>div{
            float: left;
            &:nth-child(1){
              font-size: 35/50rem;
              width: 100%;
              &>div{
                &:nth-child(1){
                  float: left;
                  font-weight: bold;
                  font-size: 30/50rem;
                }
                &:nth-child(2){
                  float: right;
                  font-size: 24/50rem;
                  line-height: 45/50rem;
                }
              }
            }
            &:nth-child(2){
              margin-top: 10/50rem;
              font-size: 27/50rem;
            }
          }
        }
        .kong{
          height: 170/50rem;
        }
      }
    }
  }
</style>
<template>
  <div class="publishGoods">
    <div class="container">
      发货中
      
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

            d[i].k_title += " -> " +  d[i].c_city.substring(0, d[i].c_city.length - 1)
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
          d[i].k_time = that.dateFilter(that.getTimestamp(d[i].publishTime))
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
      // 把时间日期转成时间戳
      getTimestamp(time) { 

        return this.getTime(time) / 1000
      },
      getTime(time){
        var myDate = new Date(time);
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;   //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if(isiOS){
          var t = new Date(time.replace(/-/g,'/')).getTime();
        }else{
          var t = myDate.getTime();
        }
        return t;    
      },
      dateFilter(val) {
        let oldTime = parseInt(val)
        let nowTime = parseInt(new Date().getTime() / 1000) // 获取当前时间戳
        let nowDate = new Date(nowTime * 1000) // 当前日期对象
        let oldDate = new Date(oldTime * 1000) // 参数日期对象

        let Y = oldDate.getFullYear()
        let m = oldDate.getMonth() + 1
        let d = oldDate.getDate()
        let H = oldDate.getHours()
        let i = oldDate.getMinutes()
        function zeroize(num) {
          return (String(num).length === 1 ? '0' : '') + num;
        }
        let timeDiff = nowTime - oldTime // 相差秒数
        if (timeDiff < 60) {
          return '刚刚'
        } else if (timeDiff < 3600) { // 一小时前之内
          return Math.floor(timeDiff / 60) + '分钟前';
        } else if (nowDate.getFullYear() === Y && nowDate.getMonth() + 1 === m && nowDate.getDate() === d) {
          return '今天' + zeroize(H) + ':' + zeroize(i);
        } else {
          let newDate = new Date((nowTime - 86400) * 1000); // 当前时间减一天（昨天）
          if (newDate.getFullYear() === Y && newDate.getMonth() + 1 === m && newDate.getDate() === d) {
            return '昨天' + zeroize(H) + ':' + zeroize(i);
          } else if (nowDate.getFullYear() === Y) {
            return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
          } else {
            return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
          }
        }
      },
    }
  }
</script>
<style lang="less" scoped>
  .publishGoods{
    overflow: hidden;
    height: 100%;
    background-color: #eee;
    .container{
      overflow: hidden;
      height: 100%;
      .publish{
        width: 100%;
        height: 90/50rem;
        position: fixed;
        bottom: 180/50rem;
        text-align:center;
        &>div{
          width: 210/50rem;
          height: 100%;
          background-color: blue;
          margin:0 auto;
          line-height: 90/50rem;
          font-size: 33/50rem;
          color: white;
          border-radius: 9/50rem;
        }
      }
      .v-for-ccontainer{
        overflow: scroll;
        height: calc(100% - 5rem);
        .v-f-content{
          background-color: white;
          padding:25/50rem;
          margin-top: 15/50rem;
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
                  font-size: 35/50rem;
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
      }
    }
  }
</style>
<template>
  <div class="publishGoods">
    <div class="container">
      <header><span>发货中</span></header> 
      
      <div class="v-for-ccontainer">
        <div class="v-for" v-for='(item,index) in goodsList'  :id="index"  :key='index'  @click="toDetail(index)"
        @touchstart="touchin(index)"  @touchend="cleartime(index)" 
        ><!--  -->
          <div class="v-f-content">
            <div>
              <div>{{ item.k_title }}</div>
              <div>{{ item.k_time }}</div>
            </div>
            <div>
              <div>{{ item.k_detail }}</div>
              <!-- <div><i v-if="item.ifEdit" class="iconfont icon-edit"  @click.stop="toEdit(index)"></i></div> -->
              <!-- <div  v-if="item.ifCancel" @click.stop="toCancel(index)">取消</div> -->
            </div>
          </div>
        </div>
        <div class="kong"></div>
      </div>
      <div class="publish"><div @click='pushlish'>发货</div></div>
    </div>
    <FooterIndex/>
    <div v-if="ifTips" class="msg_tips">
      <div class="tips_content">
        <i class="iconfont icon-chenggong1"></i>
        <p>{{tips_Msg}}</p>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import Vue from 'vue'
  import { DatePicker,Upload,Loading,Notification,MessageBox } from 'element-ui';
  import FooterIndex from '../../components/footer.vue'
  Vue.prototype.$confirm = MessageBox.confirm
  export default{
    name:"publishGoods",
    data(){
      return{

        goodsList:[],
        tips_Msg:"",//提示信息
        ifTips:false,
        // ifEdit:false,
        ifCancel:false,
      }
    },
    components:{
      FooterIndex
    },
    created(){

      this.getpublishGoods();
      
    },
    methods:{
      pushlish:function(){
        this.$router.push({
          name:"pg_publish"
        })
      },

      //获取货源列表
      getpublishGoods(){
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
            d[i].distance = d[i].distance / 1000

            if(d[i].status == "NEW"){
              d[i].ifEdit = true;

            }
            if(d[i].status == "NEW" || d[i].status =="NON-CONFIRM" || d[i].status =="NON-DELIVERY"){
              d[i].ifCancel = true;

            }
          }
        })
        this.ifTips = false;
      },

      // 进入详情页
      toDetail(index){
        // var sourceInfo = this.goodsList[index];
        this.$store.state.sourceInfo = this.goodsList[index];
        this.$router.push({
          name:"sourceDetail",
          query:{
            // sourceInfo:sourceInfo,
            whoPush:"publishGoods",
          }
        })
      },

      //修改货源
      toEdit(index){
        return
        var sourceInfo = this.goodsList[index];
        this.$router.push({
          name:"sourceDetail",
          query:{
            sourceInfo:sourceInfo,
            whoPush:"publishGoods",
          }
        })
      },

      //取消订单
      
      toCancel(index){
        var sourceInfo = this.goodsList[index];
        this.$router.push({
          name:"sourceDetail",
          query:{
            sourceInfo:sourceInfo,
            whoPush:"publishGoods",
          }
        })
      },

      // 长按删除货源
      touchin(index) {
        clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
        this.Loop = setTimeout(function() {
          MessageBox.confirm("是否取消该货源？").then(() => {
            console.log(this.goodsList[index].productName)
            console.log(this.goodsList[index].status)
            if(this.goodsList[index].status =="NEW" || this.goodsList[index].status =="NON-CONFIRM" || this.goodsList[index].status =="NON-DELIVERY"){
              var that = this;
              var postData = {
                "sourceNo":that.goodsList[index].sourceNo,
                "status":that.goodsList[index].status,
              } 
              that.httpRequest_ygy("cancelOrder.do",postData,function(Res){
                if(Res.status == "1"){
                  that.ifTips = true;
                  that.tips_Msg = "操作成功";
                  setTimeout(function(){
                    that.getpublishGoods();
                  },2000)
                }  
              });
            }else{
              this.$alert("该货源不可取消！", '提示', {
                confirmButtonText: '确定',
                callback: action => {
                }
              })
            } 
          }).catch(() => {

          });
        }.bind(this), 1000);
      },
      cleartime(index) {
        // 这个方法主要是用来将每次手指移出之后将计时器清零
        clearInterval(this.Loop);
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
              width: 100%;
             &>div{
                &:nth-child(1){
                  float: left;
                  font-size: 27/50rem;
                }
                &:nth-child(2){
                  float: right;
                  margin-right: 15/50rem;
                  color:#999;
                  border:1/50rem solid #999;
                  font-size: 24/50rem;
                  padding:5/50rem 10/50rem;
                  border-radius: 10/50rem;
                }
              }

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
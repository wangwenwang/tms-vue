<template>
  <div>
    <footer>
      <div  :class="{active : active == dataItem.title}"   v-for='(dataItem,index) in footList'  :id="index"  :key='index' @click="toggle(index)" >
        <i class="iconfont" :class="dataItem.icon" ></i>
        <p>{{dataItem.title}}</p>
      </div>
    </footer>
  </div>

</template>

<script>

export default {
    name:"FooterIndex",
    data(){
      return{
        footList:[],
        active: '首页',
      }
    },
    created(){

        var userType = this.$store.state.userInfo.userType;

        if(userType == "driver"){

          this.footList = [
            {
              path: "Index",
              title: "首页",
              icon: "icon-shouye-blue"
            },
            {
              path: "Waybill",
              title: "任务",
              icon: "icon-woderenwu"
            },
            {
              path: "goodsSource",
              title: "货源",
              icon: "icon-baobiao"
            },
            {
              path: "HomeIndex",
              title: "我的",
              icon: "icon-gerenzhongxin"
            },
          ]
        }else if(userType == "owner"){

          this.footList = [ 
            {
              path: "publishGoods",
              title: "发货",
              icon: "icon-shouye-blue"
            },
            {
              path: "od_bid",
              title: "订单",
              icon: "icon-woderenwu"
            },
            {
              path: "carSourceList",
              title: "车源",
              icon: "icon-cheb"
            },
            {
              path: "HomeIndex",
              title: "我的",
              icon: "icon-gerenzhongxin"
            },
          ]
        }
        // 车货匹配未做完时，不影响老版本用户
        else{

          this.footList = [
            {
              path: "Index",
              title: "首页",
              icon: "icon-shouye-blue"
            },
            {
              path: "Waybill",
              title: "任务",
              icon: "icon-woderenwu"
            },
            {
              path: "ReportForms",
              title: "报表",
              icon: "icon-baobiao"
            },
            {
              path: "HomeIndex",
              title: "我的",
              icon: "icon-gerenzhongxin"
            },
          ]
        }

        for(var i = 0;i < this.footList.length; i++){

          if(this.$route.name =="historyList"){

             this.active = "任务"
             return;
          }

          if(this.$route.name == this.footList[i].path){

            this.active = this.footList[i].title;
            return;
          }
        }

        if(this.$route.query.active){

          this.active = this.$route.query.active;
        }
      
    },
    methods:{
      toggle(index){
        
        //不需要重新请求数据
        this.$store.state.Waybill_needRefresh = false;

        this.active =  this.footList[index].title;

        this.$router.push({
          name:this.footList[index].path,
          query:{
            active:this.footList[index].title
          }
        })
      }
    }
}
</script>

<style lang="less" scoped>

//页脚样式 开始

footer{
    position:fixed;
    z-index:999;
    background:#F8F8F8;
    bottom:0;
    left:0;
    height:111/50rem;
    width:100%;
    display:flex;
    div{
        color: #444;
        flex-grow:1;
        float:left;
        text-align:center;
        p{
            color:#A0A0A0;
            font-size:25/50rem;
            margin-bottom:10/50rem;
        }
        i{
            font-size: 45/50rem;
            
        }
        &:nth-child(1){
          i{
            font-size: 40/50rem;
          }
        }
        &:nth-child(3){
          i{
            font-size: 40/50rem;
          }
        }
      }
    div.active{
        color: #5965D8;
        p{
            color: #5965D8;
        }
    }
}
//页脚样式 结束
</style>
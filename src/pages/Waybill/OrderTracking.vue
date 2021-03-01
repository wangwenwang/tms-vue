<template>
    <div class="OrderTracking">
        <header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span class="title_text">订单追踪</span></header>
        <div class="container" id="container"></div>
        <div class="block">
            <el-timeline>
                <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                    :icon="activity.icon"
                    :type="activity.type"
                    :color="activity.color"
                    :size="activity.size"
                    :timestamp="activity.timestamp">
                    {{activity.content}}
                </el-timeline-item>
            </el-timeline>
        </div>  


       <!--  <div class='time-line'>
            <div v-for='item in testList' class='time-line-div'>
                <p>{{item.time}}</p>
                <p ref='circular'></p>
                <p>{{item.text}}</p>
            </div>
            <div class='img-dotted' ref='dotted'></div>
        </div> -->


	    <!-- <div id="steps" style="height: 200px; border-top: 10px;">
            <el-steps :active="1" direction="<vertical></vertical>" style="height: 300px;">
                <span>11-18</span><el-step title="步骤 1" icon="el-icon-edit"></el-step>
                <el-step title="" icon="el-icon-upload" description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title="步骤 3" icon="el-icon-picture"></el-step>
            </el-steps> 
		   
			<el-steps direction="vertical" :active="1">
			    <el-step title="步骤 1"></el-step>
			    <el-step title="步骤 2"></el-step>
			    <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></el-step>
			  </el-steps>
        </div> -->
    </div>
</template>
<script type="text/javascript" >
import $ from 'jquery'
export default{
    data(){
        return{
            lng:'',              //经度
            lat:'',              //纬度
            map: '',
            city:'',
            shipmentID:'',
            testList:[
                {time:'2020-12-21 10:30:50',text:'第一步'},
                {time:'2020-12-22 10:30:50',text:'第二步'},
                {time:'2020-12-24 10:30:50',text:'第三步'}],

            activities: [{
                content: '支持使用图标',
                timestamp: '2018-04-12 20:46',
                size: 'large',
                type: 'primary',
                icon: 'el-icon-check',
              }, {
                content: '支持自定义颜色',
                timestamp: '2018-04-03 20:46',
                color: '#0bbd87'
              }, {
                content: '支持自定义尺寸',  
                timestamp: '2018-04-03 20:46',
                size: 'large'
              }, {
                content: '默认样式的节点',
                timestamp: '2018-04-03 20:46'
              }],
        }
    },
    destroyed() {
        window.removeEventListener("popstate", this.onBrowserBack, false)
    },
    created(){
        if(this.$route.query.shipmentID){

            this.shipmentID = this.$route.query.shipmentID;
        } 

        // 去除高德地图logo
        this.$nextTick(() => {
            $(".amap-copyright").css("visibility","hidden")
        })
    },
    mounted(){
    	window.history.pushState(null, null, document.URL)
        window.addEventListener("popstate", this.onBrowserBack, false)
        // this.$refs.dotted.style.left = this.$refs.circular[0].offsetLeft - 12 + 'px'

        //基本地图加载
        var map = new AMap.Map("container", {
            resizeEnable: true,
            center: [116.397428, 39.90923],//地图中心点
            zoom: 13 //地图显示的缩放级别
        });

        new AMap.TruckDriving({
            map:map,
            city:'0755',
            size:2
        }).search([{lnglat:[114.039706,22.622864]},{lnglat:[114.060711,22.566189]},{lnglat:[114.064089,22.54149]},{lnglat:[114.08766,22.53428]}],function(status,data){
        console.log(data);
        });
    },
    methods:{
        // 监听系统返回键
        onBrowserBack() {
          
            this.goPrev()
        },
        // 返回上一页
        goPrev(){
  
            this.$router.go(-1)
        },
    }
}
</script>
<style lang="less" scoped>
.OrderTracking{
    width: 100%; 
    height: 100%;
   
    overflow: scroll;

    #panel {
        position: absolute;
        background-color: white;
        max-height: 90%;
        overflow-y: auto;less
        top: 200/50rem;
        width: 100%;
    }
    .container{
        width: 100%; 
        height: 64%;
    }
    .block{
        height: 400/50rem;
        // background-color:pink;
        padding: 50/50rem 20/50rem;

    }


}
</style>
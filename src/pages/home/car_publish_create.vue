<template>
  <div class="car_publish_create">
    <header><i class="iconfont icon-xiangzuo1"  @click="goPrev" ></i><span>发布车源</span></header>
    <div class="container">
      <div class="inv_goods">
        <div class='infoContainer'>
          <div class="y_address">
            <div class="start">
              <div class="leftContent"><span class="i">起</span></div>
              <div class="Address" >
                <el-cascader :options="optionsAddress"  :filterable="true"  :clearable="true" 
                v-model="AddressStart[0].p_c_d"  @change="startChange"></el-cascader> </el-cascader>
              </div>

              <div class="AddressDetail" @click='load_address_detail'>
                <span v-if='AddressStart[0].detail'>{{ AddressStart[0].detail }}</span>
                <span v-if='!AddressStart[0].detail' class="prompt_color">请输入详情地址</span>
              </div>
            </div>
            <div class="end">
              <div class="leftContent"><span class="ii">终</span></div> 
              <div class="Address" >
                <el-cascader :options="optionsAddress"  :filterable="true"  :clearable="true"  
                v-model="AddressEnd[0].p_c_d"   @change="endChange"> </el-cascader>
              </div>
              <div class="AddressDetail" @click='unload_address_detail'>
                <span v-if='AddressEnd[0].detail'>{{ AddressEnd[0].detail }}</span>
                <span v-if='!AddressEnd[0].detail' class="prompt_color">请输入详情地址</span>
              </div>
              
            </div>
          </div>
        </div>
        <div class='infoContainer'>
          <div class="y_goods">

            <div>
              <div><span>车型车长</span></div>
              <div @click='vehicle_type_click'><span>{{ vehicle_type }}</span></div>
            </div>
            
            <div>
              <div><span>运载重量</span></div>
              <div><span>{{ vehicleLoad }}吨</span></div>
            </div>
            
            <div>
              <div><span>运载体积</span></div>
              <div><span>{{ vehicleVolume }}方</span></div>
            </div>

          </div>
        </div>

        <div class='infoContainer'>
          <div class="y_goods">

            <div class="loadTime">
              <div><span>出发日期</span></div>
              <div>
                <el-date-picker size="small" id="datetime"  :editable='false' v-model="load_time"   type="datetime"  placeholder="选择日期时间"></el-date-picker>
              </div>
            </div>

<!--             <div class="endTime">
              <div><span>结束日期</span></div>
              <div>
                <el-date-picker
                  v-model="end_time" :editable='false' 
                  type="date"
                  placeholder="选择日期时间"
                  align="right"
                  :picker-options="pickerOptions"
                  format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
            </div> -->

            <div>
              <div><span>备注</span></div>
              <div><input  v-on:input="input_change('remark')"  placeholder='选填' v-model='remark'></input></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="BtnComponent bottomBtn">
      <div @click='submit' class="onlyBtn">发  布</div>
    </div>
    <componentSelectBox v-if="SelectBoxFlag" v-bind:SelectBoxList='SelectBoxList' @selectedItem='selectedItem' :BouncedName="BouncedName" @selectCancel="selectCancel"></componentSelectBox>
    <div v-if="ifTips" class="msg_tips">
      <div class="tips_content">
        <i class="iconfont icon-chenggong1"></i>
        <p>{{tips_Msg}}</p>
    </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import componentSelectBox from '@/components/componentSelectBox'
  export default{
    name:"car_publish_create",
    data(){
      return{
        AddressStart:[],//起点
        AddressEnd:[],//终点
        optionsAddress:[],//地址
        vehicleLoad:'',
        vehicleVolume:'',
        vehicle_type:"",//车型
        SelectBoxFlag:false,//弹出选择框是否显示
        SelectBoxList:[],//弹出框选择数据列表
        BouncedName:"车型",
        load_time:"",//出发时间
        end_time:"",//结束时间
        remark:"",//备注
        tips_Msg:"",//提示信息
        ifTips:false,
        typeOfCarList: [],
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '后天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
              picker.$emit('pick', date);
            }
          }]
        },
      }
    },
    components:{
      componentSelectBox,
    },
    created(){

      var that = this

      that.httpRequest_ygy("queryCityAll.do","",function(AddressRes){

        that.optionsAddress = AddressRes.data.json2;
      })

      // 初始化
      this.AddressStart  = [{"p_c_d":[],"detail":"","lng":0,"lat":0}]
      this.AddressEnd = [{"p_c_d":[],"detail":"","lng":0,"lat":0}]
      // 赋值
      if(this.$store.state.pg_publish.load_pointList.length){
        this.AddressStart = this.$store.state.pg_publish.load_pointList
      }
      if(this.$store.state.pg_publish.unload_pointList.length){
        this.AddressEnd = this.$store.state.pg_publish.unload_pointList
      }
      if(this.$store.state.pg_publish.car_info.load_time.length){
        this.load_time = this.$store.state.pg_publish.car_info.load_time
      }else{
        this.load_time = this.formatDate(new Date)
      }
      if(this.$store.state.pg_publish.car_info.remark.length){
        this.remark = this.$store.state.pg_publish.car_info.remark
      }
      this.end_time = this.formatDate(new Date)

      this.get_vehicle_type()
    },
    methods:{

      // 获取当前车型
      get_vehicle_type(){

        var that = this
        var userInfo = this.$store.state.userInfo

        this.vehicleType_code = userInfo.vehicleType
        this.vehicleLoad = userInfo.maxLoadWeight
        this.vehicleVolume = userInfo.maxLoadVolumn

        if(this.$store.state.typeOfCarList.length){
          this.typeOfCarList = this.$store.state.typeOfCarList
          for(var i = 0; i < this.typeOfCarList.length; i++){
            if(this.typeOfCarList[i].code == this.vehicleType_code){
              this.vehicle_type = this.typeOfCarList[i].description
            }
          }
        }else{
          var requestData = { listName: "TMS-客户指定车型" }
          this.httpRequest("queryCodeLukupData.do", requestData, function(res){
            if(res.data.length > 0){
              that.typeOfCarList = res.data;
              that.$store.state.typeOfCarList = res.data;
              for(var i = 0; i < that.typeOfCarList.length; i++){
                if(that.typeOfCarList[i].code == that.vehicleType_code){
                  that.vehicle_type = that.typeOfCarList[i].description
                }
              }
            }else{
              that.httpRequest_ygy("queryVehicleModel.do", "", function(rest){
                for(var i = 0; i < rest.data.length; i++){
                  rest.data[i].name = rest.data[i].vehicleType
                }
                that.SelectBoxList = rest.data
              })
            }
          })
        }
      },
      // 记住用户输入，存到vuex；数字精确2位小数
      input_change(v){
        
        this.$store.state.pg_publish.car_info[v] = this[v]
      },
      // data 转 2019-01-01
      formatDate(date) {  
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? ('0' + m) : m
        var d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        return y + '-' + m + '-' + d
      },
      // 选中某个车型
      selectedItem(index){
        this.vehicle_type = this.SelectBoxList[index].name
        this.$store.state.pg_publish.car_info.vehicle_type = this.vehicle_type
        this.SelectBoxFlag = false
      },
      // 取消按钮 弹出选择框
      selectCancel(){
        this.SelectBoxFlag = false
      },
      // 返回上一页
      goPrev(){
        this.$store.state.pg_publish = {
          load_pointList:[],
          unload_pointList:[],
          car_info:{vehicleLoad:"",vehicleVolume:"",vehicle_type:"",load_time:"",end_time:"",remark:""},
        }
        this.$router.push("car_publish_list")
      },
      //获取起点城市、区
      startChange(value) {
        this.AddressStart[0].p_c_d = value
      },
      //获取终点城市、区
      endChange(value) {
        this.AddressEnd[0].p_c_d = value
      },
      
      load_address_detail(){
        this.$store.state.pg_publish.load_pointList = this.AddressStart
        this.$store.state.pg_publish.car_info.load_time = this.load_time
        this.$store.state.pg_publish.car_info.end_time = this.end_time
        this.$router.push({
          name:"SendLnglat",
          query:{
            type:"装货点",
            index:0,
          }
        })
      },
      unload_address_detail(){
        this.$store.state.pg_publish.unload_pointList = this.AddressEnd
        this.$store.state.pg_publish.car_info.load_time = this.load_time
        this.$store.state.pg_publish.car_info.end_time = this.end_time
        this.$router.push({
          name:"SendLnglat",
          query:{
            type:"卸货点",
            index:0,
          }
        })
      },
      vehicle_type_click(){
        this.SelectBoxFlag = true;

      },
      submit(){
        var that = this;

        if(this.AddressStart[0].p_c_d.length == 0 || this.AddressStart[0].detail.length == 0){
          that.$alert('请输入起点地址', '提示', {
            confirmButtonText: '确定'
          })
          return
        }
        if(this.AddressEnd[0].p_c_d.length == 0 || this.AddressEnd[0].detail.length == 0){
          that.$alert('请输入终点地址', '提示', {
            confirmButtonText: '确定'
          })
          return
        }
        if(this.vehicleLoad == 0){
          that.$alert('请填写重量', '提示', {
            confirmButtonText: '确定'
          })
          return
        }
        if(this.vehicleVolume == 0){
          that.$alert('请填写体积', '提示', {
            confirmButtonText: '确定'
          })
          return
        }
        if(this.vehicle_type == 0){
          that.$alert('请选择车型车长', '提示', {
            confirmButtonText: '确定'
          })
          return
        }
        if(this.load_time == 0){
          that.$alert('请选择出发日期', '提示', {
            confirmButtonText: '确定'
          })
          return
        }
        if(this.end_time == 0){
          that.$alert('请选择结束日期', '提示', {
            confirmButtonText: '确定'
          })
          return
        }



        // 装货点
        var LoadingPoint = []
        for(var i = 0; i < this.AddressStart.length; i++){
          var item = this.AddressStart[i]
          var load = {"l_province":item.p_c_d[0],"l_city":item.p_c_d[1],"l_district":item.p_c_d[2],"l_subdistrict":"","l_detail":item.detail,"l_lng":item.lng,"l_lat":item.lat}
          LoadingPoint.push(load)
        }

        // 卸载点
        var UnloadPoint = []
        for(var i = 0; i < this.AddressEnd.length; i++){
          var item = this.AddressEnd[i]
          var load = {"u_province":item.p_c_d[0],"u_city":item.p_c_d[1],"u_district":item.p_c_d[2],"u_subdistrict":"","u_detail":item.detail,"u_lng":item.lng,"u_lat":item.lat}
           UnloadPoint.push(load)
        }

        // 货品
        var CargoInfo = {}
        if(LoadingPoint.length == 0 || UnloadPoint.length == 0){
          that.$alert('请输入卸货地址', '提示', {
            confirmButtonText: '确定'
          })
        }

        var postData = {
          driverName : that.$store.state.userInfo.userName,//货主名称
          driverPhone : that.$store.state.userInfo.cellphone,//货主电话
          endTime : that.end_time + " 23:59:59",//截止时间
          loadingTime : that.load_time,
          vehicleType : that.vehicle_type,//车型
          mark : that.remark,//备注
          LoadingPoint : LoadingPoint,//装货点
          UnloadPoint : UnloadPoint,//装货点
          vehicleLoad:that.vehicleLoad,//运载重量
          vehicleVolume:that.vehicleVolume,//运载体积
        }

        this.httpRequest_ygy("addVehicle.do",postData,function(res){

          that.ifTips = true;
          that.tips_Msg = "操作成功";
          setTimeout(function(){
            that.$router.push({
              name:"car_publish_list",
            })
          },2000)
          that.$store.state.pg_publish = {
            load_pointList:[],
            unload_pointList:[],
            car_info:{vehicleLoad:"",vehicleVolume:"",vehicle_type:"",load_time:"",end_time:"",remark:""},
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  .car_publish_create{
    overflow: hidden;
    background-color: #E5E8FA;
    .container{
      height: 100%;
      padding-bottom: 120/50rem;
      overflow: hidden;
      .inv_goods{
        .infoContainer{
          margin: 20/50rem;
          padding: 15/50rem 15/50rem;
          border-radius: 15/50rem;
          box-sizing: border-box;
          background-color: #fff;
          margin-bottom: 20/50rem;
          margin-top: 70/50rem;
          .y_address{
            overflow: hidden;
            .start,.end{ 
              height: 200/50rem;
              .leftContent{
                width: 80/50rem;
                height: 160/50rem;
                float :left;
                text-align: center;
                top:50/50rem;
                .i{
                  width: 60/50rem;
                  line-height: 80/50rem;
                  font-size: 30/50rem;
                  border: 1/50rem solid  #FACE51;
                  border-radius: 20%;
                  padding: 10/50rem;
                  background-color: #FACE51;
                }
                .ii{
                  width: 60/50rem;
                  line-height: 80/50rem;
                  font-size: 30/50rem;
                  border: 1/50rem solid  #FD757F;
                  border-radius: 20%;
                  padding: 10/50rem;
                  background-color: #FD757F;
                }
              }
              .Address,.AddressDetail{
                float: left;
                width: 600/50rem;
                line-height: 80/50rem;
                .prompt_color{
                  padding-left: 20/50rem;
                  color: #a7a7a7;
                }
              }
            }
          }
          .y_goods{
            overflow: hidden;
            border-bottom:1.5/50rem solid #eee;
            width: 100%;
            &>div{
              width: 100%;
              height: 80/50rem;
              &>div{
                line-height: 80/50rem;
                &:nth-child(1){
                  float: left;
                  width: 22%;
                  text-align: right;
                }
                &:nth-child(2){
                  float: left;
                  width: 78%;
                  border-bottom:1.5/50rem solid #eee;
                  .two_input_width{
                    width: 140/50rem;
                  }
                }
                &>span{
                  padding: 15/50rem;
                }
              }
              .prompt_color{
                color: #a7a7a7;
              }
            }
          }
        }
        span{
          color: #000;
        }
      }
    }
  }
</style>
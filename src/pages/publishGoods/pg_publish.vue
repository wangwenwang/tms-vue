<template>
  <div class="pg_publish">
    <header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>发布货源</span></header>
    <div class="container">
      <div class="inv_goods">
        <div class='infoContainer'>
          <div class="y_address">

            <div class="load_unload_v_for" v-for='(item, idx) in addressList.s'  :id="idx"  :key="'v-for-one-'+idx">
              <div class="load_unload_icon">
                <div>{{ item.icon }}</div>
              </div>
              <div class="oneTwo" @click='load_address_detail(idx)'>
                <div class="AddressStart" @click='load_ads_record(idx)'>
                  <el-cascader :options="optionsAddress" v-model="addressList.s[idx].p_c_d" @change="load_ads"></el-cascader>
                </div>
                <div class="lineTwo">
                  <span v-if='addressList.s[idx].detail.length'>{{ item.detail }}</span>
                  <span v-if='addressList.s[idx].detail.length == 0' class="prompt_color">请输入详情地址</span>
                </div>
              </div>
              <div class="jia_jian_icon">
                <div  @click='load_jia_jian_click(item.jia_jian)'>{{ item.jia_jian }}</div>
              </div>
            </div>

            <div class="load_unload_v_for" v-for='(item, idx) in addressList.e'  :id="idx"  :key="'v-for-two-'+idx">
              <div class="load_unload_icon">
                <div class="xie">{{ item.icon }}</div>
              </div>
              <div class="oneTwo" @click='unload_address_detail(idx)'>
                <div class="AddressStart" @click='unload_ads_record(idx)'>
                  <el-cascader :options="optionsAddress" v-model="addressList.e[idx].p_c_d" @change="unload_ads"></el-cascader>
                </div>
                <div class="lineTwo">
                  <span v-if='addressList.e[idx].detail.length'>{{ item.detail }}</span>
                  <span v-if='addressList.e[idx].detail.length == 0' class="prompt_color">请输入详情地址</span>
                </div>
              </div>
              <div class="jia_jian_icon">
                <div  @click='unload_jia_jian_click(item.jia_jian)'>{{ item.jia_jian }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class='infoContainer'>
          <div class="y_goods">

            <div>
              <div><span>货物名称</span></div>
              <div @click='goods_name_click'><span>{{goods_name}}</span>
              </div>
            </div>

            <div>
              <div><span>重量</span></div>
              <div>
                <input class="two_input_width"  v-on:input="input_change('min_weight')"  type="number"  placeholder='0~99'  v-model='min_weight'></input>&nbsp;&nbsp;吨
              </div>
            </div>

            <div>
              <div><span>体积</span></div>
              <div>
                <input class="two_input_width"  v-on:input="input_change('min_volume')"  type="number"  placeholder='0~99'  v-model='min_volume'></input>&nbsp;&nbsp;方
              </div>
            </div>

            <div>
              <div><span>车型车长</span></div>
              <div @click='vehicle_type_click'><span>{{ vehicle_type }}</span></div>
            </div>

            <div>
              <div><span>几装几卸</span></div>
              <div><span>{{ load_unload_type }}</span></div>
            </div>

          </div>
        </div>
        <div class='infoContainer'>
          <div class="y_goods">

            <div>
              <div><span>装货时间</span></div>
              <div>
                <el-date-picker
                  v-model="load_time" :editable='false' 
                  type="date"
                  placeholder="选择日期时间"
                  align="right"
                  :picker-options="pickerOptions"
                  format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
            </div>

            <div>
              <div><span>备注</span></div>
              <div><input  v-on:input="input_change('remark')"  placeholder='选填'  v-model='remark'></input></div>
            </div>

            <div>
              <div><span>期望金额</span></div>
              <div><input  v-on:input="input_change('expected_cost')"  placeholder='可不填，由司机发起竞价'  v-model='expected_cost'></input></div>
            </div>

          </div>
        </div>
      </div>
      <div class="blank_"></div>
    </div>

    <div class="bottom-btn">
      <div class="next-btn"  @click="submit_driver">指定司机</div>
      <div class="edit-btn" @click="submit">发 货</div>
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
  import $ from 'jquery'
  export default{
    name:"pg_publish",
    data(){
      return{
        addressList:{},//地址
        optionsAddress:[],//地址
        ads_index:0,//获取地址下标
        goods_name:"",//货物名称
        min_weight:'',
        max_weight:'',
        min_volume:'',
        max_volume:'',
        vehicle_type:"",//车型
        load_unload_type:"",//几装几卸
        SelectBoxFlag:false,//弹出选择框是否显示
        SelectBoxList:[],//弹出框选择数据列表
        vehicleList:[],//弹框车型列表
        goodsList:[],//弹框货物列表
        BouncedName:"",
        load_time:"",//装货时间
        remark:"",//备注
        expected_cost:"",//期望金额
        tips_Msg:"",//提示信息
        ifTips:false,
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
      this.addressList.s = [{"icon":"装","p_c_d":[],"detail":"","lng":0,"lat":0,"jia_jian":"+"}]
      this.addressList.e = [{"icon":"卸","p_c_d":[],"detail":"","lng":0,"lat":0,"jia_jian":"+"}]

      // 赋值
      if(this.$store.state.pg_publish.load_pointList.length){
        this.addressList.s = this.$store.state.pg_publish.load_pointList
      }
      if(this.$store.state.pg_publish.unload_pointList.length){
        this.addressList.e = this.$store.state.pg_publish.unload_pointList
      }
      if(this.$store.state.pg_publish.other_info.goods_name.length){
        this.goods_name = this.$store.state.pg_publish.other_info.goods_name
      }
      if(this.$store.state.pg_publish.other_info.min_weight.length){
        this.min_weight = this.$store.state.pg_publish.other_info.min_weight
      }
      if(this.$store.state.pg_publish.other_info.max_weight.length){
        this.max_weight = this.$store.state.pg_publish.other_info.max_weight
      }
      if(this.$store.state.pg_publish.other_info.min_volume.length){
        this.min_volume = this.$store.state.pg_publish.other_info.min_volume
      }
      if(this.$store.state.pg_publish.other_info.max_volume.length){
        this.max_volume = this.$store.state.pg_publish.other_info.max_volume
      }
      if(this.$store.state.pg_publish.other_info.vehicle_type.length){
        this.vehicle_type = this.$store.state.pg_publish.other_info.vehicle_type
      }
      if(this.$store.state.pg_publish.other_info.load_time.length){
        this.load_time = this.$store.state.pg_publish.other_info.load_time
      }else{
        this.load_time = this.formatDate(new Date)
      }
      if(this.$store.state.pg_publish.other_info.remark.length){
        this.remark = this.$store.state.pg_publish.other_info.remark
      }
      if(this.$store.state.pg_publish.other_info.expected_cost.length){
        this.expected_cost = this.$store.state.pg_publish.other_info.expected_cost
      }

      this.load_unload_type_method()

      this.httpRequest_ygy("queryVehicleModel.do","",function(res){

        for(var i = 0; i < res.data.length; i++){
          res.data[i].name = res.data[i].vehicleType
        }

        that.vehicleList = res.data
      })

      this.httpRequest_ygy("queryProdcutName.do","",function(Prodcutres){

        for(var i = 0; i < Prodcutres.data.length; i++){
          Prodcutres.data[i].name = Prodcutres.data[i].productName
        }
        that.goodsList = Prodcutres.data
      })

    },
    methods:{

      // 记住用户输入，存到vuex；数字精确2位小数
      input_change(v){
        if(v == "min_weight" || v == "max_weight" || v == "min_volume" || v == "max_volume" || v == "expected_cost"){
          this[v] = this[v].replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
        }
        this.$store.state.pg_publish.other_info[v] = this[v]
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

      // 返回上一页
      goPrev(){
        
        this.deleteVeux()
        this.$router.push({
          name:"publishGoods"
        })
      },
      deleteVeux(){

        this.$store.state.pg_publish = {
          load_pointList:[],
          unload_pointList:[],
          other_info:{goods_name:"",min_weight:"",max_weight:"",min_volume:"",max_volume:"",vehicle_type:"",load_time:"",remark:"",expected_cost:""}
        }
      },
      load_ads_record(idx){

        this.ads_index = idx
      },
      unload_ads_record(idx){

        this.ads_index = idx
      },
      load_ads(value){

        this.addressList.s[this.ads_index].p_c_d = value
      },
      unload_ads(value){

        this.addressList.e[this.ads_index].p_c_d = value
      },
      load_address_detail(idx){
        this.$store.state.pg_publish.load_pointList = this.addressList.s
        this.$store.state.pg_publish.other_info.load_time = this.load_time
        this.$router.push({
          name:"SendLnglat",
          query:{
            type:"装货点",
            index:idx,
          }
        })
      },
      unload_address_detail(idx){
        this.$store.state.pg_publish.unload_pointList = this.addressList.e
        this.$store.state.pg_publish.other_info.load_time = this.load_time
        this.$router.push({
          name:"SendLnglat",
          query:{
            type:"卸货点",
            index:idx,
          }
        })
      },
      load_jia_jian_click(type){
        if(type == "+"){
          this.addressList.s[0].jia_jian = ""
          var item = {"icon":"装","p_c_d":[],"detail":"","lng":0,"lat":0,"jia_jian":"-"};
          this.addressList.s.push(item)
        }else if(type == "-"){
          this.addressList.s.pop()
          this.addressList.s[0].jia_jian = "+"
        }
        this.load_unload_type_method()
      },
      unload_jia_jian_click(type){
        if(type == "+"){
          this.addressList.e[0].jia_jian = ""
          var item = {"icon":"卸","p_c_d":[],"detail":"","lng":0,"lat":0,"jia_jian":"-"};
          this.addressList.e.push(item)
        }else if(type == "-"){
          this.addressList.e.pop()
          this.addressList.e[0].jia_jian = "+"
        }
        this.load_unload_type_method()
      },
      // 选中弹框中的某个值
      selectedItem(index){
        if(this.BouncedName == "车型"){
          this.vehicle_type = this.SelectBoxList[index].name
          this.$store.state.pg_publish.other_info.vehicle_type = this.vehicle_type
        }
        if(this.BouncedName == "货物"){
          this.goods_name = this.SelectBoxList[index].name
          this.$store.state.pg_publish.other_info.goods_name = this.goods_name
        }
        this.SelectBoxFlag = false
      },
      // 取消按钮 弹出选择框
      selectCancel(){
        this.SelectBoxFlag = false
      },
      vehicle_type_click(){
        this.BouncedName = "车型";
        this.SelectBoxList = this.vehicleList;
        this.SelectBoxFlag = true;
      },
      goods_name_click(){
        this.BouncedName = "货物";
        this.SelectBoxList = this.goodsList;
        this.SelectBoxFlag = true;
      },
      load_unload_type_method(){
        // 一装一卸
        var loadUnloadType = this.addressList.s.length + "装" + this.addressList.e.length + "卸"
        loadUnloadType = loadUnloadType.replace(new RegExp('1','g'),"一")
        loadUnloadType = loadUnloadType.replace(new RegExp('2','g'),"两")
        this.load_unload_type = loadUnloadType
        // 清空placeholder
        this.$nextTick(() => {
          $(".el-cascader .el-input--suffix .el-input__inner").each(function(index, item) {
            item.placeholder = ""
          })
        })
      },
      check(){
        if(this.addressList.s[0].p_c_d.length == 0 || this.addressList.s[0].detail.length == 0){
          this.$alert('请输入装货地址', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        if(this.addressList.e[0].p_c_d.length == 0 || this.addressList.e[0].detail.length == 0){
          this.$alert('请输入卸货地址', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        if(this.goods_name.length == 0){
          this.$alert('请输入货物名称', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        if(this.min_weight == 0 && this.max_weight == 0){
          this.$alert('请填写重量', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        if(this.min_volume == 0 && this.max_volume == 0){
          this.$alert('请填写体积', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        if(this.vehicle_type == 0){
          this.$alert('请选择车型车长', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        return true
      },
      search(cellPhone){

        var that = this
        var postData = {
          cellPhone : cellPhone,//司机电话
        }

        this.httpRequest_ygy("queryInfoByPhone.do", postData, function(res){
          if(res.data == ""){
            that.ifTips = true;
            that.tips_Msg = "没有找到该司机";//res.Msg;

            setTimeout(function(){
              that.ifTips = false;
            },1800)
            return;
          }

          that.$prompt('确定要指定给' + res.data.driver_name + "吗？", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showInput: false,
            closeOnClickModal: false, 
          }).then(({ value }) => {

            // 装货点
            var LoadingPoint = []
            for(var i = 0; i < that.addressList.s.length; i++){
              var item = that.addressList.s[i]
              var load = {"l_province":item.p_c_d[0],"l_city":item.p_c_d[1],"l_district":item.p_c_d[2],"l_subdistrict":"","l_detail":item.detail,"l_lng":item.lng,"l_lat":item.lat}
              LoadingPoint.push(load)
            }

            // 卸载点
            var UnloadPoint = []
            for(var i = 0; i < that.addressList.e.length; i++){
              var item = that.addressList.e[i]
              var load = {"u_province":item.p_c_d[0],"u_city":item.p_c_d[1],"u_district":item.p_c_d[2],"u_subdistrict":"","u_detail":item.detail,"u_lng":item.lng,"u_lat":item.lat}
               UnloadPoint.push(load)
            }

            // 货品
            var CargoInfo = {"name":that.goods_name,
            "min_weight":that.min_weight?that.min_weight:that.max_weight,
            "max_weight":that.max_weight?that.max_weight:that.min_weight,
            "min_volume":that.min_volume?that.min_volume:that.max_volume,
            "max_volume":that.max_volume?that.max_volume:that.min_volume}

            if(LoadingPoint.length == 0 || UnloadPoint.length == 0){
              that.$alert('请输入卸货地址', '提示', {
                confirmButtonText: '确定'
              })
            }

            var postData = {
              driverId : res.data.driver_id,   // 司机id
              ownerName : that.$store.state.userInfo.userName,//货主名称
              ownerPhone : that.$store.state.userInfo.cellphone,//货主电话
              endTime : "2021-1-1 23:59:59",//报价截止时间
              loadingTime : that.load_time,
              expectedCost : that.expected_cost,//期望运费
              vehicleType : that.vehicle_type,//车型
              loadUnloadType : that.load_unload_type,//装卸类型
              mark : that.remark,//备注
              LoadingPoint : LoadingPoint,//装货点
              UnloadPoint : UnloadPoint,//装货点
              CargoInfo : CargoInfo,//货物信息
            }

            that.httpRequest_ygy("addGoods.do",postData,function(res){

              that.ifTips = true;
              that.tips_Msg = "操作成功"
              that.deleteVeux()
              setTimeout(function(){
                that.$router.push({
                  name:"publishGoods",
                })
              },2000)
            })

          }).catch(() => { })
        })
      },
      submit_driver(){

        var that = this

        if(this.check() == false){
          return
        }

        if(this.expected_cost == 0){
          this.$alert('指定司机必须填写金额', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }

        this.$prompt('请输入司机号码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^1[3456789]\d{9}$/,
          inputErrorMessage: '请输入正确的手机号码',
          closeOnClickModal: false, 
        }).then(({ value }) => {

          this.search(value)
        }).catch(() => { })
      },
      submit(){

        var that = this

        if(this.check() == false){
          return
        }

        // 装货点
        var LoadingPoint = []
        for(var i = 0; i < this.addressList.s.length; i++){
          var item = this.addressList.s[i]
          var load = {"l_province":item.p_c_d[0],"l_city":item.p_c_d[1],"l_district":item.p_c_d[2],"l_subdistrict":"","l_detail":item.detail,"l_lng":item.lng,"l_lat":item.lat}
          LoadingPoint.push(load)
        }

        // 卸载点
        var UnloadPoint = []
        for(var i = 0; i < this.addressList.e.length; i++){
          var item = this.addressList.e[i]
          var load = {"u_province":item.p_c_d[0],"u_city":item.p_c_d[1],"u_district":item.p_c_d[2],"u_subdistrict":"","u_detail":item.detail,"u_lng":item.lng,"u_lat":item.lat}
           UnloadPoint.push(load)
        }

        // 货品
        var CargoInfo = {"name":that.goods_name,
        "min_weight":that.min_weight?that.min_weight:that.max_weight,
        "max_weight":that.max_weight?that.max_weight:that.min_weight,
        "min_volume":that.min_volume?that.min_volume:that.max_volume,
        "max_volume":that.max_volume?that.max_volume:that.min_volume}

        if(LoadingPoint.length == 0 || UnloadPoint.length == 0){
          that.$alert('请输入卸货地址', '提示', {
            confirmButtonText: '确定'
          })
        }

        var postData = {
          driverId : "",   // 司机id
          ownerName : that.$store.state.userInfo.userName,//货主名称
          ownerPhone : that.$store.state.userInfo.cellphone,//货主电话
          endTime : "2021-1-1 23:59:59",//报价截止时间
          loadingTime : that.load_time,
          expectedCost : that.expected_cost,//期望运费
          vehicleType : that.vehicle_type,//车型
          loadUnloadType : that.load_unload_type,//装卸类型
          mark : that.remark,//备注
          LoadingPoint : LoadingPoint,//装货点
          UnloadPoint : UnloadPoint,//装货点
          CargoInfo : CargoInfo,//货物信息
        }

        this.httpRequest_ygy("addGoods.do",postData,function(res){

          that.ifTips = true;
          that.tips_Msg = "操作成功"
          that.deleteVeux()
          setTimeout(function(){
            that.$router.push({
              name:"publishGoods",
            })
          },2000)
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  .pg_publish{
    height: 100%;
    overflow: hidden;
    background-color: #E5E8FA;
    .container{
      height: calc(100% - 1.8rem);
      padding-bottom: 120/50rem;
      overflow: scroll;
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
            .load_unload_v_for{
              overflow: hidden;
              height: 150/50rem;
              border-bottom:1.5/50rem solid #eee;
              .load_unload_icon{
                float: left;
                width: 80/50rem;
                height: 100%;
                &>div{
                  float: left;
                  padding: 10/50rem;
                  background-color: #FACE51;
                  position: relative;
                  left: 50%;
                  top: 50%;
                  -webkit-transform: translate(-50%,-50%);
                  -ms-transform: translate(-50%,-50%);
                  transform: translate(-50%,-50%)
                }
                .xie{background-color: #FD757F;}
              }
              .oneTwo{
                height: 100%;
                float: left;
                width: 500/50rem;
                .prompt_color{
                  color: #a7a7a7;
                }
                .lineOne{
                  float: left;
                  height: 50%;
                  width: 100%;
                  line-height: 90/50rem;
                  border-bottom:1.5/50rem solid #eee;
                  font-size: 27/50rem;
                  font-weight: 600;
                }
                .AddressStart{
                  float: left;
                  width: 100%;
                  border-bottom:1.5/50rem solid #eee;
                  font-weight: 600;
                  pointer-events: none;
                  .el-cascader{
                    width: 100%;
                  }
                }
                .lineTwo{
                  float: left;
                  height: 50%;
                  width: 100%;
                  line-height: 37/50rem;
                  font-size: 23/50rem;
                }
              }
              .jia_jian_icon{
                float: right;
                height: 100%;
                width: 80/50rem;
                &>div{
                  float: left;
                  font-size: 50/50rem;
                  padding: 10/50rem;
                  padding-left: 20/50rem;
                  padding-right: 20/50rem;
                  position: relative;
                  left: 50%;
                  top: 50%;
                  -webkit-transform: translate(-50%,-50%);
                  -ms-transform: translate(-50%,-50%);
                  transform: translate(-50%,-50%)
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
              input{width: 330/50rem;}
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
      .blank_{
        width: 100%;
        height: 120/50rem;
      }
    }
    .bottom-btn{
      width: 650/50rem;
      height: 70/50rem;
      position: absolute;
      bottom: 40/50rem;
      left: 50/50rem;
      &>div{
        width: 45%;
        height: 100%;
        background-color: #1e8cf8;
        border-radius: 35/50rem;
        font-size: 29/50rem;
        color: white;
        line-height: 70/50rem;
        text-align: center;
      }
      .next-btn{
        float: left;
      }
      .edit-btn{
        float: right;
      }
    }
  }
</style>
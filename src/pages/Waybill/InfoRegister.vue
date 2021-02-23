<template>
    <div class="InfoRegister">
        <header><i class="iconfont icon-xiangzuo1"  @click="$router.back(-1)"></i><span>信息登记</span></header>
        <div class="container">
            <div><span>订单地址：</span><input v-model="receivePartyAddr1" placeholder="请输入详情地址" @confirm="inpuConfirm"></input></div>
            <div class="car">
                <span>限制车型：</span>

                <div class="select">
                    <el-select v-model="carsLimit_checked" multiple placeholder="请选择限制车型">
                        <el-option
                          v-for="item in carsLimit"
                          :key="item.v"
                          :label="item.v"
                          :value="item.v">
                        </el-option>
                      </el-select>
                </div>
            </div>
             
            <div class="car">
                <span>仅限车型：</span> 
                <div class="select">
                    <el-select v-model="carsOnly_checked" multiple placeholder="请选择仅限车型">
                        <el-option
                          v-for="item in carsLimit"
                          :key="item.v"
                          :label="item.v"
                          :value="item.v">
                        </el-option>
                    </el-select>
                </div>
            </div>
            
            <div class="type">
                <span>限行类型：</span>
                <el-radio-group v-model="typeLimit" @change="limitChange">
                    <el-radio :label="1">时间段限行</el-radio>
                    <el-radio :label="2">日期限行</el-radio>
                </el-radio-group>
            </div>

            <div class="date" >
                <span>限行时间：</span>
                <el-time-select
                    placeholder="起始时间"
                    v-model="startTime"
                    :picker-options="{
                      start: '00:15',
                      step: '00:15',
                      end: '24:00'
                    }" style="width: 130px" size="small" :disabled="timeFalse">
                </el-time-select>
                <span>&ensp;至&ensp;</span>
                <el-time-select
                    placeholder="结束时间"
                    v-model="endTime "
                    :picker-options="{
                      start: '00:15',
                       step: '00:15',
                      end: '24:00',
                      minTime: startTime
                    }" style="width: 130px" size="small" :disabled="timeFalse">
                </el-time-select>
            </div>
                
            <div class="date">
                <span>限行日期：</span>
                <el-date-picker
                  v-model="startDate"
                  type="date"
                  placeholder="开始日期"  style="width: 130px" size="small" value-format="yyyy-MM-dd" :disabled="!timeFalse">
                </el-date-picker>
                <span>&ensp;至&ensp;</span>
                <el-date-picker
                  v-model="endDate"
                  type="date"
                  placeholder="结束日期" style="width: 130px" size="small" value-format="yyyy-MM-dd" :picker-options="pickerOptions" :disabled="!timeFalse">
                </el-date-picker>
            </div>
            <div>
                <div>
                    <span>&emsp;&emsp;限高：</span>
                    <select v-model="heightLimit">
                        <option v-for="item in heightOptions">{{item.label}}</option>
                    </select>
                    
                    <span>&emsp;&emsp;&emsp;&emsp;&emsp;限宽：</span>
                    <select v-model="wideLimit">
                        <option v-for="item in heightOptions">{{item.label}}</option>
                    </select>
                </div>
                <div>
                    <span >&emsp;&emsp;限重：</span>
                    <input v-model="weightLimit" placeholder="0-100吨" style="width: 80px"></input>
                </div>
            </div>
            <div class="car">
                <span>&emsp;&emsp;其他： </span>
                <div class="option">
                    <el-checkbox-group v-model="checkedOthers">
                        <el-checkbox v-for="other in others" :label="other" :key="other">{{other}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            
            <div class="car"><span>&emsp;&emsp;备注：</span><input v-model="notes"></input></div>
            
            <div class="submit"><el-button type="primary" round @click="submit_click">提 交</el-button></div>
            
        </div>
        <div v-if="ifTips" class="msg_tips">
            <div class="tips_content">
                <i class="iconfont icon-chenggong1"></i>
                <p>{{tips_Msg}}</p>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
const otherOptions = ['带板', '空间不便','道路不通', '送货预约', '劳务派遣', '限定交货时间', '通知对方卸货'];
export default{
    data(){
        return{
            
            timeFalse:false,
            tips_Msg:"",//提示信息
            ifTips:false,//提示信息是否显示
            CurrentLocation:"",//当前位置
            longitude:"",//经度
            latitude:"",//纬度
            carsLimit:[],//车型列表
            carsLimit_checked: [],//选择的限制车型
            carsOnly_checked:[],//选择的仅限车型
            checkedOthers: [],
            others: otherOptions,
            limitData:[],//限制信息
            
            heightOptions: [{
                value: '2.5',
                label: '2.5米'
            }, {
                value: '3',
                label: '3米'
            }, {
                value: '4',
                label: '4米'
            }, 
             {
                value: '4.5',
                label: '4.5米'
            }, {
                value: '5', 
                label: '5米'
            }],
            receivePartyAddr1:'',
            typeLimit:'',
            heightLimit:'',
            wideLimit:'',
            weightLimit:'',
            startTime:'',
            endTime:'',
            startDate:'',
            endDate:'',
            beginLimit:'',
            endLimit:'',
			orderInfo:[],
            notes:'',
            pickerOptions: {
                disabledDate: (time) => {
                    return time.getTime() < this.startDate || time.getTime() < Date.now();
                }
            },
        }
    },
    created(){
        var that = this;
		if(this.$route.query.orderInfo){
			this.orderInfo = this.$route.query.orderInfo;
            this.receivePartyAddr1 = this.orderInfo.receivePartyAddr1
		}
        //查询车型列表
        this.httpRequest( "getVehicleModel.do", "" ,function(res){  
            that.carsLimit = res.data;
        })

        if(this.receivePartyAddr1){
            var postData = {
                CustomerCode: this.orderInfo.customerCode,
                ReceiveCode: this.orderInfo.receiveCode
            }
            //查询限制信息
            this.httpRequest( "getVehicleModelLimit.do", postData ,function(res1){

                if (res1.data.length) {
                    that.limitData = res1.data;
                    //数据赋值
                    that.carsLimit_checked = that.limitData[0].vehicleModelLimit.split(",");
                    that.carsOnly_checked = that.limitData[0].vehicleModelOnly.split(",");
                    that.typeLimit = that.limitData[0].typeLimit;
                    if(that.limitData[0].typeLimit == "timeType"){
                        that.typeLimit = 1;
                        that.timeFalse = false;
                        that.startTime = that.limitData[0].beginLimit.substring(11,16);
                        that.endTime = that.limitData[0].endLimit.substring(11,16);
                    }
                    if(that.limitData[0].typeLimit == "dateType"){
                        that.typeLimit = 2;
                        that.timeFalse = true;
                        that.startDate = that.limitData[0].beginLimit.substring(0,10);
                        that.endDate = that.limitData[0].endLimit.substring(0,10);
                    }
                    that.heightLimit = that.limitData[0].heightLimit;
                    that.wideLimit = that.limitData[0].wideLimit;
                    that.weightLimit = that.limitData[0].weightLimit;
                    that.checkedOthers = that.limitData[0].otherLimit.split(",");
                    that.notes = that.limitData[0].notes;
                }
            })
        }
    },
    mounted(){
        // 获取当前位置
        var that = this;
        AMap.plugin('AMap.Geolocation', function() {
            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：5s
            })
            geolocation.getCurrentPosition()
            AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
            AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
            function onComplete(data){
                that.CurrentLocation = data.formattedAddress //当前位置
                that.longitude = data.position.lng //经度
                that.latitude = data.position.lat  //纬度
            }
            function onError(data){
                that.$message.error("定位失败，请打开手机GPS")
            }
        })
    },
    methods:{
        limitChange(value){
            if(value == 1){
                this.timeFalse = false;
                this.startDate = "";
                this.endDate = "";
                
            }else{
                this.timeFalse = true;
                this.startTime = "";
                this.endTime = "";
            }
        },
        inpuConfirm: function(event) {
            var inputValue = event.target.value
        },
        submit_click(){
            if(!this.receivePartyAddr1){
                this.$alert('请填写订单地址', '提示', {
                    confirmButtonText: '确定'
                })
                return;
            }else if(this.longitude == "" || this.longitude == "" || this.CurrentLocation == ""){

                this.$alert('未获取当前坐标，请打开GPS，退出APP重新打开', '提示', {
                    confirmButtonText: '确定'
                })
                return;
            }else if(this.carsLimit_checked.length == 0 ){
                this.$alert('请选择限制车型', '提示', {
                    confirmButtonText: '确定'
                })
                return;
            }else if(this.carsOnly_checked.length == 0 ){
                this.$alert('请选择仅限车型', '提示', {
                    confirmButtonText: '确定' 
                })
                return;
            }else if(!this.typeLimit){
                this.$alert('请选择限行类型', '提示', {
                    confirmButtonText: '确定'
                })
                return;
            }else if(this.typeLimit == 1){
                if(this.startTime == ""){
                    this.$alert('请选择时间段限行的开始时间', '提示', {
                        confirmButtonText: '确定'
                    })
                    return;
                }else if(this.endTime == ""){
                    this.$alert('请选择时间段限行的结束时间', '提示', {
                        confirmButtonText: '确定'
                    })
                    return;
                }
            }else if(this.typeLimit == 2){
                if(this.startDate == ""){
                    this.$alert('请选择日期限行的开始日期', '提示', {
                        confirmButtonText: '确定'
                    })
                    return;
                }else if(this.endDate == ""){
                    this.$alert('请选择日期限行的结束日期', '提示', {
                        confirmButtonText: '确定'
                    })
                    return;
                }
            }else if(!this.heightLimit){
                this.$alert('请选择限高', '提示', {
                    confirmButtonText: '确定'
                })
                return;
            }else if(!this.wideLimit){
                this.$alert('请选择限宽', '提示', {
                    confirmButtonText: '确定'
                })
                return;
            }else if(!this.weightLimit){
                this.$alert('请填写限重', '提示', {
                    confirmButtonText: '确定'
                })
                return;
            }else if(this.checkedOthers.length == 0){
                this.$alert('请选择其他限制', '提示', {
                    confirmButtonText: '确定' 
                })
                return;
            }

            //全部已填写
            if(this.typeLimit == 1){
                this.typeLimit = "timeType";
                this.beginLimit = this.startTime;
                this.endLimit = this.endTime;
            }
            if(this.typeLimit == 2){
                this.beginLimit = this.startDate;
                this.endLimit = this.endDate;
                this.typeLimit = "dateType";
            }

            var vehicleModelLimit = ""
            var vehicleModelOnly = ""
            var otherLimit = ""
            if(this.carsLimit_checked.length != 0){
                for (var i = this.carsLimit_checked.length - 1; i >= 0; i--) {
                    vehicleModelLimit += this.carsLimit_checked[i] + ",";
                }
                vehicleModelLimit=vehicleModelLimit.slice(0,vehicleModelLimit.length-1)
            }
            if(this.carsOnly_checked.length != 0){
                for (var i = this.carsOnly_checked.length - 1; i >= 0; i--) {
                    vehicleModelOnly += this.carsOnly_checked[i] + ",";
                }
                vehicleModelOnly=vehicleModelOnly.slice(0,vehicleModelOnly.length-1)
            }
            if(this.checkedOthers.length != 0){
                for (var i = this.checkedOthers.length - 1; i >= 0; i--) {
                    otherLimit += this.checkedOthers[i] + ",";
                } 
                otherLimit=otherLimit.slice(0,otherLimit.length-1)
            }

            var that = this;
            var postData = {
                customerCode: this.orderInfo.customerCode,
                receiveCode: this.orderInfo.receiveCode,
                receiveName: this.orderInfo.receivePartyContactName,
                receivePartyAddr1: this.receivePartyAddr1,
                locateAddress: this.CurrentLocation,
                locateLongitude: this.longitude,
                locateLatitude: this.latitude, 
                vehicleModelLimit: vehicleModelLimit,
                vehicleModelOnly: vehicleModelOnly,
                heightLimit: this.heightLimit,
                wideLimit: this.wideLimit,
                weightLimit: this.weightLimit,
                typeLimit:this.typeLimit,
                beginLimit: this.beginLimit,
                endLimit: this.endLimit,
                otherLimit: otherLimit,
                notes: this.notes,
                addWho: this.$store.state.userInfo.userName,
                addDate:this.getNowTime()
            }
            this.httpRequest("saveVehicleModelLimit.do",postData,function(res){
                that.ifTips = true;
                that.tips_Msg = res.Msg;

                setTimeout(function(){
                    that.ifTips = false;
                    that.$router.back(-1);
                },2000)
            })
        }
    } 
}
</script>

<style lang="less" scoped>
    .InfoRegister{
        width: 100%;
        height: 100%;
        .container{
            padding: 0 5/50rem;
            .carlimits{
                width: 75%; 
                background-color:pink;
            }
            &>div{
                line-height: 80/50rem;
                padding: 18/50rem 0 ;
                border-bottom: 1/50rem dashed #ddd;
                input{
                    width: 80%; 
                }
                .select{
                    .el-select{
                        width: 598/50rem;
                    }
                }
                .el-time-picker{
                    padding: 0;
                }
                .el-radio-group{
                    padding-top:30/50rem;
                }
            }
            .car,.type,.date{
                display: flex;
                input{
                    margin: auto 0; 
                }
            }
            .option{
                width: 79%;
                .el-checkbox{
                    margin: 0;
                    width: 32%;
                    line-height: 50/50rem;
                }
            }
            .submit{
                line-height: 200/50rem;
                text-align: center;
                button{
                    padding: 25/50rem  100/50rem;
                }
            }
        }
    }
</style>

<template>
	<div class="Reg">
		<header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>注册</span></header>
		<div class="container">
			<div class='regContainer'>
			  	<div class='regInfo'>
			  		<p><span>个人信息</span></p>
			    	<div><span>手机号</span><input  readonly  v-model='cellphone'></input></div>
			    	<div><span>姓名</span><input placeholder='必填'   ref="userName"   @keyup.enter="getFocus('password')"     v-model='userName'></input><i v-if="userName" @click="clearInput('userName')" class="iconfont icon-iconfontcuowu"></i></div>
			    	<div><span>密码</span><input placeholder='必填'   ref="password"   @keyup.enter="getFocus('IDCardNum')"    v-model='password'></input><i v-if="password" @click="clearInput('password')" class="iconfont icon-iconfontcuowu"></i></div>
			    	<div><span>身份证号</span><input placeholder='必填'   ref="IDCardNum"   @keyup.enter="getFocus('vicheNo')"    v-model='IDCardNum'></input><i v-if="IDCardNum" @click="clearInput('IDCardNum')" class="iconfont icon-iconfontcuowu"></i></div>
                    
			    	<p v-if="userRole == 'driver'"><span>车辆信息</span></p>
			    	<div class="driverInfo" v-if="userRole == 'driver'">
  	                    <div><span>车辆类型</span><div class="radioValue">
  	                      <el-radio-group v-model="vehicleAppType"  @change="changeHandler">
                            <el-radio label="1">自有车</el-radio>
                            <el-radio label="2">临请车</el-radio>
                          </el-radio-group></div>
                        </div>
                        <div @click='ChooseCarrier' v-if = "vehicleAppType == 1"><span>承运商</span><div ><span>
                            {{Carrier}}</span><i  class="iconfont icon-xiangshang"></i></div></div>
    
    
			    	    <div>
			    	    	<span>车牌号</span>
			    	    	<input placeholder='必填'  ref="vicheNo"  @keyup.enter="getFocus('vehicleLength')"    v-model='vicheNo'></input>
			    	    	<i v-if="vicheNo"  @click="clearInput('vicheNo')" class="iconfont icon-iconfontcuowu"></i>
			    	    </div>
				        <div @click='TypeOfCar'><span>车型</span>
				        	<div><span>{{vehicleType}}</span><i class="iconfonticon-xiangshang"></i></div>
				        </div>
				        <div><span>车长（米）</span>
				        	<input placeholder='车长' type="number"   ref="vehicleLength" @keyup.enter="getFocus('vehicleLength')"    v-model='vehicleLength'></input>
				        	<i v-if="vehicleLength.length" @click="clearInput('vehicleLength')" 
				        	class="iconfont icon-iconfontcuowu"></i>
				        </div>
				        <div><span>车宽（米）</span>
				        	<input placeholder='车宽'  type="number"   ref="vehicleWide"   @keyup.enter="getFocus('vehicleWide')"    v-model='vehicleWide'></input>
				        	<i v-if="vehicleWide.length" @click="clearInput('vehicleWide')" 
				        	class="iconfont icon-iconfontcuowu"></i>
				        </div>
				        <div><span>车高（米）</span>
				        	<input placeholder='车高'  type="number"   ref="vehicleHeight"   @keyup.enter="getFocus('vehicleHeight')"    v-model='vehicleHeight'></input>
				        	<i v-if="vehicleHeight.length" @click="clearInput('vehicleHeight')" 
				        	class="iconfont icon-iconfontcuowu"></i>
				        </div>
				        <div><span>载重（吨）</span>
				        	<input placeholder='必填'  type="number"  ref="maxLoadWeight"   @keyup.enter="getFocus('maxLoadWeight')"    v-model='maxLoadWeight'></input>
				        	<i v-if="maxLoadWeight.length" @click="clearInput('maxLoadWeight')"  
				        	class="iconfont icon-iconfontcuowu"></i>
				        </div>
				        <div><span>载重体积(方)</span>
				        	<input placeholder='必填' type="number"   ref="maxLoadVolumn"   @keyup.enter="getFocus('maxLoadVolumn')"   v-model='maxLoadVolumn'></input>
				        	<i v-if="maxLoadVolumn" @click="clearInput('maxLoadVolumn')" 
				        	class="iconfont icon-iconfontcuowu"></i>
				        </div>
				    </div>
				    
					<p><span>上传资料</span></p>
					<div class="uploadImg">
						<div class="LoadImg_head">身份证正面照片</div>
						<div>
							<el-upload  :action="HOST+'registerUploadPicture.do'"  :limit="2" :multiple="true"  :data="uploadParams" ref='upload_info1' :auto-upload="false" list-type="picture-card"  :before-upload="beforeUpload"   :on-error="uploadError" :on-success="uploadSuccess"   :on-preview="handlePictureCardPreview" >
							  <i class="el-icon-plus"></i>
							</el-upload>
							<el-dialog :visible.sync="dialogVisible">
							  <img width="100%" :src="dialogImageUrl" alt="">
							</el-dialog>
						</div>
					</div>
					<div class="uploadImg">
						<div class="LoadImg_head">身份证反面照片</div>
						<div>
							<el-upload  :action="HOST+'registerUploadPicture.do'"   :limit="2" :multiple="true"  :data="uploadParams" ref='upload_info2' :auto-upload="false" list-type="picture-card"  :before-upload="beforeUpload"   :on-error="uploadError" :on-success="uploadSuccess"   :on-preview="handlePictureCardPreview" >
							  <i class="el-icon-plus"></i>
							</el-upload>
							<el-dialog :visible.sync="dialogVisible">
							  <img width="100%" :src="dialogImageUrl" alt="">
							</el-dialog>
						</div>
					</div>
					<div class="uploadImg" v-if="userRole == 'driver'">
						<div class="LoadImg_head">驾驶证照片</div>
						<div>
							<el-upload  :action="HOST+'registerUploadPicture.do'"   :limit="3" :multiple="true"  :data="uploadParams" ref='upload_info3' :auto-upload="false" list-type="picture-card"  :before-upload="beforeUpload"   :on-error="uploadError" :on-success="uploadSuccess"   :on-preview="handlePictureCardPreview" >
							  <i class="el-icon-plus"></i>
							</el-upload>
							<el-dialog :visible.sync="dialogVisible">
							  <img width="100%" :src="dialogImageUrl" alt="">
							</el-dialog>
						</div>
					</div>
					<div class="uploadImg" v-if="userRole == 'driver'">
						<div class="LoadImg_head">行驶证照片</div>
						<div>
							<el-upload  :action="HOST+'registerUploadPicture.do'"   :limit="3" :multiple="true"  :data="uploadParams" ref='upload_info4' :auto-upload="false" list-type="picture-card"  :before-upload="beforeUpload"   :on-error="uploadError" :on-success="uploadSuccess"   :on-preview="handlePictureCardPreview" >
							  <i class="el-icon-plus"></i>
							</el-upload>
							<el-dialog :visible.sync="dialogVisible">
							  <img width="100%" :src="dialogImageUrl" alt="">
							</el-dialog>
						</div>
					</div>
			  	</div>
			  	<div class="g_signBtn" @click='regBtn'>注册</div>
			</div>
			<div v-if="ifTips" class="msg_tips">
				<div class="tips_content">
					<i class="iconfont icon-chenggong1"></i>
					<p>{{tips_Msg}}</p>
				</div>
			</div>
			<div class="SelectMeng"   v-if="typeMShow">
				<div class="SelectWarehouses" >
					<div class="SelectTitle">请选择车型</div>
					<div class="SelectItem">
						<div @click="SelectComit(index)"  v-for='(dataItem,index) in typeOfCarList'  :id="index"  :key='index'>{{dataItem.description}}</div>
					</div>
					<div class="cancel"   @click="selectCancel('e')">取消</div>
				</div>
			</div>
			<div class="SelectMeng"   v-if="carrierShow">
				<div class="SelectWarehouses" >
					<div class="SelectTitle">请选择承运商</div>
					<div class="SelectItem">
						<div @click="CarrierComit(index)"  v-for='(dataItem,index) in CarrierList'  :id="index"  :key='index'>{{dataItem.name}}</div>
					</div>
					<div class="cancel"   @click="selectCancel('e')">取消</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		name:"Reg",
		data(){
			return{
				
                typeMShow:false,
  	  	        carrierShow:false,
  	  	        cellphone:"",//上个页面传来的手机号
  	  	        userName:"",//姓名
  	  	        password:"",//密码
  	  	        IDCardNum:"",//身份证号码
  	  	        vicheNo:"",//车牌号
  	  	        Carrier:"请选择",//承运商
  	  	        CarrierID:"",//承运商ID
  	  	        vehicleType:"请选择",//车型
  	  	        vehicleType_code:"",//车型代码
  	  	        vehicleLength:"",//车长
  	  	        vehicleWide:"",//车宽
  	  	        vehicleHeight:"",//车高
  	  	        maxLoadWeight:'',//载重重量
  	  	        maxLoadVolumn:"",//载重体积
  	  	        tips_Msg:"",//提示信息
  	  	        ifTips:false,//提示信息是否显示
  	  	        typeOfCarList:[],//车型列表
  	  	        CarrierList:[],//承运商列表
  	  	        dialogImageUrl: '',
  	            dialogVisible: false,//是否放大预览照片
  	            uploadParams:{},//上传图片时 额外的参数  
  	            vehicleAppType:"",
  	            userRole:'',//用户角色
  	            params:{},//请求接口的参数

			}
		},
		mounted(){

			this.$refs['userName'].focus();
			
		},
		created(){

			var that = this;
			

			this.cellphone = this.$route.query.phoneNum;
			this.userRole = this.$route.query.userRole;

			// 上传照片时附带的参数
			this.uploadParams.cellphone = this.cellphone;//电话号码

		    if (this.$store.state.typeOfCarList.length) {

		        this.typeOfCarList = that.$store.state.typeOfCarList;

		    } else {

		        var requestData = { listName: "TMS-客户指定车型" };

	            this.httpRequest( "queryCodeLukupData.do",requestData,function(res){

	            	that.typeOfCarList = res.data;
				    that.$store.state.typeOfCarList = res.data;
	            })
		    }

		    //获取承运商列表 
  	        if (this.$store.state.CarrierList.length) {  

  	            this.CarrierList = that.$store.state.CarrierList; 

  	        } else {  
  	            this.httpRequest_ygy( "queryOrgnization.do", "",function(res){  

                    that.CarrierList = res.data;
  	                that.$store.state.CarrierList = res.data;
                })
  	        }
		},
		methods:{
			goPrev(){
				this.$router.push({
					name:"ChooseRole",
					query:{
						page:"Reg",
						phoneNum:this.cellphone,
					}
				})
			},
			changeHandler(value) {
			    if(this.vehicleAppType == "2"){

			    	this.Carrier = "";
			    	this.CarrierID = "";
			    }
            },
			// 点击 注册 按钮
			regBtn (){

			    var that = this;
			    if(!(that.userName && that.password && that.IDCardNum)){
     
			        that.$alert("请输入必填项", '提示', {
				        confirmButtonText: '确定',
				    })
				    return ;
			    }else if (that.password.length<6){
     
			      	that.$alert("密码不能小于六位数", '提示', {
			            confirmButtonText: '确定',
			    	})
			    	return;

			    }else if(!(that.vicheNo && that.maxLoadWeight && that.maxLoadVolumn ) && that.userRole == "driver"){
     
			        that.$alert("请输入必填项", '提示', {
				        confirmButtonText: '确定',
				    })
				    return ;
     
			    }else if (!that.vehicleAppType && that.userRole == "driver"){
     
			       	that.$alert("请选择车辆类型", '提示', {
				        confirmButtonText: '确定',
				    })
				    return;
     
			    }else if (that.vehicleAppType == "1" && !that.CarrierID && that.userRole == "driver"){
     
			        that.$alert("请选择承运商", '提示', {
				        confirmButtonText: '确定',
				    })
				    return;

			    }else if(!that.vehicleType_code && that.userRole == "driver"){
     
			        that.$alert("请选择车型", '提示', {
				        confirmButtonText: '确定',
				    })
				    return ;

			    }else{
			    	// 上传图片
			    	this.$refs.upload_info1.submit();
					this.$refs.upload_info2.submit();
                 
					if(that.userRole == "driver"){

			        	this.$refs.upload_info3.submit();
					    this.$refs.upload_info4.submit();

					    that.params = {
			                loginname: "",//备用字段
			                username: that.userName,//司机姓名
			                idNo: that.IDCardNum,// 身份证号码
			                password: that.password,//密码
			                cellphone: that.cellphone,//手机号
			                vicheNo: that.vicheNo,//车牌号
			                vehicleType: that.vehicleType_code,//车型
			                vehicleLength: that.vehicleLength,//长
			                vehicleWide: that.vehicleWide,//宽
			                vehicleHeight: that.vehicleHeight,//高
			                maxLoadWeight: that.maxLoadWeight,//载重重量
			                maxLoadVolumn: that.maxLoadVolumn,//载重体积
			                vehicleAppType: that.vehicleAppType,//车辆类型
                            orgnizationId: that.CarrierID,//承运商id
                            userType: that.userRole,//用户角色
			            };
			        }

			        if(that.userRole == "owner"){
			        	that.params = {
			                loginname: "",//备用字段
			                username: that.userName,//司机姓名
			                idNo: that.IDCardNum,// 身份证号码
			                password: that.password,//密码
			                cellphone: that.cellphone,//手机号
                            userType: that.userRole,//用户角色
			            };
			        }
			        that.httpRequest( "registerAppUser.do",that.params,function(res){
			            that.ifTips = true    
						that.tips_Msg = res.Msg;
 
						setTimeout(function(){
						 	that.ifTips = false;
						 	that.toLogin();

						},1500)
			        })
			    }
			},
			// 预览放大图片
			handlePictureCardPreview (file) {

			    this.dialogImageUrl = file.url;
			    this.dialogVisible = true;
			},
			// 点击 车辆车型列表出现
			TypeOfCar (){

			    this.typeMShow = true;
			},
			// 选择类型   确认具体车辆车型
			SelectComit:function(index){
				this.typeMShow = false;
			    this.vehicleType = this.typeOfCarList[index].description;
			    this.vehicleType_code = this.typeOfCarList[index].code;
			},

			// 点击 承运商列表出现
  	        ChooseCarrier (){  

  	            this.carrierShow = true;

  	            if(this.vehicleAppType == "2"){

			    	this.carrierShow = false;
			    }
  	        },
  	        // 选择类型   确认具体车辆车型
  	        CarrierComit:function(index){
  	        	this.carrierShow = false;
  	            this.Carrier = this.CarrierList[index].name;
  	            this.CarrierID = this.CarrierList[index].id;
  	        },
		}
	}
</script>
<style lang="less" scoped>
	.Reg{overflow: hidden;
		.regContainer{
			&>.regInfo,.driverInfo{

				&>div{
					position: relative;
				    width:100%;
				    padding: 20/50rem 30/50rem;
				    box-sizing: border-box;
				    overflow: hidden;
				    font-size: 28/50rem;
				    border-bottom: 1/50rem solid #EDEDED;
				    &>span{
					    float: left;
					    width: 170/50rem;
					    height: 50/50rem;
					    line-height: 50/50rem;
					}
					&>input{
						width: 500/50rem;
					    float: left;
					    border: none;
					}
				}
				&>p{
					width: 100%;
					height: 80/50rem;
					line-height: 80/50rem;
					background-color: #f0f0f0;
					span{
						float: left;
						margin-left: 30/50rem;
					}
					i{
						font-size: 50/50rem;
						float: right;
						margin-right: 30/50rem;
					}
				}
				&>div.uploadImg{
					div{
						float: none;
					}
					span{
						float: none;
						color: #aaa;
					}
				}
				.driverInfo{
					.radioValue{ float: left;}
					&>div{
				        padding: 20/50rem 0;
					    &>div{
					        float: right;
					        color: #7A7A7A;
					        line-height: 50/50rem;
					        i{
					        	margin-left: 10/50rem;
					        }
					    }
				    }
				}
			}
			.g_signBtn{
				margin-bottom: 40/50rem;
			}
			&>button{
			    width:690/50rem;
			    color: #fff;
			    background-color: #ff681d;
			    font-size: 28/50rem;
			    margin-top: 50/50rem;
			}
		}
	}
	@media screen and (max-width: 374px){

	  	.Reg{
			.regContainer{
				&>.regInfo{
					&>div{
					    border-bottom: 3/50rem solid #EDEDED;
					}
				}
			}
		}
	}
</style>
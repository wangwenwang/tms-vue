<template>
	<div class="PersonalData">
		<header><i class="iconfont icon-xiangzuo1"  @click="goPrev"></i><span>个人资料</span></header>
		<div class='container'>
		  <div class='regInfo'>
		  	<p class="mine"><img src="../../assets/images/mine.png"><span>个人信息</span></p>
		    <div><span>姓名</span><input  readonly  v-model='userName'></input></div>
		    <div><span>手机号</span><input   readonly v-model='cellphone'></input></div>
		    <div><span>身份证号</span><input placeholder='必填'   ref="IDCardNum"   @keyup.enter="getFocus('vicheNo')"    v-model='IDCardNum'></input><i v-if="IDCardNum" @click="clearInput('IDCardNum')" class="iconfont icon-iconfontcuowu"></i></div>
		    <div class="driverInfo" v-if='$store.state.userInfo.userType == "driver"'>

		      <p  class="car"><img src="../../assets/images/car.png"><span>车辆信息</span></p>
		      <div><span>车辆类型</span>
		      	<input  readonly  v-model='vehicleAppType'></input>
		      </div>
              <div  @click='ChooseCarrier' v-if = 'vehicleAppType == "自有车"'><span>承运商</span>
              	<div ><span>{{orgName}}</span><i  class="iconfont icon-xiangshang"></i></div>
              </div>
  
		      <div><span>车牌号</span>
		      	<input  placeholder='必填' ref="vicheNo"  @keyup.enter="getFocus('vicheNo')" v-model='vicheNo'>
		        </input>
		      	<i v-if="vicheNo" @click="clearInput('vicheNo')" class="iconfont icon-iconfontcuowu"></i>
		      </div>
		      <div @click='TypeOfCar'><span>车辆车型</span>
		      	<div><span>{{vehicleType}}</span><i class="iconfont icon-xiangshang"></i></div>
		      </div>
		      <div><span>车长/米</span>
		      	<input  placeholder='车长' type="number"  ref="vehicleLength"  @keyup.enter="getFocus('vehicleLength')  " v-model='vehicleLength'></input>
		      	<i v-if="vehicleLength" @click="clearInput('vehicleLength')" class="iconfont icon-iconfontcuowu"></i>
		      </div>
		      <div><span>车宽/米</span>
		      	<input   placeholder='车宽' type="number"   ref="vehicleWide"   @keyup.enter="getFocus('vehicleWide')"   v-model='vehicleWide'></input>
		      	<i v-if="vehicleWide" @click="clearInput('vehicleWide')" class="iconfont icon-iconfontcuowu"></i>
		      </div>
		      <div><span>车高/米</span>
		      	<input  placeholder='车高' type="number"   ref="vehicleHeight"  @keyup.enter="getFocus('vehicleHeight'  )" v-model='vehicleHeight'></input>
		      	<i v-if="vehicleHeight" @click="clearInput('vehicleHeight')" class="iconfont icon-iconfontcuowu"></i>
		      </div>
		      <div><span>载重/吨</span>
		      	<input placeholder='必填'   ref="maxLoadWeight"   @keyup.enter="getFocus('maxLoadWeight')"  type="  number"   v-model='maxLoadWeight'></input>
		      	<i v-if="maxLoadWeight" @click="clearInput('maxLoadWeight')" class="iconfont icon-iconfontcuowu"></i>
		      </div>
		      <div><span>载重体积</span>
		      	<input placeholder='必填' type="number"    ref="maxLoadVolumn"   @keyup.enter="getFocus('maxLoadVolumn  ')"    v-model='maxLoadVolumn'></input>
		      	<i v-if="maxLoadVolumn" @click="clearInput('maxLoadVolumn')" class="iconfont icon-iconfontcuowu"></i>
		      </div>
		    </div>

		    <p  class="upload"><img src="../../assets/images/upload.png"><span>上传资料</span></p>
			<div class="uploadImg">
				<div class="LoadImg_head">身份证正面照片</div>
				<div>
					<el-upload :action = "HOST+'registerUploadPicture.do'"  :limit="2" :multiple="true"  :data="uploadParams" ref='upload_INFO1' :auto-upload="false" list-type="picture-card"  :before-upload="beforeUpload"   :on-error="uploadError" :on-success="uploadSuccess"   :on-preview="handlePictureCardPreview" >
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
					<el-upload  :action= "HOST + 'registerUploadPicture.do'"  :limit="2" :multiple="true"  :data="uploadParams" ref='upload_INFO2' :auto-upload="false" list-type="picture-card"  :before-upload="beforeUpload"   :on-error="uploadError" :on-success="uploadSuccess"   :on-preview="handlePictureCardPreview" >
					  <i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
					  <img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</div>
			</div>
			<div class="uploadImg">
				<div class="LoadImg_head">驾驶证照片</div>
				<div>
					<el-upload  :action= "HOST + 'registerUploadPicture.do'"  :limit="3" :multiple="true"  :data="uploadParams" ref='upload_INFO3' :auto-upload="false" list-type="picture-card"  :before-upload="beforeUpload"   :on-error="uploadError" :on-success="uploadSuccess"   :on-preview="handlePictureCardPreview" >
					  <i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
					  <img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</div>
			</div>
			<div class="uploadImg">
				<div class="LoadImg_head">行驶证照片</div>
				<div>
					<el-upload  :action= "HOST + 'registerUploadPicture.do'"  :limit="3" :multiple="true"  :data="uploadParams" ref='upload_INFO4' :auto-upload="false" list-type="picture-card"  :before-upload="beforeUpload"   :on-error="uploadError" :on-success="uploadSuccess"   :on-preview="handlePictureCardPreview" >
					  <i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
					  <img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</div>
			</div>
		  </div>
		  <div class="g_signBtn" @click='saveInfo'>保存资料</div>
		</div>

		<!--车辆车型 -->
		<div class="SelectMeng"   v-if="typeMShow">
			<div class="SelectWarehouses" >
				<div class="SelectTitle">请选择车型</div>
				<div class="SelectItem">
					<div @click="SelectComit(index)"  v-for='(dataItem,index) in typeOfCarList'  :id="index"  :key='index'>{{dataItem.description}}</div>
				</div>
				<div class="cancel"   @click="selectCancel('e')">取消</div>
			</div>
		</div>
        <!--承运商-->
		<div class="SelectMeng"   v-if="carrierShow">
				<div class="SelectWarehouses" >
					<div class="SelectTitle">请选择承运商</div>
					<div class="SelectItem">
						<div @click="CarrierComit(index)"  v-for='(dataItem,index) in CarrierList'  :id="index"  :key='index'>{{dataItem.name}}</div>
					</div>
					<div class="cancel"   @click="selectCancel('e')">取消</div>
				</div>
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
	export default{
		name:"PersonalData",
		data(){
			return{
			    typeMShow:false,//车辆车型弹出框 是否出现
			    carrierShow:false,//承运商弹出框 是否出现
			    typeOfCarList:[], //车辆车型 列表数据
			    CarrierList:[],//承运商 列表数据
			    userName:"",//姓名
			    cellphone:"",//手机号
			    IDCardNum:'',//身份证号
			    vehicleAppType:'',//车辆类型
			    orgName :'',//承运商
			    orgID:'',//承运商
			    vicheNo:"",//车牌号
			    vehicleType:"",//车型
			    vehicleType_code:"",//车型代码
			    vehicleLength:"",//车长
			    vehicleWide:"",//车宽
			    vehicleHeight:"",//车高
			    maxLoadWeight:"",//载重吨
			    maxLoadVolumn:"",//载重体积
			    tips_Msg:"",//提示信息
				ifTips:false,
				dialogImageUrl: '',
		        dialogVisible: false,//是否放大预览照片
		        uploadParams:{},//上传图片时 额外的参数
			}
		},
		created(){

			var that = this;

			var userInfo = this.$store.state.userInfo;

			// 上传照片时附带的参数
			this.uploadParams.cellphone = userInfo.cellphone;//电话号码

			var getUserData = { cellphone: userInfo.cellphone };

            this.httpRequest( "getUserInfo.do",getUserData,function(resData){

            	that.$store.state.userInfo = resData.data;

            	that.userName = resData.data.userName;//姓名
				that.cellphone = resData.data.cellphone;//手机号
				that.IDCardNum = resData.data.idNo;// 身份证号码
				that.vicheNo = resData.data.vicheNo;//车牌号
				that.vehicleAppType = resData.data.vehicleAppType;//车辆类型
				that.orgName = resData.data.orgName;//承运商
				that.vehicleType_code = resData.data.vehicleType;//车型
				that.vehicleLength = resData.data.vehicleLength;//车长
				that.vehicleWide = resData.data.vehicleWide;//车宽
				that.vehicleHeight = resData.data.vehicleHeight;//车高
				that.maxLoadWeight = resData.data.maxLoadWeight;//载重吨
				that.maxLoadVolumn = resData.data.maxLoadVolumn;//载重体积

				if (that.$store.state.typeOfCarList.length) {

			        that.typeOfCarList = that.$store.state.typeOfCarList;

			        for(var i = 0;i < that.typeOfCarList.length; i++){

			        	if(that.typeOfCarList[i].code == that.vehicleType_code){

			        		that.vehicleType = that.typeOfCarList[i].description;
			        	}
			        }

			    } else {

			        var requestData = { listName: "TMS-客户指定车型" };

		            that.httpRequest( "queryCodeLukupData.do",requestData,function(res){

		            	that.typeOfCarList = res.data;
					    that.$store.state.typeOfCarList = res.data;

					    for(var i = 0;i < that.typeOfCarList.length; i++){

				        	if(that.typeOfCarList[i].code == that.vehicleType_code){

				        		that.vehicleType = that.typeOfCarList[i].description;
				        	}
				        }
		            })
			    }

			    if (that.$store.state.CarrierList.length) {

			        that.CarrierList = that.$store.state.CarrierList;

			    } else {

		            that.httpRequest_ygy( "queryOrgnization.do","",function(res){

		            	that.CarrierList = res.data;
					    that.$store.state.CarrierList = res.data;
		            })
			    }
            })
		},
		methods:{
			goPrev(){
				var that = this;

				this.$router.push({
					name:"HomeIndex",
					query:{
					}
				})
			},
			// 保存资料 按钮
			saveInfo(){
				
				var that = this;

			    if (!(that.IDCardNum && that.vicheNo && that.maxLoadWeight && that.maxLoadVolumn)){
			    	
			    	that.$alert("请输入必填项", '提示', {
				        confirmButtonText: '确定',
				   	})
				   	return ;

			    }else if(!that.vehicleType_code){

			    	that.$alert("请选择车型", '提示', {
				        confirmButtonText: '确定',
				   	})
				   	return ;

			    }else{

			    	var userInfo = that.$store.state.userInfo;

			    	// 上传图片
			    	this.$refs.upload_INFO1.submit();
					this.$refs.upload_INFO2.submit();
					this.$refs.upload_INFO3.submit();
					this.$refs.upload_INFO4.submit();
			     
				    var params = {
				        loginName: userInfo.loginName,
				        userName: userInfo.userName,
				        user_id: userInfo.user_id,
				        password: "",
				        cellphone: userInfo.cellphone,
				        idNo: that.IDCardNum,// 身份证号码
				        vicheNo: that.vicheNo,
				        vehicleType: that.vehicleType_code,
				        vehicleLength: that.vehicleLength,
				        vehicleWide: that.vehicleWide,
				        vehicleHeight: that.vehicleHeight,
				        maxLoadWeight: that.maxLoadWeight,//载重吨
					    maxLoadVolumn: that.maxLoadVolumn,//载重体积
					    orgId: that.orgID,//承运商id
				    };
				    console.log(params)
				    // return;

				    that.httpRequest( "regAppUserUpdate.do",params,function(res){

					    that.ifTips = true;
						that.tips_Msg = res.Msg;

						setTimeout(function(){

							that.ifTips = false;

							that.$router.push({
								name:"HomeIndex",
								query:{
								}
							})
						},1500)
		            })
			    } 
			},
			// 点击 车辆车型 弹出框出现
			TypeOfCar(){
				this.typeMShow = true;
			},
			// 点击 承运商列表出现
  	        ChooseCarrier (){  

  	            this.carrierShow = true;
  	            console.log(111)
  	        },
			// 选择类型   确认具体车辆车型
			SelectComit:function(index){
				this.typeMShow = false;
			    this.vehicleType = this.typeOfCarList[index].description;
			    this.vehicleType_code = this.typeOfCarList[index].code;
			},
			// 选择类型   确认具体车辆类型
  	        CarrierComit:function(index){
  	        	console.log(index);
  	        	this.carrierShow = false;
  	            this.orgName = this.CarrierList[index].name;
  	            this.orgID = this.CarrierList[index].id;
  	        },
			// 预览放大图片
			handlePictureCardPreview (file) {

			    this.dialogImageUrl = file.url;
			    this.dialogVisible = true;
			},
		}
	}
</script>
<style lang="less" scoped>
	.PersonalData{overflow: hidden;
		.container{
		  	font-size: 26/50rem;
		  	&>.regInfo{
		  		&>div{
		  			position: relative;
				  	padding: 20/50rem 30/50rem;
				  	box-sizing: border-box;
				  	overflow: hidden;
				  	font-size: 28/50rem;
				  	border-bottom: 1/50rem solid #EDEDED;
				  	input{
				  		width: 500/50rem;
					    float: left;
				  		border:none;
				  	}
				  	&>span{
					  	float: left;
					  	width: 140/50rem;
					  	height: 50/50rem;
					  	line-height: 50/50rem;
					}
					&>div{
					  	line-height: 50/50rem;
					  	float: right;
					  	color: #7A7A7A;
					  	i{
					  		margin-left: 10/50rem;
					  	}
					}
				}
				&>p{
					width: 100%;
					height: 80/50rem;
					line-height: 80/50rem;
					border-top: 10/50rem solid #f0f0f0;
					border-bottom: 5/50rem solid #f0f0f0;
					img{
						float:left;
						margin:7.5/50rem  20/50rem;
						height: 65/50rem;
					}
					span{
						float: left;
						font-weight:700;
						font-size:30/50rem;
						line-height: 80/50rem;
					}
				}
				&>p.mine{
					border-top:none;
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
		  	}
		  	.g_signBtn{
		  		margin-bottom: 40/50rem;
		  	}
		}
	}
	@media screen and (max-width: 374px){
		.PersonalData{
			.container{
			  	&>.regInfo{
			  		&>div{
					  	border-bottom: 3/50rem solid #EDEDED;
					}
			  	}
			}
		}
	}
</style>
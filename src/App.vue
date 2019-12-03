<template>
  <div id="app"  type="primary"  v-loading.fullscreen.lock="Loading"   :element-loading-text="loadingText">
    <router-view  @isLoading="fullscreenLoading" />
  </div>
</template>

<script>

import "../static/font/iconfont.css"

export default {
    name: 'App',
    data(){
        return{
          Loading: false,//是否加载
          loadingText:"拼命加载中",//加载时显示的文字
        }
    },
    methods:{
        fullscreenLoading(isLoad,loadingText){

            this.Loading = isLoad;

            if(loadingText){
                this.loadingText = loadingText;
            }
        }
    }
}
</script>
<style lang="less">
body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, fieldset, legend, input, textarea, button, p, blockquote, th, td
{margin: 0;padding: 0;}
ul,ol,li{ list-style: none;}
a{text-decoration: none;}
img{border: none;}
#app,body,html{
  width: 100%;
  height: 100%;
}
#app{
    position: relative;
}
iframe{
  display: none;
}
input{
  outline: none;
  border: 1/50rem solid #bbb;
  height: 50/50rem;
  padding: 0 10/50rem;
  box-sizing: border-box;
  border-radius: 5/50rem;
  font-size: 28/50rem;
  -webkit-appearance: none;
}
textarea{
  font-size: 28/50rem;
}

.container{
  margin-top: 90/50rem;
  font-size: 28/50rem;
  overflow: scroll;
}

.borderLine{
  &>div{
    border-bottom: 1/50rem solid #e1e1e1;
  }
}

@media screen and (max-width: 374px){

  input{
    border:3/50rem solid #bbb;
  }
  .borderLine{
    &>div{
      border-bottom: 3/50rem solid #e1e1e1;
    }
  }
}

//解决下拉刷新上拉加载带来的头部部分遮挡问题
.topKong{
  width: 100%;
  height: 90/50rem;
}

//头部样式  开始
header{
  width:100%;
  height:90/50rem;
  line-height: 90/50rem;
  background-color: #5965D8;
  font-size: 32/50rem;
  text-align: center;
  color: #fff;
  position: fixed;
  z-index: 999;
  top: 0;
  left:0;
}
header>.iconfont{
  position:absolute;
  top:5/50rem;
  color: #fff;
}
header>.icon-xiangzuo1{
  left: 20/50rem;
}
header>.icon-huabanfuben{
  right: 25/50rem;
}
header>.iconfont::before{
  font-size:40/50rem;
}
header>.icon-huabanfuben::before{
  font-size:40/50rem;
}
//头部样式  结束

//搜索标签
.search_Label{
  width: 100%;
  background-color: #f9f9f9;
  overflow: hidden;
  padding-bottom: 20/50rem;
  &>div{
    font-size: 25/50rem;
    text-align: left;
    height: 50/50rem;
    line-height: 50/50rem;
    margin: 20/50rem 0 0 30/50rem;
    background-color:rgba(152,153,158,0.8);
    float: left;
    color: #fff;
    span{
      margin-left: 10/50rem;
    }
    i{
      position: static;
      color: #fff;
      margin:0 10/50rem;
      font-size: 30/50rem;
    }
  }
}

//我的任务、费用统计页面  数据列表末尾标签样式 开始
.nodata_label{
  text-align: center;
  height: 70/50rem;
  line-height: 70/50rem;
}
.kong{
  height: 200/50rem;
  width: 100%;
}
.nodata_kong{
  height: 600/50rem;
}
//我的任务、费用统计页面  数据列表末尾标签样式 结束

//错误按钮样式 （清除input框）
.icon-iconfontcuowu{
    position:absolute;
    right:40/50rem;
    font-size: 35/50rem;
    top: 28/50rem;
}
//按钮样式
.g_signBtn{
  width: 600/50rem;
  margin: 100/50rem auto 0;
  text-align: center;
  height:70/50rem;
  line-height:70/50rem;
  background-color: #4E6CD8;
  font-size: 30/50rem;
  color:#fff;
  border-radius: 35/50rem;
}

//定位再底部的p标签（里面为单个按钮）
.submitBtn{
  width: 100%;
  height: 70/50rem;
  position: fixed;
  bottom: 30/50rem;
  left: 0;
  .g_signBtn{
      margin:0 auto;
  }
}

.g_doubleBtn{
  width:100%;
  height:70/50rem;
  padding:0 20/50rem;
  margin-top: 80/50rem;
  box-sizing: border-box;
  display: flex;
  &>div{  
    flex-grow:1;
    height:70/50rem;
    line-height: 70/50rem;
    color: #fff;
    background-color: #5965D8;
    text-align: center;
    float: left;
    border-radius: 5/50rem;
  }
  &>div:nth-child(1){
    margin-right: 70/50rem;
  }
}
//提示信息
.msg_tips{
  width:100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  .tips_content{
    width: 250/50rem;
    height: 180/50rem;
    position: fixed;
    left: 50%;
    overflow: hidden;
    margin-left: -125/50rem;
    top: 50%;
    margin-top: -80/50rem;
    background-color: rgba(0,0,0,0.65);
    font-size: 32/50rem;
    color:#fff;
    text-align: center;
    border-radius: 15/50rem;
    .icon-chenggong1{
      font-size: 50/50rem;
      margin: 30/50rem 0 20/50rem ;
      display: block;
    }
  }
}
//下拉框
.goodsSource .AddressStart .el-input--suffix .el-input__inner , .goodsSource .AddressEnd .el-input--suffix .el-input__inner ,.goodsSource .Screen .el-input--suffix .el-input__inner  {
  // height: 40/50rem;
  // line-height: 40/50rem;
  width: 183/50rem;
  border-style: none;
}
 .goodsSource .Sort .el-input--suffix .el-input__inner {
  // height: 40/50rem;
  // line-height: 40/50rem;
  width: 190/50rem;
  border-style: none;
}

.goodsSource .el-cascader__label, .goodsSource  .el-input__inner {
  padding-left: 25/50rem;
  padding-right: 0/50rem;
}
.goodsSource .el-select__caret .el-input__icon .el-icon-arrow-up{ width: 5/50rem; }



//选择弹框
.SelectMeng{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.3);
  z-index: 999;
  .SelectWarehouses{
    width: 500/50rem;
    position: absolute;
    left: 125/50rem;
    top:50%;
    margin-top: -340/50rem;
    background-color: #F1F0F1;
    text-align: center;
    border-radius: 10/50rem;
    &>div{
      width: 100%;
    }
    .SelectItem{
      color: #2F84F0;
      font-size: 29/50rem;
      overflow: scroll;
      max-height: 486/50rem;
      &>div{
        height: 80/50rem;
        line-height: 80/50rem;
        border-bottom: 1/50rem solid #D9D7D9;
      }
    }
    .SelectTitle{
      height: 114/50rem;
      line-height: 114/50rem;
      border-bottom: 1/50rem solid #D9D7D9;
      font-weight: 600;
      font-size: 34/50rem;
    }
    .cancel{
      border-top: 1/50rem solid #D9D7D9;
      height: 80/50rem;
      line-height: 80/50rem;
      color: #2F84F0;
      font-size: 34/50rem;
      font-weight: 600;
    }
  }
}


@media screen and (max-width: 374px){

  //选择弹框
  .SelectMeng{
    .SelectWarehouses{
      .SelectItem{
        &>div{
          border-bottom: 3/50rem solid #D9D7D9;
        }
      }
      .SelectTitle{
        border-bottom: 3/50rem solid #D9D7D9;
      }
      .cancel{
        border-top: 3/50rem solid #D9D7D9;
      }
    }
  }
}

//没有数据 样式
.NoData{
    width: 100%;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -200/50rem;
    font-size: 40/50rem;
    &>div{
      width: 100%;
      height: 180/50rem;
      text-align: center;
      color: #bbb;
      &>.icon-meiyouwuliuxinxi{
        font-size: 150/50rem;
    }
  }
}

//我的任务页面 导航地址选择弹出框
.Navigate_MultiAddress{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left:0;
  background-color: rgba(0,0,0,0.5);
  z-index: 99999;
  &>div{
    width: 600/50rem;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 32/50rem;
    margin-top: -403/50rem;
    margin-left: -300/50rem;
    border-radius: 10/50rem;
    &>.icon-iconfontcuowu{
      position: absolute;
      top: -10/50rem;
      right: -10/50rem;
      font-size: 45/50rem;
    }
    &>div.SelectTitle{
      height:90/50rem;
      line-height:90/50rem;
      text-align: center;
      border-bottom: 1/50rem solid #D9D7D9;
      font-weight: 500;
      color: #222;
      font-size: 34/50rem;
    }
    &>div.SelectContent{
      overflow: scroll;
      max-height: 636/50rem;
    &>.addressContent{
      font-weight:700;
      padding: 15/50rem 20/50rem;
      border-bottom: 3/50rem solid #D9D7D9;
      &>div:nth-child(2){
        font-size: 28/50rem;
        margin-top: 15/50rem;
        overflow: hidden;
        span{
          float: left;
          color: #000;
          font-weight: 400;
        }
        .icon-dianhua-copy{
          float: right;
          margin-right: 10/50rem;
        }
      }
      &:last-child{
        border-bottom: none;
      }
    }
  }
  &>div.cancel{
      height: 80/50rem;
      line-height: 80/50rem;
      color: #2F84F0;
      text-align: center;
      font-size: 34/50rem;
      font-weight: 600;
      border-top: 1/50rem solid  #D9D7D9;
    }
  }
}


@media screen and (max-width: 374px){

  //我的任务页面 导航地址选择弹出框    装货预约页面 装货地址选择弹出框
  .Navigate_MultiAddress{
    &>div{
      &>div.SelectTitle{
        border-bottom: 3/50rem solid #D9D7D9;
      }
      &>div.SelectContent{
        &>.addressContent{
          border-bottom: 3/50rem solid #D9D7D9;
        }
      }
      &>div.cancel{
        border-top: 3/50rem solid  #D9D7D9;
      }
    }
  }
}


// 我的任务/历史任务页面 查看多装货地址弹框
.MultiAddress{
  width: 100%;
  height: 100%;
  position: fixed;
  text-align: left;
  font-size: 29/50rem;
  top: 0;
  left:0;
  background-color: rgba(0,0,0,0.5);
  z-index: 9999999;
  display: none;
  &>div{
    width: 600/50rem;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -240/50rem;
    margin-left: -300/50rem;
    border-radius: 10/50rem;
    &>.icon-iconfontcuowu{
      position: absolute;
      top: -10/50rem;
      right: -10/50rem;
      font-size: 45/50rem;
    }
    &>.addressHead{
      width: 100%;
      height: 80/50rem;
      line-height: 80/50rem;
      display: flex;
      &>span{
        flex-grow:1;
        text-align: center;
        border-right: 1/50rem solid #eee;
        border-bottom: 1/50rem solid #eee;
      }
      &>span:first-child{
        border-bottom: 1/50rem solid #5965D8;
      }
      &>span:last-child{
        border-right:none;
      }
    }
    &>.addressContent{
      padding: 0 20/50rem;
      box-sizing: border-box;
      margin-bottom: 30/50rem;
      &>div{
        margin-top: 30/50rem;
      }
    }
  }
}

@media screen and (max-width: 374px){

  // 我的任务/历史任务页面 查看多装货地址弹框
  .MultiAddress{
    &>div{
      &>.addressHead{
        &>span{
          border-right: 3/50rem solid #eee;
          border-bottom: 3/50rem solid #eee;
        }
        &>span:first-child{
          border-bottom: 3/50rem solid #5965D8;
        }
      }
    }
  }
}

//上传图片样式 开始
.uploadImg{
  &>span{
    float: left;
  }
  &>div{
    float: left;
  }
}
.Upload>.uploadImg:nth-child(1)  .el-upload--picture-card{
  background-image:url('/static/images/1.png');
  background-size: cover;
  border: 1px dashed #000;
}
.Upload>.uploadImg:nth-child(2)  .el-upload--picture-card{
  background-image:url('/static/images/2.png');
  background-size: cover;
  border: 1px dashed #000;
}
.uploadImg  .el-upload--picture-card,.uploadImg.StationPhoto .el-upload--picture-card{
  width: 220/50rem;
  height: 220/50rem;
  line-height: 200/50rem;
}
.el-upload.el-upload--picture-card  i.el-icon-plus{
  line-height: 200/50rem;
  color: #000;
  
}
.el-upload.el-upload--picture-card  i.el-icon-plus::before{
  font-size: 100/50rem;
}
.el-upload-list.el-upload-list--picture-card  .el-upload-list__item{
  width: 220/50rem;
  height: 220/50rem;
  margin:0 20/50rem 20/50rem 0;
}
.el-upload-list--picture-card .el-upload-list__item:nth-child(3),.el-upload-list--picture-card .el-upload-list__item:nth-child(6){
  margin:0 0 20/50rem 0;
}
.el-upload-list--picture-card>li{
  float: left;
}
.el-upload-list__item.is-ready  .el-upload-list__item-actions{
  opacity:1;
}
.el-upload-list--picture-card .el-upload-list__item-actions span.el-upload-list__item-preview,.el-upload-list--picture-card .el-upload-list__item-actions span.el-upload-list__item-delete{
  display: inline-block;
}
//上传图片样式 结束

//日期时间选择器样式 开始

//日期选择器样式 开始
// .el-input__inner{
//   height: 60/50rem;
//   line-height: 60/50rem;
//   width: 400/50rem;
// }
//日期选择器 错误按钮定位
.el-input__suffix{
  // right: 100/50rem;
  font-size: 40/50rem;
}
//日期选择器样式 结束
.el-date-editor.el-input,.el-date-editor.el-input.el-input--small.el-input--prefix.el-input--suffix.el-date-editor--datetime .el-input__inner{
  float: left;
  width: 555/50rem;
}
.el-input--small .el-input__inner{
  height: 52/50rem;
  line-height: 52/50rem;
  border-radius:50px;
}
.el-input--small .el-input__icon{
  line-height: 52/50rem;
}
//时间选择器定位
.el-time-panel.el-popper{
  left: -300/50rem;
}
//日期时间选择器上下月上下年按钮样式
.el-picker-panel__icon-btn{
  font-size: 50/50rem;
  width: 60/50rem;
}

//日期时间选择器样式 结束


//element 提示框 样式 开始
.el-message-box__wrapper .el-message-box{
  width:600/50rem;
}
.el-message-box__headerbtn{
  display: none;
}

</style>

import Vue from 'vue'
import Router from 'vue-router'

// ——————————————————————————————————————基础功能——————————————————————————————————————————
// 登录
import Login from '@/pages/Login/Login'  //登录
import Reg from '@/pages/Login/reg'  //注册
import ForgotPwd from '@/pages/Login/forgotPwd'  //忘记密码
import Identifying from '@/pages/Login/identifying'  //验证手机号


// 帐号与第三方关联
import Binding from "@/pages/Login/Binding" // 微信openid关联到帐号


// ——————————————————————————————————————首页——————————————————————————————————————————

// 首页
import Index from "@/pages/Index/Index"

// ——————————————————————————————————————任务——————————————————————————————————————————

//***********当前任务***********

// @/pages/Waybill

//任务
import Waybill from '@/pages/Waybill/Waybill'  //我的任务首页
import LoadingAppoint from '@/pages/Waybill/LoadingAppoint'  //装货预约 
import UnloadAppoint from '@/pages/Waybill/UnloadAppoint'  //卸货预约 
import WayFeedback from '@/pages/Waybill/WayFeedback'  //途中反馈
import DepartureConfirm from '@/pages/Waybill/DepartureConfirm'  //发车确认
import ArrivalConfirm from '@/pages/Waybill/ArrivalConfirm'  //到达确认

// @/pages/Waybill/WaybillInfo

// 配载单信息
import WaybillInfo from '@/pages/Waybill/WaybillInfo/WaybillInfo'  //配载单信息
import SelectAddress from '@/pages/Waybill/WaybillInfo/SelectAddress'  //选择地址


// @/pages/Waybill/WaybillInfo/Deliver

//我的任务模块  交付
import OrderDetails from '@/pages/Waybill/WaybillInfo/Deliver/OrderDetails'  //按地址交付
import orderDeliver from '@/pages/Waybill/WaybillInfo/Deliver/orderDeliver'  //订单交付
import QRCode from '@/pages/Waybill/WaybillInfo/Deliver/ewm'  //二维码页面

//***********历史任务***********

// @/pages/historyList

// 历史任务
import historyList from '@/pages/historyList/historyList'  //历史任务首页
import WaybillDetail from '@/pages/historyList/WaybillDetail/WaybillDetail'  //运单详情
import CheckDeliverPicture from '@/pages/historyList/WaybillDetail/CheckDeliverPicture'  //查看交付照片


// 搜索
import Search from '@/pages/search'

// ——————————————————————————————————————报表——————————————————————————————————————————

// 报表
import ReportForms from "@/pages/ReportForms/ReportForms"


// ——————————————————————————————————————货源——————————————————————————————————————————

// 货源
import goodsSource from "@/pages/goodsSource/goodsSource"
import sourceDetail from "@/pages/goodsSource/sourceDetail"


// ——————————————————————————————————————车源——————————————————————————————————————————

// 车源
import carSourceList from "@/pages/carSource/carSourceList"


// ——————————————————————————————————————发货——————————————————————————————————————————

// 发货
import publishGoods from "@/pages/publishGoods/publishGoods"
import pg_publish from "@/pages/publishGoods/pg_publish"
import SendLnglat from "@/pages/publishGoods/SendLnglat"


// ——————————————————————————————————————个人——————————————————————————————————————————

// 个人中心
import HomeIndex from '@/pages/home/home'  //个人中心首页
import HistoricalTrack from '@/pages/home/HistoricalTrack'  //历史轨迹
import PersonalData from '@/pages/home/PersonalData'  //个人资料
import RePassword from '@/pages/home/RePassword'  //修改密码
import od_bid from '@/pages/home/order/od_bid'  // 我的订单
import MyPublish from '@/pages/home/MyPublish'  //我的发布 
import PublishList from '@/pages/home/PublishList'  //车源列表
import ToEvaluate from '@/pages/home/ToEvaluate'  //评价
import UserIntroduction from '@/pages/home/UserIntroduction'  //货主/司机简介



Vue.use(Router)

export default new Router({
  routes: [
    // 登录
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    // 帐号与第三方关联
    {
      path: '/Binding',
      name: 'Binding',
      component: Binding
    },
    {
      path: '/Reg',
      name: 'Reg',
      component: Reg
    },
    {
      path: '/ForgotPwd',
      name: 'ForgotPwd',
      component: ForgotPwd
    },
    {
      path: '/Identifying',
      name: 'Identifying',
      component: Identifying
    },
    // 搜索
    {
      path: '/Search',
      name: 'Search',
      component: Search
    },
    // 首页
    {
      path: '/Index',
      name: 'Index',
      component: Index
    },
    // 我的任务
    {
      path: '/Waybill',
      name: 'Waybill',
      component: Waybill
    },
    {
      path: '/LoadingAppoint',
      name: 'LoadingAppoint',
      component: LoadingAppoint
    },
    {
      path: '/UnloadAppoint',
      name: 'UnloadAppoint',
      component: UnloadAppoint
    },
    {
      path: '/WayFeedback',
      name: 'WayFeedback',
      component: WayFeedback
    },
    {
      path: '/DepartureConfirm',
      name: 'DepartureConfirm',
      component: DepartureConfirm
    },
    {
      path: '/WaybillInfo',
      name: 'WaybillInfo',
      component: WaybillInfo
    },
    {
      path: '/SelectAddress',
      name: 'SelectAddress',
      component: SelectAddress
    },
    {
      path: '/ArrivalConfirm',
      name: 'ArrivalConfirm',
      component: ArrivalConfirm
    },
    {
      path: '/WaybillDetail',
      name: 'WaybillDetail',
      component: WaybillDetail
    },
    {
      path: '/CheckDeliverPicture',
      name: 'CheckDeliverPicture',
      component: CheckDeliverPicture
    },
    //我的任务模块  交付
    {
      path: '/OrderDetails',
      name: 'OrderDetails',
      component: OrderDetails
    },
    {
      path: '/orderDeliver',
      name: 'orderDeliver',
      component: orderDeliver
    },
    {
      path: '/QRCode',
      name: 'QRCode',
      component: QRCode
    },
    {
      path: '/ReportForms',
      name: 'ReportForms',
      component: ReportForms
    },
    //货源
    {
      path: '/goodsSource',
      name: 'goodsSource',
      component: goodsSource
    },
    //货源详情
    {
      path: '/sourceDetail',
      name: 'sourceDetail',
      component: sourceDetail
    },
     //车源
    {
      path: '/carSourceList',
      name: 'carSourceList',
      component: carSourceList
    },

    // 历史任务
    {
      path: '/historyList',
      name: 'historyList',
      component: historyList
    },
    // 个人中心
    {
      path: '/HomeIndex',
      name: 'HomeIndex',
      component: HomeIndex
    },
    // 历史轨迹
    {
      path: '/HistoricalTrack',
      name: 'HistoricalTrack',
      component: HistoricalTrack
    },
    // 个人资料
    {
      path: '/PersonalData',
      name: 'PersonalData',
      component: PersonalData
    },
    // 修改密码
    {
      path: '/RePassword',
      name: 'RePassword',
      component: RePassword
    },
     // 我的发布（车源）
    {
      path: '/MyPublish',
      name: 'MyPublish',
      component: MyPublish
    },
    // 车源列表
    {
      path: '/PublishList',
      name: 'PublishList',
      component: PublishList
    },
    // 竞价中
    {
      path: '/od_bid',
      name: 'od_bid',
      component: od_bid
    },
    // 发货
    {
      path: '/publishGoods',
      name: 'publishGoods',
      component: publishGoods
    },
    // 发货
    {
      path: '/pg_publish',
      name: 'pg_publish',
      component: pg_publish
    },
    // 发送位置
    {
      path: '/SendLnglat',
      name: 'SendLnglat',
      component: SendLnglat
    },
    // 评价
    {
      path: '/ToEvaluate',
      name: 'ToEvaluate',
      component: ToEvaluate
    },
    // 货主/司机简介
    {
      path: '/UserIntroduction',
      name: 'UserIntroduction',
      component: UserIntroduction
    },
  ]
})

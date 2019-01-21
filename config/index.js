'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
        "/api":{
            //目标：指向的网络地址
            target: 'http://zwlttest.3322.org:8090/tmsApp/',
            // target: 'http://119.23.153.97:80/tms-sx/app/',
            //webpack的属性，映射一个host
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        },
        "/login":{
            //目标：指向的网络地址
            target: 'http://192.168.1.43:8082/wms/',//内网
            // target: 'http://120.237.87.102:8082/wms/',//外网
            //webpack的属性，映射一个host
            changeOrigin: true,
            pathRewrite: {
                '^/login': ''
            }
        },
        "/BaiDuMap":{
            //目标：指向的网络地址
            target: 'http://api.map.baidu.com/geocoder/v2/',
            //webpack的属性，映射一个host
            changeOrigin: true,
            pathRewrite: {
                '^/BaiDuMap': ''
            }
        },
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8082, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: '',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}

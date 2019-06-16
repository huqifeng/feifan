module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/new/' : '/',
  devServer: {
    proxy: 'http://pengfei.feelfine.local'
    // proxy: 'http://dengran.feelfine.local'
    // proxy: 'http://kt.feelfine.local'
    // proxy: 'http://pengfei.feelfine.local:81'
  }
  // configureWebpack: config => {
  //   // 用cdn方式引入
  //   config.externals = {
  //     vue: 'Vue',
  //     'vue-router': 'VueRouter',
  //     'element-ui': 'ELEMENT'
  //   }
  // }
}

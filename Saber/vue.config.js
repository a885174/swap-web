module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
    entry
      .add('@/mock')
      .end()
  },
  devServer: {
    // 端口配置
    port: 1888,
    disableHostCheck:true,
    // 反向代理配置
    proxy: {
      '/api': {
        target: 'http://47.112.171.131/',
        changeOrigin: true,                     
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}

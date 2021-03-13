// const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  // configureWebpack: {
  //   plugins: [
  //     // Ignore all locale files of moment.js
  //     new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  //     new UglifyJsPlugin({
  //       uglifyOptions: {
  //         compress: {
  //           drop_debugger: true,
  //           drop_console: true
  //         }
  //       },
  //       sourceMap: false,
  //       parallel: true
  //     }),
  //     // 配置compression-webpack-plugin压缩
  //     new CompressionWebpackPlugin({
  //       algorithm: "gzip",
  //       test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
  //       threshold: 10240,
  //       minRatio: 0.8
  //     })
  //   ]
  // },
  chainWebpack: config => {
    // 生产环境，开启js\css压缩
    if (process.env.NODE_ENV === "production") {
      config.plugin("compressionPlugin").use(
        new CompressionPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.js$|\.html$/,
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: true
        })
      );
    }
    //忽略的打包文件
    config.externals({
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      "element-ui": "ELEMENT"
    });
    const entry = config.entry("app");
    entry.add("babel-polyfill").end();
    entry.add("classlist-polyfill").end();
    entry.add("@/mock").end();
  },
  devServer: {
    // 端口配置
    port: 1888,
    disableHostCheck: true,
    // 反向代理配置
    proxy: {
      "/api": {
        target: "http://localhost",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "/"
        }
      }
    }
  }
};

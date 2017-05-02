// 配置静态资源路径
// 生成cssLoaders用于加载.vue文件中的样式
// 生成styleLoaders用于加载不在.vue文件中的单独存在的样式文件
// vue-loader.conf则只配置了css加载器以及编译css之后自动添加前缀。

var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  // css加载器
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  })


  // 编译css之后自动添加前缀
  // postcss: [
  //   require('autoprefixer')({
  //     browsers: ['last 2 versions']
  //   })
  // ]
};

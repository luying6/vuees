// 执行”npm run build”的时候首先执行的是build/build.js文件


// loading动画
// 删除创建目标文件夹
// webpack编译
// 输出信息
// 说明： webpack编译之后会输出到配置里面指定的目标文件夹；删除目标文件夹之后再创建是为了去除旧的内容，以免产生不可预测的影响。



// 检查NodeJS和npm的版本
require('./check-versions')()
process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')

// 用于在控制台输出带颜色字体的插件
var chalk = require('chalk')

var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()// 开启loading动画

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err

  // webpack编译
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()// 停止loading动画
    if (err) throw err

    // 没有出错则输出相关信息
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})

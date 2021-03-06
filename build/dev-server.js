// https://juejin.im/post/584e48b2ac502e006c74a120
// 检查node和npm的版本
// 引入相关插件和配置
// 创建express服务器和webpack编译器
// 配置开发中间件（webpack-dev-middleware）和热重载中间件（webpack-hot-middleware）
// 挂载代理服务和中间件
// 配置静态资源
// 启动服务器监听特定端口（8080）
// 自动打开浏览器并打开特定网址（localhost:8080）
// 说明： express服务器提供静态文件服务，不过它还使用了http-proxy-middleware，一个http请求代理的中间件。前端开发过程中需要使用到后台的API的话，可以通过配置proxyTable来将相应的后台请求代理到专用的API服务器。


// 检查node.js和npm版本
require('./check-versions')();

// 获取 config/index.js 的默认配置
var config = require('../config');
// 如果Node的环境变量中没有设置当前的环境(NODE_ENV),则使用config中的配置当做当前环境的配置
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

//一个可以调用默认软件打开网址、图片、文件等内容的插件
//这里用它来调用默认浏览器打开dev-server监听的端口，例如:localhost:8080
var opn = require('opn');
// 使用 NodeJS 自带的文件路径工具
var path = require('path');
// 使用 express
var express = require('express');
// 使用 webpack
var webpack = require('webpack');

//一个express中间件，用于将http请求代理到其他服务器
//例：localhost:8080/api/xxx --》 localhost:3000/api/xxx;
//这里使用该插件可以将前端开发中涉及到的请求代理到api服务器上，方便与服务器对接
// 在config/index.js中可以对proxyTable想进行配置
var proxyMiddleware = require('http-proxy-middleware');

//根据Node环境引入相应的webpack配置
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf');

//dev-server监听的端口，默认为config.dev.port设置的端口,即8080
// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port;

//用于判断是否要自动打开浏览器的布尔变量，当配置文件中没有设置自动打开浏览器的时候其值为false
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser;

//定义HTTP代理，代理到API服务器
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable;

//创建1个express实例
var app = express();

//根据webpack配置文件创建Compiler对象
var compiler = webpack(webpackConfig);

//webpack-dev-middleware使用compiler对象来对响应的文件进行编译和绑定
//编译绑定后将得到的产物存放在内存中而没有写进磁盘
//将这个中间件交给express使用之后即可访问这些编译后的产品文件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

//webpack-hot-middleware,用于实现热重载功能的中间件
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
});

//当html-webpack-plugin提交之后通过热重载中间件发布重载动作使得页面重载
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' });
    cb()
  })
});


// 将 proxyTable 中的代理请求配置挂在到express服务器上
// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context];
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})


// 重定向不存在的URL，常用于SPA
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());


// 使用webpack开发中间件
// 即将webpack编译后输出到内存中的文件资源挂到express服务器上
// serve webpack bundle output
app.use(devMiddleware);


// 将热重载中间件挂在到express服务器上
// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);


// 静态资源的路径
// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
// 将静态资源挂到express服务器上
app.use(staticPath, express.static('./static'));

// 应用的地址信息，例如：http://localhost:8080
var uri = 'http://localhost:' + port;

var _resolve;
var readyPromise = new Promise(resolve => {
  _resolve = resolve
});

console.log('> Starting dev server...');
// webpack开发中间件合法（valid）之后输出提示语到控制台，表明服务器已启动
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n');

  // 如果符合自动打开浏览器的条件，则通过opn插件调用系统默认浏览器打开对应的地址uri
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
});



// 启动express服务器并监听相应的端口（8080）
var server = app.listen(port);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
};

---
title: React与Express项目前后端一体化实战
date: 2017-05-11 14:03:00
---

在之前的造轮子的过程中，前后端分离开来写实在蛋疼，所以最近决定研究并折腾一下前后端工程一体化。

在这样的实时的环境中，最重要的是做好前后端之间的协调作用，说白了，也就是路径规划问题与热刷新问题。

在我的项目中，我选择开发和生产的环境的加载代码制作两份，只有模板，中间件什么的代码的通用。(网上推崇使用env变量来加载热更新组件，但是本人并不推崇全部使用env)

主要就是分析几项内容，除了工程的路径规划，一是开发代码(app.js)，二是生产代码(server.js)，最后还有模板引擎的调整

<!--more-->

首先是路径规划问题，两个甚至更多工程的合并，我们必须得把路径规划好

举个栗子（窝的）我选择把express脚手架生成的大部分文件放到server文件夹里，外面只留启动文件（相信熟悉express的同学一眼就能看出），前端react的代码放置到client里。启动代码在bin里
```bash
.
├── app.js
├── bin
│   ├── dev.js
│   └── server.js
├── client
│   ├── index.js
│   └── public
├── node_modules
├── package.json
├── server
│   ├── info
│   ├── public
│   ├── routes
│   └── views
├── server.js
├── webpack.dev.config.js
└── webpack.production.config.js
```

启动脚本
```json
"scripts": {
    "start": "cross-env NODE_ENV=production node ./bin/server.js",
    "dev": "cross-env NODE_ENV=dev node ./bin/dev.js",
    "bulid": "NODE_ENV=production webpack -p --config webpack.production.config.js"
  }
```




### 开发代码

在开发中，我们需要调用webpackDevMiddleware和webpackHotMiddleware两套东西，当然，为了不发生找不到组件的尴尬情况，我们还是把大部分依赖装上吧,同样生产版本也需要用到一些组件。
```
npm install --save-dev chunk-manifest-webpack-plugin cross-env html-webpack-plugin webpack-chunk-hash webpack-dev-middleware webpack-dev-server webpack-hot-middleware webpack-manifest-plugin
```
在开发代码中，我们先使用cross-env设为dev，然后我们在开发版本的启动入口js里加入

 注意 ：需要在app定义后就要引入

```javascript
// 设置环境变量
app.locals.env = process.env.NODE_ENV || 'dev';

// 热加载功能导入
var webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpackDevConfig = require('./webpack.dev.config.js'); // 你自己创建的适用于开发版本的webpack配置。具体写法之后会说明
var compiler = webpack(webpackDevConfig);

// 热加载功能挂载部分,里面的配置来自
app.use(webpackDevMiddleware(compiler, {

    // public path should be the same with webpack config
    publicPath: webpackDevConfig.output.publicPath,
    noInfo: true,
    stats: {
        colors: true
    }
}));

app.use(webpackHotMiddleware(compiler));
```

在最后module.exports前加入重启相关代码。
```javascript
var http = require('http');
var reload = require('reload');
var server = http.createServer(app);
reload(server, app);
```
<del>我很担心这会增加很多占用</del>

这样，在express里的内容就完了,模板引擎的调整我们放到最后讲。



接下来我们讲讲webpack.dev.config.js开发配置的问题,直接贴23333333。

```javascript
var webpack = require('webpack');
var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

var publicPath = 'http://127.0.0.1:3000/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'; //加载热跟新中间件

var config = {
  entry: [ hotMiddlewareScript, './client/index.js'], //使用热更新功能
  output: {
    path: path.resolve(__dirname, './server/public/static/js/'),
    filename: 'bundle.js',
    publicPath: publicPath
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader','css-loader' ]
      }
    ]
  },
  /* 创建热更新热加载组件 */
  plugins: [
        // new webpack.optimize.OccurenceOrderPlugin(), //用webpack1.0版本时才需要
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};

module.exports = config;

```

这时候，大部分已经完成了，如果你急着试试，可以看文章最后有关模板引擎的内容，就可以启动你的开发版本的app.js，功能都得到了保留，webpack打包信息和express的信息都会console出来。


---


### 生产代码

生产代码的express入口不需要怎么改动，只需设置下环境变量即可
```javascript
app.locals.env = process.env.NODE_ENV || 'production';
```

重要的是webpack的配置文件，我在这里使用的是 webpack.production.config.js

在这里，最关键的一点是，如何把打包出来的带hash值的js的文件名传进后端模板中，这时我们需要webpack-manifest-plugin这个东西，

网上使用的很多推荐直接用inlineManifest去载入进ejs，但实际上非常不符合需求，webpack需要随时开启着，也不好用。直接贴代码

```javascript
var path = require('path');
var webpack = require("webpack");
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var ManifestPlugin = require('webpack-manifest-plugin');

var config = {
  entry: {
    main: path.resolve(__dirname, 'client/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'server/public/static/js'),
    filename: '[name].[chunkhash:16].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      },
      {
        test: /\.css$/, // Only .css files
        exclude: /node_modules/,
        use: ['style-loader','css-loader' ]
      }
    ]
  },
  plugins:[
    new ManifestPlugin({
      fileName: 'my-manifest.json'
    })
  ]
};

module.exports = config;
```

这里会在打包出的js同目录下生成一个json，记录了文件名。

所以这时候，我们就可以去express中间件里写功能去提取文件名，<del>这里我遇到了非常大的坑，虽然解决了，但都不好意思说出来</del>，然后呢，用了非常粗暴的方法...

```javascript
var mymanifest = require("../public/static/js/my-manifest");
var exportFileName = mymanifest["main.js"];
var filestring = '<script src="/static/js/' + exportFileName + '"></script>'
```
中间件改造完成，可以直接render进模板了

---

### 模板部分


简单粗暴orz
``` html
<% if (env !== "production" ) { %>
  <script src="/bundle.js"></script>
<% } else { %>
  <%- jsfile %> <!-- jsfile是从render传过来的值“-”是为了防止被转译 -->
<% } %>
```

这时候，run一下build，webpack打包出东西，再start，就是标准生产的服务状态

---

#### 参考文章

[http://acgtofe.com/posts/2016/02/full-live-reload-for-express-with-webpack](http://acgtofe.com/posts/2016/02/full-live-reload-for-express-with-webpack)
[https://doc.webpack-china.org/guides/caching/](https://doc.webpack-china.org/guides/caching/)

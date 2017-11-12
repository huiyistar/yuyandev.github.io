---
title: 使用React，GithubAPI，Hexo，Travis-CI构建一个属于自己的博客
date: 2017-11-08 21:34:00
---

的确现在的博客就是基于这个思路打造的。纯粹的restful+单页应用的风格。


首先的Hexo部分，hexo本来是通过生成一个个目录的然后加入index.html实现的文章路径，得益于“hexo-generator-json-content”这个插件，它可以把所有文章信息，构造为一个json。这个json后面上传到github上便成为了最主要的api。

至于原来的目录，出于seo优化的需要，我们在`page.ejs`等模板上做一个重定向`/post/postname` ->`/#!/post/postname`


Travis-CI方面，主要是根据GihubAPI的特点，满足我们懒人的需要，只需要朝gitpage的一个分支上上传markdown，Travis-CI就会给我们自动部署发布到主分支上。我们hexo生成上传的东西也需要做些优化，毕竟，我们要的只是那个`content.json`和其他一些东西。


Github方面，不说了，就提供文件储存还有API。


关于React，接下来继续说

<!--more-->

--- 

React的路由，我规划了如下路由

 + `/article/:Id`我们不可能把所有文章和他们的节选全部放一个页面里，这样访问体验极差。所以我们需要个文章列表分页功能。
 + `/post/:post`文章内容
 + `/page/:staticPage`一些关于，友情链接等等的页面
 + `/`首页就直接跳转至`/article/1`

样式你可以选择各种各样的前端框架，不过请注意不要选择是使用jQuery操作DOM的框架。

##### article页面
由于React-Router4的传值操作体验极差，所以博主并没有使用它提供的api，而是使用了原生的方式来获取id值（PS：在web开发上博主非常建议使用React-Router2，RN可能还是4比较好）
在提取到id值后，我们统计一下文章数，并计算出5文章一页需要多少页面可以把文章塞完。然后将content.json遍历一遍，曲线救国按顺序再构造出当页的结构。最后存入state给render渲染

##### post和staticPage 
理由同上，原生获取id，然后发起fetch请求抓取github的api，获得json和content数据，github的markdown比较特殊，进行了非标准的base64加密，我们需要多次转码，并使用正则替代来同时兼容hexo能读取的markdown
``` javascript
function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}
async function fetchAsyncPostMarkdown () {
  let response = await fetch(`https://api.github.com/repos/${GITHUBNAME}/${GITHUBREPO}/contents/source/_posts/${path}.md?ref=master`);  
  let data = await response.json();
  return data;
}
fetchAsyncPostMarkdown()
.then(data => {
  var Content = marked(b64_to_utf8(utf8_to_b64(b64_to_utf8(data.content))).replace(/---\ntitle:/g,'### ').replace(/date:/g,'\n##### '))  
;})
.catch(reason => console.log(reason.message))
```

其他的也就加了些工具库。

感受就是，状态数据管理很重要，好好看文档orz
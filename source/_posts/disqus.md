---
title: Typecho部署调用Disqus评论系统
id: 14
categories:
  - 黑科技
date: 2015-07-12 13:22:00
tags:
---

<!--markdown-->在日常博客千反田建立以后，[Trii Hsia][1]吐槽道没有评论系统，日常博客没有评论系统的确不够欢乐，看小伙伴们都在用Disqus。不如就来部署一个吧。
①注册一个disqus账号。
②在sitting选项里有个Add Disqus To Site，他会提示注册一个disqus.com的二级域名，注册即可。
③进入二级域名站点，进入sittings，在点击install，这时我们选择Universal Code(通用代码)。将第一块代码复制，并把Typecho主题文件夹下comments.php里的内容替换掉即可(事先请备份)。查看你的站点你就会发现评论模块变了
④个人优化，例：调用中文，评论设置(自己看着办吧)
PS:由于[https://chitanda.org][2]用的主题的血统不正，page.php里的内容一头雾水，强加的评论模块放在哪个位置都无法调用，无奈放入footer.php里，导致整站都可以评论，不过也没什么不好 ∑(O_O；)
另外用五分钟把Chitanda.org部署上了SSL。这个是必须的！
但Alleysakura.com并未启用，作为一个技术性站点，评论不打算使用第三方系统，数据本地储存，应该有个技术站该有的样子
`目前https://chitanda.org已安装正统ghost`

  [1]: http://hsia.in
  [2]: https://chitanda.org
  <!--more-->

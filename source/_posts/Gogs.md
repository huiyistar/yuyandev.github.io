---
title: Gogs:一个不错的GitWeb服务器
date: 2016-07-13 23:24:00
---
![](/img/gogs.png)
网址 ：[htttps://gogs.io](https://gogs.io)
Gogs作为一个Git服务器，就目前来说已经足够成熟了。它简单易用，极少的bug，所以特别适合小公司及个人使用。
相比较Gitlab来说，这个更加轻量，所以我们可以使用树莓派，废旧电脑，或者一台不低于512mb内存的vps上搭一个

相关安装文档官网已经写得非常清楚了，第三方的教程中，这有一篇比较优质的[https://mynook.info/blog/post/host-your-own-git-server-using-gogs](https://mynook.info/blog/post/host-your-own-git-server-using-gogs)
<div class="tip">
在vps等机器跑gogs，需要我们使用screen或者tmux等工具来守护这个进程。
</div>

接下来是博主脑洞大开，想出的对于gogs的一些实验性(<del>作死</del>)玩法。

<!--more-->

1.开启目录浏览
gogs吧git仓库挂在了一个文件夹上，于是，如果我们用nginx把某网址指向了git仓库目录，并开启目录浏览，更改时间等，直接点击即可下载/浏览，会提高各种效率（许多时候比git工作方式还高）
另外，对于内网中小伙伴们之间分享文件也是非常方便的。

2.在线搜索
github上有许多优秀文档搜索工具（可以精确的文章内的文字的），大部分是nodejs写的，如果我们把这个工具绑上一个网址，把目录指向git仓库，这样，就实现类似github那样项目内搜索功能。

最后的观点，个人用的话，是没有必要安装类似项目的，一个git-server + nginx足够了

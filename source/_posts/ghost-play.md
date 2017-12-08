---
title: 'ghost博客新玩法&迁移,备份教程'
id: 38
date: 2015-10-25 00:20:00
tags:
---

告别反人类的forever吧

前几天把千反田迁去了搬瓦工……搬迁时出了很多问题。现在总结一下如何搬迁……
<!--more-->
搬迁前的准备：
首先，你得停掉ghost，如果是forever的话 `forever stop index.js`
ghost博客的数据存放在./`content/data`里，先把这两个文件拷走，然后再把themes文件拷走，image也一样，然后把上面拷走的文件打包。
把打好包的文件sftp到目标服务器，假设IP为233.233.233.233压缩包为kotori.zip的话
```
sftp root@233.233.233.233
put ./kotori.zip /root/
bye
```
好了，在新服务器上的姿势。安装nodejs，安装ghost……官方文档已经说的很清楚了：[nodejs安装][1] [ghost安装][2] 挑喜欢的版本安装

在`npm install --production`
后，`不要急着npm start`
把之前打好包的文件恢复到原位
然后npm start `注意：任何备份/恢复不完全都可能导致500` 访问正常
或许这时候你会使用forever然而问题来了，变成了一个新的博客，什么也没有？！？退出forever，用npm start启动，又正常了……

这时候，引入一个好玩的东西，screen。
这是Linux下一个好用的后台处理程序，通常ssh登陆后不久即掉线，相应进程会终止，而screen就骗过ssh，保持会话
安装
```
yum install screen
screen -S ghost
npm start
```
让这个会话后台运行`Ctrl+a d`
这时你可以关掉putty窗口了

下次登入时
```
screen -r ghost
```
回到之前screen会话，会看到一堆请求更改信息orz。
至于性能，以及会不会导致内存和swap爆满还有待测试。
目前效果不错

  [1]: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
  [2]: http://docs.ghostchina.com/zh/installation/linux/

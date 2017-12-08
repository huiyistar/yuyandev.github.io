---
title: Sphider搜索引擎的安装及Bug修复
date: 2016-06-22 21:45:00
---
Sphider呢，是一个极其简单易上手的搜索引擎，相比起Nutch之类的JAVA搜索引擎来说，降低了普通站长的使用难度，同时节省了对于机器的开销！
虽然这个搜索引擎比较简陋（尤其前端23333）各种bug，以及万年不更新（大雾）等等，但我还是选择了它
[地址:http://www.sphider.eu/](http://www.sphider.eu/)
别问为什么，你去GitHub上看看就知道，不得不承认，上面有些源码写得的确好，但却没告诉我怎么用QAQ！！
有些是解析json的，有些干脆把json当数据库用，有些还要重新编译php加入额外分词组件 etc.

好了以开始正题，如何去折腾这样一个搜索引擎~
首先，作者提供的Installation已经无法使用 [http://www.sphider.eu/docs.php#installation](http://www.sphider.eu/docs.php#installation)
所以我来做一个具体的安装文档（我的运行环境 Nginx-1.11.1(SSL ON) Mysql5.5 PHP5.5)

<!--more-->

1，下载源码并解压至网站根目录，并使用phpmyadmin创建一个新的数据库/用户

2， 如果你是Linux用户的话执行以下命令，将timestamp的时间字段值设为默认0   .. #居然调到14....
```
cd sql
sed "s/timestamp(14)/timestamp default 0/g" tables.sql
```
3，将修改好的sql导入至数据库里，进入settings里修改database.php配置数据库，进入auth.php里修改管理员用户名及密码（默认admin/admin）。


 至此配置基本完成，但还没完！

Sphider有严重的乱码问题，我们需要修改为默认UTF-8（这年头应该很少用GBK了吧）


1，先看看php.ini里写没写，一般在 /etc 或者 /usr/local/php/etc/下
```
grep -i 'default_charset' php.ini
```
如果没有
```
default_charset = "UTF-8"
```
则需要加上


2，在前面提到的database.php里
```
$success = mysql_select_db ($database);
```
后面加上
```
mysql_query("set names 'utf8'");
```
这里建议使用nano/vi编辑器，不要用sed/awk命令，与正则表达式有冲突。


3，在admin的spider.php里
```
$file = file_get_contents($url);
```
后面 换行 加上
```
$file=mb_convert_encoding($file,"UTF-8","gbk,gb2312,UTF-8");
```

另外Sphider不支持https站点，不过这个有多种方案可以解决：nginx报头识别，修改本地hosts，等等的方法都可以实现啦~

<!--more-->

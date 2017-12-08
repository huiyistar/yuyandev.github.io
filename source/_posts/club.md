---
title: 树莓派(RaspberryPi)搭建服务器集群，负载均衡
id: 16
date: 2015-08-14 14:35:00
tags:
---

树莓派的性能实在不行，做服务器时很卡，如果是服务器集群将会如何呢？

实验思路，一台2pi做负载均衡和后端，另外一台b+只做后端。
先更改固定IP
这里负载均衡使用nginx，后端采用Apache。
先安装后端，并更改端口，窝改为81，防止冲突，在httpd.conf的前半部分
把`Listen 80`改为`Listen 81`并重启机子，因为树莓派没法单独重启Apache
安装nginx
```
sudo apt-get install nginx
```
打开nginx配置文件nginx.conf/也有可能是default.conf。看实际情况配置
```
httpd {
    upstream 192.168.1.119 {
    server  192.168.1.120:80;
    server  192.168.1.119:80;  #负载目标，按需增加
    }
    }
    server{
	listen 80;
    server_name 192.168.1.119;
	location / {
		proxy_pass         http://127.0.0.1:81;   #反代Apache
		proxy_set_header   Host             $host;
		proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
		proxy_buffering off;  #禁用缓存，否则没效果，反而更慢
	}
	}
```
文件结束，重启机子，同时在b+上部署lamp。

最终效果不明显，依然卡，但由于未进行MySQL主从同步，内容不一致，由此看出负载均衡起效果了
<!--more-->

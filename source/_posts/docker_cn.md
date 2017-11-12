---
title: 在墙内部署docker镜像的正确姿势
date: 2017-03-21 22:22:00
---

#### 说换镜像什么的都是扯淡，根本无法好好使用。

本文将会告诉你在墙内部署docker应用的正确姿势。

#### 本文基于Ubuntu 16.04测试环境，大部分具有systemctl的系统都同样可行，适用于物理服务器和云服务器。

如果你的环境是aliyun ecs请前往`/etc/apt/source.list`里把所有mirrors.aliyuncs.com的镜像注释掉！

检查内核是否需要升级 `uname -a`查看，大于3.16即可。如果小于3.16，可以按照这篇教程换掉你的内核并提升你的服务器性能: [https://emiria.io/post/TCP-BBR/](https://emiria.io/post/TCP-BBR/)

#### 接下来是具体步骤。

<!--more-->

首先 `apt-get update`

安装screen：`apt-get install screen`
建立一个screen窗口：`screen -S installDocker`

然后，安装配置shadowsocks（没代理玩个鬼）
```
apt-get install python
apt-get install python-pip
pip install shadowsocks
```
在Ubuntu1604上，可能安装ss会报错：`locale.Error: unsupported locale setting`
输入`export LC_ALL=C `即可。

在方便的位置建立一个 ss.json并在里面根据实际情况填入
```
{
  "server": "11.22.33.44",
  "server_port": 40002,
  "local_port": 1080,
  "password": "123123123",
  "timeout": 600,
  "method": "aes-256-cfb"
}
```
启动shadowssocks
`sslocal -c ss.json -d start`
PS：如果机器重启后需要重新执行

我们需要一个工具来吧socks5代理转换为http代理>> polipo
```
apt-get install polipo
```

修改`/etc/polipo/config`
```
logSyslog = true
logFile = /var/log/polipo/polipo.log
proxyAddress = "0.0.0.0"
socksParentProxy = "127.0.0.1:1080"
socksProxyType = socks5
chunkHighMark = 50331648
objectHighMark = 16384
serverMaxSlots = 64
serverSlots = 16
serverSlots1 = 32
```

重启polipo：`/etc/init.d/polipo restart`

配置代理
```
export http_proxy="http://127.0.0.1:8123/"
export https_proxy="http://127.0.0.1:8123/"
```
### 注意：此方法只在当前tty下有效，重启或开启新的tty或者screen窗口后需要重新执行export配置，关闭`unset http_proxy `。

你可以使用 `curl myip.ipip.net`命令来校验代理是否开启成功。

这时，你可以愉悦的在全局代理下安装docker了
```
wget -qO- https://get.docker.io/ | sh
```
#### 关于docker的http代理

以下docker代理的配置文件摘自docker官网，亲测可行

```
mkdir -p /etc/systemd/system/docker.service.d
```
在`/etc/systemd/system/docker.service.d/http-proxy.conf`中写入
```
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:8123/"
```
然后
```
systemctl daemon-reload
systemctl restart docker
```
使用`systemctl show --property=Environment docker`来查看是否写入成功。

到此为止，应付大部分docker容器应该是够了！

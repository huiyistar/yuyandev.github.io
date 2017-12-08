---
title: Nginx+FCGI编译安装+TCL/C++/shell的学习/安装调教
date: 2017-07-01 23:32:15
---

FCGI虽然是上个世纪的东西，但是缺了还真不行。在FCGI的编译安装方面Google都无法找到相关笔记文档。在经历了一下午的折磨后，才安装上了。我觉得应该写成笔记，帮助更多人少走弯路。

FCGI存在与epel和Ubuntu等源里，因此，大多数设备都能无痛安装。

但由于我的是CentOS armv7版的操作系统，不可能使用epel源，由于FCGI缺乏维护，所以在编译过程中，走了很多弯路。

nginx的安装查看我的上一篇博客的nginx安装部分即可。

首先我们来搞清楚一下，CGI相关的原理，如何编写相关脚本，以及使用这套组合的意义。

<!--more-->
---

### CGI

通用网关接口（Common Gateway Interface/CGI）是一种重要的互联网技术，可以让一个客户端，从网页浏览器向执行在网络服务器上的程序请求数据。CGI描述了服务器和请求处理程序之间传输数据的一种标准。CGI 独立于任何语言的，CGI 程序可以用任何脚本语言或者是完全独立编程语言实现，只要这个语言可以在这个系统上运行。（Wikipedia）
所以理论上，任何可以使用终端命令行运行的程序都能通过一定改动来支援cgi。

我们很少看到直接的cgi，那是因为更多的web服务器软件都使用了一种更先进的cgi技术-FastCGI。
注意，这里是FastCGI只是作为一个扩展依赖，相当于开放了接口，是一种被动型的，并不能直接操纵。另外安装时需要加上参数编译进去。

##### 安装FCGI

快速通用网关接口（Fast Common Gateway Interface／FastCGI）是通用网关接口（CGI）的改进，描述了客户端和服务器程序之间传输数据的一种标准。FastCGI致力于减少Web服务器与CGI程式之间互动的开销，从而使服务器可以同时处理更多的Web请求。与为每个请求创建一个新的进程不同，FastCGI使用持续的进程来处理一连串的请求（Wikipedia）

请注意，这里的FCGI不同于perl-fcgi，php-cgi，这是一套完整的fcgi能够支援各种语言的FCGI及其cgi开发工具库。其对应的epel名称为fcgi-devel。

由于FCGI已经倒闭，所以你从各种博客上找到的教程叫你去官网下是不可能的。

但是，github上有份镜像下来的fastcgi官网镜像，尽管里面的源代码非常混乱，编译各种warning，但是好歹有了。这个一个是方便我们编写c/cpp的cgi程序，另外一个fcgiwrap也是依赖这个工具库的
``` bash
yum install autoconf automake libtool
wget https://github.com/FastCGI-Archives/FastCGI.com/raw/master/original_snapshot/fcgi-2.4.1-SNAP-0910052249.tar.gz
tar xvfz fcgi-2.4.1-SNAP-0910052249.tar.gz
cd fcgi-2.4.1-SNAP-0910052249
```
然后你需要修改`./include/fcgio.h`，在里面加入`#include <cstdio>`，这里是源代码的相关bug

``` bash
./configure --prefix=/usr/local/fcgi
make
make install
```

##### 下面的内容非常重要，一定要软链头文件和动态库。博主就是坑在这里，一直去调ldconfig，发现不能正确启用

``` bash
ln -s /usr/local/fcgi/lib/libfcgi.so.0 /usr/lib/
ln -s /usr/local/fcgi/lib/libfcgi.so /usr/lib/
ln -s /usr/local/fcgi/lib/libfcgi.so.0.0.0 /usr/lib/
ln -s /usr/local/fcgi/include/*.h /usr/include/
```
如果你需要c++相关的编译，也需要连接libfcgi++.so相关。


##### 安装FCGI相关扩展
为了能支持大部分脚本，我们需要安装fcgiwrap这个库。这个库安装依赖上面的FCGI开发套件
```
git clone https://github.com/gnosek/fcgiwrap.git
cd fcgiwrap
autoreconf -i
./configure
make
make install
ln -s fcgiwrap /usr/local/bin/
```

为了方便 操纵fcgiwrap，我们建立fcgiwrap的管理启动脚本`nano /etc/init.d/fcgiwrap`
``` perl
#!/usr/bin/perl

use strict;
use warnings FATAL => qw( all );

use IO::Socket::UNIX;

my $bin_path = '/usr/local/bin/fcgiwrap';
my $socket_path = $ARGV[0] || '/tmp/cgi.sock';
my $num_children = $ARGV[1] || 1;

close STDIN;

unlink $socket_path;
my $socket = IO::Socket::UNIX->new(
    Local => $socket_path,
    Listen => 100,
);

die "Cannot create socket at $socket_path: $!\n" unless $socket;

for (1 .. $num_children) {
    my $pid = fork;
    die "Cannot fork: $!" unless defined $pid;
    next if $pid;

    exec $bin_path;
    die "Failed to exec $bin_path: $!\n";
}
```

##### 安装FCGI管理器

在之前我们说了，nginx等软件知识被动接受FastCGI接口，所以，我们需要spawn-fcgi这个进程管理器
```
wget http://download.lighttpd.net/spawn-fcgi/releases-1.6.x/spawn-fcgi-1.6.4.tar.gz
tar -zxvf spawn-fcgi-1.6.4.tar.gz
cd spawn-fcgi-1.6.4
./configure
make
make install
```
执行`spawn-fcgi --help`验证安装情况，具体如何用过会儿再讲。

---

### CGI程序的编写，这里有几个不同语言的示例。

建议创建`/var/www/cgi/cgi-bin`目录，把写好的cgi脚本都放里面。
另外赋予相关权限`chown -R nginx:nginx /var/www/cgi-bin`

##### tcl语言
Tcl（发音tickle）是一种脚本语言。由John Ousterhout创建。TCL经常被用于快速原型开发 RAD、脚本编程、GUI编程和测试等方面。（Wikipedia）

这是测试的最好一种语言了，我们创建`test-tcl.cgi`
``` tcl
#!/usr/bin/tclsh

puts  "Content-type: text/html"
puts ""
puts  "This is a tcl cgi test script"
```

##### bash脚本

我们创建`test-bash.cgi`
``` bash
#!/bin/bash
echo -e "Content-type: text/html\n\n";
echo "<html>"
echo "<title>"
echo -e "cgi test\n"
echo "</title>"
echo "<body>"
echo -e "<p> This is a bash cgi test script</p>"
echo "</body>"
echo "</html>"
```

##### c语言

我们创建 `test-c.cpp`
``` c
#include <fcgi_stdio.h>
#include <stdlib.h>

int main(void)
{
    int count = 0;
    while (FCGI_Accept() >= 0)
        printf("Content-type: text/html\r\n"
        "\r\n"
        "<title>FastCGI Hello!</title>"
        "<h1>FastCGI Hello!</h1>"
        "Request number %d running on host <i>%s</i>\n",
        ++count, getenv("SERVER_NAME"));
    return 0;
}
```

然后`g++ test-c.cpp -o test-c.cgi –lfcgi`来编译你的c语言的cgi程序。

##### perl语言测试

我们创建 `test-perl.cgi`
``` perl
#!/usr/bin/perl

print "Content-type: text/html\n\n";
print "<html><head><title>cgi test</title></head>\n";
print "<body><p>This is a bash cgi test script<p></body></html>\n";
```

---

### 启动cgi工具以及nginx相关配置

使用spawn-fcgi来启动fcgiwrap。
当然，你也可以使用spawn-fcgi单独启动一个可执行的cgi程序
``` bash
#cgi交给fcgiwrap托管
spawn-fcgi -f /usr/local/sbin/fcgiwrap -p 5000
#单独启动单个cgi程序
spawn-fcgi -a 127.0.0.1 -p 5000 -f /var/www/cgi/cgi-bin/test-c.cgi
```

在nginx的配置 比如，匹配所有cgi后缀
``` nginx
location ~ .*\.cgi$ {
  root /var/www/cgi/;
  fastcgi_pass 127.0.0.1:5000;
  fastcgi_index index.cgi;
  include fastcgi.conf;
}
```
又比如，cgi-bin文件夹交个cgi处理
``` nginx
location /cgi-bin/ {
  root /var/www/cgi/;
  fastcgi_pass 127.0.0.1:5000;
  fastcgi_index index.cgi;
  include fastcgi.conf;
}
```

这个样更适用于c和cpp编写的cgi应用

---
<hr/>

### 为什么使用这套组合。

首先，这次实验的设备是armv7单片机，所以才会编译得吐血。
尽管FastCGI开销不小，但是在单片机这样的使用的场景下，效率绝对是比nginx+mysql/sqlite+php/node.js的效率要高很多的，特别是我们使用bash或者c语言来作为cgi相应的话，效率非常高。
另外，我们如果操作GPIO针脚，使用c语言，无论是易用性还是效率性能都要大大高于python的。

但是，本套配置文件在cgi响应请求方面还是有些问题，估计是nginx配置的锅，我也会继续折腾研究的

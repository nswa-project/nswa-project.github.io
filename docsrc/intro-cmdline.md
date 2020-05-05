# NSWA Ranga 用户官方命令行工具手册

## 获取 Ranga 命令行工具

### 安装类 Unix 系统版本

```bash
$ git clone https://github.com/nswa-project/ranga-client.git
$ cd ranga-client
$ sudo ./install.sh
```

`install.sh` 会自动检查所有命令行工具需要的系统依赖，如果你使用的系统是 Debian GNU/Linux，那么 `install.sh` 还会尝试通过 `apt` 命令自动安装他们。否则，你需要手动安装提示缺少的依赖软件。

`ranga-cli` 将会被安装到 `/usr/local/bin` 下面，请确认 `/usr/local/bin` 在你用户的 `PATH` 环境变量中。

ranga-cli 的 bash-completion 脚本将会安装到 `/usr/share/bash-completion/completions/` 下面。帮助你自动补全命令。

如果你使用实验性的用户安装选项，运行 `./install.sh --user`，命令行工具将安装到当前用户而不是系统，请确认 `${HOME}/.local/bin/` 在你用户的 `PATH` 环境变量中。用户安装无法使用 bash-completion 功能。

### 安装 MS-Windows 版本

前往 [这里](https://github.com/nswa-project/ranga-client/releases) 下载我们打包的 Windows 版本

Windows 版本是实验性的。 如果您遇到问题，请尝试在 msys2 或 cygwin 等在 Windows 上运行的 Unix 模拟器中安装 UNIX 版本的 ranga-client。

我们打包的 Windows 版本仅支持 64 位的 Windows 系统，如果你正在使用 32 位计算机，请尝试在 msys2 或 cygwin 等在 Windows 上运行的 Unix 模拟器中安装 UNIX 版本的 ranga-client。

- 文件路径格式：ranga-cli 是通过 MSYS2 移植到 Windows 的，因此自带一个微型的类 Unix shell 环境，路径名最好使用 Unix 格式。对 Windows 盘符会挂载到根文件系统的 `/盘符` 目录，例如 `C:` 逻辑卷被映射到 `/c`，以此类推。因此，如果你希望指定一个文件在 `D:\somedir\firmware.bin`，我们推荐的指示文件的方法是 `/d/somedir/firmware.bin`。作为补充，如果你一定要使用 Windows 格式路径，则正确的写法是 `D:\\somedir\\hosts.txt` 或者 `'D:\somedir\hosts.txt'` (两侧加上单引号抑制转义)，因为在 Unix shell 中 `\` 是转义字符，`\\` 代表一个反斜杠。

- 版本更新的滞后性：Windows 版本可能滞后于标准 Unix 版本一个或多个版本。

## 快速开始

对于拿到全新的 NSWA Ranga 系统设备，面对冗长的用户手册头疼？本节让你快速上手。本节举例如何设置原有接口的用户名密码以及如何对接口拨号。这里只是起到一个快速获得印象和成就感的作用，命令的具体原理请在下文中了解。

```bash
# 输入密码登录超级用户，默认密码为 ranga，输入不会回显
$ ranga-cli auth -p
Password:

# 接着我们设置原有接口 'netkeeper' 使用的用户名
$ ranga-cli config interface set netkeeper usrnam 178........

# 接着我们设置原有接口 'netkeeper' 使用的密码
$ ranga-cli config interface set netkeeper passwd 123123

# 接着我们将当前系统时间同步到 Ranga
$ ranga-cli action date `date +%s`

# 接着我们尝试对接口 'netkeeper' 拨号
$ ranga-cli action network dialup netkeeper
```

## Ranga 命令行工具用法

以不带参数运行 `ranga-cli` 将会展示命令用法

```bash
$ ranga-cli
ranga-cli - NSWA Ranga client version 0.1
Copyright (C) 2019 NSWA Ranga Maintainers.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>

This is free software; you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
If you have purchased a commercial license for the Ranga system,
This program which is published from original version has same warranty.

usage: ranga-cli [--debug] <command>

  config   - Dispatch to one of system config tools
  action   - Dispatch to one of system action invokers
  query    - Dispatch to one of infomation queriers
  auth     - Log in/out superuser
  addon    - Components and extensions
  swdeploy - Software deployment tool

to see more infomation about sub-command. run

  ranga-cli <command>

```

`ranga-cli` 的命令用法大致分为几类

- `action` 执行某个操作

- `config` 修改系统配置

- `query` 查询某个系统参数或状态

- `auth` 身份认证

- `addon` 管理系统组件（components）和扩展程序（extensions）

- `swdeploy` 执行 Ranga 软件部署。例如系统更新、部署新系统组件

其中，`action`、`config` 和 `query` 是有很多子目标组成的，例如 `config wireless` 将配置系统无线功能和设备

要查询当前系统具有的 `action`、`config` 和 `query` 有哪些子目标，不带子参数运行命令 `ranga-cli <section>` 即可，例如

```bash
$ ranga-cli action
$ ranga-cli config
$ ranga-cli query
```

将检查服务器支持哪些命令，如果你发现显示的命令不包含本文提到的命令，可能是你未将系统更新到最新版本，或者你正在看本文的历史版本。

### 调试参数

> 此小节可跳过

当你启用 `--debug` 选项时，`ranga-cli` 将显示调试信息，例如 [NSWA Ranga 数据交换协议](devman-proto.html) 的交互过程展示出来，例如

```bash
$ ranga-cli --debug config interface ls
Permission denied                   # 未登录时返回权限不足错误

$ ranga-cli --debug config interface ls
DEBUG: cgiAPI_POST: disp.sh
DEBUG: > section=config&target=interface&
DEBUG: < code: 3                    # 可以看到发送和返回的协议头和载荷
DEBUG: < content-type: dispOutput
Permission denied

$ ranga-cli --debug auth -p
Enter super password: 
DEBUG: cgiAPI: auth.sh
DEBUG: > --data-urlencode m=pw --data-urlencode pw=ranga
DEBUG: < code: 0
DEBUG: < content-type: authToken
DEBUG: < token-meta: v1;ascii64;octet
DEBUG: <<< db6fb7dfae4b9751bfdca22551ee1515648966a559bfb8cb289f3f8f610247c2
Login success

$ ranga-cli --debug config interface ls
DEBUG: cgiAPI_POST: disp.sh
DEBUG: > section=config&target=interface&
DEBUG: > USER_TOKEN=db6fb7dfae4b9751bfdca22551ee1515648966a559bfb8cb289f3f8f610247c2
DEBUG: < code: 0
DEBUG: < content-type: dispOutput
DEBUG: <<< netkeeper\nmda
netkeeper
mda

```

## 基本知识

### NSWA Ranga 系统错误代码

- **0 成功 Success**

	此提示意味着操作应该成功完成。

- **1 无效参数 Invalid argument**

	此提示意味着你们命令行参数语法不正确，或者参数值不合法（例如只允许整数的参数传入字符串）、过长或目标不存在。

- **2 功能未实现 Function not implemented**

	此提示意味着要访问的功能不在你的设备上可用，或者由于用于提供相关功能的附加组件没有安装。

- **3 拒绝访问 Permission denied**

	此提示意味着特权操作需要登录超级用户才能访问。也用于登录超级用户时认证失败。

- **4 内部错误 Internal fault**

	此提示意味着 NSWA Ranga 系统内部发生罕见的非预期错误。

- **5 资源暂时不可用 Resource temporarily unavailable**
- **6 操作将会阻塞 Operation would block**

	此提示意味着你正在执行一个非阻塞的调用，然而另一个线程正在临界区中运行。例如，NSWA Ranga 上，拨号是原子操作并且通常需要一定的时间完成，然而网络 API 接口却设计为非阻塞的，因此当两个人同时执行拨号时只有一个人（成功持有锁的）能开始拨号，另一个人将返回此错误。

- **7 I/O 错误 Input/output error**

	此提示意味着1) 网络请求失败、超时错误，2) 使用附加组件 API 时附加组件错误或不存在，或者3) 很罕见的向闪存读写数据失败。

- **8 设备或资源忙 Device or resource busy**

	此提示意味着某个设备或资源处于的状态无法满足前件。例如在已经建立连接的接口上再次执行连接指令。

### NSWA Ranga 原语

#### 接口

一个接口本质上是一个系统（软件或硬件）在两层协议之间构建的网络界面。

在 NSWA Ranga 中，我们可以简单的认为我们创建、配置的每个接口都是一个互联网连接，并配置一个协议。（目前支持 DHCP、静态地址、PPPoE、Netkeeper 等协议）

#### 无线网卡ID

在单网卡的设备上，您只有一个无线网卡，系统为其分配的无线网卡ID为 `0`。

在多网卡的设备上，通常是双频无线设备，系统为有的设备的 5GHz 设备分配 ID `0` 2.4GHz 设备分配 ID `1`，而有的设备则相反，因此，获取无线设备 ID 对应的标签（通常标签就是频率）是有必要的，在下面的内容中会对此有进一步说明。

#### 超级用户

超级用户即可以访问完整 NSWA Ranga 系统 API 的用户，即管理员用户。

默认情况下，匿名用户可以进行拨号和检查已经连接的接口，如果不希望匿名用户进行任何 Ranga 系统 API 访问，可以参考下文“配置-标志和杂项”节。

#### OTA 更新

（Over-The-Air）空中更新，是指用户自行通过网络安装更新，与 NSWA Ranga 的工厂升级不同，用户只需少量自主操作即可完成。(NSWA 4.9.x 开始 NSWA Ranga 不再推荐使用 OTA 更新，但仍然保留此功能)

参考下文的“NSWA Ranga 软件部署”节。

#### 流量控制

“服务质量”（QoS）等多种流量控制功能的集合。目的是通过对网络数据包进行排队、丢弃等操作提升整体网络质量。(NSWA 4.9.x 开始 NSWA Ranga 移除了流量控制功能)

#### 多宿主（Multihoming）

> 在之前版本的 NSWA 中被称为“多拨”（Multi-dial）（注意不是“多播”（Multicast）），因为容易引起歧义，NSWA Ranga 将其修改为“多宿主”（Multihoming）

NSWA Ranga 的 Multihoming 即在 WAN 口建立多个互联网连接，通过“网络负载均衡”（Network Load Balancing），使得带宽叠加。

NSWA Ranga 定义了“反向 VLAN”的概念，计算机网络上没有“反向 VLAN”的概念。从实际上看，站在交换机系统本身的角度，“正向”的、也就是真正意义上的 VLAN 是在交换机系统上使用单个接口，然后将单个接口映射到多个虚拟网络（一到多），那么“反向 VLAN” 的名字来源于相反的含义，它将多个虚拟网络映射到单一接口（多到一）。例如，NSWA 可以使用反向 VLAN 实现在单个 WAN 口上同时建立多条 PPPoE （或其他协议）连接的目的。

在 NSWA Ranga 上，多宿主（或者旧版本所说的的“多拨”）功能即指 “反向 VLAN”, 相关的防火墙功能支持, “网络负载均衡” 等一系列功能的集合。

但为了便于输入，API 名字为 "mwan" 而不是 "mhoming"

#### 附加组件（Addon）

NSWA Ranga 将`组件（Components）`和`扩展程序（Extensions）`统称为附加组件（Addon）。

组件（Components）是用于实现某些设备特定功能或者由于各种原因尚未合并或不会合并到主线 NSWA Ranga 源码树的程序，通常在构建时直接编译到固件。但也可以通过系统更新机制以 OTA 形式安装。每个的组件有一个生成的 UUID。

扩展程序（Extensions）在旧版本的 NSWA Kuriboh 上称为插件（Plugin），通常使用无需编译的动态代码编写，因此扩展程序通常是跨设备架构工作的。可以参考 [NSWA Ranga 扩展程序开发人员手册](devman-extensions.html) 和实例扩展程序源码。此外，在 Ranga 上，Web 控制台由某个扩展程序提供，并且允许其他扩展程序替换 Web 控制台，因此用户可以定制自己的 Web 控制台。可以前往 [NSWA Ranga 默认 Webcon 源代码仓库](https://github.com/nswa-project/ranga-webcon.git) 了解更多。

## 认证超级用户

认证超级用户后可以访问 NSWA Ranga 的各项需要特权的配置和操作。默认情况下，非认证用户只能拨号和查看连接状态。超级用户也可以禁用匿名用户的此权限（见下文“系统控制标志”）。

> 和众多的网关一样，由于基础设施的限制（照顾小闪存设备、由于主机名问题不能受到互联网基础设施的支持从而只能自签无效证书等等）无法部署 HTTPS 以保证传输安全，攻击者可能窃取或劫持你的密码。

```bash
$ ranga-cli auth
usage: ranga-cli auth [-p|--password] [-e] [--password-text <password>]

  -p, --password    Provide password interactively
  -e                Password is passed as env-var "RANGAPASS"
  -d                Password is default password "ranga"
  --password-text   Provide password as argument (security unwise)
  -q, --logout      Unlink token file

```

### 使用密码登录

使用 `ranga-cli` 访问 NSWA Ranga 的特权操作之前，使用以下任意一条命令登录超级用户

```bash
$ ranga-cli auth -p
$ ranga-cli auth --password
Password:                       # 在这里输入密码，输入不会回显
```

> 默认的超级用户密码是 `ranga`，为了安全您应该修改它，参见下文“修改超级用户密码”一节。
> 
> 在执行登录后，NSWA 网关服务器会生成一个“会话令牌”，如果 `XDG_RUNTIME_DIR` 系统环境变量被定义，`ranga-cli` 会将它存放在 `${XDG_RUNTIME_DIR}/nswa_rt_usertoken`，否则 ranga-cli 会将它存放在当前目录的 `.nswa_usertoken` 隐藏文件中，在之后需要执行特权操作时，此令牌会发送到 NSWA Ranga 以获取更高的系统访问权限。

除了交互式输入密码认证，为了便于自动化脚本工作，`ranga-cli` 还接受通过环境变量和命令行参数传入密码，即

```bash
$ env RANGAPASS=password ranga-cli auth -e

$ ranga-cli auth --password-text password
```

> 通过命令行参数传入密码是不安全的，我们不建议使用。

如果使用默认密码，也可以使用 `ranga-cli auth -d` 进行认证。（仅命令行工具 0.2.1a 及以上版本）

### 登出超级用户

在执行完特权操作后，你应该执行以下任意一条命令登出超级用户。

```bash
$ ranga-cli auth -q
$ ranga-cli auth --logout
```

## 查询

> query 下的与多宿主和流量控制有关的查询在“多宿主”和“流量控制”节中说明

### 查询系统日志

日志对于排查系统故障是非常有用的信息，NSWA Ranga 提供了读取日志缓冲区的接口

```bash
# 查询本此系统启动后最近的系统日志
$ ranga-cli query log

# 查询本此系统启动后最近的内核日志
$ ranga-cli query log kern
```

### 查询系统信息

NSWA Ranga 提供了查询当前系统信息的接口，

```bash
$ ranga-cli query sysinfo
usage: sysinfo [-vpu]

  -v    系统版本
  -p    设备信息
  -u    资源使用
  -U    最近的系统负载信息
```

这是在一台 Netgear wndr3800 上同时查询前 3 种信息的输出

```bash
$ ranga-cli query sysinfo -vpu
version: 4.0-testing
verlock: none
channel: stable
kernel: 4.9.120 #0 Thu Aug 16 07:51:15 2018
chip: ar71xx/generic
arch: mips_24kc
board: wndr3700
model: NETGEAR WNDR3800
memory: 125140/24388/6760/2332/68
storage: 556.0K/10.9M
```

`version` - NSWA Ranga 系统版本

`verlock` - 版本被谁锁定，`none` 表示未被锁定，`fullpack` 表示因为上次完整包更新失败被锁定（你只能继续尝试此完整包或更新的完整包），`upgrade` 表示因为上次差分 OTA 更新失败被锁定（你只能继续尝试此 OTA）。

`channel` - (NSWA Ranga 4.7.9 及以上) 用于区分更新通道，如更稳定的标准通道和软件更新的实验性通道等。目前支持的通道：`stable` 稳定通道。

`kernel` - 内核版本

`chip` - 芯片，截至现在，NSWA Ranga 支持以下几种芯片

- ramips/rt305x

- ramips/mt7620

- ramips/mt7621

- ar71xx/generic

- ar71xx/nand

`arch` - 架构，截至现在，NSWA Ranga 支持以下几种架构

- mipsel_24kc

- mips_24kc

`board` - 板子

`model` - 设备模型名

`memory` - 内存使用，总内存/已使用/已缓存/已缓冲/共享（单位：KiB，千字节）

`storage` - 存储空间，用户分区已用/用户分区总量

### 查询网络信息

#### 基本的接口信息

```bash
$ ranga-cli query network
!...
netkeeper:netkeeper:0:
mda:netkeeper:0:
```

开始的行以 `!` 开头，表示某种标志，可能有 0 行或多行，目前支持的标志有

- `scdial-is-enabled` 存在表示已经启用第二代新型实验性拦截服务器，反之没有启用。

从第一行不以 `!` 开头的行开始及之后返回的每行信息格式为 `接口名字:接口类型:已连接:少量统计信息`

接口类型包括 `pppoe`，`netkeeper`，`dhcp`, `static` 和 `none`，未来可能会增加 `dhcpv6`, `pppoa` 和 `unmanagment` 等

已连接：1 表示已连接，0 表示未连接

未连接的接口接口的流量统计信息为空白，已连接的接口统计信息为 `<rx_bytes>,<tx_bytes>`

#### 全部接口的更完备信息

> 仅限 Ranga 系统版本 4.7.21 或更新版本。旧版本只能使用下一节”接口的网络层信息“等中一次一个地获取接口的更完备信息。

```bash
$ ranga-cli query network status
!...
netkeeper;netkeeper;0;<rx_bytes>,<tx_bytes>;<IP>,<IP>...
...
```

非常类似于”基本的接口信息“的输出，不同的地方有两点

1. 使用 `;` 而不是 `:` 作分隔符

2. 增加了一个 IP 地址字段，将返回 CIDR 格式的网络地址。以 `,` 分割，每条以 `inet ` 或 `inet6 ` 开头，表示 IPv4 和 IPv6 地址。

#### 接口的网络层信息

> 对于 netkeeper 接口，接口类型应传入 `pppoe` 而不是 netkeeper

```bash
$ ranga-cli query network inet <接口名> <接口类型>
```

将返回接口上配置的 IP 地址、子网前戳、广播地址等网络层信息

#### 系统 DHCP 租期列表

```bash
$ ranga-cli query network dhcp-leases
```

#### 系统 ARP 高速缓存

```bash
$ ranga-cli query network arp
```

从 4.5.8 开始，提供一种输出不同但更详细的接口，同时支持 IPv6 邻居表

```bash
$ ranga-cli query network inet4neigh
$ ranga-cli query network inet6neigh
```

#### 系统 IP 路由表

```bash
$ ranga-cli query network route
```

从 4.5.11 开始，支持查询 IPv6 路由表

```bash
$ ranga-cli query network inet6route
```

从 4.7.16 开始，支持查询 IPv6 路由表，并输出更简短并易于机器解析的格式 (对于有些人来说，他们也可能认为这种格式更易读)

```bash
$ ranga-cli query network inet6route-porcelain
```

#### IPv6 LAN 地址段

```bash
$ ranga-cli query network inet6-lan-addresses
```

### 列出无线设备

```bash
$ ranga-cli query wifi ls
5GHz:0
2.4GHz:1
```

返回的结果每一行表示一个无线设备，`:` 之后是无线设备的 ID，之前是 NASA Ranga 经过探测，为这个无线设备努力解释的一个标签，通常是此无线设备工作的频率。

### 查询无线信息

> 对于全部的开源驱动程序，支持这些查询接口
> 
> 很多专有驱动程序不支持这些或这些中的部分接口，它们可能需要在专门的厂商特定配置程序里查询和设置

#### 无线设备状态

```bash
$ ranga-cli query wifi info <无线网卡ID>
```

这将返回无线设备当前工作的信道、TxPower 等信息

#### 无线设备能力

```bash
$ ranga-cli query wifi cap <无线网卡 ID>  <能力集名字>
```

目前支持查询这几种能力集

- `txpower` 无线设备支持的功率列表

- `channel` 无线设备支持的信道列表（简要表示）

- `htmode` 无线设备支持的信道宽度列表

#### 无线接入点已连接的设备

```bash
$ ranga-cli query wifi assoclist <无线网卡ID>
```

#### 以另一种方式查询无线设备支持的信道（附带频率等信息）

```bash
$ ranga-cli query wifi show-channels <无线网卡ID>
```

#### 无线系统监管域详细信息

```bash
$ ranga-cli query wifi reg
```

## 配置

> config 下的与多宿主和流量控制有关的配置在“多宿主”和“流量控制”节中说明

### 接口

#### 列出现有接口

```bash
$ ranga-cli config interface ls
wan
netkeeper
...
```

将返回现有接口列表，以 `\n` UNIX 换行符分割。

#### 添加接口

```bash
$ ranga-cli config interface add <接口名>
```

用户自行添加的接口必须以 `md` 开头。

#### 删除接口

```bash
$ ranga-cli config interface remove <接口名>
```

只能删除用户自行添加的接口，即以 `md` 开头的接口。

#### 显示指定接口的所有配置

```bash
$ ranga-cli config interface show <接口名>
```

返回条目的格式为键-值对，以 `:` 分割键与值，每条以 `\n` UNIX 换行符分割。即

```
key: value
key: value
...
```

Key 列表即为下一节中所说的设置项列表。

例子：显示 netkeeper 接口的配置。

```bash
$ ranga-cli config interface show netkeeper
type: pppoe
nkplugin: cmcc_sd
usrnam: 
passwd: 
rvlan: 
macaddr: ea:db:21:53:4b:99
ipaddr: 
netmask: 
gateway: 
defaultroute: 
ipv6: 
```

#### 获取/设置指定接口的某一项设置

> 请注意：修改设置后可能不会立即生效，你可能需要使用 `ranga-cli action restart network` 使设置立即生效。

```bash
$ ranga-cli config interface get <接口名> <key>

$ ranga-cli config interface set <接口名> <key> <value>
```

目前支持的 Key 列表

1. type 指定接口的类型，目前支持以下几种类型：`pppoe`（基于以太网的点对点协议），`dhcp`（DHCP 客户端）, `static`（静态地址）和 `none`（无协议）。

2. nkplugin 是否启用 Netkeeper 扩展。`cmcc_sd` 表示启用 `NK_2_5_0059~patched-1_CMCC-SD` 扩展（由于历史遗留问题，`nkplugin` 或者 `on` 是此扩展的别名），`off` 表示不启用。仅在 type 为 `pppoe` 时有效，且会导致 `query network` 命令将接口类型显示为 `netkeeper` 而不是 `pppoe`。

3. usrnam 用于 PPPoE PAP/CHAP 认证或者 802.1X 安全性的用户名。可置空。

4. passwd 用于 PPPoE PAP/CHAP 认证或者 802.1X 安全性的密码。可置空。

5. rvlan 反向 VLAN ID。仅对以 `md` 开头的接口有效，用于设定接口工作的 反向 VLAN。详见“多宿主”节。可置空。

6. macaddr 设置接口 MAC 地址。可置空。

7. ipaddr INET4 地址，仅在 type 为 `static` 时有效。可置空。

8. netmask INET4 网络掩码，仅在 type 为 `static` 时有效。可置空。

9. gateway INET4 下一跳站点地址，仅在 type 为 `static` 时有效。可置空。

10. defaultroute 将此接口添加到路由表默认条目。空白或 `1` 启用。`0` 禁用。

11. ipv6 为 PPPoE 接口配置 IPv6 客户端（`0` “不开启任何协议”；`1` “仅 IPv6CP”；`auto` 或空白 “IPv6CP + DHCPv6 Client”）

> 将某个 value 设置为空白时，不要忘了因为 shell 解释参数个数的问题，应加一组引号，如 `ranga-cli config interface set interface ipv6 ''`

### 无线

> 对于全部的开源驱动程序，除非另有说明，支持这些查询接口
> 
> 很多专有驱动程序不支持这些或这些中的部分接口，它们可能需要在专门的厂商特定配置程序里查询和设置

#### 无线加密套件格式

NSWA Ranga 定义的新型 Wifi 加密套件格式

```
RANGA_WIRELESS_[协议[版本[MIX版本]...]_][方式[_子方式][_AND_方式[_子方式]]...]
```

然而，为了减少迁移系统带来的痛苦感，旧套件仍然沿用 NSWA Monodra 和 NSWA Kuriboh 定义的旧加密套件格式，即

```
NSWA_WIFI_ENC_协议_方式_WITH_加密
```

套件|协议|加密|安全性|兼容性|性能影响
----|-------------|-------------|-------------|-------------|-------------
RANGA_WIRELESS_WPA3_SAE|WPA3 等时同等认证|AES-GCM（支持前向保密）|好|仅支持 WPA3 的客户端|平衡
RANGA_WIRELESS_WPA3MIX2_SAE_AND_PSK|"WPA3 等时同等认证" 与 "WPA2 预共享密钥" 混合模式|AES-GCM（支持前向保密）, AES|平衡|平衡|平衡
RANGA_WIRELESS_OPEN<br>NSWA_WIFI_ENC_NULL_NULL_WITH_NULL|无认证|WPA2: 无加密<br>WPA3: AES-GCM（支持前向保密）|取决于采用的 WPA 版本|很好|取决于采用的 WPA 版本
NSWA_WIFI_ENC_WPA2_PSK_WITH_CCMP (默认方式)|WPA2 预共享密钥|AES|一般|平衡|平衡
NSWA_WIFI_ENC_WPA2_PSK_WITH_TKIP|WPA2 预共享密钥|TKIP|不安全|一般|比较严重
NSWA_WIFI_ENC_WPA2_PSK_WITH_TKIP_AND_CCMP|WPA2 预共享密钥|AES, TKIP|不安全|较好|非常严重
NSWA_WIFI_ENC_WPA_PSK_WITH_CCMP|WPA 预共享密钥|AES|不安全|很差|比较严重
NSWA_WIFI_ENC_WPA_PSK_WITH_TKIP|WPA 预共享密钥|TKIP|不安全|差|比较严重
NSWA_WIFI_ENC_WPA2_AND_WPA_PSK_WITH_TKIP_AND_CCMP|WAP 与 WPA2 预共享密钥|AES, TKIP|不安全|最好|非常严重
RANGA_WIRELESS_WPA3_EAP_ECDHE_ECDSA（暂未实现）|WPA3 椭圆曲线DH-椭圆曲线数字签名|AES-GCM（256 位元）（支持前向保密）|||
RANGA_WIRELESS_WPA3_EAP_ECDHE_RSA（暂未实现）|WPA3 椭圆曲线DH-RSA|AES-GCM（256 位元）（支持前向保密）|||
RANGA_WIRELESS_WPA3_EAP_DHE_RSA（暂未实现）|WPA3 DH-RSA|AES-GCM（256 位元）（支持前向保密）|||

更多过时的套件已经被 NSWA 抛弃

#### 列出无线设备

> 使用 `ranga-cli query wifi ls` 可以同时包含无线设备 ID 对应的标签。通常建议使用此命令。

```bash
$ ranga-cli config wifi ls
```

将显示无线设备 ID 的列表，每条以 `\n` UNIX 换行符分割。

#### 显示指定无线设备的所有配置

```bash
$ ranga-cli config wifi show <无线设备 ID>
```

返回条目的格式为键-值对，以 `:` 分割键与值，每条以 `\n` UNIX 换行符分割。即

```
key: value
key: value
...
```

例子：显示 0 无线设备的配置。

```bash
$ ranga-cli config wifi show 0
TODO
```

#### 获取/设置指定无线设备的某一项设置

> 请注意：修改设置后可能不会立即生效，你可能需要使用 `ranga-cli action restart wireless` 使设置立即生效。

```bash
$ ranga-cli config wifi get <ID> <key>

$ ranga-cli config wifi set <ID> <key> <value>
```

目前支持的 Key 列表

1. chiper 无线设备 AP 模式下使用的加密套件，见上文“无线加密套件格式”。

2. psk.ssid 使用 PSK（预共享密钥）的套件时，使用此 SSID（服务集标识符）。

3. psk.key 使用 PSK（预共享密钥）的套件时，使用此密钥。

4. channel 选择信道。可使用上文介绍的 `ranga-cli query wifi cap <无线网卡 ID> channel` 查询无线设备支持的信道。除此之外，设置为 `auto` 表示由 NSWA Ranga 自动选择信道。

5. country 设置地区代码，从而决定无线电监管域。使用 ISO/IEC 3166-1 alpha-2 标准。可置空。置空时回退到驱动程序默认值，可能是某个特定地区，一般是 `00` 世界监管域。

6. rts 设置 RTS 阈值。可置空。置空时回退到驱动程序默认值。（对于某些设备，NSWA Ranga 预先设置了某些无线设备的 RTS 阈值，可以先获取设定值）

7. distance 设置距离优化。单位为米。可置空。

8. htmode 设置信道宽度。可置空。置空时回退到驱动程序默认值。可使用上文介绍的 `ranga-cli query wifi cap <无线网卡 ID> htmode` 查询无线设备支持的信道宽度列表。

9. txpower 设置无线电功率。可置空。置空时回退到驱动程序默认值。可使用上文介绍的 `ranga-cli query wifi cap <无线网卡 ID> txpower` 查询无线设备支持的无线电功率列表。除此之外，设置为 `auto` 表示由 NSWA Ranga 自动选择无线电功率。

10. noscan 是否启用强制高信道宽度。`1` 启用，`0` 禁用（默认）。启用将违反监管规定。可置空。

11. macaddr 覆盖设备 MAC 地址。可置空。

12. hidden 是否启用 SSID 隐藏。`1` 启用，`0` 禁用（默认）。可置空。

13. isolate 是否启用 AP 隔离。`1` 启用，`0` 禁用（默认）。可置空。

14. macfilter.mode 设置 MAC 过滤模式。`deny` 黑名单，`allow` 白名单，`disable` 禁用（默认）。可置空。

15. macfilter.list 设置 MAC 过滤名单。`ranga-cli config wifi set <无线网卡 ID> macfilter.list 'AA:BB:CC:DD:EE:FF 11:22:33:44:55:66 ...'`，每一个 MAC 地址之间使用空格隔开，且为一个参数。

### 域名系统

#### 附加 DNS 服务器

> 请注意：修改设置或添加/删除服务器后可能不会立即生效，你可能需要使用 `ranga-cli action restart network` 使设置立即生效。
>
> 即使你添加了附加服务器，但是 NSWA Ranga 会选择更快的 DNS，这通常是你的 ISP 提供的 DNS，你可以使用下面设置中的 `peerdns` 设置禁用 ISP 的 DNS。

添加一个新服务器

```bash
$ ranga-cli config dns add-server <addr>
```

删除一个已添加的附加服务器

```bash
$ ranga-cli config dns rem-server <addr>
```

获取附加服务器列表

```bash
$ ranga-cli config dns list-server
```

#### 显示 DNS 的所有配置

```bash
$ ranga-cli config dns show
```

返回条目的格式为键-值对，以 `:` 分割键与值，每条以 `\n` UNIX 换行符分割。即

```
key: value
key: value
...
```

Key 列表即为下一节中所说的设置项列表。

#### 获取/设置 DNS 的某一项设置

```bash
$ ranga-cli config dns get <key>

$ ranga-cli config dns set <key> <value>
```

目前支持的 Key 列表

1. peerdns 是否使用由对端（可能是 ISP 提供的 DNS 服务器）。`1` 启用，`0` 禁用。

2. rebind_protection 是否启用 DNS rebind 攻击防护措施。`1` 启用，`0` 禁用。此功能将缓解你可能受到 DNS rebind 网络攻击的影响，但可能导致某些不规范的应用程序工作不正常，这些有问题的应用程序甚至可能造成 DNS 请求风暴从而影响网络性能。

3. allservers 是否启用全部 DNS 服务器，`1` 启用，`0` 禁用。启用时 NSWA Ranga 每次都会查询全部设置和对端的 DNS 服务器。

4. queryport 设置 NSWA Ranga 发起 DNS 查询时使用的 DNS 服务器端口。可置空。置空时将使用默认端口。

5. port 设置 NSWA Ranga 的 DNS 缓存服务器绑定的端口。可置空。置空时将使用默认端口。

#### 上传自定义 Addrfile 文件（需要版本 4.7.5 及以上）

使用 upload 模式上传到 addrfile

TODO: Addrfile 解析（尚未完成）

```bash
$ ranga-cli config -u dns addrfile < /path/to/addrfile
```

#### 上传自定义 hosts 文件

版本 4.7.5 及以上，使用 upload 模式上传到 hosts。旧版本方式请看下面注释部分。

```bash
$ ranga-cli config -u hosts hosts < /path/to/addrfile
```

> 在 4.7.10 之前的版本中，你应该使用 RAW 模式运行 dns 命令，RAW 模式将数据视为 hosts 文件。之后的系统废弃了 RAW 模式支持。
>
> ```bash
> $ ranga-cli config -R dns < /path/to/hosts
> $ ranga-cli config --raw dns < /path/to/hosts
> ```

### 动态主机配置

> 请注意：修改设置或添加/删除 IP-MAC 绑定后可能不会立即生效，你可能需要使用 `ranga-cli action restart network` 使设置立即生效。
>
> 设置 IP-MAC 绑定后，客户端的 DHCP 请求将使用设置的 IP 地址应答。然而，在以太网中，客户端仍然可以随意设置自己的 IP 地址。

#### 设置 IP-MAC 绑定

添加 IPv4 绑定

```bash
$ ranga-cli config dhcp add-ipv4-bind <IPaddr> <MACaddr>
```

删除 IPv4 绑定

```bash
$ ranga-cli config dhcp rem-ipv4-bind <IPaddr>
```

显示全部的 IPv4 绑定

```bash
$ ranga-cli config dhcp show-ipv4-bind
```

清除全部 IPv4 绑定

```bash
$ ranga-cli config dhcp clear-ipv4-bind
```

#### 显示 DHCP 的所有配置

```bash
$ ranga-cli config dhcp show
```

返回条目的格式为键-值对，以 `:` 分割键与值，每条以 `\n` UNIX 换行符分割。即

```
key: value
key: value
...
```

Key 列表即为下一节中所说的设置项列表。

#### 获取/设置 DHCP 的某一项设置

```bash
$ ranga-cli config dhcp get <key>

$ ranga-cli config dhcp set <key> <value>
```

目前支持的 Key 列表

1. leasetime 设置租期时长。默认值为 `48h`

2. start 设置分配地址池相对于当前网段的偏移量。例如，如果当前网络是 `192.168.1.0/24`，将此偏移量设置为100将使 NSWA Ranga 从 `192.168.1.100` 开始分配地址。

3. limit 分配地址池的 IP 个数容量限制。

4. noping 分配地址前不要测试地址是否可用。1` 启用，`0` 禁用。可置空。

5. ramode 配置路由器广告模式（有状态、无状态、有状态+无状态）影响 LAN 内主机对应使用 DHCPv6、SLAAC 或 DHCPv6+SLAAC。（`0` no M-Flag but A-Flag 即无状态, `1` both M and A flags 即有状态+无状态, `2` M flag but not A flag 即有状态）

### 标志和杂项

标志

名称|含义|默认值|重启要求
----|--------|--------|--------
enable_captive_portal|0 (禁用圈养门户)<br>1 (启用圈养门户)|1|必须立刻重启
enable_cron_autostart|0（开机不自动启动cron服务）<br>1（开机自动启动cron服务）|0|重启后更改生效
enable_early_dial|0（不执行操作）<br>1（开机后尝试无需同步时间自动拨号）|1|无需重启
permit_anonymous_dial|0（未认证超级用户时禁止拨号和检查网络状态）<br>1（匿名用户可以拨号和检查网络状态）|1|无需重启
enable_forever_nkserver|0（使用标准拦截服务）<br>1（使用实验性新型拦截服务）|0|重启后更改生效
allow_ipv6_inbound|0（过滤 IPv6 入站连接）<br>1（允许 IPv6 入站连接）|0|重启后更改生效

杂项

名称|可能的值|默认值|重启要求
----|--------|--------|--------
ttl_increase_number|0 (禁用网际网数据报文 TTL 增加功能)<br>大于0 (网际网数据报文 TTL 增加 n)|0|重启后更改生效
rvlan|_参考“多宿主”节_|0|_参考“多宿主”节_
autoppp|_参考本节后面部分_|hangup|无需重启
aria2_rpc_secret|_参考“额外（可选）服务-Aria2 下载管理器”节_|123456|_参考“额外（可选）服务-Aria2 下载管理器”节_

> `必须立刻重启` 表示修改此项后必须立刻重启系统，否则 NSWA Ranga 可能会处于不一致的工作状态
> 
> `重启后更改生效` 表示修改此项后在重启之前 NSWA Ranga 仍会按照旧设置运作，重启后新设置生效，但不会出现问题
> 
> `无需重启` 表示修改此项后新的值立即生效

NSWA Ranga 允许你修改控制标志来调整系统的工作细节。如是否启用某些功能。修改 NSWA 控制变量标志的命令是

```bash
$ ranga-cli config misc set-flag <标志名字> <0/1>
```

修改杂项的命令是

```bash
$ ranga-cli config misc set-misc <杂项名字> <值>
```

#### 圈养门户

NSWA Ranga 默认开启 “圈养门户” 功能，使的操作系统能在接入未拨号网络时自动打开浏览器弹出拨号页面，但如果不想启用这项功能，则只需要执行以下命令

> 注意：修改 `enable_captive_portal` 标志后必须马上重启路由器，否则可能会使 NSWA Ranga 处于不一致的工作状态

```bash
$ ranga-cli config misc set-flag enable_captive_portal 0
```

要重新启用，只需将标志设置为 1

```bash
$ ranga-cli config misc set-flag enable_captive_portal 1
```

> 客户端问题：Windows vista/7 的圈养门户检测机制设计有严重缺陷并无法避免，在一些情况下可能导致弹出的浏览器不能正确打开 NSWA Web 控制台，这时你可以输入地址来手动打开 NSWA，或者选择升级 Windows 8 或更新的系统

#### 网际网数据报文 TTL 增加

> 此功能将严重影响性能，谨慎开启！

ISP 可能会利用操作系统的某些特征（TTL 初始值）和 ISP 网关收到的网际网报文的 TTL 字段来检查用户是否使用了路由器来共享流量。TTL（生存时间）是设计用来防止“迷路”的数据报在互联网上无休止被路由的情况发生，IP 协议规定，每经过一个主机而且数据报被转发的话，TTL 被减 1，ISP 可能利用这个特点来识别你使用了路由器。

NSWA Ranga 支持在路由之前将 TTL 加上一个指定数字，当为 0 时禁用此功能，大于等于 1 时 TTL 会被加上这个数字，我们推荐使用默认的 1，这样正好抵消了 NSWA 这一跳的减去的 1，使 ISP 检测路由器更困难。你也可以修改它（重启后更改生效）

```bash
$ ranga-cli config misc set-misc ttl_increase_number <值>
```

则通常情况下开启的方法为

```bash
$ ranga-cli config misc set-misc ttl_increase_number 1
```

#### 早期自动拨号功能（Early-dail）

> 如果 netkeeper 接口用户名设置为 '' 时会自动禁用以避免不需要的拨号

NSWA Ranga 支持开机后无需同步时间自动尝试破解拨号。此功能默认开启。此功能并不能保证总是成功。

要开启此功能，只需将 `enable_early_dial` 标志设置为 1，要关闭，只需要设置为 0

```bash
$ ranga-cli config misc set-flag enable_early_dial 1
```

#### IPv6 TCP/UDP/SCTP/ICMP 入站连接

要允许，只需将 `allow_ipv6_inbound` 标志设置为 1，要禁用，只需要设置为 0。修改这个设置后需要重新启动 NSWA Ranga 以生效。

```bash
$ ranga-cli config misc set-flag allow_ipv6_inbound 1
```

#### 实验性新型拦截服务

标准拦截服务需要使用 `ranga-cli action network start-server <接口名>` 接口启动服务器，然后在 1 分钟内拦截拨号，并使用轮询接口查询服务器状态。

实验性新型拦截服务无需先告诉 NSWA Ranga 需要启动拦截服务器，就可以拦截 PPPoE 连接并拨号，拨号时应该将你的帐号后附加 `@接口名` 以让 NSWA Ranga 能够确定对应的接口名，如果不带接口名，NSWA Ranga 将从 `netkeeper` 接口建立连接，本条应该为所有使用多宿主的用户所注意。本功能不建议小内存设备启用。修改这个设置后需要重新启动 NSWA Ranga 以生效。

#### autoppp

autoppp 决定了在一个 PPP 连接断开后采取什么操作

`always` - 总是自动重新连接（密码错误等问题也会不停重试，因此有可能导致被 ISP 封端口）

`hangup` - 仅在对方挂断时重新连接（例如某些 ISP 的 48 小时断网时）（默认）

`disable` - 总是不自动重新连接（最安全）

```bash
$ ranga-cli config misc set-misc autoppp <value>
```

### 计划任务

#### 计划任务条目格式

```
<分钟> <小时> <日> <月> <星期> <扩展程序名> <计划任务程序> <传入参数>
```

计划任务程序 和 传入参数 不得超过 128 字节

任意间隔使用 `*`，每间隔一次使用 `数字/*`，具体时间使用 `数字`，多个连续具体时间使用 `数字-数字`，多个不连续具体时间使用 `数字,数字,...`。分钟 0 到 59，小时 0 到 23，日 1到 31，月 1 到 12，星期 0 到 7。

例子：

- 每1分钟执行一次：`* * * * *`
- 每1小时执行一次：`0 */1 * * *`
- 每3小时执行一次：`0 */3 * * *`
- 每天凌晨6点执行一次：`0 6 */1 * *`
- 每小时的第4和第18分钟执行一次：`4,18 * * * *`
- 在上午4点到11点的第5和第35分钟执行一次：`5,35 4-11 * * *`
- 每星期六的晚上11点执行一次：`0 23 * * 6`
- 每周六、周日18点至23点之间每隔30分钟执行一次：`0,30 18-23 * * 6,0`

#### 列出所有计划任务

```bash
$ ranga-cli config cron cat
```

#### 新建计划任务

```bash
$ ranga-cli config cron add <分钟> <小时> <日> <月> <星期> <扩展程序名> <计划任务程序> <传入参数>
```

#### 删除计划任务

```bash
$ ranga-cli config cron rem <ID>
```

ID 是 “列出所有计划任务” 中输出的对应的行号，以 1 开始计算。

#### 开机后自动启动计划任务服务

只需将 `enable_cron_autostart` 标志设置为 1

```bash
$ ranga-cli config misc set-flag enable_cron_autostart 1
```

在未启动计划任务时，你也可以使用 `ranga-cli action restart cron` 来启动计划任务服务。

#### 预设的计划任务程序

NSWA Ranga 预设了一些计划任务程序

扩展程序|计划任务程序|接受的参数|解释
-------|------------|---------|----
ranga.ext.base|reboot|无参数|重启系统
ranga.ext.base|wireless|restart|重启无线
ranga.ext.base|wireless|rfkill.down|关闭无线
ranga.ext.base|wireless|rfkill.up|开启无线

你也可以开发自己的扩展程序从而提供新的计划任务程序，请参考 [扩展程序开发人员手册](devman-extensions.html)

### LAN 桥

#### 显示 LAN 桥网络层配置

```bash
$ ranga-cli config lan show
```

#### 配置 LAN 桥网际网版本4配置

```bash
$ ranga-cli config lan setinet4 <IPv4 地址> <IPv4 子网掩码>
```

例子

```bash
$ ranga-cli config lan setinet4 10.2.33.1 255.255.255.0
```

> 修改 LAN 桥网际网版本4配置后系统会自动重启

### 杂项 IPv6 配置

很多分类良好的 IPv6 配置在其相关的地方进行配置，但有一些 IPv6 设置很难分类。因此专门提供了“杂项 IPv6 配置”接口

#### 显示 DNS 的所有配置

```bash
$ ranga-cli config ipv6 show
```

返回条目的格式为键-值对，以 `:` 分割键与值，每条以 `\n` UNIX 换行符分割。即

```
key: value
key: value
...
```

Key 列表即为下一节中所说的设置项列表。

#### 获取/设置 IPv6 杂项的某一项设置

```bash
$ ranga-cli config ipv6 get <key>

$ ranga-cli config ipv6 set <key> <value>
```

目前支持的 Key 列表

1. ulaprefix ULA 前戳，格式类似于 `fdb4:3c22:c871::/48`

### 其他服务

显示全部“其他服务”配置和启用/禁用/查看是否启用一项其他服务

```bash
$ ranga-cli config svc show
$ ranga-cli config svc <服务名> <enable/disable/is-enabled>
```

#### 流量卸载（Flow Offloading）（软件）

流量卸载（Flow Offload）可以为转发的流量建立高速“旁路”，从而降低转发数据包带来的 CPU 开销，在高负载时提升网络性能。此设置只有在内核版本（见“关于 Ranga”中“Ranga 软件版本”）大于等于 4.14.0 的设备上生效。此功能与 QoS 不能同时启用！修改这个设置后需要重新启动 NSWA Ranga 以生效。

```bash
$ ranga-cli config svc offload <enable/disable/is-enabled>
```

#### 硬件流量卸载（Hardware Flow Offloading）（实验性）

硬件流量卸载（Hardware Flow Offloading）是通过 HW NAT 实现的，目前仅支持 `ramips/mt7621` 芯片的设备。只有当 “流量卸载（Flow Offloading）（软件）” 服务启用时，启用硬件流量卸载（Hardware Flow Offloading）才会生效。此功能与 QoS 不能同时启用！修改这个设置后需要重新启动 NSWA Ranga 以生效。

```bash
$ ranga-cli config svc hwoffload <enable/disable/is-enabled>
```

#### MSS clamping

默认启用。该功能 “钳制” SYN 数据包中的 TCP MSS 选项。此 MSS 选项通告远端发送 1460 或更少的 TCP 段以防止黑洞连接和 IP 碎片。修改这个设置后需要重新启动 NSWA Ranga 以生效。

```bash
$ ranga-cli config svc mssclamping <enable/disable/is-enabled>
```

### SS-Seth（服务端 Seth）配置

#### 上传指定用户名的数据文件

```bash
$ ranga-cli config -u seth 用户名 < /path/to/xxx.sth3
```

使用 upload 模式并传入用户名可上传指定用户的数据文件。

Seth 数据文件中可能包含适用的用户名（非“隐私扩展启用”的数据文件）。ranga-cli 不能理解数据文件中的文件名。要自动使用，请使用 Web 控制台进行上传。此外，你可以使用 [Seth SDK](https://github.com/seth-project/sdk.git) 中的工具查看这个用户名。即 `seth-dumpmeta /path/to/xxx.sth3`

要覆盖指定文件，以同样的用户名重新上传即可。

#### 显示已配置数据文件的用户列表（显示已上传的数据文件）

```bash
$ ranga-cli config seth ls
```

显示的文件名为“用户名.sth3”的格式。

要同时显示数据文件的生效起始日期和有效期，请使用

```bash
$ ranga-cli config seth show
```

同时显示的两个整数分别表示，数据文件的生效起始日期的 UNIX 时间戳和有效的秒数。

#### 删除数据文件

```bash
$ ranga-cli config seth rm 文件名
```

也可以看看：[Web 控制台使用 Seth 服务教程](euman-seth.html)

## 操作

> action 下的与多宿主和流量控制有关的操作在“多宿主”和“流量控制”节中说明

### 设定 NSWA Ranga 系统时钟

使用以下命令可以设置 NSWA Ranga 时间为指定值。

```bash
$ ranga-cli action date <UNIXTimeStamp>
```

和 NSWA Monodra、NSWA Kruiboh 使用人类可读的时间格式不同，NSWA Ranga 使用 UNIX 时间戳作为参数。这样是排除时区这个有点讨人厌的问题。

如果你想将当前系统时间同步到 NSWA Ranga，只需要像这样运行系统 date 实用程序并把结果传递给 ranga-cli

```bash
$ ranga-cli action date `date +%s`
```

### 基本网络操作

#### 连接/断开接口

> 请勿使用此 API 连接 pppoe 等 PPP 协议的接口。
>
> 此 API 是**异步非阻塞**的，此 API 是多线程安全的。这意味着 API 不会等待连接建立完毕，并且会在临界区有线程运行时返回错误。

```bash
$ ranga-cli action network up/down <接口名>
```

#### 拨号/挂断

> 此 API 是**非阻塞**的，但是是**同步**的，此 API 是多线程安全的。这意味着 API 会等待连接建立完毕，并且会在临界区有线程运行时返回错误。

```bash
$ ranga-cli action network dialup/hangup <接口名>
```

#### 使用 NKDial 接口进行拨号

> 此 API 是**非阻塞**的，但是是**同步**的，此 API 是多线程安全的。这意味着 API 会等待连接建立完毕，并且会在临界区有线程运行时返回错误。

```bash
$ ranga-cli action network nkdial <接口名> <前戳>
```

前戳需要使用 BASE64 编码。

相关接口必须启用一项 Netkeeper 扩展。

此接口非常类似于 dialup，但前戳由客户端提供，而不会通过 NSWA Ranga 系统内的计算得到。从而允许用户自行在客户端实现 NK 算法或使用预先计算的 NK 数据。**Web 控制台提供的 “CS-Seth（客户端 Seth） 拨号” 功能底层依赖此接口**

#### 启动 netkeeper 拦截服务器

> 此 API 是**异步非阻塞**的，此 API 是多线程安全的。这意味着 API 不会等待连接建立完毕，并且会在临界区有线程运行时返回错误。
>
> 当启用了实验性新型拦截服务器后，此接口将返回“Operation would block”

```bash
$ ranga-cli action network start-server <接口名>
```

#### 显示当前拦截服务器状态

> 当启用了实验性新型拦截服务器后，此接口将返回“Operation would block”

```bash
$ ranga-cli action network server-status
```

状态码含义

- 1 准备中

- 2 准备完毕

- 3 已捕获认证信息

- 4 成功

- 5 超时

### 重启系统或系统服务

```bash
$ ranga-cli action restart <目标>
```

可用的目标有

- wireless 无线服务

- network 网络服务

- dns-server DNS 服务器

- dhcp DHCP 服务器

- dnsdhcp DNS 和 DHCP 服务器

- mwan 多宿主服务

- rvlan-setup 反向 VLAN 初始化服务

- qos 服务质量服务

- cron 计划任务服务

- system 系统 (aka reboot，重启系统)

### 飞行模式（临时性射频无线控制）

这些控制仅在重启系统之前有效

#### 临时开启/关闭无线

> 某些早期版本的 NSWA Ranga 有 Bug，`wlup` 命令无法在混用专有驱动和开源驱动时唤起开源驱动控制的无线。

```bash
$ ranga-cli action rfkill <wldown/wlup>
```

#### 临时开启/关闭蓝牙

> 对于不含有蓝牙支持的硬件设备，应返回 `Function not implemented`，但某些早期版本的 NSWA Ranga 有 Bug 返回 `Invalid argument`。

```bash
$ ranga-cli action rfkill <btdown/btup>
```

### 可管理额外服务

可管理额外服务（Managed additional services）是适用于全部设备的额外服务。

可以用以下命令 启动/停止/重启/启用自启动/禁用自启动/查看是否启用自启动 一个可管理额外服务。

```bash
$ ranga-cli action mes <start|stop|restart|enable|disable|is-enabled> <服务名>
```

目前支持的可管理额外服务

- `ipv6_dhcp_ra_server` DHCPv6 和 IPv6 RA 服务器，可为 LAN 主机分配 IPv6 地址或使 LAN 主机执行 IPv6 自动配置。

### 通用串行总线（USB）

> 本节内容仅适用于启用了 USB 支持的设备，请查看系统组件列表是否包含 USB 支持。

对于未启用 USB 支持的设备 `ranga-cli action` 列出的列表中不含有 `usb`，以下命令将返回 `Invalid argument`

列出 USB 设备

```bash
$ ranga-cli action usb ls
```

以下是一个输出的例子。使用 `\n` UNIX 换行符。总线上的每个设备以空行开始。

```

T:  Bus=01 Lev=00 Prnt=00 Port=00 Cnt=00 Dev#=001 Spd=480 MxCh= 1
D:  Ver= 2.00 Cls=09(hub  ) Sub=00 Prot=00 MxPS=64 #Cfgs=  1
P:  Vendor=1d6b ProdID=0002 Rev=04.14
S:  Manufacturer=Linux 4.14.95 ehci_hcd
S:  Product=EHCI Host Controller
S:  SerialNumber=101c0000.ehci
C:  #Ifs= 1 Cfg#= 1 Atr=e0 MxPwr=0mA
I:  If#= 0 Alt= 0 #EPs= 1 Cls=09(hub  ) Sub=00 Prot=00 Driver=hub

T:  Bus=01 Lev=01 Prnt=01 Port=00 Cnt=01 Dev#=002 Spd=480 MxCh= 0
D:  Ver= 2.10 Cls=00(>ifc ) Sub=00 Prot=00 MxPS=64 #Cfgs=  1
P:  Vendor=067b ProdID=2731 Rev=01.00
S:  Manufacturer=Prolific Technology Inc.
S:  Product=USB SD Card Reader
S:  SerialNumber=ABCDEF0123456789AB
C:  #Ifs= 1 Cfg#= 1 Atr=80 MxPwr=500mA
I:  If#= 0 Alt= 0 #EPs= 2 Cls=08(stor.) Sub=06 Prot=50 Driver=usb-storage
```

对于不熟悉 USB 的用户，`Vendor=.... ProdID=....` 指明了厂商 ID 和设备 ID，`Manufacturer` 指明设备的制造商、`Product` 是设备的人类友好名字。`Spd` 指明设备速率。`Cls` 指明设备的类型。常见类型包括  `00` - 接口设备、`08` - 大容量存储、`09` - 集线器、`12` - USB Type-C 桥、`e0` - 无线控制器、`ff` - 厂商自定义等等。


### 外部存储设备

> 本节内容仅适用于启用了 USB 支持和外部存储设备支持的设备，请查看系统组件列表是否包含 USB 支持。

对于未启用外部存储设备支持的设备 `ranga-cli action` 列出的列表中不含有 `block`，以下命令将返回 `Invalid argument`

#### 基本说明

目前外部存储设备仅支持第一块 SCSI 存储器（包括在 USB 上运行的 SCSI）上的第一个文件系统。我们把这个文件系统称为 `main` 文件系统，以便未来支持更多的文件系统。

目前仅支持以下几个文件系统: `exFAT`、`vFAT` (FAT32) 和 `FAT` (FAT16)

#### 查看 main 文件系统状态

```bash
$ ranga-cli action block mainfs-stat
```

如果 main 文件系统已经挂载，第一行将返回 `MOUNTED`，否则返回 `NOT-MOUNTED`

如果 main 文件系统已经挂载，第二行显示文件系统使用量，格式为 `已用块数,空闲块数`，块的大小是 1024 字节

#### 卸载 main 文件系统

如果你需要热拔出存储设备，请一定先卸载 main 文件系统

```bash
$ ranga-cli action block umount-mainfs
```

但是，此 API 将在设备真正被拔出之前异步地返回，因此，调用完此命令并不能保证设备已经被卸载，请使用 `mainfs-stat` 命令轮训是否卸载完成。

### 额外（可选）服务

NSWA Ranga 上可以安装额外（可选）服务。非常类似于 可管理额外服务（Managed additional services），但不同的是并非全部的额外（可选）服务（Optional services）并在全部设备上有提供。可能有的设备支持很多额外（可选）服务，有的设备只支持其中有限的服务，甚至有的设备不支持任何额外（可选）服务。

#### 列出已安装的全部额外（可选）服务

```bash
$ ranga-cli action opt ls
```

以下是一个输出的例子。使用 `\n` UNIX 换行符。

```
aria2
samba
```

说明此系统已经安装了 Aria2 下载管理器服务和 Samba 文件共享服务。

#### 启动、停止、重新启动、启用自启动、禁用自启动一个额外（可选）服务

```bash
$ ranga-cli action opt <start/stop/restart/enable/disable> <服务名字>
```

#### 服务特定配置接口

服务可能使用 NSWA Ranga 的"标志和杂项"中的配置，也有可能通过额外（可选）服务配置接口提供配置

```bash
$ ranga-cli action opt action <服务名字> <参数1> <参数2>
```

#### Aria2 下载管理器

服务名字：`aria2`，使用“额外（可选）服务配置接口”中的说明进行启动、停止等操作

RPC 服务器令牌：

使用杂项 `aria2_rpc_secret` 进行配置，默认为 `123456`，修改后需要重启 Aria2 下载管理器生效

```bash
$ ranga-cli action opt restart aria2
```

客户端访问：

之后，可以使用 Aria2 客户端（如 webui-aria2、AriaNG 等）访问 Aria2 下载管理器，服务器地址为 `ranga.lan` 或者 `192.168.1.1` 等，端口号为 6800，不启用 TLS，secret 为上文中设置的 `aria2_rpc_secret`

也可以看看：[SMB 文件共享和下载管理器](euman-smbanddm.html)

#### Samba 文件共享

服务名字：`samba`，使用“额外（可选）服务配置接口”中的说明进行启动、停止等操作

设置认证密码：

```bash
$ ranga-cli action opt action samba set-passwd <密码>
```

客户端访问：

之后，你可以在 `WORKGROUP` 工作组上访问 `\\ranga.lan\ranga-externals` 或者 `\\192.168.1.1\ranga-externals` 上的 Windows SMB 文件共享上访问你挂载在 NSWA Ranga 的存储设备。

也可以看看：[SMB 文件共享和下载管理器](euman-smbanddm.html)

## 附加组件

> 这是关于用户安装/管理附加组件的文档，如果你正在寻找编写/调试附加组件的文档，请转至 [扩展程序开发人员手册](devman-extensions.html)

### 安装新的扩展程序

```bash
$ ranga-cli addon install-extension /path/to/ext.zip
```

### 列出已安装的扩展程序

```bash
$ ranga-cli addon list-extensions
```

将列出已安装附加组件的包名，以 UNIX 换行符分割。

### 显示扩展程序清单（详细信息）

```bash
$ ranga-cli addon print-info <包名>
```

### 删除一个扩展程序

```bash
$ ranga-cli addon remove-extension <包名>
```

### 重建缓存

```bash
$ ranga-cli addon update-cache
```

通常情况下，NSWA Ranga 会自己处理好扩展程序缓存，无需用户干预，此 API 保留供扩展程序开发者用于 debug 目的。

### 设置 Web 控制台提供者

NSWA Ranga 上，Web 控制台不再和系统耦合，而是可以由一个扩展程序提供，NSWA Ranga 预装了 `ranga.webcon` 扩展程序提供默认的 Web 控制台。Web 控制台源代码托管在[此处](https://github.com/nswa-project/ranga-webcon.git)。

要设置 Web 控制台提供者扩展程序，只需要运行

```bash
$ ranga-cli addon set-webcon <包名>
```

### 调用扩展程序提供的 API

NSWA Ranga 设计了 [NSWA Ranga 数据交换协议](devman-proto.html)。不仅系统 API 接口使用此格式，还提供了例程使扩展程序能和此格式兼容。如果扩展程序也使用此格式，则可以统一以相同的形式调用它们。

NSWA Ranga 允许扩展程序不遵守此规范，而直接使用裸 CGI 接口控制 HTTP 从而和用户交互。这样一来，扩展程序就可以提供基于 Web 页面的 API 接口。

NSWA Ranga 设计的扩展程序接口是分级的，例如，一个扩展程序可以提供一个叫 `a` 的 API，也可以提供一个叫 `a` 的目录，并在此目录下提供 API，成为 `a.xxxYYY`, `a.query` ...，目录下还可以提供目录，从而使 API 更加条理。

NSWA Ranga 同时提供一个 `ranga.ext.base` 的基础设施扩展程序，此扩展程序提供了一个“内省” API 允许用户遍历一个扩展程序的 API 列表。详情请参见[扩展程序开发人员手册](devman-extensions.html)

调用扩展程序 API 的方法是

```bash
$ ranga-cli addon invoke [--debug] <包名> <API名字> [参数1] [参数2] ...
```

例如，调用 `ranga.ext.base` 的 `ext.introspect` API，传入参数 `ranga.ext.base` 和 `/ext`

```bash
$ ranga-cli addon invoke ranga.ext.base ext.introspect ranga.ext.base /ext
> ext: ranga.ext.base
> dir: /ext

@ introspect
```

### 列出组件列表

```bash
$ ranga-cli addon list-components
```

## 软件部署

> [OPTIONS] 是附加选项，可空，所有的附加选项请参考下文的“附加选项”节。

### 在线部署组件

从 Ranga 在线仓库部署系统组件。你需要提供组件的 UUID

```bash
$ ranga-cli swdeploy [OPTIONS] component <uuid>
```

### 执行系统同步

将 NSWA Ranga 直接更新到最新版本。这将获取当前系统版本，然后安装下一个版本的 OTA 更新，重复操作直到最后的版本。有些 OTA 需要人工干预完成，此时系统同步会提前终止并显示必要的信息。

```bash
$ ranga-cli swdeploy [OPTIONS] sync
```

### 刷入单个 OTA 更新/完整包/系统组件包

```bash
$ ranga-cli swdeploy [OPTIONS] flash /path/to/file
```

### 在更新完整包时抹掉全部系统配置

从 4.5.9 的完整包开始，安装完整包将尽可能保留原系统配置，如果希望更新完整包时抹掉全部系统配置，在上传完整包之前执行命令。不适用于差分更新。

```bash
$ ranga-cli swdeploy [OPTIONS] fp_earse_configure
```

激活此选项后，在安装一个完整包或重新启动系统之前无法关闭此选项。

> 除了 --auth-standalone 以外的选项都将会忽略

### 显示状态和日志

```bash
$ ranga-cli swdeploy [OPTIONS] status

$ ranga-cli swdeploy [OPTIONS] log
```

> 除了 --auth-standalone 以外的选项都将会忽略

### 附加选项

```
  -a, --async               不要等待安装完毕就退出，不可用于 sync
  -r, --reboot               完成后强制执行重启操作
  --max-poll-time <time>     设置轮询的最大次数
  --auth-standalone          使用独立的认证模式

  独立认证模式是用于拯救损坏的系统而提供的。
```

## 多宿主

### 多宿主

> 请注意：修改设置后可能不会立即生效，你可能需要使用 `ranga-cli action restart mwan` 使设置立即生效。

#### 启用多宿主服务

```bash
$ ranga-cli config mwan enable
```

#### 禁用多宿主服务

```bash
$ ranga-cli config mwan disable
```

#### 检查多宿主服务是否已启用

```bash
$ ranga-cli config mwan is-enabled
```

#### 设置 Reverse VLAN 的个数

通常，你需要将 Reverse VLAN 的个数 设置为你希望进行多宿主的接口（但不包含 wan 或 netkeeper 接口）的个数

```bash
$ ranga-cli config misc set-misc rvlan <个数>
```

如果你希望此设置立即生效，你还需要

```bash
$ ranga-cli action restart rvlan-setup
```

#### 将必要的接口绑定到到 Reverse VLAN

> 不包含 wan 或 netkeeper 接口，且你也无法为这些接口设置 Reverse VLAN

```bash
$ ranga-cli config interface set <接口名> rvlan <Reverse VLAN ID>
```

Reverse VLAN ID 是一个整数，从 0 开始，直到你设置的个数 - 1。

#### 列出已添加到多宿主服务的接口

```bash
$ ranga-cli config mwan ls
```

#### 向多宿主服务添加/删除接口

```bash
$ ranga-cli config mwan add <接口名>
$ ranga-cli config mwan remove <接口名>
```

#### 显示当前多宿主负载均衡状态

```bash
$ ranga-cli query network mwan
```

#### 显示多宿主指定接口的所有配置

```bash
$ ranga-cli config mwan show <接口名>
```

返回条目的格式为键-值对，以 `:` 分割键与值，每条以 `\n` UNIX 换行符分割。即

```
key: value
key: value
...
```

Key 列表即为下一节中所说的设置项列表。

#### 获取/设置多宿主指定接口的某一项设置

> 通常来讲，你不需要修改这些设置，除非你已经理解这些参数的含义，否则请保持默认。

```bash
$ ranga-cli config mwan get <接口名> <key>

$ ranga-cli config mwan set <接口名> <key> <value>
```

目前支持的 Key 列表

1. trackIPlist 用于测试接口互联网活性的跟踪 IP 列表。在获取时每项以空格分割并用单引号包括，设置时只需将每项作为 ranga-cli 工具的一个参数即可，即此 API 接受不定长参数列表。

2. timeout 发起测试后等待时间（以秒计）

3. interval 发起每次测试的间隔时间（以秒计）

4. reliability 需要至少达到几个 IP 活跃才认为此接口连接到互联网

5. up 测试通过此次数后认为此 IP 活跃

6. down 测试失败此次数后认为此 IP 不活跃

7. metric 权值，拥有越低权值的接口将更被倾向于使用

8. weight 权重，拥有相同权值的接口根据此值分配负载

### 示例：懒人双wan脚本

保存下列脚本至 `dualwan.sh` 并运行

> Windows 用户请注意，你必须将此文件保存为 Unix 换行符（LF）格式，如果保存为默认的 DOS 换行符（CRLF）则可能会出现无法启动的问题。

```bash
#!/bin/bash

#使用你的超级用户密码替换此变量默认值（如果你修改了密码）
export RANGAPASS="ranga"
username="第二个用户的用户名"
password="第二个用户的密码"

ranga-cli auth -e

ranga-cli config mwan enable

ranga-cli config misc set-misc rvlan 1
ranga-cli action restart rvlan-setup

ranga-cli config interface add mda
ranga-cli config interface set mda type pppoe
ranga-cli config interface set mda nkplugin on
ranga-cli config interface set mda usrnam "$username"
ranga-cli config interface set mda passwd "$password"
ranga-cli config interface set mda rvlan 0

ranga-cli config mwan add netkeeper
ranga-cli config mwan add mda

ranga-cli action network dialup mda

ranga-cli action restart mwan
sleep 3
ranga-cli query network
ranga-cli query network mwan
```

## 流量控制

### 服务质量（QoS）

> 服务质量（QoS）是实验性功能。

#### 启用/禁用/检查是否启用

```bash
$ ranga-cli config qos <enable/disable/is-enabled>
```

#### 上传 QoS 规则

> 使用 Ranga 系统 API 的 RAW 模式将上传规则

```bash
$ ranga-cli config -R qos < xxxx.qos
$ ranga-cli config --raw qos < xxxx.qos
```

将规则写入 `xxxx.qos` 文件，必须使用 UNIX 换行符，例如，这是一个规则例子：

```
.ranga.qos

# 使用 '.ranga.qos' 表示使用 Ranga QoS version 1
# 注释以 '#' 开头

# 使用 '.if' 关键字进行接口设置，每个希望进行 QoS 的接口具有一个条目
# name: 启用 QoS 的接口名
# up: 上传带宽限制，单位 Kbps
# down: 下载带宽限制，单位 Kbps

.if name="netkeeper" up="20480" down="20480"

# 使用 '.match' 关键字进行基本规则设置，每个规则一个条目
# comment: 注释
# proto: 匹配协议，tcp, udp 或者 icmp
# ports: 匹配端口号，以 ',' 分割
# portrange: 匹配端口范围，如 100-200
# src: 匹配来源地址，单个 IP 或者 CIDR 表示法
# dest: 匹配目的地址，单个 IP 或者 CIDR 表示法
# pktsize: 匹配包大小
# class: 应用到哪一个类

.match comment="dns" proto="udp" ports="53" class="Priority"
.match comment="http(s)" proto="tcp" ports="80,443" class="Normal"

# 使用 '.force' 关键字进行规则覆盖，每个规则一个条目，参数同上

.force proto="icmp" class="Priority"

# 使用 '.def' 关键字设置失败回退规则，每个规则一个条目，参数同上

.def proto="udp" pktsize="-500" class="Express"
.def pktsize="1024-65535" class="Bulk"

# 如果你不明白下面是什么含义，请勿修改

.grp classes="Priority Express Normal Bulk" default="Normal"

.class name="Priority" packetsize="400" avgrate="10" priority="20"
.downc name="Priority" packetsize="1000" avgrate="10"
.class name="Express" packetsize="1000" avgrate="50" priority="10"
.class name="Normal" packetsize="1500" packetdelay="100" avgrate="10" priority="5"
.downc name="Normal" avgrate="20"
.class name="Bulk" packetdelay="200" avgrate="1"

.end
```

## 联发科专有无线电驱动程序

目前支持的联发科专有无线电驱动程序包括

```
RT2860 芯片组，在 MT7620A 或者 MT7620N 片上系统
MT7612E 芯片组，在 MT7620A 或者 MT7620N 片上系统
```

联发科专有无线电驱动程序不遵守 Linux 的无线标准（MAC80211），因此无法使用标准的 NL80211 接口进行配置。联发科专有驱动程序使用了一套自行定义的糟糕接口。因此，NSWA Ranga 的联发科专有驱动程序框架至少要面对以下几个问题

- 2.4GHz 和 5GHz 都使用 Linux Wireless（或 OpenWrt，下同） 提供的开源驱动，我们可以忽略芯片组细节，因为所有驱动都使用 Linux 标准的 NL80211 接口提供配置。

- 2.4GHz 是 RT2860 芯片组，没有 5GHz 芯片组的设备上，使用 2.4GHz 专有驱动

- 2.4GHz 是 RT2860 芯片组，5GHz 是 MT7612E 芯片组，使用 2.4GHz 专有驱动，但是 5GHz 使用 Linux Wireless 提供的开源驱动

- 2.4GHz 是 RT2860 芯片组，5GHz 是 MT7612E 芯片组，使用 2.4GHz 和 5GHz 专有驱动

- 2.4GHz 是 MT7603E 芯片组，5GHz 是 MT7612E 芯片组，使用 2.4GHz 专有驱动，但是 5GHz 使用 Linux Wireless 提供的开源驱动（未来支持）

- 2.4GHz 是 MT7603E 芯片组，5GHz 是 MT7612E 芯片组，使用 2.4GHz 和 5GHz 专有驱动（未来支持）

以及未来可能的更多。

运行命令 `ranga-cli config mtk ls-allowed-modes` 将每行返回一个允许的模式，例如，在  RT2860+ MT7612E芯片组上，如果安装了 5GHz 的闭源驱动，将返回

```
linux-wireless-only
rt2860-mtk-with-any5ghz-linux-wireless
rt2860-mtk-with-mt7612e-mtk
```

分别表示：都用开源驱动、使用 2.4GHz 专有驱动但是 5GHz 使用 Linux Wireless 提供的开源驱动、使用 2.4GHz 和 5GHz 专有驱动。

运行命令 `ranga-cli config mtk set-mode <MODE>` 将系统的附加驱动设置为以上几项中的一项

有关联发科专有驱动的更多信息，请参考：[联发科无线电芯片常见问题](mtk-radio.html)

## 其他注意事项

### NSWA Ranga 运行于非 192.168.1.1 地址

当你设置 NSWA_GATEWAY 环境变量后，ranga-cli 将使用此地址而不是 192.168.1.1

```
$ NSWA_GATEWAY=10.2.3.3 ranga-cli ....
```

NSWA Ranga 的 DNS 服务器会把 `ranga.lan` 解析到自己的地址，如果你使用 NSWA Ranga 提供的 DNS 服务器，则可以使用 `ranga.lan`

# NSWA Ranga 多宿主自定义规则

> 请先阅读 [命令行工具手册](intro-cmdline.html) 并了解工具的基本用法。

## 前提条件（重要）

0. 使用 4.7.11 或更高版本的系统。

1. 必须已经启用并基本配置多宿主，参考 [多宿主教程](euman-mwan.html)。

2. 只有被加入到“负载均衡列表”的接口才能被自定义规则使用。

## 用法

### 创建和删除规则

规则名字不可超过 10 个字节，仅允许大小写英文字母和数字。

```
$ ranga-cli config mwan addrule <规则名字>
$ ranga-cli config mwan rmrule <规则名字>
```

### 配置规则

```
$ ranga-cli config mwan cfgrule <规则名字> <源地址或源网络CIDR> <源端口号，端口段或 any> <目的地址或目的网络CIDR> <目的端口号，端口段或 any> <接口列表，使用 ',' 分割>
```

源地址或源网络CIDR 可以是一个地址（如 `192.168.1.2`）或 CIDR 表示法表示的一个网络中的全部地址，如 `192.168.1.128/25`

端口号 可以是一个确定的端口号（如 `443`），一组端口号（如 `2048-4096` 或 `80,443`），或全部端口（`any`）

例子

```
$ ranga-cli config mwan cfgrule cr0 0.0.0.0/0 any 23.33.0.0/16 443 'mda,mdc'
```

### 规则的顺序

当一个规则被创建时，它会成为最优先的规则。在所有自定义规则的后面，最低优先级的是系统默认规则（全部流量分配全部添加到 “负载均衡列表”的全部接口）。如果需要调整规则的优先级，使用 orderrule 指令。

```
$ ranga-cli config mwan orderrule <规则>,<规则>,...
```

越在命令后面的规则将拥有更高的优先级。

> 规则匹配是按照优先级顺序的，即从高到低依次匹配，如果某一个规则匹配成功，则按照这个规则的 interfaces 分配负载（interface 中配置的权重和优先级会影响流量百分比分配）。如果没有任何一个自定义规则能匹配到，则会执行默认规则，即 interfaces 为全部加入到“负载均衡列表”的接口

### 列出规则列表和信息

```
$ ranga-cli config mwan lsrule
```

规则输出的顺序代表优先级，越早输出（在输出的上面部分）的规则拥有更高的优先级。

### 重启多宿主服务及查看规则应用状态

修改自定义规则后不会立即生效，要立即生效，须使用

```
$ ranga-cli action restart mwan
```

这个命令会异步地返回。在等待一段时间后，你可以检查多宿主状态，检查自定义规则是否已经应用。

```
$ ranga-cli query network mwan
```

## 例子

### 对指定的目的网络，只走某一个接口

可能某些服务，如游戏加速工具，为了防止帐号共享，限制了源 IP 地址只能为 1 个，这时，可能让所有到游戏加速节点的流量只能从一个接口（本例中为 `mda`）中流出

假设该游戏加速服务的地址段为 `123.45.0.0/16`

```bash
$ ranga-cli config mwan addrule game
$ ranga-cli config mwan cfgrule game 0.0.0.0/0 any 123.45.0.0/16 any mda
$ ranga-cli action restart mwan
```

### 对内网的指定主机或网络，走制定的接口

```bash
$ ranga-cli config mwan addrule nas

# 主机
$ ranga-cli config mwan cfgrule nas 192.168.1.2 any 0.0.0.0/0 any 'mda,mdb'

# 网络
$ ranga-cli config mwan cfgrule nas 192.168.1.128/25 any 0.0.0.0/0 any 'mda,mdb'
```

> 提示：还可以配合 NSWA Ranga 的 DHCP 配置，为指定用户分配指定子网段中的地址

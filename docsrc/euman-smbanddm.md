# SMB 文件共享和下载管理器

> 本文主要使用 GUI 界面进行操作，使用命令行工具进行配置的方法请参考 [命令行工具手册](intro-cmdline.html)
>
> 这些功能需要 NSWA Ranga 4.5.1 及以上版本。且需要你的设备引出了 USB 口。

NSWA Ranga 利用 Samba 实现 SMB 文件共享，允许局域网用户访问外部存储设备（例如 USB 存储器或 SD 卡）

NSWA Ranga 利用 Aria2 提供下载管理，允许局域网用户通过 Aria2 客户端使用 RPC 远程过程调用下载文件到外部存储设备（例如 USB 存储器或 SD 卡）

目前外部存储设备仅支持第一块 SCSI 存储器（包括在 USB 上运行的 SCSI）上的第一个文件系统。我们把这个文件系统称为 `main` 文件系统，以便未来支持更多的文件系统。

目前仅支持以下几个文件系统: `exFAT`、`vFAT` (FAT32) 和 `FAT` (FAT16)

## 准备工作

你可以在 Web 控制台上查看是否已经识别 USB 设备，是否已经挂载主分区。

![](res-euman-smbanddm/a1.png)

**注意！**，NSWA Ranga 默认开启“圈养门户”（captive portal）功能，以便在未连接 'netkeeper' 接口时自动弹出让浏览器打开 Web 控制台。因此此功能会劫持所有网络流量，因此会导致在未连接 'netkeeper' 接口时无法使用 SMB 文件共享和下载管理器，**不影响 'netkeeper' 接口已连接的情况！**，如果确实需要在未连接 'netkeeper' 接口时使用，请关闭“圈养门户”，但在未连接 'netkeeper' 接口时则无法让浏览器自动弹出 Web 控制台。

![](res-euman-smbanddm/a2.png)

## 文件共享

### 配置

前往系统管理->额外（可选）服务，在“Samba 文件共享服务下面”，执行以下操作

- 第一次必须先设置用户密码，点击“服务特定配置”，然后在其中设置密码。

- 点击“启动”按钮启动服务

> NSWA Ranga 现在支持额外（可选）服务开机自启动，只需勾选选择框即可，但下图是旧版本 NSWA 截图，不能反映这一点。

![](res-euman-smbanddm/a3.png)

### 客户端连接

客户端可以连接地址为 `ranga.lan` 或者 `192.168.1.1` 上的 SMB 服务，共享名为 `ranga-mainfs`

```
smb://ranga.lan/ranga-mainfs
\\ranga.lan\ranga-mainfs
```

用户名为 `user`

密码为你设置的密码

#### 在 GNU/Linux 和其他类 UNIX 系统上连接

> 如果你使用 GNOME 等桌面环境，则可以在相应的桌面环境中挂载 SMB/CIFS 文件共享

使用 smbclient

```
$ smbclient //ranga.lan/ranga-mainfs -U user
WARNING: The "syslog" option is deprecated
Enter WORKGROUP\user's password: 
Try "help" to get a list of possible commands.
smb: \> 
```

使用 CIFS 挂载

```
mount -t cifs -o username=user,password=<PASSWORD>,vers=2.0 //ranga.lan/ranga-mainfs <MOUNT_POINT>
```

#### 在 MS-Windows 上连接

在“计算机”/“此电脑”中选择“映射网络驱动器”，映射 `\\ranga.lan\ranga-mainfs` 或者 `\\192.168.1.1\ranga-mainfs`，输入用户名 `user` 和你设置的密码，根据需要勾选“自动重新连接”/“记住我的凭据”，然后点击“确定”即可

![](res-euman-smbanddm/a4.png)

![](res-euman-smbanddm/a5.png)

#### 在 macOS 上连接

打开 Finder，然后点击菜单“前往”->“连接服务器...”，服务器地址为 `smb://ranga.lan/ranga-mainfs` 或者 `smb://192.168.1.1/ranga-mainfs`，点击“连接”，然后输入名称和密码。

![](res-euman-smbanddm/a6.png)

## 下载管理器

### 配置

前往系统管理->额外（可选）服务，在“Aria2 下载管理器”，执行以下操作

- 可以设置 RPC 令牌，点击“服务特定配置”，然后在其中设置 RPC 令牌。如果不设置令牌，将使用默认令牌 `123456`

- 点击“启动”按钮启动服务

> NSWA Ranga 现在支持额外（可选）服务开机自启动，只需勾选选择框即可，但下图是旧版本 NSWA 截图，不能反映这一点。

![](res-euman-smbanddm/a7.png)

### 客户端连接

可以使用任意 Aria2 客户端连接到服务器，例如 webui-aria2、AriaNG、yaaw 等。

我们制作了一个修改后的 webui-aria2，可以更好地与 NSWA Ranga Aria2 服务器使用。

[Download](../swdl/webui-aria2.zip)

如果你修改了令牌，编辑 `webui-aria2/webui-aria2/config.js`，将第 7 行 `token: "123456"` 中的 `123456`，改为你设置的令牌。

用 Google Chrome 或者 Mozilla Firefox 打开 `webui-aria2/index.html`，即可食用。

我们亦提供“应用”模式，GNU/Linux 用户运行 `appmode-linux.sh`，Windows 用户编辑 `appmode-windows.bat` 将 Google Chrome 安装路径设置为你的计算机上的安装路径（通常无需更改）后运行即可启动 webui-aria2。

![](res-euman-smbanddm/a8.png)

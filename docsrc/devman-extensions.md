# NSWA Ranga 扩展程序开发人员手册
 
> 我们提供了一个“演示”（demo）扩展程序，请参考 [https://github.com/nswa-project/ranga-extension-demo](https://github.com/nswa-project/ranga-extension-demo)

## 公约

运行 NSWA Ranga 的设备的闪存通常很小，为了用户的正常使用和能够安装尽可能多的扩展程序和组件，因此请尽可能地缩小扩展程序需要占用的空间，制作一个超过 50KiB 的扩展程序就几乎可以断定你应该优化了（除非是 Web 控制台）！这条规则也适用于，扩展程序尽可能不要在运行时产生文件来消耗珍贵的空间，除非必要。

## 基本概念

### 包名

包名是在全局范围内唯一标识一个 NSWA Ranga 扩展程序的名称，你需要给你的扩展程序设定一个包名

**包名只允许包含英文字母，数字和下划线，以及不能连续出现的英文点号（不允许两个以上点号连续）** ，包名最长不得超过 48 个字节。

注意，以 `ranga`、`nswa` 和 `system` 开头的包名是保留的，你不能使用或使用后的结果是未定义的。

例如，以下包名都是合法的

```
xxx233
foo_bar
com.abc.toolkit
```

## 开始编写扩展程序

首先为你的扩展程序创建一个目录，你的所有工作将在这个目录中完成。

接着，在目录中创建一个名为 `manifest` 文件。并存入这样的数据

> 请注意，你必须使用 UNIX 换行符 `\n`，如果你使用 DOS 换行符 `\r\n`，NSWA Ranga 将无法识别你的扩展程序！

```
@ <pkgname>
%api: ranga:1
%magic: ABI_NSWA_LUA51;ABI_NSWA_LUAJIT;
%name: <name>
%ver: <version>
%author: <author>
```

用你的包名替换 `<pkgname>`，人类有好名字替换 `<name>`，版本号替换 `<version>`，作者名替换 `<author>`

例如，预装扩展程序 “Ranga 扩展系统基础” 的 `manifest` 文件如下

```
@ ranga.ext.base
%api: ranga:1
%magic: ABI_NSWA_LUA51;ABI_NSWA_LUAJIT;
%name: Ranga extensions system base.
%ver: 0.1
%author: NSWA Maintainers
```

值得说明的是 `%api: ranga:1` 声明使用 Ranga 扩展程序 API 版本 1。NSWA Kuriboh 的 API 不受支持。

`ABI_NSWA_LUA51` 是目前 Ranga 唯一支持的 ABI 魔法字符串，但是，未来 Ranga 可能从 Lua5.1 转向使用 LuaJIT，由于二者基本兼容，我们可以声明扩展程序同时支持这两种 ABI 以减少潜在的迁移成本。

此外，还有以下字段

- `%-x-webcon: 1` 当存在此字段时，现有 Web 控制台和用户将认为此扩展程序可以提供一个 Web 控制台，从而允许进行 Web 控制台切换。但 NSWA Ranga 本身并未检查此字段，因此即使没有此字段也可以设置 Web 控制台，但 Web 控制台和其他客户端不会认为此扩展程序提供了 Web 控制台。在 NSWA Ranga 上，Web 控制台是由一个扩展程序提供的，用户可以自行选择 Web 控制台，可参考默认的 Web 控制台源码：https://github.com/nswa-project/ranga-webcon/。

- `%-x-min-system-version: <version>` 声明需要的最小 NSWA Ranga 系统版本，但 NSWA Ranga 本身并未检查此字段。扩展程序分发渠道（如网上应用店）可能会进行检查。

- `%-x-privacy-policy: <URI>` 提供扩展程序隐私权政策 URI，NSWA Ranga 本身并未检查此字段。扩展程序分发渠道（如网上应用店）可能会进行检查。

- `%-x-downgradable: <true/false>` 声明扩展程序是否允许降级，NSWA Ranga 本身并未检查此字段。扩展程序分发渠道（如网上应用店）可能会进行检查。当不允许降级时，安装旧版本将会先卸载当前版本。

- `%wcapp`、`%wcappv1-...` 参考下文。

现在，可以开始真正的代码编写工作了。

## 扩展程序代码的唤醒方式和数据分发渠道

### 通过 Ranga 扩展程序统一调用接口

首先，在扩展程序目录下提供一个 `api` 目录。在此目录下可以继续创建子目录或 Lua 代码文件，这些 Lua 代码文件就可以通过通过[命令行客户端](intro-cmdline.html)或者浏览器访问。

例如我们提供这样一个目录

```
api
├── a.lua
├── b.lua
└── c
    ├── d.lua
    ├── e.lua
    └── f
        ├── g.lua
        ├── h.lua
        └── i.lua
```

则可以调用的 API 如下表所示

能从命令行调用的 API|能从浏览器调用的 API
-------------------|-------------------
ranga-cli addon invoke 包名 **a**|http://.../cgi-bin/ivkext/包名/**a**
ranga-cli addon invoke 包名 **b**|http://.../cgi-bin/ivkext/包名/**b**
ranga-cli addon invoke 包名 **c.d**|http://.../cgi-bin/ivkext/包名/**c/d**
ranga-cli addon invoke 包名 **c.e**|http://.../cgi-bin/ivkext/包名/**c/e**
ranga-cli addon invoke 包名 **c.f.g**|http://.../cgi-bin/ivkext/包名/**c/f/g**
ranga-cli addon invoke 包名 **c.f.h**|http://.../cgi-bin/ivkext/包名/**c/f/h**
ranga-cli addon invoke 包名 **c.f.i**|http://.../cgi-bin/ivkext/包名/**c/f/i**

调用时即可唤醒相关的 Lua 代码

但是，如果 API 设计为命令行调用和设计为浏览器调用时代码并不相同

设计为命令行调用的 API，需要遵守 [Ranga 数据交换协议](devman-proto.html)。插件系统为开发者提供了包装函数以快速适配此协议。

以下是一个设计为命令行调用的 API 的 hello world

```lua
ranga.proto.prepare()
ranga.proto.header("code", "0")
ranga.proto.content()

print("Hello, world")
```

在调用 `ranga.proto.content()` 之前不得有任何其他输出。

使用 `ranga.proto.prepare()` 准备发送协议，`ranga.proto.header()` 发送一个头部字段，`ranga.proto.content()` 表示头部准备完毕，开始发送载荷，载荷可以由扩展程序开发者自己随意发送。请务必参阅 [Ranga 数据交换协议](devman-proto.html) 以避免潜在陷阱。

以下是一个设计为浏览器调用的 API 的 hello world

```lua
io.write("Content-type: text/html; charset=utf-8\n")
io.write("\n")

print([[
<html>
<body>
<h1>Hello, world</h1>
</body>
</html>
]])
```

扩展程序需要通过 `io.write("Content-type: text/html; charset=utf-8\n")` 指明浏览器能识别的 MIME 类型，例如 `text/html`，`text/css` 等、以及编码（如果有必要）。

然后输出空行，即可输出正文部分。也可以在之前的部分中输出 HTTP 头部字段，例如 302 跳转

```lua
io.write("Status: 302 Moved Temporarily\n")
io.write("Location: xxxxx\n")
io.write("\n")
```

### 通过系统事件挂钩

在扩展程序目录下提供一个 `ranga-hook.lua` 文件，在特定系统事件时，将会唤醒运行此文件。并通过 NSWA_HOOK 环境变量传递钩子类型，扩展程序可以调用 `os.getenv` 取得。如 `boot`（系统启动）、`conn`（连接建立）、`disconn`（连接断开）。在未来版本将会继续强化钩子的功能。

可以参考 DEMO：[https://github.com/nswa-project/ranga-extension-demo/blob/master/rostc.demo/ranga-hook.lua](https://github.com/nswa-project/ranga-extension-demo/blob/master/rostc.demo/ranga-hook.lua)

### 提供计划任务程序

在扩展程序目录下提供一个 `cron` 目录，在此目录下提供 lua 文件。

假设你提供了 `aaa.lua` 文件，则用户就可以通过命令行工具或者 Web 控制台添加 `你的控制程序包名 aaa 参数` 此计划任务，定期以调用。扩展程序也可以自行通过系统 API 完成这个操作，但是我们建议将选择权交给用户。

参数会通过 `RANGA_CRON_ARGS` 环境变量传递给扩展程序，扩展程序可以调用 `os.getenv` 取得。

可以参考 DEMO：[https://github.com/nswa-project/ranga-extension-demo/blob/master/rostc.demo/cron/test.lua](https://github.com/nswa-project/ranga-extension-demo/blob/master/rostc.demo/cron/test.lua)

### Web 控制台

在扩展程序目录下提供一个 `webcon` 目录，并在此目录下提供 Web 控制台的 HTML、JS、CSS 等资源，然后安装扩展程序后即可切换到此扩展程序提供的 Web 控制台，详情请参考 [NSWA Ranga 默认 Web 控制台源码](https://github.com/nswa-project/ranga-webcon/)。

在开发过程中，我们建议使用 NGINX 反向代理来调试 Web 控制台，以避免频繁安装扩展程序导致对擦除寿命有限的闪存设备造成不可逆的损伤，在 “NSWA Ranga 默认 Web 控制台源码” 中的 README 文件中对此有详细说明。

### Web 控制台应用

在 manifest 中将 `%wcapp` 设置为 `v1`，并设置 `%wcappv1-name` 为应用名字。

随后，将可以在默认 Web 控制台（或者支持此标准的第三方 Web 控制台）上的“附加组件”页中看到你的应用。

```
%wcapp: v1
%wcappv1-name: <YOUR APP NAME>
```

在扩展程序目录提供 `wcapp-v1.html` 文件，此文件将会在用户进入应用作为 iframe 嵌入 Web 控制台。

在此 html 文件中，可以通过 `parent` 访问 Web 控制台的功能。以下是默认 Web 控制台承诺的 wcappv1 稳定 API

```javascript
let ranga = parent.ranga,
	utils = parent.utils,
	webcon = parent.webcon,
	dialog = parent.dialog,
	defErrorHandler = parent.defErrorHandler;
```

```
ranga.api.config
ranga.api.action
ranga.api.query
ranga.api.disp
ranga.parseProto
ranga.errstr
utils.getUNIXTimestamp
utils.formatBytes
utils.ajaxGet2
utils.raw2HTMLString
utils.getLocalStorageItem
utils.isNil
utils.promiseDebug
utils.delay
utils.idbPut
utils.idbGet
utils.idbRemove
dialog.adv
dialog.show
dialog.simple
dialog.toast
dialog.textwidget
webcon.addButton
webcon.lockScreen
webcon.unlockScreen
webcon.updateScreenLockTextWidget
webcon.dropDownMenu
webcon.sendNotify
webcon.closeNotify
defErrorHandler
```
请参考 [NSWA Ranga 默认 Web 控制台源码](https://github.com/nswa-project/ranga-webcon/) 以获取这些函数的用法。

Web 控制台上还有很多其他函数，但是未列出的函数不保证在扩展程序 API 版本 1 期间保持稳定，请谨慎使用！

### 分发静态资源

旧 NSWA 提供了扩展程序静态资源接口，从而允许轻易分发静态资源，但是，NSWA Ranga 暂时不提供相关接口，在未来版本的 API 中可能提供。

### 后台进程

尚未实现，在未来版本的 API 中可能提供。

## 扩展程序 Lua API

NSWA Lua 基于 lua 5.1 ，但未实现标准 Lua 的以下函数 `debug.debug debug.getregistry os.execute os.remove os.rename os.tmpname load dofile loadfile setfenv getfenv`

而且只能调用这些 io 函数 `io.close, io.read, io.write, io.flush`

`require` 函数可以加载几个额外的库

同时，NSWA Ranga 为扩展程序提供了特殊 API

### ranga.checkuser 函数

检查用户是否登录了超级用户，扩展程序无需关心 NSWA 鉴权体系的细节。

返回值：（布尔）true 表示超级用户鉴权通过，false 超级用户鉴权没有通过。

### ranga.gettoken 函数

> 扩展程序很少需要调用此低级 API，而只需要直接使用 “Ranga 系统 API 接口包装 API”（见下文）

获取一个仅限扩展程序使用的超级用户令牌，通过此令牌，扩展程序将可以模拟超级用户的操作。此令牌允许设置在 cookie 中即可生效。注意，此令牌只能通过大部分的 NSWA Ranga 超级用户鉴权，有时是无效的

返回值：（字符串）令牌

### ranga.luaload 函数

类似于标准 lua 的 `dofile()` 函数，可以加载一个其他 lua 文件执行

参数1：lua 文件名称，格式 `扩展程序包名/.../lua文件名`

例如我有一个扩展程序 `foo`，在扩展程序的 `bar.lua` 文件中希望调用扩展程序目录下的 `abc.lua`，则可以

```lua
nswa.luaload("foo/abc.lua")
```

如果 abc.lua 中只包含函数，那么执行后 abc.lua 的全局函数在 bar.lua 中就可以使用了。

允许加载其他扩展程序的代码，这样可以构建彼此依赖的扩展程序，节省空间。

同时，我们将会向你展示 `ranga.ext.base` 提供的更多包装 API，将通过此接口加载。

返回值：nil

### ranga.openfile 函数

类似于标准 lua 的 `io.open()` 函数，返回一个文件句柄或 nil

参数1：名称，格式 `扩展程序包名/.../文件名`

参数2：模式，默认为 `r`，读文件

返回值：（文件）打开的文件或 nil

### ranga.tmpfile 函数

打开一个临时文件，临时文件存储在内存（而不是闪存）中，因此断电会自动清除。这个提示不应该被理解为临时文件在不再用到时不需要清除。

参数1：名字

参数2：模式，默认为 `w`，写文件

返回值：（文件）打开的文件或 nil

### ranga.tmpfree 函数

清除临时文件

参数1：名字

返回值：nil

### ranga.lsdir 函数

列出目录的内容

参数1：名称，格式 `扩展程序包名/.../...`

返回值：（table）文件名-类型的表。类型包括 0: 目录，1: 普通文件，-1: 未知

### ranga.openlog 函数

打开日志管道，用于将消息写入系统日志

参数1：标记的名字，方便用户检索，例如 demo.abc 扩展程序可以将自己的名字设置为 `extension demo.abc`

返回值：nil

### ranga.syslog 函数

将消息写入系统日志

参数1：要写入日志的消息，会自动在字符串尾部添加一个换行符

返回值：nil

### ranga.proto.prepare 函数

准备开始发送 [Ranga 数据交换协议](devman-proto.html) 的头部。

在调用之前不得有任何输出。

返回值：nil

### ranga.proto.header 函数

发送一个 [Ranga 数据交换协议](devman-proto.html) 的头部。

在调用之前不得有任何输出。

参数1：Key

参数2：值

返回值：nil

### ranga.proto.content 函数

结束 [Ranga 数据交换协议](devman-proto.html) 的头部，准备发送载荷。

在调用之前不得有任何输出。在调用后即可随意输出。

返回值：nil

## 系统扩展程序提供的包装 API

### ranga.ext.base::utils.sys - Ranga 系统 API 接口包装 API

```lua
ranga.luaload("ranga.ext.base/utils/sys.lua")
```

此包装 API 提供了 Ranga 系统 API 的包装，包括以下三种

```lua
sys.config("target", {...})
sys.query("target", {...})
sys.action("target", {...})
```

API 有意设计成与[命令行客户端](intro-cmdline.html)相似的结构，因此，调用系统 API 变得简单

例如，[命令行客户端](intro-cmdline.html) 的此接口

```bash
$ ranga-cli query network
```

可以写成

```lua
sys.query("network")
```

```bash
$ ranga-cli config interface get netkeeper type
```

可以写成

```lua
sys.config("interface", {"get", "netkeeper", "type"})
```

返回值有两个，系统 API 完全遵守 [Ranga 数据交换协议](devman-proto.html) 规范，因此返回值包括头部和载荷两部分

```lua
local header = {}
local payload = ''

header, payload = sys.config("interface", {"get", "netkeeper", "type"})
```

例如，可以检查头部字段 `code` 判断是否成功，通过载荷获取数据。详情请参考 [Ranga 数据交换协议](devman-proto.html)。

### ranga.ext.base::utils.cgiutils - CGI 实用 API

```lua
ranga.luaload("ranga.ext.base/utils/cgiutils.lua")
```

#### cgiutils.parsequery

解析 URI 的 QUERY 部分，并将结果进行解码。

参数 1：QUERY 字符串

返回值：table

```lua
ranga.luaload('ranga.ext.base/utils/cgiutils.lua')
query = cgiutils.parsequery(os.getenv('QUERY_STRING'))
```

## 额外的库

### luasocket

> luasocket 的 socket 和 HTTP 等大部分功能可以使用，但 smtp 包装不可用。

可以和正常的 Lua 一样使用，例如，luasocket 的 HTTP 功能

```lua
local http = require "socket.http"
local ltn12 = require "ltn12"

headers = {
	["Connection"] = "close",
	["User-Agent"] = "demo/0.1 (test) luasocket"
}

local respbody = {}
local x, code = http.request {
	method = "GET",
	url = "http://127.0.0.1",
	headers = headers,
	sink = ltn12.sink.table(respbody)
}

if x ~= 1 or code ~= 200 then
	print("failed")
end

respbody = table.concat(respbody)
print(respbody)
```

## 打包与安装

使用 Info-ZIP 或者其他 ZIP 归档实用程序将扩展程序目录（包含 manifest 文件）打包成 ZIP 归档文件。

你需要归档目录的内容，但是不能包含目录本身。

如果你使用 Info-ZIP，你只需要运行类似于这样的命令即可。

```bash
$ (cd directory; zip -FSr ../xxx.zip .)
```

如果你使用其他 ZIP 归档实用程序，请参考其手册以按要求进行归档。

可以通过[命令行客户端](intro-cmdline.html)安装扩展程序归档或者在默认 Web 控制台中上传安装扩展程序归档。如果你使用命令行客户端，你只需要运行类似于这样的命令即可。

```bash
$ ranga-cli auth -p
$ ranga-cli addon install-extension xxx.zip
```

## 扩展程序的调试

### ranga.ext.base 提供的“内省” API

ranga.ext.base 提供的“内省” API 可以检查扩展程序提供的 API 结构。有时候可能比较有用。例如用户想弄清楚扩展程序到底提供了哪些 API 时。如果扩展程序设计成以空参数调用 API 时输出 usage，那么用户可能更便于获取 API 的使用方法。

```bash
$ ranga-cli addon invoke ranga.ext.base ext.introspect <扩展程序包名> <目录>
```

例如，我们内省“DEMO”扩展程序的 API

```bash
$ ranga-cli addon invoke ranga.ext.base ext.introspect rostc.demo /
> ext: rostc.demo
> dir: /

+ test
@ hello_browser
@ helloworld

$ ranga-cli addon invoke ranga.ext.base ext.introspect rostc.demo /test
> ext: rostc.demo
> dir: /test

@ luasocket
@ io
@ log
@ sys
@ error
@ args
```

### 统一 API 调用接口的“调试”选项

当启用 `--debug` 选项时，将会显示扩展程序的原始输出，并且，如果发生了 Lua 异常，则会显示错误信息和堆栈回溯

```bash
$ ranga-cli addon invoke rostc.demo test.error
Invalid argument

$ ranga-cli addon invoke --debug rostc.demo test.error
!!! debug mode on
Content-type: text/plain; charset=utf-8

code: 1

$ ranga-cli addon invoke --debug rostc.demo test.error luaError
!!! debug mode on
Content-type: text/plain; charset=utf-8

/usr/bin/lua: /extensions/rostc.demo/api/test/error.lua:6: attempt to call global 'noSuchFunction' (a nil value)
stack traceback:
	/extensions/rostc.demo/api/test/error.lua:6: in function 'f'
	/extensions/ranga.ext.base/extloader.lua:123: in main chunk
	[C]: ?
code: 1
```

### 通过日志调试扩展程序

使用“Ranga 扩展程序统一调用接口”调用扩展程序代码时，出错时错误堆栈跟踪会自动写入系统日志。以及，扩展程序通过 Ranga 提供的 API 主动将消息写入系统日志。

开发者可以通过[命令行客户端](intro-cmdline.html)或者默认 Web 控制台访问系统日志。如果你使用命令行客户端，你只需要运行类似于这样的命令即可。

```bash
$ ranga-cli auth -p
$ ranga-cli query log
```

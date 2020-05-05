# NSWA Ranga 数据交换协议

## 数据交换协议是纯文本的

### 为何不采用返回 JSON 的 REST API ？

或许对某些客户端来说使用这些技术可以节省成本，但是 NSWA Ranga 的服务器和客户端充斥大量 Shell 脚本，尤其是服务端为了照顾小闪存设备不方面安装像 jshon 等 shell 脚本 json 解析器。因此 NSWA Ranga 使用非常朴实的纯文本。

数据交换协议类似于 HTTP/1.1，它具有一个头部（header）和剩余的载荷（payload）

```
key: value\n
key: value\n
key: value\n
\n
payload
```

和 HTTP 协议不同之处在于，NSWA Ranga 数据交换协议没有专门的协议版本而倾向于使用 key-value 对进行自我描述，NSWA Ranga 数据交换协议使用 `\n` UNIX 换行符而不是 HTTP 的 `\r\n` DOS 换行符。

数据交换协议头部必须使用 UTF-8 编码。除非存在 `content-encoding` 或 `content-type` 头部指明，否则文本格式的 payload 必须使用 UTF-8 编码。实现可以不实现其他编码支持。

## 头部字段

只有 `code` 是必须字段，其他字段均为可选字段

以下字段被保留并且必须不出现，实现可以假定这些字段不会出现

- payload

- ranga

- 以下划线 `_` 开头的任何字段

### code

操作的状态吗。请参考 [命令行工具手册](intro-cmdline.html) 中的“NSWA Ranga 系统错误代码”节。

客户端必须检查此状态码。并应该在非 0 状态码时显示相应的错误信息。

### error-origin

指定错误的起源

- invoke-ext

	表明 code 是在试图通过“Ranga 扩展程序统一 API 调用接口”调用某个扩展程序，但是却没有成功唤起扩展程序，例如扩展程序不存在、扩展程序未提供此 API 等。

### content-type

指示 payload 的类型，并可能影响客户端的后续操作。

- dispTargetsList

	表明 payload 是执行像 `ranga-cli config` 这样带有子命令（目标）的命令，服务器检查自己支持哪些子命令（目标）并展示出来，此时 payload 是一个以 `\n` UNIX 换行符分割的列表。同时会附带 `disp-section` 字段。

- dispOutput

	表明 payload 是执行像 `ranga-cli config <section> ...` 这样带有子命令（目标）的命令，经过转发之后的 section 的输出。

- authToken

	表明 payload 是执行鉴权后的 Token。同时会附带 `token-meta` 字段。服务器返回的 Token 数据中必须不出现 `\n` UNIX 换行符字节、`\r` 回车符字节、`\` 字节、`&` 字节和 `%` 字节，以便客户端实现可以保证这一点。

- extInstaller

	表明 payload 是扩展程序安装辅助程序的原始输出。

- extensionManifest

	表明 payload 是一个扩展程序的清单文件

- extensionsList

	表明 payload 是一系列扩展程序的列表，此时 payload 是一个以 `\n` UNIX 换行符分割的列表。

- extensionAPI

	表明 payload 是通过“Ranga 扩展程序统一 API 调用接口”调用的扩展程序的输出。

- componentsList

	表明 payload 是已部署的系统组件的列表和这些组件的详细信息。每个组件的开始行符合此正则表达式 `^COMPONENT UUID \(.*\)$`

- octetStream

	二进制数据，客户端的行为由实现定义。

### disp-section

当 `content-type` 为 `dispTargetsList` 指明 section 类型，例如 `ranga-cli config` 中 section 为 `config`

### token-meta

Token 的元数据，每条以 `;` 分割。

```
v1;ascii64;octet
```

v1 - 版本 1

ascii40 - Token 由 40 个 ASCII 字符组成

ascii64 - Token 由 64 个 ASCII 字符组成

octet - 使用 8 位字节存储 ASCII 数据，否则为 7 位字节

实现应该检查此字段，如果实现不检查此字段，则必须将 Token 视为 Blob 使用。

### target-notfount

为 true 表明 payload 是执行像 `ranga-cli config` 这样带有子命令（目标）的命令，但是目标不存在

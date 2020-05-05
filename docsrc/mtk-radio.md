# 联发科无线电芯片常见问题

## 需要先了解的信息

- **开源驱动程序**: 来自 [Linux Wireless](https://wireless.wiki.kernel.org/) 或者 [OpenWrt MT76](https://github.com/openwrt/mt76) 的驱动程序，这些驱动程序符合 Linux 现代无线标准（CFG80211 接口或 MAC80211 堆栈），可以使用 NL80211（Linux 内核规定的驱动程序提供给应用程序的无线 API 规范）进行配置和管理。因此在所有 NSWA Ranga 设备上表现出几乎完全一致的观感。

- **联发科专有驱动程序**: 来自联发科制作的驱动程序，联发科的专有驱动程序没有开源许可证。也就是说，获取源代码的唯一合法方法是签署保密协议并从 MediaTek 获取代码。联发科专有驱动程序不使用 CFG80211（联发科专有驱动程序具有“残废级别”的 CFG80211 支持，我们没有使用），使用 Wireless Extension 堆栈和大量的私有的 stuff（比如驱动直接读配置文件）。

**NSWA Ranga 默认使用开源驱动程序，但也允许你轻松切换为联发科专有驱动程序**

联发科专有驱动程序则是由联发科提供，能提供几乎等价与原厂的无线性能。开源驱动能在所有 NSWA Ranga 设备上表现出几乎完全一致的观感。但联发科专有驱动程序不能，并且很多 NSWA 提供给用户的功能无法使用。如无法列出接入的客户端等等。（详见系统“附加驱动”配置页面）

联发科专有驱动程序支持 Full-MAC 设备，开源驱动仅支持在 Soft-MAC 模式下工作。使用 Full-MAC 可以节省 CPU 性能，因为很多工作被卸载（offload）到硬件中进行。使用 Soft-MAC 则更加灵活可配置（例如，新的无线功能可以在旧硬件上实施），但必须为此付出更多 CPU 开销。

## 上游主线 mac80211/MT76 驱动程序

## 说明

NSWA Ranga 使用 OpenWrt 团队的 mt76 驱动程序驱动部分联发科无线电芯片（并非全部，因此支持的设备见下表）。对于 MT7620，NSWA Ranga 也允许你切换到联发科发布的专有驱动程序。但是，为了稳定，NSWA Ranga 使用的 mt76 驱动程序版本是较早期版本，上游已经有了很多问题修复，用户可能希望使用最新版本以减少无线问题。。

用户可以使用我们创建的 [mt76-backports](https://github.com/nswa-project/mt76-backports) 工具轻松反向移植编译主线 MT76 驱动程序

相关 URIs

https://backports.wiki.kernel.org/index.php/Main_Page

https://github.com/openwrt/mt76


芯片|频率|之后
------|------------|-----------
rt2860|2.4GHz|替换为上游树内版本
mt7603e|2.4GHz|是的（mt76）
mt7612e|5GHz|是的（mt76）

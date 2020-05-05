# NSWA Ranga Web 控制台主题 HowTo

> 当前 Web 控制台主题兼容级别为 1，当 Web 控制台发生破坏性的更改后，兼容级别会改变，主题必须重新制作。

主题是一个 CSS 文件，可以对 Web 的任意样式进行覆盖。

## 覆盖主要配色

默认主题的配色方案如下，你可以根据此配色方案修改出新的配色方案。

```
body {
	--theme-color: #08c;
	--theme-color-hover-bg: rgba(0, 136, 204, 0.25);
	--theme-color-hover-a: #005580;
	--theme-color-disabled: #4e4e4e;
	--theme-color-disabled-bg: #f0f0f0;
	--theme-color-selection: black;
	--theme-color-selection-bg: #b3e5fc;
	--theme-color-input-bg: #f1f3f4;
	--theme-color-input-hover-bg: #e8eaed;
	--theme-color-input-placeholder: #555555;
	--theme-color-select-fg: #202124;
	--theme-color-select-foucs-shadow: rgba(26, 115, 232, 0.4);
}
```

其中

`--theme-color` 主题色，如按钮、checkbox、普通状态的超链接等

`--theme-color-hover-bg` 按钮激活状态下的背景颜色，通常为 `--theme-color` 加上 0.25 的透明度

`--theme-color-hover-a` 超链接激活状态下的颜色

`--theme-color-disabled` 被禁止状态下的颜色

`--theme-color-disabled-bg` 被禁止状态下的背景颜色

`--theme-color-selection` 选中部分的文字颜色

`--theme-color-selection-bg` 选中部分的背景色

`--theme-color-input-bg` 输入框的背景色

`--theme-color-input-hover-bg` 输入框激活时的背景色

`--theme-color-input-placeholder` 输入框占位符的颜色

`--theme-color-select-fg` 选择框的文字颜色

`--theme-color-select-foucs-shadow` 选择框获取焦点时阴影边框的颜色

## 设置背景图片

```
body {
	background-image: url(data:image/webp;base64,UklGRjQRBQBXRUJQVlA4ICgRBQAwlhmdASowDyAKPpFInkylpCmloVLo4TASCWlnNL3//9e/Z///O+/Cf/+tB//lP/O//3QH//8cD3f//zs///rL/z///1Zmo3/a523//6qP8f//31p0fhQaf+p/9/9LjzZUcy/5/vP+H///K3df+s5a/kf+3+7fqzv2PlfUF4GdAT94/VC/+eeH+z/+XVC//.............);
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center center;
}

#main {
	opacity: 0.82;
}	
```

将背景图片使用 DATA URI 存储在 CSS 里，为了使数据尽可能小，我们建议使用 Webp 格式有损压缩，将比 jpeg 或者 png 节省 70% 以上的存储！当然，你也可以使用 jpeg 或者 png。

```
url(data:image/webp;base64,<BASE64 DATA>)
url(data:image/jpeg;base64,<BASE64 DATA>)
url(data:image/png;base64,<BASE64 DATA>)
```

把 `opacity: 0.82;` 属性添加到 `#main` 以使 Web 控制台部分透明

> 如果你的编辑器在编辑长行时假死或者崩溃，请更换一个好用的编辑器。
>
> 可以使用 `cwebp` 命令创建 Webp 图像
> ```
> $ cwebp 1.jpeg -o 1.webp
> ```
>
> 将图像转换成 BASE64 字符串，并复制到 X11 剪贴板
> ```
> $ cat 1.webp | base64 | tr -d '\n' | xclip -i -selection clipboard
> ```

## 覆盖通知的样式

```
.notify_theme_info {
	--notify-background-color: rgba(0, 136, 204, 0.1);
	--notify-color: #08c;

	--theme-color-hover-bg: rgba(0, 136, 204, 0.25);
	--theme-color: #08c;
}

.notify_theme_warning {
	--notify-background-color: rgba(239, 108, 0, 0.1);
	--notify-color: #ef6c00;

	--theme-color-hover-bg: rgba(239, 108, 0, 0.25);
	--theme-color: #ef6c00;
}

.notify_theme_error {
	--notify-background-color: rgba(255, 0, 0, 0.1);
	--notify-color: #f00;

	--theme-color-hover-bg: rgba(255, 0, 0, 0.25);
	--theme-color: #f00;
}
```

## 做你想做的一切事情

通过覆盖 Web 控制台样式表，你可以随意改造 Web 控制台的观感，例如，你可以覆盖 `.btnFlat`、`.btnFlat:hover`、`.btnFlat:before` 和 `.btnFlat:after` 完全设计自己的按钮而不是仅仅通过主题色进行微调。

你可以通过 Web 控制台的源代码找到要覆盖的样式类。此外，还有一个更简单的方法，直接使用 Google Chrome 或者 Mozilla Firefox 的开发人员工具直接观察你想修改部分的样式类，然后在主题 CSS 文件中覆盖它们！

## 例子

目前在 Ranga 网上应用店 上架的官方主题，可以查看其源代码进行参考。

紫色：https://nswa-project.github.io/was2/themes/ranga.purple.css

橘色：https://nswa-project.github.io/was2/themes/ranga.orange.css

绿色：https://nswa-project.github.io/was2/themes/ranga.green.css

示例：自然背景 + 透明控制台（需要浏览器支持 Webp）：https://nswa-project.github.io/was2/themes/bimg.example.css

## 安装主题以进行测试

将你的代码保存到 CSS 文件，如 `1.css`，进入 Web 控制台，选择“Web 控制台设置”->“手动设置自定义主题”，并选择你创建的文件即可应用你的主题。

在开发过程中，你也可以直接在 Google Chrome 或者 Mozilla Firefox 的开发人员工具中加载主题。

## 将你的作品提交到“Ranga 网上应用店”

敬请期待

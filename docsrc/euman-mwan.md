# NSWA Ranga 多宿主配置教程 - Web 控制台版

> 使用命令行工具进行配置的方法请参考 [命令行工具手册](intro-cmdline.html)

我们假设你已经配置完毕了 'netkeeper' 接口

首先，在 Web 控制台打开“多宿主”页，然后点按“启用多宿主”按钮

![](res-euman-mwan/a1.png)

第二步，设置反向 VLAN 的个数，假如你共要连接 3 个账户，请设置为 2, 假如你共要连接 2 个账户，请设置为 1，以此类推。因为有一个账户是要使用 ‘netkeeper’ 接口进行连接的。

> NSWA Ranga 定义了“反向 VLAN”的概念，计算机网络上没有“反向 VLAN”的概念。从实际上看，站在交换机系统本身的角度，“正向”的、也就是真正意义上的 VLAN 是在交换机系统上使用单个接口，然后将单个接口映射到多个虚拟网络（一到多），那么“反向 VLAN” 的名字来源于相反的含义，它将多个虚拟网络映射到单一接口（多到一）。例如，NSWA 可以使用反向 VLAN 实现在单个 WAN 口上同时建立多条 PPPoE （或其他协议）连接的目的。

![](res-euman-mwan/a2.png)

第三步，转到“接口配置”，选择添加端口。

![](res-euman-mwan/a3.png)

第四步，设置接口名，必须以“md”开头。

![](res-euman-mwan/a4.png)

这是我们添加的地一个接口，假如你共要连接 3 个账户，请添加 2 个接口, 假如你共要连接 2 个账户，请添加 1 个接口，以此类推。因为有一个账户是要使用 ‘netkeeper’ 接口进行连接的。请根据你的情况返回第 3 不。

第五步，点按你添加的接口，进行设置

![](res-euman-mwan/a5.png)

第六步，将协议改为下图所示的协议

![](res-euman-mwan/a6.png)

第七步，启用 Netkeeper 扩展，并点按“设置”按钮

![](res-euman-mwan/a7.png)

第八步，设置用户名密码，点按“设置”按钮

![](res-euman-mwan/a8.png)

第九步，设置反向 VLAN，反向 VLAN 从 0 开始。直到你设置的个数 - 1,每个接口要设置不同的反向 VLAN

这是我们添加的地一个接口，假如你共要连接 3 个账户，请设置 2 个接口, 假如你共要连接 2 个账户，请设置 1 个接口，以此类推。因为有一个账户是要使用 ‘netkeeper’ 接口进行连接的。请根据你的情况返回第5 不。

![](res-euman-mwan/a9.png)

第十步，返回“网络连接”，将新接口连接

![](res-euman-mwan/a10.png)

第11步，连接完成

![](res-euman-mwan/a11.png)

第12步，返回“多宿主”页，找到“负载均衡”，选择 netkeeper接口，将他添加到负载均衡列表

![](res-euman-mwan/a12.png)

第13步，返回“多宿主”页，找到“负载均衡”，选择你添加的所有接口，将他们添加到负载均衡列表

![](res-euman-mwan/a13.png)

第14步，点按“重启负载均衡服务”按钮

![](res-euman-mwan/a14.png)

第15步，点按“负载均衡状态”按钮，查看配置是否正确

![](res-euman-mwan/a15.png)

最后，你可以使用 speedtest.net，**选择正确的节点**，进行**多线程**测速！


---
title: MongoDB 初始化副本集
tags: [数据库, MongoDB]
createdAt: 2023-05-19T12:37:46+09:00
modifiedAt: 2023-07-09T15:08:20+09:00
---

本文介绍了在使用 MongoDB 数据库时为什么不使用 Standalone 模式，并详细说明了如何初始化 MongoDB 的副本集。

<!--more-->

## 为什么不使用 Standalone？

MongoDB 是一种功能强大且灵活的 NoSQL 数据库，默认情况下，自托管的 MongoDB 服务器会以单节点 Standalone 的模式运行。然而这个模式没有读写分离、自动故障转移等实用功能。此外，许多功能，比如 Change Stream、retryable writes 或者 transaction 在 Standalone 中没有提供。

因此即使是测试环境，我们也需要建立一个单节点的副本集，以使用全部 MongoDB 的功能。

配置副本集没有那么直观，我们需要两步：

1. 配置文件设置
2. 初始化副本集

因为经常会忘记步骤，在这里记录下以供参考。

## 配置文件设置

首先，我们需要寻找 MongoDB 的配置文件，它通常是 `YAML` 格式的。如果是在 Windows 中安装的话，它可能位于 `C:\Program Files\MongoDB\Server\6.0\bin` 目录下。而在 Linux 操作系统中，它通常位于 `/etc/mongod.conf`。

我们可以编辑这个文件，添加以下配置项来启动副本集：

``` yaml
replication:
  replSetName: rs0
```

在完成配置文件的设置后，我们需要重启 MongoDB 服务以应用更改。

## 初始化副本集

然而，重启服务后，客户端通常无法立即连接到 MongoDB 实例。这是因为我们还没有初始化 MongoDB 副本集实例。

下面的步骤需要连着 MongoDB 服务器实例执行。我们有许多方式可以连接，最简单的方式是使用一个名为 `mongosh` 的 shell 工具。它可以从 [MongoDB Shell (mongosh) — MongoDB Shell](https://www.mongodb.com/docs/mongodb-shell/) 上下载到。

我们通过 `mongo`sh 命令进入 MongoDB 的交互式命令行。然后输入：

```js
rs.initiate()
```

这样，我们就成功完成对副本集的初始化。

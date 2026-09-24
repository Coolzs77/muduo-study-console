---
title: "星球Muduo库项目文档版本二"
doc_id: 201974298
slug: "qye2x5fwpfm37d0d"
url: "https://www.yuque.com/chengxuyuancarl/gixnqn/qye2x5fwpfm37d0d"
word_count: 369
updated_at: "2025-03-14T08:58:53.000Z"
retrieved_at: "2026-09-24 13:45:00"
status: "FULL"
---

# 星球Muduo库项目文档版本二

> 原始链接: [https://www.yuque.com/chengxuyuancarl/gixnqn/qye2x5fwpfm37d0d](https://www.yuque.com/chengxuyuancarl/gixnqn/qye2x5fwpfm37d0d)  
> 访问密码: `khf4` | 更新时间: 2025-03-14T08:58:53.000Z | 字数: 369

---

lake

版本二相对于版本一优化点如下：

## 总体：

优化了整体的布局， **将每一个部分做什么做了详细的划分** ，比起之前的文章内容显的冗余，现在可以根据自己需要学习的内容做一个快速的复习。

## 细节：

一、

细节上增加了原作者并未提及到的类如TcpServer，修改了Tcpconnection做了更加详细的补充，并且也在其中留下了自己思考的疑问和解答。

二、

增加了学习建议，内容有学习项目的时间，分基础不同的朋友做这个项目有一个大概的时间，学习项目的时间不会很长，并且说明了项目的代码数量，以及每天要花时间的多少。

学习这个代码技术的要求，版本环境、参考的书籍方便你更好的上手这个项目！

三、

补充了部分理论知识均在代码中指出了链接地址，比如：Reactor的模型.

四、

在项目难点中补充了Channel::handlEvent中， `std::shared_ptr<void> guard = tie_.lock();` 除了可以延迟Tcpconnection的生命周期保证数据发送完毕后才断开连接，并且TcpConnection沿用shared智能指针的目的是为了防止原始指针被删除造成其他地方的悬空指针。

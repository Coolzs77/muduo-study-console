# CppAIService & muduo 源码学习控制台 (Muduo Study Console)

个人 C++ 网络编程与服务架构学习控制台。系统整合 muduo (C++11) 网络库机制与 CppAIService (C++17) 服务架构，提供章节伴读、架构拓扑映射、避坑指南、学习计时与自测题库。

---

## 功能模块

- **技术栈**：基于原生 JavaScript / CSS 与 HTML 构建，提供单文件离线运行（`classic.html`）与模块化开发支持。
- **书卷伴读系统**：
  - **页码跳转 (`#page=xxx`)**：支持点击章节在浏览器新标签页打开对应 PDF 并定位物理页码。
  - **Readest 联动**：支持复制章节与页码锚点，并通过 `readest://` 协议唤起本地 Readest 客户端。
  - **对照体系**：涵盖《Linux 多线程服务端编程：使用 muduo C++ 网络库》专题与《C++ Primer Plus》第 18 章 C++11 特性。
- **专注计时模块**：
  - 提供倒计时与顺计时、暂停、重置与学习记录保存功能。
  - 任务分类：代码编写、文档研读(Readest)、问题调试。
- **架构拓扑映射**：
  - 提供交互式 SVG 拓扑图，展示 `EventLoop`、`Channel`、`EpollPoller`、`TcpConnection`、`Buffer` 的调用流程与线程归属。
  - 提供 CppAIService 服务链路拓扑（网关、线程池、协议解析、推理服务、异步消息队列）。
- **避坑要点与题库**：
  - 收录 SIGPIPE 处理、对象析构生命周期、shared_from_this 等常见陷阱与调试规范。
  - 提供 28 天知识点自测与掌握度记录。

---

## 本地运行与开发

```bash
# 1. 克隆代码仓库
git clone https://github.com/Coolzs77/muduo-study-console.git
cd muduo-study-console

# 2. 安装依赖
npm install

# 3. 启动本地开发服务器
npm run dev

# 4. 构建静态资源
npm run build
```

---

## 参考书目与工程目录

系统默认关联存放于 `e:/workspace/C++_learning/` 目录下的资料：
1. **《Linux 多线程服务端编程：使用 muduo C++ 网络库》**（陈硕著）
2. **《C++ Primer Plus：中文版（第6版）》**（Stephen Prata 著）

---

## 在线访问与单文件版本

- **在线地址**：[https://coolzs77.github.io/muduo-study-console/](https://coolzs77.github.io/muduo-study-console/)
- **单文件版本**：[classic.html](./classic.html)（无需 Node.js 构建，可直接在浏览器中打开）。


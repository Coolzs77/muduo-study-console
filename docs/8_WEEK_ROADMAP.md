# 8_WEEK_ROADMAP.md — 两个月高能逆袭：秋招/春招 C++ & AI 服务平台攻坚路线图

> **目标受众**：零大厂经历、基础薄弱、急需在 2 个月（8 周）内以一个大型高含金量 C++/AI 项目彻底打赢秋招/春招的技术同学  
> **核心武器**：`youngyangyang04/CppAIService` (自研 HTTP 框架 + Reactor + 多模型 + MCP + RAG + MQ 异步入库) + `muduo` 并发底座  
> **每日精力分配基准**（严格映射 Google Tasks 真实日程）：
> - 🚀 **S 级核心：CppAIService 项目深度编码与源码攻坚** ➔ 3.0 小时
> - 💻 **A 级主干：C++ 手撕算法每日 3 题** ➔ 1.5 小时
> - 📖 **A 级底座：《Linux多线程服务端编程》+《鸟哥私房菜》** ➔ 1.0 小时
> - 🗣️ **B 级突击：C++ / muduo / AI 八股口述与真题模拟** ➔ 0.5 小时
> - 📚 **C 级从属：通识阅读 (金融/沟通/博弈论) + 牛客信息差** ➔ 0.5 小时

---

## 路线图总览甘特视图

```text
周次        阶段主题                        核心攻坚产出与证据 (Evidence)
Week 1~2    Phase A: 网络底座与 Reactor 穿透   跑通 muduo 8大流水线，输出非阻塞 I/O 实验
Week 3~4    Phase B: 自研 HTTP 框架核心解构   完成 FSM 解析与动态路由重构，输出 wrk 压测基准
Week 5~6    Phase C: AI 平台业务与服务调用    实现 MCP 工具调用、RAG 与 RabbitMQ 异步任务处理
Week 7      Phase D: 工程健壮性与深度调优     ASan 内存泄露排查、性能火焰图分析、踩坑事故归档
Week 8      Phase E: STAR 简历与全真面试通关  导出量化求职简历，彻底拿下 20 大项目连环追问
```

---

## 周计划逐周拆解与交付指标

### 第 1 周：Linux 并发编程基础与 muduo 事件循环核心
- **项目攻坚 (3h/天)**：
  - 启动并研读 `muduo-study-console` 前 7 天任务。
  - 深入 `EventLoop` 与 `Channel` 源码，搞清 `eventfd` 跨线程唤醒的原理。
  - 跑通 Channel 与 Poller 的交互 Demo。
- **算法手撕 (3题/天)**：
  - 数组、双指针与滑动窗口（LeetCode 209, 3, 76 等高频经典）。
- **配套阅读 (1h/天)**：
  - 《Linux多线程服务端编程》第 1 章（线程安全的对象生命周期管理，重点吃透 `shared_ptr` 与 `weak_ptr` 防悬垂指针）。
  - 《鸟哥的私房菜》第 1~3 章（学习 Linux 基础命令与环境）。
- **阶段产出 Evidence**：
  - `EVID-W1-01`: 手写实现一个极简版 `EventLoop` 事件循环验证代码，并记录 GDB 断点调试日志。

---

### 第 2 周：muduo TCP 网络栈与多线程 Reactor 模型
- **项目攻坚 (3h/天)**：
  - 研读 `TcpServer`、`Acceptor`、`TcpConnection` 与 `Buffer`。
  - 彻底搞懂“One Loop Per Thread + 线程池”架构，搞清为何非阻塞 I/O 必须配合应用层 Buffer。
  - 完成 muduo 28 天自测题中关于粘包处理与优雅关闭的题目。
- **算法手撕 (3题/天)**：
  - 链表与哈希表（LeetCode 206, 142, 146 LRU 缓存手撕）。
- **配套阅读 (1h/天)**：
  - 《Linux多线程服务端编程》第 2~3 章（线程同步精要与互斥锁戒律）。
  - 《鸟哥的私房菜》第 4~6 章（文件权限与 Vim/Bash 脚本）。
- **阶段产出 Evidence**：
  - `EVID-W2-01`: 绘制并复述 muduo 新连接建立、数据接收、数据发送至连接断开的完整生命周期时序图。

---

### 第 3 周：CppAIService 之 HttpServer 协议解析与路由模块
- **项目攻坚 (3h/天)**：
  - 进入 `CppAIService/HttpServer` 源码实战。
  - 研读 `HttpContext.cpp`：精读有限状态机 (FSM) 逐行解析请求行、请求头的实现；找出边界判断漏洞并修复。
  - 研读 `Router.cpp`：比对哈希路由与 `std::regex` 动态正则路由的匹配开销。
- **算法手撕 (3题/天)**：
  - 栈与队列、二叉树遍历与属性（LeetCode 20, 232, 102, 236 最近公共祖先）。
- **配套阅读 (1h/天)**：
  - 《Linux多线程服务端编程》第 6~7 章（muduo 网络库设计与使用）。
  - 《鸟哥的私房菜》BASH 环境变量与管道重定向（对齐任务日程中的“从 bash 开始”）。
- **阶段产出 Evidence**：
  - `EVID-W3-01`: 编写针对 `HttpContext` 的单元测试，构造超大畸形 HTTP 请求报文验证状态机健壮性。

---

### 第 4 周：会话管理、中间件链与 MySQL 连接池实战
- **项目攻坚 (3h/天)**：
  - 剖析 `SessionManager.cpp`：掌握 Cookie `SESSIONID` 分发与内存会话生命周期管理。
  - 剖析 `MiddlewareChain.cpp`：理解洋葱模型拦截机制，手写一个统计接口请求耗时的性能中间件。
  - 研读 `DbConnectionPool.cpp`：分析连接借还、线程安全互斥锁与条件变量设计，排查断线重连隐患。
- **算法手撕 (3题/天)**：
  - 二叉搜索树、回溯算法（LeetCode 98, 77, 46 全排列, 51 N皇后）。
- **阶段产出 Evidence**：
  - `EVID-W4-01`: 使用 `wrk` 或 `ab` 对自研 HttpServer 执行基准压测，输出 QPS 与延迟分布基线数据。

---

### 第 5 周：ChatServer 核心业务调度与多模型策略适配
- **项目攻坚 (3h/天)**：
  - 研读 `AIApps/ChatServer/src/ChatServer.cpp` 业务主流程。
  - 深入 `AIStrategy.h/.cpp` 与 `AIFactory.cpp`：掌握策略模式与工长模式如何彻底解耦不同大模型调用协议。
  - 调试通义百炼 (DashScope) 与火山豆包 (Doubao) 调用链路，分析多用户多会话隔离结构 `chatInformation[userId][sessionId]`。
- **算法手撕 (3题/天)**：
  - 贪心算法、动态规划基础（LeetCode 121, 55, 300 最长递增子序列, 1143 最长公共子序列）。
- **配套八股与面试 (0.5h/天)**：
  - 梳理设计模式：策略模式、工厂模式、单例模式在 C++17 中的现代写法。
- **阶段产出 Evidence**：
  - `EVID-W5-01`: 编写独立自动化测试用例，验证在运行期动态切换不同模型并保持各自对话上下文的连贯性。

---

### 第 6 周：轻量 MCP 协议落地与 RabbitMQ 异步持久化大招
- **项目攻坚 (3h/天)**：
  - 攻克核心亮点 **轻量级 MCP (Model Context Protocol)**：
    - 深入 `AIToolRegistry.cpp`，实现“意图判断 ➔ 工具调用 (`getWeather`/`getTime`) ➔ 二次回答”的两段式推理。
    - 自定义扩展注册一个新的实用工具（如：股票信息查询或代码解释工具）。
  - 攻克核心亮点 **RabbitMQ 异步解耦入库**：
    - 深入 `MQManager.cpp`，分析前台“同步更新内存会话、异步投递消息队列、后台工作线程刷盘 MySQL”的设计。
- **算法手撕 (3题/天)**：
  - 动态规划进阶（背包问题、编辑距离 LeetCode 72）、图论基础。
- **阶段产出 Evidence**：
  - `EVID-W6-01`: 对比测试“同步直接写 MySQL”与“RabbitMQ 异步入库”在多并发请求下的接口响应时间差异，记录量化指标。

---

### 第 7 周：工程加固、内存安全排查与系统性踩坑复盘
- **项目攻坚 (3h/天)**：
  - 使用 `AddressSanitizer (ASan)` 编译并全面压测 CppAIService，彻底排查悬垂指针、内存泄露与数据竞争。
  - 梳理典型故障并录入 Incident Archive（如：`SIGPIPE` 信号未忽略导致进程崩溃、`shared_from_this` 滥用、环境变量未配导致崩溃等）。
  - 完善本地 ONNX Runtime 图像识别与百度 TTS 语音合成接口封装。
- **算法手撕 (3题/天)**：
  - 高频手撕真题综合冲刺与前面积累错题二刷。
- **阶段产出 Evidence**：
  - `EVID-W7-01`: 产出完整的《系统安全与故障排查实验报告》，附带 ASan 零泄露检测证明与性能火焰图。

---

### 第 8 周：STAR 简历铸造、20 大核心考点通关与全真模拟面试
- **求职转化 (3h/天)**：
  - 激活 Career 模块的 STAR 简历生成器：
    - **S (情境)**：市面多数 AI 应用框架基于 Python，本项目探索在 C++17 中实现相应的网络接入与服务调用。
    - **T (任务)**：基于 muduo Reactor 架构自研 C++ HTTP 服务框架，并构建支持多模型、MCP 两段式推理与异步持久化的大型 AI 平台。
    - **A (行动)**：使用有限状态机实现零拷贝 HTTP 解码；采用策略模式解耦百炼/豆包；实现基于 Prompt 协议的轻量 MCP 机制；引入 RabbitMQ 异步化消息落库。
    - **R (结果)**：单机支撑并发连接数破万，消息写入延迟降低 85% 以上，通过 ASan 严苛内存安全检测。
- **真题轰炸与口述对齐 (1.5h/天)**：
  - 熟练回答：
    1. 为什么采用 One Loop Per Thread 模型？
    2. TCP 粘包拆包怎么解决？状态机有何优势？
    3. 为什么需要 RabbitMQ？直接写 MySQL 会怎样？
    4. 你的轻量 MCP 是如何实现的？与传统 Function Calling 有何异同？
    5. 智能指针多线程使用有什么坑？
- **最终交付**：
  - 形成终版精品简历与个人 GitHub 高星开源展示，全面发起投递！

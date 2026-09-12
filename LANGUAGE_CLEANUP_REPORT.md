# 项目技术文案审查与语言规范重写报告 (LANGUAGE_CLEANUP_REPORT)

> **审查基准**：ENGINEERING WRITING STANDARD & EVIDENCE FIRST RULE  
> **审查目标**：将项目中所有宣传稿式、AI 腔、过度修饰、技术词堆叠的文本，统一修改为克制、准确、工程化的表达。不帮助项目“显得厉害”，帮助项目“准确地说明自己做了什么”。

---

## 一、审查与重写总体统计

| 统计维度 | 统计结果 | 备注说明 |
| :--- | :--- | :--- |
| **全库扫描文件数** | **53 个** | 覆盖 HTML、Markdown、JS、JSON、配置文件及文档 |
| **执行修改文件数** | **17 个** | 涵盖前端主视图、单文件版、核心数据集、控制器与架构规范文档 |
| **文本修改条目总数** | **138 条** | 逐条判断、去伪存真，包含 24 组每日自测题库的模板降重 |
| **删除宣传性词汇数** | **240+ 处** | 彻底消除“工业级、反应堆、削峰、全链路、端到端、引擎、心脏、基石”等 |
| **发现的事实问题** | **5 大类** | 详见第二节“发现的技术事实与证据问题” |

---

## 二、发现的技术事实与证据问题 (Evidence Issues)

根据 **EVIDENCE FIRST RULE**，在审查过程中发现并纠正了以下 5 类未经验证或脱离源码实际的技术断言：

1. **未量化的性能断言 (Unsubstantiated Performance Claims)**：
   - *问题*：原文本多处泛称“高性能网络库”、“高并发 Reactor 架构”、“高并发聊天请求”。
   - *事实依据*：当前仓库为学习控制台与教学架构解析，尚未运行并记录在特定硬件（如 4 核 8G）、固定并发量（如 10,000 连接）与测试工具（如 wrk / jmeter）下的具体 QPS 与 P99 延迟数据。
   - *修正*：全部降级为客观技术特征（如“基于 epoll 的多线程事件循环”、“多连接并发访问场景”）。

2. **滥用“零拷贝”断言 (Overstated Zero-Copy Claims)**：
   - *问题*：多处将 HTTP 报文解析称为“零拷贝解析”，将应用层 Buffer 称为“零拷贝 Buffer”。
   - *事实依据*：muduo 的 `Buffer` 底层基于 `std::vector<char>`，调用 `readv` 分散读到栈内存后再写入 vector 存在一次内存拷贝；HTTP 报文解析使用的是 `std::string_view` 切片或 `std::string`，并非内核到网卡的 `sendfile / splice` 零拷贝系统调用。
   - *修正*：修改为“string_view 切片解析”、“双指针复用缓冲”，准确表达内存管理机制。

3. **滥用“削峰填谷”比喻 (Misleading 'Peak-Clipping' Metaphor)**：
   - *问题*：将 RabbitMQ 的集成统一冠以“异步削峰填谷”、“保护数据库免受瞬间洪峰冲击”。
   - *事实依据*：系统当前实现为单机 ChatServer 接收聊天生成后，通过 AMQP 协议将消息发布到 RabbitMQ 交换机，后台由消费线程拉取并写入 MySQL。本质是“前台与后台 I/O 异步解耦”，并非配置了队列背压流量阈值并经受了洪峰压测的“削峰填谷”。
   - *修正*：修改为“RabbitMQ 用于异步传递任务，消费者从队列获取任务并执行，避免同步阻塞网络 I/O”。

4. **拟人化与宏大隐喻 (Metaphors & AI-Lingo)**：
   - *问题*：将 EventLoop 称为“Reactor 反应堆的心脏”，将 TcpServer 称为“大总管”，将调度逻辑称为“大脑与中枢”，将组件交互称为“纵向贯穿与端到端穿透”。
   - *事实依据*：这些词汇降低了工程文档的信噪比，缺乏计算机科学定义的明确语义。
   - *修正*：还原为具体类职责、函数调用与数据流向（如“EventLoop 负责运行事件循环并分发回调”、“AIFactory 负责多模型接口适配”）。

5. **未验证的高可用与容灾词汇 (High Availability Claims)**：
   - *问题*：文档中提及“高可用微服务架构”、“全链路安全闭环”。
   - *事实依据*：项目无多机热备、Keepalived 漂移或分布式一致性 Paxos/Raft 支撑，属于学习型微服务示例。
   - *修正*：降级为实际事实“服务模块划分与网络通信”。

---

## 三、修改记录对照表 (Before & After)

### 1. 核心前端页面与交互组件

| 文件 | 原文 (Before) | 修改后 (After) | 修改原因 |
| :--- | :--- | :--- | :--- |
| `index.html` | 以工业级高并发与分布式微服务为基准，纵向贯穿底层 Reactor 反应堆（muduo C++11）与上层现代 AI 应用服务平台（CppAIService C++17）…… | 项目包含基于 muduo (C++11) 的网络层和基于 C++17 的 AI 应用服务层。网络层实现 epoll 事件循环与应用层 Buffer；服务层实现 HTTP 状态机解析、路由分发、两段式 MCP 协议与 RabbitMQ 异步任务消费。 | 消除宣传腔，采用客观中立的项目分层与功能列表说明 |
| `index.html` | 端到端请求处理链路大图 (End-to-End Pipeline) | 请求处理链路大图 (Pipeline) | 移除无数据支撑的“端到端”修饰 |
| `index.html` | ② Reactor 事件驱动网络层 | ② Reactor 事件循环网络层 | 消除抽象比喻“驱动”，使用具体技术事实“事件循环” |
| `index.html` | • loop() 驱动 Poller 派发就绪事件 | • loop() 调用 Poller::poll() 派发就绪事件 | 说明具体的 C++ 成员函数调用 |
| `index.html` | ③ 自研 HTTP 协议引擎与路由层 | ③ HTTP 协议解析与路由层 | 移除“自研”与“协议引擎”修辞 |
| `index.html` | 逐行状态机流式解包 (Zero-Copy) | 逐行状态机流式解包 (string_view 切片) | 准确描述 string_view 内存复用解析，消除未经证实的零拷贝 |
| `index.html` | Router 动态路由分发引擎 | Router 路由分发模块 | 用“模块”替换“引擎” |
| `index.html` | • C++ 原生 ONNX 推理引擎 | • C++ ONNX Runtime 推理接口 | 使用标准库名称 ONNX Runtime 接口 |
| `index.html` | ChatServer 核心智能调度中心 | ChatServer 业务处理服务 | 消除夸张中心修饰，还原为业务服务 |
| `index.html` | AIFactory 根据运行时配置热切换模型驱动，业务无感升级 | AIFactory 根据配置文件切换模型子类实例 | 消除“模型驱动”、“业务无感升级”等营销腔，准确说明工厂模式实现 |
| `classic.html` | 企业级开发环境指引 / 大错特错！现代大厂绝不这么干！ | Linux 远程开发指引 / 开发模式说明：Windows 编辑与远程 Linux 执行 | 消除情绪化感叹与“大厂”修辞，客观说明 Remote-SSH 架构原理 |
| `classic.html` | 深度集成双权威书目与 Readest 桌面端呼起 | 关联书目与 Readest 桌面端打开链接 | 客观描述 URL Scheme 唤起机制 |
| `js/app.js` | 该组件深度集成于双核架构中，协同驱动高性能高并发网络与智能业务流。 | 该组件属于系统架构的一部分，负责对应的网络通信或服务调用功能。 | 消除抽屉兜底描述中的“深度集成”、“协同驱动”、“高性能高并发”技术词堆叠 |

### 2. 领域模型与题库数据集

| 文件 | 原文 (Before) | 修改后 (After) | 修改原因 |
| :--- | :--- | :--- | :--- |
| `js/dataset-domain.js` | tagline: "基于 C++11 的事件驱动网络库与 Reactor 模式实现" | tagline: "基于 C++11 的 Reactor 模式网络库实现" | 精简表述，消除多余修饰 |
| `js/dataset-domain.js` | 通过 eventfd 实现跨线程安全唤醒，驱动 Poller 派发就绪 Channel | 通过 eventfd 实现跨线程安全唤醒，调用 Poller 派发就绪 Channel | 用实际操作“调用”替换比喻“驱动” |
| `js/dataset-domain.js` | RAG 检索增强生成与知识库引擎 | RAG 检索增强生成与知识库模块 | 用“模块”替换“引擎” |
| `js/dataset-domain.js` | 驱动模型完成兜底答复 | 引导模型生成兜底答复 | 用“引导”替换“驱动” |
| `js/dataset-mappings.js` | "layer": "事件驱动循环核心" | "layer": "事件循环管理" | 规范分层名称 |
| `js/dataset-mappings.js` | void loop(): 核心驱动循环，连续轮询 poll() 并执行 doPendingFunctors() | void loop(): 事件主循环，连续轮询 poll() 并执行 doPendingFunctors() | 消除“核心驱动”修饰 |
| `js/dataset-28days.js` | muduo 采用智能指针与弱引用协同模式……有效规避由于循环引用引发的内存泄漏与野指针崩溃。 | muduo 结合使用 shared_ptr 与 weak_ptr：TcpConnection 由 shared_ptr 管理生命周期；Channel 内部通过 std::weak_ptr<void> tie_ 观察对象存活状态，避免循环引用导致的内存泄漏和野指针。 | 精确阐明智能指针生命周期机制 |
| `js/dataset-28days.js` | 在 Day X 涉及的高并发网络编程场景中，关于资源生命周期的核心原则是： (共 24 处) | 在 Day X 涉及的多线程网络编程场景中，关于资源生命周期的原则是： (共 24 处) | 依据事实规则降级无基准测试支持的“高并发”，改为中立的“多线程” |
| `js/dataset-28days.js` | Day X 的 C++ 技术点在 muduo 架构中是如何协同支撑高并发 Reactor 模型的？ (共 24 处) | Day X 的 C++ 技术点在 muduo 架构中是如何应用的？ (共 24 处) | 消除“协同支撑高并发”空洞叙事 |
| `js/dataset-28days.js` | Day X 机制在 muduo 架构中的系统级协同应用 (共 24 处) | Day X 机制在 muduo 架构中的应用 (共 24 处) | 移除“系统级协同应用”浮夸标签 |
| `js/dataset-28days.js` | EventLoop 是事件循环调度的核心类，它独占所在的 I/O 线程，驱动 Poller.poll()…… | EventLoop 是事件循环类，运行于其所在的 I/O 线程，调用 Poller.poll() 收集就绪事件，并按序分发 Channel 事件和执行跨线程任务。 | 消除比喻与“核心类”，按真实代码逻辑陈述 |
| `js/dataset-yuque.js` | 如何从零构建一个工业级 C++ 网络项目？ / C++ 学习应遵循怎样的闭环？ | 如何从零构建一个 C++ 网络项目？ / C++ 学习应遵循怎样的完整路径？ | 消除“工业级”与黑话“闭环” |
| `js/dataset-yuque.js` | category: "路由引擎", linkedModuleTitle: "动态正则与哈希双层路由引擎" | category: "路由模块", linkedModuleTitle: "动态正则与哈希双层路由模块" | 用“模块”替换“引擎” |
| `js/dataset-yuque.js` | 如何设计一个高性能高可靠的 MySQL 连接池？ | 如何设计一个支持连接复用与生命周期管理的 MySQL 连接池？ | 准确陈述连接池的功能事实 |

### 3. 项目与架构设计文档

| 文件 | 原文 (Before) | 修改后 (After) | 修改原因 |
| :--- | :--- | :--- | :--- |
| `docs/PROJECT_MODULE_MAP.md` | ├── 1. HttpServer Layer (自研高性能 C++ HTTP 框架，基于 muduo Reactor) | ├── 1. HttpServer Layer (基于 muduo 的 C++ HTTP 框架) | 移除“自研高性能”断言 |
| `docs/PROJECT_MODULE_MAP.md` | 基于 muduo 主从 Reactor 反应堆构建高性能 HTTP 服务器 | 基于 muduo 主从 Reactor 模型构建 HTTP 服务器 | 消除“反应堆”比喻与“高性能” |
| `docs/PROJECT_MODULE_MAP.md` | RabbitMQ 异步入库与流量削峰 / 消息队列削峰填谷 | RabbitMQ 异步入库与消息解耦 / 消息队列异步传递任务 | 消除“削峰填谷”泛化，客观说明异步解耦 |
| `docs/8_WEEK_ROADMAP.md` | Phase C: AI 平台业务与架构大招 贯通 MCP 工具调用、RAG 与 RabbitMQ 异步削峰 | Phase C: AI 平台业务与服务调用 实现 MCP 工具调用、RAG 与 RabbitMQ 异步任务处理 | 消除口语化“大招”、“贯通”与“削峰” |
| `docs/8_WEEK_ROADMAP.md` | 对比测试“同步直接写 MySQL”与“RabbitMQ 异步削峰入库”在高并发聊天请求下的接口响应时间差异（产生震撼量化指标！） | 对比测试“同步直接写 MySQL”与“RabbitMQ 异步入库”在多并发请求下的接口响应时间差异，记录量化指标。 | 移除感叹号与“震撼”等情绪化修饰 |
| `docs/ADR-001_UNIFIED_DOMAIN_MODEL_AND_STATE.md` | 底层通信基石 / L0~L2 高并发底座 / 生产级真实事故词典 | 底层通信模块 / L0~L2 网络层基础 / 常见运行时错误词典 | 消除“基石”、“底座”与夸张词汇 |
| `docs/experiment_trace.md` | 回归原本成熟稳健的 7,517 行单体代码……构建高性能端到端防回归体系，并推送至 GitHub Pages 达成生产级稳定运行。 | 基于原生 HTML / CSS / JS 对原单体代码进行解耦，修复计时器归档功能，关联书目阅读链接，完善基于 Edge CDP 的自动化回归测试，并部署至 GitHub Pages 运行。 | 彻底重写实验目的，杜绝自夸与宣传用语 |
| `docs/P1_REPORT.md` | 成功攻克了语雀私有知识库的提取难题……实现了「知识专栏 ➔ 行级源码 ➔ 面试考点」的三维立体闭环 | 完成了《HTTP服务框架》专栏（共 17 篇文章、68,091 字）的离线化提取，并基于原生 Web 技术开发了知识库阅读模块，关联知识专栏、源码位置与面试考点。 | 消除“攻克难题”、“三维立体闭环” |
| `docs/GITHUB_YUQUE_MAPPING.md` | 自研 HTTP 框架骨架与 Reactor 反应堆 / 核心代码与调用链透视 | HTTP 框架结构与 Reactor 模式 / 代码结构与调用流程说明 | 规范化技术术语 |

---

## 四、验证结果

1. **关键词扫描复查**：
   - 扫描词列表（34 个核心词及其衍生组合）：主程序与核心架构文档全部清理完毕，无违规残留。
2. **自动化测试回归**：
   - `scripts/test_p3_topology.cjs`：**8/8 项测试通过 (100%)**
   - `scripts/test_p2_suite.cjs`：**4/4 项测试通过 (100%)**
   - `npm run build`：**静态编译打包成功**
3. **程序与数据完整性**：
   - 变量命名、DOM 选择器、路由映射、本地存储键名与自动化测试断言点 100% 保持原样，未产生任何逻辑破坏。

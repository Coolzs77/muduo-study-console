# PROJECT_MODULE_MAP.md — CppAIService 源码架构全景模块字典

> **基于源码库**：`e:\workspace\CppAIService` (youngyangyang04/CppAIService)  
> **审计标准**：逐文件审查，真实 Class、Function、线程模型、依赖与知识链映射，绝对零虚构

---

## 模块全景总览

```text
CppAIService
├── 1. HttpServer Layer (自研高性能 C++ HTTP 框架，基于 muduo Reactor)
│   ├── [1.1] mod_http_server        HttpServer 核心服务框架与连接分发
│   ├── [1.2] mod_http_codec         HTTP 报文解析与状态机编解码 (FSM)
│   ├── [1.3] mod_router             动态正则与哈希双层路由引擎 (Router)
│   ├── [1.4] mod_session            多租户会话与 Cookie 管理器 (SessionManager)
│   ├── [1.5] mod_middleware         洋葱模型中间件链与跨域拦截 (Middleware/CORS)
│   ├── [1.6] mod_ssl                HTTPS / TLS 加密通道封装 (OpenSSL)
│   └── [1.7] mod_db_pool            MySQL 连接池与事务封装 (DbConnectionPool)
│
└── 2. AIApps Layer (ChatServer AI 应用服务平台第二版)
    ├── [2.1] mod_chat_server        ChatServer 业务调度中枢与多租户隔离
    ├── [2.2] mod_ai_strategy        多模型策略适配器与工厂 (Strategy + Factory)
    ├── [2.3] mod_mcp_registry       轻量级 MCP 工具注册与两段式推理 (AIToolRegistry)
    ├── [2.4] mod_rag_engine         RAG 检索增强生成与知识库挂载
    ├── [2.5] mod_mq_manager         RabbitMQ 异步入库与流量削峰 (MQManager)
    ├── [2.6] mod_onnx_cv            本地 ONNX Runtime 图像识别与 OpenCV 预处理
    └── [2.7] mod_speech_proc        百度智能云 TTS 语音合成与 ASR 预留 (AISpeechProcessor)
```

---

## 一、HttpServer 基础网络层模块详述

### [1.1] mod_http_server — HttpServer 核心服务框架
- **Responsibility**：基于 muduo 主从 Reactor 反应堆构建高性能 HTTP 服务器；管理 TCP 连接生命周期、I/O 事件监听分发、请求回调组装。
- **Files**：
  - `HttpServer/include/http/HttpServer.h`
  - `HttpServer/src/http/HttpServer.cpp`
- **Classes**：
  - `http::HttpServer` (继承 `muduo::noncopyable`)
- **Core Functions**：
  - `HttpServer(int port, const std::string& name, bool useSSL, ...)`
  - `void start()`
  - `void setThreadNum(int numThreads)`
  - `void Get(const std::string& path, ...)` / `void Post(...)`
  - `void addRoute(HttpRequest::Method method, const std::string& path, ...)`
  - `void onConnection(const muduo::net::TcpConnectionPtr& conn)`
  - `void onMessage(const muduo::net::TcpConnectionPtr& conn, muduo::net::Buffer* buf, muduo::Timestamp receiveTime)`
  - `void onRequest(const muduo::net::TcpConnectionPtr&, const HttpRequest&)`
- **Dependencies**：`muduo_net` (`TcpServer`, `EventLoop`), `muduo_base` (`Logging`), `Router`, `SessionManager`, `MiddlewareChain`, `SslContext`.
- **Input**：操作系统 TCP 套接字原始字节流。
- **Output**：发送至客户端的符合 HTTP/1.1 规范的应答报文。
- **Thread Model**：主线程运行 `Acceptor` 监听并接受新连接，`EventLoopThreadPool` 工作线程（默认 4 线程）负责各自连接的读写和报文解析（One Loop Per Thread）。
- **Related Knowledge**：muduo Reactor 架构、epoll 边缘触发与水平触发、非阻塞 I/O、`eventfd` 跨线程唤醒、RAII。

---

### [1.2] mod_http_codec — HTTP 报文解析与封装 (FSM)
- **Responsibility**：利用有限状态机 (FSM) 逐行零拷贝解析 HTTP 请求行、请求头、空行及报文体；提供结构化 `HttpRequest` 与流式构造 `HttpResponse`。
- **Files**：
  - `HttpServer/include/http/HttpContext.h`, `HttpServer/src/http/HttpContext.cpp`
  - `HttpServer/include/http/HttpRequest.h`, `HttpServer/src/http/HttpRequest.cpp`
  - `HttpServer/include/http/HttpResponse.h`, `HttpServer/src/http/HttpResponse.cpp`
- **Classes**：
  - `http::HttpContext`
  - `http::HttpRequest`
  - `http::HttpResponse`
- **Core Functions**：
  - `bool parseRequest(muduo::net::Buffer* buf, muduo::Timestamp receiveTime)`
  - `bool processRequestLine(const char* begin, const char* end)`
  - `void appendToBuffer(muduo::net::Buffer* output) const`
  - `void setStatusCode(...)`, `setContentType(...)`, `setBody(...)`
- **Dependencies**：`muduo::net::Buffer`, `muduo::Timestamp`.
- **Input**：接收缓冲区中的未经加工的请求字符流。
- **Output**：结构化 `HttpRequest` 对象，以及序列化后的 HTTP 响应字节。
- **Thread Model**：完全在对应连接绑定的 `EventLoop` 工作线程内无锁串行执行。
- **Related Knowledge**：有限状态机 (FSM) 状态转移、TCP 粘包与拆包解决、HTTP 1.1 `Connection: keep-alive` 与 `close` 处理。

---

### [1.3] mod_router — 动态正则与哈希双层路由引擎
- **Responsibility**：提供双层路由查找：精确静态路径使用 `RouteKey(Method, Path)` 哈希表以 $O(1)$ 检索；动态路径基于 `std::regex` 正则匹配与提取 URL 路径参数（如 `/api/user/:id`）。
- **Files**：
  - `HttpServer/include/router/Router.h`, `HttpServer/src/router/Router.cpp`
  - `HttpServer/include/router/RouterHandler.h`
- **Classes**：
  - `http::router::Router`
  - `http::router::RouteKey`
  - `http::router::RouterHandler`
- **Core Functions**：
  - `void registerCallback(HttpRequest::Method, const std::string&, HttpCallback)`
  - `void registerHandler(HttpRequest::Method, const std::string&, HandlerPtr)`
  - `void addRegexHandler(HttpRequest::Method, const std::string&, HandlerPtr)`
  - `void route(const HttpRequest& req, HttpResponse* resp)`
- **Dependencies**：`HttpRequest`, `HttpResponse`, C++ STL regex。
- **Input**：请求方法与 URL Path。
- **Output**：路由命中并触发对应业务 Handler，或返回 404 Not Found。
- **Thread Model**：服务启动初始化阶段注册路由，运行时多线程并发只读查找（无锁并发安全）。
- **Related Knowledge**：哈希路由设计、正则性能与预编译、动态参数提取、责任链传递。

---

### [1.4] mod_session — 会话管理与多租户隔离
- **Responsibility**：生成并维护 Cookie 中的 `SESSIONID`；管理 Session 上下文生命周期与过期淘汰机制。
- **Files**：
  - `HttpServer/include/session/Session.h`, `HttpServer/src/session/Session.cpp`
  - `HttpServer/include/session/SessionManager.h`, `HttpServer/src/session/SessionManager.cpp`
  - `HttpServer/include/session/SessionStorage.h`, `HttpServer/src/session/SessionStorage.cpp`
- **Classes**：
  - `http::session::Session`
  - `http::session::SessionManager`
  - `http::session::MemorySessionStorage`
- **Core Functions**：
  - `SessionPtr createSession()`
  - `SessionPtr getSession(const std::string& sessionId)`
  - `void removeSession(const std::string& sessionId)`
  - `void cleanExpiredSessions()`
- **Dependencies**：`std::mutex`, `std::unordered_map`.
- **Thread Model**：使用互斥锁保证多 I/O 工作线程对全局 Session 存储的安全并发读写。
- **Related Knowledge**：Cookie 与 Session 原理、会话固定攻击防护、内存会话过期淘汰（LRU / 定时扫描）。

---

### [1.5] mod_middleware — 中间件链与 CORS 跨域拦截
- **Responsibility**：洋葱模型中间件管道，提供请求前置处理（`executePre`）与响应后置拦截（`executePost`）；开箱即用支持 CORS 跨域头与预检请求。
- **Files**：
  - `HttpServer/include/middleware/Middleware.h`
  - `HttpServer/include/middleware/MiddlewareChain.h`, `HttpServer/src/middleware/MiddlewareChain.cpp`
  - `HttpServer/include/middleware/cors/CorsMiddleware.h`, `HttpServer/src/middleware/cors/CorsMiddleware.cpp`
- **Classes**：
  - `http::middleware::Middleware`
  - `http::middleware::MiddlewareChain`
  - `http::middleware::cors::CorsMiddleware`
- **Core Functions**：
  - `void addMiddleware(std::shared_ptr<Middleware>)`
  - `bool executePre(const HttpRequest& req, HttpResponse* resp)`
  - `void executePost(const HttpRequest& req, HttpResponse* resp)`
- **Dependencies**：`HttpRequest`, `HttpResponse`.
- **Thread Model**：随请求在当前 I/O 线程内顺序执行。
- **Related Knowledge**：责任链设计模式、洋葱模型、CORS 预检 (OPTIONS) 与响应头设置。

---

### [1.6] mod_ssl — HTTPS / TLS 加密传输封装
- **Responsibility**：集成 OpenSSL，对底层 TCP 连接进行 SSL/TLS 握手协商、数据双向加解密，支持平滑启用/禁用 SSL。
- **Files**：
  - `HttpServer/include/ssl/SslConfig.h`, `HttpServer/include/ssl/SslContext.h`, `HttpServer/include/ssl/SslConnection.h`
  - `HttpServer/src/ssl/SslContext.cpp`, `HttpServer/src/ssl/SslConnection.cpp`
- **Classes**：
  - `http::ssl::SslContext`
  - `http::ssl::SslConnection`
- **Dependencies**：OpenSSL (`libssl`, `libcrypto`).
- **Thread Model**：每条连接独享一个 `SslConnection` 实例。
- **Related Knowledge**：TLS 握手协议流程、非对称加密协商对称密钥、数字证书认证。

---

### [1.7] mod_db_pool — MySQL 连接池与数据库访问封装
- **Responsibility**：管理 MySQL 连接池，提供连接生命周期保活、并发借还、自动重连与 RAII 自动归还保护。
- **Files**：
  - `HttpServer/include/utils/db/DbConnectionPool.h`, `HttpServer/src/utils/db/DbConnectionPool.cpp`
  - `HttpServer/include/utils/MysqlUtil.h`, `HttpServer/src/utils/MysqlUtil.cpp`
- **Classes**：
  - `http::db::DbConnection`
  - `http::db::DbConnectionPool`
  - `http::MysqlUtil`
- **Dependencies**：`mysqlcppconn` / `mysqlclient`。
- **Thread Model**：利用条件变量与互斥锁保证线程安全借还。
- **Related Knowledge**：连接池最大/最小容量设计、连接超时与健康探活、RAII 资源自动释放。

---

## 二、AIApps 智能服务平台层模块详述

### [2.1] mod_chat_server — ChatServer 业务中枢与多会话管理
- **Responsibility**：AI 平台核心业务服务；挂载登录、注册、历史记录、模型切换、单用户多会话隔离及图像语音入口。
- **Files**：
  - `AIApps/ChatServer/include/ChatServer.h`, `AIApps/ChatServer/src/ChatServer.cpp`
  - `AIApps/ChatServer/src/main.cpp`
  - `AIApps/ChatServer/include/handlers/*`
- **Classes**：
  - `ChatServer`
  - `ChatLoginHandler`, `ChatRegisterHandler`, `ChatHandler`, `ChatSendHandler`, `ChatSessionsHandler` 等 13 个业务处理器
- **Data Structures**：
  - `unordered_map<int, unordered_map<string, shared_ptr<AIHelper>>> chatInformation;`（用户 ID ➔ 会话 ID ➔ AI 助手上下文）
  - `unordered_map<int, bool> onlineUsers_;`
- **Thread Model**：多 Handler 并发响应 HTTP 客户端请求，临界区加锁保护。
- **Related Knowledge**：多租户会话隔离、外观模式 (Facade)、Handler 业务分发。

---

### [2.2] mod_ai_strategy — 多模型适配策略与注册工厂
- **Responsibility**：利用策略模式抽象 `AIStrategy`，统一封装多厂商模型请求构建与响应解析；通过 `AIFactory` 根据配置（`config.json`）无缝切换。
- **Files**：
  - `AIApps/ChatServer/include/AIUtil/AIStrategy.h`, `AIApps/ChatServer/src/AIUtil/AIStrategy.cpp`
  - `AIApps/ChatServer/include/AIUtil/AIFactory.h`, `AIApps/ChatServer/src/AIUtil/AIFactory.cpp`
  - `AIApps/ChatServer/include/AIUtil/AIConfig.h`, `AIApps/ChatServer/src/AIUtil/AIConfig.cpp`
- **Classes**：
  - `AIStrategy` (基类)
  - `AliyunStrategy` (通义千问 / 百炼)
  - `DouBaoStrategy` (字节跳动豆包)
  - `AliyunRAGStrategy` (百炼 RAG 知识检索增强)
  - `AliyunMcpStrategy` (MCP 协议模型调用)
  - `AIFactory`
- **Dependencies**：`libcurl`, `nlohmann::json`.
- **Related Knowledge**：策略模式 (Strategy)、简单工厂模式 (Factory)、HTTP REST 客户端封装、JSON 序列化。

---

### [2.3] mod_mcp_registry — 轻量级 MCP 工具注册与两段式推理
- **Responsibility**：对齐 Model Context Protocol 规范，提供可配置的工具注册中心（`AIToolRegistry`），实现“大模型意图识别 ➔ 本地工具函数调用 ➔ 二次提示词合成最终回答”的闭环两段式推理。
- **Files**：
  - `AIApps/ChatServer/include/AIUtil/AIToolRegistry.h`, `AIApps/ChatServer/src/AIUtil/AIToolRegistry.cpp`
- **Classes**：
  - `AIToolRegistry`
- **Built-in Tools**：
  - `getWeather` (天气查询接口)
  - `getTime` (当前精准时间获取)
- **Functions**：`void registerTool(const std::string&, ToolFunc)`, `json invoke(const std::string&, const json&)`。
- **Related Knowledge**：MCP (Model Context Protocol) 核心规范、Function Calling、两段式 Prompt 协议编排。

---

### [2.4] mod_rag_engine — RAG 检索增强生成
- **Responsibility**：支持挂载百炼知识库（Knowledge ID），实现“文档分块 ➔ 嵌入向量 ➔ 相似度召回 ➔ 注入 Prompt ➔ 溯源回答”的问答全链路。
- **Files**：
  - `AIApps/ChatServer/src/AIUtil/AIStrategy.cpp` (`AliyunRAGStrategy`)
  - `AIApps/ChatServer/resource/config.json`
- **Related Knowledge**：RAG 检索增强原理、向量数据库召回、上下文长度控制、引用溯源。

---

### [2.5] mod_mq_manager — RabbitMQ 异步入库与流量削峰
- **Responsibility**：解耦前台高并发对话与后台持久化。聊天信息产生后立即同步更新内存会话、向 RabbitMQ 推送投递消息，由消费者异步批量刷盘写入 MySQL，保护主线程极速响应。
- **Files**：
  - `AIApps/ChatServer/include/AIUtil/MQManager.h`, `AIApps/ChatServer/src/AIUtil/MQManager.cpp`
- **Classes**：
  - `MQManager`
- **Dependencies**：`SimpleAmqpClient`, `librabbitmq`。
- **Thread Model**：主业务线程投递消息，后台独立工作线程消费写库。
- **Related Knowledge**：消息队列削峰填谷、异步解耦、AMQP 消息可靠投递、写入持久化保障。

---

### [2.6] mod_onnx_cv — 本地 ONNX Runtime 图像识别
- **Responsibility**：集成 ONNX Runtime C++ API 与 OpenCV，提供高效率本地深度学习模型推理（如 MobileNet / ResNet 图像分类），避免云端依赖。
- **Files**：
  - `AIApps/ChatServer/include/AIUtil/ImageRecognizer.h`, `AIApps/ChatServer/src/AIUtil/ImageRecognizer.cpp`
- **Dependencies**：`onnxruntime`, `opencv4`。
- **Related Knowledge**：张量归一化预处理、模型输入输出 Tensor 映射、C++ AI 本地化部署。

---

### [2.7] mod_speech_proc — 语音识别与合成 (ASR / TTS)
- **Responsibility**：对接百度智能云语音接口，实现参数化语速/音色的文本转语音 (TTS) 任务分发与轮询回传，并预留 ASR 语音识别接口。
- **Files**：
  - `AIApps/ChatServer/include/AIUtil/AISpeechProcessor.h`, `AIApps/ChatServer/src/AIUtil/AISpeechProcessor.cpp`
  - `AIApps/ChatServer/include/AIUtil/base64.h`, `AIApps/ChatServer/src/AIUtil/base64.cpp`
- **Dependencies**：`libcurl`, Base64 编解码器。
- **Related Knowledge**：流式音频传输、异步长任务轮询模式、多媒体数据 Base64 传输。

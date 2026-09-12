# GITHUB_YUQUE_MAPPING.md — GitHub 源码与语雀知识库行级映射对照表

> **对照双方**：
> - **GitHub 仓库**：`youngyangyang04/CppAIService`
> - **语雀知识库**：程序员Carl《HTTP服务框架》(17篇)
> **映射颗粒度**：文章 ➔ 知识概念 ➔ 项目模块 ➔ 源码文件 ➔ 核心类 ➔ 关键函数与考点

---

## 映射总览矩阵

| 语雀文章 (Yuque Article) | 核心知识点 (Knowledge) | 项目模块 (Module) | 源码文件 (Source File) | 核心类 (Class) | 关键函数 / 考点 |
|---|---|---|---|---|---|
| **学习建议** | C++ 学习路线与工程实践方法 | 全局架构 | `README.md` | - | 编码实践 + 学习记录 |
| **1.开篇** | C++ 做 AI 平台的稀缺性与必要性 | 全局架构 | `README.md` | - | 对比 Spring AI，剖析 C++ 手工造轮子难点 |
| **2.项目介绍** | 四层架构总览与调用流程 | 全局架构 | `README.md`, `CMakeLists.txt` | `ChatServer`, `HttpServer` | 客户端 ➔ 业务 ➔ 消息存储 ➔ 推理平台 |
| **3.环境准备** | Linux C++17 第三方依赖体系与编译 | 构建配置 | `CMakeLists.txt` | - | muduo, mysqlcppconn, OpenSSL, cURL, OpenCV, ONNXRuntime, RabbitMQ |
| **4.框架梳理 (总)** | HTTP 框架结构与 Reactor 事件循环 | `mod_http_server` | `HttpServer/include/http/HttpServer.h`, `HttpServer.cpp` | `http::HttpServer` | `HttpServer::start()`, `onConnection()`, `onMessage()` |
| └─ **HTTP报文解析封装模块** | 有限状态机 (FSM) 报文解析、粘包处理 | `mod_http_codec` | `HttpServer/src/http/HttpContext.cpp`, `HttpRequest.cpp`, `HttpResponse.cpp` | `HttpContext`, `HttpRequest`, `HttpResponse` | `parseRequest()`, `processRequestLine()`, `appendToBuffer()` |
| └─ **路由模块** | 哈希精准匹配、std::regex 正则与参数提取 | `mod_router` | `HttpServer/src/router/Router.cpp`, `RouterHandler.h` | `Router`, `RouterHandler` | `registerHandler()`, `addRegexHandler()`, `route()` |
| └─ **会话管理模块** | Cookie SESSIONID、会话隔离与过期淘汰 | `mod_session` | `HttpServer/src/session/SessionManager.cpp`, `Session.cpp` | `SessionManager`, `Session` | `createSession()`, `getSession()`, `cleanExpiredSessions()` |
| └─ **中间件模块** | 洋葱模型责任链、CORS 预检与跨域拦截 | `mod_middleware` | `HttpServer/src/middleware/MiddlewareChain.cpp`, `CorsMiddleware.cpp` | `MiddlewareChain`, `CorsMiddleware` | `executePre()`, `executePost()`, `handleCors()` |
| └─ **集成数据库连接池模块** | RAII 智能借还、心跳保活与异常防御 | `mod_db_pool` | `HttpServer/src/utils/db/DbConnectionPool.cpp`, `MysqlUtil.cpp` | `DbConnectionPool`, `MysqlUtil` | `getConnection()`, `releaseConnection()`, `query()` |
| └─ **HTTPS模块** | TLS 1.2/1.3 握手、证书加载与无阻塞传输 | `mod_ssl` | `HttpServer/src/ssl/SslContext.cpp`, `SslConnection.cpp` | `SslContext`, `SslConnection` | `initOpenSsl()`, `handshake()`, `read()`, `write()` |
| **5.框架优化思路** | 性能调优、零拷贝与无锁化演化路径 | 架构优化 | `HttpServer/src/http/*` | - | Buffer 预分配、状态机优化、减少上下文切换 |
| **6.框架应用之卡码五子棋** | 第一代演示服务 (Gomoku) 协议演变对比 | 历史应用 | `AIApps/ChatServer/resource/menu.html` | - | 为何由五子棋演化为 ChatServer AI 平台 |
| **7.简历写法** | 项目亮点总结、STAR 法则表达 | 求职沉淀 | `docs/CAREER_SYSTEM.md` | - | 产出真实量化数据（并发连接数、响应耗时） |
| **8.相关面试题** | 常见技术考点与实战场景题 | 面试工坊 | `docs/INTERVIEW_QA.md` | - | One Loop Per Thread 优势、智能指针陷阱 |
| **9.AI应用服务平台 第一版** | 初代 AI 平台：单模型调用、单会话 | AI 基础 | `AIApps/ChatServer/src/AIUtil/AIStrategy.cpp` | `AIStrategy`, `AIHelper` | 单会话上下文管理、基础 HTTP REST 封装 |
| **10.AI应用服务平台 第二版** | 多模型协同+MCP工具调用+RAG+MQ异步入库+ONNX+TTS | AI 平台全景 | `AIApps/ChatServer/include/AIUtil/*`, `ChatServer.cpp` | `AIFactory`, `AIToolRegistry`, `MQManager`, `ImageRecognizer`, `AISpeechProcessor` | `AIToolRegistry::invoke()`, `MQManager::publishMessage()`, `ImageRecognizer::recognizeImage()` |

---

## 代码结构与调用流程说明

### 1. HTTP 请求到 AI 模型调用的调用流程
```text
Client HTTP POST /api/chat/send
  │
  ▼
muduo::net::TcpServer::onMessage
  │
  ▼
http::HttpServer::onMessage
  │
  ▼
http::HttpContext::parseRequest (有限状态机 FSM 解包)
  │
  ▼
http::HttpServer::onRequest
  │
  ▼
http::middleware::MiddlewareChain::executePre (CORS 跨域与鉴权)
  │
  ▼
http::router::Router::route (正则/哈希路由命中 ChatSendHandler)
  │
  ▼
ChatSendHandler::handle (提取 session_id 与用户提问)
  │
  ▼
AIHelper::chat (从 chatInformation[userId][sessionId] 获取或新建上下文)
  │
  ├── [分支 1: 常规模型] ──> AIFactory ➔ AIStrategy::buildRequest ➔ cURL 调用云端 API
  │
  ├── [分支 2: MCP 两段式] ──> AliyunMcpStrategy ➔ 识别意图 ➔ AIToolRegistry::invoke(工具函数) ➔ 二次合成回答
  │
  └── [分支 3: RAG 知识检索] ──> AliyunRAGStrategy ➔ 挂载 Knowledge ID ➔ 检索增强召回
  │
  ▼
MQManager::publishMessage (向 RabbitMQ 推送聊天历史，异步入库 MySQL，主线程无阻塞)
  │
  ▼
http::HttpResponse::appendToBuffer ➔ muduo 发送回客户端
```

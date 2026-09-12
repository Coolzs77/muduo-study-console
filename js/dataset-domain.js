// ==========================================================================
// CppAIService & muduo Dual-Core Engineering OS
// 统一领域数据模型字典 (dataset-domain.js)
// 定义：项目实体 (Projects)、核心模块 (Modules)、统一知识网络 (Knowledge)、真实生产避坑事故 (Pitfalls)
// ==========================================================================

// 1. 双核心项目字典 (DOMAIN_PROJECTS)
var DOMAIN_PROJECTS = [
  {
    id: "proj_muduo",
    name: "muduo C++ 高性能网络库",
    tagline: "底层工业级高并发网络通信与 Reactor 反应堆基石",
    standard: "C++11",
    repoUrl: "https://github.com/chenshuo/muduo",
    localStudyRepo: "https://github.com/Coolzs77/muduo-study-console",
    role: "L0~L2 通信底座：负责 epoll 边缘/水平触发、多线程 EventLoop 反应堆模型、非阻塞 I/O 与应用层零拷贝 Buffer 封装",
    techStack: ["C++11", "Linux", "epoll", "Reactor", "pthread", "POSIX Socket", "RAII"],
    modulesCount: 10,
    tasksCount: 28,
    status: "active",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-300"
  },
  {
    id: "proj_cppai",
    name: "CppAIService AI 应用服务平台",
    tagline: "上层现代 C++17 分布式微服务与多模型协同平台",
    standard: "C++17",
    repoUrl: "https://github.com/youngyangyang04/CppAIService",
    yuqueUrl: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n",
    role: "L3~L5 分布式智能业务平台：负责两段式推理 MCP 工具协议化、多厂商策略工厂 (GPT/通义/豆包)、RabbitMQ 异步写库解耦、ONNX Runtime 图像识别、TTS 语音合成与单用户多会话管理",
    techStack: ["C++17", "muduo", "RabbitMQ", "MySQL ConnectionPool", "ONNX Runtime", "OpenCV", "MCP Protocol", "RAG", "Baidu TTS/ASR"],
    modulesCount: 13,
    articlesCount: 17,
    status: "active",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300"
  }
];

// 2. 双核核心模块字典 (DOMAIN_MODULES)
var DOMAIN_MODULES = [
  // ---------- muduo 核心网络模块 ----------
  {
    id: "mod_net_eventloop",
    projectId: "proj_muduo",
    name: "EventLoop 事件循环主控",
    category: "Network",
    layer: "Reactor Core",
    sourceFiles: ["muduo/net/EventLoop.h", "muduo/net/EventLoop.cc"],
    classes: ["EventLoop"],
    functions: ["loop()", "quit()", "runInLoop()", "queueInLoop()", "wakeup()", "handleRead()"],
    desc: "One Loop Per Thread 核心发动机。每个线程最多拥有一个 EventLoop，通过 eventfd 实现跨线程安全唤醒，驱动 Poller 派发就绪 Channel。",
    threadModel: "单线程独占，通过 pendingFunctors_ 跨线程转移计算任务",
    keyConcepts: ["One Loop Per Thread", "eventfd 唤醒", "pendingFunctors 双缓冲防死锁"]
  },
  {
    id: "mod_net_channel",
    projectId: "proj_muduo",
    name: "Channel 事件分发通道",
    category: "Network",
    layer: "Reactor Demux",
    sourceFiles: ["muduo/net/Channel.h", "muduo/net/Channel.cc"],
    classes: ["Channel"],
    functions: ["setReadCallback()", "setWriteCallback()", "enableReading()", "handleEventWithGuard()", "tie()"],
    desc: "单个文件描述符 (fd) 的事件生命周期包装器。不拥有 fd，负责挂载读写/错误/关闭回调，并使用 weak_ptr 绑定生命周期杜绝空指针悬挂。",
    threadModel: "严格从属于所属 EventLoop 所在线程",
    keyConcepts: ["fd 关注事件掩码 (POLLIN/POLLOUT)", "tie_ 弱引用生命周期防撕裂"]
  },
  {
    id: "mod_net_poller",
    projectId: "proj_muduo",
    name: "Poller / EPollPoller I/O 复用器",
    category: "Network",
    layer: "I/O Multiplexing",
    sourceFiles: ["muduo/net/Poller.h", "muduo/net/poller/EPollPoller.h", "muduo/net/poller/EPollPoller.cc"],
    classes: ["Poller", "EPollPoller"],
    functions: ["poll()", "updateChannel()", "removeChannel()", "fillActiveChannels()"],
    desc: "底层 I/O 多路复用解耦层。封装 Linux epoll_create1 / epoll_ctl / epoll_wait，实现 Channel 从关注树到就绪列表的高效映射。",
    threadModel: "被 EventLoop 线程独占调用",
    keyConcepts: ["epoll 水平/边缘触发", "ChannelMap 维护", "操作系统的就绪事件队列转存"]
  },
  {
    id: "mod_net_tcpconnection",
    projectId: "proj_muduo",
    name: "TcpConnection 客户端全双工连接",
    category: "Network",
    layer: "Connection Abstraction",
    sourceFiles: ["muduo/net/TcpConnection.h", "muduo/net/TcpConnection.cc"],
    classes: ["TcpConnection"],
    functions: ["send()", "shutdown()", "handleRead()", "handleWrite()", "handleClose()"],
    desc: "已建立的客户端 TCP 物理长连接抽象。内部持有输入输出 Buffer、高低水位回调、四次挥手优雅关闭状态机。",
    threadModel: "运行在所属 SubReactor (I/O) 线程",
    keyConcepts: ["应用层发送缓冲区积压防爆", "shutdownWrite 优雅挥手", "enable_shared_from_this 跨线程延长生命"]
  },
  {
    id: "mod_net_buffer",
    projectId: "proj_muduo",
    name: "Buffer 自适应应用层缓冲区",
    category: "Memory",
    layer: "Zero-Copy Storage",
    sourceFiles: ["muduo/net/Buffer.h", "muduo/net/Buffer.cc"],
    classes: ["Buffer"],
    functions: ["readFd()", "append()", "retrieve()", "peek()", "makeSpace()"],
    desc: "连续内存块应用层弹性队列 (std::vector<char>)。包含 prependable / readable / writable 三段式设计，利用 readv + 栈外额外 64KB 空间兼顾吞吐与低开销。",
    threadModel: "每个连接独占，无锁并发",
    keyConcepts: ["readv 散射读", "动态扩展扩容", "内存紧凑 moveReadable"]
  },
  {
    id: "mod_net_tcpserver",
    projectId: "proj_muduo",
    name: "TcpServer 多线程反应堆总控",
    category: "Network",
    layer: "Server Orchestration",
    sourceFiles: ["muduo/net/TcpServer.h", "muduo/net/TcpServer.cc", "muduo/net/EventLoopThreadPool.h"],
    classes: ["TcpServer", "EventLoopThreadPool", "Acceptor"],
    functions: ["setThreadNum()", "start()", "newConnection()", "removeConnection()"],
    desc: "MainReactor + SubReactors 工业拓扑骨架。主线程 Acceptor 侦听连接并 Round-Robin 派发给从线程池，解耦海量并发接入与高速数据 I/O。",
    threadModel: "单 MainReactor 监听 + N 个 SubReactor 工作线程",
    keyConcepts: ["主从 Reactor 拓扑", "轮询分发负载均衡", "优雅退出清理"]
  },
  {
    id: "mod_base_threadpool",
    projectId: "proj_muduo",
    name: "ThreadPool 任务计算线程池",
    category: "Concurrency",
    layer: "Worker Pool",
    sourceFiles: ["muduo/base/ThreadPool.h", "muduo/base/ThreadPool.cc"],
    classes: ["ThreadPool"],
    functions: ["start()", "stop()", "run()", "take()"],
    desc: "固定大小工作线程池。基于条件变量与互斥锁实现生产者-消费者安全任务队列，避免计算密集型任务阻塞事件循环。",
    threadModel: "多生产者多消费者线程安全模型",
    keyConcepts: ["条件变量 pthread_cond_wait", "虚假唤醒防范", "队列满拒绝策略"]
  },
  {
    id: "mod_base_logging",
    projectId: "proj_muduo",
    name: "AsyncLogging 异步日志系统",
    category: "Infrastructure",
    layer: "High-Perf Logging",
    sourceFiles: ["muduo/base/AsyncLogging.h", "muduo/base/AsyncLogging.cc", "muduo/base/LogStream.h"],
    classes: ["AsyncLogging", "LogStream", "LogFile"],
    functions: ["append()", "threadFunc()"],
    desc: "双缓冲 (Double Buffering) 极速异步落盘日志。前台直接无锁/轻锁追加至 Buffer，后台专用线程批量刷盘，避免 I/O 停顿关键业务。",
    threadModel: "多前台工作线程写入 + 单后台落盘线程",
    keyConcepts: ["双缓冲四块内存轮转机制", "swap 零拷贝转移", "极端情况内存丢弃保护"]
  },

  // ---------- CppAIService 核心业务与平台模块 ----------
  {
    id: "mod_http_server",
    projectId: "proj_cppai",
    name: "HttpServer 协议服务装配骨架",
    category: "Network",
    layer: "Application Gateway",
    sourceFiles: ["HttpServer/src/http/HttpServer.cpp", "HttpServer/include/http/HttpServer.h"],
    classes: ["http::HttpServer"],
    functions: ["start()", "onConnection()", "onMessage()", "onRequest()", "Get()", "Post()"],
    desc: "基于 muduo TcpServer 扩展构建的高性能 HTTP/HTTPS 协议引擎。维护路由映射表、会话管理器、全局中间件链与 SSL 上下文。",
    threadModel: "复用底层 muduo 主从 Reactor 线程池",
    keyConcepts: ["muduo 桥接适配", "HTTP/1.1 长连接复用", "协议分层解耦"]
  },
  {
    id: "mod_http_codec",
    projectId: "proj_cppai",
    name: "HttpCodec 报文解析与状态机编解码",
    category: "Protocol",
    layer: "Parser / FSM",
    sourceFiles: ["HttpServer/src/http/HttpContext.cpp", "HttpServer/include/http/HttpRequest.h", "HttpServer/include/http/HttpResponse.h"],
    classes: ["http::HttpContext", "http::HttpRequest", "http::HttpResponse"],
    functions: ["parseRequest()", "processRequestLine()", "appendToBuffer()"],
    desc: "有限状态机 (FSM) 高性能流式解析器。逐行安全解析 Request-Line / Headers / Chunked-Body，无任何冗余内存拷贝。",
    threadModel: "连接内部状态机，独占执行",
    keyConcepts: ["有限状态机 FSM", "流式报文解析", "Chunked 编码与 SSE 准备"]
  },
  {
    id: "mod_http_router",
    projectId: "proj_cppai",
    name: "HttpRouter 路由分发与动态映射",
    category: "Architecture",
    layer: "Routing Core",
    sourceFiles: ["AIApps/ChatServer/src/ChatServer.cpp", "HttpServer/include/http/HttpServer.h"],
    classes: ["ChatServer", "HttpHandler"],
    functions: ["initializeRouter()", "packageResp()", "routeHandler()"],
    desc: "RESTful URL 映射中心。将 HTTP 动词 (GET/POST) 与路径安全绑定至指定业务 Handler，支持参数抽取与异常捕获防护。",
    threadModel: "只读哈希路由表，线程安全并发查阅",
    keyConcepts: ["映射表无锁路由", "动态 Handler 挂载", "统一 404/500 包装"]
  },
  {
    id: "mod_http_session",
    projectId: "proj_cppai",
    name: "SessionManager 用户会话与生命周期",
    category: "Security",
    layer: "State Management",
    sourceFiles: ["HttpServer/src/session/SessionManager.cpp", "HttpServer/include/session/Session.h"],
    classes: ["http::SessionManager", "http::Session"],
    functions: ["getSession()", "createSession()", "cleanExpiredSessions()"],
    desc: "基于 Cookie (session_id) 的客户端身份持久化管理。内存维护会话生命周期，支持第二版扩展的「单用户多会话」隔离树。",
    threadModel: "内部加锁互斥保护会话表，定时器安全巡检",
    keyConcepts: ["Cookie 签名校验", "单用户多会话 (sessionsIdsMap)", "超时驱逐机制"]
  },
  {
    id: "mod_http_middleware",
    projectId: "proj_cppai",
    name: "MiddlewareChain 中间件洋葱模型",
    category: "Architecture",
    layer: "Interception Chain",
    sourceFiles: ["HttpServer/src/middleware/MiddlewareChain.cpp", "HttpServer/include/middleware/CorsMiddleware.h"],
    classes: ["http::MiddlewareChain", "http::CorsMiddleware", "http::AuthMiddleware"],
    functions: ["use()", "handle()", "execute()"],
    desc: "可插拔的 HTTP 拦截链条。统一处理跨域安全 (CORS)、鉴权拦截、统计监控与耗时埋点，实现切面编程 (AOP)。",
    threadModel: "顺序流转于当前工作线程",
    keyConcepts: ["洋葱模型", "CORS 复杂请求预检 (OPTIONS)", "AOP 切面鉴权"]
  },
  {
    id: "mod_ai_strategy",
    projectId: "proj_cppai",
    name: "AIStrategy 多大模型策略与工厂",
    category: "AI",
    layer: "Model Abstraction",
    sourceFiles: ["AIApps/ChatServer/src/AIUtil/AIStrategy.cpp", "AIApps/ChatServer/src/AIUtil/AIFactory.cpp", "AIApps/ChatServer/include/AIUtil/AIStrategy.h"],
    classes: ["AIStrategy", "AliyunStrategy", "AliyunRAGStrategy", "DoubaoStrategy", "AIFactory"],
    functions: ["buildRequest()", "parseResponse()", "createStrategy()", "registerStrategy()"],
    desc: "策略模式 + 注册式工厂模式典范。将阿里百炼普通模型、阿里 RAG 知识库、字节火山豆包等多厂商大模型的请求协议、Token 差异完美归一化。",
    threadModel: "无状态策略对象，多线程共享",
    keyConcepts: ["策略模式 (Strategy)", "注册式工厂 (Factory)", "开闭原则 (OCP) 零代码入侵新增模型"]
  },
  {
    id: "mod_ai_mcp_registry",
    projectId: "proj_cppai",
    name: "AIToolRegistry 轻量 MCP 工具协议",
    category: "AI",
    layer: "Agent Protocol",
    sourceFiles: ["AIApps/ChatServer/src/AIUtil/AIToolRegistry.cpp", "AIApps/ChatServer/src/AIUtil/AIConfig.cpp", "AIApps/ChatServer/resource/config.json"],
    classes: ["AIToolRegistry", "AIConfig"],
    functions: ["registerTool()", "executeTool()", "parseConfig()", "handleTwoStageInference()"],
    desc: "两段式推理与工具函数注册总线。让大模型具备动态感知与调用外部 C++ 本地函数能力（查天气、算时间、数据库自省），契约化标准对接。",
    threadModel: "工具注册表启动加载，执行期线程隔离调用",
    keyConcepts: ["两段式推理 (Two-Stage Inference)", "MCP (Model Context Protocol) 标准规范", "动态函数派发"]
  },
  {
    id: "mod_ai_onnx_vision",
    projectId: "proj_cppai",
    name: "ImageRecognizer 本地 ONNX 图像推理",
    category: "AI",
    layer: "Local Inference",
    sourceFiles: ["AIApps/ChatServer/src/AIUtil/ImageRecognizer.cpp", "AIApps/ChatServer/src/AIUtil/base64.cpp"],
    classes: ["ImageRecognizer", "Base64Util"],
    functions: ["initModel()", "preprocess()", "infer()", "decodeBase64()"],
    desc: "OpenCV 预处理 + ONNX Runtime (x64) 高速本地推理链路。支持 Base64 解码、张量归一化、图像分类与目标检测，脱离云端纯本地运行。",
    threadModel: "独立会话实例，单次推理串行执行",
    keyConcepts: ["OpenCV BGR/RGB 转换", "ONNX Tensor 内存对齐", "边缘推理零成本部署"]
  },
  {
    id: "mod_ai_tts_speech",
    projectId: "proj_cppai",
    name: "AISpeechProcessor 智能语音 ASR/TTS",
    category: "AI",
    layer: "Multi-Modal Gateway",
    sourceFiles: ["AIApps/ChatServer/src/AIUtil/AISpeechProcessor.cpp", "AIApps/ChatServer/src/handlers/ChatSpeechHandler.cpp"],
    classes: ["AISpeechProcessor", "ChatSpeechHandler"],
    functions: ["textToSpeech()", "speechToText()", "fetchToken()"],
    desc: "百度智能云与自研多模态网关。完成鉴权 Token 缓存、文本分片语音流合成 (MP3)、语音转文字，打通智能助手语音闭环。",
    threadModel: "异步 HTTP 客户端非阻塞请求",
    keyConcepts: ["Token 缓存与自动刷新", "音频流式返回", "双向多模态"]
  },
  {
    id: "mod_storage_mysql_pool",
    projectId: "proj_cppai",
    name: "DbConnectionPool MySQL 连接池",
    category: "Storage",
    layer: "Database Access",
    sourceFiles: ["HttpServer/src/db/MysqlUtil.cpp", "HttpServer/include/db/MysqlUtil.h"],
    classes: ["http::MysqlUtil", "DbConnectionPool"],
    functions: ["init()", "getConnection()", "releaseConnection()", "executeUpdate()", "executeQuery()"],
    desc: "RAII 风格 MySQL 高性能连接池。复用 TCP 长连接，规避频繁三路握手，支持自动重连、空闲销毁与 SQL 防注入安全校验。",
    threadModel: "互斥锁 + 条件变量管理可用连接双向链表",
    keyConcepts: ["连接复用", "RAII 资源自动归还", "心跳自愈机制"]
  },
  {
    id: "mod_mq_rabbitmq_manager",
    projectId: "proj_cppai",
    name: "MQManager RabbitMQ 消息队列与异步解耦",
    category: "Middleware",
    layer: "Message Broker",
    sourceFiles: ["AIApps/ChatServer/src/AIUtil/MQManager.cpp", "AIApps/ChatServer/include/AIUtil/MQManager.h"],
    classes: ["MQManager", "RabbitMQThreadPool"],
    functions: ["publish()", "startConsumer()", "executeMysql()"],
    desc: "前后台异步解耦架构核心。前台 HTTP 线程同步将大模型回复渲染给用户，同时向 RabbitMQ 推入落库任务；后台工作线程池异步刷盘 MySQL，极大提升服务器吞吐量。",
    threadModel: "独立消费者线程池执行，网络线程零 I/O 阻塞",
    keyConcepts: ["发布-订阅解耦", "削峰填谷", "最终一致性保证"]
  },
  {
    id: "mod_net_client",
    projectId: "proj_muduo",
    name: "Client 外部并发请求与长连接",
    category: "Network",
    layer: "Client Ingress",
    sourceFiles: ["examples/chat/client.cc", "HttpServer/resource/AI.html"],
    classes: ["TcpClient", "HttpClient"],
    functions: ["connect()", "send()", "onMessage()", "disconnect()"],
    desc: "外部并发接入终端。维持浏览器、移动端与服务器之间的全双工通信管道，向服务器发起 RESTful 请求与 SSE 流式交互。",
    threadModel: "客户端独立进程，服务端通过 Socket fd 与非阻塞 I/O 并发承载",
    keyConcepts: ["非阻塞 Socket", "Keep-Alive 长连接复用", "SSE 流式接收"]
  },
  {
    id: "mod_kernel_epoll",
    projectId: "proj_muduo",
    name: "Linux 内核 epoll 事件多路复用",
    category: "Network",
    layer: "Linux Kernel I/O",
    sourceFiles: ["muduo/net/poller/EPollPoller.cc", "<sys/epoll.h>"],
    classes: ["EPollPoller", "struct epoll_event"],
    functions: ["epoll_create1()", "epoll_ctl()", "epoll_wait()"],
    desc: "Linux 操作系统底层最高性能的 I/O 多路复用内核机制。基于红黑树维护海量监听 socket，基于就绪双向链表通过 epoll_wait 实现 O(1) 复杂度的事件通知。",
    threadModel: "内核系统调用，由 Poller 线程阻塞监听并唤醒",
    keyConcepts: ["LT 水平触发与 ET 边缘触发", "epoll 红黑树与双向就绪链表", "mmap 与零拷贝设计思想"]
  },
  {
    id: "mod_ai_chatserver",
    projectId: "proj_cppai",
    name: "ChatServer 业务主控与多会话调度",
    category: "AI",
    layer: "Business Orchestration",
    sourceFiles: ["AIApps/ChatServer/src/ChatServer.cpp", "AIApps/ChatServer/include/ChatServer.h"],
    classes: ["ChatServer", "ChatSendHandler", "ChatSessionsHandler"],
    functions: ["initialize()", "initChatMessage()", "readDataFromMySQL()", "packageResp()"],
    desc: "CppAIService 业务调度中枢。统一承接自研 HTTP 微服务网关路由分发，维护「单用户多会话」隔离树 (chatInformation[userId][sessionId])，协调大模型多策略调用、本地工具 MCP 执行与 RabbitMQ 异步入库。",
    threadModel: "多线程并发处理业务请求，按 session_id 隔离 AIHelper 实例",
    keyConcepts: ["单用户多会话隔离 (chatInformation)", "业务分发与 Handler 路由", "前后端数据解耦"]
  },
  {
    id: "mod_ai_rag",
    projectId: "proj_cppai",
    name: "RAG 检索增强生成与知识库引擎",
    category: "AI",
    layer: "Knowledge Retrieval",
    sourceFiles: ["AIApps/ChatServer/src/AIUtil/AIStrategy.cpp", "AIApps/ChatServer/include/AIUtil/AIStrategy.h"],
    classes: ["AliyunRAGStrategy", "AIStrategy"],
    functions: ["buildRequest()", "parseResponse()", "retrieveKnowledge()"],
    desc: "Retrieval-Augmented Generation 检索增强生成引擎。将私有知识库 (PDF/Word/Markdown) 向量化切片召回，在模型推理前置注入关联上下文，彻底杜绝大语言模型事实性幻觉。",
    threadModel: "无状态检索策略，多线程共享",
    keyConcepts: ["向量语义检索 (Embedding)", "上下文提示词动态增强", "知识库 ID 鉴权隔离"]
  }
];

// 3. 统一核心知识元数据网络 (DOMAIN_KNOWLEDGE_NODES)
var DOMAIN_KNOWLEDGE_NODES = [
  {
    id: "know_reactor_eventloop",
    title: "One Loop Per Thread 反应堆线程模型",
    category: "Network",
    moduleId: "mod_net_eventloop",
    muduoDays: [11, 14, 15],
    yuqueDocIds: ["yq_01", "yq_09", "yq_10"],
    summary: "主线程仅负责侦听连接，从线程独占独立的事件循环与 Poller，通过 eventfd 实现无锁/轻量跨线程任务唤醒转移。",
    interviewTrap: "为什么不能直接在主线程中处理连接读写？多线程抢同一个 epoll 会发生什么？（惊群与锁竞争）"
  },
  {
    id: "know_nonblocking_buffer",
    title: "非阻塞 I/O 与应用层 Buffer 弹性双缓冲",
    category: "Memory",
    moduleId: "mod_net_buffer",
    muduoDays: [7, 8, 9, 21],
    yuqueDocIds: ["yq_05", "yq_06"],
    summary: "当内核发送缓冲区写满时，数据暂存应用层 Output Buffer 并注册 EPOLLOUT；配合 readv + 栈内存 64KB 极速散射读。",
    interviewTrap: "为什么非阻塞网络编程必须搭配应用层 Buffer？直接依靠系统 send() 会有哪些致命隐患？"
  },
  {
    id: "know_fsm_http_parser",
    title: "有限状态机 (FSM) 高性能 HTTP 报文解析",
    category: "Protocol",
    moduleId: "mod_http_codec",
    muduoDays: [12, 13],
    yuqueDocIds: ["yq_06", "yq_07"],
    summary: "通过 CHECK_STATE_REQUESTLINE / CHECK_STATE_HEADER / CHECK_STATE_CONTENT 状态迁移无死角流式切片解析 HTTP 数据包。",
    interviewTrap: "如果客户端分包发送请求行，状态机如何断点恢复？如何防范恶意构造的超长请求头 DoS 攻击？"
  },
  {
    id: "know_mcp_twostage",
    title: "轻量 MCP (Model Context Protocol) 与两段式推理",
    category: "AI",
    moduleId: "mod_ai_mcp_registry",
    muduoDays: [26, 27],
    yuqueDocIds: ["yq_16", "yq_17"],
    summary: "大模型根据用户提问识别需调用的工具并返回 JSON 参数；服务器拦截并在本地执行 C++ 工具后，将结果二次回填送入大模型生成最终回复。",
    interviewTrap: "什么是两段式推理？本地 C++ 函数执行失败或超时，模型如何优雅兜底而不是卡死？"
  },
  {
    id: "know_strategy_factory_llm",
    title: "策略模式与注册式工厂的多模型无缝热插拔",
    category: "Architecture",
    moduleId: "mod_ai_strategy",
    muduoDays: [2, 3],
    yuqueDocIds: ["yq_03", "yq_16", "yq_17"],
    summary: "统一基类 AIStrategy 抽象不同厂商请求体封装与响应解析，AIFactory 注册工厂实现零侵入支持新厂商接入（开闭原则 OCP）。",
    interviewTrap: "为什么不直接用 switch-case 根据模型类型发请求？当引入第 10 家大模型时，设计模式带来了哪些工程收益？"
  },
  {
    id: "know_mq_async_decouple",
    title: "RabbitMQ 消息队列前后台异步落库削峰",
    category: "Concurrency",
    moduleId: "mod_mq_rabbitmq_manager",
    muduoDays: [19, 20],
    yuqueDocIds: ["yq_16", "yq_17"],
    summary: "前台 HTTP 连接仅负责将大模型消息实时推送给客户端，聊天记录与日志投递至 RabbitMQ 由消费者线程池慢慢刷盘 MySQL。",
    interviewTrap: "为什么不直接在 HTTP 线程中调用 MySQL 写入？高并发压测下同步写库与异步消息队列的 QPS 差距能有多大？"
  },
  {
    id: "know_single_user_multi_session",
    title: "单用户多会话隔离与二维映射内存拓扑",
    category: "Architecture",
    moduleId: "mod_http_session",
    muduoDays: [5, 6],
    yuqueDocIds: ["yq_08", "yq_17"],
    summary: "第二版从一维映射表升级为 `std::unordered_map<int, std::unordered_map<string, shared_ptr<AIHelper>>>`，实现精确会话隔离与历史恢复。",
    interviewTrap: "如何防范多线程并发创建新会话时的锁竞争？如果用户有 1000 个会话，内存如何做 LRU 淘汰？"
  },
  {
    id: "know_onnx_opencv_pipeline",
    title: "OpenCV 预处理与 ONNX Runtime 本地零成本推理",
    category: "AI",
    moduleId: "mod_ai_onnx_vision",
    muduoDays: [24, 25],
    yuqueDocIds: ["yq_16", "yq_17"],
    summary: "前端将图片 Base64 编码上传，后端解码并调用 OpenCV 进行尺寸归一化，灌入本地 ONNX Runtime 执行前向传播。",
    interviewTrap: "图像预处理在 C++ 中如何避免深拷贝？ONNX 的 Session 是线程安全的吗？"
  },
  {
    id: "know_client_ingress",
    title: "高并发长连接客户端与全双工协议接入",
    category: "Network",
    moduleId: "mod_net_client",
    muduoDays: [1, 5, 9],
    yuqueDocIds: ["yq_01", "yq_03"],
    summary: "客户端发起非阻塞 TCP 握手并维持长连接，承载高频 HTTP 请求与 SSE 实时数据流推送。",
    interviewTrap: "长连接心跳保活与 TCP KeepAlive 有何本质区别？为什么现代 Web 通常推荐应用层心跳？"
  },
  {
    id: "know_kernel_epoll_arch",
    title: "Linux epoll 水平触发 vs 边缘触发与内核数据结构",
    category: "Network",
    moduleId: "mod_kernel_epoll",
    muduoDays: [8, 13, 26],
    yuqueDocIds: ["yq_01", "yq_04"],
    summary: "Linux epoll 基于红黑树高效管理海量注册 fd，基于双向就绪链表实现 O(1) 事件唤醒通知。",
    interviewTrap: "epoll 的 LT 与 ET 模式有什么区别？为什么在 ET 模式下读写套接字必须循环读取直至 EAGAIN？"
  },
  {
    id: "know_chatserver_multisession",
    title: "单用户多会话隔离与业务智能路由调度",
    category: "AI",
    moduleId: "mod_ai_chatserver",
    muduoDays: [14, 19, 28],
    yuqueDocIds: ["yq_10", "yq_16", "yq_17"],
    summary: "从单用户单会话重构为多会话树 (chatInformation[userId][sessionId])，保证上下文隔离与历史并发回溯。",
    interviewTrap: "在多线程 HTTP 服务中，如何设计单用户多会话的并发互斥？锁粒度如何控制以保证高吞吐？"
  },
  {
    id: "know_rag_vector_retrieval",
    title: "RAG 私有知识库向量化召回与防幻觉注入",
    category: "AI",
    moduleId: "mod_ai_rag",
    muduoDays: [27, 28],
    yuqueDocIds: ["yq_10", "yq_17"],
    summary: "构建私有知识库切片，利用向量数据库进行相似度检索，并将命中片段前置组装入 Prompt 提示词上下文。",
    interviewTrap: "RAG 与模型微调 (Fine-Tuning) 的核心差异是什么？在时效性与准确性场景下如何做技术选型？"
  }
];

// 4. 生产避坑事故真实词典 (DOMAIN_PITFALLS_CATALOG)
var DOMAIN_PITFALLS_CATALOG = [
  {
    id: "pit_enable_shared_from_this",
    title: "在构造函数中调用 shared_from_this() 导致 bad_weak_ptr 崩溃",
    category: "Memory",
    project: "proj_muduo",
    symptom: "程序在启动或创建 TcpConnection 时触发 std::bad_weak_ptr 抛出异常崩溃退出。",
    rootCause: "shared_from_this() 依赖内部 weak_ptr，而 weak_ptr 只有在 std::make_shared 或构造函数完整返回并赋值给 shared_ptr 之后才被初始化！构造期执行必崩。",
    solution: "使用两段式构造：构造函数仅初始化成员，随后提供专门的 `initialize()` 或 `connectEstablished()` 成员函数，在对象已被 shared_ptr 持有后调用。",
    ironRule: "绝对禁止在 C++ 构造函数中向外部回调注册 shared_from_this()！"
  },
  {
    id: "pit_reactor_blocking_mq",
    title: "在 Reactor 事件循环中执行同步网络/落库调用导致全站假死",
    category: "Concurrency",
    project: "proj_cppai",
    symptom: "某一用户向大模型发起耗时提问或写库较慢时，同一 I/O 线程上的其他所有在线用户完全无法收发数据，卡死超时。",
    rootCause: "muduo 采用事件驱动模型，Reactor 线程必须在微秒级完成回调派发！如果在 onMessage 回调里同步调用 curl 或同步连接 MySQL，会独占整个 EventLoop。",
    solution: "耗时或阻塞操作必须全量转移至后台专用线程池或 RabbitMQ，通过 EventLoop::queueInLoop 异步传递最终计算结果。",
    ironRule: "Reactor 线程内绝对禁止任何阻塞 I/O 与耗时计算（严格保持纯异步响应）！"
  },
  {
    id: "pit_mcp_json_deadlock",
    title: "两段式 MCP 工具调用异常导致大模型上下文状态死锁",
    category: "AI",
    project: "proj_cppai",
    symptom: "当大模型请求调用一个不存在或超时的本地函数时，前端对话界面一直处于转圈加载状态，后序所有提问均报错失败。",
    rootCause: "服务端在派发工具调用后，未对工具执行设置超时熔断与异常捕获；若本地函数抛异常，会话状态未正确切换回就绪态，上下文消息队列结构损坏。",
    solution: "封装 ToolExecutionScope，设置严苛的 3 秒超时熔断；抛出异常时自动向大模型追加错误描述结果作为第二阶段输入，驱动模型输出兜底回答。",
    ironRule: "任何外部工具调用必须带有严格超时熔断与保底回填机制，确保有限状态机永远闭环！"
  },
  {
    id: "pit_double_buffering_drop",
    title: "异步日志系统在高频流量下内存无限膨胀或 OOM 崩溃",
    category: "Infrastructure",
    project: "proj_muduo",
    symptom: "服务器在遭受流量洪峰压测时，物理内存持续飙升至上限被 Linux 内核 OOM-Killer 强杀。",
    rootCause: "前台生产日志速度远大于后台磁盘 I/O 刷盘速度，buffers_ 列表无限追加未刷盘日志块，导致内存泄漏式暴涨。",
    solution: "muduo 采用最大留存 25 块 Buffer 机制；超过阈值时强制丢弃多余日志并写一条紧急警告，牺牲日志完整性换取服务可用性。",
    ironRule: "异步生产-消费队列必须设置硬上限（Bounded Queue），宁可丢日志也绝不可打崩进程！"
  }
];

// 工具辅助函数 (对外导出)
function getDomainProjects() {
  return DOMAIN_PROJECTS;
}

function getDomainModules(projectId) {
  if (!projectId) return DOMAIN_MODULES;
  return DOMAIN_MODULES.filter(m => m.projectId === projectId);
}

function getDomainKnowledge() {
  return DOMAIN_KNOWLEDGE_NODES;
}

function getDomainPitfalls() {
  return DOMAIN_PITFALLS_CATALOG;
}

// 兼容全局挂载与运行环境 (Browser window / Node.js globalThis)
if (typeof window !== 'undefined') {
  window.DOMAIN_PROJECTS = DOMAIN_PROJECTS;
  window.DOMAIN_MODULES = DOMAIN_MODULES;
  window.DOMAIN_KNOWLEDGE_NODES = DOMAIN_KNOWLEDGE_NODES;
  window.DOMAIN_PITFALLS_CATALOG = DOMAIN_PITFALLS_CATALOG;
  window.getDomainProjects = getDomainProjects;
  window.getDomainModules = getDomainModules;
  window.getDomainKnowledge = getDomainKnowledge;
  window.getDomainPitfalls = getDomainPitfalls;
}

if (typeof globalThis !== 'undefined') {
  globalThis.DOMAIN_PROJECTS = DOMAIN_PROJECTS;
  globalThis.DOMAIN_MODULES = DOMAIN_MODULES;
  globalThis.DOMAIN_KNOWLEDGE_NODES = DOMAIN_KNOWLEDGE_NODES;
  globalThis.DOMAIN_PITFALLS_CATALOG = DOMAIN_PITFALLS_CATALOG;
  globalThis.getDomainProjects = getDomainProjects;
  globalThis.getDomainModules = getDomainModules;
  globalThis.getDomainKnowledge = getDomainKnowledge;
  globalThis.getDomainPitfalls = getDomainPitfalls;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DOMAIN_PROJECTS,
    DOMAIN_MODULES,
    DOMAIN_KNOWLEDGE_NODES,
    DOMAIN_PITFALLS_CATALOG,
    getDomainProjects,
    getDomainModules,
    getDomainKnowledge,
    getDomainPitfalls
  };
}

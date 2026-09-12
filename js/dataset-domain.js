// ==========================================================================
// CppAIService & muduo Dual-Core Engineering OS
// 统一领域数据模型字典 (dataset-domain.js)
// 定义：项目实体 (Projects)、核心模块 (Modules)、统一知识网络 (Knowledge)、真实生产避坑事故 (Pitfalls)
// ==========================================================================

// 1. 双核心项目字典 (DOMAIN_PROJECTS)
var DOMAIN_PROJECTS = [
  {
    id: "proj_muduo",
    name: "muduo C++ 网络库",
    tagline: "基于 C++11 的 Reactor 模式网络库实现",
    standard: "C++11",
    repoUrl: "https://github.com/chenshuo/muduo",
    localStudyRepo: "https://github.com/Coolzs77/muduo-study-console",
    role: "L0~L2 网络层：负责 epoll 水平/边缘触发、One Loop Per Thread 事件循环模型、非阻塞 I/O 与应用层 Buffer 读写管理",
    techStack: ["C++11", "Linux", "epoll", "Reactor", "pthread", "POSIX Socket", "RAII"],
    modulesCount: 10,
    tasksCount: 28,
    status: "active",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-300"
  },
  {
    id: "proj_cppai",
    name: "CppAIService AI 应用服务平台",
    tagline: "基于 C++17 的 AI 业务服务平台，包含 HTTP 服务与多模型适配",
    standard: "C++17",
    repoUrl: "https://github.com/youngyangyang04/CppAIService",
    yuqueUrl: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n",
    role: "L3~L5 业务层：负责 HTTP 请求解析、两段式 MCP 工具协议、模型策略工厂、RabbitMQ 异步落库任务、ONNX 图像推理与语音处理",
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
    desc: "One Loop Per Thread 机制实现。每个线程最多拥有一个 EventLoop，通过 eventfd 实现跨线程安全唤醒，调用 Poller 派发就绪 Channel。",
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
    desc: "已建立的客户端 TCP 物理连接抽象。内部持有输入输出 Buffer、高低水位回调与半关闭状态机。",
    threadModel: "运行在所属 SubReactor (I/O) 线程",
    keyConcepts: ["应用层发送缓冲区管理", "shutdownWrite 半关闭", "enable_shared_from_this 跨线程生命期安全"]
  },
  {
    id: "mod_net_buffer",
    projectId: "proj_muduo",
    name: "Buffer 应用层缓冲区",
    category: "Memory",
    layer: "Application Buffer",
    sourceFiles: ["muduo/net/Buffer.h", "muduo/net/Buffer.cc"],
    classes: ["Buffer"],
    functions: ["readFd()", "append()", "retrieve()", "peek()", "makeSpace()"],
    desc: "基于 std::vector<char> 实现的应用层缓冲区。包含 prependable / readable / writable 三段式设计，利用 readv 与栈上临时 64KB 空间兼顾空间利用率与系统调用开销。",
    threadModel: "每个连接独占，无锁并发",
    keyConcepts: ["readv 分散读", "动态扩容", "内存紧凑 moveReadable"]
  },
  {
    id: "mod_net_tcpserver",
    projectId: "proj_muduo",
    name: "TcpServer 多线程 TCP 服务端",
    category: "Network",
    layer: "Server Orchestration",
    sourceFiles: ["muduo/net/TcpServer.h", "muduo/net/TcpServer.cc", "muduo/net/EventLoopThreadPool.h"],
    classes: ["TcpServer", "EventLoopThreadPool", "Acceptor"],
    functions: ["setThreadNum()", "start()", "newConnection()", "removeConnection()"],
    desc: "主从 Reactor 模型实现。主线程 Acceptor 监听连接并通过轮询分发给工作线程的 EventLoop，处理后续数据 I/O。",
    threadModel: "单 MainReactor 监听 + N 个 SubReactor 工作线程",
    keyConcepts: ["主从 Reactor 模型", "轮询分发负载均衡", "退出清理机制"]
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
    layer: "Async Logging",
    sourceFiles: ["muduo/base/AsyncLogging.h", "muduo/base/AsyncLogging.cc", "muduo/base/LogStream.h"],
    classes: ["AsyncLogging", "LogStream", "LogFile"],
    functions: ["append()", "threadFunc()"],
    desc: "双缓冲 (Double Buffering) 异步日志。前端线程将日志写入 Buffer，后台专用线程定期将数据批量写入磁盘文件，避免磁盘 I/O 阻塞网络主循环。",
    threadModel: "多前台工作线程写入 + 单后台落盘线程",
    keyConcepts: ["双缓冲内存轮转机制", "std::unique_ptr 指针交换", "极端情况丢弃策略"]
  },

  // ---------- CppAIService 核心业务与平台模块 ----------
  {
    id: "mod_http_server",
    projectId: "proj_cppai",
    name: "HttpServer HTTP 服务装配",
    category: "Network",
    layer: "Application Gateway",
    sourceFiles: ["HttpServer/src/http/HttpServer.cpp", "HttpServer/include/http/HttpServer.h"],
    classes: ["http::HttpServer"],
    functions: ["start()", "onConnection()", "onMessage()", "onRequest()", "Get()", "Post()"],
    desc: "基于 muduo TcpServer 扩展构建的 HTTP/HTTPS 服务。维护路由映射表、会话管理、中间件链与 SSL 上下文。",
    threadModel: "复用底层 muduo 主从 Reactor 线程池",
    keyConcepts: ["muduo 网络库封装", "HTTP/1.1 长连接支持", "协议与服务分层"]
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
    desc: "基于有限状态机 (FSM) 的流式解析器。逐行解析 Request-Line / Headers / Chunked-Body，减少内存拷贝。",
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
    desc: "RESTful URL 映射。将 HTTP 请求方法 (GET/POST) 与路径绑定至对应业务 Handler，支持参数提取与异常处理。",
    threadModel: "只读哈希路由表，线程安全并发查阅",
    keyConcepts: ["映射表路由", "动态 Handler 挂载", "统一错误状态包装"]
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
    desc: "基于 Cookie (session_id) 的客户端身份管理。内存维护会话生命周期，支持单用户多会话隔离树。",
    threadModel: "内部加锁互斥保护会话表，定时器安全巡检",
    keyConcepts: ["Cookie 校验", "单用户多会话 (sessionsIdsMap)", "超时清理机制"]
  },
  {
    id: "mod_http_middleware",
    projectId: "proj_cppai",
    name: "MiddlewareChain 中间件链式处理",
    category: "Architecture",
    layer: "Interception Chain",
    sourceFiles: ["HttpServer/src/middleware/MiddlewareChain.cpp", "HttpServer/include/middleware/CorsMiddleware.h"],
    classes: ["http::MiddlewareChain", "http::CorsMiddleware", "http::AuthMiddleware"],
    functions: ["use()", "handle()", "execute()"],
    desc: "HTTP 请求处理拦截链。处理跨域支持 (CORS)、请求鉴权与执行耗时记录。",
    threadModel: "顺序流转于当前工作线程",
    keyConcepts: ["链式拦截", "CORS 预检处理 (OPTIONS)", "鉴权拦截"]
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
    desc: "使用策略模式与工厂模式，封装阿里百炼、火山豆包等多厂商模型的请求协议与参数格式差异。",
    threadModel: "无状态策略对象，多线程共享",
    keyConcepts: ["策略模式 (Strategy)", "注册式工厂 (Factory)", "多模型适配"]
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
    desc: "两段式推理与工具函数注册管理。向大模型提供工具元数据，接收并执行本地函数（如查询、计算），将结果回传给模型。",
    threadModel: "工具注册表启动加载，执行期线程隔离调用",
    keyConcepts: ["两段式推理 (Two-Stage Inference)", "MCP 协议规范", "动态函数派发"]
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
    desc: "OpenCV 预处理与 ONNX Runtime 本地推理。支持 Base64 解码、张量归一化与模型推理。",
    threadModel: "独立会话实例，单次推理串行执行",
    keyConcepts: ["OpenCV 图像格式转换", "ONNX Tensor 处理", "本地模型推理"]
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
    desc: "语音服务模块。负责调用百度语音 API，完成 Token 缓存、文本分片语音合成与语音识别。",
    threadModel: "异步 HTTP 客户端非阻塞请求",
    keyConcepts: ["Token 缓存与刷新", "音频数据分帧", "语音合成与识别"]
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
    desc: "基于 RAII 的 MySQL 连接池实现。复用 TCP 连接以减少频繁建连断连开销，支持连接借还、超时检查与重连。",
    threadModel: "互斥锁 + 条件变量管理可用连接双向链表",
    keyConcepts: ["连接复用", "RAII 资源自动归还", "心跳保活机制"]
  },
  {
    id: "mod_mq_rabbitmq_manager",
    projectId: "proj_cppai",
    name: "MQManager RabbitMQ 异步任务管理",
    category: "Middleware",
    layer: "Message Broker",
    sourceFiles: ["AIApps/ChatServer/src/AIUtil/MQManager.cpp", "AIApps/ChatServer/include/AIUtil/MQManager.h"],
    classes: ["MQManager", "RabbitMQThreadPool"],
    functions: ["publish()", "startConsumer()", "executeMysql()"],
    desc: "通过 RabbitMQ 实现异步数据持久化。HTTP 线程将聊天记录与事件投递至消息队列后即可继续处理后续网络请求，由后台消费者线程从队列拉取消息并写入 MySQL。",
    threadModel: "独立消费者线程池执行，网络线程避免数据库 I/O 阻塞",
    keyConcepts: ["消息异步投递", "生产者与消费者解耦", "后台批量写库"]
  },
  {
    id: "mod_net_client",
    projectId: "proj_muduo",
    name: "Client 客户端连接与请求",
    category: "Network",
    layer: "Client Ingress",
    sourceFiles: ["examples/chat/client.cc", "HttpServer/resource/AI.html"],
    classes: ["TcpClient", "HttpClient"],
    functions: ["connect()", "send()", "onMessage()", "disconnect()"],
    desc: "外部接入终端。向服务端发起 HTTP 请求与 SSE 流式数据接收。",
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
    desc: "Linux I/O 多路复用系统调用。使用红黑树管理监听的文件描述符，通过 epoll_wait 获取就绪事件链表。",
    threadModel: "内核系统调用，由 Poller 线程阻塞监听并唤醒",
    keyConcepts: ["LT 水平触发与 ET 边缘触发", "epoll 红黑树与就绪链表", "非阻塞 I/O 配合机制"]
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
    desc: "CppAIService 业务处理核心。负责 HTTP 请求分发、管理单用户多会话结构 (chatInformation[userId][sessionId])、调用大模型策略、执行 MCP 工具及投递 RabbitMQ 异步任务。",
    threadModel: "多线程并发处理业务请求，按 session_id 隔离 AIHelper 实例",
    keyConcepts: ["单用户多会话结构 (chatInformation)", "业务分发与 Handler 路由", "异步任务分离"]
  },
  {
    id: "mod_ai_rag",
    projectId: "proj_cppai",
    name: "RAG 检索增强生成与知识库模块",
    category: "AI",
    layer: "Knowledge Retrieval",
    sourceFiles: ["AIApps/ChatServer/src/AIUtil/AIStrategy.cpp", "AIApps/ChatServer/include/AIUtil/AIStrategy.h"],
    classes: ["AliyunRAGStrategy", "AIStrategy"],
    functions: ["buildRequest()", "parseResponse()", "retrieveKnowledge()"],
    desc: "RAG 检索增强生成模块。将文档切片并做向量召回，在模型推理时作为上下文补充，减少模型生成错误。",
    threadModel: "无状态检索策略，多线程共享",
    keyConcepts: ["向量语义检索 (Embedding)", "上下文提示词组装", "知识库检索"]
  }
];

// 3. 统一核心知识元数据网络 (DOMAIN_KNOWLEDGE_NODES)
var DOMAIN_KNOWLEDGE_NODES = [
  {
    id: "know_reactor_eventloop",
    title: "One Loop Per Thread 事件循环线程模型",
    category: "Network",
    moduleId: "mod_net_eventloop",
    muduoDays: [11, 14, 15],
    yuqueDocIds: ["yq_01", "yq_09", "yq_10"],
    summary: "主线程侦听连接并分发套接字，从线程运行独立的事件循环与 Poller，通过 eventfd 实现跨线程唤醒。",
    interviewTrap: "为什么不建议单线程处理全部连接读写？多线程共享同一个 epoll 文件描述符时会产生哪些问题？"
  },
  {
    id: "know_nonblocking_buffer",
    title: "非阻塞 I/O 与应用层 Buffer 缓冲区设计",
    category: "Memory",
    moduleId: "mod_net_buffer",
    muduoDays: [7, 8, 9, 21],
    yuqueDocIds: ["yq_05", "yq_06"],
    summary: "内核发送缓冲区满时将数据暂存应用层 Output Buffer 并注册 EPOLLOUT 事件；读取时通过 readv 结合 64KB 栈临时空间接收数据。",
    interviewTrap: "为什么非阻塞网络编程需要应用层 Buffer？直接依赖 send 返回 EAGAIN 会带来哪些处理开销？"
  },
  {
    id: "know_fsm_http_parser",
    title: "有限状态机 (FSM) HTTP 报文解析",
    category: "Protocol",
    moduleId: "mod_http_codec",
    muduoDays: [12, 13],
    yuqueDocIds: ["yq_06", "yq_07"],
    summary: "通过 CHECK_STATE_REQUESTLINE、CHECK_STATE_HEADER 与 CHECK_STATE_CONTENT 状态迁移，对 TCP 流式报文进行分段解析。",
    interviewTrap: "当报文跨 TCP 分包到达时状态机如何保存中间状态？如何限制请求头长度以防止内存耗尽？"
  },
  {
    id: "know_mcp_twostage",
    title: "MCP (Model Context Protocol) 与两段式工具调用流程",
    category: "AI",
    moduleId: "mod_ai_mcp_registry",
    muduoDays: [26, 27],
    yuqueDocIds: ["yq_16", "yq_17"],
    summary: "服务端解析模型返回的工具调用参数并在本地执行对应的 C++ 函数，随后将执行结果构造成消息回传给模型以完成后续回复。",
    interviewTrap: "两段式工具调用的交互时序是怎样的？当本地函数执行超时或抛出异常时如何组织返回内容？"
  },
  {
    id: "know_strategy_factory_llm",
    title: "策略模式与注册式工厂的多模型接口抽象",
    category: "Architecture",
    moduleId: "mod_ai_strategy",
    muduoDays: [2, 3],
    yuqueDocIds: ["yq_03", "yq_16", "yq_17"],
    summary: "基类 AIStrategy 统一封装各模型厂商的请求与响应格式，AIFactory 工厂通过注册表机制管理策略子类实例。",
    interviewTrap: "相较于条件分支判断，策略模式与工厂模式在扩充接入模型时在维护性和扩展性上有何差异？"
  },
  {
    id: "know_mq_async_decouple",
    title: "RabbitMQ 消息队列异步落库解耦",
    category: "Concurrency",
    moduleId: "mod_mq_rabbitmq_manager",
    muduoDays: [19, 20],
    yuqueDocIds: ["yq_16", "yq_17"],
    summary: "HTTP 连接负责处理客户端即时通信，历史消息与日志投递至 RabbitMQ 由消费者服务写入 MySQL 存储。",
    interviewTrap: "为什么需要将数据库写入操作与网络 I/O 线程分离？同步写入在磁盘 I/O 波动时对请求延迟有何影响？"
  },
  {
    id: "know_single_user_multi_session",
    title: "单用户多会话结构与内存会话映射",
    category: "Architecture",
    moduleId: "mod_http_session",
    muduoDays: [5, 6],
    yuqueDocIds: ["yq_08", "yq_17"],
    summary: "采用 unordered_map<int, unordered_map<string, shared_ptr<AIHelper>>> 二维结构维护用户与会话对象映射，隔离会话上下文。",
    interviewTrap: "并发访问二维映射表时应如何设计锁粒度？长时间运行的服务应采用何种策略清理过期会话？"
  },
  {
    id: "know_onnx_opencv_pipeline",
    title: "OpenCV 图像预处理与 ONNX Runtime 本地推理",
    category: "AI",
    moduleId: "mod_ai_onnx_vision",
    muduoDays: [24, 25],
    yuqueDocIds: ["yq_16", "yq_17"],
    summary: "服务端解码 Base64 图像，使用 OpenCV 调整尺寸与归一化像素，输入 ONNX Runtime 运行模型推理。",
    interviewTrap: "图像数据在预处理到输入张量阶段如何减少内存复制？ONNX Runtime 的 Session 在多线程调用时的约束是什么？"
  },
  {
    id: "know_client_ingress",
    title: "TCP 客户端连接与全双工通信接入",
    category: "Network",
    moduleId: "mod_net_client",
    muduoDays: [1, 5, 9],
    yuqueDocIds: ["yq_01", "yq_03"],
    summary: "客户端建立非阻塞 TCP 连接并维持长连接，传输 HTTP 请求与 SSE 流式数据。",
    interviewTrap: "应用层心跳检测与内核 TCP KeepAlive 的机制与探测周期有何差异？"
  },
  {
    id: "know_kernel_epoll_arch",
    title: "Linux epoll 水平触发与边缘触发机制",
    category: "Network",
    moduleId: "mod_kernel_epoll",
    muduoDays: [8, 13, 26],
    yuqueDocIds: ["yq_01", "yq_04"],
    summary: "Linux 内核中使用红黑树维护监听的文件描述符，通过就绪双向链表向用户空间返回就绪事件。",
    interviewTrap: "epoll 的 LT 与 ET 模式触发时机有何区别？在 ET 模式下循环读取套接字至 EAGAIN 的原因是什么？"
  },
  {
    id: "know_chatserver_multisession",
    title: "单用户多会话管理与业务路由调度",
    category: "AI",
    moduleId: "mod_ai_chatserver",
    muduoDays: [14, 19, 28],
    yuqueDocIds: ["yq_10", "yq_16", "yq_17"],
    summary: "基于 chatInformation[userId][sessionId] 结构维护用户多会话上下文，隔离不同会话的历史记录。",
    interviewTrap: "在多线程网络服务中，如何设计多会话映射的互斥保护与并发访问？"
  },
  {
    id: "know_rag_vector_retrieval",
    title: "RAG 知识库向量检索与上下文构建",
    category: "AI",
    moduleId: "mod_ai_rag",
    muduoDays: [27, 28],
    yuqueDocIds: ["yq_10", "yq_17"],
    summary: "对文本分块提取向量特征，通过相似度计算检索相关文本块，拼接至 Prompt 上下文中输入大模型。",
    interviewTrap: "检索增强生成 (RAG) 与模型微调在知识更新时效与计算资源需求上有何区别？"
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
    rootCause: "shared_from_this() 依赖对象内部的 weak_ptr 成员。该成员在构造函数执行完成并由 shared_ptr 接管后才完成初始化，在构造函数体内调用会直接抛出 std::bad_weak_ptr。",
    solution: "使用两段式构造：构造函数仅初始化成员，随后提供专门的 initialize() 或 connectEstablished() 成员函数，在对象已被 shared_ptr 持有后调用。",
    ironRule: "规范要求：不得在 C++ 构造函数中调用 shared_from_this() 或向外部注册依赖该指针的回调。"
  },
  {
    id: "pit_reactor_blocking_mq",
    title: "在事件循环线程中执行同步阻塞调用导致事件循环阻塞",
    category: "Concurrency",
    project: "proj_cppai",
    symptom: "当某连接的回调函数中执行耗时网络请求或数据库写入时，分配到同一事件循环线程的其他连接均无法及时响应事件。",
    rootCause: "muduo 采用单线程事件循环处理多个连接。在事件回调中执行同步 I/O 会阻塞该线程的 epoll_wait 与后续回调调度。",
    solution: "阻塞或耗时任务应提交至工作线程池或消息队列处理，计算完成后通过 EventLoop::queueInLoop 将结果切回事件循环线程。",
    ironRule: "规范要求：事件循环线程内禁止执行阻塞式 I/O 与耗时计算，确保事件循环及时流转。"
  },
  {
    id: "pit_mcp_json_deadlock",
    title: "MCP 工具调用未捕获异常导致会话状态未正确重置",
    category: "AI",
    project: "proj_cppai",
    symptom: "当本地工具函数执行失败或超时未处理时，请求未生成回包，后续请求因会话状态处于非空闲态而被拒绝。",
    rootCause: "执行本地工具派发时缺乏超时机制与异常捕获，异常发生后未恢复会话的就绪状态，破坏了多轮对话的时序。",
    solution: "增加超时保护与异常捕获，工具执行失败时将错误原因封装为工具响应回传给大模型，引导模型完成兜底答复。",
    ironRule: "规范要求：外部工具调用必须具备超时处理与异常回传机制，保证会话状态完整流转。"
  },
  {
    id: "pit_double_buffering_drop",
    title: "异步日志系统在写入速率超过磁盘 I/O 时内存持续增长",
    category: "Infrastructure",
    project: "proj_muduo",
    symptom: "持续高负载日志写入下，未落盘缓冲区持续积压，进程内存占用超出系统限制并被终止。",
    rootCause: "日志生成速率持续高于后台线程磁盘写入速率，缓冲区队列积压导致内存占用持续攀升。",
    solution: "限制待写入缓冲区队列上限（如最多保留 25 块），超出阈值时丢弃超额日志并记录警告，控制进程内存边界。",
    ironRule: "规范要求：异步队列必须设置容量上限，在消费能力受限时通过受控丢弃避免内存耗尽。"
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

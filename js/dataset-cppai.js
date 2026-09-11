// ==========================================================================
// CppAIService Engineering OS - 核心数据集 (dataset-cppai.js)
// 沉淀自 youngyangyang04/CppAIService 真实源码审计与程序员Carl语雀知识库
// ==========================================================================

// 1. CppAIService 真实模块全景字典
var CPPAI_MODULES = [
    {
        id: "mod_http_core",
        name: "HttpServer 核心服务框架",
        category: "Network / muduo",
        sourcePath: "HttpServer/src/http/HttpServer.cpp",
        headerPath: "HttpServer/include/http/HttpServer.h",
        classes: ["http::HttpServer", "muduo::net::TcpServer", "muduo::net::EventLoop"],
        responsibility: "基于 muduo 主从 Reactor 反应堆构建高性能 HTTP 服务器；管理连接生命周期、事件分发与回调组装。",
        threadModel: "主线程 Acceptor 监听 + EventLoopThreadPool 工作线程处理 I/O (默认4线程)",
        lifecycle: "进程启动时创建 -> start() 进入 loop -> 伴随进程存活",
        dependencies: ["muduo_net", "muduo_base", "Router", "SessionManager", "MiddlewareChain", "SslContext"],
        yuqueRef: "4. 框架梳理",
        interviewValue: "【高频】为什么采用 One Loop Per Thread 线程模型？相比多进程/单线程多路复用有何优势？"
    },
    {
        id: "mod_http_codec",
        name: "HTTP 报文解析与封装",
        category: "Protocol / Codec",
        sourcePath: "HttpServer/src/http/HttpContext.cpp",
        headerPath: "HttpServer/include/http/HttpRequest.h",
        classes: ["http::HttpContext", "http::HttpRequest", "http::HttpResponse"],
        responsibility: "有限状态机 (FSM) 解码 HTTP 请求行、请求头、空行与报文体；提供零拷贝与流式构造 HTTP 响应。",
        threadModel: "在对应连接所在的 EventLoop 线程内执行无锁解析",
        lifecycle: "绑定在 TcpConnection 上下文，随连接销毁而重置",
        dependencies: ["muduo::net::Buffer"],
        yuqueRef: "4.1 HTTP报文解析封装模块",
        interviewValue: "【高频】HTTP 解析的状态机如何设计？如何高效解决 TCP 粘包与半包问题？"
    },
    {
        id: "mod_router",
        name: "动态路由引擎 (Router)",
        category: "Core / Routing",
        sourcePath: "HttpServer/src/router/Router.cpp",
        headerPath: "HttpServer/include/router/Router.h",
        classes: ["http::router::Router", "http::router::RouterHandler"],
        responsibility: "提供双层路由查找：精确匹配使用 RouteKey 哈希表 O(1) 检索；动态路由支持 std::regex 正则与路径参数提取 (如 /user/:id)。",
        threadModel: "初始化阶段主线程完成注册，运行时只读无锁并发查找",
        lifecycle: "全局单例或 HttpServer 成员变量，随服务生命周期存在",
        dependencies: ["HttpRequest", "HttpResponse"],
        yuqueRef: "4.2 路由模块",
        interviewValue: "【实战Bug】正则回调传参缺陷分析：为什么必须传递 newReq 而非原始 req？"
    },
    {
        id: "mod_middleware",
        name: "中间件链 (MiddlewareChain) & CORS",
        category: "Middleware",
        sourcePath: "HttpServer/src/middleware/MiddlewareChain.cpp",
        headerPath: "HttpServer/include/middleware/cors/CorsMiddleware.h",
        classes: ["http::middleware::MiddlewareChain", "http::middleware::CorsMiddleware"],
        responsibility: "洋葱模型责任链设计；处理 OPTIONS 预检请求，统一注入 Access-Control-Allow-* 跨域头，支持动态拦截与鉴权。",
        threadModel: "与请求所在 I/O 线程一致",
        lifecycle: "HttpServer 启动时组装链表",
        dependencies: ["HttpRequest", "HttpResponse"],
        yuqueRef: "4.4 中间件模块",
        interviewValue: "【八股】什么是责任链模式？CORS 复杂请求的 preflight (OPTIONS) 机制是什么？"
    },
    {
        id: "mod_session",
        name: "会话管理 (SessionManager)",
        category: "State / Auth",
        sourcePath: "HttpServer/src/session/SessionManager.cpp",
        headerPath: "HttpServer/include/session/SessionManager.h",
        classes: ["http::session::SessionManager", "http::session::MemorySessionStorage"],
        responsibility: "生成安全会话 UUID，通过 Set-Cookie 注入浏览器；基于内存存储会话数据，支持超时检查与主动销毁。",
        threadModel: "内部使用 std::mutex 互斥保护并发会话字典",
        lifecycle: "常驻内存服务",
        dependencies: ["SessionStorage"],
        yuqueRef: "4.3 会话管理模块",
        interviewValue: "【八股】Cookie 与 Session 区别？分布式部署时如何解决内存 Session 无法跨机器共享？"
    },
    {
        id: "mod_db_pool",
        name: "MySQL 数据库连接池",
        category: "Database",
        sourcePath: "HttpServer/src/utils/db/DbConnectionPool.cpp",
        headerPath: "HttpServer/include/utils/db/DbConnectionPool.h",
        classes: ["http::db::DbConnectionPool", "http::db::DbConnection", "http::MysqlUtil"],
        responsibility: "RAII 锁 + 条件变量管理有限 MySQL 连接；避免频繁 TCP 握手开销；提供超时回收、心跳保活与自动重连。",
        threadModel: "全局单例，支持跨线程安全获取 (getConnection) 与自动归还",
        lifecycle: "启动时预热连接，进程退出时析构清空",
        dependencies: ["mysqlclient", "mysqlcppconn"],
        yuqueRef: "4.5 集成数据库连接池模块",
        interviewValue: "【高频】手写数据库连接池的关键设计点？如何防止连接泄漏与高并发死锁？"
    },
    {
        id: "mod_ssl",
        name: "HTTPS 与 SSL/TLS 传输层",
        category: "Security",
        sourcePath: "HttpServer/src/ssl/SslConnection.cpp",
        headerPath: "HttpServer/include/ssl/SslContext.h",
        classes: ["http::ssl::SslContext", "http::ssl::SslConnection"],
        responsibility: "封装 OpenSSL 库；管理证书私钥；处理非阻塞 SSL_read / SSL_write 与异步握手握合。",
        threadModel: "跟随底层 TcpConnection I/O 线程",
        lifecycle: "每条 TLS 连接独占 SslConnection 实例",
        dependencies: ["OpenSSL (libssl, libcrypto)"],
        yuqueRef: "4.6 HTTPS模块",
        interviewValue: "【八股】HTTPS TLS 1.3 握手流程？对称加密与非对称加密结合的工程意义？"
    },
    {
        id: "mod_chat_server",
        name: "AI 应用调度中枢 (ChatServer)",
        category: "Business Server",
        sourcePath: "AIApps/ChatServer/src/ChatServer.cpp",
        headerPath: "AIApps/ChatServer/include/ChatServer.h",
        classes: ["ChatServer", "main()"],
        responsibility: "全平台业务中枢；持有多用户多会话字典；绑定 13 个业务处理器；启动 RabbitMQ 消费线程池；启动时预热 MySQL 历史记录。",
        threadModel: "持有 httpServer_ 调度线程 + 后台 RabbitMQThreadPool 工作线程",
        lifecycle: "顶层应用单例生命期",
        dependencies: ["HttpServer", "AIHelper", "MQManager", "Handlers"],
        yuqueRef: "10. AI应用服务平台(CppAIService)第二版【升级】",
        interviewValue: "【项目亮点】如何组织大型 C++ 多模块服务？如何实现多用户多会话数据精准隔离？"
    },
    {
        id: "mod_ai_strategy",
        name: "多模型统一策略 (AIStrategy & AIFactory)",
        category: "AI Architecture",
        sourcePath: "AIApps/ChatServer/src/AIUtil/AIStrategy.cpp",
        headerPath: "AIApps/ChatServer/include/AIUtil/AIFactory.h",
        classes: ["AIStrategy", "AliyunStrategy", "DouBaoStrategy", "AliyunRAGStrategy", "AliyunMcpStrategy", "StrategyFactory"],
        responsibility: "策略模式统一多云模型 API；通过注册式工厂 StrategyFactory 实现无侵入新增模型；解耦参数构造与返回解析。",
        threadModel: "策略对象多线程无状态只读共享",
        lifecycle: "自注册结构体全局静态初始化",
        dependencies: ["JsonUtil", "CURL"],
        yuqueRef: "10. AI应用服务平台(CppAIService)第二版【升级】",
        interviewValue: "【设计模式】C++ 中如何利用静态注册 + 模板元编程实现零修改扩展新策略？"
    },
    {
        id: "mod_ai_helper",
        name: "对话引擎与上下文化 (AIHelper)",
        category: "AI Engine",
        sourcePath: "AIApps/ChatServer/src/AIUtil/AIHelper.cpp",
        headerPath: "AIApps/ChatServer/include/AIUtil/AIHelper.h",
        classes: ["AIHelper"],
        responsibility: "封装 libcurl 执行 HTTP RESTful 请求；维护该会话历史上下文 messages；触发两段式工具调用；下发异步入库消息。",
        threadModel: "每个 Session 独占独立的 AIHelper 实例，避免跨请求数据串扰",
        lifecycle: "随 Session 存活于内存哈希表中",
        dependencies: ["AIStrategy", "AIToolRegistry", "MQManager", "libcurl"],
        yuqueRef: "10. AI应用服务平台(CppAIService)第二版【升级】",
        interviewValue: "【工程实战】大模型上下文窗口截断如何处理？为什么 C++ 异步调 libcurl 需要特别注意生命期？"
    },
    {
        id: "mod_mcp_registry",
        name: "轻量级 MCP 工具注册表 (AIToolRegistry)",
        category: "Agent / MCP",
        sourcePath: "AIApps/ChatServer/src/AIUtil/AIToolRegistry.cpp",
        headerPath: "AIApps/ChatServer/include/AIUtil/AIToolRegistry.h",
        classes: ["AIToolRegistry"],
        responsibility: "对齐 Model Context Protocol 理念；注册天气、时间等工具函数；支持 JSON 参数动态调用与两段式 Prompt 组装。",
        threadModel: "线程安全注册与执行",
        lifecycle: "全局常驻工具单例",
        dependencies: ["JsonUtil", "CURL"],
        yuqueRef: "10. AI应用服务平台(CppAIService)第二版【升级】",
        interviewValue: "【前沿考点】什么是 MCP？大模型 Function Calling 的协议化闭环与两段式推理流程是什么？"
    },
    {
        id: "mod_multimodal",
        name: "多模态感知 (语音 ASR/TTS + 图像识别)",
        category: "Multimodal AI",
        sourcePath: "AIApps/ChatServer/src/AIUtil/AISpeechProcessor.cpp",
        headerPath: "AIApps/ChatServer/include/AIUtil/ImageRecognizer.h",
        classes: ["AISpeechProcessor", "ImageRecognizer"],
        responsibility: "集成百度 AI 完成语音转文字与语音合成 (Base64/MP3)；使用 OpenCV + ONNX Runtime 本地加载深度学习模型进行图像分类推理。",
        threadModel: "语音网络请求同步/异步等待；ONNX 推理在 CPU/GPU 执行",
        lifecycle: "模型与环境单例常驻",
        dependencies: ["opencv4", "onnxruntime", "CURL"],
        yuqueRef: "10. AI应用服务平台(CppAIService)第二版【升级】",
        interviewValue: "【跨界考点】C++ 生产环境如何接入 ONNX Runtime？本地推理 vs 云端 API 怎么做架构选型？"
    },
    {
        id: "mod_rabbitmq_async",
        name: "消息队列异步持久化 (MQManager)",
        category: "Distributed / Async",
        sourcePath: "AIApps/ChatServer/src/AIUtil/MQManager.cpp",
        headerPath: "AIApps/ChatServer/include/AIUtil/MQManager.h",
        classes: ["MQManager", "RabbitMQThreadPool"],
        responsibility: "前台同步更新内存上下文并秒级响应客户端；后台将聊天落盘 SQL 发送到 RabbitMQ (sql_queue)；后台多线程消费入 MySQL，彻底消除主线程阻塞。",
        threadModel: "MQ 连接池发布 + 2 个后台 Worker 线程持续消费",
        lifecycle: "随主服务一直运行",
        dependencies: ["SimpleAmqpClient", "rabbitmq", "MysqlUtil"],
        yuqueRef: "10. AI应用服务平台(CppAIService)第二版【升级】",
        interviewValue: "【架构亮点】为什么采用 RabbitMQ 削峰？如何保证前台内存与后台 MySQL 最终一致性？"
    }
];

// 2. 程序员 Carl 语雀《HTTP服务框架》完整目录树与元数据
var YUQUE_MANIFEST = [
    { id: 1, title: "学习建议", updateDate: "2025-04-09", category: "指南", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_http_core" },
    { id: 2, title: "1. 开篇", updateDate: "2025-01-20", category: "导学", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_http_core" },
    { id: 3, title: "2. 项目介绍", updateDate: "2025-01-20", category: "导学", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_chat_server" },
    { id: 4, title: "3. 环境准备", updateDate: "2025-06-16", category: "工程配置", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_http_core" },
    { id: 5, title: "4. 框架梳理 (总纲)", updateDate: "2025-01-16", category: "框架核心", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_http_core" },
    { id: 6, title: "4.1 HTTP报文解析封装模块", updateDate: "2025-09-26", category: "框架核心", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_http_codec" },
    { id: 7, title: "4.2 路由模块", updateDate: "2025-01-10", category: "框架核心", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_router" },
    { id: 8, title: "4.3 会话管理模块", updateDate: "2025-01-20", category: "框架核心", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_session" },
    { id: 9, title: "4.4 中间件模块", updateDate: "2025-01-10", category: "框架核心", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_middleware" },
    { id: 10, title: "4.5 集成数据库连接池模块", updateDate: "2025-01-15", category: "框架核心", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_db_pool" },
    { id: 11, title: "4.6 HTTPS模块", updateDate: "2025-02-10", category: "框架核心", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_ssl" },
    { id: 12, title: "5. 框架优化思路", updateDate: "2025-01-16", category: "架构演进", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_http_core" },
    { id: 13, title: "6. 框架应用之卡码五子棋", updateDate: "2025-01-21", category: "应用演进", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_chat_server" },
    { id: 14, title: "7. 简历写法", updateDate: "2025-12-29", category: "求职指导", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_chat_server" },
    { id: 15, title: "8. 相关面试题", updateDate: "2025-08-09", category: "求职指导", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_http_core" },
    { id: 16, title: "9. AI应用服务平台(CppAIService)第一版【升级】", updateDate: "2025-02-01", category: "AI升级", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_ai_helper" },
    { id: 17, title: "10. AI应用服务平台(CppAIService)第二版【升级】", updateDate: "2025-03-29", category: "AI升级", status: "LOGIN_REQUIRED", url: "https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n", module: "mod_ai_strategy" }
];

// 3. 8 周攻坚核心主线与里程碑
var ROADMAP_8WEEKS = [
    {
        week: 1,
        title: "Week 1: 环境启动与服务跑通 (从 0 到 1 解释入口)",
        tagline: "构建第一个可运行的 CppAIService 镜像",
        targetModule: "mod_http_core",
        milestone: "从 main() 开始追踪完整的服务启动流程，能向面试官讲清楚整个项目从哪里启动、加载了哪些配置",
        keySkills: ["Linux", "CMake", "Git", "GDB", "Docker"],
        tasks: [
            { id: "w1_t1", title: "编译并跑通 CppAIService 本地服务", time: 180, priority: "S", file: "AIApps/ChatServer/src/main.cpp" },
            { id: "w1_t2", title: "梳理 main.cpp 初始化流程与参数解析", time: 60, priority: "A", file: "AIApps/ChatServer/src/main.cpp" },
            { id: "w1_t3", title: "搭建 Linux + CMake 调试环境与断点配置", time: 60, priority: "A", file: "CMakeLists.txt" }
        ]
    },
    {
        week: 2,
        title: "Week 2: 现代 C++ 机制与底层 Reactor 解密",
        tagline: "穿透 muduo 事件分发与智能指针回调",
        targetModule: "mod_http_core",
        milestone: "吃透 One Loop Per Thread、epoll 多路复用、Channel 映射与 weak_ptr tie_ 解决对象析构竞态问题",
        keySkills: ["shared_ptr/weak_ptr", "RAII", "std::function/bind", "epoll", "eventfd"],
        tasks: [
            { id: "w2_t1", title: "精读 EventLoop::loop() 与 Poller::poll() 调用链", time: 120, priority: "S", file: "muduo/net/EventLoop.cc" },
            { id: "w2_t2", title: "分析 Channel::handleEventWithGuard() 的生命期自保机制", time: 90, priority: "S", file: "muduo/net/Channel.cc" },
            { id: "w2_t3", title: "编写 mini-Reactor 实验对比 LT 与 ET 触发行为", time: 60, priority: "A", file: "scratch/epoll_et_lt.cpp" }
        ]
    },
    {
        week: 3,
        title: "Week 3: HTTP 报文解析、会话与动态路由改造",
        tagline: "掌握工业级有限状态机与 RESTful 路由",
        targetModule: "mod_router",
        milestone: "理解从字节流到 HttpRequest 的状态流转，亲手修复 Router.cpp 动态路由正则回调参数传递 Bug",
        keySkills: ["有限状态机", "std::regex", "Cookie/Session", "CORS 预检"],
        tasks: [
            { id: "w3_t1", title: "审计并修复 Router.cpp 正则路由 callback 传参 Bug", time: 90, priority: "S", file: "HttpServer/src/router/Router.cpp" },
            { id: "w3_t2", title: "单步跟踪 HttpContext 状态机解析 HTTP 请求行与头部", time: 90, priority: "A", file: "HttpServer/src/http/HttpContext.cpp" },
            { id: "w3_t3", title: "验证 SessionManager 内存会话超时淘汰逻辑", time: 60, priority: "B", file: "HttpServer/src/session/SessionManager.cpp" }
        ]
    },
    {
        week: 4,
        title: "Week 4: 并发、MySQL 连接池与 RabbitMQ 异步写库",
        tagline: "掌握异步化与高并发数据削峰填谷",
        targetModule: "mod_rabbitmq_async",
        milestone: "讲清楚为什么前台同步内存、后台异步 RabbitMQ 入库？高并发场景下能承受多少 QPS？",
        keySkills: ["MySQL Connection Pool", "RabbitMQ", "生产者消费者模型", "条件变量", "原子操作"],
        tasks: [
            { id: "w4_t1", title: "精读 MQManager 连接池与 RabbitMQThreadPool 消费者线程池", time: 120, priority: "S", file: "AIApps/ChatServer/src/AIUtil/MQManager.cpp" },
            { id: "w4_t2", title: "验证 ChatServer 启动时 readDataFromMySQL 历史预热机制", time: 60, priority: "A", file: "AIApps/ChatServer/src/ChatServer.cpp" },
            { id: "w4_t3", title: "测试连接池耗尽与空闲连接自愈状态机", time: 60, priority: "B", file: "HttpServer/src/utils/db/DbConnectionPool.cpp" }
        ]
    },
    {
        week: 5,
        title: "Week 5: AI 服务工程、策略模式与多模型调用链",
        tagline: "彻底解耦模型提供方与业务调用链",
        targetModule: "mod_ai_strategy",
        milestone: "掌握 C++ 策略模式 + 注册式工厂，能手写接入第三方大模型（通义、豆包、DeepSeek 等）",
        keySkills: ["Design Pattern (Strategy & Factory)", "libcurl", "JSON 序列化", "环境变量鉴权"],
        tasks: [
            { id: "w5_t1", title: "梳理 StrategyRegister<T> 静态自注册工厂机制", time: 90, priority: "S", file: "AIApps/ChatServer/include/AIUtil/AIFactory.h" },
            { id: "w5_t2", title: "为 CppAIService 扩展接入 DeepSeek 或自定义 Mock 策略", time: 90, priority: "S", file: "AIApps/ChatServer/src/AIUtil/AIStrategy.cpp" },
            { id: "w5_t3", title: "优化 AIHelper 多轮会话历史截断与 Token 预算控制", time: 60, priority: "A", file: "AIApps/ChatServer/src/AIUtil/AIHelper.cpp" }
        ]
    },
    {
        week: 6,
        title: "Week 6: 轻量级 MCP 落地、Tool Registry 与多模态",
        tagline: "赋予 C++ 大模型自主感知与工具调用能力",
        targetModule: "mod_mcp_registry",
        milestone: "讲清楚大模型两段式推理与 Model Context Protocol 协议落地，完成本地 ONNX 图像分类与语音流接入",
        keySkills: ["MCP Protocol", "Function Calling", "OpenCV", "ONNX Runtime", "ASR/TTS"],
        tasks: [
            { id: "w6_t1", title: "剖析 AIToolRegistry 两段式问答与 Prompt 协议注入", time: 90, priority: "S", file: "AIApps/ChatServer/src/AIUtil/AIToolRegistry.cpp" },
            { id: "w6_t2", title: "新增一个系统监控 MCP 工具并在网页端跑通两段式推理", time: 90, priority: "S", file: "AIApps/ChatServer/src/AIUtil/AIToolRegistry.cpp" },
            { id: "w6_t3", title: "跑通 ImageRecognizer ONNX Runtime 本地模型预测流程", time: 60, priority: "A", file: "AIApps/ChatServer/src/AIUtil/ImageRecognizer.cpp" }
        ]
    },
    {
        week: 7,
        title: "Week 7: 工业级测试、压测、稳定性与容器化交付",
        tagline: "从能跑蜕变为生产就绪的坚固工程",
        targetModule: "mod_http_core",
        milestone: "使用 WebBench 进行高并发压测，使用 AddressSanitizer 排查内存泄漏，产出真实基准报告",
        keySkills: ["WebBench / ab", "AddressSanitizer", "Valgrind", "Docker-compose", "QPS 调优"],
        tasks: [
            { id: "w7_t1", title: "开启 -fsanitize=address 进行全链路接口内存探针巡检", time: 90, priority: "S", file: "CMakeLists.txt" },
            { id: "w7_t2", title: "对 HttpServer /chat 端点进行 1000 并发压力测试并记录延迟", time: 90, priority: "S", file: "docs/benchmark_report.md" },
            { id: "w7_t3", title: "编写 Docker-compose 一键编排 MySQL + RabbitMQ + CppAIService", time: 60, priority: "A", file: "docker-compose.yml" }
        ]
    },
    {
        week: 8,
        title: "Week 8: 工程资产归档、简历打磨与技术面试通关",
        tagline: "形成可验证、能抗住 20 分钟深挖的硬核求职资产",
        targetModule: "mod_chat_server",
        milestone: "将整个 8 周的真实 Git Commit、排错复盘和压测数据打磨成简历核心项目亮点，演练 30 道项目真题",
        keySkills: ["简历亮点提炼", "技术深挖回答套路", "白板架构推导", "口述项目闭环"],
        tasks: [
            { id: "w8_t1", title: "整理 My CppAIService Engineering Contributions 贡献清单", time: 90, priority: "S", file: "docs/my_contributions.md" },
            { id: "w8_t2", title: "完成 CppAIService 30 道大厂高频面试题标准答辩录制", time: 120, priority: "S", file: "docs/interview_bank.md" },
            { id: "w8_t3", title: "生成简历专属项目 Bullet Points (含量化指标与排错经验)", time: 60, priority: "A", file: "docs/resume_bullets.md" }
        ]
    }
];

// 4. CppAIService 高频面试真题与标准深度应答库
var CPPAI_INTERVIEW_BANK = [
    {
        id: "iv_1",
        category: "C++ 并发与对象生命期",
        question: "在 muduo 网络库与本项目的 TcpConnection 中，为什么需要继承 std::enable_shared_from_this？直接传 this 指针有什么致命缺陷？",
        shortAnswer: "防止异步回调执行时对象已经被销毁，导致悬空指针非法内存访问 (Use-After-Free)。",
        detailedAnswer: "TcpConnection 代表一个客户端连接，其生命周期是不确定的（客户端可能随时断开）。在注册可读、可写或关闭回调时，若直接绑定裸指针 std::bind(&TcpConnection::handleRead, this)，当连接在等待 I/O 期间被客户端强行 RST 或在主线程被移除，其内存可能已被释放。当 epoll 事件随后被触发并调用该函数时，就会解引用野指针导致段错误崩溃！通过继承 enable_shared_from_this，可以在绑定回调时使用 shared_from_this()，引用计数加 1，强制延长连接生命期直到回调安全执行完毕。",
        projectContext: "HttpServer::onConnection 与 TcpConnection 回调注册 (HttpServer.cpp#L123)",
        sourceRef: "HttpServer/src/http/HttpServer.cpp",
        followUp: "如果在构造函数中直接调用 shared_from_this() 会怎样？为什么？（答：会抛出 std::bad_weak_ptr 异常，因为控制块尚未与 shared_ptr 完成绑定）"
    },
    {
        id: "iv_2",
        category: "Linux 网络与 I/O 多路复用",
        question: "讲解 epoll 的水平触发 (LT) 与边沿触发 (ET) 机制？muduo 和 CppAIService 为什么默认采用 LT 模式？",
        shortAnswer: "LT 只要缓冲区有数据就会持续通知，更安全可靠不易丢事件；ET 仅在状态变化时通知一次，对代码要求极苛刻。",
        detailedAnswer: "1. LT (Level Triggered)：可读或可写事件就绪时，只要内核缓冲区还有剩余数据，每次调用 epoll_wait 都会返回就绪。容错性高，不容易写出丢事件的 Bug。\n2. ET (Edge Triggered)：只有状态发生跳变（从未就绪到就绪）时才通知一次。要求用户必须配合非阻塞套接字，并且必须用 while 循环一直 read 到返回 EAGAIN/EWOULDBLOCK 为止。\n3. muduo 采用 LT 是因为应用层自带高内聚的 Buffer 缓冲机制：读事件触发时直接一次性通过 readv 读到栈和 Buffer 中；即使没读完，下次循环还会继续通知，逻辑简单健壮，性能与 ET 相比几乎无差异，极大地降低了多线程编程的复杂度。",
        projectContext: "muduo::net::EPollPoller 与 Buffer::readFd",
        sourceRef: "HttpServer/include/http/HttpServer.h",
        followUp: "使用 ET 模式时，如果 read 返回 EAGAIN，怎么判断是对端优雅关闭还是暂时没有数据？"
    },
    {
        id: "iv_3",
        category: "项目实战与排错能力 (真实代码 Bug)",
        question: "在你的项目中，动态路由正则匹配 (Router::route) 曾遇到过什么 Bug？你是怎么定位并解决的？",
        shortAnswer: "在提取路径参数到新请求 newReq 后，回调函数误传了未注入参数的原始 req 对象，导致接口永远读不到动态参数。",
        detailedAnswer: "在审计 HttpServer/src/router/Router.cpp 时发现：当客户端请求 /user/123 这类 RESTful 路径时，系统通过 std::regex 匹配成功，并调用 extractPathParameters(match, newReq) 将参数注入到了本地临时拷贝 newReq 中。但是在执行回调时，代码写成了 callback(req, resp); 而不是 callback(newReq, resp);！这导致业务 Handler 拿到的始终是空参数，从而引发后续逻辑异常。我们在本地通过编写多参数正则路由单元测试精准复现该问题，修正参数传递后提交了修复 PR，消除了隐患。",
        projectContext: "HttpServer/src/router/Router.cpp#L67-73",
        sourceRef: "HttpServer/src/router/Router.cpp",
        followUp: "std::regex 在高并发场景下有哪些性能隐患？怎么做优化？（答：编译正则开销大，应在启动阶段预编译并缓存；超长路径可能导致回溯耗尽 CPU）"
    },
    {
        id: "iv_4",
        category: "分布式与异步架构",
        question: "为什么 CppAIService 在处理聊天消息持久化时不直接同步写 MySQL，而是引入 RabbitMQ 异步入库？",
        shortAnswer: "消除前台 I/O 阻塞，将耗时不可控的磁盘写操作异步削峰，保证前端高并发与毫秒级即时响应。",
        detailedAnswer: "1. 同步写的痛点：一次 MySQL insert 涉及网络往返与磁盘事务提交，耗时通常在数毫秒到几十毫秒。如果用户聊天高并发涌入，I/O 线程全部阻塞在等待数据库响应上，吞吐量将断崖式下跌，且数据库容易被突发峰值打崩。\n2. 异步削峰方案：ChatServer 收到大模型回答后，立即在内存中同步更新 messages 字典并返回给客户端，用户感知极快（零等待）。随后将要落盘的 SQL 字符串异步发布到 RabbitMQ 队列 (sql_queue)。\n3. 后台消费：后台启动 2 个 Worker 线程从队列按既定节奏平稳消费并入库。即使数据库发生短暂停顿或锁表，消息依然安全堆积在 MQ 中，不会丢失，实现了前后台完全解耦与流量削峰。",
        projectContext: "AIApps/ChatServer/src/AIUtil/MQManager.cpp (RabbitMQThreadPool)",
        sourceRef: "AIApps/ChatServer/src/AIUtil/MQManager.cpp",
        followUp: "前台内存和后台 MySQL 数据在极端掉电情况下如何保证最终一致性？"
    },
    {
        id: "iv_5",
        category: "大模型工程化与 Agent",
        question: "介绍一下 CppAIService 是如何落地类似 MCP (Model Context Protocol) 思想的两段式推理与工具调用的？",
        shortAnswer: "通过 AIToolRegistry 配置化注册工具接口 + Prompt 协议化驱动模型返回工具参数 -> C++ 执行工具 -> 二次推导回答。",
        detailedAnswer: "1. 工具协议注册：在 AIToolRegistry 中通过 std::function 注册本地能力（例如 getWeather 查询天气、getTime 查询系统时间）。\n2. 阶段一（意图识别）：在发送给模型的 System Prompt 中注入结构化工具清单与调用协议。当用户问“今天杭州需要带伞吗？”，模型判断需要借助外部工具，返回约定格式的 JSON 指令：{\"tool\": \"getWeather\", \"args\": {\"city\": \"Hangzhou\"}}。\n3. 工具本地执行：C++ 解析出调用指令，由 AIToolRegistry::invoke() 执行真实的天气 API，获得返回值（例如“杭州降水概率80%”）。\n4. 阶段二（综合回答）：将工具返回的数据作为新的上下文角色拼接回对话历史，二次触发模型生成最终自然语言回复：“杭州今天有大雨，请务必带伞！”整个过程完全闭环在 C++ 内部，不需要依赖任何笨重的 Python LangChain 框架。",
        projectContext: "AIToolRegistry.cpp 与 AIHelper::chat",
        sourceRef: "AIApps/ChatServer/include/AIUtil/AIToolRegistry.h",
        followUp: "如果模型多次连续死循环调用工具，系统如何进行熔断与最大迭代限制？"
    }
];

// 5. 初始工程任务清单 (无损对齐 Google Tasks 截图)
var INITIAL_ENGINEERING_TASKS = [
    {
        id: "task_init_1",
        title: "【主线】编译并完整跑通 CppAIService 服务",
        category: "PROJECT",
        priority: "S",
        status: "TODO",
        estimatedMinutes: 180,
        actualMinutes: 0,
        projectModule: "mod_http_core",
        sourceFile: "AIApps/ChatServer/src/main.cpp",
        yuqueDoc: "3. 环境准备",
        capabilityId: "cap_run_project",
        interviewQuestions: [
            { question: "讲讲 CppAIService 启动流程与依赖库？", corePoint: "CMakeLists 链接 OpenSSL, muduo, MySQL, RabbitMQ, ONNX" }
        ],
        createdAt: "2026-09-11"
    },
    {
        id: "task_init_2",
        title: "【主线】修复 Router.cpp 动态路由正则回调传参缺陷",
        category: "PROJECT",
        priority: "S",
        status: "TODO",
        estimatedMinutes: 90,
        actualMinutes: 0,
        projectModule: "mod_router",
        sourceFile: "HttpServer/src/router/Router.cpp",
        yuqueDoc: "4.2 路由模块",
        capabilityId: "cap_router_fix",
        interviewQuestions: [
            { question: "项目中曾排查过什么深层代码 Bug？", corePoint: "正则提取后未向回调传递 newReq，导致参数丢失" }
        ],
        createdAt: "2026-09-11"
    },
    {
        id: "task_init_3",
        title: "【算法】C++ 手撕系列：每日 3 道高频算法题",
        category: "ALGO",
        priority: "A",
        status: "TODO",
        estimatedMinutes: 60,
        actualMinutes: 0,
        projectModule: "Algorithms",
        capabilityId: "cap_algo_ds",
        interviewQuestions: [
            { question: "快速排序/堆排序的递归与迭代手撕，复杂度分析？", corePoint: "手撕无死角、时间空间复杂度分析、边界特判" }
        ],
        createdAt: "2026-09-11"
    },
    {
        id: "task_init_4",
        title: "【系统】《Linux多线程服务端编程》搭配项目核心精读",
        category: "LINUX",
        priority: "A",
        status: "TODO",
        estimatedMinutes: 45,
        actualMinutes: 0,
        projectModule: "mod_http_core",
        sourceFile: "muduo/net/EventLoop.cc",
        capabilityId: "cap_linux_reactor",
        interviewQuestions: [
            { question: "为什么 muduo 强调非阻塞 I/O + IO 复用 + 线程池？", corePoint: "Reactor 模型的本质与线程安全边界" }
        ],
        createdAt: "2026-09-11"
    },
    {
        id: "task_init_5",
        title: "【系统】《鸟哥的私房菜》Linux 常用网络排错与 Bash 调试",
        category: "LINUX",
        priority: "A",
        status: "TODO",
        estimatedMinutes: 30,
        actualMinutes: 0,
        capabilityId: "cap_linux_cmd",
        interviewQuestions: [
            { question: "netstat / ss / tcpdump 排查网络连接状态的命令？", corePoint: "TIME_WAIT 与 CLOSE_WAIT 大量产生的原因及排查" }
        ],
        createdAt: "2026-09-11"
    },
    {
        id: "task_init_6",
        title: "【八股】C++ 与 AI Agent 深度高频面试八股专项突破",
        category: "INTERVIEW",
        priority: "B",
        status: "TODO",
        estimatedMinutes: 30,
        actualMinutes: 0,
        projectModule: "mod_ai_strategy",
        capabilityId: "cap_interview_master",
        interviewQuestions: [
            { question: "shared_ptr 控制块的原子引用计数原理？weak_ptr 解决什么？", corePoint: "双控制计数、多线程读写安全边界" }
        ],
        createdAt: "2026-09-11"
    },
    {
        id: "task_init_7",
        title: "【就业】牛客网：浏览 C++ 后端高频 JD 与信息差分析",
        category: "CAREER",
        priority: "C",
        status: "TODO",
        estimatedMinutes: 20,
        actualMinutes: 0,
        capabilityId: "cap_career_info",
        createdAt: "2026-09-11"
    },
    {
        id: "task_init_8",
        title: "【成长】个人心智阅读：《非暴力沟通》/《金融学》/《博弈论》",
        category: "GROWTH",
        priority: "C",
        status: "TODO",
        estimatedMinutes: 30,
        actualMinutes: 0,
        capabilityId: "cap_personal_growth",
        createdAt: "2026-09-11"
    }
];

// 6. 算法手撕库模版
var INITIAL_ALGORITHM_LOGS = [
    {
        id: "algo_1",
        date: "2026-09-11",
        title: "LeetCode 208. 实现 Trie (前缀树)",
        difficulty: "Medium",
        tags: ["Trie", "设计", "字典树"],
        approach: "每个节点包含 26 个子节点指针数组与 isEnd 标记；利用现代 C++ unique_ptr 或原生数组管理内存。",
        firstMistake: "析构时未递归清理内存导致 Valgrind 报泄漏（后改用智能指针消除内存管理隐患）。",
        codeSnippet: "class Trie {\n    bool isEnd = false;\n    Trie* next[26] = {};\npublic:\n    void insert(string word) { ... }\n};",
        complexity: "时间 O(L)，空间 O(L * 26)",
        independent: true,
        revisitDate: "2026-09-14",
        oralExplanation: "前缀树本质是用空间换时间的检索数据结构，核心在于利用公共前缀降低查询时间开销。"
    }
];

console.log("[DATASET] CppAIService Engineering OS dataset loaded successfully.");

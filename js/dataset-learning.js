// ==========================================================================
// CppAIService & muduo Dual-Core Engineering OS
// Phase 5: 统一学习系统核心数据集 (dataset-learning.js)
// 破除五大孤岛：C++ 语法、Linux 底层、专业书目、算法手撕、技术八股、通识阅读
// 闭环体系：Learn → Apply → Build → Explain → Review
// 六维穿透：Knowledge ➔ Project ➔ Source ➔ Task ➔ Evidence ➔ Interview
// ==========================================================================

// 1. C++ 核心知识体系 (8 大维度)
var CPP_KNOWLEDGE_SYSTEM = [
  {
    id: "cpp_dim_modern",
    dimension: "Modern C++",
    title: "现代 C++11/14/17 标准演进与特性选型",
    coreConcept: "从 auto、decltype 类型推导，到 constexpr 编译期计算、结构化绑定与 if-init。在高性能服务端中减少冗余样板代码，强化编译期安全校验。",
    cppaiModule: "mod_http_router",
    moduleName: "HttpServer / 路由分发模块",
    sourceFile: "HttpServer/Router.cpp",
    sourceLine: "L32-L68",
    yuqueDocId: "yq_07",
    yuqueTitle: "07_路由模块",
    taskDay: 2,
    taskTitle: "Day 2: 现代 C++11/14 特性在网络服务中的落地",
    interviewPoint: "C++17 结构化绑定 (Structured Binding) 底层是如何实现的？constexpr 函数在不同编译优化级别下的内联与常量折叠机制是什么？",
    learnLoop: {
      learn: "精读 C++11/14/17 核心语法标准，重点掌握右值引用、可变参数模板与类型萃取。",
      apply: "在 Router.cpp 中采用 std::tuple 与结构化绑定解析路由匹配参数。",
      build: "编写微型路由注册与正则通配符提取 Demo，验证编译期分发速度。",
      explain: "口述：为什么现代网络库尽量避免宏定义，转而使用 constexpr 与类型安全模板？",
      review: "对比 C++03 与 C++17 在路由表哈希查找代码量与二进制指令精简程度。"
    }
  },
  {
    id: "cpp_dim_memory",
    dimension: "Memory",
    title: "内存管理、对齐与无锁内存布局",
    coreConcept: "理解栈、堆、数据段内存分布，掌握 Cacheline 64 字节对齐、伪共享 (False Sharing) 规避与 Buffer 空间预分配策略。",
    cppaiModule: "mod_net_buffer",
    moduleName: "muduo / Buffer 缓冲区",
    sourceFile: "muduo/net/Buffer.cc",
    sourceLine: "L15-L42",
    yuqueDocId: "yq_06",
    yuqueTitle: "06_HTTP报文解析封装模块",
    taskDay: 8,
    taskTitle: "Day 8: Buffer 连续内存与 readv 栈上分散读机制",
    interviewPoint: "muduo Buffer 为什么使用 std::vector<char> 而非原生 char*？为什么在读取时需要借助 64KB 栈上临时缓冲区 (readv)？",
    learnLoop: {
      learn: "学习计算机体系结构中的 CPU L1/L2/L3 缓存行与虚存分页原理。",
      apply: "在 Buffer 中利用 cheapPrependable + readerIndex + writerIndex 消除频繁移动内存。",
      build: "用 readv 系统调用同时向 Buffer 和栈空间读入大报文，验证零浪费动态扩容。",
      explain: "口述：如何排查内存对齐导致的内存空洞与多线程 cacheline 竞争穿透？",
      review: "使用 valgrind 或 ASan 监测长时间运行下的内存增长斜率。"
    }
  },
  {
    id: "cpp_dim_stl",
    dimension: "STL",
    title: "STL 容器特化、迭代器失效与并发安全边界",
    coreConcept: "深入 std::vector 扩容缩容机制、std::unordered_map 哈希桶再哈希 (rehash) 惩罚，以及 std::list 双向链表节点缓存。",
    cppaiModule: "mod_http_session",
    moduleName: "HttpServer / Session 会话管理",
    sourceFile: "HttpServer/SessionManager.cpp",
    sourceLine: "L45-L92",
    yuqueDocId: "yq_08",
    yuqueTitle: "08_会话管理模块",
    taskDay: 10,
    taskTitle: "Day 10: STL 容器选型与二维 Session 映射表设计",
    interviewPoint: "std::unordered_map 在并发读写时插入元素导致 rehash，为什么会造成迭代器失效甚至死锁？如何设计分段锁保护？",
    learnLoop: {
      learn: "研读 libc++ / libstdc++ 中 unordered_map 与 vector 底层实现源码。",
      apply: "在 SessionManager 中使用 std::unordered_map<int, std::unordered_map<string, shared_ptr<Session>>> 存储双层上下文。",
      build: "构建高并发下大量客户端连接建立与销毁基准，监控 map 扩容时的瞬时耗时。",
      explain: "口述：为什么在多线程网络库中遍历 STL 容器时必须注意读写锁的升级死锁风险？",
      review: "定期执行错题自测，牢记不同容器在 erase() 时的迭代器自增规范。"
    }
  },
  {
    id: "cpp_dim_template",
    dimension: "Template",
    title: "泛型编程、模板元编程与 SFINAE 萃取",
    coreConcept: "通过函数模板与类模板实现基础设施组件的强类型复用，利用 std::enable_if 和 type_traits 在编译期完成类型特化检查。",
    cppaiModule: "mod_storage_mysql_pool",
    moduleName: "Common / 数据库连接池与通用连接管理",
    sourceFile: "HttpServer/DbConnectionPool.h",
    sourceLine: "L20-L55",
    yuqueDocId: "yq_10",
    yuqueTitle: "10_集成数据库连接池模块",
    taskDay: 22,
    taskTitle: "Day 22: 泛型连接池与资源生命周期模板抽象",
    interviewPoint: "C++ 模板特化与偏特化的规则是什么？SFINAE (匹配失败非错误) 在现代网络库接口设计中如何避免歧义调用？",
    learnLoop: {
      learn: "掌握模板推导规则、完美转发 (std::forward) 与可变参数包解包。",
      apply: "实现通用的 RAII 资源借还智能守卫 ResourceGuard<PoolType>。",
      build: "手写泛型 BlockingQueue<T> 阻塞队列并在工作线程池中调度异构任务。",
      explain: "口述：为什么模板代码一般需要在头文件中完整定义？模板膨胀 (Code Bloat) 如何控制？",
      review: "复查项目中的通用组件，确认模板约束与编译期报错信息的可读性。"
    }
  },
  {
    id: "cpp_dim_smart_pointer",
    dimension: "Smart Pointer",
    title: "智能指针所有权哲学与引用计数多线程安全",
    coreConcept: "彻底划分独占语义 (std::unique_ptr)、共享语义 (std::shared_ptr) 与观察者语义 (std::weak_ptr)。理解内部控制块 (Control Block) 的强弱引用计数机制。",
    cppaiModule: "mod_net_channel",
    moduleName: "muduo / Channel 事件分发通道",
    sourceFile: "muduo/net/Channel.cc",
    sourceLine: "L45-L88",
    yuqueDocId: "yq_03",
    yuqueTitle: "03_2.项目介绍",
    taskDay: 14,
    taskTitle: "Day 14: Channel::tie_ 弱引用防御悬垂指针与对象析构撕裂",
    interviewPoint: "shared_ptr 自身的引用计数是线程安全的，为什么指向的对象不是？Channel::tie_ 的底层原理是什么？为什么必须先 lock() 再使用？",
    learnLoop: {
      learn: "学习《Linux多线程服务端编程》第 1 章对象生命周期管理。",
      apply: "在 Channel::handleEventWithGuard 中通过 tie_.lock() 升级强引用保护活动连接。",
      build: "模拟客户端在发生读事件处理中途发起主动断开，验证 weak_ptr 阻止野指针崩溃。",
      explain: "口述：为什么在构造函数中调用 shared_from_this() 会抛出 bad_weak_ptr 异常？",
      review: "审查项目中全部 raw pointer，确保无任何未受管辖的裸指针暴露给异步线程。"
    }
  },
  {
    id: "cpp_dim_move",
    dimension: "Move",
    title: "右值引用、移动语义与完美转发",
    coreConcept: "深入区分左值 (lvalue)、将亡值 (xvalue) 与纯右值 (prvalue)。掌握 std::move 的强制类型转换本质与 std::forward 的引用折叠规则，彻底消灭深拷贝。",
    cppaiModule: "mod_net_eventloop",
    moduleName: "muduo / EventLoop 异步任务投递队列",
    sourceFile: "muduo/net/EventLoop.cc",
    sourceLine: "L120-L160",
    yuqueDocId: "yq_09",
    yuqueTitle: "09_中间件模块",
    taskDay: 16,
    taskTitle: "Day 16: EventLoop::queueInLoop 中的移动语义与双缓冲任务转移",
    interviewPoint: "移动语义会释放源对象的资源吗？std::move 内部是如何利用 static_cast 实现的？什么情况下 move 仍然会退化为深拷贝？",
    learnLoop: {
      learn: "精读 Effective Modern C++ 关于移动语义与完美转发的条款。",
      apply: "在 pendingFunctors_.push_back(std::move(cb)) 中无缝转移回调函数对象所有权。",
      build: "对比在 100 万次异步投递中传引用、传值拷贝与 std::move 的执行耗时与分配次数。",
      explain: "口述：移动构造函数为什么要标记 noexcept？未标 noexcept 对 vector 扩容有何灾难性影响？",
      review: "检查所有自定义类是否正确遵守 Rule of Five (五法则)。"
    }
  },
  {
    id: "cpp_dim_concurrency",
    dimension: "Concurrency",
    title: "多线程同步原语、原子操作与内存序 (Memory Order)",
    coreConcept: "精通 std::mutex、std::lock_guard、std::unique_lock 与 std::condition_variable。深入 std::atomic、acquire-release 语义与无锁队列设计思想。",
    cppaiModule: "mod_base_threadpool",
    moduleName: "muduo / ThreadPool 工作线程池",
    sourceFile: "muduo/base/ThreadPool.cc",
    sourceLine: "L30-L85",
    yuqueDocId: "yq_04",
    yuqueTitle: "04_3.环境准备",
    taskDay: 18,
    taskTitle: "Day 18: 条件变量惊群与虚假唤醒 (Spurious Wakeup) 防御",
    interviewPoint: "为什么条件变量 wait() 必须使用 while 循环检查条件而不是 if？MutexLockGuard RAII 是如何防死锁的？",
    learnLoop: {
      learn: "学习 POSIX pthread 线程库与 C++11 <thread>/<mutex>/<atomic> 标准模型。",
      apply: "在 ThreadPool::take() 中通过 while(queue_.empty()) 防范虚假唤醒并由条件变量通知。",
      build: "构建多生产者多消费者高并发任务队列，验证 graceful shutdown 优雅退出机制。",
      explain: "口述：死锁产生的四大必要条件是什么？如何在工程上通过加锁顺序破坏环路等待？",
      review: "在开发环境下运行 ThreadSanitizer (TSan) 扫描数据竞争 (Data Race)。"
    }
  },
  {
    id: "cpp_dim_pattern",
    dimension: "Design Pattern",
    title: "服务端经典设计模式与工程解耦实践",
    coreConcept: "在网络与 AI 服务中落地单例模式 (Meyer's Singleton)、工厂模式、策略模式、观察者模式与洋葱拦截器中间件链。",
    cppaiModule: "mod_ai_strategy",
    moduleName: "AIApps / 多模型策略工厂与工具适配",
    sourceFile: "AIApps/ChatServer/src/AIStrategy.cpp",
    sourceLine: "L25-L90",
    yuqueDocId: "yq_16",
    yuqueTitle: "16_9. AI应用服务平台第一版",
    taskDay: 20,
    taskTitle: "Day 20: 策略模式 + 注册式工厂支持多厂商大模型无缝插拔",
    interviewPoint: "C++11 局部静态变量实现的单例模式 (Meyer's Singleton) 为什么天然线程安全？策略模式与简单工厂结合的优越性是什么？",
    learnLoop: {
      learn: "深入 23 种设计模式在 C++ 服务端架构中的现实映射，避免为了模式而模式。",
      apply: "AIStrategy 基类声明统一的 callLLM 接口，各厂商实现具体子类，由 AIFactory 统一创建。",
      build: "新增一个本地 Mock 模型策略子类，不修改任何上层业务代码完成动态路由验证。",
      explain: "口述：如何用责任链模式 (Chain of Responsibility) 实现 HTTP 中间件流水线？",
      review: "对照开闭原则 (OCP)，评估现有模块在引入新需求时的修改扩散范围。"
    }
  }
];

// 2. Linux 基础与系统调用实战体系 (9 大维度)
var LINUX_SYSTEM_KNOWLEDGE = [
  {
    id: "linux_dim_bash",
    dimension: "Bash",
    title: "Linux Shell 脚本自动化、环境变量与运维排障",
    syscallOrCmd: "bash / env / export / pipe | / redirect > &2",
    projectScene: "编译自动化、服务守护进程拉起与生产环境配置管理",
    cppaiModule: "mod_base_logging",
    sourceLink: "scripts/build_static.cjs / CMakeLists.txt",
    interviewPoint: "Shell 脚本中 $?、$#、$*、$@ 的含义是什么？重定向 2>&1 的执行机制是什么？如何优雅处理进程后台运行 nohup 与信号挂断？"
  },
  {
    id: "linux_dim_fs",
    dimension: "File System",
    title: "VFS 虚拟文件系统、文件描述符 (fd) 与零拷贝 (sendfile)",
    syscallOrCmd: "open() / read() / write() / fcntl() / sendfile()",
    projectScene: "HTTP 静态资源大文件极速传输与 socket 描述符非阻塞属性配置",
    cppaiModule: "mod_http_server",
    sourceLink: "HttpServer/HttpServer.cpp (静态文件分发)",
    interviewPoint: "Linux 文件描述符泄露的根本原因是什么？如何通过 /proc/pid/fd 实时监控？sendfile 为什么能减少上下文切换与 CPU 拷贝？"
  },
  {
    id: "linux_dim_process",
    dimension: "Process",
    title: "进程生命周期、fork/exec 派生、孤儿进程与僵尸进程",
    syscallOrCmd: "fork() / execve() / waitpid() / getpid()",
    projectScene: "多进程模型比对、守护进程 (Daemon) 改造与子进程退出清理",
    cppaiModule: "mod_kernel_epoll",
    sourceLink: "muduo/net/poller/EPollPoller.cc",
    interviewPoint: "写时复制 (COW, Copy-On-Write) 的底层硬件 MMU 支持原理是什么？如何避免僵尸进程 (Zombie Process) 的产生？"
  },
  {
    id: "linux_dim_thread",
    dimension: "Thread",
    title: "POSIX 线程模型、线程局部存储 (__thread) 与上下文开销",
    syscallOrCmd: "pthread_create() / pthread_join() / __thread / pthread_self()",
    projectScene: "One Loop Per Thread 架构下线程专属 EventLoop 与日志缓冲管理",
    cppaiModule: "mod_net_eventloop",
    sourceLink: "muduo/net/EventLoop.cc (t_loopInThisThread)",
    interviewPoint: "__thread 与 C++11 thread_local 的区别是什么？内核轻量级进程 (LWP) 与用户态线程是如何 1:1 映射的？"
  },
  {
    id: "linux_dim_signal",
    dimension: "Signal",
    title: "Linux 信号机制、异步信号安全函数与 SIGPIPE 致命忽略",
    syscallOrCmd: "signal() / sigaction() / sigprocmask()",
    projectScene: "网络连接对端 RST 关闭时写入触发 SIGPIPE 默认退出的致命防御",
    cppaiModule: "mod_net_client",
    sourceLink: "muduo/net/TcpConnection.cc",
    interviewPoint: "为什么网络服务器启动时必须调用 signal(SIGPIPE, SIG_IGN)？什么是可重入函数 (Reentrant Function)？为什么信号处理函数不能调用 malloc？"
  },
  {
    id: "linux_dim_socket",
    dimension: "Socket",
    title: "BSD Socket 套接字编程、TCP 状态机与选项参数调优",
    syscallOrCmd: "socket() / bind() / listen() / accept4() / setsockopt()",
    projectScene: "高并发 TCP 服务器快速重启 SO_REUSEADDR/SO_REUSEPORT 与防慢连接",
    cppaiModule: "mod_net_tcpserver",
    sourceLink: "muduo/net/Socket.cc / muduo/net/SocketsOps.cc",
    interviewPoint: "TIME_WAIT 状态存在的必要性是什么？设置 SO_REUSEADDR 能解决什么问题？TCP_NODELAY 禁用 Nagle 算法在 HTTP 服务中的权衡？"
  },
  {
    id: "linux_dim_epoll",
    dimension: "epoll",
    title: "I/O 多路复用深水区：epoll 核心数据结构与 LT / ET 极限触发",
    syscallOrCmd: "epoll_create1() / epoll_ctl() / epoll_wait()",
    projectScene: "muduo 与 CppAIService 底座高吞吐量 I/O 事件循环主驱动器",
    cppaiModule: "mod_net_poller",
    sourceLink: "muduo/net/poller/EPollPoller.cc",
    interviewPoint: "epoll 底层为什么使用红黑树和就绪链表？epoll_ctl 增加监听 fd 的复杂度是多少？边缘触发 (ET) 为什么必须搭配非阻塞 I/O 且一直读到 EAGAIN？"
  },
  {
    id: "linux_dim_gdb",
    dimension: "gdb",
    title: "GDB 调试艺术：多线程死锁定位、Core Dump 逆向反查与断点追踪",
    syscallOrCmd: "gdb / bt / thread apply all bt / info registers / print",
    projectScene: "多线程死锁现场排查、段错误 (Segmentation fault) coredump 快速复盘",
    cppaiModule: "mod_base_threadpool",
    sourceLink: "docs/experiment_trace.md",
    interviewPoint: "线上服务遭遇 CPU 100% 卡死时，如何用 GDB attach 到进程排查死循环位置？如何配置 ulimit -c 生成并分析 core dump 文件？"
  },
  {
    id: "linux_dim_perf",
    dimension: "perf",
    title: "性能剖析与火焰图 (FlameGraph)：CPU 热点与系统调用损耗定点爆破",
    syscallOrCmd: "perf record / perf report / FlameGraph / strace / top -H",
    projectScene: "HttpServer 压测瓶颈分析与 JSON 序列化热点耗时定位",
    cppaiModule: "mod_http_codec",
    sourceLink: "docs/8_WEEK_ROADMAP.md (Week 4 基准压测)",
    interviewPoint: "如何通过 perf record -F 99 -p pid -g 生成 CPU 调用栈火焰图？火焰图横轴与纵轴各代表什么含义？系统调用开销过高时如何优化？"
  }
];

// 3. 两大硬核专业书目伴读伴学体系
var BOOKS_COMPANION_DATA = {
  linuxServerBook: {
    key: "linuxServer",
    name: "《Linux多线程服务端编程：使用 muduo C++ 网络库》",
    author: "陈硕",
    defaultDailyGoal: 10,
    unit: "页/天",
    dynamicAdjustRule: "基准 10 页/天。当今日处于 S 级项目核心模块攻坚期，系统自动支持动态微调至 5 页，将富余精力倾斜给真实源码与压测验证，绝不机械教条。",
    chapters: [
      {
        chapterNum: 1,
        title: "线程安全的对象生命周期管理",
        pageRange: "1-44",
        mappedProjectConcept: "TcpConnection 共享持有与 Channel::tie_ 弱引用生命周期保护",
        mappedModule: "mod_net_channel",
        coreTakeaway: "对象析构在多线程环境下的竞态条件。析构函数本身不能是线程安全的；使用 shared_ptr 与 weak_ptr 实现观察者模式并杜绝空悬指针。"
      },
      {
        chapterNum: 2,
        title: "线程同步精要",
        pageRange: "45-78",
        mappedProjectConcept: "MutexLockGuard RAII 守卫与条件变量虚假唤醒防范",
        mappedModule: "mod_base_threadpool",
        coreTakeaway: "互斥锁七大戒律：不使用跨进程锁、不使用读写锁、不使用自旋锁、保持临界区极小、按相同顺序加锁防死锁。"
      },
      {
        chapterNum: 3,
        title: "多线程服务器的适用场合",
        pageRange: "79-112",
        mappedProjectConcept: "One Loop Per Thread + 线程池计算密集分离模型",
        mappedModule: "mod_net_eventloop",
        coreTakeaway: "单线程 Reactor 处理 I/O，多工作线程处理业务计算；为什么事件循环线程内绝对禁止调用阻塞 I/O。"
      },
      {
        chapterNum: 6,
        title: "muduo 网络库设计与实现：连接建立与销毁",
        pageRange: "155-210",
        mappedProjectConcept: "TcpServer / Acceptor / TcpConnection 状态迁移管线",
        mappedModule: "mod_net_tcpserver",
        coreTakeaway: "新连接由 Acceptor 在主线程接收，分发给轮询选取的 SubReactor；连接断开时由 SubReactor 倒推清理并通知主线程。"
      },
      {
        chapterNum: 7,
        title: "muduo 缓冲区与数据传输",
        pageRange: "211-256",
        mappedProjectConcept: "非阻塞 I/O + 应用层 Buffer 读写高低水位回调",
        mappedModule: "mod_net_buffer",
        coreTakeaway: "为什么非阻塞必须配应用层 Buffer：发送时内核缓冲区满需暂存，接收时半包需拼合；高低水位回调实现流量过载反压。"
      }
    ]
  },
  birdLinuxBook: {
    key: "birdLinux",
    name: "《鸟哥的 Linux 私房菜：基础学习篇 (第四版)》",
    author: "鸟哥",
    defaultDailyGoal: 10,
    unit: "页/天",
    startPoint: "严格遵照用户真实任务清单：从 Bash 开始",
    chapters: [
      {
        chapterNum: 10,
        title: "认识与学习 BASH：变量、环境变量与管道命令",
        pageRange: "315-360",
        mappedProjectConcept: "C++ 运行环境 PATH、LD_LIBRARY_PATH 与 CMake 构建参数",
        practicalCommands: "export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH\nenv | grep -i cpp\ncat server.log | grep ERROR | awk '{print $4}' | sort | uniq -c",
        projectIntegration: "配置项目编译时的依赖搜索路径，使用 awk/grep 统计线上 HTTP 错误状态码分布。"
      },
      {
        chapterNum: 11,
        title: "正规表示法与文件格式化处理 (grep, sed, awk)",
        pageRange: "361-400",
        mappedProjectConcept: "HttpServer 正则路由动态参数提取与请求日志清洗",
        practicalCommands: "grep -E \"^[A-Z]+ /api/v[0-9]+/\" access.log\nsed -i 's/localhost/127.0.0.1/g' config.json",
        projectIntegration: "编写自动化测试结果正则断言脚本，自动提取性能压测摘要数据。"
      },
      {
        chapterNum: 12,
        title: "学习 Shell Scripts：自动化构建与部署实战",
        pageRange: "401-445",
        mappedProjectConcept: "多进程启动脚本、服务健康检查与守护进程 watchdog",
        practicalCommands: "if [ ! -f build/ChatServer ]; then ./scripts/build.sh; fi\nps aux | grep ChatServer | grep -v grep || nohup ./build/ChatServer &",
        projectIntegration: "构建项目一键编译、测试、启动与监控守护流水线脚本。"
      },
      {
        chapterNum: 16,
        title: "进程管理与 SELinux：后台作业、信号与 top 监控",
        pageRange: "550-600",
        mappedProjectConcept: "进程 CPU 占用率排查、线程级性能分析与信号终结",
        practicalCommands: "top -H -p $(pgrep ChatServer)\nkill -SIGUSR1 $(pgrep ChatServer)\nlsof -i :8080",
        projectIntegration: "实时监测每个 EventLoop 线程的 CPU 负载均衡情况，排查线程饥饿现象。"
      }
    ]
  }
};

// 4. 算法手撕 Lab 题库与追踪系统 (每日 3 题与二刷)
var ALGORITHM_LAB_CATALOG = [
  {
    id: "algo_146",
    num: 146,
    title: "LRU 缓存机制 (LRU Cache)",
    difficulty: "Medium",
    topic: "哈希表 + 双向链表",
    pattern: "哈希快速定位 O(1) + 链表快速调整顺序 O(1)",
    timeComp: "O(1)",
    spaceComp: "O(capacity)",
    independent: true,
    mistakes: "忘记在 put 存在节点时更新 value 并移至头部；删除尾部节点时忘记从 map 同步 erase。",
    reviewStatus: "due", // 'due' | 'mastered'
    projectLink: "与 CppAIService 中 HTTP 会话缓存 (Session Cache) 过期淘汰策略完全同构。",
    oralSummary: "采用 unordered_map 存 key 到 list 节点的映射，最近访问移至链表头，容量超出淘汰链表尾。"
  },
  {
    id: "algo_208",
    num: 208,
    title: "实现 Trie (前缀树)",
    difficulty: "Medium",
    topic: "字典树 / 字符串",
    pattern: "多叉树节点数组 + isEnd 结尾标记",
    timeComp: "O(L)",
    spaceComp: "O(Sigma * L)",
    independent: true,
    mistakes: "析构函数未正确递归清理子节点导致内存泄漏；在 startsWith 和 search 中边界混淆。",
    reviewStatus: "mastered",
    projectLink: "对应 HttpServer 中 RESTful 动态路由通配符分发树 (Prefix Router Tree)。",
    oralSummary: "每个节点维护 26 个字母指针和 isEnd 标志，插入沿路径创建，查询沿路径遍历。"
  },
  {
    id: "algo_232",
    num: 232,
    title: "用栈实现队列 (Implement Queue using Stacks)",
    difficulty: "Easy",
    topic: "栈 / 设计",
    pattern: "输入栈 inStack + 输出栈 outStack 负负得正",
    timeComp: "均摊 O(1)",
    spaceComp: "O(n)",
    independent: true,
    mistakes: "pop() 或 peek() 时若 outStack 为空才将 inStack 全部倾倒，否则不可倒置。",
    reviewStatus: "mastered",
    projectLink: "对应 muduo EventLoop 中 pendingFunctors 双缓冲防死锁的队列倾倒转移设计。",
    oralSummary: "push 入 inStack，pop 从 outStack 取；outStack 空时将 inStack 元素依次弹入完成先进先出逆转。"
  },
  {
    id: "algo_209",
    num: 209,
    title: "长度最小的子数组 (Minimum Size Subarray Sum)",
    difficulty: "Medium",
    topic: "数组 / 滑动窗口",
    pattern: "双指针动态收缩窗口",
    timeComp: "O(n)",
    spaceComp: "O(1)",
    independent: true,
    mistakes: "窗口收缩条件满足时使用了 if 而非 while；未找到解时忘记返回 0。",
    reviewStatus: "due",
    projectLink: "对应 HTTP 有限状态机解析时滑动检测连续 CRLF 边界的双指针逻辑。",
    oralSummary: "右指针扩张累加，当窗口总和大于等于 target 时记录长度并持续右移左指针收缩窗口。"
  },
  {
    id: "algo_142",
    num: 142,
    title: "环形链表 II (Linked List Cycle II)",
    difficulty: "Medium",
    topic: "链表 / 快慢指针",
    pattern: "快慢指针相遇 + 头指针与相遇点同速前进寻找入口",
    timeComp: "O(n)",
    spaceComp: "O(1)",
    independent: true,
    mistakes: "没有推导数学等式 a = (n-1)(b+c) + c，凭记忆写错相遇后前进指针。",
    reviewStatus: "mastered",
    projectLink: "对应智能指针循环引用 (Circular Reference) 检测与有向图环路检测算法。",
    oralSummary: "快指针每次走2步慢指针走1步，相遇证明有环；将一指针放回起点与相遇点同步步进，相汇处即入口。"
  },
  {
    id: "algo_215",
    num: 215,
    title: "数组中的第K个最大元素 (Kth Largest Element in an Array)",
    difficulty: "Medium",
    topic: "堆 / 快速选择",
    pattern: "小顶堆维持前 K 大元素 或 快速排序分区剪枝",
    timeComp: "O(n log k)",
    spaceComp: "O(k)",
    independent: true,
    mistakes: "使用 priority_queue 时混淆大顶堆与小顶堆，std::greater<int> 才是小顶堆。",
    reviewStatus: "due",
    projectLink: "对应 muduo TimerQueue 最小堆与定时器超期就绪时间排序。",
    oralSummary: "维护大小为 K 的小顶堆，遍历元素若大于堆顶则弹出堆顶加入新元素，最终堆顶即第 K 大。"
  }
];

// 5. 项目代码驱动型技术八股中心 (30min/天)
var PROJECT_QA_CATALOG = [
  {
    id: "qa_reactor_eventfd",
    category: "muduo 网络底座",
    question: "muduo 为什么要使用 eventfd 进行跨线程唤醒，而不是使用传统的 socketpair 或管道 pipe？",
    projectContext: "muduo/net/EventLoop.cc 中 wakeup() 与 handleRead() 的系统调用选型",
    sourceFile: "muduo/net/EventLoop.cc",
    sourceLine: "L50-L75",
    answer: "1. 资源消耗极低：管道需要占用两个文件描述符 (一读一写)，而 eventfd 仅占用一个 fd；\n2. 内核开销微小：eventfd 在内核中仅维护一个 8 字节的 uint64_t 计数器，无缓冲区拷贝开销；\n3. 语义纯粹：唤醒只需触发一次 8 字节 write，搭配 epoll LT/ET 触发极其轻量。",
    followUp: "在多线程同时调用 wakeup() 时，eventfd 的计数器会溢出吗？读取时必须读取 8 字节吗？",
    trap: "如果写入不足 8 字节会报错 EINVAL；如果不读取 8 字节会导致 epoll 不断水平触发唤醒。"
  },
  {
    id: "qa_buffer_readv",
    category: "内存与性能",
    question: "为什么非阻塞 I/O 网络库必须设计应用层缓冲区 Buffer？直接用内建固定数组为什么不行？",
    projectContext: "muduo/net/Buffer.h 与 TcpConnection::handleRead / handleWrite 数据流转",
    sourceFile: "muduo/net/Buffer.cc",
    sourceLine: "L25-L65",
    answer: "1. 非阻塞发送无法保证一次性送达：当内核发送缓冲区写满时系统调用返回 EAGAIN，剩余未发送数据必须暂存应用层，等待 EPOLLOUT 触发继续发送；\n2. TCP 是字节流协议：接收方无法保证每次恰好收到一个完整数据包，可能发生粘包或半包，必须在应用层拼包；\n3. 结合 readv 栈上 64KB 临时缓冲区，既避免了为每个新连接预分配巨大内存，又保证大流量吞吐时动态弹性扩容。",
    followUp: "发送端如果一直产生数据，而接收端处理极慢，应用层 Output Buffer 无限膨胀怎么办？",
    trap: "必须设置高水位回调 (HighWaterMarkCallback) 执行应用层反压或主动限流，否则必然 OOM 崩溃。"
  },
  {
    id: "qa_fsm_http_parser",
    category: "HTTP 与协议解析",
    question: "有限状态机 (FSM) 在 HTTP 解析中是如何处理跨 TCP 分包到达的请求的？",
    projectContext: "HttpServer 模块中 HttpContext 状态机解析请求行、请求头与正文",
    sourceFile: "HttpServer/HttpContext.cpp",
    sourceLine: "L30-L95",
    answer: "1. 状态机将每个连接的 HttpContext 绑定至 TcpConnection 上下文，保留解析进度；\n2. 当读取数据未遇到 CRLF (\\r\\n) 终止符时，状态机保持在当前主状态 (如 CHECK_STATE_HEADER)，并将已消费的数据从 Buffer 移除；\n3. 当后续数据再次就绪触发 onMessage 时，状态机从上次中断的状态继续向后匹配，杜绝了重复解析与报文丢失。",
    followUp: "面对超长恶意请求头攻击 (Slowloris 慢速拒绝服务)，状态机如何防御？",
    trap: "必须在解析时设定请求行长度与请求头最大字节数上限，超出立即返回 414 或 431 并主动断开连接。"
  },
  {
    id: "qa_mcp_twostage",
    category: "AI 与 Agent 架构",
    question: "什么是两段式 MCP (Model Context Protocol) 工具调用？服务端时序是怎样的？",
    projectContext: "AIApps/ChatServer 中 AIToolRegistry 工具注册与 LLM 交互链路",
    sourceFile: "AIApps/ChatServer/src/AIToolRegistry.cpp",
    sourceLine: "L15-L80",
    answer: "1. 第一段：客户端发起包含用户意图的提问，服务端组装包含当前已注册 C++ 本地工具描述的 JSON Schema 投递给大模型；\n2. 模型判断需要调用工具，返回指定工具名与提取的参数 (Function Call JSON)；\n3. 第二段：服务端解析参数，调用本地 C++ 函数执行（如查数据库、计算或执行搜索），将执行结果封装为 tool 消息再次发给大模型；\n4. 大模型结合工具结果生成最终回答流式输出给用户。",
    followUp: "当本地工具执行耗时较长（例如外部 API 延迟 3 秒）时，如何避免阻塞网络事件循环？",
    trap: "工具调用必须投递到专属的工作线程池中异步执行，绝不能在 EventLoop 线程中执行同步等待。"
  }
];

// 6. 通识阅读三部曲 (次要任务，不能抢占核心工时)
var GENERAL_READING_CATALOG = [
  {
    id: "read_nonviolent_comm",
    bookKey: "nonviolentComm",
    title: "《非暴力沟通》",
    author: "马歇尔·卢森堡",
    targetPagesDaily: 10,
    timeOfDay: "早上 · 晨间沉淀",
    role: "Secondary Task (次要任务)",
    corePillars: ["观察 (Observation)", "感受 (Feeling)", "需要 (Need)", "请求 (Request)"],
    engineeringReflection: "Code Review 与架构讨论中，区分事实与评价，专注于工程诉求而非情绪宣泄。"
  },
  {
    id: "read_finance_zero",
    bookKey: "financeZero",
    title: "《从零开始学习金融学》",
    author: "经典通识",
    targetPagesDaily: 10,
    timeOfDay: "中午 · 视野拓展",
    role: "Secondary Task (次要任务)",
    corePillars: ["货币信用", "时间价值", "利率与风险", "资产定价"],
    engineeringReflection: "技术架构中理解商业价值、ROI (投资回报比) 与基础设施成本折旧。"
  },
  {
    id: "read_game_theory",
    bookKey: "gameTheory",
    title: "《图解博弈论》",
    author: "经典通识",
    targetPagesDaily: 10,
    timeOfDay: "晚上 · 睡前复盘",
    role: "Secondary Task (次要任务)",
    corePillars: ["纳什均衡", "囚徒困境", "零和与非零和", "重复博弈信用"],
    engineeringReflection: "分布式一致性协议、微服务背压协商与多智能体竞合博弈的思维模型底座。"
  }
];

// 7. 六维全链路穿透构建器 (Cross-Link Engine)
function buildCrossLinkChain(nodeId) {
  // 匹配 C++ 维度
  let cppMatch = CPP_KNOWLEDGE_SYSTEM.find(c => c.id === nodeId || c.dimension.toLowerCase() === (nodeId || '').toLowerCase());
  if (cppMatch) {
    return {
      type: "cpp",
      id: cppMatch.id,
      title: cppMatch.title,
      knowledge: {
        concept: cppMatch.coreConcept,
        dimension: cppMatch.dimension
      },
      project: {
        moduleId: cppMatch.cppaiModule,
        moduleName: cppMatch.moduleName,
        architecture: "双核协同架构 (muduo 底座 ➔ CppAIService 业务)"
      },
      source: {
        file: cppMatch.sourceFile,
        line: cppMatch.sourceLine
      },
      task: {
        day: cppMatch.taskDay,
        title: cppMatch.taskTitle,
        type: "28天攻坚流水线 & 今日任务调度"
      },
      evidence: {
        type: "单元测试 & 压力测试基准",
        verification: "已通过自动化回归断言与运行期测试验证"
      },
      interview: {
        point: cppMatch.interviewPoint,
        trap: "深入核心源码防范高频生产踩坑"
      }
    };
  }

  // 匹配 Linux 维度
  let linuxMatch = LINUX_SYSTEM_KNOWLEDGE.find(l => l.id === nodeId || l.dimension.toLowerCase() === (nodeId || '').toLowerCase());
  if (linuxMatch) {
    return {
      type: "linux",
      id: linuxMatch.id,
      title: linuxMatch.title,
      knowledge: {
        concept: linuxMatch.syscallOrCmd,
        dimension: linuxMatch.dimension
      },
      project: {
        moduleId: linuxMatch.cppaiModule,
        moduleName: linuxMatch.projectScene,
        architecture: "Linux 内核系统调用与服务器进程模型"
      },
      source: {
        file: linuxMatch.sourceLink,
        line: "核心调用点"
      },
      task: {
        day: 5,
        title: "系统调用实战与工程落地",
        type: "Linux 实战与调优"
      },
      evidence: {
        type: "perf / gdb 运行轨迹",
        verification: "已在实操环境中验证系统调用参数与返回"
      },
      interview: {
        point: linuxMatch.interviewPoint,
        trap: "系统调用开销与异常错误码处理"
      }
    };
  }

  // 默认兜底链路
  return {
    type: "generic",
    id: nodeId || "know_general",
    title: "统一学习系统六维技术透视",
    knowledge: { concept: "核心技术原理与设计思想", dimension: "Engineering OS" },
    project: { moduleId: "mod_net_eventloop", moduleName: "CppAIService 双核底座", architecture: "Reactor & Microservices" },
    source: { file: "muduo/net/EventLoop.cc", line: "L1-L100" },
    task: { day: 1, title: "主线攻坚任务", type: "今日主干" },
    evidence: { type: "工程证据与测试日志", verification: "全链路验证就绪" },
    interview: { point: "技术难点与高频追问", trap: "避免脱离工程实际死记硬背" }
  };
}

// 全局挂载与模块导出
if (typeof window !== 'undefined') {
  window.CPP_KNOWLEDGE_SYSTEM = CPP_KNOWLEDGE_SYSTEM;
  window.LINUX_SYSTEM_KNOWLEDGE = LINUX_SYSTEM_KNOWLEDGE;
  window.BOOKS_COMPANION_DATA = BOOKS_COMPANION_DATA;
  window.ALGORITHM_LAB_CATALOG = ALGORITHM_LAB_CATALOG;
  window.PROJECT_QA_CATALOG = PROJECT_QA_CATALOG;
  window.GENERAL_READING_CATALOG = GENERAL_READING_CATALOG;
  window.buildCrossLinkChain = buildCrossLinkChain;
}

if (typeof globalThis !== 'undefined') {
  globalThis.CPP_KNOWLEDGE_SYSTEM = CPP_KNOWLEDGE_SYSTEM;
  globalThis.LINUX_SYSTEM_KNOWLEDGE = LINUX_SYSTEM_KNOWLEDGE;
  globalThis.BOOKS_COMPANION_DATA = BOOKS_COMPANION_DATA;
  globalThis.ALGORITHM_LAB_CATALOG = ALGORITHM_LAB_CATALOG;
  globalThis.PROJECT_QA_CATALOG = PROJECT_QA_CATALOG;
  globalThis.GENERAL_READING_CATALOG = GENERAL_READING_CATALOG;
  globalThis.buildCrossLinkChain = buildCrossLinkChain;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CPP_KNOWLEDGE_SYSTEM,
    LINUX_SYSTEM_KNOWLEDGE,
    BOOKS_COMPANION_DATA,
    ALGORITHM_LAB_CATALOG,
    PROJECT_QA_CATALOG,
    GENERAL_READING_CATALOG,
    buildCrossLinkChain
  };
}

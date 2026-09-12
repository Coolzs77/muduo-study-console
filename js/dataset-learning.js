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

// 4. 算法手撕 Lab 题库与追踪系统 (对齐代码随想录 12 大分类与力扣直通)
var ALGORITHM_LAB_CATALOG = [
  {
    "id": "algo_704",
    "num": 704,
    "title": "二分查找 (Binary Search)",
    "difficulty": "Easy",
    "category": "数组",
    "topic": "二分查找",
    "leetcodeUrl": "https://leetcode.cn/problems/binary-search/",
    "pattern": "循环不变量原则：左闭右闭 [left, right] 或 左闭右开 [left, right)",
    "timeComp": "O(log n)",
    "spaceComp": "O(1)",
    "mistakes": "边界条件写错：while (left <= right) 与 right = mid - 1 配对；防溢出 mid = left + (right - left) / 2。",
    "projectLink": "对应高效在有序数组或内存页表中查找虚拟地址偏移与路由前缀。"
  },
  {
    "id": "algo_27",
    "num": 27,
    "title": "移除元素 (Remove Element)",
    "difficulty": "Easy",
    "category": "数组",
    "topic": "快慢指针",
    "leetcodeUrl": "https://leetcode.cn/problems/remove-element/",
    "pattern": "快指针寻找非目标值新元素，慢指针记录新数组下标写入位置",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "直接用暴力 erase 导致 O(n^2) 复杂度；快慢指针同步步进条件混淆。",
    "projectLink": "对应应用层 Buffer 环形缓冲区中就地压缩覆盖已消费数据块。"
  },
  {
    "id": "algo_977",
    "num": 977,
    "title": "有序数组的平方 (Squares of a Sorted Array)",
    "difficulty": "Easy",
    "category": "数组",
    "topic": "双指针",
    "leetcodeUrl": "https://leetcode.cn/problems/squares-of-a-sorted-array/",
    "pattern": "两端元素平方最大，左右双指针相向而行，从后往前填充结果数组",
    "timeComp": "O(n)",
    "spaceComp": "O(n)",
    "mistakes": "从前往后填充导致小元素无法就位；终止条件未包含 left == right。",
    "projectLink": "归并两路有序统计序列（如网络延迟分布合并）。"
  },
  {
    "id": "algo_209",
    "num": 209,
    "title": "长度最小的子数组 (Minimum Size Subarray Sum)",
    "difficulty": "Medium",
    "category": "数组",
    "topic": "滑动窗口",
    "leetcodeUrl": "https://leetcode.cn/problems/minimum-size-subarray-sum/",
    "pattern": "滑动窗口：右指针扩张累计，当窗口和 >= s 时循环收缩左指针更新最小长度",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "收缩条件用 if 导致未充分收缩（必须用 while）；未找到合法子数组时未返回 0。",
    "projectLink": "对应 HTTP 有限状态机解析时滑动检测连续 CRLF 边界的双指针逻辑。"
  },
  {
    "id": "algo_59",
    "num": 59,
    "title": "螺旋矩阵 II (Spiral Matrix II)",
    "difficulty": "Medium",
    "category": "数组",
    "topic": "模拟 / 循环不变量",
    "leetcodeUrl": "https://leetcode.cn/problems/spiral-matrix-ii/",
    "pattern": "严格坚持左闭右开画边原则：上右下左四条边统一处理规则",
    "timeComp": "O(n^2)",
    "spaceComp": "O(1)",
    "mistakes": "四条边界拐点处理不统一导致覆盖重复或者边界越界；奇数阶中心点未单独赋值。",
    "projectLink": "多维内存矩阵与二维像素数据缓存对齐扫描排布。"
  },
  {
    "id": "algo_203",
    "num": 203,
    "title": "移除链表元素 (Remove Linked List Elements)",
    "difficulty": "Easy",
    "category": "链表",
    "topic": "虚拟头节点",
    "leetcodeUrl": "https://leetcode.cn/problems/remove-linked-list-elements/",
    "pattern": "引入 dummyNode 统一头节点与普通节点的删除逻辑",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "删除当前节点后指针依然 cur = cur->next 导致跳过连续相同值节点；C++ 必须手动 delete 释放内存防泄漏。",
    "projectLink": "对应网络连接池与定时器链表节点失效时的摘除清理。"
  },
  {
    "id": "algo_707",
    "num": 707,
    "title": "设计链表 (Design Linked List)",
    "difficulty": "Medium",
    "category": "链表",
    "topic": "单双链表设计",
    "leetcodeUrl": "https://leetcode.cn/problems/design-linked-list/",
    "pattern": "定义清晰的 ListNode 结构体，维护 dummyHead 与 size",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "下标 index < 0 或 index >= size 越界判断不严；插入头部与尾部的边界指针连接顺序错误。",
    "projectLink": "底层网络框架中基于双向链表构建的连接队列与 LRU 缓存链。"
  },
  {
    "id": "algo_206",
    "num": 206,
    "title": "反转链表 (Reverse Linked List)",
    "difficulty": "Easy",
    "category": "链表",
    "topic": "双指针 / 递归",
    "leetcodeUrl": "https://leetcode.cn/problems/reverse-linked-list/",
    "pattern": "prev 指针置空，curr 遍历，临时记录 next = curr->next，然后反转 curr->next = prev",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "在修改 curr->next 之前忘记暂存原 next 节点造成链表断裂断链。",
    "projectLink": "网络协议栈中将反向链式拦截器/中间件链路反转为正向执行流。"
  },
  {
    "id": "algo_24",
    "num": 24,
    "title": "两两交换链表中的节点 (Swap Nodes in Pairs)",
    "difficulty": "Medium",
    "category": "链表",
    "topic": "指针重连",
    "leetcodeUrl": "https://leetcode.cn/problems/swap-nodes-in-pairs/",
    "pattern": "dummyNode 前驱辅助，画图厘清 3 步指针转向并步进 2 步",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "指针指向改变顺序错误导致后续节点丢失；while 循环条件需同时保证 cur->next 与 cur->next->next 均非空。",
    "projectLink": "数据包批处理合并与成对请求-响应实体快速重组。"
  },
  {
    "id": "algo_19",
    "num": 19,
    "title": "删除链表的倒数第 N 个结点 (Remove Nth Node)",
    "difficulty": "Medium",
    "category": "链表",
    "topic": "快慢指针",
    "leetcodeUrl": "https://leetcode.cn/problems/remove-nth-node-from-end-of-list/",
    "pattern": "fast 先走 n+1 步，随后 fast 与 slow 同步步进，fast 到尾时 slow 恰好在待删节点前驱",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "fast 未走 n+1 步导致 slow 停在待删节点本身而非其前驱，增加特判复杂度。",
    "projectLink": "滑动窗口历史日志与连接心跳超时链表的倒序摘除。"
  },
  {
    "id": "algo_142",
    "num": 142,
    "title": "环形链表 II (Linked List Cycle II)",
    "difficulty": "Medium",
    "category": "链表",
    "topic": "快慢指针 / 数学证明",
    "leetcodeUrl": "https://leetcode.cn/problems/linked-list-cycle-ii/",
    "pattern": "fast 走 2 步 slow 走 1 步相遇后，一指针从头出发一指针从相遇点出发，同速必在环入口相遇",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "未推导数学关系 a = (n-1)(b+c) + c，相遇后移动步长弄错；无环边界判断漏写 fast->next 为空。",
    "projectLink": "智能指针循环引用 (Circular Reference) 拓扑环路死锁排查。"
  },
  {
    "id": "algo_146",
    "num": 146,
    "title": "LRU 缓存机制 (LRU Cache)",
    "difficulty": "Medium",
    "category": "链表",
    "topic": "哈希表 + 双向链表",
    "leetcodeUrl": "https://leetcode.cn/problems/lru-cache/",
    "pattern": "unordered_map<int, Node*> 达成 O(1) 查找 + 双向链表 dummyHead/dummyTail 达成 O(1) 增删调整",
    "timeComp": "O(1)",
    "spaceComp": "O(capacity)",
    "independent": true,
    "reviewStatus": "due",
    "mistakes": "put 已经存在的 key 时只更新 value 却忘记移动至链表头部；淘汰末尾节点时忘记在 map 中同步 erase。",
    "projectLink": "与 CppAIService 中 HTTP 会话缓存 (Session Cache) 与多轮对话 Token 缓存淘汰同构。"
  },
  {
    "id": "algo_25",
    "num": 25,
    "title": "K 个一组翻转链表 (Reverse Nodes in k-Group)",
    "difficulty": "Hard",
    "category": "链表",
    "topic": "复杂链表反转",
    "leetcodeUrl": "https://leetcode.cn/problems/reverse-nodes-in-k-group/",
    "pattern": "先探测当前组是否有 k 个节点，有则切断子链表进行常规反转，然后将翻转前后的头尾与外层重新拼接",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "翻转后原 head 变 tail，重新连接下一次分组的头指针时发生死循环或断链。",
    "projectLink": "定长多报文批量汇聚反转与管道分发重连。"
  },
  {
    "id": "algo_242",
    "num": 242,
    "title": "有效的字母异位词 (Valid Anagram)",
    "difficulty": "Easy",
    "category": "哈希表",
    "topic": "数组哈希",
    "leetcodeUrl": "https://leetcode.cn/problems/valid-anagram/",
    "pattern": "定长 26 个整型数组记录频次，s 串加 t 串减，最终全部为 0 即有效",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "字符集较小时盲目使用 unordered_map 带来额外内存和哈希开销。",
    "projectLink": "协议签名与参数元数据字符集一致性快速校验。"
  },
  {
    "id": "algo_349",
    "num": 349,
    "title": "两个数组的交集 (Intersection of Two Arrays)",
    "difficulty": "Easy",
    "category": "哈希表",
    "topic": "Set 去重",
    "leetcodeUrl": "https://leetcode.cn/problems/intersection-of-two-arrays/",
    "pattern": "使用 unordered_set 去重并快速 contains 判定",
    "timeComp": "O(m+n)",
    "spaceComp": "O(n)",
    "mistakes": "结果集未去重导致包含重复元素；或者直接用了底层红黑树的 std::set 导致 O(log n)。",
    "projectLink": "分布式微服务标签匹配与路由重叠集合快速计算。"
  },
  {
    "id": "algo_1",
    "num": 1,
    "title": "两数之和 (Two Sum)",
    "difficulty": "Easy",
    "category": "哈希表",
    "topic": "边查边存",
    "leetcodeUrl": "https://leetcode.cn/problems/two-sum/",
    "pattern": "遍历当前数 x，先在 map 中查 target - x 是否已存在，不存在再把 x 入 map",
    "timeComp": "O(n)",
    "spaceComp": "O(n)",
    "mistakes": "两次循环遍历哈希表导致查到自身（如 target=6, num=3 时匹配到同一个 3）。",
    "projectLink": "请求 ID (ReqId) 与对端应答报文的快速 O(1) 关联对齐。"
  },
  {
    "id": "algo_454",
    "num": 454,
    "title": "四数相加 II (4Sum II)",
    "difficulty": "Medium",
    "category": "哈希表",
    "topic": "两两分组折半哈希",
    "leetcodeUrl": "https://leetcode.cn/problems/4sum-ii/",
    "pattern": "A+B 产生所有和计入 unordered_map 统计频次，遍历 C+D 查找 0 - (C+D) 的累计频次",
    "timeComp": "O(n^2)",
    "spaceComp": "O(n^2)",
    "mistakes": "分三组和一组导致 O(n^3) 超时；结果累计未用 count 而是置为 1。",
    "projectLink": "多维资源配额多项式匹配与组合碰撞快速计算。"
  },
  {
    "id": "algo_15",
    "num": 15,
    "title": "三数之和 (3Sum)",
    "difficulty": "Medium",
    "category": "哈希表",
    "topic": "排序 + 双指针",
    "leetcodeUrl": "https://leetcode.cn/problems/3sum/",
    "pattern": "先排序，外层固定 a，内层 left 和 right 双指针相向而行，并对 a, b, c 三者严格去重",
    "timeComp": "O(n^2)",
    "spaceComp": "O(1)",
    "mistakes": "去重逻辑写错：nums[i] == nums[i-1] 才是跳过重复组合；提前收缩导致漏解。",
    "projectLink": "多参协同约束与限流规则三重参数去重验证。"
  },
  {
    "id": "algo_344",
    "num": 344,
    "title": "反转字符串 (Reverse String)",
    "difficulty": "Easy",
    "category": "字符串",
    "topic": "双指针对调",
    "leetcodeUrl": "https://leetcode.cn/problems/reverse-string/",
    "pattern": "左右对撞双指针，std::swap 字符对调",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "使用额外 string 拷贝违背 O(1) 空间要求。",
    "projectLink": "底层字节序大端小端颠倒与定长报文字符串倒序。"
  },
  {
    "id": "algo_151",
    "num": 151,
    "title": "反转字符串中的单词 (Reverse Words in a String)",
    "difficulty": "Medium",
    "category": "字符串",
    "topic": "就地双指针",
    "leetcodeUrl": "https://leetcode.cn/problems/reverse-words-in-a-string/",
    "pattern": "三步就地法：1. 双指针移除多余空格；2. 反转整个字符串；3. 反转各个独立单词",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "中间空格和首尾空格移除逻辑混淆；反转单词时右边界取值越界。",
    "projectLink": "HTTP URL 路径层级反解与命名空间重排。"
  },
  {
    "id": "algo_28",
    "num": 28,
    "title": "找出字符串中第一个匹配项 (KMP 算法)",
    "difficulty": "Medium",
    "category": "字符串",
    "topic": "KMP 前缀表",
    "leetcodeUrl": "https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/",
    "pattern": "构造模式串的 next 前缀表（最长相等前后缀长度），失配时 j = next[j-1] 回退无需回溯主指针",
    "timeComp": "O(m+n)",
    "spaceComp": "O(m)",
    "mistakes": "next 数组初始化 j 和 i 关系写错，前后缀对比失配时回退写成 if 而非 while。",
    "projectLink": "网络报文敏感词快速过滤与 HTTP Header 关键字快速扫描。"
  },
  {
    "id": "algo_232",
    "num": 232,
    "title": "用栈实现队列 (Queue using Stacks)",
    "difficulty": "Easy",
    "category": "栈与队列",
    "topic": "双栈模拟",
    "leetcodeUrl": "https://leetcode.cn/problems/implement-queue-using-stacks/",
    "pattern": "inStack 负责进，outStack 负责出；只有当 outStack 为空时才将 inStack 全部倾倒进 outStack",
    "timeComp": "均摊 O(1)",
    "spaceComp": "O(n)",
    "mistakes": "每次 pop 都把 in 全部倒入 out 然后又倒回；未在 outStack 为空时才倒入。",
    "projectLink": "muduo EventLoop 中 pendingFunctors 双缓冲防死锁的队列倾倒转移设计。"
  },
  {
    "id": "algo_20",
    "num": 20,
    "title": "有效的括号 (Valid Parentheses)",
    "difficulty": "Easy",
    "category": "栈与队列",
    "topic": "栈匹配",
    "leetcodeUrl": "https://leetcode.cn/problems/valid-parentheses/",
    "pattern": "遇到左括号，将对应的右括号压入栈；遇到右括号，栈空或栈顶不等于当前字符则非法",
    "timeComp": "O(n)",
    "spaceComp": "O(n)",
    "mistakes": "遍历结束时未检查栈是否为空（例如剩了左括号）；访问 top 前未判 empty 造成段错误崩溃。",
    "projectLink": "JSON-RPC 2.0 嵌套大括号与 HTTP 语法块闭合校验。"
  },
  {
    "id": "algo_150",
    "num": 150,
    "title": "逆波兰表达式求值 (Evaluate RPN)",
    "difficulty": "Medium",
    "category": "栈与队列",
    "topic": "后缀表达式",
    "leetcodeUrl": "https://leetcode.cn/problems/evaluate-reverse-polish-notation/",
    "pattern": "遇到操作数入栈；遇到运算符弹出右操作数与左操作数，计算后结果入栈",
    "timeComp": "O(n)",
    "spaceComp": "O(n)",
    "mistakes": "减法和除法操作数顺序颠倒（先弹出的数是右操作数）。",
    "projectLink": "DSL 查询表达式与规则引擎过滤器树求值。"
  },
  {
    "id": "algo_239",
    "num": 239,
    "title": "滑动窗口最大值 (Sliding Window Maximum)",
    "difficulty": "Hard",
    "category": "栈与队列",
    "topic": "单调队列",
    "leetcodeUrl": "https://leetcode.cn/problems/sliding-window-maximum/",
    "pattern": "维护单调递减双端队列 deque：push 时弹出所有小于当前值的尾部，pop 时仅当待移出值等于队头才弹出",
    "timeComp": "O(n)",
    "spaceComp": "O(k)",
    "mistakes": "盲目使用 priority_queue 导致无法 O(1) 移出滑出窗口的元素产生 O(n log n) 超时。",
    "projectLink": "限流滑动窗口与最近 1 秒突发流量峰值检测。"
  },
  {
    "id": "algo_347",
    "num": 347,
    "title": "前 K 个高频元素 (Top K Frequent)",
    "difficulty": "Medium",
    "category": "栈与队列",
    "topic": "小顶堆",
    "leetcodeUrl": "https://leetcode.cn/problems/top-k-frequent-elements/",
    "pattern": "哈希表统计频率，维护大小为 k 的小顶堆 priority_queue<pair, vector, greater>，堆满淘汰堆顶小频次",
    "timeComp": "O(n log k)",
    "spaceComp": "O(n)",
    "mistakes": "使用大顶堆全量排序导致 O(n log n)；自定义比较器结构体函数重载混淆。",
    "projectLink": "热点 URL 路由统计与高频恶意 IP 实时排行榜。"
  },
  {
    "id": "algo_102",
    "num": 102,
    "title": "二叉树的层序遍历 (Level Order Traversal)",
    "difficulty": "Medium",
    "category": "二叉树",
    "topic": "BFS 队列",
    "leetcodeUrl": "https://leetcode.cn/problems/binary-tree-level-order-traversal/",
    "pattern": "队列先进先出，利用 size = q.size() 固定当前层节点数一次性批处理本层",
    "timeComp": "O(n)",
    "spaceComp": "O(n)",
    "mistakes": "在 for 循环条件中直接写 i < q.size()（随着子节点入队 size 动态变化导致逻辑混乱）。",
    "projectLink": "层级路由树分发与微服务拓扑分层广度优先扫描。"
  },
  {
    "id": "algo_226",
    "num": 226,
    "title": "翻转二叉树 (Invert Binary Tree)",
    "difficulty": "Easy",
    "category": "二叉树",
    "topic": "递归遍历",
    "leetcodeUrl": "https://leetcode.cn/problems/invert-binary-tree/",
    "pattern": "前序或后序遍历，swap(root->left, root->right)，然后递归左右子树",
    "timeComp": "O(n)",
    "spaceComp": "O(h)",
    "mistakes": "中序遍历时交换完左子树后，再调右子树实际又翻转了一次左子树。",
    "projectLink": "二叉分支规则树左右决策条件镜像颠倒。"
  },
  {
    "id": "algo_104",
    "num": 104,
    "title": "二叉树的最大深度 (Maximum Depth of Binary Tree)",
    "difficulty": "Easy",
    "category": "二叉树",
    "topic": "后序遍历求高度",
    "leetcodeUrl": "https://leetcode.cn/problems/maximum-depth-of-binary-tree/",
    "pattern": "高度即深度：return 1 + max(maxDepth(left), maxDepth(right))",
    "timeComp": "O(n)",
    "spaceComp": "O(h)",
    "mistakes": "空节点基线条件忘记返回 0。",
    "projectLink": "RESTful 路由树最大深度检测，防止嵌套恶意过深引发调用栈溢出。"
  },
  {
    "id": "algo_236",
    "num": 236,
    "title": "二叉树的最近公共祖先 (Lowest Common Ancestor)",
    "difficulty": "Medium",
    "category": "二叉树",
    "topic": "后序回溯遍历",
    "leetcodeUrl": "https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/",
    "pattern": "后序遍历自底向上回溯：左右子树返回值都不为空则当前节点为 LCA，若仅一边非空则向上透传该非空指针",
    "timeComp": "O(n)",
    "spaceComp": "O(h)",
    "mistakes": "以为找到一个就直接返回而未回溯遍历另一子树，漏判两节点分别在左右两侧的情况。",
    "projectLink": "权限继承树与组织架构树中寻找两个角色的最近公共审批网关。"
  },
  {
    "id": "algo_98",
    "num": 98,
    "title": "验证二叉搜索树 (Validate BST)",
    "difficulty": "Medium",
    "category": "二叉树",
    "topic": "中序遍历单调性",
    "leetcodeUrl": "https://leetcode.cn/problems/validate-binary-search-tree/",
    "pattern": "BST 中序遍历必定严格递增，维护 pre 指针，当前 val 必须大于 pre->val",
    "timeComp": "O(n)",
    "spaceComp": "O(h)",
    "mistakes": "仅判断 root->left < root && root->right > root，忽略了整个左子树所有节点都必须小于 root。",
    "projectLink": "内存红黑树或有序索引键有效性自检。"
  },
  {
    "id": "algo_77",
    "num": 77,
    "title": "组合 (Combinations)",
    "difficulty": "Medium",
    "category": "回溯算法",
    "topic": "树形结构枚举",
    "leetcodeUrl": "https://leetcode.cn/problems/combinations/",
    "pattern": "递归深入纵向探索，for 循环横向遍历，回溯撤销 path.pop_back()，结合剩余元素进行剪枝",
    "timeComp": "O(C(n, k))",
    "spaceComp": "O(k)",
    "mistakes": "忘记 startIndex 导致重复选择相同元素；剪枝条件 i <= n - (k - path.size()) + 1 推导不熟。",
    "projectLink": "多智能体协同场景中候选 Agent 的组合方案全排列生成。"
  },
  {
    "id": "algo_39",
    "num": 39,
    "title": "组合总和 (Combination Sum)",
    "difficulty": "Medium",
    "category": "回溯算法",
    "topic": "可重复选择 / 剪枝",
    "leetcodeUrl": "https://leetcode.cn/problems/combination-sum/",
    "pattern": "元素可重复选取，递归时 startIndex 传 i 而非 i+1；先对数组排序，sum + candidates[i] > target 直接 break",
    "timeComp": "O(2^n)",
    "spaceComp": "O(target)",
    "mistakes": "未排序直接剪枝导致漏解；sum 累加与回溯还原不对称。",
    "projectLink": "请求资源配额多面额拼接与线程池任务拆分分配。"
  },
  {
    "id": "algo_46",
    "num": 46,
    "title": "全排列 (Permutations)",
    "difficulty": "Medium",
    "category": "回溯算法",
    "topic": "used 数组记录",
    "leetcodeUrl": "https://leetcode.cn/problems/permutations/",
    "pattern": "全排列每层都从 0 开始遍历，维护 used 数组标记哪些元素已被使用",
    "timeComp": "O(n!)",
    "spaceComp": "O(n)",
    "mistakes": "误用 startIndex 导致只选到了后面的数字没选到前面的数字。",
    "projectLink": "中间件链条 (MiddlewareChain) 执行顺序全排列基准测试。"
  },
  {
    "id": "algo_51",
    "num": 51,
    "title": "N 皇后 (N-Queens)",
    "difficulty": "Hard",
    "category": "回溯算法",
    "topic": "棋盘搜索",
    "leetcodeUrl": "https://leetcode.cn/problems/n-queens/",
    "pattern": "每行放置一个皇后递归到下一行，isValid 检查同列、45 度角、135 度角是否有冲突",
    "timeComp": "O(n!)",
    "spaceComp": "O(n)",
    "mistakes": "检查对角线时遍历超出边界；行冲突其实天然被 row 递归规避无需重复判断。",
    "projectLink": "多核 CPU 任务排程与硬件互斥资源无死锁分配。"
  },
  {
    "id": "algo_455",
    "num": 455,
    "title": "分发饼干 (Assign Cookies)",
    "difficulty": "Easy",
    "category": "贪心算法",
    "topic": "局部最优",
    "leetcodeUrl": "https://leetcode.cn/problems/assign-cookies/",
    "pattern": "小饼干满足小胃口，或者大饼干满足大胃口；排序后双指针单向扫描",
    "timeComp": "O(n log n)",
    "spaceComp": "O(1)",
    "mistakes": "未先对两数组排序直接贪心；双指针移动条件不对称。",
    "projectLink": "连接池闲置连接按请求报文体型贪心复用分配。"
  },
  {
    "id": "algo_53",
    "num": 53,
    "title": "最大子数组和 (Maximum Subarray)",
    "difficulty": "Medium",
    "category": "贪心算法",
    "topic": "连续和重置",
    "leetcodeUrl": "https://leetcode.cn/problems/maximum-subarray/",
    "pattern": "贪心：连续和 count 若为负数则立即重置为 0 从下一元素重新开始累计，同时记录 maxCount",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "初始 result 设置为 0，当数组全为负数时导致错误返回 0（应初始为 INT_MIN 或 nums[0]）。",
    "projectLink": "网络连续时延抖动窗口最大负荷区间检测。"
  },
  {
    "id": "algo_55",
    "num": 55,
    "title": "跳跃游戏 (Jump Game)",
    "difficulty": "Medium",
    "category": "贪心算法",
    "topic": "覆盖范围更新",
    "leetcodeUrl": "https://leetcode.cn/problems/jump-game/",
    "pattern": "只关注当前能覆盖到的最远距离 cover，只要 i <= cover，就更新 cover = max(cover, i + nums[i])",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "纠结每次跳几步写成复杂回溯导致超时；循环条件未限制在 i <= cover 内。",
    "projectLink": "分布式网络包 TTL 跳数可达性与最远中继覆盖判定。"
  },
  {
    "id": "algo_70",
    "num": 70,
    "title": "爬楼梯 (Climbing Stairs)",
    "difficulty": "Easy",
    "category": "动态规划",
    "topic": "线性 DP",
    "leetcodeUrl": "https://leetcode.cn/problems/climbing-stairs/",
    "pattern": "dp[i] = dp[i-1] + dp[i-2]，滚动数组两个变量将空间优化至 O(1)",
    "timeComp": "O(n)",
    "spaceComp": "O(1)",
    "mistakes": "边界条件 n=1 时越界；递推初值定义错误。",
    "projectLink": "状态机两路分支跳转状态路径累加推导。"
  },
  {
    "id": "algo_416",
    "num": 416,
    "title": "分割等和子集 (Partition Equal Subset Sum)",
    "difficulty": "Medium",
    "category": "动态规划",
    "topic": "01背包",
    "leetcodeUrl": "https://leetcode.cn/problems/partition-equal-subset-sum/",
    "pattern": "转为背包容量 target = sum / 2，一维滚动数组从后往前遍历防重复选取：dp[j] = max(dp[j], dp[j - num] + num)",
    "timeComp": "O(n * target)",
    "spaceComp": "O(target)",
    "mistakes": "若 sum 为奇数直接不可分割返回 false；一维 dp 未从大到小逆序遍历导致物品重复使用。",
    "projectLink": "微服务双活节点间无损流量等权无缝切分。"
  },
  {
    "id": "algo_300",
    "num": 300,
    "title": "最长递增子序列 (Longest Increasing Subsequence)",
    "difficulty": "Medium",
    "category": "动态规划",
    "topic": "子序列 DP",
    "leetcodeUrl": "https://leetcode.cn/problems/longest-increasing-subsequence/",
    "pattern": "dp[i] 表示以 nums[i] 结尾的最长 LIS 长度，内层遍历 0~i-1，当 nums[i] > nums[j] 时 dp[i] = max(dp[i], dp[j] + 1)",
    "timeComp": "O(n^2)",
    "spaceComp": "O(n)",
    "mistakes": "返回值误以为是 dp[n-1]，实际递增序列结尾不一定是最后一个数，必须取 max_element。",
    "projectLink": "TCP 数据包乱序到达后的最长保序滑动序列快速重组。"
  },
  {
    "id": "algo_1143",
    "num": 1143,
    "title": "最长公共子序列 (Longest Common Subsequence)",
    "difficulty": "Medium",
    "category": "动态规划",
    "topic": "双串二维 DP",
    "leetcodeUrl": "https://leetcode.cn/problems/longest-common-subsequence/",
    "pattern": "dp[i][j] 表示 text1[0..i-1] 与 text2[0..j-1] 的 LCS：相等则 dp[i-1][j-1]+1，不等取 max(dp[i-1][j], dp[i][j-1])",
    "timeComp": "O(m*n)",
    "spaceComp": "O(m*n)",
    "mistakes": "下标对齐错误，dp 数组开 (m+1)*(n+1) 可以免去空串边界特判。",
    "projectLink": "Git Diff 核心比较算法与报文版本差异增量比对。"
  },
  {
    "id": "algo_739",
    "num": 739,
    "title": "每日温度 (Daily Temperatures)",
    "difficulty": "Medium",
    "category": "单调栈",
    "topic": "下一个更大元素",
    "leetcodeUrl": "https://leetcode.cn/problems/daily-temperatures/",
    "pattern": "单调栈内保存下标，从栈顶到栈底单调递增；当当前元素大于栈顶时，弹出并计算下标差",
    "timeComp": "O(n)",
    "spaceComp": "O(n)",
    "mistakes": "栈内保存了值而非下标导致无法求距离；单调性方向弄反。",
    "projectLink": "网络 QPS 突增后等待时延下降的窗口期探测。"
  },
  {
    "id": "algo_42",
    "num": 42,
    "title": "接雨水 (Trapping Rain Water)",
    "difficulty": "Hard",
    "category": "单调栈",
    "topic": "按行求 / 单调栈",
    "leetcodeUrl": "https://leetcode.cn/problems/trapping-rain-water/",
    "pattern": "单调栈按行求雨水：栈顶出栈为凹陷坑底 mid，新栈顶为左边界 left，当前元素为右边界，宽 * 高累加",
    "timeComp": "O(n)",
    "spaceComp": "O(n)",
    "mistakes": "有相同高度柱子时未先出栈更新；计算高时未取 min(h[left], h[right]) - h[mid]。",
    "projectLink": "网络缓冲区突发积压量与双端吞吐速率形成的滞留水线模型。"
  },
  {
    "id": "algo_797",
    "num": 797,
    "title": "所有可能的路径 (All Paths Source to Target)",
    "difficulty": "Medium",
    "category": "图论",
    "topic": "DFS 遍历",
    "leetcodeUrl": "https://leetcode.cn/problems/all-paths-from-source-to-target/",
    "pattern": "有向无环图 DFS：节点加入 path，遇到目标节点收集结果并回溯，撤销当前节点",
    "timeComp": "O(2^V * V)",
    "spaceComp": "O(V)",
    "mistakes": "DAG 中无环无需 used 数组，但回溯 path.pop_back() 不能丢。",
    "projectLink": "服务调用链路 (Trace) 全拓扑路由可行路径枚举。"
  },
  {
    "id": "algo_207",
    "num": 207,
    "title": "课程表 (Course Schedule)",
    "difficulty": "Medium",
    "category": "图论",
    "topic": "拓扑排序 / BFS 入度",
    "leetcodeUrl": "https://leetcode.cn/problems/course-schedule/",
    "pattern": "构建邻接表与 inDegree 入度数组，入度为 0 节点入队，弹出时将后续节点入度减 1，最终出队数等于总数则无环",
    "timeComp": "O(V + E)",
    "spaceComp": "O(V + E)",
    "mistakes": "入度数组建图方向反了导致判断反；有环时队列提前为空未察觉。",
    "projectLink": "微服务循环依赖检测与 muduo 模块初始化依赖拓扑排程。"
  }
];


// 5. 项目代码驱动型技术八股中心 (全量覆盖 CppAIService 15 大核心模块)
var PROJECT_QA_CATALOG = [
  {
    "id": "qa_fsm_http_parser",
    "module": "HttpContext.cpp",
    "category": "HTTP 协议栈",
    "question": "有限状态机 (FSM) 在 HTTP 报文解析中是如何处理跨 TCP 分包到达的？",
    "projectContext: ": "HttpServer/src/http/HttpContext.cpp 中的 parseRequest()",
    "sourceFile": "src/http/HttpContext.cpp",
    "sourceLine": "L10-L75",
    "answer": "1. 状态机将每个连接的 HttpContext 绑定至 TcpConnection 上下文，保留解析进度(kExpectRequestLine -> kExpectHeaders -> kExpectBody)；\n2. 当读取数据未遇到 CRLF (\\r\\n) 终止符时，状态机保持在当前主状态，并将已消费的数据从 Buffer 移除；\n3. 当后续数据再次就绪触发 onMessage 时，状态机从上次中断的状态继续向后匹配，杜绝了重复解析与报文丢失。",
    "followUp": "面对超长恶意请求头攻击 (Slowloris 慢速拒绝服务)，状态机如何防御？",
    "trap": "必须在解析时设定请求行长度与请求头最大字节数上限，超出立即返回 414 或 431 并主动断开连接。"
  },
  {
    "id": "qa_http_request_parsing",
    "module": "HttpRequest.h",
    "category": "HTTP 协议栈",
    "question": "HttpRequest 如何高效解析与存储 HTTP Header？为什么要区分大小写不敏感与参数提取？",
    "projectContext": "HttpServer/include/http/HttpRequest.h 与 HttpRequest.cpp",
    "sourceFile": "src/http/HttpRequest.h",
    "sourceLine": "L15-L80",
    "answer": "1. 存储设计：采用 std::map<std::string, std::string> 或定长数组存储 Header 键值对，URL 查询参数使用 queryParameters 字典延迟懒解析；\n2. 零拷贝优化：解析阶段通过 string_view 或指针范围直接在 Buffer 内部标记冒号 ':' 与 '\\r\\n'，减少冗余内存拷贝；\n3. 标准对齐：根据 RFC 7230，Header 键为大小写不敏感，查找时转小写规范化比对。",
    "followUp": "如果一个请求包含多个同名 Header (如多个 Accept 或 Set-Cookie)，如何处理？",
    "trap": "需支持将多个值以逗号合并，或使用 multimap 保存多个同名 Header。"
  },
  {
    "id": "qa_http_response_keepalive",
    "module": "HttpResponse.cpp",
    "category": "HTTP 协议栈",
    "question": "HTTP/1.1 长连接 (Keep-Alive) 在响应报文中如何协商？Content-Length 缺失时如何分块传输 (Chunked)？",
    "projectContext": "HttpServer/src/http/HttpResponse.cpp 中的 appendToBuffer()",
    "sourceFile": "src/http/HttpResponse.cpp",
    "sourceLine": "L20-L80",
    "answer": "1. Keep-Alive 协商：若客户端请求指定 Connection: keep-alive 且服务端未强制关闭，则响应头写入 Connection: keep-alive，并在发送后保持连接由 TimerQueue 设定 60s 空闲超时淘汰；\n2. Content-Length 机制：静态或定长响应显式计算并在 Header 给出 Content-Length；\n3. 分块传输 Chunked：对于大模型流式 SSE 或不确定长度的动态流，设置 Transfer-Encoding: chunked，每块以十六进制字节长度 + CRLF + 数据块 + CRLF 发送，最后以 0\\r\\n\\r\\n 结尾。",
    "followUp": "Keep-Alive 连接在空闲时占用资源，如何设计防死连接策略？",
    "trap": "必须在 muduo EventLoop 中注册心跳超时回调，配合时间轮或最小堆定时器定时踢掉长时间无请求的空闲连接。"
  },
  {
    "id": "qa_router_radix_tree",
    "module": "Router.cpp",
    "category": "路由与分发",
    "question": "为什么高并发 RESTful Web 框架通常采用前缀树 (Radix Tree / Trie) 而非线性遍历或纯正则来做路由分发？",
    "projectContext": "HttpServer/src/router/Router.cpp 与 RouterHandler",
    "sourceFile": "src/http/Router.cpp",
    "sourceLine": "L12-L90",
    "answer": "1. 时间复杂度压降：线性正则匹配时间复杂度为 O(N*M)（N为注册路由数，M为URL长度），而前缀树只与请求 URL 深度相关，达到 O(M) 常数级别；\n2. 动态参数提取：支持将 /api/v1/model/:name 形式的路径参数在树的分支节点上通过通配符节点捕获，快速注入到请求参数上下文中；\n3. 内存共享：前缀公共路径共享父节点，显著压缩内存占用。",
    "followUp": "静态精确匹配路由与带通配符参数路由发生冲突时，匹配优先级如何定义？",
    "trap": "必须遵循精确匹配优先 (Exact) > 参数匹配 (:param) > 泛通配通配符 (*wildcard)。"
  },
  {
    "id": "qa_reactor_eventfd",
    "module": "Server.cpp",
    "category": "Reactor 网络底座",
    "question": "muduo 主从 Reactor 线程模型是如何划分 Acceptor 与 Worker 线程职责的？跨线程唤醒为什么选择 eventfd？",
    "projectContext": "HttpServer/src/http/HttpServer.cpp 与 TcpServer::setThreadNum()",
    "sourceFile": "src/core/Server.cpp",
    "sourceLine": "L20-L85",
    "answer": "1. 主从架构：MainReactor (baseLoop) 仅负责监听套接字 listenFd 的 Accept 事件，一旦建立连接立刻以 Round-Robin 算法轮询分派给 SubReactor 线程池 (EventLoopThreadPool)；\n2. 线程隔离：每个 SubReactor 独立运行自己的 epoll_wait 循环，负责自己管辖的客户端连接的所有读写与协议解包，互不加锁竞争；\n3. eventfd 唤醒：跨线程向指定 EventLoop 投递任务 (queueInLoop) 时，通过向其绑定的 eventfd 写入 8 字节唤醒 epoll_wait，避免管道双 fd 浪费与内核缓冲区开销。",
    "followUp": "如果工作线程处理某个耗时计算任务超过 5 秒，会对所属 SubReactor 带来什么后果？",
    "trap": "eventfd 写入必须恰好为 8 字节，若写入不足 8 字节报错 EINVAL，读取不足 8 字节会导致 epoll 持续唤醒；工作线程若阻塞会导致该 SubReactor 上管辖的所有其他并发客户端连接的读写事件全部被阻塞。"
  },
  {
    "id": "qa_connection_pool_raii",
    "module": "ConnectionPool.cpp",
    "category": "并发与连接池",
    "question": "TCP 连接池 / 数据库连接池如何利用 RAII 机制实现零泄漏？高并发下如何解决惊群与连接饥饿？",
    "projectContext": "HttpServer/src/utils/db/DbConnectionPool.cpp 与 DbConnection",
    "sourceFile": "src/core/ConnectionPool.cpp",
    "sourceLine": "L15-L95",
    "answer": "1. RAII 借还：重载 std::shared_ptr 的自定义 Deleter，当智能指针生命周期结束时，Deleter 执行将连接放回 freeList 队列而非真正 close 析构；\n2. 饥饿防护：采用带超时的条件变量 wait_for，超时未能借出连接立即抛出或返回繁忙错误，防止调用方永久死锁；\n3. 惊群消除：归还连接时使用 notify_one() 单个精准唤醒等待队列头，避免 notify_all() 导致所有等待线程瞬间唤醒竞争。",
    "followUp": "长连接在空闲期间由于对端服务端超时关闭，连接池如何自愈保活？",
    "trap": "借出连接前执行轻量 ping 心跳或保活探活 (valid check)，若断开则销毁并新建连接补充。"
  },
  {
    "id": "qa_buffer_readv",
    "module": "Buffer.cpp",
    "category": "内存与性能",
    "question": "为什么高性能网络库必须设计应用层缓冲区 Buffer？readv 分散读栈上 64KB 临时缓冲区的精妙之处在哪？",
    "projectContext": "muduo Buffer.cc 中的 readFd() 与两段式内存管理",
    "sourceFile": "src/core/Buffer.cpp",
    "sourceLine": "L25-L95",
    "answer": "1. 解决非阻塞写 EAGAIN：当内核写缓冲区满时数据发不完，必须暂存应用层等待下次可写；\n2. 解决 TCP 粘包半包：接收端在应用层拼合完整协议报文；\n3. readv 两段读：第一段指向 Buffer 现有可写空间，第二段指向栈上 64KB extrabuf。既避免了为数万个连接预分配巨大内存浪费，又确保一次 readv 读完内核数据，如果超出当前 Buffer 再动态扩容 append，兼顾低内存与大吞吐。",
    "followUp": "发送端生产速度远大于接收端处理速度时，应用层 Output Buffer 无限膨胀怎么办？",
    "trap": "必须设置高水位回调 (HighWaterMarkCallback) 执行应用层反压、暂停接收或主动丢弃断开连接。"
  },
  {
    "id": "qa_mcp_twostage",
    "module": "McpRegistry.cpp",
    "category": "AI 与 MCP 协议",
    "question": "什么是两段式 MCP (Model Context Protocol) 工具调用？服务端内部如何完成参数提取与执行路由？",
    "projectContext": "AIApps/ChatServer/src/AIUtil/AIToolRegistry.cpp 中的 executeTool()",
    "sourceFile": "src/mcp/McpRegistry.cpp",
    "sourceLine": "L15-L80",
    "answer": "1. 阶段一元数据声明：服务端将 C++ 本地函数以 JSON Schema 标准元数据注册至 McpRegistry，并随请求携带给 LLM；\n2. 阶段二函数回调分发：大模型决定执行 tool_call 并输出包含参数的 JSON，服务端依据 toolName 在哈希表中路由到对应的 C++ std::function 回调执行；\n3. 结果写回：将本地执行结果构造成 role=tool 消息二次喂给大模型完成最终流式回答生成。",
    "followUp": "如何保证不受信任的大模型生成的本地参数不会引发代码注入或系统越权？",
    "trap": "必须对传入的 JSON 参数进行强类型的 JSON Schema 校验，并对文件路径、系统命令执行沙盒与白名单隔离。"
  },
  {
    "id": "qa_tool_caller_async",
    "module": "ToolCaller.cpp",
    "category": "AI 与异步调度",
    "question": "本地工具执行可能耗时（如外部 HTTP 调用、数据库长查询），如何与 muduo 事件循环实现异步解耦？",
    "projectContext": "AIApps/ChatServer/src/AIUtil/AIHelper.cpp",
    "sourceFile": "src/mcp/ToolCaller.cpp",
    "sourceLine": "L10-L60",
    "answer": "1. 线程池任务卸载：将阻塞型工具调用封装为 std::packaged_task 投递到专门的 Worker 线程池；\n2. Future / Promise 异步唤醒：网络 IO 线程不等待，直接返回；\n3. 任务完成后跨线程投递：工具计算完成后调用 ioLoop->runInLoop() 将最终结果通知回客户端连接，杜绝 EventLoop 假死。",
    "followUp": "如果外部工具无限期超时挂起，如何做熔断和反压？",
    "trap": "必须配置超时定时器 (TimerQueue)，到达超时阈值自动销毁 Future 并向客户端返回 Gateway Timeout 错误。"
  },
  {
    "id": "qa_json_rpc_spec",
    "module": "JsonRpcHandler.cpp",
    "category": "协议规范与错误码",
    "question": "JSON-RPC 2.0 规范中请求、响应与 Notification 的核心差异是什么？错误报文如何标准化？",
    "projectContext": "AIApps/ChatServer/include/AIUtil/AIStrategy.h",
    "sourceFile": "src/mcp/JsonRpcHandler.cpp",
    "sourceLine": "L10-L50",
    "answer": "1. 请求与通知区分：标准 Request 必须包含 'id' 字段，服务端必须返回匹配该 id 的 Response；若不带 'id' 字段则为 Notification，服务端处理后无需返回任何应答；\n2. 错误格式统一：标准错误包含 code、message 与可选的 data 字典，错误码如 -32700 (Parse error)、-32600 (Invalid Request)、-32601 (Method not found)；\n3. 批量请求：支持数组形式提交多个 RPC，服务端并发处理并以数组格式统一返回结果。",
    "followUp": "异步 RPC 响应乱序返回时，客户端如何将响应正确匹配到对应的发起方上下文？",
    "trap": "严格依赖全局唯一的 request id，通过本地并发安全的哈希映射表唤醒对应的回调上下文。"
  },
  {
    "id": "qa_model_client_sse",
    "module": "ModelClient.cpp",
    "category": "大模型交互",
    "question": "大模型流式响应 (Server-Sent Events) 的协议特征是什么？HTTP 客户端如何无卡顿解析流式 Token？",
    "projectContext": "AIApps/ChatServer/src/AIUtil/AIStrategy.cpp",
    "sourceFile": "src/ai/ModelClient.cpp",
    "sourceLine": "L20-L90",
    "answer": "1. 协议特征：响应头为 Content-Type: text/event-stream，Cache-Control: no-cache，基于分块长连接实时下发；\n2. 报文格式：每一段数据以 'data: {json}\\n\\n' 结尾，最后以下发 'data: [DONE]\\n\\n' 表示对话结束；\n3. 增量解析：客户端网络接收到数据后按 '\\n\\n' 切分事件块，提取 data 载荷 JSON 进行局部解析获取 delta content 并实时转发给前端。",
    "followUp": "网络抖动导致 SSE 传输中途截断，如何实现断点重连或异常感知？",
    "trap": "协议支持 'id' 字段标记事件序号，重连时在请求头带上 Last-Event-ID 告知服务端从中断点续传。"
  },
  {
    "id": "qa_stream_parser_pipeline",
    "module": "StreamParser.cpp",
    "category": "流式解析与管道",
    "question": "在高并发聊天服务端，如何将大模型返回的 SSE 流异步转推到千万 WebSocket / HTTP 客户端？",
    "projectContext": "AIApps/ChatServer/src/handlers/ChatSendHandler.cpp",
    "sourceFile": "src/ai/StreamParser.cpp",
    "sourceLine": "L15-L85",
    "answer": "1. 边收边发管道模式：不对大模型输出做整包缓存，解析出单个 Token 字符后立刻包装成对端客户端的协议帧写入 outputBuffer；\n2. 零阻塞转发：若客户端网络较慢导致 Buffer 积压超过阈值，暂停拉取大模型数据（反压 Backpressure）；\n3. 心跳防护：每隔 15 秒向长连接客户端发送注释行 ': keep-alive\\n\\n' 防止中间 Nginx 或网关代理超时切断连接。",
    "followUp": "多用户并发请求大模型时，连接数暴涨可能导致被上游 API 提供方 429 限流，如何防护？",
    "trap": "必须在服务端引入令牌桶 (Token Bucket) 或漏桶限流器，对出向 QPS 与并发流进行全局平滑控制。"
  },
  {
    "id": "qa_context_cache_lru",
    "module": "ContextCache.cpp",
    "category": "会话与缓存",
    "question": "多轮对话历史 Context 缓存如何设计淘汰机制？内存有限时如何平衡命中率与 OOM 风险？",
    "projectContext": "HttpServer/src/session/SessionManager.cpp",
    "sourceFile": "src/ai/ContextCache.cpp",
    "sourceLine": "L10-L70",
    "answer": "1. LRU 双向链表 + 哈希：维护容量上限 capacity，当新会话插入超出容量时，从双向链表尾部淘汰最久未访问的 Session 释放内存；\n2. 绝对超时 (TTL) 与滑动过期：每个 Session 记录 lastAccessedTime，后台定时器定期扫描清理超期会话；\n3. 压缩存储：对话轮次过多时对历史非关键消息执行 Token 截断或摘要压缩，降低单个连接的内存占用。",
    "followUp": "多线程环境下如何保证 SessionManager 的高并发读写安全？",
    "trap": "采用分段锁 (Sharded / Striped Lock) 或读写锁 std::shared_mutex，按 sessionId 哈希到不同的锁桶减少锁冲突。"
  },
  {
    "id": "qa_rabbitmq_decouple",
    "module": "RabbitMQProducer.cpp",
    "category": "消息队列与解耦",
    "question": "为什么要引入 RabbitMQ 异步解耦？Publisher Confirm (发布确认) 是如何保证消息不丢失的？",
    "projectContext": "AIApps/ChatServer/src/AIUtil/MQManager.cpp",
    "sourceFile": "src/mq/RabbitMQProducer.cpp",
    "sourceLine": "L15-L75",
    "answer": "1. 削峰解耦：用户发送聊天、图片识别或耗时审计日志时，网络服务仅将任务写入 MQ 后立即应答 202 Accepted，后台 Worker 异步消费，保护核心服务免受突发峰值冲击；\n2. 发布确认：开启 confirm.select 模式，Broker 成功将消息写入磁盘并路由到持久化队列后，向 Producer 返回 Basic.Ack，Producer 收到 Ack 才标记任务投递成功；\n3. 失败重发：若收到 Nack 或超时未收到响应，Producer 从本地未决缓冲中提取消息执行指数退避重试或写入死信队列 (DLX)。",
    "followUp": "消息重试可能导致消费者重复消费相同消息，如何实现幂等性？",
    "trap": "为每条消息生成唯一 messageId，消费者在处理业务前先在 Redis 执行 SETNX 检查是否已处理过。"
  },
  {
    "id": "qa_metrics_ring_buffer",
    "module": "MetricsCollector.cpp",
    "category": "可观测性与性能",
    "question": "高并发生产环境下，如何在尽量不加锁、不影响主业务吞吐的前提下精确统计 QPS 与 P99 时延？",
    "projectContext": "src/metrics/MetricsCollector.cpp",
    "sourceFile": "src/metrics/MetricsCollector.cpp",
    "sourceLine": "L10-L65",
    "answer": "1. 无锁原子计数：采用 std::atomic<int64_t> 配合 std::memory_order_relaxed 统计请求总数与错误数，硬件级原子指令耗时仅纳秒级；\n2. 环形时延采样：维护定长环形数组 (如 10,000 个采样槽)，原子累加下标进行取模循环覆盖，完全免去动态内存分配；\n3. 离线分位数计算：P99 计算仅在指标上报周期（如每 5 秒）复制一份快照后快速局部排序查找 99% 位置的值，不阻塞任何请求工作线程。",
    "followUp": "多核极端高并发下原子变量 cache line 伪共享 (False Sharing) 如何消除？",
    "trap": "对高频写入的原子变量使用 alignas(64) 按照 CPU Cache Line 大小进行对齐填充。"
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

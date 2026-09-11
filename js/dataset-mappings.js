// ==========================================================================
// 知识图谱映射、源码大纲与避坑库 (MAPPING_MATRIX, SOURCE_ROADMAP, PITFALLS_DATASET)
// ==========================================================================

var MAPPING_MATRIX = [
  {
    "feature": "RAII",
    "muduoLocation": "MutexLockGuard / Socket",
    "desc": "构造时获取系统资源（加锁、open socket），析构时强制在作用域结束时自动释放，杜绝死锁与文件描述符泄漏。",
    "snippet": "MutexLockGuard lock(mutex_);"
  },
  {
    "feature": "std::unique_ptr",
    "muduoLocation": "EventLoop::poller_ / timerQueue_",
    "desc": "独占所有权模型，明确 Poller 实例只属于唯一的 EventLoop，禁止非法拷贝并随 EventLoop 一同释放。",
    "snippet": "std::unique_ptr<Poller> poller_;"
  },
  {
    "feature": "std::shared_ptr",
    "muduoLocation": "TcpConnectionPtr",
    "desc": "管理多方持有的客户端连接，确保只要还有 Channel 或应用层在处理该连接，对象就不会提前析构。",
    "snippet": "using TcpConnectionPtr = std::shared_ptr<TcpConnection>;"
  },
  {
    "feature": "std::weak_ptr",
    "muduoLocation": "Channel::tie_",
    "desc": "弱引用观察者，防止 Channel 与 TcpConnection 循环引用，并在事件触发前通过 lock() 安全提升为 shared_ptr 保证多线程安全。",
    "snippet": "std::weak_ptr<void> tie_;"
  },
  {
    "feature": "std::vector<char>",
    "muduoLocation": "muduo::net::Buffer",
    "desc": "采用连续内存承载网络 I/O 缓冲区，Cache 局部性极高，配合预留预分配大幅减少系统调用与内存碎片。",
    "snippet": "std::vector<char> buffer_;"
  },
  {
    "feature": "std::map",
    "muduoLocation": "TcpServer::ConnectionMap",
    "desc": "按连接名称存储所有活连接，基于红黑树维持稳定有序检索，保证快速查询与准确删除已关闭连接。",
    "snippet": "std::map<string, TcpConnectionPtr> conns_;"
  },
  {
    "feature": "std::function",
    "muduoLocation": "Callbacks.h 全文件",
    "desc": "类型擦除的通用可调用容器，将所有上层用户回调（可读、可写、错误、消息到来）抽象为统一签名。",
    "snippet": "using MessageCallback = std::function<void(...)>;"
  },
  {
    "feature": "std::bind",
    "muduoLocation": "TcpServer / Channel 回调组装",
    "desc": "将含有隐藏 this 指针的类非静态成员函数转化为标准无状态的 std::function 供 EventLoop 回调调用。",
    "snippet": "std::bind(&TcpServer::newConnection, this, _1, _2)"
  },
  {
    "feature": "Lambda 表达式",
    "muduoLocation": "EventLoop::runInLoop",
    "desc": "在跨线程异步任务投递中就地编写临时回调逻辑，快速捕获上下文变量。",
    "snippet": "loop->runInLoop([this](){ doWork(); });"
  },
  {
    "feature": "移动语义 move",
    "muduoLocation": "EventLoop::queueInLoop",
    "desc": "将待执行的回调闭包或数据缓冲通过 std::move 快速窃取转移到消费队列，杜绝无谓的深拷贝开销。",
    "snippet": "pendingFunctors_.push_back(std::move(cb));"
  },
  {
    "feature": "= delete",
    "muduoLocation": "noncopyable 基类",
    "desc": "显式彻底禁用拷贝构造和拷贝赋值，从编译器层面阻止带有独占资源的网络核心对象被误拷贝。",
    "snippet": "noncopyable(const noncopyable&) = delete;"
  },
  {
    "feature": "const 成员函数",
    "muduoLocation": "Buffer / InetAddress / Timestamp",
    "desc": "接口严格约束：凡是不改变内部成员的读取函数（如 size(), toIpPort()）必须加 const 尾标，保证多线程只读安全。",
    "snippet": "size_t readableBytes() const;"
  },
  {
    "feature": "运算符重载",
    "muduoLocation": "Timestamp / LogStream",
    "desc": "重载 operator< 供 std::set 内部按时间戳排序；重载 operator<< 供日志输出流高效无锁格式化拼接。",
    "snippet": "bool operator<(Timestamp rhs) const;"
  },
  {
    "feature": "类模板",
    "muduoLocation": "BlockingQueue<T>",
    "desc": "定义线程安全的泛型阻塞队列，可以承载任意用户数据包或结构体在工作线程间流通传递。",
    "snippet": "template<typename T> class BlockingQueue;"
  },
  {
    "feature": "虚析构函数",
    "muduoLocation": "Poller::~Poller()",
    "desc": "多路复用基类的析构函数必须声明为虚函数，确保通过基类指针 delete 派生类 EPollPoller 时不会内存泄漏。",
    "snippet": "virtual ~Poller() = default;"
  }
];


var SOURCE_ROADMAP = [
  {
    "id": "channel",
    "name": "Channel",
    "layer": "I/O 事件分流与适配层",
    "role": "每个 Channel 对象独占一个特定的 Linux Socket 文件描述符（sockfd），负责向 Poller 注册该 fd 感兴趣的事件（EPOLLIN / EPOLLOUT），并接收 Poller 返回的实际就绪事件，进而分发给预先绑定的事件回调闭包。",
    "members": [
      "const int fd_: 独占管理的单个套接字描述符",
      "EventLoop* loop_: 所属的 EventLoop 反应堆",
      "int events_: 用户关注的事件掩码 (POLLIN/POLLOUT)",
      "int revents_: Poller 实际返回的就绪事件掩码",
      "std::weak_ptr<void> tie_: 弱引用绑定宿主（通常为 TcpConnection），防止多线程下宿主正在析构时回调触发导致野指针",
      "ReadEventCallback readCallback_: 读事件就绪 std::function 回调",
      "EventCallback writeCallback_: 写事件就绪回调",
      "EventCallback errorCallback_: 错误事件回调",
      "EventCallback closeCallback_: 关闭事件回调"
    ],
    "functions": [
      "void tie(const std::shared_ptr<void>&): 将弱引用绑定至宿主对象",
      "void enableReading(): events_ |= POLLIN; update();",
      "void enableWriting(): events_ |= POLLOUT; update();",
      "void update(): 调用 loop_->updateChannel(this) 注册进 epoll",
      "void handleEvent(Timestamp receiveTime): 事件分发入口",
      "void handleEventWithGuard(Timestamp receiveTime): 在 tie_.lock() 提权成功保证宿主存活时安全分发回调"
    ],
    "cppFeatures": [
      "std::weak_ptr 观察者模式",
      "std::function 类型擦除",
      "std::bind 回调组装",
      "RAII 资源防泄漏",
      "const 引用传参"
    ],
    "relatedDays": [
      1,
      10,
      18,
      19,
      20
    ],
    "status": "未读",
    "notes": ""
  },
  {
    "id": "poller",
    "name": "Poller",
    "layer": "I/O 多路复用内核抽象层",
    "role": "作为 I/O 多路复用的纯虚抽象基类，对外封装统一接口，提供 EPollPoller 和 PollPoller 两套具体派生实现。负责将用户关心的 Channel 注册到 Linux 内核 epoll 实例中，并在 poll() 被唤醒时填装 activeChannels 供 EventLoop 处理。",
    "members": [
      "EventLoop* ownerLoop_: 所属的唯一 EventLoop",
      "std::map<int, Channel*> channels_: 按文件描述符映射管理所有当前已注册的 Channel 裸指针索引",
      "struct epoll_event events_[kInitEventListSize]: 预分配的连续内核事件接收缓冲区"
    ],
    "functions": [
      "virtual ~Poller() = default: 必须声明为虚析构，保证派生类 EPollPoller 资源完整释放",
      "virtual Timestamp poll(int timeoutMs, ChannelList* activeChannels) = 0: 纯虚核心阻塞接口，封装 epoll_wait",
      "virtual void updateChannel(Channel* channel) = 0: 封装 epoll_ctl(ADD/MOD)",
      "virtual void removeChannel(Channel* channel) = 0: 封装 epoll_ctl(DEL) 并从 channels_ 移除",
      "static Poller* newDefaultPoller(EventLoop* loop): 工厂方法，按需生成 EPollPoller"
    ],
    "cppFeatures": [
      "虚基类与纯虚函数",
      "虚析构函数防泄漏",
      "std::map 关联容器",
      "std::vector 连续缓冲区",
      "静态工厂方法"
    ],
    "relatedDays": [
      8,
      13,
      26
    ],
    "status": "未读",
    "notes": ""
  },
  {
    "id": "eventloop",
    "name": "EventLoop",
    "layer": "反应堆事件驱动核心中枢",
    "role": "Reactor 反应堆的心脏，坚决践行'One Loop Per Thread'设计准则。每个线程最多只能拥有一个 EventLoop 实例。它在所在专属线程死循环执行 loop()，调度 Poller::poll 获取活跃通道并逐个执行，同时维护一个线程安全的跨线程异步任务队列。",
    "members": [
      "bool looping_: 循环运行状态标志",
      "bool quit_: 退出标志（原子布尔）",
      "const pid_t threadId_: 记录创建本 EventLoop 的专属线程 ID（通过 CurrentThread::tid()）",
      "std::unique_ptr<Poller> poller_: 独占拥有的 I/O 多路复用器，生命周期与 EventLoop 严格共存亡",
      "std::unique_ptr<TimerQueue> timerQueue_: 独占拥有的高精度定时器队列",
      "int wakeupFd_: Linux eventfd 文件描述符，用于跨线程异步唤醒阻塞在 epoll_wait 的 I/O 线程",
      "std::unique_ptr<Channel> wakeupChannel_: 管理 wakeupFd_ 的 Channel 实例",
      "std::vector<Functor> pendingFunctors_: 跨线程投递待在当前 I/O 线程执行的回调任务队列",
      "mutable MutexLock mutex_: 保护 pendingFunctors_ 队列的轻量级互斥锁"
    ],
    "functions": [
      "void loop(): 核心驱动循环，连续轮询 poll() 并执行 doPendingFunctors()",
      "void quit(): 线程安全退出循环请求",
      "void runInLoop(Functor cb): 在当前 I/O 线程同步立即执行，若在跨线程则调用 queueInLoop",
      "void queueInLoop(Functor cb): 将回调 std::move 进 pendingFunctors_ 并在必要时 wakeup()",
      "void wakeup(): 向 wakeupFd_ 写入 8 字节 uint64_t 计数，即刻唤醒 epoll_wait",
      "void doPendingFunctors(): 局部 swap 转移队列，在极短临界区外串行执行全部闭包"
    ],
    "cppFeatures": [
      "std::unique_ptr 独占所有权",
      "std::vector 移动追加",
      "std::move 零拷贝窃取",
      "RAII 锁守护",
      "std::function 异步闭包",
      "assert 断言防御"
    ],
    "relatedDays": [
      6,
      8,
      18,
      21
    ],
    "status": "未读",
    "notes": ""
  },
  {
    "id": "acceptor",
    "name": "Acceptor",
    "layer": "监听套接字与新建连接接入层",
    "role": "供 TcpServer 内部使用的高层组件，负责服务端监听套接字（listen socket）的创建、bind 绑定、listen 监听，并通过自身的 acceptChannel_ 监听可读事件。当新客户端连接到来时，调用 ::accept4 获取连接套接字并分发 newConnectionCallback 回调给 TcpServer。",
    "members": [
      "EventLoop* loop_: 所属的主接收反应堆（通常为主线程 baseLoop）",
      "Socket acceptSocket_: RAII 方式管理的监听套接字，析构自动 close(fd)",
      "Channel acceptChannel_: 监听 acceptSocket_.fd() 读事件的通道",
      "NewConnectionCallback newConnectionCallback_: 连接建立后上报给 TcpServer 的回调闭包",
      "bool listenning_: 监听状态标志",
      "int idleFd_: 预先打开的 /dev/null 占位文件描述符，用于优雅处理 EMFILE（文件描述符耗尽）灾难"
    ],
    "functions": [
      "Acceptor(EventLoop* loop, const InetAddress& listenAddr, bool reuseport): 初始化并绑定地址",
      "~Acceptor(): 离开作用域时由 RAII 自动关闭通道与套接字",
      "void listen(): 设置 socket 为监听模式并启用 acceptChannel_.enableReading()",
      "void handleRead(): 当监听 fd 可读时执行 ::accept4 并触发 newConnectionCallback_"
    ],
    "cppFeatures": [
      "RAII 套接字生命周期封装",
      "noncopyable 禁止误拷贝",
      "std::function 回调挂载",
      "std::bind 适配"
    ],
    "relatedDays": [
      3,
      7,
      19
    ],
    "status": "未读",
    "notes": ""
  },
  {
    "id": "tcpconnection",
    "name": "TcpConnection",
    "layer": "客户端长连接全生命周期管理",
    "role": "muduo 中最核心、复杂度最高的业务连接实体。代表一个已经成功建立的 TCP 全双工网络连接。它独占客户端连接 Socket 与 Channel，拥有独立的应用层 inputBuffer_ 与 outputBuffer_，通过继承 std::enable_shared_from_this 确保在跨线程异步回调中安全保活。",
    "members": [
      "EventLoop* loop_: 本连接被分配绑定的 SubLoop（从属 I/O 线程）",
      "const string name_: 连接唯一标识字符串",
      "StateE state_: 连接状态机枚举 (kConnecting, kConnected, kDisconnecting, kDisconnected)",
      "std::unique_ptr<Socket> socket_: 独占拥有的客户端 TCP 连接套接字",
      "std::unique_ptr<Channel> channel_: 独占拥有的网络事件通道",
      "Buffer inputBuffer_: 接收数据非阻塞应用层输入缓冲区",
      "Buffer outputBuffer_: 待发送数据非阻塞应用层输出缓冲区",
      "ConnectionCallback connectionCallback_: 连接建立/关闭状态回调",
      "MessageCallback messageCallback_: 消息数据到达回调",
      "WriteCompleteCallback writeCompleteCallback_: 数据完全发送完毕回调",
      "CloseCallback closeCallback_: 内部关闭通知 TcpServer 回调"
    ],
    "functions": [
      "void send(const void* message, int len): 线程安全的数据发送入口",
      "void sendInLoop(const StringPiece& message): 若输出缓冲为空且在当前 I/O 线程则直接 ::write 原地发送，剩余未发完数据追加到 outputBuffer_ 并开启 EPOLLOUT 监听",
      "void shutdown(): 优雅半关闭连接写端（::shutdown(fd, SHUT_WR)）",
      "void handleRead(Timestamp receiveTime): 读就绪时调用 Buffer::readFd 读取数据并触发 messageCallback_",
      "void handleWrite(): 写就绪时将 outputBuffer_ 中的积压数据写入内核并适时关闭 EPOLLOUT",
      "void handleClose(): 处理对端关闭，注销 Channel，触发 closeCallback_ 通知 TcpServer",
      "void connectEstablished(): 连接确立时挂载 Channel::tie(shared_from_this())"
    ],
    "cppFeatures": [
      "std::enable_shared_from_this 跨线程自保",
      "std::shared_ptr 共享模型",
      "std::unique_ptr 独占套接字",
      "Buffer 应用层缓冲",
      "状态机枚举设计"
    ],
    "relatedDays": [
      9,
      10,
      14,
      18,
      19
    ],
    "status": "未读",
    "notes": ""
  },
  {
    "id": "tcpserver",
    "name": "TcpServer",
    "layer": "高层服务器连接拓扑大总管",
    "role": "面向最终业务开发者的总入口。负责集成 Acceptor（监听新建连接）和 EventLoopThreadPool（多线程反应堆池），并在自身维护的 map<string, TcpConnectionPtr> conns_ 中管理服务器全生命周期的所有存活长连接。使用 std::bind 将自身的 newConnection 与 removeConnection 回调注入底层。",
    "members": [
      "EventLoop* loop_: 主 Reactor 循环 (baseLoop，负责接收连接)",
      "const string ipPort_: 服务器绑定的 IP:Port 标识",
      "const string name_: 服务名称",
      "std::unique_ptr<Acceptor> acceptor_: 独占的监听接收器",
      "std::shared_ptr<EventLoopThreadPool> threadPool_: 从属 SubLoop 线程池",
      "ConnectionMap connections_: std::map<string, TcpConnectionPtr> 维护全服活跃连接",
      "ConnectionCallback connectionCallback_: 用户注册的连接状态变更回调",
      "MessageCallback messageCallback_: 用户注册的业务消息到来回调",
      "WriteCompleteCallback writeCompleteCallback_: 用户注册的发送完毕回调",
      "AtomicInt32 started_: 原子标志确保 start() 幂等执行"
    ],
    "functions": [
      "TcpServer(EventLoop* loop, const InetAddress& listenAddr, const string& name): 构造配置",
      "void setThreadNum(int numThreads): 配置从属 I/O 工作线程数量",
      "void start(): 启动线程池并使 acceptor_ 进入 listen 状态",
      "void newConnection(int sockfd, const InetAddress& peerAddr): Acceptor 触发后通过 round-robin 选出 SubLoop 构建 TcpConnectionPtr 并存入 connections_ 映射表",
      "void removeConnection(const TcpConnectionPtr& conn): 将连接从 connections_ 摘除并投递到所在 Loop 执行 connectDestroyed"
    ],
    "cppFeatures": [
      "std::map 红黑树存储长连接",
      "std::bind 绑定成员函数",
      "std::shared_ptr 共享托管",
      "noncopyable 禁用拷贝",
      "原子变量保护"
    ],
    "relatedDays": [
      9,
      13,
      14,
      19
    ],
    "status": "未读",
    "notes": ""
  },
  {
    "id": "buffer",
    "name": "Buffer",
    "layer": "应用层自适应非阻塞 I/O 缓冲器",
    "role": "解决非阻塞网络 I/O 下数据发送不完全（TCP 协议滑动窗口与内核发送缓冲区满）与粘包分包问题的关键构件。底层基于连续内存 std::vector<char> 构建，利用 prepends (预留头部)、readerIndex (可读游标) 与 writerIndex (可写游标) 消除无谓的内存移动，配合 readv 分散读实现极致零碎片的平滑扩容。",
    "members": [
      "std::vector<char> buffer_: 连续内存存储载体，保证高 CPU Cache 局部性",
      "size_t readerIndex_: 指示当前有效可读数据的起始偏移量",
      "size_t writerIndex_: 指示当前已写入数据的末尾偏移量",
      "static const size_t kCheapPrepend = 8: 头部预留 8 字节空间，用于方便协议栈就地 prepend 包头长度而免于再次拷贝",
      "static const size_t kInitialSize = 1024: 初始默认分配 1KB 缓冲容量"
    ],
    "functions": [
      "size_t readableBytes() const: writerIndex_ - readerIndex_，查询当前未读字节",
      "size_t writableBytes() const: buffer_.size() - writerIndex_，查询当前剩余可写空间",
      "size_t prependableBytes() const: readerIndex_，查询头部预留空间",
      "void retrieve(size_t len): 消耗读取特定长度数据，向前推进 readerIndex_",
      "void append(const char* data, size_t len): 追加新数据到 buffer_，不够时自动扩容",
      "void makeSpace(size_t more): 空间不足时，若已读空间+可写空间足够则原地搬移整理，否则调用 vector::resize 扩容",
      "ssize_t readFd(int fd, int* savedErrno): 核心技巧：结合栈上临时 64KB 数组借助 ::readv 分散读，兼顾小包不扩容与大包零拷贝动态扩容"
    ],
    "cppFeatures": [
      "std::vector<char> 连续内存",
      "const 成员函数严格约束",
      "readv 系统调用适配",
      "Copy-on-write 优化考虑",
      "零碎片扩容模型"
    ],
    "relatedDays": [
      2,
      6,
      11,
      23
    ],
    "status": "未读",
    "notes": ""
  },
  {
    "id": "timerqueue",
    "name": "TimerQueue",
    "layer": "纳秒/微秒级高精度定时器调度队列",
    "role": "提供线程安全的定时器与心跳超时检测机制。内部借助 Linux 特有的 timerfd 系列系统调用（timerfd_create / timerfd_settime），将定时器超时抽象为一个常规的文件描述符事件，直接纳入 EventLoop 的 Poller 进行统一多路复用监听。基于 std::set<Entry> 自动维持时间戳递增顺序。",
    "members": [
      "EventLoop* loop_: 所属的 EventLoop 反应堆",
      "const int timerfd_: Linux 内核 timerfd 套接字句柄",
      "Channel timerfdChannel_: 监听 timerfd_ 读事件的专用 Channel",
      "typedef std::pair<Timestamp, Timer*> Entry: 时间戳与定时器裸指针键值对",
      "typedef std::set<Entry> TimerList: 基于红黑树维持微秒到期时间升序排列的集合",
      "TimerList timers_: 按到期时间排序的所有活动定时器集合",
      "bool callingExpiredTimers_: 是否正在遍历执行超时回调的原子状态标志"
    ],
    "functions": [
      "TimerId addTimer(TimerCallback cb, Timestamp when, double interval): 线程安全添加定时器",
      "void cancel(TimerId timerId): 线程安全注销定时器",
      "void handleRead(): 当 timerfd_ 超时变为可读时触发，读取 8 字节并执行 processTimers",
      "std::vector<Entry> getExpired(Timestamp now): 从 timers_ 中利用 lower_bound 快速切分出所有当前已到期的 Entry 列表",
      "void reset(const std::vector<Entry>& expired, Timestamp now): 对周期性定时器（interval > 0）重新计算下次触发时间并塞回 timers_"
    ],
    "cppFeatures": [
      "std::set 红黑树按键排序",
      "std::pair 组合键",
      "timerfd 内核机制",
      "运算符重载 operator< 比较器",
      "算法 lower_bound 极速二分定位"
    ],
    "relatedDays": [
      13,
      22,
      24
    ],
    "status": "未读",
    "notes": ""
  }
];


var PITFALLS_DATASET = [
  {
    "id": "p1",
    "title": "Double Free：裸指针未重写拷贝构造引发堆内存双重释放",
    "date": "2026-09-10",
    "day": 4,
    "keywords": [
      "double free",
      "浅拷贝",
      "裸指针",
      "SIGABRT"
    ],
    "errorCode": "class BadBuffer {\npublic:\n    char* data_;\n    BadBuffer(size_t s) : data_(new char[s]) {}\n    ~BadBuffer() { delete[] data_; }\n    // 缺失深拷贝构造函数！\n};\n\nvoid crashTest() {\n    BadBuffer b1(64);\n    BadBuffer b2 = b1; // 编译器默认 bit-wise 逐位浅拷贝\n} // 作用域结束：b2 先析构 delete[] data_；b1 后析构再次 delete[] data_ -> SIGABRT!",
    "errorSymptom": "程序在退出局部代码块时突然崩溃，控制台输出：free(): double free detected in tcache 2，进程被操作系统以 SIGABRT 信号强杀。",
    "errorCause": "编译器合成的默认拷贝构造函数只复制了指针变量本身的 8 字节物理地址，两个独立的栈对象持有同一块堆内存。析构顺序导致同一堆地址被二次 delete[]，破坏堆分配器的内部元数据链表。",
    "correctCode": "class SafeBuffer {\nprivate:\n    std::unique_ptr<char[]> data_; // 方案1: 采用独占智能指针彻底杜绝非法拷贝\n    size_t size_;\npublic:\n    SafeBuffer(size_t s) : data_(std::make_unique<char[]>(s)), size_(s) {}\n    // 或方案2: 显式标记禁用拷贝并支持移动语义\n    SafeBuffer(const SafeBuffer&) = delete;\n    SafeBuffer& operator=(const SafeBuffer&) = delete;\n    SafeBuffer(SafeBuffer&&) noexcept = default;\n};",
    "conclusion": "【工程铁律】凡是管理独占资源的类，必须显式重写深拷贝构造与拷贝赋值（三/五法则），或直接将其标记为 =delete 并改用 unique_ptr 托管生命周期，永远不要依赖默认浅拷贝！"
  },
  {
    "id": "p2",
    "title": "Dangling Pointer：函数返回局部栈对象的引用或指针",
    "date": "2026-09-10",
    "day": 1,
    "keywords": [
      "dangling pointer",
      "野指针",
      "悬挂引用",
      "栈溢出"
    ],
    "errorCode": "const std::string& getHostname() {\n    std::string host = \"cluster.internal.lan\";\n    return host; // 危险！返回局部栈变量的引用！\n}\n\nvoid useHost() {\n    const std::string& r = getHostname();\n    // 此时 host 所在的栈帧已被销毁回收\n    std::cout << r << std::endl; // 未定义行为：乱码、内存越界或静默篡改\n}",
    "errorSymptom": "打印出的字符串时而正常时而变成乱码或空串；开启 -O2 优化后直接段错误崩溃（SIGSEGV）；Valgrind 报告 Invalid read of size 8。",
    "errorCause": "局部变量 host 分配在当前函数的调用栈帧（Stack Frame）上。函数返回时该栈帧被弹出，其占用的栈内存被标记为可用；返回的引用变成了悬挂引用，后续任何函数调用都会覆写该内存。",
    "correctCode": "// 方案1: 直接按值返回，现代 C++ 借助 RVO / NRVO 零拷贝优化，开销等同传引用\nstd::string getHostname() {\n    std::string host = \"cluster.internal.lan\";\n    return host;\n}\n\n// 方案2: 传入外部缓冲区引用\nvoid getHostname(std::string* out) {\n    if (out) *out = \"cluster.internal.lan\";\n}",
    "conclusion": "【工程铁律】绝不要从函数中返回指向局部非静态变量的指针或引用；按值返回结合编译器的返回值优化（RVO）兼具绝对安全性与零拷贝极致性能！"
  },
  {
    "id": "p3",
    "title": "Use-After-Free：异步事件回调触发时宿主连接已被外部提前销毁",
    "date": "2026-09-10",
    "day": 10,
    "keywords": [
      "use-after-free",
      "弱引用",
      "回调竞争",
      "tie_"
    ],
    "errorCode": "class Channel {\npublic:\n    TcpConnection* conn_{nullptr}; // 裸指针持有宿主！\n    void onRead() {\n        // 若在事件到来前，外部线程已将 conn_ 析构\n        conn_->handleMessage(); // Use-After-Free 崩溃！\n    }\n};",
    "errorSymptom": "高并发压测或客户端频繁断开重连时，服务器偶发段错误，核心转储文件（core dump）显示崩溃在已析构对象的虚函数调用或成员访问上。",
    "errorCause": "在多线程网络库中，'客户端关闭连接'与'内核检测到可读事件'在不同线程并发进行。连接对象已被析构归还内存池，但 Channel 的事件尚未从 epoll 队列中消费，裸指针解引用访问了已被回收的内存。",
    "correctCode": "class Channel {\n    std::weak_ptr<void> tie_; // 使用弱引用观察者绑定宿主\n    bool tied_{false};\npublic:\n    void tie(const std::shared_ptr<void>& obj) {\n        tie_ = obj;\n        tied_ = true;\n    }\n    void handleEventWithGuard(Timestamp receiveTime) {\n        if (tied_) {\n            std::shared_ptr<void> guard = tie_.lock(); // 原子尝试提权\n            if (guard) {\n                // 提权成功！此时 guard 强引用保证在执行回调期间对象绝对不会析构！\n                if (readCallback_) readCallback_(receiveTime);\n            }\n            // 提权失败则说明宿主已消亡，静默放弃调用，杜绝崩溃！\n        }\n    }\n};",
    "conclusion": "【工程铁律】muduo Channel::tie_ 是解决多线程异步回调生命周期竞态的工业级典范：必须用 std::weak_ptr 观察宿主并在执行前调用 lock() 提权保活！"
  },
  {
    "id": "p4",
    "title": "shared_ptr Cycle：双向 shared_ptr 循环引用导致内存永久泄漏",
    "date": "2026-09-10",
    "day": 10,
    "keywords": [
      "shared_ptr cycle",
      "循环引用",
      "内存泄漏",
      "weak_ptr"
    ],
    "errorCode": "struct NodeB;\nstruct NodeA {\n    std::shared_ptr<NodeB> b_;\n    ~NodeA() { std::cout << \"~NodeA\\n\"; }\n};\nstruct NodeB {\n    std::shared_ptr<NodeA> a_; // 危险！双向 shared_ptr\n    ~NodeB() { std::cout << \"~NodeB\\n\"; }\n};\n\nvoid testCycle() {\n    auto a = std::make_shared<NodeA>();\n    auto b = std::make_shared<NodeB>();\n    a->b_ = b;\n    b->a_ = a; // 循环引用形成！两者的 use_count() 均为 2\n} // 作用域结束：两者的引用计数均只能递减到 1，析构函数永不触发，内存永久泄漏！",
    "errorSymptom": "程序长期运行内存持续只增不减（Memory Leak），Valgrind 报告 definitely lost，但代码中没有任何裸 new 未 delete 的迹象。",
    "errorCause": "两个或多个对象通过 std::shared_ptr 形成了引用闭环环路。任何一方要析构都依赖对方先将引用归零，形成死锁闭环，导致两者的 Control Block 与对象实体均无法被释放。",
    "correctCode": "struct NodeB;\nstruct NodeA {\n    std::shared_ptr<NodeB> b_;\n    ~NodeA() { std::cout << \"~NodeA\\n\"; }\n};\nstruct NodeB {\n    std::weak_ptr<NodeA> a_; // 核心改动：将反向引用设为 weak_ptr！\n    ~NodeB() { std::cout << \"~NodeB\\n\"; }\n};\n\nvoid testCycle() {\n    auto a = std::make_shared<NodeA>();\n    auto b = std::make_shared<NodeB>();\n    a->b_ = b;\n    b->a_ = a; // weak_ptr 不增加 a 的 use_count()，a 退出时正常析构，随后带动 b 析构！\n}",
    "conclusion": "【工程铁律】双向关联或父子层次结构中，正向（父指向子）使用 std::shared_ptr 或 unique_ptr，反向（子指向父或观察者）必须使用 std::weak_ptr！"
  },
  {
    "id": "p5",
    "title": "weak_ptr Expired：未调用 lock() 检验而直接非法访问已失效弱引用",
    "date": "2026-09-10",
    "day": 10,
    "keywords": [
      "weak_ptr expired",
      "lock 提权",
      "空指针",
      "bad_weak_ptr"
    ],
    "errorCode": "std::weak_ptr<TcpConnection> wp;\nvoid onEvent() {\n    // 错误用法1：直接对 expired 的弱引用构造 shared_ptr（抛出 std::bad_weak_ptr 异常）\n    std::shared_ptr<TcpConnection> sp(wp); // 若 wp 已失效，直接抛出未捕获异常导致进程退出\n}",
    "errorSymptom": "系统抛出未捕获的 C++ 运行时异常：std::bad_weak_ptr，由于没有在顶层 try-catch，默认调用 std::terminate() 导致服务端进程挂掉。",
    "errorCause": "直接使用 std::shared_ptr<T>(weak_ptr) 构造函数时，如果 weak_ptr.expired() 为真，标准库强制抛出 std::bad_weak_ptr 异常；若多线程并发时对象已死，必然炸裂。",
    "correctCode": "std::weak_ptr<TcpConnection> wp;\nvoid onEvent() {\n    // 正确规范：必须始终使用 lock() 并进行 nullptr 校验！\n    std::shared_ptr<TcpConnection> sp = wp.lock();\n    if (sp) {\n        // 对象依然存活，安全访问\n        sp->handleRead();\n    } else {\n        // 对象已过期销毁，优雅执行降级或清理逻辑\n        LOG_INFO << \"Connection already expired, ignore event.\";\n    }\n}",
    "conclusion": "【工程铁律】访问 std::weak_ptr 唯一推荐的工业级标准方式是调用 .lock() 并立刻执行 if (ptr) 判空，绝不使用直接抛异常的构造函数！"
  },
  {
    "id": "p6",
    "title": "Iterator Invalidation：遍历 std::vector 过程中直接执行 push_back 或 erase",
    "date": "2026-09-10",
    "day": 11,
    "keywords": [
      "iterator invalidation",
      "迭代器失效",
      "vector 扩容",
      "段错误"
    ],
    "errorCode": "std::vector<int> vec = {1, 2, 3, 4, 5};\nfor (auto it = vec.begin(); it != vec.end(); ++it) {\n    if (*it == 3) {\n        vec.erase(it); // 危险！erase 会使 it 及其后所有迭代器全部失效！\n        // 下一轮循环 ++it 将作用在失效迭代器上，未定义行为！\n    }\n    if (*it == 2) {\n        vec.push_back(99); // 危险！若触发扩容重分配，整个 vector 所有迭代器全部暴毙！\n    }\n}",
    "errorSymptom": "程序循环中偶尔陷入无限死循环，或者直接崩溃报 Segmentation fault (core dumped)；Debug 模式报 iterator not incrementable。",
    "errorCause": "vector 是连续内存。erase 会将后续元素向前搬移，当前迭代器位置虽然在原处但已失效；push_back 一旦容量耗尽发生内存重新分配，原内存被整体释放，所有旧迭代器沦为野指针。",
    "correctCode": "// 方案1: 采用 erase 返回的有效新迭代器\nfor (auto it = vec.begin(); it != vec.end(); /* 注意这里不递增 */) {\n    if (*it == 3) {\n        it = vec.erase(it); // erase 返回被删除元素后面的有效迭代器！\n    } else {\n        ++it;\n    }\n}\n\n// 方案2: 批量删除直接使用标准库经典高效的 erase-remove 模式\nvec.erase(std::remove(vec.begin(), vec.end(), 3), vec.end());",
    "conclusion": "【工程铁律】在遍历连续容器（vector/deque）时切忌随意做增删；单点删除必须用 it = vec.erase(it) 接住返回值；批量条件清理坚决使用 erase-remove 惯用语！"
  },
  {
    "id": "p7",
    "title": "Moved-from State：在对象被 std::move 窃取后仍继续对其进行业务假设",
    "date": "2026-09-10",
    "day": 6,
    "keywords": [
      "moved-from",
      "std::move",
      "未定义状态",
      "悬空指针"
    ],
    "errorCode": "std::vector<std::string> lines;\nstd::string buffer = \"HTTP/1.1 200 OK\\r\\n\";\n\nlines.push_back(std::move(buffer)); // buffer 内容已被窃取转移到 vector 内部\n\n// 严重错误：认为 buffer 依然保留原有内容或特定长度\nif (buffer.length() > 0) {\n    std::cout << \"Remaining: \" << buffer[0] << std::endl; // 未定义行为！buffer 可能是空或悬挂状态\n}",
    "errorSymptom": "访问被 move 后的变量获取到空内容、垃圾数据或直接触发断言崩溃（assert failed: size > 0）。",
    "errorCause": "C++ 标准规定：被 moved-from 的对象处于'有效但未指定状态'（Valid but Unspecified State）。你可以对其安全调用析构函数或重新赋值（如 buffer = 'new'），但绝对不能假设它还保留原来的数据！",
    "correctCode": "std::vector<std::string> lines;\nstd::string buffer = \"HTTP/1.1 200 OK\\r\\n\";\n\nlines.push_back(std::move(buffer));\n// 正确规范：若后续还要复用该变量，必须显式对其进行重置或重新赋值\nbuffer.clear(); // 恢复确定状态\nbuffer = \"Content-Length: 0\\r\\n\"; // 重新赋值使用",
    "conclusion": "【工程铁律】经过 std::move 转移所有权的对象，应被视为'资源已被掏空'；除了赋予新值或调用无前置约束的方法（如 clear()），禁止继续读取旧状态！"
  },
  {
    "id": "p8",
    "title": "Lambda Dangling Reference：异步多线程中按引用捕获栈上局部变量",
    "date": "2026-09-10",
    "day": 17,
    "keywords": [
      "lambda",
      "引用捕获",
      "异步任务",
      "野指针"
    ],
    "errorCode": "void submitAsyncTask(EventLoop* loop) {\n    int localStatus = 404;\n    std::string errMsg = \"Not Found\";\n\n    // 致命错误：异步任务按引用 [&] 捕获当前函数的局部栈变量！\n    loop->queueInLoop([&]() {\n        // 当 loop 稍后在另一个线程执行此回调时，submitAsyncTask 早已返回，栈帧早已销毁！\n        std::cout << \"Status: \" << localStatus << \", Error: \" << errMsg << std::endl;\n    });\n}",
    "errorSymptom": "打印出的状态码变成负数或巨大的随机随机整型，字符串抛出 std::bad_alloc 或段错误崩溃。",
    "errorCause": "引用捕获 [&] 本质是在闭包对象内部保存局部变量的物理内存地址。调用函数退出后局部栈内存被回收，异步线程执行时访问的完全是已经无效甚至被其他函数覆盖的栈空间。",
    "correctCode": "void submitAsyncTask(EventLoop* loop) {\n    int localStatus = 404;\n    std::string errMsg = \"Not Found\";\n\n    // 正确规范1：对于基础标量按值捕获 [localStatus]，大对象通过 C++14 初始化捕获 move 进闭包\n    loop->queueInLoop([localStatus, msg = std::move(errMsg)]() {\n        std::cout << \"Status: \" << localStatus << \", Error: \" << msg << std::endl;\n    });\n}",
    "conclusion": "【工程铁律】跨线程或延迟执行的异步回调，严禁按引用 [&] 捕获栈局部变量！必须通过值捕获 [=] 或移动捕获 [x = std::move(x)] 将所有权完整移交进闭包对象内部！"
  },
  {
    "id": "p9",
    "title": "std::bind 参数错误：占位符位置偏序错位与默认值拷贝开销",
    "date": "2026-09-10",
    "day": 19,
    "keywords": [
      "std::bind",
      "占位符",
      "std::ref",
      "深拷贝"
    ],
    "errorCode": "void onMessage(int fd, const std::string& msg) { /* ... */ }\n\nstd::string bigPayload(1024 * 1024, 'X'); // 1MB 数据\n\n// 错误1: std::bind 默认按值深拷贝实参！1MB 数据在 bind 时发生昂贵的深拷贝\nauto task1 = std::bind(onMessage, 10, bigPayload); \n\n// 错误2: 占位符顺序写反\nvoid logMessage(int level, const std::string& info);\nauto task2 = std::bind(logMessage, std::placeholders::_2, std::placeholders::_1);\ntask2(1, \"system ok\"); // 导致将 1 传给了 string，将 string 传给了 int，编译报错或类型混乱！",
    "errorSymptom": "网络吞吐量急剧下降，CPU 消耗大量时间在无谓的内存分配和字符串 memcpy 上；或者编译报一长串复杂的 template deduction 错误。",
    "errorCause": "std::bind 规范要求所有传入的实参默认执行按值拷贝（Copy by Value）保存在 bind 内部的可调用结构体中；如果不加 std::ref，大对象会被强制深拷贝；占位符 _1, _2 映射的是调用新函数时的形参顺序，一旦写错会导致实参投递位置颠倒。",
    "correctCode": "// 正确1: 若不希望拷贝大对象，使用 std::cref 显式传递常量引用包装器\nauto task1 = std::bind(onMessage, 10, std::cref(bigPayload));\n\n// 正确2: 现代 C++ 中优先使用直观、类型安全、零隐式拷贝的 Lambda 表达式替代复杂的 std::bind！\nauto task2 = [fd = 10, &bigPayload]() {\n    onMessage(fd, bigPayload);\n};",
    "conclusion": "【工程铁律】使用 std::bind 传递引用实参必须显式加 std::ref / std::cref；新代码中极力推荐使用更加直观、无占位符困扰的 Lambda 表达式替代复杂的 std::bind！"
  },
  {
    "id": "p10",
    "title": "const 成员函数：只读约束被绕过与非法修改数据成员",
    "date": "2026-09-10",
    "day": 2,
    "keywords": [
      "const",
      "mutable",
      "只读安全",
      "并发竞态"
    ],
    "errorCode": "class Connection {\n    int bytesReceived_{0};\n    mutable int* hackPtr_{nullptr};\npublic:\n    // 错误设计：试图在 const 函数中强行绕过编译器检查修改成员\n    int getBytes() const {\n        // const_cast 强行去除 this 的 const 属性，埋下并发读写竞态大祸！\n        const_cast<Connection*>(this)->bytesReceived_++; \n        return bytesReceived_;\n    }\n};",
    "errorSymptom": "多个线程并发调用只读方法 getBytes() 时出现数据冲突（Data Race），计数器数值错乱，AddressSanitizer 报 ThreadSanitizer: data race。",
    "errorCause": "调用方看到接口为 const 成员函数，默认认定该函数是只读的，允许多线程并发调用而无需加锁；内部使用 const_cast 强行破除了只读约束并执行了写操作，直接摧毁了接口层面的并发安全性保证。",
    "correctCode": "class Connection {\n    std::atomic<int> bytesReceived_{0}; // 方案1: 确实需要线程安全计数的，使用原子变量或互斥锁\n    mutable MutexLock mutex_;           // 方案2: 仅对互斥锁等辅助同步原语使用 mutable 关键字\npublic:\n    int getBytes() const {\n        return bytesReceived_.load();   // 真正做到无副作用的只读保证\n    }\n};",
    "conclusion": "【工程铁律】绝不要在 const 成员函数中使用 const_cast 偷偷修改内部业务数据；除真正的同步原语（如 mutable MutexLock）外，const 函数必须保证语义与物理上的绝对只读自洽！"
  },
  {
    "id": "p11",
    "title": "虚析构缺失：通过基类指针 delete 派生类导致派生类资源严重泄漏",
    "date": "2026-09-10",
    "day": 26,
    "keywords": [
      "虚析构",
      "virtual",
      "多态泄漏",
      "Poller"
    ],
    "errorCode": "class Poller {\npublic:\n    // 致命错误：基类析构函数未声明为 virtual！\n    ~Poller() { std::cout << \"~Poller()\\n\"; }\n};\n\nclass EPollPoller : public Poller {\nprivate:\n    int epollfd_;\n    char* bigBuffer_;\npublic:\n    EPollPoller() : epollfd_(::epoll_create1(0)), bigBuffer_(new char[65536]) {}\n    ~EPollPoller() {\n        ::close(epollfd_);\n        delete[] bigBuffer_;\n        std::cout << \"~EPollPoller() 释放句柄与内存\\n\";\n    }\n};\n\nvoid run() {\n    Poller* p = new EPollPoller();\n    delete p; // 灾难！只会调用 ~Poller()，~EPollPoller() 被完全跳过！\n}",
    "errorSymptom": "每销毁一个多态子类对象，系统的文件描述符数量和堆内存占用就持续飙升，最终导致句柄耗尽崩溃，且派生类的析构日志从未被打印。",
    "errorCause": "基类析构函数为非虚函数，delete p 触发的是静态绑定，编译器根据指针静态类型 Poller* 仅调用 ~Poller()；派生类特有的 ~EPollPoller() 根本没有被寻址调用，其持有的 epollfd 与堆缓冲区彻底泄漏。",
    "correctCode": "class Poller {\npublic:\n    // 正确规范：凡是含有虚函数作为多态基类的类，其析构函数必须显式声明为 virtual！\n    virtual ~Poller() = default;\n};\n\nclass EPollPoller : public Poller {\npublic:\n    ~EPollPoller() override {\n        ::close(epollfd_);\n        delete[] bigBuffer_;\n    }\n};",
    "conclusion": "【工程铁律】凡是作为多态基类的类，其析构函数必须声明为 virtual ~Base() = default；muduo::Poller::~Poller() 严格遵循此规则！"
  },
  {
    "id": "p12",
    "title": "delete 与 delete[] 混用：动态数组释放未配对引发堆控制块损坏",
    "date": "2026-09-10",
    "day": 4,
    "keywords": [
      "delete[]",
      "new[]",
      "堆破坏",
      "未定义行为"
    ],
    "errorCode": "void processBuffer() {\n    int* arr = new int[1024];\n    // ... 使用数组 ...\n    delete arr; // 致命错误！new[] 应该使用 delete[] 配对，这里混用了标量 delete！\n}",
    "errorSymptom": "程序在简单内置类型下可能看似正常运行，但在复杂对象类型下直接发生段错误崩溃，或者在后续某个毫无关联的 new 语句处报 malloc(): corrupted top size 崩溃！",
    "errorCause": "new[] 会在分配的内存头部预留空间记录数组长度或元数据，用于 delete[] 时按顺序逐一调用每个元素的析构函数；混用标量 delete 会让堆管理器解析错误的内存偏移，直接破坏 glibc 的堆内存管理结构元数据。",
    "correctCode": "// 方案1: 严格遵循语法配对：new 对应 delete，new[] 对应 delete[]\nvoid processBuffer() {\n    int* arr = new int[1024];\n    delete[] arr; // 正确使用 delete[]\n}\n\n// 方案2: 现代 C++ 工业界唯一标准实践：彻底告别裸 new/delete，拥抱标准容器或智能指针！\nvoid processBufferModern() {\n    std::vector<int> arr(1024); // 自动由 vector RAII 释放，零泄漏零错误风险\n}",
    "conclusion": "【工程铁律】严禁混用 new 与 delete[]、new[] 与 delete！在现代 C++ 网络工程中，除底层极其特殊的极端内存池外，上层一律禁止手动裸调用 new[]/delete[]，统一使用 std::vector 或 unique_ptr<T[]>！"
  }
];


// ==================== muduo V5 CLIENT RUNTIME ====================


window.MAPPING_MATRIX = MAPPING_MATRIX;
window.SOURCE_ROADMAP = SOURCE_ROADMAP;
window.PITFALLS_DATASET = PITFALLS_DATASET;

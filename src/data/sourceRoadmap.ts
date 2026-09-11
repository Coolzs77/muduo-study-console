export const SOURCE_ROADMAP: any = [
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

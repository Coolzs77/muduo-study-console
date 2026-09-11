export const MAPPING_MATRIX: any = [
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

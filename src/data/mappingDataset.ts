import { CppSyntaxMapping } from "../types/index";

export const CPP_SYNTAX_MAPPINGS: CppSyntaxMapping[] = [
  {
    feature: "RAII 资源获取即初始化",
    cppStandard: "C++11",
    muduoFile: "muduo/base/Mutex.h",
    muduoClassOrFunction: "MutexLockGuard",
    designRationale: "通过栈对象生命周期管理互斥锁的 lock 与 unlock，彻底消除由于分支异常返回导致的死锁问题。",
    coreCode: "class MutexLockGuard : noncopyable {\n public:\n  explicit MutexLockGuard(MutexLock& mutex) : mutex_(mutex) { mutex_.lock(); }\n  ~MutexLockGuard() { mutex_.unlock(); }\n private:\n  MutexLock& mutex_;\n};",
    aiServiceMapping: "RAII 数据库连接守卫 DatabaseConnectionGuard"
  },
  {
    feature: "移动语义与完美转发",
    cppStandard: "C++11",
    muduoFile: "muduo/net/Buffer.h",
    muduoClassOrFunction: "Buffer::retrieveAllAsString()",
    designRationale: "避免深拷贝，通过 std::move 将缓冲区内部堆数据直接移动至目标 std::string，实现零拷贝数据转交。",
    coreCode: "string retrieveAllAsString() {\n  return retrieveAsString(readableBytes());\n}\nstring retrieveAsString(size_t len) {\n  string result(peek(), len);\n  retrieve(len);\n  return result; // NRVO 或 std::move\n}",
    aiServiceMapping: "HTTP 响应体流式分发与 JSON 报文零拷贝转发"
  },
  {
    feature: "智能指针与弱引用破环",
    cppStandard: "C++11",
    muduoFile: "muduo/net/Channel.h",
    muduoClassOrFunction: "Channel::tie_",
    designRationale: "使用 std::weak_ptr<void> tie_ 弱引用观察 TcpConnection，回调时通过 lock() 提升以保证生命周期，断开后安全析构。",
    coreCode: "void Channel::tie(const std::shared_ptr<void>& obj) {\n  tie_ = obj;\n  tied_ = true;\n}\nvoid Channel::handleEvent(Timestamp receiveTime) {\n  std::shared_ptr<void> guard;\n  if (tied_) {\n    guard = tie_.lock();\n    if (guard) { handleEventWithGuard(receiveTime); }\n  } else { handleEventWithGuard(receiveTime); }\n}",
    aiServiceMapping: "长连接会话 Session 与异步上下文的生命周期保护"
  },
  {
    feature: "std::function 与 std::bind 基于对象架构",
    cppStandard: "C++11",
    muduoFile: "muduo/net/Callbacks.h",
    muduoClassOrFunction: "TcpConnection::setMessageCallback()",
    designRationale: "全面代替传统虚函数多态继承体系，消除虚表开销，解耦事件循环与业务逻辑回调。",
    coreCode: "typedef std::function<void (const TcpConnectionPtr&, Buffer*, Timestamp)> MessageCallback;\nvoid setMessageCallback(const MessageCallback& cb) { messageCallback_ = cb; }",
    aiServiceMapping: "Router 路由表与 Middleware 拦截器洋葱模型回调"
  },
  {
    feature: "非阻塞 epoll 与边缘触发",
    cppStandard: "Linux OS",
    muduoFile: "muduo/net/poller/EPollPoller.cc",
    muduoClassOrFunction: "EPollPoller::poll()",
    designRationale: "红黑树管理百万连接，就绪双向链表 O(1) 拷贝，支持 Reactor 事件驱动调度。",
    coreCode: "int numEvents = ::epoll_wait(epollfd_, &*events_.begin(), static_cast<int>(events_.size()), timeoutMs);",
    aiServiceMapping: "自研 HttpServer 主从 Reactor 网关底层分发器"
  }
];

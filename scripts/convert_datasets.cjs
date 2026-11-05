const fs = require('fs');
const path = require('path');

// 1. Convert js/dataset-yuque.js -> src/data/yuqueDataset.ts
let yuqueCode = fs.readFileSync(path.join(__dirname, '../js/dataset-yuque.js'), 'utf8');
yuqueCode = 'import { YuqueArticle } from "../types";\n\n' + yuqueCode.replace(/var YUQUE_DATASET = /, 'export const YUQUE_DATASET: YuqueArticle[] = ');
fs.mkdirSync(path.join(__dirname, '../src/data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../src/data/yuqueDataset.ts'), yuqueCode, 'utf8');
console.log('✓ Converted yuqueDataset.ts, size:', fs.statSync(path.join(__dirname, '../src/data/yuqueDataset.ts')).size);

// 2. Convert js/dataset-learning.js -> src/data/algoDataset.ts
let algoCode = fs.readFileSync(path.join(__dirname, '../js/dataset-learning.js'), 'utf8');
const algoMatch = algoCode.match(/var ALGORITHM_LAB_CATALOG = (\[[\s\S]*?\]);/);
if (algoMatch) {
  const algoTs = 'import { AlgoProblem } from "../types";\n\nexport const ALGORITHM_LAB_CATALOG: AlgoProblem[] = ' + algoMatch[1] + ';\n';
  fs.writeFileSync(path.join(__dirname, '../src/data/algoDataset.ts'), algoTs, 'utf8');
  console.log('✓ Converted algoDataset.ts, size:', fs.statSync(path.join(__dirname, '../src/data/algoDataset.ts')).size);
} else {
  console.error('Failed to match ALGORITHM_LAB_CATALOG in dataset-learning.js');
}

// 3. Convert tasks
const tasksTs = `import { DailyTask } from "../types";

export const DEFAULT_ROUTINE_TASKS: DailyTask[] = [
  {
    id: "task_algo",
    title: "算法",
    category: "算法",
    estimatedMinutes: 60,
    priority: "S",
    completed: false,
    focusPoint: "Hot 100 / 代码随想录盲打手写，15 分钟无思路查卡，手写 AC",
    linkTab: "algo"
  },
  {
    id: "task_project",
    title: "项目",
    category: "项目",
    estimatedMinutes: 90,
    priority: "S",
    completed: false,
    focusPoint: "完成 CppAIService 核心模块开发与真实压测",
    linkTab: "reader"
  },
  {
    id: "task_agent",
    title: "Agent",
    category: "AI",
    estimatedMinutes: 30,
    priority: "A",
    completed: false,
    focusPoint: "阅读 MCP 规范与两段式 Tool Call 架构落地",
    linkTab: "reader"
  },
  {
    id: "task_interview",
    title: "牛客",
    category: "求职",
    estimatedMinutes: 45,
    priority: "A",
    completed: false,
    focusPoint: "刷最新大厂 C++ 真实面经与 TCP/Linux 底层八股"
  }
];
`;
fs.writeFileSync(path.join(__dirname, '../src/data/tasksDataset.ts'), tasksTs, 'utf8');
console.log('✓ Created tasksDataset.ts');

// 4. Extract C++ mappings from js/dataset-mappings.js or dataset-learning.js
let mappingCode = '';
if (fs.existsSync(path.join(__dirname, '../js/dataset-mappings.js'))) {
  mappingCode = fs.readFileSync(path.join(__dirname, '../js/dataset-mappings.js'), 'utf8');
}
const mappingMatch = mappingCode.match(/var CPP_SYNTAX_MAPPINGS = (\[[\s\S]*?\]);/);
let mappingsTs = '';
if (mappingMatch) {
  mappingsTs = 'import { CppSyntaxMapping } from "../types";\n\nexport const CPP_SYNTAX_MAPPINGS: CppSyntaxMapping[] = ' + mappingMatch[1] + ';\n';
} else {
  // Fallback default mappings
  mappingsTs = `import { CppSyntaxMapping } from "../types";

export const CPP_SYNTAX_MAPPINGS: CppSyntaxMapping[] = [
  {
    feature: "RAII 资源获取即初始化",
    cppStandard: "C++11",
    muduoFile: "muduo/base/Mutex.h",
    muduoClassOrFunction: "MutexLockGuard",
    designRationale: "通过栈对象生命周期管理互斥锁的 lock 与 unlock，彻底消除由于分支异常返回导致的死锁问题。",
    coreCode: "class MutexLockGuard : noncopyable {\\n public:\\n  explicit MutexLockGuard(MutexLock& mutex) : mutex_(mutex) { mutex_.lock(); }\\n  ~MutexLockGuard() { mutex_.unlock(); }\\n private:\\n  MutexLock& mutex_;\\n};",
    aiServiceMapping: "RAII 数据库连接守卫 DatabaseConnectionGuard"
  },
  {
    feature: "移动语义与完美转发",
    cppStandard: "C++11",
    muduoFile: "muduo/net/Buffer.h",
    muduoClassOrFunction: "Buffer::retrieveAllAsString()",
    designRationale: "避免深拷贝，通过 std::move 将缓冲区内部堆数据直接移动至目标 std::string，实现零拷贝数据转交。",
    coreCode: "string retrieveAllAsString() {\\n  return retrieveAsString(readableBytes());\\n}\\nstring retrieveAsString(size_t len) {\\n  string result(peek(), len);\\n  retrieve(len);\\n  return result; // NRVO 或 std::move\\n}",
    aiServiceMapping: "HTTP 响应体流式分发与 JSON 报文零拷贝转发"
  },
  {
    feature: "智能指针与弱引用破环",
    cppStandard: "C++11",
    muduoFile: "muduo/net/Channel.h",
    muduoClassOrFunction: "Channel::tie_",
    designRationale: "使用 std::weak_ptr<void> tie_ 弱引用观察 TcpConnection，回调时通过 lock() 提升以保证生命周期，断开后安全析构。",
    coreCode: "void Channel::tie(const std::shared_ptr<void>& obj) {\\n  tie_ = obj;\\n  tied_ = true;\\n}\\nvoid Channel::handleEvent(Timestamp receiveTime) {\\n  std::shared_ptr<void> guard;\\n  if (tied_) {\\n    guard = tie_.lock();\\n    if (guard) { handleEventWithGuard(receiveTime); }\\n  } else { handleEventWithGuard(receiveTime); }\\n}",
    aiServiceMapping: "长连接会话 Session 与异步上下文的生命周期保护"
  },
  {
    feature: "std::function 与 std::bind 基于对象架构",
    cppStandard: "C++11",
    muduoFile: "muduo/net/Callbacks.h",
    muduoClassOrFunction: "TcpConnection::setMessageCallback()",
    designRationale: "全面代替传统虚函数多态继承体系，消除虚表开销，解耦事件循环与业务逻辑回调。",
    coreCode: "typedef std::function<void (const TcpConnectionPtr&, Buffer*, Timestamp)> MessageCallback;\\nvoid setMessageCallback(const MessageCallback& cb) { messageCallback_ = cb; }",
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
`;
}
fs.writeFileSync(path.join(__dirname, '../src/data/mappingDataset.ts'), mappingsTs, 'utf8');
console.log('✓ Created mappingDataset.ts');
console.log('All datasets successfully generated in src/data/ !');

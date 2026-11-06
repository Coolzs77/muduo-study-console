import { PitfallItem } from "../types";

export const PITFALLS_DATASET: PitfallItem[] = [
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
    "errorSymptom": "程序在退出局部代码块时崩溃，控制台输出：free(): double free detected in tcache 2，进程被操作系统终止。",
    "errorCause": "编译器合成的默认拷贝构造函数仅复制指针变量本身的地址值，两个独立的栈对象持有同一块堆内存。析构时导致同一堆地址被二次释放，破坏堆分配器的内部链表结构。",
    "correctCode": "class SafeBuffer {\nprivate:\n    std::unique_ptr<char[]> data_; // 方案1: 采用独占智能指针管理生命周期\n    size_t size_;\npublic:\n    SafeBuffer(size_t s) : data_(std::make_unique<char[]>(s)), size_(s) {}\n    // 方案2: 显式禁用拷贝并支持移动语义\n    SafeBuffer(const SafeBuffer&) = delete;\n    SafeBuffer& operator=(const SafeBuffer&) = delete;\n    SafeBuffer(SafeBuffer&&) noexcept = default;\n};",
    "conclusion": "规范要点：管理独占资源的类应实现深拷贝或显式禁用拷贝（=delete）并采用 unique_ptr 管理生命周期，避免默认浅拷贝导致指针重复释放。"
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
    "errorCode": "const std::string& getHostname() {\n    std::string host = \"cluster.internal.lan\";\n    return host; // 危险：返回局部栈变量的引用\n}\n\nvoid useHost() {\n    const std::string& r = getHostname();\n    // 此时 host 所在的栈帧已被销毁\n    std::cout << r << std::endl; // 未定义行为：访问已失效栈空间\n}",
    "errorSymptom": "打印出的字符串内容异常或为空串；开启编译优化后发生段错误崩溃（SIGSEGV）；内存检查工具报告无效读取。",
    "errorCause": "局部变量 host 分配在当前函数的栈帧上。函数返回后该栈帧被回收，返回的引用指向已失效的内存空间，后续函数调用会覆盖该区域。",
    "correctCode": "// 方案1: 直接按值返回，利用编译器 RVO / NRVO 优化\nstd::string getHostname() {\n    std::string host = \"cluster.internal.lan\";\n    return host;\n}\n\n// 方案2: 传入外部缓冲区指针\nvoid getHostname(std::string* out) {\n    if (out) *out = \"cluster.internal.lan\";\n}",
    "conclusion": "规范要点：不得从函数中返回指向局部自动变量的指针或引用；按值返回借助编译器返回值优化（RVO）可避免对象拷贝。"
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
    "errorCode": "class Channel {\npublic:\n    TcpConnection* conn_{nullptr}; // 裸指针持有宿主\n    void onRead() {\n        // 若在事件就绪前外部线程已将 conn_ 析构\n        conn_->handleMessage(); // Use-After-Free\n    }\n};",
    "errorSymptom": "并发运行或客户端断开重连时发生段错误，核心转储文件显示崩溃在已析构对象的成员访问上。",
    "errorCause": "在多线程网络库中，连接关闭与事件通知分属不同线程。连接对象析构后，Channel 中尚未消费的就绪事件若直接通过裸指针解引用，将访问已被回收的内存区域。",
    "correctCode": "class Channel {\n    std::weak_ptr<void> tie_; // 使用弱引用观察宿主生命周期\n    bool tied_{false};\npublic:\n    void tie(const std::shared_ptr<void>& obj) {\n        tie_ = obj;\n        tied_ = true;\n    }\n    void handleEventWithGuard(Timestamp receiveTime) {\n        if (tied_) {\n            std::shared_ptr<void> guard = tie_.lock(); // 原子尝试提权\n            if (guard) {\n                // 提权成功：guard 保证回调执行期间对象有效\n                if (readCallback_) readCallback_(receiveTime);\n            }\n            // 提权失败：宿主已销毁，放弃调用\n        }\n    }\n};",
    "conclusion": "规范要点：Channel::tie_ 通过 std::weak_ptr 观察宿主生命周期，在执行异步回调前通过 lock() 尝试获取 shared_ptr，避免访问已析构对象。"
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
    "errorCode": "struct NodeB;\nstruct NodeA {\n    std::shared_ptr<NodeB> b_;\n    ~NodeA() { std::cout << \"~NodeA\\n\"; }\n};\nstruct NodeB {\n    std::shared_ptr<NodeA> a_; // 双向 shared_ptr\n    ~NodeB() { std::cout << \"~NodeB\\n\"; }\n};\n\nvoid testCycle() {\n    auto a = std::make_shared<NodeA>();\n    auto b = std::make_shared<NodeB>();\n    a->b_ = b;\n    b->a_ = a; // 循环引用形成，引用计数均为 2\n} // 作用域结束：引用计数递减为 1，析构函数未执行，内存未被回收",
    "errorSymptom": "程序长时间运行内存持续上升，内存检查工具报告 definitely lost，但代码中没有未释放的裸 new 操作。",
    "errorCause": "两个或多个对象通过 std::shared_ptr 形成了循环引用。任一对象析构均依赖对方引用计数清零，导致控制块与对象内存均无法被释放。",
    "correctCode": "struct NodeB;\nstruct NodeA {\n    std::shared_ptr<NodeB> b_;\n    ~NodeA() { std::cout << \"~NodeA\\n\"; }\n};\nstruct NodeB {\n    std::weak_ptr<NodeA> a_; // 将反向引用改为 weak_ptr\n    ~NodeB() { std::cout << \"~NodeB\\n\"; }\n};\n\nvoid testCycle() {\n    auto a = std::make_shared<NodeA>();\n    auto b = std::make_shared<NodeB>();\n    a->b_ = b;\n    b->a_ = a; // weak_ptr 不增加引用计数，退出时正常析构\n}",
    "conclusion": "规范要点：双向关联或父子层次结构中，正向引用使用 std::shared_ptr 或 unique_ptr，反向引用使用 std::weak_ptr 避免循环引用。"
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
    "errorCode": "std::weak_ptr<TcpConnection> wp;\nvoid onEvent() {\n    // 错误用法：直接对 expired 的弱引用构造 shared_ptr\n    std::shared_ptr<TcpConnection> sp(wp); // 若 wp 已失效，抛出 std::bad_weak_ptr 异常\n}",
    "errorSymptom": "系统抛出未捕获的 std::bad_weak_ptr 异常，进程被操作系统终止。",
    "errorCause": "使用 std::shared_ptr<T>(weak_ptr) 构造函数时，如果 weak_ptr 已失效，标准库会抛出 std::bad_weak_ptr 异常。",
    "correctCode": "std::weak_ptr<TcpConnection> wp;\nvoid onEvent() {\n    // 正确用法：使用 lock() 并执行 nullptr 校验\n    std::shared_ptr<TcpConnection> sp = wp.lock();\n    if (sp) {\n        // 对象依然存活，安全访问\n        sp->handleRead();\n    } else {\n        // 对象已释放，执行忽略或清理逻辑\n        LOG_INFO << \"Connection already expired, ignore event.\";\n    }\n}",
    "conclusion": "规范要点：访问 std::weak_ptr 应当调用 .lock() 并进行判空检查，避免直接使用可能抛出 std::bad_weak_ptr 的构造函数。"
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
    "errorCode": "std::vector<int> vec = {1, 2, 3, 4, 5};\nfor (auto it = vec.begin(); it != vec.end(); ++it) {\n    if (*it == 3) {\n        vec.erase(it); // erase 会使当前及后续迭代器全部失效\n    }\n    if (*it == 2) {\n        vec.push_back(99); // 若触发内存重新分配，全部迭代器失效\n    }\n}",
    "errorSymptom": "循环过程中陷入死循环或发生段错误崩溃（SIGSEGV）；调试模式报告迭代器不可自增。",
    "errorCause": "vector 基于连续内存组织。erase 会将后续元素向前移动，原迭代器位置失效；push_back 触发重新分配时，原内存区域被释放，所有旧迭代器失效。",
    "correctCode": "// 方案1: 使用 erase 返回的有效新迭代器\nfor (auto it = vec.begin(); it != vec.end(); /* 由循环体控制递增 */) {\n    if (*it == 3) {\n        it = vec.erase(it);\n    } else {\n        ++it;\n    }\n}\n\n// 方案2: 批量删除使用 erase-remove 惯用模式\nvec.erase(std::remove(vec.begin(), vec.end(), 3), vec.end());",
    "conclusion": "规范要点：遍历 vector 等连续容器时，单元素删除应使用 it = vec.erase(it) 更新迭代器；条件删除使用 erase-remove 模式。"
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
    "errorCode": "std::vector<std::string> lines;\nstd::string buffer = \"HTTP/1.1 200 OK\\r\\n\";\n\nlines.push_back(std::move(buffer)); // buffer 内容已移交至 vector 内部\n\n// 错误假设：认为 buffer 依然保留原有内容或特定长度\nif (buffer.length() > 0) {\n    std::cout << \"Remaining: \" << buffer[0] << std::endl;\n}",
    "errorSymptom": "访问移动后的变量获取到空内容、垃圾数据或触发断言失败。",
    "errorCause": "C++ 标准规定：移动后的对象处于有效但未指定状态（Valid but Unspecified State）。可对其安全调用析构函数或重新赋值，但不应假设其保留原有数据。",
    "correctCode": "std::vector<std::string> lines;\nstd::string buffer = \"HTTP/1.1 200 OK\\r\\n\";\n\nlines.push_back(std::move(buffer));\n// 若后续需要复用，必须显式重置或赋予新值\nbuffer.clear();\nbuffer = \"Content-Length: 0\\r\\n\";",
    "conclusion": "规范要点：经 std::move 转移资源的对象处于有效但未指定状态，在重新赋值或重置前不应继续读取其原有内容。"
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
    "errorCode": "void submitAsyncTask(EventLoop* loop) {\n    int localStatus = 404;\n    std::string errMsg = \"Not Found\";\n\n    // 错误：异步任务按引用 [&] 捕获当前函数的局部栈变量\n    loop->queueInLoop([&]() {\n        // 当任务在另一个线程执行时，submitAsyncTask 已返回，栈帧已销毁\n        std::cout << \"Status: \" << localStatus << \", Error: \" << errMsg << std::endl;\n    });\n}",
    "errorSymptom": "打印出的状态值异常或随机，字符串访问抛出 std::bad_alloc 或段错误。",
    "errorCause": "引用捕获保存的是局部变量的内存地址。函数返回后栈帧被回收，异步线程执行时访问已无效的内存空间。",
    "correctCode": "void submitAsyncTask(EventLoop* loop) {\n    int localStatus = 404;\n    std::string errMsg = \"Not Found\";\n\n    // 正确规范：标量按值捕获，复合对象使用初始化捕获移动所有权\n    loop->queueInLoop([localStatus, msg = std::move(errMsg)]() {\n        std::cout << \"Status: \" << localStatus << \", Error: \" << msg << std::endl;\n    });\n}",
    "conclusion": "规范要点：跨线程或异步执行的闭包不得按引用捕获栈上局部变量，应通过值捕获或移动捕获将数据完整转移至闭包对象。"
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
    "errorCode": "void onMessage(int fd, const std::string& msg) { /* ... */ }\n\nstd::string bigPayload(1024 * 1024, 'X'); // 1MB 数据\n\n// 错误1: std::bind 默认按值拷贝实参，造成额外拷贝开销\nauto task1 = std::bind(onMessage, 10, bigPayload); \n\n// 错误2: 占位符顺序写反\nvoid logMessage(int level, const std::string& info);\nauto task2 = std::bind(logMessage, std::placeholders::_2, std::placeholders::_1);\ntask2(1, \"system ok\"); // 实参与形参类型不匹配",
    "errorSymptom": "高频调用下内存分配与拷贝开销增大；或者由于实参和形参类型不匹配导致模板推导编译错误。",
    "errorCause": "std::bind 规范要求实参默认按值拷贝保存；若不使用 std::ref，大对象会发生完整复制；占位符 _1, _2 映射的是调用新函数时的形参顺序，顺序写反会导致参数位置颠倒。",
    "correctCode": "// 方案1: 使用 std::cref 显式传递常量引用\nauto task1 = std::bind(onMessage, 10, std::cref(bigPayload));\n\n// 方案2: 优先使用类型明确、无额外隐式开销的 Lambda 表达式\nauto task2 = [fd = 10, &bigPayload]() {\n    onMessage(fd, bigPayload);\n};",
    "conclusion": "规范要点：使用 std::bind 传递引用参数时须显式使用 std::ref / std::cref；推荐优先使用 Lambda 表达式实现回调绑定。"
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
    "errorCode": "class Connection {\n    int bytesReceived_{0};\n    mutable int* hackPtr_{nullptr};\npublic:\n    // 错误设计：在 const 函数中去除 const 属性并修改成员\n    int getBytes() const {\n        const_cast<Connection*>(this)->bytesReceived_++; \n        return bytesReceived_;\n    }\n};",
    "errorSymptom": "多个线程并发调用只读方法 getBytes() 时出现数据竞争（Data Race），计数器数值错乱，线程检查工具报警。",
    "errorCause": "调用方根据接口 const 修饰假定该函数是无副作用的并发只读操作；内部通过 const_cast 移除了只读约束并写入数据，破坏了并发安全假定。",
    "correctCode": "class Connection {\n    std::atomic<int> bytesReceived_{0}; // 方案1: 需要计数的字段使用原子类型\n    mutable MutexLock mutex_;           // 方案2: 仅同步原语可标记为 mutable\npublic:\n    int getBytes() const {\n        return bytesReceived_.load();   // 保证无副作用的只读语义\n    }\n};",
    "conclusion": "规范要点：const 成员函数应保证只读语义，避免使用 const_cast 修改内部业务数据；除线程同步原语外不应将数据成员标记为 mutable。"
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
    "errorCode": "class Poller {\npublic:\n    // 错误：基类析构函数未声明为 virtual\n    ~Poller() { std::cout << \"~Poller()\\n\"; }\n};\n\nclass EPollPoller : public Poller {\nprivate:\n    int epollfd_;\n    char* bigBuffer_;\npublic:\n    EPollPoller() : epollfd_(::epoll_create1(0)), bigBuffer_(new char[65536]) {}\n    ~EPollPoller() {\n        ::close(epollfd_);\n        delete[] bigBuffer_;\n    }\n};\n\nvoid run() {\n    Poller* p = new EPollPoller();\n    delete p; // 静态绑定仅调用 ~Poller()，~EPollPoller() 被跳过\n}",
    "errorSymptom": "每销毁一个多态子类对象，系统的文件描述符数量和堆内存占用持续上升，派生类的析构逻辑未被执行。",
    "errorCause": "基类析构函数非虚，通过基类指针 delete 对象时执行静态绑定，仅调用基类析构函数；派生类特有的析构函数未被调用，导致派生类资源泄漏。",
    "correctCode": "class Poller {\npublic:\n    // 正确规范：作为多态基类的类，其析构函数必须显式声明为 virtual\n    virtual ~Poller() = default;\n};\n\nclass EPollPoller : public Poller {\npublic:\n    ~EPollPoller() override {\n        ::close(epollfd_);\n        delete[] bigBuffer_;\n    }\n};",
    "conclusion": "规范要点：含虚函数的基类必须将析构函数声明为 virtual ~Base() = default，确保派生类资源正确释放。"
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
    "errorCode": "void processBuffer() {\n    int* arr = new int[1024];\n    // ... 使用数组 ...\n    delete arr; // 错误：new[] 分配的数组混用了标量 delete\n}",
    "errorSymptom": "在复杂对象数组场景下发生段错误，或在后续的堆分配操作中报 malloc(): corrupted top size 崩溃。",
    "errorCause": "new[] 在分配内存时可能记录数组长度信息以供析构调用；混用标量 delete 导致释放偏移错误，破坏堆管理器的内部结构。",
    "correctCode": "// 方案1: 严格配对：new 对应 delete，new[] 对应 delete[]\nvoid processBuffer() {\n    int* arr = new int[1024];\n    delete[] arr;\n}\n\n// 方案2: 使用标准容器管理动态数组\nvoid processBufferModern() {\n    std::vector<int> arr(1024);\n}",
    "conclusion": "规范要点：动态数组分配须严格匹配 new[] 与 delete[]；优先使用 std::vector 或 std::unique_ptr<T[]> 管理动态内存。"
  },
  {
    "id": "pit_enable_shared_from_this",
    "title": "在构造函数中调用 shared_from_this() 导致 bad_weak_ptr 崩溃",
    "date": "2026-09-15",
    "day": 15,
    "keywords": [
      "CppAIService"
    ],
    "errorCode": "// 见踩坑解析",
    "errorSymptom": "程序在启动或创建 TcpConnection 时触发 std::bad_weak_ptr 抛出异常崩溃退出。",
    "errorCause": "",
    "correctCode": "// 见修复方案",
    "conclusion": "",
    "category": "Memory"
  },
  {
    "id": "pit_reactor_blocking_mq",
    "title": "在事件循环线程中执行同步阻塞调用导致事件循环阻塞",
    "date": "2026-09-15",
    "day": 15,
    "keywords": [
      "CppAIService"
    ],
    "errorCode": "// 见踩坑解析",
    "errorSymptom": "当某连接的回调函数中执行耗时网络请求或数据库写入时，分配到同一事件循环线程的其他连接均无法及时响应事件。",
    "errorCause": "",
    "correctCode": "// 见修复方案",
    "conclusion": "",
    "category": "Concurrency"
  },
  {
    "id": "pit_mcp_json_deadlock",
    "title": "MCP 工具调用未捕获异常导致会话状态未正确重置",
    "date": "2026-09-15",
    "day": 15,
    "keywords": [
      "CppAIService"
    ],
    "errorCode": "// 见踩坑解析",
    "errorSymptom": "当本地工具函数执行失败或超时未处理时，请求未生成回包，后续请求因会话状态处于非空闲态而被拒绝。",
    "errorCause": "",
    "correctCode": "// 见修复方案",
    "conclusion": "",
    "category": "AI"
  },
  {
    "id": "pit_double_buffering_drop",
    "title": "异步日志系统在写入速率超过磁盘 I/O 时内存持续增长",
    "date": "2026-09-15",
    "day": 15,
    "keywords": [
      "CppAIService"
    ],
    "errorCode": "// 见踩坑解析",
    "errorSymptom": "持续高负载日志写入下，未落盘缓冲区持续积压，进程内存占用超出系统限制并被终止。",
    "errorCause": "",
    "correctCode": "// 见修复方案",
    "conclusion": "",
    "category": "Infrastructure"
  }
];

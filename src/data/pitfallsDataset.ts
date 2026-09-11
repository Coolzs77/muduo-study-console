export const PITFALLS_DATASET: any = [
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

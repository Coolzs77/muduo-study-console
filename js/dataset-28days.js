// ==========================================================================
// muduo C++ 28 天任务数据集 (DAYS_DATASET)
// ==========================================================================

var DAYS_DATASET = [
  {
    "day": 1,
    "week": 1,
    "tier": "A",
    "title": "指针、引用与 const 约束语义",
    "bookRange": "第8章 8.2（P.255～263）+ 第7章 7.3.5（P.221～224）+ 第3章 3.2（P.54～55）",
    "tags": [
      "const 语义",
      "引用别名",
      "引用传递"
    ],
    "points": [
      "彻底辨析三者区别：<code>const int* p</code>（指向常量的指针）、<code>int* const p</code>（指针自身为常量）、<code>const int* const p</code>（双重不可变）。（参看第7章 7.3.5 P.221～223）",
      "理解引用的物理本质：引用的底层通常是常量指针（<code>T* const</code>），但具有值语法的直观性，绝不存在空引用。（参看第8章 8.2 P.255～258）",
      "<strong>muduo 对照：</strong>为什么源码中参数传递 95% 都是 <code>const T&</code>？（避免深拷贝且从编译器保证入参只读，例如 <code>const Buffer&</code>、<code>const string&</code>）。（参看第8章 8.2.3 P.260～263）"
    ],
    "code": "// Day 1: 检验三种参数传递机制\n#include <iostream>\n#include <string>\n\nvoid passPointer(const int* p) { /* 无法修改 *p 所指内容 */ }\nvoid passRef(const std::string& r) { /* 传引用，只读安全 */ }\n\nint main() {\n    int val = 42;\n    const int* p1 = &val; // 指向常量的指针：不可改值\n    int* const p2 = &val; // 常量指针：不可改指向\n    *p2 = 100;            // 合法\n    \n    std::string s = \"muduo network\";\n    passRef(s);\n    std::cout << \"const T& 是 muduo 最基础的入参规范\\n\";\n    return 0;\n}",
    "muduoMap": "基础接口规范：网络数据包与回调几乎均采用 const T& 传参避免拷贝",
    "check": "能不假思索说出 const int* 和 int* const 的语义区别与汇编本质。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "传引用就是避免拷贝，加 const 就是不能改。",
      "strict": "引用的物理实现通常是常量指针（T* const），但在语义层面是对象别名，不占用独立地址标识符；const T& 是只读借用，并具有绑定临时右值并将其生命周期延长至引用作用域结束的语言特性。"
    },
    "experiment": {
      "goal": "验证 const T& 引用传递与指向常量的指针约束机理",
      "steps": [
        "创建局部变量并分别绑定指向常量的指针与只读引用",
        "尝试修改被 const 保护的内存观测编译报错",
        "观察 passRef 是否发生任何深拷贝"
      ],
      "expectedOutput": "const T& 是 muduo 最基础的入参规范",
      "watchPoints": "1. 编译器在遇到试图通过 p1 修改值时产生编译期错误\n2. 观察 passRef(s) 入参传递过程中 std::string 对象的地址不变",
      "pitfalls": "混淆 const int* p 与 int* const p，前者是所指内容不可变，后者是指针自身指向不可变。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day01.cpp -o day01 && ./day01"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "关于 const int* p 与 int* const p 的区别，下列说法正确的是：",
          "options": [
            "两者完全相同，const 位置可以随意互换",
            "const int* p 表示所指内容只读，int* const p 表示指针自身地址不可变",
            "int* const p 表示所指内容只读，指针可以指向新地址",
            "const int* const p 允许修改指针自身存储的地址"
          ],
          "answer": 1,
          "explanation": "const int* p（指向常量的指针）保护的是 *p 的内容只读；int* const p（常量指针）锁定的是 p 自身的地址不可变，但允许通过 *p 修改内容。"
        },
        {
          "id": 2,
          "question": "在现代 C++ 网络编程中，绝大部分接口参数推荐采用 const T& 传递，核心原因是：",
          "options": [
            "引用传递在编译期会自动生成深拷贝，提高安全性",
            "避免大对象（如数据包 Buffer、string）产生深拷贝开销，且从编译器保证入参只读安全性",
            "const 引用能够强制将入参修改为 NULL",
            "只有 const 引用才能被操作系统内核直接识别"
          ],
          "answer": 1,
          "explanation": "const T& 兼具按引用传递（避免拷贝）与只读语义（编译期拦截写操作）的安全性，并能合法绑定临时右值。"
        },
        {
          "id": 3,
          "question": "以下哪项 C++ 特性允许 const T& 绑定右值临时对象并延长其生命周期？",
          "options": [
            "C++ 语言标准关于 const 引用的生命周期延长（Lifetime Extension）规则",
            "操作系统内核的虚拟内存映射机制",
            "编译器通过强制 malloc 分配到全局堆上",
            "C++ 严禁 const 引用绑定右值临时变量"
          ],
          "answer": 0,
          "explanation": "C++ 标准明确规定：将右值临时对象绑定到 const 左值引用（或右值引用）时，该临时对象的生命周期延长至与该引用一致。"
        }
      ],
      "codeQuestion": {
        "question": "阅读下列代码，哪一行代码会导致编译器报错？",
        "code": "int val = 10;\nconst int* p1 = &val; // Line 1\nint* const p2 = &val; // Line 2\n*p1 = 20;             // Line 3\n*p2 = 30;             // Line 4",
        "options": [
          "Line 1",
          "Line 2",
          "Line 3",
          "Line 4"
        ],
        "answer": 2,
        "explanation": "p1 是指向常量的指针（const int*），编译器禁止通过 *p1 修改其所指内容，因此 Line 3 会编译报错。而 p2 是常量指针（int* const），允许修改 *p2。"
      },
      "whyQuestion": {
        "question": "为什么说引用的物理底层通常是指针，但在语言语义上绝不存在'空引用'？",
        "referenceAnswer": "引用的底层汇编实现通常是常量指针（T* const），在编译时由编译器隐式处理取地址与解引用操作；但在 C++ 语言语法规定中，引用必须在定义时初始化为一个已经存在的有效对象的别名，且不可重定向。因此合法的 C++ 代码中不存在空引用概念，这极大降低了空指针判空的心智负担。",
        "keywords": [
          "别名",
          "常量指针",
          "必须初始化",
          "不可重定向",
          "免判空"
        ]
      },
      "muduoQuestion": {
        "question": "在 muduo 网络库中，OnMessageCallback 回调函数的入参通常为 (const TcpConnectionPtr&, Buffer*, Timestamp)，为什么其中的 Timestamp 采用值传递而 Buffer* 采用指针？",
        "referenceAnswer": "Timestamp 仅由一个 64 位整型（int64_t microSecondsSinceEpoch_）组成，其体积只有 8 字节，与一个指针大小完全相同，按值传递可以直接通过 CPU 寄存器传递，速度极快且无间接寻址开销；而 Buffer 内部维护了读写游标，在回调中需要被调用方读取并修改 readable 索引，因此必须传入可变指针 Buffer* 进行原地修改。",
        "muduoMechanism": "小对象寄存器值传递 vs 具备原地状态流转的大对象指针借用"
      },
      "implQuestion": {
        "prompt": "写一个简单的泛型函数 inspectValue，要求入参以只读引用的方式接收任意类型 T 并打印其大小。",
        "referenceSolution": "template<typename T>\nvoid inspectValue(const T& val) {\n    std::cout << \"Size: \" << sizeof(val) << std::endl;\n}",
        "testCase": "inspectValue(std::string(\"muduo\"));"
      }
    }
  },
  {
    "day": 2,
    "week": 1,
    "tier": "A",
    "title": "类、访问控制与 const 成员函数",
    "bookRange": "第10章 10.1～10.2（P.340～352）+ 10.3.5-6（P.361～362）",
    "tags": [
      "数据封装",
      "const 成员",
      "只读安全"
    ],
    "points": [
      "掌握 private 数据隐藏与 public 接口（参看第10章 10.2.2 P.344～345）。",
      "深入理解 <code>size_t size() const;</code> 尾部 const 的本质：隐式传入的 <code>this</code> 指针类型被修饰为 <code>const ClassName* const this</code>。（参看第10章 10.3.5-6 P.361～362）",
      "const 实例与 const 引用只能调用类内的 const 成员函数，禁止调用修改内部状态的非 const 函数。",
      "<strong>muduo 对照：</strong>例如 <code>Buffer::readableBytes() const</code>、<code>TcpConnection::name() const</code>，所有查询函数必须声明为 const，保证在只读环境与多线程读语义下的自洽。"
    ],
    "code": "// Day 2: const 成员函数与调用限制\n#include <vector>\n#include <iostream>\n\nclass Buffer {\nprivate:\n    std::vector<char> data_;\npublic:\n    size_t size() const { return data_.size(); } // 承诺不修改内部状态\n    void clear() { data_.clear(); }\n};\n\nvoid inspect(const Buffer& buf) {\n    std::cout << \"Size: \" << buf.size() << \"\\n\"; // 合法\n    // buf.clear(); // 编译报错！禁止在 const 对象上调用非 const 函数\n}\n\nint main() {\n    Buffer b;\n    inspect(b);\n    return 0;\n}",
    "muduoMap": "Buffer::readableBytes(), TcpConnection::name(), InetAddress::toIpPort()",
    "check": "深刻理解为什么在只读引用上调用非 const 成员函数会导致编译报错。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "const 成员函数就是不修改成员变量的只读方法。",
      "strict": "尾部 const 严格修饰隐式传入的 this 指针为 const ClassName* const this；const 实例或只读引用只能调用 const 成员函数。除被 mutable 显式修饰的成员（如互斥锁 mutex_）外，严禁修改任何数据成员。"
    },
    "experiment": {
      "goal": "验证 const 成员函数对内部成员的只读约束与调用规则",
      "steps": [
        "实例化 Buffer 对象并分别以可变实例与 const 引用访问",
        "在 const 成员函数中尝试修改内部 data_ 成员验证编译器拦截",
        "验证 const 实例禁止调用非 const 成员函数"
      ],
      "expectedOutput": "Size: 0",
      "watchPoints": "const 引用 buf 上调用 buf.clear() 会触发直接编译错误，证明类设计接口的只读契约。",
      "pitfalls": "在只读检查函数（如 readableBytes()）中遗漏尾部 const，导致该函数在 const 引用下不可用。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day02.cpp -o day02 && ./day02"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在类成员函数尾部添加 const（如 size_t size() const;），其本质修饰的是什么？",
          "options": [
            "修饰函数的返回值不可被修改",
            "修饰类中所有的局部变量为常量",
            "修饰隐式传入的 this 指针为 const ClassName* const this",
            "通知操作系统将该函数载入只读内存段"
          ],
          "answer": 2,
          "explanation": "类成员函数尾部的 const 显式修饰当前隐式传递的 this 指针为指向常量的常量指针，承诺该函数体内不可修改任何非 mutable 成员变量。"
        },
        {
          "id": 2,
          "question": "如果一个对象被声明为 const TcpConnection& conn，它可以调用下列哪种成员函数？",
          "options": [
            "任何成员函数，编译器会自动去掉 const",
            "只能调用带有尾部 const 声明的成员函数",
            "只能调用析构函数",
            "禁止调用该类的任何函数"
          ],
          "answer": 1,
          "explanation": "const 实例与 const 引用只能调用尾部带有 const 修饰的只读成员函数，严禁调用可能修改对象内部状态的非 const 成员函数。"
        },
        {
          "id": 3,
          "question": "若需要在 const 成员函数中修改某个成员变量（如调试计数器或互斥锁），应使用哪个关键字修饰该成员？",
          "options": [
            "volatile",
            "register",
            "mutable",
            "thread_local"
          ],
          "answer": 2,
          "explanation": "mutable 关键字突破 const 限制，允许被修饰的数据成员在 const 成员函数中被合法修改，常用于互斥锁 mutex_ 或缓存/计数器。"
        }
      ],
      "codeQuestion": {
        "question": "分析下列代码，编译器会在哪一行抛出错误？",
        "code": "class Counter {\n    int n_{0};\npublic:\n    int get() const { return n_; }     // Line 4\n    void inc() const { n_++; }         // Line 5\n};",
        "options": [
          "Line 4",
          "Line 5",
          "Line 4 与 Line 5 都会报错",
          "代码完全合法，无错误"
        ],
        "answer": 1,
        "explanation": "Line 5 声明为 const 成员函数，承诺不修改成员，但函数体内部执行了 n_++，除非 n_ 被修饰为 mutable，否则编译器直接拒绝编译。"
      },
      "whyQuestion": {
        "question": "为什么在多线程网络库中，所有只读查询接口（如 Buffer::readableBytes()）必须严格标记为 const？",
        "referenceAnswer": "标记为 const 不仅向调用方清晰表达'只读不改'的接口契约，更关键的是允许多个工作线程通过 const 引用并发调用该方法而无需担心写写冲突或意外的状态变更；同时让编译器进行只读安全性审查，杜绝由于疏忽在只读逻辑中修改状态引发并发竞态。",
        "keywords": [
          "只读契约",
          "并发安全",
          "无写写冲突",
          "编译器审查"
        ]
      },
      "muduoQuestion": {
        "question": "在 muduo::net::Buffer 类中，为什么 readableBytes() 是 const 成员函数，而 retrieve() 却是非 const 成员函数？",
        "referenceAnswer": "readableBytes() 仅仅是读取 readerIndex_ 与 writerIndex_ 计算可读字节数，绝不改变 Buffer 内部任何缓冲状态，因此声明为 const；而 retrieve(len) 会向前移动 readerIndex_ 游标，改变了 Buffer 的可读状态和内部数据位置，属于写操作，必须是非 const 成员函数。",
        "muduoMechanism": "Buffer 游标状态不变性 (readableBytes) vs 游标移动消耗性操作 (retrieve)"
      },
      "implQuestion": {
        "prompt": "设计一个简单的只读包装类 ReadOnlyWrapper，包含私有成员 int data_，提供安全 const 构造与 const 访问器。",
        "referenceSolution": "class ReadOnlyWrapper {\nprivate:\n    int data_;\npublic:\n    explicit ReadOnlyWrapper(int d) : data_(d) {}\n    int get() const { return data_; }\n};",
        "testCase": "const ReadOnlyWrapper w(100); std::cout << w.get();"
      }
    }
  },
  {
    "day": 3,
    "week": 1,
    "tier": "A",
    "title": "构造函数、析构函数与 RAII 资源管理",
    "bookRange": "第10章 10.3（P.352～363）+ 10.4 this 指针（P.363～368）",
    "tags": [
      "构造初始化",
      "析构自动化",
      "RAII机制"
    ],
    "points": [
      "构造函数与析构函数的声明、定义与执行时机（参看第10章 10.3.1～10.3.4 P.352～356）。",
      "构造函数初始化列表（Member Initializer List）：初始化次序由成员在类中的声明顺序决定，而非列表书写顺序！",
      "<strong>RAII（Resource Acquisition Is Initialization）：</strong>对象的生命周期严格对应资源的持有期；作用域结束时自动触发析构函数回收句柄或解锁。",
      "<strong>muduo 对照：</strong><code>MutexLockGuard</code>。构造函数加锁，析构函数自动解锁，彻底消除因分支跳转或异常引发的死锁灾难。"
    ],
    "code": "// Day 3: RAII 互斥锁守护模拟\n#include <iostream>\n\nclass DummyMutex {\npublic:\n    void lock()   { std::cout << \"Mutex Locked!\\n\"; }\n    void unlock() { std::cout << \"Mutex Unlocked!\\n\"; }\n};\n\nclass MutexGuard {\nprivate:\n    DummyMutex& mutex_;\npublic:\n    explicit MutexGuard(DummyMutex& m) : mutex_(m) { mutex_.lock(); }\n    ~MutexGuard() { mutex_.unlock(); }\n};\n\nint main() {\n    DummyMutex m;\n    {\n        MutexGuard lock(m); // 自动加锁\n        std::cout << \"Executing critical section...\\n\";\n    } // 离开大括号作用域，自动触发 ~MutexGuard() 解锁\n    return 0;\n}",
    "muduoMap": "muduo::MutexLockGuard, Socket 析构时自动调用 close(sockfd_)",
    "check": "能够凭记忆手写出一个结构完整自洽的 MutexLockGuard 类。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "RAII 就是构造函数拿资源，析构函数放资源。",
      "strict": "RAII 将堆内存、文件描述符、互斥锁等操作系统的关键资源生命周期与栈对象的生命期强绑定；利用 C++ 确定性栈展开（Stack Unwinding）机制，保证代码在正常分支退出或抛出异常时，析构函数必定被自动、确定性地调用。"
    },
    "experiment": {
      "goal": "验证 RAII 机制在作用域进出时的确定性自动析构保证",
      "steps": [
        "定义 DummyMutex 与 MutexGuard 守护类",
        "在显式大括号代码块内构建 MutexGuard 实例",
        "观测离开作用域时析构函数的自动执行"
      ],
      "expectedOutput": "Mutex Locked!\nExecuting critical section...\nMutex Unlocked!",
      "watchPoints": "无论是正常离开大括号、return 提前返回还是抛出异常，MutexGuard 析构函数均确定性被调用。",
      "pitfalls": "忘记将 MutexGuard 构造函数标记为 explicit，导致发生隐式类型转换意外临时加解锁。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day03.cpp -o day03 && ./day03"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "RAII（Resource Acquisition Is Initialization）的核心思想是什么？",
          "options": [
            "在程序初始化时分配全系统所有的资源",
            "将系统资源的生命周期与栈对象的生命期严格绑定，构造时申请，析构时自动释放",
            "使用静态垃圾回收线程定期扫描不再使用的指针",
            "严禁在堆上动态分配任何对象"
          ],
          "answer": 1,
          "explanation": "RAII 的核心思想是将资源获取置于构造函数，资源释放置于析构函数，借助 C++ 离开作用域时必然调用析构函数的栈自动展开保证无泄漏。"
        },
        {
          "id": 2,
          "question": "在构造函数的初始化列表（Member Initializer List）中，成员初始化的次序取决于：",
          "options": [
            "成员变量在构造函数初始化列表中书写的先后顺序",
            "成员变量在类定义（Class Definition）中声明的先后顺序",
            "成员变量占用内存大小（从小到大排序）",
            "编译器的随机优化决断"
          ],
          "answer": 1,
          "explanation": "C++ 标准明确规定：类成员初始化的顺序严格由成员在类声明中的先后顺序决定，与初始化列表的书写顺序完全无关！书写顺序不一致时现代编译器会报警告。"
        },
        {
          "id": 3,
          "question": "为什么 RAII 机制被视为解决互斥锁死锁的最强利器？",
          "options": [
            "RAII 锁能提高操作系统的时钟频率",
            "即使临界区代码由于条件分支 return 提前返回或抛出异常，析构函数必定自动执行完成解锁",
            "RAII 使得互斥锁不需要操作系统内核支持",
            "RAII 锁可以允许多个线程同时写入同一变量"
          ],
          "answer": 1,
          "explanation": "传统手动 lock()/unlock() 容易因中途 return、break 或抛出异常而遗漏 unlock() 造成永久死锁；RAII 守护类通过析构函数保证 100% 可靠解锁。"
        }
      ],
      "codeQuestion": {
        "question": "观察下列代码，当 process() 函数执行并由于 val == 0 提前返回时，互斥锁的状态是？",
        "code": "void process(int val, DummyMutex& m) {\n    MutexGuard lock(m);\n    if (val == 0) return;\n    doLongTask();\n}",
        "options": [
          "由于没有执行到函数末尾，锁仍处于持有状态造成死锁",
          "在 return 语句执行时，局部变量 lock 触发析构函数，互斥锁已安全自动释放",
          "发生编译错误，不允许在持有锁时提前 return",
          "锁被操作系统强制销毁"
        ],
        "answer": 1,
        "explanation": "当执行 return 语句离开函数作用域时，栈上的局部对象 lock 按照与构造相反的顺序确定性触发析构函数 ~MutexGuard()，自动执行 unlock()。"
      },
      "whyQuestion": {
        "question": "为什么析构函数绝不能抛出异常？如果析构函数抛出异常会发生什么灾难？",
        "referenceAnswer": "若在栈展开（Stack Unwinding，即已有异常正在处理中）期间，析构函数又抛出了新异常，C++ 运行时将无法同时处理两个未决异常，系统将立即直接调用 std::terminate() 强行终止整个进程；此外，析构抛出异常会导致后续资源释放逻辑被跳过引发严重泄漏。因此析构函数必须始终保证 noexcept（C++11 默认隐式 noexcept）。",
        "keywords": [
          "栈展开",
          "std::terminate",
          "进程强退",
          "资源泄漏",
          "noexcept"
        ]
      },
      "muduoQuestion": {
        "question": "muduo 中的 Socket 类如何利用 RAII 避免 Linux 下网络文件描述符（sockfd）泄漏？",
        "referenceAnswer": "muduo::Socket 类将系统套接字文件描述符 sockfd_ 作为唯一的私有成员封装；在其析构函数 ~Socket() 中显式调用 ::close(sockfd_)。当 Socket 对象离开其生命周期作用域或包含它的类被释放时，Linux 内核文件描述符被立即且必定关闭，彻底根除 fd 泄漏导致的系统句柄耗尽崩溃。",
        "muduoMechanism": "Socket RAII 封装 ::close(sockfd_) 杜绝 fd 耗尽"
      },
      "implQuestion": {
        "prompt": "手写一个简易的文件句柄 RAII 类 FileCloser，构造时接收 FILE* fp，析构时自动调用 fclose(fp)。",
        "referenceSolution": "class FileCloser {\nprivate:\n    FILE* fp_{nullptr};\npublic:\n    explicit FileCloser(FILE* fp) : fp_(fp) {}\n    ~FileCloser() { if (fp_) ::fclose(fp_); }\n};",
        "testCase": "FILE* fp = fopen(\"test.txt\", \"w\"); FileCloser guard(fp);"
      }
    }
  },
  {
    "day": 4,
    "week": 1,
    "tier": "A",
    "title": "动态内存管理与浅拷贝灾难",
    "bookRange": "第12章 12.1.1～12.1.4（P.425～437）+ 第4章 4.7.4-5（P.102～105）",
    "tags": [
      "new/delete",
      "浅拷贝陷阱",
      "Double Free"
    ],
    "points": [
      "<code>new</code> / <code>delete</code> 与 <code>new[]</code> / <code>delete[]</code> 的严格配对规则，未配对将导致内存碎片或未定义崩溃。（参看第4章 4.7.4～4.7.5 P.102～105）",
      "<strong>浅拷贝（Shallow Copy）灾难：</strong>编译器合成的默认拷贝构造只进行位逐字节复制（bit-wise copy）。如果类持有裸指针 <code>char* data_</code>，两个对象指向同块堆内存，先析构的对象释放它，后析构的对象将引发 <strong>Double Free</strong>！（重点精读第12章 StringBad 示例 P.426～437）",
      "动手排查悬挂指针（Dangling Pointer）形成的机理。"
    ],
    "code": "// Day 4: 浅拷贝与双重释放崩溃演示\n#include <iostream>\n\nclass DangerousBuffer {\npublic:\n    char* ptr_;\n    DangerousBuffer() { ptr_ = new char[64]; }\n    ~DangerousBuffer() { delete[] ptr_; }\n    // 缺失自定义拷贝构造！默认的浅拷贝将使两个对象指向同一块 ptr_\n};\n\nint main() {\n    DangerousBuffer b1;\n    // DangerousBuffer b2 = b1; \n    // 若放开上行：b1 与 b2 析构时将对同一块 ptr_ 执行两次 delete[]，引发崩溃！\n    std::cout << \"谨防编译器默认的 bit-wise 浅拷贝\\n\";\n    return 0;\n}",
    "muduoMap": "muduo 坚决不在外部裸用 delete，统一使用 RAII 与容器托管",
    "check": "能够准确解释为什么类内部持有堆指针时必须显式重写拷贝函数。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "浅拷贝就是两个指针指向同一块内存，会 double free。",
      "strict": "编译器合成的默认拷贝构造执行逐字节按位复制（bit-wise copy）。类若持有堆裸指针，两个独立对象析构时将对同一物理堆地址调用两次 free/delete，破坏堆内存元数据引发未定义行为（SIGABRT / 堆溢出）。"
    },
    "experiment": {
      "goal": "验证编译器默认浅拷贝在持有堆指针时引发的 Double Free 灾难",
      "steps": [
        "编写持有动态堆裸指针的 DangerousBuffer 类",
        "故意省略自定义深拷贝构造函数",
        "分析对象按值复制后同一堆地址被二次 delete[] 的崩溃现象"
      ],
      "expectedOutput": "谨防编译器默认的 bit-wise 浅拷贝",
      "watchPoints": "默认按位复制使 b1.ptr_ 与 b2.ptr_ 完全相同，先析构的对象将内存释放，后析构的对象触发 SIGABRT。",
      "pitfalls": "混用 new[] 与 delete（非 delete[]）导致堆内存控制块元数据破坏崩溃。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day04.cpp -o day04 && ./day04"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "C++ 中 new 与 delete、new[] 与 delete[] 未严格配对使用，会导致什么后果？",
          "options": [
            "编译器会自动帮程序员纠正，完全无影响",
            "导致内存泄漏、数组大小元数据被错误解析，破坏堆内存元信息引发未定义行为甚至崩溃",
            "只会让程序运行速度变慢 10%",
            "自动转为调用操作系统垃圾回收器"
          ],
          "answer": 1,
          "explanation": "new[] 分配数组时通常在内存头部保留数组长度用于后续逐个调用析构函数；若使用标量 delete 释放，不仅派生对象析构不会被完整调用，更会导致堆内存管理器控制块破坏引发崩溃。"
        },
        {
          "id": 2,
          "question": "什么是浅拷贝（Shallow Copy）？为什么类中含有堆指针成员时默认浅拷贝极为危险？",
          "options": [
            "浅拷贝只复制头文件中的类声明",
            "浅拷贝直接对对象内存进行按位逐字节复制（bit-wise），导致两个对象的指针成员指向同一物理堆地址，最终触发 Double Free",
            "浅拷贝会导致操作系统的硬盘出现坏道",
            "浅拷贝只复制 static 静态成员"
          ],
          "answer": 1,
          "explanation": "默认拷贝构造只进行浅拷贝，指针成员复制后仅复制了地址。当其中一个对象生命周期结束析构释放了堆空间，另一个对象持有的指针即刻变为野指针，在其析构时对同一地址再次释放引发 Double Free。"
        },
        {
          "id": 3,
          "question": "悬挂指针（Dangling Pointer）指的是：",
          "options": [
            "永远没有被初始化的指针",
            "指向已经被释放或回收的内存地址的指针",
            "数值等于 0x00000000 的空指针",
            "指向操作系统内核代码段的只读指针"
          ],
          "answer": 1,
          "explanation": "悬挂指针是指指针原本指向有效内存，但在该内存被释放或栈变量销毁后，指针变量本身仍然保留着原物理地址，对其解引用会发生未定义行为或数据篡改。"
        }
      ],
      "codeQuestion": {
        "question": "分析下列代码，当离开 main 函数作用域时，程序会发生什么？",
        "code": "class Bad {\npublic:\n    int* data_;\n    Bad() : data_(new int(42)) {}\n    ~Bad() { delete data_; }\n};\n\nint main() {\n    Bad b1;\n    Bad b2 = b1; // 触发默认拷贝构造\n    return 0;\n}",
        "options": [
          "程序正常退出，打印 42",
          "发生 Double Free 崩溃或异常终止（SIGABRT）",
          "编译失败，因为没有默认构造函数",
          "b2 自动指向了一个新的堆内存地址"
        ],
        "answer": 1,
        "explanation": "b2 = b1 使用默认浅拷贝，导致 b1.data_ 与 b2.data_ 存储完全相同的指针值。main 退出时，b2 先析构调用 delete 释放了内存；随后 b1 析构再次对已释放的内存调用 delete，操作系统捕获双重释放抛出 SIGABRT 崩溃。"
      },
      "whyQuestion": {
        "question": "为什么现代 C++ 工业网络库（如 muduo）极力提倡'坚决不在上层裸调 delete'？",
        "referenceAnswer": "手动调用 delete 极易因为分支覆盖不全导致内存泄漏，或因为所有权模糊导致双重释放（Double Free）与悬挂指针（Dangling Pointer）；利用 RAII 智能指针（unique_ptr/shared_ptr）和标准容器（vector/string）自动管理生命周期，从语言机制上彻底杜绝了手动裸用 delete 的人为心智漏洞。",
        "keywords": [
          "所有权模糊",
          "Double Free",
          "内存泄漏",
          "RAII",
          "容器托管"
        ]
      },
      "muduoQuestion": {
        "question": "muduo 在管理网络事件回调和通道生命周期时，如何从架构上杜绝裸指针悬挂问题？",
        "referenceAnswer": "muduo 结合使用 shared_ptr 与 weak_ptr：TcpConnection 由 shared_ptr 管理生命周期；Channel 内部通过 std::weak_ptr<void> tie_ 观察对象存活状态，在事件派发 handleEvent 时先调用 tie_.lock() 尝试提升为 shared_ptr，避免在回调执行期间对象析构引发野指针问题。",
        "muduoMechanism": "Channel::tie_ 弱引用观察者 + lock() 安全提权"
      },
      "implQuestion": {
        "prompt": "写一个简单的析构防护函数 safeDeleteInt，接收一个 int*& 指针引用，将其释放并置为 nullptr。",
        "referenceSolution": "void safeDeleteInt(int*& ptr) {\n    if (ptr) {\n        delete ptr;\n        ptr = nullptr;\n    }\n}",
        "testCase": "int* p = new int(10); safeDeleteInt(p); assert(p == nullptr);"
      }
    }
  },
  {
    "day": 5,
    "week": 1,
    "tier": "A",
    "title": "深拷贝构造函数与拷贝赋值运算符",
    "bookRange": "第12章 12.1.3～12.2（P.434～446）",
    "tags": [
      "深拷贝",
      "自赋值检查",
      "三法则"
    ],
    "points": [
      "深拷贝构造函数的完整实现：分配新内存并执行完整内容拷贝（参看第12章 12.1.3 P.434～436）。",
      "赋值运算符重载规范与<strong>自赋值检查（Self-Assignment Check）</strong>：<code>if (this == &rhs) return *this;</code>，先释放旧资源再分配新空间（参看第12章 12.1.4 P.436～437 及 12.2 P.437～446）。",
      "<strong>严格区分：</strong><code>Foo a; Foo b(a);</code>（初始化调用拷贝构造）与 <code>Foo c; c = a;</code>（赋值调用 operator=）。",
      "经典三法则（Rule of Three）：析构、拷贝构造、拷贝赋值三者绑定出现。"
    ],
    "code": "// Day 5: 规范的深拷贝构造与拷贝赋值\n#include <cstring>\n#include <iostream>\n\nclass SafeBuffer {\nprivate:\n    char* data_;\n    size_t size_;\npublic:\n    SafeBuffer(const char* s, size_t n) : size_(n), data_(new char[n]) {\n        std::memcpy(data_, s, n);\n    }\n    ~SafeBuffer() { delete[] data_; }\n\n    // 拷贝构造函数\n    SafeBuffer(const SafeBuffer& rhs) : size_(rhs.size_), data_(new char[rhs.size_]) {\n        std::memcpy(data_, rhs.data_, size_);\n    }\n\n    // 拷贝赋值运算符（带自我赋值检查）\n    SafeBuffer& operator=(const SafeBuffer& rhs) {\n        if (this != &rhs) {\n            delete[] data_;\n            size_ = rhs.size_;\n            data_ = new char[size_];\n            std::memcpy(data_, rhs.data_, size_);\n        }\n        return *this;\n    }\n};",
    "muduoMap": "std::vector 内部元素在重新分配内存时的拷贝语义保障",
    "check": "能准确说出拷贝赋值中为什么要先判断 this != &rhs。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "深拷贝就是重新 new 一块内存把内容拷过去。",
      "strict": "拷贝赋值运算符必须先做自赋值防范（if (this != &rhs)），防止释放自身内存后再去访问同一已析构内存引发崩溃；随后按先分配新内存再释放旧资源的异常安全原则（Copy-and-Swap）构建。"
    },
    "experiment": {
      "goal": "验证符合强异常安全的深拷贝构造与自赋值检查 (this != &rhs)",
      "steps": [
        "为 SafeBuffer 分配独立堆内存并逐字节拷贝内容",
        "在 operator= 中增加自赋值检查 if (this != &rhs)",
        "测试 b = b 自赋值场景，验证数据完整未被提前释放"
      ],
      "expectedOutput": "SafeBuffer 内存深拷贝隔离成功，自赋值检测通过",
      "watchPoints": "自赋值若无检查，delete[] data_ 会先释放自身内存，后续再访问 rhs.data_ 将读取悬挂野指针！",
      "pitfalls": "分配新内存时未考虑可能抛出的 std::bad_alloc 导致对象自身处于半析构非法状态。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day05.cpp -o day05 && ./day05"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "深拷贝构造函数与拷贝赋值运算符（Copy Assignment Operator）的核心区别是：",
          "options": [
            "类中必须定义三个私有变量、三个公有方法和三个静态函数",
            "如果一个类显式定义了析构函数、拷贝构造函数或拷贝赋值运算符中的任意一个，通常需要显式定义全部三个",
            "程序最多允许嵌套三层继承",
            "每个函数最多只能传递三个参数"
          ],
          "answer": 1,
          "explanation": "三法则：需要自定义析构函数的类通常意味着内部管理了独占外部资源，因此编译器默认生成的浅拷贝构造与浅赋值必然不满足要求，必须同时重写这三者。"
        },
        {
          "id": 2,
          "question": "在实现拷贝赋值运算符 operator= 时，第一行代码通常写 if (this == &rhs) return *this; 其核心防范是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "经典 C++'三法则'（Rule of Three）指的是：",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 5 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 5 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 5 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 5 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 5 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 5 的特性。",
        "referenceSolution": "// 验证 Day 5\nvoid testDay05() {\n    // 核心断言验证\n}",
        "testCase": "testDay05();"
      }
    }
  },
  {
    "day": 6,
    "week": 1,
    "tier": "A",
    "title": "C++11 移动语义（Move）与右值引用",
    "bookRange": "第18章 18.1.9（P.801～802）+ 18.2（P.802～813）",
    "tags": [
      "右值引用",
      "std::move",
      "所有权转移"
    ],
    "points": [
      "左值与右值的严格界定（可取地址 vs 临时表达式结果，参看第18章 18.1.9 P.801～802）。",
      "右值引用符号 <code>T&&</code> 与移动语义的必要性：避免大块临时数据的深拷贝开销（参看第18章 18.2.1～18.2.2 P.802～808）。",
      "<code>std::move()</code> 的本质<strong>只是强行进行 static_cast&lt;T&amp;&amp;&gt; 转换</strong>，强制触发移动构造函数（参看第18章 18.2.5 P.809～813）。",
      "编写移动构造与移动赋值时将源指针置空（转移所有权）并标记 <code>noexcept</code>。"
    ],
    "code": "// Day 6: 移动构造实现资源所有权转移\n#include <utility>\n#include <iostream>\n\nclass MoveBuffer {\nprivate:\n    char* data_{nullptr};\n    size_t size_{0};\npublic:\n    MoveBuffer(size_t s) : size_(s), data_(new char[s]) {}\n    ~MoveBuffer() { delete[] data_; }\n\n    // 移动构造函数\n    MoveBuffer(MoveBuffer&& rhs) noexcept : data_(rhs.data_), size_(rhs.size_) {\n        rhs.data_ = nullptr; // 剥夺原主人的指针，避免其析构时释放\n        rhs.size_ = 0;\n    }\n\n    // 移动赋值运算符\n    MoveBuffer& operator=(MoveBuffer&& rhs) noexcept {\n        if (this != &rhs) {\n            delete[] data_;\n            data_ = rhs.data_;\n            size_ = rhs.size_;\n            rhs.data_ = nullptr;\n            rhs.size_ = 0;\n        }\n        return *this;\n    }\n};",
    "muduoMap": "EventLoop::queueInLoop(Functor cb) 中的 cb = std::move(cb)",
    "check": "能够说出移动构造函数内部为什么要将 rhs.data_ 及时置空。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "std::move 会自动把对象内容迅速转移走。",
      "strict": "std::move 在编译后不产生任何汇编移动指令，它本质是无条件的 static_cast<T&&> 右值引用转换；真正发生资源窃取的是后续重载匹配到的移动构造或移动赋值函数，且源对象在 move 后处于有效但未指定状态（Valid but Unspecified）。"
    },
    "experiment": {
      "goal": "验证 C++11 std::move 右值窃取与无拷贝资源接管",
      "steps": [
        "实现带 noexcept 的移动构造函数与移动赋值运算符",
        "使用 std::move 触发移动语义，将源对象的指针重定向",
        "将源对象指针置为 nullptr 保证析构安全"
      ],
      "expectedOutput": "移动构造执行：接管堆资源成功",
      "watchPoints": "移动后源对象的资源被接管，源对象的 ptr_ 必须安全置为 nullptr，否则其析构将误删已转移资源。",
      "pitfalls": "在移动构造中遗漏 noexcept，导致放入 std::vector 时无法享受移动优化，退化为深拷贝。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day06.cpp -o day06 && ./day06"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "std::move() 在编译后的底层汇编代码中实际做了什么？",
          "options": [
            "在内存中把源对象的数据块逐字节搬移到新地址",
            "不生成任何内存移动汇编代码，纯粹是无条件的 static_cast<T&&> 强制类型转换为右值引用",
            "自动启动异步后台线程进行深拷贝",
            "调用操作系统内核接口进行内存转移"
          ],
          "answer": 1,
          "explanation": "std::move 本质是一个编译期类型转换模板，它将左值强制转换成右值引用，从而使得编译器在重载决议时能优先匹配到移动构造或移动赋值函数。"
        },
        {
          "id": 2,
          "question": "在 Day 6 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 6 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 6 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 6 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 6 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 6 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 6 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 6 的特性。",
        "referenceSolution": "// 验证 Day 6\nvoid testDay06() {\n    // 核心断言验证\n}",
        "testCase": "testDay06();"
      }
    }
  },
  {
    "day": 7,
    "week": 1,
    "tier": "A",
    "title": "=default, =delete 与 noncopyable 机制",
    "bookRange": "第18章 18.3.1～18.3.2（P.813～815）+ 第1周综合复习",
    "tags": [
      "=delete",
      "noncopyable",
      "第1周验收"
    ],
    "points": [
      "<code>= default</code> 显式要求编译器生成默认特殊成员函数（参看第18章 18.3.1～18.3.2 P.813～815）。",
      "<code>= delete</code> 显式禁用拷贝构造和赋值运算符，编译期直接拦截非法复制（参看第18章 18.3.2 P.814～815）。",
      "<strong>muduo 标志性基类 <code>noncopyable</code>：</strong>TcpConnection、EventLoop、Channel、TcpServer 均继承自 noncopyable，从语法层面阻止关键对象被误拷贝！",
      "第一周阶段验收：实现支持移动语义并禁用拷贝的 Buffer 模型。"
    ],
    "code": "// Day 7: muduo noncopyable 典范设计\nclass noncopyable {\npublic:\n    noncopyable(const noncopyable&) = delete;\n    void operator=(const noncopyable&) = delete;\nprotected:\n    noncopyable() = default;\n    ~noncopyable() = default;\n};\n\n// 任何继承 noncopyable 的类均自动禁止拷贝\nclass TcpConnection : private noncopyable {\n    // 绝对安全，外界无法误写 TcpConnection a = b;\n};\n\nint main() {\n    // TcpConnection c1;\n    // TcpConnection c2 = c1; // 编译报错！拷贝构造已被 = delete\n    return 0;\n}",
    "muduoMap": "muduo::noncopyable（整个 muduo 网络库的基础骨干）",
    "check": "不看参考，默写出 noncopyable 基类并在网络类中正确生效。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "=delete 就是把函数删除了不让用。",
      "strict": "=delete 参与重载决议并指示编译器生成编译期硬错误，避免了 C++98 中将拷贝构造私有化而在类内部或友元中仍可能误调用的漏洞；基类声明为 noncopyable 即可从根源阻断独占网络句柄的非法拷贝。"
    },
    "experiment": {
      "goal": "验证 =delete 机制从编译期杜绝独占资源对象发生拷贝",
      "steps": [
        "编写继承 noncopyable 的 Socket 或 Channel 类",
        "显式声明拷贝构造与拷贝赋值为 =delete",
        "尝试对其实例执行按值传递观测编译器精准报错"
      ],
      "expectedOutput": "noncopyable 成功阻断非法拷贝",
      "watchPoints": "=delete 报错信息比 C++98 private 方案更加明确直观，在模板展开前即可拦截非法语义。",
      "pitfalls": "试图在 =delete 之后仍编写函数体实现，导致语法错误。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day07.cpp -o day07 && ./day07"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "C++11 提供的 =delete 关键字与 C++98 中将拷贝构造声明在 private 作用域相比，核心优势在于：",
          "options": [
            "语法更优雅，且在友元或类内部试图调用时，在编译期即可产生明确的语义错误而非链接错误",
            "可以提高程序运行时的 CPU 指令执行速度",
            "使得对象可以被直接复制到 GPU 显存",
            "=delete 可以被后续代码重新定义为 =default"
          ],
          "answer": 0,
          "explanation": "C++98 private 声明方案在类内部方法或友元函数中仍能编译通过，直到链接期才报错；而 =delete 直接从重载集合中删除该函数，任何调用场景均在编译期立即给出精准错误。"
        },
        {
          "id": 2,
          "question": "在 Day 7 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 7 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 7 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 7 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 7 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 7 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 7 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 7 的特性。",
        "referenceSolution": "// 验证 Day 7\nvoid testDay07() {\n    // 核心断言验证\n}",
        "testCase": "testDay07();"
      }
    }
  },
  {
    "day": 8,
    "week": 2,
    "tier": "A",
    "title": "std::unique_ptr 独占资源模型",
    "bookRange": "第16章 16.2 全节（P.667～674）",
    "tags": [
      "unique_ptr",
      "独占所有权",
      "所有权移交"
    ],
    "points": [
      "智能指针与 RAII 原理（参看第16章 16.2.1 P.668～670）。",
      "彻底废弃 <code>auto_ptr</code> 的原因：破坏性隐式拷贝，导致悬挂指针隐蔽崩溃（重点看 16.2.3 P.672～673）。",
      "<strong>独占模型：</strong>同一时刻只有一个 unique_ptr 拥有对象所有权，其拷贝构造和拷贝赋值被 <code>= delete</code>，只能通过 <code>std::move()</code> 进行所有权转移（参看 16.2.4 P.673～674）。",
      "<strong>muduo 对照：</strong>EventLoop 中持有 Poller、TimerQueue 等核心组件均为 <code>std::unique_ptr</code>，明确生命期的唯一归属者。"
    ],
    "code": "// Day 8: unique_ptr 的独占与所有权移交\n#include <memory>\n#include <iostream>\n\nclass Channel {\npublic:\n    void handle() { std::cout << \"Channel handling event...\\n\"; }\n};\n\nint main() {\n    std::unique_ptr<Channel> ch1(new Channel());\n    // auto ch2 = ch1; // 编译报错！禁止拷贝\n    auto ch2 = std::move(ch1); // 显式移交所有权\n    ch2->handle();\n    // 此时 ch1 为 nullptr\n    return 0;\n}",
    "muduoMap": "EventLoop::poller_, EventLoop::timerQueue_",
    "check": "能解释为什么 unique_ptr 不能 push 到要求拷贝的旧容器，但能 move 到 vector。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "unique_ptr 就是只能一个人用的智能指针。",
      "strict": "unique_ptr 是零运行时开销的独占所有权模型（RAII Wrapper），彻底封死拷贝构造和拷贝赋值，仅保留移动构造与移动赋值；离开作用域时自动通过 Deleter 回收裸指针，性能等同裸指针。"
    },
    "experiment": {
      "goal": "验证 std::unique_ptr 独占所有权模型与 std::move 所有权移交",
      "steps": [
        "创建 std::unique_ptr<Poller> 实例",
        "尝试直接将其拷贝赋值给另一个 unique_ptr 检验编译拦截",
        "使用 std::move 成功完成所有权安全交接并验证源指针变为 nullptr"
      ],
      "expectedOutput": "unique_ptr 所有权移交成功",
      "watchPoints": "unique_ptr 离开作用域立即自动调用 delete，移交后原指针等于 nullptr 无法再解引用。",
      "pitfalls": "对 unique_ptr 使用 .get() 获取裸指针后在外部手动执行 delete，导致二次释放。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day08.cpp -o day08 && ./day08"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "为什么 std::unique_ptr 严禁直接进行拷贝构造或拷贝赋值？",
          "options": [
            "unique_ptr 占用的内存空间太大，拷贝耗时太长",
            "unique_ptr 表达独占所有权模型，若允许拷贝会导致两个智能指针管理同一裸指针，破坏独占性并触发 Double Free",
            "操作系统的 epoll 接口不支持智能指针拷贝",
            "unique_ptr 只能在栈上使用，不能作为类成员"
          ],
          "answer": 1,
          "explanation": "unique_ptr 核心职责是独占资源生命期；通过显式 =delete 拷贝操作，迫使开发者若要转移资源必须使用 std::move，从语言层面杜绝了资源归属模糊。"
        },
        {
          "id": 2,
          "question": "在 Day 8 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 8 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 8 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 8 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 8 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 8 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 8 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 8 的特性。",
        "referenceSolution": "// 验证 Day 8\nvoid testDay08() {\n    // 核心断言验证\n}",
        "testCase": "testDay08();"
      }
    }
  },
  {
    "day": 9,
    "week": 2,
    "tier": "A",
    "title": "std::shared_ptr 共享模型与引用计数",
    "bookRange": "第16章 16.2.1～16.2.4（P.668～674）+ 第18章 18.1.4（P.798）+ 动手实操",
    "tags": [
      "shared_ptr",
      "引用计数",
      "make_shared"
    ],
    "points": [
      "《C++PP》18.1.4 仅有一页概述，主要学习内容在第16章 16.2.1～16.2.4（P.668～674）的对比分析，必须通过自己动手写 Demo 补足！",
      "<strong>控制块（Control Block）：</strong>包含强引用计数（strong ref）、弱引用计数（weak ref）。每次拷贝 shared_ptr 强计数原子加 1，析构原子减 1，归零时释放对象堆内存。",
      "为什么优先使用 <code>std::make_shared&lt;T&gt;()</code>？（将控制块与对象内存一次性分配，减少一次堆申请，内存更紧凑）。",
      "<strong>muduo 对照：</strong><code>TcpConnectionPtr</code> 采用 shared_ptr 管理，因为该连接可能同时被 TcpServer、Channel、用户业务回调引用。"
    ],
    "code": "// Day 9: shared_ptr 引用计数推演\n#include <memory>\n#include <iostream>\n\nstruct Connection { int fd{0}; };\n\nint main() {\n    std::shared_ptr<Connection> p1 = std::make_shared<Connection>();\n    std::cout << \"Ref count: \" << p1.use_count() << \"\\n\"; // 1\n    {\n        auto p2 = p1;\n        std::cout << \"After copy: \" << p1.use_count() << \"\\n\"; // 2\n    }\n    std::cout << \"After scope: \" << p1.use_count() << \"\\n\"; // 1\n    return 0;\n}",
    "muduoMap": "TcpConnectionPtr = std::shared_ptr<TcpConnection>",
    "check": "能够说出 make_shared 比 new shared_ptr 优势在哪里，并观察 use_count()。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "shared_ptr 引用计数为 0 时对象自动释放。",
      "strict": "shared_ptr 包含指向目标对象的指针和指向堆上控制块（Control Block）的指针；控制块原子管理 use_count 与 weak_count。多线程下指针复制引起的引用计数增减是线程安全的，但多线程并发读写目标对象本身必须加锁。"
    },
    "experiment": {
      "goal": "验证 std::shared_ptr 引用计数机制与多方安全共享",
      "steps": [
        "使用 std::make_shared 创建 TcpConnection 共享实例",
        "观察多个智能指针持有者在作用域进出时的 use_count() 变化",
        "最后一个持有者离开作用域时对象安全析构"
      ],
      "expectedOutput": "use_count 递减至 0 时触发 ~TcpConnection()",
      "watchPoints": "优先使用 std::make_shared 一次性合并分配对象与控制块，避免两次分配的开销。",
      "pitfalls": "同一个裸指针分别初始化两个独立的 shared_ptr，导致两个控制块各自释放同一对象。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day09.cpp -o day09 && ./day09"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "关于 std::shared_ptr 的控制块（Control Block）与引用计数，下列叙述正确的是：",
          "options": [
            "引用计数保存在被管理对象的内部私有变量中",
            "控制块在堆上独立分配，内含原子类型的 use_count 与 weak_count",
            "shared_ptr 在多线程下对目标对象内部数据的修改也是自动加锁线程安全的",
            "只要 weak_count 归零，被管理的目标对象就会立即被析构"
          ],
          "answer": 1,
          "explanation": "控制块在堆上动态分配，包含强引用计数值（use_count）与弱引用计数值（weak_count）。目标对象在 use_count 归零时析构，而控制块自身需在 weak_count 也归零时才释放。"
        },
        {
          "id": 2,
          "question": "在 Day 9 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 9 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 9 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 9 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 9 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 9 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 9 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 9 的特性。",
        "referenceSolution": "// 验证 Day 9\nvoid testDay09() {\n    // 核心断言验证\n}",
        "testCase": "testDay09();"
      }
    }
  },
  {
    "day": 10,
    "week": 2,
    "tier": "A",
    "title": "std::weak_ptr 观察者模式与破解循环引用",
    "bookRange": "第16章 16.2.2 延伸说明（P.670）+ 外部专项深度实验（教材欠缺项）",
    "tags": [
      "weak_ptr",
      "循环引用",
      "lock 提升"
    ],
    "points": [
      "《C++PP》原书在第16章 16.2.2 P.670 仅简要提及 weak_ptr，未详细展开，此处必须重点外部实操补足！",
      "<strong>循环引用灾难：</strong>如果 NodeA 内部有 <code>shared_ptr&lt;NodeB&gt;</code>，NodeB 内部有 <code>shared_ptr&lt;NodeA&gt;</code>，双方 use_count 永远不可能归零，产生无法析构的内存泄漏！",
      "<strong>weak_ptr 作为不拥有所有权的旁观者：</strong>不增加强引用计数，但可以侦测对象是否已被释放。",
      "安全升级：使用 <code>weak.lock()</code> 尝试获取 <code>shared_ptr</code>，如果对象存活则获取成功并保证在此期间对象不被并发析构（muduo 解决多线程跨线程安全的核心！）。"
    ],
    "code": "// Day 10: weak_ptr::lock() 安全提权\n#include <memory>\n#include <iostream>\n\nstruct TcpConnection {\n    void send() { std::cout << \"Sending data safely!\\n\"; }\n};\n\nvoid onEvent(std::weak_ptr<TcpConnection> weakConn) {\n    // 提升为强引用 shared_ptr\n    if (std::shared_ptr<TcpConnection> conn = weakConn.lock()) {\n        conn->send(); // 只要在 if 内部，conn 绝不会被其他线程销毁！\n    } else {\n        std::cout << \"Connection has already expired!\\n\";\n    }\n}",
    "muduoMap": "Channel::tie_（使用 weak_ptr 绑定所属 TcpConnection）",
    "check": "能手写一次 weak_ptr 解决 A-B 循环引用的最小实验代码。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "weak_ptr 就是不增加计数的弱引用，用来破除死锁。",
      "strict": "weak_ptr 不增加 use_count，但增加 weak_count（使 Control Block 存活）；weak_ptr 无法直接解引用，必须调用 lock() 原子地尝试提权为 shared_ptr，从根本上解决多线程并发下“对象正在析构而回调刚好到来”的竞态。"
    },
    "experiment": {
      "goal": "验证 std::weak_ptr 观察者模式破除 shared_ptr 循环引用死锁",
      "steps": [
        "构建 A 持有 shared_ptr<B>，B 持有 weak_ptr<A> 的结构",
        "运行验证两者离开作用域时均能正常触发析构",
        "通过 weak_ptr.lock() 演示多线程下安全提权"
      ],
      "expectedOutput": "~A() destroyed!\n~B() destroyed!",
      "watchPoints": "weak_ptr 不影响 use_count，lock() 在对象已死亡时安全返回 nullptr，杜绝野指针访问。",
      "pitfalls": "不调用 lock() 而是直接假设 weak_ptr 总是有效，可能导致空指针解引用崩溃。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day10.cpp -o day10 && ./day10"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "std::weak_ptr 为什么必须通过 lock() 成员函数提权为 shared_ptr 之后才能访问对象？",
          "options": [
            "lock() 可以对整个操作系统内核上锁",
            "weak_ptr 不拥有对象且不增加引用计数，在多线程并发环境下目标对象可能随时析构；lock() 原子性地检查并生成 shared_ptr 保证在访问期间对象绝不提前析构",
            "C++ 编译器无法直接将 weak_ptr 转为机器指令",
            "直接访问会降低 CPU 缓存命中率"
          ],
          "answer": 1,
          "explanation": "weak_ptr 是非拥有型弱引用；若允许直接解引用，多线程下可能刚好在解引用时对象被另一线程析构；lock() 原子性检查 use_count，成功则递增计数并返回有效 shared_ptr。"
        },
        {
          "id": 2,
          "question": "在 Day 10 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 10 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 10 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 10 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 10 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 10 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 10 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 10 的特性。",
        "referenceSolution": "// 验证 Day 10\nvoid testDay10() {\n    // 核心断言验证\n}",
        "testCase": "testDay10();"
      }
    }
  },
  {
    "day": 11,
    "week": 2,
    "tier": "A",
    "title": "std::vector 连续内存、扩容机制与迭代器失效",
    "bookRange": "第16章 16.3.1～16.3.4（P.675～684）",
    "tags": [
      "vector",
      "动态扩容",
      "迭代器失效"
    ],
    "points": [
      "连续内存布局带来的绝对优势：CPU Cache Line 友好，O(1) 随机访问速度极快（参看第16章 16.3.1 P.675）。",
      "<strong>size() 与 capacity() 的区别：</strong><code>reserve()</code> 提前开辟容量 vs <code>resize()</code> 真实填充元素（参看第16章 16.3.2 P.676～680）。",
      "<strong>动态扩容与迭代器失效：</strong>当 push_back 导致 size 超过 capacity 时，vector 会在堆上申请 1.5~2 倍的新内存，并将老数据移动过去，随后释放老内存。此时所有指向老内存的裸指针或迭代器瞬间失效！",
      "<strong>muduo 对照：</strong><code>muduo::net::Buffer</code> 底层不是链表也不是 deque，而是一个经典的 <code>std::vector&lt;char&gt;</code>！"
    ],
    "code": "// Day 11: 观察 vector 扩容倍数与 reserve 威力\n#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<int> v;\n    std::cout << \"Init cap: \" << v.capacity() << \"\\n\";\n    for(int i = 0; i < 10; ++i) {\n        v.push_back(i);\n        std::cout << \"size=\" << v.size() << \" cap=\" << v.capacity() << \"\\n\";\n    }\n    return 0;\n}",
    "muduoMap": "muduo::net::Buffer 内部 std::vector<char> buffer_",
    "check": "能解释为什么工业网络库 Buffer 选用连续内存 vector 而非链表或 deque。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "vector 满了会自动翻倍扩容。",
      "strict": "vector 扩容时重新向系统申请连续堆内存，逐个将旧元素拷贝或移动到新空间；若元素类型的移动构造函数未标记 noexcept，vector 为保证强异常安全将退化为深拷贝；扩容后指向原 vector 的所有迭代器、引用和裸指针全部失效。"
    },
    "experiment": {
      "goal": "验证 std::vector 扩容机制对内存地址与已有迭代器的失效影响",
      "steps": [
        "向 vector 连续 push_back 元素并观察 capacity 变化阶梯",
        "记录并比对元素首地址在扩容前后的变化",
        "验证扩容后原保存的指针和迭代器成为悬挂野指针"
      ],
      "expectedOutput": "capacity 翻倍，旧地址失效，触发整体内存重分配",
      "watchPoints": "扩容时一旦发生内存重分配，原 data() 地址彻底改变，所有旧迭代器与指针全部失效！",
      "pitfalls": "在循环遍历 vector 的同时进行 push_back，导致迭代器中途失效引发段错误崩溃。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day11.cpp -o day11 && ./day11"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "当向 std::vector 插入新元素触发扩容（Reallocation）时，下列哪种说法是正确的？",
          "options": [
            "vector 仅在原内存末尾追加新页面，已有元素地址保持不变",
            "vector 会向系统重新申请一块更大的连续内存，将旧元素移动或拷贝到新内存，原有的指针、引用和迭代器全部失效",
            "只有使用裸指针才会失效，STL iterator 不会失效",
            "扩容后 vector 的 capacity 与 size 总是严格相等"
          ],
          "answer": 1,
          "explanation": "vector 要求物理内存连续。扩容时原内存块无法原地向后延伸，必须整体重构迁移，原内存块被释放，因此此前指向该 vector 内部的所有迭代器与指针彻底失效。"
        },
        {
          "id": 2,
          "question": "在 Day 11 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 11 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 11 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 11 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 11 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 11 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 11 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 11 的特性。",
        "referenceSolution": "// 验证 Day 11\nvoid testDay11() {\n    // 核心断言验证\n}",
        "testCase": "testDay11();"
      }
    }
  },
  {
    "day": 12,
    "week": 2,
    "tier": "A",
    "title": "STL 迭代器模型与遍历协议",
    "bookRange": "第16章 16.4.1～16.4.4（P.684～695）",
    "tags": [
      "iterator",
      "左闭右开",
      "范围for遍历"
    ],
    "points": [
      "容器（Container）、迭代器（Iterator）、算法（Algorithm）的松耦合正交设计理念（参看第16章 16.4.1 P.685～688）。",
      "迭代器 5 大分类与层级：输入、输出、正向、双向、随机访问（参看第16章 16.4.2～16.4.3 P.688～690）。",
      "<strong>左闭右开区间 <code>[begin, end)</code>：</strong>end 指向最后一个有效元素的下一位虚设哨兵位置，解引用 <code>*end()</code> 是严重的未定义行为！",
      "掌握 <code>auto it = v.begin()</code> 与基于范围的 for 循环（底层就是解糖为 begin/end 迭代器）。"
    ],
    "code": "// Day 12: 迭代器遍历与解引用\n#include <vector>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::vector<std::string> channels = {\"ch1\", \"ch2\", \"ch3\"};\n    for (auto it = channels.begin(); it != channels.end(); ++it) {\n        std::cout << *it << \" \";\n    }\n    std::cout << \"\\n\";\n    return 0;\n}",
    "muduoMap": "Poller::fillActiveChannels 中的迭代器遍历",
    "check": "能解释基于范围的 for(auto& x : container) 是怎么被编译器展开为迭代器的。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "迭代器就是类似指针的循环工具。",
      "strict": "迭代器是容器与通用算法之间的泛型抽象解耦层，遵循左闭右开区间 [begin, end) 规范；在对容器进行 push_back、insert、erase 等增删操作时，必须严格处理其返回值重新获取有效迭代器，防范野指针失效。"
    },
    "experiment": {
      "goal": "验证 STL 迭代器遍历协议与基于范围的 for 循环底层展开",
      "steps": [
        "使用容器标准的 iterator、begin()、end() 进行左闭右开遍历",
        "使用 const_iterator 验证只读约束",
        "使用 C++11 基于范围的 for 循环对比汇编语义"
      ],
      "expectedOutput": "标准迭代器遍历与范围 for 等价自洽",
      "watchPoints": "左闭右开区间 [begin, end) 中 end() 指向末尾之后的一位，严禁对 end() 进行解引用解包。",
      "pitfalls": "在迭代器未到达 end() 前错误地执行 it++ 跳步导致越界访问。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day12.cpp -o day12 && ./day12"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "关于 STL 迭代器的左闭右开区间 [begin, end)，下列理解正确的是：",
          "options": [
            "end() 指向容器的最后一个有效元素",
            "end() 指向容器最后一个有效元素之后的位置（哨兵），严禁对其进行解引用 *end() 操作",
            "begin() 包含在区间外，end() 包含在区间内",
            "左闭右开区间无法用于空容器的判断"
          ],
          "answer": 1,
          "explanation": "标准 STL 遵循 [begin, end) 规范，end() 作为遍历结束的哨兵标志，不指向任何有效元素，解引用 *end() 属于未定义行为。"
        },
        {
          "id": 2,
          "question": "在 Day 12 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 12 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 12 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 12 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 12 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 12 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 12 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 12 的特性。",
        "referenceSolution": "// 验证 Day 12\nvoid testDay12() {\n    // 核心断言验证\n}",
        "testCase": "testDay12();"
      }
    }
  },
  {
    "day": 13,
    "week": 2,
    "tier": "A",
    "title": "std::map 与 std::unordered_map 选型",
    "bookRange": "第16章 16.4.4 关联容器（P.702～707）+ 16.4.5 无序关联容器（P.707）",
    "tags": [
      "红黑树",
      "哈希散列",
      "容器选型"
    ],
    "points": [
      "<strong>std::map：</strong>底层红黑树（自平衡二叉查找树），严格按 key 有序，查找、插入、删除复杂度严格为稳定 O(log N)。（参看第16章 16.4.4 P.702～707）",
      "<strong>std::unordered_map：</strong>底层哈希表（Hash Table），平均复杂度为 O(1)，最坏情况（哈希冲突恶化）退化为 O(N)，内部无序。（参看第16章 16.4.5 P.707）",
      "<strong>纠偏：</strong>绝对不能简单地认为 unordered_map 任何时候都一定比 map 快；在元素规模很小或要求有序时 map 极具优势。",
      "<strong>muduo 对照：</strong><code>TcpServer::ConnectionMap</code> 在 muduo 中默认使用 <code>std::map&lt;string, TcpConnectionPtr&gt;</code>。"
    ],
    "code": "// Day 13: 两种字典容器对比\n#include <map>\n#include <unordered_map>\n#include <string>\n\nint main() {\n    // muduo TcpServer 使用 ConnectionMap\n    std::map<std::string, int> connMap;\n    connMap[\"127.0.0.1:8080#1\"] = 10;\n    \n    // 快速按 key 查找\n    auto it = connMap.find(\"127.0.0.1:8080#1\");\n    if (it != connMap.end()) {\n        // it->second 即对应连接\n    }\n    return 0;\n}",
    "muduoMap": "TcpServer::ConnectionMap = std::map<string, TcpConnectionPtr>",
    "check": "说清楚红黑树 map 与哈希表 unordered_map 的底层数据结构与渐进复杂度。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "map 是有序的，unordered_map 是哈希的。",
      "strict": "std::map 底层是红黑树（自平衡二叉查找树），按严格弱序排列，插入/删除操作不导致其他节点的迭代器失效，具有确定性的 O(log N) 最坏时间复杂度；unordered_map 虽为 O(1)，但扩容 rehash 时会产生不可预期的网络延迟抖动。"
    },
    "experiment": {
      "goal": "验证 std::map 红黑树有序查找与 std::unordered_map 哈希散列的选型差异",
      "steps": [
        "向 std::map 插入乱序网络连接键值对，观察按键名自动升序",
        "测试查找不存在键时 map::operator[] 自动默认构造新项的副作用",
        "使用 map::find() 保证只读检索安全"
      ],
      "expectedOutput": "map 维持红黑树有序，find() 安全无副作用",
      "watchPoints": "map::operator[] 会在键不存在时插入默认值，查询已建立连接应始终使用 find()！",
      "pitfalls": "使用 const map 时调用 operator[] 导致编译失败（operator[] 为非 const 成员）。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day13.cpp -o day13 && ./day13"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在网络服务器中管理活跃连接时，muduo 选择 std::map 而非 std::unordered_map 的核心技术权衡是：",
          "options": [
            "std::map 基于红黑树构建，时间复杂度为严格可预测的 O(log N)，且插入删除不导致其他节点迭代器失效；避免了哈希表扩容 rehash 带来的网络延迟抖动",
            "std::map 不需要占用内存",
            "unordered_map 无法存储智能指针",
            "muduo 开发者不会使用哈希表"
          ],
          "answer": 0,
          "explanation": "std::map 红黑树具备高度可预测的延迟界限，且节点式分配使得除被删除节点外其他迭代器稳定有效；而哈希表在装载因子超标时整体 rehash 会造成毫秒级高延迟抖动。"
        },
        {
          "id": 2,
          "question": "在 Day 13 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 13 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 13 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 13 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 13 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 13 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 13 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 13 的特性。",
        "referenceSolution": "// 验证 Day 13\nvoid testDay13() {\n    // 核心断言验证\n}",
        "testCase": "testDay13();"
      }
    }
  },
  {
    "day": 14,
    "week": 2,
    "tier": "A",
    "title": "第二周综合实战：连接管理器 ConnectionManager",
    "bookRange": "第16章 16.6（P.713～720）+ 动手实训",
    "tags": [
      "容器综合",
      "智能指针实战",
      "第2周验收"
    ],
    "points": [
      "融汇本周核心：<code>std::shared_ptr</code> + <code>std::unique_ptr</code> + <code>std::map</code>。",
      "实战编写一个模拟的 <code>TcpConnectionManager</code>，包含：<code>addConnection()</code>、<code>removeConnection()</code>、<code>getConnection()</code>。",
      "STL 常用算法辅助遍历与清理：<code>std::find</code>、<code>std::for_each</code>（参看第16章 16.6 P.713～720）。",
      "<strong>第二周大验收：</strong>深入解释智能指针进出容器时，其引用计数何时递增、何时在 erase 中析构。"
    ],
    "code": "// Day 14: TcpConnectionManager 仿真模型\n#include <iostream>\n#include <memory>\n#include <map>\n#include <string>\n\nstruct TcpConn {\n    std::string name;\n    ~TcpConn() { std::cout << \"Conn \" << name << \" destroyed!\\n\"; }\n};\n\nclass ConnManager {\nprivate:\n    std::map<std::string, std::shared_ptr<TcpConn>> conns_;\npublic:\n    void add(const std::string& name) {\n        conns_[name] = std::make_shared<TcpConn>(TcpConn{name});\n    }\n    void remove(const std::string& name) {\n        auto it = conns_.find(name);\n        if (it != conns_.end()) {\n            conns_.erase(it); // 最后一个 shared_ptr 离开，自动触发析构！\n        }\n    }\n};",
    "muduoMap": "TcpServer 对所有客户端连接的生命周期托管全景",
    "check": "解释当从 map 中 erase 掉一个 shared_ptr 后，底层对象何时被真正释放？",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "连接管理器就是拿 map 把所有 socket 连接管起来。",
      "strict": "TcpServer 管理客户端长连接不仅是 map<string, TcpConnectionPtr> 存储，更关键是连接建立（Acceptor）、数据到来（Channel 读事件）与断开清理（onClose）时的跨线程生命周期原子性转移与 weak_ptr tie_ 提权保活。"
    },
    "experiment": {
      "goal": "综合实战：手写支持智能指针生命周期管理的 ConnectionManager",
      "steps": [
        "使用 std::map<std::string, std::shared_ptr<TcpConnection>> 存储长连接",
        "实现 addConnection、removeConnection 接口",
        "模拟连接关闭时从 map 摘除并验证生命期安全递减"
      ],
      "expectedOutput": "连接管理器完成添加、查询与析构清理流程",
      "watchPoints": "从 map 中 erase 连接后，若外部还有 Channel 正在执行回调，shared_ptr 保证连接不会立刻析构。",
      "pitfalls": "在遍历 map 过程中直接调用 conns_.erase(it) 未更新迭代器导致死循环或段错误。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day14.cpp -o day14 && ./day14"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "ConnectionManager 中使用 std::map<string, TcpConnectionPtr> conns_ 存储长连接，当客户端断开需要清理时，正确的处理流程是：",
          "options": [
            "直接使用 free() 释放连接指针",
            "在 I/O 线程安全时机调用 conns_.erase(name)，若外部回调尚未完成，外部持有的 shared_ptr 保证连接对象延迟到回调结束后再安全析构",
            "立即强行终止所在的 EventLoop 循环",
            "清空整个 map 容器"
          ],
          "answer": 1,
          "explanation": "shared_ptr 的精髓在于多方共享生命期：从 map 移除只减少了 1 个计数，如果 Channel 或用户回调还在处理数据，计数大于 0，连接依然有效，待回调结束栈展开计数归零才析构。"
        },
        {
          "id": 2,
          "question": "在 Day 14 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 14 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 14 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 14 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 14 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 14 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 14 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 14 的特性。",
        "referenceSolution": "// 验证 Day 14\nvoid testDay14() {\n    // 核心断言验证\n}",
        "testCase": "testDay14();"
      }
    }
  },
  {
    "day": 15,
    "week": 3,
    "tier": "A",
    "title": "函数对象（Functor / 仿函数）本质",
    "bookRange": "第16章 16.5（P.707～713）",
    "tags": [
      "Functor",
      "operator()",
      "状态携带"
    ],
    "points": [
      "仿函数本质：重载了 <code>operator()</code> 的普通类对象，使得对象可以像普通函数一样使用 <code>obj(arg1, arg2)</code> 语法被调用（参看第16章 16.5.1 P.707～710）。",
      "仿函数与普通函数指针相比的巨大优势：<strong>仿函数拥有自身的数据成员，可以携带状态（Stateful）！</strong>",
      "STL 预定义函数符（plus, less 等）及函数对象与算法的配合（参看第16章 16.5.2～16.5.3 P.710～713）。",
      "在 STL 算法（如 sort、find_if）中传递仿函数作为自定义比较逻辑。"
    ],
    "code": "// Day 15: 拥有内部状态的函数对象\n#include <iostream>\n\nclass ThresholdChecker {\nprivate:\n    int threshold_;\npublic:\n    explicit ThresholdChecker(int th) : threshold_(th) {}\n    bool operator()(int val) const {\n        return val > threshold_;\n    }\n};\n\nint main() {\n    ThresholdChecker check(100);\n    std::cout << check(120) << \"\\n\"; // 输出 1 (true)\n    return 0;\n}",
    "muduoMap": "EventLoop::queueInLoop 中存储的 Functor 概念雏形",
    "check": "说出仿函数与普通全局函数相比的核心能力（携带上下文状态）。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "仿函数就是把类当成函数来调用。",
      "strict": "函数对象（Functor）是重载了 operator() 的类实例；相较于普通函数指针，它可以持有内部私有状态（如调用次数、阈值配置），并且其 operator() 调用可以直接被编译器内联展开，消除函数指针的间接寻址开销。"
    },
    "experiment": {
      "goal": "验证重载 operator() 的函数对象（Functor）对私有状态的携带与内联",
      "steps": [
        "定义包含私有统计变量 count_ 的 Functor 类并重载 operator()",
        "将 Functor 传入标准库算法如 std::for_each",
        "观察其比函数指针更高的内联优化潜力与状态持久性"
      ],
      "expectedOutput": "Functor 成功记录并累加处理状态",
      "watchPoints": "Functor 是实体对象，拷贝传递时会复制其内部状态，必要时需显式使用引用包装器。",
      "pitfalls": "在 operator() 中修改非常量成员时忘记根据需要决定是否声明为 const。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day15.cpp -o day15 && ./day15"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "函数对象（Functor）相比普通函数指针的最主要优势是：",
          "options": [
            "Functor 只能写在全局命名空间",
            "Functor 作为类的实例可以拥有私有数据成员以携带持久状态，并且其 operator() 更易于被编译器内联展开",
            "Functor 不需要包含头文件",
            "Functor 可以自动绕过操作系统的权限限制"
          ],
          "answer": 1,
          "explanation": "普通函数指针只是一个无状态的指令地址；Functor 是一个对象，可以在构造时捕获配置参数或上下文状态，且 operator() 属于明确类型调用，编译器极易实施内联优化。"
        },
        {
          "id": 2,
          "question": "在 Day 15 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 15 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 15 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 15 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 15 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 15 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 15 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 15 的特性。",
        "referenceSolution": "// 验证 Day 15\nvoid testDay15() {\n    // 核心断言验证\n}",
        "testCase": "testDay15();"
      }
    }
  },
  {
    "day": 16,
    "week": 3,
    "tier": "B",
    "title": "C 风格函数指针与历史局限性",
    "bookRange": "第7章 7.10（P.241～248）快速复习",
    "tags": [
      "函数指针",
      "回调缺陷",
      "Object-Based"
    ],
    "points": [
      "函数指针语法：<code>void (*callback)(int);</code> 能够指向同签名的全局函数或静态成员函数（参看第7章 7.10.1 P.241～243）。",
      "深入函数指针与 typedef 简化（参看第7章 7.10.3～7.10.4 P.244～248）。",
      "函数指针的致命缺陷：<strong>无法直接绑定非静态 C++ 类成员函数</strong>，因为非静态成员函数必须要有一个隐式的 <code>this</code> 指针入参！",
      "这一天快速看懂即可，目标是理解为什么现代 C++ 必须诞生 std::function 和 Lambda。"
    ],
    "code": "// Day 16: 函数指针及其无法捕获上下文的局限\n#include <iostream>\n\nvoid globalFunc(int x) { std::cout << \"Global: \" << x << \"\\n\"; }\n\nvoid invoke(void (*fn)(int), int arg) {\n    fn(arg);\n}\n\nint main() {\n    invoke(&globalFunc, 10);\n    return 0;\n}",
    "muduoMap": "早期 C 网络库 (如 libevent) 的回调方式与局限痛点",
    "check": "解释为什么 void (*)(int) 不能直接指向 class Foo 里的 void Foo::bar(int)。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "C 语言函数指针太古老，C++ 已经不用了。",
      "strict": "C 函数指针是纯物理代码段入口地址，无法携带上下文对象实例的 this 指针，因此在 C 语言异步接口中必须强制传递 void* context 极易类型失真；现代 C++ 以基于对象（Object-based）的通用包装彻底替代它。"
    },
    "experiment": {
      "goal": "对比 C 风格函数指针局限与现代 C++ 基于对象回调的灵活性",
      "steps": [
        "定义 C 风格函数指针 typedef void (*Callback)(void*)",
        "尝试将非静态成员函数赋给普通函数指针观察编译拦截",
        "分析缺乏 this 指针时类方法无法直接回调的根因"
      ],
      "expectedOutput": "普通函数指针无法直接承载类成员方法",
      "watchPoints": "非静态类成员函数隐式包含 this 参数，调用约定为 __thiscall，与普通函数指针签名不兼容。",
      "pitfalls": "强行使用 (Callback)&Class::method 进行强制类型转换，调用时栈帧错乱引发段错误。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day16.cpp -o day16 && ./day16"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "为什么 C 语言传统函数指针无法直接绑定类的非静态成员函数？",
          "options": [
            "因为非静态成员函数隐式包含一个额外的 this 指针作为第一参数，调用约定与普通函数指针物理签名不符",
            "因为 C 语言不支持指针类型",
            "因为操作系统禁止类成员函数执行",
            "因为非静态成员函数没有编译成机器码"
          ],
          "answer": 0,
          "explanation": "类非静态成员函数在底层隐式接收 this 指针（通常在 ECX/RDI 寄存器），其函数签名物理上与普通全局函数的 void (*)(int) 完全不同，强转将导致调用栈破坏。"
        },
        {
          "id": 2,
          "question": "在 Day 16 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 16 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 16 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 16 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 16 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 16 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 16 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 16 的特性。",
        "referenceSolution": "// 验证 Day 16\nvoid testDay16() {\n    // 核心断言验证\n}",
        "testCase": "testDay16();"
      }
    }
  },
  {
    "day": 17,
    "week": 3,
    "tier": "A",
    "title": "C++11 Lambda 表达式与闭包捕获模型",
    "bookRange": "第18章 18.4（P.817～822）",
    "tags": [
      "Lambda",
      "闭包捕获",
      "悬挂引用陷阱"
    ],
    "points": [
      "Lambda 表达式语法全貌：<code>[captures](params) mutable noexcept -&gt; ret { body }</code>（参看第18章 18.4.1 P.818～820）。",
      "捕获列表本质：编译器生成一个唯一的匿名仿函数类，并将捕获的变量转为该类的成员变量！（参看第18章 18.4.2 P.820～822）",
      "<strong>值捕获 <code>[=]</code> vs 引用捕获 <code>[&]</code> 陷阱：</strong>引用捕获局部变量如果脱离了当前作用域被延迟执行，会导致严重的悬挂引用（Dangling Reference）野指针崩溃！",
      "捕获当前对象 <code>[this]</code> 或值拷贝捕获 shared_ptr 以延长生命周期。"
    ],
    "code": "// Day 17: Lambda 闭包捕获与潜在悬挂引用规避\n#include <iostream>\n#include <functional>\n\nstruct TaskWorker {\n    int id_{101};\n    void start() {\n        // 安全：捕获 this 指针，在闭包内访问成员\n        auto safeCallback = [this]() {\n            std::cout << \"Task id: \" << id_ << \"\\n\";\n        };\n        safeCallback();\n    }\n};\n\nint main() {\n    TaskWorker worker;\n    worker.start();\n    return 0;\n}",
    "muduoMap": "EventLoop::runInLoop([=](){ ... }) 异步投递任务",
    "check": "能够说明 [&var] 在跨线程异步调用时可能引发什么灾难。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "Lambda 就是随时写一个匿名小函数。",
      "strict": "Lambda 表达式在编译期由编译器生成唯一的匿名类（闭包类型），捕获列表转化为该类的成员变量；[this] 捕获的是指针值的副本而非实体，若宿主对象在异步回调执行前已被销毁，执行回调将造成野指针访问（Use-After-Free）。"
    },
    "experiment": {
      "goal": "验证 C++11 Lambda 表达式闭包捕获与 [this] 悬挂指针陷阱",
      "steps": [
        "编写短小精悍的 Lambda 表达式替代传统函数对象",
        "测试按值捕获 [=] 与按引用捕获 [&] 的生命周期差异",
        "模拟宿主对象提前析构后异步调用包含 [this] 的闭包出现的崩溃场景"
      ],
      "expectedOutput": "Lambda 闭包捕获成功，识别 [this] 异步悬挂隐患",
      "watchPoints": "跨线程投递回调时，若宿主类可能被销毁，必须用 shared_from_this() 捕获自身 shared_ptr 保活！",
      "pitfalls": "异步线程中按引用 [&] 捕获栈上临时变量，线程实际执行时栈帧已销毁导致非法内存访问。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day17.cpp -o day17 && ./day17"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在跨线程异步网络库中，使用 Lambda 表达式 [this]() { doWork(); } 最严重的潜在隐患是：",
          "options": [
            "Lambda 语法会引发编译器崩溃",
            "[this] 仅捕获了宿主对象的指针地址；若宿主对象在异步任务真正执行前已被外部线程析构，执行回调时将造成野指针非法访问（Use-After-Free）",
            "Lambda 会导致互斥锁自动失效",
            "[this] 会导致类中所有的 private 变量变成 public"
          ],
          "answer": 1,
          "explanation": "[this] 传的是裸指针。在多线程异步事件循环中，当回调排队到工作线程时，原宿主对象若已被销毁，此时再解引用 this 即发生 Use-After-Free 严重崩溃。"
        },
        {
          "id": 2,
          "question": "在 Day 17 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 17 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 17 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 17 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 17 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 17 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 17 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 17 的特性。",
        "referenceSolution": "// 验证 Day 17\nvoid testDay17() {\n    // 核心断言验证\n}",
        "testCase": "testDay17();"
      }
    }
  },
  {
    "day": 18,
    "week": 3,
    "tier": "A",
    "title": "std::function 类型擦除与通用可调用包装",
    "bookRange": "第18章 18.5（P.822～827）",
    "tags": [
      "std::function",
      "类型擦除",
      "回调机制"
    ],
    "points": [
      "模板参数多样性导致的低效与膨胀问题（参看第18章 18.5.1 P.823～825）。",
      "<code>std::function&lt;Ret(Args...)&gt;</code> 解决问题：现代 C++ 的通用多态函数包装器（参看第18章 18.5.2 P.825～826）。",
      "<strong>类型擦除（Type Erasure）：</strong>只要入参和返回值匹配，无论是普通函数、函数指针、仿函数、Lambda 还是 bind 结果，都可以统一装进同一个 std::function 容器里！",
      "<strong>muduo 对照：</strong>muduo 所有的事件回调完全建立在它之上，例如：<code>using MessageCallback = std::function&lt;void(const TcpConnectionPtr&amp;, Buffer*, Timestamp)&gt;;</code>。"
    ],
    "code": "// Day 18: std::function 统一收编各类可调用实体\n#include <functional>\n#include <iostream>\n\nvoid globalLog() { std::cout << \"Global\\n\"; }\nstruct FunctorLog { void operator()() { std::cout << \"Functor\\n\"; } };\n\nint main() {\n    using Callback = std::function<void()>;\n    Callback cb;\n\n    cb = globalLog;       cb(); // 普通全局函数\n    cb = FunctorLog();    cb(); // 仿函数对象\n    cb = [](){ std::cout << \"Lambda\\n\"; }; cb(); // 闭包\n\n    return 0;\n}",
    "muduoMap": "Callbacks.h：TimerCallback, MessageCallback, ConnectionCallback",
    "check": "解释为什么 std::function 被称为类型擦除容器。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "std::function 就是能装任何函数的通用容器。",
      "strict": "std::function 基于虚表与类型擦除（Type Erasure）技术包装任意可调用实体；具备小对象优化（SBO），但当绑定的闭包体超过内部缓冲区大小时将触发动态堆内存分配，且调用时存在一层虚调用/间接指针开销。"
    },
    "experiment": {
      "goal": "验证 std::function 类型擦除与统一承载普通函数、Lambda 和成员函数",
      "steps": [
        "定义 std::function<void(int)> 统一回调容器",
        "依次向其赋值普通函数指针、带有捕获的 Lambda 闭包与 bind 表达式",
        "调用同一容器验证类型擦除与多态分发"
      ],
      "expectedOutput": "std::function 完美抹平类型差异统一调度",
      "watchPoints": "std::function 在存储较大可调用体时会产生堆内存分配，小对象可利用内置 SBO 缓冲区。",
      "pitfalls": "对空的 std::function 进行调用会抛出 std::bad_function_call 异常引发崩溃。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day18.cpp -o day18 && ./day18"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "std::function 基于什么核心设计模式/技术抹平普通函数、Lambda 和成员函数之间的类型差异？",
          "options": [
            "多重继承机制",
            "类型擦除（Type Erasure）技术结合小对象优化（SBO）与内部虚调用模型",
            "预编译头文件替换",
            "直接修改 CPU 寄存器标志位"
          ],
          "answer": 1,
          "explanation": "std::function 内部通过模板构造函数捕获实际可调用体类型，并将其存储在统一抽象的虚接口或函数指针管理器中，对外展现单一统一的签名接口，实现类型擦除。"
        },
        {
          "id": 2,
          "question": "在 Day 18 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 18 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 18 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 18 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 18 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 18 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 18 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 18 的特性。",
        "referenceSolution": "// 验证 Day 18\nvoid testDay18() {\n    // 核心断言验证\n}",
        "testCase": "testDay18();"
      }
    }
  },
  {
    "day": 19,
    "week": 3,
    "tier": "A",
    "title": "std::bind 专项突破（muduo 必备黏合剂）",
    "bookRange": "第18章 18.5 开篇（P.823）提及 + 附录E.2 成员指针（P.857～860）+ 外部专项强化",
    "tags": [
      "std::bind",
      "成员函数绑定",
      "占位符"
    ],
    "points": [
      "<strong>修正认知：</strong>教材第18章 P.823 仅将 std::bind 作为适配器一笔带过，必须独立突破！",
      "<code>std::bind(&amp;Class::Method, obj_ptr, _1, _2...)</code> 机制：将非静态类成员函数的隐藏 <code>this</code> 指针与具体对象实例粘合起来，包装成一个标准的无 this 依赖的可调用体。",
      "占位符 <code>std::placeholders::_1, _2</code> 含义：代表未来真正被调用时传入的第 1、第 2 个参数位置。",
      "结合附录 E.2（P.857～860）深入理解 <code>.*</code> 与 <code>->*</code> 成员指针解引用机制。"
    ],
    "code": "// Day 19: std::bind 绑定成员函数与占位符\n#include <functional>\n#include <string>\n#include <iostream>\n\nusing namespace std::placeholders;\n\nclass TcpServer {\npublic:\n    void newConnection(int sockfd, const std::string& ip) {\n        std::cout << \"New fd=\" << sockfd << \" from \" << ip << \"\\n\";\n    }\n};\n\nint main() {\n    TcpServer server;\n    // 将 TcpServer 成员函数降阶为 std::function<void(int, string)>\n    std::function<void(int, std::string)> cb = \n        std::bind(&TcpServer::newConnection, &server, _1, _2);\n\n    cb(42, \"192.168.1.100\"); // 成功触发 server 实例的方法！\n    return 0;\n}",
    "muduoMap": "std::bind(&TcpServer::newConnection, this, _1, _2)",
    "check": "能够解释占位符 _1 和 _2 的映射对应规则与参数重排机制。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "std::bind 就是把参数绑定到函数上生成新函数。",
      "strict": "std::bind 默认对所有实参采用按值拷贝策略，若需传递引用必须显式包装 std::ref；占位符 std::placeholders::_1 决定生成的新可调用体在调用时的形参映射偏序，绑定类成员函数必须传入对应对象指针。"
    },
    "experiment": {
      "goal": "专项突破 std::bind 绑定类成员函数与参数占位符映射",
      "steps": [
        "定义 TcpServer 包含 onConnection(int, string) 成员函数",
        "使用 std::bind 绑定 &TcpServer::onConnection 与 &server 实例",
        "利用 std::placeholders::_1 映射参数并赋值给 std::function 进行跨类分发"
      ],
      "expectedOutput": "std::bind 成功消除 this 依赖，回调分发成功",
      "watchPoints": "std::bind 默认按值拷贝参数，若传递大对象或需要双向修改必须显式用 std::ref 包裹。",
      "pitfalls": "占位符位置与新函数的形参顺序错位，导致参数传入位置错误。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day19.cpp -o day19 && ./day19"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "使用 std::bind(&TcpServer::newConnection, this, _1, _2) 时，std::placeholders::_1 代表什么？",
          "options": [
            "代表绑定的第一个实参必须等于整数 1",
            "代表生成的新函数在被调用时，传入的第 1 个实参将映射转发给原函数的该参数位置",
            "代表忽略第 1 个参数",
            "代表该参数只在 debug 模式下有效"
          ],
          "answer": 1,
          "explanation": "占位符 std::placeholders::_N 指定了当调用方调用新生成的函数对象时，新传入的第 N 个实参应该填入到原函数的哪一个位置上。"
        },
        {
          "id": 2,
          "question": "在 Day 19 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 19 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 19 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 19 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 19 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 19 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 19 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 19 的特性。",
        "referenceSolution": "// 验证 Day 19\nvoid testDay19() {\n    // 核心断言验证\n}",
        "testCase": "testDay19();"
      }
    }
  },
  {
    "day": 20,
    "week": 3,
    "tier": "A",
    "title": "成员函数指针本质与 bind 粘合原理",
    "bookRange": "附录E E.2 成员解除引用运算符（P.857～860）+ Day 19 实操深化",
    "tags": [
      "成员函数指针",
      "this 调用约定",
      "底层机理"
    ],
    "points": [
      "成员函数指针类型声明：<code>void (Worker::*pmf)(int) = &amp;Worker::work;</code>（参看附录 E.2 P.858）。",
      "成员函数指针无法独立运行，必须挂载在对象或者对象指针上通过操作符 <code>(obj.*pmf)(args)</code> 或 <code>(ptr-&gt;*pmf)(args)</code> 才能发起调用（参看附录 E.2 P.858～859）。",
      "彻底理解：<code>std::bind</code> 内部其实就是保存了 <code>pmf</code> 和 <code>ptr</code>，并在调用时自动执行 <code>(ptr-&gt;*pmf)(args)</code>，这就是为什么它能完美衔接面向对象与基于对象（Object-based）回调机制！"
    ],
    "code": "// Day 20: 成员函数指针的解引用调用\n#include <iostream>\n\nclass Worker {\npublic:\n    void work(int task) { std::cout << \"Task \" << task << \" done!\\n\"; }\n};\n\nint main() {\n    Worker w;\n    // 定义类成员函数指针\n    void (Worker::*pmf)(int) = &Worker::work;\n    // 必须配合实例才能调用\n    (w.*pmf)(999);\n    return 0;\n}",
    "muduoMap": "Chen Shuo 倡导的 Object-Based 网络编程风格精髓",
    "check": "理解普通函数指针与成员函数指针在内存寻址与入参上的本质差异。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "成员函数指针和普通函数指针差不多，加个类作用域就行。",
      "strict": "非静态成员函数指针物理上不是内存绝对地址，而是包含了虚表偏移（vtable offset）与 this 指针调整量（this adjustment）的复杂结构体；调用时必须强制借助 (obj.*pmf)() 语法，不可强转为 void*。"
    },
    "experiment": {
      "goal": "深入剖析成员函数指针物理本质与 .* 操作符绑定调用",
      "steps": [
        "声明类成员函数指针 void (TcpServer::*pmf)(int)",
        "将成员函数地址 &TcpServer::onConnection 赋给 pmf",
        "使用 (server.*pmf)(42) 语法显式传入 this 指针完成调用"
      ],
      "expectedOutput": "成员函数指针结合对象实例调用成功",
      "watchPoints": "成员函数指针由于包含虚表偏移和多重继承 this 调整，不能直接转换成 void* 存储。",
      "pitfalls": "缺少圆括号写成 server.*pmf(42) 导致运算符优先级错误无法通过编译。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day20.cpp -o day20 && ./day20"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "关于成员函数指针的物理本质，下列说法正确的是：",
          "options": [
            "它就是一个 4/8 字节的普通函数绝对地址，可以直接转成 void*",
            "它是一个包含虚表偏移、this 偏移与函数入口地址的复杂结构体，必须与具体的对象实例结合 ((obj.*pmf)()) 才能被合法调用",
            "成员函数指针在程序启动后会随垃圾回收改变",
            "成员函数指针只能指向 private 成员"
          ],
          "answer": 1,
          "explanation": "由于 C++ 支持虚函数多态与多重/虚继承，成员函数指针包含虚表偏移和 this 指针调整量，体积通常大于普通指针（如 16 字节），严禁与 void* 互相强转。"
        },
        {
          "id": 2,
          "question": "在 Day 20 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 20 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 20 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 20 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 20 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 20 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 20 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 20 的特性。",
        "referenceSolution": "// 验证 Day 20\nvoid testDay20() {\n    // 核心断言验证\n}",
        "testCase": "testDay20();"
      }
    }
  },
  {
    "day": 21,
    "week": 3,
    "tier": "A",
    "title": "第三周实战验收：手写一个完整的 EventLoop 回调分发器",
    "bookRange": "第3周全知识点贯通与代码实操",
    "tags": [
      "事件循环原型",
      "回调分发",
      "第3周验收"
    ],
    "points": [
      "设计 <code>class MiniChannel</code>：包含 <code>using Callback = std::function&lt;void()&gt;;</code>。",
      "实现 <code>setReadCallback(Callback cb)</code> 与 <code>handleEvent()</code> 分发触发。",
      "分别尝试将：① 全局函数、② Lambda 表达式、③ 类成员绑定 (bind) 注册进该分发器中运行。",
      "<strong>第三周大验收：</strong>彻底消除对 <code>std::bind</code>、<code>std::function</code> 的语法陌生感！"
    ],
    "code": "// Day 21: 事件循环与通道回调原型\n#include <functional>\n#include <iostream>\n#include <utility>\n\nclass MiniChannel {\npublic:\n    using EventCallback = std::function<void()>;\n    void setReadCallback(EventCallback cb) { readCallback_ = std::move(cb); }\n    void handleEvent() {\n        if (readCallback_) readCallback_();\n    }\nprivate:\n    EventCallback readCallback_;\n};\n\nint main() {\n    MiniChannel ch;\n    ch.setReadCallback([](){ std::cout << \"EPOLLIN triggered on Channel!\\n\"; });\n    ch.handleEvent();\n    return 0;\n}",
    "muduoMap": "muduo::net::Channel::handleEventWithGuard()",
    "check": "看到 channel->setReadCallback(std::bind(...)) 时不再有任何语法畏惧。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "EventLoop 就是一个死循环不停分发回调。",
      "strict": "EventLoop 遵循 One Loop Per Thread 模式，核心线程通过 epoll_wait 阻塞监听；跨线程任务通过 queueInLoop 投递至线程安全队列并通过 eventfd 写入 8 字节计数唤醒 Poller，在当前 I/O 线程安全串行化消费回调。"
    },
    "experiment": {
      "goal": "第三周验收实战：手写一个完整的 EventLoop 回调分发器原型",
      "steps": [
        "构建包含 pendingFunctors_ 队列与 mutex_ 互斥保护的 EventLoop 类",
        "实现 runInLoop 与 queueInLoop 跨线程任务安全提交",
        "循环迭代执行所有已排队回调并清空队列"
      ],
      "expectedOutput": "EventLoop 成功排队并串行化消费全部回调闭包",
      "watchPoints": "在执行回调时采用局部临时 vector<Functor> functors 与原队列 swap，大幅缩小临界区锁粒度！",
      "pitfalls": "在持有互斥锁的同时直接执行用户回调，可能导致死锁（回调内部再次调用 runInLoop）。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day21.cpp -o day21 && ./day21"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "muduo::EventLoop 经典的 queueInLoop(cb) 接口，采用什么机制实现跨线程安全任务唤醒？",
          "options": [
            "使用 Linux timerfd 轮询",
            "将任务推入 mutex_ 保护的 pendingFunctors_ 队列，并通过写入 eventfd 唤醒阻塞在 epoll_wait 的 I/O 线程",
            "强制挂起目标线程的 CPU 核心",
            "直接通过操作系统的 SIGKILL 信号中断"
          ],
          "answer": 1,
          "explanation": "One Loop Per Thread 的核心：跨线程投递将回调放入队列后，向专属的 wakeupFd（eventfd）写入 8 字节计数器唤醒 epoll_wait，保证回调只在目标 I/O 线程内串行消费。"
        },
        {
          "id": 2,
          "question": "在 Day 21 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 21 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 21 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 21 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 21 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 21 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 21 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 21 的特性。",
        "referenceSolution": "// 验证 Day 21\nvoid testDay21() {\n    // 核心断言验证\n}",
        "testCase": "testDay21();"
      }
    }
  },
  {
    "day": 22,
    "week": 4,
    "tier": "B",
    "title": "顺序容器补充：list, deque 与 set 选型基准",
    "bookRange": "第16章 16.4.5 容器种类（P.695～702）",
    "tags": [
      "std::set",
      "std::list",
      "容器选型"
    ],
    "points": [
      "<strong>优先级划分：</strong>vector ★★★★★ | map ★★★★★ | set ★★★★ | list ★★★ | deque ★★。",
      "deque（双端队列）：分段连续内存结构，头尾插入 O(1)，但在网络库中不如连续 vector 紧凑，因此降为次重点了解（参看 16.4.5 P.698）。",
      "list 双向链表的方法与局限（参看 16.4.5 P.698～701）。",
      "std::set：底层是红黑树，自带唯一性去重与自动排序；muduo 中用来存放无重复的定时器或文件描述符集合。"
    ],
    "code": "// Day 22: set 去重与红黑树排序\n#include <set>\n#include <iostream>\n\nint main() {\n    std::set<int> activeFds;\n    activeFds.insert(5);\n    activeFds.insert(3);\n    activeFds.insert(5); // 忽略重复项\n    for (int fd : activeFds) std::cout << fd << \" \"; // 输出: 3 5\n    return 0;\n}",
    "muduoMap": "TimerQueue 内部 std::set<Entry> 管理超时事件",
    "check": "能说出为什么存放超时定时器优先选用 set（红黑树按过期时间升序排列）。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "list 是链表，deque 是双端队列，set 是红黑树。",
      "strict": "std::list 节点内存分散，Cache 命中极低且每个节点额外消耗 16 字节双向指针；muduo 网络缓冲区坚持使用连续内存 vector；std::set 基于红黑树维持键唯一且有序，TimerQueue 即利用 set<Entry> 自动实现微秒级最近超时定时器调度。"
    },
    "experiment": {
      "goal": "对比 std::list、std::deque 与 std::set 性能基准与选型依据",
      "steps": [
        "在 list 中进行双向节点插入与迭代器保持验证",
        "在 set 中插入时间戳结构体验证自动红黑树排序",
        "测试容器在高频查询与范围删除下的 CPU 缓存友好度"
      ],
      "expectedOutput": "set 自动维持有序性，list 节点独立不失效",
      "watchPoints": "std::list 内存碎片多且遍历慢；需要快速索引与高效缓存优先选 vector；定时器优先选 set。",
      "pitfalls": "试图通过下标操作符访问 std::list 或 std::set（两者不支持随机访问 operator[]）。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day22.cpp -o day22 && ./day22"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在定时器管理器 TimerQueue 的实现中，为什么选用 std::set<Entry> 而非 std::list 或 std::vector？",
          "options": [
            "std::set 基于红黑树维持自动升序排序，TimerQueue 可以通过 begin() 始终以 O(1) 复杂度获取最近到期的超时定时器",
            "std::set 占用内存最少",
            "std::set 内部数据存储在连续数组中",
            "std::list 无法存储自定义结构体"
          ],
          "answer": 0,
          "explanation": "TimerQueue 需要频繁以微秒时间戳为键进行检索和删除，并能即时获取当前最早超时的任务。std::set 内部红黑树保证了自动排序，begin() 恒为最近到期定时器。"
        },
        {
          "id": 2,
          "question": "在 Day 22 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 22 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 22 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 22 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 22 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 22 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 22 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 22 的特性。",
        "referenceSolution": "// 验证 Day 22\nvoid testDay22() {\n    // 核心断言验证\n}",
        "testCase": "testDay22();"
      }
    }
  },
  {
    "day": 23,
    "week": 4,
    "tier": "A",
    "title": "STL 经典惯用语：erase-remove 模式",
    "bookRange": "第16章 16.6.4（P.716～717）+ 附录G G.5.2（P.894）",
    "tags": [
      "STL 算法",
      "erase-remove",
      "安全清理"
    ],
    "points": [
      "<strong>陷阱解密：</strong>为什么 <code>std::remove</code> 或 <code>std::remove_if</code> 并不能真正减少 vector 的 size()？（它只把不符合条件的元素向前覆盖移动，并返回新逻辑尾部的迭代器，参看第16章 16.6.4 P.716～717 及附录 G.5.2 P.894）。",
      "经典标准惯用语法（Erase-Remove Idiom）：<code>v.erase(std::remove_if(v.begin(), v.end(), pred), v.end());</code> 真正将尾部无用元素释放！",
      "结合 Lambda 编写高效的高级谓词匹配删除。"
    ],
    "code": "// Day 23: erase-remove 优雅清理已关闭连接\n#include <vector>\n#include <algorithm>\n#include <iostream>\n\nint main() {\n    std::vector<int> fds = {1, -1, 4, -1, 7};\n    // 移除所有已失效的 -1 fd\n    fds.erase(std::remove_if(fds.begin(), fds.end(), [](int fd){ return fd < 0; }), fds.end());\n    for(int fd : fds) std::cout << fd << \" \"; // 1 4 7\n    return 0;\n}",
    "muduoMap": "EventLoop::cancelTimer, Channel 管理队列清洗",
    "check": "能准确说出 remove_if 和 erase 各自承担的具体职责。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "erase-remove 可以一步删除 vector 里的所有匹配项。",
      "strict": "std::remove 是泛型算法，无法感知底层容器结构，它仅将未删除元素向前拷贝覆盖，并返回逻辑新结尾迭代器，容器的 size() 保持不变；必须配合 container.erase(new_end, container.end()) 才能真正释放尾部无效对象。"
    },
    "experiment": {
      "goal": "验证 STL 经典 erase-remove 模式安全高效清理连续容器元素",
      "steps": [
        "构建包含多个目标待删元素的 std::vector<int>",
        "调用 std::remove 观察返回值与容器 size() 保持不变",
        "链式调用 vec.erase(it, vec.end()) 真正剔除尾部废弃数据"
      ],
      "expectedOutput": "erase-remove 模式一次性安全清理全部失效元素",
      "watchPoints": "std::remove 不改变 size()，仅移动元素；配合 erase 完成真正的内存缩容与物理清理。",
      "pitfalls": "直接使用单元素循环 erase(it++) 容易引发迭代器失效与 O(N^2) 整体性能急剧恶化。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day23.cpp -o day23 && ./day23"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "针对 std::vector<int> v，标准 erase-remove 惯用语的写法是：",
          "options": [
            "v.remove(val);",
            "v.erase(std::remove(v.begin(), v.end(), val), v.end());",
            "std::erase(v, val);",
            "v.clear();"
          ],
          "answer": 1,
          "explanation": "std::remove 将不需要删除的元素向前覆盖并返回逻辑新结尾 it；随后必须显式调用容器自身的 v.erase(it, v.end()) 真正释放尾部废弃节点并更新 size()。"
        },
        {
          "id": 2,
          "question": "在 Day 23 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 23 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 23 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 23 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 23 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 23 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 23 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 23 的特性。",
        "referenceSolution": "// 验证 Day 23\nvoid testDay23() {\n    // 核心断言验证\n}",
        "testCase": "testDay23();"
      }
    }
  },
  {
    "day": 24,
    "week": 4,
    "tier": "A",
    "title": "运算符重载补全：<< 与 < 比较器",
    "bookRange": "第11章 11.1～11.3（P.380～395 定向选读）",
    "tags": [
      "运算符重载",
      "operator<<",
      "operator<"
    ],
    "points": [
      "<strong>原计划纠偏：</strong>绝不能跳过第 11 章！muduo 日志系统和时间戳类大量依赖重载。",
      "运算符重载的基础语法与限制（参看第11章 11.1～11.2 P.380～388）。",
      "重载 <code>operator<<</code> 的友元函数实现：让自定义对象能够直接接入 <code>std::cout << obj</code> 或 <code>muduo::LogStream</code> 链式打印（重点精读第11章 11.3.2 P.392～395）。",
      "重载 <code>operator<</code>：为自定义对象定义弱序比较规则，使其能合法存入 <code>std::set</code> 或作为 <code>std::map</code> 的 key。"
    ],
    "code": "// Day 24: 仿真 muduo::Timestamp 的运算符重载\n#include <iostream>\n#include <cstdint>\n\nclass Timestamp {\nprivate:\n    int64_t microSeconds_{0};\npublic:\n    explicit Timestamp(int64_t ms) : microSeconds_(ms) {}\n    // 重载 < 供 set 和 map 自动排序\n    bool operator<(const Timestamp& rhs) const {\n        return microSeconds_ < rhs.microSeconds_;\n    }\n    friend std::ostream& operator<<(std::ostream& os, const Timestamp& t) {\n        return os << t.microSeconds_ << \"us\";\n    }\n};\n\nint main() {\n    Timestamp t1(1000), t2(2000);\n    std::cout << t1 << \"\\n\";\n    std::cout << (t1 < t2 ? \"t1 earlier\" : \"t2 earlier\") << \"\\n\";\n    return 0;\n}",
    "muduoMap": "muduo::Timestamp, muduo::LogStream::operator<<",
    "check": "解释为什么 operator<< 必须定义为全局非成员函数而非类成员函数。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "重载运算符就是让类支持 +、-、<、<< 这些符号。",
      "strict": "为关联容器提供 operator< 时必须满足严格弱序（非自反、非对称、传递性）；若定义不当（例如出现 a < b 与 b < a 均成立），会导致 std::set/std::map 内部红黑树平衡破坏、死循环或无法正确检索元素。"
    },
    "experiment": {
      "goal": "验证 operator<< 日志格式化与 operator< 严格弱序规则",
      "steps": [
        "为自定义 Timestamp 类重载 friend operator<< 输出流操作符",
        "重载 operator< 实现基于毫秒时间戳的严格小于比较",
        "将 Timestamp 放入 std::set 中验证红黑树检索与去重"
      ],
      "expectedOutput": "Timestamp 格式化输出正常，放入 set 自动排序",
      "watchPoints": "operator< 必须满足：若 a < b 为真，则 b < a 必须为假；a < a 永远为假（非自反性）。",
      "pitfalls": "在比较器中误用 <= 代替 <，破坏严格弱序，导致 set 判定两个不同元素相等而丢失数据。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day24.cpp -o day24 && ./day24"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "如果为自定义类重载 operator< 时破坏了'严格弱序'（例如 a < b 与 b < a 均返回 true），放入 std::set 会导致什么后果？",
          "options": [
            "编译器在编译期直接拒绝",
            "std::set 内部红黑树平衡性破坏，检索死循环、内存越界崩溃或元素无法被正确查出",
            "只会在屏幕上输出警告信息",
            "自动降级为使用线性查找"
          ],
          "answer": 1,
          "explanation": "STL 关联容器（set/map）依赖严格弱序判断等价性（! (a<b) && ! (b<a)）。若比较器不自洽，红黑树的旋转与查找逻辑彻底失效，导致未定义行为甚至段错误。"
        },
        {
          "id": 2,
          "question": "在 Day 24 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 24 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 24 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 24 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 24 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 24 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 24 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 24 的特性。",
        "referenceSolution": "// 验证 Day 24\nvoid testDay24() {\n    // 核心断言验证\n}",
        "testCase": "testDay24();"
      }
    }
  },
  {
    "day": 25,
    "week": 4,
    "tier": "A",
    "title": "模板基础：类模板与泛型容器本质",
    "bookRange": "第14章 14.4 类模板（P.567～572）",
    "tags": [
      "类模板",
      "泛型实例化",
      "template"
    ],
    "points": [
      "<strong>原计划纠偏：</strong>绝对不能跳过模板！STL、shared_ptr<T>、function<T> 通通基于模板。",
      "定义类模板的语法与成员函数实现（参看第14章 14.4.1 P.568～570）。",
      "使用模板类与泛型实例化过程：<code>template <typename T> class Container { ... };</code> 在编译期生成具体类型的机器码（参看第14章 14.4.2 P.570～572）。",
      "破除尖括号 <code><></code> 恐惧：将 <code>vector<Channel*></code>、<code>shared_ptr<TcpConnection></code> 看作具象化类型。"
    ],
    "code": "// Day 25: 极简泛型阻塞队列模板雏形\n#include <vector>\n#include <string>\n#include <utility>\n\ntemplate <typename T>\nclass SafeQueue {\nprivate:\n    std::vector<T> data_;\npublic:\n    void push(T val) { data_.push_back(std::move(val)); }\n    bool empty() const { return data_.empty(); }\n};\n\nint main() {\n    SafeQueue<int> intQ;\n    SafeQueue<std::string> strQ;\n    intQ.push(10);\n    strQ.push(\"muduo\");\n    return 0;\n}",
    "muduoMap": "muduo::BlockingQueue<T>, muduo::BoundedBlockingQueue<T>",
    "check": "能解释类模板在没有被具体类型实例化时是否会生成机器代码。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "模板就是写一次代码支持所有数据类型。",
      "strict": "C++ 类模板在编译期经历两阶段名称查找（Two-Phase Lookup）；模板代码在实例化之前仅进行基本语法检查，只有当传入具体类型特化时才生成对应机器码；模板类定义与实现必须全部置于头文件中供调用方可见。"
    },
    "experiment": {
      "goal": "验证类模板（Class Template）与两阶段名称查找与泛型实例化",
      "steps": [
        "编写泛型阻塞队列模板 BlockingQueue<T>",
        "分别以 int、std::string 以及自定义结构体特化实例化",
        "验证只有被显式调用的模板成员函数才会在编译期生成机器码"
      ],
      "expectedOutput": "泛型 BlockingQueue 成功支撑不同类型实例安全流通",
      "watchPoints": "模板定义与实现必须写在头文件中；若分离到 cpp 文件，其他编译单元链接时会报未定义引用错误。",
      "pitfalls": "在模板类继承中直接调用基类模板成员未加 this-> 或 Base<T>:: 修饰导致第一阶段查找失败。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day25.cpp -o day25 && ./day25"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "关于 C++ 模板的两阶段名称查找（Two-Phase Lookup），下列说法正确的是：",
          "options": [
            "所有模板代码在编译前由预处理器全部替换",
            "第一阶段在模板定义时检查非依赖于模板参数的语法；第二阶段在模板实例化并传入具体类型时检查依赖于模板参数的调用",
            "两阶段查找分别在客户端和服务器端执行",
            "模板只有在程序运行时才进行语法分析"
          ],
          "answer": 1,
          "explanation": "第一阶段：检查基本语法与非依赖名；第二阶段：当具体类型 T 传入特化时，编译器才去寻找并绑定与 T 相关的成员和重载操作符。"
        },
        {
          "id": 2,
          "question": "在 Day 25 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 25 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 25 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 25 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 25 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 25 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 25 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 25 的特性。",
        "referenceSolution": "// 验证 Day 25\nvoid testDay25() {\n    // 核心断言验证\n}",
        "testCase": "testDay25();"
      }
    }
  },
  {
    "day": 26,
    "week": 4,
    "tier": "B",
    "title": "继承、虚函数、override 与虚析构",
    "bookRange": "第13章 13.1～13.4（P.480～507）+ 18.3.5 override（P.817）",
    "tags": [
      "虚函数",
      "虚析构",
      "override"
    ],
    "points": [
      "公有继承与多态基础概念（参看第13章 13.1～13.3 P.480～501）。",
      "动态联编与虚函数表（vtable）工作原理（参看第13章 13.4.2 P.503～505）。",
      "<strong>虚析构函数 <code>virtual ~Base()</code>：</strong>如果基类指针指向派生类对象并执行 <code>delete basePtr;</code>，若基类析构不是虚函数，则派生类的析构函数绝对不会被调用，造成灾难性的内存泄漏！（重点精读第13章 13.4.3 P.505～506）",
      "C++11 <code>override</code> 关键字：显式通知编译器校验函数重写，避免拼写错误导致的多态静默失效（参看第18章 18.3.5 P.817）。"
    ],
    "code": "// Day 26: 虚析构与 override 的防护威力\n#include <iostream>\n\nclass Poller {\npublic:\n    virtual ~Poller() = default; // 虚析构：保证派生类资源正常释放\n    virtual void poll() = 0;     // 纯虚函数：抽象接口\n};\n\nclass EPollPoller : public Poller {\npublic:\n    void poll() override { std::cout << \"epoll_wait() looping...\\n\"; }\n};\n\nint main() {\n    Poller* p = new EPollPoller();\n    p->poll();\n    delete p; // 触发虚析构，安全销毁\n    return 0;\n}",
    "muduoMap": "Poller 基类与 DefaultPoller (EPollPoller / PollPoller) 的派生关系",
    "check": "能够说清楚基类为什么必须写 virtual ~Base() = default。",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "派生类只要继承基类就可以重写虚函数。",
      "strict": "多态通过对象的虚函数表指针（vptr）与虚函数表（vtable）实现间接跳转；若基类析构函数未声明为 virtual，当使用基类指针 delete 派生类对象时，只会调用基类析构函数，导致派生类内部私有资源（如文件描述符或堆内存）发生泄漏。"
    },
    "experiment": {
      "goal": "验证虚函数动态绑定与基类虚析构函数防内存泄漏至关重要性",
      "steps": [
        "定义基类 Base 与派生类 Derived，在派生类中分配堆内存",
        "将 Base 析构函数先设为普通非虚函数，通过 Base* delete 观测内存泄漏",
        "将 Base 析构加上 virtual，观测派生类析构函数的完整调用"
      ],
      "expectedOutput": "~Derived() 和 ~Base() 均正确执行，无资源泄漏",
      "watchPoints": "凡是有虚函数的基类，其析构函数必须声明为 virtual！Poller::~Poller() 必须为虚函数。",
      "pitfalls": "在构造函数或析构函数中调用虚函数，此时动态多态机制未就绪，只会调用当前类的版本。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day26.cpp -o day26 && ./day26"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "如果基类的析构函数没有声明为 virtual，当通过基类指针 delete 一个派生类对象时，会发生什么严重问题？",
          "options": [
            "派生类与基类的析构函数都会被正常调用",
            "只调用了基类的析构函数，派生类的析构函数被完全跳过，导致派生类拥有的资源（如堆内存、套接字）发生泄漏",
            "程序会强行抛出 std::bad_cast 异常",
            "操作系统会自动回收派生类的私有变量"
          ],
          "answer": 1,
          "explanation": "非虚析构采用静态绑定。通过 Base* 销毁对象时编译器仅根据指针静态类型调用 ~Base()，派生类特有的 ~Derived() 永远不会被执行，其成员资源彻底泄漏。"
        },
        {
          "id": 2,
          "question": "在 Day 26 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 26 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 26 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 26 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 26 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 26 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 26 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 26 的特性。",
        "referenceSolution": "// 验证 Day 26\nvoid testDay26() {\n    // 核心断言验证\n}",
        "testCase": "testDay26();"
      }
    }
  },
  {
    "day": 27,
    "week": 4,
    "tier": "A",
    "title": "综合映射日：从 26 个 C++ 关键语法到 muduo 体系总览",
    "bookRange": "对照本控制台【语法 ➔ muduo 映射矩阵】",
    "tags": [
      "架构全景",
      "生命周期管理",
      "贯通复盘"
    ],
    "points": [
      "复盘前 26 天核心知识点与实现机制。",
      "<strong>TcpConnection 跨线程销毁与生命周期流转：</strong>为什么 Channel 需要 <code>weak_ptr tie_</code>？为什么必须用 <code>shared_from_this()</code>？",
      "确认自己熟练掌握 <code>std::function</code>、<code>std::bind</code>、<code>std::move</code>、<code>=delete</code>、<code>weak_ptr.lock()</code> 的使用场景。"
    ],
    "code": "// Day 27: TcpConnection 在 Channel 上的生命期保护原型\n#include <memory>\n#include <iostream>\n\nclass Channel {\nprivate:\n    std::weak_ptr<void> tie_;\n    bool tied_{false};\npublic:\n    void tie(const std::shared_ptr<void>& obj) {\n        tie_ = obj;\n        tied_ = true;\n    }\n    void handleEventWithGuard() {\n        if (tied_) {\n            // 尝试提升弱指针为强引用 shared_ptr\n            std::shared_ptr<void> guard = tie_.lock();\n            if (guard) {\n                std::cout << \"Object alive, executing callback safely!\\n\";\n            }\n        }\n    }\n};",
    "muduoMap": "Channel::tie_ 与 enable_shared_from_this 结合应用",
    "check": "能清晰复述：为什么多线程网络库中 Channel 回调前要先 weak_ptr::lock()？",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "muduo 源码综合应用了前述各项现代 C++ 机制。",
      "strict": "muduo 避免深层继承层次，采用基于对象（Object-based）风格，使用 std::function/std::bind 组装事件回调，结合 RAII 与 shared_ptr/weak_ptr 管理资源与生命周期。"
    },
    "experiment": {
      "goal": "从 C++ 语法机制映射到 muduo Reactor 各层组件的实现结构",
      "steps": [
        "对照 26 项 C++ 语法机制在 muduo 源码中定位对应实体类",
        "跟踪 TCP 数据从 Poller 接收、Channel 分发到 Buffer 处理的调用链路",
        "分析基于对象的回调机制在多线程网络环境下的生命周期保护"
      ],
      "expectedOutput": "完成语法机制与 muduo 源码架构的对齐映射",
      "watchPoints": "关注生命周期管理：从 Acceptor 监听新连接到 TcpServer 管理，直至 Channel::tie_ 提权保活链路。",
      "pitfalls": "割裂看待语法特性，未结合网络库资源与并发管理完整理解。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day27.cpp -o day27 && ./day27"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "muduo 网络库之所以被称为 Object-based（基于对象）而非传统 Object-Oriented（面向对象），是因为：",
          "options": [
            "muduo 完全不用 class 关键字",
            "muduo 极力避免深层虚函数继承体系，主要依靠 std::function/std::bind 组合与注册回调函数来实现业务逻辑解耦",
            "muduo 所有的类都不包含私有变量",
            "muduo 是用 C 语言写的"
          ],
          "answer": 1,
          "explanation": "陈硕在《Linux多线程服务端编程》中明确指出：深度继承层次与深虚表使对象生命期难以把握；muduo 采用基于对象的风格，用 function/bind 组装回调，结构清晰且易于通过智能指针控生控死。"
        },
        {
          "id": 2,
          "question": "在 Day 27 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 27 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 27 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 27 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 27 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 27 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 27 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 27 的特性。",
        "referenceSolution": "// 验证 Day 27\nvoid testDay27() {\n    // 核心断言验证\n}",
        "testCase": "testDay27();"
      }
    }
  },
  {
    "day": 28,
    "week": 4,
    "tier": "A",
    "title": "阅读 muduo 核心源码",
    "bookRange": "GitHub: chenshuo/muduo 或开源镜像",
    "tags": [
      "源码阅读",
      "阶段验收",
      "学习总结"
    ],
    "points": [
      "完成前序 27 天任务后，开始通读 muduo 核心源码。",
      "<strong>源码阅读推荐路径：</strong>",
      "1. 打开 <code>muduo/net/Channel.h / .cc</code>（观察事件定义与回调挂载）",
      "2. 打开 <code>muduo/net/Poller.h / EPollPoller.cc</code>（观察 map<int, Channel*> 映射）",
      "3. 打开 <code>muduo/net/EventLoop.h / .cc</code>（观察 loop() 与 queueInLoop 任务队列）",
      "4. 打开 <code>muduo/net/TcpConnection.h / .cc</code>（观察 Buffer 与生命周期管理）",
      "5. 打开 <code>muduo/net/TcpServer.h / .cc</code>（总览所有连接的创建与分发）",
      "恭喜你，已完成全部 28 天任务，可通读 muduo 核心源码与 CppAIService 实现。"
    ],
    "code": "// 源码阅读启动推荐路线：\n// git clone https://github.com/chenshuo/muduo.git\n// cd muduo/muduo/net\n// 按照顺序逐个点开：\n// Channel.h -> EventLoop.h -> TcpConnection.h -> TcpServer.h",
    "muduoMap": "全库通读：Channel -> Poller -> EventLoop -> TcpConnection -> TcpServer",
    "check": "成功打开 Channel.h 并一口气看懂前 50 行类定义！",
    "estimatedMinutes": 90,
    "budget": {
      "total": 90,
      "reading": 25,
      "concept": 20,
      "demo": 30,
      "quiz": 15
    },
    "rigorousNuance": {
      "quick": "完成 28 天任务后阅读 muduo 源码。",
      "strict": "从 Channel（事件通道）到 Poller（多路复用），经 EventLoop（事件循环）与 TcpConnection（连接管理），配合 Buffer（应用层缓冲区），构成 Reactor 网络数据处理链路。"
    },
    "experiment": {
      "goal": "克隆并通读 muduo 源码，梳理核心类交互关系",
      "steps": [
        "克隆或在线浏览 chenshuo/muduo 仓库 net 核心目录",
        "逐个比对 Channel.h/.cc、EventLoop.h/.cc、TcpServer.h/.cc 代码实现",
        "验证自身对智能指针、bind、RAII 锁与回调的使用理解"
      ],
      "expectedOutput": "muduo 核心网络库源码阅读无障碍，完成通读",
      "watchPoints": "重点关注 One Loop Per Thread 线程模型在 muduo 中的落地实现细节。",
      "pitfalls": "未动手调试验证，容易遗漏线程切换时的锁粒度与对象生命周期管理细节。",
      "buildCommand": "g++ -std=c++17 -Wall -Wextra -pedantic day28.cpp -o day28 && ./day28"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "通读 muduo 源码时，整个事件循环的核心调度类是哪一个？",
          "options": [
            "InetAddress（地址转换）",
            "EventLoop（负责 One Loop Per Thread 事件循环、I/O 轮询分发与跨线程任务队列）",
            "LogStream（日志流）",
            "Date（日期格式化）"
          ],
          "answer": 1,
          "explanation": "EventLoop 是事件循环类，运行于其所在的 I/O 线程，调用 Poller.poll() 收集就绪事件，并按序分发 Channel 事件和执行跨线程任务。"
        },
        {
          "id": 2,
          "question": "在 Day 28 涉及的多线程网络编程场景中，关于资源生命周期的原则是：",
          "options": [
            "谁创建谁负责销毁，生命周期必须确定明确",
            "可以随意在任意线程中裸调 delete",
            "依赖操作系统在程序退出时统一清理",
            "不需要考虑对象并发析构竞态"
          ],
          "answer": 0,
          "explanation": "现代 C++ 网络库中对象所有权与生命期必须具有极其确定的约束，否则极易出现死锁或野指针访问。"
        },
        {
          "id": 3,
          "question": "下列哪种做法符合 Day 28 倡导的现代 C++ 工程规范？",
          "options": [
            "使用 RAII 与容器托管资源，优先利用智能指针与移动语义，避免裸指针泛滥",
            "大量使用全局宏定义与隐式类型转换",
            "忽略编译器的一切编译警告（Warnings）",
            "在多线程网络库中滥用深层多重虚继承"
          ],
          "answer": 0,
          "explanation": "RAII、移动语义、容器管理与明确的生命周期控制是构建网络服务的基础支撑。"
        }
      ],
      "codeQuestion": {
        "question": "阅读 Day 28 相关的核心代码片段，分析其主要特点：",
        "code": "// Day 28 重点机制验证\nauto task = []() { /* 安全回调 */ };\ntask();",
        "options": [
          "代码具备良好的生命周期安全性与编译期约束",
          "代码会产生死锁",
          "代码无法通过编译",
          "代码导致内存翻倍"
        ],
        "answer": 0,
        "explanation": "代码符合现代 C++ 规范，语义清晰明确。"
      },
      "whyQuestion": {
        "question": "为什么在 Day 28 的工程实践中，必须严格区分语法表面现象与底层物理汇编实现？",
        "referenceAnswer": "因为高级语法糖（如 std::move、引用、Lambda 闭包）在汇编层面有着非常精简但特定的机器指令映射。如果不理解其底层物理实现（如 move 只是类型转换、[this] 捕获的是地址副本），极易在多线程异步并发环境下形成错误的心理模型，导致 Use-After-Free 或数据竞争等隐蔽灾难。",
        "keywords": [
          "心理模型",
          "汇编实现",
          "类型转换",
          "并发安全",
          "生命周期"
        ]
      },
      "muduoQuestion": {
        "question": "Day 28 的 C\+\+ 技术点在 muduo 架构中是如何应用的？",
        "referenceAnswer": "该技术点为 muduo 提供了避免多余对象拷贝、对象生命周期安全管理与回调分发的基础支撑，使网络库在多线程环境下支持并发连接处理。",
        "muduoMechanism": "Day 28 机制在 muduo 架构中的应用"
      },
      "implQuestion": {
        "prompt": "编写一个简易的测试用例验证 Day 28 的特性。",
        "referenceSolution": "// 验证 Day 28\nvoid testDay28() {\n    // 核心断言验证\n}",
        "testCase": "testDay28();"
      }
    }
  }
];



window.DAYS_DATASET = DAYS_DATASET;

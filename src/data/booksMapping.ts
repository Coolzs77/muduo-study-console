export interface ChapterCheckpoint {
  chapterNum: number;
  title: string;
  bookPageRange: string;
  startPage: number;
  endPage: number;
  pdfStartPage: number; // 对应物理 PDF 页码（加了前置封面目录偏移）
  associatedDays: number[];
  coreTopics: string[];
  interviewFocus: string;
}

export interface BookSpec {
  id: 'chenshuo' | 'primer_plus';
  title: string;
  subTitle: string;
  author: string;
  fileName: string;
  fullLocalPath: string;
  pageOffset: number; // 书页 1 对应的 PDF 物理页
  chapters: ChapterCheckpoint[];
}

export const CHEN_SHUO_BOOK: BookSpec = {
  id: 'chenshuo',
  title: 'Linux 多线程服务端编程',
  subTitle: '使用 muduo C++ 网络库',
  author: '陈硕',
  fileName: 'Linux 多线程服务端编程 使用muduo C++网络库 (陈硕) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
  fullLocalPath: 'e:/workspace/C++_learning/Linux 多线程服务端编程 使用muduo C++网络库 (陈硕) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
  pageOffset: 24, // 书籍正文 P.1 对应 PDF 物理页 24
  chapters: [
    {
      chapterNum: 1,
      title: '线程安全的对象生命周期管理',
      bookPageRange: 'P.1 ~ P.35',
      startPage: 1,
      endPage: 35,
      pdfStartPage: 25,
      associatedDays: [1, 2, 3],
      coreTopics: ['对象析构与竞争条件', 'shared_ptr/weak_ptr 避免死锁', 'enable_shared_from_this 陷阱', '智能指针线程安全性'],
      interviewFocus: '大厂高频：为什么 shared_ptr 的引用计数是线程安全的但所指对象不是？如何在析构函数中防止被跨线程调用？'
    },
    {
      chapterNum: 2,
      title: '线程同步精要',
      bookPageRange: 'P.37 ~ P.68',
      startPage: 37,
      endPage: 68,
      pdfStartPage: 61,
      associatedDays: [4, 5],
      coreTopics: ['互斥器 MutexLock 与 RAII Guard', '条件变量 Condition 虚假唤醒', '倒计时门闩 CountDownLatch', '封装 POSIX 线程库'],
      interviewFocus: '为什么 pthread_cond_wait 必须配合互斥锁？为什么判断条件必须用 while 而不是 if？'
    },
    {
      chapterNum: 3,
      title: '多线程服务器的适用场合',
      bookPageRange: 'P.69 ~ P.96',
      startPage: 69,
      endPage: 96,
      pdfStartPage: 93,
      associatedDays: [6, 7],
      coreTopics: ['单线程 vs 多线程 Reactor 选型', 'one loop per thread 模型', '多线程处理长连接高并发', 'CPU 密集型 vs IO 密集型划分'],
      interviewFocus: '面试核心：什么是 Reactor 模式？为什么 muduo 采用 one loop per thread 方案？如何给每个工作线程分配连接？'
    },
    {
      chapterNum: 4,
      title: 'C++ 多线程系统编程精要',
      bookPageRange: 'P.97 ~ P.118',
      startPage: 97,
      endPage: 118,
      pdfStartPage: 121,
      associatedDays: [8],
      coreTopics: ['多线程与 fork() 陷阱', '线程局部存储 __thread', '安全的跨线程函数调用 runInLoop', '静态断言与编译期断言'],
      interviewFocus: '为什么多线程程序中严禁随意调用 fork()？muduo 是如何利用 runInLoop 把跨线程任务派发回目标 IO 线程的？'
    },
    {
      chapterNum: 5,
      title: '高效的多线程日志',
      bookPageRange: 'P.119 ~ P.146',
      startPage: 119,
      endPage: 146,
      pdfStartPage: 143,
      associatedDays: [9, 10],
      coreTopics: ['异步日志 AsyncLogging 架构', '双缓冲技术 Double Buffering', 'LogFile 滚动与落盘', '前后端无锁/少锁解耦'],
      interviewFocus: '项目亮点：muduo 异步日志为什么采用双缓冲技术？如果日志量瞬间暴增导致内存占用过大，muduo 是如何丢弃多余日志保命的？'
    },
    {
      chapterNum: 6,
      title: 'muduo 网络库简介与使用',
      bookPageRange: 'P.147 ~ P.184',
      startPage: 147,
      endPage: 184,
      pdfStartPage: 171,
      associatedDays: [11],
      coreTopics: ['muduo 目录结构与安装', 'CMake 工程集成', '基础事件回调接口 setConnectionCallback', '标准网络库公共接口设计'],
      interviewFocus: '如何设计一个基于回调（Callback）机制的网络服务端框架？'
    },
    {
      chapterNum: 7,
      title: 'muduo 编程示例',
      bookPageRange: 'P.185 ~ P.254',
      startPage: 185,
      endPage: 254,
      pdfStartPage: 209,
      associatedDays: [12, 13, 14],
      coreTopics: ['Echo 回显服务', 'Chat 聊天室与广播', 'Time/Daytime 协议实现', 'Sudoku 并发数独求解器', '多线程长连接架构落地'],
      interviewFocus: '多线程广播（如聊天室）中，如何高效遍历所有活跃 TcpConnection 并安全下发数据？'
    },
    {
      chapterNum: 8,
      title: 'muduo 网络库设计与实现（核心枢纽）',
      bookPageRange: 'P.255 ~ P.348',
      startPage: 255,
      endPage: 348,
      pdfStartPage: 279,
      associatedDays: [15, 16, 17, 18, 19, 20, 21],
      coreTopics: ['EventLoop 核心事件循环', 'Channel 通道与事件分发', 'Poller / EpollPoller 底层多路复用', 'Acceptor 监听连接接收', 'TcpConnection 完整生命周期', 'Buffer 动态应用层缓冲区（prependable + readIndex + writeIndex）'],
      interviewFocus: '必考死穴：详细讲讲 Channel 和 EpollPoller 的解耦关系？epoll 水平触发下 Buffer 如何解决非阻塞写数据没写完的问题？'
    },
    {
      chapterNum: 9,
      title: '分布式系统工程实践',
      bookPageRange: 'P.349 ~ P.410',
      startPage: 349,
      endPage: 410,
      pdfStartPage: 373,
      associatedDays: [22, 23],
      coreTopics: ['网络协议设计（Length-Header-Body）', 'Protobuf 序列化集成', 'RPC 原型机制', '心跳机制与应用层保活'],
      interviewFocus: 'TCP 粘包与分包怎么处理？为什么不能依赖 TCP KeepAlive 来检测死连接？应用层心跳怎么做？'
    },
    {
      chapterNum: 10,
      title: 'C++ 编译链接与头文件组织',
      bookPageRange: 'P.411 ~ P.446',
      startPage: 411,
      endPage: 446,
      pdfStartPage: 435,
      associatedDays: [24],
      coreTopics: ['头文件前向声明（Forward Declaration）', 'Pimpl 惯用法（Pointer to Implementation）', '库的二进制兼容性 ABI', '动态库与静态库链接陷阱'],
      interviewFocus: '什么是 Pimpl 模式？为什么大厂 C++ 基础库广泛使用 Pimpl？它对编译速度和 ABI 兼容性有什么影响？'
    },
    {
      chapterNum: 11,
      title: '反思与总结：网络编程常见陷阱',
      bookPageRange: 'P.447 ~ P.494',
      startPage: 447,
      endPage: 494,
      pdfStartPage: 471,
      associatedDays: [25, 26],
      coreTopics: ['SIGPIPE 信号忽略', 'SO_REUSEADDR 的端口复用真相', 'TIME_WAIT 状态与 2MSL 防护', '优雅停机（Graceful Shutdown）与 shutdownWrite'],
      interviewFocus: '高频拷问：对一个已经收到 FIN 的 socket 调用 write 会发生什么？怎么避免服务器因为 SIGPIPE 崩溃？'
    },
    {
      chapterNum: 12,
      title: '浅谈 C++ 内存模型',
      bookPageRange: 'P.495 ~ P.528',
      startPage: 495,
      endPage: 528,
      pdfStartPage: 519,
      associatedDays: [27, 28],
      coreTopics: ['原子操作 std::atomic', 'Memory Order 内存序基础（relaxed, acquire-release, seq_cst）', '编译器指令重排与 CPU 乱序', '无锁队列与单例模式 DCLP 的陷阱'],
      interviewFocus: '为什么在多核 CPU 下双重检查锁定（DCLP）必须使用内存栅栏或 C++11 局部静态变量？'
    }
  ]
};

export const PRIMER_PLUS_BOOK: BookSpec = {
  id: 'primer_plus',
  title: 'C++ Primer Plus（第6版）',
  subTitle: '中文版 · 现代 C++ 语言基石',
  author: 'Stephen Prata',
  fileName: 'C++ Primer Plus：中文版（第六版） (Stephen Prata) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
  fullLocalPath: 'e:/workspace/C++_learning/C++ Primer Plus：中文版（第六版） (Stephen Prata) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
  pageOffset: 30, // 书籍正文 P.1 对应 PDF 物理页 30
  chapters: [
    {
      chapterNum: 9,
      title: '内存模型和名称空间',
      bookPageRange: 'P.297 ~ P.338',
      startPage: 297,
      endPage: 338,
      pdfStartPage: 327,
      associatedDays: [1, 4],
      coreTopics: ['自动存储/静态存储/动态存储持续性', '内部链接与外部链接（static 与 extern）', '名称空间与作用域解析'],
      interviewFocus: 'static 关键字在 C++ 全局变量、函数、类成员中分别起什么作用？'
    },
    {
      chapterNum: 12,
      title: '类和动态内存分配',
      bookPageRange: 'P.421 ~ P.468',
      startPage: 421,
      endPage: 468,
      pdfStartPage: 451,
      associatedDays: [2, 16],
      coreTopics: ['深拷贝与浅拷贝', '隐式生成的成员函数', '赋值运算符重载与自赋值保护', 'placement new 定位放置语法'],
      interviewFocus: '写一个满足 Rule of Three / Rule of Five 的 Buffer 字符串类，注意处理自赋值和异常安全。'
    },
    {
      chapterNum: 13,
      title: '类继承与多态',
      bookPageRange: 'P.469 ~ P.524',
      startPage: 469,
      endPage: 524,
      pdfStartPage: 499,
      associatedDays: [15, 17],
      coreTopics: ['虚函数与多态原理（vptr 和 vtable）', '纯虚函数与抽象基类', '基类虚析构函数的重要性', 'protected 访问控制'],
      interviewFocus: '为什么基类的析构函数必须定义为 virtual？虚表指针存储在对象的哪个位置？构造函数为什么不能是虚函数？'
    },
    {
      chapterNum: 16,
      title: 'string 类和标准模板库 STL',
      bookPageRange: 'P.647 ~ P.744',
      startPage: 647,
      endPage: 744,
      pdfStartPage: 677,
      associatedDays: [3, 18],
      coreTopics: ['vector 动态扩容与迭代器失效', 'map 与 unordered_map（红黑树 vs 哈希桶）', 'STL 算法库与函数对象（Functor）'],
      interviewFocus: 'vector 在 push_back 时发生扩容，之前的迭代器为什么会失效？哈希表扩容 rehash 怎么优化？'
    },
    {
      chapterNum: 18,
      title: '探讨 C++ 新标准（C++11/14 现代特性核心）',
      bookPageRange: 'P.795 ~ P.858',
      startPage: 795,
      endPage: 858,
      pdfStartPage: 825,
      associatedDays: [1, 2, 8, 14, 20],
      coreTopics: ['左值、右值、将亡值（xvalue）', '右值引用与移动语义（std::move）', '通用引用（万能引用）与完美转发（std::forward）', 'Lambda 表达式与闭包捕获机制', 'std::function 和 std::bind 可调用对象封装', '智能指针 unique_ptr、shared_ptr、weak_ptr 原理'],
      interviewFocus: '大厂终极连环问：std::move 的底层实现是什么？完美转发解决了什么问题？lambda 按引用捕获局部变量为什么极易发生悬空引用？'
    }
  ]
};

// 提取书签页码或生成跳转 URL
export function generatePdfBrowserUrl(book: BookSpec, bookPage: number): string {
  const physicalPage = bookPage + book.pageOffset;
  const encodedName = encodeURIComponent(book.fileName);
  return `file:///e:/workspace/C++_learning/${encodedName}#page=${physicalPage}`;
}

// 提取书籍对应的 Day 章节关联
export function getChapterForDay(day: number, bookId: 'chenshuo' | 'primer_plus' = 'chenshuo'): ChapterCheckpoint | undefined {
  const book = bookId === 'chenshuo' ? CHEN_SHUO_BOOK : PRIMER_PLUS_BOOK;
  return book.chapters.find(c => c.associatedDays.includes(day));
}

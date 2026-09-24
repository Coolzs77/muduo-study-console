import os, glob, json, re, sys

sys.stdout.reconfigure(encoding='utf-8')

repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
md_dir = os.path.join(repo_root, "docs", "yuque_muduo")
dataset_path = os.path.join(repo_root, "js", "dataset-yuque.js")
manifest_path = os.path.join(md_dir, "manifest.json")

with open(manifest_path, "r", encoding="utf-8") as f:
    manifest = json.load(f)

# Read existing dataset-yuque.js to keep yq_01 ~ yq_17
with open(dataset_path, "r", encoding="utf-8") as f:
    orig_code = f.read()

# Extract the existing YUQUE_DATASET array
# We can evaluate or parse it
# Find where yq_01 starts
idx = orig_code.find('{\n    "id": "yq_01"')
if idx == -1:
    idx = orig_code.find('"id": "yq_01"')
    if idx != -1:
        idx = orig_code.rfind('{', 0, idx)

if idx == -1:
    print("Error: Could not locate yq_01 in dataset-yuque.js!")
    sys.exit(1)

http_articles_part = orig_code[idx:]

# Tags and module mappings for the 10 muduo articles
metadata_map = {
    1: {
        "category": "项目概述",
        "tags": ["版本演进", "优化重点", "代码精简", "无Boost依赖"],
        "linkedModule": "muduo_core",
        "linkedModuleTitle": "muduo 网络库核心架构",
        "linkedSourceFiles": ["README.md", "CMakeLists.txt"],
        "linkedClasses": ["TcpServer", "EventLoop"],
        "linkedFunctions": ["main()"],
        "interviewKeyPoints": ["如何向面试官介绍你的 C++11 muduo 重构项目？", "重构版 muduo 去除了哪些冗余依赖？"],
        "summary": "版本二全面优化了知识布局与代码结构，将每个部分职责清晰划分，重点补充了 Channel、Poller、EventLoop 等核心类的代码讲解与生命周期管理。"
    },
    2: {
        "category": "学习指南",
        "tags": ["学习周期", "C++11", "回调机制", "智能指针"],
        "linkedModule": "muduo_core",
        "linkedModuleTitle": "muduo 学习路径规划",
        "linkedSourceFiles": ["Callbacks.h", "Timestamp.h"],
        "linkedClasses": ["std::function", "std::shared_ptr", "Timestamp"],
        "linkedFunctions": ["setReadCallback()"],
        "interviewKeyPoints": ["C++ 回调机制是如何实现的？", "为什么 muduo 选择基于对象而不是面向对象？"],
        "summary": "针对不同基础同学（进阶 vs 初学）制定科学的学习周期（10天 vs 20天），阐述 2000 行精简重构代码的精读要领与前置知识补齐策略。"
    },
    3: {
        "category": "架构大纲",
        "tags": ["陈硕官方库对比", "项目结构", "CMake构建"],
        "linkedModule": "muduo_core",
        "linkedModuleTitle": "muduo 源码树总览",
        "linkedSourceFiles": ["TcpServer.h", "EventLoop.h", "Channel.h", "Poller.h"],
        "linkedClasses": ["TcpServer", "EventLoop", "Channel", "Poller"],
        "linkedFunctions": ["start()", "loop()"],
        "interviewKeyPoints": ["muduo 官方库与星球精简重构版的核心差异是什么？", "CMake 现代化构建流程如何设计？"],
        "summary": "梳理项目源码大纲，从陈硕官方库对比出发，梳理项目各头文件与实现文件职责，明确 CMakeLists.txt 跨平台编译架构。"
    },
    4: {
        "category": "设计模式",
        "tags": ["Reactor模型", "多路复用", "非阻塞IO", "事件驱动", "线程模型"],
        "linkedModule": "muduo_core",
        "linkedModuleTitle": "Reactor 反应堆核心架构",
        "linkedSourceFiles": ["EventLoop.cc", "Channel.cc", "EPollPoller.cc"],
        "linkedClasses": ["EventLoop", "Channel", "Poller"],
        "linkedFunctions": ["loop()", "poll()"],
        "interviewKeyPoints": ["什么是 Reactor 模式？它与 Proactor 模式的区别是什么？", "为什么非阻塞 I/O 必须搭配 I/O 多路复用使用？"],
        "summary": "深入剖析为什么要做 muduo 网络库，深度对比阻塞 I/O、多进程/多线程与非阻塞 Reactor 模型在万级长连接下的吞吐量差异。"
    },
    5: {
        "category": "核心组件",
        "tags": ["核心组件三剑客", "数据流转", "时序图解", "OneLoopPerThread"],
        "linkedModule": "muduo_core",
        "linkedModuleTitle": "Reactor 核心组件协同机制",
        "linkedSourceFiles": ["EventLoop.h", "Channel.h", "Poller.h"],
        "linkedClasses": ["EventLoop", "Channel", "Poller"],
        "linkedFunctions": ["updateChannel()", "handleEvent()"],
        "interviewKeyPoints": ["Channel 与 Poller 是如何解耦的？", "EventLoop 如何扮演整个反应堆的大脑？"],
        "summary": "全景梳理 muduo 框架核心模块关系，图解 Event、Reactor、Demultiplex 与 EventHandler 调用链路，明确底层运转宏观拓扑。"
    },
    6: {
        "category": "重点源码精讲",
        "tags": ["Channel保姆类", "EPollPoller", "EventLoop主循环", "Acceptor", "Buffer栈空间", "TcpConnection生命周期", "TcpServer"],
        "linkedModule": "muduo_core",
        "linkedModuleTitle": "muduo 7大核心类逐行源码精读",
        "linkedSourceFiles": ["Channel.cc", "EPollPoller.cc", "EventLoop.cc", "Acceptor.cc", "Buffer.cc", "TcpConnection.cc", "TcpServer.cc"],
        "linkedClasses": ["Channel", "EPollPoller", "EventLoop", "Acceptor", "Buffer", "TcpConnection", "TcpServer"],
        "linkedFunctions": ["enableReading()", "poll()", "loop()", "handleRead()", "readFd()", "send()", "newConnection()"],
        "interviewKeyPoints": ["Channel::tie() 为什么能防止悬空指针崩溃？", "Buffer 为什么采用 readv 分散读和 64KB 栈临时空间？", "TcpConnection 状态机迁移逻辑是什么？"],
        "summary": "全文逾 1.3 万字硬核解析！逐行剖析 Channel、Poller、EventLoop、Acceptor、Buffer、TcpConnection、TcpServer 七大核心类源码与生命周期管理。"
    },
    7: {
        "category": "工具组件",
        "tags": ["异步日志系统", "双缓冲技术AsyncLogging", "Timestamp时间戳", "noncopyable", "Socket", "InetAddress"],
        "linkedModule": "muduo_core",
        "linkedModuleTitle": "高并发辅助工具与基础设施",
        "linkedSourceFiles": ["AsyncLogging.cc", "LogFile.cc", "Timestamp.cc", "Socket.cc", "InetAddress.cc"],
        "linkedClasses": ["AsyncLogging", "LogFile", "Timestamp", "noncopyable", "Socket", "InetAddress"],
        "linkedFunctions": ["AsyncLogging::append()", "Timestamp::now()"],
        "interviewKeyPoints": ["异步日志的双缓冲技术原理是什么？为什么要用指针 swap？", "SO_REUSEPORT 与 SO_REUSEADDR 的区别是什么？"],
        "summary": "深入剖析 AsyncLogging 双缓冲异步日志设计，解析前端无锁写入与后端独立落盘机制，剖析微秒级 Timestamp 与 Socket 基础配置。"
    },
    8: {
        "category": "八股与扩展",
        "tags": ["IO多路复用", "select/poll/epoll", "ET边缘触发vsLT水平触发", "EPOLLONESHOT", "阻塞vs非阻塞", "吞吐量压测"],
        "linkedModule": "muduo_core",
        "linkedModuleTitle": "Linux 网络底层原理精研",
        "linkedSourceFiles": ["EPollPoller.cc", "Socket.cc"],
        "linkedClasses": ["EPollPoller", "Socket"],
        "linkedFunctions": ["epoll_ctl()", "epoll_wait()"],
        "interviewKeyPoints": ["select/poll/epoll 的区别与底层实现？", "为什么 ET 模式必须搭配非阻塞 I/O？", "EPOLLONESHOT 事件解决了什么并发问题？"],
        "summary": "深入剖析 select/poll/epoll 三大多路复用机制，详细对比水平触发（LT）与边缘触发（ET）在多线程下的行为差异与避坑方案。"
    },
    9: {
        "category": "求职面试",
        "tags": ["腾讯IEG上岸", "STAR法则", "简历项目包装", "面试避坑", "难点提炼", "引导面试官"],
        "linkedModule": "muduo_core",
        "linkedModuleTitle": "大厂求职实战与简历打造",
        "linkedSourceFiles": ["README.md"],
        "linkedClasses": ["TcpServer", "EventLoop", "Channel"],
        "linkedFunctions": ["main()"],
        "interviewKeyPoints": ["如何将 muduo 项目用 STAR 法则写入简历？", "如何回答面试官关于项目难点和性能亮点的追问？"],
        "summary": "24届腾讯 IEG 上岸录友倾囊相授：如何将 C++11 muduo 重构项目写成具有大厂吸引力的简历，提炼 5 大量化亮点与 STAR 应答法则。"
    },
    10: {
        "category": "难点与高频面试",
        "tags": ["数据发送中连接关闭", "enable_shared_from_this", "channel_->tie()", "__thread/thread_local", "跨线程安全", "runInLoop/queueInLoop", "eventfd唤醒", "Buffer readv分散读", "epoll惊群", "SIGPIPE"],
        "linkedModule": "muduo_core",
        "linkedModuleTitle": "muduo 5大核心难点与面试官连环问",
        "linkedSourceFiles": ["TcpConnection.cc", "EventLoop.cc", "Buffer.cc", "Channel.cc"],
        "linkedClasses": ["TcpConnection", "EventLoop", "Buffer", "Channel"],
        "linkedFunctions": ["tie()", "HandleEventWithGuard()", "runInLoop()", "queueInLoop()", "wakeup()", "readFd()"],
        "interviewKeyPoints": ["TcpConnection 正在发送数据时断开连接，如何保证数据安全发完再释放资源？", "如何保证一个线程只有一个 EventLoop？", "如何保证不能跨线程调用的函数不会跨线程执行？", "Buffer 为什么使用 readv 分散读和 64KB 栈内存？", "服务端如何防范 SIGPIPE 信号导致崩溃？"],
        "summary": "重磅面试实战精选！深度剖析对象生命周期竞争、One Loop Per Thread 守卫、跨线程安全派发等 5 大硬核难点，提供 11 道面试官必杀问题与标准答案。"
    }
}

new_muduo_articles = []

for item in manifest:
    order = item["order"]
    md_file_path = os.path.join(md_dir, item["filename"])
    with open(md_file_path, "r", encoding="utf-8") as f:
        raw_md = f.read()
    
    # Strip YAML frontmatter
    # Find second ---
    parts = re.split(r'^---\s*$', raw_md, flags=re.MULTILINE)
    if len(parts) >= 3:
        clean_content = "---".join(parts[2:]).strip()
    else:
        clean_content = raw_md.strip()
        
    meta = metadata_map.get(order, {})
    
    article_obj = {
        "id": f"yq_muduo_{order:02d}",
        "bookId": "muduo-core",
        "bookTitle": "网络库muduo-core",
        "bookBadge": "muduo-core 核心",
        "index": order,
        "doc_id": item["doc_id"],
        "title": item["title"],
        "slug": item["slug"],
        "url": item["url"],
        "level": 0,
        "category": meta.get("category", "核心组件"),
        "wordCount": item["word_count"],
        "updatedAt": item["updated_at"],
        "hash": f"muduo_{item['slug'][:10]}",
        "status": "FULL",
        "tags": meta.get("tags", []),
        "linkedModule": meta.get("linkedModule", "muduo_core"),
        "linkedModuleTitle": meta.get("linkedModuleTitle", "muduo 网络库核心架构"),
        "linkedSourceFiles": meta.get("linkedSourceFiles", []),
        "linkedClasses": meta.get("linkedClasses", []),
        "linkedFunctions": meta.get("linkedFunctions", []),
        "interviewKeyPoints": meta.get("interviewKeyPoints", []),
        "summary": meta.get("summary", ""),
        "content": clean_content
    }
    new_muduo_articles.append(article_obj)

# Assemble final JavaScript file
output_lines = [
    "// ==========================================================================",
    "// 程序员 Carl 双权威语雀专栏知识库完整离线数据集 (dataset-yuque.js)",
    "// 包含两大核心专栏：",
    "// 1. 【网络库muduo-core】(10 篇文档 · 29,920 字精讲 · 密码 khf4 · 17 张原图 · 51 个完整代码块)",
    "// 2. 【HTTP服务框架与CppAIService】(17 篇文档 · 68,091 字精讲)",
    "// 27 篇深度专栏 · 98,011 字原版图解精讲 · 100% 离线完整支持",
    "// ==========================================================================",
    "",
    "var YUQUE_DATASET = ["
]

# Add muduo articles as JSON string
for idx, a in enumerate(new_muduo_articles):
    json_str = json.dumps(a, ensure_ascii=False, indent=2)
    # indent by 2 spaces
    indented = "\n".join("  " + line for line in json_str.splitlines())
    output_lines.append(indented + ",")

# Append HTTP articles
# Remove leading '{' from http_articles_part and indent properly
# Actually http_articles_part starts with:
# {
#   "id": "yq_01",
output_lines.append("  " + http_articles_part.strip())

final_js = "\n".join(output_lines)
with open(dataset_path, "w", encoding="utf-8") as out_fp:
    out_fp.write(final_js)

print(f"Updated {dataset_path} successfully!")
print(f"Total size: {len(final_js)} bytes.")

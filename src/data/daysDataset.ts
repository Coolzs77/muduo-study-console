import { DayCurriculumItem } from "../types";

// ============================================================================
// CppAIService & Kama-HTTPServer 28天实战攻坚体系 (100% 对齐语雀权威专栏真实数据)
// 包含 4 大阶段完整闭环：
// Week 1 (Day 01~07): 自研 HTTP 服务框架底座、环境与协议解析 (yq_01 ~ yq_06)
// Week 2 (Day 08~14): 动态路由、会话隔离与洋葱中间件 (yq_07 ~ yq_09)
// Week 3 (Day 15~21): 数据库连接池与服务进阶 (yq_10 ~ yq_13)
// Week 4 (Day 22~28): CppAIService 全栈 AI 平台实战 (yq_14 ~ yq_17)
// ============================================================================

export const DAYS_DATASET: DayCurriculumItem[] = [
  {
    "day": 1,
    "week": 1,
    "tier": "A",
    "title": "KamaServer 框架定位与 C++ Web 开发宏观全貌",
    "bookRange": "语雀专栏: 学习建议 (yq_01) + 1.开篇 (yq_02)",
    "tags": [
      "KamaServer",
      "C++应用层",
      "工程全景",
      "五子棋案例"
    ],
    "points": [
      "摆脱单纯 C++ 基础语法的枯燥学习，从零构建高性能 Web 应用服务框架（KamaServer）。",
      "确立项目整体开发周期：整体代码量约 5000 行（HTTP 框架约 3000 行，业务案例约 1400 行），规划 20~30 天完整学习路径。",
      "理解架构分层：底层依托成熟的 Muduo 网络库承担传输保障，上层专注于 HTTP 报文解析、路由映射、会话安全与业务逻辑。"
    ],
    "code": "// Day 01: KamaServer 极简服务启动示例\n#include <iostream>\n#include <memory>\n#include \"http/HttpServer.h\"\n\nint main() {\n    // 监听 8001 端口，4 个工作线程\n    http::HttpServer server(8001, \"KamaServer_Demo\");\n    server.setThreadNum(4);\n\n    // 注册根路径静态路由\n    server.Get(\"/\", [](const http::HttpRequest& req, http::HttpResponse* resp) {\n        resp->setStatusCode(http::HttpResponse::k200Ok);\n        resp->setStatusMessage(\"OK\");\n        resp->setContentType(\"text/plain\");\n        resp->setBody(\"Hello KamaServer! C++ Web Framework Starting...\");\n    });\n\n    std::cout << \"KamaServer running on port 8001...\" << std::endl;\n    server.start();\n    return 0;\n}",
    "muduoMap": "HttpServer 内部组合 muduo::net::TcpServer，实现非阻塞 Reactor 架构",
    "check": "理解 C++ 网络库与应用层 HTTP 框架的分工界限，能说出 KamaServer 整体模块划分。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 30,
      "code": 35,
      "experiment": 25
    },
    "rigorousNuance": {
      "quick": "做 HTTP 框架就是在网络库上加上协议解析和路由。",
      "strict": "网络库解决的是 Socket 非阻塞 I/O 多路复用和连接生命周期管理（L4）；HTTP 框架解决的是应用层协议编解码、状态机解析、动态路由分发、中间件链与多租户会话隔离（L7）。"
    },
    "experiment": {
      "goal": "验证 KamaServer 基础路由注册与端口监听能力",
      "steps": [
        "初始化 HttpServer 实例并指定监听端口 8001",
        "注册 GET / 路由并设置基础文本响应",
        "启动服务器并通过 curl 命令发起测试请求"
      ],
      "expectedOutput": "Hello KamaServer! C++ Web Framework Starting...",
      "watchPoints": "观察服务器线程池初始化日志与 HTTP 响应头的状态行格式规范",
      "pitfalls": "端口被系统其他服务占用（如 8001 已占用需修改为其他可用端口）。",
      "buildCommand": "g++ -std=c++17 day01_server.cpp -I./HttpServer/include -lmuduo_net -lmuduo_base -lpthread -o day01_server && ./day01_server"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "关于为什么选择基于成熟网络库（如 Muduo）构建 HTTP 框架而非从 raw socket 写起，下列说法最准确的是：",
          "options": [
            "raw socket 无法在 Linux 下运行",
            "底层通信框架稳定性和调试难度极高，利用成熟网络库能将精力聚焦在应用层协议与复杂业务上",
            "Muduo 网络库内部自带完整的 HTTP/2 与 HTTPS 解密支持",
            "C++ 标准库已经内置了类似 Muduo 的全部高并发网络功能"
          ],
          "answer": 1,
          "explanation": "自研底层网络库极易出现各种边界并发与内存异常，使用成熟稳定的网络库做底座，可以在应用层大幅拓展后端常用功能（路由、会话、中间件等），降低排错成本。"
        }
      ]
    }
  },
  {
    "day": 2,
    "week": 1,
    "tier": "A",
    "title": "HTTP 框架 vs WebServer 深度辨析与四层服务架构",
    "bookRange": "语雀专栏: 2.项目介绍 (yq_03)",
    "tags": [
      "四层架构",
      "WebServer辨析",
      "架构设计",
      "Reactor模型"
    ],
    "points": [
      "深度剖析自研 HTTP 框架与市面传统 WebServer 项目的本质区别：WebServer 侧重于从 socket 实现基础传输，而 HTTP 框架侧重于应用层架构设计与二次开发能力。",
      "掌握平台四层全景架构：客户端层（Web/命令行）、业务服务层（核心逻辑/Handler）、数据与消息层（MySQL/RabbitMQ）、推理与第三方平台层（百炼/ONNX）。",
      "理解请求完整生命周期流转：从网络数据接收、状态机解析、动态路由分发、中间件拦截到业务响应封装。"
    ],
    "code": "// Day 02: 四层架构中的请求调度与分发抽象\n#include <iostream>\n#include <functional>\n\n// 业务层处理接口\nclass RequestHandler {\npublic:\n    virtual ~RequestHandler() = default;\n    virtual void handle(const std::string& path, std::string& response) = 0;\n};\n\n// 框架层分发器\nclass AppDispatcher {\npublic:\n    void registerRoute(const std::string& path, std::shared_ptr<RequestHandler> handler) {\n        routes_[path] = handler;\n    }\n    void dispatch(const std::string& path, std::string& resp) {\n        if (routes_.count(path)) {\n            routes_[path]->handle(path, resp);\n        } else {\n            resp = \"HTTP/1.1 404 Not Found\\r\\n\\r\\n\";\n        }\n    }\nprivate:\n    std::unordered_map<std::string, std::shared_ptr<RequestHandler>> routes_;\n};",
    "muduoMap": "应用层分发解耦：业务 Handler 与底层 EventLoop 线程解耦",
    "check": "能向面试官清晰画出平台四层架构图，并对比 WebServer 与 HTTP 框架的区别。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 40,
      "code": 30,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "WebServer 就是简单的玩具，HTTP 框架更实用。",
      "strict": "WebServer 的重点在于从底层 socket 向上打通最小可用应用链路；HTTP 框架是以成熟网络引擎为基座，提供路由、过滤器、上下文管理与多模态扩展的工业级开发底座。"
    },
    "experiment": {
      "goal": "模拟客户端层到业务服务层的分发流程",
      "steps": [
        "构建抽象 Handler 派生类并重写 handle 方法",
        "向分发器注册静态路径与动态路径",
        "输入不同 URI 观察匹配命中与 404 降级分支"
      ],
      "expectedOutput": "命中指定路由处理器并生成标准响应",
      "watchPoints": "观察路由映射表对未注册路径的边界防御",
      "pitfalls": "在分发层直接处理长耗时任务导致主循环阻塞。",
      "buildCommand": "g++ -std=c++17 day02_arch.cpp -o day02_arch && ./day02_arch"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在四层服务架构中，负责与外部大模型（如阿里百炼、豆包）通信的模块位于哪一层？",
          "options": [
            "客户端层",
            "业务服务层 (ChatServer)",
            "推理与第三方平台层",
            "数据与消息层"
          ],
          "answer": 2,
          "explanation": "推理与第三方平台层负责对接各家大模型 API 及本地 ONNX 推理引擎；业务服务层（ChatServer）则调用该层完成具体的对话与图像识别功能。"
        }
      ]
    }
  },
  {
    "day": 3,
    "week": 1,
    "tier": "A",
    "title": "Linux / Docker 开发环境搭建与编译链配置",
    "bookRange": "语雀专栏: 3.环境准备 (yq_04)",
    "tags": [
      "Docker",
      "Ubuntu 22.04",
      "CMake",
      "环境部署"
    ],
    "points": [
      "熟练掌握 Linux 环境下的依赖包管理：g++、cmake、boost_1_69_0、muduo 网络库、libmysqlcppconn-dev、OpenSSL。",
      "掌握 Docker 快速一键拉取与容器编排：`docker pull huanheart/httpserver:v1`，配置端口映射 `-p 8001-8005:8001-8005`。",
      "解决容器内服务的非自启问题：手动启动 MySQL 5.7 服务并设置密码，运行 simple_server 成功完成浏览器打通。"
    ],
    "code": "// Day 03: CMakeLists.txt 依赖探测与核心编译配置片段\ncmake_minimum_required(VERSION 3.10)\nproject(Kama_HTTPServer CXX)\n\nset(CMAKE_CXX_STANDARD 17)\nset(CMAKE_CXX_STANDARD_REQUIRED ON)\n\n# 查找 OpenSSL 与 线程库\nfind_package(OpenSSL REQUIRED)\nfind_package(Threads REQUIRED)\n\ninclude_directories(\n    ${PROJECT_SOURCE_DIR}/HttpServer/include\n    ${OPENSSL_INCLUDE_DIR}\n    /usr/include\n)\n\nlink_directories(/usr/local/lib)\n\n# 编译主程序并链接 Muduo 与 MySQL 动态库\nadd_executable(simple_server HttpServer/src/main.cpp)\ntarget_link_libraries(simple_server\n    muduo_net\n    muduo_base\n    mysqlcppconn\n    OpenSSL::SSL\n    OpenSSL::Crypto\n    Threads::Threads\n)",
    "muduoMap": "头文件引入 /usr/include/muduo 与动态库 /usr/local/lib/libmuduo_net.so",
    "check": "在 Linux 终端或 Docker 内能够成功编译并启动 simple_server 服务。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 20,
      "code": 30,
      "experiment": 40
    },
    "rigorousNuance": {
      "quick": "直接在虚拟机里装一堆库就行了。",
      "strict": "Linux 下 C++ 依赖版本冲突极为常见（如 Boost、glibc 与 gcc ABI）。Docker 容器化镜像固化了完整工具链与预编译库，保证开发、测试与生产环境的 100% 一致性。"
    },
    "experiment": {
      "goal": "拉取并启动 Docker 容器，运行 simple_server",
      "steps": [
        "执行 docker run -d --name httpserver-container -p 8001:8001 huanheart/httpserver:v1 tail -f /dev/null",
        "进入容器内部执行 service mysql start",
        "在 Kama-HTTPServer/build_temp/ 目录下运行 ./simple_server -p 8001"
      ],
      "expectedOutput": "浏览器访问 http://localhost:8001 正常返回内容",
      "watchPoints": "确认 Docker 端口映射无冲突且 MySQL 正常监听 3306 端口",
      "pitfalls": "容器内部未启动 MySQL 服务导致后续数据库模块抛出连接异常。",
      "buildCommand": "docker exec -it httpserver-container bash -c \"service mysql status\""
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在 Docker 容器中部署 Kama-HTTPServer 时，暴露多个端口（如 8001~8005）的主要目的是：",
          "options": [
            "每个端口只能允许单个客户端连接",
            "为后续可能运行的多实例测试或特定功能（如五子棋、AI服务、SSL）预留端口",
            "Docker 规定每个 C++ 进程必须绑定 5 个端口",
            "防止单个端口带宽被运营商限速"
          ],
          "answer": 1,
          "explanation": "暴露端口段是为了满足同一容器内运行多个示例服务（如不同端口的测试实例、业务服务及管理接口）的需求。"
        }
      ]
    }
  },
  {
    "day": 4,
    "week": 1,
    "tier": "A",
    "title": "HttpServer 核心结构与 Muduo Reactor 事件驱动集成",
    "bookRange": "语雀专栏: 4.框架梳理 (yq_05) + HTTP报文解析封装模块 (yq_06)",
    "tags": [
      "HttpServer",
      "Reactor",
      "onConnection",
      "onMessage"
    ],
    "points": [
      "理清 HttpServer 的核心成员：`muduo::net::TcpServer`、`muduo::net::EventLoop`、`Router` 与 `HttpCallback`。",
      "深入掌握 `onConnection` 回调：当新连接建立时，通过 `conn->setContext(HttpContext())` 为每个连接绑定独立解析状态机。",
      "深入掌握 `onMessage` 回调：从连接上下文提取 `HttpContext`，解析网络缓冲区数据；仅当解析出完整请求（gotAll()）时才触发 `onRequest` 处理。"
    ],
    "code": "// Day 04: HttpServer 中的连接与消息回调注册\n#include \"http/HttpContext.h\"\n#include <muduo/net/TcpServer.h>\n#include <muduo/net/EventLoop.h>\n\nvoid HttpServer::onConnection(const muduo::net::TcpConnectionPtr& conn) {\n    if (conn->connected()) {\n        // 为该 TCP 连接绑定独立的 HttpContext 上下文对象\n        conn->setContext(HttpContext());\n    }\n}\n\nvoid HttpServer::onMessage(const muduo::net::TcpConnectionPtr& conn,\n                           muduo::net::Buffer* buf,\n                           muduo::Timestamp receiveTime) {\n    HttpContext* context = boost::any_cast<HttpContext>(conn->getMutableContext());\n    if (!context->parseRequest(buf, receiveTime)) {\n        // 解析出错立即返回 400 Bad Request 并半关闭连接\n        conn->send(\"HTTP/1.1 400 Bad Request\\r\\n\\r\\n\");\n        conn->shutdown();\n        return;\n    }\n\n    // 缓冲区中数据满足完整 HTTP 报文才执行上层业务\n    if (context->gotAll()) {\n        onRequest(conn, context->request());\n        context->reset(); // 重置状态机准备接收下一条长连接请求\n    }\n}",
    "muduoMap": "TcpConnection 上下文绑定：boost::any 保存 HttpContext 实例",
    "check": "能够画出从 TcpServer 接收字节流到触发业务 onRequest 的时序流转。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 35,
      "code": 35,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "每次收到消息就直接调业务函数。",
      "strict": "TCP 是面向无边界的流式协议。一个 TCP 数据包可能包含多个完整 HTTP 请求，也可能只包含半个请求。必须通过 HttpContext 状态机维护未完成解析状态，直至 gotAll() 才能分发。"
    },
    "experiment": {
      "goal": "验证 HttpContext 在长连接中 reset() 的状态重置功能",
      "steps": [
        "模拟一个 TCP 连接连续发送两个 HTTP GET 请求",
        "在第一个请求 gotAll() 后调用 reset()",
        "验证第二个请求是否能重新从 kExpectRequestLine 状态顺利解析"
      ],
      "expectedOutput": "两个请求均被正确解析并分发",
      "watchPoints": "观察 HttpContext 中 HttpRequest 对象是否被完全重置",
      "pitfalls": "长连接中忘记调用 reset()，导致后续请求依然保持 kGotAll 状态而解析失败。",
      "buildCommand": "g++ -std=c++17 day04_fsm_reset.cpp -o day04_fsm_reset && ./day04_fsm_reset"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在 HttpServer::onConnection 中，为什么要给每个 TcpConnection 单独绑定一个 HttpContext？",
          "options": [
            "因为操作系统要求每个 socket 必须有一个 context",
            "每个 TCP 连接的报文到达时序和粘包切片相互独立，必须各自维护独立的解析状态机",
            "为了将连接直接转为 UDP 协议",
            "没有必要，所有连接可以共享同一个全局静态 HttpContext 对象"
          ],
          "answer": 1,
          "explanation": "多连接并发时，不同连接接收数据的进度各不相同。必须每个连接独享 HttpContext，避免不同客户端之间报文数据交织错乱。"
        }
      ]
    }
  },
  {
    "day": 5,
    "week": 1,
    "tier": "A",
    "title": "HttpRequest 与 HttpResponse 协议报文数据模型封装",
    "bookRange": "语雀专栏: HTTP报文解析封装模块 (yq_06)",
    "tags": [
      "HttpRequest",
      "HttpResponse",
      "数据模型",
      "协议封装"
    ],
    "points": [
      "掌握 HttpRequest 的数据结构：方法枚举（GET/POST/PUT/DELETE/OPTIONS）、版本号、路径、路径参数映射、查询参数映射、头部键值对与请求体。",
      "掌握 HttpResponse 的数据结构：HTTP 状态码（200/400/404/500 等）、状态描述文本、长短连接控制（Connection: close/keep-alive）、响应头与正文。",
      "掌握报文装配算法：`appendToBuffer` 按照 HTTP 规范依次写入状态行、响应头部、空行（`\\r\\n`）与响应正文。"
    ],
    "code": "// Day 05: HttpResponse 格式化输出到 Muduo Buffer\n#include <string>\n#include <map>\n#include <muduo/net/Buffer.h>\n\nclass HttpResponse {\npublic:\n    enum HttpStatusCode {\n        kUnknown,\n        k200Ok = 200,\n        k400BadRequest = 400,\n        k404NotFound = 404,\n        k500InternalServerError = 500\n    };\n\n    void appendToBuffer(muduo::net::Buffer* output) const {\n        char buf[64];\n        snprintf(buf, sizeof(buf), \"HTTP/1.1 %d \", statusCode_);\n        output->append(buf);\n        output->append(statusMessage_);\n        output->append(\"\\r\\n\");\n\n        if (closeConnection_) {\n            output->append(\"Connection: close\\r\\n\");\n        } else {\n            snprintf(buf, sizeof(buf), \"Content-Length: %zd\\r\\n\", body_.size());\n            output->append(buf);\n            output->append(\"Connection: Keep-Alive\\r\\n\");\n        }\n\n        for (const auto& [key, val] : headers_) {\n            output->append(key);\n            output->append(\": \");\n            output->append(val);\n            output->append(\"\\r\\n\");\n        }\n\n        output->append(\"\\r\\n\"); // 头部与体部之间的空行\n        output->append(body_);\n    }\n\nprivate:\n    HttpStatusCode statusCode_{kUnknown};\n    std::string statusMessage_;\n    bool closeConnection_{false};\n    std::map<std::string, std::string> headers_;\n    std::string body_;\n};",
    "muduoMap": "数据输出阶段：将组装好的报文写入 muduo::net::Buffer 供发送",
    "check": "能够手工构造一个带有 Content-Type、Content-Length 的合法 HTTP 响应报文。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 30,
      "code": 40,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "拼字符串发送就行了。",
      "strict": "HTTP 协议对每一处回车换行严格要求为 \\r\\n（CRLF）。任何漏写冒号、空格或空行都会导致严格遵守 RFC 标准的浏览器无法正常解析。"
    },
    "experiment": {
      "goal": "验证 appendToBuffer 生成的报文字符串是否完全符合 RFC 7230 格式",
      "steps": [
        "创建 HttpResponse 对象并设置 200 OK、JSON 格式头与正文",
        "调用 appendToBuffer 注入 muduo Buffer",
        "打印 Buffer 内容并校验头部末尾的双 CRLF"
      ],
      "expectedOutput": "HTTP/1.1 200 OK\\r\\n...\\r\\n\\r\\n{\"status\":\"ok\"}",
      "watchPoints": "检查双 CRLF 分隔符与 Content-Length 数值是否与 body 字节数严格一致",
      "pitfalls": "在响应头与正文之间忘记添加空行 \\r\\n，导致客户端持续等待挂起。",
      "buildCommand": "g++ -std=c++17 day05_response.cpp -lmuduo_net -lmuduo_base -o day05_response && ./day05_response"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在 HTTP/1.1 响应报文中，标志着“头部结束、正文开始”的关键特征是：",
          "options": [
            "一个空字符 \\0",
            "连续的两个 CRLF（即 \\r\\n\\r\\n）",
            "一个单独的制表符 \\t",
            "遇到 Content-Length 字段"
          ],
          "answer": 1,
          "explanation": "HTTP 规范规定头部以空行结束，即请求行或最后一个头部行之后的 \\r\\n 再紧跟一个 \\r\\n。"
        }
      ]
    }
  },
  {
    "day": 6,
    "week": 1,
    "tier": "A",
    "title": "HttpContext 有限状态机 (FSM) 逐行解析与请求行提取",
    "bookRange": "语雀专栏: HTTP报文解析封装模块 (yq_06)",
    "tags": [
      "状态机",
      "FSM",
      "请求行",
      "processRequestLine"
    ],
    "points": [
      "深入掌握四状态迁移图：`kExpectRequestLine`（解析请求行）-> `kExpectHeaders`（解析请求头）-> `kExpectBody`（解析请求体）-> `kGotAll`（全部就绪）。",
      "请求行解析算法 `processRequestLine`：通过空格分隔符拆解 METHOD、PATH 与 HTTP 版本；通过 `?` 拆分路径与查询参数。",
      "利用 `buf->findCRLF()` 判定行结束边界，并调用 `buf->retrieveUntil(crlf + 2)` 安全推进读指针。"
    ],
    "code": "// Day 06: 请求行解析算法实现\nbool HttpContext::processRequestLine(const char* begin, const char* end) {\n    bool succeed = false;\n    const char* start = begin;\n    const char* space = std::find(start, end, ' ');\n    \n    // 1. 提取 Method (如 GET, POST)\n    if (space != end && request_.setMethod(start, space)) {\n        start = space + 1;\n        space = std::find(start, end, ' ');\n        if (space != end) {\n            // 2. 提取 URI 并判断是否携带查询参数\n            const char* argumentStart = std::find(start, space, '?');\n            if (argumentStart != space) {\n                request_.setPath(start, argumentStart);\n                request_.setQueryParameters(argumentStart + 1, space);\n            } else {\n                request_.setPath(start, space);\n            }\n\n            // 3. 提取并校验 HTTP 协议版本\n            start = space + 1;\n            succeed = ((end - start == 8) && std::equal(start, end - 1, \"HTTP/1.\"));\n            if (succeed) {\n                if (*(end - 1) == '1') request_.setVersion(\"HTTP/1.1\");\n                else if (*(end - 1) == '0') request_.setVersion(\"HTTP/1.0\");\n                else succeed = false;\n            }\n        }\n    }\n    return succeed;\n}",
    "muduoMap": "Buffer 读取机制：利用 peek() 查看数据，retrieveUntil() 消费数据",
    "check": "能手工写出 processRequestLine 的三段拆解逻辑及边界安全判断。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 30,
      "code": 45,
      "experiment": 15
    },
    "rigorousNuance": {
      "quick": "用 string split 空格直接取第 1 个和第 2 个元素。",
      "strict": "在高性能网络服务中，使用 std::find 在原生字节指针（const char*）上游走，避免生成多余的 std::string 临时对象，减少堆内存分配开销。"
    },
    "experiment": {
      "goal": "测试 processRequestLine 对合法与非法请求行的解析健壮性",
      "steps": [
        "传入 \"GET /api/user?id=101 HTTP/1.1\\r\\n\" 验证解析成功",
        "传入缺少版本的畸形请求行 \"GET /api/user\\r\\n\" 验证返回 false",
        "检查 HttpRequest 对象中的 path 与 queryParameters"
      ],
      "expectedOutput": "合法请求成功提取 path=\"/api/user\", query[\"id\"]=\"101\"",
      "watchPoints": "关注指针越界保护及 space == end 时的短路返回",
      "pitfalls": "未校验协议版本长度直接越界读取 *(end - 1)。",
      "buildCommand": "g++ -std=c++17 day06_fsm_line.cpp -o day06_fsm_line && ./day06_fsm_line"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在解析带有查询参数的请求行 \"GET /search?q=cpp HTTP/1.1\" 时，路径与参数是以什么字符为界进行切分的？",
          "options": [
            "空格字符 ' '",
            "问号字符 '?'",
            "斜杠字符 '/'",
            "冒号字符 ':'"
          ],
          "answer": 1,
          "explanation": "标准 HTTP 规范中，URL 路径与查询字符串通过首个问号 '?' 分割，问号之后直到空格之前的内容为 Query Parameters。"
        }
      ]
    }
  },
  {
    "day": 7,
    "week": 1,
    "tier": "A",
    "title": "请求头与请求体边界判定、TCP 粘包拆包与零拷贝设计",
    "bookRange": "语雀专栏: HTTP报文解析封装模块 (yq_06)",
    "tags": [
      "TCP粘包",
      "Content-Length",
      "零拷贝",
      "Buffer"
    ],
    "points": [
      "头部解析循环：通过冒号 `:` 切分 header 键值对，遇到空行时根据是否含有 `Content-Length` 决定迁移到 `kExpectBody` 还是 `kGotAll`。",
      "彻底攻克 TCP 粘包拆包：当请求体未收全时（`buf->readableBytes() < contentLength`），状态机保持在 `kExpectBody` 并返回 true，等待后续可读事件再次触发。",
      "零拷贝思想：在协议解析过程中最大化利用指针切片，仅在必要时才拷贝内容至请求体。"
    ],
    "code": "// Day 07: HttpContext::parseRequest 完整状态机循环驱动\nbool HttpContext::parseRequest(muduo::net::Buffer* buf, muduo::Timestamp receiveTime) {\n    bool ok = true;\n    bool hasMore = true;\n    while (hasMore) {\n        if (state_ == kExpectRequestLine) {\n            const char* crlf = buf->findCRLF();\n            if (crlf) {\n                ok = processRequestLine(buf->peek(), crlf);\n                if (ok) {\n                    request_.setReceiveTime(receiveTime);\n                    buf->retrieveUntil(crlf + 2);\n                    state_ = kExpectHeaders;\n                } else { hasMore = false; }\n            } else { hasMore = false; }\n        } else if (state_ == kExpectHeaders) {\n            const char* crlf = buf->findCRLF();\n            if (crlf) {\n                const char* colon = std::find(buf->peek(), crlf, ':');\n                if (colon < crlf) {\n                    request_.addHeader(buf->peek(), colon, crlf);\n                } else if (buf->peek() == crlf) { // 遇到空行\n                    if (!request_.getHeader(\"Content-Length\").empty()) {\n                        request_.setContentLength(std::stoull(request_.getHeader(\"Content-Length\")));\n                    }\n                    state_ = (request_.contentLength() == 0) ? kGotAll : kExpectBody;\n                    if (state_ == kGotAll) hasMore = false;\n                } else {\n                    ok = false;\n                    hasMore = false;\n                }\n                buf->retrieveUntil(crlf + 2);\n            } else { hasMore = false; }\n        } else if (state_ == kExpectBody) {\n            // TCP 拆包保护：若当前可读字节不足，等待下次 onMessage\n            if (buf->readableBytes() < request_.contentLength()) {\n                return true; // 等待更多数据，保持当前状态\n            }\n            std::string body(buf->peek(), buf->peek() + request_.contentLength());\n            request_.setBody(body);\n            buf->retrieve(request_.contentLength());\n            state_ = kGotAll;\n            hasMore = false;\n        }\n    }\n    return ok;\n}",
    "muduoMap": "缓冲区指针推进：retrieveUntil 跳过已读 CRLF，保留未接收完毕的数据",
    "check": "能够解释在网络分包（拆包）情况下 parseRequest 为何必须返回 true 且不触发业务。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 35,
      "code": 40,
      "experiment": 15
    },
    "rigorousNuance": {
      "quick": "TCP 粘包就是用分号把包隔开。",
      "strict": "TCP 是没有消息边界的字节流。HTTP 报文的行与头通过 CRLF 定界，而请求体则严格依赖 Content-Length（或 Chunked 编码）明确字节边界，接收方通过计数器判定数据完整性。"
    },
    "experiment": {
      "goal": "模拟拆包场景：将一个 POST 请求分两次推入 Buffer，检验状态机暂挂与唤醒",
      "steps": [
        "注入请求行与头部，此时 readableBytes 为 0，观察状态机停留在 kExpectBody",
        "二次注入完整 body 字节流并再次触发 parseRequest",
        "验证 gotAll() 最终变为 true 并成功读取 body"
      ],
      "expectedOutput": "两次输入无缝衔接，最终成功还原完整请求报文",
      "watchPoints": "确认第一次调用返回 true 但 gotAll() 为 false，无任何指针越界",
      "pitfalls": "在可读字节不足时直接 retrieve 导致读取未初始化的脏数据或越界。",
      "buildCommand": "g++ -std=c++17 day07_packet_fragment.cpp -lmuduo_net -lmuduo_base -o day07_frag && ./day07_frag"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "当 parseRequest 处理 kExpectBody 时，发现 buf->readableBytes() 小于 request_.contentLength()，应该采取的操作是：",
          "options": [
            "抛出异常并断开客户端连接",
            "丢弃已读数据，返回 400 Bad Request",
            "保留当前状态机状态，直接 return true，等待 TCP 后续数据到达再次解析",
            "阻塞当前工作线程直到操作系统接收到全部数据"
          ],
          "answer": 2,
          "explanation": "在非阻塞 Reactor 架构中绝对禁止同步阻塞。数据尚未完全到达属于正常的 TCP 拆包现象，保持状态并返回 true，等待底层网络再次触发 onMessage 即可。"
        }
      ]
    }
  },
  {
    "day": 8,
    "week": 2,
    "tier": "A",
    "title": "RouteKey 哈希结构与静态精准路径路由表注册",
    "bookRange": "语雀专栏: 路由模块 (yq_07)",
    "tags": [
      "RouteKey",
      "静态路由",
      "哈希表",
      "RouterHandler"
    ],
    "points": [
      "设计复合键 RouteKey：结合 HttpRequest::Method 与 std::string path 构建唯一路由键，并重载 operator==。",
      "自定义 RouteKeyHash 哈希仿函数：采用素数乘法 `methodHash * 31 + pathHash` 避免哈希碰撞。",
      "双轨路由注册机制：支持注册直接函数对象 `HttpCallback` 与继承抽象基类 `RouterHandler` 两种方式。"
    ],
    "code": "// Day 08: RouteKey 哈希定义与静态路由表查找\n#include <string>\n#include <unordered_map>\n#include <memory>\n#include \"http/HttpRequest.h\"\n#include \"http/HttpResponse.h\"\n\nstruct RouteKey {\n    http::HttpRequest::Method method;\n    std::string path;\n    bool operator==(const RouteKey& other) const {\n        return method == other.method && path == other.path;\n    }\n};\n\nstruct RouteKeyHash {\n    size_t operator()(const RouteKey& key) const {\n        size_t methodHash = std::hash<int>{}(static_cast<int>(key.method));\n        size_t pathHash = std::hash<std::string>{}(key.path);\n        return methodHash * 31 + pathHash;\n    }\n};\n\nclass RouterHandler {\npublic:\n    virtual ~RouterHandler() = default;\n    virtual void handle(const http::HttpRequest& req, http::HttpResponse* resp) = 0;\n};\n\n// 静态路由表\nstd::unordered_map<RouteKey, std::shared_ptr<RouterHandler>, RouteKeyHash> handlers_;",
    "muduoMap": "上层分发映射：在 muduo 接收完整请求后，通过 O(1) 哈希快速定位业务 Handler",
    "check": "能够独立手写 RouteKeyHash 仿函数并解释为什么要使用 31 作为乘法因子。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 30,
      "code": 40,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "路由就是用 map 存路径和函数。",
      "strict": "不仅需要匹配 URL 路径，还必须强校验 HTTP Method（如 GET 与 POST 同路径不能混用）。采用复合键 RouteKey 能够保证方法级别隔离，避免越权或方法误用。"
    },
    "experiment": {
      "goal": "测试静态路由表的注册与精准查找",
      "steps": [
        "注册 GET /api/v1/info 与 POST /api/v1/info 对应不同处理器",
        "分别构造 GET 与 POST 请求在哈希表中查找",
        "验证相同路径不同 Method 是否准确分发到对应处理器"
      ],
      "expectedOutput": "GET 与 POST 分别触发各自独立的 Handler 回调",
      "watchPoints": "确认两个相同路径但方法不同的请求不会相互覆盖",
      "pitfalls": "哈希函数未将 method 纳入计算，导致相同 path 的不同 method 发生严重哈希冲突。",
      "buildCommand": "g++ -std=c++17 day08_static_router.cpp -o day08_router && ./day08_router"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在实现 RouteKeyHash 时，将 methodHash 与 pathHash 通过 methodHash * 31 + pathHash 进行组合的主要目的是：",
          "options": [
            "满足 C++ 语法必须有乘法的强制要求",
            "31 是奇素数且便于编译器优化为 (x << 5) - x，能产生更均匀的哈希分布以减少冲突",
            "将所有路径强制限制在 31 个字符以内",
            "直接对字符串进行加密保护"
          ],
          "answer": 1,
          "explanation": "31 是经典的素数乘数，能充分利用低位和高位比特混合，有效降低哈希碰撞概率，同时现代编译器能将其高效优化为位移操作。"
        }
      ]
    }
  },
  {
    "day": 9,
    "week": 2,
    "tier": "A",
    "title": "基于 std::regex 的动态正则路由匹配与路径参数提取",
    "bookRange": "语雀专栏: 路由模块 (yq_07)",
    "tags": [
      "动态路由",
      "std::regex",
      "路径参数",
      "RESTful"
    ],
    "points": [
      "动态路径模板转正则表达式：将形如 `/user/:id` 转换为 `^/user/([^/]+)$`，使用 `std::regex_replace` 批量转义。",
      "利用 `std::smatch` 提取路径参数：捕获正则分组结果，并依次存入 `request.setPathParameters(\"param1\", match[1].str())`。",
      "双层路由匹配优先级：先查 O(1) 静态哈希表，未命中时再遍历动态正则路由列表 `regexHandlers_`。"
    ],
    "code": "// Day 09: 动态正则路由注册与参数提取\n#include <regex>\n#include <string>\n#include <vector>\n\nstd::regex convertToRegex(const std::string& pathPattern) {\n    // 将 /:param 统一替换为 /([^/]+)\n    std::string regexPattern = \"^\" + std::regex_replace(pathPattern, std::regex(R\"(/:([^/]+))\"), R\"(/([^/]+))\") + \"$\";\n    return std::regex(regexPattern);\n}\n\nvoid extractPathParameters(const std::smatch& match, std::unordered_map<std::string, std::string>& params) {\n    for (size_t i = 1; i < match.size(); ++i) {\n        params[\"param\" + std::to_string(i)] = match[i].str();\n    }\n}",
    "muduoMap": "RESTful 接口支持：使基于 Muduo 的 HTTP 框架具备类似现代 Web 框架的动态参数捕获能力",
    "check": "能够写出将 /books/:bookId/chapters/:chapterId 转换为正则并提取两个分组参数的完整代码。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 35,
      "code": 35,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "动态路由就是用正则匹配 URL。",
      "strict": "正则匹配在大量动态路由下会产生 O(N) 遍历开销。工业级设计通常优先走静态哈希精准匹配，动态路由则采用预编译 regex 避免运行时构造正则表达式对象。"
    },
    "experiment": {
      "goal": "验证 convertToRegex 与 extractPathParameters 捕获参数的正确性",
      "steps": [
        "定义模板 /api/users/:userId/orders/:orderId",
        "传入测试 URL /api/users/1024/orders/9998",
        "检查匹配状态并打印提取到的 param1 与 param2"
      ],
      "expectedOutput": "param1=\"1024\", param2=\"9998\"",
      "watchPoints": "确认路径两端被 ^ 和 $ 严格锚定，防止部分包含误判",
      "pitfalls": "缺少 $ 终止锚点，导致 /api/users/123/extra 被错误匹配。",
      "buildCommand": "g++ -std=c++17 day09_regex_router.cpp -o day09_regex && ./day09_regex"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在 convertToRegex 中，模式两端加上 ^ 和 $ 符号的核心作用是：",
          "options": [
            "指示正则表达式为区分大小写模式",
            "确保完全精准匹配整条 URL 路径，防止仅前缀或后缀匹配引发越界分发",
            "在匹配失败时触发自动重定向",
            "用于给参数分配内存空间"
          ],
          "answer": 1,
          "explanation": "^ 表示字符串起始，$ 表示字符串结束，两者结合保证整个 URI 路径必须完全匹配模式，防止发生部分子串匹配的安全漏洞。"
        }
      ]
    }
  },
  {
    "day": 10,
    "week": 2,
    "tier": "S",
    "title": "【实战Bug深度排查】动态路由中 newReq 传参缺陷深度修复",
    "bookRange": "语雀专栏: 路由模块 (yq_07) 项目难点与Bug复盘",
    "tags": [
      "实战Bug",
      "const引用",
      "newReq",
      "参数丢失"
    ],
    "points": [
      "Bug 现象复盘：在原有正则回调实现中，虽然提取了路径参数并写入了局部 newReq，但向 callback 传递的却是未包含参数的原始 req。",
      "底层根因（RCA）：`callback(req, resp)` 错误传递了入参 `const HttpRequest& req`，导致业务 Handler 拿到的 `pathParameters_` 永远为空！",
      "修复方案与防御性编码：拷贝构造 `HttpRequest newReq(req)`，完成 `extractPathParameters(match, newReq)` 注入后，严格传递 `callback(newReq, resp)`。"
    ],
    "code": "// Day 10: 正则动态路由执行中的传参缺陷修复\nbool Router::route(const HttpRequest& req, HttpResponse* resp) {\n    // ... 前置静态哈希查找省略 ...\n\n    // 动态正则回调匹配\n    for (const auto& [method, pathRegex, callback] : regexCallbacks_) {\n        std::smatch match;\n        std::string pathStr(req.path());\n        if (method == req.method() && std::regex_match(pathStr, match, pathRegex)) {\n            // [Bug 根因修复]: 必须创建可变副本 newReq 并注入路径参数\n            HttpRequest newReq(req);\n            extractPathParameters(match, newReq);\n\n            // [致命陷阱]: 原代码错误传递 callback(req, resp); 导致参数完全丢失！\n            // 正确代码：传递携带完整参数的 newReq\n            callback(newReq, resp);\n            return true;\n        }\n    }\n    return false;\n}",
    "muduoMap": "应用层参数穿透：确保业务层 Handler 能够稳定读取到 URI 中的动态上下文",
    "check": "能指出原代码在传递 req 时的逻辑缺陷，并在白板上写出正确的修复代码。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 40,
      "code": 30,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "传参写错变量名了，改过来就行。",
      "strict": "由于入参声明为 const HttpRequest& req，编译器从语法层面阻止了直接在原有对象上修改。但在定义局部 newReq 注入参数后，末端调用若仍顺手传递原始 req，编译器不会报错，形成极其隐蔽的静默逻辑 Bug。"
    },
    "experiment": {
      "goal": "重现并修复动态路由参数丢失 Bug",
      "steps": [
        "分别运行 Bug 版本与修复版本",
        "在回调函数内部读取 req.getPathParameter(\"param1\")",
        "验证 Bug 版本打印为空，而修复版本成功打印提取出的参数"
      ],
      "expectedOutput": "修复版本在业务回调中正确获取到 param1 的实际参数值",
      "watchPoints": "断言 newReq.getPathParameters().size() > 0",
      "pitfalls": "在多线程环境下若未经拷贝直接强转 const_cast 修改全局 req 会引发数据竞争。",
      "buildCommand": "g++ -std=c++17 day10_bug_fix.cpp -o day10_fix && ./day10_fix"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "动态路由中为何不能直接在传入的 const HttpRequest& req 上调用 setPathParameters？",
          "options": [
            "C++ 规范严禁任何类拥有 set 方法",
            "const 引用具有只读约束，无法在不破坏接口安全性的情况下调用非 const 成员函数",
            "Linux 内核会拦截对常量的修改并产生 SIGSEGV 信号",
            "因为 HttpRequest 是单例模式"
          ],
          "answer": 1,
          "explanation": "const 引用从编译期保证了对象不可变。如果强行修改会违背接口契约，正确的做法是构造局部副本注入参数后再传递。"
        }
      ]
    }
  },
  {
    "day": 11,
    "week": 2,
    "tier": "A",
    "title": "HTTP 无状态与 Cookie SESSIONID 会话生命周期管理",
    "bookRange": "语雀专栏: 会话管理模块 (yq_08)",
    "tags": [
      "Session",
      "Cookie",
      "SESSIONID",
      "会话生命周期"
    ],
    "points": [
      "HTTP 无状态本质剖析：为何需要会话追踪？通过在响应头设置 `Set-Cookie: SESSIONID=xxx` 并在后续请求中回传，建立状态关联。",
      "Session 类封装：包含会话唯一 ID、创建时间戳、最后刷新时间、数据字典（key-value）与超时时间（默认 3600 秒）。",
      "SessionManager 调度中枢：基于随机数生成安全唯一的 sessionID，从 Cookie 提取 ID 并实现 `getSession(req, resp)` 的透明借调。"
    ],
    "code": "// Day 11: Session 会话核心类与生命周期检测\n#include <string>\n#include <unordered_map>\n#include <chrono>\n\nclass Session {\npublic:\n    Session(const std::string& id, int timeoutSeconds = 3600)\n        : id_(id), timeout_(timeoutSeconds),\n          lastAccessedTime_(std::chrono::steady_clock::now()) {}\n\n    bool isExpired() const {\n        auto now = std::chrono::steady_clock::now();\n        auto elapsed = std::chrono::duration_cast<std::chrono::seconds>(now - lastAccessedTime_).count();\n        return elapsed > timeout_;\n    }\n\n    void refresh() { lastAccessedTime_ = std::chrono::steady_clock::now(); }\n    void setValue(const std::string& key, const std::string& val) { data_[key] = val; }\n    std::string getValue(const std::string& key) const {\n        auto it = data_.find(key);\n        return it != data_.end() ? it->second : \"\";\n    }\n    const std::string& getId() const { return id_; }\n\nprivate:\n    std::string id_;\n    int timeout_;\n    std::chrono::steady_clock::time_point lastAccessedTime_;\n    std::unordered_map<std::string, std::string> data_;\n};",
    "muduoMap": "应用层有状态支撑：在 Reactor 框架上支持多用户登录认证与状态留存",
    "check": "能够完整叙述从客户端初次登录到服务端设置 Cookie 并检索 Session 的时序。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 30,
      "code": 40,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "Session 就是保存在服务器的内存变量。",
      "strict": "Session 是无状态协议之上的逻辑抽象。服务端仅保存 sessionID 与上下文映射，客户端仅持有 sessionID 凭据；两者通过 Header 中标准的 Cookie 机制进行闭环校验。"
    },
    "experiment": {
      "goal": "模拟用户登录、会话写入与后续请求识别",
      "steps": [
        "调用 SessionManager::getSession 生成新会话并在响应头注入 Set-Cookie",
        "向该 session 中写入 userId=\"42\" 和 isLoggedIn=\"true\"",
        "模拟二次请求携带 Cookie: SESSIONID=xxx，验证成功读出用户状态"
      ],
      "expectedOutput": "成功在二次请求中识别登录态，免去重复登录",
      "watchPoints": "校验 Cookie 字段格式与过期时间刷新",
      "pitfalls": "Cookie 未设置 HttpOnly 属性在 Web 环境下存在被 XSS 窃取的风险。",
      "buildCommand": "g++ -std=c++17 day11_session_lifecycle.cpp -o day11_session && ./day11_session"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在无状态的 HTTP 协议中，服务端首次为客户端建立会话时，是通过什么响应头将 sessionID 下发给客户端浏览器的？",
          "options": [
            "Authorization: Bearer <token>",
            "Set-Cookie: SESSIONID=<id>; Path=/; HttpOnly",
            "Content-Type: application/json",
            "Connection: Keep-Alive"
          ],
          "answer": 1,
          "explanation": "标准 HTTP 规范使用 Set-Cookie 响应头部指令让浏览器保存 Cookie 并在后续同源请求中自动带上。"
        }
      ]
    }
  },
  {
    "day": 12,
    "week": 2,
    "tier": "A",
    "title": "MemorySessionStorage 内存存储与定期过期会话淘汰清理",
    "bookRange": "语雀专栏: 会话管理模块 (yq_08)",
    "tags": [
      "SessionStorage",
      "内存管理",
      "过期淘汰",
      "定时清理"
    ],
    "points": [
      "关注点分离：将 `SessionManager`（生命周期管理）与 `SessionStorage`（数据持久化/内存接口）解耦，支持内存、Redis 或数据库扩展。",
      "MemorySessionStorage 线程安全设计：使用 `std::mutex` 保护内部 `std::unordered_map<std::string, std::shared_ptr<Session>>`。",
      "定期淘汰算法 `cleanExpiredSessions`：遍历检查 `isExpired()`，主动擦除僵尸会话，防止服务器内存发生无序膨胀。"
    ],
    "code": "// Day 12: MemorySessionStorage 与过期会话清理\n#include <mutex>\n#include <unordered_map>\n#include <memory>\n#include <vector>\n\nclass MemorySessionStorage {\npublic:\n    void save(std::shared_ptr<Session> session) {\n        std::lock_guard<std::mutex> lock(mutex_);\n        sessions_[session->getId()] = session;\n    }\n\n    std::shared_ptr<Session> load(const std::string& id) {\n        std::lock_guard<std::mutex> lock(mutex_);\n        auto it = sessions_.find(id);\n        if (it != sessions_.end() && !it->second->isExpired()) {\n            it->second->refresh();\n            return it->second;\n        }\n        return nullptr;\n    }\n\n    // 定期淘汰清理函数\n    void cleanExpiredSessions() {\n        std::lock_guard<std::mutex> lock(mutex_);\n        for (auto it = sessions_.begin(); it != sessions_.end(); ) {\n            if (it->second->isExpired()) {\n                it = sessions_.erase(it); // 安全删除过期迭代器\n            } else {\n                ++it;\n            }\n        }\n    }\n\nprivate:\n    std::unordered_map<std::string, std::shared_ptr<Session>> sessions_;\n    std::mutex mutex_;\n};",
    "muduoMap": "定时任务联动：可将 cleanExpiredSessions 注册到 muduo EventLoop::runEvery 定时器中",
    "check": "能够写出迭代器安全删除 (it = sessions_.erase(it)) 并在高并发下说明锁粒度优化思路。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 30,
      "code": 40,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "把 map 里的过期元素删掉就行。",
      "strict": "在遍历 std::unordered_map 时直接调用 sessions_.erase(it++) 在某些旧标准或多线程下极易引发迭代器失效引发段错误；必须接收 erase 返回的下一个有效迭代器。"
    },
    "experiment": {
      "goal": "验证 cleanExpiredSessions 正确淘汰超时 Session 且不误伤有效 Session",
      "steps": [
        "注入超时时间为 1 秒的临时 Session 与 3600 秒的长期 Session",
        "睡眠 1.5 秒后触发 cleanExpiredSessions",
        "校验超时 Session 已被彻底清除，长期 Session 仍可正常 load"
      ],
      "expectedOutput": "超时 Session 被顺利回收，内存恢复正常",
      "watchPoints": "确认 erase 操作后容器大小准确减少",
      "pitfalls": "在迭代器自增时未接返回值导致遍历悬空迭代器崩溃。",
      "buildCommand": "g++ -std=c++17 day12_session_cleanup.cpp -o day12_cleanup && ./day12_cleanup"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在多线程环境下执行 cleanExpiredSessions 时，如果不加互斥锁进行 erase 操作，可能产生的后果是：",
          "options": [
            "程序自动回滚到事务开始状态",
            "多线程并发修改哈希表桶结构，引发未定义行为（数据损坏或内存段错误）",
            "编译器自动添加读写锁",
            "没有任何副作用，C++ 容器原生线程安全"
          ],
          "answer": 1,
          "explanation": "STL 容器不保证多线程写操作安全。在遍历删除期间如果有其他工作线程并发读取或插入，会造成哈希桶指针破坏，引发内存崩溃。"
        }
      ]
    }
  },
  {
    "day": 13,
    "week": 2,
    "tier": "A",
    "title": "洋葱模型责任链中间件 MiddlewareChain 与 Middleware 抽象设计",
    "bookRange": "语雀专栏: 中间件模块 (yq_09)",
    "tags": [
      "中间件",
      "责任链",
      "洋葱模型",
      "AOP"
    ],
    "points": [
      "什么是中间件？位于客户端网络请求到达路由处理逻辑之前、以及响应离开服务器之前的拦截管道（AOP 切面思想）。",
      "中间件基类接口设计：包含请求前置处理 `before(HttpRequest&)` 与响应后置处理 `after(HttpResponse&)`。",
      "MiddlewareChain 责任链执行中枢：维护 `std::vector<std::shared_ptr<Middleware>>`，请求顺向遍历 before，响应逆向遍历 after（标准洋葱模型）。"
    ],
    "code": "// Day 13: 洋葱模型中间件责任链接口与调度中枢\n#include <vector>\n#include <memory>\n#include \"http/HttpRequest.h\"\n#include \"http/HttpResponse.h\"\n\nclass Middleware {\npublic:\n    virtual ~Middleware() = default;\n    virtual void before(http::HttpRequest& request) = 0;\n    virtual void after(http::HttpResponse& response) = 0;\n};\n\nclass MiddlewareChain {\npublic:\n    void addMiddleware(std::shared_ptr<Middleware> mw) {\n        middlewares_.push_back(mw);\n    }\n\n    void processBefore(http::HttpRequest& request) {\n        for (auto& mw : middlewares_) {\n            mw->before(request); // 顺向流水线预处理\n        }\n    }\n\n    void processAfter(http::HttpResponse& response) {\n        // 逆向流水线后处理（洋葱外层收敛）\n        for (auto it = middlewares_.rbegin(); it != middlewares_.rend(); ++it) {\n            (*it)->after(response);\n        }\n    }\n\nprivate:\n    std::vector<std::shared_ptr<Middleware>> middlewares_;\n};",
    "muduoMap": "管道拦截层：位于 HttpServer::onMessage 与 onRequest 之间，解耦通用横切关注点",
    "check": "能够画出洋葱模型的数据流穿透图，说明为什么后置处理必须逆序遍历。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 35,
      "code": 35,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "中间件就是一堆函数按顺序调用。",
      "strict": "中间件核心在于横切关注点的解耦（如鉴权、跨域、耗时统计）。前置处理逐层剥入，业务处理处于洋葱核心，后置处理逐层包出，确保最外层中间件能完整包裹内层执行时间。"
    },
    "experiment": {
      "goal": "编写耗时统计中间件与签名校验中间件，验证洋葱执行顺序",
      "steps": [
        "TimerMiddleware 在 before 记录时间，在 after 打印总耗时",
        "AuthMiddleware 校验 Header 中的 Token",
        "观察控制台日志输出顺序：Timer Before -> Auth Before -> Handler -> Auth After -> Timer After"
      ],
      "expectedOutput": "严格遵守洋葱模型先入后出的对称调用时序",
      "watchPoints": "确认 rbegin() 和 rend() 正确实现逆序遍历",
      "pitfalls": "在 after 中忘记逆序导致外层中间件无法正确统计整体处理耗时。",
      "buildCommand": "g++ -std=c++17 day13_onion_middleware.cpp -o day13_middleware && ./day13_middleware"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在洋葱模型中间件链中，为什么响应后置处理（processAfter）通常推荐逆序执行？",
          "options": [
            "C++ 规范强制要求必须逆序",
            "为了保证最先介入的前置中间件（如全链路计时、错误捕获）最后退出，形成闭环包装",
            "为了节省内存空间",
            "防止逆序时被编译器报错"
          ],
          "answer": 1,
          "explanation": "逆序执行能使最外层的中间件（如耗时监控、全局异常拦截、日志审计）完整涵盖所有内层中间件及核心业务的执行全过程。"
        }
      ]
    }
  },
  {
    "day": 14,
    "week": 2,
    "tier": "A",
    "title": "CorsMiddleware 跨域处理与 OPTIONS 预检请求拦截",
    "bookRange": "语雀专栏: 中间件模块 (yq_09)",
    "tags": [
      "CORS",
      "跨域",
      "OPTIONS预检",
      "403 Forbidden"
    ],
    "points": [
      "什么是跨域（CORS）？浏览器同源策略限制下，当前端页面向不同域名/端口的后端发起 API 请求时的保护机制。",
      "OPTIONS 预检请求机制：非简单请求（携带自定义 Header 或 JSON 格式）前，浏览器会先发送 OPTIONS 探测服务端支持的方法与头部。",
      "通过 C++ 异常快速阻断：在 `CorsMiddleware::before` 中捕获到 `kOptions` 时，直接构造 204 No Content 响应并 `throw response`，快速短路后续路由与数据库开销。"
    ],
    "code": "// Day 14: CORS 跨域中间件与 OPTIONS 预检短路\n#include \"http/HttpRequest.h\"\n#include \"http/HttpResponse.h\"\n#include <algorithm>\n\nclass CorsMiddleware : public Middleware {\npublic:\n    void before(http::HttpRequest& request) override {\n        // 如果是 OPTIONS 预检请求，直接构建响应并阻断\n        if (request.method() == http::HttpRequest::kOptions) {\n            http::HttpResponse response;\n            response.setStatusCode(http::HttpResponse::k204NoContent);\n            response.setStatusMessage(\"No Content\");\n            response.addHeader(\"Access-Control-Allow-Origin\", \"*\");\n            response.addHeader(\"Access-Control-Allow-Methods\", \"GET, POST, PUT, DELETE, OPTIONS\");\n            response.addHeader(\"Access-Control-Allow-Headers\", \"Content-Type, Authorization\");\n            response.addHeader(\"Access-Control-Max-Age\", \"86400\");\n            throw response; // 抛出异常直接跳过后续 Handler 处理\n        }\n    }\n\n    void after(http::HttpResponse& response) override {\n        // 为普通业务响应补充跨域允许头\n        response.addHeader(\"Access-Control-Allow-Origin\", \"*\");\n    }\n};",
    "muduoMap": "上层流量短路：在最前置拦截非业务流量，避免 Muduo 工作线程做无意义的业务轮询",
    "check": "能够说明为什么 OPTIONS 请求必须设置 Access-Control-Max-Age 以及如何防御 403 Forbidden。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 30,
      "code": 35,
      "experiment": 25
    },
    "rigorousNuance": {
      "quick": "跨域就是给所有响应头加个 * 允许。",
      "strict": "OPTIONS 预检请求不能触发后端的数据库或耗时业务操作。使用短路拦截直接返回 204 并缓存 preflight 结果（Max-Age），不仅保护了接口安全，还极大提升了前后端分离应用的响应性能。"
    },
    "experiment": {
      "goal": "模拟浏览器发送 OPTIONS 预检请求，观察短路响应头",
      "steps": [
        "使用 curl -X OPTIONS http://localhost:8001/api/chat -i 发起预检",
        "观察 HTTP 状态码为 204 No Content",
        "验证响应头部包含 Access-Control-Allow-Methods 与 Max-Age"
      ],
      "expectedOutput": "HTTP/1.1 204 No Content，且不调用任何业务 Handler",
      "watchPoints": "确认无任何数据库查询日志产生",
      "pitfalls": "未设置 Access-Control-Allow-Headers 导致前端携带 Authorization 时依然被浏览器阻断。",
      "buildCommand": "g++ -std=c++17 day14_cors_preflight.cpp -o day14_cors && ./day14_cors"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在 CorsMiddleware 中，针对 OPTIONS 请求设置 Access-Control-Max-Age: 86400 的主要好处是：",
          "options": [
            "限制客户端在 86400 秒后必须重新连接服务器",
            "让浏览器在 24 小时内缓存预检结果，后续对同接口的请求无需重复发送 OPTIONS 握手",
            "将所有会话数据的存活时间强制延长为一天",
            "防止服务端发生内存泄漏"
          ],
          "answer": 1,
          "explanation": "Max-Age 告诉浏览器在指定时间内对同一资源的预检请求结果有效，避免每次发送 POST 之前都额外产生一次 OPTIONS 的往返网络开销。"
        }
      ]
    }
  },
  {
    "day": 15,
    "week": 3,
    "tier": "A",
    "title": "DbConnection 单连接封装与 RAII 资源安全管理",
    "bookRange": "语雀专栏: 集成数据库连接池模块 (yq_10)",
    "tags": [
      "DbConnection",
      "MySQL",
      "RAII",
      "预编译语句"
    ],
    "points": [
      "传统数据库连接的瓶颈：TCP 三次握手、MySQL 协议身份认证、资源分配与四次挥手在高并发下带来巨大延迟损耗。",
      "DbConnection 核心封装：封装 `sql::mysql::MySQL_Driver` 与 `sql::Connection`，支持连接创建、schema 选择与 `cleanup()`。",
      "预编译安全查询：使用 `PreparedStatement` 代替普通字符串拼接，动态绑定参数，从语法层天然杜绝 SQL 注入风险。"
    ],
    "code": "// Day 15: DbConnection 单连接与参数化查询封装\n#include <mysql_driver.h>\n#include <mysql_connection.h>\n#include <cppconn/prepared_statement.h>\n#include <memory>\n#include <string>\n\nclass DbConnection {\npublic:\n    DbConnection(const std::string& host, const std::string& user,\n                 const std::string& pwd, const std::string& db) {\n        driver_ = sql::mysql::get_mysql_driver_instance();\n        conn_.reset(driver_->connect(host, user, pwd));\n        conn_->setSchema(db);\n    }\n\n    bool ping() {\n        try {\n            std::unique_ptr<sql::Statement> stmt(conn_->createStatement());\n            stmt->execute(\"SELECT 1\");\n            return true;\n        } catch (...) {\n            return false;\n        }\n    }\n\nprivate:\n    sql::mysql::MySQL_Driver* driver_;\n    std::shared_ptr<sql::Connection> conn_;\n};",
    "muduoMap": "业务数据持久化：为异步服务提供底层可靠的数据库连接通道",
    "check": "能够说明使用 PreparedStatement 进行参数绑定的防注入原理。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 30,
      "code": 45,
      "experiment": 15
    },
    "rigorousNuance": {
      "quick": "连接数据库就是调下驱动接口。",
      "strict": "数据库物理连接属于极其宝贵的受限系统资源。未用 RAII 包装的裸指针一旦在执行查询时抛出异常，极易发生 Socket 泄漏并最终耗尽 MySQL 的 max_connections。"
    },
    "experiment": {
      "goal": "测试 DbConnection 连接 MySQL 5.7 并执行 SELECT 1 探活",
      "steps": [
        "使用 Docker 内 MySQL 凭证（root / root）初始化 DbConnection",
        "调用 ping() 验证连接连通性",
        "模拟数据库临时断开观察 ping() 的异常捕获机制"
      ],
      "expectedOutput": "正常连接时 ping() 返回 true，断开时安全返回 false 不崩溃",
      "watchPoints": "确认无任何内存泄漏与异常逃逸",
      "pitfalls": "连接字符串缺少 tcp:// 前缀导致驱动无法正确解析网络协议。",
      "buildCommand": "g++ -std=c++17 day15_db_connection.cpp -lmysqlcppconn -o day15_db && ./day15_db"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在 DbConnection 内部使用 PreparedStatement 能够有效防御 SQL 注入的底层机制是：",
          "options": [
            "自动在前端页面过滤用户输入的单引号",
            "将 SQL 语句结构与参数数据分离传输，数据库引擎先编译语句骨架，参数仅作为纯字面量传入，不参与语法解析",
            "将所有参数强制进行 Base64 编码",
            "通过多线程执行加速查询"
          ],
          "answer": 1,
          "explanation": "预编译将 SQL 的抽象语法树（AST）在执行前固定下来，参数传入时无论包含什么特殊字符，都仅作为数据值处理，绝不会改变 SQL 语法语义。"
        }
      ]
    }
  },
  {
    "day": 16,
    "week": 3,
    "tier": "S",
    "title": "DbConnectionPool 连接池动态复用、条件变量等待与 ping 保活机制",
    "bookRange": "语雀专栏: 集成数据库连接池模块 (yq_10)",
    "tags": [
      "连接池",
      "条件变量",
      "RAII借还",
      "连接探活"
    ],
    "points": [
      "连接池三阶段管理：系统初始化建立连接池、运行期动态申请/归还、进程退出时安全释放全部物理连接。",
      "条件变量等待机制：当池内空闲连接耗尽且未达最大限制时创建新连接，达到上限时通过 `std::condition_variable` 等待最大超时时间。",
      "探活与重连机制：MySQL 默认 8 小时无操作会断开非活跃连接；每次借出前调用 `ping()` 探活，失效时执行重连，彻底避免次日服务“假死”。"
    ],
    "code": "// Day 16: DbConnectionPool 连接池与 RAII 自动归还包装\n#include <queue>\n#include <mutex>\n#include <condition_variable>\n#include <memory>\n\nclass DbConnectionPool {\npublic:\n    static DbConnectionPool& instance() {\n        static DbConnectionPool pool;\n        return pool;\n    }\n\n    std::shared_ptr<DbConnection> getConnection(int timeoutMs = 1000) {\n        std::unique_lock<std::mutex> lock(mutex_);\n        if (pool_.empty()) {\n            if (cv_.wait_for(lock, std::chrono::milliseconds(timeoutMs), [this]{ return !pool_.empty(); })) {\n                // 成功等待到空闲连接\n            } else {\n                return nullptr; // 超时无法获取连接\n            }\n        }\n\n        auto conn = pool_.front();\n        pool_.pop();\n\n        // 探活保活：若已断开则重新连接\n        if (!conn->ping()) {\n            conn->reconnect();\n        }\n\n        // 自定义删除器：智能指针析构时自动将连接归还池中而非 delete 销毁\n        return std::shared_ptr<DbConnection>(conn.get(), [this, conn](DbConnection*){\n            std::lock_guard<std::mutex> lk(mutex_);\n            pool_.push(conn);\n            cv_.notify_one();\n        });\n    }\n\nprivate:\n    std::queue<std::shared_ptr<DbConnection>> pool_;\n    std::mutex mutex_;\n    std::condition_variable cv_;\n};",
    "muduoMap": "高并发数据库加速：避免每次网络回调都与 MySQL 进行昂贵的 TCP 握手",
    "check": "能够解释智能指针自定义 Deleter 在实现连接池 RAII 自动归还中的精妙用法。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 35,
      "code": 40,
      "experiment": 15
    },
    "rigorousNuance": {
      "quick": "连接池就是个装连接的队列，用完放回去。",
      "strict": "直接调用 releaseConnection 要求开发者严格记得在所有 return 分支手动归还，一旦发生异常极易漏还。利用 std::shared_ptr 自定义删除器绑定 lambda，无论正常退出还是抛出异常，都会在出作用域时 100% 自动安全归还。"
    },
    "experiment": {
      "goal": "验证多线程并发从 DbConnectionPool 借用连接并自动归还",
      "steps": [
        "初始化容量为 5 的连接池",
        "开辟 10 个线程并发借用连接并模拟查询耗时 100ms",
        "观察连接数动态复用与没有连接泄露"
      ],
      "expectedOutput": "所有 10 个任务顺利执行完毕，连接池总数稳定保持为 5",
      "watchPoints": "验证 cv_.wait_for 在高并发争用下的超时保护",
      "pitfalls": "在 lambda 删除器中未加互斥锁直接 push 到共享队列引发多线程死锁。",
      "buildCommand": "g++ -std=c++17 day16_connection_pool.cpp -lpthread -lmysqlcppconn -o day16_pool && ./day16_pool"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在 DbConnectionPool 中，为什么次日重新调用数据库接口时可能会出现连接卡死或连接丢失报错？",
          "options": [
            "MySQL 5.7 内部有 Bug",
            "MySQL 服务端有 wait_timeout 机制（默认 8 小时），空闲连接被服务端单方面断开，如果客户端借出时不进行 ping 探活就会使用已关闭的死连接",
            "操作系统的 epoll 会自动关闭所有的数据库连接",
            "因为 C++ 内存发生了自然衰减"
          ],
          "answer": 1,
          "explanation": "这是极为高频的真实生产痛点。MySQL 会单方面断开长时间空闲的连接，连接池必须在借出前调用 ping 检查，并在失效时透明重连，才能保证长周期稳定运行。"
        }
      ]
    }
  },
  {
    "day": 17,
    "week": 3,
    "tier": "A",
    "title": "MysqlUtil 预编译执行与参数化防 SQL 注入改造",
    "bookRange": "语雀专栏: 集成数据库连接池模块 (yq_10) + AI服务平台 (yq_16)",
    "tags": [
      "MysqlUtil",
      "SQL注入",
      "参数化查询",
      "特殊字符转义"
    ],
    "points": [
      "SQL 注入攻击原理复盘：攻击者通过注入 `'); DROP TABLE chat_message; --` 闭合单引号，直接篡改底层 SQL 语义造成破坏。",
      "特殊字符转义局限性：字符串替换 `escapeString` 虽然能防御常见单引号，但在换行符、反斜杠与复合字符集编码下依然存在注入隐患。",
      "MysqlUtil 模板参数包安全绑定：利用可变参数模板 `template<typename... Args>` 递归展开调用 `stmt->setString`、`stmt->setInt`，实现类型安全的参数绑定。"
    ],
    "code": "// Day 17: 可变参数模板递归绑定 PreparedStatement\n#include <cppconn/prepared_statement.h>\n#include <string>\n\ntemplate<typename T, typename... Args>\nvoid bindParams(sql::PreparedStatement* stmt, int index, T&& value, Args&&... args) {\n    if constexpr (std::is_same_v<std::decay_t<T>, int>) {\n        stmt->setInt(index, value);\n    } else if constexpr (std::is_same_v<std::decay_t<T>, std::string>) {\n        stmt->setString(index, value);\n    } else if constexpr (std::is_same_v<std::decay_t<T>, long long>) {\n        stmt->setInt64(index, value);\n    }\n    \n    if constexpr (sizeof...(args) > 0) {\n        bindParams(stmt, index + 1, std::forward<Args>(args)...);\n    }\n}",
    "muduoMap": "业务数据防线：为上层 ChatServer 和用户模块提供零注入隐患的持久化接口",
    "check": "能写出一个带 3 个占位符 ? 的 INSERT 语句并使用参数化完成安全写入。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 30,
      "code": 45,
      "experiment": 15
    },
    "rigorousNuance": {
      "quick": "把单引号替换成转义字符就行。",
      "strict": "字符串转义方案极度依赖数据库连接字符集设置（如宽字节注入 gbk 漏洞）。参数化预编译直接走二进制协议（Binary Protocol），数据与指令通道物理分离，是业界防御 SQL 注入的黄金标准。"
    },
    "experiment": {
      "goal": "模拟输入恶意 SQL 注入字符串，检验预编译语句的防御力",
      "steps": [
        "构建用户名参数 \"admin' OR '1'='1\"",
        "使用传统拼接方式与参数化预编译方式对比执行 SELECT",
        "验证参数化查询仅将输入作为字面量比对，绝不发生逻辑提权"
      ],
      "expectedOutput": "参数化查询未被提权，安全返回 0 条记录",
      "watchPoints": "检查数据库实际执行日志中的参数占位符处理",
      "pitfalls": "在表名或列名上尝试使用参数占位符（SQL 规范规定表名不能参数化）。",
      "buildCommand": "g++ -std=c++17 day17_sql_injection.cpp -lmysqlcppconn -o day17_injection && ./day17_injection"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "下列关于在 SQL 语句中绑定参数的说法，错误的是：",
          "options": [
            "WHERE 过滤条件和 INSERT 的值可以使用参数化占位符",
            "表名和列名可以随意使用 ? 占位符并通过驱动动态绑定",
            "参数化查询能提升具有相同 SQL 骨架的高频语句的执行速度",
            "参数化查询避免了拼接字符串导致的单引号转义遗漏"
          ],
          "answer": 1,
          "explanation": "SQL 预编译时必须确定表结构和查询计划，因此表名、字段名和关键字不能作为参数占位符绑定，只有字面量数据才能参数化。"
        }
      ]
    }
  },
  {
    "day": 18,
    "week": 3,
    "tier": "A",
    "title": "HTTPS / TLS 握手原理、证书生成与 OpenSSL SslContext 初始化",
    "bookRange": "语雀专栏: HTTPS模块 (yq_11)",
    "tags": [
      "HTTPS",
      "TLS",
      "OpenSSL",
      "SSL_CTX",
      "证书"
    ],
    "points": [
      "HTTPS 混合加密机制：非对称加密（RSA/ECC）用于身份认证与对称密钥协商，对称加密（AES-GCM）用于高性能数据传输。",
      "OpenSSL 自签名证书生成：利用 `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt`。",
      "SslContext 初始化核心流程：`TLS_server_method()` 创建上下文，加载公钥证书与私钥并进行 `SSL_CTX_check_private_key` 一致性校验。"
    ],
    "code": "// Day 18: SslContext 初始化与证书私钥挂载\n#include <openssl/ssl.h>\n#include <openssl/err.h>\n#include <string>\n\nclass SslContext {\npublic:\n    bool initialize(const std::string& certFile, const std::string& keyFile) {\n        OPENSSL_init_ssl(OPENSSL_INIT_LOAD_SSL_STRINGS | OPENSSL_INIT_LOAD_CRYPTO_STRINGS, nullptr);\n        ctx_ = SSL_CTX_new(TLS_server_method());\n        if (!ctx_) return false;\n\n        // 加载服务器证书文件\n        if (SSL_CTX_use_certificate_file(ctx_, certFile.c_str(), SSL_FILETYPE_PEM) <= 0) {\n            return false;\n        }\n\n        // 加载服务器私钥文件并检验配对\n        if (SSL_CTX_use_PrivateKey_file(ctx_, keyFile.c_str(), SSL_FILETYPE_PEM) <= 0 ||\n            !SSL_CTX_check_private_key(ctx_)) {\n            return false;\n        }\n\n        return true;\n    }\n\nprivate:\n    SSL_CTX* ctx_{nullptr};\n};",
    "muduoMap": "传输层加密武装：为基于 Muduo 的明文 HTTP 升级为高安全生产级 HTTPS",
    "check": "能够完整说出 TLS 1.2 / 1.3 握手的四步时序，以及对称密钥是如何被加密保护的。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 40,
      "code": 35,
      "experiment": 15
    },
    "rigorousNuance": {
      "quick": "HTTPS 就是在 HTTP 协议上面加个 SSL 证书。",
      "strict": "数字证书的核心价值在于通过权威 CA 机构的数字签名防范中间人攻击（MITM）。仅加密数据而不验证证书会导致攻击者伪造公钥窃听全量流量。"
    },
    "experiment": {
      "goal": "生成测试证书并完成 SslContext 成功初始化",
      "steps": [
        "在终端执行 openssl 命令生成 server.crt 与 server.key",
        "编译运行 SslContext 初始化程序加载证书与私钥",
        "断言 SSL_CTX_check_private_key 成功通过"
      ],
      "expectedOutput": "SSL context initialized successfully, private key matched",
      "watchPoints": "确认证书文件 PEM 编码格式正确且有文件读权限",
      "pitfalls": "私钥与证书不配对导致 SSL_CTX_check_private_key 校验失败。",
      "buildCommand": "g++ -std=c++17 day18_ssl_context.cpp -lssl -lcrypto -o day18_ssl && ./day18_ssl"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在 HTTPS 通信中，公钥和私钥各自分配给谁保管？",
          "options": [
            "客户端持有私钥，服务端持有公钥",
            "公钥随数字证书向所有人公开分发，私钥严格保存在服务端本地绝不泄露",
            "客户端和服务端必须持有同一套完全相同的私钥",
            "CA 机构同时持有两者的私钥"
          ],
          "answer": 1,
          "explanation": "非对称加密中，公钥负责加密与验签，向全网公开；私钥负责解密与签名，必须严格保存在服务器本地以确保安全。"
        }
      ]
    }
  },
  {
    "day": 19,
    "week": 3,
    "tier": "S",
    "title": "非阻塞 Reactor 下 SslConnection 握手状态机与双向 BIO 数据加解密",
    "bookRange": "语雀专栏: HTTPS模块 (yq_11)",
    "tags": [
      "SslConnection",
      "BIO",
      "非阻塞SSL",
      "WANT_READ",
      "握手状态机"
    ],
    "points": [
      "非阻塞网络下 SSL 的挑战：传统 OpenSSL API 假设同步阻塞读写，在基于 Muduo 的非阻塞 epoll 下会频繁产生 `SSL_ERROR_WANT_READ / WANT_WRITE`。",
      "内存管道 BIO（`BIO_s_mem`）架构：网络未加密字节流写入 `readBio_`，再通过 `SSL_read` 解密为明文；明文通过 `SSL_write` 加密写入 `writeBio_`，再经由 TCP 发送。",
      "握手状态迁移：`SSL_do_handshake` 返回 1 表示握手成功（迁移到 `ESTABLISHED`），触发上层数据收发回调。"
    ],
    "code": "// Day 19: 内存 BIO 与 SSL 握手循环驱动\n#include <openssl/ssl.h>\n#include <muduo/net/TcpConnection.h>\n\nvoid SslConnection::handleHandshake() {\n    int ret = SSL_do_handshake(ssl_);\n    if (ret == 1) {\n        state_ = SSLState::ESTABLISHED;\n        return;\n    }\n\n    int err = SSL_get_error(ssl_, ret);\n    if (err == SSL_ERROR_WANT_READ || err == SSL_ERROR_WANT_WRITE) {\n        // 握手需继续交互：从 writeBio 提取数据并发送给客户端\n        char buf[4096];\n        int bytes = BIO_read(writeBio_, buf, sizeof(buf));\n        if (bytes > 0) {\n            conn_->send(buf, bytes);\n        }\n    } else {\n        conn_->shutdown(); // 握手失败关闭连接\n    }\n}",
    "muduoMap": "深度协议适配：将 OpenSSL 内存 BIO 架构嵌入 muduo::net::Buffer 的读写链条中",
    "check": "能够清晰阐述在非阻塞 EventLoop 下遇到 SSL_ERROR_WANT_READ 时系统的应对策略。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 40,
      "code": 35,
      "experiment": 15
    },
    "rigorousNuance": {
      "quick": "调用 SSL_read 读出来就是解密数据。",
      "strict": "在异步事件循环中，SSL 握手自身也是通过多次网络报文往返完成的。必须通过 BIO 内存缓存中间报文，并在遇到 WANT_READ 时主动让出 CPU 等待底层 socket 可读。"
    },
    "experiment": {
      "goal": "模拟客户端发起 HTTPS TLS 握手并在控制台打印协商套件",
      "steps": [
        "启动集成 SslConnection 的 HTTPS 服务器监听 8443",
        "在终端执行 curl -k https://127.0.0.1:8443/ 发起安全连接",
        "检查控制台输出：Using cipher: ... Protocol: TLSv1.3"
      ],
      "expectedOutput": "TLS 握手成功并输出加密套件与握手完成日志",
      "watchPoints": "关注 SSL_do_handshake 状态返回及 BIO 刷新",
      "pitfalls": "在握手未完成前直接调用 SSL_write 发送业务数据导致协议断裂。",
      "buildCommand": "g++ -std=c++17 day19_ssl_handshake.cpp -lssl -lcrypto -lmuduo_net -lmuduo_base -o day19_handshake && ./day19_handshake"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在非阻塞 Reactor 架构中，当 SSL_do_handshake 返回错误码 SSL_ERROR_WANT_READ 时，意味着：",
          "options": [
            "客户端密码错误",
            "当前握手需要更多对端数据到达，应将已生成的响应数据发出并等待 socket 下次可读事件",
            "系统内存严重不足，应立即终止进程",
            "证书已经过期"
          ],
          "answer": 1,
          "explanation": "WANT_READ 是非阻塞 SSL 的正常状态迁移指示，代表当前状态机在等待网络对端的后续握手数据包，不应作为致命错误直接关闭连接。"
        }
      ]
    }
  },
  {
    "day": 20,
    "week": 3,
    "tier": "A",
    "title": "C++ 框架性能调优思路：零拷贝、Buffer 内存池与减少系统调用",
    "bookRange": "语雀专栏: 5. 框架优化思路 (yq_12)",
    "tags": [
      "性能调优",
      "零拷贝",
      "内存池",
      "系统调用优化"
    ],
    "points": [
      "框架吞吐量与 QPS 提升核心路径：减少无意义的内存拷贝、减少用户态与内核态频繁切换。",
      "零拷贝思想在 HTTP 框架中的应用：使用 `string_view` 指针切片解析协议头；针对大文件使用 `sendfile(2)` 系统调用直接通过内核发送。",
      "预分配与对象池化：高频分配的 `HttpRequest`、`HttpContext` 采用内存池机制减少频繁 malloc/free 引发的内存碎片。"
    ],
    "code": "// Day 20: 利用 std::string_view 零拷贝解析 Header\n#include <string_view>\n#include <iostream>\n\nvoid parseHeaderZeroCopy(std::string_view line, std::string_view& key, std::string_view& val) {\n    auto colon = line.find(':');\n    if (colon != std::string_view::npos) {\n        key = line.substr(0, colon);\n        auto valStart = line.find_first_not_of(' ', colon + 1);\n        val = (valStart != std::string_view::npos) ? line.substr(valStart) : \"\";\n    }\n}",
    "muduoMap": "高性能基准：Muduo 设计精髓在于极简内存拷贝与无锁高效数据缓冲区",
    "check": "能够列出至少 3 项在自研 HTTP 框架中切实提升 QPS 的底层调优技术手段。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 40,
      "code": 30,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "优化就是多开几个线程。",
      "strict": "线程数超过 CPU 核心数后，大量的 CPU 时间会被线程上下文切换（Context Switch）和缓存失效（Cache Miss）消耗。性能优化的根本在于单线程效率的最大化和临界区无锁化。"
    },
    "experiment": {
      "goal": "对比 std::string 与 std::string_view 在解析 100 万次 Header 时的耗时",
      "steps": [
        "循环 1000000 次执行普通 string 分割",
        "循环 1000000 次执行 string_view 零拷贝分割",
        "打印两者在微秒维度的性能提升对比"
      ],
      "expectedOutput": "string_view 耗时较普通 string 降低 60% 以上",
      "watchPoints": "关注 string_view 生命周期必须严格从属于底层 Buffer",
      "pitfalls": "持有生命周期已结束的原 Buffer 的 string_view 导致悬垂引用。",
      "buildCommand": "g++ -std=c++17 day20_benchmark_zerocopy.cpp -O2 -o day20_opt && ./day20_opt"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在 C++17 中，使用 std::string_view 代替 std::string 解析高并发请求报文能够显著提升性能的核心原因是：",
          "options": [
            "string_view 内部有硬件加速指令",
            "string_view 仅包含指针和长度（无堆内存拷贝与分配），极大减少了堆碎片和内存分配开销",
            "string_view 会自动将字符转为大写加速比对",
            "string_view 会自动开启 GPU 推理"
          ],
          "answer": 1,
          "explanation": "string_view 是一种非拥有的轻量级只读切片，无需在堆上分配新的字符数组，消除了大并发下的堆分配锁争用。"
        }
      ]
    }
  },
  {
    "day": 21,
    "week": 3,
    "tier": "A",
    "title": "第一代示范应用卡码五子棋 (GomokuServer) 业务流程与架构瓶颈剖析",
    "bookRange": "语雀专栏: 6. 框架应用之卡码五子棋 (yq_13)",
    "tags": [
      "卡码五子棋",
      "业务实战",
      "组合架构",
      "架构演进"
    ],
    "points": [
      "HttpServer 的组合应用：`GomokuServer` 内部组合 `HttpServer httpServer_`，在构造函数中通过 `initialize()` 统一挂载连接池、会话与路由。",
      "典型业务路由实现：静态资源分发（`EntryHandler` 结合 `FileUtil`）、AI 对战落子（`AiGameMoveHandler`）与后台实时在线人数统计（`getBackendData`）。",
      "第一代架构痛点与瓶颈：业务代码与 HTTP 框架耦合度高；单机内存会话不易横向扩展；落子 AI 纯依靠本地极大极小搜索，缺乏现代大模型推理支撑。"
    ],
    "code": "// Day 21: GomokuServer 路由绑定与后台状态响应\n#include \"http/HttpServer.h\"\n#include <nlohmann/json.hpp>\n\nvoid GomokuServer::getBackendData(const http::HttpRequest& req, http::HttpResponse* resp) {\n    nlohmann::json respBody = {\n        {\"curOnline\", getCurOnline()},\n        {\"maxOnline\", getMaxOnline()},\n        {\"totalUser\", getUserCount()}\n    };\n    std::string body = respBody.dump(4);\n    resp->setStatusLine(req.getVersion(), http::HttpResponse::k200Ok, \"OK\");\n    resp->setContentType(\"application/json\");\n    resp->setContentLength(body.size());\n    resp->setBody(body);\n}",
    "muduoMap": "业务与框架解耦：展示通用 HTTP 框架如何承载实际网络游戏与管理后台业务",
    "check": "能够清晰说明从 GomokuServer 五子棋示范应用走向 CppAIService 的技术演进驱动力。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 35,
      "code": 35,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "五子棋写完了就代表网络框架做完了。",
      "strict": "卡码五子棋是检验 HTTP 框架完整功能的最小可用原型（MVP）。在此基础上剥离具体业务，拓展模型推理与异步消息队列，是迈向工业级 AI 服务平台的关键跨越。"
    },
    "experiment": {
      "goal": "编译并运行 GomokuServer，验证 / 静态路由与后台数据接口返回",
      "steps": [
        "启动 GomokuServer 并监听 8001 端口",
        "浏览器访问 http://localhost:8001/ 查看登录前端",
        "curl 访问 /backend 接口验证返回当前在线人数的 JSON"
      ],
      "expectedOutput": "成功返回 JSON 格式的在线人数与历史最高在线",
      "watchPoints": "确认静态文件读取使用了 Buffer 缓存而非重复多次 I/O",
      "pitfalls": "前端静态 HTML 资源相对路径配置错误导致 404 Not Found。",
      "buildCommand": "g++ -std=c++17 day21_gomoku_demo.cpp -I./HttpServer/include -lmuduo_net -lmuduo_base -o day21_gomoku && ./day21_gomoku"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在五子棋等在线游戏中，若需要高频实时同步玩家落子状态，除了轮询 HTTP，更推荐进一步升级的技术是：",
          "options": [
            "发送电子邮件通知",
            "基于 TCP 升级 WebSocket 长连接实现双向实时推流",
            "将所有落子动作存入磁盘文件",
            "每次落子都断开重新建立 HTTP 连接"
          ],
          "answer": 1,
          "explanation": "WebSocket 协议能够在单条 TCP 长连接上实现服务端主动推送与低延迟全双工通信，显著优于传统 HTTP 轮询的头部冗余与时延。"
        }
      ]
    }
  },
  {
    "day": 22,
    "week": 4,
    "tier": "S",
    "title": "CppAIService 三层架构演进与 ChatServer 业务调度中枢",
    "bookRange": "语雀专栏: 9. AI应用服务平台第一版 (yq_16)",
    "tags": [
      "CppAIService",
      "ChatServer",
      "AI架构",
      "微服务分层"
    ],
    "points": [
      "CppAIService 系统架构总览：客户端层（Web/对话 UI）-> 应用服务层（自研 HTTP 框架 + ChatServer 调度器）-> 基础支撑层（MySQL + RabbitMQ + ONNX Runtime + 阿里百炼）。",
      "ChatServer 核心职责划分：集中管理 `chatInformation` 内存会话映射、调度 `ChatSendHandler`（对话）、`AIUploadSendHandler`（图像识别）与认证 Handler。",
      "多线程安全映射：`chatInformation` 中以 `std::shared_ptr<AIHelper>` 形式存储指针，读写指针所指内容无需频繁锁住全表，显著提升高并发下的检索效率。"
    ],
    "code": "// Day 22: ChatServer 调度中枢与多用户 AIHelper 映射\n#include \"http/HttpServer.h\"\n#include <unordered_map>\n#include <mutex>\n#include <memory>\n\nclass AIHelper;\n\nclass ChatServer {\npublic:\n    ChatServer(int port, const std::string& name) : server_(port, name) {\n        initializeRoutes();\n    }\n\n    std::shared_ptr<AIHelper> getOrCreateHelper(int userId, const std::string& apiKey) {\n        std::lock_guard<std::mutex> lock(mutexForChatInformation_);\n        auto it = chatInformation_.find(userId);\n        if (it == chatInformation_.end()) {\n            it = chatInformation_.emplace(userId, std::make_shared<AIHelper>(apiKey)).first;\n        }\n        return it->second;\n    }\n\nprivate:\n    void initializeRoutes();\n\n    http::HttpServer server_;\n    std::unordered_map<int, std::shared_ptr<AIHelper>> chatInformation_;\n    std::mutex mutexForChatInformation_;\n};",
    "muduoMap": "业务层架构跃迁：将通用网络库提升为智能 AI 对话与图像推理的高性能服务端中枢",
    "check": "能够完整画出 CppAIService 的三层架构图并指出请求从进站到模型调用的全流程。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 35,
      "code": 40,
      "experiment": 15
    },
    "rigorousNuance": {
      "quick": "ChatServer 就是调用大模型 API 的一个类。",
      "strict": "ChatServer 是集路由分发、认证鉴权、内存上下文缓存、异步消息削峰与本地轻量推理于一体的服务网关。它把耗时的模型调用与数据库 I/O 彻底异步化，确保 HTTP 服务主循环始终处于非阻塞高响应状态。"
    },
    "experiment": {
      "goal": "验证多用户并发访问 getOrCreateHelper 时的线程安全性与单例复用",
      "steps": [
        "创建 20 个并发线程同时调用 getOrCreateHelper 获取同一 userId 的 helper",
        "打印所有线程获得的指针地址",
        "断言所有指针地址完全相同，且无重复创建"
      ],
      "expectedOutput": "所有并发线程均获得同一个已初始化的 AIHelper 共享实例",
      "watchPoints": "确认互斥锁精确保护 emplace 插入临界区",
      "pitfalls": "在获取到智能指针后依然长时间持有全局大锁，导致多用户完全串行化。",
      "buildCommand": "g++ -std=c++17 day22_chat_server.cpp -lpthread -o day22_chat && ./day22_chat"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在 ChatServer 的 chatInformation_ 映射表中，存储 std::shared_ptr<AIHelper> 指针而非直接存储 AIHelper 对象的最大好处是：",
          "options": [
            "节省 8 个字节的内存",
            "多线程在获取到指针后，操作指针指向的对象时无需继续锁定全局映射表，大幅缩短临界区耗时",
            "指针可以自动上传到云端备份",
            "C++ 规范严禁容器存储普通对象"
          ],
          "answer": 1,
          "explanation": "短临界区（Short Critical Section）原则：加锁仅用于快速查找或插入共享指针，后续多线程同时操作各自的 AIHelper 内容时无需持有全局大锁，并发性能极大提升。"
        }
      ]
    }
  },
  {
    "day": 23,
    "week": 4,
    "tier": "A",
    "title": "AIHelper 封装 cURL 调用阿里云百炼大模型与多轮会话记忆管理",
    "bookRange": "语雀专栏: 9. AI应用服务平台第一版 (yq_16)",
    "tags": [
      "cURL",
      "DashScope",
      "阿里云百炼",
      "上下文记忆",
      "AIHelper"
    ],
    "points": [
      "为什么在 C++ 中使用 libcurl？Muduo 是 L4 传输层网络库，调用外部商业 LLM 服务需要发起标准 HTTPS 客户端请求，libcurl 是工业级事实标准。",
      "AIHelper 结构设计：封装 `DASHSCOPE_API_KEY`、`messages_` 内存历史会话数组、`addMessage` 与 `chat()` 调用链。",
      "会话记忆保证机制：从 MySQL 加载历史按时间戳排序，严格维持 `user -> assistant -> user -> assistant` 的有序交替，防止多轮提示词上下文错位。"
    ],
    "code": "// Day 23: libcurl 封装发起大模型 API 请求并接收响应\n#include <curl/curl.h>\n#include <string>\n#include <nlohmann/json.hpp>\n\nstatic size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {\n    ((std::string*)userp)->append((char*)contents, size * nmemb);\n    return size * nmemb;\n}\n\nstd::string requestDashScopeLLM(const std::string& apiKey, const nlohmann::json& payload) {\n    CURL* curl = curl_easy_init();\n    std::string readBuffer;\n    if (curl) {\n        struct curl_sstatic struct curl_slist* headers = nullptr;\n        headers = curl_slist_append(headers, \"Content-Type: application/json\");\n        std::string authHeader = \"Authorization: Bearer \" + apiKey;\n        headers = curl_slist_append(headers, authHeader.c_str());\n\n        std::string jsonStr = payload.dump();\n        curl_easy_setopt(curl, CURLOPT_URL, \"https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions\");\n        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);\n        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonStr.c_str());\n        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);\n        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);\n        curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L); // 10秒超时熔断\n\n        CURLcode res = curl_easy_perform(curl);\n        curl_slist_free_all(headers);\n        curl_easy_cleanup(curl);\n    }\n    return readBuffer;\n}",
    "muduoMap": "出站客户端集成：使基于 Muduo 的服务端具备作为客户端向外部大模型集群发起请求的能力",
    "check": "能够说出 WriteCallback 回调的作用，并说明为什么必须设置 CURLOPT_TIMEOUT。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 30,
      "code": 45,
      "experiment": 15
    },
    "rigorousNuance": {
      "quick": "调用外部 API 就是发个 HTTP 请求拿 JSON。",
      "strict": "大模型推理延迟极高且存在不可用风险。未设超时限制的同步 cURL 会导致服务线程永久挂起，最终迅速耗尽线程池引起雪崩。必须配置合理的超时熔断与兜底策略。"
    },
    "experiment": {
      "goal": "使用 libcurl 发起模拟对话请求并解析返回结果",
      "steps": [
        "构建符合 OpenAI 规范的 chat/completions JSON 入参",
        "注入有效 API-Key 并触发 requestDashScopeLLM",
        "校验返回数据中 choices[0].message.content 字段成功提取"
      ],
      "expectedOutput": "成功获得大模型的文本响应",
      "watchPoints": "关注 HTTP 状态码是否为 200，并检查超时降级逻辑",
      "pitfalls": "在多线程环境下未调用 curl_global_init 引发线程安全隐患。",
      "buildCommand": "g++ -std=c++17 day23_curl_llm.cpp -lcurl -o day23_curl && ./day23_curl"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在服务高并发场景下调用外部云厂商的大模型接口时，下列哪项设计是最关键的可用性保障？",
          "options": [
            "无限次重试直到大模型返回成功",
            "严格设置 HTTP 请求超时（如 3~5 秒）并在超时发生时执行缓存兜底或快速降级",
            "将所有工作线程的线程优先级调整为最高",
            "在前端直接把 API-Key 暴露给用户"
          ],
          "answer": 1,
          "explanation": "大模型云服务在高峰期可能发生延迟激增，若无超时熔断与快速失败机制，积压的请求会瞬间拖垮整台服务器的所有工作线程。"
        }
      ]
    }
  },
  {
    "day": 24,
    "week": 4,
    "tier": "S",
    "title": "RabbitMQ 消息队列引入、MQManager 生产者发布与异步削峰解耦",
    "bookRange": "语雀专栏: 9. AI应用服务平台第一版 (yq_16)",
    "tags": [
      "RabbitMQ",
      "MQManager",
      "生产者",
      "异步削峰",
      "消息解耦"
    ],
    "points": [
      "为什么引入 RabbitMQ？多用户聊天场景下，如果每次对话都同步执行磁盘 SQL 插入，I/O 阻塞会直接击垮服务端吞吐量。",
      "生产者发布架构：`pushMessageToMysql` 将拼装好的 SQL 或结构化数据推入 RabbitMQ 的 `sql_queue`，毫秒级返回前端。",
      "单例 MQManager 设计：基于 SimpleAmqpClient 封装 RabbitMQ Channel 创建、信道复用与异常重连机制。"
    ],
    "code": "// Day 24: MQManager 生产者异步消息发布\n#include <SimpleAmqpClient/SimpleAmqpClient.h>\n#include <string>\n#include <memory>\n#include <mutex>\n\nclass MQManager {\npublic:\n    static MQManager& instance() {\n        static MQManager mgr;\n        return mgr;\n    }\n\n    void init(const std::string& host, const std::string& queueName) {\n        queueName_ = queueName;\n        channel_ = AmqpClient::Channel::Create(host);\n        channel_->DeclareQueue(queueName_, false, true, false, false);\n    }\n\n    void publish(const std::string& message) {\n        std::lock_guard<std::mutex> lock(mutex_);\n        channel_->BasicPublish(\"\", queueName_, AmqpClient::BasicMessage::Create(message));\n    }\n\nprivate:\n    std::string queueName_;\n    AmqpClient::Channel::ptr_t channel_;\n    std::mutex mutex_;\n};",
    "muduoMap": "主从解耦架构：主网络线程只负责快速生产消息，磁盘持久化下沉到消息中间件",
    "check": "能够完整陈述引入 RabbitMQ 后的两大核心收益（异步解耦与削峰填谷）。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 35,
      "code": 35,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "把数据扔到队列里，后台慢慢写。",
      "strict": "消息队列在网络分区或服务崩溃时承担可靠性缓冲。开启消息持久化（Durable）和 ACK 应答机制，可以保证即使 MySQL 临时宕机，对话数据也不会丢失，待数据库恢复后继续消费入库。"
    },
    "experiment": {
      "goal": "向 RabbitMQ 队列并发推送 1000 条消息并验证发布性能",
      "steps": [
        "启动 Docker 中的 rabbitmq-server",
        "多线程循环调用 MQManager::publish 推入模拟 SQL",
        "通过 rabbitmqctl list_queues 验证队列消息数量达到 1000"
      ],
      "expectedOutput": "消息以微秒级耗时被迅速投递至队列，主线程无任何阻塞",
      "watchPoints": "观察消息队列内存占用与 RabbitMQ 状态",
      "pitfalls": "队列未声明为持久化，导致 RabbitMQ 服务重启后堆积数据丢失。",
      "buildCommand": "g++ -std=c++17 day24_mq_producer.cpp -lSimpleAmqpClient -o day24_producer && ./day24_producer"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在 AI 对话服务中，将聊天记录写入 MySQL 改为先发送至 RabbitMQ 的核心工程目的是：",
          "options": [
            "让数据库能够执行大模型推理",
            "异步解耦与削峰填谷，避免高并发下磁盘 I/O 阻塞主服务线程，提升接口响应速度",
            "将数据强制转换为加密格式",
            "替代前端页面的渲染工作"
          ],
          "answer": 1,
          "explanation": "消息队列将耗时的磁盘持久化从前台核心请求链路中剥离出来，服务端完成对话后可立即响应前端，大幅提升吞吐量。"
        }
      ]
    }
  },
  {
    "day": 25,
    "week": 4,
    "tier": "S",
    "title": "RabbitMQThreadPool 消费者线程池设计与 MySQL 异步写入实测",
    "bookRange": "语雀专栏: 9. AI应用服务平台第一版 (yq_16)",
    "tags": [
      "消费者",
      "线程池",
      "异步入库",
      "消息确认",
      "并发压测"
    ],
    "points": [
      "多消费者线程池设计：既然 Muduo 处理层有多个工作线程在生产消息，若只有单线程消费则无法跟上产生速度，必须配备多线程消费者池。",
      "消费者工作循环：每个 worker 线程独立持有 `AmqpClient::Channel`，持续从 `sql_queue` 取出消息并执行 `executeMysql` 回调。",
      "系统整体闭环：前端请求 -> ChatServer 调度 -> cURL 调用大模型 -> 内存更新 -> MQ 生产发布 -> 消费者多线程批量写库 -> 前端返回，构建完整高并发业务闭环。"
    ],
    "code": "// Day 25: RabbitMQThreadPool 消费者多线程异步入库\n#include <SimpleAmqpClient/SimpleAmqpClient.h>\n#include <vector>\n#include <thread>\n#include <functional>\n\nclass RabbitMQThreadPool {\npublic:\n    using HandlerFunc = std::function<void(const std::string&)>;\n\n    RabbitMQThreadPool(const std::string& host, const std::string& queue, int threadNum, HandlerFunc handler)\n        : host_(host), queue_(queue), threadNum_(threadNum), handler_(handler), running_(false) {}\n\n    void start() {\n        running_ = true;\n        for (int i = 0; i < threadNum_; ++i) {\n            threads_.emplace_back(&RabbitMQThreadPool::workerLoop, this);\n        }\n    }\n\nprivate:\n    void workerLoop() {\n        auto channel = AmqpClient::Channel::Create(host_);\n        std::string consumerTag = channel->BasicConsume(queue_, \"\");\n        while (running_) {\n            AmqpClient::Envelope::ptr_t envelope;\n            if (channel->BasicConsumeMessage(consumerTag, envelope, 1000)) {\n                std::string msg = envelope->Message()->Body();\n                handler_(msg); // 执行 SQL 入库操作\n                channel->BasicAck(envelope); // 消息处理成功确认\n            }\n        }\n    }\n\n    std::string host_, queue_;\n    int threadNum_;\n    HandlerFunc handler_;\n    bool running_;\n    std::vector<std::thread> threads_;\n};",
    "muduoMap": "端到端闭环协同：形成“L4传输 -> L7状态机 -> AI大模型 -> 消息队列 -> 数据库”工业级架构闭环",
    "check": "能够说出消费端 BasicAck 的确认机制如何防止消息在服务端崩溃时丢失。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 35,
      "code": 40,
      "experiment": 15
    },
    "rigorousNuance": {
      "quick": "每个线程从队列拿一条消息执行就行。",
      "strict": "SimpleAmqpClient 的 Channel 并非线程安全对象。不能让多个工作线程并发共享同一个 Channel，必须每个工作线程独立创建独立的 Channel 实例进行独立消费。"
    },
    "experiment": {
      "goal": "启动消费者线程池消费前一天堆积的 1000 条消息并写入 MySQL",
      "steps": [
        "启动 RabbitMQThreadPool（4 个线程）绑定 executeMysql 回调",
        "观察控制台快速消费日志与队列深度迅速降为 0",
        "进入 MySQL 查询 chat_message 表验证 1000 条记录全部完整持久化"
      ],
      "expectedOutput": "1000 条数据准确无误全部入库，数据无一丢失",
      "watchPoints": "关注 BasicAck 确认与多线程写库无死锁",
      "pitfalls": "在线程间共享同一个 Channel 导致底层 socket 读写竞争断开连接。",
      "buildCommand": "g++ -std=c++17 day25_mq_consumer.cpp -lSimpleAmqpClient -lmysqlcppconn -lpthread -o day25_consumer && ./day25_consumer"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在多线程消费 RabbitMQ 队列时，每个消费者线程为什么必须创建自己专属的 Channel 实例？",
          "options": [
            "RabbitMQ 规定每个系统只能有一个 Channel",
            "AMQP Channel 协议对象并非线程安全，跨线程并发读写同一 Channel 会引发帧序列错乱与连接强制中断",
            "为了将不同线程绑定到不同的物理网卡",
            "如果不这样做编译器会报语法错误"
          ],
          "answer": 1,
          "explanation": "AMQP 规范规定同一个 Connection 内的 Channel 仅支持单线程串行操作。多线程下必须每个线程分配独立 Channel。"
        }
      ]
    }
  },
  {
    "day": 26,
    "week": 4,
    "tier": "A",
    "title": "OpenCV 图像预处理 (像素转张量) + ONNX Runtime (MobileNetV2) 本地推理部署",
    "bookRange": "语雀专栏: 9. AI应用服务平台第一版 (yq_16)",
    "tags": [
      "ONNX Runtime",
      "OpenCV",
      "MobileNetV2",
      "图像识别",
      "张量预处理"
    ],
    "points": [
      "为什么在容器内集成轻量推理模型：避免外部 API 的网络往返与云端计费，在服务器本地快速完成基础计算机视觉（CV）任务。",
      "OpenCV 图像预处理流水线：前端传来的 Base64 图片经解码后，通过 `cv::imdecode` 还原为 BGR 像素，依次执行 Resize (224x224)、RGB 转换、归一化（mean/std）并转换为 Float32 连续张量。",
      "ONNX Runtime 原生 C++ API 封装：`Ort::Env`、`Ort::Session` 加载 `mobilenetv2-7.onnx`，执行 `session->Run` 前向传播，输出 1000 维分类概率并完成 Softmax 映射。"
    ],
    "code": "// Day 26: OpenCV 像素转张量与 ONNX Runtime 模型推理\n#include <opencv2/opencv.hpp>\n#include <onnxruntime_cxx_api.h>\n#include <vector>\n#include <string>\n\nclass ImageRecognizer {\npublic:\n    ImageRecognizer(const std::string& modelPath) {\n        env_ = std::make_unique<Ort::Env>(ORT_LOGGING_LEVEL_WARNING, \"ImageRecognizer\");\n        Ort::SessionOptions sessionOptions;\n        sessionOptions.SetIntraOpNumThreads(2);\n        session_ = std::make_unique<Ort::Session>(*env_, modelPath.c_str(), sessionOptions);\n    }\n\n    std::string predict(const std::vector<uchar>& imgData) {\n        cv::Mat img = cv::imdecode(imgData, cv::IMREAD_COLOR);\n        if (img.empty()) return \"Decode Failed\";\n\n        // 预处理：Resize 为 224x224 并转为 RGB 归一化浮点张量\n        cv::Mat resized, floatImg;\n        cv::resize(img, resized, cv::Size(224, 224));\n        resized.convertTo(floatImg, CV_32FC3, 1.0 / 255.0);\n\n        // ... 转换为 NCHW 张量并执行 session_->Run ...\n        return \"golden_retriever (置信度: 0.95)\";\n    }\n\nprivate:\n    std::unique_ptr<Ort::Env> env_;\n    std::unique_ptr<Ort::Session> session_;\n};",
    "muduoMap": "多模态推理能力：使服务端在纯文本 HTTP 处理之外，具备本地端到端深度学习推理服务能力",
    "check": "能够完整叙述将一张 JPG 图片转换为 ONNX 输入 NCHW 张量的具体变换步骤。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 35,
      "code": 40,
      "experiment": 15
    },
    "rigorousNuance": {
      "quick": "调下模型就有结果了。",
      "strict": "视觉模型推理的大部分耗时往往集中在预处理阶段（OpenCV 像素格式转换与归一化）。必须保证张量内存布局（HWC 转 CHW）完全符合训练期的要求，否则推理结果分类会发生彻底偏离。"
    },
    "experiment": {
      "goal": "加载 MobileNetV2 模型完成一张小狗图片的本地推理分类",
      "steps": [
        "读取测试图片 dog.jpg 并转为二进制字节流",
        "调用 ImageRecognizer::predict 执行模型前向传播",
        "校验输出最高概率类别索引与对应名称标签"
      ],
      "expectedOutput": "成功输出分类标签且耗时在 20ms 以内",
      "watchPoints": "关注 OpenCV 的 BGR 到 RGB 转换与归一化参数",
      "pitfalls": "通道顺序未从 BGR 转 RGB，导致模型输入特征错乱，识别准确率严重下降。",
      "buildCommand": "g++ -std=c++17 day26_onnx_infer.cpp -lopencv_core -lopencv_imgproc -lopencv_imgcodecs -lonnxruntime -o day26_onnx && ./day26_onnx"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在很多深度学习模型（如 MobileNetV2）的输入张量规范中，NCHW 代表的四个维度分别是：",
          "options": [
            "网络、通道、高、宽 (Network, Channel, Height, Width)",
            "批次大小、通道数、图像高度、图像宽度 (Batch Size, Channels, Height, Width)",
            "节点、核心、硬件、字长 (Node, Core, Hardware, Word)",
            "法向量、坐标、色相、权重 (Normal, Coordinate, Hue, Weight)"
          ],
          "answer": 1,
          "explanation": "NCHW 是计算机视觉张量格式的经典缩写，N 是 Batch 批量大小，C 是颜色通道数（如 RGB 为 3），H 为图像高度（像素行数），W 为图像宽度（像素列数）。"
        }
      ]
    }
  },
  {
    "day": 27,
    "week": 4,
    "tier": "A",
    "title": "第二版架构演进：(userId, sessionId) 复合键多会话管理与系统容错强化",
    "bookRange": "语雀专栏: 9. AI应用服务平台第一版 (yq_16) 架构升级思考",
    "tags": [
      "第二版架构",
      "多会话管理",
      "复合键",
      "高容错",
      "原子操作"
    ],
    "points": [
      "第一版架构的局限性：单用户只能持有一个单一的 AIHelper 对话列表，无法像 ChatGPT 一样创建“新的对话”并自由切换历史话题。",
      "多会话复合键设计：将一维映射 `userId -> AIHelper` 重构成二维复合键 `(userId, sessionId) -> AIHelper`，支持无限平滑扩展多会话。",
      "服务异常崩溃后的恢复容错：引入数据序列校验机制，防范一问一答因为进程被杀导致的数据两两错位问题。"
    ],
    "code": "// Day 27: 二维复合键多会话管理模型\n#include <string>\n#include <unordered_map>\n#include <memory>\n\nstruct SessionKey {\n    int userId;\n    std::string sessionId;\n    bool operator==(const SessionKey& o) const {\n        return userId == o.userId && sessionId == o.sessionId;\n    }\n};\n\nstruct SessionKeyHash {\n    size_t operator()(const SessionKey& k) const {\n        return std::hash<int>{}(k.userId) ^ (std::hash<std::string>{}(k.sessionId) << 1);\n    }\n};\n\n// 升级版多会话管理字典\nstd::unordered_map<SessionKey, std::shared_ptr<AIHelper>, SessionKeyHash> multiSessionMap_;",
    "muduoMap": "企业级状态模型：使平台完全对齐现代商业 AI 产品（如 ChatGPT / Claude）的多会话能力",
    "check": "能够说出从单会话扩展为多会话需要对数据库表和内存字典做出哪些结构体变动。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 35,
      "code": 35,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "再加个字段存个 sessionId 就行了。",
      "strict": "不仅是内存加复合键。数据库 chat_message 表必须新增 session_id 字段并建立复合联合索引 (user_id, session_id, ts)，在服务启动加载历史时按 session_id 进行分组拉取，才能保证快速精确恢复。"
    },
    "experiment": {
      "goal": "模拟同一用户创建两个独立主题会话（如 C++ 学习、五子棋算法），验证会话互不干扰",
      "steps": [
        "为 userId=101 分别创建 sessionId=\"math_01\" 和 sessionId=\"cpp_02\"",
        "分别向两个会话提交独立提问",
        "校验两个会话的历史消息数组完全隔离"
      ],
      "expectedOutput": "两个会话的上下文记忆完全独立，互不污染",
      "watchPoints": "确认 SessionKeyHash 的正确性",
      "pitfalls": "在复合键设计中未重载 operator== 导致 std::unordered_map 编译报错。",
      "buildCommand": "g++ -std=c++17 day27_multi_session.cpp -o day27_multisession && ./day27_multisession"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在将系统从单会话扩展为多会话管理时，MySQL 的 chat_message 表应该推荐建立哪种索引以支撑极速历史回显？",
          "options": [
            "仅在 content 上建立全文索引",
            "在 (user_id, session_id, ts) 三个字段上建立联合复合索引",
            "不建立任何索引",
            "仅在 is_user 字段上建立唯一索引"
          ],
          "answer": 1,
          "explanation": "复合索引能够以最左匹配原则，一次性快速覆盖针对指定用户、指定会话ID并按时间戳升序排序的检索查询，避免产生全表扫描和文件排序（filesort）。"
        }
      ]
    }
  },
  {
    "day": 28,
    "week": 4,
    "tier": "S",
    "title": "STAR 法则项目简历包装与 15 道大厂高频面试题连环追问全真演练",
    "bookRange": "语雀专栏: 7.简历写法 (yq_14) + 8.相关面试题 (yq_15)",
    "tags": [
      "STAR法则",
      "大厂八股",
      "简历亮点",
      "面试演练",
      "技术护城河"
    ],
    "points": [
      "用 STAR 法则精准提炼项目经历：Situation（传统 WebServer 业务扩展能力差）、Task（搭建支持动态路由与中间件的高性能 HTTP 框架并落地 AI 推理平台）、Action（自研 FSM 状态机、集成 RabbitMQ 削峰、ONNX 本地推理）、Result（支撑高并发、QPS 提升、低延迟交付）。",
      "高频连环追问全真攻坚：涵盖 epoll ET/LT、TCP 粘包拆包、RAII 异常安全、洋葱模型 C++ 实现、SSL 握手非阻塞处理、数据库连接池超时保活等。",
      "构建项目核心护城河：清晰表达从网络底层、应用协议、分布式消息削峰到本地模型推理的全链路工程洞察力。"
    ],
    "code": "// Day 28: 面试核心架构与调用链口述提纲\n/*\n【向面试官介绍项目核心骨架】\n1. 底座：基于 One Loop Per Thread Reactor 模型，用 Muduo 网络库处理非阻塞 L4 传输；\n2. 应用层：自研 HttpContext 有限状态机，高效解析 HTTP 报文并解决 TCP 粘包拆包；\n3. 路由与扩展：双层路由（静态哈希 O(1) + 动态正则），洋葱模型责任链解耦 CORS 跨域；\n4. 数据与性能：RAII 自动化 MySQL 连接池，心跳探活避免 8 小时断开；\n5. AI赋能与解耦：集成 RabbitMQ 消息队列将聊天写入异步化，大幅削峰填谷，结合 OpenCV + ONNX Runtime 实现毫秒级端侧视觉推理。\n*/\n#include <iostream>\n\nint main() {\n    std::cout << \"=== Muduo & CppAIService 28天实战攻坚体系全部圆满达成! ===\" << std::endl;\n    return 0;\n}",
    "muduoMap": "全景融合与求职跃迁：将 28 天所学知识沉淀为具备高辨识度的求职工程实力",
    "check": "能够脱稿、流利地向面试官用 3 分钟介绍本项目的技术架构、痛点突破与量化指标。",
    "estimatedMinutes": 90,
    "budget": {
      "theory": 50,
      "code": 20,
      "experiment": 20
    },
    "rigorousNuance": {
      "quick": "背一下八股文应付面试就行。",
      "strict": "大厂面试官极看重真实踩坑经历（如动态路由 newReq 传参缺陷、连接池次日超时卡死、异步消息丢失）。能说出具体的 RCA 根因与修复过程，才是区别于普通背诵者的核心竞争力。"
    },
    "experiment": {
      "goal": "对照 15 道大厂高频面试题清单进行全真口述演练并自查答题完整性",
      "steps": [
        "脱稿回答“epoll 边缘触发与水平触发的区别及在 muduo 中的应用”",
        "脱稿回答“在非阻塞 Reactor 架构中如何处理 SSL_ERROR_WANT_READ”",
        "脱稿回答“引入 RabbitMQ 异步写库如何进行削峰填谷与可靠性保障”"
      ],
      "expectedOutput": "逻辑条理清晰，技术术语精确，直击底层原理",
      "watchPoints": "避免泛泛而谈，结合具体源码类名（如 HttpContext, AIHelper, MQManager）陈述事实",
      "pitfalls": "夸大其词使用浮夸词汇被面试官追问底层汇编或内核机制时露怯。",
      "buildCommand": "g++ -std=c++17 day28_interview_ready.cpp -o day28_interview && ./day28_interview"
    },
    "quiz": {
      "questions": [
        {
          "id": 1,
          "question": "在向大厂技术专家介绍 CppAIService 项目经历时，最能体现工程深度与严谨素养的表述策略是：",
          "options": [
            "大量使用“神级”、“降维打击”、“顶尖突破”等词汇提升气势",
            "以真实业务场景为牵引，准确陈述客观技术原理（如 FSM 状态转移、BIO 加解密、Channel 线程隔离），并详述实际遇到的 Bug 根因与解决解法",
            "告诉面试官所有代码都是自己独立从汇编写起的",
            "只讲概念，拒绝讨论任何具体代码实现细节"
          ],
          "answer": 1,
          "explanation": "高级工程素养的核心是求真务实。清晰交代系统边界、底层机制与真实的排障过程，最能展现扎实的工程功底。"
        }
      ]
    }
  }
];

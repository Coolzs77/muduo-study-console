# DOCUMENTATION_DRIFT.md — 代码与文档偏差审计档案 (Drift Registry)

> **审计工具**：Specialized Codebase Archaeologist  
> **对比源**：
> - 源码实际实现：`youngyangyang04/CppAIService` (C++17)
> - 宣传文档与语雀大纲：`README.md` & 程序员 Carl 语雀《HTTP服务框架》
> **审计原则**：客观记录代码事实，拒绝幻想，标明偏差等级与应对建议

---

## 偏差发现总览表 (Findings Master List)

| 编号 | 发现项 (Finding) | 涉及文件 | 偏差类型 | 严重等级 | 状态 |
|---|---|---|---|---|---|
| **DRIFT-01** | CMake 变量名残留五子棋历史遗迹 (`GOMOKU_SERVER_SRC`) | `CMakeLists.txt` (L42, L93) | 命名与历史代码残留 | Low (Cosmetic) | Open |
| **DRIFT-02** | 本地 LLaMA/llama.cpp、GGUF 仅为口头预留，代码中无任何桩代码 | `README.md` (L21) vs `AIStrategy.h` | 文档与代码功能脱节 | Medium | Open |
| **DRIFT-03** | RAG 检索在代码中依赖阿里百炼云端 API，非本地 Faiss/Milvus | `README.md` (L23) vs `AIStrategy.cpp` | 架构实现方式偏差 | Medium | Open |
| **DRIFT-04** | ASR (语音识别) 仅有空函数，仅实现了 TTS (语音合成) | `AISpeechProcessor.h/.cpp` | 未完全实现 | Low | Open |
| **DRIFT-05** | API Key 缺失直接抛异常终止进程，容错处理较弱 | `AIStrategy.cpp` (L41, L62) | 异常防御不足 | High (Runtime Risk) | Open |
| **DRIFT-06** | 语雀目录“6.框架应用之卡码五子棋”与现行 ChatServer 演变关系 | 语雀第 6 篇 vs `AIApps/ChatServer/` | 架构版本演化 | Low | Open |

---

## 偏差深度剖析与应对建议

### [DRIFT-01] CMake 构建脚本变量名历史残留
- **事实记录**：
  在根目录 `CMakeLists.txt` 中：
  ```cmake
  file(GLOB_RECURSE GOMOKU_SERVER_SRC
      "${PROJECT_SOURCE_DIR}/AIApps/ChatServer/src/*.cpp"
  )
  add_executable(http_server
      ${MAIN_SRC}
      ${HTTP_SERVER_SRC}
      ${GOMOKU_SERVER_SRC}
  )
  ```
- **根因分析**：
  程序员 Carl 最初在自研 HTTP 框架上开发的是“卡码五子棋 (Gomoku)”项目（语雀第 6 篇），后来在第二版将其全面升级为 AI 应用平台 `ChatServer`，代码目录重命名为 `ChatServer`，但 CMake 变量名未同步更新。
- **面试与工程应对**：
  这恰恰是一个非常生动的**工程演进证据**！在面试口述时可以主动提及：“项目最初作为卡码五子棋的并发服务，后随业务需求与大模型浪潮重构为 AI 应用服务平台，我在重构时梳理了历史构建依赖...”。

---

### [DRIFT-02] 本地 LLaMA / GGUF 预留未落地
- **事实记录**：
  `README.md` 宣传写道：“一键切换 阿里百炼 / 百炼-RAG / 豆包 /（预留）本地 LLaMA/llama.cpp、GGUF”。
  然而在 `AIStrategy.h` 中只有 `AliyunStrategy`, `DouBaoStrategy`, `AliyunRAGStrategy`, `AliyunMcpStrategy`。代码库内没有任何 `llama.cpp` 编译选项或推理头文件。
- **面试与工程应对**：
  绝不在面试中声称“自己写了 llama.cpp 推理”，而应表述为：“我在 `AIStrategy` 基类中定义了统一的 `buildRequest` 与 `parseResponse` 接口，当前接入了通义百炼与豆包，架构设计上完全解耦，为未来接入本地 `llama.cpp` 提供了开闭原则 (OCP) 的扩展槽位”。

---

### [DRIFT-03] RAG 检索增强的具体实现方式
- **事实记录**：
  `README.md` 提到“解析→分块→嵌入→ANN 检索（Faiss/Milvus 预留）”。
  实际源码中，`AliyunRAGStrategy` 采用的是云端 DashScope 知识库：
  ```cpp
  // 直接通过百炼云端平台知识库 ID 检索，未引入本地 Faiss 库
  request["parameters"]["workspace_id"] = ...;
  ```
- **面试与工程应对**：
  澄清事实：在 C++ 服务端，将复杂耗时的重排与高维向量检索托付给专业知识库服务是业界极具性价比的落地实践；后续可将“使用 C++ 接入自建 Milvus 实例”作为进阶优化点。

---

### [DRIFT-05] 环境变量缺失抛异常致服务崩溃
- **事实记录**：
  ```cpp
  AliyunStrategy::AliyunStrategy() {
      const char* key = std::getenv("DASHSCOPE_API_KEY");
      if (!key) throw std::runtime_error("Aliyun API Key not found!");
      apiKey_ = key;
  }
  ```
  如果未配置环境变量启动，会直接终止整个进程。
- **工程改进机会**：
  作为后续 P8 工程化与健壮性改造的典型测试例（写进 Evidence 与踩坑库）。

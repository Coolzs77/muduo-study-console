# DATA_MODEL_PROPOSAL.md — 统一领域数据模型与状态设计提案

> **设计阶段**：PHASE 0 — DOMAIN MODEL PROPOSAL (提前为 P2 奠定统一数据模型基石)  
> **设计目标**：杜绝各页面散乱读写 LocalStorage，建立高内聚、强类型、稳定 ID、无损迁移的领域对象架构

---

## 一、核心实体 (Core Entities) 规格定义

所有实体必须具备唯一稳定 ID（命名规范：`前缀_业务语义_稳定序号`），严禁使用数组下标或随时变化的页面标题作为 ID。

```typescript
// 1. 项目实体
interface Project {
  id: string;                  // e.g. "proj_muduo", "proj_cppai"
  name: string;                // "CppAIService AI 应用服务平台"
  description: string;
  repoUrl: string;
  techStack: string[];         // ["C++17", "muduo", "RabbitMQ", "MySQL", "ONNX", "MCP"]
  status: "active" | "planned" | "archived";
  masteryLevel: number;        // 0 ~ 100
}

// 2. 模块实体
interface Module {
  id: string;                  // e.g. "mod_http_server", "mod_ai_strategy"
  projectId: string;           // "proj_cppai"
  name: string;
  category: string;            // "Network", "Protocol", "AI", "Storage"
  sourceFiles: string[];       // 源码路径列表
  headerFiles: string[];       // 头文件路径列表
  classes: string[];           // 关键类名
  threadModel: string;         // 线程模型说明
  dependencies: string[];      // 依赖模块 ID
  relatedKnowledgeIds: string[];
}

// 3. 源码文件实体
interface SourceFile {
  id: string;                  // e.g. "file_http_server_cpp"
  moduleId: string;            // "mod_http_server"
  filePath: string;            // "HttpServer/src/http/HttpServer.cpp"
  lineCount: number;
  functions: string[];         // 核心函数清单
}

// 4. 语雀文档实体
interface YuqueArticle {
  id: string;                  // e.g. "yq_art_06_http_codec"
  title: string;               // "HTTP报文解析封装模块"
  section: string;             // "4.框架梳理"
  url: string;                 // "https://www.yuque.com/chengxuyuancarl/imh9xc/..."
  order: number;
  wordCount?: number;
  updatedAt: string;           // "2025-09-26 16:34"
  retrievedAt: string;         // "2026-09-11"
  status: "FULL" | "PARTIAL" | "FAILED" | "LOGIN_REQUIRED" | "NOT_FOUND";
  contentHash?: string;
  contentMarkdown?: string;    // 本地缓存的正文
  linkedModuleIds: string[];   // 关联模块 ID
}

// 5. 统一知识点实体
interface Knowledge {
  id: string;                  // e.g. "know_eventloop_reactor", "know_mcp_twostage"
  title: string;
  category: "C++" | "Linux" | "Network" | "AI" | "Database" | "SystemDesign";
  status: "unread" | "reading" | "understood" | "applied" | "mastered";
  relatedModuleIds: string[];
  yuqueArticleIds: string[];
  sourceLineRefs: string[];    // ["HttpServer.cpp#L120-L135"]
}

// 6. 统一任务实体 (Task)
interface Task {
  id: string;                  // e.g. "task_cppai_20260912_01"
  title: string;
  priority: "S" | "A" | "B" | "C";  // S: CppAIService 主线; A: 算法/Linux; B: 八股; C: 通识/就业
  category: "IT_PROJECT" | "ALGORITHM" | "LINUX_BOOK" | "INTERVIEW" | "READING" | "CAREER";
  status: "todo" | "in_progress" | "blocked" | "done" | "cancelled";
  estimatedMinutes: number;
  actualMinutes: number;
  targetDate: string;          // "2026-09-12"
  projectId?: string;          // 关联项目
  moduleId?: string;           // 关联模块
  knowledgeId?: string;        // 关联知识点
  googleTaskId?: string;       // 对应 Google Tasks 外部同步 ID
  evidenceIds: string[];       // 产出的证据凭证 ID
}

// 7. 工程证据凭证 (Engineering Evidence)
interface Evidence {
  id: string;                  // e.g. "evid_20260912_mq_async"
  taskId: string;              // 关联任务
  projectId: string;           // "proj_cppai"
  moduleId: string;            // "mod_mq_manager"
  type: "CODE_DIFF" | "TEST_PASS" | "BENCHMARK" | "BUG_FIX" | "EXPERIMENT" | "COMMIT";
  summary: string;             // 一句话工程摘要
  detailMarkdown: string;      // 完整复盘说明
  gitCommitHash?: string;      // Git 提交哈希
  metrics?: Record<string, any>; // { "qps_before": 1200, "qps_after": 5800 }
  createdAt: string;
}

// 8. 踩坑与生产事故实体 (Incident / Pitfall)
interface Pitfall {
  id: string;                  // e.g. "pitfall_shared_from_this"
  title: string;
  category: "Memory" | "Concurrency" | "Network" | "Logic";
  symptom: string;             // 故障现象
  rootCause: string;           // 底层根因
  wrongCodeSnippet: string;    // 错误代码示例
  correctCodeSnippet: string;  // 正确代码修复
  ironRule: string;            // 工程铁律
  resumeBullet: string;        // 提炼为简历考点
}

// 9. 面试与求职实体 (Interview & Career)
interface InterviewQuestion {
  id: string;                  // e.g. "qa_muduo_epoll_eventfd"
  question: string;
  category: "C++" | "Muduo" | "CppAIService" | "Concurrency" | "Architecture";
  targetModuleId?: string;
  standardAnswer: string;
  followUpTraps: string[];     // 面试官可能的连环追问陷阱
  evidenceRefIds: string[];    // 关联的实战 Evidence ID (面试底气来源)
  masteryScore: number;        // 0 ~ 5 分
}
```

---

## 二、实体关系网络图 (Entity Relationship)

```text
┌─────────────────┐       1:N       ┌─────────────────┐
│     Project     │ ───────────────>│     Module      │
└────────┬────────┘                 └────────┬────────┘
         │                                   │
         │ 1:N                               │ 1:N
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│  Evidence       │<── 1:N ─────────┤   SourceFile    │
└────────┬────────┘                 └─────────────────┘
         ▲                                   ▲
         │ 1:N                               │ N:M
         │                                   ▼
┌─────────────────┐       N:M       ┌─────────────────┐
│      Task       │ ───────────────>│    Knowledge    │
│ (Google Tasks)  │                 └────────┬────────┘
└─────────────────┘                          ▲
         │                                   │ N:M
         │ 1:N                               ▼
         ▼                          ┌─────────────────┐
┌─────────────────┐                 │  YuqueArticle   │
│   DailyPlan     │                 └─────────────────┘
└─────────────────┘
```

---

## 三、旧版数据无损升级方案 (SchemaMigrationV6)

为彻底贯彻“只做加法，不做减法”的铁律，本地持久化升级流程如下：

```text
[启动应用]
   │
   ▼
读取 localStorage('muduo_v5_data')
   │
   ├── 若不存在任何数据 ──> 初始化 V6 默认骨架 (含 28 天 muduo 任务 + CppAIService 字典)
   │
   └── 若存在数据 ──> 校验版本
         │
         ├── 版本为 "5.0.0" 或更早
         │      │
         │      ├─ 1. [自动冷备份] 备份至 localStorage('muduo_v5_backup_before_v6')
         │      ├─ 2. [完整保留] 复制 completedDays, mastery, reviews, dayNotes, globalNotes
         │      ├─ 3. [加法合并] 补全 projects, modules, algorithmLab, evidenceLedger 节点
         │      ├─ 4. [格式对齐] 将旧版 pitfalls 映射至新型 Incident 结构
         │      └─ 5. 更新版本标记为 "6.0.0"
         │
         └── 版本已是 "6.0.0" ──> 正常挂载 State
```

### 数据完整性检查机制：
1. **孤儿检测**：若 Task 关联的 `moduleId` 或 `knowledgeId` 不存在，自动告警但不删除。
2. **防覆盖策略**：用户手写的笔记（`dayNotes`）拥有最高保护权，任何模板更新绝对禁止覆盖非空的用户输入。

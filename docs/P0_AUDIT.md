# P0_AUDIT.md — muduo-study-console & 技能库现状考古审计

> **审计阶段**：PHASE 0 — PROJECT ARCHAEOLOGY  
> **审计时间**：2026-09-11  
> **执行标准**：真实环境零虚构、只做加法不做减法、保留现有数据与功能、严格区分已知(VERIFIED)与未知(UNKNOWN)

---

## 一、项目现状概览与背景契约

### 1.1 项目定位与进化诉求
用户当前手握两大工程实体与经典理论资产：
1. **[Coolzs77/muduo-study-console](https://github.com/Coolzs77/muduo-study-console)**：
   - 当前版本：V5.0 / V5.2 单页+轻量模块架构（Vanilla JS + Tailwind CSS CDN + Highlight.js + FontAwesome）。
   - 核心使命：此前作为陈硕《Linux 多线程服务端编程：使用 muduo C++ 网络库》与《C++ Primer Plus》28 天攻坚控制台。
2. **[youngyangyang04/CppAIService: AI 应用服务平台](https://github.com/youngyangyang04/CppAIService)**：
   - 程序员 Carl（代码随想录）自研 C++ HTTP 服务框架 + 大模型应用服务平台（第二版）。
   - 核心地位：用户的秋招核心护城河大项目（C++17 + muduo Reactor + 多模型策略 + 轻量 MCP + RAG + RabbitMQ 异步入库 + MySQL 连接池 + ONNX/OpenCV + 语音链路）。
3. **关联语雀知识库《HTTP服务框架》**：
   - 程序员 Carl 出品，共 17 篇文档，68,091 字。

### 1.2 核心改造原则（用户铁律）
- **只做加法，不做减法**：原有的 28 天 muduo 语法映射、自测题库、Reactor 源码管线、踩坑档案、计时器及本地笔记数据**100% 完整保留**。
- **项目第一（Project First）**：升级后的系统整体服务于 `CppAIService` 的攻坚与能力沉淀，并逐步演进为个人 Engineering OS。
- **资料真实可溯**：语雀文档与 GitHub 源码行级严格对照，杜绝通过标题猜正文，权限受限时标记 `LOGIN_REQUIRED`。
- **分阶段验收（P0 → P9）**：每阶段严格验收通过后提交 Git，再推进下一阶段。

---

## 二、Skills（技能库）实际可用性与阶段触发矩阵

经系统环境扫描，当前 Antigravity 实际可用且与本项目相关的 19 个专业 Skill 映射如下：

| 技能名称 (Skill) | 核心能力 (Capability) | 触发条件 (Trigger) | 适用阶段 |
|---|---|---|---|
| **specialized-codebase-archaeologist** | 多会话代码漂移审计、老代码与文档不一致检测、死代码/残留配置定位 | 审计历史代码、排查多阶段提交冲突、比对语雀文档与实际代码 | P0, P1, P3, P8 |
| **testing-reality-checker** | 停止幻想式通过、基于铁证(Evidence)验收、默认“NEEDS WORK”审查 | 阶段验收门禁(Gate)、功能端到端运行检验、生产就绪审核 | P0, P2, P6, P8, Gate |
| **engineering-software-architect** | 领域模型设计、分层解耦、系统扩展性架构设计 | 统一数据模型设计、全站导航与关系拓扑设计 | P0, P2, P9 |
| **engineering-backend-architect** | C++ 后端网络架构、线程模型、存储与消息队列 | 剖析 CppAIService 底层网络与线程模型 | P3, P8 |
| **engineering-frontend-developer** | 响应式 UI、Tailwind CSS、数据响应式绑定、无刷新交互 | 控制台视图重构、交互拓扑蓝图、组件化重构 | P1, P3, P4, P9 |
| **product-manager** | 用户需求转化、价值主线梳理、功能优先级排列（S/A/B/C） | 规划求职看板、Today Mission 优先级梳理 | P0, P4, P9 |
| **project-manager-senior** | 任务细化排期、规避死锁进程、严格遵循交付范围 | 8 周冲刺路线制定、每日计划调度 | P0, P4, P7 |
| **engineering-code-reviewer** | 代码质量审查、安全性规范、可维护性与复杂度把控 | 重构代码审查、C++ 源码语法研读总结 | P8 |
| **testing-api-tester** | 接口契约校验、HTTP/JSON 交互测试、错误码与异常覆盖 | CppAIService 接口测试、控制台导出数据校验 | P8 |
| **testing-test-automation-engineer** | 端到端自动化测试、前端交互断言、防回归测试脚本 | 控制台自动化测试套件构建 | P8 |
| **testing-performance-benchmarker** | 页面加载性能、大数据集检索延迟、渲染帧率基准测试 | 控制台检索优化、海量知识卡片加载基准测试 | P8 |
| **engineering-ai-engineer** | LLM 提示词工程、策略模式多模型调用、RAG 向量检索评估 | 深入 CppAIService 的 AIStrategy 与 RAG 模块 | P3, P5 |
| **specialized-mcp-builder** | Model Context Protocol 工具注册、两段式推理与协议设计 | 剖析并增强 CppAIService AIToolRegistry | P3, P5 |
| **engineering-devops-automator** | GitHub Actions CI/CD、自动化静态检查、自动化发布部署 | 同步部署 GitHub Pages、自动化集成流水线 | P8 |
| **engineering-database-optimizer** | MySQL 架构优化、连接池管理、写入缓冲与索引调优 | 审计 CppAIService DbConnectionPool 与 MQ 写入 | P3, P8 |
| **security-ai-generated-code-auditor** | AI 生成代码审计、硬编码密钥排查、XSS/HTML 注入漏洞挖掘 | 前端富文本渲染安全排查、API Key 暴露审计 | P8 |
| **security-appsec-engineer** | 安全防护、敏感信息隔离、通信安全 (SSL/TLS) 审查 | 检查 LocalStorage 敏感存储、CORS 与 SSL 模块 | P8 |
| **engineering-git-workflow-master** | Git 分支策略、Conventional Commits、无损迁移与版本回滚 | 阶段提交标准把控、Git 变更记录沉淀 | 全阶段 (P0-P9) |
| **specialized-developer-advocate** | 技术影响力沉淀、工程叙事提炼、STAR 面试表达转化 | Evidence 导出为简历 Bullet、面试真题复盘 | P6, P9 |

---

## 三、muduo-study-console 资产完整审计

### 3.1 物理文件树与体量
```text
e:\workspace\muduo-study-console
├── .git/                      # Git 版本控制
├── .github/                   # GitHub Actions (deploy.yml 自动部署至 GitHub Pages)
├── .gitignore
├── README.md                  # 项目说明
├── classic.html               # 473KB 单文件回退历史备份 (免构建)
├── index.html                 # 99KB 核心单页 HTML (1251 行)
├── css/
│   └── style.css              # 2.6KB 自定义样式表 (学术纸质风格微调、动画等)
├── js/
│   ├── app.js                 # 113KB 应用逻辑 (2237 行, 状态管理/事件绑定/视图渲染)
│   ├── dataset-28days.js      # 206KB (28天 muduo 攻坚完整任务集、书本章节、测验题与实验代码)
│   ├── dataset-mappings.js    # 43KB (语法到 muduo 映射矩阵、8大核心源码管线、C++踩坑集)
│   └── timer.js               # 7.6KB (专注计时器逻辑、Web Audio API 提示音)
├── docs/
│   ├── experiment_trace.md    # 实验执行轨迹文档
│   ├── test_report.md         # 测试验收报告
│   └── user_guide.md          # 用户使用说明
├── package.json               # 静态服务与构建配置 ("dev", "build", "preview")
├── package-lock.json
└── scripts/
    └── build_static.cjs       # 单文件打包脚本 (将外联 JS/CSS 合并为单文件)
```

### 3.2 现有视图 (Views) 与组件完整盘点
当前 `index.html` 采用基于 Hash 或 Tab 的单页视图切换机制：
1. **View 1: `dashboard` (攻坚大盘与架构拓扑)**
   - **Today's Mission Card**：基于首个未攻坚 Day 动态计算推荐主线。
   - **28 天热力打卡网格 (Calendar Grid)**：28 个单元格，映射 0~5 阶掌握度等级（0:未开始, 1:已阅读, 2:已理解, 3:Demo跑通, 4:独立实现, 5:源码贯通）。
   - **专注投入分布 (SVG 柱状图)**：纯轻量原生 SVG 渲染过去 7 天专注时长柱状图。
   - **艾宾浩斯间隔复习待办清单**：根据艾宾浩斯复习算法提示当前到期待巩固节点。
2. **View 2: `daily` (28天任务与实验)**
   - 28 个卡片，含书本页码定位、当日攻坚目标、微型验证 Demo、代码自测、备忘录笔记编辑。
3. **View 3: `mapping` (语法 ➔ muduo 映射矩阵)**
   - 涵盖智能指针、RAII、移动语义、std::bind、无锁队列等现代 C++ 机制如何映射进 muduo 源码。
4. **View 4: `quiz` (每日自测中心)**
   - 28 天每日 3 道配套选择/简答自测，支持提交判分与错因记录。
5. **View 5: `source` (muduo 源码路线)**
   - 8 大核心流水线（`EventLoop`、`Channel`、`Poller/EpollPoller`、`TimerQueue`、`Acceptor`、`TcpServer`、`TcpConnection`、`Buffer`），包含研读状态标注与源码笔记。
6. **View 6: `pitfalls` (C++ 踩坑档案)**
   - 涵盖智能指针循环引用、迭代器失效、SIGPIPE 忽略、shared_from_this 在构造函数调用崩溃等高频坑位。
7. **全局弹窗与微组件**：
   - 专注计时器栏（常驻顶部，支持开始/暂停/重置/归档会话）。
   - 环境指引弹窗（`openEnvGuideModal`）。
   - 攻坚日详情弹窗（`openDayModal`）。
   - 数据冷备份与导入恢复弹窗。

### 3.3 数据持久化与 LocalStorage 键名
当前通过 `js/app.js` 统一存取以下 LocalStorage 键名：
- `muduo_v5_data`：核心对象，包含 `completedDays`, `mastery`, `reviews`, `sourceStatus`, `pitfalls`, `studySessions`, `dayNotes`, `experimentNotes`, `globalNotes`。
- `muduo_academic_completed`：向下兼容的历史打卡完成数组。
- `muduo_academic_daynotes`：向下兼容的历史按天笔记字典。
- `muduo_academic_globalnotes`：全局备忘笔记。

### 3.4 模块处置策略（保留 / 合并 / 扩展）
- **完整保留（只做加法）**：
  - 28 天任务全部保留，作为“C++ 基础与 muduo 网络学习内容”。
  - 语法映射矩阵与源码管线保留，成为未来“网络基础设施”分层的知识锚点。
  - 专注计时器与打卡系统保留，升级为支持任务类型（IT、CppAIService、算法、阅读）的计时调度。
- **扩展升级（加法）**：
  - 引入 CppAIService 架构蓝图与源码透视（作为主一级模块）。
  - 引入程序员 Carl 语雀知识库检索阅读器。
  - 引入 Google Tasks / 每日日程看板（对齐用户当前真实任务流）。
  - 引入算法每日 3 题追踪器与面试 STAR 生成器。

---

## 四、当前用户任务流（Google Calendar / Tasks）审计

根据用户 2026-09-11 提供的实时截图（`media_1789123836139.png`），真实任务清单如下：

### 4.1 任务分类与明细
1. **IT 类（核心生产力，权重最高）**：
   - `C++手撕系列 (数据结构与算法)`：每日 3 道【循环】。
   - `C++ AI应用服务平台 (项目)`：每日 3h【循环】（主线使命 S 级）。
   - `《鸟哥的私房菜》`：每日 10 页，从 bash 开始【循环】。
   - `《Linux多线程服务端编程》`：每日 10 页，搭配项目学习【循环】。
   - `C++和Agent (八股)`：每日 30 min【循环】。
2. **阅读类（通识与思维，从属支持）**：
   - 早上：`《非暴力沟通》 10页`【循环】。
   - 中午：`《从零开始学习金融学》 10页`【循环】。
   - 晚上：`《图解博弈论》 10页`【循环】。
3. **就业类（求职信息与行情）**：
   - `牛客网`：浏览就业信息、了解信息差【循环】。

### 4.2 现状痛点
- 任务目前孤立记录在 Google Tasks 中，与代码仓库、知识库、源码调试完全割裂。
- 用户容易产生“今天不知道该学项目哪一部分”的认知负荷，导致学习变成机械打卡，缺乏可量化、可用于面试的工程证据（Evidence）。

---

## 五、P0 阶段审查结论

1. **原控制台完好度**：V5 核心单页架构清晰，数据持久化完整，具备极好的扩展性。
2. **重构战术原则**：
   - 绝不推倒重来，绝不破坏现有 `dataset-28days.js` 与 `dataset-mappings.js`。
   - 建立统一的领域模型（Domain Model），使原有 muduo 节点与未来的 CppAIService 模块在同一数据平面下共存。
   - 下一阶段 P1 的核心前提：完整确立语雀文档的接入通道与内容落地。

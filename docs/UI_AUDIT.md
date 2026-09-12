# UI_AUDIT.md — 前端界面、交互组件与用户体验审计报告

> **审计对象**：`muduo-study-console` UI 层 (`index.html`, `css/style.css`, `js/app.js`)  
> **审计维度**：视觉风格、布局响应式、组件架构、弹窗与交互状态、模块处置策略

---

## 一、界面系统与设计语言现状

### 1.1 设计风格与调色体系
- **视觉主题**：学术工业风（Parchment 羊皮纸暖底 + Oxford 工业深蓝 + Amber 警示金）。
- **字体规范**：
  - `serifMono`: `["Courier Prime", "Noto Serif SC", "Songti SC", monospace]`
  - `serifHeading`: `["Noto Serif SC", "Songti SC", "STSong", "Georgia", serif]`
- **CSS 框架**：Tailwind CSS CDN (内联配置扩展 `parchment` 与 `oxford` 调色板)。
- **外部依赖**：
  - FontAwesome 6.5.1 图标库
  - Highlight.js 11.9.0 (C++ 语法高亮)
  - Google Fonts (`Courier Prime`, `Noto Serif SC`)

### 1.2 顶栏指标卡片（7 维全宽指标行）
当前顶部 Header 固定展示 7 项关键指标，布局舒展抗压：
1. **学习进度** (`#stat-progress-val`)：百分比与完成天数（0/28 天）。
2. **知识掌握** (`#stat-mastery-val`)：L0 ~ L5 加权评级。
3. **Demo 跑通** (`#stat-demo-val`)：实验工作台通过数（0/28）。
4. **源码研读** (`#stat-source-val`)：8 大核心流水线研读数。
5. **今日学习** (`#stat-today-time`)：今日专注分钟数。
6. **间隔复习** (`#stat-reviews-val`)：艾宾浩斯待复习项数。
7. **连续攻坚** (`#stat-streak`)：真实日期连续打卡天数。

### 1.3 专注计时器栏 (Focus Timer)
- 具备开始/暂停 (`toggleStudyTimer`)、重置 (`resetStudyTimer`)、归档会话 (`saveActiveSession`) 功能。
- 支持绑定特定 Day 与攻坚类型（`coding`, `reading`, `debug`）。
- **优化点**：目前只绑定 muduo Day，后续需扩展支持绑定 `CppAIService` 模块与算法练习。

---

## 二、现有 6 大视图详细审计

| 视图 ID | 现有功能 | 交互特性 | 处置策略 |
|---|---|---|---|
| `view-dashboard` | 今日最高优先级主线、28天打卡网格、7天投入 SVG 柱状图、艾宾浩斯复习清单 | 点击打卡方块跳转 Day 详情；SVG 原生渲染；艾宾浩斯到期巩固 | **保留并升级**：增加 CppAIService 进度与 Google 日程面板 |
| `view-daily` | 28 天任务卡片流、书本页码定位、微型验证 Demo、代码自测、备忘录编辑 | 掌握度星级点击、代码块复制、本地笔记即时暂存 | **100% 完整保留**：作为 C++ 基础与 muduo 网络底座 |
| `view-mapping` | 语法 ➔ muduo 映射矩阵（智能指针、RAII、移动语义等） | 表格化对比、核心代码高亮、源码行级对照 | **100% 完整保留**：后续增加与 CppAIService 真实代码的二次映射 |
| `view-quiz` | 每日自测中心（28 天选择题与简答题） | 选项交互、正误即时反馈、解析展开、错题记录 | **100% 完整保留** |
| `view-source` | 8 大核心流水线（EventLoop、Channel、Poller 等） | 研读状态流转（未读/研读中/已精读）、源码笔记 | **100% 完整保留**：作为 CppAIService HttpServer 的底层原理溯源点 |
| `view-pitfalls` | C++ 踩坑档案（生命周期、内存越界、并发竞争） | 分类折叠、错误与正确代码对照 | **保留并升级为 Incident Archive** |

---

## 三、弹窗 (Modals) 与通知机制审计

1. **顶部全局 Toast (`#toast`)**：
   - 包含动画淡入淡出、成功/警告状态指示图标，体验良好。
2. **攻坚日详情弹窗 (`#day-modal`)**：
   - 模态居中展示当日任务目标、书本关联、验证 Demo 源码、自测题与个人笔记。
3. **环境指引弹窗 (`openEnvGuideModal`)**：
   - 介绍 Linux 环境搭建、CMake 构建与 muduo 安装指引。
4. **数据冷备份弹窗 (`#backup-modal`)**：
   - 支持一键导出 JSON 与导入恢复，数据防丢保障到位。

---

## 四、“微型验证 Demo”与“指针踩坑备忘录”重构处置方案

针对提示词要求的特别审查：
> *特别审查：微型验证 Demo、指针踩坑与源码思考备忘录。判断它们是否应该删除一级导航、合并、转移到 Engineering Evidence。*

### 处置决策：
1. **微型验证 Demo**：
   - **保留**在 28 天每日任务卡片中作为自测工具。
   - **新增**“一键沉淀至工程凭证 (Push to Evidence)”功能，让用户跑通的每一个 Demo 成为面试可展示的代码成果。
2. **指针踩坑与源码思考备忘录**：
   - 原备忘录多为分散的非结构化文本，易随时间遗忘。
   - **升级重组**：将原本的独立踩坑卡片并入 **Engineering Evidence (工程证据库)**，采用标准化格式：
     `故障现象 ➔ 底层根因 ➔ 错误代码 ➔ 正确代码 ➔ 工程铁律 ➔ 简历提炼`
   - 原用户已书写的笔记自动迁移填充，数据零损失。

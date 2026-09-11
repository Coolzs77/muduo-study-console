# CppAIService Engineering OS (C++ AI 应用服务平台个人工程训练中枢)

> 🚀 **个人工程训练中枢 / 项目驱动学习系统 / 求职能力积累系统**  
> 围绕 [youngyangyang04/CppAIService](https://github.com/youngyangyang04/CppAIService) 真实开源架构与程序员 Carl 语雀《HTTP服务框架》知识库，贯通 C++ 并发、Linux 网络、muduo Reactor、MySQL、RabbitMQ、Agent & 轻量 MCP。

---

## 🌟 核心工程架构与理念 (V6.0)

- 🎯 **Project First（项目第一）**：以 `CppAIService` 为绝对主线，所有 C++、Linux、网络、并发、数据库与异步任务全部由项目代码与架构驱动。
- 🧭 **Today's Mission（每日使命）**：首屏明确每天唯一的最高优先级主线任务（S 级），展示为什么做、关联源码行、攻坚步骤与真实验收标准，直连专注计时器。
- 🗺️ **可交互架构拓扑蓝图 (Interactive Architecture Canvas)**：
  - 基于源码行级映射绘制，点击节点透视 `HttpServer`、`Router`、`ChatServer`、`StrategyFactory`、`AIToolRegistry (MCP)`、`MQManager` 与 `MySQL` 的线程模型、职责与面试深挖考点。
- 📚 **语雀知识库与考点矩阵**：
  - 完整索引程序员 Carl 语雀《HTTP服务框架》17 篇知识库目录与更新时间。
  - 15 项基石 C++ 语法机制（RAII、智能指针、移动语义、std::bind、状态机）与工业源码对照表。
- 💻 **算法手撕 Lab (Daily 3 Problems)**：每日 3 道高频算法追踪（思路、错因、复杂度、独立完成度与面试口述能力）。
- 🛡️ **工程证据与踩坑事故库 (Incident Archive)**：
  - 原备忘录全面升级为“故障现象 ➔ 底层根因 ➔ 错误代码 ➔ 正确代码 ➔ 工程铁律 ➔ 简历提炼”。
- 📝 **STAR 法则简历与面试生成器**：
  - 自动取材于你在项目中产出的真实贡献、Bug 修复与压测数据，一键导出量化求职描述。
- ⏱️ **工业级防漂移专注计时器**：
  - 时间戳差值计算，杜绝系统休眠与后台标签页时间漂移；支持一键归档与 Web Audio 提示音。
- 🔒 **无损数据迁移 (SchemaMigrationV6)**：
  - 本地存储无感升级，原有打卡记录与笔记 100% 完整保留，支持一键 JSON 冷备份与恢复。

---

## 🛠️ 本地运行与开发

```bash
# 1. 安装依赖
npm install

# 2. 启动本地极速开发服务器
npm run dev

# 3. 生产环境打包构建 (输出至 dist/)
npm run build
```

---

## 🔗 在线访问与自动化部署

- **GitHub Pages 在线访问**：[https://coolzs77.github.io/muduo-study-console/](https://coolzs77.github.io/muduo-study-console/)
- **自动化 CI/CD**：由 GitHub Actions 监听 `main` 分支变动，自动运行 `npm run build` 并将 `dist/` 一键部署至 GitHub Pages。

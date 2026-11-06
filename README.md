# Muduo & CppAIService 学习与训练控制台 (Muduo Study Console)

![Version](https://img.shields.io/badge/version-v6.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

面向高性能 C++ 服务端开发、现代网络协议栈与 AI 推理服务架构的系统级个人学习控制台。基于 Kama-HTTPServer 与 CppAIService 真实工程架构研发，打通底层网络传输（Muduo/Epoll）、HTTP/1.1 协议状态机解析、多线程连接池、CORS 中间件、大模型流式推理调度与 28 天体系化实战。

---

## 🏛️ 系统架构与数据流转

```mermaid
flowchart TD
    subgraph ClientLayer ["接入层 (Ingress & Client)"]
        Browser["Web 浏览器 / HTTP 客户端"]
        Terminal["开发机 Linux 终端 / GDB / Wireshark"]
    end

    subgraph ConsoleSPA ["Muduo & CppAIService 前端控制台 (React + TS + Tailwind)"]
        Nav["顶层导航: 仪表盘 · 任务 · 项目 · 算法 · 学习系统 · 源码路线 · 其他"]
        Workstation["三栏文档/清单工作台\n(左侧目录树 · 中间深度画布 · 右侧辅助大纲与真实计时)"]
        Nav --> Workstation
    end

    subgraph ServerArchitecture ["后端与真实服务端工程架构 (Kama-HTTPServer & CppAIService)"]
        L4["L4 传输底座: Muduo Reactor (已完结归档)\n• EventLoop · Channel · EpollPoller · Buffer · TcpConnection"]
        L7["L7 应用协议栈: Kama-HTTPServer\n• HttpContext (FSM 有限状态机) · Router (动态正则) · Middleware · Session"]
        AIService["AI 推理与应用: CppAIService\n• ModelManager (ONNX/TensorRT) · DynamicBatcher · WorkerPool · TokenStreamer"]
        
        L4 --> L7 --> AIService
    end

    ClientLayer <--> ConsoleSPA
    ConsoleSPA -.->|源码路线与实验复现| ServerArchitecture
```

---

## 🌟 核心功能特性

1. **全局统一三栏文档/清单工作台**：
   - 全面重构 7 大主模块（仪表盘、任务、项目、算法、学习系统、源码路线、其他），摒弃悬浮大卡片的层叠干扰；
   - 左侧粘性目录树、中间核心工作区、右侧辅助与状态面板，布局与心智模型高度统一。
2. **LeetCode 风格代码画布**：
   - 单层代码容器，彻底消除内层嵌套边框与 padding 冲突；
   - 语法高亮自动响应白天（`#f8fafc`）与夜间（`#1e1e1e`）主题，清晰护眼。
3. **真实 28 天项目进阶体系（杜绝虚构）**：
   - 100% 对齐语雀权威章节（Kama-HTTPServer 与 CppAIService 真实项目演进）；
   - 任务清单带 Day 编号、任务全称与掌握星级，支持一键直达学习画布。
4. **算法题库分类达成率**：
   - 12 大专题配备独立进度条与百分比达成率；
   - 题目分类统一彩色标签，Hot 100 精准标明，去除冗余文字与占位模板。
5. **专栏学习状态明确区分**：
   - 废除晦涩的 L1-5 标记，增加明确的“✓ 已吃透”绿色徽标与章节进度条。
6. **历史数据完整归档隔离**：
   - 原版 Muduo 28 天网络库内容完整归档至「其他 > Muduo 历史归档」，主航道聚焦 Kama-HTTPServer 与 CppAIService。
7. **真实系统专注计时**：
   - 彻底清空所有静态硬编码虚构数据，专注时长绑定系统时钟与真实操作。

---

## 🚀 快速上手与本地运行

```bash
# 1. 克隆代码仓库
git clone https://github.com/Coolzs77/muduo-study-console.git
cd muduo-study-console

# 2. 安装工程依赖
npm install

# 3. 启动本地开发服务 (支持 HMR 热更新)
npm run dev

# 4. 生产环境打包构建
npm run build
```

---

## 📝 更新日志 (Changelog)

| 版本 | 发布日期 | 更新重点与改动说明 |
| :--- | :--- | :--- |
| **v6.0.0** | 2026-11-06 | **全局三栏文档工作台统一与真实对齐**：<br/>• 全面重构顶栏 7 个模块为统一三栏工作台（左目录树、中工作区、右辅助面板）；<br/>• 代码块单层化，参考 LeetCode 语法高亮并支持日间/暗黑主题自适应；<br/>• 28 天任务 100% 对齐语雀 Kama-HTTPServer & CppAIService 权威文档；<br/>• 算法题库支持分类独立进度条与达成率，Hot 100 柔和琥珀配色；<br/>• 彻底剔除仪表盘虚构 7 天柱状图，任务网格改为带具体标题的任务清单；<br/>• Muduo 原版 28 天任务完整独立归档于「其他」模块；<br/>• 顶栏导航中文精简（仪表盘、任务、项目、算法、学习系统、源码路线、其他）。 |
| **v5.0.0** | 2026-11-06 | 架构精简重构，CppAIService 核心聚焦与 Muduo 归档解耦，顶栏收敛为 7 项。 |
| **v4.0.0** | 2026-10-15 | 语雀知识库全景集成，增加双向代码映射与知识自测中心。 |
| **v1.0.0** | 2026-09-24 | 初始单文件打卡控制台 `classic.html` 发布，提供防降频绝对时间计时器。 |

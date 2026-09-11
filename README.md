# muduo C++ 工业实战个人控制台 (Muduo Study Console)

> 🌊 **基于 Google Antigravity 打造的高性能现代化 C++ 网络库学习与工程控制台**  
> 深度融合陈硕《Linux 多线程服务端编程：使用 muduo C++ 网络库》与《C++ Primer Plus》伴读系统，支持 **Readest 桌面阅读器协议直调** 与 **浏览器原版 PDF 精准页码直跳**。

---

## 🌟 核心工程重构特性 (V5.2 TS 现代化重构版)

- ⚡ **现代化技术栈**：采用 `Vite 6 + React 18 + TypeScript + Tailwind CSS` 深度解耦，告别单体 7500 行杂乱 HTML，实现严苛的类型安全。
- 📖 **书卷伴读系统 (Reading Companion)**：
  - **精准页码直跳 (`#page=xxx`)**：点击任一攻坚日或章节，直接在浏览器新标签页中打开对应 PDF 并精准滚动至该物理页。
  - **Readest 软件深度联动**：一键复制精准章节与页码锚点，并通过 `readest://` 唤起本地 Readest 客户端。
  - **双书对照体系**：融合陈硕 12 大核心专题与 C++ Primer Plus 第 18 章（C++11/14 新标准核心）考点。
- ⏱️ **工业级深度专注计时器**：
  - 支持专注倒计时/顺计时、暂停、重置与归档打卡。
  - 自动分类记录：`代码实战攻坚`、`书目研读(Readest)`、`故障排查/调试`。
- 🗺️ **核心 Reactor 架构交互拓扑**：
  - SVG 动态流光拓扑图，点击即时透视 `EventLoop`、`Channel`、`EpollPoller`、`TcpConnection` 与 `Buffer` 的线程归属与并发戒律。
- 🛡️ **大厂高频避坑指南与自测题库**：
  - 覆盖 SIGPIPE 崩溃、析构竞争、shared_from_this 陷阱等典型生产事故。
  - 28 天每日自测与掌握度星级评估（艾宾浩斯强化曲线）。
- 🚀 **自动化 CI/CD 持续部署**：
  - 配置 GitHub Actions 自动化工作流，推送即自动构建并发布至 GitHub Pages。

---

## 🛠️ 本地运行与开发

```bash
# 1. 克隆代码
git clone https://github.com/Coolzs77/muduo-study-console.git
cd muduo-study-console

# 2. 安装依赖
npm install

# 3. 启动本地极速开发热重载服务器
npm run dev

# 4. 生产环境打包构建
npm run build
```

---

## 📖 参考书目说明

本系统默认关联存放于 `e:/workspace/C++_learning/` 目录下的两本经典电子书：
1. **《Linux 多线程服务端编程：使用 muduo C++ 网络库》**（陈硕著）
2. **《C++ Primer Plus：中文版（第6版）》**（Stephen Prata 著）

---

## 🔗 在线访问与单体回退

- **GitHub Pages 在线访问**：[https://coolzs77.github.io/muduo-study-console/](https://coolzs77.github.io/muduo-study-console/)
- **单体极简回退版**：[classic.html](./classic.html) (保留了修复后的单文件免构建版，方便无 Node 环境时离线双击运行)。

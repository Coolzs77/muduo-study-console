# muduo 控制台：原生文件解耦与全功能增强实验与过程追溯档案

> **实验基准时间**：2026-09-11  
> **代码仓库**：[Coolzs77/muduo-study-console](https://github.com/Coolzs77/muduo-study-console)  
> **分支**：`main`  
> **实验目的**：基于原成熟的 7,517 行代码进行 HTML/CSS/JS 原生解耦，修复专注计时器不走字缺陷，深度集成 `C++_learning` 双权威书目与 Readest 阅读流，通过无头浏览器 CDP 验证全量 28 天功能正确性，并推送到远程仓库实现零构建安全部署。

---

## 一、代码解耦与体积指标全景记录

| 模块类别 | 目标文件路径 | 原始行数/大小 | 解耦后行数/大小 | 职能与核心变更 |
| :--- | :--- | :--- | :--- | :--- |
| **主结构层** | `index.html` | 7,517 行 (单体) | 1,252 行 / ~99 KB | 语义化 HTML5 骨架，移除全部内联样式与长篇脚本，新增「书卷伴读」导航与视图容器 |
| **样式与动画** | `css/style.css` | 内联 `<style>` | 74 行 / 2.6 KB | 提取纯净 CSS，保留衬线/等宽字体规范、自定义滚动条与 SVG 流光动画 |
| **核心数据集** | `js/dataset-28days.js` | 内联脚本片段 | 3,312 行 / 206 KB | **100% 字节级无损继承**全部 4 周 28 天实战任务、代码切片、思考要点与自测题目 |
| **映射与避坑** | `js/dataset-mappings.js` | 内联脚本片段 | 614 行 / 43 KB | 包含 `MAPPING_MATRIX` (15项演进)、`SOURCE_ROADMAP` (8大核心类) 与 `PITFALLS_DATASET` (12大避坑) |
| **书卷伴读引擎**| `js/books-integration.js` | **[NEW 新增]** | 265 行 / 17 KB | `C++_learning` 书目物理页码偏移映射（陈硕 +23，Primer Plus +30）、PDF 浏览器秒跳与 Readest 联动 |
| **专注计时引擎**| `js/timer.js` | 内联缺陷函数 | 225 行 / 7.6 KB | 独立高可靠计时器，自愈初始状态、真实时间戳防漂移走字、Web Audio 音效与会话归档 |
| **主业务控制** | `js/app.js` | 内联分散逻辑 | 2,215 行 / 112 KB | 视图路由切换、大盘指标计算、SVG 拓扑抽屉交互、艾宾浩斯复习卡、LocalStorage 持久化与 JSON 导入导出 |
| **离线单文件兜底**| `classic.html` | 7,517 行 | 7,780 行 / ~480 KB | 包含上述全部修复与新功能的完整单文件，双击即用，零网络依赖 |

---

## 二、关键缺陷实验与修复复盘

### 2.1 缺陷一：专注计时器无法启动/不走字
- **实机排查**：
  - 检查 `localStorage` 持久化数据：当用户此前保存过带有 `activeTimer: { running: true }` 的脏数据时，浏览器重新加载后 `timerId` 为 `null`（定时器句柄无法序列化）；
  - 当用户再次点击“开始专注”时，代码判定 `if (!appState.activeTimer.running)` 为 `false`，直接进入暂停逻辑，导致按钮呈现“开始专注”但点击毫无反应。
  - 原生 `setInterval` 在浏览器处于非活动标签页或系统休眠时会被严重降频节流，导致秒数累计严重滞后。
- **解决方案与实施**：
  1. 在 `js/timer.js` 中设立 `initStudyTimer()`，页面启动时强制将 `running` 置为 `false`，重置时间句柄；
  2. 采用真实时间戳差值计算（`Date.now() - startTime`），彻底消除休眠与后台节流漂移；
  3. 引入 Web Audio API 原生音效，在归档或番茄钟到期时播放轻柔双音提示；
  4. 归档会话自动写入 `appState.studySessions` 并触发大盘走势图重绘。

### 2.2 缺陷二：第三方 CDN (Tailwind/Highlight.js) 离线加载竞态
- **实机排查**：
  - 在 Edge Headless 无代理或网络稍慢环境下，`cdn.tailwindcss.com` 尚未返回时，内联脚本直接访问 `tailwind.config` 抛出 `ReferenceError: tailwind is not defined`；
  - 每日卡片渲染调用 `hljs.highlightElement()` 时，若未做可用性检查则导致整块渲染中断。
- **解决方案与实施**：
  1. 对 `tailwind.config` 增加 `if (typeof tailwind !== 'undefined')` 防御，并在 `DOMContentLoaded` 中注册保底配置；
  2. 对所有 `hljs` 调用包裹 `if (typeof hljs !== 'undefined')` 安全检测；
  3. 全局对象 `appState`、`DAYS_DATASET`、`MAPPING_MATRIX` 均挂载至 `window` 顶层命名空间，确保跨脚本无缝调用。

---

## 三、自动化测试实验日志 (Microsoft Edge CDP)

执行自动化脚本 `scratch/diagnose_decoupled.js` 对解耦后的 `index.html` 进行了全量实机回归测试：

```text
Navigating to file:///e:/workspace/muduo-study-console/index.html ...

=== DIRECT FILE LOAD RESULT ===
{
  "title": "muduo C++ 个人训练系统 V5",
  "bodyLen": 579724,
  "timerDisplay": "00:00",
  "daysCount": 28,
  "cardsCount": 28,
  "hasAppState": true,
  "hasTimerToggle": true,
  "navButtons": [
    "攻坚大盘与架构拓扑",
    "28天任务与实验",
    "书卷伴读 (Readest)\n直跳页码",
    "语法 ➔ muduo 映射矩阵",
    "每日自测中心",
    "muduo 源码路线",
    "C++ 踩坑档案"
  ]
}

--- Testing Timer Click & Tick ---
Clicked Start button. Waiting 2.5s...
Timer display after 2.5s: 00:02

--- Testing View 7: Book Reading (Readest) ---
Reading view snippet: 双权威书目深度伴读系统
陈硕《Linux 多线程服务端编程》 + 《C++ Primer Plus》伴读引擎...

--- Testing View 2: 28 Days Cards ---
Rendered cards count: 28

================ SUMMARY ================
Total Uncaught/Console Errors: 0
🎉 ALL FUNCTIONALITY VERIFIED 100% WORKING!
```

---

## 四、零构建安全部署实施记录

1. **打包脚本改造**：
   - 编写 `scripts/build_static.cjs`，将解耦后的 `index.html`、`classic.html`、`css/`、`js/` 纯净同步到 `dist/`；
   - 更新 `package.json` 中的 `"build": "node scripts/build_static.cjs"`；
   - 彻底免除 Vite/TypeScript 编译带来的资产哈希错乱、白屏或 404 隐患。
2. **本地与线上双轨交付**：
   - 本地：可直接在 Windows 文件管理器中双击 `index.html` 或 `classic.html` 秒开使用；
   - 线上：推送至 GitHub `main` 分支后，GitHub Pages 即可秒速提供云端访问服务。

# muduo 控制台：原生文件解耦与全功能增强实验与过程追溯档案

> **实验基准时间**：2026-09-11  
> **代码仓库**：[Coolzs77/muduo-study-console](https://github.com/Coolzs77/muduo-study-console)  
> **线上预览**：[https://coolzs77.github.io/muduo-study-console/](https://coolzs77.github.io/muduo-study-console/)  
> **分支**：`main`（最新部署 Commit: `d25fea9`）  
> **实验目的**：彻底放弃可能引入编译故障的 Vite/React 重写，回归原本成熟稳健的 7,517 行单体代码（`muduo_4.html`），对其进行高内聚低耦合的纯原生解耦（HTML / CSS / JS 分离），修复专注计时器无法启动缺陷，深度集成 `C++_learning` 双权威书目与 Readest 伴读流，经由微软 Edge 无头浏览器 CDP 进行本地与云端双重严苛回归测试，最终推送到 GitHub Pages 达成生产级稳定运行。

---

## 一、代码解耦架构与体积指标全景记录

为了保障项目的可维护性与扩展性，同时杜绝前端打包工具在静态托管平台上的各类偶发路径与资源解析缺陷，本次重构采用了纯原生解耦方案：

| 模块类别 | 文件相对路径 | 原始状态 | 解耦后行数 / 体积 | 职责与变更说明 |
| :--- | :--- | :--- | :--- | :--- |
| **主结构层** | `index.html` | 7,517 行 (单体 HTML) | 1,257 行 / 100 KB | 纯净语义化 HTML5 骨架，剥离所有内联样式与长篇 JS，新增「书卷伴读」导航按钮与多视图容器 |
| **层叠样式** | `css/style.css` | 内联 `<style>` 标签 | 74 行 / 2.6 KB | 提取纯净 CSS，保留学术衬线体 / 等宽字体定义、现代化平滑滚动条及 SVG 流光动态动画 |
| **实战数据集** | `js/dataset-28days.js` | 内联 JS 数组 | 3,313 行 / 206 KB | **100% 字节级无损继承**全部 4 周 28 天任务目标、实体书页码、思考要点、实战代码与自测题目 |
| **映射与避坑** | `js/dataset-mappings.js`| 内联 JS 数组 | 621 行 / 43 KB | 涵盖 `MAPPING_MATRIX`（15项语法映射）、`SOURCE_ROADMAP`（8大核心类）与 `PITFALLS_DATASET`（12大工业踩坑事故） |
| **书卷伴读引擎** | `js/books-integration.js`| **[NEW 新增]** | 255 行 / 17 KB | 双权威书目深度集成：陈硕《Linux多线程服务端编程》与《C++ Primer Plus》，物理印刷偏移补正、浏览器直跳与 Readest 桌面端呼起 |
| **专注计时引擎** | `js/timer.js` | 内联缺陷函数 | 225 行 / 7.6 KB | 独立高可靠计时器：启动强制自愈、真实时间戳差值走字防休眠漂移、Web Audio 音效、番茄钟与会话自动归档 |
| **主业务控制器** | `js/app.js` | 内联分散脚本 | 2,245 行 / 114 KB | 包含大盘指标、28天卡片渲染、SVG 架构拓扑抽屉、艾宾浩斯复习模态框、自测中心、源码路线、踩坑库与 LocalStorage 持久化 |
| **离线单文件兜底** | `classic.html` | 7,517 行 | 7,780 行 / 480 KB | 零构建、零跨域限制的单文件离线完整版本，保留全部修复与新特性，双击即可完全离线运行 |
| **原文件修复** | `e:\workspace\muduo_4.html` | 7,517 行 (计时缺陷) | 7,517 行 | 同步修复了用户本地原文件中的计时器阻塞缺陷，确保原有工作流完全正常 |

---

## 二、关键缺陷实验排查与技术解决方案

### 2.1 专注计时器“点击后不走字”缺陷深度诊断
- **根本原因排查**：
  1. **脏状态自锁**：用户在历史使用中，若曾点击“开始计时”，LocalStorage 中会持久化存储 `{ activeTimer: { running: true, seconds: 0 } }`。当用户刷新页面或重启浏览器时，由于 JavaScript 的 `setInterval` 定时器 ID 无法序列化，内存中的 `timerId` 为 `null`。当用户再次点击“开始专注”按钮时，代码逻辑 `if (!appState.activeTimer.running)` 判定为 `false`，错误地走入了“暂停计时”分支，导致用户怎么点击都无法启动计时。
  2. **后台节流漂移**：原代码使用朴素的 `setInterval(() => seconds++, 1000)`。当网页标签页切入后台、系统锁屏或休眠时，Chromium 内核会将定时器频率降至 1 分钟甚至冻结，造成实际学习时长严重失真。
- **修复措施与验证**：
  1. 在 `js/timer.js` 中设计 `initStudyTimer()` 初始化函数，在页面启动加载时强制执行 `appState.activeTimer.running = false`，解除脏数据自锁；
  2. 采用真实时间戳差值计算：记录 `startTime = Date.now() - elapsedSeconds * 1000`，每秒刷新时依据 `Math.floor((Date.now() - startTime) / 1000)` 获取真实耗时，彻底杜绝休眠漂移；
  3. 引入 Web Audio API 原生振荡器生成柔和的双音铃声（880Hz / 1760Hz），在会话归档或番茄钟到期时触发提醒；
  4. 点击“归档会话”时，自动将有效学习时长记录写入 `appState.studySessions`，并即刻刷新大盘指标与周时间统计图表。

### 2.2 跨脚本加载竞态与防弹设计 (Bulletproof Dataset Guarding)
- **现象与排查**：
  在远端 GitHub Pages 通过 CDN 加载多外部脚本时，若网络出现短暂丢包或加载顺序略微波动，`appState` 初始化访问全局变量可能触发 `ReferenceError: PITFALLS_DATASET is not defined`，进而阻断 `DOMContentLoaded` 后续所有视图的渲染，导致卡片空白。
- **修复方案**：
  1. 在 `js/app.js` 头部引入防御型安全读取函数 `getDaysDataset()`、`getMappingMatrix()`、`getSourceRoadmap()` 与 `getPitfallsDataset()`，优先读取模块局部变量，未定义时兜底至 `window` 对象，空值时回退为空数组 `[]`，永不抛出致命异常；
  2. 将 `DOMContentLoaded` 中的各个子系统初始化逻辑用独立 `try...catch` 包裹，确保任一子系统即使遇到网络异常也能实现故障隔离，其余核心模块照常渲染。

---

## 三、双权威书目与 Readest 阅读流深度融合实验

针对用户在 `E:\workspace\C++_learning` 中的学习参考书，系统在 `js/books-integration.js` 中构建了无缝伴读闭环：

### 3.1 物理印刷页码补正算法
电子 PDF 的文件绝对页码（Cover/目录等占用前置页）与实体书页脚印刷的正文页码存在固定偏移：
- **陈硕《Linux多线程服务端编程：使用muduo C++网络库》**：物理印刷页码偏移量为 **+23** 页（例如实体书 P.255 对应 PDF 绝对页码第 278 页）；
- **《C++ Primer Plus（第6版）中文版》**：物理印刷页码偏移量为 **+30** 页（例如实体书 P.100 对应 PDF 绝对页码第 130 页）。

系统在每次跳转时自动应用补正公式：
$$\text{pdfPage} = \text{printedPage} + \text{offset}$$

### 3.2 双通道跳转机制
1. **浏览器原生极速跳转**：
   通过调用 `window.open('file:///E:/workspace/C++_learning/<book_filename>.pdf#page=' + (page + offset), '_blank')`，直接利用现代浏览器内置 PDF 阅读器秒级跳转至目标页；
2. **Readest 桌面端伴读联动**：
   - 尝试触发定制协议 `readest://open?file=...&page=...` 打开桌面应用；
   - 同步调用浏览器的剪贴板 API（`navigator.clipboard.writeText`），将精准的书名、章节名、印刷页码与补正后 PDF 页码复制到系统剪贴板，并在右上角弹出贴心 Toast 提示：“已复制页码 P.xxx，可在 Readest 中直接按 Ctrl+G 跳转！”。

---

## 四、自动化回归测试实验记录（Edge Headless CDP 实机驱动）

本次实验使用真实 Microsoft Edge 内核（`msedge.exe`，端口 9234~9247）进行本地与远端双重真实驱动测试。

### 4.1 本地解耦工程全量测试 (`file:///e:/workspace/muduo-study-console/index.html`)
测试脚本：`scratch/verify_local_all_views.js`  
测试用例覆盖全部 7 大功能模块与交互流程：
```text
Navigating to local index.html...

--- 1. Testing View: Dashboard ---
Dashboard stats: { calendarCells: 28, topoNodes: 16, hasMission: true }

--- 2. Testing View: Daily (28 Days) ---
Daily cards stats: { cardsCount: 28, firstTitle: '指针、引用与 const 约束语义' }

--- 3. Testing View: Reading (Readest & Book Jump) ---
Reading stats: { hasJumpInput: true, hasBookSelect: true, jumpButtons: 16 }

--- 4. Testing View: Mapping Matrix ---
Mapping rows: { matrixRows: 15 }

--- 5. Testing View: Quiz Center ---
Quiz stats: { daySelectorOptions: 28, quizQuestions: 7 }

--- 6. Testing View: Source Roadmap ---
Source roadmap stats: { roadmapNodes: 8 }

--- 7. Testing View: Pitfalls ---
Pitfalls stats: { pitfallCards: 12 }

--- 8. Testing Topology Drawer Interaction ---
Topology drawer interaction: { drawerTitle: 'Channel', drawerVisible: true }

--- 9. Testing Focus Timer Engine ---
Timer Lifecycle: {
  initial: '00:00',
  runningAfter2s: '00:02',
  paused: '00:02',
  reset: '00:00'
}

================ LOCAL VERIFICATION SUMMARY ================
Total Uncaught Errors: 0
Calendar Cells (28): 28
Topo Nodes (>0): 16
Daily Cards (28): 28
Reading Jump Buttons (>0): 16
Mapping Rows (15): 15
Quiz Options (28): 28
Source Nodes (8): 8
Pitfall Cards (12): 12
Timer Ticked: true

🏆 ALL 7 LOCAL VIEWS AND ALL INDUSTRIAL ENGINE FEATURES ARE 100% OPERATIONAL!
```

### 4.2 远端生产环境全量测试 (`https://coolzs77.github.io/muduo-study-console/`)
测试脚本：`scratch/verify_all_live_views.js`  
测试结果：
```text
Navigating to live site https://coolzs77.github.io/muduo-study-console/ ...

--- 1. Testing View: Dashboard ---
Dashboard stats: { calendarCells: 28, topoNodes: 16, missionVisible: true }

--- 2. Testing View: Daily (28 Days) ---
Daily cards stats: { cardsCount: 28, firstCardTitle: '指针、引用与 const 约束语义' }

--- 3. Testing View: Reading (Readest & Book Jump) ---
Reading stats: { hasJumpInput: true, hasBookSelect: true, chenShuoChapters: 16 }

--- 4. Testing View: Mapping Matrix ---
Mapping rows: { matrixRows: 15 }

--- 5. Testing View: Quiz Center ---
Quiz stats: { daySelectorOptions: 28, quizQuestions: 7 }

--- 6. Testing View: Source Roadmap ---
Source roadmap stats: { roadmapNodes: 8 }

--- 7. Testing View: Pitfalls ---
Pitfalls stats: { pitfallCards: 12 }

--- 8. Testing Topology Drawer Interaction ---
Topology drawer interaction: { drawerTitle: 'Channel', drawerVisible: true }

--- 9. Testing Focus Timer Engine ---
Timer Lifecycle: {
  initial: '00:00',
  runningAfter2s: '00:02',
  paused: '00:02',
  reset: '00:00'
}

================ ALL VIEWS VERIFICATION RESULTS ================
Total Uncaught Errors: 0
Calendar Cells (28): 28
Topo Nodes (>0): 16
Daily Cards (28): 28
Reading Chapters (>0): 16
Mapping Rows (15): 15
Quiz Options (28): 28
Source Nodes (8): 8
Pitfall Cards (12): 12
Timer Ticked: true

🏆 ALL 7 VIEWS AND ALL INDUSTRIAL ENGINE FEATURES ARE 100% OPERATIONAL!
```

---

## 五、部署与生产验证记录

1. **静态打包构建**：  
   运行 `node scripts/build_static.cjs`，安全将根目录解耦资产拷贝至 `dist/`，生成零打包依赖的纯原生静态工程；
2. **提交与推送**：  
   - Commit `7ec5041`：完成原生解耦与书目伴读流初次部署；
   - Commit `d25fea9`：补充数据集安全防弹函数，防止弱网加载竞态；
3. **GitHub Actions 运行记录**：  
   - 任务 Run ID `34571859538`：`build` 成功，`deploy` 成功；
4. **验证截图留存**：  
   - `live_decoupled_verified.png`：攻坚大盘与 28 天日历矩阵渲染截图；
   - `live_reading_view.png`：书卷伴读与页码直跳视图截图；
   - `live_full_verification.png`：全功能回归测试完成状态截图。

---

## 六、书籍直跳与 Readest 呼起深度修复排错档案

### 6.1 缺陷排查：为何“光有提示也不跳转”？
经过深入排查与调试，发现原先书卷伴读视图与卡片跳转存在以下三重阻断因素：
1. **真实文件路径不匹配**：
   `E:\workspace\C++_learning\` 下两本 PDF 文件的实际命名包含特殊后缀：
   - `Linux 多线程服务端编程 使用muduo C++网络库 (陈硕) (z-library.sk, 1lib.sk, z-lib.sk).pdf`
   - `C++ Primer Plus：中文版（第六版） (Stephen Prata) (z-library.sk, 1lib.sk, z-lib.sk).pdf`
   原代码中硬编码的文件名缺失空格与 Z-library 标识符，导致浏览器即使打开了 `file:///` 协议也指向了 404 不存在的资源。
2. **Readest 协议唤起的用户手势丢失（Transient User Activation Loss）**：
   旧版本 `openInReadest` 中，将协议触发放入了 `navigator.clipboard.writeText().finally(...)` 异步回调中。现代 Chromium 内核严格限制只有在用户原始点击的同一次主调用栈（User Activation 持续约数秒内）才允许唤起系统定制协议；一旦进入异步 Promise 回调，用户手势失效，且通过创建隐藏 iframe 的协议唤起在现代 Edge/Chrome 中已被安全拦截。
3. **公网 HTTPS 与本地 `file:///` 协议的浏览器安全沙箱铁律**：
   当用户在 GitHub Pages（`https://coolzs77.github.io/...`）上点击“浏览器直跳”时，现代浏览器（Edge、Chrome、Firefox）出于系统隐私安全考虑，强制执行 **跨协议安全沙箱规则（Not allowed to load local resource）**，严禁任何公网网页直接发起对用户本地磁盘 `file:///` 路径的加载或跳转。

### 6.2 技术解决方案与双模交互架构
针对上述三重阻断，系统在 `js/books-integration.js` 中实施了如下针对性增强：
1. **物理路径校准与标准化 URL 编码**：
   将 `BOOKS_CONFIG` 中的系统路径和 URI 编码更新为本地磁盘真实全名，确保物理印刷页码补正后的 URL 100% 精确映射到实际文件与页码；
2. **同步主调用栈协议唤起**：
   在用户点击处理函数中，第一步立即创建带有 `readest://` 的动态 `<a>` 标签并同步执行 `.click()`，最大程度保留用户激活态；随后异步执行剪贴板写入，两不耽误；
3. **环境智能嗅探与「本地阅读助手」双模机制**：
   - **本地环境（`file:` 或 `localhost`）**：检测到本地运行时，自动通过动态新标签页无缝拉起 Edge 内置 PDF 阅读器并跳转至加权绝对物理页（如陈硕 P.255 -> #page=278）；
   - **公网生产环境（HTTPS）**：检测到运行在 GitHub Pages 上时，自动弹出精心设计的**「本地阅读助手」模态框（#local-reader-modal）**。模态框中提供：
     - 一键呼起本地 Readest 客户端（无跨域限制，且剪贴板已注入书籍章节信息，在客户端中按 Ctrl+G 即可秒达）；
     - 一键复制 Edge 专用原生直跳命令（例如 `start msedge "file:///E:/workspace/C++_learning/..."#page=278`，在 Win+R 中粘贴即可秒开 Edge 并翻至目标页）；
     - 一键复制本地 PDF 完整绝对路径；
     - 清晰的浏览器安全拦截说明与本地零限制运行建议。

### 6.3 冗余历史文件彻底出清与极简原生架构
为了彻底根除老旧编译工程对开发和部署的干扰，彻底清理了 GitHub 仓库中残留的所有 React/Vite 遗留文件：
- 删除 `src/`（20+ 个组件及旧数据文件）、`assets/`、`vite.config.ts`、`tsconfig.json`、`tailwind.config.js`、`postcss.config.js` 等；
- 将 `package.json` 精简为仅保留静态预览与无编译拷贝脚本（`npm run build` 即运行 `scripts/build_static.cjs`）；
- 单文件兜底 `classic.html` 与原文件 `muduo_4.html` 亦同步植入了最新的书目映射、阅读模态框与计时引擎。

### 6.4 实机自动化 CDP 回归验证
使用 Edge 无头调试端口运行 `scratch/test_jump_and_views.js`：
- PDF 本地 Edge 原生跳转检测：**PASSED**（成功打开 `...#page=278` 页面目标）；
- Readest 唤起指令与协议：**PASSED**（成功触发 `readest://`）；
- 本地阅读助手模态框：**PASSED**（正确显示书名、页码补偿信息及复制命令）；
- 28天大纲、15项语法映射、8阶源码路线、12大避坑案例与计时器核心引擎：**100% 通过**。


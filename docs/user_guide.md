# muduo C++ 个人训练系统 V5.2 详细使用方案与操作手册（解耦版 + 28天全量实战）

> **最新部署版本**：V5.2.0 (原生解耦稳定架构)  
> **生产线上预览**：[https://coolzs77.github.io/muduo-study-console/](https://coolzs77.github.io/muduo-study-console/)  
> **本地工作目录**：[e:\workspace\muduo-study-console](file:///e:/workspace/muduo-study-console)  
> **本地原著目录**：`E:\workspace\C++_learning\`  
> **Readest 桌面端**：`E:\soft\Readest\readest.exe`

---

## 一、系统快速入口与运行方式说明

为了给您提供最稳健、最灵活的学习体验，控制台现提供三种运行通道：

### 1. 本地解耦工作台（日常主力推荐）
- **访问方式**：在浏览器中直接打开 [`e:\workspace\muduo-study-console\index.html`](file:///e:/workspace/muduo-study-console/index.html)。
- **架构特点**：
  - 代码已彻底实现结构、样式、数据与逻辑分离（HTML 1,257行 / CSS 74行 / JS 模块化）；
  - 原生支持所有现代浏览器，免除任何编译、构建和 Node.js 环境依赖，秒级加载打开。

### 2. 离线单文件兜底版（出差/单文件归档备份）
- **访问方式**：双击打开 [`e:\workspace\muduo-study-console\classic.html`](file:///e:/workspace/muduo-study-console/classic.html)。
- **架构特点**：
  - 纯单文件封装（7,780行），包含全部 28 天数据、修复后的计时器、Readest 伴读流与 SVG 拓扑图，零外部相对路径依赖，不受任何浏览器本地跨域安全策略影响。
- **原文件修复**：
  - 您本地原有的 [`e:\workspace\muduo_4.html`](file:///e:/workspace/muduo_4.html) 中的计时器自锁缺陷也已同步彻底修复，您可以继续放心地单文件使用。

### 3. 线上云端实时预览（多设备同步访问）
- **访问地址**：[https://coolzs77.github.io/muduo-study-console/](https://coolzs77.github.io/muduo-study-console/)
- **同步机制**：GitHub 仓库与本地 `main` 分支完全同步，只要您在本地执行 `git push`，GitHub Actions 自动化流水线即可在 1 分钟内自动部署至全球 CDN。

---

## 二、解耦后项目文件目录架构一览

```text
e:\workspace\muduo-study-console\
├── index.html                 # 现代化语义主视图 HTML（约 1,240 行）
├── classic.html               # 完整单文件离线兜底版（约 7,500 行）
├── css/
│   └── style.css              # 纯净样式表（学术排版、平滑滚动、动态流光）
├── js/
│   ├── dataset-28days.js      # 28 天完整实战大纲、考点、实验代码与自测数据集（3,313 行）
│   ├── dataset-mappings.js    # 15 项语法-源码映射、8 阶源码大纲与 12 大避坑档案（621 行）
│   ├── timer.js               # 高可靠专注计时器、防休眠漂移算法与会话自动归档（225 行）
│   └── app.js                 # 6 大核心视图路由、大盘指标、SVG 抽屉与持久化主业务（2,230 行）
├── docs/
│   ├── experiment_trace.md    # 详尽的实验排查与无头浏览器 CDP 实机测试档案
│   ├── user_guide.md          # 本操作使用手册
│   └── test_report.md         # 综合测试与实机回归报告
├── dist/                      # 自动生成的静态生产部署包
└── scripts/
    └── build_static.cjs       # 纯净零编译打包复制脚本
```

---

## 三、核心功能操作指南

### 1. 专注学习计时器（彻底修复后用法）
- **功能位置**：页面顶部看板第三行。
- **操作步骤**：
  1. 在右侧下拉列表中选择当前攻坚的 **Day 编号**（如 Day 1）与 **攻坚类型**（代码攻坚 / 书目研读 / 排错调试）；
  2. 点击绿色 <kbd><i class="fa-solid fa-play"></i> 开始专注</kbd> 按钮，计时器立即以 `00:01`、`00:02` 开始走字，按钮自动切换为黄色“暂停专注”；
  3. 计时期间即使您最小化浏览器、切换至 IDE 编码或笔记本进入休眠，计时器均采用 `Date.now()` 真实系统绝对时间戳计算，**绝不发生时间缩水或停滞**；
  4. 攻坚完成后点击蓝色的 <kbd><i class="fa-solid fa-check"></i> 归档会话</kbd> 按钮，系统会播放柔和的双音完成提示音，将学习时长记入当天日志，并自动刷新上方“今日学习时长”与“近 7 日走势图”；
  5. 若需重新计时，随时点击灰色 <kbd><i class="fa-solid fa-rotate-left"></i> 重置</kbd> 即可恢复 `00:00`。

### 2. 现代 C++ 递进路线 ➔ muduo 架构拓扑图
- **功能位置**：主控制台（攻坚大盘）中段。
- **互动操作**：
  - 蓝图包含了：
    - **左翼**：现代 C++ 8 阶演进阶梯（const& 引用 ➔ RAII 析构 ➔ 移动语义 ➔ 智能指针 ➔ 容器 ➔ 回调 ➔ 模板）；
    - **中轴**：Reactor 事件驱动调度中枢（EventLoop、Channel、Poller、epoll 等）；
    - **右翼**：业务连接与数据实体（TcpServer、TcpConnection、Buffer 缓冲器）。
  - **点击任意节点**（如 Channel、TcpConnection、Buffer 等），右侧将平滑滑出**交互式架构抽屉**，展示该核心类的头文件路径、成员变量、核心函数调用链及其在 28 天中的重点攻坚日程。

### 4. 28 天任务大纲与实验工作台
- **功能入口**：点击顶部导航标签 <kbd><i class="fa-solid fa-calendar-check"></i> 28天任务与实验</kbd>。
- **操作指南**：
  - 支持按周筛选（全部 / W1 / W2 / W3 / W4）与状态筛选（待学 / 已攻克 / 今日待复习）；
  - 支持搜索框实时模糊过滤（如输入 `bind`、`weak_ptr`、`RAII`）；
  - 每张卡片均支持：
    - 实体书页码快速直达（带补正算法）；
    - 掌握度阶梯评级（L0 未开始 ➔ L5 源码贯通）；
    - 实验工作台代码一键复制；
    - 个人手记实时双向同步（离开焦点自动保存）；
    - 开启该 Day 对应的艾宾浩斯复习。

### 5. 每日自测中心 (Quiz Center)
- **功能入口**：顶部导航标签 <kbd><i class="fa-solid fa-clipboard-question"></i> 每日自测中心</kbd>。
- **操作指南**：
  - 在右上角下拉框中切换任意攻坚日（Day 1 ~ 28）；
  - 包含客观辨析、陷阱填空、代码改错与实现设计题；
  - 提交自测后，系统自动判定得分（≥80% 即算通过，点亮高阶掌握度星级）。

### 6. C++ 踩坑事故档案库 (Pitfalls)
- **功能入口**：顶部导航标签 <kbd><i class="fa-solid fa-bug"></i> C++ 踩坑档案</kbd>。
- **操作指南**：
  - 收录 Double Free、迭代器失效、悬空引用、智能指针循环引用等 12 大典型灾难代码；
  - 支持按事故标签（如 `shared_ptr`, `vector`, `tcache`）过滤；
  - 支持点击右上角“新增踩坑记录”将您在实际调试中遇到的坑点永久入库。

---

## 四、快捷键指南

| 快捷键 | 触发操作 | 说明 |
| :---: | :--- | :--- |
| <kbd>R</kbd> | 开启今日艾宾浩斯复习模态框 | 快速巩固到期记忆卡片 |
| <kbd>T</kbd> | 快捷切换专注计时器状态 | 开始 / 暂停专注计时 |
| <kbd>Esc</kbd> | 关闭当前打开的抽屉或弹窗 | 适用于拓扑抽屉、开发指引弹窗、自测弹窗等 |

---

## 五、数据安全与备份

系统默认将所有数据（学习打卡天数、星级、今日专注分钟数、每日自测手记、踩坑档案等）自动保存在浏览器的 `localStorage` 中。
- **导出学习档案**：滑动至网页最底部，点击 <kbd>导出学习档案.md</kbd>，可将您整个 28 天的完整学习历程导出为 Markdown 文档；
- **导出数据备份**：点击 <kbd>导出 JSON</kbd>，可备份整个系统的底层数据库；
- **跨设备迁移**：点击 <kbd>导入 JSON</kbd>，选择已备份的文件，进度秒级无缝恢复！

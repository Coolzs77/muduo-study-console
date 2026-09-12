// scripts/test_p4_suite.cjs
// Phase 4 自动化测试套件：双轨每日任务调度与任务枢纽验证
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('=== [Phase 4 Automated Test Suite: Dual-Track Daily Mission Scheduler & Task Hub] ===\n');

const projectRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(projectRoot, 'index.html');
const htmlSource = fs.readFileSync(htmlPath, 'utf8');

// 1. 验证 HTML 结构中 Phase 4 关键元素
console.log('[Test 1] 验证 index.html 中 Phase 4 DOM 容器与模态框完整性...');
const requiredDomIds = [
    'nav-tasks',
    'badge-nav-tasks',
    'task-sidebar',
    'task-sidebar-fab',
    'badge-sidebar-fab',
    'task-sidebar-backdrop',
    'view-tasks',
    'task-hub-date-str',
    'btn-mode-normal',
    'btn-mode-compact',
    'compact-mode-alert',
    'hub-stat-completed',
    'hub-stat-completed-desc',
    'hub-stat-rate',
    'hub-stat-total-mins',
    'hub-stat-hours-desc',
    'hub-stat-remain-mins',
    'hub-progress-text',
    'hub-progress-fill',
    'task-hub-list-container',
    'task-history-strip',
    'algorithm-modal',
    'algo-num',
    'algo-title',
    'algo-topic',
    'algo-time-comp',
    'algo-space-comp',
    'algo-note',
    'algo-passed',
    'books-modal',
    'book-select-key',
    'book-current-page',
    'book-today-pages',
    'book-notes',
    'add-task-modal',
    'new-task-title',
    'new-task-priority',
    'new-task-mins',
    'new-task-category',
    'new-task-desc',
    'career-modal',
    'career-notes-input'
];

requiredDomIds.forEach(id => {
    assert.ok(htmlSource.includes(`id="${id}"`), `Missing required DOM ID in index.html: #${id}`);
});
console.log(`✓ 全部 ${requiredDomIds.length} 个核心 DOM 容器、模态框及表单项在 index.html 中就绪！\n`);

// 2. 构造浏览器沙箱并依次加载运行时脚本
console.log('[Test 2] 构造拟真沙箱并顺序加载全套脚本...');
const domStore = {};
function getOrCreateElement(id) {
    if (!domStore[id]) {
        const classes = new Set();
        domStore[id] = {
            id,
            innerText: '',
            innerHTML: '',
            value: '',
            checked: true,
            style: {},
            className: '',
            classList: {
                add: (...cls) => cls.forEach(c => classes.add(c)),
                remove: (...cls) => cls.forEach(c => classes.delete(c)),
                contains: (c) => classes.has(c),
                toggle: (c) => classes.has(c) ? classes.delete(c) : classes.add(c)
            },
            scrollIntoView: () => {},
            setAttribute: () => {},
            getAttribute: () => null,
            appendChild: () => {},
            addEventListener: () => {},
            focus: () => {},
            querySelectorAll: () => [],
            querySelector: () => null
        };
    }
    return domStore[id];
}

const mockWindow = {
    location: { href: 'http://localhost:3000/' },
    addEventListener: () => {},
    document: {
        addEventListener: () => {},
        getElementById: (id) => getOrCreateElement(id),
        querySelectorAll: () => [],
        querySelector: () => null,
        createElement: (tag) => getOrCreateElement(`elem_${Date.now()}_${Math.random()}`),
        body: { appendChild: () => {}, removeChild: () => {} }
    },
    localStorage: {
        _data: {},
        getItem(k) { return this._data[k] || null; },
        setItem(k, v) { this._data[k] = String(v); },
        removeItem(k) { delete this._data[k]; }
    },
    setTimeout: (fn, ms) => { fn(); return 1; },
    clearTimeout: () => {},
    setInterval: (fn, ms) => 1,
    clearInterval: () => {},
    console: console,
    confirm: () => true,
    alert: (msg) => console.log('  [Alert]:', msg)
};
mockWindow.window = mockWindow;
mockWindow.globalThis = mockWindow;
const context = vm.createContext(mockWindow);

const scriptMatches = [...htmlSource.matchAll(/<script src="(js\/[^"?]+)/g)].map(m => m[1]);
scriptMatches.forEach(rel => {
    const absPath = path.resolve(projectRoot, rel);
    const code = fs.readFileSync(absPath, 'utf8');
    vm.runInContext(code, context);
    console.log(`  ✓ Evaluated ${rel}`);
});
console.log('✓ Test 2 Passed: 全量脚本顺利在沙箱上下文完成初始化！\n');

// 3. 验证 TaskDomain 核心定义与模版
console.log('[Test 3] 验证 TaskDomain 领域模型与模版...');
const TaskDomain = context.TaskDomain;
assert.ok(TaskDomain, 'TaskDomain should be exported on global context');
assert.ok(TaskDomain.TASK_PRIORITIES.S, 'Priority S should exist');
assert.ok(TaskDomain.TASK_PRIORITIES.A, 'Priority A should exist');
assert.ok(TaskDomain.TASK_PRIORITIES.B, 'Priority B should exist');
assert.ok(TaskDomain.TASK_PRIORITIES.C, 'Priority C should exist');
assert.strictEqual(TaskDomain.DEFAULT_ROUTINE_TEMPLATE.length, 7, 'Default template should have exactly 7 items');

const freshTasks = TaskDomain.createFreshDailyTasks();
assert.strictEqual(freshTasks.length, 7, 'createFreshDailyTasks() should create 7 tasks');
assert.strictEqual(freshTasks.every(t => t.completed === false), true, 'All fresh tasks should be incomplete');

// 验证降级与过滤
const normalTasks = TaskDomain.filterTasksByMode(freshTasks, 'normal');
const compactTasks = TaskDomain.filterTasksByMode(freshTasks, 'compact');
assert.strictEqual(normalTasks.length, 7, 'Normal mode should return all 7 tasks');
assert.strictEqual(normalTasks.every(t => !t.isSuspended), true, 'Normal mode tasks should not be suspended');

const activeCompactTasks = compactTasks.filter(t => !t.isSuspended);
const suspendedCompactTasks = compactTasks.filter(t => t.isSuspended);
assert.strictEqual(activeCompactTasks.length, 4, 'Compact mode should retain 4 active tasks (1 S + 3 A)');
assert.strictEqual(suspendedCompactTasks.length, 3, 'Compact mode should suspend 3 tasks (1 B + 2 C)');
console.log(`  - 常规模式任务: ${normalTasks.length} 个全部活跃, 紧凑模式保底活跃: ${activeCompactTasks.length} 个, 免除: ${suspendedCompactTasks.length} 个`);

// 验证进度计算
const initialProgress = TaskDomain.calculateRoutineProgress(freshTasks, 'normal');
assert.strictEqual(initialProgress.total, 7, 'Total tasks should be 7');
assert.strictEqual(initialProgress.activeTotal, 7, 'Active total tasks should be 7');
assert.strictEqual(initialProgress.completed, 0, 'Completed tasks should be 0');
assert.strictEqual(initialProgress.rate, 0, 'Completion percentage should be 0');
assert.strictEqual(initialProgress.activeMinutes, 420, 'Active minutes should sum to 420 min (7.0h)');

const compactProgress = TaskDomain.calculateRoutineProgress(freshTasks, 'compact');
assert.strictEqual(compactProgress.activeTotal, 4, 'Compact active total should be 4');
assert.strictEqual(compactProgress.activeMinutes, 330, 'Compact active minutes should sum to 330 min (5.5h)');
console.log('✓ Test 3 Passed: 领域模型与过滤、进度算法验证通过！\n');

// 4. 验证 StateManager V6 对 dailyRoutine 的持久化与数据完整性
console.log('[Test 4] 验证 StateManager 持久化 dailyRoutine 状态...');
const StateManager = context.StateManager;
const initialState = StateManager.getState();
assert.ok(initialState.dailyRoutine, 'initialState must include dailyRoutine');
assert.strictEqual(initialState.dailyRoutine.mode, 'normal', 'Default mode should be normal');
assert.strictEqual(initialState.dailyRoutine.tasks.length, 7, 'Default dailyRoutine should have 7 tasks');
assert.ok(initialState.dailyRoutine.records, 'initialState.dailyRoutine must have records object');
assert.ok(initialState.dailyRoutine.history, 'initialState.dailyRoutine must have history object');
console.log('✓ Test 4 Passed: 状态管理器加载与默认数据结构验证通过！\n');

// 5. 验证跨日自动归档与轮转 (_checkDateRollover)
console.log('[Test 5] 验证跨日自动轮转 (Date Rollover) 与历史归档机制...');
const preRolloverState = StateManager.getState();
preRolloverState.dailyRoutine.date = '2026-09-11';
preRolloverState.dailyRoutine.tasks[0].completed = true;
StateManager.save(preRolloverState);

// 触发 StateManager.init() 执行跨日检测
StateManager.init();
const postRolloverState = StateManager.getState();
const todayStr = new Date().toISOString().slice(0, 10);
assert.strictEqual(postRolloverState.dailyRoutine.date, todayStr, 'Date should be updated to today');
assert.ok(postRolloverState.dailyRoutine.history['2026-09-11'], 'History should have archived the previous day snapshot');
const archived = postRolloverState.dailyRoutine.history['2026-09-11'];
assert.strictEqual(archived.completed, 1, 'Archived completed count should match');

// 验证今日任务已被重新初始化重置
assert.strictEqual(postRolloverState.dailyRoutine.tasks[0].completed, false, 'Today tasks should be fresh and uncompleted');
console.log(`  - 跨日归档成功：已将 2026-09-11 归档至 history，当前日期更新为 ${todayStr}，今日任务已刷新重置`);
console.log('✓ Test 5 Passed!\n');

// 6. 验证计时器联动 (startTimerForTask)
console.log('[Test 6] 验证计时器与每日任务联动 (startTimerForTask)...');
assert.ok(typeof context.startTimerForTask === 'function', 'startTimerForTask should be exposed');
context.startTimerForTask('task_s_project', 'CppAIService 模块攻坚与源码研读', 'project', 180);
const linked = context.getCurrentLinkedTask();
assert.ok(linked, 'Linked task should be set');
assert.strictEqual(linked.id, 'task_s_project', 'Timer linked task id should be task_s_project');
assert.strictEqual(domStore['timer-type'].value, 'coding', 'Timer type should be mapped to coding');
console.log('✓ Test 6 Passed: 任务计时器联动正常！\n');

// 7. 验证任务主枢纽 (Task Hub) UI 渲染与交互
console.log('[Test 7] 验证 Task Hub UI 渲染与交互...');
context.switchView('tasks');
const viewTasksEl = domStore['view-tasks'];
assert.strictEqual(viewTasksEl.classList.contains('hidden'), false, '#view-tasks should be visible');

// 验证 S/A/B/C 卡片容器与指标更新
assert.ok(domStore['task-hub-list-container'].innerHTML.includes('S 级 · 项目核心攻坚'), 'S section header should be rendered');
assert.ok(domStore['task-hub-list-container'].innerHTML.includes('A 级 · 主干算法与底座'), 'A section header should be rendered');
assert.ok(domStore['task-hub-list-container'].innerHTML.includes('B 级 · 知识巩固与自测'), 'B section header should be rendered');
assert.ok(domStore['task-hub-list-container'].innerHTML.includes('C 级 · 通识拓展与就业'), 'C section header should be rendered');

context.updateDashboardMetrics();
const statComp = domStore['hub-stat-completed'];
const statRate = domStore['hub-stat-rate'];
const badgeEl = mockWindow.document.getElementById('badge-nav-tasks');
console.log(`  - 任务完成数: ${statComp.innerText}, 完成率: ${statRate.innerText}, 导航徽章: ${badgeEl.innerText}`);
assert.ok(statComp.innerText.includes('/'), 'hub-stat-completed should display completed/total');
assert.ok(statRate.innerText.includes('%'), 'hub-stat-rate should display percentage');

// 验证任务勾选完成 (toggleTaskCompleted)
context.toggleTaskCompleted('task_s_project');
const updatedComp = domStore['hub-stat-completed'];
assert.strictEqual(updatedComp.innerText.startsWith('1 /'), true, 'Should reflect 1 completed task');
console.log('  ✓ 任务状态切换 (toggleTaskCompleted) 联动卡片与全局大盘成功！');

// 验证精简模式切换 (Compact Mode: S + A Only)
context.setRoutineMode('compact');
assert.strictEqual(domStore['compact-mode-alert'].classList.contains('hidden'), false, 'compact-mode-alert should be visible');
console.log('  ✓ 切换为 compact 紧凑保底模式：B/C 任务免除，保护提示条成功展开');

// 切回常规模式
context.setRoutineMode('normal');
assert.strictEqual(domStore['compact-mode-alert'].classList.contains('hidden'), true, 'compact-mode-alert should be hidden in normal mode');
console.log('  ✓ 切换回 normal 常规模式：所有任务恢复活跃');

// 验证右侧边栏折叠收起与展开唤出 (toggleTaskSidebar)
context.toggleTaskSidebar(false);
assert.strictEqual(domStore['task-sidebar'].classList.contains('hidden'), true, 'Sidebar should be hidden when collapsed');
assert.strictEqual(domStore['task-sidebar-fab'].classList.contains('hidden'), false, 'FAB button should be visible when collapsed');
console.log('  ✓ 侧边栏折叠验证：#task-sidebar 成功隐藏，右侧悬浮胶囊 #task-sidebar-fab 唤出');

context.toggleTaskSidebar(true);
assert.strictEqual(domStore['task-sidebar'].classList.contains('hidden'), false, 'Sidebar should be visible when expanded');
assert.strictEqual(domStore['task-sidebar-fab'].classList.contains('hidden'), true, 'FAB button should be hidden when expanded');
console.log('  ✓ 侧边栏展开验证：#task-sidebar 成功恢复，悬浮胶囊隐藏');
console.log('✓ Test 7 Passed!\n');

// 8. 验证算法、书本、求职与自定义任务弹窗操作
console.log('[Test 8] 验证 4 大模态框表单录入与业务联动...');

// (1) 算法手撕录入
getOrCreateElement('algo-num').value = '146';
getOrCreateElement('algo-title').value = 'LRU 缓存';
getOrCreateElement('algo-topic').value = '哈希表';
getOrCreateElement('algo-time-comp').value = 'O(1)';
getOrCreateElement('algo-space-comp').value = 'O(capacity)';
getOrCreateElement('algo-note').value = 'unordered_map + std::list 双向链表实现';
getOrCreateElement('algo-passed').checked = true;
context.saveAlgorithmProblem();

const appState = context.appState;
assert.ok(appState.dailyRoutine.records.algorithm.length >= 1, 'Algorithm record should be saved');
assert.strictEqual(appState.dailyRoutine.records.algorithm[0].title, 'LRU 缓存', 'Saved algorithm title must match');
console.log('  ✓ 算法手撕题记录录入与持久化成功');

// (2) 书目研读进度录入
getOrCreateElement('book-select-key').value = 'linuxServer';
getOrCreateElement('book-current-page').value = '45';
getOrCreateElement('book-today-pages').value = '10';
getOrCreateElement('book-notes').value = '深入理解 Reactor 事件驱动与 Buffer 线程安全';
context.saveBooksProgress();
assert.ok(appState.dailyRoutine.records.books.linuxServer, 'linuxServer reading record should exist');
assert.strictEqual(appState.dailyRoutine.records.books.linuxServer.currentPage, 55, 'Current page should advance to 55');
const linuxTask = appState.dailyRoutine.tasks.find(t => t.id === 'task_a_linux_book');
assert.strictEqual(linuxTask.completed, true, 'Linux server book task should auto-complete');
console.log('  ✓ 书目阅读进度录入与任务自动勾选成功 (P.55)');

// (3) 牛客求职调研手记
getOrCreateElement('career-notes-input').value = '跟踪 2026 届秋招 C++ 后端岗位 hc 动态及高频场景题';
context.saveCareerNotes();
assert.strictEqual(appState.dailyRoutine.records.careerNotes, '跟踪 2026 届秋招 C++ 后端岗位 hc 动态及高频场景题');
const careerTask = appState.dailyRoutine.tasks.find(t => t.id === 'task_c_career');
assert.strictEqual(careerTask.completed, true, 'Career task should auto-complete after note saved');
console.log('  ✓ 求职调研手记保存与任务自动勾选成功');

// (4) 新建自定义任务与删除
getOrCreateElement('new-task-title').value = '梳理 HTTP 路由通配符解析';
getOrCreateElement('new-task-priority').value = 'B';
getOrCreateElement('new-task-mins').value = '40';
getOrCreateElement('new-task-category').value = 'project';
getOrCreateElement('new-task-desc').value = '编写 std::regex 正则捕获单元测试';
context.saveCustomTask();

const addedCustomTask = appState.dailyRoutine.tasks.find(t => t.title === '梳理 HTTP 路由通配符解析');
assert.ok(addedCustomTask, 'Custom task should be added to dailyRoutine.tasks');
assert.strictEqual(addedCustomTask.priority, 'B');
assert.strictEqual(addedCustomTask.estimatedMinutes, 40);

// 删除自定义任务
context.deleteCustomTask(addedCustomTask.id);
assert.ok(!appState.dailyRoutine.tasks.some(t => t.id === addedCustomTask.id), 'Custom task should be deleted');
console.log('  ✓ 自定义任务新增与删除闭环验证通过');
console.log('✓ Test 8 Passed!\n');

// 9. 验证数据导出与导入对 dailyRoutine 的完整性
console.log('[Test 9] 验证 JSON 导入导出中的 dailyRoutine 完整性...');
const exportedObj = StateManager.exportJson();
const exportedJsonStr = JSON.stringify(exportedObj);
const parsedExport = JSON.parse(exportedJsonStr);
assert.ok(parsedExport.payload.dailyRoutine, 'Exported JSON must contain payload.dailyRoutine');
assert.ok(parsedExport.payload.dailyRoutine.records, 'Exported JSON must contain records');
assert.ok(parsedExport.payload.dailyRoutine.records.books.linuxServer, 'Exported books record should be preserved');

// 模拟导入覆盖
const importedState = StateManager.importJson(exportedJsonStr, 'overwrite');
assert.ok(importedState, 'Import overwrite should return updated state');
const reloadedState = StateManager.getState();
assert.strictEqual(reloadedState.dailyRoutine.records.books.linuxServer.currentPage, 55, 'Reloaded book page should match 55');
console.log('✓ Test 9 Passed: 导入导出与版本兼容无缝验证通过！\n');

console.log('======================================================================');
console.log('🎉 PHASE 4 全部自动化测试验收通过！双轨统一任务调度系统运行正常！');
console.log('======================================================================');

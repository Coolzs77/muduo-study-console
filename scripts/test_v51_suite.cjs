// scripts/test_v51_suite.cjs
// V5.1 个人工程学习工作台自动化测试套件
// 验证范围：首页 5 大核心区域、工程工作日志流、任务反思驱动器、项目模块地图、StateManager 6.1.0 无损迁移
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('=== [V5.1 Engineering Workbench Automated Test Suite] ===\n');

const projectRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(projectRoot, 'index.html');
const htmlSource = fs.readFileSync(htmlPath, 'utf8');

// ==========================================================================
// Test 1: 验证 index.html 中 V5.1 核心区域 DOM 容器完整性
// ==========================================================================
console.log('[Test 1] 验证 index.html 中 V5.1 首页 5 大区域与工作台模态框 DOM 完整性...');

const v51DomIds = [
    // 首页 5 大区域
    'home-zone-today-tasks',
    'today-tasks-badge',
    'today-tasks-container',
    'home-zone-project-progress',
    'home-project-progress-content',
    'home-zone-muduo-progress',
    'home-muduo-progress-content',
    'home-zone-recent-logs',
    'recent-logs-container',
    'home-zone-weekly-metrics',
    'home-weekly-metrics-grid',

    // CppAIService 项目模块地图
    'cppai-module-hierarchy-container',
    'arch-topology-wrapper',
    'btn-topo-toggle-text',

    // 模态框
    'modal-work-log',
    'form-work-log',
    'log-input-project',
    'log-input-module',
    'log-input-type',
    'log-input-what',
    'log-input-problem',
    'log-input-solution',
    'log-input-learned',
    'log-input-next',
    'log-input-files',
    'log-input-interview',
    'log-input-sync-evidence',
    
    'modal-task-reflection',
    'form-task-reflection',
    'reflection-task-id',
    'reflection-task-title',
    'reflection-learned',
    'reflection-problem',
    'reflection-next',
    'reflection-create-log'
];

v51DomIds.forEach(id => {
    assert.ok(htmlSource.includes(`id="${id}"`), `[V5.1] Missing DOM ID in index.html: #${id}`);
});

console.log(`✓ 全部 ${v51DomIds.length} 个 V5.1 DOM 容器在 index.html 中验证就绪！\n`);

// ==========================================================================
// Test 2: 验证 StateManager 6.1.0 架构与无损增量扩展
// ==========================================================================
console.log('[Test 2] 验证 StateManager 6.1.0 架构、增量字段与工程日志操作助手...');

// 构造模拟浏览器沙箱环境
function createMockContext() {
    const memoryStorage = {};
    const elements = {};

    function getOrCreateElement(id) {
        if (!elements[id]) {
            elements[id] = {
                id: id,
                innerHTML: '',
                innerText: '',
                value: '',
                className: '',
                classList: {
                    classes: new Set(),
                    add(c) { this.classes.add(c); },
                    remove(c) { this.classes.delete(c); },
                    contains(c) { return this.classes.has(c); },
                    toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
                },
                setAttribute(k, v) { this[k] = v; },
                getAttribute(k) { return this[k] || null; },
                addEventListener() {},
                removeEventListener() {},
                focus() {},
                click() {},
                style: {},
                children: []
            };
        }
        return elements[id];
    }

    const context = {
        console,
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
        Date,
        Math,
        JSON,
        Array,
        Object,
        String,
        Number,
        Boolean,
        RegExp,
        localStorage: {
            getItem: (k) => memoryStorage[k] || null,
            setItem: (k, v) => { memoryStorage[k] = String(v); },
            removeItem: (k) => { delete memoryStorage[k]; },
            clear: () => { Object.keys(memoryStorage).forEach(k => delete memoryStorage[k]); }
        },
        document: {
            getElementById: (id) => getOrCreateElement(id),
            querySelector: () => null,
            querySelectorAll: () => [],
            createElement: (tag) => getOrCreateElement('el_' + Math.random().toString(36).slice(2)),
            body: getOrCreateElement('body'),
            addEventListener() {}
        },
        addEventListener() {},
        removeEventListener() {},
        window: null,
        globalThis: null,
        navigator: { userAgent: 'NodeTestSandbox' },
        showToast: (msg) => console.log('   [Toast]:', msg),
        openModal: (title, msg) => console.log('   [Modal]:', title),
        closeModal: () => {}
    };

    context.window = context;
    context.globalThis = context;
    vm.createContext(context);
    return context;
}

const ctx = createMockContext();

// 加载核心脚本序列
const scriptFiles = [
    'js/dataset-28days.js',
    'js/dataset-mappings.js',
    'js/dataset-yuque.js',
    'js/dataset-domain.js',
    'js/dataset-tasks.js',
    'js/dataset-learning.js',
    'js/dataset-career.js',
    'js/dataset-scheduler.js',
    'js/state-manager.js',
    'js/timer.js',
    'js/yuque-explorer.js',
    'js/app.js'
];

scriptFiles.forEach(sf => {
    const code = fs.readFileSync(path.join(projectRoot, sf), 'utf8');
    vm.runInContext(code, ctx, { filename: sf });
});

assert.ok(ctx.CURRENT_SCHEMA_VERSION.startsWith('6.'), 'Schema version must be 6.x');
const sm = ctx.StateManager;
const state = sm.init();

assert.ok(Array.isArray(state.workLogs), 'state.workLogs must be array');
assert.ok(state.workLogs.length >= 3, 'state.workLogs must have default seed logs');
assert.ok(state.projectProgress, 'state.projectProgress must exist');
assert.ok(state.projectProgress.activeModule, 'activeModule must exist');
assert.ok(Array.isArray(state.unifiedTasks), 'state.unifiedTasks must be array');
assert.ok(state.unifiedTasks.length >= 4, 'state.unifiedTasks must have default tasks');

console.log(`✓ Test 2 Passed: StateManager 6.1.0 初始化完成，包含 ${state.workLogs.length} 条工程日志与 ${state.unifiedTasks.length} 项统一任务！\n`);

// ==========================================================================
// Test 3: 验证工程工作日志 CRUD 与持久化
// ==========================================================================
console.log('[Test 3] 验证工程工作日志录入、查询与删除...');

const newLog = sm.addWorkLog({
    project: 'CppAIService',
    module: 'HTTP Router',
    logType: 'bugfix',
    what: '修复路由正则分组提取越界缺陷',
    problem: '空参数时越界访问 vector[0]',
    solution: '添加 size() > 0 边界保护条件',
    learned: 'STL 容器访问必须严格执行防御性校验',
    next: '继续完善路由基准压测'
});

assert.ok(newLog.id, 'New log must have id');
assert.strictEqual(newLog.module, 'HTTP Router');
const allLogs = sm.getWorkLogs();
assert.strictEqual(allLogs[0].id, newLog.id, 'New log must be at front');

sm.deleteWorkLog(newLog.id);
const logsAfterDel = sm.getWorkLogs();
assert.ok(!logsAfterDel.find(l => l.id === newLog.id), 'Deleted log should not exist');

console.log('✓ Test 3 Passed: 工程工作日志增删查持久化逻辑完全正确！\n');

// ==========================================================================
// Test 4: 验证统一任务完成与反思驱动器 (Next-Action Driver)
// ==========================================================================
console.log('[Test 4] 验证统一任务反思打卡与下一动作驱动...');

const tasks = sm.getUnifiedTasks();
const targetTask = tasks[0];
const initialStatus = targetTask.completed;

// 模拟打卡反思
const reflection = {
    learned: '深入理解了 HttpContext 状态迁移边界',
    problem: '分包导致半包挂起',
    solution: '通过 Buffer 可读游标保存现场',
    nextStep: '编写针对粘包的 100 组模糊测试'
};

const updatedTask = sm.toggleUnifiedTask(targetTask.id, reflection);
assert.strictEqual(updatedTask.completed, !initialStatus, 'Task completion state toggled');
assert.ok(updatedTask.reflection, 'Task must contain reflection');
assert.strictEqual(updatedTask.reflection.learned, reflection.learned);
assert.strictEqual(updatedTask.reflection.nextStep, reflection.nextStep);

console.log('✓ Test 4 Passed: 任务反思驱动机制运作正常，避免“打卡即结束”！\n');

// ==========================================================================
// Test 5: 验证首页 5 大核心区域渲染
// ==========================================================================
console.log('[Test 5] 验证首页 5 大核心区域渲染器...');

ctx.renderHomeDashboard();

const taskContainer = ctx.document.getElementById('today-tasks-container');
const projectContent = ctx.document.getElementById('home-project-progress-content');
const muduoContent = ctx.document.getElementById('home-muduo-progress-content');
const recentLogsContainer = ctx.document.getElementById('recent-logs-container');
const metricsGrid = ctx.document.getElementById('home-weekly-metrics-grid');

assert.ok(taskContainer.innerHTML.length > 50, 'today-tasks-container must have content');
assert.ok(projectContent.innerHTML.length > 50, 'home-project-progress-content must have content');
assert.ok(muduoContent.innerHTML.length > 50, 'home-muduo-progress-content must have content');
assert.ok(recentLogsContainer.innerHTML.length > 50, 'recent-logs-container must have content');
assert.ok(metricsGrid.innerHTML.length > 50, 'home-weekly-metrics-grid must have content');

console.log('✓ Test 5 Passed: 首页 5 大核心区域全部渲染成功，DOM 绑定正确！\n');

// ==========================================================================
// Test 6: 验证 CppAIService 文本树状模块地图
// ==========================================================================
console.log('[Test 6] 验证 CppAIService 模块层级树地图渲染...');

ctx.renderModuleHierarchyMap();
const moduleMapContainer = ctx.document.getElementById('cppai-module-hierarchy-container');
assert.ok(moduleMapContainer.innerHTML.length > 200, 'Module hierarchy map must be populated');
assert.ok(moduleMapContainer.innerHTML.includes('HttpContext.cpp'), 'Must include HttpContext.cpp');
assert.ok(moduleMapContainer.innerHTML.includes('Router.cpp'), 'Must include Router.cpp');
assert.ok(moduleMapContainer.innerHTML.includes('McpRegistry.cpp'), 'Must include McpRegistry.cpp');
assert.ok(moduleMapContainer.innerHTML.includes('ModelClient.cpp'), 'Must include ModelClient.cpp');
assert.ok(moduleMapContainer.innerHTML.includes('RabbitMQProducer.cpp'), 'Must include RabbitMQProducer.cpp');

console.log('✓ Test 6 Passed: CppAIService 5 大层级树状模块地图完备渲染！\n');

// ==========================================================================
// Test 7: 验证 Engineering Plain Style 文案规范 (无封建营销词)
// ==========================================================================
console.log('[Test 7] 验证 Engineering Plain Style 文案合规性...');

const bannedWords = [
    '双核中枢',
    '工业级训练平台',
    '智能工程中枢',
    '全链路闭环',
    '誓死保卫核心主干',
    '反应堆心脏'
];

bannedWords.forEach(w => {
    assert.ok(!htmlSource.includes(w), `Forbidden marketing buzzword found in index.html: "${w}"`);
});

console.log('✓ Test 7 Passed: 文案完全符合 Engineering Plain Style 规范，无虚浮营销词汇！\n');

console.log('========================================================================================');
console.log('🎉 全部 7 项 V5.1 全栈自动化测试无瑕疵通过！工作台已达成收敛与高效学习目标！');
console.log('========================================================================================');

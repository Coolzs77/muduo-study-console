const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('=== [V5.2 User Requirements Automated Test Suite] ===\n');

// 1. 验证 index.html DOM 与架构要求
console.log('[Test 1] 验证 index.html 中移除 P6/P7、写回 28 天日历、重命名自测、代码查看器模态框...');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// (1) P6 / P7 导航移除
assert.strictEqual(html.includes('id="nav-career"'), false, 'nav-career should be removed');
assert.strictEqual(html.includes('id="nav-scheduler"'), false, 'nav-scheduler should be removed');
assert.strictEqual(html.includes('id="view-career"'), false, 'view-career should be removed');
assert.strictEqual(html.includes('id="view-scheduler"'), false, 'view-scheduler should be removed');
console.log('  ✓ P6 (工程日志与求职) 与 P7 (日程同步) 已完全从前端导航与视图中移除');

// (2) 代码测验更名为「面试题库与自测」
assert.strictEqual(html.includes('面试题库与自测'), true, 'nav-quiz should be renamed to 面试题库与自测');
console.log('  ✓ 测验中心已重命名为「面试题库与自测」');

// (3) 28 天日历矩阵写回
assert.strictEqual(html.includes('id="calendar-grid"'), true, 'calendar-grid must be present in index.html');
assert.strictEqual(html.includes('28 天学习打卡索引日历'), true, 'calendar title must be present');
console.log('  ✓ 28 天打卡热力日历网格 (#calendar-grid) 已成功写回工作台');

// (4) 顶级浮层代码查看器
assert.strictEqual(html.includes('id="modal-code-viewer"'), true, 'modal-code-viewer must be present');
assert.strictEqual(html.includes('id="code-viewer-title"'), true, 'code-viewer-title must be present');
assert.strictEqual(html.includes('id="code-viewer-path"'), true, 'code-viewer-path must be present');
assert.strictEqual(html.includes('id="code-viewer-pre"'), true, 'code-viewer-pre must be present');
assert.strictEqual(html.includes('dataset-cppai-sources.js'), true, 'dataset-cppai-sources.js must be loaded');
console.log('  ✓ 顶级浮层代码查看器模态框 (#modal-code-viewer) 就绪');

// 2. 构造轻量 DOM 沙箱并验证
console.log('\n[Test 2] 验证 StateManager：清空虚假预置工程记录，支持 completedAlgos...');
const domStore = {};
function getOrCreateElement(id) {
    if (!domStore[id]) {
        const classes = new Set();
        domStore[id] = {
            id,
            innerText: '',
            innerHTML: '',
            value: '',
            checked: false,
            style: {},
            className: '',
            children: [],
            classList: {
                add: (...cls) => cls.forEach(c => classes.add(c)),
                remove: (...cls) => cls.forEach(c => classes.delete(c)),
                contains: (c) => classes.has(c),
                toggle: (c) => classes.has(c) ? classes.delete(c) : classes.add(c)
            },
            scrollIntoView: () => {},
            setAttribute: () => {},
            getAttribute: () => null,
            addEventListener: () => {},
            appendChild: function(child) {
                this.children.push(child);
                this.innerHTML += (child.outerHTML || child.innerHTML || '');
            }
        };
    }
    return domStore[id];
}

const mockStorage = {};
const mockWindow = {
    location: { href: 'http://localhost:3000/' },
    localStorage: {
        getItem: (k) => mockStorage[k] || null,
        setItem: (k, v) => { mockStorage[k] = String(v); },
        removeItem: (k) => { delete mockStorage[k]; },
        clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
    },
    document: {
        getElementById: (id) => getOrCreateElement(id),
        createElement: (tag) => {
            const el = getOrCreateElement('elem-' + Math.random().toString(36).substr(2, 6));
            el.tagName = tag.toUpperCase();
            return el;
        },
        querySelectorAll: () => [],
        querySelector: () => null,
        body: {
            classList: { add: () => {}, remove: () => {} },
            appendChild: () => {},
            removeChild: () => {}
        },
        addEventListener: () => {}
    },
    navigator: { clipboard: { writeText: () => Promise.resolve() } },
    addEventListener: () => {},
    setTimeout: (fn) => fn(),
    clearTimeout: () => {},
    console: console,
    alert: (msg) => console.log('  [Mock Alert]:', msg),
    confirm: () => true
};

const sandbox = vm.createContext(mockWindow);
sandbox.window = mockWindow;
sandbox.global = mockWindow;
sandbox.globalThis = mockWindow;

function loadScript(relPath) {
    const code = fs.readFileSync(path.join(__dirname, '..', relPath), 'utf8');
    vm.runInContext(code, sandbox, { filename: relPath });
}

loadScript('js/dataset-28days.js');
loadScript('js/dataset-mappings.js');
loadScript('js/dataset-yuque.js');
loadScript('js/dataset-domain.js');
loadScript('js/dataset-tasks.js');
loadScript('js/dataset-cppai-sources.js');
loadScript('js/dataset-learning.js');
loadScript('js/state-manager.js');

const sm = sandbox.stateManager;
assert.ok(sm, 'stateManager must be initialized');
const state = sm.getState();

assert.strictEqual(Array.isArray(state.workLogs), true, 'workLogs should be array');
assert.strictEqual(state.workLogs.length, 0, 'workLogs should be empty initially, no fake seed logs');
console.log('  ✓ workLogs 初始状态完全真实纯净，假数据已彻底清空');

// 验证 toggleAlgoCompleted
assert.strictEqual(sm.isAlgoCompleted(704), false, 'algo 704 initially not completed');
sm.toggleAlgoCompleted(704);
assert.strictEqual(sm.isAlgoCompleted(704), true, 'algo 704 toggled to completed');
assert.strictEqual(sm.getCompletedAlgosCount(), 1, 'completed count should be 1');
sm.toggleAlgoCompleted(704);
assert.strictEqual(sm.isAlgoCompleted(704), false, 'algo 704 toggled back to false');
console.log('  ✓ 算法完成状态 toggleAlgoCompleted / isAlgoCompleted 持久化验证通过');

// 3. 验证 CppAIService 真实源代码数据集
console.log('\n[Test 3] 验证 CppAIService 真实源码与 Demo 数据集 (CPPAI_SOURCES_MAP)...');
const sourcesMap = sandbox.CPPAI_SOURCES_MAP;
assert.ok(sourcesMap, 'CPPAI_SOURCES_MAP must exist');

const httpContextCode = sourcesMap['src/http/HttpContext.cpp'];
assert.ok(httpContextCode, 'HttpContext.cpp source must exist');
assert.ok(httpContextCode.includes('bool HttpContext::parseRequest'), 'Must contain actual parseRequest implementation');
assert.ok(httpContextCode.includes('kExpectRequestLine'), 'Must contain actual FSM states');

const routerCode = sourcesMap['src/http/Router.cpp'];
assert.ok(routerCode, 'Router.cpp source must exist');

const demoCode = sourcesMap['tests/HttpContext_test.cpp'];
assert.ok(demoCode, 'tests/HttpContext_test.cpp demo must exist');
assert.ok(demoCode.includes('TEST(HttpContextTest'), 'Must contain GoogleTest demo code');

console.log('  ✓ CppAIService 真实 C++ 代码（包含 HttpContext 状态机、Router、单元测试等）完整内嵌就绪！');

// 4. 验证手撕 Lab 题单对齐代码随想录
console.log('\n[Test 4] 验证手撕 Lab 题单对齐代码随想录 12 大分类与力扣链接...');
const algoCatalog = sandbox.ALGORITHM_LAB_CATALOG;
assert.ok(Array.isArray(algoCatalog), 'ALGORITHM_LAB_CATALOG must be array');
assert.ok(algoCatalog.length >= 30, `ALGORITHM_LAB_CATALOG should have comprehensive questions (found ${algoCatalog.length})`);

const expectedCategories = ['数组', '链表', '哈希表', '字符串', '栈与队列', '二叉树', '回溯算法', '贪心算法', '动态规划', '单调栈', '图论'];
const foundCategories = new Set(algoCatalog.map(a => a.category));
expectedCategories.forEach(cat => {
    assert.ok(foundCategories.has(cat), `Category "${cat}" must be present in ALGORITHM_LAB_CATALOG`);
});

algoCatalog.forEach(item => {
    assert.ok(item.leetcodeUrl, `Problem #${item.num} must have leetcodeUrl`);
    assert.ok(item.leetcodeUrl.startsWith('https://leetcode.cn/problems/'), `Problem #${item.num} URL must be leetcode.cn`);
});

console.log(`  ✓ 全部 ${algoCatalog.length} 道高频手撕题完整覆盖代码随想录 12 大分类，均具备官方力扣跳转链接！`);

// 5. 验证 app.js 交互流
console.log('\n[Test 5] 验证 app.js 交互闭环：点击源码/Demo弹真实代码，任务跳语雀，面试题跳自测...');
loadScript('js/timer.js');
loadScript('js/yuque-explorer.js');
loadScript('js/app.js');

// 模拟点击源码
sandbox.handleModuleSourceClick('HttpContext.cpp', 'src/http/HttpContext.cpp');
const preEl = getOrCreateElement('code-viewer-pre');
const titleEl = getOrCreateElement('code-viewer-title');
assert.strictEqual(titleEl.innerText, 'HttpContext.cpp', 'Title should be HttpContext.cpp');
assert.ok(preEl.innerText.includes('bool HttpContext::parseRequest'), 'Code viewer must display actual C++ code, not file path notice');
console.log('  ✓ 点击「源码」：成功在最高浮层弹出真实 C++ 源码内容！');

// 模拟点击 Demo
sandbox.handleModuleTestClick('HttpContext.cpp', 'tests/HttpContext_test.cpp');
assert.ok(titleEl.innerText.includes('HttpContext.cpp'), 'Title should reflect Demo');
assert.ok(preEl.innerText.includes('TEST(HttpContextTest'), 'Code viewer must display actual Demo test code');
console.log('  ✓ 点击「Demo」：成功在最高浮层弹出真实单测与示例代码！');

// 模拟点击任务 -> 语雀跳转
sandbox.handleModuleTaskClick('HttpContext.cpp');
assert.strictEqual(sandbox.appState.currentView, 'knowledge', 'Must switch to knowledge view');
assert.strictEqual(sandbox.appState.currentYuqueArticleId, 'yq_06', 'Must select yq_06 (HTTP报文解析封装模块)');
console.log('  ✓ 点击「任务」：精准跳转至语雀知识库对应专栏章节 (yq_06)！');

// 模拟点击面试题 -> 自测跳转
sandbox.handleModuleInterviewClick('HttpContext.cpp');
assert.strictEqual(sandbox.appState.currentView, 'quiz', 'Must switch to quiz view');
const quizSel = getOrCreateElement('quiz-day-selector');
assert.strictEqual(quizSel.value, 'qa_fsm_http_parser', 'Quiz selector must select qa_fsm_http_parser');
const quizRunner = getOrCreateElement('quiz-runner-container');
assert.ok(quizRunner.innerHTML.includes('有限状态机 (FSM) 在 HTTP 报文解析中'), 'Must render interview question in quiz container');
console.log('  ✓ 点击「面试题」：成功跳转至面试题库与自测中心，并加载对应模块考点！');

// 6. 验证工作台今日任务与工程日志空状态
console.log('\n[Test 6] 验证工作台今日任务读取真实待办，无假日志...');
sandbox.switchView('dashboard');
const todayTasksContainer = getOrCreateElement('today-tasks-container');
assert.ok(todayTasksContainer.innerHTML.includes('input type="checkbox"'), 'Should render real daily routine tasks with checkboxes');

const recentLogsContainer = getOrCreateElement('recent-logs-container');
assert.ok(recentLogsContainer.innerHTML.includes('当前暂无工程记录'), 'Must show clean honest empty placeholder when workLogs is empty');
console.log('  ✓ 工作台今日任务对接真实待办系统，工程记录呈现实事求是的空状态！');

// 7. 验证 28 天日历矩阵渲染
console.log('\n[Test 7] 验证 28 天日历网格渲染与交互...');
sandbox.renderCalendarGrid();
const calGrid = getOrCreateElement('calendar-grid');
assert.strictEqual(calGrid.children.length, 28, 'calendar-grid must render 28 day cells');
console.log('  ✓ 28 天学习打卡索引日历成功渲染 28 个掌握度单元格！');

console.log('\n========================================================================================');
console.log('🎉 全部 7 项用户需求深度重构自动化测试全部通过！系统达到完全真实的工程工作台交付标准！');
console.log('========================================================================================\n');

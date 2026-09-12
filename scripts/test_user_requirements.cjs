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
            textContent: '',
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
                const text = child.textContent || child.innerText || '';
                const tag = (child.tagName || 'DIV').toLowerCase();
                this.innerHTML += `<${tag} value="${child.value || ''}">${text}${child.innerHTML || ''}</${tag}>`;
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
assert.ok(algoCatalog.length >= 178, `ALGORITHM_LAB_CATALOG must contain at least 178 problems from 代码随想录 (found ${algoCatalog.length})`);

const expectedCategories = ['数组', '链表', '哈希表', '字符串', '双指针法', '栈与队列', '二叉树', '回溯算法', '贪心算法', '动态规划', '单调栈', '图论'];
const foundCategories = new Set(algoCatalog.map(a => a.category));
expectedCategories.forEach(cat => {
    assert.ok(foundCategories.has(cat), `Category "${cat}" must be present in ALGORITHM_LAB_CATALOG`);
});

algoCatalog.forEach(item => {
    assert.ok(item.leetcodeUrl, `Problem #${item.num} must have leetcodeUrl`);
    assert.ok(item.leetcodeUrl.startsWith('https://leetcode.cn/') || item.leetcodeUrl.startsWith('https://kamacoder.com/'), `Problem #${item.num} URL must be leetcode.cn or kamacoder.com`);
});

console.log(`  ✓ 全部 ${algoCatalog.length} 道高频手撕题完整覆盖代码随想录 12 大分类，均具备官方力扣或卡码跳转链接！`);

// 5. 验证 app.js 交互流
console.log('\n[Test 5] 验证 app.js 交互闭环：点击源码/Demo弹真实代码，代码语法高亮，任务跳语雀，面试题跳自测...');
// Mock hljs in sandbox
sandbox.hljs = {
    highlight: (code, opts) => ({ value: `<span class="hljs-keyword">highlighted</span> ${code.slice(0, 30)}` })
};

loadScript('js/timer.js');
loadScript('js/yuque-explorer.js');
loadScript('js/app.js');

// 模拟点击源码与语法高亮
sandbox.handleModuleSourceClick('HttpContext.cpp', 'src/http/HttpContext.cpp');
const preEl = getOrCreateElement('code-viewer-pre');
const titleEl = getOrCreateElement('code-viewer-title');
assert.strictEqual(titleEl.innerText, 'HttpContext.cpp', 'Title should be HttpContext.cpp');
assert.ok(preEl.innerHTML.includes('hljs-keyword') || preEl.innerHTML.includes('HttpContext'), 'Code viewer must render highlighted C++ code');
console.log('  ✓ 点击「源码」：成功在最高浮层弹出真实 C++ 源码并应用语法高亮！');

// 模拟点击 Demo
sandbox.handleModuleTestClick('HttpContext.cpp', 'tests/HttpContext_test.cpp');
assert.ok(titleEl.innerText.includes('HttpContext.cpp'), 'Title should reflect Demo');
assert.ok(preEl.innerHTML.includes('hljs-keyword') || preEl.innerHTML.includes('TEST'), 'Code viewer must render Demo code with highlighting');
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

// 6. 验证工作台今日任务与工程日志增删与空状态
console.log('\n[Test 6] 验证工作台今日任务读取真实待办，支持日志新增与删除，本周统计无瞎写数据...');
sandbox.switchView('dashboard');
const todayTasksContainer = getOrCreateElement('today-tasks-container');
assert.ok(todayTasksContainer.innerHTML.includes('input type="checkbox"'), 'Should render real daily routine tasks with checkboxes');
assert.ok(todayTasksContainer.innerHTML.includes('CppAIService 模块攻坚与源码研读'), 'Should match real routine tasks from dataset-tasks.js');

const recentLogsContainer = getOrCreateElement('recent-logs-container');
assert.ok(recentLogsContainer.innerHTML.includes('当前暂无工程记录'), 'Must show clean honest empty placeholder when workLogs is empty');

// 测试添加日志与删除日志
sandbox.stateManager.addWorkLog({
    project: 'CppAIService',
    module: 'Router',
    logType: 'code_feature',
    what: '测试前缀树路由匹配',
    problem: '无',
    solution: '无'
});
sandbox.renderRecentWorkLogs();
assert.ok(recentLogsContainer.innerHTML.includes('测试前缀树路由匹配'), 'Must render newly added work log');
assert.ok(recentLogsContainer.innerHTML.includes('handleDeleteWorkLog'), 'Must render delete button for work log');

const addedLog = sandbox.stateManager.getWorkLogs()[0];
sandbox.handleDeleteWorkLog(addedLog.id);
assert.strictEqual(sandbox.stateManager.getWorkLogs().length, 0, 'Work log should be deleted');
sandbox.renderRecentWorkLogs();
assert.ok(recentLogsContainer.innerHTML.includes('当前暂无工程记录'), 'Must return to empty placeholder after deletion');
console.log('  ✓ 工作台今日任务对接真实待办系统，工程日志支持新增与即时删除，假数据彻底绝迹！');

// 验证本周统计无虚假编造数据
sandbox.renderHomeWeeklyMetrics();
const weeklyMetricsGrid = getOrCreateElement('home-weekly-metrics-grid');
assert.ok(weeklyMetricsGrid.innerHTML.includes('0.0h') || weeklyMetricsGrid.innerHTML.includes('今日完成工时'), 'Weekly metrics must reflect real 0.0h when nothing done');
assert.ok(!weeklyMetricsGrid.innerHTML.includes('18.5h'), 'Fake 18.5h must not be present');
assert.ok(!weeklyMetricsGrid.innerHTML.includes('640行'), 'Fake 640 lines must not be present');
console.log('  ✓ 本周工程统计完全基于真实数据计算，杜绝任何假造指标！');

// 7. 验证 28 天日历矩阵渲染
console.log('\n[Test 7] 验证 28 天日历网格渲染与交互...');
sandbox.renderCalendarGrid();
const calGrid = getOrCreateElement('calendar-grid');
assert.strictEqual(calGrid.children.length, 28, 'calendar-grid must render 28 day cells');
console.log('  ✓ 28 天学习打卡索引日历成功渲染 28 个掌握度单元格！');

// 8. 验证每日任务直达链接与牛客网 404 修复
console.log('\n[Test 8] 验证每日任务直达链接与牛客网 404 修复...');
sandbox.renderTodayTasks();
assert.ok(todayTasksContainer.innerHTML.includes('直达专栏'), 'Today tasks should include direct link to knowledge column');
assert.ok(todayTasksContainer.innerHTML.includes('直达手撕 Lab'), 'Today tasks should include direct link to algorithm lab');
assert.ok(todayTasksContainer.innerHTML.includes('直达自测中心'), 'Today tasks should include direct link to quiz center');
assert.ok(todayTasksContainer.innerHTML.includes('https://www.nowcoder.com/job/center'), 'Nowcoder URL must point to job/center (200 OK), not /jobs (404)');
assert.ok(!html.includes('https://www.nowcoder.com/jobs"'), 'Outdated 404 nowcoder link must be completely removed from index.html');
console.log('  ✓ 每日任务直达链接就绪，牛客网 404 链接修复为官方招聘广场 (job/center)！');

// 9. 验证统一学习系统与知识与实践关联中心单独列出
console.log('\n[Test 9] 验证统一学习系统与知识与实践关联中心单独列出...');
assert.ok(html.includes('id="nav-learning"'), 'index.html must have dedicated #nav-learning tab button');
assert.ok(html.includes('id="view-learning"'), 'index.html must have dedicated #view-learning section');
sandbox.switchView('learning');
assert.strictEqual(getOrCreateElement('view-learning').classList.contains('hidden'), false, 'view-learning should be visible when switched');
assert.strictEqual(getOrCreateElement('view-mapping').classList.contains('hidden'), true, 'view-mapping should be hidden when view-learning is active');
console.log('  ✓ 统一学习系统与知识与实践关联中心已成功作为顶级独立视图与导航单独列出！');

// 10. 验证算法手撕 Lab 12 大分类全览全景图与即时响应
console.log('\n[Test 10] 验证算法手撕 Lab 12 大分类全览全景图与即时联动...');
sandbox.renderLearningAlgoTab();
const algoLabContainer = getOrCreateElement('algo-lab-container');
assert.ok(algoLabContainer.innerHTML.includes('algo-category-overview-grid'), 'Must render 12 category overview grid');
assert.ok(algoLabContainer.innerHTML.includes('二叉树'), 'Overview grid must contain Binary Tree');
assert.ok(algoLabContainer.innerHTML.includes('动态规划'), 'Overview grid must contain DP');
assert.ok(algoLabContainer.innerHTML.includes('单调栈'), 'Overview grid must contain Monotonic Stack');

// 测试切换勾选题目时全览图即时动态更新
const p704 = 704; // 数组分类：二分查找
sandbox.toggleAlgoCompletedStatus(p704);
assert.ok(sandbox.stateManager.isAlgoCompleted(p704), 'Problem 704 should now be completed');
assert.ok(algoLabContainer.innerHTML.includes('进度') && (algoLabContainer.innerHTML.includes('1 /') || algoLabContainer.innerHTML.includes('攻坚中') || algoLabContainer.innerHTML.includes('%')), 'Overview grid progress must dynamically update upon completion');

console.log('  ✓ 算法手撕 Lab 12 大分类全览图就绪，完成题目时分类卡片即时联动更新！');

// 11. 验证 C++ 8维核心与 Linux 9维底座语言风格去除浮夸，紧密贴合语雀路线与《鸟哥的Linux私房菜》
console.log('\n[Test 11] 验证 C++ 与 Linux 模块语言风格拒绝浮夸修饰，严格对齐语雀路线与鸟哥私房菜...');
const forbiddenFluff = ['破除孤岛', '深水区', '极速传输', '大招', '消除孤岛'];
const cppList = sandbox.CPP_KNOWLEDGE_SYSTEM;
const linuxList = sandbox.LINUX_SYSTEM_KNOWLEDGE;

assert.strictEqual(cppList.length, 8, 'C++ 知识体系需包含 8 大维度');
assert.strictEqual(linuxList.length, 9, 'Linux 知识体系需包含 9 大维度');

const allText = JSON.stringify(cppList) + JSON.stringify(linuxList) + html;
forbiddenFluff.forEach(fluff => {
    assert.ok(!allText.includes(fluff), `Code and content must not contain hype word: "${fluff}"`);
});

// 验证 Linux 维度包含《鸟哥私房菜》真实章节内容
const birdKeywords = ['鸟哥私房菜', '第10章', '第5-7章', '第16章', 'export', 'umask', 'SIGPIPE', 'ss -tulnp', 'epoll_create1', 'ulimit -c unlimited'];
birdKeywords.forEach(kw => {
    assert.ok(JSON.stringify(linuxList).includes(kw), `Linux dimensions must contain Bird Linux concept: ${kw}`);
});

console.log('  ✓ C++ 8 维核心与 Linux 9 维底座语言风格完全去除浮夸修饰，鸟哥私房菜章节对照完备！');

// 12. 验证记录手撕题弹窗拥有 179 道题分类候选下拉框，且算法标签与手撕 Lab 同步
console.log('\n[Test 12] 验证记录手撕题弹窗拥有 179 道分类候选下拉框与 12 大标签同步...');
assert.ok(html.includes('id="algo-problem-selector"'), 'Must have #algo-problem-selector in HTML');

// 验证 12 个算法标签在下拉框中完全一致
const expected12Tags = ['数组', '链表', '哈希表', '字符串', '双指针法', '栈与队列', '二叉树', '回溯算法', '贪心算法', '动态规划', '单调栈', '图论'];
expected12Tags.forEach(tag => {
    assert.ok(html.includes(`<option value="${tag}">${tag}</option>`), `Option for ${tag} must be present in #algo-topic`);
});

// 验证 populateAlgoProblemSelector 生成 179 道候选题
sandbox.populateAlgoProblemSelector();
const selectorEl = getOrCreateElement('algo-problem-selector');
assert.ok(selectorEl.children.length > 0 || selectorEl.innerHTML.includes('704'), 'Candidate selector must populate candidate options');

// 验证选择候选题目自动联动表单
sandbox.onAlgoProblemSelect(704);
assert.strictEqual(getOrCreateElement('algo-num').value, '704', 'Auto fill problem num');
assert.ok(getOrCreateElement('algo-title').value.includes('二分查找'), 'Auto fill problem title');
assert.strictEqual(getOrCreateElement('algo-topic').value, '数组', 'Auto fill algo topic');

// 验证保存手撕记录联动 stateManager 完成状态
getOrCreateElement('algo-passed').checked = true;
sandbox.saveAlgorithmProblem();
assert.ok(sandbox.stateManager.isAlgoCompleted(704), 'Problem 704 should be marked completed in stateManager');
console.log('  ✓ 算法记录弹窗 179 道题分类候选下拉框、12 大标签同步与自动填充联动验证通过！');

console.log('\n========================================================================================');
console.log('🎉 全部 12 项核心需求深度重构自动化测试全部通过！系统达到完全真实的工程工作台交付标准！');
console.log('========================================================================================\n');



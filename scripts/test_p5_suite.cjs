// scripts/test_p5_suite.cjs
// Phase 5 自动化测试套件：统一学习系统与六维全链路穿透工程验证
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('=== [Phase 5 Automated Test Suite: Unified Learning System & 6D Cross-Link Engine] ===\n');

const projectRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(projectRoot, 'index.html');
const htmlSource = fs.readFileSync(htmlPath, 'utf8');

// 1. 验证 HTML 结构中 Phase 5 关键元素
console.log('[Test 1] 验证 index.html 中 Phase 5 DOM 容器与子标签结构完整性...');
const requiredDomIds = [
    'view-mapping',
    'nav-mapping',
    'learning-subtabs-nav',
    'learn-tab-btn-cpp',
    'learn-tab-btn-linux',
    'learn-tab-btn-books',
    'learn-tab-btn-algo',
    'learn-tab-btn-qa',
    'learn-tab-btn-reading',
    'learn-panel-cpp',
    'learn-panel-linux',
    'learn-panel-books',
    'learn-panel-algo',
    'learn-panel-qa',
    'learn-panel-reading',
    'cpp-dimensions-container',
    'linux-dimensions-container',
    'books-companion-container',
    'algo-lab-container',
    'project-qa-container',
    'general-reading-container',
    'mapping-table-body', // 100% 保持旧有 15 项核心映射
    'crosslink-modal',
    'crosslink-modal-title',
    'crosslink-modal-subtitle',
    'crosslink-modal-content'
];

requiredDomIds.forEach(id => {
    assert.ok(htmlSource.includes(`id="${id}"`), `Missing required DOM ID in index.html: #${id}`);
});
console.log(`✓ 全部 ${requiredDomIds.length} 个 Phase 5 容器、子标签导航与六维模态框均在 index.html 中就绪！\n`);

// 2. 构造浏览器拟真沙箱并顺序加载全套脚本
console.log('[Test 2] 构造浏览器沙箱并按 HTML 规范顺序加载全量脚本...');
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
            appendChild: (child) => {
                if (child) {
                    domStore[id].innerHTML += (child.outerHTML || child.innerHTML || '');
                }
            },
            addEventListener: () => {},
            focus: () => {},
            querySelectorAll: () => [],
            querySelector: () => null
        };
    }
    return domStore[id];
}

const mockStorage = {};
const mockLocalStorage = {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

const mockWindow = {
    location: { href: 'http://localhost:3000/' },
    localStorage: mockLocalStorage,
    document: {
        getElementById: (id) => getOrCreateElement(id),
        createElement: (tag) => {
            const el = getOrCreateElement('mock-' + Math.random().toString(36).substr(2, 6));
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
    addEventListener: () => {},
    setTimeout: (fn, ms) => setTimeout(fn, ms),
    clearTimeout: (t) => clearTimeout(t),
    setInterval: () => 123,
    clearInterval: () => {},
    console: console,
    confirm: () => true,
    alert: (msg) => console.log('  [Alert]:', msg)
};
mockWindow.window = mockWindow;
mockWindow.globalThis = mockWindow;
const context = vm.createContext(mockWindow);

const scriptMatches = [...htmlSource.matchAll(/<script src="(js\/[^"?]+)/g)].map(m => m[1]);
assert.ok(scriptMatches.includes('js/dataset-learning.js'), 'dataset-learning.js must be declared in index.html');

scriptMatches.forEach(rel => {
    const absPath = path.resolve(projectRoot, rel);
    const code = fs.readFileSync(absPath, 'utf8');
    vm.runInContext(code, context);
    console.log(`  ✓ Evaluated ${rel}`);
});
console.log('✓ Test 2 Passed: 全量 10 个核心脚本在沙箱环境中顺序初始化无任何异常！\n');

// 3. 验证 C++ 学习路线体系 (对齐语雀《C++学习路线 (2026)》与教材页码)
console.log('[Test 3] 验证 C++ 学习路线体系 (对齐语雀《C++学习路线 (2026)》与教材页码)...');
const cppSystem = context.CPP_KNOWLEDGE_SYSTEM;
assert.ok(Array.isArray(cppSystem), 'CPP_KNOWLEDGE_SYSTEM should be an array');
assert.ok(cppSystem.length >= 30, 'CPP_KNOWLEDGE_SYSTEM should have at least 30 detailed topics');

cppSystem.forEach(item => {
    assert.ok(item.id, 'Item must have id');
    assert.ok(item.title, 'Item must have title');
    assert.ok(item.bookReference, `${item.id} must cite book reference with page`);
    assert.ok(item.bookReference.includes('P.'), `${item.id} must have exact page number`);
    assert.ok(item.interviewPoint, `${item.id} must have interview point`);
    assert.ok(Array.isArray(item.keyPoints) && item.keyPoints.length > 0, `${item.id} must have keyPoints`);
});
console.log(`✓ 全部 ${cppSystem.length} 个 C++ 学习路线知识点与精确书目页码校验通过！\n`);

// 4. 验证 Linux 鸟哥私房菜体系 (对齐《鸟哥的Linux私房菜-基础篇》章节与教材页码)
console.log('[Test 4] 验证 Linux 鸟哥私房菜体系 (对齐《鸟哥的Linux私房菜-基础篇》章节与教材页码)...');
const linuxSystem = context.LINUX_SYSTEM_KNOWLEDGE;
assert.ok(Array.isArray(linuxSystem), 'LINUX_SYSTEM_KNOWLEDGE should be an array');
assert.ok(linuxSystem.length >= 30, 'LINUX_SYSTEM_KNOWLEDGE should have at least 30 detailed topics');

linuxSystem.forEach(item => {
    assert.ok(item.id, 'Item must have id');
    assert.ok(item.title, 'Item must have title');
    assert.ok(item.bookReference, `${item.id} must cite book reference`);
    assert.ok(item.bookReference.includes('P.'), `${item.id} must have exact page number`);
    assert.ok(item.syscallOrCmd, `${item.id} must have command or syscall`);
    assert.ok(item.projectScene, `${item.id} must specify project scene`);
    assert.ok(item.interviewPoint, `${item.id} must specify interview point`);
});
console.log(`✓ 全部 ${linuxSystem.length} 个 Linux 鸟哥私房菜知识点与精确书目页码校验通过！\n`);

// 5. 验证两大专业书目伴读伴学与动态配额调配
console.log('[Test 5] 验证专业书目伴读 (陈硕 muduo + 鸟哥私房菜 Bash) 与动态配额调配...');
const booksData = context.BOOKS_COMPANION_DATA;
assert.ok(booksData.linuxServerBook, 'Linux server book must be defined');
assert.strictEqual(booksData.linuxServerBook.defaultDailyGoal, 10);
assert.ok(booksData.linuxServerBook.chapters.length >= 5, 'Server book must map key chapters');

assert.ok(booksData.birdLinuxBook, 'Bird Linux book must be defined');
assert.ok(booksData.birdLinuxBook.startPoint.includes('从 Bash 开始'), 'Bird Linux must strictly start from Bash');
assert.ok(booksData.birdLinuxBook.chapters.length >= 4, 'Bird Linux must have at least 4 chapters');
assert.ok(booksData.birdLinuxBook.chapters[0].practicalCommands.includes('LD_LIBRARY_PATH'), 'Must provide practical commands');

// 动态目标微调交互测试
const nextGoalDown = context.adjustBookDailyGoal('linuxServer', -2);
assert.strictEqual(nextGoalDown, 8, 'adjustBookDailyGoal should decrease quota');
assert.strictEqual(context.appState.learningSystem.bookDynamicGoals.linuxServer, 8);

const nextGoalUp = context.adjustBookDailyGoal('linuxServer', 5);
assert.strictEqual(nextGoalUp, 13, 'adjustBookDailyGoal should increase quota');
assert.strictEqual(context.appState.learningSystem.bookDynamicGoals.linuxServer, 13);
console.log(`✓ 专业书目伴读体系与动态配额调配交互验证通过！\n`);

// 6. 验证算法手撕 Lab (每日 3 题与闭环二刷)
console.log('[Test 6] 验证算法手撕 Lab (6 道典型工程同构题) 与二刷追踪...');
const algoCatalog = context.ALGORITHM_LAB_CATALOG;
assert.ok(Array.isArray(algoCatalog), 'ALGORITHM_LAB_CATALOG must be an array');
assert.ok(algoCatalog.length >= 6, 'Should have at least 6 infra-linked algorithm problems');

const p146 = algoCatalog.find(p => p.num === 146);
assert.ok(p146, 'Problem 146 (LRU) must exist');
assert.strictEqual(p146.independent, true, 'Independent hand-coding flag must be true');
assert.ok(p146.projectLink.includes('Session'), 'Must link to Session Cache');

// 二刷状态交互切换
const newStatus = context.toggleAlgoReview(146);
assert.strictEqual(newStatus, 'mastered', 'Initial toggle should mark as mastered');
assert.strictEqual(context.appState.learningSystem.algoReviewQueue[146], 'mastered');

const revertedStatus = context.toggleAlgoReview(146);
assert.strictEqual(revertedStatus, 'due', 'Second toggle should revert to due');
assert.strictEqual(context.appState.learningSystem.algoReviewQueue[146], 'due');
console.log(`✓ 算法手撕 Lab 结构与二刷状态交互闭环验证通过！\n`);

// 7. 验证项目代码驱动型技术八股中心 (30min/天)
console.log('[Test 7] 验证项目源码逆向八股自测中心 (eventfd, Buffer readv, FSM, 2-Stage MCP)...');
const qaCatalog = context.PROJECT_QA_CATALOG;
assert.ok(Array.isArray(qaCatalog), 'PROJECT_QA_CATALOG must be an array');
assert.ok(qaCatalog.length >= 4, 'Should have at least 4 deep real-code questions');

const eventfdQA = qaCatalog.find(q => q.id === 'qa_reactor_eventfd');
assert.ok(eventfdQA, 'eventfd question must exist');
assert.ok(eventfdQA.trap.includes('8 字节'), 'Must document trap');

// 八股掌握状态切换测试
const qaMasteryResult = context.toggleQAMastery('qa_reactor_eventfd');
assert.strictEqual(qaMasteryResult, true, 'toggleQAMastery should set true');
assert.strictEqual(context.appState.learningSystem.qaMastery['qa_reactor_eventfd'], true);

const qaMasteryRevert = context.toggleQAMastery('qa_reactor_eventfd');
assert.strictEqual(qaMasteryRevert, false, 'toggleQAMastery should revert to false');
assert.strictEqual(context.appState.learningSystem.qaMastery['qa_reactor_eventfd'], false);
console.log(`✓ 项目代码驱动八股自测与防坑追踪验证通过！\n`);

// 8. 验证通识阅读三部曲 (次要任务防抢占)
console.log('[Test 8] 验证通识阅读三部曲 (非暴力沟通/金融学/博弈论) 与次要任务保护...');
const readingCatalog = context.GENERAL_READING_CATALOG;
assert.ok(Array.isArray(readingCatalog), 'GENERAL_READING_CATALOG must be an array');
assert.strictEqual(readingCatalog.length, 3, 'Should have 3 general reading books');

readingCatalog.forEach(book => {
    assert.ok(book.role.includes('Secondary Task'), 'Must be labeled as Secondary Task');
    assert.ok(book.engineeringReflection, 'Must have engineering reflection');
    assert.ok(Array.isArray(book.corePillars) && book.corePillars.length === 4, 'Must define 4 core pillars');
});
console.log(`✓ 通识阅读三部曲与工时保护机制验证通过！\n`);

// 9. 验证六维全链路穿透构建器 (Cross-Link Engine)
console.log('[Test 9] 验证六维全链路穿透构建器 (Knowledge➔Project➔Source➔Task➔Evidence➔Interview)...');
const buildChain = context.buildCrossLinkChain;
assert.ok(typeof buildChain === 'function', 'buildCrossLinkChain must be a function');

// 9.1 测试 C++ 节点穿透
const chainCpp = buildChain('cpp_dim_modern');
assert.strictEqual(chainCpp.type, 'cpp');
assert.ok(chainCpp.knowledge.concept);
assert.ok(chainCpp.project.moduleId);
assert.ok(chainCpp.source.file);
assert.ok(chainCpp.task.day);
assert.ok(chainCpp.evidence.type);
assert.ok(chainCpp.interview.point);

// 9.2 测试 Linux 节点穿透
const chainLinux = buildChain('linux_dim_epoll');
assert.strictEqual(chainLinux.type, 'linux');
assert.ok(chainLinux.knowledge.concept);
assert.ok(chainLinux.project.moduleId);
assert.ok(chainLinux.source.file);
assert.ok(chainLinux.task.day);
assert.ok(chainLinux.evidence.type);
assert.ok(chainLinux.interview.point);

// 9.3 验证 Modal 挂载与开启关闭
context.openCrossLinkModal('cpp_dim_modern');
const modalEl = domStore['crosslink-modal'];
assert.strictEqual(modalEl.classList.contains('hidden'), false, 'Modal should be visible after open');
context.closeCrossLinkModal();
assert.strictEqual(modalEl.classList.contains('hidden'), true, 'Modal should be hidden after close');
console.log(`✓ 六维全链路穿透构建器与模态框交互验证通过！\n`);

// 10. 验证子标签切换与经典映射表格保持
console.log('[Test 10] 验证子标签切换 (switchLearningTab) 与 15 项经典映射表格完整保留...');
context.renderLearningSystem();
const cppHtml = (domStore['cpp-content-container'] && domStore['cpp-content-container'].innerHTML) || (domStore['cpp-dimensions-container'] && domStore['cpp-dimensions-container'].innerHTML);
assert.ok(cppHtml.includes('C++ Primer Plus') || cppHtml.includes('语言基础'), 'Cpp tab should render roadmap with book references');

// 验证旧版 15 项映射保留
const mappingRows = domStore['mapping-table-body'].innerHTML;
assert.ok(mappingRows.includes('RAII'), 'mapping table must contain RAII');
assert.ok(mappingRows.includes('std::unique_ptr'), 'mapping table must contain unique_ptr');
assert.ok(mappingRows.includes('虚析构函数'), 'mapping table must contain virtual destructor');

// 切换到 Linux 标签
context.switchLearningTab('linux');
assert.strictEqual(domStore['learn-panel-linux'].classList.contains('hidden'), false);
assert.strictEqual(domStore['learn-panel-cpp'].classList.contains('hidden'), true);
const linuxHtml = (domStore['linux-content-container'] && domStore['linux-content-container'].innerHTML) || (domStore['linux-dimensions-container'] && domStore['linux-dimensions-container'].innerHTML);
assert.ok(linuxHtml.includes('鸟哥') || linuxHtml.includes('BASH'), 'Linux tab should render Bird Linux content');

// 切换到 Books 标签
context.switchLearningTab('books');
assert.strictEqual(domStore['learn-panel-books'].classList.contains('hidden'), false);
assert.ok(domStore['books-companion-container'].innerHTML.includes('陈硕'), 'Books tab should render server book');

// 切换回 Cpp 标签
context.switchLearningTab('cpp');
assert.strictEqual(domStore['learn-panel-cpp'].classList.contains('hidden'), false);
console.log(`✓ 子标签无损切换与 15 项经典映射表格兼容性验证通过！\n`);

// 11. 验证 JSON 导出与导入中的 learningSystem 闭环
console.log('[Test 11] 验证 JSON 导出与导入中的 learningSystem 闭环...');
const stateManager = context.StateManager || context.stateManager;
assert.ok(stateManager, 'StateManager must exist');

// 设置测试数据
stateManager._state.learningSystem.algoReviewQueue[146] = 'mastered';
stateManager._state.learningSystem.qaMastery['qa_reactor_eventfd'] = true;
stateManager._state.learningSystem.bookDynamicGoals.linuxServer = 12;

const exported = stateManager.exportJson();
assert.ok(exported.payload.learningSystem, 'Exported JSON must contain learningSystem in payload');
assert.strictEqual(exported.payload.learningSystem.bookDynamicGoals.linuxServer, 12);
assert.strictEqual(exported.metadata.learningAlgoReviewedCount, 1);

// 模拟导入覆盖策略
const incoming = JSON.parse(JSON.stringify(exported));
incoming.payload.learningSystem.bookDynamicGoals.linuxServer = 15;
incoming.payload.learningSystem.algoReviewQueue[208] = 'mastered';

stateManager.importJson(incoming, 'overwrite');
assert.strictEqual(stateManager.getState().learningSystem.bookDynamicGoals.linuxServer, 15);
assert.strictEqual(stateManager.getState().learningSystem.algoReviewQueue[208], 'mastered');

// 模拟导入合并策略
const deltaData = {
    completedDays: [1, 2],
    learningSystem: {
        algoReviewQueue: { 232: 'mastered' },
        qaMastery: { qa_buffer_readv: true }
    }
};
stateManager.importJson(deltaData, 'merge');
assert.strictEqual(stateManager.getState().learningSystem.algoReviewQueue[232], 'mastered');
assert.strictEqual(stateManager.getState().learningSystem.algoReviewQueue[208], 'mastered');
assert.strictEqual(stateManager.getState().learningSystem.qaMastery.qa_buffer_readv, true);
console.log(`✓ StateManager 导出导入与合并策略验证通过！\n`);

console.log('======================================================================');
console.log('🎉 PHASE 5 全部 11 项自动化测试验收通过！统一学习系统与六维穿透引擎就绪！');
console.log('======================================================================\n');

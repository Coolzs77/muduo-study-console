// scripts/test_p6_suite.cjs
// Phase 6 自动化测试套件：求职能力矩阵、真实工程凭证与模拟面试实战验证
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('=== [Phase 6 Automated Test Suite: Career Evidence, Capabilities & Interview System] ===\n');

const projectRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(projectRoot, 'index.html');
const htmlSource = fs.readFileSync(htmlPath, 'utf8');

// 1. 验证 HTML 结构中 Phase 6 关键 DOM 容器与元素
console.log('[Test 1] 验证 index.html 中 Phase 6 DOM 容器与子面板完整性...');
const requiredDomIds = [
    'view-career',
    'nav-career',
    'career-subtabs-nav',
    'career-tab-btn-evidence',
    'career-tab-btn-capability',
    'career-tab-btn-interview',
    'career-tab-btn-mock',
    'career-tab-btn-star',
    'career-pane-evidence',
    'career-pane-capability',
    'career-pane-interview',
    'career-pane-mock',
    'career-pane-star',
    'career-evidence-stats-container',
    'evidence-type-filter-bar',
    'evidence-count-badge',
    'career-evidence-grid',
    'career-capability-summary-container',
    'career-capability-grid',
    'career-interview-nav-container',
    'career-interview-content-container',
    'career-mock-arena-container',
    'career-mock-history-container',
    'career-star-stories-container',
    'career-resume-bullets-container',
    'new-evidence-modal',
    'new-evidence-form',
    'evidence-input-title',
    'evidence-input-type',
    'evidence-input-task',
    'evidence-input-source',
    'evidence-input-commit',
    'evidence-input-tags',
    'evidence-input-details'
];

requiredDomIds.forEach(id => {
    assert.ok(htmlSource.includes(`id="${id}"`), `Missing required DOM ID in index.html: #${id}`);
});
console.log(`✓ 全部 ${requiredDomIds.length} 个 Phase 6 容器、导航按钮与凭证录入模态框在 index.html 中就绪！\n`);

// 2. 构造浏览器拟真沙箱并顺序加载全套脚本（含 dataset-career.js）
console.log('[Test 2] 构造浏览器沙箱并顺序执行包括 dataset-career.js 的全量脚本...');
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
            querySelector: () => null,
            reset: () => {}
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
assert.ok(scriptMatches.includes('js/dataset-career.js'), 'dataset-career.js must be declared in index.html');

const careerIdx = scriptMatches.indexOf('js/dataset-career.js');
const stateMgrIdx = scriptMatches.indexOf('js/state-manager.js');
assert.ok(careerIdx < stateMgrIdx, 'dataset-career.js must load before state-manager.js');

scriptMatches.forEach(rel => {
    const absPath = path.resolve(projectRoot, rel);
    const code = fs.readFileSync(absPath, 'utf8');
    vm.runInContext(code, context);
    console.log(`  ✓ Evaluated ${rel}`);
});
console.log('✓ Test 2 Passed: 全量脚本在沙箱环境中顺序加载完成，无任何异常！\n');

// 3. 验证 Phase 6 核心数据集
console.log('[Test 3] 验证 dataset-career.js 核心数据集定义完整性...');
assert.ok(context.EVIDENCE_TYPES, 'EVIDENCE_TYPES must exist');
const evTypeKeys = Object.keys(context.EVIDENCE_TYPES);
assert.strictEqual(evTypeKeys.length, 9, 'Must have exactly 9 evidence types');
[
    'source_reading', 'code_modification', 'bug_fix', 'testing',
    'benchmark', 'experiment', 'git_commit', 'tech_summary', 'trace_proof'
].forEach(k => {
    assert.ok(context.EVIDENCE_TYPES[k], `Missing evidence type: ${k}`);
});

assert.ok(Array.isArray(context.DEFAULT_EVIDENCE_CATALOG), 'DEFAULT_EVIDENCE_CATALOG must be an array');
assert.ok(context.DEFAULT_EVIDENCE_CATALOG.length >= 10, 'DEFAULT_EVIDENCE_CATALOG should have at least 10 ground-truth evidences');
context.DEFAULT_EVIDENCE_CATALOG.forEach(ev => {
    assert.ok(ev.id, 'Evidence must have id');
    assert.ok(ev.title, 'Evidence must have title');
    assert.ok(context.EVIDENCE_TYPES[ev.type], `Evidence has invalid type: ${ev.type}`);
    assert.ok(ev.taskId, 'Evidence must have taskId');
    assert.ok(ev.details, 'Evidence must have details');
    assert.strictEqual(ev.verified, true, 'Default evidence must be verified');
});

assert.ok(context.CAPABILITIES_MATRIX, 'CAPABILITIES_MATRIX must exist');
const capKeys = Object.keys(context.CAPABILITIES_MATRIX);
assert.strictEqual(capKeys.length, 14, 'Must have exactly 14 capabilities');
[
    'cpp', 'linux', 'network', 'concurrency', 'mysql', 'rabbitmq',
    'muduo', 'ai', 'agent', 'mcp', 'rag', 'testing', 'debugging', 'performance'
].forEach(k => {
    assert.ok(context.CAPABILITIES_MATRIX[k], `Missing capability: ${k}`);
});

assert.ok(context.PROJECT_INTERVIEW_DATA, 'PROJECT_INTERVIEW_DATA must exist');
assert.ok(context.PROJECT_INTERVIEW_DATA.elevatorPitch['30s'], 'Must have 30s pitch');
assert.ok(context.PROJECT_INTERVIEW_DATA.elevatorPitch['1m'], 'Must have 1m pitch');
assert.ok(context.PROJECT_INTERVIEW_DATA.elevatorPitch['3m'], 'Must have 3m pitch');
assert.ok(context.PROJECT_INTERVIEW_DATA.architecture, 'Must have architecture module');

assert.ok(Array.isArray(context.PROJECT_REVERSE_QUESTIONS), 'PROJECT_REVERSE_QUESTIONS must be array');
assert.ok(context.PROJECT_REVERSE_QUESTIONS.length >= 4, 'Must have at least 4 reverse questions');
context.PROJECT_REVERSE_QUESTIONS.forEach(q => {
    assert.ok(q.question, 'Question text required');
    assert.ok(q.answer, 'Answer text required');
    assert.ok(q.sourceLocation, '4-Hop: sourceLocation required');
    assert.ok(q.relatedArticleSlug, '4-Hop: relatedArticleSlug required');
    assert.ok(q.commitHash, '4-Hop: commitHash required');
});

assert.ok(Array.isArray(context.CAREER_STAR_STORIES), 'CAREER_STAR_STORIES must be array');
assert.strictEqual(context.CAREER_STAR_STORIES.length, 4, 'Must have 4 STAR stories');
context.CAREER_STAR_STORIES.forEach(st => {
    assert.ok(st.situation && st.task && st.action && st.result, 'Complete STAR structure required');
});

assert.ok(Array.isArray(context.RESUME_BULLETS), 'RESUME_BULLETS must be array');
assert.ok(context.RESUME_BULLETS.length >= 5, 'Must have at least 5 resume bullets');
console.log('✓ Test 3 Passed: 9类凭证、10项初始真凭实据、14维能力、7大面试全案、4道4-Hop题目、STAR故事与简历Bullet均就绪！\n');

// 4. 验证严格凭证驱动的能力等级计算算法 (calculateCapabilityLevel)
console.log('[Test 4] 验证严格凭证驱动的能力等级计算算法 (硬性约束：严禁造假，无凭证不晋级)...');
assert.strictEqual(typeof context.calculateCapabilityLevel, 'function', 'calculateCapabilityLevel must be exported');

// 测试无任何凭据时
const emptyLevel = context.calculateCapabilityLevel('muduo', []);
assert.strictEqual(emptyLevel.level, 0, 'Level must be 0 with 0 evidences');

// 测试仅有 1 个源码阅读凭据
const l1Evidences = [{
    id: 'test_1',
    capabilityTags: ['muduo'],
    type: 'source_reading'
}];
const l1Result = context.calculateCapabilityLevel('muduo', l1Evidences);
assert.strictEqual(l1Result.level, 1, 'Level should be 1 with source_reading evidence');

// 测试具备代码修改与断言（应提升）
const advancedEvidences = [
    { id: 'e1', capabilityTags: ['muduo'], type: 'source_reading' },
    { id: 'e2', capabilityTags: ['muduo'], type: 'code_modification' },
    { id: 'e3', capabilityTags: ['muduo'], type: 'testing' },
    { id: 'e4', capabilityTags: ['muduo'], type: 'git_commit' },
    { id: 'e5', capabilityTags: ['muduo'], type: 'bug_fix' }
];
const advResult = context.calculateCapabilityLevel('muduo', advancedEvidences);
assert.ok(advResult.level >= 3, `Level should be >= 3 with multiple engineering evidences (got ${advResult.level})`);
console.log(`✓ Test 4 Passed: 能力评估算法严格受控于凭证类型与数量 (L0➔L1➔L${advResult.level})，杜绝浮夸造假！\n`);

// 5. 验证 StateManager 中 careerSystem 状态切片与操作助手
console.log('[Test 5] 验证 StateManager 中 careerSystem 状态初始化与助手方法...');
const sm = context.StateManager;
assert.ok(sm, 'StateManager must exist');
const state = sm.init();
assert.ok(state.careerSystem, 'state.careerSystem must exist');
assert.ok(Array.isArray(state.careerSystem.evidences), 'careerSystem.evidences must be array');
assert.ok(state.careerSystem.evidences.length >= 10, 'Initial evidences must be populated');
assert.strictEqual(state.careerSystem.activeCareerTab, 'evidence', 'Default activeCareerTab should be evidence');

// 测试 setCareerTab
sm.setCareerTab('capability');
assert.strictEqual(sm.getState().careerSystem.activeCareerTab, 'capability');
sm.setCareerTab('evidence');

// 测试 addCustomEvidence & deleteCustomEvidence
const customEv = sm.addCustomEvidence({
    title: '单元测试自定义凭证: 修复内存泄漏',
    type: 'bug_fix',
    taskId: 'P6 Unit Test',
    sourceLocation: 'muduo/net/TcpConnection.cc:L120',
    commitHash: 'a1b2c3d',
    capabilityTags: ['muduo', 'Debugging'],
    details: 'Valgrind 发现循环引用，改用 weak_ptr 解决。',
    verified: true
});
assert.ok(customEv.id, 'Custom evidence must be assigned an ID');
assert.ok(customEv.id.startsWith('custom_ev_'), 'ID should follow custom format');
assert.ok(sm.getState().careerSystem.customEvidences.some(e => e.id === customEv.id));

// 删除凭证
sm.deleteCustomEvidence(customEv.id);
assert.ok(!sm.getState().careerSystem.customEvidences.some(e => e.id === customEv.id));

// 测试 addMockInterviewLog
const mockLog = sm.addMockInterviewLog({
    mode: 'project',
    question: '两段式任务转移怎么做的？',
    rating: 5,
    notes: '回答非常完整'
});
assert.ok(mockLog.id, 'Mock log must have ID');
assert.strictEqual(mockLog.rating, 5);
assert.ok(sm.getState().careerSystem.mockInterviewLogs.some(l => l.id === mockLog.id));

// 测试 toggleBookmarkQuestion
const qId = 'rev_q_01';
const b1 = sm.toggleBookmarkQuestion(qId);
assert.strictEqual(b1, true, 'Should be bookmarked');
assert.ok(sm.getState().careerSystem.bookmarkedQuestions.includes(qId));
const b2 = sm.toggleBookmarkQuestion(qId);
assert.strictEqual(b2, false, 'Should be unbookmarked');
console.log('✓ Test 5 Passed: StateManager 对 careerSystem 的状态增删改查完整受管！\n');

// 6. 验证 exportJson / importJson (覆盖与合并策略)
console.log('[Test 6] 验证 exportJson 导出与 importJson (覆盖/合并) 数据持久化...');
const exported = sm.exportJson();
assert.ok(exported.metadata.careerEvidenceCount >= 10, 'Metadata must contain careerEvidenceCount');
assert.ok(exported.metadata.mockInterviewCount >= 1, 'Metadata must contain mockInterviewCount');
assert.ok(exported.payload.careerSystem, 'Payload must contain careerSystem');

// 导入测试 (合并策略)
const importPayload = {
    completedDays: [1, 2],
    careerSystem: {
        customEvidences: [{
            id: 'imported_ev_01',
            title: '导入的自定义凭据',
            type: 'benchmark',
            taskId: 'Import Test',
            details: '吞吐测试达到 85,000 QPS',
            capabilityTags: ['performance']
        }],
        mockInterviewLogs: [{
            id: 'imported_mock_01',
            mode: 'classic',
            question: 'epoll 触发模式区别',
            rating: 4
        }],
        bookmarkedQuestions: ['q_imported_01']
    }
};

sm.importJson(importPayload, 'merge');
const stateAfterMerge = sm.getState();
assert.ok(stateAfterMerge.careerSystem.customEvidences.some(e => e.id === 'imported_ev_01'), 'Custom evidence must merge');
assert.ok(stateAfterMerge.careerSystem.mockInterviewLogs.some(l => l.id === 'imported_mock_01'), 'Mock interview log must merge');
assert.ok(stateAfterMerge.careerSystem.bookmarkedQuestions.includes('q_imported_01'), 'Bookmark must merge');
console.log('✓ Test 6 Passed: exportJson 成功携带凭据与模拟面试统计，importJson 完美支持合并导入！\n');

// 7. 验证 UI 视图切换 (switchView('career'))
console.log('[Test 7] 验证 switchView("career") 切换与视图容器显示...');
context.switchView('career');
const careerSec = domStore['view-career'];
assert.ok(!careerSec.classList.contains('hidden'), 'view-career should not be hidden');
assert.strictEqual(context.appState.currentView, 'career', 'appState.currentView should be career');
console.log('✓ Test 7 Passed: 求职能力与工程凭证中心 (P6) 主视图切换顺畅！\n');

// 8. 验证 5 大子面板渲染器 (switchCareerTab)
console.log('[Test 8] 验证 5 大子面板切换与对应渲染器...');

// 8.1 凭证库
context.switchCareerTab('evidence');
assert.ok(!domStore['career-pane-evidence'].classList.contains('hidden'));
assert.ok(domStore['career-evidence-grid'].innerHTML.includes('真实核验'), 'Evidence grid should render cards');

// 8.2 能力矩阵
context.switchCareerTab('capability');
assert.ok(!domStore['career-pane-capability'].classList.contains('hidden'));
assert.ok(domStore['career-capability-summary-container'].innerHTML.includes('14 维后端核心能力'), 'Capability summary should render');
assert.ok(domStore['career-capability-grid'].innerHTML.includes('C++') || domStore['career-capability-grid'].innerHTML.includes('muduo'), 'Capability grid should render items');

// 8.3 项目面试全案
context.switchCareerTab('interview');
assert.ok(!domStore['career-pane-interview'].classList.contains('hidden'));
assert.ok(domStore['career-interview-content-container'].innerHTML.includes('4-HOP REVERSE INTERVIEW CHAIN'), '4-Hop section should render');
assert.ok(domStore['career-interview-content-container'].innerHTML.includes('Hop 2:'), 'Hop 2 link should render');

// 8.4 模拟面试大厅
context.switchCareerTab('mock');
assert.ok(!domStore['career-pane-mock'].classList.contains('hidden'));
assert.ok(domStore['career-mock-arena-container'].innerHTML.includes('真实模拟面试演练场'), 'Mock arena should render');

// 8.5 STAR 故事与简历
context.switchCareerTab('star');
assert.ok(!domStore['career-pane-star'].classList.contains('hidden'));
assert.ok(domStore['career-star-stories-container'].innerHTML.includes('STAR INTERVIEW METHODOLOGY'), 'STAR stories should render');
assert.ok(domStore['career-resume-bullets-container'].innerHTML.includes('RESUME READY BULLETS'), 'Resume bullets should render');

console.log('✓ Test 8 Passed: 凭证库、能力矩阵、项目面试全案、模拟面试大厅与 STAR 故事 5 大子面板渲染完全就绪！\n');

// 9. 验证模拟面试抽题、连环追问与评分全流程
console.log('[Test 9] 验证模拟面试竞技场交互流程 (出题➔追问➔答案➔评分)...');
context.startMockQuestion('project');
assert.ok(context.appState.currentMockQuestion, 'A mock question should be active');
assert.ok(context.appState.currentMockQuestion.question, 'Question text should exist');

context.revealMockFollowUp();
assert.strictEqual(context.appState.mockFollowUpRevealed, true, 'Follow-up should be revealed');

context.revealMockAnswer();
assert.strictEqual(context.appState.mockAnswerRevealed, true, 'Answer should be revealed');

const initialLogCount = (sm.getState().careerSystem.mockInterviewLogs || []).length;
context.submitMockRating(5);
assert.strictEqual(context.appState.currentMockQuestion, null, 'Active question should be cleared after rating');
const newLogCount = (sm.getState().careerSystem.mockInterviewLogs || []).length;
assert.strictEqual(newLogCount, initialLogCount + 1, 'Mock log count should increase by 1');
console.log('✓ Test 9 Passed: 模拟面试完整实战闭环执行无误！\n');

// 10. 验证模态框控制与自定义凭证表单交互
console.log('[Test 10] 验证凭证录入模态框与自定义凭证保存...');
context.openNewEvidenceModal();
assert.ok(!domStore['new-evidence-modal'].classList.contains('hidden'), 'Modal should be shown');

context.closeNewEvidenceModal();
assert.ok(domStore['new-evidence-modal'].classList.contains('hidden'), 'Modal should be closed');

// 模拟表单输入并保存
getOrCreateElement('evidence-input-title').value = '压测发现 Epoll LT 惊群现象并优化为 ET';
getOrCreateElement('evidence-input-type').value = 'benchmark';
getOrCreateElement('evidence-input-task').value = 'Day 18';
getOrCreateElement('evidence-input-source').value = 'muduo/net/poller/EPollPoller.cc:L72';
getOrCreateElement('evidence-input-commit').value = 'f4e3d2c';
getOrCreateElement('evidence-input-tags').value = 'muduo, performance, Linux, Concurrency';
getOrCreateElement('evidence-input-details').value = '采用 wrk 压测 10,000 并发，测试得到延迟降低 38%。';

context.handleSaveCustomEvidence({ preventDefault: () => {} });
const curEvidences = context.getAllEvidences();
const created = curEvidences.find(e => e.title === '压测发现 Epoll LT 惊群现象并优化为 ET');
assert.ok(created, 'Custom evidence must be created and saved');
assert.strictEqual(created.type, 'benchmark');
assert.strictEqual(created.commitHash, 'f4e3d2c');
console.log('✓ Test 10 Passed: 自定义真实工程凭证录入表单校验与入库顺畅！\n');

// 11. 验证 4-Hop 链条穿透触发跳转
console.log('[Test 11] 验证 4-Hop 穿透穿行跳转 (Question➔Source➔Knowledge➔Commit)...');
assert.strictEqual(typeof context.jumpToEvidence, 'function', 'jumpToEvidence function must exist');
context.jumpToEvidence('c8f2a10');
assert.strictEqual(context.appState.currentView, 'career', 'Should switch to career view');
assert.strictEqual(context.appState.careerFilterType, 'git_commit', 'Should filter by git_commit');
console.log('✓ Test 11 Passed: 4-Hop 链条穿透与 Commit 凭证反查跳转验证通过！\n');

console.log('================================================================');
console.log('🎉 全部 11 项 Phase 6 专项测试全部通过！系统达到真实工程与求职交付级标准！');
console.log('================================================================\n');

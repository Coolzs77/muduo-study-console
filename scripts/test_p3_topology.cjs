// scripts/test_p3_topology.cjs
// Phase 3 自动化拓扑全景与双核交互测试验证套件
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('=== [Phase 3 Automated Test Suite: Dual-Core Topology & Workspace Navigation] ===\n');

// 1. 扫描 index.html 中的所有拓扑点击节点
const projectRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(projectRoot, 'index.html');
const htmlSource = fs.readFileSync(htmlPath, 'utf8');

const nodeRegex = /openTopologyDrawer\(['"]([^'"]+)['"]\)/g;
const foundNodes = [];
let match;
while ((match = nodeRegex.exec(htmlSource)) !== null) {
    foundNodes.push(match[1]);
}

const uniqueNodes = [...new Set(foundNodes)];
console.log(`[Test 1] 扫描 index.html 拓扑节点: 发现 ${foundNodes.length} 处点击, 去重后 ${uniqueNodes.length} 个独立节点`);
console.log('节点列表:', uniqueNodes.join(', '));
assert.ok(uniqueNodes.length >= 19, 'Should have at least 19 unique topology nodes');
console.log('✓ Test 1 Passed!\n');

// 2. 构造轻量且状态化的浏览器 DOM 模拟环境
console.log('[Test 2] 构造浏览器沙箱并依次加载运行时脚本...');
const domStore = {};
function getOrCreateElement(id) {
    if (!domStore[id]) {
        const classes = new Set();
        domStore[id] = {
            id,
            innerText: '',
            innerHTML: '',
            value: '',
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
            getContext: () => ({
                clearRect: () => {},
                fillRect: () => {},
                stroke: () => {},
                beginPath: () => {},
                moveTo: () => {},
                lineTo: () => {}
            })
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
        body: { appendChild: () => {} }
    },
    localStorage: {
        _data: {},
        getItem(k) { return this._data[k] || null; },
        setItem(k, v) { this._data[k] = String(v); },
        removeItem(k) { delete this._data[k]; }
    },
    setTimeout: (fn, ms) => { fn(); return 1; },
    clearTimeout: () => {},
    console: console
};
mockWindow.window = mockWindow;
mockWindow.globalThis = mockWindow;
const context = vm.createContext(mockWindow);

// 提取并顺序执行 index.html 中引入的所有脚本
const scriptMatches = [...htmlSource.matchAll(/<script src="(js\/[^"?]+)/g)].map(m => m[1]);
scriptMatches.forEach(rel => {
    const absPath = path.resolve(projectRoot, rel);
    const code = fs.readFileSync(absPath, 'utf8');
    vm.runInContext(code, context);
    console.log(`  ✓ Evaluated ${rel}`);
});
console.log('✓ Test 2 Passed!\n');

// 3. 验证领域数据字典
console.log('[Test 3] 验证领域模型与模块完整度...');
assert.strictEqual(context.DOMAIN_PROJECTS.length, 2, 'DOMAIN_PROJECTS should have 2 projects');
assert.strictEqual(context.DOMAIN_MODULES.length, 19, 'DOMAIN_MODULES should have 19 modules');
console.log(`  - 核心项目: ${context.DOMAIN_PROJECTS.map(p => p.id).join(', ')}`);
console.log(`  - 领域模块总数: ${context.DOMAIN_MODULES.length}`);
console.log('✓ Test 3 Passed!\n');

// 4. 验证全部拓扑节点的 openTopologyDrawer 抽屉渲染
console.log('[Test 4] 验证所有拓扑节点的 openTopologyDrawer 抽屉渲染...');
let verifiedNodes = 0;
uniqueNodes.forEach(nodeId => {
    context.openTopologyDrawer(nodeId);
    const titleEl = domStore['drawer-title'];
    const tagEl = domStore['drawer-tag'];
    const contentEl = domStore['drawer-content'];

    assert.ok(titleEl && titleEl.innerText.length > 0, `Node [${nodeId}] title should not be empty`);
    assert.ok(tagEl && tagEl.innerText.length > 0, `Node [${nodeId}] tag should not be empty`);
    assert.ok(contentEl && contentEl.innerHTML.length > 50, `Node [${nodeId}] content should be detailed (len: ${contentEl?.innerHTML.length})`);
    verifiedNodes++;
});
console.log(`✓ 全部 ${verifiedNodes} 个拓扑节点抽屉渲染 100% 成功！\n`);

// 5. 验证双核工作台模式切换 (setWorkspaceMode)
console.log('[Test 5] 验证双核工作台模式切换 (setWorkspaceMode)...');
['full', 'muduo', 'cppai'].forEach(mode => {
    context.setWorkspaceMode(mode);
    assert.strictEqual(context.appState.workspaceMode, mode, `appState.workspaceMode should be ${mode}`);
    const missionCard = domStore['today-mission-card'];
    assert.ok(missionCard && missionCard.innerHTML.length > 50, `Mission card should render in ${mode} mode`);
    console.log(`  ✓ 模式 [${mode}] 切换与今日推荐卡片渲染成功`);
});
console.log('✓ Test 5 Passed!\n');

// 6. 验证拓扑标签切换 (switchTopologyTab)
console.log('[Test 6] 验证拓扑标签切换 (switchTopologyTab)...');
['endtoend', 'muduo', 'cppai'].forEach(tab => {
    context.switchTopologyTab(tab);
    const activeEl = domStore[`topo-svg-${tab}`];
    assert.ok(activeEl, `topo-svg-${tab} must exist`);
    assert.strictEqual(activeEl.classList.contains('hidden'), false, `topo-svg-${tab} should not have 'hidden' class`);
    console.log(`  ✓ 拓扑标签 [${tab}] 切换显示正常`);
});
console.log('✓ Test 6 Passed!\n');

// 7. 验证双核 Dashboard 指标计算与更新
console.log('[Test 7] 验证双核 Dashboard 指标计算与更新...');
context.updateDashboardMetrics();
const statProgVal = domStore['stat-progress-val']?.innerText;
const statMasteryVal = domStore['stat-mastery-val']?.innerText;
const statSourceVal = domStore['stat-source-val']?.innerText;

console.log(`  - muduo 任务进度: ${statProgVal}`);
console.log(`  - CppAI 专栏掌握: ${statMasteryVal}`);
console.log(`  - 双核核心模块数: ${statSourceVal}`);

assert.ok(statProgVal.includes('%'), 'stat-progress-val must contain %');
assert.ok(statMasteryVal.includes('17'), 'stat-mastery-val must contain 17');
assert.ok(statSourceVal.includes('19'), 'stat-source-val must contain 19');
console.log('✓ Test 7 Passed!\n');

console.log('===============================================================');
console.log('🎉 PHASE 3 全部自动化测试验收通过！双核拓扑与全景交互就绪！');
console.log('===============================================================');

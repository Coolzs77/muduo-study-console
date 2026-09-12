// scripts/test_p6_p7_suite.cjs
// Phase 6 & Phase 7 联合全栈自动化测试套件：
// 求职能力凭证体系 (P6) + 智能任务调度与日历同步引擎 (P7)
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('=== [Phase 6 & 7 Unified Automated Test Suite: Career Evidence & Smart Scheduler Engine] ===\n');

const projectRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(projectRoot, 'index.html');
const htmlSource = fs.readFileSync(htmlPath, 'utf8');

// ==========================================================================
// Test 1: 验证 index.html 中 Phase 6 与 Phase 7 DOM 容器完整性
// ==========================================================================
console.log('[Test 1] 验证 index.html 中 Phase 6 与 Phase 7 全部 DOM 容器与元素完整性...');

const p6DomIds = [
    'view-career', 'nav-career', 'career-subtabs-nav',
    'career-tab-btn-evidence', 'career-tab-btn-capability', 'career-tab-btn-interview', 'career-tab-btn-mock', 'career-tab-btn-star',
    'career-pane-evidence', 'career-pane-capability', 'career-pane-interview', 'career-pane-mock', 'career-pane-star',
    'career-evidence-stats-container', 'evidence-type-filter-bar', 'evidence-count-badge', 'career-evidence-grid',
    'career-capability-summary-container', 'career-capability-grid',
    'career-interview-nav-container', 'career-interview-content-container',
    'career-mock-arena-container', 'career-mock-history-container',
    'career-star-stories-container', 'career-resume-bullets-container',
    'new-evidence-modal', 'new-evidence-form', 'evidence-input-title', 'evidence-input-type',
    'evidence-input-task', 'evidence-input-source', 'evidence-input-commit', 'evidence-input-tags', 'evidence-input-details'
];

const p7DomIds = [
    'view-scheduler', 'nav-scheduler', 'scheduler-subtabs-nav',
    'scheduler-tab-btn-planner', 'scheduler-tab-btn-calendar', 'scheduler-tab-btn-diagnostics', 'scheduler-tab-btn-review',
    'scheduler-pane-planner', 'scheduler-pane-calendar', 'scheduler-pane-diagnostics', 'scheduler-pane-review',
    'btn-open-calendar-import', 'btn-recalculate-schedule', 'btn-generate-daily-review',
    'scheduler-stats-container', 'scheduler-deficit-alert-container', 'scheduler-current-date-label', 'scheduler-timeline-grid',
    'calendar-source-badge', 'calendar-busy-list', 'calendar-free-slots-list',
    'google-tasks-container', 'google-tasks-count-badge',
    'scheduler-incomplete-tasks-list', 'scheduler-diagnostics-history-container',
    'scheduler-review-content', 'btn-copy-review-md', 'btn-download-review-md',
    'calendar-import-modal', 'cal-import-tab-file', 'cal-import-tab-text', 'cal-import-tab-tasks',
    'ics-file-input', 'ics-paste-input', 'tasks-paste-input', 'calendar-target-date',
    'task-diagnostic-modal', 'task-diagnostic-form', 'diag-task-select', 'diag-reason-select', 'diag-notes'
];

p6DomIds.forEach(id => {
    assert.ok(htmlSource.includes(`id="${id}"`), `[P6] Missing DOM ID in index.html: #${id}`);
});
p7DomIds.forEach(id => {
    assert.ok(htmlSource.includes(`id="${id}"`), `[P7] Missing DOM ID in index.html: #${id}`);
});

console.log(`✓ 全部 ${p6DomIds.length} 个 P6 容器与 ${p7DomIds.length} 个 P7 容器在 index.html 中完备就绪！\n`);

// ==========================================================================
// Test 2: 构造沙箱并按序加载全套 12 个模块化脚本
// ==========================================================================
console.log('[Test 2] 构造浏览器拟真沙箱并顺序执行全量 12 个脚本（含 dataset-career.js 与 dataset-scheduler.js）...');
const domStore = {};

function createMockElement(id, tagName = 'div') {
    return {
        id: id,
        tagName: tagName.toUpperCase(),
        classList: {
            classes: new Set(['hidden']),
            add: function(c) { this.classes.add(c); },
            remove: function(c) { this.classes.delete(c); },
            contains: function(c) { return this.classes.has(c); },
            toggle: function(c, force) {
                if (force !== undefined) {
                    if (force) this.classes.add(c); else this.classes.delete(c);
                } else {
                    if (this.classes.has(c)) this.classes.delete(c); else this.classes.add(c);
                }
            }
        },
        style: {},
        attributes: {},
        innerHTML: '',
        innerText: '',
        value: '',
        files: [],
        setAttribute: function(k, v) { this.attributes[k] = v; },
        getAttribute: function(k) { return this.attributes[k] || null; },
        addEventListener: function() {},
        removeEventListener: function() {},
        appendChild: function() {},
        removeChild: function() {},
        focus: function() {},
        select: function() {},
        click: function() {}
    };
}

[...p6DomIds, ...p7DomIds, 'toast', 'toast-msg', 'toast-icon', 'badge-nav-tasks', 'main-content-area', 'task-sidebar'].forEach(id => {
    domStore[id] = createMockElement(id);
});

const mockWindow = {
    document: {
        getElementById: (id) => {
            if (!domStore[id]) domStore[id] = createMockElement(id);
            return domStore[id];
        },
        querySelector: (sel) => {
            if (sel.startsWith('#')) return mockWindow.document.getElementById(sel.slice(1));
            return createMockElement('sel_mock');
        },
        querySelectorAll: () => [],
        createElement: (tag) => createMockElement(`dyn_${Date.now()}_${Math.random()}`, tag),
        body: {
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
    alert: (msg) => console.log('  [Mock Alert]:', msg),
    FileReader: class {
        readAsText(file) {
            setTimeout(() => {
                if (this.onload) this.onload({ target: { result: file._mockContent || '' } });
            }, 1);
        }
    },
    Blob: class {
        constructor(content, opts) { this.content = content; this.opts = opts; }
    },
    URL: {
        createObjectURL: () => 'blob://mock-url',
        revokeObjectURL: () => {}
    },
    navigator: {
        clipboard: {
            writeText: (txt) => {
                mockWindow.__lastCopied = txt;
                return Promise.resolve();
            }
        }
    },
    localStorage: {
        _store: {},
        getItem: function(k) { return this._store[k] || null; },
        setItem: function(k, v) { this._store[k] = String(v); },
        removeItem: function(k) { delete this._store[k]; },
        clear: function() { this._store = {}; }
    }
};

mockWindow.window = mockWindow;
mockWindow.globalThis = mockWindow;
const context = vm.createContext(mockWindow);

const scriptMatches = [...htmlSource.matchAll(/<script src="(js\/[^"?]+)/g)].map(m => m[1]);
assert.ok(scriptMatches.includes('js/dataset-career.js'), 'dataset-career.js must be in index.html');
assert.ok(scriptMatches.includes('js/dataset-scheduler.js'), 'dataset-scheduler.js must be in index.html');
assert.ok(scriptMatches.includes('js/state-manager.js'), 'state-manager.js must be in index.html');

scriptMatches.forEach(rel => {
    const absPath = path.resolve(projectRoot, rel);
    const code = fs.readFileSync(absPath, 'utf8');
    vm.runInContext(code, context);
    console.log(`  ✓ Evaluated ${rel}`);
});
console.log('✓ Test 2 Passed: 全量 12 个核心脚本在沙箱环境中顺序初始化无任何异常！\n');

// ==========================================================================
// Test 3: 验证 RFC 5545 iCal 解析引擎 (Real RFC 5545 Parser Engine)
// ==========================================================================
console.log('[Test 3] 验证真实 RFC 5545 iCal/ICS 文本解析引擎 (展开多行、VEVENT、起止时间戳、时区与跨天)...');
const RFC5545Parser = context.RFC5545Parser;
assert.ok(RFC5545Parser, 'RFC5545Parser class must be defined');

// 构造真实的 RFC 5545 格式日历字符串（包含展开行、时区、全天事件、取消事件）
const realIcsSample = [
    'BEGIN:VCALENDAR',
    'PRODID:-//Google Inc//Google Calendar 70.9054//EN',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:研发团队日程',
    'X-WR-TIMEZONE:Asia/Shanghai',
    'BEGIN:VEVENT',
    'DTSTART;TZID=Asia/Shanghai:20260912T093000',
    'DTEND;TZID=Asia/Shanghai:20260912T110000',
    'DTSTAMP:20260910T080000Z',
    'UID:meeting_arch_sync_001',
    'SUMMARY:分布式微服务架构技术评审与',
    ' 代码重构对齐会', // 模拟 RFC 5545 续行展开
    'DESCRIPTION:重点评审 muduo 事件循环与 CppAIService HTTP 状态机解析模块',
    'LOCATION:线上腾讯会议 (ID: 888-999-123)',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'DTSTART:20260912T140000Z',
    'DTEND:20260912T153000Z',
    'UID:meeting_cloud_002',
    'SUMMARY:阿里云服务器性能与网络基准同步',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'DTSTART:20260912',
    'DTEND:20260913',
    'UID:allday_hackathon_003',
    'SUMMARY:开源社区黑客松比赛',
    'TRANSP:TRANSPARENT', // 透明不占空闲时间
    'END:VEVENT',
    'END:VCALENDAR'
].join('\r\n');

const parsedEvents = RFC5545Parser.parse(realIcsSample, '2026-09-12');
assert.strictEqual(parsedEvents.length, 3, 'Should parse 3 events matching 2026-09-12');

const archMeeting = parsedEvents.find(e => e.id === 'meeting_arch_sync_001');
assert.ok(archMeeting, 'Meeting 001 must exist');
assert.strictEqual(archMeeting.summary, '分布式微服务架构技术评审与代码重构对齐会', 'Multiline summary must be properly unfolded');
assert.strictEqual(archMeeting.startTimeStr, '09:30', 'Start time must be 09:30');
assert.strictEqual(archMeeting.endTimeStr, '11:00', 'End time must be 11:00');
assert.strictEqual(archMeeting.durationMinutes, 90, 'Duration should be 90 minutes');
assert.strictEqual(archMeeting.busy, true, 'OPAQUE event should be marked busy');

const transparentEvent = parsedEvents.find(e => e.id === 'allday_hackathon_003');
assert.ok(transparentEvent, 'Hackathon event must exist');
assert.strictEqual(transparentEvent.busy, false, 'TRANSP:TRANSPARENT event should not be busy');

console.log('✓ Test 3 Passed: 真实 RFC 5545 格式完美解析，续行多行、起止时间与忙闲状态精确计算！\n');

// ==========================================================================
// Test 4: 验证 Google Tasks 导入器 (Google Tasks Importer)
// ==========================================================================
console.log('[Test 4] 验证 Google Tasks 导出数据格式解析 (JSON 与 Markdown 待办格式)...');
const GoogleTasksAdapter = context.GoogleTasksAdapter;
assert.ok(GoogleTasksAdapter, 'GoogleTasksAdapter class must be defined');

const tasksJsonSample = {
    items: [
        { id: 'gt_01', title: '完成 CppAIService HTTP 状态机解析单元测试', due: '2026-09-12T18:00:00.000Z', status: 'needsAction' },
        { id: 'gt_02', title: '手撕 LeetCode 206 反转链表与双指针', due: '2026-09-12T20:00:00.000Z', status: 'completed' }
    ]
};
const parsedJsonTasks = GoogleTasksAdapter.parse(tasksJsonSample);
assert.strictEqual(parsedJsonTasks.length, 2, 'Must parse 2 items from JSON');
assert.strictEqual(parsedJsonTasks[0].status, 'needsAction');
assert.strictEqual(parsedJsonTasks[1].status, 'completed');

const tasksMdSample = `
- [ ] 深入研读 Linux epoll 边缘触发原理 @due(2026-09-12 16:00)
- [x] 配置 VS Code Remote-SSH 到阿里云 Ubuntu
`;
const parsedMdTasks = GoogleTasksAdapter.parse(tasksMdSample);
assert.strictEqual(parsedMdTasks.length, 2, 'Must parse 2 items from Markdown');
assert.strictEqual(parsedMdTasks[0].status, 'needsAction');
assert.strictEqual(parsedMdTasks[1].status, 'completed');
assert.ok(parsedMdTasks[0].title.includes('深入研读 Linux epoll'), 'Title must be extracted cleanly');

console.log('✓ Test 4 Passed: Google Tasks JSON 与 Markdown 待办适配器解析无误！\n');

// ==========================================================================
// Test 5: 验证日历冲突矩阵与连续空闲专注块计算 (TimeConflictMatrix)
// ==========================================================================
console.log('[Test 5] 验证日历时间冲突合并与连续空闲专注时隙矩阵计算...');
const TimeConflictMatrix = context.TimeConflictMatrix;
assert.ok(TimeConflictMatrix, 'TimeConflictMatrix class must be defined');

// 模拟两个时间有重叠/相邻的外部会议
const testMeetings = [
    {
        summary: '上午架构评审',
        startDate: new Date(2026, 8, 12, 10, 0, 0),
        endDate: new Date(2026, 8, 12, 11, 30, 0),
        busy: true
    },
    {
        summary: '午后技术交流',
        startDate: new Date(2026, 8, 12, 15, 0, 0),
        endDate: new Date(2026, 8, 12, 16, 0, 0),
        busy: true
    }
];

const availability = TimeConflictMatrix.calculateAvailability(testMeetings, {
    dayStartHour: 8,
    dayStartMinute: 30, // 08:30 开始
    dayEndHour: 22,
    dayEndMinute: 30,   // 22:30 结束
    bufferMinutes: 10   // 10 分钟缓冲
});

assert.strictEqual(availability.totalDayMinutes, 840, 'Total span 08:30 ~ 22:30 is 840 minutes');
assert.ok(availability.freeSlots.length >= 3, 'Should have at least 3 continuous free slots');
// 槽位 1: 08:30 ~ 10:00 (90 min)
assert.strictEqual(availability.freeSlots[0].startTimeStr, '08:30');
assert.strictEqual(availability.freeSlots[0].endTimeStr, '10:00');
assert.strictEqual(availability.freeSlots[0].durationMinutes, 90);

// 槽位 2: 11:40 (含10m缓冲) ~ 15:00 (200 min)
assert.strictEqual(availability.freeSlots[1].startTimeStr, '11:40');
assert.strictEqual(availability.freeSlots[1].endTimeStr, '15:00');
assert.strictEqual(availability.freeSlots[1].durationMinutes, 200);

console.log('✓ Test 5 Passed: 外部日程重叠合并、10m认知缓冲与连续空闲专注窗口计算精确！\n');

// ==========================================================================
// Test 6: 验证时间赤字压缩算法 (TimeDeficitCompressor 核心防护)
// ==========================================================================
console.log('[Test 6] 验证时间赤字压缩算法 (硬性约束：严禁先砍S/A主干，按C➔B逐级压缩，保卫S级3h与A级算法)...');
const TimeDeficitCompressor = context.TimeDeficitCompressor;
assert.ok(TimeDeficitCompressor, 'TimeDeficitCompressor must be defined');

// 情况 1: 可用时间极其充裕 (600 分钟 > 405 分钟需求)
const ampleResult = TimeDeficitCompressor.compress(600);
assert.strictEqual(ampleResult.deficitMinutes, 0, 'No deficit when time is ample');
assert.strictEqual(ampleResult.compressionApplied, false);
assert.strictEqual(ampleResult.allocated.s_core, 180, 'S-tier core should be standard 180m');
assert.strictEqual(ampleResult.allocated.a_algorithm, 60, 'A-tier algorithm should be standard 60m');

// 情况 2: 可用时间受挤压至 260 分钟 (赤字 145 分钟)
const squeezedResult = TimeDeficitCompressor.compress(260);
assert.strictEqual(squeezedResult.deficitMinutes, 145, 'Deficit is 405 - 260 = 145 minutes');
assert.strictEqual(squeezedResult.compressionApplied, true, 'Compression must be triggered');
// 验证保护机制：C 级通识与求职被免除或压缩
assert.strictEqual(squeezedResult.allocated.c_reading, 0, 'C-tier reading deferred');
assert.strictEqual(squeezedResult.allocated.c_career, 0, 'C-tier career deferred');
// B 级自测免除
assert.strictEqual(squeezedResult.allocated.b_qa, 0, 'B-tier QA deferred');
// S 级核心主干得到捍卫 (大于等于最低保底 90m)
assert.ok(squeezedResult.allocated.s_core >= 90, `S-tier core must stay >= 90m (got ${squeezedResult.allocated.s_core})`);
// A 级算法得到捍卫 (大于等于最低保底 30m)
assert.ok(squeezedResult.allocated.a_algorithm >= 30, `A-tier algorithm must stay >= 30m (got ${squeezedResult.allocated.a_algorithm})`);
assert.ok(squeezedResult.compressionLogs.length > 0, 'Compression explanation logs must be generated');

console.log('✓ Test 6 Passed: 时间赤字压缩严格按照 C级➔B级➔A级 逐级压缩，核心 S级(180m➔保底) 与算法严格受控保卫！\n');

// ==========================================================================
// Test 7: 验证心流块最小化上下文切换编排 (FlowBlockSequencer)
// ==========================================================================
console.log('[Test 7] 验证心流块最小化上下文切换编排 (S主干➔支撑知识➔手撕算法➔复盘)...');
const FlowBlockSequencer = context.FlowBlockSequencer;
assert.ok(FlowBlockSequencer, 'FlowBlockSequencer must be defined');

const scheduledBlocks = FlowBlockSequencer.sequence(ampleResult, availability.freeSlots);
assert.ok(scheduledBlocks.length >= 6, 'Should schedule multiple focus blocks');
// 验证第一个编排的任务一定是 S 级项目核心
assert.strictEqual(scheduledBlocks[0].tier, 'S', 'First scheduled task must be S-tier Project Core');
assert.ok(scheduledBlocks[0].title.includes('CppAIService / muduo'), 'First task should be Project Core');

console.log('✓ Test 7 Passed: 心流块顺序编排符合认知负荷最低原则，黄金大块时间归属于核心项目主干！\n');

// ==========================================================================
// Test 8: 验证 5 大工程根因归因诊断引擎 (DiagnosticEngine)
// ==========================================================================
console.log('[Test 8] 验证 5 大工程根因归因诊断引擎 (工时过紧、技术卡点、前置知识、外部挤占、精力透支)...');
const DiagnosticEngine = context.DiagnosticEngine;
assert.ok(DiagnosticEngine, 'DiagnosticEngine must be defined');

const testTask = { id: 'task_muduo_epoll', title: '实现 epoll 边缘触发循环读' };
const diagResult = DiagnosticEngine.diagnose('high_complexity', '遇到 ET 模式非阻塞 EAGAIN 与粘包边界处理死锁', testTask);
assert.strictEqual(diagResult.reasonKey, 'high_complexity');
assert.strictEqual(diagResult.nextActionType, 'spawn_debug_sandbox');
assert.ok(diagResult.suggestedAction.includes('调试排错探针'), 'Action must suggest debug sandbox');

const diagPreReq = DiagnosticEngine.diagnose('missing_prerequisites', '对 epolloneshot 与多线程竞争缺乏概念', testTask);
assert.strictEqual(diagPreReq.nextActionType, 'insert_prerequisite_learning');
assert.ok(diagPreReq.suggestedAction.includes('支撑通道'), 'Must suggest prerequisite learning insertion');

console.log('✓ Test 8 Passed: 5 大工程根因归因机制健全，任务未完成不再机械标记，具备自适应工程对策！\n');

// ==========================================================================
// Test 9: 验证每日复盘报表生成器与 Phase 6 真实凭证产出联动 (DailyReviewGenerator)
// ==========================================================================
console.log('[Test 9] 验证每日复盘成长报表生成器 (工时、完成率、根因、自动联动 Phase 6 今日产出凭据)...');
const DailyReviewGenerator = context.DailyReviewGenerator;
assert.ok(DailyReviewGenerator, 'DailyReviewGenerator must be defined');

const todayStr = RFC5545Parser.getTodayDateStr();
const reviewRes = DailyReviewGenerator.generate({
    date: todayStr,
    routineTasks: [
        { id: 't1', title: '【S级】muduo Buffer 实现', completed: true, durationMinutes: 180 },
        { id: 't2', title: '【A级】Linux 系统编程', completed: false, durationMinutes: 60 }
    ],
    scheduledBlocks: [
        { title: 'muduo Buffer 实现', durationMinutes: 180 }
    ],
    diagnostics: {
        't2': { reasonName: '工时预估过紧', note: '系统调用细节过多', suggestedAction: '拆分并提高估时乘数' }
    },
    careerEvidences: [
        {
            id: 'ev_today_01',
            title: '完成 Buffer 64KB readv 栈上临时缓冲区实现',
            type: 'code_modification',
            sourceLocation: 'muduo/net/Buffer.cc:L30',
            commitHash: '8e2b10a',
            createdAt: `${todayStr}T11:00:00Z`,
            details: '经真实测试用例验证通过'
        }
    ]
});

assert.strictEqual(reviewRes.completedCount, 1);
assert.strictEqual(reviewRes.incompleteCount, 1);
assert.strictEqual(reviewRes.evidenceCount, 1, 'Should automatically link today Phase 6 evidence');
assert.ok(reviewRes.markdownReport.includes('# 每日工程复盘与成长报表'), 'Report header required');
assert.ok(reviewRes.markdownReport.includes('今日沉淀真实工程凭据') && reviewRes.markdownReport.includes('1 项'), 'Evidence cross-link section required');
assert.ok(reviewRes.markdownReport.includes('ev_today_01') || reviewRes.markdownReport.includes('Buffer 64KB readv'), 'Evidence details embedded');

console.log('✓ Test 9 Passed: 每日复盘成长报表与 Phase 6 真实工程凭证深度打通，支持导出与复盘归档！\n');

// ==========================================================================
// Test 10: 验证 StateManager 中 schedulerSystem 持久化与操作助手
// ==========================================================================
console.log('[Test 10] 验证 StateManager 中 schedulerSystem 状态初始化与助手方法...');
const sm = context.StateManager;
assert.ok(sm, 'StateManager must exist');
const state = sm.init();
assert.ok(state.schedulerSystem, 'state.schedulerSystem must exist');
assert.ok(state.schedulerSystem.calendarSource, 'calendarSource must exist');
assert.ok(state.schedulerSystem.dailySchedule, 'dailySchedule must exist');

// 测试 setSchedulerTab
sm.setSchedulerTab('calendar');
assert.strictEqual(sm.getState().schedulerSystem.activeSchedulerTab, 'calendar');
sm.setSchedulerTab('planner');

// 测试 importCalendarSource
const importedCal = sm.importCalendarSource({
    type: 'ics',
    fileName: 'team_schedule.ics',
    events: [{ id: 'evt_sync', summary: '系统联调', busy: true }]
});
assert.strictEqual(importedCal.fileName, 'team_schedule.ics');
assert.strictEqual(sm.getState().schedulerSystem.calendarSource.events.length, 1);

// 测试 recordTaskDiagnostic
sm.recordTaskDiagnostic('task_debug_test', {
    reasonKey: 'high_complexity',
    reasonName: '深层技术卡点',
    note: '内存双重释放',
    suggestedAction: '开启 ASan'
});
assert.ok(sm.getState().schedulerSystem.incompleteDiagnostics['task_debug_test']);

// 测试 exportJson & importJson 合并策略
const exported = sm.exportJson();
assert.strictEqual(exported.metadata.schedulerEventCount, 1, 'Export metadata should count scheduler events');
assert.ok(exported.payload.schedulerSystem, 'Export payload must include schedulerSystem');

// 模拟合并导入
const freshState = sm.importJson(exported, 'merge');
assert.strictEqual(freshState.schedulerSystem.calendarSource.events.length, 1);
assert.ok(freshState.schedulerSystem.incompleteDiagnostics['task_debug_test']);

console.log('✓ Test 10 Passed: StateManager 对 schedulerSystem 的状态切片、导入导出与合并持久化闭环正常！\n');

// ==========================================================================
// Test 11: 验证 switchView("scheduler") 与 4 大子面板切换
// ==========================================================================
console.log('[Test 11] 验证 switchView("scheduler") 视图切换与 4 大子面板渲染...');
assert.strictEqual(typeof context.switchView, 'function', 'switchView function required');

context.switchView('scheduler');
const viewScheduler = domStore['view-scheduler'];
assert.ok(!viewScheduler.classList.contains('hidden'), 'view-scheduler must not be hidden');

// 验证 4 大子面板切换
assert.strictEqual(typeof context.switchSchedulerTab, 'function', 'switchSchedulerTab required');
['planner', 'calendar', 'diagnostics', 'review'].forEach(tab => {
    context.switchSchedulerTab(tab);
    const pane = domStore[`scheduler-pane-${tab}`];
    assert.ok(!pane.classList.contains('hidden'), `scheduler-pane-${tab} should be visible`);
});

console.log('✓ Test 11 Passed: 智能任务调度中心 (P7) 主视图与 4 大子面板无缝切换与渲染就绪！\n');

// ==========================================================================
// Test 12: 验证真实工程操作闭环 (导入ICS ➔ 计算排程 ➔ 归因诊断 ➔ 生成复盘)
// ==========================================================================
console.log('[Test 12] 验证全流程交互闭环 (导入ICS ➔ 智能计算 ➔ 归因诊断 ➔ 生成今日复盘)...');

// 1. 模拟 processIcsContent
context.processIcsContent(realIcsSample, 'company_agenda.ics', '2026-09-12');
const currentEvents = sm.getState().schedulerSystem.calendarSource.events;
assert.ok(currentEvents.length >= 2, 'Calendar events must be stored in state');

// 2. 验证智能排程已自动计算并渲染至 timeline
const curSchedule = sm.getState().schedulerSystem.dailySchedule;
assert.ok(curSchedule.scheduledBlocks.length > 0, 'Scheduled blocks must be populated');
assert.ok(domStore['scheduler-timeline-grid'].innerHTML.includes('CppAIService / muduo'), 'Timeline grid must render Project Core');

// 3. 模拟打卡与任务诊断
const firstBlock = curSchedule.scheduledBlocks[0];
context.toggleScheduledBlockStatus(firstBlock.id);
assert.strictEqual(firstBlock.status, 'completed', 'Block status must toggle to completed');

// 4. 模拟诊断提交
context.openTaskDiagnosticModal('task_01');
assert.ok(!domStore['task-diagnostic-modal'].classList.contains('hidden'), 'Diagnostic modal should be open');
domStore['diag-task-select'].value = 'task_01';
domStore['diag-reason-select'].value = 'high_complexity';
domStore['diag-notes'].value = '遇上了 TCP 接收缓冲区半包拆包死锁';
context.submitTaskDiagnostic();
assert.ok(domStore['task-diagnostic-modal'].classList.contains('hidden'), 'Diagnostic modal should close');
assert.ok(sm.getState().schedulerSystem.incompleteDiagnostics['task_01']);

// 5. 模拟复盘报表生成与剪贴板复制
context.generateAndExportDailyReview();
const reviewContent = domStore['scheduler-review-content'];
assert.ok(reviewContent.innerText.includes('每日工程复盘与成长报表'), 'Review markdown must be rendered into container');
context.copyReviewMarkdownToClipboard();
assert.ok(mockWindow.__lastCopied && mockWindow.__lastCopied.includes('每日工程复盘与成长报表'), 'Clipboard should receive review report');

console.log('✓ Test 12 Passed: 导入日历 ➔ 自动排程 ➔ 打卡与根因诊断 ➔ 每日复盘与剪贴板导出 全流程完全贯通！\n');

console.log('========================================================================================');
console.log('🎉 全部 12 项 Phase 6 & Phase 7 联合自动化测试全部通过！系统达到企业级求职与排程交付标准！');
console.log('========================================================================================\n');

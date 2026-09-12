const assert = require('assert');
const path = require('path');
const fs = require('fs');
const vm = require('vm');

console.log('=== [P2 Automated Test Suite: Domain Model & State Architecture] ===\n');

// 1. 测试领域模型加载与引用完整性
console.log('Test 1: Testing Domain Model (dataset-domain.js)...');
const domainPath = path.resolve(__dirname, '../js/dataset-domain.js');
const domainCode = fs.readFileSync(domainPath, 'utf8');
vm.runInThisContext(domainCode);

assert.ok(Array.isArray(globalThis.DOMAIN_PROJECTS), 'DOMAIN_PROJECTS should be an array');
assert.strictEqual(globalThis.DOMAIN_PROJECTS.length, 2, 'Should have exactly 2 core projects');
const projectIds = new Set(globalThis.DOMAIN_PROJECTS.map(p => p.id));
assert.ok(projectIds.has('proj_muduo'), 'Must contain proj_muduo');
assert.ok(projectIds.has('proj_cppai'), 'Must contain proj_cppai');

assert.ok(Array.isArray(globalThis.DOMAIN_MODULES), 'DOMAIN_MODULES should be an array');
assert.strictEqual(globalThis.DOMAIN_MODULES.length, 23, 'Should have 23 domain modules (10 muduo + 13 CppAI)');

// 验证每个模块的项目引用完整性
globalThis.DOMAIN_MODULES.forEach(mod => {
  assert.ok(projectIds.has(mod.projectId), `Module ${mod.id} has invalid projectId: ${mod.projectId}`);
  assert.ok(mod.name, `Module ${mod.id} must have a name`);
  assert.ok(Array.isArray(mod.sourceFiles), `Module ${mod.id} sourceFiles must be an array`);
});

// 验证知识网引用完整性
const moduleIds = new Set(globalThis.DOMAIN_MODULES.map(m => m.id));
assert.ok(Array.isArray(globalThis.DOMAIN_KNOWLEDGE_NODES), 'DOMAIN_KNOWLEDGE_NODES should be an array');
globalThis.DOMAIN_KNOWLEDGE_NODES.forEach(kn => {
  assert.ok(moduleIds.has(kn.moduleId), `Knowledge node ${kn.id} references non-existent module: ${kn.moduleId}`);
});

// 验证避坑档案完整性
assert.ok(Array.isArray(globalThis.DOMAIN_PITFALLS_CATALOG), 'DOMAIN_PITFALLS_CATALOG should be an array');
assert.ok(globalThis.DOMAIN_PITFALLS_CATALOG.length >= 4, 'Should have at least 4 catalog pitfalls');
console.log('✓ Test 1 Passed: Domain models and relational integrity verified!\n');


// 2. 测试 LocalStorage 模拟环境下的 SchemaMigrationV6 与冷备份
console.log('Test 2: Testing SchemaMigrationV6 with Cold Backup...');
// 构造内存 LocalStorage 模拟器
const mockStorage = {};
globalThis.localStorage = {
  getItem(k) { return mockStorage[k] !== undefined ? mockStorage[k] : null; },
  setItem(k, v) { mockStorage[k] = String(v); },
  removeItem(k) { delete mockStorage[k]; },
  clear() { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

// 注入模拟历史用户数据 (V5 + 遗留 V4 + CppAIService 语雀数据)
const mockV5Data = {
  version: "5.0.0",
  completedDays: [1, 2, 3, 5, 8],
  mastery: {
    "1": { level: 4, score: 95, read: true, demo: true },
    "2": { level: 5, score: 100, read: true, demo: true },
    "3": { level: 3, score: 80, read: true, demo: true }
  },
  dayNotes: {
    "1": "Day 1 跑通环境，非阻塞 I/O 印象深刻",
    "2": "Day 2 Channel 与 epoll_event 映射细节"
  },
  experimentNotes: {
    "1": "strace 输出 42 次系统调用"
  },
  globalNotes: "全局工程复盘手记：坚持攻坚双核！",
  pitfalls: [
    { id: "custom_p1", title: "本地调试内存泄漏", errorSymptom: "Valgrind 报错", conclusion: "注意智能指针环形引用" }
  ]
};
mockStorage['muduo_v5_data'] = JSON.stringify(mockV5Data);
mockStorage['cppai_knowledge_mastery'] = JSON.stringify({
  "01_http_overview": 4,
  "02_http_parser": 5,
  "12_mcp_twostage_reasoning": 3
});
mockStorage['cppai_knowledge_favs'] = JSON.stringify(["01_http_overview", "12_mcp_twostage_reasoning"]);
mockStorage['cppai_knowledge_recent'] = JSON.stringify(["12_mcp_twostage_reasoning"]);

// 加载 state-manager.js
const stateManagerPath = path.resolve(__dirname, '../js/state-manager.js');
const stateManagerCode = fs.readFileSync(stateManagerPath, 'utf8');
vm.runInThisContext(stateManagerCode);

const { StateManager, SchemaMigrationV6, STORAGE_KEYS } = globalThis;

// 执行初始化迁移
const state = StateManager.init();

// 断言 1: 必须生成冷备份
assert.ok(mockStorage[STORAGE_KEYS.V6_COLD_BACKUP], 'Cold backup must be created before migration');
const backupObj = JSON.parse(mockStorage[STORAGE_KEYS.V6_COLD_BACKUP]);
assert.ok(backupObj.data.v5Data, 'Cold backup must contain raw v5 data');
assert.strictEqual(backupObj.reason, 'Automatic cold backup prior to SchemaMigrationV6');

// 断言 2: V6 状态必须 100% 完整继承 V5 和 CppAI 数据 (零数据丢失)
assert.strictEqual(state.version, '6.0.0', 'State version must be 6.0.0');
assert.deepStrictEqual(state.completedDays, [1, 2, 3, 5, 8], 'completedDays must be perfectly inherited');
assert.strictEqual(state.mastery["1"].level, 4, 'Day 1 mastery level must be preserved');
assert.strictEqual(state.mastery["2"].level, 5, 'Day 2 mastery level must be preserved');
assert.strictEqual(state.dayNotes["1"], "Day 1 跑通环境，非阻塞 I/O 印象深刻");
assert.strictEqual(state.experimentNotes["1"], "strace 输出 42 次系统调用");
assert.strictEqual(state.globalNotes, "全局工程复盘手记：坚持攻坚双核！");
assert.strictEqual(state.knowledgeMastery["01_http_overview"], 4, 'CppAI mastery must be merged into state');
assert.strictEqual(state.knowledgeMastery["12_mcp_twostage_reasoning"], 3);
assert.deepStrictEqual(state.knowledgeFavorites, ["01_http_overview", "12_mcp_twostage_reasoning"]);
assert.deepStrictEqual(state.knowledgeRecent, ["12_mcp_twostage_reasoning"]);

// 断言 3: 双向镜像回写
assert.ok(mockStorage[STORAGE_KEYS.V6_DATA], 'muduo_v6_data must be saved');
assert.ok(mockStorage[STORAGE_KEYS.V5_DATA], 'muduo_v5_data must be mirrored');
assert.ok(mockStorage[STORAGE_KEYS.CPPAI_MASTERY], 'cppai_knowledge_mastery must be mirrored');
console.log('✓ Test 2 Passed: SchemaMigrationV6 non-destructive migration & cold backup verified!\n');


// 3. 测试备份导出与自适应导入策略 (Merge vs Overwrite)
console.log('Test 3: Testing Export and Import Roundtrip...');
const exportedJson = StateManager.exportJson();
assert.strictEqual(exportedJson.version, '6.0.0');
assert.strictEqual(exportedJson.metadata.completedDaysCount, 5);
assert.strictEqual(exportedJson.metadata.masteredArticlesCount, 3);

// 3.1 测试 Merge 策略
const incomingMergeData = {
  completedDays: [3, 8, 9, 10],
  mastery: {
    "1": { level: 2 }, // 传入较低等级，merge 策略应保留本地高等级 4
    "3": { level: 5 }, // 传入更高等级，merge 策略应更新为 5
    "9": { level: 4 }
  },
  knowledgeMastery: {
    "01_http_overview": 2, // 较低，保留本地 4
    "03_http_router": 4    // 新增
  },
  knowledgeFavorites: ["03_http_router"]
};

StateManager.importJson(incomingMergeData, 'merge');
const mergedState = StateManager.getState();
assert.ok(mergedState.completedDays.includes(9) && mergedState.completedDays.includes(10), 'New days should be added');
assert.strictEqual(mergedState.completedDays.length, 7, 'Completed days should be unioned');
assert.strictEqual(mergedState.mastery["1"].level, 4, 'Higher level 4 should be retained over incoming 2');
assert.strictEqual(mergedState.mastery["3"].level, 5, 'Level should upgrade to incoming 5');
assert.strictEqual(mergedState.knowledgeMastery["01_http_overview"], 4, 'CppAI mastery should retain higher level');
assert.strictEqual(mergedState.knowledgeMastery["03_http_router"], 4, 'New CppAI mastery should be added');
assert.ok(mergedState.knowledgeFavorites.includes("03_http_router"));
assert.ok(mergedState.knowledgeFavorites.includes("01_http_overview"));

// 3.2 测试 Overwrite 策略
const incomingOverwrite = {
  completedDays: [28],
  mastery: { "28": { level: 5 } },
  knowledgeMastery: { "17_speech_synthesis": 5 }
};
StateManager.importJson(incomingOverwrite, 'overwrite');
const overwroteState = StateManager.getState();
assert.deepStrictEqual(overwroteState.completedDays, [28], 'Completed days should be completely replaced');
assert.strictEqual(overwroteState.mastery["28"].level, 5);
assert.strictEqual(overwroteState.mastery["1"], undefined, 'Previous day 1 should be gone under overwrite');
assert.strictEqual(overwroteState.knowledgeMastery["17_speech_synthesis"], 5);
assert.strictEqual(overwroteState.knowledgeMastery["01_http_overview"], undefined);

console.log('✓ Test 3 Passed: JSON export and import (merge/overwrite) verified!\n');


// 4. 测试冷备份保底恢复通道 (restoreColdBackup)
console.log('Test 4: Testing restoreColdBackup rescue mechanism...');
const restored = StateManager.restoreColdBackup();
assert.strictEqual(restored.version, '6.0.0');
assert.deepStrictEqual(restored.completedDays, [1, 2, 3, 5, 8], 'Original pre-migration data must be accurately restored');
assert.strictEqual(restored.mastery["1"].level, 4);
assert.strictEqual(restored.knowledgeMastery["01_http_overview"], 4);
console.log('✓ Test 4 Passed: Cold backup restoration successfully rolled back to pre-migration baseline!\n');

console.log('🎉 ALL P2 AUTOMATED TESTS PASSED WITH 100% SUCCESS!');

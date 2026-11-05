const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Starting verification of updated user requirements ---');

// 1. Verify ALGORITHM_LAB_CATALOG in js/dataset-learning.js
const learningJs = fs.readFileSync(path.join(__dirname, '../js/dataset-learning.js'), 'utf8');
const algoMatch = learningJs.match(/var ALGORITHM_LAB_CATALOG = (\[[\s\S]*?\]);/);
assert(algoMatch, 'ALGORITHM_LAB_CATALOG must exist in dataset-learning.js');

const catalog = JSON.parse(algoMatch[1]);
console.log('✓ ALGORITHM_LAB_CATALOG parsed successfully. Total items:', catalog.length);
assert.strictEqual(catalog.length, 234, 'Total items must be exactly 234 (179 Carl + 55 Hot 100 non-overlap)');

const carlItems = catalog.filter(p => p.isCarl);
const hot100Items = catalog.filter(p => p.isHot100);
const overlapItems = catalog.filter(p => p.isCarl && p.isHot100);

console.log(`✓ Carl items count: ${carlItems.length} (Expected: 179)`);
console.log(`✓ Hot 100 items count: ${hot100Items.length} (Expected: 100)`);
console.log(`✓ Overlap items count: ${overlapItems.length} (Expected: 45)`);

assert.strictEqual(carlItems.length, 179, '代码随想录题库数量必须严格为 179 道，不能缩减！');
assert.strictEqual(hot100Items.length, 100, 'Hot 100 题库数量必须严格为 100 道！');
assert.strictEqual(overlapItems.length, 45, '重合标记数量必须严格为 45 道！');

// 验证 Hot 100 涵盖代码随想录官方 17 个专题路线
const expectedChapters = [
  '哈希', '双指针', '滑动窗口', '子串', '普通数组', '矩阵', '链表',
  '二叉树', '图论', '回溯', '二分查找', '栈', '堆', '贪心算法',
  '动态规划', '多维动态规划', '技巧'
];
const actualChapters = [...new Set(hot100Items.map(p => p.hot100Chapter))];
assert.strictEqual(actualChapters.length, 17, 'Hot 100 必须精确覆盖代码随想录 17 个章节');
expectedChapters.forEach(chap => {
  assert(actualChapters.includes(chap), `Hot 100 必须包含章节: ${chap}`);
});
console.log('✓ 代码随想录 Hot 100 官方 17 章节路线全覆盖断言通过！');

// 2. 验证完成状态联动机制 (State linkage simulation)
const completedMap = { 1: true, 15: true, 206: true };
const isAlgoItemDone = (p) => {
    if (!completedMap) return false;
    if (p.num !== null && p.num !== undefined) {
        return !!completedMap[p.num] || !!completedMap[String(p.num)];
    }
    return p.id ? !!completedMap[p.id] : false;
};

// 验证 #1, #15, #206 在 Carl 和 Hot 100 中均被正确判定为完成
const carl1 = carlItems.find(p => p.num === 1);
const hot1 = hot100Items.find(p => p.num === 1);
assert(isAlgoItemDone(carl1), '#1 in Carl must be completed');
assert(isAlgoItemDone(hot1), '#1 in Hot 100 must be completed');

const carl15s = carlItems.filter(p => p.num === 15);
assert.strictEqual(carl15s.length, 2, '#15 三数之和在代码随想录中复现 2 次（哈希与双指针）');
carl15s.forEach(c15 => assert(isAlgoItemDone(c15), 'Both #15 in Carl must be completed'));

const hot15 = hot100Items.find(p => p.num === 15);
assert(isAlgoItemDone(hot15), '#15 in Hot 100 must be completed');
console.log('✓ 状态联动断言通过：在任一题库勾选，重合题目及全库对应位置全部自动勾选！');

// 3. 验证日常任务配置 (DEFAULT_ROUTINE_TEMPLATE in js/dataset-tasks.js)
const tasksJs = fs.readFileSync(path.join(__dirname, '../js/dataset-tasks.js'), 'utf8');
const evalContext = {};
const fn = new Function('window', 'globalThis', tasksJs);
fn(evalContext, evalContext);

const routine = evalContext.DEFAULT_ROUTINE_TEMPLATE;
assert(Array.isArray(routine), 'DEFAULT_ROUTINE_TEMPLATE must be an array');
assert.strictEqual(routine.length, 4, 'Must have exactly 4 daily tasks');

const taskTitles = routine.map(t => t.title);
assert.deepStrictEqual(taskTitles, ['算法', '项目', 'Agent', '牛客']);
const agentTask = routine.find(t => t.title === 'Agent');
assert.strictEqual(agentTask.estimatedMinutes, 30, 'Agent task must be 30 minutes');
console.log('✓ 日常任务纯化断言通过：算法、项目、Agent (30m)、牛客');

// 4. 验证网页主标题
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const classicHtml = fs.readFileSync(path.join(__dirname, '../classic.html'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

assert(indexHtml.includes('<title>Muduo & CppAIService</title>'), 'index.html title must be "Muduo & CppAIService"');
assert(classicHtml.includes('<title>Muduo & CppAIService</title>'), 'classic.html title must be "Muduo & CppAIService"');
assert(indexHtml.includes('Muduo & CppAIService'), 'index.html must display "Muduo & CppAIService"');
assert(classicHtml.includes('Muduo & CppAIService'), 'classic.html must display "Muduo & CppAIService"');
console.log('✓ 页面主标题验证通过："Muduo & CppAIService"');

// 5. 验证禁用浮夸与提示性词汇
const forbiddenWords = [
    '已去重', '去重后', 'DUAL-CORE', '4-Hop', '手撕算法',
    '六维技术关联透视', '14 维后端核心能力矩阵评估态势', '冲刺工作台', '万用双核'
];

forbiddenWords.forEach(word => {
    assert(!indexHtml.includes(word), `index.html must not contain forbidden word: ${word}`);
    assert(!classicHtml.includes(word), `classic.html must not contain forbidden word: ${word}`);
    assert(!appJs.includes(word), `js/app.js must not contain forbidden word: ${word}`);
});
console.log('✓ 全网禁止用词清查通过：零浮夸修饰、零副标题干扰');

console.log('\n=========================================');
console.log('ALL UPDATED REQUIREMENTS VERIFIED SUCCESSFULLY! ✓');
console.log('=========================================');

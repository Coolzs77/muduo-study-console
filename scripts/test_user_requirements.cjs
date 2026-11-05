const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Starting verification of user requirements ---');

// 1. Verify ALGORITHM_LAB_CATALOG in js/dataset-learning.js
const learningJs = fs.readFileSync(path.join(__dirname, '../js/dataset-learning.js'), 'utf8');
const algoMatch = learningJs.match(/var ALGORITHM_LAB_CATALOG = (\[[\s\S]*?\]);/);
assert(algoMatch, 'ALGORITHM_LAB_CATALOG must exist in dataset-learning.js');

const catalog = JSON.parse(algoMatch[1]);
console.log('✓ ALGORITHM_LAB_CATALOG parsed successfully. Total items:', catalog.length);
assert.strictEqual(catalog.length, 204, 'Total questions must be exactly 204');

// Check unique problem identification (no duplicates)
const keySet = new Set();
catalog.forEach(p => {
    const key = (p.num !== null && p.num !== undefined) ? `num_${p.num}` : p.id;
    assert(!keySet.has(key), `Duplicate problem found: ${key} (${p.title})`);
    keySet.add(key);
});
console.log('✓ Unique problems verified: 204/204 unique, 0 duplicates');

const hot100Count = catalog.filter(p => p.isHot100).length;
const carlCount = catalog.filter(p => p.isCarl).length;
const overlapCount = catalog.filter(p => p.isHot100 && p.isCarl).length;

console.log(`✓ Hot 100 count: ${hot100Count} (Expected: 100)`);
console.log(`✓ Carl count: ${carlCount} (Expected: 150)`);
console.log(`✓ Overlap count: ${overlapCount} (Expected: 46)`);
assert.strictEqual(hot100Count, 100, 'Hot 100 must have 100 problems');
assert.strictEqual(carlCount, 150, 'Carl must have 150 unique problems');
assert.strictEqual(overlapCount, 46, 'Overlap must be 46 problems');

// 2. Verify DEFAULT_ROUTINE_TEMPLATE in js/dataset-tasks.js
const tasksJs = fs.readFileSync(path.join(__dirname, '../js/dataset-tasks.js'), 'utf8');
const evalContext = {};
const fn = new Function('window', 'globalThis', tasksJs);
fn(evalContext, evalContext);

const routine = evalContext.DEFAULT_ROUTINE_TEMPLATE;
assert(Array.isArray(routine), 'DEFAULT_ROUTINE_TEMPLATE must be an array');
console.log('✓ Daily routine task count:', routine.length);
assert.strictEqual(routine.length, 4, 'Must have exactly 4 daily tasks');

const taskTitles = routine.map(t => t.title);
console.log('✓ Daily task titles:', taskTitles.join(', '));
assert.deepStrictEqual(taskTitles, ['算法', '项目', 'Agent', '牛客']);

const agentTask = routine.find(t => t.title === 'Agent');
assert.strictEqual(agentTask.estimatedMinutes, 30, 'Agent task must be 30 minutes');
console.log('✓ Agent task is configured for 30 minutes');

routine.forEach(t => {
    assert.strictEqual(t.subtitle, '', `Task ${t.title} subtitle must be empty`);
});
console.log('✓ All task subtitles are empty (no rigid time intervals or hype)');

// 3. Verify clean title and forbidden keywords
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const classicHtml = fs.readFileSync(path.join(__dirname, '../classic.html'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

assert(indexHtml.includes('<title>C++ 与算法</title>'), 'index.html title must be "C++ 与算法"');
assert(classicHtml.includes('<title>C++ 与算法</title>'), 'classic.html title must be "C++ 与算法"');
console.log('✓ Page titles are pure: "C++ 与算法"');

const forbiddenWords = ['已去重', '去重后', 'DUAL-CORE', '4-Hop', '冲刺工作台', '万用双核'];
forbiddenWords.forEach(word => {
    assert(!indexHtml.includes(word), `index.html must not contain forbidden word: ${word}`);
    assert(!appJs.includes(word), `js/app.js must not contain forbidden word: ${word}`);
});
console.log('✓ Zero occurrences of forbidden hype/hint words');

console.log('\n=========================================');
console.log('ALL USER REQUIREMENT ASSERTIONS PASSED! ✓');
console.log('=========================================');

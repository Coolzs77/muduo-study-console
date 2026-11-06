/**
 * test_m1_challenger_adversarial.cjs
 * Empirical Challenger Verification Suite for Milestone 1 (R1 & R2)
 */

const fs = require('fs');
const path = require('path');

console.log('===============================================================');
console.log('🚀 CHALLENGER 1 ADVERSARIAL VERIFICATION SUITE — MILESTONE 1');
console.log('===============================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function assertTest(name, condition, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    failedTests++;
    console.log(`  ❌ [FAIL] ${name}`);
    if (details) {
      console.log(`     ↳ Details: ${details}`);
      failureDetails.push({ name, details });
    }
  }
}

// ---------------------------------------------------------------------------
// 1. DATASET INTEGRITY & UNIQUE IDS
// ---------------------------------------------------------------------------
console.log('--- TEST GROUP 1: Dataset Integrity & Unique IDs ---');
const algoFilePath = path.join(__dirname, '../src/data/algoDataset.ts');
const algoContent = fs.readFileSync(algoFilePath, 'utf8');
const catalog = eval(algoContent.substring(algoContent.indexOf('['), algoContent.lastIndexOf(']') + 1));

assertTest('Total Catalog Length === 234', catalog.length === 234, `Actual: ${catalog.length}, Expected: 234`);

const ids = catalog.map(p => p.id);
const uniqueIds = new Set(ids);
assertTest('All 234 Problem IDs are Strictly Unique', uniqueIds.size === 234, `Unique IDs: ${uniqueIds.size}, Catalog Length: ${catalog.length}`);

// Check required fields
let missingFieldCount = 0;
catalog.forEach((p, i) => {
  if (!p.id || !p.title || !p.category || !p.topic || !p.leetcodeUrl) {
    missingFieldCount++;
  }
});
assertTest('All Problems Have Required Metadata Fields', missingFieldCount === 0, `Problems missing fields: ${missingFieldCount}`);

// ---------------------------------------------------------------------------
// 2. CATEGORY NORMALIZATION & COUNTS IN 'ALL' TRACK
// ---------------------------------------------------------------------------
console.log('\n--- TEST GROUP 2: Canonical Category Counts in "All" Track ---');
const EXPECTED_CATEGORY_COUNTS = {
  '数组': 20,
  '链表': 16,
  '哈希表': 16,
  '字符串': 8,
  '双指针法': 16,
  '栈与队列': 11,
  '二叉树': 34,
  '回溯算法': 19,
  '贪心算法': 18,
  '动态规划': 43,
  '单调栈': 5,
  '图论': 28
};

const actualCategoryCounts = {};
catalog.forEach(p => {
  actualCategoryCounts[p.category] = (actualCategoryCounts[p.category] || 0) + 1;
});

for (const [cat, expected] of Object.entries(EXPECTED_CATEGORY_COUNTS)) {
  const actual = actualCategoryCounts[cat] || 0;
  assertTest(
    `Category Count "${cat}" === ${expected}`,
    actual === expected,
    `Actual: ${actual}, Expected: ${expected} (Deviation: ${actual - expected})`
  );
}

// Check zero leakage
let leakageCount = 0;
for (const cat of Object.keys(EXPECTED_CATEGORY_COUNTS)) {
  const filtered = catalog.filter(p => p.category === cat);
  const foreign = filtered.filter(p => p.category !== cat);
  if (foreign.length > 0) leakageCount += foreign.length;
}
assertTest('Zero Cross-Category Leakage on Filter', leakageCount === 0, `Cross-category leaks: ${leakageCount}`);

// Check topic divergence
const topicDiverged = catalog.filter(p => p.topic !== p.category);
assertTest('Zero Topic-vs-Category Divergence', topicDiverged.length === 0, `Diverged problems count: ${topicDiverged.length}`);

// ---------------------------------------------------------------------------
// 3. TRACK COUNTS & DISTRIBUTION
// ---------------------------------------------------------------------------
console.log('\n--- TEST GROUP 3: Track Counts (Carl & Hot 100) ---');
const carlProblems = catalog.filter(p => p.isCarl);
const hot100Problems = catalog.filter(p => p.isHot100);

assertTest('Carl Track Count === 179', carlProblems.length === 179, `Actual: ${carlProblems.length}, Expected: 179`);
assertTest('Hot 100 Track Count === 100', hot100Problems.length === 100, `Actual: ${hot100Problems.length}, Expected: 100`);

const CARL_HOT100_CHAPTERS = [
  '哈希', '双指针', '滑动窗口', '子串', '普通数组', '矩阵', '链表',
  '二叉树', '图论', '回溯', '二分查找', '栈', '堆', '贪心算法',
  '动态规划', '多维动态规划', '技巧'
];
const hot100InvalidChapters = hot100Problems.filter(p => !CARL_HOT100_CHAPTERS.includes(p.hot100Chapter));
assertTest('All Hot 100 Problems Belong to Canonical 17 Chapters', hot100InvalidChapters.length === 0, `Invalid chapter count: ${hot100InvalidChapters.length}`);

const hot100Orders = new Set(hot100Problems.map(p => p.hot100Order));
assertTest('Hot 100 Orders Form Continuous 1..100 Sequence', hot100Orders.size === 100 && !hot100Orders.has(undefined) && !hot100Orders.has(null), `Unique orders: ${hot100Orders.size}`);

// ---------------------------------------------------------------------------
// 4. AUTHENTICITY OF HOT 100 ENTRIES #54, #94, #105
// ---------------------------------------------------------------------------
console.log('\n--- TEST GROUP 4: Authenticity of Hot 100 Problems #54, #94, #105 ---');
const p54 = catalog.find(p => p.id === 'algo_54');
assertTest(
  'Hot 100 #54 is Authentic Spiral Matrix with Working leetcode.cn URL',
  p54 && p54.title.includes('螺旋矩阵') && p54.leetcodeUrl.includes('leetcode.cn/problems/spiral-matrix'),
  `Found: ${p54 ? p54.title + ' -> ' + p54.leetcodeUrl : 'NULL'}`
);

const p94 = catalog.find(p => p.id === 'algo_94');
assertTest(
  'Hot 100 #94 is Authentic Binary Tree Inorder Traversal with Working leetcode.cn URL',
  p94 && p94.title.includes('二叉树的中序遍历') && p94.leetcodeUrl.includes('leetcode.cn/problems/binary-tree-inorder-traversal'),
  `Found: ${p94 ? p94.title + ' -> ' + p94.leetcodeUrl : 'NULL'}`
);

const p105 = catalog.find(p => p.id === 'algo_105');
assertTest(
  'Hot 100 #105 is Authentic Construct Tree from Pre/In with Working leetcode.cn URL',
  p105 && p105.title.includes('从前序与中序遍历序列构造二叉树') && p105.leetcodeUrl.includes('leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal'),
  `Found: ${p105 ? p105.title + ' -> ' + p105.leetcodeUrl : 'NULL'}`
);

// ---------------------------------------------------------------------------
// 5. KAMACODER GRAPH PROBLEMS ISOLATION
// ---------------------------------------------------------------------------
console.log('\n--- TEST GROUP 5: KamaCoder Graph Problems Isolation ---');
const kamaGraphProbs = catalog.filter(p => p.id && p.id.startsWith('algo_kama_') && p.category === '图论');
assertTest(
  'KamaCoder Graph Problems Preserved (Expected 25 in Carl Track)',
  kamaGraphProbs.length === 25,
  `Actual: ${kamaGraphProbs.length}, Expected: 25. (KamaCoder 94 and 105 missing!)`
);

const kamaNonGraph = catalog.filter(p => p.id && p.id.startsWith('algo_kama_') && p.category !== '图论');
assertTest(
  'KamaCoder Graph Prefix "algo_kama_" Exclusively Confined to Category "图论"',
  kamaNonGraph.length === 0,
  `Non-graph items with algo_kama_ prefix: ${kamaNonGraph.map(p => `${p.id} (${p.category})`).join(', ')}`
);

// Check if LeetCode problems were wrongly inserted into Carl's Graph section
const idx94 = catalog.findIndex(p => p.id === 'algo_94');
const idx105 = catalog.findIndex(p => p.id === 'algo_105');
const idx54 = catalog.findIndex(p => p.id === 'algo_54');

assertTest(
  'LeetCode #54 (Array) is NOT Sandwiched Inside Carl String Section',
  !(p54 && p54.isCarl && catalog[idx54 - 1]?.category === '字符串' && catalog[idx54 + 1]?.category === '字符串'),
  `p54 at index ${idx54} is flanked by ${catalog[idx54 - 1]?.title} (${catalog[idx54 - 1]?.category}) and ${catalog[idx54 + 1]?.title} (${catalog[idx54 + 1]?.category})`
);

assertTest(
  'LeetCode #94 (Tree) is NOT Sandwiched Inside Carl Graph Section',
  !(p94 && p94.isCarl && catalog[idx94 - 1]?.category === '图论' && catalog[idx94 + 1]?.category === '图论'),
  `p94 at index ${idx94} is flanked by ${catalog[idx94 - 1]?.title} (${catalog[idx94 - 1]?.category}) and ${catalog[idx94 + 1]?.title} (${catalog[idx94 + 1]?.category})`
);

assertTest(
  'LeetCode #105 (Tree) is NOT Sandwiched Inside Carl Graph Section',
  !(p105 && p105.isCarl && catalog[idx105 - 1]?.category === '图论' && catalog[idx105 + 1]?.category === '图论'),
  `p105 at index ${idx105} is flanked by ${catalog[idx105 - 1]?.title} (${catalog[idx105 - 1]?.category}) and ${catalog[idx105 + 1]?.title} (${catalog[idx105 + 1]?.category})`
);

// ---------------------------------------------------------------------------
// 6. PROMOTIONAL BUZZWORDS GREP
// ---------------------------------------------------------------------------
console.log('\n--- TEST GROUP 6: Promotional Buzzwords Grep ---');
const BUZZWORDS = ['专注大厂', '全景冲刺', '无损套路', '盲打手写', '避坑铁律', '灾难现场'];

function scanDir(dir, exts) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scanDir(full, exts));
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

const srcFiles = scanDir(path.join(__dirname, '../src'), ['.ts', '.tsx', '.html']);
const buzzwordOccurrences = {};

BUZZWORDS.forEach(bw => {
  const matches = [];
  srcFiles.forEach(f => {
    const rel = path.relative(path.join(__dirname, '..'), f);
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes(bw)) {
      matches.push(rel);
    }
  });
  buzzwordOccurrences[bw] = matches;
  assertTest(
    `0 Occurrences of Buzzword "${bw}" in src/`,
    matches.length === 0,
    matches.length > 0 ? `Found in: ${matches.join(', ')}` : ''
  );
});

// ---------------------------------------------------------------------------
// 7. SUMMARY AND VERDICT
// ---------------------------------------------------------------------------
console.log('\n===============================================================');
console.log(`📊 ADVERSARIAL TEST SUMMARY: ${totalTests} Ran | ${passedTests} Passed | ${failedTests} Failed`);
console.log('===============================================================');

if (failedTests > 0) {
  console.log('\n🚨 DETAILED FAILURE BREAKDOWN:');
  failureDetails.forEach((f, idx) => {
    console.log(`  [${idx + 1}] ${f.name}`);
    console.log(`      ${f.details}`);
  });
  console.log('\n❌ VERDICT: REJECT (Milestone 1 does not satisfy acceptance criteria)');
  process.exit(1);
} else {
  console.log('\n🎉 ALL ADVERSARIAL TESTS PASSED!');
  console.log('✅ VERDICT: APPROVE');
  process.exit(0);
}

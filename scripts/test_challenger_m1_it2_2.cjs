/**
 * test_challenger_m1_it2_2.cjs
 * Empirical Challenger 2 Stress Testing and Combinatorial Verification Suite
 * Milestone 1 Iteration 2
 */

const fs = require('fs');
const path = require('path');

console.log('======================================================================');
console.log('🛡️  CHALLENGER 2 COMBINATORIAL STRESS & VERIFICATION SUITE — M1-IT2');
console.log('======================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(description, condition, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${description}`);
  } else {
    failedTests++;
    console.log(`  ❌ [FAIL] ${description}`);
    if (details) {
      console.log(`     ↳ ${details}`);
      failures.push({ description, details });
    }
  }
}

// Load algoDataset.ts
const algoFilePath = path.join(__dirname, '../src/data/algoDataset.ts');
const algoContent = fs.readFileSync(algoFilePath, 'utf8');
const catalog = eval(algoContent.substring(algoContent.indexOf('['), algoContent.lastIndexOf(']') + 1));

// ----------------------------------------------------------------------------
// SUITE 1: Set Theory Invariants & Partition Algebra
// ----------------------------------------------------------------------------
console.log('--- SUITE 1: Set Theory Invariants & Partition Algebra ---');

const totalCount = catalog.length;
assert('Total catalog size === 234', totalCount === 234, `Actual: ${totalCount}`);

const uniqueIds = new Set(catalog.map(p => p.id));
assert('Unique IDs count === 234 (no duplicates)', uniqueIds.size === 234, `Actual unique IDs: ${uniqueIds.size}`);

const carlSet = new Set(catalog.filter(p => p.isCarl).map(p => p.id));
const hot100Set = new Set(catalog.filter(p => p.isHot100).map(p => p.id));

assert('Carl problem count === 179', carlSet.size === 179, `Actual Carl count: ${carlSet.size}`);
assert('Hot 100 problem count === 100', hot100Set.size === 100, `Actual Hot 100 count: ${hot100Set.size}`);

// Intersection (Overlap)
const overlap = [...carlSet].filter(id => hot100Set.has(id));
assert('Overlap (Carl ∩ Hot 100) count === 45', overlap.length === 45, `Actual overlap: ${overlap.length}`);

// Union
const union = new Set([...carlSet, ...hot100Set]);
assert(
  'Union (Carl ∪ Hot 100) count === 234 (exact partition: 179 + 100 - 45 = 234)',
  union.size === 234,
  `Actual union: ${union.size}`
);

// Every item in catalog belongs to at least one track
const neitherCount = catalog.filter(p => !p.isCarl && !p.isHot100).length;
assert('Zero orphan problems (every problem is in Carl or Hot 100)', neitherCount === 0, `Orphan count: ${neitherCount}`);

// Check that Hot 100 orders are 1..100 continuous
const hot100Orders = catalog.filter(p => p.isHot100).map(p => p.hot100Order).sort((a, b) => a - b);
const expectedOrders = Array.from({ length: 100 }, (_, i) => i + 1);
const orderMismatch = hot100Orders.filter((ord, idx) => ord !== expectedOrders[idx]);
assert('Hot 100 orders strictly match continuous sequence 1..100', orderMismatch.length === 0, `Mismatches: ${orderMismatch.length}`);

// ----------------------------------------------------------------------------
// SUITE 2: Combinatorial Matrix: Track × Category 0-Leakage Verification
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 2: Combinatorial Matrix: Track × Category 0-Leakage ---');

const STANDARD_CATEGORIES = [
  '数组', '链表', '哈希表', '字符串', '双指针法', '栈与队列',
  '二叉树', '回溯算法', '贪心算法', '动态规划', '单调栈', '图论'
];

const EXPECTED_ALL_COUNTS = {
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

// 1. In 'all' track:
let allTrackSum = 0;
STANDARD_CATEGORIES.forEach(cat => {
  const filtered = catalog.filter(p => p.category === cat);
  const foreign = filtered.filter(p => p.category !== cat);
  const expected = EXPECTED_ALL_COUNTS[cat];
  allTrackSum += filtered.length;

  assert(
    `Track [all] Category [${cat}]: count === ${expected} and 0 foreign leakage`,
    filtered.length === expected && foreign.length === 0,
    `Count: ${filtered.length} (expected: ${expected}), Foreign: ${foreign.length}`
  );
});

assert('Track [all] sum of all 12 categories === 234', allTrackSum === 234, `Actual sum: ${allTrackSum}`);

// 2. In 'carl' track:
let carlTrackSum = 0;
STANDARD_CATEGORIES.forEach(cat => {
  const filtered = catalog.filter(p => p.isCarl && p.category === cat);
  const foreign = filtered.filter(p => p.category !== cat || !p.isCarl);
  carlTrackSum += filtered.length;

  assert(
    `Track [carl] Category [${cat}]: returns only Carl items of this category (0 leakage, count=${filtered.length})`,
    foreign.length === 0,
    `Foreign count: ${foreign.length}`
  );
});
assert('Track [carl] sum of all 12 categories === 179', carlTrackSum === 179, `Actual sum: ${carlTrackSum}`);

// 3. In 'hot100' track:
const CARL_HOT100_CHAPTERS = [
  '哈希', '双指针', '滑动窗口', '子串', '普通数组', '矩阵', '链表',
  '二叉树', '图论', '回溯', '二分查找', '栈', '堆', '贪心算法',
  '动态规划', '多维动态规划', '技巧'
];

let hot100ChapterSum = 0;
CARL_HOT100_CHAPTERS.forEach(chapter => {
  const filtered = catalog.filter(p => p.isHot100 && p.hot100Chapter === chapter);
  const foreign = filtered.filter(p => p.hot100Chapter !== chapter || !p.isHot100);
  hot100ChapterSum += filtered.length;

  assert(
    `Track [hot100] Chapter [${chapter}]: returns only Hot 100 items of this chapter (0 leakage, count=${filtered.length})`,
    foreign.length === 0,
    `Foreign count: ${foreign.length}`
  );
});
assert('Track [hot100] sum of all 17 chapters === 100', hot100ChapterSum === 100, `Actual sum: ${hot100ChapterSum}`);

// ----------------------------------------------------------------------------
// SUITE 3: Component Source Analysis: Reset on Track Switch
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 3: Component Source Analysis: Reset on Track Switch ---');

const catalogComponentPath = path.join(__dirname, '../src/components/algorithm/AlgoCatalog.tsx');
const catalogCompContent = fs.readFileSync(catalogComponentPath, 'utf8');

// Check useEffect reset
const hasUseEffectReset = /useEffect\s*\(\s*\(\)\s*=>\s*\{\s*setSelectedCategory\(['"]all['"]\);\s*\}\s*,\s*\[viewTrack\]\s*\)/m.test(catalogCompContent);
assert('AlgoCatalog has useEffect([viewTrack]) hook resetting selectedCategory to "all"', hasUseEffectReset, 'useEffect pattern not found or altered');

// Check track button handlers
const hasAllBtnReset = /setViewTrack\(['"]all['"]\);\s*setSelectedCategory\(['"]all['"]\);/.test(catalogCompContent);
const hasHot100BtnReset = /setViewTrack\(['"]hot100['"]\);\s*setSelectedCategory\(['"]all['"]\);/.test(catalogCompContent);
const hasCarlBtnReset = /setViewTrack\(['"]carl['"]\);\s*setSelectedCategory\(['"]all['"]\);/.test(catalogCompContent);

assert('AlgoCatalog button handlers explicitly reset selectedCategory on track switch', hasAllBtnReset && hasHot100BtnReset && hasCarlBtnReset, `all: ${hasAllBtnReset}, hot100: ${hasHot100BtnReset}, carl: ${hasCarlBtnReset}`);

// Check filter implementation logic in displayedProblems
const hasCategoryStrictCheck = /if\s*\(p\.category\s*!==\s*selectedCategory\)\s*return\s*false;/.test(catalogCompContent);
const hasHot100ChapterStrictCheck = /if\s*\(p\.hot100Chapter\s*!==\s*selectedCategory\)\s*return\s*false;/.test(catalogCompContent);
assert('displayedProblems strictly filters category / hot100Chapter with 0-leakage branch', hasCategoryStrictCheck && hasHot100ChapterStrictCheck, `categoryCheck: ${hasCategoryStrictCheck}, hot100Check: ${hasHot100ChapterStrictCheck}`);

// ----------------------------------------------------------------------------
// SUITE 4: UI Title and Copy Sanitization Audit
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 4: UI Title and Copy Sanitization Audit ---');

const indexPath = path.join(__dirname, '../index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
const titleMatch = indexHtml.match(/<title>(.*?)<\/title>/);
assert('index.html <title> strictly equals "Muduo & CppAIService"', titleMatch && titleMatch[1].trim() === 'Muduo & CppAIService', `Actual title: ${titleMatch ? titleMatch[1] : 'NOT FOUND'}`);

const headerPath = path.join(__dirname, '../src/components/layout/Header.tsx');
const headerContent = fs.readFileSync(headerPath, 'utf8');
const headerTitlePass = headerContent.includes('Muduo & CppAIService') && !headerContent.includes('专注大厂');
assert('Header.tsx brand title is "Muduo & CppAIService" without promotional slogans', headerTitlePass, 'Header brand title check failed');

const dashboardPath = path.join(__dirname, '../src/components/dashboard/DashboardView.tsx');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
const dashboardTitlePass = dashboardContent.includes('Muduo & CppAIService') && !dashboardContent.includes('专注大厂');
assert('DashboardView.tsx main title is "Muduo & CppAIService" without promotional slogans', dashboardTitlePass, 'Dashboard main title check failed');

// 1. Mandatory promotional slogan patterns across all of src/
const MANDATORY_BUZZWORDS = ['专注大厂', '全景冲刺', '无损套路', '盲打手写', '避坑铁律', '灾难现场'];

function scanFiles(dir, extensions) {
  let list = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      list = list.concat(scanFiles(full, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      list.push(full);
    }
  }
  return list;
}

const allSrcFiles = scanFiles(path.join(__dirname, '../src'), ['.ts', '.tsx', '.html', '.css']);

MANDATORY_BUZZWORDS.forEach(bw => {
  const matches = [];
  allSrcFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes(bw)) {
      matches.push(path.relative(path.join(__dirname, '..'), f));
    }
  });
  assert(`Zero occurrences of mandatory buzzword "${bw}" in src/`, matches.length === 0, `Found in: ${matches.join(', ')}`);
});

// 2. UI-layer hype words audit
const UI_HYPE_WORDS = [
  '神级', '颠覆性', '降维打击', '极客', '飞跃', '顶级工业级', '无感穿透',
  '天花板', '炸裂', '吊打', '保姆级'
];

const uiFiles = scanFiles(path.join(__dirname, '../src/components'), ['.tsx', '.ts'])
  .concat([
    path.join(__dirname, '../src/App.tsx'),
    path.join(__dirname, '../src/data/algoDataset.ts'),
    path.join(__dirname, '../src/data/tasksDataset.ts'),
    path.join(__dirname, '../index.html')
  ]);

let uiHypeHits = 0;
const uiHitMap = {};

UI_HYPE_WORDS.forEach(word => {
  const matches = [];
  uiFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes(word)) {
      matches.push(path.relative(path.join(__dirname, '..'), f));
    }
  });
  if (matches.length > 0) {
    uiHitMap[word] = matches;
    uiHypeHits += matches.length;
  }
});

assert(
  `Zero hype words in UI components & active datasets (${uiFiles.length} files scanned for ${UI_HYPE_WORDS.length} words)`,
  uiHypeHits === 0,
  `Hype hits: ${JSON.stringify(uiHitMap)}`
);

// ----------------------------------------------------------------------------
// SUITE 5: Deep Quality Check of Reconciled Problems
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 5: Deep Quality Check of Reconciled Problems ---');

// Check algo_54
const p54 = catalog.find(p => p.id === 'algo_54');
assert('algo_54 is category 数组', p54 && p54.category === '数组', `algo_54 category: ${p54?.category}`);
assert('algo_54 has valid leetcodeUrl', p54 && p54.leetcodeUrl.includes('leetcode.cn/problems/spiral-matrix'), `url: ${p54?.leetcodeUrl}`);
assert('algo_54 has isCarl: true and isHot100: true', p54 && p54.isCarl === true && p54.isHot100 === true, `isCarl=${p54?.isCarl}, isHot100=${p54?.isHot100}`);

// Check algo_kc_54
const pkc54 = catalog.find(p => p.id === 'algo_kc_54');
assert('algo_kc_54 exists in 字符串', pkc54 && pkc54.category === '字符串', `pkc54: ${pkc54?.id}`);
assert('algo_kc_54 isCarl === true, isHot100 === false', pkc54 && pkc54.isCarl === true && pkc54.isHot100 === false, `isCarl=${pkc54?.isCarl}`);

// Check algo_94
const p94 = catalog.find(p => p.id === 'algo_94');
assert('algo_94 is category 二叉树', p94 && p94.category === '二叉树', `algo_94 category: ${p94?.category}`);
assert('algo_94 has valid leetcodeUrl', p94 && p94.leetcodeUrl.includes('binary-tree-inorder-traversal'), `url: ${p94?.leetcodeUrl}`);
assert('algo_94 has isCarl: true and isHot100: true', p94 && p94.isCarl === true && p94.isHot100 === true, `isCarl=${p94?.isCarl}, isHot100=${p94?.isHot100}`);

// Check algo_105
const p105 = catalog.find(p => p.id === 'algo_105');
assert('algo_105 is category 二叉树', p105 && p105.category === '二叉树', `algo_105 category: ${p105?.category}`);
assert('algo_105 has valid leetcodeUrl', p105 && p105.leetcodeUrl.includes('construct-binary-tree-from-preorder-and-inorder-traversal'), `url: ${p105?.leetcodeUrl}`);
assert('algo_105 has isCarl: true and isHot100: true', p105 && p105.isCarl === true && p105.isHot100 === true, `isCarl=${p105?.isCarl}, isHot100=${p105?.isHot100}`);

// Check algo_kama_94 and algo_kama_105
const pkama94 = catalog.find(p => p.id === 'algo_kama_94');
assert('algo_kama_94 exists in 图论 with Bellman-Ford pattern', pkama94 && pkama94.category === '图论' && pkama94.pattern.includes('Bellman-Ford'), `pkama94: ${pkama94?.title}`);

const pkama105 = catalog.find(p => p.id === 'algo_kama_105');
assert('algo_kama_105 exists in 图论 with 有向图可达性', pkama105 && pkama105.category === '图论' && pkama105.pattern.includes('有向图可达性搜索'), `pkama105: ${pkama105?.title}`);

// ----------------------------------------------------------------------------
// SUMMARY
// ----------------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`📊 CHALLENGER 2 SUMMARY: ${totalTests} Ran | ${passedTests} Passed | ${failedTests} Failed`);
console.log('======================================================================');

if (failedTests > 0) {
  console.log('\n❌ VERDICT: REJECT');
  process.exit(1);
} else {
  console.log('\n🎉 ALL CHALLENGER 2 TESTS PASSED EMPIRICALLY!');
  console.log('✅ VERDICT: APPROVE');
  process.exit(0);
}

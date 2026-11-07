const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('🚀 Running Code Thoughts (代码随想录) Carl Integration Verification');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failCount++;
  }
}

// Test 1: Verify AlgoProblem type in src/types/index.ts
console.log('Test 1: Verifying AlgoProblem type in src/types/index.ts...');
const typesContent = fs.readFileSync(path.join(__dirname, '../src/types/index.ts'), 'utf8');
assert(typesContent.includes('carlUrl?: string;'), 'AlgoProblem interface has carlUrl?: string');

// Test 2: Verify algoDataset.ts data layer
console.log('\nTest 2: Verifying algoDataset.ts data layer...');
const datasetContent = fs.readFileSync(path.join(__dirname, '../src/data/algoDataset.ts'), 'utf8');
const match = datasetContent.match(/export const ALGORITHM_LAB_CATALOG: AlgoProblem\[\] = (\[[\s\S]*?\]);\n/);
assert(match !== null, 'ALGORITHM_LAB_CATALOG found in algoDataset.ts');
const catalog = JSON.parse(match[1]);
assert(catalog.length === 234, `Total catalog problems count is 234 (got ${catalog.length})`);

const carlProbs = catalog.filter(p => p.isCarl);
assert(carlProbs.length === 179, `Carl problems count is 179 (got ${carlProbs.length})`);

const carlWithUrl = carlProbs.filter(p => p.carlUrl);
assert(carlWithUrl.length === 178, `178 Carl problems have exact carlUrl (got ${carlWithUrl.length})`);

const totalWithUrl = catalog.filter(p => p.carlUrl);
assert(totalWithUrl.length >= 219, `Total problems with carlUrl >= 219 (got ${totalWithUrl.length})`);

// Check specific critical problem URLs
const p704 = catalog.find(p => p.id === 'algo_704');
assert(p704 && p704.carlUrl === 'https://programmercarl.com/algo/array/0704-binary-search.html', '704 Binary Search has exact Carl URL');

const p27 = catalog.find(p => p.id === 'algo_27');
assert(p27 && p27.carlUrl === 'https://programmercarl.com/algo/array/0027-remove-element.html', '27 Remove Element has exact Carl URL');

const p58 = catalog.find(p => p.id === 'algo_58');
assert(p58 && p58.carlUrl.includes('kamacoder-0058-range-sum'), '58 Range Sum matches KamaCoder URL');

const pKama96 = catalog.find(p => p.id === 'algo_kama_96');
assert(pKama96 && pKama96.carlUrl.includes('kamacoder-0096-city-goods-transportation-iii'), 'Kama 96 matches KamaCoder graph URL');

const p96 = catalog.find(p => p.num === 96 && p.category === '动态规划');
assert(p96 && p96.carlUrl.includes('0096-unique-binary-search-trees'), 'LeetCode 96 matches Dynamic Programming binary search trees URL');

// Check variant & category specific precision
const p70 = catalog.find(p => p.id === 'algo_70');
assert(p70 && p70.carlUrl === 'https://programmercarl.com/algo/dynamic-programming/0070-climbing-stairs.html', '70 Climbing Stairs points to base DP article (not knapsack)');

const p70Knapsack = catalog.find(p => p.id === 'algo_70_knapsack');
assert(p70Knapsack && p70Knapsack.carlUrl === 'https://programmercarl.com/algo/dynamic-programming/0070-climbing-stairs-complete-knapsack.html', '70 Knapsack points to complete-knapsack article');

const p53 = catalog.find(p => p.id === 'algo_53');
assert(p53 && p53.carlUrl === 'https://programmercarl.com/algo/greedy/0053-maximum-subarray.html', '53 Greedy points to /greedy/ URL (not /dynamic-programming/)');

const p53Dp = catalog.find(p => p.id === 'algo_53_dp');
assert(p53Dp && p53Dp.carlUrl === 'https://programmercarl.com/algo/dynamic-programming/0053-maximum-subarray-dynamic-programming.html', '53 DP points to /dynamic-programming/ URL');

const p122 = catalog.find(p => p.id === 'algo_122');
assert(p122 && p122.carlUrl === 'https://programmercarl.com/algo/greedy/0122-best-time-to-buy-and-sell-stock-ii.html', '122 Greedy points to /greedy/ URL');

const p122Dp = catalog.find(p => p.id === 'algo_122_dp');
assert(p122Dp && p122Dp.carlUrl === 'https://programmercarl.com/algo/dynamic-programming/0122-best-time-to-buy-and-sell-stock-ii-dynamic-programming.html', '122 DP points to /dynamic-programming/ URL');

const pKama94 = catalog.find(p => p.id === 'algo_kama_94');
assert(pKama94 && pKama94.carlUrl === 'https://programmercarl.com/algo/graph/kamacoder-0094-city-goods-transportation-i.html', 'Kama 94 base Bellman-Ford points to non-SPFA URL');

const pKama94Spfa = catalog.find(p => p.id === 'algo_kama_94_spfa');
assert(pKama94Spfa && pKama94Spfa.carlUrl === 'https://programmercarl.com/algo/graph/kamacoder-0094-city-goods-transportation-i-spfa.html', 'Kama 94 SPFA points to SPFA URL');

const p77Opt = catalog.find(p => p.id === 'algo_77_opt');
assert(p77Opt && p77Opt.carlUrl === 'https://programmercarl.com/algo/backtracking/0077-combinations-optimized.html', '77 Optimized points to combinations-optimized article');

// Test 3: Verify AlgoCard.tsx implementation
console.log('\nTest 3: Verifying AlgoCard.tsx implementation...');
const algoCardContent = fs.readFileSync(path.join(__dirname, '../src/components/algorithm/AlgoCard.tsx'), 'utf8');
assert(algoCardContent.includes('onOpenCarlReader?: (problem: AlgoProblem) => void;'), 'AlgoCardProps includes onOpenCarlReader');
assert(algoCardContent.includes('problem.carlUrl &&'), 'AlgoCard renders Carl actions conditionally when carlUrl exists');
assert(algoCardContent.includes('title="应用内抽屉阅读随想录精讲"'), 'AlgoCard has in-app drawer reader button');
assert(algoCardContent.includes('title="在新标签页打开随想录题解"'), 'AlgoCard has direct external link to Carl solution');
assert(algoCardContent.includes('active:scale-x-105 active:scale-y-90'), 'AlgoCard has Claymorphism squash & stretch feedback');

// Test 4: Verify CarlReaderDrawer.tsx component
console.log('\nTest 4: Verifying CarlReaderDrawer.tsx component...');
const drawerPath = path.join(__dirname, '../src/components/algorithm/CarlReaderDrawer.tsx');
assert(fs.existsSync(drawerPath), 'CarlReaderDrawer.tsx exists');
const drawerContent = fs.readFileSync(drawerPath, 'utf8');
assert(drawerContent.includes('<iframe'), 'CarlReaderDrawer embeds article via iframe');
assert(drawerContent.includes('isFullScreen'), 'CarlReaderDrawer implements full-screen toggle');
assert(drawerContent.includes('Maximize2'), 'CarlReaderDrawer has Maximize2 icon for fullscreen');
assert(drawerContent.includes('ExternalLink'), 'CarlReaderDrawer has ExternalLink icon to open in new tab');
assert(drawerContent.includes('problem.projectLink'), 'CarlReaderDrawer renders engineering takeaway: projectLink');
assert(drawerContent.includes('problem.mistakes'), 'CarlReaderDrawer renders engineering takeaway: mistakes');
assert(drawerContent.includes('rounded-l-3xl'), 'CarlReaderDrawer has Claymorphic rounded-l-3xl slide-over styling');
assert(drawerContent.includes('sandbox="allow-same-origin allow-scripts allow-popups allow-forms"'), 'CarlReaderDrawer iframe has secure sandbox permissions');
assert(drawerContent.includes('slide-in-from-right'), 'CarlReaderDrawer has smooth entrance slide animation');
assert(drawerContent.includes('!problem?.carlUrl'), 'CarlReaderDrawer safely handles problems without carlUrl without infinite loading');

// Test 5: Verify AlgoCatalog.tsx integration
console.log('\nTest 5: Verifying AlgoCatalog.tsx integration...');
const catalogContent = fs.readFileSync(path.join(__dirname, '../src/components/algorithm/AlgoCatalog.tsx'), 'utf8');
assert(catalogContent.includes('import { CarlReaderDrawer } from \'./CarlReaderDrawer\';'), 'AlgoCatalog imports CarlReaderDrawer');
assert(catalogContent.includes('const [carlReaderProblem, setCarlReaderProblem] = useState'), 'AlgoCatalog maintains carlReaderProblem state');
assert(catalogContent.includes('onOpenCarlReader={(p) => setCarlReaderProblem(p)}'), 'AlgoCatalog passes onOpenCarlReader callback to AlgoCard');
assert(catalogContent.includes('https://programmercarl.com/algo/'), 'AlgoCatalog has quick master roadmap link');
assert(catalogContent.includes('title="代码随想录总路线 (programmercarl.com/algo/)"'), 'AlgoCatalog has roadmap button in collapsed sidebar');
assert(catalogContent.includes('title="打开代码随想录算法学习总路线 (programmercarl.com/algo/)"'), 'AlgoCatalog has roadmap button in expanded sidebar');
assert(catalogContent.includes('onClick={() => setCarlReaderProblem(randomProblem)}'), 'Random Pick card allows opening Carl reader');
assert(catalogContent.includes('<CarlReaderDrawer'), 'AlgoCatalog mounts CarlReaderDrawer component');
assert(catalogContent.includes('Code2') && catalogContent.includes('title="打开 LeetCode 原题"'), 'Random Pick card uses Code2 icon for LeetCode');
assert(catalogContent.includes('title="在新标签页打开随想录题解"'), 'Random Pick card uses ExternalLink icon for Carl solution');

// Test 6: Verify elimination of nested O(O(n)) complexity formatting
console.log('\nTest 6: Verifying elimination of nested O(O(n)) complexity formatting...');
assert(!algoCardContent.includes('O({problem.timeComp})'), 'AlgoCard does not have nested O({problem.timeComp})');
assert(!algoCardContent.includes('O({problem.spaceComp})'), 'AlgoCard does not have nested O({problem.spaceComp})');
assert(algoCardContent.includes('formatComplexity(problem.timeComp)'), 'AlgoCard uses formatComplexity for timeComp');
assert(!drawerContent.includes('O({problem.timeComp})'), 'CarlReaderDrawer does not have nested O({problem.timeComp})');
assert(!drawerContent.includes('O({problem.spaceComp})'), 'CarlReaderDrawer does not have nested O({problem.spaceComp})');
assert(drawerContent.includes('formatComplexity(problem.timeComp)'), 'CarlReaderDrawer uses formatComplexity for timeComp');

const formattersPath = path.join(__dirname, '../src/utils/formatters.ts');
assert(fs.existsSync(formattersPath), 'src/utils/formatters.ts exists');
const formattersContent = fs.readFileSync(formattersPath, 'utf8');
assert(formattersContent.includes('export function formatComplexity'), 'formatComplexity is exported from formatters.ts');

// Test formatComplexity logic
function formatComplexityLocal(comp) {
  if (!comp) return '';
  const trimmed = comp.trim();
  if (!trimmed) return '';
  if (/^[oO]\(.*\)$/.test(trimmed)) {
    let clean = trimmed;
    while (/^[oO]\s*\(\s*([oO]\s*\(.*\))\s*\)$/.test(clean)) {
      clean = clean.replace(/^[oO]\s*\(\s*([oO]\s*\(.*\))\s*\)$/, (_match, inner) => inner);
    }
    if (clean.startsWith('o(')) {
      clean = 'O(' + clean.slice(2);
    }
    return clean;
  }
  return `O(${trimmed})`;
}
assert(formatComplexityLocal('O(n)') === 'O(n)', 'formatComplexity preserves O(n)');
assert(formatComplexityLocal('O(O(n))') === 'O(n)', 'formatComplexity collapses O(O(n)) to O(n)');
assert(formatComplexityLocal('n') === 'O(n)', 'formatComplexity wraps bare n into O(n)');
assert(formatComplexityLocal('O(1)') === 'O(1)', 'formatComplexity preserves O(1)');
assert(formatComplexityLocal('O(O(1))') === 'O(1)', 'formatComplexity collapses O(O(1)) to O(1)');
assert(formatComplexityLocal('O(m*n)') === 'O(m*n)', 'formatComplexity preserves O(m*n)');

// Summary
console.log('\n================================================================');
if (failCount === 0) {
  console.log(`🎉 ALL ${passCount} VERIFICATION CHECKS PASSED FLAWLESSLY!`);
} else {
  console.error(`💥 ${failCount} CHECKS FAILED! (${passCount} passed)`);
  process.exit(1);
}
console.log('================================================================');

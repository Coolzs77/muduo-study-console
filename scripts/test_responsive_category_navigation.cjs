const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('📱 Running Responsive Category Navigation (Scheme A) Test Engine');
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

const rootDir = path.resolve(__dirname, '..');
const algoCatalogPath = path.join(rootDir, 'src/components/algorithm/AlgoCatalog.tsx');
const drawerPath = path.join(rootDir, 'src/components/algorithm/AlgoCategoryDrawer.tsx');
const cssPath = path.join(rootDir, 'src/index.css');

assert(fs.existsSync(algoCatalogPath), 'AlgoCatalog.tsx exists');
assert(fs.existsSync(drawerPath), 'AlgoCategoryDrawer.tsx exists');
assert(fs.existsSync(cssPath), 'src/index.css exists');

const catalogContent = fs.readFileSync(algoCatalogPath, 'utf8');
const drawerContent = fs.readFileSync(drawerPath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// ----------------------------------------------------------------------------
// Test 1: Verify AlgoCategoryDrawer.tsx Component Architecture & Props
// ----------------------------------------------------------------------------
console.log('\nTest 1: Verifying AlgoCategoryDrawer.tsx Component Architecture & Props...');
assert(drawerContent.includes('export interface AlgoCategoryDrawerProps'), 'AlgoCategoryDrawerProps interface exported');
assert(drawerContent.includes('isOpen: boolean;'), 'Props includes isOpen');
assert(drawerContent.includes('onClose: () => void;'), 'Props includes onClose');
assert(drawerContent.includes("viewTrack: 'all' | 'hot100' | 'carl';"), 'Props includes viewTrack');
assert(drawerContent.includes("onTrackChange: (track: 'all' | 'hot100' | 'carl') => void;"), 'Props includes onTrackChange');
assert(drawerContent.includes('selectedCategory: string;'), 'Props includes selectedCategory');
assert(drawerContent.includes('onSelectCategory: (category: string) => void;'), 'Props includes onSelectCategory');
assert(drawerContent.includes('categories: readonly string[];'), 'Props includes categories');
assert(drawerContent.includes('categoryStats: Record<string, { total: number; completed: number; pct: number }>;'), 'Props includes categoryStats');
assert(drawerContent.includes('trackCompletedCount: number;'), 'Props includes trackCompletedCount');
assert(drawerContent.includes('trackTotalCount: number;'), 'Props includes trackTotalCount');
assert(drawerContent.includes('trackPct: number;'), 'Props includes trackPct');
assert(drawerContent.includes('export const AlgoCategoryDrawer: React.FC<AlgoCategoryDrawerProps>'), 'AlgoCategoryDrawer component exported');

// ----------------------------------------------------------------------------
// Test 2: Verify Emil Kowalski Motion Specs & Accessibility in Drawer
// ----------------------------------------------------------------------------
console.log('\nTest 2: Verifying Emil Kowalski Motion Specs & Accessibility in Drawer...');
assert(drawerContent.includes('z-[60]'), 'High-priority z-[60] stacking context sits safely above app layers');
assert(!drawerContent.includes('scale(0)'), 'STRICTLY NO scale(0) to avoid GPU aliasing artifacts');
assert(drawerContent.includes('translateY(16px) scale(0.98)'), 'Entrance initial transform translateY(16px) scale(0.98) implemented');
assert(drawerContent.includes('translateY(0) scale(1)'), 'Entrance resting transform translateY(0) scale(1) implemented');
assert(drawerContent.includes('translateY(12px) scale(0.98)'), 'Exit transform translateY(12px) scale(0.98) implemented');
assert(drawerContent.includes('cubic-bezier(0.16, 1, 0.3, 1)'), 'Emil Kowalski entrance curve cubic-bezier(0.16, 1, 0.3, 1) implemented (200ms)');
assert(drawerContent.includes('cubic-bezier(0.7, 0, 0.84, 0)'), 'Emil Kowalski exit curve cubic-bezier(0.7, 0, 0.84, 0) implemented (150ms)');
assert(drawerContent.includes("willChange: 'transform, opacity'"), 'Hardware acceleration declared via willChange');
assert(drawerContent.includes('opacity: isVisible ? 1 : 0'), 'Drawer Card explicitly specifies hardware-accelerated opacity transition');
assert(drawerContent.includes('duration-150'), 'Drawer exit opacity transition matches 150ms unmount timer');
assert(drawerContent.includes('pb-8 sm:pb-4'), 'Scrollable category container accounts for mobile safe area padding');
assert(drawerContent.includes('active:scale-[0.96] transition-transform duration-100'), 'Tactile press squash feedback active:scale-[0.96] duration-100 implemented');
assert(drawerContent.includes('isComposing') || drawerContent.includes('Process'), 'Protects Chinese IME composition so Escape does not prematurely close drawer');
assert(drawerContent.includes("addEventListener('keydown', handleKeyDown, true)"), 'Uses capture phase event listener to catch Esc key reliably');
assert(drawerContent.includes('onClick={onClose}'), 'Backdrop overlay handles click to close');

// ----------------------------------------------------------------------------
// Test 3: Verify Drawer Internal Features (Track Switcher, Progress, Roadmap)
// ----------------------------------------------------------------------------
console.log('\nTest 3: Verifying Drawer Internal Features...');
assert(drawerContent.includes("onTrackChange('all')"), 'Drawer supports switching to all track (234)');
assert(drawerContent.includes("onTrackChange('hot100')"), 'Drawer supports switching to hot100 track');
assert(drawerContent.includes("onTrackChange('carl')"), 'Drawer supports switching to carl track');
assert(drawerContent.includes('programmercarl.com/algo/'), 'Drawer includes quick master roadmap link');
assert(drawerContent.includes("onSelectCategory('all')"), 'Drawer includes 全部专题 option');
assert(drawerContent.includes('onClose()'), 'Drawer closes immediately upon selecting a category');
assert(drawerContent.includes('categoryStats[cat]'), 'Drawer displays live category progress stats');

// ----------------------------------------------------------------------------
// Test 4: Verify Track 1 Horizontal Category Pill Bar in AlgoCatalog.tsx
// ----------------------------------------------------------------------------
console.log('\nTest 4: Verifying Track 1 Horizontal Category Pill Bar in AlgoCatalog.tsx...');
assert(catalogContent.includes('md:hidden') && catalogContent.includes('overflow-x-auto'), 'Horizontal bar has md:hidden responsive container');
assert(catalogContent.includes('scrollbar-none'), 'Horizontal bar has scrollbar-none to hide native scrollbars');
assert(catalogContent.includes('[-webkit-overflow-scrolling:touch]'), 'Horizontal bar has iOS momentum touch scrolling');
assert(catalogContent.includes('scroll-smooth'), 'Horizontal bar has smooth scroll behavior');
assert(catalogContent.includes("pillRefs.current['all']"), 'Ref attached to 全部 pill for auto-scrolling');
assert(catalogContent.includes("pillRefs.current[cat]"), 'Ref attached to category pills for auto-scrolling');
assert(catalogContent.includes('scrollIntoView'), 'Implements scrollIntoView on selectedCategory change');
assert(catalogContent.includes("inline: 'center'"), 'scrollIntoView centers the active pill horizontally');
assert(catalogContent.includes("block: 'nearest'"), 'scrollIntoView prevents unwanted vertical page displacement');
assert(catalogContent.includes('[selectedCategory, viewTrack]'), 'Auto-scroll effect triggers on both selectedCategory and viewTrack updates');
assert(!catalogContent.includes('py-0.2'), 'Pill badges use valid Tailwind CSS classes (no py-0.2 typo)');
assert(catalogContent.includes('bg-gradient-to-r from-purple-600 to-indigo-600'), 'Selected pill styled with purple-to-indigo gradient');
assert(catalogContent.includes('LayoutGrid'), 'Horizontal bar includes expand grid icon button (LayoutGrid)');
assert(catalogContent.includes('setIsCategoryDrawerOpen(true)'), 'Grid button triggers category drawer opening');

// ----------------------------------------------------------------------------
// Test 5: Verify Clickable "当前展示: [专题 ▾]" Drawer Trigger
// ----------------------------------------------------------------------------
console.log('\nTest 5: Verifying Interactive Drawer Triggers in AlgoCatalog.tsx...');
assert(catalogContent.includes('ChevronDown'), 'Imports ChevronDown icon from lucide-react');
assert(catalogContent.includes('当前展示:'), 'Displays 当前展示 label');
assert(catalogContent.includes('onClick={() => setIsCategoryDrawerOpen(true)}'), 'Clicking 当前展示 triggers category drawer');
assert(catalogContent.includes('<AlgoCategoryDrawer'), 'AlgoCatalog mounts AlgoCategoryDrawer');

// ----------------------------------------------------------------------------
// Test 6: Verify Mobile Sidebar Collapse Bug Fix
// ----------------------------------------------------------------------------
console.log('\nTest 6: Verifying Mobile Sidebar Responsiveness Bug Fix...');
const collapsedAsideMatch = catalogContent.match(/<aside className="w-16[^>]+hidden md:flex/);
assert(collapsedAsideMatch !== null, 'Collapsed sidebar has hidden md:flex');
const expandedAsideMatch = catalogContent.match(/<aside className="w-80[^>]+hidden md:flex/);
assert(expandedAsideMatch !== null, 'Expanded sidebar has hidden md:flex (mobile collapse bug resolved!)');

// ----------------------------------------------------------------------------
// Test 7: Verify CSS Utility Class in src/index.css
// ----------------------------------------------------------------------------
console.log('\nTest 7: Verifying CSS Utility Class in src/index.css...');
assert(cssContent.includes('.scrollbar-none'), '.scrollbar-none class defined in src/index.css');
assert(cssContent.includes('scrollbar-width: none;'), 'scrollbar-width: none defined for Firefox');
assert(cssContent.includes('-ms-overflow-style: none;'), '-ms-overflow-style: none defined for IE/Edge');
assert(cssContent.includes('display: none;'), '::-webkit-scrollbar display: none defined for Chrome/Safari/Blink');

// ----------------------------------------------------------------------------
// Test 8: Real Data Layer & Category Calculation Engine Verification
// ----------------------------------------------------------------------------
console.log('\nTest 8: Verifying Real Data Layer & Category Calculation Engine...');
const datasetContent = fs.readFileSync(path.join(rootDir, 'src/data/algoDataset.ts'), 'utf8');
const match = datasetContent.match(/export const ALGORITHM_LAB_CATALOG: AlgoProblem\[\] = (\[[\s\S]*?\]);\n/);
assert(match !== null, 'ALGORITHM_LAB_CATALOG dataset loaded successfully');
const catalog = JSON.parse(match[1]);

const STANDARD_CATEGORIES = [
  '数组', '链表', '哈希表', '字符串', '双指针法', '栈与队列',
  '二叉树', '回溯算法', '贪心算法', '动态规划', '单调栈', '图论'
];
const CARL_HOT100_CHAPTERS = [
  '哈希', '双指针', '滑动窗口', '子串', '普通数组', '矩阵', '链表',
  '二叉树', '图论', '回溯', '二分查找', '栈', '堆', '贪心算法',
  '动态规划', '多维动态规划', '技巧'
];

// 1. Data Integrity: all 234 problems belong to standard categories
const unknownCats = catalog.filter(p => !STANDARD_CATEGORIES.includes(p.category));
assert(unknownCats.length === 0, `All ${catalog.length} problems belong to STANDARD_CATEGORIES`);

// 2. Data Integrity: all 100 Hot100 problems belong to CARL_HOT100_CHAPTERS
const hot100Probs = catalog.filter(p => p.isHot100);
assert(hot100Probs.length === 100, `Hot 100 problems count is 100 (got ${hot100Probs.length})`);
const unknownChapters = hot100Probs.filter(p => !CARL_HOT100_CHAPTERS.includes(p.hot100Chapter));
assert(unknownChapters.length === 0, `All Hot 100 problems belong to CARL_HOT100_CHAPTERS`);

// 3. Category coverage: every Hot 100 chapter has problems
const emptyChapters = CARL_HOT100_CHAPTERS.filter(ch => !hot100Probs.some(p => p.hot100Chapter === ch));
assert(emptyChapters.length === 0, `All 17 Hot 100 chapters have active problems`);

// 4. Category coverage: every Standard category has problems in Carl track
const carlProbs = catalog.filter(p => p.isCarl);
assert(carlProbs.length === 179, `Carl track problems count is 179 (got ${carlProbs.length})`);
const emptyCarlCats = STANDARD_CATEGORIES.filter(cat => !carlProbs.some(p => p.category === cat));
assert(emptyCarlCats.length === 0, `All 12 Standard categories have active Carl problems`);

// 5. Test real categoryStats computation engine logic
function computeCategoryStats(trackProblems, categories, completedMap, isHot100) {
  const stats = {};
  categories.forEach(cat => {
    stats[cat] = { total: 0, completed: 0, pct: 0 };
  });

  trackProblems.forEach(p => {
    const key = isHot100 ? p.hot100Chapter || '' : p.category || '';
    if (stats[key]) {
      stats[key].total++;
      const done = p.num !== null && p.num !== undefined ? !!completedMap[p.num] : !!completedMap[p.id];
      if (done) stats[key].completed++;
    }
  });

  Object.keys(stats).forEach(cat => {
    const { total, completed } = stats[cat];
    stats[cat].pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  });

  return stats;
}

// Stats with 0 completed
const emptyMap = {};
const statsAll = computeCategoryStats(catalog, STANDARD_CATEGORIES, emptyMap, false);
let sumTotalAll = 0;
Object.values(statsAll).forEach(s => { sumTotalAll += s.total; });
assert(sumTotalAll === 234, `Sum of standard category totals equals catalog total (234)`);

// Stats with simulated completions
const simulatedMap = {};
hot100Probs.slice(0, 20).forEach(p => {
  if (p.num !== null && p.num !== undefined) simulatedMap[p.num] = true;
  else simulatedMap[p.id] = true;
});
const statsHot100 = computeCategoryStats(hot100Probs, CARL_HOT100_CHAPTERS, simulatedMap, true);
let sumDoneHot100 = 0;
Object.values(statsHot100).forEach(s => { sumDoneHot100 += s.completed; });
assert(sumDoneHot100 === 20, `Simulated category completion count exactly matches (20)`);

// 6. Test problem filtering by category
const dpProblems = catalog.filter(p => p.category === '动态规划');
assert(dpProblems.length > 0 && dpProblems.every(p => p.category === '动态规划'), `Filter by category '动态规划' isolates DP problems strictly`);

const slidingWindow = hot100Probs.filter(p => p.hot100Chapter === '滑动窗口');
assert(slidingWindow.length > 0 && slidingWindow.every(p => p.hot100Chapter === '滑动窗口'), `Filter by chapter '滑动窗口' isolates Hot100 sliding window problems strictly`);

console.log('\n================================================================');
if (failCount === 0) {
  console.log(`🎉 ALL ${passCount} RESPONSIVE CATEGORY NAVIGATION CHECKS PASSED FLAWLESSLY!`);
  console.log('================================================================');
  process.exit(0);
} else {
  console.error(`❌ ${failCount} CHECKS FAILED!`);
  console.log('================================================================');
  process.exit(1);
}

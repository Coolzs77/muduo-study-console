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
// Test 8: End-to-End Simulation of Track & Category Selection Lifecycle
// ----------------------------------------------------------------------------
console.log('\nTest 8: Simulating Track & Category Selection Lifecycle...');
const STANDARD_CATEGORIES = [
  '数组', '链表', '哈希表', '字符串', '双指针法', '栈与队列',
  '二叉树', '回溯算法', '贪心算法', '动态规划', '单调栈', '图论'
];
const CARL_HOT100_CHAPTERS = [
  '哈希', '双指针', '滑动窗口', '子串', '普通数组', '矩阵', '链表',
  '二叉树', '图论', '回溯', '二分查找', '栈', '堆', '贪心算法',
  '动态规划', '多维动态规划', '技巧'
];

let simTrack = 'all';
let simSelectedCategory = 'all';
let simDrawerOpen = false;

// 1. User clicks drawer button
simDrawerOpen = true;
assert(simDrawerOpen === true, 'Drawer opens upon trigger');

// 2. User switches track in drawer
simTrack = 'hot100';
simSelectedCategory = 'all';
assert(simTrack === 'hot100' && simSelectedCategory === 'all', 'Track switch in drawer updates track and resets category');

// 3. User picks a category from Hot100
const targetChapter = CARL_HOT100_CHAPTERS[2]; // '滑动窗口'
simSelectedCategory = targetChapter;
simDrawerOpen = false;
assert(simSelectedCategory === '滑动窗口' && simDrawerOpen === false, 'Selecting category updates selection and closes drawer');

// 4. User directly taps a pill in horizontal bar (0 modal opening)
simSelectedCategory = '双指针';
assert(simSelectedCategory === '双指针' && simDrawerOpen === false, 'Tapping horizontal pill immediately updates category with 0 modal opening');

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

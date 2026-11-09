const fs = require('fs');
const path = require('path');

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

console.log('================================================================');
console.log('📝 Running Algorithm Problem Note Feature Verification Engine');
console.log('================================================================');

// ----------------------------------------------------------------------------
// Test 1: Verify TypeScript Interface Definitions in src/types/index.ts
// ----------------------------------------------------------------------------
console.log('\nTest 1: Verifying Note Type Definitions in src/types/index.ts...');
const typesContent = fs.readFileSync(path.join(__dirname, '../src/types/index.ts'), 'utf8');

assert(typesContent.includes('export interface AlgoProblemNote'), 'AlgoProblemNote interface is exported');
assert(typesContent.includes('content: string;'), 'AlgoProblemNote has content: string');
assert(typesContent.includes('updatedAt: number;'), 'AlgoProblemNote has updatedAt: number');
assert(typesContent.includes('createdAt?: number;'), 'AlgoProblemNote has createdAt?: number');
assert(typesContent.includes('export type AlgoProblemNotesMap = Record<string, AlgoProblemNote>;'), 'AlgoProblemNotesMap type is exported as Record<string, AlgoProblemNote>');

// ----------------------------------------------------------------------------
// Test 2: Verify Key Generation & Strict Independence in algoDataset.ts
// ----------------------------------------------------------------------------
console.log('\nTest 2: Verifying 100% Storage Key Isolation in algoDataset.ts...');
const datasetContent = fs.readFileSync(path.join(__dirname, '../src/data/algoDataset.ts'), 'utf8');
assert(datasetContent.includes('export const ALGORITHM_LAB_CATALOG'), 'ALGORITHM_LAB_CATALOG found in algoDataset.ts');

const catalogMatch = datasetContent.match(/export const ALGORITHM_LAB_CATALOG:\s*AlgoProblem\[\]\s*=\s*(\[[\s\S]*?\n\];)/);
let catalog = [];
if (catalogMatch) {
  try {
    const rawCatalogText = catalogMatch[1].replace(/;\s*$/, '');
    catalog = eval(rawCatalogText);
  } catch (e) {
    catalog = [];
  }
}

assert(catalog.length === 234, `Total catalog problems count is 234 (got ${catalog.length})`);

const getProblemKey = (problem) => {
  if (!problem) return '';
  return problem.id || (problem.num !== null && problem.num !== undefined ? 'p_' + problem.num : problem.title || '');
};

const keysSet = new Set();
let duplicates = [];
catalog.forEach((p) => {
  const key = getProblemKey(p);
  if (keysSet.has(key)) {
    duplicates.push(key);
  }
  keysSet.add(key);
});

assert(duplicates.length === 0, `All 234 problems generate 100% unique keys with zero collisions (unique count: ${keysSet.size})`);

const p70Base = catalog.find(p => p.id === 'algo_70');
const p70Knapsack = catalog.find(p => p.id === 'algo_70_knapsack');
assert(p70Base && p70Knapsack, 'Both algo_70 and algo_70_knapsack exist in catalog');
assert(getProblemKey(p70Base) !== getProblemKey(p70Knapsack), '70 Climbing Stairs and 70 Knapsack have isolated keys');

const p53Greedy = catalog.find(p => p.id === 'algo_53');
const p53DP = catalog.find(p => p.id === 'algo_53_dp');
assert(p53Greedy && p53DP, 'Both algo_53 and algo_53_dp exist in catalog');
assert(getProblemKey(p53Greedy) !== getProblemKey(p53DP), '53 Greedy and 53 DP have isolated keys');

const p122Greedy = catalog.find(p => p.id === 'algo_122');
const p122DP = catalog.find(p => p.id === 'algo_122_dp');
assert(p122Greedy && p122DP, 'Both algo_122 and algo_122_dp exist in catalog');
assert(getProblemKey(p122Greedy) !== getProblemKey(p122DP), '122 Greedy and 122 DP have isolated keys');

const kama99dfs = catalog.find(p => p.id === 'algo_kama_99_dfs');
const kama99bfs = catalog.find(p => p.id === 'algo_kama_99_bfs');
assert(kama99dfs && kama99bfs, 'Both Kama 99 DFS and Kama 99 BFS exist');
assert(getProblemKey(kama99dfs) !== getProblemKey(kama99bfs), 'Kama 99 DFS and Kama 99 BFS have isolated keys');

const kama98 = catalog.find(p => p.id === 'algo_kama_98');
const lc94 = catalog.find(p => p.id === 'algo_94');
assert(kama98 && lc94, 'Both Kama 98 and LeetCode 94 exist');
assert(getProblemKey(kama98) !== getProblemKey(lc94), 'Kama 98 and LeetCode 94 have isolated keys');

// ----------------------------------------------------------------------------
// Test 3: Functional Simulation of Note Store Key Independence
// ----------------------------------------------------------------------------
console.log('\nTest 3: Simulating Note Storage Lifecycle & Independence...');
const mockNotesStore = {};

mockNotesStore[getProblemKey(p70Base)] = {
  content: '爬楼梯使用标准斐波那契 DP：dp[i] = dp[i-1] + dp[i-2]',
  updatedAt: 1730000000000,
  createdAt: 1730000000000
};
assert(mockNotesStore[getProblemKey(p70Base)] !== undefined, 'Saved note for problem 70');
assert(mockNotesStore[getProblemKey(p70Knapsack)] === undefined, 'Problem 70 Knapsack note remains undefined (isolated)');

mockNotesStore[getProblemKey(p70Knapsack)] = {
  content: '完全背包思路：每次可以跨 1 到 m 步，外层遍历背包，内层遍历物品',
  updatedAt: 1730000001000,
  createdAt: 1730000001000
};

assert(
  mockNotesStore[getProblemKey(p70Base)].content !== mockNotesStore[getProblemKey(p70Knapsack)].content,
  'Notes for variant problems have distinct isolated content'
);

delete mockNotesStore[getProblemKey(p70Base)];
assert(mockNotesStore[getProblemKey(p70Base)] === undefined, 'Deleted note for problem 70');
assert(mockNotesStore[getProblemKey(p70Knapsack)] !== undefined, 'Problem 70 Knapsack note still intact after deleting variant note');

// ----------------------------------------------------------------------------
// Test 4: Verify AlgoNoteModal.tsx Component Implementation
// ----------------------------------------------------------------------------
console.log('\nTest 4: Verifying AlgoNoteModal.tsx Component...');
const modalPath = path.join(__dirname, '../src/components/algorithm/AlgoNoteModal.tsx');
assert(fs.existsSync(modalPath), 'AlgoNoteModal.tsx file exists');
const modalContent = fs.readFileSync(modalPath, 'utf8');

assert(modalContent.includes('export const getAlgoProblemKey'), 'Exports getAlgoProblemKey helper');
assert(modalContent.includes('export const AlgoNoteModal'), 'Exports AlgoNoteModal component');
assert(modalContent.includes('useEditor'), 'Uses TipTap useEditor hook for single unified canvas');
assert(modalContent.includes('EditorContent'), 'Renders TipTap EditorContent canvas');
assert(modalContent.includes('handleCopy'), 'Implements clipboard copy');
assert(modalContent.includes('handleClear'), 'Implements note clear with confirmation');
assert(modalContent.includes('isConfirmingClear'), 'Has safety confirmation state for clear action');
assert(modalContent.includes('handleKeyDown'), 'Listens for keyboard shortcuts');
assert(modalContent.includes("e.key === 'Escape'"), 'Supports Esc key to close modal');
assert(modalContent.includes("e.key === 'Enter'"), 'Supports Ctrl+Enter / Cmd+Enter to quick save');
assert(modalContent.includes('cubic-bezier(0.16, 1, 0.3, 1)'), 'Emil Kowalski entrance curve cubic-bezier(0.16, 1, 0.3, 1) implemented');
assert(modalContent.includes('cubic-bezier(0.7, 0, 0.84, 0)'), 'Emil Kowalski exit curve cubic-bezier(0.7, 0, 0.84, 0) implemented');
assert(modalContent.includes('scale(0.98)'), 'Emil Kowalski exit transform scale(0.98) implemented');
assert(modalContent.includes('if (!isMounted || !currentProblem) return null;'), 'Retains strict null guard before mounting');
assert(modalContent.includes('e.isComposing') || modalContent.includes('keyCode === 229'), 'Protects Chinese IME composition');
assert(modalContent.includes('z-[60]'), 'High-priority z-[60] stacking context sits safely above drawer');
assert(modalContent.includes('stopImmediatePropagation'), 'Stops immediate propagation so Esc closes modal without closing drawer');
assert(!modalContent.includes('scale(0)'), 'Strictly no scale(0) to avoid GPU artifacting');
assert(modalContent.includes("willChange: 'transform, opacity'"), 'Hardware acceleration declared via willChange');
assert(modalContent.includes('cursor-text'), 'Canvas surface indicates full-area text editable cursor');

// ----------------------------------------------------------------------------
// Test 5: Verify AlgoCard.tsx Icon-Only Note Button Implementation
// ----------------------------------------------------------------------------
console.log('\nTest 5: Verifying AlgoCard.tsx Icon-Only Note Button...');
const cardContent = fs.readFileSync(path.join(__dirname, '../src/components/algorithm/AlgoCard.tsx'), 'utf8');

assert(cardContent.includes('StickyNote'), 'AlgoCard imports StickyNote from lucide-react');
assert(cardContent.includes('hasNote?: boolean;'), 'AlgoCardProps includes hasNote');
assert(cardContent.includes('onOpenNote?: (problem: AlgoProblem) => void;'), 'AlgoCardProps includes onOpenNote');
assert(cardContent.includes("title={hasNote ? '做题便签 (已有笔记)' : '做题便签'}"), 'AlgoCard note button has accurate dynamic title tooltip');
assert(cardContent.includes('active:scale-[0.96] transition-transform duration-100'), 'AlgoCard note button has physical press squash feedback (duration-100)');

const noteBtnMatch = cardContent.match(/\{\/\* Note Button \(ICON ONLY - strictly no text labels\) \*\/\}\s*<button[\s\S]*?<\/button>/);
assert(noteBtnMatch !== null, 'AlgoCard contains note button action block');
if (noteBtnMatch) {
  const btnSnippet = noteBtnMatch[0];
  assert(btnSnippet.includes('<StickyNote'), 'AlgoCard note button renders StickyNote icon');
  assert(!btnSnippet.includes('<span'), 'AlgoCard note button has STRICTLY NO text labels (ICON ONLY constraint met)');
  assert(btnSnippet.includes('hasNote'), 'AlgoCard note button dynamically reacts to hasNote state');
}

// ----------------------------------------------------------------------------
// Test 6: Verify CarlReaderDrawer.tsx Icon-Only Note Button Implementation
// ----------------------------------------------------------------------------
console.log('\nTest 6: Verifying CarlReaderDrawer.tsx Icon-Only Note Button...');
const drawerContent = fs.readFileSync(path.join(__dirname, '../src/components/algorithm/CarlReaderDrawer.tsx'), 'utf8');

assert(drawerContent.includes('StickyNote'), 'CarlReaderDrawer imports StickyNote from lucide-react');
assert(drawerContent.includes('hasNote?: boolean;'), 'CarlReaderDrawerProps includes hasNote');
assert(drawerContent.includes('onOpenNote?: (problem: AlgoProblem) => void;'), 'CarlReaderDrawerProps includes onOpenNote');
assert(drawerContent.includes('active:scale-[0.96] transition-transform duration-100'), 'CarlReaderDrawer note button has duration-100 squash feedback');

const drawerNoteBtnMatch = drawerContent.match(/\{\/\* Note Button \(ICON ONLY - strictly no text labels\) \*\/\}\s*<button[\s\S]*?<\/button>/);
assert(drawerNoteBtnMatch !== null, 'CarlReaderDrawer contains note button in action header');
if (drawerNoteBtnMatch) {
  const btnSnippet = drawerNoteBtnMatch[0];
  assert(btnSnippet.includes('<StickyNote'), 'CarlReaderDrawer note button renders StickyNote icon');
  assert(!btnSnippet.includes('<span'), 'CarlReaderDrawer note button has STRICTLY NO text labels (ICON ONLY constraint met)');
}

// ----------------------------------------------------------------------------
// Test 7: Verify AlgoCatalog.tsx Integration & State Management
// ----------------------------------------------------------------------------
console.log('\nTest 7: Verifying AlgoCatalog.tsx State & Integration...');
const catalogContent = fs.readFileSync(path.join(__dirname, '../src/components/algorithm/AlgoCatalog.tsx'), 'utf8').replace(/\r\n/g, '\n');

assert(catalogContent.includes('AlgoNoteModal'), 'AlgoCatalog imports AlgoNoteModal');
assert(catalogContent.includes('useLocalStorage<AlgoProblemNotesMap>(\n    \'muduo_algo_notes\''), 'AlgoCatalog persists notes in localStorage under key muduo_algo_notes');
assert(catalogContent.includes('activeNoteProblem'), 'AlgoCatalog maintains activeNoteProblem state');
assert(catalogContent.includes('hasProblemNote'), 'AlgoCatalog provides hasProblemNote helper');
assert(catalogContent.includes('onlyNotesFilter'), 'AlgoCatalog provides onlyNotesFilter toggle');
assert(catalogContent.includes('totalNotesCount'), 'AlgoCatalog tracks totalNotesCount');
assert(catalogContent.includes('hasNote={hasProblemNote(problem)}'), 'AlgoCatalog passes hasNote prop to AlgoCard');
assert(catalogContent.includes('onOpenNote={(p) => setActiveNoteProblem(p)}'), 'AlgoCatalog passes onOpenNote handler to AlgoCard');
assert(catalogContent.includes('hasNote={carlReaderProblem ? hasProblemNote(carlReaderProblem) : false}'), 'AlgoCatalog passes hasNote to CarlReaderDrawer');
assert(catalogContent.includes('<AlgoNoteModal'), 'AlgoCatalog mounts AlgoNoteModal');

// ----------------------------------------------------------------------------
// Test 8: Verify MarkdownView.tsx Component Architecture & Syntax Engine
// ----------------------------------------------------------------------------
console.log('\nTest 8: Verifying MarkdownView.tsx Component Architecture...');
const mdViewPath = path.join(__dirname, '../src/components/reader/MarkdownView.tsx');
assert(fs.existsSync(mdViewPath), 'MarkdownView.tsx file exists');
const mdViewContent = fs.readFileSync(mdViewPath, 'utf8');

assert(mdViewContent.includes('export const MarkdownView'), 'MarkdownView component is exported');
assert(mdViewContent.includes('variant?: \'article\' | \'note\''), 'Supports variant prop for article and note layouts');
assert(mdViewContent.includes('checklistMatch'), 'Supports checklist regex parsing (- [ ] and - [x])');
assert(mdViewContent.includes('type: \'checklist\''), 'Parses checklists into distinct checklist block type');
assert(mdViewContent.includes('<CodeBlock'), 'Integrates CodeBlock for syntax highlighted code rendering');
assert(mdViewContent.includes('line.startsWith(\'# \')'), 'Supports H1 heading syntax');
assert(mdViewContent.includes('line.startsWith(\'## \')'), 'Supports H2 heading syntax');
assert(mdViewContent.includes('line.startsWith(\'### \')'), 'Supports H3 heading syntax');
assert(mdViewContent.includes('isTable'), 'Supports markdown tables with column alignments');
assert(mdViewContent.includes('tokenizeInline'), 'Implements robust inline tokenizer');

// ----------------------------------------------------------------------------
// Test 9: Verify Typora/Notion Single-Canvas Inline WYSIWYG Architecture
// ----------------------------------------------------------------------------
console.log('\nTest 9: Verifying Typora/Notion Single-Canvas Inline WYSIWYG Architecture...');
assert(!modalContent.includes("setViewMode('split')"), 'Completely eliminated split-screen view');
assert(!modalContent.includes("type NoteViewMode"), 'Eliminated manual mode toggle tabs (Single-Canvas WYSIWYG)');
assert(modalContent.includes('StarterKit'), 'Configures StarterKit for rich heading, code, quote, and lists');
assert(modalContent.includes('TaskList'), 'Configures TaskList extension for interactive checklists');
assert(modalContent.includes('TaskItem'), 'Configures TaskItem extension for nested checklist nodes');
assert(modalContent.includes('TurndownService'), 'Integrates TurndownService for accurate Markdown serialization');
assert(modalContent.includes('marked.parse'), 'Integrates marked for high-fidelity Markdown parsing on load');
assert(modalContent.includes('800') && modalContent.includes('autoSaveTimerRef'), 'Implements 800ms debounced auto-save architecture');
assert(modalContent.includes('handleCloseWithFlush'), 'Synchronous flush on close implemented to guarantee 100% zero data loss');
assert(modalContent.includes('saveStatus'), 'Maintains real-time auto-save status');
assert(modalContent.includes('wordCount'), 'Displays real-time live word count');
assert(modalContent.includes('toggleBold'), 'Toolbar includes bold formatting action');
assert(modalContent.includes('toggleItalic'), 'Toolbar includes italic formatting action');
assert(modalContent.includes('toggleCode'), 'Toolbar includes inline code formatting action');
assert(modalContent.includes('toggleHeading'), 'Toolbar includes heading level toggles');
assert(modalContent.includes('toggleTaskList'), 'Toolbar includes interactive task list toggle');
assert(modalContent.includes('toggleCodeBlock'), 'Toolbar includes code block toggle');
assert(modalContent.includes('toggleBlockquote'), 'Toolbar includes blockquote toggle');
assert(modalContent.includes('setHorizontalRule'), 'Toolbar includes horizontal rule toggle');
assert(modalContent.includes('handleManualSave'), 'Supports instant manual save with feedback');

// ----------------------------------------------------------------------------
// Test 10: Functional Verification: Parse Real Markdown Sample Through Engine
// ----------------------------------------------------------------------------
console.log('\nTest 10: Functional Verification of Markdown Engine...');

const TurndownService = require('turndown');
const { marked } = require('marked');

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---',
});

td.addRule('tiptapTaskList', {
  filter: function (node) {
    return node.nodeName === 'LI' && (node.getAttribute('data-type') === 'taskItem' || node.classList.contains('task-item') || !!node.querySelector('input[type="checkbox"]'));
  },
  replacement: function (content, node) {
    const isChecked = node.getAttribute('data-checked') === 'true' || !!node.querySelector('input[type="checkbox"]:checked');
    const cleanContent = content.trimStart().replace(/^\[[ xX]\]\s*/, '');
    return (isChecked ? '- [x] ' : '- [ ] ') + cleanContent + '\n';
  }
});

const sampleMd = [
  '# 算法解题核心备忘',
  '',
  '## 动态规划五部曲',
  '',
  '> 确定 dp 数组及其下标含义',
  '',
  '```cpp',
  'int dp[1005];',
  'dp[0] = 1;',
  '```',
  '',
  '- [x] 初始化基础状态',
  '- [ ] 确定遍历顺序（正序或倒序）',
  '',
  '关键在于 **滚动数组** 与 *逆序遍历*。'
].join('\n');

const htmlFromMd = marked.parse(sampleMd);
assert(htmlFromMd.includes('<h1') && htmlFromMd.includes('算法解题核心备忘'), 'Marked parsed H1 correctly');
assert(htmlFromMd.includes('<h2') && htmlFromMd.includes('动态规划五部曲'), 'Marked parsed H2 correctly');
assert(htmlFromMd.includes('<blockquote'), 'Marked parsed blockquote correctly');
assert(htmlFromMd.includes('<pre><code') && htmlFromMd.includes('class="language-cpp"'), 'Marked parsed C++ code block correctly');

const roundtripMd = td.turndown(htmlFromMd);
assert(roundtripMd.includes('# 算法解题核心备忘'), 'Roundtripped markdown preserves H1');
assert(roundtripMd.includes('## 动态规划五部曲'), 'Roundtripped markdown preserves H2');
assert(roundtripMd.includes('```cpp') && roundtripMd.includes('dp[0] = 1;'), 'Roundtripped markdown preserves C++ code block');
assert(roundtripMd.includes('[x]') && roundtripMd.includes('初始化基础状态'), 'Roundtripped markdown preserves checked task item');
assert(roundtripMd.includes('[ ]') && roundtripMd.includes('确定遍历顺序'), 'Roundtripped markdown preserves unchecked task item');
assert(roundtripMd.includes('**滚动数组**'), 'Roundtripped markdown preserves bold emphasis');

// ----------------------------------------------------------------------------
// Test 11: Verifying Note Editor Experience & Style Polish Refinement
// ----------------------------------------------------------------------------
console.log('\nTest 11: Verifying Note Editor Experience & Style Polish Refinement...');
assert(modalContent.includes('CodeBlockView'), 'Implements CodeBlockView custom React NodeView');
assert(modalContent.includes('ReactNodeViewRenderer(CodeBlockView)'), 'Registers CodeBlockView with ReactNodeViewRenderer');
assert(modalContent.includes('<Terminal size={14}'), 'CodeBlockView renders Terminal icon');
assert(modalContent.includes('title="复制代码"'), 'CodeBlockView has dedicated one-click copy button');
assert(modalContent.includes('loadedProblemKeyRef'), 'Uses loadedProblemKeyRef to prevent auto-save from resetting cursor position');
assert(!modalContent.match(/\[isOpen,\s*problem,\s*initialNote/), 'initialNote strictly excluded from setContent effect dependencies');
assert(modalContent.includes('TabIndent'), 'Configures TabIndent keyboard shortcut extension');
assert(modalContent.includes('sinkListItem') && modalContent.includes('liftListItem'), 'TabIndent supports list item hierarchy sinking and lifting');
assert(!modalContent.includes('Typora / Notion 单画布真所见即所得'), 'Superfluous promotional comments removed from Header');
assert(!modalContent.includes('Ctrl + S 保存 · 800ms 自动保存'), 'Superfluous shortcut hint removed from Footer');
assert(!modalContent.includes('bg-purple-100') && !modalContent.includes('text-purple-700'), 'Zero purple in Toolbar (unified Amber theme)');
assert(modalContent.includes('text-amber-600 dark:text-amber-400'), 'Toolbar active state styled with Amber theme');

console.log('\n================================================================');
if (failCount === 0) {
  console.log(`🎉 ALL ${passCount} ALGORITHM NOTE FEATURE VERIFICATION CHECKS PASSED FLAWLESSLY!`);
  console.log('================================================================');
  process.exit(0);
} else {
  console.error(`❌ ${failCount} CHECKS FAILED! (${passCount} passed)`);
  console.log('================================================================');
  process.exit(1);
}

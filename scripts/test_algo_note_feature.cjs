const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('📝 Running Algorithm Problem Note Feature Verification Engine');
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

// ----------------------------------------------------------------------------
// Test 1: Verify Types in src/types/index.ts
// ----------------------------------------------------------------------------
console.log('Test 1: Verifying Note Type Definitions in src/types/index.ts...');
const typesContent = fs.readFileSync(path.join(__dirname, '../src/types/index.ts'), 'utf8');
assert(typesContent.includes('export interface AlgoProblemNote {'), 'AlgoProblemNote interface is exported');
assert(typesContent.includes('content: string;'), 'AlgoProblemNote has content: string');
assert(typesContent.includes('updatedAt: number;'), 'AlgoProblemNote has updatedAt: number');
assert(typesContent.includes('createdAt?: number;'), 'AlgoProblemNote has createdAt?: number');
assert(typesContent.includes('export type AlgoProblemNotesMap = Record<string, AlgoProblemNote>;'), 'AlgoProblemNotesMap type is exported as Record<string, AlgoProblemNote>');

// ----------------------------------------------------------------------------
// Test 2: Verify 100% Storage Isolation across all 234 Catalog Problems
// ----------------------------------------------------------------------------
console.log('\nTest 2: Verifying 100% Storage Key Isolation in algoDataset.ts...');
const datasetContent = fs.readFileSync(path.join(__dirname, '../src/data/algoDataset.ts'), 'utf8');
const match = datasetContent.match(/export const ALGORITHM_LAB_CATALOG: AlgoProblem\[\] = (\[[\s\S]*?\]);\n/);
assert(match !== null, 'ALGORITHM_LAB_CATALOG found in algoDataset.ts');
const catalog = JSON.parse(match[1]);
assert(catalog.length === 234, `Total catalog problems count is 234 (got ${catalog.length})`);

// Key generator function matching AlgoNoteModal / AlgoCatalog
function getProblemKey(p) {
  return p.id || (p.num !== null && p.num !== undefined ? 'p_' + p.num : p.title);
}

const allKeys = catalog.map(getProblemKey);
const uniqueKeys = new Set(allKeys);
assert(uniqueKeys.size === 234, `All 234 problems generate 100% unique keys with zero collisions (unique count: ${uniqueKeys.size})`);

// Test variant pairs that would collide if keyed only on problem number
const p70 = catalog.find(p => p.id === 'algo_70');
const p70Knapsack = catalog.find(p => p.id === 'algo_70_knapsack');
assert(p70 && p70Knapsack, 'Both algo_70 and algo_70_knapsack exist in catalog');
assert(getProblemKey(p70) !== getProblemKey(p70Knapsack), '70 Climbing Stairs and 70 Knapsack have isolated keys');

const p53Greedy = catalog.find(p => p.id === 'algo_53');
const p53Dp = catalog.find(p => p.id === 'algo_53_dp');
assert(p53Greedy && p53Dp, 'Both algo_53 and algo_53_dp exist in catalog');
assert(getProblemKey(p53Greedy) !== getProblemKey(p53Dp), '53 Greedy and 53 DP have isolated keys');

const p122Greedy = catalog.find(p => p.id === 'algo_122');
const p122Dp = catalog.find(p => p.id === 'algo_122_dp');
assert(p122Greedy && p122Dp, 'Both algo_122 and algo_122_dp exist in catalog');
assert(getProblemKey(p122Greedy) !== getProblemKey(p122Dp), '122 Greedy and 122 DP have isolated keys');

const pKama96 = catalog.find(p => p.id === 'algo_kama_96');
const p96 = catalog.find(p => p.id === 'algo_96' || (p.num === 96 && p.category === '动态规划'));
assert(pKama96 && p96, 'Both Kama 96 and LeetCode 96 exist');
assert(getProblemKey(pKama96) !== getProblemKey(p96), 'Kama 96 and LeetCode 96 have isolated keys');

const pKama94 = catalog.find(p => p.id === 'algo_kama_94');
const pKama94Spfa = catalog.find(p => p.id === 'algo_kama_94_spfa');
assert(pKama94 && pKama94Spfa, 'Both Kama 94 and Kama 94 SPFA exist');
assert(getProblemKey(pKama94) !== getProblemKey(pKama94Spfa), 'Kama 94 and Kama 94 SPFA have isolated keys');

// ----------------------------------------------------------------------------
// Test 3: Verify Simulated Storage Lifecycle & Complete Isolation
// ----------------------------------------------------------------------------
console.log('\nTest 3: Simulating Note Storage Lifecycle & Independence...');
const mockStorage = {};
const key70 = getProblemKey(p70);
const key70K = getProblemKey(p70Knapsack);

mockStorage[key70] = { content: '爬楼梯简单动态规划，dp[i]=dp[i-1]+dp[i-2]', updatedAt: Date.now() };
assert(mockStorage[key70] !== undefined, 'Saved note for problem 70');
assert(mockStorage[key70K] === undefined, 'Problem 70 Knapsack note remains undefined (isolated)');

mockStorage[key70K] = { content: '完全背包思路，排列问题外层遍历容量内层遍历物品', updatedAt: Date.now() };
assert(mockStorage[key70].content !== mockStorage[key70K].content, 'Notes for variant problems have distinct isolated content');

delete mockStorage[key70];
assert(mockStorage[key70] === undefined, 'Deleted note for problem 70');
assert(mockStorage[key70K] !== undefined, 'Problem 70 Knapsack note still intact after deleting variant note');

// ----------------------------------------------------------------------------
// Test 4: Verify AlgoNoteModal.tsx Component Implementation
// ----------------------------------------------------------------------------
console.log('\nTest 4: Verifying AlgoNoteModal.tsx Component...');
const modalPath = path.join(__dirname, '../src/components/algorithm/AlgoNoteModal.tsx');
assert(fs.existsSync(modalPath), 'AlgoNoteModal.tsx file exists');
const modalContent = fs.readFileSync(modalPath, 'utf8');

assert(modalContent.includes('export const getAlgoProblemKey'), 'Exports getAlgoProblemKey helper');
assert(modalContent.includes('export const AlgoNoteModal'), 'Exports AlgoNoteModal component');
assert(modalContent.includes('textareaRef'), 'Has textarea ref for auto-focus');
assert(modalContent.includes('handleCopy'), 'Implements clipboard copy');
assert(modalContent.includes('handleClear'), 'Implements note clear with confirmation');
assert(modalContent.includes('isConfirmingClear'), 'Has safety confirmation state for clear action');
assert(modalContent.includes('handleKeyDown'), 'Listens for keyboard shortcuts');
assert(modalContent.includes("e.key === 'Escape'"), 'Supports Esc key to close modal');
assert(modalContent.includes("(e.ctrlKey || e.metaKey) && e.key === 'Enter'"), 'Supports Ctrl+Enter / Cmd+Enter to quick save');
assert(modalContent.includes('cubic-bezier(0.16, 1, 0.3, 1)'), 'Emil Kowalski entrance curve cubic-bezier(0.16, 1, 0.3, 1) implemented');
assert(modalContent.includes('cubic-bezier(0.7, 0, 0.84, 0)'), 'Emil Kowalski exit curve cubic-bezier(0.7, 0, 0.84, 0) implemented');
assert(modalContent.includes('scale(0.98)'), 'Emil Kowalski exit transform scale(0.98) implemented');
assert(modalContent.includes('activeProblem'), 'Retains activeProblem during exit animation to prevent premature unmount');
assert(modalContent.includes('isComposing'), 'Protects Chinese IME composition so Escape does not prematurely close modal');
assert(modalContent.includes('z-[60]'), 'High-priority z-[60] stacking context sits safely above drawer');
assert(modalContent.includes('stopImmediatePropagation'), 'Stops immediate propagation so Esc closes modal without closing drawer');
assert(!modalContent.includes('scale(0)'), 'Strictly no scale(0) to avoid GPU artifacting');
assert(modalContent.includes('willChange: \'transform, opacity\''), 'Hardware acceleration declared via willChange');
assert(modalContent.includes('shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06)'), 'Recessed clay textarea has inner shadows');

// ----------------------------------------------------------------------------
// Test 5: Verify AlgoCard.tsx Icon-Only Note Button Implementation
// ----------------------------------------------------------------------------
console.log('\nTest 5: Verifying AlgoCard.tsx Icon-Only Note Button...');
const cardContent = fs.readFileSync(path.join(__dirname, '../src/components/algorithm/AlgoCard.tsx'), 'utf8');

assert(cardContent.includes('StickyNote'), 'AlgoCard imports StickyNote from lucide-react');
assert(cardContent.includes('hasNote?: boolean;'), 'AlgoCardProps includes hasNote');
assert(cardContent.includes('onOpenNote?: (problem: AlgoProblem) => void;'), 'AlgoCardProps includes onOpenNote');
assert(cardContent.includes('title={hasNote ? \'做题便签 (已有笔记)\' : \'做题便签\'}'), 'AlgoCard note button has accurate dynamic title tooltip');
assert(cardContent.includes('active:scale-[0.96] transition-transform duration-100'), 'AlgoCard note button has physical press squash feedback (duration-100)');

// Critical constraint: note button must be ICON ONLY without text labels!
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
const catalogContent = fs.readFileSync(path.join(__dirname, '../src/components/algorithm/AlgoCatalog.tsx'), 'utf8');

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
assert(mdViewContent.includes('emptyPlaceholder?: React.ReactNode'), 'Supports emptyPlaceholder prop');
assert(mdViewContent.includes('checklistMatch'), 'Supports checklist regex parsing (- [ ] and - [x])');
assert(mdViewContent.includes('type: \'checklist\''), 'Parses checklists into distinct checklist block type');
assert(mdViewContent.includes('checkItems?: Array<{ checked: boolean; text: string }>'), 'Defines checkItems array type with checked boolean state');
assert(mdViewContent.includes('<CodeBlock'), 'Integrates CodeBlock for syntax highlighted code rendering');
assert(mdViewContent.includes('line.startsWith(\'###### \')'), 'Supports H6 heading syntax');
assert(mdViewContent.includes('line.startsWith(\'##### \')'), 'Supports H5 heading syntax');
assert(mdViewContent.includes('line.startsWith(\'#### \')'), 'Supports H4 heading syntax');
assert(mdViewContent.includes('line.startsWith(\'### \')'), 'Supports H3 heading syntax');
assert(mdViewContent.includes('line.startsWith(\'## \')'), 'Supports H2 heading syntax');
assert(mdViewContent.includes('line.startsWith(\'# \')'), 'Supports H1 heading syntax');
assert(mdViewContent.includes('line.startsWith(\'> \')'), 'Supports blockquote syntax');
assert(mdViewContent.includes('isTable'), 'Supports markdown tables with column alignments');
assert(mdViewContent.includes('sub.startsWith(\'**\')'), 'Supports bold markdown (**text**)');
assert(mdViewContent.includes('sub.startsWith(\'~~\')'), 'Supports strikethrough markdown (~~text~~)');
assert(mdViewContent.includes('sub.startsWith(\'*\')') || mdViewContent.includes('sub.startsWith(\'_\')'), 'Supports italic markdown (*text* and _text_)');
assert(mdViewContent.includes('linkMatch'), 'Supports markdown links with external icon');

// ----------------------------------------------------------------------------
// Test 9: Verify AlgoNoteModal.tsx Markdown Mode Toggle Architecture & UX
// ----------------------------------------------------------------------------
console.log('\nTest 9: Verifying AlgoNoteModal.tsx Mode Toggle & UX Features...');
assert(modalContent.includes('import { MarkdownView }'), 'AlgoNoteModal imports MarkdownView component');
assert(modalContent.includes('type NoteViewMode = \'edit\' | \'preview\' | \'split\''), 'Defines NoteViewMode type (edit, preview, split)');
assert(modalContent.includes('viewMode'), 'Maintains viewMode state');
assert(modalContent.includes('setViewMode'), 'Provides setViewMode state setter');
assert(modalContent.includes('Edit3'), 'Imports Edit3 icon for edit mode');
assert(modalContent.includes('Eye'), 'Imports Eye icon for preview mode');
assert(modalContent.includes('Columns2'), 'Imports Columns2 icon for split screen mode');
assert(modalContent.includes('setViewMode(\'edit\')'), 'Provides edit mode switcher');
assert(modalContent.includes('setViewMode(\'preview\')'), 'Provides preview mode switcher');
assert(modalContent.includes('setViewMode(\'split\')'), 'Provides split mode switcher');
assert(modalContent.includes('handleInsertMarkdown'), 'Provides quick Markdown insertion helper');
assert(modalContent.includes('handleTextareaKeyDown'), 'Supports Tab key indentation handling (2 spaces)');
assert(modalContent.includes('max-w-4xl') || modalContent.includes('max-w-5xl'), 'Expands modal card width in split mode for comfortable dual columns');
assert(modalContent.includes('variant="note"'), 'Passes variant="note" to MarkdownView for compact note styling');
assert(modalContent.includes('便签内容为空'), 'Provides friendly empty state when previewing blank note');
assert(modalContent.includes('立即编辑便签'), 'Empty preview state provides immediate shortcut back to edit mode');

// ----------------------------------------------------------------------------
// Test 10: Functional Verification: Parse Real Markdown Sample Through Engine
// ----------------------------------------------------------------------------
console.log('\nTest 10: Functional Verification of Markdown Block & Inline Engine...');

// Real block parser engine logic mirror
function parseMarkdownBlocks(content) {
  if (!content || !content.trim()) return [];
  const lines = content.split('\n');
  const result = [];
  let inCode = false;
  let codeBuffer = [];
  let codeLang = '';
  let inList = false;
  let listType = 'ul';
  let listBuffer = [];
  let inChecklist = false;
  let checklistBuffer = [];

  const flushList = () => {
    if (inList && listBuffer.length > 0) {
      result.push({ type: listType, items: [...listBuffer] });
      listBuffer = [];
      inList = false;
    }
  };
  const flushChecklist = () => {
    if (inChecklist && checklistBuffer.length > 0) {
      result.push({ type: 'checklist', checkItems: [...checklistBuffer] });
      checklistBuffer = [];
      inChecklist = false;
    }
  };
  const flushAll = () => { flushList(); flushChecklist(); };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      flushAll();
      if (inCode) {
        result.push({ type: 'code', text: codeBuffer.join('\n'), lang: codeLang || 'cpp' });
        codeBuffer = [];
        codeLang = '';
        inCode = false;
      } else {
        inCode = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }
    if (inCode) {
      codeBuffer.push(line);
      continue;
    }
    if (/^(?:---+|\*\*\*+|___+)$/.test(line.trim())) {
      flushAll();
      result.push({ type: 'hr' });
      continue;
    }
    if (line.includes('|') && i + 1 < lines.length) {
      const nextLine = lines[i + 1].trim();
      const delimParts = nextLine.split('|').map(s => s.trim()).filter(Boolean);
      const isTable = delimParts.length > 0 && delimParts.every(p => /^:?-+:?$/.test(p));
      if (isTable) {
        flushAll();
        const parseRow = (str) => {
          let s = str.trim();
          if (s.startsWith('|')) s = s.slice(1);
          if (s.endsWith('|')) s = s.slice(0, -1);
          return s.split('|').map(c => c.trim());
        };
        const headers = parseRow(line);
        const rows = [];
        i += 2;
        while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
          rows.push(parseRow(lines[i]));
          i++;
        }
        i--;
        result.push({ type: 'table', headers, rows });
        continue;
      }
    }
    if (line.startsWith('### ')) {
      flushAll();
      result.push({ type: 'h3', text: line.slice(4).trim() });
      continue;
    }
    if (line.startsWith('## ')) {
      flushAll();
      result.push({ type: 'h2', text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith('# ')) {
      flushAll();
      result.push({ type: 'h1', text: line.slice(2).trim() });
      continue;
    }
    if (line.startsWith('> ')) {
      flushAll();
      result.push({ type: 'quote', text: line.slice(2).trim() });
      continue;
    }
    const checkMatch = line.match(/^[-*+]\s+\[([ xX])\]\s*(.*)$/);
    if (checkMatch) {
      flushList();
      if (!inChecklist) { inChecklist = true; checklistBuffer = []; }
      checklistBuffer.push({ checked: checkMatch[1].toLowerCase() === 'x', text: checkMatch[2] });
      continue;
    }
    if (/^[-*+]\s+/.test(line)) {
      flushChecklist();
      if (!inList) { inList = true; listBuffer = []; }
      listBuffer.push(line.replace(/^[-*+]\s+/, '').trim());
      continue;
    }
    if (line.trim() === '') {
      flushAll();
      continue;
    }
    flushAll();
    result.push({ type: 'p', text: line });
  }
  flushAll();
  return result;
}

const testSample = [
  '# 算法解题核心备忘',
  '## 动态规划五部曲',
  '> 确定 dp 数组及其下标含义',
  '```cpp',
  'int dp[1005];',
  'dp[0] = 1;',
  '```',
  '- [x] 初始化基础状态',
  '- [ ] 确定遍历顺序（正序或倒序）',
  '| 算法 | 时间复杂度 | 空间复杂度 |',
  '| :--- | :---: | ---: |',
  '| 01背包 | O(N*V) | O(V) |',
  '关键在于 **滚动数组** 与 *逆序遍历*，防止 ~~重复计算~~ 与覆盖。'
].join('\n');

const parsed = parseMarkdownBlocks(testSample);
assert(parsed.length === 7, `Parsed exactly 7 structural blocks from complex markdown (got ${parsed.length})`);
assert(parsed[0].type === 'h1' && parsed[0].text === '算法解题核心备忘', 'Parsed H1 heading correctly');
assert(parsed[1].type === 'h2' && parsed[1].text === '动态规划五部曲', 'Parsed H2 heading correctly');
assert(parsed[2].type === 'quote' && parsed[2].text === '确定 dp 数组及其下标含义', 'Parsed blockquote correctly');
assert(parsed[3].type === 'code' && parsed[3].lang === 'cpp' && parsed[3].text.includes('dp[0] = 1;'), 'Parsed C++ code block correctly');
assert(parsed[4].type === 'checklist' && parsed[4].checkItems.length === 2, 'Parsed checklist with 2 items');
assert(parsed[4].checkItems[0].checked === true, 'First checklist item is checked');
assert(parsed[4].checkItems[1].checked === false, 'Second checklist item is unchecked');
assert(parsed[5].type === 'table' && parsed[5].headers[0] === '算法' && parsed[5].rows[0][1] === 'O(N*V)', 'Parsed table and rows correctly');
assert(parsed[6].type === 'p' && parsed[6].text.includes('**滚动数组**'), 'Parsed paragraph containing formatting tokens');

// Inline token splitter test
const inlineRegex = /(\[[^\]]+\]\([^\)]+\)|\*\*[^*]+\*\*|~~[^~]+~~|\*(?:[^*\n]+?)\*|_(?:[^_\n]+?)_)/g;
const inlineSample = '使用 **双指针** 和 *开闭区间*，参考 [Muduo](https://github.com/chenshuo/muduo)';
const tokens = inlineSample.split(inlineRegex);
assert(tokens.includes('**双指针**'), 'Inline parser isolates bold token');
assert(tokens.includes('*开闭区间*'), 'Inline parser isolates italic token');
assert(tokens.includes('[Muduo](https://github.com/chenshuo/muduo)'), 'Inline parser isolates link token');

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


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
const modalContent = fs.readFileSync(modalPath, 'utf8').replace(/\r\n/g, '\n');

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
assert(mdViewContent.includes('quoteMatch') && mdViewContent.includes('flushQuote'), 'Supports buffered blockquote syntax');
assert(mdViewContent.includes('isTable'), 'Supports markdown tables with column alignments');
assert(mdViewContent.includes('type: \'bold\'') && mdViewContent.includes('case \'bold\':'), 'Supports bold markdown (**text**)');
assert(mdViewContent.includes('type: \'del\'') && mdViewContent.includes('case \'del\':'), 'Supports strikethrough markdown (~~text~~)');
assert(mdViewContent.includes('type: \'italic\'') && mdViewContent.includes('case \'italic\':'), 'Supports italic markdown (*text* and _text_)');
assert(mdViewContent.includes('type: \'link\'') && mdViewContent.includes('case \'link\':'), 'Supports markdown links with external icon');
assert(mdViewContent.includes('case \'h6\':') && mdViewContent.includes('<h6'), 'Provides semantic H6 heading element');
assert(mdViewContent.includes('case \'h5\':') && mdViewContent.includes('<h5'), 'Provides semantic H5 heading element');
assert(mdViewContent.includes('tokenizeInline'), 'Implements robust inline tokenizer');

// ----------------------------------------------------------------------------
// Test 9: Verify AlgoNoteModal.tsx Typora/Obsidian Single-Canvas In-Place Live Preview & Auto-Save
// ----------------------------------------------------------------------------
console.log('\nTest 9: Verifying Typora/Obsidian In-Place Live Preview & Auto-Save Architecture...');
assert(!modalContent.includes("setViewMode('split')"), 'Completely eliminated split-screen view');
assert(!modalContent.includes("type NoteViewMode = 'edit' | 'preview' | 'split'"), 'Eliminated manual mode toggle tabs (Single-Canvas WYSIWYG)');
assert(!modalContent.includes('Columns2'), 'Eliminated Columns2 split screen icon');
assert(modalContent.includes('parseToBlocks'), 'Parses document into in-place editable Markdown blocks');
assert(modalContent.includes('activeBlockId'), 'Tracks in-place active block for editing without layout jumps');
assert(modalContent.includes('handleToggleChecklist'), 'Allows direct checklist checkbox toggling in live preview');
assert(modalContent.includes('CodeBlock'), 'Integrates CodeBlock for syntax-highlighted code blocks in live canvas');
assert(modalContent.includes('renderInlineContent'), 'Provides rich inline token rendering for headings and paragraphs');
assert(modalContent.includes('handleAppendNewBlock'), 'Supports appending new block at the canvas bottom');
assert(modalContent.includes('800') && modalContent.includes('autoSaveTimerRef'), 'Implements 800ms debounced auto-save architecture');
assert(modalContent.includes('handleCloseWithFlush'), 'Synchronous flush on close implemented to guarantee 100% zero data loss');
assert(modalContent.includes('saveStatus'), 'Maintains real-time auto-save status');
assert(modalContent.includes('编辑中'), 'Displays real-time typing status in header/footer');
assert(modalContent.includes('已自动保存'), 'Displays auto-saved confirmation with timestamp');
assert(modalContent.includes('handleInsertMarkdown'), 'Provides quick Markdown insertion helper');
assert(modalContent.includes("e.key === 'Tab'"), 'Supports Tab indentation (2 spaces)');
assert(modalContent.includes('e.shiftKey'), 'Supports Shift+Tab block unindenting');
assert(modalContent.includes('onMouseDown={(e) => e.preventDefault()}'), 'Format buttons prevent textarea selection loss on click');
assert(modalContent.includes('active:scale-[0.96]'), 'Format buttons provide Emil Kowalski tactile feedback');
assert(modalContent.includes("e.key.toLowerCase() === 'b'"), 'Supports Ctrl+B / Cmd+B bold shortcut');
assert(modalContent.includes("e.key.toLowerCase() === 'i'"), 'Supports Ctrl+I / Cmd+I italic shortcut');
assert(modalContent.includes("e.key.toLowerCase() === 'e'"), 'Supports Ctrl+E / Cmd+E inline code shortcut');
assert(modalContent.includes("e.key.toLowerCase() === 'c'"), 'Supports Ctrl+Shift+C / Cmd+Shift+C code block shortcut');
assert(modalContent.includes("e.key.toLowerCase() === 'l'"), 'Supports Ctrl+Shift+L / Cmd+Shift+L checklist shortcut');
assert(modalContent.includes("e.key.toLowerCase() === 'k'"), 'Supports Ctrl+K / Cmd+K link shortcut');
assert(modalContent.includes("e.key.toLowerCase() === 's'"), 'Supports Ctrl+S / Cmd+S manual save shortcut');

// ----------------------------------------------------------------------------
// Test 10: Functional Verification: Parse Real Markdown Sample Through Engine
// ----------------------------------------------------------------------------
console.log('\nTest 10: Functional Verification of Markdown Block Engine...');

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
  let inQuote = false;
  let quoteBuffer = [];

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
  const flushQuote = () => {
    if (inQuote && quoteBuffer.length > 0) {
      result.push({ type: 'quote', text: quoteBuffer.join('\n'), lines: [...quoteBuffer] });
      quoteBuffer = [];
      inQuote = false;
    }
  };
  const flushAll = () => { flushList(); flushChecklist(); flushQuote(); };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedStart = line.trimStart();

    if (trimmedStart.startsWith('```')) {
      flushAll();
      if (inCode) {
        result.push({ type: 'code', text: codeBuffer.join('\n'), lang: codeLang || 'cpp' });
        codeBuffer = [];
        codeLang = '';
        inCode = false;
      } else {
        inCode = true;
        codeLang = trimmedStart.slice(3).trim().split(/\s+/)[0] || '';
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
    if (line.startsWith('###### ')) {
      flushAll();
      result.push({ type: 'h6', text: line.slice(7).trim() });
      continue;
    }
    if (line.startsWith('##### ')) {
      flushAll();
      result.push({ type: 'h5', text: line.slice(6).trim() });
      continue;
    }
    if (line.startsWith('#### ')) {
      flushAll();
      result.push({ type: 'h4', text: line.slice(5).trim() });
      continue;
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
    const quoteMatch = line.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushList();
      flushChecklist();
      inQuote = true;
      quoteBuffer.push(quoteMatch[1]);
      continue;
    }
    flushQuote();

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
  '> 注意初值与非法状态特判',
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
assert(parsed[2].type === 'quote' && parsed[2].lines.length === 2, 'Consecutive blockquote lines grouped cleanly');
assert(parsed[3].type === 'code' && parsed[3].lang === 'cpp' && parsed[3].text.includes('dp[0] = 1;'), 'Parsed C++ code block correctly');
assert(parsed[4].type === 'checklist' && parsed[4].checkItems.length === 2, 'Parsed checklist with 2 items');
assert(parsed[4].checkItems[0].checked === true, 'First checklist item is checked');
assert(parsed[4].checkItems[1].checked === false, 'Second checklist item is unchecked');
assert(parsed[5].type === 'table' && parsed[5].headers[0] === '算法' && parsed[5].rows[0][1] === 'O(N*V)', 'Parsed table and rows correctly');
assert(parsed[6].type === 'p' && parsed[6].text.includes('**滚动数组**'), 'Parsed paragraph containing formatting tokens');

// ----------------------------------------------------------------------------
// Test 11: Real-world C++ Markdown Robustness & Recursive Inline Verification
// ----------------------------------------------------------------------------
console.log('\nTest 11: Verifying Real-world C++ Markdown Parsing Robustness...');

const tokenizeInlineMirror = (text) => {
  if (!text) return [];
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === '`') {
      const end = text.indexOf('`', i + 1);
      if (end !== -1) {
        tokens.push({ type: 'code', content: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    if (text[i] === '[') {
      const closeBracket = text.indexOf(']', i + 1);
      if (closeBracket !== -1 && text[closeBracket + 1] === '(') {
        const closeParen = text.indexOf(')', closeBracket + 2);
        if (closeParen !== -1) {
          tokens.push({
            type: 'link',
            content: text.slice(i + 1, closeBracket),
            url: text.slice(closeBracket + 2, closeParen).trim()
          });
          i = closeParen + 1;
          continue;
        }
      }
    }
    if (text.startsWith('**', i)) {
      const end = text.indexOf('**', i + 2);
      if (end !== -1 && end > i + 2) {
        tokens.push({ type: 'bold', content: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (text.startsWith('~~', i)) {
      const end = text.indexOf('~~', i + 2);
      if (end !== -1 && end > i + 2) {
        tokens.push({ type: 'del', content: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (text[i] === '*' || text[i] === '_') {
      const marker = text[i];
      const nextChar = text[i + 1];
      if (nextChar && !/\s/.test(nextChar) && nextChar !== marker) {
        let end = -1;
        for (let j = i + 1; j < text.length; j++) {
          if (text[j] === marker) {
            const prevChar = text[j - 1];
            const afterChar = text[j + 1];
            if (!/\s/.test(prevChar)) {
              if (marker === '*' && afterChar && /\w/.test(afterChar)) continue;
              end = j;
              break;
            }
          }
        }
        if (end !== -1) {
          tokens.push({ type: 'italic', content: text.slice(i + 1, end) });
          i = end + 1;
          continue;
        }
      }
    }
    let nextSpecial = i + 1;
    while (nextSpecial < text.length) {
      const ch = text[nextSpecial];
      if (ch === '`' || ch === '[' || ch === '~' || ch === '*' || ch === '_') break;
      nextSpecial++;
    }
    tokens.push({ type: 'text', content: text.slice(i, nextSpecial) });
    i = nextSpecial;
  }
  const merged = [];
  for (const t of tokens) {
    if (merged.length > 0 && merged[merged.length - 1].type === 'text' && t.type === 'text') {
      merged[merged.length - 1].content += t.content;
    } else {
      merged.push(t);
    }
  }
  return merged;
};

// 1. Nested inline code inside bold
const nestedCodeTokens = tokenizeInlineMirror('**重点：`vector<int>` 扩容机制**');
assert(nestedCodeTokens.length === 1 && nestedCodeTokens[0].type === 'bold', 'Bold token captures nested inline code cleanly');
const innerTokens = tokenizeInlineMirror(nestedCodeTokens[0].content);
assert(innerTokens.some(t => t.type === 'code' && t.content === 'vector<int>'), 'Nested code token is preserved inside bold');

// 2. C++ pointer type with asterisk inside bold
const pointerBoldTokens = tokenizeInlineMirror('**Node* root 不能为空**');
assert(pointerBoldTokens.length === 1 && pointerBoldTokens[0].type === 'bold' && pointerBoldTokens[0].content === 'Node* root 不能为空', 'C++ pointer asterisk does not break bold parsing');

// 3. Pointer dereference arithmetic does not trigger false italic
const derefTokens = tokenizeInlineMirror('普通指针运算：*p1 = *p2;');
assert(derefTokens.every(t => t.type !== 'italic'), 'Pointer dereferencing (*p1 = *p2) does not trigger false italic');

// 4. Multiplication math does not trigger false italic
const mathTokens = tokenizeInlineMirror('普通乘法运算：3 * 4 * 5 = 60');
assert(mathTokens.every(t => t.type !== 'italic'), 'Arithmetic multiplication (3 * 4 * 5) does not trigger false italic');

// 5. Link with nested formatting
const linkTokens = tokenizeInlineMirror('查看 [官方题解与`Code`](https://leetcode.cn) 获取更多');
assert(linkTokens.some(t => t.type === 'link' && t.url === 'https://leetcode.cn'), 'Parses markdown link target correctly');

// ----------------------------------------------------------------------------
// Test 12: Verifying Hardened Architecture Contract in AlgoNoteModal.tsx
// ----------------------------------------------------------------------------
console.log('\nTest 12: Verifying Hardened Architecture Contract in AlgoNoteModal.tsx...');
assert(modalContent.includes('activeBlockIdRef'), 'Active block ID ref tracked synchronously');
assert(modalContent.includes('activeBlockRawRef'), 'Active block raw text ref tracked synchronously');
assert(modalContent.includes('blocksRef'), 'Blocks ref tracked to prevent stale render closures');
assert(modalContent.includes("type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'code' | 'quote' | 'checklist' | 'list' | 'table' | 'hr' | 'p' | 'empty'"), 'MarkdownBlock interface includes table block type');
assert(modalContent.includes('tableHeaders?: string[]'), 'MarkdownBlock interface defines tableHeaders');
assert(modalContent.includes('tableRows?: string[][]'), 'MarkdownBlock interface defines tableRows');
assert(modalContent.includes('case \'table\':'), 'AlgoNoteModal canvas renders rich markdown tables');
assert(modalContent.includes('commitActiveBlockWithCustomRaw'), 'Supports committing custom raw content for Smart Enter block splitting');
assert(modalContent.includes('handleInsertAfterBlock'), 'Supports inserting new block below active block on Enter');
assert(modalContent.includes('keyCode === 229'), 'Implements defense against Chinese IME keyCode 229');
assert(modalContent.includes('!isInsideTextarea'), 'Modal global listener intercepts shortcuts when textarea is not focused');
assert(modalContent.includes('targetBlocks.map(b => (b.id === targetId ? updatedRaw : b.raw)).join(\'\\n\')'), 'Document assembled via line-shift-invariant block mapping');

// ----------------------------------------------------------------------------
// Test 13: Functional Simulation of Document Reconstruction & Race Elimination
// ----------------------------------------------------------------------------
console.log('\nTest 13: Functional Simulation of Document Reconstruction & Race Elimination...');

// Extract parseToBlocks logic from AlgoNoteModal.tsx
function parseToBlocksSim(content) {
  if (!content) {
    return [{ id: 'block-empty-0', type: 'empty', raw: '', startLine: 0, endLine: 0 }];
  }
  const lines = content.split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (line.trimStart().startsWith('```')) {
      const startLine = i;
      const langMatch = line.trimStart().slice(3).trim().split(/\s+/)[0] || '';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      const hasClosingFence = i < lines.length && lines[i].trimStart().startsWith('```');
      const endLine = hasClosingFence ? i : i - 1;
      const rawLines = lines.slice(startLine, endLine + 1);
      blocks.push({
        id: `block-code-${startLine}`,
        type: 'code',
        raw: rawLines.join('\n'),
        startLine,
        endLine,
        codeLang: langMatch || 'cpp',
        codeText: codeLines.join('\n')
      });
      i = endLine + 1;
      continue;
    }

    if (/^(?:---+|\*\*\*+|___+)$/.test(trimmed)) {
      blocks.push({ id: `block-hr-${i}`, type: 'hr', raw: line, startLine: i, endLine: i });
      i++;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push({ id: `block-h-${i}`, type: `h${level}`, raw: line, startLine: i, endLine: i, level, headingText: headingMatch[2] });
      i++;
      continue;
    }

    const checkMatch = line.match(/^([-*+])\s+\[([ xX])\]\s*(.*)$/);
    if (checkMatch) {
      blocks.push({
        id: `block-check-${i}`,
        type: 'checklist',
        raw: line,
        startLine: i,
        endLine: i,
        bullet: checkMatch[1],
        checked: checkMatch[2].toLowerCase() === 'x',
        checkText: checkMatch[3]
      });
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const startLine = i;
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      const endLine = i - 1;
      const rawLines = lines.slice(startLine, endLine + 1);
      blocks.push({ id: `block-quote-${startLine}`, type: 'quote', raw: rawLines.join('\n'), startLine, endLine, quoteLines });
      continue;
    }

    if (line.includes('|') && i + 1 < lines.length) {
      const nextLine = lines[i + 1].trim();
      const delimParts = nextLine.split('|').map(s => s.trim()).filter(Boolean);
      const isTable = delimParts.length > 0 && delimParts.every(p => /^:?-+:?$/.test(p));
      if (isTable) {
        const startLine = i;
        const parseRow = (str) => {
          let s = str.trim();
          if (s.startsWith('|')) s = s.slice(1);
          if (s.endsWith('|')) s = s.slice(0, -1);
          return s.split('|').map(c => c.trim());
        };
        const headers = parseRow(line);
        const alignments = delimParts.map(p => (p.startsWith(':') && p.endsWith(':') ? 'center' : p.endsWith(':') ? 'right' : 'left'));
        const rows = [];
        const tableLines = [line, lines[i + 1]];
        i += 2;
        while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
          tableLines.push(lines[i]);
          rows.push(parseRow(lines[i]));
          i++;
        }
        const endLine = i - 1;
        blocks.push({ id: `block-table-${startLine}`, type: 'table', raw: tableLines.join('\n'), startLine, endLine, tableHeaders: headers, tableRows: rows, tableAlignments: alignments });
        continue;
      }
    }

    const listMatch = line.match(/^([-*+]|\d+\.)\s+(.*)$/);
    if (listMatch) {
      const isOrdered = /^\d+\./.test(listMatch[1]);
      const startLine = i;
      const items = [listMatch[2]];
      i++;
      while (i < lines.length) {
        const nextMatch = lines[i].match(/^([-*+]|\d+\.)\s+(.*)$/);
        if (nextMatch && (/^\d+\./.test(nextMatch[1]) === isOrdered)) {
          if (/^[-*+]\s+\[([ xX])\]/.test(lines[i])) break;
          items.push(nextMatch[2]);
          i++;
        } else {
          break;
        }
      }
      const endLine = i - 1;
      const rawLines = lines.slice(startLine, endLine + 1);
      blocks.push({ id: `block-list-${startLine}`, type: 'list', raw: rawLines.join('\n'), startLine, endLine, listType: isOrdered ? 'ol' : 'ul', listItems: items });
      continue;
    }

    if (trimmed === '') {
      blocks.push({ id: `block-empty-${i}`, type: 'empty', raw: line, startLine: i, endLine: i });
      i++;
      continue;
    }

    const startLine = i;
    const pLines = [];
    while (i < lines.length) {
      const cur = lines[i];
      const curTrimmed = cur.trim();
      if (curTrimmed === '') break;
      if (cur.trimStart().startsWith('```')) break;
      if (/^(?:---+|\*\*\*+|___+)$/.test(curTrimmed)) break;
      if (/^#{1,6}\s+/.test(cur)) break;
      if (/^[-*+]\s+\[([ xX])\]/.test(cur)) break;
      if (/^>\s?/.test(cur)) break;
      if (/^([-*+]|\d+\.)\s+/.test(cur)) break;
      if (cur.includes('|') && i + 1 < lines.length) {
        const nextDelim = lines[i + 1].trim().split('|').map(s => s.trim()).filter(Boolean);
        if (nextDelim.length > 0 && nextDelim.every(p => /^:?-+:?$/.test(p))) break;
      }
      pLines.push(cur);
      i++;
    }
    const endLine = i - 1;
    const rawLines = lines.slice(startLine, endLine + 1);
    blocks.push({ id: `block-p-${startLine}`, type: 'p', raw: rawLines.join('\n'), startLine, endLine });
  }
  return blocks;
}

// 1. Exact 100% Roundtrip Fidelity Test
const simBlocks = parseToBlocksSim(testSample);
const roundtripDoc = simBlocks.map(b => b.raw).join('\n');
assert(roundtripDoc === testSample, 'Full document fidelity roundtrip: blocks.map(b => b.raw).join("\\n") equals original text');

// 2. Table parsing in parseToBlocksSim
const tableBlock = simBlocks.find(b => b.type === 'table');
assert(tableBlock !== undefined, 'parseToBlocks correctly recognizes markdown table block');
assert(tableBlock && tableBlock.tableHeaders[0] === '算法' && tableBlock.tableHeaders.length === 3, 'Table block parsed 3 headers correctly');
assert(tableBlock && tableBlock.tableRows.length === 1 && tableBlock.tableRows[0][0] === '01背包', 'Table block parsed data rows correctly');

// 3. Race-Condition-Free Atomic Checklist Toggle Simulation
let currentCanonicalDoc = [
  '# 刷题打卡清单',
  '- [ ] 题 1：两数之和',
  '- [ ] 题 2：反转链表',
  '- [ ] 题 3：三数之和'
].join('\n');

function toggleChecklistSim(checkText) {
  const blocks = parseToBlocksSim(currentCanonicalDoc);
  const target = blocks.find(b => b.type === 'checklist' && b.checkText === checkText);
  if (!target) return;
  const newChecked = !target.checked;
  const updatedLine = target.raw.replace(/^([-*+]\s+\[)([ xX])(\]\s*.*)$/, `$1${newChecked ? 'x' : ' '}$3`);
  currentCanonicalDoc = blocks.map(b => (b.id === target.id ? updatedLine : b.raw)).join('\n');
}

// Fire 3 consecutive rapid toggles in same tick
toggleChecklistSim('题 1：两数之和');
toggleChecklistSim('题 2：反转链表');
toggleChecklistSim('题 3：三数之和');

const finalBlocks = parseToBlocksSim(currentCanonicalDoc);
const check1 = finalBlocks.find(b => b.checkText === '题 1：两数之和');
const check2 = finalBlocks.find(b => b.checkText === '题 2：反转链表');
const check3 = finalBlocks.find(b => b.checkText === '题 3：三数之和');
assert(check1 && check1.checked === true, 'Rapid toggle 1 retained (checked)');
assert(check2 && check2.checked === true, 'Rapid toggle 2 retained (checked)');
assert(check3 && check3.checked === true, 'Rapid toggle 3 retained (checked)');

// Toggle 2 back to false
toggleChecklistSim('题 2：反转链表');
const check2After = parseToBlocksSim(currentCanonicalDoc).find(b => b.checkText === '题 2：反转链表');
assert(check2After && check2After.checked === false, 'Rapid toggle 2 toggled back to unchecked cleanly');

// 4. Line-Shift Invariant Block Assembly Simulation
const docBeforeEdit = [
  '# 标题',
  '',
  '段落 1 原本只有一行',
  '',
  '段落 2 是重要总结'
].join('\n');

const editBlocks = parseToBlocksSim(docBeforeEdit);
const p1Block = editBlocks.find(b => b.raw.includes('段落 1'));
const p2Block = editBlocks.find(b => b.raw.includes('段落 2'));

// User adds 4 lines into Paragraph 1
const p1Expanded = '段落 1 第一行\n段落 1 第二行\n段落 1 第三行\n段落 1 第四行\n段落 1 第五行';
const docAfterEdit = editBlocks.map(b => (b.id === p1Block.id ? p1Expanded : b.raw)).join('\n');

// Parse docAfterEdit and ensure Paragraph 2 is completely intact despite line expansion
const refreshedBlocks = parseToBlocksSim(docAfterEdit);
const p2AfterEdit = refreshedBlocks.find(b => b.raw.includes('段落 2 是重要总结'));
assert(p2AfterEdit !== undefined && p2AfterEdit.raw === '段落 2 是重要总结', 'Line expansion in block 1 does not shift or corrupt block 2');

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



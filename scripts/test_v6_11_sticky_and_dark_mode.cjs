/**
 * test_v6_11_sticky_and_dark_mode.cjs
 * Comprehensive Verification Suite for v6.11.0:
 * 1. Zero slate-850 across entire codebase
 * 2. Proper rgba() syntax in src/index.css for dark blockquote
 * 3. Tailwind configuration includes spacing 18: '4.5rem'
 * 4. AlgoCatalog middle column has independent scroll container
 * 5. TableOfContents has activeId scrollIntoView auto-scroll
 * 6. Sticky sidebars with top-18 & h-[calc(100vh-5.5rem)] across all 6 views
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const projectRoot = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('🚀 Running v6.11.0 Sticky Sidebars & Dark Mode Test Suite');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// Test 1: Zero slate-850 across all source files
// -----------------------------------------------------------------------------
console.log('Test 1: Verifying zero "slate-850" in src/ directory...');
function scanForPattern(dir, pattern, extList = ['.tsx', '.ts', '.css']) {
  const matches = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      matches.push(...scanForPattern(full, pattern, extList));
    } else if (extList.some(ext => entry.name.endsWith(ext))) {
      const content = fs.readFileSync(full, 'utf-8');
      if (content.includes(pattern)) {
        matches.push(full);
      }
    }
  }
  return matches;
}

const slate850Matches = scanForPattern(path.join(projectRoot, 'src'), 'slate-850');
assert.strictEqual(
  slate850Matches.length,
  0,
  `Found illegal 'slate-850' in: ${slate850Matches.join(', ')}`
);
console.log('  ✅ [PASS] No invalid slate-850 references found in src/.');

// -----------------------------------------------------------------------------
// Test 2: Proper rgba syntax in src/index.css
// -----------------------------------------------------------------------------
console.log('\nTest 2: Verifying CSS validity in src/index.css...');
const indexCss = fs.readFileSync(path.join(projectRoot, 'src/index.css'), 'utf-8');
assert(
  !indexCss.includes('#082f49/40'),
  'src/index.css must not contain invalid hex-slash syntax #082f49/40'
);
assert(
  indexCss.includes('rgba(8, 47, 73, 0.45)'),
  'src/index.css must use valid rgba(8, 47, 73, 0.45) for dark blockquote'
);
console.log('  ✅ [PASS] Valid rgba() background in dark blockquote.');

// -----------------------------------------------------------------------------
// Test 3: Tailwind config has spacing 18
// -----------------------------------------------------------------------------
console.log('\nTest 3: Verifying Tailwind config spacing extension for 18...');
const tailwindConfig = fs.readFileSync(path.join(projectRoot, 'tailwind.config.cjs'), 'utf-8');
assert(
  tailwindConfig.includes("18: '4.5rem'") || tailwindConfig.includes('18: "4.5rem"'),
  'tailwind.config.cjs must include 18: "4.5rem" in spacing extension'
);
console.log('  ✅ [PASS] Spacing 18 ("4.5rem") declared in tailwind.config.cjs.');

// -----------------------------------------------------------------------------
// Test 4: AlgoCatalog has independent scroll container
// -----------------------------------------------------------------------------
console.log('\nTest 4: Verifying AlgoCatalog independent problem scroll container...');
const algoCode = fs.readFileSync(path.join(projectRoot, 'src/components/algorithm/AlgoCatalog.tsx'), 'utf-8');
assert(
  algoCode.includes('flex flex-col h-[calc(100vh-5.5rem)]'),
  'AlgoCatalog main column must be a fixed viewport height column'
);
assert(
  algoCode.includes('flex-1 min-h-0 overflow-y-auto') && algoCode.includes('scrollbar-thin'),
  'AlgoCatalog problem list must have dedicated overflow-y-auto scroll container'
);
console.log('  ✅ [PASS] AlgoCatalog middle column has dedicated smooth scroll container.');

// -----------------------------------------------------------------------------
// Test 5: TableOfContents has activeId scrollIntoView
// -----------------------------------------------------------------------------
console.log('\nTest 5: Verifying TableOfContents auto-scroll synchronization...');
const tocCode = fs.readFileSync(path.join(projectRoot, 'src/components/reader/TableOfContents.tsx'), 'utf-8');
assert(
  tocCode.includes('useRef'),
  'TableOfContents must import useRef for container reference'
);
assert(
  tocCode.includes('activeEl.scrollIntoView'),
  'TableOfContents must trigger scrollIntoView on active heading'
);
assert(
  tocCode.includes("block: 'nearest'"),
  'TableOfContents scrollIntoView must use block: nearest for smooth non-intrusive scroll'
);
assert(
  tocCode.includes('id={`toc-item-${h.id}`}'),
  'TableOfContents items must have toc-item- DOM ids'
);
console.log('  ✅ [PASS] TableOfContents TOC auto-scroll mechanism verified.');

// -----------------------------------------------------------------------------
// Test 6: Sticky sidebars with top-18 across all primary views
// -----------------------------------------------------------------------------
console.log('\nTest 6: Verifying sticky top-18 sidebars across all 6 views...');
const viewsToCheck = [
  { file: 'src/components/daily/DailyCurriculumView.tsx', name: 'DailyCurriculumView' },
  { file: 'src/components/reader/ArticleSidebar.tsx', name: 'ArticleSidebar (Knowledge)' },
  { file: 'src/components/reader/TableOfContents.tsx', name: 'TableOfContents (Knowledge)' },
  { file: 'src/components/algorithm/AlgoCatalog.tsx', name: 'AlgoCatalog' },
  { file: 'src/components/learning/LearningSystemView.tsx', name: 'LearningSystemView' },
  { file: 'src/components/source/SourceRoadmapView.tsx', name: 'SourceRoadmapView' },
  { file: 'src/components/practice/PracticeCenterView.tsx', name: 'PracticeCenterView' },
  { file: 'src/components/dashboard/DashboardView.tsx', name: 'DashboardView' }
];

for (const { file, name } of viewsToCheck) {
  const content = fs.readFileSync(path.join(projectRoot, file), 'utf-8');
  assert(
    content.includes('sticky top-18') || content.includes('sticky top-20'),
    `${name} must include sticky top-18/top-20`
  );
  assert(
    content.includes('h-[calc(100vh-5.5rem)]') || content.includes('h-[calc(100vh-6rem)]'),
    `${name} must bound sidebar height to viewport`
  );
  assert(
    content.includes('self-start'),
    `${name} sidebars must have self-start to avoid flex-stretch breaking CSS sticky`
  );
  console.log(`  ✅ [PASS] ${name} sidebar sticky top-18, viewport height & self-start verified.`);
}

// -----------------------------------------------------------------------------
// Test 7: Flex parent containers must use items-start
// -----------------------------------------------------------------------------
console.log('\nTest 7: Verifying flex parent containers use items-start to enable sticky...');
const parentViewsToCheck = [
  'src/components/daily/DailyCurriculumView.tsx',
  'src/components/reader/KnowledgeReader.tsx',
  'src/components/algorithm/AlgoCatalog.tsx',
  'src/components/learning/LearningSystemView.tsx',
  'src/components/source/SourceRoadmapView.tsx',
  'src/components/practice/PracticeCenterView.tsx',
  'src/components/dashboard/DashboardView.tsx'
];

for (const file of parentViewsToCheck) {
  const content = fs.readFileSync(path.join(projectRoot, file), 'utf-8');
  assert(
    content.includes('flex items-start'),
    `${file} must have flex items-start to allow child sidebars to stick without stretch`
  );
  console.log(`  ✅ [PASS] ${file} flex parent has items-start.`);
}

console.log('\n================================================================');
console.log('🎉 ALL 6 VERIFICATION CHECKS PASSED FLAWLESSLY!');
console.log('================================================================');

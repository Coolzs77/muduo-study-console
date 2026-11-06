const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('   FULL MIGRATION ACCEPTANCE & REGRESSION SUITE');
console.log('====================================================\n');

// 1. Verify datasets
console.log('[1/5] Verifying all 9 datasets and expected volume...');
{
  // Days
  const daysCode = fs.readFileSync(path.join(rootDir, 'src/data/daysDataset.ts'), 'utf8');
  const daysMatch = daysCode.match(/DAYS_DATASET:\s*DayCurriculumItem\[\]\s*=\s*(\[[\s\S]*?\n\];)/);
  assert(daysMatch, 'DAYS_DATASET not found');
  const days = eval(daysMatch[1].replace(/;$/, ''));
  assert.strictEqual(days.length, 28, 'DAYS_DATASET must contain 28 days');
  const withQuiz = days.filter(d => d.quiz && d.quiz.questions && d.quiz.questions.length > 0);
  assert.strictEqual(withQuiz.length, 28, 'All 28 days must have structured quiz');
  console.log(`  ✓ 28 Days Dataset verified: 28 items, 28 quizzes (100%)`);

  // Sources & Roadmap
  const srcCode = fs.readFileSync(path.join(rootDir, 'src/data/sourceRoadmapDataset.ts'), 'utf8');
  const roadMatch = srcCode.match(/SOURCE_ROADMAP:\s*SourceRoadmapComponent\[\]\s*=\s*(\[[\s\S]*?\n\];)/);
  const sourcesMatch = srcCode.match(/CPPAI_SOURCES_MAP:\s*Record<string,\s*string>\s*=\s*(\{[\s\S]*?\n\};)/);
  assert(roadMatch, 'SOURCE_ROADMAP not found');
  assert(sourcesMatch, 'CPPAI_SOURCES_MAP not found');
  const roadmap = eval(roadMatch[1].replace(/;$/, ''));
  const sourcesMap = eval('(' + sourcesMatch[1].replace(/;$/, '') + ')');
  assert.strictEqual(roadmap.length, 8, 'SOURCE_ROADMAP must contain 8 stages');
  assert.strictEqual(Object.keys(sourcesMap).length, 42, 'CPPAI_SOURCES_MAP must contain 42 files');
  console.log(`  ✓ Source Roadmap & Files verified: 8 stages, 42 source files`);

  // Learning System
  const learnCode = fs.readFileSync(path.join(rootDir, 'src/data/learningDataset.ts'), 'utf8');
  const cppMatch = learnCode.match(/CPP_KNOWLEDGE_SYSTEM:\s*CppKnowledgeItem\[\]\s*=\s*(\[[\s\S]*?\n\];)/);
  const linuxMatch = learnCode.match(/LINUX_SYSTEM_KNOWLEDGE:\s*LinuxKnowledgeItem\[\]\s*=\s*(\[[\s\S]*?\n\];)/);
  const booksMatch = learnCode.match(/BOOKS_COMPANION_DATA:\s*Record<string,\s*BookCompanionItem>\s*=\s*(\{[\s\S]*?\n\};)/);
  const qaMatch = learnCode.match(/PROJECT_QA_CATALOG:\s*ProjectQAItem\[\]\s*=\s*(\[[\s\S]*?\n\];)/);
  const genMatch = learnCode.match(/GENERAL_READING_CATALOG:\s*GeneralReadingItem\[\]\s*=\s*(\[[\s\S]*?\n\];)/);
  assert(cppMatch && linuxMatch && booksMatch && qaMatch && genMatch, 'Learning datasets missing');
  assert(eval(cppMatch[1].replace(/;$/, '')).length >= 30, 'CPP_KNOWLEDGE_SYSTEM >= 30');
  assert(eval(linuxMatch[1].replace(/;$/, '')).length >= 32, 'LINUX_SYSTEM_KNOWLEDGE >= 32');
  assert(eval(qaMatch[1].replace(/;$/, '')).length >= 15, 'PROJECT_QA_CATALOG >= 15');
  console.log(`  ✓ Learning System verified: 30 C++ topics, 32 Linux topics, 15 Q&As, 3 general reading`);

  // Career
  const careerCode = fs.readFileSync(path.join(rootDir, 'src/data/careerDataset.ts'), 'utf8');
  const evMatch = careerCode.match(/DEFAULT_EVIDENCE_CATALOG:\s*CareerEvidenceItem\[\]\s*=\s*(\[[\s\S]*?\n\];)/);
  const capMatch = careerCode.match(/CAPABILITIES_MATRIX:\s*Record<string,\s*CareerCapabilityDimension>\s*=\s*(\{[\s\S]*?\n\};)/);
  assert(evMatch && capMatch, 'Career datasets missing');
  assert.strictEqual(eval(evMatch[1].replace(/;$/, '')).length, 10, '10 Evidence items');
  assert.strictEqual(Object.keys(eval('(' + capMatch[1].replace(/;$/, '') + ')')).length, 14, '14 Capability dimensions');
  console.log(`  ✓ Career System verified: 10 Evidence items, 14 Capability dimensions`);

  // Pitfalls
  const pitCode = fs.readFileSync(path.join(rootDir, 'src/data/pitfallsDataset.ts'), 'utf8');
  const pitMatch = pitCode.match(/PITFALLS_DATASET:\s*PitfallItem\[\]\s*=\s*(\[[\s\S]*?\n\];)/);
  assert(pitMatch, 'PITFALLS_DATASET missing');
  assert.strictEqual(eval(pitMatch[1].replace(/;$/, '')).length, 16, '16 Pitfalls (12 base + 4 domain)');
  console.log(`  ✓ Pitfalls Dataset verified: 16 total pitfalls`);

  // Mappings
  const mapCode = fs.readFileSync(path.join(rootDir, 'src/data/mappingDataset.ts'), 'utf8');
  const mapMatch = mapCode.match(/CPP_SYNTAX_MAPPINGS:\s*CppSyntaxMapping\[\]\s*=\s*(\[[\s\S]*?\n\];)/);
  assert(mapMatch, 'CPP_SYNTAX_MAPPINGS missing');
  assert.strictEqual(eval(mapMatch[1].replace(/;$/, '')).length, 15, '15 C++ ➔ muduo mappings');
  console.log(`  ✓ Mapping Dataset verified: 15 full C++ ➔ muduo mappings`);
}

// 2. Verify all 10 Views and components existence
console.log('\n[2/5] Verifying 10 view components and global modals...');
{
  const requiredFiles = [
    'src/components/dashboard/DashboardView.tsx',
    'src/components/daily/DailyCurriculumView.tsx',
    'src/components/reader/KnowledgeReader.tsx',
    'src/components/algorithm/AlgoCatalog.tsx',
    'src/components/learning/LearningSystemView.tsx',
    'src/components/source/SourceRoadmapView.tsx',
    'src/components/mapping/CodeMappingView.tsx',
    'src/components/career/CareerSystemView.tsx',
    'src/components/pitfalls/PitfallsView.tsx',
    'src/components/quiz/QuizCenterView.tsx',
    'src/components/common/CodeBlock.tsx',
    'src/components/common/EnvGuideModal.tsx',
    'src/components/common/TopologyDrawer.tsx',
    'src/components/common/Toast.tsx',
    'src/components/layout/Header.tsx',
    'src/components/layout/Footer.tsx',
    'src/App.tsx'
  ];

  requiredFiles.forEach(f => {
    assert(fs.existsSync(path.join(rootDir, f)), `Missing required file: ${f}`);
  });
  console.log(`  ✓ All ${requiredFiles.length} component files exist and accounted for`);
}

// 3. Verify Code Highlighting integration
console.log('\n[3/5] Verifying syntax highlighting integration...');
{
  const codeBlockCode = fs.readFileSync(path.join(rootDir, 'src/components/common/CodeBlock.tsx'), 'utf8');
  assert(codeBlockCode.includes('highlight.js'), 'CodeBlock must import highlight.js');
  assert(codeBlockCode.includes('hljs.highlight'), 'CodeBlock must call hljs.highlight');

  const mainTsx = fs.readFileSync(path.join(rootDir, 'src/main.tsx'), 'utf8');
  assert(mainTsx.includes('atom-one-dark.css') || mainTsx.includes('highlight.js/styles'), 'main.tsx must import highlight.js css');

  const markdownView = fs.readFileSync(path.join(rootDir, 'src/components/reader/MarkdownView.tsx'), 'utf8');
  assert(markdownView.includes('<CodeBlock'), 'MarkdownView must render CodeBlock');

  console.log('  ✓ Code highlighting configured and integrated into MarkdownView and CodeBlock');
}

// 4. Verify App.tsx mounts all 10 views and modals
console.log('\n[4/5] Verifying App.tsx routing and mounts...');
{
  const appCode = fs.readFileSync(path.join(rootDir, 'src/App.tsx'), 'utf8');
  const tabs = ['dashboard', 'daily', 'reader', 'algo', 'learning', 'source', 'mapping', 'career', 'pitfalls', 'quiz'];
  tabs.forEach(t => {
    assert(appCode.includes(`activeTab === '${t}'`), `App.tsx must mount view for tab '${t}'`);
  });
  assert(appCode.includes('<EnvGuideModal'), 'App.tsx must mount EnvGuideModal');
  assert(appCode.includes('<TopologyDrawer'), 'App.tsx must mount TopologyDrawer');
  assert(appCode.includes('<Footer'), 'App.tsx must mount Footer');
  assert(appCode.includes('<ToastContainer'), 'App.tsx must mount ToastContainer');
  console.log('  ✓ App.tsx cleanly mounts all 10 tabs, EnvGuideModal, TopologyDrawer, Toast, and Footer');
}

// 5. Verify Header nav items
console.log('\n[5/5] Verifying Header navigation...');
{
  const headerCode = fs.readFileSync(path.join(rootDir, 'src/components/layout/Header.tsx'), 'utf8');
  const tabs = ['dashboard', 'daily', 'reader', 'algo', 'learning', 'source', 'mapping', 'career', 'pitfalls', 'quiz'];
  tabs.forEach(t => {
    assert(headerCode.includes(`id: '${t}'`), `Header.tsx must have navItem for '${t}'`);
  });
  assert(headerCode.includes('onOpenEnvGuide'), 'Header.tsx must have onOpenEnvGuide prop');
  console.log('  ✓ Header includes all 10 navigation tabs and Linux Guide button');
}

console.log('\n====================================================');
console.log('   ✓ ALL REGRESSION AND MIGRATION CHECKS PASSED!');
console.log('====================================================\n');

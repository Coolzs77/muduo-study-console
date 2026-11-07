const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('[TEST] Starting v6.10.0 Global StyleKit Claymorphism (粘土拟态) Full Verification...');

const projectRoot = path.resolve(__dirname, '..');

// 1. Verify package.json version
console.log('-> Verifying package.json version is >= 6.10.0...');
const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));
assert(pkg.version >= '6.10.0', 'package.json version must be >= 6.10.0');

// List of target components that were upgraded to StyleKit claymorphism
const targets = [
  'src/components/layout/Header.tsx',
  'src/components/daily/DailyCurriculumView.tsx',
  'src/components/reader/KnowledgeReader.tsx',
  'src/components/reader/ArticleSidebar.tsx',
  'src/components/reader/ArticleReader.tsx',
  'src/components/reader/MasterySelector.tsx',
  'src/components/reader/TableOfContents.tsx',
  'src/components/algorithm/AlgoCatalog.tsx',
  'src/components/algorithm/AlgoCard.tsx',
  'src/components/learning/LearningSystemView.tsx',
  'src/components/source/SourceRoadmapView.tsx',
  'src/components/practice/PracticeCenterView.tsx',
  'src/components/mapping/CodeMappingView.tsx',
  'src/components/career/CareerSystemView.tsx',
  'src/components/pitfalls/PitfallsView.tsx',
  'src/components/quiz/QuizCenterView.tsx',
  'src/components/archive/MuduoArchiveView.tsx',
  'src/components/common/CodeBlock.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/common/EnvGuideModal.tsx',
  'src/components/common/TopologyDrawer.tsx'
];

console.log(`-> Verifying ${targets.length} target components for Claymorphism rules...`);

targets.forEach(relPath => {
  const fullPath = path.join(projectRoot, relPath);
  assert(fs.existsSync(fullPath), `Target file must exist: ${relPath}`);
  const code = fs.readFileSync(fullPath, 'utf-8');

  // Check no sharp corners or improper small radius
  assert(!code.includes('rounded-none'), `${relPath} must NOT contain rounded-none`);
  assert(!/\brounded-sm\b/.test(code), `${relPath} must NOT contain rounded-sm`);
  assert(!/\brounded-md\b/.test(code), `${relPath} must NOT contain rounded-md`);
  assert(!/["'\s]rounded["'\s]/.test(code), `${relPath} must NOT contain bare 4px rounded`);

  // Check no flat active:scale-95 or non-squash active states
  assert(!/\bactive:scale-95\b/.test(code), `${relPath} must NOT contain flat active:scale-95`);

  // Check no heavy borders
  assert(!code.includes('border-2 '), `${relPath} must NOT contain border-2`);

  // Check presence of rounded-3xl or rounded-2xl
  const hasClayRadius = code.includes('rounded-3xl') || code.includes('rounded-2xl') || code.includes('rounded-l-3xl');
  assert(hasClayRadius, `${relPath} must use rounded-3xl, rounded-2xl or rounded-l-3xl`);

  // Check presence of spring or squash interactions or shadow effects
  const hasSquashOrSpring = code.includes('active:scale-x-105') || code.includes('active:scale-x-110') || code.includes('ease-[cubic-bezier(0.34,1.56,0.64,1)]') || code.includes('shadow-[');
  assert(hasSquashOrSpring, `${relPath} must contain claymorphism squash, spring easing, or dual shadow tokens`);
});

// Specific checks
console.log('-> Verifying Header navigation recessed groove and squash buttons...');
const headerCode = fs.readFileSync(path.join(projectRoot, 'src/components/layout/Header.tsx'), 'utf-8');
assert(headerCode.includes('shadow-[inset_2px_2px_4px'), 'Header must contain recessed groove shadow');
assert(headerCode.includes('active:scale-x-105 active:scale-y-90'), 'Header buttons must use squash & stretch');
assert(headerCode.includes('rounded-2xl transition-all'), 'Header nav buttons must be rounded-2xl pills');

console.log('-> Verifying DailyCurriculumView 3-column claymorphism layout...');
const dailyCode = fs.readFileSync(path.join(projectRoot, 'src/components/daily/DailyCurriculumView.tsx'), 'utf-8');
assert(dailyCode.includes('rounded-3xl'), 'DailyCurriculumView must use rounded-3xl cards');
assert(dailyCode.includes('shadow-[inset_2px_2px_4px'), 'DailyCurriculumView must use recessed shadows');

console.log('-> Verifying AlgoCatalog candy difficulty chips & stats cards...');
const algoCode = fs.readFileSync(path.join(projectRoot, 'src/components/algorithm/AlgoCatalog.tsx'), 'utf-8');
assert(algoCode.includes('active:scale-x-105 active:scale-y-90'), 'AlgoCatalog must have squash buttons');
assert(algoCode.includes('rounded-3xl'), 'AlgoCatalog must use rounded-3xl cards');

console.log('-> Verifying CodeBlock rounded-2xl container & copy squash button...');
const codeBlockCode = fs.readFileSync(path.join(projectRoot, 'src/components/common/CodeBlock.tsx'), 'utf-8');
assert(codeBlockCode.includes('rounded-2xl'), 'CodeBlock must be rounded-2xl');
assert(codeBlockCode.includes('active:scale-x-105 active:scale-y-90'), 'CodeBlock copy button must have squash deformation');

console.log('-> Verifying EnvGuideModal & TopologyDrawer claymorphism upgrades...');
const envGuideCode = fs.readFileSync(path.join(projectRoot, 'src/components/common/EnvGuideModal.tsx'), 'utf-8');
assert(envGuideCode.includes('active:scale-x-105 active:scale-y-90'), 'EnvGuideModal close button must have squash physics');
const drawerCode = fs.readFileSync(path.join(projectRoot, 'src/components/common/TopologyDrawer.tsx'), 'utf-8');
assert(drawerCode.includes('active:scale-x-105 active:scale-y-90'), 'TopologyDrawer close button must have squash physics');

console.log('-> Verifying PracticeCenterView dual dark-mode clay shadow...');
const practiceCode = fs.readFileSync(path.join(projectRoot, 'src/components/practice/PracticeCenterView.tsx'), 'utf-8');
assert(practiceCode.includes('dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3)'), 'PracticeCenterView aside must have dark mode clay shadow');

console.log('[TEST SUCCESS] All v6.10.0 Global StyleKit Claymorphism assertions PASSED cleanly!');

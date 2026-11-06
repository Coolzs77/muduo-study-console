const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDataDir = path.resolve(rootDir, 'src/data');

console.log('[CONVERT] Starting full lossless dataset migration to TypeScript...');

// 1. daysDataset.ts
{
  const daysCode = fs.readFileSync(path.join(rootDir, 'js/dataset-28days.js'), 'utf8');
  const daysMatch = daysCode.match(/var DAYS_DATASET\s*=\s*(\[[\s\S]*?\n\];)/);
  if (!daysMatch) throw new Error('Failed to match DAYS_DATASET');
  const tsContent = `import { DayCurriculumItem } from "../types";\n\nexport const DAYS_DATASET: DayCurriculumItem[] = ${daysMatch[1]}\n`;
  fs.writeFileSync(path.join(srcDataDir, 'daysDataset.ts'), tsContent, 'utf8');
  console.log('✓ Created daysDataset.ts (28 days full curriculum & quizzes)');
}

// 2. sourceRoadmapDataset.ts
{
  const mapCode = fs.readFileSync(path.join(rootDir, 'js/dataset-mappings.js'), 'utf8');
  const roadMatch = mapCode.match(/var SOURCE_ROADMAP\s*=\s*(\[[\s\S]*?\n\];)/);
  if (!roadMatch) throw new Error('Failed to match SOURCE_ROADMAP');

  const sourcesCode = fs.readFileSync(path.join(rootDir, 'js/dataset-cppai-sources.js'), 'utf8');
  const sourcesMatch = sourcesCode.match(/var CPPAI_SOURCES_MAP\s*=\s*(\{[\s\S]*?\n\};)/);
  if (!sourcesMatch) throw new Error('Failed to match CPPAI_SOURCES_MAP');

  const tsContent = `import { SourceRoadmapComponent } from "../types";

export const SOURCE_ROADMAP: SourceRoadmapComponent[] = ${roadMatch[1]}

export interface CppAiSourceFile {
  filename: string;
  code: string;
}

export const CPPAI_SOURCES_MAP: Record<string, string> = ${sourcesMatch[1]}
`;
  fs.writeFileSync(path.join(srcDataDir, 'sourceRoadmapDataset.ts'), tsContent, 'utf8');
  console.log('✓ Created sourceRoadmapDataset.ts (8 roadmap stages & 42 full source files)');
}

// 3. learningDataset.ts
{
  const learnCode = fs.readFileSync(path.join(rootDir, 'js/dataset-learning.js'), 'utf8');
  const cppMatch = learnCode.match(/var CPP_KNOWLEDGE_SYSTEM\s*=\s*(\[[\s\S]*?\n\];)/);
  const linuxMatch = learnCode.match(/var LINUX_SYSTEM_KNOWLEDGE\s*=\s*(\[[\s\S]*?\n\];)/);
  const booksMatch = learnCode.match(/var BOOKS_COMPANION_DATA\s*=\s*(\{[\s\S]*?\n\};)/);
  const qaMatch = learnCode.match(/var PROJECT_QA_CATALOG\s*=\s*(\[[\s\S]*?\n\];)/);
  const generalMatch = learnCode.match(/var GENERAL_READING_CATALOG\s*=\s*(\[[\s\S]*?\n\];)/);

  if (!cppMatch || !linuxMatch || !booksMatch || !qaMatch || !generalMatch) {
    throw new Error('Failed to match learning dataset entities');
  }

  const tsContent = `import {
  CppKnowledgeItem,
  LinuxKnowledgeItem,
  BookCompanionItem,
  ProjectQAItem,
  GeneralReadingItem
} from "../types";

export const CPP_KNOWLEDGE_SYSTEM: CppKnowledgeItem[] = ${cppMatch[1]}

export const LINUX_SYSTEM_KNOWLEDGE: LinuxKnowledgeItem[] = ${linuxMatch[1]}

export const BOOKS_COMPANION_DATA: Record<string, BookCompanionItem> = ${booksMatch[1]}

export const PROJECT_QA_CATALOG: ProjectQAItem[] = ${qaMatch[1]}

export const GENERAL_READING_CATALOG: GeneralReadingItem[] = ${generalMatch[1]}
`;
  fs.writeFileSync(path.join(srcDataDir, 'learningDataset.ts'), tsContent, 'utf8');
  console.log('✓ Created learningDataset.ts (5 sub-tabs learning system)');
}

// 4. careerDataset.ts
{
  const careerCode = fs.readFileSync(path.join(rootDir, 'js/dataset-career.js'), 'utf8');
  const evTypesMatch = careerCode.match(/var EVIDENCE_TYPES\s*=\s*(\{[\s\S]*?\n\};)/);
  const evCatMatch = careerCode.match(/var DEFAULT_EVIDENCE_CATALOG\s*=\s*(\[[\s\S]*?\n\];)/);
  const capMatch = careerCode.match(/var CAPABILITIES_MATRIX\s*=\s*(\{[\s\S]*?\n\};)/);
  const revQMatch = careerCode.match(/var PROJECT_REVERSE_QUESTIONS\s*=\s*(\[[\s\S]*?\n\];)/);
  const intDataMatch = careerCode.match(/var PROJECT_INTERVIEW_DATA\s*=\s*(\{[\s\S]*?\n\};)/);
  const starMatch = careerCode.match(/var CAREER_STAR_STORIES\s*=\s*(\[[\s\S]*?\n\];)/);
  const resBulMatch = careerCode.match(/var RESUME_BULLETS\s*=\s*(\[[\s\S]*?\n\];)/);

  if (!evTypesMatch || !evCatMatch || !capMatch || !revQMatch || !intDataMatch || !starMatch || !resBulMatch) {
    throw new Error('Failed to match career dataset entities');
  }

  const tsContent = `import {
  CareerEvidenceType,
  CareerEvidenceItem,
  CareerCapabilityDimension,
  CareerInterviewQuestion,
  CareerStarStory,
  ResumeBulletItem
} from "../types";

export const EVIDENCE_TYPES: Record<string, CareerEvidenceType> = ${evTypesMatch[1]}

export const DEFAULT_EVIDENCE_CATALOG: CareerEvidenceItem[] = ${evCatMatch[1]}

export const CAPABILITIES_MATRIX: Record<string, CareerCapabilityDimension> = ${capMatch[1]}

export const PROJECT_REVERSE_QUESTIONS: CareerInterviewQuestion[] = ${revQMatch[1]}

export const PROJECT_INTERVIEW_DATA: Record<string, any> = ${intDataMatch[1]}

export const CAREER_STAR_STORIES: CareerStarStory[] = ${starMatch[1]}

export const RESUME_BULLETS: ResumeBulletItem[] = ${resBulMatch[1]}
`;
  fs.writeFileSync(path.join(srcDataDir, 'careerDataset.ts'), tsContent, 'utf8');
  console.log('✓ Created careerDataset.ts (Evidence, Radar, Mock Q&A, STAR stories)');
}

// 5. pitfallsDataset.ts
{
  const mapCode = fs.readFileSync(path.join(rootDir, 'js/dataset-mappings.js'), 'utf8');
  const pitMatch = mapCode.match(/var PITFALLS_DATASET\s*=\s*(\[[\s\S]*?\n\];)/);
  if (!pitMatch) throw new Error('Failed to match PITFALLS_DATASET');

  const domainCode = fs.readFileSync(path.join(rootDir, 'js/dataset-domain.js'), 'utf8');
  const domPitMatch = domainCode.match(/var DOMAIN_PITFALLS_CATALOG\s*=\s*(\[[\s\S]*?\n\];)/);
  if (!domPitMatch) throw new Error('Failed to match DOMAIN_PITFALLS_CATALOG');

  // Parse both and merge
  const basePitfalls = eval(pitMatch[1].replace(/;$/, ''));
  const domainPitfalls = eval(domPitMatch[1].replace(/;$/, ''));

  // Normalize domain pitfalls to PitfallItem shape
  const normalizedDomain = domainPitfalls.map((item, idx) => ({
    id: item.id || ('dom_p' + (idx + 1)),
    title: item.title,
    date: item.date || '2026-09-15',
    day: item.day || 15,
    keywords: item.keywords || [item.module || 'CppAIService'],
    errorCode: item.errorCode || item.errorExample || '// 见踩坑解析',
    errorSymptom: item.symptom || item.errorSymptom || '',
    errorCause: item.cause || item.errorCause || '',
    correctCode: item.correctCode || item.fixSolution || '// 见修复方案',
    conclusion: item.conclusion || item.preventionRule || '',
    category: item.category || '工程避坑'
  }));

  const allPitfalls = [...basePitfalls, ...normalizedDomain];

  const tsContent = `import { PitfallItem } from "../types";

export const PITFALLS_DATASET: PitfallItem[] = ${JSON.stringify(allPitfalls, null, 2)};
`;
  fs.writeFileSync(path.join(srcDataDir, 'pitfallsDataset.ts'), tsContent, 'utf8');
  console.log(`✓ Created pitfallsDataset.ts (${allPitfalls.length} total pitfalls: 12 muduo + 4 domain)`);
}

// 6. domainDataset.ts
{
  const domainCode = fs.readFileSync(path.join(rootDir, 'js/dataset-domain.js'), 'utf8');
  const prMatch = domainCode.match(/var DOMAIN_PROJECTS\s*=\s*(\[[\s\S]*?\n\];)/);
  const modMatch = domainCode.match(/var DOMAIN_MODULES\s*=\s*(\[[\s\S]*?\n\];)/);

  if (!prMatch || !modMatch) throw new Error('Failed to match domain projects / modules');

  const tsContent = `import { DomainProject, DomainModule } from "../types";

export const DOMAIN_PROJECTS: DomainProject[] = ${prMatch[1]}

export const DOMAIN_MODULES: DomainModule[] = ${modMatch[1]}
`;
  fs.writeFileSync(path.join(srcDataDir, 'domainDataset.ts'), tsContent, 'utf8');
  console.log('✓ Created domainDataset.ts (Projects & 23 Architecture Modules)');
}

// 7. mappingDataset.ts (all 15 mappings from MAPPING_MATRIX)
{
  const mapCode = fs.readFileSync(path.join(rootDir, 'js/dataset-mappings.js'), 'utf8');
  const mapMatMatch = mapCode.match(/var MAPPING_MATRIX\s*=\s*(\[[\s\S]*?\n\];)/);
  if (!mapMatMatch) throw new Error('Failed to match MAPPING_MATRIX');

  const rawMappings = eval(mapMatMatch[1].replace(/;$/, ''));
  const mappings = rawMappings.map((m, idx) => ({
    feature: m.feature,
    cppStandard: m.feature.includes('move') || m.feature.includes('Lambda') || m.feature.includes('ptr') || m.feature.includes('delete') ? 'C++11' : (m.feature.includes('epoll') ? 'Linux' : 'C++98/11'),
    muduoLocation: m.muduoLocation,
    muduoFile: m.muduoLocation.includes('/') ? m.muduoLocation : ('muduo/' + m.muduoLocation),
    muduoClassOrFunction: m.muduoLocation,
    designRationale: m.desc,
    desc: m.desc,
    coreCode: m.snippet,
    snippet: m.snippet,
    aiServiceMapping: '对应业务层: ' + m.feature + ' 实践'
  }));

  const tsContent = `import { CppSyntaxMapping } from "../types";

export const CPP_SYNTAX_MAPPINGS: CppSyntaxMapping[] = ${JSON.stringify(mappings, null, 2)};
`;
  fs.writeFileSync(path.join(srcDataDir, 'mappingDataset.ts'), tsContent, 'utf8');
  console.log(`✓ Updated mappingDataset.ts (${mappings.length} full C++ ➔ muduo mappings)`);
}

console.log('[CONVERT SUCCESS] All datasets generated in src/data/ !');

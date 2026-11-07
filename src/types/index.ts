// ============================================================================
// Core Type Definitions for Muduo & CppAIService Console
// ============================================================================

export type ActiveTab =
  | 'dashboard'
  | 'daily'
  | 'reader'
  | 'algo'
  | 'learning'
  | 'source'
  | 'practice';

export type PracticeSubTab = 'mapping' | 'career' | 'pitfalls' | 'quiz' | 'archive';

export type ArchitectureLayer = 'L4_Transport' | 'L7_Protocol' | 'L7_AIService';

// ----------------------------------------------------------------------------
// Yuque Articles
// ----------------------------------------------------------------------------
export interface YuqueArticle {
  id: string;
  bookId: string; // 'muduo-core' | 'http-server' | 'cpp-ai-service'
  bookTitle: string;
  bookBadge?: string;
  index: number;
  doc_id?: number;
  title: string;
  slug: string;
  url: string;
  level?: number;
  category: string;
  wordCount: number;
  updatedAt?: string;
  hash?: string;
  status?: string;
  tags?: string[];
  linkedModule?: string;
  linkedModuleTitle?: string;
  linkedSourceFiles?: string[];
  linkedClasses?: string[];
  linkedFunctions?: string[];
  interviewKeyPoints?: string[];
  summary?: string;
  content: string; // Raw markdown content
}

// ----------------------------------------------------------------------------
// Algorithm Problems
// ----------------------------------------------------------------------------
export interface AlgoProblem {
  id: string;
  num: number | string | null;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  category: string;
  topic?: string;
  leetcodeUrl?: string;
  carlUrl?: string;
  pattern: string;
  timeComp: string;
  spaceComp: string;
  mistakes: string;
  projectLink: string;
  isCarl: boolean;
  isHot100: boolean;
  hot100Chapter?: string;
  hot100Order?: number;
  independent?: boolean;
}

// ----------------------------------------------------------------------------
// Daily Routine Tasks
// ----------------------------------------------------------------------------
export interface DailyTask {
  id: string;
  title: string;
  category: string;
  estimatedMinutes: number;
  priority: 'S' | 'A' | 'B';
  completed: boolean;
  focusPoint: string;
  linkTab?: ActiveTab;
}

// ----------------------------------------------------------------------------
// C++ Syntax to Muduo Mapping
// ----------------------------------------------------------------------------
export interface CppSyntaxMapping {
  feature: string;
  cppStandard?: string;
  muduoLocation?: string;
  muduoFile?: string;
  muduoClassOrFunction?: string;
  designRationale?: string;
  desc?: string;
  coreCode?: string;
  snippet?: string;
  aiServiceMapping?: string;
}

// ----------------------------------------------------------------------------
// 28 Days Curriculum & Quiz
// ----------------------------------------------------------------------------
export interface DayQuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface DayQuizData {
  questions: DayQuizQuestion[];
  codeQuestion?: {
    question: string;
    code: string;
    options: string[];
    answer: number;
    explanation: string;
  };
  whyQuestion?: {
    question: string;
    referenceAnswer: string;
    keywords?: string[];
  };
  muduoQuestion?: {
    question: string;
    referenceAnswer: string;
    muduoMechanism?: string;
  };
  implQuestion?: {
    prompt: string;
    referenceSolution: string;
    testCase?: string;
  };
}

export interface DayCurriculumItem {
  day: number;
  week: number;
  tier: number | string;
  title: string;
  bookRange: string;
  tags: string[];
  points: string[];
  code: string;
  muduoMap: string;
  check: string | { quick: string; strict: string; [key: string]: any };
  estimatedMinutes: number;
  budget?: {
    theoryMinutes?: number;
    codeMinutes?: number;
    experimentMinutes?: number;
    reviewMinutes?: number;
    [key: string]: any;
  };
  rigorousNuance?: string | { quick: string; strict: string; [key: string]: any };
  experiment?: {
    goal: string;
    steps: string[];
    expectedOutput: string;
    watchPoints?: string | string[];
    pitfalls?: string | string[];
    buildCommand?: string;
    [key: string]: any;
  };
  quiz?: DayQuizData;
  [key: string]: any;
}

// ----------------------------------------------------------------------------
// Muduo Source Roadmap & 42 Sources Map
// ----------------------------------------------------------------------------
export interface SourceRoadmapComponent {
  id: string;
  name: string;
  layer: string;
  role: string;
  members: string[];
  functions: string[];
  cppFeatures: string[];
  relatedDays: number[];
  status?: string;
  notes?: string;
  [key: string]: any;
}

// ----------------------------------------------------------------------------
// Unified Learning System
// ----------------------------------------------------------------------------
export interface CppKnowledgeItem {
  id: string;
  chapterId: string;
  chapterTitle: string;
  dimension: string;
  title: string;
  yuqueSection?: string;
  bookReference: string;
  keyPoints: string[];
  coreConcept: string;
  cppaiModule?: string;
  moduleName?: string;
  sourceFile?: string;
  sourceLine?: string;
  taskDay?: number;
  interviewPoint?: string;
  learnLoop?: {
    learn: string;
    apply: string;
    build: string;
    explain: string;
    review: string;
  };
  [key: string]: any;
}

export interface LinuxKnowledgeItem {
  id: string;
  chapterId: string;
  chapterTitle: string;
  dimension: string;
  title: string;
  bookReference: string;
  syscallOrCmd: string;
  keyPoints: string[];
  projectScene: string;
  interviewPoint: string;
  [key: string]: any;
}

export interface BookCompanionItem {
  key: string;
  name: string;
  author: string;
  defaultDailyGoal: number;
  unit: string;
  totalPages?: number;
  description?: string;
  dynamicAdjustRule?: any;
  startPoint?: any;
  chapters?: any;
  [key: string]: any;
}

export interface ProjectQAItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keyPoints?: string[];
  sourceReference?: string;
  module?: string;
  projectContext?: string;
  [key: string]: any;
}

export interface GeneralReadingItem {
  id: string;
  bookKey: string;
  title: string;
  author: string;
  targetPagesDaily: number;
  timeOfDay: string;
  reflectionFocus?: string;
  relevanceToEngineer?: string;
  engineeringReflection?: string;
  role?: string;
  corePillars?: any;
  [key: string]: any;
}

// ----------------------------------------------------------------------------
// Career System
// ----------------------------------------------------------------------------
export interface CareerEvidenceType {
  key?: string;
  name?: string;
  label?: string;
  icon?: string;
  badgeClass?: string;
  description?: string;
  [key: string]: any;
}

export interface CareerEvidenceItem {
  id: string;
  type: string;
  title: string;
  taskId: string | number;
  sourceLocation: string;
  commitHash: string;
  capabilityTags: string[];
  details: string;
  verified: boolean;
  createdAt: string;
  [key: string]: any;
}

export interface CareerCapabilityDimension {
  key: string;
  name: string;
  category: string;
  description: string;
  levels: { [level: number]: string };
  requiredEvTypes?: string[];
  [key: string]: any;
}

export interface CareerInterviewQuestion {
  id: string;
  category: string;
  question: string;
  source?: {
    file: string;
    line: string;
    snippet: string;
  };
  knowledgeDim?: {
    id: string;
    title: string;
    dimension: string;
  };
  commit?: {
    hash: string;
    message: string;
    evidenceId: string;
  };
  answer: string;
  followUp?: string;
  trap?: string;
}

export interface CareerStarStory {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  takeaway: string;
}

export interface ResumeBulletItem {
  category: string;
  text: string;
}

// ----------------------------------------------------------------------------
// Pitfalls Dataset
// ----------------------------------------------------------------------------
export interface PitfallItem {
  id: string;
  title: string;
  date?: string;
  day?: number;
  keywords: string[];
  errorCode: string;
  errorSymptom: string;
  errorCause: string;
  correctCode: string;
  conclusion: string;
  category?: string;
}

// ----------------------------------------------------------------------------
// Domain & Topology
// ----------------------------------------------------------------------------
export interface DomainProject {
  id: string;
  name?: string;
  title?: string;
  role?: string;
  language?: string;
  status?: string;
  summary?: string;
  highlights?: string[];
  tagline?: string;
  standard?: string;
  repoUrl?: string;
  [key: string]: any;
}

export interface DomainModule {
  id: string;
  projectId: string;
  name: string;
  layer: string;
  category?: string;
  responsibility?: string;
  desc?: string;
  threadModel?: string;
  classes?: string[];
  files?: string[];
  sourceFiles?: string[];
  functions?: string[];
  keyFeatures?: string[];
  keyConcepts?: string[];
  yuqueDocIds?: string[];
  [key: string]: any;
}

// ----------------------------------------------------------------------------
// Global Metrics & State
// ----------------------------------------------------------------------------
export interface StudyMetrics {
  masteredArticles: number;
  totalArticles: number;
  completedAlgos: number;
  totalAlgos: number;
  hot100Completed: number;
  carlCompleted: number;
  todayStudyMinutes: number;
}

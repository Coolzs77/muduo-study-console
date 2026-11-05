// ============================================================================
// Core Type Definitions for Muduo & CppAIService Console
// ============================================================================

export type ActiveTab = 'reader' | 'algo' | 'dashboard' | 'mapping';

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

export interface AlgoProblem {
  id: string;
  num: number | string | null;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  category: string;
  topic?: string;
  leetcodeUrl?: string;
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

export interface CppSyntaxMapping {
  feature: string;
  cppStandard: string;
  muduoFile: string;
  muduoClassOrFunction: string;
  designRationale: string;
  coreCode: string;
  aiServiceMapping?: string;
}

export interface StudyMetrics {
  masteredArticles: number;
  totalArticles: number;
  completedAlgos: number;
  totalAlgos: number;
  hot100Completed: number;
  carlCompleted: number;
  todayStudyMinutes: number;
}

export interface DayItem {
  day: number;
  week: number;
  tier: 'A' | 'B' | 'C' | string;
  title: string;
  bookRange: string;
  tags: string[];
  points: string[];
  code?: string;
  codeSnippet?: string;
  quizQuestion?: string;
  quizAnswer?: string;
  pitfall?: string;
  [key: string]: any;
}

export interface BookReference {
  id: string;
  title: string;
  author: string;
  filePath: string;
  totalPdfPages: number;
  printPageOffset: number;
  chapters: ChapterInfo[];
}

export interface ChapterInfo {
  chapterNum: number;
  title: string;
  startPage: number;
  endPage: number;
  associatedDays: number[];
  keyConcepts: string[];
  summary: string;
}

export interface MappingItem {
  category: string;
  concept: string;
  muduoClass: string;
  posixApi: string;
  cppStandard: string;
  designPattern: string;
  description: string;
  interviewWeight: number;
}

export interface SourceClassItem {
  id: string;
  name: string;
  file: string;
  role: string;
  coreMethods: { name: string; signature: string; desc: string }[];
  keyMembers: { name: string; type: string; desc: string }[];
  concurrencyNotes: string;
  codeSnippet: string;
}

export interface PitfallItem {
  id: string;
  title: string;
  category: string;
  severity?: 'high' | 'critical' | 'medium' | string;
  symptom: string;
  badCode: string;
  goodCode: string;
  cause?: string;
  underlyingCause?: string;
  muduoSolution?: string;
  [key: string]: any;
}

export interface TopologyNode {
  id: string;
  name: string;
  type: 'core' | 'loop' | 'channel' | 'thread' | 'buffer' | string;
  description: string;
  threadAffinity: string;
  methods: string[];
  relations: { target: string; label: string }[];
  [key: string]: any;
}

export interface StudySession {
  id: number;
  date: string;
  time: string;
  day: number;
  duration: number; // 分钟
  type: 'coding' | 'reading' | 'debug';
  note: string;
}

export interface ReviewItem {
  stage: number; // 0..4, index into [1, 3, 7, 14, 30]
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewDate: string;
  intervalDays: number;
  reviewCount: number;
}

export interface AppState {
  currentView: 'dashboard' | 'daily' | 'reading' | 'mapping' | 'source' | 'pitfalls' | 'quiz';
  mastery: Record<number, { level: number; lastReview: string; notes?: string; steps?: { theory: boolean; code: boolean; practice: boolean } }>;
  studySessions: StudySession[];
  activeTimer: {
    running: boolean;
    seconds: number;
    timerId?: any;
    selectedDay: number;
    selectedType: 'coding' | 'reading' | 'debug';
  };
  globalNotes: string;
  bookProgress: {
    chenShuoCurrentPage: number;
    primerPlusCurrentPage: number;
    notesByChapter: Record<string, string>;
  };
  reviews: Record<number, ReviewItem>;
}

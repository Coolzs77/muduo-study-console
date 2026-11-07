import React, { useState, useMemo } from 'react';
import {
  CPP_KNOWLEDGE_SYSTEM,
  LINUX_SYSTEM_KNOWLEDGE,
  BOOKS_COMPANION_DATA,
  PROJECT_QA_CATALOG,
  GENERAL_READING_CATALOG
} from '../../data/learningDataset';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { showToast } from '../common/Toast';
import {
  BookOpen,
  Terminal,
  HelpCircle,
  Bookmark,
  CheckCircle2,
  Circle,
  Search,
  ChevronDown,
  ChevronRight,
  FileCode,
  Lightbulb,
  Check,
  BookMarked,
  Layers,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

type SubTab = 'cpp' | 'linux' | 'books' | 'qa' | 'general';

export const LearningSystemView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('cpp');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage<boolean>(
    'sidebar_collapsed_learning',
    false
  );

  // Persisted state
  const [cppChecks, setCppChecks] = useLocalStorage<Record<string, boolean>>('muduo_cpp_checks', {});
  const [linuxChecks, setLinuxChecks] = useLocalStorage<Record<string, boolean>>('muduo_linux_checks', {});
  const [booksProgress, setBooksProgress] = useLocalStorage<Record<string, number>>('muduo_books_progress', {
    linuxServer: 120,
    cppPrimerPlus: 350
  });
  const [expandedQA, setExpandedQA] = useState<Record<string, boolean>>({
    qa_01: true
  });

  const toggleCppCheck = (id: string) => {
    setCppChecks(prev => {
      const next = !prev[id];
      showToast(next ? '已标记掌握知识点' : '已取消标记', 'info');
      return { ...prev, [id]: next };
    });
  };

  const toggleLinuxCheck = (id: string) => {
    setLinuxChecks(prev => {
      const next = !prev[id];
      showToast(next ? '已标记 Linux 核心项' : '已取消标记', 'info');
      return { ...prev, [id]: next };
    });
  };

  const toggleQAExpand = (id: string) => {
    setExpandedQA(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Group CPP by chapter
  const cppChapters = useMemo(() => {
    const map = new Map<string, typeof CPP_KNOWLEDGE_SYSTEM>();
    CPP_KNOWLEDGE_SYSTEM.forEach(item => {
      const chap = item.chapterTitle || '基础核心';
      if (!map.has(chap)) map.set(chap, []);
      map.get(chap)!.push(item);
    });
    return Array.from(map.entries());
  }, []);

  // Filtered C++ items
  const filteredCppItems = useMemo(() => {
    let items = CPP_KNOWLEDGE_SYSTEM;
    if (selectedChapter !== 'all') {
      items = items.filter(i => (i.chapterTitle || '基础核心') === selectedChapter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        i =>
          i.title.toLowerCase().includes(q) ||
          i.coreConcept.toLowerCase().includes(q) ||
          (i.interviewPoint && i.interviewPoint.toLowerCase().includes(q))
      );
    }
    return items;
  }, [selectedChapter, searchQuery]);

  // Filtered Linux items
  const filteredLinuxItems = useMemo(() => {
    if (!searchQuery.trim()) return LINUX_SYSTEM_KNOWLEDGE;
    const q = searchQuery.toLowerCase().trim();
    return LINUX_SYSTEM_KNOWLEDGE.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.projectScene.toLowerCase().includes(q) ||
        item.syscallOrCmd.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filtered QA
  const filteredQA = useMemo(() => {
    if (!searchQuery.trim()) return PROJECT_QA_CATALOG;
    const q = searchQuery.toLowerCase().trim();
    return PROJECT_QA_CATALOG.filter(
      item =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Stats
  const cppMasteredCount = Object.values(cppChecks).filter(Boolean).length;
  const linuxMasteredCount = Object.values(linuxChecks).filter(Boolean).length;

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)] bg-[#eef2f7] dark:bg-[#11141a] transition-colors duration-300 p-3 sm:p-4 gap-4 text-slate-800 dark:text-slate-200">
      {/* ========================================================= */}
      {/* LEFT COLUMN: Sub-Tab Directory & Chapter Tree (Collapsible)*/}
      {/* ========================================================= */}
      {isSidebarCollapsed ? (
        <aside className="w-16 shrink-0 rounded-3xl bg-[#f4f7fb]/90 dark:bg-[#151922]/90 shadow-[6px_6px_14px_rgba(0,0,0,0.06),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] py-4 flex flex-col items-center space-y-3 sticky top-18 h-[calc(100vh-5.5rem)] hidden md:flex select-none transition-all duration-300">
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-sky-600 shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
            title="展开系统目录"
          >
            <PanelLeftOpen size={18} />
          </button>

          <div className="w-8 h-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]" />

          {/* Mini Subtab Icons (Clay Pills) */}
          <div className="flex flex-col items-center space-y-2 text-slate-600 dark:text-slate-400">
            <button
              onClick={() => { setActiveSubTab('cpp'); setSelectedChapter('all'); setIsSidebarCollapsed(false); }}
              className={`p-2.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                activeSubTab === 'cpp'
                  ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-[3px_3px_8px_rgba(99,102,241,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold'
                  : 'bg-white/80 dark:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]'
              }`}
              title={`C++ 知识 (${cppMasteredCount}/${CPP_KNOWLEDGE_SYSTEM.length})`}
            >
              <Bookmark size={18} />
            </button>
            <button
              onClick={() => { setActiveSubTab('linux'); setSelectedChapter('all'); setIsSidebarCollapsed(false); }}
              className={`p-2.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                activeSubTab === 'linux'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[3px_3px_8px_rgba(16,185,129,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold'
                  : 'bg-white/80 dark:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]'
              }`}
              title={`Linux 编程 (${linuxMasteredCount}/${LINUX_SYSTEM_KNOWLEDGE.length})`}
            >
              <Terminal size={18} />
            </button>
            <button
              onClick={() => { setActiveSubTab('books'); setSelectedChapter('all'); setIsSidebarCollapsed(false); }}
              className={`p-2.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                activeSubTab === 'books'
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-[3px_3px_8px_rgba(245,158,11,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold'
                  : 'bg-white/80 dark:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]'
              }`}
              title="经典书目伴读"
            >
              <BookOpen size={18} />
            </button>
            <button
              onClick={() => { setActiveSubTab('qa'); setSelectedChapter('all'); setIsSidebarCollapsed(false); }}
              className={`p-2.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                activeSubTab === 'qa'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-[3px_3px_8px_rgba(168,85,247,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold'
                  : 'bg-white/80 dark:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]'
              }`}
              title={`问答与面试 (${PROJECT_QA_CATALOG.length} 题)`}
            >
              <HelpCircle size={18} />
            </button>
            <button
              onClick={() => { setActiveSubTab('general'); setSelectedChapter('all'); setIsSidebarCollapsed(false); }}
              className={`p-2.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                activeSubTab === 'general'
                  ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-[3px_3px_8px_rgba(20,184,166,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold'
                  : 'bg-white/80 dark:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]'
              }`}
              title={`通识文献 (${GENERAL_READING_CATALOG.length} 篇)`}
            >
              <Lightbulb size={18} />
            </button>
          </div>
        </aside>
      ) : (
        <aside className="w-80 shrink-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 space-y-4 overflow-y-auto sticky top-18 h-[calc(100vh-5.5rem)] hidden md:block transition-all duration-300 select-none">
          <div className="pb-2 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-indigo-100/90 dark:bg-indigo-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-indigo-600 dark:text-indigo-400">
                <BookMarked size={14} />
              </div>
              <span>系统目录</span>
            </h2>
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
              title="收起系统目录"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

          {/* 5 Sub-Modules Nav (Clay pill tiles) */}
          <div className="space-y-1.5">
            <button
              onClick={() => {
                setActiveSubTab('cpp');
                setSelectedChapter('all');
              }}
              type="button"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left active:scale-x-105 active:scale-y-90 ${
                activeSubTab === 'cpp'
                  ? 'bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 dark:from-indigo-950/60 dark:via-blue-900/40 dark:to-indigo-950/60 text-indigo-900 dark:text-indigo-100 shadow-[4px_4px_10px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] -translate-y-0.5'
                  : 'bg-white/80 dark:bg-slate-800/80 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark size={14} className="text-indigo-500" />
                <span>C++ 知识</span>
              </div>
              <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${activeSubTab === 'cpp' ? 'bg-indigo-200/60 text-indigo-900 dark:bg-indigo-900/60 dark:text-indigo-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                {cppMasteredCount}/{CPP_KNOWLEDGE_SYSTEM.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('linux')}
              type="button"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left active:scale-x-105 active:scale-y-90 ${
                activeSubTab === 'linux'
                  ? 'bg-gradient-to-r from-emerald-100 via-teal-50 to-green-100 dark:from-emerald-950/60 dark:via-teal-900/40 dark:to-green-950/60 text-teal-900 dark:text-teal-100 shadow-[4px_4px_10px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] -translate-y-0.5'
                  : 'bg-white/80 dark:bg-slate-800/80 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-teal-500" />
                <span>Linux 编程</span>
              </div>
              <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${activeSubTab === 'linux' ? 'bg-emerald-200/60 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                {linuxMasteredCount}/{LINUX_SYSTEM_KNOWLEDGE.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('books')}
              type="button"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left active:scale-x-105 active:scale-y-90 ${
                activeSubTab === 'books'
                  ? 'bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-950/60 dark:via-orange-900/40 dark:to-yellow-950/60 text-amber-900 dark:text-amber-100 shadow-[4px_4px_10px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] -translate-y-0.5'
                  : 'bg-white/80 dark:bg-slate-800/80 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-amber-500" />
                <span>经典书目</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${activeSubTab === 'books' ? 'bg-amber-200/60 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                2 本
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('qa')}
              type="button"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left active:scale-x-105 active:scale-y-90 ${
                activeSubTab === 'qa'
                  ? 'bg-gradient-to-r from-purple-100 via-fuchsia-50 to-pink-100 dark:from-purple-950/60 dark:via-fuchsia-900/40 dark:to-pink-950/60 text-purple-900 dark:text-purple-100 shadow-[4px_4px_10px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] -translate-y-0.5'
                  : 'bg-white/80 dark:bg-slate-800/80 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <HelpCircle size={14} className="text-purple-500" />
                <span>问答与面试</span>
              </div>
              <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${activeSubTab === 'qa' ? 'bg-purple-200/60 text-purple-900 dark:bg-purple-900/60 dark:text-purple-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                {PROJECT_QA_CATALOG.length} 题
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('general')}
              type="button"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left active:scale-x-105 active:scale-y-90 ${
                activeSubTab === 'general'
                  ? 'bg-gradient-to-r from-teal-100 via-cyan-50 to-teal-100 dark:from-teal-950/60 dark:via-cyan-900/40 dark:to-teal-950/60 text-teal-900 dark:text-teal-100 shadow-[4px_4px_10px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] -translate-y-0.5'
                  : 'bg-white/80 dark:bg-slate-800/80 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lightbulb size={14} className="text-teal-500" />
                <span>通识文献</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${activeSubTab === 'general' ? 'bg-teal-200/60 text-teal-900 dark:bg-teal-900/60 dark:text-teal-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                {GENERAL_READING_CATALOG.length} 篇
              </span>
            </button>
          </div>

          {/* Search (Clay recessed input) */}
          <div className="relative pt-1">
            <Search size={14} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="搜索知识点、考点、指令..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 dark:bg-slate-900/70 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden transition-all"
            />
          </div>

          {/* Contextual Chapter Filter for C++ */}
          {activeSubTab === 'cpp' && (
            <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                章节分类索引
              </div>
              <button
                onClick={() => setSelectedChapter('all')}
                type="button"
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex items-center justify-between active:scale-x-105 active:scale-y-90 ${
                  selectedChapter === 'all'
                    ? 'bg-indigo-100/90 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08)]'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>全部章节</span>
                <span className="text-[10px] text-slate-400 font-mono">{CPP_KNOWLEDGE_SYSTEM.length}</span>
              </button>
              {cppChapters.map(([chap, items]) => (
                <button
                  key={chap}
                  onClick={() => setSelectedChapter(chap)}
                  type="button"
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex items-center justify-between truncate active:scale-x-105 active:scale-y-90 ${
                    selectedChapter === chap
                      ? 'bg-indigo-100/90 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08)]'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="truncate">{chap}</span>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-1 font-mono">{items.length}</span>
                </button>
              ))}
            </div>
          )}
        </aside>
      )}

      {/* ========================================================= */}
      {/* CENTER COLUMN: Clean Documentation Workbench (Fluid Full) */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-6 sm:p-8 space-y-6 overflow-y-auto w-full">
        {/* Module Header */}
        <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-3 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {activeSubTab === 'cpp' && 'C++ 进阶知识图谱'}
            {activeSubTab === 'linux' && 'Linux 系统编程底座'}
            {activeSubTab === 'books' && '经典书目伴读'}
            {activeSubTab === 'qa' && '项目问答与面试'}
            {activeSubTab === 'general' && '通识文献阅读'}
          </h1>
        </div>

        {/* 1. C++ 知识图谱 */}
        {activeSubTab === 'cpp' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>
                当前展示 {filteredCppItems.length} 项 · 已掌握{' '}
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{cppMasteredCount}</strong> /{' '}
                {CPP_KNOWLEDGE_SYSTEM.length}
              </span>
            </div>

            <div className="space-y-3">
              {filteredCppItems.map(item => {
                const isChecked = !!cppChecks[item.id];
                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-3xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      isChecked
                        ? 'bg-gradient-to-r from-emerald-50/70 to-teal-50/70 dark:from-emerald-950/30 dark:to-teal-950/30 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]'
                        : 'bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleCppCheck(item.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-110 active:scale-y-85 cursor-pointer shrink-0"
                        >
                          {isChecked ? (
                            <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950/80" />
                          ) : (
                            <Circle size={20} className="hover:scale-105 transition-transform" />
                          )}
                        </button>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                            参考专著: {item.bookReference}
                          </div>
                        </div>
                      </div>
                      {item.sourceFile && (
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] shrink-0 font-bold">
                          {item.sourceFile}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 space-y-2.5 pl-8">
                      <p className="leading-relaxed font-medium">{item.coreConcept}</p>
                      {item.keyPoints && item.keyPoints.length > 0 && (
                        <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
                          {item.keyPoints.map((kp, kIdx) => (
                            <li key={kIdx}>{kp}</li>
                          ))}
                        </ul>
                      )}
                      {item.interviewPoint && (
                        <div className="text-xs text-amber-900 dark:text-amber-200 bg-gradient-to-r from-amber-100/70 to-orange-50/70 dark:from-amber-950/40 dark:to-orange-900/30 p-3 rounded-2xl shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] font-medium">
                          <strong className="font-bold">面试重点：</strong>
                          {item.interviewPoint}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Linux 核心系统 */}
        {activeSubTab === 'linux' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>
                当前展示 {filteredLinuxItems.length} 项 · 已完成{' '}
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{linuxMasteredCount}</strong> /{' '}
                {LINUX_SYSTEM_KNOWLEDGE.length}
              </span>
            </div>

            <div className="space-y-3">
              {filteredLinuxItems.map(item => {
                const isChecked = !!linuxChecks[item.id];
                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-3xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      isChecked
                        ? 'bg-gradient-to-r from-emerald-50/70 to-teal-50/70 dark:from-emerald-950/30 dark:to-teal-950/30 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]'
                        : 'bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleLinuxCheck(item.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-110 active:scale-y-85 cursor-pointer shrink-0"
                        >
                          {isChecked ? (
                            <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950/80" />
                          ) : (
                            <Circle size={20} className="hover:scale-105 transition-transform" />
                          )}
                        </button>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                            {item.projectScene}
                          </div>
                        </div>
                      </div>
                    </div>

                    {item.syscallOrCmd && (
                      <div className="mt-3 pl-8 flex flex-wrap gap-2">
                        {item.syscallOrCmd.split('/').map((cmd: string, cIdx: number) => (
                          <code
                            key={cIdx}
                            className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] font-bold"
                          >
                            {cmd.trim()}
                          </code>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. 经典书目伴读 */}
        {activeSubTab === 'books' && (
          <div className="space-y-6">
            {Object.values(BOOKS_COMPANION_DATA).map(book => {
              const totalP = book.totalPages || 500;
              const currentP = booksProgress[book.key] || 120;
              const pct = Math.min(100, Math.round((currentP / totalP) * 100));

              return (
                <div
                  key={book.key}
                  className="p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.85)] space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {book.name}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        作者: {book.author} · 预计页数 {totalP} 页
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/80 px-3 py-1 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]">
                      {pct}%
                    </span>
                  </div>

                  {book.dynamicAdjustRule && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {book.dynamicAdjustRule}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>当前阅读进度: 第 {currentP} 页</span>
                      <span>剩余 {Math.max(0, totalP - currentP)} 页</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200/60 dark:bg-slate-900/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs text-slate-500 font-bold">更新页码:</span>
                    <input
                      type="number"
                      min={0}
                      max={totalP}
                      value={currentP}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setBooksProgress(prev => ({ ...prev, [book.key]: val }));
                      }}
                      className="w-24 px-3 py-1.5 rounded-xl shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden"
                    />
                    <span className="text-xs text-slate-400 font-bold">页</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. 项目核心八股 */}
        {activeSubTab === 'qa' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 font-medium">
              共 {filteredQA.length} 道面试常考题，紧密围绕 Kama-HTTPServer 状态机解析与 CppAIService 推理并发模型：
            </div>

            <div className="space-y-3">
              {filteredQA.map(qa => {
                const isExpanded = !!expandedQA[qa.id];
                return (
                  <div
                    key={qa.id}
                    className="rounded-3xl bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleQAExpand(qa.id)}
                      type="button"
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/50 dark:hover:bg-slate-750 transition cursor-pointer active:scale-x-105 active:scale-y-95"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] shrink-0">
                          {qa.category}
                        </span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {qa.question}
                        </span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="p-5 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/40 dark:bg-slate-950/30 whitespace-pre-line space-y-2">
                        <div className="font-medium">{qa.answer}</div>
                        {qa.relatedModule && (
                          <div className="pt-2 text-[11px] text-teal-700 dark:text-teal-400 font-mono font-bold">
                            对应工程实现: {qa.relatedModule}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. 通识文献阅读 */}
        {activeSubTab === 'general' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 font-medium">
              精选经典技术文献与架构通识：
            </div>

            <div className="space-y-3">
              {GENERAL_READING_CATALOG.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {doc.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono font-bold">
                      {doc.source}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {doc.summary}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-teal-700 dark:text-teal-300 font-bold pt-1">
                    <span>核心启发: {doc.keyTakeaway}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: Statistics & Quick Actions Panel            */}
      {/* ========================================================= */}
      <aside className="w-72 shrink-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 h-[calc(100vh-5.5rem)] sticky top-18 hidden xl:flex flex-col space-y-4 select-none overflow-y-auto">
        <div className="pb-2 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-indigo-100/90 dark:bg-indigo-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-indigo-600 dark:text-indigo-400">
              <Layers size={14} />
            </div>
            <span>学习进度</span>
          </h2>
        </div>

        {/* C++ Mastery Progress (Clay Indigo Mini Card) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-100/70 to-blue-50/70 dark:from-indigo-950/40 dark:to-blue-900/30 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
            <span>C++ 核心项掌握</span>
            <span className="font-mono font-bold text-indigo-800 dark:text-indigo-300">
              {cppMasteredCount} / {CPP_KNOWLEDGE_SYSTEM.length}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-indigo-200/50 dark:bg-indigo-950/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                width: `${Math.round((cppMasteredCount / (CPP_KNOWLEDGE_SYSTEM.length || 1)) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Linux Mastery Progress (Clay Emerald Mini Card) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-100/70 to-teal-50/70 dark:from-emerald-950/40 dark:to-teal-900/30 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
            <span>Linux 核心掌握</span>
            <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300">
              {linuxMasteredCount} / {LINUX_SYSTEM_KNOWLEDGE.length}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-emerald-200/50 dark:bg-emerald-950/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                width: `${Math.round((linuxMasteredCount / (LINUX_SYSTEM_KNOWLEDGE.length || 1)) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Tips & Engineering Guidance */}
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] text-xs space-y-2">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-sky-100/90 dark:bg-sky-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-sky-600 dark:text-sky-400">
              <Sparkles size={14} />
            </div>
            <span>学习建议</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            建议结合专栏项目中的源码实现，重点攻克 RAII 资源管理、移动语义、epoll 水平/边缘触发及多线程无锁队列，并做好自测记录。
          </p>
        </div>
      </aside>
    </div>
  );
};

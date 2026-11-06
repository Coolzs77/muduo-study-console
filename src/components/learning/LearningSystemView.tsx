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
    <div className="flex w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950">
      {/* ========================================================= */}
      {/* LEFT COLUMN: Sub-Tab Directory & Chapter Tree (Collapsible)*/}
      {/* ========================================================= */}
      {isSidebarCollapsed ? (
        <aside className="w-14 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 py-3.5 flex flex-col items-center space-y-3 sticky top-16 h-[calc(100vh-4rem)] hidden md:flex select-none transition-all duration-300">
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer active-press"
            title="展开系统目录"
          >
            <PanelLeftOpen size={18} />
          </button>

          <div className="w-8 h-px bg-slate-200 dark:bg-slate-800" />

          {/* Mini Subtab Icons */}
          <div className="flex flex-col items-center space-y-2 text-slate-600 dark:text-slate-400">
            <button
              onClick={() => { setActiveSubTab('cpp'); setSelectedChapter('all'); setIsSidebarCollapsed(false); }}
              className={`p-2 rounded-xl transition cursor-pointer active-press ${
                activeSubTab === 'cpp'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
              title={`C++ 知识 (${cppMasteredCount}/${CPP_KNOWLEDGE_SYSTEM.length})`}
            >
              <Bookmark size={18} />
            </button>
            <button
              onClick={() => { setActiveSubTab('linux'); setSelectedChapter('all'); setIsSidebarCollapsed(false); }}
              className={`p-2 rounded-xl transition cursor-pointer active-press ${
                activeSubTab === 'linux'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
              title={`Linux 编程 (${linuxMasteredCount}/${LINUX_SYSTEM_KNOWLEDGE.length})`}
            >
              <Terminal size={18} />
            </button>
            <button
              onClick={() => { setActiveSubTab('books'); setSelectedChapter('all'); setIsSidebarCollapsed(false); }}
              className={`p-2 rounded-xl transition cursor-pointer active-press ${
                activeSubTab === 'books'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
              title="经典书目伴读"
            >
              <BookOpen size={18} />
            </button>
            <button
              onClick={() => { setActiveSubTab('qa'); setSelectedChapter('all'); setIsSidebarCollapsed(false); }}
              className={`p-2 rounded-xl transition cursor-pointer active-press ${
                activeSubTab === 'qa'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
              title={`问答与面试 (${PROJECT_QA_CATALOG.length} 题)`}
            >
              <HelpCircle size={18} />
            </button>
            <button
              onClick={() => { setActiveSubTab('general'); setSelectedChapter('all'); setIsSidebarCollapsed(false); }}
              className={`p-2 rounded-xl transition cursor-pointer active-press ${
                activeSubTab === 'general'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
              title={`通识文献 (${GENERAL_READING_CATALOG.length} 篇)`}
            >
              <Lightbulb size={18} />
            </button>
          </div>
        </aside>
      ) : (
        <aside className="w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-5 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)] hidden md:block transition-all duration-300">
          <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookMarked size={16} className="text-sky-600 dark:text-sky-400" />
              <span>系统目录</span>
            </h2>
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer active-press"
              title="收起系统目录"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

        {/* 5 Sub-Modules Nav */}
        <div className="space-y-1">
          <button
            onClick={() => {
              setActiveSubTab('cpp');
              setSelectedChapter('all');
            }}
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
              activeSubTab === 'cpp'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bookmark size={14} />
              <span>C++ 知识</span>
            </div>
            <span className={`text-[11px] font-mono ${activeSubTab === 'cpp' ? 'text-sky-100' : 'text-slate-400'}`}>
              {cppMasteredCount}/{CPP_KNOWLEDGE_SYSTEM.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('linux')}
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
              activeSubTab === 'linux'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Terminal size={14} />
              <span>Linux 编程</span>
            </div>
            <span className={`text-[11px] font-mono ${activeSubTab === 'linux' ? 'text-sky-100' : 'text-slate-400'}`}>
              {linuxMasteredCount}/{LINUX_SYSTEM_KNOWLEDGE.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('books')}
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
              activeSubTab === 'books'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={14} />
              <span>经典书目</span>
            </div>
            <span className={`text-[11px] ${activeSubTab === 'books' ? 'text-sky-100' : 'text-slate-400'}`}>
              2 本
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('qa')}
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
              activeSubTab === 'qa'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <HelpCircle size={14} />
              <span>问答与面试</span>
            </div>
            <span className={`text-[11px] font-mono ${activeSubTab === 'qa' ? 'text-sky-100' : 'text-slate-400'}`}>
              {PROJECT_QA_CATALOG.length} 题
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('general')}
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
              activeSubTab === 'general'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Lightbulb size={14} />
              <span>通识文献</span>
            </div>
            <span className={`text-[11px] ${activeSubTab === 'general' ? 'text-sky-100' : 'text-slate-400'}`}>
              {GENERAL_READING_CATALOG.length} 篇
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative pt-2">
          <Search size={14} className="absolute left-3 top-5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索知识点、考点、指令..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Contextual Chapter Filter for C++ */}
        {activeSubTab === 'cpp' && (
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              章节分类索引
            </div>
            <button
              onClick={() => setSelectedChapter('all')}
              type="button"
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                selectedChapter === 'all'
                  ? 'bg-sky-100/80 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>全部章节</span>
              <span className="text-[10px] text-slate-400">{CPP_KNOWLEDGE_SYSTEM.length}</span>
            </button>
            {cppChapters.map(([chap, items]) => (
              <button
                key={chap}
                onClick={() => setSelectedChapter(chap)}
                type="button"
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between truncate ${
                  selectedChapter === chap
                    ? 'bg-sky-100/80 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="truncate">{chap}</span>
                <span className="text-[10px] text-slate-400 shrink-0 ml-1">{items.length}</span>
              </button>
            ))}
          </div>
        )}
      </aside>
      )}

      {/* ========================================================= */}
      {/* CENTER COLUMN: Clean Documentation Workbench (Fluid Full) */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6 overflow-y-auto w-full">
        {/* Module Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {activeSubTab === 'cpp' && 'C++ 知识'}
            {activeSubTab === 'linux' && 'Linux 编程'}
            {activeSubTab === 'books' && '经典书目'}
            {activeSubTab === 'qa' && '问答与面试'}
            {activeSubTab === 'general' && '通识文献'}
          </h1>
        </div>

        {/* 1. C++ 知识图谱 */}
        {activeSubTab === 'cpp' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
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
                    className={`p-4 rounded-xl border transition ${
                      isChecked
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => toggleCppCheck(item.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-500 transition cursor-pointer"
                        >
                          {isChecked ? (
                            <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50 dark:fill-transparent" />
                          ) : (
                            <Circle size={18} />
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
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                          {item.sourceFile}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 space-y-2 pl-7">
                      <p className="leading-relaxed">{item.coreConcept}</p>
                      {item.keyPoints && item.keyPoints.length > 0 && (
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-500 dark:text-slate-400">
                          {item.keyPoints.map((kp, kIdx) => (
                            <li key={kIdx}>{kp}</li>
                          ))}
                        </ul>
                      )}
                      {item.interviewPoint && (
                        <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200/50 dark:border-amber-900/40">
                          <strong className="font-semibold">面试重点：</strong>
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
            <div className="flex items-center justify-between text-xs text-slate-500">
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
                    className={`p-4 rounded-xl border transition ${
                      isChecked
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => toggleLinuxCheck(item.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-500 transition cursor-pointer"
                        >
                          {isChecked ? (
                            <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50 dark:fill-transparent" />
                          ) : (
                            <Circle size={18} />
                          )}
                        </button>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {item.projectScene}
                          </div>
                        </div>
                      </div>
                    </div>

                    {item.syscallOrCmd && (
                      <div className="mt-3 pl-7 flex flex-wrap gap-1.5">
                        {item.syscallOrCmd.split('/').map((cmd: string, cIdx: number) => (
                          <code
                            key={cIdx}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-slate-200/80 dark:border-slate-700/60"
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
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {book.name}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        作者: {book.author} · 预计页数 {totalP} 页
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg">
                      {pct}%
                    </span>
                  </div>

                  {book.dynamicAdjustRule && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {book.dynamicAdjustRule}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>当前阅读进度: 第 {currentP} 页</span>
                      <span>剩余 {Math.max(0, totalP - currentP)} 页</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs text-slate-500">更新页码:</span>
                    <input
                      type="number"
                      min={0}
                      max={totalP}
                      value={currentP}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setBooksProgress(prev => ({ ...prev, [book.key]: val }));
                      }}
                      className="w-24 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                    />
                    <span className="text-xs text-slate-400">页</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. 项目核心八股 */}
        {activeSubTab === 'qa' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500">
              共 {filteredQA.length} 道面试常考题，紧密围绕 Kama-HTTPServer 状态机解析与 CppAIService 推理并发模型：
            </div>

            <div className="space-y-3">
              {filteredQA.map(qa => {
                const isExpanded = !!expandedQA[qa.id];
                return (
                  <div
                    key={qa.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQAExpand(qa.id)}
                      type="button"
                      className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 shrink-0">
                          {qa.category}
                        </span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {qa.question}
                        </span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-1 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/30 dark:bg-slate-950/20 whitespace-pre-line space-y-2">
                        <div>{qa.answer}</div>
                        {qa.relatedModule && (
                          <div className="pt-2 text-[11px] text-slate-400 font-mono">
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
            <div className="text-xs text-slate-500">
              精选经典技术文献与架构通识：
            </div>

            <div className="space-y-3">
              {GENERAL_READING_CATALOG.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {doc.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {doc.source}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {doc.summary}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-sky-600 dark:text-sky-400 font-medium pt-1">
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
      <aside className="w-72 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-5 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)] hidden xl:block">
        <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers size={16} className="text-sky-600 dark:text-sky-400" />
            <span>学习进度</span>
          </h2>
        </div>

        {/* C++ Mastery Progress */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
            <span>C++ 核心项掌握</span>
            <span className="font-mono text-sky-600 dark:text-sky-400">
              {cppMasteredCount} / {CPP_KNOWLEDGE_SYSTEM.length}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-300"
              style={{
                width: `${Math.round((cppMasteredCount / (CPP_KNOWLEDGE_SYSTEM.length || 1)) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Linux Mastery Progress */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
            <span>Linux 核心掌握</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              {linuxMasteredCount} / {LINUX_SYSTEM_KNOWLEDGE.length}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{
                width: `${Math.round((linuxMasteredCount / (LINUX_SYSTEM_KNOWLEDGE.length || 1)) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Tips & Engineering Guidance */}
        <div className="p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/50 dark:border-sky-900/40 text-xs space-y-1.5">
          <div className="font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
            <Sparkles size={14} className="text-sky-600 dark:text-sky-400" />
            <span>学习建议</span>
          </div>
          <p className="text-[11px] text-sky-800 dark:text-sky-300/80 leading-relaxed">
            建议结合专栏项目中的源码实现，重点攻克 RAII 资源管理、移动语义、epoll 水平/边缘触发及多线程无锁队列，并做好自测记录。
          </p>
        </div>
      </aside>
    </div>
  );
};

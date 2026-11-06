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
  ChevronUp,
  FileCode,
  Flame,
  Lightbulb,
  Check
} from 'lucide-react';

type SubTab = 'cpp' | 'linux' | 'books' | 'qa' | 'general';

export const LearningSystemView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('cpp');
  const [searchQuery, setSearchQuery] = useState('');

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
      showToast(next ? '已勾选知识点' : '已取消勾选', 'info');
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
      const chap = item.chapterTitle || '基础章节';
      if (!map.has(chap)) map.set(chap, []);
      map.get(chap)!.push(item);
    });
    return Array.from(map.entries());
  }, []);

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

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <BookOpen size={22} />
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            C++ / Linux 后端统一知识系统
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          涵盖《C++ Primer Plus》体系化知识图谱、Linux 核心系统与指令、经典专著进度跟踪、高频八股真题与通识文献。
        </p>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveSubTab('cpp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'cpp'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Bookmark size={14} />
            <span>C++ 知识图谱 (30)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('linux')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'linux'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Terminal size={14} />
            <span>Linux 核心体系 (32)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('books')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'books'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen size={14} />
            <span>经典书目伴读</span>
          </button>
          <button
            onClick={() => setActiveSubTab('qa')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'qa'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <HelpCircle size={14} />
            <span>项目核心八股 (15)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('general')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'general'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Lightbulb size={14} />
            <span>通识文献阅读</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: C++ 知识图谱 */}
      {activeSubTab === 'cpp' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              已掌握: {Object.values(cppChecks).filter(Boolean).length} / {CPP_KNOWLEDGE_SYSTEM.length} 项
            </span>
          </div>

          <div className="space-y-6">
            {cppChapters.map(([chapterTitle, items], cIdx) => (
              <div
                key={cIdx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
              >
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Bookmark size={16} className="text-sky-600" />
                  <span>{chapterTitle}</span>
                  <span className="text-xs font-normal text-slate-400">({items.length} 个知识点)</span>
                </h3>

                <div className="space-y-3">
                  {items.map(item => {
                    const isChecked = !!cppChecks[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCppCheck(item.id)}
                        className={`p-4 rounded-xl border transition cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/60 hover:bg-slate-100/60 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <button
                              type="button"
                              className="mt-0.5 text-slate-400 hover:text-emerald-500 transition"
                            >
                              {isChecked ? (
                                <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50" />
                              ) : (
                                <Circle size={18} />
                              )}
                            </button>
                            <div>
                              <div className="font-bold text-sm text-slate-900 dark:text-white">
                                {item.title}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                                对应专著: {item.bookReference}
                              </div>
                            </div>
                          </div>
                          {item.sourceFile && (
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                              {item.sourceFile}
                            </span>
                          )}
                        </div>

                        {/* Concept & Keypoints */}
                        <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-7">
                          <p className="leading-relaxed">{item.coreConcept}</p>
                          {item.keyPoints && item.keyPoints.length > 0 && (
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-500 dark:text-slate-400">
                              {item.keyPoints.map((kp, kIdx) => (
                                <li key={kIdx}>{kp}</li>
                              ))}
                            </ul>
                          )}
                          {item.interviewPoint && (
                            <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-2 bg-amber-50/60 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200/40 dark:border-amber-900/40">
                              <span className="font-semibold">高频面试考察点: </span>
                              {item.interviewPoint}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Linux 核心 */}
      {activeSubTab === 'linux' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              已标记: {Object.values(linuxChecks).filter(Boolean).length} / {LINUX_SYSTEM_KNOWLEDGE.length} 项
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LINUX_SYSTEM_KNOWLEDGE.map(item => {
              const isChecked = !!linuxChecks[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleLinuxCheck(item.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    isChecked
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button type="button" className="text-slate-400">
                          {isChecked ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : (
                            <Circle size={16} />
                          )}
                        </button>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                        {item.dimension}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 p-2 rounded-lg border border-sky-100 dark:border-sky-900/40">
                      $ {item.syscallOrCmd}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">工程场景: </span>
                      {item.projectScene}
                    </p>

                    {item.interviewPoint && (
                      <div className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200/40 dark:border-amber-900/30">
                        <span className="font-semibold">面试重点: </span>
                        {item.interviewPoint}
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    出处: {item.bookReference}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: 经典书目伴读 */}
      {activeSubTab === 'books' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(BOOKS_COMPANION_DATA).map(([k, book]) => {
              const currentPages = booksProgress[k] || 0;
              const totalPages = book.totalPages || 600;
              const pct = Math.min(100, Math.round((currentPages / totalPages) * 100));

              return (
                <div
                  key={k}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {book.name}
                      </h3>
                      <div className="text-xs text-slate-500 mt-1">作者: {book.author}</div>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold shrink-0">
                      {pct}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>已读 {currentPages} 页</span>
                      <span>总计 {totalPages} 页</span>
                    </div>
                  </div>

                  {/* Daily Goal & Update */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-slate-500">
                      推荐每日目标: {book.defaultDailyGoal} {book.unit}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <label className="text-slate-400">更新页码:</label>
                      <input
                        type="number"
                        min="0"
                        max={totalPages}
                        value={currentPages}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 0;
                          setBooksProgress(prev => ({ ...prev, [k]: val }));
                        }}
                        className="w-16 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-mono font-bold text-xs"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: 项目核心八股 */}
      {activeSubTab === 'qa' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索八股问题、答案关键词、分类..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500 transition shadow-2xs"
            />
          </div>

          <div className="space-y-3">
            {filteredQA.map(item => {
              const isExpanded = !!expandedQA[item.id];
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition"
                >
                  <div
                    onClick={() => toggleQAExpand(item.id)}
                    className="p-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition flex items-center justify-between gap-4 select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        Q
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {item.question}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.category}
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
                      <div className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                        {item.answer}
                      </div>

                      {item.keyPoints && item.keyPoints.length > 0 && (
                        <div>
                          <div className="font-semibold text-xs text-slate-500 mb-1">关键得分点:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.keyPoints.map((kp, kIdx) => (
                              <span
                                key={kIdx}
                                className="px-2 py-0.5 rounded-md text-[11px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60"
                              >
                                {kp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.sourceReference && (
                        <div className="text-xs text-slate-400 font-mono">
                          源码参考: {item.sourceReference}
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

      {/* Sub-Tab 5: 通识文献阅读 */}
      {activeSubTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GENERAL_READING_CATALOG.map(book => (
            <div
              key={book.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {book.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40">
                    {book.timeOfDay}
                  </span>
                </div>
                <div className="text-xs text-slate-500">作者: {book.author}</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">工程沉淀聚焦: </span>
                  {book.reflectionFocus || book.engineeringReflection}
                </p>
              </div>

              <div className="text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>推荐每日阅读: {book.targetPagesDaily} 页</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Check size={13} />
                  已列入书单
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

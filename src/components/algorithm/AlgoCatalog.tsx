import React, { useState, useMemo, useEffect } from 'react';
import { ALGORITHM_LAB_CATALOG } from '../../data/algoDataset';
import { AlgoCard } from './AlgoCard';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Search, CheckCircle2, CheckSquare, Dices, ExternalLink, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export const STANDARD_CATEGORIES = [
  '数组', '链表', '哈希表', '字符串', '双指针法', '栈与队列',
  '二叉树', '回溯算法', '贪心算法', '动态规划', '单调栈', '图论'
] as const;

export const CARL_HOT100_CHAPTERS = [
  '哈希', '双指针', '滑动窗口', '子串', '普通数组', '矩阵', '链表',
  '二叉树', '图论', '回溯', '二分查找', '栈', '堆', '贪心算法',
  '动态规划', '多维动态规划', '技巧'
] as const;

export const AlgoCatalog: React.FC = () => {
  const [viewTrack, setViewTrack] = useState<'all' | 'hot100' | 'carl'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [diffFilter, setDiffFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage<boolean>(
    'sidebar_collapsed_algo',
    false
  );

  const [completedMap, setCompletedMap] = useLocalStorage<Record<string | number, boolean>>(
    'completedAlgos',
    {}
  );

  // Reset category when switching track
  useEffect(() => {
    setSelectedCategory('all');
  }, [viewTrack]);

  // Determine if problem is done
  const isProblemDone = (p: typeof ALGORITHM_LAB_CATALOG[0]) => {
    if (!completedMap) return false;
    if (p.num !== null && p.num !== undefined) {
      return !!completedMap[p.num] || !!completedMap[String(p.num)];
    }
    return p.id ? !!completedMap[p.id] : false;
  };

  // Toggle problem done
  const handleToggleDone = (p: typeof ALGORITHM_LAB_CATALOG[0]) => {
    const key = p.num !== null && p.num !== undefined ? String(p.num) : p.id;
    if (!key) return;
    const current = isProblemDone(p);
    setCompletedMap((prev) => ({
      ...prev,
      [key]: !current
    }));
  };

  // Filter problems based on viewTrack
  const trackProblems = useMemo(() => {
    switch (viewTrack) {
      case 'hot100':
        return ALGORITHM_LAB_CATALOG.filter((p) => p.isHot100).sort(
          (a, b) => (a.hot100Order || 999) - (b.hot100Order || 999)
        );
      case 'carl':
        return ALGORITHM_LAB_CATALOG.filter((p) => p.isCarl);
      case 'all':
      default:
        return ALGORITHM_LAB_CATALOG;
    }
  }, [viewTrack]);

  const [randomProblem, setRandomProblem] = useState<typeof ALGORITHM_LAB_CATALOG[0] | null>(null);

  const handlePickRandom = () => {
    const uncompleted = trackProblems.filter(p => !isProblemDone(p));
    const pool = uncompleted.length > 0 ? uncompleted : trackProblems;
    if (pool.length === 0) return;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setRandomProblem(picked);
  };

  useEffect(() => {
    handlePickRandom();
  }, [viewTrack]);

  // Categories list based on track
  const categories = useMemo(() => {
    if (viewTrack === 'hot100') {
      return CARL_HOT100_CHAPTERS;
    }
    return STANDARD_CATEGORIES;
  }, [viewTrack]);

  // Category progress stats (total & completed per category)
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number; pct: number }> = {};
    categories.forEach(cat => {
      stats[cat] = { total: 0, completed: 0, pct: 0 };
    });

    trackProblems.forEach(p => {
      const key = viewTrack === 'hot100' ? p.hot100Chapter || '' : p.category || '';
      if (stats[key]) {
        stats[key].total++;
        if (isProblemDone(p)) {
          stats[key].completed++;
        }
      }
    });

    Object.keys(stats).forEach(cat => {
      const { total, completed } = stats[cat];
      stats[cat].pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    });

    return stats;
  }, [trackProblems, categories, completedMap, viewTrack]);

  // Overall track stats
  const trackCompletedCount = useMemo(() => {
    return trackProblems.filter(p => isProblemDone(p)).length;
  }, [trackProblems, completedMap]);

  const trackTotalCount = trackProblems.length;
  const trackPct = trackTotalCount > 0 ? Math.round((trackCompletedCount / trackTotalCount) * 100) : 0;

  // Filtered problems for center list
  const displayedProblems = useMemo(() => {
    return trackProblems.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (viewTrack === 'hot100') {
          if (p.hot100Chapter !== selectedCategory) return false;
        } else {
          if (p.category !== selectedCategory) return false;
        }
      }

      // Difficulty filter
      if (diffFilter !== 'all') {
        const d = p.difficulty.toLowerCase();
        if (diffFilter === 'Easy' && d !== 'easy' && d !== '简单') return false;
        if (diffFilter === 'Medium' && d !== 'medium' && d !== '中等') return false;
        if (diffFilter === 'Hard' && d !== 'hard' && d !== '困难') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = p.title.toLowerCase().includes(q);
        const inNum = p.num !== null && String(p.num).includes(q);
        const inPattern = (p.pattern || '').toLowerCase().includes(q);
        const inChapter = (p.hot100Chapter || '').toLowerCase().includes(q);
        if (!inTitle && !inNum && !inPattern && !inChapter) return false;
      }
      return true;
    });
  }, [trackProblems, viewTrack, selectedCategory, diffFilter, searchQuery]);

  // Difficulty counts
  const diffCounts = useMemo(() => {
    let easyTot = 0, easyDone = 0;
    let medTot = 0, medDone = 0;
    let hardTot = 0, hardDone = 0;

    trackProblems.forEach(p => {
      const d = p.difficulty.toLowerCase();
      const done = isProblemDone(p);
      if (d === 'easy' || d === '简单') {
        easyTot++;
        if (done) easyDone++;
      } else if (d === 'medium' || d === '中等') {
        medTot++;
        if (done) medDone++;
      } else if (d === 'hard' || d === '困难') {
        hardTot++;
        if (done) hardDone++;
      }
    });

    return { easyTot, easyDone, medTot, medDone, hardTot, hardDone };
  }, [trackProblems, completedMap]);

  return (
    <div className="flex items-start w-full min-h-[calc(100vh-4rem)] bg-[#eef2f7] dark:bg-[#11141a] transition-colors duration-300 p-3 sm:p-4 gap-4 text-slate-800 dark:text-slate-200">
      {/* ==================================================================== */}
      {/* Left Column: Track Switcher & Category Directory Tree (Collapsible)   */}
      {/* ==================================================================== */}
      {isSidebarCollapsed ? (
        <aside className="w-16 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/90 dark:bg-[#151922]/90 shadow-[6px_6px_14px_rgba(0,0,0,0.06),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] py-4 flex flex-col items-center space-y-3 sticky top-18 h-[calc(100vh-5.5rem)] hidden md:flex select-none transition-all duration-300">
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-sky-600 shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
            title="展开专题分类"
          >
            <PanelLeftOpen size={18} />
          </button>

          <div className="w-8 h-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]" />

          {/* Quick Track Switcher (Clay Pills) */}
          <div className="flex flex-col items-center space-y-2 text-[11px] font-bold">
            <button
              onClick={() => { setViewTrack('all'); setSelectedCategory('all'); setIsSidebarCollapsed(false); }}
              className={`w-10 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                viewTrack === 'all'
                  ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-[3px_3px_8px_rgba(147,51,234,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]'
              }`}
              title="全部题目 (234)"
            >
              全
            </button>
            <button
              onClick={() => { setViewTrack('hot100'); setSelectedCategory('all'); setIsSidebarCollapsed(false); }}
              className={`w-10 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                viewTrack === 'hot100'
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-[3px_3px_8px_rgba(245,158,11,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]'
              }`}
              title="Hot 100 精选题 (100)"
            >
              Hot
            </button>
            <button
              onClick={() => { setViewTrack('carl'); setSelectedCategory('all'); setIsSidebarCollapsed(false); }}
              className={`w-10 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                viewTrack === 'carl'
                  ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-[3px_3px_8px_rgba(14,165,233,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]'
              }`}
              title="代码随想录经典 (179)"
            >
              录
            </button>
          </div>
        </aside>
      ) : (
        <aside className="w-80 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 flex flex-col h-[calc(100vh-5.5rem)] sticky top-18 select-none transition-all duration-300 overflow-hidden">
          {/* Header & Track Selector */}
          <div className="pb-3 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-purple-100/90 dark:bg-purple-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-purple-600 dark:text-purple-400">
                  <CheckSquare size={14} />
                </div>
                <span>专题分类</span>
                <span className="text-xs text-slate-400 font-mono">({categories.length} 个专题)</span>
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
                title="收起专题分类"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>

            {/* Track Switcher (Clay recessed groove) */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/50 dark:bg-slate-900/60 rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.05)] text-xs font-semibold text-center">
              <button
                onClick={() => {
                  setViewTrack('all');
                  setSelectedCategory('all');
                }}
                className={`py-1.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                  viewTrack === 'all'
                    ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                全部 (234)
              </button>
              <button
                onClick={() => {
                  setViewTrack('hot100');
                  setSelectedCategory('all');
                }}
                className={`py-1.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                  viewTrack === 'hot100'
                    ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Hot 100
              </button>
              <button
                onClick={() => {
                  setViewTrack('carl');
                  setSelectedCategory('all');
                }}
                className={`py-1.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                  viewTrack === 'carl'
                    ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                随想录
              </button>
            </div>

            {/* Progress Summary (Clay lilac mini card) */}
            <div className="bg-gradient-to-br from-purple-100/70 via-fuchsia-50 to-pink-100/70 dark:from-purple-950/40 dark:via-fuchsia-900/30 dark:to-pink-900/40 p-3 rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-900 dark:text-purple-100">
                  当前题单进度 ({trackCompletedCount} / {trackTotalCount} 题)
                </span>
                <span className="font-mono font-bold text-purple-800 dark:text-purple-200">
                  {trackPct}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-purple-200/50 dark:bg-purple-950/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{ width: `${trackPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Category List with Individual Progress (Clay pill strips) */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {/* 'All' Button */}
            <div
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-xs active:scale-x-105 active:scale-y-90 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-purple-100 via-fuchsia-50 to-pink-100 dark:from-purple-950/60 dark:via-fuchsia-900/40 dark:to-pink-950/60 text-purple-950 dark:text-purple-100 shadow-[4px_4px_12px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] font-bold -translate-y-0.5'
                  : 'bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="font-bold">全部专题</span>
              <span className="text-slate-400 font-mono font-semibold">
                {trackCompletedCount} / {trackTotalCount}
              </span>
            </div>

            {/* Individual Category Items */}
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const cStat = categoryStats[cat] || { total: 0, completed: 0, pct: 0 };
              const isAllDone = cStat.total > 0 && cStat.completed === cStat.total;

              return (
                <div
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`group p-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-xs space-y-1.5 active:scale-x-105 active:scale-y-90 select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-100 via-fuchsia-50 to-pink-100 dark:from-purple-950/60 dark:via-fuchsia-900/40 dark:to-pink-950/60 shadow-[4px_4px_12px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] -translate-y-0.5'
                      : 'bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isAllDone ? (
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                      )}
                      <span className="font-bold truncate text-slate-800 dark:text-slate-100">{cat}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <span className={isAllDone ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                        {cStat.completed} / {cStat.total}
                      </span>
                      <span className="w-7 text-right font-mono font-semibold">{cStat.pct}%</span>
                    </div>
                  </div>

                  {/* Individual Mini Progress Bar */}
                  <div className="w-full bg-slate-200/60 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08)]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isAllDone
                          ? 'bg-emerald-500'
                          : isSelected
                          ? 'bg-purple-600'
                          : 'bg-slate-400 dark:bg-slate-600'
                      }`}
                      style={{ width: `${cStat.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* ==================================================================== */}
      {/* Middle Column: Problem List Canvas with Scroll Container (Workbench) */}
      {/* ==================================================================== */}
      <main className="flex-1 min-w-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-6 sm:p-8 flex flex-col h-[calc(100vh-5.5rem)] w-full overflow-hidden">
        {/* Search & Filter Toolbar (Fixed Header) */}
        <div className="shrink-0 space-y-3 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Difficulty Chips (Clay Candy Pills) */}
            <div className="flex items-center gap-2 text-xs">
              {(['all', 'Easy', 'Medium', 'Hard'] as const).map(df => (
                <button
                  key={df}
                  onClick={() => setDiffFilter(df)}
                  className={`px-3 py-1.5 rounded-2xl font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                    diffFilter === df
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[3px_3px_8px_rgba(147,51,234,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] -translate-y-0.5'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5'
                  }`}
                >
                  {df === 'all' ? '全部难度' : df === 'Easy' ? '简单' : df === 'Medium' ? '中等' : '困难'}
                </button>
              ))}
            </div>

            {/* Search Box (Clay recessed input) */}
            <div className="relative w-full sm:w-72 shrink-0">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索题号、题名或解法..."
                className="w-full bg-white/80 dark:bg-slate-900/70 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Current Active Category Title */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-medium">
            <span>
              当前展示: <strong className="text-slate-900 dark:text-white font-bold">{selectedCategory === 'all' ? '全部专题' : selectedCategory}</strong> ({displayedProblems.length} 道题目)
            </span>
          </div>
        </div>

        {/* Problems List (Independent Smooth Scroll Container) */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-2 pt-4 space-y-3 scrollbar-thin">
          {displayedProblems.map((problem) => (
            <AlgoCard
              key={problem.id}
              problem={problem}
              isDone={isProblemDone(problem)}
              onToggleDone={() => handleToggleDone(problem)}
            />
          ))}

          {displayedProblems.length === 0 && (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <p>未找到匹配的算法题目</p>
            </div>
          )}
        </div>
      </main>

      {/* ==================================================================== */}
      {/* Right Column: Statistics & Random Pick                               */}
      {/* ==================================================================== */}
      <aside className="w-80 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 h-[calc(100vh-5.5rem)] sticky top-18 hidden lg:flex flex-col space-y-4 select-none overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
            数据总览
          </h3>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            {trackCompletedCount} / {trackTotalCount} 题
          </span>
        </div>

        {/* Difficulty Metrics (Clay Candy Mini Cards) */}
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-100/70 to-teal-50/70 dark:from-emerald-950/40 dark:to-teal-900/30 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] flex items-center justify-between">
            <span className="font-bold text-emerald-900 dark:text-emerald-200">简单</span>
            <span className="font-bold font-mono text-emerald-800 dark:text-emerald-300">
              {diffCounts.easyDone} / {diffCounts.easyTot}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-100/70 to-orange-50/70 dark:from-amber-950/40 dark:to-orange-900/30 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] flex items-center justify-between">
            <span className="font-bold text-amber-900 dark:text-amber-200">中等</span>
            <span className="font-bold font-mono text-amber-800 dark:text-amber-300">
              {diffCounts.medDone} / {diffCounts.medTot}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-100/70 to-pink-50/70 dark:from-rose-950/40 dark:to-pink-900/30 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] flex items-center justify-between">
            <span className="font-bold text-rose-900 dark:text-rose-200">困难</span>
            <span className="font-bold font-mono text-rose-800 dark:text-rose-300">
              {diffCounts.hardDone} / {diffCounts.hardTot}
            </span>
          </div>
        </div>

        {/* Hot 100 Card (Clay Amber Card) */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-100/80 via-orange-50 to-yellow-100/80 dark:from-amber-950/40 dark:via-orange-900/30 dark:to-yellow-900/40 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.8)] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 dark:text-amber-200">Hot 100 精选进度</span>
            <span className="text-xs text-amber-800 dark:text-amber-300 font-bold font-mono">
              {Math.round((ALGORITHM_LAB_CATALOG.filter(p => p.isHot100 && isProblemDone(p)).length / 100) * 100)}%
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-950 dark:text-amber-100 font-mono">
              {ALGORITHM_LAB_CATALOG.filter(p => p.isHot100 && isProblemDone(p)).length}
              <span className="text-xs text-amber-700/80 dark:text-amber-300/80 font-normal"> / 100 题</span>
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-amber-200/50 dark:bg-amber-950/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                width: `${Math.round((ALGORITHM_LAB_CATALOG.filter(p => p.isHot100 && isProblemDone(p)).length / 100) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Random Problem Generator (Clay Card with squash button) */}
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-800/80 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.85)] space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-sky-100/90 dark:bg-sky-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-sky-600 dark:text-sky-400">
                <Dices size={14} />
              </div>
              <span>随机刷题</span>
            </span>
            <button
              onClick={handlePickRandom}
              className="px-3 py-1 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-200 font-bold shadow-[2px_2px_5px_rgba(0,0,0,0.05),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
            >
              换一题
            </button>
          </div>

          {randomProblem ? (
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white truncate">
                  {randomProblem.num && <span className="font-mono text-sky-600 dark:text-sky-400">#{randomProblem.num}</span>}
                  <span className="truncate">{randomProblem.title}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>{randomProblem.difficulty}</span>
                  <span>•</span>
                  <span>{randomProblem.category || randomProblem.hot100Chapter || '算法'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleToggleDone(randomProblem)}
                  className={`flex-1 py-2 px-3 rounded-2xl text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-center active:scale-x-105 active:scale-y-90 ${
                    isProblemDone(randomProblem)
                      ? 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/70 dark:to-teal-900/70 text-teal-900 dark:text-teal-100 shadow-[3px_3px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.9)]'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-[3px_3px_8px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] hover:-translate-y-0.5'
                  }`}
                >
                  {isProblemDone(randomProblem) ? '✓ 已完成' : '标记完成'}
                </button>
                {randomProblem.leetcodeUrl && (
                  <a
                    href={randomProblem.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-[3px_3px_8px_rgba(14,165,233,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
                    title="在 LeetCode 打开"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-2">暂无推荐题目</p>
          )}
        </div>

        {/* Quick Category Jump (Clay Pills) */}
        <div className="space-y-2 text-xs pt-1">
          <div className="font-bold text-slate-600 dark:text-slate-400 text-[11px]">
            常用专题速览
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 8).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-2xl text-[11px] font-semibold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-[2px_2px_5px_rgba(147,51,234,0.3),inset_1.5px_1.5px_3px_rgba(255,255,255,0.6)] font-bold -translate-y-0.5'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 shadow-[2px_2px_4px_rgba(0,0,0,0.04),inset_1px_1px_2px_rgba(255,255,255,0.8)] hover:-translate-y-0.5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

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
    <div className="flex w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* ==================================================================== */}
      {/* Left Column: Track Switcher & Category Directory Tree (Collapsible)   */}
      {/* ==================================================================== */}
      {isSidebarCollapsed ? (
        <aside className="w-14 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center py-3.5 space-y-3 h-[calc(100vh-4rem)] sticky top-16 select-none transition-all duration-300">
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer active-press"
            title="展开专题分类"
          >
            <PanelLeftOpen size={18} />
          </button>

          <div className="w-8 h-px bg-slate-200 dark:bg-slate-800" />

          {/* Quick Track Switcher */}
          <div className="flex flex-col items-center space-y-1 text-[11px] font-bold">
            <button
              onClick={() => { setViewTrack('all'); setSelectedCategory('all'); setIsSidebarCollapsed(false); }}
              className={`w-9 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                viewTrack === 'all'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="全部题目 (234)"
            >
              全
            </button>
            <button
              onClick={() => { setViewTrack('hot100'); setSelectedCategory('all'); setIsSidebarCollapsed(false); }}
              className={`w-9 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                viewTrack === 'hot100'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Hot 100 精选题 (100)"
            >
              Hot
            </button>
            <button
              onClick={() => { setViewTrack('carl'); setSelectedCategory('all'); setIsSidebarCollapsed(false); }}
              className={`w-9 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                viewTrack === 'carl'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="代码随想录经典 (179)"
            >
              录
            </button>
          </div>

          <div className="w-8 h-px bg-slate-200 dark:bg-slate-800 mt-auto" />

          {/* Current Category Pill */}
          <div
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-[10px] font-bold text-sky-600 dark:text-sky-400 cursor-pointer text-center px-1 truncate"
            onClick={() => setIsSidebarCollapsed(false)}
            title={`当前分类: ${selectedCategory === 'all' ? '全部专题' : selectedCategory}`}
          >
            {selectedCategory === 'all' ? '全部' : selectedCategory.slice(0, 2)}
          </div>
        </aside>
      ) : (
        <aside className="w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none transition-all duration-300">
          {/* Header & Track Selector */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
                <CheckSquare size={16} className="text-sky-600 dark:text-sky-400" />
                <span>专题分类</span>
                <span className="text-xs text-slate-400 font-normal">({categories.length} 个专题)</span>
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer active-press"
                title="收起专题分类"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>

          {/* Track Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs font-medium text-center">
            <button
              onClick={() => {
                setViewTrack('all');
                setSelectedCategory('all');
              }}
              className={`py-1 rounded-md transition cursor-pointer ${
                viewTrack === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
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
              className={`py-1 rounded-md transition cursor-pointer ${
                viewTrack === 'hot100'
                  ? 'bg-amber-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Hot 100 (100)
            </button>
            <button
              onClick={() => {
                setViewTrack('carl');
                setSelectedCategory('all');
              }}
              className={`py-1 rounded-md transition cursor-pointer ${
                viewTrack === 'carl'
                  ? 'bg-sky-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              随想录 (179)
            </button>
          </div>

          {/* Progress Summary */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                当前题单进度: {trackCompletedCount} / {trackTotalCount} 题
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {trackPct}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${trackPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category List with Individual Progress */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* 'All' Button */}
          <div
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer text-xs ${
              selectedCategory === 'all'
                ? 'bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-100 font-bold'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>全部专题</span>
            <span className="text-slate-400 font-normal">
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
                className={`group p-2.5 rounded-xl transition cursor-pointer text-xs space-y-1.5 ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-100 shadow-2xs font-semibold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {isAllDone ? (
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                    )}
                    <span className="truncate">{cat}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-normal">
                    <span className={isAllDone ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''}>
                      {cStat.completed} / {cStat.total}
                    </span>
                    <span className="w-6 text-right font-mono">{cStat.pct}%</span>
                  </div>
                </div>

                {/* Individual Mini Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isAllDone
                        ? 'bg-emerald-500'
                        : isSelected
                        ? 'bg-sky-500'
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
      {/* Middle Column: LeetCode-style Problem List (Fluid Full Width)        */}
      {/* ==================================================================== */}
      <main className="flex-1 min-w-0 overflow-y-auto px-6 py-6 sm:px-10 space-y-4 w-full">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          {/* Difficulty Chips */}
          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'Easy', 'Medium', 'Hard'] as const).map(df => (
              <button
                key={df}
                onClick={() => setDiffFilter(df)}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  diffFilter === df
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {df === 'all' ? '全部难度' : df === 'Easy' ? '简单' : df === 'Medium' ? '中等' : '困难'}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索题号、题名或解法..."
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 transition"
            />
          </div>
        </div>

        {/* Current Active Category Title */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            当前展示: <strong className="text-slate-900 dark:text-white">{selectedCategory === 'all' ? '全部专题' : selectedCategory}</strong> ({displayedProblems.length} 道题目)
          </span>
        </div>

        {/* Problems List */}
        <div className="space-y-2">
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
      {/* Right Column: Statistics, Random Pick & Technique Radar             */}
      {/* ==================================================================== */}
      <aside className="w-80 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 h-[calc(100vh-4rem)] sticky top-16 hidden lg:flex flex-col space-y-3.5 select-none overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
            数据总览
          </h3>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            {trackCompletedCount} / {trackTotalCount} 题
          </span>
        </div>

        {/* Difficulty Metrics */}
        <div className="space-y-1.5 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300">简单</span>
            <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
              {diffCounts.easyDone} / {diffCounts.easyTot}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
            <span className="font-semibold text-amber-800 dark:text-amber-300">中等</span>
            <span className="font-bold font-mono text-amber-700 dark:text-amber-400">
              {diffCounts.medDone} / {diffCounts.medTot}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between">
            <span className="font-semibold text-rose-800 dark:text-rose-300">困难</span>
            <span className="font-bold font-mono text-rose-700 dark:text-rose-400">
              {diffCounts.hardDone} / {diffCounts.hardTot}
            </span>
          </div>
        </div>

        {/* Hot 100 Card */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Hot 100</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold font-mono">
              {Math.round((ALGORITHM_LAB_CATALOG.filter(p => p.isHot100 && isProblemDone(p)).length / 100) * 100)}%
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {ALGORITHM_LAB_CATALOG.filter(p => p.isHot100 && isProblemDone(p)).length}
              <span className="text-xs text-slate-400 font-normal"> / 100 题</span>
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.round((ALGORITHM_LAB_CATALOG.filter(p => p.isHot100 && isProblemDone(p)).length / 100) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Random Problem Generator */}
        <div className="p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
              <Dices size={14} className="text-sky-600 dark:text-sky-400" />
              <span>随机刷题</span>
            </span>
            <button
              onClick={handlePickRandom}
              className="px-2 py-0.5 rounded text-[11px] bg-sky-100 hover:bg-sky-200 dark:bg-sky-900/60 dark:hover:bg-sky-800 text-sky-700 dark:text-sky-300 font-medium transition cursor-pointer active-press"
            >
              换一题
            </button>
          </div>

          {randomProblem ? (
            <div className="space-y-2 pt-1">
              <div>
                <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white truncate">
                  {randomProblem.num && <span className="font-mono text-sky-600">#{randomProblem.num}</span>}
                  <span className="truncate">{randomProblem.title}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{randomProblem.difficulty}</span>
                  <span>•</span>
                  <span>{randomProblem.category || randomProblem.hot100Chapter || '算法'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleToggleDone(randomProblem)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition cursor-pointer text-center active-press ${
                    isProblemDone(randomProblem)
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                  }`}
                >
                  {isProblemDone(randomProblem) ? '✓ 已完成' : '标记完成'}
                </button>
                {randomProblem.leetcodeUrl && (
                  <a
                    href={randomProblem.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition active-press"
                    title="在 LeetCode 打开"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-2">暂无推荐题目</p>
          )}
        </div>

        {/* Quick Category Jump */}
        <div className="space-y-1.5 text-xs pt-1">
          <div className="font-semibold text-slate-600 dark:text-slate-400 text-[11px]">
            常用专题速览
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 8).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 rounded-md text-[11px] transition cursor-pointer active-press ${
                  selectedCategory === cat
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
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

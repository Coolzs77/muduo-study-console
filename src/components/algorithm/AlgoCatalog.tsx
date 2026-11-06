import React, { useState, useMemo, useEffect } from 'react';
import { ALGORITHM_LAB_CATALOG } from '../../data/algoDataset';
import { AlgoCard } from './AlgoCard';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Search, CheckCircle2, Filter } from 'lucide-react';

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
  const [completedMap, setCompletedMap] = useLocalStorage<Record<string | number, boolean>>(
    'completedAlgos',
    {}
  );

  // Reset selected category when switching track
  useEffect(() => {
    setSelectedCategory('all');
  }, [viewTrack]);

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

  // Extract categories / chapters
  const categories = useMemo(() => {
    if (viewTrack === 'hot100') {
      return CARL_HOT100_CHAPTERS;
    }
    return STANDARD_CATEGORIES;
  }, [viewTrack]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    trackProblems.forEach((p) => {
      const key = viewTrack === 'hot100' ? p.hot100Chapter || '' : p.category || '';
      if (key) {
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [viewTrack, trackProblems]);

  // Filter problems based on search & category (strict 0 leakage)
  const displayedProblems = useMemo(() => {
    return trackProblems.filter((p) => {
      if (selectedCategory !== 'all') {
        if (viewTrack === 'hot100') {
          if (p.hot100Chapter !== selectedCategory) return false;
        } else {
          if (p.category !== selectedCategory) return false;
        }
      }
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
  }, [trackProblems, viewTrack, selectedCategory, searchQuery]);

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
    const current = isProblemDone(p);
    const nextVal = !current;

    setCompletedMap((prev) => {
      const copy = { ...prev };
      if (p.num !== null && p.num !== undefined) {
        copy[p.num] = nextVal;
        copy[String(p.num)] = nextVal;
      } else if (p.id) {
        copy[p.id] = nextVal;
      }
      return copy;
    });
  };

  // Progress stats
  const totalCount = trackProblems.length;
  const completedCount = trackProblems.filter(isProblemDone).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              算法题库与刷题工作台
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">完成进度</div>
              <div className="text-base font-bold text-sky-600 dark:text-sky-400">
                {completedCount} / {totalCount}
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">达成率</div>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {progressPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* View Track Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              setViewTrack('all');
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              viewTrack === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            全部 ({ALGORITHM_LAB_CATALOG.length})
          </button>
          <button
            onClick={() => {
              setViewTrack('hot100');
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              viewTrack === 'hot100'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
            }`}
          >
            Hot 100 (100)
          </button>
          <button
            onClick={() => {
              setViewTrack('carl');
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              viewTrack === 'carl'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400'
            }`}
          >
            代码随想录 (179)
          </button>
        </div>

        {viewTrack === 'hot100' && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs">
            <span className="font-semibold">路线说明:</span>
            <span>按 17 个专题路线顺序练习题目。</span>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? viewTrack === 'hot100' ? 'bg-rose-600 text-white font-semibold' : 'bg-sky-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {viewTrack === 'hot100' ? '全部章节 (100)' : '全部专题'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? viewTrack === 'hot100' ? 'bg-rose-600 text-white font-semibold' : 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat} {categoryCounts[cat] !== undefined && `(${categoryCounts[cat]})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索题号或题名..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition shadow-2xs"
          />
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-2.5">
        {displayedProblems.map((problem) => (
          <AlgoCard
            key={problem.id}
            problem={problem}
            isDone={isProblemDone(problem)}
            onToggleDone={() => handleToggleDone(problem)}
          />
        ))}

        {displayedProblems.length === 0 && (
          <div className="py-16 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            未找到符合条件的题目
          </div>
        )}
      </div>
    </div>
  );
};

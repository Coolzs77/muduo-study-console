import React, { useState, useMemo, useEffect } from 'react';
import { DAYS_DATASET, SHORT_DAY_TITLES } from '../../data/daysDataset';
import { DayCurriculumItem } from '../../types';
import { CodeBlock } from '../common/CodeBlock';
import { InlineMarkdown } from '../common/InlineMarkdown';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { showToast } from '../common/Toast';
import {
  Search,
  BookOpen,
  Calendar,
  Terminal,
  Copy,
  Star,
  CheckCircle2,
  HelpCircle,
  Flame,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  Activity
} from 'lucide-react';

interface DailyCurriculumViewProps {
  onJumpToQuiz?: (day: number) => void;
  selectedDayHighlight?: number | null;
  onClearHighlight?: () => void;
}

export const DailyCurriculumView: React.FC<DailyCurriculumViewProps> = ({
  onJumpToQuiz,
  selectedDayHighlight,
  onClearHighlight
}) => {
  const [selectedDayNum, setSelectedDayNum] = useLocalStorage<number>(
    'curriculum_active_day',
    selectedDayHighlight || 1
  );

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage<boolean>(
    'sidebar_collapsed_daily',
    false
  );

  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlearned' | 'learning' | 'mastered'>('all');

  // Persisted state
  const [dayMastery, setDayMastery] = useLocalStorage<Record<number, number>>('muduo_day_mastery', {});
  const [copiedCmd, setCopiedCmd] = useState(false);

  useEffect(() => {
    if (selectedDayHighlight) {
      setSelectedDayNum(selectedDayHighlight);
      onClearHighlight?.();
    }
  }, [selectedDayHighlight, onClearHighlight, setSelectedDayNum]);

  // Current active day
  const currentDay = useMemo(() => {
    return DAYS_DATASET.find(d => d.day === selectedDayNum) || DAYS_DATASET[0];
  }, [selectedDayNum]);

  const currentIndex = DAYS_DATASET.findIndex(d => d.day === selectedDayNum);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < DAYS_DATASET.length - 1;

  // Filtered days for sidebar
  const filteredDays = useMemo(() => {
    return DAYS_DATASET.filter(item => {
      if (selectedWeek !== 'all' && item.week !== selectedWeek) return false;

      const mastery = dayMastery[item.day] || 0;
      if (statusFilter === 'unlearned' && mastery > 0) return false;
      if (statusFilter === 'learning' && (mastery === 0 || mastery >= 4)) return false;
      if (statusFilter === 'mastered' && mastery < 4) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inDay = `day ${item.day}`.includes(q) || `day${item.day}`.includes(q);
        const inTitle = item.title.toLowerCase().includes(q);
        const inTags = (item.tags || []).some(t => t.toLowerCase().includes(q));
        const inRange = (item.bookRange || '').toLowerCase().includes(q);
        if (!inDay && !inTitle && !inTags && !inRange) return false;
      }
      return true;
    });
  }, [selectedWeek, statusFilter, searchQuery, dayMastery]);

  // Stats
  const stats = useMemo(() => {
    let masteredCount = 0;
    let inProgressCount = 0;
    DAYS_DATASET.forEach(d => {
      const lvl = dayMastery[d.day] || 0;
      if (lvl >= 4) masteredCount++;
      else if (lvl > 0) inProgressCount++;
    });
    const pct = Math.round((masteredCount / DAYS_DATASET.length) * 100);
    return { mastered: masteredCount, inProgress: inProgressCount, total: DAYS_DATASET.length, pct };
  }, [dayMastery]);

  const setMasteryLevel = (level: number) => {
    setDayMastery(prev => ({ ...prev, [selectedDayNum]: level }));
    const labels = ['未学', '快速了解', '掌握机制', '能口述原理', '✓ 已学习 (独立编码)', '✓ 深度调优'];
    showToast(`Day ${selectedDayNum} 掌握状态更新为: ${labels[level] || '已更新'}`, 'success');
  };

  const handleCopyBuild = (cmd: string) => {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
      showToast('编译测试命令已复制', 'success');
    });
  };

  return (
    <div className="flex items-start w-full min-h-[calc(100vh-4rem)] bg-[#eef2f7] dark:bg-[#11141a] transition-colors duration-300 p-3 sm:p-4 gap-4 text-slate-800 dark:text-slate-200">
      {/* ==================================================================== */}
      {/* Left Column: 4-Week & 28-Day Task Directory Tree (Collapsible)       */}
      {/* ==================================================================== */}
      {isSidebarCollapsed ? (
        <aside className="w-16 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/90 dark:bg-[#151922]/90 shadow-[6px_6px_14px_rgba(0,0,0,0.06),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] py-4 flex flex-col items-center space-y-3 sticky top-18 h-[calc(100vh-5.5rem)] hidden md:flex select-none transition-all duration-300">
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-sky-600 shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
            title="展开任务目录"
          >
            <PanelLeftOpen size={18} />
          </button>

          <div className="w-8 h-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)]" />

          {/* Quick Week Selectors in collapsed state (Clay Pills) */}
          <div className="flex flex-col items-center space-y-2 text-[11px] font-bold">
            <button
              onClick={() => { setSelectedWeek('all'); setIsSidebarCollapsed(false); }}
              className={`w-10 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                selectedWeek === 'all'
                  ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-[3px_3px_8px_rgba(16,185,129,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_8px_rgba(16,185,129,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] font-bold'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
              }`}
              title="全部 28 天任务"
            >
              全
            </button>
            {[1, 2, 3, 4].map(w => (
              <button
                key={w}
                onClick={() => { setSelectedWeek(w); setIsSidebarCollapsed(false); }}
                className={`w-10 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer font-mono active:scale-x-105 active:scale-y-90 ${
                  selectedWeek === w
                    ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-[3px_3px_8px_rgba(16,185,129,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_8px_rgba(16,185,129,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] font-bold'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                }`}
                title={`第 ${w} 周任务`}
              >
                W{w}
              </button>
            ))}
          </div>

          <div className="w-8 h-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)] mt-auto" />

          {/* Current Day indicator badge */}
          <div
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/60 dark:to-teal-900/60 shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.1)] flex flex-col items-center justify-center text-[10px] font-mono font-bold text-teal-700 dark:text-teal-300 cursor-pointer active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            onClick={() => setIsSidebarCollapsed(false)}
            title={`当前正在学习: Day ${currentDay.day}`}
          >
            D{currentDay.day < 10 ? `0${currentDay.day}` : currentDay.day}
          </div>
        </aside>
      ) : (
        <aside className="w-80 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] p-4 flex flex-col h-[calc(100vh-5.5rem)] sticky top-18 select-none transition-all duration-300 overflow-hidden">
          {/* Top Header & Search */}
          <div className="pb-3 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-teal-100/90 dark:bg-teal-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-teal-600 dark:text-teal-400">
                  <Calendar size={14} />
                </div>
                <span>任务目录</span>
                <span className="text-xs text-slate-400 font-mono">({filteredDays.length}/28)</span>
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
                title="收起任务目录"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>

            {/* Week Selector (Clay recessed groove) */}
            <div className="grid grid-cols-5 gap-1 p-1 bg-slate-200/50 dark:bg-slate-900/60 rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4)] text-xs font-semibold text-center">
              <button
                onClick={() => setSelectedWeek('all')}
                className={`py-1.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                  selectedWeek === 'all'
                    ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                全部
              </button>
              {[1, 2, 3, 4].map(w => (
                <button
                  key={w}
                  onClick={() => setSelectedWeek(w)}
                  className={`py-1.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 font-mono ${
                    selectedWeek === w
                      ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  W{w}
                </button>
              ))}
            </div>

            {/* Progress Header (Clay mint mini card) */}
            <div className="bg-gradient-to-br from-emerald-100/70 via-teal-50 to-green-100/70 dark:from-emerald-950/40 dark:via-teal-900/30 dark:to-green-900/40 p-3 rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-900 dark:text-teal-100">
                  学习进度 ({stats.mastered}/{stats.total} 天)
                </span>
                <span className="font-mono font-bold text-teal-800 dark:text-teal-200">
                  {stats.pct}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-emerald-200/50 dark:bg-emerald-950/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.4)] overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{ width: `${stats.pct}%` }}
                />
              </div>
            </div>

            {/* Search Box (Clay recessed input) */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索天数（如 Day 4）、主题..."
                className="w-full bg-white/80 dark:bg-slate-900/70 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Task List (Clay pill strips) */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {filteredDays.map(item => {
              const isSelected = item.day === selectedDayNum;
              const mastery = dayMastery[item.day] || 0;
              const isMastered = mastery >= 4;
              const isLearning = mastery > 0 && mastery < 4;

              return (
                <div
                  key={item.day}
                  id={`day-card-${item.day}`}
                  onClick={() => setSelectedDayNum(item.day)}
                  className={`group flex items-start gap-2.5 p-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-xs active:scale-x-105 active:scale-y-90 select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-100 via-teal-50 to-green-100 dark:from-emerald-950/60 dark:via-teal-900/40 dark:to-green-950/60 shadow-[4px_4px_12px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.12)] -translate-y-0.5'
                      : 'bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 hover:shadow-[5px_5px_12px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                  }`}
                >
                  {/* Day Badge */}
                  <div className="flex flex-col items-center shrink-0 mt-0.5">
                    <span
                      className={`px-2 py-0.5 rounded-xl flex items-center justify-center font-mono text-[10px] font-bold ${
                        isMastered
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[2px_2px_4px_rgba(16,185,129,0.3)]'
                          : isSelected
                          ? 'bg-sky-600 text-white shadow-[2px_2px_4px_rgba(2,132,199,0.3)]'
                          : isLearning
                          ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08)]'
                          : 'bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      D{item.day < 10 ? `0${item.day}` : item.day}
                    </span>
                  </div>

                  {/* Day Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold truncate leading-snug text-slate-800 dark:text-slate-100" title={item.title}>
                        {SHORT_DAY_TITLES[item.day] || item.title}
                      </span>
                      {isMastered && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] shrink-0">
                          ✓ 已学习
                        </span>
                      )}
                      {isLearning && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] shrink-0">
                          学习中
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 font-medium">
                      <span>W{item.week}</span>
                      <span>•</span>
                      <span className="truncate">{item.tags?.[0] || '核心实战'}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredDays.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400">
                无匹配任务
              </div>
            )}
          </div>
        </aside>
      )}

      {/* ==================================================================== */}
      {/* Middle Column: Core Task Workspace Canvas (Fluid Full Width)         */}
      {/* ==================================================================== */}
      <main className="flex-1 min-w-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] p-6 sm:p-8 space-y-6 overflow-y-auto">
        {/* Task Header */}
        <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-2xl bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-950/70 dark:to-indigo-950/70 text-sky-800 dark:text-sky-300 text-xs font-black font-mono shadow-[2px_2px_5px_rgba(0,0,0,0.05),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              第 {currentDay.week} 周 · Day {currentDay.day}
            </span>
            <span className="px-2.5 py-1 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-[11px] font-bold">
              考点等级: Tier {currentDay.tier}
            </span>
            <span className="px-2.5 py-1 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-[11px] font-semibold shadow-[2px_2px_4px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
              预计 {currentDay.estimatedMinutes || 90} 分钟
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {currentDay.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1 font-medium">
            <span className="font-bold text-slate-700 dark:text-slate-300">对照专栏:</span>
            <span>{currentDay.bookRange}</span>
          </div>

          {currentDay.tags && currentDay.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {currentDay.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Section 1: 核心要点 (Key Technical Points - Clay Card) */}
        <section className="bg-white/70 dark:bg-slate-800/60 rounded-3xl p-6 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-amber-100/90 dark:bg-amber-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-amber-600 dark:text-amber-400">
              <Flame size={14} />
            </div>
            <span>核心技术要点与设计意图</span>
          </h2>
          <div className="space-y-3 text-[13.5px] leading-relaxed text-slate-700 dark:text-slate-300">
            {currentDay.points.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0 shadow-[1px_1px_2px_rgba(0,0,0,0.1)]" />
                <div className="flex-1 min-w-0">
                  <InlineMarkdown text={pt} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: 核心代码实现 (Code Implementation) */}
        {currentDay.code && (
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-sky-100/90 dark:bg-sky-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-sky-600 dark:text-sky-400">
                <Terminal size={14} />
              </div>
              <span>核心 C++ 源码实现</span>
            </h2>
            <CodeBlock code={currentDay.code} language="cpp" title={`Day ${currentDay.day} - 核心源码`} />
          </section>
        )}

        {/* Section 3: 架构深潜与实验步骤 (Experiment Clay Card) */}
        {currentDay.experiment && (
          <section className="space-y-4 p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white/80 to-blue-50/70 dark:from-indigo-950/40 dark:via-slate-800/50 dark:to-blue-950/40 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-indigo-100/90 dark:bg-indigo-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-indigo-600 dark:text-indigo-400">
                <Cpu size={14} />
              </div>
              <span>实验验证与避坑指南</span>
            </h2>

            <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              <strong className="text-slate-900 dark:text-slate-100 font-bold">实验目标: </strong>
              <InlineMarkdown text={currentDay.experiment.goal} />
            </div>

            {currentDay.experiment.steps && currentDay.experiment.steps.length > 0 && (
              <div className="space-y-2 pt-1 text-xs text-slate-700 dark:text-slate-300">
                <div className="font-bold text-slate-800 dark:text-slate-200">实操步骤:</div>
                {currentDay.experiment.steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-black">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <InlineMarkdown text={st} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentDay.experiment.expectedOutput && (
              <div className="text-xs pt-1 text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-800 dark:text-slate-200">预期输出: </span>
                <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">{currentDay.experiment.expectedOutput}</span>
              </div>
            )}

            {currentDay.experiment.watchPoints && (
              <div className="text-xs pt-1 text-slate-700 dark:text-slate-300">
                <span className="font-bold text-amber-800 dark:text-amber-300">关注重点: </span>
                <InlineMarkdown
                  text={
                    Array.isArray(currentDay.experiment.watchPoints)
                      ? currentDay.experiment.watchPoints.join('；')
                      : String(currentDay.experiment.watchPoints)
                  }
                />
              </div>
            )}

            {currentDay.experiment.pitfalls && (
              <div className="text-xs pt-1 text-slate-700 dark:text-slate-300">
                <span className="font-bold text-rose-800 dark:text-rose-300">避坑陷阱: </span>
                <InlineMarkdown
                  text={
                    Array.isArray(currentDay.experiment.pitfalls)
                      ? currentDay.experiment.pitfalls.join('；')
                      : String(currentDay.experiment.pitfalls)
                  }
                />
              </div>
            )}

            {currentDay.experiment.buildCommand && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-semibold">
                  <span>编译运行命令:</span>
                  <button
                    onClick={() => handleCopyBuild(currentDay.experiment!.buildCommand!)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-sky-700 dark:text-sky-300 shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
                  >
                    {copiedCmd ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                    <span>{copiedCmd ? '已复制' : '复制命令'}</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto select-all shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5)]">
                  {currentDay.experiment.buildCommand}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Section 4: 细微辨析 (Nuance - Dual Clay Candy Cards) */}
        {currentDay.rigorousNuance && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-emerald-100/90 dark:bg-emerald-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={14} />
              </div>
              <span>快速认知 vs 严谨工程认知</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-100/80 via-orange-50/70 to-yellow-100/80 dark:from-amber-950/40 dark:via-orange-900/30 dark:to-yellow-900/40 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.8)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] space-y-2">
                <div className="font-bold text-amber-900 dark:text-amber-200">常见表面理解:</div>
                <div className="text-amber-950/90 dark:text-amber-100/90 leading-relaxed font-medium">
                  <InlineMarkdown
                    text={
                      typeof currentDay.rigorousNuance === 'object' && currentDay.rigorousNuance !== null
                        ? currentDay.rigorousNuance.quick
                        : String(currentDay.rigorousNuance || '')
                    }
                  />
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-100/80 via-teal-50/70 to-green-100/80 dark:from-emerald-950/40 dark:via-teal-900/30 dark:to-green-900/40 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.8)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] space-y-2">
                <div className="font-bold text-emerald-900 dark:text-emerald-200">严谨底层机理:</div>
                <div className="text-emerald-950/90 dark:text-emerald-100/90 leading-relaxed font-medium">
                  <InlineMarkdown
                    text={
                      typeof currentDay.rigorousNuance === 'object' && currentDay.rigorousNuance !== null
                        ? currentDay.rigorousNuance.strict
                        : typeof currentDay.check === 'string'
                        ? currentDay.check
                        : ''
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Bottom Pagination (Clay Pill Buttons) */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
          <button
            onClick={() => hasPrev && setSelectedDayNum(DAYS_DATASET[currentIndex - 1].day)}
            disabled={!hasPrev}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer font-bold ${
              hasPrev
                ? 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-[3px_3px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90'
                : 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <ChevronLeft size={15} />
            <span>上一天 (Day {hasPrev ? DAYS_DATASET[currentIndex - 1].day : ''})</span>
          </button>

          <button
            onClick={() => hasNext && setSelectedDayNum(DAYS_DATASET[currentIndex + 1].day)}
            disabled={!hasNext}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer font-bold ${
              hasNext
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[4px_4px_12px_rgba(16,185,129,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_12px_rgba(16,185,129,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90'
                : 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <span>下一天 (Day {hasNext ? DAYS_DATASET[currentIndex + 1].day : ''})</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </main>

      {/* ==================================================================== */}
      {/* Right Column: Mastery Rating, Quiz Launcher & Daily Notes             */}
      {/* ==================================================================== */}
      <aside className="w-80 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] p-4 h-[calc(100vh-5.5rem)] sticky top-18 hidden lg:flex flex-col space-y-4 select-none overflow-y-auto">
        {/* Mastery Rating */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
            <span>掌握度评级</span>
            <span className="font-mono text-[11px] text-teal-700 dark:text-teal-300 font-bold">
              {(dayMastery[currentDay.day] || 0) >= 4 ? '✓ 已学习' : `${dayMastery[currentDay.day] || 0} 阶`}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { lvl: 0, label: '0 未学' },
              { lvl: 1, label: '1 概念' },
              { lvl: 2, label: '2 机制' },
              { lvl: 3, label: '3 阐述' },
              { lvl: 4, label: '4 编码' },
              { lvl: 5, label: '5 调优' }
            ].map(tier => {
              const currentLvl = dayMastery[currentDay.day] || 0;
              const isSelected = currentLvl === tier.lvl;
              return (
                <button
                  key={tier.lvl}
                  onClick={() => setMasteryLevel(tier.lvl)}
                  type="button"
                  className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left active:scale-x-105 active:scale-y-90 font-medium ${
                    isSelected
                      ? tier.lvl >= 4
                        ? 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/70 dark:to-teal-900/70 text-teal-900 dark:text-teal-100 font-bold shadow-[3px_3px_8px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.1)] -translate-y-0.5'
                        : 'bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-950/70 dark:to-indigo-900/70 text-sky-900 dark:text-sky-100 font-bold shadow-[3px_3px_8px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.1)] -translate-y-0.5'
                      : 'bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5'
                  }`}
                >
                  <span>{tier.label}</span>
                  {isSelected && <Check size={12} className={tier.lvl >= 4 ? 'text-emerald-600' : 'text-sky-600'} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Check Criteria (Clay Card) */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/70 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1.5 text-xs">
          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span>达标标准</span>
          </div>
          <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed font-medium">
            <InlineMarkdown text={typeof currentDay.check === 'object' ? currentDay.check.strict : currentDay.check} />
          </div>
        </div>

        {/* Core Concepts */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/70 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1.5 text-xs">
          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BookOpen size={13} className="text-sky-500" />
              <span>今日核心概念</span>
            </div>
            <span className="text-[10px] text-teal-700 dark:text-teal-300 font-mono font-bold">{currentDay.module}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(currentDay.tags || []).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-700/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-slate-700 dark:text-slate-200 text-[11px] font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Build / Test Command */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/70 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Terminal size={12} className="text-sky-500" />
              <span>快速测试命令</span>
            </span>
            <button
              onClick={() => handleCopyBuild(currentDay.buildCmd || 'cmake -B build && cmake --build build')}
              type="button"
              className="text-[11px] text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer active:scale-x-105 active:scale-y-90 transition-all"
            >
              {copiedCmd ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
              <span>{copiedCmd ? '已复制' : '复制'}</span>
            </button>
          </div>
          <div className="p-2 rounded-2xl bg-slate-900 text-sky-300 font-mono text-[10px] truncate shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4)]">
            {currentDay.buildCmd || 'cmake -B build && cmake --build build'}
          </div>
        </div>

        {/* Quiz Launcher (Clay Pill Button) */}
        {onJumpToQuiz && (
          <button
            onClick={() => onJumpToQuiz(currentDay.day)}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-950/70 dark:to-indigo-900/70 text-sky-800 dark:text-sky-200 shadow-[4px_4px_10px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.12)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] font-bold text-xs cursor-pointer"
          >
            <HelpCircle size={14} />
            <span>进入 Day {currentDay.day} 自测</span>
          </button>
        )}
      </aside>
    </div>
  );
};

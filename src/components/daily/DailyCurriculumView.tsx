import React, { useState, useMemo, useEffect } from 'react';
import { DAYS_DATASET, SHORT_DAY_TITLES } from '../../data/daysDataset';
import { DayCurriculumItem } from '../../types';
import { CodeBlock } from '../common/CodeBlock';
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
  FileEdit,
  Flame,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Check
} from 'lucide-react';

interface DailyCurriculumViewProps {
  onJumpToQuiz?: (day: number) => void;
  selectedDayHighlight?: number | null;
}

export const DailyCurriculumView: React.FC<DailyCurriculumViewProps> = ({
  onJumpToQuiz,
  selectedDayHighlight
}) => {
  const [selectedDayNum, setSelectedDayNum] = useLocalStorage<number>(
    'curriculum_active_day',
    selectedDayHighlight || 1
  );

  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlearned' | 'learning' | 'mastered'>('all');

  // Persisted state
  const [dayMastery, setDayMastery] = useLocalStorage<Record<number, number>>('muduo_day_mastery', {});
  const [dayNotes, setDayNotes] = useLocalStorage<Record<number, string>>('muduo_day_notes', {});
  const [copiedCmd, setCopiedCmd] = useState(false);

  useEffect(() => {
    if (selectedDayHighlight) {
      setSelectedDayNum(selectedDayHighlight);
    }
  }, [selectedDayHighlight, setSelectedDayNum]);

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
    const labels = ['未学', '快速了解', '掌握机制', '能口述原理', '✓ 已吃透 (独立编码)', '✓ 深度调优'];
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
    <div className="flex w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* ==================================================================== */}
      {/* Left Column: 4-Week & 28-Day Task Directory Tree                     */}
      {/* ==================================================================== */}
      <aside className="w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none">
        {/* Top Header & Search */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
              <Calendar size={16} className="text-sky-600 dark:text-sky-400" />
              <span>任务目录</span>
              <span className="text-xs text-slate-400 font-normal">({filteredDays.length}/28)</span>
            </div>
          </div>

          {/* Week Selector */}
          <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs font-medium text-center">
            <button
              onClick={() => setSelectedWeek('all')}
              className={`py-1 rounded-md transition cursor-pointer ${
                selectedWeek === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              全部
            </button>
            {[1, 2, 3, 4].map(w => (
              <button
                key={w}
                onClick={() => setSelectedWeek(w)}
                className={`py-1 rounded-md transition cursor-pointer ${
                  selectedWeek === w
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                W{w}
              </button>
            ))}
          </div>

          {/* Progress Header */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                28天攻坚完成率: {stats.mastered} / {stats.total} 天
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {stats.pct}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${stats.pct}%` }}
              />
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索天数（如 Day 4）、主题..."
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 transition"
            />
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredDays.map(item => {
            const isSelected = item.day === selectedDayNum;
            const mastery = dayMastery[item.day] || 0;
            const isMastered = mastery >= 4;
            const isLearning = mastery > 0 && mastery < 4;

            return (
              <div
                key={item.day}
                onClick={() => setSelectedDayNum(item.day)}
                className={`group flex items-start gap-2.5 p-2.5 rounded-xl transition cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-100'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent text-slate-700 dark:text-slate-300'
                }`}
              >
                {/* Day Badge */}
                <div className="flex flex-col items-center shrink-0 mt-0.5">
                  <span
                    className={`px-1.5 py-0.5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold ${
                      isMastered
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isSelected
                        ? 'bg-sky-600 text-white'
                        : isLearning
                        ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    D{item.day < 10 ? `0${item.day}` : item.day}
                  </span>
                </div>

                {/* Day Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold truncate leading-snug" title={item.title}>
                      {SHORT_DAY_TITLES[item.day] || item.title}
                    </span>
                    {isMastered && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                        ✓ 已吃透
                      </span>
                    )}
                    {isLearning && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shrink-0">
                        学习中
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
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

      {/* ==================================================================== */}
      {/* Middle Column: Core Task Workspace Canvas                            */}
      {/* ==================================================================== */}
      <main className="flex-1 min-w-0 overflow-y-auto px-6 py-6 sm:px-10 space-y-6 max-w-4xl">
        {/* Task Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 text-xs font-black font-mono">
              第 {currentDay.week} 周 · Day {currentDay.day}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold">
              考点等级: Tier {currentDay.tier}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px]">
              预计 {currentDay.estimatedMinutes || 90} 分钟
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {currentDay.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">对照专栏:</span>
            <span>{currentDay.bookRange}</span>
          </div>

          {currentDay.tags && currentDay.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {currentDay.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Section 1: 核心要点 (Key Technical Points) */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Flame size={16} className="text-amber-500" />
            <span>核心技术要点与设计意图</span>
          </h2>
          <div className="space-y-2 text-[13.5px] leading-relaxed text-slate-700 dark:text-slate-300">
            {currentDay.points.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: pt }} />
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: 核心代码实现 (Code Implementation) */}
        {currentDay.code && (
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal size={16} className="text-sky-500" />
              <span>核心 C++ 源码实现</span>
            </h2>
            <CodeBlock code={currentDay.code} language="cpp" title={`Day ${currentDay.day} - 核心源码`} />
          </section>
        )}

        {/* Section 3: 架构深潜与实验步骤 (Experiment) */}
        {currentDay.experiment && (
          <section className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu size={16} className="text-indigo-500" />
              <span>实验验证与避坑指南</span>
            </h2>

            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              <strong className="text-slate-800 dark:text-slate-200">实验目标: </strong>
              {currentDay.experiment.goal}
            </div>

            {currentDay.experiment.steps && currentDay.experiment.steps.length > 0 && (
              <div className="space-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-400">
                <div className="font-semibold text-slate-700 dark:text-slate-300">实操步骤:</div>
                {currentDay.experiment.steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{i + 1}.</span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            )}

            {currentDay.experiment.expectedOutput && (
              <div className="text-xs pt-1 text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">预期输出: </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{currentDay.experiment.expectedOutput}</span>
              </div>
            )}

            {currentDay.experiment.buildCommand && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  <span>编译运行命令:</span>
                  <button
                    onClick={() => handleCopyBuild(currentDay.experiment!.buildCommand!)}
                    className="flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    {copiedCmd ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copiedCmd ? '已复制' : '复制命令'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto select-all">
                  {currentDay.experiment.buildCommand}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Section 4: 细微辨析 (Nuance) */}
        {currentDay.rigorousNuance && (
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>快速认知 vs 严谨工程认知</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 space-y-1">
                <div className="font-bold text-amber-800 dark:text-amber-300">常见表面理解:</div>
                <p className="text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                  {typeof currentDay.rigorousNuance === 'object' && currentDay.rigorousNuance !== null
                    ? currentDay.rigorousNuance.quick
                    : String(currentDay.rigorousNuance || '')}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-300">严谨底层机理:</div>
                <p className="text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed">
                  {typeof currentDay.rigorousNuance === 'object' && currentDay.rigorousNuance !== null
                    ? currentDay.rigorousNuance.strict
                    : typeof currentDay.check === 'string'
                    ? currentDay.check
                    : ''}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Bottom Pagination */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => hasPrev && setSelectedDayNum(DAYS_DATASET[currentIndex - 1].day)}
            disabled={!hasPrev}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer ${
              hasPrev
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                : 'opacity-40 cursor-not-allowed text-slate-400'
            }`}
          >
            <ChevronLeft size={14} />
            <span>上一天 (Day {hasPrev ? DAYS_DATASET[currentIndex - 1].day : ''})</span>
          </button>

          <button
            onClick={() => hasNext && setSelectedDayNum(DAYS_DATASET[currentIndex + 1].day)}
            disabled={!hasNext}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer ${
              hasNext
                ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-xs'
                : 'opacity-40 cursor-not-allowed text-slate-400'
            }`}
          >
            <span>下一天 (Day {hasNext ? DAYS_DATASET[currentIndex + 1].day : ''})</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </main>

      {/* ==================================================================== */}
      {/* Right Column: Mastery Rating, Quiz Launcher & Daily Notes             */}
      {/* ==================================================================== */}
      <aside className="w-80 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 h-[calc(100vh-4rem)] sticky top-16 hidden lg:flex flex-col space-y-3.5 select-none overflow-y-auto">
        {/* Mastery Rating */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>掌握度</span>
            <span className="font-mono text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
              {(dayMastery[currentDay.day] || 0) >= 4 ? '已吃透' : `${dayMastery[currentDay.day] || 0} 阶`}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {[
              { lvl: 0, label: '0 未学' },
              { lvl: 1, label: '1 概念' },
              { lvl: 2, label: '2 机制' },
              { lvl: 3, label: '3 阐述' },
              { lvl: 4, label: '4 编码' },
              { lvl: 5, label: '5 吃透' }
            ].map(tier => {
              const currentLvl = dayMastery[currentDay.day] || 0;
              const isSelected = currentLvl === tier.lvl;
              return (
                <button
                  key={tier.lvl}
                  onClick={() => setMasteryLevel(tier.lvl)}
                  type="button"
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition cursor-pointer text-left border active-press smooth-hover ${
                    isSelected
                      ? tier.lvl >= 4
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border-emerald-300 dark:border-emerald-800 shadow-2xs'
                        : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold border-sky-300 dark:border-sky-800 shadow-2xs'
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>{tier.label}</span>
                  {isSelected && <Check size={11} className={tier.lvl >= 4 ? 'text-emerald-500' : 'text-sky-500'} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Check Criteria */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1 text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span>达标标准</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
            {typeof currentDay.check === 'object' ? currentDay.check.strict : currentDay.check}
          </p>
        </div>

        {/* Core Concepts */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BookOpen size={13} className="text-sky-500" />
              <span>今日核心概念</span>
            </div>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono font-semibold">{currentDay.module}</span>
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            {(currentDay.tags || []).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700/80 border border-slate-200/70 dark:border-slate-600/60 text-slate-700 dark:text-slate-200 text-[11px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Build / Test Command */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Terminal size={12} className="text-sky-500" />
              <span>快速测试命令</span>
            </span>
            <button
              onClick={() => handleCopyBuild(currentDay.buildCmd || 'cmake -B build && cmake --build build')}
              type="button"
              className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer active-press"
            >
              {copiedCmd ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
              <span>{copiedCmd ? '已复制' : '复制'}</span>
            </button>
          </div>
          <code className="block p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 font-mono text-[10px] text-slate-800 dark:text-slate-200 truncate">
            {currentDay.buildCmd || 'cmake -B build && cmake --build build'}
          </code>
        </div>

        {/* Quiz Launcher */}
        {onJumpToQuiz && (
          <button
            onClick={() => onJumpToQuiz(currentDay.day)}
            type="button"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-semibold transition cursor-pointer active-press smooth-hover"
          >
            <HelpCircle size={13} />
            <span>Day {currentDay.day} 自测</span>
          </button>
        )}

        {/* Daily Notes Scratchpad - Fills the vertical space naturally */}
        <div className="flex-1 flex flex-col space-y-1.5 min-h-[220px]">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1">
              <FileEdit size={13} />
              <span>随堂笔记</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">自动保存</span>
          </div>
          <textarea
            value={dayNotes[currentDay.day] || ''}
            onChange={e => setDayNotes(prev => ({ ...prev, [currentDay.day]: e.target.value }))}
            placeholder="记录踩坑心得、参数细节与思考..."
            className="flex-1 w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 transition resize-none leading-relaxed"
          />
        </div>
      </aside>
    </div>
  );
};

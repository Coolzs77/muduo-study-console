import React, { useState, useMemo } from 'react';
import { DAYS_DATASET } from '../../data/daysDataset';
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
  ChevronDown,
  ChevronUp,
  FileEdit,
  Flame,
  HelpCircle
} from 'lucide-react';

interface DailyCurriculumViewProps {
  onJumpToQuiz?: (day: number) => void;
  selectedDayHighlight?: number | null;
}

export const DailyCurriculumView: React.FC<DailyCurriculumViewProps> = ({
  onJumpToQuiz,
  selectedDayHighlight
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlearned' | 'mastered' | 'review'>('all');
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>(() => {
    // If a day is highlighted, expand it by default
    if (selectedDayHighlight) return { [selectedDayHighlight]: true };
    return { 1: true };
  });

  // Local storage for mastery (0~5 stars) and notes
  const [dayMastery, setDayMastery] = useLocalStorage<Record<number, number>>('muduo_day_mastery', {});
  const [dayNotes, setDayNotes] = useLocalStorage<Record<number, string>>('muduo_day_notes', {});

  // Toggle card expand/collapse
  const toggleExpand = (day: number) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const setMasteryLevel = (day: number, level: number) => {
    setDayMastery(prev => {
      const updated = { ...prev, [day]: level };
      return updated;
    });
    showToast(`Day ${day} 掌握度已更新为 ${level} 阶`, 'success');
  };

  const handleNoteChange = (day: number, text: string) => {
    setDayNotes(prev => ({ ...prev, [day]: text }));
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd).then(() => {
      showToast('实验命令已复制到剪贴板', 'success');
    });
  };

  // Filtered dataset
  const filteredDays = useMemo(() => {
    return DAYS_DATASET.filter(item => {
      // Week filter
      if (selectedWeek !== 'all' && item.week !== selectedWeek) {
        return false;
      }

      // Status filter
      const mastery = dayMastery[item.day] || 0;
      if (statusFilter === 'unlearned' && mastery > 0) return false;
      if (statusFilter === 'mastered' && mastery < 4) return false;
      if (statusFilter === 'review' && (mastery === 0 || mastery >= 5)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesDay = `day ${item.day}`.includes(q) || `day${item.day}`.includes(q);
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesTags = (item.tags || []).some(t => t.toLowerCase().includes(q));
        const matchesPoints = (item.points || []).some(p => p.toLowerCase().includes(q));
        const matchesBook = item.bookRange.toLowerCase().includes(q);
        if (!matchesDay && !matchesTitle && !matchesTags && !matchesPoints && !matchesBook) {
          return false;
        }
      }

      return true;
    });
  }, [selectedWeek, statusFilter, searchQuery, dayMastery]);

  const stats = useMemo(() => {
    let masteredCount = 0;
    let inProgressCount = 0;
    Object.values(dayMastery).forEach(lvl => {
      if (lvl >= 4) masteredCount++;
      else if (lvl > 0) inProgressCount++;
    });
    return {
      total: DAYS_DATASET.length,
      mastered: masteredCount,
      inProgress: inProgressCount,
      unstarted: DAYS_DATASET.length - masteredCount - inProgressCount
    };
  }, [dayMastery]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Calendar size={22} />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              28天任务
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            包含每日学习任务、掌握度记录与实验验证命令。
          </p>
        </div>

        {/* Progress Metrics */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shrink-0">
          <div className="text-center">
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {stats.mastered}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">已完成 (4~5星)</div>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
          <div className="text-center">
            <div className="text-lg font-black text-amber-500">
              {stats.inProgress}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">学习中 (1~3星)</div>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
          <div className="text-center">
            <div className="text-lg font-black text-slate-700 dark:text-slate-300">
              {stats.unstarted}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">待开始</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        {/* Week Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedWeek('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedWeek === 'all'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            全部天数 (28)
          </button>
          {[1, 2, 3, 4].map(w => (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedWeek === w
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {w === 1
                ? 'W1 AI 服务端与 ORT/TRT 封装'
                : w === 2
                ? 'W2 异步推理工作池与显存'
                : w === 3
                ? 'W3 动态批处理与调度引擎'
                : 'W4 推理网关与流式 Token 压测'} (7)
            </button>
          ))}
        </div>

        {/* Search & Status Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索天数（如 Day 1）、知识点、书目范围、标签..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
            >
              <option value="all">全部掌握状态</option>
              <option value="unlearned">待学项 (0 星)</option>
              <option value="review">复习巩固中 (1~3 星)</option>
              <option value="mastered">已完全攻克 (4~5 星)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Curriculum Card List */}
      <div className="space-y-4">
        {filteredDays.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
            未找到符合筛选条件的学习任务
          </div>
        ) : (
          filteredDays.map(item => {
            const mastery = dayMastery[item.day] || 0;
            const isExpanded = !!expandedDays[item.day];
            const note = dayNotes[item.day] || '';

            return (
              <div
                key={item.day}
                id={`day-card-${item.day}`}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition shadow-2xs overflow-hidden ${
                  selectedDayHighlight === item.day
                    ? 'border-sky-500 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header (Always Visible) */}
                <div
                  onClick={() => toggleExpand(item.day)}
                  className="p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-mono font-black text-xs flex items-center justify-center">
                        D{item.day}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                        W{item.week}
                      </span>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60">
                        Tier {item.tier}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                        {item.title}
                        {mastery >= 4 && (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 inline" />
                        )}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <BookOpen size={12} className="shrink-0" />
                        <span>{item.bookRange}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Header Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    {/* Star Rating Buttons */}
                    <div
                      className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
                      onClick={e => e.stopPropagation()}
                    >
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setMasteryLevel(item.day, mastery === star ? 0 : star)}
                          title={`${star} 阶掌握度`}
                          className="p-0.5 transition cursor-pointer hover:scale-110 active:scale-95"
                          type="button"
                        >
                          <Star
                            size={14}
                            className={
                              star <= mastery
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }
                          />
                        </button>
                      ))}
                      <span className="text-[10px] font-mono font-bold text-slate-500 ml-1">
                        {mastery}/5
                      </span>
                    </div>

                    {/* Expand Toggle */}
                    <button
                      className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition"
                      aria-label="展开或收起"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-5 text-xs sm:text-sm">
                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/40"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Core Points */}
                    <div className="space-y-1.5">
                      <div className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Flame size={13} className="text-rose-500" />
                        核心要点
                      </div>
                      <ul className="space-y-1.5 pl-4 list-disc text-slate-700 dark:text-slate-300 leading-relaxed">
                        {item.points.map((pt, pIdx) => (
                          <li
                            key={pIdx}
                            dangerouslySetInnerHTML={{ __html: pt }}
                          />
                        ))}
                      </ul>
                    </div>

                    {/* Muduo Mapping & Check */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
                      <div>
                        <span className="font-bold text-sky-700 dark:text-sky-300">Muduo 源码落地: </span>
                        <span className="text-slate-600 dark:text-slate-300">{item.muduoMap}</span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">验收标准: </span>
                        <span className="text-slate-600 dark:text-slate-300">
                          {typeof item.check === 'string' ? item.check : item.check?.strict || item.check?.quick || ''}
                        </span>
                      </div>
                    </div>

                    {/* Code Sample */}
                    {item.code && (
                      <div>
                        <div className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                          <Terminal size={13} className="text-sky-500" />
                          核心验证代码
                        </div>
                        <CodeBlock code={item.code} language="cpp" title={`Day ${item.day} 代码示例`} />
                      </div>
                    )}

                    {/* Experiment Section */}
                    {item.experiment && (
                      <div className="bg-sky-50/50 dark:bg-sky-950/20 rounded-xl p-4 border border-sky-100 dark:border-sky-900/40 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xs uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                            <Terminal size={14} className="text-sky-600" />
                            可复现实验目标: {item.experiment.goal}
                          </div>
                          {item.experiment.buildCommand && (
                            <button
                              onClick={() => handleCopyCommand(item.experiment!.buildCommand!)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sky-600 dark:text-sky-400 text-xs font-semibold hover:bg-sky-50 dark:hover:bg-slate-700 transition cursor-pointer"
                              type="button"
                            >
                              <Copy size={12} />
                              <span>复制实验指令</span>
                            </button>
                          )}
                        </div>

                        {/* Steps */}
                        {item.experiment.steps && (
                          <div className="space-y-1">
                            <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">实验执行步骤:</div>
                            <ol className="list-decimal pl-4 space-y-1 text-slate-700 dark:text-slate-300 text-xs">
                              {item.experiment.steps.map((step, sIdx) => (
                                <li key={sIdx}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Build Command Display */}
                        {item.experiment.buildCommand && (
                          <div>
                            <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">终端编译与运行指令:</div>
                            <div className="bg-slate-900 text-emerald-400 font-mono text-xs px-3 py-2 rounded-lg border border-slate-800 overflow-x-auto flex items-center justify-between">
                              <span>$ {item.experiment.buildCommand}</span>
                            </div>
                          </div>
                        )}

                        {/* Expected Output */}
                        {item.experiment.expectedOutput && (
                          <div className="text-xs">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">预期输出: </span>
                            <span className="font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                              {item.experiment.expectedOutput}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes Area & Bottom Actions */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                          <FileEdit size={13} className="text-amber-500" />
                          个人手记与调试笔记 (实时本地保存)
                        </label>
                        {item.quiz && onJumpToQuiz && (
                          <button
                            onClick={() => onJumpToQuiz(item.day)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                            type="button"
                          >
                            <HelpCircle size={13} />
                            <span>前往 Day {item.day} 自测中心 (5题) &rarr;</span>
                          </button>
                        )}
                      </div>
                      <textarea
                        value={note}
                        onChange={e => handleNoteChange(item.day, e.target.value)}
                        placeholder={`记录关于 Day ${item.day} 的学习笔记、报错排查或思考...`}
                        rows={3}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500 transition leading-relaxed resize-y font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { AlgoProblem } from '../../types';
import { CheckCircle2, Circle, ExternalLink, BookOpen, Code2, StickyNote } from 'lucide-react';
import { formatComplexity } from '../../utils/formatters';

export { formatComplexity };

interface AlgoCardProps {
  problem: AlgoProblem;
  isDone: boolean;
  onToggleDone: () => void;
  onOpenCarlReader?: (problem: AlgoProblem) => void;
  hasNote?: boolean;
  onOpenNote?: (problem: AlgoProblem) => void;
}

export const AlgoCard: React.FC<AlgoCardProps> = ({
  problem,
  isDone,
  onToggleDone,
  onOpenCarlReader,
  hasNote,
  onOpenNote
}) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
      case '简单':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
            简单
          </span>
        );
      case 'medium':
      case '中等':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
            中等
          </span>
        );
      case 'hard':
      case '困难':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
            困难
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]">
            {diff}
          </span>
        );
    }
  };

  return (
    <div
      className={`rounded-2xl p-4 text-xs transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        isDone
          ? 'bg-gradient-to-r from-emerald-50/70 to-teal-50/70 dark:from-emerald-950/30 dark:to-teal-950/30 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]'
          : 'bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:border dark:border-white/[0.06] hover:-translate-y-0.5 hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Checkbox + Number + Title + Badges */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onToggleDone}
            className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-110 active:scale-y-85 cursor-pointer shrink-0"
            title={isDone ? '标记为未完成' : '标记为已完成'}
            type="button"
          >
            {isDone ? (
              <CheckCircle2
                size={20}
                className="text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950/80"
              />
            ) : (
              <Circle size={20} className="hover:scale-105 transition-transform" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {problem.num !== null && (
                <span className="font-mono font-bold text-sky-700 dark:text-sky-400 text-xs">
                  #{problem.num}
                </span>
              )}
              <h3
                className={`font-bold text-[13px] leading-snug truncate ${
                  isDone
                    ? 'text-slate-400 dark:text-slate-500 line-through'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
                title={problem.title}
              >
                {problem.title}
              </h3>

              {getDifficultyBadge(problem.difficulty)}

              {/* Category Colored Tag */}
              {(problem.category || problem.topic) && (
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-slate-100/90 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                  {problem.category || problem.topic}
                </span>
              )}

              {/* Soft Amber Hot 100 Badge */}
              {problem.isHot100 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                  Hot 100
                </span>
              )}

              {problem.isCarl && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                  随想录
                </span>
              )}
            </div>

            {/* Sub-line: Solution Pattern & Complexity */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-medium">
              {problem.pattern && <span>解法: {problem.pattern}</span>}
              {problem.pattern && <span>•</span>}
              <span className="font-mono text-slate-400">
                {formatComplexity(problem.timeComp)} / {formatComplexity(problem.spaceComp)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Note Button (ICON ONLY - strictly no text labels) */}
          <button
            type="button"
            onClick={() => onOpenNote?.(problem)}
            className={`p-2 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)] dark:border dark:border-white/[0.06] hover:-translate-y-0.5 active:scale-[0.96] transition-transform duration-100 cursor-pointer ${
              hasNote
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-300/60 dark:border-amber-700/60 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                : 'text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 bg-white/80 dark:bg-slate-800/80'
            }`}
            title={hasNote ? '做题便签 (已有笔记)' : '做题便签'}
          >
            <StickyNote size={14} className={hasNote ? 'fill-amber-400/20' : ''} />
          </button>

          {problem.carlUrl && (
            <>
              {/* In-app reader drawer button */}
              <button
                type="button"
                onClick={() => onOpenCarlReader?.(problem)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/80 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)] dark:border dark:border-white/[0.06] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-[11px] font-bold"
                title="应用内抽屉阅读随想录精讲"
              >
                <BookOpen size={13} />
                <span className="hidden sm:inline">精讲</span>
              </button>

              {/* Direct external link to Carl solution */}
              <a
                href={problem.carlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)] dark:border dark:border-white/[0.06] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
                title="在新标签页打开随想录题解"
              >
                <ExternalLink size={14} />
              </a>
            </>
          )}

          {/* LeetCode External Link */}
          {problem.leetcodeUrl && (
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)] dark:border dark:border-white/[0.06] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
              title="打开 LeetCode 原题"
            >
              <Code2 size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

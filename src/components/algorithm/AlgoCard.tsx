import React from 'react';
import { AlgoProblem } from '../../types';
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';

interface AlgoCardProps {
  problem: AlgoProblem;
  isDone: boolean;
  onToggleDone: () => void;
}

export const AlgoCard: React.FC<AlgoCardProps> = ({ problem, isDone, onToggleDone }) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
      case '简单':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            简单
          </span>
        );
      case 'medium':
      case '中等':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            中等
          </span>
        );
      case 'hard':
      case '困难':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            困难
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
            {diff}
          </span>
        );
    }
  };

  return (
    <div
      className={`rounded-xl border transition px-4 py-3 text-xs ${
        isDone
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Checkbox + Number + Title + Badges */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onToggleDone}
            className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer active:scale-90 shrink-0"
            title={isDone ? '标记为未完成' : '标记为已完成'}
            type="button"
          >
            {isDone ? (
              <CheckCircle2
                size={18}
                className="text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950"
              />
            ) : (
              <Circle size={18} />
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
                className={`font-semibold text-[13px] leading-snug truncate ${
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
                <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {problem.category || problem.topic}
                </span>
              )}

              {/* Soft Amber Hot 100 Badge */}
              {problem.isHot100 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                  Hot 100
                </span>
              )}

              {problem.isCarl && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800">
                  随想录
                </span>
              )}
            </div>

            {/* Sub-line: Solution Pattern & Complexity */}
            <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
              {problem.pattern && <span>解法: {problem.pattern}</span>}
              {problem.pattern && <span>•</span>}
              <span className="font-mono text-slate-400">
                O({problem.timeComp}) / O({problem.spaceComp})
              </span>
            </div>
          </div>
        </div>

        {/* Right: LeetCode External Link */}
        <div className="flex items-center gap-1 shrink-0">
          {problem.leetcodeUrl && (
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="打开 LeetCode 原题"
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

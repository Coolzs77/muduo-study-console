import React, { useState } from 'react';
import { AlgoProblem } from '../../types';
import { CheckCircle2, Circle, ExternalLink, ChevronDown, ChevronUp, AlertCircle, Cpu } from 'lucide-react';

interface AlgoCardProps {
  problem: AlgoProblem;
  isDone: boolean;
  onToggleDone: () => void;
}

export const AlgoCard: React.FC<AlgoCardProps> = ({ problem, isDone, onToggleDone }) => {
  const [expanded, setExpanded] = useState(false);

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
      case '简单':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">简单</span>;
      case 'medium':
      case '中等':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">中等</span>;
      case 'hard':
      case '困难':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">困难</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">{diff}</span>;
    }
  };

  return (
    <div className={`rounded-xl border transition p-4 text-xs ${
      isDone
        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
    }`}>
      <div className="flex items-start justify-between gap-3">
        {/* Left: Checkbox + Title */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={onToggleDone}
            className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer active:scale-90 shrink-0"
            title={isDone ? '标记为未完成' : '标记为已完成'}
          >
            {isDone ? (
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
            ) : (
              <Circle size={18} />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {problem.num !== null && (
                <span className="font-mono font-bold text-sky-700 dark:text-sky-400">
                  #{problem.num}
                </span>
              )}
              <h3 className={`font-semibold text-sm leading-snug ${
                isDone
                  ? 'text-slate-500 dark:text-slate-400 line-through'
                  : 'text-slate-900 dark:text-slate-100'
              }`}>
                {problem.title}
              </h3>
              {getDifficultyBadge(problem.difficulty)}
              {problem.isHot100 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
                  {problem.hot100Chapter ? `Hot 100 · ${problem.hot100Chapter}` : 'Hot 100'}
                </span>
              )}
              {problem.isCarl && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800">
                  随想录
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-500 dark:text-slate-400 text-[11px]">
              <span className="font-medium text-slate-600 dark:text-slate-300">
                分类: {problem.category || problem.topic}
              </span>
              <span>•</span>
              <span>套路: {problem.pattern}</span>
              <span>•</span>
              <span className="font-mono text-slate-400">
                O({problem.timeComp}) / O({problem.spaceComp})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
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
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={expanded ? '收起详情' : '展开详情'}
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11.5px] leading-relaxed">
          {problem.mistakes && (
            <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <span className="font-bold">易错陷阱与盲打手写注意: </span>
                <span>{problem.mistakes}</span>
              </div>
            </div>
          )}

          {problem.projectLink && (
            <div className="flex items-start gap-2 text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 p-2.5 rounded-lg border border-sky-200 dark:border-sky-900/60">
              <Cpu size={14} className="shrink-0 mt-0.5 text-sky-600" />
              <div>
                <span className="font-bold">服务端/Muduo 工程映射: </span>
                <span>{problem.projectLink}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

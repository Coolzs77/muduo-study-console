import React from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { useFocusTimer } from '../../hooks/useFocusTimer';

export const FocusTimer: React.FC = () => {
  const { isRunning, formattedTime, todayMins, toggle, reset } = useFocusTimer();

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 px-1">
        <div className="flex items-center gap-1.5">
          <Clock size={15} className={`text-amber-500 dark:text-amber-400 ${isRunning ? 'animate-pulse' : ''}`} />
          <span>专注计时</span>
        </div>
        <div className="font-mono text-slate-500 dark:text-slate-400 font-normal">
          今日 <strong className="text-amber-600 dark:text-amber-400 font-bold">{todayMins}</strong> 分钟
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] space-y-3 text-center">
        <div className="font-mono text-3xl font-black tracking-wider text-slate-900 dark:text-white py-1 tabular-nums">
          {formattedTime}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 whitespace-nowrap shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_-2px_4px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 ${
              isRunning ? 'bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' : 'bg-gradient-to-b from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause size={14} className="fill-current" />
                <span>暂停计时</span>
              </>
            ) : (
              <>
                <Play size={14} className="fill-current ml-0.5" />
                <span>开始专注</span>
              </>
            )}
          </button>
          <button
            onClick={reset}
            type="button"
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-650 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 shrink-0 whitespace-nowrap shadow-xs"
            title="结算并归档时间至今日学时"
          >
            <RotateCcw size={13} />
            <span>结算归档</span>
          </button>
        </div>
      </div>
    </div>
  );
};

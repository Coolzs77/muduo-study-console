import React from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { useFocusTimer } from '../../hooks/useFocusTimer';

export const FocusTimer: React.FC = () => {
  const { isRunning, formattedTime, todayMins, toggle, reset } = useFocusTimer();

  return (
    <div className="space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-amber-100/90 dark:bg-amber-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] text-amber-600 dark:text-amber-400">
            <Clock size={14} className={isRunning ? 'animate-pulse' : ''} />
          </div>
          <span className="font-bold">专注计时</span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] text-[11px] font-mono text-slate-600 dark:text-slate-400 font-normal">
          今日 <strong className="text-amber-600 dark:text-amber-400 font-bold">{todayMins}</strong> 分钟
        </div>
      </div>

      {/* Deep Inset Clay Display Screen (粘土深内凹屏幕) */}
      <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-100 via-[#eef2f7] to-slate-50 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-900/90 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.09),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] dark:shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] space-y-4 text-center">
        {/* Large Monospaced Time Display */}
        <div className="font-mono text-4xl sm:text-4xl font-black tracking-wider text-slate-800 dark:text-slate-100 py-1 tabular-nums drop-shadow-xs">
          {formattedTime}
        </div>

        {/* Candy Clay Control Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={toggle}
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl text-xs font-bold text-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 whitespace-nowrap shadow-[6px_6px_12px_rgba(0,0,0,0.1),inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-2px_-2px_4px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:-translate-y-0.5 ${
              isRunning
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                : 'bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600'
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
            className="flex items-center justify-center gap-1 py-2.5 px-3.5 rounded-2xl text-xs font-semibold bg-gradient-to-r from-white via-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-200 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)] dark:border dark:border-white/[0.06] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.09)] dark:hover:shadow-[0_3px_8px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.1)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 shrink-0 whitespace-nowrap"
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

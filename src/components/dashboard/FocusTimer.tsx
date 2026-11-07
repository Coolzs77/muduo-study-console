import React from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { useFocusTimer } from '../../hooks/useFocusTimer';

export const FocusTimer: React.FC = () => {
  const { isRunning, formattedTime, todayMins, toggle, reset } = useFocusTimer();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
        <div className="flex items-center gap-1.5">
          <Clock size={15} className={`text-amber-600 dark:text-amber-400 ${isRunning ? 'animate-pulse' : ''}`} />
          <span>专注计时</span>
        </div>
        <div className="font-mono text-slate-500 dark:text-slate-400 font-normal">
          今日 <strong className="text-amber-600 dark:text-amber-400 font-bold">{todayMins}</strong> 分钟
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3 text-center">
        <div className="font-mono text-3xl font-black tracking-wider text-slate-900 dark:text-white py-1">
          {formattedTime}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-white transition cursor-pointer active:scale-95 whitespace-nowrap shadow-xs ${
              isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause size={14} />
                <span>暂停</span>
              </>
            ) : (
              <>
                <Play size={14} />
                <span>开始专注</span>
              </>
            )}
          </button>
          <button
            onClick={reset}
            type="button"
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
            title="结算并归档时间"
          >
            <RotateCcw size={13} />
            <span>重置</span>
          </button>
        </div>
      </div>
    </div>
  );
};

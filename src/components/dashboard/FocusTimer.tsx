import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const FocusTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [todayMins, setTodayMins] = useLocalStorage<number>('todayStudyMinutes', 0);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (seconds >= 60) {
      const addedMins = Math.floor(seconds / 60);
      setTodayMins((prev) => prev + addedMins);
    }
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-200">
          <Clock size={16} className="text-sky-600 dark:text-sky-400" />
          <span>专注计时器</span>
        </div>
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          今日累计: <strong className="text-sky-600 dark:text-sky-400">{todayMins}</strong> 分钟
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <div className="font-mono text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {formatTime(seconds)}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition cursor-pointer active:scale-95 ${
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
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition cursor-pointer active:scale-95"
            title="归档时间并重置"
          >
            <RotateCcw size={14} />
            <span>归档</span>
          </button>
        </div>
      </div>
    </div>
  );
};

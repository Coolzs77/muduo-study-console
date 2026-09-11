import React from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, ShieldAlert, Sparkles, Timer } from 'lucide-react';
import { DAYS_DATASET } from '../data/muduo28Days';
import { AppState } from '../types';

interface TimerBarProps {
  activeTimer: AppState['activeTimer'];
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSaveSession: () => void;
  onQuickAdd: (mins: number) => void;
  onUpdateTimerConfig: (day: number, type: 'coding' | 'reading' | 'debug') => void;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  activeTimer,
  onToggleTimer,
  onResetTimer,
  onSaveSession,
  onQuickAdd,
  onUpdateTimerConfig,
}) => {
  const mins = Math.floor(activeTimer.seconds / 60);
  const secs = activeTimer.seconds % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="bg-stone-50/90 border border-stone-200/90 rounded-2xl p-3.5 sm:p-4 my-4 shadow-xs font-serifMono">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* 左侧：计时器控制器 */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-bold text-stone-800 flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="relative flex h-3 w-3">
              {activeTimer.running && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${activeTimer.running ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span>深度专注会话：</span>
          </span>

          {/* 拟物数字时钟显示 */}
          <div className="bg-white border-2 border-stone-300 rounded-xl px-3 py-1 text-base sm:text-lg font-bold tracking-widest text-sky-950 font-mono shadow-inner">
            {timeStr}
          </div>

          {/* 启动/暂停 */}
          <button
            onClick={onToggleTimer}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs text-white transition shadow-xs cursor-pointer ${
              activeTimer.running
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {activeTimer.running ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>暂停专注</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>开始专注</span>
              </>
            )}
          </button>

          {/* 重置 */}
          <button
            onClick={onResetTimer}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs transition cursor-pointer font-bold"
            title="清零计时器"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重置</span>
          </button>

          {/* 归档会话 */}
          <button
            onClick={onSaveSession}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-800 hover:bg-sky-900 text-white text-xs transition cursor-pointer font-bold shadow-xs"
            title="将本次专注时段记入今日打卡统计"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>归档会话</span>
          </button>
        </div>

        {/* 右侧：上下文联动设置 (关联 Day 与学习类型) */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-stone-200">
            <span className="text-stone-400 text-[11px]">关联:</span>
            <select
              value={activeTimer.selectedDay}
              onChange={(e) => onUpdateTimerConfig(parseInt(e.target.value), activeTimer.selectedType)}
              className="bg-transparent font-bold text-stone-800 focus:outline-hidden cursor-pointer"
            >
              {DAYS_DATASET.map((d) => (
                <option key={d.day} value={d.day}>
                  Day {String(d.day).padStart(2, '0')}: {d.tags[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-stone-200">
            <span className="text-stone-400 text-[11px]">模式:</span>
            <select
              value={activeTimer.selectedType}
              onChange={(e) => onUpdateTimerConfig(activeTimer.selectedDay, e.target.value as any)}
              className="bg-transparent font-bold text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="coding">💻 代码实战攻坚</option>
              <option value="reading">📖 书目研读 (Readest)</option>
              <option value="debug">🔍 故障排查/调试</option>
            </select>
          </div>

          {/* 快捷加时 */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-stone-500 pl-2 border-l border-stone-200">
            <span>快捷记时:</span>
            <button
              onClick={() => onQuickAdd(25)}
              className="px-1.5 py-0.5 rounded bg-stone-200 hover:bg-amber-100 hover:text-amber-900 transition font-bold"
            >
              +25m
            </button>
            <button
              onClick={() => onQuickAdd(45)}
              className="px-1.5 py-0.5 rounded bg-stone-200 hover:bg-amber-100 hover:text-amber-900 transition font-bold"
            >
              +45m
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

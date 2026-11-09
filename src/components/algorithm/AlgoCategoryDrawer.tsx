import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckSquare,
  CheckCircle2,
  Compass,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export interface AlgoCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  viewTrack: 'all' | 'hot100' | 'carl';
  onTrackChange: (track: 'all' | 'hot100' | 'carl') => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: readonly string[];
  categoryStats: Record<string, { total: number; completed: number; pct: number }>;
  trackCompletedCount: number;
  trackTotalCount: number;
  trackPct: number;
}

export const AlgoCategoryDrawer: React.FC<AlgoCategoryDrawerProps> = ({
  isOpen,
  onClose,
  viewTrack,
  onTrackChange,
  selectedCategory,
  onSelectCategory,
  categories,
  categoryStats,
  trackCompletedCount,
  trackTotalCount,
  trackPct
}) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Emil Kowalski animation mount/unmount cycle
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsMounted(true);
      const frameId = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(frameId);
    } else {
      setIsVisible(false);
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsMounted(false);
        setIsClosing(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard shortcut listener: Esc to close
  // Guarded against Chinese IME composition
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing || e.key === 'Process') return;

      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        onCloseRef.current();
      }
    };

    // Use capture phase to intercept Esc before any lower-level listeners
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen]);

  if (!isMounted) return null;

  const transformStyle = isVisible
    ? 'translateY(0) scale(1)'
    : isClosing
    ? 'translateY(12px) scale(0.98)'
    : 'translateY(16px) scale(0.98)';

  const transitionStyle = isClosing
    ? 'transform 150ms cubic-bezier(0.7, 0, 0.84, 0), opacity 150ms cubic-bezier(0.7, 0, 0.84, 0)'
    : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)';

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity select-none ${
        isVisible ? 'opacity-100 duration-200' : 'opacity-0 duration-150 pointer-events-none'
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Card */}
      <div
        className="relative w-full sm:max-w-md max-h-[88vh] bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_24px_rgba(0,0,0,0.12),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] dark:border dark:border-white/[0.08] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-200"
        style={{
          transform: transformStyle,
          opacity: isVisible ? 1 : 0,
          transition: transitionStyle,
          willChange: 'transform, opacity'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile top pill pull-bar handle */}
        <div className="w-10 h-1 rounded-full bg-slate-300/80 dark:bg-slate-700/80 mx-auto mt-2 sm:hidden shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]" />

        {/* Drawer Header */}
        <div className="p-4 pb-3 space-y-3 shrink-0 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-purple-100/90 dark:bg-purple-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] text-purple-600 dark:text-purple-400">
                <CheckSquare size={14} />
              </div>
              <span>专题分类导航</span>
              <span className="text-xs text-slate-400 font-mono">({categories.length} 个专题)</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)] dark:border dark:border-white/[0.06] active:scale-[0.96] transition-transform duration-100 cursor-pointer"
              title="关闭抽屉 (Esc)"
              aria-label="关闭抽屉"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Master Roadmap Link */}
          <a
            href="https://programmercarl.com/algo/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-2xl bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-indigo-500/10 dark:from-sky-950/50 dark:via-blue-950/40 dark:to-indigo-950/50 border border-sky-200/60 dark:border-sky-800/40 text-sky-800 dark:text-sky-300 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)] dark:border dark:border-white/[0.06] active:scale-[0.96] transition-transform duration-100 group"
            title="打开代码随想录算法学习总路线 (programmercarl.com/algo/)"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-sky-100 dark:bg-sky-900/80 text-sky-600 dark:text-sky-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08)]">
                <Compass size={13} />
              </div>
              <span className="text-xs font-bold">代码随想录总路线</span>
            </div>
            <ExternalLink size={13} className="text-sky-500/70 group-hover:text-sky-600 transition-colors" />
          </a>

          {/* Track Switcher (Clay recessed groove) */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/50 dark:bg-slate-900/60 rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] text-xs font-semibold text-center">
            <button
              type="button"
              onClick={() => onTrackChange('all')}
              className={`py-1.5 rounded-2xl transition-transform duration-100 cursor-pointer active:scale-[0.96] ${
                viewTrack === 'all'
                  ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] dark:border dark:border-white/[0.06]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              全部 (234)
            </button>
            <button
              type="button"
              onClick={() => onTrackChange('hot100')}
              className={`py-1.5 rounded-2xl transition-transform duration-100 cursor-pointer active:scale-[0.96] ${
                viewTrack === 'hot100'
                  ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] dark:border dark:border-white/[0.06]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Hot 100
            </button>
            <button
              type="button"
              onClick={() => onTrackChange('carl')}
              className={`py-1.5 rounded-2xl transition-transform duration-100 cursor-pointer active:scale-[0.96] ${
                viewTrack === 'carl'
                  ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] dark:border dark:border-white/[0.06]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              随想录
            </button>
          </div>

          {/* Progress Summary (Clay lilac mini card) */}
          <div className="bg-gradient-to-br from-purple-100/70 via-fuchsia-50 to-pink-100/70 dark:from-purple-950/40 dark:via-fuchsia-900/30 dark:to-pink-900/40 p-3 rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:border dark:border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-purple-900 dark:text-purple-100">
                当前题单进度 ({trackCompletedCount} / {trackTotalCount} 题)
              </span>
              <span className="font-mono font-bold text-purple-800 dark:text-purple-200">
                {trackPct}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-purple-200/50 dark:bg-purple-950/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{ width: `${trackPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category List with Individual Progress (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 pb-8 sm:pb-4 space-y-2 pr-3 scrollbar-thin">
          {/* 'All Categories' Button */}
          <button
            type="button"
            onClick={() => {
              onSelectCategory('all');
              onClose();
            }}
            className={`w-full text-left flex items-center justify-between p-3 rounded-2xl transition-transform duration-100 cursor-pointer text-xs active:scale-[0.96] ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-purple-100 via-fuchsia-50 to-pink-100 dark:from-purple-950/60 dark:via-fuchsia-900/40 dark:to-pink-950/60 text-purple-950 dark:text-purple-100 shadow-[4px_4px_12px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.12)] font-bold'
                : 'bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className="font-bold">全部专题</span>
            <div className="flex items-center gap-1.5 text-slate-400 font-mono font-semibold">
              <span>{trackCompletedCount} / {trackTotalCount}</span>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </button>

          {/* Individual Category Items */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const cStat = categoryStats[cat] || { total: 0, completed: 0, pct: 0 };
            const isAllDone = cStat.total > 0 && cStat.completed === cStat.total;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onSelectCategory(cat);
                  onClose();
                }}
                className={`w-full text-left group p-3 rounded-2xl transition-transform duration-100 cursor-pointer text-xs space-y-1.5 active:scale-[0.96] select-none block ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-100 via-fuchsia-50 to-pink-100 dark:from-purple-950/60 dark:via-fuchsia-900/40 dark:to-pink-950/60 shadow-[4px_4px_12px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.12)]'
                    : 'bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isAllDone ? (
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                    )}
                    <span className="font-bold truncate text-slate-800 dark:text-slate-100">{cat}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <span className={isAllDone ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                      {cStat.completed} / {cStat.total}
                    </span>
                    <span className="w-7 text-right font-mono font-semibold">{cStat.pct}%</span>
                    <ChevronRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Individual Mini Progress Bar */}
                <div className="w-full bg-slate-200/60 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08)]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isAllDone
                        ? 'bg-emerald-500'
                        : isSelected
                        ? 'bg-purple-600'
                        : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                    style={{ width: `${cStat.pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

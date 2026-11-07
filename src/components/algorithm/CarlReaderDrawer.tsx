import React, { useState, useEffect } from 'react';
import { AlgoProblem } from '../../types';
import {
  X,
  BookOpen,
  ExternalLink,
  Maximize2,
  Minimize2,
  Layers,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';

interface CarlReaderDrawerProps {
  problem: AlgoProblem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CarlReaderDrawer: React.FC<CarlReaderDrawerProps> = ({
  problem,
  isOpen,
  onClose
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showTakeaways, setShowTakeaways] = useState(true);
  const [isLoading, setIsLoading] = useState(!!problem?.carlUrl);

  // Reset loading state with safety watchdog timer
  useEffect(() => {
    if (!problem?.carlUrl) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [problem?.carlUrl]);

  // Reset fullscreen when drawer is closed
  useEffect(() => {
    if (!isOpen) {
      setIsFullScreen(false);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !problem) return null;

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
      case '简单':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
            简单
          </span>
        );
      case 'medium':
      case '中等':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
            中等
          </span>
        );
      case 'hard':
      case '困难':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 right-0 max-w-full flex transition-all duration-300 ${isFullScreen ? 'pl-0' : 'pl-3 sm:pl-10'}`}>
        <div
          className={`h-full bg-[#f4f7fb] dark:bg-[#151922] ${isFullScreen ? 'rounded-none' : 'rounded-l-3xl'} border-l border-white/80 dark:border-white/10 shadow-[-10px_0_35px_rgba(0,0,0,0.18),inset_2px_2px_4px_rgba(255,255,255,0.7)] flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] animate-in slide-in-from-right duration-300 ${
            isFullScreen ? 'w-screen max-w-full' : 'w-full sm:w-[680px] lg:w-[768px] max-w-full'
          }`}
        >
          {/* Header Bar */}
          <div className="shrink-0 p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center justify-between gap-3">
              {/* Title & Tags */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-[3px_3px_8px_rgba(14,165,233,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)]">
                  <BookOpen size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {problem.num !== null && (
                      <span className="font-mono font-bold text-sky-700 dark:text-sky-400 text-xs">
                        #{problem.num}
                      </span>
                    )}
                    <h2
                      className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate"
                      title={problem.title}
                    >
                      {problem.title}
                    </h2>
                    {getDifficultyBadge(problem.difficulty)}
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]">
                      {problem.category || problem.topic}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 truncate">
                    <span>代码随想录精讲</span>
                    {problem.pattern && <span>• 解法: {problem.pattern}</span>}
                    <span className="font-mono text-slate-400">
                      • O({problem.timeComp}) / O({problem.spaceComp})
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Direct Link to External Site */}
                {problem.carlUrl && (
                  <a
                    href={problem.carlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 shadow-[2px_2px_5px_rgba(0,0,0,0.05),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
                    title="在新标签页打开代码随想录原网页"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.05),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
                  title={isFullScreen ? '恢复标准宽度' : '展开全屏宽度'}
                >
                  {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.05),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
                  title="关闭 (Esc)"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Engineering Takeaways Collapsible Bar */}
          {(problem.projectLink || problem.mistakes) && (
            <div className="shrink-0 px-4 sm:px-5 py-2.5 bg-[#eef2f7] dark:bg-[#11141a] border-b border-slate-200/60 dark:border-slate-800/60 transition-all">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowTakeaways(!showTakeaways)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>工程实战映射与考点易错分析</span>
                  {showTakeaways ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <span className="text-[10.5px] text-slate-400 font-mono">
                  {problem.pattern || '核心算法精讲'}
                </span>
              </div>

              {showTakeaways && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-2.5 pt-1 animate-in fade-in duration-200">
                  {problem.projectLink && (
                    <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-sky-700 dark:text-sky-300">
                        <Layers size={13} />
                        <span>服务端工程落地</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11.5px]">
                        {problem.projectLink}
                      </p>
                    </div>
                  )}

                  {problem.mistakes && (
                    <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/40 shadow-[3px_3px_8px_rgba(0,0,0,0.03),inset_2px_2px_4px_rgba(255,255,255,0.85)] text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                        <AlertTriangle size={13} />
                        <span>考点与高频易错警示</span>
                      </div>
                      <p className="text-amber-900/90 dark:text-amber-200/90 leading-relaxed text-[11.5px]">
                        {problem.mistakes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Iframe Viewport Container */}
          <div className="flex-1 min-h-0 relative bg-white dark:bg-slate-900 p-2 sm:p-3">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-slate-900/90 z-10 space-y-3">
                <Loader2 size={32} className="animate-spin text-sky-600 dark:text-sky-400" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  正在加载代码随想录精讲文档...
                </p>
              </div>
            )}

            {problem.carlUrl ? (
              <iframe
                src={problem.carlUrl}
                title={problem.title}
                onLoad={() => setIsLoading(false)}
                className="w-full h-full rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06)] bg-white"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <p className="text-sm font-bold">暂无该题目的随想录精讲链接</p>
                {problem.leetcodeUrl && (
                  <a
                    href={problem.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-600 hover:underline inline-flex items-center gap-1"
                  >
                    <span>在 LeetCode 查看原题讨论</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Footer Info Strip */}
          <div className="shrink-0 px-4 py-2 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">
              来源: 代码随想录 (programmercarl.com) · 嵌入阅读
            </span>
            {problem.carlUrl && (
              <a
                href={problem.carlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 dark:text-sky-400 hover:underline shrink-0 inline-flex items-center gap-1 font-semibold"
              >
                <span>若内嵌受限请点击新标签页打开</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

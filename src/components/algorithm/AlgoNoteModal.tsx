import React, { useState, useEffect, useRef } from 'react';
import { AlgoProblem, AlgoProblemNote } from '../../types';
import {
  StickyNote,
  X,
  Copy,
  Check,
  Trash2,
  Save,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const getAlgoProblemKey = (problem: AlgoProblem): string => {
  return problem.id || (problem.num !== null && problem.num !== undefined ? 'p_' + problem.num : problem.title);
};

export interface AlgoNoteModalProps {
  problem: AlgoProblem | null;
  isOpen: boolean;
  initialNote?: AlgoProblemNote | null;
  onClose: () => void;
  onSave: (problemKey: string, content: string) => void;
  onDelete?: (problemKey: string) => void;
}

export const AlgoNoteModal: React.FC<AlgoNoteModalProps> = ({
  problem,
  isOpen,
  initialNote,
  onClose,
  onSave,
  onDelete,
}) => {
  // Retain the last active problem during exit animations so the modal card can smoothly transition out
  const [activeProblem, setActiveProblem] = useState<AlgoProblem | null>(problem);
  const [content, setContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync content with initialNote when problem changes
  useEffect(() => {
    if (problem) {
      setActiveProblem(problem);
      setContent(initialNote?.content || '');
      setIsConfirmingClear(false);
      setIsCopied(false);
    }
  }, [problem, initialNote]);

  // Emil Kowalski animation mount/unmount cycle
  useEffect(() => {
    if (isOpen && problem) {
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
  }, [isOpen, problem]);

  // Auto-focus textarea on open
  useEffect(() => {
    if (isVisible && textareaRef.current) {
      textareaRef.current.focus();
      // Put cursor at end of existing text
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isVisible]);

  const currentProblem = problem || activeProblem;
  const problemKey = currentProblem ? getAlgoProblemKey(currentProblem) : '';

  const handleSaveRef = useRef<() => void>(() => {});
  const onCloseRef = useRef<() => void>(onClose);
  onCloseRef.current = onClose;

  const handleSave = () => {
    if (problemKey) {
      onSave(problemKey, content);
    }
    onClose();
  };
  handleSaveRef.current = handleSave;

  // Keyboard shortcut listener: Esc to close, Ctrl+Enter to save
  // Guarded against IME composition to protect Chinese pinyin input
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        onCloseRef.current();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        e.stopImmediatePropagation();
        handleSaveRef.current();
      }
    };

    // Use capture phase to intercept Esc before any lower-level drawer/sidebar listeners
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen]);

  if (!isMounted || !currentProblem) return null;

  const handleCopy = async () => {
    if (!content) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        // Fallback for non-secure context
        const textArea = document.createElement('textarea');
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy note:', err);
    }
  };

  const handleClear = () => {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
      return;
    }
    setContent('');
    setIsConfirmingClear(false);
    if (onDelete) {
      onDelete(problemKey);
    } else {
      onSave(problemKey, '');
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}`;
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
      case '简单':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
            简单
          </span>
        );
      case 'medium':
      case '中等':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
            中等
          </span>
        );
      case 'hard':
      case '困难':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
            困难
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-slate-100 text-slate-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]">
            {diff}
          </span>
        );
    }
  };

  const transformStyle = isVisible
    ? 'scale(1) translateY(0)'
    : isClosing
    ? 'scale(0.98)'
    : 'scale(0.96) translateY(8px)';

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 transition-opacity duration-200 select-none ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity ${
          isVisible ? 'opacity-100 duration-200' : 'opacity-0 duration-150'
        }`}
        onClick={onClose}
      />

      {/* Modal Card with Claymorphic aesthetic and Emil Kowalski hardware-accelerated motion */}
      <div
        style={{
          transform: transformStyle,
          opacity: isVisible ? 1 : 0,
          transition: isVisible
            ? 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 150ms cubic-bezier(0.7, 0, 0.84, 0), opacity 150ms cubic-bezier(0.7, 0, 0.84, 0)',
          willChange: 'transform, opacity'
        }}
        className="relative z-10 w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 sm:p-7 shadow-[12px_12px_32px_rgba(0,0,0,0.18),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] border border-white/80 dark:border-white/10 flex flex-col space-y-4 max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Amber Clay Icon Badge */}
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-950/80 dark:to-amber-900/60 text-amber-700 dark:text-amber-300 shadow-[2px_2px_5px_rgba(0,0,0,0.05),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <StickyNote size={20} className="fill-amber-400/20" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {currentProblem.num !== null && (
                  <span className="font-mono font-bold text-sky-700 dark:text-sky-400 text-xs">
                    #{currentProblem.num}
                  </span>
                )}
                <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                  {currentProblem.title}
                </h3>
                {getDifficultyBadge(currentProblem.difficulty)}
                {(currentProblem.category || currentProblem.topic) && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]">
                    {currentProblem.category || currentProblem.topic}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                <Sparkles size={12} className="text-amber-500 shrink-0" />
                <span>独立做题心得、解题模式与 C++ 工程优化备忘</span>
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-150 cursor-pointer shrink-0"
            title="关闭 (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status & Meta Info Bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 shrink-0">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock size={12} className="text-slate-400" />
            {initialNote?.updatedAt ? (
              <span>最后更新: {formatTimestamp(initialNote.updatedAt)}</span>
            ) : (
              <span>暂无历史保存记录</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono">{content.length} 字</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-slate-400">独立存储 (零键名冲突)</span>
          </div>
        </div>

        {/* Recessed Clay Textarea */}
        <div className="relative flex-1 min-h-[220px] flex flex-col">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (isConfirmingClear) setIsConfirmingClear(false);
            }}
            placeholder="在此记录本题的思考要点：&#10;1. 核心解题套路与关键指针/状态转移；&#10;2. 踩过的坑（如边界越界、空指针、开闭区间错误）；&#10;3. Muduo / C++ 实战代码中的类比设计..."
            className="w-full flex-1 min-h-[220px] sm:min-h-[260px] p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#0c0f16] text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-sans leading-relaxed shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)] border border-slate-200/70 dark:border-white/[0.08] focus:border-amber-500/80 dark:focus:border-amber-400/80 focus:outline-hidden transition-all resize-none select-text"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0">
          {/* Left tools: Copy & Clear */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!content}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isCopied
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                  : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400'
              }`}
              title="复制便签文本"
            >
              {isCopied ? <Check size={13} /> : <Copy size={13} />}
              <span>{isCopied ? '已复制' : '复制'}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={!content && !initialNote}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isConfirmingClear
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold'
                  : 'bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
              title="清空并删除本题便签"
            >
              {isConfirmingClear ? <AlertCircle size={13} /> : <Trash2 size={13} />}
              <span>{isConfirmingClear ? '确定清空?' : '清空'}</span>
            </button>
          </div>

          {/* Right actions: Shortcut prompt, Cancel, Save */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono pr-1">
              Ctrl + Enter 保存
            </span>

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-2xl text-xs font-semibold bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-150 cursor-pointer"
            >
              取消
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[3px_3px_8px_rgba(245,158,11,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_8px_rgba(245,158,11,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-150 cursor-pointer"
            >
              <Save size={13} />
              <span>保存便签</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

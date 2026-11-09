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
  AlertCircle,
  Edit3,
  Eye,
  Columns2,
  Bold,
  Italic,
  Code,
  FileCode2,
  ListCheck,
  Quote
} from 'lucide-react';
import { MarkdownView } from '../reader/MarkdownView';

export const getAlgoProblemKey = (problem: AlgoProblem): string => {
  return problem.id || (problem.num !== null && problem.num !== undefined ? 'p_' + problem.num : problem.title);
};

export type NoteViewMode = 'edit' | 'preview' | 'split';

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
  const [viewMode, setViewMode] = useState<NoteViewMode>('edit');
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
      // Auto-switch to edit mode for empty notes so user is not stuck in blank preview
      if (!initialNote?.content) {
        setViewMode('edit');
      }
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

  // Auto-focus textarea on open or when switching to edit/split mode
  useEffect(() => {
    if (isVisible && (viewMode === 'edit' || viewMode === 'split') && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isVisible, viewMode]);

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

  // Keyboard shortcut listener: Esc to close, Ctrl+Enter / Cmd+Enter to save
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

  // Quick Markdown formatting insertion helper
  const handleInsertMarkdown = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    const hasSelection = start !== end;
    const selectedText = hasSelection ? content.slice(start, end) : defaultPlaceholder;
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = content.slice(0, start) + replacement + content.slice(end);
    setContent(newContent);
    setTimeout(() => {
      el.focus();
      const cursorStart = start + prefix.length;
      const cursorEnd = cursorStart + selectedText.length;
      el.setSelectionRange(cursorStart, cursorEnd);
    }, 0);
  };

  // Support Tab key indentation in textarea (single cursor or multi-line block indent / Shift+Tab unindent)
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const val = content;

      if (start === end) {
        // Single cursor: insert 2 spaces
        const newContent = val.slice(0, start) + '  ' + val.slice(end);
        setContent(newContent);
        setTimeout(() => {
          el.selectionStart = el.selectionEnd = start + 2;
        }, 0);
      } else {
        // Multi-line selection: indent or Shift+Tab unindent
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = val.indexOf('\n', end);
        const effectiveEnd = lineEnd === -1 ? val.length : lineEnd;
        const selectedBlock = val.slice(lineStart, effectiveEnd);
        const lines = selectedBlock.split('\n');

        if (e.shiftKey) {
          const unindented = lines.map(line => line.replace(/^ {1,2}/, '')).join('\n');
          const newContent = val.slice(0, lineStart) + unindented + val.slice(effectiveEnd);
          setContent(newContent);
          setTimeout(() => {
            el.selectionStart = lineStart;
            el.selectionEnd = lineStart + unindented.length;
          }, 0);
        } else {
          const indented = lines.map(line => '  ' + line).join('\n');
          const newContent = val.slice(0, lineStart) + indented + val.slice(effectiveEnd);
          setContent(newContent);
          setTimeout(() => {
            el.selectionStart = lineStart;
            el.selectionEnd = lineStart + indented.length;
          }, 0);
        }
      }
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
            ? 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), max-width 200ms ease-out'
            : 'transform 150ms cubic-bezier(0.7, 0, 0.84, 0), opacity 150ms cubic-bezier(0.7, 0, 0.84, 0)',
          willChange: 'transform, opacity'
        }}
        className={`relative z-10 w-full ${
          viewMode === 'split' ? 'max-w-4xl lg:max-w-5xl' : 'max-w-2xl'
        } bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 sm:p-7 shadow-[12px_12px_32px_rgba(0,0,0,0.18),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] border border-white/80 dark:border-white/10 flex flex-col space-y-3.5 max-h-[92vh]`}
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
                <span>支持 Markdown 语法与代码高亮 · 独立题解备忘录</span>
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

        {/* Toolbar: Claymorphic Mode Tabs (Edit / Preview / Split) + Meta Info */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 px-0.5 shrink-0">
          {/* Segmented Pill Tabs */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-white/10 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 active:scale-[0.96] cursor-pointer ${
                viewMode === 'edit'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-[1px_1px_3px_rgba(0,0,0,0.08),inset_1px_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="编辑便签 (Markdown)"
            >
              <Edit3 size={13} />
              <span>编辑</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 active:scale-[0.96] cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-[1px_1px_3px_rgba(0,0,0,0.08),inset_1px_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="预览 Markdown 渲染效果"
            >
              <Eye size={13} />
              <span>预览</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 active:scale-[0.96] cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-[1px_1px_3px_rgba(0,0,0,0.08),inset_1px_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="双栏分屏 (边写边看)"
            >
              <Columns2 size={13} />
              <span>分屏</span>
            </button>
          </div>

          {/* Quick Markdown Formatting Shortcut Buttons (Visible in Edit & Split modes) */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className="hidden md:flex items-center gap-1 p-0.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleInsertMarkdown('**', '**', '重点文本')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-100 active:scale-[0.96] cursor-pointer"
                title="粗体 (**文本**)"
              >
                <Bold size={12} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleInsertMarkdown('*', '*', '斜体文本')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-100 active:scale-[0.96] cursor-pointer"
                title="斜体 (*文本*)"
              >
                <Italic size={12} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleInsertMarkdown('`', '`', 'code')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-100 active:scale-[0.96] cursor-pointer"
                title="行内代码 (`code`)"
              >
                <Code size={12} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleInsertMarkdown('\n```cpp\n', '\n```\n', '// C++ 优化实现\nclass Solution {\npublic:\n    // ...\n};')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-100 active:scale-[0.96] cursor-pointer"
                title="C++ 代码块 (```cpp)"
              >
                <FileCode2 size={12} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleInsertMarkdown('\n- [ ] ', '', '解题任务与边界验证')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-100 active:scale-[0.96] cursor-pointer"
                title="待办清单 (- [ ])"
              >
                <ListCheck size={12} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleInsertMarkdown('\n> ', '', '解题心得与模式总结')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-100 active:scale-[0.96] cursor-pointer"
                title="引用块 (> )"
              >
                <Quote size={12} />
              </button>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-1 text-slate-400">
              <Clock size={11} />
              {initialNote?.updatedAt ? (
                <span>更新于 {formatTimestamp(initialNote.updatedAt)}</span>
              ) : (
                <span>新便签</span>
              )}
            </div>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">{content.length} 字</span>
          </div>
        </div>

        {/* Main Content Area: Edit / Preview / Split */}
        <div className="relative flex-1 min-h-[250px] sm:min-h-[280px] flex flex-col">
          {/* Edit Mode */}
          {viewMode === 'edit' && (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (isConfirmingClear) setIsConfirmingClear(false);
              }}
              onKeyDown={handleTextareaKeyDown}
              placeholder="在此使用 Markdown 记录本题思路、解题套路与关键代码：&#10;&#10;### 💡 核心解法&#10;- 快慢指针 / 滑动窗口边界条件；&#10;- 开闭区间与空节点特判；&#10;&#10;### 💻 C++ 优化实现&#10;```cpp&#10;class Solution {&#10;public:&#10;    int removeElement(vector<int>& nums, int val) {&#10;        // 双指针优化原地覆盖&#10;    }&#10;};&#10;```&#10;&#10;### ✅ 验证清单&#10;- [x] 边界测试用例通过&#10;- [ ] 空间复杂度压至 O(1)"
              className="w-full flex-1 min-h-[250px] sm:min-h-[280px] max-h-[55vh] p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#0c0f16] text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-mono leading-relaxed shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)] border border-slate-200/70 dark:border-white/[0.08] focus:border-amber-500/80 dark:focus:border-amber-400/80 focus:outline-hidden transition-all resize-none select-text"
            />
          )}

          {/* Preview Mode */}
          {viewMode === 'preview' && (
            <div className="w-full flex-1 min-h-[250px] sm:min-h-[280px] max-h-[55vh] overflow-y-auto p-4 sm:p-5 rounded-2xl bg-[#f8fafc]/90 dark:bg-[#0c0f16]/90 border border-slate-200/70 dark:border-white/[0.08] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)] select-text leading-relaxed">
              {content.trim() ? (
                <MarkdownView content={content} variant="note" />
              ) : (
                <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-3 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1px_1px_2px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                    <StickyNote size={24} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">便签内容为空</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                    点击下方按钮切换至「编辑」模式，即可输入 Markdown 语法（标题、代码高亮、列表与清单）实时渲染。
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewMode('edit')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-[2px_2px_6px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-150 cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>立即编辑便签</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Split Mode (Side by Side) */}
          {viewMode === 'split' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1 min-h-[250px] sm:min-h-[280px]">
              {/* Left Column: Markdown Editor */}
              <div className="flex flex-col h-full min-h-[240px]">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Edit3 size={11} className="text-amber-500" />
                    <span>Markdown 源码</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Tab 缩进 2 空格</span>
                </div>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (isConfirmingClear) setIsConfirmingClear(false);
                  }}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="在此输入 Markdown 源码..."
                  className="w-full flex-1 min-h-[240px] max-h-[52vh] p-3.5 rounded-2xl bg-[#f8fafc] dark:bg-[#0c0f16] text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-mono leading-relaxed shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)] border border-slate-200/70 dark:border-white/[0.08] focus:border-amber-500/80 dark:focus:border-amber-400/80 focus:outline-hidden transition-all resize-none select-text"
                />
              </div>

              {/* Right Column: Live Markdown Preview */}
              <div className="flex flex-col h-full min-h-[240px]">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Eye size={11} className="text-sky-500" />
                    <span>实时渲染预览</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">即时同步</span>
                </div>
                <div className="w-full flex-1 min-h-[240px] max-h-[52vh] overflow-y-auto p-3.5 sm:p-4 rounded-2xl bg-[#f8fafc]/90 dark:bg-[#0c0f16]/90 border border-slate-200/70 dark:border-white/[0.08] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)] select-text leading-relaxed">
                  {content.trim() ? (
                    <MarkdownView content={content} variant="note" />
                  ) : (
                    <div className="h-full min-h-[200px] flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 italic">
                      在左侧输入 Markdown 语法，右侧即时渲染效果...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
              title="复制便签 Markdown 源码"
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

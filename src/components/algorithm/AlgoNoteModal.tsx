import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TurndownService from 'turndown';
import { marked } from 'marked';
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
  Bold,
  Italic,
  Code,
  FileCode2,
  ListCheck,
  Quote,
  Heading1,
  Heading2,
  List,
  Minus
} from 'lucide-react';

export const getAlgoProblemKey = (problem: AlgoProblem | null | undefined): string => {
  if (!problem) return '';
  return problem.id || (problem.num !== null && problem.num !== undefined ? 'p_' + problem.num : problem.title || '');
};

export interface AlgoNoteModalProps {
  problem: AlgoProblem | null;
  isOpen: boolean;
  initialNote?: AlgoProblemNote | null;
  onClose: () => void;
  onSave: (problemKey: string, content: string) => void;
  onDelete?: (problemKey: string) => void;
}

// Global Turndown Service instance for fast, accurate HTML -> Markdown serialization
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---',
});

// Configure custom rule for task items to ensure clean `- [ ] ` and `- [x] ` Markdown output
turndownService.addRule('tiptapTaskList', {
  filter: function (node) {
    return node.nodeName === 'LI' && (node.getAttribute('data-type') === 'taskItem' || node.classList.contains('task-item'));
  },
  replacement: function (content, node) {
    const isChecked = node.getAttribute('data-checked') === 'true' || !!node.querySelector('input[type="checkbox"]:checked');
    const cleanContent = content.trimStart().replace(/^\[[ xX]\]\s*/, '');
    return (isChecked ? '- [x] ' : '- [ ] ') + cleanContent + '\n';
  }
});

// Configure custom rule for code blocks to preserve language
turndownService.addRule('fencedCodeBlock', {
  filter: function (node) {
    return node.nodeName === 'PRE' && !!node.querySelector('code');
  },
  replacement: function (content, node) {
    const codeEl = node.querySelector('code');
    const className = codeEl ? codeEl.className || '' : '';
    const langMatch = className.match(/language-(\w+)/);
    const lang = langMatch ? langMatch[1] : 'cpp';
    const rawCode = codeEl ? codeEl.textContent || '' : content;
    return `\n\`\`\`${lang}\n${rawCode.replace(/\n$/, '')}\n\`\`\`\n\n`;
  }
});

export const AlgoNoteModal: React.FC<AlgoNoteModalProps> = ({
  problem,
  isOpen,
  initialNote,
  onClose,
  onSave,
  onDelete
}) => {
  // Mounting & Emil Kowalski spring motion lifecycle
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [isManualSavedFeedback, setIsManualSavedFeedback] = useState(false);
  const [wordCount, setWordCount] = useState<number>(0);

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeProblemRef = useRef<AlgoProblem | null>(problem);
  activeProblemRef.current = problem;

  const currentProblem = problem;
  const problemKey = currentProblem ? getAlgoProblemKey(currentProblem) : '';

  // TipTap Single Unified Canvas Editor Instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs p-4 my-3 border border-slate-700/60 overflow-x-auto shadow-inner leading-relaxed'
          }
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside ml-5 space-y-1 my-2 text-slate-800 dark:text-slate-200'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside ml-5 space-y-1 my-2 text-slate-800 dark:text-slate-200'
          }
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-purple-500/80 bg-purple-50/50 dark:bg-purple-950/20 pl-3.5 py-1.5 my-2.5 rounded-r-xl text-slate-700 dark:text-slate-300 italic'
          }
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'border-t border-slate-200 dark:border-slate-800 my-4'
          }
        }
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-0 space-y-1.5 my-2.5'
        }
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start gap-2.5 my-1 text-slate-800 dark:text-slate-200 group'
        }
      })
    ],
    editorProps: {
      attributes: {
        class: 'outline-hidden min-h-[320px] max-h-[58vh] overflow-y-auto px-1 py-1 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans cursor-text'
      }
    },
    onUpdate({ editor: currentEditor }) {
      const text = currentEditor.getText();
      setWordCount(text.trim() ? text.length : 0);

      // 800ms debounced auto-save handler
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      setSaveStatus('saving');
      autoSaveTimerRef.current = setTimeout(() => {
        const curProblem = activeProblemRef.current;
        if (curProblem) {
          const pKey = getAlgoProblemKey(curProblem);
          const html = currentEditor.getHTML();
          const md = turndownService.turndown(html).trim();
          onSave(pKey, md);
        }
        setSaveStatus('saved');
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        setLastSavedTime(`${hh}:${mm}`);
        autoSaveTimerRef.current = null;
      }, 800);
    }
  });

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

  // Synchronize initial content whenever a problem is opened
  useEffect(() => {
    if (isOpen && problem && editor) {
      const rawMd = initialNote?.content || '';
      if (rawMd.trim()) {
        try {
          const parsedHtml = marked.parse(rawMd, { async: false }) as string;
          editor.commands.setContent(parsedHtml, { emitUpdate: false });
        } catch {
          editor.commands.setContent(`<p>${rawMd}</p>`, { emitUpdate: false });
        }
      } else {
        editor.commands.clearContent(false);
      }
      const initialText = editor.getText();
      setWordCount(initialText.trim() ? initialText.length : 0);
      setSaveStatus('idle');
      setIsConfirmingClear(false);
      setIsCopied(false);
      // Auto-focus the editor surface
      setTimeout(() => {
        editor.commands.focus('end');
      }, 50);
    }
  }, [isOpen, problem, initialNote, editor]);

  // Instant Manual Save (Ctrl+S / Ctrl+Enter or Click)
  const handleManualSave = useCallback(() => {
    if (!editor) return;
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    const html = editor.getHTML();
    const md = turndownService.turndown(html).trim();
    if (problemKey) {
      onSave(problemKey, md);
    }
    setSaveStatus('saved');
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setLastSavedTime(`${hh}:${mm}`);
    setIsManualSavedFeedback(true);
    setTimeout(() => setIsManualSavedFeedback(false), 2000);
  }, [editor, problemKey, onSave]);

  // Flush on Close / Exit: synchronously commit & save before unmounting (100% zero data loss)
  const handleCloseWithFlush = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    if (editor && problemKey) {
      const html = editor.getHTML();
      const finalMd = turndownService.turndown(html).trim();
      const prevMd = (initialNote?.content || '').trim();
      if (finalMd !== prevMd) {
        onSave(problemKey, finalMd);
      }
    }
    onClose();
  }, [editor, problemKey, initialNote, onSave, onClose]);

  // Copy full note markdown content to clipboard with fallback
  const handleCopy = useCallback(async () => {
    if (!editor) return;
    const html = editor.getHTML();
    const md = turndownService.turndown(html).trim();
    if (!md) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(md);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = md;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } finally {
        document.body.removeChild(ta);
      }
    }
  }, [editor]);

  // Clear note with secondary confirmation protection
  const handleClear = useCallback(() => {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
      setTimeout(() => setIsConfirmingClear(false), 3000);
      return;
    }
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    if (editor) {
      editor.commands.clearContent(true);
    }
    setIsConfirmingClear(false);
    if (problemKey) {
      onDelete?.(problemKey);
    }
    setSaveStatus('saved');
    setLastSavedTime('');
    setWordCount(0);
  }, [isConfirmingClear, editor, problemKey, onDelete]);

  // Global window keyboard listener: Esc to flush & close, Ctrl+Enter / Ctrl+S to save
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing || (e as any).keyCode === 229) return;

      const isMod = e.ctrlKey || e.metaKey;

      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        handleCloseWithFlush();
        return;
      }

      if (((e.ctrlKey || e.metaKey) && e.key === 'Enter') || (isMod && e.key.toLowerCase() === 's')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        handleManualSave();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, handleCloseWithFlush, handleManualSave]);

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

  const getDifficultyBadge = (diff?: string) => {
    if (!diff) return null;
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

  // Absolute safety guard against unmounted / null crash
  if (!isMounted || !currentProblem) return null;

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
        onClick={handleCloseWithFlush}
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
        className="relative z-10 w-full max-w-3xl bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 sm:p-7 shadow-[12px_12px_32px_rgba(0,0,0,0.18),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] border border-white/80 dark:border-white/10 flex flex-col space-y-3.5 max-h-[92vh]"
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
                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {currentProblem.category || currentProblem.topic}
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
                <Sparkles size={12} className="text-amber-500 dark:text-amber-400" />
                <span>Typora / Notion 单画布真所见即所得 · 整个框直接打字 · 实时渲染</span>
              </p>
            </div>
          </div>

          {/* Close button with Claymorphic squash feedback */}
          <button
            type="button"
            onClick={handleCloseWithFlush}
            className="p-2 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] active:scale-[0.96] transition-transform duration-100 cursor-pointer shrink-0"
            title="关闭便签 (Esc 自动保存)"
            aria-label="关闭便签"
          >
            <X size={16} />
          </button>
        </div>

        {/* Toolbar & Live Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-0.5 shrink-0">
          {/* Typora-style Formatting Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-1 text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                editor?.isActive('bold')
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold shadow-inner'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="加粗 (Ctrl+B / 键入 **内容**)"
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                editor?.isActive('italic')
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold shadow-inner'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="斜体 (Ctrl+I / 键入 *内容*)"
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleCode().run()}
              className={`p-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                editor?.isActive('code')
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold shadow-inner'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="行内代码 (Ctrl+E / 键入 \`code\`)"
            >
              <Code size={14} />
            </button>

            <span className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-0.5" />

            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                editor?.isActive('heading', { level: 1 })
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold shadow-inner'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="一级标题 (键入 # 内容)"
            >
              <Heading1 size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                editor?.isActive('heading', { level: 2 })
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold shadow-inner'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="二级标题 (键入 ## 内容)"
            >
              <Heading2 size={14} />
            </button>

            <span className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-0.5" />

            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleTaskList().run()}
              className={`p-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                editor?.isActive('taskList')
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold shadow-inner'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="待办清单 (键入 - [ ] 内容，鼠标可直接打钩)"
            >
              <ListCheck size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                editor?.isActive('bulletList')
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold shadow-inner'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="无序列表 (键入 - 内容)"
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={`p-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                editor?.isActive('codeBlock')
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold shadow-inner'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="代码块 (键入 ```cpp 并回车)"
            >
              <FileCode2 size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                editor?.isActive('blockquote')
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold shadow-inner'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="引用块 (键入 > 内容)"
            >
              <Quote size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              className="p-1.5 rounded-xl transition-all duration-150 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              title="分割线 (键入 --- 并回车)"
            >
              <Minus size={14} />
            </button>
          </div>

          {/* Right Live Status (Saving / Words / Timestamp) */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-sans font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                正在保存...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-sans font-medium">
                <Check size={11} />
                已保存
              </span>
            )}
            {lastSavedTime && saveStatus === 'idle' && (
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Clock size={11} />
                {lastSavedTime}
              </span>
            )}
            {initialNote?.updatedAt && !lastSavedTime && (
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Clock size={11} />
                更新于 {formatTimestamp(initialNote.updatedAt)}
              </span>
            )}
            <span>•</span>
            <span>{wordCount} 字</span>
          </div>
        </div>

        {/* Single Unified ContentEditable Canvas Surface (Typora / Notion Architecture) */}
        <div
          onClick={() => {
            if (editor && !editor.isFocused) {
              editor.commands.focus();
            }
          }}
          className="flex-1 min-h-[340px] max-h-[58vh] bg-slate-50/60 dark:bg-slate-950/40 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.04),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] overflow-y-auto cursor-text select-text"
        >
          <EditorContent editor={editor} />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0">
          {/* Left tools: Copy & Clear */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={wordCount === 0}
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
              disabled={wordCount === 0 && !initialNote}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isConfirmingClear
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold'
                  : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
              title="清空当前便签"
            >
              <Trash2 size={13} />
              <span>{isConfirmingClear ? '确认清空?' : '清空'}</span>
            </button>
          </div>

          {/* Right tools: Save info & Exit */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline font-mono">
              Ctrl + S 保存 · 800ms 自动保存
            </span>

            <button
              type="button"
              onClick={handleCloseWithFlush}
              className="px-3.5 py-1.5 rounded-2xl text-xs font-semibold bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-150 cursor-pointer"
            >
              完成退出
            </button>

            <button
              type="button"
              onClick={handleManualSave}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-x-105 active:scale-y-90 ${
                isManualSavedFeedback
                  ? 'bg-emerald-600 text-white shadow-[0_4px_12px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-[3px_3px_8px_rgba(245,158,11,0.35),inset_2px_2px_4px_rgba(255,255,255,0.5)] dark:shadow-[0_2px_8px_rgba(245,158,11,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)]'
              }`}
              title="立即保存 (Ctrl+S)"
            >
              {isManualSavedFeedback ? <Check size={14} /> : <Save size={14} />}
              <span>{isManualSavedFeedback ? '已保存！' : '立即保存'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

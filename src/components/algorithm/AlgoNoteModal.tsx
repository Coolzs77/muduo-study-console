import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from '@tiptap/react';
import type { ReactNodeViewProps } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import hljs from 'highlight.js';
import StarterKit from '@tiptap/starter-kit';
import { CodeBlock } from '@tiptap/extension-code-block';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TurndownService from 'turndown';
import { marked } from 'marked';
import { AlgoProblem, AlgoProblemNote } from '../../types';
import { formatComplexity } from '../../utils/formatters';
import {
  StickyNote,
  X,
  Copy,
  Check,
  Trash2,
  Save,
  Clock,
  Bold,
  Italic,
  Code,
  FileCode2,
  ListCheck,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  List,
  Minus,
  Terminal
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

/**
 * Normalize code block language tag matching CodeBlock.tsx behavior
 */
export const normalizeCodeLanguage = (rawLang?: string): string => {
  const raw = (rawLang || '').toLowerCase().trim();
  if (raw === 'c++') return 'cpp';
  if (raw === 'sh' || raw === 'shell') return 'bash';
  if (raw === 'js') return 'javascript';
  if (raw === 'ts') return 'typescript';
  if (raw === 'py') return 'python';
  return raw || 'cpp';
};

// Configure custom rule for task items to ensure clean `- [ ] ` and `- [x] ` Markdown output with nested child indentation
turndownService.addRule('tiptapTaskList', {
  filter: function (node) {
    return (
      node.nodeName === 'LI' &&
      (node.getAttribute('data-type') === 'taskItem' ||
        node.classList.contains('task-item') ||
        !!node.querySelector('input[type="checkbox"]'))
    );
  },
  replacement: function (content, node) {
    const isChecked =
      node.getAttribute('data-checked') === 'true' ||
      !!node.querySelector('input[type="checkbox"]:checked');
    const prefix = isChecked ? '- [x] ' : '- [ ] ';
    let clean = content.trimStart().replace(/^\[[ xX]\]\s*/, '');
    clean = clean.replace(/^\n+/, '').replace(/\n+$/, '');
    // Indent any nested children (e.g. subtask lists) by 2 spaces to preserve Markdown hierarchy
    clean = clean.replace(/\n/gm, '\n  ');
    return prefix + clean + '\n';
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
    const langMatch = className.match(/language-([^\s]+)/);
    const rawLang = langMatch ? langMatch[1] : 'cpp';
    const lang = normalizeCodeLanguage(rawLang);
    const rawCode = codeEl ? codeEl.textContent || '' : content;
    return `\n\`\`\`${lang}\n${rawCode.replace(/\n$/, '')}\n\`\`\`\n\n`;
  }
});

/**
 * Custom CodeBlock NodeView component restoring the original Claymorphic Terminal Card style.
 * Includes Terminal icon, language tag, line count, and one-click copy button with clipboard fallback.
 */
export const CodeBlockView: React.FC<ReactNodeViewProps> = ({ node }) => {
  const [copied, setCopied] = useState(false);
  const lang = normalizeCodeLanguage(node.attrs?.language);
  const codeText = node.textContent || '';
  const lineCount = codeText ? codeText.split('\n').length : 1;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!codeText) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(codeText);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = codeText;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  return (
    <NodeViewWrapper className="my-3 rounded-2xl overflow-hidden border border-white/70 dark:border-white/10 bg-white/90 dark:bg-[#1a1f2c]/90 text-slate-800 dark:text-[#cccccc] shadow-[6px_6px_16px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] text-[13px] font-mono">
      <div
        contentEditable={false}
        className="flex items-center justify-between px-4 py-2.5 bg-slate-100/70 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 select-none shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]"
      >
        <div className="flex items-center gap-2.5">
          <Terminal size={14} className="text-sky-600 dark:text-sky-400" />
          <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono text-[11px]">
            {lang}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            ({lineCount} 行)
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-white/90 dark:bg-slate-800/90 hover:bg-white text-slate-700 dark:text-slate-200 border border-white/80 dark:border-white/10 shadow-[2px_2px_5px_rgba(0,0,0,0.06),inset_1px_1px_2px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-xs font-bold cursor-pointer"
          title="复制代码"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-500 dark:text-emerald-400 transition-transform scale-110" />
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">已复制</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>复制代码</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto leading-relaxed bg-slate-50/50 dark:bg-[#151922]/50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.04)] max-h-[500px]">
        <pre className="m-0 bg-transparent p-0 font-mono text-[13px] leading-relaxed whitespace-pre hljs">
          <NodeViewContent<'code'> as="code" className="font-mono text-[13px] leading-relaxed block" />
        </pre>
      </div>
    </NodeViewWrapper>
  );
};

// High-performance Syntax Highlighting Decoration Engine for CodeBlock
const highlightPluginKey = new PluginKey('codeBlockHighlight');

function getHighlightDecorations(doc: any, name: string): DecorationSet {
  const decorations: Decoration[] = [];

  doc.descendants((node: any, pos: number) => {
    if (node.type.name !== name) {
      return;
    }

    const language = (node.attrs.language as string) || 'cpp';
    const rawLang = language.toLowerCase().trim();
    const cleanLang = rawLang === 'c++' ? 'cpp' : (rawLang === 'js' ? 'javascript' : (rawLang === 'ts' ? 'typescript' : (rawLang === 'py' ? 'python' : rawLang)));
    const text = node.textContent;
    if (!text) return;

    try {
      const result = hljs.getLanguage(cleanLang)
        ? hljs.highlight(text, { language: cleanLang, ignoreIllegals: true })
        : hljs.highlightAuto(text);

      const rootNode = (result as any)._emitter?.rootNode;
      if (!rootNode || !rootNode.children) return;

      let currentOffset = 0;

      function traverse(children: any[], inheritedScope = '') {
        for (const child of children) {
          if (typeof child === 'string') {
            const len = child.length;
            if (inheritedScope && len > 0) {
              const from = pos + 1 + currentOffset;
              const to = from + len;
              const classNames = inheritedScope
                .split('.')
                .map((cls) => `hljs-${cls}`)
                .join(' ');
              decorations.push(
                Decoration.inline(from, to, {
                  class: classNames,
                })
              );
            }
            currentOffset += len;
          } else if (child && child.children) {
            const scope = child.scope || inheritedScope;
            traverse(child.children, scope);
          }
        }
      }

      traverse(rootNode.children);
    } catch {
      // ignore parsing error gracefully
    }
  });

  return DecorationSet.create(doc, decorations);
}

function createHighlightPlugin(nodeName: string) {
  return new Plugin({
    key: highlightPluginKey,
    state: {
      init(_, { doc }) {
        return getHighlightDecorations(doc, nodeName);
      },
      apply(tr, decorationSet, oldState, newState) {
        const oldDoc = oldState.doc;
        const newDoc = newState.doc;

        if (tr.docChanged || !decorationSet) {
          return getHighlightDecorations(newDoc, nodeName);
        }

        return decorationSet.map(tr.mapping, tr.doc);
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
    },
  });
}

// Custom CodeBlock Extension with beautiful Claymorphic Terminal NodeView, Syntax Highlighting and tab indentation
const CustomCodeBlock = CodeBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView);
  },
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      createHighlightPlugin(this.name),
    ];
  },
}).configure({
  enableTabIndentation: true,
  tabSize: 2,
  defaultLanguage: 'cpp',
});

// Custom TabIndent extension supporting Tab / Shift+Tab for lists, paragraphs, and code blocks
const TabIndent = Extension.create({
  name: 'tabIndent',
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        if (editor.isActive('codeBlock')) {
          return false;
        }
        if (editor.isActive('taskItem')) {
          editor.commands.sinkListItem('taskItem');
          return true;
        }
        if (editor.isActive('listItem')) {
          editor.commands.sinkListItem('listItem');
          return true;
        }
        return editor.commands.insertContent('  ');
      },
      'Shift-Tab': ({ editor }) => {
        if (editor.isActive('codeBlock')) {
          return false;
        }
        if (editor.isActive('taskItem')) {
          editor.commands.liftListItem('taskItem');
          return true;
        }
        if (editor.isActive('listItem')) {
          editor.commands.liftListItem('listItem');
          return true;
        }
        if (editor.state.selection.empty) {
          const { $from } = editor.state.selection;
          const textBefore = $from.parent.textBetween(
            Math.max(0, $from.parentOffset - 2),
            $from.parentOffset,
            '\n',
            '\n'
          );
          if (textBefore === '  ') {
            editor.commands.deleteRange({ from: $from.pos - 2, to: $from.pos });
            return true;
          }
        }
        return true;
      },
    };
  },
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
  const [, setEditorStateTick] = useState<number>(0);

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetSaveStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const activeProblemRef = useRef<AlgoProblem | null>(problem);
  activeProblemRef.current = problem;
  const loadedProblemKeyRef = useRef<string>('');
  const lastSavedMdRef = useRef<string>('');

  const currentProblem = problem;
  const problemKey = currentProblem ? getAlgoProblemKey(currentProblem) : '';

  // TipTap Single Unified Canvas Editor Instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        codeBlock: false,
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
            class: 'border-l-4 border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 rounded-r-xl px-3.5 py-2 my-2.5 text-xs sm:text-sm not-italic'
          }
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'border-t border-slate-200 dark:border-slate-800 my-4'
          }
        }
      }),
      CustomCodeBlock,
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
      }),
      TabIndent
    ],
    editorProps: {
      attributes: {
        class: 'outline-hidden min-h-[320px] max-h-[58vh] overflow-y-auto px-1 py-1 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans cursor-text'
      }
    },
    onSelectionUpdate() {
      setEditorStateTick((t) => (t + 1) % 1000000);
    },
    onTransaction() {
      setEditorStateTick((t) => (t + 1) % 1000000);
    },
    onUpdate({ editor: currentEditor }) {
      const text = currentEditor.getText();
      setWordCount(text.trim() ? text.length : 0);

      // 800ms debounced auto-save handler (silent background saving, zero cursor interference)
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
          lastSavedMdRef.current = md;
          onSaveRef.current(pKey, md);
        }
        setSaveStatus('saved');
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        setLastSavedTime(`${hh}:${mm}`);
        autoSaveTimerRef.current = null;

        if (resetSaveStatusTimerRef.current) {
          clearTimeout(resetSaveStatusTimerRef.current);
        }
        resetSaveStatusTimerRef.current = setTimeout(() => {
          setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev));
          resetSaveStatusTimerRef.current = null;
        }, 3000);
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

  // Synchronize initial content ONLY on modal open or when active problem changes
  // Critical fix: initialNote is intentionally excluded from dependencies to ensure auto-save never wipes out cursor/focus!
  useEffect(() => {
    if (!isOpen || !problem || !editor) {
      if (!isOpen) {
        loadedProblemKeyRef.current = '';
      }
      return;
    }

    const currentKey = getAlgoProblemKey(problem);
    if (loadedProblemKeyRef.current !== currentKey) {
      loadedProblemKeyRef.current = currentKey;
      const rawMd = initialNote?.content || '';
      lastSavedMdRef.current = rawMd.trim();
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
      // Auto-focus the editor surface only on modal open
      setTimeout(() => {
        editor.commands.focus('end');
      }, 50);
    }
  }, [isOpen, problem, editor]);

  // Instant Manual Save (Ctrl+S / Ctrl+Enter or Click)
  const handleManualSave = useCallback(() => {
    if (!editor) return;
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    const html = editor.getHTML();
    const md = turndownService.turndown(html).trim();
    lastSavedMdRef.current = md;
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

    if (resetSaveStatusTimerRef.current) {
      clearTimeout(resetSaveStatusTimerRef.current);
    }
    resetSaveStatusTimerRef.current = setTimeout(() => {
      setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev));
      resetSaveStatusTimerRef.current = null;
    }, 3000);
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
      if (finalMd !== lastSavedMdRef.current) {
        lastSavedMdRef.current = finalMd;
        onSave(problemKey, finalMd);
      }
    }
    onClose();
  }, [editor, problemKey, onSave, onClose]);

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
    lastSavedMdRef.current = '';
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
        className="relative z-10 w-full max-w-3xl bg-white/95 dark:bg-slate-900/95 rounded-3xl p-4 sm:p-7 shadow-[12px_12px_32px_rgba(0,0,0,0.18),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] border border-white/80 dark:border-white/10 flex flex-col space-y-3.5 max-h-[92vh] overflow-hidden"
      >
        {/* Header - Cleaned without superfluous promotional comments */}
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
                {currentProblem.isHot100 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Hot 100
                  </span>
                )}
                {currentProblem.isCarl && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    随想录
                  </span>
                )}
              </div>

              {/* Sub-line: Solution Pattern & Complexity (内容和每道题卡片完全一致) */}
              {(currentProblem.pattern || currentProblem.timeComp || currentProblem.spaceComp) && (
                <div className="flex flex-wrap items-center gap-2 mt-1 text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                  {currentProblem.pattern && <span>解法: {currentProblem.pattern}</span>}
                  {currentProblem.pattern && (currentProblem.timeComp || currentProblem.spaceComp) && (
                    <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
                  )}
                  {(currentProblem.timeComp || currentProblem.spaceComp) && (
                    <span className="font-mono text-slate-400">
                      {formatComplexity(currentProblem.timeComp)} / {formatComplexity(currentProblem.spaceComp)}
                    </span>
                  )}
                </div>
              )}
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
        <div className="flex items-center justify-between gap-1.5 sm:gap-3 px-1 pt-0.5 shrink-0 min-w-0 w-full overflow-hidden">
          {/* Typora-style Formatting Actions Toolbar with claymorphic groove pill container */}
          <div className="flex items-center gap-0.5 sm:gap-1 p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] shrink min-w-0 overflow-x-auto scrollbar-none">
            {/* 1. Bold (Blue) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer shrink-0 ${
                editor?.isActive('bold')
                  ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-blue-950/40'
              }`}
              title="加粗 (Ctrl+B / 键入 **内容**)"
              aria-label="加粗"
            >
              <Bold size={14} />
            </button>

            {/* 2. Italic (Purple) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer shrink-0 ${
                editor?.isActive('italic')
                  ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/70 dark:hover:bg-purple-950/40'
              }`}
              title="斜体 (Ctrl+I / 键入 *内容*)"
              aria-label="斜体"
            >
              <Italic size={14} />
            </button>

            {/* 3. Inline Code (Cyan) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor?.chain().focus().toggleCode().run()}
              className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer shrink-0 ${
                editor?.isActive('code')
                  ? 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50/70 dark:hover:bg-cyan-950/40'
              }`}
              title="行内代码 (Ctrl+E / 键入 `code`)"
              aria-label="行内代码"
            >
              <Code size={14} />
            </button>

            <span className="w-px h-3.5 bg-slate-300 dark:bg-slate-700 mx-0.5 shrink-0" />

            {/* 4. Heading 1 (Sky) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (!editor) return;
                if (editor.isActive('heading', { level: 1 })) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                }
              }}
              className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer shrink-0 ${
                editor?.isActive('heading', { level: 1 })
                  ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50/70 dark:hover:bg-sky-950/40'
              }`}
              title="一级标题 (键入 # 内容)"
              aria-label="一级标题"
            >
              <Heading1 size={14} />
            </button>

            {/* 5. Heading 2 (Indigo) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (!editor) return;
                if (editor.isActive('heading', { level: 2 })) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                }
              }}
              className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer shrink-0 ${
                editor?.isActive('heading', { level: 2 })
                  ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40'
              }`}
              title="二级标题 (键入 ## 内容)"
              aria-label="二级标题"
            >
              <Heading2 size={14} />
            </button>

            {/* 6. Heading 3 (Slate) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (!editor) return;
                if (editor.isActive('heading', { level: 3 })) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                }
              }}
              className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer shrink-0 ${
                editor?.isActive('heading', { level: 3 })
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
              title="三级标题 (键入 ### 内容)"
              aria-label="三级标题"
            >
              <Heading3 size={14} />
            </button>

            <span className="w-px h-3.5 bg-slate-300 dark:bg-slate-700 mx-0.5 shrink-0" />

            {/* 7. Task List (Emerald) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor?.chain().focus().toggleTaskList().run()}
              className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer shrink-0 ${
                editor?.isActive('taskList')
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40'
              }`}
              title="待办清单 (键入 - [ ] 内容，鼠标可直接打钩)"
              aria-label="待办清单"
            >
              <ListCheck size={14} />
            </button>

            {/* 8. Bullet List (Green) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer shrink-0 ${
                editor?.isActive('bulletList')
                  ? 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50/70 dark:hover:bg-green-950/40'
              }`}
              title="无序列表 (键入 - 内容)"
              aria-label="无序列表"
            >
              <List size={14} />
            </button>

            {/* 9. Code Block (Rose) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (!editor) return;
                if (editor.isActive('codeBlock')) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().toggleCodeBlock().run();
                }
              }}
              className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer shrink-0 ${
                editor?.isActive('codeBlock')
                  ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/40'
              }`}
              title="代码块 (键入 ```cpp 并回车)"
              aria-label="代码块"
            >
              <FileCode2 size={14} />
            </button>

            {/* 10. Blockquote (Amber) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer shrink-0 ${
                editor?.isActive('blockquote')
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/70 dark:hover:bg-amber-950/40'
              }`}
              title="引用块 (键入 > 内容)"
              aria-label="引用块"
            >
              <Quote size={14} />
            </button>

            {/* 11. Divider Line (Slate) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              className="p-1.5 rounded-lg transition-all duration-150 cursor-pointer shrink-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
              title="分割线 (键入 --- 并回车)"
              aria-label="分割线"
            >
              <Minus size={14} />
            </button>
          </div>

          {/* Right Live Status (Saving / Words / Timestamp) - Strictly on the Right, Non-wrapping, Never overflowing */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono shrink-0 whitespace-nowrap ml-auto pl-1">
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-sans font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                正在保存...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-sans font-medium">
                <Check size={11} />
                已保存 {lastSavedTime}
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

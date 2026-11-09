import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Bold,
  Italic,
  Code,
  FileCode2,
  ListCheck,
  Quote,
  Link2,
  Plus
} from 'lucide-react';
import { CodeBlock } from '../common/CodeBlock';

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

export interface MarkdownBlock {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'code' | 'quote' | 'checklist' | 'list' | 'table' | 'hr' | 'p' | 'empty';
  raw: string;
  startLine: number;
  endLine: number;
  level?: number;
  headingText?: string;
  codeLang?: string;
  codeText?: string;
  checked?: boolean;
  bullet?: string;
  checkText?: string;
  quoteLines?: string[];
  listType?: 'ul' | 'ol';
  listItems?: string[];
  tableHeaders?: string[];
  tableRows?: string[][];
  tableAlignments?: ('left' | 'center' | 'right')[];
}

export function parseToBlocks(content: string): MarkdownBlock[] {
  if (!content) {
    return [{
      id: 'block-empty-0',
      type: 'empty',
      raw: '',
      startLine: 0,
      endLine: 0
    }];
  }

  const lines = content.split('\n');
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Fenced Code Block
    if (line.trimStart().startsWith('```')) {
      const startLine = i;
      const langMatch = line.trimStart().slice(3).trim().split(/\s+/)[0] || '';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      const hasClosingFence = i < lines.length && lines[i].trimStart().startsWith('```');
      const endLine = hasClosingFence ? i : i - 1;
      const rawLines = lines.slice(startLine, endLine + 1);
      blocks.push({
        id: `block-code-${startLine}`,
        type: 'code',
        raw: rawLines.join('\n'),
        startLine,
        endLine,
        codeLang: langMatch || 'cpp',
        codeText: codeLines.join('\n')
      });
      i = endLine + 1;
      continue;
    }

    // 2. Horizontal rule: ---, ***, ___
    if (/^(?:---+|\*\*\*+|___+)$/.test(trimmed)) {
      blocks.push({
        id: `block-hr-${i}`,
        type: 'hr',
        raw: line,
        startLine: i,
        endLine: i
      });
      i++;
      continue;
    }

    // 3. Headings H1 - H6
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      blocks.push({
        id: `block-h-${i}`,
        type: `h${level}` as any,
        raw: line,
        startLine: i,
        endLine: i,
        level,
        headingText: headingMatch[2]
      });
      i++;
      continue;
    }

    // 4. Checklist item: - [ ] or - [x]
    const checkMatch = line.match(/^([-*+])\s+\[([ xX])\]\s*(.*)$/);
    if (checkMatch) {
      blocks.push({
        id: `block-check-${i}`,
        type: 'checklist',
        raw: line,
        startLine: i,
        endLine: i,
        bullet: checkMatch[1],
        checked: checkMatch[2].toLowerCase() === 'x',
        checkText: checkMatch[3]
      });
      i++;
      continue;
    }

    // 5. Blockquote: contiguous lines starting with >
    if (/^>\s?/.test(line)) {
      const startLine = i;
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      const endLine = i - 1;
      const rawLines = lines.slice(startLine, endLine + 1);
      blocks.push({
        id: `block-quote-${startLine}`,
        type: 'quote',
        raw: rawLines.join('\n'),
        startLine,
        endLine,
        quoteLines
      });
      continue;
    }

    // 6. Markdown Table: header line with '|' followed by delimiter row
    if (line.includes('|') && i + 1 < lines.length) {
      const nextLine = lines[i + 1].trim();
      const delimParts = nextLine.split('|').map(s => s.trim()).filter(Boolean);
      const isTable = delimParts.length > 0 && delimParts.every(p => /^:?-+:?$/.test(p));
      if (isTable) {
        const startLine = i;
        const parseRow = (str: string) => {
          let s = str.trim();
          if (s.startsWith('|')) s = s.slice(1);
          if (s.endsWith('|')) s = s.slice(0, -1);
          return s.split('|').map(c => c.trim());
        };
        const headers = parseRow(line);
        const alignments: ('left' | 'center' | 'right')[] = delimParts.map(p => {
          if (p.startsWith(':') && p.endsWith(':')) return 'center';
          if (p.endsWith(':')) return 'right';
          return 'left';
        });
        const rows: string[][] = [];
        const tableLines = [line, lines[i + 1]];
        i += 2;
        while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
          tableLines.push(lines[i]);
          rows.push(parseRow(lines[i]));
          i++;
        }
        const endLine = i - 1;
        blocks.push({
          id: `block-table-${startLine}`,
          type: 'table',
          raw: tableLines.join('\n'),
          startLine,
          endLine,
          tableHeaders: headers,
          tableRows: rows,
          tableAlignments: alignments
        });
        continue;
      }
    }

    // 7. Unordered or ordered list item
    const listMatch = line.match(/^([-*+]|\d+\.)\s+(.*)$/);
    if (listMatch) {
      const isOrdered = /^\d+\./.test(listMatch[1]);
      const startLine = i;
      const items: string[] = [listMatch[2]];
      i++;
      while (i < lines.length) {
        const nextMatch = lines[i].match(/^([-*+]|\d+\.)\s+(.*)$/);
        if (nextMatch && (/^\d+\./.test(nextMatch[1]) === isOrdered)) {
          if (/^[-*+]\s+\[([ xX])\]/.test(lines[i])) break;
          items.push(nextMatch[2]);
          i++;
        } else {
          break;
        }
      }
      const endLine = i - 1;
      const rawLines = lines.slice(startLine, endLine + 1);
      blocks.push({
        id: `block-list-${startLine}`,
        type: 'list',
        raw: rawLines.join('\n'),
        startLine,
        endLine,
        listType: isOrdered ? 'ol' : 'ul',
        listItems: items
      });
      continue;
    }

    // 8. Empty line
    if (trimmed === '') {
      blocks.push({
        id: `block-empty-${i}`,
        type: 'empty',
        raw: line,
        startLine: i,
        endLine: i
      });
      i++;
      continue;
    }

    // 9. Normal paragraph
    const startLine = i;
    const pLines: string[] = [];
    while (i < lines.length) {
      const cur = lines[i];
      const curTrimmed = cur.trim();
      if (curTrimmed === '') break;
      if (cur.trimStart().startsWith('```')) break;
      if (/^(?:---+|\*\*\*+|___+)$/.test(curTrimmed)) break;
      if (/^#{1,6}\s+/.test(cur)) break;
      if (/^[-*+]\s+\[([ xX])\]/.test(cur)) break;
      if (/^>\s?/.test(cur)) break;
      if (/^([-*+]|\d+\.)\s+/.test(cur)) break;
      if (cur.includes('|') && i + 1 < lines.length) {
        const nextDelim = lines[i + 1].trim().split('|').map(s => s.trim()).filter(Boolean);
        if (nextDelim.length > 0 && nextDelim.every(p => /^:?-+:?$/.test(p))) break;
      }
      pLines.push(cur);
      i++;
    }
    const endLine = i - 1;
    const rawLines = lines.slice(startLine, endLine + 1);
    blocks.push({
      id: `block-p-${startLine}`,
      type: 'p',
      raw: rawLines.join('\n'),
      startLine,
      endLine
    });
  }

  return blocks;
}

// Inline formatting token parser
function renderInlineContent(text: string): React.ReactNode {
  if (!text) return null;

  const tokens: Array<
    | { type: 'code'; content: string }
    | { type: 'link'; content: string; url: string }
    | { type: 'bold'; content: string }
    | { type: 'del'; content: string }
    | { type: 'italic'; content: string }
    | { type: 'text'; content: string }
  > = [];

  let i = 0;
  while (i < text.length) {
    if (text[i] === '`') {
      const end = text.indexOf('`', i + 1);
      if (end !== -1) {
        tokens.push({ type: 'code', content: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    if (text[i] === '[') {
      const closeBracket = text.indexOf(']', i + 1);
      if (closeBracket !== -1 && text[closeBracket + 1] === '(') {
        const closeParen = text.indexOf(')', closeBracket + 2);
        if (closeParen !== -1) {
          tokens.push({
            type: 'link',
            content: text.slice(i + 1, closeBracket),
            url: text.slice(closeBracket + 2, closeParen).trim()
          });
          i = closeParen + 1;
          continue;
        }
      }
    }

    if (text.startsWith('**', i)) {
      const end = text.indexOf('**', i + 2);
      if (end !== -1 && end > i + 2) {
        tokens.push({ type: 'bold', content: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }

    if (text.startsWith('~~', i)) {
      const end = text.indexOf('~~', i + 2);
      if (end !== -1 && end > i + 2) {
        tokens.push({ type: 'del', content: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }

    if (text[i] === '*' || text[i] === '_') {
      const marker = text[i];
      const nextChar = text[i + 1];
      if (nextChar && !/\s/.test(nextChar) && nextChar !== marker) {
        let end = -1;
        for (let j = i + 1; j < text.length; j++) {
          if (text[j] === marker) {
            const prevChar = text[j - 1];
            const afterChar = text[j + 1];
            if (!/\s/.test(prevChar)) {
              if (marker === '*' && afterChar && /\w/.test(afterChar)) continue;
              end = j;
              break;
            }
          }
        }
        if (end !== -1) {
          tokens.push({ type: 'italic', content: text.slice(i + 1, end) });
          i = end + 1;
          continue;
        }
      }
    }

    let nextSpecial = i + 1;
    while (nextSpecial < text.length) {
      const ch = text[nextSpecial];
      if (ch === '`' || ch === '[' || ch === '~' || ch === '*' || ch === '_') break;
      nextSpecial++;
    }
    tokens.push({ type: 'text', content: text.slice(i, nextSpecial) });
    i = nextSpecial;
  }

  return tokens.map((token, idx) => {
    switch (token.type) {
      case 'code':
        return (
          <code
            key={idx}
            className="font-mono text-[12px] bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_1px_rgba(0,0,0,0.3)]"
          >
            {token.content}
          </code>
        );
      case 'bold':
        return (
          <strong key={idx} className="font-bold text-slate-900 dark:text-white">
            {renderInlineContent(token.content)}
          </strong>
        );
      case 'italic':
        return (
          <em key={idx} className="italic text-slate-800 dark:text-slate-200">
            {renderInlineContent(token.content)}
          </em>
        );
      case 'del':
        return (
          <del key={idx} className="line-through text-slate-400 dark:text-slate-500">
            {renderInlineContent(token.content)}
          </del>
        );
      case 'link':
        return (
          <a
            key={idx}
            href={token.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 dark:text-sky-400 hover:underline font-medium inline-flex items-center gap-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            {token.content}
          </a>
        );
      case 'text':
      default:
        return token.content;
    }
  });
}

export const AlgoNoteModal: React.FC<AlgoNoteModalProps> = ({
  problem,
  isOpen,
  initialNote,
  onClose,
  onSave,
  onDelete,
}) => {
  // Retain activeProblem during exit animation to prevent premature unmount
  const [activeProblem, setActiveProblem] = useState<AlgoProblem | null>(problem);
  const [content, setContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // In-place live preview state: ID of the currently active block being edited directly
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [activeBlockRaw, setActiveBlockRaw] = useState('');
  const [isManualSavedFeedback, setIsManualSavedFeedback] = useState(false);

  // Auto-Save debounced architecture state
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef(content);
  contentRef.current = content;

  const activeBlockIdRef = useRef<string | null>(activeBlockId);
  activeBlockIdRef.current = activeBlockId;

  const activeBlockRawRef = useRef<string>(activeBlockRaw);
  activeBlockRawRef.current = activeBlockRaw;

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentProblem = problem || activeProblem;
  const problemKey = currentProblem ? getAlgoProblemKey(currentProblem) : '';

  // Synchronize initial content when problem or initialNote loads
  useEffect(() => {
    if (problem) {
      setActiveProblem(problem);
      const initialText = initialNote?.content || '';
      setContent(initialText);
      contentRef.current = initialText;
      setIsConfirmingClear(false);
      setIsCopied(false);
      setSaveStatus('idle');

      // If note is empty, immediately activate the first empty block for instant typing
      if (!initialText.trim()) {
        setActiveBlockId('block-empty-0');
        activeBlockIdRef.current = 'block-empty-0';
        setActiveBlockRaw('');
        activeBlockRawRef.current = '';
      } else {
        setActiveBlockId(null);
        activeBlockIdRef.current = null;
        setActiveBlockRaw('');
        activeBlockRawRef.current = '';
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

  // Auto-resize active textarea to fit content without scroll jumps
  const autoResizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 36)}px`;
    }
  }, []);

  useEffect(() => {
    if (activeBlockId && textareaRef.current) {
      autoResizeTextarea();
      textareaRef.current.focus();
    }
  }, [activeBlockId, autoResizeTextarea]);

  // Parse current markdown document into structured blocks
  const blocks = useMemo(() => parseToBlocks(content), [content]);
  const blocksRef = useRef<MarkdownBlock[]>(blocks);
  blocksRef.current = blocks;

  // 800ms debounced auto-save handler
  const scheduleAutoSave = useCallback((newContent: string) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    setSaveStatus('saving');
    autoSaveTimerRef.current = setTimeout(() => {
      if (problemKey) {
        onSave(problemKey, newContent);
      }
      setSaveStatus('saved');
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setLastSavedTime(`${hh}:${mm}`);
      autoSaveTimerRef.current = null;
    }, 800);
  }, [problemKey, onSave]);

  // Helper to reassemble full markdown from blocks and active block edits without line-index desync
  const assembleContent = useCallback((targetBlocks: MarkdownBlock[], targetId: string, updatedRaw: string) => {
    return targetBlocks.map(b => (b.id === targetId ? updatedRaw : b.raw)).join('\n');
  }, []);

  // Commit changes from active block to document state
  const commitActiveBlock = useCallback(() => {
    if (!activeBlockIdRef.current) return;
    const targetId = activeBlockIdRef.current;
    const currentRaw = activeBlockRawRef.current;
    const currentBlocks = blocksRef.current;
    const targetBlock = currentBlocks.find(b => b.id === targetId);

    if (targetBlock && currentRaw !== targetBlock.raw) {
      const newContent = currentBlocks.map(b => (b.id === targetId ? currentRaw : b.raw)).join('\n');
      setContent(newContent);
      contentRef.current = newContent;
      scheduleAutoSave(newContent);
    }
    setActiveBlockId(null);
    activeBlockIdRef.current = null;
  }, [scheduleAutoSave]);

  const commitActiveBlockWithCustomRaw = useCallback((customRaw: string) => {
    if (!activeBlockIdRef.current) return;
    const targetId = activeBlockIdRef.current;
    const currentBlocks = blocksRef.current;
    const newContent = currentBlocks.map(b => (b.id === targetId ? customRaw : b.raw)).join('\n');
    setContent(newContent);
    contentRef.current = newContent;
    scheduleAutoSave(newContent);
    setActiveBlockId(null);
    activeBlockIdRef.current = null;
  }, [scheduleAutoSave]);

  // Activate an inactive block for in-place editing
  const activateBlock = useCallback((block: MarkdownBlock) => {
    if (activeBlockIdRef.current === block.id) return;
    commitActiveBlock();
    setActiveBlockId(block.id);
    activeBlockIdRef.current = block.id;
    setActiveBlockRaw(block.raw);
    activeBlockRawRef.current = block.raw;
  }, [commitActiveBlock]);

  // Interactive Checklist: toggle checkbox directly in-place without opening edit mode
  const handleToggleChecklist = useCallback((block: MarkdownBlock) => {
    commitActiveBlock();

    const curContent = contentRef.current;
    const curBlocks = parseToBlocks(curContent);
    const target = curBlocks.find(b => b.id === block.id) || curBlocks.find(b => b.type === 'checklist' && b.checkText === block.checkText);
    if (!target) return;

    const newChecked = !target.checked;
    const updatedLine = target.raw.replace(
      /^([-*+]\s+\[)([ xX])(\]\s*.*)$/,
      `$1${newChecked ? 'x' : ' '}$3`
    );
    const newContent = curBlocks.map(b => (b.id === target.id ? updatedLine : b.raw)).join('\n');
    setContent(newContent);
    contentRef.current = newContent;
    scheduleAutoSave(newContent);
  }, [commitActiveBlock, scheduleAutoSave]);

  // Instant Manual Save (Ctrl+S / Ctrl+Enter or Click)
  const handleManualSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    // Commit any active block edits
    if (activeBlockIdRef.current) {
      const targetId = activeBlockIdRef.current;
      const currentRaw = activeBlockRawRef.current;
      const curBlocks = blocksRef.current;
      const targetBlock = curBlocks.find(b => b.id === targetId);
      if (targetBlock) {
        const newContent = curBlocks.map(b => (b.id === targetId ? currentRaw : b.raw)).join('\n');
        setContent(newContent);
        contentRef.current = newContent;
      }
    }
    const finalContent = contentRef.current;
    if (problemKey) {
      onSave(problemKey, finalContent);
    }
    setSaveStatus('saved');
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setLastSavedTime(`${hh}:${mm}`);
    setIsManualSavedFeedback(true);
    setTimeout(() => setIsManualSavedFeedback(false), 2000);
  }, [problemKey, onSave]);

  // Flush on Close / Exit: synchronously commit & save before unmounting (100% zero data loss)
  const handleCloseWithFlush = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    let finalContent = contentRef.current;
    if (activeBlockIdRef.current) {
      const targetId = activeBlockIdRef.current;
      const currentRaw = activeBlockRawRef.current;
      const curBlocks = blocksRef.current;
      const targetBlock = curBlocks.find(b => b.id === targetId);
      if (targetBlock) {
        finalContent = curBlocks.map(b => (b.id === targetId ? currentRaw : b.raw)).join('\n');
        contentRef.current = finalContent;
        setContent(finalContent);
      }
    }
    if (problemKey && finalContent !== (initialNote?.content || '')) {
      onSave(problemKey, finalContent);
    }
    onClose();
  }, [problemKey, initialNote, onSave, onClose]);

  // Format insertion helper supporting active block selection wrapping or document appending
  const handleInsertMarkdown = useCallback((prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const el = textareaRef.current;
    if (activeBlockIdRef.current && el) {
      const curRaw = activeBlockRawRef.current;
      const start = el.selectionStart ?? curRaw.length;
      const end = el.selectionEnd ?? curRaw.length;
      const hasSel = start !== end;
      const selected = hasSel ? curRaw.slice(start, end) : defaultPlaceholder;
      const replacement = `${prefix}${selected}${suffix}`;
      const newRaw = curRaw.slice(0, start) + replacement + curRaw.slice(end);
      
      setActiveBlockRaw(newRaw);
      activeBlockRawRef.current = newRaw;

      const targetId = activeBlockIdRef.current;
      const updatedDoc = blocksRef.current.map(b => (b.id === targetId ? newRaw : b.raw)).join('\n');
      contentRef.current = updatedDoc;
      scheduleAutoSave(updatedDoc);

      setTimeout(() => {
        if (el) {
          el.focus();
          const curStart = start + prefix.length;
          const curEnd = curStart + selected.length;
          el.setSelectionRange(curStart, curEnd);
          autoResizeTextarea();
        }
      }, 0);
    } else {
      commitActiveBlock();
      const snippet = `${prefix}${defaultPlaceholder}${suffix}`;
      const cur = contentRef.current;
      const newContent = cur ? `${cur.trimEnd()}\n\n${snippet}` : snippet;
      setContent(newContent);
      contentRef.current = newContent;
      scheduleAutoSave(newContent);

      setTimeout(() => {
        const newBlocks = parseToBlocks(newContent);
        const last = newBlocks[newBlocks.length - 1];
        if (last) {
          setActiveBlockId(last.id);
          activeBlockIdRef.current = last.id;
          setActiveBlockRaw(last.raw);
          activeBlockRawRef.current = last.raw;
        }
      }, 10);
    }
  }, [commitActiveBlock, scheduleAutoSave, autoResizeTextarea]);

  // Helper for Smart Enter: insert after current block
  const handleInsertAfterBlock = useCallback((targetBlockId: string, newRaw: string) => {
    const curBlocks = parseToBlocks(contentRef.current);
    const targetIdx = curBlocks.findIndex(b => b.id === targetBlockId);
    let newContent: string;
    if (targetIdx !== -1) {
      const before = curBlocks.slice(0, targetIdx + 1).map(b => b.raw);
      const after = curBlocks.slice(targetIdx + 1).map(b => b.raw);
      newContent = [...before, newRaw, ...after].join('\n');
    } else {
      const cur = contentRef.current;
      newContent = cur ? `${cur.trimEnd()}\n${newRaw}` : newRaw;
    }
    contentRef.current = newContent;
    setContent(newContent);
    scheduleAutoSave(newContent);

    setTimeout(() => {
      const refreshedBlocks = parseToBlocks(newContent);
      const nextIdx = targetIdx !== -1 ? targetIdx + 1 : refreshedBlocks.length - 1;
      const targetBlock = refreshedBlocks[nextIdx] || refreshedBlocks[refreshedBlocks.length - 1];
      if (targetBlock) {
        setActiveBlockId(targetBlock.id);
        activeBlockIdRef.current = targetBlock.id;
        setActiveBlockRaw(targetBlock.raw);
        activeBlockRawRef.current = targetBlock.raw;
      }
    }, 10);
  }, [scheduleAutoSave]);

  // Active Block Textarea KeyDown handling: Shortcuts, Tab indentation, Smart Enter, IME protection
  const handleActiveTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.isComposing || (e.nativeEvent as any).isComposing || e.keyCode === 229) return;

    // Smart Enter logic for Obsidian/Typora feeling
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const el = e.currentTarget;
      const val = activeBlockRawRef.current;
      const start = el.selectionStart;
      const end = el.selectionEnd;

      const currentBlock = blocksRef.current.find(b => b.id === activeBlockIdRef.current);
      const isCode = currentBlock?.type === 'code' || val.trimStart().startsWith('```');

      if (!isCode && start === end) {
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = val.indexOf('\n', end);
        const curLine = val.slice(lineStart, lineEnd === -1 ? val.length : lineEnd);

        // Heading: finish heading, create new empty block below
        const headingMatch = curLine.match(/^#{1,6}\s+/);
        if (headingMatch) {
          e.preventDefault();
          const before = val.slice(0, start);
          const after = val.slice(start);
          const newBlockContent = after.trimStart();
          const activeId = activeBlockIdRef.current || '';
          
          commitActiveBlockWithCustomRaw(before);
          setTimeout(() => {
            handleInsertAfterBlock(activeId, newBlockContent);
          }, 0);
          return;
        }

        // Checklist: - [ ] or - [x]
        const checkMatch = curLine.match(/^([-*+]\s+\[[ xX]\]\s*)(.*)$/);
        if (checkMatch) {
          e.preventDefault();
          const checkPrefix = checkMatch[1].replace(/\[[xX]\]/, '[ ]');
          const checkBody = checkMatch[2].trim();

          // If empty checklist item, turn into plain line
          if (!checkBody) {
            const updated = val.slice(0, lineStart) + val.slice(lineStart + checkMatch[1].length);
            setActiveBlockRaw(updated);
            activeBlockRawRef.current = updated;
            const updatedDoc = blocksRef.current.map(b => (b.id === activeBlockIdRef.current ? updated : b.raw)).join('\n');
            contentRef.current = updatedDoc;
            scheduleAutoSave(updatedDoc);
            return;
          }

          // Otherwise, create new checklist item below
          const before = val.slice(0, start);
          const after = val.slice(start);
          const newBlockContent = `${checkPrefix}${after}`;
          const activeId = activeBlockIdRef.current || '';

          commitActiveBlockWithCustomRaw(before);
          setTimeout(() => {
            handleInsertAfterBlock(activeId, newBlockContent);
          }, 0);
          return;
        }

        // Unordered List: - or * or +
        const listMatch = curLine.match(/^([-*+]\s+)(.*)$/);
        if (listMatch) {
          e.preventDefault();
          const listPrefix = listMatch[1];
          const listBody = listMatch[2].trim();

          if (!listBody) {
            const updated = val.slice(0, lineStart) + val.slice(lineStart + listPrefix.length);
            setActiveBlockRaw(updated);
            activeBlockRawRef.current = updated;
            const updatedDoc = blocksRef.current.map(b => (b.id === activeBlockIdRef.current ? updated : b.raw)).join('\n');
            contentRef.current = updatedDoc;
            scheduleAutoSave(updatedDoc);
            return;
          }

          const before = val.slice(0, start);
          const after = val.slice(start);
          const newBlockContent = `${listPrefix}${after}`;
          const activeId = activeBlockIdRef.current || '';

          commitActiveBlockWithCustomRaw(before);
          setTimeout(() => {
            handleInsertAfterBlock(activeId, newBlockContent);
          }, 0);
          return;
        }

        // Ordered List: 1. , 2. , etc.
        const numMatch = curLine.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          e.preventDefault();
          const nextNum = parseInt(numMatch[1], 10) + 1;
          const listBody = numMatch[2].trim();

          if (!listBody) {
            const updated = val.slice(0, lineStart) + val.slice(lineStart + numMatch[0].length);
            setActiveBlockRaw(updated);
            activeBlockRawRef.current = updated;
            const updatedDoc = blocksRef.current.map(b => (b.id === activeBlockIdRef.current ? updated : b.raw)).join('\n');
            contentRef.current = updatedDoc;
            scheduleAutoSave(updatedDoc);
            return;
          }

          const before = val.slice(0, start);
          const after = val.slice(start);
          const newBlockContent = `${nextNum}. ${after}`;
          const activeId = activeBlockIdRef.current || '';

          commitActiveBlockWithCustomRaw(before);
          setTimeout(() => {
            handleInsertAfterBlock(activeId, newBlockContent);
          }, 0);
          return;
        }
      }
    }

    // 1. Tab / Shift+Tab indentation (2 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const val = activeBlockRawRef.current;

      if (start === end) {
        const updated = val.slice(0, start) + '  ' + val.slice(end);
        setActiveBlockRaw(updated);
        activeBlockRawRef.current = updated;
        const targetId = activeBlockIdRef.current || '';
        const updatedDoc = blocksRef.current.map(b => (b.id === targetId ? updated : b.raw)).join('\n');
        contentRef.current = updatedDoc;
        scheduleAutoSave(updatedDoc);
        setTimeout(() => {
          el.selectionStart = el.selectionEnd = start + 2;
        }, 0);
      } else {
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = val.indexOf('\n', end);
        const effectiveEnd = lineEnd === -1 ? val.length : lineEnd;
        const selectedBlock = val.slice(lineStart, effectiveEnd);
        const lines = selectedBlock.split('\n');

        if (e.shiftKey) {
          const unindented = lines.map(line => line.replace(/^ {1,2}/, '')).join('\n');
          const updated = val.slice(0, lineStart) + unindented + val.slice(effectiveEnd);
          setActiveBlockRaw(updated);
          activeBlockRawRef.current = updated;
          const targetId = activeBlockIdRef.current || '';
          const updatedDoc = blocksRef.current.map(b => (b.id === targetId ? updated : b.raw)).join('\n');
          contentRef.current = updatedDoc;
          scheduleAutoSave(updatedDoc);
          setTimeout(() => {
            el.selectionStart = lineStart;
            el.selectionEnd = lineStart + unindented.length;
          }, 0);
        } else {
          const indented = lines.map(line => '  ' + line).join('\n');
          const updated = val.slice(0, lineStart) + indented + val.slice(effectiveEnd);
          setActiveBlockRaw(updated);
          activeBlockRawRef.current = updated;
          const targetId = activeBlockIdRef.current || '';
          const updatedDoc = blocksRef.current.map(b => (b.id === targetId ? updated : b.raw)).join('\n');
          contentRef.current = updatedDoc;
          scheduleAutoSave(updatedDoc);
          setTimeout(() => {
            el.selectionStart = lineStart;
            el.selectionEnd = lineStart + indented.length;
          }, 0);
        }
      }
      return;
    }

    const isMod = e.ctrlKey || e.metaKey;

    // 2. Ctrl+S or Ctrl+Enter: Manual save
    if (((e.ctrlKey || e.metaKey) && e.key === 'Enter') || (isMod && e.key.toLowerCase() === 's')) {
      e.preventDefault();
      handleManualSave();
      return;
    }

    // 3. Ctrl+B: Bold
    if (isMod && !e.shiftKey && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      handleInsertMarkdown('**', '**', '重点文本');
      return;
    }

    // 4. Ctrl+I: Italic
    if (isMod && !e.shiftKey && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      handleInsertMarkdown('*', '*', '斜体文本');
      return;
    }

    // 5. Ctrl+E: Inline code
    if (isMod && !e.shiftKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      handleInsertMarkdown('`', '`', 'code');
      return;
    }

    // 6. Ctrl+Shift+C: C++ code block
    if (isMod && e.shiftKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      handleInsertMarkdown('\n```cpp\n', '\n```\n', '// C++ 核心逻辑\nclass Solution {\npublic:\n    // ...\n};');
      return;
    }

    // 7. Ctrl+Shift+L: Checklist item
    if (isMod && e.shiftKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      handleInsertMarkdown('\n- [ ] ', '', '待办清单事项');
      return;
    }

    // 8. Ctrl+K: Insert link
    if (isMod && !e.shiftKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      handleInsertMarkdown('[', '](https://)', '链接标题');
      return;
    }
  };

  // Global window keyboard listener: Esc to flush & close, Ctrl+Enter / Ctrl+S to save, plus global formatting shortcuts
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

      // If user pressed formatting shortcuts while modal is open, but textarea is not focused:
      // Prevent browser default actions (Ctrl+B = bookmarks, Ctrl+Shift+C = devtools, Ctrl+K = search bar, etc.)
      const activeEl = document.activeElement;
      const isInsideTextarea = activeEl === textareaRef.current;

      if (!isInsideTextarea) {
        if (isMod && !e.shiftKey && e.key.toLowerCase() === 'b') {
          e.preventDefault();
          handleInsertMarkdown('**', '**', '重点文本');
        } else if (isMod && !e.shiftKey && e.key.toLowerCase() === 'i') {
          e.preventDefault();
          handleInsertMarkdown('*', '*', '斜体文本');
        } else if (isMod && !e.shiftKey && e.key.toLowerCase() === 'e') {
          e.preventDefault();
          handleInsertMarkdown('`', '`', 'code');
        } else if (isMod && e.shiftKey && e.key.toLowerCase() === 'c') {
          e.preventDefault();
          handleInsertMarkdown('\n```cpp\n', '\n```\n', '// C++ 核心逻辑\nclass Solution {\npublic:\n    // ...\n};');
        } else if (isMod && e.shiftKey && e.key.toLowerCase() === 'l') {
          e.preventDefault();
          handleInsertMarkdown('\n- [ ] ', '', '待办清单事项');
        } else if (isMod && !e.shiftKey && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          handleInsertMarkdown('[', '](https://)', '链接标题');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, handleCloseWithFlush, handleManualSave, handleInsertMarkdown]);

  // Append new blank line/block at the bottom of the document
  const handleAppendNewBlock = useCallback(() => {
    commitActiveBlock();
    const cur = contentRef.current;
    const newContent = cur ? `${cur.trimEnd()}\n` : '';
    setContent(newContent);
    contentRef.current = newContent;
    scheduleAutoSave(newContent);

    setTimeout(() => {
      const newBlocks = parseToBlocks(newContent);
      const last = newBlocks[newBlocks.length - 1];
      if (last) {
        setActiveBlockId(last.id);
        activeBlockIdRef.current = last.id;
        setActiveBlockRaw('');
        activeBlockRawRef.current = '';
      }
      if (canvasRef.current) {
        canvasRef.current.scrollTop = canvasRef.current.scrollHeight;
      }
    }, 10);
  }, [commitActiveBlock, scheduleAutoSave]);

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
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]">
                    {currentProblem.category || currentProblem.topic}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                <Sparkles size={12} className="text-amber-500 shrink-0" />
                <span>Typora / Obsidian 实时所见即所得渲染 · 点击任意块即可原地编辑</span>
              </p>
            </div>
          </div>

          {/* Close button with synchronous flush */}
          <button
            type="button"
            onClick={handleCloseWithFlush}
            className="p-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-150 cursor-pointer shrink-0"
            title="关闭 (Esc 自动保存)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Toolbar: Markdown Quick Insert Format Buttons + Live Auto-Save Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 px-0.5 shrink-0">
          {/* Quick Markdown Formatting Shortcut Buttons */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-white/10 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleInsertMarkdown('**', '**', '重点文本')}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-100 active:scale-[0.96] cursor-pointer"
              title="粗体 (Ctrl+B)"
            >
              <Bold size={13} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleInsertMarkdown('*', '*', '斜体文本')}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-100 active:scale-[0.96] cursor-pointer"
              title="斜体 (Ctrl+I)"
            >
              <Italic size={13} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleInsertMarkdown('`', '`', 'code')}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-100 active:scale-[0.96] cursor-pointer"
              title="行内代码 (Ctrl+E)"
            >
              <Code size={13} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleInsertMarkdown('\n```cpp\n', '\n```\n', '// C++ 优化实现\nclass Solution {\npublic:\n    // ...\n};')}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-100 active:scale-[0.96] cursor-pointer"
              title="C++ 代码块 (Ctrl+Shift+C)"
            >
              <FileCode2 size={13} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleInsertMarkdown('\n- [ ] ', '', '待办清单事项')}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-100 active:scale-[0.96] cursor-pointer"
              title="待办清单 (Ctrl+Shift+L)"
            >
              <ListCheck size={13} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleInsertMarkdown('\n> ', '', '解题心得与模式总结')}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-100 active:scale-[0.96] cursor-pointer"
              title="引用块 (> )"
            >
              <Quote size={13} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleInsertMarkdown('[', '](https://)', '链接说明')}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-100 active:scale-[0.96] cursor-pointer"
              title="插入链接 (Ctrl+K)"
            >
              <Link2 size={13} />
            </button>
          </div>

          {/* Real-time Save Status & Meta Info */}
          <div className="flex items-center gap-2.5 ml-auto">
            {saveStatus === 'saving' ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 animate-pulse">
                <Clock size={12} className="animate-spin" />
                <span>编辑中...</span>
              </span>
            ) : saveStatus === 'saved' ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check size={12} className="stroke-[2.5]" />
                <span>已自动保存 {lastSavedTime}</span>
              </span>
            ) : initialNote?.updatedAt ? (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={11} />
                <span>更新于 {formatTimestamp(initialNote.updatedAt)}</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400">新便签</span>
            )}
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">{content.length} 字</span>
          </div>
        </div>

        {/* Unified Typora / Obsidian Single-Canvas Paper Surface */}
        <div
          ref={canvasRef}
          onClick={(e) => {
            // If user clicked the blank canvas outside of any block
            if (e.target === canvasRef.current) {
              handleAppendNewBlock();
            }
          }}
          className="relative flex-1 min-h-[280px] sm:min-h-[340px] max-h-[58vh] overflow-y-auto p-4 sm:p-6 rounded-2xl bg-[#f8fafc]/90 dark:bg-[#0c0f16]/90 border border-slate-200/70 dark:border-white/[0.08] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)] select-text leading-relaxed space-y-2 cursor-text"
        >
          {blocks.map((block) => {
            const isActive = activeBlockId === block.id;

            // When Active: in-place textarea for direct editing without layout shifts
            if (isActive) {
              return (
                <div key={block.id} className="relative group my-1.5">
                  <textarea
                    ref={textareaRef}
                    value={activeBlockRaw}
                    onChange={(e) => {
                      const val = e.target.value;
                      setActiveBlockRaw(val);
                      activeBlockRawRef.current = val;
                      autoResizeTextarea();
                      const updatedDoc = assembleContent(blocksRef.current, block.id, val);
                      contentRef.current = updatedDoc;
                      scheduleAutoSave(updatedDoc);
                    }}
                    onKeyDown={handleActiveTextareaKeyDown}
                    onBlur={() => {
                      commitActiveBlock();
                    }}
                    placeholder="在此键入 Markdown 内容..."
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-mono leading-relaxed border-2 border-amber-500/80 dark:border-amber-400/80 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)] focus:outline-hidden transition-all resize-none select-text"
                  />
                  <div className="absolute right-2.5 bottom-2 pointer-events-none flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50/90 dark:bg-amber-950/80 px-1.5 py-0.5 rounded shadow-xs">
                    <span>编辑中 · Tab 缩进</span>
                  </div>
                </div>
              );
            }

            // When Inactive: In-place rich Markdown rendering
            switch (block.type) {
              case 'h1':
                return (
                  <h1
                    key={block.id}
                    onClick={() => activateBlock(block)}
                    className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-800 pb-2 mb-2 hover:bg-amber-500/5 transition-colors cursor-text rounded-lg px-1.5 -mx-1.5"
                    title="点击在原地编辑标题"
                  >
                    {renderInlineContent(block.headingText || '')}
                  </h1>
                );
              case 'h2':
                return (
                  <h2
                    key={block.id}
                    onClick={() => activateBlock(block)}
                    className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mt-3 mb-1.5 hover:bg-amber-500/5 transition-colors cursor-text rounded-lg px-1.5 -mx-1.5"
                    title="点击在原地编辑标题"
                  >
                    {renderInlineContent(block.headingText || '')}
                  </h2>
                );
              case 'h3':
                return (
                  <h3
                    key={block.id}
                    onClick={() => activateBlock(block)}
                    className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 mt-2.5 mb-1 hover:bg-amber-500/5 transition-colors cursor-text rounded-lg px-1.5 -mx-1.5"
                    title="点击在原地编辑标题"
                  >
                    {renderInlineContent(block.headingText || '')}
                  </h3>
                );
              case 'h4':
              case 'h5':
              case 'h6':
                return (
                  <h4
                    key={block.id}
                    onClick={() => activateBlock(block)}
                    className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-2 mb-1 hover:bg-amber-500/5 transition-colors cursor-text rounded-lg px-1.5 -mx-1.5"
                    title="点击在原地编辑标题"
                  >
                    {renderInlineContent(block.headingText || '')}
                  </h4>
                );
              case 'code':
                return (
                  <div
                    key={block.id}
                    onClick={() => activateBlock(block)}
                    className="relative group cursor-pointer"
                    title="点击直接编辑 C++ 代码"
                  >
                    <CodeBlock
                      code={block.codeText || ''}
                      language={block.codeLang || 'cpp'}
                      maxHeight="max-h-[320px]"
                    />
                    <div className="absolute top-3 right-28 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 pointer-events-none">
                      点击编辑代码
                    </div>
                  </div>
                );
              case 'checklist':
                return (
                  <div
                    key={block.id}
                    className="flex items-start gap-2.5 my-1.5 group rounded-lg px-1.5 -mx-1.5 py-0.5 hover:bg-amber-500/5 transition-colors"
                  >
                    {/* Interactive Checkbox toggleable directly without opening edit mode */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleChecklist(block);
                      }}
                      className={`inline-flex items-center justify-center w-4 h-4 mt-0.5 rounded-md shrink-0 transition-all cursor-pointer ${
                        block.checked
                          ? 'bg-emerald-500 text-white shadow-[0_1px_2px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]'
                          : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-amber-500 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]'
                      }`}
                      title={block.checked ? '标记为未完成' : '标记为已完成'}
                    >
                      {block.checked && <Check size={11} strokeWidth={3} />}
                    </button>
                    <div
                      onClick={() => activateBlock(block)}
                      className={`flex-1 text-xs sm:text-sm cursor-text leading-relaxed select-text ${
                        block.checked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                      }`}
                      title="点击编辑清单文字"
                    >
                      {renderInlineContent(block.checkText || '')}
                    </div>
                  </div>
                );
              case 'quote':
                return (
                  <blockquote
                    key={block.id}
                    onClick={() => activateBlock(block)}
                    className="my-2 py-2 px-3.5 border-l-4 border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-r-xl text-xs sm:text-sm shadow-[inset_1px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)] space-y-1 cursor-text hover:bg-amber-500/10 transition-colors"
                    title="点击在原地编辑引用"
                  >
                    {(block.quoteLines || []).map((line, lIdx) => (
                      <p key={lIdx} className="leading-relaxed">
                        {renderInlineContent(line)}
                      </p>
                    ))}
                  </blockquote>
                );
              case 'list':
                return (
                  <div
                    key={block.id}
                    onClick={() => activateBlock(block)}
                    className="my-1.5 pl-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:bg-amber-500/5 transition-colors rounded-lg px-1.5 -mx-1.5 py-0.5 cursor-text"
                    title="点击编辑列表"
                  >
                    {block.listType === 'ol' ? (
                      <ol className="list-decimal space-y-1">
                        {(block.listItems || []).map((item, itemIdx) => (
                          <li key={itemIdx}>{renderInlineContent(item)}</li>
                        ))}
                      </ol>
                    ) : (
                      <ul className="list-disc space-y-1">
                        {(block.listItems || []).map((item, itemIdx) => (
                          <li key={itemIdx}>{renderInlineContent(item)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              case 'table': {
                const headers = block.tableHeaders || [];
                const rows = block.tableRows || [];
                const alignments = block.tableAlignments || [];
                const getAlignClass = (align?: 'left' | 'center' | 'right') => {
                  if (align === 'center') return 'text-center';
                  if (align === 'right') return 'text-right';
                  return 'text-left';
                };
                return (
                  <div
                    key={block.id}
                    onClick={() => activateBlock(block)}
                    className="my-3 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[2px_2px_8px_rgba(0,0,0,0.04),inset_1px_1px_2px_rgba(255,255,255,0.7)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] cursor-pointer hover:border-amber-400 transition-colors"
                    title="点击直接编辑表格 Markdown"
                  >
                    <table className="w-full text-left text-xs border-collapse">
                      {headers.length > 0 && (
                        <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold">
                          <tr>
                            {headers.map((h, hIdx) => (
                              <th
                                key={hIdx}
                                className={`px-3.5 py-2 border-r last:border-r-0 border-slate-200 dark:border-slate-800 whitespace-nowrap ${getAlignClass(alignments[hIdx])}`}
                              >
                                {renderInlineContent(h)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                        {rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-3.5 py-1.5 border-r last:border-r-0 border-slate-100 dark:border-slate-800/60 ${getAlignClass(alignments[cIdx])}`}
                              >
                                {renderInlineContent(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              case 'hr':
                return (
                  <hr
                    key={block.id}
                    onClick={() => activateBlock(block)}
                    className="my-3 border-t border-slate-200 dark:border-slate-800 cursor-pointer hover:border-amber-400 transition-colors"
                    title="点击编辑分割线"
                  />
                );
              case 'empty':
                return (
                  <div
                    key={block.id}
                    onClick={() => activateBlock(block)}
                    className="h-4 my-1 cursor-text hover:bg-amber-500/5 rounded transition-colors"
                    title="点击在此键入"
                  />
                );
              case 'p':
              default:
                return (
                  <p
                    key={block.id}
                    onClick={() => activateBlock(block)}
                    className="my-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed cursor-text hover:bg-amber-500/5 transition-colors rounded-lg px-1.5 -mx-1.5 py-0.5 select-text"
                    title="点击在原地编辑段落"
                  >
                    {renderInlineContent(block.raw)}
                  </p>
                );
            }
          })}

          {/* Quick Click-to-Append New Line / Block at the Canvas Bottom */}
          <div
            onClick={handleAppendNewBlock}
            className="mt-4 pt-3 pb-2 border-t border-dashed border-slate-200/80 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer select-none rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
            title="点击在此处继续书写新行"
          >
            <Plus size={13} />
            <span>点击在此继续键入 Markdown...</span>
          </div>
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

          {/* Right actions: Shortcut prompt, Complete Exit, Immediate Save */}
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' ? (
              <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                <Clock size={12} className="animate-spin" />
                <span>800ms 自动保存中...</span>
              </span>
            ) : (
              <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono pr-1">
                Ctrl + S 保存 · 800ms 自动保存
              </span>
            )}

            <button
              type="button"
              onClick={handleCloseWithFlush}
              className="px-3.5 py-1.5 rounded-2xl text-xs font-semibold bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-150 cursor-pointer"
            >
              完成退出
            </button>

            <button
              type="button"
              onClick={handleManualSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[3px_3px_8px_rgba(245,158,11,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_8px_rgba(245,158,11,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-150 cursor-pointer"
            >
              <Save size={13} />
              <span>{isManualSavedFeedback ? '已保存!' : '立即保存'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

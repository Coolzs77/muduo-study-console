import React, { useMemo } from 'react';
import { ExternalLink, Check } from 'lucide-react';
import { CodeBlock } from '../common/CodeBlock';

export interface MarkdownViewProps {
  content: string;
  variant?: 'article' | 'note';
  className?: string;
  emptyPlaceholder?: React.ReactNode;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({
  content,
  variant = 'article',
  className = '',
  emptyPlaceholder = null
}) => {
  // Parse markdown into structured blocks
  const blocks = useMemo(() => {
    if (!content || !content.trim()) return [];

    const lines = content.split('\n');
    const result: Array<{
      type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'code' | 'quote' | 'ul' | 'ol' | 'checklist' | 'table' | 'hr' | 'img';
      text?: string;
      src?: string;
      id?: string;
      lang?: string;
      items?: string[];
      checkItems?: Array<{ checked: boolean; text: string }>;
      headers?: string[];
      alignments?: ('left' | 'center' | 'right')[];
      rows?: string[][];
    }> = [];

    let inCode = false;
    let codeBuffer: string[] = [];
    let codeLang = '';
    let inList = false;
    let listType: 'ul' | 'ol' = 'ul';
    let listBuffer: string[] = [];
    let inChecklist = false;
    let checklistBuffer: Array<{ checked: boolean; text: string }> = [];

    const flushList = () => {
      if (inList && listBuffer.length > 0) {
        result.push({ type: listType, items: [...listBuffer] });
        listBuffer = [];
        inList = false;
      }
    };

    const flushChecklist = () => {
      if (inChecklist && checklistBuffer.length > 0) {
        result.push({ type: 'checklist', checkItems: [...checklistBuffer] });
        checklistBuffer = [];
        inChecklist = false;
      }
    };

    const flushAllLists = () => {
      flushList();
      flushChecklist();
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith('```')) {
        flushAllLists();
        if (inCode) {
          result.push({
            type: 'code',
            text: codeBuffer.join('\n'),
            lang: codeLang || 'cpp'
          });
          codeBuffer = [];
          codeLang = '';
          inCode = false;
        } else {
          inCode = true;
          codeLang = line.slice(3).trim();
        }
        continue;
      }

      if (inCode) {
        codeBuffer.push(line);
        continue;
      }

      // Horizontal rule: ---, ***, ___
      if (/^(?:---+|\*\*\*+|___+)$/.test(line.trim())) {
        flushAllLists();
        result.push({ type: 'hr' });
        continue;
      }

      // Images: ![alt](url)
      const imgMatch = line.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        flushAllLists();
        result.push({ type: 'img', text: imgMatch[1], src: imgMatch[2] });
        continue;
      }

      // Tables: header row with '|' followed by delimiter row
      if (line.includes('|') && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        const delimParts = nextLine.split('|').map(s => s.trim()).filter(Boolean);
        const isTable = delimParts.length > 0 && delimParts.every(p => /^:?-+:?$/.test(p));
        if (isTable) {
          flushAllLists();
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
          i += 2;
          while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
            rows.push(parseRow(lines[i]));
            i++;
          }
          i--; // compensate for loop i++
          result.push({ type: 'table', headers, alignments, rows });
          continue;
        }
      }

      // Headings (H1 to H6)
      if (line.startsWith('###### ')) {
        flushAllLists();
        const text = line.slice(7).trim();
        const id = 'heading-' + text.toLowerCase().replace(/[^\w一-龥]+/g, '-');
        result.push({ type: 'h6', text, id });
        continue;
      }
      if (line.startsWith('##### ')) {
        flushAllLists();
        const text = line.slice(6).trim();
        const id = 'heading-' + text.toLowerCase().replace(/[^\w一-龥]+/g, '-');
        result.push({ type: 'h5', text, id });
        continue;
      }
      if (line.startsWith('#### ')) {
        flushAllLists();
        const text = line.slice(5).trim();
        const id = 'heading-' + text.toLowerCase().replace(/[^\w一-龥]+/g, '-');
        result.push({ type: 'h4', text, id });
        continue;
      }
      if (line.startsWith('### ')) {
        flushAllLists();
        const text = line.slice(4).trim();
        const id = 'heading-' + text.toLowerCase().replace(/[^\w一-龥]+/g, '-');
        result.push({ type: 'h3', text, id });
        continue;
      }
      if (line.startsWith('## ')) {
        flushAllLists();
        const text = line.slice(3).trim();
        const id = 'heading-' + text.toLowerCase().replace(/[^\w一-龥]+/g, '-');
        result.push({ type: 'h2', text, id });
        continue;
      }
      if (line.startsWith('# ')) {
        flushAllLists();
        const text = line.slice(2).trim();
        const id = 'heading-' + text.toLowerCase().replace(/[^\w一-龥]+/g, '-');
        result.push({ type: 'h1', text, id });
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        flushAllLists();
        result.push({ type: 'quote', text: line.slice(2).trim() });
        continue;
      }

      // Checklists: - [ ] or - [x] or * [ ] or * [x]
      const checklistMatch = line.match(/^[-*+]\s+\[([ xX])\]\s*(.*)$/);
      if (checklistMatch) {
        flushList();
        if (!inChecklist) {
          inChecklist = true;
          checklistBuffer = [];
        }
        checklistBuffer.push({
          checked: checklistMatch[1].toLowerCase() === 'x',
          text: checklistMatch[2]
        });
        continue;
      }

      // Unordered Lists
      if (/^[-*+]\s+/.test(line)) {
        flushChecklist();
        if (!inList || listType !== 'ul') {
          flushList();
          inList = true;
          listType = 'ul';
        }
        listBuffer.push(line.replace(/^[-*+]\s+/, '').trim());
        continue;
      }

      // Ordered Lists
      if (/^\d+\.\s+/.test(line)) {
        flushChecklist();
        if (!inList || listType !== 'ol') {
          flushList();
          inList = true;
          listType = 'ol';
        }
        listBuffer.push(line.replace(/^\d+\.\s+/, '').trim());
        continue;
      }

      // Empty line
      if (line.trim() === '') {
        flushAllLists();
        continue;
      }

      // Regular paragraph
      flushAllLists();
      result.push({ type: 'p', text: line });
    }

    flushAllLists();
    if (inCode && codeBuffer.length > 0) {
      result.push({
        type: 'code',
        text: codeBuffer.join('\n'),
        lang: codeLang || 'cpp'
      });
    }

    return result;
  }, [content]);

  // Inline formatting helper supporting code, bold, italic, strikethrough, links
  const renderInline = (str: string): React.ReactNode => {
    if (!str) return null;

    // First isolate inline code spans: `code`
    const codeParts = str.split(/(`[^`]+`)/g);

    return codeParts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
        return (
          <code
            key={idx}
            className="inline-code font-mono text-[12px] bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_1px_rgba(0,0,0,0.3)]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Non-code formatting: Links, bold, strikethrough, italic
      const formatRegex = /(\[[^\]]+\]\([^\)]+\)|\*\*[^*]+\*\*|~~[^~]+~~|\*(?:[^*\n]+?)\*|_(?:[^_\n]+?)_)/g;
      const subParts = part.split(formatRegex);

      return subParts.map((sub, sIdx) => {
        if (!sub) return null;
        const key = `${idx}-${sIdx}`;

        // Link: [text](url)
        const linkMatch = sub.match(/^\[(.*?)\]\(([^\s\)]+)\)$/);
        if (linkMatch) {
          const linkText = linkMatch[1];
          const linkUrl = linkMatch[2];
          const isExternal = linkUrl.startsWith('http://') || linkUrl.startsWith('https://');
          return (
            <a
              key={key}
              href={linkUrl}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-0.5 text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              <span>{linkText}</span>
              {isExternal && <ExternalLink size={11} className="inline ml-0.5 opacity-70" />}
            </a>
          );
        }

        // Bold: **text**
        if (sub.startsWith('**') && sub.endsWith('**') && sub.length >= 4) {
          return (
            <strong key={key} className="font-bold text-slate-900 dark:text-white">
              {sub.slice(2, -2)}
            </strong>
          );
        }

        // Strikethrough: ~~text~~
        if (sub.startsWith('~~') && sub.endsWith('~~') && sub.length >= 4) {
          return (
            <del key={key} className="line-through text-slate-400 dark:text-slate-500">
              {sub.slice(2, -2)}
            </del>
          );
        }

        // Italic: *text* or _text_
        if ((sub.startsWith('*') && sub.endsWith('*') && sub.length >= 2) ||
            (sub.startsWith('_') && sub.endsWith('_') && sub.length >= 2)) {
          return (
            <em key={key} className="italic text-slate-800 dark:text-slate-200">
              {sub.slice(1, -1)}
            </em>
          );
        }

        return sub;
      });
    });
  };

  if (!content || !content.trim()) {
    return emptyPlaceholder ? <>{emptyPlaceholder}</> : null;
  }

  const isNote = variant === 'note';

  return (
    <article className={`${isNote ? 'note-markdown' : 'reading-content'} max-w-none ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h1':
            return (
              <h1
                key={idx}
                id={block.id}
                className={
                  isNote
                    ? 'text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-3 mb-2 pb-1 border-b border-slate-200/60 dark:border-slate-800 scroll-mt-24'
                    : 'scroll-mt-24'
                }
              >
                {renderInline(block.text || '')}
              </h1>
            );
          case 'h2':
            return (
              <h2
                key={idx}
                id={block.id}
                className={
                  isNote
                    ? 'text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mt-2.5 mb-1.5 pb-0.5 border-b border-slate-200/40 dark:border-slate-800/60 scroll-mt-24'
                    : 'scroll-mt-24'
                }
              >
                {renderInline(block.text || '')}
              </h2>
            );
          case 'h3':
            return (
              <h3
                key={idx}
                id={block.id}
                className={
                  isNote
                    ? 'text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-2 mb-1 scroll-mt-24'
                    : 'scroll-mt-24'
                }
              >
                {renderInline(block.text || '')}
              </h3>
            );
          case 'h4':
            return (
              <h4
                key={idx}
                id={block.id}
                className={
                  isNote
                    ? 'text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5 mb-1 scroll-mt-24'
                    : 'font-bold text-base mt-4 mb-2 scroll-mt-24 text-slate-800 dark:text-slate-200'
                }
              >
                {renderInline(block.text || '')}
              </h4>
            );
          case 'h5':
          case 'h6':
            return (
              <h5
                key={idx}
                id={block.id}
                className="font-bold text-xs mt-2 mb-1 scroll-mt-24 text-slate-700 dark:text-slate-300"
              >
                {renderInline(block.text || '')}
              </h5>
            );
          case 'p':
            return (
              <p
                key={idx}
                className={isNote ? 'my-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed' : undefined}
              >
                {renderInline(block.text || '')}
              </p>
            );
          case 'quote':
            return (
              <blockquote
                key={idx}
                className={
                  isNote
                    ? 'my-2 py-1.5 px-3 border-l-4 border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-r-xl text-xs sm:text-sm shadow-[inset_1px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]'
                    : undefined
                }
              >
                {renderInline(block.text || '')}
              </blockquote>
            );
          case 'code':
            return (
              <CodeBlock
                key={idx}
                code={block.text || ''}
                language={block.lang || 'cpp'}
                maxHeight={isNote ? 'max-h-[340px]' : 'max-h-[600px]'}
              />
            );
          case 'checklist':
            return (
              <ul key={idx} className="my-2 space-y-1.5 list-none pl-0">
                {(block.checkItems || []).map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span
                      className={`inline-flex items-center justify-center w-4 h-4 mt-0.5 rounded-md shrink-0 transition-colors ${
                        item.checked
                          ? 'bg-emerald-500 text-white shadow-[0_1px_2px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]'
                          : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]'
                      }`}
                    >
                      {item.checked ? <Check size={11} strokeWidth={3} /> : null}
                    </span>
                    <span className={item.checked ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                      {renderInline(item.text)}
                    </span>
                  </li>
                ))}
              </ul>
            );
          case 'ul':
            return (
              <ul
                key={idx}
                className={isNote ? 'my-1.5 space-y-1 pl-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc' : undefined}
              >
                {(block.items || []).map((item, itemIdx) => (
                  <li key={itemIdx}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol
                key={idx}
                className={isNote ? 'my-1.5 space-y-1 pl-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-decimal' : undefined}
              >
                {(block.items || []).map((item, itemIdx) => (
                  <li key={itemIdx}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          case 'hr':
            return (
              <hr
                key={idx}
                className={isNote ? 'my-3 border-slate-200 dark:border-slate-800' : 'my-8 border-slate-200 dark:border-slate-800'}
              />
            );
          case 'table': {
            const headers = block.headers || [];
            const rows = block.rows || [];
            const alignments = block.alignments || [];
            const getAlignClass = (align?: 'left' | 'center' | 'right') => {
              if (align === 'center') return 'text-center';
              if (align === 'right') return 'text-right';
              return 'text-left';
            };
            return (
              <div
                key={idx}
                className={`${
                  isNote ? 'my-3' : 'my-6'
                } overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[4px_4px_12px_rgba(0,0,0,0.06),inset_1px_1px_2px_rgba(255,255,255,0.7)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.3)]`}
              >
                <table className="w-full text-left text-xs border-collapse">
                  {headers.length > 0 && (
                    <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold">
                      <tr>
                        {headers.map((h, hIdx) => (
                          <th
                            key={hIdx}
                            className={`px-4 py-2.5 border-r last:border-r-0 border-slate-200 dark:border-slate-800 whitespace-nowrap ${getAlignClass(
                              alignments[hIdx]
                            )}`}
                          >
                            {renderInline(h)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    {rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-4 py-2 border-r last:border-r-0 border-slate-100 dark:border-slate-800/60 ${getAlignClass(
                              alignments[cIdx]
                            )}`}
                          >
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          case 'img':
            return (
              <figure key={idx} className={`${isNote ? 'my-3' : 'my-6'} text-center`}>
                <img
                  src={block.src}
                  alt={block.text || '技术解析图'}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[4px_4px_12px_rgba(0,0,0,0.06),inset_1px_1px_2px_rgba(255,255,255,0.7)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)] max-w-full mx-auto"
                  loading="lazy"
                />
                {block.text && (
                  <figcaption className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    {block.text}
                  </figcaption>
                )}
              </figure>
            );
          default:
            return null;
        }
      })}
    </article>
  );
};

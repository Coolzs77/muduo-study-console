import React, { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { CodeBlock } from '../common/CodeBlock';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  // Parse markdown into blocks
  const blocks = useMemo(() => {
    if (!content) return [];

    const lines = content.split('\n');
    const result: Array<{
      type: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'code' | 'quote' | 'ul' | 'ol' | 'table' | 'hr' | 'img';
      text?: string;
      src?: string;
      id?: string;
      lang?: string;
      items?: string[];
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

    const flushList = () => {
      if (inList && listBuffer.length > 0) {
        result.push({ type: listType, items: [...listBuffer] });
        listBuffer = [];
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith('```')) {
        flushList();
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

      // Horizontal rule
      if (/^---+$/.test(line.trim())) {
        flushList();
        result.push({ type: 'hr' });
        continue;
      }

      // Images
      const imgMatch = line.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        flushList();
        result.push({ type: 'img', text: imgMatch[1], src: imgMatch[2] });
        continue;
      }

      // Tables: header row with '|' followed by delimiter row
      if (line.includes('|') && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        const delimParts = nextLine.split('|').map(s => s.trim()).filter(Boolean);
        const isTable = delimParts.length > 0 && delimParts.every(p => /^:?-+:?$/.test(p));
        if (isTable) {
          flushList();
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

      // Headings
      if (line.startsWith('#### ')) {
        flushList();
        const text = line.slice(5).trim();
        const id = 'heading-' + text.toLowerCase().replace(/[^\w一-龥]+/g, '-');
        result.push({ type: 'h4', text, id });
        continue;
      }
      if (line.startsWith('### ')) {
        flushList();
        const text = line.slice(4).trim();
        const id = 'heading-' + text.toLowerCase().replace(/[^\w一-龥]+/g, '-');
        result.push({ type: 'h3', text, id });
        continue;
      }
      if (line.startsWith('## ')) {
        flushList();
        const text = line.slice(3).trim();
        const id = 'heading-' + text.toLowerCase().replace(/[^\w一-龥]+/g, '-');
        result.push({ type: 'h2', text, id });
        continue;
      }
      if (line.startsWith('# ')) {
        flushList();
        const text = line.slice(2).trim();
        const id = 'heading-' + text.toLowerCase().replace(/[^\w一-龥]+/g, '-');
        result.push({ type: 'h1', text, id });
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        flushList();
        result.push({ type: 'quote', text: line.slice(2).trim() });
        continue;
      }

      // Lists
      if (/^[-*+]\s+/.test(line)) {
        if (!inList || listType !== 'ul') {
          flushList();
          inList = true;
          listType = 'ul';
        }
        listBuffer.push(line.replace(/^[-*+]\s+/, '').trim());
        continue;
      }

      if (/^\d+\.\s+/.test(line)) {
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
        flushList();
        continue;
      }

      // Regular paragraph
      flushList();
      result.push({ type: 'p', text: line });
    }

    flushList();
    if (inCode && codeBuffer.length > 0) {
      result.push({
        type: 'code',
        text: codeBuffer.join('\n'),
        lang: codeLang || 'cpp'
      });
    }

    return result;
  }, [content]);

  // Inline formatting helper
  const renderInline = (str: string) => {
    if (!str) return null;

    // Handle inline code: `code`
    const parts = str.split(/(`[^`]+`)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
        return (
          <code
            key={idx}
            className="inline-code font-mono text-[13px] bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Bold: **text**
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length > 3) {
          return (
            <strong key={`${idx}-${bIdx}`} className="font-bold text-slate-900 dark:text-white">
              {bPart.slice(2, -2)}
            </strong>
          );
        }

        // Links: [text](url)
        const linkMatch = bPart.match(/\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/);
        if (linkMatch) {
          const before = bPart.slice(0, linkMatch.index);
          const linkText = linkMatch[1];
          const linkUrl = linkMatch[2];
          const after = bPart.slice((linkMatch.index || 0) + linkMatch[0].length);

          return (
            <React.Fragment key={`${idx}-${bIdx}`}>
              {before}
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-sky-600 dark:text-sky-400 hover:underline font-medium"
              >
                <span>{linkText}</span>
                <ExternalLink size={11} className="inline ml-0.5 opacity-70" />
              </a>
              {after}
            </React.Fragment>
          );
        }

        return bPart;
      });
    });
  };

  return (
    <article className="reading-content max-w-none">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h1':
            return (
              <h1 key={idx} id={block.id} className="scroll-mt-24">
                {renderInline(block.text || '')}
              </h1>
            );
          case 'h2':
            return (
              <h2 key={idx} id={block.id} className="scroll-mt-24">
                {renderInline(block.text || '')}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={idx} id={block.id} className="scroll-mt-24">
                {renderInline(block.text || '')}
              </h3>
            );
          case 'h4':
            return (
              <h4 key={idx} id={block.id} className="font-bold text-base mt-4 mb-2 scroll-mt-24 text-slate-800 dark:text-slate-200">
                {renderInline(block.text || '')}
              </h4>
            );
          case 'p':
            return <p key={idx}>{renderInline(block.text || '')}</p>;
          case 'quote':
            return <blockquote key={idx}>{renderInline(block.text || '')}</blockquote>;
          case 'code':
            return <CodeBlock key={idx} code={block.text || ''} language={block.lang || 'cpp'} />;
          case 'ul':
            return (
              <ul key={idx}>
                {(block.items || []).map((item, itemIdx) => (
                  <li key={itemIdx}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={idx}>
                {(block.items || []).map((item, itemIdx) => (
                  <li key={itemIdx}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          case 'hr':
            return <hr key={idx} className="my-8 border-slate-200 dark:border-slate-800" />;
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
              <div key={idx} className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  {headers.length > 0 && (
                    <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold">
                      <tr>
                        {headers.map((h, hIdx) => (
                          <th
                            key={hIdx}
                            className={`px-4 py-3 border-r last:border-r-0 border-slate-200 dark:border-slate-800 whitespace-nowrap ${getAlignClass(alignments[hIdx])}`}
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
                            className={`px-4 py-2.5 border-r last:border-r-0 border-slate-100 dark:border-slate-800/60 ${getAlignClass(alignments[cIdx])}`}
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
              <figure key={idx} className="my-6 text-center">
                <img
                  src={block.src}
                  alt={block.text || '架构与技术图'}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-full mx-auto"
                  loading="lazy"
                />
                {block.text && (
                  <figcaption className="text-xs text-slate-500 dark:text-slate-400 mt-2">
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

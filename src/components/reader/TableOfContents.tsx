import React, { useEffect, useState, useRef } from 'react';
import { AlignLeft } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!content) {
      setHeadings([]);
      return;
    }

    const lines = content.split('\n');
    const items: TOCItem[] = [];

    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        const text = line.slice(3).trim();
        const id = 'heading-' + text.toLowerCase().replace(/[^\w一-龥]+/g, '-');
        items.push({ id, text, level: 2 });
      } else if (line.startsWith('### ')) {
        const text = line.slice(4).trim();
        const id = 'heading-' + text.toLowerCase().replace(/[^\w一-龥]+/g, '-');
        items.push({ id, text, level: 3 });
      }
    });

    setHeadings(items);
    if (items.length > 0) {
      setActiveId(items[0].id);
    }
  }, [content]);

  // Scroll spy effect: sync active heading from reading article body
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -60% 0%',
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Auto-scroll TOC container so the active item always stays in viewport
  useEffect(() => {
    if (!activeId) return;
    const activeEl = document.getElementById(`toc-item-${activeId}`);
    if (activeEl && navRef.current) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [activeId]);

  if (headings.length === 0) return null;

  return (
    <nav
      ref={navRef}
      className="w-64 shrink-0 self-start hidden xl:flex flex-col sticky top-18 h-[calc(100vh-5.5rem)] overflow-y-auto p-4 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[6px_6px_14px_rgba(0,0,0,0.06),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-xs select-none scrollbar-thin"
    >
      <div className="shrink-0 flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-amber-100/90 dark:bg-amber-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-amber-600 dark:text-amber-400">
          <AlignLeft size={13} />
        </div>
        <span>本篇大纲</span>
      </div>
      <ul className="space-y-1 flex-1 min-h-0">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li
              key={h.id}
              id={`toc-item-${h.id}`}
              style={{ paddingLeft: h.level === 3 ? '0.75rem' : '0rem' }}
            >
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(h.id);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    setActiveId(h.id);
                  }
                }}
                className={`block py-1.5 px-2.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] leading-snug truncate cursor-pointer active:scale-x-105 active:scale-y-90 ${
                  isActive
                    ? 'bg-white/90 dark:bg-slate-800/90 text-amber-700 dark:text-amber-300 font-bold shadow-[2px_2px_5px_rgba(0,0,0,0.05),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)] -translate-y-0.5'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
                title={h.text}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

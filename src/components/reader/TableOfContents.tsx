import React, { useEffect, useState } from 'react';
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

  // Scroll spy effect
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

  if (headings.length === 0) return null;

  return (
    <nav className="w-64 shrink-0 hidden xl:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pl-4 border-l border-slate-200 dark:border-slate-800 text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
        <AlignLeft size={13} className="text-sky-600 dark:text-sky-400" />
        <span>本章大纲导览</span>
      </div>
      <ul className="space-y-1.5">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li
              key={h.id}
              style={{ paddingLeft: h.level === 3 ? '1rem' : '0rem' }}
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
                className={`block py-1 transition-colors leading-snug truncate ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
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

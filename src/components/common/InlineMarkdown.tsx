import React from 'react';

interface InlineMarkdownProps {
  text?: string | null;
  className?: string;
}

export const InlineMarkdown: React.FC<InlineMarkdownProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split by inline code `...` and bold **...**
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (!part) return null;

        if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
          const codeContent = part.slice(1, -1);
          return (
            <code
              key={idx}
              className="px-1.5 py-0.5 mx-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-mono text-[12px] font-semibold border border-slate-200/90 dark:border-slate-700/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)] inline-block align-baseline break-all transition-colors"
            >
              {codeContent}
            </code>
          );
        }

        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          const boldContent = part.slice(2, -2);
          return (
            <strong key={idx} className="font-bold text-slate-900 dark:text-slate-100">
              <InlineMarkdown text={boldContent} />
            </strong>
          );
        }

        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
};

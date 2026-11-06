import React, { useState, useMemo } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import hljs from 'highlight.js';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  maxHeight?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'cpp',
  title,
  className = '',
  maxHeight = 'max-h-[600px]'
}) => {
  const [copied, setCopied] = useState(false);

  const cleanLang = useMemo(() => {
    const raw = (language || '').toLowerCase().trim();
    if (raw === 'c++') return 'cpp';
    if (raw === 'sh' || raw === 'shell') return 'bash';
    if (raw === 'js') return 'javascript';
    if (raw === 'ts') return 'typescript';
    if (raw === 'py') return 'python';
    return raw || 'cpp';
  }, [language]);

  const highlightedHtml = useMemo(() => {
    if (!code) return '';
    try {
      if (hljs.getLanguage(cleanLang)) {
        return hljs.highlight(code, { language: cleanLang, ignoreIllegals: true }).value;
      }
      return hljs.highlightAuto(code).value;
    } catch {
      // Fallback escape
      return code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  }, [code, cleanLang]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`my-3 rounded-xl overflow-hidden border border-slate-200 dark:border-[#2b2b2b] bg-white dark:bg-[#1f1f1f] text-slate-800 dark:text-[#cccccc] shadow-2xs text-[13px] font-mono ${className}`}>
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 dark:bg-[#181818] border-b border-slate-200 dark:border-[#2b2b2b] text-xs text-slate-500 dark:text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-sky-600 dark:text-sky-400" />
          <span className="font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono text-[11px]">
            {title || cleanLang}
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            ({code.split('\n').length} 行)
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="active-press flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#252526] hover:bg-slate-100 dark:hover:bg-[#2d2d2d] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#333333] transition text-xs cursor-pointer"
          title="复制代码"
          type="button"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-500 dark:text-emerald-400 transition-transform scale-110" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">已复制</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>复制代码</span>
            </>
          )}
        </button>
      </div>
      <div className={`p-4 overflow-x-auto leading-relaxed ${maxHeight}`}>
        <pre className="m-0 bg-transparent p-0 font-mono text-[13px] leading-relaxed whitespace-pre hljs">
          <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        </pre>
      </div>
    </div>
  );
};

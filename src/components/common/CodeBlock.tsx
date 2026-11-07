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
    <div className={`my-3 rounded-2xl overflow-hidden border border-white/70 dark:border-white/10 bg-white/90 dark:bg-[#1a1f2c]/90 text-slate-800 dark:text-[#cccccc] shadow-[6px_6px_16px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] text-[13px] font-mono ${className}`}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/70 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 select-none shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2.5">
          <Terminal size={14} className="text-sky-600 dark:text-sky-400" />
          <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono text-[11px]">
            {title || cleanLang}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            ({code.split('\n').length} 行)
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-white/90 dark:bg-slate-800/90 hover:bg-white text-slate-700 dark:text-slate-200 border border-white/80 dark:border-white/10 shadow-[2px_2px_5px_rgba(0,0,0,0.06),inset_1px_1px_2px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-xs font-bold cursor-pointer"
          title="复制代码"
          type="button"
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
      <div className={`p-4 overflow-x-auto leading-relaxed bg-slate-50/50 dark:bg-[#151922]/50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.04)] ${maxHeight}`}>
        <pre className="m-0 bg-transparent p-0 font-mono text-[13px] leading-relaxed whitespace-pre hljs">
          <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        </pre>
      </div>
    </div>
  );
};

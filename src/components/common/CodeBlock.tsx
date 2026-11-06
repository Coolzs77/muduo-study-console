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
    <div className={`my-4 rounded-xl overflow-hidden border border-slate-700/80 bg-[#1e1e1e] text-slate-100 shadow-sm text-[13px] font-mono ${className}`}>
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#252526] border-b border-slate-700/70 text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-sky-400" />
          <span className="font-semibold uppercase tracking-wider text-slate-300">
            {title || cleanLang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#333333] hover:bg-[#3f3f46] text-slate-200 transition text-xs cursor-pointer active:scale-95"
          title="复制代码"
          type="button"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-medium">已复制</span>
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
        <pre className="m-0 font-mono text-[13px] whitespace-pre hljs">
          <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        </pre>
      </div>
    </div>
  );
};

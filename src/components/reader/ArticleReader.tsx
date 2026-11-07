import React from 'react';
import { YuqueArticle } from '../../types';
import { MarkdownView } from './MarkdownView';
import { MasterySelector } from './MasterySelector';
import { ExternalLink, Clock, FileText, ChevronLeft, ChevronRight, HelpCircle, Code2 } from 'lucide-react';

interface ArticleReaderProps {
  article: YuqueArticle;
  currentLevel: number;
  onSelectLevel: (level: number) => void;
  onNavigateAdjacent: (direction: -1 | 1) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  currentLevel,
  onSelectLevel,
  onNavigateAdjacent,
  hasPrev,
  hasNext,
}) => {
  const readMinutes = Math.max(1, Math.ceil((article.wordCount || 500) / 400));

  return (
    <main className="flex-1 min-w-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-6 sm:p-10 space-y-8 overflow-y-auto w-full transition-all duration-300">
      {/* Breadcrumb & Metadata Header */}
      <div className="space-y-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-2xl bg-amber-100/90 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 font-bold shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]">
            {article.bookTitle || '语雀专栏'}
          </span>
          <span className="text-slate-400">/</span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]">
            {article.category}
          </span>
          <span className="text-slate-400">/</span>
          <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
            第 {article.index} 篇
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl bg-white/70 dark:bg-slate-800/70 shadow-[2px_2px_4px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)]">
            <FileText size={14} className="text-amber-500" />
            <span>{(article.wordCount || 0).toLocaleString()} 字</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl bg-white/70 dark:bg-slate-800/70 shadow-[2px_2px_4px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)]">
            <Clock size={14} className="text-teal-500" />
            <span>约 {readMinutes} 分钟</span>
          </div>
          {article.updatedAt && (
            <span className="px-2.5 py-1 rounded-2xl bg-white/70 dark:bg-slate-800/70 shadow-[2px_2px_4px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)]">
              更新于 {article.updatedAt.slice(0, 10)}
            </span>
          )}
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-sky-700 dark:text-sky-300 shadow-[2px_2px_4px_rgba(0,0,0,0.05),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ml-auto cursor-pointer"
            >
              <span>语雀原著</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* 6-Level Mastery Bar */}
        <MasterySelector
          articleId={article.id}
          currentLevel={currentLevel}
          onSelectLevel={onSelectLevel}
        />
      </div>

      {/* Main Markdown Body */}
      <div className="mb-10">
        <MarkdownView content={article.content} />
      </div>

      {/* Key Interview Points (Amber Clay Card) */}
      {(article.interviewKeyPoints && article.interviewKeyPoints.length > 0) && (
        <div className="my-8 p-6 rounded-3xl bg-gradient-to-br from-amber-100/70 via-orange-50/70 to-yellow-100/70 dark:from-amber-950/40 dark:via-orange-900/30 dark:to-yellow-900/40 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08)] space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900 dark:text-amber-200">
            <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-amber-200/80 dark:bg-amber-900/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-amber-700 dark:text-amber-300">
              <HelpCircle size={14} />
            </div>
            <span>面试高频考点点拨</span>
          </div>
          <ul className="space-y-2 text-xs text-amber-950/90 dark:text-amber-100/90 leading-relaxed font-medium">
            {article.interviewKeyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold shrink-0">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source Links (if present) */}
      {(article.linkedSourceFiles && article.linkedSourceFiles.length > 0) && (
        <div className="my-6 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] flex flex-wrap items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <Code2 size={15} className="text-teal-600 dark:text-teal-400" />
          <span className="font-bold">关联源码文件:</span>
          {article.linkedSourceFiles.map((file, idx) => (
            <code key={idx} className="px-2.5 py-0.5 rounded-xl bg-slate-100 dark:bg-slate-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] font-mono text-[11px] text-teal-800 dark:text-teal-200 font-bold">
              {file}
            </code>
          ))}
        </div>
      )}

      {/* Bottom Prev / Next Navigation (Clay Pill Buttons) */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
        <button
          onClick={() => onNavigateAdjacent(-1)}
          disabled={!hasPrev}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer ${
            hasPrev
              ? 'bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-[3px_3px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90'
              : 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100 dark:bg-slate-800'
          }`}
        >
          <ChevronLeft size={16} />
          <span>上一篇</span>
        </button>

        <button
          onClick={() => onNavigateAdjacent(1)}
          disabled={!hasNext}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer ${
            hasNext
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[4px_4px_12px_rgba(245,158,11,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90'
              : 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100 dark:bg-slate-800'
          }`}
        >
          <span>下一篇</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </main>
  );
};

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
    <main className="flex-1 min-w-0 py-8 px-4 sm:px-8 lg:px-12 max-w-4xl mx-auto">
      {/* Breadcrumb & Metadata */}
      <div className="space-y-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-sky-600 dark:text-sky-400">
            {article.bookTitle || '语雀专栏'}
          </span>
          <span>/</span>
          <span>{article.category}</span>
          <span>/</span>
          <span>第 {article.index} 篇</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <FileText size={14} className="text-slate-400" />
            <span>{(article.wordCount || 0).toLocaleString()} 字</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-400" />
            <span>约 {readMinutes} 分钟</span>
          </div>
          {article.updatedAt && (
            <span>更新于 {article.updatedAt.slice(0, 10)}</span>
          )}
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 dark:text-sky-400 transition ml-auto"
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
      <div className="mb-12">
        <MarkdownView content={article.content} />
      </div>

      {/* Key Interview Points & Source Links (if present) */}
      {(article.interviewKeyPoints && article.interviewKeyPoints.length > 0) && (
        <div className="my-8 p-5 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/30 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-sky-900 dark:text-sky-200">
            <HelpCircle size={16} className="text-sky-600 dark:text-sky-400" />
            <span>面试高频考点点拨</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {article.interviewKeyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-mono text-sky-600 dark:text-sky-400 font-bold shrink-0">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source Links (if present) */}
      {(article.linkedSourceFiles && article.linkedSourceFiles.length > 0) && (
        <div className="my-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <Code2 size={15} className="text-slate-500" />
          <span className="font-semibold">关联源码文件:</span>
          {article.linkedSourceFiles.map((file, idx) => (
            <code key={idx} className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200">
              {file}
            </code>
          ))}
        </div>
      )}

      {/* Bottom Prev / Next Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => onNavigateAdjacent(-1)}
          disabled={!hasPrev}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
            hasPrev
              ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs'
              : 'border-transparent text-slate-300 dark:text-slate-700 cursor-not-allowed'
          }`}
        >
          <ChevronLeft size={16} />
          <span>上一篇</span>
        </button>

        <button
          onClick={() => onNavigateAdjacent(1)}
          disabled={!hasNext}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
            hasNext
              ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs'
              : 'border-transparent text-slate-300 dark:text-slate-700 cursor-not-allowed'
          }`}
        >
          <span>下一篇</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </main>
  );
};

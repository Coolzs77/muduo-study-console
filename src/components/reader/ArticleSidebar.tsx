import React, { useState, useMemo } from 'react';
import { YuqueArticle } from '../../types';
import { Search, BookOpen, Layers, CheckCircle, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface ArticleSidebarProps {
  articles: YuqueArticle[];
  currentArticleId: string;
  onSelectArticle: (articleId: string) => void;
  masteryMap: Record<string, number>;
  favorites: string[];
  onToggleFavorite: (articleId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const ArticleSidebar: React.FC<ArticleSidebarProps> = ({
  articles,
  currentArticleId,
  onSelectArticle,
  masteryMap,
  favorites,
  onToggleFavorite,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [selectedBook, setSelectedBook] = useState<'all' | 'muduo' | 'http'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Book filter
      if (selectedBook === 'muduo' && art.bookId !== 'muduo-core') return false;
      if (selectedBook === 'http' && art.bookId === 'muduo-core') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = art.title.toLowerCase().includes(q);
        const inCategory = (art.category || '').toLowerCase().includes(q);
        const inTags = (art.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inCategory && !inTags) return false;
      }

      return true;
    });
  }, [articles, selectedBook, searchQuery]);

  if (isCollapsed) {
    return (
      <aside className="w-12 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center py-4 select-none">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition cursor-pointer"
          title="展开专栏目录"
        >
          <ChevronRight size={18} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Header & Filter */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
            <BookOpen size={16} className="text-sky-600 dark:text-sky-400" />
            <span>专栏目录索引</span>
            <span className="text-xs text-slate-400 font-normal">({filteredArticles.length} 篇)</span>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
            title="收起目录"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Book Selector */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs font-medium">
          <button
            onClick={() => setSelectedBook('all')}
            className={`py-1 rounded-md transition cursor-pointer ${
              selectedBook === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            全部 (27)
          </button>
          <button
            onClick={() => setSelectedBook('muduo')}
            className={`py-1 rounded-md transition cursor-pointer ${
              selectedBook === 'muduo'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 font-semibold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Muduo (10)
          </button>
          <button
            onClick={() => setSelectedBook('http')}
            className={`py-1 rounded-md transition cursor-pointer ${
              selectedBook === 'http'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 font-semibold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            CppAI (17)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索篇名、标签或模块..."
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition"
          />
        </div>
      </div>

      {/* Article List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredArticles.map((art) => {
          const isSelected = art.id === currentArticleId;
          const level = masteryMap[art.id] || 0;
          const isFav = favorites.includes(art.id);

          return (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art.id)}
              className={`group flex items-start gap-2.5 p-2.5 rounded-xl transition cursor-pointer text-xs ${
                isSelected
                  ? 'bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-100 shadow-2xs'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex flex-col items-center shrink-0 mt-0.5">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10.5px] font-semibold ${
                    isSelected
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {art.index}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-medium truncate leading-snug" title={art.title}>
                    {art.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(art.id);
                    }}
                    className="shrink-0 p-0.5 text-slate-300 hover:text-amber-500 dark:text-slate-600 dark:hover:text-amber-400 transition"
                  >
                    <Star
                      size={12}
                      className={isFav ? 'fill-amber-400 text-amber-500' : ''}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                  <span className="truncate">{art.category}</span>
                  <span>•</span>
                  <span>{(art.wordCount || 0).toLocaleString()}字</span>
                  {level > 0 && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        L{level}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredArticles.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-400">
            无匹配章节
          </div>
        )}
      </div>
    </aside>
  );
};

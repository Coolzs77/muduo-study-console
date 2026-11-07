import React, { useState, useMemo } from 'react';
import { YuqueArticle } from '../../types';
import {
  Search,
  BookOpen,
  Layers,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

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

  // Module-level stats
  const moduleStats = useMemo(() => {
    let bookName = '全部';
    let targetArticles = articles;
    if (selectedBook === 'muduo') {
      bookName = 'Muduo';
      targetArticles = articles.filter(a => a.bookId === 'muduo-core');
    } else if (selectedBook === 'http') {
      bookName = 'CppAI';
      targetArticles = articles.filter(a => a.bookId !== 'muduo-core');
    }
    const mastered = targetArticles.filter(a => (masteryMap[a.id] || 0) >= 4).length;
    const total = targetArticles.length;
    const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { bookName, mastered, total, pct };
  }, [articles, selectedBook, masteryMap]);

  if (isCollapsed) {
    return (
      <aside className="w-16 shrink-0 rounded-3xl bg-[#f4f7fb]/90 dark:bg-[#151922]/90 shadow-[6px_6px_14px_rgba(0,0,0,0.06),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] py-4 flex flex-col items-center space-y-3 sticky top-18 h-[calc(100vh-5.5rem)] hidden md:flex select-none transition-all duration-300">
        <button
          onClick={onToggleCollapse}
          className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-sky-600 shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
          title="展开专栏目录"
        >
          <PanelLeftOpen size={18} />
        </button>

        <div className="w-8 h-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]" />

        <div className="flex flex-col items-center space-y-2 text-[11px] font-bold">
          <button
            onClick={() => { setSelectedBook('all'); onToggleCollapse(); }}
            className={`w-10 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
              selectedBook === 'all'
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-[3px_3px_8px_rgba(245,158,11,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]'
            }`}
            title="全部专栏 (27)"
          >
            全
          </button>
          <button
            onClick={() => { setSelectedBook('muduo'); onToggleCollapse(); }}
            className={`w-10 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
              selectedBook === 'muduo'
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-[3px_3px_8px_rgba(245,158,11,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]'
            }`}
            title="Muduo 专栏 (10)"
          >
            M
          </button>
          <button
            onClick={() => { setSelectedBook('http'); onToggleCollapse(); }}
            className={`w-10 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
              selectedBook === 'http'
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-[3px_3px_8px_rgba(245,158,11,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]'
            }`}
            title="CppAI 专栏 (17)"
          >
            AI
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 shrink-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 flex flex-col h-[calc(100vh-5.5rem)] sticky top-18 select-none transition-all duration-300 overflow-hidden">
      {/* Header & Filter */}
      <div className="pb-3 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-amber-100/90 dark:bg-amber-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-amber-600 dark:text-amber-400">
              <BookOpen size={14} />
            </div>
            <span>专栏目录</span>
            <span className="text-xs text-slate-400 font-mono">({filteredArticles.length} 篇)</span>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
            title="收起目录"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        {/* Book Selector (Clay recessed groove) */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/50 dark:bg-slate-900/60 rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.05)] text-xs font-semibold text-center">
          <button
            onClick={() => setSelectedBook('all')}
            className={`py-1.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
              selectedBook === 'all'
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            全部 (27)
          </button>
          <button
            onClick={() => setSelectedBook('muduo')}
            className={`py-1.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
              selectedBook === 'muduo'
                ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Muduo (10)
          </button>
          <button
            onClick={() => setSelectedBook('http')}
            className={`py-1.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
              selectedBook === 'http'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            CppAI (17)
          </button>
        </div>

        {/* Module Progress Bar (Clay amber mini card) */}
        <div className="bg-gradient-to-br from-amber-100/70 via-orange-50 to-yellow-100/70 dark:from-amber-950/40 dark:via-orange-900/30 dark:to-yellow-900/40 p-3 rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-100">
              {moduleStats.bookName} 吃透 {moduleStats.mastered} / {moduleStats.total} 篇
            </span>
            <span className="font-mono font-bold text-amber-800 dark:text-amber-200">
              {moduleStats.pct}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-amber-200/50 dark:bg-amber-950/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{ width: `${moduleStats.pct}%` }}
            />
          </div>
        </div>

        {/* Search Input (Clay recessed input) */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索篇名、标签或模块..."
            className="w-full bg-white/80 dark:bg-slate-900/70 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Article List (Clay pill strips) */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {filteredArticles.map((art) => {
          const isSelected = art.id === currentArticleId;
          const level = masteryMap[art.id] || 0;
          const isMastered = level >= 4;
          const isLearning = level > 0 && level < 4;
          const isFav = favorites.includes(art.id);

          return (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art.id)}
              className={`group flex items-start gap-2.5 p-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-xs active:scale-x-105 active:scale-y-90 select-none ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-950/60 dark:via-orange-900/40 dark:to-yellow-950/60 shadow-[4px_4px_12px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] -translate-y-0.5'
                  : 'bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[5px_5px_12px_rgba(0,0,0,0.06)]'
              }`}
            >
              <div className="flex flex-col items-center shrink-0 mt-0.5">
                <span
                  className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono text-[10.5px] font-bold ${
                    isMastered
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[2px_2px_4px_rgba(16,185,129,0.3)]'
                      : isSelected
                      ? 'bg-amber-600 text-white shadow-[2px_2px_4px_rgba(217,119,6,0.3)]'
                      : isLearning
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08)]'
                      : 'bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {art.index}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-bold truncate leading-snug text-slate-800 dark:text-slate-100" title={art.title}>
                    {art.title}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isMastered && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
                        ✓ 已吃透
                      </span>
                    )}
                    {isLearning && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
                        学习中
                      </span>
                    )}
                    {level === 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] text-slate-400 dark:text-slate-500">
                        未读
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(art.id);
                      }}
                      className="p-1 rounded-xl text-slate-300 hover:text-amber-500 dark:text-slate-600 dark:hover:text-amber-400 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
                      title={isFav ? '取消收藏' : '收藏'}
                    >
                      <Star
                        size={13}
                        className={isFav ? 'fill-amber-400 text-amber-500' : ''}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  <span className="truncate">{art.category}</span>
                  <span>•</span>
                  <span>{(art.wordCount || 0).toLocaleString()}字</span>
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

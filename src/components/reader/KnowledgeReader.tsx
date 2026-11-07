import React, { useState, useEffect } from 'react';
import { YUQUE_DATASET } from '../../data/yuqueDataset';
import { ArticleSidebar } from './ArticleSidebar';
import { ArticleReader } from './ArticleReader';
import { TableOfContents } from './TableOfContents';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const KnowledgeReader: React.FC = () => {
  const [currentArticleId, setCurrentArticleId] = useLocalStorage<string>(
    'currentYuqueArticleId',
    YUQUE_DATASET[0]?.id || 'yq_muduo_01'
  );
  const [masteryMap, setMasteryMap] = useLocalStorage<Record<string, number>>(
    'knowledgeMastery',
    {}
  );
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    'knowledgeFavorites',
    []
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const currentArticle =
    YUQUE_DATASET.find((a) => a.id === currentArticleId) || YUQUE_DATASET[0];

  const currentIndex = YUQUE_DATASET.findIndex((a) => a.id === currentArticleId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < YUQUE_DATASET.length - 1;

  const handleSelectLevel = (level: number) => {
    setMasteryMap((prev) => ({
      ...prev,
      [currentArticleId]: level,
    }));
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNavigateAdjacent = (direction: -1 | 1) => {
    const nextIdx = currentIndex + direction;
    if (nextIdx >= 0 && nextIdx < YUQUE_DATASET.length) {
      setCurrentArticleId(YUQUE_DATASET[nextIdx].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll to top when changing article
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentArticleId]);

  return (
    <div className="flex items-start w-full min-h-[calc(100vh-4rem)] bg-[#eef2f7] dark:bg-[#11141a] transition-colors duration-300 p-3 sm:p-4 gap-4">
      {/* Left Article Directory */}
      <ArticleSidebar
        articles={YUQUE_DATASET}
        currentArticleId={currentArticleId}
        onSelectArticle={setCurrentArticleId}
        masteryMap={masteryMap}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Center Reading Body */}
      {currentArticle ? (
        <ArticleReader
          article={currentArticle}
          currentLevel={masteryMap[currentArticle.id] || 0}
          onSelectLevel={handleSelectLevel}
          onNavigateAdjacent={handleNavigateAdjacent}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center rounded-3xl bg-white/80 dark:bg-[#1e2433]/85 p-8 border border-white/70 dark:border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.7)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-slate-400 font-bold text-sm">
          未找到对应文章
        </div>
      )}

      {/* Right Table of Contents */}
      {currentArticle && (
        <TableOfContents content={currentArticle.content} />
      )}
    </div>
  );
};

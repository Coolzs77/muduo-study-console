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
    <div className="flex w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950">
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
        <div className="flex-1 flex items-center justify-center text-slate-400">
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

import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/layout/Header';
import { ReadingProgressBar } from './components/layout/ReadingProgressBar';
import { KnowledgeReader } from './components/reader/KnowledgeReader';
import { AlgoCatalog } from './components/algorithm/AlgoCatalog';
import { DashboardView } from './components/dashboard/DashboardView';
import { CodeMappingView } from './components/mapping/CodeMappingView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useLocalStorage<ActiveTab>('activeTab', 'reader');
  const [isDark, setIsDark] = useLocalStorage<boolean>('isDarkMode', false);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* 2.5px Top Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Modern Sticky Navigation Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      {/* Main View Canvas */}
      <div className="flex-1 w-full">
        {activeTab === 'reader' && <KnowledgeReader />}
        {activeTab === 'algo' && <AlgoCatalog />}
        {activeTab === 'dashboard' && <DashboardView onNavigateTab={setActiveTab} />}
        {activeTab === 'mapping' && <CodeMappingView />}
      </div>
    </div>
  );
};

export default App;

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ActiveTab, DomainModule, PracticeSubTab } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/layout/Header';
import { ReadingProgressBar } from './components/layout/ReadingProgressBar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';
import { EnvGuideModal } from './components/common/EnvGuideModal';
import { TopologyDrawer } from './components/common/TopologyDrawer';

// 7 Primary Views (Dashboard statically loaded for instant landing; others lazy loaded)
import { DashboardView } from './components/dashboard/DashboardView';

const DailyCurriculumView = lazy(() =>
  import('./components/daily/DailyCurriculumView').then(m => ({ default: m.DailyCurriculumView }))
);
const KnowledgeReader = lazy(() =>
  import('./components/reader/KnowledgeReader').then(m => ({ default: m.KnowledgeReader }))
);
const AlgoCatalog = lazy(() =>
  import('./components/algorithm/AlgoCatalog').then(m => ({ default: m.AlgoCatalog }))
);
const LearningSystemView = lazy(() =>
  import('./components/learning/LearningSystemView').then(m => ({ default: m.LearningSystemView }))
);
const SourceRoadmapView = lazy(() =>
  import('./components/source/SourceRoadmapView').then(m => ({ default: m.SourceRoadmapView }))
);
const PracticeCenterView = lazy(() =>
  import('./components/practice/PracticeCenterView').then(m => ({ default: m.PracticeCenterView }))
);

const ViewSuspenseFallback: React.FC = () => (
  <div className="flex-1 w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400 animate-pulse">
      <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold tracking-wide">模块加载中 · 请稍候...</span>
    </div>
  </div>
);

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useLocalStorage<ActiveTab>('activeTab', 'dashboard');
  const [isDark, setIsDark] = useLocalStorage<boolean>('isDarkMode', false);

  // Global modals state
  const [isEnvGuideOpen, setIsEnvGuideOpen] = useState(false);
  const [selectedTopologyModule, setSelectedTopologyModule] = useState<DomainModule | null>(null);

  // Jump parameters
  const [highlightDay, setHighlightDay] = useState<number | null>(null);
  const [quizDay, setQuizDay] = useState<number>(1);
  const [practiceSubTab, setPracticeSubTab] = useState<PracticeSubTab>('mapping');

  // Backward compatibility migration for legacy localStorage tabs
  useEffect(() => {
    const legacyTabs: Record<string, PracticeSubTab> = {
      mapping: 'mapping',
      career: 'career',
      pitfalls: 'pitfalls',
      quiz: 'quiz'
    };
    if ((activeTab as string) in legacyTabs) {
      setPracticeSubTab(legacyTabs[activeTab as string]);
      setActiveTab('practice');
    }
  }, [activeTab, setActiveTab]);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Navigate to specific day in daily curriculum
  const handleNavigateToDay = (day: number) => {
    setHighlightDay(day);
    setActiveTab('daily');
    setTimeout(() => {
      const el = document.getElementById(`day-card-${day}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Jump to quiz for specific day
  const handleNavigateToQuiz = (day: number) => {
    setQuizDay(day);
    setPracticeSubTab('quiz');
    setActiveTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] dark:bg-[#11141a] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased w-full transition-colors duration-300">
      {/* 2.5px Top Reading Progress Bar (active during reading) */}
      <ReadingProgressBar />

      {/* Modern Sticky Navigation Header with 7 views & Linux guide button */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
        onOpenEnvGuide={() => setIsEnvGuideOpen(true)}
      />

      {/* Main View Matrix - Fluid full-screen container with no max-w bottlenecks */}
      <main className="flex-1 w-full min-w-0">
        <Suspense fallback={<ViewSuspenseFallback />}>
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigateTab={setActiveTab}
              onNavigateToDay={handleNavigateToDay}
              onSelectTopologyModule={setSelectedTopologyModule}
            />
          )}
          {activeTab === 'daily' && (
            <DailyCurriculumView
              onJumpToQuiz={handleNavigateToQuiz}
              selectedDayHighlight={highlightDay}
              onClearHighlight={() => setHighlightDay(null)}
            />
          )}
          {activeTab === 'reader' && <KnowledgeReader />}
          {activeTab === 'algo' && <AlgoCatalog />}
          {activeTab === 'learning' && <LearningSystemView />}
          {activeTab === 'source' && <SourceRoadmapView />}
          {activeTab === 'practice' && (
            <PracticeCenterView
              activeSubTab={practiceSubTab}
              onSelectSubTab={setPracticeSubTab}
              quizDay={quizDay}
            />
          )}
        </Suspense>
      </main>

      {/* Global Linux Remote Dev Guide Modal */}
      <EnvGuideModal
        isOpen={isEnvGuideOpen}
        onClose={() => setIsEnvGuideOpen(false)}
      />

      {/* Architecture Topology Slide-out Drawer */}
      <TopologyDrawer
        module={selectedTopologyModule}
        isOpen={!!selectedTopologyModule}
        onClose={() => setSelectedTopologyModule(null)}
      />

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Global Bottom Persistence & Backup Center */}
      <Footer />
    </div>
  );
};

export default App;

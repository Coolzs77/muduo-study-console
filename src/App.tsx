import React, { useState, useEffect } from 'react';
import { ActiveTab, DomainModule } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/layout/Header';
import { ReadingProgressBar } from './components/layout/ReadingProgressBar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';
import { EnvGuideModal } from './components/common/EnvGuideModal';
import { TopologyDrawer } from './components/common/TopologyDrawer';

// 10 Views
import { DashboardView } from './components/dashboard/DashboardView';
import { DailyCurriculumView } from './components/daily/DailyCurriculumView';
import { KnowledgeReader } from './components/reader/KnowledgeReader';
import { AlgoCatalog } from './components/algorithm/AlgoCatalog';
import { LearningSystemView } from './components/learning/LearningSystemView';
import { SourceRoadmapView } from './components/source/SourceRoadmapView';
import { CodeMappingView } from './components/mapping/CodeMappingView';
import { CareerSystemView } from './components/career/CareerSystemView';
import { PitfallsView } from './components/pitfalls/PitfallsView';
import { QuizCenterView } from './components/quiz/QuizCenterView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useLocalStorage<ActiveTab>('activeTab', 'dashboard');
  const [isDark, setIsDark] = useLocalStorage<boolean>('isDarkMode', false);

  // Global modals state
  const [isEnvGuideOpen, setIsEnvGuideOpen] = useState(false);
  const [selectedTopologyModule, setSelectedTopologyModule] = useState<DomainModule | null>(null);

  // Jump parameters
  const [highlightDay, setHighlightDay] = useState<number | null>(null);
  const [quizDay, setQuizDay] = useState<number>(1);

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
    setActiveTab('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* 2.5px Top Reading Progress Bar (active during reading) */}
      <ReadingProgressBar />

      {/* Modern Sticky Navigation Header with 10 views & Linux guide button */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
        onOpenEnvGuide={() => setIsEnvGuideOpen(true)}
      />

      {/* Main View Matrix */}
      <main className="flex-1 w-full">
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
          />
        )}
        {activeTab === 'reader' && <KnowledgeReader />}
        {activeTab === 'algo' && <AlgoCatalog />}
        {activeTab === 'learning' && <LearningSystemView />}
        {activeTab === 'source' && <SourceRoadmapView />}
        {activeTab === 'mapping' && <CodeMappingView />}
        {activeTab === 'career' && <CareerSystemView />}
        {activeTab === 'pitfalls' && <PitfallsView />}
        {activeTab === 'quiz' && <QuizCenterView initialDay={quizDay} />}
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

import React, { useState } from 'react';
import { PracticeSubTab } from '../../types';
import { CodeMappingView } from '../mapping/CodeMappingView';
import { CareerSystemView } from '../career/CareerSystemView';
import { PitfallsView } from '../pitfalls/PitfallsView';
import { QuizCenterView } from '../quiz/QuizCenterView';
import { Code, Award, ShieldAlert, HelpCircle } from 'lucide-react';

export interface PracticeCenterViewProps {
  initialSubTab?: PracticeSubTab;
  activeSubTab?: PracticeSubTab;
  onSelectSubTab?: (subTab: PracticeSubTab) => void;
  quizDay?: number;
}

export const PracticeCenterView: React.FC<PracticeCenterViewProps> = ({
  initialSubTab = 'mapping',
  activeSubTab: controlledSubTab,
  onSelectSubTab,
  quizDay = 1
}) => {
  const [internalSubTab, setInternalSubTab] = useState<PracticeSubTab>(initialSubTab);
  const currentSubTab = controlledSubTab ?? internalSubTab;

  const handleTabChange = (tab: PracticeSubTab) => {
    if (onSelectSubTab) {
      onSelectSubTab(tab);
    } else {
      setInternalSubTab(tab);
    }
  };

  const subTabs: Array<{ id: PracticeSubTab; label: string; icon: React.ReactNode; desc: string }> = [
    {
      id: 'mapping',
      label: '代码映射',
      icon: <Code size={14} />,
      desc: '现代 C++ 机制到底层工程落地'
    },
    {
      id: 'career',
      label: '面试题解',
      icon: <Award size={14} />,
      desc: '工程凭证、能力水准与面试问答'
    },
    {
      id: 'pitfalls',
      label: '问题记录',
      icon: <ShieldAlert size={14} />,
      desc: '底层错误复盘与防御编码'
    },
    {
      id: 'quiz',
      label: '知识自测',
      icon: <HelpCircle size={14} />,
      desc: '28天多维题型实操检验'
    }
  ];

  return (
    <div className="w-full pb-12">
      {/* Top Secondary Tab Navigation Bar (Sticky under Header) */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Sub-tab Pill Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
              {subTabs.map(tab => {
                const isActive = currentSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    type="button"
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Sub-tab Description */}
            <div className="hidden md:flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{subTabs.find(t => t.id === currentSubTab)?.desc}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-2">
        {currentSubTab === 'mapping' && <CodeMappingView />}
        {currentSubTab === 'career' && <CareerSystemView />}
        {currentSubTab === 'pitfalls' && <PitfallsView />}
        {currentSubTab === 'quiz' && (
          <QuizCenterView key={quizDay} initialDay={quizDay} />
        )}
      </div>
    </div>
  );
};

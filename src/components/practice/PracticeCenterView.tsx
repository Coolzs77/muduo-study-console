import React, { useState } from 'react';
import { PracticeSubTab } from '../../types';
import { CodeMappingView } from '../mapping/CodeMappingView';
import { CareerSystemView } from '../career/CareerSystemView';
import { PitfallsView } from '../pitfalls/PitfallsView';
import { QuizCenterView } from '../quiz/QuizCenterView';
import { MuduoArchiveView } from '../archive/MuduoArchiveView';
import {
  Code,
  Award,
  ShieldAlert,
  HelpCircle,
  Archive,
  Layers,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';

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
      desc: '工程能力、水准与面试问答'
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
    },
    {
      id: 'archive',
      label: 'Muduo 历史归档',
      icon: <Archive size={14} />,
      desc: '原版 28 天网络库历史教案'
    }
  ];

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950">
      {/* ========================================================= */}
      {/* LEFT COLUMN: Sub-Module Directory & Contextual Navigation  */}
      {/* ========================================================= */}
      <aside className="w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-5 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)] hidden md:block">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers size={16} className="text-sky-600 dark:text-sky-400" />
            <span>综合实践与自测</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            代码映射、面试问答、踩坑避险与归档
          </p>
        </div>

        {/* 5 Sub-Modules Nav */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            实践子模块
          </div>
          {subTabs.map(tab => {
            const isActive = currentSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                type="button"
                className={`w-full text-left p-2.5 rounded-xl transition cursor-pointer flex items-start justify-between gap-2 border ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs border-transparent'
                    : 'bg-white dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="min-w-0">
                  <div className="font-bold text-xs flex items-center gap-2">
                    <span className={isActive ? 'text-white' : 'text-sky-600 dark:text-sky-400'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </div>
                  <div
                    className={`text-[11px] truncate mt-0.5 ${
                      isActive ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tab.desc}
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className={`shrink-0 mt-1 ${isActive ? 'text-white' : 'text-slate-400'}`}
                />
              </button>
            );
          })}
        </div>

        {/* Muduo Archive Notice */}
        <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1.5">
          <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
            <Archive size={14} className="text-amber-500" />
            <span>架构分层与历史解耦</span>
          </div>
          <p className="text-[11px] text-amber-800 dark:text-amber-300/80 leading-relaxed">
            本项目已全面实施 Muduo 底层网络库与 CppAIService 智能推理服务的解耦，原版 Muduo 28 天课程已完整归入本模块的历史归档子项，主任务完全聚焦于 Kama-HTTPServer 与 CppAIService。
          </p>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* CENTER COLUMN: Clean Workspace (Sub-module canvas)        */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6 overflow-y-auto">
        {currentSubTab === 'mapping' && <CodeMappingView />}
        {currentSubTab === 'career' && <CareerSystemView />}
        {currentSubTab === 'pitfalls' && <PitfallsView />}
        {currentSubTab === 'quiz' && (
          <QuizCenterView key={quizDay} initialDay={quizDay} />
        )}
        {currentSubTab === 'archive' && <MuduoArchiveView />}
      </main>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: Quick Actions & Reference Tips              */}
      {/* ========================================================= */}
      <aside className="w-72 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-5 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)] hidden xl:block">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-sky-600 dark:text-sky-400" />
            <span>自测与能力诊断</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            求职对标与实战验证
          </p>
        </div>

        {/* Module Status Card */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            当前激活模块
          </div>
          <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1.5">
            {subTabs.find(t => t.id === currentSubTab)?.icon}
            <span>{subTabs.find(t => t.id === currentSubTab)?.label}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {subTabs.find(t => t.id === currentSubTab)?.desc}
          </p>
        </div>

        {/* Quick Quiz Shortcut */}
        <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/50 dark:border-sky-900/40 text-xs space-y-2">
          <div className="font-bold text-sky-900 dark:text-sky-300">
            快速自测直达
          </div>
          <p className="text-[11px] text-sky-800 dark:text-sky-300/80 leading-relaxed">
            建议在每学完一个周期的任务后，进入知识自测模块进行限时自测，巩固底层知识。
          </p>
          <button
            onClick={() => handleTabChange('quiz')}
            type="button"
            className="w-full py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            进入知识自测
          </button>
        </div>
      </aside>
    </div>
  );
};

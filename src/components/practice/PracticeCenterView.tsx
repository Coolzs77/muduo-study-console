import React, { useState } from 'react';
import { PracticeSubTab } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
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
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage<boolean>(
    'sidebar_collapsed_practice',
    false
  );

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
    <div className="flex items-start w-full min-h-[calc(100vh-4rem)] bg-[#eef2f7] dark:bg-[#11141a] transition-colors duration-300 p-3 sm:p-4 gap-4 text-slate-800 dark:text-slate-200">
      {/* ========================================================= */}
      {/* LEFT COLUMN: Sub-Module Directory & Contextual Navigation  */}
      {/* ========================================================= */}
      {isSidebarCollapsed ? (
        <aside className="w-16 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/90 dark:bg-[#151922]/90 shadow-[6px_6px_14px_rgba(0,0,0,0.06),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] py-4 flex flex-col items-center space-y-3 sticky top-18 h-[calc(100vh-5.5rem)] hidden md:flex select-none transition-all duration-300">
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            title="展开实践目录"
            className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-sky-600 shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
          >
            <PanelLeftOpen size={18} />
          </button>
          <div className="w-8 h-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]" />
          <div className="flex flex-col items-center space-y-2 w-full px-2">
            {subTabs.map(tab => {
              const isActive = currentSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  title={`${tab.label}: ${tab.desc}`}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                    isActive
                      ? 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-[3px_3px_8px_rgba(6,182,212,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]'
                  }`}
                >
                  {tab.icon}
                </button>
              );
            })}
          </div>
        </aside>
      ) : (
        <aside className="w-80 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 space-y-4 overflow-y-auto sticky top-18 h-[calc(100vh-5.5rem)] hidden md:block select-none transition-all duration-300">
          <div className="pb-2 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-cyan-100/90 dark:bg-cyan-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-cyan-600 dark:text-cyan-400">
                <Layers size={14} />
              </div>
              <span>实践目录</span>
            </h2>
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              title="收起侧边栏"
              className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

          {/* 5 Sub-Modules Nav (Clay pill strips) */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              实践子模块
            </div>
            {subTabs.map(tab => {
              const isActive = currentSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  type="button"
                  className={`w-full text-left p-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex items-start justify-between gap-2 active:scale-x-105 active:scale-y-90 select-none ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-100 via-teal-50 to-cyan-100 dark:from-cyan-950/60 dark:via-teal-900/40 dark:to-cyan-950/60 text-cyan-950 dark:text-cyan-100 shadow-[4px_4px_12px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] font-bold -translate-y-0.5'
                      : 'bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span className={isActive ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-500'}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                    </div>
                    <div
                      className={`text-[11px] truncate mt-0.5 font-medium ${
                        isActive ? 'text-cyan-800 dark:text-cyan-200' : 'text-slate-400'
                      }`}
                    >
                      {tab.desc}
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`shrink-0 mt-1 transition-transform ${isActive ? 'text-cyan-700 dark:text-cyan-300 translate-x-0.5' : 'text-slate-400'}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Muduo Archive Notice (Clay amber card) */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-100/70 to-orange-50/70 dark:from-amber-950/40 dark:to-orange-900/30 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] text-xs space-y-2">
            <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <Archive size={14} className="text-amber-600 dark:text-amber-400" />
              <span>架构分层与历史解耦</span>
            </div>
            <p className="text-[11px] text-amber-950/80 dark:text-amber-100/80 leading-relaxed font-medium">
              本项目已全面实施 Muduo 底层网络库与 CppAIService 智能推理服务的解耦，原版 Muduo 28 天课程已完整归入本模块的历史归档子项，主任务完全聚焦于 Kama-HTTPServer 与 CppAIService。
            </p>
          </div>
        </aside>
      )}

      {/* ========================================================= */}
      {/* CENTER COLUMN: Clean Workspace (Sub-module canvas)        */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-6 sm:p-8 space-y-6 overflow-y-auto w-full">
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
      <aside className="w-72 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 h-[calc(100vh-5.5rem)] sticky top-18 hidden xl:flex flex-col space-y-4 select-none overflow-y-auto">
        <div className="pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-cyan-100/90 dark:bg-cyan-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-cyan-600 dark:text-cyan-400">
              <Sparkles size={14} />
            </div>
            <span>自测中心</span>
          </h2>
        </div>

        {/* Module Status Card (Clay Candy Card) */}
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] space-y-2">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            当前激活模块
          </div>
          <div className="text-xs text-cyan-700 dark:text-cyan-300 font-bold flex items-center gap-1.5">
            {subTabs.find(t => t.id === currentSubTab)?.icon}
            <span>{subTabs.find(t => t.id === currentSubTab)?.label}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {subTabs.find(t => t.id === currentSubTab)?.desc}
          </p>
        </div>

        {/* Quick Quiz Shortcut (Clay Button with Squash & Stretch) */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-cyan-50/70 to-teal-50/70 dark:from-cyan-950/40 dark:to-teal-900/30 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] text-xs space-y-3">
          <div className="font-bold text-cyan-900 dark:text-cyan-200">
            快速自测直达
          </div>
          <p className="text-[11px] text-cyan-950/80 dark:text-cyan-100/80 leading-relaxed font-medium">
            建议在每学完一个周期的任务后，进入知识自测模块进行限时自测，巩固底层知识。
          </p>
          <button
            onClick={() => handleTabChange('quiz')}
            type="button"
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-xs font-bold shadow-[3px_3px_8px_rgba(8,145,178,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
          >
            进入知识自测
          </button>
        </div>
      </aside>
    </div>
  );
};

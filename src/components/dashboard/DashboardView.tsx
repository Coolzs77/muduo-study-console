import React from 'react';
import { ActiveTab } from '../../types';
import { YUQUE_DATASET } from '../../data/yuqueDataset';
import { ALGORITHM_LAB_CATALOG } from '../../data/algoDataset';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { FocusTimer } from './FocusTimer';
import { TaskRoutineList } from './TaskRoutineList';
import { BookOpen, CheckSquare, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface DashboardViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const [masteryMap] = useLocalStorage<Record<string, number>>('knowledgeMastery', {});
  const [completedMap] = useLocalStorage<Record<string | number, boolean>>('completedAlgos', {});
  const [todayMins] = useLocalStorage<number>('todayStudyMinutes', 0);

  // Stats calculation
  const totalArticles = YUQUE_DATASET.length;
  const masteredArticles = YUQUE_DATASET.filter((a) => (masteryMap[a.id] || 0) >= 3).length;

  const totalAlgos = ALGORITHM_LAB_CATALOG.length;
  const completedAlgos = ALGORITHM_LAB_CATALOG.filter((p) => {
    if (p.num !== null && p.num !== undefined) {
      return !!completedMap[p.num] || !!completedMap[String(p.num)];
    }
    return p.id ? !!completedMap[p.id] : false;
  }).length;

  const hot100Total = 100;
  const hot100Completed = ALGORITHM_LAB_CATALOG.filter((p) => {
    if (!p.isHot100) return false;
    if (p.num !== null && p.num !== undefined) {
      return !!completedMap[p.num] || !!completedMap[String(p.num)];
    }
    return p.id ? !!completedMap[p.id] : false;
  }).length;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
          <Sparkles size={14} />
          <span>Muduo & CppAIService 学习控制台</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          专注大厂 C++ 核心壁垒攻坚
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          以底层网络库架构为基，融合 CppAIService 高并发工程与 233 道核心算法题单，构建扎实的工程与八股能力。
        </p>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Yuque Articles Card */}
        <div
          onClick={() => onNavigateTab('reader')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-sky-400 dark:hover:border-sky-600 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <BookOpen size={18} className="text-sky-600 dark:text-sky-400" />
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">专栏精通掌握</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {masteredArticles} <span className="text-xs text-slate-400 font-normal">/ {totalArticles} 篇</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full"
              style={{ width: `${Math.round((masteredArticles / totalArticles) * 100)}%` }}
            />
          </div>
        </div>

        {/* Algorithm Card */}
        <div
          onClick={() => onNavigateTab('algo')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-emerald-400 dark:hover:border-emerald-600 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <CheckSquare size={18} className="text-emerald-600 dark:text-emerald-400" />
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">算法刷题完成</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {completedAlgos} <span className="text-xs text-slate-400 font-normal">/ {totalAlgos} 题</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Hot 100 达成: {hot100Completed} / {hot100Total}
          </div>
        </div>

        {/* Study Time Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <Clock size={18} className="text-amber-500" />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">今日累计专注</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {todayMins} <span className="text-xs text-slate-400 font-normal">分钟</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            约 {(todayMins / 60).toFixed(1)} 小时
          </div>
        </div>
      </div>

      {/* Main Grid: Tasks & Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskRoutineList onNavigateTab={onNavigateTab} />
        </div>
        <div className="lg:col-span-1">
          <FocusTimer />
        </div>
      </div>
    </div>
  );
};

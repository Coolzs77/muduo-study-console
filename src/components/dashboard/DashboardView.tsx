import React, { useMemo } from 'react';
import { ActiveTab, DomainModule } from '../../types';
import { YUQUE_DATASET } from '../../data/yuqueDataset';
import { ALGORITHM_LAB_CATALOG } from '../../data/algoDataset';
import { DAYS_DATASET, SHORT_DAY_TITLES } from '../../data/daysDataset';
import { DOMAIN_MODULES } from '../../data/domainDataset';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { FocusTimer } from './FocusTimer';
import { TaskRoutineList } from './TaskRoutineList';
import {
  Calendar,
  CheckSquare,
  Layers,
  Archive,
  ChevronRight,
  BookOpen,
  Bookmark,
  Briefcase,
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
  Check
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onNavigateToDay: (day: number) => void;
  onSelectTopologyModule: (module: DomainModule) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onNavigateToDay,
  onSelectTopologyModule
}) => {
  const [masteryMap] = useLocalStorage<Record<string, number>>('knowledgeMastery', {});
  const [completedMap] = useLocalStorage<Record<string | number, boolean>>('completedAlgos', {});
  const [dayMastery] = useLocalStorage<Record<number, number>>('muduo_day_mastery', {});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage<boolean>(
    'sidebar_collapsed_dashboard',
    false
  );

  // Stats calculation
  const totalArticles = YUQUE_DATASET.length;
  const masteredArticles = YUQUE_DATASET.filter(a => (masteryMap[a.id] || 0) >= 4).length;

  const totalAlgos = ALGORITHM_LAB_CATALOG.length;
  const completedAlgos = ALGORITHM_LAB_CATALOG.filter(p => {
    if (p.num !== null && p.num !== undefined) {
      return !!completedMap[p.num] || !!completedMap[String(p.num)];
    }
    return p.id ? !!completedMap[p.id] : false;
  }).length;

  // 28 days stats
  const masteredDaysCount = useMemo(() => {
    return Object.values(dayMastery).filter(lvl => lvl >= 4).length;
  }, [dayMastery]);

  const CPPAI_CORE_MODULES = [
    {
      id: 'mod_ai_model_manager',
      name: 'ModelManager',
      layer: '运行时底座',
      desc: 'ONNX/TensorRT C++ 原生会话封装'
    },
    {
      id: 'mod_ai_worker_pool',
      name: 'WorkerPool',
      layer: '并发计算流池',
      desc: 'CUDA Stream 异步流水线重叠'
    },
    {
      id: 'mod_ai_dynamic_batcher',
      name: 'DynamicBatcher',
      layer: '批处理核心',
      desc: '自适应动态 Batch 聚合调度'
    },
    {
      id: 'mod_ai_token_streamer',
      name: 'TokenStreamer',
      layer: '流式输出',
      desc: 'SSE 分块实时 Token 生成推送'
    },
    {
      id: 'mod_ai_memory_pool',
      name: 'MemoryPool',
      layer: '显存复用',
      desc: 'KV-Cache 分页管理与碎片消除'
    }
  ];

  // 4 Weeks in 4 rows x 7 cols
  const calendarRows = useMemo(() => {
    return [
      { week: 1, label: '第 1 周', days: DAYS_DATASET.slice(0, 7) },
      { week: 2, label: '第 2 周', days: DAYS_DATASET.slice(7, 14) },
      { week: 3, label: '第 3 周', days: DAYS_DATASET.slice(14, 21) },
      { week: 4, label: '第 4 周', days: DAYS_DATASET.slice(21, 28) }
    ];
  }, []);

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)] bg-[#eef2f7] dark:bg-[#11141a] transition-colors duration-300 p-3 sm:p-4 gap-4">
      {/* ========================================================= */}
      {/* LEFT COLUMN: Concise Overview & Navigation (Collapsible)   */}
      {/* ========================================================= */}
      {isSidebarCollapsed ? (
        <aside className="w-16 shrink-0 rounded-3xl bg-[#f4f7fb]/90 dark:bg-[#151922]/90 shadow-[6px_6px_14px_rgba(0,0,0,0.06),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] py-4 flex flex-col items-center space-y-4 sticky top-18 h-[calc(100vh-5.5rem)] hidden md:flex select-none transition-all duration-300">
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-sky-600 shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
            title="展开仪表盘导航"
          >
            <PanelLeftOpen size={18} />
          </button>

          <div className="w-8 h-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]" />

          {/* Quick Nav Dock (Clay Pills) */}
          <div className="flex flex-col items-center space-y-2.5 text-slate-600 dark:text-slate-400">
            <button
              onClick={() => onNavigateTab('daily')}
              className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/60 dark:to-teal-900/60 text-teal-700 dark:text-teal-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
              title={`任务 (${masteredDaysCount}/28)`}
            >
              <Calendar size={18} />
            </button>
            <button
              onClick={() => onNavigateTab('reader')}
              className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/60 dark:to-orange-900/60 text-amber-700 dark:text-amber-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
              title={`项目 (${masteredArticles}/${totalArticles})`}
            >
              <BookOpen size={18} />
            </button>
            <button
              onClick={() => onNavigateTab('algo')}
              className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/60 dark:to-pink-900/60 text-purple-700 dark:text-purple-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
              title={`算法 (${completedAlgos}/${totalAlgos})`}
            >
              <CheckSquare size={18} />
            </button>
            <button
              onClick={() => onNavigateTab('learning')}
              className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-950/60 dark:to-blue-900/60 text-indigo-700 dark:text-indigo-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
              title="学习系统"
            >
              <Bookmark size={18} />
            </button>
            <button
              onClick={() => onNavigateTab('source')}
              className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-950/60 dark:to-yellow-900/60 text-amber-700 dark:text-amber-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
              title="源码路线"
            >
              <Layers size={18} />
            </button>
            <button
              onClick={() => onNavigateTab('practice')}
              className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-950/60 dark:to-teal-900/60 text-cyan-700 dark:text-cyan-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
              title="其他 / 归档"
            >
              <Briefcase size={18} />
            </button>
          </div>
        </aside>
      ) : (
        <aside className="w-80 shrink-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 space-y-5 overflow-y-auto sticky top-18 h-[calc(100vh-5.5rem)] hidden md:block transition-all duration-300 select-none">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-sky-100/90 dark:bg-sky-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-sky-600 dark:text-sky-400">
                <Activity size={14} />
              </div>
              <span>仪表盘导航</span>
            </h2>
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
              title="收起仪表盘导航"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

          {/* Quick Nav Shortcuts (Clay Pill Buttons) */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              核心入口
            </div>

            {/* 1. 任务 */}
            <button
              onClick={() => onNavigateTab('daily')}
              type="button"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-teal-100/80 dark:bg-teal-950/50 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-teal-600 dark:text-teal-400">
                  <Calendar size={14} />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  任务
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                {masteredDaysCount}/28
              </span>
            </button>

            {/* 2. 项目 */}
            <button
              onClick={() => onNavigateTab('reader')}
              type="button"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-amber-100/80 dark:bg-amber-950/50 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-amber-600 dark:text-amber-400">
                  <BookOpen size={14} />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  项目
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                {masteredArticles}/{totalArticles}
              </span>
            </button>

            {/* 3. 算法 */}
            <button
              onClick={() => onNavigateTab('algo')}
              type="button"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-purple-100/80 dark:bg-purple-950/50 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-purple-600 dark:text-purple-400">
                  <CheckSquare size={14} />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  算法
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                {completedAlgos}/{totalAlgos}
              </span>
            </button>

            {/* 4. 学习系统 */}
            <button
              onClick={() => onNavigateTab('learning')}
              type="button"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-indigo-100/80 dark:bg-indigo-950/50 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-indigo-600 dark:text-indigo-400">
                  <Bookmark size={14} />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  学习系统
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                6 模块
              </span>
            </button>

            {/* 5. 源码路线 */}
            <button
              onClick={() => onNavigateTab('source')}
              type="button"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-amber-100/80 dark:bg-amber-950/50 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-amber-600 dark:text-amber-400">
                  <Layers size={14} />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  源码路线
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                28 节点
              </span>
            </button>

            {/* 6. 其他 */}
            <button
              onClick={() => onNavigateTab('practice')}
              type="button"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-cyan-100/80 dark:bg-cyan-950/50 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-cyan-600 dark:text-cyan-400">
                  <Briefcase size={14} />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  其他
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                4 专项
              </span>
            </button>
          </div>

          {/* 4 Weeks Summary (Clay Progress Tracks) */}
          <div className="space-y-2.5 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              阶段进度
            </div>
            {calendarRows.map(w => {
              const wMastered = w.days.filter(d => (dayMastery[d.day] || 0) >= 4).length;
              const pct = Math.round((wMastered / 7) * 100);
              return (
                <div
                  key={w.week}
                  className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/50 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>{w.label}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[10px] font-mono text-slate-500 shrink-0">
                      {wMastered}/7
                    </span>
                  </div>
                  {/* Clay Inset Progress Track */}
                  <div className="w-full h-2 rounded-full bg-slate-200/70 dark:bg-slate-900/70 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 shadow-xs transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Muduo Archived State (Clay Mini Card) */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-100/50 via-amber-50 to-orange-100/40 dark:from-amber-950/30 dark:to-orange-950/20 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
              <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-amber-200/70 dark:bg-amber-900/50 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-amber-700 dark:text-amber-300">
                <Archive size={13} />
              </div>
              <span>Muduo 网络库 (已归档)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-200/50 dark:bg-amber-900/40 text-[10px] text-amber-800 dark:text-amber-300 font-bold font-mono">
              8 阶段
            </span>
          </div>
        </aside>
      )}

      {/* ========================================================= */}
      {/* CENTER COLUMN: Calendar Matrix & Topology (Fluid Full)    */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-0 space-y-8 overflow-y-auto w-full">
        {/* Workspace Header */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] text-sky-600 dark:text-sky-400">
              <Activity size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                仪表盘
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                高性能 C++ 网络与 AI 推理服务学习控制台
              </p>
            </div>
          </div>
        </div>

        {/* StyleKit Claymorphism 3 Distinct Metric Cards (粘土拟态 3 独立糖果色卡片) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. 任务体系 (Mint Clay 薄荷绿) */}
          <div
            onClick={() => onNavigateTab('daily')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigateTab('daily');
              }
            }}
            className="bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100 dark:from-emerald-950/40 dark:via-teal-900/30 dark:to-green-900/40 rounded-3xl p-6 flex flex-col justify-between border-0 border-transparent shadow-[8px_8px_16px_rgba(0,0,0,0.08),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.06)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[12px_12px_24px_rgba(0,0,0,0.12),inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.08)] active:scale-x-105 active:scale-y-90 active:shadow-[2px_2px_4px_rgba(0,0,0,0.05),inset_8px_8px_16px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer select-none group"
            title="点击进入任务体系"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-800 dark:text-teal-200 uppercase tracking-wider">
                任务体系
              </span>
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-white/70 dark:bg-emerald-900/40 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] text-teal-700 dark:text-teal-300">
                <Calendar size={17} />
              </div>
            </div>

            <div className="my-4">
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-teal-900 dark:text-teal-100 tabular-nums">
                {masteredDaysCount}
                <span className="text-sm font-semibold font-mono text-teal-700/80 dark:text-teal-300/80 ml-1.5">
                  / 28 天
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-teal-700 dark:text-teal-300 font-medium">吃透进度</span>
                <span className="font-mono font-bold text-teal-900 dark:text-teal-100">
                  {Math.round((masteredDaysCount / 28) * 100)}%
                </span>
              </div>
              {/* 粘土内凹微进度槽 */}
              <div
                className="w-full h-2.5 rounded-full bg-emerald-200/50 dark:bg-emerald-950/60 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] overflow-hidden p-0.5"
                title={`任务吃透率: ${Math.round((masteredDaysCount / 28) * 100)}%`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xs transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{ width: `${Math.round((masteredDaysCount / 28) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 2. 项目剖析 (Amber/Cream Clay 奶油暖橙) */}
          <div
            onClick={() => onNavigateTab('reader')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigateTab('reader');
              }
            }}
            className="bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-950/40 dark:via-orange-900/30 dark:to-yellow-900/40 rounded-3xl p-6 flex flex-col justify-between border-0 border-transparent shadow-[8px_8px_16px_rgba(0,0,0,0.08),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.06)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[12px_12px_24px_rgba(0,0,0,0.12),inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.08)] active:scale-x-105 active:scale-y-90 active:shadow-[2px_2px_4px_rgba(0,0,0,0.05),inset_8px_8px_16px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer select-none group"
            title="点击进入项目专栏"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider">
                项目剖析
              </span>
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-white/70 dark:bg-amber-900/40 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] text-amber-700 dark:text-amber-300">
                <BookOpen size={17} />
              </div>
            </div>

            <div className="my-4">
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-amber-900 dark:text-amber-100 tabular-nums">
                {masteredArticles}
                <span className="text-sm font-semibold font-mono text-amber-700/80 dark:text-amber-300/80 ml-1.5">
                  / {totalArticles} 篇
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-700 dark:text-amber-300 font-medium">专栏精读</span>
                <span className="font-mono font-bold text-amber-900 dark:text-amber-100">
                  {Math.round((masteredArticles / totalArticles) * 100)}%
                </span>
              </div>
              <div
                className="w-full h-2.5 rounded-full bg-amber-200/50 dark:bg-amber-950/60 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] overflow-hidden p-0.5"
                title={`项目专栏精读进度: ${Math.round((masteredArticles / totalArticles) * 100)}%`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-xs transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{ width: `${Math.round((masteredArticles / totalArticles) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3. 算法题库 (Lilac/Purple Clay 丁香淡紫) */}
          <div
            onClick={() => onNavigateTab('algo')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigateTab('algo');
              }
            }}
            className="bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 dark:from-purple-950/40 dark:via-pink-900/30 dark:to-indigo-900/40 rounded-3xl p-6 flex flex-col justify-between border-0 border-transparent shadow-[8px_8px_16px_rgba(0,0,0,0.08),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.06)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[12px_12px_24px_rgba(0,0,0,0.12),inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.08)] active:scale-x-105 active:scale-y-90 active:shadow-[2px_2px_4px_rgba(0,0,0,0.05),inset_8px_8px_16px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer select-none group"
            title="点击进入算法题库"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-800 dark:text-purple-200 uppercase tracking-wider">
                算法题库
              </span>
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-white/70 dark:bg-purple-900/40 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] text-purple-700 dark:text-purple-300">
                <CheckSquare size={17} />
              </div>
            </div>

            <div className="my-4">
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-purple-900 dark:text-purple-100 tabular-nums">
                {completedAlgos}
                <span className="text-sm font-semibold font-mono text-purple-700/80 dark:text-purple-300/80 ml-1.5">
                  / {totalAlgos} 题
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-700 dark:text-purple-300 font-medium">Hot 100 & 随想录</span>
                <span className="font-mono font-bold text-purple-900 dark:text-purple-100">
                  {Math.round((completedAlgos / totalAlgos) * 100)}%
                </span>
              </div>
              <div
                className="w-full h-2.5 rounded-full bg-purple-200/50 dark:bg-purple-950/60 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] overflow-hidden p-0.5"
                title={`算法题库完成率: ${Math.round((completedAlgos / totalAlgos) * 100)}%`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-xs transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{ width: `${Math.round((completedAlgos / totalAlgos) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 28-Day Task Calendar: 任务日历 (Clay Bricks 粘土微砖矩阵 4 Rows x 7 Columns) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-teal-100/90 dark:bg-teal-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-teal-600 dark:text-teal-400">
                <Calendar size={16} />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                任务日历
              </h2>
            </div>
            {/* 3D Clay Legend Beads */}
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.1)]" />
                已吃透
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-sky-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.1)]" />
                学习中
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.1)]" />
                未开始
              </span>
            </div>
          </div>

          {/* 4 Rows x 7 Columns Direct Jump Clay Matrix */}
          <div className="space-y-4">
            {calendarRows.map(row => (
              <div key={row.week} className="space-y-2">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                  {row.label}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {row.days.map(d => {
                    const mastery = dayMastery[d.day] || 0;
                    const isMastered = mastery >= 4;
                    const isLearning = mastery >= 1 && mastery < 4;
                    const shortTitle = SHORT_DAY_TITLES[d.day] || d.title;

                    return (
                      <button
                        key={d.day}
                        onClick={() => onNavigateToDay(d.day)}
                        type="button"
                        className={`p-3 rounded-2xl text-left transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex flex-col justify-between min-h-[5.25rem] active:scale-x-105 active:scale-y-90 hover:-translate-y-1 select-none group ${
                          isMastered
                            ? 'bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100 dark:from-emerald-950/60 dark:via-teal-900/50 dark:to-green-900/60 text-teal-950 dark:text-teal-100 shadow-[6px_6px_14px_rgba(16,185,129,0.12),inset_3px_3px_6px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.06)] hover:shadow-[8px_8px_18px_rgba(16,185,129,0.2),inset_3px_3px_6px_rgba(255,255,255,0.9)] active:shadow-[2px_2px_4px_rgba(0,0,0,0.08),inset_6px_6px_12px_rgba(0,0,0,0.15)]'
                            : isLearning
                            ? 'bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 dark:from-sky-950/60 dark:via-blue-900/50 dark:to-cyan-900/60 text-sky-950 dark:text-sky-100 shadow-[6px_6px_14px_rgba(14,165,233,0.12),inset_3px_3px_6px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.06)] hover:shadow-[8px_8px_18px_rgba(14,165,233,0.2),inset_3px_3px_6px_rgba(255,255,255,0.9)] active:shadow-[2px_2px_4px_rgba(0,0,0,0.08),inset_6px_6px_12px_rgba(0,0,0,0.15)]'
                            : 'bg-gradient-to-br from-white via-[#f8fafc] to-[#edf1f7] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-850/90 text-slate-800 dark:text-slate-200 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.85),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] hover:shadow-[8px_8px_18px_rgba(0,0,0,0.08),inset_3px_3px_6px_rgba(255,255,255,0.95)] active:shadow-[2px_2px_4px_rgba(0,0,0,0.08),inset_6px_6px_12px_rgba(0,0,0,0.1)]'
                        }`}
                        title={`Day ${d.day}: ${d.title} (点击直达攻坚)`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${
                              isMastered
                                ? 'bg-white/80 dark:bg-emerald-900/60 text-teal-800 dark:text-teal-200 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]'
                                : isLearning
                                ? 'bg-white/80 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]'
                                : 'bg-slate-100/90 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]'
                            }`}
                          >
                            D{d.day < 10 ? `0${d.day}` : d.day}
                          </span>
                          {isMastered ? (
                            <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 flex items-center gap-0.5">
                              <Check size={11} strokeWidth={3} />
                              <span>已吃透</span>
                            </span>
                          ) : isLearning ? (
                            <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300">
                              学习中
                            </span>
                          ) : (
                            <ChevronRight size={12} className="text-slate-300 dark:text-slate-600 group-hover:text-sky-500 transition-colors" />
                          )}
                        </div>

                        <div
                          className={`text-xs font-bold truncate mt-2 ${
                            isMastered
                              ? 'text-teal-950 dark:text-teal-100'
                              : isLearning
                              ? 'text-sky-950 dark:text-sky-100'
                              : 'text-slate-700 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400'
                          }`}
                        >
                          {shortTitle}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CppAIService Architecture Interactive Nodes (Clay Chips 粘土芯片) */}
        <section className="space-y-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-100/90 dark:bg-indigo-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-indigo-600 dark:text-indigo-400">
                <Layers size={16} />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                CppAIService 核心架构
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 font-mono text-xs">
            {CPPAI_CORE_MODULES.map(item => {
              const matchedModule =
                DOMAIN_MODULES.find(
                  m =>
                    m.id === item.id ||
                    m.classes?.includes(item.name) ||
                    m.name.toLowerCase().startsWith(item.name.toLowerCase())
                ) || {
                  id: item.id,
                  projectId: 'proj_cppai',
                  name: item.name,
                  layer: item.layer,
                  responsibility: item.desc,
                  desc: item.desc,
                  classes: [item.name],
                  functions: ['init()', 'process()'],
                  keyConcepts: ['高并发', '异步计算'],
                  threadModel: '多工作线程独占/共享'
                };

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTopologyModule(matchedModule)}
                  type="button"
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-white via-[#f8fafc] to-[#edf1f7] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-850/90 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.85),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] hover:shadow-[8px_8px_18px_rgba(0,0,0,0.08)] hover:-translate-y-1 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-left cursor-pointer group select-none"
                >
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 flex items-center justify-between">
                    <span className="truncate">{item.name}</span>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition shrink-0 text-sky-500" />
                  </div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 font-bold mt-1">
                    {item.layer}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-sans">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Responsive Fallback: On screens < xl, show Focus Timer & Routine List in Clay Cards at the bottom */}
        <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <div id="dashboard-focus-timer-mobile" className="rounded-3xl p-5 bg-[#f8fafc]/90 dark:bg-slate-850/80 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.25),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]">
            <FocusTimer />
          </div>
          <div className="rounded-3xl p-5 bg-[#f8fafc]/90 dark:bg-slate-850/80 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.25),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]">
            <TaskRoutineList onNavigateTab={onNavigateTab} />
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: Focus Timer & Daily Checklist (Clay Panel)  */}
      {/* ========================================================= */}
      <aside className="w-80 shrink-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 space-y-5 overflow-y-auto sticky top-18 h-[calc(100vh-5.5rem)] hidden xl:block select-none transition-all duration-300">
        {/* Real Focus Timer */}
        <div id="dashboard-focus-timer" className="rounded-3xl p-4 bg-white/70 dark:bg-slate-800/50 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.04)] transition-all duration-300">
          <FocusTimer />
        </div>

        {/* Daily Routine Check List */}
        <div className="rounded-3xl p-4 bg-white/70 dark:bg-slate-800/50 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.04)] transition-all duration-300">
          <TaskRoutineList onNavigateTab={onNavigateTab} />
        </div>
      </aside>
    </div>
  );
};

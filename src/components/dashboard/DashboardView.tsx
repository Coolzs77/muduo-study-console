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
  Clock,
  Layers,
  Archive,
  ChevronRight,
  BookOpen,
  Bookmark,
  Briefcase,
  Activity,
  PanelLeftClose,
  PanelLeftOpen
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
  const [todayMins] = useLocalStorage<number>('todayStudyMinutes', 0);
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
    <div className="flex w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950">
      {/* ========================================================= */}
      {/* LEFT COLUMN: Concise Overview & Navigation (Collapsible)   */}
      {/* ========================================================= */}
      {isSidebarCollapsed ? (
        <aside className="w-14 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 py-3.5 flex flex-col items-center space-y-3 sticky top-16 h-[calc(100vh-4rem)] hidden md:flex select-none transition-all duration-300">
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer active-press"
            title="展开仪表盘导航"
          >
            <PanelLeftOpen size={18} />
          </button>

          <div className="w-8 h-px bg-slate-200 dark:bg-slate-800" />

          {/* Quick Nav Dock */}
          <div className="flex flex-col items-center space-y-2 text-slate-600 dark:text-slate-400">
            <button
              onClick={() => onNavigateTab('daily')}
              className="p-2 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer active-press"
              title={`任务 (${masteredDaysCount}/28)`}
            >
              <Calendar size={18} />
            </button>
            <button
              onClick={() => onNavigateTab('reader')}
              className="p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer active-press"
              title={`项目 (${masteredArticles}/${totalArticles})`}
            >
              <BookOpen size={18} />
            </button>
            <button
              onClick={() => onNavigateTab('algo')}
              className="p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-600 dark:hover:text-purple-400 transition cursor-pointer active-press"
              title={`算法 (${completedAlgos}/${totalAlgos})`}
            >
              <CheckSquare size={18} />
            </button>
            <button
              onClick={() => onNavigateTab('learning')}
              className="p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer active-press"
              title="学习系统"
            >
              <Bookmark size={18} />
            </button>
            <button
              onClick={() => onNavigateTab('source')}
              className="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/60 hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer active-press"
              title="源码路线"
            >
              <Layers size={18} />
            </button>
            <button
              onClick={() => onNavigateTab('practice')}
              className="p-2 rounded-xl hover:bg-cyan-50 dark:hover:bg-cyan-950/60 hover:text-cyan-600 dark:hover:text-cyan-400 transition cursor-pointer active-press"
              title="其他 / 归档"
            >
              <Briefcase size={18} />
            </button>
          </div>
        </aside>
      ) : (
        <aside className="w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-5 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)] hidden md:block transition-all duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={16} className="text-sky-600 dark:text-sky-400" />
              <span>仪表盘</span>
            </h2>
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer active-press"
              title="收起仪表盘导航"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

        {/* Quick Nav Shortcuts - Matching exact Header order: 任务, 项目, 算法, 学习系统, 源码路线, 其他 */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            导航
          </div>

          {/* 1. 任务 */}
          <button
            onClick={() => onNavigateTab('daily')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-sky-500 hover:text-sky-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left active-press smooth-hover"
          >
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-sky-500" />
              <span>任务</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {masteredDaysCount}/28
            </span>
          </button>

          {/* 2. 项目 */}
          <button
            onClick={() => onNavigateTab('reader')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-emerald-500 hover:text-emerald-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left active-press smooth-hover"
          >
            <div className="flex items-center gap-2">
              <BookOpen size={14} className="text-emerald-500" />
              <span>项目</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {masteredArticles}/{totalArticles}
            </span>
          </button>

          {/* 3. 算法 */}
          <button
            onClick={() => onNavigateTab('algo')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-purple-500 hover:text-purple-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left active-press smooth-hover"
          >
            <div className="flex items-center gap-2">
              <CheckSquare size={14} className="text-purple-500" />
              <span>算法</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {completedAlgos}/{totalAlgos}
            </span>
          </button>

          {/* 4. 学习系统 */}
          <button
            onClick={() => onNavigateTab('learning')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-500 hover:text-indigo-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left active-press smooth-hover"
          >
            <div className="flex items-center gap-2">
              <Bookmark size={14} className="text-indigo-500" />
              <span>学习系统</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              6 模块
            </span>
          </button>

          {/* 5. 源码路线 */}
          <button
            onClick={() => onNavigateTab('source')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-amber-500 hover:text-amber-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left active-press smooth-hover"
          >
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-amber-500" />
              <span>源码路线</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              28 节点
            </span>
          </button>

          {/* 6. 其他 */}
          <button
            onClick={() => onNavigateTab('practice')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-cyan-500 hover:text-cyan-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left active-press smooth-hover"
          >
            <div className="flex items-center gap-2">
              <Briefcase size={14} className="text-cyan-500" />
              <span>其他</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              4 专项
            </span>
          </button>
        </div>

        {/* 4 Weeks Summary */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            阶段进度
          </div>
          {calendarRows.map(w => {
            const wMastered = w.days.filter(d => (dayMastery[d.day] || 0) >= 4).length;
            const pct = Math.round((wMastered / 7) * 100);
            return (
              <div
                key={w.week}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/50 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>{w.label}</span>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {wMastered}/7
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Muduo Archived State */}
        <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
            <Archive size={14} className="text-amber-500" />
            <span>Muduo 网络库 (已归档)</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
            8 阶段
          </span>
        </div>
      </aside>
      )}

      {/* ========================================================= */}
      {/* CENTER COLUMN: Calendar Matrix & Topology (Fluid Full)    */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-8 overflow-y-auto w-full">
        {/* Workspace Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            仪表盘
          </h1>
        </div>

        {/* 4 Bento KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* 任务 */}
          <div
            onClick={() => onNavigateTab('daily')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 transition-all cursor-pointer group shadow-2xs smooth-hover active-press"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">任务</span>
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                <Calendar size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {masteredDaysCount} <span className="text-xs font-normal text-slate-400 font-mono">/ 28 天</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>已吃透 {masteredDaysCount} 天</span>
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                {Math.round((masteredDaysCount / 28) * 100)}%
              </span>
            </div>
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.round((masteredDaysCount / 28) * 100)}%` }}
              />
            </div>
          </div>

          {/* 项目 */}
          <div
            onClick={() => onNavigateTab('reader')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer group shadow-2xs smooth-hover active-press"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">项目</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <BookOpen size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {masteredArticles} <span className="text-xs font-normal text-slate-400 font-mono">/ {totalArticles} 篇</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>专栏架构剖析</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((masteredArticles / totalArticles) * 100)}%
              </span>
            </div>
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.round((masteredArticles / totalArticles) * 100)}%` }}
              />
            </div>
          </div>

          {/* 算法 */}
          <div
            onClick={() => onNavigateTab('algo')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer group shadow-2xs smooth-hover active-press"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">算法</span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <CheckSquare size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {completedAlgos} <span className="text-xs font-normal text-slate-400 font-mono">/ {totalAlgos} 题</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Hot 100 & 随想录</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                {Math.round((completedAlgos / totalAlgos) * 100)}%
              </span>
            </div>
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.round((completedAlgos / totalAlgos) * 100)}%` }}
              />
            </div>
          </div>

          {/* 专注 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs smooth-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">专注</span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Clock size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {todayMins} <span className="text-xs font-normal text-slate-400 font-mono">分钟</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              今日累计沉浸学习
            </div>
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((todayMins / 120) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* 28-Day Task Calendar: 任务日历 (4 Rows x 7 Columns with concise task names and direct 1-click jump) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-sky-600 dark:text-sky-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                任务日历
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> 已吃透
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> 学习中
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600" /> 未开始
              </span>
            </div>
          </div>

          {/* 4 Rows x 7 Columns Direct Jump Matrix */}
          <div className="space-y-3">
            {calendarRows.map(row => (
              <div key={row.week} className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-0.5">
                  {row.label}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
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
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[5.25rem] active-press smooth-hover group ${
                          isMastered
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : isLearning
                            ? 'bg-sky-500 hover:bg-sky-600 text-white border-sky-600 shadow-xs'
                            : 'bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 text-slate-800 dark:text-slate-200'
                        }`}
                        title={`Day ${d.day}: ${d.title} (点击直达攻坚)`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isMastered || isLearning
                                ? 'bg-black/20 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            D{d.day < 10 ? `0${d.day}` : d.day}
                          </span>
                          {isMastered ? (
                            <span className="text-[10px] opacity-90 font-medium">✓ 已吃透</span>
                          ) : isLearning ? (
                            <span className="text-[10px] opacity-90 font-medium">学习中</span>
                          ) : (
                            <ChevronRight size={12} className="text-slate-300 dark:text-slate-600 group-hover:text-sky-500 transition-colors" />
                          )}
                        </div>

                        <div
                          className={`text-xs font-semibold line-clamp-2 leading-tight mt-1.5 ${
                            isMastered || isLearning
                              ? 'text-white'
                              : 'text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400'
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

        {/* CppAIService Architecture Interactive Nodes */}
        <section className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-sky-600 dark:text-sky-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                CppAIService 架构
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
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
                  className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 text-left cursor-pointer transition group active-press smooth-hover"
                >
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-sky-600 flex items-center justify-between">
                    <span className="truncate">{item.name}</span>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition shrink-0" />
                  </div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold mt-1">
                    {item.layer}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: Focus Timer & Daily Checklist               */}
      {/* ========================================================= */}
      <aside className="w-80 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-5 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)] hidden xl:block">
        {/* Real Focus Timer */}
        <div className="bg-white dark:bg-slate-900/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <FocusTimer />
        </div>

        {/* Daily Routine Check List */}
        <div className="bg-white dark:bg-slate-900/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <TaskRoutineList onNavigateTab={onNavigateTab} />
        </div>
      </aside>
    </div>
  );
};

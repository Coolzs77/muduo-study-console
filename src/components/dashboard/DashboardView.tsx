import React, { useMemo } from 'react';
import { ActiveTab, DomainModule } from '../../types';
import { YUQUE_DATASET } from '../../data/yuqueDataset';
import { ALGORITHM_LAB_CATALOG } from '../../data/algoDataset';
import { DAYS_DATASET } from '../../data/daysDataset';
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
  Code2,
  CheckCircle2,
  Activity
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
      {/* LEFT COLUMN: Concise Overview & Navigation                */}
      {/* ========================================================= */}
      <aside className="w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-5 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)] hidden md:block">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity size={16} className="text-sky-600 dark:text-sky-400" />
            <span>仪表盘</span>
          </h2>
        </div>

        {/* Quick Nav Shortcuts */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            导航
          </div>
          <button
            onClick={() => onNavigateTab('daily')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-sky-500 hover:text-sky-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-sky-500" />
              <span>任务</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {masteredDaysCount}/28
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('reader')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-emerald-500 hover:text-emerald-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <BookOpen size={14} className="text-emerald-500" />
              <span>项目</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {masteredArticles}/{totalArticles}
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('algo')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-purple-500 hover:text-purple-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <CheckSquare size={14} className="text-purple-500" />
              <span>算法</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {completedAlgos}/{totalAlgos}
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('source')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-amber-500 hover:text-amber-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Code2 size={14} className="text-amber-500" />
              <span>源码路线</span>
            </div>
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

      {/* ========================================================= */}
      {/* CENTER COLUMN: Calendar Matrix & Topology                 */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* Workspace Header - Clean and Concise */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            仪表盘
          </h1>
        </div>

        {/* 4 Summary Stats Bar - Concise */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">任务</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {masteredDaysCount} <span className="text-xs font-normal text-slate-400">/ 28</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">项目</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {masteredArticles} <span className="text-xs font-normal text-slate-400">/ {totalArticles}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">算法</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {completedAlgos} <span className="text-xs font-normal text-slate-400">/ {totalAlgos}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">专注</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {todayMins} <span className="text-xs font-normal text-slate-400">分钟</span>
            </div>
          </div>
        </div>

        {/* 28-Day Task Calendar: 4 Rows x 7 Columns Calendar Matrix */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-sky-600 dark:text-sky-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                28天任务日历
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> 已吃透
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-500" /> 进行中
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" /> 未开始
              </span>
            </div>
          </div>

          {/* 4 Rows x 7 Columns Calendar Grid */}
          <div className="space-y-3">
            {calendarRows.map(row => (
              <div key={row.week} className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-0.5">
                  {row.label}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {row.days.map(d => {
                    const mastery = dayMastery[d.day] || 0;
                    const isMastered = mastery >= 4;
                    const isLearning = mastery >= 1 && mastery < 4;

                    return (
                      <button
                        key={d.day}
                        onClick={() => onNavigateToDay(d.day)}
                        type="button"
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between h-20 group ${
                          isMastered
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/60 hover:border-emerald-500'
                            : isLearning
                            ? 'bg-sky-50/40 dark:bg-sky-950/20 border-sky-300/80 dark:border-sky-800/60 hover:border-sky-500'
                            : 'bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                        }`}
                        title={`Day ${d.day}: ${d.title}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                              isMastered
                                ? 'bg-emerald-500 text-white'
                                : isLearning
                                ? 'bg-sky-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            D{d.day < 10 ? `0${d.day}` : d.day}
                          </span>
                          {isMastered ? (
                            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                          ) : isLearning ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                          ) : null}
                        </div>

                        <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight group-hover:text-sky-600 transition">
                          {d.title}
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
                  className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 text-left cursor-pointer transition group"
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
      {/* RIGHT COLUMN: Focus Timer & Daily Checklist (Optimized)   */}
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

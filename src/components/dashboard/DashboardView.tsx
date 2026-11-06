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
  ArrowRight,
  Sparkles,
  Layers,
  Archive,
  ChevronRight,
  BookOpen,
  Code2,
  CheckCircle2,
  Circle,
  Activity,
  Flame,
  Star
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

  const hot100Completed = ALGORITHM_LAB_CATALOG.filter(p => {
    if (!p.isHot100) return false;
    if (p.num !== null && p.num !== undefined) {
      return !!completedMap[p.num] || !!completedMap[String(p.num)];
    }
    return p.id ? !!completedMap[p.id] : false;
  }).length;

  // 28 days stats
  const masteredDaysCount = useMemo(() => {
    return Object.values(dayMastery).filter(lvl => lvl >= 4).length;
  }, [dayMastery]);

  const learningDaysCount = useMemo(() => {
    return Object.values(dayMastery).filter(lvl => lvl >= 1 && lvl < 4).length;
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

  // 4 Weeks groups
  const weeks = useMemo(() => {
    return [
      { week: 1, title: '第 1 周：基础框架与协议解析', days: DAYS_DATASET.slice(0, 7) },
      { week: 2, title: '第 2 周：存储池化与工程中间件', days: DAYS_DATASET.slice(7, 14) },
      { week: 3, title: '第 3 周：智能推理引擎与异步队列', days: DAYS_DATASET.slice(14, 21) },
      { week: 4, title: '第 4 周：视觉与会话全栈进阶', days: DAYS_DATASET.slice(21, 28) }
    ];
  }, []);

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950">
      {/* ========================================================= */}
      {/* LEFT COLUMN: Overview, Quick Navigation & Week Roadmap   */}
      {/* ========================================================= */}
      <aside className="w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-5 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)] hidden md:block">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity size={16} className="text-sky-600 dark:text-sky-400" />
            <span>仪表盘全景总览</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            快速跳转与 4 阶段学习进度概览
          </p>
        </div>

        {/* Quick Nav Shortcuts */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            快捷工作台通道
          </div>
          <button
            onClick={() => onNavigateTab('daily')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-sky-500 hover:text-sky-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-sky-500" />
              <span>28天开发任务</span>
            </div>
            <span className="text-[11px] text-slate-400 group-hover:text-sky-500">
              {masteredDaysCount}/28 天
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('reader')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-emerald-500 hover:text-emerald-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2">
              <BookOpen size={14} className="text-emerald-500" />
              <span>专栏项目文章</span>
            </div>
            <span className="text-[11px] text-slate-400 group-hover:text-emerald-500">
              {masteredArticles}/{totalArticles} 篇
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('algo')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-purple-500 hover:text-purple-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2">
              <CheckSquare size={14} className="text-purple-500" />
              <span>算法题库工作台</span>
            </div>
            <span className="text-[11px] text-slate-400 group-hover:text-purple-500">
              {completedAlgos}/{totalAlgos} 题
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('source')}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-amber-500 hover:text-amber-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2">
              <Code2 size={14} className="text-amber-500" />
              <span>源码路线与文件</span>
            </div>
            <ArrowRight size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition" />
          </button>
        </div>

        {/* 4 Weeks Summary */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            28 天周期阶段进度
          </div>
          {weeks.map(w => {
            const wMastered = w.days.filter(d => (dayMastery[d.day] || 0) >= 4).length;
            const pct = Math.round((wMastered / 7) * 100);
            return (
              <div
                key={w.week}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/50 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="truncate">{w.title}</span>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0 ml-1">
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
        <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
            <Archive size={14} className="text-amber-500" />
            <span>Muduo 基础网络库</span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
            L4 传输层已完结封板，作为上层应用与 CppAIService 推理服务的稳定支撑。
          </p>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* CENTER COLUMN: Clean Workspace (Tasks List + Topology)    */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* Workspace Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>Muduo & CppAIService</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            仪表盘
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            系统当前汇集 28 天真实开发路线、Kama-HTTPServer 架构演进与 CppAIService 高并发推理服务。
          </p>
        </div>

        {/* 4 Summary Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">28天任务已完成</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {masteredDaysCount} <span className="text-xs font-normal text-slate-400">/ 28 天</span>
            </div>
            <div className="text-[11px] text-sky-600 dark:text-sky-400 mt-0.5 font-medium">
              学习中: {learningDaysCount} 天
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">专栏项目篇章</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {masteredArticles} <span className="text-xs font-normal text-slate-400">/ {totalArticles} 篇</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
              吃透率: {Math.round((masteredArticles / (totalArticles || 1)) * 100)}%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">核心算法完成</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {completedAlgos} <span className="text-xs font-normal text-slate-400">/ {totalAlgos} 题</span>
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-0.5 font-medium">
              Hot 100: {hot100Completed} / 100
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">今日专注时长</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {todayMins} <span className="text-xs font-normal text-slate-400">分钟</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              约 {(todayMins / 60).toFixed(1)} 小时 (真实计时)
            </div>
          </div>
        </div>

        {/* 28-Day Tasks Workbench: Clear titles and status, strictly no fake cards or numbers-only boxes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-sky-600 dark:text-sky-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                28 天完整任务清单 (点击条目进入深度学习)
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              已吃透: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{masteredDaysCount}</strong> / 28
            </span>
          </div>

          {/* List grouped by 4 Weeks */}
          <div className="space-y-6">
            {weeks.map(w => (
              <div key={w.week} className="space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between px-1">
                  <span>{w.title}</span>
                  <span className="text-[11px] text-slate-400 font-normal">共 7 天任务</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {w.days.map(d => {
                    const mastery = dayMastery[d.day] || 0;
                    const isMastered = mastery >= 4;
                    const isLearning = mastery >= 1 && mastery < 4;

                    return (
                      <div
                        key={d.day}
                        onClick={() => onNavigateToDay(d.day)}
                        className={`p-3 rounded-xl border transition cursor-pointer text-left flex items-start justify-between gap-3 ${
                          isMastered
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/60 hover:border-emerald-500'
                            : isLearning
                            ? 'bg-sky-50/40 dark:bg-sky-950/20 border-sky-300/80 dark:border-sky-800/60 hover:border-sky-500'
                            : 'bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold shrink-0 mt-0.5 ${
                              isMastered
                                ? 'bg-emerald-500 text-white'
                                : isLearning
                                ? 'bg-sky-500 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            Day {d.day < 10 ? `0${d.day}` : d.day}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {d.title}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {d.coreModule || d.summary}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {isMastered ? (
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={13} />
                              <span>已吃透</span>
                            </span>
                          ) : isLearning ? (
                            <span className="text-[11px] font-medium text-sky-600 dark:text-sky-400">
                              掌握度 {mastery}星
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">未开始</span>
                          )}
                          <ChevronRight size={14} className="text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CppAIService Architecture Topology Interactive Nodes */}
        <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-sky-600 dark:text-sky-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                CppAIService 核心架构组件
              </h2>
            </div>
            <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
              C++20 高并发推理架构
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            CppAIService 聚焦于大模型与多模态模型的高吞吐低延迟推理调度。点击组件查看源码实现与并发模型：
          </p>

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
      {/* RIGHT COLUMN: Real Focus Timer & Routine Action List      */}
      {/* ========================================================= */}
      <aside className="w-80 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-6 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)] hidden xl:block">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock size={16} className="text-purple-600" />
            <span>专注计时与日常清单</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            真实学习计时（杜绝虚构统计）
          </p>
        </div>

        {/* Real Focus Timer */}
        <div className="bg-white dark:bg-slate-900/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800">
          <FocusTimer />
        </div>

        {/* Daily Routine Check List */}
        <div className="bg-white dark:bg-slate-900/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800">
          <TaskRoutineList onNavigateTab={onNavigateTab} />
        </div>
      </aside>
    </div>
  );
};

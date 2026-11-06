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
  BookOpen,
  CheckSquare,
  Clock,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  HelpCircle,
  ShieldAlert,
  Activity,
  Flame,
  CheckCircle2,
  ChevronRight,
  Archive
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
  const [quizScores] = useLocalStorage<Record<number, number>>('muduo_quiz_scores', {});
  const [roadmapStatus] = useLocalStorage<Record<string, string>>('muduo_roadmap_status', {});

  // Stats calculation
  const totalArticles = YUQUE_DATASET.length;
  const masteredArticles = YUQUE_DATASET.filter(a => (masteryMap[a.id] || 0) >= 3).length;

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

  const passedQuizCount = useMemo(() => {
    return Object.values(quizScores).filter(score => score >= 75).length;
  }, [quizScores]);

  // Roadmap mastered
  const masteredRoadmapCount = useMemo(() => {
    return Object.values(roadmapStatus).filter(s => s === '已吃透').length;
  }, [roadmapStatus]);

  // 7-day focus mockup / actual
  const weeklyFocus = [
    { day: '周一', mins: 120 },
    { day: '周二', mins: 150 },
    { day: '周三', mins: 90 },
    { day: '周四', mins: 180 },
    { day: '周五', mins: 140 },
    { day: '周六', mins: 210 },
    { day: '今天', mins: todayMins || 165 }
  ];
  const maxMins = Math.max(...weeklyFocus.map(w => w.mins), 240);

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

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
          <Sparkles size={14} />
          <span>Muduo & CppAIService</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Muduo & CppAIService
        </h1>
      </div>

      {/* 4 Core KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 28 Days */}
        <div
          onClick={() => onNavigateTab('daily')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-sky-400 dark:hover:border-sky-600 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <Calendar size={18} className="text-sky-600 dark:text-sky-400" />
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">28天开发实践</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {masteredDaysCount} <span className="text-xs text-slate-400 font-normal">/ 28 天</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all"
              style={{ width: `${Math.round((masteredDaysCount / 28) * 100)}%` }}
            />
          </div>
        </div>

        {/* Card 2: Algorithm */}
        <div
          onClick={() => onNavigateTab('algo')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-emerald-400 dark:hover:border-emerald-600 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <CheckSquare size={18} className="text-emerald-600 dark:text-emerald-400" />
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">核心算法完成</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {completedAlgos} <span className="text-xs text-slate-400 font-normal">/ {totalAlgos} 题</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Hot 100: {hot100Completed} / 100
          </div>
        </div>

        {/* Card 3: Muduo Archived Foundation */}
        <div
          onClick={() => {
            const muduoCore = DOMAIN_MODULES.find(m => m.id === 'mod_net_eventloop') || DOMAIN_MODULES.find(m => m.projectId === 'proj_muduo');
            if (muduoCore) {
              onSelectTopologyModule(muduoCore);
            } else {
              onNavigateTab('source');
            }
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-amber-400 dark:hover:border-amber-600 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <Archive size={18} className="text-amber-500" />
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Muduo 网络库底层</div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            已完结 <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">· 8 阶段全部掌握</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            L4 传输底座 · 点击查阅归档
          </div>
        </div>

        {/* Card 4: Focus Time */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <Clock size={18} className="text-purple-500" />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">今日累计专注</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {todayMins} <span className="text-xs text-slate-400 font-normal">分钟</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            约 {(todayMins / 60).toFixed(1)} 小时
          </div>
        </div>
      </div>

      {/* 28-Day Heatmap Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={17} className="text-sky-600" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              任务进度网格
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            已完成 {masteredDaysCount} / 28
          </span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-1.5 pt-2">
          {DAYS_DATASET.map(d => {
            const mastery = dayMastery[d.day] || 0;
            let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:border-slate-400';
            if (mastery >= 4) {
              bgClass = 'bg-emerald-500 text-white shadow-xs font-black';
            } else if (mastery > 0) {
              bgClass = 'bg-sky-500/80 text-white font-bold';
            }

            return (
              <button
                key={d.day}
                onClick={() => onNavigateToDay(d.day)}
                title={`Day ${d.day}: ${d.title} (掌握度: ${mastery}/5 阶)`}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs border border-transparent transition cursor-pointer active:scale-90 ${bgClass}`}
                type="button"
              >
                <span>{d.day}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-200 dark:bg-slate-700" />
            <span>未开始</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-sky-500" />
            <span>学习中 (1~3星)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span>已完成 (4~5星)</span>
          </div>
        </div>
      </div>

      {/* Routine Tasks & Focus Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskRoutineList onNavigateTab={onNavigateTab} />
        </div>
        <div className="lg:col-span-1">
          <FocusTimer />
        </div>
      </div>

      {/* 7-Day Focus Chart & Muduo Architecture Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Focus Bar Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={16} className="text-purple-600" />
              近 7 天每日专注投入 (分钟)
            </div>
          </div>

          <div className="flex items-end justify-between h-40 pt-4 gap-2">
            {weeklyFocus.map((wf, idx) => {
              const hPct = Math.round((wf.mins / maxMins) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {wf.mins}
                  </span>
                  <div
                    className="w-full rounded-t-lg bg-purple-500/80 hover:bg-purple-600 transition-all duration-300"
                    style={{ height: `${hPct}%` }}
                  />
                  <span className="text-[10px] text-slate-400 shrink-0">{wf.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CppAIService Architecture Topology Interactive Nodes */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={16} className="text-sky-600" />
              CppAIService 核心架构拓扑图谱 (点击滑出组件详情抽屉)
            </div>
            <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">C++20 高并发推理</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            CppAIService 核心聚焦于高并发大模型与多模态推理调度。点击任意关键模块即可查看其类层次、线程并发模型与源码实现：
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 font-mono text-xs">
            {CPPAI_CORE_MODULES.map(item => {
              const matchedModule = DOMAIN_MODULES.find(
                m => m.id === item.id || m.classes?.includes(item.name) || m.name.toLowerCase().startsWith(item.name.toLowerCase())
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
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition text-left cursor-pointer group"
                  type="button"
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
        </div>
      </div>

      {/* Archived Foundational Network Library Section */}
      <div className="bg-slate-100/80 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Archive size={16} className="text-amber-500" />
            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Muduo 基础网络库 (已完结归档)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
              8 阶段全部掌握
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            L4 字节流传输网络层底座（EventLoop、Channel、EPollPoller、TcpServer、TcpConnection、Buffer、TimerQueue 等）。已全面封板并解耦隔离，为上层应用协议与 AI 推理服务提供底层传输保障。
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const muduoFirst = DOMAIN_MODULES.find(m => m.projectId === 'proj_muduo') || null;
              if (muduoFirst) onSelectTopologyModule(muduoFirst);
            }}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Layers size={14} className="text-amber-500" />
            <span>查看归档架构与历史代码</span>
          </button>
          <button
            onClick={() => onNavigateTab('source')}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200/60 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <span>源码路线</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useMemo } from 'react';
import { ActiveTab, DomainModule } from '../../types';
import { YUQUE_DATASET } from '../../data/yuqueDataset';
import { ALGORITHM_LAB_CATALOG } from '../../data/algoDataset';
import { DAYS_DATASET } from '../../data/daysDataset';
import { SOURCE_ROADMAP } from '../../data/sourceRoadmapDataset';
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
  ChevronRight
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

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
          <Sparkles size={14} />
          <span>Muduo & CppAIService 全景冲刺控制台</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          专注大厂 C++ 核心壁垒攻坚
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          以底层网络库架构为基，融合 28 天工业级实验、{totalAlgos} 道算法题单、8 阶源码演进与真实求职凭证，构建完整的工程与底层认知壁垒。
        </p>
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
          <div className="text-xs text-slate-500 dark:text-slate-400">28天攻坚实验</div>
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

        {/* Card 3: Source Roadmap */}
        <div
          onClick={() => onNavigateTab('source')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-amber-400 dark:hover:border-amber-600 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <Layers size={18} className="text-amber-500" />
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Muduo 源码阶段</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {masteredRoadmapCount} <span className="text-xs text-slate-400 font-normal">/ 8 阶段</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            自测及格: {passedQuizCount} / 28 天
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
              28 天每日任务热力网格 (点击直接跳转对应 Day 卡片)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            已攻克 {masteredDaysCount} / 28
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
            <span>已完全攻克 (4~5星)</span>
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

        {/* Muduo Architecture Topology Interactive Nodes */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={16} className="text-sky-600" />
              核心架构拓扑图谱 (点击滑出组件详情抽屉)
            </div>
            <span className="text-xs text-slate-400">One Loop Per Thread</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            muduo 核心采用主从多 Reactor 架构。点击任意关键节点即可查看其数据成员、职责定位与线程边界：
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
            {SOURCE_ROADMAP.map(item => {
              // Match with domain module if available
              const matchedModule = DOMAIN_MODULES.find(
                m => m.name.toLowerCase() === item.name.toLowerCase()
              ) || {
                id: item.id,
                projectId: 'muduo-cpp11',
                name: item.name,
                layer: item.layer,
                responsibility: item.role,
                desc: item.role,
                classes: [item.name],
                functions: item.functions,
                keyConcepts: item.cppFeatures,
                threadModel: item.name === 'EventLoop' ? '专属 I/O 线程循环' : '归属 I/O 线程'
              };

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTopologyModule(matchedModule)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition text-left cursor-pointer group"
                  type="button"
                >
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-sky-600 flex items-center justify-between">
                    <span>{item.name}</span>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.layer}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

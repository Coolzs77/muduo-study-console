import React, { useState } from 'react';
import { 
  Trophy, 
  Clock, 
  Repeat, 
  Flame, 
  Layers, 
  Info, 
  ChevronRight, 
  Code2, 
  ShieldAlert, 
  Workflow
} from 'lucide-react';
import { TOPOLOGY_DRAWER_DATA } from '../data/topologyData';
import { DAYS_DATASET } from '../data/muduo28Days';
import { AppState } from '../types';

interface DashboardViewProps {
  appState: AppState;
  onSelectDay: (day: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ appState, onSelectDay }) => {
  const [activeNodeKey, setActiveNodeKey] = useState<string>('loop');

  // 计算关键指标
  const masteryEntries = Object.entries(appState.mastery);
  const completedDays = masteryEntries.filter(([_, m]) => m.level >= 4).length;
  const progressPercent = Math.round((completedDays / 28) * 100);

  // 今日学习分钟数
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMinutes = appState.studySessions
    .filter(s => s.date === todayStr)
    .reduce((acc, s) => acc + s.duration, 0);

  const activeNode = TOPOLOGY_DRAWER_DATA[activeNodeKey] || TOPOLOGY_DRAWER_DATA['loop'];

  return (
    <div className="space-y-6">
      {/* 5大核心指标统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-sky-300 transition">
          <div className="text-xs text-stone-500 font-bold flex items-center justify-between">
            <span>总攻坚进度</span>
            <Trophy className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-sky-950 my-1 font-serifHeading">
            {progressPercent}%
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-700 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition">
          <div className="text-xs text-stone-500 font-bold flex items-center justify-between">
            <span>深度掌握天数</span>
            <Layers className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-800 my-1 font-serifHeading">
            {completedDays} <span className="text-sm font-normal text-stone-500">/ 28 天</span>
          </div>
          <div className="text-[11px] text-stone-400 font-serifMono">
            达到 L4+ 精通标准
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-amber-300 transition">
          <div className="text-xs text-stone-500 font-bold flex items-center justify-between">
            <span>今日学习总时长</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-800 my-1 font-serifHeading">
            {todayMinutes} <span className="text-sm font-normal text-stone-500">分钟</span>
          </div>
          <div className="text-[11px] text-stone-400 font-serifMono">
            含专注与书卷研读
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-rose-300 transition">
          <div className="text-xs text-stone-500 font-bold flex items-center justify-between">
            <span>间隔复习待办</span>
            <Repeat className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-700 my-1 font-serifHeading">
            {DAYS_DATASET.filter(d => (appState.mastery[d.day]?.level || 0) < 3).length} <span className="text-sm font-normal text-stone-500">项</span>
          </div>
          <div className="text-[11px] text-stone-400 font-serifMono">
            艾宾浩斯强化曲线
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition col-span-2 sm:col-span-2 lg:col-span-1">
          <div className="text-xs text-stone-500 font-bold flex items-center justify-between">
            <span>连续攻坚打卡</span>
            <Flame className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-800 my-1 font-serifHeading">
            {Math.max(1, Math.min(28, appState.studySessions.length))} <span className="text-sm font-normal text-stone-500">天</span>
          </div>
          <div className="text-[11px] text-stone-400 font-serifMono">
            保持技术手感
          </div>
        </div>
      </div>

      {/* 核心架构拓扑图交互视窗与节点透视抽屉 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：可点击的 Reactor 多线程交互拓扑 SVG */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-stone-900 text-base font-serifHeading flex items-center gap-2">
                <Workflow className="w-4 h-4 text-sky-700" />
                <span>muduo 核心 Reactor 多线程架构拓扑 (点击节点透视)</span>
              </h3>
              <p className="text-xs text-stone-500 font-serifMono mt-0.5">
                展示 One Loop Per Thread、Channel 分发与非阻塞 Buffer 核心拓扑
              </p>
            </div>
            <span className="text-[11px] bg-sky-50 text-sky-800 px-2.5 py-1 rounded-lg border border-sky-200 font-mono">
              交互流光拓扑
            </span>
          </div>

          <div className="relative border border-stone-200/90 rounded-xl bg-stone-50/50 p-2 overflow-hidden">
            <svg viewBox="0 0 760 360" className="w-full h-auto select-none">
              <defs>
                <linearGradient id="gradMain" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#082f49" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
                <linearGradient id="gradSub" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              {/* 连线与流光 */}
              <path d="M 120 180 L 220 180" stroke="#0284c7" strokeWidth="2.5" fill="none" className="flow-line" />
              <path d="M 330 180 L 410 180" stroke="#0284c7" strokeWidth="2.5" fill="none" className="flow-line" />
              <path d="M 520 180 L 610 180" stroke="#0284c7" strokeWidth="2.5" fill="none" className="flow-line" />
              <path d="M 465 140 L 465 90" stroke="#9333ea" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <path d="M 465 220 L 465 270" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" fill="none" />

              {/* 主节点 1: EventLoop */}
              <g 
                onClick={() => setActiveNodeKey('loop')} 
                className="cursor-pointer transition hover:opacity-90"
              >
                <rect x="220" y="140" width="110" height="80" rx="12" fill="url(#gradMain)" stroke={activeNodeKey === 'loop' ? '#f59e0b' : '#38bdf8'} strokeWidth={activeNodeKey === 'loop' ? 3 : 1} />
                <text x="275" y="175" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13" fontFamily="sans-serif">EventLoop</text>
                <text x="275" y="195" textAnchor="middle" fill="#bae6fd" fontSize="10" fontFamily="sans-serif">Reactor 核心循环</text>
              </g>

              {/* 主节点 2: Channel */}
              <g 
                onClick={() => setActiveNodeKey('channel')} 
                className="cursor-pointer transition hover:opacity-90"
              >
                <rect x="410" y="140" width="110" height="80" rx="12" fill="#ffffff" stroke={activeNodeKey === 'channel' ? '#f59e0b' : '#cbd5e1'} strokeWidth={activeNodeKey === 'channel' ? 3 : 2} />
                <text x="465" y="175" textAnchor="middle" fill="#0f172a" fontWeight="bold" fontSize="13" fontFamily="sans-serif">Channel</text>
                <text x="465" y="195" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif">事件分发通道</text>
              </g>

              {/* 主节点 3: Poller */}
              <g 
                onClick={() => setActiveNodeKey('poller')} 
                className="cursor-pointer transition hover:opacity-90"
              >
                <rect x="30" y="140" width="100" height="80" rx="12" fill="#f8fafc" stroke={activeNodeKey === 'poller' ? '#f59e0b' : '#cbd5e1'} strokeWidth={activeNodeKey === 'poller' ? 3 : 2} />
                <text x="80" y="175" textAnchor="middle" fill="#0f172a" fontWeight="bold" fontSize="13" fontFamily="sans-serif">EpollPoller</text>
                <text x="80" y="195" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif">epoll_wait 复用</text>
              </g>

              {/* 主节点 4: TcpConnection */}
              <g 
                onClick={() => setActiveNodeKey('conn')} 
                className="cursor-pointer transition hover:opacity-90"
              >
                <rect x="610" y="140" width="120" height="80" rx="12" fill="url(#gradSub)" stroke={activeNodeKey === 'conn' ? '#f59e0b' : '#60a5fa'} strokeWidth={activeNodeKey === 'conn' ? 3 : 1} />
                <text x="670" y="175" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13" fontFamily="sans-serif">TcpConnection</text>
                <text x="670" y="195" textAnchor="middle" fill="#dbeafe" fontSize="10" fontFamily="sans-serif">TCP 连接全周期</text>
              </g>

              {/* 上方节点: TcpServer & ThreadPool */}
              <g 
                onClick={() => setActiveNodeKey('server')} 
                className="cursor-pointer transition hover:opacity-90"
              >
                <rect x="400" y="30" width="130" height="60" rx="10" fill="#faf5ff" stroke={activeNodeKey === 'server' ? '#f59e0b' : '#d8b4fe'} strokeWidth={activeNodeKey === 'server' ? 3 : 2} />
                <text x="465" y="58" textAnchor="middle" fill="#6b21a8" fontWeight="bold" fontSize="12" fontFamily="sans-serif">TcpServer</text>
                <text x="465" y="76" textAnchor="middle" fill="#9333ea" fontSize="9" fontFamily="sans-serif">EventLoopThreadPool</text>
              </g>

              {/* 下方节点: Buffer */}
              <g 
                onClick={() => setActiveNodeKey('buffer')} 
                className="cursor-pointer transition hover:opacity-90"
              >
                <rect x="400" y="270" width="130" height="60" rx="10" fill="#ecfdf5" stroke={activeNodeKey === 'buffer' ? '#f59e0b' : '#6ee7b7'} strokeWidth={activeNodeKey === 'buffer' ? 3 : 2} />
                <text x="465" y="298" textAnchor="middle" fill="#065f46" fontWeight="bold" fontSize="12" fontFamily="sans-serif">Buffer</text>
                <text x="465" y="316" textAnchor="middle" fill="#059669" fontSize="9" fontFamily="sans-serif">应用层自适应环形缓冲</text>
              </g>
            </svg>
          </div>
        </div>

        {/* 右侧：所选节点深度透视抽屉 */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold text-amber-700 font-mono flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>架构节点透视 (Inspector)</span>
              </span>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono">
                {activeNode.file}
              </span>
            </div>

            <div className="mt-3">
              <h4 className="text-lg font-bold text-stone-900 font-serifHeading">
                {activeNode.title}
              </h4>
              <p className="text-xs text-stone-600 font-serifMono mt-1 leading-relaxed">
                {activeNode.desc}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <span className="text-xs font-bold text-stone-700 font-serifHeading">线程归属与并发戒律：</span>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-serifMono text-sky-900">
                {activeNode.threadRule}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <span className="text-xs font-bold text-stone-700 font-serifHeading">核心关键方法：</span>
              <div className="flex flex-wrap gap-1.5">
                {activeNode.coreMethods.map((m: string, i: number) => (
                  <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 text-center">
            <button
              onClick={() => onSelectDay(activeNode.relatedDay || 1)}
              className="w-full py-2 rounded-xl bg-sky-900 hover:bg-sky-950 text-white font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>直达对应实战：Day {activeNode.relatedDay || 1}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

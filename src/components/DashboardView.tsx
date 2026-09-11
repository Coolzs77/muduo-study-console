import React, { useState } from 'react';
import { 
  Trophy, 
  Clock, 
  Repeat, 
  Flame, 
  Layers, 
  Info, 
  ChevronRight, 
  CalendarDays, 
  Workflow,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  X,
  Compass,
  ArrowRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { TOPOLOGY_DRAWER_DATA } from '../data/topologyData';
import { DAYS_DATASET } from '../data/muduo28Days';
import { CHEN_SHUO_BOOK, generatePdfBrowserUrl } from '../data/booksMapping';
import { AppState, DayItem } from '../types';

interface DashboardViewProps {
  appState: AppState;
  onSelectDay: (day: number) => void;
  onRecordReview: (day: number, result: 'forgot' | 'fuzzy' | 'mastered') => void;
  onShowToast: (msg: string, success?: boolean) => void;
  onSwitchToReadingChapter?: (day: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  appState, 
  onSelectDay,
  onRecordReview,
  onShowToast,
  onSwitchToReadingChapter
}) => {
  const [activeNodeKey, setActiveNodeKey] = useState<string>('loop');
  const [activeReviewModalDay, setActiveReviewModalDay] = useState<DayItem | null>(null);
  const [showReviewAnswer, setShowReviewAnswer] = useState(false);

  // 1. 计算核心指标
  const masteryEntries = Object.entries(appState.mastery);
  const completedDays = masteryEntries.filter(([_, m]) => m.level >= 4).length;
  const progressPercent = Math.round((completedDays / 28) * 100);

  // 今日学习分钟数与打卡天数
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMinutes = appState.studySessions
    .filter(s => s.date === todayStr)
    .reduce((acc, s) => acc + s.duration, 0);

  const uniqueSessionDates = new Set(appState.studySessions.map(s => s.date));
  const streakDays = uniqueSessionDates.size;

  // 2. 今日攻坚任务 (首个未完全掌握的 Day，默认 Day 1)
  const todayMissionDay = DAYS_DATASET.find(d => (appState.mastery[d.day]?.level || 0) < 4) || DAYS_DATASET[0];

  // 3. 艾宾浩斯复习待办
  const dueReviewDays: DayItem[] = [];
  DAYS_DATASET.forEach(d => {
    const r = appState.reviews?.[d.day];
    if (r && r.nextReviewDate && r.nextReviewDate <= todayStr) {
      dueReviewDays.push(d);
    }
  });

  // 4. 过去 7 天专注投入走势统计
  const past7Days: { dateStr: string; label: string; weekday: string; mins: number }[] = [];
  const weekDaysCN = ['日', '一', '二', '三', '四', '五', '六'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const month = d.getMonth() + 1;
    const dateNum = d.getDate();
    const weekday = weekDaysCN[d.getDay()];
    
    const mins = appState.studySessions
      .filter(s => s.date === dateStr)
      .reduce((sum, s) => sum + (s.duration || 0), 0);

    past7Days.push({
      dateStr,
      label: `${month}/${dateNum}`,
      weekday: `周${weekday}`,
      mins
    });
  }

  const maxChartMins = Math.max(60, ...past7Days.map(p => p.mins));
  const past7TotalMins = past7Days.reduce((acc, p) => acc + p.mins, 0);
  const totalAllMins = appState.studySessions.reduce((acc, s) => acc + (s.duration || 0), 0);

  // 5. 拓扑透视抽屉数据
  const activeNode = TOPOLOGY_DRAWER_DATA[activeNodeKey] || TOPOLOGY_DRAWER_DATA['loop'];

  // 打卡矩阵颜色阶梯 (0 ~ 5 级)
  const levelStyles: Record<number, { bg: string; border: string; text: string; badge: string; label: string }> = {
    0: { bg: 'bg-white', border: 'border-stone-200', text: 'text-stone-700', badge: 'bg-stone-100 text-stone-600', label: '未开始' },
    1: { bg: 'bg-amber-50/80', border: 'border-amber-300', text: 'text-amber-950', badge: 'bg-amber-100 text-amber-900', label: '初读 (L1)' },
    2: { bg: 'bg-sky-50/80', border: 'border-sky-300', text: 'text-sky-950', badge: 'bg-sky-100 text-sky-900', label: '精研 (L2)' },
    3: { bg: 'bg-indigo-50/80', border: 'border-indigo-300', text: 'text-indigo-950', badge: 'bg-indigo-100 text-indigo-900', label: 'Demo通 (L3)' },
    4: { bg: 'bg-emerald-600', border: 'border-emerald-700', text: 'text-white', badge: 'bg-emerald-700 text-emerald-100', label: '实战复现 (L4)' },
    5: { bg: 'bg-emerald-800', border: 'border-emerald-900', text: 'text-white', badge: 'bg-emerald-950 text-emerald-200', label: '源码通透 (L5)' }
  };

  const handleOpenPdf = (dayItem: DayItem) => {
    let pageNum = 255;
    const m = dayItem.bookRange.match(/P\.(\d+)/i);
    if (m) pageNum = parseInt(m[1]);
    const url = generatePdfBrowserUrl(CHEN_SHUO_BOOK, pageNum);
    window.open(url, '_blank');
    onShowToast(`已在浏览器新标签页打开原版 PDF (P.${pageNum})`);
  };

  return (
    <div className="space-y-6">
      {/* 1. 5大核心指标统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-sky-300 transition">
          <div className="text-xs text-stone-500 font-bold flex items-center justify-between">
            <span>28天总进度</span>
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
            达到 L4+ 实战标准
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-amber-300 transition">
          <div className="text-xs text-stone-500 font-bold flex items-center justify-between">
            <span>今日学习时长</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-800 my-1 font-serifHeading">
            {todayMinutes} <span className="text-sm font-normal text-stone-500">分钟</span>
          </div>
          <div className="text-[11px] text-stone-400 font-serifMono">
            累计 {(totalAllMins / 60).toFixed(1)} 小时
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-rose-300 transition">
          <div className="text-xs text-stone-500 font-bold flex items-center justify-between">
            <span>艾宾浩斯待办</span>
            <Repeat className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-700 my-1 font-serifHeading">
            {dueReviewDays.length} <span className="text-sm font-normal text-stone-500">项</span>
          </div>
          <div className="text-[11px] text-stone-400 font-serifMono">
            科学记忆强化曲线
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition col-span-2 sm:col-span-2 lg:col-span-1">
          <div className="text-xs text-stone-500 font-bold flex items-center justify-between">
            <span>连续攻坚打卡</span>
            <Flame className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-800 my-1 font-serifHeading">
            {Math.max(1, streakDays)} <span className="text-sm font-normal text-stone-500">天</span>
          </div>
          <div className="text-[11px] text-stone-400 font-serifMono">
            日拱一卒，保持手感
          </div>
        </div>
      </div>

      {/* 2. 今日攻坚首要任务卡片 */}
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-sky-50/90 rounded-2xl p-5 sm:p-6 border border-amber-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-200/90 text-amber-950 font-serifMono">
                今日首要攻坚 · Day {String(todayMissionDay.day).padStart(2, '0')}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                第 {todayMissionDay.week} 周 · Tier {todayMissionDay.tier}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serifHeading">
              {todayMissionDay.title}
            </h3>
            <p className="text-xs text-stone-600 font-serifMono flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-stone-400" />
              <span>原著章节对应：{todayMissionDay.bookRange}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onSelectDay(todayMissionDay.day)}
              className="px-4 py-2 rounded-xl bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>进入今日攻坚</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleOpenPdf(todayMissionDay)}
              className="px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-700" />
              <span>原著直跳</span>
            </button>
            {onSwitchToReadingChapter && (
              <button
                onClick={() => onSwitchToReadingChapter(todayMissionDay.day)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-700" />
                <span>书卷伴读</span>
              </button>
            )}
          </div>
        </div>

        {/* 核心攻坚要点预览 */}
        <div className="mt-4 pt-3 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-serifMono text-stone-700">
          {todayMissionDay.points.slice(0, 2).map((pt, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="text-amber-700 font-bold">•</span>
              <span className="truncate" dangerouslySetInnerHTML={{ __html: pt }} />
            </div>
          ))}
        </div>
      </div>

      {/* 3. 28 天定制打卡矩阵 (4 行 7 列，完整 28 天) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serifHeading flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber-700" />
              <span>28 天全周期攻坚打卡矩阵 (4周完整矩阵)</span>
            </h3>
            <p className="text-xs text-stone-500 font-serifMono mt-0.5">
              单元格颜色映射 0~5 掌握星级，点击任意单元格即可直跳该日攻坚大纲
            </p>
          </div>

          {/* 6 级图例 */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-serifMono text-stone-600">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-stone-200 inline-block"></span> 未开始 (0)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> 初读 (1)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span> 精研 (2)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> Demo通 (3)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> 实战复现 (4)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-800 inline-block"></span> 源码通透 (5)</span>
          </div>
        </div>

        {/* 28 格子网格：小屏幕 4 列，中大屏幕 7 列 */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-2.5">
          {DAYS_DATASET.map(item => {
            const m = appState.mastery[item.day] || { level: 0 };
            const level = m.level || 0;
            const style = levelStyles[level] || levelStyles[0];

            return (
              <div
                key={item.day}
                onClick={() => onSelectDay(item.day)}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all duration-200 font-serifMono relative flex flex-col justify-between h-16 sm:h-18 hover:scale-[1.02] hover:shadow-md ${style.bg} ${style.border} ${style.text}`}
                title={`Day ${item.day}: ${item.title} (${style.label})`}
              >
                <div className="flex justify-between items-center text-[10px] sm:text-xs">
                  <span className={`font-bold tracking-wider ${level >= 4 ? 'text-emerald-100' : 'text-stone-900'}`}>
                    D{String(item.day).padStart(2, '0')}
                  </span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${level >= 4 ? 'bg-emerald-900/60 text-emerald-100' : 'bg-stone-100 text-stone-500'}`}>
                    W{item.week}
                  </span>
                </div>

                <div className="text-[10px] sm:text-[11px] truncate font-sans text-left my-0.5">
                  {item.title}
                </div>

                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-mono">
                    {'★'.repeat(level) + '☆'.repeat(5 - level)}
                  </span>
                  <span className={`px-1 rounded text-[8px] ${style.badge}`}>
                    {style.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. 专注走势图与艾宾浩斯复习双栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：近 7 日专注走势图 */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serifHeading flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-800" />
                <span>近 7 日专注投入分布 (Focus Distribution)</span>
              </h3>
              <p className="text-xs text-stone-500 font-serifMono mt-0.5">
                记录每日真实专注学习投入（分钟）
              </p>
            </div>
            <span className="text-xs font-serifMono text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
              近7日累计 <span className="font-bold text-stone-900">{past7TotalMins}</span> 分钟
            </span>
          </div>

          {/* 4个小指标 */}
          <div className="grid grid-cols-4 gap-2 text-center font-serifMono">
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <div className="text-[10px] text-stone-400">今日专注</div>
              <div className="text-xs sm:text-sm font-bold text-amber-800">{todayMinutes}m</div>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <div className="text-[10px] text-stone-400">近7日总计</div>
              <div className="text-xs sm:text-sm font-bold text-sky-800">{past7TotalMins}m</div>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <div className="text-[10px] text-stone-400">日均投入</div>
              <div className="text-xs sm:text-sm font-bold text-emerald-800">
                {Math.round(past7TotalMins / 7)}m
              </div>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60">
              <div className="text-[10px] text-stone-400">单日峰值</div>
              <div className="text-xs sm:text-sm font-bold text-indigo-800">
                {Math.max(...past7Days.map(p => p.mins))}m
              </div>
            </div>
          </div>

          {/* 纯 SVG 柱状图 */}
          <div className="p-3 bg-stone-50/60 rounded-xl border border-stone-200/60">
            <svg viewBox="0 0 460 120" className="w-full h-auto select-none">
              {past7Days.map((d, idx) => {
                const barWidth = 36;
                const gap = (460 - barWidth * 7) / 8;
                const x = gap + idx * (barWidth + gap);
                const barHeight = Math.max(6, Math.round((d.mins / maxChartMins) * 75));
                const y = 85 - barHeight;
                const isToday = idx === 6;
                const barColor = isToday ? '#0284c7' : (d.mins > 0 ? '#059669' : '#e2e8f0');

                return (
                  <g key={idx}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx={4}
                      fill={barColor}
                      className="transition-all duration-300"
                    >
                      <title>{d.label} ({d.weekday}): {d.mins} 分钟</title>
                    </rect>
                    {d.mins > 0 && (
                      <text
                        x={x + barWidth / 2}
                        y={y - 4}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#475569"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {d.mins}m
                      </text>
                    )}
                    <text
                      x={x + barWidth / 2}
                      y={102}
                      textAnchor="middle"
                      fontSize="9"
                      fill={isToday ? '#0284c7' : '#64748b'}
                      fontFamily="monospace"
                      fontWeight={isToday ? 'bold' : 'normal'}
                    >
                      {d.label}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={114}
                      textAnchor="middle"
                      fontSize="8"
                      fill="#94a3b8"
                      fontFamily="sans-serif"
                    >
                      {d.weekday}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* 右侧：艾宾浩斯复习待办列表 */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-stone-900 font-serifHeading flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-rose-600" />
                <span>艾宾浩斯间隔复习待办</span>
              </h3>
              <span className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-lg border border-rose-200 font-mono font-bold">
                {dueReviewDays.length} 项到期
              </span>
            </div>

            <p className="text-xs text-stone-500 font-serifMono mb-3">
              根据遗忘曲线自动计算复习周期（1, 3, 7, 14, 30天）
            </p>

            {dueReviewDays.length === 0 ? (
              <div className="p-6 text-center text-stone-400 bg-stone-50/60 rounded-xl border border-stone-200/60 font-serifHeading text-xs space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-stone-700 font-bold">今日复习已全部完成！</p>
                <p className="text-[11px] text-stone-400">记忆巩固状态极佳，可以开始攻坚新的知识日。</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dueReviewDays.slice(0, 5).map(item => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-rose-300 transition text-xs font-serifHeading"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold font-mono">
                        D{String(item.day).padStart(2, '0')}
                      </span>
                      <span className="truncate text-stone-800 font-medium">
                        {item.title}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveReviewModalDay(item);
                        setShowReviewAnswer(false);
                      }}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>复习抽认</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-stone-100 text-center">
            <button
              onClick={() => onSelectDay(dueReviewDays[0]?.day || 1)}
              className="text-xs font-bold text-sky-800 hover:text-sky-950 font-serifMono flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>查看 28 天全部知识库大纲</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. 核心架构拓扑图交互视窗与节点透视抽屉 */}
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
              交互拓扑
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

      {/* 6. 艾宾浩斯复习抽认卡模态框 (Review Modal) */}
      {activeReviewModalDay && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 text-xs font-mono font-bold">
                  Day {String(activeReviewModalDay.day).padStart(2, '0')} 记忆强化
                </span>
                <span className="text-xs font-serifHeading text-stone-500">艾宾浩斯抽认卡</span>
              </div>
              <button
                onClick={() => setActiveReviewModalDay(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-stone-900 font-serifHeading">
                {activeReviewModalDay.title}
              </h4>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-serifMono text-stone-700 leading-relaxed">
                <span className="font-bold text-stone-900 block mb-1">【攻坚自测核心问题】：</span>
                {activeReviewModalDay.quiz?.whyQuestion?.question || 
                 activeReviewModalDay.points[0]?.replace(/<[^>]+>/g, '') || 
                 '阐述该技术点在多线程环境下的设计动机与底层物理保证。'}
              </div>

              {/* 答案揭晓区 */}
              {showReviewAnswer ? (
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs font-serifMono text-emerald-950 space-y-2 animate-in fade-in">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>权威参考解析与陈硕原著线索：</span>
                  </span>
                  <p className="leading-relaxed">
                    {activeReviewModalDay.quiz?.whyQuestion?.referenceAnswer || 
                     '该技术点通过 RAII、智能指针或引用约束，在编译期与运行时消除数据竞态，保障高并发下的内存安全。'}
                  </p>
                  {activeReviewModalDay.quiz?.whyQuestion?.keywords && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {activeReviewModalDay.quiz.whyQuestion.keywords.map((kw: string, i: number) => (
                        <span key={i} className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowReviewAnswer(true)}
                  className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer font-serifMono"
                >
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>心中默背完毕，点击揭晓权威参考答案</span>
                </button>
              )}
            </div>

            {/* 反馈按键 */}
            {showReviewAnswer && (
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <span className="text-xs text-stone-500 font-serifMono block text-center">
                  自评记忆程度，系统将动态重新排期：
                </span>
                <div className="grid grid-cols-3 gap-2 font-serifMono">
                  <button
                    onClick={() => {
                      onRecordReview(activeReviewModalDay.day, 'forgot');
                      setActiveReviewModalDay(null);
                    }}
                    className="py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs transition cursor-pointer"
                  >
                    遗忘 (+1天)
                  </button>
                  <button
                    onClick={() => {
                      onRecordReview(activeReviewModalDay.day, 'fuzzy');
                      setActiveReviewModalDay(null);
                    }}
                    className="py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition cursor-pointer"
                  >
                    模糊 (+原周期)
                  </button>
                  <button
                    onClick={() => {
                      onRecordReview(activeReviewModalDay.day, 'mastered');
                      setActiveReviewModalDay(null);
                    }}
                    className="py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                  >
                    熟练 (+下阶周期)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

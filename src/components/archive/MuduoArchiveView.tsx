import React, { useState, useMemo } from 'react';
import { MUDUO_ARCHIVE_DATASET } from '../../data/muduoArchiveDataset';
import { CodeBlock } from '../common/CodeBlock';
import {
  Archive,
  Search,
  BookOpen,
  Calendar,
  CheckCircle2,
  Terminal,
  Layers,
  ChevronRight
} from 'lucide-react';

export const MuduoArchiveView: React.FC = () => {
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const currentDay = useMemo(() => {
    return MUDUO_ARCHIVE_DATASET.find(d => d.day === selectedDayNum) || MUDUO_ARCHIVE_DATASET[0];
  }, [selectedDayNum]);

  const filteredDays = useMemo(() => {
    if (!searchQuery.trim()) return MUDUO_ARCHIVE_DATASET;
    const q = searchQuery.toLowerCase().trim();
    return MUDUO_ARCHIVE_DATASET.filter(
      d =>
        d.title.toLowerCase().includes(q) ||
        d.points.some(p => p.toLowerCase().includes(q)) ||
        (d.tags && d.tags.some(t => t.toLowerCase().includes(q)))
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Archive Header */}
      <div className="bg-white/90 dark:bg-[#1a1f2c]/90 rounded-3xl p-6 sm:p-7 border border-white/70 dark:border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/60 dark:to-amber-800/40 text-amber-700 dark:text-amber-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.06)]">
            <Archive size={22} />
          </span>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <span>L4 底层网络库归档全集</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              Muduo 原版 28 天任务归档
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              此版本完整归档了 Muduo 网络库重构前从指针、RAII、多线程、事件循环到 TcpServer 的 28 天历史课程内容与代码示例。
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Days List Selector */}
        <div className="lg:col-span-4 bg-white/85 dark:bg-[#1e2433]/85 rounded-3xl p-5 border border-white/70 dark:border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.7)] space-y-3.5">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索归档任务..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06)] focus:outline-hidden focus:border-amber-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredDays.map(d => {
              const isSelected = selectedDayNum === d.day;
              return (
                <button
                  key={d.day}
                  onClick={() => setSelectedDayNum(d.day)}
                  type="button"
                  className={`w-full text-left p-3.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-start justify-between gap-2.5 border ${
                    isSelected
                      ? 'bg-amber-50/90 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)]'
                      : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.02)] hover:-translate-y-0.5'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                        Day {d.day < 10 ? `0${d.day}` : d.day}
                      </span>
                      <span className="font-bold text-xs truncate">{d.title}</span>
                    </div>
                    {d.tags && d.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1.5 truncate">
                        {d.tags.slice(0, 2).map((t, tidx) => (
                          <span
                            key={tidx}
                            className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={14} className="text-slate-400 shrink-0 mt-1" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Content */}
        {currentDay && (
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white/85 dark:bg-[#1e2433]/85 border border-white/70 dark:border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    第 {currentDay.week} 周 · Day {currentDay.day}
                  </div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {currentDay.title}
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-[inset_1px_1px_2px_rgba(16,185,129,0.15)] shrink-0">
                  已掌握归档
                </span>
              </div>

              {currentDay.bookRange && (
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  参考专著: {currentDay.bookRange}
                </div>
              )}

              {/* Core Points */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  核心攻坚知识点
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pl-4 list-disc">
                  {currentDay.points.map((pt, pIdx) => (
                    <li key={pIdx} dangerouslySetInnerHTML={{ __html: pt }} />
                  ))}
                </ul>
              </div>

              {/* Muduo Mapping */}
              {currentDay.muduoMap && (
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)]">
                  <strong>Muduo 源码映射：</strong>
                  <span>{currentDay.muduoMap}</span>
                </div>
              )}

              {/* Code Snippet */}
              {currentDay.code && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    归档示例代码
                  </h3>
                  <CodeBlock code={currentDay.code} language="cpp" />
                </div>
              )}

              {/* Nuances */}
              {currentDay.rigorousNuance && (
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 text-xs space-y-2 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.03)]">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    概念辨析（快速直觉 vs 严格原理）
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    <strong>直觉理解：</strong>
                    {typeof currentDay.rigorousNuance === 'object' && currentDay.rigorousNuance !== null
                      ? currentDay.rigorousNuance.quick
                      : String(currentDay.rigorousNuance)}
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    <strong>物理原理：</strong>
                    {typeof currentDay.rigorousNuance === 'object' && currentDay.rigorousNuance !== null
                      ? currentDay.rigorousNuance.strict
                      : typeof currentDay.check === 'string'
                      ? currentDay.check
                      : ''}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

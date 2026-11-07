import React, { useState, useMemo } from 'react';
import {
  EVIDENCE_TYPES,
  DEFAULT_EVIDENCE_CATALOG,
  CAPABILITIES_MATRIX,
  PROJECT_REVERSE_QUESTIONS,
  PROJECT_INTERVIEW_DATA,
  CAREER_STAR_STORIES,
  RESUME_BULLETS
} from '../../data/careerDataset';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { showToast } from '../common/Toast';
import { CodeBlock } from '../common/CodeBlock';
import {
  Award,
  GitCommit,
  Activity,
  HelpCircle,
  Briefcase,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type CareerSubTab = 'evidence' | 'radar' | 'interview' | 'star';

export const CareerSystemView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CareerSubTab>('evidence');
  const [elevatorPitchLen, setElevatorPitchLen] = useState<'30s' | '1m' | '3m'>('1m');
  const [searchQuery, setSearchQuery] = useState('');

  // Persisted capability levels (1~5 for each dimension)
  const [capabilityLevels, setCapabilityLevels] = useLocalStorage<Record<string, number>>(
    'muduo_career_capability_levels',
    {
      cpp11_17_modern: 4,
      one_loop_per_thread: 5,
      raii_lifecycle: 5,
      smart_ptr_ownership: 4,
      epoll_reactor_io: 4,
      concurrency_mutex: 4,
      benchmark_p99: 4
    }
  );

  const [expandedInterviewQ, setExpandedInterviewQ] = useState<Record<string, boolean>>({
    q_shared_weak_ptr: true
  });

  const toggleInterviewQ = (id: string) => {
    setExpandedInterviewQ(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string, msg: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(msg, 'success');
    });
  };

  const setLevel = (key: string, lvl: number) => {
    setCapabilityLevels(prev => ({ ...prev, [key]: lvl }));
    showToast(`能力等级已更新为 L${lvl}`, 'success');
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="bg-white/90 dark:bg-[#1a1f2c]/90 rounded-3xl p-6 sm:p-7 border border-white/70 dark:border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900/60 dark:to-sky-800/40 text-sky-700 dark:text-sky-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.06)]">
            <Award size={22} />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              面试题解
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              整理工程实现、能力要点、面试题解与 STAR 经历。
            </p>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-2 ${
              activeTab === 'evidence'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_8px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5'
            }`}
          >
            <GitCommit size={15} />
            <span>工程凭证目录 (10)</span>
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-2 ${
              activeTab === 'radar'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_8px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5'
            }`}
          >
            <Activity size={15} />
            <span>14 维后端能力矩阵</span>
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-2 ${
              activeTab === 'interview'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_8px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5'
            }`}
          >
            <HelpCircle size={15} />
            <span>项目面试真题与电梯演讲</span>
          </button>
          <button
            onClick={() => setActiveTab('star')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-2 ${
              activeTab === 'star'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_8px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5'
            }`}
          >
            <Briefcase size={15} />
            <span>STAR 法则实战库 & 简历</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: 工程凭证目录 */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFAULT_EVIDENCE_CATALOG.map(ev => {
              const typeMeta = EVIDENCE_TYPES[ev.type] || {
                name: ev.type,
                badgeClass: 'bg-slate-100 text-slate-700'
              };
              return (
                <div
                  key={ev.id}
                  className="bg-white/85 dark:bg-[#1e2433]/85 rounded-3xl p-5 sm:p-6 border border-white/70 dark:border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {ev.title}
                      </h4>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 shadow-[inset_1px_1px_2px_rgba(14,165,233,0.15)] shrink-0">
                        {typeMeta.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)]">
                        Commit: {ev.commitHash}
                      </span>
                      <span>·</span>
                      <span className="truncate">{ev.sourceLocation}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/80 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.03)]">
                      {ev.details}
                    </p>

                    {/* Capability Tags */}
                    {ev.capabilityTags && (
                      <div className="flex flex-wrap gap-1.5">
                        {ev.capabilityTags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 size={14} />
                      真实工程实证已核验
                    </span>
                    <span className="font-mono font-semibold">Task #{ev.taskId}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: 14 维能力矩阵 */}
      {activeTab === 'radar' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(CAPABILITIES_MATRIX).map(([key, dim]) => {
              const currentLvl = capabilityLevels[key] || 1;
              const lvlDesc = dim.levels ? dim.levels[currentLvl] : '';

              return (
                <div
                  key={key}
                  className="bg-white/85 dark:bg-[#1e2433]/85 rounded-3xl p-5 sm:p-6 border border-white/70 dark:border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {dim.name}
                      </h4>
                      <div className="text-xs text-slate-400 mt-0.5">{dim.description}</div>
                    </div>
                    <span className="font-mono font-black text-sm text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-2xl shadow-[inset_1px_1px_2px_rgba(14,165,233,0.2)]">
                      L{currentLvl}
                    </span>
                  </div>

                  {/* Level Selector Buttons */}
                  <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]">
                    {[1, 2, 3, 4, 5].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setLevel(key, lvl)}
                        className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer ${
                          lvl <= currentLvl
                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_6px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]'
                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                        title={`设置为 L${lvl}`}
                        type="button"
                      >
                        L{lvl}
                      </button>
                    ))}
                  </div>

                  {/* Current Level Description */}
                  {lvlDesc && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/80 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.03)]">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        L{currentLvl} 掌握标准:
                      </span>{' '}
                      {lvlDesc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: 项目面试真题与电梯演讲 */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          {/* Elevator Pitch Card */}
          <div className="bg-white/85 dark:bg-[#1e2433]/85 rounded-3xl p-6 sm:p-7 border border-white/70 dark:border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase size={17} className="text-sky-600 dark:text-sky-400" />
                  项目 30 秒 / 1 分钟 / 3 分钟技术陈述 (Elevator Pitch)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  面试开场向面试官精准汇报系统架构、并发模型、关键设计与实测指标。
                </p>
              </div>

              {/* Pitch duration selector */}
              <div className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-900/60 p-1.5 rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06)]">
                {(['30s', '1m', '3m'] as const).map(len => (
                  <button
                    key={len}
                    onClick={() => setElevatorPitchLen(len)}
                    className={`px-3.5 py-1 rounded-xl text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer ${
                      elevatorPitchLen === len
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_6px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-50/80 dark:bg-slate-900/50 p-4 sm:p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-sans shadow-[inset_1px_1px_2px_rgba(0,0,0,0.03)]">
                {PROJECT_INTERVIEW_DATA.elevatorPitch?.[elevatorPitchLen] ||
                  PROJECT_INTERVIEW_DATA.elevatorPitch?.['1m']}
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    PROJECT_INTERVIEW_DATA.elevatorPitch?.[elevatorPitchLen] || '',
                    '陈述文本已复制'
                  )
                }
                className="absolute top-3 right-3 p-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-white/80 dark:border-white/10 text-slate-500 hover:text-sky-600 shadow-[2px_2px_6px_rgba(0,0,0,0.06),inset_1px_1px_2px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
                title="复制陈述"
                type="button"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          {/* Reverse Questions */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle size={17} className="text-sky-600 dark:text-sky-400" />
              高频面试逆向深度攻防题
            </h3>

            <div className="space-y-3">
              {PROJECT_REVERSE_QUESTIONS.map(q => {
                const isExpanded = !!expandedInterviewQ[q.id];
                return (
                  <div
                    key={q.id}
                    className="bg-white/85 dark:bg-[#1e2433]/85 rounded-3xl border border-white/70 dark:border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  >
                    <div
                      onClick={() => toggleInterviewQ(q.id)}
                      className="p-4 sm:p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition flex items-center justify-between gap-4 select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-[2px_2px_5px_rgba(245,158,11,0.25),inset_1px_1px_2px_rgba(255,255,255,0.6)]">
                          Q
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {q.question}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]">
                          {q.category}
                        </span>
                        <div className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3.5 text-xs sm:text-sm">
                        {q.source && (
                          <div>
                            <div className="text-xs text-slate-400 font-mono mb-1.5">
                              源码位置: {q.source.file} ({q.source.line})
                            </div>
                            <CodeBlock code={q.source.snippet} language="cpp" maxHeight="max-h-[250px]" />
                          </div>
                        )}

                        <div className="bg-slate-50/80 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-2 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.03)]">
                          <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                            答题思路:
                          </div>
                          <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {q.answer}
                          </div>
                        </div>

                        {q.followUp && (
                          <div className="bg-sky-50/80 dark:bg-sky-950/30 p-3.5 rounded-2xl border border-sky-100/60 dark:border-sky-900/40 text-xs shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)]">
                            <span className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5 mb-1">
                              <Lightbulb size={14} />
                              面试官潜在追问:
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">{q.followUp}</span>
                          </div>
                        )}

                        {q.trap && (
                          <div className="bg-rose-50/80 dark:bg-rose-950/30 p-3.5 rounded-2xl border border-rose-100/60 dark:border-rose-900/40 text-xs shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)]">
                            <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 mb-1">
                              <AlertTriangle size={14} />
                              常见认知误区与答题陷阱:
                            </span>
                            <span className="text-rose-900 dark:text-rose-200">{q.trap}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: STAR 法则实战库 & 简历 */}
      {activeTab === 'star' && (
        <div className="space-y-6">
          {/* Resume Bullets */}
          <div className="bg-white/85 dark:bg-[#1e2433]/85 rounded-3xl p-6 sm:p-7 border border-white/70 dark:border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Award size={17} className="text-sky-600 dark:text-sky-400" />
              精炼简历要点库 (直接可用，带指标量化)
            </h3>

            <div className="space-y-3">
              {RESUME_BULLETS.map((rb, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.03)]"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 shadow-[inset_1px_1px_2px_rgba(14,165,233,0.1)]">
                      {rb.category}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed mt-1">
                      {rb.text}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(rb.text, '简历要点已复制')}
                    className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-white/80 dark:border-white/10 text-slate-500 hover:text-sky-600 shadow-[2px_2px_6px_rgba(0,0,0,0.06),inset_1px_1px_2px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shrink-0 cursor-pointer"
                    title="复制要点"
                    type="button"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* STAR Stories */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase size={17} className="text-sky-600 dark:text-sky-400" />
              STAR 法则实战经历
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CAREER_STAR_STORIES.map(story => (
                <div
                  key={story.id}
                  className="bg-white/85 dark:bg-[#1e2433]/85 rounded-3xl p-5 sm:p-6 border border-white/70 dark:border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] space-y-3.5"
                >
                  <h4 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                    {story.title}
                  </h4>

                  <div className="space-y-2 text-xs leading-relaxed">
                    <p>
                      <strong className="text-sky-600 dark:text-sky-400">[Situation 背景]: </strong>
                      <span className="text-slate-700 dark:text-slate-300">{story.situation}</span>
                    </p>
                    <p>
                      <strong className="text-amber-600 dark:text-amber-400">[Task 挑战]: </strong>
                      <span className="text-slate-700 dark:text-slate-300">{story.task}</span>
                    </p>
                    <p>
                      <strong className="text-emerald-600 dark:text-emerald-400">[Action 行动]: </strong>
                      <span className="text-slate-700 dark:text-slate-300">{story.action}</span>
                    </p>
                    <p>
                      <strong className="text-purple-600 dark:text-purple-400">[Result 成果]: </strong>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {story.result}
                      </span>
                    </p>
                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
                      <strong>收获与沉淀: </strong>
                      {story.takeaway}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <Award size={22} />
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            面试题解
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          整理工程实现、能力要点、面试题解与 STAR 经历。
        </p>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'evidence'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <GitCommit size={14} />
            <span>工程凭证目录 (10)</span>
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'radar'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Activity size={14} />
            <span>14 维后端能力矩阵</span>
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'interview'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <HelpCircle size={14} />
            <span>项目面试真题与电梯演讲</span>
          </button>
          <button
            onClick={() => setActiveTab('star')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'star'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Briefcase size={14} />
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
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {ev.title}
                      </h4>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/40 shrink-0">
                        {typeMeta.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Commit: {ev.commitHash}
                      </span>
                      <span>·</span>
                      <span className="truncate">{ev.sourceLocation}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {ev.details}
                    </p>

                    {/* Capability Tags */}
                    {ev.capabilityTags && (
                      <div className="flex flex-wrap gap-1.5">
                        {ev.capabilityTags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 size={13} />
                      真实工程实证已核验
                    </span>
                    <span className="font-mono">Task #{ev.taskId}</span>
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
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {dim.name}
                      </h4>
                      <div className="text-xs text-slate-400 mt-0.5">{dim.description}</div>
                    </div>
                    <span className="font-mono font-bold text-base text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-lg border border-sky-100 dark:border-sky-900/40">
                      L{currentLvl}
                    </span>
                  </div>

                  {/* Level Selector Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setLevel(key, lvl)}
                        className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg transition cursor-pointer ${
                          lvl <= currentLvl
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
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
                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase size={16} className="text-sky-600" />
                  项目 30 秒 / 1 分钟 / 3 分钟技术陈述 (Elevator Pitch)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  面试开场向面试官精准汇报系统架构、并发模型、关键设计与实测指标。
                </p>
              </div>

              {/* Pitch duration selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(['30s', '1m', '3m'] as const).map(len => (
                  <button
                    key={len}
                    onClick={() => setElevatorPitchLen(len)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      elevatorPitchLen === len
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-sans">
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
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-sky-600 transition cursor-pointer"
                title="复制陈述"
                type="button"
              >
                <Copy size={13} />
              </button>
            </div>
          </div>

          {/* Reverse Questions */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle size={16} className="text-sky-600" />
              高频面试逆向深度攻防题
            </h3>

            <div className="space-y-3">
              {PROJECT_REVERSE_QUESTIONS.map(q => {
                const isExpanded = !!expandedInterviewQ[q.id];
                return (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden"
                  >
                    <div
                      onClick={() => toggleInterviewQ(q.id)}
                      className="p-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition flex items-center justify-between gap-4 select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          Q
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {q.question}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {q.category}
                        </span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
                        {q.source && (
                          <div>
                            <div className="text-xs text-slate-400 font-mono mb-1">
                              源码位置: {q.source.file} ({q.source.line})
                            </div>
                            <CodeBlock code={q.source.snippet} language="cpp" maxHeight="max-h-[250px]" />
                          </div>
                        )}

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                          <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                            答题思路:
                          </div>
                          <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {q.answer}
                          </div>
                        </div>

                        {q.followUp && (
                          <div className="bg-sky-50 dark:bg-sky-950/30 p-3.5 rounded-xl border border-sky-100 dark:border-sky-900/40 text-xs">
                            <span className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5 mb-1">
                              <Lightbulb size={13} />
                              面试官潜在追问:
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">{q.followUp}</span>
                          </div>
                        )}

                        {q.trap && (
                          <div className="bg-rose-50 dark:bg-rose-950/30 p-3.5 rounded-xl border border-rose-100 dark:border-rose-900/40 text-xs">
                            <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 mb-1">
                              <AlertTriangle size={13} />
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Award size={16} className="text-sky-600" />
              精炼简历要点库 (直接可用，带指标量化)
            </h3>

            <div className="space-y-3">
              {RESUME_BULLETS.map((rb, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                      {rb.category}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed mt-1">
                      {rb.text}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(rb.text, '简历要点已复制')}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-sky-600 transition shrink-0 cursor-pointer"
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
              <Briefcase size={16} className="text-sky-600" />
              STAR 法则实战经历
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CAREER_STAR_STORIES.map(story => (
                <div
                  key={story.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
                >
                  <h4 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
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
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
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

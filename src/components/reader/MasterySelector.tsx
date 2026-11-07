import React from 'react';
import { Award, Check } from 'lucide-react';

interface MasterySelectorProps {
  articleId: string;
  currentLevel: number;
  onSelectLevel: (level: number) => void;
}

const MASTERY_TIERS = [
  { level: 0, label: '未读', desc: '尚未研读' },
  { level: 1, label: '了解概念', desc: '通读核心概念与背景' },
  { level: 2, label: '理清时序', desc: '理清调用链与状态机' },
  { level: 3, label: '能够阐述', desc: '口述架构亮点与设计取舍' },
  { level: 4, label: '✓ 已吃透 (独立编码)', desc: '独立编写与重构核心模块' },
  { level: 5, label: '✓ 生产调优', desc: '深入排障与生产级性能调优' },
];

export const MasterySelector: React.FC<MasterySelectorProps> = ({
  currentLevel,
  onSelectLevel,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-slate-200/50 dark:bg-slate-900/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.05)] text-xs">
      <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 mr-1 shrink-0 select-none">
        <Award size={15} className="text-amber-500" />
        <span>掌握度评级:</span>
      </span>
      <div className="flex flex-wrap gap-1.5">
        {MASTERY_TIERS.map((tier) => {
          const isSelected = currentLevel === tier.level;
          return (
            <button
              key={tier.level}
              onClick={() => onSelectLevel(tier.level)}
              title={tier.desc}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                isSelected
                  ? tier.level >= 4
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[3px_3px_8px_rgba(16,185,129,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold -translate-y-0.5'
                    : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-[3px_3px_8px_rgba(14,165,233,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold -translate-y-0.5'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5'
              }`}
            >
              <span className="flex items-center gap-1">
                {tier.label}
                {isSelected && <Check size={11} className="inline ml-0.5" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Award } from 'lucide-react';

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
    <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs">
      <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 mr-1.5 shrink-0 select-none">
        <Award size={14} className="text-amber-500" />
        <span>掌握度评级:</span>
      </span>
      <div className="flex flex-wrap gap-1">
        {MASTERY_TIERS.map((tier) => {
          const isSelected = currentLevel === tier.level;
          return (
            <button
              key={tier.level}
              onClick={() => onSelectLevel(tier.level)}
              title={tier.desc}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {tier.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Award } from 'lucide-react';

interface MasterySelectorProps {
  articleId: string;
  currentLevel: number;
  onSelectLevel: (level: number) => void;
}

const MASTERY_TIERS = [
  { level: 0, label: 'L0 未读', color: 'slate', desc: '尚未研读' },
  { level: 1, label: 'L1 了解', color: 'amber', desc: '通读概念' },
  { level: 2, label: 'L2 理解', color: 'sky', desc: '理清时序与状态机' },
  { level: 3, label: 'L3 能够解释', color: 'indigo', desc: '清晰口述架构亮点' },
  { level: 4, label: 'L4 能够编码', color: 'emerald', desc: '独立重构核心模块' },
  { level: 5, label: 'L5 能够应用', color: 'purple', desc: '深入排障与生产调优' },
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

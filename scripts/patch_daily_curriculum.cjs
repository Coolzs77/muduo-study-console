const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/daily/DailyCurriculumView.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Collapsed aside (line 130)
content = content.replace(
  'dark:shadow-[6px_6px_14px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] py-4 flex flex-col items-center space-y-3 sticky top-18 h-[calc(100vh-5.5rem)] hidden md:flex select-none transition-all duration-300',
  'dark:shadow-[0_4px_16px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] py-4 flex flex-col items-center space-y-3 sticky top-18 h-[calc(100vh-5.5rem)] hidden md:flex select-none transition-all duration-300'
);

// 2. Expand button (line 133)
content = content.replace(
  'shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"\n            title="展开任务目录"',
  'shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"\n            title="展开任务目录"'
);

// 3. Mini dividers (line 139 & 170)
content = content.replace(
  /<div className="w-8 h-1 rounded-full bg-slate-200\/80 dark:bg-slate-800\/80 shadow-\[inset_1px_1px_2px_rgba\(0,0,0,0\.1\),inset_-1px_-1px_2px_rgba\(255,255,255,0\.8\)\]" \/>/g,
  '<div className="w-8 h-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)]" />'
);

// 4. Quick Week Selectors in collapsed state (lines 147-148 & 160-161)
content = content.replace(
  /\? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-\[3px_3px_8px_rgba\(16,185,129,0\.3\),inset_2px_2px_4px_rgba\(255,255,255,0\.6\)\] font-bold'\s*\n\s*: 'bg-white\/80 dark:bg-slate-800\/80 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-\[2px_2px_5px_rgba\(0,0,0,0\.04\),inset_1\.5px_1\.5px_3px_rgba\(255,255,255,0\.8\)\]'/g,
  `? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-[3px_3px_8px_rgba(16,185,129,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_8px_rgba(16,185,129,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] font-bold'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]'`
);

// 5. Current day indicator badge (line 174)
content = content.replace(
  'dark:from-emerald-950/60 dark:to-teal-900/60 shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85)] flex flex-col',
  'dark:from-emerald-950/60 dark:to-teal-900/60 shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.1)] flex flex-col'
);

// 6. Expanded left sidebar (line 182)
content = content.replace(
  '<aside className="w-80 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 flex flex-col h-[calc(100vh-5.5rem)] sticky top-18 select-none transition-all duration-300 overflow-hidden">',
  '<aside className="w-80 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] p-4 flex flex-col h-[calc(100vh-5.5rem)] sticky top-18 select-none transition-all duration-300 overflow-hidden">'
);

// 7. Icon calendar (line 187)
content = content.replace(
  'shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-teal-600 dark:text-teal-400',
  'shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-teal-600 dark:text-teal-400'
);

// 8. Collapse btn (line 195)
content = content.replace(
  'shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"\n                title="收起任务目录"',
  'shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"\n                title="收起任务目录"'
);

// 9. Week Selector groove (line 203)
content = content.replace(
  'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.05)]',
  'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4)]'
);

// 10. Week items (line 208 & 220)
content = content.replace(
  /font-bold shadow-\[2px_2px_6px_rgba\(0,0,0,0\.08\),inset_1\.5px_1\.5px_3px_rgba\(255,255,255,0\.9\)\]'/g,
  "font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)]'"
);

// 11. Progress header (line 230)
content = content.replace(
  'shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] space-y-1.5',
  'shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] space-y-1.5'
);

// 12. Progress track (line 239)
content = content.replace(
  'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] overflow-hidden p-0.5',
  'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.4)] overflow-hidden p-0.5'
);

// 13. Task items list (line 275-276)
content = content.replace(
  `? 'bg-gradient-to-r from-emerald-100 via-teal-50 to-green-100 dark:from-emerald-950/60 dark:via-teal-900/40 dark:to-green-950/60 shadow-[4px_4px_12px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] -translate-y-0.5'
                      : 'bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[5px_5px_12px_rgba(0,0,0,0.06)]'`,
  `? 'bg-gradient-to-r from-emerald-100 via-teal-50 to-green-100 dark:from-emerald-950/60 dark:via-teal-900/40 dark:to-green-950/60 shadow-[4px_4px_12px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.12)] -translate-y-0.5'
                      : 'bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 hover:shadow-[5px_5px_12px_rgba(0,0,0,0.06)]'`
);

// 14. Mastered / learning pill in sidebar (lines 303 & 308)
content = content.replace(
  /shadow-\[inset_1px_1px_2px_rgba\(0,0,0,0\.06\),inset_-1px_-1px_2px_rgba\(255,255,255,0\.7\)\] shrink-0/g,
  'shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] shrink-0'
);

// 15. Main workspace container (line 335)
content = content.replace(
  '<main className="flex-1 min-w-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-6 sm:p-8 space-y-6 overflow-y-auto">',
  '<main className="flex-1 min-w-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] p-6 sm:p-8 space-y-6 overflow-y-auto">'
);

// 16. Header chips (lines 339, 342, 345)
content = content.replace(
  'dark:to-indigo-950/70 text-sky-800 dark:text-sky-300 text-xs font-black font-mono shadow-[2px_2px_5px_rgba(0,0,0,0.05),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)]',
  'dark:to-indigo-950/70 text-sky-800 dark:text-sky-300 text-xs font-black font-mono shadow-[2px_2px_5px_rgba(0,0,0,0.05),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
);

content = content.replace(
  'dark:text-indigo-300 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-[11px] font-bold',
  'dark:text-indigo-300 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-[11px] font-bold'
);

content = content.replace(
  'text-slate-600 dark:text-slate-400 text-[11px] font-semibold shadow-[2px_2px_4px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)]',
  'text-slate-600 dark:text-slate-400 text-[11px] font-semibold shadow-[2px_2px_4px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
);

// 17. Tag chips (line 364)
content = content.replace(
  'shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]"\n                >\n                  #{tag}',
  'shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]"\n                >\n                  #{tag}'
);

// 18. Section 1 card (line 374)
content = content.replace(
  '<section className="bg-white/70 dark:bg-slate-800/60 rounded-3xl p-6 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] space-y-4">',
  '<section className="bg-white/70 dark:bg-slate-800/60 rounded-3xl p-6 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] space-y-4">'
);

// 19. Section title icons (lines 376, 397, 410, 492)
content = content.replace(
  /shadow-\[inset_1\.5px_1\.5px_3px_rgba\(0,0,0,0\.08\),inset_-1px_-1px_2px_rgba\(255,255,255,0\.8\)\] text-amber-600/g,
  'shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-amber-600'
);
content = content.replace(
  /shadow-\[inset_1\.5px_1\.5px_3px_rgba\(0,0,0,0\.08\),inset_-1px_-1px_2px_rgba\(255,255,255,0\.8\)\] text-sky-600/g,
  'shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-sky-600'
);
content = content.replace(
  /shadow-\[inset_1\.5px_1\.5px_3px_rgba\(0,0,0,0\.08\),inset_-1px_-1px_2px_rgba\(255,255,255,0\.8\)\] text-indigo-600/g,
  'shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-indigo-600'
);
content = content.replace(
  /shadow-\[inset_1\.5px_1\.5px_3px_rgba\(0,0,0,0\.08\),inset_-1px_-1px_2px_rgba\(255,255,255,0\.8\)\] text-emerald-600/g,
  'shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-emerald-600'
);

// 20. Experiment card (line 408)
content = content.replace(
  'dark:shadow-[6px_6px_14px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-1px_-1px_2px_rgba(0,0,0,0.3)]">',
  'dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)]">'
);

// 21. Copy button (line 474)
content = content.replace(
  'text-sky-700 dark:text-sky-300 shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5',
  'text-sky-700 dark:text-sky-300 shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5'
);

// 22. Rigorous nuance cards (lines 498 & 510)
content = content.replace(
  /dark:shadow-\[6px_6px_14px_rgba\(0,0,0,0\.3\),inset_2px_2px_4px_rgba\(255,255,255,0\.08\)\] space-y-2/g,
  'dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] space-y-2'
);

// 23. Bottom Pagination (lines 535 & 548)
content = content.replace(
  `? 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-[3px_3px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90'`,
  `? 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-[3px_3px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90'`
);

content = content.replace(
  `? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[4px_4px_12px_rgba(16,185,129,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90'`,
  `? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[4px_4px_12px_rgba(16,185,129,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_12px_rgba(16,185,129,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90'`
);

// 24. Right aside container (line 561)
content = content.replace(
  '<aside className="w-80 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 h-[calc(100vh-5.5rem)] sticky top-18 hidden lg:flex flex-col space-y-4 select-none overflow-y-auto">',
  '<aside className="w-80 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] p-4 h-[calc(100vh-5.5rem)] sticky top-18 hidden lg:flex flex-col space-y-4 select-none overflow-y-auto">'
);

// 25. Mastery buttons (lines 589-591)
content = content.replace(
  `? 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/70 dark:to-teal-900/70 text-teal-900 dark:text-teal-100 font-bold shadow-[3px_3px_8px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] -translate-y-0.5'
                        : 'bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-950/70 dark:to-indigo-900/70 text-sky-900 dark:text-sky-100 font-bold shadow-[3px_3px_8px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] -translate-y-0.5'
                      : 'bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5'`,
  `? 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/70 dark:to-teal-900/70 text-teal-900 dark:text-teal-100 font-bold shadow-[3px_3px_8px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.1)] -translate-y-0.5'
                        : 'bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-950/70 dark:to-indigo-900/70 text-sky-900 dark:text-sky-100 font-bold shadow-[3px_3px_8px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.1)] -translate-y-0.5'
                      : 'bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5'`
);

// 26. Right aside cards (lines 603, 614, 635)
content = content.replace(
  /<div className="p-3\.5 rounded-2xl bg-white\/80 dark:bg-slate-800\/70 shadow-\[4px_4px_10px_rgba\(0,0,0,0\.05\),inset_2px_2px_4px_rgba\(255,255,255,0\.85\)\] space-y-1\.5 text-xs">/g,
  '<div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/70 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1.5 text-xs">'
);

content = content.replace(
  '<div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/70 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] space-y-2 text-xs">',
  '<div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/70 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-2 text-xs">'
);

// 27. Right aside tags (line 626)
content = content.replace(
  'shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-slate-700 dark:text-slate-200 text-[11px] font-semibold',
  'shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-slate-700 dark:text-slate-200 text-[11px] font-semibold'
);

// 28. Quiz launcher button (line 660)
content = content.replace(
  'shadow-[4px_4px_10px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] font-bold text-xs cursor-pointer',
  'shadow-[4px_4px_10px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.12)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] font-bold text-xs cursor-pointer'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('DailyCurriculumView.tsx patched successfully.');

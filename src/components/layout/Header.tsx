import React from 'react';
import { ActiveTab } from '../../types';
import {
  BookOpen,
  CheckSquare,
  LayoutDashboard,
  Code,
  Sun,
  Moon,
  Github,
  Calendar,
  Layers,
  Bookmark,
  Briefcase,
  Server,
  Clock
} from 'lucide-react';
import { useFocusTimer } from '../../hooks/useFocusTimer';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenEnvGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isDark,
  onToggleTheme,
  onOpenEnvGuide
}) => {
  const { isRunning, formattedTime } = useFocusTimer();

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: '仪表盘', icon: <LayoutDashboard size={14} /> },
    { id: 'daily', label: '任务', icon: <Calendar size={14} /> },
    { id: 'reader', label: '项目', icon: <BookOpen size={14} /> },
    { id: 'algo', label: '算法', icon: <CheckSquare size={14} /> },
    { id: 'learning', label: '学习系统', icon: <Bookmark size={14} /> },
    { id: 'source', label: '源码路线', icon: <Layers size={14} /> },
    { id: 'practice', label: '其他', icon: <Briefcase size={14} /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f4f7fb]/90 dark:bg-[#151922]/90 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.8)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.05)] border-0 select-none transition-colors duration-300">
      <div className="w-full px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Title */}
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-[4px_4px_10px_rgba(14,165,233,0.3),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-1px_-1px_2px_rgba(0,0,0,0.15)] group-hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            <Code size={18} />
          </div>
          <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white hidden md:inline">
            Muduo & CppAIService
          </span>
        </div>

        {/* Center Nav Tabs (Clay recessed slot with candy pill buttons) */}
        <nav className="flex items-center gap-1 bg-slate-200/50 dark:bg-slate-900/60 p-1.5 rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-1px_-1px_2px_rgba(255,255,255,0.05)] text-xs font-semibold overflow-x-auto max-w-full">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer shrink-0 active:scale-x-105 active:scale-y-90 ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-300 shadow-[3px_3px_8px_rgba(0,0,0,0.08),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] font-bold -translate-y-0.5'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Live Focus Pill + Linux Dev Guide + Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {isRunning && (
            <button
              onClick={() => {
                onSelectTab('dashboard');
                setTimeout(() => {
                  const el = document.getElementById('dashboard-focus-timer') || document.getElementById('dashboard-focus-timer-mobile');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.classList.add('ring-4', 'ring-amber-400/50');
                    setTimeout(() => el.classList.remove('ring-4', 'ring-amber-400/50'), 1500);
                  }
                }, 80);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/60 dark:to-orange-900/60 text-amber-800 dark:text-amber-200 shadow-[3px_3px_8px_rgba(0,0,0,0.08),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-xs font-mono font-bold cursor-pointer"
              title="专注计时进行中，点击返回仪表盘"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <Clock size={13} className="text-amber-600 dark:text-amber-400" />
              <span>{formattedTime}</span>
            </button>
          )}

          <button
            onClick={onOpenEnvGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-slate-750 text-sky-700 dark:text-sky-300 shadow-[3px_3px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-xs font-bold cursor-pointer"
            title="查看 Linux 远程开发环境实操手册"
          >
            <Server size={14} />
            <span className="hidden xl:inline">Linux 开发指引</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white shadow-[3px_3px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
            title={isDark ? '切换至浅色模式' : '切换至深色模式'}
          >
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
          </button>

          <a
            href="https://github.com/Coolzs77/muduo-study-console"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white shadow-[3px_3px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hidden sm:inline-flex cursor-pointer"
            title="查看 GitHub 仓库"
          >
            <Github size={15} />
          </a>
        </div>
      </div>
    </header>
  );
};

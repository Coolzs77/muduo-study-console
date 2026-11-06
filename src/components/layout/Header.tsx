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
  Server
} from 'lucide-react';

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
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: '学习大盘', icon: <LayoutDashboard size={14} /> },
    { id: 'daily', label: '28天任务', icon: <Calendar size={14} /> },
    { id: 'reader', label: '专栏阅读', icon: <BookOpen size={14} /> },
    { id: 'algo', label: '算法题库', icon: <CheckSquare size={14} /> },
    { id: 'learning', label: '学习系统', icon: <Bookmark size={14} /> },
    { id: 'source', label: '源码路线', icon: <Layers size={14} /> },
    { id: 'practice', label: '综合实战', icon: <Briefcase size={14} /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Title */}
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
            <Code size={18} />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white hidden md:inline">
            Muduo & CppAIService
          </span>
        </div>

        {/* Center Nav Tabs (Scrollable on small screens) */}
        <nav className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold overflow-x-auto max-w-full">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Linux Dev Guide + Theme Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenEnvGuide}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800 text-xs font-semibold transition cursor-pointer"
            title="查看 Linux 远程开发环境实操手册"
          >
            <Server size={14} />
            <span className="hidden xl:inline">Linux 开发指引</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={isDark ? '切换至浅色模式' : '切换至深色模式'}
          >
            {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
          </button>

          <a
            href="https://github.com/Coolzs77/muduo-study-console"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden sm:inline-flex"
            title="查看 GitHub 仓库"
          >
            <Github size={16} />
          </a>
        </div>
      </div>
    </header>
  );
};

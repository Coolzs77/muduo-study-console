import React from 'react';
import { ActiveTab } from '../../types';
import { BookOpen, CheckSquare, LayoutDashboard, Code, Sun, Moon, Github } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isDark,
  onToggleTheme,
}) => {
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'reader', label: '知识阅读', icon: <BookOpen size={15} /> },
    { id: 'algo', label: '算法题库', icon: <CheckSquare size={15} /> },
    { id: 'dashboard', label: '学习控制台', icon: <LayoutDashboard size={15} /> },
    { id: 'mapping', label: '源码映射', icon: <Code size={15} /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div
          onClick={() => onSelectTab('reader')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
            <Code size={18} />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
              Muduo & CppAIService
            </h1>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle & Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={isDark ? '切换至浅色模式' : '切换至深色模式'}
          >
            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
          </button>

          <a
            href="https://github.com/Coolzs77/muduo-study-console"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden sm:inline-flex"
            title="查看 GitHub 仓库"
          >
            <Github size={17} />
          </a>
        </div>
      </div>
    </header>
  );
};

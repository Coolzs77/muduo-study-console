import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  Network, 
  FileCode2, 
  AlertTriangle, 
  CheckSquare, 
  Terminal, 
  Download, 
  Upload, 
  RotateCcw
} from 'lucide-react';
import { AppState } from '../types';

interface NavbarProps {
  currentView: AppState['currentView'];
  onSwitchView: (view: AppState['currentView']) => void;
  onOpenEnvGuide: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onResetData: () => void;
}

interface NavItem {
  id: AppState['currentView'];
  label: string;
  icon: any;
  badge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSwitchView,
  onOpenEnvGuide,
  onExportData,
  onImportData,
  onResetData,
}) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: '攻坚大盘与拓扑', icon: LayoutDashboard },
    { id: 'daily', label: '28天实战大纲', icon: CalendarDays },
    { id: 'reading', label: '书卷伴读(Readest)', icon: BookOpen, badge: '直跳页码' },
    { id: 'mapping', label: '知识图谱映射', icon: Network },
    { id: 'source', label: '核心源码剖析', icon: FileCode2 },
    { id: 'pitfalls', label: '易错避坑指南', icon: AlertTriangle },
    { id: 'quiz', label: '每日自测中心', icon: CheckSquare },
  ];

  return (
    <header className="bg-white/95 backdrop-blur border-b border-stone-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* 标题与版本 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-900 to-indigo-900 text-white flex items-center justify-center font-bold font-serifHeading shadow-sm text-lg">
              m4
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-stone-900 font-serifHeading tracking-tight">
                  muduo C++ 工业实战个人控制台
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-mono">
                  v5.2 TS重构版
                </span>
              </div>
              <p className="text-xs text-stone-500 font-serifMono hidden sm:block">
                陈硕《Linux 多线程服务端编程》 + 《C++ Primer Plus》伴读系统
              </p>
            </div>
          </div>

          {/* 右侧工具栏 */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs font-serifMono">
            <button
              onClick={onOpenEnvGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
              title="Linux C++ 开发与编译排错矩阵"
            >
              <Terminal className="w-3.5 h-3.5 text-sky-700" />
              <span>环境矩阵</span>
            </button>
            <button
              onClick={onExportData}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
              title="导出学习进度与笔记 JSON"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>备份</span>
            </button>
            <button
              onClick={onImportData}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
              title="导入学习进度 JSON"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-700" />
              <span>导入</span>
            </button>
            <button
              onClick={onResetData}
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-500 transition cursor-pointer"
              title="重置为初始状态"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 顶部主导航 Tab */}
        <nav className="flex space-x-1.5 overflow-x-auto pt-3 pb-1 text-xs sm:text-sm font-serifHeading no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSwitchView(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer relative ${
                  active
                    ? 'bg-sky-950 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-stone-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    active ? 'bg-amber-400 text-sky-950 font-bold' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

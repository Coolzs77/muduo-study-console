import React, { useState, useMemo } from 'react';
import { SOURCE_ROADMAP, CPPAI_SOURCES_MAP } from '../../data/sourceRoadmapDataset';
import { CodeBlock } from '../common/CodeBlock';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { showToast } from '../common/Toast';
import {
  GitCommit,
  FileCode,
  Layers,
  Search,
  CheckCircle2,
  Copy,
  ChevronRight,
  Cpu,
  BookOpen,
  Check,
  Code2,
  Sparkles,
  ArrowRight,
  Bookmark,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export const SourceRoadmapView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'files'>('roadmap');

  // Roadmap state
  const [componentStatus, setComponentStatus] = useLocalStorage<Record<string, string>>(
    'muduo_roadmap_status',
    {}
  );
  const [componentNotes, setComponentNotes] = useLocalStorage<Record<string, string>>(
    'muduo_roadmap_notes',
    {}
  );
  const [selectedCompId, setSelectedCompId] = useState<string>(SOURCE_ROADMAP[0]?.id || 'channel');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage<boolean>(
    'sidebar_collapsed_source',
    false
  );

  // File browser state
  const fileKeys = useMemo(() => Object.keys(CPPAI_SOURCES_MAP), []);
  const [selectedFile, setSelectedFile] = useState<string>(fileKeys[0] || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Active component
  const currentComp = useMemo(() => {
    return SOURCE_ROADMAP.find(c => c.id === selectedCompId) || SOURCE_ROADMAP[0];
  }, [selectedCompId]);

  // Filtered components
  const filteredComponents = useMemo(() => {
    if (!searchQuery.trim()) return SOURCE_ROADMAP;
    const q = searchQuery.toLowerCase().trim();
    return SOURCE_ROADMAP.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.layer.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filtered files
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return fileKeys;
    const q = searchQuery.toLowerCase().trim();
    return fileKeys.filter(f => f.toLowerCase().includes(q));
  }, [fileKeys, searchQuery]);

  const handleStatusChange = (id: string, status: string) => {
    setComponentStatus(prev => ({ ...prev, [id]: status }));
    showToast(`组件状态已更新为: ${status}`, 'success');
  };

  const handleNoteChange = (id: string, note: string) => {
    setComponentNotes(prev => ({ ...prev, [id]: note }));
  };

  const currentFileContent = useMemo(() => {
    return CPPAI_SOURCES_MAP[selectedFile] || '// 文件内容为空';
  }, [selectedFile]);

  const fileStats = useMemo(() => {
    const lines = currentFileContent.split('\n').length;
    const chars = currentFileContent.length;
    return { lines, kb: (chars / 1024).toFixed(1) };
  }, [currentFileContent]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentFileContent);
      setCopiedCode(true);
      showToast('源码已复制到剪贴板', 'success');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      showToast('复制失败，请手动选择', 'warning');
    }
  };

  // Stats
  const masteredCompCount = useMemo(() => {
    return Object.values(componentStatus).filter(s => s === '已学习' || s === '已吃透').length;
  }, [componentStatus]);

  return (
    <div className="flex items-start w-full min-h-[calc(100vh-4rem)] bg-[#eef2f7] dark:bg-[#11141a] transition-colors duration-300 p-3 sm:p-4 gap-4 text-slate-800 dark:text-slate-200">
      {/* ========================================================= */}
      {/* LEFT COLUMN: Roadmap & Files Directory (Collapsible)       */}
      {/* ========================================================= */}
      {isSidebarCollapsed ? (
        <aside className="w-16 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/90 dark:bg-[#151922]/90 shadow-[6px_6px_14px_rgba(0,0,0,0.06),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] py-4 flex flex-col items-center space-y-3 sticky top-18 h-[calc(100vh-5.5rem)] hidden md:flex select-none transition-all duration-300">
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-sky-600 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
            title="展开源码路线"
          >
            <PanelLeftOpen size={18} />
          </button>

          <div className="w-8 h-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)]" />

          {/* Mini Tab Switchers (Clay Pills) */}
          <div className="flex flex-col items-center space-y-2 text-slate-600 dark:text-slate-400">
            <button
              onClick={() => { setActiveTab('roadmap'); setIsSidebarCollapsed(false); }}
              className={`p-2.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                activeTab === 'roadmap'
                  ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-[3px_3px_8px_rgba(245,158,11,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] font-bold'
                  : 'bg-white/80 dark:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
              }`}
              title="组件路线图 (8)"
            >
              <Layers size={18} />
            </button>
            <button
              onClick={() => { setActiveTab('files'); setIsSidebarCollapsed(false); }}
              className={`p-2.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                activeTab === 'files'
                  ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-[3px_3px_8px_rgba(245,158,11,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] font-bold'
                  : 'bg-white/80 dark:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
              }`}
              title={`源码文件浏览 (${fileKeys.length})`}
            >
              <FileCode size={18} />
            </button>
          </div>

          <div className="w-8 h-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)] mt-auto" />

          {/* Mastered Count Pill */}
          <div
            className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] flex flex-col items-center justify-center text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 cursor-pointer active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            onClick={() => setIsSidebarCollapsed(false)}
            title={`已学组件: ${masteredCompCount}/8`}
          >
            {masteredCompCount}/8
          </div>
        </aside>
      ) : (
        <aside className="w-80 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] p-4 space-y-4 overflow-y-auto sticky top-18 h-[calc(100vh-5.5rem)] hidden md:block transition-all duration-300 select-none">
          <div className="pb-2 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-amber-100/90 dark:bg-amber-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-amber-600 dark:text-amber-400">
                <Code2 size={14} />
              </div>
              <span>源码路线</span>
            </h2>
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
              title="收起源码路线"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

          {/* View Switcher Pills (Clay recessed groove) */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/50 dark:bg-slate-900/60 rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('roadmap');
                setSearchQuery('');
              }}
              type="button"
              className={`py-1.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex items-center justify-center gap-1.5 active:scale-x-105 active:scale-y-90 ${
                activeTab === 'roadmap'
                  ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)] -translate-y-0.5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>组件 (8)</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('files');
                setSearchQuery('');
              }}
              type="button"
              className={`py-1.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex items-center justify-center gap-1.5 active:scale-x-105 active:scale-y-90 ${
                activeTab === 'files'
                  ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)] -translate-y-0.5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCode size={13} />
              <span>源码 ({fileKeys.length})</span>
            </button>
          </div>

          {/* Search Input (Clay recessed input) */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={activeTab === 'roadmap' ? '搜索组件或职责...' : '搜索源文件名...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 dark:bg-slate-900/70 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden transition-all"
            />
          </div>

          {/* Components Tree */}
          {activeTab === 'roadmap' && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                8 大核心组件
              </div>
              {filteredComponents.map(comp => {
                const isSelected = selectedCompId === comp.id;
                const status = componentStatus[comp.id] || '未读';
                const isMastered = status === '已学习' || status === '已吃透';

                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompId(comp.id)}
                    type="button"
                    className={`w-full text-left p-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex items-start justify-between gap-2 active:scale-x-105 active:scale-y-90 select-none ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-950/60 dark:via-orange-900/40 dark:to-yellow-950/60 text-amber-950 dark:text-amber-100 shadow-[4px_4px_12px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.12)] -translate-y-0.5 font-bold'
                        : 'bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>{comp.name}</span>
                        {isMastered && (
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                        {comp.layer}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 mt-0.5 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] ${
                        isMastered
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : status === '学习中'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {status}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Source Files Tree */}
          {activeTab === 'files' && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                工程文件列表
              </div>
              {filteredFiles.map(file => {
                const isSelected = selectedFile === file;
                const isCpp = file.endsWith('.cpp');
                return (
                  <button
                    key={file}
                    onClick={() => setSelectedFile(file)}
                    type="button"
                    className={`w-full text-left px-3 py-2.5 rounded-2xl text-xs font-mono transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex items-center justify-between gap-2 active:scale-x-105 active:scale-y-90 select-none ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-950/60 dark:via-orange-900/40 dark:to-yellow-950/60 text-amber-950 dark:text-amber-100 shadow-[4px_4px_12px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.12)] font-bold -translate-y-0.5'
                        : 'bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate">{file}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] ${
                        isCpp
                          ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
                          : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      {isCpp ? 'CPP' : 'H'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </aside>
      )}

      {/* ========================================================= */}
      {/* CENTER COLUMN: Component Deep-Dive or Code (Fluid Full)   */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] p-6 sm:p-8 space-y-6 overflow-y-auto w-full">
        {activeTab === 'roadmap' && currentComp && (
          <div className="space-y-6">
            {/* Component Header */}
            <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                <Layers size={14} />
                <span>{currentComp.layer}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  class {currentComp.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] ${
                    componentStatus[currentComp.id] === '已学习' || componentStatus[currentComp.id] === '已吃透'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : componentStatus[currentComp.id] === '学习中'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {componentStatus[currentComp.id] === '已吃透' ? '已学习' : (componentStatus[currentComp.id] || '未读')}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">
                {currentComp.role}
              </p>
            </div>

            {/* Core Member Variables */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  <Cpu size={12} />
                </div>
                <span>成员变量</span>
              </h3>
              <div className="space-y-2">
                {currentComp.members.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-xs font-mono text-slate-800 dark:text-slate-200"
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Methods */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  <FileCode size={12} />
                </div>
                <span>核心函数</span>
              </h3>
              <div className="space-y-2">
                {currentComp.functions.map((fn, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-xs font-mono text-slate-800 dark:text-slate-200"
                  >
                    {fn}
                  </div>
                ))}
              </div>
            </div>

            {/* C++ Features Used */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  <Sparkles size={12} />
                </div>
                <span>所涉及现代 C++ 语法机制</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentComp.cppFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-2xl text-xs font-mono font-bold bg-amber-100/90 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Personal Study Notes */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                学习心得与工程手记
              </h3>
              <textarea
                rows={3}
                placeholder="记录对该组件调用链、死锁防护或生命周期边界的理解..."
                value={componentNotes[currentComp.id] || ''}
                onChange={e => handleNoteChange(currentComp.id, e.target.value)}
                className="w-full p-3.5 rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] bg-white/80 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden transition-all resize-y"
              />
            </div>
          </div>
        )}

        {/* File Browser Mode: Full LeetCode Style Code Canvas */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <div>
                <h1 className="text-base font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode size={16} className="text-amber-600 dark:text-amber-400" />
                  <span>{selectedFile}</span>
                </h1>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  {fileStats.lines} 行 · {fileStats.kb} KB
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>复制代码</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block */}
            <CodeBlock code={currentFileContent} language="cpp" />
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: Component Mastery Selector & Architecture   */}
      {/* ========================================================= */}
      <aside className="w-72 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] p-4 h-[calc(100vh-5.5rem)] sticky top-18 hidden xl:flex flex-col space-y-4 select-none overflow-y-auto">
        <div className="pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-amber-100/90 dark:bg-amber-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] text-amber-600 dark:text-amber-400">
              <GitCommit size={14} />
            </div>
            <span>组件评定</span>
          </h2>
        </div>

        {/* Component Mastery Selector (Clay Candy Buttons) */}
        {activeTab === 'roadmap' && currentComp && (
          <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)] space-y-3">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              设置 {currentComp.name} 掌握状态
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['已学习', '学习中', '未读'] as const).map(st => {
                const currentStatus = componentStatus[currentComp.id] === '已吃透' ? '已学习' : (componentStatus[currentComp.id] || '未读');
                const isCur = currentStatus === st;
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(currentComp.id, st)}
                    type="button"
                    className={`py-1.5 rounded-2xl text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${
                      isCur
                        ? st === '已学习'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[2px_2px_6px_rgba(16,185,129,0.3),inset_1.5px_1.5px_3px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.15)] font-bold -translate-y-0.5'
                          : st === '学习中'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[2px_2px_6px_rgba(245,158,11,0.3),inset_1.5px_1.5px_3px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.15)] font-bold -translate-y-0.5'
                          : 'bg-slate-600 text-white shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 shadow-[1px_1px_3px_rgba(0,0,0,0.04)]'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Roadmap Total Progress */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-100/70 to-yellow-50/70 dark:from-amber-950/40 dark:to-yellow-900/30 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
            <span>核心组件已学习</span>
            <span className="font-mono font-bold text-amber-800 dark:text-amber-300">
              {masteredCompCount} / {SOURCE_ROADMAP.length}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-amber-200/50 dark:bg-amber-950/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.4)] overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                width: `${Math.round((masteredCompCount / SOURCE_ROADMAP.length) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Call Chain Topology Guidance */}
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)] text-xs space-y-2.5">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
              <Layers size={12} />
            </div>
            <span>核心调用时序</span>
          </div>
          <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300 space-y-1 leading-relaxed bg-slate-100/60 dark:bg-slate-900/60 p-3 rounded-2xl shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06)]">
            <div>1. EventLoop::loop()</div>
            <div>&nbsp;&nbsp;↳ Poller::poll()</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;↳ Channel::handleEvent()</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ TcpConnection::handleRead()</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ HttpContext::parseRequest()</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ Router::route()</div>
          </div>
        </div>
      </aside>
    </div>
  );
};

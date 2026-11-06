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
    return Object.values(componentStatus).filter(s => s === '已吃透').length;
  }, [componentStatus]);

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950">
      {/* ========================================================= */}
      {/* LEFT COLUMN: Roadmap & Files Directory (Collapsible)       */}
      {/* ========================================================= */}
      {isSidebarCollapsed ? (
        <aside className="w-14 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 py-3.5 flex flex-col items-center space-y-3 sticky top-16 h-[calc(100vh-4rem)] hidden md:flex select-none transition-all duration-300">
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer active-press"
            title="展开源码路线"
          >
            <PanelLeftOpen size={18} />
          </button>

          <div className="w-8 h-px bg-slate-200 dark:bg-slate-800" />

          {/* Mini Tab Switchers */}
          <div className="flex flex-col items-center space-y-2 text-slate-600 dark:text-slate-400">
            <button
              onClick={() => { setActiveTab('roadmap'); setIsSidebarCollapsed(false); }}
              className={`p-2 rounded-xl transition cursor-pointer active-press ${
                activeTab === 'roadmap'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
              title="组件路线图 (8)"
            >
              <Layers size={18} />
            </button>
            <button
              onClick={() => { setActiveTab('files'); setIsSidebarCollapsed(false); }}
              className={`p-2 rounded-xl transition cursor-pointer active-press ${
                activeTab === 'files'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
              title="源码文件浏览 (11)"
            >
              <FileCode size={18} />
            </button>
          </div>

          <div className="w-8 h-px bg-slate-200 dark:bg-slate-800 mt-auto" />

          {/* Mastered Count Pill */}
          <div
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 cursor-pointer"
            onClick={() => setIsSidebarCollapsed(false)}
            title={`已吃透组件: ${masteredCompCount}/8`}
          >
            {masteredCompCount}/8
          </div>
        </aside>
      ) : (
        <aside className="w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-4 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)] hidden md:block transition-all duration-300">
          <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 size={16} className="text-sky-600 dark:text-sky-400" />
              <span>源码路线</span>
            </h2>
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer active-press"
              title="收起源码路线"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

        {/* View Switcher Pills */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('roadmap');
              setSearchQuery('');
            }}
            type="button"
            className={`py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'roadmap'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs font-bold'
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
            className={`py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'files'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode size={13} />
            <span>源码 ({fileKeys.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'roadmap' ? '搜索组件或职责...' : '搜索源文件名...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Components Tree */}
        {activeTab === 'roadmap' && (
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              8 大核心组件
            </div>
            {filteredComponents.map(comp => {
              const isSelected = selectedCompId === comp.id;
              const status = componentStatus[comp.id] || '未读';
              const isMastered = status === '已吃透';

              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedCompId(comp.id)}
                  type="button"
                  className={`w-full text-left p-2.5 rounded-xl transition cursor-pointer flex items-start justify-between gap-2 border ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200'
                      : 'bg-white dark:bg-slate-900/50 border-slate-200/70 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>{comp.name}</span>
                      {isMastered && (
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {comp.layer}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 mt-0.5 ${
                      isMastered
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : status === '学习中'
                        ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
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
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
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
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-mono transition cursor-pointer flex items-center justify-between gap-2 border ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200 font-bold'
                      : 'bg-white dark:bg-slate-900/50 border-slate-200/70 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate">{file}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-sans shrink-0 ${
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
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6 overflow-y-auto w-full">
        {activeTab === 'roadmap' && currentComp && (
          <div className="space-y-6">
            {/* Component Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
                <Layers size={14} />
                <span>{currentComp.layer}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  class {currentComp.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    componentStatus[currentComp.id] === '已吃透'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                      : componentStatus[currentComp.id] === '学习中'
                      ? 'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800'
                      : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}
                >
                  {componentStatus[currentComp.id] || '未读'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {currentComp.role}
              </p>
            </div>

            {/* Core Member Variables */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Cpu size={14} className="text-sky-600" />
                <span>成员变量</span>
              </h3>
              <div className="space-y-1.5">
                {currentComp.members.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Methods */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileCode size={14} className="text-emerald-600" />
                <span>核心函数</span>
              </h3>
              <div className="space-y-1.5">
                {currentComp.functions.map((fn, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
                  >
                    {fn}
                  </div>
                ))}
              </div>
            </div>

            {/* C++ Features Used */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <span>所涉及现代 C++ 语法机制</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {currentComp.cppFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Personal Study Notes */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                学习心得与工程手记
              </h3>
              <textarea
                rows={3}
                placeholder="记录对该组件调用链、死锁防护或生命周期边界的理解..."
                value={componentNotes[currentComp.id] || ''}
                onChange={e => handleNoteChange(currentComp.id, e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-y"
              />
            </div>
          </div>
        )}

        {/* File Browser Mode: Full LeetCode Style Code Canvas */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h1 className="text-base font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode size={16} className="text-sky-600" />
                  <span>{selectedFile}</span>
                </h1>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {fileStats.lines} 行 · {fileStats.kb} KB
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer shadow-2xs"
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

            {/* LeetCode-style Code Block */}
            <CodeBlock code={currentFileContent} language="cpp" />
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: Component Mastery Selector & Architecture   */}
      {/* ========================================================= */}
      <aside className="w-72 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-5 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)] hidden xl:block">
        <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitCommit size={16} className="text-sky-600 dark:text-sky-400" />
            <span>组件评定</span>
          </h2>
        </div>

        {/* Component Mastery Selector */}
        {activeTab === 'roadmap' && currentComp && (
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              设置 {currentComp.name} 掌握状态
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['已吃透', '学习中', '未读'] as const).map(st => {
                const isCur = (componentStatus[currentComp.id] || '未读') === st;
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(currentComp.id, st)}
                    type="button"
                    className={`py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      isCur
                        ? st === '已吃透'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : st === '学习中'
                          ? 'bg-sky-500 text-white shadow-xs'
                          : 'bg-slate-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
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
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
            <span>核心组件已吃透</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              {masteredCompCount} / {SOURCE_ROADMAP.length}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{
                width: `${Math.round((masteredCompCount / SOURCE_ROADMAP.length) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Call Chain Topology Guidance */}
        <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Layers size={14} className="text-sky-500" />
            <span>核心调用时序</span>
          </div>
          <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1 leading-relaxed">
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

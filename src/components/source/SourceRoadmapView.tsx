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
  BookOpen
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

  // File browser state
  const fileKeys = useMemo(() => Object.keys(CPPAI_SOURCES_MAP), []);
  const [selectedFile, setSelectedFile] = useState<string>(fileKeys[0] || '');
  const [fileSearch, setFileSearch] = useState('');

  const filteredFiles = useMemo(() => {
    if (!fileSearch.trim()) return fileKeys;
    const q = fileSearch.toLowerCase().trim();
    return fileKeys.filter(f => f.toLowerCase().includes(q));
  }, [fileKeys, fileSearch]);

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

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <Layers size={22} />
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            源码路线
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          包含 8 个源码演进阶段与工程源码文件阅读。
        </p>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'roadmap'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <GitCommit size={15} />
            <span>8 个源码演进阶段</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'files'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <FileCode size={15} />
            <span>工程源码文件</span>
          </button>
        </div>
      </div>

      {/* View 1: 8 阶演进路线 */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Stepper overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {SOURCE_ROADMAP.map((item, idx) => {
              const status = componentStatus[item.id] || '未读';
              return (
                <a
                  key={item.id}
                  href={`#roadmap-step-${item.id}`}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-sky-500 transition text-center group block"
                >
                  <div className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400">
                    Step {idx + 1}
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                    {item.name}
                  </div>
                  <div className="mt-1">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium ${
                        status === '已吃透'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : status === '精读中'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Cards for each stage */}
          <div className="space-y-5">
            {SOURCE_ROADMAP.map((item, idx) => {
              const status = componentStatus[item.id] || '未读';
              const note = componentNotes[item.id] || '';

              return (
                <div
                  key={item.id}
                  id={`roadmap-step-${item.id}`}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-mono font-black text-sm flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-lg text-slate-900 dark:text-white">
                            {item.name}
                          </h3>
                          <span className="text-xs px-2.5 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 font-semibold">
                            {item.layer}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          关联学习天数: Day {item.relatedDays.join(', Day ')}
                        </div>
                      </div>
                    </div>

                    {/* Status selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">精读状态:</span>
                      <select
                        value={status}
                        onChange={e => handleStatusChange(item.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        <option value="未读">未读</option>
                        <option value="精读中">精读中</option>
                        <option value="已吃透">已吃透</option>
                      </select>
                    </div>
                  </div>

                  {/* Role description */}
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/60 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-bold text-slate-900 dark:text-white">架构定位与职责: </span>
                    {item.role}
                  </div>

                  {/* Members & Functions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    {/* Members */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                      <div className="font-sans font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu size={14} className="text-sky-500" />
                        核心数据成员
                      </div>
                      <ul className="space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-400">
                        {item.members.map((m, mIdx) => (
                          <li key={mIdx}>{m}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Functions */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                      <div className="font-sans font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <FileCode size={14} className="text-emerald-500" />
                        核心成员函数
                      </div>
                      <ul className="space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-400">
                        {item.functions.map((f, fIdx) => (
                          <li key={fIdx}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* C++ Features Used */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-bold text-slate-500 mr-1">涉及关键现代 C++ 机制:</span>
                    {item.cppFeatures.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60 font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Notes Area */}
                  <div className="pt-2">
                    <textarea
                      value={note}
                      onChange={e => handleNoteChange(item.id, e.target.value)}
                      placeholder={`记录对 ${item.name} 源码的阅读思考与关键断言机制...`}
                      rows={2}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500 transition leading-relaxed font-mono"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: 42 源码文件全集浏览器 */}
      {activeTab === 'files' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left File List */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={fileSearch}
                onChange={e => setFileSearch(e.target.value)}
                placeholder="搜索文件路径（共 42 个）..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
              />
            </div>

            <div className="max-h-[600px] overflow-y-auto space-y-1 pr-1 font-mono text-xs">
              {filteredFiles.map(filename => {
                const isSelected = selectedFile === filename;
                return (
                  <button
                    key={filename}
                    onClick={() => setSelectedFile(filename)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-600 text-white font-bold shadow-xs'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate">{filename}</span>
                    <ChevronRight size={13} className="shrink-0 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Code Viewer */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {selectedFile}
                </h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {fileStats.lines} 行代码 · 大小 {fileStats.kb} KB
                </div>
              </div>
            </div>

            {/* Syntax-highlighted code block */}
            <CodeBlock
              code={currentFileContent}
              language="cpp"
              title={selectedFile}
              maxHeight="max-h-[650px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

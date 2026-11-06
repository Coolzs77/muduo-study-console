import React, { useState, useMemo } from 'react';
import { PITFALLS_DATASET } from '../../data/pitfallsDataset';
import { PitfallItem } from '../../types';
import { CodeBlock } from '../common/CodeBlock';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { showToast } from '../common/Toast';
import {
  AlertTriangle,
  Search,
  Plus,
  X,
  Bug,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Lightbulb
} from 'lucide-react';

export const PitfallsView: React.FC = () => {
  const [customPitfalls, setCustomPitfalls] = useLocalStorage<PitfallItem[]>(
    'muduo_custom_pitfalls',
    []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New pitfall form state
  const [newTitle, setNewTitle] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newErrorCode, setNewErrorCode] = useState('');
  const [newSymptom, setNewSymptom] = useState('');
  const [newCause, setNewCause] = useState('');
  const [newCorrectCode, setNewCorrectCode] = useState('');
  const [newConclusion, setNewConclusion] = useState('');

  // Combined dataset
  const allPitfalls = useMemo(() => {
    return [...customPitfalls, ...PITFALLS_DATASET];
  }, [customPitfalls]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    allPitfalls.forEach(p => {
      (p.keywords || []).forEach(k => set.add(k));
    });
    return ['全部', ...Array.from(set)];
  }, [allPitfalls]);

  // Filtered pitfalls
  const filteredPitfalls = useMemo(() => {
    return allPitfalls.filter(item => {
      // Tag filter
      if (selectedTag !== '全部' && !(item.keywords || []).includes(selectedTag)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inSymptom = item.errorSymptom.toLowerCase().includes(q);
        const inCause = item.errorCause.toLowerCase().includes(q);
        const inConclusion = item.conclusion.toLowerCase().includes(q);
        const inKeywords = (item.keywords || []).some(k => k.toLowerCase().includes(q));
        if (!inTitle && !inSymptom && !inCause && !inConclusion && !inKeywords) {
          return false;
        }
      }

      return true;
    });
  }, [allPitfalls, selectedTag, searchQuery]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('请输入踩坑标题', 'warning');
      return;
    }

    const newItem: PitfallItem = {
      id: `custom_p_${Date.now()}`,
      title: newTitle.trim(),
      date: new Date().toISOString().split('T')[0],
      keywords: newTags
        .split(/[,，\s]+/)
        .map(t => t.trim())
        .filter(Boolean),
      errorCode: newErrorCode.trim() || '// 暂无错误示例',
      errorSymptom: newSymptom.trim() || '未定义行为或崩溃',
      errorCause: newCause.trim() || '内存管理不当',
      correctCode: newCorrectCode.trim() || '// 暂无修复方案',
      conclusion: newConclusion.trim() || '遵循现代 C++ RAII 规范',
      category: '自定义踩坑'
    };

    setCustomPitfalls(prev => [newItem, ...prev]);
    showToast('新踩坑档案已创建并保存', 'success');

    // Reset and close
    setNewTitle('');
    setNewTags('');
    setNewErrorCode('');
    setNewSymptom('');
    setNewCause('');
    setNewCorrectCode('');
    setNewConclusion('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <ShieldAlert size={22} />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              问题记录
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            收录常见 C++ 问题案例与排查记录，提供错误与正确代码对比。
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm transition cursor-pointer shadow-xs active:scale-95 shrink-0"
          type="button"
        >
          <Plus size={16} />
          <span>记录新问题</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索标题、报错信息、原因或总结..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500 transition"
          />
        </div>

        {/* Tags Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedTag === tag
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              type="button"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Pitfall Cards Grid */}
      <div className="space-y-6">
        {filteredPitfalls.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
            未找到匹配的踩坑记录
          </div>
        ) : (
          filteredPitfalls.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(item.keywords || []).map((k, kIdx) => (
                    <span
                      key={kIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {k}
                    </span>
                  ))}
                  {item.day && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300">
                      Day {item.day}
                    </span>
                  )}
                </div>
              </div>

              {/* Error Symptom & Root Cause */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-rose-50/60 dark:bg-rose-950/20 p-3.5 rounded-xl border border-rose-100 dark:border-rose-900/30 space-y-1">
                  <div className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                    <Flame size={14} />
                    错误现象 (Symptom):
                  </div>
                  <p className="text-rose-900 dark:text-rose-200 leading-relaxed font-mono">
                    {item.errorSymptom}
                  </p>
                </div>

                <div className="bg-amber-50/60 dark:bg-amber-950/20 p-3.5 rounded-xl border border-amber-100 dark:border-amber-900/30 space-y-1">
                  <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Bug size={14} />
                    底层根因分析 (RCA):
                  </div>
                  <p className="text-amber-900 dark:text-amber-200 leading-relaxed">
                    {item.errorCause}
                  </p>
                </div>
              </div>

              {/* Code Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="font-bold text-xs text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
                    <AlertTriangle size={13} />
                    错误代码示例 (Buggy Code)
                  </div>
                  <CodeBlock
                    code={item.errorCode}
                    language="cpp"
                    title="错误现场"
                    maxHeight="max-h-[300px]"
                  />
                </div>

                <div>
                  <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    正确方案 (Fixed Code)
                  </div>
                  <CodeBlock
                    code={item.correctCode}
                    language="cpp"
                    title="标准修复"
                    maxHeight="max-h-[300px]"
                  />
                </div>
              </div>

              {/* Conclusion Rule */}
              {item.conclusion && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <Lightbulb size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">总结建议: </span>
                    <span>{item.conclusion}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Pitfall Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Plus size={18} className="text-sky-600" />
                新增问题记录
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  问题标题 *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="如: shared_ptr 在多线程无锁读写引发的控制块数据竞争"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  关键词标签 (空格或逗号分隔)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="shared_ptr 多线程 数据竞争"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    崩溃现象 / 报错信息
                  </label>
                  <textarea
                    rows={2}
                    value={newSymptom}
                    onChange={e => setNewSymptom(e.target.value)}
                    placeholder="程序偶发崩溃，SIGSEGV，堆栈指向 _Sp_counted_base::release"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    根本原因 (RCA)
                  </label>
                  <textarea
                    rows={2}
                    value={newCause}
                    onChange={e => setNewCause(e.target.value)}
                    placeholder="shared_ptr 引用计数本身原子，但指向的对象本身并非线程安全..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  错误代码示例
                </label>
                <textarea
                  rows={3}
                  value={newErrorCode}
                  onChange={e => setNewErrorCode(e.target.value)}
                  placeholder="// 粘贴触发 Bug 的 C++ 代码"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  正确修复方案代码
                </label>
                <textarea
                  rows={3}
                  value={newCorrectCode}
                  onChange={e => setNewCorrectCode(e.target.value)}
                  placeholder="// 粘贴修复后的安全代码"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  总结与建议
                </label>
                <input
                  type="text"
                  value={newConclusion}
                  onChange={e => setNewConclusion(e.target.value)}
                  placeholder="跨线程共享 shared_ptr 时若有写操作必须使用互斥锁或 atomic_load/store"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-xs"
                >
                  确认保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

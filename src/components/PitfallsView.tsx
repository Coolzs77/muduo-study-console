import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Bug, Plus, X, Sparkles } from 'lucide-react';
import { PITFALLS_DATASET } from '../data/pitfallsDataset';

interface PitfallsViewProps {
  onShowToast: (msg: string) => void;
}

export const PitfallsView: React.FC<PitfallsViewProps> = ({ onShowToast }) => {
  const [pitfalls, setPitfalls] = useState(PITFALLS_DATASET);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 新建陷阱表单
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('多线程竞争');
  const [newSymptom, setNewSymptom] = useState('');
  const [newBadCode, setNewBadCode] = useState('');
  const [newGoodCode, setNewGoodCode] = useState('');
  const [newCause, setNewCause] = useState('');

  const categories = ['ALL', '对象生命周期', '多线程竞争', 'Socket与网络', 'C++语法陷阱'];

  const filtered = activeCategory === 'ALL'
    ? pitfalls
    : pitfalls.filter((p: any) => p.category === activeCategory);

  const handleAddPitfall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem = {
      id: `custom_${Date.now()}`,
      title: newTitle,
      category: newCategory,
      symptom: newSymptom,
      badCode: newBadCode,
      goodCode: newGoodCode,
      cause: newCause,
    };

    setPitfalls([newItem, ...pitfalls]);
    setIsAddModalOpen(false);
    onShowToast("已成功记录你的实战避坑笔记！");
    // 重置表单
    setNewTitle('');
    setNewSymptom('');
    setNewBadCode('');
    setNewGoodCode('');
    setNewCause('');
  };

  return (
    <div className="space-y-6">
      {/* 顶部工具栏 */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap font-serifHeading text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-rose-950 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>记录新的实战踩坑</span>
        </button>
      </div>

      {/* 陷阱卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item: any) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs hover:shadow-md transition space-y-4 academic-card"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                  <Bug className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-mono">
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 font-serifHeading mt-0.5">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* 故障表象 */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-serifHeading space-y-1">
              <span className="font-bold text-stone-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>灾难表象 (Symptom)：</span>
              </span>
              <p className="text-stone-600 font-serifMono leading-relaxed">{item.symptom}</p>
            </div>

            {/* 错误代码 vs 正确工业解法 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-rose-700 font-bold text-[11px] flex items-center gap-1">
                  <X className="w-3 h-3" />
                  <span>翻车反例代码：</span>
                </span>
                <pre className="p-2.5 rounded-xl bg-rose-50/50 text-rose-950 border border-rose-200 overflow-x-auto text-[11px] leading-relaxed">
                  <code>{item.badCode}</code>
                </pre>
              </div>

              <div className="space-y-1">
                <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>muduo 规范解法：</span>
                </span>
                <pre className="p-2.5 rounded-xl bg-emerald-50/50 text-emerald-950 border border-emerald-200 overflow-x-auto text-[11px] leading-relaxed">
                  <code>{item.goodCode}</code>
                </pre>
              </div>
            </div>

            {/* 根本诱因剖析 */}
            <div className="text-xs text-stone-600 font-serifMono leading-relaxed pt-2 border-t border-stone-100">
              <span className="font-bold text-stone-800">底层机制解析：</span> {item.cause}
            </div>
          </div>
        ))}
      </div>

      {/* 新增踩坑记录模态框 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900 font-serifHeading flex items-center gap-2">
                <Bug className="w-5 h-5 text-rose-600" />
                <span>记录我的实战踩坑与防坑心得</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPitfall} className="space-y-3.5 text-xs font-serifHeading">
              <div>
                <label className="font-bold text-stone-700 block mb-1">陷阱标题：</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="如：智能指针在多线程中的析构竞争..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-rose-500 font-serifMono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">分类：</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden font-serifMono"
                >
                  <option value="对象生命周期">对象生命周期</option>
                  <option value="多线程竞争">多线程竞争</option>
                  <option value="Socket与网络">Socket与网络</option>
                  <option value="C++语法陷阱">C++语法陷阱</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">灾难表象 (Symptom)：</label>
                <input
                  type="text"
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  placeholder="如：偶尔偶发 Core Dump、死锁、内存泄露..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white font-serifMono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">错误反例代码：</label>
                <textarea
                  rows={2}
                  value={newBadCode}
                  onChange={(e) => setNewBadCode(e.target.value)}
                  placeholder="// 导致问题的写法"
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">正确规范代码：</label>
                <textarea
                  rows={2}
                  value={newGoodCode}
                  onChange={(e) => setNewGoodCode(e.target.value)}
                  placeholder="// 推荐的稳健写法"
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">底层机制与原理解释：</label>
                <textarea
                  rows={2}
                  value={newCause}
                  onChange={(e) => setNewCause(e.target.value)}
                  placeholder="为什么会出现这种问题？底层机制是什么？"
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-serifMono"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  保存记录
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

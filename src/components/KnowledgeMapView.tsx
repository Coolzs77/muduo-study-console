import React, { useState } from 'react';
import { Network, Search, Filter, Sparkles, ExternalLink } from 'lucide-react';
import { MAPPING_MATRIX } from '../data/mappingMatrix';

export const KnowledgeMapView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'C++11/14基础', 'POSIX网络与系统', 'muduo核心抽象', '设计模式与工程'];

  const filteredItems = MAPPING_MATRIX.filter((item: any) => {
    const matchesSearch = 
      item.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.muduoClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* 搜索与过滤工具栏 */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索 C++11 特性、POSIX API、muduo 类名或设计模式..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-serifMono focus:outline-hidden focus:border-sky-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap text-xs font-serifHeading">
          <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-950 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 概念矩阵表格 */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-serifHeading border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3.5 pl-5">技术范畴</th>
                <th className="p-3.5">核心概念</th>
                <th className="p-3.5">muduo 对应类库</th>
                <th className="p-3.5">底层 POSIX API</th>
                <th className="p-3.5">C++ 现代标准</th>
                <th className="p-3.5">设计模式 / 架构</th>
                <th className="p-3.5 pr-5">考点解析与原理解析</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-serifMono">
              {filteredItems.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-sky-50/40 transition">
                  <td className="p-3.5 pl-5 font-bold text-sky-900 font-serifHeading whitespace-nowrap">
                    {row.category}
                  </td>
                  <td className="p-3.5 font-bold text-stone-900 whitespace-nowrap">
                    {row.concept}
                  </td>
                  <td className="p-3.5 text-amber-800 font-bold whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                      {row.muduoClass}
                    </span>
                  </td>
                  <td className="p-3.5 text-rose-800 whitespace-nowrap">
                    <code className="px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200">
                      {row.posixApi}
                    </code>
                  </td>
                  <td className="p-3.5 text-indigo-800 whitespace-nowrap">
                    <code className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200">
                      {row.cppStandard}
                    </code>
                  </td>
                  <td className="p-3.5 text-stone-700 whitespace-nowrap font-serifHeading">
                    {row.designPattern}
                  </td>
                  <td className="p-3.5 pr-5 text-stone-600 text-xs leading-relaxed max-w-md font-serifHeading">
                    {row.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

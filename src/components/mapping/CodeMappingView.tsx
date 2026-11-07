import React from 'react';
import { CPP_SYNTAX_MAPPINGS } from '../../data/mappingDataset';
import { CodeBlock } from '../common/CodeBlock';
import { FileCode, Cpu, Lightbulb, Bookmark } from 'lucide-react';

export const CodeMappingView: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="bg-white/90 dark:bg-[#1a1f2c]/90 rounded-3xl p-6 sm:p-7 border border-white/70 dark:border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900/60 dark:to-sky-800/40 text-sky-700 dark:text-sky-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <Bookmark size={22} />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              代码映射
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              现代 C++ 特性在网络库与业务层中的实现映射与代码参考。
            </p>
          </div>
        </div>
      </div>

      {/* Mapping Cards */}
      <div className="space-y-4">
        {CPP_SYNTAX_MAPPINGS.map((mapping, idx) => (
          <div
            key={idx}
            className="bg-white/85 dark:bg-[#1e2433]/85 rounded-3xl p-5 sm:p-6 border border-white/70 dark:border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-[2px_2px_5px_rgba(59,130,246,0.3),inset_1px_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.15)]">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {mapping.feature}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="px-3 py-1 rounded-full font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  {mapping.cppStandard || 'C++11'}
                </span>
                <span className="px-3 py-1 rounded-full font-mono font-bold text-xs text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 shadow-[inset_1px_1px_2px_rgba(14,165,233,0.15)]">
                  {mapping.muduoClassOrFunction || mapping.muduoLocation}
                </span>
              </div>
            </div>

            {/* Design Rationale */}
            <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-amber-50/70 dark:bg-amber-950/30 p-3.5 rounded-2xl border border-amber-200/50 dark:border-amber-900/30 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
              <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">工程设计思想: </span>
                <span>{mapping.designRationale || mapping.desc}</span>
              </div>
            </div>

            {/* Source file */}
            {mapping.muduoFile && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono px-1">
                <FileCode size={14} className="text-slate-400 shrink-0" />
                <span>所在文件: </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  {mapping.muduoFile}
                </span>
              </div>
            )}

            {/* Code Block with Syntax Highlighting */}
            {(mapping.coreCode || mapping.snippet) && (
              <CodeBlock
                code={mapping.coreCode || mapping.snippet || ''}
                language="cpp"
                title={`${mapping.feature} 源码实现`}
                maxHeight="max-h-[300px]"
              />
            )}

            {/* CppAIService Mapping (if available) */}
            {mapping.aiServiceMapping && (
              <div className="flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <Cpu size={15} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <span className="font-bold">CppAIService 业务层扩展: </span>
                  <span>{mapping.aiServiceMapping}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

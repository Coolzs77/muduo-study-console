import React from 'react';
import { CPP_SYNTAX_MAPPINGS } from '../../data/mappingDataset';
import { CodeBlock } from '../common/CodeBlock';
import { FileCode, Cpu, Lightbulb, Bookmark } from 'lucide-react';

export const CodeMappingView: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <Bookmark size={22} />
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            代码映射
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          现代 C++ 特性在网络库与业务层中的实现映射与代码参考。
        </p>
      </div>

      {/* Mapping Cards */}
      <div className="space-y-4">
        {CPP_SYNTAX_MAPPINGS.map((mapping, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {mapping.feature}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-md font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {mapping.cppStandard || 'C++11'}
                </span>
                <span className="px-2 py-0.5 rounded-md font-mono text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                  {mapping.muduoClassOrFunction || mapping.muduoLocation}
                </span>
              </div>
            </div>

            {/* Design Rationale */}
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <Lightbulb size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">工程设计思想: </span>
                <span>{mapping.designRationale || mapping.desc}</span>
              </div>
            </div>

            {/* Source file */}
            {mapping.muduoFile && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <FileCode size={13} className="text-slate-400" />
                <span>所在文件: </span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
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
              <div className="flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60">
                <Cpu size={14} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <span className="font-semibold">CppAIService 业务层扩展: </span>
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

import React from 'react';
import { CPP_SYNTAX_MAPPINGS } from '../../data/mappingDataset';
import { Terminal, FileCode, Cpu, Lightbulb } from 'lucide-react';

export const CodeMappingView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          C++ 核心机制 ➔ Muduo 源码设计映射
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          清晰对应每个关键 C++ 现代特性在底层网络库与 CppAIService 中的文件落地、工程设计思想与代表性代码实现。
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
                  {mapping.cppStandard}
                </span>
                <span className="px-2 py-0.5 rounded-md font-mono text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                  {mapping.muduoClassOrFunction}
                </span>
              </div>
            </div>

            {/* Design Rationale */}
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Lightbulb size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">工程设计思想: </span>
                <span>{mapping.designRationale}</span>
              </div>
            </div>

            {/* Source file */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <FileCode size={13} className="text-slate-400" />
              <span>所在文件: </span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">{mapping.muduoFile}</span>
            </div>

            {/* Code Block */}
            {mapping.coreCode && (
              <div className="rounded-xl overflow-hidden bg-slate-950 text-slate-100 border border-slate-800 p-3.5 font-mono text-xs overflow-x-auto leading-relaxed">
                <pre className="m-0">
                  <code>{mapping.coreCode}</code>
                </pre>
              </div>
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

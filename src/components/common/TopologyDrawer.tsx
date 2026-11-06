import React from 'react';
import { DomainModule } from '../../types';
import { X, Layers, Cpu, FileCode, CheckCircle2 } from 'lucide-react';

interface TopologyDrawerProps {
  module: DomainModule | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TopologyDrawer: React.FC<TopologyDrawerProps> = ({
  module,
  isOpen,
  onClose
}) => {
  if (!isOpen || !module) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                  <Layers size={20} />
                </span>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">
                    {module.name}
                  </h3>
                  <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold font-mono">
                    {module.layer}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Responsibility / Description */}
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                核心职责与架构定位
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                {module.desc || module.responsibility || '高性能网络核心调度组件'}
              </p>
            </div>

            {/* Thread Model (if available) */}
            {module.threadModel && (
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu size={14} className="text-emerald-500" />
                  并发线程模型
                </div>
                <div className="bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 font-mono">
                  {module.threadModel}
                </div>
              </div>
            )}

            {/* Classes & Files */}
            <div className="space-y-3 text-xs font-mono">
              {module.classes && module.classes.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-sans font-bold text-slate-500 uppercase tracking-wider">
                    核心类定义 (Classes)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {module.classes.map((cls, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/40"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {module.functions && module.functions.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-sans font-bold text-slate-500 uppercase tracking-wider">
                    代表性接口 (Functions)
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                    {module.functions.map((fn, fIdx) => (
                      <li key={fIdx}>{fn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(module.sourceFiles || module.files) && (
                <div className="space-y-1.5">
                  <div className="font-sans font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCode size={13} className="text-slate-400" />
                    落地的源码文件
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(module.sourceFiles || module.files || []).map((file, fIdx) => (
                      <span
                        key={fIdx}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {file}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {module.keyConcepts && module.keyConcepts.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-sans font-bold text-slate-500 uppercase tracking-wider">
                    核心概念与机制
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {module.keyConcepts.map((kc, kIdx) => (
                      <span
                        key={kIdx}
                        className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60"
                      >
                        #{kc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer close */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
            >
              关闭架构详情
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

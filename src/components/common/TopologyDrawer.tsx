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
        <div className="w-screen max-w-md bg-white dark:bg-[#1a1f2c] rounded-l-3xl border-l border-white/80 dark:border-white/10 shadow-[-8px_0_32px_rgba(0,0,0,0.15),inset_2px_2px_4px_rgba(255,255,255,0.7)] dark:shadow-[-8px_0_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)] flex flex-col justify-between p-6 sm:p-7 overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900/60 dark:to-sky-800/40 text-sky-700 dark:text-sky-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  <Layers size={20} />
                </span>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">
                    {module.name}
                  </h3>
                  <div className="text-xs text-sky-600 dark:text-sky-400 font-bold font-mono">
                    {module.layer}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 shadow-[2px_2px_5px_rgba(0,0,0,0.05),inset_1px_1px_2px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Responsibility / Description */}
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                核心职责与架构定位
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/80 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.03)]">
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
                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 p-3.5 rounded-2xl border border-emerald-100/60 dark:border-emerald-900/40 font-mono shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  {module.threadModel}
                </div>
              </div>
            )}

            {/* Classes & Files */}
            <div className="space-y-3.5 text-xs font-mono">
              {module.classes && module.classes.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-sans font-bold text-slate-500 uppercase tracking-wider">
                    核心类定义 (Classes)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {module.classes.map((cls, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 shadow-[inset_1px_1px_2px_rgba(14,165,233,0.15)] font-bold"
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
                        className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]"
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
                        className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 shadow-[inset_1px_1px_2px_rgba(245,158,11,0.15)] font-bold"
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
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold text-xs shadow-[2px_2px_8px_rgba(0,0,0,0.2),inset_1px_1px_2px_rgba(255,255,255,0.3)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.15)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
            >
              关闭架构详情
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

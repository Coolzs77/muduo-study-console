import React, { useState } from 'react';
import { FileCode2, Copy, Check, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { SOURCE_ROADMAP } from '../data/sourceRoadmap';

interface SourceCodeViewProps {
  onShowToast: (msg: string) => void;
}

export const SourceCodeView: React.FC<SourceCodeViewProps> = ({ onShowToast }) => {
  const [selectedKey, setSelectedKey] = useState<string>('channel');
  const [copied, setCopied] = useState(false);

  const currentClass = SOURCE_ROADMAP[selectedKey] || SOURCE_ROADMAP['channel'];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentClass.codeSnippet);
    setCopied(true);
    onShowToast("代码已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 核心类目切换横栏 */}
      <div className="bg-white rounded-2xl border border-stone-200 p-2.5 shadow-xs overflow-x-auto">
        <div className="flex space-x-1.5 font-serifHeading text-xs sm:text-sm font-bold no-scrollbar">
          {Object.entries(SOURCE_ROADMAP).map(([key, item]: [string, any]) => (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedKey === key
                  ? 'bg-sky-950 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 核心剖析双栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：架构职责与关键变量 */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold text-sky-800 font-mono">
                {currentClass.file}
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                muduo 核心构件
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-stone-900 font-serifHeading">
                {currentClass.name}
              </h3>
              <p className="text-xs text-stone-600 font-serifMono mt-1 leading-relaxed">
                {currentClass.role}
              </p>
            </div>

            {/* 线程安全与并发戒律 */}
            <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 space-y-1 text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5 font-serifHeading">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>线程安全约束与并发戒律：</span>
              </span>
              <p className="text-amber-800 font-serifMono leading-relaxed">
                {currentClass.threadRule}
              </p>
            </div>

            {/* 核心方法与签名 */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-500 uppercase font-serifHeading flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-700" />
                <span>核心关键方法列表：</span>
              </h4>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {currentClass.methods.map((m: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-serifMono">
                    <span className="font-bold text-sky-900">{m.name}</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：规范代码剖析与高亮预览 */}
        <div className="lg:col-span-7">
          <div className="bg-stone-950 rounded-2xl border border-stone-800 p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-xs text-stone-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="ml-2 font-bold text-stone-300">{currentClass.name}.h / .cc 核心精粹</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? '已复制' : '复制代码'}</span>
              </button>
            </div>

            <pre className="text-sky-100 font-mono text-xs overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
              <code>{currentClass.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

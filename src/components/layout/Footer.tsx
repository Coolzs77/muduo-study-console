import React, { useState, useRef } from 'react';
import { Download, Upload, RotateCcw, FileText, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { showToast } from '../common/Toast';
import { DAYS_DATASET } from '../../data/daysDataset';

export const Footer: React.FC = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Export Markdown Archive
  const handleExportMarkdown = () => {
    try {
      const dayMastery = JSON.parse(localStorage.getItem('muduo_day_mastery') || '{}');
      const dayNotes = JSON.parse(localStorage.getItem('muduo_day_notes') || '{}');
      const quizScores = JSON.parse(localStorage.getItem('muduo_quiz_scores') || '{}');
      const completedAlgos = JSON.parse(localStorage.getItem('completedAlgos') || '[]');
      const customPitfalls = JSON.parse(localStorage.getItem('muduo_custom_pitfalls') || '[]');

      const now = new Date().toISOString().split('T')[0];
      let md = `# C++ 与 Muduo 后端工程全量学习与演进档案\n\n`;
      md += `> 归档导出时间：${now} | 生成自 C++ 后台与算法冲刺工作台\n\n`;
      md += `## 1. 学习指标与总体概况\n\n`;
      md += `- 算法题库完成数：${completedAlgos.length} 道\n`;
      md += `- 28天任务已标注天数：${Object.keys(dayMastery).length} / 28 天\n`;
      md += `- 自测通过天数：${Object.values(quizScores).filter((s: any) => s >= 75).length} 天\n\n`;

      md += `## 2. 28 天每日攻坚任务与个人手记\n\n`;
      DAYS_DATASET.forEach(d => {
        const mastery = dayMastery[d.day] || 0;
        const score = quizScores[d.day];
        const note = dayNotes[d.day];

        md += `### Day ${d.day}: ${d.title} (掌握度: ${mastery}/5 阶)\n\n`;
        md += `- **专著范围**：${d.bookRange}\n`;
        md += `- **Muduo 落地**：${d.muduoMap}\n`;
        if (score !== undefined) {
          md += `- **自测得分**：${score} 分\n`;
        }
        if (note && note.trim()) {
          md += `\n**攻坚手记与排障记录**：\n\n\`\`\`\n${note.trim()}\n\`\`\`\n`;
        }
        md += `\n---\n\n`;
      });

      if (customPitfalls.length > 0) {
        md += `## 3. 自定义 C++ 踩坑档案\n\n`;
        customPitfalls.forEach((p: any, idx: number) => {
          md += `### 踩坑 #${idx + 1}: ${p.title}\n\n`;
          md += `- **现象**: ${p.errorSymptom}\n`;
          md += `- **原因**: ${p.errorCause}\n`;
          md += `- **铁律**: ${p.conclusion}\n\n`;
        });
      }

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `muduo_study_archive_${now.replace(/-/g, '')}.md`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('学习档案 Markdown 已导出并下载', 'success');
    } catch (e: any) {
      showToast(`导出失败: ${e.message}`, 'warning');
    }
  };

  // 2. Export JSON Backup
  const handleExportJSON = () => {
    try {
      const state: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('muduo_') || key.startsWith('completed') || key.startsWith('knowledge'))) {
          try {
            state[key] = JSON.parse(localStorage.getItem(key) || 'null');
          } catch {
            state[key] = localStorage.getItem(key);
          }
        }
      }

      const jsonStr = JSON.stringify(state, null, 2);
      const now = new Date().toISOString().split('T')[0];
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `muduo_study_backup_${now.replace(/-/g, '')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('全量 JSON 备份已下载', 'success');
    } catch (e: any) {
      showToast(`导出失败: ${e.message}`, 'warning');
    }
  };

  // 3. File Input Change for JSON Import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      setImportJsonText(content);
      setIsImportModalOpen(true);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Apply Import
  const applyImport = (mode: 'merge' | 'overwrite') => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (typeof parsed !== 'object' || !parsed) {
        throw new Error('无效的 JSON 格式');
      }

      if (mode === 'overwrite') {
        // Clear existing muduo keys
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('muduo_') || k.startsWith('completed') || k.startsWith('knowledge'))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      }

      // Write keys
      Object.entries(parsed).forEach(([k, v]) => {
        if (mode === 'merge' && typeof v === 'object' && v !== null && !Array.isArray(v)) {
          const existing = JSON.parse(localStorage.getItem(k) || '{}');
          localStorage.setItem(k, JSON.stringify({ ...existing, ...v }));
        } else if (mode === 'merge' && Array.isArray(v)) {
          const existing = JSON.parse(localStorage.getItem(k) || '[]');
          const combined = Array.from(new Set([...existing, ...v]));
          localStorage.setItem(k, JSON.stringify(combined));
        } else {
          localStorage.setItem(k, JSON.stringify(v));
        }
      });

      setIsImportModalOpen(false);
      showToast(mode === 'overwrite' ? '已完全覆盖导入备份数据' : '已成功合并导入备份数据', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (e: any) {
      showToast(`导入失败: ${e.message}`, 'warning');
    }
  };

  // Reset System
  const handleResetSystem = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('muduo_') || k.startsWith('completed') || k.startsWith('knowledge'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    setIsResetConfirmOpen(false);
    showToast('学习系统已重置为初始状态', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            C++ 后台与算法冲刺工作台
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <span>数据仅保存在当前浏览器本地，无隐私泄漏风险</span>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition cursor-pointer active:scale-95"
            title="导出结构化 Markdown 归档复盘文档"
          >
            <FileText size={13} className="text-sky-600" />
            <span>导出学习档案.md</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition cursor-pointer active:scale-95"
            title="全量导出 JSON 备份"
          >
            <Download size={13} className="text-emerald-600" />
            <span>导出 JSON 备份</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition cursor-pointer active:scale-95"
            title="读取并恢复 JSON 备份"
          >
            <Upload size={13} className="text-amber-600" />
            <span>导入备份</span>
          </button>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
            title="重置系统"
          >
            <RotateCcw size={13} />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Upload size={16} className="text-sky-600" />
                选择数据恢复模式
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              检测到已读取的备份文件。你可以选择与当前已有的学习记录合并，或者完全覆盖现有进度：
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => applyImport('merge')}
                className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200 font-bold text-xs hover:bg-sky-100 transition cursor-pointer"
              >
                合并数据 (保留本地)
              </button>

              <button
                onClick={() => applyImport('overwrite')}
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 font-bold text-xs hover:bg-rose-100 transition cursor-pointer"
              >
                完全覆盖 (以文件为准)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  确定重置系统吗？
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  这将清空所有打卡记录、掌握星级与手记，此操作不可逆！
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleResetSystem}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

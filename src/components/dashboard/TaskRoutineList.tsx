import React, { useEffect } from 'react';
import { DailyTask, ActiveTab } from '../../types';
import { DEFAULT_ROUTINE_TASKS } from '../../data/tasksDataset';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Check, ArrowRight, ListTodo } from 'lucide-react';

interface TaskRoutineListProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const TaskRoutineList: React.FC<TaskRoutineListProps> = ({ onNavigateTab }) => {
  const [tasks, setTasks] = useLocalStorage<DailyTask[]>(
    'routine_tasks',
    DEFAULT_ROUTINE_TASKS
  );

  // Migrate legacy cached minutes in localStorage to updated 180m (3h)
  useEffect(() => {
    let needsUpdate = false;
    const updated = tasks.map((t) => {
      if (t.id === 'task_algo' && t.estimatedMinutes !== 180) {
        needsUpdate = true;
        return { ...t, estimatedMinutes: 180 };
      }
      if ((t.id === 'task_ai_inference' || t.id === 'task_project') && t.estimatedMinutes !== 180) {
        needsUpdate = true;
        return { ...t, estimatedMinutes: 180 };
      }
      return t;
    });
    if (needsUpdate) {
      setTasks(updated);
    }
  }, [tasks, setTasks]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const formatEstimatedTime = (mins: number) => {
    if (mins >= 60) {
      const hours = mins / 60;
      if (Number.isInteger(hours)) {
        return `${hours}h (${mins} 分钟)`;
      }
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h}h ${m}m (${mins} 分钟)`;
    }
    return `${mins} 分钟`;
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-sky-100/90 dark:bg-sky-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-sky-600 dark:text-sky-400">
            <ListTodo size={14} />
          </div>
          <span className="font-bold">今日清单</span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-600 dark:text-slate-400 font-normal">
          {completedCount} / {tasks.length}
        </div>
      </div>

      {/* Task List (Clay Pill Strips) */}
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-between gap-3 ${
              task.completed
                ? 'bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-emerald-50/80 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-emerald-950/30 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]'
                : 'bg-gradient-to-r from-white via-[#f8fafc] to-[#edf1f7] dark:from-slate-800/80 dark:via-slate-800/70 dark:to-slate-800/60 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => toggleTask(task.id)}
                type="button"
                className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-110 active:scale-y-85 cursor-pointer shrink-0 ${
                  task.completed
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[2px_2px_5px_rgba(16,185,129,0.3),inset_1px_1px_2px_rgba(255,255,255,0.8)]'
                    : 'bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-transparent hover:text-emerald-400/50'
                }`}
                title={task.completed ? '标记为未完成' : '标记为已完成'}
              >
                <Check size={13} strokeWidth={3} className={task.completed ? 'block' : 'opacity-0'} />
              </button>
              <div className="min-w-0">
                <div
                  className={`text-xs font-bold truncate transition-colors duration-200 ${
                    task.completed
                      ? 'text-teal-900/50 dark:text-teal-200/40 line-through'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {task.title}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {formatEstimatedTime(task.estimatedMinutes)}
                </div>
              </div>
            </div>

            {task.linkTab && (
              <button
                onClick={() => onNavigateTab(task.linkTab!)}
                type="button"
                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/60 dark:to-blue-950/60 text-sky-700 dark:text-sky-300 shadow-[2px_2px_4px_rgba(0,0,0,0.05),inset_1.5px_1.5px_2px_rgba(255,255,255,0.8)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.08)] active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center gap-1 text-[11px] font-bold cursor-pointer shrink-0"
              >
                <span>直达</span>
                <ArrowRight size={11} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

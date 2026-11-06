import React from 'react';
import { DailyTask, ActiveTab } from '../../types';
import { DEFAULT_ROUTINE_TASKS } from '../../data/tasksDataset';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CheckCircle2, Circle, ArrowRight, ListTodo } from 'lucide-react';

interface TaskRoutineListProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const TaskRoutineList: React.FC<TaskRoutineListProps> = ({ onNavigateTab }) => {
  const [tasks, setTasks] = useLocalStorage<DailyTask[]>(
    'routine_tasks',
    DEFAULT_ROUTINE_TASKS
  );

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-slate-900 dark:text-white">
          <ListTodo size={18} className="text-sky-600 dark:text-sky-400" />
          <span>今日任务清单</span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          已完成 {completedCount} / {tasks.length} 项
        </span>
      </div>

      <div className="space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition ${
              task.completed
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80'
            }`}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <button
                onClick={() => toggleTask(task.id)}
                className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer active:scale-90 shrink-0"
              >
                {task.completed ? (
                  <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                ) : (
                  <Circle size={18} />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4
                    className={`font-semibold text-sm ${
                      task.completed
                        ? 'text-slate-500 line-through'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    {task.estimatedMinutes} 分钟
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {task.priority} 级
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {task.focusPoint}
                </p>
              </div>
            </div>

            {task.linkTab && (
              <button
                onClick={() => onNavigateTab(task.linkTab!)}
                className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:underline shrink-0 font-medium cursor-pointer self-center"
              >
                <span>直达</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

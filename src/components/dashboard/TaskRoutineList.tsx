import React, { useEffect } from 'react';
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
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
        <div className="flex items-center gap-1.5">
          <ListTodo size={15} className="text-sky-600 dark:text-sky-400" />
          <span>今日清单</span>
        </div>
        <span className="font-mono text-slate-500 dark:text-slate-400 font-normal">
          {completedCount} / {tasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2.5 ${
              task.completed
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => toggleTask(task.id)}
                type="button"
                className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer shrink-0"
              >
                {task.completed ? (
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                ) : (
                  <Circle size={16} />
                )}
              </button>
              <div className="min-w-0">
                <div
                  className={`text-xs font-medium truncate ${
                    task.completed ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {task.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {formatEstimatedTime(task.estimatedMinutes)}
                </div>
              </div>
            </div>

            {task.linkTab && (
              <button
                onClick={() => onNavigateTab(task.linkTab!)}
                type="button"
                className="flex items-center gap-0.5 text-[11px] text-sky-600 dark:text-sky-400 hover:underline shrink-0 font-medium cursor-pointer"
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

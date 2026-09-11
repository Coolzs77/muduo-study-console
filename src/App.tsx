import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { TimerBar } from './components/TimerBar';
import { DashboardView } from './components/DashboardView';
import { DailyMasteryView } from './components/DailyMasteryView';
import { BookReadingView } from './components/BookReadingView';
import { KnowledgeMapView } from './components/KnowledgeMapView';
import { SourceCodeView } from './components/SourceCodeView';
import { PitfallsView } from './components/PitfallsView';
import { QuizCenterView } from './components/QuizCenterView';
import { EnvGuideModal } from './components/EnvGuideModal';
import { AppState, StudySession } from './types';
import { DAYS_DATASET } from './data/muduo28Days';

const STORAGE_KEY = 'muduo_study_state_v52';

const INITIAL_STATE: AppState = {
  currentView: 'dashboard',
  mastery: {},
  studySessions: [],
  activeTimer: {
    running: false,
    seconds: 0,
    selectedDay: 1,
    selectedType: 'coding',
  },
  globalNotes: '',
  bookProgress: {
    chenShuoCurrentPage: 1,
    primerPlusCurrentPage: 795,
    notesByChapter: {},
  },
};

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_STATE, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return INITIAL_STATE;
  });

  const [toast, setToast] = useState<{ message: string; visible: boolean; success: boolean }>({
    message: '',
    visible: false,
    success: true,
  });

  const [isEnvGuideOpen, setIsEnvGuideOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 状态持久化
  useEffect(() => {
    try {
      // 排除非序列化字段
      const toSave = { ...state, activeTimer: { ...state.activeTimer, running: false } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }, [state.mastery, state.studySessions, state.globalNotes, state.bookProgress, state.activeTimer.seconds]);

  // 计时器心跳调度
  useEffect(() => {
    let interval: any = null;
    if (state.activeTimer.running) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          activeTimer: {
            ...prev.activeTimer,
            seconds: prev.activeTimer.seconds + 1,
          }
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.activeTimer.running]);

  // 提示条弹窗
  const showToast = (message: string, success: boolean = true) => {
    setToast({ message, visible: true, success });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2800);
  };

  // 计时器操作
  const handleToggleTimer = () => {
    const willRun = !state.activeTimer.running;
    setState(prev => ({
      ...prev,
      activeTimer: {
        ...prev.activeTimer,
        running: willRun,
      }
    }));
    showToast(willRun ? "专注计时器已启动，保持工业级专注！" : "专注计时已暂停", willRun);
  };

  const handleResetTimer = () => {
    setState(prev => ({
      ...prev,
      activeTimer: {
        ...prev.activeTimer,
        running: false,
        seconds: 0,
      }
    }));
    showToast("计时器已清零重置", false);
  };

  const handleSaveSession = () => {
    const mins = Math.round(state.activeTimer.seconds / 60);
    if (mins < 1 && state.activeTimer.seconds > 10) {
      logSessionMinutes(1);
    } else if (mins >= 1) {
      logSessionMinutes(mins);
    } else {
      showToast("计时未满 10 秒，未记入统计", false);
      return;
    }

    setState(prev => ({
      ...prev,
      activeTimer: {
        ...prev.activeTimer,
        running: false,
        seconds: 0,
      }
    }));
  };

  const logSessionMinutes = (mins: number) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const todayDate = now.toISOString().slice(0, 10);

    const newSession: StudySession = {
      id: Date.now(),
      date: todayDate,
      time: timeStr,
      day: state.activeTimer.selectedDay,
      duration: mins,
      type: state.activeTimer.selectedType,
      note: `Day ${state.activeTimer.selectedDay} ${state.activeTimer.selectedType === 'reading' ? '书目研读' : '代码攻坚'}`,
    };

    setState(prev => ({
      ...prev,
      studySessions: [newSession, ...prev.studySessions],
    }));
    showToast(`成功归档 ${mins} 分钟专注会话！已记入今日大盘打卡`, true);
  };

  const handleQuickAdd = (mins: number) => {
    logSessionMinutes(mins);
  };

  const handleUpdateTimerConfig = (day: number, type: 'coding' | 'reading' | 'debug') => {
    setState(prev => ({
      ...prev,
      activeTimer: {
        ...prev.activeTimer,
        selectedDay: day,
        selectedType: type,
      }
    }));
  };

  // 掌握度修改
  const handleUpdateMastery = (day: number, level: number) => {
    setState(prev => ({
      ...prev,
      mastery: {
        ...prev.mastery,
        [day]: {
          level,
          lastReview: new Date().toISOString().slice(0, 10),
        }
      }
    }));
  };

  // 伴读笔记存盘
  const handleSaveReadingNote = (chapterKey: string, note: string) => {
    setState(prev => ({
      ...prev,
      bookProgress: {
        ...prev.bookProgress,
        notesByChapter: {
          ...prev.bookProgress.notesByChapter,
          [chapterKey]: note,
        }
      }
    }));
  };

  // 视图跳转
  const handleSwitchView = (view: AppState['currentView']) => {
    setState(prev => ({ ...prev, currentView: view }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToDay = (day: number) => {
    setState(prev => ({
      ...prev,
      currentView: 'daily',
      activeTimer: { ...prev.activeTimer, selectedDay: day }
    }));
    showToast(`已为你定位到 Day ${day} 攻坚大纲！`);
  };

  // 导入与导出
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `muduo_study_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast("学习进度与伴读笔记已成功导出！");
  };

  const handleImportData = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setState({ ...INITIAL_STATE, ...imported });
        showToast("学习数据已成功从备份中恢复！");
      } catch (err) {
        showToast("导入失败：JSON 文件格式不正确", false);
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm("确定将所有打卡与掌握度重置为初始状态吗？此操作无法撤销。")) {
      localStorage.removeItem(STORAGE_KEY);
      setState(INITIAL_STATE);
      showToast("系统已重置为初始纯净状态", false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* 顶部导航 */}
      <div>
        <Navbar
          currentView={state.currentView}
          onSwitchView={handleSwitchView}
          onOpenEnvGuide={() => setIsEnvGuideOpen(true)}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onResetData={handleResetData}
        />

        {/* 主体容器 */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {/* 全局专属常驻计时器 */}
          <TimerBar
            activeTimer={state.activeTimer}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onSaveSession={handleSaveSession}
            onQuickAdd={handleQuickAdd}
            onUpdateTimerConfig={handleUpdateTimerConfig}
          />

          {/* 7大核心视图动态渲染 */}
          {state.currentView === 'dashboard' && (
            <DashboardView appState={state} onSelectDay={handleJumpToDay} />
          )}

          {state.currentView === 'daily' && (
            <DailyMasteryView
              mastery={state.mastery}
              onUpdateMastery={handleUpdateMastery}
              onShowToast={showToast}
              onSwitchToReadingChapter={(day) => {
                setState(prev => ({
                  ...prev,
                  currentView: 'reading',
                  activeTimer: { ...prev.activeTimer, selectedDay: day, selectedType: 'reading' }
                }));
              }}
            />
          )}

          {state.currentView === 'reading' && (
            <BookReadingView
              onJumpToDay={handleJumpToDay}
              onShowToast={showToast}
              readingNotes={state.bookProgress.notesByChapter}
              onSaveReadingNote={handleSaveReadingNote}
            />
          )}

          {state.currentView === 'mapping' && (
            <KnowledgeMapView />
          )}

          {state.currentView === 'source' && (
            <SourceCodeView onShowToast={showToast} />
          )}

          {state.currentView === 'pitfalls' && (
            <PitfallsView onShowToast={showToast} />
          )}

          {state.currentView === 'quiz' && (
            <QuizCenterView
              mastery={state.mastery}
              onUpdateMastery={handleUpdateMastery}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* 全局轻提示 Toast */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`px-4 py-2.5 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2 border ${
            toast.success
              ? 'bg-stone-900 text-white border-stone-800'
              : 'bg-rose-900 text-white border-rose-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${toast.success ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* 环境排错模态框 */}
      <EnvGuideModal
        isOpen={isEnvGuideOpen}
        onClose={() => setIsEnvGuideOpen(false)}
        onShowToast={showToast}
      />

      {/* 页脚 */}
      <footer className="mt-12 py-6 border-t border-stone-200 bg-white text-center text-xs text-stone-500 font-serifMono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>muduo C++ 工业实战个人训练控制台 · V5.2 现代化工程重构版</span>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/Coolzs77/muduo-study-console" 
              target="_blank" 
              rel="noreferrer"
              className="text-sky-800 hover:underline font-bold"
            >
              GitHub: Coolzs77/muduo-study-console
            </a>
            <a 
              href="./classic.html" 
              className="text-stone-400 hover:text-stone-700 underline"
            >
              切换回经典单体版
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

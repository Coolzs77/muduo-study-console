import { useState, useEffect, useCallback } from 'react';
import { showToast } from '../components/common/Toast';

export interface FocusTimerState {
  isRunning: boolean;
  startTimestamp: number | null; // Date.now() when running
  accumulatedSeconds: number; // accumulated seconds from prior pauses
}

const STORAGE_KEY = 'muduo_focus_timer_state';
const TODAY_MINS_KEY = 'todayStudyMinutes';
const TIMER_EVENT_NAME = 'muduo_focus_timer_change';

function readTimerState(): FocusTimerState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        isRunning: Boolean(parsed.isRunning),
        startTimestamp: typeof parsed.startTimestamp === 'number' ? parsed.startTimestamp : null,
        accumulatedSeconds: typeof parsed.accumulatedSeconds === 'number' ? parsed.accumulatedSeconds : 0
      };
    }
  } catch (e) {
    console.warn('Failed to parse focus timer state from localStorage:', e);
  }
  return {
    isRunning: false,
    startTimestamp: null,
    accumulatedSeconds: 0
  };
}

function writeTimerState(state: FocusTimerState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(TIMER_EVENT_NAME));
  } catch (e) {
    console.warn('Failed to save focus timer state:', e);
  }
}

function readTodayMins(): number {
  try {
    const raw = window.localStorage.getItem(TODAY_MINS_KEY);
    if (raw) {
      const val = JSON.parse(raw);
      return typeof val === 'number' ? val : 0;
    }
  } catch (e) {}
  return 0;
}

function writeTodayMins(mins: number) {
  try {
    window.localStorage.setItem(TODAY_MINS_KEY, JSON.stringify(mins));
    window.dispatchEvent(new CustomEvent(TIMER_EVENT_NAME));
  } catch (e) {}
}

export function formatFocusTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safeSeconds / 3600);
  const mins = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Module-level synchronized clock and subscribers
const subscribers = new Set<() => void>();
let globalIntervalId: number | null = null;

function notifySubscribers() {
  subscribers.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.warn('Error in focus timer subscriber:', e);
    }
  });
}

function ensureClockRunning(isRunning: boolean) {
  if (isRunning) {
    if (globalIntervalId === null && typeof window !== 'undefined') {
      globalIntervalId = window.setInterval(() => {
        notifySubscribers();
      }, 1000);
    }
  } else {
    if (globalIntervalId !== null) {
      window.clearInterval(globalIntervalId);
      globalIntervalId = null;
    }
  }
}

export function useFocusTimer() {
  const [timerState, setTimerState] = useState<FocusTimerState>(readTimerState);
  const [todayMins, setTodayMins] = useState<number>(readTodayMins);
  const [, setTick] = useState<number>(0);

  // Sync state from storage
  const syncFromStorage = useCallback(() => {
    const nextState = readTimerState();
    const nextMins = readTodayMins();
    setTimerState(nextState);
    setTodayMins(nextMins);
    ensureClockRunning(nextState.isRunning);
    setTick((prev) => (prev + 1) % 1000000);
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === TODAY_MINS_KEY) {
        syncFromStorage();
      }
    };

    const handleCustomChange = () => {
      syncFromStorage();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncFromStorage();
      }
    };

    const onTick = () => {
      setTick((prev) => (prev + 1) % 1000000);
    };

    subscribers.add(onTick);
    window.addEventListener('storage', handleStorage);
    window.addEventListener(TIMER_EVENT_NAME, handleCustomChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial check for clock
    const initial = readTimerState();
    ensureClockRunning(initial.isRunning);

    return () => {
      subscribers.delete(onTick);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(TIMER_EVENT_NAME, handleCustomChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (subscribers.size === 0 && globalIntervalId !== null) {
        window.clearInterval(globalIntervalId);
        globalIntervalId = null;
      }
    };
  }, [syncFromStorage]);

  // Compute live elapsed seconds dynamically on every tick/render
  const currentSeconds = timerState.isRunning && timerState.startTimestamp
    ? timerState.accumulatedSeconds + Math.max(0, Math.floor((Date.now() - timerState.startTimestamp) / 1000))
    : timerState.accumulatedSeconds;

  const toggle = useCallback(() => {
    const currentState = readTimerState();
    const now = Date.now();

    if (currentState.isRunning) {
      // Pause: calculate accrued seconds
      const elapsed = currentState.startTimestamp
        ? Math.max(0, Math.floor((now - currentState.startTimestamp) / 1000))
        : 0;
      const nextState: FocusTimerState = {
        isRunning: false,
        startTimestamp: null,
        accumulatedSeconds: currentState.accumulatedSeconds + elapsed
      };
      writeTimerState(nextState);
      setTimerState(nextState);
      ensureClockRunning(false);
      showToast('专注计时已暂停', 'info');
    } else {
      // Resume / Start
      const nextState: FocusTimerState = {
        isRunning: true,
        startTimestamp: now,
        accumulatedSeconds: currentState.accumulatedSeconds
      };
      writeTimerState(nextState);
      setTimerState(nextState);
      ensureClockRunning(true);
      showToast('专注计时已开启', 'success');
    }
  }, []);

  const reset = useCallback(() => {
    const currentState = readTimerState();
    const now = Date.now();
    const elapsed =
      currentState.isRunning && currentState.startTimestamp
        ? Math.max(0, Math.floor((now - currentState.startTimestamp) / 1000))
        : 0;
    const totalAccrued = currentState.accumulatedSeconds + elapsed;

    const resetState: FocusTimerState = {
      isRunning: false,
      startTimestamp: null,
      accumulatedSeconds: 0
    };

    if (totalAccrued >= 60) {
      const addedMinutes = Math.floor(totalAccrued / 60);
      const curToday = readTodayMins();
      const newToday = curToday + addedMinutes;
      try {
        window.localStorage.setItem(TODAY_MINS_KEY, JSON.stringify(newToday));
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resetState));
        window.dispatchEvent(new CustomEvent(TIMER_EVENT_NAME));
      } catch (e) {}
      setTodayMins(newToday);
      setTimerState(resetState);
      ensureClockRunning(false);
      showToast(`本次专注结算: +${addedMinutes} 分钟，已记入今日学时`, 'success');
    } else {
      if (totalAccrued > 0) {
        showToast('本次专注不足 1 分钟，已重置', 'info');
      }
      writeTimerState(resetState);
      setTimerState(resetState);
      ensureClockRunning(false);
    }
  }, []);

  return {
    isRunning: timerState.isRunning,
    seconds: currentSeconds,
    formattedTime: formatFocusTime(currentSeconds),
    todayMins,
    toggle,
    reset
  };
}

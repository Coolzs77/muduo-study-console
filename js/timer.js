// ==========================================================================
// muduo C++ 学习控制台 - 专注计时器模块
// 时间戳差值计时与状态管理
// ==========================================================================

let _timerIntervalHandle = null;
let _timerStartTimestamp = 0;
let _currentLinkedTask = null;

function getCurrentLinkedTask() {
    return _currentLinkedTask;
}

/**
 * 计时器初始化自愈（杜绝 localStorage 脏数据导致已处于 running 假象）
 */
function initStudyTimer() {
    if (!window.appState) window.appState = {};
    if (!window.appState.activeTimer || typeof window.appState.activeTimer !== 'object') {
        window.appState.activeTimer = {
            running: false,
            timerId: null,
            seconds: 0,
            day: 1,
            type: 'coding'
        };
    }
    // 强制清理运行态残留句柄
    window.appState.activeTimer.running = false;
    window.appState.activeTimer.timerId = null;
    if (_timerIntervalHandle) {
        clearInterval(_timerIntervalHandle);
        _timerIntervalHandle = null;
    }
    updateTimerDisplay();
}

/**
 * 启动 / 暂停专注计时
 */
function toggleStudyTimer() {
    if (!window.appState || !window.appState.activeTimer) initStudyTimer();

    const btn = document.getElementById('btn-timer-toggle');
    const icon = document.getElementById('btn-timer-icon');
    const text = document.getElementById('btn-timer-text');
    const timer = window.appState.activeTimer;

    if (!timer.running) {
        // 启动走字
        timer.running = true;
        _timerStartTimestamp = Date.now() - (timer.seconds * 1000);

        if (btn) btn.className = "px-3 py-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer";
        if (icon) icon.className = "fa-solid fa-pause";
        if (text) text.innerText = "暂停专注";

        if (_timerIntervalHandle) clearInterval(_timerIntervalHandle);
        _timerIntervalHandle = setInterval(() => {
            // 使用时间戳差值计算，消除系统休眠或标签页后台时的秒数漂移
            timer.seconds = Math.floor((Date.now() - _timerStartTimestamp) / 1000);
            updateTimerDisplay();
        }, 1000);

        if (typeof showToast === 'function') showToast("专注计时已启动");
    } else {
        // 暂停计时
        timer.running = false;
        if (_timerIntervalHandle) {
            clearInterval(_timerIntervalHandle);
            _timerIntervalHandle = null;
        }

        if (btn) btn.className = "px-3 py-1 rounded-lg bg-sky-800 hover:bg-sky-900 text-white font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer";
        if (icon) icon.className = "fa-solid fa-play";
        if (text) text.innerText = "继续专注";

        if (typeof showToast === 'function') showToast("专注计时已暂停", false);
    }
}

/**
 * 重置专注计时器
 */
function resetStudyTimer() {
    if (!window.appState || !window.appState.activeTimer) initStudyTimer();

    const timer = window.appState.activeTimer;
    timer.running = false;
    timer.seconds = 0;
    _timerStartTimestamp = 0;

    if (_timerIntervalHandle) {
        clearInterval(_timerIntervalHandle);
        _timerIntervalHandle = null;
    }

    updateTimerDisplay();

    const btn = document.getElementById('btn-timer-toggle');
    const icon = document.getElementById('btn-timer-icon');
    const text = document.getElementById('btn-timer-text');
    if (btn) btn.className = "px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer";
    if (icon) icon.className = "fa-solid fa-play";
    if (text) text.innerText = "开始专注";

    if (typeof showToast === 'function') showToast("专注计时已重置", false);
}

/**
 * 实时刷新界面时间显示
 */
function updateTimerDisplay() {
    const timer = window.appState?.activeTimer || { seconds: 0 };
    const totalSecs = timer.seconds || 0;
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    let timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (hours > 0) {
        timeStr = `${String(hours).padStart(2, '0')}:${timeStr}`;
    }

    const el = document.getElementById('timer-display');
    if (el) el.innerText = timeStr;
}

/**
 * 归档当前会话到学习大盘
 */
function saveActiveSession() {
    const timer = window.appState?.activeTimer;
    if (!timer) return;

    const mins = Math.round(timer.seconds / 60);
    if (mins < 1 && timer.seconds >= 10) {
        // 不足 1 分钟但多于 10 秒按 1 分钟记
        logStudyMinutes(1);
    } else if (mins >= 1) {
        logStudyMinutes(mins);
    } else {
        if (typeof showToast === 'function') showToast("计时不足 10 秒，未记入会话", false);
        return;
    }

    // 播放归档完成轻音效
    playChimeSound();

    // 归档后自动清零
    resetStudyTimer();
}

/**
 * 快捷记时 (+15m, +30m, +45m)
 */
function quickAddMinutes(mins) {
    logStudyMinutes(mins);
    playChimeSound();
    if (typeof showToast === 'function') showToast(`成功记入 ${mins} 分钟专注会话！`);
}

/**
 * 一键将特定日常任务带入专注计时器
 */
function startTimerForTask(taskId, taskTitle, category = 'coding', targetMinutes = 30) {
    if (typeof window !== 'undefined' && (!window.appState || !window.appState.activeTimer)) {
        initStudyTimer();
    }

    _currentLinkedTask = { id: taskId, title: taskTitle, category: category };

    const typeMapping = {
        project: 'coding',
        algorithm: 'algorithm',
        book: 'reading',
        reading: 'reading',
        quiz: 'quiz',
        career: 'career',
        debug: 'debug'
    };
    const mappedType = typeMapping[category] || category;

    // 同步 timer-type 下拉框
    if (typeof document !== 'undefined') {
        const typeSelect = document.getElementById('timer-type');
        if (typeSelect) {
            let optExists = Array.from(typeSelect.options || []).some(o => o.value === mappedType);
            if (!optExists) {
                const opt = document.createElement('option');
                opt.value = mappedType;
                const labels = {
                    coding: '代码攻坚',
                    algorithm: '手撕算法',
                    reading: '书目研读',
                    quiz: '考点自测',
                    career: '求职调研'
                };
                opt.text = labels[mappedType] || mappedType;
                typeSelect.appendChild(opt);
            }
            typeSelect.value = mappedType;
        }

        // 平滑滚动至页面顶部的专注计时器
        if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const timer = (typeof window !== 'undefined' ? window.appState?.activeTimer : null) || (typeof globalThis !== 'undefined' ? globalThis.appState?.activeTimer : null);
    if (timer && !timer.running) {
        toggleStudyTimer();
    }

    if (typeof showToast === 'function') {
        showToast(`已将任务「${taskTitle}」带入专注计时`);
    }
}

/**
 * 核心入库与大盘指标刷新
 */
function logStudyMinutes(mins) {
    const stateObj = (typeof window !== 'undefined' ? window.appState : null) || (typeof globalThis !== 'undefined' ? globalThis.appState : null);
    if (!stateObj) return;
    if (!Array.isArray(stateObj.studySessions)) {
        stateObj.studySessions = [];
    }

    const type = (typeof document !== 'undefined' && document.getElementById('timer-type')?.value) || 'coding';
    const day = parseInt((typeof document !== 'undefined' && document.getElementById('timer-day')?.value) || '1');
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const typeNames = {
        coding: '代码攻坚',
        algorithm: '手撕算法',
        reading: '书目研读',
        quiz: '考点自测',
        career: '求职调研',
        debug: '排错调试'
    };

    let sessionNote = `任务 Day ${day} (${typeNames[type] || type})`;
    if (_currentLinkedTask) {
        sessionNote = `${_currentLinkedTask.title} (${typeNames[type] || type})`;
    }

    stateObj.studySessions.push({
        id: Date.now(),
        date: typeof getTodayDateStr === 'function' ? getTodayDateStr() : now.toISOString().slice(0, 10),
        time: timeStr,
        day: day,
        duration: mins,
        type: type,
        note: sessionNote
    });

    if (typeof persistState === 'function') persistState();
    if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
    if (typeof showToast === 'function') showToast(`专注会话已归档：+${mins} 分钟！`);
}

/**
 * Web Audio API 柔和完成提示音
 */
function playChimeSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
        // 忽略音频限制
    }
}

if (typeof window !== 'undefined') {
    window.getCurrentLinkedTask = getCurrentLinkedTask;
}
if (typeof globalThis !== 'undefined') {
    globalThis.getCurrentLinkedTask = getCurrentLinkedTask;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initStudyTimer,
        toggleStudyTimer,
        resetStudyTimer,
        updateTimerDisplay,
        saveActiveSession,
        quickAddMinutes,
        startTimerForTask,
        getCurrentLinkedTask,
        logStudyMinutes
    };
}


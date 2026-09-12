
// ==================== 安全数据集读取防弹函数 (防异步加载竞态/网络丢包) ====================
function getDaysDataset() {
    if (typeof DAYS_DATASET !== 'undefined' && Array.isArray(DAYS_DATASET)) return DAYS_DATASET;
    if (typeof window !== 'undefined' && window.DAYS_DATASET && Array.isArray(window.DAYS_DATASET)) return window.DAYS_DATASET;
    return [];
}

function getMappingMatrix() {
    if (typeof MAPPING_MATRIX !== 'undefined' && Array.isArray(MAPPING_MATRIX)) return MAPPING_MATRIX;
    if (typeof window !== 'undefined' && window.MAPPING_MATRIX && Array.isArray(window.MAPPING_MATRIX)) return window.MAPPING_MATRIX;
    return [];
}

function getSourceRoadmap() {
    if (typeof SOURCE_ROADMAP !== 'undefined' && Array.isArray(SOURCE_ROADMAP)) return SOURCE_ROADMAP;
    if (typeof window !== 'undefined' && window.SOURCE_ROADMAP && Array.isArray(window.SOURCE_ROADMAP)) return window.SOURCE_ROADMAP;
    return [];
}

function getPitfallsDataset() {
    if (typeof PITFALLS_DATASET !== 'undefined' && Array.isArray(PITFALLS_DATASET)) return PITFALLS_DATASET;
    if (typeof window !== 'undefined' && window.PITFALLS_DATASET && Array.isArray(window.PITFALLS_DATASET)) return window.PITFALLS_DATASET;
    return [];
}

function getDomainModulesDataset() {
    if (typeof DOMAIN_MODULES !== 'undefined' && Array.isArray(DOMAIN_MODULES)) return DOMAIN_MODULES;
    if (typeof window !== 'undefined' && window.DOMAIN_MODULES && Array.isArray(window.DOMAIN_MODULES)) return window.DOMAIN_MODULES;
    return [];
}

function getDomainKnowledgeDataset() {
    if (typeof DOMAIN_KNOWLEDGE_NODES !== 'undefined' && Array.isArray(DOMAIN_KNOWLEDGE_NODES)) return DOMAIN_KNOWLEDGE_NODES;
    if (typeof window !== 'undefined' && window.DOMAIN_KNOWLEDGE_NODES && Array.isArray(window.DOMAIN_KNOWLEDGE_NODES)) return window.DOMAIN_KNOWLEDGE_NODES;
    return [];
}

function getDomainPitfallsDataset() {
    if (typeof DOMAIN_PITFALLS_CATALOG !== 'undefined' && Array.isArray(DOMAIN_PITFALLS_CATALOG)) return DOMAIN_PITFALLS_CATALOG;
    if (typeof window !== 'undefined' && window.DOMAIN_PITFALLS_CATALOG && Array.isArray(window.DOMAIN_PITFALLS_CATALOG)) return window.DOMAIN_PITFALLS_CATALOG;
    return [];
}

function getYuqueDataset() {
    if (typeof YUQUE_DATASET !== 'undefined' && Array.isArray(YUQUE_DATASET)) return YUQUE_DATASET;
    if (typeof window !== 'undefined' && window.YUQUE_DATASET && Array.isArray(window.YUQUE_DATASET)) return window.YUQUE_DATASET;
    if (typeof YUQUE_ARTICLES_DATASET !== 'undefined' && Array.isArray(YUQUE_ARTICLES_DATASET)) return YUQUE_ARTICLES_DATASET;
    if (typeof window !== 'undefined' && window.YUQUE_ARTICLES_DATASET && Array.isArray(window.YUQUE_ARTICLES_DATASET)) return window.YUQUE_ARTICLES_DATASET;
    return [];
}

var appState = {
    // 全局根状态对象 (V6.0.0 双核架构规范)
    version: "6.0.0",
    workspaceMode: "full", // 'full' | 'muduo' | 'cppai'
    completedDays: [],
    mastery: {},         // { [day]: { level: 0..5, read: false, quizPassed: false, demo: false, independentImpl: false, sourceUnderstood: false, completedAt: null, score: 0, quizScores: null } }
    reviews: {},         // { [day]: { stage: 0..5, nextReviewDate: '', lastReviewDate: '', intervalDays: 1, reviewCount: 0, history: [] } }
    sourceStatus: {},    // { [nodeId]: { status: '未读'|'研读中'|'已精读', notes: '' } }
    pitfalls: [],
    studySessions: [],   // [ { id, date, time, day, duration, type, note } ]
    dayNotes: {},
    experimentNotes: {},
    globalNotes: "",
    quizRecords: [],
    knowledgeMastery: {},
    knowledgeFavorites: [],
    knowledgeRecent: [],
    projectsProgress: {
        proj_muduo: { activeDay: 1, currentTrack: "l0_foundation", totalDays: 28 },
        proj_cppai: { activeArticle: "01_http_overview", currentTrack: "l3_protocol", totalArticles: 17 }
    },
    dailyRoutine: null,
    currentView: 'dashboard',
    weekFilter: 0,
    filterStatus: 'all', // 'all', 'pending', 'mastered', 'due_review'
    searchQuery: "",
    activeTimer: {
        running: false,
        timerId: null,
        seconds: 0,
        day: 1,
        type: 'coding'
    }
};
window.appState = appState;


// 工具函数：日期
function getTodayDateStr() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getFutureDateStr(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 防抖工具
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 转义 HTML
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Toast 通知
function showToast(text, isSuccess = true) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-msg');
    const iconEl = document.getElementById('toast-icon');
    if (!toast || !msgEl || !iconEl) return;

    msgEl.innerText = text;
    iconEl.innerHTML = isSuccess ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-circle-info"></i>';
    iconEl.className = isSuccess ? 'text-emerald-400 font-bold' : 'text-sky-400 font-bold';

    toast.classList.remove('-translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('-translate-y-24', 'opacity-0');
    }, 2400);
}

// 持久化存储与版本兼容 (接入 StateManager V6 集中架构)
function loadAndMigrateState() {
    try {
        if (typeof StateManager !== 'undefined') {
            appState = StateManager.init(appState);
            window.appState = appState;
            return;
        }

        const v5Saved = localStorage.getItem('muduo_v5_data');
        if (v5Saved) {
            const parsed = JSON.parse(v5Saved);
            if (parsed && typeof parsed === 'object') {
                appState = Object.assign(appState, parsed);
                if (!appState.activeTimer) {
                    appState.activeTimer = { running: false, timerId: null, seconds: 0, day: 1, type: 'coding' };
                } else {
                    appState.activeTimer.running = false;
                    appState.activeTimer.timerId = null;
                }
                window.appState = appState;
                if (!appState.mastery) appState.mastery = {};
                if (!appState.reviews) appState.reviews = {};
                if (!appState.sourceStatus) appState.sourceStatus = {};
                if (!appState.pitfalls || appState.pitfalls.length === 0) appState.pitfalls = [...getPitfallsDataset()];
                if (!appState.studySessions) appState.studySessions = [];
                if (!appState.dayNotes) appState.dayNotes = {};
                if (!appState.experimentNotes) appState.experimentNotes = {};
                if (!appState.completedDays) appState.completedDays = [];
                return;
            }
        }

        // 迁移旧版 v4 数据
        const legacyCompleted = localStorage.getItem('muduo_academic_completed');
        const legacyDayNotes = localStorage.getItem('muduo_academic_daynotes');
        const legacyGlobalNotes = localStorage.getItem('muduo_academic_globalnotes');

        if (legacyCompleted) {
            try {
                const list = JSON.parse(legacyCompleted);
                if (Array.isArray(list)) {
                    appState.completedDays = [...new Set(list)];
                    list.forEach(day => {
                        appState.mastery[day] = {
                            level: 3,
                            read: true,
                            quizPassed: true,
                            demo: true,
                            independentImpl: false,
                            sourceUnderstood: false,
                            completedAt: new Date().toISOString(),
                            score: 80,
                            quizScores: { knowledge: 80, code: 80, muduo: 80, overall: 80 }
                        };
                        appState.reviews[day] = {
                            stage: 1,
                            nextReviewDate: getFutureDateStr(1),
                            lastReviewDate: getTodayDateStr(),
                            intervalDays: 1,
                            reviewCount: 1,
                            history: []
                        };
                    });
                }
            } catch(e) {}
        }

        if (legacyDayNotes) {
            try { appState.dayNotes = JSON.parse(legacyDayNotes) || {}; } catch(e) {}
        }
        if (legacyGlobalNotes) {
            appState.globalNotes = legacyGlobalNotes;
        }

        appState.pitfalls = [...getPitfallsDataset()];
        persistState();
    } catch(e) {
        console.warn("Storage restricted or parse error:", e);
        if (!appState.pitfalls || appState.pitfalls.length === 0) {
            appState.pitfalls = [...getPitfallsDataset()];
        }
    }
}

function persistState() {
    try {
        if (typeof StateManager !== 'undefined') {
            StateManager.update(appState, { save: true, immediate: false });
            return;
        }

        localStorage.setItem('muduo_v5_data', JSON.stringify({
            version: appState.version,
            completedDays: appState.completedDays,
            mastery: appState.mastery,
            reviews: appState.reviews,
            sourceStatus: appState.sourceStatus,
            pitfalls: appState.pitfalls,
            studySessions: appState.studySessions,
            dayNotes: appState.dayNotes,
            experimentNotes: appState.experimentNotes,
            globalNotes: appState.globalNotes
        }));

        // 同步旧键保证绝对兼容
        localStorage.setItem('muduo_academic_completed', JSON.stringify(appState.completedDays));
        localStorage.setItem('muduo_academic_daynotes', JSON.stringify(appState.dayNotes));
        localStorage.setItem('muduo_academic_globalnotes', appState.globalNotes);
    } catch(e) {
        console.warn("Local storage write failed:", e);
    }
}

// 真实连续学习天数计算 (Streak Calculation)
function calculateRealStreak() {
    const activeDates = new Set();
    
    // 收集所有学习日期
    if (Array.isArray(appState.studySessions)) {
        appState.studySessions.forEach(s => {
            if (s.date) activeDates.add(s.date);
        });
    }

    Object.values(appState.mastery).forEach(m => {
        if (m.completedAt) {
            activeDates.add(m.completedAt.slice(0, 10));
        }
    });

    Object.values(appState.reviews).forEach(r => {
        if (r.lastReviewDate) activeDates.add(r.lastReviewDate);
        if (Array.isArray(r.history)) {
            r.history.forEach(h => { if (h.date) activeDates.add(h.date); });
        }
    });

    if (activeDates.size === 0) return 0;

    const sortedDates = Array.from(activeDates).sort().reverse();
    const today = getTodayDateStr();
    const yesterday = getFutureDateStr(-1);

    // 如果今天和昨天都没有活动，streak 断裂归 0
    if (!sortedDates.includes(today) && !sortedDates.includes(yesterday)) {
        return 0;
    }

    let streak = 0;
    let checkDate = new Date();
    if (!sortedDates.includes(today)) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
        const y = checkDate.getFullYear();
        const m = String(checkDate.getMonth() + 1).padStart(2, '0');
        const d = String(checkDate.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;

        if (activeDates.has(dateStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

// 视图切换
function switchView(viewName) {
    appState.currentView = viewName;
    const views = ['dashboard', 'tasks', 'knowledge', 'daily', 'mapping', 'quiz', 'source', 'pitfalls'];
    views.forEach(v => {
        const sec = document.getElementById(`view-${v}`);
        const btn = document.getElementById(`nav-${v}`);
        if (!sec || !btn) return;

        if (v === viewName) {
            sec.classList.remove('hidden');
            btn.className = "px-4 py-2 rounded-xl flex items-center gap-2 font-bold bg-white text-stone-900 border border-stone-300 shadow-sm transition whitespace-nowrap";
            btn.setAttribute('aria-selected', 'true');
        } else {
            sec.classList.add('hidden');
            btn.className = "px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition whitespace-nowrap";
            btn.setAttribute('aria-selected', 'false');
        }
    });

    if (viewName === 'tasks') {
        renderTaskHub();
    } else if (viewName === 'daily') {
        renderDailyCards();
    } else if (viewName === 'knowledge') {
        if (typeof renderYuqueExplorer === 'function') renderYuqueExplorer();
    } else if (viewName === 'mapping') {
        renderMappingTable();
    } else if (viewName === 'quiz') {
        const sel = document.getElementById('quiz-day-selector');
        const d = sel ? parseInt(sel.value) || 1 : 1;
        loadQuizForDay(d);
    } else if (viewName === 'source') {
        renderSourceRoadmap();
    } else if (viewName === 'pitfalls') {
        renderPitfallsList();
    }
}

// ==================== 双核工作台与拓扑控制导航 (Dual-Core Workspace & Topology) ====================

// 1. 双核工作台模式切换 ('full' | 'muduo' | 'cppai')
function setWorkspaceMode(mode) {
    appState.workspaceMode = mode;
    const btnFull = document.getElementById('ws-btn-full');
    const btnMuduo = document.getElementById('ws-btn-muduo');
    const btnCppai = document.getElementById('ws-btn-cppai');

    if (btnFull) {
        btnFull.className = mode === 'full'
            ? 'px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 bg-stone-900 text-white border-stone-900 shadow-xs cursor-pointer'
            : 'px-3 py-1.5 rounded-xl border font-semibold transition flex items-center gap-1.5 bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200 cursor-pointer';
    }
    if (btnMuduo) {
        btnMuduo.className = mode === 'muduo'
            ? 'px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 bg-sky-800 text-white border-sky-800 shadow-xs cursor-pointer'
            : 'px-3 py-1.5 rounded-xl border font-semibold transition flex items-center gap-1.5 bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100 cursor-pointer';
    }
    if (btnCppai) {
        btnCppai.className = mode === 'cppai'
            ? 'px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 bg-amber-700 text-white border-amber-700 shadow-xs cursor-pointer'
            : 'px-3 py-1.5 rounded-xl border font-semibold transition flex items-center gap-1.5 bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100 cursor-pointer';
    }

    if (mode === 'muduo') {
        switchTopologyTab('muduo');
    } else if (mode === 'cppai') {
        switchTopologyTab('cppai');
    } else {
        switchTopologyTab('endtoend');
    }

    // 联动刷新今日任务推荐
    const today = getTodayDateStr();
    let dueCount = 0;
    const total = (DAYS_DATASET || []).length || 28;
    for (let d = 1; d <= total; d++) {
        const r = appState.reviews[d];
        if (r && r.nextReviewDate && r.nextReviewDate <= today) dueCount++;
    }
    renderTodayMissionCard(dueCount);

    if (typeof persistState === 'function') {
        persistState();
    }
}

// 2. 拓扑画板多视图切换 ('endtoend' | 'muduo' | 'cppai')
function switchTopologyTab(tabName) {
    const tabs = ['endtoend', 'muduo', 'cppai'];
    tabs.forEach(t => {
        const svgEl = document.getElementById(`topo-svg-${t}`);
        const btnEl = document.getElementById(`tab-topo-${t}`);
        if (t === tabName) {
            if (svgEl) svgEl.classList.remove('hidden');
            if (btnEl) {
                btnEl.className = 'px-3 py-1.5 rounded-lg font-bold bg-white text-stone-900 shadow-xs transition cursor-pointer';
            }
        } else {
            if (svgEl) svgEl.classList.add('hidden');
            if (btnEl) {
                btnEl.className = 'px-3 py-1.5 rounded-lg font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition cursor-pointer';
            }
        }
    });
}

// 3. 平滑滚动直达架构拓扑画板
function scrollToTopology() {
    if (appState.currentView !== 'dashboard') {
        switchView('dashboard');
    }
    setTimeout(() => {
        const card = document.getElementById('topology-card');
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            card.classList.add('ring-4', 'ring-amber-500/30');
            setTimeout(() => card.classList.remove('ring-4', 'ring-amber-500/30'), 1500);
        }
    }, 80);
}

// 4. 直达 CppAIService 语雀深度专栏文章
function openYuqueArticle(slugOrId) {
    switchView('knowledge');
    setTimeout(() => {
        if (typeof selectYuqueArticle === 'function') {
            selectYuqueArticle(slugOrId);
        } else if (typeof window.selectYuqueArticle === 'function') {
            window.selectYuqueArticle(slugOrId);
        }
    }, 120);
}

// 5. 顶部 Dashboard 指标计算与更新 (双核全面指标)
function updateDashboardMetrics() {
    const total = DAYS_DATASET.length || 28;
    
    // 学习进度：至少达到 level 1
    let progressCount = 0;
    let totalMasteryLevels = 0;
    let demoCount = 0;

    for (let d = 1; d <= total; d++) {
        const m = appState.mastery[d];
        if (m) {
            if (m.level >= 1) progressCount++;
            totalMasteryLevels += (m.level || 0);
            if (m.demo) demoCount++;
        }
    }

    const progressPercent = Math.round((progressCount / total) * 100);
    const masteryPercent = Math.round((totalMasteryLevels / (total * 5)) * 100);

    // CppAIService 专栏掌握统计 (mastered articles count where lvl >= 3)
    const yqMastery = appState.knowledgeMastery || {};
    const cppaiMasteryCount = Object.values(yqMastery).filter(lvl => (typeof lvl === 'number' ? lvl : lvl.level || 0) >= 3).length;

    // 源码研读完成数
    const sourceReadCount = Object.values(appState.sourceStatus).filter(s => s && (s.status === '已精读' || s.status === '研读中')).length;

    // 今日学习时间
    const today = getTodayDateStr();
    let todayMinutes = 0;
    let totalMinutes = 0;
    let weekMinutes = 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    appState.studySessions.forEach(s => {
        const dur = s.duration || 0;
        totalMinutes += dur;
        if (s.date === today) todayMinutes += dur;
        const sDate = new Date(s.date);
        if (sDate >= oneWeekAgo) weekMinutes += dur;
    });

    // 今日待复习项
    let dueReviewCount = 0;
    for (let d = 1; d <= total; d++) {
        const r = appState.reviews[d];
        if (r && r.nextReviewDate && r.nextReviewDate <= today) {
            dueReviewCount++;
        }
    }

    const streakDays = calculateRealStreak();

    // 更新 DOM 核心指标
    const elProgVal = document.getElementById('stat-progress-val');
    if (elProgVal) elProgVal.innerText = `${progressPercent}%`;

    const elProgCount = document.getElementById('stat-progress-count');
    if (elProgCount) elProgCount.innerText = `${progressCount} / ${total} 天任务`;

    const elMasteryVal = document.getElementById('stat-mastery-val');
    if (elMasteryVal) elMasteryVal.innerText = `${cppaiMasteryCount} / 17`;

    const elMasterySub = document.getElementById('stat-mastery-sub');
    if (elMasterySub) elMasterySub.innerText = `${cppaiMasteryCount} 篇已掌握(≥L3)`;

    const elDemoVal = document.getElementById('stat-demo-val');
    if (elDemoVal) elDemoVal.innerText = `${demoCount} / ${total}`;

    const totalModules = (getDomainModulesDataset && getDomainModulesDataset().length) || (typeof DOMAIN_MODULES !== 'undefined' ? DOMAIN_MODULES.length : 23);
    const elSourceVal = document.getElementById('stat-source-val');
    if (elSourceVal) elSourceVal.innerText = sourceReadCount > 0 ? `${sourceReadCount} / ${totalModules} 研读` : `${totalModules} 模块`;

    const elTodayTime = document.getElementById('stat-today-time');
    if (elTodayTime) elTodayTime.innerText = `${todayMinutes} min`;

    const elReviewsVal = document.getElementById('stat-reviews-val');
    if (elReviewsVal) elReviewsVal.innerText = `${dueReviewCount} 项`;

    const elStreak = document.getElementById('stat-streak');
    if (elStreak) elStreak.innerText = `${streakDays} 天`;

    // 进度条
    const elProgFill = document.getElementById('progress-fill');
    if (elProgFill) elProgFill.style.width = `${progressPercent}%`;

    const remaining = total - progressCount;
    const elProgText = document.getElementById('progress-bar-text');
    if (elProgText) {
        elProgText.innerText = remaining === 0 
            ? "已完成全部 28 天任务，可完整阅读 muduo 核心源码与 CppAIService 实现。" 
            : `还剩 ${remaining} 天任务完成学习计划`;
    }

    // 学习时间卡片 (兼容检查)
    const elCardToday = document.getElementById('stat-card-today');
    if (elCardToday) elCardToday.innerText = `${todayMinutes}m`;

    const elCardWeek = document.getElementById('stat-card-week');
    if (elCardWeek) elCardWeek.innerText = `${Math.round(weekMinutes / 60 * 10) / 10}h`;

    const elTotalHours = document.getElementById('stat-total-hours');
    if (elTotalHours) elTotalHours.innerText = (Math.round(totalMinutes / 60 * 10) / 10).toFixed(1);

    const elCardSessions = document.getElementById('stat-card-sessions');
    if (elCardSessions) elCardSessions.innerText = `${appState.studySessions.length}次`;

    const avgMins = appState.studySessions.length > 0 ? Math.round(totalMinutes / Math.max(1, new Set(appState.studySessions.map(s => s.date)).size)) : 0;
    const elCardAvg = document.getElementById('stat-card-avg');
    if (elCardAvg) elCardAvg.innerText = `${avgMins}m`;

    // 渲染子模块
    // 更新今日任务导航待办角标
    const elBadgeTasks = document.getElementById('badge-nav-tasks');
    if (elBadgeTasks && appState.dailyRoutine && Array.isArray(appState.dailyRoutine.tasks)) {
        let prog = null;
        if (typeof TaskDomain !== 'undefined' && typeof TaskDomain.calculateRoutineProgress === 'function') {
            prog = TaskDomain.calculateRoutineProgress(appState.dailyRoutine.tasks, appState.dailyRoutine.mode);
        }
        const pendingCount = prog ? (prog.activeTotal - prog.completed) : 0;
        if (pendingCount > 0) {
            elBadgeTasks.innerText = pendingCount;
            elBadgeTasks.classList.remove('hidden');
        } else {
            elBadgeTasks.classList.add('hidden');
        }
    }

    renderTodayMissionCard(dueReviewCount);
    renderCalendarGrid();
    renderStudyChart();
    renderDueReviewList();
}

// 6. 双核今日任务推荐卡渲染 (Today's Mission Card: Dual-Track Recommendations)
function renderTodayMissionCard(dueCount) {
    const container = document.getElementById('today-mission-card');
    if (!container) return;

    const today = getTodayDateStr();
    const mode = appState.workspaceMode || 'full';

    // 检查是否有由于复习到期的高优先级任务
    let dueDay = null;
    for (let d = 1; d <= 28; d++) {
        const r = appState.reviews[d];
        if (r && r.nextReviewDate && r.nextReviewDate <= today) {
            dueDay = DAYS_DATASET.find(item => item.day === d);
            if (dueDay) break;
        }
    }

    // 寻找 muduo 下一个尚未掌握到 Level 5 的任务
    let nextDay = null;
    for (let d = 1; d <= 28; d++) {
        const m = appState.mastery[d];
        if (!m || m.level < 5) {
            nextDay = DAYS_DATASET.find(item => item.day === d);
            if (nextDay) break;
        }
    }

    // 寻找 CppAIService 下一个未掌握（level < 3）的专栏文章
    const yqList = getYuqueDataset();
    let nextArticle = null;
    for (const art of yqList) {
        const lvl = (appState.knowledgeMastery && (appState.knowledgeMastery[art.id] || appState.knowledgeMastery[art.slug])) || 0;
        if (lvl < 3) {
            nextArticle = art;
            break;
        }
    }
    if (!nextArticle && yqList.length > 0) {
        nextArticle = yqList[0];
    }

    const levelNames = ["未开始", "已阅读", "已理解", "Demo已跑通", "独立实现", "源码贯通"];
    const nextDayMastery = nextDay ? (appState.mastery[nextDay.day] || { level: 0 }) : { level: 5 };
    const nextArtMasteryLvl = nextArticle ? ((appState.knowledgeMastery && (appState.knowledgeMastery[nextArticle.id] || appState.knowledgeMastery[nextArticle.slug])) || 0) : 5;

    // 复习警报条 (如果到期复习存在)
    let reviewAlertHtml = '';
    if (dueDay && dueCount > 0) {
        reviewAlertHtml = `
            <div class="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                        <i class="fa-solid fa-bell-ring animate-bounce"></i>
                    </span>
                    <div>
                        <div class="text-[11px] font-serifMono font-bold text-rose-800">
                            HIGHEST PRIORITY • 今日复习到期 (${dueCount}项待温故)
                        </div>
                        <div class="text-xs font-bold text-stone-900 mt-0.5">
                            Day ${dueDay.day < 10 ? '0' + dueDay.day : dueDay.day}: ${escapeHtml(dueDay.title)}
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0 font-serifMono">
                    <button onclick="openReviewModal(${dueDay.day})" class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-bolt"></i> 立即复习
                    </button>
                    <button onclick="scrollToDay(${dueDay.day})" class="px-3.5 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg transition cursor-pointer">
                        查看卡片
                    </button>
                </div>
            </div>
        `;
    }

    // muduo 卡片片段
    let muduoCardHtml = '';
    if (nextDay) {
        muduoCardHtml = `
            <div class="flex-1 bg-white/90 p-4 rounded-xl border border-sky-200/80 flex flex-col justify-between shadow-xs hover:border-sky-400 transition">
                <div>
                    <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-serifMono font-bold">
                            <i class="fa-solid fa-server text-sky-600"></i> Track 1 · muduo 网络库
                        </span>
                        <span class="text-[11px] font-serifMono text-amber-700 font-bold">
                            <i class="fa-regular fa-clock"></i> ${nextDay.estimatedMinutes} min
                        </span>
                    </div>
                    <h4 class="text-sm sm:text-base font-bold text-stone-900 font-serif-heading line-clamp-1">
                        Day ${nextDay.day < 10 ? '0' + nextDay.day : nextDay.day}: ${escapeHtml(nextDay.title)}
                    </h4>
                    <p class="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                        ${escapeHtml(nextDay.points[0].replace(/<[^>]+>/g, ''))}
                    </p>
                </div>
                <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2 font-serifMono">
                    <span class="text-[11px] text-stone-400">状态: <strong class="text-stone-700">${levelNames[nextDayMastery.level] || '未开始'}</strong></span>
                    <div class="flex items-center gap-1.5">
                        <button onclick="scrollToDay(${nextDay.day})" class="px-3 py-1.5 bg-sky-800 hover:bg-sky-900 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer">
                            <i class="fa-solid fa-play text-[10px]"></i> 开始任务
                        </button>
                        <button onclick="openQuizForDay(${nextDay.day})" class="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs font-semibold rounded-lg transition cursor-pointer">
                            自测
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        muduoCardHtml = `
            <div class="flex-1 bg-white/90 p-4 rounded-xl border border-emerald-200 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-trophy"></i>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-stone-900">muduo 28 天任务已完成</h4>
                    <p class="text-xs text-stone-500">已完整掌握 Reactor 模式与 C++ 规范实现。</p>
                </div>
            </div>
        `;
    }

    // CppAIService 卡片片段
    let cppaiCardHtml = '';
    if (nextArticle) {
        cppaiCardHtml = `
            <div class="flex-1 bg-white/90 p-4 rounded-xl border border-amber-200/80 flex flex-col justify-between shadow-xs hover:border-amber-400 transition">
                <div>
                    <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-serifMono font-bold">
                            <i class="fa-solid fa-microchip text-amber-600"></i> Track 2 · CppAIService 服务层
                        </span>
                        <span class="text-[11px] font-serifMono text-stone-500">
                            ${escapeHtml(nextArticle.category || '核心微服务')}
                        </span>
                    </div>
                    <h4 class="text-sm sm:text-base font-bold text-stone-900 font-serif-heading line-clamp-1">
                        ${escapeHtml(nextArticle.title)}
                    </h4>
                    <p class="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                        ${escapeHtml(nextArticle.summary || '涵盖 C++17 服务架构、HTTP 协议编解码、MCP 两段式推理与 RabbitMQ 异步落库。')}
                    </p>
                </div>
                <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2 font-serifMono">
                    <span class="text-[11px] text-stone-400">研读掌握: <strong class="text-amber-700">Level ${nextArtMasteryLvl} / 5</strong></span>
                    <div class="flex items-center gap-1.5">
                        <button onclick="openYuqueArticle('${nextArticle.slug || nextArticle.id}')" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer">
                            <i class="fa-solid fa-book-open-reader text-[10px]"></i> 研读专栏
                        </button>
                        <button onclick="switchTopologyTab('cppai'); scrollToTopology();" class="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold rounded-lg transition cursor-pointer">
                            查看架构
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        cppaiCardHtml = `
            <div class="flex-1 bg-white/90 p-4 rounded-xl border border-emerald-200 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-stone-900">CppAIService 专栏已完成精读</h4>
                    <p class="text-xs text-stone-500">已完整掌握服务架构与实现方案。</p>
                </div>
            </div>
        `;
    }

    // 根据模式决定展示布局
    let tracksLayout = '';
    if (mode === 'muduo') {
        tracksLayout = `
            <div class="space-y-3">
                <div class="text-xs font-serifMono text-sky-800 font-bold flex items-center gap-1.5">
                    <i class="fa-solid fa-crosshairs"></i> 当前模式：muduo 网络核心
                </div>
                ${muduoCardHtml}
            </div>
        `;
    } else if (mode === 'cppai') {
        tracksLayout = `
            <div class="space-y-3">
                <div class="text-xs font-serifMono text-amber-800 font-bold flex items-center gap-1.5">
                    <i class="fa-solid fa-crosshairs"></i> 当前模式：CppAIService 服务层
                </div>
                ${cppaiCardHtml}
            </div>
        `;
    } else {
        // full mode: 双核并进
        tracksLayout = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${muduoCardHtml}
                ${cppaiCardHtml}
            </div>
        `;
    }

    // Phase 4: 今日日常任务调度速览条
    let dailyRoutineQuickHtml = '';
    if (appState.dailyRoutine && Array.isArray(appState.dailyRoutine.tasks)) {
        let prog = { activeTotal: 7, completed: 0, rate: 0, remainingMinutes: 390 };
        if (typeof TaskDomain !== 'undefined' && typeof TaskDomain.calculateRoutineProgress === 'function') {
            prog = TaskDomain.calculateRoutineProgress(appState.dailyRoutine.tasks, appState.dailyRoutine.mode);
        }
        dailyRoutineQuickHtml = `
            <div class="mt-4 pt-3.5 border-t border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-serifMono">
                <div class="flex items-center gap-2.5">
                    <span class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                        <i class="fa-solid fa-list-check"></i>
                    </span>
                    <div>
                        <span class="text-stone-700 font-bold">今日日常任务：</span>
                        <span class="text-indigo-800 font-bold">${prog.completed} / ${prog.activeTotal} 项完成 (${prog.rate}%)</span>
                        <span class="text-stone-300 mx-1">•</span>
                        <span class="text-stone-500">剩余工时预估 ${prog.remainingMinutes} min</span>
                    </div>
                </div>
                <button onclick="switchView('tasks')" class="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0">
                    <span>任务调度中心</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
            </div>
        `;
    }

    container.innerHTML = `
        ${reviewAlertHtml}
        <div class="flex items-center justify-between mb-3 font-serifMono text-xs text-stone-500">
            <span class="font-bold flex items-center gap-1.5 text-stone-700">
                <i class="fa-solid fa-layer-group text-amber-600"></i> 今日任务推荐
            </span>
            <span class="text-[11px] text-stone-400">
                模式: <strong class="text-stone-800">${mode === 'muduo' ? 'muduo 网络核心' : (mode === 'cppai' ? 'CppAIService 服务层' : '双核全景视图')}</strong>
            </span>
        </div>
        ${tracksLayout}
        ${dailyRoutineQuickHtml}
    `;
}

// 日历网格渲染 (支持 0~5 阶状态色彩)
function renderCalendarGrid() {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const colors = {
        0: 'bg-white border-stone-200 text-stone-700 hover:border-sky-500 hover:bg-sky-50/20',
        1: 'bg-amber-50/70 border-amber-300 text-amber-950 hover:bg-amber-100/60',
        2: 'bg-sky-50 border-sky-300 text-sky-950 hover:bg-sky-100/60',
        3: 'bg-indigo-50 border-indigo-300 text-indigo-950 hover:bg-indigo-100/60',
        4: 'bg-emerald-600 border-emerald-700 text-white shadow-xs hover:bg-emerald-700',
        5: 'bg-emerald-800 border-emerald-900 text-white shadow-xs hover:bg-emerald-900'
    };

    DAYS_DATASET.forEach(item => {
        const m = appState.mastery[item.day] || { level: 0 };
        const level = m.level || 0;
        const cell = document.createElement('div');
        
        cell.className = `p-2 rounded-xl border text-center cursor-pointer transition-all duration-200 font-serifMono relative flex flex-col justify-between h-15 sm:h-16 group ${colors[level]}`;

        cell.onclick = () => scrollToDay(item.day);

        // 星级显示
        let stars = "";
        for (let s = 1; s <= 5; s++) {
            stars += s <= level ? "★" : "☆";
        }

        cell.innerHTML = `
            <div class="flex justify-between items-center text-[10px] sm:text-xs">
                <span class="font-bold tracking-wider ${level >= 4 ? 'text-emerald-100' : 'text-stone-900'}">D${item.day < 10 ? '0' + item.day : item.day}</span>
                <span class="text-[9px] ${level >= 4 ? 'text-amber-200' : 'text-amber-600'} font-bold">L${level}</span>
            </div>
            <div class="text-[11px] font-semibold truncate mt-0.5 ${level >= 4 ? 'text-white' : 'text-stone-800'}">${item.tags[0]}</div>
            <div class="text-[9px] tracking-tight ${level >= 4 ? 'text-emerald-200/90' : 'text-stone-400'}">${stars}</div>
        `;
        grid.appendChild(cell);
    });
}

// 7 天专注投入纯 SVG 柱状图
function renderStudyChart() {
    const container = document.getElementById('study-chart-container');
    if (!container) return;

    // 统计过去 7 天每天的分钟数
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${day}`;
        const weekday = ["日","一","二","三","四","五","六"][d.getDay()];

        let mins = 0;
        appState.studySessions.forEach(s => {
            if (s.date === dateStr) mins += (s.duration || 0);
        });

        days.push({ date: dateStr, label: `${m}/${day} 周${weekday}`, mins: mins });
    }

    const maxMins = Math.max(90, ...days.map(d => d.mins));

    let svgBars = "";
    const svgWidth = 460;
    const svgHeight = 110;
    const barWidth = 36;
    const gap = (svgWidth - barWidth * 7) / 8;

    days.forEach((d, idx) => {
        const x = gap + idx * (barWidth + gap);
        const barHeight = Math.max(4, Math.round((d.mins / maxMins) * 75));
        const y = 85 - barHeight;
        const isToday = idx === 6;
        const barColor = isToday ? "#0369a1" : (d.mins > 0 ? "#059669" : "#e2e8f0");

        svgBars += `
            <g>
                <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="${barColor}">
                    <title>${d.label}: ${d.mins} 分钟</title>
                </rect>
                <text x="${x + barWidth / 2}" y="${y - 4}" font-family="'Courier Prime', monospace" font-size="9" font-weight="700" fill="#475569" text-anchor="middle">${d.mins > 0 ? d.mins + 'm' : ''}</text>
                <text x="${x + barWidth / 2}" y="102" font-family="'Courier Prime', monospace" font-size="9" fill="${isToday ? '#0369a1' : '#64748b'}" font-weight="${isToday ? '700' : '400'}" text-anchor="middle">${d.label.slice(0, 5)}</text>
            </g>
        `;
    });

    container.innerHTML = `
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="85" x2="${svgWidth - 10}" y2="85" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="2 2" />
            ${svgBars}
        </svg>
    `;
}

// 今日待复习清单渲染
function renderDueReviewList() {
    const list = document.getElementById('review-due-list');
    const badge = document.getElementById('badge-due-count');
    if (!list || !badge) return;

    list.innerHTML = '';
    const today = getTodayDateStr();
    const dueItems = [];

    for (let d = 1; d <= 28; d++) {
        const r = appState.reviews[d];
        if (r && r.nextReviewDate && r.nextReviewDate <= today) {
            const item = DAYS_DATASET.find(x => x.day === d);
            if (item) dueItems.push({ ...item, review: r });
        }
    }

    badge.innerText = `${dueItems.length} 项到期`;

    if (dueItems.length === 0) {
        list.innerHTML = `
            <div class="p-6 text-center text-stone-400 bg-stone-50/60 rounded-xl border border-stone-200/60 font-serifHeading text-xs">
                <i class="fa-solid fa-circle-check text-2xl text-emerald-500 mb-1.5 inline-block"></i>
                <p>今日复习任务已全部达成！记忆巩固状态极佳。</p>
            </div>
        `;
        return;
    }

    dueItems.slice(0, 6).forEach(item => {
        const row = document.createElement('div');
        row.className = "flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-rose-300 transition text-xs font-serifHeading";
        row.innerHTML = `
            <div class="flex items-center gap-2 truncate pr-2">
                <span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold font-serifMono">D${item.day}</span>
                <span class="font-bold text-stone-800 truncate">${escapeHtml(item.title)}</span>
            </div>
            <button onclick="openReviewModal(${item.day})" class="px-2.5 py-1 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-bold rounded-lg font-serifMono shrink-0 transition" aria-label="复习 Day ${item.day}">
                复习
            </button>
        `;
        list.appendChild(row);
    });
}

// 专注计时器功能已由 js/timer.js 独立承载并增强修复

// 每日任务卡片渲染 (View 2)
function renderDailyCards() {
    const container = document.getElementById('cards-container');
    if (!container) return;
    container.innerHTML = '';

    const today = getTodayDateStr();

    const filtered = DAYS_DATASET.filter(item => {
        if (appState.weekFilter !== 0 && item.week !== appState.weekFilter) return false;
        
        const m = appState.mastery[item.day] || { level: 0 };
        const isMastered = m.level >= 4;

        if (appState.filterStatus === 'pending' && isMastered) return false;
        if (appState.filterStatus === 'mastered' && !isMastered) return false;
        if (appState.filterStatus === 'due_review') {
            const r = appState.reviews[item.day];
            if (!r || !r.nextReviewDate || r.nextReviewDate > today) return false;
        }

        if (appState.searchQuery.trim() !== "") {
            const q = appState.searchQuery.toLowerCase();
            const matchTitle = item.title.toLowerCase().includes(q);
            const matchRange = item.bookRange.toLowerCase().includes(q);
            const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
            const matchMap = item.muduoMap.toLowerCase().includes(q);
            const matchPoints = item.points.some(p => p.toLowerCase().includes(q));
            const note = (appState.dayNotes[item.day] || "").toLowerCase();
            const matchNote = note.includes(q);
            if (!matchTitle && !matchRange && !matchTags && !matchMap && !matchPoints && !matchNote) return false;
        }
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="p-12 text-center text-stone-400 bg-white rounded-2xl border border-stone-200 font-serifHeading">
                <i class="fa-solid fa-clipboard-check text-4xl mb-3 text-stone-300"></i>
                <p class="text-sm">当前过滤条件下没有找到任务</p>
            </div>
        `;
        return;
    }

    filtered.forEach(item => {
        const m = appState.mastery[item.day] || {
            level: 0,
            read: false,
            quizPassed: false,
            demo: false,
            independentImpl: false,
            sourceUnderstood: false
        };
        const savedNote = appState.dayNotes[item.day] || "";
        const expNote = appState.experimentNotes[item.day] || "";

        const card = document.createElement('div');
        card.id = `day-card-${item.day}`;
        card.className = `bg-white rounded-2xl p-5 sm:p-7 border academic-card transition-all duration-200 flex flex-col justify-between ${
            m.level >= 4 ? 'border-emerald-400/80 bg-emerald-50/15' : (m.level >= 1 ? 'border-sky-300/80' : 'border-stone-200')
        }`;

        const tagsHtml = item.tags.map(t => 
            `<span class="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px] font-serifMono">${t}</span>`
        ).join(' ');

        const pointsHtml = item.points.map(p => 
            `<li class="flex items-start gap-2 text-xs sm:text-sm text-stone-700 leading-relaxed font-serifHeading">
                <span class="text-amber-700 font-bold mt-0.5">•</span>
                <span>${p}</span>
             </li>`
        ).join('');

        // 步骤打卡按钮样式
        const btnStyle = (active, activeClass) => active ? activeClass : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200';

        card.innerHTML = `
            <div>
                <!-- 卡片顶栏 -->
                <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="px-2.5 py-1 rounded-lg text-xs font-bold font-serifMono ${
                            m.level >= 4 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-stone-100 text-stone-800 border border-stone-300'
                        }">DAY ${item.day < 10 ? '0' + item.day : item.day}</span>
                        
                        <span class="text-[11px] font-bold px-2 py-0.5 rounded-md font-serifMono ${
                            item.tier === 'A' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }">${item.tier} 级重点</span>

                        <span class="text-xs text-stone-400 font-serifMono">WEEK ${item.week}</span>

                        <!-- 时间预算徽章 -->
                        <span class="text-[11px] font-serifMono px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-800">
                            <i class="fa-regular fa-clock mr-1"></i>建议投入: ${item.estimatedMinutes} min (教材: 25m | 概念: 20m | Demo: 30m | 自测: 15m)
                        </span>
                    </div>

                    <!-- 掌握度评级指示 -->
                    <div class="flex items-center gap-1 text-xs font-serifMono text-amber-600 bg-amber-50/60 px-2.5 py-1 rounded-lg border border-amber-200/70">
                        <span class="font-bold text-amber-900">掌握度: L${m.level}</span>
                        <span>${"★".repeat(m.level)}${"☆".repeat(5 - m.level)}</span>
                    </div>
                </div>

                <!-- 标题与教材定位 -->
                <h3 class="text-base sm:text-lg font-bold text-stone-900 mb-1.5 font-serif-heading">${escapeHtml(item.title)}</h3>
                <div class="flex flex-wrap items-center gap-2 mb-3.5">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 border border-stone-200/80 text-stone-700 text-xs font-serifMono">
                        <i class="fa-solid fa-book-bookmark text-amber-700"></i>
                        <span>${escapeHtml(item.bookRange)}</span>
                    </div>
                </div>

                <div class="flex flex-wrap gap-1.5 mb-4">${tagsHtml}</div>

                <!-- 掌握度 5 阶段打卡记录 -->
                <div class="bg-stone-50 p-3 rounded-xl border border-stone-200 mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div class="text-[11px] font-serifMono font-bold text-stone-500">
                        <i class="fa-solid fa-stairs mr-1 text-sky-700"></i>能力阶梯:
                    </div>
                    <div class="flex flex-wrap items-center gap-1.5 font-serifMono text-xs">
                        <button onclick="toggleMasteryStep(${item.day}, 'read')" class="px-2.5 py-1 rounded-lg transition font-semibold ${btnStyle(m.read, 'bg-amber-100 text-amber-900 border border-amber-300')}" aria-label="标记学习完成">
                            <i class="fa-solid ${m.read ? 'fa-check' : 'fa-circle'} text-[10px]"></i> 学习完成
                        </button>
                        <button onclick="openQuizForDay(${item.day})" class="px-2.5 py-1 rounded-lg transition font-semibold ${btnStyle(m.quizPassed, 'bg-purple-100 text-purple-900 border border-purple-300')}" aria-label="进行每日自测">
                            <i class="fa-solid ${m.quizPassed ? 'fa-check' : 'fa-circle'} text-[10px]"></i> 自测通过
                        </button>
                        <button onclick="toggleMasteryStep(${item.day}, 'demo')" class="px-2.5 py-1 rounded-lg transition font-semibold ${btnStyle(m.demo, 'bg-indigo-100 text-indigo-900 border border-indigo-300')}" aria-label="标记Demo跑通">
                            <i class="fa-solid ${m.demo ? 'fa-check' : 'fa-circle'} text-[10px]"></i> Demo跑通
                        </button>
                        <button onclick="toggleMasteryStep(${item.day}, 'independentImpl')" class="px-2.5 py-1 rounded-lg transition font-semibold ${btnStyle(m.independentImpl, 'bg-teal-100 text-teal-900 border border-teal-300')}" aria-label="标记独立实现">
                            <i class="fa-solid ${m.independentImpl ? 'fa-check' : 'fa-circle'} text-[10px]"></i> 独立实现
                        </button>
                        <button onclick="toggleMasteryStep(${item.day}, 'sourceUnderstood')" class="px-2.5 py-1 rounded-lg transition font-semibold ${btnStyle(m.sourceUnderstood, 'bg-emerald-700 text-white shadow-xs')}" aria-label="标记源码理解">
                            <i class="fa-solid ${m.sourceUnderstood ? 'fa-check' : 'fa-circle'} text-[10px]"></i> 源码理解
                        </button>
                    </div>
                </div>

                <!-- 核心聚焦与深度解析 -->
                <div class="mb-4">
                    <div class="text-[11px] font-bold tracking-wider text-stone-400 mb-1.5 font-serifMono">
                        <i class="fa-solid fa-bullseye text-amber-600 mr-1"></i>今日核心聚焦与深度解析
                    </div>
                    <ul class="space-y-1.5 pl-0.5">${pointsHtml}</ul>
                </div>

                <!-- 快速理解 vs 严格表述 辨析对照框 -->
                <div class="mb-4 bg-amber-50/50 border border-amber-200/70 rounded-xl p-3 text-xs leading-relaxed font-serifHeading">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="border-b md:border-b-0 md:border-r border-amber-200/60 pb-2 md:pb-0 md:pr-3">
                            <span class="inline-flex items-center gap-1 font-bold text-amber-900 font-serifMono text-[11px] mb-1">
                                <i class="fa-regular fa-lightbulb text-amber-600"></i> 快速直观理解
                            </span>
                            <p class="text-stone-700 text-[11.5px]">${escapeHtml(item.rigorousNuance?.quick || "")}</p>
                        </div>
                        <div class="md:pl-1">
                            <span class="inline-flex items-center gap-1 font-bold text-sky-900 font-serifMono text-[11px] mb-1">
                                <i class="fa-solid fa-microscope text-sky-700"></i> 机制剖析
                            </span>
                            <p class="text-stone-700 text-[11.5px]">${escapeHtml(item.rigorousNuance?.strict || "")}</p>
                        </div>
                    </div>
                </div>

                <!-- muduo 映射与验收 -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-4">
                    <div class="lg:col-span-4 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex flex-col justify-between text-xs text-amber-950">
                        <div>
                            <div class="font-bold text-amber-900 font-serifMono text-[11px] mb-1">
                                <i class="fa-solid fa-network-wired text-amber-700 mr-1"></i>muduo 源码对应位置
                            </div>
                            <p class="leading-relaxed font-serifMono text-[11px]">${escapeHtml(item.muduoMap)}</p>
                        </div>
                        <div class="mt-2.5 pt-2 border-t border-amber-200 text-[11px] font-serifHeading text-stone-700">
                            <strong>验收准则:</strong> ${escapeHtml(item.check)}
                        </div>
                    </div>

                    <!-- Demo 实验工作台 -->
                    <div class="lg:col-span-8 bg-stone-50 border border-stone-200 rounded-xl p-3.5 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between text-[11px] font-bold text-stone-600 mb-2 font-serifMono">
                                <span><i class="fa-solid fa-flask-vial text-sky-700 mr-1"></i>MINIMAL RUNNABLE LAB BENCH</span>
                                <div class="flex items-center gap-2">
                                    <button onclick="copyCode(this, \`${escapeJsString(item.experiment.buildCommand)}\`)" class="text-stone-600 hover:text-stone-900 transition flex items-center gap-1" aria-label="复制编译命令">
                                        <i class="fa-regular fa-terminal"></i> 复制编译命令
                                    </button>
                                    <span class="text-stone-300">|</span>
                                    <button onclick="copyDayCode(this, ${item.day})" class="text-sky-700 hover:text-sky-800 transition flex items-center gap-1" aria-label="复制代码">
                                        <i class="fa-regular fa-copy"></i> 复制代码
                                    </button>
                                </div>
                            </div>

                            <!-- 实验目标与重点 -->
                            <div class="text-[11px] text-stone-600 font-serifHeading mb-2 bg-white p-2.5 rounded-lg border border-stone-200/80 leading-relaxed">
                                <div><strong class="text-stone-800">实验目标:</strong> ${escapeHtml(item.experiment.goal)}</div>
                                <div class="mt-1"><strong class="text-stone-800">观察重点:</strong> ${escapeHtml(item.experiment.watchPoints)}</div>
                                <div class="mt-1 text-rose-700"><strong class="text-rose-900">常见错误:</strong> ${escapeHtml(item.experiment.pitfalls)}</div>
                            </div>

                            <!-- 编译命令展示 -->
                            <div class="mb-2 bg-stone-900 text-stone-100 font-mono-code text-[10.5px] p-2 rounded-lg flex items-center justify-between overflow-x-auto">
                                <span class="text-emerald-400 select-all">$ ${escapeHtml(item.experiment.buildCommand)}</span>
                                <span class="text-[10px] text-stone-400 ml-2 shrink-0">Linux终端执行</span>
                            </div>

                            <!-- 代码块 -->
                            <pre class="m-0 p-0 overflow-x-auto"><code class="language-cpp font-mono-code">${escapeHtml(item.code)}</code></pre>
                        </div>

                        <!-- 实验结果记录与完成标记 -->
                        <div class="mt-3 pt-2.5 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                            <input type="text" value="${escapeHtml(expNote)}" onchange="updateExperimentNote(${item.day}, this.value)" placeholder="记录本地终端运行结果、输出日志或断言表现..." class="w-full text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-700 font-serifMono">
                            <button onclick="toggleMasteryStep(${item.day}, 'demo')" class="px-3 py-1.5 text-xs font-serifMono font-bold rounded-lg transition whitespace-nowrap ${
                                m.demo ? 'bg-emerald-700 text-white' : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                            }" aria-label="标记实验完成">
                                ${m.demo ? '<i class="fa-solid fa-check mr-1"></i>实验已跑通' : '<i class="fa-solid fa-flask mr-1"></i>标记实验完成'}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 每日自测与手记栏 -->
                <div class="bg-stone-50/70 p-3 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                        <button onclick="openQuizForDay(${item.day})" class="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs font-serifMono rounded-xl shadow-xs transition flex items-center gap-1.5" aria-label="打开每日自测">
                            <i class="fa-solid fa-clipboard-question"></i> ${m.quizPassed ? '自测已过 (复习)' : '开始今日自测 (5题)'}
                        </button>
                        <span class="text-[11px] text-stone-500 font-serifMono">
                            ${m.quizScores ? `得分: ${m.quizScores.overall}% (理解: ${m.quizScores.knowledge}% | 代码: ${m.quizScores.code}%)` : '完成自测解锁更高级别'}
                        </span>
                    </div>

                    <div class="flex items-center gap-2 w-full sm:w-1/2">
                        <span class="text-[11px] text-stone-400 font-serifMono whitespace-nowrap">
                            <i class="fa-solid fa-pen mr-1"></i>个人手记:
                        </span>
                        <input type="text" value="${escapeHtml(savedNote)}" oninput="debouncedUpdateDayNote(${item.day}, this.value)" onblur="updateDayNote(${item.day}, this.value)" placeholder="记录心得 (失焦或输入自动存盘)..." class="w-full text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-700 font-serifMono">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // 触发代码高亮
    document.querySelectorAll('pre code').forEach((el) => {
        if (typeof hljs !== "undefined") hljs.highlightElement(el);
    });

    // 彻底防御性清除任何残留或旧缓存注入的直跳与 Readest 按钮
    document.querySelectorAll('button[onclick*="quickJumpByDay"], button[onclick*="quickReadestByDay"]').forEach(el => el.remove());
}

function escapeJsString(str) {
    return (str || '').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

// 掌握度步骤切换
function toggleMasteryStep(dayNum, step) {
    if (!appState.mastery[dayNum]) {
        appState.mastery[dayNum] = {
            level: 0,
            read: false,
            quizPassed: false,
            demo: false,
            independentImpl: false,
            sourceUnderstood: false,
            completedAt: null,
            score: 0
        };
    }

    const m = appState.mastery[dayNum];
    m[step] = !m[step];

    // 自测门槛控制
    if (step === 'quizPassed' && !m.quizPassed) {
        // 如果取消自测通过，最高只能降到相应等级
    }

    // 重新评估 level 0~5
    let lvl = 0;
    if (m.read) lvl = 1;
    if (m.read && m.quizPassed) lvl = 2;
    if (m.read && m.quizPassed && m.demo) lvl = 3;
    if (m.read && m.quizPassed && m.demo && m.independentImpl) lvl = 4;
    if (m.read && m.quizPassed && m.demo && m.independentImpl && m.sourceUnderstood) lvl = 5;

    m.level = lvl;
    if (lvl >= 3) {
        m.completedAt = m.completedAt || new Date().toISOString();
        if (!appState.completedDays.includes(dayNum)) {
            appState.completedDays.push(dayNum);
        }
    } else {
        const idx = appState.completedDays.indexOf(dayNum);
        if (idx >= 0) appState.completedDays.splice(idx, 1);
    }

    persistState();
    updateDashboardMetrics();
    renderDailyCards();
    showToast(`Day ${dayNum} 掌握度已更新为 L${lvl}！`);
}

// 防抖手记更新
const debouncedUpdateDayNote = debounce((dayNum, text) => {
    appState.dayNotes[dayNum] = text;
    persistState();
}, 600);

function updateDayNote(dayNum, text) {
    appState.dayNotes[dayNum] = text;
    persistState();
    showToast(`Day ${dayNum} 手记已保存`);
}

function updateExperimentNote(dayNum, text) {
    appState.experimentNotes[dayNum] = text;
    persistState();
    showToast(`Day ${dayNum} 实验结果已记录`);
}

function setWeekFilter(weekNum) {
    appState.weekFilter = weekNum;
    document.querySelectorAll('.week-tab').forEach(btn => {
        const w = parseInt(btn.getAttribute('data-week'));
        if (w === weekNum) {
            btn.className = "week-tab px-3 py-1.5 text-xs font-bold rounded-lg transition text-stone-900 bg-white shadow-xs font-serifMono whitespace-nowrap";
        } else {
            btn.className = "week-tab px-3 py-1.5 text-xs font-medium rounded-lg transition text-stone-600 hover:text-stone-900 font-serifMono whitespace-nowrap";
        }
    });
    renderDailyCards();
}

function changeFilterStatus(val) {
    appState.filterStatus = val;
    renderDailyCards();
}

function applyDailyFilters() {
    appState.searchQuery = document.getElementById('search-input').value;
    renderDailyCards();
}

function scrollToDay(dayNum) {
    switchView('daily');
    const targetObj = DAYS_DATASET.find(d => d.day === dayNum);
    if (!targetObj) return;

    if (appState.weekFilter !== 0 && appState.weekFilter !== targetObj.week) {
        setWeekFilter(targetObj.week);
    }

    setTimeout(() => {
        const target = document.getElementById(`day-card-${dayNum}`);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.classList.add('ring-4', 'ring-sky-600/40', 'ring-offset-2');
            setTimeout(() => target.classList.remove('ring-4', 'ring-sky-600/40', 'ring-offset-2'), 1800);
        }
    }, 150);
}

function copyDayCode(btn, dayNum) {
    const item = DAYS_DATASET.find(d => d.day === dayNum);
    if (!item) return;
    copyCode(btn, item.code);
}

function copyCode(btn, code) {
    const temp = document.createElement('textarea');
    temp.value = code;
    document.body.appendChild(temp);
    temp.select();
    try {
        document.execCommand('copy');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check text-emerald-600"></i> 已复制';
        setTimeout(() => { btn.innerHTML = orig; }, 1600);
        showToast("已成功复制到剪贴板");
    } catch (e) {
        showToast("复制失败，请手动选取", false);
    }
    document.body.removeChild(temp);
}

// 语法 ➔ muduo 映射矩阵表格 (View 3)
function renderMappingTable() {
    const tbody = document.getElementById('mapping-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const featureToDayMap = {
        "RAII": 3,
        "std::unique_ptr": 8,
        "std::shared_ptr": 9,
        "std::weak_ptr": 10,
        "std::vector<char>": 11,
        "std::map": 13,
        "std::function": 18,
        "std::bind": 19,
        "Lambda 表达式": 17,
        "移动语义 move": 6,
        "= delete": 7,
        "const 成员函数": 2,
        "运算符重载": 24,
        "类模板": 25,
        "虚析构函数": 26
    };

    getMappingMatrix().forEach(row => {
        const targetDay = featureToDayMap[row.feature] || 1;
        const tr = document.createElement('tr');
        tr.className = "hover:bg-stone-50/80 transition";
        tr.innerHTML = `
            <td class="p-3.5 font-bold text-stone-900 border-b border-stone-100 font-serifHeading">${escapeHtml(row.feature)}</td>
            <td class="p-3.5 font-serifMono text-sky-800 font-medium border-b border-stone-100">${escapeHtml(row.muduoLocation)}</td>
            <td class="p-3.5 text-stone-600 leading-relaxed border-b border-stone-100 font-serifHeading">${escapeHtml(row.desc)}</td>
            <td class="p-3.5 font-serifMono text-stone-800 bg-stone-50/50 border-b border-stone-100 text-[11px]">${escapeHtml(row.snippet)}</td>
            <td class="p-3.5 text-center border-b border-stone-100 font-serifMono">
                <button onclick="scrollToDay(${targetDay})" class="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition whitespace-nowrap" aria-label="查看 Day ${targetDay}">
                    Day ${targetDay}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 笔记本与沙盒 (View 4)
const debouncedSaveGlobalNotes = debounce(() => {
    const el = document.getElementById('notebook-textarea');
    if (!el) return;
    appState.globalNotes = el.value;
    persistState();
    const statusEl = document.getElementById('notebook-status');
    if (statusEl) statusEl.innerText = `已在 ${new Date().toLocaleTimeString()} 自动存盘`;
}, 600);

function saveGlobalNotesManual() {
    const el = document.getElementById('notebook-textarea');
    if (el) {
        appState.globalNotes = el.value;
        persistState();
    }
    const statusEl = document.getElementById('notebook-status');
    if (statusEl) statusEl.innerText = `已在 ${new Date().toLocaleTimeString()} 手动存盘`;
    showToast("全局实验笔记已成功保存");
}

function clearGlobalNotes() {
    openModal("清空全局笔记", "确定清空备忘录文本域的所有内容吗？", () => {
        const el = document.getElementById('notebook-textarea');
        if (el) el.value = "";
        appState.globalNotes = "";
        persistState();
        showToast("笔记内容已清空");
    });
}

function insertTemplate(type) {
    const textarea = document.getElementById('notebook-textarea');
    const templates = {
        raii: `// [RAII 验证模板]\n#include <iostream>\n\nclass ScopeGuard {\npublic:\n    ScopeGuard() { std::cout << "--> Lock or Resource Allocated\\n"; }\n    ~ScopeGuard() { std::cout << "<-- Lock Released\\n"; }\n};\n\nint main() {\n    std::cout << "Entering scope...\\n";\n    {\n        ScopeGuard guard;\n        std::cout << "Inside critical section...\\n";\n    }\n    std::cout << "Exited scope.\\n";\n    return 0;\n}`,
        weak: `// [weak_ptr 循环引用破除验证]\n#include <iostream>\n#include <memory>\n\nstruct B;\nstruct A {\n    std::shared_ptr<B> b_ptr;\n    ~A() { std::cout << "~A() destroyed!\\n"; }\n};\nstruct B {\n    std::weak_ptr<A> a_weak; // 关键：用 weak_ptr 代替 shared_ptr 避免死锁\n    ~B() { std::cout << "~B() destroyed!\\n"; }\n};\n\nint main() {\n    auto a = std::make_shared<A>();\n    auto b = std::make_shared<B>();\n    a->b_ptr = b;\n    b->a_weak = a;\n    return 0;\n}`,
        bind: `// [std::bind 绑定类成员函数]\n#include <iostream>\n#include <functional>\n\nclass TcpServer {\npublic:\n    void onConnection(int fd) {\n        std::cout << "Client connected with fd: " << fd << "\\n";\n    }\n};\n\nint main() {\n    TcpServer server;\n    std::function<void(int)> cb = std::bind(&TcpServer::onConnection, &server, std::placeholders::_1);\n    cb(42);\n    return 0;\n}`,
        buffer: `// [支持 Move 但严禁 Copy 的 Buffer 原型]\n#include <iostream>\n#include <utility>\n\nclass SafeBuffer {\nprivate:\n    char* data_{nullptr};\n    size_t size_{0};\npublic:\n    SafeBuffer(size_t s) : size_(s), data_(new char[s]) {}\n    ~SafeBuffer() { delete[] data_; }\n\n    SafeBuffer(const SafeBuffer&) = delete;\n    SafeBuffer& operator=(const SafeBuffer&) = delete;\n\n    SafeBuffer(SafeBuffer&& rhs) noexcept : data_(rhs.data_), size_(rhs.size_) {\n        rhs.data_ = nullptr;\n        rhs.size_ = 0;\n    }\n};`
    };

    if (templates[type]) {
        textarea.value += (textarea.value ? "\n\n" : "") + templates[type];
        saveGlobalNotesManual();
    }
}

// 每日自测中心 (View 5)
function initQuizDaySelector() {
    const sel = document.getElementById('quiz-day-selector');
    if (!sel) return;
    sel.innerHTML = '';
    DAYS_DATASET.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.day;
        opt.innerText = `Day ${item.day < 10 ? '0' + item.day : item.day}: ${item.title}`;
        sel.appendChild(opt);
    });

    // 填充专注计时器关联 Day 选择器
    const timerDaySel = document.getElementById('timer-day');
    if (timerDaySel) {
        timerDaySel.innerHTML = '';
        DAYS_DATASET.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.day;
            opt.innerText = `Day ${item.day}: ${item.tags[0]}`;
            timerDaySel.appendChild(opt);
        });
    }
}

function openQuizForDay(dayNum) {
    switchView('quiz');
    const sel = document.getElementById('quiz-day-selector');
    if (sel) sel.value = dayNum;
    loadQuizForDay(dayNum);
}

function loadQuizForDay(dayNum) {
    const container = document.getElementById('quiz-runner-container');
    if (!container) return;
    const item = DAYS_DATASET.find(d => d.day === dayNum);
    if (!item || !item.quiz) return;

    const quiz = item.quiz;
    const m = appState.mastery[dayNum] || { level: 0 };

    let choiceHtml = "";
    quiz.questions.forEach((q, qIdx) => {
        let optsHtml = q.options.map((opt, oIdx) => `
            <label class="flex items-start gap-2.5 p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                <input type="radio" name="quiz_choice_${qIdx}" value="${oIdx}" class="mt-0.5 text-purple-600 focus:ring-purple-500">
                <span class="text-stone-700 leading-relaxed font-serifHeading">${escapeHtml(opt)}</span>
            </label>
        `).join('');

        choiceHtml += `
            <div class="bg-white p-4 rounded-xl border border-stone-200 space-y-2.5">
                <div class="font-bold text-stone-900 text-xs sm:text-sm font-serifHeading">
                    <span class="text-purple-700 font-serifMono mr-1">Q${qIdx + 1}:</span> ${escapeHtml(q.question)}
                </div>
                <div class="space-y-1.5">${optsHtml}</div>
                <div id="quiz_expl_${qIdx}" class="hidden p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-600 font-serifHeading leading-relaxed">
                    <strong>解析:</strong> ${escapeHtml(q.explanation)}
                </div>
            </div>
        `;
    });

    let codeOptsHtml = quiz.codeQuestion.options.map((opt, oIdx) => `
        <label class="flex items-start gap-2.5 p-2 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
            <input type="radio" name="quiz_code_choice" value="${oIdx}" class="mt-0.5 text-purple-600">
            <span class="text-stone-700 font-serifHeading">${escapeHtml(opt)}</span>
        </label>
    `).join('');

    container.innerHTML = `
        <!-- 自测题目头部信息 -->
        <div class="bg-purple-50/60 p-4 rounded-xl border border-purple-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
                <span class="text-xs font-serifMono font-bold text-purple-800">DAY ${item.day < 10 ? '0' + item.day : item.day} 专项技术检验</span>
                <h3 class="text-base font-bold text-stone-900 font-serif-heading mt-0.5">${escapeHtml(item.title)}</h3>
                <p class="text-xs text-stone-600 mt-1">题量：选择/判断 × ${quiz.questions.length} + 代码阅读 × 1 + 机制解释 × 1 + muduo映射 × 1</p>
            </div>
            <div id="quiz-score-banner" class="text-xs font-serifMono">
                ${m.quizScores ? `<span class="bg-white px-3 py-1.5 rounded-lg border border-purple-300 font-bold text-purple-900">历史得分: ${m.quizScores.overall}%</span>` : '<span class="text-stone-400">尚未完成评测</span>'}
            </div>
        </div>

        <!-- 模块 1: 选择/判断题 -->
        <div class="space-y-4">
            <div class="text-xs font-bold font-serifMono text-stone-500 uppercase tracking-wider">
                PART 1: 概念理解与语言规范 (Choice & Truth)
            </div>
            ${choiceHtml}
        </div>

        <!-- 模块 2: 代码阅读题 -->
        <div class="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
            <div class="text-xs font-bold font-serifMono text-stone-500 uppercase tracking-wider">
                PART 2: 代码阅读与行为预测 (Code Analysis)
            </div>
            <p class="text-xs font-bold text-stone-900 font-serifHeading">${escapeHtml(quiz.codeQuestion.question)}</p>
            <pre class="m-0 p-0 overflow-x-auto"><code class="language-cpp font-mono-code">${escapeHtml(quiz.codeQuestion.code)}</code></pre>
            <div class="space-y-1.5 mt-2">${codeOptsHtml}</div>
            <div id="quiz_code_expl" class="hidden p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-600 font-serifHeading leading-relaxed">
                <strong>代码分析:</strong> ${escapeHtml(quiz.codeQuestion.explanation)}
            </div>
        </div>

        <!-- 模块 3: 为什么机制题 -->
        <div class="bg-white p-4 rounded-xl border border-stone-200 space-y-2.5">
            <div class="text-xs font-bold font-serifMono text-stone-500 uppercase tracking-wider">
                PART 3: 底层机制“为什么”深度剖析 (Deep "Why")
            </div>
            <p class="text-xs font-bold text-stone-900 font-serifHeading">${escapeHtml(quiz.whyQuestion.question)}</p>
            <textarea id="quiz-why-input" rows="2" placeholder="写下你的思考：为何 C++ 语言如此设计？底层汇编或内存本质是什么..." class="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs font-serifHeading focus:outline-none focus:border-purple-600"></textarea>
            <button onclick="toggleAnswerSection('why-ref-answer')" class="text-xs font-serifMono text-purple-700 hover:text-purple-800 font-semibold">
                <i class="fa-regular fa-eye mr-1"></i>展开权威参考解答与核心关键字
            </button>
            <div id="why-ref-answer" class="hidden p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs leading-relaxed text-stone-700 font-serifHeading">
                <div class="font-bold text-amber-900 font-serifMono mb-1">权威参考解答：</div>
                <p>${escapeHtml(quiz.whyQuestion.referenceAnswer)}</p>
                <div class="mt-2 text-[11px] text-stone-500 font-serifMono">
                    核心概念词: ${quiz.whyQuestion.keywords.map(k => `<span class="bg-white px-1.5 py-0.5 rounded border border-amber-300 mr-1 text-stone-700">${k}</span>`).join('')}
                </div>
            </div>
        </div>

        <!-- 模块 4: muduo 源码映射题 -->
        <div class="bg-white p-4 rounded-xl border border-stone-200 space-y-2.5">
            <div class="text-xs font-bold font-serifMono text-stone-500 uppercase tracking-wider">
                PART 4: muduo 源码映射 (Architecture Mapping)
            </div>
            <p class="text-xs font-bold text-stone-900 font-serifHeading">${escapeHtml(quiz.muduoQuestion.question)}</p>
            <textarea id="quiz-muduo-input" rows="2" placeholder="分析 muduo 网络库中该特性的应用场景与架构价值..." class="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs font-serifHeading focus:outline-none focus:border-purple-600"></textarea>
            <button onclick="toggleAnswerSection('muduo-ref-answer')" class="text-xs font-serifMono text-purple-700 hover:text-purple-800 font-semibold">
                <i class="fa-regular fa-eye mr-1"></i>展开 muduo 设计思想参考
            </button>
            <div id="muduo-ref-answer" class="hidden p-3 rounded-lg bg-sky-50/70 border border-sky-200 text-xs leading-relaxed text-stone-700 font-serifHeading">
                <div class="font-bold text-sky-900 font-serifMono mb-1">muduo 设计意图：</div>
                <p>${escapeHtml(quiz.muduoQuestion.referenceAnswer)}</p>
            </div>
        </div>

        <!-- 提交自测与评测打分 -->
        <div class="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 font-serifMono">
            <div class="text-xs text-stone-600">
                提交后立即得出 4 维评估结果，及格（≥80%）将自动提升 Day ${item.day} 的掌握等级。
            </div>
            <button onclick="submitQuiz(${item.day})" class="w-full sm:w-auto px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-calculator"></i> 提交自测并核算成绩
            </button>
        </div>

        <!-- 4 维雷达评估结果卡片 -->
        <div id="quiz-eval-result" class="hidden bg-white p-5 rounded-xl border-2 border-purple-400 academic-card space-y-4 font-serifHeading">
            <!-- JS 填充评分结果 -->
        </div>
    `;

    document.querySelectorAll('#quiz-runner-container pre code').forEach(el => hljs.highlightElement(el));
}

function toggleAnswerSection(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden');
}

function submitQuiz(dayNum) {
    const item = DAYS_DATASET.find(d => d.day === dayNum);
    if (!item || !item.quiz) return;
    const quiz = item.quiz;

    let correctChoices = 0;
    quiz.questions.forEach((q, idx) => {
        const selected = document.querySelector(`input[name="quiz_choice_${idx}"]:checked`);
        const expl = document.getElementById(`quiz_expl_${idx}`);
        if (expl) expl.classList.remove('hidden');

        if (selected && parseInt(selected.value) === q.answer) {
            correctChoices++;
        }
    });

    // 代码阅读题得分
    let codeCorrect = 0;
    const codeSelected = document.querySelector(`input[name="quiz_code_choice"]:checked`);
    const codeExpl = document.getElementById('quiz_code_expl');
    if (codeExpl) codeExpl.classList.remove('hidden');

    if (codeSelected && parseInt(codeSelected.value) === quiz.codeQuestion.answer) {
        codeCorrect = 1;
    }

    // 机制题自评 (根据是否输入有效文本)
    const whyInput = document.getElementById('quiz-why-input')?.value.trim() || "";
    const muduoInput = document.getElementById('quiz-muduo-input')?.value.trim() || "";

    const knowledgeScore = Math.round((correctChoices / quiz.questions.length) * 100);
    const codeScore = codeCorrect === 1 ? 100 : 50;
    const muduoScore = (whyInput.length > 5 && muduoInput.length > 5) ? 100 : (whyInput.length > 0 || muduoInput.length > 0 ? 80 : 60);

    const overallScore = Math.round(knowledgeScore * 0.4 + codeScore * 0.3 + muduoScore * 0.3);

    // 记录结果
    if (!appState.mastery[dayNum]) {
        appState.mastery[dayNum] = { level: 0, read: false, quizPassed: false, demo: false, independentImpl: false, sourceUnderstood: false };
    }
    const m = appState.mastery[dayNum];
    m.quizScores = {
        knowledge: knowledgeScore,
        code: codeScore,
        muduo: muduoScore,
        overall: overallScore
    };

    const isPassed = overallScore >= 75;
    if (isPassed) {
        m.quizPassed = true;
        m.read = true;
        if (m.level < 2) m.level = 2; // 升级为已理解
        
        // 安排首次复习（1天后）
        if (!appState.reviews[dayNum]) {
            appState.reviews[dayNum] = {
                stage: 0,
                nextReviewDate: getFutureDateStr(1),
                lastReviewDate: getTodayDateStr(),
                intervalDays: 1,
                reviewCount: 1,
                history: []
            };
        }
    }

    persistState();
    updateDashboardMetrics();

    // 显示评估结果看板
    const resultBox = document.getElementById('quiz-eval-result');
    if (resultBox) {
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `
            <div class="flex items-center justify-between border-b border-stone-100 pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
                    <h4 class="font-bold text-stone-900 text-base">自测评估结果：${isPassed ? '🎉 检验通过！' : '⚠️ 仍需加强理解'}</h4>
                </div>
                <div class="text-lg font-bold font-serifMono ${isPassed ? 'text-emerald-700' : 'text-rose-600'}">
                    综合得分: ${overallScore}%
                </div>
            </div>

            <!-- 4 维指标柱状条 -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-serifMono text-xs pt-1">
                <div class="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <div class="text-[10px] text-stone-400">概念理解</div>
                    <div class="text-sm font-bold text-purple-800 mt-0.5">${knowledgeScore}%</div>
                </div>
                <div class="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <div class="text-[10px] text-stone-400">代码分析</div>
                    <div class="text-sm font-bold text-sky-800 mt-0.5">${codeScore}%</div>
                </div>
                <div class="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <div class="text-[10px] text-stone-400">muduo映射</div>
                    <div class="text-sm font-bold text-teal-800 mt-0.5">${muduoScore}%</div>
                </div>
                <div class="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <div class="text-[10px] text-stone-400">综合判定</div>
                    <div class="text-sm font-bold ${isPassed ? 'text-emerald-700' : 'text-rose-600'} mt-0.5">${isPassed ? '通过' : '未达标'}</div>
                </div>
            </div>

            <p class="text-xs text-stone-600 leading-relaxed font-serifHeading">
                ${isPassed 
                    ? `太棒了！Day ${dayNum} 的掌握度已提升为 L${m.level}，并已为你安排在明天的间隔复习日程中。` 
                    : `综合得分低于 75%，建议重读教材章节并在本地终端编写 Demo 后再次自测。`}
            </p>
        `;
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showToast(isPassed ? `🎉 Day ${dayNum} 自测通过 (${overallScore}分)！` : `自测未通过 (${overallScore}分)，请复习后再战`, isPassed);
}

// muduo 源码路线 (View 6)
function renderSourceRoadmap() {
    const container = document.getElementById('source-roadmap-container');
    const progEl = document.getElementById('source-read-progress');
    if (!container) return;
    container.innerHTML = '';

    const readCount = Object.values(appState.sourceStatus).filter(s => s && s.status === '已精读').length;
    if (progEl) progEl.innerText = `${readCount} / 8`;

    getSourceRoadmap().forEach((node, idx) => {
        const curStatus = appState.sourceStatus[node.id]?.status || '未读';
        const savedNotes = appState.sourceStatus[node.id]?.notes || '';

        const card = document.createElement('div');
        card.className = "bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 academic-card space-y-4 font-serifHeading";

        const membersHtml = node.members.map(m => `
            <li class="font-mono-code text-[11px] text-stone-700 bg-stone-50 p-1.5 rounded border border-stone-200/60">${escapeHtml(m)}</li>
        `).join('');

        const functionsHtml = node.functions.map(f => `
            <li class="font-mono-code text-[11px] text-sky-900 bg-sky-50/50 p-1.5 rounded border border-sky-200/60">${escapeHtml(f)}</li>
        `).join('');

        const daysBadges = node.relatedDays.map(d => `
            <button onclick="scrollToDay(${d})" class="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-serifMono font-bold transition">
                Day ${d}
            </button>
        `).join(' ');

        card.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-7 h-7 rounded-lg bg-teal-800 text-white font-serifMono font-bold flex items-center justify-center text-xs">
                        ${idx + 1}
                    </span>
                    <div>
                        <h3 class="text-base sm:text-lg font-bold text-stone-900">${escapeHtml(node.name)}</h3>
                        <span class="text-[11px] text-stone-500 font-serifMono">${escapeHtml(node.layer)}</span>
                    </div>
                </div>

                <div class="flex items-center gap-2 self-end sm:self-auto font-serifMono">
                    <span class="text-xs text-stone-500">阅读状态:</span>
                    <select onchange="updateSourceStatus('${node.id}', this.value)" class="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-bold text-stone-800 focus:outline-none focus:border-teal-700">
                        <option value="未读" ${curStatus === '未读' ? 'selected' : ''}>未读</option>
                        <option value="研读中" ${curStatus === '研读中' ? 'selected' : ''}>研读中</option>
                        <option value="已精读" ${curStatus === '已精读' ? 'selected' : ''}>已精读</option>
                    </select>
                </div>
            </div>

            <!-- 核心职责 -->
            <div class="text-xs leading-relaxed text-stone-700">
                <strong class="text-stone-900 font-serifMono">核心职责:</strong> ${escapeHtml(node.role)}
            </div>

            <!-- 关键成员与关键函数 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div>
                    <div class="text-[11px] font-bold font-serifMono text-stone-500 mb-1.5">
                        <i class="fa-solid fa-cube text-teal-700 mr-1"></i>关键成员与所有权模型
                    </div>
                    <ul class="space-y-1">${membersHtml}</ul>
                </div>
                <div>
                    <div class="text-[11px] font-bold font-serifMono text-stone-500 mb-1.5">
                        <i class="fa-solid fa-bolt text-sky-700 mr-1"></i>关键核心函数签名
                    </div>
                    <ul class="space-y-1">${functionsHtml}</ul>
                </div>
            </div>

            <!-- 关联 Day 与 手记 -->
            <div class="pt-3 border-t border-stone-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-serifMono text-stone-500">对应学习日:</span>
                    ${daysBadges}
                </div>
                <div class="w-full md:w-1/2">
                    <input type="text" value="${escapeHtml(savedNotes)}" onchange="updateSourceNotes('${node.id}', this.value)" placeholder="记录对 ${node.name} 的研读心得或代码疑问..." class="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-700 font-serifMono">
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateSourceStatus(nodeId, status) {
    if (!appState.sourceStatus[nodeId]) appState.sourceStatus[nodeId] = { status: '未读', notes: '' };
    appState.sourceStatus[nodeId].status = status;
    persistState();
    updateDashboardMetrics();
    renderSourceRoadmap();
    showToast(`组件 ${nodeId} 状态已更新为: ${status}`);
}

function updateSourceNotes(nodeId, notes) {
    if (!appState.sourceStatus[nodeId]) appState.sourceStatus[nodeId] = { status: '未读', notes: '' };
    appState.sourceStatus[nodeId].notes = notes;
    persistState();
    showToast(`组件 ${nodeId} 研读笔记已保存`);
}

// C++ 踩坑档案数据库 (View 7)
let pitfallFilterTag = 'all';
let pitfallSearchQuery = '';

function renderPitfallsList() {
    const container = document.getElementById('pitfalls-container');
    const tagsContainer = document.getElementById('pitfall-tag-filters');
    if (!container) return;
    container.innerHTML = '';

    // 提取所有唯一 tags
    const allTags = new Set(['all']);
    appState.pitfalls.forEach(p => {
        (p.keywords || []).forEach(k => allTags.add(k.trim().toLowerCase()));
    });

    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        allTags.forEach(tag => {
            const btn = document.createElement('button');
            btn.className = `px-2.5 py-1 rounded-lg text-xs font-serifMono font-bold transition whitespace-nowrap ${
                pitfallFilterTag === tag ? 'bg-rose-600 text-white shadow-xs' : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`;
            btn.innerText = tag === 'all' ? '全部标签' : `#${tag}`;
            btn.onclick = () => {
                pitfallFilterTag = tag;
                renderPitfallsList();
            };
            tagsContainer.appendChild(btn);
        });
    }

    const filtered = appState.pitfalls.filter(item => {
        if (pitfallFilterTag !== 'all') {
            const hasTag = (item.keywords || []).some(k => k.trim().toLowerCase() === pitfallFilterTag);
            if (!hasTag) return false;
        }

        if (pitfallSearchQuery.trim() !== "") {
            const q = pitfallSearchQuery.toLowerCase();
            const matchTitle = item.title.toLowerCase().includes(q);
            const matchSym = item.errorSymptom.toLowerCase().includes(q);
            const matchCause = item.errorCause.toLowerCase().includes(q);
            if (!matchTitle && !matchSym && !matchCause) return false;
        }
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="p-12 text-center text-stone-400 bg-white rounded-2xl border border-stone-200 font-serifHeading">
                <i class="fa-solid fa-shield-halved text-4xl mb-3 text-stone-300"></i>
                <p class="text-sm">没有匹配的踩坑记录</p>
            </div>
        `;
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 academic-card space-y-3.5 font-serifHeading";

        const tagsHtml = (p.keywords || []).map(k => `
            <span class="bg-rose-50 text-rose-800 border border-rose-200 text-[10.5px] px-2 py-0.5 rounded font-serifMono">#${escapeHtml(k)}</span>
        `).join(' ');

        card.innerHTML = `
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                <div>
                    <span class="text-[10.5px] font-serifMono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 mr-2">DAY ${p.day}</span>
                    <h3 class="text-base font-bold text-stone-900 inline font-serif-heading">${escapeHtml(p.title)}</h3>
                </div>
                <div class="flex items-center gap-1.5">${tagsHtml}</div>
            </div>

            <!-- 现象与根因 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                <div class="bg-rose-50/50 p-3 rounded-xl border border-rose-200/60">
                    <strong class="text-rose-900 font-serifMono flex items-center gap-1 mb-1">
                        <i class="fa-solid fa-triangle-exclamation text-rose-600"></i> 错误现象与报错:
                    </strong>
                    <p class="text-stone-700 text-[11.5px]">${escapeHtml(p.errorSymptom)}</p>
                </div>
                <div class="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
                    <strong class="text-amber-900 font-serifMono flex items-center gap-1 mb-1">
                        <i class="fa-solid fa-magnifying-glass text-amber-600"></i> 根因剖析:
                    </strong>
                    <p class="text-stone-700 text-[11.5px]">${escapeHtml(p.errorCause)}</p>
                </div>
            </div>

            <!-- 错误代码 vs 正确代码对比 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div class="border border-rose-200 rounded-xl p-3 bg-stone-50">
                    <div class="text-[11px] font-bold text-rose-700 font-serifMono mb-1.5 flex items-center gap-1">
                        <i class="fa-solid fa-xmark"></i> 典型错误写法
                    </div>
                    <pre class="m-0 p-0 overflow-x-auto"><code class="language-cpp font-mono-code">${escapeHtml(p.errorCode)}</code></pre>
                </div>
                <div class="border border-emerald-200 rounded-xl p-3 bg-stone-50">
                    <div class="text-[11px] font-bold text-emerald-700 font-serifMono mb-1.5 flex items-center gap-1">
                        <i class="fa-solid fa-check"></i> 标准解法与实现
                    </div>
                    <pre class="m-0 p-0 overflow-x-auto"><code class="language-cpp font-mono-code">${escapeHtml(p.correctCode)}</code></pre>
                </div>
            </div>

            <!-- 工程结论 -->
            <div class="p-2.5 rounded-xl bg-stone-100 border border-stone-200/80 text-xs font-bold text-stone-800 font-serifMono">
                ${escapeHtml(p.conclusion)}
            </div>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('#pitfalls-container pre code').forEach(el => hljs.highlightElement(el));
}

function applyPitfallFilters() {
    pitfallSearchQuery = document.getElementById('pitfall-search-input')?.value || "";
    renderPitfallsList();
}

function openNewPitfallModal() {
    document.getElementById('new-pitfall-modal')?.classList.remove('hidden');
}

function closeNewPitfallModal() {
    document.getElementById('new-pitfall-modal')?.classList.add('hidden');
}

function submitNewPitfall() {
    const title = document.getElementById('np-title')?.value.trim();
    const day = parseInt(document.getElementById('np-day')?.value || '1');
    const keywordsStr = document.getElementById('np-keywords')?.value.trim();
    const errorCode = document.getElementById('np-error-code')?.value.trim();
    const symptom = document.getElementById('np-symptom')?.value.trim();
    const cause = document.getElementById('np-cause')?.value.trim();
    const correctCode = document.getElementById('np-correct-code')?.value.trim();
    const conclusion = document.getElementById('np-conclusion')?.value.trim();

    if (!title || !errorCode || !correctCode) {
        showToast("请填写完整的标题、错误代码与正确解法", false);
        return;
    }

    const keywords = keywordsStr ? keywordsStr.split(/[,，]/).map(k => k.trim()) : ["自定义"];

    appState.pitfalls.unshift({
        id: 'p_custom_' + Date.now(),
        title,
        date: getTodayDateStr(),
        day,
        keywords,
        errorCode,
        errorSymptom: symptom || "运行报错或非预期输出",
        errorCause: cause || "未遵循规范的内存或对象生命周期管理",
        correctCode,
        conclusion: conclusion || "【工程铁律】严谨遵循现代 C++ 资源安全规范"
    });

    persistState();
    closeNewPitfallModal();
        closeEnvGuideModal();
    renderPitfallsList();
    showToast("新踩坑事故已存入档案！");
}

// 拓扑图点击抽屉 (Topology Drawer)
const TOPOLOGY_DRAWER_DATA = {
    step_1: { title: "const & 引用传参", tag: "C++ 基础特性", role: "引用传递入参，避免对象拷贝开销，并保证入参只读安全性。", members: ["const T&: 常量引用，避免拷贝", "右值引用绑定延长临时对象生存期"], functions: ["void handle(const Buffer& buf)", "void send(const string& msg)"], relatedDays: [1] },
    step_2: { title: "类 / 析构自动化 / RAII", tag: "C++ 基础特性", role: "基于 RAII 将资源生命周期与对象作用域绑定，在离开作用域时释放互斥锁或关闭文件描述符。", members: ["explicit MutexGuard(Mutex& m)", "~MutexGuard(): 离开作用域自动解锁"], functions: ["Socket::~Socket(): 自动 close(sockfd_)"], relatedDays: [2, 3] },
    step_3: { title: "移动语义 / =delete", tag: "C++ 基础特性", role: "右值引用转移资源所有权以避免深拷贝；=delete 显式禁用拷贝构造函数与赋值操作符。", members: ["T(T&& rhs) noexcept", "noncopyable(const noncopyable&) = delete"], functions: ["std::move(cb): 转移回调函数所有权"], relatedDays: [6, 7] },
    step_4: { title: "智能指针体系", tag: "C++ 基础特性", role: "unique_ptr 管理独占所有权、shared_ptr 管理共享引用计数、weak_ptr 避免循环引用并作为弱观察指针。", members: ["unique_ptr<Poller>", "shared_ptr<TcpConnection>", "weak_ptr<void> tie_"], functions: ["weak_ptr::lock(): 原子尝试获取 shared_ptr"], relatedDays: [8, 9, 10] },
    step_5: { title: "STL 连续与关联容器", tag: "C++ 基础特性", role: "vector<char> 提供连续内存缓冲区；map 或 unordered_map 用于连接对象的索引与管理。", members: ["vector<char> buffer_", "map<string, TcpConnectionPtr> conns_"], functions: ["vector::resize()", "map::find()"], relatedDays: [11, 13] },
    step_6: { title: "std::function & Lambda", tag: "C++ 基础特性", role: "使用类型擦除封装可调用实体，配合 Lambda 表达式捕获执行上下文，支持通用回调。", members: ["std::function<void(Timestamp)>", "[this]() { doWork(); }"], functions: ["invoke()", "operator()()"], relatedDays: [17, 18] },
    step_7: { title: "std::bind 绑定类成员", tag: "C++ 基础特性", role: "将类成员函数与对象实例指针绑定，转化为符合标准签名的回调函数对象。", members: ["std::bind(&TcpServer::newConnection, this, _1, _2)"], functions: ["placeholders::_1 占位符绑定形参"], relatedDays: [19, 20] },
    step_8: { title: "模板基础 / 虚析构", tag: "C++ 基础特性", role: "使用模板定义通用队列类；基类虚析构函数确保通过基类指针销毁派生类对象时正确调用析构。", members: ["template<typename T> class BlockingQueue", "virtual ~Poller() = default"], functions: ["虚函数表动态分发"], relatedDays: [25, 26] },
    mutexlockguard: { title: "MutexLockGuard", tag: "并发同步", role: "RAII 互斥锁包装类，构造时执行 lock()，析构时自动执行 unlock()，避免分支返回时遗漏解锁。", members: ["MutexLock& mutex_: 绑定的互斥锁引用"], functions: ["explicit MutexLockGuard(MutexLock& m)", "~MutexLockGuard()"], relatedDays: [3] },
    callbacks: {
        title: "Callbacks 回调机制",
        tag: "回调接口",
        role: "基于 std::function 与 std::bind 实现事件回调机制，将网络事件分发与具体业务逻辑解耦，避免虚函数继承开销。",
        members: [
            "typedef std::function<void(const TcpConnectionPtr&)> ConnectionCallback",
            "typedef std::function<void(const TcpConnectionPtr&, Buffer*, Timestamp)> MessageCallback",
            "typedef std::function<void(const TcpConnectionPtr&)> CloseCallback"
        ],
        functions: [
            "void setConnectionCallback(const ConnectionCallback& cb)",
            "void setMessageCallback(const MessageCallback& cb)",
            "void setWriteCompleteCallback(const WriteCompleteCallback& cb)"
        ],
        relatedDays: [17, 18, 19]
    },
    eventloop: { title: "EventLoop", tag: "事件循环", role: "One Loop Per Thread 核心实现。在独立 I/O 线程中循环调用 Poller::poll 处理就绪事件，并通过 eventfd 实现跨线程任务通知。", members: ["unique_ptr<Poller> poller_: I/O 多路复用器", "int wakeupFd_: 跨线程唤醒 eventfd 句柄", "vector<Functor> pendingFunctors_: 跨线程投递任务队列", "MutexLock mutex_: 保护任务队列的互斥锁"], functions: ["void loop(): 事件循环主逻辑", "void runInLoop(Functor cb): 当前线程直接执行或投递执行", "void queueInLoop(Functor cb): 写入队列并唤醒事件循环", "void wakeup(): 向 wakeupFd 写入 8 字节唤醒 poll"], relatedDays: [6, 8, 18, 21] },
    poller: { title: "Poller / EPollPoller", tag: "I/O 多路复用", role: "抽象 epoll/poll 操作，调用 epoll_wait 阻塞监听注册的套接字描述符，并将发生事件的 Channel 填入 activeChannels 供 EventLoop 派发。", members: ["EventLoop* ownerLoop_: 所属事件循环", "map<int, Channel*> channels_: 按 fd 映射管理的通道索引", "struct epoll_event events_[]: 内核事件接收缓冲区"], functions: ["virtual ~Poller() = default: 虚析构声明", "virtual Timestamp poll(int timeout, ChannelList* activeChannels) = 0", "virtual void updateChannel(Channel* c) = 0", "virtual void removeChannel(Channel* c) = 0"], relatedDays: [8, 13, 26] },
    channel: { title: "Channel", tag: "事件通道", role: "封装单个文件描述符及其关心的 I/O 事件，在事件就绪时调用已注册的读写回调函数。", members: ["const int fd_: 绑定的套接字描述符", "EventLoop* loop_: 所属事件循环", "int events_: 关心的事件掩码", "int revents_: 实际就绪的事件掩码", "weak_ptr<void> tie_: 弱引用绑定宿主对象"], functions: ["void tie(const shared_ptr<void>&)", "void enableReading(): events_ |= POLLIN; update()", "void handleEvent(Timestamp receiveTime)"], relatedDays: [1, 10, 18, 19] },
    handleeventwithguard: { title: "Channel::handleEventWithGuard", tag: "生命周期保护", role: "事件分发处理逻辑。通过 tie_.lock() 尝试获取宿主对象的 shared_ptr，确认对象存活后执行回调，避免析构后野指针访问。", members: ["std::shared_ptr<void> guard = tie_.lock()", "ReadEventCallback readCallback_", "EventCallback writeCallback_"], functions: ["if (guard) { readCallback_(receiveTime); }"], relatedDays: [10, 18] },
    tcpserver: { title: "TcpServer", tag: "TCP 服务管理", role: "管理 TCP 服务端生命周期与连接集合。通过 Acceptor 接收新连接，分发至 EventLoop 线程并以 map 维护活跃连接。", members: ["unique_ptr<Acceptor> acceptor_: 监听新建连接", "map<string, TcpConnectionPtr> connections_: 连接映射表", "EventLoopThreadPool threadPool_: 事件循环线程池"], functions: ["void setThreadNum(int)", "void start()", "void newConnection(int sockfd, const InetAddress&)", "void removeConnection(const TcpConnectionPtr&)"], relatedDays: [9, 13, 14, 19] },
    tcpconnection: { title: "TcpConnection", tag: "TCP 连接", role: "代表已建立的 TCP 连接对象。继承 enable_shared_from_this 管理自身生命周期，持有 Channel、Socket 以及输入输出 Buffer。", members: ["shared_ptr<TcpConnection>", "unique_ptr<Socket> socket_", "unique_ptr<Channel> channel_", "Buffer inputBuffer_, outputBuffer_"], functions: ["void send(const string&)", "void shutdown()", "void handleRead()", "void handleWrite()"], relatedDays: [9, 10, 14, 18, 19] },
    buffer: { title: "Buffer", tag: "应用层缓冲区", role: "应用层缓冲区。基于 vector<char> 连续内存组织，通过 readerIndex 与 writerIndex 游标管理可读写区域，配合 readv 接收套接字数据。", members: ["vector<char> buffer_", "size_t readerIndex_, writerIndex_", "static const size_t kCheapPrepend = 8"], functions: ["size_t readableBytes() const", "void retrieve(size_t)", "void append(const char*, size_t)", "ssize_t readFd(int fd, int* savedErrno)"], relatedDays: [2, 6, 11, 23] },
    client: { title: "Client 外部客户端", tag: "网络接入", role: "发起 TCP 长连接或 HTTP 请求，接收服务端流式事件或模型响应。", members: ["TcpClient / HttpClient 客户端连接句柄"], functions: ["void connect()", "void send(req)", "void onMessage(resp)"], relatedDays: [1, 5, 9] },
    linux_epoll: { title: "Linux 内核 epoll", tag: "内核 I/O 复用", role: "Linux 内核 I/O 多路复用机制。以红黑树维护监控文件描述符，以就绪链表返回触发的 I/O 事件。", members: ["epoll_event 内核事件结构体", "eventpoll 内核数据结构"], functions: ["epoll_create1(EPOLL_CLOEXEC)", "epoll_ctl(epfd, op, fd, event)", "epoll_wait(epfd, events, maxevents, timeout)"], relatedDays: [8, 13, 26] },
    chatserver: { title: "ChatServer 业务服务", tag: "业务调度服务", role: "处理 HTTP 请求分发，维护用户与会话映射，调用模型策略接口并将消息投递至 RabbitMQ 异步写入。", members: ["chatInformation[userId][sessionId]", "sessionsIdsMap[userId]", "MQManager rabbitmq_"], functions: ["void initialize()", "void initChatMessage()", "void packageResp()"], relatedDays: [14, 19, 28] },
    rag: { title: "RAG 检索增强", tag: "知识检索", role: "知识库文本向量检索。在调用大模型前检索匹配片段并追加至上下文，降低生成偏差。", members: ["AliyunRAGStrategy ragStrategy_", "Knowledge_Base_ID 知识库凭据"], functions: ["json buildRequest(messages)", "string parseResponse(json)"], relatedDays: [27, 28] }
};

function openTopologyDrawer(nodeId) {
    if (!nodeId) return;

    // 别名映射与规范化
    const ALIAS_MAP = {
        'eventloop': 'mod_net_eventloop',
        'channel': 'mod_net_channel',
        'poller': 'mod_net_poller',
        'buffer': 'mod_net_buffer',
        'tcpserver': 'mod_net_tcpserver',
        'tcpconnection': 'mod_net_tcpconnection',
        'handleeventwithguard': 'mod_net_channel',
        'client': 'mod_net_client',
        'mod_client': 'mod_net_client',
        'linux_epoll': 'mod_kernel_epoll',
        'epoll': 'mod_kernel_epoll',
        'chatserver': 'mod_ai_chatserver',
        'rag': 'mod_ai_rag'
    };
    const effectiveId = ALIAS_MAP[nodeId] || nodeId;

    const modules = getDomainModulesDataset();
    const knowledgeList = getDomainKnowledgeDataset();
    const pitfallsList = getDomainPitfallsDataset();
    const yuqueArticles = getYuqueDataset();

    const mod = modules.find(m => m.id === effectiveId);
    const legacy = TOPOLOGY_DRAWER_DATA[nodeId];

    const drawerTag = document.getElementById('drawer-tag');
    const drawerTitle = document.getElementById('drawer-title');
    const content = document.getElementById('drawer-content');
    if (!content) return;

    if (mod) {
        const isMuduo = mod.projectId === 'proj_muduo';
        if (drawerTag) {
            drawerTag.innerText = `${isMuduo ? 'muduo 网络核心' : 'CppAIService 服务层'} · ${mod.layer}`;
            drawerTag.className = isMuduo
                ? "text-[10px] font-serifMono uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold"
                : "text-[10px] font-serifMono uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold";
        }
        if (drawerTitle) {
            drawerTitle.innerText = mod.name;
        }

        // 查找对应的知识节点
        const kn = knowledgeList.find(k => k.moduleId === effectiveId);

        // 收集源码文件列表
        const sourceFilesHtml = (mod.sourceFiles || []).map(f => `
            <li class="font-mono-code text-[11px] text-stone-800 bg-stone-50 p-2 rounded-lg border border-stone-200/90 flex items-center justify-between gap-2">
                <span class="flex items-center gap-1.5 truncate">
                    <i class="fa-regular fa-file-code ${isMuduo ? 'text-sky-700' : 'text-amber-700'}"></i>
                    <span class="truncate">${escapeHtml(f)}</span>
                </span>
                <span class="text-[10px] text-stone-400 font-serifMono shrink-0">${f.endsWith('.h') ? '头文件' : '源文件'}</span>
            </li>
        `).join('');

        // 收集核心类与接口
        const classesHtml = (mod.classes || []).map(c => `
            <span class="px-2 py-0.5 bg-stone-100 text-stone-800 rounded font-mono-code text-[11px] border border-stone-200">
                class ${escapeHtml(c)}
            </span>
        `).join(' ');

        const funcsHtml = (mod.functions || []).map(f => `
            <li class="font-mono-code text-[11px] ${isMuduo ? 'text-sky-950 bg-sky-50/70 border-sky-200' : 'text-amber-950 bg-amber-50/70 border-amber-200'} p-1.5 rounded border flex items-center gap-1.5">
                <i class="fa-solid fa-code text-[10px] ${isMuduo ? 'text-sky-600' : 'text-amber-600'}"></i>
                <span>${escapeHtml(f)}</span>
            </li>
        `).join('');

        // 收集关键概念
        const conceptsHtml = (mod.keyConcepts || []).map(cp => `
            <span class="px-2 py-0.5 rounded-full ${isMuduo ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-amber-50 text-amber-800 border border-amber-200'} text-[10px] font-serifMono font-semibold">
                # ${escapeHtml(cp)}
            </span>
        `).join(' ');

        // 关联 muduo Days
        let days = [];
        if (kn && Array.isArray(kn.muduoDays)) {
            days = kn.muduoDays;
        } else if (legacy && Array.isArray(legacy.relatedDays)) {
            days = legacy.relatedDays;
        }
        const daysButtonsHtml = days.length > 0 ? days.map(d => `
            <button onclick="closeTopologyDrawer(); scrollToDay(${d});" class="px-2.5 py-1 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded-lg text-xs font-serifMono font-bold transition flex items-center gap-1 cursor-pointer">
                <i class="fa-solid fa-calendar-check text-sky-700"></i> Day ${d < 10 ? '0' + d : d} 任务卡片 ➔
            </button>
        `).join(' ') : '<span class="text-stone-400 text-xs">底层网络公共模块</span>';

        // 关联 CppAIService 专栏文章
        let relatedArticles = [];
        if (kn && Array.isArray(kn.yuqueDocIds)) {
            kn.yuqueDocIds.forEach(idOrSlug => {
                const found = yuqueArticles.find(a => a.id === idOrSlug || a.slug === idOrSlug);
                if (found) relatedArticles.push(found);
            });
        }
        if (relatedArticles.length === 0 && !isMuduo) {
            // 根据分类模糊匹配
            relatedArticles = yuqueArticles.filter(a => (a.category && a.category === mod.category) || (a.title && a.title.includes(mod.name.slice(0, 4)))).slice(0, 3);
        }
        const yuqueButtonsHtml = relatedArticles.length > 0 ? relatedArticles.map(art => `
            <button onclick="closeTopologyDrawer(); openYuqueArticle('${art.slug || art.id}');" class="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-serifMono font-bold transition flex items-center gap-1.5 cursor-pointer text-left truncate max-w-full">
                <i class="fa-solid fa-book-bookmark text-amber-700 shrink-0"></i>
                <span class="truncate">${escapeHtml(art.title)} ➔</span>
            </button>
        `).join(' ') : (isMuduo ? '<span class="text-stone-400 text-xs">底层 Reactor 网络基础设施 (无直接应用专栏)</span>' : '<span class="text-stone-400 text-xs">暂无关联专栏</span>');

        // 高频面试考点与避坑指南
        let interviewBoxHtml = '';
        if (kn && kn.interviewTrap) {
            interviewBoxHtml = `
                <div class="bg-rose-50/80 p-3 rounded-xl border border-rose-200">
                    <div class="text-[11px] font-bold font-serifMono text-rose-800 mb-1 flex items-center gap-1.5">
                        <i class="fa-solid fa-triangle-exclamation text-rose-600"></i> 高频面试深度考点:
                    </div>
                    <p class="text-rose-900 text-xs leading-relaxed font-medium">
                        ${escapeHtml(kn.interviewTrap)}
                    </p>
                </div>
            `;
        }

        // 关联生产事故避坑
        const relatedPitfalls = pitfallsList.filter(p => {
            if (p.project && p.project !== mod.projectId) return false;
            return p.category === mod.category || p.id.includes(mod.id.replace('mod_', ''));
        });
        let pitfallBoxHtml = '';
        if (relatedPitfalls.length > 0) {
            const pit = relatedPitfalls[0];
            pitfallBoxHtml = `
                <div class="bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                    <div class="text-[11px] font-bold font-serifMono text-amber-900 mb-1 flex items-center gap-1.5">
                        <i class="fa-solid fa-shield-cat text-amber-700"></i> 生产避坑铁律:
                    </div>
                    <div class="text-xs font-bold text-stone-900 mb-1">${escapeHtml(pit.title)}</div>
                    <p class="text-stone-700 text-xs leading-relaxed mb-2">${escapeHtml(pit.rootCause)}</p>
                    <div class="text-[11px] font-serifMono font-bold text-amber-800 bg-white/80 p-2 rounded border border-amber-200">
                        ⚡ 铁律：${escapeHtml(pit.ironRule)}
                    </div>
                </div>
            `;
        }

        content.innerHTML = `
            <!-- 核心工程职责 -->
            <div class="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div class="text-[11px] font-bold font-serifMono text-stone-500 mb-1 flex items-center gap-1">
                    <i class="fa-solid fa-bullseye text-stone-600"></i> 核心工程职责:
                </div>
                <p class="text-stone-800 text-xs leading-relaxed font-medium">${escapeHtml(mod.desc)}</p>
            </div>

            <!-- 并发与线程安全模型 -->
            <div class="bg-indigo-50/60 p-3 rounded-xl border border-indigo-200">
                <div class="text-[11px] font-bold font-serifMono text-indigo-900 mb-1 flex items-center gap-1.5">
                    <i class="fa-solid fa-shield-halved text-indigo-700"></i> 并发与线程安全模型:
                </div>
                <p class="text-indigo-950 text-xs leading-relaxed font-mono-code">${escapeHtml(mod.threadModel)}</p>
            </div>

            <!-- 核心概念与关键机制 -->
            <div>
                <div class="text-[11px] font-bold font-serifMono text-stone-500 mb-1.5">
                    <i class="fa-solid fa-tags text-teal-700 mr-1"></i>核心概念与关键机制:
                </div>
                <div class="flex flex-wrap gap-1.5">${conceptsHtml}</div>
            </div>

            <!-- 真实源码文件路径 -->
            <div>
                <div class="text-[11px] font-bold font-serifMono text-stone-500 mb-1.5">
                    <i class="fa-solid fa-folder-tree text-stone-700 mr-1"></i>真实项目源码落地路径:
                </div>
                <ul class="space-y-1.5">${sourceFilesHtml}</ul>
            </div>

            <!-- 核心类与关键接口 -->
            <div>
                <div class="text-[11px] font-bold font-serifMono text-stone-500 mb-1.5">
                    <i class="fa-solid fa-cube text-sky-700 mr-1"></i>核心类与关键接口:
                </div>
                <div class="mb-2 flex flex-wrap gap-1">${classesHtml}</div>
                <ul class="space-y-1">${funcsHtml}</ul>
            </div>

            ${interviewBoxHtml}
            ${pitfallBoxHtml}

            <!-- 双向直达学习任务与专栏 -->
            <div class="pt-4 border-t border-stone-200 space-y-3">
                <div>
                    <div class="text-[11px] font-bold font-serifMono text-stone-500 mb-2 flex items-center gap-1">
                        <i class="fa-solid fa-calendar-check text-sky-700"></i> 直达对应 28 天现代 C++ 任务:
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">${daysButtonsHtml}</div>
                </div>
                <div>
                    <div class="text-[11px] font-bold font-serifMono text-stone-500 mb-2 flex items-center gap-1">
                        <i class="fa-solid fa-book-bookmark text-amber-700"></i> 直达 CppAIService 深度专栏:
                    </div>
                    <div class="flex flex-col gap-1.5">${yuqueButtonsHtml}</div>
                </div>
            </div>
        `;
    } else if (legacy) {
        // Legacy 回退 (step_1~step_8 等旧节点)
        if (drawerTag) {
            drawerTag.innerText = legacy.tag;
            drawerTag.className = "text-[10px] font-serifMono uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold";
        }
        if (drawerTitle) {
            drawerTitle.innerText = legacy.title;
        }

        let daysHtml = (legacy.relatedDays || []).map(d => `
            <button onclick="closeTopologyDrawer(); scrollToDay(${d});" class="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-serifMono font-bold transition flex items-center gap-1 cursor-pointer">
                <i class="fa-solid fa-calendar-check text-amber-700"></i> Day ${d < 10 ? '0' + d : d} 任务卡片 ➔
            </button>
        `).join(' ');

        let membersHtml = (legacy.members || []).map(m => `
            <li class="font-mono-code text-[11px] text-stone-700 bg-stone-50 p-2 rounded border border-stone-200">${escapeHtml(m)}</li>
        `).join('');

        let funcsHtml = (legacy.functions || []).map(f => `
            <li class="font-mono-code text-[11px] text-sky-900 bg-sky-50/60 p-2 rounded border border-sky-200">${escapeHtml(f)}</li>
        `).join('');

        content.innerHTML = `
            <div class="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div class="text-[11px] font-bold font-serifMono text-stone-500 mb-1">核心工程职责:</div>
                <p class="text-stone-800 text-xs leading-relaxed">${escapeHtml(legacy.role)}</p>
            </div>

            <div>
                <div class="text-[11px] font-bold font-serifMono text-stone-500 mb-1.5">
                    <i class="fa-solid fa-cube text-teal-700 mr-1"></i>关键成员与所有权:
                </div>
                <ul class="space-y-1.5">${membersHtml}</ul>
            </div>

            <div>
                <div class="text-[11px] font-bold font-serifMono text-stone-500 mb-1.5">
                    <i class="fa-solid fa-bolt text-sky-700 mr-1"></i>核心函数与调用逻辑:
                </div>
                <ul class="space-y-1.5">${funcsHtml}</ul>
            </div>

            <div class="pt-3 border-t border-stone-200">
                <div class="text-[11px] font-bold font-serifMono text-stone-500 mb-2">直达对应现代 C++ 学习任务:</div>
                <div class="flex items-center gap-2 flex-wrap">${daysHtml}</div>
            </div>
        `;
    } else {
        console.warn(`[openTopologyDrawer] Fallback for node ID: ${nodeId}`);
        if (drawerTag) {
            drawerTag.innerText = "双核架构组件";
            drawerTag.className = "text-[10px] font-serifMono uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-bold";
        }
        if (drawerTitle) {
            drawerTitle.innerText = nodeId.replace(/^mod_/, '').toUpperCase();
        }
        content.innerHTML = `
            <div class="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div class="text-[11px] font-bold font-serifMono text-stone-500 mb-1">系统核心拓扑组件:</div>
                <p class="text-stone-800 text-xs leading-relaxed">该组件属于系统架构的一部分，负责对应的网络通信或服务调用功能。</p>
            </div>
        `;
    }

    document.getElementById('topology-drawer')?.classList.remove('translate-x-full');
    document.getElementById('drawer-overlay')?.classList.remove('hidden');
}

function closeTopologyDrawer() {
    document.getElementById('topology-drawer')?.classList.add('translate-x-full');
    document.getElementById('drawer-overlay')?.classList.add('hidden');
}

// 艾宾浩斯复习模态框 (Spaced Review Modal)
let activeReviewDayNum = null;

function openReviewModal(dayNum = null) {
    const today = getTodayDateStr();

    if (!dayNum) {
        // 查找第一个到期的任务
        for (let d = 1; d <= 28; d++) {
            const r = appState.reviews[d];
            if (r && r.nextReviewDate && r.nextReviewDate <= today) {
                dayNum = d;
                break;
            }
        }
    }

    if (!dayNum) {
        // 若无到期任务，选择第一个已学任务供温故
        for (let d = 1; d <= 28; d++) {
            if (appState.mastery[d] && appState.mastery[d].level >= 1) {
                dayNum = d;
                break;
            }
        }
    }

    if (!dayNum) {
        showToast("暂无复习项，请先学习并完成至少 1 天的任务", false);
        return;
    }

    activeReviewDayNum = dayNum;
    const item = DAYS_DATASET.find(d => d.day === dayNum);
    if (!item) return;

    const r = appState.reviews[dayNum] || { stage: 0, intervalDays: 1 };
    const modal = document.getElementById('review-modal');
    const content = document.getElementById('review-card-content');
    const title = document.getElementById('review-modal-title');
    const btnReveal = document.getElementById('btn-reveal-review');
    const actionBtns = document.getElementById('review-action-buttons');

    if (!modal || !content) return;

    title.innerText = `Day ${item.day < 10 ? '0' + item.day : item.day}: ${item.title}`;
    btnReveal.classList.remove('hidden');
    actionBtns.classList.add('hidden');

    content.innerHTML = `
        <div class="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
            <div class="flex items-center justify-between text-[11px] font-serifMono text-amber-900 font-bold mb-1">
                <span>RECALL FLASHCARD</span>
                <span>复习阶段: Stage ${r.stage || 0} (${r.intervalDays || 1}d)</span>
            </div>
            <p class="text-stone-800 text-xs leading-relaxed font-bold mt-1">
                ${escapeHtml(item.check)}
            </p>
            <p class="text-[11.5px] text-stone-600 mt-2">
                思考要点：回忆该 C++ 特性的物理底层实现（指针/虚表/内存分配），常见未定义陷阱是什么？muduo 架构中对应哪个类？
            </p>
        </div>

        <div id="review-hidden-answer" class="hidden space-y-2.5 pt-2">
            <div class="bg-sky-50 p-3 rounded-xl border border-sky-200 text-xs text-stone-700 leading-relaxed">
                <strong class="text-sky-900 font-serifMono">规范表述：</strong>
                <p class="mt-0.5">${escapeHtml(item.rigorousNuance?.strict || "")}</p>
            </div>
            <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-stone-700 leading-relaxed">
                <strong class="text-emerald-900 font-serifMono">muduo 源码应用：</strong>
                <p class="mt-0.5 font-mono-code text-[11px]">${escapeHtml(item.muduoMap)}</p>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function revealReviewAnswer() {
    document.getElementById('review-hidden-answer')?.classList.remove('hidden');
    document.getElementById('btn-reveal-review')?.classList.add('hidden');
    document.getElementById('review-action-buttons')?.classList.remove('hidden');
}

function recordReviewResult(result) {
    if (!activeReviewDayNum) return;
    const dayNum = activeReviewDayNum;

    if (!appState.reviews[dayNum]) {
        appState.reviews[dayNum] = { stage: 0, nextReviewDate: '', lastReviewDate: '', intervalDays: 1, reviewCount: 0, history: [] };
    }
    const r = appState.reviews[dayNum];
    const stages = [1, 3, 7, 14, 30]; // 艾宾浩斯间隔天数

    if (result === 'forgot') {
        r.stage = 0;
        r.intervalDays = 1;
    } else if (result === 'fuzzy') {
        // 维持当前间隔
        r.intervalDays = stages[r.stage] || 1;
    } else if (result === 'mastered') {
        r.stage = Math.min(r.stage + 1, 4);
        r.intervalDays = stages[r.stage];
    }

    r.lastReviewDate = getTodayDateStr();
    r.nextReviewDate = getFutureDateStr(r.intervalDays);
    r.reviewCount = (r.reviewCount || 0) + 1;
    if (!r.history) r.history = [];
    r.history.push({ date: getTodayDateStr(), result: result, interval: r.intervalDays });

    // 记录 5 分钟复习学习时间
    appState.studySessions.push({
        id: Date.now(),
        date: getTodayDateStr(),
        time: new Date().toLocaleTimeString().slice(0, 5),
        day: dayNum,
        duration: 5,
        type: 'review',
        note: `完成 Day ${dayNum} 间隔复习 (${result})`
    });

    persistState();
    updateDashboardMetrics();
    closeReviewModal();

    showToast(`Day ${dayNum} 复习完成，下次复习安排在 ${r.nextReviewDate} (${r.intervalDays}天后)`);
}

function closeReviewModal() {
    document.getElementById('review-modal')?.classList.add('hidden');
    activeReviewDayNum = null;
}

// 通用 Modal
let modalAction = null;
function openModal(title, msg, onConfirm) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = msg;
    modalAction = onConfirm;
    document.getElementById('custom-modal')?.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('custom-modal')?.classList.add('hidden');
    modalAction = null;
}

document.getElementById('modal-confirm-btn')?.addEventListener('click', () => {
    if (modalAction) modalAction();
    closeModal();
});

function openResetModal() {
    openModal("重置所有学习系统数据", "确定清空 28 天所有打卡等级、自测记录、专注统计与手记吗？此操作不可逆，请提前备份 JSON。", () => {
        appState.completedDays = [];
        appState.mastery = {};
        appState.reviews = {};
        appState.sourceStatus = {};
        appState.pitfalls = [...getPitfallsDataset()];
        appState.studySessions = [];
        appState.dayNotes = {};
        appState.experimentNotes = {};
        appState.globalNotes = "";
        appState.knowledgeMastery = {};
        appState.knowledgeFavorites = [];
        appState.knowledgeRecent = [];
        if (typeof saveYuqueState === 'function') saveYuqueState();
        persistState();
        updateDashboardMetrics();
        renderDailyCards();
        const nbResetEl = document.getElementById('notebook-textarea');
        if (nbResetEl) nbResetEl.value = "";
        showToast("系统已重置为初始纯净状态");
    });
}

// 导入与导出 JSON (对接 StateManager V6 规范)
function exportDataBackup() {
    let exportedData;
    if (typeof StateManager !== 'undefined') {
        exportedData = StateManager.exportJson();
    } else {
        exportedData = {
            schema: "https://muduo-cppai-console.local/schema/v6.json",
            version: appState.version || "6.0.0",
            exportedAt: new Date().toISOString(),
            metadata: {
                completedDaysCount: (appState.completedDays || []).length,
                studySessionsCount: (appState.studySessions || []).length
            },
            payload: {
                completedDays: appState.completedDays,
                mastery: appState.mastery,
                reviews: appState.reviews,
                sourceStatus: appState.sourceStatus,
                pitfalls: appState.pitfalls,
                studySessions: appState.studySessions,
                dayNotes: appState.dayNotes,
                experimentNotes: appState.experimentNotes,
                globalNotes: appState.globalNotes,
                knowledgeMastery: appState.knowledgeMastery || {},
                knowledgeFavorites: appState.knowledgeFavorites || [],
                knowledgeRecent: appState.knowledgeRecent || []
            }
        };
    }
    const blob = new Blob([JSON.stringify(exportedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muduo_cppai_v6_backup_${getTodayDateStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("完整双核架构 JSON 备份文件已下载");
}

function handleJsonImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (!imported || typeof imported !== 'object') {
                showToast("非法 JSON 文件格式", false);
                return;
            }

            // Schema 验证：兼容 V6 payload 与扁平 V5/V4
            const payload = imported.payload || imported;
            const hasMastery = payload.mastery && typeof payload.mastery === 'object';
            const hasCompleted = Array.isArray(payload.completedDays);
            const hasCppai = payload.knowledgeMastery && typeof payload.knowledgeMastery === 'object';
            if (!hasMastery && !hasCompleted && !hasCppai) {
                showToast("导入失败：未通过 Schema 结构校验，缺少核心学习数据字段", false);
                return;
            }

            // 弹出自定义导入确认框：合并 vs 覆盖
            const msgEl = document.getElementById('modal-message');
            const btns = document.getElementById('modal-buttons-container');
            document.getElementById('modal-title').innerText = "双核系统 JSON 导入方式选择";
            msgEl.innerText = "请选择导入策略：【合并数据】将保留本地更高级别的掌握度与笔记；【完全覆盖】将完全替换本地所有进度。";
            
            btns.innerHTML = `
                <button onclick="closeModal()" class="px-3 py-1.5 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl hover:bg-stone-200 transition">取消</button>
                <button onclick="executeImportMerge(${escapeJsString(JSON.stringify(imported))})" class="px-3 py-1.5 bg-sky-700 text-white text-xs font-semibold rounded-xl hover:bg-sky-800 transition">合并数据</button>
                <button onclick="executeImportOverwrite(${escapeJsString(JSON.stringify(imported))})" class="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition">完全覆盖</button>
            `;

            document.getElementById('custom-modal')?.classList.remove('hidden');
        } catch(err) {
            showToast("JSON 解析异常: " + err.message, false);
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}

function executeImportMerge(imported) {
    closeModal();
    if (typeof StateManager !== 'undefined') {
        appState = StateManager.importJson(imported, 'merge');
        window.appState = appState;
    } else {
        const payload = imported.payload || imported;
        if (Array.isArray(payload.completedDays)) {
            appState.completedDays = [...new Set([...appState.completedDays, ...payload.completedDays])];
        }
        if (payload.mastery) {
            Object.keys(payload.mastery).forEach(k => {
                const oldLvl = appState.mastery[k]?.level || 0;
                const newLvl = payload.mastery[k]?.level || 0;
                if (newLvl >= oldLvl) appState.mastery[k] = payload.mastery[k];
            });
        }
        if (payload.dayNotes) appState.dayNotes = Object.assign(appState.dayNotes, payload.dayNotes);
        if (payload.experimentNotes) appState.experimentNotes = Object.assign(appState.experimentNotes, payload.experimentNotes);
        if (payload.globalNotes && !appState.globalNotes) appState.globalNotes = payload.globalNotes;
        if (Array.isArray(payload.pitfalls)) {
            const existIds = new Set(appState.pitfalls.map(p => p.id));
            payload.pitfalls.forEach(p => { if (!existIds.has(p.id)) appState.pitfalls.push(p); });
        }
        if (Array.isArray(payload.studySessions)) {
            const existSessIds = new Set(appState.studySessions.map(s => s.id));
            payload.studySessions.forEach(s => { if (!existSessIds.has(s.id)) appState.studySessions.push(s); });
        }
        if (payload.knowledgeMastery && typeof payload.knowledgeMastery === 'object') {
            if (!appState.knowledgeMastery) appState.knowledgeMastery = {};
            Object.keys(payload.knowledgeMastery).forEach(k => {
                const oldLvl = appState.knowledgeMastery[k] || 0;
                const newLvl = payload.knowledgeMastery[k] || 0;
                if (newLvl >= oldLvl) appState.knowledgeMastery[k] = newLvl;
            });
        }
        if (Array.isArray(payload.knowledgeFavorites)) {
            appState.knowledgeFavorites = [...new Set([...(appState.knowledgeFavorites || []), ...payload.knowledgeFavorites])];
        }
        if (Array.isArray(payload.knowledgeRecent)) {
            appState.knowledgeRecent = [...new Set([...(appState.knowledgeRecent || []), ...payload.knowledgeRecent])].slice(0, 10);
        }
        persistState();
    }

    if (typeof saveYuqueState === 'function') saveYuqueState();
    updateDashboardMetrics();
    renderDailyCards();
    if (typeof renderYuqueKnowledgeExplorer === 'function') {
        renderYuqueKnowledgeExplorer();
    }
    showToast("🎉 双核数据合并导入成功！");
}

function executeImportOverwrite(imported) {
    closeModal();
    if (typeof StateManager !== 'undefined') {
        appState = StateManager.importJson(imported, 'overwrite');
        window.appState = appState;
    } else {
        const payload = imported.payload || imported;
        appState.completedDays = payload.completedDays || [];
        appState.mastery = payload.mastery || {};
        appState.reviews = payload.reviews || {};
        appState.sourceStatus = payload.sourceStatus || {};
        appState.pitfalls = payload.pitfalls || [...getPitfallsDataset()];
        appState.studySessions = payload.studySessions || [];
        appState.dayNotes = payload.dayNotes || {};
        appState.experimentNotes = payload.experimentNotes || {};
        appState.globalNotes = payload.globalNotes || "";
        appState.knowledgeMastery = payload.knowledgeMastery || {};
        appState.knowledgeFavorites = payload.knowledgeFavorites || [];
        appState.knowledgeRecent = payload.knowledgeRecent || [];
        persistState();
    }

    if (typeof saveYuqueState === 'function') saveYuqueState();
    updateDashboardMetrics();
    renderDailyCards();
    if (typeof renderYuqueKnowledgeExplorer === 'function') {
        renderYuqueKnowledgeExplorer();
    }
    showToast("🎉 双核数据已完全覆盖导入！");
}

// 导出 Markdown 个人学习与实践档案
function exportMarkdownReport() {
    let md = `# CppAIService & muduo 学习与实践档案\n\n`;
    md += `> **生成时间**: ${new Date().toLocaleString()}  \n`;
    md += `> **系统架构**: CppAIService & muduo Console (V6.0.0)  \n\n`;

    const streak = calculateRealStreak();
    let totalMins = 0;
    (appState.studySessions || []).forEach(s => totalMins += (s.duration || 0));

    // 计算语雀掌握度统计
    const yqMastery = appState.knowledgeMastery || {};
    const masteredYqCount = Object.values(yqMastery).filter(lvl => lvl >= 3).length;
    const yqFavsCount = (appState.knowledgeFavorites || []).length;

    md += `## 一、双核工程综合战况总览\n\n`;
    md += `- **真实连续学习**: ${streak} 天\n`;
    md += `- **累计专注投入**: ${(totalMins / 60).toFixed(1)} 小时 (${totalMins} 分钟)\n`;
    md += `- **底层 muduo 任务进展**: ${appState.completedDays.length} / 28 天 (${((appState.completedDays.length / 28) * 100).toFixed(0)}%)\n`;
    md += `- **上层 CppAIService 专栏掌握**: ${masteredYqCount} / 17 篇 (熟练及以上，重点收藏: ${yqFavsCount} 篇)\n`;
    md += `- **生产避坑事故积累**: ${(appState.pitfalls || []).length} 条\n\n`;

    md += `## 二、muduo 底层网络库 28 天掌握度全景矩阵\n\n`;
    md += `| Day | 重点课题 | 掌握评级 | 自测表现 | Demo 状态 | 独立实现 | 源码理解 |\n`;
    md += `|:---:|:---|:---:|:---:|:---:|:---:|:---:|\n`;

    DAYS_DATASET.forEach(item => {
        const m = appState.mastery[item.day] || { level: 0 };
        const scoreStr = m.quizScores ? `${m.quizScores.overall}%` : '未测';
        const stars = "★".repeat(m.level || 0) + "☆".repeat(5 - (m.level || 0));
        md += `| Day ${item.day} | ${item.title} | L${m.level || 0} (${stars}) | ${scoreStr} | ${m.demo ? '✅ 跑通' : '❌ 未完'} | ${m.independentImpl ? '✅ 是' : '❌ 否'} | ${m.sourceUnderstood ? '✅ 是' : '❌ 否'} |\n`;
    });

    md += `\n## 三、CppAIService 17 篇核心专栏与微服务掌握画像\n\n`;
    md += `| 专栏编号 | 篇章课题 | 掌握评级 | 收藏状态 | 关联模块 |\n`;
    md += `|:---:|:---|:---:|:---:|:---|\n`;

    const yuqueArticles = getYuqueDataset();
    if (yuqueArticles && yuqueArticles.length > 0) {
        const favSet = new Set(appState.knowledgeFavorites || []);
        yuqueArticles.forEach(art => {
            const lvl = yqMastery[art.slug] || yqMastery[art.id] || 0;
            const isFav = favSet.has(art.slug) || favSet.has(art.id);
            const stars = "★".repeat(lvl) + "☆".repeat(5 - lvl);
            md += `| ${art.number || art.index || art.id} | ${art.title} | L${lvl} (${stars}) | ${isFav ? '⭐ 已收藏' : '-'} | ${art.linkedModule || '核心微服务'} |\n`;
        });
    } else {
        md += `| - | *专栏数据未加载* | - | - | - |\n`;
    }

    md += `\n## 四、每日手记与微实验心得\n\n`;
    let hasNotes = false;
    DAYS_DATASET.forEach(item => {
        const note = appState.dayNotes[item.day];
        const exp = appState.experimentNotes[item.day];
        if (note || exp) {
            hasNotes = true;
            md += `### Day ${item.day}: ${item.title}\n`;
            if (note) md += `- **个人手记**: ${note}\n`;
            if (exp) md += `- **实验输出记录**: ${exp}\n`;
            md += `\n`;
        }
    });
    if (!hasNotes) md += `*暂未记录每日手记*\n\n`;

    md += `## 五、muduo 8 阶核心源码研读进展\n\n`;
    getSourceRoadmap().forEach(node => {
        const s = appState.sourceStatus[node.id] || { status: '未读', notes: '' };
        md += `### ${node.name} (${node.layer})\n`;
        md += `- **研读状态**: ${s.status}\n`;
        md += `- **核心职责**: ${node.role}\n`;
        if (s.notes) md += `- **个人研读疑问/笔记**: ${s.notes}\n`;
        md += `\n`;
    });

    md += `## 六、双核工程避坑与生产事故档案\n\n`;
    (appState.pitfalls || []).forEach(p => {
        md += `### ${p.title} (${p.day ? 'Day ' + p.day : '生产事故'})\n`;
        md += `- **现象**: ${p.errorSymptom}\n`;
        md += `- **根因**: ${p.errorCause}\n`;
        md += `- **工程铁律**: ${p.conclusion}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `我的_双核工程学习档案_${getTodayDateStr()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("我的双核工程学习档案.md 已成功生成！");
}

// 全局键盘快捷键监听
document.addEventListener('keydown', (e) => {
    // 若用户正在输入文本，不触发单键快捷键
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

    if (e.key === 'Escape') {
        closeTopologyDrawer();
        closeReviewModal();
        closeModal();
        closeNewPitfallModal();
        if (typeof closeYuqueImageModal === 'function') closeYuqueImageModal();
        if (typeof toggleFloatingNav === 'function') toggleFloatingNav(false);
        return;
    }

    if (isInput) return;

    if (e.key === '1') switchView('dashboard');
    else if (e.key === '2') switchView('daily');
    else if (e.key === '3') switchView('mapping');
    else if (e.key === '4') switchView('quiz');
    else if (e.key === '5') switchView('source');
    else if (e.key === '6') switchView('pitfalls');
    else if (e.key === '7' || e.key === 'k' || e.key === 'K') switchView('knowledge');
    else if (e.key === '/') {
        e.preventDefault();
        switchView('daily');
        document.getElementById('search-input')?.focus();
    } else if (e.key === 'n' || e.key === 'N') {
        // 定位下一个待学任务
        for (let d = 1; d <= 28; d++) {
            const m = appState.mastery[d];
            if (!m || m.level < 5) {
                scrollToDay(d);
                break;
            }
        }
    } else if (e.key === 'r' || e.key === 'R') {
        openReviewModal();
    } else if (e.key === '[' || e.key === ']') {
        if (typeof toggleYuqueSidebar === 'function') {
            toggleYuqueSidebar();
        }
    } else if (e.key === 'o' || e.key === 'O') {
        if (typeof toggleFloatingNav === 'function') {
            toggleFloatingNav();
        }
    }
});

// 页面加载入口
window.addEventListener('DOMContentLoaded', () => {
    try { loadAndMigrateState(); } catch(e) { console.error('loadAndMigrateState error:', e); }
    try { if (typeof initStudyTimer === 'function') initStudyTimer(); } catch(e) { console.error('initStudyTimer error:', e); }
    try { initQuizDaySelector(); } catch(e) { console.error('initQuizDaySelector error:', e); }
    try { setWorkspaceMode(appState.workspaceMode || 'full'); } catch(e) { console.error('setWorkspaceMode error:', e); }
    try { updateDashboardMetrics(); } catch(e) { console.error('updateDashboardMetrics error:', e); }
    try { renderDailyCards(); } catch(e) { console.error('renderDailyCards error:', e); }
    try { renderMappingTable(); } catch(e) { console.error('renderMappingTable error:', e); }
    try { if (typeof loadYuqueState === 'function') loadYuqueState(); } catch(e) { console.error('loadYuqueState error:', e); }

    // 绑定笔记本自动存盘
    try {
        const notebookEl = document.getElementById('notebook-textarea');
        if (notebookEl) {
            if (appState.globalNotes) notebookEl.value = appState.globalNotes;
            notebookEl.addEventListener('input', debouncedSaveGlobalNotes);
            notebookEl.addEventListener('blur', () => {
                appState.globalNotes = notebookEl.value;
                persistState();
            });
        }
    } catch(e) {
        console.error('notebook init error:', e);
    }
});

function openEnvGuideModal() {
    document.getElementById("env-guide-modal")?.classList.remove("hidden");
}

function closeEnvGuideModal() {
    document.getElementById("env-guide-modal")?.classList.add("hidden");
}

function switchEnvModalTab(tabId) {
    const tabs = ['concept', 'steps', 'matrix', 'debug', 'cmake'];
    tabs.forEach(t => {
        const pane = document.getElementById('env-pane-' + t);
        const btn = document.getElementById('env-tab-btn-' + t);
        if (pane) {
            if (t === tabId) {
                pane.classList.remove('hidden');
            } else {
                pane.classList.add('hidden');
            }
        }
        if (btn) {
            if (t === tabId) {
                btn.className = "px-3 py-1.5 rounded-lg bg-sky-800 text-white font-bold text-xs shadow-xs transition shrink-0";
            } else {
                btn.className = "px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition shrink-0";
            }
        }
    });
}

// ==================== Phase 4: 双轨统一今日任务调度中心控制器 ====================

// 确保日常任务状态初始化自愈
function ensureDailyRoutineInitialized() {
    if (!appState.dailyRoutine || typeof appState.dailyRoutine !== 'object') {
        if (typeof StateManager !== 'undefined' && StateManager.getState()?.dailyRoutine) {
            appState.dailyRoutine = StateManager.getState().dailyRoutine;
        } else if (typeof TaskDomain !== 'undefined' && typeof TaskDomain.createFreshDailyTasks === 'function') {
            appState.dailyRoutine = {
                date: getTodayDateStr(),
                mode: 'normal',
                tasks: TaskDomain.createFreshDailyTasks(),
                records: {
                    algorithm: [],
                    books: {
                        linuxServer: { currentPage: 0, targetPagesPerDay: 10, notes: "" },
                        birdLinux: { currentPage: 0, targetPagesPerDay: 10, notes: "" },
                        nonviolentComm: { currentPage: 0, targetPagesPerDay: 10, notes: "" },
                        financeZero: { currentPage: 0, targetPagesPerDay: 10, notes: "" },
                        gameTheory: { currentPage: 0, targetPagesPerDay: 10, notes: "" }
                    },
                    careerNotes: ""
                },
                history: {}
            };
        }
    }
    return appState.dailyRoutine;
}

// 核心渲染函数：渲染任务调度中心
function renderTaskHub() {
    const routine = ensureDailyRoutineInitialized();
    if (!routine) return;

    const mode = routine.mode || 'normal';

    // 1. 日期显示
    const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const now = new Date();
    const dateStr = `${routine.date || getTodayDateStr()} · ${daysOfWeek[now.getDay()]}`;
    const elDate = document.getElementById('task-hub-date-str');
    if (elDate) elDate.innerText = `今日日程 · ${dateStr}`;

    // 2. 模式切换按钮样式更新
    const btnNormal = document.getElementById('btn-mode-normal');
    const btnCompact = document.getElementById('btn-mode-compact');
    const alertCompact = document.getElementById('compact-mode-alert');

    if (btnNormal) {
        btnNormal.className = mode === 'normal'
            ? 'px-3 py-1.5 rounded-lg font-bold bg-white text-stone-900 shadow-xs transition cursor-pointer flex items-center gap-1.5'
            : 'px-3 py-1.5 rounded-lg font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer flex items-center gap-1.5';
    }
    if (btnCompact) {
        btnCompact.className = mode === 'compact'
            ? 'px-3 py-1.5 rounded-lg font-bold bg-amber-600 text-white shadow-xs transition cursor-pointer flex items-center gap-1.5'
            : 'px-3 py-1.5 rounded-lg font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer flex items-center gap-1.5';
    }
    if (alertCompact) {
        if (mode === 'compact') alertCompact.classList.remove('hidden');
        else alertCompact.classList.add('hidden');
    }

    // 3. 计算进度与工时指标
    let prog = { total: 7, activeTotal: 7, completed: 0, rate: 0, activeMinutes: 390, remainingMinutes: 390, completedMinutes: 0 };
    if (typeof TaskDomain !== 'undefined' && typeof TaskDomain.calculateRoutineProgress === 'function') {
        prog = TaskDomain.calculateRoutineProgress(routine.tasks, mode);
    }

    // 4. 更新大盘卡片指标
    const elCompleted = document.getElementById('hub-stat-completed');
    if (elCompleted) elCompleted.innerText = `${prog.completed} / ${prog.activeTotal}`;

    const elRate = document.getElementById('hub-stat-rate');
    if (elRate) elRate.innerText = `${prog.rate}%`;

    const elTotalMins = document.getElementById('hub-stat-total-mins');
    if (elTotalMins) elTotalMins.innerText = `${prog.activeMinutes} min`;

    const elHoursDesc = document.getElementById('hub-stat-hours-desc');
    if (elHoursDesc) elHoursDesc.innerText = `约 ${(prog.activeMinutes / 60).toFixed(1)} 小时`;

    const elRemainMins = document.getElementById('hub-stat-remain-mins');
    if (elRemainMins) elRemainMins.innerText = `${prog.remainingMinutes} min`;

    const elProgText = document.getElementById('hub-progress-text');
    if (elProgText) elProgText.innerText = `${prog.rate}% 完成 (${prog.completed}/${prog.activeTotal} 项)`;

    const elProgFill = document.getElementById('hub-progress-fill');
    if (elProgFill) elProgFill.style.width = `${prog.rate}%`;

    // 5. 渲染任务列表 (S / A / B / C 分组)
    const listContainer = document.getElementById('task-hub-list-container');
    if (!listContainer) return;

    const filteredTasks = typeof TaskDomain !== 'undefined' 
        ? TaskDomain.filterTasksByMode(routine.tasks, mode) 
        : routine.tasks;

    // 动态获取当前推荐
    const yqList = getYuqueDataset();
    let nextArticle = yqList.find(art => ((appState.knowledgeMastery && (appState.knowledgeMastery[art.id] || appState.knowledgeMastery[art.slug])) || 0) < 3) || yqList[0];
    let nextDay = DAYS_DATASET.find(item => !appState.mastery[item.day] || appState.mastery[item.day].level < 5) || DAYS_DATASET[0];

    const records = routine.records || {};
    const algoList = records.algorithm || [];
    const books = records.books || {};

    let html = '';

    // 按优先级分组提取
    const sTasks = filteredTasks.filter(t => t.priority === 'S');
    const aTasks = filteredTasks.filter(t => t.priority === 'A');
    const bTasks = filteredTasks.filter(t => t.priority === 'B');
    const cTasks = filteredTasks.filter(t => t.priority === 'C');
    const customTasks = filteredTasks.filter(t => t.isCustom);

    // 渲染通用卡片辅助函数
    function renderTaskItemHtml(task) {
        const isDone = !!task.completed;
        const isSusp = !!task.isSuspended;
        const timeLabel = task.estimatedMinutes ? `${task.estimatedMinutes} min` : '';

        let badgePriority = '';
        if (task.priority === 'S') badgePriority = '<span class="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 font-bold text-[10px]">S 级·核心攻坚</span>';
        else if (task.priority === 'A') badgePriority = '<span class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px]">A 级·主干底座</span>';
        else if (task.priority === 'B') badgePriority = '<span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300 font-bold text-[10px]">B 级·知识巩固</span>';
        else badgePriority = '<span class="px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-300 font-bold text-[10px]">C 级·通识拓展</span>';

        let suspensionBadge = isSusp 
            ? '<span class="px-2 py-0.5 rounded bg-stone-200 text-stone-600 text-[10px] font-bold">今日紧凑模式免除</span>' 
            : '';

        let extraContent = '';

        // S 级专属：显示当前推荐
        if (task.id === 'task_s_project') {
            extraContent = `
                <div class="mt-2.5 p-2.5 rounded-lg bg-rose-50/80 border border-rose-200 text-xs font-serifMono text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                        <span><strong>当前推荐主线：</strong>${nextArticle ? '专栏《' + escapeHtml(nextArticle.title) + '》' : 'Day ' + nextDay.day + ' ' + escapeHtml(nextDay.title)}</span>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <button onclick="openYuqueArticle('${nextArticle?.slug || nextArticle?.id || ''}')" class="px-2.5 py-1 bg-white border border-rose-300 hover:bg-rose-100 text-rose-900 rounded font-bold transition cursor-pointer">
                            研读专栏
                        </button>
                        <button onclick="switchTopologyTab('cppai'); scrollToTopology();" class="px-2.5 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded font-semibold transition cursor-pointer">
                            查看架构
                        </button>
                    </div>
                </div>
            `;
        }

        // A 级算法专属：显示今日手撕进度与题目列表
        if (task.id === 'task_a_algo') {
            const algoBadges = algoList.map(a => `
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] font-mono">
                    <strong>#${escapeHtml(String(a.problemNumber))}</strong> ${escapeHtml(a.title)} (${escapeHtml(a.timeComplexity || 'O(n)')})
                </span>
            `).join('');

            extraContent = `
                <div class="mt-2.5 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200 text-xs font-serifMono text-indigo-950 flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <span>今日已记录算法：<strong>${algoList.length} / 3 题</strong></span>
                        <button onclick="openAlgorithmModal()" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold transition flex items-center gap-1 cursor-pointer">
                            <i class="fa-solid fa-plus text-[10px]"></i> 记录手撕题
                        </button>
                    </div>
                    ${algoBadges ? `<div class="flex flex-wrap gap-1.5 pt-1">${algoBadges}</div>` : '<div class="text-[11px] text-stone-400">今日暂无手撕记录，点击右侧记录添加题目。</div>'}
                </div>
            `;
        }

        // A 级书目专属：显示页码与更新按钮
        if (task.bookKey && books[task.bookKey]) {
            const curPage = books[task.bookKey].currentPage || 0;
            extraContent = `
                <div class="mt-2.5 p-2 rounded-lg bg-sky-50/70 border border-sky-200 text-xs font-serifMono text-sky-950 flex items-center justify-between">
                    <span>当前阅读进度：<strong>P.${curPage}</strong> (今日目标: +10页)</span>
                    <button onclick="openBooksModal('${task.bookKey}')" class="px-2.5 py-1 bg-white border border-sky-300 hover:bg-sky-100 text-sky-900 rounded font-bold transition cursor-pointer">
                        更新页码
                    </button>
                </div>
            `;
        }

        // C 级阅读专属：三部曲阅读概览
        if (task.id === 'task_c_reading') {
            const p1 = books.nonviolentComm?.currentPage || 0;
            const p2 = books.financeZero?.currentPage || 0;
            const p3 = books.gameTheory?.currentPage || 0;
            extraContent = `
                <div class="mt-2.5 p-2 rounded-lg bg-teal-50/70 border border-teal-200 text-xs font-serifMono text-teal-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div class="text-[11px] text-stone-600 space-x-2">
                        <span>沟通: P.${p1}</span>
                        <span>•</span>
                        <span>金融: P.${p2}</span>
                        <span>•</span>
                        <span>博弈论: P.${p3}</span>
                    </div>
                    <button onclick="openBooksModal('nonviolentComm')" class="px-2.5 py-1 bg-white border border-teal-300 hover:bg-teal-100 text-teal-900 rounded font-bold transition cursor-pointer">
                        记录阅读
                    </button>
                </div>
            `;
        }

        // C 级求职专属：牛客网与调研随笔
        if (task.id === 'task_c_career') {
            const cNote = records.careerNotes || '';
            extraContent = `
                <div class="mt-2.5 p-2 rounded-lg bg-stone-100 border border-stone-200 text-xs font-serifMono text-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span class="text-[11px] text-stone-600 truncate max-w-md">${cNote ? '手记: ' + escapeHtml(cNote) : '暂无岗位调研手记，定期关注招聘要求'}</span>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <a href="https://www.nowcoder.com/jobs" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded font-bold transition">
                            访问牛客
                        </a>
                        <button onclick="openCareerModal()" class="px-2.5 py-1 bg-white border border-stone-300 hover:bg-stone-200 text-stone-700 rounded font-bold transition cursor-pointer">
                            调研手记
                        </button>
                    </div>
                </div>
            `;
        }

        // 自定义任务专属：删除按钮
        let deleteBtn = '';
        if (task.isCustom) {
            deleteBtn = `
                <button onclick="deleteCustomTask('${task.id}')" class="text-stone-400 hover:text-rose-600 transition text-xs p-1" title="删除任务">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
        }

        const cardBorder = isDone 
            ? 'border-emerald-300 bg-emerald-50/20' 
            : (isSusp ? 'border-stone-200 bg-stone-50/50 opacity-60' : 'border-stone-200 bg-white');

        return `
            <div class="p-4 rounded-xl border ${cardBorder} transition hover:border-stone-400 shadow-xs">
                <div class="flex items-start justify-between gap-3">
                    <div class="flex items-start gap-3">
                        <input type="checkbox" onchange="toggleTaskCompleted('${task.id}')" ${isDone ? 'checked' : ''} ${isSusp ? 'disabled' : ''} class="mt-1 w-4 h-4 rounded text-sky-700 focus:ring-sky-600 cursor-pointer">
                        <div>
                            <div class="flex items-center gap-2 flex-wrap">
                                ${badgePriority}
                                ${suspensionBadge}
                                <span class="text-xs font-bold ${isDone ? 'line-through text-stone-400' : 'text-stone-900'}">${escapeHtml(task.title)}</span>
                            </div>
                            <p class="text-[11px] text-stone-500 mt-1 leading-relaxed ${isDone ? 'line-through text-stone-400' : ''}">
                                ${escapeHtml(task.subtitle || task.description || '')}
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2 shrink-0 font-serifMono">
                        <span class="text-[11px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <i class="fa-regular fa-clock"></i> ${timeLabel}
                        </span>
                        <button onclick="startTimerForTask('${task.id}', '${escapeHtml(task.title)}', '${task.category || 'coding'}', ${task.estimatedMinutes || 30})" class="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer" title="一键带入专注计时器">
                            <i class="fa-solid fa-stopwatch text-amber-600"></i>
                            <span class="hidden sm:inline">计时</span>
                        </button>
                        ${deleteBtn}
                    </div>
                </div>
                ${extraContent}
            </div>
        `;
    }

    // 组装整个列表
    let sHtml = sTasks.map(renderTaskItemHtml).join('');
    let aHtml = aTasks.map(renderTaskItemHtml).join('');
    let bHtml = bTasks.map(renderTaskItemHtml).join('');
    let cHtml = cTasks.map(renderTaskItemHtml).join('');
    let customHtml = customTasks.map(renderTaskItemHtml).join('');

    html = `
        <!-- S 级任务 -->
        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <div class="text-xs font-serifMono font-bold text-rose-800 flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span> S 级 · 项目核心攻坚 (3.0h)
                </div>
                <span class="text-[11px] font-serifMono text-stone-400">第一优先级 · 始终必保</span>
            </div>
            <div class="space-y-2.5">${sHtml || '<div class="text-xs text-stone-400 p-3 bg-stone-50 rounded-xl">无 S 级任务</div>'}</div>
        </div>

        <!-- A 级任务 -->
        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <div class="text-xs font-serifMono font-bold text-amber-900 flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span> A 级 · 主干算法与底座 (2.5h)
                </div>
                <span class="text-[11px] font-serifMono text-stone-400">算法 3 题 + Linux 服务端书目研读</span>
            </div>
            <div class="space-y-2.5">${aHtml || '<div class="text-xs text-stone-400 p-3 bg-stone-50 rounded-xl">无 A 级任务</div>'}</div>
        </div>

        <!-- B 级任务 -->
        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <div class="text-xs font-serifMono font-bold text-sky-800 flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block"></span> B 级 · 知识巩固与自测 (0.5h)
                </div>
                <span class="text-[11px] font-serifMono text-stone-400">考点八股自测 · 紧凑模式可免除</span>
            </div>
            <div class="space-y-2.5">${bHtml || '<div class="text-xs text-stone-400 p-3 bg-stone-50 rounded-xl">无 B 级任务</div>'}</div>
        </div>

        <!-- C 级任务 -->
        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <div class="text-xs font-serifMono font-bold text-stone-700 flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-stone-600 inline-block"></span> C 级 · 通识拓展与就业 (1.0h)
                </div>
                <span class="text-[11px] font-serifMono text-stone-400">通识阅读 + 牛客行情 · 紧凑模式可免除</span>
            </div>
            <div class="space-y-2.5">${cHtml || '<div class="text-xs text-stone-400 p-3 bg-stone-50 rounded-xl">无 C 级任务</div>'}</div>
        </div>
    `;

    if (customHtml) {
        html += `
            <div class="space-y-2">
                <div class="text-xs font-serifMono font-bold text-indigo-900 flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span> 自定义任务
                </div>
                <div class="space-y-2.5">${customHtml}</div>
            </div>
        `;
    }

    listContainer.innerHTML = html;

    // 6. 渲染过去 7 天历史快照
    renderTaskHistoryStrip();
}

// 过去 7 天历史卡片渲染
function renderTaskHistoryStrip() {
    const strip = document.getElementById('task-history-strip');
    if (!strip) return;

    const routine = ensureDailyRoutineInitialized();
    const history = routine?.history || {};
    const todayStr = getTodayDateStr();

    // 计算过去 7 天日期列表
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        days.push(`${yyyy}-${mm}-${dd}`);
    }

    const html = days.map(dStr => {
        const isToday = dStr === todayStr;
        let rate = 0;
        let completed = 0;
        let total = 7;
        let mode = 'normal';

        if (isToday) {
            const prog = typeof TaskDomain !== 'undefined' ? TaskDomain.calculateRoutineProgress(routine.tasks, routine.mode) : null;
            rate = prog ? prog.rate : 0;
            completed = prog ? prog.completed : 0;
            total = prog ? prog.activeTotal : 7;
            mode = routine.mode;
        } else if (history[dStr]) {
            rate = history[dStr].rate || 0;
            completed = history[dStr].completed || 0;
            total = history[dStr].activeTotal || history[dStr].total || 7;
            mode = history[dStr].mode || 'normal';
        }

        let rateColor = 'bg-stone-50 border-stone-200 text-stone-700';
        if (rate >= 80) rateColor = 'bg-emerald-50 border-emerald-300 text-emerald-900';
        else if (rate >= 50) rateColor = 'bg-amber-50 border-amber-300 text-amber-900';
        else if (rate > 0) rateColor = 'bg-sky-50 border-sky-300 text-sky-900';

        return `
            <div class="p-2.5 rounded-xl border ${rateColor} font-serifMono text-center flex flex-col justify-between">
                <div class="text-[10px] text-stone-500 font-bold flex items-center justify-center gap-1">
                    ${isToday ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 今日' : dStr.slice(5)}
                </div>
                <div class="text-base font-bold my-1">${rate}%</div>
                <div class="text-[10px] text-stone-400 truncate">${completed}/${total} 项 (${mode === 'compact' ? '紧凑' : '全量'})</div>
            </div>
        `;
    }).join('');

    strip.innerHTML = html;
}

// 切换任务完成状态
function toggleTaskCompleted(taskId) {
    const routine = ensureDailyRoutineInitialized();
    if (!routine) return;

    const task = (routine.tasks || []).find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;

    persistState();
    renderTaskHub();
    updateDashboardMetrics();

    if (typeof showToast === 'function') {
        showToast(task.completed ? `已完成任务「${task.title}」` : `已取消任务「${task.title}」完成状态`, task.completed);
    }
}

// 切换日常模式 (normal / compact)
function setRoutineMode(mode) {
    const routine = ensureDailyRoutineInitialized();
    if (!routine) return;

    routine.mode = mode;
    persistState();
    renderTaskHub();
    updateDashboardMetrics();

    if (typeof showToast === 'function') {
        showToast(mode === 'compact' ? '已切换至紧凑保底模式 (3.5h 聚焦主干)' : '已切换至标准全量模式 (6.5h)');
    }
}

// 算法记录弹窗
function openAlgorithmModal() {
    document.getElementById('algorithm-modal')?.classList.remove('hidden');
    const numInput = document.getElementById('algo-num');
    if (numInput) numInput.focus();
}

function closeAlgorithmModal() {
    document.getElementById('algorithm-modal')?.classList.add('hidden');
}

function saveAlgorithmProblem() {
    const routine = ensureDailyRoutineInitialized();
    if (!routine) return;

    const num = document.getElementById('algo-num')?.value.trim();
    const title = document.getElementById('algo-title')?.value.trim();
    const topic = document.getElementById('algo-topic')?.value || '其他';
    const timeComp = document.getElementById('algo-time-comp')?.value.trim() || 'O(n)';
    const spaceComp = document.getElementById('algo-space-comp')?.value.trim() || 'O(1)';
    const passed = document.getElementById('algo-passed')?.checked ?? true;
    const note = document.getElementById('algo-note')?.value.trim() || '';

    if (!title) {
        if (typeof showToast === 'function') showToast('请填写算法题名称', false);
        return;
    }

    if (!routine.records) routine.records = {};
    if (!Array.isArray(routine.records.algorithm)) routine.records.algorithm = [];

    const newRecord = {
        id: Date.now(),
        problemNumber: num || `${routine.records.algorithm.length + 1}`,
        title: title,
        topic: topic,
        timeComplexity: timeComp,
        spaceComplexity: spaceComp,
        passed: passed,
        note: note,
        date: getTodayDateStr()
    };

    routine.records.algorithm.push(newRecord);

    // 若今日已手撕满 3 题，自动将 A 级算法任务标记完成
    if (routine.records.algorithm.length >= 3) {
        const algoTask = (routine.tasks || []).find(t => t.id === 'task_a_algo');
        if (algoTask && !algoTask.completed) {
            algoTask.completed = true;
            algoTask.completedAt = new Date().toISOString();
        }
    }

    // 清空表单
    const numEl = document.getElementById('algo-num');
    if (numEl) numEl.value = '';
    const titleEl = document.getElementById('algo-title');
    if (titleEl) titleEl.value = '';
    const noteEl = document.getElementById('algo-note');
    if (noteEl) noteEl.value = '';

    persistState();
    closeAlgorithmModal();
    renderTaskHub();
    updateDashboardMetrics();

    if (typeof showToast === 'function') {
        showToast(`算法「#${newRecord.problemNumber} ${title}」已记录！今日已完成 ${routine.records.algorithm.length} 题`);
    }
}

// 书目进度弹窗
function openBooksModal(bookKey = 'linuxServer') {
    const routine = ensureDailyRoutineInitialized();
    const books = routine?.records?.books || {};

    const sel = document.getElementById('book-select-key');
    if (sel) sel.value = bookKey;

    onBookSelectChange(bookKey);
    document.getElementById('books-modal')?.classList.remove('hidden');
}

function closeBooksModal() {
    document.getElementById('books-modal')?.classList.add('hidden');
}

function onBookSelectChange(bookKey) {
    const routine = ensureDailyRoutineInitialized();
    const books = routine?.records?.books || {};
    const curBook = books[bookKey] || { currentPage: 0, notes: "" };

    const curPageEl = document.getElementById('book-current-page');
    if (curPageEl) curPageEl.value = curBook.currentPage || 0;

    const noteEl = document.getElementById('book-notes');
    if (noteEl) noteEl.value = curBook.notes || '';
}

function saveBooksProgress() {
    const routine = ensureDailyRoutineInitialized();
    if (!routine) return;

    const bookKey = document.getElementById('book-select-key')?.value || 'linuxServer';
    const curPage = parseInt(document.getElementById('book-current-page')?.value || '0');
    const todayPages = parseInt(document.getElementById('book-today-pages')?.value || '10');
    const note = document.getElementById('book-notes')?.value.trim() || '';

    if (!routine.records) routine.records = {};
    if (!routine.records.books) routine.records.books = {};

    const basePage = Math.max(curPage, routine.records.books[bookKey]?.currentPage || 0);
    const newPage = basePage + (todayPages > 0 ? todayPages : 0);
    routine.records.books[bookKey] = {
        currentPage: newPage,
        targetPagesPerDay: 10,
        notes: note,
        lastUpdated: new Date().toISOString()
    };

    // 自动勾选对应任务
    if (bookKey === 'linuxServer') {
        const bTask = (routine.tasks || []).find(t => t.id === 'task_a_linux_book');
        if (bTask) { bTask.completed = true; bTask.completedAt = new Date().toISOString(); }
    } else if (bookKey === 'birdLinux') {
        const bTask = (routine.tasks || []).find(t => t.id === 'task_a_bird_linux');
        if (bTask) { bTask.completed = true; bTask.completedAt = new Date().toISOString(); }
    } else if (['nonviolentComm', 'financeZero', 'gameTheory'].includes(bookKey)) {
        const rTask = (routine.tasks || []).find(t => t.id === 'task_c_reading');
        if (rTask) { rTask.completed = true; rTask.completedAt = new Date().toISOString(); }
    }

    persistState();
    closeBooksModal();
    renderTaskHub();
    updateDashboardMetrics();

    if (typeof showToast === 'function') {
        showToast(`书目进度已更新至 P.${newPage}！已自动标记任务完成`);
    }
}

// 牛客求职调研弹窗
function openCareerModal() {
    const routine = ensureDailyRoutineInitialized();
    const notesEl = document.getElementById('career-notes-input');
    if (notesEl && routine?.records) {
        notesEl.value = routine.records.careerNotes || '';
    }
    document.getElementById('career-modal')?.classList.remove('hidden');
}

function closeCareerModal() {
    document.getElementById('career-modal')?.classList.add('hidden');
}

function saveCareerNotes() {
    const routine = ensureDailyRoutineInitialized();
    if (!routine) return;

    const note = document.getElementById('career-notes-input')?.value.trim() || '';
    if (!routine.records) routine.records = {};
    routine.records.careerNotes = note;

    if (note) {
        const cTask = (routine.tasks || []).find(t => t.id === 'task_c_career');
        if (cTask) { cTask.completed = true; cTask.completedAt = new Date().toISOString(); }
    }

    persistState();
    closeCareerModal();
    renderTaskHub();
    updateDashboardMetrics();

    if (typeof showToast === 'function') {
        showToast('求职调研手记已保存');
    }
}

// 新建自定义任务
function openAddTaskModal() {
    document.getElementById('add-task-modal')?.classList.remove('hidden');
    document.getElementById('new-task-title')?.focus();
}

function closeAddTaskModal() {
    document.getElementById('add-task-modal')?.classList.add('hidden');
}

function saveCustomTask() {
    const routine = ensureDailyRoutineInitialized();
    if (!routine) return;

    const title = document.getElementById('new-task-title')?.value.trim();
    const priority = document.getElementById('new-task-priority')?.value || 'A';
    const mins = parseInt(document.getElementById('new-task-mins')?.value || '30');
    const category = document.getElementById('new-task-category')?.value || 'project';
    const desc = document.getElementById('new-task-desc')?.value.trim() || '';

    if (!title) {
        if (typeof showToast === 'function') showToast('请填写任务名称', false);
        return;
    }

    const newTask = {
        id: `task_custom_${Date.now()}`,
        priority: priority,
        category: category,
        title: title,
        subtitle: `预计 ${mins} min · ${desc || '自定义待办事项'}`,
        estimatedMinutes: mins,
        recurring: false,
        actionType: 'custom',
        description: desc,
        completed: false,
        completedAt: null,
        isCustom: true
    };

    if (!Array.isArray(routine.tasks)) routine.tasks = [];
    routine.tasks.push(newTask);

    const titleEl = document.getElementById('new-task-title');
    if (titleEl) titleEl.value = '';
    const descEl = document.getElementById('new-task-desc');
    if (descEl) descEl.value = '';

    persistState();
    closeAddTaskModal();
    renderTaskHub();
    updateDashboardMetrics();

    if (typeof showToast === 'function') {
        showToast(`已添加自定义任务「${title}」`);
    }
}

// 删除自定义任务
function deleteCustomTask(taskId) {
    const routine = ensureDailyRoutineInitialized();
    if (!routine) return;

    routine.tasks = (routine.tasks || []).filter(t => t.id !== taskId);

    persistState();
    renderTaskHub();
    updateDashboardMetrics();

    if (typeof showToast === 'function') {
        showToast('已删除自定义任务');
    }
}

// 全局方法挂载 (用于 HTML onclick 与跨模块调用)
if (typeof window !== 'undefined') {
    window.setWorkspaceMode = setWorkspaceMode;
    window.switchTopologyTab = switchTopologyTab;
    window.scrollToTopology = scrollToTopology;
    window.openYuqueArticle = openYuqueArticle;
    window.openTopologyDrawer = openTopologyDrawer;
    window.closeTopologyDrawer = closeTopologyDrawer;
    window.openEnvGuideModal = openEnvGuideModal;
    window.closeEnvGuideModal = closeEnvGuideModal;
    window.switchEnvModalTab = switchEnvModalTab;

    // Phase 4 方法挂载
    window.renderTaskHub = renderTaskHub;
    window.toggleTaskCompleted = toggleTaskCompleted;
    window.setRoutineMode = setRoutineMode;
    window.openAlgorithmModal = openAlgorithmModal;
    window.closeAlgorithmModal = closeAlgorithmModal;
    window.saveAlgorithmProblem = saveAlgorithmProblem;
    window.openBooksModal = openBooksModal;
    window.closeBooksModal = closeBooksModal;
    window.onBookSelectChange = onBookSelectChange;
    window.saveBooksProgress = saveBooksProgress;
    window.openCareerModal = openCareerModal;
    window.closeCareerModal = closeCareerModal;
    window.saveCareerNotes = saveCareerNotes;
    window.openAddTaskModal = openAddTaskModal;
    window.closeAddTaskModal = closeAddTaskModal;
    window.saveCustomTask = saveCustomTask;
    window.deleteCustomTask = deleteCustomTask;
}

if (typeof globalThis !== 'undefined') {
    globalThis.setWorkspaceMode = setWorkspaceMode;
    globalThis.switchTopologyTab = switchTopologyTab;
    globalThis.scrollToTopology = scrollToTopology;
    globalThis.openYuqueArticle = openYuqueArticle;
    globalThis.openTopologyDrawer = openTopologyDrawer;
    globalThis.closeTopologyDrawer = closeTopologyDrawer;

    // Phase 4 方法挂载
    globalThis.renderTaskHub = renderTaskHub;
    globalThis.toggleTaskCompleted = toggleTaskCompleted;
    globalThis.setRoutineMode = setRoutineMode;
    globalThis.openAlgorithmModal = openAlgorithmModal;
    globalThis.closeAlgorithmModal = closeAlgorithmModal;
    globalThis.saveAlgorithmProblem = saveAlgorithmProblem;
    globalThis.openBooksModal = openBooksModal;
    globalThis.closeBooksModal = closeBooksModal;
    globalThis.onBookSelectChange = onBookSelectChange;
    globalThis.saveBooksProgress = saveBooksProgress;
    globalThis.openCareerModal = openCareerModal;
    globalThis.closeCareerModal = closeCareerModal;
    globalThis.saveCareerNotes = saveCareerNotes;
    globalThis.openAddTaskModal = openAddTaskModal;
    globalThis.closeAddTaskModal = closeAddTaskModal;
    globalThis.saveCustomTask = saveCustomTask;
    globalThis.deleteCustomTask = deleteCustomTask;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        appState,
        setWorkspaceMode,
        switchTopologyTab,
        scrollToTopology,
        openYuqueArticle,
        openTopologyDrawer,
        closeTopologyDrawer,
        updateDashboardMetrics,
        renderTodayMissionCard,
        renderTaskHub,
        toggleTaskCompleted,
        setRoutineMode,
        saveAlgorithmProblem,
        saveBooksProgress,
        saveCareerNotes,
        saveCustomTask,
        deleteCustomTask
    };
}



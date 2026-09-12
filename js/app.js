
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
    // 全局根状态对象 (V6.0.0 项目架构规范)
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
    },
    learningSystem: {
        activeTab: 'cpp',
        bookDynamicGoals: { linuxServer: 10, birdLinux: 10 },
        algoReviewQueue: {},
        qaMastery: {}
    },
    careerSystem: {
        activeCareerTab: 'evidence',
        customEvidences: [],
        mockInterviewLogs: []
    },
    schedulerSystem: {
        activeSchedulerTab: 'planner',
        calendarSource: { type: 'none', fileName: '', lastSyncTime: null, events: [] },
        googleTasks: [],
        dailySchedule: { date: '', availableMinutes: 840, freeSlots: [], scheduledBlocks: [], deficitMinutes: 0, compressionApplied: false, compressionLogs: [] },
        incompleteDiagnostics: {},
        dailyReviews: {}
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
            if (StateManager._state && StateManager._state.learningSystem) {
                if (!appState.learningSystem) appState.learningSystem = {};
                appState.learningSystem = Object.assign({}, StateManager._state.learningSystem, appState.learningSystem);
            }
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

// 今日待办侧边栏切换与持久化
function toggleTaskSidebar(forceState) {
    const sidebar = document.getElementById('task-sidebar');
    const fab = document.getElementById('task-sidebar-fab');
    const backdrop = document.getElementById('task-sidebar-backdrop');
    const navBtn = document.getElementById('nav-tasks');
    const viewTasks = document.getElementById('view-tasks');
    if (!sidebar) return;

    const isCurrentlyHidden = sidebar.classList.contains('hidden');
    const targetOpen = typeof forceState === 'boolean' ? forceState : isCurrentlyHidden;

    if (targetOpen) {
        sidebar.classList.remove('hidden');
        if (viewTasks) viewTasks.classList.remove('hidden');
        if (fab) fab.classList.add('hidden');
        if (backdrop) backdrop.classList.remove('hidden');
        if (navBtn) {
            navBtn.classList.add('bg-indigo-100', 'border-indigo-400');
            navBtn.classList.remove('bg-indigo-50');
            navBtn.setAttribute('aria-expanded', 'true');
        }
        try { localStorage.setItem('task_sidebar_open', 'true'); } catch(e) {}
        if (typeof renderTaskHub === 'function') renderTaskHub();
    } else {
        sidebar.classList.add('hidden');
        if (fab) fab.classList.remove('hidden');
        if (backdrop) backdrop.classList.add('hidden');
        if (navBtn) {
            navBtn.classList.remove('bg-indigo-100', 'border-indigo-400');
            navBtn.classList.add('bg-indigo-50');
            navBtn.setAttribute('aria-expanded', 'false');
        }
        try { localStorage.setItem('task_sidebar_open', 'false'); } catch(e) {}
    }
}

function initTaskSidebar() {
    let saved = null;
    try {
        saved = localStorage.getItem('task_sidebar_open');
    } catch(e) {}
    if (saved === 'false') {
        toggleTaskSidebar(false);
    } else if (saved === 'true') {
        toggleTaskSidebar(true);
    } else {
        // 首次访问：宽屏 (>= 1280px) 默认展开常驻，小屏幕 (< 1280px) 默认折叠以保持专注
        const isWide = typeof window !== 'undefined' && window.innerWidth ? window.innerWidth >= 1280 : true;
        toggleTaskSidebar(isWide);
    }
}

// 视图切换 (核心学习视图在工作区内切换，今日待办在侧边栏联动)
function switchView(viewName) {
    if (viewName === 'tasks') {
        toggleTaskSidebar(true);
        const viewTasks = document.getElementById('view-tasks');
        if (viewTasks) viewTasks.classList.remove('hidden');
        renderTaskHub();
        return;
    }

    appState.currentView = viewName;
    const views = ['dashboard', 'knowledge', 'daily', 'mapping', 'learning', 'quiz', 'source', 'pitfalls'];
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

    if (viewName === 'dashboard') {
        renderHomeDashboard();
    } else if (viewName === 'mapping') {
        renderModuleHierarchyMap();
    } else if (viewName === 'learning') {
        renderLearningSystem();
    } else if (viewName === 'daily') {
        renderDailyCards();
    } else if (viewName === 'knowledge') {
        if (typeof renderYuqueExplorer === 'function') renderYuqueExplorer();
    } else if (viewName === 'mapping') {
        renderLearningSystem();
    } else if (viewName === 'quiz') {
        const sel = document.getElementById('quiz-day-selector');
        const val = sel ? sel.value : '1';
        if (typeof val === 'string' && val.startsWith('qa_')) {
            loadInterviewQA(val);
        } else {
            loadQuizForDay(parseInt(val) || 1);
        }
    } else if (viewName === 'source') {
        renderSourceRoadmap();
    } else if (viewName === 'pitfalls') {
        renderPitfallsList();
    } else if (viewName === 'career') {
        renderCareerSystem();
    } else if (viewName === 'scheduler') {
        renderSchedulerSystem();
    }
}

// ==================== 工程工作台与拓扑控制导航 (Dual-Core Workspace & Topology) ====================

// 1. 工程工作台模式切换 ('full' | 'muduo' | 'cppai')
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
    // 更新今日任务导航待办角标与悬浮胶囊角标
    const elBadgeTasks = document.getElementById('badge-nav-tasks');
    const elBadgeFab = document.getElementById('badge-sidebar-fab');
    if (appState.dailyRoutine && Array.isArray(appState.dailyRoutine.tasks)) {
        let prog = null;
        if (typeof TaskDomain !== 'undefined' && typeof TaskDomain.calculateRoutineProgress === 'function') {
            prog = TaskDomain.calculateRoutineProgress(appState.dailyRoutine.tasks, appState.dailyRoutine.mode);
        }
        const pendingCount = prog ? (prog.activeTotal - prog.completed) : 0;
        if (elBadgeTasks) {
            if (pendingCount > 0) {
                elBadgeTasks.innerText = pendingCount;
                elBadgeTasks.classList.remove('hidden');
            } else {
                elBadgeTasks.classList.add('hidden');
            }
        }
        if (elBadgeFab) {
            if (pendingCount > 0) {
                elBadgeFab.innerText = pendingCount;
                elBadgeFab.classList.remove('hidden');
            } else {
                elBadgeFab.classList.add('hidden');
            }
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
                模式: <strong class="text-stone-800">${mode === 'muduo' ? 'muduo 网络核心' : (mode === 'cppai' ? 'CppAIService 服务层' : '架构全景视图')}</strong>
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
    if (grid.children && Array.isArray(grid.children)) grid.children.length = 0;

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

// ==========================================================================
// Phase 5: 统一学习系统与六维关联交互引擎 (Unified Learning System & 6D Cross-Link)
// ==========================================================================

function switchLearningTab(tabKey, updateState = true) {
    if (typeof appState !== 'undefined' && appState && appState.currentView && appState.currentView !== 'learning') {
        const secLearning = document.getElementById('view-learning');
        if (secLearning && secLearning.classList.contains('hidden')) {
            if (typeof switchView === 'function') switchView('learning');
        }
    }
    if (!appState.learningSystem) {
        appState.learningSystem = {
            algoReviewQueue: {},
            qaMastery: {},
            bookDynamicGoals: { linuxServer: 10, birdLinux: 10 },
            activeTab: 'cpp'
        };
    }
    if (updateState) {
        appState.learningSystem.activeTab = tabKey;
        if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.save === 'function') {
            stateManager.save();
        } else {
            persistState();
        }
    }

    const tabs = ['cpp', 'linux', 'books', 'algo', 'qa', 'reading'];
    tabs.forEach(t => {
        const btn = document.getElementById(`learn-tab-btn-${t}`);
        const panel = document.getElementById(`learn-panel-${t}`);
        if (!panel) return;

        if (t === tabKey) {
            panel.classList.remove('hidden');
            if (btn) {
                btn.className = "px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 bg-stone-900 text-white border-stone-900 shadow-xs cursor-pointer";
            }
        } else {
            panel.classList.add('hidden');
            if (btn) {
                btn.className = "px-3 py-1.5 rounded-xl border font-semibold transition flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200 cursor-pointer";
            }
        }
    });

    // 触发子视图动态渲染
    if (tabKey === 'cpp') {
        renderLearningCppTab();
    } else if (tabKey === 'linux') {
        renderLearningLinuxTab();
    } else if (tabKey === 'books') {
        renderLearningBooksTab();
    } else if (tabKey === 'algo') {
        renderLearningAlgoTab();
    } else if (tabKey === 'qa') {
        renderLearningQATab();
    } else if (tabKey === 'reading') {
        renderLearningReadingTab();
    }
}

function renderLearningSystem() {
    const activeTab = (appState.learningSystem && appState.learningSystem.activeTab) || 'cpp';
    renderMappingTable(); // 保证 mapping-table-body 始终填充
    switchLearningTab(activeTab, false);
}

// 1. C++ 学习路线体系渲染器 - 双栏布局 (1/4 导航与统计 + 3/4 内容大纲)
function renderLearningCppTab() {
    const sidebar = document.getElementById('cpp-nav-sidebar');
    const content = document.getElementById('cpp-content-container');
    const legacyContainer = document.getElementById('cpp-dimensions-container');
    const system = (typeof CPP_KNOWLEDGE_SYSTEM !== 'undefined') ? CPP_KNOWLEDGE_SYSTEM : [];

    // 分组章节
    const chaptersMap = new Map();
    system.forEach(item => {
        const cId = item.chapterId || 'cpp_chap_misc';
        const cTitle = item.chapterTitle || '学习路线模块';
        if (!chaptersMap.has(cId)) {
            chaptersMap.set(cId, { id: cId, title: cTitle, items: [] });
        }
        chaptersMap.get(cId).items.push(item);
    });

    const chapters = Array.from(chaptersMap.values());
    const totalItems = system.length;
    const learnedCount = (typeof stateManager !== 'undefined' && typeof stateManager.getCppLearnedCount === 'function') 
        ? stateManager.getCppLearnedCount() 
        : 0;
    const percent = totalItems > 0 ? Math.round((learnedCount / totalItems) * 100) : 0;

    // 渲染左侧 1/4 导航
    if (sidebar) {
        sidebar.innerHTML = `
            <div class="bg-white rounded-2xl p-5 border border-stone-200 academic-card space-y-4">
                <div>
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-serifMono mb-1.5">
                        <i class="fa-solid fa-code text-sky-600"></i>
                        <span>C++ 学习路线 (2026)</span>
                    </div>
                    <h3 class="text-sm font-bold text-stone-900 font-serifHeading">
                        知识体系与进度大纲
                    </h3>
                    <p class="text-xs text-stone-500 mt-0.5">
                        学习路线与教材页码对照
                    </p>
                </div>

                <!-- 进度看板 -->
                <div class="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div class="flex items-center justify-between text-xs font-serifMono">
                        <span class="text-stone-600 font-bold">全景路线已学</span>
                        <span class="text-sky-700 font-bold">${learnedCount} / ${totalItems} (${percent}%)</span>
                    </div>
                    <div class="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                        <div class="bg-sky-600 h-2 rounded-full transition-all duration-300" style="width: ${percent}%"></div>
                    </div>
                </div>

                <!-- 章节快速跳转索引 -->
                <div class="space-y-1 font-serifMono text-xs pt-1">
                    <div class="text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-2">章节大纲速览</div>
                    ${chapters.map((chap, idx) => {
                        const chapLearned = chap.items.filter(it => (typeof stateManager !== 'undefined' && typeof stateManager.isCppLearned === 'function') ? stateManager.isCppLearned(it.id) : false).length;
                        const isAll = chapLearned === chap.items.length && chap.items.length > 0;
                        return `
                            <a href="#${chap.id}" class="flex items-center justify-between p-2 rounded-xl hover:bg-sky-50/60 transition text-stone-700 hover:text-sky-800 group text-[11px]">
                                <span class="truncate pr-1">${idx + 1}. ${escapeHtml(chap.title.replace(/^\d+\.\s*/, ''))}</span>
                                <span class="px-1.5 py-0.5 rounded text-[10px] shrink-0 font-bold ${isAll ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'}">
                                    ${chapLearned}/${chap.items.length}
                                </span>
                            </a>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // 渲染右侧 3/4 详细内容
    if (content) {
        content.innerHTML = chapters.map((chap, cIdx) => {
            const chapLearned = chap.items.filter(it => (typeof stateManager !== 'undefined' && typeof stateManager.isCppLearned === 'function') ? stateManager.isCppLearned(it.id) : false).length;
            return `
                <div id="${chap.id}" class="bg-white rounded-2xl border border-stone-200 academic-card overflow-hidden">
                    <div class="p-4 sm:p-5 bg-stone-50/90 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-serifMono font-bold flex items-center justify-center text-xs">
                                    ${cIdx + 1}
                                </span>
                                <h3 class="font-bold text-stone-900 text-sm sm:text-base font-serifHeading">
                                    ${escapeHtml(chap.title)}
                                </h3>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 font-serifMono text-xs">
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-600">
                                章节掌握: <strong class="text-sky-700 font-bold">${chapLearned}/${chap.items.length}</strong>
                            </span>
                        </div>
                    </div>

                    <div class="divide-y divide-stone-100">
                        ${chap.items.map(item => {
                            const isLearned = (typeof stateManager !== 'undefined' && typeof stateManager.isCppLearned === 'function') ? stateManager.isCppLearned(item.id) : false;
                            return `
                                <div class="p-4 sm:p-5 transition hover:bg-stone-50/50 ${isLearned ? 'bg-sky-50/20' : ''}" id="card-${escapeHtml(item.id)}">
                                    <div class="flex items-start gap-3">
                                        <div class="pt-0.5">
                                            <input type="checkbox" id="check-${escapeHtml(item.id)}" onchange="toggleCppLearnedStatus('${escapeHtml(item.id)}')" ${isLearned ? 'checked' : ''} class="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-stone-300 cursor-pointer">
                                        </div>
                                        <div class="flex-1 space-y-2.5">
                                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                                <div class="flex items-center gap-2 flex-wrap">
                                                    <label for="check-${escapeHtml(item.id)}" class="text-sm font-bold font-serifHeading cursor-pointer ${isLearned ? 'line-through text-stone-400' : 'text-stone-900'}">
                                                        ${escapeHtml(item.title)}
                                                    </label>
                                                    ${item.yuqueSection ? `
                                                        <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-serifMono font-bold shrink-0">
                                                            <i class="fa-solid fa-feather text-emerald-600"></i> 语雀路线: ${escapeHtml(item.yuqueSection)}
                                                        </span>
                                                    ` : ''}
                                                    <span class="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 text-xs font-serifMono font-bold shrink-0">
                                                        <i class="fa-solid fa-book-bookmark text-sky-600"></i> ${escapeHtml(item.bookReference)}
                                                    </span>
                                                </div>
                                                <div class="flex items-center gap-2 font-serifMono text-xs shrink-0">
                                                    <span class="text-stone-500 text-[11px]"><i class="fa-solid fa-cube text-stone-400"></i> ${escapeHtml(item.moduleName || item.cppaiModule)}</span>
                                                    <button onclick="openCrossLinkModal('${escapeHtml(item.id)}')" class="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition text-[11px] cursor-pointer">
                                                        穿透
                                                    </button>
                                                </div>
                                            </div>

                                            <p class="text-xs text-stone-600 leading-relaxed font-serifHeading">
                                                ${escapeHtml(item.coreConcept)}
                                            </p>

                                            <!-- 核心要点清单 -->
                                            <div class="flex flex-wrap gap-1.5 pt-1">
                                                ${(item.keyPoints || []).map(pt => `
                                                    <span class="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[11px] font-serifMono border border-stone-200/80">
                                                        • ${escapeHtml(pt)}
                                                    </span>
                                                `).join('')}
                                            </div>

                                            <!-- 面试考点 -->
                                            <div class="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs font-serifHeading text-amber-950">
                                                <span class="font-bold text-amber-800 font-serifMono text-[11px] block mb-0.5">
                                                    <i class="fa-solid fa-circle-question"></i> 面试考点：
                                                </span>
                                                <p class="text-[11px] text-stone-700 leading-relaxed">${escapeHtml(item.interviewPoint)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    if (legacyContainer) {
        legacyContainer.innerHTML = '';
    }

    renderMappingTable();
}

// 2. Linux 私房菜底座体系渲染器 - 双栏布局 (1/4 导航与统计 + 3/4 内容大纲)
function renderLearningLinuxTab() {
    const sidebar = document.getElementById('linux-nav-sidebar');
    const content = document.getElementById('linux-content-container');
    const legacyContainer = document.getElementById('linux-dimensions-container');
    const list = (typeof LINUX_SYSTEM_KNOWLEDGE !== 'undefined') ? LINUX_SYSTEM_KNOWLEDGE : [];

    // 分组章节
    const chaptersMap = new Map();
    list.forEach(item => {
        const cId = item.chapterId || 'linux_chap_misc';
        const cTitle = item.chapterTitle || 'Linux 私房菜篇章';
        if (!chaptersMap.has(cId)) {
            chaptersMap.set(cId, { id: cId, title: cTitle, items: [] });
        }
        chaptersMap.get(cId).items.push(item);
    });

    const chapters = Array.from(chaptersMap.values());
    const totalItems = list.length;
    const learnedCount = (typeof stateManager !== 'undefined' && typeof stateManager.getLinuxLearnedCount === 'function') 
        ? stateManager.getLinuxLearnedCount() 
        : 0;
    const percent = totalItems > 0 ? Math.round((learnedCount / totalItems) * 100) : 0;

    // 渲染左侧 1/4 导航
    if (sidebar) {
        sidebar.innerHTML = `
            <div class="bg-white rounded-2xl p-5 border border-stone-200 academic-card space-y-4">
                <div>
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-serifMono mb-1.5">
                        <i class="fa-solid fa-terminal text-emerald-600"></i>
                        <span>《鸟哥的Linux私房菜》</span>
                    </div>
                    <h3 class="text-sm font-bold text-stone-900 font-serifHeading">
                        基础学习篇目录大纲
                    </h3>
                    <p class="text-xs text-stone-500 mt-0.5">
                        章节实战与页码对照
                    </p>
                </div>

                <!-- 进度看板 -->
                <div class="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div class="flex items-center justify-between text-xs font-serifMono">
                        <span class="text-stone-600 font-bold">私房菜掌握度</span>
                        <span class="text-emerald-700 font-bold">${learnedCount} / ${totalItems} (${percent}%)</span>
                    </div>
                    <div class="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                        <div class="bg-emerald-600 h-2 rounded-full transition-all duration-300" style="width: ${percent}%"></div>
                    </div>
                </div>

                <!-- 章节快速跳转索引 -->
                <div class="space-y-1 font-serifMono text-xs pt-1">
                    <div class="text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-2">章节目录</div>
                    ${chapters.map((chap, idx) => {
                        const chapLearned = chap.items.filter(it => (typeof stateManager !== 'undefined' && typeof stateManager.isLinuxLearned === 'function') ? stateManager.isLinuxLearned(it.id) : false).length;
                        const isAll = chapLearned === chap.items.length && chap.items.length > 0;
                        return `
                            <a href="#${chap.id}" class="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50/60 transition text-stone-700 hover:text-emerald-800 group text-[11px]">
                                <span class="truncate pr-1">${idx + 1}. ${escapeHtml(chap.title)}</span>
                                <span class="px-1.5 py-0.5 rounded text-[10px] shrink-0 font-bold ${isAll ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'}">
                                    ${chapLearned}/${chap.items.length}
                                </span>
                            </a>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // 渲染右侧 3/4 详细内容
    if (content) {
        content.innerHTML = chapters.map((chap, cIdx) => {
            const chapLearned = chap.items.filter(it => (typeof stateManager !== 'undefined' && typeof stateManager.isLinuxLearned === 'function') ? stateManager.isLinuxLearned(it.id) : false).length;
            return `
                <div id="${chap.id}" class="bg-white rounded-2xl border border-stone-200 academic-card overflow-hidden">
                    <div class="p-4 sm:p-5 bg-stone-50/90 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-serifMono font-bold flex items-center justify-center text-xs">
                                    ${cIdx + 1}
                                </span>
                                <h3 class="font-bold text-stone-900 text-sm sm:text-base font-serifHeading">
                                    ${escapeHtml(chap.title)}
                                </h3>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 font-serifMono text-xs">
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-600">
                                掌握度: <strong class="text-emerald-700 font-bold">${chapLearned}/${chap.items.length}</strong>
                            </span>
                        </div>
                    </div>

                    <div class="divide-y divide-stone-100">
                        ${chap.items.map(item => {
                            const isLearned = (typeof stateManager !== 'undefined' && typeof stateManager.isLinuxLearned === 'function') ? stateManager.isLinuxLearned(item.id) : false;
                            return `
                                <div class="p-4 sm:p-5 transition hover:bg-stone-50/50 ${isLearned ? 'bg-emerald-50/20' : ''}" id="card-${escapeHtml(item.id)}">
                                    <div class="flex items-start gap-3">
                                        <div class="pt-0.5">
                                            <input type="checkbox" id="check-${escapeHtml(item.id)}" onchange="toggleLinuxLearnedStatus('${escapeHtml(item.id)}')" ${isLearned ? 'checked' : ''} class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 cursor-pointer">
                                        </div>
                                        <div class="flex-1 space-y-2.5">
                                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                                <div class="flex items-center gap-2 flex-wrap">
                                                    <label for="check-${escapeHtml(item.id)}" class="text-sm font-bold font-serifHeading cursor-pointer ${isLearned ? 'line-through text-stone-400' : 'text-stone-900'}">
                                                        ${escapeHtml(item.title)}
                                                    </label>
                                                    <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-serifMono font-bold shrink-0">
                                                        <i class="fa-solid fa-book-bookmark text-emerald-600"></i> ${escapeHtml(item.bookReference)}
                                                    </span>
                                                </div>
                                                <div class="flex items-center gap-2 font-serifMono text-xs shrink-0">
                                                    <button onclick="openCrossLinkModal('${escapeHtml(item.id)}')" class="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition text-[11px] cursor-pointer">
                                                        关联模块
                                                    </button>
                                                </div>
                                            </div>

                                            <!-- 核心命令预览 -->
                                            <div class="p-2 bg-stone-900 text-emerald-400 font-serifMono text-xs rounded-lg overflow-x-auto">
                                                <code>${escapeHtml(item.syscallOrCmd)}</code>
                                            </div>

                                            <div class="text-xs text-stone-700 leading-relaxed font-serifHeading">
                                                <strong class="font-bold text-stone-900 font-serifMono">实战应用：</strong>
                                                ${escapeHtml(item.projectScene)}
                                            </div>

                                            <!-- 核心要点清单 -->
                                            <div class="flex flex-wrap gap-1.5 pt-1">
                                                ${(item.keyPoints || []).map(pt => `
                                                    <span class="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[11px] font-serifMono border border-stone-200/80">
                                                        • ${escapeHtml(pt)}
                                                    </span>
                                                `).join('')}
                                            </div>

                                            <!-- 面试考点 -->
                                            <div class="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs font-serifHeading text-amber-950">
                                                <span class="font-bold text-amber-800 font-serifMono text-[11px] block mb-0.5">
                                                    <i class="fa-solid fa-circle-question"></i> 面试考点：
                                                </span>
                                                <p class="text-[11px] text-stone-700 leading-relaxed">${escapeHtml(item.interviewPoint)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    if (legacyContainer) {
        legacyContainer.innerHTML = '';
    }
}

// C++ / Linux 已学勾选切换处理
function toggleCppLearnedStatus(itemId) {
    if (typeof stateManager !== 'undefined' && typeof stateManager.toggleCppLearned === 'function') {
        stateManager.toggleCppLearned(itemId);
    }
    renderLearningCppTab();
}

function toggleLinuxLearnedStatus(itemId) {
    if (typeof stateManager !== 'undefined' && typeof stateManager.toggleLinuxLearned === 'function') {
        stateManager.toggleLinuxLearned(itemId);
    }
    renderLearningLinuxTab();
}


// 3. 专业书目伴读伴学体系渲染器
function renderLearningBooksTab() {
    const container = document.getElementById('books-companion-container');
    if (!container) return;
    const books = (typeof BOOKS_COMPANION_DATA !== 'undefined') ? BOOKS_COMPANION_DATA : {};
    const serverBook = books.linuxServerBook || {};
    const birdBook = books.birdLinuxBook || {};

    const goals = (appState.learningSystem && appState.learningSystem.bookDynamicGoals) || { linuxServer: 10, birdLinux: 10 };
    const curServerGoal = goals.linuxServer || 10;
    const curBirdGoal = goals.birdLinux || 10;

    container.innerHTML = `
        <!-- 书目 1: Linux多线程服务端编程 -->
        <div class="bg-white rounded-2xl p-6 border border-stone-200 academic-card">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-200 mb-5">
                <div>
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-serifMono mb-1.5">
                        <i class="fa-solid fa-book-bookmark text-amber-700"></i> 经典网络编程圣经
                    </div>
                    <h3 class="text-base font-bold text-stone-900 font-serifHeading">${escapeHtml(serverBook.name || '《Linux多线程服务端编程》')}</h3>
                    <p class="text-xs text-stone-500 font-serifMono mt-0.5">作者: ${escapeHtml(serverBook.author || '陈硕')} • 原则: 紧跟 muduo 源码</p>
                </div>

                <!-- 动态调控器 -->
                <div class="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center gap-3 font-serifMono text-xs shrink-0">
                    <div>
                        <div class="text-[10px] text-stone-400 font-bold uppercase">每日动态目标</div>
                        <div class="text-sm font-bold text-amber-800" id="book-goal-display-server">${curServerGoal} 页/天</div>
                    </div>
                    <div class="flex items-center gap-1">
                        <button onclick="adjustBookDailyGoal('linuxServer', -1)" class="w-7 h-7 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold cursor-pointer" title="降低 1 页 (释放精力给源码攻坚)">-</button>
                        <button onclick="adjustBookDailyGoal('linuxServer', 1)" class="w-7 h-7 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold cursor-pointer" title="增加 1 页">+</button>
                    </div>
                </div>
            </div>

            <!-- 动态微调规则警示卡 -->
            <div class="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 font-serifHeading mb-5 flex items-start gap-2.5">
                <i class="fa-solid fa-sliders text-amber-700 mt-0.5 text-sm"></i>
                <div>
                    <span class="font-bold font-serifMono">弹性调配机制：</span>
                    ${escapeHtml(serverBook.dynamicAdjustRule || '基准 10 页/天。当今日处于 S 级项目核心模块攻坚期，系统自动支持动态微调至 5 页，将富余精力倾斜给真实源码与压测验证，绝不机械教条。')}
                </div>
            </div>

            <!-- 重点章节与项目映射卡片流 -->
            <div class="space-y-3 font-serifHeading">
                ${(serverBook.chapters || []).map(ch => `
                    <div class="p-4 rounded-xl bg-stone-50/60 border border-stone-200/70 hover:bg-stone-50 transition">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1.5">
                            <h4 class="text-xs sm:text-sm font-bold text-stone-900">
                                第 ${ch.chapterNum} 章：${escapeHtml(ch.title)}
                                <span class="text-stone-400 font-serifMono text-xs font-normal">(${escapeHtml(ch.pageRange)} 页)</span>
                            </h4>
                            <span class="text-[11px] font-serifMono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 w-fit">
                                ${escapeHtml(ch.mappedProjectConcept)}
                            </span>
                        </div>
                        <p class="text-xs text-stone-600 leading-relaxed">${escapeHtml(ch.coreTakeaway)}</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- 书目 2: 鸟哥的 Linux 私房菜 -->
        <div class="bg-white rounded-2xl p-6 border border-stone-200 academic-card">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-200 mb-5">
                <div>
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-serifMono mb-1.5">
                        <i class="fa-solid fa-terminal text-emerald-700"></i> 实战运维与 Bash 进阶
                    </div>
                    <h3 class="text-base font-bold text-stone-900 font-serifHeading">${escapeHtml(birdBook.name || '《鸟哥的 Linux 私房菜》')}</h3>
                    <p class="text-xs text-stone-500 font-serifMono mt-0.5">作者: ${escapeHtml(birdBook.author || '鸟哥')} • ${escapeHtml(birdBook.startPoint || '从 Bash 开始')}</p>
                </div>

                <div class="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center gap-3 font-serifMono text-xs shrink-0">
                    <div>
                        <div class="text-[10px] text-stone-400 font-bold uppercase">每日阅读目标</div>
                        <div class="text-sm font-bold text-emerald-800" id="book-goal-display-bird">${curBirdGoal} 页/天</div>
                    </div>
                    <div class="flex items-center gap-1">
                        <button onclick="adjustBookDailyGoal('birdLinux', -1)" class="w-7 h-7 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold cursor-pointer">-</button>
                        <button onclick="adjustBookDailyGoal('birdLinux', 1)" class="w-7 h-7 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold cursor-pointer">+</button>
                    </div>
                </div>
            </div>

            <!-- 章节与高频命令 -->
            <div class="space-y-4">
                ${(birdBook.chapters || []).map(ch => `
                    <div class="p-4 rounded-xl bg-stone-50/60 border border-stone-200/70 hover:bg-stone-50 transition">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-2">
                            <h4 class="text-xs sm:text-sm font-bold text-stone-900 font-serifHeading">
                                第 ${ch.chapterNum} 章：${escapeHtml(ch.title)}
                                <span class="text-stone-400 font-serifMono text-xs font-normal">(${escapeHtml(ch.pageRange)} 页)</span>
                            </h4>
                            <span class="text-[11px] font-serifMono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 w-fit">
                                ${escapeHtml(ch.mappedProjectConcept)}
                            </span>
                        </div>
                        <div class="mb-2 p-2.5 bg-stone-900 text-emerald-400 font-serifMono text-xs rounded-lg overflow-x-auto whitespace-pre">${escapeHtml(ch.practicalCommands || '')}</div>
                        <div class="text-xs text-stone-600 font-serifHeading">
                            <span class="font-bold text-stone-800 font-serifMono text-[11px]">工程落地：</span>
                            ${escapeHtml(ch.projectIntegration)}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==========================================================================
// 4. 算法手撕 Lab 渲染器 (对齐代码随想录 12 大分类，直达力扣，支持完成标记)
// ==========================================================================

let currentAlgoCategory = '全部';
let algoSearchKeyword = '';

function renderLearningAlgoTab() {
    const container = document.getElementById('algo-lab-container');
    if (!container) return;
    const catalog = (typeof ALGORITHM_LAB_CATALOG !== 'undefined') ? ALGORITHM_LAB_CATALOG : [];
    
    // 获取已完成题目集合
    let completedMap = {};
    if (typeof stateManager !== 'undefined' && stateManager && stateManager.getState) {
        const st = stateManager.getState();
        completedMap = (st.learningSystem && st.learningSystem.completedAlgos) || {};
    } else if (appState && appState.learningSystem) {
        completedMap = appState.learningSystem.completedAlgos || {};
    }

    const categories = ['全部', '数组', '链表', '哈希表', '字符串', '双指针法', '栈与队列', '二叉树', '回溯算法', '贪心算法', '动态规划', '单调栈', '图论'];

    // 代码随想录 12 大分类元数据 (用于分类全览图)
    const algoCategoriesMeta = [
        { name: '数组', icon: 'fa-table-cells', desc: '二分/双指针/滑动窗口' },
        { name: '链表', icon: 'fa-link', desc: '虚拟头/环检测/双指针' },
        { name: '哈希表', icon: 'fa-hashtag', desc: '频次统计/两数之和/去重' },
        { name: '字符串', icon: 'fa-quote-left', desc: '双指针/KMP前缀表' },
        { name: '双指针法', icon: 'fa-arrows-left-right-to-line', desc: '对撞/快慢指针' },
        { name: '栈与队列', icon: 'fa-layer-group', desc: '单调栈/逆波兰/滑动窗口' },
        { name: '二叉树', icon: 'fa-tree', desc: '递归/迭代/层序/BST' },
        { name: '回溯算法', icon: 'fa-route', desc: '组合/分割/排列/棋盘' },
        { name: '贪心算法', icon: 'fa-hand-holding-dollar', desc: '局部最优/区间调度' },
        { name: '动态规划', icon: 'fa-chess-board', desc: '背包/打家劫舍/子序列' },
        { name: '单调栈', icon: 'fa-chart-simple', desc: '下一个更大元素/接雨水' },
        { name: '图论', icon: 'fa-circle-nodes', desc: '深搜/广搜/并查集/最短路' }
    ];

    // 过滤
    const filtered = catalog.filter(p => {
        const matchCat = currentAlgoCategory === '全部' || p.category === currentAlgoCategory;
        const matchKw = !algoSearchKeyword || 
            p.title.toLowerCase().includes(algoSearchKeyword.toLowerCase()) || 
            String(p.num).includes(algoSearchKeyword) || 
            (p.pattern && p.pattern.toLowerCase().includes(algoSearchKeyword.toLowerCase()));
        return matchCat && matchKw;
    });

    const totalCount = catalog.length;
    const completedCount = catalog.filter(p => !!completedMap[p.num]).length;
    const completeRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // 12 大分类全览全景图卡片 HTML (实时响应 completedMap 的改变)
    const overviewCardsHtml = algoCategoriesMeta.map(c => {
        const catProbs = catalog.filter(p => p.category === c.name);
        const catTotal = catProbs.length;
        const catDone = catProbs.filter(p => !!completedMap[p.num]).length;
        const pct = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0;
        const isAllDone = (catDone === catTotal && catTotal > 0);
        const isSelected = (currentAlgoCategory === c.name);

        let borderBgClass = 'bg-stone-50/70 border-stone-200 hover:border-stone-400 hover:bg-stone-100/60';
        if (isSelected) {
            borderBgClass = 'ring-2 ring-indigo-600 bg-indigo-50/60 border-indigo-400 shadow-sm';
        } else if (isAllDone) {
            borderBgClass = 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-400';
        } else if (catDone > 0) {
            borderBgClass = 'bg-indigo-50/25 border-indigo-200 hover:border-indigo-300';
        }

        let badgeHtml = '';
        if (isAllDone) {
            badgeHtml = '<span class="text-[10px] font-serifMono font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 shrink-0">✓ 通关</span>';
        } else if (catDone > 0) {
            badgeHtml = `<span class="text-[10px] font-serifMono font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 shrink-0">${pct}%</span>`;
        } else {
            badgeHtml = '<span class="text-[10px] font-serifMono font-medium px-1.5 py-0.2 rounded bg-stone-200 text-stone-600 shrink-0">未做</span>';
        }

        const barColor = isAllDone ? 'bg-emerald-500' : (catDone > 0 ? 'bg-indigo-600' : 'bg-transparent');

        return `
            <div onclick="setAlgoCategoryFilter('${c.name}')" class="p-2.5 sm:p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${borderBgClass}" title="点击下钻筛选「${c.name}」(${catDone}/${catTotal}题)">
                <div>
                    <div class="flex items-center justify-between gap-1 mb-1">
                        <span class="inline-flex items-center gap-1.5 font-bold text-xs font-serifHeading ${isAllDone ? 'text-emerald-900' : (isSelected ? 'text-indigo-900' : 'text-stone-800')}">
                            <i class="fa-solid ${c.icon} ${isAllDone ? 'text-emerald-600' : (isSelected ? 'text-indigo-600' : 'text-stone-500')} text-[11px]"></i>
                            <span>${c.name}</span>
                        </span>
                        ${badgeHtml}
                    </div>
                    <div class="text-[9px] text-stone-400 truncate mb-2 font-serifMono">${c.desc}</div>
                </div>
                <div>
                    <div class="flex items-center justify-between text-[10px] font-serifMono text-stone-500 mb-1">
                        <span>进度</span>
                        <span class="font-bold ${isAllDone ? 'text-emerald-700' : (catDone > 0 ? 'text-indigo-700' : 'text-stone-600')}">${catDone} / ${catTotal}</span>
                    </div>
                    <div class="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-300 ${barColor}" style="width: ${pct}%;"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // 分类筛选按钮
    const catButtonsHtml = categories.map(cat => {
        const catTotal = cat === '全部' ? totalCount : catalog.filter(p => p.category === cat).length;
        const catDone = cat === '全部' ? completedCount : catalog.filter(p => p.category === cat && !!completedMap[p.num]).length;
        const isActive = cat === currentAlgoCategory;

        return `
            <button onclick="setAlgoCategoryFilter('${cat}')" class="px-3 py-1.5 rounded-xl text-xs font-serifMono font-bold transition whitespace-nowrap cursor-pointer ${isActive ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}">
                ${cat} <span class="text-[10px] opacity-75 font-normal">(${catDone}/${catTotal})</span>
            </button>
        `;
    }).join('');

    // 题目卡片列表
    const cardsHtml = filtered.map(p => {
        const isDone = !!completedMap[p.num];
        const diffColor = p.difficulty === 'Easy' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : (p.difficulty === 'Medium' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200');

        return `
            <div class="bg-white rounded-2xl p-5 border ${isDone ? 'border-emerald-300 bg-emerald-50/10' : 'border-stone-200'} academic-card flex flex-col justify-between hover:shadow-md transition">
                <div>
                    <!-- 顶栏：题号 + 难度 + 分类 + 力扣直达 + 完成勾选 -->
                    <div class="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="px-2 py-0.5 rounded-md bg-stone-900 text-white text-xs font-serifMono font-bold">
                                #${p.num}
                            </span>
                            <span class="text-xs font-serifMono px-2 py-0.5 rounded border font-bold ${diffColor}">
                                ${escapeHtml(p.difficulty)}
                            </span>
                            <span class="text-xs font-serifMono px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">
                                ${escapeHtml(p.category)}
                            </span>
                            <a href="${p.leetcodeUrl || p.link || '#'}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded ${p.leetcodeUrl && p.leetcodeUrl.includes('kamacoder') ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200' : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'} text-xs font-serifMono font-bold flex items-center gap-1 transition shadow-2xs" title="打开官方题解">
                                <span>${p.leetcodeUrl && p.leetcodeUrl.includes('kamacoder') ? '卡码 ↗' : '力扣 ↗'}</span>
                            </a>
                        </div>
                        <!-- 完成标记勾选框 -->
                        <label class="flex items-center gap-1.5 cursor-pointer font-serifMono text-xs select-none">
                            <input type="checkbox" onchange="toggleAlgoCompletedStatus(${p.num})" ${isDone ? 'checked' : ''} class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer">
                            <span class="font-bold ${isDone ? 'text-emerald-700' : 'text-stone-400'}">
                                ${isDone ? '✓ 已完成' : '○ 未完成'}
                            </span>
                        </label>
                    </div>

                    <!-- 题目标题 -->
                    <h4 class="text-sm font-bold text-stone-900 font-serifHeading mb-2">
                        <a href="${p.leetcodeUrl}" target="_blank" class="hover:text-amber-800 transition">
                            ${escapeHtml(p.title)}
                        </a>
                    </h4>

                    <!-- 核心套路 -->
                    <div class="text-xs text-stone-700 font-serifHeading mb-2.5 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <span class="font-bold text-stone-900 font-serifMono text-[11px] block mb-0.5">
                            <i class="fa-solid fa-lightbulb text-amber-600 mr-1"></i>核心套路与不变量：
                        </span>
                        ${escapeHtml(p.pattern || '暂无套路描述')}
                    </div>

                    <!-- 复杂度 -->
                    <div class="flex items-center gap-3 text-[11px] font-serifMono text-stone-500 mb-2.5 bg-stone-50/70 p-2 rounded-lg border border-stone-200/60">
                        <span><strong class="text-stone-700">时间:</strong> ${escapeHtml(p.timeComp || 'O(n)')}</span>
                        <span>•</span>
                        <span><strong class="text-stone-700">空间:</strong> ${escapeHtml(p.spaceComp || 'O(1)')}</span>
                        <span>•</span>
                        <span><strong>分类:</strong> ${escapeHtml(p.topic || p.category)}</span>
                    </div>

                    <!-- 易错陷阱 -->
                    ${p.mistakes ? `
                        <div class="p-2.5 bg-rose-50/60 rounded-xl border border-rose-200/80 text-xs text-rose-950 font-serifHeading mb-2">
                            <span class="font-bold font-serifMono text-[11px] text-rose-800 block mb-0.5">
                                <i class="fa-solid fa-triangle-exclamation mr-1"></i>经典易错点：
                            </span>
                            <p class="text-[11px] leading-relaxed text-stone-700">${escapeHtml(p.mistakes)}</p>
                        </div>
                    ` : ''}

                    <!-- 工程同构 -->
                    ${p.projectLink ? `
                        <div class="p-2.5 bg-sky-50/60 rounded-xl border border-sky-200/80 text-xs text-sky-950 font-serifHeading">
                            <span class="font-bold font-serifMono text-[11px] text-sky-800 block mb-0.5">
                                <i class="fa-solid fa-code-branch mr-1"></i>项目工程映射：
                            </span>
                            <p class="text-[11px] leading-relaxed text-stone-700">${escapeHtml(p.projectLink)}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <!-- 顶部指标栏 -->
        <div class="bg-white rounded-2xl p-5 border border-stone-200 academic-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <div class="text-xs font-serifMono font-bold text-indigo-700 uppercase tracking-wider mb-1">
                    LeetCode Hand-Coding Laboratory · 代码随想录 12 大体系
                </div>
                <h3 class="text-base font-bold text-stone-900 font-serifHeading flex items-center gap-2">
                    <i class="fa-solid fa-laptop-code text-indigo-700"></i> 手撕算法 Lab (题单参照代码随想录 · 力扣官方直达)
                </h3>
                <p class="text-xs text-stone-500 mt-0.5">
                    涵盖数组、链表、哈希表、字符串、双指针、栈队列、二叉树、回溯、贪心、动态规划、单调栈、图论。支持状态标记与力扣直连。
                </p>
            </div>
            <div class="flex items-center gap-3 font-serifMono text-xs shrink-0">
                <div class="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center">
                    <div class="text-[10px] text-emerald-600">已攻克手撕</div>
                    <div class="text-base font-bold">${completedCount} / ${totalCount} 题</div>
                </div>
                <div class="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-center">
                    <div class="text-[10px] text-indigo-600">完成率</div>
                    <div class="text-base font-bold">${completeRate}%</div>
                </div>
            </div>
        </div>

        <!-- 代码随想录 12 大算法分类全览全景图 (Category Overview Map) -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 academic-card">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100 font-serifMono">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-cubes-stacked text-indigo-700"></i>
                    <span class="font-bold text-stone-900 text-xs sm:text-sm font-serifHeading">代码随想录 12 大算法体系全览图</span>
                    <span class="text-[10px] text-stone-400 font-normal">（点击分类卡片可下钻筛选，勾选完成题目即时动态更新）</span>
                </div>
                <div class="flex items-center gap-2 text-[11px]">
                    <button onclick="setAlgoCategoryFilter('全部')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${currentAlgoCategory === '全部' ? 'bg-stone-900 text-white shadow-2xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}">
                        全部 179 题 (${completedCount}/${totalCount})
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3" id="algo-category-overview-grid">
                ${overviewCardsHtml}
            </div>
        </div>

        <!-- 分类与搜索过滤条 -->
        <div class="bg-white p-4 rounded-2xl border border-stone-200 academic-card space-y-3">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div class="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
                    ${catButtonsHtml}
                </div>
            </div>
            <div class="relative w-full">
                <input type="text" value="${escapeHtml(algoSearchKeyword)}" oninput="handleAlgoSearch(this.value)" placeholder="搜索题号、题目名称或核心套路 (如: 146, LRU, 二分, 滑动窗口)..." class="w-full bg-stone-50 border border-stone-200 text-xs sm:text-sm rounded-xl px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-700 font-serifMono transition">
                <span class="absolute left-3 top-2.5 text-stone-400 text-xs"><i class="fa-solid fa-magnifying-glass"></i></span>
            </div>
        </div>

        <!-- 题目列表 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${cardsHtml || '<div class="col-span-2 text-center py-10 text-stone-400 font-serifMono text-xs">未找到符合条件的题目</div>'}
        </div>
    `;
}

function setAlgoCategoryFilter(cat) {
    currentAlgoCategory = cat;
    renderLearningAlgoTab();
}

function handleAlgoSearch(kw) {
    algoSearchKeyword = kw;
    renderLearningAlgoTab();
}

function toggleAlgoCompletedStatus(algoNum) {
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.toggleAlgoCompleted === 'function') {
        stateManager.toggleAlgoCompleted(algoNum);
    } else {
        if (!appState.learningSystem) appState.learningSystem = {};
        if (!appState.learningSystem.completedAlgos) appState.learningSystem.completedAlgos = {};
        appState.learningSystem.completedAlgos[algoNum] = !appState.learningSystem.completedAlgos[algoNum];
        if (typeof persistState === 'function') persistState();
    }
    renderLearningAlgoTab();
    if (typeof renderHomeWeeklyMetrics === 'function') renderHomeWeeklyMetrics();
    if (typeof renderTodayTasks === 'function') renderTodayTasks();
    if (typeof showToast === 'function') showToast(`题目 #${algoNum} 状态已更新`);
}


function renderLearningQATab() {
    const container = document.getElementById('project-qa-container');
    if (!container) return;
    const list = (typeof PROJECT_QA_CATALOG !== 'undefined') ? PROJECT_QA_CATALOG : [];
    const mastery = (appState.learningSystem && appState.learningSystem.qaMastery) || {};

    container.innerHTML = `
        <div class="bg-white rounded-2xl p-5 border border-stone-200 academic-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <div class="text-xs font-serifMono font-bold text-purple-700 uppercase tracking-wider mb-1">
                    Project-Derived Technical Interview
                </div>
                <h3 class="text-base font-bold text-stone-900 font-serifHeading flex items-center gap-2">
                    <i class="fa-solid fa-circle-question text-purple-700"></i> 项目源码逆向八股自测中心 (每日 30min)
                </h3>
                <p class="text-xs text-stone-500 mt-0.5">杜绝脱离实际背诵，所有八股问题均来自 muduo 底座与 CppAIService 真实实现。</p>
            </div>
            <div class="text-xs font-serifMono text-stone-500 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 shrink-0">
                收录核心真题: <strong class="text-purple-800">${list.length}</strong> 道
            </div>
        </div>

        <div class="space-y-4">
            ${list.map(qa => {
                const isMastered = !!mastery[qa.id];
                return `
                    <div class="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 academic-card hover:border-purple-300 transition" id="qa-${escapeHtml(qa.id)}">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-stone-100 mb-3">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 text-xs font-serifMono font-bold">
                                    ${escapeHtml(qa.category)}
                                </span>
                                <span class="text-xs font-serifMono text-stone-500">
                                    <i class="fa-regular fa-file-code text-stone-400"></i> ${escapeHtml(qa.sourceFile)} (${escapeHtml(qa.sourceLine)})
                                </span>
                            </div>
                            <span class="text-[11px] font-serifMono px-2.5 py-0.5 rounded-full ${isMastered ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'} font-bold w-fit">
                                ${isMastered ? '✓ 已牢记' : '待巩固'}
                            </span>
                        </div>

                        <h4 class="text-sm sm:text-base font-bold text-stone-900 font-serifHeading mb-3">
                            ${escapeHtml(qa.question)}
                        </h4>

                        <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-serifHeading text-stone-700 leading-relaxed mb-3 whitespace-pre-line">
                            <strong class="font-serifMono text-stone-900 block mb-1 text-[11px]">标准工程解答：</strong>
                            ${escapeHtml(qa.answer)}
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div class="p-3 bg-sky-50/70 border border-sky-200/80 rounded-xl text-xs font-serifHeading">
                                <span class="font-bold text-sky-900 font-serifMono text-[11px] block mb-0.5">
                                    <i class="fa-solid fa-comments"></i> 考官连环追问 (Follow-up)：
                                </span>
                                <p class="text-[11px] text-stone-700 leading-relaxed">${escapeHtml(qa.followUp)}</p>
                            </div>
                            <div class="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl text-xs font-serifHeading">
                                <span class="font-bold text-rose-900 font-serifMono text-[11px] block mb-0.5">
                                    <i class="fa-solid fa-skull-crossbones"></i> 经典陷阱与踩坑防范 (Trap)：
                                </span>
                                <p class="text-[11px] text-stone-700 leading-relaxed">${escapeHtml(qa.trap)}</p>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 font-serifMono text-xs">
                            <button onclick="openCrossLinkModal('${qa.id}')" class="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg transition text-[11px] flex items-center gap-1 cursor-pointer">
                                <i class="fa-solid fa-crosshairs text-[10px]"></i> 六维关联追踪
                            </button>
                            <button onclick="toggleQAMastery('${qa.id}')" class="px-3 py-1.5 ${isMastered ? 'bg-stone-100 hover:bg-stone-200 text-stone-700' : 'bg-purple-700 hover:bg-purple-800 text-white'} rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                                <i class="fa-solid ${isMastered ? 'fa-rotate-left' : 'fa-check'}"></i>
                                <span>${isMastered ? '标记复习中' : '标记已掌握'}</span>
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 6. 通识阅读三部曲渲染器
function renderLearningReadingTab() {
    const container = document.getElementById('general-reading-container');
    if (!container) return;
    const list = (typeof GENERAL_READING_CATALOG !== 'undefined') ? GENERAL_READING_CATALOG : [];

    container.innerHTML = `
        <div class="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-950 font-serifHeading flex items-start gap-3">
            <i class="fa-solid fa-shield-halved text-amber-700 mt-0.5 text-base shrink-0"></i>
            <div>
                <span class="font-bold font-serifMono">Secondary Task (次要任务) 原则保护：</span>
                通识阅读旨在开拓思维模型（非暴力沟通提升协作、金融学理解商业成本与ROI、博弈论建立分布式一致性思维）。
                <strong>严格安排于早晨沉淀、午间休整或睡前复盘，绝不抢占白天的 C++ 核心项目攻坚工时。</strong>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            ${list.map(book => `
                <div class="bg-white rounded-2xl p-5 border border-stone-200 academic-card flex flex-col justify-between hover:border-amber-300 transition">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-2">
                            <span class="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold font-serifMono">
                                ${escapeHtml(book.timeOfDay)}
                            </span>
                            <span class="text-[11px] font-serifMono text-amber-700 font-bold">
                                ${book.targetPagesDaily} 页/天
                            </span>
                        </div>

                        <h4 class="text-base font-bold text-stone-900 font-serifHeading mb-1">
                            ${escapeHtml(book.title)}
                        </h4>
                        <p class="text-xs text-stone-500 font-serifMono mb-3">作者: ${escapeHtml(book.author)}</p>

                        <div class="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 mb-3">
                            <span class="text-[11px] font-bold font-serifMono text-stone-500 block mb-1">四维支柱：</span>
                            <div class="flex flex-wrap gap-1.5">
                                ${(book.corePillars || []).map(pil => `
                                    <span class="px-2 py-0.5 bg-white border border-stone-200 rounded text-[11px] font-serifMono text-stone-700">${escapeHtml(pil)}</span>
                                `).join('')}
                            </div>
                        </div>

                        <div class="text-xs text-stone-600 font-serifHeading leading-relaxed">
                            <span class="font-bold font-serifMono text-amber-800 text-[11px] block mb-0.5">工程与协作映射：</span>
                            ${escapeHtml(book.engineeringReflection)}
                        </div>
                    </div>

                    <div class="pt-3 mt-4 border-t border-stone-100 flex items-center justify-between font-serifMono text-xs text-stone-400">
                        <span>次要任务</span>
                        <span class="text-emerald-700 font-bold">非抢占式</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// 六维整体流程穿透透视器 (Cross-Link Engine Inspector)
function openCrossLinkModal(nodeId) {
    const modal = document.getElementById('crosslink-modal');
    if (!modal) return;
    const content = document.getElementById('crosslink-modal-content');
    const title = document.getElementById('crosslink-modal-title');
    const subtitle = document.getElementById('crosslink-modal-subtitle');

    let chain = null;
    if (typeof buildCrossLinkChain === 'function') {
        chain = buildCrossLinkChain(nodeId);
    } else {
        chain = {
            title: "核心技术原理穿透",
            knowledge: { concept: "核心机制与设计思想", dimension: "C++ / Linux" },
            project: { moduleId: "mod_net_eventloop", moduleName: "双核协同架构", architecture: "EventLoop" },
            source: { file: "muduo/net/EventLoop.cc", line: "L1-L100" },
            task: { day: 1, title: "28天攻坚主干", type: "任务体系" },
            evidence: { type: "单元测试与基准", verification: "通过" },
            interview: { point: "技术难点与考点", trap: "生产避坑" }
        };
    }

    if (title) title.innerText = chain.title || "六维技术关联透视";
    if (subtitle) subtitle.innerText = `${chain.id || nodeId} • Knowledge ➔ Project ➔ Source ➔ Task ➔ Evidence ➔ Interview`;

    if (content) {
        content.innerHTML = `
            <!-- 1. Knowledge (理论) -->
            <div class="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200">
                <div class="flex items-center justify-between text-xs font-bold text-sky-900 mb-1">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-brain text-sky-700"></i> 1. 理论维 (Knowledge)</span>
                    <span class="text-[11px] px-1.5 py-0.2 rounded bg-sky-100 border border-sky-300">${escapeHtml(chain.knowledge.dimension || '')}</span>
                </div>
                <p class="text-xs text-stone-700 font-serifHeading leading-relaxed">${escapeHtml(chain.knowledge.concept || '')}</p>
            </div>

            <!-- 2. Project (架构) -->
            <div class="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <div class="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-sitemap text-amber-700"></i> 2. 架构维 (Project)</span>
                    <span class="text-[11px] px-1.5 py-0.2 rounded bg-amber-100 border border-amber-300">${escapeHtml(chain.project.moduleId || '')}</span>
                </div>
                <p class="text-xs text-stone-700 font-serifHeading leading-relaxed">${escapeHtml(chain.project.moduleName || '')} • ${escapeHtml(chain.project.architecture || '')}</p>
            </div>

            <!-- 3. Source (源码) -->
            <div class="p-3.5 rounded-xl bg-stone-100 border border-stone-300">
                <div class="flex items-center justify-between text-xs font-bold text-stone-900 mb-1">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-code text-stone-700"></i> 3. 源码维 (Source)</span>
                    <span class="text-[11px] px-1.5 py-0.2 rounded bg-stone-200">${escapeHtml(chain.source.line || '')}</span>
                </div>
                <p class="text-xs text-stone-800 font-serifMono leading-relaxed">${escapeHtml(chain.source.file || '')}</p>
            </div>

            <!-- 4. Task (任务) -->
            <div class="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
                <div class="flex items-center justify-between text-xs font-bold text-indigo-900 mb-1">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-calendar-check text-indigo-700"></i> 4. 任务维 (Task)</span>
                    <span class="text-[11px] px-1.5 py-0.2 rounded bg-indigo-100 border border-indigo-300">Day ${chain.task.day}</span>
                </div>
                <p class="text-xs text-stone-700 font-serifHeading leading-relaxed">${escapeHtml(chain.task.title || '')} (${escapeHtml(chain.task.type || '')})</p>
            </div>

            <!-- 5. Evidence (凭证) -->
            <div class="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div class="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-certificate text-emerald-700"></i> 5. 凭证维 (Evidence)</span>
                    <span class="text-[11px] px-1.5 py-0.2 rounded bg-emerald-100 border border-emerald-300">已就绪</span>
                </div>
                <p class="text-xs text-stone-700 font-serifHeading leading-relaxed">${escapeHtml(chain.evidence.type || '')}: ${escapeHtml(chain.evidence.verification || '')}</p>
            </div>

            <!-- 6. Interview (面试) -->
            <div class="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
                <div class="flex items-center justify-between text-xs font-bold text-purple-900 mb-1">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-user-tie text-purple-700"></i> 6. 面试维 (Interview)</span>
                    <span class="text-[11px] px-1.5 py-0.2 rounded bg-purple-100 border border-purple-300">真题考查</span>
                </div>
                <p class="text-xs text-stone-700 font-serifHeading leading-relaxed mb-1">${escapeHtml(chain.interview.point || '')}</p>
                <div class="text-[11px] text-rose-800 font-serifHeading">防坑要点: ${escapeHtml(chain.interview.trap || '')}</div>
            </div>
        `;
    }

    modal.classList.remove('hidden');
}

function closeCrossLinkModal() {
    const modal = document.getElementById('crosslink-modal');
    if (modal) modal.classList.add('hidden');
}

// 交互操作助手函数
function toggleAlgoReview(problemNum) {
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.toggleAlgoReview === 'function') {
        const res = stateManager.toggleAlgoReview(problemNum);
        if (typeof appState !== 'undefined' && appState) {
            if (!appState.learningSystem) appState.learningSystem = {};
            if (!appState.learningSystem.algoReviewQueue) appState.learningSystem.algoReviewQueue = {};
            appState.learningSystem.algoReviewQueue[problemNum] = res;
        }
        renderLearningAlgoTab();
        if (typeof showToast === 'function') {
            showToast(res === 'mastered' ? `算法 #${problemNum} 已标记二刷掌握` : `算法 #${problemNum} 已设为待复习`);
        }
        return res;
    }
    if (!appState.learningSystem) appState.learningSystem = {};
    if (!appState.learningSystem.algoReviewQueue) appState.learningSystem.algoReviewQueue = {};
    const cur = appState.learningSystem.algoReviewQueue[problemNum] || 'due';
    const next = cur === 'mastered' ? 'due' : 'mastered';
    appState.learningSystem.algoReviewQueue[problemNum] = next;
    persistState();
    renderLearningAlgoTab();
    if (typeof showToast === 'function') {
        showToast(next === 'mastered' ? `算法 #${problemNum} 已标记二刷掌握` : `算法 #${problemNum} 已设为待复习`);
    }
    return next;
}

function adjustBookDailyGoal(bookKey, delta) {
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.adjustBookDailyGoal === 'function') {
        const res = stateManager.adjustBookDailyGoal(bookKey, delta);
        if (typeof appState !== 'undefined' && appState) {
            if (!appState.learningSystem) appState.learningSystem = {};
            if (!appState.learningSystem.bookDynamicGoals) appState.learningSystem.bookDynamicGoals = { linuxServer: 10, birdLinux: 10 };
            appState.learningSystem.bookDynamicGoals[bookKey] = res;
        }
        renderLearningBooksTab();
        if (typeof showToast === 'function') {
            showToast(`书目目标调整为: ${res} 页/天`);
        }
        return res;
    }
    if (!appState.learningSystem) appState.learningSystem = {};
    if (!appState.learningSystem.bookDynamicGoals) appState.learningSystem.bookDynamicGoals = { linuxServer: 10, birdLinux: 10 };
    const cur = appState.learningSystem.bookDynamicGoals[bookKey] || 10;
    const next = Math.max(5, Math.min(30, cur + delta));
    appState.learningSystem.bookDynamicGoals[bookKey] = next;
    persistState();
    renderLearningBooksTab();
    if (typeof showToast === 'function') {
        showToast(`书目目标调整为: ${next} 页/天`);
    }
    return next;
}

function toggleQAMastery(qaId) {
    let res = false;
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.toggleQAMastery === 'function') {
        res = stateManager.toggleQAMastery(qaId);
        if (typeof appState !== 'undefined' && appState) {
            if (!appState.learningSystem) appState.learningSystem = {};
            if (!appState.learningSystem.qaMastery) appState.learningSystem.qaMastery = {};
            appState.learningSystem.qaMastery[qaId] = res;
        }
    } else {
        if (!appState.learningSystem) appState.learningSystem = {};
        if (!appState.learningSystem.qaMastery) appState.learningSystem.qaMastery = {};
        appState.learningSystem.qaMastery[qaId] = !appState.learningSystem.qaMastery[qaId];
        res = appState.learningSystem.qaMastery[qaId];
        if (typeof persistState === 'function') persistState();
    }
    if (typeof renderLearningQATab === 'function') renderLearningQATab();
    if (typeof loadInterviewQA === 'function' && document.getElementById('quiz-runner-container')) {
        loadInterviewQA(qaId);
    }
    if (typeof showToast === 'function') {
        showToast(res ? `八股考点已标记掌握` : `八股考点设为待巩固`);
    }
    return res;
}

// ==========================================================================
// Phase 6: 求职能力与工程凭证体系 (Career Evidence, Capabilities & Mock Interview)
// ==========================================================================

// 当前选中的面试全案模块与模拟面试状态
appState.activeInterviewModule = 'pitch'; // 'pitch', 'arch', 'difficulties', 'bugs', 'perf', 'selection', 'tradeoff'
appState.currentMockQuestion = null;
appState.mockFollowUpRevealed = false;
appState.mockAnswerRevealed = false;
appState.careerFilterType = 'all';

function getCareerSystemState() {
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.getState === 'function') {
        const s = stateManager.getState();
        if (s && s.careerSystem) return s.careerSystem;
    }
    if (!appState.careerSystem) {
        appState.careerSystem = {
            evidences: typeof DEFAULT_EVIDENCE_CATALOG !== 'undefined' ? [...DEFAULT_EVIDENCE_CATALOG] : [],
            customEvidences: [],
            mockInterviewLogs: [],
            bookmarkedQuestions: [],
            activeCareerTab: 'evidence'
        };
    }
    return appState.careerSystem;
}

function getAllEvidences() {
    const cs = getCareerSystemState();
    const defaults = Array.isArray(cs.evidences) && cs.evidences.length > 0 ? cs.evidences : (typeof DEFAULT_EVIDENCE_CATALOG !== 'undefined' ? DEFAULT_EVIDENCE_CATALOG : []);
    const customs = Array.isArray(cs.customEvidences) ? cs.customEvidences : [];
    return [...defaults, ...customs];
}

// 1. 顶层子标签切换器
function switchCareerTab(tabKey, updateState = true) {
    const tabs = ['evidence', 'capability', 'interview', 'mock', 'star'];
    if (!tabs.includes(tabKey)) tabKey = 'evidence';

    if (updateState) {
        if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.setCareerTab === 'function') {
            stateManager.setCareerTab(tabKey);
        } else {
            const cs = getCareerSystemState();
            cs.activeCareerTab = tabKey;
            persistState();
        }
    }

    tabs.forEach(t => {
        const pane = document.getElementById('career-pane-' + t);
        const btn = document.getElementById('career-tab-btn-' + t);
        if (pane) {
            if (t === tabKey) pane.classList.remove('hidden');
            else pane.classList.add('hidden');
        }
        if (btn) {
            if (t === tabKey) {
                btn.className = "px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 bg-stone-900 text-white border-stone-900 shadow-xs cursor-pointer";
            } else {
                btn.className = "px-3 py-1.5 rounded-xl border font-semibold transition flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200 cursor-pointer";
            }
        }
    });

    if (tabKey === 'evidence') {
        renderCareerEvidenceTab();
    } else if (tabKey === 'capability') {
        renderCareerCapabilityTab();
    } else if (tabKey === 'interview') {
        renderCareerInterviewTab();
    } else if (tabKey === 'mock') {
        renderCareerMockTab();
    } else if (tabKey === 'star') {
        renderCareerStarTab();
    }
}

function renderCareerSystem() {
    const cs = getCareerSystemState();
    const activeTab = cs.activeCareerTab || 'evidence';
    switchCareerTab(activeTab, false);
}

// 2. 子面板 1: 工程凭证库渲染器
function renderCareerEvidenceTab() {
    const statsContainer = document.getElementById('career-evidence-stats-container');
    const filterBar = document.getElementById('evidence-type-filter-bar');
    const badgeEl = document.getElementById('evidence-count-badge');
    const gridEl = document.getElementById('career-evidence-grid');
    if (!gridEl) return;

    const allEv = getAllEvidences();
    const evTypes = (typeof EVIDENCE_TYPES !== 'undefined') ? EVIDENCE_TYPES : {};

    // 统计各类型数量
    const countsByType = {};
    Object.keys(evTypes).forEach(k => countsByType[k] = 0);
    allEv.forEach(e => {
        if (countsByType[e.type] !== undefined) countsByType[e.type]++;
    });

    // 渲染统计指标卡
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <div class="bg-white p-3.5 rounded-2xl border border-stone-200 academic-card">
                    <span class="text-[11px] font-serifMono text-stone-400 font-bold block">有效凭证总数</span>
                    <span class="text-xl font-bold font-serifMono text-stone-900">${allEv.length}</span>
                    <span class="text-[10px] text-emerald-700 block mt-0.5">100% 真实源码/日志</span>
                </div>
                <div class="bg-white p-3.5 rounded-2xl border border-stone-200 academic-card">
                    <span class="text-[11px] font-serifMono text-stone-400 font-bold block">代码修改 & 修复</span>
                    <span class="text-xl font-bold font-serifMono text-sky-700">${(countsByType.code_modification || 0) + (countsByType.bug_fix || 0)}</span>
                    <span class="text-[10px] text-stone-500 block mt-0.5">动手攻坚实录</span>
                </div>
                <div class="bg-white p-3.5 rounded-2xl border border-stone-200 academic-card">
                    <span class="text-[11px] font-serifMono text-stone-400 font-bold block">性能调优 & 压测</span>
                    <span class="text-xl font-bold font-serifMono text-amber-700">${countsByType.benchmark || 0}</span>
                    <span class="text-[10px] text-stone-500 block mt-0.5">QPS/延迟量化</span>
                </div>
                <div class="bg-white p-3.5 rounded-2xl border border-stone-200 academic-card">
                    <span class="text-[11px] font-serifMono text-stone-400 font-bold block">Git Commit 凭据</span>
                    <span class="text-xl font-bold font-serifMono text-indigo-700">${countsByType.git_commit || 0}</span>
                    <span class="text-[10px] text-stone-500 block mt-0.5">可审计哈希追踪</span>
                </div>
                <div class="bg-white p-3.5 rounded-2xl border border-stone-200 academic-card">
                    <span class="text-[11px] font-serifMono text-stone-400 font-bold block">测试断言 & 实验</span>
                    <span class="text-xl font-bold font-serifMono text-purple-700">${(countsByType.testing || 0) + (countsByType.experiment || 0)}</span>
                    <span class="text-[10px] text-stone-500 block mt-0.5">自动化防护网</span>
                </div>
                <div class="bg-white p-3.5 rounded-2xl border border-stone-200 academic-card">
                    <span class="text-[11px] font-serifMono text-stone-400 font-bold block">排错日志 & 总结</span>
                    <span class="text-xl font-bold font-serifMono text-rose-700">${(countsByType.trace_proof || 0) + (countsByType.tech_summary || 0)}</span>
                    <span class="text-[10px] text-stone-500 block mt-0.5">复盘证据链</span>
                </div>
            </div>
        `;
    }

    // 渲染过滤标签栏
    if (filterBar) {
        const curFilter = appState.careerFilterType || 'all';
        let filterHtml = `
            <button onclick="filterEvidenceByType('all')" class="px-2.5 py-1 rounded-lg text-xs font-serifMono font-bold transition cursor-pointer ${curFilter === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}">
                全部 (${allEv.length})
            </button>
        `;
        Object.keys(evTypes).forEach(tk => {
            const tInfo = evTypes[tk];
            const cnt = countsByType[tk] || 0;
            const isSel = curFilter === tk;
            filterHtml += `
                <button onclick="filterEvidenceByType('${tk}')" class="px-2.5 py-1 rounded-lg text-xs font-serifMono font-bold transition whitespace-nowrap cursor-pointer ${isSel ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}">
                    ${escapeHtml(tInfo.label)} (${cnt})
                </button>
            `;
        });
        filterBar.innerHTML = filterHtml;
    }

    // 过滤列表
    const curFilter = appState.careerFilterType || 'all';
    const filtered = curFilter === 'all' ? allEv : allEv.filter(e => e.type === curFilter);

    if (badgeEl) {
        badgeEl.innerText = `显示 ${filtered.length} / 共 ${allEv.length} 条工程凭证`;
    }

    if (filtered.length === 0) {
        gridEl.innerHTML = `
            <div class="col-span-full bg-white p-8 rounded-2xl border border-stone-200 text-center text-stone-400 font-serifMono text-xs">
                <i class="fa-solid fa-folder-open text-2xl mb-2 text-stone-300 block"></i>
                当前分类下暂无凭证。点击右上角「录入工程凭证」添加。
            </div>
        `;
        return;
    }

    gridEl.innerHTML = filtered.map(ev => {
        const tInfo = evTypes[ev.type] || { label: ev.type, color: 'stone' };
        const isCustom = ev.isCustom || (typeof ev.id === 'string' && ev.id.startsWith('custom_ev_'));
        return `
            <div class="bg-white rounded-2xl p-5 border border-stone-200 academic-card flex flex-col justify-between hover:border-amber-300 transition" id="evidence-card-${escapeHtml(ev.id)}">
                <div>
                    <div class="flex items-start justify-between gap-2 mb-2">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold font-serifMono">
                                ${escapeHtml(tInfo.label)}
                            </span>
                            <span class="text-xs font-serifMono text-stone-500 font-medium">
                                <i class="fa-solid fa-link text-stone-400"></i> ${escapeHtml(ev.taskId || '')}
                            </span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] font-serifMono font-bold flex items-center gap-1 shrink-0">
                            <i class="fa-solid fa-shield-halved text-emerald-600"></i> 真实核验
                        </span>
                    </div>

                    <h4 class="text-sm font-bold text-stone-900 font-serifHeading mb-1.5">
                        ${escapeHtml(ev.title)}
                    </h4>

                    <p class="text-xs text-stone-600 font-sans leading-relaxed mb-3">
                        ${escapeHtml(ev.details || '')}
                    </p>

                    <div class="space-y-1.5 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 font-serifMono text-[11px] text-stone-600 mb-3">
                        ${ev.sourceLocation ? `
                            <div class="flex items-center gap-1.5">
                                <span class="text-stone-400 font-bold shrink-0">源码位置:</span>
                                <code class="text-sky-800 bg-sky-50 px-1 rounded truncate">${escapeHtml(ev.sourceLocation)}</code>
                            </div>
                        ` : ''}
                        ${ev.commitHash ? `
                            <div class="flex items-center gap-1.5">
                                <span class="text-stone-400 font-bold shrink-0">Commit:</span>
                                <code class="text-indigo-800 bg-indigo-50 px-1 rounded font-bold">${escapeHtml(ev.commitHash)}</code>
                            </div>
                        ` : ''}
                    </div>

                    <div class="flex flex-wrap gap-1 mb-2">
                        ${(ev.capabilityTags || []).map(tag => `
                            <span class="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10.5px] font-serifMono font-semibold">
                                #${escapeHtml(tag)}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <div class="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-serifMono text-stone-400">
                    <span class="text-[10px]">${ev.createdAt ? new Date(ev.createdAt).toLocaleDateString() : '预设核心凭证'}</span>
                    ${isCustom ? `
                        <button onclick="deleteCustomEvidence('${escapeHtml(ev.id)}')" class="text-rose-600 hover:text-rose-800 font-bold transition cursor-pointer">
                            <i class="fa-solid fa-trash-can mr-1"></i>删除
                        </button>
                    ` : `
                        <span class="text-stone-400 text-[10px]">内置规范凭证</span>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

function filterEvidenceByType(type) {
    appState.careerFilterType = type;
    renderCareerEvidenceTab();
}

// 3. 子面板 2: 14 维能力矩阵渲染器 (严格凭证驱动计算)
function renderCareerCapabilityTab() {
    const summaryContainer = document.getElementById('career-capability-summary-container');
    const gridEl = document.getElementById('career-capability-grid');
    if (!gridEl) return;

    const allEv = getAllEvidences();
    const matrix = (typeof CAPABILITIES_MATRIX !== 'undefined') ? CAPABILITIES_MATRIX : {};
    const capKeys = Object.keys(matrix);

    // 计算全部能力等级
    const evaluated = capKeys.map(k => {
        const item = matrix[k];
        let calc = { level: 0, title: '概念已知', fulfilledTypes: [], missingTypes: [], evidenceCount: 0 };
        if (typeof calculateCapabilityLevel === 'function') {
            calc = calculateCapabilityLevel(k, allEv);
        }
        return {
            key: k,
            item,
            calc
        };
    });

    const totalCaps = evaluated.length;
    const avgLevel = (evaluated.reduce((acc, c) => acc + c.calc.level, 0) / (totalCaps || 1)).toFixed(1);
    const maxLevel = Math.max(0, ...evaluated.map(c => c.calc.level));
    const l3PlusCount = evaluated.filter(c => c.calc.level >= 3).length;

    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <div class="bg-gradient-to-r from-sky-50 via-white to-amber-50 rounded-2xl p-5 border border-sky-200/80 academic-card">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span class="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 text-xs font-serifMono font-bold">
                            能力评估
                        </span>
                        <h3 class="text-base font-bold text-stone-900 font-serifHeading mt-1.5 flex items-center gap-2">
                            <i class="fa-solid fa-layer-group text-sky-600"></i> 14 维后端核心能力矩阵评估态势
                        </h3>
                        <p class="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                            <strong>反浮夸原则：</strong>能力等级<strong>严禁</strong>通过打勾或阅读时长自动解锁，必须由代码修改、调优断言、Bug 修复等真实有效工程凭证驱动晋级。
                        </p>
                    </div>
                    <div class="flex items-center gap-3 font-serifMono shrink-0">
                        <div class="bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-center shadow-xs">
                            <span class="text-[10px] text-stone-400 font-bold block">平均能力评级</span>
                            <span class="text-base font-bold text-sky-700">L${avgLevel} / 6.0</span>
                        </div>
                        <div class="bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-center shadow-xs">
                            <span class="text-[10px] text-stone-400 font-bold block">工程达标 (L3+)</span>
                            <span class="text-base font-bold text-emerald-700">${l3PlusCount} / ${totalCaps} 项</span>
                        </div>
                        <div class="bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-center shadow-xs">
                            <span class="text-[10px] text-stone-400 font-bold block">最高单项等级</span>
                            <span class="text-base font-bold text-amber-600">L${maxLevel}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    gridEl.innerHTML = evaluated.map(({ key, item, calc }) => {
        const levelPct = Math.min(100, Math.round((calc.level / 6) * 100));
        const levelColor = calc.level >= 5 ? 'text-amber-700 bg-amber-50 border-amber-200' :
                           calc.level >= 3 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                           calc.level >= 1 ? 'text-sky-700 bg-sky-50 border-sky-200' :
                           'text-stone-500 bg-stone-50 border-stone-200';
        return `
            <div class="bg-white rounded-2xl p-5 border border-stone-200 academic-card flex flex-col justify-between hover:border-sky-300 transition" id="cap-card-${escapeHtml(key)}">
                <div>
                    <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="px-2.5 py-0.5 rounded-full ${levelColor} border text-xs font-bold font-serifMono">
                            L${calc.level} · ${escapeHtml(calc.title)}
                        </span>
                        <span class="text-[11px] font-serifMono text-stone-400 font-medium">
                            凭证支撑: <strong class="text-stone-700">${calc.evidenceCount}</strong> 项
                        </span>
                    </div>

                    <h4 class="text-base font-bold text-stone-900 font-serifHeading mb-0.5">
                        ${escapeHtml(item.name)}
                    </h4>
                    <p class="text-xs text-stone-500 font-serifMono mb-3">
                        ${escapeHtml(item.category || item.name)}
                    </p>

                    <!-- 进度条 -->
                    <div class="w-full bg-stone-100 rounded-full h-1.5 mb-3 overflow-hidden">
                        <div class="bg-sky-600 h-1.5 rounded-full transition-all duration-500" style="width: ${levelPct}%"></div>
                    </div>

                    <!-- 当前等级定义 -->
                    <div class="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 mb-3 text-xs text-stone-700 font-sans leading-relaxed">
                        <span class="text-[10.5px] font-serifMono font-bold text-stone-400 block mb-0.5">等级定义与界限：</span>
                        ${escapeHtml(item.levels ? (item.levels['L' + calc.level] || item.description || '') : (item.description || ''))}
                    </div>

                    <!-- 已具备凭证类型 -->
                    <div class="mb-3">
                        <span class="text-[10.5px] font-serifMono font-bold text-stone-400 block mb-1">已激活凭据维度：</span>
                        <div class="flex flex-wrap gap-1">
                            ${calc.fulfilledTypes.length > 0 ? calc.fulfilledTypes.map(t => `
                                <span class="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10.5px] font-serifMono">
                                    ✓ ${escapeHtml(t)}
                                </span>
                            `).join('') : `
                                <span class="text-[11px] text-stone-400 font-serifMono">尚未提交关联凭据</span>
                            `}
                        </div>
                    </div>
                </div>

                <div class="pt-3 border-t border-stone-100 font-serifMono text-[11px] text-stone-500 flex items-center justify-between">
                    <span>晋升下一级要求:</span>
                    <span class="text-amber-800 font-bold">
                        ${calc.level < 6 ? (calc.missingTypes.length > 0 ? `需补充: ${calc.missingTypes.join(', ')}` : '已满足下一级凭证') : '已达最高抽象级'}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// 4. 子面板 3: 项目面试全案与 4-Hop 关联渲染器
function switchInterviewModule(modKey) {
    appState.activeInterviewModule = modKey;
    renderCareerInterviewTab();
}

function renderCareerInterviewTab() {
    const navContainer = document.getElementById('career-interview-nav-container');
    const contentContainer = document.getElementById('career-interview-content-container');
    if (!contentContainer) return;

    const interviewData = (typeof PROJECT_INTERVIEW_DATA !== 'undefined') ? PROJECT_INTERVIEW_DATA : {};
    const reverseQuestions = (typeof PROJECT_REVERSE_QUESTIONS !== 'undefined') ? PROJECT_REVERSE_QUESTIONS : [];
    const activeMod = appState.activeInterviewModule || 'pitch';

    const modules = [
        { id: 'pitch', label: '1. 电梯演讲 (30s/1m/3m)', icon: 'fa-stopwatch' },
        { id: 'arch', label: '2. 项目架构全景剖析', icon: 'fa-network-wired' },
        { id: 'difficulties', label: '3. 核心技术难点攻坚', icon: 'fa-mountain' },
        { id: 'bugs', label: '4. 典型生产 Bug 复盘', icon: 'fa-bug' },
        { id: 'perf', label: '5. 性能压测与极限调优', icon: 'fa-gauge-high' },
        { id: 'selection', label: '6. 技术选型理性辩护', icon: 'fa-scale-balanced' },
        { id: 'tradeoff', label: '7. 工程决策与 Trade-off', icon: 'fa-code-fork' }
    ];

    if (navContainer) {
        navContainer.innerHTML = `
            <div class="bg-white p-3.5 rounded-2xl border border-stone-200 academic-card">
                <div class="text-[11px] font-serifMono text-stone-400 font-bold mb-2">
                    <i class="fa-solid fa-briefcase text-amber-600 mr-1"></i> 项目面试 7 大攻坚全案导航：
                </div>
                <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-serifMono">
                    ${modules.map(m => `
                        <button onclick="switchInterviewModule('${m.id}')" class="px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${m.id === activeMod ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'}">
                            <i class="fa-solid ${m.icon}"></i> ${m.label}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 渲染选中的项目全案内容
    let modHtml = '';
    if (activeMod === 'pitch') {
        const p = interviewData.elevatorPitch || {};
        modHtml = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div class="bg-white p-5 rounded-2xl border border-stone-200 academic-card">
                    <div class="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                        <span class="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 text-xs font-serifMono font-bold">30 秒闪电速通</span>
                        <span class="text-xs text-stone-400 font-serifMono">HR / 初筛</span>
                    </div>
                    <p class="text-xs text-stone-700 font-sans leading-relaxed whitespace-pre-line">${escapeHtml(p['30s'] || '基于 Reactor 模型与现代化 C++ 设计的高性能网络服务底座与 AI 编排系统。')}</p>
                </div>
                <div class="bg-white p-5 rounded-2xl border border-stone-200 academic-card">
                    <div class="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                        <span class="px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-800 text-xs font-serifMono font-bold">1 分钟技术概述</span>
                        <span class="text-xs text-sky-600 font-serifMono">一面前半段</span>
                    </div>
                    <p class="text-xs text-stone-700 font-sans leading-relaxed whitespace-pre-line">${escapeHtml(p['1m'] || '深入剖析 muduo 事件循环与 nonblocking IO，并构建 CppAIService 现代化 HTTP 异步服务。')}</p>
                </div>
                <div class="bg-white p-5 rounded-2xl border border-stone-200 academic-card">
                    <div class="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                        <span class="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-serifMono font-bold">3 分钟架构沉浸</span>
                        <span class="text-xs text-amber-600 font-serifMono">架构师 / 主管面</span>
                    </div>
                    <p class="text-xs text-stone-700 font-sans leading-relaxed whitespace-pre-line">${escapeHtml(p['3m'] || '覆盖多线程 EventLoopThreadPool、两段式线程池、零拷贝 readv 优化与内存生命周期防护。')}</p>
                </div>
            </div>
        `;
    } else if (activeMod === 'arch') {
        const arch = interviewData.architecture || {};
        modHtml = `
            <div class="bg-white p-6 rounded-2xl border border-stone-200 academic-card space-y-4">
                <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-serifMono font-bold">项目架构剖析</span>
                    <span class="text-xs text-stone-400 font-serifMono">muduo 底座 ➔ CppAIService 业务微服务</span>
                </div>
                <h4 class="text-base font-bold text-stone-900 font-serifHeading">${escapeHtml(arch.title || '双核多线程 Reactor 架构设计')}</h4>
                <div class="bg-stone-50 p-4 rounded-xl border border-stone-200 font-mono text-xs text-stone-800 overflow-x-auto leading-relaxed whitespace-pre">
${escapeHtml(arch.diagram || `+--------------------------------------------------------------+
|                    Client Connections (epoll)                |
+--------------------------------------------------------------+
                             |
                             v
+--------------------------------------------------------------+
|                 MainReactor (EventLoop)                      |
|            Acceptor -> listenfd -> newConnection             |
+--------------------------------------------------------------+
                             |  Round-Robin
                             v
+--------------------------------------------------------------+
|        SubReactor Pool (EventLoopThreadPool, N threads)       |
|   TcpConnection (nonblocking socket, readv 64KB stack buffer)|
+--------------------------------------------------------------+
                             |  Async Dispatch
                             v
+--------------------------------------------------------------+
|             Business Thread Pool (Worker Threads)            |
|       HTTP Parser / Router / MCP Dispatch / MySQL Pool       |
+--------------------------------------------------------------+`)}
                </div>
                <p class="text-xs text-stone-600 font-sans leading-relaxed">${escapeHtml(arch.explanation || '采用 one loop per thread 模型，MainReactor 只负责 accept 连接，通过轮询分发给 SubReactor 处理 IO 事件；重型业务与数据库查询移交独立的业务工作线程池，杜绝阻塞事件循环。')}</p>
            </div>
        `;
    } else {
        const itemData = interviewData[activeMod] || [];
        modHtml = `
            <div class="space-y-4">
                ${Array.isArray(itemData) && itemData.length > 0 ? itemData.map((item, idx) => `
                    <div class="bg-white p-5 rounded-2xl border border-stone-200 academic-card space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 text-xs font-serifMono font-bold">#0${idx + 1} · ${escapeHtml(item.title || item.topic || '攻坚点')}</span>
                            ${item.tag ? `<span class="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[11px] font-serifMono font-semibold">${escapeHtml(item.tag)}</span>` : ''}
                        </div>
                        <p class="text-xs text-stone-700 font-sans leading-relaxed">${escapeHtml(item.content || item.desc || item.detail || '')}</p>
                        ${item.solution ? `
                            <div class="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-sans">
                                <strong>解决与落地：</strong>${escapeHtml(item.solution)}
                            </div>
                        ` : ''}
                    </div>
                `).join('') : `
                    <div class="bg-white p-6 rounded-2xl border border-stone-200 text-center text-stone-400 font-serifMono text-xs">
                        该模块解析正在沉淀中。
                    </div>
                `}
            </div>
        `;
    }

    // 下半部分：4-Hop 逆向真题穿透展示
    let reverseHtml = `
        <div class="bg-white p-6 rounded-2xl border border-stone-200 academic-card space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                    <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-serifMono font-bold">
                        4-HOP REVERSE INTERVIEW CHAIN
                    </span>
                    <h3 class="text-base font-bold text-stone-900 font-serifHeading mt-1 flex items-center gap-2">
                        <i class="fa-solid fa-arrows-split-up-and-left text-amber-600"></i> 面试真题逆向 4-Hop 关联穿行
                    </h3>
                    <p class="text-xs text-stone-500 mt-0.5 font-serifMono">
                        Question (面试题) ➔ Source (源码精确定位) ➔ Knowledge (理论深度剖析) ➔ Commit (真实提交凭据)
                    </p>
                </div>
                <span class="text-xs text-stone-400 font-serifMono">${reverseQuestions.length} 道高频大厂真题</span>
            </div>

            <div class="space-y-4">
                ${reverseQuestions.map((q, idx) => `
                    <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3" id="reverse-q-${escapeHtml(q.id || String(idx))}">
                        <div class="flex items-start justify-between gap-3">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="w-6 h-6 rounded-lg bg-amber-600 text-white font-bold text-xs flex items-center justify-center font-serifMono">
                                    Q${idx + 1}
                                </span>
                                <h4 class="text-sm font-bold text-stone-900 font-serifHeading">
                                    ${escapeHtml(q.question)}
                                </h4>
                            </div>
                            <span class="px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 text-[10.5px] font-serifMono font-semibold shrink-0">
                                ${escapeHtml(q.tag || '核心考点')}
                            </span>
                        </div>

                        <div class="text-xs text-stone-700 font-sans leading-relaxed bg-white p-3 rounded-lg border border-stone-200/80">
                            <strong class="text-stone-900 block mb-1 font-serifMono">精要答案：</strong>
                            ${escapeHtml(q.answer)}
                        </div>

                        <!-- 4-Hop 关联链接按钮组 -->
                        <div class="flex flex-wrap items-center gap-2 pt-1 font-serifMono text-xs">
                            <span class="text-[11px] text-stone-400 font-bold">4-Hop 联动:</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 flex items-center gap-1 text-[11px]">
                                <i class="fa-solid fa-code text-sky-600"></i> Hop 2: <code>${escapeHtml(q.sourceLocation || 'muduo/net')}</code>
                            </span>
                            ${q.relatedArticleSlug ? `
                                <button onclick="openYuqueArticle('${escapeHtml(q.relatedArticleSlug)}')" class="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 transition flex items-center gap-1 text-[11px] cursor-pointer">
                                    <i class="fa-solid fa-book-bookmark text-blue-600"></i> Hop 3: 查阅专栏剖析
                                </button>
                            ` : ''}
                            ${q.commitHash ? `
                                <button onclick="jumpToEvidence('${escapeHtml(q.commitHash)}')" class="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 hover:bg-indigo-100 transition flex items-center gap-1 text-[11px] cursor-pointer">
                                    <i class="fa-solid fa-code-commit text-indigo-600"></i> Hop 4: 查看 Commit 凭证 (${escapeHtml(q.commitHash)})
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    contentContainer.innerHTML = modHtml + reverseHtml;
}

// 5. 子面板 4: 模拟面试竞技场渲染器
function renderCareerMockTab() {
    const arenaContainer = document.getElementById('career-mock-arena-container');
    const historyContainer = document.getElementById('career-mock-history-container');
    if (!arenaContainer) return;

    const cs = getCareerSystemState();
    const curQ = appState.currentMockQuestion;
    const followUpRevealed = appState.mockFollowUpRevealed;
    const answerRevealed = appState.mockAnswerRevealed;

    arenaContainer.innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 academic-card space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                    <span class="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200 text-xs font-serifMono font-bold">
                        MOCK ARENA
                    </span>
                    <h3 class="text-base font-bold text-stone-900 font-serifHeading mt-1 flex items-center gap-2">
                        <i class="fa-solid fa-microphone text-purple-600"></i> 真实模拟面试演练场
                    </h3>
                    <p class="text-xs text-stone-500 mt-0.5">随机抽取真题 · 考官连环追问 · 评分沉淀</p>
                </div>

                <div class="flex items-center gap-2 font-serifMono text-xs">
                    <button onclick="startMockQuestion('random')" class="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition flex items-center gap-1 cursor-pointer shadow-xs">
                        <i class="fa-solid fa-dice"></i> 随机全真抽检
                    </button>
                    <button onclick="startMockQuestion('project')" class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition flex items-center gap-1 cursor-pointer shadow-xs">
                        <i class="fa-solid fa-diagram-project"></i> 项目深度深挖
                    </button>
                    <button onclick="startMockQuestion('classic')" class="px-3 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold transition flex items-center gap-1 cursor-pointer shadow-xs">
                        <i class="fa-solid fa-code"></i> 八股高频突击
                    </button>
                </div>
            </div>

            ${curQ ? `
                <div class="p-5 bg-purple-50/40 rounded-2xl border border-purple-200 space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 text-xs font-serifMono font-bold">
                            考官出题 [${curQ.mode === 'project' ? '项目深挖' : curQ.mode === 'classic' ? '八股突击' : '随机抽检'}]
                        </span>
                        <span class="text-xs text-purple-700 font-serifMono font-semibold">
                            ${escapeHtml(curQ.tag || 'C++ 高并发')}
                        </span>
                    </div>

                    <h4 class="text-base font-bold text-stone-900 font-serifHeading leading-snug">
                        “${escapeHtml(curQ.question)}”
                    </h4>

                    <!-- 交互控制区：展开追问 / 查看参考答案 -->
                    <div class="flex flex-wrap items-center gap-2 pt-2 font-serifMono text-xs">
                        <button onclick="revealMockFollowUp()" class="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition flex items-center gap-1 cursor-pointer">
                            <i class="fa-solid fa-person-circle-question text-purple-700"></i> ${followUpRevealed ? '收起连环追问' : '考官连环追问 (Follow-up)'}
                        </button>
                        <button onclick="revealMockAnswer()" class="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition flex items-center gap-1 cursor-pointer">
                            <i class="fa-solid fa-lightbulb text-amber-600"></i> ${answerRevealed ? '隐藏参考答案' : '展开标准答案与避坑'}
                        </button>
                    </div>

                    <!-- 连环追问展示区 -->
                    ${followUpRevealed ? `
                        <div class="p-4 bg-white rounded-xl border border-purple-200 text-xs space-y-1.5 font-sans">
                            <div class="font-bold font-serifMono text-purple-900 flex items-center gap-1.5">
                                <i class="fa-solid fa-triangle-exclamation text-amber-600"></i> 考官追问：
                            </div>
                            <p class="text-stone-700 leading-relaxed">${escapeHtml(curQ.followUp || '如果此时突发大量突发连接耗尽文件描述符 (EMFILE)，你的服务如何优雅处理而不崩溃？')}</p>
                        </div>
                    ` : ''}

                    <!-- 参考答案展示区 -->
                    ${answerRevealed ? `
                        <div class="p-4 bg-white rounded-xl border border-amber-200 text-xs space-y-2 font-sans">
                            <div class="font-bold font-serifMono text-amber-900 flex items-center gap-1.5">
                                <i class="fa-solid fa-circle-check text-emerald-600"></i> 参考要点与避坑指南：
                            </div>
                            <p class="text-stone-700 leading-relaxed">${escapeHtml(curQ.answer || '')}</p>
                            ${curQ.trap ? `
                                <div class="text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-[11px] font-serifMono">
                                    <strong>高危避错点:</strong> ${escapeHtml(curQ.trap)}
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}

                    <!-- 自我评分条 -->
                    <div class="pt-3 border-t border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span class="text-xs font-serifMono text-stone-600">回答完毕，请打分完成复盘：</span>
                        <div class="flex items-center gap-1.5 font-serifMono text-xs">
                            ${[1, 2, 3, 4, 5].map(star => `
                                <button onclick="submitMockRating(${star})" class="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-stone-700 hover:text-amber-600 transition flex items-center gap-1 cursor-pointer font-bold">
                                    ${star} <i class="fa-solid fa-star text-amber-500 text-[10px]"></i>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            ` : `
                <div class="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-2 font-serifMono">
                    <i class="fa-solid fa-headset text-3xl text-stone-300 block"></i>
                    <h4 class="text-sm font-bold text-stone-700">尚未开始模拟面试</h4>
                    <p class="text-xs text-stone-400">点击上方按钮抽取题目，模拟大厂真实面试追问现场。</p>
                </div>
            `}
        </div>
    `;

    // 渲染历史演练记录
    if (historyContainer) {
        const logs = cs.mockInterviewLogs || [];
        if (logs.length === 0) {
            historyContainer.innerHTML = `
                <div class="text-center py-6 text-stone-400 font-serifMono text-xs">
                    暂无模拟面试评测记录。
                </div>
            `;
        } else {
            historyContainer.innerHTML = `
                <table class="w-full text-left text-xs font-serifMono">
                    <thead class="text-stone-400 border-b border-stone-100">
                        <tr>
                            <th class="pb-2">演练时间</th>
                            <th class="pb-2">模式</th>
                            <th class="pb-2">考核题目</th>
                            <th class="pb-2 text-center">自我评分</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100">
                        ${logs.slice().reverse().slice(0, 10).map(l => `
                            <tr>
                                <td class="py-2.5 text-stone-400 whitespace-nowrap">${new Date(l.timestamp).toLocaleDateString()}</td>
                                <td class="py-2.5"><span class="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10.5px]">${escapeHtml(l.mode || '模拟')}</span></td>
                                <td class="py-2.5 text-stone-800 font-sans max-w-md truncate" title="${escapeHtml(l.question)}">${escapeHtml(l.question)}</td>
                                <td class="py-2.5 text-center whitespace-nowrap">
                                    <span class="text-amber-600 font-bold">${l.rating || 5}</span>
                                    <i class="fa-solid fa-star text-amber-500 text-[10px]"></i>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    }
}

function startMockQuestion(mode) {
    const reverseQuestions = (typeof PROJECT_REVERSE_QUESTIONS !== 'undefined') ? PROJECT_REVERSE_QUESTIONS : [];
    let pool = [...reverseQuestions];

    if (pool.length === 0) {
        pool = [{
            question: "请详细阐述 muduo 的双缓冲 (Buffer) 扩容原理以及为什么使用 readv 配合栈空间？",
            tag: "Buffer 零拷贝",
            answer: "muduo 在栈上开辟 64KB 临时空间 extrabuf，配合套接字非阻塞接收，使用 readv 一次性填满缓冲区，既减少了系统调用，又避免了为每个连接预先分配过大缓冲区造成的内存膨胀。",
            followUp: "当 readv 读到的数据超过了 Buffer 当前 writable 字节数时，muduo 底层是如何追加扩容的？扩容时涉及哪些指针偏移重置？",
            trap: "千万不能回答每次收到数据都 realloc 重新申请内存，这会导致大量内存碎片和系统调用开销。"
        }];
    }

    const picked = pool[Math.floor(Math.random() * pool.length)];
    appState.currentMockQuestion = {
        mode,
        question: picked.question,
        tag: picked.tag,
        answer: picked.answer,
        followUp: picked.followUp || "请深入剖析该方案在高并发边缘条件下的潜在瓶颈与容灾措施。",
        trap: picked.trap || "切忌只回答八股理论，结合具体代码与压测参数才是高分关键。"
    };
    appState.mockFollowUpRevealed = false;
    appState.mockAnswerRevealed = false;
    renderCareerMockTab();
}

function revealMockFollowUp() {
    appState.mockFollowUpRevealed = !appState.mockFollowUpRevealed;
    renderCareerMockTab();
}

function revealMockAnswer() {
    appState.mockAnswerRevealed = !appState.mockAnswerRevealed;
    renderCareerMockTab();
}

function submitMockRating(rating) {
    if (!appState.currentMockQuestion) return;
    const log = {
        mode: appState.currentMockQuestion.mode,
        question: appState.currentMockQuestion.question,
        rating,
        notes: `自我评分 ${rating} 星`
    };

    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.addMockInterviewLog === 'function') {
        stateManager.addMockInterviewLog(log);
    } else {
        const cs = getCareerSystemState();
        if (!Array.isArray(cs.mockInterviewLogs)) cs.mockInterviewLogs = [];
        log.id = 'mock_' + Date.now();
        log.timestamp = new Date().toISOString();
        cs.mockInterviewLogs.push(log);
        persistState();
    }

    appState.currentMockQuestion = null;
    appState.mockFollowUpRevealed = false;
    appState.mockAnswerRevealed = false;
    renderCareerMockTab();
    if (typeof showToast === 'function') {
        showToast(`模拟演练已完成并沉淀评分: ${rating} 星`);
    }
}

// 6. 子面板 5: STAR 面试故事与简历要点渲染器
function renderCareerStarTab() {
    const starContainer = document.getElementById('career-star-stories-container');
    const resumeContainer = document.getElementById('career-resume-bullets-container');
    if (!starContainer) return;

    const stories = (typeof CAREER_STAR_STORIES !== 'undefined') ? CAREER_STAR_STORIES : [];
    const bullets = (typeof RESUME_BULLETS !== 'undefined') ? RESUME_BULLETS : [];

    starContainer.innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-stone-200 academic-card space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                    <span class="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-900 border border-rose-200 text-xs font-serifMono font-bold">
                        STAR INTERVIEW METHODOLOGY
                    </span>
                    <h3 class="text-base font-bold text-stone-900 font-serifHeading mt-1 flex items-center gap-2">
                        <i class="fa-solid fa-star text-amber-500"></i> 4 大核心 STAR 结构化面试故事
                    </h3>
                    <p class="text-xs text-stone-500 font-serifMono">情境 (Situation) ➔ 任务 (Task) ➔ 行动 (Action) ➔ 量化结果 (Result) ➔ 工程反思 (Reflection)</p>
                </div>
            </div>

            <div class="space-y-4">
                ${stories.map((st, idx) => `
                    <div class="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3" id="star-story-${escapeHtml(st.id || String(idx))}">
                        <div class="flex items-center justify-between">
                            <h4 class="text-sm font-bold text-stone-900 font-serifHeading flex items-center gap-2">
                                <span class="w-6 h-6 rounded-lg bg-rose-700 text-white text-xs font-bold font-serifMono flex items-center justify-center">
                                    0${idx + 1}
                                </span>
                                ${escapeHtml(st.title)}
                            </h4>
                            <button onclick="copyStarStory('${escapeHtml(st.id || String(idx))}')" class="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-lg text-xs font-serifMono font-bold transition flex items-center gap-1 cursor-pointer">
                                <i class="fa-regular fa-copy"></i> 复制 STAR 文本
                            </button>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                            <div class="bg-white p-3 rounded-xl border border-stone-200/80">
                                <strong class="text-stone-900 font-serifMono block mb-1">【S · 情境】</strong>
                                <p class="text-stone-600 leading-relaxed">${escapeHtml(st.situation)}</p>
                            </div>
                            <div class="bg-white p-3 rounded-xl border border-stone-200/80">
                                <strong class="text-stone-900 font-serifMono block mb-1">【T · 任务】</strong>
                                <p class="text-stone-600 leading-relaxed">${escapeHtml(st.task)}</p>
                            </div>
                        </div>

                        <div class="bg-white p-3 rounded-xl border border-stone-200/80 text-xs font-sans">
                            <strong class="text-sky-900 font-serifMono block mb-1">【A · 行动与决策】</strong>
                            <p class="text-stone-700 leading-relaxed">${escapeHtml(st.action)}</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                            <div class="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-emerald-950">
                                <strong class="font-serifMono block mb-1 text-emerald-900">【R · 量化结果】</strong>
                                <p class="leading-relaxed">${escapeHtml(st.result)}</p>
                            </div>
                            <div class="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-amber-950">
                                <strong class="font-serifMono block mb-1 text-amber-900">【反思 · 认知升级】</strong>
                                <p class="leading-relaxed">${escapeHtml(st.reflection || '')}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    if (resumeContainer) {
        resumeContainer.innerHTML = `
            <div class="bg-white rounded-2xl p-6 border border-stone-200 academic-card space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                        <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-serifMono font-bold">
                            RESUME READY BULLETS
                        </span>
                        <h3 class="text-base font-bold text-stone-900 font-serifHeading mt-1 flex items-center gap-2">
                            <i class="fa-solid fa-file-invoice text-emerald-600"></i> 量化简历交付物 (Ready-to-use)
                        </h3>
                        <p class="text-xs text-stone-500 font-serifMono">具备具体动词、真实技术栈、量化参数与指标的生产级简历 Bullet Points</p>
                    </div>
                </div>

                <div class="space-y-3">
                    ${bullets.map((b, idx) => `
                        <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                            <div class="space-y-1.5 flex-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="px-2 py-0.5 rounded bg-stone-200 text-stone-800 text-[10.5px] font-serifMono font-bold">
                                        #0${idx + 1}
                                    </span>
                                    <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10.5px] font-serifMono font-semibold">
                                        ${escapeHtml(b.role || 'C++ 后端研发')}
                                    </span>
                                </div>
                                <p class="text-stone-800 font-sans leading-relaxed text-xs">
                                    ${escapeHtml(b.text)}
                                </p>
                            </div>
                            <button onclick="copyResumeBullet('${escapeHtml(b.text)}')" class="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 font-serifMono font-bold text-xs transition flex items-center gap-1 shrink-0 cursor-pointer">
                                <i class="fa-regular fa-copy"></i> 复制
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// 7. 模态框与辅助交互函数
function openNewEvidenceModal() {
    const modal = document.getElementById('new-evidence-modal');
    if (!modal) return;
    const form = document.getElementById('new-evidence-form');
    if (form) form.reset();
    modal.classList.remove('hidden');
}

function closeNewEvidenceModal() {
    const modal = document.getElementById('new-evidence-modal');
    if (modal) modal.classList.add('hidden');
}

function handleSaveCustomEvidence(event) {
    if (event && event.preventDefault) event.preventDefault();
    const titleEl = document.getElementById('evidence-input-title');
    const typeEl = document.getElementById('evidence-input-type');
    const taskEl = document.getElementById('evidence-input-task');
    const sourceEl = document.getElementById('evidence-input-source');
    const commitEl = document.getElementById('evidence-input-commit');
    const tagsEl = document.getElementById('evidence-input-tags');
    const detailsEl = document.getElementById('evidence-input-details');

    const title = titleEl ? titleEl.value.trim() : '';
    const type = typeEl ? typeEl.value : 'code_mod';
    const taskId = taskEl ? taskEl.value.trim() : '';
    const sourceLocation = sourceEl ? sourceEl.value.trim() : '';
    const commitHash = commitEl ? commitEl.value.trim() : '';
    const rawTags = tagsEl ? tagsEl.value.trim() : '';
    const details = detailsEl ? detailsEl.value.trim() : '';

    if (!title || !details) {
        if (typeof showToast === 'function') showToast('请填写完整的凭证标题与详细经过');
        return;
    }

    const tags = rawTags.split(/[,，\s]+/).filter(Boolean);

    const newEv = {
        title,
        type,
        taskId: taskId || '日常工程攻坚',
        sourceLocation,
        commitHash,
        capabilityTags: tags.length > 0 ? tags : ['C++', '工程实践'],
        details,
        verified: true,
        isCustom: true
    };

    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.addCustomEvidence === 'function') {
        stateManager.addCustomEvidence(newEv);
    } else {
        const cs = getCareerSystemState();
        if (!Array.isArray(cs.customEvidences)) cs.customEvidences = [];
        newEv.id = 'custom_ev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
        newEv.createdAt = new Date().toISOString();
        cs.customEvidences.push(newEv);
        persistState();
    }

    closeNewEvidenceModal();
    renderCareerEvidenceTab();
    renderCareerCapabilityTab();
    if (typeof showToast === 'function') {
        showToast(`已录入工程凭证「${title}」`);
    }
}

function deleteCustomEvidence(evId) {
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.deleteCustomEvidence === 'function') {
        stateManager.deleteCustomEvidence(evId);
    } else {
        const cs = getCareerSystemState();
        if (Array.isArray(cs.customEvidences)) {
            cs.customEvidences = cs.customEvidences.filter(e => e.id !== evId);
            persistState();
        }
    }
    renderCareerEvidenceTab();
    renderCareerCapabilityTab();
    if (typeof showToast === 'function') {
        showToast('已删除工程凭证');
    }
}

function jumpToEvidence(commitHash) {
    switchView('career');
    switchCareerTab('evidence');
    if (commitHash) {
        appState.careerFilterType = 'git_commit';
        renderCareerEvidenceTab();
        if (typeof showToast === 'function') {
            showToast(`已定位 Commit 凭据: ${commitHash}`);
        }
    }
}

function copyStarStory(storyId) {
    const stories = (typeof CAREER_STAR_STORIES !== 'undefined') ? CAREER_STAR_STORIES : [];
    const st = stories.find(s => s.id === storyId) || stories[0];
    if (!st) return;
    const text = `【${st.title}】\n情境(Situation): ${st.situation}\n任务(Task): ${st.task}\n行动(Action): ${st.action}\n结果(Result): ${st.result}\n工程反思: ${st.reflection || ''}`;
    copyTextToClipboard(text, `已复制 STAR 故事「${st.title}」`);
}

function copyResumeBullet(text) {
    copyTextToClipboard(text, '已复制简历要点');
}

function copyTextToClipboard(text, successMsg = '已复制到剪贴板') {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            if (typeof showToast === 'function') showToast(successMsg);
        }).catch(() => {
            fallbackCopyText(text, successMsg);
        });
    } else {
        fallbackCopyText(text, successMsg);
    }
}

function fallbackCopyText(text, successMsg) {
    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (typeof showToast === 'function') showToast(successMsg);
    } catch (e) {
        console.warn('Copy failed:', e);
    }
}

// ==========================================================================
// Phase 7: 日程导入与任务排程引擎 (App Implementation)
// ==========================================================================

function getSchedulerSystemState() {
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.getState === 'function') {
        const s = stateManager.getState();
        if (s && s.schedulerSystem) return s.schedulerSystem;
    }
    if (!appState.schedulerSystem) {
        appState.schedulerSystem = {
            calendarSource: { type: 'none', fileName: '', lastSyncTime: null, events: [] },
            googleTasks: [],
            dailySchedule: {
                date: (typeof RFC5545Parser !== 'undefined' && RFC5545Parser.getTodayDateStr) ? RFC5545Parser.getTodayDateStr() : new Date().toISOString().slice(0, 10),
                availableMinutes: 840,
                freeSlots: [],
                scheduledBlocks: [],
                deficitMinutes: 0,
                compressionApplied: false,
                compressionLogs: []
            },
            incompleteDiagnostics: {},
            dailyReviews: {},
            activeSchedulerTab: 'planner'
        };
    }
    return appState.schedulerSystem;
}

function switchSchedulerTab(tabKey, updateState = true) {
    const tabs = ['planner', 'calendar', 'diagnostics', 'review'];
    tabs.forEach(k => {
        const btn = document.getElementById(`scheduler-tab-btn-${k}`);
        const pane = document.getElementById(`scheduler-pane-${k}`);
        if (btn) {
            btn.className = (k === tabKey)
                ? 'px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 bg-stone-900 text-white border-stone-900 shadow-xs cursor-pointer'
                : 'px-3 py-1.5 rounded-xl border font-semibold transition flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200 cursor-pointer';
        }
        if (pane) {
            if (k === tabKey) pane.classList.remove('hidden');
            else pane.classList.add('hidden');
        }
    });

    if (updateState && typeof stateManager !== 'undefined' && stateManager && typeof stateManager.setSchedulerTab === 'function') {
        stateManager.setSchedulerTab(tabKey);
    }

    if (tabKey === 'planner') {
        renderSchedulerPlanner();
    } else if (tabKey === 'calendar') {
        renderSchedulerCalendar();
    } else if (tabKey === 'diagnostics') {
        renderSchedulerDiagnostics();
    } else if (tabKey === 'review') {
        renderSchedulerReview();
    }
}

function renderSchedulerSystem() {
    const ss = getSchedulerSystemState();
    const activeTab = ss.activeSchedulerTab || 'planner';
    switchSchedulerTab(activeTab, false);
}

// 1. 子面板 1: 今日智能时间轴与心流块
function renderSchedulerPlanner() {
    const ss = getSchedulerSystemState();
    const dateLabel = document.getElementById('scheduler-current-date-label');
    const statsContainer = document.getElementById('scheduler-stats-container');
    const deficitContainer = document.getElementById('scheduler-deficit-alert-container');
    const timelineGrid = document.getElementById('scheduler-timeline-grid');
    if (!timelineGrid) return;

    const todayStr = (typeof RFC5545Parser !== 'undefined' && RFC5545Parser.getTodayDateStr)
        ? RFC5545Parser.getTodayDateStr()
        : new Date().toISOString().slice(0, 10);

    if (dateLabel) {
        dateLabel.innerText = `排程基准日期：${todayStr}`;
    }

    let dailyPlan = ss.dailySchedule;
    if (!dailyPlan || !dailyPlan.scheduledBlocks || dailyPlan.scheduledBlocks.length === 0) {
        // 首次未计算排程时自动触发基准计算
        runSmartScheduleCalculation(false);
        dailyPlan = ss.dailySchedule;
    }

    const availableMin = dailyPlan ? (dailyPlan.availableMinutes || 0) : 840;
    const deficitMin = dailyPlan ? (dailyPlan.deficitMinutes || 0) : 0;
    const blocks = dailyPlan ? (dailyPlan.scheduledBlocks || []) : [];
    const totalDemanded = 405; // 6.75h

    // 渲染摘要卡片
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="bg-white p-3.5 rounded-2xl border border-stone-200 academic-card">
                <span class="text-[11px] font-serifMono text-stone-400 font-bold block">标准全量需求工时</span>
                <span class="text-xl font-bold font-serifMono text-stone-900">${(totalDemanded / 60).toFixed(1)}h</span>
                <span class="text-[10px] text-stone-500 block mt-0.5">6级流水线标准负荷 (405m)</span>
            </div>
            <div class="bg-white p-3.5 rounded-2xl border border-stone-200 academic-card">
                <span class="text-[11px] font-serifMono text-stone-400 font-bold block">外部日历可用工时</span>
                <span class="text-xl font-bold font-serifMono ${availableMin < totalDemanded ? 'text-amber-700' : 'text-emerald-700'}">${(availableMin / 60).toFixed(1)}h</span>
                <span class="text-[10px] text-stone-500 block mt-0.5">${availableMin} 分钟有效专注窗口</span>
            </div>
            <div class="bg-white p-3.5 rounded-2xl border border-stone-200 academic-card">
                <span class="text-[11px] font-serifMono text-stone-400 font-bold block">时间赤字与模式</span>
                <span class="text-xl font-bold font-serifMono ${deficitMin > 0 ? 'text-rose-700' : 'text-sky-700'}">
                    ${deficitMin > 0 ? `-${deficitMin}m` : '无赤字'}
                </span>
                <span class="text-[10px] ${deficitMin > 0 ? 'text-rose-600' : 'text-emerald-700'} block mt-0.5">
                    ${deficitMin > 0 ? '自适应逐级压缩中' : '充裕·保质执行'}
                </span>
            </div>
            <div class="bg-white p-3.5 rounded-2xl border border-stone-200 academic-card">
                <span class="text-[11px] font-serifMono text-stone-400 font-bold block">编排心流块数</span>
                <span class="text-xl font-bold font-serifMono text-indigo-700">${blocks.length} 块</span>
                <span class="text-[10px] text-stone-500 block mt-0.5">认知上下文切换最小化</span>
            </div>
        `;
    }

    // 渲染赤字警示与压缩明细
    if (deficitContainer) {
        if (dailyPlan && dailyPlan.compressionApplied && dailyPlan.compressionLogs && dailyPlan.compressionLogs.length > 0) {
            const logsHtml = dailyPlan.compressionLogs.map(log => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-angle-right text-amber-600 mt-1"></i><span>${log}</span></li>`).join('');
            deficitContainer.innerHTML = `
                <div class="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 font-serifMono text-xs space-y-2">
                    <div class="flex items-center justify-between font-bold text-sm">
                        <span class="flex items-center gap-2">
                            <i class="fa-solid fa-triangle-exclamation text-amber-600"></i>
                            <span>触发自适应调整次要任务工时（今日可用工时不足，自动保护 S 级与 A 级主干）</span>
                        </span>
                        <span class="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[11px]">赤字 ${deficitMin}m</span>
                    </div>
                    <ul class="space-y-1 text-[11.5px] text-stone-700 pl-1">
                        ${logsHtml}
                    </ul>
                </div>
            `;
        } else {
            deficitContainer.innerHTML = '';
        }
    }

    // 渲染时间轴卡片
    if (blocks.length === 0) {
        timelineGrid.innerHTML = `
            <div class="text-center py-10 text-stone-400 font-serifMono text-xs">
                <i class="fa-solid fa-calendar-xmark text-3xl mb-2 text-stone-300"></i>
                <p>当前无编排日程，请点击右上角「重新计算排程」或「导入日历」。</p>
            </div>
        `;
        return;
    }

    timelineGrid.innerHTML = blocks.map((b, idx) => {
        const tierBadge = b.tier === 'S'
            ? 'bg-amber-100 text-amber-900 border-amber-300'
            : (b.tier === 'A'
                ? 'bg-sky-100 text-sky-900 border-sky-300'
                : (b.tier === 'B'
                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'));

        const isCompleted = b.status === 'completed';

        return `
            <div class="p-4 rounded-xl border ${isCompleted ? 'bg-stone-50/80 border-stone-200 opacity-70' : 'bg-white border-stone-200 hover:border-stone-400'} academic-card transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-start sm:items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-base text-stone-700 shrink-0 font-serifMono font-bold">
                        ${idx + 1}
                    </div>
                    <div>
                        <div class="flex flex-wrap items-center gap-2 mb-1">
                            <span class="px-2 py-0.5 rounded-md border font-serifMono font-bold text-[10px] ${tierBadge}">
                                [${b.tier}级] ${b.tierKey || ''}
                            </span>
                            <span class="font-serifMono font-bold text-xs text-stone-900">
                                ${b.startTimeStr} ~ ${b.endTimeStr}
                            </span>
                            <span class="text-[11px] font-serifMono text-stone-400">
                                (${b.durationMinutes} min)
                            </span>
                        </div>
                        <h4 class="font-bold text-sm text-stone-900 font-serifHeading ${isCompleted ? 'line-through text-stone-400' : ''}">
                            <i class="fa-solid ${b.icon || 'fa-cubes'} text-${b.color || 'stone'}-600 mr-1.5"></i>
                            ${b.title}
                        </h4>
                    </div>
                </div>

                <div class="flex items-center gap-2 font-serifMono text-xs shrink-0 self-end sm:self-auto">
                    <button onclick="toggleScheduledBlockStatus('${b.id}')" class="px-3 py-1.5 rounded-xl border ${isCompleted ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'} font-bold transition flex items-center gap-1 cursor-pointer">
                        <i class="fa-solid ${isCompleted ? 'fa-circle-check text-emerald-600' : 'fa-circle text-stone-400'}"></i>
                        <span>${isCompleted ? '已完成' : '打卡标记'}</span>
                    </button>
                    ${!isCompleted ? `
                        <button onclick="openTaskDiagnosticModal('${b.id}')" class="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold transition flex items-center gap-1 cursor-pointer" title="遇到卡点/未完成时录入工程归因">
                            <i class="fa-solid fa-stethoscope text-amber-600"></i>
                            <span>诊断</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function toggleScheduledBlockStatus(blockId) {
    const ss = getSchedulerSystemState();
    if (!ss.dailySchedule || !Array.isArray(ss.dailySchedule.scheduledBlocks)) return;
    const blk = ss.dailySchedule.scheduledBlocks.find(b => b.id === blockId);
    if (!blk) return;
    blk.status = (blk.status === 'completed') ? 'scheduled' : 'completed';
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.updateDailySchedule === 'function') {
        stateManager.updateDailySchedule(ss.dailySchedule);
    }
    renderSchedulerPlanner();
    if (typeof showToast === 'function') {
        showToast(blk.status === 'completed' ? `已完成: ${blk.title}` : `已恢复: ${blk.title}`);
    }
}

// 2. 子面板 2: 外部日历冲突与空闲矩阵
function renderSchedulerCalendar() {
    const ss = getSchedulerSystemState();
    const sourceBadge = document.getElementById('calendar-source-badge');
    const busyList = document.getElementById('calendar-busy-list');
    const freeList = document.getElementById('calendar-free-slots-list');
    const tasksContainer = document.getElementById('google-tasks-container');
    const tasksCountBadge = document.getElementById('google-tasks-count-badge');

    const cal = ss.calendarSource || { type: 'none', events: [] };
    const events = Array.isArray(cal.events) ? cal.events : [];
    const tasks = Array.isArray(ss.googleTasks) ? ss.googleTasks : [];

    if (sourceBadge) {
        if (cal.type !== 'none' && events.length > 0) {
            sourceBadge.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>已载入：${cal.fileName || '外部日历'} (${events.length} 个事件)</span>
                </span>
            `;
        } else {
            sourceBadge.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                    <span class="w-2 h-2 rounded-full bg-stone-400"></span>
                    <span>未载入外部日历 (点击上方「导入日历」上传 .ics)</span>
                </span>
            `;
        }
    }

    // 计算可用矩阵
    const matrix = (typeof TimeConflictMatrix !== 'undefined')
        ? TimeConflictMatrix.calculateAvailability(events)
        : { mergedBusy: [], freeSlots: [] };

    // 渲染 busy 区间
    if (busyList) {
        if (matrix.mergedBusy.length === 0) {
            busyList.innerHTML = `
                <div class="p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-400 text-xs font-serifMono text-center">
                    今日无外部冲突会议/课程占用，专注窗口充裕。
                </div>
            `;
        } else {
            busyList.innerHTML = matrix.mergedBusy.map(b => {
                const sStr = (typeof TimeConflictMatrix !== 'undefined') ? TimeConflictMatrix._minToTimeStr(b.start) : `${b.start}m`;
                const eStr = (typeof TimeConflictMatrix !== 'undefined') ? TimeConflictMatrix._minToTimeStr(b.end) : `${b.end}m`;
                return `
                    <div class="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950 font-serifMono text-xs flex items-center justify-between">
                        <div>
                            <span class="font-bold text-rose-900 block">${(b.titles || ['外部日程']).join(' / ')}</span>
                            <span class="text-[11px] text-rose-700">${sStr} ~ ${eStr} (占用 ${b.end - b.start}m，含缓冲)</span>
                        </div>
                        <span class="px-2 py-0.5 rounded bg-rose-200 text-rose-800 text-[10px] font-bold">BUSY</span>
                    </div>
                `;
            }).join('');
        }
    }

    // 渲染 free 区间
    if (freeList) {
        if (matrix.freeSlots.length === 0) {
            freeList.innerHTML = `
                <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-serifMono text-center">
                    警告：外部日程已完全占满工作日，无连续空闲槽。
                </div>
            `;
        } else {
            freeList.innerHTML = matrix.freeSlots.map((s, idx) => `
                <div class="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 font-serifMono text-xs flex items-center justify-between">
                    <div>
                        <span class="font-bold text-emerald-900 block">连续专注时隙 #${idx + 1}</span>
                        <span class="text-[11px] text-emerald-700">${s.startTimeStr} ~ ${s.endTimeStr} (${s.durationMinutes} 分钟可用)</span>
                    </div>
                    <span class="px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 text-[10px] font-bold">FREE</span>
                </div>
            `).join('');
        }
    }

    // 渲染 Google Tasks
    if (tasksCountBadge) tasksCountBadge.innerText = `共 ${tasks.length} 条`;
    if (tasksContainer) {
        if (tasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-400 text-xs font-serifMono text-center">
                    暂未导入 Google Tasks 外部待办任务。可点击上方「导入日历/待办」批量导入。
                </div>
            `;
        } else {
            tasksContainer.innerHTML = tasks.map(t => `
                <div class="p-3 rounded-xl bg-white border border-stone-200 font-serifMono text-xs flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <i class="fa-regular ${t.status === 'completed' ? 'fa-circle-check text-emerald-600' : 'fa-circle text-stone-400'}"></i>
                        <span class="${t.status === 'completed' ? 'line-through text-stone-400' : 'text-stone-800 font-bold'}">${t.title}</span>
                    </div>
                    ${t.due ? `<span class="text-[10px] text-stone-400">截止: ${t.due}</span>` : ''}
                </div>
            `).join('');
        }
    }
}

// 3. 子面板 3: 任务未完成工程根因诊断
function renderSchedulerDiagnostics() {
    const ss = getSchedulerSystemState();
    const incompleteContainer = document.getElementById('scheduler-incomplete-tasks-list');
    const historyContainer = document.getElementById('scheduler-diagnostics-history-container');
    if (!incompleteContainer) return;

    // 获取今日任务待办
    let routineTasks = [];
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.getState === 'function') {
        const s = stateManager.getState();
        if (s && s.dailyRoutine && Array.isArray(s.dailyRoutine.tasks)) {
            routineTasks = s.dailyRoutine.tasks;
        }
    }

    const incomplete = routineTasks.filter(t => !t.completed);
    const diags = ss.incompleteDiagnostics || {};

    if (incomplete.length === 0) {
        incompleteContainer.innerHTML = `
            <div class="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-serifMono text-center">
                <i class="fa-solid fa-circle-check text-2xl text-emerald-600 mb-2"></i>
                <p class="font-bold">太棒了！今日常规待办任务已全部攻克完毕，无未完成项。</p>
            </div>
        `;
    } else {
        incompleteContainer.innerHTML = incomplete.map(t => {
            const diag = diags[t.id];
            return `
                <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 academic-card font-serifMono text-xs space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-stone-900 font-serifHeading text-sm flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold font-serifMono">[${t.tier || 'A'}级]</span>
                            <span>${t.title}</span>
                        </span>
                        <button onclick="openTaskDiagnosticModal('${t.id}')" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition flex items-center gap-1 cursor-pointer">
                            <i class="fa-solid fa-stethoscope"></i>
                            <span>${diag ? '重新归因诊断' : '录入根因归因'}</span>
                        </button>
                    </div>
                    ${diag ? `
                        <div class="p-3 rounded-lg bg-white border border-amber-200 text-stone-700 space-y-1">
                            <div class="flex items-center gap-2 text-amber-900 font-bold">
                                <i class="fa-solid fa-bug text-amber-600"></i>
                                <span>定性归因：${diag.reasonName}</span>
                                <span class="text-[10px] text-stone-400 font-normal">(${new Date(diag.timestamp).toLocaleTimeString()})</span>
                            </div>
                            <p class="text-[11.5px] text-stone-600">现场手记：${diag.note}</p>
                            <p class="text-[11.5px] text-emerald-800 font-semibold">自适应对策：${diag.suggestedAction}</p>
                        </div>
                    ` : `
                        <p class="text-[11px] text-stone-400">暂未分析该任务未能按时交付的深层工程原因。请点击诊断录入。</p>
                    `}
                </div>
            `;
        }).join('');
    }

    // 渲染历史记录
    if (historyContainer) {
        const entries = Object.values(diags);
        if (entries.length === 0) {
            historyContainer.innerHTML = `
                <div class="text-center py-6 text-stone-400 font-serifMono text-xs">
                    暂无历史工程根因诊断档案。
                </div>
            `;
        } else {
            historyContainer.innerHTML = entries.map(d => `
                <div class="p-3.5 rounded-xl border border-stone-200 bg-white academic-card font-serifMono text-xs space-y-1.5">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-stone-900">${d.taskTitle}</span>
                        <span class="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px]">${d.reasonName}</span>
                    </div>
                    <p class="text-[11px] text-stone-600">${d.note}</p>
                    <p class="text-[11px] text-indigo-700">建议动作：${d.suggestedAction}</p>
                </div>
            `).join('');
        }
    }
}

// 4. 子面板 4: 每日工程复盘与成长报表
function renderSchedulerReview() {
    const reviewContent = document.getElementById('scheduler-review-content');
    if (!reviewContent) return;

    const ss = getSchedulerSystemState();
    const todayStr = (typeof RFC5545Parser !== 'undefined' && RFC5545Parser.getTodayDateStr)
        ? RFC5545Parser.getTodayDateStr()
        : new Date().toISOString().slice(0, 10);

    let reviewObj = ss.dailyReviews ? ss.dailyReviews[todayStr] : null;

    if (!reviewObj || !reviewObj.markdownReport) {
        // 自动构建今日复盘报表
        let routineTasks = [];
        let scheduledBlocks = [];
        let careerEvidences = [];

        if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.getState === 'function') {
            const s = stateManager.getState();
            if (s.dailyRoutine && Array.isArray(s.dailyRoutine.tasks)) routineTasks = s.dailyRoutine.tasks;
            if (s.schedulerSystem && s.schedulerSystem.dailySchedule && Array.isArray(s.schedulerSystem.dailySchedule.scheduledBlocks)) {
                scheduledBlocks = s.schedulerSystem.dailySchedule.scheduledBlocks;
            }
            if (s.careerSystem) {
                careerEvidences = [...(s.careerSystem.evidences || []), ...(s.careerSystem.customEvidences || [])];
            }
        }

        if (typeof DailyReviewGenerator !== 'undefined') {
            reviewObj = DailyReviewGenerator.generate({
                date: todayStr,
                routineTasks,
                scheduledBlocks,
                diagnostics: ss.incompleteDiagnostics || {},
                careerEvidences
            });
        }
    }

    if (reviewObj && reviewObj.markdownReport) {
        reviewContent.innerText = reviewObj.markdownReport;
    } else {
        reviewContent.innerText = '# 每日工程复盘报表生成中...';
    }
}

// ==================== 模态框与操作交互 ====================

let currentCalendarImportTab = 'file';

function openCalendarImportModal() {
    const modal = document.getElementById('calendar-import-modal');
    if (!modal) return;
    setCalendarImportTab('file');
    const dateInput = document.getElementById('calendar-target-date');
    if (dateInput && !dateInput.value) {
        dateInput.value = (typeof RFC5545Parser !== 'undefined' && RFC5545Parser.getTodayDateStr)
            ? RFC5545Parser.getTodayDateStr()
            : new Date().toISOString().slice(0, 10);
    }
    modal.classList.remove('hidden');
}

function closeCalendarImportModal() {
    const modal = document.getElementById('calendar-import-modal');
    if (modal) modal.classList.add('hidden');
}

function setCalendarImportTab(tabKey) {
    currentCalendarImportTab = tabKey;
    const tabs = ['file', 'text', 'tasks'];
    tabs.forEach(k => {
        const btn = document.getElementById(`cal-import-tab-${k}`);
        const pane = document.getElementById(`cal-import-pane-${k}`);
        if (btn) {
            btn.className = (k === tabKey)
                ? 'px-3 py-1.5 rounded-lg bg-stone-900 text-white font-bold cursor-pointer'
                : 'px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer';
        }
        if (pane) {
            if (k === tabKey) pane.classList.remove('hidden');
            else pane.classList.add('hidden');
        }
    });
}

function submitCalendarImport() {
    const dateInput = document.getElementById('calendar-target-date');
    const targetDate = dateInput ? dateInput.value : '';

    if (currentCalendarImportTab === 'file') {
        const fileInput = document.getElementById('ics-file-input');
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert('请先选择一个 .ics 日历导出文件！');
            return;
        }
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const raw = e.target.result;
            processIcsContent(raw, file.name, targetDate);
        };
        reader.readAsText(file);
    } else if (currentCalendarImportTab === 'text') {
        const textInput = document.getElementById('ics-paste-input');
        const raw = textInput ? textInput.value : '';
        if (!raw || !raw.trim()) {
            alert('请粘贴 iCalendar 格式内容！');
            return;
        }
        processIcsContent(raw, 'pasted_calendar.ics', targetDate);
    } else if (currentCalendarImportTab === 'tasks') {
        const tasksInput = document.getElementById('tasks-paste-input');
        const raw = tasksInput ? tasksInput.value : '';
        if (!raw || !raw.trim()) {
            alert('请粘贴 Google Tasks JSON 或待办列表！');
            return;
        }
        const parsedTasks = (typeof GoogleTasksAdapter !== 'undefined') ? GoogleTasksAdapter.parse(raw) : [];
        if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.importCalendarSource === 'function') {
            stateManager.importCalendarSource({
                type: 'tasks',
                fileName: 'google_tasks.json',
                googleTasks: parsedTasks
            });
        }
        runSmartScheduleCalculation(true);
        closeCalendarImportModal();
        if (typeof showToast === 'function') showToast(`成功导入 ${parsedTasks.length} 条 Google Tasks 待办`);
    }
}

function processIcsContent(rawContent, fileName, targetDate) {
    const events = (typeof RFC5545Parser !== 'undefined')
        ? RFC5545Parser.parse(rawContent, targetDate)
        : [];

    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.importCalendarSource === 'function') {
        stateManager.importCalendarSource({
            type: 'ics',
            fileName: fileName || 'calendar.ics',
            events: events
        });
    }

    runSmartScheduleCalculation(true);
    closeCalendarImportModal();
    if (typeof showToast === 'function') {
        showToast(`成功解析载入 ${events.length} 个外部日历事件！`);
    }
}

function runSmartScheduleCalculation(showFeedback = true) {
    const ss = getSchedulerSystemState();
    const events = (ss.calendarSource && Array.isArray(ss.calendarSource.events)) ? ss.calendarSource.events : [];

    const matrix = (typeof TimeConflictMatrix !== 'undefined')
        ? TimeConflictMatrix.calculateAvailability(events)
        : { freeSlots: [], totalFreeMinutes: 840 };

    const freeMinutes = matrix.totalFreeMinutes;
    const compression = (typeof TimeDeficitCompressor !== 'undefined')
        ? TimeDeficitCompressor.compress(freeMinutes)
        : { deficitMinutes: 0, compressionApplied: false, compressionLogs: [], allocated: {} };

    const blocks = (typeof FlowBlockSequencer !== 'undefined')
        ? FlowBlockSequencer.sequence(compression, matrix.freeSlots)
        : [];

    const newDailySchedule = {
        date: (typeof RFC5545Parser !== 'undefined' && RFC5545Parser.getTodayDateStr) ? RFC5545Parser.getTodayDateStr() : new Date().toISOString().slice(0, 10),
        availableMinutes: freeMinutes,
        freeSlots: matrix.freeSlots,
        scheduledBlocks: blocks,
        deficitMinutes: compression.deficitMinutes,
        compressionApplied: compression.compressionApplied,
        compressionLogs: compression.compressionLogs
    };

    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.updateDailySchedule === 'function') {
        stateManager.updateDailySchedule(newDailySchedule);
    } else {
        ss.dailySchedule = newDailySchedule;
    }

    renderSchedulerPlanner();
    if (showFeedback && typeof showToast === 'function') {
        showToast('智能排程自适应重算已完成！');
    }
}

// 诊断模态框
function openTaskDiagnosticModal(taskId) {
    const modal = document.getElementById('task-diagnostic-modal');
    const selectEl = document.getElementById('diag-task-select');
    if (!modal) return;

    let routineTasks = [];
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.getState === 'function') {
        const s = stateManager.getState();
        if (s && s.dailyRoutine && Array.isArray(s.dailyRoutine.tasks)) {
            routineTasks = s.dailyRoutine.tasks;
        }
    }

    if (selectEl) {
        selectEl.innerHTML = routineTasks.map(t => `
            <option value="${t.id}" ${t.id === taskId ? 'selected' : ''}>[${t.tier || 'A'}级] ${t.title} (${t.completed ? '已打卡' : '未完成'})</option>
        `).join('');
        if (taskId) selectEl.value = taskId;
    }

    const noteEl = document.getElementById('diag-notes');
    if (noteEl) noteEl.value = '';

    modal.classList.remove('hidden');
}

function closeTaskDiagnosticModal() {
    const modal = document.getElementById('task-diagnostic-modal');
    if (modal) modal.classList.add('hidden');
}

function submitTaskDiagnostic(event) {
    if (event) event.preventDefault();
    const taskSelect = document.getElementById('diag-task-select');
    const reasonSelect = document.getElementById('diag-reason-select');
    const notesEl = document.getElementById('diag-notes');

    const taskId = taskSelect ? taskSelect.value : '';
    const reasonKey = reasonSelect ? reasonSelect.value : 'underestimated_time';
    const notes = notesEl ? notesEl.value : '';

    let taskObj = null;
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.getState === 'function') {
        const s = stateManager.getState();
        if (s && s.dailyRoutine && Array.isArray(s.dailyRoutine.tasks)) {
            taskObj = s.dailyRoutine.tasks.find(t => t.id === taskId);
        }
    }

    const diagResult = (typeof DiagnosticEngine !== 'undefined')
        ? DiagnosticEngine.diagnose(reasonKey, notes, taskObj)
        : { taskId, reasonKey, note: notes, timestamp: new Date().toISOString() };

    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.recordTaskDiagnostic === 'function') {
        stateManager.recordTaskDiagnostic(taskId, diagResult);
    }

    closeTaskDiagnosticModal();
    renderSchedulerDiagnostics();
    if (typeof showToast === 'function') {
        showToast(`已录入「${diagResult.reasonName || reasonKey}」归因并生成自适应调整策略！`);
    }
}

function generateAndExportDailyReview() {
    const ss = getSchedulerSystemState();
    const todayStr = (typeof RFC5545Parser !== 'undefined' && RFC5545Parser.getTodayDateStr)
        ? RFC5545Parser.getTodayDateStr()
        : new Date().toISOString().slice(0, 10);

    let routineTasks = [];
    let scheduledBlocks = [];
    let careerEvidences = [];

    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.getState === 'function') {
        const s = stateManager.getState();
        if (s.dailyRoutine && Array.isArray(s.dailyRoutine.tasks)) routineTasks = s.dailyRoutine.tasks;
        if (s.schedulerSystem && s.schedulerSystem.dailySchedule && Array.isArray(s.schedulerSystem.dailySchedule.scheduledBlocks)) {
            scheduledBlocks = s.schedulerSystem.dailySchedule.scheduledBlocks;
        }
        if (s.careerSystem) {
            careerEvidences = [...(s.careerSystem.evidences || []), ...(s.careerSystem.customEvidences || [])];
        }
    }

    const review = (typeof DailyReviewGenerator !== 'undefined')
        ? DailyReviewGenerator.generate({
            date: todayStr,
            routineTasks,
            scheduledBlocks,
            diagnostics: ss.incompleteDiagnostics || {},
            careerEvidences
        })
        : { markdownReport: '# 每日工程复盘报表' };

    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.saveDailyReviewRecord === 'function') {
        stateManager.saveDailyReviewRecord(todayStr, review);
    }

    switchSchedulerTab('review', true);
    if (typeof showToast === 'function') {
        showToast('已生成今日工程复盘报表（已自动打通求职真实工程凭证）！');
    }
}

function copyReviewMarkdownToClipboard() {
    const el = document.getElementById('scheduler-review-content');
    if (!el || !el.innerText) return;
    copyTextToClipboard(el.innerText, '已复制今日复盘 Markdown 报表');
}

function downloadReviewMarkdown() {
    const el = document.getElementById('scheduler-review-content');
    if (!el || !el.innerText) return;
    const todayStr = (typeof RFC5545Parser !== 'undefined' && RFC5545Parser.getTodayDateStr)
        ? RFC5545Parser.getTodayDateStr()
        : new Date().toISOString().slice(0, 10);

    const blob = new Blob([el.innerText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily_engineering_review_${todayStr}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (typeof showToast === 'function') showToast('每日复盘 Markdown 档案已导出下载');
}
// (V5.1: 已清理针对 classic.html 的遗留未使用的 notebook-textarea 死代码)
// 每日自测中心 (View 5)
function initQuizDaySelector() {
    const sel = document.getElementById('quiz-day-selector');
    if (!sel) return;
    sel.innerHTML = '';

    // 1. muduo 28 天源码自测分组
    const grpDays = document.createElement('optgroup');
    grpDays.label = "muduo 28 天核心源码自测 (Day 01 ~ 28)";
    DAYS_DATASET.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.day;
        opt.innerText = `Day ${item.day < 10 ? '0' + item.day : item.day}: ${item.title}`;
        grpDays.appendChild(opt);
    });
    sel.appendChild(grpDays);

    // 2. CppAIService 15 大模块技术面试题分组
    const grpQA = document.createElement('optgroup');
    grpQA.label = "CppAIService 核心工程面试题 (15 大模块)";
    const qaList = (typeof PROJECT_QA_CATALOG !== 'undefined') ? PROJECT_QA_CATALOG : [];
    qaList.forEach(qa => {
        const opt = document.createElement('option');
        opt.value = qa.id;
        opt.innerText = `[${qa.module || qa.category}] ${qa.question.slice(0, 26)}...`;
        grpQA.appendChild(opt);
    });
    sel.appendChild(grpQA);

    // 绑定 change 事件处理
    sel.onchange = function() {
        const val = this.value;
        if (typeof val === 'string' && val.startsWith('qa_')) {
            loadInterviewQA(val);
        } else {
            loadQuizForDay(parseInt(val) || 1);
        }
    };

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

// 加载并渲染 CppAIService 核心面试题与考点
function loadInterviewQA(qaId) {
    const container = document.getElementById('quiz-runner-container');
    if (!container) return;
    const qaList = (typeof PROJECT_QA_CATALOG !== 'undefined') ? PROJECT_QA_CATALOG : [];
    const qa = qaList.find(q => q.id === qaId) || qaList[0];
    if (!qa) return;

    const mastery = (appState.learningSystem && appState.learningSystem.qaMastery) || {};
    const isMastered = !!mastery[qa.id];

    container.innerHTML = `
        <div class="bg-purple-50/80 p-5 rounded-2xl border border-purple-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-0.5 rounded bg-purple-900 text-white text-xs font-mono font-bold">${escapeHtml(qa.module || 'CppAIService')}</span>
                    <span class="text-xs font-serifMono text-purple-900 font-bold">${escapeHtml(qa.category || '核心考点')}</span>
                </div>
                <h3 class="text-base font-bold text-stone-900 font-serifHeading mt-1">
                    ${escapeHtml(qa.question)}
                </h3>
                <p class="text-xs text-stone-500 font-serifMono mt-1">
                    源码定位: <code>${escapeHtml(qa.sourceFile || 'src/core')} ${escapeHtml(qa.sourceLine || '')}</code>
                </p>
            </div>
            <div class="shrink-0 font-serifMono text-xs">
                <button onclick="toggleQAMastery('${qa.id}')" class="px-3.5 py-1.5 ${isMastered ? 'bg-emerald-700 text-white' : 'bg-white border border-purple-300 text-purple-900'} rounded-xl font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid ${isMastered ? 'fa-check' : 'fa-graduation-cap'}"></i>
                    <span>${isMastered ? '已攻克掌握' : '标记已掌握'}</span>
                </button>
            </div>
        </div>

        <!-- 考点标准回答 -->
        <div class="bg-white p-5 rounded-2xl border border-stone-200 space-y-3 academic-card">
            <div class="flex items-center justify-between">
                <span class="font-bold text-xs font-serifMono text-stone-800 uppercase tracking-wider">
                    <i class="fa-solid fa-award text-amber-600 mr-1"></i> 考官期待的标准回答结构 (Engineering Best-Practice)
                </span>
                <button onclick="copyCurrentInterviewAnswer('${qa.id}')" class="text-xs text-sky-700 hover:text-sky-900 font-serifMono cursor-pointer">
                    <i class="fa-solid fa-copy"></i> 复制回答
                </button>
            </div>
            <div class="p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-800 font-serifHeading leading-relaxed whitespace-pre-line">
                ${escapeHtml(qa.answer)}
            </div>
        </div>

        <!-- 连环追问与陷阱 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${qa.followUp ? `
                <div class="bg-white p-4 rounded-xl border border-amber-200/90 bg-amber-50/20 space-y-2 academic-card">
                    <div class="font-bold text-xs font-serifMono text-amber-900 flex items-center gap-1.5">
                        <i class="fa-solid fa-circle-question text-amber-600"></i> 面试官连环追问 (Follow-up)
                    </div>
                    <p class="text-xs text-stone-700 leading-relaxed font-serifHeading">${escapeHtml(qa.followUp)}</p>
                </div>
            ` : ''}

            ${qa.trap ? `
                <div class="bg-white p-4 rounded-xl border border-rose-200/90 bg-rose-50/20 space-y-2 academic-card">
                    <div class="font-bold text-xs font-serifMono text-rose-900 flex items-center gap-1.5">
                        <i class="fa-solid fa-triangle-exclamation text-rose-600"></i> 致命陷阱与避坑指南 (Traps)
                    </div>
                    <p class="text-xs text-stone-700 leading-relaxed font-serifHeading">${escapeHtml(qa.trap)}</p>
                </div>
            ` : ''}
        </div>
    `;
}


function copyCurrentInterviewAnswer(qaId) {
    const qaList = (typeof PROJECT_QA_CATALOG !== 'undefined') ? PROJECT_QA_CATALOG : [];
    const qa = qaList.find(q => q.id === qaId);
    if (!qa) return;
    navigator.clipboard.writeText(qa.answer).then(() => {
        if (typeof showToast === 'function') showToast('标准回答已复制到剪贴板！');
    }).catch(() => {
        alert('复制失败');
    });
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
            drawerTag.innerText = "项目架构组件";
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
    showToast("完整项目架构 JSON 备份文件已下载");
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
    } else if (e.key === 't' || e.key === 'T') {
        if (typeof toggleTaskSidebar === 'function') {
            toggleTaskSidebar();
        }
    }
});

// 页面加载入口
window.addEventListener('DOMContentLoaded', () => {
    try { loadAndMigrateState(); } catch(e) { console.error('loadAndMigrateState error:', e); }
    try { if (typeof initStudyTimer === 'function') initStudyTimer(); } catch(e) { console.error('initStudyTimer error:', e); }
    try { initQuizDaySelector(); } catch(e) { console.error('initQuizDaySelector error:', e); }
    try { setWorkspaceMode(appState.workspaceMode || 'full'); } catch(e) { console.error('setWorkspaceMode error:', e); }
    try { initTaskSidebar(); } catch(e) { console.error('initTaskSidebar error:', e); }
    try { renderTaskHub(); } catch(e) { console.error('renderTaskHub error:', e); }
    try { updateDashboardMetrics(); } catch(e) { console.error('updateDashboardMetrics error:', e); }
    try { renderHomeDashboard(); } catch(e) { console.error('renderHomeDashboard error:', e); }
    try { renderModuleHierarchyMap(); } catch(e) { console.error('renderModuleHierarchyMap error:', e); }
    try { renderDailyCards(); } catch(e) { console.error('renderDailyCards error:', e); }
    try { renderMappingTable(); } catch(e) { console.error('renderMappingTable error:', e); }
    try { renderLearningSystem(); } catch(e) { console.error('renderLearningSystem error:', e); }
    try { renderCareerSystem(); } catch(e) { console.error('renderCareerSystem error:', e); }
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
                        <div class="flex items-center gap-1.5">
                            <button onclick="switchView('learning'); switchLearningTab('algo');" class="px-2.5 py-1 bg-white border border-indigo-300 hover:bg-indigo-100 text-indigo-900 rounded font-bold transition cursor-pointer flex items-center gap-1">
                                <span>直达手撕 Lab</span> <i class="fa-solid fa-arrow-right text-[9px]"></i>
                            </button>
                            <button onclick="openAlgorithmModal()" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold transition flex items-center gap-1 cursor-pointer">
                                <i class="fa-solid fa-plus text-[10px]"></i> 记录手撕题
                            </button>
                        </div>
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
                    <div class="flex items-center gap-1.5">
                        <button onclick="switchView('learning'); switchLearningTab('books');" class="px-2.5 py-1 bg-white border border-sky-300 hover:bg-sky-100 text-sky-900 rounded font-bold transition cursor-pointer flex items-center gap-1">
                            <span>直达书目伴读</span> <i class="fa-solid fa-arrow-right text-[9px]"></i>
                        </button>
                        <button onclick="openBooksModal('${task.bookKey}')" class="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold transition cursor-pointer">
                            更新页码
                        </button>
                    </div>
                </div>
            `;
        }

        // B 级考点自测专属：直达自测中心
        if (task.id === 'task_b_quiz' || task.category === 'quiz') {
            extraContent = `
                <div class="mt-2.5 p-2 rounded-lg bg-purple-50/70 border border-purple-200 text-xs font-serifMono text-purple-950 flex items-center justify-between">
                    <span>项目代码驱动八股、muduo 考点与阶段自测</span>
                    <button onclick="switchView('quiz')" class="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs">
                        <span>直达自测中心</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>
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
                        <a href="https://www.nowcoder.com/job/center" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded font-bold transition">
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
            <div class="p-3 sm:p-3.5 rounded-xl border ${cardBorder} transition hover:border-stone-400 shadow-2xs">
                <div class="flex items-start justify-between gap-2.5">
                    <div class="flex items-start gap-2.5 min-w-0 flex-1">
                        <input type="checkbox" onchange="toggleTaskCompleted('${task.id}')" ${isDone ? 'checked' : ''} ${isSusp ? 'disabled' : ''} class="mt-0.5 w-4 h-4 rounded text-sky-700 focus:ring-sky-600 cursor-pointer shrink-0">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                ${badgePriority}
                                ${suspensionBadge}
                            </div>
                            <div class="text-xs font-bold mt-1 leading-snug ${isDone ? 'line-through text-stone-400' : 'text-stone-900'}">${escapeHtml(task.title)}</div>
                            <p class="text-[11px] text-stone-500 mt-0.5 leading-relaxed ${isDone ? 'line-through text-stone-400' : ''}">
                                ${escapeHtml(task.subtitle || task.description || '')}
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-1.5 shrink-0 font-serifMono">
                        <span class="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            <i class="fa-regular fa-clock"></i> ${timeLabel}
                        </span>
                        <button onclick="startTimerForTask('${task.id}', '${escapeHtml(task.title)}', '${task.category || 'coding'}', ${task.estimatedMinutes || 30})" class="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold rounded transition flex items-center gap-1 cursor-pointer" title="一键带入专注计时器">
                            <i class="fa-solid fa-stopwatch text-amber-600 text-[10px]"></i>
                            <span>计时</span>
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
            <div class="p-1.5 rounded-lg border ${rateColor} font-serifMono text-center flex flex-col justify-between">
                <div class="text-[9px] text-stone-500 font-bold flex items-center justify-center gap-0.5">
                    ${isToday ? '<span class="w-1 h-1 rounded-full bg-emerald-500 shrink-0"></span>今' : dStr.slice(5)}
                </div>
                <div class="text-xs font-bold my-0.5">${rate}%</div>
                <div class="text-[8px] text-stone-400 truncate">${completed}/${total}</div>
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
    if (typeof renderTodayTasks === 'function') renderTodayTasks();
    if (typeof renderHomeWeeklyMetrics === 'function') renderHomeWeeklyMetrics();
    updateDashboardMetrics();

    if (typeof showToast === 'function') {
        showToast(task.completed ? `已完成任务「${task.title}」` : `已取消任务「${task.title}」完成状态`, task.completed);
    }
}

function openTaskReflectionModal(taskId) {
    const modal = document.getElementById('modal-task-reflection');
    if (!modal) return;
    const routine = ensureDailyRoutineInitialized();
    const task = (routine && routine.tasks) ? routine.tasks.find(t => t.id === taskId) : null;
    const titleEl = document.getElementById('reflection-task-title');
    const idEl = document.getElementById('reflection-task-id');
    if (idEl) idEl.value = taskId;
    if (titleEl && task) titleEl.innerText = task.title;
    modal.classList.remove('hidden');
}

function closeTaskReflectionModal(skip) {
    const modal = document.getElementById('modal-task-reflection');
    if (modal) modal.classList.add('hidden');
    if (skip) {
        const idEl = document.getElementById('reflection-task-id');
        if (idEl && idEl.value) toggleTaskCompleted(idEl.value);
    }
}

function submitTaskReflection(e) {
    if (e && e.preventDefault) e.preventDefault();
    const idEl = document.getElementById('reflection-task-id');
    const learnedEl = document.getElementById('reflection-learned');
    const probEl = document.getElementById('reflection-problem');
    const nextEl = document.getElementById('reflection-next');
    const createLogEl = document.getElementById('reflection-create-log');

    const taskId = idEl ? idEl.value : '';
    const learned = learnedEl ? learnedEl.value.trim() : '';
    const problem = probEl ? probEl.value.trim() : '无';
    const next = nextEl ? nextEl.value.trim() : '';
    const createLog = createLogEl ? createLogEl.checked : false;

    if (taskId) {
        toggleTaskCompleted(taskId);
        if (createLog && (learned || problem !== '无' || next)) {
            if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.addWorkLog === 'function') {
                stateManager.addWorkLog({
                    project: 'CppAIService',
                    module: '待办总结',
                    logType: 'code_feature',
                    what: `完成任务打卡与反思`,
                    problem: problem,
                    solution: '自测通过',
                    learned: learned,
                    next: next
                });
            }
        }
    }
    closeTaskReflectionModal(false);
}

function toggleTaskWithReflection(taskId) {
    const routine = ensureDailyRoutineInitialized();
    const task = (routine && routine.tasks) ? routine.tasks.find(t => t.id === taskId) : null;
    if (task && !task.completed) {
        openTaskReflectionModal(taskId);
    } else {
        toggleTaskCompleted(taskId);
    }
}

// 切换日常模式 (normal / compact)
function setRoutineMode(mode) {
    const routine = ensureDailyRoutineInitialized();
    if (!routine) return;

    routine.mode = mode;
    persistState();
    renderTaskHub();
    if (typeof renderTodayTasks === 'function') renderTodayTasks();
    if (typeof renderHomeWeeklyMetrics === 'function') renderHomeWeeklyMetrics();
    updateDashboardMetrics();

    if (typeof showToast === 'function') {
        showToast(mode === 'compact' ? '已切换至紧凑保底模式 (5.5h 聚焦主干)' : '已切换至标准全量模式 (7.0h)');
    }
}

// 切换算法分类标签时，两级联动更新候选题目下拉列表
function onAlgoTopicChange(topic) {
    const sel = document.getElementById('algo-problem-selector');
    if (!sel) return;
    const catalog = (typeof ALGORITHM_LAB_CATALOG !== 'undefined') ? ALGORITHM_LAB_CATALOG : [];
    const problems = catalog.filter(p => (p.category === topic || p.topic === topic));
    
    sel.innerHTML = `<option value="">-- 请选择【${escapeHtml(topic || '本类')}】下的候选题目 (${problems.length}题) --</option>`;
    problems.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.num;
        opt.textContent = `${p.num}. ${p.title} [${p.difficulty}]`;
        sel.appendChild(opt);
    });
}

function populateAlgoProblemSelector(selectedTopic) {
    const topicEl = document.getElementById('algo-topic');
    const topic = selectedTopic || (topicEl ? topicEl.value : '数组') || '数组';
    if (topicEl && !topicEl.value) {
        topicEl.value = topic;
    }
    onAlgoTopicChange(topic);
}

function onAlgoProblemSelect(val) {
    if (!val) return;
    const catalog = (typeof ALGORITHM_LAB_CATALOG !== 'undefined') ? ALGORITHM_LAB_CATALOG : [];
    const problem = catalog.find(p => String(p.num) === String(val));
    if (!problem) return;

    const numEl = document.getElementById('algo-num');
    if (numEl) numEl.value = String(problem.num);

    const titleEl = document.getElementById('algo-title');
    if (titleEl) {
        const rawTitle = String(problem.title || '');
        const cleanTitle = rawTitle.replace(new RegExp(`^${problem.num}\\.\\s*`), '');
        titleEl.value = `${problem.num}. ${cleanTitle}`;
    }

    const topicEl = document.getElementById('algo-topic');
    if (topicEl && problem.category) {
        topicEl.value = String(problem.category);
    }

    const timeEl = document.getElementById('algo-time-comp');
    if (timeEl) timeEl.value = String(problem.timeComp || 'O(n)');

    const spaceEl = document.getElementById('algo-space-comp');
    if (spaceEl) spaceEl.value = String(problem.spaceComp || 'O(1)');

    const noteEl = document.getElementById('algo-note');
    if (noteEl) {
        let noteParts = [];
        if (problem.pattern) noteParts.push(`【核心模式】${problem.pattern}`);
        if (problem.mistakes) noteParts.push(`【注意要点】${problem.mistakes}`);
        noteEl.value = noteParts.join('\n');
    }
}

// 算法记录弹窗
function openAlgorithmModal() {
    const topicEl = document.getElementById('algo-topic');
    const currentTopic = topicEl?.value || '数组';
    populateAlgoProblemSelector(currentTopic);
    const sel = document.getElementById('algo-problem-selector');
    if (sel) sel.value = '';
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

    const num = String(document.getElementById('algo-num')?.value ?? '').trim();
    const title = String(document.getElementById('algo-title')?.value ?? '').trim();
    const topic = String(document.getElementById('algo-topic')?.value || '数组');
    const timeComp = String(document.getElementById('algo-time-comp')?.value || 'O(n)').trim();
    const spaceComp = String(document.getElementById('algo-space-comp')?.value || 'O(1)').trim();
    const passed = document.getElementById('algo-passed')?.checked ?? true;
    const note = String(document.getElementById('algo-note')?.value ?? '').trim();

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

    // 若在 179 题单库中，自动同步完成状态到 stateManager 与 appState
    const algoNumInt = parseInt(num, 10);
    if (!isNaN(algoNumInt)) {
        if (!appState.learningSystem) appState.learningSystem = {};
        if (!appState.learningSystem.completedAlgos) appState.learningSystem.completedAlgos = {};
        appState.learningSystem.completedAlgos[algoNumInt] = passed;

        const sm = (typeof stateManager !== 'undefined' && stateManager) ? stateManager :
                   (typeof window !== 'undefined' && window.stateManager) ? window.stateManager :
                   (typeof globalThis !== 'undefined' && globalThis.stateManager) ? globalThis.stateManager : null;
        if (sm) {
            if (typeof sm.setAlgoCompleted === 'function') {
                sm.setAlgoCompleted(algoNumInt, passed);
            } else if (typeof sm.toggleAlgoCompleted === 'function') {
                const isCompleted = sm.isAlgoCompleted ? sm.isAlgoCompleted(algoNumInt) : false;
                if (passed !== isCompleted) {
                    sm.toggleAlgoCompleted(algoNumInt);
                }
            }
        }
    }

    // 清空表单
    const numEl = document.getElementById('algo-num');
    if (numEl) numEl.value = '';
    const titleEl = document.getElementById('algo-title');
    if (titleEl) titleEl.value = '';
    const noteEl = document.getElementById('algo-note');
    if (noteEl) noteEl.value = '';
    const selEl = document.getElementById('algo-problem-selector');
    if (selEl) selEl.value = '';

    persistState();
    closeAlgorithmModal();
    renderTaskHub();
    updateDashboardMetrics();

    // 若当前正在算法手撕 Lab，即时刷新分类全览与题目列表
    if (typeof renderLearningAlgoTab === 'function') {
        renderLearningAlgoTab();
    }

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
    if (typeof renderTodayTasks === 'function') renderTodayTasks();
    if (typeof renderHomeWeeklyMetrics === 'function') renderHomeWeeklyMetrics();
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
    if (typeof renderTodayTasks === 'function') renderTodayTasks();
    if (typeof renderHomeWeeklyMetrics === 'function') renderHomeWeeklyMetrics();
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
    window.toggleTaskSidebar = toggleTaskSidebar;
    window.initTaskSidebar = initTaskSidebar;
    window.renderTaskHub = renderTaskHub;
    window.toggleTaskCompleted = toggleTaskCompleted;
    window.setRoutineMode = setRoutineMode;
    window.openAlgorithmModal = openAlgorithmModal;
    window.populateAlgoProblemSelector = populateAlgoProblemSelector;
    window.onAlgoTopicChange = onAlgoTopicChange;
    window.onAlgoProblemSelect = onAlgoProblemSelect;
    window.toggleCppLearnedStatus = toggleCppLearnedStatus;
    window.toggleLinuxLearnedStatus = toggleLinuxLearnedStatus;
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

    // Phase 5 方法挂载
    window.switchLearningTab = switchLearningTab;
    window.renderLearningSystem = renderLearningSystem;
    window.renderLearningCppTab = renderLearningCppTab;
    window.renderLearningLinuxTab = renderLearningLinuxTab;
    window.renderLearningBooksTab = renderLearningBooksTab;
    window.renderLearningAlgoTab = renderLearningAlgoTab;
    window.renderLearningQATab = renderLearningQATab;
    window.renderLearningReadingTab = renderLearningReadingTab;
    window.openCrossLinkModal = openCrossLinkModal;
    window.closeCrossLinkModal = closeCrossLinkModal;
    window.toggleAlgoReview = toggleAlgoReview;
    window.adjustBookDailyGoal = adjustBookDailyGoal;
    window.toggleQAMastery = toggleQAMastery;

    // Phase 6 方法挂载
    window.switchCareerTab = switchCareerTab;
    window.renderCareerSystem = renderCareerSystem;
    window.renderCareerEvidenceTab = renderCareerEvidenceTab;
    window.renderCareerCapabilityTab = renderCareerCapabilityTab;
    window.renderCareerInterviewTab = renderCareerInterviewTab;
    window.renderCareerMockTab = renderCareerMockTab;
    window.renderCareerStarTab = renderCareerStarTab;
    window.switchInterviewModule = switchInterviewModule;
    window.openNewEvidenceModal = openNewEvidenceModal;
    window.closeNewEvidenceModal = closeNewEvidenceModal;
    window.handleSaveCustomEvidence = handleSaveCustomEvidence;
    window.deleteCustomEvidence = deleteCustomEvidence;
    window.filterEvidenceByType = filterEvidenceByType;
    window.startMockQuestion = startMockQuestion;
    window.revealMockFollowUp = revealMockFollowUp;
    window.revealMockAnswer = revealMockAnswer;
    window.submitMockRating = submitMockRating;
    window.jumpToEvidence = jumpToEvidence;
    window.copyStarStory = copyStarStory;
    window.copyResumeBullet = copyResumeBullet;

    // Phase 7 方法挂载
    window.switchSchedulerTab = switchSchedulerTab;
    window.renderSchedulerSystem = renderSchedulerSystem;
    window.renderSchedulerPlanner = renderSchedulerPlanner;
    window.renderSchedulerCalendar = renderSchedulerCalendar;
    window.renderSchedulerDiagnostics = renderSchedulerDiagnostics;
    window.renderSchedulerReview = renderSchedulerReview;
    window.openCalendarImportModal = openCalendarImportModal;
    window.closeCalendarImportModal = closeCalendarImportModal;
    window.setCalendarImportTab = setCalendarImportTab;
    window.submitCalendarImport = submitCalendarImport;
    window.processIcsContent = processIcsContent;
    window.runSmartScheduleCalculation = runSmartScheduleCalculation;
    window.toggleScheduledBlockStatus = toggleScheduledBlockStatus;
    window.openTaskDiagnosticModal = openTaskDiagnosticModal;
    window.closeTaskDiagnosticModal = closeTaskDiagnosticModal;
    window.submitTaskDiagnostic = submitTaskDiagnostic;
    window.generateAndExportDailyReview = generateAndExportDailyReview;
    window.copyReviewMarkdownToClipboard = copyReviewMarkdownToClipboard;
    window.downloadReviewMarkdown = downloadReviewMarkdown;
}

if (typeof globalThis !== 'undefined') {
    globalThis.setWorkspaceMode = setWorkspaceMode;
    globalThis.switchTopologyTab = switchTopologyTab;
    globalThis.scrollToTopology = scrollToTopology;
    globalThis.openYuqueArticle = openYuqueArticle;
    globalThis.openTopologyDrawer = openTopologyDrawer;
    globalThis.closeTopologyDrawer = closeTopologyDrawer;

    // Phase 4 方法挂载
    globalThis.toggleTaskSidebar = toggleTaskSidebar;
    globalThis.initTaskSidebar = initTaskSidebar;
    globalThis.renderTaskHub = renderTaskHub;
    globalThis.toggleTaskCompleted = toggleTaskCompleted;
    globalThis.setRoutineMode = setRoutineMode;
    globalThis.openAlgorithmModal = openAlgorithmModal;
    globalThis.populateAlgoProblemSelector = populateAlgoProblemSelector;
    globalThis.onAlgoTopicChange = onAlgoTopicChange;
    globalThis.onAlgoProblemSelect = onAlgoProblemSelect;
    globalThis.toggleCppLearnedStatus = toggleCppLearnedStatus;
    globalThis.toggleLinuxLearnedStatus = toggleLinuxLearnedStatus;
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

    // Phase 5 方法挂载
    globalThis.switchLearningTab = switchLearningTab;
    globalThis.renderLearningSystem = renderLearningSystem;
    globalThis.renderLearningCppTab = renderLearningCppTab;
    globalThis.renderLearningLinuxTab = renderLearningLinuxTab;
    globalThis.renderLearningBooksTab = renderLearningBooksTab;
    globalThis.renderLearningAlgoTab = renderLearningAlgoTab;
    globalThis.renderLearningQATab = renderLearningQATab;
    globalThis.renderLearningReadingTab = renderLearningReadingTab;
    globalThis.openCrossLinkModal = openCrossLinkModal;
    globalThis.closeCrossLinkModal = closeCrossLinkModal;
    globalThis.toggleAlgoReview = toggleAlgoReview;
    globalThis.adjustBookDailyGoal = adjustBookDailyGoal;
    globalThis.toggleQAMastery = toggleQAMastery;

    // Phase 6 方法挂载
    globalThis.switchCareerTab = switchCareerTab;
    globalThis.renderCareerSystem = renderCareerSystem;
    globalThis.renderCareerEvidenceTab = renderCareerEvidenceTab;
    globalThis.renderCareerCapabilityTab = renderCareerCapabilityTab;
    globalThis.renderCareerInterviewTab = renderCareerInterviewTab;
    globalThis.renderCareerMockTab = renderCareerMockTab;
    globalThis.renderCareerStarTab = renderCareerStarTab;
    globalThis.switchInterviewModule = switchInterviewModule;
    globalThis.openNewEvidenceModal = openNewEvidenceModal;
    globalThis.closeNewEvidenceModal = closeNewEvidenceModal;
    globalThis.handleSaveCustomEvidence = handleSaveCustomEvidence;
    globalThis.deleteCustomEvidence = deleteCustomEvidence;
    globalThis.filterEvidenceByType = filterEvidenceByType;
    globalThis.startMockQuestion = startMockQuestion;
    globalThis.revealMockFollowUp = revealMockFollowUp;
    globalThis.revealMockAnswer = revealMockAnswer;
    globalThis.submitMockRating = submitMockRating;
    globalThis.jumpToEvidence = jumpToEvidence;
    globalThis.copyStarStory = copyStarStory;
    globalThis.copyResumeBullet = copyResumeBullet;

    // Phase 7 方法挂载
    globalThis.switchSchedulerTab = switchSchedulerTab;
    globalThis.renderSchedulerSystem = renderSchedulerSystem;
    globalThis.renderSchedulerPlanner = renderSchedulerPlanner;
    globalThis.renderSchedulerCalendar = renderSchedulerCalendar;
    globalThis.renderSchedulerDiagnostics = renderSchedulerDiagnostics;
    globalThis.renderSchedulerReview = renderSchedulerReview;
    globalThis.openCalendarImportModal = openCalendarImportModal;
    globalThis.closeCalendarImportModal = closeCalendarImportModal;
    globalThis.setCalendarImportTab = setCalendarImportTab;
    globalThis.submitCalendarImport = submitCalendarImport;
    globalThis.processIcsContent = processIcsContent;
    globalThis.runSmartScheduleCalculation = runSmartScheduleCalculation;
    globalThis.toggleScheduledBlockStatus = toggleScheduledBlockStatus;
    globalThis.openTaskDiagnosticModal = openTaskDiagnosticModal;
    globalThis.closeTaskDiagnosticModal = closeTaskDiagnosticModal;
    globalThis.submitTaskDiagnostic = submitTaskDiagnostic;
    globalThis.generateAndExportDailyReview = generateAndExportDailyReview;
    globalThis.copyReviewMarkdownToClipboard = copyReviewMarkdownToClipboard;
    globalThis.downloadReviewMarkdown = downloadReviewMarkdown;
    // V5.1 方法挂载
    globalThis.renderHomeDashboard = renderHomeDashboard;
    globalThis.renderTodayTasks = renderTodayTasks;
    globalThis.renderHomeProjectProgress = renderHomeProjectProgress;
    globalThis.renderHomeMuduoProgress = renderHomeMuduoProgress;
    globalThis.renderRecentWorkLogs = renderRecentWorkLogs;
    globalThis.renderHomeWeeklyMetrics = renderHomeWeeklyMetrics;
    globalThis.openWorkLogModal = openWorkLogModal;
    globalThis.closeWorkLogModal = closeWorkLogModal;
    globalThis.handleSaveWorkLog = handleSaveWorkLog;
    globalThis.toggleTaskWithReflection = toggleTaskWithReflection;
    globalThis.openTaskReflectionModal = openTaskReflectionModal;
    globalThis.closeTaskReflectionModal = closeTaskReflectionModal;
    globalThis.submitTaskReflection = submitTaskReflection;
    globalThis.openQuickAddTaskModal = openQuickAddTaskModal;
    globalThis.renderModuleHierarchyMap = renderModuleHierarchyMap;
    globalThis.toggleArchTopologyCollapse = toggleArchTopologyCollapse;
    globalThis.handleModuleSourceClick = handleModuleSourceClick;
    globalThis.handleModuleTaskClick = handleModuleTaskClick;
    globalThis.handleModuleInterviewClick = handleModuleInterviewClick;
    globalThis.handleModuleTestClick = handleModuleTestClick;

}


// ==========================================================================
// V5.2: 个人工程学习工作台核心驱动模块 (V5.2 Workbench Core)
// 首页 5 大区域真实数据渲染、工程日志增删流、代码语法高亮查看器
// ==========================================================================

function renderHomeDashboard() {
    renderTodayTasks();
    renderHomeProjectProgress();
    renderHomeMuduoProgress();
    renderRecentWorkLogs();
    renderHomeWeeklyMetrics();
    renderCalendarGrid();
}

function renderTodayTasks() {
    const container = document.getElementById('today-tasks-container');
    const badge = document.getElementById('today-tasks-badge');
    if (!container) return;

    const routine = (typeof ensureDailyRoutineInitialized === 'function') ? ensureDailyRoutineInitialized() : null;
    let tasks = [];
    if (routine && Array.isArray(routine.tasks)) {
        tasks = routine.tasks;
    } else if (appState && Array.isArray(appState.unifiedTasks)) {
        tasks = appState.unifiedTasks;
    }

    const mode = (routine && routine.mode) || 'normal';
    const activeTasks = (typeof TaskDomain !== 'undefined' && typeof TaskDomain.filterTasksByMode === 'function')
        ? TaskDomain.filterTasksByMode(tasks, mode)
        : tasks;

    const totalMinutes = activeTasks.reduce((acc, t) => acc + (Number(t.estimatedMinutes) || 0), 0);
    const completedCount = activeTasks.filter(t => !!t.completed).length;
    const totalHours = (totalMinutes / 60).toFixed(1);

    if (badge) {
        badge.innerText = `预计 ${totalHours}h · ${completedCount}/${activeTasks.length} 已完成`;
    }

    if (activeTasks.length === 0) {
        container.innerHTML = `
            <div class="p-6 text-center text-stone-400 font-serifMono text-xs border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                今日暂无待办任务。<button onclick="openAddTaskModal()" class="text-sky-700 underline font-bold ml-1 cursor-pointer">立即添加</button>
            </div>
        `;
        return;
    }

    const priorityBadges = {
        S: 'bg-rose-100 text-rose-900 border border-rose-300 font-bold',
        A: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
        B: 'bg-sky-100 text-sky-900 border border-sky-300 font-semibold',
        C: 'bg-stone-100 text-stone-700 border border-stone-300 font-medium'
    };

    const categoryLabels = {
        project: '项目攻坚',
        algorithm: '手撕算法',
        book: '专业书目',
        quiz: '考点自测',
        reading: '通识阅读',
        career: '求职前沿',
        muduo: '源码研读',
        theory: '八股理论',
        other: '自定义待办'
    };

    container.innerHTML = activeTasks.map(t => {
        const pBadge = priorityBadges[t.priority] || priorityBadges.B;
        const catLabel = categoryLabels[t.category] || '待办';
        const isDone = Boolean(t.completed);
        const titleClass = isDone ? 'line-through text-stone-400' : 'text-stone-900 font-bold';
        const timeStr = t.estimatedMinutes >= 60 ? `${(t.estimatedMinutes / 60).toFixed(1)}h` : `${t.estimatedMinutes}m`;
        const safeTitle = typeof escapeHtml === 'function' ? escapeHtml(t.title) : t.title;
        const safeSubtitle = t.subtitle ? (typeof escapeHtml === 'function' ? escapeHtml(t.subtitle) : t.subtitle) : '';

        let directLinkBtn = '';
        if (t.id === 'task_s_project' || t.category === 'project') {
            directLinkBtn = `<button onclick="switchView('knowledge')" class="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold font-serifMono flex items-center gap-1 transition cursor-pointer shadow-2xs" title="直达语雀专栏研读"><span>直达专栏</span><i class="fa-solid fa-arrow-right text-[8px]"></i></button>`;
        } else if (t.id === 'task_a_algo' || t.category === 'algorithm') {
            directLinkBtn = `<button onclick="switchView('learning'); switchLearningTab('algo');" class="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-[10px] font-bold font-serifMono flex items-center gap-1 transition cursor-pointer shadow-2xs" title="直达手撕算法 Lab"><span>直达手撕 Lab</span><i class="fa-solid fa-arrow-right text-[8px]"></i></button>`;
        } else if (t.id === 'task_a_linux_book' || t.id === 'task_a_bird_linux' || t.category === 'book') {
            directLinkBtn = `<button onclick="switchView('learning'); switchLearningTab('books');" class="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold font-serifMono flex items-center gap-1 transition cursor-pointer shadow-2xs" title="直达专业书目伴读"><span>直达书目伴读</span><i class="fa-solid fa-arrow-right text-[8px]"></i></button>`;
        } else if (t.id === 'task_b_quiz' || t.category === 'quiz') {
            directLinkBtn = `<button onclick="switchView('quiz')" class="px-2 py-0.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold font-serifMono flex items-center gap-1 transition cursor-pointer shadow-2xs" title="直达面试题库与自测"><span>直达自测中心</span><i class="fa-solid fa-arrow-right text-[8px]"></i></button>`;
        } else if (t.id === 'task_c_reading' || t.category === 'reading') {
            directLinkBtn = `<button onclick="switchView('learning'); switchLearningTab('reading');" class="px-2 py-0.5 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-[10px] font-bold font-serifMono flex items-center gap-1 transition cursor-pointer shadow-2xs" title="直达通识阅读三部曲"><span>直达通识阅读</span><i class="fa-solid fa-arrow-right text-[8px]"></i></button>`;
        } else if (t.id === 'task_c_career' || t.category === 'career') {
            directLinkBtn = `<a href="https://www.nowcoder.com/job/center" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-[10px] font-bold font-serifMono flex items-center gap-1 transition shadow-2xs" title="直达牛客求职专区"><span>直达牛客 ↗</span></a>`;
        } else if (t.targetLink && t.targetLink.startsWith('view-')) {
            const vName = t.targetLink.replace('view-', '');
            directLinkBtn = `<button onclick="switchView('${vName}')" class="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold font-serifMono transition"><span>直达目标</span></button>`;
        } else {
            directLinkBtn = `<button onclick="switchView('learning')" class="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold font-serifMono transition"><span>直达关联</span></button>`;
        }

        return `
            <div class="p-3 rounded-xl border ${isDone ? 'border-stone-200 bg-stone-50/60' : 'border-stone-200 bg-white hover:border-stone-300'} transition flex flex-col gap-1 academic-card">
                <div class="flex items-start justify-between gap-3">
                    <div class="flex items-start gap-2.5 min-w-0 flex-1">
                        <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTaskCompleted('${t.id}')" class="mt-1 w-4 h-4 rounded text-sky-700 border-stone-300 cursor-pointer focus:ring-0 shrink-0" id="chk-${t.id}">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="px-1.5 py-0.2 text-[10px] rounded ${pBadge}">${t.priority} 级</span>
                                <span class="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">${catLabel}</span>
                                <span class="${titleClass} text-xs font-serifHeading">${safeTitle}</span>
                            </div>
                            ${safeSubtitle ? `<div class="text-[10px] text-stone-400 font-serifMono mt-0.5">${safeSubtitle}</div>` : ''}
                        </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0 font-serifMono">
                        ${directLinkBtn}
                        <span class="text-[11px] text-stone-500 font-bold">${timeStr}</span>
                        ${t.isCustom ? `
                            <button onclick="deleteCustomTask('${t.id}')" class="text-stone-300 hover:text-rose-600 transition p-0.5 cursor-pointer" title="删除该待办">
                                <i class="fa-solid fa-trash-can text-[10px]"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderHomeProjectProgress() {
    const el = document.getElementById('home-project-progress-content');
    if (!el) return;

    let proj = {
        currentStage: "阶段三：HTTP 协议栈与服务集成",
        activeModule: "HTTP Router",
        completedModules: ["Buffer", "HttpContext", "HttpRequest", "HttpResponse"],
        inProgressModules: ["Router"],
        totalModules: 12
    };

    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.getProjectProgress === 'function') {
        proj = stateManager.getProjectProgress();
    } else if (appState && appState.projectProgress) {
        proj = appState.projectProgress;
    }

    const doneCount = (proj.completedModules || []).length;
    const totalCount = proj.totalModules || 12;
    const pct = Math.round((doneCount / totalCount) * 100);

    const safeStage = typeof escapeHtml === 'function' ? escapeHtml(proj.currentStage) : proj.currentStage;
    const safeModule = typeof escapeHtml === 'function' ? escapeHtml(proj.activeModule) : proj.activeModule;

    el.innerHTML = `
        <div class="space-y-2.5">
            <div>
                <span class="text-stone-400 text-[10px] block">当前攻坚阶段</span>
                <span class="font-bold text-stone-900 text-xs">${safeStage}</span>
            </div>
            <div>
                <span class="text-stone-400 text-[10px] block">当前攻坚模块</span>
                <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">${safeModule}</span>
                    <span class="text-[10px] text-stone-500">编码与单元测试中</span>
                </div>
            </div>
            <div class="pt-1">
                <div class="flex items-center justify-between text-[11px] mb-1">
                    <span class="text-stone-500">模块验证进度</span>
                    <span class="font-bold text-stone-800">${doneCount} / ${totalCount} (${pct}%)</span>
                </div>
                <div class="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
                    <div class="bg-emerald-600 h-full rounded-full transition-all duration-300" style="width: ${pct}%"></div>
                </div>
            </div>
            <div class="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span class="text-stone-400">已验证模块:</span>
                <span class="text-stone-700 font-semibold truncate max-w-[170px]">${(proj.completedModules || []).join(', ')}</span>
            </div>
        </div>
    `;
}

function renderHomeMuduoProgress() {
    const el = document.getElementById('home-muduo-progress-content');
    if (!el) return;

    let s = (typeof stateManager !== 'undefined' && stateManager) ? stateManager.getState() : appState;
    const completedDays = (s && s.completedDays) ? s.completedDays : [];
    const activeDay = completedDays.length > 0 ? Math.min(28, Math.max(...completedDays) + 1) : 1;
    const pct = Math.round((completedDays.length / 28) * 100);

    const weekThemes = {
        1: "Week 1: 生命周期与 RAII",
        2: "Week 2: 智能指针与 Buffer 机制",
        3: "Week 3: EventLoop 事件分发",
        4: "Week 4: 多线程 Reactor 与 TCP 全流程"
    };
    const curWeek = Math.ceil(activeDay / 7);
    const theme = weekThemes[curWeek] || "Week 1: 源码基础";

    el.innerHTML = `
        <div class="space-y-2.5">
            <div>
                <span class="text-stone-400 text-[10px] block">当前学习日程</span>
                <span class="font-bold text-stone-900 text-xs">Day ${activeDay} / 28 天 · ${theme}</span>
            </div>
            <div class="pt-1">
                <div class="flex items-center justify-between text-[11px] mb-1">
                    <span class="text-stone-500">28天完成率</span>
                    <span class="font-bold text-sky-800">${completedDays.length} / 28 (${pct}%)</span>
                </div>
                <div class="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
                    <div class="bg-sky-600 h-full rounded-full transition-all duration-300" style="width: ${pct}%"></div>
                </div>
            </div>
            <div class="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span class="text-stone-400">今日研读核心:</span>
                <span class="font-mono text-sky-800 font-bold">muduo/net/EventLoop.cc</span>
            </div>
        </div>
    `;
}

function renderRecentWorkLogs() {
    const container = document.getElementById('recent-logs-container');
    if (!container) return;

    let logs = [];
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.getWorkLogs === 'function') {
        logs = stateManager.getWorkLogs();
    } else if (appState && Array.isArray(appState.workLogs)) {
        logs = appState.workLogs;
    }

    // 彻底排除假数据
    logs = logs.filter(l => l && !String(l.id).startsWith('log-seed-'));
    const recentLogs = logs.slice(0, 5);

    if (recentLogs.length === 0) {
        container.innerHTML = `
            <div class="p-6 text-center text-stone-400 font-serifMono text-xs border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                当前暂无工程记录。<br>
                <span class="text-stone-500 mt-1 inline-block">在实际编写代码、排查 Bug 或进行实验后，点击上方「+ 记工作日志」即可记录真实手记。</span>
            </div>
        `;
        return;
    }

    const typeBadges = {
        bugfix: { label: 'Bug修复', class: 'bg-rose-100 text-rose-800 border-rose-300' },
        code_feature: { label: '代码实现', class: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
        demo_experiment: { label: 'Demo验证', class: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
        source_study: { label: '源码研读', class: 'bg-sky-100 text-sky-800 border-sky-300' },
        benchmark: { label: '性能调优', class: 'bg-amber-100 text-amber-800 border-amber-300' }
    };

    container.innerHTML = recentLogs.map(l => {
        const tBadge = typeBadges[l.logType] || { label: '记录', class: 'bg-stone-100 text-stone-800 border-stone-300' };
        const hasProblem = l.problem && l.problem !== '无';
        const safeProj = typeof escapeHtml === 'function' ? escapeHtml(l.project) : l.project;
        const safeMod = typeof escapeHtml === 'function' ? escapeHtml(l.module) : l.module;
        const safeWhat = typeof escapeHtml === 'function' ? escapeHtml(l.what) : l.what;
        const safeProb = typeof escapeHtml === 'function' ? escapeHtml(l.problem) : l.problem;
        const safeSol = typeof escapeHtml === 'function' ? escapeHtml(l.solution) : l.solution;
        const safeNext = typeof escapeHtml === 'function' ? escapeHtml(l.next || '推进后续模块') : (l.next || '推进后续模块');
        const safeInterview = l.interviewPoint ? (typeof escapeHtml === 'function' ? escapeHtml(l.interviewPoint) : l.interviewPoint) : '';

        return `
            <div class="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition space-y-2 academic-card">
                <div class="flex items-center justify-between gap-2 flex-wrap">
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${tBadge.class}">${tBadge.label}</span>
                        <span class="font-bold text-xs text-stone-900">${safeProj} · ${safeMod}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[11px] text-stone-400 font-serifMono">${l.date}</span>
                        <button onclick="handleDeleteWorkLog('${l.id}')" class="text-stone-300 hover:text-rose-600 transition p-1 cursor-pointer" title="删除此条日志">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </div>
                <div class="text-xs text-stone-700 font-serifHeading leading-relaxed">
                    ${safeWhat}
                </div>
                ${hasProblem ? `
                    <div class="text-[11px] text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-100 space-y-1">
                        <div><strong class="text-rose-700">卡点：</strong>${safeProb}</div>
                        ${l.solution && l.solution !== '无' ? `<div><strong class="text-emerald-700">解法：</strong>${safeSol}</div>` : ''}
                    </div>
                ` : ''}
                <div class="flex items-center justify-between text-[11px] pt-1 border-t border-stone-100 flex-wrap gap-2">
                    <div class="text-indigo-800 font-semibold truncate max-w-sm">
                        <i class="fa-solid fa-arrow-right text-[10px] mr-1 text-indigo-500"></i>下一步：${safeNext}
                    </div>
                    ${safeInterview ? `
                        <span class="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 truncate max-w-xs" title="${safeInterview}">
                            <i class="fa-solid fa-microphone text-amber-600 mr-1"></i>${safeInterview}
                        </span>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function handleDeleteWorkLog(logId) {
    if (!confirm('确定要删除此条工程工作日志吗？')) return;
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.deleteWorkLog === 'function') {
        stateManager.deleteWorkLog(logId);
    } else if (appState && Array.isArray(appState.workLogs)) {
        appState.workLogs = appState.workLogs.filter(l => l.id !== logId);
        persistState();
    }
    renderRecentWorkLogs();
    renderHomeWeeklyMetrics();
    if (typeof showToast === 'function') showToast('已删除工程工作日志');
}

function handleClearAllWorkLogs() {
    if (!confirm('确定要清空全部工程工作日志吗？清空后不可恢复。')) return;
    if (typeof stateManager !== 'undefined' && stateManager) {
        stateManager.update(s => {
            s.workLogs = [];
        }, { save: true, immediate: true });
    } else if (appState) {
        appState.workLogs = [];
        persistState();
    }
    renderRecentWorkLogs();
    renderHomeWeeklyMetrics();
    if (typeof showToast === 'function') showToast('已清空全部工程工作日志');
}

function renderHomeWeeklyMetrics() {
    const el = document.getElementById('home-weekly-metrics-grid');
    if (!el) return;

    const s = (typeof stateManager !== 'undefined' && stateManager) ? stateManager.getState() : appState;
    const routine = (typeof ensureDailyRoutineInitialized === 'function') ? ensureDailyRoutineInitialized() : null;
    const tasks = (routine && Array.isArray(routine.tasks)) ? routine.tasks : [];

    // 1. 真实学习工时：计算今日已完成待办耗时 + 真实 studySessions
    let completedMinutes = 0;
    tasks.forEach(t => {
        if (t.completed) completedMinutes += (Number(t.estimatedMinutes) || 0);
    });
    if (s && Array.isArray(s.studySessions)) {
        s.studySessions.forEach(sess => {
            if (sess && sess.duration) completedMinutes += Number(sess.duration);
        });
    }
    const realHours = (completedMinutes / 60).toFixed(1);

    // 2. 真实待办完成进度
    const completedTasksCount = tasks.filter(t => !!t.completed).length;
    const totalTasksCount = tasks.length;

    // 3. 真实算法题手撕完成数
    let solvedAlgosCount = 0;
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.getCompletedAlgosCount === 'function') {
        solvedAlgosCount = stateManager.getCompletedAlgosCount();
    } else if (s && s.learningSystem && s.learningSystem.completedAlgos) {
        solvedAlgosCount = Object.keys(s.learningSystem.completedAlgos).filter(k => !!s.learningSystem.completedAlgos[k]).length;
    }

    // 4. 真实 28 天打卡进度
    const completedDaysCount = (s && Array.isArray(s.completedDays)) ? s.completedDays.length : 0;

    // 5. 真实工程工作日志数量 (杜绝假日志)
    let logs = [];
    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.getWorkLogs === 'function') {
        logs = stateManager.getWorkLogs();
    } else if (s && Array.isArray(s.workLogs)) {
        logs = s.workLogs;
    }
    const realLogsCount = logs.filter(l => l && !String(l.id).startsWith('log-seed-')).length;

    el.innerHTML = `
        <div class="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <span class="text-[10px] text-stone-400 block font-bold">今日完成工时</span>
            <span class="text-sm font-bold text-stone-900">${realHours}h</span>
        </div>
        <div class="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <span class="text-[10px] text-stone-400 block font-bold">待办任务完成</span>
            <span class="text-sm font-bold text-emerald-800">${completedTasksCount} / ${totalTasksCount} 项</span>
        </div>
        <div class="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <span class="text-[10px] text-stone-400 block font-bold">算法手撕完成</span>
            <span class="text-sm font-bold text-indigo-800">${solvedAlgosCount} / 178 题</span>
        </div>
        <div class="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <span class="text-[10px] text-stone-400 block font-bold">28天路线打卡</span>
            <span class="text-sm font-bold text-sky-800">${completedDaysCount} / 28 天</span>
        </div>
        <div class="col-span-2 p-2 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-center justify-between px-3">
            <span class="text-[11px] text-amber-900 font-bold">真实工程手记</span>
            <span class="text-sm font-bold text-amber-800 font-mono">${realLogsCount} 条解决实录</span>
        </div>
    `;
}

// ==========================================
// 工作日志模态框操作
// ==========================================

function openWorkLogModal(defaultData) {
    const modal = document.getElementById('modal-work-log');
    if (!modal) return;
    modal.classList.remove('hidden');

    if (defaultData) {
        if (defaultData.project && document.getElementById('log-input-project')) document.getElementById('log-input-project').value = defaultData.project;
        if (defaultData.module && document.getElementById('log-input-module')) document.getElementById('log-input-module').value = defaultData.module;
        if (defaultData.logType && document.getElementById('log-input-type')) document.getElementById('log-input-type').value = defaultData.logType;
        if (defaultData.what && document.getElementById('log-input-what')) document.getElementById('log-input-what').value = defaultData.what;
        if (defaultData.problem && document.getElementById('log-input-problem')) document.getElementById('log-input-problem').value = defaultData.problem;
        if (defaultData.solution && document.getElementById('log-input-solution')) document.getElementById('log-input-solution').value = defaultData.solution;
        if (defaultData.learned && document.getElementById('log-input-learned')) document.getElementById('log-input-learned').value = defaultData.learned;
        if (defaultData.next && document.getElementById('log-input-next')) document.getElementById('log-input-next').value = defaultData.next;
    }
}

function closeWorkLogModal() {
    const modal = document.getElementById('modal-work-log');
    if (modal) modal.classList.add('hidden');
}

function handleSaveWorkLog(e) {
    e.preventDefault();
    const project = document.getElementById('log-input-project')?.value || 'CppAIService';
    const module = document.getElementById('log-input-module')?.value.trim() || 'Core';
    const logType = document.getElementById('log-input-type')?.value || 'code_feature';
    const what = document.getElementById('log-input-what')?.value.trim() || '';
    const problem = document.getElementById('log-input-problem')?.value.trim() || '无';
    const solution = document.getElementById('log-input-solution')?.value.trim() || '无';
    const learned = document.getElementById('log-input-learned')?.value.trim() || '';
    const next = document.getElementById('log-input-next')?.value.trim() || '';
    const filesStr = document.getElementById('log-input-files')?.value.trim() || '';
    const interviewPoint = document.getElementById('log-input-interview')?.value.trim() || '';
    const syncEvidence = document.getElementById('log-input-sync-evidence')?.checked;

    const files = filesStr ? filesStr.split(',').map(s => s.trim()).filter(Boolean) : [];

    const logPayload = {
        project,
        module,
        logType,
        what,
        problem,
        solution,
        learned,
        next,
        relatedFiles: files,
        interviewPoint
    };

    if (typeof stateManager !== 'undefined' && stateManager && typeof stateManager.addWorkLog === 'function') {
        stateManager.addWorkLog(logPayload);
        if (syncEvidence && typeof stateManager.addCustomEvidence === 'function') {
            stateManager.addCustomEvidence({
                title: `${module}: ${what.slice(0, 30)}`,
                type: logType === 'bugfix' ? 'bug_fix' : 'code_modification',
                taskId: 1,
                sourceLocation: files[0] || 'src/main.cpp',
                commitHash: 'working_tree',
                capabilityTags: [project, module],
                details: `${what}\n问题: ${problem}\n解决: ${solution}\n收获: ${learned}`,
                verified: true
            });
        }
    } else if (appState) {
        if (!Array.isArray(appState.workLogs)) appState.workLogs = [];
        logPayload.id = 'log_' + Date.now();
        logPayload.date = new Date().toISOString().slice(0, 10);
        logPayload.createdAt = Date.now();
        appState.workLogs.unshift(logPayload);
        if (typeof persistState === 'function') persistState();
    }

    closeWorkLogModal();
    renderRecentWorkLogs();
    renderHomeWeeklyMetrics();
    if (typeof showToast === 'function') showToast('工程工作日志已成功保存');
}

function openQuickAddTaskModal() {
    openAddTaskModal();
}

// ==========================================
// CppAIService 文本树状模块地图 (ModuleHierarchyMap)
// ==========================================

const CPPAI_MODULE_MAP_DATA = [
    {
        tier: "1. Network & Protocol (底层网络与协议栈)",
        icon: "fa-network-wired",
        color: "sky",
        modules: [
            { name: "HttpContext.cpp", desc: "三段式状态机分包解析 (请求行/请求头/请求体)", path: "src/http/HttpContext.cpp", testFile: "tests/HttpContext_test.cpp", status: "verified" },
            { name: "HttpRequest.h", desc: "请求方法与 Header 解析、URL 解码与参数抽取", path: "src/http/HttpRequest.h", testFile: "tests/HttpRequest_test.cpp", status: "verified" },
            { name: "HttpResponse.cpp", desc: "HTTP 响应报文组装、Content-Type 与分块传输", path: "src/http/HttpResponse.cpp", testFile: "tests/HttpResponse_test.cpp", status: "verified" },
            { name: "Router.cpp", desc: "前缀树正则路由分发匹配与 RESTful 参数提取", path: "src/http/Router.cpp", testFile: "tests/Router_test.cpp", status: "in_progress" }
        ]
    },
    {
        tier: "2. Core Engine (核心服务引擎)",
        icon: "fa-server",
        color: "emerald",
        modules: [
            { name: "Server.cpp", desc: "主从 Reactor 线程池并发模型与 TcpConnection 接入", path: "src/core/Server.cpp", testFile: "tests/Server_test.cpp", status: "verified" },
            { name: "ConnectionPool.cpp", desc: "TCP 连接池复用、RAII 借还与心跳断线自愈", path: "src/core/ConnectionPool.cpp", testFile: "tests/ConnectionPool_test.cpp", status: "verified" },
            { name: "Buffer.cpp", desc: "应用层两段式环形缓冲区与 64KB 栈上 readv 分散读", path: "src/core/Buffer.cpp", testFile: "tests/Buffer_test.cpp", status: "verified" }
        ]
    },
    {
        tier: "3. MCP & Tool Invocation (模型上下文协议集成)",
        icon: "fa-plug",
        color: "purple",
        modules: [
            { name: "McpRegistry.cpp", desc: "本地 MCP 工具元数据描述注册与动态调用路由", path: "src/mcp/McpRegistry.cpp", testFile: "tests/McpRegistry_test.cpp", status: "in_progress" },
            { name: "ToolCaller.cpp", desc: "非阻塞工作线程池异步调度与超时反压防护", path: "src/mcp/ToolCaller.cpp", testFile: "tests/ToolCaller_test.cpp", status: "planned" },
            { name: "JsonRpcHandler.cpp", desc: "JSON-RPC 2.0 序列化/反序列化与错误码封装", path: "src/mcp/JsonRpcHandler.cpp", testFile: "tests/JsonRpc_test.cpp", status: "verified" }
        ]
    },
    {
        tier: "4. AI Inference & Integration (AI 推理适配)",
        icon: "fa-brain",
        color: "amber",
        modules: [
            { name: "ModelClient.cpp", desc: "大模型 HTTP/SSE 客户端连接与 Keep-Alive 复用", path: "src/ai/ModelClient.cpp", testFile: "tests/ModelClient_test.cpp", status: "in_progress" },
            { name: "StreamParser.cpp", desc: "Server-Sent Events 流式 Token 增量解析推送", path: "src/ai/StreamParser.cpp", testFile: "tests/StreamParser_test.cpp", status: "in_progress" },
            { name: "ContextCache.cpp", desc: "多轮对话 Token 缓存与 LRU 内存淘汰策略", path: "src/ai/ContextCache.cpp", testFile: "tests/ContextCache_test.cpp", status: "planned" }
        ]
    },
    {
        tier: "5. Middleware & Message Queue (中间件与通信)",
        icon: "fa-cubes",
        color: "teal",
        modules: [
            { name: "RabbitMQProducer.cpp", desc: "异步任务分发至 RabbitMQ Direct Exchange 缓冲", path: "src/mq/RabbitMQProducer.cpp", testFile: "tests/RabbitMQ_test.cpp", status: "verified" },
            { name: "MetricsCollector.cpp", desc: "请求吞吐量 QPS 与 P99 时延环形缓冲区统计", path: "src/metrics/MetricsCollector.cpp", testFile: "tests/Metrics_test.cpp", status: "in_progress" }
        ]
    }
];

function renderModuleHierarchyMap() {
    const container = document.getElementById('cppai-module-hierarchy-container');
    if (!container) return;

    container.innerHTML = CPPAI_MODULE_MAP_DATA.map(tier => {
        const moduleCards = tier.modules.map(m => {
            const statusBadge = m.status === 'verified'
                ? '<span class="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">已验证</span>'
                : (m.status === 'in_progress'
                    ? '<span class="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">攻坚中</span>'
                    : '<span class="px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 text-[10px]">待启动</span>');

            return `
                <div class="p-3 bg-white rounded-xl border border-stone-200 hover:border-stone-300 transition flex flex-col justify-between academic-card">
                    <div>
                        <div class="flex items-center justify-between gap-1 mb-1">
                            <span class="font-bold text-xs font-mono text-stone-900">${escapeHtml(m.name)}</span>
                            ${statusBadge}
                        </div>
                        <p class="text-[11px] text-stone-500 mb-2 leading-relaxed">${escapeHtml(m.desc)}</p>
                        <div class="text-[10px] text-stone-400 font-mono truncate mb-2">
                            <i class="fa-solid fa-file-code mr-1"></i>${escapeHtml(m.path)}
                        </div>
                    </div>
                    <div class="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                        <button onclick="handleModuleSourceClick('${m.name}', '${m.path}')" class="text-sky-700 hover:text-sky-900 font-bold cursor-pointer">
                            源码
                        </button>
                        <button onclick="handleModuleTaskClick('${m.name}')" class="text-amber-700 hover:text-amber-900 font-bold cursor-pointer">
                            任务
                        </button>
                        <button onclick="handleModuleInterviewClick('${m.name}')" class="text-purple-700 hover:text-purple-900 font-bold cursor-pointer">
                            面试题
                        </button>
                        <button onclick="handleModuleTestClick('${m.name}', '${m.testFile}')" class="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer">
                            Demo
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-3">
                <div class="flex items-center gap-2">
                    <i class="fa-solid ${tier.icon} text-${tier.color}-700 text-sm"></i>
                    <h3 class="font-bold text-xs text-stone-900 font-serifHeading">${tier.tier}</h3>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    ${moduleCards}
                </div>
            </div>
        `;
    }).join('');
}

function toggleArchTopologyCollapse() {
    const wrapper = document.getElementById('arch-topology-wrapper');
    const btnText = document.getElementById('btn-topo-toggle-text');
    if (!wrapper) return;

    if (wrapper.classList.contains('hidden')) {
        wrapper.classList.remove('hidden');
        if (btnText) btnText.innerText = '收起架构参考图';
    } else {
        wrapper.classList.add('hidden');
        if (btnText) btnText.innerText = '展开架构参考图';
    }
}

// ==========================================
// CppAIService 模块交互：真实源码与 Demo 查看器、语雀专栏跳转、面试考点跳转
// ==========================================

const MODULE_TO_YUQUE_MAP = {
    'HttpContext.cpp': 'yq_06',
    'HttpRequest.h': 'yq_06',
    'HttpRequest.cpp': 'yq_06',
    'HttpResponse.cpp': 'yq_06',
    'Router.cpp': 'yq_07',
    'Server.cpp': 'yq_05',
    'HttpServer.cpp': 'yq_05',
    'ConnectionPool.cpp': 'yq_10',
    'Buffer.cpp': 'yq_12',
    'McpRegistry.cpp': 'yq_17',
    'ToolCaller.cpp': 'yq_17',
    'JsonRpcHandler.cpp': 'yq_17',
    'ModelClient.cpp': 'yq_16',
    'StreamParser.cpp': 'yq_16',
    'ContextCache.cpp': 'yq_08',
    'RabbitMQProducer.cpp': 'yq_17',
    'MetricsCollector.cpp': 'yq_12'
};

const MODULE_TO_QA_MAP = {
    'HttpContext.cpp': 'qa_fsm_http_parser',
    'HttpRequest.h': 'qa_http_request_parsing',
    'HttpResponse.cpp': 'qa_http_response_keepalive',
    'Router.cpp': 'qa_router_radix_tree',
    'Server.cpp': 'qa_reactor_eventfd',
    'HttpServer.cpp': 'qa_reactor_eventfd',
    'ConnectionPool.cpp': 'qa_connection_pool_raii',
    'Buffer.cpp': 'qa_buffer_readv',
    'McpRegistry.cpp': 'qa_mcp_twostage',
    'ToolCaller.cpp': 'qa_tool_caller_async',
    'JsonRpcHandler.cpp': 'qa_json_rpc_spec',
    'ModelClient.cpp': 'qa_model_client_sse',
    'StreamParser.cpp': 'qa_stream_parser_pipeline',
    'ContextCache.cpp': 'qa_context_cache_lru',
    'RabbitMQProducer.cpp': 'qa_rabbitmq_decouple',
    'MetricsCollector.cpp': 'qa_metrics_ring_buffer'
};

let currentViewerCode = '';

function openCodeViewerModal(info) {
    const modal = document.getElementById('modal-code-viewer');
    if (!modal) {
        alert(info.code || info.path);
        return;
    }

    const titleEl = document.getElementById('code-viewer-title');
    const pathEl = document.getElementById('code-viewer-path');
    const badgeEl = document.getElementById('code-viewer-badge');
    const preEl = document.getElementById('code-viewer-pre');

    if (titleEl) titleEl.innerText = info.title || '代码查看器';
    if (pathEl) pathEl.innerText = info.path || '';
    if (badgeEl) badgeEl.innerText = info.badge || '真实源码';
    
    currentViewerCode = info.code || '';
    if (preEl) {
        if (typeof hljs !== 'undefined' && typeof hljs.highlight === 'function') {
            try {
                const highlighted = hljs.highlight(currentViewerCode, { language: 'cpp', ignoreIllegals: true });
                preEl.innerHTML = highlighted.value;
                preEl.className = 'hljs language-cpp font-mono text-[12px] leading-relaxed';
            } catch(e) {
                preEl.textContent = currentViewerCode;
                preEl.className = 'font-mono text-emerald-300 text-[12px] leading-relaxed';
            }
        } else {
            preEl.textContent = currentViewerCode;
            preEl.className = 'font-mono text-emerald-300 text-[12px] leading-relaxed';
        }
    }

    modal.classList.remove('hidden');
}

function closeCodeViewerModal() {
    const modal = document.getElementById('modal-code-viewer');
    if (modal) modal.classList.add('hidden');
}

function copyCurrentViewerCode() {
    if (!currentViewerCode) return;
    navigator.clipboard.writeText(currentViewerCode).then(() => {
        if (typeof showToast === 'function') showToast('代码已成功复制到剪贴板！');
    }).catch(() => {
        alert('复制失败，请手动选择复制');
    });
}

function handleModuleSourceClick(name, path) {
    const map = (typeof CPPAI_SOURCES_MAP !== 'undefined') ? CPPAI_SOURCES_MAP : {};
    const code = map[path] || map[name] || `// 文件位置: ${path}\n// 未在内置数据集中找到该文件，请确认本地工程存在。`;

    openCodeViewerModal({
        title: name,
        path: path,
        badge: 'C++ 源码',
        code: code
    });
}

function handleModuleTaskClick(name) {
    const artId = MODULE_TO_YUQUE_MAP[name] || 'yq_06';
    if (typeof selectYuqueArticle === 'function') {
        selectYuqueArticle(artId);
    }
    switchView('knowledge');
    if (typeof showToast === 'function') showToast(`已跳转至与 ${name} 对应的语雀研读章节`);
}

function handleModuleInterviewClick(name) {
    const qaId = MODULE_TO_QA_MAP[name] || 'qa_fsm_http_parser';
    switchView('quiz');
    const sel = document.getElementById('quiz-day-selector');
    if (sel) sel.value = qaId;
    loadInterviewQA(qaId);
    if (typeof showToast === 'function') showToast(`已加载 ${name} 核心技术面试考点与解析`);
}

function handleModuleTestClick(name, testFile) {
    const map = (typeof CPPAI_SOURCES_MAP !== 'undefined') ? CPPAI_SOURCES_MAP : {};
    const code = map[testFile] || map[name] || `// 单元测试与 Demo 验证用例: ${testFile}\n// 编译运行命令:\n// ctest -R ${name.replace('.cpp', '')} --output-on-failure\n\n#include <gtest/gtest.h>\n\nTEST(${name.replace('.cpp', '')}Test, BasicAssertion) {\n    EXPECT_TRUE(true);\n}`;

    openCodeViewerModal({
        title: `${name} 验证用例与 Demo`,
        path: testFile,
        badge: '测试与 Demo',
        code: code
    });
}

// 挂载所有新增函数至 window
if (typeof window !== 'undefined') {
    window.renderHomeDashboard = renderHomeDashboard;
    window.renderTodayTasks = renderTodayTasks;
    window.renderHomeProjectProgress = renderHomeProjectProgress;
    window.renderHomeMuduoProgress = renderHomeMuduoProgress;
    window.renderRecentWorkLogs = renderRecentWorkLogs;
    window.handleDeleteWorkLog = handleDeleteWorkLog;
    window.handleClearAllWorkLogs = handleClearAllWorkLogs;
    window.renderHomeWeeklyMetrics = renderHomeWeeklyMetrics;
    window.openWorkLogModal = openWorkLogModal;
    window.closeWorkLogModal = closeWorkLogModal;
    window.handleSaveWorkLog = handleSaveWorkLog;
    window.openQuickAddTaskModal = openQuickAddTaskModal;
    window.renderModuleHierarchyMap = renderModuleHierarchyMap;
    window.toggleArchTopologyCollapse = toggleArchTopologyCollapse;
    window.handleModuleSourceClick = handleModuleSourceClick;
    window.handleModuleTaskClick = handleModuleTaskClick;
    window.handleModuleInterviewClick = handleModuleInterviewClick;
    window.handleModuleTestClick = handleModuleTestClick;
    window.openCodeViewerModal = openCodeViewerModal;
    window.closeCodeViewerModal = closeCodeViewerModal;
    window.copyCurrentViewerCode = copyCurrentViewerCode;
}

if (typeof globalThis !== 'undefined') {
    globalThis.renderHomeDashboard = renderHomeDashboard;
    globalThis.renderTodayTasks = renderTodayTasks;
    globalThis.renderHomeProjectProgress = renderHomeProjectProgress;
    globalThis.renderHomeMuduoProgress = renderHomeMuduoProgress;
    globalThis.renderRecentWorkLogs = renderRecentWorkLogs;
    globalThis.handleDeleteWorkLog = handleDeleteWorkLog;
    globalThis.handleClearAllWorkLogs = handleClearAllWorkLogs;
    globalThis.renderHomeWeeklyMetrics = renderHomeWeeklyMetrics;
    globalThis.openWorkLogModal = openWorkLogModal;
    globalThis.closeWorkLogModal = closeWorkLogModal;
    globalThis.handleSaveWorkLog = handleSaveWorkLog;
    globalThis.openQuickAddTaskModal = openQuickAddTaskModal;
    globalThis.renderModuleHierarchyMap = renderModuleHierarchyMap;
    globalThis.toggleArchTopologyCollapse = toggleArchTopologyCollapse;
    globalThis.handleModuleSourceClick = handleModuleSourceClick;
    globalThis.handleModuleTaskClick = handleModuleTaskClick;
    globalThis.handleModuleInterviewClick = handleModuleInterviewClick;
    globalThis.handleModuleTestClick = handleModuleTestClick;
    globalThis.openCodeViewerModal = openCodeViewerModal;
    globalThis.closeCodeViewerModal = closeCodeViewerModal;
    globalThis.copyCurrentViewerCode = copyCurrentViewerCode;
    globalThis.populateAlgoProblemSelector = populateAlgoProblemSelector;
    globalThis.onAlgoProblemSelect = onAlgoProblemSelect;
    globalThis.openAlgorithmModal = openAlgorithmModal;
    globalThis.onAlgoTopicChange = onAlgoTopicChange;
    globalThis.toggleCppLearnedStatus = toggleCppLearnedStatus;
    globalThis.toggleLinuxLearnedStatus = toggleLinuxLearnedStatus;
    globalThis.closeAlgorithmModal = closeAlgorithmModal;
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
        toggleTaskSidebar,
        initTaskSidebar,
        renderTaskHub,
        toggleTaskCompleted,
        setRoutineMode,
        saveAlgorithmProblem,
        populateAlgoProblemSelector,
        onAlgoProblemSelect,
        openAlgorithmModal,
        onAlgoTopicChange,
        toggleCppLearnedStatus,
        toggleLinuxLearnedStatus,
        closeAlgorithmModal,
        saveBooksProgress,
        saveCareerNotes,
        saveCustomTask,
        deleteCustomTask,
        switchLearningTab,
        renderLearningSystem,
        renderLearningCppTab,
        renderLearningLinuxTab,
        renderLearningBooksTab,
        renderLearningAlgoTab,
        renderLearningQATab,
        renderLearningReadingTab,
        openCrossLinkModal,
        closeCrossLinkModal,
        toggleAlgoReview,
        adjustBookDailyGoal,
        toggleQAMastery,
        switchCareerTab,
        renderCareerSystem,
        renderCareerEvidenceTab,
        renderCareerCapabilityTab,
        renderCareerInterviewTab,
        renderCareerMockTab,
        renderCareerStarTab,
        switchInterviewModule,
        openNewEvidenceModal,
        closeNewEvidenceModal,
        handleSaveCustomEvidence,
        deleteCustomEvidence,
        filterEvidenceByType,
        startMockQuestion,
        revealMockFollowUp,
        revealMockAnswer,
        submitMockRating,
        jumpToEvidence,
        copyStarStory,
        copyResumeBullet,
        switchSchedulerTab,
        renderSchedulerSystem,
        renderSchedulerPlanner,
        renderSchedulerCalendar,
        renderSchedulerDiagnostics,
        renderSchedulerReview,
        openCalendarImportModal,
        closeCalendarImportModal,
        setCalendarImportTab,
        submitCalendarImport,
        processIcsContent,
        runSmartScheduleCalculation,
        toggleScheduledBlockStatus,
        openTaskDiagnosticModal,
        closeTaskDiagnosticModal,
        submitTaskDiagnostic,
        generateAndExportDailyReview,
        copyReviewMarkdownToClipboard,
        downloadReviewMarkdown,
        renderHomeDashboard,
        renderTodayTasks,
        renderHomeProjectProgress,
        renderHomeMuduoProgress,
        renderRecentWorkLogs,
        renderHomeWeeklyMetrics,
        handleDeleteWorkLog,
        handleClearAllWorkLogs,
        openWorkLogModal,
        closeWorkLogModal,
        handleSaveWorkLog,
        toggleTaskWithReflection,
        openTaskReflectionModal,
        closeTaskReflectionModal,
        submitTaskReflection,
        openQuickAddTaskModal,
        renderModuleHierarchyMap,
        toggleArchTopologyCollapse,
        handleModuleSourceClick,
        handleModuleTaskClick,
        handleModuleInterviewClick,
        handleModuleTestClick,
        openCodeViewerModal,
        closeCodeViewerModal,
        copyCurrentViewerCode
    };
}



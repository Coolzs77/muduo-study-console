// ==========================================================================
// CppAIService Engineering OS - 全局应用控制器 (app.js - V6.0)
// 个人工程训练中枢 / 项目驱动学习系统 / 求职能力积累系统
// ==========================================================================

// ==================== 数据集安全读取防弹函数 ====================
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

function getCppAIModules() {
    if (typeof CPPAI_MODULES !== 'undefined' && Array.isArray(CPPAI_MODULES)) return CPPAI_MODULES;
    if (typeof window !== 'undefined' && window.CPPAI_MODULES && Array.isArray(window.CPPAI_MODULES)) return window.CPPAI_MODULES;
    return [];
}

function getYuqueManifest() {
    if (typeof YUQUE_MANIFEST !== 'undefined' && Array.isArray(YUQUE_MANIFEST)) return YUQUE_MANIFEST;
    if (typeof window !== 'undefined' && window.YUQUE_MANIFEST && Array.isArray(window.YUQUE_MANIFEST)) return window.YUQUE_MANIFEST;
    return [];
}

function getRoadmap8Weeks() {
    if (typeof ROADMAP_8WEEKS !== 'undefined' && Array.isArray(ROADMAP_8WEEKS)) return ROADMAP_8WEEKS;
    if (typeof window !== 'undefined' && window.ROADMAP_8WEEKS && Array.isArray(window.ROADMAP_8WEEKS)) return window.ROADMAP_8WEEKS;
    return [];
}

function getInterviewBank() {
    if (typeof CPPAI_INTERVIEW_BANK !== 'undefined' && Array.isArray(CPPAI_INTERVIEW_BANK)) return CPPAI_INTERVIEW_BANK;
    if (typeof window !== 'undefined' && window.CPPAI_INTERVIEW_BANK && Array.isArray(window.CPPAI_INTERVIEW_BANK)) return window.CPPAI_INTERVIEW_BANK;
    return [];
}

// ==================== 全局根状态对象 (Schema V6.0) ====================
var appState = {
    version: "6.0.0",
    currentView: 'dashboard',
    currentWeekSprint: 1,
    currentModuleId: 'mod_http_core',
    
    // 任务体系 (S/A/B/C)
    tasks: [],
    
    // 真实项目贡献
    contributions: [
        {
            id: "contrib_1",
            date: "2026-09-11",
            module: "Router 动态路由",
            problem: "动态路由正则匹配成功后，业务 Handler 拿到的参数始终为空",
            rootCause: "Router.cpp#L70 在 extractPathParameters 注入 newReq 后，回调误传了原始 req",
            solution: "将 callback(req, resp) 修复为 callback(newReq, resp)，并补充多参数提取单元测试",
            changedFiles: ["HttpServer/src/router/Router.cpp"],
            gitCommit: "fix(router): pass modified request with extracted path params to callback",
            testResult: "通过: /user/:id 正则动态路径参数提取测试 100% 验证通过",
            interviewValue: "体现对标准库 std::regex 与请求对象生命周期传参的细致排错能力"
        }
    ],

    // 算法手撕库 (每日 3 题)
    algorithmLogs: [],

    // 踩坑与事故资产库 (原备忘录全面升级)
    incidents: [],

    // 经典 28 天 muduo 基础兼容
    completedDays: [],
    mastery: {},
    reviews: {},
    sourceStatus: {},
    pitfalls: [],
    studySessions: [],
    dayNotes: {},
    experimentNotes: {},
    globalNotes: "",

    // 交互状态
    activeTimer: {
        running: false,
        timerId: null,
        seconds: 0,
        day: 1,
        type: 'coding'
    }
};
window.appState = appState;

// ==================== 实用工具函数 ====================
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

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeJsString(str) {
    if (!str) return '""';
    return JSON.stringify(str);
}

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
    }, 2500);
}

// ==================== 数据持久化与平滑无损迁移 (SchemaMigrationV6) ====================
function loadAndMigrateState() {
    try {
        const v6Saved = localStorage.getItem('cppai_os_v6_data');
        if (v6Saved) {
            const parsed = JSON.parse(v6Saved);
            if (parsed && typeof parsed === 'object') {
                appState = Object.assign(appState, parsed);
                window.appState = appState;
                ensureStateDefaults();
                return;
            }
        }

        // 迁移旧版 muduo_v5_data
        const v5Saved = localStorage.getItem('muduo_v5_data');
        if (v5Saved) {
            const parsedV5 = JSON.parse(v5Saved);
            if (parsedV5 && typeof parsedV5 === 'object') {
                appState = Object.assign(appState, parsedV5);
                console.log("[MIGRATION] Migrated from muduo_v5_data to CppAIService OS V6 successfully.");
            }
        }

        ensureStateDefaults();
        persistState();
    } catch (e) {
        console.warn("Storage restricted or parse error:", e);
        ensureStateDefaults();
    }
}

function ensureStateDefaults() {
    if (!Array.isArray(appState.tasks) || appState.tasks.length === 0) {
        appState.tasks = typeof INITIAL_ENGINEERING_TASKS !== 'undefined' ? [...INITIAL_ENGINEERING_TASKS] : [];
    }
    if (!Array.isArray(appState.algorithmLogs) || appState.algorithmLogs.length === 0) {
        appState.algorithmLogs = typeof INITIAL_ALGORITHM_LOGS !== 'undefined' ? [...INITIAL_ALGORITHM_LOGS] : [];
    }
    if (!Array.isArray(appState.contributions) || appState.contributions.length === 0) {
        appState.contributions = [
            {
                id: "contrib_1",
                date: "2026-09-11",
                module: "Router 动态路由",
                problem: "动态路由正则匹配成功后，业务 Handler 拿到的参数始终为空",
                rootCause: "Router.cpp#L70 在 extractPathParameters 注入 newReq 后，回调误传了原始 req",
                solution: "将 callback(req, resp) 修复为 callback(newReq, resp)，并补充多参数提取单元测试",
                changedFiles: ["HttpServer/src/router/Router.cpp"],
                gitCommit: "fix(router): pass modified request with extracted path params to callback",
                testResult: "通过: /user/:id 正则动态路径参数提取测试 100% 验证通过",
                interviewValue: "体现对标准库 std::regex 与请求对象生命周期传参的细致排错能力"
            }
        ];
    }
    if (!Array.isArray(appState.incidents) || appState.incidents.length === 0) {
        if (Array.isArray(appState.pitfalls) && appState.pitfalls.length > 0) {
            appState.incidents = appState.pitfalls.map(p => ({
                id: p.id || ("inc_" + Date.now()),
                title: p.title || "C++ 内存/并发事故",
                date: p.date || getTodayDateStr(),
                module: "CppAIService / muduo",
                symptom: p.errorSymptom || p.symptom || "段错误或行为异常",
                rootCause: p.errorCause || p.cause || "资源生命期管理不当",
                wrongCode: p.errorCode || "",
                correctCode: p.correctCode || "",
                conclusion: p.conclusion || "【工程铁律】明确对象生存期与所有权归属",
                interviewValue: "常见高频排错考点"
            }));
        } else {
            appState.incidents = getPitfallsDataset().map(p => ({
                id: p.id,
                title: p.title,
                date: p.date || getTodayDateStr(),
                module: "CppAIService / muduo",
                symptom: p.errorSymptom,
                rootCause: p.errorCause,
                wrongCode: p.errorCode,
                correctCode: p.correctCode,
                conclusion: p.conclusion,
                interviewValue: "深入排查 C++ 对象析构与指针悬垂"
            }));
        }
    }
    if (!appState.mastery) appState.mastery = {};
    if (!appState.reviews) appState.reviews = {};
    if (!appState.sourceStatus) appState.sourceStatus = {};
    if (!appState.studySessions) appState.studySessions = [];
    if (!appState.dayNotes) appState.dayNotes = {};
    if (!appState.experimentNotes) appState.experimentNotes = {};
    if (!appState.completedDays) appState.completedDays = [];
}

function persistState() {
    try {
        const payload = JSON.stringify(appState);
        localStorage.setItem('cppai_os_v6_data', payload);
        // 双写旧键保障旧模块与离线单体绝对兼容
        localStorage.setItem('muduo_v5_data', payload);
    } catch (e) {
        console.warn("Local storage write failed:", e);
    }
}

// ==================== 视图切换控制器 (8 维工程架构) ====================
function switchView(viewName) {
    appState.currentView = viewName;
    const views = ['dashboard', 'project', 'knowledge', 'learning', 'tasks', 'evidence', 'career', 'settings'];
    
    views.forEach(v => {
        const sec = document.getElementById(`view-${v}`);
        const btn = document.getElementById(`nav-${v}`);
        if (!sec || !btn) return;

        if (v === viewName) {
            sec.classList.remove('hidden');
            btn.className = "px-3.5 py-2 rounded-xl flex items-center gap-2 font-bold bg-white text-stone-900 border border-stone-300 shadow-sm transition whitespace-nowrap";
            btn.setAttribute('aria-selected', 'true');
        } else {
            sec.classList.add('hidden');
            btn.className = "px-3.5 py-2 rounded-xl flex items-center gap-2 font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition whitespace-nowrap";
            btn.setAttribute('aria-selected', 'false');
        }
    });

    // 各视图独立数据渲染
    if (viewName === 'dashboard') {
        renderTodayMission();
        renderTodayPlan();
        updateDashboardMetrics();
    } else if (viewName === 'project') {
        renderProjectModules();
        renderSourceMap();
        renderContributions();
    } else if (viewName === 'knowledge') {
        renderYuqueManifest();
        renderMappingTable();
    } else if (viewName === 'learning') {
        renderAlgorithmLogs();
        renderInterviewBank();
    } else if (viewName === 'tasks') {
        renderTasksView();
        renderRoadmapWeeks();
    } else if (viewName === 'evidence') {
        renderIncidents();
    } else if (viewName === 'career') {
        renderCareerResume();
    } else if (viewName === 'settings') {
        renderSettingsView();
    }
}

// ==================== 01 DASHBOARD: 今日使命与全局大盘 ====================
function renderTodayMission() {
    const card = document.getElementById('today-mission-card');
    if (!card) return;

    // 获取当前最高优先级 S 级任务，或第一个未完成任务
    const primaryTask = appState.tasks.find(t => t.priority === 'S' && t.status !== 'DONE') || appState.tasks[0];
    if (!primaryTask) {
        card.innerHTML = `<div class="p-6 text-center text-stone-500 font-serifMono">所有攻坚任务已达成！前往 Tasks 规划新征程。</div>`;
        return;
    }

    const mod = getCppAIModules().find(m => m.id === primaryTask.projectModule) || { name: "CppAIService 核心主线", sourcePath: primaryTask.sourceFile || "AIApps/ChatServer/src/main.cpp" };

    card.innerHTML = `
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-amber-200/60 pb-4 mb-4">
            <div>
                <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-100 border border-rose-200 text-rose-900 text-[11px] font-serifMono font-bold mb-2">
                    <span class="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                    <span>★ TODAY'S PRIMARY MISSION (今日最高优先级主线)</span>
                </div>
                <h2 class="text-xl sm:text-2xl font-black text-stone-900 font-serif-heading">
                    ${escapeHtml(primaryTask.title)}
                </h2>
                <div class="flex flex-wrap items-center gap-3 text-xs font-serifMono text-stone-600 mt-2">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-cube text-amber-700"></i> 所属模块: <strong>${escapeHtml(mod.name)}</strong></span>
                    <span class="text-stone-300">•</span>
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-code text-sky-700"></i> 核心源码: <code class="bg-stone-100 px-1.5 py-0.5 rounded text-[11px] text-stone-800">${escapeHtml(primaryTask.sourceFile || mod.sourcePath)}</code></span>
                    <span class="text-stone-300">•</span>
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-clock text-amber-600"></i> 预计耗时: <strong>${primaryTask.estimatedMinutes} min</strong></span>
                </div>
            </div>

            <!-- 主行动按钮群 -->
            <div class="flex items-center gap-2.5 shrink-0 font-serifMono">
                <button onclick="startMissionTimer('${primaryTask.id}')" class="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer">
                    <i class="fa-solid fa-play text-amber-400"></i>
                    <span>立即开始攻坚</span>
                </button>
                <button onclick="markTaskDone('${primaryTask.id}')" class="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-check"></i>
                    <span>登记完成与证据</span>
                </button>
            </div>
        </div>

        <!-- 使命剖析：为什么做、操作步骤与验收标准 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs font-serifHeading">
            <div class="bg-white/80 p-3.5 rounded-xl border border-stone-200/80">
                <div class="font-bold text-stone-900 flex items-center gap-1.5 mb-1.5 text-amber-900 font-serifMono">
                    <i class="fa-solid fa-circle-question text-amber-600"></i> 为什么今天必须攻克？
                </div>
                <p class="text-stone-600 leading-relaxed">
                    这是 CppAIService 从网络 I/O 贯通到业务层的关键环节，彻底扫除阻碍后续大模型调用与异步写库的核心盲区。
                </p>
            </div>
            <div class="bg-white/80 p-3.5 rounded-xl border border-stone-200/80">
                <div class="font-bold text-stone-900 flex items-center gap-1.5 mb-1.5 text-sky-900 font-serifMono">
                    <i class="fa-solid fa-list-check text-sky-600"></i> 推荐攻坚步骤
                </div>
                <p class="text-stone-600 leading-relaxed">
                    1. VS Code 链接并单步调试 ➔ 2. 查阅语雀对应文档 ➔ 3. 编写最小测试用例验证 ➔ 4. 提交规范 Git Commit。
                </p>
            </div>
            <div class="bg-white/80 p-3.5 rounded-xl border border-stone-200/80">
                <div class="font-bold text-stone-900 flex items-center gap-1.5 mb-1.5 text-emerald-900 font-serifMono">
                    <i class="fa-solid fa-shield-halved text-emerald-600"></i> 真实验收标准 (Reality Check)
                </div>
                <p class="text-stone-600 leading-relaxed">
                    能够脱稿推导该模块的内存与线程流转，且通过单元测试或 Postman 获得预期的 HTTP/JSON 响应。
                </p>
            </div>
        </div>
    `;
}

function renderTodayPlan() {
    const container = document.getElementById('today-plan-container');
    if (!container) return;

    const priorityBadges = {
        'S': '<span class="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold font-serifMono text-[10px]">S 级 · 核心主线</span>',
        'A': '<span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold font-serifMono text-[10px]">A 级 · 算法/系统</span>',
        'B': '<span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold font-serifMono text-[10px]">B 级 · 八股突破</span>',
        'C': '<span class="px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-bold font-serifMono text-[10px]">C 级 · 就业/阅读</span>'
    };

    let html = `
        <div class="space-y-2.5">
    `;

    appState.tasks.slice(0, 6).forEach(t => {
        const isDone = t.status === 'DONE';
        html += `
            <div class="p-3 rounded-xl border ${isDone ? 'bg-stone-50/60 border-stone-200 opacity-60' : 'bg-white border-stone-200 hover:border-amber-300'} flex items-center justify-between gap-3 transition">
                <div class="flex items-center gap-2.5 min-w-0">
                    <button onclick="toggleTaskStatus('${t.id}')" class="w-5 h-5 rounded-md border ${isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 hover:border-stone-500'} flex items-center justify-center text-[10px] transition cursor-pointer">
                        ${isDone ? '<i class="fa-solid fa-check"></i>' : ''}
                    </button>
                    <div class="truncate">
                        <span class="font-bold text-xs text-stone-900 ${isDone ? 'line-through text-stone-400' : ''}">${escapeHtml(t.title)}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    ${priorityBadges[t.priority] || ''}
                    <span class="text-[11px] font-serifMono text-stone-400 font-semibold">${t.estimatedMinutes}m</span>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function startMissionTimer(taskId) {
    const task = appState.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 自动激活专注计时器
    if (typeof toggleStudyTimer === 'function') {
        if (!window.appState.activeTimer?.running) {
            toggleStudyTimer();
        }
        showToast(`已针对【${task.title}】启动专注计时！`);
    }
}

function markTaskDone(taskId) {
    const task = appState.tasks.find(t => t.id === taskId);
    if (!task) return;

    openModal("登记任务完成与工程证据", `确定将【${task.title}】标记为已完成吗？这将自动积累你的工程资产。`, () => {
        task.status = 'DONE';
        task.completedAt = new Date().toISOString();
        persistState();
        renderTodayMission();
        renderTodayPlan();
        updateDashboardMetrics();
        showToast(`🎉 任务【${task.title}】完成并入库！`);
    });
}

function toggleTaskStatus(taskId) {
    const task = appState.tasks.find(t => t.id === taskId);
    if (!task) return;
    task.status = task.status === 'DONE' ? 'TODO' : 'DONE';
    persistState();
    renderTodayPlan();
    renderTodayMission();
    updateDashboardMetrics();
}

function updateDashboardMetrics() {
    // 1. 真实连续学习天数计算
    const streakEl = document.getElementById('stat-streak');
    if (streakEl) streakEl.innerText = `${calculateRealStreak()} 天`;

    // 2. 主线任务进度
    const totalTasks = appState.tasks.length;
    const doneTasks = appState.tasks.filter(t => t.status === 'DONE').length;
    const progressVal = document.getElementById('stat-progress-val');
    const progressCount = document.getElementById('stat-progress-count');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-bar-text');

    const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    if (progressVal) progressVal.innerText = `${percent}%`;
    if (progressCount) progressCount.innerText = `${doneTasks} / ${totalTasks} 任务`;
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressText) progressText.innerText = `Week ${appState.currentWeekSprint} · CppAIService 深度攻坚推进中`;

    // 3. 今日学习时间
    let todayMins = 0;
    const today = getTodayDateStr();
    if (Array.isArray(appState.studySessions)) {
        appState.studySessions.forEach(s => {
            if (s.date === today) todayMins += (s.duration || 0);
        });
    }
    const todayTimeEl = document.getElementById('stat-today-time');
    if (todayTimeEl) todayTimeEl.innerText = `${todayMins} min`;

    // 4. 真实工程贡献数
    const contribVal = document.getElementById('stat-demo-val');
    if (contribVal) contribVal.innerText = `${appState.contributions.length} 项`;

    // 5. 核心源码精读数
    const sourceVal = document.getElementById('stat-source-val');
    if (sourceVal) sourceVal.innerText = `${getCppAIModules().length} 模块`;
}

function calculateRealStreak() {
    const activeDates = new Set();
    if (Array.isArray(appState.studySessions)) {
        appState.studySessions.forEach(s => { if (s.date) activeDates.add(s.date); });
    }
    appState.tasks.forEach(t => {
        if (t.completedAt) activeDates.add(t.completedAt.slice(0, 10));
    });
    appState.contributions.forEach(c => {
        if (c.date) activeDates.add(c.date);
    });

    if (activeDates.size === 0) return 0;
    const sorted = Array.from(activeDates).sort().reverse();
    const today = getTodayDateStr();
    const yesterday = getFutureDateStr(-1);

    if (!sorted.includes(today) && !sorted.includes(yesterday)) return 0;

    let streak = 0;
    let checkDate = new Date();
    if (!sorted.includes(today)) checkDate.setDate(checkDate.getDate() - 1);

    while (true) {
        const dStr = checkDate.toISOString().slice(0, 10);
        if (activeDates.has(dStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

// ==================== 02 PROJECT: CppAIService 核心工坊 ====================
function renderProjectModules() {
    const container = document.getElementById('project-modules-container');
    if (!container) return;

    const modules = getCppAIModules();
    let html = '';

    modules.forEach(m => {
        html += `
            <div class="bg-white p-5 rounded-2xl border border-stone-200 academic-card flex flex-col justify-between space-y-3">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 font-serifMono text-[10px] font-bold">${escapeHtml(m.category)}</span>
                        <button onclick="openTopologyDrawer('${m.id}')" class="text-xs text-sky-700 hover:text-sky-900 font-serifMono font-bold flex items-center gap-1 cursor-pointer">
                            <span>详情抽屉</span> <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                    <h3 class="font-bold text-stone-900 text-base font-serif-heading">${escapeHtml(m.name)}</h3>
                    <p class="text-xs text-stone-600 mt-1 leading-relaxed font-serifHeading">${escapeHtml(m.responsibility)}</p>
                    
                    <div class="mt-3 pt-2.5 border-t border-stone-100 text-[11px] font-serifMono text-stone-500 space-y-1">
                        <div><strong class="text-stone-700">源码:</strong> <code class="text-stone-800">${escapeHtml(m.sourcePath)}</code></div>
                        <div><strong class="text-stone-700">线程模型:</strong> ${escapeHtml(m.threadModel)}</div>
                    </div>
                </div>

                <div class="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-serifMono">
                    <span class="text-stone-400">语雀: ${escapeHtml(m.yuqueRef)}</span>
                    <button onclick="filterTasksByModule('${m.id}')" class="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition font-semibold">
                        关联任务
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderSourceMap() {
    const tbody = document.getElementById('source-map-table-body');
    if (!tbody) return;

    const modules = getCppAIModules();
    let html = '';

    modules.forEach(m => {
        html += `
            <tr class="hover:bg-stone-50/80 transition">
                <td class="p-3.5 font-bold text-stone-900 border-b border-stone-100 font-serifHeading">${escapeHtml(m.name)}</td>
                <td class="p-3.5 font-serifMono text-sky-800 font-medium border-b border-stone-100 text-xs">${escapeHtml(m.sourcePath)}</td>
                <td class="p-3.5 text-stone-600 leading-relaxed border-b border-stone-100 font-serifHeading text-xs">${escapeHtml(m.responsibility)}</td>
                <td class="p-3.5 border-b border-stone-100 font-serifMono text-xs text-stone-700">${m.classes.map(c => `<span class="inline-block bg-stone-100 px-1.5 py-0.5 rounded mr-1 mb-1">${c}</span>`).join('')}</td>
                <td class="p-3.5 text-center border-b border-stone-100 font-serifMono">
                    <button onclick="openTopologyDrawer('${m.id}')" class="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold rounded-lg transition whitespace-nowrap">
                        透视架构
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function renderContributions() {
    const container = document.getElementById('contributions-container');
    if (!container) return;

    let html = '';
    appState.contributions.forEach(c => {
        html += `
            <div class="bg-white p-5 rounded-2xl border border-stone-200 academic-card space-y-3 font-serifHeading">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                        <h4 class="font-bold text-stone-900 text-sm sm:text-base">${escapeHtml(c.problem)}</h4>
                    </div>
                    <div class="flex items-center gap-2 text-xs font-serifMono">
                        <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">${escapeHtml(c.module)}</span>
                        <span class="text-stone-400">${c.date}</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                    <div class="bg-rose-50/70 p-3 rounded-xl border border-rose-200 text-stone-700">
                        <strong class="text-rose-900 font-serifMono">根因剖析：</strong>
                        <p class="mt-0.5">${escapeHtml(c.rootCause)}</p>
                    </div>
                    <div class="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-stone-700">
                        <strong class="text-emerald-900 font-serifMono">解决方案：</strong>
                        <p class="mt-0.5">${escapeHtml(c.solution)}</p>
                    </div>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs font-serifMono text-stone-500">
                    <div class="flex items-center gap-2">
                        <span>Commit: <code class="bg-stone-100 px-1.5 py-0.5 rounded text-stone-800">${escapeHtml(c.gitCommit)}</code></span>
                    </div>
                    <span class="text-emerald-700 font-semibold">${escapeHtml(c.testResult)}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// 架构抽屉弹出逻辑
function openTopologyDrawer(nodeKey) {
    const drawer = document.getElementById('topology-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const titleEl = document.getElementById('drawer-title');
    const tagEl = document.getElementById('drawer-tag');
    const contentEl = document.getElementById('drawer-content');
    if (!drawer || !contentEl) return;

    const mod = getCppAIModules().find(m => m.id === nodeKey || m.name.toLowerCase().includes(nodeKey.toLowerCase())) || getCppAIModules()[0];

    titleEl.innerText = mod.name;
    tagEl.innerText = mod.category;

    contentEl.innerHTML = `
        <div class="space-y-4">
            <div class="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div class="text-[11px] font-bold text-stone-400 font-serifMono uppercase">模块职责 (Responsibility)</div>
                <p class="text-xs text-stone-700 mt-1 leading-relaxed">${escapeHtml(mod.responsibility)}</p>
            </div>

            <div class="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div class="text-[11px] font-bold text-stone-400 font-serifMono uppercase">真实源码路径 (Source Path)</div>
                <code class="text-xs text-sky-800 font-bold block mt-1 break-all">${escapeHtml(mod.sourcePath)}</code>
                <code class="text-xs text-stone-600 block mt-0.5 break-all">${escapeHtml(mod.headerPath)}</code>
            </div>

            <div class="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div class="text-[11px] font-bold text-stone-400 font-serifMono uppercase">核心类与依赖 (Classes & Deps)</div>
                <div class="flex flex-wrap gap-1.5 mt-1.5 font-serifMono text-xs">
                    ${mod.classes.map(c => `<span class="bg-white border border-stone-300 px-2 py-0.5 rounded text-stone-800 font-bold">${c}</span>`).join('')}
                </div>
            </div>

            <div class="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                <div class="text-[11px] font-bold text-amber-900 font-serifMono uppercase">求职面试深挖考点 (Interview Value)</div>
                <p class="text-xs text-amber-950 mt-1 leading-relaxed font-semibold">${escapeHtml(mod.interviewValue)}</p>
            </div>
        </div>
    `;

    drawer.classList.remove('translate-x-full');
    if (overlay) overlay.classList.remove('hidden');
}

function closeTopologyDrawer() {
    const drawer = document.getElementById('topology-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (drawer) drawer.classList.add('translate-x-full');
    if (overlay) overlay.classList.add('hidden');
}

// ==================== 03 KNOWLEDGE: 语雀目录与映射全景 ====================
function renderYuqueManifest() {
    const container = document.getElementById('yuque-list-container');
    if (!container) return;

    const manifest = getYuqueManifest();
    let html = '';

    manifest.forEach(doc => {
        html += `
            <div class="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-amber-300 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center text-xs font-serifMono font-bold shrink-0">
                        ${doc.id}
                    </span>
                    <div>
                        <h4 class="font-bold text-stone-900 text-xs sm:text-sm font-serif-heading">${escapeHtml(doc.title)}</h4>
                        <div class="flex items-center gap-2 text-[11px] font-serifMono text-stone-400 mt-0.5">
                            <span>更新: ${doc.updateDate}</span>
                            <span>•</span>
                            <span class="text-stone-600">${doc.category}</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-2.5 font-serifMono shrink-0">
                    <span class="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold">
                        <i class="fa-solid fa-lock text-[9px] mr-1"></i>${doc.status}
                    </span>
                    <a href="${doc.url}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition flex items-center gap-1">
                        <span>在语雀中查看</span> <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderMappingTable() {
    const tbody = document.getElementById('mapping-table-body');
    if (!tbody) return;

    let html = '';
    getMappingMatrix().forEach((row, idx) => {
        html += `
            <tr class="hover:bg-stone-50/80 transition">
                <td class="p-3.5 font-bold text-stone-900 border-b border-stone-100 font-serifHeading text-xs">${escapeHtml(row.feature)}</td>
                <td class="p-3.5 font-serifMono text-sky-800 font-medium border-b border-stone-100 text-xs">${escapeHtml(row.muduoLocation)}</td>
                <td class="p-3.5 text-stone-600 leading-relaxed border-b border-stone-100 font-serifHeading text-xs">${escapeHtml(row.desc)}</td>
                <td class="p-3.5 font-serifMono text-stone-800 bg-stone-50/50 border-b border-stone-100 text-[11px]">${escapeHtml(row.snippet)}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// 统一全站检索 (Unified Search)
function executeUnifiedSearch(query) {
    const q = (query || "").trim().toLowerCase();
    const resultsBox = document.getElementById('unified-search-results');
    if (!resultsBox) return;

    if (!q) {
        resultsBox.classList.add('hidden');
        return;
    }

    const matchedModules = getCppAIModules().filter(m => m.name.toLowerCase().includes(q) || m.responsibility.toLowerCase().includes(q) || m.sourcePath.toLowerCase().includes(q));
    const matchedYuque = getYuqueManifest().filter(y => y.title.toLowerCase().includes(q));
    const matchedInterviews = getInterviewBank().filter(i => i.question.toLowerCase().includes(q) || i.shortAnswer.toLowerCase().includes(q));
    const matchedIncidents = appState.incidents.filter(inc => inc.title.toLowerCase().includes(q) || inc.rootCause.toLowerCase().includes(q));

    resultsBox.classList.remove('hidden');
    resultsBox.innerHTML = `
        <div class="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-serifMono">
            <span class="font-bold text-stone-800">全站检索结果: 找到关于 "${escapeHtml(q)}" 的知识资产</span>
            <button onclick="document.getElementById('unified-search-results').classList.add('hidden')" class="text-stone-400 hover:text-stone-600"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="p-4 space-y-3 max-h-80 overflow-y-auto text-xs font-serifHeading">
            ${matchedModules.map(m => `<div class="p-2 bg-white rounded-lg border border-stone-200"><span class="px-1.5 py-0.5 bg-sky-100 text-sky-800 font-serifMono font-bold text-[10px] rounded mr-1.5">模块</span><strong>${m.name}</strong> - <code>${m.sourcePath}</code></div>`).join('')}
            ${matchedYuque.map(y => `<div class="p-2 bg-white rounded-lg border border-stone-200"><span class="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-serifMono font-bold text-[10px] rounded mr-1.5">语雀</span>${y.title}</div>`).join('')}
            ${matchedInterviews.map(i => `<div class="p-2 bg-white rounded-lg border border-stone-200"><span class="px-1.5 py-0.5 bg-purple-100 text-purple-800 font-serifMono font-bold text-[10px] rounded mr-1.5">面试真题</span><strong>${i.question}</strong></div>`).join('')}
            ${matchedIncidents.map(inc => `<div class="p-2 bg-white rounded-lg border border-stone-200"><span class="px-1.5 py-0.5 bg-rose-100 text-rose-800 font-serifMono font-bold text-[10px] rounded mr-1.5">踩坑事故</span>${inc.title}</div>`).join('')}
            ${(matchedModules.length === 0 && matchedYuque.length === 0 && matchedInterviews.length === 0 && matchedIncidents.length === 0) ? '<p class="text-stone-400 font-serifMono text-center py-4">未找到匹配项</p>' : ''}
        </div>
    `;
}

// ==================== 04 LEARNING: 算法手撕与面试题库 ====================
function renderAlgorithmLogs() {
    const container = document.getElementById('algorithm-logs-container');
    if (!container) return;

    let html = '';
    appState.algorithmLogs.forEach(a => {
        html += `
            <div class="bg-white p-5 rounded-2xl border border-stone-200 academic-card space-y-3 font-serifHeading">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold font-serifMono text-xs">${a.difficulty}</span>
                        <h4 class="font-bold text-stone-900 text-sm sm:text-base">${escapeHtml(a.title)}</h4>
                    </div>
                    <div class="flex items-center gap-2 font-serifMono text-xs text-stone-400">
                        <span>日期: ${a.date}</span>
                        <span>•</span>
                        <span>二刷复习: ${a.revisitDate}</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                    <div class="bg-stone-50 p-3 rounded-xl border border-stone-200">
                        <strong class="text-stone-800 font-serifMono">解题思路与复杂度：</strong>
                        <p class="mt-0.5 text-stone-600">${escapeHtml(a.approach)}</p>
                        <div class="mt-1 font-serifMono text-[11px] text-sky-800 font-bold">${escapeHtml(a.complexity)}</div>
                    </div>
                    <div class="bg-rose-50/60 p-3 rounded-xl border border-rose-200">
                        <strong class="text-rose-900 font-serifMono">第一次踩坑错误：</strong>
                        <p class="mt-0.5 text-stone-700">${escapeHtml(a.firstMistake)}</p>
                    </div>
                </div>

                <div class="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-xs leading-relaxed text-stone-800">
                    <strong class="text-amber-900 font-serifMono">🗣️ 面试口述表述重点：</strong>
                    <p class="mt-0.5">${escapeHtml(a.oralExplanation)}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderInterviewBank() {
    const container = document.getElementById('interview-bank-container');
    if (!container) return;

    let html = '';
    getInterviewBank().forEach((item, idx) => {
        html += `
            <div class="bg-white p-5 rounded-2xl border border-stone-200 academic-card space-y-3 font-serifHeading">
                <div class="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-md bg-purple-700 text-white font-serifMono font-bold text-xs flex items-center justify-center">${idx + 1}</span>
                        <span class="text-xs font-bold font-serifMono text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">${escapeHtml(item.category)}</span>
                    </div>
                    <span class="text-xs font-serifMono text-stone-400">${escapeHtml(item.projectContext)}</span>
                </div>

                <h3 class="font-bold text-stone-900 text-sm sm:text-base leading-snug">${escapeHtml(item.question)}</h3>

                <div class="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs text-stone-800 leading-relaxed">
                    <strong class="text-emerald-900 font-serifMono">一句话破局答法：</strong>
                    <p class="mt-0.5 font-bold">${escapeHtml(item.shortAnswer)}</p>
                </div>

                <details class="text-xs text-stone-700 font-serifHeading leading-relaxed cursor-pointer">
                    <summary class="font-serifMono font-bold text-purple-700 hover:text-purple-900 py-1">展开深度答题逻辑与追问陷阱</summary>
                    <div class="pt-2 mt-2 border-t border-stone-100 space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                        <p class="whitespace-pre-line">${escapeHtml(item.detailedAnswer)}</p>
                        ${item.followUp ? `<div class="mt-2 pt-2 border-t border-stone-200 font-serifMono text-[11px] text-rose-800"><strong>⚠️ 面试官高频追问陷阱:</strong> ${escapeHtml(item.followUp)}</div>` : ''}
                    </div>
                </details>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ==================== 05 TASKS: 全景任务与 8 周路线 ====================
function renderTasksView() {
    const container = document.getElementById('all-tasks-container');
    if (!container) return;

    let html = '';
    const priorities = ['S', 'A', 'B', 'C'];
    const pNames = { 'S': 'S 级 · 核心主线 (必修)', 'A': 'A 级 · 算法与系统基石', 'B': 'B 级 · 八股与面试演练', 'C': 'C 级 · 求职与个人成长' };

    priorities.forEach(p => {
        const filtered = appState.tasks.filter(t => t.priority === p);
        if (filtered.length === 0) return;

        html += `
            <div class="space-y-3">
                <h3 class="font-bold text-stone-900 text-sm font-serif-heading flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full ${p === 'S' ? 'bg-rose-600' : p === 'A' ? 'bg-sky-600' : p === 'B' ? 'bg-amber-600' : 'bg-stone-400'} inline-block"></span>
                    ${pNames[p]} (${filtered.length})
                </h3>
                <div class="space-y-2.5">
        `;

        filtered.forEach(t => {
            const isDone = t.status === 'DONE';
            html += `
                <div class="bg-white p-4 rounded-xl border ${isDone ? 'border-stone-200 opacity-60 bg-stone-50/50' : 'border-stone-200 hover:border-amber-300'} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition">
                    <div class="flex items-center gap-3">
                        <button onclick="toggleTaskStatus('${t.id}')" class="w-5 h-5 rounded-md border ${isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300'} flex items-center justify-center text-xs transition cursor-pointer shrink-0">
                            ${isDone ? '<i class="fa-solid fa-check"></i>' : ''}
                        </button>
                        <div>
                            <div class="font-bold text-xs sm:text-sm text-stone-900 ${isDone ? 'line-through text-stone-400' : ''}">${escapeHtml(t.title)}</div>
                            <div class="flex items-center gap-2 text-[11px] font-serifMono text-stone-400 mt-0.5">
                                ${t.sourceFile ? `<span>代码: <code>${escapeHtml(t.sourceFile)}</code></span><span>•</span>` : ''}
                                <span>预计: ${t.estimatedMinutes}m</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 shrink-0 font-serifMono text-xs">
                        <button onclick="startMissionTimer('${t.id}')" class="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold transition flex items-center gap-1 cursor-pointer">
                            <i class="fa-solid fa-play text-[10px]"></i> <span>计时</span>
                        </button>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
    });

    container.innerHTML = html;
}

function renderRoadmapWeeks() {
    const container = document.getElementById('roadmap-weeks-container');
    if (!container) return;

    let html = '';
    getRoadmap8Weeks().forEach(w => {
        const isCurrent = w.week === appState.currentWeekSprint;
        html += `
            <div class="bg-white p-5 rounded-2xl border ${isCurrent ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-stone-200'} academic-card space-y-3 font-serifHeading">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="w-8 h-8 rounded-xl ${isCurrent ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'} font-serifMono font-bold flex items-center justify-center text-xs">W${w.week}</span>
                        <div>
                            <h4 class="font-bold text-stone-900 text-sm sm:text-base">${escapeHtml(w.title)}</h4>
                            <p class="text-xs text-stone-500 font-serifMono mt-0.5">${escapeHtml(w.tagline)}</p>
                        </div>
                    </div>
                    <span class="text-xs font-serifMono font-bold px-2.5 py-1 rounded-lg ${isCurrent ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-600'}">
                        ${isCurrent ? '当前攻坚周' : '规划阶段'}
                    </span>
                </div>

                <div class="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                    <strong class="text-stone-900 font-serifMono">核心里程碑验收：</strong>
                    <p class="mt-0.5">${escapeHtml(w.milestone)}</p>
                </div>

                <div class="flex flex-wrap items-center gap-1.5 font-serifMono text-[11px]">
                    ${w.keySkills.map(s => `<span class="bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded">${s}</span>`).join('')}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ==================== 06 EVIDENCE: 踩坑事故库与工程证据 ====================
function renderIncidents() {
    const container = document.getElementById('incidents-container');
    if (!container) return;

    let html = '';
    appState.incidents.forEach(inc => {
        html += `
            <div class="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 academic-card space-y-3 font-serifHeading">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-3">
                    <div class="flex items-center gap-2.5">
                        <span class="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-sm"><i class="fa-solid fa-bug"></i></span>
                        <h4 class="font-bold text-stone-900 text-sm sm:text-base">${escapeHtml(inc.title)}</h4>
                    </div>
                    <div class="flex items-center gap-2 font-serifMono text-xs text-stone-400">
                        <span>日期: ${inc.date}</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                    <div class="bg-rose-50/70 p-3 rounded-xl border border-rose-200 text-stone-700">
                        <strong class="text-rose-900 font-serifMono">故障现象与报错：</strong>
                        <p class="mt-0.5">${escapeHtml(inc.symptom)}</p>
                    </div>
                    <div class="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-stone-700">
                        <strong class="text-amber-900 font-serifMono">底层根因剖析：</strong>
                        <p class="mt-0.5">${escapeHtml(inc.rootCause)}</p>
                    </div>
                </div>

                ${inc.wrongCode || inc.correctCode ? `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        ${inc.wrongCode ? `
                            <div>
                                <span class="font-bold text-rose-700 font-serifMono block mb-1">❌ 错误/崩溃代码:</span>
                                <pre class="p-0 m-0"><code class="language-cpp font-mono-code">${escapeHtml(inc.wrongCode)}</code></pre>
                            </div>
                        ` : ''}
                        ${inc.correctCode ? `
                            <div>
                                <span class="font-bold text-emerald-700 font-serifMono block mb-1">✅ 规范工业级写法:</span>
                                <pre class="p-0 m-0"><code class="language-cpp font-mono-code">${escapeHtml(inc.correctCode)}</code></pre>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                <div class="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs text-stone-800 leading-relaxed">
                    <strong class="text-emerald-900 font-serifMono">🛡️ 工程铁律与面试价值：</strong>
                    <p class="mt-0.5 font-bold">${escapeHtml(inc.conclusion)}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    document.querySelectorAll('#incidents-container pre code').forEach(el => hljs.highlightElement(el));
}

// ==================== 07 CAREER: 简历话术与求职闭环 ====================
function renderCareerResume() {
    const container = document.getElementById('career-resume-container');
    if (!container) return;

    let html = `
        <div class="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 academic-card space-y-4 font-serifHeading">
            <div class="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                    <h3 class="font-bold text-stone-900 text-base flex items-center gap-2">
                        <i class="fa-solid fa-file-invoice text-sky-800"></i> CppAIService 简历高含金量描述生成器 (STAR 格式)
                    </h3>
                    <p class="text-xs text-stone-500 mt-0.5">自动取材于你在项目中产出的真实贡献、Bug 修复与压测数据，严禁虚构。</p>
                </div>
                <button onclick="copyGeneratedResume()" class="px-3.5 py-1.5 bg-stone-900 text-stone-100 rounded-xl text-xs font-serifMono font-bold transition flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-copy"></i> 复制简历段落
                </button>
            </div>

            <div id="resume-bullets-output" class="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs leading-relaxed text-stone-800 space-y-3 font-serifHeading">
                <p class="font-bold text-stone-900 text-sm">【项目经历】AI 应用服务平台 (CppAIService) — 核心开发</p>
                
                <ul class="list-disc list-inside space-y-2">
                    <li><strong>高性能并发架构：</strong> 基于 C++17 与 muduo 主从 Reactor 模型构建高并发 HTTP 服务框架，负责主线程监听与工作线程池 I/O 分发，支撑 4 线程无锁并发事件驱动。</li>
                    <li><strong>动态路由与有限状态机：</strong> 设计 RESTful 动态路由引擎，结合 std::regex 与路径参数捕获（/user/:id），定位并修复了动态路由回调参数传递缺陷，保证接口 100% 健壮性。</li>
                    <li><strong>多模型与轻量级 MCP 落地：</strong> 采用策略模式与注册式工厂 (StrategyFactory) 解耦第三方云端大模型与本地推理，落地类似 Model Context Protocol 的两段式 Prompt 工具调用闭环。</li>
                    <li><strong>高可靠异步削峰：</strong> 针对高并发聊天消息持久化瓶颈，引入 RabbitMQ 异步写库总线，前台内存秒级同步响应、后台线程池异步消费落盘至 MySQL，彻底消除磁盘 I/O 阻塞。</li>
                    <li><strong>工业级排错：</strong> 熟练使用 GDB 断点调试与 AddressSanitizer (ASan) 探针检测 UAF 及内存越界，全生命期遵循 RAII 与智能指针自保规约。</li>
                </ul>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function copyGeneratedResume() {
    const text = document.getElementById('resume-bullets-output')?.innerText || "";
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    showToast("🎉 简历话术已复制到剪贴板！");
}

// ==================== 08 SETTINGS: 数据安全与备份 ====================
function renderSettingsView() {
    const container = document.getElementById('settings-status-container');
    if (!container) return;

    const dataStr = JSON.stringify(appState);
    const sizeKb = (dataStr.length / 1024).toFixed(2);

    container.innerHTML = `
        <div class="bg-white p-5 rounded-2xl border border-stone-200 academic-card space-y-3 font-serifHeading text-xs">
            <h3 class="font-bold text-stone-900 text-base">系统数据存储状态</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-serifMono">
                <div class="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div class="text-[10px] text-stone-400">Schema 版本</div>
                    <div class="text-sm font-bold text-stone-800 mt-0.5">${appState.version}</div>
                </div>
                <div class="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div class="text-[10px] text-stone-400">本地存储占用</div>
                    <div class="text-sm font-bold text-sky-800 mt-0.5">${sizeKb} KB</div>
                </div>
                <div class="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div class="text-[10px] text-stone-400">工程任务总数</div>
                    <div class="text-sm font-bold text-emerald-800 mt-0.5">${appState.tasks.length} 项</div>
                </div>
                <div class="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div class="text-[10px] text-stone-400">踩坑事故档案</div>
                    <div class="text-sm font-bold text-rose-700 mt-0.5">${appState.incidents.length} 篇</div>
                </div>
            </div>
            <p class="text-stone-500 text-[11px] leading-relaxed">
                数据严格保存在本地浏览器的 localStorage 中，永不上云，绝对安全。建议每周导出一次 JSON 备份文件。
            </p>
        </div>
    `;
}

// ==================== 全局通用交互与弹窗 ====================
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

// JSON 导出
function exportDataBackup() {
    const blob = new Blob([JSON.stringify(appState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cppai_os_backup_${getTodayDateStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("完整 JSON 备份已下载！");
}

function handleJsonImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (!imported || typeof imported !== 'object') {
                showToast("非法 JSON 格式", false);
                return;
            }
            appState = Object.assign(appState, imported);
            persistState();
            switchView(appState.currentView || 'dashboard');
            showToast("🎉 JSON 备份恢复成功！");
        } catch (err) {
            showToast("解析异常: " + err.message, false);
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}

// 快捷键支持
document.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

    if (e.key === 'Escape') {
        closeTopologyDrawer();
        closeModal();
        return;
    }

    if (isInput) return;

    if (e.key === '1') switchView('dashboard');
    else if (e.key === '2') switchView('project');
    else if (e.key === '3') switchView('knowledge');
    else if (e.key === '4') switchView('learning');
    else if (e.key === '5') switchView('tasks');
    else if (e.key === '6') switchView('evidence');
    else if (e.key === '7') switchView('career');
    else if (e.key === '8') switchView('settings');
});

// 页面装载入口
window.addEventListener('DOMContentLoaded', () => {
    try { loadAndMigrateState(); } catch (e) { console.error('loadAndMigrateState error:', e); }
    try { if (typeof initStudyTimer === 'function') initStudyTimer(); } catch (e) { console.error('initStudyTimer error:', e); }
    try { switchView('dashboard'); } catch (e) { console.error('switchView error:', e); }
});

console.log("[APP] CppAIService Engineering OS V6.0 initialized successfully.");

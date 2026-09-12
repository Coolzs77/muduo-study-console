// ==========================================================================
// CppAIService & muduo Dual-Core Engineering OS
// 统一状态机与持久化架构 (state-manager.js)
// 职责：统一集中式状态管理、SchemaMigrationV6 无损迁移、冷备份保护、双向镜像兼容、导出与导入
// ==========================================================================

(function(global) {
  'use strict';

  // 存储键常量定义
  const STORAGE_KEYS = {
    V6_DATA: 'muduo_v6_data',
    V6_COLD_BACKUP: 'muduo_v5_backup_before_v6',
    V5_DATA: 'muduo_v5_data',
    LEGACY_COMPLETED: 'muduo_academic_completed',
    LEGACY_DAYNOTES: 'muduo_academic_daynotes',
    LEGACY_GLOBALNOTES: 'muduo_academic_globalnotes',
    CPPAI_MASTERY: 'cppai_knowledge_mastery',
    CPPAI_FAVS: 'cppai_knowledge_favs',
    CPPAI_RECENT: 'cppai_knowledge_recent',
    CPPAI_SIDEBAR_COLLAPSED: 'cppai_sidebar_collapsed'
  };

  const CURRENT_SCHEMA_VERSION = '6.0.0';

  // 内存备用存储（防隐私模式/无 localStorage 环境崩溃）
  const memoryStorage = {};
  function safeGetItem(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('[StateManager] Storage read blocked, using memory fallback', e);
    }
    return memoryStorage[key] || null;
  }

  function safeSetItem(key, val) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val);
        return;
      }
    } catch (e) {
      console.warn('[StateManager] Storage write blocked, using memory fallback', e);
    }
    memoryStorage[key] = val;
  }

  function safeRemoveItem(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
        return;
      }
    } catch (e) {}
    delete memoryStorage[key];
  }

  // 工具函数：获取默认避坑列表
  function getDefaultPitfalls() {
    if (typeof getPitfallsDataset === 'function') return getPitfallsDataset();
    if (typeof PITFALLS_DATASET !== 'undefined' && Array.isArray(PITFALLS_DATASET)) return PITFALLS_DATASET;
    if (typeof global !== 'undefined' && global.PITFALLS_DATASET && Array.isArray(global.PITFALLS_DATASET)) return global.PITFALLS_DATASET;
    return [];
  }

  // 工具函数：获取默认任务列表
  function getDefaultDailyTasks() {
    if (typeof TaskDomain !== 'undefined' && typeof TaskDomain.createFreshDailyTasks === 'function') {
      return TaskDomain.createFreshDailyTasks();
    }
    if (typeof window !== 'undefined' && window.TaskDomain && typeof window.TaskDomain.createFreshDailyTasks === 'function') {
      return window.TaskDomain.createFreshDailyTasks();
    }
    if (typeof global !== 'undefined' && global.TaskDomain && typeof global.TaskDomain.createFreshDailyTasks === 'function') {
      return global.TaskDomain.createFreshDailyTasks();
    }
    try {
      if (typeof require === 'function') {
        const td = require('./dataset-tasks.js');
        if (td && typeof td.createFreshDailyTasks === 'function') return td.createFreshDailyTasks();
      }
    } catch (e) {}
    return [];
  }

  // 工具函数：获取今日标准日期字符串 (YYYY-MM-DD)
  function getTodayDateStr() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 工具函数：创建默认每日日程状态
  function createDefaultDailyRoutine() {
    return {
      date: getTodayDateStr(),
      mode: 'normal', // 'normal' | 'compact'
      tasks: getDefaultDailyTasks(),
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

  // 工具函数：获取默认工程工作日志
  function getDefaultWorkLogs() {
    return [
      {
        id: "log-seed-1",
        date: getTodayDateStr(),
        project: "CppAIService",
        module: "HTTP Router",
        logType: "bugfix",
        what: "排查并修复 Router 正则路由匹配失效缺陷，补全参数抽取单元测试",
        problem: "部分带有路径参数（如 /api/v1/model/:name）的 URL 命中失败，前缀匹配截断位置偏差。",
        solution: "重构 Router.cpp 中的参数占位符切分状态机，修正分隔符判断，新增 4 组单元测试验证边界。",
        learned: "HTTP 路由树前缀匹配必须严格在路径分隔符 '/' 处切分 token，避免子串误匹配。",
        next: "实现中间件拦截器链 (Middleware Chain) 机制。",
        relatedFiles: ["src/http/Router.cpp", "tests/Router_test.cpp"],
        interviewPoint: "能清晰解释 HTTP 路由前缀树匹配原理与路径参数抽取的边界条件处理",
        createdAt: Date.now() - 3600000 * 2
      },
      {
        id: "log-seed-2",
        date: "2026-09-11",
        project: "CppAIService",
        module: "HttpContext",
        logType: "code_feature",
        what: "重构 HttpContext 状态机解析器，实现请求行与请求头分段解析",
        problem: "非阻塞 socket 读取时容易遇到分包与粘包，半包状态下状态机需要安全保存未决上下文。",
        solution: "基于 muduo Buffer 的 readIndex/writeIndex 机制，在 HttpContext 中维护状态迁移枚举 (ExpectRequestLine -> ExpectHeaders -> ExpectBody -> GotAll)。",
        learned: "网络库协议解析不能假定一次 read 读满完整包，状态机必须具备幂等可重入特征。",
        next: "完成 HttpContext 单元测试并接入 EchoServer 进行压测验证。",
        relatedFiles: ["src/http/HttpContext.cpp", "src/http/HttpRequest.h"],
        interviewPoint: "能独立推演非阻塞 I/O 下 HTTP 协议状态机解析与粘包/半包恢复流程",
        createdAt: Date.now() - 3600000 * 24
      },
      {
        id: "log-seed-3",
        date: "2026-09-10",
        project: "muduo",
        module: "EventLoop",
        logType: "source_study",
        what: "精读 EventLoop.cc 与 Channel.cc 源码，梳理事件循环唤醒机制",
        problem: "在其他线程向 EventLoop 投递任务 (queueInLoop) 时，如何安全唤醒正在 poll 阻塞的事件循环？",
        solution: "muduo 使用 eventfd (Linux 原生轻量计数器) 创建 wakeupChannel，在 queueInLoop 中写入 8 字节 uint64_t 触发 EPOLLIN 唤醒。",
        learned: "eventfd 相比 pipe 仅需单 fd，无锁唤醒系统开销更小。",
        next: "动手编写基于 eventfd 的跨线程任务队列 Demo 进行时延测试。",
        relatedFiles: ["muduo/net/EventLoop.cc", "muduo/net/Channel.cc"],
        interviewPoint: "能深入对比 eventfd 与 socketpair/pipe 在 Reactor 跨线程唤醒中的开销差异",
        createdAt: Date.now() - 3600000 * 48
      }
    ];
  }

  // 工具函数：获取默认统一今日任务
  function getDefaultUnifiedTasks() {
    return [
      {
        id: "task-today-1",
        title: "实现 HttpContext 状态机解析与单测",
        priority: "S",
        category: "project",
        estimatedMinutes: 150,
        moduleRef: "CppAIService::HTTP::HttpContext",
        sourceRef: "src/http/HttpContext.cpp",
        completed: false,
        completedAt: null,
        reflection: null,
        source: "system_preset",
        date: getTodayDateStr()
      },
      {
        id: "task-today-2",
        title: "研读 muduo EventLoop 事件分发流程",
        priority: "A",
        category: "muduo",
        estimatedMinutes: 60,
        moduleRef: "muduo::EventLoop",
        sourceRef: "muduo/net/EventLoop.cc",
        completed: false,
        completedAt: null,
        reflection: null,
        source: "system_preset",
        date: getTodayDateStr()
      },
      {
        id: "task-today-3",
        title: "LeetCode 207: 课程表 (拓扑排序与环检测)",
        priority: "A",
        category: "algo",
        estimatedMinutes: 60,
        moduleRef: "算法::图论",
        sourceRef: "tests/algo_toposort_test.cpp",
        completed: false,
        completedAt: null,
        reflection: null,
        source: "system_preset",
        date: getTodayDateStr()
      },
      {
        id: "task-today-4",
        title: "整理 Reactor 与 Proactor 核心对比",
        priority: "B",
        category: "theory",
        estimatedMinutes: 60,
        moduleRef: "八股::网络模型",
        sourceRef: "docs/Reactor_vs_Proactor.md",
        completed: false,
        completedAt: null,
        reflection: null,
        source: "system_preset",
        date: getTodayDateStr()
      }
    ];
  }

  // 构建默认的纯净领域状态原型
  function createDefaultState() {
    return {
      version: CURRENT_SCHEMA_VERSION,
      lastModified: new Date().toISOString(),
      
      // ---------- muduo 底层网络库 (L0~L2) ----------
      completedDays: [],
      mastery: {},         // { [day]: { level: 0..5, read, quizPassed, demo, independentImpl, sourceUnderstood, completedAt, score, quizScores } }
      reviews: {},         // { [day]: { stage, nextReviewDate, lastReviewDate, intervalDays, reviewCount, history } }
      sourceStatus: {},    // { [nodeId]: { status: '未读'|'研读中'|'已精读', notes } }
      pitfalls: [...getDefaultPitfalls()],
      studySessions: [],   // [ { id, date, time, day, duration, type, note } ]
      dayNotes: {},        // { [day]: text }
      experimentNotes: {}, // { [day]: text }
      globalNotes: "",
      quizRecords: [],     // [ { id, day, timestamp, score, details } ]

      // ---------- CppAIService 上层服务专栏 (L3~L5) ----------
      knowledgeMastery: {},   // { [slug]: 0..5 }
      knowledgeFavorites: [], // [ slug ]
      knowledgeRecent: [],    // [ slug ]

      // ---------- 双核全景拓扑扩展态势 ----------
      projectsProgress: {
        proj_muduo: {
          activeDay: 1,
          currentTrack: "l0_foundation",
          totalDays: 28
        },
        proj_cppai: {
          activeArticle: "01_http_overview",
          currentTrack: "l3_protocol",
          totalArticles: 17
        }
      },

      // ---------- Phase 4: 双轨统一今日任务调度系统 ----------
      dailyRoutine: createDefaultDailyRoutine(),

      // ---------- Phase 5: 统一学习系统 (Unified Learning System) ----------
      learningSystem: {
        algoReviewQueue: {}, // { [num]: 'due' | 'mastered' }
        qaMastery: {},       // { [qaId]: boolean }
        bookDynamicGoals: {
          linuxServer: 10,
          birdLinux: 10
        },
        activeTab: 'cpp'
      },

      // ---------- Phase 6: 求职能力与工程凭证系统 ----------
      careerSystem: {
        evidences: typeof DEFAULT_EVIDENCE_CATALOG !== 'undefined' ? [...DEFAULT_EVIDENCE_CATALOG] : [],
        customEvidences: [],
        mockInterviewLogs: [],     // [{ id, mode, question, rating, notes, timestamp }]
        bookmarkedQuestions: [],    // [questionId]
        activeCareerTab: 'evidence' // 'evidence' | 'capability' | 'interview' | 'mock' | 'star'
      },

      // ---------- Phase 7: 智能任务调度与日历同步系统 ----------
      schedulerSystem: {
        calendarSource: {
          type: 'none', // 'none' | 'ics' | 'tasks' | 'manual'
          fileName: '',
          lastSyncTime: null,
          events: []    // [{ id, summary, startRaw, endRaw, startTimeStr, endTimeStr, durationMinutes, isAllDay, busy, location }]
        },
        googleTasks: [],
        dailySchedule: {
          date: getTodayDateStr(),
          availableMinutes: 840,
          freeSlots: [],
          scheduledBlocks: [],
          deficitMinutes: 0,
          compressionApplied: false,
          compressionLogs: []
        },
        incompleteDiagnostics: {}, // { [taskId]: { reasonKey, reasonName, note, timestamp, suggestedAction } }
        dailyReviews: {},           // { [date]: { date, totalFocusedMinutes, completedCount, incompleteCount, evidenceCount, markdownReport } }
        activeSchedulerTab: 'planner' // 'planner' | 'calendar' | 'diagnostics' | 'review'
      },

      // ---------- V5.1: 真实工程工作日志与项目模块进度 ----------
      workLogs: getDefaultWorkLogs(),
      projectProgress: {
        currentStage: "阶段三：HTTP 协议栈与服务集成",
        activeModule: "HTTP Router",
        completedModules: ["Buffer", "HttpContext", "HttpRequest", "HttpResponse"],
        inProgressModules: ["Router"],
        totalModules: 12
      },
      unifiedTasks: getDefaultUnifiedTasks(),

      // ---------- 运行时与界面交互状态 ----------
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
  }

  // ==========================================================================
  // SchemaMigrationV6: 核心迁移器 (零数据丢失保障机制)
  // ==========================================================================
  class SchemaMigrationV6 {
    static execute(currentState) {
      const v6Raw = safeGetItem(STORAGE_KEYS.V6_DATA);
      if (v6Raw) {
        try {
          const parsed = JSON.parse(v6Raw);
          if (parsed && typeof parsed === 'object') {
            // 已是 V6 数据，执行轻量兼容性补齐
            return SchemaMigrationV6._sanitizeV6(parsed, currentState);
          }
        } catch (e) {
          console.error("[SchemaMigrationV6] Error parsing v6 data:", e);
        }
      }

      // 执行从 V5 及旧版本的升级
      console.log("[SchemaMigrationV6] Initiating non-destructive migration to V6.0.0...");
      
      // 1. 执行强制冷备份 (Cold Backup)
      SchemaMigrationV6._createColdBackup();

      // 2. 收集各分散源的数据
      const state = createDefaultState();

      // 2.1 迁移 muduo_v5_data
      const v5Raw = safeGetItem(STORAGE_KEYS.V5_DATA);
      if (v5Raw) {
        try {
          const v5 = JSON.parse(v5Raw);
          if (v5 && typeof v5 === 'object') {
            if (Array.isArray(v5.completedDays)) state.completedDays = [...v5.completedDays];
            if (v5.mastery && typeof v5.mastery === 'object') state.mastery = Object.assign({}, v5.mastery);
            if (v5.reviews && typeof v5.reviews === 'object') state.reviews = Object.assign({}, v5.reviews);
            if (v5.sourceStatus && typeof v5.sourceStatus === 'object') state.sourceStatus = Object.assign({}, v5.sourceStatus);
            if (Array.isArray(v5.pitfalls) && v5.pitfalls.length > 0) state.pitfalls = [...v5.pitfalls];
            if (Array.isArray(v5.studySessions)) state.studySessions = [...v5.studySessions];
            if (v5.dayNotes && typeof v5.dayNotes === 'object') state.dayNotes = Object.assign({}, v5.dayNotes);
            if (v5.experimentNotes && typeof v5.experimentNotes === 'object') state.experimentNotes = Object.assign({}, v5.experimentNotes);
            if (typeof v5.globalNotes === 'string') state.globalNotes = v5.globalNotes;
            if (Array.isArray(v5.quizRecords)) state.quizRecords = [...v5.quizRecords];
            if (v5.knowledgeMastery) state.knowledgeMastery = Object.assign({}, v5.knowledgeMastery);
            if (Array.isArray(v5.knowledgeFavorites)) state.knowledgeFavorites = [...v5.knowledgeFavorites];
            if (Array.isArray(v5.knowledgeRecent)) state.knowledgeRecent = [...v5.knowledgeRecent];
          }
        } catch (e) {
          console.warn("[SchemaMigrationV6] Error parsing v5 data:", e);
        }
      }

      // 2.2 迁移旧版 V4 遗留键 (若 V5 未涵盖)
      if (state.completedDays.length === 0) {
        const legacyComp = safeGetItem(STORAGE_KEYS.LEGACY_COMPLETED);
        if (legacyComp) {
          try {
            const list = JSON.parse(legacyComp);
            if (Array.isArray(list)) {
              state.completedDays = [...new Set(list)];
              list.forEach(day => {
                if (!state.mastery[day]) {
                  state.mastery[day] = {
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
                }
              });
            }
          } catch(e) {}
        }
      }

      if (Object.keys(state.dayNotes).length === 0) {
        const legacyNotes = safeGetItem(STORAGE_KEYS.LEGACY_DAYNOTES);
        if (legacyNotes) {
          try { state.dayNotes = JSON.parse(legacyNotes) || {}; } catch(e) {}
        }
      }

      if (!state.globalNotes) {
        const legacyGlobal = safeGetItem(STORAGE_KEYS.LEGACY_GLOBALNOTES);
        if (legacyGlobal) state.globalNotes = legacyGlobal;
      }

      // 2.3 迁移 CppAIService 专栏数据
      const yqMasteryRaw = safeGetItem(STORAGE_KEYS.CPPAI_MASTERY);
      if (yqMasteryRaw) {
        try {
          const ym = JSON.parse(yqMasteryRaw);
          if (ym && typeof ym === 'object') {
            state.knowledgeMastery = Object.assign(state.knowledgeMastery, ym);
          }
        } catch(e) {}
      }

      const yqFavsRaw = safeGetItem(STORAGE_KEYS.CPPAI_FAVS);
      if (yqFavsRaw) {
        try {
          const yf = JSON.parse(yqFavsRaw);
          if (Array.isArray(yf)) {
            state.knowledgeFavorites = [...new Set([...state.knowledgeFavorites, ...yf])];
          }
        } catch(e) {}
      }

      const yqRecentRaw = safeGetItem(STORAGE_KEYS.CPPAI_RECENT);
      if (yqRecentRaw) {
        try {
          const yr = JSON.parse(yqRecentRaw);
          if (Array.isArray(yr)) {
            state.knowledgeRecent = [...new Set([...state.knowledgeRecent, ...yr])].slice(0, 10);
          }
        } catch(e) {}
      }

      // 确保 pitfalls 完整
      if (!state.pitfalls || state.pitfalls.length === 0) {
        state.pitfalls = [...getDefaultPitfalls()];
      }

      state.version = CURRENT_SCHEMA_VERSION;
      state.lastModified = new Date().toISOString();

      // 3. 立即持久化 V6 及双向镜像
      StateManagerClass._writeDirect(state);
      console.log("[SchemaMigrationV6] Migration completed successfully. Cold backup preserved.");

      return state;
    }

    // 执行冷备份
    static _createColdBackup() {
      try {
        const backupPayload = {
          backupVersion: CURRENT_SCHEMA_VERSION,
          backupTimestamp: new Date().toISOString(),
          reason: "Automatic cold backup prior to SchemaMigrationV6",
          data: {
            v5Data: safeGetItem(STORAGE_KEYS.V5_DATA),
            legacyCompleted: safeGetItem(STORAGE_KEYS.LEGACY_COMPLETED),
            legacyDayNotes: safeGetItem(STORAGE_KEYS.LEGACY_DAYNOTES),
            legacyGlobalNotes: safeGetItem(STORAGE_KEYS.LEGACY_GLOBALNOTES),
            cppaiMastery: safeGetItem(STORAGE_KEYS.CPPAI_MASTERY),
            cppaiFavs: safeGetItem(STORAGE_KEYS.CPPAI_FAVS),
            cppaiRecent: safeGetItem(STORAGE_KEYS.CPPAI_RECENT)
          }
        };
        safeSetItem(STORAGE_KEYS.V6_COLD_BACKUP, JSON.stringify(backupPayload));
        console.log("[SchemaMigrationV6] Cold backup saved to key: " + STORAGE_KEYS.V6_COLD_BACKUP);
      } catch (e) {
        console.warn("[SchemaMigrationV6] Failed to create cold backup:", e);
      }
    }

    // 净化与补齐 V6 状态
    static _sanitizeV6(parsed, baseState) {
      const merged = Object.assign(createDefaultState(), baseState || {}, parsed);
      merged.version = CURRENT_SCHEMA_VERSION;
      if (!merged.completedDays) merged.completedDays = [];
      if (!merged.mastery) merged.mastery = {};
      if (!merged.reviews) merged.reviews = {};
      if (!merged.sourceStatus) merged.sourceStatus = {};
      if (!merged.pitfalls || merged.pitfalls.length === 0) merged.pitfalls = [...getDefaultPitfalls()];
      if (!merged.studySessions) merged.studySessions = [];
      if (!merged.dayNotes) merged.dayNotes = {};
      if (!merged.experimentNotes) merged.experimentNotes = {};
      if (!merged.knowledgeMastery) merged.knowledgeMastery = {};
      if (!merged.knowledgeFavorites) merged.knowledgeFavorites = [];
      if (!merged.knowledgeRecent) merged.knowledgeRecent = [];
      if (!merged.projectsProgress) {
        merged.projectsProgress = {
          proj_muduo: { activeDay: 1, currentTrack: "l0_foundation", totalDays: 28 },
          proj_cppai: { activeArticle: "01_http_overview", currentTrack: "l3_protocol", totalArticles: 17 }
        };
      }
      // P4: 净化与补齐 dailyRoutine
      if (!merged.dailyRoutine || typeof merged.dailyRoutine !== 'object') {
        merged.dailyRoutine = createDefaultDailyRoutine();
      } else {
        if (!merged.dailyRoutine.date) merged.dailyRoutine.date = getTodayDateStr();
        if (!merged.dailyRoutine.mode) merged.dailyRoutine.mode = 'normal';
        if (!Array.isArray(merged.dailyRoutine.tasks) || merged.dailyRoutine.tasks.length === 0) {
          merged.dailyRoutine.tasks = getDefaultDailyTasks();
        }
        if (!merged.dailyRoutine.records || typeof merged.dailyRoutine.records !== 'object') {
          merged.dailyRoutine.records = {
            algorithm: [],
            books: {
              linuxServer: { currentPage: 0, targetPagesPerDay: 10, notes: "" },
              birdLinux: { currentPage: 0, targetPagesPerDay: 10, notes: "" },
              nonviolentComm: { currentPage: 0, targetPagesPerDay: 10, notes: "" },
              financeZero: { currentPage: 0, targetPagesPerDay: 10, notes: "" },
              gameTheory: { currentPage: 0, targetPagesPerDay: 10, notes: "" }
            },
            careerNotes: ""
          };
        }
        if (!merged.dailyRoutine.history || typeof merged.dailyRoutine.history !== 'object') {
          merged.dailyRoutine.history = {};
        }
      }

      // P5: 净化与补齐 learningSystem
      if (!merged.learningSystem || typeof merged.learningSystem !== 'object') {
        merged.learningSystem = {
          algoReviewQueue: {},
          qaMastery: {},
          bookDynamicGoals: { linuxServer: 10, birdLinux: 10 },
          activeTab: 'cpp'
        };
      } else {
        if (!merged.learningSystem.algoReviewQueue || typeof merged.learningSystem.algoReviewQueue !== 'object') {
          merged.learningSystem.algoReviewQueue = {};
        }
        if (!merged.learningSystem.qaMastery || typeof merged.learningSystem.qaMastery !== 'object') {
          merged.learningSystem.qaMastery = {};
        }
        if (!merged.learningSystem.bookDynamicGoals || typeof merged.learningSystem.bookDynamicGoals !== 'object') {
          merged.learningSystem.bookDynamicGoals = { linuxServer: 10, birdLinux: 10 };
        }
        if (!merged.learningSystem.activeTab) {
          merged.learningSystem.activeTab = 'cpp';
        }
      }

      // P6: 净化与补齐 careerSystem
      if (!merged.careerSystem || typeof merged.careerSystem !== 'object') {
        merged.careerSystem = {
          evidences: typeof DEFAULT_EVIDENCE_CATALOG !== 'undefined' ? [...DEFAULT_EVIDENCE_CATALOG] : [],
          customEvidences: [],
          mockInterviewLogs: [],
          bookmarkedQuestions: [],
          activeCareerTab: 'evidence'
        };
      } else {
        if (!Array.isArray(merged.careerSystem.evidences)) {
          merged.careerSystem.evidences = typeof DEFAULT_EVIDENCE_CATALOG !== 'undefined' ? [...DEFAULT_EVIDENCE_CATALOG] : [];
        }
        if (!Array.isArray(merged.careerSystem.customEvidences)) {
          merged.careerSystem.customEvidences = [];
        }
        if (!Array.isArray(merged.careerSystem.mockInterviewLogs)) {
          merged.careerSystem.mockInterviewLogs = [];
        }
        if (!Array.isArray(merged.careerSystem.bookmarkedQuestions)) {
          merged.careerSystem.bookmarkedQuestions = [];
        }
        if (!merged.careerSystem.activeCareerTab) {
          merged.careerSystem.activeCareerTab = 'evidence';
        }
      }

      // P7: 净化与补齐 schedulerSystem
      if (!merged.schedulerSystem || typeof merged.schedulerSystem !== 'object') {
        merged.schedulerSystem = {
          calendarSource: { type: 'none', fileName: '', lastSyncTime: null, events: [] },
          googleTasks: [],
          dailySchedule: {
            date: getTodayDateStr(),
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
      } else {
        if (!merged.schedulerSystem.calendarSource || typeof merged.schedulerSystem.calendarSource !== 'object') {
          merged.schedulerSystem.calendarSource = { type: 'none', fileName: '', lastSyncTime: null, events: [] };
        }
        if (!Array.isArray(merged.schedulerSystem.calendarSource.events)) {
          merged.schedulerSystem.calendarSource.events = [];
        }
        if (!Array.isArray(merged.schedulerSystem.googleTasks)) {
          merged.schedulerSystem.googleTasks = [];
        }
        if (!merged.schedulerSystem.dailySchedule || typeof merged.schedulerSystem.dailySchedule !== 'object') {
          merged.schedulerSystem.dailySchedule = {
            date: getTodayDateStr(),
            availableMinutes: 840,
            freeSlots: [],
            scheduledBlocks: [],
            deficitMinutes: 0,
            compressionApplied: false,
            compressionLogs: []
          };
        }
        if (!merged.schedulerSystem.incompleteDiagnostics || typeof merged.schedulerSystem.incompleteDiagnostics !== 'object') {
          merged.schedulerSystem.incompleteDiagnostics = {};
        }
        if (!merged.schedulerSystem.dailyReviews || typeof merged.schedulerSystem.dailyReviews !== 'object') {
          merged.schedulerSystem.dailyReviews = {};
        }
        if (!merged.schedulerSystem.activeSchedulerTab) {
          merged.schedulerSystem.activeSchedulerTab = 'planner';
        }
      }

      // V5.1: 净化与补齐 workLogs
      if (!Array.isArray(merged.workLogs)) {
        merged.workLogs = getDefaultWorkLogs();
      }
      // V5.1: 净化与补齐 projectProgress
      if (!merged.projectProgress || typeof merged.projectProgress !== 'object') {
        merged.projectProgress = {
          currentStage: "阶段三：HTTP 协议栈与服务集成",
          activeModule: "HTTP Router",
          completedModules: ["Buffer", "HttpContext", "HttpRequest", "HttpResponse"],
          inProgressModules: ["Router"],
          totalModules: 12
        };
      }
      // V5.1: 净化与补齐 unifiedTasks
      if (!Array.isArray(merged.unifiedTasks) || merged.unifiedTasks.length === 0) {
        merged.unifiedTasks = getDefaultUnifiedTasks();
      }

      if (merged.activeTimer) {
        merged.activeTimer.running = false;
        merged.activeTimer.timerId = null;
      }
      return merged;
    }
  }

  // ==========================================================================
  // StateManager 集中式状态机
  // ==========================================================================
  class StateManagerClass {
    constructor() {
      this._state = createDefaultState();
      this._subscribers = new Set();
      this._saveDebounceTimer = null;
      this._isInitialized = false;
    }

    // 启动与初始化
    init(initialState) {
      if (this._isInitialized) return this._state;

      // 执行无损迁移
      this._state = SchemaMigrationV6.execute(initialState || this._state);

      // 跨自然日自愈与历史归档检测
      this._checkDateRollover();

      this._isInitialized = true;

      // 全局挂载与通知
      if (typeof window !== 'undefined') {
        window.appState = this._state;
      }

      this._notify();
      return this._state;
    }

    // 跨自然日检测与历史归档 (Date Rollover)
    _checkDateRollover() {
      if (!this._state || !this._state.dailyRoutine) return;
      const today = getTodayDateStr();
      const routine = this._state.dailyRoutine;
      if (routine.date && routine.date !== today) {
        const prevDate = routine.date;
        if (!routine.history) routine.history = {};
        
        let progress = { total: 0, activeTotal: 0, completed: 0, rate: 0, completedMinutes: 0 };
        if (typeof TaskDomain !== 'undefined' && typeof TaskDomain.calculateRoutineProgress === 'function') {
          progress = TaskDomain.calculateRoutineProgress(routine.tasks, routine.mode);
        }
        routine.history[prevDate] = {
          total: progress.total,
          activeTotal: progress.activeTotal,
          completed: progress.completed,
          rate: progress.rate,
          completedMinutes: progress.completedMinutes,
          mode: routine.mode
        };

        // 保留未完成的自定义任务
        const uncompletedCustomTasks = (routine.tasks || []).filter(t => t.isCustom && !t.completed);
        
        // 重新生成今日默认任务并拼接未完成自定义任务
        const freshTasks = getDefaultDailyTasks();
        routine.tasks = [...freshTasks, ...uncompletedCustomTasks];
        routine.date = today;
        StateManagerClass._writeDirect(this._state);
      }
    }

    // 获取当前状态只读引用/工作副本
    getState() {
      return this._state;
    }

    // 订阅状态变更
    subscribe(listener) {
      if (typeof listener !== 'function') return () => {};
      this._subscribers.add(listener);
      return () => {
        this._subscribers.delete(listener);
      };
    }

    // 状态更新 (浅层或部分合并)
    update(patch, options = { save: true, immediate: false }) {
      if (!patch || typeof patch !== 'object') return this._state;
      Object.assign(this._state, patch);
      this._state.lastModified = new Date().toISOString();

      if (options.save) {
        this.save(options.immediate || false);
      }
      this._notify();
      return this._state;
    }

    // 防抖存盘机制 (默认 500ms 防抖，支持 immediate = true)
    save(immediate = false) {
      if (immediate) {
        if (this._saveDebounceTimer) {
          clearTimeout(this._saveDebounceTimer);
          this._saveDebounceTimer = null;
        }
        StateManagerClass._writeDirect(this._state);
        return;
      }

      if (this._saveDebounceTimer) {
        clearTimeout(this._saveDebounceTimer);
      }

      this._saveDebounceTimer = setTimeout(() => {
        StateManagerClass._writeDirect(this._state);
        this._saveDebounceTimer = null;
      }, 500);
    }

    // 核心直接写入方法（支持双向镜像兼容）
    static _writeDirect(state) {
      try {
        state.lastModified = new Date().toISOString();
        
        // 1. 写入 V6 主存储
        const v6Payload = JSON.stringify(state);
        safeSetItem(STORAGE_KEYS.V6_DATA, v6Payload);

        // 2. 镜像写入 V5 兼容包 (保证旧标签页、旧代码 100% 兼容)
        const v5Payload = JSON.stringify({
          version: state.version,
          lastModified: state.lastModified,
          completedDays: state.completedDays,
          mastery: state.mastery,
          reviews: state.reviews,
          sourceStatus: state.sourceStatus,
          pitfalls: state.pitfalls,
          studySessions: state.studySessions,
          dayNotes: state.dayNotes,
          experimentNotes: state.experimentNotes,
          globalNotes: state.globalNotes,
          knowledgeMastery: state.knowledgeMastery,
          knowledgeFavorites: state.knowledgeFavorites,
          knowledgeRecent: state.knowledgeRecent,
          dailyRoutine: state.dailyRoutine,
          learningSystem: state.learningSystem,
          careerSystem: state.careerSystem
        });
        safeSetItem(STORAGE_KEYS.V5_DATA, v5Payload);

        // 3. 镜像写入旧版 V4 扁平键
        safeSetItem(STORAGE_KEYS.LEGACY_COMPLETED, JSON.stringify(state.completedDays));
        safeSetItem(STORAGE_KEYS.LEGACY_DAYNOTES, JSON.stringify(state.dayNotes));
        safeSetItem(STORAGE_KEYS.LEGACY_GLOBALNOTES, state.globalNotes || "");

        // 4. 镜像写入 CppAIService 知识库专用键
        safeSetItem(STORAGE_KEYS.CPPAI_MASTERY, JSON.stringify(state.knowledgeMastery || {}));
        safeSetItem(STORAGE_KEYS.CPPAI_FAVS, JSON.stringify(state.knowledgeFavorites || []));
        safeSetItem(STORAGE_KEYS.CPPAI_RECENT, JSON.stringify(state.knowledgeRecent || []));
      } catch (e) {
        console.warn("[StateManager] Write failed:", e);
      }
    }

    // 通知所有订阅者
    _notify() {
      for (const listener of this._subscribers) {
        try {
          listener(this._state);
        } catch (e) {
          console.error("[StateManager] Listener error:", e);
        }
      }
    }

    // ==========================================================================
    // 导出与导入管理
    // ==========================================================================

    // 导出全量 V6 领域数据规范 JSON
    exportJson() {
      const state = this._state;
      return {
        schema: "https://muduo-cppai-console.local/schema/v6.json",
        version: CURRENT_SCHEMA_VERSION,
        exportedAt: new Date().toISOString(),
        metadata: {
          clientName: "CppAIService & muduo Dual-Core Engineering Console",
          completedDaysCount: (state.completedDays || []).length,
          masteredArticlesCount: Object.values(state.knowledgeMastery || {}).filter(lvl => lvl >= 3).length,
          studySessionsCount: (state.studySessions || []).length,
          pitfallsCount: (state.pitfalls || []).length,
          dailyRoutineCompletedCount: (state.dailyRoutine?.tasks || []).filter(t => t.completed).length,
          learningAlgoReviewedCount: Object.values(state.learningSystem?.algoReviewQueue || {}).filter(v => v === 'mastered').length,
          careerEvidenceCount: (state.careerSystem?.evidences || []).length + (state.careerSystem?.customEvidences || []).length,
          mockInterviewCount: (state.careerSystem?.mockInterviewLogs || []).length,
          schedulerEventCount: (state.schedulerSystem?.calendarSource?.events || []).length,
          schedulerDailyReviewCount: Object.keys(state.schedulerSystem?.dailyReviews || {}).length
        },
        payload: {
          completedDays: state.completedDays || [],
          mastery: state.mastery || {},
          reviews: state.reviews || {},
          sourceStatus: state.sourceStatus || {},
          pitfalls: state.pitfalls || [],
          studySessions: state.studySessions || [],
          dayNotes: state.dayNotes || {},
          experimentNotes: state.experimentNotes || {},
          globalNotes: state.globalNotes || "",
          quizRecords: state.quizRecords || [],
          knowledgeMastery: state.knowledgeMastery || {},
          knowledgeFavorites: state.knowledgeFavorites || [],
          knowledgeRecent: state.knowledgeRecent || [],
          projectsProgress: state.projectsProgress || {},
          dailyRoutine: state.dailyRoutine || createDefaultDailyRoutine(),
          learningSystem: state.learningSystem || {
            algoReviewQueue: {},
            qaMastery: {},
            bookDynamicGoals: { linuxServer: 10, birdLinux: 10 },
            activeTab: 'cpp'
          },
          careerSystem: state.careerSystem || {
            evidences: [],
            customEvidences: [],
            mockInterviewLogs: [],
            bookmarkedQuestions: [],
            activeCareerTab: 'evidence'
          },
          schedulerSystem: state.schedulerSystem || {
            calendarSource: { type: 'none', fileName: '', lastSyncTime: null, events: [] },
            googleTasks: [],
            dailySchedule: { date: getTodayDateStr(), availableMinutes: 840, freeSlots: [], scheduledBlocks: [], deficitMinutes: 0, compressionApplied: false, compressionLogs: [] },
            incompleteDiagnostics: {},
            dailyReviews: {},
            activeSchedulerTab: 'planner'
          }
        }
      };
    }

    // 导入 JSON (支持 V4/V5/V6 格式自适应与 合并/覆盖 策略)
    importJson(data, strategy = 'merge') {
      let parsed = data;
      if (typeof data === 'string') {
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          throw new Error("非法数据格式：传入字符串非有效 JSON");
        }
      }

      if (!parsed || typeof parsed !== 'object') {
        throw new Error("非法数据格式：传入数据非有效对象");
      }

      // 提取实际 payload
      const payload = parsed.payload ? parsed.payload : parsed;

      // 严格校验是否有核心字段
      const hasMuduo = Array.isArray(payload.completedDays) || (payload.mastery && typeof payload.mastery === 'object');
      const hasCppai = payload.knowledgeMastery && typeof payload.knowledgeMastery === 'object';
      if (!hasMuduo && !hasCppai) {
        throw new Error("导入失败：未通过 Schema 结构校验，缺少核心学习数据字段");
      }

      if (strategy === 'overwrite') {
        // 完全覆盖策略
        this._state.completedDays = Array.isArray(payload.completedDays) ? [...payload.completedDays] : [];
        this._state.mastery = payload.mastery ? Object.assign({}, payload.mastery) : {};
        this._state.reviews = payload.reviews ? Object.assign({}, payload.reviews) : {};
        this._state.sourceStatus = payload.sourceStatus ? Object.assign({}, payload.sourceStatus) : {};
        this._state.pitfalls = Array.isArray(payload.pitfalls) && payload.pitfalls.length > 0 ? [...payload.pitfalls] : [...getDefaultPitfalls()];
        this._state.studySessions = Array.isArray(payload.studySessions) ? [...payload.studySessions] : [];
        this._state.dayNotes = payload.dayNotes ? Object.assign({}, payload.dayNotes) : {};
        this._state.experimentNotes = payload.experimentNotes ? Object.assign({}, payload.experimentNotes) : {};
        this._state.globalNotes = typeof payload.globalNotes === 'string' ? payload.globalNotes : "";
        this._state.quizRecords = Array.isArray(payload.quizRecords) ? [...payload.quizRecords] : [];
        this._state.knowledgeMastery = payload.knowledgeMastery ? Object.assign({}, payload.knowledgeMastery) : {};
        this._state.knowledgeFavorites = Array.isArray(payload.knowledgeFavorites) ? [...payload.knowledgeFavorites] : [];
        this._state.knowledgeRecent = Array.isArray(payload.knowledgeRecent) ? [...payload.knowledgeRecent] : [];
        if (payload.projectsProgress) {
          this._state.projectsProgress = Object.assign({}, payload.projectsProgress);
        }
        if (payload.dailyRoutine && typeof payload.dailyRoutine === 'object') {
          this._state.dailyRoutine = JSON.parse(JSON.stringify(payload.dailyRoutine));
        } else {
          this._state.dailyRoutine = createDefaultDailyRoutine();
        }
        if (payload.learningSystem && typeof payload.learningSystem === 'object') {
          this._state.learningSystem = JSON.parse(JSON.stringify(payload.learningSystem));
        } else {
          this._state.learningSystem = {
            algoReviewQueue: {},
            qaMastery: {},
            bookDynamicGoals: { linuxServer: 10, birdLinux: 10 },
            activeTab: 'cpp'
          };
        }
        if (payload.careerSystem && typeof payload.careerSystem === 'object') {
          this._state.careerSystem = JSON.parse(JSON.stringify(payload.careerSystem));
        } else {
          this._state.careerSystem = {
            evidences: typeof DEFAULT_EVIDENCE_CATALOG !== 'undefined' ? [...DEFAULT_EVIDENCE_CATALOG] : [],
            customEvidences: [],
            mockInterviewLogs: [],
            bookmarkedQuestions: [],
            activeCareerTab: 'evidence'
          };
        }
        if (payload.schedulerSystem && typeof payload.schedulerSystem === 'object') {
          this._state.schedulerSystem = JSON.parse(JSON.stringify(payload.schedulerSystem));
        } else {
          this._state.schedulerSystem = {
            calendarSource: { type: 'none', fileName: '', lastSyncTime: null, events: [] },
            googleTasks: [],
            dailySchedule: { date: getTodayDateStr(), availableMinutes: 840, freeSlots: [], scheduledBlocks: [], deficitMinutes: 0, compressionApplied: false, compressionLogs: [] },
            incompleteDiagnostics: {},
            dailyReviews: {},
            activeSchedulerTab: 'planner'
          };
        }
      } else {
        // 合并策略 (merge)
        // 1. 合并 completedDays
        if (Array.isArray(payload.completedDays)) {
          this._state.completedDays = [...new Set([...this._state.completedDays, ...payload.completedDays])];
        }

        // 2. 合并 mastery (取较高掌握度)
        if (payload.mastery && typeof payload.mastery === 'object') {
          Object.keys(payload.mastery).forEach(k => {
            const currentLevel = this._state.mastery[k]?.level || 0;
            const newLevel = payload.mastery[k]?.level || 0;
            if (newLevel >= currentLevel) {
              this._state.mastery[k] = payload.mastery[k];
            }
          });
        }

        // 3. 合并 reviews
        if (payload.reviews && typeof payload.reviews === 'object') {
          Object.assign(this._state.reviews, payload.reviews);
        }

        // 4. 合并源码状态
        if (payload.sourceStatus && typeof payload.sourceStatus === 'object') {
          Object.assign(this._state.sourceStatus, payload.sourceStatus);
        }

        // 5. 合并手记
        if (payload.dayNotes && typeof payload.dayNotes === 'object') {
          Object.assign(this._state.dayNotes, payload.dayNotes);
        }
        if (payload.experimentNotes && typeof payload.experimentNotes === 'object') {
          Object.assign(this._state.experimentNotes, payload.experimentNotes);
        }
        if (payload.globalNotes && !this._state.globalNotes) {
          this._state.globalNotes = payload.globalNotes;
        }

        // 6. 合并踩坑记录
        if (Array.isArray(payload.pitfalls)) {
          const existIds = new Set(this._state.pitfalls.map(p => p.id));
          payload.pitfalls.forEach(p => {
            if (!existIds.has(p.id)) {
              this._state.pitfalls.push(p);
            }
          });
        }

        // 7. 合并学习会话记录
        if (Array.isArray(payload.studySessions)) {
          const existSessIds = new Set(this._state.studySessions.map(s => s.id));
          payload.studySessions.forEach(s => {
            if (!existSessIds.has(s.id)) {
              this._state.studySessions.push(s);
            }
          });
        }

        // 8. 合并 CppAIService 专栏知识掌握度
        if (payload.knowledgeMastery && typeof payload.knowledgeMastery === 'object') {
          Object.keys(payload.knowledgeMastery).forEach(k => {
            const currentLvl = this._state.knowledgeMastery[k] || 0;
            const newLvl = payload.knowledgeMastery[k] || 0;
            if (newLvl >= currentLvl) {
              this._state.knowledgeMastery[k] = newLvl;
            }
          });
        }

        // 9. 合并收藏与最近浏览
        if (Array.isArray(payload.knowledgeFavorites)) {
          this._state.knowledgeFavorites = [...new Set([...this._state.knowledgeFavorites, ...payload.knowledgeFavorites])];
        }
        if (Array.isArray(payload.knowledgeRecent)) {
          this._state.knowledgeRecent = [...new Set([...this._state.knowledgeRecent, ...payload.knowledgeRecent])].slice(0, 10);
        }

        // 10. 合并拓展进度
        if (payload.projectsProgress && typeof payload.projectsProgress === 'object') {
          this._state.projectsProgress = Object.assign(this._state.projectsProgress || {}, payload.projectsProgress);
        }

        // 11. 合并 Phase 4 日常任务调度数据 (dailyRoutine)
        if (payload.dailyRoutine && typeof payload.dailyRoutine === 'object') {
          if (!this._state.dailyRoutine) {
            this._state.dailyRoutine = createDefaultDailyRoutine();
          }
          const curRoutine = this._state.dailyRoutine;
          const incRoutine = payload.dailyRoutine;

          // 合并历史流水
          if (incRoutine.history && typeof incRoutine.history === 'object') {
            curRoutine.history = Object.assign(curRoutine.history || {}, incRoutine.history);
          }

          // 合并记录 records
          if (incRoutine.records && typeof incRoutine.records === 'object') {
            if (!curRoutine.records) curRoutine.records = {};
            // 合并算法题目记录
            if (Array.isArray(incRoutine.records.algorithm)) {
              if (!Array.isArray(curRoutine.records.algorithm)) curRoutine.records.algorithm = [];
              const existAlgoIds = new Set(curRoutine.records.algorithm.map(a => a.id));
              incRoutine.records.algorithm.forEach(a => {
                if (!existAlgoIds.has(a.id)) curRoutine.records.algorithm.push(a);
              });
            }
            // 合并书目进度 (取较大当前页码)
            if (incRoutine.records.books && typeof incRoutine.records.books === 'object') {
              if (!curRoutine.records.books) curRoutine.records.books = {};
              Object.keys(incRoutine.records.books).forEach(bKey => {
                const curBook = curRoutine.records.books[bKey] || { currentPage: 0 };
                const incBook = incRoutine.records.books[bKey] || { currentPage: 0 };
                if ((incBook.currentPage || 0) >= (curBook.currentPage || 0)) {
                  curRoutine.records.books[bKey] = Object.assign({}, curBook, incBook);
                }
              });
            }
            // 合并求职随笔
            if (incRoutine.records.careerNotes && !curRoutine.records.careerNotes) {
              curRoutine.records.careerNotes = incRoutine.records.careerNotes;
            }
          }

          // 同日任务合并已完成标记与自定义任务
          if (incRoutine.date === curRoutine.date && Array.isArray(incRoutine.tasks)) {
            const incCompletedIds = new Set(incRoutine.tasks.filter(t => t.completed).map(t => t.id));
            (curRoutine.tasks || []).forEach(t => {
              if (incCompletedIds.has(t.id)) {
                t.completed = true;
                if (!t.completedAt) t.completedAt = new Date().toISOString();
              }
            });
            // 补充自定义任务
            const curTaskIds = new Set((curRoutine.tasks || []).map(t => t.id));
            incRoutine.tasks.filter(t => t.isCustom).forEach(ct => {
              if (!curTaskIds.has(ct.id)) {
                curRoutine.tasks.push(ct);
              }
            });
          }
        }

        // 12. 合并 Phase 5 统一学习系统数据 (learningSystem)
        if (payload.learningSystem && typeof payload.learningSystem === 'object') {
          if (!this._state.learningSystem) {
            this._state.learningSystem = {
              algoReviewQueue: {},
              qaMastery: {},
              bookDynamicGoals: { linuxServer: 10, birdLinux: 10 },
              activeTab: 'cpp'
            };
          }
          const curLS = this._state.learningSystem;
          const incLS = payload.learningSystem;
          if (incLS.algoReviewQueue && typeof incLS.algoReviewQueue === 'object') {
            curLS.algoReviewQueue = Object.assign(curLS.algoReviewQueue || {}, incLS.algoReviewQueue);
          }
          if (incLS.qaMastery && typeof incLS.qaMastery === 'object') {
            curLS.qaMastery = Object.assign(curLS.qaMastery || {}, incLS.qaMastery);
          }
          if (incLS.bookDynamicGoals && typeof incLS.bookDynamicGoals === 'object') {
            curLS.bookDynamicGoals = Object.assign(curLS.bookDynamicGoals || {}, incLS.bookDynamicGoals);
          }
        }

        // 13. 合并 Phase 6 求职能力与工程凭证系统 (careerSystem)
        if (payload.careerSystem && typeof payload.careerSystem === 'object') {
          if (!this._state.careerSystem) {
            this._state.careerSystem = {
              evidences: typeof DEFAULT_EVIDENCE_CATALOG !== 'undefined' ? [...DEFAULT_EVIDENCE_CATALOG] : [],
              customEvidences: [],
              mockInterviewLogs: [],
              bookmarkedQuestions: [],
              activeCareerTab: 'evidence'
            };
          }
          const curCS = this._state.careerSystem;
          const incCS = payload.careerSystem;
          // 合并自定义凭证 (不重复)
          if (Array.isArray(incCS.customEvidences)) {
            const existingIds = new Set((curCS.customEvidences || []).map(e => e.id));
            incCS.customEvidences.forEach(ev => {
              if (!existingIds.has(ev.id)) {
                curCS.customEvidences.push(ev);
              }
            });
          }
          // 合并模拟面试记录
          if (Array.isArray(incCS.mockInterviewLogs)) {
            const existingLogIds = new Set((curCS.mockInterviewLogs || []).map(l => l.id));
            incCS.mockInterviewLogs.forEach(log => {
              if (!existingLogIds.has(log.id)) {
                curCS.mockInterviewLogs.push(log);
              }
            });
          }
          // 合并书签
          if (Array.isArray(incCS.bookmarkedQuestions)) {
            curCS.bookmarkedQuestions = [...new Set([...(curCS.bookmarkedQuestions || []), ...incCS.bookmarkedQuestions])];
          }
        }

        // 14. 合并 Phase 7 智能任务调度与日历同步系统 (schedulerSystem)
        if (payload.schedulerSystem && typeof payload.schedulerSystem === 'object') {
          if (!this._state.schedulerSystem) {
            this._state.schedulerSystem = {
              calendarSource: { type: 'none', fileName: '', lastSyncTime: null, events: [] },
              googleTasks: [],
              dailySchedule: { date: getTodayDateStr(), availableMinutes: 840, freeSlots: [], scheduledBlocks: [], deficitMinutes: 0, compressionApplied: false, compressionLogs: [] },
              incompleteDiagnostics: {},
              dailyReviews: {},
              activeSchedulerTab: 'planner'
            };
          }
          const curSS = this._state.schedulerSystem;
          const incSS = payload.schedulerSystem;
          if (incSS.calendarSource && Array.isArray(incSS.calendarSource.events)) {
            const existingEvtIds = new Set((curSS.calendarSource.events || []).map(e => e.id));
            incSS.calendarSource.events.forEach(evt => {
              if (!existingEvtIds.has(evt.id)) (curSS.calendarSource.events = curSS.calendarSource.events || []).push(evt);
            });
            curSS.calendarSource.type = incSS.calendarSource.type || curSS.calendarSource.type;
            curSS.calendarSource.fileName = incSS.calendarSource.fileName || curSS.calendarSource.fileName;
            curSS.calendarSource.lastSyncTime = incSS.calendarSource.lastSyncTime || curSS.calendarSource.lastSyncTime;
          }
          if (Array.isArray(incSS.googleTasks)) {
            const existingTaskIds = new Set((curSS.googleTasks || []).map(t => t.id));
            incSS.googleTasks.forEach(gt => {
              if (!existingTaskIds.has(gt.id)) (curSS.googleTasks = curSS.googleTasks || []).push(gt);
            });
          }
          if (incSS.incompleteDiagnostics && typeof incSS.incompleteDiagnostics === 'object') {
            curSS.incompleteDiagnostics = Object.assign(curSS.incompleteDiagnostics || {}, incSS.incompleteDiagnostics);
          }
          if (incSS.dailyReviews && typeof incSS.dailyReviews === 'object') {
            curSS.dailyReviews = Object.assign(curSS.dailyReviews || {}, incSS.dailyReviews);
          }
        }
      }

      this.save(true);
      this._notify();
      return this._state;
    }

    // Phase 5 学习系统专用操作助手
    setLearningTab(tabKey) {
      if (!this._state.learningSystem) {
        this._state.learningSystem = {
          algoReviewQueue: {},
          qaMastery: {},
          bookDynamicGoals: { linuxServer: 10, birdLinux: 10 },
          activeTab: 'cpp'
        };
      }
      this._state.learningSystem.activeTab = tabKey;
      this.save();
      this._notify();
    }

    toggleAlgoReview(problemNum) {
      if (!this._state.learningSystem) {
        this._state.learningSystem = {
          algoReviewQueue: {},
          qaMastery: {},
          bookDynamicGoals: { linuxServer: 10, birdLinux: 10 },
          activeTab: 'algo'
        };
      }
      if (!this._state.learningSystem.algoReviewQueue) {
        this._state.learningSystem.algoReviewQueue = {};
      }
      const q = this._state.learningSystem.algoReviewQueue;
      const current = q[problemNum] || 'due';
      q[problemNum] = current === 'mastered' ? 'due' : 'mastered';
      this.save(true);
      this._notify();
      return q[problemNum];
    }

    adjustBookDailyGoal(bookKey, delta) {
      if (!this._state.learningSystem) {
        this._state.learningSystem = {
          algoReviewQueue: {},
          qaMastery: {},
          bookDynamicGoals: { linuxServer: 10, birdLinux: 10 },
          activeTab: 'books'
        };
      }
      if (!this._state.learningSystem.bookDynamicGoals) {
        this._state.learningSystem.bookDynamicGoals = { linuxServer: 10, birdLinux: 10 };
      }
      const goals = this._state.learningSystem.bookDynamicGoals;
      const cur = goals[bookKey] || 10;
      const next = Math.max(5, Math.min(30, cur + delta));
      goals[bookKey] = next;
      this.save(true);
      this._notify();
      return next;
    }

    toggleQAMastery(qaId) {
      if (!this._state.learningSystem) {
        this._state.learningSystem = {
          algoReviewQueue: {},
          qaMastery: {},
          bookDynamicGoals: { linuxServer: 10, birdLinux: 10 },
          activeTab: 'qa'
        };
      }
      if (!this._state.learningSystem.qaMastery) {
        this._state.learningSystem.qaMastery = {};
      }
      const m = this._state.learningSystem.qaMastery;
      m[qaId] = !m[qaId];
      this.save(true);
      this._notify();
      return m[qaId];
    }

    // Phase 6 求职能力与工程凭证系统专用操作助手
    _ensureCareerSystem() {
      if (!this._state.careerSystem || typeof this._state.careerSystem !== 'object') {
        this._state.careerSystem = {
          evidences: typeof DEFAULT_EVIDENCE_CATALOG !== 'undefined' ? [...DEFAULT_EVIDENCE_CATALOG] : [],
          customEvidences: [],
          mockInterviewLogs: [],
          bookmarkedQuestions: [],
          activeCareerTab: 'evidence'
        };
      }
      return this._state.careerSystem;
    }

    setCareerTab(tabKey) {
      const cs = this._ensureCareerSystem();
      cs.activeCareerTab = tabKey;
      this.save();
      this._notify();
    }

    addCustomEvidence(evidence) {
      const cs = this._ensureCareerSystem();
      if (!Array.isArray(cs.customEvidences)) cs.customEvidences = [];
      evidence.id = 'custom_ev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      evidence.createdAt = new Date().toISOString();
      cs.customEvidences.push(evidence);
      this.save(true);
      this._notify();
      return evidence;
    }

    deleteCustomEvidence(evidenceId) {
      const cs = this._ensureCareerSystem();
      if (!Array.isArray(cs.customEvidences)) return;
      cs.customEvidences = cs.customEvidences.filter(e => e.id !== evidenceId);
      this.save(true);
      this._notify();
    }

    addMockInterviewLog(log) {
      const cs = this._ensureCareerSystem();
      if (!Array.isArray(cs.mockInterviewLogs)) cs.mockInterviewLogs = [];
      log.id = 'mock_' + Date.now();
      log.timestamp = new Date().toISOString();
      cs.mockInterviewLogs.push(log);
      this.save(true);
      this._notify();
      return log;
    }

    toggleBookmarkQuestion(questionId) {
      const cs = this._ensureCareerSystem();
      if (!Array.isArray(cs.bookmarkedQuestions)) cs.bookmarkedQuestions = [];
      const idx = cs.bookmarkedQuestions.indexOf(questionId);
      if (idx >= 0) {
        cs.bookmarkedQuestions.splice(idx, 1);
      } else {
        cs.bookmarkedQuestions.push(questionId);
      }
      this.save(true);
      this._notify();
      return cs.bookmarkedQuestions.includes(questionId);
    }

    // Phase 7 智能任务调度与日历系统专用操作助手
    _ensureSchedulerSystem() {
      if (!this._state.schedulerSystem || typeof this._state.schedulerSystem !== 'object') {
        this._state.schedulerSystem = {
          calendarSource: { type: 'none', fileName: '', lastSyncTime: null, events: [] },
          googleTasks: [],
          dailySchedule: {
            date: getTodayDateStr(),
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
      return this._state.schedulerSystem;
    }

    setSchedulerTab(tabKey) {
      const ss = this._ensureSchedulerSystem();
      ss.activeSchedulerTab = tabKey;
      this.save();
      this._notify();
    }

    importCalendarSource(params) {
      const ss = this._ensureSchedulerSystem();
      const p = params || {};
      ss.calendarSource.type = p.type || 'ics';
      ss.calendarSource.fileName = p.fileName || 'calendar.ics';
      ss.calendarSource.lastSyncTime = new Date().toISOString();
      if (Array.isArray(p.events)) {
        ss.calendarSource.events = p.events;
      }
      if (Array.isArray(p.googleTasks)) {
        ss.googleTasks = p.googleTasks;
      }
      this.save(true);
      this._notify();
      return ss.calendarSource;
    }

    updateDailySchedule(scheduleData) {
      const ss = this._ensureSchedulerSystem();
      ss.dailySchedule = Object.assign(ss.dailySchedule || {}, scheduleData);
      this.save(true);
      this._notify();
      return ss.dailySchedule;
    }

    recordTaskDiagnostic(taskId, diagnosticData) {
      const ss = this._ensureSchedulerSystem();
      if (!ss.incompleteDiagnostics) ss.incompleteDiagnostics = {};
      ss.incompleteDiagnostics[taskId] = diagnosticData;
      this.save(true);
      this._notify();
      return diagnosticData;
    }

    saveDailyReviewRecord(dateStr, reviewRecord) {
      const ss = this._ensureSchedulerSystem();
      if (!ss.dailyReviews) ss.dailyReviews = {};
      ss.dailyReviews[dateStr] = reviewRecord;
      this.save(true);
      this._notify();
      return reviewRecord;
    }

    // ==========================================
    // V5.1 工程工作日志与项目模块操作助手
    // ==========================================
    getWorkLogs() {
      if (!Array.isArray(this._state.workLogs)) {
        this._state.workLogs = getDefaultWorkLogs();
      }
      return this._state.workLogs;
    }

    addWorkLog(logData) {
      if (!Array.isArray(this._state.workLogs)) this._state.workLogs = [];
      const log = Object.assign({
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        date: getTodayDateStr(),
        project: 'CppAIService',
        module: 'Core',
        logType: 'code_feature',
        what: '',
        problem: '无',
        solution: '无',
        learned: '',
        next: '',
        relatedFiles: [],
        interviewPoint: '',
        createdAt: Date.now()
      }, logData);
      this._state.workLogs.unshift(log);
      this.save(true);
      this._notify();
      return log;
    }

    deleteWorkLog(logId) {
      if (!Array.isArray(this._state.workLogs)) return;
      this._state.workLogs = this._state.workLogs.filter(l => l.id !== logId);
      this.save(true);
      this._notify();
    }

    getProjectProgress() {
      return this._state.projectProgress || {
        currentStage: "阶段三：HTTP 协议栈与服务集成",
        activeModule: "HTTP Router",
        completedModules: ["Buffer", "HttpContext", "HttpRequest", "HttpResponse"],
        inProgressModules: ["Router"],
        totalModules: 12
      };
    }

    updateProjectProgress(patch) {
      this._state.projectProgress = Object.assign(this.getProjectProgress(), patch);
      this.save(true);
      this._notify();
      return this._state.projectProgress;
    }

    getUnifiedTasks() {
      if (!Array.isArray(this._state.unifiedTasks) || this._state.unifiedTasks.length === 0) {
        this._state.unifiedTasks = getDefaultUnifiedTasks();
      }
      return this._state.unifiedTasks;
    }

    toggleUnifiedTask(taskId, reflectionData) {
      const tasks = this.getUnifiedTasks();
      const task = tasks.find(t => t.id === taskId);
      if (!task) return null;
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      if (reflectionData && typeof reflectionData === 'object') {
        task.reflection = reflectionData;
      }
      this.save(true);
      this._notify();
      return task;
    }

    addUnifiedTask(taskData) {
      const tasks = this.getUnifiedTasks();
      const newTask = Object.assign({
        id: 'task_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        title: '新任务',
        priority: 'A',
        category: 'project',
        estimatedMinutes: 60,
        completed: false,
        completedAt: null,
        reflection: null,
        source: 'user_manual',
        date: getTodayDateStr()
      }, taskData);
      tasks.push(newTask);
      this.save(true);
      this._notify();
      return newTask;
    }

    // 重置系统纯净状态 (保留备份)
    resetToDefault() {
      // 预先备份当前数据
      SchemaMigrationV6._createColdBackup();
      this._state = createDefaultState();
      this.save(true);
      this._notify();
      return this._state;
    }

    // 恢复冷备份 (遇险保底救援通道)
    restoreColdBackup() {
      const backupRaw = safeGetItem(STORAGE_KEYS.V6_COLD_BACKUP);
      if (!backupRaw) throw new Error("未找到冷备份数据");
      const backup = JSON.parse(backupRaw);
      if (backup && backup.data) {
        if (backup.data.v5Data) safeSetItem(STORAGE_KEYS.V5_DATA, backup.data.v5Data);
        if (backup.data.legacyCompleted) safeSetItem(STORAGE_KEYS.LEGACY_COMPLETED, backup.data.legacyCompleted);
        if (backup.data.legacyDayNotes) safeSetItem(STORAGE_KEYS.LEGACY_DAYNOTES, backup.data.legacyDayNotes);
        if (backup.data.legacyGlobalNotes) safeSetItem(STORAGE_KEYS.LEGACY_GLOBALNOTES, backup.data.legacyGlobalNotes);
        if (backup.data.cppaiMastery) safeSetItem(STORAGE_KEYS.CPPAI_MASTERY, backup.data.cppaiMastery);
        if (backup.data.cppaiFavs) safeSetItem(STORAGE_KEYS.CPPAI_FAVS, backup.data.cppaiFavs);
        if (backup.data.cppaiRecent) safeSetItem(STORAGE_KEYS.CPPAI_RECENT, backup.data.cppaiRecent);
      }
      safeRemoveItem(STORAGE_KEYS.V6_DATA);
      this._isInitialized = false;
      return this.init();
    }
  }

  // 实例化单例
  const StateManager = new StateManagerClass();

  // 挂载到浏览器 window 与 globalThis
  if (typeof window !== 'undefined') {
    window.STORAGE_KEYS = STORAGE_KEYS;
    window.CURRENT_SCHEMA_VERSION = CURRENT_SCHEMA_VERSION;
    window.StateManager = StateManager;
    window.stateManager = StateManager;
    window.StateManagerClass = StateManagerClass;
    window.SchemaMigrationV6 = SchemaMigrationV6;
  }

  if (typeof globalThis !== 'undefined') {
    globalThis.STORAGE_KEYS = STORAGE_KEYS;
    globalThis.CURRENT_SCHEMA_VERSION = CURRENT_SCHEMA_VERSION;
    globalThis.StateManager = StateManager;
    globalThis.stateManager = StateManager;
    globalThis.StateManagerClass = StateManagerClass;
    globalThis.SchemaMigrationV6 = SchemaMigrationV6;
  }

  // 挂载到 Node.js 模块导出
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      STORAGE_KEYS,
      CURRENT_SCHEMA_VERSION,
      StateManager,
      stateManager: StateManager,
      StateManagerClass,
      SchemaMigrationV6
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);

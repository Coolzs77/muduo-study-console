// ==========================================================================
// CppAIService & muduo Dual-Core Engineering OS
// 统一任务调度数据集与领域定义 (dataset-tasks.js)
// 职责：定义 S/A/B/C 任务优先级、分类枚举、默认日程模板与辅助函数
// ==========================================================================

(function(global) {
  'use strict';

  // 优先级等级定义
  const TASK_PRIORITIES = {
    S: {
      level: 'S',
      name: 'S 级·核心攻坚',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      tagClass: 'text-rose-700',
      description: '核心主线，必须优先完成',
      defaultMinutes: 180,
      weight: 4
    },
    A: {
      level: 'A',
      name: 'A 级·主干底座',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      tagClass: 'text-amber-800',
      description: '算法与基础理论支撑',
      defaultMinutes: 90,
      weight: 3
    },
    B: {
      level: 'B',
      name: 'B 级·知识巩固',
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
      tagClass: 'text-sky-700',
      description: '考点自测与八股梳理',
      defaultMinutes: 30,
      weight: 2
    },
    C: {
      level: 'C',
      name: 'C 级·通识拓展',
      badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
      tagClass: 'text-stone-600',
      description: '思维阅读与就业行情',
      defaultMinutes: 30,
      weight: 1
    }
  };

  // 任务分类枚举
  const TASK_CATEGORIES = {
    project: { id: 'project', name: '项目攻坚', icon: 'fa-microchip', color: 'amber' },
    algorithm: { id: 'algorithm', name: '手撕算法', icon: 'fa-laptop-code', color: 'indigo' },
    book: { id: 'book', name: '专业书目', icon: 'fa-book', color: 'sky' },
    quiz: { id: 'quiz', name: '考点自测', icon: 'fa-clipboard-question', color: 'purple' },
    reading: { id: 'reading', name: '通识阅读', icon: 'fa-glasses', color: 'teal' },
    career: { id: 'career', name: '求职行情', icon: 'fa-briefcase', color: 'stone' }
  };

  // 默认日常任务模板 (对齐用户 Google Tasks 真实日程)
  const DEFAULT_ROUTINE_TEMPLATE = [
    {
      id: 'task_s_project',
      priority: 'S',
      category: 'project',
      title: 'CppAIService 模块攻坚与源码研读',
      subtitle: '每日 3.0h · 推进 Reactor 网络与服务平台模块',
      estimatedMinutes: 180,
      recurring: true,
      actionType: 'project',
      description: '研读并实现 CppAIService 与 muduo 核心组件，深入 HTTP 解析、路由、MCP 协议或异步处理逻辑。',
      targetLink: 'view-knowledge'
    },
    {
      id: 'task_a_algo',
      priority: 'A',
      category: 'algorithm',
      title: 'C++ 手撕算法每日 3 题',
      subtitle: '每日 1.5h · 高频经典题与时空复杂度分析',
      estimatedMinutes: 90,
      recurring: true,
      actionType: 'algorithm',
      description: '手撕数组、双指针、滑动窗口、树与动态规划等高频题，记录推导过程与时空复杂度。',
      targetLink: 'algo-modal'
    },
    {
      id: 'task_a_linux_book',
      priority: 'A',
      category: 'book',
      title: '《Linux多线程服务端编程》研读 10 页',
      subtitle: '每日 0.5h · 学习网络编程与并发控制',
      estimatedMinutes: 30,
      recurring: true,
      actionType: 'book',
      bookKey: 'linuxServer',
      bookName: 'Linux多线程服务端编程',
      dailyPages: 10,
      description: '精读陈硕著经典，理解多线程安全生命周期管理、互斥锁戒律与应用层 Buffer 设计。',
      targetLink: 'books-modal'
    },
    {
      id: 'task_a_bird_linux',
      priority: 'A',
      category: 'book',
      title: '《鸟哥的Linux私房菜》研读 10 页 (从 bash 开始)',
      subtitle: '每日 0.5h · 掌握系统管理与命令行环境',
      estimatedMinutes: 30,
      recurring: true,
      actionType: 'book',
      bookKey: 'birdLinux',
      bookName: '鸟哥的Linux私房菜',
      dailyPages: 10,
      description: '从 bash 环境出发，掌握环境变量、重定向、管道与系统管理脚本编写。',
      targetLink: 'books-modal'
    },
    {
      id: 'task_b_quiz',
      priority: 'B',
      category: 'quiz',
      title: 'C++ / muduo / AI 考点自测与八股梳理',
      subtitle: '每日 0.5h · 巩固底层概念与自测判分',
      estimatedMinutes: 30,
      recurring: true,
      actionType: 'quiz',
      description: '复习现代 C++ 规范、epoll 多路复用、智能指针与多线程网络考点，完成配套自测题。',
      targetLink: 'view-quiz'
    },
    {
      id: 'task_c_reading',
      priority: 'C',
      category: 'reading',
      title: '通识阅读三部曲 (各 10 页)',
      subtitle: '每日 0.5h · 《非暴力沟通》+《金融学》+《图解博弈论》',
      estimatedMinutes: 30,
      recurring: true,
      actionType: 'reading',
      books: ['nonviolentComm', 'financeZero', 'gameTheory'],
      description: '阅读《非暴力沟通》、《从零开始学习金融学》、《图解博弈论》，拓宽思维模型与认知边界。',
      targetLink: 'books-modal'
    },
    {
      id: 'task_c_career',
      priority: 'C',
      category: 'career',
      title: '牛客网就业与行业信息调研',
      subtitle: '每日 0.5h · 跟踪招聘信息与岗位要求',
      estimatedMinutes: 30,
      recurring: true,
      actionType: 'career',
      description: '调研技术求职动态、企业招聘要求、技术栈偏好与面试面经，整理个人求职信息库。',
      targetLink: 'career-modal'
    }
  ];

  // 辅助函数：为指定日期生成初始任务列表
  function createFreshDailyTasks() {
    return DEFAULT_ROUTINE_TEMPLATE.map(tpl => ({
      id: tpl.id,
      priority: tpl.priority,
      category: tpl.category,
      title: tpl.title,
      subtitle: tpl.subtitle,
      estimatedMinutes: tpl.estimatedMinutes,
      recurring: tpl.recurring,
      actionType: tpl.actionType,
      bookKey: tpl.bookKey || null,
      bookName: tpl.bookName || null,
      dailyPages: tpl.dailyPages || null,
      description: tpl.description,
      targetLink: tpl.targetLink || null,
      completed: false,
      completedAt: null,
      isCustom: false
    }));
  }

  // 辅助函数：根据模式（normal / compact）过滤任务
  // compact 模式下，仅保留 S 级和 A 级任务，B 和 C 级标记为 suspended（免除）
  function filterTasksByMode(tasks, mode = 'normal') {
    if (!Array.isArray(tasks)) return [];
    if (mode === 'compact') {
      return tasks.map(t => {
        if (t.priority === 'B' || t.priority === 'C') {
          return Object.assign({}, t, { isSuspended: true });
        }
        return Object.assign({}, t, { isSuspended: false });
      });
    }
    return tasks.map(t => Object.assign({}, t, { isSuspended: false }));
  }

  // 辅助函数：计算日程进度与统计指标
  function calculateRoutineProgress(tasks, mode = 'normal') {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return {
        total: 0,
        activeTotal: 0,
        completed: 0,
        rate: 0,
        totalMinutes: 0,
        activeMinutes: 0,
        completedMinutes: 0,
        remainingMinutes: 0,
        byPriority: { S: { total: 0, completed: 0, active: 0 }, A: { total: 0, completed: 0, active: 0 }, B: { total: 0, completed: 0, active: 0 }, C: { total: 0, completed: 0, active: 0 } }
      };
    }

    const processed = filterTasksByMode(tasks, mode);
    let total = processed.length;
    let activeTotal = 0;
    let completed = 0;
    let totalMinutes = 0;
    let activeMinutes = 0;
    let completedMinutes = 0;

    const byPriority = {
      S: { total: 0, completed: 0, active: 0 },
      A: { total: 0, completed: 0, active: 0 },
      B: { total: 0, completed: 0, active: 0 },
      C: { total: 0, completed: 0, active: 0 }
    };

    processed.forEach(t => {
      const p = t.priority || 'C';
      if (!byPriority[p]) byPriority[p] = { total: 0, completed: 0, active: 0 };
      byPriority[p].total++;
      totalMinutes += (t.estimatedMinutes || 0);

      if (!t.isSuspended) {
        activeTotal++;
        activeMinutes += (t.estimatedMinutes || 0);
        byPriority[p].active++;
        if (t.completed) {
          completed++;
          completedMinutes += (t.estimatedMinutes || 0);
          byPriority[p].completed++;
        }
      }
    });

    const rate = activeTotal > 0 ? Math.round((completed / activeTotal) * 100) : 0;
    const remainingMinutes = Math.max(0, activeMinutes - completedMinutes);

    return {
      total,
      activeTotal,
      completed,
      rate,
      totalMinutes,
      activeMinutes,
      completedMinutes,
      remainingMinutes,
      byPriority
    };
  }

  // 导出命名空间
  const TaskDomain = {
    TASK_PRIORITIES,
    TASK_CATEGORIES,
    DEFAULT_ROUTINE_TEMPLATE,
    createFreshDailyTasks,
    filterTasksByMode,
    calculateRoutineProgress
  };

  if (typeof window !== 'undefined') {
    window.TASK_PRIORITIES = TASK_PRIORITIES;
    window.TASK_CATEGORIES = TASK_CATEGORIES;
    window.DEFAULT_ROUTINE_TEMPLATE = DEFAULT_ROUTINE_TEMPLATE;
    window.TaskDomain = TaskDomain;
  }

  if (typeof globalThis !== 'undefined') {
    globalThis.TASK_PRIORITIES = TASK_PRIORITIES;
    globalThis.TASK_CATEGORIES = TASK_CATEGORIES;
    globalThis.DEFAULT_ROUTINE_TEMPLATE = DEFAULT_ROUTINE_TEMPLATE;
    globalThis.TaskDomain = TaskDomain;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskDomain;
  }
})(typeof window !== 'undefined' ? window : globalThis);

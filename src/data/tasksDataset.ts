import { DailyTask } from "../types/index";

export const DEFAULT_ROUTINE_TASKS: DailyTask[] = [
  {
    id: "task_algo",
    title: "算法",
    category: "算法",
    estimatedMinutes: 60,
    priority: "S",
    completed: false,
    focusPoint: "Hot 100 / 代码随想录盲打手写，15 分钟无思路查卡，手写 AC",
    linkTab: "algo"
  },
  {
    id: "task_project",
    title: "项目",
    category: "项目",
    estimatedMinutes: 90,
    priority: "S",
    completed: false,
    focusPoint: "完成 CppAIService 核心模块开发与真实压测",
    linkTab: "reader"
  },
  {
    id: "task_agent",
    title: "Agent",
    category: "AI",
    estimatedMinutes: 30,
    priority: "A",
    completed: false,
    focusPoint: "阅读 MCP 规范与两段式 Tool Call 架构落地",
    linkTab: "reader"
  },
  {
    id: "task_interview",
    title: "牛客",
    category: "求职",
    estimatedMinutes: 45,
    priority: "A",
    completed: false,
    focusPoint: "刷最新大厂 C++ 真实面经与 TCP/Linux 底层八股"
  }
];

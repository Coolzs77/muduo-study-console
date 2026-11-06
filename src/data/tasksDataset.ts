import { DailyTask } from "../types/index";

export const DEFAULT_ROUTINE_TASKS: DailyTask[] = [
  {
    id: "task_algo",
    title: "算法练习",
    category: "算法",
    estimatedMinutes: 60,
    priority: "S",
    completed: false,
    focusPoint: "LeetCode Hot 100 / 代码随想录手写练习，15 分钟无思路查卡，手写 AC",
    linkTab: "algo"
  },
  {
    id: "task_ai_inference",
    title: "AI 推理服务架构",
    category: "项目",
    estimatedMinutes: 90,
    priority: "S",
    completed: false,
    focusPoint: "ONNX Runtime / TensorRT C++ 运行时封装、模型加载与输入张量自适应",
    linkTab: "practice"
  },
  {
    id: "task_dynamic_batching",
    title: "动态批处理引擎",
    category: "架构",
    estimatedMinutes: 60,
    priority: "S",
    completed: false,
    focusPoint: "Dynamic Batching 请求队列设计、超时调度机制与并发请求张量聚合",
    linkTab: "practice"
  },
  {
    id: "task_stream_eval",
    title: "流式输出与并发评测",
    category: "网络",
    estimatedMinutes: 45,
    priority: "A",
    completed: false,
    focusPoint: "SSE 长连接实时分块 Token 推送、首字延迟 (TTFT) 优化与并发压测",
    linkTab: "practice"
  }
];

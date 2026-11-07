import React, { useState } from 'react';
import {
  Server,
  X,
  Lightbulb,
  ListOrdered,
  Table,
  Bug,
  FolderTree,
  Terminal,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { showToast } from './Toast';

interface EnvGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideTab = 'concept' | 'steps' | 'matrix' | 'debug' | 'cmake';

export const EnvGuideModal: React.FC<EnvGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<GuideTab>('concept');

  if (!isOpen) return null;

  const handleCopyCmd = (cmd: string) => {
    navigator.clipboard.writeText(cmd).then(() => {
      showToast('指令已复制到剪贴板', 'success');
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-[#1a1f2c] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-white/80 dark:border-white/10 shadow-[12px_12px_32px_rgba(0,0,0,0.2),inset_2px_2px_4px_rgba(255,255,255,0.7)] flex flex-col justify-between space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900/60 dark:to-sky-800/40 text-sky-700 dark:text-sky-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.06)]">
              <Server size={22} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Linux 开发环境实操手册：基于 VS Code Remote-SSH 与云服务器
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold shadow-[inset_1px_1px_2px_rgba(245,158,11,0.15)]">
                  环境指南
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                说明在 Windows 编写代码并在云端 Linux 环境下编译、调试与内存检测的操作方法
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center shadow-[2px_2px_6px_rgba(0,0,0,0.05),inset_1px_1px_2px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
            aria-label="关闭指引"
          >
            <X size={18} />
          </button>
        </div>

        {/* 5 Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('concept')}
            className={`px-3.5 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'concept'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_6px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5'
            }`}
          >
            <Lightbulb size={14} />
            <span>1. 核心认知破局</span>
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-3.5 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'steps'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_6px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5'
            }`}
          >
            <ListOrdered size={14} />
            <span>2. 云服务器实战 8 步</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'matrix'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_6px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5'
            }`}
          >
            <Table size={14} />
            <span>3. 运作对照矩阵</span>
          </button>
          <button
            onClick={() => setActiveTab('debug')}
            className={`px-3.5 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'debug'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_6px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5'
            }`}
          >
            <Bug size={14} />
            <span>4. 调试与 ASan 内存检测</span>
          </button>
          <button
            onClick={() => setActiveTab('cmake')}
            className={`px-3.5 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'cmake'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_6px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5'
            }`}
          >
            <FolderTree size={14} />
            <span>5. 工程构建 CMake 与 WSL2</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* Tab 1: Concept */}
          {activeTab === 'concept' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-amber-100/70 via-orange-50/70 to-yellow-100/70 dark:from-amber-950/40 dark:via-orange-900/30 dark:to-yellow-900/40 border border-white/70 dark:border-white/10 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08)] rounded-3xl p-5 sm:p-6 space-y-3">
                <div className="font-bold text-amber-900 dark:text-amber-200 text-sm mb-1.5 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-amber-200/80 dark:bg-amber-900/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-amber-700 dark:text-amber-300">
                    <Lightbulb size={14} />
                  </div>
                  <span>开发模式说明：“Windows 编辑与远程 Linux 执行”</span>
                </div>
                <p className="text-xs text-amber-950/80 dark:text-amber-300/80 leading-relaxed font-medium">
                  初学远程开发容易产生误区：以为要在本地保存 <code>main.cpp</code>，再通过文件传输复制到远程机器编译。
                  <strong>实际开发中通常采用基于 SSH 协议的远程编辑工作流。</strong>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3 text-xs">
                  <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)] space-y-1.5">
                    <div className="font-bold text-rose-800 dark:text-rose-300 mb-1 flex items-center gap-1.5">
                      <span>✕ 繁琐低效做法</span>
                    </div>
                    <p className="text-rose-700 dark:text-rose-400 leading-relaxed">
                      在 Windows 写好代码 ➔ 用 Xftp 传到服务器 ➔ Xshell 敲命令编译 ➔ 报错再回 Windows 改。链路割裂，无法使用断点调试。
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)] space-y-1.5">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                      <span>✓ 工业标准做法</span>
                    </div>
                    <p className="text-emerald-700 dark:text-emerald-400 leading-relaxed">
                      代码物理存放在云服务器 <code>~/projects</code> 目录下。Windows VS Code 通过 Remote-SSH 打开该目录，按 <code>Ctrl+S</code> 直接保存至云端，并在集成终端即时编译运行。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Steps */}
          {activeTab === 'steps' && (
            <div className="space-y-3">
              {[
                {
                  step: 1,
                  title: '在 Windows VS Code 安装 Remote - SSH 插件',
                  desc: '打开扩展市场（Ctrl+Shift+X），搜索并安装微软官方的 Remote - SSH 插件。'
                },
                {
                  step: 2,
                  title: '云服务器控制台配置安全组放行 22 端口',
                  desc: '在阿里云控制台 -> 实例安全组中，确保入方向放行 TCP 22 端口 (SSH 服务)。若测试 Web 服务，同时放行 8080 或 8000 端口。'
                },
                {
                  step: 3,
                  title: 'Windows PowerShell 生成 SSH 密钥对实现一键免密',
                  desc: '在本地运行 ssh-keygen -t rsa -b 4096，随后使用 ssh-copy-id -i ~/.ssh/id_rsa.pub root@<服务器公网IP> 将公钥写入云服务器。',
                  cmd: 'ssh-keygen -t rsa -b 4096'
                },
                {
                  step: 4,
                  title: '配置 VS Code ~/.ssh/config 快速直连',
                  desc: '编辑配置文件添加别名配置：',
                  code: 'Host aliyun-muduo\n    HostName 你的公网IP\n    User root\n    IdentityFile ~/.ssh/id_rsa'
                },
                {
                  step: 5,
                  title: '连接云端并打开项目工作区',
                  desc: '点击左下角绿色双向箭头图标 -> Connect to Host -> 选择 aliyun-muduo。新建终端运行 mkdir -p ~/projects/muduo_study && cd ~/projects/muduo_study。'
                },
                {
                  step: 6,
                  title: '安装 C++ 编译工具链与基础调试器',
                  desc: '在云端终端执行系统更新与开发依赖安装：',
                  cmd: 'sudo apt update && sudo apt install -y g++ gdb cmake git valgrind htop'
                },
                {
                  step: 7,
                  title: '编写第一个 Linux Socket 原生测试程序并编译',
                  desc: '测试 socket / bind / listen 系统调用：',
                  cmd: 'g++ -std=c++17 -Wall test.cpp -o test && ./test'
                },
                {
                  step: 8,
                  title: '安装云端 VS Code C++ 语言插件与代码提示',
                  desc: '在远端扩展市场安装 C/C++ (ms-vscode.cpptools)，即可享受完整的跳转定义、悬停文档与补全。'
                }
              ].map(s => (
                <div
                  key={s.step}
                  className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-white/70 dark:border-white/10 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] shrink-0 shadow-[1px_1px_3px_rgba(2,132,199,0.3)]">
                        {s.step}
                      </span>
                      <span>{s.title}</span>
                    </div>
                    {s.cmd && (
                      <button
                        onClick={() => handleCopyCmd(s.cmd!)}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
                        title="复制命令"
                      >
                        <Copy size={12} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 pl-7">{s.desc}</p>
                  {s.code && (
                    <div className="ml-7">
                      <CodeBlock code={s.code} language="bash" maxHeight="max-h-[150px]" />
                    </div>
                  )}
                  {s.cmd && (
                    <div className="ml-7 bg-slate-900 text-emerald-400 font-mono text-xs px-3 py-2 rounded-2xl border border-slate-800 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4)]">
                      $ {s.cmd}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Matrix */}
          {activeTab === 'matrix' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                当你坐在电脑前操作时，Windows 本地与云服务器各自的职责边界对照表：
              </p>
              <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-b border-slate-200/60 dark:border-slate-700">
                    <tr>
                      <th className="p-3">开发环节</th>
                      <th className="p-3 text-sky-700 dark:text-sky-300">你的电脑 (Windows)</th>
                      <th className="p-3 text-emerald-700 dark:text-emerald-300">云服务器 (Linux)</th>
                      <th className="p-3 text-slate-500">SSH 传输协议内容</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="p-3 font-bold font-sans">代码编写与敲击</td>
                      <td className="p-3">渲染界面与输入框响应</td>
                      <td className="p-3">无计算开销</td>
                      <td className="p-3 text-slate-400">击键缓冲</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold font-sans">文件保存 (Ctrl+S)</td>
                      <td className="p-3">发送保存请求</td>
                      <td className="p-3 font-semibold text-emerald-600">物理写入远程硬盘</td>
                      <td className="p-3 text-slate-400">文件差量更新</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold font-sans">代码编译 (g++)</td>
                      <td className="p-3">仅作为输出终端展示</td>
                      <td className="p-3 font-semibold text-emerald-600">CPU 消耗、生成 ELF 二进制</td>
                      <td className="p-3 text-slate-400">标准输出与错误流</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold font-sans">运行与系统调用</td>
                      <td className="p-3">无系统开销</td>
                      <td className="p-3 font-semibold text-emerald-600">内核 epoll、socket、eventfd</td>
                      <td className="p-3 text-slate-400">运行日志回传</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold font-sans">断点单步调试</td>
                      <td className="p-3">图形化按钮与变量观察窗口</td>
                      <td className="p-3 font-semibold text-emerald-600">gdb-server 挂载进线程暂停</td>
                      <td className="p-3 text-slate-400">GDB 协议帧</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Debug & ASan */}
          {activeTab === 'debug' && (
            <div className="space-y-4">
              <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-3xl border border-white/70 dark:border-white/10 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] space-y-2.5">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-sky-100/90 dark:bg-sky-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-sky-600 dark:text-sky-400">
                    <Bug size={14} />
                  </div>
                  <span>AddressSanitizer (ASan) 编译期内存检测神器</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  这是排查 C++ 野指针、Double Free、堆越界的最强利器。编译时加上：
                </p>
                <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-3 rounded-2xl border border-slate-800 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4)] flex items-center justify-between">
                  <span className="overflow-x-auto select-all">g++ -std=c++17 -fsanitize=address -g -O1 main.cpp -o main && ./main</span>
                  <button
                    onClick={() =>
                      handleCopyCmd(
                        'g++ -std=c++17 -fsanitize=address -g -O1 main.cpp -o main && ./main'
                      )
                    }
                    className="p-1 text-slate-400 hover:text-emerald-400 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-3xl border border-white/70 dark:border-white/10 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] space-y-2.5">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-6 h-6 rounded-xl flex items-center justify-center bg-purple-100/90 dark:bg-purple-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-purple-600 dark:text-purple-400">
                    <Terminal size={14} />
                  </div>
                  <span>GDB 常用命令行速查表</span>
                </div>
                <ul className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <li className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]">
                    <span className="font-bold text-sky-600">b main</span> : 在 main 函数打断点
                  </li>
                  <li className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]">
                    <span className="font-bold text-sky-600">r</span> : 运行程序 (Run)
                  </li>
                  <li className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]">
                    <span className="font-bold text-sky-600">n</span> : 单步步过 (Next)
                  </li>
                  <li className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]">
                    <span className="font-bold text-sky-600">s</span> : 单步步入 (Step into)
                  </li>
                  <li className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]">
                    <span className="font-bold text-sky-600">p var</span> : 打印变量当前值
                  </li>
                  <li className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]">
                    <span className="font-bold text-sky-600">bt</span> : 打印崩溃调用栈 (Backtrace)
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 5: CMake & WSL2 */}
          {activeTab === 'cmake' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  多文件项目标准 CMakeLists.txt 模板
                </div>
                <CodeBlock
                  code={`cmake_minimum_required(VERSION 3.10)
project(MyMuduo CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_FLAGS "\${CMAKE_CXX_FLAGS} -Wall -Wextra -pthread -g")

include_directories(include)

file(GLOB_RECURSE SOURCES "src/*.cpp")

add_executable(muduo_server main.cpp \${SOURCES})
target_link_libraries(muduo_server pthread)`}
                  language="cmake"
                  title="CMakeLists.txt"
                />
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-100/60 dark:border-sky-900/40 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)] text-xs">
                <div className="font-bold text-sky-900 dark:text-sky-200 mb-1">
                  WSL2 (Windows Subsystem for Linux) 备选方案说明
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  如果你不想购买云服务器，可以在 Windows 开启 WSL2 安装 Ubuntu 22.04 LTS。VS Code 原生支持 WSL 扩展，工作原理与 Remote-SSH 几乎完全相同，同样具备 Linux 内核的完整 epoll 网络栈。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold text-xs shadow-[2px_2px_8px_rgba(0,0,0,0.2),inset_1px_1px_2px_rgba(255,255,255,0.3)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
          >
            关闭指引
          </button>
        </div>
      </div>
    </div>
  );
};

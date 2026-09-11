import React, { useState } from 'react';
import { X, Terminal, Cpu, Bug, FileCode, Check, Copy } from 'lucide-react';

interface EnvGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const EnvGuideModal: React.FC<EnvGuideModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'cmake' | 'asan' | 'docker' | 'matrix'>('cmake');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast("已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-stone-200 max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-sky-700" />
            <h3 className="text-lg font-bold text-stone-900 font-serifHeading">
              Linux C++ 高并发工业实战环境指南
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 顶部标签切换 */}
        <div className="flex space-x-1.5 bg-stone-100 p-1.5 rounded-xl text-xs font-serifHeading font-bold">
          <button
            onClick={() => setActiveTab('cmake')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'cmake' ? 'bg-white text-sky-950 shadow-xs' : 'text-stone-600'}`}
          >
            CMake 现代构建模板
          </button>
          <button
            onClick={() => setActiveTab('asan')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'asan' ? 'bg-white text-sky-950 shadow-xs' : 'text-stone-600'}`}
          >
            AddressSanitizer 内存检测
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'matrix' ? 'bg-white text-sky-950 shadow-xs' : 'text-stone-600'}`}
          >
            编译排错速查矩阵
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'docker' ? 'bg-white text-sky-950 shadow-xs' : 'text-stone-600'}`}
          >
            WSL2 / Docker 快速环境
          </button>
        </div>

        {/* Tab 内容区 */}
        <div className="space-y-3">
          {activeTab === 'cmake' && (
            <div className="space-y-2">
              <p className="text-xs text-stone-600 font-serifMono">
                大厂标准 CMakeLists.txt 现代工程模板，内置 C++11 标准、多线程 pthread 与警告安全检查：
              </p>
              <pre className="p-3.5 bg-stone-950 text-sky-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{`cmake_minimum_required(VERSION 3.12)
project(muduo_learning CXX)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# 开启极度严苛的编译器告警 (大厂规范)
add_compile_options(-Wall -Wextra -Werror -Wconversion -Wno-unused-parameter)

# 查找系统 pthread 支持
find_package(Threads REQUIRED)

add_executable(my_server main.cc)
target_link_libraries(my_server PRIVATE Threads::Threads)`}</code>
              </pre>
            </div>
          )}

          {activeTab === 'asan' && (
            <div className="space-y-2">
              <p className="text-xs text-stone-600 font-serifMono">
                通过 AddressSanitizer (ASan) 可以在运行期瞬间捕获 99% 的内存泄漏、悬空指针与缓冲区溢出：
              </p>
              <pre className="p-3.5 bg-stone-950 text-sky-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{`# 在 CMake 中开启 ASan 调试指令：
set(CMAKE_CXX_FLAGS_DEBUG "\${CMAKE_CXX_FLAGS_DEBUG} -fsanitize=address -fno-omit-frame-pointer")
set(CMAKE_LINKER_FLAGS_DEBUG "\${CMAKE_LINKER_FLAGS_DEBUG} -fsanitize=address")

# 命令行直接单文件极速验证：
g++ -std=c++11 -g -fsanitize=address -fno-omit-frame-pointer test_mem.cc -o test_mem
./test_mem  # 一旦发生非法指针越界，终端会精准打印调用栈行号！`}</code>
              </pre>
            </div>
          )}

          {activeTab === 'matrix' && (
            <div className="space-y-2 text-xs font-serifHeading">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-800">1. undefined reference to `pthread_create'</span>
                <p className="text-stone-600 font-serifMono mt-0.5">解决：CMake 中加上 <code>target_link_libraries(... Threads::Threads)</code> 或 g++ 参数末尾加上 <code>-lpthread</code>。</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-800">2. broken pipe / SIGPIPE 崩溃退出</span>
                <p className="text-stone-600 font-serifMono mt-0.5">解决：在 main 函数首行添加 <code>signal(SIGPIPE, SIG_IGN);</code> 忽略对端断开写入信号。</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-800">3. Address already in use (绑定端口失败)</span>
                <p className="text-stone-600 font-serifMono mt-0.5">解决：创建 socket 后立即设置 <code>setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &val, sizeof(val));</code>。</p>
              </div>
            </div>
          )}

          {activeTab === 'docker' && (
            <div className="space-y-2">
              <p className="text-xs text-stone-600 font-serifMono">
                在 Windows 11 下无需笨重虚拟机，只需一条命令启动 Ubuntu 编译环境并挂载代码：
              </p>
              <pre className="p-3.5 bg-stone-950 text-sky-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{`# 启动 Ubuntu 容器并挂载当前工程目录：
docker run -it --rm -v \${PWD}:/workspace -w /workspace gcc:11 bash

# 容器内已预置最新 g++、make 与完整 POSIX 开发库！`}</code>
              </pre>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-950 text-white font-bold text-xs cursor-pointer"
          >
            完成研读
          </button>
        </div>
      </div>
    </div>
  );
};

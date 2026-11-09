import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[GlobalErrorBoundary] Caught unhandled exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleClearAndReload = () => {
    try {
      // Clear app cache except critical saved notes if needed, or provide clean reload
      sessionStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[12px_12px_32px_rgba(0,0,0,0.12),inset_2px_2px_4px_rgba(255,255,255,0.8)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] border border-slate-200/80 dark:border-slate-800 flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-[2px_2px_6px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)]">
              <AlertTriangle size={28} />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {this.props.fallbackTitle || '页面加载遇到轻微异常'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                系统已安全捕获该错误并避免了白屏，请点击下方按钮重新加载。
              </p>
            </div>

            {this.state.error && (
              <div className="w-full text-left bg-slate-100/80 dark:bg-slate-950/60 rounded-xl p-3 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-rose-600 dark:text-rose-400 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-[0_2px_8px_rgba(2,132,199,0.35)] active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>刷新重试</span>
              </button>

              <button
                type="button"
                onClick={this.handleClearAndReload}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-[2px_2px_5px_rgba(0,0,0,0.04)] active:scale-95 transition-all cursor-pointer"
              >
                <Trash2 size={13} />
                <span>清理会话并重载</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

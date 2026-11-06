import React, { useState, useEffect } from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface ToastMessage {
  id: number;
  text: string;
  type?: 'success' | 'info' | 'warning';
}

export function showToast(text: string, type: 'success' | 'info' | 'warning' = 'success') {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('muduo_toast', {
      detail: { text, type }
    });
    window.dispatchEvent(event);
  }
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    let count = 0;
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string; type?: 'success' | 'info' | 'warning' }>;
      const newToast: ToastMessage = {
        id: ++count,
        text: customEvent.detail.text,
        type: customEvent.detail.type || 'success'
      };

      setToasts(prev => [...prev.slice(-3), newToast]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 2500);
    };

    window.addEventListener('muduo_toast', handleToast);
    return () => window.removeEventListener('muduo_toast', handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-2 pointer-events-auto border bg-slate-900/90 text-white border-slate-700/80"
        >
          {toast.type === 'info' && <Info size={14} className="text-sky-400 shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle size={14} className="text-amber-400 shrink-0" />}
          {(!toast.type || toast.type === 'success') && <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />}
          <span>{toast.text}</span>
        </div>
      ))}
    </div>
  );
};

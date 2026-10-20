/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  durationMs?: number;
}

interface NotificationContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
  showInfo: (title: string, description?: string) => void;
  showWarning: (title: string, description?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const duration = toast.durationMs ?? 4000;
      const newToast: ToastMessage = { ...toast, id };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const showSuccess = useCallback((title: string, description?: string) => {
    addToast({ type: 'success', title, description });
  }, [addToast]);

  const showError = useCallback((title: string, description?: string) => {
    addToast({ type: 'error', title, description });
  }, [addToast]);

  const showInfo = useCallback((title: string, description?: string) => {
    addToast({ type: 'info', title, description });
  }, [addToast]);

  const showWarning = useCallback((title: string, description?: string) => {
    addToast({ type: 'warning', title, description });
  }, [addToast]);

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      {/* Toast floating container */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none"
        aria-live="polite"
        role="region"
        aria-label="Notificações do sistema"
      >
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
            error: <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
            warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
            info: <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />,
          };

          const borderColors = {
            success: 'border-emerald-200 bg-white',
            error: 'border-rose-200 bg-white',
            warning: 'border-amber-200 bg-white',
            info: 'border-indigo-200 bg-white',
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl border shadow-lg flex items-start gap-3 transition-all transform duration-200 ${borderColors[toast.type]}`}
            >
              {icons[toast.type]}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
                {toast.description && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{toast.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
                aria-label="Fechar notificação"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

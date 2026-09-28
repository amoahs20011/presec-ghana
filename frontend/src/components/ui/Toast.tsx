'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = Math.random().toString(36).slice(2);
      const toast: ToastItem = { id, type, message, duration };
      setToasts((prev) => [...prev, toast]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <ToastView
            key={t.id}
            toast={t}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const styles: Record<
  ToastType,
  { bg: string; border: string; text: string; icon: string }
> = {
  success: {
    bg: 'bg-success-light',
    border: 'border-success',
    text: 'text-success-dark',
    icon: '✓',
  },
  error: {
    bg: 'bg-error-light',
    border: 'border-error',
    text: 'text-error-dark',
    icon: '✕',
  },
  warning: {
    bg: 'bg-warning-light',
    border: 'border-warning',
    text: 'text-warning-dark',
    icon: '⚠',
  },
  info: {
    bg: 'bg-info-light',
    border: 'border-info',
    text: 'text-info-dark',
    icon: 'ℹ',
  },
};

function ToastView({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: () => void;
}) {
  const s = styles[toast.type];

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-down ${s.bg} ${s.border} ${s.text}`}
    >
      <span className="font-bold text-lg leading-none">{s.icon}</span>
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={onClose}
        className="text-lg leading-none opacity-60 hover:opacity-100"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}

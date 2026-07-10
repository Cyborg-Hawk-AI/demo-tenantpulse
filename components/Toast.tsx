"use client";

import { useEffect } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />,
    info: <Info className="h-5 w-5 text-accent" />,
  };

  const borders = {
    success: "border-emerald-500/30",
    error: "border-red-500/30",
    info: "border-accent/30",
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border ${borders[toast.type]} bg-surface-raised px-4 py-3 shadow-xl animate-slide-up`}
    >
      {icons[toast.type]}
      <span className="text-sm text-slate-200">{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="ml-2 text-slate-500 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}

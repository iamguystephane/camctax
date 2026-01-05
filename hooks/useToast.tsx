'use client'

import * as React from "react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "destructive";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

const ToastContext = React.createContext<{
  toast: (t: Omit<Toast, "id">) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = (t: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...t, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "w-80 rounded-lg border p-4 shadow-lg animate-in slide-in-from-top-2",
              t.variant === "destructive" &&
                "border-red-500 bg-red-50 text-red-900",
              t.variant === "success" &&
                "border-green-500 bg-green-50 text-green-900",
              (!t.variant || t.variant === "default") && "bg-background"
            )}
          >
            <p className="font-semibold">{t.title}</p>
            {t.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {t.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bot, Sparkles, CheckCircle2 } from "lucide-react";
import { registerWebMCPTools } from "@/lib/webmcp/register-tools";
import { CurrentLearningContext } from "@/lib/webmcp/types";

interface WebMCPContextType {
  isWebMCPAvailable: boolean;
}

const WebMCPContext = createContext<WebMCPContextType>({
  isWebMCPAvailable: false,
});

export const useWebMCP = () => useContext(WebMCPContext);

interface ToastAction {
  id: number;
  actionName: string;
  detail: string;
}

export function WebMCPProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isWebMCPAvailable, setIsWebMCPAvailable] = useState(false);
  const [toasts, setToasts] = useState<ToastAction[]>([]);

  useEffect(() => {
    const getCurrentContext = (): CurrentLearningContext => {
      const heading = document.querySelector("h1")?.textContent || "";
      const urlParams = new URLSearchParams(window.location.search);
      const t = urlParams.get("t");
      return {
        lessonTitle: heading,
        currentTimestampSeconds: t ? parseFloat(t) : 0,
      };
    };

    const registered = registerWebMCPTools((url) => router.push(url), getCurrentContext);
    queueMicrotask(() => {
      setIsWebMCPAvailable(registered);
    });
  }, [pathname, router]);

  useEffect(() => {
    const handleAction = (e: Event) => {
      const customEv = e as CustomEvent<{ actionName: string; detail: string }>;
      const newToast: ToastAction = {
        id: Date.now(),
        actionName: customEv.detail.actionName,
        detail: customEv.detail.detail,
      };

      setToasts((prev) => [...prev.slice(-2), newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4500);
    };

    window.addEventListener("webmcp:action", handleAction);
    return () => window.removeEventListener("webmcp:action", handleAction);
  }, []);

  return (
    <WebMCPContext.Provider value={{ isWebMCPAvailable }}>
      {children}

      {/* Floating Agent Action Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-neutral-900 text-white rounded-xl p-3.5 shadow-2xl border border-neutral-800 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-600/30 text-primary-400 border border-primary-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-primary-400 tracking-wide uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Agent Action
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xs font-semibold text-neutral-200 truncate">{t.actionName}</p>
              <p className="text-[11px] text-neutral-400 truncate">{t.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </WebMCPContext.Provider>
  );
}

import React from "react";
import { cn } from "@/lib/utils";

export function NextJsIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-6 h-6 rounded-md bg-neutral-950 flex items-center justify-center text-white font-serif font-bold text-xs select-none shrink-0",
        className
      )}
    >
      <span>N</span>
    </div>
  );
}

export function ReactIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-6 h-6 rounded-md bg-sky-50 text-sky-500 flex items-center justify-center select-none shrink-0",
        className
      )}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="12" rx="9" ry="3.5" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}

export function NodeJsIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 font-bold text-[10px] flex items-center justify-center select-none shrink-0",
        className
      )}
    >
      <span>JS</span>
    </div>
  );
}

export function JavaScriptIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-6 h-6 rounded-md bg-amber-400 text-neutral-900 font-bold text-[10px] flex items-center justify-center select-none shrink-0",
        className
      )}
    >
      <span>JS</span>
    </div>
  );
}

export function DockerIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center select-none shrink-0",
        className
      )}
    >
      <svg className="w-11 h-11 sm:w-13 sm:h-13" viewBox="0 0 64 48" fill="none">
        <rect x="26" y="6" width="6.5" height="5.5" rx="1" fill="#38BDF8" />
        <rect x="26" y="13" width="6.5" height="5.5" rx="1" fill="#38BDF8" />
        <rect x="34" y="13" width="6.5" height="5.5" rx="1" fill="#38BDF8" />
        <rect x="18" y="20" width="6.5" height="5.5" rx="1" fill="#38BDF8" />
        <rect x="26" y="20" width="6.5" height="5.5" rx="1" fill="#38BDF8" />
        <rect x="34" y="20" width="6.5" height="5.5" rx="1" fill="#38BDF8" />
        <path
          d="M48 27C47 24 43.5 22.5 40 22.5C38.5 19.5 35 18.5 32 19C31 18.5 29.5 18 28 18H10C8.5 18 7 19.5 7 21.5V30C7 36.5 14 41 24 41C34.5 41 44.5 36.5 47 28.5C47.5 27.5 48 27 48 27Z"
          fill="#0284C7"
        />
        <circle cx="13" cy="27" r="1.5" fill="white" />
        <path
          d="M8 43C16 47.5 32 47.5 44 42"
          stroke="#0284C7"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function TypeScriptIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] bg-[#3178C6] flex items-center justify-center select-none shadow-sm shrink-0",
        className
      )}
    >
      <span className="font-sans font-bold text-xl sm:text-2xl text-white tracking-tight">TS</span>
    </div>
  );
}

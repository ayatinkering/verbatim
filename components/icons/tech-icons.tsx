import React from "react";
import { cn } from "@/lib/utils";

export function NextJsIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] bg-neutral-950 border border-neutral-800/80 flex items-center justify-center select-none shadow-sm shrink-0",
        className
      )}
    >
      <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="silver-diagonal-icon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E4E4E7" />
            <stop offset="100%" stopColor="#71717A" />
          </linearGradient>
        </defs>
        {/* Left vertical bar */}
        <rect x="22" y="20" width="12" height="60" fill="white" />
        {/* Right vertical bar */}
        <rect x="66" y="20" width="12" height="60" fill="white" />
        {/* Metallic slash diagonal */}
        <polygon
          points="22,20 34,20 78,80 66,80"
          fill="url(#silver-diagonal-icon)"
        />
      </svg>
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
        {/* Containers Stack: 3-2-1 Pattern */}
        {/* Top Row (1 container) */}
        <rect x="26" y="6" width="6.5" height="5.5" rx="1" fill="#38BDF8" />

        {/* Middle Row (2 containers) */}
        <rect x="26" y="13" width="6.5" height="5.5" rx="1" fill="#38BDF8" />
        <rect x="34" y="13" width="6.5" height="5.5" rx="1" fill="#38BDF8" />

        {/* Bottom Row (3 containers) */}
        <rect x="18" y="20" width="6.5" height="5.5" rx="1" fill="#38BDF8" />
        <rect x="26" y="20" width="6.5" height="5.5" rx="1" fill="#38BDF8" />
        <rect x="34" y="20" width="6.5" height="5.5" rx="1" fill="#38BDF8" />

        {/* Whale Body */}
        <path
          d="M48 27C47 24 43.5 22.5 40 22.5C38.5 19.5 35 18.5 32 19C31 18.5 29.5 18 28 18H10C8.5 18 7 19.5 7 21.5V30C7 36.5 14 41 24 41C34.5 41 44.5 36.5 47 28.5C47.5 27.5 48 27 48 27Z"
          fill="#0284C7"
        />

        {/* Whale Eye */}
        <circle cx="13" cy="27" r="1.5" fill="white" />

        {/* Water Wave Curve Underneath */}
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

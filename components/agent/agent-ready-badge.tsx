import React from "react";

export function AgentReadyBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200/80 text-primary-800 text-xs font-medium shadow-2xs select-none">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
      </span>
      <span className="font-mono font-semibold tracking-wide text-[11px] text-primary-900">WebMCP</span>
      <span className="text-neutral-400 text-[10px]">•</span>
      <span className="text-primary-700">Agent Ready</span>
    </div>
  );
}

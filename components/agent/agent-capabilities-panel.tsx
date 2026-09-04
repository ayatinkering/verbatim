import React from "react";
import { Check, ShieldCheck, Terminal, ExternalLink } from "lucide-react";
import { getWebMCPCapabilities } from "@/lib/webmcp";

export function AgentCapabilitiesPanel() {
  const capabilities = getWebMCPCapabilities();

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-neutral-200/80 bg-neutral-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 leading-none">
              Agent Capabilities
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Registered WebMCP Tools on document.modelContext
            </p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          6 Tools Active
        </span>
      </div>

      {/* Capabilities List */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {capabilities.map((cap) => (
          <div
            key={cap.name}
            className="p-3 rounded-xl border border-neutral-150 hover:border-neutral-250 bg-neutral-50/40 hover:bg-white transition-colors duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-neutral-900 font-sans">
                  {cap.label}
                </span>
                <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  Available
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed font-sans mb-2">
                {cap.description}
              </p>
            </div>
            <div className="pt-1.5 border-t border-neutral-200/60 flex items-center justify-between">
              <code className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                {cap.name}()
              </code>
              <span className="text-[9.5px] font-mono text-neutral-400">WebMCP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

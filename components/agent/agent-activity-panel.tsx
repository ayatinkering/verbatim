import React, { useEffect, useState } from "react";
import { Activity, ChevronRight } from "lucide-react";
import { learningStore, AgentActivityItem } from "@/lib/learning-store";

export function AgentActivityPanel() {
  const [activities, setActivities] = useState<AgentActivityItem[]>([]);

  useEffect(() => {
    setActivities(learningStore.getActivities());
    const unsubscribe = learningStore.subscribe(() => {
      setActivities(learningStore.getActivities());
    });
    return () => unsubscribe();
  }, []);

  const getToolBadgeColor = (tool: string) => {
    switch (tool) {
      case "search_learning":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "inspect_lesson":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "get_learning_state":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "create_learning_plan":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "open_lesson":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "update_learning_progress":
        return "bg-teal-50 text-teal-700 border-teal-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Panel Header */}
      <div className="px-5 py-3.5 border-b border-neutral-200/80 bg-neutral-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary-100/70 border border-primary-200 flex items-center justify-center text-primary-700">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 leading-none">
              Agent Activity
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Real-time WebMCP actions & workspace mutations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Stream
          </span>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[380px] space-y-3 font-sans">
        {activities.length === 0 ? (
          <div className="py-12 text-center text-neutral-400 text-sm">
            No agent activities recorded yet.
          </div>
        ) : (
          activities.map((item, idx) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all duration-200 ${
                idx === 0
                  ? "bg-neutral-50/80 border-primary-200 shadow-2xs"
                  : "bg-white border-neutral-150 hover:border-neutral-250"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border ${getToolBadgeColor(
                    item.tool
                  )}`}
                >
                  {item.tool}
                </span>
                <span className="text-[10.5px] font-mono text-neutral-400">
                  {item.timestamp}
                </span>
              </div>

              <div className="text-xs font-medium text-neutral-800 mb-0.5 leading-snug">
                {item.action}
              </div>

              <div className="text-xs text-neutral-600 flex items-start gap-1.5 mt-1">
                <ChevronRight className="w-3 h-3 text-primary-500 shrink-0 mt-0.5" />
                <span className="font-mono text-[11.5px] text-neutral-700 break-words">
                  {item.result}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Panel Footer */}
      <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-200/80 text-[11px] text-neutral-500 flex items-center justify-between">
        <span className="font-mono">modelContext.registerTool(...)</span>
        <span className="text-primary-700 font-medium">Structured Execution</span>
      </div>
    </div>
  );
}

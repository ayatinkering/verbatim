import React, { useEffect, useState } from "react";
import { CheckCircle2, Target } from "lucide-react";
import { learningStore, LearningState } from "@/lib/learning-store";

export function LearnerProgressHeader() {
  const [state, setState] = useState<LearningState>(learningStore.getState());

  useEffect(() => {
    const unsubscribe = learningStore.subscribe(() => {
      setState(learningStore.getState());
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 shadow-2xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-primary-100 border border-primary-200/60 flex items-center justify-center text-primary-700">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Shared Workspace State
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Synced with WebMCP
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-serif font-medium text-neutral-900 mt-0.5">
            {state.currentGoal ? `Goal: ${state.currentGoal}` : "Tracked Learning Progress"}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-neutral-900 font-mono">
              {state.progress.completed} / {state.progress.total}
            </span>
            <span className="text-xs text-neutral-500">completed</span>
          </div>

          <div className="w-36 sm:w-44 h-2 rounded-full bg-neutral-100 overflow-hidden mt-1.5 border border-neutral-200/70">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${state.progress.percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

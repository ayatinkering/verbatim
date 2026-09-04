import React from "react";
import { Clock, BookOpen, CheckCircle2, ArrowRight, Sparkles, Layers } from "lucide-react";
import { LearningPlan, learningStore } from "@/lib/learning-store";

interface ActivePlanViewProps {
  plan: LearningPlan;
  onOpenLesson: (lessonId: string) => void;
}

export function ActivePlanView({ plan, onOpenLesson }: ActivePlanViewProps) {
  return (
    <div className="bg-white rounded-2xl border border-primary-200/90 shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-primary-50/80 to-neutral-50 border-b border-primary-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                Active Learning Plan
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 font-medium">
                Adaptive Curriculum
              </span>
            </div>
            <h3 className="text-lg font-serif text-neutral-900 font-medium mt-0.5">
              {plan.goal}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200/90 shadow-2xs text-xs font-medium text-neutral-700">
            <Clock className="w-3.5 h-3.5 text-primary-600" />
            <span>Target Budget: <strong>{plan.timeBudget} min</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200/90 shadow-2xs text-xs font-medium text-neutral-700">
            <BookOpen className="w-3.5 h-3.5 text-primary-600" />
            <span>Lessons: <strong>{plan.plan.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Plan Items */}
      <div className="p-6 space-y-3.5">
        {plan.plan.map((item) => (
          <div
            key={item.lessonId}
            className="group p-4 rounded-xl border border-neutral-200/80 hover:border-primary-300 bg-white hover:bg-primary-50/20 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-primary-100 group-hover:text-primary-700 text-neutral-600 font-mono text-sm font-semibold flex items-center justify-center shrink-0 transition-colors">
                {item.order}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                    {item.course}
                  </span>
                  <span className="text-xs text-neutral-400">•</span>
                  <span className="text-xs text-neutral-500">
                    {item.module}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-primary-800 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {item.reason}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-100/90 px-2.5 py-1 rounded-lg">
                <Clock className="w-3 h-3 text-neutral-500" />
                {item.durationMinutes} min
              </span>

              <button
                type="button"
                onClick={() => onOpenLesson(item.lessonId)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <span>Open</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

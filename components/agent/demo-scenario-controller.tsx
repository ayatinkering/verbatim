import React, { useState } from "react";
import {
  Play,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { invokeWebMCPTool } from "@/lib/webmcp";

export function DemoScenarioController() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  const steps = [
    {
      num: 1,
      title: "Goal: 25-min Plan",
      desc: "Search & create 25-min plan for Next.js server components",
      execute: async () => {
        await invokeWebMCPTool("search_learning", {
          query: "Next.js server components",
        });
        await invokeWebMCPTool("inspect_lesson", {
          lessonId: "lesson.nextjs-app-router-in-depth-server-components",
        });
        await invokeWebMCPTool("create_learning_plan", {
          topic: "Next.js server components",
          timeBudget: 25,
        });
      },
    },
    {
      num: 2,
      title: "Constraint Change: 10-min",
      desc: "Learner changes time to 10 min -> Agent adapts plan",
      execute: async () => {
        await invokeWebMCPTool("get_learning_state", {});
        await invokeWebMCPTool("create_learning_plan", {
          topic: "Next.js server components",
          timeBudget: 10,
        });
      },
    },
    {
      num: 3,
      title: "Action: Open Lesson",
      desc: "Agent opens 'React Server Components Change Everything'",
      execute: async () => {
        await invokeWebMCPTool("open_lesson", {
          lessonId: "lesson.nextjs-app-router-in-depth-server-components",
        });
      },
    },
    {
      num: 4,
      title: "Progress: Mark Complete",
      desc: "Learner finishes lesson -> Progress updates 13/120 to 14/120",
      execute: async () => {
        await invokeWebMCPTool("update_learning_progress", {
          lessonId: "lesson.nextjs-app-router-in-depth-server-components",
          status: "completed",
        });
      },
    },
  ];

  const runFullScenario = async () => {
    setIsRunning(true);
    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i + 1);
        await steps[i].execute();
        await new Promise((r) => setTimeout(r, 1200));
      }
    } finally {
      setIsRunning(false);
    }
  };

  const runSingleStep = async (stepNum: number) => {
    setCurrentStep(stepNum);
    setIsRunning(true);
    try {
      await steps[stepNum - 1].execute();
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-900 to-neutral-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-primary-700/50 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-400/20 text-primary-200 text-xs font-mono font-medium border border-primary-300/30">
              <Sparkles className="w-3 h-3 text-primary-300" />
              Judge Demo Flow
            </span>
            <span className="text-xs text-neutral-400">60-Second Sequence</span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-medium text-white">
            WebMCP Live Interactive Demonstration
          </h3>
          <p className="text-xs text-neutral-300 mt-0.5 max-w-xl">
            Simulates the authentic dialogue between learner and agent, triggering genuine WebMCP tools and live workspace state changes.
          </p>
        </div>

        <button
          type="button"
          disabled={isRunning}
          onClick={runFullScenario}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-white font-medium text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-98 shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isRunning ? "Running Flow..." : "Run Full 4-Step Scenario"}</span>
        </button>
      </div>

      {/* Step Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
        {steps.map((step) => {
          const isActive = currentStep === step.num;
          return (
            <div
              key={step.num}
              className={`p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? "bg-primary-800/60 border-primary-400 shadow-xs"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-semibold text-primary-300">
                    STEP {step.num}
                  </span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  )}
                </div>
                <h4 className="text-xs font-semibold text-white leading-snug">
                  {step.title}
                </h4>
                <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <button
                type="button"
                disabled={isRunning}
                onClick={() => runSingleStep(step.num)}
                className="mt-3 inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <span>Trigger Step {step.num}</span>
                <ArrowRight className="w-3 h-3 text-primary-300" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

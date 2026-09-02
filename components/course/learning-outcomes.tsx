"use client";

import React from "react";
import {
  Code,
  Database,
  Gauge,
  Layers,
  Puzzle,
  Rocket,
  Shield,
  Sparkles,
  Workflow,
  Cloud,
  Zap,
} from "lucide-react";

export interface LearningOutcomeItem {
  _key?: string;
  icon?: string;
  title: string;
  description?: string;
}

export interface LearningOutcomesProps {
  outcomes?: LearningOutcomeItem[];
}

// Map outcome icon names to Lucide icons
function renderOutcomeIcon(iconName?: string) {
  const normalized = iconName?.toLowerCase().trim() || "";

  switch (normalized) {
    case "layers":
      return <Layers className="w-5 h-5" strokeWidth={1.8} />;
    case "workflow":
      return <Workflow className="w-5 h-5" strokeWidth={1.8} />;
    case "gauge":
    case "speedometer":
      return <Gauge className="w-5 h-5" strokeWidth={1.8} />;
    case "rocket":
    case "deploy":
      return <Rocket className="w-5 h-5" strokeWidth={1.8} />;
    case "shield":
      return <Shield className="w-5 h-5" strokeWidth={1.8} />;
    case "puzzle":
      return <Puzzle className="w-5 h-5" strokeWidth={1.8} />;
    case "code":
      return <Code className="w-5 h-5" strokeWidth={1.8} />;
    case "sparkles":
      return <Sparkles className="w-5 h-5" strokeWidth={1.8} />;
    case "database":
    case "data":
      return <Database className="w-5 h-5" strokeWidth={1.8} />;
    case "cloud":
      return <Cloud className="w-5 h-5" strokeWidth={1.8} />;
    default:
      return <Zap className="w-5 h-5" strokeWidth={1.8} />;
  }
}

// Fallback outcomes matching reference UI if Sanity array is empty
const defaultOutcomes: LearningOutcomeItem[] = [
  {
    _key: "default-1",
    icon: "layers",
    title: "App Router Foundations",
    description:
      "Master the App Router, layouts, loading states, and nested routing.",
  },
  {
    _key: "default-2",
    icon: "database",
    title: "Data Fetching & Caching",
    description:
      "Fetch data efficiently and leverage caching for better performance.",
  },
  {
    _key: "default-3",
    icon: "gauge",
    title: "Performance Optimization",
    description:
      "Optimize rendering, assets, and bundle size for faster apps.",
  },
  {
    _key: "default-4",
    icon: "cloud",
    title: "Deployment & Scaling",
    description:
      "Deploy with confidence and scale your Next.js applications.",
  },
];

export function LearningOutcomes({ outcomes }: LearningOutcomesProps) {
  const items = outcomes && outcomes.length > 0 ? outcomes : defaultOutcomes;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 mb-10">
      <div className="rounded-2xl border border-neutral-200/80 bg-[#FAFCF9] p-6 sm:p-8 shadow-xs">
        <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal tracking-tight mb-6">
          What you&apos;ll learn
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {items.map((item, idx) => (
            <div
              key={item._key || `outcome-${idx}`}
              className="flex items-start gap-4 rounded-xl border border-neutral-200/80 bg-white p-5 shadow-xs hover:border-primary-300/80 transition-colors"
            >
              {/* Teal outlined icon container */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary-50 border border-primary-200/70 text-primary-600 flex items-center justify-center shrink-0">
                {renderOutcomeIcon(item.icon)}
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="font-semibold text-neutral-900 text-base leading-snug">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

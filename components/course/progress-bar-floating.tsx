"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import posthog from "posthog-js";

export interface ProgressBarFloatingProps {
  percentage?: number;
  continueHref?: string;
}

export function ProgressBarFloating({
  percentage = 35,
  continueHref = "#course-content",
}: ProgressBarFloatingProps) {
  return (
    <div className="sticky bottom-6 z-30 max-w-5xl mx-auto w-full px-4 mt-8 pointer-events-auto">
      <div className="rounded-2xl border border-neutral-200/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
        {/* Left: Your Progress Text */}
        <div className="flex items-center sm:block text-center sm:text-left shrink-0">
          <div className="text-[11px] sm:text-xs text-neutral-500 font-medium uppercase tracking-wider">
            Your Progress
          </div>
          <div className="text-sm sm:text-base font-semibold text-neutral-900">
            {percentage}% <span className="font-normal text-neutral-500">complete</span>
          </div>
        </div>

        {/* Center: Progress Bar Track */}
        <div className="flex-1 w-full max-w-md bg-neutral-200/80 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-primary-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>

        {/* Right: Continue Learning CTA */}
        <Link
          href={continueHref}
          onClick={() =>
            posthog.capture("continue_learning_clicked", {
              progress_percentage: percentage,
              destination: continueHref,
            })
          }
          className="w-full sm:w-auto h-11 px-5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

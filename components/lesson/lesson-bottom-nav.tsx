"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import posthog from "posthog-js";
import { formatDuration } from "@/lib/utils";

export interface FlatLessonItem {
  _id: string;
  title: string;
  slug: string;
  duration?: number;
  moduleTitle?: string;
}

export interface LessonBottomNavProps {
  prevLesson?: FlatLessonItem | null;
  nextLesson?: FlatLessonItem | null;
  currentLessonTitle: string;
}

export function LessonBottomNav({
  prevLesson,
  nextLesson,
  currentLessonTitle,
}: LessonBottomNavProps) {
  return (
    <div className="pt-10 pb-6 border-t border-neutral-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      {/* Previous Lesson */}
      {prevLesson ? (
        <Link
          href={`/lessons/${prevLesson.slug}`}
          onClick={() =>
            posthog.capture("lesson_bottom_nav_clicked", {
              direction: "previous",
              from_lesson: currentLessonTitle,
              to_lesson: prevLesson.title,
            })
          }
          className="flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-xl border border-neutral-200/90 bg-white hover:border-primary-300 hover:shadow-xs transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          <div className="h-9 px-3 rounded-lg bg-neutral-100 group-hover:bg-primary-50 text-neutral-700 group-hover:text-primary-600 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Previous Lesson</span>
          </div>
          <div className="text-left min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold text-neutral-800 truncate">
              {prevLesson.title}
            </h4>
            {prevLesson.duration && (
              <span className="text-[11px] text-neutral-400 font-medium block mt-0.5">
                {formatDuration(prevLesson.duration)}
              </span>
            )}
          </div>
        </Link>
      ) : (
        <div />
      )}

      {/* Next Lesson */}
      {nextLesson ? (
        <Link
          href={`/lessons/${nextLesson.slug}`}
          onClick={() =>
            posthog.capture("lesson_bottom_nav_clicked", {
              direction: "next",
              from_lesson: currentLessonTitle,
              to_lesson: nextLesson.title,
            })
          }
          className="flex items-center justify-end gap-3 p-3 sm:px-4 sm:py-3 rounded-xl border border-neutral-200/90 bg-white hover:border-primary-300 hover:shadow-xs transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          <div className="text-right min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold text-neutral-800 truncate">
              {nextLesson.title}
            </h4>
            {nextLesson.duration && (
              <span className="text-[11px] text-neutral-400 font-medium block mt-0.5">
                {formatDuration(nextLesson.duration)}
              </span>
            )}
          </div>
          <div className="h-9 px-3.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors shrink-0">
            <span>Next Lesson</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

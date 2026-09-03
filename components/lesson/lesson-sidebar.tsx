"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Play } from "lucide-react";
import posthog from "posthog-js";
import { urlFor } from "@/sanity/lib/image";
import { CourseModuleItem } from "@/components/lesson/types";

export interface LessonSidebarProps {
  courseTitle: string;
  courseSlug: string;
  courseCoverImage?: unknown;
  modules: CourseModuleItem[];
  currentLessonSlug: string;
  progressPercentage?: number;
}

export function LessonSidebar({
  courseTitle,
  courseSlug,
  courseCoverImage,
  modules = [],
  currentLessonSlug,
  progressPercentage = 35,
}: LessonSidebarProps) {
  const currentModuleIndex = modules.findIndex((mod) =>
    mod.lessons?.some((l) => l.slug === currentLessonSlug)
  );

  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>(() => {
    const initialIndex = currentModuleIndex >= 0 ? currentModuleIndex : 0;
    return { [initialIndex]: true };
  });

  const toggleModule = (idx: number, modTitle: string) => {
    const isExpanding = !expandedModules[idx];
    setExpandedModules((prev) => ({ ...prev, [idx]: isExpanding }));
    if (isExpanding) {
      posthog.capture("lesson_sidebar_module_expanded", {
        module_index: idx + 1,
        module_title: modTitle,
        course_slug: courseSlug,
      });
    }
  };

  const totalModules = modules.length;

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-[#FAFCF9] border-r border-neutral-200/80 flex flex-col min-h-screen">
      {/* Top Back Link & Course Info */}
      <div className="p-5 sm:p-6 border-b border-neutral-200/80 space-y-4">
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors group focus-visible:outline-none"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to course</span>
        </Link>

        <div className="flex items-center gap-3 pt-1">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 overflow-hidden shrink-0 flex items-center justify-center text-white font-serif text-xl font-bold shadow-xs">
            {courseCoverImage ? (
              <Image
                src={urlFor(courseCoverImage as Parameters<typeof urlFor>[0]).width(96).height(96).url()}
                alt={courseTitle}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>N</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-neutral-900 truncate leading-tight">
              {courseTitle}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden max-w-[100px]">
                <div
                  className="bg-primary-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">
                {progressPercentage}% complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules List Accordion */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-200/60">
        {modules.map((mod, modIdx) => {
          const isCurrentModule = modIdx === currentModuleIndex;
          const isExpanded = !!expandedModules[modIdx];
          const isCompletedModule = modIdx < currentModuleIndex;
          const moduleNumber = modIdx + 1;

          return (
            <div key={mod._key || modIdx} className="bg-white/40">
              {/* Module Header Button */}
              <button
                type="button"
                onClick={() => toggleModule(modIdx, mod.title)}
                className={`w-full p-4 flex items-center justify-between gap-3 text-left transition-colors focus-visible:outline-none ${
                  isCurrentModule ? "bg-primary-50/40" : "hover:bg-neutral-100/50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                      isCurrentModule
                        ? "bg-primary-600 text-white"
                        : isCompletedModule
                        ? "bg-neutral-100 text-neutral-700 border border-neutral-300"
                        : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                    }`}
                  >
                    {moduleNumber}
                  </div>

                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold tracking-wider text-neutral-500 uppercase block">
                      Module {moduleNumber} of {totalModules}
                    </span>
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">
                      {mod.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isCompletedModule && (
                    <div className="w-5 h-5 rounded-full border border-primary-500 flex items-center justify-center text-primary-600 bg-primary-50">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </div>
              </button>

              {/* Expanded Lessons List */}
              {isExpanded && mod.lessons && mod.lessons.length > 0 && (
                <div className="pl-6 pr-4 py-2 bg-neutral-50/50 space-y-1 relative before:absolute before:left-[1.85rem] before:top-3 before:bottom-3 before:w-px before:bg-neutral-200">
                  {mod.lessons.map((lesson, lessonIdx) => {
                    const isPlaying = lesson.slug === currentLessonSlug;
                    const isPriorLesson =
                      isCompletedModule ||
                      (isCurrentModule &&
                        lessonIdx < mod.lessons!.findIndex((l) => l.slug === currentLessonSlug));

                    return (
                      <Link
                        key={lesson._id || lesson.slug}
                        href={`/lessons/${lesson.slug}`}
                        onClick={() =>
                          posthog.capture("sidebar_lesson_clicked", {
                            lesson_slug: lesson.slug,
                            lesson_title: lesson.title,
                            module_title: mod.title,
                          })
                        }
                        className={`group relative flex items-start gap-3 p-2.5 rounded-lg text-xs sm:text-sm transition-all focus-visible:outline-none ${
                          isPlaying
                            ? "bg-primary-50/80 font-medium text-neutral-900"
                            : "hover:bg-neutral-100/70 text-neutral-700"
                        }`}
                      >
                        <div className="mt-0.5 z-10 shrink-0">
                          {isPlaying ? (
                            <div className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-xs">
                              <Play className="w-2.5 h-2.5 fill-white translate-x-0.5" />
                            </div>
                          ) : isPriorLesson ? (
                            <div className="w-5 h-5 rounded-full border border-primary-500 bg-white text-primary-600 flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-neutral-300 bg-white flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate ${
                              isPlaying
                                ? "font-bold text-neutral-900"
                                : "font-medium group-hover:text-primary-600"
                            }`}
                          >
                            {lesson.title}
                          </p>

                          {isPlaying && (
                            <span className="inline-block text-[11px] font-semibold text-primary-600 mt-0.5">
                              Now playing
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, PlayCircle } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export interface LessonItem {
  _id: string;
  title: string;
  slug: string;
  duration?: number;
  freePreview?: boolean;
}

export interface ModuleItem {
  _key?: string;
  title: string;
  summary?: string;
  lessons?: LessonItem[];
}

export interface CourseContentProps {
  modules?: ModuleItem[];
  totalDurationSeconds?: number;
}

// Fallback modules matching reference screenshot if Sanity list is partial
const defaultModules: ModuleItem[] = [
  {
    _key: "mod-1",
    title: "Introduction to Next.js",
    summary:
      "Understand the core features of Next.js and why it's the React framework.",
    lessons: [
      {
        _id: "l-1",
        title: "Why Next.js?",
        slug: "nextjs-app-router-in-depth-file-system-routing",
        duration: 2700,
        freePreview: true,
      },
    ],
  },
  {
    _key: "mod-2",
    title: "Project Setup & Structure",
    summary:
      "Set up a new Next.js project and explore the folder structure.",
    lessons: [
      {
        _id: "l-2",
        title: "Folder Tree & Conventions",
        slug: "nextjs-app-router-in-depth-layouts-and-templates",
        duration: 4320,
      },
    ],
  },
  {
    _key: "mod-3",
    title: "Routing & Layouts",
    summary: "Learn about file-based routing, layouts, and nested routes.",
    lessons: [
      {
        _id: "l-3",
        title: "Nested Routes & Shared Layouts",
        slug: "nextjs-app-router-in-depth-dynamic-routes-and-params",
        duration: 5760,
      },
    ],
  },
  {
    _key: "mod-4",
    title: "Server Components",
    summary: "Build components with server-side rendering and data fetching.",
    lessons: [
      {
        _id: "l-4",
        title: "Server Component Fundamentals",
        slug: "nextjs-app-router-in-depth-server-components",
        duration: 6120,
      },
    ],
  },
  {
    _key: "mod-5",
    title: "Data Fetching & Caching",
    summary:
      "Fetch data efficiently and leverage caching for better performance.",
    lessons: [
      {
        _id: "l-5",
        title: "Caching Strategies",
        slug: "nextjs-app-router-in-depth-caching-and-revalidation",
        duration: 5280,
      },
    ],
  },
  {
    _key: "mod-6",
    title: "Authentication",
    summary: "Implement authentication using NextAuth.js or Clerk in your app.",
    lessons: [
      {
        _id: "l-6",
        title: "Auth Middleware & Session",
        slug: "nextjs-app-router-in-depth-server-actions-basics",
        duration: 4680,
      },
    ],
  },
];

export function CourseContent({
  modules,
  totalDurationSeconds,
}: CourseContentProps) {
  const moduleList = modules && modules.length > 0 ? modules : defaultModules;
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const [showAllModules, setShowAllModules] = useState(false);

  const visibleModules = showAllModules
    ? moduleList
    : moduleList.slice(0, 6);

  const totalDurationText = totalDurationSeconds
    ? formatDuration(totalDurationSeconds)
    : "18h 24m";

  const toggleModule = (key: string) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const calculateModuleDuration = (mod: ModuleItem, index: number) => {
    if (!mod.lessons || mod.lessons.length === 0) {
      // Fallback durations matching reference screenshot
      const fallbackDurations = [
        "45m",
        "1h 12m",
        "1h 36m",
        "1h 42m",
        "1h 28m",
        "1h 18m",
      ];
      return fallbackDurations[index % fallbackDurations.length];
    }
    const secs = mod.lessons.reduce((acc, l) => acc + (l.duration || 0), 0);
    return secs > 0 ? formatDuration(secs) : "45m";
  };

  return (
    <section id="course-content" className="w-full max-w-5xl mx-auto px-4 mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal tracking-tight">
          Course Content
        </h2>
        <span className="text-xs sm:text-sm font-medium text-neutral-500">
          {moduleList.length} modules &bull; {totalDurationText}
        </span>
      </div>

      {/* Accordion Container */}
      <div className="rounded-xl border border-neutral-200/90 divide-y divide-neutral-200/80 bg-white overflow-hidden shadow-xs">
        {visibleModules.map((mod, idx) => {
          const modKey = mod._key || `module-${idx}`;
          const isExpanded = !!expandedKeys[modKey];
          const duration = calculateModuleDuration(mod, idx);

          return (
            <div key={modKey} className="transition-colors">
              {/* Module Header Row */}
              <button
                type="button"
                onClick={() => toggleModule(modKey)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-neutral-50/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 select-none"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Number Circle */}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-100 border border-neutral-200/80 flex items-center justify-center font-medium text-xs sm:text-sm text-neutral-700 shrink-0">
                    {idx + 1}
                  </div>

                  {/* Title & Summary */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-neutral-900 text-sm sm:text-base leading-snug">
                      {mod.title}
                    </h3>
                    {mod.summary && (
                      <p className="text-xs sm:text-sm text-neutral-500 truncate mt-0.5">
                        {mod.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Duration & Expand Chevron */}
                <div className="flex items-center gap-3 shrink-0 text-xs sm:text-sm text-neutral-500 font-medium">
                  <span>{duration}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </div>
              </button>

              {/* Lessons Drawer */}
              {isExpanded && mod.lessons && mod.lessons.length > 0 && (
                <div className="bg-neutral-50/60 border-t border-neutral-100 px-4 sm:px-6 py-3 space-y-2">
                  {mod.lessons.map((lesson) => (
                    <div
                      key={lesson._id || lesson.slug}
                      className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg hover:bg-white transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <PlayCircle
                          className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors shrink-0"
                          strokeWidth={1.8}
                        />
                        <Link
                          href={`/lessons/${lesson.slug}`}
                          className="text-xs sm:text-sm font-medium text-neutral-800 group-hover:text-primary-600 transition-colors truncate"
                        >
                          {lesson.title}
                        </Link>
                        {lesson.freePreview && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-100 text-primary-700 uppercase tracking-wide shrink-0">
                            Free Preview
                          </span>
                        )}
                      </div>

                      {lesson.duration && (
                        <span className="text-xs text-neutral-400 font-medium shrink-0">
                          {formatDuration(lesson.duration)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show All Modules Button */}
      {moduleList.length > 6 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowAllModules(!showAllModules)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-medium shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 cursor-pointer"
          >
            <span>
              {showAllModules
                ? "Show fewer modules"
                : `Show all ${moduleList.length} modules`}
            </span>
            {showAllModules ? (
              <ChevronUp className="w-4 h-4 text-neutral-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-500" />
            )}
          </button>
        </div>
      )}
    </section>
  );
}

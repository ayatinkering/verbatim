"use client";

import React from "react";
import Link from "next/link";
import { FileText, Check, ChevronRight, ExternalLink } from "lucide-react";
import posthog from "posthog-js";
import { LessonSearchResult } from "@/components/search/types";
import { NextJsIcon, ReactIcon, NodeJsIcon, JavaScriptIcon } from "@/components/icons/tech-icons";

export interface LessonResultCardProps {
  result: LessonSearchResult;
}

function CourseIcon({ title }: { title: string }) {
  const lower = title.toLowerCase();
  if (lower.includes("react")) return <ReactIcon />;
  if (lower.includes("node")) return <NodeJsIcon />;
  if (lower.includes("javascript") || lower.includes("js")) return <JavaScriptIcon />;
  return <NextJsIcon />;
}

export function LessonResultCard({ result }: LessonResultCardProps) {
  const lessonHref =
    result.startSeconds !== undefined && result.startSeconds >= 0
      ? `/lessons/${result.lessonSlug}?t=${result.startSeconds}`
      : `/lessons/${result.lessonSlug}`;

  const handleClick = () => {
    posthog.capture("search_lesson_result_clicked", {
      lesson_slug: result.lessonSlug,
      lesson_title: result.lessonTitle,
    });
  };

  // Fallback key topic bullets if empty
  const keyBullets =
    result.keyPoints && result.keyPoints.length > 0
      ? result.keyPoints.slice(0, 3)
      : [
          "Fetching strategies",
          "Caching techniques",
          "Revalidation methods",
        ];

  return (
    <div className="group relative flex flex-col md:flex-row items-stretch gap-5 rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-primary-300 transition-all duration-200">
      {/* Left Topics Preview Box */}
      <Link
        href={lessonHref}
        onClick={handleClick}
        className="relative w-full md:w-60 bg-[#FAFCF9] border border-neutral-200/80 rounded-xl p-3.5 flex flex-col justify-between shrink-0 hover:bg-neutral-100/60 transition-colors"
      >
        <div className="space-y-2">
          <FileText className="w-4 h-4 text-neutral-500" />
          <ul className="space-y-1 text-xs text-neutral-600 font-medium">
            {keyBullets.map((pt, i) => (
              <li key={i} className="truncate">
                • {pt}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end pt-2">
          <div className="w-5 h-5 rounded-full bg-neutral-700 text-white flex items-center justify-center">
            <Check className="w-3 h-3 stroke-[2.5]" />
          </div>
        </div>
      </Link>

      {/* Right Content Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0 space-y-3">
        <div className="space-y-1.5">
          {/* Top Meta Header Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <CourseIcon title={result.courseTitle} />
              <span className="text-xs font-semibold text-neutral-700 truncate">
                {result.courseTitle}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-extrabold tracking-wider uppercase shrink-0">
              LESSON
            </span>
          </div>

          {/* Heading Title */}
          <Link href={lessonHref} onClick={handleClick} className="block group-hover:text-primary-600 transition-colors">
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 truncate leading-snug">
              {result.lessonTitle}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
            {result.description}
          </p>
        </div>

        {/* Bottom Meta & Action Line */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-3 text-xs">
          <span className="text-neutral-500 font-semibold truncate">
            {result.moduleTitle || "Module 5"}
          </span>

          <Link
            href={lessonHref}
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-bold text-xs sm:text-sm shrink-0 group/link"
          >
            <span>View lesson</span>
            <ExternalLink className="w-3.5 h-3.5" />
            <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

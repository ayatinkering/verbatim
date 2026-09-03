"use client";

import React from "react";
import Link from "next/link";
import { Play, FileText, Folder, ChevronRight } from "lucide-react";
import posthog from "posthog-js";
import { VideoSearchResult } from "@/components/search/types";
import { NextJsIcon, ReactIcon, NodeJsIcon, JavaScriptIcon } from "@/components/icons/tech-icons";

export interface VideoResultCardProps {
  result: VideoSearchResult;
}

function CourseIcon({ title }: { title: string }) {
  const lower = title.toLowerCase();
  if (lower.includes("react")) return <ReactIcon />;
  if (lower.includes("node")) return <NodeJsIcon />;
  if (lower.includes("javascript") || lower.includes("js")) return <JavaScriptIcon />;
  return <NextJsIcon />;
}

export function VideoResultCard({ result }: VideoResultCardProps) {
  const lessonHref = `/lessons/${result.lessonSlug}?t=${result.startSeconds}`;

  const handleClick = () => {
    posthog.capture("search_video_result_clicked", {
      lesson_slug: result.lessonSlug,
      lesson_title: result.lessonTitle,
      start_seconds: result.startSeconds,
      timestamp_label: result.timestampLabel,
    });
  };

  return (
    <div className="group relative flex flex-col md:flex-row items-stretch gap-5 rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-primary-300 transition-all duration-200">
      {/* Left Thumbnail Media Container */}
      <Link
        href={lessonHref}
        onClick={handleClick}
        className="relative w-full md:w-60 aspect-video rounded-xl bg-neutral-950 border border-neutral-800/80 overflow-hidden shrink-0 flex items-center justify-center group/thumb"
      >
        {/* Abstract Dark Code / Graphic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 opacity-90" />

        {/* Center Play Overlay Icon */}
        <div className="z-10 w-11 h-11 rounded-full bg-white/90 group-hover/thumb:bg-primary-600 text-neutral-900 group-hover/thumb:text-white flex items-center justify-center shadow-lg transition-all duration-200 transform group-hover/thumb:scale-105">
          <Play className="w-5 h-5 fill-current translate-x-0.5" />
        </div>

        {/* Bottom Right Timestamp Badge */}
        <div className="absolute right-2.5 bottom-2.5 z-10 bg-neutral-900/90 text-white text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md shadow-xs">
          {result.timestampLabel}
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
            <span className="px-2.5 py-0.5 rounded-md bg-[#FFF0EC] text-primary-600 text-[10px] font-extrabold tracking-wider uppercase shrink-0">
              VIDEO
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
          <div className="flex items-center gap-2 text-neutral-500 font-medium truncate">
            <span className="inline-flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              <span>{result.lessonLabel.split(" in ")[0]}</span>
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 truncate">
              <Folder className="w-3.5 h-3.5 text-neutral-400" />
              <span className="truncate">{result.moduleTitle || "Data Fetching & Caching"}</span>
            </span>
          </div>

          <Link
            href={lessonHref}
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-bold text-xs sm:text-sm shrink-0 group/link"
          >
            <div className="w-5 h-5 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
              <Play className="w-2.5 h-2.5 fill-primary-600 translate-x-0.5" />
            </div>
            <span>Watch from {result.timestampLabel}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

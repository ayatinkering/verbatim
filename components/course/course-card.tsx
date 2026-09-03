"use client";

import React from "react";
import Link from "next/link";
import { BarChart2, Clock, Layers } from "lucide-react";
import posthog from "posthog-js";

export interface CourseCardProps {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  level?: string;
  moduleCount: number;
  popular?: boolean;
  icon: React.ReactNode;
}

export function CourseCard({
  id,
  slug,
  title,
  summary,
  level,
  moduleCount,
  popular,
  icon,
}: CourseCardProps) {
  const formattedLevel = level
    ? level.charAt(0).toUpperCase() + level.slice(1)
    : "Intermediate";

  const handleClick = () => {
    posthog.capture("course_card_clicked", {
      course_id: id,
      course_slug: slug,
      course_title: title,
      course_level: level ?? "Intermediate",
      is_popular: popular ?? false,
    });
  };

  return (
    <Link
      href={`/courses/${slug}`}
      onClick={handleClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary-300/80 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
    >
      <div className="space-y-3.5">
        {/* Top Row: Icon & Optional Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="shrink-0">{icon}</div>
          {popular && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-primary-50 text-primary-700 border border-primary-200/70">
              Popular
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-serif text-xl sm:text-2xl text-neutral-900 font-normal leading-snug group-hover:text-primary-600 transition-colors">
          {title}
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-neutral-500 line-clamp-3 leading-relaxed">
          {summary || "Build scalable, high-performance web applications with modern best practices."}
        </p>
      </div>

      {/* Footer Stats Row */}
      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] sm:text-xs text-neutral-500 font-medium">
        <span className="inline-flex items-center gap-1.5 text-neutral-600">
          <BarChart2 className="w-3.5 h-3.5 text-neutral-400" strokeWidth={1.8} />
          {formattedLevel}
        </span>
        <span className="text-neutral-200">•</span>
        <span className="inline-flex items-center gap-1.5 text-neutral-600">
          <Clock className="w-3.5 h-3.5 text-neutral-400" strokeWidth={1.8} />
          18h 24m
        </span>
        <span className="text-neutral-200">•</span>
        <span className="inline-flex items-center gap-1.5 text-neutral-600">
          <Layers className="w-3.5 h-3.5 text-neutral-400" strokeWidth={1.8} />
          {moduleCount} modules
        </span>
      </div>
    </Link>
  );
}

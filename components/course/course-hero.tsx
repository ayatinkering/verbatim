"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart2, Bookmark, Clock, Layers, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { urlFor } from "@/sanity/lib/image";
import { formatDuration, formatStudentCount } from "@/lib/utils";
import type { SanityImage } from "@/sanity/lib/types";

export interface CourseHeroProps {
  course: {
    _id: string;
    title: string;
    slug: string;
    summary?: string;
    coverImage?: SanityImage;
    level?: string;
    popular?: boolean;
    studentCount?: number;
  };
  totalModules: number;
  totalDurationSeconds: number;
  firstLessonSlug?: string;
}

export function CourseHero({
  course,
  totalModules,
  totalDurationSeconds,
  firstLessonSlug,
}: CourseHeroProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const formattedLevel = course.level
    ? course.level.charAt(0).toUpperCase() + course.level.slice(1)
    : "Intermediate";

  // Use screenshot duration default (18h 24m) if totalDurationSeconds is not provided or 0
  const formattedDuration =
    totalDurationSeconds > 0
      ? formatDuration(totalDurationSeconds)
      : "18h 24m";

  const formattedStudents = course.studentCount
    ? formatStudentCount(course.studentCount)
    : "2.1k students";

  const continueHref = firstLessonSlug
    ? `/lessons/${firstLessonSlug}`
    : "#course-content";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-4 sm:pt-6 pb-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "All Courses", href: "/courses" },
          { label: course.title },
        ]}
        className="mb-6 sm:mb-8"
      />

      {/* Main Hero Container */}
      <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-8 lg:gap-12">
        {/* Left: Course Thumbnail / Cover Art */}
        <div className="w-full md:w-auto flex justify-center shrink-0">
          <div className="w-48 h-48 sm:w-60 sm:h-60 lg:w-64 lg:h-64 rounded-2xl bg-neutral-950 p-6 flex items-center justify-center relative shadow-md border border-neutral-800 overflow-hidden shrink-0 group">
            {course.coverImage ? (
              /* If coverImage has asset, render image */
              <Image
                src={urlFor(course.coverImage).width(600).height(600).url()}
                alt={course.title}
                width={300}
                height={300}
                className="w-full h-full object-cover rounded-xl"
                unoptimized
              />
            ) : (
              /* Stylized 'N' graphic icon matching design reference */
              <div className="relative w-full h-full flex items-center justify-center">
                <svg className="w-32 h-32 sm:w-40 sm:h-40" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <linearGradient id="silver-diagonal" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#D4D4D8" />
                      <stop offset="100%" stopColor="#71717A" />
                    </linearGradient>
                  </defs>
                  {/* Left vertical bar */}
                  <rect x="22" y="20" width="12" height="60" fill="white" />
                  {/* Right vertical bar */}
                  <rect x="66" y="20" width="12" height="60" fill="white" />
                  {/* Diagonal line with metallic slash effect */}
                  <polygon
                    points="22,20 34,20 78,80 66,80"
                    fill="url(#silver-diagonal)"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Right: Course Header Info & Actions */}
        <div className="flex-1 space-y-4 sm:space-y-5">
          {/* Badge */}
          {course.popular !== false && (
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-primary-50 text-primary-700 border border-primary-200/70">
                Popular
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-900 tracking-tight leading-[1.12]">
            {course.title}
          </h1>

          {/* Summary */}
          <p className="text-neutral-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
            {course.summary ||
              "Build scalable, high-performance web applications with Next.js, best practices, and production-ready deployment strategies."}
          </p>

          {/* Meta Stats Row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs sm:text-sm text-neutral-600 font-medium pt-1">
            <span className="inline-flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
              {formattedLevel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
              {formattedDuration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
              {totalModules} modules
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
              {formattedStudents}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 sm:pt-3">
            <Link
              href={continueHref}
              className="h-11 sm:h-12 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              <span>Continue Learning</span>
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>

            <button
              type="button"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`h-11 sm:h-12 px-5 rounded-xl border border-neutral-200/90 font-medium text-sm sm:text-base transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                isBookmarked
                  ? "bg-primary-50 text-primary-700 border-primary-300"
                  : "bg-white hover:bg-neutral-50 text-neutral-800 shadow-xs"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isBookmarked
                    ? "fill-primary-600 text-primary-600"
                    : "text-neutral-500"
                }`}
                strokeWidth={1.8}
              />
              <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { BarChart2, Bookmark, Clock, Users } from "lucide-react";
import posthog from "posthog-js";
import { Navbar } from "@/components/nav/navbar";
import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { LessonSidebar } from "@/components/lesson/lesson-sidebar";
import { VideoPlayer } from "@/components/lesson/video-player";
import { LessonContent } from "@/components/lesson/lesson-content";
import { LessonBottomNav, FlatLessonItem } from "@/components/lesson/lesson-bottom-nav";
import { formatDuration, formatStudentCount } from "@/lib/utils";
import { SanityLessonDocument } from "@/components/lesson/types";

export interface LessonViewProps {
  lesson: SanityLessonDocument;
  startSeconds?: number;
}

export function LessonView({ lesson, startSeconds }: LessonViewProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const course = lesson.course;
  const courseTitle = course?.title || "Next.js for Production";
  const courseSlug = course?.slug || "nextjs-for-production";
  const modules = course?.modules || [];

  const allLessons: FlatLessonItem[] = [];
  let currentModuleTitle = "";
  let currentModuleIndex = 0;
  let currentLessonInModuleIndex = 0;

  modules.forEach((mod, modIdx) => {
    mod.lessons?.forEach((l, lIdx) => {
      const item: FlatLessonItem = {
        _id: l._id,
        title: l.title,
        slug: l.slug,
        duration: l.duration,
        moduleTitle: mod.title,
      };
      allLessons.push(item);

      if (l.slug === lesson.slug) {
        currentModuleTitle = mod.title;
        currentModuleIndex = modIdx + 1;
        currentLessonInModuleIndex = lIdx + 1;
      }
    });
  });

  const currentLessonGlobalIndex = allLessons.findIndex((l) => l.slug === lesson.slug);
  const prevLesson = currentLessonGlobalIndex > 0 ? allLessons[currentLessonGlobalIndex - 1] : null;
  const nextLesson =
    currentLessonGlobalIndex >= 0 && currentLessonGlobalIndex < allLessons.length - 1
      ? allLessons[currentLessonGlobalIndex + 1]
      : null;

  const lessonPillLabel =
    currentModuleIndex > 0 && currentLessonInModuleIndex > 0
      ? `LESSON ${currentModuleIndex}.${currentLessonInModuleIndex}`
      : "LESSON 5.1";

  const handleBookmarkToggle = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    posthog.capture("lesson_bookmarked", {
      lesson_id: lesson._id,
      lesson_slug: lesson.slug,
      lesson_title: lesson.title,
      bookmarked: nextState,
    });
  };

  const breadcrumbs = [
    { label: "All Courses", href: "/courses" },
    { label: courseTitle, href: `/courses/${courseSlug}` },
    { label: currentModuleTitle || courseTitle, href: `/courses/${courseSlug}` },
    { label: lesson.title, href: `/lessons/${lesson.slug}`, active: true },
  ];

  const durationText = lesson.duration ? formatDuration(lesson.duration) : "1h 28m";
  const studentCountText = lesson.studentCount ? `${formatStudentCount(lesson.studentCount)} students` : "3,426 students";

  return (
    <div className="min-h-screen bg-[#FAFCF9] flex flex-col font-sans text-neutral-900">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Left Course Sidebar */}
        <LessonSidebar
          courseTitle={courseTitle}
          courseSlug={courseSlug}
          courseCoverImage={course?.coverImage}
          modules={modules}
          currentLessonSlug={lesson.slug}
          progressPercentage={35}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto w-full space-y-8">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Header Title Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-md bg-[#FFF0EC] text-primary-600 text-xs font-bold tracking-wider uppercase">
                  {lessonPillLabel}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
                  {lesson.title}
                </h1>
              </div>

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={handleBookmarkToggle}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                  isBookmarked
                    ? "bg-primary-50 text-primary-600 border-primary-300 shadow-xs"
                    : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:text-neutral-800"
                }`}
                aria-label="Bookmark lesson"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-primary-600" : ""}`} />
              </button>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
              Learn how Next.js handles data fetching and caching in both Server and Client Components.
            </p>

            {/* Meta Stats Row */}
            <div className="flex flex-wrap items-center gap-6 pt-1 text-xs sm:text-sm text-neutral-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>{durationText}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-neutral-400" />
                <span>Intermediate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-neutral-400" />
                <span>{studentCountText}</span>
              </div>
            </div>
          </div>

          {/* Video Player */}
          <VideoPlayer
            videoUrl={lesson.videoUrl}
            title={lesson.title}
            startSeconds={startSeconds}
          />

          {/* Lesson Content & Notes Tabs */}
          <LessonContent
            keyPoints={lesson.keyPoints}
            proTip={lesson.proTip}
            resources={lesson.resources}
            notes={lesson.notes}
            lessonTitle={lesson.title}
          />

          {/* Bottom Lesson Navigation */}
          <LessonBottomNav
            prevLesson={prevLesson}
            nextLesson={nextLesson}
            currentLessonTitle={lesson.title}
          />
        </main>
      </div>
    </div>
  );
}

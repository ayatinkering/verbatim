import React from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/nav/navbar";
import { CourseHero } from "@/components/course/course-hero";
import { LearningOutcomes } from "@/components/course/learning-outcomes";
import { CourseContent } from "@/components/course/course-content";
import { ProgressBarFloating } from "@/components/course/progress-bar-floating";
import { getCourseBySlug, getCourses } from "@/sanity/lib/fetch";
import type { SanityCourse, SanityLesson, SanityModule } from "@/sanity/lib/types";

export interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;

  // 1. Fetch course by slug from Sanity
  let rawCourse = (await getCourseBySlug(slug)) as SanityCourse | null;

  // 2. If requested slug is "nextjs-for-production" or course not found, try fallback
  if (!rawCourse) {
    if (slug === "nextjs-for-production") {
      rawCourse = (await getCourseBySlug("nextjs-app-router-in-depth")) as SanityCourse | null;
    }
  }

  // 3. Final fallback: pick first course document if available
  if (!rawCourse) {
    const allCourses = (await getCourses()) as SanityCourse[] | null;
    if (Array.isArray(allCourses) && allCourses.length > 0) {
      rawCourse = (await getCourseBySlug(allCourses[0].slug)) as SanityCourse | null;
    }
  }

  // If no course exists at all in database, 404
  if (!rawCourse) {
    notFound();
  }

  const course = rawCourse;

  // Compute total statistics across modules & lessons
  const modules: SanityModule[] = Array.isArray(course.modules) ? course.modules : [];
  let totalDurationSeconds = 0;
  let firstLessonSlug: string | undefined = undefined;

  modules.forEach((mod: SanityModule) => {
    if (Array.isArray(mod.lessons)) {
      mod.lessons.forEach((lesson: SanityLesson) => {
        if (!firstLessonSlug && lesson.slug) {
          firstLessonSlug = lesson.slug;
        }
        if (typeof lesson.duration === "number") {
          totalDurationSeconds += lesson.duration;
        }
      });
    }
  });

  return (
    <div className="min-h-screen bg-[#FAFCF9] text-neutral-900 flex flex-col selection:bg-primary-100 selection:text-primary-800">
      {/* Top Navigation */}
      <Navbar
        items={[
          { label: "Courses", href: "/courses", active: true },
          { label: "My Learning", href: "/my-learning", active: false },
        ]}
      />

      {/* Main Page Layout */}
      <main className="flex-1 flex flex-col pb-12">
        {/* Course Hero Header */}
        <CourseHero
          course={{
            _id: course._id || "course-1",
            title: slug === "nextjs-for-production" ? "Next.js for Production" : (course.title || "Next.js for Production"),
            slug: course.slug || slug,
            summary: course.summary,
            coverImage: course.coverImage,
            level: course.level,
            popular: course.popular,
            studentCount: course.studentCount,
          }}
          totalModules={modules.length}
          totalDurationSeconds={totalDurationSeconds}
          firstLessonSlug={firstLessonSlug}
        />

        {/* What You'll Learn Section */}
        <LearningOutcomes outcomes={course.learningOutcomes} />

        {/* Course Content Accordion */}
        <CourseContent
          modules={modules}
          totalDurationSeconds={totalDurationSeconds}
        />

        {/* Floating Bottom Progress Card */}
        <ProgressBarFloating
          percentage={35}
          continueHref={firstLessonSlug ? `/lessons/${firstLessonSlug}` : "#course-content"}
        />
      </main>
    </div>
  );
}

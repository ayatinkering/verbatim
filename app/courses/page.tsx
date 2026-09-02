import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BarChart2, Clock, Layers } from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { NextJsIcon, DockerIcon, TypeScriptIcon } from "@/components/icons/tech-icons";
import { getCourses } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import type { SanityCourse } from "@/sanity/lib/types";

// Helper to select icon based on slug/title or cover image
function renderCourseIcon(course: SanityCourse) {
  const slug = (course.slug || "").toLowerCase();
  const title = (course.title || "").toLowerCase();

  if (slug.includes("next") || title.includes("next")) {
    return <NextJsIcon />;
  }
  if (slug.includes("docker") || title.includes("docker") || title.includes("kubernetes")) {
    return <DockerIcon />;
  }
  if (slug.includes("typescript") || title.includes("typescript") || title.includes("ts")) {
    return <TypeScriptIcon />;
  }

  if (course.coverImage?.asset?._ref) {
    return (
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] overflow-hidden bg-neutral-900 shrink-0">
        <Image
          src={urlFor(course.coverImage).width(120).height(120).url()}
          alt={course.title}
          width={56}
          height={56}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
    );
  }

  return <NextJsIcon />;
}

// Default fallback list matching reference courses if Sanity returns empty array
const fallbackCourses: SanityCourse[] = [
  {
    _id: "course-1",
    _type: "course",
    title: "Next.js for Production",
    slug: "nextjs-app-router-in-depth",
    summary:
      "Build scalable, high-performance web applications with Next.js, best practices, and production-ready deployment strategies.",
    level: "Intermediate",
    popular: true,
    studentCount: 2100,
    moduleCount: 12,
    lessonCount: 28,
  },
  {
    _id: "course-2",
    _type: "course",
    title: "Docker Essentials",
    slug: "devops-with-docker-and-kubernetes",
    summary:
      "Containerize applications and streamline your development and deployment workflows using Docker and Kubernetes.",
    level: "Beginner",
    popular: false,
    studentCount: 1400,
    moduleCount: 8,
    lessonCount: 18,
  },
  {
    _id: "course-3",
    _type: "course",
    title: "TypeScript Deep Dive",
    slug: "typescript-for-application-developers",
    summary:
      "Go beyond the basics and write safer, more expressive, and highly maintainable application code with TypeScript.",
    level: "Intermediate",
    popular: false,
    studentCount: 3200,
    moduleCount: 10,
    lessonCount: 24,
  },
];

export default async function CoursesIndexPage() {
  const sanityCourses = (await getCourses()) as SanityCourse[] | null;
  const courses =
    Array.isArray(sanityCourses) && sanityCourses.length > 0
      ? sanityCourses
      : fallbackCourses;

  return (
    <div className="min-h-screen bg-[#FAFCF9] text-neutral-900 flex flex-col selection:bg-primary-100 selection:text-primary-800">
      {/* Top Navbar */}
      <Navbar
        items={[
          { label: "Courses", href: "/courses", active: true },
          { label: "My Learning", href: "/my-learning", active: false },
        ]}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto px-4 w-full pt-6 sm:pt-10 pb-16">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10 space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-900 tracking-tight">
            All Courses
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Explore our collection of production-grade courses on modern web development, architecture, and engineering best practices.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {courses.map((course) => {
            const formattedLevel = course.level
              ? course.level.charAt(0).toUpperCase() + course.level.slice(1)
              : "Intermediate";

            const moduleCount = course.moduleCount ?? course.modules?.length ?? 12;

            return (
              <Link
                key={course._id || course.slug}
                href={`/courses/${course.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary-300/80 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              >
                <div className="space-y-3.5">
                  {/* Top Row: Icon & Optional Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="shrink-0">{renderCourseIcon(course)}</div>
                    {course.popular && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-primary-50 text-primary-700 border border-primary-200/70">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-xl sm:text-2xl text-neutral-900 font-normal leading-snug group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h2>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-500 line-clamp-3 leading-relaxed">
                    {course.summary ||
                      "Build scalable, high-performance web applications with modern best practices."}
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
          })}
        </div>
      </main>
    </div>
  );
}

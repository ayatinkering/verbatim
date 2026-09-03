import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/nav/navbar";
import { NextJsIcon, DockerIcon, TypeScriptIcon } from "@/components/icons/tech-icons";
import { CourseCard } from "@/components/course/course-card";
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
            const moduleCount = course.moduleCount ?? course.modules?.length ?? 12;

            return (
              <CourseCard
                key={course._id || course.slug}
                id={course._id}
                slug={course.slug}
                title={course.title}
                summary={course.summary}
                level={course.level}
                moduleCount={moduleCount}
                popular={course.popular}
                icon={renderCourseIcon(course)}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

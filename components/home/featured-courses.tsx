"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BarChart2, Clock, Layers, Star } from "lucide-react";
import posthog from "posthog-js";
import { NextJsIcon, DockerIcon, TypeScriptIcon } from "@/components/icons/tech-icons";

export interface CourseItem {
  id: string;
  slug: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  level: string;
  duration: string;
  modulesCount: number;
}

export function FeaturedCourses() {
  const courses: CourseItem[] = [
    {
      id: "nextjs-production",
      slug: "nextjs-app-router-in-depth",
      icon: <NextJsIcon />,
      title: "Next.js for Production",
      description:
        "Build scalable, high-performance web applications with Next.js.",
      level: "Intermediate",
      duration: "18h 24m",
      modulesCount: 12,
    },
    {
      id: "docker-essentials",
      slug: "devops-with-docker-and-kubernetes",
      icon: <DockerIcon />,
      title: "Docker Essentials",
      description:
        "Containerize applications and streamline your development workflow.",
      level: "Beginner",
      duration: "10h 12m",
      modulesCount: 8,
    },
    {
      id: "typescript-deep-dive",
      slug: "typescript-for-application-developers",
      icon: <TypeScriptIcon />,
      title: "TypeScript Deep Dive",
      description:
        "Go beyond the basics and write safer, more expressive code.",
      level: "Intermediate",
      duration: "14h 36m",
      modulesCount: 10,
    },
  ];

  return (
    <section className="pt-2 sm:pt-4 pb-8 max-w-5xl mx-auto px-4 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 pb-1">
        <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal tracking-tight">
          All Courses
        </h2>
        <Link
          href="/courses"
          onClick={() => posthog.capture("view_all_courses_clicked", { source: "home_featured" })}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors group"
        >
          <span>View all courses</span>
          <ArrowRight
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-primary-500"
            strokeWidth={2}
          />
        </Link>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            onClick={() =>
              posthog.capture("featured_course_clicked", {
                course_id: course.id,
                course_slug: course.slug,
                course_title: course.title,
                course_level: course.level,
              })
            }
            className="group relative flex flex-col justify-between rounded-[16px] border border-neutral-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary-300/80 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            <div className="space-y-3">
              <div className="shrink-0">{course.icon}</div>
              <h3 className="font-serif text-lg sm:text-xl text-neutral-900 group-hover:text-primary-600 transition-colors leading-snug">
                {course.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 line-clamp-3 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-[11px] sm:text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1 font-medium text-neutral-600">
                <BarChart2 className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
                {course.level}
              </span>
              <span className="text-neutral-200">•</span>
              <span className="inline-flex items-center gap-1 font-medium text-neutral-600">
                <Clock className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
                {course.duration}
              </span>
              <span className="text-neutral-200">•</span>
              <span className="inline-flex items-center gap-1 font-medium text-neutral-600">
                <Layers className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
                {course.modulesCount} modules
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Callout Divider */}
      <div className="mt-10 sm:mt-12 pt-2 flex items-center justify-center gap-4 text-neutral-400">
        <div className="h-[1px] bg-neutral-200/80 flex-1 max-w-xs" />
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-neutral-600">
          <Star className="w-3.5 h-3.5 text-primary-500 fill-primary-100" />
          <span>New courses and lessons added every week.</span>
        </div>
        <div className="h-[1px] bg-neutral-200/80 flex-1 max-w-xs" />
      </div>
    </section>
  );
}

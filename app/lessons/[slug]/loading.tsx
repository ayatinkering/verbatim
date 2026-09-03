import React from "react";
import { Navbar } from "@/components/nav/navbar";

export default function LessonLoading() {
  return (
    <div className="min-h-screen bg-[#FAFCF9] flex flex-col font-sans text-neutral-900 animate-pulse">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Left Sidebar Skeleton */}
        <aside className="w-full lg:w-80 border-r border-neutral-200/80 bg-white p-6 space-y-6 shrink-0 hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-neutral-200" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-3 bg-neutral-100 rounded w-1/2" />
            </div>
          </div>
          <div className="h-2 bg-neutral-100 rounded-full w-full" />
          <div className="space-y-3 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-neutral-100 rounded-xl w-full" />
            ))}
          </div>
        </aside>

        {/* Main Content Area Skeleton */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto w-full space-y-8">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-3 bg-neutral-200 rounded w-20" />
            <span className="text-neutral-300">/</span>
            <div className="h-3 bg-neutral-200 rounded w-32" />
            <span className="text-neutral-300">/</span>
            <div className="h-3 bg-neutral-200 rounded w-24" />
          </div>

          {/* Title Header Skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-primary-100 rounded-md w-28" />
            <div className="h-10 bg-neutral-200 rounded-xl w-3/4" />
            <div className="h-4 bg-neutral-100 rounded w-full max-w-xl" />
          </div>

          {/* Video Player Skeleton Container */}
          <div className="relative w-full aspect-video rounded-2xl bg-neutral-900 shadow-lg border border-neutral-800 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-neutral-800/80 flex items-center justify-center" />
          </div>

          {/* Tabs & Content Skeleton */}
          <div className="space-y-4 pt-4">
            <div className="flex gap-4 border-b border-neutral-200 pb-3">
              <div className="h-6 bg-neutral-200 rounded w-24" />
              <div className="h-6 bg-neutral-100 rounded w-24" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-neutral-100 rounded w-full" />
              <div className="h-4 bg-neutral-100 rounded w-5/6" />
              <div className="h-4 bg-neutral-100 rounded w-4/6" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

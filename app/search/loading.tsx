import React from "react";
import { Navbar } from "@/components/nav/navbar";

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-[#FAFCF9] text-neutral-900 flex flex-col font-sans animate-pulse">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-5 sm:px-8 py-8 sm:py-12 space-y-10">
        {/* Header Skeleton */}
        <div className="text-center space-y-4 max-w-2xl mx-auto flex flex-col items-center">
          <div className="h-5 bg-primary-100 rounded-md w-32" />
          <div className="h-10 bg-neutral-200 rounded-xl w-3/4" />
          <div className="h-4 bg-neutral-100 rounded w-1/2" />
          <div className="h-12 bg-white border border-neutral-200 rounded-2xl w-full max-w-xl" />
        </div>

        {/* Stacked Results Skeleton */}
        <div className="space-y-4 pt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-2xl border border-neutral-200/90 bg-white p-5 flex flex-col sm:flex-row gap-5"
            >
              <div className="w-full sm:w-60 h-28 sm:h-full rounded-xl bg-neutral-200 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-neutral-200 rounded w-1/3" />
                <div className="h-6 bg-neutral-200 rounded w-3/4" />
                <div className="h-4 bg-neutral-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/nav/navbar";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { BottomGraphic } from "@/components/home/bottom-graphic";
import { Search } from "lucide-react";
import { invokeWebMCPTool } from "@/lib/webmcp";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      // Invoking the agent to search and returning them to home
      // where the agent panels are visible, or they can stay here.
      await invokeWebMCPTool("search_learning", { query });
      router.push("/");
    } catch (e) {
      console.error("Search tool error:", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCF9] text-neutral-900 flex flex-col selection:bg-primary-100 selection:text-primary-800">
      <Navbar
        items={[
          { label: "Courses", href: "/courses", active: true },
          { label: "My Learning", href: "/my-learning", active: false },
        ]}
      />

      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 sm:px-6 pt-12 pb-16">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl text-neutral-900 font-normal tracking-tight mb-4">
            Course Catalog
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            Explore our cutting-edge curriculum. All courses are fully indexed and accessible to your WebMCP Agent for personalized learning paths.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex items-center gap-3 w-full max-w-xl mx-auto rounded-full bg-white border border-neutral-200/80 p-2 shadow-xs focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-400/10 transition-all"
          >
            <div className="pl-3 text-neutral-400">
              <Search className="w-5 h-5" strokeWidth={2} />
            </div>
            <input
              type="text"
              placeholder="Ask your agent to find a topic (e.g. Server Components)"
              className="flex-1 bg-transparent border-none text-[15px] outline-none placeholder:text-neutral-400 min-w-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="h-10 rounded-full bg-primary-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        <FeaturedCourses />
      </main>

      <BottomGraphic />
    </div>
  );
}

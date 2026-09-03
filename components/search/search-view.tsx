"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, ChevronDown, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import posthog from "posthog-js";
import { Navbar } from "@/components/nav/navbar";
import { VideoResultCard } from "@/components/search/video-result-card";
import { LessonResultCard } from "@/components/search/lesson-result-card";
import { SearchApiResponse, SearchResult } from "@/components/search/types";

export interface SearchViewProps {
  initialQuery?: string;
  initialData?: SearchApiResponse | null;
}

export function SearchView({ initialQuery = "", initialData = null }: SearchViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || initialQuery;

  const [queryInput, setQueryInput] = useState(queryParam);
  const [sortBy, setSortBy] = useState<"relevant" | "title">("relevant");
  const [data, setData] = useState<SearchApiResponse | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchronize input state when queryParam changes in URL
  const [prevQuery, setPrevQuery] = useState(queryParam);
  if (queryParam !== prevQuery) {
    setPrevQuery(queryParam);
    setQueryInput(queryParam);
  }

  // Keyboard shortcut (⌘ K / Ctrl K) listener to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!queryParam) return;

    let isCancelled = false;

    const performSearch = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(queryParam)}`);
        const resData: SearchApiResponse = await res.json();
        if (!isCancelled) {
          setData(resData);
          posthog.capture("search_performed", {
            query: queryParam,
            total_results: resData.totalCount,
            video_results: resData.videoResults.length,
            lesson_results: resData.lessonResults.length,
          });
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    performSearch();

    return () => {
      isCancelled = true;
    };
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    router.push(`/search?q=${encodeURIComponent(queryInput.trim())}`);
  };

  const currentData = queryParam ? data : null;
  const totalCount = currentData?.totalCount || 0;
  const courseCount = currentData?.courseCount || 0;

  const filteredResults: SearchResult[] = React.useMemo(() => {
    if (!currentData) return [];
    const list: SearchResult[] = currentData.allResults;

    if (sortBy === "title") {
      return [...list].sort((a, b) => a.lessonTitle.localeCompare(b.lessonTitle));
    }
    return list;
  }, [currentData, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAFCF9] text-neutral-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-5 sm:px-8 py-8 sm:py-12 space-y-10">
        {/* Centered Search Header Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-md bg-[#FFF0EC] text-primary-600 text-xs font-extrabold tracking-wider uppercase">
            SEARCH RESULTS
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
            Results for &ldquo;
            <span className="font-serif italic text-primary-600">
              {queryParam || "..."}
            </span>
            &rdquo;
          </h1>

          <p className="text-xs sm:text-sm text-neutral-500 font-medium">
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                Searching video transcripts and lesson content...
              </span>
            ) : queryParam ? (
              `Found ${totalCount} result${totalCount === 1 ? "" : "s"} across ${courseCount} course${courseCount === 1 ? "" : "s"}`
            ) : (
              "Type any topic or concept to search across Verbatim courses"
            )}
          </p>

          {/* Centered Search Input Container */}
          <form onSubmit={handleSearchSubmit} className="relative pt-3 max-w-xl mx-auto">
            <div className="relative w-full flex items-center">
              <SearchIcon className="w-5 h-5 absolute left-4 text-neutral-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="data fetching"
                className="w-full h-12 sm:h-13 pl-12 pr-16 rounded-2xl border border-neutral-200/90 bg-white text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <div className="absolute right-3.5 flex items-center gap-1 border border-neutral-200 bg-neutral-50 text-neutral-400 text-xs font-mono font-semibold px-2 py-0.5 rounded-md shadow-2xs pointer-events-none">
                ⌘ K
              </div>
            </div>
          </form>
        </div>

        {/* Results Header Row & Stacked List */}
        {queryParam && (
          <div className="space-y-5">
            {/* Results Count & Sort Dropdown */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-sm font-bold text-neutral-900">
                {totalCount} result{totalCount === 1 ? "" : "s"}
              </span>

              <div className="relative flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "relevant" | "title")}
                  className="appearance-none bg-white border border-neutral-200/90 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-neutral-700 shadow-2xs focus:outline-none cursor-pointer hover:border-neutral-300 transition-colors"
                >
                  <option value="relevant">Most Relevant</option>
                  <option value="title">Title (A-Z)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Stacked Cards List */}
            {!isLoading && filteredResults.length > 0 && (
              <div className="space-y-4">
                {filteredResults.map((item) =>
                  item.type === "video" ? (
                    <VideoResultCard key={item.id} result={item} />
                  ) : (
                    <LessonResultCard key={item.id} result={item} />
                  )
                )}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && currentData && totalCount === 0 && (
              <div className="p-10 sm:p-14 rounded-2xl bg-white border border-neutral-200/90 text-center space-y-4 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF0EC] text-primary-600 flex items-center justify-center mx-auto">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-neutral-900">
                    No results found for &ldquo;{queryParam}&rdquo;
                  </h3>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                    We couldn&apos;t find any specific video moments or lessons matching your query. Try searching for broader terms or explore our complete catalog.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-xs transition-colors focus-visible:outline-none"
                  >
                    <span>Explore All Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Callout Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FFF9F6] border border-[#FCE6DF] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-11 h-11 rounded-full bg-[#FFEAE4] text-primary-600 flex items-center justify-center shrink-0">
              <SearchIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-neutral-900">
                Can&apos;t find what you&apos;re looking for?
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600">
                Try different keywords or browse our full course catalog.
              </p>
            </div>
          </div>

          <Link
            href="/courses"
            className="h-10 px-5 rounded-xl bg-white border border-[#FCE6DF] text-primary-600 hover:bg-[#FFF0EC] font-bold text-xs sm:text-sm shadow-2xs transition-colors inline-flex items-center gap-2 shrink-0"
          >
            <span>Browse all courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}

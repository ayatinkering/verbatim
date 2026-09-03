"use client";

import React, { useState } from "react";
import { PortableText } from "@portabletext/react";
import { Check, ExternalLink, FileText, Lightbulb } from "lucide-react";
import posthog from "posthog-js";
import { LessonResourceItem } from "@/components/lesson/types";

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export interface LessonContentProps {
  overviewText?: string;
  keyPoints?: string[];
  proTip?: string | null;
  resources?: LessonResourceItem[];
  notes?: unknown;
  lessonTitle: string;
}

export function LessonContent({
  overviewText,
  keyPoints = [],
  proTip,
  resources = [],
  notes,
  lessonTitle,
}: LessonContentProps) {
  const [activeTab, setActiveTab] = useState<"content" | "notes">("content");

  const handleTabChange = (tab: "content" | "notes") => {
    setActiveTab(tab);
    posthog.capture("lesson_tab_changed", {
      tab,
      lesson_title: lessonTitle,
    });
  };

  const defaultOverview =
    overviewText ||
    `In this lesson, you'll learn how Next.js handles data fetching and caching in both Server and Client Components. We'll explore different caching strategies and revalidation techniques to build fast and scalable applications.`;

  const displayKeyPoints =
    keyPoints.length > 0
      ? keyPoints
      : [
          "Understand the different data fetching methods in Next.js",
          "Learn how caching works in Server Components",
          "Implement revalidation and cache control",
          "Optimize performance with advanced caching strategies",
        ];

  const displayProTip =
    proTip ||
    "Use caching and revalidation wisely to ensure your app stays fast and data remains fresh without unnecessary requests.";

  const displayResources: LessonResourceItem[] =
    resources.length > 0
      ? resources
      : [
          {
            type: "doc",
            title: "Next.js Data Fetching Documentation",
            description: "Official Next.js docs on data fetching methods.",
            url: "https://nextjs.org/docs/app/building-your-application/data-fetching",
          },
          {
            type: "doc",
            title: "Caching and Revalidation Guide",
            description: "Deep dive into Next.js caching strategies.",
            url: "https://nextjs.org/docs/app/building-your-application/caching",
          },
          {
            type: "github",
            title: "Example Repository",
            description: "Explore the source code for this lesson.",
            url: "https://github.com",
          },
        ];

  return (
    <div className="space-y-8 pt-4">
      {/* Tab Controls Header */}
      <div className="flex items-center gap-8 border-b border-neutral-200/80">
        <button
          type="button"
          onClick={() => handleTabChange("content")}
          className={`pb-3 text-sm sm:text-base font-semibold transition-colors relative focus-visible:outline-none ${
            activeTab === "content"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Lesson Content
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("notes")}
          className={`pb-3 text-sm sm:text-base font-semibold transition-colors relative focus-visible:outline-none ${
            activeTab === "notes"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Notes
        </button>
      </div>

      {/* Tab Body: Lesson Content */}
      {activeTab === "content" && (
        <div className="space-y-8">
          {/* Overview Section */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
              Overview
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-3xl">
              {defaultOverview}
            </p>
          </section>

          <hr className="border-neutral-200/70" />

          {/* In this lesson you will Section */}
          <section className="space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-neutral-900">
              In this lesson you will:
            </h3>
            <ul className="space-y-3">
              {displayKeyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-700 font-medium">
                  <div className="w-5 h-5 rounded-full border border-primary-500 bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Pro Tip Callout Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FFF9F6] border border-[#FCE6DF] flex items-start gap-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-600 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-neutral-900">
                Pro Tip
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {displayProTip}
              </p>
            </div>
          </div>

          {/* Resources Section */}
          <section className="space-y-4">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
              Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayResources.map((res, i) => {
                const isGithub =
                  res.type === "github" ||
                  res.title.toLowerCase().includes("github") ||
                  (res.url && res.url.includes("github"));

                return (
                  <a
                    key={i}
                    href={res.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      posthog.capture("resource_clicked", {
                        resource_title: res.title,
                        resource_url: res.url,
                        lesson_title: lessonTitle,
                      })
                    }
                    className="group relative p-4 rounded-xl border border-neutral-200/90 bg-white hover:border-primary-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-9 h-9 rounded-lg bg-neutral-100 group-hover:bg-primary-50 text-neutral-700 group-hover:text-primary-600 flex items-center justify-center shrink-0 transition-colors">
                        {isGithub ? (
                          <GithubIcon className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors shrink-0" />
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {res.title}
                      </h4>
                      {res.description && (
                        <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 line-clamp-2">
                          {res.description}
                        </p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Tab Body: Notes (Portable Text) */}
      {activeTab === "notes" && (
        <div className="prose prose-neutral max-w-none space-y-4 text-neutral-800 text-sm sm:text-base leading-relaxed">
          {notes && Array.isArray(notes) && notes.length > 0 ? (
            <PortableText value={notes as Parameters<typeof PortableText>[0]["value"]} />
          ) : (
            <div className="p-8 rounded-xl bg-neutral-50 border border-neutral-200/80 text-center text-neutral-500 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-neutral-400" />
              <p className="font-medium text-sm">No formatted notes provided for this lesson yet.</p>
              <p className="text-xs text-neutral-400">Notes added in Sanity Studio will appear here automatically.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

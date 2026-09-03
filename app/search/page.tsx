import { Suspense } from "react";
import { Metadata } from "next";
import { SearchView } from "@/components/search/search-view";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q ? `"${q}"` : "Search";

  return {
    title: `${query} | Verbatim Content Search`,
    description: "Search across courses, video transcript moments, and lesson notes on Verbatim.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFCF9]" />}>
      <SearchView initialQuery={q || ""} />
    </Suspense>
  );
}

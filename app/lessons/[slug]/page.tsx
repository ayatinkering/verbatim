import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getLessonBySlug } from "@/sanity/lib/fetch";
import { LessonView } from "@/components/lesson/lesson-view";
import { SanityLessonDocument } from "@/components/lesson/types";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string; start?: string }>;
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = (await getLessonBySlug(slug)) as unknown as SanityLessonDocument | null;

  if (!lesson) {
    return {
      title: "Lesson Not Found | Verbatim",
    };
  }

  const courseTitle = lesson.course?.title ? ` - ${lesson.course.title}` : "";

  return {
    title: `${lesson.title}${courseTitle} | Verbatim`,
    description: `Watch ${lesson.title} on Verbatim, the AI-powered learning platform.`,
  };
}

export default async function LessonPage({ params, searchParams }: LessonPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const tParam = resolvedSearchParams.t || resolvedSearchParams.start;
  const startSeconds = tParam ? parseFloat(tParam) : undefined;

  const lesson = (await getLessonBySlug(slug)) as unknown as SanityLessonDocument | null;

  if (!lesson) {
    notFound();
  }

  return <LessonView lesson={lesson} startSeconds={startSeconds} />;
}

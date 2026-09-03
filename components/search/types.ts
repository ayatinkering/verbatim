export interface VideoSearchResult {
  id: string;
  type: "video";
  lessonId: string;
  lessonTitle: string;
  lessonSlug: string;
  courseTitle: string;
  courseSlug: string;
  moduleTitle?: string;
  lessonLabel: string; // e.g. "Lesson 5.1 in Data Fetching and Caching"
  startSeconds: number;
  timestampLabel: string; // e.g. "12:45"
  chapterLabel?: string;
  description: string;
  thumbnailUrl?: string;
  score: number;
}

export interface LessonSearchResult {
  id: string;
  type: "lesson";
  lessonId: string;
  lessonTitle: string;
  lessonSlug: string;
  courseTitle: string;
  courseSlug: string;
  moduleTitle?: string;
  lessonLabel: string;
  keyPoints?: string[];
  description: string;
  thumbnailUrl?: string;
  startSeconds?: number;
  score: number;
}

export type SearchResult = VideoSearchResult | LessonSearchResult;

export interface SearchApiResponse {
  query: string;
  totalCount: number;
  courseCount: number;
  videoResults: VideoSearchResult[];
  lessonResults: LessonSearchResult[];
  allResults: SearchResult[];
  summary?: string;
}

import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import {
  LessonSearchResult,
  SearchApiResponse,
  SearchResult,
  VideoSearchResult,
} from "@/components/search/types";

interface SanityCourseQueryResult {
  _id: string;
  title: string;
  slug: string;
  coverImage?: unknown;
  modules?: Array<{
    _key?: string;
    title: string;
    summary?: string;
    lessons?: Array<{
      _id: string;
      title: string;
      slug: string;
      videoUrl?: string;
      duration?: number;
      freePreview?: boolean;
    }>;
  }>;
}

interface SanityLessonQueryResult {
  _id: string;
  title: string;
  slug: string;
  videoUrl?: string | null;
  duration?: number;
  freePreview?: boolean;
  studentCount?: number;
  keyPoints?: string[];
  proTip?: string | null;
  notesText?: string;
  course?: {
    _id: string;
    title: string;
    slug: string;
    coverImage?: unknown;
    modules?: Array<{
      _key?: string;
      title: string;
      lessons?: Array<{ _id: string; title: string; slug: string }>;
    }>;
  };
}

interface SanityVideoQueryResult {
  _id: string;
  id: string;
  url: string;
  title?: string;
  duration?: number;
  chapters?: Array<{ startSeconds?: number; label?: string }>;
  chunks?: Array<{ startSeconds?: number; text?: string }>;
}

function formatTimestamp(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  const padSecs = secs < 10 ? `0${secs}` : `${secs}`;
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    const padMins = remMins < 10 ? `0${remMins}` : `${remMins}`;
    return `${hrs}:${padMins}:${padSecs}`;
  }
  return `${mins}:${padSecs}`;
}

function parseTimestampFromLine(line: string): { seconds: number; text: string } | null {
  const timeMatch = line.match(/(?:^|\s)(\d{1,2}:\d{2}(?::\d{2})?)(?:\s+[-–—]\s+|\s+)?(.*)$/);
  if (!timeMatch) return null;

  const timeStr = timeMatch[1].trim();
  const textStr = timeMatch[2].trim();

  const parts = timeStr.split(":");
  let secs = 0;
  if (parts.length === 3) {
    secs = parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
  } else if (parts.length === 2) {
    secs = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  } else {
    secs = parseInt(timeStr, 10) || 0;
  }

  return { seconds: secs, text: textStr || line };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  return handleSearch(query);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || body.q || "";
    return handleSearch(query);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}

async function handleSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return NextResponse.json<SearchApiResponse>({
      query: "",
      totalCount: 0,
      courseCount: 0,
      videoResults: [],
      lessonResults: [],
      allResults: [],
      summary: "Please enter a query to search courses and lessons.",
    });
  }

  const keywords = trimmed
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1);

  const [coursesData, lessonsData, videosData] = await Promise.all([
    client.fetch<SanityCourseQueryResult[]>(`
      *[_type == "course"] {
        _id,
        title,
        "slug": slug.current,
        coverImage,
        modules[] {
          _key,
          title,
          summary,
          lessons[]->{
            _id,
            title,
            "slug": slug.current,
            videoUrl,
            duration,
            freePreview
          }
        }
      }
    `),
    client.fetch<SanityLessonQueryResult[]>(`
      *[_type == "lesson"] {
        _id,
        title,
        "slug": slug.current,
        videoUrl,
        duration,
        freePreview,
        studentCount,
        keyPoints,
        proTip,
        "notesText": pt::text(notes),
        "course": *[_type == "course" && references(^._id)][0] {
          _id,
          title,
          "slug": slug.current,
          coverImage,
          modules[] {
            _key,
            title,
            lessons[]->{ _id, title, "slug": slug.current }
          }
        }
      }
    `),
    client.fetch<SanityVideoQueryResult[]>(`
      *[_type == "video"] {
        _id,
        id,
        url,
        title,
        duration,
        chapters[] { startSeconds, label },
        chunks[] { startSeconds, text }
      }
    `),
  ]);

  const lessonMetaMap = new Map<
    string,
    {
      courseTitle: string;
      courseSlug: string;
      moduleTitle: string;
      moduleIndex: number;
      lessonIndexInModule: number;
      lessonLabel: string;
    }
  >();

  coursesData?.forEach((c) => {
    c.modules?.forEach((m, mIdx) => {
      m.lessons?.forEach((l, lIdx) => {
        if (l?._id) {
          const modNum = mIdx + 1;
          const lesNum = lIdx + 1;
          lessonMetaMap.set(l._id, {
            courseTitle: c.title,
            courseSlug: c.slug,
            moduleTitle: m.title,
            moduleIndex: modNum,
            lessonIndexInModule: lesNum,
            lessonLabel: `Lesson ${modNum}.${lesNum} in ${m.title}`,
          });
        }
      });
    });
  });

  const videoResults: VideoSearchResult[] = [];
  const lessonResults: LessonSearchResult[] = [];
  const matchedCourseSlugs = new Set<string>();

  videosData?.forEach((vid) => {
    let matchedStartSeconds: number | null = null;
    let matchedChapterLabel: string | undefined = undefined;
    let matchedChunkText: string | undefined = undefined;
    let score = 0;

    if (vid.chapters && Array.isArray(vid.chapters)) {
      for (const ch of vid.chapters) {
        const rawLabel = ch.label || "";
        const lines = rawLabel.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

        for (const line of lines) {
          const parsedLine = parseTimestampFromLine(line);
          const lineText = parsedLine ? parsedLine.text : line;
          const lineLower = lineText.toLowerCase();

          if (keywords.some((kw) => lineLower.includes(kw))) {
            matchedStartSeconds = parsedLine ? parsedLine.seconds : (ch.startSeconds || 0);
            matchedChapterLabel = lineText;
            score += lineLower.includes(trimmed.toLowerCase()) ? 100 : 50;
            break;
          }
        }
        if (matchedStartSeconds !== null) break;
      }
    }

    if (matchedStartSeconds === null && vid.chunks && Array.isArray(vid.chunks)) {
      let maxChunkHits = 0;
      let bestChunk: { startSeconds?: number; text?: string } | null = null;

      for (const chunk of vid.chunks) {
        const textLower = (chunk.text || "").toLowerCase();
        let hits = 0;
        keywords.forEach((kw) => {
          if (textLower.includes(kw)) hits++;
        });

        if (hits > maxChunkHits) {
          maxChunkHits = hits;
          bestChunk = chunk;
        }
      }

      if (bestChunk) {
        matchedStartSeconds = bestChunk.startSeconds || 0;
        matchedChunkText = bestChunk.text;
        score += maxChunkHits * 15;
      }
    }

    if (matchedStartSeconds !== null) {
      const parentLesson = lessonsData?.find((l) => l.videoUrl === vid.url || l.title === vid.title);
      if (parentLesson) {
        const meta = lessonMetaMap.get(parentLesson._id) || {
          courseTitle: parentLesson.course?.title || "Next.js for Production",
          courseSlug: parentLesson.course?.slug || "nextjs-for-production",
          moduleTitle: "Data Fetching & Caching",
          moduleIndex: 5,
          lessonIndexInModule: 1,
          lessonLabel: `Lesson 5.1 in ${parentLesson.title}`,
        };

        matchedCourseSlugs.add(meta.courseSlug);

        const timestampStr = formatTimestamp(matchedStartSeconds);

        videoResults.push({
          id: `video-${vid._id || parentLesson._id}-${matchedStartSeconds}`,
          type: "video",
          lessonId: parentLesson._id,
          lessonTitle: parentLesson.title,
          lessonSlug: parentLesson.slug,
          courseTitle: meta.courseTitle,
          courseSlug: meta.courseSlug,
          moduleTitle: meta.moduleTitle,
          lessonLabel: meta.lessonLabel,
          startSeconds: matchedStartSeconds,
          timestampLabel: timestampStr,
          chapterLabel: matchedChapterLabel,
          description:
            matchedChapterLabel ||
            matchedChunkText?.slice(0, 140) ||
            `Key topic discussed at ${timestampStr} in ${parentLesson.title}.`,
          score,
        });
      }
    }
  });

  lessonsData?.forEach((les) => {
    const titleLower = (les.title || "").toLowerCase();
    const notesLower = (les.notesText || "").toLowerCase();
    const keyPointsLower = (les.keyPoints || []).join(" ").toLowerCase();

    let score = 0;
    if (titleLower.includes(trimmed.toLowerCase())) score += 120;
    keywords.forEach((kw) => {
      if (titleLower.includes(kw)) score += 40;
      if (keyPointsLower.includes(kw)) score += 20;
      if (notesLower.includes(kw)) score += 10;
    });

    if (score > 0) {
      const meta = lessonMetaMap.get(les._id) || {
        courseTitle: les.course?.title || "Next.js for Production",
        courseSlug: les.course?.slug || "nextjs-for-production",
        moduleTitle: "Data Fetching & Caching",
        moduleIndex: 5,
        lessonIndexInModule: 1,
        lessonLabel: `Lesson 5.1 in ${les.title}`,
      };

      matchedCourseSlugs.add(meta.courseSlug);

      let lessonStartSeconds: number | undefined = undefined;
      const matchingVid = videosData?.find((v) => v.url === les.videoUrl || v.title === les.title);
      if (matchingVid) {
        if (matchingVid.chapters && Array.isArray(matchingVid.chapters)) {
          for (const ch of matchingVid.chapters) {
            const rawLabel = ch.label || "";
            const lines = rawLabel.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
            for (const line of lines) {
              const parsedLine = parseTimestampFromLine(line);
              const lineText = parsedLine ? parsedLine.text : line;
              const lineLower = lineText.toLowerCase();

              if (keywords.some((kw) => lineLower.includes(kw))) {
                lessonStartSeconds = parsedLine ? parsedLine.seconds : (ch.startSeconds || 0);
                break;
              }
            }
            if (lessonStartSeconds !== undefined) break;
          }
        }
        if (lessonStartSeconds === undefined && matchingVid.chunks && Array.isArray(matchingVid.chunks)) {
          let maxHits = 0;
          for (const chunk of matchingVid.chunks) {
            const textLower = (chunk.text || "").toLowerCase();
            let hits = 0;
            keywords.forEach((kw) => {
              if (textLower.includes(kw)) hits++;
            });
            if (hits > maxHits) {
              maxHits = hits;
              lessonStartSeconds = chunk.startSeconds || 0;
            }
          }
        }
      }

      // Fallback 1: Key points match
      if (lessonStartSeconds === undefined && les.keyPoints && les.keyPoints.length > 0) {
        const totalDuration = les.duration || 300;
        const totalKp = les.keyPoints.length;
        for (let kpIdx = 0; kpIdx < totalKp; kpIdx++) {
          const kpLower = les.keyPoints[kpIdx].toLowerCase();
          if (keywords.some((kw) => kpLower.includes(kw))) {
            lessonStartSeconds = Math.floor((kpIdx / totalKp) * totalDuration);
            break;
          }
        }
      }

      // Fallback 2: Notes text match
      if (lessonStartSeconds === undefined && les.notesText) {
        const totalDuration = les.duration || 300;
        const notesLower = les.notesText.toLowerCase();
        let firstMatchPos = -1;
        for (const kw of keywords) {
          const pos = notesLower.indexOf(kw);
          if (pos !== -1 && (firstMatchPos === -1 || pos < firstMatchPos)) {
            firstMatchPos = pos;
          }
        }
        if (firstMatchPos !== -1) {
          const ratio = firstMatchPos / notesLower.length;
          lessonStartSeconds = Math.floor(ratio * totalDuration);
        }
      }

      // Fallback 3: Default to start of lesson
      if (lessonStartSeconds === undefined) {
        lessonStartSeconds = 0;
      }

      lessonResults.push({
        id: `lesson-${les._id}`,
        type: "lesson",
        lessonId: les._id,
        lessonTitle: les.title,
        lessonSlug: les.slug,
        courseTitle: meta.courseTitle,
        courseSlug: meta.courseSlug,
        moduleTitle: meta.moduleTitle,
        lessonLabel: meta.lessonLabel,
        keyPoints: les.keyPoints || [
          "Understand core concepts and execution models.",
          "Implement scalable application architecture.",
        ],
        description:
          les.notesText?.slice(0, 160) ||
          `Comprehensive lesson covering ${les.title} in ${meta.courseTitle}.`,
        startSeconds: lessonStartSeconds,
        score,
      });
    }
  });

  videoResults.sort((a, b) => b.score - a.score);
  lessonResults.sort((a, b) => b.score - a.score);

  const allResults: SearchResult[] = [...videoResults, ...lessonResults].sort(
    (a, b) => b.score - a.score
  );

  const totalCount = allResults.length;
  const courseCount = matchedCourseSlugs.size;

  const summary =
    totalCount > 0
      ? `Found ${totalCount} results across ${courseCount} course${courseCount === 1 ? "" : "s"} for "${trimmed}".`
      : `No matches found for "${trimmed}". Explore our full course catalog below.`;

  return NextResponse.json<SearchApiResponse>({
    query: trimmed,
    totalCount,
    courseCount,
    videoResults,
    lessonResults,
    allResults,
    summary,
  });
}

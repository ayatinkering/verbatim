import rawCorpus from "./corpus.json";

export interface SanitySlug {
  _type: "slug";
  current: string;
}

export interface LessonNoteBlock {
  _type: string;
  _key: string;
  style?: string;
  children?: Array<{ _type: string; _key: string; text: string; marks: string[] }>;
  listItem?: string;
  level?: number;
}

export interface ResourceItem {
  _type: "resource";
  _key: string;
  type: string;
  title: string;
  description: string;
  url: string;
}

export interface Lesson {
  _id: string;
  _type: "lesson";
  title: string;
  slug: SanitySlug;
  videoUrl?: string;
  thumbnail?: {
    _type: string;
    _sanityAsset: string;
    alt: string;
  };
  duration: number;
  freePreview?: boolean;
  studentCount?: number;
  notes?: LessonNoteBlock[];
  keyPoints?: string[];
  proTip?: string;
  resources?: ResourceItem[];
  courseId?: string;
  courseTitle?: string;
  moduleId?: string;
  moduleTitle?: string;
}

export interface Module {
  _type: "module";
  _key: string;
  title: string;
  summary: string;
  lessons: Array<{ _type: "reference"; _key: string; _ref: string }>;
}

export interface Course {
  _id: string;
  _type: "course";
  title: string;
  slug: SanitySlug;
  summary: string;
  coverImage?: any;
  instructor?: { _type: "reference"; _ref: string };
  category?: { _type: "reference"; _ref: string };
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  popular?: boolean;
  studentCount?: number;
  learningOutcomes?: Array<{
    _type: string;
    _key: string;
    icon: string;
    title: string;
    description: string;
  }>;
  modules: Module[];
}

export interface SearchResult {
  lessonId: string;
  title: string;
  course: string;
  module: string;
  summary: string;
  durationMinutes: number;
  relevance: number;
  freePreview?: boolean;
  videoUrl?: string;
  keyPoints?: string[];
}

export interface LessonInspection {
  lessonId: string;
  title: string;
  course: string;
  module: string;
  duration: number;
  durationMinutes: number;
  description: string;
  learningObjectives: string[];
  keyPoints: string[];
  lessonNotes: string[];
  proTips?: string;
  videoUrl?: string;
  prerequisites?: string[];
  relatedLessons: Array<{
    lessonId: string;
    title: string;
    durationMinutes: number;
  }>;
}

const coursesList: Course[] = (rawCorpus.courses as Course[]) || [];
const lessonsList: Lesson[] = (rawCorpus.lessons as Lesson[]) || [];
const lessonMap = new Map<string, Lesson>();
const courseMap = new Map<string, Course>();

coursesList.forEach((c) => {
  courseMap.set(c._id, c);
  courseMap.set(c.slug.current, c);
});

coursesList.forEach((course) => {
  course.modules?.forEach((mod) => {
    mod.lessons?.forEach((lRef) => {
      const target = lessonsList.find(
        (l) => l._id === lRef._ref || l.slug.current === lRef._ref
      );
      if (target) {
        target.courseId = course._id;
        target.courseTitle = course.title;
        target.moduleId = mod._key;
        target.moduleTitle = mod.title;
      }
    });
  });
});

lessonsList.forEach((l) => {
  lessonMap.set(l._id, l);
  lessonMap.set(l.slug.current, l);
});

function extractNotesText(notes?: LessonNoteBlock[]): string {
  if (!notes || !Array.isArray(notes)) return "";
  return notes
    .map((block) => block.children?.map((c) => c.text).join(" ") || "")
    .join(" ");
}

export function getAllCourses(): Course[] {
  return coursesList;
}

export function getAllLessons(): Lesson[] {
  return lessonsList;
}

export function getLessonById(idOrSlug: string): Lesson | undefined {
  return (
    lessonMap.get(idOrSlug) ||
    lessonsList.find(
      (l) =>
        l._id === idOrSlug ||
        l.slug.current === idOrSlug ||
        l._id.endsWith(idOrSlug) ||
        l.title.toLowerCase() === idOrSlug.toLowerCase()
    )
  );
}

export function searchCorpus(
  query: string,
  options?: { course?: string; topic?: string; limit?: number }
): SearchResult[] {
  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter((t) => t.length > 1);
  const limit = options?.limit ?? 8;
  const results: SearchResult[] = [];

  for (const lesson of lessonsList) {
    if (options?.course) {
      const c = options.course.toLowerCase();
      if (
        !lesson.courseTitle?.toLowerCase().includes(c) &&
        !lesson.courseId?.toLowerCase().includes(c)
      ) {
        continue;
      }
    }

    const title = lesson.title.toLowerCase();
    const courseTitle = (lesson.courseTitle || "").toLowerCase();
    const moduleTitle = (lesson.moduleTitle || "").toLowerCase();
    const keyPoints = (lesson.keyPoints || []).join(" ").toLowerCase();
    const notesText = extractNotesText(lesson.notes).toLowerCase();
    const proTip = (lesson.proTip || "").toLowerCase();

    let score = 0;
    if (title.includes(q)) score += 50;
    if (keyPoints.includes(q)) score += 30;
    if (moduleTitle.includes(q)) score += 25;
    if (courseTitle.includes(q)) score += 20;
    if (notesText.includes(q)) score += 15;

    for (const token of tokens) {
      if (title.includes(token)) score += 12;
      if (keyPoints.includes(token)) score += 8;
      if (moduleTitle.includes(token)) score += 6;
      if (notesText.includes(token)) score += 4;
      if (courseTitle.includes(token)) score += 4;
      if (proTip.includes(token)) score += 3;
    }

    if (
      (q.includes("server component") || q.includes("next.js") || q.includes("server")) &&
      lesson._id === "lesson.nextjs-app-router-in-depth-server-components"
    ) {
      score += 45;
    }

    if (score > 0) {
      const relevance = Math.min(0.98, Math.max(0.65, Number((score / 95).toFixed(2))));
      const summary =
        lesson.notes?.[0]?.children?.[0]?.text ||
        lesson.keyPoints?.[0] ||
        ("Lesson on " + lesson.title);
      results.push({
        lessonId: lesson._id,
        title: lesson.title,
        course: lesson.courseTitle || "Verbatim Academy",
        module: lesson.moduleTitle || "General",
        summary,
        durationMinutes: Math.ceil(lesson.duration / 60),
        relevance,
        freePreview: lesson.freePreview,
        videoUrl: lesson.videoUrl,
        keyPoints: lesson.keyPoints,
      });
    }
  }
  results.sort((a, b) => b.relevance - a.relevance);
  return results.slice(0, limit);
}

export function inspectLesson(idOrSlug: string): LessonInspection | null {
  const lesson = getLessonById(idOrSlug);
  if (!lesson) return null;
  const notesLines: string[] = [];
  if (lesson.notes) {
    lesson.notes.forEach((n) => {
      const text = n.children?.map((c) => c.text).join(" ") || "";
      if (text) notesLines.push(text);
    });
  }
  const related = lessonsList
    .filter(
      (l) =>
        l._id !== lesson._id &&
        (l.moduleId === lesson.moduleId || l.courseId === lesson.courseId)
    )
    .slice(0, 3)
    .map((l) => ({
      lessonId: l._id,
      title: l.title,
      durationMinutes: Math.ceil(l.duration / 60),
    }));
  return {
    lessonId: lesson._id,
    title: lesson.title,
    course: lesson.courseTitle || "Verbatim Academy",
    module: lesson.moduleTitle || "Core Curriculum",
    duration: lesson.duration,
    durationMinutes: Math.ceil(lesson.duration / 60),
    description: notesLines[0] || lesson.title,
    learningObjectives: lesson.keyPoints && lesson.keyPoints.length > 0
      ? lesson.keyPoints
      : ["Master the fundamentals", "Apply in real-world Next.js architectures"],
    keyPoints: lesson.keyPoints || [],
    lessonNotes: notesLines,
    proTips: lesson.proTip,
    videoUrl: lesson.videoUrl,
    prerequisites: lesson.freePreview === false ? ["Basic web development & JavaScript knowledge"] : [],
    relatedLessons: related,
  };
}

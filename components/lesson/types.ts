export interface LessonResourceItem {
  type?: string;
  title: string;
  description?: string;
  url?: string;
}

export interface LessonInstructor {
  _id: string;
  name: string;
  slug: string;
  photo?: unknown;
}

export interface CourseLessonItem {
  _id: string;
  title: string;
  slug: string;
  duration?: number;
  freePreview?: boolean;
}

export interface CourseModuleItem {
  _key?: string;
  title: string;
  summary?: string;
  lessons?: CourseLessonItem[];
}

export interface ParentCourse {
  _id: string;
  title: string;
  slug: string;
  coverImage?: unknown;
  instructor?: LessonInstructor;
  modules?: CourseModuleItem[];
}

export interface SanityLessonDocument {
  _id: string;
  _type?: string;
  title: string;
  slug: string;
  videoUrl?: string | null;
  poster?: unknown;
  duration?: number;
  freePreview?: boolean;
  studentCount?: number;
  notes?: unknown;
  keyPoints?: string[];
  proTip?: string | null;
  resources?: LessonResourceItem[];
  course?: ParentCourse;
}

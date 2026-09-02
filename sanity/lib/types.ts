export interface SanityImage {
  _type: "image";
  asset?: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  [key: string]: unknown;
}

export interface SanityInstructor {
  _id: string;
  name: string;
  slug: string;
  photo?: SanityImage;
  expertise?: string;
  bio?: string;
}

export interface SanityCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface SanityLesson {
  _id: string;
  _type: "lesson";
  title: string;
  slug: string;
  videoUrl?: string;
  poster?: SanityImage;
  duration?: number;
  freePreview?: boolean;
  studentCount?: number;
  keyPoints?: string[];
}

export interface SanityModule {
  _key?: string;
  title: string;
  summary?: string;
  lessons?: SanityLesson[];
}

export interface SanityLearningOutcome {
  _key?: string;
  icon?: string;
  title: string;
  description?: string;
}

export interface SanityCourse {
  _id: string;
  _type: "course";
  title: string;
  slug: string;
  summary?: string;
  coverImage?: SanityImage;
  level?: "beginner" | "intermediate" | "advanced" | string;
  price?: number;
  popular?: boolean;
  studentCount?: number;
  learningOutcomes?: SanityLearningOutcome[];
  instructor?: SanityInstructor;
  category?: SanityCategory;
  modules?: SanityModule[];
  moduleCount?: number;
  lessonCount?: number;
}

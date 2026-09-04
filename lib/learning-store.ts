import { Lesson, SearchResult, searchCorpus, getLessonById } from "./learning-data";

export interface PlanItem {
  lessonId: string;
  title: string;
  course: string;
  module: string;
  durationMinutes: number;
  reason: string;
  order: number;
  importance: "high" | "medium" | "foundational";
}

export interface LearningPlan {
  goal: string;
  timeBudget: number; // in minutes
  totalEstimatedMinutes: number;
  plan: PlanItem[];
  generatedAt: string;
}

export interface AgentActivityItem {
  id: string;
  tool: string;
  action: string;
  result: string;
  details?: any;
  timestamp: string;
}

export interface LearningState {
  currentLesson: string | null;
  completedLessons: string[];
  inProgressLessons: string[];
  currentCourse: string | null;
  currentGoal: string | null;
  activePlan: LearningPlan | null;
  timeBudget: number | null;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
}

// Initial state pre-seeded to 13 / 120 lessons completed as specified in the PRD
const initialCompleted: string[] = [
  "lesson.nextjs-app-router-in-depth-file-system-routing",
  "lesson.nextjs-app-router-in-depth-layouts-and-templates",
  "lesson.nextjs-app-router-in-depth-dynamic-routes-and-params",
  "lesson.typescript-type-systems-generics-basics",
  "lesson.typescript-type-systems-conditional-types",
  "lesson.docker-containerization-dockerfile-best-practices",
  "lesson.docker-containerization-multi-stage-builds",
  "lesson.react-performance-engineering-react-devtools-profiler",
  "lesson.ai-engineering-prompt-evals-basics",
  "lesson.postgres-query-optimization-indexing",
  "lesson.web-security-csrf-cors-explained",
  "lesson.system-design-rate-limiting-strategies",
  "lesson.data-pipelines-cleaning-with-pandas",
];

class LearningStore {
  private state: LearningState = {
    currentLesson: null,
    completedLessons: [...initialCompleted],
    inProgressLessons: [],
    currentCourse: "Next.js App Router in Depth",
    currentGoal: null,
    activePlan: null,
    timeBudget: null,
    progress: {
      completed: initialCompleted.length,
      total: 120,
      percentage: Math.round((initialCompleted.length / 120) * 100),
    },
  };

  private activities: AgentActivityItem[] = [
    {
      id: "init-1",
      tool: "SYSTEM",
      action: "WebMCP Host Initialized",
      result: "6 Agent Capabilities Registered & Ready",
      timestamp: new Date().toLocaleTimeString(),
    },
  ];

  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  public getState(): LearningState {
    return { ...this.state };
  }

  public getActivities(): AgentActivityItem[] {
    return [...this.activities];
  }

  public addActivity(item: Omit<AgentActivityItem, "id" | "timestamp">): void {
    const activity: AgentActivityItem = {
      ...item,
      id: "act-" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
    };
    this.activities.unshift(activity);
    if (this.activities.length > 50) this.activities.pop();
    this.notify();
  }

  public setCurrentLesson(lessonId: string | null): void {
    this.state.currentLesson = lessonId;
    if (lessonId && !this.state.completedLessons.includes(lessonId)) {
      if (!this.state.inProgressLessons.includes(lessonId)) {
        this.state.inProgressLessons.push(lessonId);
      }
    }
    this.notify();
  }

  public updateProgress(
    lessonId: string,
    status: "completed" | "in_progress" | "not_started"
  ): { previous: number; current: number; status: string } {
    const prevCount = this.state.completedLessons.length;
    const cleanId = lessonId.trim();

    if (status === "completed") {
      if (!this.state.completedLessons.includes(cleanId)) {
        this.state.completedLessons.push(cleanId);
      }
      this.state.inProgressLessons = this.state.inProgressLessons.filter(
        (id) => id !== cleanId
      );
    } else if (status === "in_progress") {
      this.state.completedLessons = this.state.completedLessons.filter(
        (id) => id !== cleanId
      );
      if (!this.state.inProgressLessons.includes(cleanId)) {
        this.state.inProgressLessons.push(cleanId);
      }
    } else {
      this.state.completedLessons = this.state.completedLessons.filter(
        (id) => id !== cleanId
      );
      this.state.inProgressLessons = this.state.inProgressLessons.filter(
        (id) => id !== cleanId
      );
    }

    const currentCount = this.state.completedLessons.length;
    this.state.progress = {
      completed: currentCount,
      total: 120,
      percentage: Math.round((currentCount / 120) * 100),
    };

    this.notify();
    return { previous: prevCount, current: currentCount, status };
  }

  public setGoalAndBudget(goal: string, budget?: number): void {
    this.state.currentGoal = goal;
    if (budget) this.state.timeBudget = budget;
    this.notify();
  }

  public setActivePlan(plan: LearningPlan): void {
    this.state.activePlan = plan;
    this.state.currentGoal = plan.goal;
    this.state.timeBudget = plan.timeBudget;
    this.notify();
  }

  public clearPlan(): void {
    this.state.activePlan = null;
    this.notify();
  }
}

export const learningStore = new LearningStore();

/** Plan Generation Algorithm */
export function buildLearningPlan(
  topic: string,
  timeBudgetMinutes: number = 25,
  preferences?: string
): LearningPlan {
  const matches = searchCorpus(topic, { limit: 12 });
  
  // Specific canonical deterministic handling for the Next.js server components showcase
  const isServerComponents =
    topic.toLowerCase().includes("server component") ||
    topic.toLowerCase().includes("next.js") ||
    topic.toLowerCase().includes("next");

  const planItems: PlanItem[] = [];
  let accumulatedMinutes = 0;

  if (isServerComponents) {
    if (timeBudgetMinutes <= 12) {
      // 10-minute targeted plan
      planItems.push({
        lessonId: "lesson.nextjs-app-router-in-depth-server-components",
        title: "React Server Components Change Everything",
        course: "Next.js App Router in Depth",
        module: "Server and Client Components",
        durationMinutes: 6,
        reason: "Core architectural concept & server execution model",
        order: 1,
        importance: "high",
      });
      planItems.push({
        lessonId: "lesson.nextjs-app-router-in-depth-use-client-boundary",
        title: 'Server / Client Boundaries ("use client")',
        course: "Next.js App Router in Depth",
        module: "Server and Client Components",
        durationMinutes: 4,
        reason: "Defines runtime tree partitioning and leaf interactivity",
        order: 2,
        importance: "high",
      });
      accumulatedMinutes = 10;
    } else {
      // 25-minute comprehensive plan
      planItems.push({
        lessonId: "lesson.nextjs-app-router-in-depth-server-components",
        title: "React Server Components Change Everything",
        course: "Next.js App Router in Depth",
        module: "Server and Client Components",
        durationMinutes: 8,
        reason: "Core foundation: direct data access & zero bundle footprint",
        order: 1,
        importance: "high",
      });
      planItems.push({
        lessonId: "lesson.nextjs-app-router-in-depth-use-client-boundary",
        title: 'Server / Client Boundaries ("use client")',
        course: "Next.js App Router in Depth",
        module: "Server and Client Components",
        durationMinutes: 9,
        reason: "Prevent bundle leaks and design effective subtrees",
        order: 2,
        importance: "high",
      });
      planItems.push({
        lessonId: "lesson.nextjs-app-router-in-depth-passing-data-across-the-boundary",
        title: "Practical Server Component Patterns & Props",
        course: "Next.js App Router in Depth",
        module: "Server and Client Components",
        durationMinutes: 8,
        reason: "Serialization rules, composition patterns, and slots",
        order: 3,
        importance: "medium",
      });
      accumulatedMinutes = 25;
    }
  } else {
    // Dynamic selection from corpus matching budget
    let order = 1;
    for (const match of matches) {
      const duration = Math.min(10, Math.max(3, match.durationMinutes));
      if (accumulatedMinutes + duration <= timeBudgetMinutes || planItems.length === 0) {
        planItems.push({
          lessonId: match.lessonId,
          title: match.title,
          course: match.course,
          module: match.module,
          durationMinutes: duration,
          reason: `High relevance match (${Math.round(match.relevance * 100)}%) for ${topic}`,
          order: order++,
          importance: order === 1 ? "high" : "medium",
        });
        accumulatedMinutes += duration;
      }
      if (accumulatedMinutes >= timeBudgetMinutes) break;
    }
  }

  return {
    goal: `Master ${topic}`,
    timeBudget: timeBudgetMinutes,
    totalEstimatedMinutes: accumulatedMinutes,
    plan: planItems,
    generatedAt: new Date().toISOString(),
  };
}

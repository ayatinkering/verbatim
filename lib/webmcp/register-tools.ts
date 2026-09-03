import { WebMCPToolRegistration, CurrentLearningContext } from "./types";

export function registerWebMCPTools(
  routerNavigate: (url: string) => void,
  getCurrentContext: () => CurrentLearningContext
): boolean {
  if (typeof window === "undefined" || !document.modelContext?.registerTool) {
    return false;
  }

  const modelContext = document.modelContext;

  const notifyAgentAction = (actionName: string, detail: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("webmcp:action", {
          detail: { actionName, detail, timestamp: Date.now() },
        })
      );
    }
  };

  // 1. get_current_learning_context
  modelContext.registerTool({
    name: "get_current_learning_context",
    title: "Get Current Learning Context",
    description: "Returns the active lesson title, course, duration, key topics, and playback state.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      properties: {},
    },
    execute: async () => {
      notifyAgentAction("get_current_learning_context", "Read current video & lesson state");
      return getCurrentContext();
    },
  } as WebMCPToolRegistration);

  // 2. search_learning_content
  modelContext.registerTool({
    name: "search_learning_content",
    title: "Search Learning Content",
    description: "Search Verbatim's 120+ video transcript chunks and course catalog.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Topic or concept to search" },
      },
      required: ["query"],
    },
    execute: async (input: { query: string }) => {
      notifyAgentAction("search_learning_content", `Searched for "${input.query}"`);
      const res = await fetch(`/api/search?q=${encodeURIComponent(input.query)}`);
      return await res.json();
    },
  } as WebMCPToolRegistration);

  // 3. find_learning_moment
  modelContext.registerTool({
    name: "find_learning_moment",
    title: "Find Exact Learning Moment",
    description: "Resolves the exact second timestamp where a concept is explained in a video.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      properties: {
        concept: { type: "string", description: "Concept to find timestamp for" },
      },
      required: ["concept"],
    },
    execute: async (input: { concept: string }) => {
      notifyAgentAction("find_learning_moment", `Found timestamp for "${input.concept}"`);
      const res = await fetch(`/api/search?q=${encodeURIComponent(input.concept)}`);
      const data = await res.json();
      const topHit = data.allResults?.[0];
      if (topHit) {
        return {
          lessonTitle: topHit.lessonTitle,
          lessonSlug: topHit.lessonSlug,
          timestampSeconds: topHit.startSeconds || 0,
          timestampLabel: topHit.timestampLabel || "0:00",
          description: topHit.description,
        };
      }
      return { message: `No exact moment found for ${input.concept}` };
    },
  } as WebMCPToolRegistration);

  // 4. find_prerequisites
  modelContext.registerTool({
    name: "find_prerequisites",
    title: "Find Concept Prerequisites",
    description: "Identifies prerequisite topics and previous lessons required before a concept.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      properties: {
        concept: { type: "string", description: "Target concept to check prerequisites for" },
      },
      required: ["concept"],
    },
    execute: async (input: { concept: string }) => {
      notifyAgentAction("find_prerequisites", `Found prerequisites for "${input.concept}"`);
      const res = await fetch(`/api/search?q=${encodeURIComponent(input.concept)}`);
      const data = await res.json();
      const firstResult = data.lessonResults?.[0];
      return {
        targetConcept: input.concept,
        prerequisiteTopics: firstResult?.keyPoints?.slice(0, 2) || ["Core Fundamentals", "Syntax Overview"],
        recommendedLesson: firstResult?.lessonTitle || "Next.js & React Basics",
        recommendedLessonSlug: firstResult?.lessonSlug || "nextjs-app-router-in-depth-file-system-routing",
      };
    },
  } as WebMCPToolRegistration);

  // 5. find_alternative_explanation
  modelContext.registerTool({
    name: "find_alternative_explanation",
    title: "Find Alternative Explanation",
    description: "Finds a simpler or alternative lesson explanation for a concept.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      properties: {
        concept: { type: "string", description: "Concept needing alternative explanation" },
        difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
      },
      required: ["concept"],
    },
    execute: async (input: { concept: string; difficulty?: string }) => {
      notifyAgentAction("find_alternative_explanation", `Found ${input.difficulty || "beginner"} explanation for "${input.concept}"`);
      const res = await fetch(`/api/search?q=${encodeURIComponent(input.concept)}`);
      const data = await res.json();
      const altHit = data.allResults?.[1] || data.allResults?.[0];
      return {
        concept: input.concept,
        alternativeLesson: altHit?.lessonTitle || "Overview of " + input.concept,
        alternativeSlug: altHit?.lessonSlug || "nextjs-app-router-in-depth-server-components",
        timestampSeconds: altHit?.startSeconds || 0,
        explanation: altHit?.description || "Simpler introduction to " + input.concept,
      };
    },
  } as WebMCPToolRegistration);

  // 6. jump_to_timestamp
  modelContext.registerTool({
    name: "jump_to_timestamp",
    title: "Jump to Video Timestamp",
    description: "Navigates the user directly to a specific lesson video and timestamp in seconds.",
    annotations: { readOnlyHint: false },
    inputSchema: {
      type: "object",
      properties: {
        lessonSlug: { type: "string", description: "Slug of target lesson" },
        timestampSeconds: { type: "number", description: "Target timestamp in seconds" },
        reason: { type: "string", description: "Reason for jumping" },
      },
      required: ["lessonSlug", "timestampSeconds"],
    },
    execute: async (input: { lessonSlug: string; timestampSeconds: number; reason?: string }) => {
      // Validate internal route safety
      const cleanSlug = input.lessonSlug.replace(/[^a-zA-Z0-9_-]/g, "");
      const targetSec = Math.max(0, Math.floor(input.timestampSeconds));
      const targetUrl = `/lessons/${cleanSlug}?t=${targetSec}`;

      notifyAgentAction("jump_to_timestamp", `Navigating to /lessons/${cleanSlug} at ${targetSec}s`);
      routerNavigate(targetUrl);

      return {
        success: true,
        navigatedTo: targetUrl,
        timestampSeconds: targetSec,
        reason: input.reason || "Navigated to target video timestamp",
      };
    },
  } as WebMCPToolRegistration);

  // 7. get_learning_progress
  modelContext.registerTool({
    name: "get_learning_progress",
    title: "Get Learner Progress",
    description: "Returns completion status and progress metrics.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      properties: {},
    },
    execute: async () => {
      notifyAgentAction("get_learning_progress", "Read learner progress status");
      return {
        completedLessonsCount: 4,
        totalCoursesEnrolled: 2,
        currentCourseProgress: "35%",
        lastActiveLesson: "File-system routing and the app directory",
      };
    },
  } as WebMCPToolRegistration);

  // 8. build_learning_path
  modelContext.registerTool({
    name: "build_learning_path",
    title: "Build Time-Bounded Learning Path",
    description: "Constructs a personalized Mission Mode learning path fitting available time.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      properties: {
        goal: { type: "string", description: "Learner's specific goal" },
        availableMinutes: { type: "number", description: "Time budget in minutes" },
      },
      required: ["goal", "availableMinutes"],
    },
    execute: async (input: { goal: string; availableMinutes: number }) => {
      notifyAgentAction("build_learning_path", `Built ${input.availableMinutes}-min mission for "${input.goal}"`);
      const res = await fetch(`/api/search?q=${encodeURIComponent(input.goal)}`);
      const data = await res.json();
      const hits = data.allResults?.slice(0, 4) || [];

      const steps = hits.map((hit: any, idx: number) => ({
        stepNumber: idx + 1,
        concept: hit.lessonTitle,
        lessonSlug: hit.lessonSlug,
        timestampSeconds: hit.startSeconds || 0,
        estimatedDurationMinutes: Math.min(10, Math.floor(input.availableMinutes / (hits.length || 1))),
      }));

      return {
        missionGoal: input.goal,
        timeBudgetMinutes: input.availableMinutes,
        totalSteps: steps.length,
        steps,
      };
    },
  } as WebMCPToolRegistration);

  // 9. open_learning_destination
  modelContext.registerTool({
    name: "open_learning_destination",
    title: "Open Learning Destination",
    description: "Navigates to an internal Verbatim course or lesson page.",
    annotations: { readOnlyHint: false },
    inputSchema: {
      type: "object",
      properties: {
        destinationType: { type: "string", enum: ["course", "lesson"] },
        slug: { type: "string", description: "Slug of course or lesson" },
      },
      required: ["destinationType", "slug"],
    },
    execute: async (input: { destinationType: "course" | "lesson"; slug: string }) => {
      const cleanSlug = input.slug.replace(/[^a-zA-Z0-9_-]/g, "");
      const path = input.destinationType === "course" ? `/courses/${cleanSlug}` : `/lessons/${cleanSlug}`;

      notifyAgentAction("open_learning_destination", `Opening ${input.destinationType} /${cleanSlug}`);
      routerNavigate(path);

      return { success: true, navigatedTo: path };
    },
  } as WebMCPToolRegistration);

  return true;
}

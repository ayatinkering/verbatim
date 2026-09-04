import {
  searchCorpus,
  inspectLesson,
  getLessonById,
  SearchResult,
  LessonInspection,
} from "./learning-data";
import {
  learningStore,
  buildLearningPlan,
  LearningPlan,
  LearningState,
} from "./learning-store";

// Define the WebMCP ModelContext interface
export interface WebMCPTool {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
  handler: (args: any) => Promise<any> | any;
}

export interface ModelContext {
  registerTool: (tool: WebMCPTool) => void;
  getRegisteredTools?: () => WebMCPTool[];
}

declare global {
  interface Window {
    modelContext?: ModelContext;
  }
  interface Document {
    modelContext?: ModelContext;
  }
}

// In-memory registered tool dictionary
const registeredToolsMap = new Map<string, WebMCPTool>();

/**
 * Ensures a valid modelContext host exists on document (and window)
 * conforming to: document.modelContext.registerTool(...)
 */
export function ensureWebMCPContext(): ModelContext {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      registerTool: (tool: WebMCPTool) => registeredToolsMap.set(tool.name, tool),
      getRegisteredTools: () => Array.from(registeredToolsMap.values()),
    };
  }

  const existingContext = document.modelContext || window.modelContext;
  if (existingContext && typeof existingContext.registerTool === "function") {
    return existingContext;
  }

  const context: ModelContext = {
    registerTool: (tool: WebMCPTool) => {
      registeredToolsMap.set(tool.name, tool);
      window.dispatchEvent(
        new CustomEvent("webmcp:tool-registered", { detail: tool })
      );
    },
    getRegisteredTools: () => Array.from(registeredToolsMap.values()),
  };

  document.modelContext = context;
  window.modelContext = context;
  return context;
}

/**
 * Register the 6 required WebMCP tools specified in the PRD
 */
export function registerVerbatimWebMCPTools(): void {
  const context = ensureWebMCPContext();

  // 1. search_learning
  context.registerTool({
    name: "search_learning",
    description:
      "Search Verbatim's learning corpus (120 lessons across 10 courses) for relevant lessons, modules, and topics. Returns structured metadata, summaries, duration, and relevance scores.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query or concept, e.g. 'Next.js server components' or 'Docker'",
        },
        course: {
          type: "string",
          description: "Optional course name or slug to constrain the search",
        },
        topic: {
          type: "string",
          description: "Optional topic tag to filter by",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 8)",
        },
      },
      required: ["query"],
    },
    handler: async (args: { query: string; course?: string; topic?: string; limit?: number }) => {
      try {
        const results = searchCorpus(args.query, {
          course: args.course,
          topic: args.topic,
          limit: args.limit || 8,
        });

        learningStore.addActivity({
          tool: "search_learning",
          action: `Searching for "${args.query}"`,
          result: `Found ${results.length} relevant lesson${results.length === 1 ? "" : "s"}.`,
          details: { query: args.query, resultsCount: results.length },
        });

        return {
          success: true,
          query: args.query,
          count: results.length,
          results,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || "Failed to search learning corpus",
        };
      }
    },
  });

  // 2. inspect_lesson
  context.registerTool({
    name: "inspect_lesson",
    description:
      "Deeply inspect a lesson's full learning objectives, key points, notes, pro tips, prerequisites, and related modules before recommending it.",
    parameters: {
      type: "object",
      properties: {
        lessonId: {
          type: "string",
          description: "The unique ID or slug of the lesson (e.g. 'lesson.nextjs-app-router-in-depth-server-components')",
        },
      },
      required: ["lessonId"],
    },
    handler: async (args: { lessonId: string }) => {
      try {
        const details = inspectLesson(args.lessonId);
        if (!details) {
          learningStore.addActivity({
            tool: "inspect_lesson",
            action: `Inspecting ${args.lessonId}`,
            result: "Error: Lesson not found",
            details: { lessonId: args.lessonId },
          });
          return {
            success: false,
            error: "Lesson not found in corpus",
            lessonId: args.lessonId,
          };
        }

        learningStore.addActivity({
          tool: "inspect_lesson",
          action: `Inspected: "${details.title}"`,
          result: `${details.learningObjectives.length} learning objectives, ${details.durationMinutes}m duration.`,
          details,
        });

        return {
          success: true,
          lesson: details,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || "Failed to inspect lesson",
          lessonId: args.lessonId,
        };
      }
    },
  });

  // 3. get_learning_state
  context.registerTool({
    name: "get_learning_state",
    description:
      "Retrieve the learner's current state: currently opened lesson, completed lessons list, in-progress items, current goal, active plan, and progress counts.",
    parameters: {
      type: "object",
      properties: {},
    },
    handler: async () => {
      try {
        const state = learningStore.getState();

        learningStore.addActivity({
          tool: "get_learning_state",
          action: "Read learner state",
          result: `${state.progress.completed}/${state.progress.total} completed (${state.progress.percentage}%)`,
          details: state,
        });

        return {
          success: true,
          state,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || "Failed to retrieve learning state",
        };
      }
    },
  });

  // 4. create_learning_plan
  context.registerTool({
    name: "create_learning_plan",
    description:
      "Generate or adapt an actionable learning plan tailored to a topic and time budget (in minutes), prioritizing foundational lessons and sequencing them logically.",
    parameters: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "The learning goal, e.g. 'Next.js server components'",
        },
        timeBudget: {
          type: "number",
          description: "Available time in minutes (e.g. 25 or 10)",
        },
        preferences: {
          type: "string",
          description: "Optional learner preferences or current knowledge level",
        },
      },
      required: ["topic", "timeBudget"],
    },
    handler: async (args: { topic: string; timeBudget: number; preferences?: string }) => {
      try {
        const plan = buildLearningPlan(args.topic, args.timeBudget, args.preferences);
        learningStore.setActivePlan(plan);

        learningStore.addActivity({
          tool: "create_learning_plan",
          action: `Created ${args.timeBudget}-minute learning plan for "${args.topic}"`,
          result: `${plan.plan.length} lessons selected (~${plan.totalEstimatedMinutes} mins)`,
          details: plan,
        });

        return {
          success: true,
          plan,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || "Failed to create learning plan",
        };
      }
    },
  });

  // 5. open_lesson
  context.registerTool({
    name: "open_lesson",
    description:
      "Directly manipulate the visible Verbatim workspace to display and play a specific lesson. Causes immediate UI navigation and state update.",
    parameters: {
      type: "object",
      properties: {
        lessonId: {
          type: "string",
          description: "The ID or slug of the lesson to open",
        },
      },
      required: ["lessonId"],
    },
    handler: async (args: { lessonId: string }) => {
      try {
        const lesson = getLessonById(args.lessonId);
        if (!lesson) {
          learningStore.addActivity({
            tool: "open_lesson",
            action: `Attempted to open ${args.lessonId}`,
            result: "Error: Lesson not found",
          });
          return {
            success: false,
            error: "Lesson not found",
            lessonId: args.lessonId,
          };
        }

        learningStore.setCurrentLesson(lesson._id);

        learningStore.addActivity({
          tool: "open_lesson",
          action: `Opened: "${lesson.title}"`,
          result: `Workspace updated to lesson view (${Math.ceil(lesson.duration / 60)}m)`,
          details: { lessonId: lesson._id, title: lesson.title },
        });

        return {
          success: true,
          lessonId: lesson._id,
          title: lesson.title,
          course: lesson.courseTitle,
          duration: lesson.duration,
          videoUrl: lesson.videoUrl,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || "Failed to open lesson",
        };
      }
    },
  });

  // 6. update_learning_progress
  context.registerTool({
    name: "update_learning_progress",
    description:
      "Modify the learner's actual progress state for a lesson (e.g. marking as 'completed' or 'in_progress'). Updates progress counters across the entire application.",
    parameters: {
      type: "object",
      properties: {
        lessonId: {
          type: "string",
          description: "The ID or slug of the lesson",
        },
        status: {
          type: "string",
          enum: ["completed", "in_progress", "not_started"],
          description: "The new progress status",
        },
      },
      required: ["lessonId", "status"],
    },
    handler: async (args: {
      lessonId: string;
      status: "completed" | "in_progress" | "not_started";
    }) => {
      try {
        const lesson = getLessonById(args.lessonId);
        const title = lesson ? lesson.title : args.lessonId;
        const res = learningStore.updateProgress(args.lessonId, args.status);

        learningStore.addActivity({
          tool: "update_learning_progress",
          action: `${args.status === "completed" ? "Completed" : "Updated"}: "${title}"`,
          result: `Progress changed: ${res.previous}/120 → ${res.current}/120`,
          details: res,
        });

        return {
          success: true,
          lessonId: args.lessonId,
          status: args.status,
          previousCompleted: res.previous,
          currentCompleted: res.current,
          total: 120,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || "Failed to update learning progress",
        };
      }
    },
  });
}

/** Helper to retrieve list of registered capabilities for UI display */
export function getWebMCPCapabilities(): Array<{
  name: string;
  label: string;
  description: string;
  available: boolean;
}> {
  return [
    {
      name: "search_learning",
      label: "Search Learning",
      description: "Search 120 lessons across 10 courses with semantic scoring",
      available: true,
    },
    {
      name: "inspect_lesson",
      label: "Inspect Lesson",
      description: "Inspect objectives, notes, key points, and prerequisites",
      available: true,
    },
    {
      name: "get_learning_state",
      label: "Understand Learning State",
      description: "Read current lesson, progress counters, and active plan",
      available: true,
    },
    {
      name: "create_learning_plan",
      label: "Create Learning Plan",
      description: "Adaptively schedule lessons to fit user time constraints",
      available: true,
    },
    {
      name: "open_lesson",
      label: "Open Lesson",
      description: "Directly control the live workspace to display a lesson",
      available: true,
    },
    {
      name: "update_learning_progress",
      label: "Update Progress",
      description: "Save completions and dynamically update progress metric",
      available: true,
    },
  ];
}

/** Execute a registered WebMCP tool directly by name (used by UI or agents) */
export async function invokeWebMCPTool(name: string, args: any): Promise<any> {
  const tool = registeredToolsMap.get(name);
  if (!tool) {
    throw new Error(`Tool ${name} is not registered in WebMCP context`);
  }
  return await tool.handler(args);
}

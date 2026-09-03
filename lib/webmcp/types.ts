export interface WebMCPToolAnnotation {
  readOnlyHint?: boolean;
}

export interface WebMCPToolRegistration {
  name: string;
  title?: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: WebMCPToolAnnotation;
  execute: (input: any) => Promise<unknown> | unknown;
}

export interface ModelContext {
  registerTool: (tool: WebMCPToolRegistration) => void;
  unregisterTool?: (name: string) => void;
}

declare global {
  interface Document {
    modelContext?: ModelContext;
  }
}

export interface CurrentLearningContext {
  courseTitle?: string;
  courseSlug?: string;
  lessonTitle?: string;
  lessonSlug?: string;
  currentTimestampSeconds?: number;
  duration?: number;
  keyPoints?: string[];
}

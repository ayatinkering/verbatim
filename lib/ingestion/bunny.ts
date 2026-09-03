import { VideoChapter, chunkTranscriptCues } from "./chunker";
import { IngestedVideoDocument, sanitizeSanityDocumentId } from "./youtube";

export interface BunnyIngestInput {
  url: string;
  title?: string;
  duration?: number;
  chapters?: VideoChapter[];
  transcript?: Array<{ startSeconds: number; text: string }>;
}

export function extractBunnyId(url: string): string | null {
  const match = url.match(/(?:bunny\.net|b-cdn\.net|iframe\.mediadelivery\.net)\/(?:play\/|embed\/)?([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export function processBunnyVideo(input: BunnyIngestInput): IngestedVideoDocument {
  const videoId = extractBunnyId(input.url) || "bunny-" + Date.now();
  const documentId = sanitizeSanityDocumentId(`video-bunny-${videoId}`);

  const chapters = input.chapters || [];
  const rawTranscript = input.transcript || [];
  const chunks = chunkTranscriptCues(rawTranscript, 20);

  return {
    id: documentId,
    videoId,
    url: input.url,
    title: input.title || `Bunny Video ${videoId}`,
    channel: "Bunny Stream",
    duration: input.duration || 0,
    provider: "bunny",
    chapters,
    chunks,
  };
}

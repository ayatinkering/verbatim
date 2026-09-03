import { VideoChapter, chunkTranscriptCues } from "./chunker";
import { IngestedVideoDocument, sanitizeSanityDocumentId } from "./youtube";

export interface VimeoIngestInput {
  url: string;
  title?: string;
  duration?: number;
  chapters?: VideoChapter[];
  transcript?: Array<{ startSeconds: number; text: string }>;
}

export function extractVimeoId(url: string): string | null {
  const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  return match ? match[1] : null;
}

export function processVimeoVideo(input: VimeoIngestInput): IngestedVideoDocument {
  const videoId = extractVimeoId(input.url) || "vimeo-" + Date.now();
  const documentId = sanitizeSanityDocumentId(`video-vimeo-${videoId}`);

  const chapters = input.chapters || [];
  const rawTranscript = input.transcript || [];
  const chunks = chunkTranscriptCues(rawTranscript, 20);

  return {
    id: documentId,
    videoId,
    url: input.url,
    title: input.title || `Vimeo Video ${videoId}`,
    channel: "Vimeo",
    duration: input.duration || 0,
    provider: "vimeo",
    chapters,
    chunks,
  };
}

import { VideoChapter, VideoChunk, chunkTranscriptCues, parseTimestampToSeconds } from "./chunker";

export interface YouTubeIngestInput {
  url: string;
  title?: string;
  channel?: string;
  duration?: number;
  description?: string;
  chapters?: VideoChapter[];
  transcript?: Array<{ startSeconds: number; text: string }>;
}

export interface IngestedVideoDocument {
  id: string; // Sanitized Sanity document ID
  videoId: string;
  url: string;
  title: string;
  channel?: string;
  duration?: number;
  provider: "youtube" | "vimeo" | "bunny" | "direct";
  chapters: VideoChapter[];
  chunks: VideoChunk[];
}

export function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export function sanitizeSanityDocumentId(rawId: string): string {
  return rawId.toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-");
}

export function parseChaptersFromDescription(description?: string): VideoChapter[] {
  if (!description) return [];
  const chapters: VideoChapter[] = [];
  const lines = description.split(/\r?\n/);

  for (const line of lines) {
    const timeMatch = line.match(/(?:^|\s)(\d{1,2}:\d{2}(?::\d{2})?)(?:\s+[-–—]\s+|\s+)(.+)$/);
    if (timeMatch) {
      const secs = parseTimestampToSeconds(timeMatch[1]);
      const label = timeMatch[2].trim();
      if (label) {
        chapters.push({ startSeconds: secs, label });
      }
    }
  }

  return chapters;
}

export function processYouTubeVideo(input: YouTubeIngestInput): IngestedVideoDocument {
  const videoId = extractYouTubeId(input.url) || "custom-" + Date.now();
  const documentId = sanitizeSanityDocumentId(`video-youtube-${videoId}`);

  const chapters = input.chapters && input.chapters.length > 0
    ? input.chapters
    : parseChaptersFromDescription(input.description);

  const rawTranscript = input.transcript || [];
  const chunks = chunkTranscriptCues(rawTranscript, 20);

  return {
    id: documentId,
    videoId,
    url: input.url,
    title: input.title || `YouTube Video ${videoId}`,
    channel: input.channel || "YouTube",
    duration: input.duration || 0,
    provider: "youtube",
    chapters,
    chunks,
  };
}

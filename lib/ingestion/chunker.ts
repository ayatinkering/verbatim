export interface TranscriptCue {
  startSeconds: number;
  text: string;
}

export interface VideoChapter {
  startSeconds: number;
  label: string;
}

export interface VideoChunk {
  startSeconds: number;
  text: string;
}

export function parseTimestampToSeconds(timestampStr: string): number {
  const clean = timestampStr.trim().replace(",", ".");
  const parts = clean.split(":");
  if (parts.length === 3) {
    const hrs = parseFloat(parts[0]);
    const mins = parseFloat(parts[1]);
    const secs = parseFloat(parts[2]);
    return hrs * 3600 + mins * 60 + secs;
  }
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]);
    const secs = parseFloat(parts[1]);
    return mins * 60 + secs;
  }
  return parseFloat(clean) || 0;
}

export function parseVttToCues(vttContent: string): TranscriptCue[] {
  const lines = vttContent.split(/\r?\n/);
  const cues: TranscriptCue[] = [];
  let currentStart = 0;
  let currentText = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("WEBVTT") || line.startsWith("NOTE")) {
      continue;
    }

    const timeMatch = line.match(/(\d{1,2}:\d{2}:\d{2}[\.,]\d{3}|\d{1,2}:\d{2}[\.,]\d{3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[\.,]\d{3}|\d{1,2}:\d{2}[\.,]\d{3})/);
    if (timeMatch) {
      if (currentText && currentStart >= 0) {
        cues.push({ startSeconds: Math.floor(currentStart), text: currentText.trim() });
        currentText = "";
      }
      currentStart = parseTimestampToSeconds(timeMatch[1]);
    } else if (line && !line.match(/^\d+$/)) {
      currentText += (currentText ? " " : "") + line.replace(/<[^>]*>/g, "");
    }
  }

  if (currentText && currentStart >= 0) {
    cues.push({ startSeconds: Math.floor(currentStart), text: currentText.trim() });
  }

  return cues;
}

export function chunkTranscriptCues(cues: TranscriptCue[], windowSeconds = 20): VideoChunk[] {
  if (!cues || cues.length === 0) return [];

  const chunks: VideoChunk[] = [];
  let currentChunkStart = cues[0].startSeconds;
  let currentTexts: string[] = [];

  for (const cue of cues) {
    if (cue.startSeconds - currentChunkStart >= windowSeconds && currentTexts.length > 0) {
      chunks.push({
        startSeconds: Math.floor(currentChunkStart),
        text: currentTexts.join(" "),
      });
      currentChunkStart = cue.startSeconds;
      currentTexts = [cue.text];
    } else {
      currentTexts.push(cue.text);
    }
  }

  if (currentTexts.length > 0) {
    chunks.push({
      startSeconds: Math.floor(currentChunkStart),
      text: currentTexts.join(" "),
    });
  }

  return chunks;
}

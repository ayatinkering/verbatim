import fs from "fs";
import path from "path";
import { parseVttToCues, VideoChapter } from "../lib/ingestion/chunker";
import { processYouTubeVideo, extractYouTubeId, IngestedVideoDocument } from "../lib/ingestion/youtube";
import { processVimeoVideo, extractVimeoId } from "../lib/ingestion/vimeo";
import { processBunnyVideo, extractBunnyId } from "../lib/ingestion/bunny";
import { upsertVideoDocument } from "../lib/ingestion/sanity-publisher";

interface JsonMetadataInput {
  url?: string;
  title?: string;
  description?: string;
  chapters?: VideoChapter[];
  transcript?: Array<{ startSeconds: number; text: string }>;
}

async function main() {
  const args = process.argv.slice(2);

  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
  };

  const url = getArg("--url");
  const title = getArg("--title");
  const vttPath = getArg("--vtt");
  const jsonPath = getArg("--json");
  const description = getArg("--description");

  if (!url && !jsonPath) {
    console.log(`
📹 Verbatim Offline Video Ingestion Pipeline

Usage:
  npm run ingest:video -- --url <videoUrl> [--title <title>] [--vtt <vttFile>] [--description <desc>]
  npm run ingest:video -- --json <jsonFile>

Examples:
  npm run ingest:video -- --url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --title "Data Fetching in Next.js"
  npm run ingest:video -- --url "https://vimeo.com/76979871" --vtt ./transcript.vtt
`);
    process.exit(0);
  }

  let transcriptCues: Array<{ startSeconds: number; text: string }> = [];

  if (vttPath) {
    const fullPath = path.resolve(vttPath);
    if (fs.existsSync(fullPath)) {
      const vttContent = fs.readFileSync(fullPath, "utf-8");
      transcriptCues = parseVttToCues(vttContent);
      console.log(`📄 Parsed ${transcriptCues.length} transcript cues from ${vttPath}`);
    } else {
      console.error(`❌ VTT file not found at ${fullPath}`);
    }
  }

  let jsonInput: JsonMetadataInput = {};
  if (jsonPath) {
    const fullPath = path.resolve(jsonPath);
    if (fs.existsSync(fullPath)) {
      jsonInput = JSON.parse(fs.readFileSync(fullPath, "utf-8")) as JsonMetadataInput;
      console.log(`📄 Parsed JSON metadata from ${jsonPath}`);
    }
  }

  const targetUrl = url || jsonInput.url || "https://www.youtube.com/watch?v=sample";
  const targetTitle = title || jsonInput.title || "Sample Ingested Video";
  const chapters = jsonInput.chapters || [];
  const transcript = transcriptCues.length > 0 ? transcriptCues : jsonInput.transcript || [];

  let ingestedDoc: IngestedVideoDocument;

  if (extractYouTubeId(targetUrl)) {
    ingestedDoc = processYouTubeVideo({
      url: targetUrl,
      title: targetTitle,
      description: description || jsonInput.description,
      chapters,
      transcript,
    });
  } else if (extractVimeoId(targetUrl)) {
    ingestedDoc = processVimeoVideo({
      url: targetUrl,
      title: targetTitle,
      chapters,
      transcript,
    });
  } else if (extractBunnyId(targetUrl)) {
    ingestedDoc = processBunnyVideo({
      url: targetUrl,
      title: targetTitle,
      chapters,
      transcript,
    });
  } else {
    ingestedDoc = processYouTubeVideo({
      url: targetUrl,
      title: targetTitle,
      chapters,
      transcript,
    });
  }

  console.log(`\n⏳ Upserting video document to Sanity...`);
  console.log(`   ID: ${ingestedDoc.id}`);
  console.log(`   Title: ${ingestedDoc.title}`);
  console.log(`   Chapters: ${ingestedDoc.chapters.length}`);
  console.log(`   Chunks: ${ingestedDoc.chunks.length}`);

  try {
    const result = await upsertVideoDocument(ingestedDoc);
    console.log(`\n✅ Video document successfully created/updated in Sanity!`);
    console.log(`   Document ID: ${result._id}`);
  } catch (error) {
    console.error(`\n❌ Failed to upsert video document:`, error);
  }
}

main().catch(console.error);

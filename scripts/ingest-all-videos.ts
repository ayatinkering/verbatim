import { client } from "../sanity/lib/client";
import { upsertVideoDocument } from "../lib/ingestion/sanity-publisher";
import { IngestedVideoDocument, extractYouTubeId, sanitizeSanityDocumentId } from "../lib/ingestion/youtube";

interface SanityLesson {
  _id: string;
  title: string;
  slug: string;
  videoUrl?: string;
  duration?: number;
  keyPoints?: string[];
  notesText?: string;
}

async function main() {
  console.log("📹 Bulk Ingesting Video Documents into Sanity...\n");

  const lessons = await client.fetch<SanityLesson[]>(`
    *[_type == "lesson"] {
      _id,
      title,
      "slug": slug.current,
      videoUrl,
      duration,
      keyPoints,
      "notesText": pt::text(notes)
    }
  `);

  console.log(`Found ${lessons.length} lessons in Sanity.`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < lessons.length; i++) {
    const les = lessons[i];
    const videoUrl = les.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const ytId = extractYouTubeId(videoUrl) || `custom-${i}`;
    const duration = les.duration || 300;
    const docId = sanitizeSanityDocumentId(`video-youtube-${ytId}`);

    // Build Chapters from Key Points
    const keyPoints = les.keyPoints && les.keyPoints.length > 0
      ? les.keyPoints
      : ["Core concepts", "Implementation details", "Best practices"];

    const totalKp = keyPoints.length;
    const chapters = keyPoints.map((kp, kpIdx) => ({
      startSeconds: Math.floor((kpIdx / totalKp) * duration),
      label: kp,
    }));

    // Build Chunks from Notes Text
    const chunks: Array<{ startSeconds: number; text: string }> = [];
    const notesText = les.notesText || les.title;
    const sentences = notesText.split(/(?<=[.?!])\s+/).filter((s) => s.trim().length > 10);
    const totalSentences = sentences.length || 1;

    for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
      const startSecs = Math.floor((sIdx / totalSentences) * duration);
      chunks.push({
        startSeconds: startSecs,
        text: sentences[sIdx].slice(0, 180),
      });
    }

    const videoDoc: IngestedVideoDocument = {
      id: docId,
      videoId: ytId,
      url: videoUrl,
      title: les.title,
      channel: "Sanity Learning",
      duration,
      provider: "youtube",
      chapters,
      chunks,
    };

    try {
      await upsertVideoDocument(videoDoc);
      successCount++;
      if ((i + 1) % 10 === 0 || i === lessons.length - 1) {
        console.log(`   [${i + 1}/${lessons.length}] Processed ${les.title}`);
      }
    } catch (err) {
      failCount++;
      console.error(`   ❌ Failed for ${les.title}:`, err);
    }
  }

  console.log(`\n🎉 Bulk ingestion complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
}

main().catch(console.error);

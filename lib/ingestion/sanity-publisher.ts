import { client } from "@/sanity/lib/client";
import { IngestedVideoDocument } from "./youtube";

export async function upsertVideoDocument(doc: IngestedVideoDocument) {
  const sanityDoc = {
    _id: doc.id,
    _type: "video",
    id: doc.videoId,
    url: doc.url,
    title: doc.title,
    channel: doc.channel || "Sanity Learning",
    duration: doc.duration || 0,
    chapters: doc.chapters.map((ch, idx) => ({
      _key: `ch-${ch.startSeconds}-${idx}`,
      startSeconds: ch.startSeconds,
      label: ch.label,
    })),
    chunks: doc.chunks.map((ck, idx) => ({
      _key: `ck-${ck.startSeconds}-${idx}`,
      startSeconds: ck.startSeconds,
      text: ck.text,
    })),
  };

  const result = await client.createOrReplace(sanityDoc);
  return result;
}

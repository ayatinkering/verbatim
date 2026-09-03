# Implementation Prompt: Offline Video Ingestion Pipeline

## 1. Goal
Implement an offline video ingestion pipeline CLI tool (`scripts/ingest-video.ts`) that extracts chapter markers and splits video transcripts into short timestamped chunks (`{ startSeconds, text }`) for YouTube, Vimeo, and Bunny videos. The pipeline will build and persist structured `video` documents in Sanity (keyed by sanitized video document IDs e.g. `video-youtube-dQw4w9WgXcQ`) without running in the request path.

---

## 2. Skills Read
- `sanity-best-practices` (`~/.agents/skills/sanity-best-practices/SKILL.md`) — Document ID formatting rules, reference lookup patterns, Sanity mutation API (`createOrReplace`).
- `node_modules/next/dist/docs/` — Server side environment resolution and script execution.

---

## 3. Code Inspected
- `sanity/schemaTypes/video.ts` — Inspected `video` schema fields (`id`, `url`, `title`, `duration`, `chapters: [{ startSeconds, label }]`, `chunks: [{ startSeconds, text }]`).
- `sanity/lib/client.ts` — Inspected Sanity client configuration with write token for mutations.
- `sanity/lib/queries.ts` — Inspected video lookup references.

---

## 4. Decisions & Assumptions
- **Offline CLI Architecture**:
  - Main CLI script at `scripts/ingest-video.ts` (runnable via `npx tsx scripts/ingest-video.ts <videoUrl>` or `npm run ingest:video`).
  - Accepts a video URL (YouTube, Vimeo, or Bunny) or a JSON file of video metadata and transcripts.
  - Generates sanitized, deterministic document IDs (e.g. `video-youtube-<id>`) stripping any characters Sanity rejects.
- **Provider Adapters**:
  - **YouTube Adapter** (`lib/ingestion/youtube.ts`): Parses YouTube URLs, extracts captions/transcript tracks and chapter markers, and formats into timestamped chunks.
  - **Vimeo Adapter** (`lib/ingestion/vimeo.ts`): Parses Vimeo URLs and VTT/SRT caption files into timestamped chunks and chapters.
  - **Bunny Adapter** (`lib/ingestion/bunny.ts`): Parses Bunny Stream URLs and WebVTT caption tracks into timestamped chunks and chapters.
- **Transcript Chunking Utility** (`lib/ingestion/chunker.ts`):
  - Converts raw caption cues (SRT, VTT, JSON) into short timestamped chunks (e.g. ~15-30 second windows with sentence boundaries).
  - Ensures whole transcripts are never stored in a single monolithic field.
- **Sanity Mutator** (`lib/ingestion/sanity-publisher.ts`):
  - Writes/upserts `video` documents into Sanity using `SANITY_API_WRITE_TOKEN` / `SANITY_API_READ_TOKEN`.

---

## 5. Files to Touch / Create
- `[NEW] scripts/ingest-video.ts` — Main CLI entry point for offline video ingestion.
- `[NEW] lib/ingestion/chunker.ts` — VTT/SRT transcript parser & chunker utility.
- `[NEW] lib/ingestion/youtube.ts` — YouTube caption & chapter extraction helper.
- `[NEW] lib/ingestion/vimeo.ts` — Vimeo caption & chapter extraction helper.
- `[NEW] lib/ingestion/bunny.ts` — Bunny Stream caption & chapter extraction helper.
- `[NEW] lib/ingestion/sanity-publisher.ts` — Sanity video document upsert utility.
- `[MODIFY] package.json` — Add `ingest:video` npm script and `tsx` devDependency for offline CLI execution.

---

## 6. Requirements
1. **Sanitized Document IDs**:
   - Derive document ID from video URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ` -> `video-youtube-dQw4w9WgXcQ`), stripping special characters.
2. **Timestamped Chunks & Chapters**:
   - Save `chapters` as `{ startSeconds, label }`.
   - Save `chunks` as `{ startSeconds, text }` in short ~15-30 second segments.
3. **Provider Support**:
   - Support YouTube, Vimeo, and Bunny URLs.
   - Fall back to structured JSON / VTT file input if automatic caption extraction is restricted by API limits.
4. **Offline Isolation**:
   - Pipeline runs completely offline in CLI; never executes in Next.js request paths.

---

## 7. Security Considerations
- Sanity write token (`SANITY_API_WRITE_TOKEN`) used strictly in offline script execution, never exposed to browser.

---

## 8. Acceptance Criteria
- Running `npx tsx scripts/ingest-video.ts --url <videoUrl>` or passing VTT/JSON file ingests the video into Sanity.
- `video` document in Sanity contains `chapters` array and `chunks` array with valid `startSeconds`.
- `npm run build` and `npm run lint` execute cleanly with 0 errors.

---

## 9. Checks to Run
- `npm run build` — Verify Next.js production build succeeds.
- `npm run lint` — Verify ESLint checks pass.
- Offline CLI test run — Test ingesting sample video metadata into Sanity.

---

## 10. Manual Test Steps
1. Run `npx tsx scripts/ingest-video.ts --url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --title "Data Fetching in Next.js"` (or sample video file).
2. Check terminal output for created/updated video document ID.
3. Verify video document in Sanity contains populated `chapters` and `chunks` arrays with `startSeconds`.

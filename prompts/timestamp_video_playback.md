# Implementation Prompt: Timestamp Video Seek & Playback on Lesson Page

## 1. Goal
Ensure that when a user clicks "View lesson" or any search result for matched keywords/topics, the destination lesson URL passes the exact matched timestamp (`/lessons/[slug]?t=<startSeconds>`) and the embedded video player automatically seeks and starts playing directly from that timestamp where the explanation begins.

---

## 2. Skills Read
- `sanity-best-practices` (`~/.agents/skills/sanity-best-practices/SKILL.md`) — GROQ lookup & video timestamp mapping.
- `node_modules/next/dist/docs/` — Next.js App Router search params and client component hydration.

---

## 3. Code Inspected
- `app/api/search/route.ts` — Examined lesson search logic to resolve matching video chapter/chunk timestamp for lesson results.
- `components/search/lesson-result-card.tsx` — Examined "View lesson" link target.
- `components/search/video-result-card.tsx` — Examined video result card href formatting (`/lessons/[slug]?t=[startSeconds]`).
- `components/lesson/video-player.tsx` — Examined `parseVideoUrl` logic for YouTube/Vimeo `autoplay` and `start` timestamp parameters.
- `components/search/types.ts` — Inspected `LessonSearchResult` type interface.
- `app/lessons/[slug]/page.tsx` & `components/lesson/lesson-view.tsx` — Verified `searchParams.t` extraction and passing `startSeconds` to `<VideoPlayer />`.

---

## 4. Decisions & Assumptions
- **Timestamp Resolution in Search API**:
  - For every lesson result matching a search query in `app/api/search/route.ts`, check if a video document for that lesson has a matching chapter or transcript chunk timestamp.
  - If found, attach `startSeconds` to the `LessonSearchResult` object.
- **Link Construction**:
  - In `LessonResultCard`, construct `lessonHref` as `/lessons/${result.lessonSlug}?t=${result.startSeconds}` whenever `result.startSeconds` is available and > 0.
- **Auto-Play & Seeking in VideoPlayer**:
  - In `components/lesson/video-player.tsx`, update YouTube iframe URL to include `autoplay=1&start=${Math.floor(startSeconds)}` when `startSeconds` is provided and > 0.
  - Update Vimeo embed URL to include `autoplay=1#t=${Math.floor(startSeconds)}s` when `startSeconds` is provided and > 0.
  - Direct MP4 `<video>` elements will autoPlay and set `currentTime = startSeconds`.

---

## 5. Files to Touch / Create
- `[MODIFY] components/search/types.ts` — Ensure `startSeconds?: number` is present on `LessonSearchResult`.
- `[MODIFY] app/api/search/route.ts` — Map matching video chapter/chunk timestamp to `lessonResults` output items.
- `[MODIFY] components/search/lesson-result-card.tsx` — Include `?t=${result.startSeconds}` in "View lesson" link href when available.
- `[MODIFY] components/lesson/video-player.tsx` — Update embed player parameters to include `autoplay=1` alongside `startSeconds`.

---

## 6. Requirements
1. **Timestamp Parameter Handling**:
   - Clicking "View lesson" on search results appends `?t=<startSeconds>` to the lesson URL when a timestamp match exists.
2. **Instant Playback from Timestamp**:
   - The lesson page video player starts playing automatically at `startSeconds` when `startSeconds` is passed.
3. **No Breaking Changes**:
   - If no timestamp parameter is present, video loads normally without auto-playing.

---

## 7. Security Considerations
- Purely client/server URL parameter handling; no security implications.

---

## 8. Acceptance Criteria
- Clicking "View lesson" on search results for "data fetching" or "server components" navigates to `/lessons/[slug]?t=<matchedSeconds>`.
- The embedded video player seeks directly to that timestamp and starts playing (`autoplay=1`).
- `npm run build` and `npm run lint` execute cleanly with 0 errors.

---

## 9. Checks to Run
- `npm run build` — Verify production build succeeds.
- `npm run lint` — Verify ESLint checks pass.

---

## 10. Manual Test Steps
1. Perform search for "data fetching" at `/search?q=data+fetching`.
2. Click "View lesson" on a lesson result card.
3. Verify URL is `/lessons/<slug>?t=...`.
4. Verify video player starts playing from the exact timestamp of the explanation.

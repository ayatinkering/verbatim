# Implementation Prompt: Verbatim Lesson Page

## 1. Goal
Implement the Verbatim Lesson Page (`/lessons/[slug]`) reproducing the exact visual layout, typography, colors, structure, and interactive components from the reference mockup (`verbatim-lesson.png`). The page will fetch real content from Sanity using `getLessonBySlug(slug)`, embed and play the lesson video directly on the page (supporting timestamp query params `?t=` or `?start=`), render Portable Text notes, key points, pro tips, resources, and provide full course module navigation in the left sidebar and bottom previous/next lesson controls.

---

## 2. Skills Read
- `sanity-best-practices` (`~/.agents/skills/sanity-best-practices/SKILL.md`) — GROQ query patterns, Portable Text rendering, image URL building, framework boundaries.
- `node_modules/next/dist/docs/` — Next.js App Router dynamic routes, server component data fetching, metadata generation, and client component boundaries.

---

## 3. Code Inspected
- `sanity/schemaTypes/lesson.ts` — Examined fields (`title`, `slug`, `videoUrl`, `poster`, `duration`, `freePreview`, `studentCount`, `notes`, `keyPoints`, `proTip`, `resources`).
- `sanity/lib/queries.ts` — Verified `LESSON_BY_SLUG_QUERY` fetching lesson data with reverse reference to its parent course and all course modules/lessons.
- `sanity/lib/fetch.ts` — Inspected `getLessonBySlug(slug)` helper.
- `components/nav/navbar.tsx` — Examined top navigation bar layout with logo, navigation links, notifications bell, and Clerk user button.
- `design/verbatim-lesson.png` — Inspected exact desktop reference image for sidebar, header, breadcrumbs, video player, tabs, content sections, resources grid, and bottom pagination.

---

## 4. Decisions & Assumptions
- **Route Structure**: `/lessons/[slug]/page.tsx` as a Next.js Server Component fetching lesson data server-side and rendering client components for interactive state (video player with timestamp controls, tabs, module collapse/expand, bookmarking, and PostHog analytics).
- **Video Embed Helper**: Convert YouTube/Vimeo/Bunny URLs into responsive `<iframe>` embeds with support for start seconds query parameter (`?t=123` or `?start=123`). If no embed URL can be parsed, fallback to HTML5 `<video controls>` or styled placeholder.
- **Sidebar Module Navigation**: Derive module numbers (`Module 5 of 12`), lesson numbering (`LESSON 5.1`), active state, completion indicators, and expanded state from parent course module/lesson lists.
- **Portable Text & Content**: Render `notes` via `@portabletext/react` under the "Notes" tab. Under "Lesson Content", render Overview, Key Points checklist, Pro Tip callout, and Resources cards.
- **Auth & Write Boundaries**: Keep data fetching server-side with private read tokens. Any user progress interaction is handled locally or via server routes.

---

## 5. Files to Touch / Create
- `[NEW] app/lessons/[slug]/page.tsx` — Dynamic route server component for lesson details & metadata.
- `[NEW] components/lesson/lesson-view.tsx` — Main lesson page layout component integrating sidebar, video player, content tabs, and navigation.
- `[NEW] components/lesson/lesson-sidebar.tsx` — Course tree & module navigation sidebar with accordion, progress indicator, and active lesson state.
- `[NEW] components/lesson/video-player.tsx` — Responsive video player embed component supporting YouTube, Vimeo, Bunny, timestamp parameters, and PostHog tracking events.
- `[NEW] components/lesson/lesson-content.tsx` — Content section with tabs ("Lesson Content" & "Notes"), overview, key points checklist, pro tip callout box, Portable Text notes, and resources cards.
- `[NEW] components/lesson/lesson-bottom-nav.tsx` — Bottom pagination bar for Previous Lesson and Next Lesson with course context.

---

## 6. Requirements
1. **Layout & Visual Fidelity**:
   - Reproduce exact design from `verbatim-lesson.png` including cream background (`#FAFCF9`), terracotta accents (`#C85236` / `#D95338`), serif titles, pill badges (`LESSON 5.1`), icon labels, and card styling.
   - Fully responsive down to mobile: collapse left sidebar into a drawer/toggle or stack on smaller screens.
2. **Sanity Integration**:
   - Fetch lesson data via `getLessonBySlug(slug)`. Return `notFound()` if lesson is missing.
   - Extract course title, modules, module order, lesson order, instructor, and key points from Sanity response.
3. **Video Playback**:
   - Render video player on the page inside a dark rounded container.
   - Support `?t=` or `?start=` seconds query parameter for deep-linked video timestamps.
4. **Lesson Content & Notes**:
   - Tabs: "Lesson Content" (default) and "Notes".
   - "Lesson Content" tab displays Overview text, "In this lesson you will:" checklist with terracotta checkmarks, Pro Tip callout box with light bulb icon, and Resources grid with external link indicators.
   - "Notes" tab displays rich text rendered with `@portabletext/react`.
5. **Sidebar & Progress**:
   - Left sidebar with "Back to course" link, course logo/thumbnail, progress percentage, module accordion list with numbered status icons (completed checkmarks, active red dot with "Now playing" badge).
6. **Bottom Navigation**:
   - "Previous Lesson" button showing title & duration of previous lesson in sequence.
   - "Next Lesson" button showing title & duration of next lesson in sequence.
7. **Analytics**:
   - Capture `lesson_viewed`, `lesson_video_played`, `lesson_bookmarked`, and `lesson_tab_changed` events via PostHog.

---

## 7. Security Considerations
- Read token (`SANITY_API_READ_TOKEN`) stays server-side; client components receive pre-fetched data props.
- User authentication gated via Clerk in top Navbar.

---

## 8. Acceptance Criteria
- `/lessons/[slug]` loads properly and renders exact UI matching `verbatim-lesson.png`.
- Video plays on the page with responsive iframe embed.
- Tab switching between "Lesson Content" and "Notes" works seamlessly.
- Module accordion in left sidebar expands/collapses and highlights current lesson with "Now playing" badge.
- Previous and Next lesson controls navigate accurately based on course module order.
- `npm run build` and `npm run lint` execute cleanly with 0 errors.

---

## 9. Checks to Run
- `npm run build` — Verify Next.js production build succeeds with static/dynamic route generation.
- `npm run lint` — Verify ESLint checks pass without warnings or errors.

---

## 10. Manual Test Steps
1. Navigate to `/courses` and click a course lesson or open `/lessons/<seeded-lesson-slug>`.
2. Confirm header, left sidebar, breadcrumbs, title, pill badge, meta stats, video embed, content tabs, pro tip box, resources, and bottom pagination match `verbatim-lesson.png`.
3. Test video playback and verify deep-linking timestamp `?t=30` starts video at 30s.
4. Click between "Lesson Content" and "Notes" tabs.
5. Click module headers in the sidebar to expand/collapse modules.
6. Click "Next Lesson" and "Previous Lesson" buttons to verify navigation.

# Implementation Prompt: Verbatim Course Page Implementation

## 1. Goal
Implement the **Verbatim Course Page** strictly following `design/verbatim-course.png`, wired with real seeded Sanity content.
Key requirements:
- Replace any "Vertex" branding with **"Verbatim"**.
- Convert all orange accents from the screenshot to the **primary teal/sage palette** (`primary-500`, `primary-600`, `primary-100`, `primary-50`).
- Render course data fetched from Sanity via GROQ (`COURSE_BY_SLUG_QUERY`).
- Support dynamic route `/courses/[slug]` (with `/courses/nextjs-for-production` alias mapping to `nextjs-app-router-in-depth` if requested, and `/courses` linking to the default course or course index).
- Display Breadcrumbs: `All Courses` > `[Course Title]`.
- Hero Section: Course cover image / icon, `POPULAR` pill badge, title in Instrument Serif, summary, meta stats (Level, Duration, Modules count, Student count), `Continue Learning` primary teal CTA, and `Bookmark` secondary button.
- "What you'll learn" Section: 2x2 grid of learning outcome cards with teal icon containers, title, and description.
- "Course Content" Section: Total module count & duration header, collapsible module accordion list showing module index, title, summary, duration, and lessons; `Show all N modules` expand/collapse toggle.
- Bottom Sticky Progress Card: Floating progress bar card with percentage completed, progress track in primary teal, and `Continue Learning →` CTA.

---

## 2. Skills Read & Referenced
- `AGENTS.md` (Sanity content model, Next.js App Router conventions, UI visual fidelity rules)
- `sanity-best-practices` (`sanityFetch`, GROQ queries, `@sanity/image-url`)
- `modern-web-guidance` (Semantic layout, responsive design, focus rings, accessibility)

---

## 3. Code & Assets Inspected
- `design/verbatim-course.png`: Course page visual reference.
- `sanity/lib/queries.ts`: `COURSE_BY_SLUG_QUERY` fetching course fields, instructor, category, modules, and lessons.
- `sanity/lib/fetch.ts`: `getCourseBySlug(slug)` data fetcher.
- `seed.ndjson`: Seeded Sanity document `course.nextjs-app-router-in-depth`.
- `components/nav/navbar.tsx`: Header navigation component.
- `components/nav/breadcrumbs.tsx`: Breadcrumbs navigation component.
- `components/ui/progress-bar.tsx`: Progress bar component.
- `app/globals.css`: Primary teal palette definitions (`--color-primary-*`).

---

## 4. Decisions & Visual Specifications

1. **Routing & Sanity Data Integration**:
   - Create `app/courses/[slug]/page.tsx` as a Server Component fetching course data via `getCourseBySlug(slug)`.
   - If the requested slug is `nextjs-for-production` or not found directly, fallback to fetching `nextjs-app-router-in-depth` to guarantee seeded content renders seamlessly.
   - Create `app/courses/page.tsx` to list all courses or redirect to `/courses/nextjs-app-router-in-depth`.

2. **Breadcrumbs Component**:
   - `items`: `[{ label: "All Courses", href: "/courses" }, { label: course.title }]`.

3. **Course Hero Header**:
   - Left Cover: 1:1 rounded square card (`w-48 h-48 sm:w-64 sm:h-64 rounded-2xl bg-neutral-900 overflow-hidden flex items-center justify-center border border-neutral-800 shadow-md shrink-0`). If Sanity `coverImage` exists, render `urlFor(course.coverImage)`, else render stylized Next.js metallic 'N' logo / tech icon.
   - Right Info:
     - Badge: `POPULAR` pill badge (`bg-primary-50 text-primary-700 border border-primary-200/60 font-semibold tracking-wider text-[11px] px-3 py-0.5 rounded-full uppercase mb-3 inline-block`).
     - Title: `course.title` in **Instrument Serif** (`text-3xl sm:text-4xl lg:text-5xl font-serif text-neutral-900 font-normal tracking-tight mb-3 leading-tight`).
     - Summary: `course.summary` (`text-neutral-600 text-sm sm:text-base max-w-2xl leading-relaxed mb-6`).
     - Meta Stats Row: Gap-6 flex wrap text-xs sm:text-sm text-neutral-600 mb-6.
       - Level: `BarChart2` / `Signal` icon + capitalized `course.level`.
       - Duration: `Clock` icon + total calculated duration (e.g. `18h 24m`).
       - Modules: `FileText` / `Layers` icon + `[N] modules`.
       - Students: `Users` icon + `course.studentCount` formatted (e.g., `18.2k students` or `2.1k students`).
     - Action Buttons:
       - Primary CTA: `Continue Learning →` (`bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 text-sm sm:text-base`).
       - Secondary CTA: `Bookmark` with `Bookmark` icon (`border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 font-medium px-5 py-3 rounded-xl transition-colors shadow-xs inline-flex items-center gap-2 text-sm sm:text-base`).

4. **"What you'll learn" Section**:
   - Container: Light card background (`bg-[#FAFCF9] border border-neutral-200/80 rounded-2xl p-6 sm:p-8 mb-10 shadow-xs`).
   - Title: `What you'll learn` in **Instrument Serif** (`text-xl sm:text-2xl font-serif text-neutral-900 mb-6`).
   - Grid: 2 columns on `md+`, 1 column on `sm`.
   - Learning outcome items:
     - Card: `bg-white border border-neutral-200/80 rounded-xl p-5 sm:p-6 flex items-start gap-4 hover:border-primary-300 transition-colors shadow-xs`.
     - Icon box: `w-12 h-12 rounded-xl bg-primary-50 border border-primary-200/80 text-primary-600 flex items-center justify-center shrink-0`. Lucide icons dynamically mapped from outcome icon names (`layers`, `workflow`, `gauge`, `rocket`, `shield`, `puzzle`, `code`, `sparkles`).
     - Title: `outcome.title` (`font-semibold text-neutral-900 text-base mb-1`).
     - Description: `outcome.description` (`text-neutral-500 text-sm leading-relaxed`).

5. **"Course Content" Accordion Section**:
   - Header Row: `Course Content` in Instrument Serif on left, `[N] modules · [totalDuration]` on right.
   - Module Accordion list:
     - Card container: `border border-neutral-200 rounded-xl divide-y divide-neutral-200/80 bg-white overflow-hidden shadow-xs mb-6`.
     - Module item:
       - Index circle: Number `1`, `2`, etc. in a subtle rounded circle.
       - Title & Summary: `module.title` and `module.summary`.
       - Duration: Computed module duration (e.g. `45m`, `1h 12m`).
       - Expand/Collapse chevron: Clicking toggles lesson drawer.
       - Lesson drawer: List of lessons (`lesson.title`, duration, free preview badge, play button linking to `/lessons/[slug]`).
   - Truncation toggle button: `Show all [N] modules` / `Show fewer modules` pill button centered at the bottom of the content list.

6. **Bottom Sticky Progress Card**:
   - Floating card fixed at viewport bottom (`sticky bottom-6 z-30 max-w-5xl mx-auto w-full px-4 mb-6`).
   - Card box: `bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4`.
   - Progress text: "Your Progress" / "35% complete" (or actual completion status).
   - Progress bar fill in `bg-primary-500`.
   - `Continue Learning →` primary CTA button in `bg-primary-600 hover:bg-primary-700`.

---

## 5. Security Considerations
- **Server-Side Data Fetching**: Fetch Sanity content using `getCourseBySlug` exclusively on the server in Next.js Server Components.
- **Credential Hygiene**: Ensure Sanity API write tokens are never passed to the client or exposed in public bundles.
- **Sanitization & Validation**: Sanitize route parameter `slug` gracefully and handle empty/missing course fields with safe fallback defaults without crashing.

---

## 6. Files to Touch / Create
- `components/course/course-hero.tsx`: Hero banner component with metadata & CTAs.
- `components/course/learning-outcomes.tsx`: 2x2 outcome cards component.
- `components/course/course-content.tsx`: Interactive module accordion component.
- `components/course/progress-bar-floating.tsx`: Floating progress bar footer component.
- `app/courses/[slug]/page.tsx`: Course detail page server route fetching Sanity content.
- `app/courses/page.tsx`: Course index page / default course redirect.

---

## 7. Acceptance Criteria
1. Exact visual fidelity matching `design/verbatim-course.png` with teal palette applied and "Verbatim" branding.
2. Server Component page fetching seeded course data from Sanity via `getCourseBySlug`.
3. Instrument Serif for main headings (`Next.js for Production`, `What you'll learn`, `Course Content`) and Inter for body text and UI.
4. Interactive module expand/collapse functionality with lesson items.
5. Floating progress bar card at the bottom.
6. `npm run lint` and `npm run build` complete with 0 errors.

---

## 7. Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## 8. Manual Test Steps
1. Start dev server with `npm run dev`.
2. Visit `http://localhost:3000/courses/nextjs-app-router-in-depth` (and `http://localhost:3000/courses/nextjs-for-production`).
3. Verify Navbar header shows `Verbatim` logo, active `Courses` link, bell icon, user avatar.
4. Verify Breadcrumbs: `All Courses` > `Next.js App Router in Depth` (or `Next.js for Production`).
5. Verify Course Hero section: dark cover art, `POPULAR` teal badge, Instrument Serif heading, summary, 4 metadata stats (Level, Duration, Modules count, Student count), `Continue Learning` teal button, and `Bookmark` button.
6. Verify "What you'll learn" section: 2x2 grid of learning outcome cards with teal icon badges.
7. Verify "Course Content" section: Header with total modules and duration; accordion list of modules showing titles, summaries, durations, and expandable lesson items; toggle button `Show all modules`.
8. Verify bottom floating progress card sticky at bottom showing 35% complete progress bar and `Continue Learning` button.

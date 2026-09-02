# Implementation Prompt: All Courses Page (`/courses`)

## 1. Goal
Implement a simple, elegant **All Courses** page at `app/courses/page.tsx` that lists all available courses fetched from Sanity, matching the Verbatim design system and teal theme.

Key requirements:
- Replace the current hardcoded redirect in `app/courses/page.tsx` with a full catalog page.
- Render Navbar with `Courses` link active.
- Page Header: Title "All Courses" in Instrument Serif, summary subtitle text.
- Fetch real course documents from Sanity via `getCourses()`.
- Render a responsive 3-column grid of course cards (`grid-cols-1 md:grid-cols-3 gap-6`).
- Each course card displays:
  - Course tech icon / cover thumbnail (mapping `nextjs-app-router-in-depth`, `devops-with-docker-and-kubernetes`, `typescript-for-application-developers` to their respective `NextJsIcon`, `DockerIcon`, `TypeScriptIcon`, or Sanity `coverImage`).
  - Course title in Instrument Serif.
  - Summary / description text.
  - Footer stats row: Level (e.g. Intermediate/Beginner), Duration / Student count, and Module count.
  - `POPULAR` badge if `course.popular` is true.
  - Full card clickable linking to `/courses/${course.slug}`.
- Fallback content handling if database has partial records.

---

## 2. Skills Read & Referenced
- `AGENTS.md` (Sanity integration, Next.js routing, design system rules)
- `sanity-best-practices` (`getCourses()`, `COURSES_QUERY`, `urlFor`)
- `modern-web-guidance` (Semantic layout, responsive grid, card hover states)

---

## 3. Code & Assets Inspected
- `app/courses/page.tsx`: Current redirect implementation to be replaced with full page layout.
- `components/home/featured-courses.tsx`: Course card styling & icon mapping reference.
- `components/icons/tech-icons.tsx`: `NextJsIcon`, `DockerIcon`, and `TypeScriptIcon`.
- `sanity/lib/fetch.ts`: `getCourses()` data fetcher.
- `sanity/lib/types.ts`: `SanityCourse` interface definition.

---

## 4. Decisions & Visual Specifications
1. **Route Structure**: `app/courses/page.tsx` as a Next.js Server Component fetching `getCourses()`.
2. **Header Layout**:
   - Title: `All Courses` (`font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-900 tracking-tight mb-3`).
   - Description: `Explore our collection of production-grade courses on modern web development.` (`text-neutral-600 text-sm sm:text-base max-w-2xl`).
3. **Course Card Component / Grid**:
   - Grid: `grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6`.
   - Card styling: `rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:border-primary-300 transition-all flex flex-col justify-between group cursor-pointer`.
   - Icon helper: Map slug or title to `NextJsIcon`, `DockerIcon`, `TypeScriptIcon`, or cover image.
   - Badge: Optional `POPULAR` pill badge (`bg-primary-50 text-primary-700 border-primary-200/60`).
   - Meta Stats: Level (`BarChart2`), Duration/Students (`Clock` / `Users`), Modules (`Layers`).

---

## 5. Security Considerations
- Data fetching performed entirely server-side via `getCourses()` using private dataset tokens.
- No public key exposure; standard safe link routing.

---

## 6. Files to Touch / Create
- `app/courses/page.tsx`: Replace redirect with full All Courses catalog page.

---

## 7. Acceptance Criteria
1. `/courses` renders an All Courses page listing Sanity courses in a 3-column responsive grid.
2. Clicking any course card opens `/courses/[slug]`.
3. Displays header with Instrument Serif typography and Navbar with active `Courses` link.
4. `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass with 0 errors.

---

## 8. Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## 9. Manual Test Steps
1. Run `npm run dev`.
2. Visit `http://localhost:3000/courses`.
3. Verify "All Courses" page header and navbar active state.
4. Inspect course cards (Next.js, Docker, TypeScript, etc.) and verify layout, stats, and links to `/courses/[slug]`.

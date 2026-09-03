# Implementation Prompt: Verbatim Intelligent Search Page UI & Layout

## 1. Goal
Refine the Verbatim Search Results page (`/search`) to match the exact visual reference provided by the user (`verbatim-search.png`) using the project's teal/green primary design system (`primary-600` / `#35735e` / `#438e74`). The search page will feature a centered hero search header with query highlight, keyboard shortcut `⌘ K`, stacked video moment cards (with dark video thumbnails, play button, timestamp overlay, course brand icons, and "Watch from MM:SS >" CTAs), lesson topic cards (with key topic bullet callout boxes and "View lesson >" CTAs), and a bottom search callout banner ("Can't find what you're looking for?").

---

## 2. Skills Read
- `sanity-best-practices` (`~/.agents/skills/sanity-best-practices/SKILL.md`) — Schema structure, GROQ lookups, server-side data fetching.
- `node_modules/next/dist/docs/` — Next.js App Router client & server component boundaries.

---

## 3. Code Inspected
- `app/globals.css` — Verified primary color palette is teal/green (`--color-primary-600: #35735e`, `--color-primary-500: #438e74`, `--color-primary-50: #f4f9f6`).
- `components/search/search-view.tsx` — Inspected existing search view component logic.
- `components/search/video-result-card.tsx` — Inspected video result card structure.
- `components/search/lesson-result-card.tsx` — Inspected lesson result card structure.
- User reference screenshot (`verbatim-search.png`) — Analyzed exact centered header, query highlighting, video cards, lesson cards, course brand icons (Next.js, React, Node.js, JS), timestamp badges, and bottom banner layout.

---

## 4. Decisions & Assumptions
- **Color Theme**: Use the project's canonical teal/green design system (`primary-600`/`primary-500`/`primary-50`) for all active links, badges, highlights, and buttons (avoiding orange/terracotta per user instructions).
- **Page Layout**:
  - **Centered Header**: Small `SEARCH RESULTS` pill badge, `Results for "<query>"` with the query in serif italic primary teal, `Found X results across Y courses` summary, and centered search bar with `⌘ K` shortcut.
  - **Results Bar**: Count banner on left (`28 results`) and sort dropdown on right (`Most Relevant v`).
  - **Stacked Cards List**: Stacked cards matching screenshot:
    - **Video Result Card**: Left thumbnail with dark overlay, center play button, bottom-right timestamp (`12:45`). Right section: Course icon + Title + `VIDEO` badge (salmon/teal pill), title, summary description, `Lesson X.Y · Module Title` meta line, and `Watch from MM:SS >` link button.
    - **Lesson Result Card**: Left box with key topics list (`• Fetching strategies`, `• Caching techniques`) and checkmark badge. Right section: Course icon + Title + `LESSON` badge (purple pill), title, summary description, `Module X` meta line, and `View lesson >` link button.
  - **Bottom Banner**: Callout box with search icon badge, heading `Can't find what you're looking for?`, subtext, and `Browse all courses ->` button.

---

## 5. Files to Touch / Create
- `[MODIFY] components/search/search-view.tsx` — Update header layout, query styling, results count, search input with `⌘ K`, stacked list layout, and bottom callout banner.
- `[MODIFY] components/search/video-result-card.tsx` — Update layout to horizontal flex card matching reference screenshot (thumbnail on left, details on right, teal CTAs).
- `[MODIFY] components/search/lesson-result-card.tsx` — Update layout to horizontal flex card with left topic checklist box and right details.

---

## 6. Requirements
1. **Visual Fidelity**:
   - Match exact layout and typography from the screenshot (`verbatim-search.png`).
   - Use teal/green design system (`primary-600` / `#35735e`) for accents, query highlight, play CTAs, and primary buttons.
2. **Keyboard Shortcut (`⌘ K`)**:
   - Include `⌘ K` shortcut indicator in the search bar and trigger focus on `⌘ K` / `Ctrl K`.
3. **Card Layouts**:
   - Horizontal split on desktop: left media/thumbnail box (~240px) and right details section.
   - Video cards show play overlay, timestamp badge (`12:45`), course tech icon, `VIDEO` badge, and `Watch from 12:45 >` CTA.
   - Lesson cards show left topic list box with checkmark, course tech icon, `LESSON` badge (purple), and `View lesson >` CTA.
4. **Bottom Banner**:
   - Render "Can't find what you're looking for?" callout box with "Browse all courses ->" CTA linking to `/courses`.

---

## 7. Security Considerations
- Client component only handles display state and URL navigation; server route handles Sanity data queries.

---

## 8. Acceptance Criteria
- `/search?q=data+fetching` matches the reference screenshot in layout, card structure, and badges.
- All accents use teal/green palette.
- Video cards navigate to `/lessons/[slug]?t=...` and lesson cards navigate to `/lessons/[slug]`.
- `npm run build` and `npm run lint` pass with 0 errors.

---

## 9. Checks to Run
- `npm run build` — Verify production build succeeds.
- `npm run lint` — Verify ESLint checks pass.

---

## 10. Manual Test Steps
1. Open `/search?q=data+fetching` in the browser.
2. Verify centered header with `SEARCH RESULTS` badge, `Results for "data fetching"` with italic teal query, and `⌘ K` search bar.
3. Verify video cards show thumbnail on left, timestamp badge, course icon, `VIDEO` badge, and `Watch from 12:45 >`.
4. Verify lesson cards show key topics box on left, `LESSON` badge, and `View lesson >`.
5. Verify bottom callout banner with `Browse all courses ->` CTA.

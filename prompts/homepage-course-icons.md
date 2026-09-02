# Implementation Prompt: Homepage Course Logos / Icons Update

## 1. Goal
Update the 3 course card logos on the homepage (`components/icons/tech-icons.tsx` and `components/home/featured-courses.tsx`) to match the exact visual reference provided in the reference image:
1. **Next.js for Production**: Rounded black square card (`bg-neutral-950 rounded-[14px]`) containing the metallic diagonal 'N' logo icon.
2. **Docker Essentials**: Clean Docker logo showing the blue whale with container blocks stacked (3-2-1 pattern) and water wave line underneath, matching the reference image.
3. **TypeScript Deep Dive**: Vibrant blue rounded square card (`bg-[#3178C6] rounded-[14px]`) containing clean white bold "TS" lettering.

---

## 2. Skills Read & Referenced
- `AGENTS.md` (UI work visual fidelity rules, prompt approval workflow, execution loop)
- `modern-web-guidance` (SVG iconography, responsive styling, design system alignment)

---

## 3. Code & Assets Inspected
- Attached user reference screenshot: Showing Next.js ('N' logo), Docker (blue whale & containers), and TypeScript ('TS' badge).
- `components/icons/tech-icons.tsx`: Icons module containing `NextJsIcon`, `DockerIcon`, and `TypeScriptIcon`.
- `components/home/featured-courses.tsx`: Homepage grid component rendering the 3 featured courses.
- `components/cards/course-card.tsx`: Reusable course card component.

---

## 4. Decisions & Visual Specifications
1. **`NextJsIcon`**:
   - Container: `w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0 shadow-sm`.
   - Graphic: High-precision SVG of the metallic slash 'N' logo (white vertical bars with metallic gradient diagonal slash).
2. **`DockerIcon`**:
   - Container: `w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0`.
   - Graphic: High-precision SVG Docker logo rendering the blue container stack (3-2-1 blocks) atop the blue whale body with water curve underneath in `#0275D8` / `#0DB7ED`.
3. **`TypeScriptIcon`**:
   - Container: `w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] bg-[#3178C6] flex items-center justify-center shrink-0 shadow-sm`.
   - Graphic: Bold white "TS" text (`font-sans font-bold text-xl tracking-normal text-white select-none`).

---

## 5. Security Considerations
- Pure presentational component updates. No security credentials or network data exposed.

---

## 6. Files to Touch / Create
- `components/icons/tech-icons.tsx`: Update SVG definitions for `NextJsIcon`, `DockerIcon`, and `TypeScriptIcon`.
- `components/home/featured-courses.tsx`: Verify padding, sizing, and alignment of icons within homepage course cards.

---

## 7. Acceptance Criteria
1. Next.js course card renders black rounded icon card with metallic slash 'N' logo.
2. Docker course card renders blue whale with stacked container blocks matching the reference image.
3. TypeScript course card renders blue rounded icon card with bold white "TS" text.
4. `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass with 0 errors.

---

## 8. Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## 9. Manual Test Steps
1. Run `npm run dev`.
2. Open `http://localhost:3000/`.
3. Scroll to the "All Courses" section.
4. Inspect the 3 course cards (Next.js for Production, Docker Essentials, TypeScript Deep Dive) and verify the 3 logos match the user's reference image exactly.

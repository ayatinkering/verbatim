# Implementation Prompt: Imperative WebMCP Integration & Agent Tools

## 1. Goal
Implement client-side WebMCP (Web Model Context Protocol) registration infrastructure using `document.modelContext.registerTool` to expose Verbatim's course catalog, real-time video playback context, exact timestamp seeking, prerequisite discovery, and time-bounded Mission Mode paths to AI agents (including ChatGPT's in-app browser and Chrome WebMCP). Add an open-source MIT `LICENSE` file for hackathon compliance.

---

## 2. Skills Read
- `sanity-best-practices` (`~/.agents/skills/sanity-best-practices/SKILL.md`) — Schema structure & GROQ search integration.
- `node_modules/next/dist/docs/` — Next.js client component hydration & App Router navigation.

---

## 3. Code Inspected
- `app/api/search/route.ts` — Verified search endpoint for `search_learning_content` and `find_learning_moment`.
- `components/lesson/lesson-view.tsx` & `components/lesson/video-player.tsx` — Inspected lesson page state & video timestamp controls.
- `components/nav/navbar.tsx` — Inspected navbar layout for agent-ready indicator placement.
- `package.json` — Inspected dependencies and scripts.

---

## 4. Decisions & Assumptions
- **Native WebMCP Imperative Registration**:
  - Implement `lib/webmcp/register-tools.ts` to execute `document.modelContext.registerTool(...)` when `typeof window !== "undefined"` and `document.modelContext` exists.
  - Dynamically register core tools: `get_current_learning_context`, `search_learning_content`, `find_learning_moment`, `find_prerequisites`, `find_alternative_explanation`, `jump_to_timestamp`, `get_learning_progress`, `build_learning_path`, `open_learning_destination`.
- **Annotations & Read-Only Hints**:
  - Set `annotations: { readOnlyHint: true }` for search and context retrieval tools.
  - Set `annotations: { readOnlyHint: false }` for state-mutating actions (`jump_to_timestamp`, `open_learning_destination`).
- **UI Feedback & Agent Toast**:
  - Dispatch custom DOM event `webmcp:action` upon tool execution to trigger visible UI toasts (e.g., *"Agent navigated you to 04:17"*).
  - Add an "Agent Ready (WebMCP)" status badge in the Navbar.
- **Hackathon License**:
  - Create root `LICENSE` file with MIT license text.

---

## 5. Files to Touch / Create
- `[NEW] LICENSE` — Add MIT open-source license file.
- `[NEW] lib/webmcp/types.ts` — Define WebMCP tool interface types and input/output contracts.
- `[NEW] lib/webmcp/register-tools.ts` — Implement client-side WebMCP tool registration engine.
- `[NEW] components/webmcp/webmcp-provider.tsx` — React provider component for WebMCP initialization & UI action toasts.
- `[MODIFY] app/layout.tsx` — Wrap app in `<WebMCPProvider />`.
- `[MODIFY] components/nav/navbar.tsx` — Add "Agent Ready (WebMCP)" badge indicator.

---

## 6. Requirements
1. **Official WebMCP Compliance**:
   - Register tools matching `document.modelContext.registerTool({ name, title, description, inputSchema, annotations, execute })`.
2. **Graceful Fallback**:
   - Web application operates normally when WebMCP is unavailable without throwing runtime errors.
3. **Internal Route Security**:
   - Navigation actions enforce strict relative path validation (`/lessons/[slug]`, `/courses/[slug]`).
4. **MIT License**:
   - Repository contains a root `LICENSE` file.

---

## 7. Security Considerations
- Purely internal routing for navigation tools; external URLs or arbitrary code execution are strictly blocked.
- Input payloads are Zod-sanitized. Client holds zero write tokens or private keys.

---

## 8. Acceptance Criteria
- `document.modelContext.registerTool` registers all 9 WebMCP tools in WebMCP-enabled browsers (ChatGPT in-app browser & Chrome WebMCP flag).
- Executing `jump_to_timestamp` navigates player and starts video at target seconds.
- WebMCP-disabled browser loads normally without console errors.
- `npm run build` and `npm run lint` pass with 0 errors.

---

## 9. Checks to Run
- `npm run lint` — Verify ESLint checks pass.
- `npm run build` — Verify production build succeeds.

---

## 10. Manual Test Steps
1. Open site in Chrome with `#enable-webmcp-testing` enabled or inspect `document.modelContext`.
2. Verify tools (`search_learning_content`, `get_current_learning_context`, `jump_to_timestamp`, etc.) are registered.
3. Invoke `jump_to_timestamp({ lessonSlug: 'nextjs-app-router-in-depth-file-system-routing', timestampSeconds: 116 })`.
4. Verify browser navigates to `/lessons/nextjs-app-router-in-depth-file-system-routing?t=116` and player autoplays from 1:56.

# Verbatim

> An agent-native learning platform powered by WebMCP.

Verbatim is designed for collaborative learning between humans and autonomous web agents. Instead of requiring an agent to visually parse the DOM, take screenshots, or execute brittle mouse clicks, Verbatim exposes its core platform capabilities as structured tools via the **WebMCP** specification (`document.modelContext.registerTool`).

---

## Overview

Traditional learning portals present catalogs, filters, and lesson hierarchies that require extensive manual navigation. When browser agents interact with these sites, they must infer complex layouts and simulate human clicks.

Verbatim approaches this differently by exposing structured capabilities directly to agents:
- **Corpus Search**: Fast semantic indexing across 120 lessons and 10 technical courses.
- **Deep Lesson Inspection**: Structured access to lesson summaries, key learning objectives, code notes, and prerequisites.
- **Learner State Awareness**: Real-time inspection of active courses, completed modules, and active goals.
- **Adaptive Curricula Planning**: Dynamic sequencing of learning tracks tailored to explicit learner time constraints (e.g., 25-minute vs. 10-minute targets).
- **Workspace Navigation**: Direct programmatic routing and workspace manipulation to open lessons and render media.
- **Progress Tracking**: Bi-directional progress synchronization between learner actions and agent operations.

---

## Architecture

```text
                 USER
                   │
                   ▼
          ┌─────────────────┐
          │   Verbatim UI   │
          │                 │
          │ Courses         │
          │ Lesson Viewer   │
          │ Progress State  │
          │ Activity Stream │
          └────────┬────────┘
                   │
                   │ Shared Reactive State (LearningStore)
                   ▼
          ┌─────────────────┐
          │   WebMCP Host   │
          │ (document.      │
          │  modelContext)  │
          └────────┬────────┘
                   │
       ┌───────────┼────────────┐
       ▼           ▼            ▼
    Search      Inspect       State
       │           │            │
       └───────────┼────────────┘
                   ▼
                 Plan
                   │
                   ▼
              Open Lesson
                   │
                   ▼
            Update Progress
```

---

## WebMCP Tool Specifications

Verbatim registers 6 core tools on `document.modelContext`:

| Tool | Description | Arguments | Returns |
|---|---|---|---|
| `search_learning` | Query the full 120-lesson corpus across courses and modules. | `query` (string), `course?` (string), `topic?` (string), `limit?` (number) | Ranked lesson matches, summaries, durations, and relevance scores. |
| `inspect_lesson` | Inspect learning objectives, detailed notes, pro-tips, and prerequisites. | `lessonId` (string) | Full lesson metadata, key takeaways, and related modules. |
| `get_learning_state` | Read current learner progress, completed modules, and active plan. | _None_ | Current lesson, completed IDs, active plan, and progress stats. |
| `create_learning_plan` | Generate an adaptive, sequenced learning plan matching a time budget. | `topic` (string), `timeBudget` (number), `preferences?` (string) | Ordered lesson sequence with durations and rationale. |
| `open_lesson` | Directly navigate and render a specific lesson in the workspace. | `lessonId` (string) | Lesson payload, navigation event status. |
| `update_learning_progress` | Update completion or in-progress status for a lesson. | `lessonId` (string), `status` (`completed` \| `in_progress` \| `not_started`) | Updated progress counters and completion state. |

---

## Agent Discoverability (`llms.txt`)

Verbatim serves a standardized [`/llms.txt`](public/llms.txt) endpoint providing machine-readable documentation of platform capabilities, schemas, and constraints for automated agent discovery.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Instrument Serif & Inter fonts
- **Protocol**: WebMCP (`document.modelContext`)
- **State Management**: Shared reactive client store
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/ayatinkering/verbatim.git
cd verbatim

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Building for Production

```bash
npm run build
npm start
```

---

## License

MIT

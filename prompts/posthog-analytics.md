# Implementation Prompt: PostHog Product Analytics Setup

## Goal
Restore product analytics event capture for the Verbatim web app. The project
recorded zero events for 30 days because PostHog was never installed. Wire the
`posthog-js` SDK into the Next.js 16 App Router so page views flow again, and
link events to the signed-in learner by their Clerk user id.

## Skills and Docs Read
- `AGENTS.md`
- `instrument-product-analytics` skill and its `references/next-js.md` and
  `references/COMMANDMENTS.md`

## Code Inspected
- `package.json`: Next.js `16.3.4`, React `19.2.8`, npm lockfile. No PostHog
  dependency before this change.
- `app/layout.tsx`: root layout wraps children in `<ClerkProvider>` only.
- `app/page.tsx` and `components/**`: the catalog, lesson, and search pages are
  not built yet, so there are no custom user actions to instrument.
- `sanity/env.ts`: existing env pattern reads `NEXT_PUBLIC_SANITY_*` values.
- `proxy.ts`: Clerk middleware. No CSP header blocks PostHog.
- `.gitignore`: `.env*` is ignored, so no `.env.example` was tracked.

## Decisions and Assumptions
- The root cause is a missing SDK, not a misconfiguration. The fix is the base
  install plus automatic page view capture, which is what the health check
  flags as missing.
- Use `instrumentation-client.ts`, the Next.js file for client-side setup.
- Use `defaults: "2026-05-30"`, which turns on history-change page views. This
  captures single-page navigations in the App Router without a manual page view
  component.
- Identify learners by the Clerk user id, which matches how per-user progress
  keys off Clerk. Reset only on a real sign-out, so anonymous ids stay stable
  across reloads.
- Keep the change small. Custom events (search, video play, lesson completed)
  wait until those pages exist.
- The project token is public and client-safe. The ingestion host is EU Cloud.
- Follow the COMMANDMENTS rule: a missing key never breaks the app. Development
  logs a loud error; production is a silent no-op.

## Files Touched
- `package.json`, `package-lock.json`: add `posthog-js`.
- `instrumentation-client.ts`: guarded `posthog.init`.
- `components/analytics/posthog-provider.tsx`: React provider plus Clerk
  identify and reset.
- `app/layout.tsx`: mount the provider inside `<ClerkProvider>`.
- `.env.example`: canonical env list, including the PostHog variables.
- `.gitignore`: stop ignoring `.env.example`.

## Security Considerations
- Only the public `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` reach
  the browser. No private PostHog key is added.
- No secret is committed. `.env.example` holds a placeholder for the key.

## Acceptance Criteria
- `posthog-js` is installed and bundled into the client JavaScript.
- A page load sends a `$pageview` event to the PostHog EU host.
- A signed-in learner is identified by their Clerk user id.
- Type check, lint, and production build all pass.

## Checks to Run
1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`

## Manual Test Steps
1. Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`.
2. Run `npm run dev` and open `http://localhost:3000`.
3. In PostHog, open Activity, then Live events.
4. Confirm a `$pageview` event arrives.
5. Sign in, then confirm later events carry the Clerk user id as the distinct id.

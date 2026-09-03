# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for Verbatim. Session Replay was already enabled; Error Tracking and Support were enabled, and the health, error, and support signal sources were activated. Findings should begin appearing in the [Self-driving inbox](https://eu.posthog.com/project/264304/inbox) within about 30 minutes.

## AI data processing

Approved by the organization-level setup gate.

## GitHub

The PostHog GitHub App was already connected before this setup. GitHub Issues was not selected as a Self-driving source, so no GitHub Issues responder was enabled.

## Products enabled

| Product | Result | SDK check |
| --- | --- | --- |
| Session Replay | Already enabled | Web `posthog-js` initialization has no disabling override. |
| Error Tracking | Enabled | Web initialization explicitly enables exception capture. |
| Support | Enabled | Connect an inbound email, inbox, or Slack channel before tickets can arrive. |

## Signal sources

| Signal source | Action | ID / note |
| --- | --- | --- |
| `signals_scout` / `cross_source_issue` | Already enabled by default | No opt-out row was created. |
| `health_checks` / `health_issue` | Enabled | `01a06633-3f5d-7b11-9914-9747345d1799` |
| `error_tracking` / `issue_created` | Enabled | `01a06633-41e7-7b59-9885-1cdcd335bc57` |
| `error_tracking` / `issue_reopened` | Enabled | `01a06633-3f55-7cf8-8d84-72da981c2373` |
| `error_tracking` / `issue_spiking` | Enabled | `01a06633-4100-73e6-8b1f-dd9e307fc730` |
| `conversations` / `ticket` | Enabled | `01a06633-3fbc-74f7-8789-3024d012cd89`; idle until an inbound Support channel is connected. |
| Session Replay source row | Deliberately skipped | Replay coverage is supplied by Replay Vision scanners below; the legacy responder is retired. |

## Connected tools

No external issue tracker, error tracker, support desk, database-performance, security, review, or search-analytics tool was selected. No connected-tool responder was changed.

## Scout troop

**Verified budget:** 100 runs/day; 0 used today; 100 remaining. Announcement: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

| Active scout | Why it is active |
| --- | --- |
| `signals-scout-general` | Cross-product coverage for surfaces without a dedicated specialist. |
| `signals-scout-product-analytics` | Verbatim captures learner discovery interactions and uses product analytics. |
| `signals-scout-web-analytics` | Verbatim is a web learning product with catalog and course routes. |
| `signals-scout-health-checks` | Health checks are active and catch actionable analytics setup issues. |
| `signals-scout-learner-search-demand` | Custom coverage for search and course-exploration demand. |
| `signals-scout-course-discovery` | Custom coverage for learner progression into catalog and course pages. |

The other 23 built-in scouts remain disabled to keep the troop selective: AI observability, APM, conversations, CSP, customer analytics, data pipelines, data warehouse, experiments, feature flags, insight alerts, logs, MCP tool calls, revenue, surveys, tasks, web vitals, and similar unused or unranked product surfaces were not evidenced in this repository; anomaly and observability-gap scouts were not added because this fresh project has no established saved-insight baseline. `signals-scout-error-tracking` remains off because Error Tracking has its native source; `signals-scout-session-replay` remains off because Replay Vision owns replay coverage; `signals-scout-replay-vision` remains off because the scanners were just created and have no accumulated observations yet. Any can be enabled later from the inbox.

## Custom scouts

| Scout | Watches | Report discriminator | Why it is custom coverage |
| --- | --- | --- | --- |
| `signals-scout-learner-search-demand` | Search submissions and course exploration from `app/page.tsx`. | A sustained multi-learner decline in discovery actions while homepage traffic holds. | Built-in web analytics monitors traffic, while this scout specifically distinguishes learner discovery demand from traffic changes. |
| `signals-scout-course-discovery` | Homepage-to-catalog and catalog-to-course progression. | A multi-day transition-rate drop with stable entrants. | The built-in product-analytics scout watches saved generic flows; this fixes the learner-course route as a dedicated domain funnel. |

Both were approved and created. No proposed scout was declined. To calibrate a noisy custom scout without removing it, set its config’s `emit` field to `false` in PostHog to make it dry-run only.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes qualifying findings to the inbox. It is the only part of this setup that spends Replay Vision quota; findings are weighted at half strength and need independent corroboration before promotion into a report.

| Brief | Scanner | Query scope | Sampling | Estimate | Result |
| --- | --- | --- | --- | --- | --- |
| Breakage monitor | **Broken course discovery** | Recordings with a URL containing `/courses`, covering the catalog and course-discovery completion flow. | 50% | 0 observations / 0 credits per month | Created, signal-emitting. |
| Frustration monitor | **Learner discovery frustration** | Recordings containing `$rageclick` only, without a URL scope. | 100% | 0 observations / 0 credits per month | Created, signal-emitting. |

No recordings were available during setup, so the scanners are armed and will start working when recordings arrive. The organization has 2,500 Replay Vision credits remaining this period; neither scanner currently projects spend because no matching recordings exist.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so the enabled Support responder can receive tickets.
- [ ] Generate normal learner traffic and recordings; this establishes baselines for the six active scouts and activates Replay Vision scanning.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Scout runs draw from the verified daily budget, findings cluster into reports in the inbox, and immediately-actionable reports can begin coding tasks.

## Files modified or created

- Created `posthog-self-driving-report.md`.
- Installed local workflow references under `.claude/skills/replay-vision-scanners-core/`, `.claude/skills/replay-vision-scanner-broken-experiences/`, and `.claude/skills/replay-vision-scanner-user-frustration/`.

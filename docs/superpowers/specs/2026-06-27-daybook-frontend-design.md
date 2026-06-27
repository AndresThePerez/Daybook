# Daybook — Front-end Design System

**Date:** 2026-06-27
**Status:** Approved (visual direction)
**Reference mockup:** `docs/design/daybook-mockup.html` (screenshot: `docs/design/daybook-mockup.png`)

## Concept

A calm personal **daybook** for triaging the day. The app's defining trait is the
**12-hour TTL**: ad-hoc tasks expire within a day, while seeded/permanent tasks persist.
The design makes *time a first-class dimension* — every ephemeral task shows how much of its
12h life remains; permanent tasks are visibly "kept". The palette encodes this directly:
**warm = fleeting, cool = anchored.**

The signature element is the **per-task time bar** that depletes over the task's life.

## Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| `paper` | `#E8EBF0` | app background (cool slate, deliberately not cream) |
| `surface` | `#FFFFFF` | cards, panels, task rows |
| `sunken` | `#DDE2EA` | left rail, history surface |
| `ink` | `#191B21` | primary text |
| `ink-soft` | `#626B7D` | secondary text |
| `ink-faint` | `#97A0B0` | labels, eyebrows |
| `hairline` | `#D2D8E1` | borders, dividers |
| `ember` | `#E08A3C` | TTL bar fill (warm, "time/heat") |
| `ember-low` | `#CF5230` | near-expiry urgency (terracotta-red) — **functional only, never decorative** |
| `kept` | `#2F6F7E` | permanent/"kept" marker (cool teal) |

Category colors (secondary system — small dots/tags only, muted): `work #4C6FB1`,
`personal #8A6DB0`, `shopping #C77D4A`, `health #4F9E83`, `finance #B0894C`,
`education #6E7E55`.

### Type
- **Display:** `Bricolage Grotesque` (700/800) — wordmark, page titles, task titles. Characterful, used with restraint.
- **Body/UI:** `Inter` (400/450/500/600).
- **Mono/utility:** `IBM Plex Mono` (400/500/600) — timestamps, counts, TTL labels, category eyebrows. Tabular numerals.

Scale: page title 38/1.0 (display 800); wordmark 20 uppercase tracked `.22em`; task title 15.5/600;
body/desc 13.5–14 (`ink-soft`); meta 12–13 mono; eyebrow/label 11 uppercase tracked `.1–.14em`.

### Layout
- App shell: a 248px sticky **left rail** + fluid **main** column (max ~920px).
- Rail: `DAY·BOOK` wordmark (the `·` is `ember`) → "Today" card (date + ephemeral/kept counts) →
  category nav (swatch + name + mono count, active state = white card w/ shadow) → spacer →
  "History & recycle bin" pinned at the bottom.
- Main: page header (display title + mono subtitle + primary action) → legend → task list.
- Task row (grid `120px 1fr ~150px`): category tag (mono eyebrow + swatch) · title + truncated
  desc · **time module**. Hover lifts the row (shadow + 1px translate); actions reveal on hover.

### Signature: the time module
- **Ephemeral task** (`expires_at` set): a 130×6px track with an `ember`→light-ember gradient
  fill, width = `remaining / 12h`, above it a mono "Xh Ym left" label. When < 1h: switch to
  `ember-low`, bold label, gentle opacity pulse (respect `prefers-reduced-motion`).
- **Permanent task** (`expires_at` null): no bar. A quiet pill — cool `kept` text + anchor glyph,
  border `#BFD6DC`, bg `#EAF3F4` — reading "Kept".

### Motion
Restrained. Subtle staggered fade-in of rows on load; hover micro-interactions; the urgent pulse.
Nothing else. `prefers-reduced-motion: reduce` disables animation.

## Component inventory

**UI primitives** (`resources/js/components/ui/`): `Button` (primary ink / ghost / danger),
`Card`, `Input`, `Textarea`, `Select`, `Badge`, `Spinner`, `EmptyState`.
**Signature** (`resources/js/components/ui/`): `TimeBar`, `KeptChip`, `CategoryTag`.
**Layout** (`resources/js/components/layout/`): `AppShell`, `Rail`.
**Features**: `features/tasks/` (`TaskList`, `TaskRow`, `TaskForm`, `TaskDetail`),
`features/categories/` (`CategoryList`, `CategoryForm`, `CategoryDetail`),
`features/history/` (`HistoryView`).

## Views

1. **Today / Task list** (`/`) — the hero. Rail + the day's tasks. Empty state: "Nothing on today's
   list. Add the first task." with a primary action.
2. **New / Edit task** (`/tasks/create`, `/tasks/:id/edit`) — card form: title, category select,
   body textarea. Inline field errors from the 422 envelope. Buttons "Save task" / "Cancel".
3. **Task detail** (`/tasks/:id`) — full task, category, created time, and its time module.
4. **Categories** (`/categories`, `/categories/create`, `/categories/:id`, `/categories/:id/edit`) —
   list with task counts; simple name form.
5. **History** (`/history`) — soft-deleted tasks via `?trashed=only`, rendered faded/desaturated on
   the sunken surface. Read-only (no restore endpoint in the API).

## Data & TTL display rules

- API base `/api/v1`; list responses are `{data, links, meta}` (paginated), single are `{data}`.
- `lib/time.js` derives, from `expires_at`: `isKept` (null), `remainingMs`, `fraction` (clamped
  `remainingMs / 12h`, 0–1), `label` ("9h 12m left" / "42m left" / "Expiring" when ≤0), `isUrgent`
  (< 1h). The 12h window is a shared constant `TTL_HOURS = 12`.
- A task whose `expires_at` has passed is hidden server-side (the global scope 404s it), so the
  client rarely renders a negative remainder; it degrades gracefully if it does.

## Copy guidelines

Sentence case, plain verbs, active voice. Actions keep their name through the flow
("Save task" → toast "Task saved"). Empty states invite action. Errors state what happened and
how to fix it, in the interface's voice. Time labels are terse ("9h 12m left", "Kept").

## Accessibility floor

Responsive to mobile (rail collapses to a top bar / drawer under ~720px). Visible keyboard focus
on every interactive element. Color is never the only signal (the "Kept" pill has text + glyph;
urgency has a bold label, not just hue). `prefers-reduced-motion` respected. Target Lighthouse
a11y ≥ 95.

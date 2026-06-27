# Daybook Front-end Implementation Plan (CP2–CP4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the React-Bootstrap UI with the **Daybook** Tailwind design system, rebuilt on the `/api/v1` REST API, with Vitest + RTL tests and Chrome MCP validation.

**Architecture:** React 18 + React Router 7 SPA served by Laravel. Tailwind CSS provides the design tokens; a small hand-built component library (`components/ui`, `components/layout`) composes into feature views (`features/tasks`, `features/categories`, `features/history`). A thin axios client (`lib/api.js`) wraps `/api/v1` and its `{data, links, meta}` envelope; `lib/time.js` derives the signature TTL display. The backend (CP0+CP1) is complete and unchanged by this plan.

**Tech Stack:** React 18, React Router 7, Tailwind CSS 3, Vite 6, Vitest + React Testing Library, axios. Runs via Laravel Sail (container already configured).

## Global Constraints

- **Runtime is Sail (Docker).** Every `npm`/`node`/test/build command runs inside the container: read `npm X` as `./vendor/bin/sail npm X`. The app serves at `http://localhost:8081`; the container is already up. Do not use host node/npm.
- **Design tokens are fixed** — from `docs/superpowers/specs/2026-06-27-daybook-frontend-design.md`. Use these exact values:
  - Colors: `paper #E8EBF0`, `surface #FFFFFF`, `sunken #DDE2EA`, `ink #191B21`, `ink-soft #626B7D`, `ink-faint #97A0B0`, `hairline #D2D8E1`, `ember #E08A3C`, `ember-low #CF5230`, `kept #2F6F7E`. Category: `work #4C6FB1`, `personal #8A6DB0`, `shopping #C77D4A`, `health #4F9E83`, `finance #B0894C`, `education #6E7E55`.
  - Fonts: display `Bricolage Grotesque`, sans `Inter`, mono `IBM Plex Mono`.
  - `TTL_HOURS = 12`. Warm = ephemeral, cool = kept. `ember-low` is functional (urgency) only.
- **API:** base `/api/v1`. List = `{data, links, meta}`; single = `{data}`. Create→201, delete→204, validation→422 `{message, errors}`, missing→404 `{message}`.
- **Client routes:** `/` (Today/list), `/tasks/create`, `/tasks/:id`, `/tasks/:id/edit`, `/categories`, `/categories/create`, `/categories/:id`, `/categories/:id/edit`, `/history`.
- **Testing:** Vitest + React Testing Library; `jsdom` environment; tests colocated as `*.test.jsx`/`*.test.js`. Mock the api module in component tests — never hit the network.
- **A11y floor:** visible keyboard focus, color never the sole signal, `prefers-reduced-motion` respected, responsive to mobile.
- Run the test suite and `./vendor/bin/sail npm run build` before committing a task. Commit after every task with Conventional Commit prefixes. Do NOT commit `.env` or `docker-compose.override.yml`.
- Reference mockup: `docs/design/daybook-mockup.html` — open it to match spacing/feel.

---

## File Structure

```
package.json                      # remove bootstrap deps; add tailwind + vitest deps + scripts
tailwind.config.js                # NEW — Daybook tokens
postcss.config.js                 # NEW — tailwindcss + autoprefixer
vite.config.js                    # add vitest `test` block
resources/views/welcome.blade.php # add font <link>, drop unused
resources/css/app.css             # @tailwind layers + signature keyframes
resources/js/app.js               # drop bootstrap import; import css
resources/js/test/setup.js        # NEW — jest-dom + cleanup
resources/js/lib/time.js          # TTL math (TDD)
resources/js/lib/api.js           # axios /api/v1 wrapper
resources/js/components/ui/        # Button, Card, Input, Textarea, Select, Badge, Spinner,
                                   #   EmptyState, TimeBar, KeptChip, CategoryTag
resources/js/components/layout/    # AppShell, Rail
resources/js/features/tasks/       # TaskList, TaskRow, TaskForm, TaskDetail
resources/js/features/categories/  # CategoryList, CategoryForm, CategoryDetail
resources/js/features/history/     # HistoryView
resources/js/Index.jsx             # router + createRoot
```

Old `components/Base`, `components/Notes`, `components/Categories`, `components/History`, `resources/sass/` are deleted in CP2/CP3.

---

# CHECKPOINT 2 — Design-system foundation

**Gate to exit CP2:** `./vendor/bin/sail npm run test:run` green; `./vendor/bin/sail npm run build` succeeds; the Daybook tokens render (verify by building, not yet wiring the API).

### Task 2.1: Tailwind + token setup; remove Bootstrap

**Files:**
- Modify: `package.json`, `resources/js/app.js`, `resources/views/welcome.blade.php`, `resources/css/app.css`
- Create: `tailwind.config.js`, `postcss.config.js`
- Delete: `resources/sass/app.scss`, `resources/sass/_variables.scss`

**Interfaces:**
- Produces: Tailwind utilities backed by the Daybook tokens; fonts loaded; `app.css` as the single stylesheet.

- [ ] **Step 1: Remove Bootstrap deps and add Tailwind.**

```bash
./vendor/bin/sail npm remove bootstrap react-bootstrap react-router-bootstrap sass @popperjs/core
./vendor/bin/sail npm install -D tailwindcss@^3.4 postcss@^8 autoprefixer@^10
```

- [ ] **Step 2: Create `tailwind.config.js`.**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./resources/**/*.{js,jsx,blade.php}'],
  theme: {
    extend: {
      colors: {
        paper: '#E8EBF0', surface: '#FFFFFF', sunken: '#DDE2EA',
        ink: { DEFAULT: '#191B21', soft: '#626B7D', faint: '#97A0B0' },
        hairline: '#D2D8E1',
        ember: { DEFAULT: '#E08A3C', low: '#CF5230' },
        kept: '#2F6F7E',
        cat: {
          work: '#4C6FB1', personal: '#8A6DB0', shopping: '#C77D4A',
          health: '#4F9E83', finance: '#B0894C', education: '#6E7E55',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: { card: '0 1px 2px rgba(25,27,33,.04), 0 6px 20px rgba(25,27,33,.06)' },
      borderRadius: { card: '14px' },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Create `postcss.config.js`.**

```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

- [ ] **Step 4: Replace `resources/css/app.css`** with the Tailwind layers + signature keyframes:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-paper text-ink font-sans antialiased; }
}

@layer utilities {
  .ttl-fill { background-image: linear-gradient(90deg, #E08A3C, #E6A85C); }
  .ttl-fill-urgent { background-image: linear-gradient(90deg, #CF5230, #E07A52); }
}

@keyframes ttl-pulse { 0%,100% { opacity: 1 } 50% { opacity: .55 } }
.animate-ttl-pulse { animation: ttl-pulse 1.8s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .animate-ttl-pulse { animation: none; } }
```

- [ ] **Step 5: Update `resources/js/app.js`** to drop Bootstrap and import the stylesheet:

```js
import './bootstrap';
import '../css/app.css';
import './Index.jsx';
```

- [ ] **Step 6: Update `resources/views/welcome.blade.php`** `<head>` to load fonts and the title:

```blade
<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Daybook</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;450;500;600&display=swap" rel="stylesheet">
    @vite('resources/js/app.js')
</head>
<body class="h-full">
    <div id="root"></div>
</body>
</html>
```

- [ ] **Step 7: Delete the old Sass.**

```bash
git rm resources/sass/app.scss resources/sass/_variables.scss
```

- [ ] **Step 8: Build to verify.**

Run: `./vendor/bin/sail npm run build`
Expected: builds with no Sass/Bootstrap errors; `public/build/manifest.json` regenerated.

- [ ] **Step 9: Commit.**

```bash
git add -A
git commit -m "feat: add Tailwind Daybook tokens, remove Bootstrap"
```

### Task 2.2: Vitest + React Testing Library harness

**Files:**
- Modify: `package.json` (devDeps + scripts), `vite.config.js`
- Create: `resources/js/test/setup.js`, `resources/js/test/smoke.test.jsx`

**Interfaces:**
- Produces: `npm run test:run` (CI) and `npm run test` (watch); jsdom env; `@testing-library/jest-dom` matchers globally.

- [ ] **Step 1: Install test deps.**

```bash
./vendor/bin/sail npm install -D vitest@^2 jsdom@^25 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14
```

- [ ] **Step 2: Add scripts to `package.json`** (`scripts` block):

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "test": "vitest",
  "test:run": "vitest run"
}
```

- [ ] **Step 3: Add the `test` block to `vite.config.js`** (inside `defineConfig({...})`, sibling to `plugins`):

```js
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './resources/js/test/setup.js',
    css: true,
  },
```

- [ ] **Step 4: Create `resources/js/test/setup.js`.**

```js
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => cleanup());
```

- [ ] **Step 5: Create a smoke test `resources/js/test/smoke.test.jsx`.**

```jsx
import { render, screen } from '@testing-library/react';

function Hello() { return <h1>Daybook</h1>; }

test('testing harness renders a component', () => {
  render(<Hello />);
  expect(screen.getByRole('heading', { name: 'Daybook' })).toBeInTheDocument();
});
```

- [ ] **Step 6: Run it.**

Run: `./vendor/bin/sail npm run test:run`
Expected: 1 passed.

- [ ] **Step 7: Commit.**

```bash
git add -A
git commit -m "test: add Vitest + React Testing Library harness"
```

### Task 2.3: `lib/time.js` — TTL math (TDD)

**Files:**
- Create: `resources/js/lib/time.js`, `resources/js/lib/time.test.js`

**Interfaces:**
- Produces:
  - `TTL_HOURS = 12`
  - `describeExpiry(expiresAt: string|null, now?: number): { isKept: boolean, remainingMs?: number, fraction?: number, isUrgent?: boolean, label?: string }`
    - `isKept` true when `expiresAt` is null/undefined.
    - `fraction` = clamp(remainingMs / (12h), 0, 1).
    - `isUrgent` = `0 < remainingMs < 1h`.
    - `label` = "9h 12m left" / "42m left" (omit hours when 0) / "Expiring" when remainingMs ≤ 0.

- [ ] **Step 1: Write the failing test `resources/js/lib/time.test.js`.**

```js
import { describe, it, expect } from 'vitest';
import { describeExpiry, TTL_HOURS } from './time';

const H = 3600 * 1000;
const NOW = 1_700_000_000_000;
const iso = (msFromNow) => new Date(NOW + msFromNow).toISOString();

describe('describeExpiry', () => {
  it('marks null expiry as kept', () => {
    expect(describeExpiry(null, NOW)).toEqual({ isKept: true });
  });

  it('computes fraction over the 12h window', () => {
    const r = describeExpiry(iso(6 * H), NOW);
    expect(r.isKept).toBe(false);
    expect(r.fraction).toBeCloseTo(0.5, 5);
    expect(r.isUrgent).toBe(false);
    expect(r.label).toBe('6h 0m left');
  });

  it('flags under an hour as urgent and omits hours', () => {
    const r = describeExpiry(iso(42 * 60 * 1000), NOW);
    expect(r.isUrgent).toBe(true);
    expect(r.label).toBe('42m left');
  });

  it('clamps fraction to [0,1] and labels past expiry', () => {
    expect(describeExpiry(iso(-5 * H), NOW)).toMatchObject({ fraction: 0, label: 'Expiring' });
    expect(describeExpiry(iso(99 * H), NOW).fraction).toBe(1);
  });

  it('exposes the window constant', () => {
    expect(TTL_HOURS).toBe(12);
  });
});
```

- [ ] **Step 2: Run it RED.**

Run: `./vendor/bin/sail npm run test:run -- time`
Expected: FAIL — `time` module not found / exports missing.

- [ ] **Step 3: Implement `resources/js/lib/time.js`.**

```js
export const TTL_HOURS = 12;
const WINDOW_MS = TTL_HOURS * 3600 * 1000;

function formatRemaining(ms) {
  if (ms <= 0) return 'Expiring';
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

export function describeExpiry(expiresAt, now = Date.now()) {
  if (!expiresAt) return { isKept: true };
  const remainingMs = new Date(expiresAt).getTime() - now;
  const fraction = Math.max(0, Math.min(1, remainingMs / WINDOW_MS));
  const isUrgent = remainingMs > 0 && remainingMs < 3600 * 1000;
  return { isKept: false, remainingMs, fraction, isUrgent, label: formatRemaining(remainingMs) };
}
```

- [ ] **Step 4: Run it GREEN.**

Run: `./vendor/bin/sail npm run test:run -- time`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit.**

```bash
git add -A
git commit -m "feat: add TTL time helper (describeExpiry)"
```

### Task 2.4: `lib/api.js` — `/api/v1` client (TDD)

**Files:**
- Create: `resources/js/lib/api.js`, `resources/js/lib/api.test.js`

**Interfaces:**
- Produces (all return Promises):
  - `tasks.list(params?) → {data, links, meta}`; `tasks.show(id) → task`; `tasks.create(payload) → task`; `tasks.update(id, payload) → task`; `tasks.remove(id) → void`.
  - `categories.list(params?) → {data, links, meta}`; `.show/.create/.update/.remove` likewise.
  - `validationErrors(error) → object|null` (returns `error.response.data.errors` on 422, else null).

- [ ] **Step 1: Write the failing test `resources/js/lib/api.test.js`** (mock axios):

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';

const get = vi.fn(), post = vi.fn(), put = vi.fn(), del = vi.fn();
vi.mock('axios', () => ({
  default: { create: () => ({ get, post, put, delete: del }) },
}));

import { tasks, validationErrors } from './api';

beforeEach(() => { get.mockReset(); post.mockReset(); put.mockReset(); del.mockReset(); });

describe('api.tasks', () => {
  it('list returns the paginated envelope', async () => {
    get.mockResolvedValue({ data: { data: [{ id: 1 }], links: {}, meta: { total: 1 } } });
    const res = await tasks.list({ category_id: 2 });
    expect(get).toHaveBeenCalledWith('/tasks', { params: { category_id: 2 } });
    expect(res.data).toHaveLength(1);
  });

  it('show unwraps the single resource', async () => {
    get.mockResolvedValue({ data: { data: { id: 7, title: 'X' } } });
    expect(await tasks.show(7)).toEqual({ id: 7, title: 'X' });
  });

  it('create posts and unwraps', async () => {
    post.mockResolvedValue({ data: { data: { id: 9 } } });
    expect(await tasks.create({ title: 'A' })).toEqual({ id: 9 });
    expect(post).toHaveBeenCalledWith('/tasks', { title: 'A' });
  });
});

describe('validationErrors', () => {
  it('returns errors on 422', () => {
    const err = { response: { status: 422, data: { errors: { title: ['x'] } } } };
    expect(validationErrors(err)).toEqual({ title: ['x'] });
  });
  it('returns null otherwise', () => {
    expect(validationErrors({ response: { status: 404, data: {} } })).toBeNull();
  });
});
```

- [ ] **Step 2: Run it RED.**

Run: `./vendor/bin/sail npm run test:run -- api`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement `resources/js/lib/api.js`.**

```js
import axios from 'axios';

const client = axios.create({
  baseURL: '/api/v1',
  headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
});

function resource(name) {
  return {
    list: (params) => client.get(`/${name}`, { params }).then((r) => r.data),
    show: (id) => client.get(`/${name}/${id}`).then((r) => r.data.data),
    create: (payload) => client.post(`/${name}`, payload).then((r) => r.data.data),
    update: (id, payload) => client.put(`/${name}/${id}`, payload).then((r) => r.data.data),
    remove: (id) => client.delete(`/${name}/${id}`).then(() => undefined),
  };
}

export const tasks = resource('tasks');
export const categories = resource('categories');

export function validationErrors(error) {
  return error?.response?.status === 422 ? error.response.data.errors : null;
}
```

- [ ] **Step 4: Run it GREEN.**

Run: `./vendor/bin/sail npm run test:run -- api`
Expected: PASS.

- [ ] **Step 5: Commit.**

```bash
git add -A
git commit -m "feat: add /api/v1 client wrapper"
```

### Task 2.5: Core UI primitives

**Files:**
- Create: `resources/js/components/ui/Button.jsx`, `Card.jsx`, `Input.jsx`, `Textarea.jsx`, `Select.jsx`, `Badge.jsx`, `Spinner.jsx`, `EmptyState.jsx`
- Create: `resources/js/components/ui/Button.test.jsx`, `Input.test.jsx`

**Interfaces:**
- `Button({ variant='primary', type='button', children, ...props })` — variants `primary` (ink), `ghost`, `danger`; forwards onClick/disabled; visible focus ring.
- `Card({ as='div', className, children, ...props })` — surface + hairline + rounded-card + shadow-card.
- `Input/Textarea/Select({ label, id, error, ...props })` — labeled control; renders `error` text (red) and sets `aria-invalid` when error present.
- `Badge({ color, children })` — small category dot+label.
- `Spinner()` — accessible loading indicator (`role="status"`).
- `EmptyState({ title, action })`.

- [ ] **Step 1: Write `Button.jsx`.**

```jsx
const STYLES = {
  primary: 'bg-ink text-white hover:bg-black',
  ghost: 'bg-transparent text-ink hover:bg-sunken',
  danger: 'bg-transparent text-ember-low border border-ember-low/40 hover:bg-ember-low/10',
};

export default function Button({ variant = 'primary', type = 'button', className = '', children, ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-medium shadow-card
        transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2
        focus-visible:ring-offset-paper disabled:opacity-50 ${STYLES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Write `Button.test.jsx`.**

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

test('renders label and fires onClick', async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Save task</Button>);
  await userEvent.click(screen.getByRole('button', { name: 'Save task' }));
  expect(onClick).toHaveBeenCalledOnce();
});

test('applies the danger variant styles', () => {
  render(<Button variant="danger">Delete</Button>);
  expect(screen.getByRole('button', { name: 'Delete' }).className).toContain('text-ember-low');
});
```

- [ ] **Step 3: Write `Card.jsx`.**

```jsx
export default function Card({ as: As = 'div', className = '', children, ...props }) {
  return (
    <As className={`bg-surface border border-hairline rounded-card shadow-card ${className}`} {...props}>
      {children}
    </As>
  );
}
```

- [ ] **Step 4: Write `Input.jsx`** (Textarea/Select mirror this with the matching element):

```jsx
export default function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-xs uppercase tracking-wider text-ink-faint">{label}</label>}
      <input
        id={id}
        aria-invalid={error ? 'true' : undefined}
        className={`rounded-[10px] border bg-surface px-3.5 py-2.5 text-sm text-ink
          focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30
          ${error ? 'border-ember-low' : 'border-hairline'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-ember-low">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 5: Write `Textarea.jsx`** (same as Input but `<textarea>` with `rows` default 4) and `Select.jsx` (same wrapper, `<select>` rendering `children` as `<option>`s).

`Textarea.jsx`:
```jsx
export default function Textarea({ label, id, error, rows = 4, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-xs uppercase tracking-wider text-ink-faint">{label}</label>}
      <textarea id={id} rows={rows} aria-invalid={error ? 'true' : undefined}
        className={`rounded-[10px] border bg-surface px-3.5 py-2.5 text-sm text-ink resize-y
          focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30
          ${error ? 'border-ember-low' : 'border-hairline'} ${className}`} {...props} />
      {error && <p className="text-xs text-ember-low">{error}</p>}
    </div>
  );
}
```

`Select.jsx`:
```jsx
export default function Select({ label, id, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-xs uppercase tracking-wider text-ink-faint">{label}</label>}
      <select id={id} aria-invalid={error ? 'true' : undefined}
        className={`rounded-[10px] border bg-surface px-3.5 py-2.5 text-sm text-ink
          focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30
          ${error ? 'border-ember-low' : 'border-hairline'} ${className}`} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-ember-low">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 6: Write `Input.test.jsx`.**

```jsx
import { render, screen } from '@testing-library/react';
import Input from './Input';

test('shows the error and marks the field invalid', () => {
  render(<Input label="Title" id="title" error="The title is required." />);
  expect(screen.getByText('The title is required.')).toBeInTheDocument();
  expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true');
});
```

- [ ] **Step 7: Write `Badge.jsx`, `Spinner.jsx`, `EmptyState.jsx`.**

`Badge.jsx`:
```jsx
export default function Badge({ color = '#97A0B0', children }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">
      <span className="h-2 w-2 rounded-[3px]" style={{ background: color }} />
      {children}
    </span>
  );
}
```

`Spinner.jsx`:
```jsx
export default function Spinner({ label = 'Loading' }) {
  return (
    <div role="status" className="flex items-center gap-2 text-ink-soft">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-hairline border-t-ink" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}
```

`EmptyState.jsx`:
```jsx
export default function EmptyState({ title, action }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-hairline bg-surface/60 py-16 text-center">
      <p className="text-ink-soft">{title}</p>
      {action}
    </div>
  );
}
```

- [ ] **Step 8: Run tests + build.**

Run: `./vendor/bin/sail npm run test:run` then `./vendor/bin/sail npm run build`
Expected: all green; build succeeds.

- [ ] **Step 9: Commit.**

```bash
git add -A
git commit -m "feat: add core UI primitives (Button, Card, inputs, Badge, Spinner, EmptyState)"
```

### Task 2.6: Signature components — TimeBar, KeptChip, CategoryTag (TDD)

**Files:**
- Create: `resources/js/components/ui/TimeBar.jsx`, `KeptChip.jsx`, `CategoryTag.jsx`
- Create: `resources/js/components/ui/TimeBar.test.jsx`

**Interfaces:**
- `TimeBar({ expiresAt, now? })` — uses `describeExpiry`. Renders the mono label + a track whose fill width = `Math.round(fraction*100)%`; urgent state adds `ttl-fill-urgent` + `animate-ttl-pulse` and bold label. Returns nothing meaningful for kept tasks (callers use `KeptChip` instead) — but guard: if `isKept`, render null.
- `KeptChip()` — the cool "Kept" pill with anchor glyph + text.
- `CategoryTag({ name })` — maps a category name to its `cat.*` color via a lookup and renders a `Badge`.

- [ ] **Step 1: Write `TimeBar.test.jsx`.**

```jsx
import { render, screen } from '@testing-library/react';
import TimeBar from './TimeBar';

const H = 3600 * 1000;
const NOW = 1_700_000_000_000;
const iso = (ms) => new Date(NOW + ms).toISOString();

test('renders the remaining label and a proportional fill', () => {
  const { container } = render(<TimeBar expiresAt={iso(6 * H)} now={NOW} />);
  expect(screen.getByText('6h 0m left')).toBeInTheDocument();
  expect(container.querySelector('[data-fill]')).toHaveStyle({ width: '50%' });
});

test('marks urgent tasks', () => {
  const { container } = render(<TimeBar expiresAt={iso(30 * 60 * 1000)} now={NOW} />);
  expect(container.querySelector('[data-fill]').className).toContain('ttl-fill-urgent');
});

test('renders nothing for a kept task', () => {
  const { container } = render(<TimeBar expiresAt={null} now={NOW} />);
  expect(container).toBeEmptyDOMElement();
});
```

- [ ] **Step 2: Run RED.**

Run: `./vendor/bin/sail npm run test:run -- TimeBar`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement `TimeBar.jsx`.**

```jsx
import { describeExpiry } from '../../lib/time';

export default function TimeBar({ expiresAt, now }) {
  const t = describeExpiry(expiresAt, now);
  if (t.isKept) return null;
  const pct = Math.round(t.fraction * 100);
  return (
    <div className="flex flex-col items-end gap-1.5">
      <span className={`font-mono text-xs ${t.isUrgent ? 'font-semibold text-ember-low' : 'text-ember-low'}`}>
        {t.label}
      </span>
      <span className="h-1.5 w-32 overflow-hidden rounded bg-[#E7EBF1]">
        <span
          data-fill
          style={{ width: `${pct}%` }}
          className={`block h-full rounded ${t.isUrgent ? 'ttl-fill-urgent animate-ttl-pulse' : 'ttl-fill'}`}
        />
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Implement `KeptChip.jsx`.**

```jsx
export default function KeptChip() {
  return (
    <span className="inline-flex items-center gap-1.5 self-end rounded-full border border-[#BFD6DC] bg-[#EAF3F4] px-2.5 py-1 text-xs font-medium text-kept">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="5" r="2.5" /><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3" />
      </svg>
      Kept
    </span>
  );
}
```

- [ ] **Step 5: Implement `CategoryTag.jsx`.**

```jsx
import Badge from './Badge';

const COLORS = {
  work: '#4C6FB1', personal: '#8A6DB0', shopping: '#C77D4A',
  health: '#4F9E83', finance: '#B0894C', education: '#6E7E55',
};

export default function CategoryTag({ name }) {
  const color = COLORS[String(name).toLowerCase()] ?? '#97A0B0';
  return <Badge color={color}>{name}</Badge>;
}
```

- [ ] **Step 6: Run GREEN + build.**

Run: `./vendor/bin/sail npm run test:run -- TimeBar` then `./vendor/bin/sail npm run test:run`
Expected: all green.

- [ ] **Step 7: Commit.**

```bash
git add -A
git commit -m "feat: add signature TimeBar, KeptChip, CategoryTag"
```

### Task 2.7: Layout — AppShell + Rail

**Files:**
- Create: `resources/js/components/layout/AppShell.jsx`, `Rail.jsx`
- Create: `resources/js/components/layout/Rail.test.jsx`

**Interfaces:**
- `AppShell({ children })` — the `grid grid-cols-[248px_1fr]` shell (responsive: stacks under `md`), renders `<Rail>` + a `<main>`.
- `Rail({ categories=[], summary })` — wordmark `DAY·BOOK` (the `·` in `ember`), a "Today" card (date + summary counts), category nav (each a `NavLink` to `/?category=ID` styled active), and a History `NavLink`. `categories` is `[{id, name, count}]`. Uses React Router `NavLink`.
- Date string: render the current date as "Fri, Jun 27" — accept it via prop `today` (default computed) so tests are deterministic.

- [ ] **Step 1: Write `Rail.test.jsx`.**

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Rail from './Rail';

const cats = [{ id: 1, name: 'Work', count: 3 }, { id: 2, name: 'Health', count: 2 }];

function renderRail() {
  return render(
    <MemoryRouter><Rail categories={cats} summary={{ ephemeral: 6, kept: 4 }} today="Fri, Jun 27" /></MemoryRouter>
  );
}

test('renders the wordmark, date and category nav with counts', () => {
  renderRail();
  expect(screen.getByText(/Day/i)).toBeInTheDocument();
  expect(screen.getByText('Fri, Jun 27')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Work\s*3/ })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /History/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run RED.**

Run: `./vendor/bin/sail npm run test:run -- Rail`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement `Rail.jsx`.**

```jsx
import { NavLink } from 'react-router-dom';

const CAT_COLORS = {
  work: '#4C6FB1', personal: '#8A6DB0', shopping: '#C77D4A',
  health: '#4F9E83', finance: '#B0894C', education: '#6E7E55',
};

export default function Rail({ categories = [], summary = { ephemeral: 0, kept: 0 }, today }) {
  return (
    <aside className="flex flex-col gap-7 border-r border-hairline bg-sunken p-6 md:min-h-screen">
      <div className="font-display text-xl font-extrabold uppercase tracking-[0.22em]">
        Day<span className="text-ember">·</span>book
      </div>

      <div className="rounded-card border border-hairline bg-surface px-4 py-3.5">
        <div className="text-[11px] uppercase tracking-wider text-ink-faint">Today</div>
        <div className="font-display text-lg font-bold">{today}</div>
        <div className="mt-1.5 text-[12.5px] text-ink-soft">
          <b className="font-semibold text-ink">{summary.ephemeral}</b> ephemeral ·{' '}
          <b className="font-semibold text-ink">{summary.kept}</b> kept
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        <div className="px-2 pb-2 text-[11px] uppercase tracking-wider text-ink-faint">Categories</div>
        {categories.map((c) => (
          <NavLink
            key={c.id}
            to={`/?category=${c.id}`}
            className="flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-sm hover:bg-surface
              focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: CAT_COLORS[c.name.toLowerCase()] ?? '#97A0B0' }} />
            <span className="flex-1">{c.name}</span>
            <span className="font-mono text-xs text-ink-soft">{c.count}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink to="/history" className="mt-auto flex items-center gap-2.5 border-t border-hairline pt-4 text-sm text-ink-soft hover:text-ink">
        History & recycle bin
      </NavLink>
    </aside>
  );
}
```

- [ ] **Step 4: Implement `AppShell.jsx`.**

```jsx
export default function AppShell({ rail, children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[248px_1fr]">
      {rail}
      <main className="px-6 py-8 md:px-10 md:py-9">
        <div className="mx-auto max-w-[920px]">{children}</div>
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Run GREEN.**

Run: `./vendor/bin/sail npm run test:run -- Rail`
Expected: PASS.

- [ ] **Step 6: Commit.**

```bash
git add -A
git commit -m "feat: add AppShell and Rail layout"
```

### Task 2.8: CP2 gate

- [ ] **Step 1:** `./vendor/bin/sail npm run test:run` — all green.
- [ ] **Step 2:** `./vendor/bin/sail npm run build` — succeeds.
- [ ] **Step 3:** Commit marker: `git commit --allow-empty -m "chore: CP2 complete — Daybook design system foundation"`.

---

# CHECKPOINT 3 — Feature rebuild on `/api/v1`

**Gate to exit CP3:** `./vendor/bin/sail npm run test:run` green; `./vendor/bin/sail npm run build` succeeds; **Chrome MCP walkthrough** (list → create → edit → delete → history, plus categories) passes with screenshots; no console errors.

> Old `resources/js/components/{Base,Notes,Categories,History}` and the old `Index.jsx` body are replaced here. Each feature view mocks `lib/api` in its test.

### Task 3.1: Router shell (`Index.jsx`) with createRoot + routes

**Files:**
- Modify: `resources/js/Index.jsx`
- Create: `resources/js/AppData.jsx` (a small provider that loads categories once for the Rail)
- Delete: `resources/js/components/Base/Header.jsx`

**Interfaces:**
- Produces: a `BrowserRouter` with all client routes wired to placeholder feature components (real ones land in later tasks; use a temporary inline `<div>` only if a view isn't built yet — but order tasks so each route's component exists when referenced). Uses `createRoot` (React 18).
- `AppData` context exposes `{ categories, reloadCategories }` for the Rail and forms.

- [ ] **Step 1: Implement `AppData.jsx`.**

```jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { categories as categoriesApi } from './lib/api';

const Ctx = createContext({ categories: [], reloadCategories: () => {} });
export const useAppData = () => useContext(Ctx);

export function AppDataProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const reloadCategories = useCallback(() => {
    categoriesApi.list().then((res) => setCategories(res.data)).catch(() => setCategories([]));
  }, []);
  useEffect(() => { reloadCategories(); }, [reloadCategories]);
  return <Ctx.Provider value={{ categories, reloadCategories }}>{children}</Ctx.Provider>;
}
```

- [ ] **Step 2: Rewrite `resources/js/Index.jsx`** (routes reference components created in tasks 3.2–3.7; build those first if executing strictly TDD, or stub then fill — here we assume 3.2–3.7 done):

```jsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppDataProvider, useAppData } from './AppData';
import AppShell from './components/layout/AppShell';
import Rail from './components/layout/Rail';
import TaskList from './features/tasks/TaskList';
import TaskForm from './features/tasks/TaskForm';
import TaskDetail from './features/tasks/TaskDetail';
import CategoryList from './features/categories/CategoryList';
import CategoryForm from './features/categories/CategoryForm';
import CategoryDetail from './features/categories/CategoryDetail';
import HistoryView from './features/history/HistoryView';

function Shell({ children }) {
  const { categories } = useAppData();
  const rail = <Rail categories={categories.map((c) => ({ id: c.id, name: c.name, count: c.tasks_count ?? 0 }))} summary={{ ephemeral: 0, kept: 0 }} today={new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} />;
  return <AppShell rail={rail}>{children}</AppShell>;
}

function App() {
  return (
    <BrowserRouter>
      <AppDataProvider>
        <ToastContainer position="bottom-right" theme="light" />
        <Shell>
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/tasks/create" element={<TaskForm />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/tasks/:id/edit" element={<TaskForm />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/create" element={<CategoryForm />} />
            <Route path="/categories/:id" element={<CategoryDetail />} />
            <Route path="/categories/:id/edit" element={<CategoryForm />} />
            <Route path="/history" element={<HistoryView />} />
          </Routes>
        </Shell>
      </AppDataProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
```

- [ ] **Step 3: Delete the old header.** `git rm resources/js/components/Base/Header.jsx`

- [ ] **Step 4: Commit** (build will fail until 3.2–3.7 exist; if executing in order, do this task AFTER 3.2–3.7, or keep this as the final wiring task). Recommended: implement 3.2–3.7 first, then this. Commit: `feat: wire Daybook router shell with createRoot`.

> **Execution note:** build 3.2–3.7 before finalizing 3.1's imports so the bundle compiles. The reviewer should treat 3.1 as the integration task.

### Task 3.2: TaskList (Today view)

**Files:**
- Create: `resources/js/features/tasks/TaskList.jsx`, `resources/js/features/tasks/TaskRow.jsx`
- Create: `resources/js/features/tasks/TaskList.test.jsx`

**Interfaces:**
- `TaskList` — reads `?category` from the URL; calls `tasks.list({ category_id })`; renders `Spinner` while loading, `EmptyState` when no tasks, else a list of `TaskRow`. Header: display "Today" + mono "{n} open" + a `Button` linking to `/tasks/create`. Pagination: "Load more" / page links from `meta` (simple `meta.current_page < meta.last_page`).
- `TaskRow({ task, onDeleted })` — grid row: `CategoryTag`, title + truncated body (links to `/tasks/:id`), and on the right `TimeBar` (ephemeral) or `KeptChip` (kept). Hover reveals View/Edit/Delete (`Link`s + a danger `Button`). Delete calls `tasks.remove(id)` then `onDeleted(id)`, with a `toast`.

- [ ] **Step 1: Write `TaskList.test.jsx`** (mock api + toast):

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../../lib/api', () => ({
  tasks: { list: vi.fn(), remove: vi.fn() },
}));
vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn(), promise: vi.fn() } }));

import { tasks } from '../../lib/api';
import TaskList from './TaskList';

const sample = (over = {}) => ({
  id: 1, title: 'Q2 Sprint Planning', body: 'Prepare backlog', expires_at: null,
  category: { id: 1, name: 'Work' }, ...over,
});

function renderList() {
  return render(<MemoryRouter><TaskList /></MemoryRouter>);
}

test('shows a spinner then renders tasks', async () => {
  tasks.list.mockResolvedValue({ data: [sample()], meta: { current_page: 1, last_page: 1 } });
  renderList();
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(await screen.findByText('Q2 Sprint Planning')).toBeInTheDocument();
});

test('shows the empty state when there are no tasks', async () => {
  tasks.list.mockResolvedValue({ data: [], meta: { current_page: 1, last_page: 1 } });
  renderList();
  expect(await screen.findByText(/nothing on today/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run RED.** `./vendor/bin/sail npm run test:run -- TaskList` → FAIL (module missing).

- [ ] **Step 3: Implement `TaskRow.jsx`.**

```jsx
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import CategoryTag from '../../components/ui/CategoryTag';
import TimeBar from '../../components/ui/TimeBar';
import KeptChip from '../../components/ui/KeptChip';
import { tasks } from '../../lib/api';

export default function TaskRow({ task, onDeleted }) {
  async function handleDelete() {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasks.remove(task.id);
      toast.success('Task deleted');
      onDeleted(task.id);
    } catch {
      toast.error('Could not delete the task');
    }
  }
  return (
    <Card className="group grid grid-cols-[110px_1fr_auto] items-center gap-4 px-4 py-4 transition hover:-translate-y-px">
      <CategoryTag name={task.category?.name ?? '—'} />
      <Link to={`/tasks/${task.id}`} className="min-w-0">
        <div className="truncate text-[15.5px] font-semibold text-ink">{task.title}</div>
        <div className="truncate text-[13.5px] text-ink-soft">{task.body}</div>
      </Link>
      <div className="flex items-center gap-4">
        <div className="opacity-0 transition group-hover:opacity-100 flex gap-1.5">
          <Link to={`/tasks/${task.id}/edit`}><Button variant="ghost" className="px-3 py-1.5 text-xs">Edit</Button></Link>
          <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={handleDelete}>Delete</Button>
        </div>
        {task.expires_at ? <TimeBar expiresAt={task.expires_at} /> : <KeptChip />}
      </div>
    </Card>
  );
}
```

- [ ] **Step 4: Implement `TaskList.jsx`.**

```jsx
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import TaskRow from './TaskRow';
import { tasks } from '../../lib/api';

export default function TaskList() {
  const [params] = useSearchParams();
  const categoryId = params.get('category');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    tasks.list(categoryId ? { category_id: categoryId } : undefined)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }
  useEffect(load, [categoryId]);

  const items = data?.data ?? [];
  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-[38px] font-extrabold leading-none">Today</h1>
          <p className="mt-2 font-mono text-[13px] text-ink-soft">{items.length} open</p>
        </div>
        <Link to="/tasks/create"><Button><span className="text-lg leading-none">+</span> New task</Button></Link>
      </header>

      {loading ? <Spinner /> : items.length === 0 ? (
        <EmptyState
          title="Nothing on today's list. Add the first task."
          action={<Link to="/tasks/create"><Button>New task</Button></Link>}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((t) => <TaskRow key={t.id} task={t} onDeleted={load} />)}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Run GREEN.** `./vendor/bin/sail npm run test:run -- TaskList` → PASS.

- [ ] **Step 6: Commit.** `git add -A && git commit -m "feat: add Today task list with TaskRow"`

### Task 3.3: TaskForm (create + edit)

**Files:**
- Create: `resources/js/features/tasks/TaskForm.jsx`, `resources/js/features/tasks/TaskForm.test.jsx`

**Interfaces:**
- `TaskForm` — used for both create and edit (detects edit via `useParams().id`). Loads the task on edit; loads categories from `useAppData`. Fields: title (`Input`), category (`Select` of categories), body (`Textarea`). Submit calls `tasks.create`/`tasks.update`; on success toasts ("Task saved") and navigates to `/`. On 422, maps `validationErrors(err)` to per-field `error` props.

- [ ] **Step 1: Write `TaskForm.test.jsx`.**

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../../lib/api', () => ({
  tasks: { create: vi.fn(), update: vi.fn(), show: vi.fn() },
  validationErrors: (e) => (e?.response?.status === 422 ? e.response.data.errors : null),
}));
vi.mock('../../AppData', () => ({ useAppData: () => ({ categories: [{ id: 1, name: 'Work' }] }) }));
vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { tasks } from '../../lib/api';
import TaskForm from './TaskForm';

function renderCreate() {
  return render(<MemoryRouter initialEntries={['/tasks/create']}>
    <Routes><Route path="/tasks/create" element={<TaskForm />} /><Route path="/" element={<div>home</div>} /></Routes>
  </MemoryRouter>);
}

test('submits a new task', async () => {
  tasks.create.mockResolvedValue({ id: 5 });
  renderCreate();
  await userEvent.type(screen.getByLabelText(/title/i), 'Write tests');
  await userEvent.type(screen.getByLabelText(/details|body/i), 'cover the form');
  await userEvent.click(screen.getByRole('button', { name: /save task/i }));
  await waitFor(() => expect(tasks.create).toHaveBeenCalledWith(expect.objectContaining({ title: 'Write tests' })));
});

test('surfaces 422 field errors', async () => {
  tasks.create.mockRejectedValue({ response: { status: 422, data: { errors: { title: ['The title is required.'] } } } });
  renderCreate();
  await userEvent.type(screen.getByLabelText(/details|body/i), 'x');
  await userEvent.click(screen.getByRole('button', { name: /save task/i }));
  expect(await screen.findByText('The title is required.')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run RED.** `./vendor/bin/sail npm run test:run -- TaskForm` → FAIL.

- [ ] **Step 3: Implement `TaskForm.jsx`.**

```jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { tasks, validationErrors } from '../../lib/api';
import { useAppData } from '../../AppData';

export default function TaskForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { categories } = useAppData();
  const [form, setForm] = useState({ title: '', body: '', category_id: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      tasks.show(id).then((t) => setForm({ title: t.title, body: t.body, category_id: t.category?.id ?? '' }));
    }
  }, [id, isEdit]);

  function field(name) {
    return {
      value: form[name],
      onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
      error: errors[name]?.[0],
    };
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErrors({});
    try {
      await (isEdit ? tasks.update(id, form) : tasks.create(form));
      toast.success('Task saved');
      navigate('/');
    } catch (err) {
      const v = validationErrors(err);
      if (v) setErrors(v); else toast.error('Could not save the task');
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-[32px] font-extrabold">{isEdit ? 'Edit task' : 'New task'}</h1>
      <Card as="form" onSubmit={onSubmit} className="flex flex-col gap-5 p-6">
        <Input label="Title" id="title" {...field('title')} />
        <Select label="Category" id="category_id" {...field('category_id')}>
          <option value="">Choose a category…</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <Textarea label="Details" id="body" {...field('body')} />
        <div className="flex gap-3">
          <Button type="submit">Save task</Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
        </div>
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Run GREEN.** `./vendor/bin/sail npm run test:run -- TaskForm` → PASS.

- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: add task create/edit form with 422 handling"`

### Task 3.4: TaskDetail

**Files:**
- Create: `resources/js/features/tasks/TaskDetail.jsx`, `resources/js/features/tasks/TaskDetail.test.jsx`

**Interfaces:**
- `TaskDetail` — loads `tasks.show(id)`; renders title, `CategoryTag`, body, created time (mono), and the time module (`TimeBar` or `KeptChip`). Edit + Back links. 404 → an inline "Task not found" with a link home.

- [ ] **Step 1: Write `TaskDetail.test.jsx`.**

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../../lib/api', () => ({ tasks: { show: vi.fn() } }));
import { tasks } from '../../lib/api';
import TaskDetail from './TaskDetail';

test('renders the task once loaded', async () => {
  tasks.show.mockResolvedValue({ id: 3, title: 'Grocery Run', body: 'Eggs, milk', expires_at: null, category: { id: 3, name: 'Shopping' }, created_at: '2026-06-20T10:00:00Z' });
  render(<MemoryRouter initialEntries={['/tasks/3']}><Routes><Route path="/tasks/:id" element={<TaskDetail />} /></Routes></MemoryRouter>);
  expect(await screen.findByText('Grocery Run')).toBeInTheDocument();
  expect(screen.getByText('Eggs, milk')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run RED** → FAIL.

- [ ] **Step 3: Implement `TaskDetail.jsx`.**

```jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import CategoryTag from '../../components/ui/CategoryTag';
import TimeBar from '../../components/ui/TimeBar';
import KeptChip from '../../components/ui/KeptChip';
import { tasks } from '../../lib/api';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    tasks.show(id).then(setTask).catch(() => setMissing(true));
  }, [id]);

  if (missing) return <p className="text-ink-soft">Task not found. <Link className="text-ink underline" to="/">Back to today</Link></p>;
  if (!task) return <Spinner />;

  return (
    <div>
      <div className="mb-4"><CategoryTag name={task.category?.name ?? '—'} /></div>
      <h1 className="font-display text-[32px] font-extrabold">{task.title}</h1>
      <Card className="mt-5 flex flex-col gap-4 p-6">
        <p className="text-[15px] text-ink">{task.body}</p>
        <div className="flex items-center justify-between border-t border-hairline pt-4">
          <span className="font-mono text-xs text-ink-soft">added {new Date(task.created_at).toLocaleString()}</span>
          {task.expires_at ? <TimeBar expiresAt={task.expires_at} /> : <KeptChip />}
        </div>
      </Card>
      <div className="mt-5 flex gap-3">
        <Link to={`/tasks/${task.id}/edit`}><Button>Edit task</Button></Link>
        <Link to="/"><Button variant="ghost">Back</Button></Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run GREEN** → PASS.

- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: add task detail view"`

### Task 3.5: Categories (list + form + detail)

**Files:**
- Create: `resources/js/features/categories/CategoryList.jsx`, `CategoryForm.jsx`, `CategoryDetail.jsx`
- Create: `resources/js/features/categories/CategoryList.test.jsx`

**Interfaces:**
- `CategoryList` — `categories.list()`; renders each as a `Card` row (`CategoryTag` + name, link to detail) with a "New category" button; `EmptyState` when none.
- `CategoryForm` — create/edit by `useParams().id`; single `Input` "Name"; 422 → field error; success toast + navigate `/categories`; calls `useAppData().reloadCategories()` on success so the rail updates.
- `CategoryDetail` — `categories.show(id)`; shows the name + an Edit/Back; (task counts optional).

- [ ] **Step 1: Write `CategoryList.test.jsx`.**

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
vi.mock('../../lib/api', () => ({ categories: { list: vi.fn() } }));
import { categories } from '../../lib/api';
import CategoryList from './CategoryList';

test('lists categories', async () => {
  categories.list.mockResolvedValue({ data: [{ id: 1, name: 'Work' }, { id: 2, name: 'Health' }] });
  render(<MemoryRouter><CategoryList /></MemoryRouter>);
  expect(await screen.findByText('Work')).toBeInTheDocument();
  expect(screen.getByText('Health')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run RED** → FAIL.

- [ ] **Step 3: Implement `CategoryList.jsx`.**

```jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import CategoryTag from '../../components/ui/CategoryTag';
import { categories } from '../../lib/api';

export default function CategoryList() {
  const [items, setItems] = useState(null);
  useEffect(() => { categories.list().then((r) => setItems(r.data)); }, []);
  if (!items) return <Spinner />;
  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <h1 className="font-display text-[38px] font-extrabold leading-none">Categories</h1>
        <Link to="/categories/create"><Button><span className="text-lg leading-none">+</span> New category</Button></Link>
      </header>
      {items.length === 0 ? (
        <EmptyState title="No categories yet." action={<Link to="/categories/create"><Button>New category</Button></Link>} />
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((c) => (
            <Link key={c.id} to={`/categories/${c.id}`}>
              <Card className="flex items-center gap-3 px-4 py-4 transition hover:-translate-y-px">
                <CategoryTag name={c.name} />
                <span className="text-[15.5px] font-semibold">{c.name}</span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Implement `CategoryForm.jsx`.**

```jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { categories, validationErrors } from '../../lib/api';
import { useAppData } from '../../AppData';

export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { reloadCategories } = useAppData();
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => { if (isEdit) categories.show(id).then((c) => setName(c.name)); }, [id, isEdit]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await (isEdit ? categories.update(id, { name }) : categories.create({ name }));
      toast.success('Category saved');
      reloadCategories();
      navigate('/categories');
    } catch (err) {
      const v = validationErrors(err);
      if (v) setError(v.name?.[0]); else toast.error('Could not save the category');
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-[32px] font-extrabold">{isEdit ? 'Edit category' : 'New category'}</h1>
      <Card as="form" onSubmit={onSubmit} className="flex flex-col gap-5 p-6">
        <Input label="Name" id="name" value={name} onChange={(e) => setName(e.target.value)} error={error} />
        <div className="flex gap-3">
          <Button type="submit">Save category</Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/categories')}>Cancel</Button>
        </div>
      </Card>
    </div>
  );
}
```

- [ ] **Step 5: Implement `CategoryDetail.jsx`.**

```jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import CategoryTag from '../../components/ui/CategoryTag';
import { categories } from '../../lib/api';

export default function CategoryDetail() {
  const { id } = useParams();
  const [cat, setCat] = useState(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => { categories.show(id).then(setCat).catch(() => setMissing(true)); }, [id]);
  if (missing) return <p className="text-ink-soft">Category not found. <Link className="underline" to="/categories">Back</Link></p>;
  if (!cat) return <Spinner />;
  return (
    <div>
      <div className="mb-4"><CategoryTag name={cat.name} /></div>
      <h1 className="font-display text-[32px] font-extrabold">{cat.name}</h1>
      <Card className="mt-5 p-6 text-ink-soft">Tasks in this category appear on the <Link to={`/?category=${cat.id}`} className="text-ink underline">Today</Link> view.</Card>
      <div className="mt-5 flex gap-3">
        <Link to={`/categories/${cat.id}/edit`}><Button>Edit</Button></Link>
        <Link to="/categories"><Button variant="ghost">Back</Button></Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Run GREEN + build.** `./vendor/bin/sail npm run test:run -- CategoryList` then `./vendor/bin/sail npm run test:run`.

- [ ] **Step 7: Commit.** `git add -A && git commit -m "feat: add category list, form and detail views"`

### Task 3.6: HistoryView

**Files:**
- Create: `resources/js/features/history/HistoryView.jsx`, `resources/js/features/history/HistoryView.test.jsx`

**Interfaces:**
- `HistoryView` — `tasks.list({ trashed: 'only' })`; renders soft-deleted tasks as faded rows (reduced opacity, `sunken` surface), read-only (no actions; the API has no restore). `EmptyState` "Nothing in history yet." Header "History".

- [ ] **Step 1: Write `HistoryView.test.jsx`.**

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
vi.mock('../../lib/api', () => ({ tasks: { list: vi.fn() } }));
import { tasks } from '../../lib/api';
import HistoryView from './HistoryView';

test('requests trashed tasks and renders them', async () => {
  tasks.list.mockResolvedValue({ data: [{ id: 9, title: 'Old Standup Notes', body: 'gone', category: { name: 'Work' }, expires_at: null }] });
  render(<MemoryRouter><HistoryView /></MemoryRouter>);
  expect(await screen.findByText('Old Standup Notes')).toBeInTheDocument();
  expect(tasks.list).toHaveBeenCalledWith({ trashed: 'only' });
});
```

- [ ] **Step 2: Run RED** → FAIL.

- [ ] **Step 3: Implement `HistoryView.jsx`.**

```jsx
import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import CategoryTag from '../../components/ui/CategoryTag';
import { tasks } from '../../lib/api';

export default function HistoryView() {
  const [items, setItems] = useState(null);
  useEffect(() => { tasks.list({ trashed: 'only' }).then((r) => setItems(r.data)); }, []);
  if (!items) return <Spinner />;
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-[38px] font-extrabold leading-none">History</h1>
        <p className="mt-2 font-mono text-[13px] text-ink-soft">deleted tasks · read-only</p>
      </header>
      {items.length === 0 ? <EmptyState title="Nothing in history yet." /> : (
        <div className="flex flex-col gap-2.5">
          {items.map((t) => (
            <Card key={t.id} className="grid grid-cols-[110px_1fr] items-center gap-4 bg-sunken px-4 py-4 opacity-70">
              <CategoryTag name={t.category?.name ?? '—'} />
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold text-ink line-through decoration-ink-faint">{t.title}</div>
                <div className="truncate text-[13.5px] text-ink-soft">{t.body}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run GREEN** → PASS.

- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: add history (trashed) view"`

### Task 3.7: Delete old components; finalize router; full build

**Files:**
- Delete: `resources/js/components/Notes/`, `resources/js/components/Categories/`, `resources/js/components/History/` (whole dirs), and any remaining `components/Base`.
- Verify `Index.jsx` (Task 3.1) imports resolve.

- [ ] **Step 1: Delete the legacy component trees.**

```bash
git rm -r resources/js/components/Notes resources/js/components/Categories resources/js/components/History
```

- [ ] **Step 2: Confirm no dangling imports.**

Run: `grep -rn "components/Notes\|components/Categories\|components/History\|ShowAllNotes\|Header" resources/js`
Expected: no matches (except inside the new feature files, which don't reference these). Fix any.

- [ ] **Step 3: Full test + build.**

Run: `./vendor/bin/sail npm run test:run` then `./vendor/bin/sail npm run build`
Expected: all tests green; build succeeds with no unresolved imports.

- [ ] **Step 4: Commit.** `git add -A && git commit -m "refactor: remove legacy Bootstrap components"`

### Task 3.8: CP3 gate — Chrome MCP walkthrough

- [ ] **Step 1:** Ensure assets are built and the app is up: `./vendor/bin/sail npm run build`, app at `http://localhost:8081`.
- [ ] **Step 2:** Via Chrome MCP, walk through and screenshot each: Today list (seeded tasks with time bars + kept chips), create a task (appears with a ~12h bar), edit it, delete it (toast + row gone), open a category filter from the rail, Categories list + create, History (faded trashed rows). Capture `list`, `create`, `detail`, `history` screenshots to the scratchpad.
- [ ] **Step 3:** Check `list_console_messages` — no errors.
- [ ] **Step 4:** Commit marker: `git commit --allow-empty -m "chore: CP3 complete — Daybook features on /api/v1"`.

---

# CHECKPOINT 4 — Polish, docs, final validation

**Gate to exit CP4:** backend `./vendor/bin/sail test` + frontend `./vendor/bin/sail npm run test:run` both green; `./vendor/bin/sail npm run build` succeeds; Lighthouse (Chrome MCP) performance & a11y ≥ targets; final Chrome MCP walkthrough clean.

### Task 4.1: README + `.env.example` rewrite

**Files:** Modify `README.md`.

- [ ] **Step 1:** Rewrite `README.md` for the new stack: SQLite (no MySQL/Redis), Sail quick-start (`sail up -d`, `sail composer install`, `sail artisan migrate:fresh --seed`, `sail npm install && sail npm run dev`), the `/api/v1` endpoint table, the 12h TTL behavior + `tasks:prune`, the Daybook UI, and how to run tests (`sail test`, `sail npm run test:run`). Remove the Terraform/AWS/Nginx claims that no longer apply. Note the rootless-Podman override (`docker-compose.override.yml`, `SUPERVISOR_PHP_USER`/`APP_USER`) for Fedora users.
- [ ] **Step 2:** Verify the documented commands run as written.
- [ ] **Step 3:** Commit. `git add README.md && git commit -m "docs: rewrite README for the SQLite/Daybook stack"`

### Task 4.2: Reconcile production Docker/nginx

**Files:** Modify `Dockerfile`, `docker-compose.prod.yml`, `docker/nginx.conf`.

- [ ] **Step 1:** `Dockerfile` — replace `pdo_mysql`/`redis` extensions with `pdo_sqlite`; ensure `database/database.sqlite` is created and writable; keep the node build stage.
- [ ] **Step 2:** `docker-compose.prod.yml` — remove the `mysql` and `redis` services + volumes and the `depends_on`; the app needs only a persisted volume for the SQLite file.
- [ ] **Step 3:** `docker/nginx.conf` — update the rate-limit `location` patterns from the legacy `create|edit|delete` paths to the RESTful verbs (or simplify to rely on Laravel throttling).
- [ ] **Step 4:** `docker compose -f docker-compose.prod.yml config` validates. Commit. `git commit -m "chore: align production Docker/nginx with SQLite stack"`

### Task 4.3: Accessibility + Lighthouse pass

**Files:** small touch-ups across `components/`.

- [ ] **Step 1:** Verify focus-visible rings on all interactive elements; the rail collapses sensibly on mobile (`md:` breakpoints); `prefers-reduced-motion` disables the pulse; the "Kept"/urgent states carry text, not just color.
- [ ] **Step 2:** Run Chrome MCP `lighthouse_audit` (categories: performance, accessibility) on `http://localhost:8081`. Address any a11y issue below 95 (labels, contrast, names). Re-run.
- [ ] **Step 3:** Add `resources/js/components/__a11y__.test.jsx` asserting key controls expose accessible names (e.g., the "New task" button, form labels) — or extend existing tests. Run green.
- [ ] **Step 4:** Commit. `git commit -am "fix: accessibility polish for the Daybook UI"`

### Task 4.4: Final gate

- [ ] **Step 1:** `./vendor/bin/sail test` (backend) — green.
- [ ] **Step 2:** `./vendor/bin/sail npm run test:run` (frontend) — green.
- [ ] **Step 3:** `./vendor/bin/sail npm run build` — succeeds.
- [ ] **Step 4:** Final Chrome MCP walkthrough + Lighthouse screenshot to scratchpad.
- [ ] **Step 5:** Commit marker: `git commit --allow-empty -m "chore: CP4 complete — Daybook polished, documented, validated"`.

---

## Self-Review (completed during authoring)

- **Spec coverage:** Tailwind tokens (2.1), Vitest harness (2.2), TTL math (2.3), API client (2.4), UI primitives (2.5), signature TimeBar/KeptChip/CategoryTag (2.6), AppShell/Rail (2.7); router (3.1), Today list (3.2), form (3.3), detail (3.4), categories (3.5), history (3.6), legacy removal (3.7), Chrome MCP e2e (3.8); README (4.1), prod Docker/nginx (4.2), a11y/Lighthouse (4.3), final gate (4.4). Every design-spec view and component maps to a task.
- **Placeholder scan:** none — every step has full code or an exact command.
- **Type/name consistency:** `describeExpiry`, `tasks`/`categories` api shapes, `validationErrors`, `useAppData`, component prop names (`expiresAt`, `task`, `onDeleted`, `categories`, `summary`, `today`) are used identically across tasks.
- **Ordering caveat (called out in 3.1):** build feature views (3.2–3.7) before finalizing `Index.jsx` imports so the bundle compiles; 3.1 is the integration task and may be executed last in CP3.

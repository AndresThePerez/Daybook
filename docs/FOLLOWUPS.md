# Follow-ups & known notes

A running list of items flagged during the modernization that were intentionally
deferred (not bugs blocking the PR). Grouped by area. Nothing here is required for
the app to work; each is a small improvement or an ops note to keep in mind.

## Ops / deployment

- **First production deploy needs a migrate.** `docker-compose.prod.yml` persists the
  SQLite file in the `sqlite-data` named volume mounted at `/var/www/html/database`,
  which shadows the file baked into the image. Run `php artisan migrate --force`
  (and optionally `--seed`) on the first deploy to initialize the DB in the volume.
- **Local rootless-Podman / SELinux override is intentionally uncommitted.** Running
  Sail on this Fedora workstation uses a local, git-ignored `docker-compose.override.yml`
  (`SUPERVISOR_PHP_USER=root`) plus `APP_USER=root` and the `APP_PORT=8081`/`VITE_PORT=5174`
  overrides in `.env`. These are temporary/local; the canonical values (ports 80/5173,
  default user) live in `.env.example` and the committed `docker-compose.yml`. Revert by
  deleting the override file and the extra `.env` lines.

## Backend (small, non-blocking — from the final review)

- **Uniqueness validation sees hidden rows.** `Rule::unique('tasks','title')` and
  `unique('categories','name')` check against soft-deleted *and* TTL-expired rows that the
  UI hides. A user can get "title already taken" for a title that looks unused. Consider
  scoping the rule (`->whereNull('deleted_at')` and/or excluding expired) or documenting it.
  Hourly prune mitigates the expired case.
- **`exists:categories,id` ignores soft-deletes** — a task can be attached to a
  soft-deleted category. Edge case.
- **`TaskResource` uses `whenLoaded('category')` while `Task::$with = ['category']`** always
  eager-loads it, so the conditional never short-circuits. Harmless, but if `$with` is ever
  removed the category would silently vanish from responses.
- **No rate-limit/throttle test.** `throttle:api` (60/min) and `throttle:api-write` (15/min)
  are wired but not covered by a test. (`TestCase::setUp()` flushes the cache so throttle
  counters don't bleed across tests — adding a throttle test would need enough requests
  within one test to trip the limit.)
- **`CategoryController@index` has no filters** (`?category_id`/`?trashed=only`) the way
  `TaskController@index` does — an intentional asymmetry, not required by the spec.
- **Test hygiene nits:** `test_missing_resource_uses_json_envelope` hardcodes `/api/v1/tasks/999`
  (safe under `RefreshDatabase`); the 422-envelope test asserts the shape but not the absence
  of unexpected error keys. Controller action methods lack explicit return-type hints (stylistic).
- **Migration files carry an executable bit** — a pre-existing repo-wide quirk; the two new
  migrations are correct (`100644`). A repo-wide `chmod -x` on `database/migrations/*.php`
  would tidy it.

## Frontend (already addressed — recorded for context)

These were flagged during the walkthrough and **fixed** in CP4 polish; listed so the history
is clear:

- Category-list rows now show a colored dot + bold name (were chip-only).
- Rail category counts + "open today" total now refresh live after create/delete
  (`reloadCategories()` from `AppData`), not just on full reload.
- Today list shows a small legend (time-left vs. kept).
- Accessibility contrast tokens darkened (`ink-soft`, `ink-faint`, `ember-low`) →
  Lighthouse Accessibility/Best-Practices/SEO all 100; added meta description + favicon.

## Possible next features (ideas, not committed to)

- A "restore from history" action (the API currently has no un-delete endpoint; History is
  read-only).
- A real ephemeral/kept split in the rail summary (currently shows a single total).
- A summary/counts endpoint so the rail doesn't derive totals from the categories list.
